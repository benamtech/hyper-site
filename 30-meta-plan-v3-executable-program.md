# 30 — META-PLAN-V3 Executable Separation, Shipping, and Revenue Program

Status: active program authority; implementation started at baseline `e3e85c291d465bf79037c8c3b5c16edefceaff6e`  
Branch: `agent/glm-blackwell-vertical-slice`  
PR: `#3`, draft, never merge on synthetic evidence alone  
Machine authority: `planning/meta-plan-v3.json`  
Validator: `scripts/check-meta-plan.mjs`

## 1. Program decision

The repository will remain one monorepo with two independently shippable products and one temporary compatibility bridge:

```text
hyper-content -> hyper-site
hyper-site -X-> hyper-content
```

The prior five-workstream model omitted a distinct commercial-validation authority and mixed governance with infrastructure. The executable program therefore uses seven workstreams:

| ID | Workstream | Authority |
|---|---|---|
| W0 | Program governance | plan DAG, TDD, evidence, maturity and release decisions |
| W1 | Hyper Site core | content-neutral static framework, PageIR, design and web output |
| W2 | Hyper Content | ontology, evidence, retrieval, providers, PCN, ArticleIR and content validation |
| W3 | Migration bridge | compatibility adapters and single-authority migration |
| W4 | Infrastructure | CI, publication, checkpoints, idempotency and security contracts |
| W5 | Research calibration | preregistered comparisons and advanced-method promotion gates |
| W6 | Field and revenue validation | client scope, acceptance, margin and claim substantiation |

This is a direct TODO program, not a forecast. A step is complete only when its named evidence exists and every pass metric is satisfied.

## 2. Corrections to the supplied meta-plan

### Accepted

- No technology is deleted merely because it is misplaced or unvalidated.
- Hyper Site and Hyper Content require different product, dependency, performance and revenue evidence.
- H200-class hardware is a content-studio concern, not a web-framework performance claim.
- A cheaper bulk-writing provider and a bounded independent reasoning/review path can be economically rational.
- Real client outcomes must precede calibration and scale claims.

### Corrected

1. **Five workstreams were insufficient.** Revenue validation is now W6, separate from research and implementation.
2. **A nominal memory sum is not a hardware acceptance test.** NVIDIA documents 141 GB HBM3e for H200, but model weights, quantization metadata, KV cache, runtime workspaces, batching and concurrent execution must be measured together.
3. **The BGE-M3 memory assumption was overstated.** The official model configuration is a 24-layer XLM-R architecture with 1024-dimensional output and 8192-token support. The current Hugging Face automated estimate is roughly 1.06 GB at fp16/bf16 for inference weights, not an accepted 6 GB constant. Runtime and batching overhead still require measurement.
4. **DeepSeek cost must be formula-based.** The current official V4 Flash output price is $0.28 per million tokens. That equals $0.00028 per 1,000 output tokens; a $0.0028 page assumes about 10,000 output tokens before retries, input, review and rejected generations.
5. **Exact Hugo/Astro/Eleventy timing claims remain prohibited.** Astro currently defaults to static output and its components add zero client JavaScript by default, but framework comparisons require one frozen fixture, machine, cache policy and repeated run protocol.
6. **Current Wasm remains Hyper Content research infrastructure.** Browser-runtime Wasm is a future, separate workload decision.
7. **The legacy mixed manifest is not renamed or deleted in place.** A neutral SiteManifest is introduced first; the existing manifest remains a compatibility surface until all consumers are enumerated and migrated.

Primary research anchors checked on 2026-07-18:

- NVIDIA H200 product and technical material: 141 GB HBM3e, 4.8 TB/s.
- BAAI/BGE-M3 model card and configuration: 1024 dimensions, 8192 sequence length, XLM-R configuration.
- DeepSeek API pricing: V4 Flash and V4 Pro current token pricing and concurrency.
- Astro official documentation: static output default, `dist/` build output, HTML-first components and zero JavaScript by default.

These sources validate product constraints, not this repository's performance or commercial claims.

## 3. Branch and workspace standard

The current integration branch remains the sole branch for this dependency-ordered extraction pass. Creating another stacked branch would add merge and CI ambiguity while `framework.ts` and `manifest.ts` are still shared authorities.

Short-lived branches become mandatory only when work can proceed independently, for example:

```text
agent/W2-provider-cohort
agent/W4-publisher-cloudflare
agent/W5-bge-heldout
```

Every such branch must rebase onto the integration branch, pass its step contract, and preserve the draft PR state. `main` is never edited directly.

## 4. Validation hierarchy

### Plan validation

The machine validator rejects:

- missing or duplicate workstreams, phases, steps, outcomes or hypotheses;
- dependency cycles or later-phase dependencies;
- implementation steps without tests, effects, rollback and measurable pass criteria;
- technologies marked removed under `zero_tech_killed`;
- missing revenue workstream or revenue outcome;
- a non-draft merge state before release gates pass.

### Step validation

Each step uses:

```text
RED: failing contract or characterization test
GREEN: step tests plus inherited regressions pass
REFACTOR: boundaries and behavior remain green after cleanup
EVIDENCE: CI transcript, artifact, field report or experiment report
DECISION: pass, repair, rollback or remain noncanonical
```

A test that merely asserts a function exists is insufficient when the step changes authority or behavior. Boundary steps require import/API assertions and artifact-parity tests.

### Plan outcome validation

The program has four plan outcomes:

1. independently shippable Hyper Site;
2. independently shippable Hyper Content;
3. positive-margin client delivery with documented value;
4. scientific integrity for advanced-method promotion and negative results.

All four must pass before a maturity promotion. A failed outcome preserves the code and research artifacts but blocks the product claim.

## 5. Phase graph

### P0 — Baseline and governance

- Freeze baseline SHA, PR state, existing CI artifacts and nonclaims.
- Install the machine-readable plan and validator.
- Establish contribution, branch, TDD and evidence standards.

Exit: plan validator green; draft PR preserved.

### P1 — Dependency decomposition

- Extract a content-neutral framework compiler from vector packing.
- Introduce neutral SiteManifest.
- Build explicit Hyper Content adapter.
- Move clean source to `hyper-site/src` only after parity.
- Move vector packing and current Wasm ownership fully behind Hyper Content.

Exit: Hyper Site imports no benchmark, ontology, vector, provider, content manifest or current Wasm modules; legacy web artifact parity is exact.

### P2 — Hyper Site independent ship

- One-command scaffold.
- Real five-page fixture.
- Development server, watch invalidation and preview.
- At least one dry-run-capable static publisher.
- Frozen comparison with an ordinary framework over identical content and routes.

Exit: clean-room create/build/preview/deploy path and 20 repeated successful builds.

### P3 — Hyper Content independent ship

- Real PCN -> provider -> ArticleIR -> unfolder -> Hyper Site pass.
- Five accepted pages, then 25 noindex pages.
- Independent held-out review.
- Checkpoint, idempotency, failure injection and deterministic republish proof.

Exit: 25 accepted noindex pages, zero unsupported claims, zero critical findings, complete recovery matrix.

### P4 — First client and revenue

- Bounded paid or contractually committed pilot.
- Pre-delivery baseline.
- Client acceptance, labor, provider, review and hosting cost ledger.
- Positive gross margin and 30-day critical-defect check.
- Sales claims limited to evidence actually observed.

Exit: one accepted delivery, positive gross margin, documented client-value metric.

### P5 — Scale and calibration

- At least 100 independent labeled outcomes.
- Frozen train/calibration/held-out split.
- Isotonic, BM25, graph, HRR, BGE-M3 and provider comparisons.
- Wasm/native and GPU configurations measured end to end.
- Promote, demote or retain as research according to preregistered thresholds.

Exit: every advanced method has a positive or negative experiment record; no method becomes canonical from nominal specifications or microbenchmarks.

## 6. Current implementation slice

This pass implements P0.2, P1.1 and the first half of P1.2:

- machine-readable plan and validator;
- branch/TDD workspace standard;
- content-neutral `framework-core.ts`;
- legacy `framework.ts` converted into a compatibility adapter that adds vector prototypes and packed IR after neutral compilation;
- neutral `site-manifest.ts`;
- Hyper Site facade switched to neutral compiler and manifest;
- Hyper Content explicitly retains the content-aware compile adapter;
- parity, determinism and no-leak tests;
- CI gates for the plan and extraction.

This does not complete physical migration to `hyper-site/src`, a dev server, publisher, provider cohort, client delivery or research calibration.

## 7. Pass/fail authority for this slice

Pass only when all are true:

- plan validator returns zero errors;
- neutral framework source contains no imports from benchmark, core vector math, mixed manifest, ontology, providers or Wasm;
- Hyper Site compile output has no `packed` field;
- legacy adapter HTML, sitemap, instruction projection and page artifact hashes equal neutral core output;
- legacy packed IR and full regression suites remain green;
- SiteManifest contains no vector, profile, agent harness, coverage or provider fields;
- both GitHub workflows pass on the exact branch head;
- PR remains draft and unmerged.

Fail and rollback the extraction if any unapproved web artifact changes, reverse dependency appears, or legacy tests regress.
