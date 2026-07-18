# 33 — Governed Task-Surface Validation Matrix

Status: active validation contract; no implementation result implied  
Updated: 2026-07-18  
Architecture: `docs/architecture/32-governed-task-surface-architecture.md`  
Plan authority: `planning/meta-plan-v3.json`, `planning/meta-plan-v3.steps.json`

## 1. Validation model

Each task-surface step uses:

```text
RED       failing contract, characterization, or negative-control test
GREEN     named tests and inherited regressions pass
REFACTOR  behavior, dependency direction, and evidence remain unchanged
EVIDENCE  exact commit, commands, artifacts, metrics, and unrun checks
DECISION  pass, repair, rollback, or remain noncanonical
```

A renderer screenshot or successful chat response is not sufficient evidence.

## 2. Plan-level outcome

A governed task-surface outcome passes only when all of the following are true:

| Metric | Pass boundary |
|---|---:|
| Hyper Site imports from Hyper Content or AI Employee internals | 0 |
| public projection leaks of private or unrelated state | 0 |
| direct browser mutations of canonical runtime state | 0 |
| consequential successful effects without receipts | 0 |
| duplicate irreversible effects for one intent | 0 |
| static fallback completeness | 100% fixture pages |
| private sessions or generated artifacts marked indexable | 0 |
| critical automated accessibility findings | 0 |
| independent keyboard and screen-reader task completion | pass |
| task completion, artifact completion, cost, latency, and conversion recorded | 100% measured fixture runs |
| duplicated runtime bundles attributable only to page count | 0 |
| 10K build and maintenance matrix | complete |

Failure preserves the research and adapter code but blocks canonical activation and maturity promotion.

## 3. P1.4 — physical framework extraction

### RED

- package consumer fails because neutral source still lives only under `reference/`;
- source audit identifies UI imports from mixed manifest, vector geometry, profile, provider, or content modules;
- duplicate PageIR or renderer authority test fails.

### GREEN

- `hyper-site/src` is the physical authority for neutral compiler, SiteManifest, PageIR, design contracts, and neutral UI contracts;
- `reference/` imports `@amtech/hyper-site` rather than private source copies;
- workspace package and packed tarball consumer tests pass;
- exact HTML, sitemap, instruction, dependency, and hash parity remains green;
- UI modules are classified before moving.

### Pass metrics

```text
hyper_site_runtime_reference_imports = 0
hyper_site_content_imports = 0
single_PageIR_authority = 1
single_renderer_authority = 1
published_tarball_fixture_success = 1
legacy_web_artifact_drift = 0
```

### Effects

Unblocks P1.6 and standalone scaffold work. A failed move rolls back to the compatibility facade.

## 4. P1.5 — content geometry and Wasm ownership

### RED

- Hyper Site package API still exposes vectors, prototypes, packed geometry, or current Wasm;
- UI plan changes when content geometry is removed;
- packed content compiler parity fails.

### GREEN

- vector packing, prototypes, HRR geometry, facility calculations, and current Wasm are physically content-owned;
- Hyper Site UI planning uses only content-neutral PageIR, design, route, module, asset, and service contracts;
- content package retains deterministic packed outputs and scalar/Wasm parity.

### Pass metrics

```text
hyper_site_vector_exports = 0
hyper_site_current_wasm_exports = 0
W1_ui_vector_fields = 0
content_packed_ir_regressions = 0
wasm_scalar_numeric_parity = 1
```

## 5. P1.6 — protocol-neutral task-surface ABI

### Required fixtures

Create one deterministic service fixture with:

- static explanation and limitations;
- JSON Schema input and output;
- native component plan;
- public projection;
- one read-only action;
- one approval-required action;
- one produced document resource;
- reconnect and replay sequence;
- growth policy with two allowed presentation variants;
- private fields that must never reach the browser.

### RED

- malformed schema accepted;
- unknown component accepted;
- renderer changes task semantics;
- private fields appear in projection;
- duplicate intent produces duplicate consequential effect;
- event sequence gap cannot recover from snapshot;
- growth policy changes capability or risk class;
- generated raw HTML enters the native/declarative tier.

### GREEN

- deterministic manifests and hashes;
- exhaustive schema validation;
- explicit service, session, intent, event, sequence, and receipt identity;
- static, native, declarative, and sandbox tier boundaries;
- public projection allowlist;
- theme/site/growth permission separation;
- no external protocol dependency in the canonical ABI.

### Pass metrics

```text
external_protocol_types_in_core_ABI = 0
private_fixture_fields_in_projection = 0
unknown_components_accepted = 0
duplicate_effects_per_intent <= 1
successful_effects_without_receipt = 0
static_fallback_fixture_pass = 1
growth_capability_escalations = 0
```

## 6. Protocol adapter conformance

Each adapter is a separate comparison arm.

### A2UI

- map fixture component intent and data model;
- round-trip stable IDs and user actions;
- reject unsupported components;
- retain host component authority;
- report semantic loss.

### AG-UI

- map run lifecycle, messages, tool activity, snapshots, deltas, interrupts, and resume;
- recover after dropped delta through snapshot;
- reject out-of-order or duplicate events safely;
- do not expose raw reasoning.

### MCP Apps

- sandboxed iframe only;
- CSP and allowed origins declared;
- host-mediated tool and export behavior;
- no parent DOM, cookie, or storage access;
- bridge and bundle cost measured;
- static fallback available.

### AI Employee

- isolated public assignment;
- public memory and connector policy distinct from private employees;
- map owner-safe resources, actions, safety, proof, and receipts;
- quota and retention enforced;
- no private business resources or credentials in public projection.

No adapter becomes canonical merely because the demo renders.

## 7. Theme validation

Every registered component requires:

- schema fixture;
- static fallback;
- empty, loading, partial, error, completed, and expired states;
- keyboard and focus behavior;
- programmatic name, role, and value;
- reflow at 320 CSS pixels;
- target size and focus visibility;
- reduced-motion behavior;
- screen-reader task sequence;
- maximum runtime bytes;
- deterministic server-rendered shell where applicable.

The theme cannot alter service capabilities, policies, actions, or receipts.

## 8. Site validation

A service mount fails when:

- service or version is missing;
- fallback module is absent;
- route is outside the service policy;
- renderer tier is not permitted;
- required component is unavailable;
- runtime origin or adapter is undeclared;
- privacy, retention, or limitation copy is missing;
- private session or output is indexable.

Static page validation remains independent of runtime availability.

## 9. Growth-operator validation

Allowed variants are frozen before an experiment. Assignment is deterministic for the declared evaluation context and auditable.

Required controls:

- holdout or simpler baseline;
- predeclared primary metric;
- minimum sample or stopping rule;
- exposure and assignment log;
- immutable service policy refs;
- no claim variant outside approved evidence;
- no indexing or retention changes;
- no capability escalation;
- no arbitrary executable payload.

Primary product metrics prioritize:

```text
qualified task starts
successful task completions
artifact completions
approval completion
time to useful output
accepted output rate
provider and review cost
conversion after completed value
retention or continued project use
```

Page views, chat messages, and CTA clicks remain diagnostic metrics rather than task success.

## 10. Ten-thousand-page build matrix

Run the following dimensions:

| Dimension | Values |
|---|---|
| pages | 5, 25, 100, 500, 10,000 |
| mounted surfaces | 0, 1, 100, 10,000 |
| unique services | 1, 10, 100 |
| tiers | static, native, declarative, sandboxed |
| cache | cold, warm |
| operation | full build, page edit, service edit, component edit, theme edit, growth-policy edit |

Measure:

- wall time and p50/p95 repeated runs;
- peak memory;
- total output and runtime bytes;
- unique versus duplicated bundles;
- schema and manifest duplication;
- dependency invalidation counts;
- unchanged artifact count;
- service mount descriptor bytes;
- browser first interaction and resumed interaction;
- accessibility and no-JS completeness;
- publisher upload and rollback delta.

### Scale pass boundaries

```text
per_page_generated_runtime_bundle_bytes = 0
shared_bundle_duplicate_hashes = 0
static_pages_without_activation_runtime_requests = 0
unrelated_page_rebuilds_after_service_change = 0
unrelated_service_rebuilds_after_page_change = 0
10k_full_build_success_rate_over_20_runs = 1
10k_build_artifact_hash_determinism = 1
```

Performance targets must be set from measured baselines. No unsupported universal build-time constant is accepted.

## 11. P2 independent-ship gates

The five-page scaffold contains:

1. home page;
2. service page;
3. evidence or case page;
4. comparison or decision page;
5. governed task page with complete static fallback.

Required commands remain three or fewer from clean directory to built output.

Dev and preview must support:

- changed-page-only rebuild;
- changed-service mount invalidation;
- shared runtime bundle caching;
- reconnect and mock event replay;
- no stale static fallback;
- clean shutdown.

Publisher must support dry-run, immutable output manifest, static shell plus shared runtime assets, failure without partial publication, and rollback.

Controlled framework comparison uses identical content, routes, assets, static fallback, runtime interaction, and machine policy.

## 12. P3 content and recovery gates

Hyper Content may propose:

- task goal;
- canonical question;
- evidence and limitations;
- static examples;
- input and output classes;
- review triggers;
- page and service relationship.

It may not propose renderer implementation details.

Required separation tests:

- accepted ArticleIR with rejected task-service proposal;
- accepted task-service proposal with rejected ArticleIR;
- provider retry only after explicit validation rejection;
- checkpoint resume at PCN, ArticleIR, service proposal, surface compilation, and publication boundaries;
- deterministic republish;
- zero duplicate external effects.

## 13. Relationship-projection notation experiment

The proposed notation remains W5 research and must be renamed before publication.

Compare it against:

- normalized typed JSON;
- JSON-LD or RDF 1.2 quoted triples;
- property graph representation;
- task-service JSON Schema plus CloudEvents-like log.

Measure:

- parse success;
- canonical serialization;
- schema evolution;
- bytes and tokens;
- authoring and debugging time;
- validation coverage;
- provenance fidelity;
- event replay and projection correctness;
- model extraction accuracy;
- policy-safety failures.

Promotion requires a preregistered material gain without interoperability, safety, or maintenance regression. Otherwise preserve it as research only.

## 14. Evidence record

A passing implementation report must include:

- exact branch and full commit;
- plan step IDs;
- source and protocol versions;
- fixture hashes;
- commands and runner identity;
- all pass metrics;
- failed and repaired RED traces;
- workflow runs and artifacts;
- remaining nonclaims;
- next dependency gate.
