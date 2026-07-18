# Next Three Workstreams: Reality-Grounded Plan

Status: active planning authority  
Updated: 2026-07-18  
Inputs: `docs/research/34-intellectual-competitive-and-use-case-landscape.md`, `docs/architecture/35-reality-grounded-product-and-integration-boundary.md`

## Program order

```text
W1 physical product extraction
-> W2 governed task-surface ABI
-> W3 standalone and real-use proof
```

The workstreams are dependency ordered. Research, implementation, validation and memory must advance together.

## W1: Physical product extraction

### Objective

Make `hyper-site/` and `hyper-content/` real source-owning packages. Convert `reference/` into a consumer, compatibility suite, fixture library and benchmark harness.

### Tasks

1. Create a machine-readable ownership inventory for every file in `reference/src`.
2. Classify each file as Hyper Site, Hyper Content, runtime adapter, compatibility, fixture or research.
3. Move `framework-core.ts`, `site-manifest.ts`, PageIR, neutral rendering, sitemap, instruction projection and dependency indexing into `hyper-site/src`.
4. Compile and export Hyper Site from owned source rather than `reference/dist`.
5. Split mixed UI modules into semantic contract, trusted renderer, content recommendation and runtime execution authorities.
6. Move evidence, ontology, opportunity, generation, ArticleIR, validation, workspace, vector and acceleration clusters into `hyper-content/src`.
7. Replace facade-wide star exports with explicit stable, experimental and internal surfaces.
8. Make `reference/` install and consume both workspace packages.
9. Add tarball consumers for both packages.
10. Reject runtime imports from either package into `reference/`.
11. Preserve exact artifact parity until the old implementation is retired.
12. Update CODEGRAPH, READMEs, catalog, validation report and memory at every coherent migration boundary.

### RED tests

- package source path does not exist;
- package imports `reference/dist`;
- duplicate canonical PageIR or renderer definitions;
- reverse dependency from Hyper Site to Hyper Content;
- tarball import failure;
- compatibility fixture drift;
- unclassified source file;
- public export of internal experimental modules.

### Pass gate

```text
unclassified_reference_source_files == 0
hyper_site_reference_runtime_imports == 0
hyper_content_reference_runtime_imports == 0
canonical_renderer_implementations == 1
canonical_content_adapter_implementations == 1
tarball_consumers_pass == 2
legacy_artifact_parity_failures == 0
```

### Rollback

Move one coherent dependency cluster at a time. Retain compatibility adapters until package and reference tests pass. Never create a second renderer or publisher.

## W2: Governed task-surface ABI

### Objective

Implement a protocol-neutral, host-controlled contract for static pages with optional bounded tasks. External protocols are conformance adapters, not core state.

### Tasks

1. Define versioned contracts for service manifests, surface plans, public projections, intents, ordered events, resources, artifacts, actions, receipts, theme bindings, site mounts and growth policies.
2. Separate commands, events and projections.
3. Define stable identifiers, sequence, trace, policy and idempotency fields.
4. Implement four renderer tiers: static, trusted native, declarative trusted and sandboxed open-ended.
5. Encode theme, site and growth author boundaries.
6. Reject unknown components, properties and undeclared capabilities.
7. Reject private projection fields and indexable private outputs.
8. Require receipts for successful consequential effects.
9. Implement one bounded business-document or project-intake fixture.
10. Add A2UI, AG-UI, MCP Apps and AI Employee adapters only after internal contracts pass.
11. Integrate an external policy and experiment control before creating proprietary alternatives.
12. Instrument with OpenTelemetry-compatible trace context.

### RED tests

- unknown component accepted;
- public projection contains private memory or credentials;
- stale sequence accepted;
- duplicate irreversible intent causes duplicate effect;
- effect succeeds without receipt;
- growth variant widens capability;
- protocol adapter mutates canonical state directly;
- no-JavaScript fallback is incomplete;
- sandbox accesses undeclared network origin.

### Pass gate

```text
external_protocol_types_in_core == 0
private_projection_leaks == 0
unknown_components_accepted == 0
duplicate_irreversible_effects_per_intent <= 1
successful_effects_without_receipt == 0
critical_accessibility_findings == 0
static_fallback_complete == true
adapter_capability_widening == 0
```

### Rollback

The static site remains usable when all task adapters are disabled. Each protocol and runtime adapter can be removed independently.

## W3: Standalone and real-use proof

### Objective

Prove that the separated products can create, publish, maintain and operate one real site and task more effectively than simpler alternatives.

### Tasks

1. Build a five-page scaffold usable without Hyper Content.
2. Implement `dev`, `build`, `preview` and `inspect` workflows.
3. Implement one static publisher with dry run, atomic plan, hashes and rollback reference.
4. Freeze an equivalent Astro comparison fixture.
5. Measure setup effort, development latency, cold and incremental builds, memory, bytes, accessibility, deployment and maintenance.
6. Run the 5, 25, 100, 500 and 10,000 page software scale ladder.
7. Ensure shared runtime assets are emitted once and per-page generated runtime bundles remain zero.
8. Run one real Hyper Content provider pass from approved evidence to five noindex pages.
9. Independently review page existence, evidence fidelity, duplication, design and operator usability.
10. Run one bounded task through a real durable runtime adapter.
11. Inject failure at every durable boundary and verify resume, idempotency and receipts.
12. Compare the task against an ordinary form or embedded workflow product.
13. Record total operator time, model cost, runtime cost, defects, completion and downstream artifact quality.
14. Expand to 25 pages only after the five-page cohort passes.

### Control arms

- skilled human plus Astro and Markdown;
- headless CMS plus Astro or Next.js;
- SEO/content tool plus human agency workflow;
- ordinary site plus embedded form or automation service;
- relational/JSON content model versus ontology graph;
- lexical/rule retrieval versus embeddings;
- CPU/JavaScript versus Wasm/GPU where applicable.

### Pass gate

```text
standalone_scaffold_pass == true
commands_to_first_build <= 3
publisher_partial_failure == 0
ordinary_framework_fixture_equivalent == true
ten_thousand_page_matrix_complete == true
per_page_generated_runtime_bundle_bytes == 0
accepted_real_pages >= 5
accepted_real_task_surfaces >= 1
unsupported_claim_rate == 0
duplicate_external_effects == 0
operator_time_and_cost_recorded == true
```

## Documentation closure for every workstream

A workstream is not complete until all are true:

1. source and tests pass;
2. machine plan reflects dependencies and gates;
3. architecture and README statements match implementation;
4. validation report names exact commit, commands and results;
5. immutable memory handoff records state and next gate;
6. `memory/MEMORY.md` is reconciled;
7. `docs/catalog.json` points to current authorities and supersession chains;
8. PR body is current and nonclaims remain explicit.

## Stop conditions

Pause or narrow the program when a simpler control repeatedly reaches equivalent outcomes with lower total cost, when operators cannot understand the contracts, when evidence review is slower than manual work, when integration maintenance dominates value, or when advanced methods fail promotion gates.
