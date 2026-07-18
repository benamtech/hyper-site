# Hyper Monorepo Documentation System

Status: active documentation authority  
Updated: 2026-07-18  
Scope: repository documentation, research, architecture, planning, validation and durable state

## Purpose

The documentation system separates proposals, external evidence, accepted decisions, executable plans, pass/fail contracts, measured proof and durable handoffs. Documentation maps authority; source, tests, emitted artifacts, CI and field records remain proof.

## Root allowlist

Only bootstrap documents remain at repository root:

- `README.md`
- `AGENTS.md`
- `CODEGRAPH.md`
- `CONTRIBUTING.md`
- `identity.md`

New research, architecture, planning or validation documents belong under `docs/`.

## Directory model

```text
docs/
  README.md                 lifecycle and read/write protocol
  catalog.json              machine-readable authority and supersession registry
  intake/                   supplied notes and unresolved claims
  research/                 source-backed investigation and dispositions
    sources/                machine-readable source registries
    experiments/            bounded research fixtures
  architecture/             accepted product and system decisions
  planning/                 explanatory plans; executable JSON stays in /planning
  validation/               prospective pass/fail contracts
  archive/                  retained noncurrent material

planning/                    executable plans and plan tests
validation/reports/          immutable measured reports tied to exact commits
memory/                      current index and immutable handoffs
```

## Self-reinforcing lifecycle

```text
intake
-> external source verification
-> critical research and alternatives
-> architecture disposition
-> executable plan mutation
-> RED/GREEN/REFACTOR implementation
-> measured validation report
-> immutable memory handoff
-> MEMORY.md and catalog reconciliation
-> next research or implementation gate
```

A downstream contradiction must flow backward. Failed validation updates the plan and may reverse architecture. New research does not become architecture until explicitly accepted. Historical documents cannot silently override current authorities.

## Authority by stage

| Stage | May contain | Must not claim |
|---|---|---|
| intake | hypotheses, supplied notes, candidate formats | verified architecture or measured superiority |
| research | primary sources, competitors, complements, controls, falsification | implementation completion |
| architecture | accepted boundaries, ownership, build/integrate decisions | measured performance or field value |
| planning | dependencies, tests, effects, gates and rollback | completed outcomes without evidence |
| validation contract | fixtures, controls, metrics and thresholds | a passing result |
| validation report | exact commit, commands, artifacts and measured outcomes | unrun checks or broader claims |
| memory handoff | durable state and next gate | replacement of source or CI authority |

## Current authority chain

### Product and package boundary

- Research and split rationale: `docs/architecture/29-product-boundary-research-and-root-folder-split.md`
- Current reality-grounded research: `docs/research/34-intellectual-competitive-and-use-case-landscape.md`
- Accepted integration boundary: `docs/architecture/35-reality-grounded-product-and-integration-boundary.md`
- Active three-workstream plan: `docs/planning/36-next-three-workstreams-reality-grounded-plan.md`
- Validation contract: `docs/validation/37-reality-grounded-product-validation-matrix.md`
- Executable program: `planning/meta-plan-v3.json`, `planning/meta-plan-v3.steps.json`

### Governed task surfaces

- Intake: `docs/intake/2026-07-18-next-generation-task-surfaces.md`
- Research: `docs/research/31-next-generation-task-surfaces-protocol-crosswalk.md`
- Architecture: `docs/architecture/32-governed-task-surface-architecture.md`
- Validation: `docs/validation/33-task-surface-validation-matrix.md`
- Sources: `docs/research/sources/2026-07-18-task-surfaces.sources.json`

### Competitive and intellectual grounding

- Research: `docs/research/34-intellectual-competitive-and-use-case-landscape.md`
- Sources: `docs/research/sources/2026-07-18-intellectual-competitive-landscape.sources.json`
- Architecture disposition: `docs/architecture/35-reality-grounded-product-and-integration-boundary.md`
- Plan: `docs/planning/36-next-three-workstreams-reality-grounded-plan.md`
- Validation: `docs/validation/37-reality-grounded-product-validation-matrix.md`

## Current implementation truth

- `hyper-content/src/content-program-adapter.ts` is the first physically owned Hyper Content implementation.
- `reference/src/content-program-adapter.ts` is a temporary legacy manifest/parity wrapper.
- Most canonical Hyper Site and Hyper Content implementation still resides under `reference/src` pending P1.4 and P1.5.
- Folder names and facades are not proof of complete extraction.
- PR #3 remains draft and unmerged.

## Mutation rules

1. Current architecture, plan, bootstrap and catalog documents are updated in place.
2. Timestamped handoffs under `memory/` are immutable after commit.
3. Validation reports are immutable for their named implementation head; corrections use a new report.
4. Raw intake remains preserved even when rejected or narrowed.
5. Superseded documents remain cataloged with replacements.
6. Model output, preview protocols, synthetic scale and schema validity cannot be promoted into product proof.
7. External sources require a registry entry with access date, source class, status and supported claims.
8. Advanced methods require a named simple control and removal path.
9. Enterprise comparisons must include governance and operating gaps, not only features.
10. Every active plan must terminate in measurable validation and durable memory.

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
10. newest immutable handoff
11. newest measured report
12. task-specific research, architecture, plan and validation chain

## Agent write protocol

Before writing:

- identify the lifecycle stage;
- read the catalog and replacement chain;
- state whether the material is evidence, inference, proposal or decision;
- identify controls, alternatives, affected plan steps and downstream documents.

After writing:

- update `docs/catalog.json`;
- run `node scripts/check-doc-system.mjs`;
- update executable plans when dependencies or gates change;
- run relevant source and package tests;
- produce a measured report only for completed checks;
- append an immutable handoff for a coherent validated pass;
- reconcile `memory/MEMORY.md` and the draft PR body.

## Documentation freshness rules

An active document is stale when it names a noncanonical implementation as current, cites an older CI head as current proof, conflicts with the executable plan, omits its downstream validation contract, or makes a claim invalidated by newer research.

Historical documents remain useful intellectual record. Their status in `docs/catalog.json`, not their confident language, determines authority.

## Permanent validation hooks

The documentation gate verifies or should be extended to verify:

- root Markdown allowlist;
- catalog uniqueness and path existence;
- no stale references to moved root documents;
- required research, architecture, planning and validation relationships;
- executable plan and memory paths;
- immutable handoff naming;
- bootstrap links to this index;
- active-source registry existence;
- current implementation-path assertions;
- explicit controls for advanced methods;
- current PR maturity nonclaims.
