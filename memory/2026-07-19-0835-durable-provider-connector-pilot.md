# Durable Provider and Connector Pilot Handoff

Date: 2026-07-19  
Branch: `agent/glm-blackwell-vertical-slice`  
Validated source commit: `c05d617eec268bef6443c363bc4c3d7ada9249b3`  
PR: #3 draft and unmerged

## Completed

```text
approved tenant corpus
-> GLM-compatible strict proposal adapter
-> independent semantic validation
-> durable checkpoint transaction
-> deterministic site and living surfaces
-> tenant/actor/role/scope/approval policy decision
-> lease-protected shadow connector
-> bounded timeout/retry
-> durable immutable receipt
-> deterministic post-effect operator surface
```

Package API:

- `@amtech/hyper-content/durable-pilot`
- `DurableJsonTransactionStore`
- `GlmStructuredOutputProvider`
- `authorizeAction`
- `ShadowConnectorExecutor`
- `executeAuthorizedDurableAction`
- `runDurableSemanticGeneration`
- `compileDeterministicPostEffectSurface`

Approved pilot corpus:

- `examples/corpora/smile-a-mile-painting.approved.json`

Research and validation authority:

- `docs/planning/51-durable-provider-connector-pilot.md`
- `validation/reports/2026-07-19-durable-provider-connector-pilot.md`

## Measured workflows

- documentation: `29679933896` PASS
- integration: `29679933895` PASS
- compatibility: `29679933910` PASS

Measured vector:

```text
[D,A,I,E,T,R,P,G,B,X,S,M,O]
[2,2,2,2,2,2,2,1,2,2,2,2,2]
```

GLM conformance remains level 1 because the adapter is mock-contract tested, not live-provider tested.

## Production boundary

The durable JSON store is a correct single-host reference and restart-proof implementation, not the final distributed database. Production promotion requires a PostgreSQL serializable adapter or equivalent transactional store passing the same interface and conflict vectors.

The connector is shadow-only. It records intended effects and durable receipts but performs no real external send.

## Next gate

```text
PostgreSQL serializable adapter
+ managed secret source
+ live GLM structured-output integration
+ real identity provider claims
+ provider sandbox connector
+ provider-side idempotency/reconciliation
+ kill-point and dead-letter proof
```

Irreversible external effects remain blocked until ambiguous outcomes can be reconciled without blind retry.
