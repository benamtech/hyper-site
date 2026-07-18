# CODEGRAPH.md — Hyper Framework, Content and Agent Control Plane

Status: target architecture accepted; physical extraction incomplete  
Updated: 2026-07-18

## Product and runtime graph

```text
approved project truth
        |
        v
@amtech/hyper-content (optional)
  evidence, claims, page contracts, content proposals
        |
        v
portable SiteSource
        |
        v
@amtech/hyper-site
  validate -> PageIR -> static web artifacts
        |
        v
publisher adapter

external agent control plane
  plans and invokes public tools from both packages
  persists checkpoints, approvals, policy and telemetry
```

Hard rules:

```text
hyper-content -> hyper-site
hyper-site -X-> hyper-content
agent-control-plane -> public commands, contracts and artifacts
package cores -X-> runtime internals
browser surfaces -X-> durable effects
compiler output -X-> publication authority
```

## Current physical graph

```text
hyper-site/index.mjs
  -> reference/dist/framework-core.js
  -> reference/dist/site-manifest.js
  -> other transitional reference outputs

hyper-content/src/content-program-adapter.ts
  first physically extracted stable content adapter

reference/src/framework-core.ts
reference/src/site-manifest.ts
reference/src/*
  remaining mixed implementation authority
```

`reference/` is still runtime authority for most behavior. Its target role is consumer, compatibility suite, fixtures, examples and benchmarks.

## Target repository graph

```text
hyper-site/
  src/
    contracts/
      site-source
      page-ir
      artifacts
      dependencies
    compiler/
      validate
      normalize
      compile
    renderer/
      html
      metadata
      structured-data
      sitemap
    framework/
      components
      layouts
      themes
      assets
      routing
    cli/
      create
      dev
      build
      preview
      inspect
      publish
    publishers/
      local
  test/
  dist/

hyper-content/
  src/
    evidence/
    claims/
    page-existence/
    proposals/
    generation/
    validation/
    maintenance/
    adapters/hyper-site
    experimental/
      ontology
      retrieval
      vectors
      wasm
      gpu
  test/
  dist/

agent-control-plane/ or external adapter package
  workflow contracts
  runtime adapter
  tool adapters
  approval and policy boundary
  effect activities
  telemetry correlation
  evaluation fixtures

reference/
  fixtures/
  examples/
  compatibility/
  benchmarks/
```

## Hyper Site execution graph

```text
project config + validated content + design + assets
-> SiteSource
-> structural and reference validation
-> PageIR
-> renderer
-> HTML / CSS / assets / metadata / JSON-LD
-> sitemap / instruction projections
-> artifact manifest + declared dependencies + hashes
-> preview or publisher adapter
```

Framework usability graph:

```text
create
-> dev
-> edit five distinct pages
-> build
-> preview
-> inspect diagnostics and artifacts
-> local publish
```

This path must have no Hyper Content, model provider, agent runtime or GPU dependency.

## Hyper Content execution graph

```text
sources and approved project truth
-> evidence and claim records
-> page-existence proposals
-> optional retrieval/ontology candidates
-> structured content proposal
-> evidence, duplicate and policy validation
-> portable SiteSource
-> Hyper Site public compiler
```

Hyper Content never owns rendering or publication authority.

## Agent control-plane graph

```text
run request
-> freeze input snapshot and policy
-> create bounded plan
-> persist checkpoint
-> invoke model-backed proposal task or deterministic tool
-> retain request/response/tool evidence
-> evaluate output
-> persist checkpoint
-> interrupt for human approval when required
-> revalidate branch, artifact, policy, approval and target
-> invoke idempotent effect activity
-> record receipt or failure
-> emit trace-correlated final snapshot
```

Runtime-owned state:

```text
run_id
step_id
input_snapshot_hash
plan_version
checkpoint_version
tool invocation records
model request/response evidence
artifact_manifest_hash
approval_id and epoch
policy_version
publisher target
idempotency key
receipt
trace and span identifiers
```

## Replay and effect boundary

```text
workflow/planning code
  deterministic or replay-safe

model/API/compiler calls
  explicit tasks or activities

consequential effects
  idempotent activities with commit-time authorization
```

A retry after timeout or worker failure must not duplicate publication or another irreversible effect.

## Dependency and maintenance graph

```text
fact / evidence / component / token / page-policy change
-> declared direct dependency edges
-> expected affected artifact set frozen before execution
-> rebuild
-> actual changed set
-> compare:
     required but missed
     unexpected changed
     unchanged as expected
-> accept, reject or repair dependency model
```

The emitted reverse dependency index is a diagnostic artifact. It is not proof that all actual inputs were declared.

## External controls and complements

```text
Astro
  ordinary static-framework control

Temporal
  durable workflow and retry control

LangGraph
  stateful agent and human-interrupt control

OpenTelemetry
  traces, metrics and logs

OPA / Cedar / host policy
  authorization decisions

n8n / Power Automate / connector platforms
  deterministic business integrations

headless CMS
  editorial workflows
```

Core packages should integrate these categories through replaceable adapters when the five-page and one-effect fixtures require them.

## Forbidden Hyper Site imports

```text
ontology and opportunity selection
provider and prompt orchestration
PCN / ArticleIR internals
embedding and vector packing
current vector/facility Wasm
GPU topology
private runtime memory
credentials and connectors
authorization engine
durable workflow implementation
experiment statistics
```

## Source extraction graph

```text
inventory every reference/src file
-> assign one owner and role
-> extract SiteSource/PageIR/compiler/renderer cluster
-> build package-owned Hyper Site output
-> switch public entrypoint
-> make reference consume Hyper Site
-> prove positive and negative parity
-> extract stable content clusters
-> make reference consume Hyper Content
-> add two isolated packed consumers
-> remove runtime imports into reference
-> retire compatibility duplicates
```

## Proof graph

```text
F1 package ownership
-> F2 ordinary framework workflow
-> F3 five-page usefulness and direct control
-> F4 incremental correctness
-> F5 measured maintenance value
-> A1 durable run state
-> A2 deterministic/model task separation
-> A3 approval interruption
-> A4 idempotent effect
-> A5 observability
-> A6 security boundary
-> P1 product coherence
```

Current state:

```text
F1 RED
F2-F5 BLOCKED
A1-A6 NOT IMPLEMENTED
P1 RED
```

## Deferred critical-path work

Until F5 passes:

- governed task-surface implementation;
- SDRT and custom graph query language;
- GNN internal linking;
- browser Wasm promotion;
- GPU promotion;
- 10K publication programs;
- autonomous publication;
- enterprise-readiness claims.

## Authority chain

- `docs/research/43-useful-framework-and-agent-first-pipeline-audit.md`
- `docs/architecture/44-useful-framework-and-agent-first-target-architecture.md`
- `docs/planning/45-depth-first-framework-and-agent-recovery-plan.md`
- `docs/validation/46-useful-framework-and-agent-first-gates.md`
- `memory/MEMORY.md`

PR #3 remains draft and unmerged.
