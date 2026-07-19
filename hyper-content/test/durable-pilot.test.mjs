import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { compileLivingSurface } from "@amtech/hyper-site";
import {
  DurableJsonTransactionStore,
  GlmStructuredOutputProvider,
  ShadowConnectorExecutor,
  authorizeAction,
  compileDeterministicPostEffectSurface,
  executeAuthorizedDurableAction,
} from "../dist/durable-pilot.js";
import { approveSurfaceAction } from "../dist/action-runtime.js";

function state() {
  return {
    schemaVersion: 1,
    id: "tenant-surface",
    title: "Estimate delivery",
    purpose: "Approve and shadow-send an estimate.",
    currentTask: "Deliver estimate",
    governanceThreshold: 0.5,
    evidenceIds: ["e1"],
    informationObjects: [],
    actions: [{ id: "send", label: "Send", description: "Send estimate", visibility: "operator", authority: "mixed", status: "approval-required", risk: 0.9, agency: 0.4, evidenceIds: ["e1"], approvalId: "a1" }],
    approvals: [{ id: "a1", actionId: "send", summary: "Owner approval", requestedBy: "agent", status: "pending", visibility: "operator" }],
    receipts: [],
    nodes: [{ id: "n1", kind: "approval", title: "Approval", body: "Approval required", visibility: "operator", field: { visibility: 1, scale: 1, curvature: 0.5, density: 0.4, governance: 1, agency: 0.4, relevance: 1, valence: 0.5, urgency: 0.8 }, informationObjectIds: [], actionIds: ["send"], evidenceIds: ["e1"] }],
    runtime: { status: "waiting-approval", activeAgents: 1, queueDepth: 0, pendingApprovals: 1, costUsd: 0, lastHeartbeatAt: "2026-07-19T00:00:00.000Z" },
  };
}

const actor = { tenantId: "tenant:smile", actorId: "operator:2", roles: ["operator"], scopes: ["estimate.send"], authenticatedAt: "2026-07-19T00:00:00.000Z" };

function request(surfaceStateHash) {
  return {
    tenantId: "tenant:smile",
    actor,
    requiredRole: "operator",
    requiredScope: "estimate.send",
    approvalTenantId: "tenant:smile",
    approvalActorId: "owner:1",
    approvalExpiresAt: "2099-01-01T00:00:00.000Z",
    runId: "run:1",
    surfaceStateHash,
    actionId: "send",
    approvalId: "a1",
    approvalEpoch: 1,
    payload: { customer: "Veronica", totalUsd: 5920 },
  };
}

test("durable store survives restart and preserves immutable receipt replay", async () => {
  const root = await mkdtemp(join(tmpdir(), "hyper-durable-"));
  try {
    const path = join(root, "state.json");
    const firstStore = new DurableJsonTransactionStore(path);
    await firstStore.initialize();
    const approved = approveSurfaceAction(state(), "a1");
    const hash = compileLivingSurface(approved, "operator").projection.stateHash;
    const connector = new ShadowConnectorExecutor({ tenantId: "tenant:smile", connector: "email-shadow", actor, store: firstStore, failuresBeforeSuccess: 1 });
    const first = await executeAuthorizedDurableAction({ state: approved, request: request(hash), connector, store: firstStore, retry: { maxAttempts: 3, timeoutMs: 500, baseDelayMs: 1 } });
    assert.equal(first.attempts, 2);
    assert.equal(first.replayed, false);
    assert.equal(connector.calls, 2);

    const restartedStore = new DurableJsonTransactionStore(path);
    const restartedConnector = new ShadowConnectorExecutor({ tenantId: "tenant:smile", connector: "email-shadow", actor, store: restartedStore });
    const replay = await executeAuthorizedDurableAction({ state: approved, request: request(hash), connector: restartedConnector, store: restartedStore, retry: { maxAttempts: 1, timeoutMs: 500, baseDelayMs: 1 } });
    assert.equal(replay.replayed, true);
    assert.equal(restartedConnector.calls, 0);
    assert.equal(replay.receipt.receiptHash, first.receipt.receiptHash);
    const post = compileDeterministicPostEffectSurface(approved, replay.receipt);
    assert.equal(post.state.actions[0].status, "completed");
    assert.equal(post.state.receipts.length, 1);
    assert.equal(post.projectionHash, compileDeterministicPostEffectSurface(approved, first.receipt).projectionHash);

    const disk = JSON.parse(await readFile(path, "utf8"));
    assert.equal(Object.keys(disk.receipts).length, 1);
    assert.equal(Object.keys(disk.shadowEffects).length, 1);
    assert(disk.audit.some((event) => event.type === "connector.shadowed"));
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("authorization binds tenant actor role scope separation and approval freshness", () => {
  const base = request("a".repeat(64));
  assert.equal(authorizeAction(base).allowed, true);
  assert.equal(authorizeAction({ ...base, approvalActorId: actor.actorId }).allowed, false);
  assert.equal(authorizeAction({ ...base, tenantId: "tenant:other" }).allowed, false);
  assert.equal(authorizeAction({ ...base, actor: { ...actor, scopes: [] } }).allowed, false);
  assert.equal(authorizeAction({ ...base, approvalExpiresAt: "2020-01-01T00:00:00.000Z" }).allowed, false);
});

test("GLM-compatible adapter sends strict structured-output request and parses response", async () => {
  let captured;
  const provider = new GlmStructuredOutputProvider({
    endpoint: "https://glm.example/v1/chat/completions",
    apiKey: "secret",
    model: "glm-test",
    systemPrompt: "Return only the schema.",
    schema: { type: "object" },
    fetchImpl: async (_url, init) => {
      captured = JSON.parse(init.body);
      return new Response(JSON.stringify({ id: "req-1", choices: [{ message: { content: JSON.stringify({ siteSource: {}, livingSurface: {} }) } }], usage: { prompt_tokens: 10, completion_tokens: 4, cached_tokens: 3 } }), { status: 200, headers: { "content-type": "application/json" } });
    },
  });
  const result = await provider.propose({ runId: "r", task: "t", corpus: { id: "c", version: "1", baseUrl: "https://example.com", evidence: [], facts: [] } }, 1);
  assert.equal(captured.response_format.type, "json_schema");
  assert.equal(captured.temperature, 0);
  assert.equal(result.usage.inputTokens, 10);
  assert.equal(result.usage.cachedInputTokens, 3);
  assert.equal(result.requestId, "req-1");
});

test("transaction lock serializes concurrent writers without lost updates", async () => {
  const root = await mkdtemp(join(tmpdir(), "hyper-lock-"));
  try {
    const store = new DurableJsonTransactionStore(join(root, "state.json"));
    await Promise.all(Array.from({ length: 8 }, (_, index) => store.transaction(async ({ state }) => {
      await new Promise((resolve) => setTimeout(resolve, index % 2));
      state.audit.push({ id: `e${index}`, type: "concurrent", tenantId: "t", actorId: "a", at: "2026-07-19T00:00:00.000Z", dataHash: "0".repeat(64) });
    })));
    const persisted = await store.read();
    assert.equal(persisted.revision, 8);
    assert.equal(persisted.audit.length, 8);
  } finally { await rm(root, { recursive: true, force: true }); }
});
