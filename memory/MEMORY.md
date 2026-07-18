# Hyper Monorepo Durable Memory

status: active
updated_at: 2026-07-18T15:30:00-04:00

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

A one-page fixture was executed through the current public Hyper Site entrypoint and therefore through the transitional `reference/dist/framework-core.js` implementation.

Verified outputs and behavior:

- SiteSource structural validation;
- reference resolution across evidence, claims, information objects, modules, and pages;
- evidence-threshold rejection;
- PageIR construction;
- semantic HTML;
- metadata, canonical URL, robots, and JSON-LD;
- Markdown instruction projection;
- sitemap;
- reverse dependency index;
- page and build SHA-256 hashes.

The negative fixture was rejected with `claim claim-practical exceeds evidence ev-business` after its evidence level was lowered below the claim requirement.

This is evidence that the current compiler works for that fixture. It is not evidence of independent package installation, tarball consumption, full extraction, five-page usefulness, or production readiness.

## Demonstration rule

Never claim that a copied compatibility harness used the framework. Every future framework demonstration must record the exact public import, reached implementation path, input, outputs, independently verified hash or artifact, rejection test, and environment limitations.

## Current program

1. physical source extraction
2. clean package consumer proof
3. repository-owned verified compiler fixture
4. standalone five-page static proof
5. measured maintenance
6. optional local side-effect-free task

## Rules

- one canonical renderer and publisher during migration
- every advanced method has a direct simpler control
- model output remains proposal state
- every page needs independent existence justification
- new dependencies require a demonstrated fixture need and measured benefit
- current public boundary delegation to `reference/dist` must remain explicit
- one-page compiler verification is not the five-page product gate
- PR #3 stays draft

## Authorities

- README.md
- docs/README.md
- docs/catalog.json
- planning/meta-plan-v3.json
- planning/meta-plan-v3.steps.json
- docs/research/34-intellectual-competitive-and-use-case-landscape.md
- docs/architecture/35-reality-grounded-product-and-integration-boundary.md
- docs/planning/36-next-three-workstreams-reality-grounded-plan.md
- docs/validation/37-reality-grounded-product-validation-matrix.md

## Nonclaims

No complete extraction, independent package proof, five-page framework advantage, accepted real cohort, task advantage, production readiness, or business outcome is established.