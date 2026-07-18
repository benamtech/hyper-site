# Hyper Monorepo Durable Memory

status: active  
updated_at: 2026-07-18T22:15:00-04:00

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

## Low-level runtime disposition

Zig, WebAssembly, CBOR and MessagePack are implementation candidates only. They do not redefine the product boundary.

Accepted state:

```text
semantic source/interchange: typed SiteSource and deterministic JSON
semantic hashing control: one specified canonical JSON profile
optional derived binary cache/IPC: deterministic CBOR after validation
MessagePack: benchmark control, not integrity authority without a canonical profile
LLM prompts: compact text or provider-native structured output
pure kernels: TypeScript oracle plus optional Zig/native/Wasm challenger
orchestration, policy and effects: external runtime only
```

Binary byte reduction is not evidence of lower LLM token cost. Raw binary commonly requires base64, hexadecimal or decoding before use by a model. Measure the actual provider transport and tokenizer.

Zig/Wasm may be considered only for profiled pure operations with bounded input/output and no authority. Candidate areas are canonical encoding preparation, deterministic CBOR, large dependency-set comparison, sparse numeric work, vector packing after product validation, and sandboxed pure transforms.

Do not place HTML semantics, source approval, agent planning, checkpoints, authorization, credentials, publication or receipts inside native or Wasm kernels.

Every challenger must prove semantic parity and include encode/copy/lower, initialization, execution, decode/copy/lift, host validation, packaging, cold-start and fallback costs. The default promotion threshold is at least 1.25x end-to-end speedup, at least 30% peak-memory reduction without material regression, or a required portable sandbox capability.

The supplied ORCHESTRATOR v6 guide is abstract inspiration, not an implemented runtime. Preserve bounded allocation, schemas, checkpoints, evidence binding, circuit breakers and completion gates. Replace positional vectors with named versioned durable records; local checkpoint files with real durable state for production; regex-only rejection with AST/type/policy/behavior checks; and one opaque error scalar with rolling-window metrics and sample counts.

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

R0 documentation reconciliation is substantially complete. R1 remains the only valid implementation work. Optional low-level experiments may not delay R1-R4.

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
- mandatory Zig/native runtime;
- binary LLM prompting;
- runtime Zig SSR;
- 10K publication programs;
- autonomous publication;
- enterprise-readiness claims.

## Current authorities

- `README.md`
- `identity.md`
- `AGENTS.md`
- `CODEGRAPH.md`
- `CODEGRAPH-LOW-LEVEL.md`
- `docs/README.md`
- `docs/research/43-useful-framework-and-agent-first-pipeline-audit.md`
- `docs/research/sources/2026-07-18-framework-agent-architecture.sources.json`
- `docs/architecture/44-useful-framework-and-agent-first-target-architecture.md`
- `docs/planning/45-depth-first-framework-and-agent-recovery-plan.md`
- `docs/validation/46-useful-framework-and-agent-first-gates.md`
- `docs/research/47-zig-wasm-binary-boundary-audit.md`
- `docs/architecture/48-low-level-runtime-and-serialization-boundary.md`
- `docs/validation/49-low-level-kernel-promotion-gates.md`

## Nonclaims

No complete extraction, normal framework workflow, five-page advantage, complete incremental correctness, maintenance value, durable agent runtime, authorized idempotent effect, binary token savings, low-level performance advantage, perfect SEO, perfect Lighthouse score, production readiness or business outcome is established.

PR #3 stays draft.
