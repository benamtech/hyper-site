# H0/H1 Integration and Extraction Proof

Status: measured validation report  
Source commit: `af4774e0efc90f1890a977896ac41f87e1452744`  
PR merge checkout: `4e2372b68d7eb849e80c430f954c0aef78a39d19`  
Workflow: Hyper Site H0-H1 Integration Pipeline  
Run: `29675348346`  
Artifact: `h0-h1-proof-29675348346`  
Environment: Ubuntu 24.04, Node `v22.23.1`, Linux x64

## Hypotheses

### H0 integrated proof

Claim: all current streams integrate and the clean-room proof executes.

Result: **PASS**.

### H1 physical extraction

Claim: the public compiler cluster is package-owned without accepted artifact or rejection drift and every remaining `reference/src` source has one explicit owner.

Result: **PASS**.

Decision: **advance-to-H2**.

## Structural proof

- PASS: `hyper-site/index.mjs` exports package-owned `./dist/index.js` and has no `reference` runtime import.
- PASS: the typed aggregate entrypoint exports framework core, site manifest, browser-target and CSS contracts.
- PASS: the compatibility wrappers under `reference/src` consume `hyper-site/dist`.
- PASS: framework core, site manifest, browser targets, CSS contracts and aggregate index are owned by `hyper-site/src`.
- PASS: both ownership inventories are marked complete.
- PASS: 59 current TypeScript and declaration sources under `reference/src` have 59 records.
- PASS: missing records = 0.
- PASS: orphan records = 0.
- PASS: duplicate records = 0.
- PASS: incomplete records = 0.

Ownership authorities:

- `validation/reference-source-inventory.json`
- `validation/reference-declaration-inventory.json`

## Executed commands

| Check | Result | Duration |
|---|---:|---:|
| `npm run build` | PASS | 5049.164 ms |
| `npm run legacy:test` | PASS | 32736.064 ms |
| `npm run test:packed-consumers` | PASS | 3052.779 ms |
| `npm run test:validation` | PASS | 295.346 ms |
| `node scripts/run-compiler-limit-test-v2.mjs --pages 25 --seed h0-h1-af4774e0efc9 --output validation/reports/h0-h1-compiler-limit` | PASS | 59.040 ms |

## Exact proof

### Build and authority

The monorepo build passed and reported:

```text
hyper-content -> hyper-site
reference -> hyper-site
neutral framework source: hyper-site/src/framework-core.ts
neutral manifest source: hyper-site/src/site-manifest.ts
public type authority: hyper-site/dist/index.d.ts
compatibility wrapper: reference/src/framework-core.ts
```

### Legacy compatibility

- tests: 80
- pass: 80
- fail: 0

The compatibility suite includes static HTML, modern CSS, optional poster-first 3D, vector identity, deterministic broad-vector hashing and selection comparisons. Passing these checks preserves historical behavior; it does not promote the experimental systems to production authority.

### Clean-room tarball consumption

The packed package was installed outside the monorepo into:

1. a valid JavaScript runtime consumer;
2. an invalid-input rejection consumer;
3. a strict TypeScript consumer.

The tarball contained package-owned `dist` output and no `reference/` runtime files. The runtime entrypoint had no import/export edge into `reference`.

### Randomized compiler run

The compiler generated 25 unique pages and passed deterministic artifact, dependency-index, instruction-projection, sitemap and hostile-text escaping checks.

The rejection matrix passed for:

- non-HTTPS base URL;
- duplicate evidence ID;
- duplicate route;
- empty canonical question;
- moduleless page;
- missing module;
- missing claim;
- missing evidence;
- under-supported claim;
- missing internal page.

## Repaired gate defects

The first exact-head H0/H1 run correctly failed and exposed:

1. two unclassified declaration files;
2. a clean-room test that rejected an explanatory comment containing the word `reference` rather than detecting an actual runtime import.

Repairs:

- classified `reference/src/core-packed-overload.d.ts` and `reference/src/node.d.ts`;
- changed the packed-consumer assertion to reject import/export edges into `reference`, not harmless prose comments;
- reran the full proof without weakening artifact, rejection or authority requirements.

## Nonclaims

This report does not prove:

- autonomous semantic generation quality;
- bounded repair quality;
- self-aware GenUI usefulness;
- remote agent or browser-task safety;
- SDRT or GNN advantage;
- GPU advantage;
- Zig or Wasm advantage;
- ranking, indexing, citations, conversion or revenue;
- production readiness of the complete software suite.

## Next gate

H2: autonomous semantic generation.

Required first vertical slice:

```text
approved business/source truth
-> bounded provider job
-> schema-constrained semantic proposal
-> independent compiler/evidence validation
-> bounded repair or rejection
-> portable SiteSource
-> deterministic Hyper Site compilation
```

H2 may use the existing GLM/provider, PCN, ArticleIR, transaction and production-orchestrator research code, but acceptance authority remains external to the generating model and the H1 package boundary remains immutable.
