# Next Three Workstreams: Direct Product Plan

Status: active planning authority  
Updated: 2026-07-18

```text
W1 source extraction
-> W2 local task contract
-> W3 real-site proof
```

## W1: Source extraction

Goal: make both packages own their source and reduce `reference/` to compatibility, fixtures, examples, and benchmarks.

Tasks:

1. Classify every `reference/src` file.
2. Move the neutral compiler, manifest, PageIR, renderer, sitemap, instruction projection, and dependency index into `hyper-site/src`.
3. Move content, evidence, ontology, generation, ArticleIR, validation, vector, and acceleration code into `hyper-content/src`.
4. Replace star exports with explicit public and experimental exports.
5. Make `reference/` consume both packages.
6. Add clean tarball consumers and preserve artifact parity.

Pass:

```text
unclassified_reference_source_files == 0
hyper_site_reference_runtime_imports == 0
hyper_content_reference_runtime_imports == 0
tarball_consumers_pass == 2
legacy_artifact_parity_failures == 0
```

## W2: Local task contract

Goal: test one bounded, side-effect-free task without adding a platform layer.

Tasks:

1. Define versioned task, input, state, result, rejection, artifact, and public-projection contracts.
2. Use deterministic local transitions.
3. Reject unknown fields, invalid transitions, stale versions, and private output.
4. Keep the static page complete without JavaScript.
5. Implement one local fixture such as project intake, estimate preparation, document preflight, or a requirements checklist.
6. Compare it with a normal HTML form and deterministic multi-step form.

No external effects, distributed retries, connector layer, enterprise identity, or multi-agent execution belong in this workstream.

Pass:

```text
private_projection_leaks == 0
invalid_transitions_accepted == 0
duplicate_artifacts_per_submission <= 1
static_fallback_complete == true
ordinary_form_control_complete == true
```

## W3: Real-site proof

Goal: prove the products create and maintain one real site better than direct simpler controls.

Tasks:

1. Build a five-page scaffold usable without Hyper Content.
2. Implement `dev`, `build`, `preview`, and `inspect`.
3. Implement one filesystem or static-host publisher with dry run, hashes, atomic output, and rollback reference.
4. Freeze an equivalent ordinary static implementation.
5. Measure setup, development latency, builds, memory, bytes, accessibility, deployment, and maintenance.
6. Run one real evidence-to-five-page noindex cohort.
7. Review page existence, evidence fidelity, duplication, design, and operator usability.
8. Measure one source-fact change and one shared-design change.
9. Test the local task against the ordinary-form control.
10. Record operator time, model cost, defects, completion, artifact quality, and maintenance cost.

Direct controls:

- typed JSON or Markdown plus templates;
- ordinary static implementation;
- explicit page list;
- lexical and rule methods;
- arrays and maps;
- direct JavaScript or server code;
- normal HTML forms.

Pass:

```text
standalone_scaffold_pass == true
ordinary_static_fixture_equivalent == true
accepted_real_pages >= 5
unsupported_claim_rate == 0
maintenance_event_measured == true
ordinary_form_comparison_complete == true
operator_time_and_cost_recorded == true
```

A workstream closes only when tests, plans, docs, validation, catalog, memory, and PR nonclaims agree.