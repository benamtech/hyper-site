# @amtech/hyper-site

Deterministic website framework, compiler and presentation package.

Status: `0.3.0-alpha.0` MVP  
Node.js: 20+

## Product identity

Hyper Site is not an AI Employee runtime.

It is the website framework used by ordinary static sites, generated sites and optional AI Employee products.

```text
SiteSource
-> validation and normalization
-> PageIR
-> deterministic website artifacts
```

Optional runtime state can be rendered through Hyper Site, but identity, approvals, durable jobs, connectors and receipts belong to Hyper Runtime.

## Install

```bash
npm install @amtech/hyper-site
```

## Site compiler

```ts
import { compileSite, type SiteSource } from "@amtech/hyper-site";

const result = compileSite(source satisfies SiteSource);
```

The compiler validates evidence-backed semantic input and emits deterministic:

- HTML and CSS;
- metadata and JSON-LD;
- sitemap and instruction projections;
- dependency metadata;
- page and build hashes.

## Living-surface presentation

```ts
import {
  compileLivingSurface,
  type LivingSurfaceState,
} from "@amtech/hyper-site";

const build = compileLivingSurface(
  state satisfies LivingSurfaceState,
  "public",
);
```

The living-surface renderer provides:

- public/operator permission projections before rendering;
- typed information, action, approval, receipt and runtime-health presentation;
- nine interface-field channels;
- agency and governance visualization;
- deterministic node priority and explanations;
- accessible static HTML fallback;
- state, HTML and build hashes.

It renders policy and runtime state supplied by another subsystem. It does not authenticate actors, approve actions or execute connectors.

Explicit subpath:

```ts
import { compileLivingSurface } from "@amtech/hyper-site/living-surface";
```

## Ownership

Hyper Site owns:

- `SiteSource -> PageIR -> static artifacts` compilation;
- deterministic static rendering and metadata;
- browser/CSS capability contracts;
- public/operator projection rendering;
- static fallback output.

Hyper Site does not own:

- corpus or evidence intake;
- model/provider dispatch;
- semantic self-approval;
- credentials or identity verification;
- durable workflow execution;
- connector effects;
- retry, reconciliation or dead-letter policy;
- immutable effect receipt authority.

## Relationship to other layers

```text
Hyper Content
-> produces validated SiteSource and optional surface proposals

Hyper Site
-> compiles and renders them

Hyper Runtime
-> performs approved effects and supplies resulting state
```

An AI Employee is a composed deployment using the layers together. Hyper Site remains independently useful without either of the other layers.

## Validate

```bash
npm run build
npm test
npm run pack:check
```

The tarball is tested from isolated JavaScript and strict TypeScript consumers and contains no `reference/` runtime files.

Repository-level presentation demo:

```bash
npm run mvp:living-surface
```
