# @amtech/hyper-content

Status: research prototype under physical extraction  
Updated: 2026-07-18

`@amtech/hyper-content` compiles approved evidence and project truth into portable content and task proposals consumed by `@amtech/hyper-site`.

## Current source ownership

`src/content-program-adapter.ts` is the first canonical implementation physically owned by this package. It removes legacy content geometry and returns the neutral SiteSource contract accepted by Hyper Site.

Most evidence, ontology, opportunity, generation, validation, workspace, vector and acceleration implementations still live under `reference/src` and are re-exported temporarily through the package facade. P1.5 is not complete.

`reference/src/content-program-adapter.ts` is now a compatibility wrapper that retains legacy manifest compilation and artifact-parity assertions. It is not the canonical adaptation implementation.

## Owns

- repository, business, source, asset and evidence intake;
- claim and information-object proposals;
- ontology discovery, typed graphs, constraints and opportunity selection;
- page coordinates, duplicate analysis and page-existence proposals;
- provider dispatch, bounded repair and checkpoints;
- deterministic PCN emission;
- ArticleIR parsing, rejection and deterministic unfolding;
- corpus validation, invalidation and maintenance proposals;
- optional task-semantic proposals;
- experimental vector, graph, Wasm, Zig and GPU methods behind promotion gates.

## Does not own

- HTML rendering or PageIR authority;
- theme components or browser state;
- publisher implementation;
- credentials, identity or authorization;
- durable workflow execution and external effects;
- experiment statistics;
- private AI Employee runtime state.

## Dependency rule

```text
hyper-content -> hyper-site
```

Hyper Content must not maintain a second renderer or publisher.

## Backend target

```text
approved evidence and compiler state
-> page and task proposals
-> PCN
-> model backend
-> validated ArticleIR
-> deterministic unfolding
-> portable Hyper Site inputs
-> static artifacts and optional governed task mounts
```

The model proposes prose. It is not publication or effect authority.

## Required controls

Ontology, graph, embeddings, HRR/HDC, Wasm, GPU and autonomous selection remain experimental until they beat typed JSON/relational, lexical, CPU/JavaScript and human-curated controls on held-out cases.

## Next gate

1. Inventory all `reference/src` ownership.
2. Move coherent content clusters into `hyper-content/src`.
3. Replace star exports with explicit stable, experimental and internal surfaces.
4. Add clean tarball consumption.
5. Make `reference/` consume this package without runtime imports back into `reference/dist`.

Research and validation authority:

- `docs/research/34-intellectual-competitive-and-use-case-landscape.md`
- `docs/architecture/35-reality-grounded-product-and-integration-boundary.md`
- `docs/planning/36-next-three-workstreams-reality-grounded-plan.md`
- `docs/validation/37-reality-grounded-product-validation-matrix.md`
