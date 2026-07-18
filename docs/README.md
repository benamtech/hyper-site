# Hyper Monorepo Documentation System

Status: active documentation authority  
Updated: 2026-07-18  
Scope: repository documentation, research intake, architecture decisions, plans, validation, and durable handoffs

## Purpose

The documentation system keeps research, decisions, executable plans, measured proof, and durable memory separate while preserving a deterministic read path for human and agent contributors.

Documentation is a map of current authority. Source, tests, emitted artifacts, CI, field records, and the newest validated handoff remain proof.

## Root allowlist

Only bootstrap documents remain at repository root:

- `README.md`
- `AGENTS.md`
- `CODEGRAPH.md`
- `CONTRIBUTING.md`
- `identity.md`

New research, architecture, planning, intake, or validation documents must not be added at root.

## Directory model

```text
docs/
  README.md                 documentation read path and lifecycle
  catalog.json              machine-readable document registry
  intake/                   raw proposals, user notes, unresolved claims
  research/                 source-backed investigation and comparisons
    sources/                machine-readable source registries
  architecture/             accepted boundaries and target designs
  planning/                 explanatory plan documents; machine plans stay in /planning
  validation/               acceptance contracts and non-measured gate definitions

planning/                    executable JSON plans and plan tests
validation/reports/          measured validation reports tied to exact commits
memory/                      durable current index plus immutable handoffs
```

## Stateful writing lifecycle

```text
intake
-> source verification
-> research disposition
-> architecture decision
-> executable plan mutation
-> implementation and TDD
-> measured validation report
-> immutable memory handoff
-> MEMORY.md reconciliation
```

Each stage has a different authority:

| Stage | May contain | Must not claim |
|---|---|---|
| intake | hypotheses, supplied notes, candidate formats | verified architecture or measured superiority |
| research | primary sources, competing designs, falsification paths | implementation completion |
| architecture | accepted boundaries, contracts, ownership | measured performance or field value |
| planning | dependencies, tests, effects, gates, rollback | completed outcomes without evidence |
| validation contract | required fixtures and pass/fail metrics | a passing result |
| validation report | exact commit, commands, artifacts, measured results | unrun checks |
| memory handoff | durable state and next gate | replacement of source or CI authority |

## Mutation rules

1. Current architecture, plan, index, and catalog documents are updated in place.
2. Timestamped files under `memory/` are immutable after commit.
3. Validation reports are immutable records for their named implementation head. Corrections use a new report.
4. Raw intake remains preserved even when its claims are rejected or narrowed.
5. Superseded documents remain cataloged with their replacement path.
6. No document may silently promote model output, a protocol preview, synthetic scale, or a nominal specification into product proof.
7. External sources are recorded in a machine-readable source registry with access date, source class, status, and the exact claim they support.

## Agent read order

1. `identity.md`
2. `AGENTS.md`
3. `CODEGRAPH.md`
4. `README.md`
5. `docs/README.md`
6. `docs/catalog.json`
7. `planning/meta-plan-v3.json`
8. `planning/meta-plan-v3.steps.json`
9. `memory/MEMORY.md`
10. newest immutable handoff under `memory/`
11. newest measured report under `validation/reports/`
12. task-specific intake, research, architecture, and validation documents

## Agent write protocol

Before writing:

- identify the document lifecycle stage;
- read the current catalog entry and replacement chain;
- state whether the write is evidence, inference, proposal, or decision;
- identify affected plan steps and downstream documents.

After writing:

- update `docs/catalog.json`;
- run `node scripts/check-doc-system.mjs`;
- update machine plans when dependencies or gates changed;
- append a new immutable memory handoff for a coherent validated pass;
- reconcile `memory/MEMORY.md`;
- preserve the draft PR and maturity nonclaims.

## Current next-generation surface documents

- Intake: `docs/intake/2026-07-18-next-generation-task-surfaces.md`
- Research: `docs/research/31-next-generation-task-surfaces-protocol-crosswalk.md`
- Architecture: `docs/architecture/32-governed-task-surface-architecture.md`
- Validation: `docs/validation/33-task-surface-validation-matrix.md`
- Sources: `docs/research/sources/2026-07-18-task-surfaces.sources.json`

## Validation hooks

The permanent documentation gate must verify:

- root Markdown allowlist;
- catalog uniqueness and path existence;
- no stale references to moved root documents;
- required intake/research/architecture/validation relationships;
- executable plan and durable-memory paths;
- immutable handoff naming;
- current bootstrap documents link to this index.
