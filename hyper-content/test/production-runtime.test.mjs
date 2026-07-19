import assert from "node:assert/strict";
import test from "node:test";

import {
  EnvironmentSecretSource,
  PostgresProductionStore,
  buildOutboxRecord,
  buildReceipt,
  processNextOutbox,
  reconcileNextAmbiguous,
  verifyIdentityClaims,
} from "../dist/production-runtime.js";

class MemoryStore {
  outbox = new Map();
  receipts = new Map();
  deadLetters = new Map();
  async enqueue(input) {
    const existing = [...this.outbox.values()].find((record) => record.idempotencyKey === input.idempotencyKey);
    if (existing) return structuredClone(existing);
    const now = "2026-07-19T12:00:00.000Z";
    const record = { ...structuredClone(input), status:"pending", attempts:0, nextAttemptAt:now, createdAt:now, updatedAt:now };
    this.outbox.set(record.id, record);
    return structuredClone(record);
  }
  async claimNext(workerId, now, leaseMs) { return this.claim("pending", workerId, now, leaseMs); }
  async claimAmbiguous(workerId, now, leaseMs) { return this.claim("ambiguous", workerId, now, leaseMs); }
  async claim(status, workerId, now, leaseMs) {
    const record = [...this.outbox.values()].find((candidate) => candidate.status === status && candidate.nextAttemptAt <= now && (!candidate.leaseExpiresAt || candidate.leaseExpiresAt < now));
    if (!record) return undefined;
    Object.assign(record, { status:"dispatching", attempts:record.attempts+1, leaseOwner:workerId, leaseExpiresAt:new Date(Date.parse(now)+leaseMs).toISOString(), updatedAt:now });
    return structuredClone(record);
  }
  async markPending(id,error,nextAttemptAt) { Object.assign(this.outbox.get(id), { status:"pending", lastError:error, nextAttemptAt, leaseOwner:undefined, leaseExpiresAt:undefined }); }
  async markAmbiguous(id,error,providerReceiptId) { Object.assign(this.outbox.get(id), { status:"ambiguous", lastError:error, providerReceiptId, leaseOwner:undefined, leaseExpiresAt:undefined }); }
  async commitSuccess(id,receipt) {
    const existing = this.receipts.get(receipt.idempotencyKey);
    if (existing && existing.receiptHash !== receipt.receiptHash) throw new Error("receipt conflict");
    this.receipts.set(receipt.idempotencyKey, structuredClone(receipt));
    Object.assign(this.outbox.get(id), { status:"succeeded", providerReceiptId:receipt.providerReceiptId, leaseOwner:undefined, leaseExpiresAt:undefined });
  }
  async moveToDeadLetter(id,reason) {
    const source=this.outbox.get(id); const now="2026-07-19T12:00:10.000Z";
    const record={ id:`dead:${id}`, outboxId:id, tenantId:source.tenantId, reason, operatorState:"open", createdAt:now, updatedAt:now };
    this.deadLetters.set(id,record); Object.assign(source,{status:"dead-letter",lastError:reason}); return structuredClone(record);
  }
  async getReceiptByIdempotencyKey(key) { const value=this.receipts.get(key); return value ? structuredClone(value) : undefined; }
  async getOutbox(id) { const value=this.outbox.get(id); return value ? structuredClone(value) : undefined; }
}

const options = { workerId:"worker-1", leaseMs:5_000, timeoutMs:1_000, baseRetryMs:100, now:()=>new Date("2026-07-19T12:00:00.000Z") };
function input(maximumAttempts=3) { return buildOutboxRecord({ tenantId:"tenant-1", actorId:"actor-1", actionId:"send-estimate", approvalId:"approval-1", approvalEpoch:2, connector:"email", payload:{to:"customer@example.com",estimateId:"est-1"}, maximumAttempts }); }

test("unknown dispatch outcome is never blindly retried and requires reconciliation", async () => {
  const store=new MemoryStore(); const record=await store.enqueue(input()); let dispatches=0;
  const connector={ name:"email", async dispatch(){ dispatches++; return { outcome:"unknown", providerReceiptId:"provider-unknown", error:"timeout after dispatch" }; }, async reconcile(){ return { outcome:"pending", providerReceiptId:"provider-unknown" }; } };
  assert.equal(await processNextOutbox(store,connector,options),"ambiguous");
  assert.equal(dispatches,1);
  assert.equal((await store.getOutbox(record.id)).status,"ambiguous");
  assert.equal(await processNextOutbox(store,connector,options),"idle");
  assert.equal(dispatches,1);
  assert.equal(await reconcileNextAmbiguous(store,connector,options),"pending");
  assert.equal(dispatches,1);
});

test("provider-confirmed absence permits bounded retry and later durable success", async () => {
  const store=new MemoryStore(); const record=await store.enqueue(input()); let dispatches=0; let reconciles=0;
  const connector={
    name:"email",
    async dispatch(){ dispatches++; return dispatches===1 ? { outcome:"unknown", error:"connection reset after write" } : { outcome:"succeeded", providerReceiptId:"provider-2", summary:"shadow email accepted" }; },
    async reconcile(){ reconciles++; return { outcome:"not-found" }; },
  };
  assert.equal(await processNextOutbox(store,connector,options),"ambiguous");
  assert.equal(await reconcileNextAmbiguous(store,connector,options),"retry");
  const retryOptions={...options,now:()=>new Date("2026-07-19T12:00:01.000Z")};
  assert.equal(await processNextOutbox(store,connector,retryOptions),"succeeded");
  assert.equal(reconciles,1); assert.equal(dispatches,2);
  const receipt=await store.getReceiptByIdempotencyKey(record.idempotencyKey);
  assert.equal(receipt.providerReceiptId,"provider-2");
  assert.equal((await store.getOutbox(record.id)).status,"succeeded");
});

test("rejected and exhausted not-sent outcomes enter operator-visible dead letter", async () => {
  for (const result of [
    { outcome:"rejected", error:"recipient invalid" },
    { outcome:"not-sent", retryable:true, error:"provider unavailable" },
  ]) {
    const store=new MemoryStore(); const record=await store.enqueue(input(1));
    const connector={ name:"email", async dispatch(){return result;}, async reconcile(){throw new Error("not used");} };
    assert.equal(await processNextOutbox(store,connector,options),"dead-letter");
    assert.equal((await store.getOutbox(record.id)).status,"dead-letter");
    assert.equal(store.deadLetters.get(record.id).operatorState,"open");
  }
});

test("identity verification enforces issuer audience expiry and recent authentication", () => {
  const claims={ issuer:"https://id.example.com", audience:["hyper-api"], subject:"user-1", tenantId:"tenant-1", roles:["operator","operator"], scopes:["effects:execute"], issuedAt:1000, expiresAt:2000, authenticatedAt:1400, tokenId:"jti-1" };
  const policy={ issuer:"https://id.example.com", audience:"hyper-api", maximumAuthenticationAgeSeconds:300, clockSkewSeconds:0 };
  assert.deepEqual(verifyIdentityClaims(claims,policy,1500),{ tenantId:"tenant-1", actorId:"user-1", roles:["operator"], scopes:["effects:execute"], authenticatedAt:"1970-01-01T00:23:20.000Z", tokenId:"jti-1" });
  assert.throws(()=>verifyIdentityClaims({...claims,issuer:"https://evil.example.com"},policy,1500),/issuer mismatch/);
  assert.throws(()=>verifyIdentityClaims({...claims,audience:"other"},policy,1500),/audience mismatch/);
  assert.throws(()=>verifyIdentityClaims({...claims,expiresAt:1499},policy,1500),/expired/);
  assert.throws(()=>verifyIdentityClaims({...claims,authenticatedAt:1000},policy,1500),/stale/);
});

test("environment secret source fails closed and never supplies an empty secret", async () => {
  const key="HYPER_TEST_SECRET"; const previous=process.env[key];
  try {
    delete process.env[key]; await assert.rejects(()=>new EnvironmentSecretSource("HYPER_").get("TEST_SECRET"),/missing secret/);
    process.env[key]="  token-value  "; assert.equal(await new EnvironmentSecretSource("HYPER_").get("TEST_SECRET"),"  token-value  ");
  } finally { if (previous===undefined) delete process.env[key]; else process.env[key]=previous; }
});

test("receipt is content-addressed and frozen", () => {
  const source={ ...input(), status:"dispatching", attempts:1, nextAttemptAt:"2026-07-19T12:00:00.000Z", createdAt:"2026-07-19T12:00:00.000Z", updatedAt:"2026-07-19T12:00:00.000Z" };
  const receipt=buildReceipt(source,{providerReceiptId:"provider-1",summary:"accepted"});
  assert.equal(Object.isFrozen(receipt),true);
  assert.match(receipt.receiptHash,/^[a-f0-9]{64}$/);
});

test("postgres adapter uses serializable transactions, retries serialization failure, and claims with skip locked", async () => {
  const queries=[]; let beginCount=0;
  const connection={
    async query(sql,params=[]){
      queries.push({sql,params});
      if (sql.startsWith("BEGIN")) { beginCount++; if (beginCount===1) { const error=new Error("serialization"); error.code="40001"; throw error; } }
      if (sql.includes("FOR UPDATE SKIP LOCKED")) return { rows:[], rowCount:0 };
      return { rows:[], rowCount:0 };
    },
    release(){},
  };
  const pool={async connect(){return connection;}};
  const store=new PostgresProductionStore(pool,3);
  await store.claimNext("worker","2026-07-19T12:00:00.000Z",5000);
  assert.equal(beginCount,2);
  assert(queries.some(({sql})=>sql.includes("ISOLATION LEVEL SERIALIZABLE")));
  assert(queries.some(({sql})=>sql.includes("FOR UPDATE SKIP LOCKED")));
  assert(queries.some(({sql})=>sql==="ROLLBACK"));
  assert(queries.some(({sql})=>sql==="COMMIT"));
});
