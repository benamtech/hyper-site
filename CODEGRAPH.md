# CODEGRAPH.md — Vector-Native Site Generation Compiler

Status: standalone root; evidence-gated repository ingestion added; real providers, independent review, real context corpus, canonical output transaction, and field acceptance remain pending  
Updated: 2026-07-18

## Canonical source graph

```text
explicit repository snapshot + hyper-site.project.yaml
  reference/src/repository-ingestion.ts
  bytes, revision, deterministic hashes, field-level evidence
        |
        v
ProjectInput + source/evidence/asset ledgers
  reference/src/project-input.ts
        |
        v
Stage-1 AgentOntologyProposal
        |
        v
ApprovedOntology
  reference/src/ontology-discovery.ts
  provenance + materiality + targeting safety + reviewer gates
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
SiteGenerationPlan / Stage-2 PageConceptProposal
  reference/src/site-program-optimized.ts
  reference/src/site-program.ts
        |
        v
CandidatePageSeed
        |
        v
PageCoordinate / CorpusPlan / PageGenerationJob
  reference/src/page-coordinate.ts
  reference/src/corpus-plan.ts
  reference/src/page-generation.ts
        |
        v
manifest / PageIR / static UI
  reference/src/manifest.ts
  reference/src/framework.ts
  reference/src/ui-*.ts
```

`reference/src/agent-site-orchestrator.ts` remains the one two-stage front end. No second publication pipeline is permitted.

## Production boundary map

| Boundary | Authority | State | Next gate |
|---|---|---|---|
| project truth | `reference/src/project-input.ts` | implemented | real declarations from operators |
| repository ingestion | `reference/src/repository-ingestion.ts` | implemented and test-gated | adapter that captures a real repository/config snapshot |
| ontology | `reference/src/ontology-discovery.ts` | compiler-gated proposal contract | JSON-schema provider + independent reviewer |
| graph | `reference/src/ontology-graph.ts` | typed, sparse, constraints separated | reviewed real observations |
| opportunity | `reference/src/opportunity-space-production.ts` | synthetic 10k planning pass | frozen real hidden-slice evidence |
| HRR | `reference/src/opportunity-space-optimized.ts` | structural representation only | external usefulness validation |
| Stage 2 | `reference/src/site-program.ts` | contracts and seed compiler | real provider + atomic accepted-output transaction |
| generation | `reference/src/page-generation.ts` | provider-neutral bounded runner | real agent adapter |
| publication | `reference/src/framework.ts` | static source pass | 100–500 noindex browser/a11y/crawler validation |

## Ingestion invariants

- The config is explicit business truth, not an extraction prompt.
- Every promoted field has declared source IDs.
- Every source and asset resolves to captured root-relative bytes.
- Content hashes bind the declaration to the repository revision.
- Missing fields, unknown evidence IDs, missing files, duplicate paths, and traversal paths reject.
- Repository prose is never used to fill missing business truth.

## Retained production baseline

```text
TF-IDF/BM25
+ typed graph and hard constraints
+ weighted observations
+ bounded closed conjunctions
+ k-core pruning
+ constrained best-first expansion
+ sparse concave coverage
+ HRR after eligibility
+ two compiler-bounded agent stages
+ static deterministic output
```

Comparison-only: Leiden, learned graph methods, learned embeddings, ANN, GPU inference optimization, Zig/Wasm kernels. Promotion requires primary-source fit, a simpler baseline, frozen validation vectors, parity/safety, and measured full-run improvement.

## Exact inherited proof

The imported source state previously recorded 46/46 tests and a synthetic planning fixture of 15,000 candidates -> 10,000 selected regions -> 400 Stage-2 batches in 5,284.510 ms. That proof is retained as synthetic compiler evidence only.

The current branch adds repository ingestion tests and restores standalone CI. Final exact-head proof belongs in the newest validation report and memory handoff after CI completion.

## Not proven

Real relevance, useful page bodies, indexing, ranking, AI citations, conversion, revenue, 10,000 complete UIs, or Wasm/GPU advantage.

## Next gates

```text
1. real repository/config snapshot adapter and operator fixture
2. Stage-1 JSON-schema provider adapter
3. independent reviewer and observation approval workflow
4. frozen real ContextCorpus with held-out judgments
5. 100–500 noindex Stage-2 jobs
6. atomic canonical output transaction
7. information-gain, cannibalization, browser, crawler, accessibility validation
8. scale only after those gates pass
```
