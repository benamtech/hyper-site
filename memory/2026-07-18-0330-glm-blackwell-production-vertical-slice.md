# 2026-07-18 03:30 — GLM + Blackwell Production Vertical Slice

status: code, operator commands, focused production tests, and existing reference suite passed on pre-documentation head; real field run pending  
branch: `agent/glm-blackwell-vertical-slice`  
pr: `#3`

## session objective

Implement the missing end-to-end product boundary from a minimum rented compute appliance and GLM API connection through approved ontology/design, batched PageDraft generation, atomic PageIR/static output, local corpus validation, recovery, and synthetic 25/100/500/10K acceptance.

## implemented

implemented[11]{order,boundary,authority}:
  1,"Blackwell optimized target plus explicit H200/H100/A100/5090/4090 compatibility profiles",`reference/src/appliance-contract.ts`
  2,"Z.AI GLM chat-completions JSON transport with timeout and bounded repair",`reference/src/glm-provider.ts`
  3,"two physical model stages plus optional observation-only Stage 3",`reference/src/generation-schemas.ts`
  4,"external Stage-1 schema/source/evidence validation",`reference/src/generation-schemas.ts`
  5,"exact-hash independent ontology and design approval",`generation-schemas.ts`,`design-authoring.ts`,`production-approve.mjs`
  6,"core-page design briefs, safe CSS, shared static renderer, CSS-only refinement invariant",`reference/src/design-authoring.ts`
  7,"complete Stage-2 PageDraft batch contract",`reference/src/generation-schemas.ts`
  8,"atomic PageDraft -> PageConcept -> SiteSource -> PageIR -> static HTML transaction",`reference/src/page-draft-transaction.ts`
  9,"bounded exact/lexical/local-semantic/information/render corpus validator",`reference/src/corpus-validation-production.ts`
  10,"immutable dependency-bound Stage-1/Stage-2/transaction/corpus checkpoints",`reference/src/production-orchestrator.ts`
  11,"doctor, ingest, provider check, Stage 1, approvals, final run, static emission",`reference/scripts/production-*.mjs`

## design decision

The product must create a strong core site before large-batch landing pages and allow visual refinement afterward without regenerating accepted content.

invariants[7]:
  core-page-brief-before-bulk
  source-bound-style-authority
  no-design-self-approval
  one-shared-static-css-artifact
  no-remote-or-scriptable-custom-css
  canonical-content-hashes-survive-restyle
  design-cannot-change-publication-state

## provider decision

Z.AI JSON object mode is transport safety, not arbitrary server-side JSON Schema authority.

acceptance:
  "JSON parse + external TypeScript schema/semantic validator + source/evidence subset + bounded repair/reject"

model_default:
  `glm-5.2`

live_provider_run:
  not-run

## appliance decision

optimized:
  `rtx-pro-6000-blackwell-96gb`

host_floor:
  "128 GiB RAM; 100 GiB local NVMe; Linux x64; Node 22; CUDA 12.8"

compatibility_candidates[5]:
  h200-141gb
  h100-80gb
  a100-80gb
  rtx-5090-32gb
  rtx-4090-24gb

pricing:
  "time-sensitive observed metadata; soft validation only; never capability truth"

## proof

focused_run{workflow,run,head,result,artifact_digest}:
  "Hyper Site Production Pipeline",29635741933,5cfcc85fd6fe6910b9e4a2e366581e5514f08ffa,success,"sha256:28026bc9919e9e0bebfa7de6fb4d59cddec37dc8b1c255134b9f30d225e4d8a8"

focused_tests{passed,failed,total_ms}:
  10,0,32641.755

scale[3]{pages,elapsed_ms,candidates,html_bytes,transaction,corpus}:
  100,2489.626,3675,"recorded","3d0c6f811943dc24dffe129ccb41c309952aeab04ddd2ed2cf1199763a3f8039","980432af923ec2664743d87504309acb2e2c344d7e050e6a47b879118948321c"
  500,3142.146,509,"recorded","e5dd559de045d4639d3b0179e2d869fd4d85709dc244b5e9c86c888cebd637bc","a1d07e19bde93ef821de4dfff362ec689503e6eb664a166c05ae0d374c328fb9"
  10000,19179.290,12949,54291900,"481a1adc00ebc860f6f3c276c16978c7e28c3cfa62a39114d1bdb8e0cf013d72","67fe904020a2d0ca573790d135037515e200938ae4c7803c67e27a9ea47182b2"

reference_run:
  "same code/example head passed npm test, manifest, UI, orchestration, framework validate/preview, browser, and R3F"

## failures found and fixed

failures[5]{failure,fix}:
  "corpus evidence check inspected compiled dependency IDs instead of claim/object ledgers","resolve evidence through canonical SiteSource claim and information ledgers"
  "naive lexical-neighbor-per-page path could approach all-pairs on shared boilerplate","bounded rare postings + lexical bands + semantic sign-LSH + exact/sequential sentinels"
  "Stage-2 checkpoints omitted source/prior-batch dependencies","add source excerpt and prior accepted batch hashes"
  "transaction/corpus checkpoint payload hashes used semantic artifact hashes","separate payload integrity from transaction/corpus identities"
  "fixture embedding vectors collapsed because FNV parity depended on final suffix","use seeded xorshift nondegenerate fixture vectors; keep validator strict"

## nonclaims

not_proven[10]:
  real-business-repository-run
  live-glm-output-quality-or-cost
  real-gpu-throughput
  useful-or-insightful-pages
  factual-completeness
  real-human-design-quality
  held-out-relevance
  indexing-ranking-citations
  conversion-revenue-lifecycle-return
  gpu-hrr-ann-wasm-zig-advantage

## next run

next[8]{order,task,acceptance}:
  1,"rent a real target/compatibility node","doctor report with exact hardware/runtime/price observation"
  2,"capture one real repository","operator-approved config, style guide, assets, field evidence"
  3,"run live provider check and Stage 1","schema/source/evidence pass with token/latency record"
  4,"independent ontology and core-design approval","exact hashes and reviewer observations"
  5,"generate 25 real noindex pages","atomic transaction and persistent checkpoint recovery"
  6,"run local semantic/evidence/render/accessibility/crawler checks","no hard failures"
  7,"freeze human/held-out relevance judgments","independent acceptance corpus"
  8,"scale 100 -> 500 -> 10000","only after usefulness and lifecycle gates pass"
