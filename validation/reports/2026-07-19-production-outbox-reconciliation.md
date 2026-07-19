# Production outbox and reconciliation proof

Status: PASS for repository-controlled production contracts  
Date: 2026-07-19  
Source commit: `d38b5c6b9ea8991edcf40d094dbdabad138fe489`

## Exact workflows

- documentation: `29682124539` — PASS;
- integration: `29682124534` — PASS;
- reference compatibility: `29682124533` — PASS;
- proof artifact: `h0-h1-proof-29682124534`;
- artifact digest: `sha256:80f0f0f98940367cfc4d4f85391935f2ebf5208c6e7bbfcd7a87d4e98b439391`.

## Implemented production contract

```text
verified identity claims
-> tenant/actor principal
-> approved action request
-> transactional outbox enqueue
-> SERIALIZABLE claim with SKIP LOCKED
-> connector dispatch
   ├─ succeeded -> immutable receipt transaction
   ├─ definitely not sent -> bounded retry
   ├─ rejected/exhausted -> dead letter
   └─ unknown -> ambiguous quarantine
-> provider reconciliation
   ├─ succeeded -> immutable receipt transaction
   ├─ pending -> remain ambiguous
   ├─ confirmed absent -> bounded retry
   └─ failed/exhausted -> dead letter
```

## New API

```text
@amtech/hyper-content/production-runtime
```

Implemented in:

- `hyper-content/src/production-runtime.ts`;
- `hyper-content/test/production-runtime.test.mjs`.

## TDD assertions

- unknown dispatch outcome is never selected by the normal dispatch worker again;
- reconciliation pending does not cause dispatch replay;
- provider-confirmed absence is the only ambiguous state that returns to pending;
- rejected effects enter an operator-visible dead letter;
- exhausted definitely-not-sent effects enter a dead letter;
- successful effects create content-addressed frozen receipts;
- PostgreSQL adapter begins `SERIALIZABLE` transactions;
- SQLSTATE `40001` and `40P01` retry within a strict bound;
- worker claims use `FOR UPDATE SKIP LOCKED`;
- receipt and outbox completion commit in one serializable transaction;
- identity claims enforce issuer, audience, expiry, issue time and authentication freshness;
- secret source fails closed on missing or blank values;
- package and legacy compatibility remain green.

## Validation vector

Dimensions:

```text
[P,S,O,R,D,I,A,C,M]
```

Where:

- P: PostgreSQL transaction contract;
- S: secret boundary;
- O: OIDC claim policy;
- R: retry boundedness;
- D: dispatch ambiguity classification;
- I: idempotency and receipt integrity;
- A: ambiguous reconciliation;
- C: compatibility;
- M: measured evidence.

Measured repository vector:

```text
[2,1,1,2,2,2,2,2,2]
```

`S` and `O` remain level 1 because the repository validates secret/claim policy contracts but does not contain a managed-secret service or cryptographic identity-provider integration. Those require deployment credentials and provider metadata.

## Pass vector

```text
unknown dispatch -> ambiguous
ambiguous -> no blind retry
provider confirms absent -> bounded retry
provider confirms success -> durable receipt
retry exhausted -> dead letter
serialization conflict -> bounded transaction replay
receipt conflict -> reject
identity mismatch/staleness -> reject
missing secret -> reject
all exact-head workflows -> pass
```

## Fail vector

Production release remains blocked if any of these are true:

```text
raw JWT accepted without signature verification
secret embedded in source or report
timeout automatically classified as not-sent
ambiguous effect returned to pending without provider confirmation
receipt and succeeded outbox state committed separately
serialization failure not retried or retried without a bound
cross-tenant action admitted
operator cannot inspect a dead letter
live provider lacks idempotency or status lookup
```

## External promotion gates

The following cannot be truthfully completed without configured external systems:

1. run the PostgreSQL migration and concurrency suite against a real PostgreSQL 17+ instance;
2. connect a managed secret source;
3. cryptographically verify live OIDC tokens against provider JWKS and discovery metadata;
4. run a live GLM structured-output contract test with a controlled credential;
5. run a provider sandbox connector with idempotency and status reconciliation;
6. inject process termination after provider acknowledgement and before local receipt commit;
7. verify reconciliation or operator dead-letter recovery for that crash window.

The repository implementation is complete for these adapter boundaries and fail-closed state transitions. It does not claim that absent external systems were tested.
