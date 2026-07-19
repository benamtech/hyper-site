# @amtech/hyper-content

Status: `0.4.0-alpha.0` production-boundary alpha  
Updated: 2026-07-19

`@amtech/hyper-content` owns bounded semantic generation, durable action orchestration and production outbox contracts targeting `@amtech/hyper-site`.

## Dependency rule

```text
hyper-content -> hyper-site
```

Hyper Content must not maintain a second renderer or publication authority.

## Semantic generation

```ts
import { runSemanticGeneration } from "@amtech/hyper-content/semantic-generation";
```

The provider proposes structured semantic state. Independent validation decides acceptance.

## Durable single-host pilot

```ts
import {
  DurableJsonTransactionStore,
  GlmStructuredOutputProvider,
  ShadowConnectorExecutor,
} from "@amtech/hyper-content/durable-pilot";
```

This path provides deterministic local durability and a no-effect shadow connector.

## Production runtime contract

```ts
import {
  PostgresProductionStore,
  EnvironmentSecretSource,
  verifyIdentityClaims,
  buildOutboxRecord,
  processNextOutbox,
  reconcileNextAmbiguous,
} from "@amtech/hyper-content/production-runtime";
```

The production runtime provides:

- PostgreSQL schema and serializable transaction adapter;
- bounded retry for serialization/deadlock SQLSTATEs;
- `FOR UPDATE SKIP LOCKED` worker claims;
- transactional outbox and immutable receipt commit;
- explicit ambiguous-outcome quarantine;
- provider status reconciliation;
- bounded retry only for definitely-not-sent or provider-confirmed-absent effects;
- operator-visible dead letters;
- verified-claims policy checks;
- fail-closed secret-source contract;
- deterministic payload and idempotency hashing.

Critical invariant:

```text
unknown provider outcome -X-> automatic retry
unknown provider outcome -> ambiguous -> reconcile
```

## Owns

- approved evidence and business-source intake;
- bounded semantic proposals and independent acceptance;
- durable checkpoints and action orchestration;
- tenant/actor/approval policy inputs;
- transactional outbox and receipt contracts;
- reconciliation and dead-letter transitions;
- optional task-semantic proposals;
- experimental vector, graph, Wasm, Zig and GPU methods behind promotion gates.

## Does not own

- HTML rendering or PageIR authority;
- theme components or browser state;
- raw credential storage;
- raw JWT signature verification without a trusted identity adapter;
- autonomous production publication without approval;
- silent retries after an ambiguous provider outcome.

## Validation

```bash
npm run build
npm test
```

Repository-level exact proof:

```bash
npm run proof:h0-h1
```

Measured authority:

- `validation/reports/2026-07-19-production-outbox-reconciliation.md`;
- `memory/2026-07-19-0948-production-outbox-reconciliation.md`.

## External production gates

A deployment must still supply and test:

- a real PostgreSQL instance;
- a managed `SecretSource` implementation;
- cryptographically verified OIDC/JWKS claims;
- a live GLM credential and endpoint contract;
- a provider sandbox with idempotency or status reconciliation;
- kill-after-provider-acknowledgement recovery.

Until those pass, irreversible connectors remain disabled.
