# Hyper Monorepo Durable Memory

status: active  
updated_at: 2026-07-18T14:30:00-04:00

## Protocol

Read this index, then the newest immutable handoff, newest measured validation report, executable plan, and task-specific research-to-validation chain. Timestamped handoffs are immutable. Source, tests, artifacts and CI outrank explanatory documents.

## Current state

```text
branch: agent/glm-blackwell-vertical-slice
pr: 3
draft: true
merged: false
maturity: research prototype approaching near-alpha
latest_handoff: memory/2026-07-18-1430-documentation-and-competitive-reality-pass.md
```

## Product boundary

```text
hyper-content -> hyper-site
hyper-site -X-> hyper-content
hyper-site -X-> private runtime internals
runtime adapters -> public task-surface contracts
```

Hyper Site owns content-neutral static artifacts and governed task mounts. Hyper Content owns evidence, content proposals, generation and validation. Runtime adapters own identity, policy, durable state, connectors, effects and receipts.

## Current physical truth

- `hyper-content/src/content-program-adapter.ts` is canonical adaptation source.
- `reference/src/content-program-adapter.ts` is a temporary legacy manifest/parity wrapper.
- neutral Hyper Site compiler and manifest still live under `reference/src`.
- most content implementation still lives under `reference/src`.
- P1.4 and P1.5 remain incomplete.

## Current authority chain

1. `identity.md`
2. `AGENTS.md`
3. `CODEGRAPH.md`
4. `README.md`
5. `docs/README.md`
6. `docs/catalog.json`
7. `planning/meta-plan-v3.json`
8. `planning/meta-plan-v3.steps.json`
9. this file
10. `memory/2026-07-18-1430-documentation-and-competitive-reality-pass.md`
11. newest report under `validation/reports/`
12. `docs/research/34-intellectual-competitive-and-use-case-landscape.md`
13. `docs/architecture/35-reality-grounded-product-and-integration-boundary.md`
14. `docs/planning/36-next-three-workstreams-reality-grounded-plan.md`
15. `docs/validation/37-reality-grounded-product-validation-matrix.md`
16. task-surface research, architecture and validation documents
17. package READMEs

## Strategic disposition

Closest wedge: compile approved evidence into a small static site and one bounded task with deterministic artifacts, explicit rejection, human approval and portable deployment.

Furthest thesis: enterprise content-and-action operating layer. It overlaps mature DXP, CMS, experimentation, agent and workflow platforms and remains long-horizon.

Static generation alone is not differentiation. Ontology, graph, embeddings, HRR/HDC, Wasm and GPU are optional methods requiring simpler controls and measured promotion.

Integration-first targets include ordinary frameworks, headless CMSs, Temporal, LangGraph, n8n, OpenFeature/GrowthBook, OpenTelemetry and policy engines.

## Current program

```text
W1 physical product extraction
-> W2 governed task-surface ABI
-> W3 standalone and real-use proof
```

Immediate next gate:

1. exact-head documentation and package CI;
2. repair any regression;
3. update measured report and PR body only after green;
4. inventory every `reference/src` file;
5. move neutral Hyper Site source into `hyper-site/src`;
6. move coherent content clusters into `hyper-content/src`;
7. make `reference/` consume both packages.

## Permanent rules

- one renderer, PageIR, sitemap and publisher authority during migration;
- every advanced method has a simple control and removal path;
- public browser state is allowlisted projection only;
- consequential effects require current policy, idempotency and receipts;
- model output is proposal state;
- no same-model self-acceptance;
- bounded repair or reject;
- every page requires independent existence justification;
- 10K pages is a software scale tier, not publication value;
- enterprise claims require governance and operating evidence;
- PR #3 remains draft until real framework, content, task, field and commercial gates pass.

## Latest handoffs

- `memory/2026-07-18-1430-documentation-and-competitive-reality-pass.md`
- `memory/2026-07-18-0805-task-surface-doc-system-ci-closure.md`
- `memory/2026-07-18-0745-task-surface-research-doc-system.md`
- `memory/2026-07-18-0630-content-program-adapter.md`
- `memory/2026-07-18-0610-meta-plan-v3-framework-core-extraction.md`
- `memory/2026-07-18-0530-product-boundary-folder-split.md`

## Nonclaims

No complete physical extraction, independent tarball proof, task-surface implementation, ordinary-framework advantage, real accepted provider cohort, production runtime isolation, enterprise readiness or commercial outcome is established yet.
