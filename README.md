# Hyper Monorepo

Status: research prototype approaching near-alpha  
Updated: 2026-07-18  
PR: #3 remains draft and unmerged

## Products

```text
@amtech/hyper-content
  source, evidence, content proposals, generation, validation
        |
        v
@amtech/hyper-site
  content-neutral static compilation and web artifacts
```

Allowed direction:

```text
hyper-content -> hyper-site
hyper-site -X-> hyper-content
```

## Current implementation truth

The split is not complete.

- `hyper-content/src/content-program-adapter.ts` is the first canonical Hyper Content implementation physically owned by the package.
- `reference/src/content-program-adapter.ts` is a temporary legacy manifest compiler and artifact-parity wrapper.
- Most canonical source still lives under `reference/src` pending P1.4 and P1.5.
- `hyper-site/index.mjs` currently re-exports the canonical compiler from `reference/dist/framework-core.js`.
- `reference/` must become a package consumer, compatibility suite, fixture library, example set, and benchmark harness.

## Verified current compiler capability

The current compiler implementation has been executed against a real one-page `SiteSource` through the present public boundary:

```text
consumer build script
-> hyper-site/index.mjs
-> reference/dist/framework-core.js
-> compileSite(SiteSource)
```

That verified run demonstrated:

- structural `SiteSource` validation;
- evidence, claim, information-object, module, and page reference resolution;
- evidence-level rejection for an under-supported claim;
- deterministic `SiteSource -> PageIR` transformation;
- neutral semantic HTML emission;
- canonical URL, description, robots, and JSON-LD output;
- optional Markdown instruction projection;
- XML sitemap generation;
- reverse dependency-index generation;
- per-page SHA-256 and whole-build hash generation.

The positive fixture produced one page with `hero`, `workflow`, and `cta` modules. A negative fixture lowered an evidence level below the claim requirement and was rejected with `claim claim-practical exceeds evidence ev-business`.

This proves that the current compiler implementation works for that fixture. It does not prove independent package installation, clean tarball consumption, a normal repository-external developer workflow, or product usefulness.

### Required language for future demonstrations

Do not describe a copied or behaviorally similar harness as having used the framework.

A valid framework execution claim must record:

1. the exact import entrypoint;
2. the exact implementation path reached by that entrypoint;
3. the input fixture;
4. the emitted artifacts;
5. at least one independently recomputed output or hash;
6. at least one relevant rejection test;
7. all environment limitations.

Until physical extraction is complete, explicitly state that the public Hyper Site boundary delegates to `reference/dist`.

## Hyper Site

Owns deterministic `SiteSource -> PageIR -> static artifacts` compilation, HTML, sitemap, instruction projections, dependency metadata, rendering contracts, accessibility and browser budgets, and static publication.

It does not own ontology, evidence ranking, model providers, PCN, ArticleIR, embeddings, vector packing, GPU work, or content generation.

## Hyper Content

Owns source and evidence intake, claim and information-object proposals, page selection, structured generation, PCN and ArticleIR acceptance, corpus validation, maintenance proposals, and portable output for Hyper Site.

It does not own web rendering, theme components, browser state, or publication authority.

## Current product hypothesis

Typed evidence, explicit rejection, deterministic compilation, and dependency-aware maintenance may reduce defects and lifecycle cost for small static sites. This is unproven.

## Immediate proof target

```text
one approved evidence set
-> five independently justified pages
-> one static theme
-> one deterministic build
-> one local publisher
-> one measured source-fact change
-> one measured shared-design change
```

Only after that passes may one bounded, side-effect-free local task be tested against an ordinary form.

## Current execution order

1. Complete physical package extraction.
2. Make `reference/` consume both packages.
3. Add clean tarball consumers.
4. Commit a repository-owned verified compiler fixture and execution report.
5. Build one standalone five-page site.
6. Add a local publisher.
7. Run one real evidence-to-five-page noindex cohort.
8. Measure maintenance changes.
9. Test one local side-effect-free task against an ordinary form.

Detailed authority: `docs/planning/36-next-three-workstreams-reality-grounded-plan.md`.

## Nonclaims

The repository does not yet prove complete physical ownership, independent package consumption, production readiness, framework superiority, useful page generation, task advantage, advanced-method value, indexing, ranking, conversion, revenue, or customer retention.

The verified one-page execution is implementation evidence, not a completed five-page product gate.

## Commands

```bash
npm run build
npm test
npm run check:boundaries
```

## Documentation authority

- lifecycle: `docs/README.md`
- catalog: `docs/catalog.json`
- research: `docs/research/34-intellectual-competitive-and-use-case-landscape.md`
- architecture: `docs/architecture/35-reality-grounded-product-and-integration-boundary.md`
- plan: `docs/planning/36-next-three-workstreams-reality-grounded-plan.md`
- validation: `docs/validation/37-reality-grounded-product-validation-matrix.md`
- durable state: `memory/MEMORY.md`

Historical documents remain preserved, but `docs/catalog.json` determines current authority.

## Governed task surfaces

Hyper Site's next interaction layer is a protocol-neutral governed task-surface platform. Static pages remain complete and indexable; optional runtime services accept typed intents and return public projections, resources, artifacts, actions, and receipts. Theme developers own trusted renderers, site developers own mounts and fallbacks, and growth operators own bounded experiment and conversion policy. Hyper Content may propose task semantics but contains zero UI implementation logic.

Current authority:

- `docs/intake/2026-07-18-next-generation-task-surfaces.md`
- `docs/research/31-next-generation-task-surfaces-protocol-crosswalk.md`
- `docs/architecture/32-governed-task-surface-architecture.md`
- `docs/validation/33-task-surface-validation-matrix.md`

A2UI, AG-UI, MCP Apps, and AMTECH AI Employee are adapters after the internal ABI passes. Ten-thousand-page surface scale is a mandatory benchmark tier, not a page-usefulness claim.

## Documentation system

Documentation lifecycle and research catalog: `docs/README.md`. Machine-readable document authority: `docs/catalog.json`.
