# Hyper Monorepo

Status: research prototype approaching near-alpha  
Updated: 2026-07-18  
PR: #3 remains draft and unmerged

## Products and dependency direction

```text
@amtech/hyper-content
  evidence, ontology, opportunity, generation and validation
        |
        v
@amtech/hyper-site
  content-neutral static framework and governed task mounts
        |
        v
optional runtime adapters
  durable workflows, connectors, effects and receipts
```

Allowed dependency direction:

```text
hyper-content -> hyper-site
hyper-site -X-> hyper-content
hyper-site -X-> private AI Employee/runtime internals
runtime adapters -> public task-surface contracts
```

## Current implementation truth

The package split is in progress, not complete.

- `hyper-content/src/content-program-adapter.ts` is the first physically owned Hyper Content implementation.
- `reference/src/content-program-adapter.ts` is now a temporary legacy manifest compiler and artifact-parity wrapper.
- Most canonical Hyper Site and Hyper Content source still resides under `reference/src` pending P1.4 and P1.5.
- `reference/` remains a transitional implementation and test authority, but its target role is compatibility suite, fixture library, example consumer and benchmark harness.
- Folder names and package facades do not prove source ownership.

## Hyper Site

`@amtech/hyper-site` owns:

- deterministic `SiteSource -> PageIR -> static artifacts` compilation;
- content-neutral contracts;
- HTML, sitemap, instruction projections and dependency metadata;
- trusted renderer, design, accessibility and browser contracts;
- static fallback and optional governed task mounts;
- future development, build, preview and publisher ergonomics.

It does not own ontology discovery, evidence ranking, model providers, PCN, ArticleIR, embeddings, vector packing, GPU workflows, durable effects, connectors, identity, authorization or experimentation statistics.

## Hyper Content

`@amtech/hyper-content` owns:

- source and evidence intake;
- claim and information-object proposals;
- ontology and opportunity methods;
- page-existence, duplicate and corpus analysis;
- provider dispatch and structured generation;
- PCN and ArticleIR acceptance;
- deterministic adaptation to Hyper Site inputs;
- validation, invalidation and maintenance proposals;
- experimental graph, vector, Wasm and acceleration methods behind promotion gates.

It does not own web rendering, theme components, browser state, credentials, runtime effects or publication authority.

## Governed task surfaces

Static pages explain and prove. Optional task surfaces submit typed intents to a runtime adapter and receive ordered public projections, resources, artifacts, actions and receipts.

Theme developers own trusted components and accessibility. Site developers own routes, mounts, fallback and deployment. Growth operators own bounded approved variants and outcomes. None may widen capabilities, expose private state or weaken safety policy.

A2UI, AG-UI, MCP Apps and AI Employee runtimes are adapters after the protocol-neutral internal ABI passes.

## Reality-grounded product position

Hyper overlaps several mature categories: static frameworks, headless CMSs, content intelligence, digital experience platforms, agent orchestration, workflow automation, generative UI and experimentation.

The closest credible wedge is deliberately narrow:

> Compile approved business evidence into a small, maintainable static site and one bounded task surface, with deterministic artifacts, explicit rejection, human approval and portable deployment.

The furthest thesis is an enterprise content-and-action operating layer. That outcome overlaps Adobe AEM, Sitecore, Optimizely, Microsoft, Salesforce, ServiceNow, UiPath and other mature platforms. It is a long-horizon hypothesis and must not cause premature reimplementation of CMS, DAM, identity, workflow, policy, experimentation or connector infrastructure.

Strong complements and controls include Astro, Hugo, Eleventy, Next.js, headless CMSs, Temporal, LangGraph, n8n, OpenFeature, GrowthBook, OpenTelemetry, policy engines, PostgreSQL and ordinary form/workflow products.

## Critical nonclaims

The repository does not yet prove:

- complete physical source ownership under both packages;
- independent package/tarball consumption;
- a production-ready framework or content compiler;
- a useful developer scaffold, HMR or publisher;
- superiority to Astro, Hugo, Eleventy, Next.js or a CMS-based stack;
- that ontology, graph, embeddings, HRR/HDC, Wasm, GPU or model methods beat simpler controls;
- that 10,000 pages deserve publication;
- indexing, ranking, citation, conversion, revenue or customer retention;
- production-safe public runtime isolation;
- A2UI, AG-UI, MCP Apps or enterprise-agent conformance;
- enterprise readiness, tenancy, governance, integrations, SLAs or support.

Synthetic scale proves bounded software behavior only. Schema validity does not prove content quality. Visible agent completion does not prove authorized completion.

## Current execution order

1. Complete physical package extraction and make `reference/` consume the packages.
2. Implement the protocol-neutral governed task-surface ABI with negative tests.
3. Build one standalone five-page site and publisher.
4. Freeze an equivalent ordinary-framework comparison.
5. Run one real evidence-to-five-page provider cohort.
6. Run one bounded task through a durable runtime adapter and compare it with an ordinary form or workflow product.
7. Expand only after held-out review and maintenance events pass.

Detailed authority: `docs/planning/36-next-three-workstreams-reality-grounded-plan.md`.

## Workspace commands

```bash
npm run build
npm test
npm run check:boundaries
```

During migration, root workflows build owned package source where present, build and test the transitional reference implementation, and enforce dependency boundaries.

## Required controls

Every advanced method must compete against a simpler baseline:

| Candidate | Control |
|---|---|
| ontology graph | typed JSON or relational schema |
| graph database | PostgreSQL |
| embeddings | lexical retrieval and explicit rules |
| HRR/HDC and vector packing | ordinary vectors, arrays and maps |
| Wasm | JavaScript or server implementation |
| GPU | CPU baseline |
| generated UI | static or trusted native components |
| autonomous workflow | deterministic state machine or established workflow engine |
| autonomous page selection | human-curated page plan |

No method is promoted because it is novel, theoretically elegant or successful on a synthetic fixture.

## First credible validation fixture

```text
one approved business evidence set
-> five independently justified pages
-> one bounded public task
-> one static deployment
-> one durable workflow adapter
-> human approval before publication or consequential effect
```

Compare against:

- a skilled operator using Astro and structured Markdown;
- a headless CMS plus Astro or Next.js;
- an SEO/content tool plus human production;
- an ordinary site with an embedded form or workflow service.

Measure operator time, defects, evidence fidelity, maintenance cost, page acceptance, task completion, artifact quality, latency, model/runtime cost, recovery, idempotency and receipts.

## Documentation authority

Documentation lifecycle and current read order: `docs/README.md`.

Current reality-grounded chain:

- Research: `docs/research/34-intellectual-competitive-and-use-case-landscape.md`
- Source registry: `docs/research/sources/2026-07-18-intellectual-competitive-landscape.sources.json`
- Architecture: `docs/architecture/35-reality-grounded-product-and-integration-boundary.md`
- Plan: `docs/planning/36-next-three-workstreams-reality-grounded-plan.md`
- Validation: `docs/validation/37-reality-grounded-product-validation-matrix.md`

Governed task-surface chain:

- `docs/intake/2026-07-18-next-generation-task-surfaces.md`
- `docs/research/31-next-generation-task-surfaces-protocol-crosswalk.md`
- `docs/architecture/32-governed-task-surface-architecture.md`
- `docs/validation/33-task-surface-validation-matrix.md`

Executable authority:

- `planning/meta-plan-v3.json`
- `planning/meta-plan-v3.steps.json`
- `scripts/check-meta-plan.mjs`
- `scripts/check-product-boundaries.mjs`

Durable state:

- `memory/MEMORY.md`
- newest immutable handoff under `memory/`
- newest measured report under `validation/reports/`

Historical documents remain preserved for intellectual provenance. Their status in `docs/catalog.json`, not their wording, determines current authority.

## Documentation system

Documentation lifecycle and research catalog: `docs/README.md`. Machine-readable document authority: `docs/catalog.json`.
