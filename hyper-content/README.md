# @amtech/hyper-content

Evidence-grounded content generation and semantic validation pipeline.

Status: `0.4.0-alpha.0`  
Updated: 2026-07-19

## Product identity

Hyper Content produces validated website content and optional task/surface proposals for Hyper Site.

It is not the website renderer and it is not the governed execution runtime.

```text
approved corpus
-> semantic proposal
-> independent evidence validation
-> bounded repair or atomic rejection
-> accepted SiteSource
-> Hyper Site
```

## Owns

Hyper Content owns:

- approved business facts, evidence and corpus intake;
- deterministic and model-backed semantic proposals;
- claim-to-evidence validation;
- bounded provider attempts and repair;
- accepted generation checkpoints;
- portable `SiteSource` production;
- optional task and `LivingSurfaceState` proposals.

A provider may propose content. It cannot validate, approve, publish or execute its own output.

## Does not own

Hyper Content does not own:

- HTML, CSS or `PageIR` rendering authority;
- customer/operator projection rendering;
- authenticated identity;
- tenant authorization;
- approval decisions;
- connector credentials;
- durable effect execution;
- retry and reconciliation policy;
- immutable effect receipt authority.

## Semantic-generation API

```ts
import {
  runSemanticGeneration,
  validateSemanticProposal,
} from "@amtech/hyper-content/semantic-generation";
```

The pipeline validates provider proposals against approved corpus records and compiles accepted proposals through the public Hyper Site contracts.

## Transitional runtime exports

The following exports currently live in this package for migration convenience:

```text
@amtech/hyper-content/action-runtime
@amtech/hyper-content/durable-pilot
@amtech/hyper-content/production-runtime
```

They implement the logical **Hyper Runtime** subsystem:

- tenant and actor policy;
- approvals;
- durable outbox state;
- connectors;
- ambiguous-outcome reconciliation;
- dead letters;
- immutable effect receipts.

Their current location does not make those responsibilities part of Hyper Content’s product identity. A future package-boundary cleanup may move them to `@amtech/hyper-runtime` while preserving their contracts.

Critical runtime invariant:

```text
unknown provider outcome -X-> automatic retry
unknown provider outcome -> ambiguous -> reconcile
```

## Dependency rule

```text
hyper-content -> hyper-site
hyper-site -X-> hyper-content
```

Hyper Content must not maintain a second renderer or publication authority.

## AI Employee composition

An AI Employee product may use:

```text
Hyper Content
-> evidence-grounded website and task proposals

Hyper Site
-> website and operator/customer presentation

Hyper Runtime
-> approved task execution and receipts
```

Hyper Content alone is a content pipeline, not an AI Employee.

## Validation

```bash
npm run build
npm test
```

Tests cover semantic rejection/repair, accepted checkpoint resume, authorization, durable shadow effects, PostgreSQL transaction contracts, ambiguous-outcome reconciliation, dead letters and immutable receipts.

## External gates

Live deployment still requires configured external PostgreSQL, managed secrets, cryptographic identity verification, a live model endpoint and a provider sandbox. Repository adapter tests do not claim those services are deployed.

Canonical taxonomy:

- `docs/architecture/52-product-taxonomy-and-runtime-boundaries.md`
