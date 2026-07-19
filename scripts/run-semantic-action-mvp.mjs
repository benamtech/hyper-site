#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  InMemoryActionReceiptStore,
  approveSurfaceAction,
  executeApprovedSurfaceAction,
  runSemanticGeneration,
} from "../hyper-content/index.mjs";

const output = resolve("validation/reports/semantic-action-mvp");
mkdirSync(output, { recursive: true });

const corpus = {
  id: "amtech-painting-estimate",
  version: "1",
  baseUrl: "https://estimate.example",
  evidence: [
    { id: "e:scope", level: 4, summary: "Approved exterior preparation, priming and repaint scope" },
    { id: "e:price", level: 4, summary: "Approved estimate total of $5,920" },
  ],
  facts: [
    { id: "f:scope", statement: "The estimate covers exterior preparation, priming and painting.", evidenceIds: ["e:scope"] },
    { id: "f:price", statement: "The estimate total is $5,920.", evidenceIds: ["e:price"] },
  ],
};

function proposal(claimText) {
  return {
    siteSource: {
      baseUrl: corpus.baseUrl,
      evidence: corpus.evidence.map((item) => ({ id: item.id, level: item.level, summary: item.summary })),
      claims: [
        { id: "c:scope", text: claimText, evidenceIds: ["e:scope"], requiredLevel: 3 },
        { id: "c:price", text: "The estimate total is $5,920.", evidenceIds: ["e:price"], requiredLevel: 3 },
      ],
      informationObjects: [{ id: "i:price", kind: "calculation", title: "Estimate total", body: "$5,920", evidenceIds: ["e:price"] }],
      modules: [{ id: "m:hero", kind: "hero", layoutRole: "lead", heading: "Your estimate is ready", body: "Review the approved scope and total.", claimIds: ["c:scope", "c:price"], informationObjectIds: ["i:price"], requiredCapabilities: ["semantic-hierarchy"], sourceIds: ["e:scope", "e:price"] }],
      pages: [{ id: "home", route: "/", canonicalQuestion: "Is my estimate ready?", title: "Estimate ready", description: "Evidence-backed painting estimate.", moduleIds: ["m:hero"], internalPageIds: [], requiredCapabilities: ["responsive-grid"], indexable: true }],
    },
    livingSurface: {
      schemaVersion: 1,
      id: "surface:estimate",
      title: "Your estimate is ready",
      purpose: "Review, approve and deliver an evidence-backed estimate.",
      currentTask: "Approve external delivery",
      governanceThreshold: 0.6,
      evidenceIds: ["e:scope", "e:price"],
      informationObjects: [
        { id: "info:scope", title: "Approved scope", body: "Exterior preparation, priming and painting.", visibility: "both", evidenceIds: ["e:scope"] },
        { id: "info:price", title: "Internal price", body: "$5,920", visibility: "operator", evidenceIds: ["e:price"] },
      ],
      actions: [
        { id: "action:review", label: "Review estimate", description: "Inspect the approved estimate.", visibility: "both", authority: "user", status: "available", risk: 0.1, agency: 1, evidenceIds: ["e:scope"] },
        { id: "action:send", label: "Send estimate", description: "Deliver the estimate to the customer.", visibility: "operator", authority: "mixed", status: "approval-required", risk: 0.9, agency: 0.4, evidenceIds: ["e:scope", "e:price"], approvalId: "approval:send" },
      ],
      approvals: [{ id: "approval:send", actionId: "action:send", summary: "Owner approval is required before delivery.", requestedBy: "agent", status: "pending", visibility: "operator" }],
      receipts: [],
      nodes: [
        { id: "node:ready", kind: "work", title: "Estimate ready", body: "The AI employee completed the draft.", visibility: "both", field: { visibility: 1, scale: 1, curvature: 0.1, density: 0.5, governance: 0.3, agency: 0.8, relevance: 1, valence: 0.8, urgency: 0.7 }, informationObjectIds: ["info:scope"], actionIds: ["action:review"], evidenceIds: ["e:scope"] },
        { id: "node:gate", kind: "approval", title: "Delivery approval", body: "Delivery remains blocked until the owner approves.", visibility: "operator", field: { visibility: 1, scale: 1, curvature: 0.9, density: 0.6, governance: 1, agency: 0.4, relevance: 1, valence: 0.4, urgency: 0.95 }, informationObjectIds: ["info:price"], actionIds: ["action:send"], evidenceIds: ["e:price"] },
      ],
      runtime: { status: "waiting-approval", activeAgents: 1, queueDepth: 0, pendingApprovals: 1, costUsd: 0.12, lastHeartbeatAt: "2026-07-19T07:00:00.000Z" },
    },
  };
}

let providerCalls = 0;
const provider = {
  async propose(_input, attempt) {
    providerCalls += 1;
    return {
      provider: "fixture",
      model: "bounded-semantic-provider",
      requestId: `request-${attempt}`,
      proposal: proposal(attempt === 1 ? "The company is the highest-rated painter in America." : "The estimate covers exterior preparation, priming and painting."),
      usage: { inputTokens: 420, outputTokens: 180, cachedInputTokens: 120, costUsd: 0.02, latencyMs: 8 },
    };
  },
};

const input = { runId: "run:estimate-mvp", corpus, task: "Create an evidence-backed estimate site and operator surface" };
const generated = await runSemanticGeneration(input, provider, { maxAttempts: 2 });
if (generated.status !== "accepted") throw new Error(`generation rejected: ${JSON.stringify(generated.failures)}`);

const resumed = await runSemanticGeneration(input, { propose: async () => { throw new Error("provider must not be called after acceptance"); } }, { maxAttempts: 2, checkpoint: generated.checkpoint });
if (resumed.status !== "accepted") throw new Error("accepted checkpoint did not resume");

const approvedState = approveSurfaceAction(generated.accepted.proposal.livingSurface, "approval:send");
const receiptStore = new InMemoryActionReceiptStore();
let executorCalls = 0;
const executor = {
  async execute() {
    executorCalls += 1;
    return { summary: "Estimate delivered to customer", artifactUrl: "https://receipts.example/estimate-mvp", providerReceiptId: "delivery-001" };
  },
};
const actionRequest = { runId: input.runId, surfaceStateHash: generated.accepted.operatorSurface.projection.stateHash, actionId: "action:send", approvalId: "approval:send", approvalEpoch: 1, payload: { customer: "Veronica", channel: "email" } };
const firstEffect = await executeApprovedSurfaceAction(approvedState, actionRequest, executor, receiptStore);
const replay = await executeApprovedSurfaceAction(approvedState, actionRequest, executor, receiptStore);

writeFileSync(resolve(output, "corpus.json"), `${JSON.stringify(corpus, null, 2)}\n`);
writeFileSync(resolve(output, "checkpoint.json"), `${JSON.stringify(generated.checkpoint, null, 2)}\n`);
writeFileSync(resolve(output, "site-source.json"), `${JSON.stringify(generated.accepted.proposal.siteSource, null, 2)}\n`);
writeFileSync(resolve(output, "living-surface.json"), `${JSON.stringify(generated.accepted.proposal.livingSurface, null, 2)}\n`);
writeFileSync(resolve(output, "site.html"), generated.accepted.site.pages[0].html);
writeFileSync(resolve(output, "public.html"), generated.accepted.publicSurface.html);
writeFileSync(resolve(output, "operator-before.html"), generated.accepted.operatorSurface.html);
writeFileSync(resolve(output, "operator-after-state.json"), `${JSON.stringify(firstEffect.state, null, 2)}\n`);
writeFileSync(resolve(output, "receipt.json"), `${JSON.stringify(firstEffect.receipt, null, 2)}\n`);

const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  passed: true,
  providerCalls,
  executorCalls,
  attempts: generated.checkpoint.attempts,
  acceptedProposalHash: generated.accepted.proposalHash,
  siteBuildHash: generated.accepted.site.buildHash,
  publicSurfaceBuildHash: generated.accepted.publicSurface.buildHash,
  operatorSurfaceBuildHash: generated.accepted.operatorSurface.buildHash,
  receiptHash: firstEffect.receipt.receiptHash,
  replayedReceiptHash: replay.receipt.receiptHash,
  assertions: {
    firstProposalRejected: generated.checkpoint.attempts[0].accepted === false,
    repairAccepted: generated.checkpoint.attempts[1].accepted === true,
    providerNotCalledOnResume: providerCalls === 2,
    publicProjectionPrivateSafe: !generated.accepted.publicSurface.html.includes("Internal price") && !generated.accepted.publicSurface.html.includes("Send estimate"),
    approvalRequiredBeforeEffect: generated.accepted.operatorSurface.html.includes("Approval required"),
    effectExecutedOnce: executorCalls === 1,
    replayReturnedSameReceipt: firstEffect.receipt.receiptHash === replay.receipt.receiptHash,
    completedStateHasReceipt: firstEffect.state.receipts.length === 1 && firstEffect.state.actions.find((action) => action.id === "action:send")?.status === "completed",
  },
};
report.passed = Object.values(report.assertions).every(Boolean);
writeFileSync(resolve(output, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
process.exit(report.passed ? 0 : 1);
