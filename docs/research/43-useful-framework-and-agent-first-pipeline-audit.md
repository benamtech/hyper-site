# Useful Framework and Agent-First Pipeline Audit

Status: active research authority  
Updated: 2026-07-18

## Question

What must this repository become to qualify as both:

1. a useful web framework for ordinary developers; and
2. a reliable agent-first content and site delivery pipeline?

## Current finding

The repository contains a working deterministic compiler prototype, extensive experimental content machinery, task-surface contracts, and validation infrastructure. It does not yet contain a normal framework product or a durable agent runtime.

The only demonstrated end-user capability is:

```text
SiteSource
-> validation
-> PageIR
-> semantic HTML / metadata / JSON-LD
-> sitemap / instructions / dependency index
-> deterministic hashes
```

The public `hyper-site/index.mjs` boundary still delegates to `reference/dist/framework-core.js`. Most implementation authority remains under `reference/src`.

## Control: a real useful static framework

A practical framework such as Astro establishes a much lower adoption floor than the repository currently meets:

- clean installation and project creation;
- normal local development and preview;
- static output by default;
- typed or schema-validated content collections;
- components, layouts, assets and routing;
- deployment adapters;
- understandable errors and documentation;
- no requirement to understand an ontology, evidence graph, GPU pipeline or agent runtime.

Hyper Site therefore fails as a framework until an external developer can complete this path from a packed package or documented checkout:

```text
create
-> edit five real pages
-> dev
-> build
-> preview
-> inspect output
-> deploy locally or through one adapter
```

Deterministic hashes, evidence references and dependency metadata may differentiate Hyper Site later, but they do not replace the ordinary framework floor.

## Control: a real agent-first pipeline

An agent-first architecture is not an LLM call wrapped around a compiler and is not an uncontrolled loop. A credible pipeline separates four responsibilities:

```text
planner / proposer
-> durable orchestration
-> deterministic tools and idempotent activities
-> explicit approval and commit boundary
```

Established durable runtimes such as Temporal persist workflow history and replay deterministic workflow code while isolating side effects in retryable activities. LangGraph similarly treats persistence, checkpoints and human interrupts as runtime responsibilities. OpenTelemetry provides the vendor-neutral trace, metric and log model needed to correlate an agent run with tool calls and emitted artifacts.

The repository should integrate one of these categories rather than silently reimplementing durability, retries, checkpointing, human interruption and observability inside Hyper Site.

## Correct product graph

```text
approved project truth
        |
        v
Hyper Content (optional producer)
  evidence, claims, content proposals, page contracts
        |
        v
portable SiteSource
        |
        v
Hyper Site (deterministic framework)
  validate -> PageIR -> web artifacts
        |
        v
publisher adapter

External agent control plane
  plan, call tools, persist checkpoints, request approval,
  retry idempotent activities, trace work, commit or roll back
```

Hard boundaries:

- Hyper Site must compile without Hyper Content.
- Hyper Site must compile without an LLM or agent runtime.
- Hyper Content may call Hyper Site, never the reverse.
- Agent orchestration is outside both package cores.
- Publication and other durable effects require fresh approval and an idempotency key at commit time.
- Compiler output is immutable evidence for an exact input and commit, not authorization to publish.

## Dependency and incrementality finding

The reverse dependency index is potentially useful, but correct incremental maintenance requires complete dependency capture. Build-system research and Bazel documentation explicitly warn that undeclared dependencies make incremental rebuilds incorrect. W3 must therefore test both:

- over-invalidation: unexpected pages changed; and
- under-invalidation: required pages failed to change.

A dependency graph that only reports its declared edges is not proof that the declared model is complete.

## Agent safety and reliability finding

A useful agent pipeline requires:

- typed immutable run inputs;
- durable checkpoints outside the compiler;
- deterministic replay or explicit resumption semantics;
- side-effect isolation;
- idempotency keys for effects;
- bounded retries and dead-letter handling;
- approval interrupts before consequential actions;
- commit-time revalidation of branch, artifact, policy and approval state;
- trace correlation across model, tool, compiler and publisher operations;
- evaluation fixtures and held-out operator review;
- explicit cancellation, rollback and artifact retirement.

Prompt instructions and schema validation are not substitutes for authorization, idempotency or durable execution.

## What should be built versus integrated

Build in Hyper Site:

- `SiteSource` and `PageIR` contracts;
- deterministic compiler and renderer;
- route, metadata, sitemap and asset contracts;
- component/layout/theme interfaces;
- dependency declarations and artifact manifests;
- CLI surfaces required by the five-page fixture;
- one local publisher adapter;
- framework-specific diagnostics.

Build in Hyper Content only when proven:

- evidence and claim acceptance contracts;
- page-existence records;
- deterministic conversion to portable `SiteSource`;
- content maintenance proposals and validation.

Integrate rather than rebuild:

- durable workflow execution;
- agent checkpointing and human interruption;
- connectors and business effects;
- authorization policy;
- experiment statistics;
- telemetry collection and export;
- secret management;
- editorial CMS workflows.

## Depth-first state verdict

| Layer | Current state | Useful target | Verdict |
|---|---|---|---|
| Public package | facade delegates to `reference/dist` | package-owned source and packed consumers | blocked |
| Framework workflow | compiler callable by repository-aware developer | create/dev/build/preview/inspect/deploy | blocked |
| Site proof | randomized synthetic pages | five distinct accepted pages | blocked |
| Incrementality | dependency index emitted | complete affected-set proof | unproven |
| Content pipeline | substantial experimental machinery | optional portable producer | over-scoped |
| Agent runtime | contracts and concepts | durable external orchestrator | absent |
| Side effects | proposed task surfaces | idempotent approved activities | absent |
| Observability | tests and reports | correlated traces, metrics and artifacts | partial |
| Publication | static artifacts | local publisher plus approval boundary | absent |
| Product value | software behavior | lower maintenance risk or cost | unproven |

## Promotion rule

No new graph, vector, SDRT, Wasm, GPU, generative-UI or autonomous-agent capability may enter the critical path until the ordinary five-page framework control and deterministic pipeline pass.

The next valid sequence is:

```text
physical extraction
-> ordinary framework floor
-> five-page direct control
-> measured maintenance
-> external durable agent wrapper
-> one approved idempotent publish task
```

## Research basis

Primary and official sources are recorded in `docs/research/sources/2026-07-18-framework-agent-architecture.sources.json`.
