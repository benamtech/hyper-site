# Reality-Grounded Product Validation Matrix

Status: active validation contract  
Updated: 2026-07-18  
Inputs: `docs/architecture/35-reality-grounded-product-and-integration-boundary.md`, `docs/planning/36-next-three-workstreams-reality-grounded-plan.md`

## Purpose

This contract prevents architecture breadth, synthetic scale, protocol conformance or advanced methods from being mistaken for user value. Every product claim must name a control, metric, failure threshold and evidence artifact.

## Claim classes

| Claim | Required evidence | Invalid substitute |
|---|---|---|
| source ownership | package source, imports, tarball consumer and boundary tests | facade export or folder name |
| framework usefulness | equivalent site comparison and operator study | static HTML emission alone |
| content quality | held-out evidence and page-existence review | schema validity alone |
| maintenance advantage | measured change and invalidation workflow | initial generation speed |
| task-surface value | completion and artifact quality versus form/control | click or session start |
| runtime safety | policy, idempotency, recovery and receipts | visible successful result |
| scale | frozen fixture with build and maintenance metrics | page count alone |
| advanced-method value | preregistered simple control and measured improvement | novelty or theoretical fit |
| commercial value | paid acceptance, retention or verified operating savings | internal enthusiasm |

## Product extraction matrix

| Test | Pass | Fail |
|---|---|---|
| source ownership | canonical implementation exists under owning package | package delegates product implementation to `reference/dist` |
| dependency direction | Hyper Content may depend on Hyper Site | Hyper Site imports Hyper Content |
| reference role | fixtures and compatibility consume packages | reference remains product runtime authority |
| public API | explicit stable and experimental exports | uncontrolled star export of internals |
| independent consumption | packed package works in clean fixture | monorepo-relative import required |
| parity | legacy fixture artifacts match during transition | unexplained HTML, sitemap, hash or dependency drift |

## Framework comparison matrix

Freeze the same routes, content, assets, fonts, structured data, interactive behavior, machine, runtime, cache policy and output requirements.

Measure:

- install and scaffold commands;
- time to first correct page;
- development startup and update latency;
- cold, warm and changed-page build time;
- shared-theme and shared-component rebuild time;
- peak memory;
- HTML, CSS, JavaScript and total bytes;
- duplicate assets;
- accessibility defects;
- browser metrics;
- deployment commands;
- rollback effort;
- operator time for a shared change.

Hyper Site does not pass merely by matching runtime bytes. It must improve a governed invariant or total lifecycle cost.

## Content-product matrix

For every accepted page require:

- explicit page task;
- target audience or decision context;
- approved evidence set;
- supported claims;
- distinct information object;
- duplicate and cannibalization review;
- freshness and retirement policy;
- held-out acceptance decision.

Metrics:

```text
unsupported_claim_rate
citation_scope_error_rate
stale_evidence_rate
page_existence_acceptance_rate
duplicate_rejection_precision
duplicate_rejection_recall
operator_review_minutes
provider_cost_per_accepted_page
repair_attempts_per_accepted_page
maintenance_minutes_per_change
```

A page count is never a quality metric.

## Task-surface matrix

Compare one governed task against an ordinary form or embedded workflow product.

Measure:

- start rate;
- required-input completion;
- task completion;
- artifact generation;
- artifact usefulness judgment;
- downstream data quality;
- latency;
- runtime and model cost;
- accessibility;
- abandonment point;
- operator intervention;
- duplicate effects;
- missing receipts;
- policy rejection quality.

The task surface fails if it is more confusing, less accessible, less reliable or materially more expensive without producing better downstream artifacts.

## Durable-runtime matrix

Inject failure before and after:

- intent acceptance;
- policy decision;
- provider call;
- partial stream;
- structured parse;
- human approval;
- effect request;
- effect completion;
- receipt persistence;
- projection update;
- publication.

Pass conditions:

```text
accepted_work_not_regenerated == true
rejected_work_not_promoted == true
duplicate_irreversible_effects == 0
successful_effects_without_receipt == 0
stale_authorization_commits == 0
ordered_resume_cursor_preserved == true
partial_publication == 0
```

## Advanced-method promotion matrix

| Candidate | Control | Promotion requirement |
|---|---|---|
| ontology graph | typed JSON/relational model | better acceptance, maintenance or invalidation at acceptable complexity |
| embeddings | lexical and rule baseline | material retrieval or duplicate-detection gain on held-out cases |
| HRR/HDC | ordinary vectors/maps | measured memory, matching or composition benefit |
| graph database | PostgreSQL | query or maintenance benefit that justifies operations |
| Wasm | JavaScript/server implementation | measured latency or portability benefit on actual workload |
| GPU | CPU baseline | meaningful throughput or cost benefit at target scale |
| declarative generated UI | trusted native components | task quality or authoring benefit without safety/accessibility loss |
| autonomous planning | deterministic or human-authored plan | better accepted outcomes without increased effect risk |

Promotion requires a dated validation report and machine-plan update. Otherwise the method remains experimental or is removed.

## Enterprise-gap matrix

Before any enterprise claim, test or explicitly mark absent:

- SSO and identity lifecycle;
- tenant isolation;
- permissions;
- audit retention;
- data residency and retention;
- localization;
- asset management;
- editorial workflows;
- migration;
- integration administration;
- observability;
- incident response;
- backups and disaster recovery;
- support operations;
- accessibility governance.

An elegant compiler does not compensate for absent enterprise controls.

## Commercial validation ladder

1. Internal five-page fixture.
2. Independent operator rebuild.
3. One noindex real-business cohort.
4. One bounded task with real downstream review.
5. Paid pilot with explicit success criteria.
6. Measured maintenance event.
7. Repeatable second customer or site.
8. Only then broader category positioning.

## Documentation integrity gate

Every active research document must point to an architecture disposition or explicit rejection. Every accepted architecture document must point to an active plan. Every active plan must point to a validation contract. Every passing implementation claim must point to a measured report and immutable memory handoff.

The documentation system fails if:

- an active authority names a moved or noncanonical implementation path;
- a historical document is presented as current without a supersession marker;
- CI evidence references an older head as current;
- a plan marks completion without a validation report;
- a research source lacks claim disposition;
- a measured report is edited instead of superseded;
- PR nonclaims contradict the repository state.
