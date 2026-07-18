# Hyper Monorepo

Status: working compiler prototype; useful external framework not yet proven  
Updated: 2026-07-18  
PR: #3 remains draft and unmerged

## What works now

The current compiler can:

- validate structured `SiteSource` input;
- reject missing references and under-supported claims;
- construct `PageIR`;
- emit semantic HTML, metadata, JSON-LD, sitemap and optional instruction Markdown;
- generate a reverse dependency index;
- compute deterministic page and build hashes.

Current execution path:

```text
consumer
-> hyper-site/index.mjs
-> reference/dist/framework-core.js
-> compileSite(SiteSource)
```

This is real compiler behavior, but `hyper-site` does not yet physically own the implementation and is not yet a normal installable framework.

## Active product target

```text
Hyper Content (optional later producer)
-> portable SiteSource
-> Hyper Site
-> complete static artifacts
```

Hyper Site must work without Hyper Content, an LLM, an agent runtime, a GPU, a database, Zig or Wasm.

Agent runtimes, task surfaces, remote publication, 10K generation and low-level acceleration are not active product milestones.

## Definition of useful

A clean external developer must be able to:

```text
install packed package
-> create starter
-> edit facts, pages and design tokens
-> dev
-> build five distinct pages
-> preview built output
-> inspect routes, links, metadata and dependencies
-> publish locally by copying the accepted static build
```

## Current execution order

```text
U1 package ownership and isolated consumption
-> U2 ordinary CLI and starter
-> U3 five-page browser-accepted proof
-> U4 maintenance comparison and advance/narrow/stop decision
-> U5 optional minimal Hyper Content adapter
```

Only U1 is currently unblocked.

## Immediate work

1. Classify every file under `reference/src` by one owner and role.
2. Move the existing compiler/renderer cluster into `hyper-site/src` without redesigning behavior.
3. Build `hyper-site/dist` from package-owned source.
4. Switch package exports away from `reference/dist`.
5. Make `reference/` consume `@amtech/hyper-site`.
6. Prove frozen positive and negative parity.
7. Prove two isolated consumers installed from `npm pack`.

No new compiler features belong in this extraction pass.

## Research-backed direct controls

Hyper will be compared with:

- typed JSON plus direct templates;
- an Astro static site using the same facts, routes, design and acceptance criteria.

npm package exports and tarball consumption establish the external package floor. Astro's documented `dev`, `build`, `preview`, static routing and schema-validated content establish an ordinary framework floor. Playwright browser tests verify user-visible behavior; accessibility scanning remains partial evidence and must be supplemented by manual review.

## Local dependencies

Current compiler tests require:

- Git;
- Node.js 20 or newer;
- npm;
- Bash and ordinary Unix tools;
- curl only for live download scripts;
- pacman only for the optional Manjaro installer.

No Python, Docker, database, GPU, LLM key, Zig compiler or Wasm runtime is required.

## Test the current compiler

Manjaro/Arch:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/benamtech/hyper-site/agent/glm-blackwell-vertical-slice/scripts/manjaro-clone-and-test-hyper.sh)
```

Generic Unix-like:

```bash
curl -fsSL https://raw.githubusercontent.com/benamtech/hyper-site/agent/glm-blackwell-vertical-slice/scripts/clone-and-test-hyper.sh | bash
```

These verify only current compiler behavior for an exact commit, machine and generated fixture. They do not pass U1-U5.

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

## Active authority

- research: `docs/research/43-useful-framework-and-agent-first-pipeline-audit.md`
- architecture: `docs/architecture/44-useful-framework-and-agent-first-target-architecture.md`
- plan: `docs/planning/45-depth-first-framework-and-agent-recovery-plan.md`
- gates: `docs/validation/46-useful-framework-and-agent-first-gates.md`
- code graph: `CODEGRAPH.md`
- operating contract: `AGENTS.md`
- durable state: `memory/MEMORY.md`

Low-level Zig/Wasm/binary documents remain optional research and cannot reorder U1-U5.

## Nonclaims

Passing compiler fixtures, hashes, schema checks, graph metrics, synthetic scale and isolated kernel benchmarks do not prove a useful framework, complete incrementality, page usefulness, SEO quality, ranking, conversion, revenue or production readiness.

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
