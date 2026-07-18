import {
  evaluateNearAlphaFramework,
  type NearAlphaFrameworkEvaluation,
  type NearAlphaFrameworkEvaluationInput,
  type RealUseCaseStudy,
} from "./near-alpha-framework.js";

export function evaluateNearAlphaReleaseCandidate(
  input: NearAlphaFrameworkEvaluationInput,
): NearAlphaFrameworkEvaluation {
  const completeCases = input.realUseCases.filter(isCompleteRealCase);
  if (completeCases.length === 0) {
    throw new Error("near-alpha release candidate requires at least one complete non-synthetic case study");
  }
  const evaluation = evaluateNearAlphaFramework(input);
  if (!evaluation.validation.passes) {
    throw new Error(`near-alpha release candidate validation failed: ${evaluation.validation.hardFailures.join(", ")}`);
  }
  if (evaluation.validation.pending.length > 0) {
    throw new Error(`near-alpha release candidate has pending validation: ${evaluation.validation.pending.join(", ")}`);
  }
  return evaluation;
}

function isCompleteRealCase(item: RealUseCaseStudy): boolean {
  return !item.synthetic
    && Boolean(item.id.trim())
    && Boolean(item.organizationOrProject.trim())
    && Boolean(item.repositoryRevision.trim())
    && item.operatorIds.length > 0
    && item.sourceIds.length > 0
    && item.initialSiteGoals.length > 0
    && item.assignedJobs.length > 0
    && item.postGenerationTasks.length > 0
    && item.observedOutcomes.length > 0
    && item.heldOutJudgmentIds.length > 0;
}
