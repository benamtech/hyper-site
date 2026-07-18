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

Task surfaces, SDRT, GNNs, GPU promotion, browser Wasm promotion and 10K publication remain deferred until the ordinary framework and maintenance gates pass.

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

No Python, Docker, database, GPU, model API key, Temporal, LangGraph or OpenTelemetry service is required to test the compiler prototype. Those become dependencies only for later, separately gated integrations.

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
- code graph: `CODEGRAPH.md`
- operating contract: `AGENTS.md`
- durable state: `memory/MEMORY.md`

## Nonclaims

Passing compiler fixtures, deterministic hashes, schema validity, graph metrics and synthetic page counts are software evidence only. They do not prove a useful framework, correct complete incrementality, a reliable agent pipeline, authorized effects, ranking, conversion, revenue or production readiness.
