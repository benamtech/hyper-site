# @amtech/hyper-content

Status: near-alpha ontology and content compiler under extraction.

`hyper-content` turns approved business truth, evidence, design authority, and page opportunities into validated content artifacts consumed by `@amtech/hyper-site`.

## Owns

- repository, business, source, asset, and evidence intake;
- ontology discovery, typed graphs, constraints, opportunity selection, and page coordinates;
- lexical and embedding retrieval, duplicate detection, information-gain experiments, and corpus validation;
- provider dispatch, bounded repair, checkpoints, and content-workspace lifecycle;
- deterministic PCN emission;
- ArticleIR parsing and rejection;
- deterministic unfolding to Markdown, JSON-LD, HTML inputs, links, and sitemap state;
- current vector/facility Wasm and Zig research;
- GPU-backed model, embedding, validation, and image-generation workflows.

## Backend path

```text
approved compiler state
-> PCN
-> LLM backend
-> validated ArticleIR
-> deterministic unfolder
-> @amtech/hyper-site
-> static web artifacts
```

The model is a constrained prose backend, not publication authority.

## Does not claim

- faster browser rendering;
- lower LCP, CLS, INP, or TTFB merely because ontology/math exists;
- faster static builds than Hugo, Astro, or Eleventy;
- that current Wasm kernels provide browser interactivity;
- that every generated page should be indexed.

## Dependency rule

```text
hyper-content -> hyper-site
```

The package intentionally targets the framework package instead of maintaining a second renderer or publisher.

## Transitional implementation

The facade currently delegates to modules under `reference/dist`. Physical migration will proceed after mixed authorities such as `framework.ts`, `manifest.ts`, `core.ts`, and shared validation types are decomposed without creating a second publication path.
