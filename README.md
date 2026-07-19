# Hyper Monorepo

Status: H0-H4 bounded MVP PASS; production outbox/reconciliation contract PASS; live-provider environment gates remain  
Updated: 2026-07-19  
PR: #3 remains draft and unmerged

## Working product path

```text
approved source truth
-> Hyper Content bounded semantic generation
-> independent evidence validation
-> accepted SiteSource + LivingSurfaceState
-> Hyper Site deterministic compilation
-> public/operator living surfaces
-> tenant/actor authorization
-> transactional outbox
-> approved connector execution
-> immutable receipt
-> deterministic post-effect projection
```

## Production effect path

```text
verified principal
-> approved tenant-scoped action
-> PostgreSQL SERIALIZABLE outbox transaction
-> SKIP LOCKED worker claim
-> connector dispatch
   ├─ succeeded -> receipt + succeeded state in one transaction
   ├─ definitely not sent -> bounded retry
   ├─ rejected/exhausted -> dead letter
   └─ unknown -> ambiguous quarantine
-> provider reconciliation
   ├─ succeeded -> immutable receipt
   ├─ pending -> remain ambiguous
   ├─ confirmed absent -> bounded retry
   └─ failed -> operator dead letter
```

The central production invariant is:

```text
unknown provider outcome -X-> automatic retry
unknown provider outcome -> ambiguous -> reconcile
```

## Package APIs

```ts
import { compileSite, compileLivingSurface } from "@amtech/hyper-site";
import { runSemanticGeneration } from "@amtech/hyper-content/semantic-generation";
import { DurableJsonTransactionStore, GlmStructuredOutputProvider, ShadowConnectorExecutor } from "@amtech/hyper-content/durable-pilot";
import { PostgresProductionStore, EnvironmentSecretSource, verifyIdentityClaims, buildOutboxRecord, processNextOutbox, reconcileNextAmbiguous } from "@amtech/hyper-content/production-runtime";
```

## Current package versions

```text
@amtech/hyper-site     0.3.0-alpha.0
@amtech/hyper-content  0.4.0-alpha.0
```

## Measured exact-head proof

Validated production-runtime source commit:

```text
d38b5c6b9ea8991edcf40d094dbdabad138fe489
```

Workflows:

```text
Organize Repository Documents          PASS  29682124539
Hyper Site H0-H1 Integration Pipeline  PASS  29682124534
Hyper Site Reference Compatibility     PASS  29682124533
```

Proof artifact:

```text
h0-h1-proof-29682124534
sha256:80f0f0f98940367cfc4d4f85391935f2ebf5208c6e7bbfcd7a87d4e98b439391
```

Measured reports:

- `validation/reports/2026-07-19-h0-h1-extraction-proof.md`;
- `validation/reports/2026-07-19-living-surface-mvp.md`;
- `validation/reports/2026-07-19-semantic-action-loop-mvp.md`;
- `validation/reports/2026-07-19-durable-provider-connector-pilot.md`;
- `validation/reports/2026-07-19-production-outbox-reconciliation.md`.

## H0-H6 hypothesis state

```text
H0 integrated proof: PASS
H1 physical extraction: PASS
H2 bounded semantic generation: PASS for deterministic/provider-adapter MVP
H3 living GenUI: typed deterministic MVP PASS
H4 authorized durable action path: outbox/reconciliation contract PASS
H5 SDRT/GNN comparisons: pending
H6 GPU/Zig/Wasm comparisons: pending
```

Active program authority:

- `docs/README.md`;
- `docs/planning/50-h0-h1-content-first-reinvention-program.md`;
- `docs/planning/51-durable-provider-connector-pilot.md`.

## Run the complete repository proof

```bash
git clone --single-branch --branch agent/glm-blackwell-vertical-slice https://github.com/benamtech/hyper-site.git
cd hyper-site
npm --prefix hyper-site install
npm --prefix hyper-content install
npm --prefix reference install
npm run proof:h0-h1
```

Package-level tests:

```bash
npm --prefix hyper-content test
```

## External environment gates

The repository now contains fail-closed adapter contracts for the remaining production systems. The following cannot be honestly marked complete without configured external infrastructure:

- a real PostgreSQL instance and crash-injection harness;
- managed secret custody;
- cryptographically verified OIDC tokens and provider JWKS;
- a live GLM endpoint and controlled credential;
- a real provider sandbox supporting idempotency and status reconciliation;
- kill-after-provider-acknowledgement testing.

No production connector should be enabled until those tests pass. The current code does not auto-retry unknown outcomes, accept unsigned identity claims, or silently fall back to embedded secrets.

## Nonclaims

The project does not yet claim production deployment, live autonomous publication, live browser execution, provider credential custody, psychographic inference quality, PDE/CSG/WebGPU advantage, SDRT/GNN advantage, or GPU/Zig/Wasm advantage.
