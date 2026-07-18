# Hyper Monorepo Durable Memory

status: active  
updated_at: 2026-07-18T21:15:00-04:00

## State

branch: agent/glm-blackwell-vertical-slice  
pr: 3  
draft: true  
merged: false  
maturity: research prototype; useful framework and durable agent pipeline unproven

## Target boundary

```text
Hyper Content (optional producer) -> Hyper Site
external agent control plane -> public package tools and artifacts
Hyper Site -X-> Hyper Content
package cores -X-> orchestration runtime internals
```

## Physical truth

- Most canonical implementation still resides under `reference/src`.
- `hyper-site/index.mjs` delegates current compiler behavior to `reference/dist/framework-core.js`.
- `hyper-content/src/content-program-adapter.ts` is the first physically extracted stable content adapter.
- Physical package extraction remains incomplete.
- `reference/` is still transitional runtime authority, not yet only a consumer.

## Verified current capability

The current compiler can validate `SiteSource`, enforce reference and evidence constraints, construct `PageIR`, emit semantic HTML, metadata, JSON-LD, sitemap and instruction projections, generate a reverse dependency index, and compute deterministic page/build hashes.

Portable external runners exercise this behavior against generated unique fixtures. A pass proves behavior for the exact commit, machine and fixture only.

## Depth-first audit verdict

The repository does not yet meet the floor of a useful ordinary framework or a durable agent-first pipeline.

Framework gaps:

- no package-owned compiler source;
- no clean packed-package consumers;
- no create/dev/build/preview/inspect/publish workflow;
- no accepted five-page site against an ordinary-framework control;
- no proven complete incremental maintenance model.

Agent-pipeline gaps:

- no durable external orchestrator;
- no checkpoint/restart proof;
- no separation of replay-safe workflow logic from model calls and effects;
- no approval interrupt proof;
- no idempotent publication effect;
- no end-to-end trace correlation or commit-time authorization.

## Current architecture

Hyper Site is the deterministic static framework. It must work without Hyper Content, an LLM, an agent runtime or a GPU.

Hyper Content is an optional evidence/content producer that emits portable Hyper Site input.

An external agent control plane owns durable state, retries, cancellation, human approval, policy, credentials, connectors, effects, receipts and telemetry. Use an established runtime category through adapters rather than embedding a custom runtime in package cores.

## Execution order

```text
R0 truth reconciliation
-> R1 physical extraction
-> R2 ordinary framework floor
-> R3 five-page usefulness comparison
-> R4 maintenance correctness and value
-> R5 durable agent wrapper
-> R6 approved idempotent publication
```

R0 documentation reconciliation is substantially complete. R1 remains the only valid implementation work.

## Incremental correctness rule

The dependency index is a hypothesis, not proof of completeness. Every maintenance test must freeze an expected affected set and measure both:

- required artifacts that failed to change;
- unexpected artifacts that changed.

## Deferred work

Until R4 passes, do not place the following on the critical path:

- governed task-surface implementation;
- SDRT or custom graph query language;
- GNN internal linking;
- GPU promotion;
- browser Wasm promotion;
- 10K publication programs;
- autonomous publication;
- enterprise-readiness claims.

## Current authorities

- `README.md`
- `identity.md`
- `AGENTS.md`
- `CODEGRAPH.md`
- `docs/README.md`
- `docs/research/43-useful-framework-and-agent-first-pipeline-audit.md`
- `docs/research/sources/2026-07-18-framework-agent-architecture.sources.json`
- `docs/architecture/44-useful-framework-and-agent-first-target-architecture.md`
- `docs/planning/45-depth-first-framework-and-agent-recovery-plan.md`
- `docs/validation/46-useful-framework-and-agent-first-gates.md`

## Nonclaims

No complete extraction, normal framework workflow, five-page advantage, complete incremental correctness, maintenance value, durable agent runtime, authorized idempotent effect, production readiness or business outcome is established.

PR #3 stays draft.
