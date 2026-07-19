# Four-Part Product Workstream Map

Status: active execution authority  
Updated: 2026-07-18

## Order

```text
W1 physical package extraction
-> W2 standalone five-page static proof
-> W3 measured maintenance proof
-> W4 optional local task proof
```

The repository is currently in W1. Later workstreams may be researched, but they cannot become implementation priorities or introduce dependencies before their entry gates pass.

## Immediate next slice

```text
inventory every reference/src file
-> assign one owner and role
-> extract the neutral compiler cluster into hyper-site/src
-> switch the public entrypoint to package-owned output
-> make reference consume Hyper Site
-> rerun the verified one-page fixture with byte/hash parity
```

Do not begin the five-page fixture until this slice is green.

# W1: Physical package extraction

Objective: make `hyper-site/` and `hyper-content/` own canonical source and reduce `reference/` to compatibility, fixtures, examples, and benchmarks.

### W1A ownership inventory

Classify every `reference/src` file as exactly one of:

- Hyper Site stable source;
- Hyper Content stable source;
- experimental source;
- compatibility adapter;
- fixture/example support;
- benchmark support;
- obsolete or rejected.

Record dependencies, exports, tests, artifacts, and migration order.

Gate:

```text
unclassified_reference_source_files == 0
multiply_owned_source_files == 0
unknown_public_exports == 0
```

### W1B Hyper Site compiler extraction

Move the neutral compiler cluster first:

- framework core;
- SiteSource and PageIR contracts;
- source validation;
- neutral HTML rendering;
- sitemap rendering;
- instruction projection;
- dependency indexing;
- hashing;
- content-neutral manifest adaptation.

Then compile from `hyper-site/src`, switch `hyper-site/index.mjs` to package-owned output, make `reference/` consume it, and prohibit runtime imports from Hyper Site into `reference/`.

Rerun the verified one-page fixture and preserve HTML, Markdown, sitemap, dependency index, rejection behavior, page hash, and build hash unless a separately approved change is intentional.

Gate:

```text
hyper_site_compiler_owned_source == true
hyper_site_reference_runtime_imports == 0
canonical_compiler_implementations == 1
verified_fixture_public_entrypoint == package_owned_output
verified_fixture_page_hash_matches == true
verified_fixture_build_hash_matches == true
negative_evidence_test_pass == true
```

### W1C Hyper Content extraction

After W1B, move coherent content clusters in dependency order. Stable exports must be explicit. Ontology, vector, Wasm, GPU, and acceleration work remains separate and experimental.

Gate:

```text
hyper_content_reference_runtime_imports == 0
canonical_content_adapter_implementations == 1
stable_exports_are_explicit == true
experimental_exports_are_separate == true
```

### W1D independent consumption

Create clean packed-package consumers:

- Hyper Site-only consumer;
- Hyper Content-to-Hyper Site consumer.

W1 exit gate:

```text
unclassified_reference_source_files == 0
hyper_site_reference_runtime_imports == 0
hyper_content_reference_runtime_imports == 0
tarball_consumers_pass == 2
legacy_artifact_parity_failures == 0
reference_is_product_runtime_authority == false
```

# W2: Standalone five-page static proof

Entry: W1 passes.

Objective: prove Hyper Site works as a small static framework without Hyper Content or repository-internal imports.

Build five distinct service-business pages: home, service, process, proof/about, and contact/next step.

Required surface:

- initialization path;
- `dev`, `build`, `preview`, and `inspect`;
- one static theme;
- filesystem output;
- deterministic hashes;
- sitemap and declared instruction artifacts;
- clear validation failures.

Freeze an equivalent minimal implementation using typed JSON or Markdown and direct templates. Do not choose a named framework merely to create a comparison.

Measure setup, first-page time, builds, memory, bytes, accessibility, determinism, deployment steps, and error comprehension.

W2 exit gate:

```text
standalone_scaffold_pass == true
clean_package_consumer_used == true
five_pages_rendered == 5
ordinary_static_fixture_equivalent == true
critical_accessibility_findings == 0
deterministic_rebuild_hash_match == true
operator_time_and_cost_recorded == true
```

# W3: Measured maintenance proof

Entry: W2 passes.

Objective: test whether dependency-aware contracts reduce maintenance defects or effort.

Run the same controlled changes against Hyper and the direct control:

1. shared source-fact change;
2. page-specific fact change;
3. shared design/component change;
4. page retirement or indexability change;
5. invalid change that must be rejected.

For each, record intended and actual affected pages, unexpected changes, operator time, validation failures, corrections, hashes, defects, and rollback effort.

W3 exit gate:

```text
source_fact_change_measured == true
page_specific_change_measured == true
shared_design_change_measured == true
retirement_change_measured == true
invalid_change_rejected == true
unexpected_changed_pages == 0
maintenance_control_comparison_complete == true
maintenance_advantage_or_required_invariant_identified == true
```

If no meaningful advantage or required invariant is demonstrated, narrow or stop framework expansion.

# W4: Optional local task proof

Entry: W3 passes and the static product remains justified.

Objective: test one bounded, side-effect-free task against a normal form.

Use a task such as project intake, estimate preparation, document preflight, or a requirements checklist.

```text
typed input
-> local schema validation
-> deterministic transition
-> local result or rejection
```

No external effects, distributed retries, connector layer, enterprise identity, or multi-agent execution.

Controls: normal HTML form, deterministic multi-step form, and static checklist/template where relevant.

W4 exit gate:

```text
private_projection_leaks == 0
invalid_transitions_accepted == 0
duplicate_artifacts_per_submission <= 1
static_fallback_complete == true
ordinary_form_control_complete == true
task_completion_measured == true
artifact_quality_measured == true
task_advantage_demonstrated == true
```

Failure to beat the form removes or narrows the task layer; it does not invalidate the static compiler.

## Closure rule

A workstream closes only when source/tests, machine plan, READMEs, exact-head validation report, immutable memory, catalog, and PR nonclaims agree.