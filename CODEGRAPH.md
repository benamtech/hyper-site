# CODEGRAPH.md — Vector-Native Site Generation Compiler

Status: standalone root; operator repository ingestion, GLM structured generation, independent approvals, design authority, atomic PageDraft-to-PageIR transaction, resumable batches, static emission, and bounded synthetic 10K corpus validation are implemented. Real repository/provider/hardware/field acceptance remains pending.  
Updated: 2026-07-18

## Canonical production graph

```text
local repository + hyper-site.project.yaml + style/source/assets
  reference/scripts/production-cli.mjs ingest
  reference/src/repository-ingestion.ts
        |
        v
ProjectInput + source/evidence/asset ledgers
  reference/src/project-input.ts
        |
        v
physical Stage 1: GLM AgentOntologyProposal
  reference/src/glm-provider.ts
  reference/src/generation-schemas.ts
        |
        v
exact-hash operator / independent reviewer approval
  production-approve.mjs ontology
  applyOntologyApproval
        |
        v
ApprovedOntology
  reference/src/ontology-discovery.ts
        |
        v
CompiledOntologyGraph
  reference/src/ontology-graph.ts
  typed sparse edges + separate requires/excludes
        |
        v
ProductionOpportunitySpace
  reference/src/opportunity-generation-optimized.ts
  reference/src/opportunity-space-optimized.ts
  reference/src/opportunity-space-production.ts
  bounded expansion + sparse concave selection + HRR structure
        |
        v
SiteGenerationPlan
  reference/src/site-program-optimized.ts
        |
        +-----------------------------+
        | approved design authority   |
        | design-authoring.ts         |
        | core-page briefs + CSS      |
        +-----------------------------+
        |
        v
physical Stage 2: bounded GLM PageDraft batches
  generateStageTwoPageBatch
  JSON object mode + external schema/semantic validation
  bounded repair or reject
        |
        v
existing PageConceptProposal compiler
  reference/src/site-program.ts
        |
        v
atomic canonical transaction
  reference/src/page-draft-transaction.ts
  PageConcept -> CandidatePageSeed -> SiteSource -> PageIR
  reference/src/framework.ts
        |
        v
shared static design renderer
  reference/src/design-authoring.ts
        |
        v
bounded local corpus validator
  reference/src/corpus-validation-production.ts
  exact duplicate + sparse lexical + local semantic LSH
  + evidence/information + static crawl checks
        |
        v
noindex static site + validation reports + checkpoints
  reference/src/production-orchestrator.ts
  reference/scripts/production-cli.mjs run
```

There is one canonical publication path. New model output converges into the existing `compilePageConceptProposals` and `compileSite` authorities; it does not create a second manifest or PageIR implementation.

## Physical model topology

```text
Stage 1: one bounded ontology proposal job per project
Stage 2: deterministic batches of PageDraft jobs
Stage 3: optional independent review/repair observations only
```

The older conceptual pass names remain useful compiler concerns, but they are not seven mandatory API calls per page.

## Production boundary map

| Boundary | Authority | Implemented state | Remaining real gate |
|---|---|---|---|
| appliance | `appliance-contract.ts` | Blackwell optimized target + compatibility profiles | benchmark real rented nodes |
| repository truth | `repository-ingestion.ts` | bytes, revision, paths, field evidence, no inference | one operator-approved business repo |
| provider transport | `glm-provider.ts` | Z.AI chat completions, JSON mode, timeout, bounded repair | live GLM request/evaluation |
| Stage 1 | `generation-schemas.ts` | external schema/ledger validation | real proposal quality |
| ontology approval | `generation-schemas.ts`, `production-approve.mjs` | exact-hash human/independent approval | real reviewer observations |
| graph/opportunity | existing ontology/opportunity modules | same deterministic compiler | held-out real contexts |
| design | `design-authoring.ts` | core-page briefs, approval, safe shared CSS, restyle invariant | real creative review and assets |
| Stage 2 | `generation-schemas.ts` | complete PageDraft batch schema and validation | live generated prose/utility quality |
| transaction | `page-draft-transaction.ts` | atomic canonical SiteSource/PageIR/static build | real accepted batch |
| recovery | `production-orchestrator.ts` | immutable payload/dependency checkpoints | interruption test on persistent rented node |
| corpus validation | `corpus-validation-production.ts` | bounded exact/lexical/local-semantic/evidence/render checks | real embedding model and relevance set |
| operator experience | production CLI scripts | doctor, ingest, provider check, Stage 1, approval, run, emit | packaged installer/UI and usability test |
| publication | `framework.ts` | noindex static output | accessibility/browser/crawler review on real pages |

## Appliance profiles

Optimized:

- `rtx-pro-6000-blackwell-96gb`.

Compatibility candidates, not equivalent guarantees:

- `h200-141gb`;
- `h100-80gb`;
- `a100-80gb`;
- `rtx-5090-32gb`;
- `rtx-4090-24gb`.

Hardware price is a time-stamped observation and soft economic vector. It does not determine feature acceptance.

## Design invariants

- The core site is designed before bulk landing-page generation.
- Design source IDs and exact approval hashes are preserved.
- The design generator cannot self-approve.
- CSS is one shared static artifact, not regenerated for each page.
- Unsafe or remote CSS constructs reject.
- Post-generation design refinement must preserve canonical content hashes and index state.
- Attractive rendering cannot change evidence, claims, route identity, or publication authority.

## Checkpoint dependency graph

```text
Stage 1 checkpoint
  project hash + source excerpt hash + provider identity

Stage 2 checkpoint
  project + ontology + plan + batch + design + provider
  + source excerpt hash + hashes of prior accepted batches

transaction checkpoint
  project + ontology + plan + design + base URL + all draft hashes

corpus checkpoint
  transaction + embedding backend identity + validation policy hash
```

Checkpoint payload bytes have their own hash. Artifact hashes such as `transactionHash` remain separate semantic identities.

## Validation proof

Focused production workflow run `29635741933` on branch head `5cfcc85fd6fe6910b9e4a2e366581e5514f08ffa` passed:

- 10/10 production tests;
- operator command syntax/help;
- 25-page atomic/noindex/design/recovery gates;
- near-duplicate rejection;
- full synthetic 100, 500, and 10,000 PageDraft -> PageIR -> HTML -> corpus-validation path.

Measured 10,000 fixture:

```text
pages: 10,000
elapsed: 19,179.290 ms
rendered HTML: 54,291,900 bytes
bounded candidate pairs: 12,949
transaction: 481a1adc00ebc860f6f3c276c16978c7e28c3cfa62a39114d1bdb8e0cf013d72
corpus: 67fe904020a2d0ca573790d135037515e200938ae4c7803c67e27a9ea47182b2
```

The existing full reference workflow also passed through test, manifest, UI, orchestration, framework, browser, and R3F validation on the same code/example head before documentation reconciliation.

## Explicit nonproof

Synthetic full emission does not prove:

- real relevance, insight, factual completeness, usefulness, or search demand;
- live GLM structured-output reliability or cost;
- Blackwell, A100, H100, H200, 5090, or 4090 runtime performance;
- indexability, rankings, citations, conversion, revenue, or lifecycle return;
- that every one of 10,000 pages deserves to exist;
- GPU, HRR, ANN, Zig, or Wasm advantage.

## Next gate

```text
one real repository + approved business facts + real style authority
-> live Stage 1 proposal
-> independent approval
-> 25 real noindex PageDrafts
-> local semantic/evidence/render checks
-> human and held-out relevance review
-> 100, then 500
-> 10,000 only after field gates pass
```
