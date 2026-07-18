# AGENTS.md — Hyper Monorepo Operating Contract

Status: active research and implementation contract  
Updated: 2026-07-18

## Read first

1. `identity.md`
2. `AGENTS.md`
3. `CODEGRAPH.md`
4. `README.md`
5. `docs/README.md`
6. `docs/catalog.json`
7. `planning/meta-plan-v3.json`
8. `planning/meta-plan-v3.steps.json`
9. `memory/MEMORY.md`
10. newest immutable handoff under `memory/`
11. newest measured report under `validation/reports/`
12. current task-specific research -> architecture -> plan -> validation chain

For current product scope, also read:

- `docs/research/34-intellectual-competitive-and-use-case-landscape.md`
- `docs/architecture/35-reality-grounded-product-and-integration-boundary.md`
- `docs/planning/36-next-three-workstreams-reality-grounded-plan.md`
- `docs/validation/37-reality-grounded-product-validation-matrix.md`

## Product boundary

```text
hyper-content -> hyper-site
hyper-site -X-> hyper-content
hyper-site -X-> private runtime internals
runtime adapters -> public task-surface contracts
```

### Hyper Site

Owns content-neutral PageIR, deterministic static artifacts, trusted renderer contracts, design, accessibility, static fallback, task mounts and publisher interfaces.

Must not own ontology, evidence ranking, model providers, PCN, ArticleIR, vector geometry, private memory, credentials, durable effects, connectors, authorization or experiment statistics.

### Hyper Content

Owns evidence intake, content proposals, ontology and opportunity methods, structured generation, ArticleIR acceptance, validation, maintenance and optional task-semantic proposals.

Must not own web rendering, theme components, browser state, publication authority or consequential effects.

### Runtime adapters

Own identity, policy, durable state, tools, connectors, effects, idempotency, receipts and private sessions.

### Reference

`reference/` is transitional implementation and test authority. Its target is consumer, compatibility suite, fixture library, examples and benchmarks.

Current physical truth:

- `hyper-content/src/content-program-adapter.ts` is canonical adaptation source;
- `reference/src/content-program-adapter.ts` is a legacy manifest/parity wrapper;
- most other product source still resides under `reference/src` pending P1.4/P1.5.

Do not claim the split is complete from folder names or facades.

## One-authority rule

During extraction, never create a second PageIR, renderer, sitemap, compiler or publisher. Add a compatibility adapter, prove parity, then move ownership.

## Build versus integrate

Build a capability in core only when it preserves a Hyper-owned invariant, is needed by the first five-page-plus-one-task fixture, cannot be satisfied by a stable adapter, includes a simple control and remains replaceable.

Integrate first for durable workflows, agent orchestration, connector catalogs, policy engines, experimentation statistics, observability, CMS editorial workflow and enterprise identity.

## Baseline-first scientific rule

Every advanced method requires a simpler control:

- ontology graph vs typed JSON/relational model;
- graph database vs PostgreSQL;
- embeddings vs lexical/rule retrieval;
- HRR/HDC vs ordinary vectors/maps;
- Wasm vs JavaScript/server implementation;
- GPU vs CPU;
- generated UI vs static/trusted native components;
- agent workflow vs deterministic state machine or established workflow engine;
- autonomous page plan vs human-curated plan.

Novelty, elegance and synthetic scale do not establish authority.

## Maturity boundary

- Both products remain research prototypes.
- `production` in a filename is not production readiness.
- Synthetic 10K execution is software evidence only.
- Static HTML emission is not framework differentiation.
- Evidence IDs do not prove truth.
- Visible task completion does not prove authorized completion.
- Enterprise comparables must include governance, operations, integrations and support gaps.
- PR #3 remains draft and unmerged.

## Current execution order

1. Inventory and physically extract package source.
2. Make `reference/` consume both packages.
3. Implement the protocol-neutral task-surface ABI with negative tests.
4. Build one five-page standalone site and publisher.
5. Freeze an equivalent ordinary-framework control.
6. Run one real evidence-to-page cohort.
7. Run one bounded task through a durable runtime adapter and ordinary-form control.
8. Expand only after held-out review and maintenance pass.

## Required evidence for substantive changes

Every architecture, algorithm, performance or promotion change must name:

```text
hypothesis
owned invariant
primary metric
falsification rule
simple baseline
negative control
fixture and machine identity
pass and fail threshold
rollback
measured evidence
```

Hard failures stop orchestration. Pending and not-run remain visible.

## Page-existence boundary

Every accepted page requires a distinct task, distinct information object or utility, evidence IDs, nearest-neighbor comparison, material difference statement, freshness policy and lifecycle owner. Unique routes, titles, embeddings or noun substitutions are insufficient.

## Governed task boundary

- static fallback is complete;
- browser surfaces submit typed intents and never mutate canonical runtime state directly;
- public projections are allowlisted;
- successful consequential effects require receipts;
- duplicate intents must not duplicate irreversible effects;
- growth variants cannot widen capabilities or weaken privacy/safety;
- A2UI, AG-UI and MCP Apps are adapters, not core authority.

## Documentation lifecycle

```text
intake
-> source verification and critical research
-> architecture disposition
-> executable plan
-> RED/GREEN/REFACTOR implementation
-> measured validation report
-> immutable memory handoff
-> catalog, MEMORY, bootstrap and PR reconciliation
```

Historical documents remain preserved. Their catalog status determines authority.

## Validation commands

```bash
npm run build
npm test
npm run check:boundaries
node scripts/check-doc-system.mjs
node scripts/check-meta-plan.mjs planning/meta-plan-v3.json
node --test planning/test/meta-plan.test.mjs
```

Commit only coherent work with applicable checks. Never merge PR #3 solely because structural, synthetic or protocol tests pass.
