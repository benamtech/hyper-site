# AGENTS.md — Hyper Monorepo Operating Contract

Status: active near-alpha research contract  
Updated: 2026-07-18  
Scope: repository root

## Read first

1. `identity.md`
2. `AGENTS.md`
3. `CODEGRAPH.md`
4. `README.md`
5. `docs/architecture/29-product-boundary-research-and-root-folder-split.md`
6. `memory/MEMORY.md`
7. newest immutable file under `memory/`
8. `docs/validation/27-near-alpha-framework-validation-and-continuous-agent-workspace.md`
9. `docs/architecture/28-agent-first-web-framework-and-llm-backend.md`
10. newest report under `validation/reports/`
11. `hyper-site/README.md`
12. `hyper-content/README.md`
13. `reference/README.md`

The repository is standalone. Do not use former parent-directory, `mvp-build`, or removed source-repository paths as live authority.

## Product boundary

This repository is a monorepo containing two products:

```text
hyper-content -> hyper-site
hyper-site -X-> hyper-content
```

### `hyper-site`

The web-framework package owns static compilation, PageIR, HTML, CSS, UI/component/layout contracts, browser/accessibility/performance policy, development ergonomics, and publisher adapters.

It must not expose or import ontology discovery, graph opportunity selection, BM25, embeddings, LLM providers, PCN, ArticleIR, corpus generation, GPU orchestration, the mixed legacy manifest, or current vector/facility Wasm kernels.

### `hyper-content`

The ontology/evidence/content compiler owns repository and evidence intake, ontology/graph/selection, page contracts, provider work, PCN, ArticleIR, deterministic unfolding, information-gain and corpus validation, checkpoints, current vector Wasm/Zig, and GPU/model workflows.

It consumes `hyper-site` as its sole static publication target.

### `reference`

`reference/` remains the canonical legacy implementation during staged physical migration. The root package facades are real product/API boundaries but are not proof that every source file has moved.

Do not create a second renderer, PageIR, static compiler, sitemap authority, or publication path during extraction.

## Maturity boundary

- Both products are research prototypes approaching near-alpha. Neither is production-ready.
- Names containing `production` identify a boundary experiment or comparator, not release maturity.
- Synthetic 10K planning or emission is software evidence only.
- Content-pipeline measurements may not be marketed as web-framework performance.
- Every document, PR, report, and handoff must preserve these classifications until real cases and comparable baselines pass.

## Canonical combined lifecycle

```text
approved repository/source truth
-> hyper-content business datasheets + evidence ledger
-> ontology proposal + independent approval
-> typed graph + constraints + bounded opportunity selection
-> deterministic PCN
-> LLM prose backend
-> validated ArticleIR
-> deterministic unfolding
-> hyper-site SiteSource / PageIR / static renderer
-> browser, accessibility, corpus, and operator validation
-> explicit publication decision
-> post-generation maintenance and next checkpoint
```

Continuous agent operation means repeated explicit invocations over versioned artifacts. It does not mean an opaque perpetual loop or unreviewed autonomous publication.

## Dependency rules

- `hyper-content` may depend on `hyper-site`.
- `hyper-site` may not depend on `hyper-content`.
- Generic utilities may be extracted into a third internal package only when both products demonstrably require them and doing so does not expose content concepts to framework users.
- `scripts/check-product-boundaries.mjs` is a hard CI gate.
- Current `framework.ts`, `manifest.ts`, `core.ts`, benchmark types, validation types, and UI metaprogramming are mixed legacy authorities and must be decomposed before physical relocation.
- A folder move without import-boundary enforcement is not a completed split.

## Web-framework boundary

A valid `hyper-site` task improves at least one of:

```text
scaffolding and setup
component/layout/theme ergonomics
dev-server and incremental build behavior
static compile latency and memory
HTML/CSS/JS/asset output
browser and accessibility outcomes
deployment and rollback
plugin/runtime integration
```

Ontology quality, model reasoning, embedding quality, and content generation throughput are not framework metrics.

Current Wasm does not qualify as framework interactivity. It implements vector/facility kernels and remains content-owned. A future browser Wasm module requires a distinct workload, API, parity tests, browser benchmarks, and user-visible effect.

## Content-compiler boundary

A valid `hyper-content` task improves at least one of:

```text
evidence fidelity
ontology and page-contract quality
retrieval or information gain
duplicate/cannibalization rejection
provider cost, latency, repair, or recovery
content distinctness and usefulness
indexing/search outcomes
content maintenance and retirement cost
```

The content compiler must target the framework package rather than generating a parallel site format.

## Truth and ingestion

- Source, tests, emitted artifacts, and newest memory outrank explanatory docs.
- Business purpose, services, offers, audiences, locations, pricing, proof, brand, goals, rights, and publication constraints must be explicit.
- Repository text may be proposed for review but cannot be silently promoted into truth.
- Every promoted field requires declared source IDs.
- Missing, contradictory, unsupported, or path-traversing input is rejected rather than repaired by invention.

## Agent and reviewer boundary

- Model output is proposal state.
- Schema-constrained decoding is transport structure, not semantic authority.
- Same-model self-critique never accepts ontology, design, page, maintenance, or case-study output.
- Independent reviewers or externally supplied observations control approval where required.
- Repair is bounded; exhausted repair rejects.
- Workspace artifacts declare producer, sources, dependencies, status, and content hash.

## Scientific method

Every substantive architecture, algorithm, performance, or promotion change must name:

```text
hypothesis
primary metric
falsification rule
validation vector
pass and fail boundary
negative control
simpler baseline
fixture and machine identity
measured evidence
```

Hard failures stop orchestration. Pending and not-run remain visible.

Novel math, graph, vector, GPU, agent, browser-Wasm, or execution methods remain comparison arms until they beat or justify themselves against simpler baselines on frozen real tasks without evidence, safety, maintenance, usability, or output regression.

## Mandatory framework comparisons

Near-alpha framework evaluation must isolate `hyper-site` and compare it with at least one ordinary static, SSR, or SPA framework on the same visible fixture, machine, runtime, assets, cache policy, and output requirements.

Measure at minimum:

- scaffold/setup effort;
- development-server startup and update latency;
- cold and incremental build time;
- peak memory;
- emitted HTML, CSS, JavaScript, asset, and total bytes;
- browser, crawl, and accessibility results;
- deployment and rollback effort;
- component, layout, theme, and plugin customization effort.

Do not include ontology discovery, model calls, embeddings, content repair, or corpus validation in `hyper-site` benchmark timing.

Exact competitor timing claims are invalid unless reproduced on the frozen comparison fixture.

## Mandatory content comparisons

`hyper-content` evaluation must compare against simpler prompting/RAG, human or agency workflows, and relevant content tools using frozen evidence and held-out judgments.

Measure:

- citation and evidence accuracy;
- required-section and contract compliance;
- distinctness and information gain;
- rejection and repair rate;
- provider tokens, cost, latency, and failures;
- indexing/search and commercial outcomes when available;
- maintenance and evidence-refresh burden.

## Scale boundary

Content tiers may include 5, 25, 100, 500, and 10,000 pages. Page-count scale belongs to `hyper-content` unless the experiment isolates pure `hyper-site` rendering of already-frozen pages.

At 10K, separately measure changes to a source fact, design token, shared component, information object, page, page family, ontology relation, evidence source, and interrupted batch.

The claimed ceiling may never exceed the measured full path for the product being discussed.

## Network-science boundary

Graph and network-science methods must connect to independently judged content outcomes such as relevance, information gain, cannibalization, maintenance prioritization, or drift detection.

Every network study requires a simpler baseline, versioned graph fixtures, held-out judgments, stability/noise analysis, an action policy, and measured full-pipeline cost.

Graph metrics are not web-framework performance.

## Page-existence boundary

Every measured or publishable generated page requires:

```text
distinct user task
+ distinct information object or utility
+ evidence IDs
+ nearest-neighbor comparison
+ material difference statement
+ lifecycle owner
```

Unique routes, titles, embeddings, graph regions, or noun substitutions are insufficient.

## Validation commands

From the repository root:

```bash
npm run build
npm test
npm run check:boundaries
```

The canonical legacy suite remains available under `reference/` during migration.

## Publication boundary

No generated page enters an indexable cohort until evidence, relevance, information gain, distinctness, cannibalization, utility/task, path, static delivery, canonical, browser, crawler, accessibility, lifecycle, operator, and held-out case-study gates pass. Initial real cohorts remain noindex.

Framework-owned static pages that do not originate from `hyper-content` still require ordinary browser, accessibility, canonical, deployment, and operator acceptance, but they do not inherit ontology or corpus gates merely because those systems share a repository.

## Memory and commits

- `memory/MEMORY.md` is the current TOON index.
- Append immutable `memory/YYYY-MM-DD-HHMM-<slug>.md` handoffs.
- Record branch, exact commit, CI run, test count, artifacts, unrun validation, remaining failures, and next gate.
- Commit or merge only coherent work that has passed applicable validation.
- Do not merge PR #3 merely because synthetic or package-boundary tests pass. The PR remains draft while physical extraction, publisher, real cases, and comparable benchmarks are pending.

## Governed task-surface boundary

- Hyper Content may propose a task goal, evidence, static examples, input/output classes, limitations, and review triggers. It must not emit UI implementation logic.
- Hyper Site owns protocol-neutral service, surface, theme, mount, public-projection, and growth-policy contracts. It must not own reasoning, credentials, private memory, connectors, or consequential authorization.
- Browser surfaces submit typed intents; they never mutate canonical runtime state directly.
- Public projections are allowlisted and must not include full ontology state, hidden reasoning, private memory, credentials, raw provider payloads, or unrelated tenant resources.
- Static fallback remains complete. Dynamic native, declarative, and sandboxed tiers are progressive enhancement.
- A2UI, AG-UI, MCP Apps, and AI Employee integrations are adapters, not internal authority.
- Growth operators may vary approved presentation, sequencing, allocation, and conversion. They may not widen capabilities, lower safety, alter private-data policy, or index sessions and generated artifacts.
- Run `node scripts/check-doc-system.mjs` with plan and boundary validation.

## Documentation lifecycle

Documentation lifecycle: `docs/README.md`. Every research or architecture mutation must follow intake -> research -> architecture -> executable plan -> validation report -> immutable memory handoff.
