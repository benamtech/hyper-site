# Hyper Monorepo

Status: H0-H4 bounded MVP loop PASS  
Updated: 2026-07-19  
PR: #3 remains draft and unmerged

## What works now

```text
approved corpus
-> bounded semantic proposal
-> independent evidence validation
-> bounded repair or atomic rejection
-> accepted SiteSource + LivingSurfaceState
-> deterministic Hyper Site compilation
-> public/operator living surfaces
-> resumable accepted checkpoint
-> explicit approval
-> injected external action executor
-> immutable idempotent receipt
-> completed living-surface state
```

### Hyper Site

`@amtech/hyper-site` owns:

- deterministic `SiteSource -> PageIR -> static artifacts` compilation;
- evidence and reference rejection;
- HTML, metadata, JSON-LD, sitemap, dependency index and hashes;
- typed living-surface state;
- public/operator filtering before rendering;
- agency/governance decisions;
- accessible static living-surface HTML.

### Hyper Content

`@amtech/hyper-content` now owns package APIs for:

- approved semantic corpora;
- bounded provider proposals;
- independent claim/evidence validation;
- repair attempts and usage records;
- atomic acceptance or rejection;
- resumable accepted checkpoints;
- approved idempotent external actions;
- immutable receipts.

Package subpaths:

```ts
import { runSemanticGeneration } from "@amtech/hyper-content/semantic-generation";
import { executeApprovedSurfaceAction } from "@amtech/hyper-content/action-runtime";
```

## Measured result

Validated source commit:

```text
cf9e9553637ba1b8f6337735fca3fbc2255ffe30
```

Workflow run: `29679215879`  
Artifact: `h0-h1-proof-29679215879`

```text
H0 integration: PASS
H1 compiler/package extraction: PASS
H2 bounded semantic-generation MVP: PASS
H3 living-surface MVP: PASS
H4 approved idempotent-action MVP: PASS
```

Exact proof:

- Hyper Site tests: 8/8;
- Hyper Content tests: 4/4;
- legacy tests: 80/80;
- isolated Hyper Site tarball consumers: PASS;
- first unsupported proposal rejected: PASS;
- repaired proposal accepted: PASS;
- accepted checkpoint resumed without provider call: PASS;
- bounded rejection atomicity: PASS;
- public projection private-data exclusion: PASS;
- approval required before effect: PASS;
- effect executed once: PASS;
- identical replay returned the same receipt: PASS;
- completed state contains receipt: PASS;
- randomized 25-page compiler/rejection suite: PASS.

Measured authorities:

- `validation/reports/2026-07-19-h0-h1-extraction-proof.md`;
- `validation/reports/2026-07-19-living-surface-mvp.md`;
- `validation/reports/2026-07-19-semantic-action-loop-mvp.md`;
- `memory/2026-07-19-0410-semantic-action-loop-mvp.md`.

## Run the complete MVP

```bash
git clone --single-branch --branch agent/glm-blackwell-vertical-slice https://github.com/benamtech/hyper-site.git
cd hyper-site
npm --prefix hyper-site install
npm --prefix hyper-content install
npm --prefix reference install
npm run mvp:semantic-action
npm run proof:h0-h1
```

Generated artifacts:

```text
validation/reports/semantic-action-mvp/corpus.json
validation/reports/semantic-action-mvp/checkpoint.json
validation/reports/semantic-action-mvp/site-source.json
validation/reports/semantic-action-mvp/living-surface.json
validation/reports/semantic-action-mvp/site.html
validation/reports/semantic-action-mvp/public.html
validation/reports/semantic-action-mvp/operator-before.html
validation/reports/semantic-action-mvp/operator-after-state.json
validation/reports/semantic-action-mvp/receipt.json
validation/reports/semantic-action-mvp/report.json
```

## Product direction

```text
approved business truth
-> hosted provider proposal
-> independent semantic/evidence validator
-> accepted semantic/runtime state
-> deterministic site and GenUI projections
-> durable remote runtime
-> authorized connector execution
-> immutable receipt and field feedback
```

The ordinary static framework remains the reliability substrate, not the product ceiling.

## Next gate

Real provider and connector pilot:

1. durable transactional checkpoint and receipt storage;
2. GLM-compatible provider adapter with schema-constrained output;
3. one approved real business corpus;
4. tenant, actor and approval-epoch authorization;
5. one sandbox or shadow connector;
6. timeout, retry, duplicate-delivery and process-restart tests;
7. deterministic post-effect living surface and receipt.

## Nonclaims

The current provider and executor are deterministic fixtures. The MVP does not yet prove hosted-model quality, production connector safety, credential custody, multi-tenant authorization, durable leases, dead-letter handling, live browser execution, psychographic inference, PDE/CSG/WebGPU advantage, SDRT/GNN advantage or GPU/Zig/Wasm advantage.
