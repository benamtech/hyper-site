# Hyper Monorepo Durable Memory

status: active
updated_at: 2026-07-18T18:45:00-04:00

## State

branch: agent/glm-blackwell-vertical-slice
pr: 3
draft: true
merged: false
maturity: research prototype approaching near-alpha

## Boundary

hyper-content -> hyper-site
hyper-site -X-> hyper-content

## Physical truth

- `hyper-content/src/content-program-adapter.ts` owns the first extracted content adapter implementation.
- `reference/src/content-program-adapter.ts` is a temporary compatibility wrapper.
- most package source still lives under `reference/src`.
- `hyper-site/index.mjs` currently delegates compiler exports to `reference/dist/framework-core.js`.
- P1.4 and P1.5 are incomplete.

## Verified execution state

A one-page fixture executed through the current public Hyper Site entrypoint and therefore through the transitional `reference/dist/framework-core.js` implementation.

Verified: SiteSource validation, reference resolution, evidence-threshold rejection, PageIR, semantic HTML, metadata, instruction Markdown, sitemap, dependency index, page hash, and build hash.

The negative fixture was rejected with `claim claim-practical exceeds evidence ev-business`.

This proves only that the current compiler works for that fixture. It does not prove independent package installation, tarball consumption, full extraction, five-page usefulness, maintenance advantage, or production readiness.

## Four-part program

Current authority: `docs/planning/38-four-part-product-workstream-map.md`.

```text
W1 physical package extraction
-> W2 standalone five-page static proof
-> W3 measured maintenance proof
-> W4 optional local task proof
```

The repository is in W1.

Immediate next slice:

```text
reference/src ownership inventory
-> neutral compiler-cluster extraction into hyper-site/src
-> public entrypoint switch
-> reference consumer conversion
-> verified one-page byte/hash parity
```

Do not begin W2 until this slice passes. Do not begin W4 until W3 demonstrates that the static product remains justified.

## Rules

- one canonical compiler, renderer, and publisher during migration
- every `reference/src` file receives exactly one owner and role
- stable and experimental exports remain separate
- future framework demonstrations record the public entrypoint, reached implementation, immutable input, artifacts, independent verification, rejection test, and limitations
- every advanced method has a direct simpler control
- every page needs independent existence justification
- new dependencies require a demonstrated fixture need and measured benefit
- current public delegation to `reference/dist` remains explicit
- one-page verification is not completion of W1 or W2
- PR #3 stays draft

## Authorities

- README.md
- docs/README.md
- docs/catalog.json
- planning/meta-plan-v3.json
- planning/meta-plan-v3.steps.json
- docs/research/34-intellectual-competitive-and-use-case-landscape.md
- docs/architecture/35-reality-grounded-product-and-integration-boundary.md
- docs/planning/38-four-part-product-workstream-map.md
- docs/planning/36-next-three-workstreams-reality-grounded-plan.md (superseded for execution ordering)
- docs/validation/37-reality-grounded-product-validation-matrix.md

## Nonclaims

No complete extraction, independent package proof, five-page framework advantage, maintenance advantage, accepted real cohort, task advantage, production readiness, or business outcome is established.