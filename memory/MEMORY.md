# Hyper Monorepo Durable Memory

status: active  
updated_at: 2026-07-19T01:35:00-04:00

## State

branch: agent/glm-blackwell-vertical-slice  
pr: 3  
draft: true  
merged: false  
maturity: package-owned compiler extraction implemented; exact-head H0/H1 proof required

## Active boundary

```text
Hyper Content -> portable semantic state -> Hyper Site
reference -> Hyper Site compatibility surface
Hyper Site -X-> Hyper Content
Hyper Site -X-> reference runtime
```

## Physical truth

- `hyper-site/src` now owns `framework-core.ts`, `site-manifest.ts`, `browser-targets.ts`, `css-modern.ts` and the aggregate typed entrypoint.
- `hyper-site/index.mjs` exports `hyper-site/dist/index.js`.
- `hyper-site/package.json` is packable and exposes package-owned runtime and declaration files.
- matching `reference/src` modules are compatibility re-exports from built Hyper Site output.
- most Hyper Content, generation, ontology, graph and experimental source remains under `reference/src` and still requires later ownership classification.

## H0/H1 proof

Canonical command:

```bash
npm run proof:h0-h1
```

The proof runs complete builds, legacy tests, clean-room runtime/rejection/TypeScript tarball consumers, validation tests and a bounded randomized compiler test. It writes exact-commit reports under `validation/reports/`.

H0 passes only when all current streams integrate and the clean-room proof runs.

H1 passes only when the public compiler cluster is package-owned and existing accepted artifacts, ordering, hashes and rejection behavior remain coherent.

## Product thesis

The conventional static framework floor is a validation substrate, not the product ceiling.

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
H0 integrated proof
-> H1 physical extraction
-> H2 autonomous semantic generation
-> H3 self-aware GenUI
-> H4 remote bounded agent/browser execution
-> H5 SDRT/GNN graph-intelligence comparisons
-> H6 GPU/Zig/Wasm accelerated-kernel comparisons
```

H2-H6 are active end-state hypotheses, not permanently deferred work. They may begin bounded research fixtures after H1 but cannot bypass the compiler or become a second semantic authority.

## Next gate

Repair only exact-head H0/H1 failures. On green, begin H2 with one approved real business repository, five complete pages and a 25-page noindex cohort.

## Active authorities

- `README.md`
- `AGENTS.md`
- `CODEGRAPH.md`
- `docs/README.md`
- `docs/planning/50-h0-h1-content-first-reinvention-program.md`
- `memory/2026-07-19-0135-h0-h1-extraction-content-first-reset.md`

## Nonclaims

No autonomous generation quality, GenUI usefulness, remote task safety, SDRT/GNN advantage, GPU advantage, Zig/Wasm advantage, ranking, conversion, revenue or production readiness is established by H0/H1.

PR #3 stays draft until measured gates and review justify otherwise.
