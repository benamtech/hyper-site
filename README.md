# Hyper Monorepo

Status: research prototype; useful framework and agent pipeline not yet proven  
Updated: 2026-07-18  
PR: #3 remains draft and unmerged

## Target system

```text
Hyper Content (optional evidence/content producer)
        |
        v
Hyper Site (deterministic static framework)

External agent control plane
  operates both packages through public tools and artifacts
```

Hard direction:

```text
hyper-content -> hyper-site
hyper-site -X-> hyper-content
package cores -X-> orchestration runtime internals
```

## What works now

The current compiler prototype can validate a structured `SiteSource`, reject missing or under-supported references, construct `PageIR`, emit semantic HTML, metadata, JSON-LD, sitemap and optional instruction Markdown, generate a reverse dependency index, and compute deterministic page/build hashes.

Current execution path:

```text
consumer
-> hyper-site/index.mjs
-> reference/dist/framework-core.js
-> compileSite(SiteSource)
```

This is real compiler behavior, but package extraction is incomplete. Most canonical source still lives under `reference/src`.

## What is not built yet

The repository does not yet provide:

- an independently owned and packed Hyper Site compiler package;
- a normal create/dev/build/preview/inspect/publish workflow;
- a five-page accepted site and ordinary-framework comparison;
- proven incremental maintenance correctness or value;
- a durable agent runtime with checkpoints and approval interrupts;
- idempotent publication or another consequential effect;
- end-to-end telemetry and commit-time authorization;
- production readiness or commercial evidence.

## Useful framework floor

Hyper Site must work for an ordinary developer without Hyper Content, an LLM, an agent runtime or a GPU:

```text
create
-> dev
-> build five distinct real pages
-> preview
-> inspect output and diagnostics
-> local publish
```

The direct control is Astro or another suitable static framework using the same facts, design, assets and output requirements.

## Agent-first target

Agent-first means an external durable control plane, not an LLM call inside the compiler.

```text
freeze input snapshot
-> plan bounded work
-> invoke deterministic and model-backed tools
-> persist checkpoints and evidence
-> pause for approval
-> revalidate authority at commit time
-> invoke an idempotent effect
-> record traces and receipt
```

Durability, retries, human interruption, policy, credentials, connectors and effects belong to an established orchestration/runtime category through adapters. They do not belong in the Hyper Site compiler core.

## Low-level runtime disposition

Zig, WebAssembly, CBOR and MessagePack are optional implementation experiments, not the product architecture.

```text
canonical authoring/interchange: typed SiteSource + deterministic JSON
optional derived cache/IPC: deterministic CBOR
LLM prompts: compact text or provider-native structured output
pure kernels: TypeScript oracle + optional Zig/native/Wasm challenger
orchestration/policy/effects: external runtime only
```

Current decisions:

- binary bytes do not imply lower model token cost;
- CBOR may be tested as a deterministic derived artifact after validation;
- MessagePack may be a cache/IPC benchmark control but is not an integrity authority without an explicit canonical profile;
- Zig/Wasm may challenge measured pure kernels only after profiling;
- HTML rendering, source approval, agent state, authorization and publication stay outside low-level kernels;
- runtime Zig SSR and binary LLM prompting are outside the current critical path;
- every challenger must include conversion, cold-start, validation, packaging and fallback costs in its benchmark.

Authorities:

- `docs/research/47-zig-wasm-binary-boundary-audit.md`
- `docs/architecture/48-low-level-runtime-and-serialization-boundary.md`
- `docs/validation/49-low-level-kernel-promotion-gates.md`
- `CODEGRAPH-LOW-LEVEL.md`

## Current work order

```text
R0 reconcile repository truth
-> R1 physical package extraction
-> R2 ordinary framework floor
-> R3 five-page usefulness comparison
-> R4 maintenance correctness and value
-> R5 durable agent wrapper
-> R6 one approved idempotent publication effect
```

Task surfaces, SDRT, GNNs, GPU promotion, browser Wasm promotion and 10K publication remain deferred until the ordinary framework and maintenance gates pass. Low-level experiments may run only when they are optional and do not delay R1-R4.

## Test the current compiler

Manjaro/Arch external verification:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/benamtech/hyper-site/agent/glm-blackwell-vertical-slice/scripts/manjaro-clone-and-test-hyper.sh)
```

Generic Unix-like verification:

```bash
curl -fsSL https://raw.githubusercontent.com/benamtech/hyper-site/agent/glm-blackwell-vertical-slice/scripts/clone-and-test-hyper.sh | bash
```

These scripts prove current compiler behavior for their exact commit, generated fixture and machine. They do not satisfy the framework or agent gates.

## Local dependencies

For the current repository tests you need:

- Git, to clone and identify the exact branch/commit;
- Node.js 20 or newer, to run ESM scripts and tests;
- npm, to install the locked workspace dependencies and invoke scripts;
- Bash and standard Unix tools for the external runners;
- curl only when downloading a live runner from GitHub;
- pacman only for the optional Manjaro dependency installer.

No Python, Docker, database, GPU, model API key, Zig compiler, Wasm runtime, Temporal, LangGraph or OpenTelemetry service is required to test the compiler prototype. Those become dependencies only for later, separately gated integrations or optional experiments.

## Local commands

```bash
npm ci
npm run build
npm test
npm run test:validation
npm run test:compiler-limit
npm run validate:workstreams
node scripts/check-doc-system.mjs
```

## Current authority

- research audit: `docs/research/43-useful-framework-and-agent-first-pipeline-audit.md`
- target architecture: `docs/architecture/44-useful-framework-and-agent-first-target-architecture.md`
- recovery plan: `docs/planning/45-depth-first-framework-and-agent-recovery-plan.md`
- validation gates: `docs/validation/46-useful-framework-and-agent-first-gates.md`
- low-level audit: `docs/research/47-zig-wasm-binary-boundary-audit.md`
- low-level architecture: `docs/architecture/48-low-level-runtime-and-serialization-boundary.md`
- low-level gates: `docs/validation/49-low-level-kernel-promotion-gates.md`
- code graphs: `CODEGRAPH.md`, `CODEGRAPH-LOW-LEVEL.md`
- operating contract: `AGENTS.md`
- durable state: `memory/MEMORY.md`

## Nonclaims

Passing compiler fixtures, deterministic hashes, schema validity, graph metrics, binary byte-size reductions, isolated kernel speedups and synthetic page counts are software evidence only. They do not prove a useful framework, lower LLM token cost, correct complete incrementality, a reliable agent pipeline, authorized effects, SEO quality, Lighthouse scores, ranking, conversion, revenue or production readiness.

## Governed task surfaces

Hyper Site's next interaction layer is a protocol-neutral governed task-surface platform. Static pages remain complete and indexable; optional runtime services accept typed intents and return public projections, resources, artifacts, actions, and receipts. Theme developers own trusted renderers, site developers own mounts and fallbacks, and growth operators own bounded experiment and conversion policy. Hyper Content may propose task semantics but contains zero UI implementation logic.

Current authority:

- `docs/intake/2026-07-18-next-generation-task-surfaces.md`
- `docs/research/31-next-generation-task-surfaces-protocol-crosswalk.md`
- `docs/architecture/32-governed-task-surface-architecture.md`
- `docs/validation/33-task-surface-validation-matrix.md`

A2UI, AG-UI, MCP Apps, and AMTECH AI Employee are adapters after the internal ABI passes. Ten-thousand-page surface scale is a mandatory benchmark tier, not a page-usefulness claim.

## Documentation system

Documentation lifecycle and research catalog: `docs/README.md`. Machine-readable document authority: `docs/catalog.json`.
