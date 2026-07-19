# Durable Provider and Connector Pilot

Status: active executable plan  
Updated: 2026-07-19  
Scope: H2-H4 production-boundary challenger after measured bounded MVP

## Authority and research disposition

This plan preserves the repository's current authority chain and physical package direction. It does not create a second semantic compiler, renderer or effect authority.

Repository controls:

- `docs/research/43-useful-framework-and-agent-first-pipeline-audit.md` requires direct controls, falsification and ordinary product usefulness.
- `docs/architecture/44-useful-framework-and-agent-first-target-architecture.md` keeps Hyper Content as an optional producer and Hyper Site as the deterministic consumer.
- `docs/research/47-zig-wasm-binary-boundary-audit.md` requires measured promotion and retained fallbacks rather than low-level language claims.
- `docs/planning/50-h0-h1-content-first-reinvention-program.md` preserves autonomous generation, self-aware GenUI and bounded external action as the end-state while forbidding a second semantic authority.
- `validation/reports/2026-07-19-semantic-action-loop-mvp.md` proves only fixture-backed proposal, validation, approval, idempotency and receipt behavior.

External primary/official controls:

1. NIST SP 800-207, Zero Trust Architecture: authentication and authorization are discrete functions before resource access; no implicit trust is granted by network location. https://doi.org/10.6028/NIST.SP.800-207
2. NIST SP 1800-35, Implementing a Zero Trust Architecture: policy engine, policy administrator and policy enforcement point are separate logical responsibilities. https://doi.org/10.6028/NIST.SP.1800-35
3. PostgreSQL documentation, transaction isolation: serializable execution is the strongest isolation level and requires retry handling for serialization failures. https://www.postgresql.org/docs/current/transaction-iso.html
4. RFC 8785, JSON Canonicalization Scheme: cryptographic hashes require deterministic serialization. https://www.rfc-editor.org/rfc/rfc8785
5. RFC 9110, HTTP semantics: unsafe methods are not inherently idempotent; application-level idempotency keys and durable receipts are required for replay-safe effects. https://www.rfc-editor.org/rfc/rfc9110
6. AWS Builders' Library, retries and backoff: retries require timeouts, bounded attempts, backoff and idempotent operations. https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/

GLM adapter limitation: official GLM deployments have varied between native and OpenAI-compatible request envelopes. The adapter therefore targets an injected HTTPS chat-completions endpoint with configurable model, strict JSON-schema response request, timeout and response-envelope normalization. A live provider claim requires a recorded endpoint/version contract and a secret-backed integration test; the deterministic mock is not provider-quality evidence.

## System decomposition

```text
approved tenant corpus
-> GLM-compatible proposal adapter
-> independent semantic validator
-> durable checkpoint transaction
-> deterministic SiteSource + LivingSurfaceState compilation
-> tenant/actor/role/scope/approval policy decision
-> lease-protected shadow connector
-> bounded timeout/retry envelope
-> durable immutable receipt transaction
-> deterministic post-effect operator projection
```

Logical zero-trust mapping:

```text
policy information points: tenant, actor, roles, scopes, approval epoch, corpus evidence
policy engine: authorizeAction
policy administrator: executeAuthorizedDurableAction
policy enforcement point: ShadowConnectorExecutor / future connector adapter
resource: external email, CRM, browser or publication capability
```

## High-dimensional validation model

For every chunk define:

```text
V = [D, A, I, E, T, R, P, G, B, X, S, M, O]
```

- D durability across process restart
- A atomicity of accepted state/effect receipt
- I isolation under concurrent writers
- E evidence integrity
- T tenant isolation
- R role/scope authorization
- P approval freshness and separation of duties
- G provider schema/conformance
- B bounded timeout/retry/backoff
- X effect idempotency
- S deterministic post-effect surface
- M immutable audit/receipt material
- O observability and exact proof

Each dimension is scored 0-2:

- 0 absent or contradicted
- 1 implemented but only fixture/local proof
- 2 production-representative measured proof

### Chunk vectors

| Chunk | Validation vector target | Pass vector | Fail vector |
|---|---|---|---|
| Durable JSON transaction store | `[2,2,2,0,1,0,0,0,1,2,0,2,2]` | restart preserves checkpoints/receipts; eight concurrent writers produce eight revisions; atomic rename leaves parseable state | lost update, corrupt JSON, stale lock cannot recover, conflicting receipt overwrites |
| GLM structured-output adapter | `[0,0,0,2,0,0,0,2,2,0,0,0,2]` | HTTPS only, bearer auth, strict schema request, deterministic temperature, timeout, normalized usage and request ID | accepts missing content, HTTP errors become proposals, unbounded request, non-JSON accepted |
| Approved real-business corpus | `[1,1,0,2,2,0,1,0,0,0,0,1,2]` | every fact binds to approved owner-supplied evidence and is shadow-only | unsupported superlative, missing evidence, production authorization inferred from content approval |
| Tenant/actor authorization | `[0,0,0,1,2,2,2,0,0,0,0,1,2]` | tenant, role, scope, approval tenant, approval actor separation and expiry all pass | cross-tenant action, self-approval, expired approval, missing role/scope allowed |
| Shadow connector | `[2,2,1,0,2,2,2,0,2,2,1,2,2]` | no real external effect, durable shadow record, one logical effect under replay | real send occurs, duplicate shadow effects differ, connector owns policy decision |
| Retry/restart envelope | `[2,1,1,0,1,1,1,0,2,2,1,1,2]` | transient first failure succeeds within bound; restart replays receipt without executor call | infinite retry, no timeout, process restart repeats effect, lease collision executes twice |
| Post-effect projection | `[1,2,0,1,2,1,2,0,0,2,2,2,2]` | action completed, pending approval decremented, receipt included, repeated compile hash equal | receipt absent, private data leaks, state hash drifts on replay |

## Implementation chunks

### C1 Durable transactional store

Implement a Node 20-compatible reference store using:

- exclusive lock file with stale-lock reclamation;
- read-clone-mutate-write transaction;
- fsync of temporary file;
- atomic rename promotion;
- monotonic revision;
- durable checkpoints, receipts, leases, shadow effects and audit events.

This is a production-boundary reference implementation, not a claim that a single JSON file is the final multi-node database. A PostgreSQL adapter remains the production scale path; it must preserve the same transaction interface and pass the same vectors under serializable conflict/retry tests.

### C2 Provider adapter

Implement a configurable GLM-compatible adapter with:

- HTTPS endpoint requirement;
- secret supplied by caller, never state or corpus;
- strict JSON-schema response request;
- temperature zero;
- abort timeout;
- HTTP status rejection;
- OpenAI-compatible choice/message and usage normalization;
- provider proposal returned to the existing independent validator.

### C3 Corpus

Add one manually approved Smile A Mile Painting corpus from owner-supplied facts. The corpus is authorized only for deterministic and shadow testing. Content approval does not imply action approval.

### C4 Authorization

Bind each action to:

- tenant;
- authenticated actor;
- role;
- scope;
- separate approval actor;
- approval tenant;
- approval epoch;
- approval expiry.

The policy decision is hashed and returned with the execution result.

### C5 Shadow connector

Implement a durable connector that records the effect envelope but performs no external delivery. It is the policy enforcement point for the pilot and cannot approve its own request.

### C6 Timeout, retry and restart proof

- synthetic transient connector failure on attempt one;
- exponential bounded backoff;
- per-attempt timeout;
- effect lease;
- durable receipt;
- reconstruct store and connector after execution;
- replay must return receipt without connector invocation.

### C7 Deterministic post-effect surface

Apply the immutable receipt to accepted living state and compile the operator projection. The same receipt applied to the same accepted state must yield the same projection build hash.

## Promotion decision

Pass this pilot only when all local vectors meet their target and exact-head CI is green. Promotion to a real connector additionally requires:

- production database adapter with serializable conflict proof;
- managed secret custody;
- live GLM endpoint contract test with redacted artifacts;
- tenant identity integration;
- sandbox provider account;
- connector-specific idempotency contract;
- process-kill test between external acknowledgement and local receipt commit;
- reconciliation worker for ambiguous outcomes;
- dead-letter and operator recovery flow.

Any ambiguous external outcome is a fail, not an automatic retry. The reconciliation path must query provider state or require human resolution before another effect attempt.
