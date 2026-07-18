# GLM + Blackwell Production Vertical Slice Validation

Status: source-wired and synthetic acceptance passed; real provider, hardware, repository, and field acceptance pending  
Date: 2026-07-18  
Branch: `agent/glm-blackwell-vertical-slice`  
PR: `#3`

## Scope

This pass implemented and validated the first complete software vertical slice from explicit repository truth to a deployable noindex static corpus:

```text
repository capture
-> ProjectInput
-> GLM Stage-1 proposal contract
-> independent exact-hash approval
-> existing ontology/graph/opportunity compiler
-> approved core-site design authority
-> GLM Stage-2 PageDraft batch contract
-> bounded external repair/reject
-> existing PageConcept compiler
-> atomic SiteSource/PageIR transaction
-> shared static design renderer
-> bounded local corpus validation
-> static site + reports + persistent checkpoints
```

## Implemented authorities

| Feature | Authority |
|---|---|
| optimized and compatibility hardware profiles | `reference/src/appliance-contract.ts` |
| Z.AI GLM JSON transport | `reference/src/glm-provider.ts` |
| Stage-1, Stage-2, optional Stage-3 schemas | `reference/src/generation-schemas.ts` |
| ontology and design approvals | `generation-schemas.ts`, `design-authoring.ts`, `production-approve.mjs` |
| core-site design and CSS-only refinement | `reference/src/design-authoring.ts` |
| PageDraft transaction | `reference/src/page-draft-transaction.ts` |
| bounded corpus validator | `reference/src/corpus-validation-production.ts` |
| recovery and physical orchestration | `reference/src/production-orchestrator.ts` |
| operator commands and static emitter | `reference/scripts/production-*.mjs` |
| focused CI | `.github/workflows/production-pipeline.yml` |

## Hardware disposition

Optimized target:

```text
RTX PRO 6000 Blackwell 96 GB
128 GiB host RAM
100 GiB free local NVMe
CUDA 12.8+
Node 22+
Linux x64
```

Compatibility candidates:

```text
H200 141 GB
H100 80 GB
A100 80 GB
RTX 5090 32 GB
RTX 4090 24 GB
```

Compatibility candidate means the profile can be diagnosed and tested. It is not a claim of equivalent throughput, supported local model size, reliability, or economics.

Observed rental prices from user research and current provider pages ranged below and above the original $2.50-$4.00 target. Price remains soft metadata because marketplace inventory, region, reliability, storage, and host configuration vary. No cloud provider price is embedded as immutable capability truth.

## Provider disposition

The adapter uses Z.AI's OpenAI-style chat-completions endpoint and JSON object response mode. Arbitrary server-enforced JSON Schema is not assumed. Acceptance requires:

```text
valid JSON object
+ external TypeScript validator
+ source/evidence subset checks
+ exact job identity
+ bounded repair budget
```

The default model string is `glm-5.2`, but it is configurable. No live provider request was executed in this validation environment.

## Physical model topology

```text
Stage 1: one bounded ontology proposal request per project
Stage 2: deterministic PageDraft batches
Stage 3: optional independent review or targeted repair observations
```

The same model cannot approve its own ontology or design. Stage 3 cannot override compiler acceptance.

## Design validation

Validation vectors:

```text
design.provenance
  pass: versioned source IDs and stable draft hash
  fail: anonymous or source-free design

design.approval
  pass: different reviewer approves exact draft hash
  fail: self-approval, stale hash, rejected decision

design.tokens
  pass: valid palette/type/component capabilities and bounded CSS
  fail: missing tokens or unsupported modules

design.core-pages
  pass: at least one reviewed core-page brief
  fail: bulk corpus before core-site design

design.css-safety
  pass: local bounded static CSS
  fail: @import, remote URLs, javascript URLs, HTML/script escape, oversized CSS

design-render.static
  pass: one shared CSS file over canonical PageIR
  fail: runtime-only content or per-page CSS generation
```

A post-generation design refinement test changed the palette/CSS hash while preserving every canonical page-content hash.

## Transaction and recovery validation

Validation vectors:

```text
transaction.coverage
  pass: every planned job accepted exactly once
  fail: missing, duplicate, or rejected PageDraft

transaction.evidence
  pass: claims and information objects resolve through evidence ledgers
  fail: unknown or insufficient evidence

transaction.atomic
  pass: all drafts validate before one immutable SiteSource/PageIR build
  fail: partial mutation or order-dependent output

transaction.noindex
  pass: every generated page remains noindex and indexable sitemap is empty
  fail: model or renderer changes publication state

production.recovery
  pass: dependency-identical Stage-2 checkpoints are reused
  fail: accepted work regenerated, stale dependency reused, or checkpoint overwritten
```

Checkpoint dependencies include sources, prior accepted batches, project, ontology, plan, batch, design, provider, base URL, embedding backend, and validation policy as applicable. Checkpoint payload hashes are distinct from semantic artifact hashes.

## Corpus validator

The production validator avoids a dense all-pairs matrix:

```text
exact normalized-content sentinel
+ sequential safety candidates
+ bounded rare-posting candidates
+ lexical MinHash-style bands
+ local embedding sign-LSH candidates
-> exact TF-IDF cosine and embedding cosine on bounded pairs only
```

It also validates information-object/evidence floors and static HTML/canonical/robots/internal-route integrity.

The local embedding backend is OpenAI-compatible and intended to run on the rented node. Synthetic tests use a deterministic nondegenerate fixture backend, not a quality model.

## Exact measured proof

Focused workflow:

```text
name: Hyper Site Production Pipeline
run: 29635741933
head: 5cfcc85fd6fe6910b9e4a2e366581e5514f08ffa
artifact digest: sha256:28026bc9919e9e0bebfa7de6fb4d59cddec37dc8b1c255134b9f30d225e4d8a8
result: success
```

Tests:

```text
10 passed
0 failed
32,641.755 ms total
```

Scale fixtures:

| Pages | Elapsed | Bounded pairs | Rendered HTML | Transaction hash | Corpus hash |
|---:|---:|---:|---:|---|---|
| 100 | 2,489.626 ms | 3,675 | recorded | `3d0c6f811943dc24dffe129ccb41c309952aeab04ddd2ed2cf1199763a3f8039` | `980432af923ec2664743d87504309acb2e2c344d7e050e6a47b879118948321c` |
| 500 | 3,142.146 ms | 509 | recorded | `e5dd559de045d4639d3b0179e2d869fd4d85709dc244b5e9c86c888cebd637bc` | `a1d07e19bde93ef821de4dfff362ec689503e6eb664a166c05ae0d374c328fb9` |
| 10,000 | 19,179.290 ms | 12,949 | 54,291,900 bytes | `481a1adc00ebc860f6f3c276c16978c7e28c3cfa62a39114d1bdb8e0cf013d72` | `67fe904020a2d0ca573790d135037515e200938ae4c7803c67e27a9ea47182b2` |

Covered assertions:

```text
optimized vs compatibility appliance classification
JSON mode + external bounded repair
Stage-1 exact identity and checkpoint resume
independent ontology approval
core-site design authority and unsafe CSS rejection
25-page atomic/noindex/static transaction
order-invariant transaction hash
unsupported evidence rejection
CSS-only refinement preserving content hashes
near-duplicate corpus rejection
three Stage-2 batches resumed without provider re-invocation
same full transaction at 100, 500, and 10,000 synthetic pages
```

Existing reference workflow on the same code/example head passed npm tests, manifest emission, UI emission, orchestration, framework validation/preview, browser targets, and R3F build.

## Explicit nonclaims

This report does not establish:

```text
real repository completion
live GLM-5.2 reliability, latency, token use, or price
real Blackwell/A100/H100/H200/5090/4090 performance
real page relevance or information gain
factual completeness
human-perceived design quality
accessibility with real generated copy and assets
indexing, ranking, citations, conversion, revenue, or lifecycle return
10,000 pages that deserve publication
GPU, HRR, ANN, Wasm, or Zig advantage
```

## Remaining gate

```text
1. Rent and probe a real target or compatibility node.
2. Capture one operator-approved business repository.
3. Run the live GLM provider check and Stage 1.
4. Independently approve ontology and core design.
5. Generate 25 real noindex pages.
6. Run local semantic, evidence, browser, crawler, accessibility, and human review.
7. Freeze held-out relevance judgments.
8. Scale to 100 and 500 only if real gates pass.
9. Consider 10,000 only after usefulness and lifecycle-cost evidence.
```
