import assert from "node:assert/strict";
import test from "node:test";

import {
  InMemoryActionReceiptStore,
  approveSurfaceAction,
  checkpointHash,
  executeApprovedSurfaceAction,
  runSemanticGeneration,
} from "../index.mjs";

function corpus() {
  return {
    id: "painting-estimate",
    version: "1",
    baseUrl: "https://estimate.example",
    evidence: [
      { id: "e:scope", level: 4, summary: "Approved exterior repaint scope" },
      { id: "e:pricing", level: 4, summary: "Approved labor and material estimate" },
    ],
    facts: [
      { id: "f:scope", statement: "The estimate covers exterior preparation, priming and painting.", evidenceIds: ["e:scope"] },
      { id: "f:price", statement: "The estimate total is $5,920.", evidenceIds: ["e:pricing"] },
    ],
  };
}

function proposal(claimText = "The estimate covers exterior preparation, priming and painting.") {
  return {
    siteSource: {
      baseUrl: "https://estimate.example",
      evidence: [
        { id: "e:scope", level: 4, summary: "Approved exterior repaint scope" },
        { id: "e:pricing", level: 4, summary: "Approved labor and material estimate" },
      ],
      claims: [
        { id: "c:scope", text: claimText, evidenceIds: ["e:scope"], requiredLevel: 3 },
        { id: "c:price", text: "The estimate total is $5,920.", evidenceIds: ["e:pricing"], requiredLevel: 3 },
      ],
      informationObjects: [
        { id: "i:estimate", kind: "calculation", title: "Estimate", body: "$5,920 total", evidenceIds: ["e:pricing"] },
      ],
      modules: [
        { id: "m:hero", kind: "hero", layoutRole: "lead", heading: "Estimate ready", body: "Review the approved scope and price.", claimIds: ["c:scope", "c:price"], informationObjectIds: ["i:estimate"], requiredCapabilities: ["semantic-hierarchy"], sourceIds: ["e:scope", "e:pricing"] },
      ],
      pages: [
        { id: "home", route: "/", canonicalQuestion: "Is my estimate ready?", title: "Estimate ready", description: "Review the evidence-backed estimate.", moduleIds: ["m:hero"], internalPageIds: [], requiredCapabilities: ["responsive-grid"], indexable: true },
      ],
    },
    livingSurface: {
      schemaVersion: 1,
      id: "surface:estimate",
      title: "Estimate ready",
      purpose: "Review and approve an evidence-backed estimate.",
      currentTask: "Approve and send the estimate",
      governanceThreshold: 0.6,
      evidenceIds: ["e:scope", "e:pricing"],
      informationObjects: [
        { id: "info:scope", title: "Approved scope", body: "Exterior preparation, priming and painting.", visibility: "both", evidenceIds: ["e:scope"] },
        { id: "info:price", title: "Internal price", body: "$5,920", visibility: "operator", evidenceIds: ["e:pricing"] },
      ],
      actions: [
        { id: "action:review", label: "Review", description: "Review the estimate.", visibility: "both", authority: "user", status: "available", risk: 0.1, agency: 1, evidenceIds: ["e:scope"] },
        { id: "action:send", label: "Send", description: "Send the approved estimate.", visibility: "operator", authority: "mixed", status: "approval-required", risk: 0.9, agency: 0.4, evidenceIds: ["e:scope", "e:pricing"], approvalId: "approval:send" },
      ],
      approvals: [
        { id: "approval:send", actionId: "action:send", summary: "Owner must approve external delivery.", requestedBy: "agent", status: "pending", visibility: "operator" },
      ],
      receipts: [],
      nodes: [
        { id: "node:ready", kind: "work", title: "Estimate ready", body: "The estimate is ready for review.", visibility: "both", field: { visibility: 1, scale: 1, curvature: 0.1, density: 0.5, governance: 0.3, agency: 0.8, relevance: 1, valence: 0.8, urgency: 0.7 }, informationObjectIds: ["info:scope"], actionIds: ["action:review"], evidenceIds: ["e:scope"] },
        { id: "node:approval", kind: "approval", title: "Send approval", body: "External delivery is blocked until approval.", visibility: "operator", field: { visibility: 1, scale: 1, curvature: 0.9, density: 0.6, governance: 1, agency: 0.4, relevance: 1, valence: 0.4, urgency: 0.95 }, informationObjectIds: ["info:price"], actionIds: ["action:send"], evidenceIds: ["e:pricing"] },
      ],
      runtime: { status: "waiting-approval", activeAgents: 1, queueDepth: 0, pendingApprovals: 1, costUsd: 0.12, lastHeartbeatAt: "2026-07-19T07:00:00.000Z" },
    },
  };
}

test("bounded provider repair is independently validated and accepted atomically", async () => {
  let calls = 0;
  const provider = {
    async propose(_input, attempt) {
      calls += 1;
      return {
        provider: "fixture",
        model: "deterministic-provider",
        requestId: `request-${attempt}`,
        proposal: attempt === 1 ? proposal("Invented unsupported claim") : proposal(),
        usage: { inputTokens: 100, outputTokens: 50, cachedInputTokens: 0, costUsd: 0.01, latencyMs: 2 },
      };
    },
  };

  const input = { runId: "run:estimate", corpus: corpus(), task: "Generate an estimate site and living surface" };
  const result = await runSemanticGeneration(input, provider, { maxAttempts: 2 });
  assert.equal(result.status, "accepted");
  assert.equal(calls, 2);
  assert.equal(result.checkpoint.attempts.length, 2);
  assert.equal(result.checkpoint.attempts[0].accepted, false);
  assert.equal(result.checkpoint.attempts[0].failures[0].code, "UNAPPROVED_CLAIM");
  assert.equal(result.checkpoint.attempts[1].accepted, true);
  assert.match(result.accepted.site.pages[0].html, /Estimate ready/);
  assert.equal(result.accepted.publicSurface.html.includes("Internal price"), false);
  assert.match(result.accepted.operatorSurface.html, /Send approval/);
  assert.equal(typeof checkpointHash(result.checkpoint), "string");

  const resumed = await runSemanticGeneration(input, { propose: async () => { throw new Error("provider must not run after acceptance"); } }, { maxAttempts: 2, checkpoint: result.checkpoint });
  assert.equal(resumed.status, "accepted");
  assert.equal(resumed.accepted.proposalHash, result.accepted.proposalHash);
});

test("rejection is atomic when bounded attempts are exhausted", async () => {
  const result = await runSemanticGeneration(
    { runId: "run:reject", corpus: corpus(), task: "Generate invalid output" },
    { async propose() { return { provider: "fixture", model: "bad", requestId: "bad-1", proposal: proposal("Unsupported"), usage: { inputTokens: 1, outputTokens: 1, cachedInputTokens: 0, costUsd: 0, latencyMs: 1 } }; } },
    { maxAttempts: 1 },
  );
  assert.equal(result.status, "rejected");
  assert.equal(result.checkpoint.accepted, undefined);
  assert.equal(result.failures[0].code, "UNAPPROVED_CLAIM");
});

test("approved external action executes once and replays immutable receipt", async () => {
  const state = approveSurfaceAction(proposal().livingSurface, "approval:send");
  const store = new InMemoryActionReceiptStore();
  let executions = 0;
  const executor = {
    async execute() {
      executions += 1;
      return { summary: "Estimate sent", artifactUrl: "https://receipts.example/estimate-1", providerReceiptId: "provider-1" };
    },
  };
  const request = { runId: "run:estimate", surfaceStateHash: "a".repeat(64), actionId: "action:send", approvalId: "approval:send", approvalEpoch: 1, payload: { customerId: "customer-1" } };

  const first = await executeApprovedSurfaceAction(state, request, executor, store);
  const second = await executeApprovedSurfaceAction(state, request, executor, store);
  assert.equal(executions, 1);
  assert.equal(first.replayed, false);
  assert.equal(second.replayed, true);
  assert.equal(first.receipt.receiptHash, second.receipt.receiptHash);
  assert.equal(first.state.actions.find((action) => action.id === "action:send").status, "completed");
  assert.equal(first.state.runtime.pendingApprovals, 0);
  assert.equal(first.state.receipts.length, 1);
});
