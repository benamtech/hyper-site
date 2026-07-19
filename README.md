# Hyper Monorepo

Status: H0 integration and H1 physical compiler extraction measured PASS; H2 is next  
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

The content-neutral compiler cluster is physically owned by `hyper-site/src`:

- `framework-core.ts`;
- `site-manifest.ts`;
- `browser-targets.ts`;
- `css-modern.ts`;
- aggregate typed entrypoint `index.ts`.

The matching `reference/src` files are compatibility consumers of built Hyper Site output.

## H0/H1 measured proof

Canonical command:

```bash
npm run proof:h0-h1
```

Measured source commit:

```text
af4774e0efc90f1890a977896ac41f87e1452744
```

Result:

```text
H0 integrated proof: PASS
H1 physical extraction: PASS
decision: advance-to-H2
```

Exact proof:

- monorepo/package/compatibility build: pass;
- legacy tests: 80/80;
- clean-room packed runtime consumer: pass;
- clean-room invalid-input consumer: pass;
- clean-room strict TypeScript consumer: pass;
- randomized 25-page compiler and rejection suite: pass;
- `reference/src` files classified: 59/59;
- missing/orphan/duplicate/incomplete ownership records: 0.

Measured authority:

- `validation/reports/2026-07-19-h0-h1-extraction-proof.md`;
- `memory/2026-07-19-0150-h0-h1-proof-closure.md`;
- workflow run `29675348346`;
- artifact `h0-h1-proof-29675348346`.

The generated machine reports remain:

- `validation/reports/h0-h1-proof.json`;
- `validation/reports/h0-h1-proof.md`;
- `validation/reports/h0-h1-compiler-limit/`.

A failed future proof produces `repair-gate-failures-only`. It does not authorize bypassing the compiler boundary.

## Product thesis

Hyper is not intended to stop at parity with a conventional static framework. The ordinary framework workflow is a reliability substrate, not the product ceiling.

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

Hyper Site remains the deterministic semantic and rendering oracle. It is not the complete product.

## Active hypothesis order

```text
H0 integrated proof: PASS
-> H1 physical compiler extraction: PASS
-> H2 autonomous semantic generation: NEXT
-> H3 self-aware multi-surface GenUI
-> H4 remote bounded agent/browser tasks
-> H5 SDRT/GNN graph-intelligence comparisons
-> H6 GPU/Zig/Wasm accelerated-kernel comparisons
```

H2-H6 are first-class end-state hypotheses. They may not bypass evidence validation, create a second semantic authority or acquire publication/credential authority by default.

## H2 next vertical slice

H2 must use one real approved source corpus and produce:

```text
source intake
-> approved evidence and fact ledger
-> bounded provider job
-> schema-constrained semantic proposal
-> independent semantic/evidence validation
-> bounded repair or reject
-> accepted portable SiteSource
-> deterministic Hyper Site compilation
-> resumable accepted-work ledger
```

Required proof:

- the generating model cannot approve its own output;
- every accepted claim traces to approved evidence;
- retries are bounded;
- accepted work is not regenerated after interruption;
- invalid output leaves no partially accepted `SiteSource`;
- provider/model/token/cost evidence is recorded;
- the accepted result compiles through the H1 package boundary.

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

H2 provider execution will additionally require an explicitly configured provider credential and approved source fixture. It does not automatically require local GPU inference.

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

- H0/H1 and content-first end-state program: `docs/planning/50-h0-h1-content-first-reinvention-program.md`
- measured H0/H1 report: `validation/reports/2026-07-19-h0-h1-extraction-proof.md`
- package architecture: `CODEGRAPH.md`
- operating contract: `AGENTS.md`
- documentation system: `docs/README.md`
- durable state: `memory/MEMORY.md`

## Nonclaims

H0/H1 do not prove autonomous generation, useful GenUI, remote task safety, graph-learning advantage, GPU advantage, Zig/Wasm advantage, ranking, conversion or revenue. Each requires its own frozen fixture, control, independent validator and measured promotion decision.
