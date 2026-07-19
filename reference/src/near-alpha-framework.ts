import { sha256 } from "./core.js";
import {
  buildValidationReport,
  finding,
  type ValidationAttribute,
  type ValidationReport,
} from "./validation-contracts.js";

export type NearAlphaMaturity = "research-prototype" | "near-alpha";
export type AgentLifecyclePhase =
  | "discovery"
  | "datasheet-authoring"
  | "design-authoring"
  | "starter-site"
  | "bulk-generation"
  | "post-generation-maintenance"
  | "case-study-evaluation";

export type AgentArtifactKind =
  | "business-datasheet"
  | "evidence-ledger"
  | "style-guide"
  | "design-system"
  | "typography-system"
  | "layout-system"
  | "graphic-brief"
  | "starter-page"
  | "page-batch"
  | "post-generation-patch"
  | "validation-report"
  | "case-study";

export interface AgentWorkspaceArtifact {
  id: string;
  kind: AgentArtifactKind;
  phase: AgentLifecyclePhase;
  status: "draft" | "approved" | "accepted" | "rejected";
  producedBy: string;
  sourceIds: readonly string[];
  dependencyIds: readonly string[];
  contentHash: string;
}

export interface AgentWorkspaceSnapshot {
  id: string;
  version: string;
  maturity: NearAlphaMaturity;
  createdAt: string;
  priorSnapshotHash?: string;
  pageCount: number;
  routeCount: number;
  designAuthorityHash?: string;
  transactionHash?: string;
  artifacts: readonly AgentWorkspaceArtifact[];
  snapshotHash: string;
}

export interface FrameworkMetricSample {
  pageCount: number;
  coldBuildMilliseconds: number;
  incrementalBuildMilliseconds: number;
  devServerStartMilliseconds: number;
  peakRssMiB: number;
  outputBytes: number;
  htmlBytes: number;
  javascriptBytes: number;
  changedPages: number;
  changedArtifacts: number;
  validationMilliseconds: number;
}

export type FrameworkBaselineKind =
  | "hyper-site"
  | "conventional-static-generator"
  | "conventional-ssr-framework"
  | "conventional-spa"
  | "generic-ai-site-builder";

export interface FrameworkBaselineRun {
  id: string;
  kind: FrameworkBaselineKind;
  frameworkName: string;
  frameworkVersion: string;
  runtime: string;
  fixtureId: string;
  machineProfileId: string;
  commands: readonly string[];
  samples: readonly FrameworkMetricSample[];
  resultHash: string;
}

export interface ScientificHypothesis {
  id: string;
  statement: string;
  primaryMetric: keyof FrameworkMetricSample | "acceptedPageRatio" | "duplicateRejectionRecall" | "humanUsefulnessScore";
  direction: "lower" | "higher";
  threshold: number;
  falsificationRule: string;
  baselineRunIds: readonly string[];
  testIds: readonly string[];
}

export interface NetworkScienceStudy {
  id: string;
  graphFixtureId: string;
  simplerBaseline: string;
  metrics: readonly {
    name: "componentCount" | "degreeDistribution" | "assortativity" | "clusteringCoefficient" | "pathLength" | "coverage" | "cannibalizationRisk";
    observed: number;
    baseline: number;
    interpretation: string;
  }[];
  heldOutJudgmentIds: readonly string[];
}

export interface RealUseCaseStudy {
  id: string;
  organizationOrProject: string;
  repositoryRevision: string;
  operatorIds: readonly string[];
  sourceIds: readonly string[];
  initialSiteGoals: readonly string[];
  assignedJobs: readonly string[];
  postGenerationTasks: readonly string[];
  observedOutcomes: readonly string[];
  heldOutJudgmentIds: readonly string[];
  synthetic: boolean;
}

export interface PageExistenceJustification {
  pageId: string;
  userTask: string;
  distinctInformationObjectIds: readonly string[];
  distinctEvidenceIds: readonly string[];
  nearestNeighborPageIds: readonly string[];
  differenceStatement: string;
  lifecycleOwner: string;
}

export interface NearAlphaFrameworkEvaluationInput {
  id: string;
  maturity: NearAlphaMaturity;
  workspace: AgentWorkspaceSnapshot;
  baselineRuns: readonly FrameworkBaselineRun[];
  hypotheses: readonly ScientificHypothesis[];
  networkStudies: readonly NetworkScienceStudy[];
  realUseCases: readonly RealUseCaseStudy[];
  pageJustifications: readonly PageExistenceJustification[];
  measuredScaleCeiling: number;
  claimedScaleCeiling: number;
  requiredScaleTiers?: readonly number[];
}

export interface NearAlphaFrameworkEvaluation {
  id: string;
  maturity: NearAlphaMaturity;
  workspaceHash: string;
  baselineRunHashes: readonly string[];
  measuredScaleCeiling: number;
  claimedScaleCeiling: number;
  validation: ValidationReport;
  evaluationHash: string;
}

export const NEAR_ALPHA_FRAMEWORK_VALIDATION: readonly ValidationAttribute[] = [
  {
    id: "near-alpha.maturity",
    feature: "Explicit near-alpha maturity boundary",
    workflowStep: "classify",
    algorithmChoice: "research-prototype or near-alpha only",
    userEffect: "operators are not told that synthetic software proof is production readiness",
    developerEffect: "release language cannot outrun field evidence",
    validationVector: ["declared maturity", "real use-case count", "live hardware/provider evidence"],
    passVector: ["near-alpha language", "explicit nonclaims"],
    failVector: ["production-ready claim", "production acceptance inferred from synthetic scale"],
    simplerBaseline: "marketing maturity label",
    severity: "hard",
  },
  {
    id: "near-alpha.agent-continuity",
    feature: "Continuous agent workspace across both ends",
    workflowStep: "agent-lifecycle",
    algorithmChoice: "immutable artifact graph spanning initial authoring, assigned generation, and post-generation maintenance",
    userEffect: "an agent can resume the same site workspace before and after bulk generation",
    developerEffect: "continuous means repeated checkpointed invocations, not an opaque perpetual process",
    validationVector: ["datasheets", "design artifacts", "starter pages", "page batches", "maintenance patches", "dependency graph"],
    passVector: ["all three lifecycle regions represented", "artifacts trace dependencies"],
    failVector: ["bulk-only workspace", "post-generation work detached from prior authority", "uncheckpointed autonomous loop"],
    simplerBaseline: "single generation prompt",
    severity: "hard",
  },
  {
    id: "near-alpha.core-framework",
    feature: "Web-framework core-site craftsmanship",
    workflowStep: "author-core-site",
    algorithmChoice: "approved datasheet, design system, typography, layouts, graphics briefs, and starter pages before expansion",
    userEffect: "the framework can create a coherent useful site before it creates a large corpus",
    developerEffect: "bulk generation inherits a real component and design grammar",
    validationVector: ["design system", "typography", "layout", "graphics", "starter pages", "approval state"],
    passVector: ["approved core artifacts precede page batches"],
    failVector: ["landing-page compiler without a core site", "generated design fragments with no shared authority"],
    simplerBaseline: "template plus content loop",
    severity: "hard",
  },
  {
    id: "near-alpha.tdd",
    feature: "Test-driven framework development",
    workflowStep: "verify",
    algorithmChoice: "every hypothesis maps to executable tests and explicit failure thresholds",
    userEffect: "framework behavior changes are tested rather than narrated",
    developerEffect: "regressions and failed theories remain observable",
    validationVector: ["hypothesis IDs", "test IDs", "falsification rules", "negative controls"],
    passVector: ["all hypotheses have tests and falsification rules"],
    failVector: ["testless architectural claim", "success-only fixture"],
    simplerBaseline: "post-hoc benchmark",
    severity: "hard",
  },
  {
    id: "near-alpha.scientific",
    feature: "Scientific comparison protocol",
    workflowStep: "experiment",
    algorithmChoice: "predeclared metrics, frozen fixtures, reproducible commands, conventional baselines, and falsifiable thresholds",
    userEffect: "performance and quality claims can be compared against ordinary frameworks",
    developerEffect: "novel methods must beat or justify themselves against simpler implementations",
    validationVector: ["baseline runs", "framework versions", "machine profile", "commands", "fixture identity", "primary metrics"],
    passVector: ["Hyper Site and at least one conventional baseline share scale tiers and fixture"],
    failVector: ["self-comparison only", "different fixtures", "missing commands", "unversioned baseline"],
    simplerBaseline: "one synthetic timing",
    severity: "hard",
  },
  {
    id: "near-alpha.network-science",
    feature: "Network-science methods with simpler baselines",
    workflowStep: "graph-evaluation",
    algorithmChoice: "graph metrics linked to held-out relevance or cannibalization judgments",
    userEffect: "network concepts must improve page selection or maintenance decisions",
    developerEffect: "graph terminology cannot substitute for predictive evidence",
    validationVector: ["graph fixture", "simpler baseline", "observed metrics", "held-out judgments"],
    passVector: ["at least one study connects graph metrics to held-out outcomes"],
    failVector: ["decorative graph metric", "no simpler baseline", "no held-out judgment"],
    simplerBaseline: "typed adjacency plus rules",
    severity: "hard",
  },
  {
    id: "near-alpha.real-use-cases",
    feature: "Real-use-case and case-study evidence",
    workflowStep: "field-evaluation",
    algorithmChoice: "versioned repositories, named operators, source IDs, assigned jobs, maintenance tasks, and held-out judgments",
    userEffect: "the framework is evaluated on actual work rather than only generated fixtures",
    developerEffect: "case studies become replayable evidence, not testimonials",
    validationVector: ["non-synthetic case", "revision", "operators", "initial goals", "assigned jobs", "maintenance", "held-out judgments"],
    passVector: ["at least one complete non-synthetic case study"],
    failVector: ["case study claims outcomes without revision or judgment evidence"],
    simplerBaseline: "synthetic fixture only",
    severity: "hard",
  },
  {
    id: "near-alpha.page-existence",
    feature: "Page-existence justification",
    workflowStep: "select-pages",
    algorithmChoice: "each page owns a distinct user task, information object, evidence set, difference statement, and lifecycle owner",
    userEffect: "large sites are not justified by route uniqueness or noun swapping",
    developerEffect: "page count is subordinate to usefulness and maintenance cost",
    validationVector: ["page ID", "user task", "information objects", "evidence", "nearest neighbors", "difference", "owner"],
    passVector: ["one justification per measured page"],
    failVector: ["route-only uniqueness", "ownerless page", "no difference from nearest neighbor"],
    simplerBaseline: "unique slug and title",
    severity: "hard",
  },
  {
    id: "near-alpha.framework-baseline",
    feature: "Conventional web-framework baseline",
    workflowStep: "benchmark",
    algorithmChoice: "compare cold build, incremental build, dev startup, memory, output weight, JavaScript, and validation cost",
    userEffect: "Hyper Site is judged as a web framework, not only as a data pipeline",
    developerEffect: "high-performance concepts must show end-to-end value against non-optimized frameworks",
    validationVector: ["same fixture", "same machine", "same scale tiers", "incremental edit", "output bytes", "runtime bytes"],
    passVector: ["at least one conventional baseline run is directly comparable"],
    failVector: ["no baseline", "planning-only timing", "different page semantics", "no incremental edit measurement"],
    simplerBaseline: "ordinary static or SSR framework",
    severity: "hard",
  },
  {
    id: "near-alpha.scale-transition",
    feature: "Measured transition through and beyond 10K pages",
    workflowStep: "scale",
    algorithmChoice: "tiered cold-build, incremental-edit, validation, output, and maintenance measurements",
    userEffect: "operators know where the framework stops behaving like a practical web framework",
    developerEffect: "10K is a measured checkpoint, not a permanent success claim",
    validationVector: ["25", "100", "500", "10000", "claimed ceiling", "post-generation edit metrics"],
    passVector: ["all required tiers measured", "claimed ceiling <= measured ceiling", "10K includes incremental maintenance"],
    failVector: ["planning-only scale", "cold-build-only scale", "claim beyond measured ceiling", "no post-generation edit"],
    simplerBaseline: "single maximum-page benchmark",
    severity: "hard",
  },
];

export function createAgentWorkspaceSnapshot(input: Omit<AgentWorkspaceSnapshot, "snapshotHash">): AgentWorkspaceSnapshot {
  const canonical = canonicalWorkspace(input);
  return { ...canonical, snapshotHash: sha256(JSON.stringify(canonical)) };
}

export function evaluateNearAlphaFramework(input: NearAlphaFrameworkEvaluationInput): NearAlphaFrameworkEvaluation {
  const requiredTiers = [...new Set(input.requiredScaleTiers ?? [25, 100, 500, 10_000])].sort((left, right) => left - right);
  const workspaceIntegrity = canonicalWorkspace(input.workspace);
  if (sha256(JSON.stringify(workspaceIntegrity)) !== input.workspace.snapshotHash) throw new Error("workspace snapshot hash mismatch");
  const maturityPass = input.maturity === "research-prototype" || input.maturity === "near-alpha";
  const phases = new Set(input.workspace.artifacts.map((item) => item.phase));
  const continuityPass = ["datasheet-authoring", "design-authoring", "starter-site", "bulk-generation", "post-generation-maintenance"]
    .every((phase) => phases.has(phase as AgentLifecyclePhase))
    && validateArtifactDependencies(input.workspace.artifacts).length === 0;
  const requiredCoreKinds: AgentArtifactKind[] = [
    "business-datasheet",
    "evidence-ledger",
    "design-system",
    "typography-system",
    "layout-system",
    "graphic-brief",
    "starter-page",
  ];
  const approvedKinds = new Set(input.workspace.artifacts.filter((item) => item.status === "approved" || item.status === "accepted").map((item) => item.kind));
  const firstBatchIndex = input.workspace.artifacts.findIndex((item) => item.kind === "page-batch");
  const coreIndices = requiredCoreKinds.map((kind) => input.workspace.artifacts.findIndex((item) => item.kind === kind));
  const corePass = requiredCoreKinds.every((kind) => approvedKinds.has(kind))
    && firstBatchIndex >= 0
    && coreIndices.every((index) => index >= 0 && index < firstBatchIndex);
  const tddPass = input.hypotheses.length > 0
    && input.hypotheses.every((item) => item.id.trim() && item.testIds.length > 0 && item.falsificationRule.trim() && Number.isFinite(item.threshold));
  const baselineErrors = validateBaselines(input.baselineRuns, requiredTiers);
  const hyperRuns = input.baselineRuns.filter((item) => item.kind === "hyper-site");
  const conventionalRuns = input.baselineRuns.filter((item) => item.kind !== "hyper-site" && item.kind !== "generic-ai-site-builder");
  const scientificPass = baselineErrors.length === 0 && hyperRuns.length > 0 && conventionalRuns.length > 0
    && input.hypotheses.every((item) => item.baselineRunIds.length > 0 && item.baselineRunIds.every((id) => input.baselineRuns.some((run) => run.id === id)));
  const networkPass = input.networkStudies.length > 0 && input.networkStudies.every((study) =>
    study.id.trim() && study.graphFixtureId.trim() && study.simplerBaseline.trim()
    && study.metrics.length > 0 && study.heldOutJudgmentIds.length > 0
    && study.metrics.every((metric) => Number.isFinite(metric.observed) && Number.isFinite(metric.baseline) && metric.interpretation.trim()));
  const realUseCases = input.realUseCases.filter((item) => !item.synthetic);
  const realUsePass = realUseCases.length > 0 && realUseCases.every((item) =>
    item.id.trim() && item.repositoryRevision.trim() && item.operatorIds.length > 0 && item.sourceIds.length > 0
    && item.initialSiteGoals.length > 0 && item.assignedJobs.length > 0 && item.postGenerationTasks.length > 0
    && item.heldOutJudgmentIds.length > 0);
  const pageJustificationErrors = validatePageJustifications(input.pageJustifications, input.workspace.pageCount);
  const baselinePass = scientificPass && comparableFrameworkRuns(input.baselineRuns, requiredTiers);
  const scalePass = validateScaleTransition(input.baselineRuns, requiredTiers, input.measuredScaleCeiling, input.claimedScaleCeiling);
  const validation = buildValidationReport(`near-alpha-framework:${input.id}`, NEAR_ALPHA_FRAMEWORK_VALIDATION, [
    finding("near-alpha.maturity", maturityPass ? "pass" : "fail", `declared maturity=${input.maturity}; production readiness is outside this contract`),
    finding("near-alpha.agent-continuity", continuityPass ? "pass" : "fail", continuityPass ? `${input.workspace.artifacts.length} artifacts span initial authoring, bulk generation, and maintenance` : "workspace is bulk-only, incomplete, or has broken dependencies"),
    finding("near-alpha.core-framework", corePass ? "pass" : "fail", corePass ? "approved datasheet/design/typography/layout/graphics/starter-page artifacts precede the first batch" : "core-site artifacts are missing, unapproved, or occur after bulk generation"),
    finding("near-alpha.tdd", tddPass ? "pass" : "fail", `${input.hypotheses.length} hypotheses with executable test mappings`),
    finding("near-alpha.scientific", scientificPass ? "pass" : "fail", baselineErrors.length === 0 ? `${input.baselineRuns.length} reproducible framework runs and ${input.hypotheses.length} falsifiable hypotheses` : baselineErrors.join("; ")),
    finding("near-alpha.network-science", networkPass ? "pass" : "fail", networkPass ? `${input.networkStudies.length} graph studies include simpler baselines and held-out judgments` : "network-science evidence is absent or disconnected from held-out outcomes"),
    finding("near-alpha.real-use-cases", realUsePass ? "pass" : "pending", realUsePass ? `${realUseCases.length} complete non-synthetic case studies` : "no complete non-synthetic case study has passed yet"),
    finding("near-alpha.page-existence", pageJustificationErrors.length === 0 ? "pass" : "fail", pageJustificationErrors.length === 0 ? `${input.pageJustifications.length} measured pages have lifecycle justification` : pageJustificationErrors.join("; ")),
    finding("near-alpha.framework-baseline", baselinePass ? "pass" : "fail", baselinePass ? "Hyper Site and at least one conventional framework share fixture, machine, and scale tiers" : "no directly comparable conventional web-framework baseline"),
    finding("near-alpha.scale-transition", scalePass ? "pass" : "fail", `measured ceiling=${input.measuredScaleCeiling}; claimed ceiling=${input.claimedScaleCeiling}; required tiers=${requiredTiers.join(",")}`),
  ]);
  const canonical = {
    id: input.id,
    maturity: input.maturity,
    workspaceHash: input.workspace.snapshotHash,
    baselineRunHashes: input.baselineRuns.map((item) => item.resultHash).sort(),
    measuredScaleCeiling: input.measuredScaleCeiling,
    claimedScaleCeiling: input.claimedScaleCeiling,
    validationHash: validation.reportHash,
  };
  return { ...canonical, validation, evaluationHash: sha256(JSON.stringify(canonical)) };
}

export function hashFrameworkBaselineRun(input: Omit<FrameworkBaselineRun, "resultHash">): FrameworkBaselineRun {
  const canonical = canonicalBaselineRun(input);
  return { ...canonical, resultHash: sha256(JSON.stringify(canonical)) };
}

function canonicalWorkspace(input: Omit<AgentWorkspaceSnapshot, "snapshotHash"> | AgentWorkspaceSnapshot): Omit<AgentWorkspaceSnapshot, "snapshotHash"> {
  return {
    id: input.id.trim(),
    version: input.version.trim(),
    maturity: input.maturity,
    createdAt: input.createdAt.trim(),
    ...(input.priorSnapshotHash === undefined ? {} : { priorSnapshotHash: input.priorSnapshotHash.trim() }),
    pageCount: input.pageCount,
    routeCount: input.routeCount,
    ...(input.designAuthorityHash === undefined ? {} : { designAuthorityHash: input.designAuthorityHash.trim() }),
    ...(input.transactionHash === undefined ? {} : { transactionHash: input.transactionHash.trim() }),
    artifacts: input.artifacts.map((item) => ({
      id: item.id.trim(),
      kind: item.kind,
      phase: item.phase,
      status: item.status,
      producedBy: item.producedBy.trim(),
      sourceIds: sorted(item.sourceIds),
      dependencyIds: sorted(item.dependencyIds),
      contentHash: item.contentHash.trim(),
    })),
  };
}

function canonicalBaselineRun(input: Omit<FrameworkBaselineRun, "resultHash"> | FrameworkBaselineRun): Omit<FrameworkBaselineRun, "resultHash"> {
  return {
    id: input.id.trim(),
    kind: input.kind,
    frameworkName: input.frameworkName.trim(),
    frameworkVersion: input.frameworkVersion.trim(),
    runtime: input.runtime.trim(),
    fixtureId: input.fixtureId.trim(),
    machineProfileId: input.machineProfileId.trim(),
    commands: input.commands.map((item) => item.trim()).filter(Boolean),
    samples: [...input.samples].sort((left, right) => left.pageCount - right.pageCount),
  };
}

function validateArtifactDependencies(artifacts: readonly AgentWorkspaceArtifact[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const artifact of artifacts) {
    if (!artifact.id.trim() || ids.has(artifact.id)) errors.push(`invalid or duplicate artifact ${artifact.id}`);
    ids.add(artifact.id);
    if (!artifact.producedBy.trim() || !artifact.contentHash.trim()) errors.push(`artifact ${artifact.id} lacks producer or hash`);
    if (artifact.sourceIds.length === 0 && artifact.kind !== "post-generation-patch") errors.push(`artifact ${artifact.id} lacks sources`);
  }
  for (const artifact of artifacts) for (const dependencyId of artifact.dependencyIds) {
    if (!ids.has(dependencyId)) errors.push(`artifact ${artifact.id} references unknown dependency ${dependencyId}`);
    if (dependencyId === artifact.id) errors.push(`artifact ${artifact.id} depends on itself`);
  }
  return [...new Set(errors)].sort();
}

function validateBaselines(runs: readonly FrameworkBaselineRun[], requiredTiers: readonly number[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const run of runs) {
    if (!run.id.trim() || ids.has(run.id)) errors.push(`invalid or duplicate baseline run ${run.id}`);
    ids.add(run.id);
    const canonical = canonicalBaselineRun(run);
    if (sha256(JSON.stringify(canonical)) !== run.resultHash) errors.push(`baseline ${run.id} result hash mismatch`);
    if (!run.frameworkName.trim() || !run.frameworkVersion.trim() || !run.runtime.trim()) errors.push(`baseline ${run.id} lacks versioned framework/runtime identity`);
    if (!run.fixtureId.trim() || !run.machineProfileId.trim() || run.commands.length === 0) errors.push(`baseline ${run.id} lacks fixture, machine, or commands`);
    const pageCounts = new Set(run.samples.map((item) => item.pageCount));
    for (const tier of requiredTiers) if (!pageCounts.has(tier)) errors.push(`baseline ${run.id} lacks scale tier ${tier}`);
    for (const sample of run.samples) {
      const numeric = Object.values(sample);
      if (numeric.some((value) => !Number.isFinite(value) || value < 0)) errors.push(`baseline ${run.id} has invalid metrics at ${sample.pageCount}`);
      if (sample.changedPages < 1 || sample.changedArtifacts < 1) errors.push(`baseline ${run.id} lacks post-generation incremental edit at ${sample.pageCount}`);
    }
  }
  return [...new Set(errors)].sort();
}

function comparableFrameworkRuns(runs: readonly FrameworkBaselineRun[], requiredTiers: readonly number[]): boolean {
  const hyper = runs.filter((item) => item.kind === "hyper-site");
  const conventional = runs.filter((item) => item.kind === "conventional-static-generator" || item.kind === "conventional-ssr-framework" || item.kind === "conventional-spa");
  return hyper.some((left) => conventional.some((right) =>
    left.fixtureId === right.fixtureId
    && left.machineProfileId === right.machineProfileId
    && requiredTiers.every((tier) => left.samples.some((sample) => sample.pageCount === tier) && right.samples.some((sample) => sample.pageCount === tier))));
}

function validatePageJustifications(justifications: readonly PageExistenceJustification[], pageCount: number): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const item of justifications) {
    if (!item.pageId.trim() || ids.has(item.pageId)) errors.push(`invalid or duplicate page justification ${item.pageId}`);
    ids.add(item.pageId);
    if (!item.userTask.trim() || !item.differenceStatement.trim() || !item.lifecycleOwner.trim()) errors.push(`page ${item.pageId} lacks task, difference, or owner`);
    if (item.distinctInformationObjectIds.length === 0 || item.distinctEvidenceIds.length === 0) errors.push(`page ${item.pageId} lacks distinct information or evidence`);
  }
  if (justifications.length !== pageCount) errors.push(`page justifications ${justifications.length} do not match measured page count ${pageCount}`);
  return [...new Set(errors)].sort();
}

function validateScaleTransition(
  runs: readonly FrameworkBaselineRun[],
  requiredTiers: readonly number[],
  measuredScaleCeiling: number,
  claimedScaleCeiling: number,
): boolean {
  if (!Number.isInteger(measuredScaleCeiling) || measuredScaleCeiling < 1) return false;
  if (!Number.isInteger(claimedScaleCeiling) || claimedScaleCeiling < 1 || claimedScaleCeiling > measuredScaleCeiling) return false;
  const hyperRuns = runs.filter((item) => item.kind === "hyper-site");
  return hyperRuns.some((run) => requiredTiers.every((tier) => {
    const sample = run.samples.find((item) => item.pageCount === tier);
    return Boolean(sample && sample.incrementalBuildMilliseconds >= 0 && sample.changedPages >= 1 && sample.validationMilliseconds >= 0);
  })) && requiredTiers.every((tier) => tier <= measuredScaleCeiling);
}

function sorted(values: readonly string[]): string[] {
  return [...new Set(values.map((item) => item.trim()).filter(Boolean))].sort();
}
