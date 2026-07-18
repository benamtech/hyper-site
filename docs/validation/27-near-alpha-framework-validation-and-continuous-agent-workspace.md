# 27 — Near-Alpha Framework Validation and Continuous Agent Workspace

Status: canonical near-alpha reframe; software validation authority implemented; real framework baselines and case studies pending  
Updated: 2026-07-18  
Controlling implementation: `reference/src/near-alpha-framework.ts`

## 1. Why this reframe is necessary

The repository has demonstrated increasingly complete synthetic scale:

```text
ontology/graph/opportunity planning
-> PageDraft fixtures
-> canonical PageIR
-> static HTML
-> bounded corpus validation
-> 10,000-page synthetic emission
```

That is valuable compiler evidence. It is not enough to establish that Hyper Site is a good web framework.

A framework can generate 10,000 files and still fail because:

- it cannot create an attractive, coherent five-page starter site;
- design systems, typography, layouts, graphics, and assets are afterthoughts;
- incremental changes invalidate or regenerate the entire corpus;
- development-server and preview ergonomics are poor;
- emitted HTML, JavaScript, or assets are unnecessarily heavy;
- components are difficult to customize after generation;
- agents cannot resume the original design and evidence context;
- pages are unique only by nouns, routes, or vectors;
- network-science methods have no measured effect on user or maintenance outcomes;
- no ordinary web framework was used as a baseline;
- no real operator, repository, or case study has completed the workflow.

The current maturity is therefore:

```text
research prototype approaching near-alpha
```

It is not production-ready and is not yet a validated replacement for an ordinary static, SSR, SPA, or AI-assisted site-building workflow.

## 2. Product identity after the reset

Hyper Site is intended to become an **agent-first web framework and experience compiler**.

Large-batch page generation is one workload. The framework must also support the work people already use coding and design agents for:

```text
repository understanding
business and technical datasheets
source/evidence organization
information architecture
starter websites
core conversion pages
design systems
typography
layouts
component grammars
graphics briefs and bounded assets
styles and themes
content and structured data
bulk assigned page jobs
post-generation edits and maintenance
```

The system succeeds only when these capabilities converge on one editable, testable, static-first framework workspace.

## 3. Continuous agent operation at both ends

Continuous agent operation does not mean one hidden agent process runs forever.

It means an agent can repeatedly enter the same versioned workspace, inspect durable state, perform bounded work, emit proof, and hand the workspace to the next invocation or human operator.

```text
Phase A — initial authoring
  repository intake
  -> business datasheet
  -> evidence ledger
  -> style guide and design authority
  -> typography and layout systems
  -> graphics briefs/assets
  -> starter pages and core site

Phase B — assigned corpus work
  ontology proposal
  -> independent approval
  -> graph/opportunity plan
  -> PageDraft batches
  -> compiler transaction
  -> noindex review site

Phase C — post-generation framework work
  source-fact refresh
  design-token change
  shared-component change
  page-specific edit
  family retirement
  broken-link/accessibility repair
  graph/corpus drift review
  lifecycle and outcome analysis

Phase D — next checkpointed invocation
  immutable workspace snapshot
  -> explicit dependency graph
  -> bounded invalidation
  -> validation report
```

Every workspace artifact requires:

```text
artifact ID
kind
lifecycle phase
producer identity
source IDs
dependency IDs
approval/acceptance status
content hash
```

## 4. The framework must work before 10K

Near-alpha validation begins with small sites.

### 4.1 Five-page qualitative starter-site gate

A real operator should be able to create and revise:

```text
homepage
service or product overview
one detailed service/product page
about/proof page
contact or conversion page
```

The gate evaluates:

- visual hierarchy and composition;
- typography and readable measure;
- mobile behavior;
- component reuse without monotony;
- navigation and information architecture;
- evidence and claim fidelity;
- accessibility;
- editability;
- asset and graphics quality;
- operator effort;
- design refinement after initial generation.

A failure here blocks scale work even if the 10K synthetic fixture passes.

### 4.2 Twenty-five-page real noindex gate

The first real corpus gate is 25 pages, not 10,000.

It must include:

- core pages and supporting pages;
- at least two page families;
- distinct information objects or utilities;
- nearest-neighbor review;
- one design-system revision;
- one business-fact revision;
- one page-family retirement or merge decision;
- browser, crawler, accessibility, and static-delivery checks;
- human and held-out usefulness judgments.

## 5. Page-existence contract

A page does not deserve to exist because it has a unique route, graph region, vector, title, or keyword.

Every measured or publishable page requires:

```text
page ID
+ distinct user task
+ distinct information object or utility
+ evidence IDs
+ nearest-neighbor page IDs
+ material difference statement
+ lifecycle owner
```

The lifecycle owner is responsible for review, evidence refresh, consolidation, retirement, and outcome interpretation.

This contract is stricter than route uniqueness and stricter than lexical or semantic duplicate rejection.

## 6. Scientific and TDD-centered validation

Every architectural promotion begins as a falsifiable experiment.

Required experiment record:

```text
hypothesis ID
statement
primary metric
direction
threshold
falsification rule
simpler baseline
baseline run IDs
fixture ID
machine profile
commands
test IDs
negative control
random seed or determinism policy
result hash
```

### 6.1 TDD sequence

```text
1. Write the failure or negative-control test.
2. Demonstrate the current implementation fails it.
3. Implement the smallest coherent boundary.
4. Run local and CI validation.
5. Record exact hashes and measurements.
6. Compare with the simpler baseline.
7. Promote only if the predefined gate passes.
8. Preserve the failed result when the hypothesis is falsified.
```

### 6.2 Validation layers

```text
unit and property tests
schema and type validation
golden artifact tests
adversarial failure tests
recovery and interruption tests
browser and accessibility tests
cold and incremental framework benchmarks
network and corpus quality experiments
operator usability tests
held-out relevance judgments
real case studies
field outcomes
```

## 7. Ordinary web-framework comparison matrix

Hyper Site must be compared as a web framework, not only as a planner or generator.

At least one ordinary baseline is mandatory. Preferred baseline classes:

```text
conventional static generator
conventional SSR framework
conventional SPA/build-tool application
optional generic AI site builder or coding-agent workflow
```

Exact framework names and versions are selected when the benchmark fixture is frozen. No framework is predeclared as inferior.

### 7.1 Shared fixture rules

Every run must share:

- the same business/source fixture;
- equivalent visible page semantics;
- the same owned or licensed assets;
- the same route count and page families;
- the same machine profile;
- the same runtime constraints;
- equivalent minification and production-build settings;
- reproducible commands;
- separate cold and warm runs;
- a declared cache policy.

### 7.2 Required framework metrics

| Area | Metrics |
|---|---|
| cold build | elapsed time, CPU, peak RSS, disk reads/writes |
| incremental edit | elapsed time, changed pages, changed artifacts, output churn |
| development | server startup, first preview, hot/incremental update latency |
| output | total bytes, HTML, JavaScript, CSS, assets, file count |
| delivery | static requests/sec or equivalent, p50/p95 response, cacheability |
| browser | parse/render milestones, hydration where applicable, runtime errors |
| accessibility | automated violations plus manual keyboard/screen-reader checks |
| crawl | canonicals, robots, links, duplicate metadata, sitemap behavior |
| design | component reuse, token consistency, visual review, customization effort |
| agent operation | tool calls, retries, approvals, checkpoint recovery, operator minutes |
| maintenance | source update, token update, component update, page edit, family retirement |
| quality | evidence fidelity, information gain, duplicate/cannibalization risk, usefulness |

Planning time alone does not count as framework performance.

## 8. Scale tiers and the post-10K uncertainty boundary

Required tiers:

```text
5 qualitative starter pages
25 real noindex pages
100 pages
500 pages
10,000 pages
```

Optional later tiers:

```text
25,000
50,000
100,000
```

The claimed scale ceiling may not exceed the full-framework measured ceiling.

### 8.1 At every tier

Measure:

- cold build;
- incremental edit;
- validation;
- memory;
- output bytes;
- file count;
- preview and serving behavior;
- internal-link and metadata integrity;
- accessibility sample;
- duplicate and page-existence gates;
- operator recovery.

### 8.2 Mandatory 10K maintenance experiment

At 10K pages, execute all of these changes independently:

```text
A. Change one source fact used by one page.
B. Change one source fact used by one page family.
C. Change one design token.
D. Change one shared component.
E. Change one page-specific information object.
F. Retire one page.
G. Retire or merge one page family.
H. Add one new evidence source.
I. Change one ontology relation.
J. Resume after interruption halfway through a batch.
```

For each change record:

```text
invalidated artifacts
rebuilt artifacts
unchanged hashes
elapsed time
peak memory
output churn
link/canonical/crawl changes
human review burden
rollback result
```

A framework that rebuilds or rewrites everything may still be acceptable for a bounded static build, but it must be compared honestly against ordinary frameworks and operator expectations.

## 9. Network-science validation

Network science is retained only when it changes a measured decision.

Valid outcome targets include:

- page-family coherence;
- held-out relevance;
- information-object coverage;
- cannibalization risk;
- source or page maintenance prioritization;
- anomaly or drift detection;
- internal-link utility;
- family retirement or merge decisions.

Every network study requires:

```text
versioned graph fixture
named simpler baseline
metric definition
held-out judgment IDs
head/tail/noise slices
stability analysis
concrete action policy
full-framework cost
```

Examples:

- compare connected components with Leiden for human-reviewed family coherence;
- compare sparse typed adjacency with a learned graph proposal model on held-out relation judgments;
- compare rule-based source staleness prioritization with temporal graph methods after real history exists;
- compare nearest-neighbor cannibalization review with graph-centrality-assisted review.

Graph terminology without held-out effect remains research description only.

## 10. Real use cases and case studies

A case study is a replayable evidence artifact, not a testimonial.

Required fields:

```text
case ID
organization/project
repository revision
operator identities
source IDs
initial site goals
assigned generation jobs
post-generation maintenance tasks
observed outcomes
held-out judgment IDs
baseline workflow
elapsed operator time
failures and rejected outputs
```

The first case study should be small enough to inspect completely and complicated enough to exercise:

- real business truth;
- a real design system;
- starter-site generation;
- graphics or asset handling;
- one bounded page family;
- post-generation edits;
- checkpoint recovery;
- human approval;
- conventional-framework comparison.

## 11. Relationship to reviewed research

### Retained as current architecture

```text
external harness and deterministic verification
schema-bearing proposal contracts
explicit provenance and evidence
TF-IDF/BM25 lexical baseline
typed sparse graph and hard constraints
bounded conjunction expansion
sparse concave selection
HRR only after eligibility
static-first semantic PageIR
TypeScript semantic oracle
```

### Retained as comparison or provider arms

```text
learned embeddings and ANN
Leiden and learned graph methods
CSI publication-cohort selection
SGLang or other execution runtimes
local specialist models on rented GPUs
Wasm/Zig/native kernels
AgentO interoperability
```

### New near-alpha requirement

None of the above methods is sufficient without:

```text
core-site craftsmanship
normal framework ergonomics
incremental maintenance
ordinary-framework baselines
continuous agent workspace continuity
real case studies
held-out usefulness evidence
```

## 12. Current implementation state

Implemented now:

- evidence-gated repository ingestion;
- GLM structured transport and bounded external repair;
- exact-hash ontology and design approval;
- design-system and core-page brief authority;
- atomic PageDraft-to-PageIR/static transaction;
- local bounded corpus validation;
- immutable recovery checkpoints;
- operator commands;
- synthetic 25/100/500/10K full emission;
- executable near-alpha evaluation authority that rejects bulk-only, baseline-free, case-study-free, or maintenance-free claims.

Not implemented or not run:

- a complete continuous agent workspace CLI and artifact store;
- real graphics generation and asset-review workflow;
- real starter-site design quality evaluation;
- ordinary-framework benchmark harness;
- 10K incremental invalidation benchmark;
- real network-science outcome studies;
- non-synthetic case studies;
- live GLM run;
- real rented GPU run;
- held-out usefulness judgments;
- indexable publication.

## 13. Near-alpha plan

```text
Gate 0 — architecture and maturity reset
  executable near-alpha rejection vector
  docs and PR language reconciled

Gate 1 — continuous workspace
  versioned workspace manifest
  artifact dependency graph
  initial authoring + bulk + maintenance commands

Gate 2 — five-page real starter site
  business datasheet
  design system
  typography/layout/graphics
  full operator review

Gate 3 — ordinary-framework benchmark harness
  frozen fixture
  static + SSR baseline
  cold/incremental/dev/output/browser measurements

Gate 4 — 25 real noindex pages
  page-existence justifications
  held-out and human review
  post-generation changes

Gate 5 — 100 and 500
  same full framework path
  maintenance and baseline comparison

Gate 6 — 10K framework experiment
  full emission
  mandatory post-generation invalidation matrix
  ordinary-framework comparison
  no production or search claim

Gate 7 — near-alpha release decision
  only after real case studies, operator usability, accessibility, recovery, and comparison evidence
```

## 14. Claim boundary

Current valid claim:

```text
Hyper Site has a source-wired near-alpha framework experiment with synthetic full-site scale and explicit rejection gates for missing real framework evidence.
```

Invalid current claims:

```text
production-ready
best web framework
faster than ordinary frameworks
10K useful pages
continuous autonomous site operator
validated network-science advantage
validated GPU advantage
search, citation, conversion, or revenue lift
```
