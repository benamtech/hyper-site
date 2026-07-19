# Hyper Monorepo

Status: framework, content-pipeline and governed-runtime contracts implemented; external deployment gates remain  
Updated: 2026-07-19  
PR: #3 remains draft and unmerged

## What this repository is

Hyper is not one monolithic “AI employee.” It contains three technical subsystems:

```text
Hyper Content
  evidence-grounded content generation and semantic validation
        |
        | SiteSource and optional task declarations
        v
Hyper Site
  deterministic website framework and compiler
        |
        | optional governed task mounts
        v
Hyper Runtime
  identity, approvals, durable jobs, connectors and receipts
```

**AI Employee** is a product assembled from all three layers. It is not the name of the compiler or content pipeline.

Canonical taxonomy:

- `docs/architecture/52-product-taxonomy-and-runtime-boundaries.md`

## Hyper Site

`@amtech/hyper-site` is the deterministic website framework.

It validates structured `SiteSource` input and emits:

- static HTML and CSS;
- metadata and JSON-LD;
- sitemap and instruction projections;
- dependency metadata;
- deterministic page and build hashes;
- public/operator surface projections and static fallbacks.

Hyper Site does not own providers, credentials, authorization, connectors or external effects.

```ts
import { compileSite, compileLivingSurface } from "@amtech/hyper-site";
```

## Hyper Content

`@amtech/hyper-content` is the evidence-grounded generation pipeline.

It:

- consumes approved business facts and evidence;
- accepts deterministic or model-backed proposals;
- independently validates claims against the approved corpus;
- applies bounded repair and atomic rejection;
- persists accepted generation checkpoints;
- produces portable `SiteSource` and optional task/surface proposals.

A provider can propose content. It cannot approve, publish or execute its own output.

```ts
import { runSemanticGeneration } from "@amtech/hyper-content/semantic-generation";
```

## Hyper Runtime

Hyper Runtime is the logical governed-execution subsystem.

It owns:

- tenant and actor identity context;
- role, scope and approval policy;
- transactional outbox state;
- connector dispatch;
- ambiguous-outcome reconciliation;
- bounded retry for definitely-not-sent effects;
- dead-letter recovery state;
- immutable effect receipts;
- deterministic post-effect state.

Its code is currently located in `hyper-content/src` as a transitional packaging decision and exported through:

```ts
import {
  DurableJsonTransactionStore,
  GlmStructuredOutputProvider,
  ShadowConnectorExecutor,
} from "@amtech/hyper-content/durable-pilot";

import {
  PostgresProductionStore,
  EnvironmentSecretSource,
  verifyIdentityClaims,
  buildOutboxRecord,
  processNextOutbox,
  reconcileNextAmbiguous,
} from "@amtech/hyper-content/production-runtime";
```

That physical location does not make connector execution part of Hyper Content’s product identity. A later package cleanup may extract it to `@amtech/hyper-runtime`.

## Composed AI Employee product

An AI Employee deployment uses the layers together:

```text
approved business corpus
-> Hyper Content generates and validates content/task proposals
-> Hyper Site compiles the website and operator/customer surfaces
-> Hyper Runtime executes explicitly approved tasks
-> connector result becomes an immutable receipt
-> Hyper Site renders deterministic post-effect state
```

A site using only Hyper Site is a website.  
A system using Hyper Content plus Hyper Site is a generated website pipeline.  
A deployment using all three layers may be sold as an AI Employee.

## Production effect state machine

```text
verified principal
-> approved tenant-scoped action
-> PostgreSQL SERIALIZABLE outbox transaction
-> SKIP LOCKED worker claim
-> connector dispatch
   ├─ succeeded -> receipt + succeeded state
   ├─ definitely not sent -> bounded retry
   ├─ rejected/exhausted -> dead letter
   └─ unknown -> ambiguous quarantine
-> provider reconciliation
   ├─ succeeded -> immutable receipt
   ├─ pending -> remain ambiguous
   ├─ confirmed absent -> bounded retry
   └─ failed -> operator dead letter
```

Central invariant:

```text
unknown provider outcome -X-> automatic retry
unknown provider outcome -> ambiguous -> reconcile
```

## Package versions

```text
@amtech/hyper-site     0.3.0-alpha.0
@amtech/hyper-content  0.4.0-alpha.0
```

## Research and implementation gates

The H labels are research/implementation gates, not product names:

```text
H0 integration proof: PASS
H1 physical compiler extraction: PASS
H2 bounded semantic generation: MVP PASS
H3 living-surface presentation: MVP PASS
H4 governed durable execution contract: PASS
H5 SDRT/GNN comparisons: pending
H6 GPU/Zig/Wasm comparisons: pending
```

Active H0-H6 program record:

- `docs/planning/50-h0-h1-content-first-reinvention-program.md`

## Measured proof

Validated production-runtime implementation commit:

```text
d38b5c6b9ea8991edcf40d094dbdabad138fe489
```

Measured workflows:

```text
Organize Repository Documents          PASS  29682124539
Hyper Site H0-H1 Integration Pipeline  PASS  29682124534
Hyper Site Reference Compatibility     PASS  29682124533
```

Measured reports:

- `validation/reports/2026-07-19-h0-h1-extraction-proof.md`;
- `validation/reports/2026-07-19-living-surface-mvp.md`;
- `validation/reports/2026-07-19-semantic-action-loop-mvp.md`;
- `validation/reports/2026-07-19-durable-provider-connector-pilot.md`;
- `validation/reports/2026-07-19-production-outbox-reconciliation.md`;
- `validation/reports/2026-07-19-product-taxonomy-documentation-reconciliation.md`.

## Run the repository proof

```bash
git clone --single-branch --branch agent/glm-blackwell-vertical-slice https://github.com/benamtech/hyper-site.git
cd hyper-site
npm --prefix hyper-site install
npm --prefix hyper-content install
npm --prefix reference install
npm run proof:h0-h1
```

Package tests:

```bash
npm --prefix hyper-content test
npm --prefix hyper-site test
```

## External deployment gates

The repository contains fail-closed adapter contracts, not a deployed AI Employee service. Production operation still requires:

- a real PostgreSQL instance and process-kill testing;
- managed secret custody;
- cryptographically verified OIDC/JWKS integration;
- a live GLM endpoint and controlled credential;
- a real provider sandbox with idempotency or status reconciliation;
- kill-after-provider-acknowledgement recovery proof;
- a hosted worker and customer/operator deployment.

No irreversible connector should be enabled until those environment-specific tests pass.

## Nonclaims

The repository does not yet claim a deployed AI Employee, live autonomous publication, live browser execution, production credential custody, psychographic inference quality, PDE/CSG/WebGPU advantage, SDRT/GNN advantage or GPU/Zig/Wasm advantage.
