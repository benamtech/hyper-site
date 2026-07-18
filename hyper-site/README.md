# @amtech/hyper-site

Status: near-alpha package boundary under extraction.

`hyper-site` is the web-framework layer in this monorepo. It owns the deterministic path from approved site data to static web artifacts and the developer-facing build, UI, browser, and deployment surface.

## Owns

- `SiteSource -> PageIR -> static HTML` compilation;
- semantic components, layouts, typography, design tokens, and shared CSS;
- browser-target, accessibility, and web-performance budgets;
- development/build ergonomics;
- publisher adapters for static hosting;
- optional browser interaction adapters, including R3F or future workload-proven Wasm modules.

## Does not own

- ontology discovery or graph pruning;
- BM25, embeddings, information-gain, or cannibalization analysis;
- LLM provider dispatch or prompt contracts;
- PCN, ArticleIR, evidence-ledger synthesis, or content repair;
- GPU model orchestration;
- current vector/facility Wasm kernels.

Those belong to `@amtech/hyper-content`.

## Transitional implementation

The public facade currently delegates to the canonical implementation under `reference/dist`. This preserves one publication path while the mixed legacy compiler is separated in dependency order.

A major remaining extraction task is removing vector/prototype packing from `framework.ts`. Until that is complete, the framework implementation still performs legacy content-geometry work internally even though those APIs are not exposed here.

## Dependency rule

```text
hyper-site -X-> hyper-content
```

The boundary test fails if ontology, provider, content-generation, mixed manifest, or current vector-Wasm modules enter this package surface.
