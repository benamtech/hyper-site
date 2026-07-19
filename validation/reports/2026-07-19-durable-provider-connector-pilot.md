# Durable Provider and Connector Pilot — Measured Report

Status: PASS for local/shadow pilot  
Date: 2026-07-19  
Validated source commit: `c05d617eec268bef6443c363bc4c3d7ada9249b3`

## Exact-head workflows

- Organize Repository Documents — run `29679933896` — PASS
- Hyper Site H0-H1 Integration Pipeline — run `29679933895` — PASS
- Hyper Site Reference Compatibility — run `29679933910` — PASS

## Implemented

- Node 20-compatible durable JSON transaction store with lock, stale-lock recovery, fsync and atomic rename;
- monotonic revision and audit ledger;
- durable semantic checkpoints;
- durable immutable action receipts;
- durable effect leases;
- GLM-compatible strict structured-output adapter with HTTPS, bearer auth, timeout and normalized usage;
- approved Smile A Mile Painting shadow-pilot corpus;
- tenant, actor, role, scope, approval-tenant, separate-approver and expiry authorization;
- shadow connector with no external delivery;
- bounded timeout, exponential retry and process-restart receipt replay;
- deterministic post-effect living-surface projection.

## Validation vector

Dimensions:

```text
[D,A,I,E,T,R,P,G,B,X,S,M,O]
```

Measured local vector:

```text
[2,2,2,2,2,2,2,1,2,2,2,2,2]
```

`G=1` because the GLM adapter is contract-tested against an injected compatible envelope but has not been run against a live secret-backed GLM endpoint.

## Pass evidence

- owned package compilation passed;
- Hyper Content durable-pilot tests passed inside canonical proof;
- eight concurrent transactions produced eight retained revisions and events;
- transient connector failure recovered on bounded retry;
- reconstructed store replayed the same receipt without invoking a reconstructed connector;
- receipt and shadow-effect records survived process object replacement;
- tenant mismatch, self-approval, missing scope and expired approval were denied;
- GLM request used HTTPS, bearer authorization, temperature zero and strict JSON-schema response format;
- public/package/legacy compatibility remained green.

## Fail vectors retained

This pilot must not be promoted to production external effects if any of these remain true:

```text
[production database serializable proof = 0]
[live GLM contract proof = 0]
[managed secret custody = 0]
[real identity provider binding = 0]
[connector provider-side idempotency proof = 0]
[ambiguous acknowledgement reconciliation = 0]
[process-kill between provider ACK and receipt commit = 0]
[dead-letter/operator recovery = 0]
```

## Decision

Advance to a production-representative pilot using a PostgreSQL transaction adapter, managed secret source, live GLM structured-output contract test and one provider sandbox/shadow account. Continue to prohibit irreversible production effects until ambiguous-outcome reconciliation and provider-side idempotency are measured.
