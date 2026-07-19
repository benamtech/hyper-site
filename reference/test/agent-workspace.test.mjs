import assert from "node:assert/strict";
import test from "node:test";
import {
  appendAgentWorkspaceArtifact,
  createAgentWorkspaceSnapshot,
  planAgentWorkspaceInvalidation,
  replaceAgentWorkspaceArtifact,
  summarizeWorkspaceLifecycle,
} from "../dist/index.js";

function artifact(id, kind, phase, dependencyIds = []) {
  return {
    id,
    kind,
    phase,
    status: "approved",
    producedBy: "agent:workspace-fixture",
    sourceIds: kind === "post-generation-patch" ? [] : ["source:fixture"],
    dependencyIds,
    contentHash: `hash:${id}`,
  };
}

function workspace() {
  return createAgentWorkspaceSnapshot({
    id: "workspace:continuous",
    version: "1",
    maturity: "near-alpha",
    createdAt: "2026-07-18T08:30:00Z",
    pageCount: 2,
    routeCount: 2,
    designAuthorityHash: "design:authority",
    transactionHash: "transaction:1",
    artifacts: [
      artifact("artifact:datasheet", "business-datasheet", "datasheet-authoring"),
      artifact("artifact:evidence", "evidence-ledger", "datasheet-authoring", ["artifact:datasheet"]),
      artifact("artifact:design", "design-system", "design-authoring", ["artifact:datasheet"]),
      artifact("artifact:type", "typography-system", "design-authoring", ["artifact:design"]),
      artifact("artifact:layout", "layout-system", "design-authoring", ["artifact:design"]),
      artifact("artifact:graphics", "graphic-brief", "design-authoring", ["artifact:design"]),
      artifact("artifact:starter", "starter-page", "starter-site", ["artifact:evidence", "artifact:type", "artifact:layout", "artifact:graphics"]),
      artifact("artifact:batch", "page-batch", "bulk-generation", ["artifact:starter", "artifact:evidence"]),
      artifact("artifact:patch", "post-generation-patch", "post-generation-maintenance", ["artifact:batch", "artifact:design"]),
    ],
  });
}

test("workspace invalidation follows transitive artifact dependencies and preserves unaffected hashes", () => {
  const snapshot = workspace();
  const plan = planAgentWorkspaceInvalidation(snapshot, ["artifact:design"]);
  assert.deepEqual(plan.invalidatedArtifactIds, [
    "artifact:batch",
    "artifact:design",
    "artifact:graphics",
    "artifact:layout",
    "artifact:patch",
    "artifact:starter",
    "artifact:type",
  ]);
  assert.deepEqual(plan.unaffectedArtifactIds, ["artifact:datasheet", "artifact:evidence"]);
  assert.ok(plan.planHash.length > 20);
});

test("workspace append creates a new immutable snapshot linked to the prior hash", () => {
  const current = workspace();
  const next = appendAgentWorkspaceArtifact(
    current,
    artifact("artifact:report", "validation-report", "case-study-evaluation", ["artifact:patch"]),
    "2",
    "2026-07-18T08:31:00Z",
  );
  assert.equal(next.priorSnapshotHash, current.snapshotHash);
  assert.equal(next.version, "2");
  assert.equal(next.artifacts.length, current.artifacts.length + 1);
  assert.notEqual(next.snapshotHash, current.snapshotHash);
});

test("workspace append rejects unknown dependencies", () => {
  assert.throws(() => appendAgentWorkspaceArtifact(
    workspace(),
    artifact("artifact:invalid", "validation-report", "case-study-evaluation", ["artifact:missing"]),
    "2",
    "2026-07-18T08:31:00Z",
  ), /unknown dependency/);
});

test("workspace replacement rejects dependency cycles", () => {
  const current = workspace();
  assert.throws(() => replaceAgentWorkspaceArtifact(
    current,
    artifact("artifact:datasheet", "business-datasheet", "datasheet-authoring", ["artifact:patch"]),
    "2",
    "2026-07-18T08:31:00Z",
  ), /dependency cycle/);
});

test("workspace lifecycle reports both authoring and maintenance ends", () => {
  const coverage = summarizeWorkspaceLifecycle(workspace());
  assert.equal(coverage.hasInitialAuthoring, true);
  assert.equal(coverage.hasStarterSite, true);
  assert.equal(coverage.hasBulkGeneration, true);
  assert.equal(coverage.hasPostGenerationMaintenance, true);
  assert.equal(coverage.complete, true);
});
