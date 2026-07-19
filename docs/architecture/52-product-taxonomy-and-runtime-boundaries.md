# Product taxonomy and runtime boundaries

Status: active architecture authority  
Updated: 2026-07-19

## Canonical product model

The repository contains three technical subsystems and one composed product concept.

```text
Hyper Content
  evidence-grounded content proposal and validation
        |
        | portable SiteSource and optional task declarations
        v
Hyper Site
  deterministic website compiler and presentation framework
        |
        | optional governed runtime mounts
        v
Hyper Runtime
  identity, approvals, durable execution, connectors and receipts

AI Employee
  a product assembled from Hyper Content + Hyper Site + Hyper Runtime
```

The terms are not interchangeable.

## Hyper Site

Hyper Site is the website framework and deterministic compiler.

It owns:

- `SiteSource`, `PageIR`, artifact and diagnostic contracts;
- deterministic validation, normalization and compilation;
- HTML, CSS, metadata, JSON-LD, sitemap and instruction projections;
- browser capability contracts;
- deterministic public/operator surface rendering;
- static fallback output;
- state, page and build hashes.

Hyper Site does not own:

- provider/model dispatch;
- durable workflow orchestration;
- authentication or authorization;
- credentials;
- connector execution;
- retries, reconciliation or dead letters;
- external side effects.

A normal Hyper Site build requires no model provider, database or agent runtime.

## Hyper Content

Hyper Content is the evidence-grounded content-generation pipeline.

It owns:

- approved corpus and evidence intake;
- semantic proposals from deterministic or model-backed providers;
- independent evidence and claim validation;
- bounded repair and rejection;
- accepted generation checkpoints;
- production of portable `SiteSource`;
- optional task and surface-state proposals that remain subject to runtime policy.

Hyper Content does not own:

- HTML rendering authority;
- publication authority;
- human approval authority;
- credentials;
- connector execution;
- immutable effect receipts.

A provider proposes content. It cannot validate, approve, publish or execute its own proposal.

## Hyper Runtime

Hyper Runtime is the governed execution subsystem.

It owns:

- verified identity and tenant context;
- roles, scopes and policy decisions;
- approval freshness and separation of duties;
- durable transactional outbox state;
- connector dispatch and provider reconciliation;
- bounded retries only for definitely-not-sent effects;
- ambiguous-outcome quarantine;
- dead-letter and operator recovery state;
- immutable effect receipts;
- deterministic post-effect state projection.

It does not own:

- site compilation;
- content truth;
- visual rendering authority;
- autonomous publication without policy.

## Current physical placement

The logical Hyper Runtime boundary exists, but its implementation is currently located inside `hyper-content/src` and exported through:

```text
@amtech/hyper-content/action-runtime
@amtech/hyper-content/durable-pilot
@amtech/hyper-content/production-runtime
```

This is a migration state, not the final package taxonomy.

The current physical graph is:

```text
hyper-content/src/semantic-generation.ts       Hyper Content
hyper-content/src/action-runtime.ts            Hyper Runtime implementation, transitional location
hyper-content/src/durable-pilot.ts             Hyper Runtime implementation, transitional location
hyper-content/src/production-runtime.ts        Hyper Runtime implementation, transitional location
hyper-site/src/living-surface.ts               Hyper Site presentation contract
```

The next package-boundary cleanup may extract runtime code into `@amtech/hyper-runtime` without changing the semantic, rendering or execution contracts.

## AI Employee

“AI Employee” is a product configuration, not a package, compiler or synonym for the repository.

An AI Employee product may use:

```text
Hyper Content
-> generates evidence-grounded business content and task proposals

Hyper Site
-> presents the website, public task surfaces and operator views

Hyper Runtime
-> executes approved tasks through durable connectors and records receipts
```

A site that uses only Hyper Site is still a valid website.  
A pipeline that uses Hyper Content and Hyper Site is a generated website system.  
Only a deployment that also mounts Hyper Runtime task execution is an AI Employee product.

## Canonical data and effect flow

```text
approved business corpus
-> Hyper Content proposal
-> independent evidence validation
-> accepted SiteSource
-> Hyper Site compilation
-> website artifacts

optional task path:
accepted task/surface proposal
-> Hyper Site public/operator projection
-> Hyper Runtime identity and approval policy
-> durable outbox
-> connector
-> immutable receipt
-> Hyper Site deterministic post-effect projection
```

## Authority walls

```text
Hyper Content -X-> HTML renderer authority
Hyper Content -X-> self-approval
Hyper Site -X-> credentials or external effects
Hyper Runtime -X-> content truth or site compiler authority
AI Employee label -X-> proof of a deployed runtime
unknown provider outcome -X-> automatic retry
```

## Naming rules

Use:

- **Hyper Site** for website framework/compiler behavior;
- **Hyper Content** for corpus, generation and semantic validation behavior;
- **Hyper Runtime** for identity, approvals, durable jobs, connectors and receipts;
- **AI Employee** only for a product assembled from the three layers.

Do not use:

- “Hyper Site AI employee runtime” for compiler behavior;
- “Hyper Content runtime” for connector execution;
- “the website is the AI employee” as an architecture statement;
- “AI Employee complete” when only framework or adapter tests pass.

## Validation matrix

| Capability | Hyper Content | Hyper Site | Hyper Runtime | AI Employee product |
|---|---:|---:|---:|---:|
| approved corpus intake | owns | consumes | no | uses |
| model proposal | owns | no | no | may use |
| evidence validation | owns | validates structural contract | no | uses |
| deterministic HTML | no | owns | no | uses |
| public/operator rendering | proposes state | owns | supplies runtime state | uses |
| identity and tenant policy | no | no | owns | uses |
| approval enforcement | proposes requirement | renders state | owns decision | uses |
| connector execution | no | no | owns | uses |
| immutable effect receipt | no | renders | owns | uses |
| standalone operation | content pipeline | website framework | execution service | composed deployment |

## Product statements

Accurate:

> Hyper is a deterministic website framework and evidence-grounded content pipeline with an optional governed execution runtime. An AI Employee is a product built from those layers.

Inaccurate:

> Hyper Site is an AI employee.

> The content pipeline performs business actions.

> Passing connector contract tests means an AI Employee is deployed.
