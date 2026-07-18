# Hyper Monorepo Documentation System

Status: active documentation authority  
Updated: 2026-07-18

## Purpose

Documentation separates supplied ideas, external evidence, accepted architecture, executable work, prospective gates, measured reports and durable handoffs. Source, tests, emitted artifacts, CI and field evidence remain proof.

## Current authority chain

```text
docs/research/43-useful-framework-and-agent-first-pipeline-audit.md
-> docs/architecture/44-useful-framework-and-agent-first-target-architecture.md
-> docs/planning/45-depth-first-framework-and-agent-recovery-plan.md
-> docs/validation/46-useful-framework-and-agent-first-gates.md
-> measured report
-> immutable memory handoff
```

Earlier documents remain historical, supporting or superseded authorities. When they conflict with the chain above, the newer chain controls current execution order and product boundaries.

## Root allowlist

Only bootstrap documents remain at repository root:

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
  machine-readable executable plans and tests
validation/reports/
  measured reports tied to exact commits
memory/
  current index and immutable handoffs
```

## Lifecycle

```text
intake
-> primary and official source verification
-> critical research and direct controls
-> architecture disposition
-> executable plan
-> RED/GREEN/REFACTOR implementation
-> measured validation report
-> immutable memory handoff
-> catalog, MEMORY, bootstrap and PR reconciliation
```

A downstream contradiction flows backward. Failed validation changes the plan and may reverse architecture. Historical confidence never overrides current catalog status or physical source truth.

## Current product truth

```text
Hyper Content (optional producer) -> Hyper Site
external agent control plane -> public tools and artifacts
Hyper Site -X-> Hyper Content
package cores -X-> runtime internals
```

- The compiler prototype works for bounded fixtures.
- Most canonical source remains under `reference/src`.
- `hyper-site/index.mjs` still delegates to `reference/dist/framework-core.js`.
- The ordinary framework workflow is not built.
- The five-page usefulness and maintenance comparisons are not run.
- A durable agent runtime and idempotent effect path are not implemented.
- PR #3 remains draft and unmerged.

## Authority by stage

| Stage | May contain | Must not claim |
|---|---|---|
| intake | supplied ideas and unresolved claims | verified architecture |
| research | primary sources, controls, alternatives and falsification | implementation completion |
| architecture | accepted ownership and build/integrate decisions | measured value |
| planning | dependencies, effects, tests and rollback | completed outcomes |
| validation contract | fixtures, metrics and thresholds | a passing result |
| validation report | exact commit, commands, artifacts and outcomes | unrun checks |
| memory handoff | durable state and next gate | replacement of source or CI authority |

## Current implementation order

```text
R0 truth reconciliation
-> R1 physical extraction
-> R2 ordinary framework floor
-> R3 five-page comparison
-> R4 maintenance correctness and value
-> R5 durable agent wrapper
-> R6 approved idempotent publication
```

Task surfaces, SDRT, GNNs, GPU promotion, browser Wasm and 10K publication are not current implementation work.

## Official external verification

Manjaro/Arch:

```text
scripts/manjaro-clone-and-test-hyper.sh
```

Generic Unix-like:

```text
scripts/clone-and-test-hyper.sh
```

Both verify only the current compiler behavior for an exact commit, machine and generated fixture. They do not satisfy the framework or agent gates.

## Research-source requirements

An active research claim records:

- primary or official source URL;
- access date;
- source class;
- exact claim supported;
- limitation or unresolved inference;
- simpler control;
- downstream architecture or gate affected.

Current source registry:

- `docs/research/sources/2026-07-18-framework-agent-architecture.sources.json`

## Agent read order

1. `identity.md`
2. `AGENTS.md`
3. `CODEGRAPH.md`
4. `README.md`
5. `docs/README.md`
6. `docs/catalog.json`
7. `memory/MEMORY.md`
8. newest immutable handoff
9. newest measured report
10. current task-specific authority chain

## Write protocol

Before writing:

- identify the lifecycle stage;
- read the current authority chain and replacement relationships;
- distinguish evidence, inference, proposal and decision;
- name the direct control and falsification condition;
- identify affected root guides, plans, validation and memory.

After writing:

- update current bootstrap surfaces when product truth changes;
- update `docs/catalog.json` or record an explicit catalog-reconciliation blocker;
- run `node scripts/check-doc-system.mjs`;
- run applicable package and validation tests;
- create a measured report only for checks actually run;
- append an immutable handoff for a coherent completed pass;
- reconcile `memory/MEMORY.md` and the draft PR body.

## Freshness rules

An active document is stale when it:

- calls a facade or folder a completed package boundary;
- presents `reference/` as only a consumer while runtime imports remain;
- presents compiler behavior as a normal framework workflow;
- presents an LLM loop as durable agent orchestration;
- puts task surfaces or advanced methods before the five-page maintenance proof;
- treats a dependency index as complete incremental correctness;
- claims publication from compilation without approval and effect evidence;
- cites an older execution order as current.

## Permanent validation hooks

The documentation gate should verify:

- root Markdown allowlist;
- catalog uniqueness and path existence;
- current authority-chain paths;
- no active sequencing conflict with the recovery plan;
- explicit current `reference/dist` delegation;
- ordinary framework and agent-runtime nonclaims;
- direct controls for advanced methods;
- immutable handoff naming;
- current PR draft posture.
