# CODEGRAPH.md — Hyper Site / Hyper Content Monorepo

Status: two product boundaries established; physical extraction incomplete  
Updated: 2026-07-18

## Root dependency graph

```text
approved evidence and project truth
        |
        v
@amtech/hyper-content
  proposals, generation, validation and maintenance
        |
        v
@amtech/hyper-site
  content-neutral PageIR, static artifacts and task mounts
        |
        v
optional runtime adapters
  policy, durable workflows, connectors, effects and receipts
```

Hard rules:

```text
hyper-content -> hyper-site
hyper-site -X-> hyper-content
hyper-site -X-> private runtime internals
protocol adapters -X-> canonical domain authority
```

## Current physical ownership

```text
hyper-content/src/content-program-adapter.ts
  canonical geometry-removal adapter

reference/src/content-program-adapter.ts
  temporary legacy manifest compiler and parity wrapper

reference/src/framework-core.ts
reference/src/site-manifest.ts
  current neutral Hyper Site source pending P1.4

reference/src/*
  most remaining content and framework implementation pending classification and extraction
```

Folder boundaries are not complete source boundaries. `reference/` is still transitional implementation authority, but its target role is consumer, compatibility suite, fixtures, examples and benchmarks.

## Target repository graph

```text
hyper-site/
  src/
    framework core
    SiteSource and PageIR
    renderer and design contracts
    browser and accessibility policy
    task-surface contracts
    publisher interfaces
  test/
  dist/

hyper-content/
  src/
    intake and evidence
    ontology and opportunity
    generation and ArticleIR
    validation and maintenance
    task-semantic proposals
    experimental vectors/Wasm/GPU
  test/
  dist/

reference/
  fixtures/
  examples/
  compatibility/
  benchmarks/
  scripts/
```

## Hyper Content graph

```text
repository + explicit project truth
-> source, evidence and asset ledgers
-> claim and information-object proposals
-> optional ontology and opportunity methods
-> independently approved page seeds
-> deterministic PCN
-> model prose backend
-> ArticleIR validation
-> deterministic unfolding
-> portable Hyper Site inputs
```

Content lifecycle:

```text
cohort proposal
-> page-existence and evidence review
-> duplicate/cannibalization checks
-> noindex artifact review
-> publication decision
-> evidence refresh and dependency invalidation
-> repair or retirement
```

Experimental arms remain optional:

- graph and ontology methods;
- lexical and embedding retrieval;
- HRR/HDC and vector packing;
- current Wasm/Zig kernels;
- GPU/model acceleration;
- automated opportunity selection.

Each requires a simple control and measured promotion.

## Hyper Site graph

```text
site config + portable content objects + design + assets
-> SiteSource
-> PageIR
-> semantic HTML + structured data + shared CSS/assets
-> static output
-> publisher adapter
```

Optional interaction path:

```text
static page and fallback
-> governed task mount
-> typed intent
-> runtime adapter policy and execution
-> ordered public projection
-> artifact/action/receipt
```

Hyper Site owns the public contract and trusted renderer. Runtime adapters own identity, authorization, durable state, tools, effects and private session data.

## Forbidden Hyper Site imports

```text
ontology*
context-corpus
sparse-lexical
opportunity*
site-program*
page-generation
glm-provider
pcn-emitter
articleir-parser
unfolder
current vector/facility Wasm
packed content geometry
private runtime credentials or memory
```

## External complements

```text
Astro/Hugo/Eleventy/Next.js
  controls or alternate render targets

headless CMS
  editorial and structured-content input

Temporal
  durable workflow and recovery

LangGraph
  stateful agent orchestration and human review

n8n/Power Automate
  connectors and deterministic business effects

OpenFeature/GrowthBook/Optimizely
  experiment delivery and analysis

OpenTelemetry
  trace and metric correlation

OPA/Cedar/host policy
  authorization decisions
```

Core must not reimplement these categories unless an owned invariant cannot be preserved through an adapter.

## Source extraction order

```text
1. inventory every reference/src file
2. move neutral framework core and manifest to hyper-site/src
3. make reference consume @amtech/hyper-site
4. classify and split mixed UI modules
5. move content clusters to hyper-content/src
6. replace star exports with explicit surfaces
7. make reference consume @amtech/hyper-content
8. add clean tarball consumers
9. remove product runtime imports into reference
10. retire duplicate compatibility source
```

## Validation graph

```text
research and alternatives
-> accepted architecture
-> executable plan and RED tests
-> implementation
-> measured validation report
-> immutable memory handoff
-> catalog, README, CODEGRAPH and PR reconciliation
```

Current authority chain:

- `docs/research/34-intellectual-competitive-and-use-case-landscape.md`
- `docs/architecture/35-reality-grounded-product-and-integration-boundary.md`
- `docs/planning/36-next-three-workstreams-reality-grounded-plan.md`
- `docs/validation/37-reality-grounded-product-validation-matrix.md`

## First credible proof graph

```text
one approved evidence set
-> five justified pages
-> one bounded task
-> one static publisher
-> one durable runtime adapter
-> ordinary-framework and ordinary-form controls
-> held-out operator and artifact review
```

Ten thousand pages remains a mandatory software scale tier, not a publication or usefulness claim.

## Maturity boundary

Not yet proven:

- complete physical extraction;
- independent tarball use;
- standalone scaffold and publisher;
- ordinary-framework advantage;
- real five-page acceptance;
- governed runtime isolation;
- task completion advantage;
- graph/vector/Wasm/GPU advantage;
- enterprise governance or commercial outcomes.

PR #3 remains draft and unmerged.
