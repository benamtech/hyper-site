import assert from "node:assert/strict";
import test from "node:test";

import {
  agencyBlendRadius,
  approvalBoundaryCurvature,
  compileLivingSurface,
  projectLivingSurface,
  validateLivingSurface,
} from "../dist/living-surface.js";

function fixture() {
  return {
    schemaVersion: 1,
    id: "amtech-public-employee",
    title: "AMTECH AI Employee",
    purpose: "Complete bounded office work with visible evidence, approvals and receipts.",
    currentTask: "Prepare and approve a customer estimate",
    governanceThreshold: 0.6,
    evidenceIds: ["e:pricing", "e:scope"],
    informationObjects: [
      { id: "info:scope", title: "Approved scope", body: "Exterior repaint with documented preparation.", visibility: "both", evidenceIds: ["e:scope"] },
      { id: "info:margin", title: "Margin notes", body: "Operator-only pricing assumptions.", visibility: "operator", evidenceIds: ["e:pricing"] },
    ],
    actions: [
      { id: "action:review", label: "Review estimate", description: "Open the evidence-backed draft.", visibility: "both", authority: "user", status: "available", risk: 0.2, agency: 0.9, evidenceIds: ["e:scope"] },
      { id: "action:send", label: "Send estimate", description: "Send the approved estimate to the customer.", visibility: "operator", authority: "mixed", status: "available", risk: 0.85, agency: 0.45, evidenceIds: ["e:pricing", "e:scope"], approvalId: "approval:send" },
    ],
    approvals: [
      { id: "approval:send", actionId: "action:send", summary: "Owner approval required before external delivery.", requestedBy: "agent", status: "pending", visibility: "operator" },
    ],
    receipts: [],
    nodes: [
      { id: "node:work", kind: "work", title: "Estimate ready", body: "The draft is complete and waiting for review.", visibility: "both", field: { visibility: 1, scale: 1, curvature: 0.1, density: 0.7, governance: 0.3, agency: 0.8, relevance: 1, valence: 0.7, urgency: 0.75 }, informationObjectIds: ["info:scope"], actionIds: ["action:review"], evidenceIds: ["e:scope"] },
      { id: "node:approval", kind: "approval", title: "Delivery gate", body: "External delivery remains blocked until approval.", visibility: "operator", field: { visibility: 1, scale: 1, curvature: 0.8, density: 0.5, governance: 1, agency: 0.4, relevance: 0.95, valence: 0.4, urgency: 0.9 }, informationObjectIds: ["info:margin"], actionIds: ["action:send"], evidenceIds: ["e:pricing", "e:scope"] },
    ],
    runtime: { status: "waiting-approval", activeAgents: 1, queueDepth: 0, pendingApprovals: 1, costUsd: 0.18, lastHeartbeatAt: "2026-07-19T06:00:00.000Z" },
  };
}

test("public and operator projections enforce data visibility before rendering", () => {
  const source = fixture();
  const publicBuild = compileLivingSurface(source, "public");
  const operatorBuild = compileLivingSurface(source, "operator");

  assert.equal(publicBuild.projection.state.nodes.length, 1);
  assert.equal(publicBuild.projection.state.actions.length, 1);
  assert.equal(publicBuild.html.includes("Margin notes"), false);
  assert.equal(publicBuild.html.includes("Send estimate"), false);
  assert.match(publicBuild.html, /Estimate ready/);

  assert.equal(operatorBuild.projection.state.nodes.length, 1);
  assert.equal(operatorBuild.projection.state.actions[0].status, "approval-required");
  assert.match(operatorBuild.html, /Delivery gate/);
  assert.match(operatorBuild.html, /Approval required/);
});

test("living surface compilation is deterministic under source reordering", () => {
  const source = fixture();
  const first = compileLivingSurface(source, "operator");
  const second = compileLivingSurface({
    ...source,
    evidenceIds: [...source.evidenceIds].reverse(),
    informationObjects: [...source.informationObjects].reverse(),
    actions: [...source.actions].reverse(),
    nodes: [...source.nodes].reverse(),
  }, "operator");
  assert.equal(first.projection.stateHash, second.projection.stateHash);
  assert.equal(first.htmlHash, second.htmlHash);
  assert.equal(first.buildHash, second.buildHash);
});

test("agency and approval field functions preserve declared direction", () => {
  assert.equal(agencyBlendRadius(1, 20), 0);
  assert.equal(agencyBlendRadius(0, 20), 20);
  assert(approvalBoundaryCurvature(0.9, 0.6) > approvalBoundaryCurvature(0.2, 0.6));
});

test("renderer escapes hostile content and emits decision explanations", () => {
  const source = fixture();
  source.nodes[0].body = "5 < 7 & <script>alert(1)</script>";
  const build = compileLivingSurface(source, "public");
  assert.equal(build.html.includes("<script>alert(1)</script>"), false);
  assert.match(build.html, /5 &lt; 7 &amp; &lt;script&gt;/);
  assert.match(build.html, /Why this is here/);
});

test("validation rejects invalid vectors and missing references", () => {
  const invalidVector = fixture();
  invalidVector.nodes[0].field.agency = 1.2;
  assert.throws(() => validateLivingSurface(invalidVector), /between 0 and 1/);

  const missingReference = fixture();
  missingReference.nodes[0].actionIds = ["action:missing"];
  assert.throws(() => projectLivingSurface(missingReference, "public"), /references missing id action:missing/);
});
