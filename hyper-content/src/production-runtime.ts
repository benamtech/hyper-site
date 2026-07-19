import { createHash, timingSafeEqual } from "node:crypto";

export type OutboxStatus = "pending" | "dispatching" | "ambiguous" | "succeeded" | "dead-letter";
export type ConnectorOutcome = "succeeded" | "not-sent" | "rejected" | "unknown";

export interface VerifiedIdentityClaims {
  issuer: string;
  audience: string | string[];
  subject: string;
  tenantId: string;
  roles: string[];
  scopes: string[];
  issuedAt: number;
  expiresAt: number;
  authenticatedAt: number;
  tokenId?: string;
}

export interface IdentityPolicy {
  issuer: string;
  audience: string;
  maximumAuthenticationAgeSeconds: number;
  clockSkewSeconds?: number;
}

export interface AuthorizedPrincipal {
  tenantId: string;
  actorId: string;
  roles: string[];
  scopes: string[];
  authenticatedAt: string;
  tokenId?: string;
}

export interface SecretSource {
  get(name: string): Promise<string>;
}

export class EnvironmentSecretSource implements SecretSource {
  constructor(private readonly prefix = "") {}
  async get(name: string): Promise<string> {
    const key = `${this.prefix}${name}`;
    const value = process.env[key];
    if (!value?.trim()) throw new Error(`missing secret ${key}`);
    return value;
  }
}

export interface OutboxRecord {
  id: string;
  tenantId: string;
  actionId: string;
  approvalId: string;
  approvalEpoch: number;
  actorId: string;
  connector: string;
  payload: unknown;
  payloadHash: string;
  idempotencyKey: string;
  status: OutboxStatus;
  attempts: number;
  maximumAttempts: number;
  nextAttemptAt: string;
  leaseOwner?: string;
  leaseExpiresAt?: string;
  providerReceiptId?: string;
  lastError?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DurableProductionReceipt {
  id: string;
  outboxId: string;
  tenantId: string;
  actionId: string;
  approvalId: string;
  approvalEpoch: number;
  actorId: string;
  connector: string;
  idempotencyKey: string;
  payloadHash: string;
  providerReceiptId: string;
  summary: string;
  artifactUrl?: string;
  createdAt: string;
  receiptHash: string;
}

export interface DeadLetterRecord {
  id: string;
  outboxId: string;
  tenantId: string;
  reason: string;
  operatorState: "open" | "retry-approved" | "resolved";
  createdAt: string;
  updatedAt: string;
}

export interface ProviderDispatchResult {
  outcome: ConnectorOutcome;
  summary?: string;
  providerReceiptId?: string;
  artifactUrl?: string;
  retryable?: boolean;
  error?: string;
}

export interface ReconciliationResult {
  outcome: "succeeded" | "not-found" | "pending" | "failed";
  summary?: string;
  providerReceiptId?: string;
  artifactUrl?: string;
  error?: string;
}

export interface ReconciliableConnector {
  readonly name: string;
  dispatch(record: OutboxRecord, signal: AbortSignal): Promise<ProviderDispatchResult>;
  reconcile(record: OutboxRecord, signal: AbortSignal): Promise<ReconciliationResult>;
}

export interface ProductionTransactionStore {
  enqueue(input: Omit<OutboxRecord, "status" | "attempts" | "nextAttemptAt" | "createdAt" | "updatedAt">): Promise<OutboxRecord>;
  claimNext(workerId: string, now: string, leaseMs: number): Promise<OutboxRecord | undefined>;
  claimAmbiguous(workerId: string, now: string, leaseMs: number): Promise<OutboxRecord | undefined>;
  markPending(id: string, error: string, nextAttemptAt: string): Promise<void>;
  markAmbiguous(id: string, error: string, providerReceiptId?: string): Promise<void>;
  commitSuccess(id: string, receipt: DurableProductionReceipt): Promise<void>;
  moveToDeadLetter(id: string, reason: string): Promise<DeadLetterRecord>;
  getReceiptByIdempotencyKey(idempotencyKey: string): Promise<DurableProductionReceipt | undefined>;
  getOutbox(id: string): Promise<OutboxRecord | undefined>;
}

export interface SqlQueryResult<Row = Record<string, unknown>> { rows: Row[]; rowCount: number; }
export interface SqlConnection {
  query<Row = Record<string, unknown>>(sql: string, params?: readonly unknown[]): Promise<SqlQueryResult<Row>>;
  release(): void;
}
export interface SqlPool { connect(): Promise<SqlConnection>; }

export const PRODUCTION_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS hyper_outbox (
  id text PRIMARY KEY,
  tenant_id text NOT NULL,
  action_id text NOT NULL,
  approval_id text NOT NULL,
  approval_epoch integer NOT NULL CHECK (approval_epoch > 0),
  actor_id text NOT NULL,
  connector text NOT NULL,
  payload jsonb NOT NULL,
  payload_hash text NOT NULL,
  idempotency_key text NOT NULL UNIQUE,
  status text NOT NULL CHECK (status IN ('pending','dispatching','ambiguous','succeeded','dead-letter')),
  attempts integer NOT NULL DEFAULT 0,
  maximum_attempts integer NOT NULL CHECK (maximum_attempts > 0),
  next_attempt_at timestamptz NOT NULL,
  lease_owner text,
  lease_expires_at timestamptz,
  provider_receipt_id text,
  last_error text,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS hyper_outbox_claim_idx ON hyper_outbox(status, next_attempt_at, created_at);
CREATE TABLE IF NOT EXISTS hyper_receipts (
  id text PRIMARY KEY,
  outbox_id text NOT NULL UNIQUE REFERENCES hyper_outbox(id),
  tenant_id text NOT NULL,
  idempotency_key text NOT NULL UNIQUE,
  receipt jsonb NOT NULL,
  receipt_hash text NOT NULL,
  created_at timestamptz NOT NULL
);
CREATE TABLE IF NOT EXISTS hyper_dead_letters (
  id text PRIMARY KEY,
  outbox_id text NOT NULL UNIQUE REFERENCES hyper_outbox(id),
  tenant_id text NOT NULL,
  reason text NOT NULL,
  operator_state text NOT NULL CHECK (operator_state IN ('open','retry-approved','resolved')),
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);`;

export class PostgresProductionStore implements ProductionTransactionStore {
  constructor(private readonly pool: SqlPool, private readonly maximumSerializableRetries = 4) {}

  async migrate(): Promise<void> {
    const connection = await this.pool.connect();
    try { await connection.query(PRODUCTION_SCHEMA_SQL); } finally { connection.release(); }
  }

  async enqueue(input: Omit<OutboxRecord, "status" | "attempts" | "nextAttemptAt" | "createdAt" | "updatedAt">): Promise<OutboxRecord> {
    const now = new Date().toISOString();
    const record: OutboxRecord = { ...input, status: "pending", attempts: 0, nextAttemptAt: now, createdAt: now, updatedAt: now };
    return this.serializable(async (connection) => {
      const existing = await connection.query<{ record: OutboxRecord }>("SELECT to_jsonb(o) AS record FROM hyper_outbox o WHERE idempotency_key = $1", [record.idempotencyKey]);
      if (existing.rows[0]) return normalizeDbOutbox(existing.rows[0].record);
      await connection.query("INSERT INTO hyper_outbox (id,tenant_id,action_id,approval_id,approval_epoch,actor_id,connector,payload,payload_hash,idempotency_key,status,attempts,maximum_attempts,next_attempt_at,created_at,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,$10,$11,$12,$13,$14,$15,$16)", [record.id,record.tenantId,record.actionId,record.approvalId,record.approvalEpoch,record.actorId,record.connector,JSON.stringify(record.payload),record.payloadHash,record.idempotencyKey,record.status,record.attempts,record.maximumAttempts,record.nextAttemptAt,record.createdAt,record.updatedAt]);
      return record;
    });
  }

  async claimNext(workerId: string, now: string, leaseMs: number): Promise<OutboxRecord | undefined> { return this.claim("pending", workerId, now, leaseMs); }
  async claimAmbiguous(workerId: string, now: string, leaseMs: number): Promise<OutboxRecord | undefined> { return this.claim("ambiguous", workerId, now, leaseMs); }

  async markPending(id: string, error: string, nextAttemptAt: string): Promise<void> {
    await this.write("UPDATE hyper_outbox SET status='pending', last_error=$2, next_attempt_at=$3, lease_owner=NULL, lease_expires_at=NULL, updated_at=now() WHERE id=$1", [id,error,nextAttemptAt]);
  }
  async markAmbiguous(id: string, error: string, providerReceiptId?: string): Promise<void> {
    await this.write("UPDATE hyper_outbox SET status='ambiguous', last_error=$2, provider_receipt_id=COALESCE($3,provider_receipt_id), lease_owner=NULL, lease_expires_at=NULL, updated_at=now() WHERE id=$1", [id,error,providerReceiptId ?? null]);
  }
  async commitSuccess(id: string, receipt: DurableProductionReceipt): Promise<void> {
    await this.serializable(async (connection) => {
      const existing = await connection.query<{ receipt_hash: string }>("SELECT receipt_hash FROM hyper_receipts WHERE idempotency_key=$1", [receipt.idempotencyKey]);
      if (existing.rows[0] && existing.rows[0].receipt_hash !== receipt.receiptHash) throw new Error(`receipt conflict for ${receipt.idempotencyKey}`);
      await connection.query("INSERT INTO hyper_receipts (id,outbox_id,tenant_id,idempotency_key,receipt,receipt_hash,created_at) VALUES ($1,$2,$3,$4,$5::jsonb,$6,$7) ON CONFLICT (idempotency_key) DO NOTHING", [receipt.id,receipt.outboxId,receipt.tenantId,receipt.idempotencyKey,JSON.stringify(receipt),receipt.receiptHash,receipt.createdAt]);
      await connection.query("UPDATE hyper_outbox SET status='succeeded', provider_receipt_id=$2, lease_owner=NULL, lease_expires_at=NULL, updated_at=$3 WHERE id=$1", [id,receipt.providerReceiptId,receipt.createdAt]);
    });
  }
  async moveToDeadLetter(id: string, reason: string): Promise<DeadLetterRecord> {
    const now = new Date().toISOString();
    return this.serializable(async (connection) => {
      const outbox = await connection.query<{ tenant_id: string }>("SELECT tenant_id FROM hyper_outbox WHERE id=$1 FOR UPDATE", [id]);
      if (!outbox.rows[0]) throw new Error(`missing outbox ${id}`);
      const record: DeadLetterRecord = { id:`dead:${id}`, outboxId:id, tenantId:outbox.rows[0].tenant_id, reason, operatorState:"open", createdAt:now, updatedAt:now };
      await connection.query("INSERT INTO hyper_dead_letters (id,outbox_id,tenant_id,reason,operator_state,created_at,updated_at) VALUES ($1,$2,$3,$4,'open',$5,$5) ON CONFLICT (outbox_id) DO UPDATE SET reason=EXCLUDED.reason, updated_at=EXCLUDED.updated_at", [record.id,id,record.tenantId,reason,now]);
      await connection.query("UPDATE hyper_outbox SET status='dead-letter', last_error=$2, lease_owner=NULL, lease_expires_at=NULL, updated_at=$3 WHERE id=$1", [id,reason,now]);
      return record;
    });
  }
  async getReceiptByIdempotencyKey(key: string): Promise<DurableProductionReceipt | undefined> {
    const connection = await this.pool.connect();
    try { const result = await connection.query<{ receipt: DurableProductionReceipt }>("SELECT receipt FROM hyper_receipts WHERE idempotency_key=$1", [key]); return result.rows[0]?.receipt; } finally { connection.release(); }
  }
  async getOutbox(id: string): Promise<OutboxRecord | undefined> {
    const connection = await this.pool.connect();
    try { const result = await connection.query<{ record: OutboxRecord }>("SELECT to_jsonb(o) AS record FROM hyper_outbox o WHERE id=$1", [id]); return result.rows[0] ? normalizeDbOutbox(result.rows[0].record) : undefined; } finally { connection.release(); }
  }

  private async claim(status: "pending" | "ambiguous", workerId: string, now: string, leaseMs: number): Promise<OutboxRecord | undefined> {
    const leaseExpiresAt = new Date(Date.parse(now) + leaseMs).toISOString();
    return this.serializable(async (connection) => {
      const selected = await connection.query<{ record: OutboxRecord }>("SELECT to_jsonb(o) AS record FROM hyper_outbox o WHERE status=$1 AND next_attempt_at <= $2 AND (lease_expires_at IS NULL OR lease_expires_at < $2) ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 1", [status,now]);
      if (!selected.rows[0]) return undefined;
      const record = normalizeDbOutbox(selected.rows[0].record);
      await connection.query("UPDATE hyper_outbox SET status='dispatching', attempts=attempts+1, lease_owner=$2, lease_expires_at=$3, updated_at=$4 WHERE id=$1", [record.id,workerId,leaseExpiresAt,now]);
      return { ...record, status:"dispatching", attempts:record.attempts+1, leaseOwner:workerId, leaseExpiresAt, updatedAt:now };
    });
  }

  private async write(sql: string, params: readonly unknown[]): Promise<void> { await this.serializable(async (connection) => { await connection.query(sql, params); }); }
  private async serializable<T>(operation: (connection: SqlConnection) => Promise<T>): Promise<T> {
    let attempt = 0;
    while (true) {
      const connection = await this.pool.connect();
      try {
        await connection.query("BEGIN ISOLATION LEVEL SERIALIZABLE");
        const value = await operation(connection);
        await connection.query("COMMIT");
        return value;
      } catch (error) {
        try { await connection.query("ROLLBACK"); } catch {}
        const code = typeof error === "object" && error && "code" in error ? String((error as { code?: unknown }).code) : "";
        if ((code === "40001" || code === "40P01") && ++attempt < this.maximumSerializableRetries) continue;
        throw error;
      } finally { connection.release(); }
    }
  }
}

export interface ProcessOutboxOptions {
  workerId: string;
  leaseMs: number;
  timeoutMs: number;
  baseRetryMs: number;
  now?: () => Date;
}

export async function processNextOutbox(store: ProductionTransactionStore, connector: ReconciliableConnector, options: ProcessOutboxOptions): Promise<"idle" | "succeeded" | "retry" | "ambiguous" | "dead-letter"> {
  const now = (options.now ?? (() => new Date()))();
  const record = await store.claimNext(options.workerId, now.toISOString(), options.leaseMs);
  if (!record) return "idle";
  const existing = await store.getReceiptByIdempotencyKey(record.idempotencyKey);
  if (existing) { await store.commitSuccess(record.id, existing); return "succeeded"; }
  const result = await withTimeout((signal) => connector.dispatch(record, signal), options.timeoutMs);
  if (result.outcome === "succeeded" && result.providerReceiptId && result.summary) {
    await store.commitSuccess(record.id, buildReceipt(record, result));
    return "succeeded";
  }
  if (result.outcome === "unknown") {
    await store.markAmbiguous(record.id, result.error ?? "provider outcome unknown", result.providerReceiptId);
    return "ambiguous";
  }
  if (result.outcome === "not-sent" && result.retryable && record.attempts < record.maximumAttempts) {
    const next = new Date(now.getTime() + options.baseRetryMs * 2 ** Math.max(0, record.attempts - 1)).toISOString();
    await store.markPending(record.id, result.error ?? "transient pre-dispatch failure", next);
    return "retry";
  }
  await store.moveToDeadLetter(record.id, result.error ?? `connector ${result.outcome}`);
  return "dead-letter";
}

export async function reconcileNextAmbiguous(store: ProductionTransactionStore, connector: ReconciliableConnector, options: ProcessOutboxOptions): Promise<"idle" | "succeeded" | "pending" | "retry" | "dead-letter"> {
  const now = (options.now ?? (() => new Date()))();
  const record = await store.claimAmbiguous(options.workerId, now.toISOString(), options.leaseMs);
  if (!record) return "idle";
  const result = await withTimeout((signal) => connector.reconcile(record, signal), options.timeoutMs);
  if (result.outcome === "succeeded" && result.providerReceiptId && result.summary) {
    await store.commitSuccess(record.id, buildReceipt(record, { ...result, outcome:"succeeded" }));
    return "succeeded";
  }
  if (result.outcome === "pending") {
    await store.markAmbiguous(record.id, result.error ?? "provider still processing", result.providerReceiptId);
    return "pending";
  }
  if (result.outcome === "not-found" && record.attempts < record.maximumAttempts) {
    const next = new Date(now.getTime() + options.baseRetryMs * 2 ** Math.max(0, record.attempts - 1)).toISOString();
    await store.markPending(record.id, "provider confirmed effect absent", next);
    return "retry";
  }
  await store.moveToDeadLetter(record.id, result.error ?? "reconciliation failed");
  return "dead-letter";
}

export function verifyIdentityClaims(claims: VerifiedIdentityClaims, policy: IdentityPolicy, now = Math.floor(Date.now()/1000)): AuthorizedPrincipal {
  const skew = policy.clockSkewSeconds ?? 30;
  const audiences = Array.isArray(claims.audience) ? claims.audience : [claims.audience];
  if (!constantTimeStringEqual(claims.issuer, policy.issuer)) throw new Error("identity issuer mismatch");
  if (!audiences.some((audience) => constantTimeStringEqual(audience, policy.audience))) throw new Error("identity audience mismatch");
  if (!claims.subject.trim() || !claims.tenantId.trim()) throw new Error("identity subject and tenant are required");
  if (claims.expiresAt < now - skew) throw new Error("identity token expired");
  if (claims.issuedAt > now + skew) throw new Error("identity token issued in the future");
  if (now - claims.authenticatedAt > policy.maximumAuthenticationAgeSeconds + skew) throw new Error("identity authentication is stale");
  return { tenantId:claims.tenantId, actorId:claims.subject, roles:uniqueSorted(claims.roles), scopes:uniqueSorted(claims.scopes), authenticatedAt:new Date(claims.authenticatedAt*1000).toISOString(), ...(claims.tokenId ? { tokenId:claims.tokenId } : {}) };
}

export function buildOutboxRecord(input: { tenantId:string; actorId:string; actionId:string; approvalId:string; approvalEpoch:number; connector:string; payload:unknown; maximumAttempts:number; createdAt?:string }): Omit<OutboxRecord,"status"|"attempts"|"nextAttemptAt"|"createdAt"|"updatedAt"> {
  if (!Number.isInteger(input.approvalEpoch) || input.approvalEpoch < 1) throw new Error("approvalEpoch must be positive");
  if (!Number.isInteger(input.maximumAttempts) || input.maximumAttempts < 1) throw new Error("maximumAttempts must be positive");
  const payloadHash = hashCanonical(input.payload);
  const idempotencyKey = hashCanonical({ tenantId:input.tenantId, actorId:input.actorId, actionId:input.actionId, approvalId:input.approvalId, approvalEpoch:input.approvalEpoch, connector:input.connector, payloadHash });
  return { id:`outbox:${idempotencyKey.slice(0,24)}`, tenantId:input.tenantId, actorId:input.actorId, actionId:input.actionId, approvalId:input.approvalId, approvalEpoch:input.approvalEpoch, connector:input.connector, payload:structuredClone(input.payload), payloadHash, idempotencyKey, maximumAttempts:input.maximumAttempts };
}

export function buildReceipt(record: OutboxRecord, result: { summary?:string; providerReceiptId?:string; artifactUrl?:string }): DurableProductionReceipt {
  if (!result.summary?.trim() || !result.providerReceiptId?.trim()) throw new Error("successful provider result requires summary and providerReceiptId");
  const createdAt = new Date().toISOString();
  const stable = { id:`receipt:${record.idempotencyKey.slice(0,24)}`, outboxId:record.id, tenantId:record.tenantId, actionId:record.actionId, approvalId:record.approvalId, approvalEpoch:record.approvalEpoch, actorId:record.actorId, connector:record.connector, idempotencyKey:record.idempotencyKey, payloadHash:record.payloadHash, providerReceiptId:result.providerReceiptId, summary:result.summary, ...(result.artifactUrl ? { artifactUrl:result.artifactUrl } : {}), createdAt };
  return Object.freeze({ ...stable, receiptHash:hashCanonical(stable) });
}

async function withTimeout<T>(operation:(signal:AbortSignal)=>Promise<T>, timeoutMs:number):Promise<T> {
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1) throw new Error("timeoutMs must be positive");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(new Error("operation timed out")), timeoutMs);
  try { return await operation(controller.signal); } finally { clearTimeout(timeout); }
}
function normalizeDbOutbox(record: OutboxRecord): OutboxRecord { return { ...record, payload:structuredClone(record.payload) }; }
function uniqueSorted(values:readonly string[]):string[] { return [...new Set(values)].sort(); }
function constantTimeStringEqual(left:string,right:string):boolean { const a=Buffer.from(left); const b=Buffer.from(right); return a.length===b.length && timingSafeEqual(a,b); }
function hashCanonical(value:unknown):string { return createHash("sha256").update(canonicalJson(value)).digest("hex"); }
function canonicalJson(value:unknown):string { if (value===null || typeof value!=="object") return JSON.stringify(value); if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`; const object=value as Record<string,unknown>; return `{${Object.keys(object).sort().map((key)=>`${JSON.stringify(key)}:${canonicalJson(object[key])}`).join(",")}}`; }
