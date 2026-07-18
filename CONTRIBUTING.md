# Contributing and Validation Standard

## Protected direction

```text
hyper-content -> hyper-site
hyper-site -X-> hyper-content
```

Never edit `main` directly. The current integration branch is `agent/glm-blackwell-vertical-slice`, and PR #3 remains draft until real framework, content, field and revenue gates pass.

## Branches

Use the integration branch for dependency-ordered extraction of shared legacy authorities. Use `agent/<workstream>-<step>` only for genuinely parallel work that has an independent contract test and can rebase cleanly.

Do not create a second renderer, PageIR, sitemap or publication authority to avoid an extraction problem. Add an adapter, prove parity, then move ownership.

## TDD contract

Every implementation step must name tests before implementation:

1. RED: a contract or characterization test fails, or freezes existing behavior before the change.
2. GREEN: the step tests and inherited regression suites pass.
3. REFACTOR: cleanup preserves behavior, boundaries and evidence.

Tests must cover the authority being changed. API-existence tests alone do not validate dependency direction, artifact parity, idempotency, recovery, security or field outcomes.

## Required step record

Every step in `planning/meta-plan-v3.json` must contain:

- phase and workstream;
- dependencies;
- tests-first list;
- measurable pass metrics;
- downstream effects and risks;
- rollback path;
- fail policy;
- current status.

Run:

```bash
node scripts/check-meta-plan.mjs planning/meta-plan-v3.json
node --test planning/test/meta-plan.test.mjs
node scripts/check-product-boundaries.mjs
```

## Evidence and claims

Use source, tests, migrations, scripts, artifacts and field records as authority. Documentation is a map, not proof.

Do not claim:

- framework performance from a content-pipeline benchmark;
- production readiness from synthetic tests;
- ranking, citations, conversion or revenue from page generation;
- GPU fit from parameter bytes alone;
- method superiority from one fixture or microbenchmark;
- independent review when the generator approves itself.

## Failure handling

A failed gate does not require deleting the technology. Keep it in the correct package or research workstream, record the negative result, and block canonical activation.

Rollback is required for reverse dependencies, duplicate publication authorities, unapproved artifact changes, data loss, non-idempotent external effects or regression-suite failures.
