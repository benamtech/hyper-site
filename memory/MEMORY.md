# Hyper Monorepo Durable Memory

format: TOON-oriented Markdown  
status: active  
scope: standalone repository root  
updated_at: 2026-07-18T08:10:00-04:00

## protocol

memory_model{index,handoffs,legacy,mutation}:
  "memory/MEMORY.md","memory/YYYY-MM-DD-HHMM-<slug>.md","memory/legacy/","append immutable handoff; reconcile index; never overwrite timestamped files"

rules[18]:
  read-MEMORY-first
  read-newest-handoff-next
  timestamped-handoffs-immutable
  grandfathered-pre-HHMM-handoffs-live-under-memory-legacy
  source-tests-artifacts-over-docs
  docs-follow-intake-research-architecture-plan-validation-memory
  docs-catalog-is-machine-readable-navigation-not-proof
  two-products-one-publication-target
  hyper-content-depends-on-hyper-site-only
  zero-ui-implementation-logic-in-hyper-content
  one-web-artifact-authority-during-migration
  plan-steps-require-TDD-effects-rollback-and-metrics
  public-browser-state-is-an-allowlisted-projection
  no-invented-business-truth
  no-same-model-self-acceptance
  bounded-repair-or-reject
  synthetic-scale-is-not-framework-quality
  ordinary-framework-real-case-task-completion-and-revenue-gates-before-alpha

## current

state{branch,pr,validated_implementation_head,latest_closure_handoff,status,maturity,merge}:
  agent/glm-blackwell-vertical-slice,3,05d8961791c6451e480a6be453351b8722bca81f,"memory/2026-07-18-0805-task-surface-doc-system-ci-closure.md","documentation system organized and idempotent; task-surface research/architecture and META-PLAN mutation exact-CI green; physical source extraction and runtime implementation pending","research prototype approaching near-alpha","keep draft; do not merge"

product_identity:
  "two products plus one permanent shared task-surface workstream: hyper-site static web framework; hyper-content ontology/evidence/content compiler targeting hyper-site; W7 protocol-neutral governed task surfaces"

dependency_direction:
  "hyper-content -> hyper-site; hyper-site cannot depend on hyper-content or AI Employee internals; runtime adapters target public task-surface contracts"

current_compile_paths:
  "hyper-site -> reference/dist/framework-core.js -> content-neutral static artifacts"
  "hyper-content -> reference/dist/content-program-adapter.js -> geometry-free SiteSource parity proof"
  "hyper-content legacy compile -> reference/dist/framework.js -> framework-core -> vector prototypes and packed IR"

future_surface_path:
  "approved task semantics -> W7 TaskServiceManifest/SurfacePlan -> static fallback + runtime adapter interface -> typed intent -> ordered event -> public resource/action/receipt"

program_authority:
  "planning/meta-plan-v3.json + planning/meta-plan-v3.steps.json; 8 workstreams, 6 phases, 25 steps, 31 preserved technologies/protocol arms, 5 outcomes, 6 hypotheses"

content_backend:
  "approved compiler state -> deterministic PCN -> provider -> external ArticleIR acceptance -> deterministic unfolder -> hyper-site"

## newest handoffs

handoffs[11]{at,file,status,scope}:
  2026-07-18T08:05:00-04:00,2026-07-18-0805-task-surface-doc-system-ci-closure.md,current,"idempotency fixes, permanent focused-CI docs gate, exact strengthened proof"
  2026-07-18T07:45:00-04:00,2026-07-18-0745-task-surface-research-doc-system.md,foundation,"complete document organization; protocol research; W7 architecture; 10K surface gates; plan mutation"
  2026-07-18T06:30:00-04:00,2026-07-18-0630-content-program-adapter.md,foundation,"P1.3 explicit geometry-free SiteSource adapter, parity gate, exact CI"
  2026-07-18T06:10:00-04:00,2026-07-18-0610-meta-plan-v3-framework-core-extraction.md,foundation,"executable program authority, neutral compiler and SiteManifest, compatibility adapter"
  2026-07-18T05:30:00-04:00,2026-07-18-0530-product-boundary-folder-split.md,foundation,"research-supported two-product decision, root folders, boundary tests, PCN backend classification"
  2026-07-18T04:00:00-04:00,2026-07-18-0400-near-alpha-framework-reframe.md,superseded-product-framing,"maturity reset, continuous workspace, strict release gate, ordinary-framework and 10K maintenance requirements"
  2026-07-18T03:30:00-04:00,2026-07-18-0330-glm-blackwell-production-vertical-slice.md,historical-foundation,"provider/appliance/design/transaction/recovery and synthetic full emission"
  2026-07-18T02:05:00-04:00,2026-07-18-0205-repository-ingestion-boundary.md,foundation,"standalone repository ingestion"
  2026-07-18T01:15:00-04:00,2026-07-18-0115-graph-triage-ci-closure.md,foundation,"graph research disposition"
  2026-07-18T01:05:00-04:00,2026-07-18-0105-graph-learning-paper-triage.md,foundation,"learned graph promotion gates"
  2026-07-18T00:55:00-04:00,2026-07-18-0055-academic-crosswalk-harness-acceleration.md,foundation,"academic crosswalk and harness"

## authority

read_order[20]{order,file,role}:
  1,../identity.md,"two-product and task-surface architect identity"
  2,../AGENTS.md,"product, surface, scientific, and publication operating contract"
  3,../CODEGRAPH.md,"framework/content/surface graphs and migration map"
  4,../README.md,"current monorepo product and maturity"
  5,../docs/README.md,"stateful documentation lifecycle"
  6,../docs/catalog.json,"machine-readable document navigation and supersession"
  7,../planning/meta-plan-v3.json,"machine program, workstreams, outcomes, hypotheses"
  8,../planning/meta-plan-v3.steps.json,"machine TODO DAG, TDD, effects, rollback and pass metrics"
  9,MEMORY.md,"durable current state"
  10,2026-07-18-0805-task-surface-doc-system-ci-closure.md,"latest immutable handoff"
  11,../validation/reports/2026-07-18-task-surface-research-and-document-system.md,"current research/document/plan validation report"
  12,../docs/intake/2026-07-18-next-generation-task-surfaces.md,"preserved supplied thesis and corrections"
  13,../docs/research/31-next-generation-task-surfaces-protocol-crosswalk.md,"primary-source protocol and prior-art disposition"
  14,../docs/research/sources/2026-07-18-task-surfaces.sources.json,"machine source registry"
  15,../docs/architecture/32-governed-task-surface-architecture.md,"accepted protocol-neutral target architecture"
  16,../docs/validation/33-task-surface-validation-matrix.md,"TDD, security, accessibility, recovery, adapter, and 10K gates"
  17,2026-07-18-0745-task-surface-research-doc-system.md,"research and organization foundation"
  18,../docs/architecture/29-product-boundary-research-and-root-folder-split.md,"two-product decision"
  19,../hyper-site/README.md,"framework ownership"
  20,../hyper-content/README.md,"content compiler ownership"

## source state

layers[31]{layer,file,state}:
  docs-index,../docs/README.md,"lifecycle, root allowlist, read/write protocol and validation hooks"
  docs-catalog,../docs/catalog.json,"machine registry for current, historical and superseded documents"
  docs-migration,../docs/legacy-root-moves.json,"34-root-document migration provenance"
  docs-gate,../scripts/check-doc-system.mjs,"root, catalog, path, memory, source-registry and plan assertions"
  declared-move-gate,../scripts/check-declared-doc-moves.mjs,"old path absence, destination existence and stale live-link assertions"
  docs-ci,../.github/workflows/production-pipeline.yml,"documentation validation runs on ordinary focused CI"
  task-intake,../docs/intake/2026-07-18-next-generation-task-surfaces.md,"supplied concept preserved and corrected"
  task-research,../docs/research/31-next-generation-task-surfaces-protocol-crosswalk.md,"WebDriver/model-based UI/A2UI/AG-UI/MCP/schema/event/provenance crosswalk"
  task-sources,../docs/research/sources/2026-07-18-task-surfaces.sources.json,"primary and official source registry"
  task-architecture,../docs/architecture/32-governed-task-surface-architecture.md,"protocol-neutral service/surface/theme/site/growth contracts"
  task-validation,../docs/validation/33-task-surface-validation-matrix.md,"P1.4/P1.5/P1.6/P2/P3 and 10K pass/fail contract"
  program-index,../planning/meta-plan-v3.json,"8 workstreams, placements, outcomes, hypotheses and draft branch policy"
  program-steps,../planning/meta-plan-v3.steps.json,"25 dependency-checked TODO steps; P0.2 and P1.1-P1.3 complete"
  plan-validator,../scripts/check-meta-plan.mjs,"DAG, metrics, preservation, outcome and revenue assertions"
  contribution-standard,../CONTRIBUTING.md,"branch, TDD, stateful docs, evidence, failure and claim rules"
  neutral-framework,../reference/src/framework-core.ts,"content-neutral SiteSource to PageIR/static HTML/sitemap"
  neutral-manifest,../reference/src/site-manifest.ts,"content-neutral SiteManifest"
  content-compile-adapter,../reference/src/framework.ts,"legacy vector prototypes and packed IR added after neutral compile"
  content-program-adapter,../reference/src/content-program-adapter.ts,"mixed content source to geometry-free Hyper Site SiteSource with parity assertion"
  adapter-test,../reference/test/content-program-adapter.test.mjs,"geometry removal and exact artifact parity"
  boundary-gate,../scripts/check-product-boundaries.mjs,"one-way package, neutral source, and explicit adapter assertions"
  hyper-site-facade,../hyper-site/index.mjs,"neutral compiler/manifest/browser/CSS public surface"
  hyper-content-facade,../hyper-content/index.mjs,"explicit content adapter plus content-aware compile/packing and content pipeline"
  parity-test,../reference/test/framework-core-boundary.test.mjs,"exact web artifact parity and deterministic neutral compilation"
  pcn,../reference/src/pcn-emitter.ts,"approved compiler state to Page Contract Notation"
  articleir,../reference/src/articleir-parser.ts,"strict external output acceptance"
  unfolder,../reference/src/unfolder.ts,"deterministic Markdown/JSON-LD/HTML/sitemap lowering"
  provider,../reference/src/glm-provider.ts,"JSON transport plus external validation and bounded repair"
  workspace,../reference/src/agent-workspace.ts,"immutable snapshots, cycles and invalidation"
  current-wasm,../reference/src/wasm.ts,"content vector/facility kernels; not browser runtime"
  current-validation,../validation/reports/2026-07-18-task-surface-research-and-document-system.md,"organization, research, plan mutation, strengthened proof and nonclaims"

## decisions

decisions[21]{id,decision,ref}:
  D01,"maturity remains research prototype approaching near-alpha",../AGENTS.md
  D02,"hyper-content may depend on hyper-site; reverse dependency is forbidden",../scripts/check-product-boundaries.mjs
  D03,"all existing technologies are preserved but activation is evidence-gated",../planning/meta-plan-v3.json
  D04,"revenue validation is an independent W6 authority",../docs/planning/30-meta-plan-v3-executable-program.md
  D05,"neutral web compilation precedes content geometry",../reference/src/framework.ts
  D06,"Hyper Site public compile returns no packed content geometry",../hyper-site/test/boundary.test.mjs
  D07,"legacy web artifacts remain exactly equal during extraction",../reference/test/framework-core-boundary.test.mjs
  D08,"current Wasm remains content/research infrastructure",../reference/src/wasm.ts
  D09,"PR #3 stays draft until real outcomes pass",../planning/meta-plan-v3.json
  D10,"W7 is a permanent task-surface workstream; W3 remains temporary migration",../docs/architecture/32-governed-task-surface-architecture.md
  D11,"Hyper Content may propose task semantics but emits zero UI implementation logic",../docs/architecture/32-governed-task-surface-architecture.md
  D12,"browser surfaces submit typed intents and never mutate canonical runtime state directly",../docs/architecture/32-governed-task-surface-architecture.md
  D13,"public browser state is an allowlisted projection, not complete ontology, memory, reasoning, credentials, or provider payload",../docs/validation/33-task-surface-validation-matrix.md
  D14,"static fallback is canonical; native, declarative and sandboxed tiers are progressive enhancement",../docs/architecture/32-governed-task-surface-architecture.md
  D15,"A2UI, AG-UI, MCP Apps and AI Employee are adapters after the internal ABI passes",../docs/research/31-next-generation-task-surfaces-protocol-crosswalk.md
  D16,"theme, site and growth authors have distinct bounded authorities",../docs/architecture/32-governed-task-surface-architecture.md
  D17,"growth policy cannot widen capabilities, lower safety, expose private state or index sessions/artifacts",../docs/validation/33-task-surface-validation-matrix.md
  D18,"10K task-surface scale is mandatory performance evidence but not page-usefulness authority",../docs/validation/33-task-surface-validation-matrix.md
  D19,"relationship-projection notation remains W5 research and cannot use SDRT publicly",../docs/research/31-next-generation-task-surfaces-protocol-crosswalk.md
  D20,"numeric vectors cannot decide policy, authorization, privacy, safety, legality or indexing",../docs/intake/2026-07-18-next-generation-task-surfaces.md
  D21,"root documents follow the stateful docs lifecycle and catalog",../docs/README.md

## proof

validated_head{sha,status}:
  05d8961791c6451e480a6be453351b8722bca81f,"documentation organization, idempotency, plan, package boundaries, operator checks and all inherited regressions pass"

organization_run{workflow,run,job,head,result}:
  "Organize Repository Documents",29643257965,88077138733,05d8961791c6451e480a6be453351b8722bca81f,success

focused_run{workflow,run,job,head,result,artifact,digest}:
  "Hyper Site Near-Alpha Pipeline",29643257962,88077138692,05d8961791c6451e480a6be453351b8722bca81f,success,8429258946,"sha256:0f87a20a3e581573fdbba759e1fe1e31ec362bebfdce47bf3de990a60a837694"

reference_run{workflow,run,job,head,result}:
  "Hyper Site Reference",29643257988,88077138720,05d8961791c6451e480a6be453351b8722bca81f,success

proof_interpretation:
  "document migration and repeated synchronization are idempotent; research disposition, accepted target architecture, plan mutation, documentation gates, product boundaries and inherited source/UI regressions pass; runtime, adapter, field and 10K surface outcomes remain unimplemented"

## not proven

not_proven[19]:
  physical-source-ownership-in-hyper-site-src
  physical-content-geometry-ownership-in-hyper-content-src
  independent-package-tarball-consumption
  protocol-neutral-task-surface-ABI-source
  A2UI-conformance
  AG-UI-conformance
  MCP-Apps-conformance
  AI-Employee-public-adapter-isolation
  create-project-command
  dev-server-or-hmr
  publisher-or-deploy-command
  real-five-page-governed-task-site
  ordinary-framework-comparison
  ten-thousand-page-task-surface-performance
  live-pcn-articleir-provider-case
  accepted-real-governed-surface-cohort
  client-acceptance-or-positive-margin
  indexing-ranking-citations-conversion-or-revenue
  actual-near-alpha-release

## next

next[8]{order,step,task,gate}:
  1,P1.4,"move clean W1 source into hyper-site/src; classify UI modules; make reference consume package","zero reference runtime imports; one PageIR/renderer authority; tarball consumer pass"
  2,P1.5,"move vector packing/prototypes/geometry/current Wasm behind Hyper Content","zero W1 vector/Wasm exports; content-neutral UI plan; packed regressions green"
  3,P1.6,"implement protocol-neutral task/service/surface ABI with RED tests","zero protocol types in core ABI; zero projection leaks; idempotency and receipts; static fallback"
  4,P2.1,"create five-page site with one governed task page","three or fewer commands; complete no-JS fallback; shared runtime bundle"
  5,P2.2-P2.3,"dev/preview/publisher for static plus surface assets","correct invalidation, replay, immutable manifest, no partial publish"
  6,P2.5,"adapter conformance fixtures","A2UI, AG-UI, MCP Apps, AI Employee; no capability widening or critical semantic loss"
  7,P2.4,"ordinary-framework and mandatory 10K surface matrix","identical fixture; 20 runs; zero page-count-multiplied runtime bundle"
  8,P3.1-P3.4,"real content plus governed-surface cohort and recovery","independent acceptance; isolation; completion telemetry; zero duplicate effects"
