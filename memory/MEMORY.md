# Hyper Monorepo Durable Memory

status: active  
updated_at: 2026-07-18T23:00:00-04:00

## State

branch: agent/glm-blackwell-vertical-slice  
pr: 3  
draft: true  
merged: false  
maturity: working compiler prototype; useful external framework unproven

## Active boundary

```text
Hyper Content (optional later) -> portable SiteSource -> Hyper Site -> static output
Hyper Site -X-> Hyper Content
```

Agent runtimes, task surfaces, remote effects, scale programs and low-level acceleration are not active product milestones.

## Physical truth

- Most canonical implementation still resides under `reference/src`.
- `hyper-site/index.mjs` delegates compiler behavior to `reference/dist/framework-core.js`.
- `hyper-site/package.json` is private and has no package-owned compiler build.
- `hyper-content/src/content-program-adapter.ts` is the first physically extracted stable content adapter.
- `reference/` remains transitional runtime authority.

## Verified current capability

The compiler validates `SiteSource`, enforces references and evidence thresholds, constructs `PageIR`, emits semantic HTML, metadata, JSON-LD, sitemap and instruction Markdown, generates a reverse dependency index, and computes deterministic page/build hashes.

Portable runners verify this behavior for exact commits and fixtures only. They do not establish package ownership or framework usefulness.

## Reality reset

The useful product bar is now:

```text
install packed package
-> create starter
-> dev
-> build five distinct pages
-> preview built output
-> inspect routes, links, metadata and dependencies
-> publish locally
```

The direct controls are typed JSON plus templates and Astro using the same brief and inputs.

## Execution order

```text
U1 package ownership and isolated consumption
-> U2 ordinary CLI and starter
-> U3 five-page browser-accepted proof
-> U4 maintenance comparison and advance/narrow/stop
-> U5 optional minimal Hyper Content adapter
```

Only U1 is unblocked.

## U1 scope

- classify every `reference/src` file by one owner and role;
- freeze positive and negative compiler fixtures;
- move the compiler/renderer cluster into `hyper-site/src` without redesign;
- build `hyper-site/dist` from package-owned source;
- switch exports away from `reference/dist`;
- make `reference/` consume Hyper Site;
- prove two isolated `npm pack` consumers;
- produce positive and negative parity evidence.

## U2-U4 proof

U2 requires create/dev/build/preview/inspect/local-publish with Node 20+ and no Hyper Content, model, GPU, database or external service.

U3 requires one real five-page site, browser-visible assertions, route/link/metadata validation, automated accessibility scanning and manual review against direct controls.

U4 freezes shared-fact, page-fact, design, retirement and invalid-change scenarios. Pass correctness requires zero missed required changes, no accepted invalid change and no accepted partial output after failure. The result must be `advance`, `narrow` or `stop`.

## Incremental correctness

The dependency index is a hypothesis. Every maintenance test freezes an expected affected set and measures both under-invalidation and over-invalidation.

## Deferred work

Until U4 records `advance`:

- model-backed generation;
- agent orchestration and task surfaces;
- remote publication;
- SDRT/custom graph languages;
- GNN/GPU/Zig/Wasm promotion;
- binary LLM prompting;
- 10K publication;
- enterprise claims.

## Active authorities

- `README.md`
- `AGENTS.md`
- `CODEGRAPH.md`
- `docs/README.md`
- `docs/research/43-useful-framework-and-agent-first-pipeline-audit.md`
- `docs/research/sources/2026-07-18-framework-agent-architecture.sources.json`
- `docs/architecture/44-useful-framework-and-agent-first-target-architecture.md`
- `docs/planning/45-depth-first-framework-and-agent-recovery-plan.md`
- `docs/validation/46-useful-framework-and-agent-first-gates.md`

Low-level documents 47-49 remain subordinate optional research.

## Nonclaims

No complete package extraction, normal framework workflow, five-page acceptance, maintenance advantage, complete incremental correctness, content-product value, agent runtime, scale advantage, SEO outcome, production readiness or business result is established.

PR #3 stays draft.
