# Product taxonomy documentation reconciliation

Status: measured documentation/source reconciliation  
Date: 2026-07-19

## Scope

This pass reconciled the repository’s top-level product identity against current source, package exports, tests and effect boundaries.

The issue was not implementation ambiguity. The source already contained distinguishable compiler, semantic-generation and governed-execution subsystems. The ambiguity was documentation that used “AI Employee,” “Hyper Site,” “Hyper Content,” “living surface,” and “runtime” at inconsistent architectural levels.

## Canonical resolution

```text
Hyper Content
  evidence-grounded content generation and semantic validation

Hyper Site
  deterministic website framework, compiler and presentation

Hyper Runtime
  identity, approvals, durable execution, connectors and receipts

AI Employee
  product assembled from the three subsystems
```

Canonical authority:

- `docs/architecture/52-product-taxonomy-and-runtime-boundaries.md`

## Verified source primitives

### FILE-001: hyper-site/src/framework-core.ts

Tag: [VERIFIED]  
Primitive: TRANSFORM  
Actual behavior: validates and compiles structured site input into deterministic static artifacts.  
Effects: no network, database or connector effects in library execution.  
Logical owner: Hyper Site.

### FILE-002: hyper-site/src/living-surface.ts

Tag: [VERIFIED]  
Primitive: TRANSFORM  
Actual behavior: validates typed surface state, applies public/operator projection, derives presentation decisions and renders deterministic static HTML.  
Effects: no identity verification or connector execution.  
Logical owner: Hyper Site presentation.

### FILE-003: hyper-content/src/semantic-generation.ts

Tag: [VERIFIED]  
Primitive: TRANSFORM/VERIFY  
Actual behavior: requests or accepts semantic proposals, independently validates them against approved corpus facts, applies bounded attempts and compiles accepted outputs through Hyper Site.  
Effects: provider network calls only through injected provider; checkpoint persistence through injected store.  
Logical owner: Hyper Content.

### FILE-004: hyper-content/src/action-runtime.ts

Tag: [VERIFIED]  
Primitive: VERIFY/EXEC contract  
Actual behavior: binds approved actions to idempotent effect requests and immutable receipts.  
Logical owner: Hyper Runtime.  
Physical owner: Hyper Content package during migration.

### FILE-005: hyper-content/src/durable-pilot.ts

Tag: [VERIFIED]  
Primitive: WRITE/ORCHESTRATE  
Actual behavior: single-host durable JSON transactions, GLM-compatible adapter, authorization checks, shadow connector and receipt storage.  
Effects: file writes, environment-independent injected provider requests, shadow-effect recording.  
Logical owner split: generation adapter belongs to Hyper Content; action durability/connector behavior belongs to Hyper Runtime.

### FILE-006: hyper-content/src/production-runtime.ts

Tag: [VERIFIED]  
Primitive: DB/NETWORK/ORCHESTRATE  
Actual behavior: PostgreSQL outbox, serializable transactions, worker claims, connector dispatch, ambiguous-outcome reconciliation, dead letters, identity-policy validation and secret-source contract.  
Effects: PostgreSQL queries, connector network calls, environment secret reads through adapter.  
Logical owner: Hyper Runtime.  
Physical owner: Hyper Content package during migration.

## Documentation defects found

### DEF-001: Stale references and state claims

Found in:

- `CODEGRAPH.md` described `hyper-site/index.mjs` as delegating to `reference/dist`, although package-owned compiler extraction had passed.
- `docs/README.md` and `identity.md` described Hyper Content as blocked and package extraction as incomplete.
- `AGENTS.md` described only U1 as unblocked while H2-H4 implementations and measured reports existed.

Disposition: corrected in active bootstrap documents.

### DEF-002: Implicit subsystem dependency

Runtime implementation was exported from `@amtech/hyper-content`, causing package location to imply that content generation owned identity, approvals and connector effects.

Disposition:

- logical Hyper Runtime boundary documented;
- transitional physical placement documented explicitly;
- future `@amtech/hyper-runtime` extraction recorded as packaging cleanup rather than new product semantics.

### DEF-003: Undocumented effects

Top-level documentation did not consistently distinguish:

- pure compilation;
- provider network calls;
- checkpoint writes;
- PostgreSQL transactions;
- connector dispatch;
- secret reads;
- reconciliation and dead-letter transitions.

Disposition: effect graph added to `CODEGRAPH.md`; package READMEs now describe effect ownership.

### DEF-004: Orphaned architecture concept

“AI Employee” existed as a recurring product phrase without a stable relationship to packages or source directories.

Disposition: defined as a composed product, not a package or compiler.

## Interaction surfaces

### INTERACTION-001: README × source

Type: SEQUENTIAL  
Emergent finding: the README’s single end-to-end path made optional runtime execution look like the primary identity of the framework and content pipeline.  
Defects exposed: DEF-001, DEF-003, DEF-004.  
Value: Authority 5 × Connectivity 5 × Effect Coverage 4 × Defect Exposure 5 = 19/20.

### INTERACTION-002: package manifests × source exports

Type: PARALLEL  
Emergent finding: `production-runtime` is exported from Hyper Content despite having a different logical owner.  
Defects exposed: DEF-002.  
Value: Authority 5 × Connectivity 5 × Effect Coverage 5 × Defect Exposure 5 = 20/20.

### INTERACTION-003: Hyper Site source × Hyper Runtime source

Type: TRANSFORM  
Emergent finding: Hyper Site renders runtime state but does not authorize or execute it. Presentation and enforcement are separate authorities.  
Defects exposed: DEF-003.  
Value: Authority 5 × Connectivity 5 × Effect Coverage 5 × Defect Exposure 4 = 19/20.

### INTERACTION-004: semantic generation × action runtime

Type: GATE  
Emergent finding: accepted content/task proposals are inputs to runtime policy; generation acceptance does not authorize effects.  
Defects exposed: DEF-002, DEF-003.  
Value: Authority 5 × Connectivity 4 × Effect Coverage 5 × Defect Exposure 5 = 19/20.

## Relationship map

```text
ApprovedSemanticCorpus
  -> semantic-generation.ts
  -> SiteSource + LivingSurfaceState
  -> @amtech/hyper-site
  -> website/public/operator artifacts

approved runtime action
  -> action-runtime.ts
  -> production-runtime.ts
  -> PostgreSQL outbox
  -> connector
  -> immutable receipt
  -> living-surface post-effect projection
```

Hubs:

- `hyper-site/src/index.ts` — public compiler/presentation export hub;
- `hyper-content/index.mjs` — semantic plus transitional runtime export hub;
- `hyper-content/src/production-runtime.ts` — production effect-state hub.

Transitional boundary:

- runtime files have a physical inbound edge from Hyper Content’s package facade but a logical ownership edge to Hyper Runtime.

## Effect graph

### EFFECT-001: website compilation

Trigger: `compileSite`  
Chain: validate input -> normalize -> PageIR -> static artifacts -> hashes.  
External calls: none.  
Writes: returned in memory; repository demo scripts may write reports.  
Owner: Hyper Site.

### EFFECT-002: semantic generation

Trigger: `runSemanticGeneration`  
Chain: provider proposal -> independent validation -> bounded repair/reject -> accepted checkpoint -> Hyper Site compilation.  
External calls: optional provider HTTPS call.  
Writes: optional checkpoint store.  
Owner: Hyper Content.

### EFFECT-003: production action

Trigger: `processNextOutbox`  
Chain: PostgreSQL claim -> connector dispatch -> success/retry/ambiguous/dead-letter -> reconciliation -> receipt.  
External calls: PostgreSQL and connector/provider.  
Writes: outbox, receipt and dead-letter state; external effect when enabled.  
Owner: Hyper Runtime.

## Files changed

- `README.md`;
- `identity.md`;
- `AGENTS.md`;
- `CODEGRAPH.md`;
- `docs/README.md`;
- `docs/architecture/52-product-taxonomy-and-runtime-boundaries.md`;
- `hyper-site/README.md`;
- `hyper-content/README.md`;
- `memory/MEMORY.md`;
- PR #3 description.

## Completion statement

The active bootstrap and package documentation now use one taxonomy:

```text
framework = Hyper Site
content pipeline = Hyper Content
governed execution = Hyper Runtime
composed product = AI Employee
```

Historical documents may retain earlier terminology as historical records. They must not be treated as current product authority when they conflict with the canonical taxonomy or source.
