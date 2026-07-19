# 2026-07-18 05:30 — Product Boundary and Root Folder Split

## State

```text
repo: benamtech/hyper-site
branch: agent/glm-blackwell-vertical-slice
PR: #3
PR title: Split Hyper Site framework and Hyper Content compiler surfaces
validated head: d2d5f2266198aa0e697e0ec480d4b971ef0c8169
maturity: research prototype approaching near-alpha
merge: keep draft; do not merge
```

## Product decision

The repository contains two products:

```text
hyper-content -> hyper-site
hyper-site -X-> hyper-content
```

- `hyper-site`: static web framework, PageIR, HTML/CSS, components/layouts, browser/accessibility/performance policy, dev/build/deploy surface, optional browser adapters.
- `hyper-content`: ontology/evidence/content compiler, retrieval/selection, providers, PCN, ArticleIR, unfolding, corpus checks, checkpoints, current vector Wasm/Zig, GPU/model workflows.

The initial criticism was directionally correct, but four claims were rejected:

1. current Wasm is vector/facility math, not browser interactivity;
2. validation contracts are generic typed acceptance infrastructure, not hash-only decoration;
3. content math has current build impact because legacy dependencies are mixed, not because it belongs in the web framework;
4. exact Hugo/Astro 10K timing constants are unsupported without a shared frozen fixture.

Research and falsification authority:

- `docs/architecture/29-product-boundary-research-and-root-folder-split.md`;
- `validation/reports/2026-07-18-product-boundary-folder-split.md`.

## Implemented

### Root workspaces

```text
package.json
hyper-site/
hyper-content/
scripts/check-product-boundaries.mjs
```

### Hyper Site facade

Exports the canonical static compiler and browser/CSS framework primitives.

Rejects public leakage of:

- ontology;
- context corpus;
- sparse lexical retrieval;
- opportunity/site-program/page-generation;
- providers;
- PCN/ArticleIR/unfolder;
- current Wasm;
- mixed legacy manifest.

### Hyper Content facade

Exports:

- the Hyper Site target;
- ontology/graph/retrieval/selection/content modules;
- provider and orchestration modules;
- PCN emitter;
- ArticleIR parser;
- unfolder;
- current vector Wasm;
- production-boundary and workspace modules.

### Boundary tests

- `hyper-site/test/boundary.test.mjs`;
- `hyper-content/test/boundary.test.mjs`;
- `scripts/check-product-boundaries.mjs`.

### Canonical docs

Updated:

- `README.md`;
- `AGENTS.md`;
- `CODEGRAPH.md`;
- `identity.md`;
- PR #3 title/body.

## Compatibility boundary

Physical source migration is not complete.

Current single-publication path:

```text
hyper-content facade
-> hyper-site facade
-> reference/dist/framework.js
```

This is intentional. Do not create a second PageIR, renderer, sitemap, or publisher to make the folder split look complete.

Mixed authorities that must be decomposed before physical move:

- `framework.ts`: static compiler plus vector packing;
- `manifest.ts`: site manifest plus content/vector/agent program;
- `core.ts`: general utilities plus numeric algorithms;
- UI scaffold/renderer/metaprogramming: framework behavior plus mixed manifest/vector inputs;
- validation contracts: generic infrastructure requiring a deliberate shared-or-local decision.

## Exact CI proof

### Focused workflow

```text
workflow: Hyper Site Near-Alpha Pipeline
run: 29639039474
job: 88066298004
head: d2d5f2266198aa0e697e0ec480d4b971ef0c8169
result: success
artifact: near-alpha-test-log-29639039474
artifact digest: sha256:382db7d285b55ac6e4952234a4b3a7e5e5c60713231d17354a8b4b03b5636378
```

The new `Validate product boundaries` step passed before the existing operator and near-alpha suites.

### Full reference workflow

```text
workflow: Hyper Site Reference
run: 29639039488
job: 88066297939
head: d2d5f2266198aa0e697e0ec480d4b971ef0c8169
result: success
```

Passed:

- full tests;
- manifest emission;
- UI emission;
- orchestration;
- framework validation/preview;
- browser check;
- R3F build.

## Backend pass retained under Hyper Content

The same branch also adds:

```text
compiler state -> PCN -> provider -> ArticleIR parser -> deterministic unfolder
```

Authorities:

- `reference/src/pcn-emitter.ts`;
- `reference/src/articleir-parser.ts`;
- `reference/src/unfolder.ts`;
- `reference/src/page-backend.ts`;
- `reference/test/page-backend-pass.test.mjs`.

The content backend targets Hyper Site; it is not part of framework onboarding or performance claims.

## Not proven

- completed physical package extraction;
- framework-only build without vector packing;
- site/content manifest split;
- create-project/dev server/HMR;
- publisher/deploy command;
- real five-page Hyper Site case;
- ordinary-framework benchmark;
- live PCN/ArticleIR provider case;
- useful/indexable content cohort;
- browser-Wasm value;
- indexing, ranking, conversion, revenue.

## Next gate

```text
1. split SiteManifest from ContentProgramManifest
2. remove vector packing from Hyper Site compileSite
3. extract content-neutral UI contracts
4. add create/dev/build/deploy framework surface
5. add one static publisher adapter
6. build a real five-page Hyper Site-only fixture
7. run a frozen ordinary-framework comparison
8. run a live Hyper Content PCN/ArticleIR case into that target
9. extend to 25 real noindex pages
10. complete physical source migration and remove reference compatibility layer
```
