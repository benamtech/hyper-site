# CODEGRAPH.md — Hyper Site / Hyper Content Monorepo

Status: two near-alpha package surfaces established; canonical implementation remains under staged extraction in `reference/`.  
Updated: 2026-07-18

## Root graph

```text
hyper-content
  ontology/evidence/content compiler
          |
          | produces approved static-site inputs
          v
hyper-site
  web framework / PageIR / HTML / CSS / publisher target
```

Hard dependency rule:

```text
hyper-content -> hyper-site
hyper-site -X-> hyper-content
```

Authority:

- root workspaces: `package.json`;
- framework facade: `hyper-site/index.mjs`;
- content facade: `hyper-content/index.mjs`;
- boundary gate: `scripts/check-product-boundaries.mjs`;
- research/falsification record: `docs/architecture/29-product-boundary-research-and-root-folder-split.md`;
- legacy implementation during extraction: `reference/src/`.

## Hyper Content graph

```text
repository + explicit project truth
  repository-ingestion.ts
  project-input.ts
        |
        v
source / evidence / asset ledgers
        |
        v
ontology proposal + independent approval
  glm-provider.ts
  generation-schemas.ts
  ontology-discovery.ts
        |
        v
ontology graph + constraints
  ontology-graph.ts
  typed-graph.ts
        |
        v
bounded opportunity and page selection
  opportunity-*.ts
  sparse-lexical.ts
  context-corpus.ts
  site-program*.ts
  page-coordinate.ts
        |
        v
CandidatePageSeed + evidence + design + link plan
        |
        v
PCN deterministic lowering
  pcn-emitter.ts
        |
        v
LLM prose backend
  page-backend.ts
  glm-provider.ts
        |
        v
ArticleIR external acceptance
  articleir-parser.ts
        |
        v
deterministic unfolding
  unfolder.ts
        |
        v
hyper-site public API
```

Content-side post-generation validation and lifecycle:

```text
output cohort
-> exact / lexical / embedding / evidence / information checks
-> checkpoints and recovery
-> noindex review
-> indexing/search/outcome feedback when implemented
-> evidence refresh, repair, retirement
```

Current content-owned research arms:

- HRR/vector packing and compatibility calculations;
- ontology graph experiments;
- BM25 and local semantic duplicate detection;
- current `wasm.ts` and `zig/` vector/facility kernels;
- GPU appliance and model workflows;
- RAG/IG/corpus experiments.

These may improve the content compiler. They are not framework runtime claims.

## Hyper Site graph

Target framework graph after extraction:

```text
site config + static content objects + design system + assets
        |
        v
SiteSource
        |
        v
PageIR
        |
        +-------------------+
        |                   |
        v                   v
semantic HTML          shared CSS/assets
        |                   |
        +---------+---------+
                  v
          static output directory
                  |
                  v
         publisher/deploy adapter
```

Framework-owned concerns:

- components and semantic module contracts;
- layout, typography, tokens, and themes;
- static HTML and structured-data emission;
- browser targets, accessibility, and performance budgets;
- dev server, incremental builds, cache/invalidation, and build output;
- static deployment and rollback;
- optional browser interaction adapters;
- future browser Wasm only after a measured framework workload exists.

Framework-forbidden imports/surfaces:

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
current wasm vector kernels
mixed legacy manifest
```

## Mixed legacy authorities to split

### `framework.ts`

Current state:

```text
static compiler
+ vector prototype packing
+ HRR feature compilation
+ graph/capability packed arrays
```

Target split:

```text
hyper-site static compiler
+ optional generic extension metadata

hyper-content vector adapter
+ content geometry packing
```

The static HTML compiler must not require content vectors.

### `manifest.ts`

Current state mixes:

- site metadata and page definitions;
- vector-space dimensions and nearest-link policy;
- agent-harness policy;
- evidence/claims/information objects;
- coverage contexts and facility/CSI analysis.

Target split:

```text
hyper-site SiteManifest
  base URL, pages, layouts, assets, design, output, deploy

hyper-content ContentProgramManifest
  evidence, ontology, vectors, generation, coverage, publication proposals
```

### `core.ts`

Current state mixes SHA-256/general utilities with vector/facility algorithms.

Target split:

```text
package-local or shared deterministic utilities
content-owned numeric/vector algorithms
```

### UI stack

`ui-scaffold.ts`, `ui-renderer.ts`, and `ui-metaprogramming.ts` are framework-oriented but currently consume mixed manifest/vector contracts. Extract a content-neutral UI plan before moving them physically.

### Validation

`validation-contracts.ts` is generic typed acceptance infrastructure, not merely checkpoint hashing. It may remain package-local or move to a narrow internal shared package after real bidirectional need is demonstrated.

## One publication authority

During migration:

```text
hyper-content facade
-> hyper-site facade
-> reference/dist/framework.js
```

This is intentional. Do not duplicate `compileSite`, PageIR, renderer, sitemap, or publisher behavior merely to make the folders look complete.

Physical source moves occur only after dependencies are cut and package tests prove the same output.

## Current package tests

`hyper-site/test/boundary.test.mjs` proves:

- static compiler functions are public;
- ontology, provider, PCN, ArticleIR, unfolding, and current Wasm functions are absent.

`hyper-content/test/boundary.test.mjs` proves:

- framework compilation remains reachable through the content package;
- ontology compilation is present;
- PCN emission is present;
- ArticleIR parsing is present;
- unfolding is present;
- current Wasm and provider functions remain content-owned.

`scripts/check-product-boundaries.mjs` proves:

- both root workspaces exist;
- dependency direction is one-way;
- framework facade contains no forbidden content-module references;
- content facade includes required compiler/backend modules.

## Measurement separation

### Hyper Site metrics

```text
scaffold/setup effort
dev-server startup/update
cold/incremental build
peak memory
HTML/CSS/JS/assets/total bytes
browser/Core Web Vitals/accessibility
deploy/rollback
component/theme/plugin ergonomics
```

### Hyper Content metrics

```text
evidence fidelity
contract compliance
information gain
duplicate/cannibalization performance
provider tokens/cost/latency/repair
content usefulness/indexing/search outcomes
cohort throughput
maintenance and retirement cost
```

Never combine these into one headline benchmark.

## Existing proof boundary

The synthetic 10,000-page run exercised the combined legacy content/compiler/validator path and emitted static HTML. It is content-pipeline and deterministic-output evidence.

It does not establish:

- isolated `hyper-site` build speed;
- framework advantage over Hugo, Astro, or Eleventy;
- useful or indexable pages;
- developer onboarding, HMR, templates, plugins, or deployment quality;
- current Wasm value for browser interaction;
- any GPU, graph, HRR, embedding, or ranking advantage.

## Migration order

```text
1. package facades and dependency gate       [implemented]
2. split site manifest from content program [pending]
3. extract content-neutral static compiler  [pending]
4. extract content-neutral UI contracts     [pending]
5. add dev/build/deploy framework surface   [pending]
6. move content modules in dependency order [pending]
7. move framework modules physically        [pending]
8. remove reference compatibility layer     [pending]
9. run isolated framework comparison        [pending]
10. run real content-to-framework case       [pending]
```

## Next gate

1. Make `hyper-site` compile a real five-page fixture without ontology/vector imports.
2. Add one publisher adapter and one-command static deployment.
3. Build the same frozen fixture in an ordinary framework.
4. Run a real PCN -> ArticleIR -> unfolder provider pass through `hyper-content` into the same framework target.
5. Keep PR #3 draft until the physical extraction, CI, real cases, and comparable benchmarks pass.

## Governed task-surface graph

```text
Hyper Content optional task proposal
  goal + evidence + inputs + outputs + limits
              |
              v
W7 protocol-neutral TaskServiceManifest / SurfacePlan
              |
      +-------+-------+
      |               |
      v               v
static fallback   runtime adapter interface
      |               |
      v               v
PageIR/HTML       intent -> events -> resource/receipt
      |               |
      +-------+-------+
              v
       governed task page
```

W7 is permanent. W1 remains static framework and renderer authority, W3 remains the temporary migration bridge, W4 owns observability/recovery/security infrastructure, and W6 owns field and revenue acceptance. Protocol adapters live outside the canonical ABI.
