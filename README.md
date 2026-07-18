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
- `reference/` must become a package consumer, compatibility suite, fixture library, example set, and benchmark harness.

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

## Direct controls

- typed JSON or Markdown plus templates;
- an explicit human-authored page list;
- lexical and rule-based checks;
- arrays and maps;
- direct JavaScript or server code;
- an ordinary static implementation;
- normal HTML forms.

Advanced methods remain experimental until they beat these controls on a real workload.

## Current execution order

1. Complete physical package extraction.
2. Make `reference/` consume both packages.
3. Add clean tarball consumers.
4. Build one standalone five-page site.
5. Add a local publisher.
6. Run one real evidence-to-five-page noindex cohort.
7. Measure maintenance changes.
8. Test one local side-effect-free task against an ordinary form.

Detailed authority: `docs/planning/36-next-three-workstreams-reality-grounded-plan.md`.

## Nonclaims

The repository does not yet prove complete physical ownership, independent package consumption, production readiness, framework superiority, useful page generation, task advantage, advanced-method value, indexing, ranking, conversion, revenue, or customer retention.

Synthetic scale proves bounded software behavior only. Schema validity does not prove content quality.

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
