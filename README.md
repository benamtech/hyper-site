# Hyper Monorepo

Status: H0/H1 PASS; living-surface MVP PASS; H2 autonomous semantic generation is next  
Updated: 2026-07-19  
PR: #3 remains draft and unmerged

## What works now

### Deterministic site compiler

The package-owned `@amtech/hyper-site` compiler can:

- validate structured `SiteSource` input;
- reject missing references and under-supported claims;
- construct `PageIR`;
- emit semantic HTML, metadata, JSON-LD, sitemap and optional instruction Markdown;
- generate a reverse dependency index;
- compute deterministic page and build hashes.

Current path:

```text
consumer
-> @amtech/hyper-site
-> hyper-site/index.mjs
-> hyper-site/dist/index.js
```

### Living AI employee surface MVP

`@amtech/hyper-site` now also exports a package-owned living-surface runtime:

```text
LivingSurfaceState
-> validation
-> public/operator permission projection
-> agency and governance resolution
-> deterministic decision ledger
-> accessible static HTML
-> state, HTML and build hashes
```

Implemented MVP behavior:

- nine interface-field channels: visibility, scale, curvature, density, governance, agency, relevance, valence and urgency;
- public, operator and shared data visibility enforced before rendering;
- user, agent and mixed action authority;
- risk thresholds that convert available consequential actions to `approval-required`;
- user-control agency continuum and blend-radius calculation;
- logistic approval-boundary curvature;
- runtime health, queue, cost and approval projection;
- deterministic ordering with human-readable reasons;
- hostile HTML escaping;
- static public and operator fallback artifacts.

The continuous field is currently a deterministic presentation/governance model. PDE evolution, CSG composition and WebGPU are optional future renderers, not semantic authorities.

## Measured proofs

### H0/H1 extraction

```bash
npm run proof:h0-h1
```

Measured authority:

- `validation/reports/2026-07-19-h0-h1-extraction-proof.md`;
- `memory/2026-07-19-0150-h0-h1-proof-closure.md`.

Result:

```text
H0 integrated proof: PASS
H1 physical extraction: PASS
```

### Living-surface MVP

```bash
npm run mvp:living-surface
npm run proof:h0-h1
```

Measured source commit:

```text
f5734533da137f1f28509d495f7fc67a187495ad
```

Workflow run: `29677235149`  
Artifact: `h0-h1-proof-29677235149`

Result:

```text
Hyper Site package tests: 8/8
legacy compatibility tests: 80/80
clean-room runtime consumer: PASS
clean-room strict TypeScript consumer: PASS
public/private projection checks: PASS
approval gate checks: PASS
deterministic demo artifacts: PASS
```

Measured authority:

- `validation/reports/2026-07-19-living-surface-mvp.md`;
- `memory/2026-07-19-0310-living-surface-mvp.md`.

Generated local demo artifacts:

```text
validation/reports/living-surface-mvp/public.html
validation/reports/living-surface-mvp/operator.html
validation/reports/living-surface-mvp/public-projection.json
validation/reports/living-surface-mvp/operator-projection.json
validation/reports/living-surface-mvp/report.json
```

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

The ordinary static framework is the reliability substrate, not the product ceiling.

## Active hypothesis order

```text
H0 integrated proof: PASS
-> H1 physical extraction: PASS
-> H2 autonomous semantic generation: NEXT CORE GATE
-> H3 self-aware GenUI: MVP SUBSTRATE PASS; live integration pending
-> H4 remote bounded agent/browser tasks
-> H5 SDRT/GNN graph-intelligence comparisons
-> H6 GPU/Zig/Wasm accelerated-kernel comparisons
```

H2-H6 may not bypass evidence validation, create a second semantic authority or silently own credentials/publication.

## Next vertical slice

```text
approved real source corpus
-> bounded provider proposal
-> independent evidence validation
-> accepted SiteSource + LivingSurfaceState
-> deterministic site and public/operator projections
-> bounded external action adapter
-> explicit approval
-> immutable receipt
```

Required proof:

- generating model cannot approve its own output;
- accepted claims trace to approved evidence;
- public/private filtering happens before rendering;
- retries and repairs are bounded;
- invalid work leaves no partially accepted state;
- accepted work resumes without regeneration;
- provider/model/token/cost evidence is recorded;
- effects remain external, approved and receipt-bound.

## Package use

```ts
import {
  compileSite,
  compileLivingSurface,
  type SiteSource,
  type LivingSurfaceState,
} from "@amtech/hyper-site";
```

Explicit living-surface subpath:

```ts
import { compileLivingSurface } from "@amtech/hyper-site/living-surface";
```

## Local dependencies

Current compilation and MVP testing require:

- Git;
- Node.js 20 or newer;
- npm;
- Bash and ordinary Unix tools;
- curl only for live download scripts.

No Python, Docker, database, GPU, LLM key, Zig compiler or Wasm runtime is required for the current MVP.

## Test the branch

```bash
git clone --single-branch --branch agent/glm-blackwell-vertical-slice https://github.com/benamtech/hyper-site.git
cd hyper-site
npm --prefix hyper-site install
npm --prefix hyper-content install
npm --prefix reference install
npm run proof:h0-h1
npm run mvp:living-surface
```

## Current authorities

- package and product state: `README.md`;
- package architecture: `CODEGRAPH.md`;
- H0/H1 program: `docs/planning/50-h0-h1-content-first-reinvention-program.md`;
- living-surface proof: `validation/reports/2026-07-19-living-surface-mvp.md`;
- durable state: `memory/MEMORY.md`.

## Nonclaims

The current MVP does not prove autonomous semantic generation, remote task safety, live browser execution, psychographic inference quality, PDE/CSG/WebGPU advantage, SDRT/GNN advantage, GPU advantage, Zig/Wasm advantage, ranking, conversion or revenue.

## Documentation system

Documentation lifecycle and machine-readable authority are in `docs/README.md` and `docs/catalog.json`.
