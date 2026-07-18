# AGENTS.md — Hyper Site Operating Contract

Status: active  
Updated: 2026-07-18  
Scope: repository root

## Read first

1. `identity.md`
2. `AGENTS.md`
3. `CODEGRAPH.md`
4. `README.md`
5. `memory/MEMORY.md`
6. newest immutable file under `memory/`
7. `26-graph-learning-paper-triage-and-promotion-gates.md`
8. `25-academic-crosswalk-agent-harness-structured-generation-and-acceleration.md`
9. `24-agent-discovered-ontology-and-10k-site-program.md`
10. newest report under `validation/reports/`
11. `site-manifest.yaml`
12. `reference/README.md`

The repository is standalone. Do not use former `GTM-RESEARCH/website-framework`, parent-directory, `mvp-build`, or removed source-repository paths as live authority.

## Canonical pipeline

```text
ProjectInput
-> AgentOntologyProposal
-> ApprovedOntology
-> typed sparse graph + separate constraints
-> bounded opportunity regions
-> sparse concave selection
-> HRR structure
-> SiteGenerationPlan
-> PageConceptProposal
-> CandidatePageSeed
-> PageCoordinate / CorpusPlan / PageGenerationJob
-> manifest / PageIR / static UI
```

Preserve one pipeline. Do not create a parallel manifest, context corpus, page selector, generation runner, output transaction, or publication path.

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
- Same-model self-critique never accepts ontology or page output.
- Independent reviewers or externally supplied observations control approval.
- Repair is bounded; exhausted repair rejects the output.

## Validation

Every substantive change must name its validation vector, pass/fail boundary, simpler baseline, and measured evidence. Hard failures stop orchestration. Pending and not-run remain visible.

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

Synthetic compiler scale does not prove real relevance, useful pages, indexing, ranking, citations, conversion, revenue, or native/Wasm advantage.

## Publication boundary

No page enters an indexable cohort until evidence, relevance, information gain, distinctness, cannibalization, utility/task, path, static delivery, canonical, browser, crawler, accessibility, and lifecycle gates pass. Initial real cohorts remain noindex.

## Memory and commits

- `memory/MEMORY.md` is the current TOON index.
- Append immutable `memory/YYYY-MM-DD-HHMM-<slug>.md` handoffs.
- Record branch, exact commit, CI run, test count, artifacts, unrun validation, remaining failures, and next gate.
- Commit or merge only coherent work that has passed the applicable validation suite.
