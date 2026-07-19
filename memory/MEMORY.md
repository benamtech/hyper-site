# Hyper Monorepo Durable Memory

status: active  
updated_at: 2026-07-19T10:15:00-04:00

## State

branch: agent/glm-blackwell-vertical-slice  
pr: 3  
draft: true  
merged: false  
maturity: framework, content-pipeline and governed-runtime contracts implemented; external deployment gates remain

## Canonical product taxonomy

```text
Hyper Content
  evidence-grounded content generation and semantic validation
        |
        | SiteSource + optional task/surface proposals
        v
Hyper Site
  deterministic website framework, compiler and presentation
        |
        | optional governed task mounts
        v
Hyper Runtime
  identity, approvals, durable jobs, connectors and receipts

AI Employee
  product composed from all three
```

Authority:

- `docs/architecture/52-product-taxonomy-and-runtime-boundaries.md`.

Do not describe Hyper Site, Hyper Content or the repository alone as an AI Employee.

## Package and physical truth

- `hyper-site/src` owns deterministic site and living-surface compilation.
- `hyper-content/src/semantic-generation.ts` owns bounded proposals and independent semantic acceptance.
- `hyper-content/src/action-runtime.ts` implements Hyper Runtime action/receipt behavior in a transitional package location.
- `hyper-content/src/durable-pilot.ts` contains Hyper Content provider adaptation plus Hyper Runtime durability/shadow behavior.
- `hyper-content/src/production-runtime.ts` implements Hyper Runtime PostgreSQL/outbox/reconciliation behavior in a transitional package location.
- `@amtech/hyper-site` is `0.3.0-alpha.0`.
- `@amtech/hyper-content` is `0.4.0-alpha.0`.
- A future `@amtech/hyper-runtime` extraction is packaging cleanup, not a new product layer.

## Authority walls

```text
hyper-content -> hyper-site
hyper-site -X-> hyper-content
Hyper Content -X-> renderer/publication authority
Hyper Site -X-> credentials or connector effects
Hyper Runtime -X-> content truth or compiler authority
provider proposal -X-> semantic acceptance authority
unknown provider outcome -X-> automatic retry
```

## Measured production-runtime truth

Validated implementation source commit: `d38b5c6b9ea8991edcf40d094dbdabad138fe489`

```text
documentation 29682124539 PASS
integration   29682124534 PASS
compatibility 29682124533 PASS
```

Proof artifact:

```text
h0-h1-proof-29682124534
sha256:80f0f0f98940367cfc4d4f85391935f2ebf5208c6e7bbfcd7a87d4e98b439391
```

## Production state machine

```text
pending
-> dispatching
   -> succeeded
   -> pending only when definitely not sent
   -> dead-letter when rejected or exhausted
   -> ambiguous when outcome is unknown

ambiguous
-> reconciliation
   -> succeeded when provider confirms success
   -> ambiguous while provider reports pending
   -> pending only when provider confirms absence
   -> dead-letter when reconciliation fails
```

## Product composition

```text
approved business corpus
-> Hyper Content proposal and evidence validation
-> Hyper Site website and operator/customer presentation
-> Hyper Runtime approved execution
-> immutable receipt
-> Hyper Site deterministic post-effect projection
```

A site using only Hyper Site is a website.  
Hyper Content plus Hyper Site is a generated website pipeline.  
A deployment using all three may be an AI Employee product.

## Active hypothesis state

```text
H0 package integration PASS
H1 physical compiler extraction PASS
H2 bounded semantic-generation MVP PASS
H3 living-surface presentation MVP PASS
H4 governed durable outbox/reconciliation contract PASS
H5 SDRT/GNN comparisons pending
H6 GPU/Zig/Wasm comparisons pending
```

These H labels describe research/implementation gates, not product names.

Active H0-H6 program record:

- `docs/planning/50-h0-h1-content-first-reinvention-program.md`.

## Active authorities

- `README.md`;
- `identity.md`;
- `AGENTS.md`;
- `CODEGRAPH.md`;
- `docs/README.md`;
- `docs/architecture/52-product-taxonomy-and-runtime-boundaries.md`;
- `docs/planning/50-h0-h1-content-first-reinvention-program.md`;
- `validation/reports/2026-07-19-product-taxonomy-documentation-reconciliation.md`;
- `memory/2026-07-19-1015-product-taxonomy-reconciliation.md`.

## External deployment gates

Repository contracts are present, but a deployed AI Employee remains blocked until externally measured:

- real PostgreSQL concurrency and process-kill tests;
- managed secret service;
- cryptographic OIDC/JWKS verification;
- live GLM structured-output contract;
- provider sandbox idempotency and status reconciliation;
- kill-after-provider-acknowledgement recovery;
- hosted worker and customer/operator deployment.

These remain fail-closed. PR #3 remains draft and unmerged.
