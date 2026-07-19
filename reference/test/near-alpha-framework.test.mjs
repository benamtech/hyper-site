import assert from "node:assert/strict";
import test from "node:test";
import {
  createAgentWorkspaceSnapshot,
  evaluateNearAlphaFramework,
  hashFrameworkBaselineRun,
} from "../dist/index.js";

const TIERS = [25, 100, 500, 10_000];

function artifact(id, kind, phase, dependencyIds = []) {
  return {
    id,
    kind,
    phase,
    status: "approved",
    producedBy: "agent:fixture",
    sourceIds: ["source:fixture"],
    dependencyIds,
    contentHash: `hash:${id}`,
  };
}

function completeWorkspace() {
  return createAgentWorkspaceSnapshot({
    id: "workspace:fixture",
    version: "1",
    maturity: "near-alpha",
    createdAt: "2026-07-18T08:00:00Z",
    pageCount: 2,
    routeCount: 2,
    designAuthorityHash: "design:fixture",
    transactionHash: "transaction:fixture",
    artifacts: [
      artifact("artifact:datasheet", "business-datasheet", "datasheet-authoring"),
      artifact("artifact:evidence", "evidence-ledger", "datasheet-authoring", ["artifact:datasheet"]),
      artifact("artifact:style", "style-guide", "design-authoring", ["artifact:datasheet"]),
      artifact("artifact:design", "design-system", "design-authoring", ["artifact:style"]),
      artifact("artifact:type", "typography-system", "design-authoring", ["artifact:design"]),
      artifact("artifact:layout", "layout-system", "design-authoring", ["artifact:design"]),
      artifact("artifact:graphics", "graphic-brief", "design-authoring", ["artifact:style"]),
      artifact("artifact:starter", "starter-page", "starter-site", ["artifact:design", "artifact:type", "artifact:layout", "artifact:graphics"]),
      artifact("artifact:batch", "page-batch", "bulk-generation", ["artifact:starter", "artifact:evidence"]),
      artifact("artifact:patch", "post-generation-patch", "post-generation-maintenance", ["artifact:batch", "artifact:design"]),
      artifact("artifact:case", "case-study", "case-study-evaluation", ["artifact:patch"]),
    ],
  });
}

function sample(pageCount, multiplier = 1, changedPages = 1) {
  return {
    pageCount,
    coldBuildMilliseconds: pageCount * 2 * multiplier,
    incrementalBuildMilliseconds: Math.max(1, Math.log2(pageCount) * 10 * multiplier),
    devServerStartMilliseconds: 250 * multiplier,
    peakRssMiB: 256 * multiplier,
    outputBytes: pageCount * 5000,
    htmlBytes: pageCount * 4200,
    javascriptBytes: pageCount * 50,
    changedPages,
    changedArtifacts: 1,
    validationMilliseconds: pageCount * 0.75 * multiplier,
  };
}

function baseline(id, kind, name, multiplier = 1, changedPages = 1) {
  return hashFrameworkBaselineRun({
    id,
    kind,
    frameworkName: name,
    frameworkVersion: "1.0.0",
    runtime: "node-22-linux-x64",
    fixtureId: "fixture:framework-comparison",
    machineProfileId: "machine:shared",
    commands: ["install", "build", "incremental-edit", "serve", "measure"],
    samples: TIERS.map((tier) => sample(tier, multiplier, changedPages)),
  });
}

function completeInput(overrides = {}) {
  const hyper = baseline("run:hyper", "hyper-site", "Hyper Site", 1);
  const conventional = baseline("run:conventional", "conventional-static-generator", "Conventional Static", 1.3);
  return {
    id: "evaluation:fixture",
    maturity: "near-alpha",
    workspace: completeWorkspace(),
    baselineRuns: [hyper, conventional],
    hypotheses: [{
      id: "hypothesis:incremental",
      statement: "Hyper Site incremental edits remain bounded through 10,000 pages.",
      primaryMetric: "incrementalBuildMilliseconds",
      direction: "lower",
      threshold: 1,
      falsificationRule: "Reject when the preregistered conventional baseline is faster by the threshold on two consecutive tiers.",
      baselineRunIds: [hyper.id, conventional.id],
      testIds: ["test:incremental-build", "test:negative-control"],
    }],
    networkStudies: [{
      id: "study:graph",
      graphFixtureId: "graph:fixture",
      simplerBaseline: "typed adjacency plus hard rules",
      metrics: [{
        name: "cannibalizationRisk",
        observed: 0.1,
        baseline: 0.2,
        interpretation: "Lower held-out overlap risk is useful only if relevance judgments also pass.",
      }],
      heldOutJudgmentIds: ["judgment:graph:1"],
    }],
    realUseCases: [{
      id: "case:real",
      organizationOrProject: "Fixture Business",
      repositoryRevision: "revision:abc",
      operatorIds: ["operator:1"],
      sourceIds: ["source:fixture"],
      initialSiteGoals: ["create a coherent starter site"],
      assignedJobs: ["generate two evidence-bound pages"],
      postGenerationTasks: ["change typography without regenerating prose"],
      observedOutcomes: ["operator completed the defined workflow"],
      heldOutJudgmentIds: ["judgment:case:1"],
      synthetic: false,
    }],
    pageJustifications: [
      {
        pageId: "page:1",
        userTask: "understand the primary workflow",
        distinctInformationObjectIds: ["information:1"],
        distinctEvidenceIds: ["evidence:1"],
        nearestNeighborPageIds: ["page:2"],
        differenceStatement: "This page explains the workflow while page 2 supports a decision.",
        lifecycleOwner: "owner:content",
      },
      {
        pageId: "page:2",
        userTask: "choose the next action",
        distinctInformationObjectIds: ["information:2"],
        distinctEvidenceIds: ["evidence:2"],
        nearestNeighborPageIds: ["page:1"],
        differenceStatement: "This page supports a decision rather than explaining the workflow.",
        lifecycleOwner: "owner:conversion",
      },
    ],
    measuredScaleCeiling: 10_000,
    claimedScaleCeiling: 10_000,
    ...overrides,
  };
}

test("near-alpha evaluation rejects a bulk-only pipeline posture", () => {
  const workspace = createAgentWorkspaceSnapshot({
    id: "workspace:bulk-only",
    version: "1",
    maturity: "near-alpha",
    createdAt: "2026-07-18T08:00:00Z",
    pageCount: 1,
    routeCount: 1,
    artifacts: [artifact("artifact:batch-only", "page-batch", "bulk-generation")],
  });
  const result = evaluateNearAlphaFramework({
    ...completeInput(),
    id: "evaluation:bulk-only",
    workspace,
    pageJustifications: [{
      pageId: "page:1",
      userTask: "generic task",
      distinctInformationObjectIds: ["information:1"],
      distinctEvidenceIds: ["evidence:1"],
      nearestNeighborPageIds: [],
      differenceStatement: "Only page in fixture.",
      lifecycleOwner: "owner:fixture",
    }],
  });
  assert.equal(result.validation.passes, false);
  assert.ok(result.validation.hardFailures.includes("near-alpha.agent-continuity"));
  assert.ok(result.validation.hardFailures.includes("near-alpha.core-framework"));
});

test("near-alpha evaluation passes only with continuous authoring, real cases, network evidence, and conventional baselines", () => {
  const result = evaluateNearAlphaFramework(completeInput());
  assert.equal(result.validation.passes, true);
  assert.equal(result.validation.hardFailures.length, 0);
  assert.equal(result.validation.pending.length, 0);
  assert.equal(result.maturity, "near-alpha");
});

test("near-alpha evaluation rejects scale claims without measured post-generation edits", () => {
  const brokenHyper = baseline("run:broken-hyper", "hyper-site", "Hyper Site", 1, 0);
  const conventional = baseline("run:conventional", "conventional-static-generator", "Conventional Static", 1.3);
  const result = evaluateNearAlphaFramework(completeInput({
    baselineRuns: [brokenHyper, conventional],
    hypotheses: [{
      id: "hypothesis:broken",
      statement: "Broken fixture should fail.",
      primaryMetric: "incrementalBuildMilliseconds",
      direction: "lower",
      threshold: 1,
      falsificationRule: "Reject on missing incremental edit.",
      baselineRunIds: [brokenHyper.id, conventional.id],
      testIds: ["test:broken"],
    }],
    measuredScaleCeiling: 10_000,
    claimedScaleCeiling: 25_000,
  }));
  assert.equal(result.validation.passes, false);
  assert.ok(result.validation.hardFailures.includes("near-alpha.scientific"));
  assert.ok(result.validation.hardFailures.includes("near-alpha.framework-baseline"));
  assert.ok(result.validation.hardFailures.includes("near-alpha.scale-transition"));
});
