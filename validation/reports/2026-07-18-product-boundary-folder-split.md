# Product Boundary and Root Folder Split Validation

Status: product-separation hypothesis supported; root package boundary implemented and regression suites passed; physical source extraction remains pending  
Date: 2026-07-18  
Branch: `agent/glm-blackwell-vertical-slice`  
PR: `#3`  
Validated source head: `d2d5f2266198aa0e697e0ec480d4b971ef0c8169`

## Question

Does the repository contain one coherent web framework, or a web framework and a separate ontology/evidence/content compiler whose current package coupling creates technical and go-to-market ambiguity?

## Hypotheses

### H1

Ontology, retrieval, generation, graph-selection, and GPU/model systems do not improve browser runtime or ordinary static-framework ergonomics merely by being called from the same build.

### H2

The legacy single package exposes both products and forces framework evaluation through content-pipeline concepts.

### H3

A root npm workspace with one-way dependency `hyper-content -> hyper-site` can establish an honest product/API boundary without creating a second renderer or publication path.

### H4

The supplied criticism is directionally correct but contains file-level and benchmark overstatements that source inspection can falsify.

## Method

### Repo primary evidence

Inspected current branch source, package exports, import direction, test contracts, CI output, and synthetic scale reports.

Key mixed authorities:

- `reference/src/index.ts` exports framework, UI, ontology, retrieval, provider, orchestration, validation, Wasm, and research modules from one entry point;
- `reference/src/framework.ts` emits HTML but also compiles and packs HRR/vector prototypes;
- `reference/src/manifest.ts` combines site metadata with vector-space, agent-harness, evidence, coverage, CSI, and nearest-link policy;
- `reference/src/ui-scaffold.ts` and `ui-renderer.ts` are framework-oriented but consume mixed manifest/UI-metaprogramming contracts;
- `reference/src/wasm.ts` implements dot, normalize, weighted-add, and facility-marginal kernels;
- `reference/src/validation-contracts.ts` implements typed validation states, severities, findings, reports, and assertions.

### External primary evidence

Reviewed official documentation for:

- Hugo static generation, development server, modules/themes, and `hugo deploy`;
- Astro static output, components, islands, adapters, and deployment output;
- Eleventy output/runtime posture and its published fixture comparison;
- npm workspaces and linked local packages;
- Cloudflare Pages deployment and local development commands;
- MDN WebAssembly use cases and JavaScript/Wasm boundaries.

### External secondary evidence

Independent static-site benchmark articles were used to identify candidate claims and confounders. Reported times varied materially across fixtures, machines, templates, assets, image pipelines, and cache policies. They were not treated as authoritative performance constants.

## Falsification outcomes

| Claim | Result | Evidence |
|---|---|---|
| repository contains two products | supported | single package exports two distinct value and dependency surfaces |
| content systems have literally zero build impact | rejected | current static compiler and manifest invoke vector/content geometry during build |
| content systems belong in web framework because they affect current build | rejected | build impact is caused by wrong dependency direction; static emission does not semantically require ontology/retrieval/provider state |
| current Wasm is potential browser interactivity | rejected | current exports are vector/facility kernels, not Three.js, physics, image, DOM, or islands APIs |
| validation contracts are checkpoint hashes only | rejected | generic pass/fail/pending/severity/report infrastructure is implemented |
| exact Hugo 1s / Astro 3s 10K constants are established | rejected | no frozen comparable official fixture establishes those constants |
| root-folder one-way package split is feasible | supported | facades import, dependency gate passes, legacy canonical suite remains green |

## Implemented boundary

```text
/
├── hyper-site/
│   ├── package.json
│   ├── index.mjs
│   ├── README.md
│   └── test/boundary.test.mjs
├── hyper-content/
│   ├── package.json
│   ├── index.mjs
│   ├── README.md
│   └── test/boundary.test.mjs
├── scripts/check-product-boundaries.mjs
├── reference/
└── package.json
```

Dependency rule:

```text
hyper-content -> hyper-site
hyper-site -X-> hyper-content
```

Current compatibility path:

```text
hyper-content facade
-> hyper-site facade
-> reference/dist/framework.js
```

This preserves the existing canonical renderer and prevents a cosmetic split from creating a second PageIR or publication authority.

## Boundary assertions

### Static package check

`scripts/check-product-boundaries.mjs` asserts:

- root workspaces are exactly `hyper-site` and `hyper-content`;
- `hyper-content` declares `@amtech/hyper-site`;
- `hyper-site` does not declare `@amtech/hyper-content`;
- `hyper-site/index.mjs` contains no ontology, retrieval, opportunity, provider, PCN, ArticleIR, unfolder, current Wasm, or mixed-manifest references;
- `hyper-content/index.mjs` contains the framework target plus required compiler/backend modules.

### Runtime facade tests

`hyper-site/test/boundary.test.mjs` verifies:

- `compileSite` and design-system validation are public;
- ontology compilation, PCN, ArticleIR, unfolding, provider, and current Wasm functions are absent.

`hyper-content/test/boundary.test.mjs` verifies:

- `compileSite` is reachable through the framework dependency;
- ontology compilation, PCN emission, ArticleIR parsing, unfolding, provider generation, and current Wasm are public.

## Exact CI proof

### Focused near-alpha and package-boundary workflow

```text
workflow: Hyper Site Near-Alpha Pipeline
run: 29639039474
job: 88066298004
head: d2d5f2266198aa0e697e0ec480d4b971ef0c8169
result: success
artifact: near-alpha-test-log-29639039474
artifact digest: sha256:382db7d285b55ac6e4952234a4b3a7e5e5c60713231d17354a8b4b03b5636378
```

Successful steps included:

- TypeScript build;
- product-boundary static check;
- both package facade tests;
- operator command validation;
- backend-pass tests;
- production-boundary tests;
- near-alpha framework/release tests;
- workspace tests.

### Full legacy reference workflow

```text
workflow: Hyper Site Reference
run: 29639039488
job: 88066297939
head: d2d5f2266198aa0e697e0ec480d4b971ef0c8169
result: success
```

Successful steps included:

- complete test suite;
- manifest emission;
- UI emission;
- orchestration check;
- framework validation and preview;
- browser-target check;
- R3F adapter build.

## Product interpretation

### Hyper Site

Framework metrics are isolated to:

- scaffold and setup effort;
- dev-server startup/update;
- cold/incremental build;
- memory;
- HTML/CSS/JS/assets output;
- browser, accessibility, and Core Web Vitals;
- components, themes, plugins, deploy, and rollback.

### Hyper Content

Content metrics are isolated to:

- evidence fidelity;
- ontology/page-contract quality;
- information gain and duplicate rejection;
- provider token/cost/latency/repair;
- cohort throughput;
- indexing/search/commercial outcomes;
- content refresh, repair, and retirement cost.

The existing synthetic 10K full-path measurement belongs to the second category plus deterministic output evidence. It is not an isolated framework benchmark.

## Remaining hard gaps

- `framework.ts` still contains vector/prototype packing;
- `manifest.ts` remains a mixed site/content authority;
- UI code still consumes mixed manifest and vector contracts;
- `core.ts` mixes generic hashing with content numeric algorithms;
- no dev server, HMR, create-project command, publisher, or deploy command exists;
- no real five-page framework-only fixture exists;
- no comparable Hugo/Astro/Eleventy fixture has run;
- no real live PCN/ArticleIR provider case has completed;
- physical source migration from `reference/` is incomplete.

## Decision

The two-product diagnosis is accepted.

The root-folder package split is accepted as the correct immediate architecture, with one-way dependency and compatibility facades.

The physical source split is not declared complete. Moving mixed files before extracting their dependencies would create cosmetic folders, circular imports, or duplicate publication authority.

PR #3 remains draft.