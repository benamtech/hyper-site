import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const COMPARATORS = new Set(["==", "!=", ">", ">=", "<", "<="]);
const SHA_PATTERN = /^[0-9a-f]{40}$/;

export function validateMetaPlan(plan) {
  const errors = [];
  const requireArray = (value, path) => {
    if (!Array.isArray(value) || value.length === 0) {
      errors.push(`${path} must be a non-empty array`);
      return [];
    }
    return value;
  };
  const indexUnique = (items, path) => {
    const index = new Map();
    for (const item of items) {
      if (!item || typeof item !== "object" || typeof item.id !== "string" || !item.id.trim()) {
        errors.push(`${path} contains an item without a non-empty id`);
        continue;
      }
      if (index.has(item.id)) errors.push(`${path} contains duplicate id ${item.id}`);
      index.set(item.id, item);
    }
    return index;
  };
  const validateMetrics = (metrics, path) => {
    for (const [index, item] of requireArray(metrics, path).entries()) {
      if (!item || typeof item.metric !== "string" || !item.metric.trim()) errors.push(`${path}[${index}].metric is required`);
      if (!COMPARATORS.has(item?.comparator)) errors.push(`${path}[${index}].comparator is invalid`);
      if (!(typeof item?.threshold === "number" || typeof item?.threshold === "string" || typeof item?.threshold === "boolean")) {
        errors.push(`${path}[${index}].threshold must be scalar`);
      }
    }
  };

  if (!plan || typeof plan !== "object") return ["plan must be an object"];
  if (plan.id !== "META-PLAN-V3") errors.push("plan.id must be META-PLAN-V3");
  if (!SHA_PATTERN.test(plan.baselineSha ?? "")) errors.push("baselineSha must be a full 40-character commit SHA");
  if (plan.branchPolicy?.mergeState !== "draft") errors.push("branchPolicy.mergeState must remain draft until outcome gates pass");

  for (const key of ["red", "green", "refactor"]) {
    if (typeof plan.tddPolicy?.[key] !== "string" || !plan.tddPolicy[key].trim()) errors.push(`tddPolicy.${key} is required`);
  }

  const constraints = new Set(requireArray(plan.constraints, "constraints"));
  for (const required of ["zero_tech_killed", "all_existing_systems_preserved", "hyper-content_depends_on_hyper-site_only"]) {
    if (!constraints.has(required)) errors.push(`missing required constraint ${required}`);
  }

  const workstreams = indexUnique(requireArray(plan.workstreams, "workstreams"), "workstreams");
  const phases = indexUnique(requireArray(plan.phases, "phases"), "phases");
  const steps = indexUnique(requireArray(plan.steps, "steps"), "steps");
  const outcomes = indexUnique(requireArray(plan.planOutcomes, "planOutcomes"), "planOutcomes");
  const hypotheses = indexUnique(requireArray(plan.researchHypotheses, "researchHypotheses"), "researchHypotheses");

  const technologyNames = new Set();
  for (const [index, placement] of requireArray(plan.techPlacements, "techPlacements").entries()) {
    const path = `techPlacements[${index}]`;
    if (!placement?.technology) errors.push(`${path}.technology is required`);
    if (technologyNames.has(placement?.technology)) errors.push(`${path} duplicates technology ${placement?.technology}`);
    technologyNames.add(placement?.technology);
    if (!workstreams.has(placement?.owner)) errors.push(`${path}.owner ${placement?.owner} does not exist`);
    if (placement?.state !== "preserved") errors.push(`${path}.state must be preserved under zero_tech_killed`);
    if (!placement?.role || !placement?.activation) errors.push(`${path} requires role and activation`);
  }

  const phaseOrder = new Map([...phases.keys()].map((id, index) => [id, index]));
  for (const [id, step] of steps) {
    const path = `steps.${id}`;
    if (!phases.has(step.phase)) errors.push(`${path}.phase ${step.phase} does not exist`);
    if (!workstreams.has(step.workstream)) errors.push(`${path}.workstream ${step.workstream} does not exist`);
    if (typeof step.action !== "string" || !step.action.trim()) errors.push(`${path}.action is required`);
    for (const dependency of Array.isArray(step.dependencies) ? step.dependencies : []) {
      if (!steps.has(dependency)) errors.push(`${path}.dependencies references missing step ${dependency}`);
      const dependencyStep = steps.get(dependency);
      if (dependencyStep && phaseOrder.has(step.phase) && phaseOrder.has(dependencyStep.phase) && phaseOrder.get(dependencyStep.phase) > phaseOrder.get(step.phase)) {
        errors.push(`${path} depends on later-phase step ${dependency}`);
      }
    }
    if (!Array.isArray(step.dependencies)) errors.push(`${path}.dependencies must be an array`);
    const tests = step.testsFirst;
    if (!Array.isArray(tests) || tests.length === 0) errors.push(`${path}.testsFirst must be non-empty`);
    validateMetrics(step.passMetrics, `${path}.passMetrics`);
    if (!Array.isArray(step.effects?.unblocks)) errors.push(`${path}.effects.unblocks must be an array`);
    if (!Array.isArray(step.effects?.risks)) errors.push(`${path}.effects.risks must be an array`);
    if (typeof step.effects?.rollback !== "string" || !step.effects.rollback.trim()) errors.push(`${path}.effects.rollback is required`);
    if (typeof step.failPolicy !== "string" || !step.failPolicy.trim()) errors.push(`${path}.failPolicy is required`);
    for (const target of step.effects?.unblocks ?? []) if (!steps.has(target)) errors.push(`${path}.effects.unblocks references missing step ${target}`);
  }

  const visiting = new Set();
  const visited = new Set();
  const visit = (id, trail = []) => {
    if (visiting.has(id)) {
      errors.push(`step dependency cycle detected: ${[...trail, id].join(" -> ")}`);
      return;
    }
    if (visited.has(id)) return;
    visiting.add(id);
    for (const dependency of steps.get(id)?.dependencies ?? []) if (steps.has(dependency)) visit(dependency, [...trail, id]);
    visiting.delete(id);
    visited.add(id);
  };
  for (const id of steps.keys()) visit(id);

  for (const [id, outcome] of outcomes) {
    if (typeof outcome.outcome !== "string" || !outcome.outcome.trim()) errors.push(`planOutcomes.${id}.outcome is required`);
    validateMetrics(outcome.metrics, `planOutcomes.${id}.metrics`);
  }
  for (const [id, hypothesis] of hypotheses) {
    for (const key of ["claim", "status", "test", "pass", "fail"]) {
      if (typeof hypothesis[key] !== "string" || !hypothesis[key].trim()) errors.push(`researchHypotheses.${id}.${key} is required`);
    }
  }

  for (const phaseId of phases.keys()) {
    if (![...steps.values()].some((step) => step.phase === phaseId)) errors.push(`phase ${phaseId} has no steps`);
  }
  if (![...steps.values()].some((step) => step.workstream === "W6")) errors.push("revenue validation requires at least one W6 step");
  if (![...outcomes.values()].some((outcome) => outcome.outcome === "revenue_validation")) errors.push("plan requires a revenue_validation outcome");

  return [...new Set(errors)].sort();
}

export async function readAndValidateMetaPlan(path) {
  const planUrl = path instanceof URL ? path : pathToFileURL(path);
  const plan = JSON.parse(await readFile(planUrl, "utf8"));
  if (plan.stepsFile) {
    const stepsUrl = new URL(plan.stepsFile, planUrl);
    plan.steps = JSON.parse(await readFile(stepsUrl, "utf8"));
  }
  return { plan, errors: validateMetaPlan(plan) };
}

const invokedPath = process.argv[1] ? pathToFileURL(process.argv[1]).href : null;
if (invokedPath === import.meta.url) {
  const path = process.argv[2] ?? "planning/meta-plan-v3.json";
  const { plan, errors } = await readAndValidateMetaPlan(path);
  if (errors.length > 0) {
    console.error(JSON.stringify({ status: "fail", plan: plan.id ?? null, errors }, null, 2));
    process.exitCode = 1;
  } else {
    console.log(JSON.stringify({
      status: "pass",
      plan: plan.id,
      baselineSha: plan.baselineSha,
      workstreams: plan.workstreams.length,
      phases: plan.phases.length,
      steps: plan.steps.length,
      technologiesPreserved: plan.techPlacements.length,
      outcomes: plan.planOutcomes.length,
      hypotheses: plan.researchHypotheses.length,
    }));
  }
}
