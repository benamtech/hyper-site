# @amtech/hyper-site

Status: near-alpha package boundary under physical extraction.

`hyper-site` is the content-neutral web-framework layer in this monorepo. It owns deterministic compilation from approved site data to static web artifacts plus the developer-facing build, UI, browser and deployment surface.

## Owns

- `SiteManifest -> SiteSource -> PageIR -> static HTML` compilation;
- semantic components, layouts, typography, design tokens and shared CSS;
- browser-target, accessibility and web-performance budgets;
- development/build ergonomics;
- publisher adapters for static hosting;
- optional browser adapters such as R3F or a future workload-proven browser Wasm module.

## Does not own

- ontology discovery or graph pruning;
- BM25, embeddings, information-gain or cannibalization analysis;
- LLM provider dispatch or prompt contracts;
- PCN, ArticleIR, evidence-ledger synthesis or content repair;
- GPU model orchestration;
- current vector/facility Wasm kernels or packed content geometry.

Those belong to `@amtech/hyper-content`.

## Current implementation

The public facade now targets the content-neutral compiler in `reference/src/framework-core.ts` and the neutral `reference/src/site-manifest.ts`. The TypeScript build still emits those files from `reference/` while physical ownership is migrated in dependency order.

The legacy `reference/src/framework.ts` is now a Hyper Content compatibility adapter: it delegates web compilation to the neutral core, then adds vector prototypes and packed IR. Exact web-artifact parity is enforced in tests.

The next boundary step is an explicit ContentProgramManifest-to-SiteSource adapter, followed by moving clean framework source into `hyper-site/src` and making `reference/` consume the package.

## Dependency rule

```text
hyper-site -X-> hyper-content
```

The boundary gate rejects ontology, provider, content-generation, mixed-manifest, current vector-Wasm, packed-geometry and legacy framework imports from this package surface.
