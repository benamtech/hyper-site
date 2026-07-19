# Hyper Monorepo Durable Memory

status: active  
updated_at: 2026-07-19T09:50:00-04:00

## State

branch: agent/glm-blackwell-vertical-slice  
pr: 3  
draft: true  
merged: false  
maturity: H0-H4 bounded MVP PASS; production outbox/reconciliation contract PASS; external provider and infrastructure gates remain

## Active boundary

```text
Hyper Content -> accepted semantic/runtime state -> Hyper Site
reference -> Hyper Site compatibility surface
Hyper Site -X-> Hyper Content
Hyper Site -X-> reference runtime
provider proposal -X-> semantic acceptance authority
unknown provider outcome -X-> automatic retry
```

## Measured truth

Validated production-runtime source commit: `d38b5c6b9ea8991edcf40d094dbdabad138fe489`

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

## Physical truth

- `hyper-site/src` owns deterministic site and living-surface compilation.
- `hyper-content/src/semantic-generation.ts` owns bounded proposals and independent semantic acceptance.
- `hyper-content/src/action-runtime.ts` owns approval-bound action and receipt projection.
- `hyper-content/src/durable-pilot.ts` owns the single-host durable/shadow pilot.
- `hyper-content/src/production-runtime.ts` owns the PostgreSQL/outbox/reconciliation contract.
- `@amtech/hyper-content` is `0.4.0-alpha.0`.

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

## Implemented production controls

- PostgreSQL migration SQL;
- serializable transaction wrapper;
- bounded retry for SQLSTATE `40001` and `40P01`;
- `FOR UPDATE SKIP LOCKED` claims;
- outbox/receipt atomic success transaction;
- immutable content-addressed receipts;
- operator-visible dead letters;
- issuer/audience/expiry/authentication-age identity policy;
- fail-closed secret source;
- deterministic canonical payload/idempotency hashing;
- exact optional database-row normalization.

## Active hypothesis state

```text
H0 PASS
H1 PASS
H2 bounded semantic-generation MVP PASS
H3 living-surface MVP PASS
H4 durable authorized outbox/reconciliation contract PASS
H5 SDRT/GNN comparisons pending
H6 GPU/Zig/Wasm comparisons pending
```

Active program:

- `docs/planning/50-h0-h1-content-first-reinvention-program.md`;
- `docs/planning/51-durable-provider-connector-pilot.md`.

## Measured authorities

- `validation/reports/2026-07-19-production-outbox-reconciliation.md`;
- `memory/2026-07-19-0948-production-outbox-reconciliation.md`.

## External promotion gates

The code contracts are present, but production deployment remains blocked until externally measured:

- real PostgreSQL concurrency and process-kill tests;
- managed secret service;
- cryptographic OIDC/JWKS verification;
- live GLM structured-output contract;
- provider sandbox idempotency and status reconciliation;
- kill-after-ACK recovery.

These remain fail-closed. PR #3 remains draft and unmerged.
