# Contributing and Validation Standard

## Protected direction

```text
hyper-content -> hyper-site
hyper-site -X-> hyper-content
hyper-site -X-> reference runtime in target state
```

Never edit `main` directly. The integration branch is `agent/glm-blackwell-vertical-slice`, and PR #3 remains draft until the useful framework gates pass.

## Current work order

```text
U1 package ownership and isolated consumption
-> U2 ordinary CLI and starter
-> U3 five-page browser acceptance
-> U4 maintenance comparison and advance/narrow/stop
-> U5 optional minimal Hyper Content adapter
```

Only U1 is unblocked.

## Branches

Use the integration branch for dependency-ordered extraction of shared legacy authority. Use `agent/<workstream>-<step>` only for genuinely parallel work with an independent contract test and clean rebase boundary.

Do not create a second compiler, renderer, `SiteSource`, `PageIR`, sitemap or hash authority to avoid an extraction problem. Freeze behavior, add a compatibility adapter, move ownership, prove parity, then remove the old authority.

## TDD contract

Every implementation step names tests before implementation:

1. **RED:** a characterization or contract test fails or freezes existing behavior.
2. **GREEN:** the step tests and inherited regression suites pass.
3. **REFACTOR:** cleanup preserves behavior, boundaries and evidence.

Tests must cover the user-visible or package boundary being changed. API-existence tests alone do not validate tarball isolation, artifact parity, browser behavior, incremental correctness or maintenance value.

## Required step record

Every U1-U5 step records:

- gate and dependency;
- hypothesis;
- tests-first list;
- exact fixture and environment;
- pass metric;
- expected affected files/artifacts;
- downstream effects and risks;
- rollback;
- fail policy;
- measured status.

## U1 required proof

```text
complete reference/src inventory
package-owned hyper-site/src and dist
no runtime import into reference
npm pack output
isolated valid consumer
isolated invalid consumer
positive artifact parity
negative rejection parity
```

## Evidence and claims

Use source, tests, scripts, packed artifacts, browser reports and measured maintenance records as authority. Documentation is a map, not proof.

Do not claim:

- framework usefulness from compiler invocation;
- package ownership from folders or re-exports;
- complete incrementality from declared dependencies alone;
- production readiness from synthetic tests;
- SEO, ranking, conversion or revenue from generated pages;
- GPU/Zig/Wasm value from a microbenchmark;
- accessibility from automated scanning alone;
- superiority without the frozen direct controls.

## Failure handling

A failed gate produces `repair`, `narrow` or `stop`. Do not route around a failed product gate by adding architecture.

Rollback is required for reverse dependencies, duplicate authorities, changed frozen artifacts without an approved contract change, stale partial output, data loss or regression-suite failures.

## Deferred work

Until U4 records `advance`, contributions must not place these on the critical path:

- model-backed bulk generation;
- agent runtimes or task surfaces;
- remote publication effects;
- SDRT, GNN, GPU, Zig or Wasm promotion;
- binary prompting;
- 10K publication;
- enterprise claims.

## Stateful documentation

Use the lifecycle in `docs/README.md`:

```text
intake -> research -> architecture -> executable plan -> validation report -> memory handoff
```

Root Markdown is restricted to the bootstrap allowlist. Update `docs/catalog.json` for every addition, move, supersession or authority change. Timestamped memory handoffs and measured reports are immutable.

Run:

```bash
npm ci
npm run build
npm test
npm run test:validation
npm run test:compiler-limit
npm run validate:workstreams
node scripts/check-doc-system.mjs
node scripts/check-product-boundaries.mjs
```
