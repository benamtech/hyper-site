# 2026-07-18 23:00 ET — Useful Framework Reality Reset

status: immutable handoff  
branch: agent/glm-blackwell-vertical-slice  
pr: 3

## Why this pass happened

The repository had regained speculative agent-runtime, task-surface, enterprise-integration and low-level milestones in active architecture despite the physical product still being a compiler facade over `reference/dist`.

The documentation validator itself still enforced task-surface workstreams and a 10K-scale constraint, so green documentation CI could preserve an obsolete roadmap.

## Verified current truth

- `hyper-site/index.mjs` delegates to `reference/dist/framework-core.js`.
- Most canonical source remains under `reference/src`.
- `@amtech/hyper-site` remains private and is not proven from isolated tarball consumers.
- The compiler validates `SiteSource`, constructs `PageIR`, emits static artifacts, dependencies and hashes.
- No normal external create/dev/build/preview/inspect/local-publish workflow exists.
- No accepted five-page site or maintenance advantage exists.

## Research disposition

Official npm documentation supports package exports and `npm pack` as the external package floor.

Official Astro documentation supports dev/build/preview, static routing and schema-validated content as an ordinary framework control.

Official Playwright guidance supports isolated tests of user-visible behavior and automated accessibility scanning with explicit manual-testing limitations.

Bazel dependency guidance supports treating the dependency index as a hypothesis that must be checked for both missed required changes and unexpected changes.

## Accepted execution order

```text
U1 package ownership and isolated consumption
-> U2 ordinary CLI and starter
-> U3 five-page browser-accepted proof
-> U4 maintenance comparison and advance/narrow/stop
-> U5 optional minimal Hyper Content adapter
```

Only U1 is unblocked.

## Immediate next gate

Complete the `reference/src` ownership inventory, freeze compiler fixtures, extract the compiler/renderer cluster into `hyper-site/src`, reverse the compatibility dependency, and prove two isolated `npm pack` consumers with positive and negative parity.

## Deferred

Agent orchestration, task surfaces, remote effects, model-backed bulk generation, SDRT, GNNs, GPU/Zig/Wasm promotion, binary prompting, 10K publication and enterprise claims remain outside the active product graph until U4 advances.

## Updated authorities

- `README.md`
- `identity.md`
- `AGENTS.md`
- `CODEGRAPH.md`
- `docs/README.md`
- `docs/catalog.json`
- `docs/research/43-useful-framework-and-agent-first-pipeline-audit.md`
- `docs/research/sources/2026-07-18-framework-agent-architecture.sources.json`
- `docs/architecture/44-useful-framework-and-agent-first-target-architecture.md`
- `docs/planning/45-depth-first-framework-and-agent-recovery-plan.md`
- `docs/validation/46-useful-framework-and-agent-first-gates.md`
- `scripts/check-doc-system.mjs`
- `memory/MEMORY.md`

## Nonclaims

This pass changed architecture and documentation authority only. It did not complete package extraction, build the CLI, create the five-page site, prove maintenance value or establish production readiness.
