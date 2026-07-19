import assert from "node:assert/strict";
import test from "node:test";

import { readAndValidateMetaPlan, validateMetaPlan } from "../../scripts/check-meta-plan.mjs";

const planPath = new URL("../meta-plan-v3.json", import.meta.url);
const { plan: canonical } = await readAndValidateMetaPlan(planPath);
const clone = () => structuredClone(canonical);

test("canonical meta-plan is structurally valid", () => {
  assert.deepEqual(validateMetaPlan(canonical), []);
});

test("validator rejects dependency cycles", () => {
  const plan = clone();
  plan.steps.find((step) => step.id === "P0.1").dependencies = ["P5.5"];
  assert.ok(validateMetaPlan(plan).some((error) => error.includes("cycle")));
});

test("validator rejects steps without measurable pass criteria", () => {
  const plan = clone();
  plan.steps.find((step) => step.id === "P1.1").passMetrics = [];
  assert.ok(validateMetaPlan(plan).some((error) => error.includes("P1.1.passMetrics")));
});

test("validator enforces zero-tech-killed", () => {
  const plan = clone();
  plan.techPlacements[0].state = "removed";
  assert.ok(validateMetaPlan(plan).some((error) => error.includes("must be preserved")));
});
