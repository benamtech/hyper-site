# CODEGRAPH.md — Hyper subsystem and effect graph

Status: active source-backed architecture map  
Updated: 2026-07-19

## Canonical taxonomy

```text
Hyper Content
  content proposal + evidence validation
        |
        | SiteSource + optional task/surface proposals
        v
Hyper Site
  deterministic website compiler + presentation framework
        |
        | optional governed runtime mount
        v
Hyper Runtime
  identity + approvals + durable execution + receipts

AI Employee
  composed product using all three
```

Authority:

- `docs/architecture/52-product-taxonomy-and-runtime-boundaries.md`

## Current package direction

```text
@amtech/hyper-content -> @amtech/hyper-site
reference -> @amtech/hyper-site compatibility surface
@amtech/hyper-site -X-> @amtech/hyper-content
@amtech/hyper-site -X-> reference runtime
```

Runtime code is currently exported from `@amtech/hyper-content` as a transitional physical location. Its logical owner is Hyper Runtime.

## Current physical source graph

```text
hyper-site/index.mjs
  -> hyper-site/dist/index.js

hyper-site/src/index.ts
  -> framework-core.ts
  -> site-manifest.ts
  -> browser-targets.ts
  -> css-modern.ts
  -> living-surface.ts

hyper-content/index.mjs
  -> hyper-site/index.mjs
  -> hyper-content/dist/content-program-adapter.js
  -> hyper-content/dist/semantic-generation.js
  -> hyper-content/dist/action-runtime.js
  -> hyper-content/dist/durable-pilot.js
  -> hyper-content/dist/production-runtime.js
  -> reference/dist/* compatibility exports

reference/src/framework-core.ts
reference/src/site-manifest.ts
reference/src/browser-targets.ts
reference/src/css-modern.ts
  -> hyper-site/dist/* compatibility wrappers
```

## Hyper Site graph

```text
SiteSource
-> validateSiteSource
-> normalize evidence, claims, modules and pages
-> PageIR
-> deterministic HTML
-> metadata + JSON-LD
-> sitemap + instruction projection
-> dependency index
-> page hashes + build hash
```

Living surface presentation:

```text
LivingSurfaceState
-> validateLivingSurface
-> projectLivingSurface(public | operator)
-> permission filtering before rendering
-> agency/governance decision derivation
-> deterministic node ordering
-> accessible static HTML
-> state hash + HTML hash + build hash
```

Hyper Site side effects:

```text
library compiler calls: none outside returned artifacts
repository scripts: write validation/demo artifacts to validation/reports
```

Hyper Site does not perform connector calls or own credentials.

## Hyper Content graph

```text
ApprovedSemanticCorpus
-> SemanticProposalProvider.propose
-> ProviderProposal
-> independent validateSemanticProposal
   -> evidence identity/content checks
   -> exact claim/fact checks
   -> compileSite validation
   -> compileLivingSurface public/operator validation
-> bounded repair attempts
-> accepted SemanticGenerationCheckpoint
-> CompiledSite + CompiledLivingSurface
```

Generation authority wall:

```text
provider proposes
provider -X-> validates itself
provider -X-> approves itself
provider -X-> publishes or performs external effects
```

## Hyper Runtime graph

Current physical files:

```text
hyper-content/src/action-runtime.ts
hyper-content/src/durable-pilot.ts
hyper-content/src/production-runtime.ts
```

Logical effect flow:

```text
verified identity claims
-> AuthorizedPrincipal
-> tenant/role/scope/approval policy
-> buildOutboxRecord
-> PostgresProductionStore.enqueue
-> pending outbox row
-> processNextOutbox
   -> SERIALIZABLE claim
   -> FOR UPDATE SKIP LOCKED
   -> connector.dispatch
      ├─ succeeded
      │   -> immutable receipt
      │   -> receipt + succeeded state transaction
      ├─ not-sent + retryable
      │   -> bounded delayed retry
      ├─ rejected/exhausted
      │   -> dead-letter row
      └─ unknown/timeout
          -> ambiguous row
          -> no automatic dispatch retry
          -> reconcileNextAmbiguous
             ├─ succeeded -> receipt
             ├─ pending -> remain ambiguous
             ├─ not-found -> bounded retry
             └─ failed -> dead letter
```

## Data graph

PostgreSQL production contract:

```text
hyper_outbox
  idempotency_key UNIQUE
  status pending|dispatching|ambiguous|succeeded|dead-letter
  lease owner/expiry
  attempt budget

hyper_receipts
  outbox_id UNIQUE
  idempotency_key UNIQUE
  immutable receipt JSON + receipt hash

hyper_dead_letters
  outbox_id UNIQUE
  operator state open|retry-approved|resolved
```

Single-host pilot contract:

```text
DurableJsonTransactionStore
-> JSON state file
-> exclusive lock file
-> fsync temporary file
-> atomic rename
-> checkpoints, receipts, leases, shadow effects, audit events
```

## Secret and identity graph

```text
SecretSource
-> EnvironmentSecretSource [current fail-closed adapter]
-> future managed secret adapter

trusted OIDC/JWKS verifier [external deployment adapter]
-> VerifiedIdentityClaims
-> verifyIdentityClaims
-> AuthorizedPrincipal
```

`verifyIdentityClaims` validates claim policy after cryptographic verification. It is not itself a JWT signature verifier.

## AI Employee product composition

```text
approved business facts
-> Hyper Content
-> evidence-grounded website and task proposal
-> Hyper Site
-> customer website + operator surface
-> Hyper Runtime
-> approved external action
-> immutable receipt
-> Hyper Site post-effect projection
```

The product label does not create a new compiler, content authority or effect authority.

## Main effects

### Semantic generation

```text
trigger: runSemanticGeneration / runDurableSemanticGeneration
reads: approved corpus, provider configuration, accepted checkpoint
network: provider adapter may call configured HTTPS endpoint
writes: durable checkpoint store when configured
spawns: none
```

### Static compilation

```text
trigger: compileSite / compileLivingSurface
reads: in-memory typed input
network: none
DB: none
writes: none inside library call
```

### Production action processing

```text
trigger: worker calls processNextOutbox
DB: claim/update/receipt/dead-letter transactions
network: connector dispatch or reconciliation
secrets: supplied by connector through SecretSource
writes: PostgreSQL state and provider effect
```

## Hard boundaries

```text
one deterministic site compiler authority
permission filtering before rendering
model proposal separated from validation
approval separated from request actor
unknown outcome separated from retryable failure
receipt committed with succeeded state
Hyper Site independent of provider/database/runtime
```

## Package migration target

```text
hyper-content/
  semantic generation and content validation only

hyper-site/
  compiler, framework and presentation only

hyper-runtime/                  future physical extraction
  identity
  policy
  approvals
  outbox
  connectors
  reconciliation
  receipts
```

The extraction is a packaging cleanup. It must preserve the current public contracts and exact behavior before changing imports.

## Measured proof chain

```text
H0/H1 package proof
-> living-surface proof
-> semantic-generation/action proof
-> durable shadow pilot proof
-> production outbox/reconciliation contract proof
```

Measured reports are under `validation/reports/`. External PostgreSQL, OIDC, managed-secret, live-provider and provider-sandbox tests remain deployment gates rather than repository claims.
