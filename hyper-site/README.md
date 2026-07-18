# @amtech/hyper-site

Status: research prototype under physical extraction  
Updated: 2026-07-18

`@amtech/hyper-site` is the content-neutral static framework and governed task-mount layer.

## Owns

- deterministic `SiteSource -> PageIR -> static artifacts` compilation;
- semantic components, layouts, design tokens and shared assets;
- HTML, sitemap, instruction projections and dependency metadata;
- browser targets, accessibility and performance budgets;
- static fallback and trusted task-surface renderer contracts;
- future development, build, preview and publisher ergonomics.

## Does not own

- ontology discovery, evidence ranking or opportunity selection;
- provider dispatch, PCN, ArticleIR or content repair;
- embeddings, HRR/HDC, graph learning or packed content geometry;
- current vector/facility Wasm or GPU workflows;
- durable execution, connectors, external effects or receipts;
- identity, authorization, experiment statistics or private runtime state.

Those concerns belong to Hyper Content, runtime adapters or external systems.

## Current implementation truth

The canonical neutral compiler and manifest still reside in `reference/src/framework-core.ts` and `reference/src/site-manifest.ts`. The package facade consumes their build output while P1.4 moves clean source into `hyper-site/src`.

The explicit Hyper Content adapter implementation has moved to `hyper-content/src/content-program-adapter.ts`, but this does not complete Hyper Site extraction.

The target is:

```text
hyper-site/src
-> compiled package exports
-> reference compatibility fixtures consume @amtech/hyper-site
```

There must be one PageIR authority, one renderer and one publisher path during migration.

## Governed task surfaces

Hyper Site will own protocol-neutral public contracts and trusted rendering for optional task mounts. Static content remains complete without JavaScript. A runtime adapter owns policy, durable state, tools, effects and receipts.

A2UI, AG-UI and MCP Apps are adapters after the internal ABI passes. They do not define canonical state.

## Dependency rule

```text
hyper-site -X-> hyper-content
hyper-site -X-> private runtime internals
```

## Differentiation burden

Static HTML alone is not a differentiator. Astro, Hugo, Eleventy and Next.js already provide mature static output. Hyper Site must prove value through portable governed contracts, deterministic invalidation, author-boundary enforcement, better lifecycle economics or safer page-to-task integration.

## Next gate

1. Move the neutral compiler, manifest and PageIR source into `hyper-site/src`.
2. Add explicit package exports and clean tarball consumption.
3. Make `reference/` consume the package.
4. Build one five-page standalone fixture.
5. Compare it against an equivalent ordinary-framework implementation.

Authority:

- `docs/research/34-intellectual-competitive-and-use-case-landscape.md`
- `docs/architecture/35-reality-grounded-product-and-integration-boundary.md`
- `docs/planning/36-next-three-workstreams-reality-grounded-plan.md`
- `docs/validation/37-reality-grounded-product-validation-matrix.md`
