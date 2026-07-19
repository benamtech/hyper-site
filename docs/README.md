# Hyper Monorepo Documentation System

Status: active documentation authority  
Updated: 2026-07-19

## Purpose

Documentation separates product taxonomy, verified source behavior, accepted architecture, executable plans, measured reports and durable handoffs. Source, tests, emitted artifacts, CI and external integration evidence remain proof.

## Canonical product taxonomy

```text
Hyper Content
  evidence-grounded content generation and validation
        |
        | SiteSource + optional task/surface proposals
        v
Hyper Site
  deterministic website framework and compiler
        |
        | optional governed task mounts
        v
Hyper Runtime
  identity, approvals, durable execution, connectors and receipts

AI Employee
  a composed product using all three
```

Canonical boundary document:

- `docs/architecture/52-product-taxonomy-and-runtime-boundaries.md`

The repository, Hyper Site and Hyper Content must not be described as interchangeable with “AI Employee.”

## Current authority chain

```text
README.md
-> identity.md
-> CODEGRAPH.md
-> docs/architecture/52-product-taxonomy-and-runtime-boundaries.md
-> current task-specific planning document
-> measured validation report
-> immutable memory handoff
```

Current production-runtime authorities:

- `docs/planning/51-durable-provider-connector-pilot.md`;
- `validation/reports/2026-07-19-production-outbox-reconciliation.md`;
- `memory/2026-07-19-0948-production-outbox-reconciliation.md`.

Historical research and architecture documents remain evidence of prior decisions but do not override current source or the canonical taxonomy.

## Root allowlist

Bootstrap documents at repository root:

- `README.md`
- `AGENTS.md`
- `CODEGRAPH.md`
- `CONTRIBUTING.md`
- `identity.md`

## Directory model

```text
docs/
  README.md
  catalog.json
  intake/
  research/
    sources/
    experiments/
  architecture/
  planning/
  validation/
  archive/

planning/
  machine-readable plans and tests
validation/reports/
  measured reports tied to exact commits
memory/
  current index and immutable handoffs
```

## Lifecycle

```text
intake
-> primary and official source verification
-> direct controls and falsification
-> architecture disposition
-> executable plan
-> RED/GREEN/REFACTOR implementation
-> measured validation report
-> immutable handoff
-> catalog, MEMORY, bootstrap and PR reconciliation
```

## Current product truth

### Hyper Site

- Package-owned deterministic compiler and living-surface renderer exist.
- The package is consumed through isolated runtime and strict TypeScript tarball tests.
- It renders static website artifacts and public/operator projections.
- It has no credential or connector authority.

### Hyper Content

- Bounded semantic generation and independent evidence validation exist.
- Accepted checkpoints are resumable and invalid proposals reject atomically.
- Providers propose; they do not validate or approve themselves.

### Hyper Runtime

- Logical runtime contracts exist for authorization, durable outbox processing, reconciliation, dead letters and immutable receipts.
- Runtime source is currently located in `hyper-content/src` as a transitional package placement.
- A future `@amtech/hyper-runtime` extraction is packaging cleanup, not a change to product semantics.

### AI Employee

- “AI Employee” describes a deployment composed from Hyper Content, Hyper Site and Hyper Runtime.
- The repository does not yet prove a deployed live AI Employee service.

## Source-of-truth rules

A document is stale when it:

- describes Hyper Site as an AI Employee runtime rather than a website framework/presentation layer;
- describes Hyper Content as the owner of connectors or effect execution;
- treats the current physical runtime location as the desired package taxonomy;
- calls an adapter contract a deployed external service;
- treats unsigned claims as authenticated identity;
- treats an unknown provider outcome as retryable;
- claims production completion without external PostgreSQL, managed secrets, OIDC/JWKS, provider sandbox and crash evidence;
- presents old extraction status as current package truth.

## Authority by stage

| Stage | May contain | Must not claim |
|---|---|---|
| intake | supplied ideas and unresolved claims | verified architecture |
| research | sources, controls, alternatives and falsification | implementation completion |
| architecture | accepted ownership and product boundaries | measured production behavior |
| planning | dependencies, tests, rollback and stop conditions | completed outcomes |
| validation contract | fixtures, metrics and thresholds | a passing result |
| validation report | exact commit, commands, artifacts and outcomes | unrun checks |
| memory handoff | durable state and next gate | replacement of source or CI authority |

## Agent read order

1. `identity.md`
2. `AGENTS.md`
3. `README.md`
4. `CODEGRAPH.md`
5. `docs/README.md`
6. `docs/architecture/52-product-taxonomy-and-runtime-boundaries.md`
7. `docs/catalog.json`
8. `memory/MEMORY.md`
9. newest immutable handoff
10. newest measured report
11. current task-specific authority chain

## Write protocol

Before writing:

- identify the subsystem and logical owner;
- verify the current physical owner in source;
- distinguish package location from product identity;
- distinguish evidence, inference, proposal and decision;
- identify side effects and external dependencies;
- define falsification, rollback and nonclaims.

After writing:

- reconcile `README.md`, `identity.md`, `CODEGRAPH.md` and package READMEs when product truth changed;
- update `docs/catalog.json` or record an explicit blocker;
- run `node scripts/check-doc-system.mjs`;
- run applicable package and validation tests;
- create reports only for checks actually run;
- append an immutable handoff for a coherent completed pass;
- reconcile `memory/MEMORY.md` and the draft PR.

## Permanent documentation checks

The documentation gate should verify:

- root Markdown allowlist;
- catalog uniqueness and path existence;
- canonical product taxonomy path;
- current package ownership and transitional runtime placement;
- no “Hyper Site equals AI Employee” claim;
- no provider self-approval claim;
- ambiguous-outcome non-retry invariant;
- external deployment nonclaims;
- measured report and handoff naming;
- current PR posture.
