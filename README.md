# Hyper Site

Status: standalone vector-native site-generation compiler; synthetic 10k planning is source-wired; evidence-gated repository ingestion is implemented; real provider, reviewer, content, browser, search, and commercial acceptance remain pending  
Updated: 2026-07-18

## Product boundary

Hyper Site compiles explicit approved business truth into a finite static site program. The intended operator is a repository-aware coding agent, but agents propose; typed compiler and independent review gates accept or reject.

```text
repository snapshot + hyper-site.project.yaml
-> ProjectInput
-> AgentOntologyProposal
-> ApprovedOntology
-> typed sparse graph + constraints
-> bounded opportunity regions
-> sparse concave selection
-> HRR structure
-> SiteGenerationPlan
-> PageConceptProposal
-> CandidatePageSeed
-> PageCoordinate / CorpusPlan / PageGenerationJob
-> manifest / PageIR / static UI
```

One job is one finite site-generation run. Canonical HTML is static-first and does not require request-time generation, a vector database, or an always-on serving process.

## Real repository ingestion

`reference/src/repository-ingestion.ts` is the first production-boundary adapter beyond synthetic fixtures. It accepts:

- a captured repository revision and root-relative file snapshot;
- an explicit `hyper-site.project.yaml` declaration;
- declared repository source and asset paths;
- field-level evidence mapping for business, brand, technical, and goal truth.

It verifies bytes, hashes files deterministically, binds evidence to known source IDs, normalizes into the existing `ProjectInput`, and rejects missing truth, missing files, duplicate paths, unknown evidence IDs, or path traversal. It does not infer services, audiences, pricing, proof, brand, goals, or publication claims from repository prose.

This is ingestion infrastructure, not proof that a real business declaration is complete or that generated pages are useful.

## Current authorities

| Area | Source |
|---|---|
| repository ingestion | `reference/src/repository-ingestion.ts` |
| project truth | `reference/src/project-input.ts` |
| validation | `reference/src/validation-contracts.ts` |
| Stage 1 ontology | `reference/src/ontology-discovery.ts` |
| graph and constraints | `reference/src/ontology-graph.ts` |
| opportunity generation/selection | `reference/src/opportunity-*.ts` |
| Stage 2 contracts | `reference/src/site-program*.ts` |
| generation runner | `reference/src/page-generation.ts` |
| manifest/PageIR/static output | `reference/src/manifest.ts`, `reference/src/framework.ts` |

## Validation

From `reference/`:

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

The standalone workflow is `.github/workflows/reference.yml` and runs on `main`, `agent/**`, and pull requests.

## Research disposition

Canonical: deterministic lexical baseline, typed graph, separate hard constraints, bounded graph expansion, sparse concave selection, HRR after eligibility, two compiler-bounded agent stages, TypeScript oracle, static output.

Comparison-only: Leiden, graph learning, learned embeddings, HNSW/ANN, GPU provider optimization, Zig/Wasm. Mathematical or paper fit does not establish implementation fit.

## Proof boundary

Inherited source proof recorded 46/46 tests and a synthetic planning run of 15,000 candidates -> 10,000 selected regions -> 400 Stage-2 batches in 5,284.510 ms. That is compiler plumbing and scale evidence only.

Not proven: real relevance, useful page bodies, indexing, ranking, citations, conversion, revenue, complete 10k UI emission, or native/Wasm advantage.

## Next gate

1. Capture one real repository and operator-approved `hyper-site.project.yaml` without invented truth.
2. Add a JSON-schema-constrained Stage-1 provider adapter.
3. Add independent reviewer and observation approval.
4. Freeze a real ContextCorpus with held-out judgments.
5. Run 100–500 noindex Stage-2 jobs and atomically transact accepted outputs into canonical pages.
6. Validate information gain, cannibalization, browser, crawler, accessibility, and static delivery before scaling.
