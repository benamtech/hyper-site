# Hyper Monorepo Durable Memory

status: active  
updated_at: 2026-07-19T01:50:00-04:00

## State

branch: agent/glm-blackwell-vertical-slice  
pr: 3  
draft: true  
merged: false  
maturity: H0 integration and H1 physical compiler extraction measured PASS; H2 autonomous semantic generation is next

## Active boundary

```text
Hyper Content -> portable semantic state -> Hyper Site
reference -> Hyper Site compatibility surface
Hyper Site -X-> Hyper Content
Hyper Site -X-> reference runtime
```

## H0/H1 measured truth

Validated source commit: `af4774e0efc90f1890a977896ac41f87e1452744`  
Workflow run: `29675348346`  
Artifact: `h0-h1-proof-29675348346`

```text
H0 integrated proof: PASS
H1 physical extraction: PASS
decision: advance-to-H2
```

Measured authority:

- `validation/reports/2026-07-19-h0-h1-extraction-proof.md`
- `memory/2026-07-19-0150-h0-h1-proof-closure.md`

## Physical truth

- `hyper-site/src` owns `framework-core.ts`, `site-manifest.ts`, `browser-targets.ts`, `css-modern.ts` and the aggregate typed entrypoint.
- `hyper-site/index.mjs` exports `hyper-site/dist/index.js`.
- `hyper-site/package.json` is public/packable and exposes package-owned runtime and declaration files.
- matching `reference/src` modules are compatibility consumers of built Hyper Site output.
- clean-room runtime, invalid-input and strict TypeScript tarball consumers pass.
- legacy compatibility tests pass 80/80.
- the randomized 25-page compiler and rejection suite passes.
- 59 current `reference/src` TypeScript/declaration files have 59 ownership records with zero missing, orphan, duplicate or incomplete records.

Ownership authorities:

- `validation/reference-source-inventory.json`
- `validation/reference-declaration-inventory.json`

## Product thesis

The conventional static framework floor is a proven reliability substrate, not the product ceiling.

Intended system:

```text
approved source truth
-> Hyper Content semantic compiler
-> autonomous generation and bounded repair
-> versioned semantic state
-> Hyper Site deterministic compiler
-> static HTML + GenUI + task declarations
-> remote agent/browser adapters
-> receipts and field feedback
```

## Active hypothesis order

```text
H0 integrated proof: PASS
-> H1 physical extraction: PASS
-> H2 autonomous semantic generation: NEXT
-> H3 self-aware GenUI
-> H4 remote bounded agent/browser execution
-> H5 SDRT/GNN graph-intelligence comparisons
-> H6 GPU/Zig/Wasm accelerated-kernel comparisons
```

H2-H6 are active end-state hypotheses, not permanently deferred work. They cannot bypass evidence/compiler validation, create a second semantic authority, or silently own credentials/publication.

## Next gate: H2

Implement one real autonomous semantic-generation vertical slice:

```text
one approved real source corpus
-> one bounded GLM/provider job
-> one schema-constrained semantic proposal
-> independent semantic/evidence validation
-> bounded repair or reject
-> accepted portable SiteSource
-> deterministic Hyper Site compilation
```

Required proof:

- generating model does not approve its own output;
- all accepted claims bind to approved evidence;
- retries are bounded and resumable;
- accepted work is not regenerated after interruption;
- rejection is atomic;
- provider/model/token/cost evidence is recorded;
- output compiles through the H1 package boundary.

## Active authorities

- `README.md`
- `AGENTS.md`
- `CODEGRAPH.md`
- `docs/README.md`
- `docs/planning/50-h0-h1-content-first-reinvention-program.md`
- `validation/reports/2026-07-19-h0-h1-extraction-proof.md`
- `memory/2026-07-19-0150-h0-h1-proof-closure.md`

## Nonclaims

H0/H1 do not establish autonomous generation quality, GenUI usefulness, remote task safety, SDRT/GNN advantage, GPU advantage, Zig/Wasm advantage, ranking, conversion, revenue or complete-suite production readiness.

PR #3 remains draft until H2 evidence and review justify a new status.
