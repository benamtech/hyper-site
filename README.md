# Hyper Monorepo

Status: research prototype approaching near-alpha. The repository now has two explicit product surfaces. Neither is production-ready.  
Updated: 2026-07-18

## Products

```text
hyper-content
  ontology + evidence + content compiler
            |
            v
hyper-site
  static web framework + UI + publisher target
```

Dependency direction is one-way:

```text
hyper-content -> hyper-site
hyper-site -X-> hyper-content
```

### `hyper-site/`

`@amtech/hyper-site` is the web-framework package under extraction.

It owns:

- deterministic `SiteSource -> PageIR -> static HTML` compilation;
- components, layouts, typography, design tokens, and shared CSS;
- browser targets, accessibility, and web-performance budgets;
- development, build, and publisher/deployment ergonomics;
- optional browser interaction adapters.

It does not expose ontology discovery, BM25, embeddings, LLM providers, PCN, ArticleIR, corpus planning, GPU orchestration, or the current vector/facility Wasm kernels.

### `hyper-content/`

`@amtech/hyper-content` is the ontology- and evidence-driven content compiler.

It owns:

- repository/business/source/evidence intake;
- ontology discovery, typed graphs, opportunity selection, and page coordinates;
- lexical, embedding, information-gain, duplicate, and corpus validation;
- LLM provider dispatch, bounded repair, and checkpoints;
- deterministic PCN emission;
- ArticleIR parsing and rejection;
- deterministic unfolding to Markdown, JSON-LD, links, sitemap state, and framework inputs;
- current Wasm/Zig vector kernels and GPU/model workflows.

Its backend path is:

```text
approved compiler state
-> PCN
-> LLM prose backend
-> validated ArticleIR
-> deterministic unfolder
-> @amtech/hyper-site
-> static web artifacts
```

### `reference/`

`reference/` remains the canonical legacy implementation while physical source migration proceeds. The root folders are real public package boundaries, not a claim that every implementation file has already moved.

The migration preserves one publication authority. `hyper-content` targets `hyper-site`; it must not create a second renderer or deployment pipeline.

## Why the split exists

The repository had conflated three different measures:

1. **browser/runtime impact**: TTFB, LCP, CLS, INP, transferred bytes, and JavaScript cost;
2. **build-path impact**: work performed while compiling a site;
3. **product-surface impact**: concepts a developer must understand to use the framework.

Ontology graphs, BM25, HRR, embeddings, model orchestration, and information-gain validation may be valuable to the content product. They do not become web-framework value merely because the old package invoked them during a build.

The current static compiler still performs legacy vector packing internally. That coupling must be removed before `hyper-site` can be benchmarked honestly against Hugo, Astro, Eleventy, or another ordinary framework.

The full repo and external-source analysis, hypotheses, falsification rules, corrected classifications, and migration plan are recorded in:

- `29-product-boundary-research-and-root-folder-split.md`.

## Corrections to the initial criticism

The product-separation diagnosis was materially correct, but four claims did not survive source inspection:

- current `wasm.ts` accelerates vector/facility math; it is not a browser-interactivity runtime;
- `validation-contracts.ts` is generic typed acceptance infrastructure, not merely checkpoint hashing;
- several content modules currently affect build time because the dependency graph is mixed, not because they belong in the framework;
- exact claims such as “Hugo builds 10K pages in one second” or “Astro builds 10K pages in three seconds” are not accepted without one frozen comparable fixture.

## Workspace commands

The root is an npm workspace:

```bash
npm run build
npm test
npm run check:boundaries
```

During migration, these commands build and test the canonical implementation under `reference/`, then test both package facades and dependency direction.

Direct package surfaces:

```js
import { compileSite } from "@amtech/hyper-site";

import {
  compileApprovedOntology,
  emitPageContractFromCompilerState,
  parseArticleIR,
  unfoldArticleIR,
} from "@amtech/hyper-content";
```

## Maturity boundary

- Both products remain research prototypes approaching near-alpha.
- Names containing `production` identify production-boundary experiments, not readiness.
- Model output is proposal state.
- Synthetic scale proves bounded software behavior only.
- Content-pipeline timing is not web-framework timing.
- No usefulness claim is valid until non-synthetic cases and held-out judgments pass.
- No framework-performance claim is valid until `hyper-site` alone is compared against ordinary frameworks on the same fixture, machine, cache state, assets, and output requirements.

## Current canonical path

```text
repository + explicit project truth
-> hyper-content evidence and ontology compiler
-> approved opportunity/page contracts
-> deterministic PCN
-> LLM backend
-> validated ArticleIR
-> deterministic unfolder
-> hyper-site SiteSource/PageIR/static renderer
-> noindex review artifacts
-> corpus, browser, accessibility, and operator validation
-> explicit publication decision
```

## Current proof

The prior synthetic 10,000-page fixture exercised the combined content/compiler/validation path and emitted complete static HTML. It is useful evidence for bounded content-pipeline execution, recovery, and deterministic output.

It is not evidence that:

- `hyper-site` is faster than Hugo, Astro, or Eleventy;
- 10,000 pages deserve to exist;
- pages index, rank, convert, or generate revenue;
- the GPU, HRR, embeddings, Wasm, or graph methods beat simpler alternatives;
- the framework has acceptable onboarding, HMR, components, themes, plugins, or deployment UX.

## Required framework benchmark

The first serious framework comparison must isolate `hyper-site` and freeze:

```text
same visible pages
same routes
same assets
same content bytes
same structured data
same machine and runtime
same cold/warm cache policy
same minification and image policy
same output requirements
```

Measure:

- scaffold and setup effort;
- dev-server startup and update latency;
- cold and incremental build time;
- peak memory;
- HTML, CSS, JavaScript, asset, and total bytes;
- accessibility and browser results;
- deploy command and rollback effort;
- component/theme customization effort.

Content research, model latency, embedding time, and corpus validation must be reported separately as `hyper-content` metrics.

## Required content-product validation

`hyper-content` must prove:

- evidence fidelity and citation correctness;
- distinct page tasks and information objects;
- measured information gain against explicit controls;
- duplicate/cannibalization rejection quality;
- provider cost, latency, repair, and failure rates;
- indexing and search outcomes on approved real cohorts;
- lifecycle cost for evidence refresh, page repair, and retirement;
- value over simpler RAG/prompting and human/agency baselines.

## Near-alpha gates

```text
1. Complete the physical package extraction without a reverse dependency.
2. Build one real five-page site using hyper-site alone.
3. Add a practical dev/build/deploy surface and a static publisher adapter.
4. Compare the same site with at least one ordinary framework.
5. Run a real hyper-content provider pass into the same hyper-site target.
6. Extend to 25 noindex content pages with page-existence justifications.
7. Freeze held-out relevance, design, accessibility, and operator judgments.
8. Scale content cohorts only after small real cases pass.
9. Benchmark current Wasm only against its actual vector/facility workload.
10. Promote browser Wasm only after a separate measured interaction workload exists.
```

## Current authorities

| Area | Source |
|---|---|
| product-boundary research and migration | `29-product-boundary-research-and-root-folder-split.md` |
| web-framework public surface | `hyper-site/` |
| content-compiler public surface | `hyper-content/` |
| dependency enforcement | `scripts/check-product-boundaries.mjs` |
| canonical legacy implementation | `reference/src/` |
| PCN backend contract | `reference/src/pcn-emitter.ts` |
| ArticleIR acceptance | `reference/src/articleir-parser.ts` |
| deterministic unfolding | `reference/src/unfolder.ts` |
| static compiler | `reference/src/framework.ts` |
| maturity and real-use gates | `27-near-alpha-framework-validation-and-continuous-agent-workspace.md`, `reference/src/near-alpha-framework.ts` |

PR #3 remains draft while the physical extraction, real framework fixture, live provider, publisher, and comparable benchmarks are pending.
