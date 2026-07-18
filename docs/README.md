# Hyper Monorepo Documentation System

Status: active documentation authority  
Updated: 2026-07-18

## Purpose

Documentation separates supplied ideas, verified evidence, accepted architecture, executable work, prospective gates, measured reports and durable handoffs. Source, tests, emitted artifacts, CI and field evidence remain proof.

## Current authority chain

```text
docs/research/43-useful-framework-and-agent-first-pipeline-audit.md
-> docs/architecture/44-useful-framework-and-agent-first-target-architecture.md
-> docs/planning/45-depth-first-framework-and-agent-recovery-plan.md
-> docs/validation/46-useful-framework-and-agent-first-gates.md
-> measured report
-> immutable memory handoff
```

Despite historical filenames, these documents now define the **useful static framework path**, not an active agent-runtime program.

The low-level path remains optional research:

```text
docs/research/47-zig-wasm-binary-boundary-audit.md
-> docs/architecture/48-low-level-runtime-and-serialization-boundary.md
-> docs/validation/49-low-level-kernel-promotion-gates.md
-> docs/architecture/CODEGRAPH-LOW-LEVEL.md
```

It cannot reorder or block U1-U5.

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
-> simpler direct controls and falsification
-> architecture disposition
-> executable plan
-> RED/GREEN/REFACTOR implementation
-> measured validation report
-> immutable handoff
-> catalog, MEMORY, bootstrap and PR reconciliation
```

A failed downstream gate changes the plan and may reverse architecture. Historical confidence does not override source truth.

## Current product truth

```text
Hyper Content (optional later) -> portable SiteSource -> Hyper Site -> static output
Hyper Site -X-> Hyper Content
Hyper Site -X-> reference runtime in target state
```

- The compiler works for bounded fixtures.
- Most canonical source remains under `reference/src`.
- `hyper-site/index.mjs` still delegates to `reference/dist/framework-core.js`.
- The package is private and not independently proven.
- The ordinary create/dev/build/preview/inspect/local-publish workflow is not built.
- The five-page browser and maintenance comparisons have not run.
- Agent runtimes, task surfaces, remote effects and 10K generation are not active milestones.
- Zig, Wasm and binary serialization have no production authority.
- PR #3 remains draft and unmerged.

## Active implementation order

```text
U1 package ownership and isolated consumption
-> U2 ordinary CLI and starter
-> U3 five-page browser-accepted proof
-> U4 maintenance comparison and decision
-> U5 optional minimal Hyper Content adapter
```

Only U1 is currently valid implementation work.

## Authority by stage

| Stage | May contain | Must not claim |
|---|---|---|
| intake | supplied ideas and unresolved claims | verified architecture |
| research | official sources, controls, alternatives and falsification | implementation completion |
| architecture | accepted ownership and product boundaries | measured value |
| planning | dependencies, tests, rollback and stop conditions | completed outcomes |
| validation contract | fixtures, metrics and thresholds | a passing result |
| validation report | exact commit, commands, artifacts and outcomes | unrun checks |
| memory handoff | durable state and next gate | replacement of source or CI authority |

## Official external verification

Manjaro/Arch:

```text
scripts/manjaro-clone-and-test-hyper.sh
```

Generic Unix-like:

```text
scripts/clone-and-test-hyper.sh
```

These verify the current compiler only. They do not pass U1-U5.

## Research-source requirements

An active claim records:

- official or primary source URL;
- access date where relevant;
- exact claim supported;
- limitation;
- simpler control;
- downstream gate affected.

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

Read low-level documents only for an approved optional benchmark.

## Write protocol

Before writing:

- identify the lifecycle stage;
- read current authorities and physical source;
- distinguish evidence, inference, proposal and decision;
- name the simplest direct control;
- define falsification and rollback;
- identify affected bootstrap, validation and memory surfaces.

After writing:

- update product truth when it changed;
- update `docs/catalog.json` or record an explicit blocker;
- run `node scripts/check-doc-system.mjs`;
- run applicable package and validation tests;
- create reports only for checks actually run;
- append an immutable handoff for a coherent completed pass;
- reconcile `memory/MEMORY.md` and the draft PR record.

## Freshness rules

An active document is stale when it:

- calls a facade or folder a completed package;
- presents `reference/` as only a consumer while runtime imports remain;
- treats compiler invocation as a normal framework workflow;
- puts agents, task surfaces or scale before the five-page maintenance proof;
- treats the dependency index as complete incrementality;
- assumes binary bytes reduce model tokens;
- treats a microbenchmark as product performance;
- claims SEO, ranking, conversion or revenue from software fixtures;
- cites the old R0-R6 sequence as current.

## Permanent documentation checks

The documentation gate should verify:

- root Markdown allowlist;
- catalog uniqueness and path existence;
- current authority-chain paths;
- explicit `reference/dist` delegation;
- U1-U5 sequencing;
- framework nonclaims;
- direct controls for advanced methods;
- low-level research subordination;
- immutable handoff naming;
- current PR draft posture.
