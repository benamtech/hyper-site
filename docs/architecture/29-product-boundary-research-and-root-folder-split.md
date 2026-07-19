# 29 — Product Boundary Research and Root-Folder Split

Status: decision recorded; root-folder package boundary adopted; physical legacy-source migration remains staged  
Date: 2026-07-18  
Branch: `agent/glm-blackwell-vertical-slice`

## Question

Does the repository contain one coherent agent-first web framework, or two products whose current coupling harms evaluation, developer experience, and go-to-market clarity?

Candidate products:

1. `hyper-site`: static web framework, renderer, UI system, browser/runtime adapters, and publisher surface.
2. `hyper-content`: ontology/evidence/content compiler that produces inputs for `hyper-site`.

## Method

### Primary evidence

- current branch source and imports;
- current package exports;
- current tests and CI measurements;
- official Hugo, Astro, Eleventy, npm workspaces, Cloudflare Pages, and MDN WebAssembly documentation.

### Secondary evidence

Independent SSG comparisons and benchmark articles were used only to discover candidate claims and confounders. Their reported build times varied by more than an order of magnitude, so they were not accepted as performance truth.

### Hypotheses

H1. The ontology/retrieval/generation stack does not improve browser runtime metrics or ordinary static-site developer ergonomics.

H2. The current public package surface makes the web framework appear to require the content compiler.

H3. A root-folder workspace with one-way dependency `hyper-content -> hyper-site` reduces product and dependency ambiguity without requiring separate repositories.

H4. The proposed criticism is directionally correct but contains incorrect file classifications and unsupported benchmark constants.

### Falsification rules

Reject the split if any of these are true:

- the static renderer requires ontology, retrieval, calibration, provider, or corpus-selection state to emit correct HTML;
- the content compiler cannot consume a stable static-site API without duplicating the publication path;
- folder separation adds a circular dependency;
- current Wasm code is actually a browser-interactivity runtime rather than content/math acceleration;
- the exact Hugo/Astro timing claims are reproducible from official comparable fixtures.

## Repo findings

### 1. One package currently exports both products

`reference/src/index.ts` exports static rendering, UI, browser, ontology, opportunity selection, lexical retrieval, provider, batch orchestration, validation, Wasm, and research modules from one entry point.

Verdict: H2 supported.

### 2. The canonical static compiler is coupled to content geometry

`reference/src/framework.ts` emits HTML, but it also imports HRR/vector types and packs page/prototype vectors into every compiled site. The static HTML path does not semantically require those vectors.

Verdict: the criticism is correct about product coupling, but wrong to describe the scientific stack as having literally no build-path impact. It currently has build-path impact because the dependency direction is wrong, not because it belongs in the web framework.

### 3. `manifest.ts` is not a pure deployment manifest

The current manifest includes:

- vector-space identity and dimensions;
- vector-nearest internal-link policy;
- agent-harness configuration;
- evidence, claims, information objects, and coverage contexts;
- facility-location and CSI calculations.

Verdict: `manifest.ts` must be split. The current file belongs primarily to `hyper-content`; `hyper-site` needs a smaller site/build/deployment manifest.

### 4. Current Wasm is not a web-interactivity runtime

`reference/src/wasm.ts` exposes dot product, normalization, weighted addition, and facility-marginal kernels. These accelerate vector and selection workloads. It does not provide Three.js transforms, physics, image filters, DOM integration, or an islands runtime.

Verdict: the proposed classification of current `wasm.ts` as potentially high-impact web-framework interactivity is false. A future `hyper-site` Wasm runtime may be useful, but the current Wasm/Zig arm belongs to `hyper-content` research.

### 5. `validation-contracts.ts` is generic infrastructure

It defines typed validation attributes, findings, hard/soft severity, pending state, deterministic reports, and assertion behavior. Hashing is one implementation detail.

Verdict: it is not zero-value decoration. It may be shared through the framework package or split into package-local utilities, but it is not the product moat.

### 6. UI code is closer to a framework, but still coupled

`ui-scaffold.ts` and `ui-renderer.ts` operate on `PageIR`, layout roles, components, CSS, and browser constraints. However, they currently consume `CompiledFrameworkManifest`, vector geometry, and agentic UI planning state.

Verdict: framework-relevant, but extraction requires replacing content-geometry inputs with a smaller site/UI contract.

### 7. The current benchmark is not an SSG comparison

The validated 10,000-page fixture completed the entire synthetic content/compiler/validation path in about 21.9 seconds and emitted about 54.3 MB of HTML. This is not comparable to an SSG-only build because it includes ontology-derived fixtures, vector packing, duplicate validation, and corpus checks.

Verdict: the result is useful content-pipeline evidence and invalid framework marketing evidence.

## External findings

### Hugo

Official documentation describes Hugo as a speed-optimized static site generator, provides a development server, modules/themes, static output, and `hugo deploy` for supported object-storage targets.

### Astro

Official documentation provides reusable components and layouts, static output by default, selective client/server islands, a deploy-ready `dist/`, and hosting adapters/guides.

### Eleventy

Official documentation positions Eleventy as a simpler SSG with no injected client runtime and publishes a reproducible-style 4,000-Markdown-file comparison on its own fixture.

### Deployment

Cloudflare documents `wrangler pages deploy <directory>` and local Pages development. A credible framework surface should wrap or integrate these existing deployment primitives rather than invent a hosting protocol first.

### WebAssembly

MDN describes Wasm as a near-native compilation target that complements JavaScript for compute-intensive workloads such as 3D, computer vision, and media editing. This supports a future framework runtime only when a measured browser workload exists. It does not reclassify the current vector/facility kernels.

### Exact benchmark claims

The statements “Hugo builds 10K pages in 1 second” and “Astro builds 10K pages in 3 seconds” were not validated. Official sources make qualitative or fixture-specific claims; independent published numbers vary drastically with templates, assets, image processing, cache state, hardware, and page complexity.

Verdict: do not use those constants in requirements or marketing. Freeze a shared fixture and measure locally.

## Decision

The criticism is **directionally correct and materially important**:

- two products exist;
- the web framework is buried;
- content-generation research should not define the framework onboarding surface;
- GPU/content-quality infrastructure is not a web-performance value proposition;
- one-way package dependency is required.

The criticism is **incorrect or overstated** in four places:

1. current Wasm is content/math acceleration, not browser interactivity;
2. `validation-contracts.ts` is broader than checkpoint hashing;
3. “zero impact” conflates browser runtime, build-path coupling, and product-surface impact;
4. exact competitor build-time constants are unsupported without a frozen comparable benchmark.

## Root folder boundary

```text
/
├── hyper-site/
│   ├── package.json
│   ├── index.mjs
│   └── README.md
├── hyper-content/
│   ├── package.json
│   ├── index.mjs
│   └── README.md
├── reference/                 # legacy implementation during staged migration
└── scripts/check-product-boundaries.mjs
```

Dependency rule:

```text
hyper-content -> hyper-site
hyper-site -X-> hyper-content
```

## Ownership

### `hyper-site`

- canonical static `SiteSource -> PageIR -> HTML` interface;
- deterministic renderer and shared CSS/UI contracts;
- browser targets and accessibility/performance budgets;
- component/layout/design-system surface;
- optional R3F adapter;
- publisher/deploy adapters;
- future Wasm browser runtime only after workload-specific proof.

### `hyper-content`

- repository/business/evidence intake;
- ontology discovery and graph compilation;
- opportunity selection and page coordinates;
- lexical/embedding/IG/cannibalization checks;
- PCN, ArticleIR, provider dispatch, repair, and unfolding;
- batch checkpoints and content-workspace lifecycle;
- current Wasm/Zig vector and facility kernels;
- GPU/model/image-generation workflows.

### Split or shared abstractions

- current `manifest.ts`: split into site manifest and content program manifest;
- current `framework.ts`: remove vector packing from the static compiler and expose it as a content adapter;
- `validation-contracts.ts`: generic infrastructure, not a product surface;
- schema.org emission: small framework emitter fed by content-owned typed semantics.

## Migration gates

1. Root package facades expose separate public surfaces.
2. Boundary check rejects a `hyper-site` dependency on `hyper-content`.
3. Existing canonical compiler remains the only publication path during migration.
4. Move static compiler/UI code into `hyper-site` only after vector packing and mixed manifest fields are extracted.
5. Move content modules into `hyper-content` in dependency order.
6. Delete `reference/` only after both package suites and a shared end-to-end fixture pass.
7. Benchmark `hyper-site` alone against Hugo/Astro/Eleventy on the same pages, assets, machine, cache state, and output requirements.

## Immediate product language

`hyper-site` is a TypeScript static web framework under extraction.

`hyper-content` is an ontology- and evidence-driven content compiler that targets `hyper-site`.

The repository is a monorepo during near-alpha. Neither package is production-ready.