# Documentation and Competitive Reality Pass

Timestamp: 2026-07-18 14:30 -04:00  
Branch: `agent/glm-blackwell-vertical-slice`  
PR: #3 draft, open and unmerged

## Scope

Reconciled bootstrap, package and authority documentation after the first physical Hyper Content source move. Added a critical external landscape covering closest and furthest use cases, competitors, complements, substitutes, enterprise upper bounds and simple control arms.

## New authority chain

- `docs/research/34-intellectual-competitive-and-use-case-landscape.md`
- `docs/research/sources/2026-07-18-intellectual-competitive-landscape.sources.json`
- `docs/architecture/35-reality-grounded-product-and-integration-boundary.md`
- `docs/planning/36-next-three-workstreams-reality-grounded-plan.md`
- `docs/validation/37-reality-grounded-product-validation-matrix.md`

## Reconciled documents

- `README.md`
- `AGENTS.md`
- `CODEGRAPH.md`
- `docs/README.md`
- `docs/catalog.json`
- `hyper-site/README.md`
- `hyper-content/README.md`

## Current implementation truth

- `hyper-content/src/content-program-adapter.ts` is canonical adaptation source.
- `reference/src/content-program-adapter.ts` is a temporary legacy manifest and parity wrapper.
- most Hyper Site and Hyper Content source still resides under `reference/src`.
- P1.4 and P1.5 remain incomplete.

## Strategic disposition

Closest wedge: compile approved evidence into a small static site and one bounded task with deterministic artifacts, rejection, human approval and portable deployment.

Furthest thesis: enterprise content-and-action operating layer. This overlaps Adobe AEM, Sitecore, Optimizely, Microsoft, Salesforce, ServiceNow and UiPath and remains long-horizon.

Integration-first complements include ordinary frameworks, headless CMSs, Temporal, LangGraph, n8n, OpenFeature/GrowthBook, OpenTelemetry and policy engines.

## Critical decisions

- static generation alone is not differentiation;
- ontology and graph methods are optional machinery;
- embeddings, HRR/HDC, Wasm and GPU require simple controls and measured promotion;
- PostgreSQL/JSON is the default state baseline;
- durable effects remain behind runtime adapters;
- 10K pages is a software scale tier, not a publication strategy;
- enterprise platform comparisons must include governance, operations, services and ecosystem gaps.

## Next gate

1. Run documentation and package CI on the exact head.
2. Fix any stale-link, catalog, workflow or package regression.
3. Update PR body and validation report only after exact-head green.
4. Begin the complete `reference/src` ownership inventory for P1.4/P1.5.

## Nonclaims

This pass is documentation, research and planning work. It does not complete physical extraction, task-surface implementation, standalone framework UX, real provider validation, enterprise readiness or commercial proof.
