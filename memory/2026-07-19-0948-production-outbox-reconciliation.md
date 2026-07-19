# Production outbox and reconciliation handoff

Date: 2026-07-19  
Branch: `agent/glm-blackwell-vertical-slice`  
Validated source commit: `d38b5c6b9ea8991edcf40d094dbdabad138fe489`

## Completed

`@amtech/hyper-content` is now version `0.4.0-alpha.0` and exports `@amtech/hyper-content/production-runtime`.

Implemented:

- PostgreSQL schema and adapter contract;
- serializable transaction retry for SQLSTATE `40001` and `40P01`;
- `FOR UPDATE SKIP LOCKED` worker claims;
- transactional outbox and receipt commit;
- explicit ambiguous effect status;
- provider reconciliation state machine;
- bounded retry only for definitely-not-sent or provider-confirmed-absent effects;
- operator-visible dead letters;
- immutable content-addressed receipts;
- verified-claims policy boundary;
- secret-source boundary;
- exact optional-property and canonical JSON safety.

## Measured proof

```text
documentation 29682124539 PASS
integration   29682124534 PASS
compatibility 29682124533 PASS
```

Artifact:

```text
h0-h1-proof-29682124534
sha256:80f0f0f98940367cfc4d4f85391935f2ebf5208c6e7bbfcd7a87d4e98b439391
```

Measured report:

- `validation/reports/2026-07-19-production-outbox-reconciliation.md`

## Critical invariant

```text
unknown provider outcome -X-> automatic retry
unknown provider outcome -> ambiguous -> reconcile
```

Only a provider-confirmed absent effect may return from ambiguous to pending.

## Remaining environment gates

- real PostgreSQL integration and crash injection;
- managed secret service;
- cryptographically verified OIDC/JWKS adapter;
- live GLM contract;
- provider sandbox with idempotency/status lookup;
- kill-after-ACK reconciliation proof.

These require external endpoints or credentials and remain fail-closed rather than mocked as production success.
