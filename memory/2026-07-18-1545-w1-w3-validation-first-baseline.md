# W1-W3 Validation-First Baseline

Date: 2026-07-18 15:45 America/New_York  
Status: active handoff

## Decision

Do not implement physical extraction, the five-page proof, or maintenance changes yet. First make their business goals, failure modes, adversarial cases, evidence requirements, and stop conditions executable on a local checkout.

## Added

- `planning/workstream-validation-vector-space.json`
- `validation/reference-source-inventory.json`
- `scripts/validate-workstreams.mjs`
- `test/workstream-validation.test.mjs`
- `docs/validation/39-w1-w3-validation-first-execution.md`
- root npm commands for W1-W3 validation and validation-only tests

## Current truthful state

W1 is red because the source inventory is empty, Hyper Site still delegates to reference runtime output, packed-consumer evidence is absent, and artifact-parity evidence is absent. W2 and W3 are blocked by signed prior-gate requirements.

## Local use

```bash
npm run test:validation
npm run validate:workstreams
npm run validate:w1
npm run validate:w2
npm run validate:w3
```

The gate commands return nonzero until the corresponding gate genuinely passes. Evidence files must be measured, exact-head records rather than placeholders.

## Next action

Run the validation-only commands on a clean local checkout. Preserve the red report as the baseline. Then begin W1A by filling the source inventory without moving code. Only after inventory coverage and ownership are reviewable should W1B compiler extraction begin.
