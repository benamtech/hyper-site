# Near-Alpha Framework Reframe Validation

Status: architectural reset source-wired and synthetic validation passed; near-alpha release gates intentionally fail without real case studies and ordinary-framework evidence  
Date: 2026-07-18  
Branch: `agent/glm-blackwell-vertical-slice`  
PR: `#3`  
Validated source head before this report: `9e03b1b6d43a574bb09fdcfd28f6edd153e56c68`

## Superseding interpretation

This report supersedes the maturity framing of `2026-07-18-glm-blackwell-production-vertical-slice.md`.

The earlier report remains valid for the exact synthetic software measurements it recorded. Its use of “production vertical slice” is now historical terminology. The current repository is a **research prototype approaching near-alpha**, not a production system.

```text
synthetic full emission
!= useful web framework
!= ordinary-framework advantage
!= near-alpha release acceptance
!= production readiness
```

## Product boundary after the reset

Hyper Site is intended to become an agent-first web framework and experience compiler.

Large-batch page generation is one workload inside a broader lifecycle:

```text
repository intake
-> business datasheets and evidence
-> design system, typography, layouts, graphics, assets, and starter pages
-> bounded ontology and PageDraft generation
-> canonical PageConcept / SiteSource / PageIR / static output
-> operator and held-out review
-> source, design, component, page, family, accessibility, and drift maintenance
-> next immutable workspace snapshot
```

Continuous agent operation means repeated, explicit, checkpointed invocations over durable versioned artifacts. It does not mean an opaque perpetual loop or automatic publication.

## Canonical documents reconciled

The following authorities now share the near-alpha framework boundary:

- `identity.md`;
- `AGENTS.md`;
- `README.md`;
- `CODEGRAPH.md`;
- `reference/README.md`;
- `24-agent-discovered-ontology-and-10k-site-program.md`;
- `25-academic-crosswalk-agent-harness-structured-generation-and-acceleration.md`;
- `26-graph-learning-paper-triage-and-promotion-gates.md`;
- `27-near-alpha-framework-validation-and-continuous-agent-workspace.md`;
- PR `#3` title and description.

The documents now state:

- 10,000 pages are an experimental tier, not the minimum job or product definition;
- small-site craftsmanship and normal web-framework ergonomics are blocking requirements;
- ordinary static/SSR/SPA comparisons are mandatory;
- post-generation maintenance and incremental invalidation must be measured;
- network-science methods require simpler baselines and held-out action outcomes;
- non-synthetic case studies are required before a near-alpha release decision;
- the PR remains draft even when synthetic software tests pass.

## New source authorities

### Near-alpha framework evaluator

`reference/src/near-alpha-framework.ts` validates:

```text
near-alpha.maturity
near-alpha.agent-continuity
near-alpha.core-framework
near-alpha.tdd
near-alpha.scientific
near-alpha.network-science
near-alpha.real-use-cases
near-alpha.page-existence
near-alpha.framework-baseline
near-alpha.scale-transition
```

It can reject:

- a bulk-generation-only workspace;
- missing approved datasheet/design/typography/layout/graphics/starter artifacts before page batches;
- hypotheses without executable tests or falsification rules;
- self-only, unversioned, or noncomparable benchmarks;
- graph metrics without a simpler baseline and held-out judgments;
- pages justified only by routes, titles, vectors, or graph regions;
- 10K claims without incremental post-generation edit metrics;
- claimed scale beyond the full-framework measured ceiling.

### Strict release-candidate gate

`reference/src/near-alpha-release.ts` adds a stricter decision:

```text
complete non-synthetic case study required
+ base near-alpha validation passes
+ zero pending attributes
```

Synthetic fixtures can exercise the validator but cannot satisfy a release decision.

### Continuous agent workspace

`reference/src/agent-workspace.ts` and `reference/scripts/workspace-cli.mjs` implement:

- immutable workspace snapshots;
- prior-snapshot hash linkage;
- artifacts with kind, lifecycle phase, producer, sources, dependencies, status, and content hash;
- append and replacement with dependency validation;
- cycle rejection;
- transitive reverse-dependency invalidation;
- explicit unaffected-artifact sets;
- lifecycle coverage across initial authoring, starter site, bulk generation, and maintenance.

A critical invariant prevents data-pipeline leakage:

```text
workspace artifact kind never infers pageCount or routeCount
```

Canonical page and route cardinality must come from compiler outputs, not artifact metadata.

### Operator evaluation CLI

`reference/scripts/near-alpha-cli.mjs` exposes:

```text
evaluate
  preserve pass, fail, and pending research gates

release
  require a complete non-synthetic case and zero failed/pending gates
```

The CLI validates supplied evidence. It does not manufacture baselines, judgments, or case studies.

## Test-driven validation vectors

### Negative controls

The focused suite now explicitly proves rejection of:

- bulk-only workspaces;
- scale claims beyond measured full-framework evidence;
- baseline samples without post-generation changed pages/artifacts;
- synthetic-only near-alpha release evidence;
- unknown workspace dependencies;
- dependency cycles;
- workspace artifacts that attempt to imply page cardinality;
- near-duplicate pages;
- unsupported evidence;
- same-generator design approval;
- unsafe custom CSS;
- undersized appliance profiles;
- malformed provider output after repair budget exhaustion.

### Positive controls

The focused suite proves source behavior for:

- lifecycle-complete workspace fixtures;
- transitive invalidation and unaffected-artifact reporting;
- immutable snapshot linkage;
- directly comparable versioned framework-run schemas;
- hypotheses with test and falsification identities;
- network studies with a simpler baseline and held-out judgments;
- complete non-synthetic case-study schema fixtures;
- atomic PageDraft-to-PageIR/static transactions;
- noindex preservation;
- CSS-only design refinement preserving content hashes;
- Stage-1 and Stage-2 recovery;
- bounded synthetic 100, 500, and 10,000-page execution.

## Exact focused CI proof

```text
workflow: Hyper Site Near-Alpha Pipeline
run: 29636565648
job: 88059836329
head: 9e03b1b6d43a574bb09fdcfd28f6edd153e56c68
result: success
artifact: near-alpha-test-log-29636565648
artifact digest: sha256:a9d4362b7068ac8e76b0088995700b9e62234b647c4886e0cbbe21970bd6c3d1
```

Test result:

```text
20 passed
0 failed
36,321.318 ms
```

Synthetic scale measurements from the exact run:

| Pages | Full fixture elapsed | Bounded candidate pairs | Rendered HTML | Transaction hash | Corpus hash |
|---:|---:|---:|---:|---|---|
| 100 | 2,724.549 ms | 3,675 | recorded in transaction | `3d0c6f811943dc24dffe129ccb41c309952aeab04ddd2ed2cf1199763a3f8039` | `980432af923ec2664743d87504309acb2e2c344d7e050e6a47b879118948321c` |
| 500 | 3,425.700 ms | 509 | recorded in transaction | `e5dd559de045d4639d3b0179e2d869fd4d85709dc244b5e9c86c888cebd637bc` | `a1d07e19bde93ef821de4dfff362ec689503e6eb664a166c05ae0d374c328fb9` |
| 10,000 | 21,867.767 ms | 12,949 | 54,291,900 bytes | `481a1adc00ebc860f6f3c276c16978c7e28c3cfa62a39114d1bdb8e0cf013d72` | `67fe904020a2d0ca573790d135037515e200938ae4c7803c67e27a9ea47182b2` |

These are synthetic full-path measurements. They are not ordinary-framework comparisons and include no real post-generation 10K maintenance matrix.

## Exact full reference CI proof

```text
workflow: Hyper Site Reference
run: 29636565641
job: 88059836315
head: 9e03b1b6d43a574bb09fdcfd28f6edd153e56c68
result: success
```

Passed stages:

```text
npm install
npm test
manifest emission
UI emission
orchestration check
framework validation
framework preview
browser target validation
R3F build
```

## Framework comparison protocol now required

Hyper Site must be compared against at least one ordinary static, SSR, or SPA framework using the same:

```text
business/source fixture
visible page semantics
assets
routes and families
machine profile
runtime
build mode
cache policy
scale tiers
```

Required metrics include:

- cold build;
- incremental edit/build;
- development startup/update;
- peak memory;
- HTML, JavaScript, CSS, asset, and total output bytes;
- validation and crawl time;
- static serving behavior;
- browser and accessibility behavior;
- agent retries, approvals, recovery, and operator time;
- source, design-token, shared-component, page, and page-family maintenance changes.

Planning or generation timing alone cannot establish framework performance.

## 10K uncertainty boundary

A later 10K experiment must separately change:

```text
one page-specific source fact
one family-wide source fact
one design token
one shared component
one page-specific information object
one page
one page family
one evidence source
one ontology relation
one interrupted batch
```

For every change, record invalidated, rebuilt, and unchanged artifacts, elapsed time, memory, output churn, crawl effects, operator review burden, and rollback.

The current dependency graph plans logical invalidation. It does not yet prove file-level incremental compilation or advantage over ordinary frameworks.

## Network-science boundary

Network science remains valid only when a method improves a held-out decision such as:

- page-family coherence;
- relevance or information-object coverage;
- cannibalization risk;
- internal-link utility;
- source/page maintenance priority;
- drift/anomaly detection;
- page merge or retirement.

Every study requires a named simpler baseline, versioned graph fixture, held-out judgments, tail/noise and stability analysis, action policy, full-framework cost, and operator outcome.

No learned graph method was promoted in this pass.

## Explicit nonclaims

This report does not establish:

```text
an actual near-alpha release
one complete real case study
live GLM output quality or economics
real Blackwell/A100/H100/H200/5090/4090 performance
real starter-site design, typography, layout, graphics, or asset quality
continuous operation outside file-based snapshots
incremental compiler or dev-server performance
ordinary-framework advantage
real page relevance, information gain, accessibility, or usefulness
network-science benefit
10,000 pages that deserve publication
indexing, ranking, citations, conversion, revenue, or lifecycle return
GPU, HRR, ANN, Wasm, or Zig advantage
```

## Remaining blocking gate

```text
one real five-page starter-site case
+ approved business/style/type/layout/graphics/assets
+ actual compiler artifacts linked into the workspace graph
+ live provider and rented-node observations
+ the same case built in an ordinary framework
-> authoring/build/incremental/output/browser/accessibility/operator comparison
-> 25 real noindex pages with page-existence justifications
-> held-out design/relevance/graph judgments
-> 100, then 500
-> full 10K maintenance matrix
-> explicit alpha decision only if all predefined gates pass
```
