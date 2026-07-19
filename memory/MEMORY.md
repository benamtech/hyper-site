# Hyper Monorepo Durable Memory

status: active  
updated_at: 2026-07-19T03:10:00-04:00

## State

branch: agent/glm-blackwell-vertical-slice  
pr: 3  
draft: true  
merged: false  
maturity: H0/H1 PASS; bounded H3 living-surface MVP PASS; H2 autonomous semantic generation remains the next core gate

## Active boundary

```text
Hyper Content -> portable semantic state -> Hyper Site
reference -> Hyper Site compatibility surface
Hyper Site -X-> Hyper Content
Hyper Site -X-> reference runtime
```

## Measured package truth

H0/H1 validated source commit: `af4774e0efc90f1890a977896ac41f87e1452744`  
H0/H1 workflow: `29675348346`

Living-surface MVP validated source commit: `f5734533da137f1f28509d495f7fc67a187495ad`  
Living-surface workflow: `29677235149`  
Living-surface artifact: `h0-h1-proof-29677235149`

```text
H0 integrated proof: PASS
H1 physical extraction: PASS
H3 living-surface MVP substrate: PASS
next core gate: H2 autonomous semantic generation
```

## Physical truth

- `hyper-site/src` owns the deterministic compiler and `living-surface.ts`.
- `hyper-site/index.mjs` exports package-owned `hyper-site/dist/index.js`.
- package version is `0.3.0-alpha.0`.
- `@amtech/hyper-site/living-surface` exports runtime and declarations.
- clean-room runtime, invalid-input and strict TypeScript tarball consumers pass.
- Hyper Site package tests pass 8/8.
- legacy compatibility tests pass 80/80.
- 59 `reference/src` TypeScript/declaration files remain fully classified.

## Living-surface MVP

```text
LivingSurfaceState
-> validation
-> audience permission projection
-> governance and agency resolution
-> deterministic decision ledger
-> accessible static public/operator HTML
-> state, HTML and build hashes
```

Implemented:

- nine normalized interface-field channels;
- explicit public/operator/both visibility filtering before rendering;
- user/agent/mixed action authority;
- risk threshold to `approval-required` transition;
- agency mode and blend-radius calculation;
- logistic approval-boundary curvature;
- runtime status, queue, cost and approval projection;
- deterministic node order and explanation reasons;
- hostile HTML escaping;
- deterministic static fallback.

Measured authority:

- `validation/reports/2026-07-19-living-surface-mvp.md`
- `memory/2026-07-19-0310-living-surface-mvp.md`

## Product thesis

```text
approved source truth
-> Hyper Content semantic compiler
-> autonomous generation and bounded repair
-> versioned semantic/runtime state
-> Hyper Site deterministic compiler
-> static HTML + living GenUI projections + task declarations
-> remote agent/browser adapters
-> approvals, receipts and field feedback
```

The conventional static framework is the reliability substrate. The living surface is now executable, but it has no live side effects.

## Active hypothesis order

```text
H0 integrated proof: PASS
-> H1 physical extraction: PASS
-> H2 autonomous semantic generation: NEXT CORE GATE
-> H3 self-aware GenUI: MVP SUBSTRATE PASS; live integration pending
-> H4 remote bounded agent/browser execution
-> H5 SDRT/GNN graph-intelligence comparisons
-> H6 GPU/Zig/Wasm accelerated-kernel comparisons
```

## Next implementation gate

```text
approved real source corpus
-> bounded provider proposal
-> independent evidence validation
-> accepted SiteSource + LivingSurfaceState
-> deterministic Hyper Site compilation
-> public/operator projection
-> external bounded action adapter
-> approval and receipt
```

Required constraints:

- generating model cannot approve its own output;
- public/private filtering occurs before rendering;
- actions do not directly own credentials or side effects;
- retries and repairs are bounded;
- rejected work is atomic;
- accepted work is resumable;
- provider/model/token/cost evidence is recorded.

## Active authorities

- `README.md`
- `CODEGRAPH.md`
- `docs/planning/50-h0-h1-content-first-reinvention-program.md`
- `validation/reports/2026-07-19-h0-h1-extraction-proof.md`
- `validation/reports/2026-07-19-living-surface-mvp.md`
- `memory/2026-07-19-0310-living-surface-mvp.md`

## Nonclaims

The MVP does not establish autonomous generation quality, remote task safety, live browser execution, PDE/CSG/WebGPU advantage, psychographic inference quality, SDRT/GNN advantage, GPU advantage, Zig/Wasm advantage, ranking, conversion or revenue.

PR #3 remains draft and unmerged.
