# @amtech/hyper-site

Package-owned deterministic static compiler and living AI-employee surface runtime.

Status: `0.3.0-alpha.0` MVP  
Node.js: 20+

## Install

```bash
npm install @amtech/hyper-site
```

## Site compiler

```ts
import { compileSite, type SiteSource } from "@amtech/hyper-site";

const result = compileSite(source satisfies SiteSource);
```

The compiler validates evidence-backed semantic input and emits deterministic HTML, metadata, JSON-LD, sitemap, instruction projections, dependency metadata and hashes.

## Living surface MVP

```ts
import {
  compileLivingSurface,
  type LivingSurfaceState,
} from "@amtech/hyper-site";

const build = compileLivingSurface(state satisfies LivingSurfaceState, "public");
console.log(build.html);
```

The living-surface runtime provides:

- public/operator permission projections before rendering;
- typed information objects, actions, approvals, receipts and runtime health;
- nine continuous-interface field channels;
- agency mode and blend-radius resolution;
- risk-based approval gating;
- deterministic node priority and explanation reasons;
- accessible static HTML fallback;
- state, HTML and build hashes.

Explicit subpath:

```ts
import { compileLivingSurface } from "@amtech/hyper-site/living-surface";
```

## Ownership

Hyper Site owns:

- `SiteSource -> PageIR -> static artifacts` compilation;
- deterministic static rendering and metadata;
- browser/CSS capability contracts;
- living-surface semantic projection and static fallback.

Hyper Site does not own:

- ontology discovery or provider dispatch;
- model self-approval;
- credentials, durable workflows or external effects;
- remote browser execution;
- psychographic profiling;
- PDE/CSG/WebGPU, SDRT/GNN, GPU, Zig or Wasm promotion decisions.

Those remain Hyper Content, runtime-adapter or measured challenger concerns.

## Validate

```bash
npm run build
npm test
npm run pack:check
```

The tarball is tested from isolated JavaScript and strict TypeScript consumers and contains no `reference/` runtime files.

Repository-level demo:

```bash
npm run mvp:living-surface
```
