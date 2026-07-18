import assert from "node:assert/strict";
import test from "node:test";
import {
  appendAgentWorkspaceArtifact,
  createAgentWorkspaceSnapshot,
} from "../dist/index.js";

test("workspace artifacts never infer canonical page or route counts", () => {
  const snapshot = createAgentWorkspaceSnapshot({
    id: "workspace:cardinality",
    version: "1",
    maturity: "near-alpha",
    createdAt: "2026-07-18T09:00:00Z",
    pageCount: 7,
    routeCount: 7,
    artifacts: [{
      id: "artifact:datasheet",
      kind: "business-datasheet",
      phase: "datasheet-authoring",
      status: "approved",
      producedBy: "agent:fixture",
      sourceIds: ["source:fixture"],
      dependencyIds: [],
      contentHash: "hash:datasheet",
    }],
  });
  const next = appendAgentWorkspaceArtifact(snapshot, {
    id: "artifact:starter",
    kind: "starter-page",
    phase: "starter-site",
    status: "approved",
    producedBy: "agent:fixture",
    sourceIds: ["source:fixture"],
    dependencyIds: ["artifact:datasheet"],
    contentHash: "hash:starter",
  }, "2", "2026-07-18T09:01:00Z");
  assert.equal(next.pageCount, 7);
  assert.equal(next.routeCount, 7);
});
