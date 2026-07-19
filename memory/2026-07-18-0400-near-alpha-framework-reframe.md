# 2026-07-18 04:00 — Near-Alpha Framework Reframe

status: architectural reset implemented and exact-head synthetic validation passed; PR remains draft; real framework and field gates intentionally pending  
branch: `agent/glm-blackwell-vertical-slice`  
pr: `#3`  
validated_source_head: `9e03b1b6d43a574bb09fdcfd28f6edd153e56c68`

## why this handoff exists

The session began by implementing a GLM and rented-GPU production-boundary experiment. The user then required a serious step back:

```text
Hyper Site is a web framework and agent workspace
not a data pipeline
not a slop creator
not production-ready
10K is an experimental tier, not the product definition
```

The prior `2026-07-18-0330-glm-blackwell-production-vertical-slice.md` handoff remains valid for its exact synthetic software measurements. Its maturity framing is historical and superseded by this handoff.

## current product identity

identity:
  "research prototype approaching near-alpha; intended agent-first web framework and experience compiler"

lifecycle:
  "repository intake -> datasheets/evidence -> design/type/layout/graphics/starter site -> bounded ontology/PageDraft jobs -> canonical PageIR/static site -> review -> post-generation maintenance -> next immutable workspace snapshot"

continuous_agent:
  "repeated explicit checkpointed invocations over durable artifacts; never an opaque perpetual loop or automatic publication"

## implemented reset

implemented[10]{order,boundary,authority}:
  1,"near-alpha maturity and scientific evaluation",`reference/src/near-alpha-framework.ts`
  2,"strict release candidate requiring a real non-synthetic case",`reference/src/near-alpha-release.ts`
  3,"immutable continuous artifact workspace",`reference/src/agent-workspace.ts`
  4,"transitive dependency invalidation and unaffected-artifact set",`reference/src/agent-workspace.ts`
  5,"workspace file CLI",`reference/scripts/workspace-cli.mjs`
  6,"research and strict release evaluation CLI",`reference/scripts/near-alpha-cli.mjs`
  7,"bulk-only, baseline-free, decorative-network, unjustified-page, and overclaim rejection tests",`reference/test/near-alpha-framework.test.mjs`
  8,"workspace lifecycle, invalidation, cycle, and cardinality tests",`reference/test/agent-workspace*.test.mjs`
  9,"synthetic-only release rejection",`reference/test/near-alpha-release.test.mjs`
  10,"canonical root/package/research docs and PR maturity reconciliation",`identity.md`,`AGENTS.md`,`README.md`,`CODEGRAPH.md`,`reference/README.md`,`24-27*.md`,`PR #3`

## framework invariants

invariants[12]:
  research-prototype-or-near-alpha-only
  production-source-name-is-not-production-maturity
  core-site-before-bulk
  datasheet-design-typography-layout-graphics-starter-artifacts
  continuous-workspace-spans-both-ends
  same-model-never-accepts
  ordinary-framework-baseline-required
  network-science-needs-held-out-action-effect
  one-page-one-task-information-evidence-difference-owner
  ten-k-requires-post-generation-maintenance-matrix
  claimed-scale-never-exceeds-measured-full-framework-ceiling
  artifact-kind-never-infers-canonical-page-cardinality

## continuous workspace model

artifact_fields[7]:
  id
  kind
  lifecycle-phase
  producer
  source-ids
  dependency-ids
  status-and-content-hash

phases[7]:
  discovery
  datasheet-authoring
  design-authoring
  starter-site
  bulk-generation
  post-generation-maintenance
  case-study-evaluation

invalidation:
  "changed artifact -> reverse dependency traversal -> invalidated set + unaffected set + stable plan hash"

current_limit:
  "logical artifact invalidation only; not yet a file-level incremental compiler, cache, visual editor, or multi-user workspace"

## strict near-alpha release gate

release_requires:
  "at least one complete non-synthetic case study + zero hard failures + zero pending attributes"

real_case_fields[10]:
  case-id
  organization-or-project
  repository-revision
  operators
  sources
  initial-goals
  assigned-jobs
  post-generation-tasks
  observed-outcomes
  held-out-judgments

synthetic_only:
  hard-reject

## ordinary framework baseline

required_comparison:
  "Hyper Site plus at least one conventional static, SSR, or SPA framework"

shared_controls[8]:
  fixture
  visible-semantics
  assets
  routes-and-families
  machine
  runtime
  build-mode
  cache-policy

metrics[12]:
  cold-build
  incremental-build
  dev-startup
  dev-update
  peak-memory
  html-js-css-assets-total-bytes
  validation
  serving-and-crawl
  browser
  accessibility
  agent-and-operator-effort
  recovery-rollback-and-maintenance

## 10K uncertainty boundary

required_changes[10]:
  one-page-fact
  one-family-fact
  one-design-token
  one-shared-component
  one-information-object
  one-page
  one-page-family
  one-evidence-source
  one-ontology-relation
  one-interrupted-batch

measure_each:
  "invalidated/rebuilt/unchanged artifacts; time; memory; output churn; crawl effects; review burden; rollback"

## network-science disposition

current_authority:
  "typed sparse graph plus explicit constraints, lexical baseline, bounded selection, and rule-based workspace dependencies"

promotion_requires:
  "exact measured failure + simpler baseline + versioned real graph + held-out judgments + tail/noise/stability + action policy + full-framework/operator outcome"

valid_targets[7]:
  page-family-coherence
  held-out-relevance
  information-coverage
  cannibalization
  internal-link-utility
  maintenance-priority
  drift-merge-retirement-decisions

learned_graph_promoted:
  false

## exact synthetic validation

near_alpha_run{workflow,run,job,head,result,artifact,digest}:
  "Hyper Site Near-Alpha Pipeline",29636565648,88059836329,9e03b1b6d43a574bb09fdcfd28f6edd153e56c68,success,"near-alpha-test-log-29636565648","sha256:a9d4362b7068ac8e76b0088995700b9e62234b647c4886e0cbbe21970bd6c3d1"

focused_tests{passed,failed,total_ms}:
  20,0,36321.318

scale[3]{pages,elapsed_ms,candidates,html_bytes}:
  100,2724.549,3675,"recorded"
  500,3425.700,509,"recorded"
  10000,21867.767,12949,54291900

reference_run{workflow,run,job,head,result}:
  "Hyper Site Reference",29636565641,88059836315,9e03b1b6d43a574bb09fdcfd28f6edd153e56c68,success

reference_steps[8]:
  npm-test
  manifest-emission
  ui-emission
  orchestration-check
  framework-validation
  framework-preview
  browser-check
  r3f-build

## explicit nonclaims

not_proven[13]:
  actual-near-alpha-release
  real-five-page-starter-site
  real-case-study
  live-glm-quality-cost-latency
  real-gpu-throughput
  real-design-type-layout-graphics-quality
  continuous-operation-beyond-file-snapshots
  incremental-compiler-or-dev-server-behavior
  conventional-framework-advantage
  real-relevance-information-gain-accessibility
  network-science-benefit
  useful-indexable-10k-pages
  search-citation-conversion-revenue-lifecycle-return

## next run

next[10]{order,task,acceptance}:
  1,"freeze one real five-page starter-site case","complete inspectable goals, sources, assets, design judgments, and operator"
  2,"capture business/design/type/layout/graphics/asset authority","no invented truth or rights"
  3,"link actual compiler/design/asset outputs into workspace artifacts","real dependency graph and hashes"
  4,"run live provider and rented-node experiments","latency/tokens/failures/hardware/runtime/economic report"
  5,"implement same case in an ordinary framework","same fixture/machine/runtime/build controls"
  6,"compare authoring/build/incremental/output/browser/accessibility/operator work","predeclared hypotheses and falsification"
  7,"extend to 25 real noindex pages","page-existence justifications and post-generation changes"
  8,"freeze held-out design/relevance/graph judgments","independent acceptance corpus"
  9,"scale 100 then 500","same full framework and maintenance path"
  10,"run 10K maintenance matrix and decide alpha","release gate requires real case plus zero fail/pending"

## merge disposition

pr_state:
  draft

merge_now:
  false

reason:
  "synthetic software boundaries pass, but real use, ordinary-framework comparison, and strict near-alpha release evidence are intentionally absent"
