# CODEGRAPH.md — Near-Alpha Agent-First Web Framework

Status: standalone research prototype approaching near-alpha. Repository ingestion, GLM proposal contracts, independent approvals, design authority, canonical PageDraft-to-PageIR emission, resumable generation, continuous artifact snapshots, bounded invalidation, and synthetic 10K validation are implemented. Real framework baselines, real cases, live providers/hardware, and field acceptance remain pending.  
Updated: 2026-07-18

## Canonical lifecycle graph

```text
local repository + hyper-site.project.yaml + source/style/assets
  production-cli.mjs ingest
  repository-ingestion.ts
        |
        v
ProjectInput + source/evidence/asset ledgers
  project-input.ts
        |
        +-----------------------------------------------+
        | continuous AgentWorkspaceSnapshot             |
        | near-alpha-framework.ts + agent-workspace.ts  |
        | datasheets, design, starter site, batches,    |
        | maintenance artifacts, hashes, dependencies   |
        +-----------------------------------------------+
        |
        v
physical Stage 1: GLM AgentOntologyProposal
  glm-provider.ts
  generation-schemas.ts
        |
        v
exact-hash independent approval
  production-approve.mjs
  applyOntologyApproval
        |
        v
ApprovedOntology
  ontology-discovery.ts
        |
        v
CompiledOntologyGraph
  ontology-graph.ts
  typed sparse edges + separate requires/excludes
        |
        v
bounded opportunity selection
  opportunity-generation-optimized.ts
  opportunity-space-optimized.ts
  opportunity-space-production.ts
  sparse concave selection + HRR structure
        |
        v
SiteGenerationPlan
  site-program-optimized.ts
        |
        +------------------------------------------+
        | approved core-site design authority      |
        | design-authoring.ts                      |
        | design system, typography, layouts,      |
        | graphics briefs, starter-page contracts  |
        +------------------------------------------+
        |
        v
physical Stage 2: bounded GLM PageDraft batches
  generation-schemas.ts
  JSON object mode + external validation
  bounded repair or reject
        |
        v
existing PageConceptProposal compiler
  site-program.ts
        |
        v
atomic canonical transaction
  page-draft-transaction.ts
  PageConcept -> CandidatePageSeed -> SiteSource -> PageIR
  framework.ts
        |
        v
shared static design renderer
  design-authoring.ts
        |
        v
bounded local corpus validator
  corpus-validation-production.ts
  exact + sparse lexical + local semantic candidates
  evidence/information/static crawl checks
        |
        v
noindex static review site + reports + checkpoints
  production-orchestrator.ts
  production-cli.mjs run
        |
        v
post-generation workspace changes
  workspace-cli.mjs
  planAgentWorkspaceInvalidation
  unchanged artifact hashes + bounded rebuild scope
        |
        v
near-alpha framework evaluation
  near-alpha-framework.ts
  ordinary-framework baselines + TDD + network studies
  real case studies + page-existence + scale-transition gates
```

There is one canonical publication path. New model output converges on the existing `compilePageConceptProposals` and `compileSite` authorities. The workspace and near-alpha evaluator wrap that path; they do not create a second PageIR or publication system.

## Maturity interpretation

```text
production-boundary source name
!=
production-ready product
```

The repository is near-alpha research. Synthetic full emission can demonstrate deterministic execution, recovery, and bounded complexity. It cannot establish framework superiority, design quality, useful pages, or field readiness.

## Physical model topology

```text
Stage 1: one bounded ontology proposal job per project
Stage 2: deterministic PageDraft batches
Stage 3: optional independent observation/repair review
```

Conceptual compiler passes remain deterministic code and validation concerns. They are not seven mandatory API calls per page.

## Continuous workspace graph

`AgentWorkspaceSnapshot` is an immutable artifact graph.

Artifact phases:

```text
discovery
datasheet-authoring
design-authoring
starter-site
bulk-generation
post-generation-maintenance
case-study-evaluation
```

Artifact kinds include:

```text
business-datasheet
evidence-ledger
style-guide
design-system
typography-system
layout-system
graphic-brief
starter-page
page-batch
post-generation-patch
validation-report
case-study
```

Every artifact declares producer, sources, dependencies, status, and content hash. A new snapshot points to the prior snapshot hash.

`planAgentWorkspaceInvalidation` traverses reverse dependencies from changed artifacts and emits:

```text
changed artifact IDs
invalidated artifact IDs
unaffected artifact IDs
dependency edges
stable plan hash
```

This is the first framework-maintenance primitive. It is not yet an incremental compiler or build cache; measured file-level invalidation and rebuild behavior remain pending.

## Near-alpha evaluation graph

`evaluateNearAlphaFramework` validates ten independent boundaries:

| Boundary | Pass vector | Fail vector |
|---|---|---|
| maturity | research-prototype/near-alpha language | production claim from synthetic scale |
| agent continuity | initial authoring + starter site + bulk + maintenance | bulk-only or hidden loop |
| core framework | approved datasheet/design/type/layout/graphics/starter artifacts before batches | corpus compiler without useful core site |
| TDD | hypotheses map to tests and falsification rules | architecture claim without executable failure test |
| scientific protocol | frozen fixtures, commands, machines, metrics, baselines | post-hoc or self-only benchmark |
| network science | simpler baseline + held-out outcomes + action policy | decorative graph metrics |
| real use | non-synthetic revisioned case study | testimonial or synthetic-only case |
| page existence | task + information + evidence + neighbor difference + owner | unique route/title/vector only |
| framework baseline | direct ordinary-framework comparison | planning/generation timing only |
| scale transition | 25/100/500/10K full metrics and incremental edits | cold-build-only 10K or claim beyond measured ceiling |

## Near-alpha boundary map

| Boundary | Authority | Implemented state | Remaining gate |
|---|---|---|---|
| maturity and scientific rejection | `near-alpha-framework.ts`, doc 27 | executable pass/fail vector | real baseline and case inputs |
| continuous workspace | `agent-workspace.ts`, `workspace-cli.mjs` | immutable snapshots and transitive invalidation | connect actual compiler outputs and file rebuilds |
| repository truth | `repository-ingestion.ts` | bytes, revision, field evidence, no inference | one real approved repository |
| core authoring | `design-authoring.ts` | design authority, core-page briefs, safe shared CSS | real typography/layout/graphics/starter-site quality |
| appliance | `appliance-contract.ts` | Blackwell target + compatibility profiles | benchmark rented nodes |
| provider | `glm-provider.ts` | Z.AI JSON transport and bounded repair | live latency/token/schema/evidence measurements |
| ontology/graph | existing discovery and graph modules | deterministic governed compiler | real observations and held-out judgments |
| Stage 2 | `generation-schemas.ts` | complete PageDraft batch contract | real prose, utilities, and design integration |
| canonical transaction | `page-draft-transaction.ts` | atomic SiteSource/PageIR/static build | real accepted batch |
| recovery | `production-orchestrator.ts` | dependency-bound checkpoints | persistent interruption/restart on rented node |
| corpus validator | `corpus-validation-production.ts` | bounded exact/lexical/local semantic/evidence/render checks | real embedding and relevance corpus |
| ordinary framework comparison | `near-alpha-framework.ts` contract only | schema and rejection vector | benchmark harness and frozen fixture |
| publication | `framework.ts` | noindex static output | real accessibility/browser/crawler/operator acceptance |

## Design invariants

- The core site is designed before bulk landing-page generation.
- Design system, typography, layout, graphics, and starter-page artifacts are workspace state.
- Design source IDs and exact approval hashes are preserved.
- The design generator cannot self-approve.
- CSS is one shared static artifact, not regenerated for every page.
- Unsafe or remote CSS constructs reject.
- Post-generation design refinement preserves canonical content hashes and index state.
- Human-perceived design quality is pending until real review.

## Generation checkpoint graph

```text
Stage 1 checkpoint
  project hash + source excerpt hash + provider identity

Stage 2 checkpoint
  project + ontology + plan + batch + design + provider
  + source excerpt hash + prior accepted batch hashes

transaction checkpoint
  project + ontology + plan + design + base URL + draft hashes

corpus checkpoint
  transaction + embedding backend identity + validation policy hash
```

Checkpoint payload bytes have their own hash. Semantic artifact identities remain separate.

## Framework comparison fixture

The pending benchmark harness must compare Hyper Site and at least one ordinary static, SSR, or SPA framework on the same:

```text
business/source fixture
visible page semantics
assets
routes and page families
machine profile
runtime
build mode
cache policy
```

Metrics:

```text
cold build
incremental edit/build
dev server startup/update
peak memory
HTML/JS/CSS/assets/total output
validation time
static serving/crawl
browser and accessibility
agent/operator effort
recovery and rollback
```

## 10K maintenance matrix

The next 10K claim requires more than full emission. Independently change:

```text
one page-specific source fact
one family-wide fact
one design token
one shared component
one information object
one page
one page family
one evidence source
one ontology relation
one interrupted batch
```

Record invalidated, rebuilt, and unchanged artifacts, time, memory, output churn, crawl changes, review burden, and rollback.

## Existing synthetic proof

A prior exact-head run emitted and validated 10,000 synthetic PageIR/static HTML pages with bounded candidate comparison. That remains useful software proof.

It does not prove:

- an attractive starter site;
- ordinary-framework performance advantage;
- incremental invalidation or maintenance advantage;
- real agent workspace continuity;
- real relevance, information gain, accessibility, or usefulness;
- any network-science, GPU, HRR, ANN, Wasm, or Zig advantage;
- indexing, ranking, citations, conversion, revenue, or lifecycle return.

The newest validation report and memory handoff contain exact current-head CI evidence.

## Next gate

```text
1. Freeze one real five-page starter-site case.
2. Implement workspace linkage to actual compiler/design/asset outputs.
3. Build an ordinary-framework benchmark harness.
4. Run live provider and rented-node experiments.
5. Compare authoring, cold build, incremental edits, output, browser, accessibility, and operator work.
6. Extend the case to 25 real noindex pages with page-existence justifications.
7. Freeze held-out relevance, design, and graph judgments.
8. Scale 100 -> 500.
9. Run the full 10K maintenance matrix.
10. Decide whether the evidence earns an alpha milestone.
```
