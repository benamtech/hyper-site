# AGENTS.md — Hyper Site Operating Contract

Status: active near-alpha research contract  
Updated: 2026-07-18  
Scope: repository root

## Read first

1. `identity.md`
2. `AGENTS.md`
3. `CODEGRAPH.md`
4. `README.md`
5. `memory/MEMORY.md`
6. newest immutable file under `memory/`
7. `27-near-alpha-framework-validation-and-continuous-agent-workspace.md`
8. `26-graph-learning-paper-triage-and-promotion-gates.md`
9. `25-academic-crosswalk-agent-harness-structured-generation-and-acceleration.md`
10. `24-agent-discovered-ontology-and-10k-site-program.md`
11. newest report under `validation/reports/`
12. `site-manifest.yaml`
13. `reference/README.md`

The repository is standalone. Do not use former `GTM-RESEARCH/website-framework`, parent-directory, `mvp-build`, or removed source-repository paths as live authority.

## Maturity boundary

- The current system is a research prototype approaching near-alpha. It is not production-ready.
- Names containing `production` identify a production-boundary experiment or comparator, not release maturity.
- Synthetic 10K planning or emission is software evidence only. It cannot promote maturity, usefulness, or market claims.
- Every document, PR, report, and agent handoff must preserve this classification until real use cases and conventional-framework comparisons pass.

## Canonical framework lifecycle

```text
approved repository/source truth
-> business datasheets + evidence ledger
-> design system + typography + layouts + graphics briefs
-> starter site + core pages
-> Stage-1 ontology proposal + independent approval
-> typed sparse graph + separate constraints
-> bounded opportunity selection
-> Stage-2 PageDraft batches
-> existing PageConcept / SiteSource / PageIR / static renderer
-> local corpus and browser validation
-> operator review
-> post-generation edits, maintenance, drift checks, and case-study evaluation
-> repeat through immutable workspace snapshots
```

Continuous agent operation means repeated, explicit, checkpointed invocations over one versioned workspace. It does not mean an opaque perpetual loop or unreviewed autonomous publication.

Preserve one publication pipeline. Do not create a parallel manifest, context corpus, page selector, generation runner, output transaction, or publication path.

## Framework, not data pipeline

Hyper Site must be evaluated as a web framework and authoring environment, not merely as a page-count pipeline.

The agent must be able to participate at both ends:

- before bulk work: repository intake, datasheets, evidence, core information architecture, design systems, typography, layouts, starter pages, graphics briefs, and static assets;
- during assigned work: bounded ontology and PageDraft generation, validation, repair, transaction, and noindex review;
- after bulk work: incremental edits, restyling, page retirement, evidence refresh, graph/corpus drift, broken-link repair, accessibility work, and lifecycle ownership.

A large corpus without a useful core site, coherent shared design system, editable components, incremental maintenance, and normal framework ergonomics is a failed framework result even if generation throughput is high.

## Truth and ingestion

- Source, tests, emitted artifacts, and newest memory outrank explanatory docs.
- Business purpose, services, offers, audiences, locations, pricing, proof, brand, goals, rights, and publication constraints must be explicit.
- Repository text may be proposed for review but cannot be silently promoted into `ProjectInput` truth.
- `reference/src/repository-ingestion.ts` is the canonical repository snapshot/config boundary.
- Every promoted field requires declared source IDs; every declared repository source or asset must resolve to actual captured bytes.
- Missing, contradictory, unsupported, or path-traversing input is rejected rather than repaired by invention.

## Agent and reviewer boundary

- Stage 1 and Stage 2 model output is proposal state.
- Schema-constrained decoding is transport safety, not semantic authority.
- Same-model self-critique never accepts ontology, design, page, maintenance, or case-study output.
- Independent reviewers or externally supplied observations control approval where the contract requires it.
- Repair is bounded; exhausted repair rejects the output.
- Agent workspace artifacts must declare producer, sources, dependencies, status, and content hash.

## Test-driven and scientific validation

Every substantive change must name:

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

Novel math, graph, vector, GPU, agent, or execution methods remain comparison arms until they beat or justify themselves against simpler baselines on frozen real tasks without evidence, safety, maintenance, or usability regression.

## Mandatory framework comparisons

Near-alpha evaluation must include Hyper Site and at least one ordinary static, SSR, or SPA framework on the same semantic fixture, machine, runtime, and page tiers.

Measure at minimum:

- cold build time;
- incremental edit/build time;
- development server startup;
- peak memory;
- emitted HTML, JavaScript, asset, and total bytes;
- validation time;
- changed-page and changed-artifact counts;
- static serving and crawl behavior where applicable;
- operator effort and failure recovery;
- accessibility and design-system integrity.

Planning-only or generation-only timings do not establish web-framework performance.

## Scale boundary

Required experimental tiers begin at 25, 100, 500, and 10,000 pages. Later tiers may include 25,000 or more only after the same full path passes.

At 10K and above, validation must include post-generation work:

- change one source fact;
- change one design token;
- change one shared component;
- change one page-specific information object;
- retire one page family;
- rebuild and validate affected artifacts;
- measure invalidation scope, latency, memory, output churn, and operator recovery.

The claimed scale ceiling may never exceed the measured full-framework ceiling.

## Network-science boundary

Graph and network-science methods must connect to independently judged framework outcomes such as relevance, information gain, cannibalization, maintenance prioritization, or drift detection.

A graph metric is not useful merely because it is mathematically valid. Every network study requires:

- a named simpler baseline;
- versioned graph fixtures;
- held-out judgments;
- stability and tail/noise analysis;
- a concrete action policy;
- full-site cost and maintenance effect.

## Page-existence boundary

Every measured or publishable page requires:

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

Run from `reference/`:

```bash
npm install --no-audit --no-fund --no-package-lock
npm test
npm run manifest:emit
npm run ui:emit
npm run orchestration:check
npm run framework:validate
npm run framework:preview
npm run browser:check
npm run ui:r3f:build
```

The focused near-alpha workflow must also run the production-boundary and near-alpha framework tests.

## Publication boundary

No page enters an indexable cohort until evidence, relevance, information gain, distinctness, cannibalization, utility/task, path, static delivery, canonical, browser, crawler, accessibility, lifecycle, operator, and held-out case-study gates pass. Initial real cohorts remain noindex.

## Memory and commits

- `memory/MEMORY.md` is the current TOON index.
- Append immutable `memory/YYYY-MM-DD-HHMM-<slug>.md` handoffs.
- Record branch, exact commit, CI run, test count, artifacts, unrun validation, remaining failures, and next gate.
- Commit or merge only coherent work that has passed the applicable validation suite.
- Do not merge this near-alpha slice merely because synthetic 10K emission passes. The PR may remain draft when framework comparison and real-use gates are intentionally pending.
