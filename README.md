# Hyper Monorepo

Status: H0/H1 implementation under exact-head CI  
Updated: 2026-07-19  
PR: #3 remains draft and unmerged

## What works now

The package-owned Hyper Site compiler can:

- validate structured `SiteSource` input;
- reject missing references and under-supported claims;
- construct `PageIR`;
- emit semantic HTML, metadata, JSON-LD, sitemap and optional instruction Markdown;
- generate a reverse dependency index;
- compute deterministic page and build hashes.

Current public execution path:

```text
consumer
-> @amtech/hyper-site
-> hyper-site/index.mjs
-> hyper-site/dist/index.js
-> compileSite(SiteSource)
```

The content-neutral compiler cluster is now physically owned by `hyper-site/src`:

- `framework-core.ts`;
- `site-manifest.ts`;
- `browser-targets.ts`;
- `css-modern.ts`;
- aggregate typed entrypoint `index.ts`.

The matching `reference/src` files are compatibility re-exports that consume the built Hyper Site package output.

## H0/H1 proof

Run:

```bash
npm run proof:h0-h1
```

The proof executes:

- complete package and compatibility builds;
- legacy positive and negative tests;
- clean-room `npm pack` consumers;
- a clean-room TypeScript declaration consumer;
- validation tests;
- a 25-page randomized compiler-limit run;
- structural checks proving the public entrypoint does not reach `reference/`.

Measured outputs:

- `validation/reports/h0-h1-proof.json`;
- `validation/reports/h0-h1-proof.md`;
- `validation/reports/h0-h1-compiler-limit/`.

A failed proof produces `repair-gate-failures-only`. It does not authorize additional feature work.

## Product thesis

Hyper is not intended to stop at parity with a conventional static framework. The ordinary framework workflow is a minimum validation substrate.

The intended suite is:

```text
approved source truth
-> Hyper Content semantic compiler
-> evidence, claims, page existence and design intent
-> autonomous generation and bounded repair
-> versioned portable semantic state
-> Hyper Site deterministic compiler
-> static HTML, GenUI projections and task declarations
-> remote agent/browser adapters
-> receipts and field feedback
```

Hyper Site remains the deterministic semantic and rendering oracle. It is not the product ceiling.

## Active hypothesis order

```text
H0 integrated proof
-> H1 physical compiler extraction
-> H2 autonomous semantic generation
-> H3 self-aware multi-surface GenUI
-> H4 remote bounded agent/browser tasks
-> H5 SDRT/GNN graph-intelligence comparisons
-> H6 GPU/Zig/Wasm accelerated-kernel comparisons
```

H2-H6 are first-class end-state hypotheses. They may begin bounded research fixtures after H1, but they may not bypass evidence validation, create a second semantic authority or acquire publication/credential authority by default.

## Immediate next proof after H1

H2 must use one real approved business repository and produce:

```text
source intake
-> evidence and fact ledger
-> bounded model proposal
-> independent approval
-> portable SiteSource
-> five complete static pages
-> 25 noindex generated pages
-> deterministic compiler and browser validation
-> resumable accepted-work ledger
```

Same-model self-acceptance is prohibited.

## Advanced tracks

### Autonomous generation

Provider-backed workers propose structured semantic state. Deterministic compilers and independent reviewers accept, repair or reject it.

### Self-aware GenUI

Semantic state describes information purpose, user task, evidence, design constraints and component capabilities. Multiple UI projections consume that state while retaining a deterministic static fallback.

### Remote agent and browser execution

Public task declarations are consumed by an external runtime that owns durable state, approvals, credentials, idempotency and receipts.

### SDRT and GNNs

They are comparison arms for relationship reasoning, internal linking, task-state representation and repair prioritization. They must beat explicit typed edges, co-occurrence, shared evidence, route hierarchy and lexical controls on held-out judgments.

### GPU, Zig and Wasm

They are active substrate hypotheses for pure bounded kernels and sandboxed transforms. They may not own business truth, evidence approval, policy, credentials, publication or irreversible effects.

## Local dependencies

Current H0/H1 testing requires:

- Git;
- Node.js 20 or newer;
- npm;
- Bash and ordinary Unix tools;
- curl only for live download scripts;
- pacman only for the optional Manjaro installer.

No Python, Docker, database, GPU, LLM key, Zig compiler or Wasm runtime is required for H0/H1.

## Test the current branch

Manjaro/Arch:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/benamtech/hyper-site/agent/glm-blackwell-vertical-slice/scripts/manjaro-clone-and-test-hyper.sh)
```

Generic Unix-like:

```bash
curl -fsSL https://raw.githubusercontent.com/benamtech/hyper-site/agent/glm-blackwell-vertical-slice/scripts/clone-and-test-hyper.sh | bash
```

## Local commands

```bash
npm --prefix hyper-site install
npm --prefix hyper-content install
npm --prefix reference install
npm run proof:h0-h1
npm run build
npm test
npm run test:packed-consumers
npm run test:compiler-limit
node scripts/check-doc-system.mjs
```

## Current authorities

- H0/H1 and end-state program: `docs/planning/50-h0-h1-content-first-reinvention-program.md`
- package architecture: `CODEGRAPH.md`
- operating contract: `AGENTS.md`
- documentation system: `docs/README.md`
- durable state: `memory/MEMORY.md`

## Nonclaims

H0/H1 do not prove autonomous generation, useful GenUI, remote task safety, graph-learning advantage, GPU advantage, Zig/Wasm advantage, ranking, conversion or revenue. Each requires its own frozen fixture, control, independent validator and measured promotion decision.
