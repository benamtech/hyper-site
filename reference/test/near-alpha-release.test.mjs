import assert from "node:assert/strict";
import test from "node:test";
import { evaluateNearAlphaReleaseCandidate } from "../dist/index.js";

test("near-alpha release candidate hard-rejects synthetic-only evidence", () => {
  assert.throws(() => evaluateNearAlphaReleaseCandidate({
    realUseCases: [{
      id: "case:synthetic",
      organizationOrProject: "Synthetic Fixture",
      repositoryRevision: "fixture",
      operatorIds: ["agent:fixture"],
      sourceIds: ["source:fixture"],
      initialSiteGoals: ["fixture"],
      assignedJobs: ["fixture"],
      postGenerationTasks: ["fixture"],
      observedOutcomes: ["fixture"],
      heldOutJudgmentIds: ["judgment:fixture"],
      synthetic: true,
    }],
  }), /requires at least one complete non-synthetic case study/);
});
