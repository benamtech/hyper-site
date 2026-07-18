# Hyper Monorepo Durable Memory

format: TOON-oriented Markdown  
status: active  
scope: standalone repository root  
updated_at: 2026-07-18T06:30:00-04:00

## protocol

memory_model{index,handoffs,mutation}:
  "memory/MEMORY.md","memory/YYYY-MM-DD-HHMM-<slug>.md","append immutable handoff; reconcile index; never overwrite timestamped files"

rules[14]:
  read-MEMORY-first
  read-newest-handoff-next
  timestamped-handoffs-immutable
  source-tests-artifacts-over-docs
  two-products-one-publication-target
  hyper-content-depends-on-hyper-site-only
  one-web-artifact-authority-during-migration
  plan-steps-require-TDD-effects-rollback-and-metrics
  no-invented-business-truth
  no-same-model-self-acceptance
  bounded-repair-or-reject
  synthetic-scale-is-not-framework-quality
  content-pipeline-timing-is-not-framework-timing
  ordinary-framework-real-case-and-revenue-gates-before-alpha

## current

state{branch,pr,validated_head,status,maturity,merge}:
  agent/glm-blackwell-vertical-slice,3,0294935130deeed5ba9f2d4d975f464a79aa4b65,"META-PLAN-V3 active; P0.2 and P1.1-P1.3 complete; neutral framework, neutral SiteManifest, and explicit content-program adapter exact-CI green; physical package migration and real outcomes pending","research prototype approaching near-alpha","keep draft; do not merge"

product_identity:
  "two products in one monorepo: hyper-site static web framework; hyper-content ontology/evidence/content compiler targeting hyper-site"

dependency_direction:
  "hyper-content -> hyper-site; reverse dependency prohibited"

current_compile_paths:
  "hyper-site -> reference/dist/framework-core.js -> content-neutral static artifacts"
  "hyper-content -> reference/dist/content-program-adapter.js -> geometry-free SiteSource parity proof"
  "hyper-content legacy compile -> reference/dist/framework.js -> framework-core -> vector prototypes and packed IR"

program_authority:
  "planning/meta-plan-v3.json + planning/meta-plan-v3.steps.json; 7 workstreams, 6 phases, 22 steps, 22 preserved technologies, 4 outcomes, 4 hypotheses"

content_backend:
  "approved compiler state -> deterministic PCN -> provider -> external ArticleIR acceptance -> deterministic unfolder -> hyper-site"

## newest handoffs

handoffs[9]{at,file,status,scope}:
  2026-07-18T06:30:00-04:00,2026-07-18-0630-content-program-adapter.md,current,"P1.3 explicit geometry-free SiteSource adapter, parity gate, exact CI"
  2026-07-18T06:10:00-04:00,2026-07-18-0610-meta-plan-v3-framework-core-extraction.md,foundation,"executable program authority, neutral compiler and SiteManifest, compatibility adapter"
  2026-07-18T05:30:00-04:00,2026-07-18-0530-product-boundary-folder-split.md,foundation,"research-supported two-product decision, root folders, boundary tests, PCN backend classification"
  2026-07-18T04:00:00-04:00,2026-07-18-0400-near-alpha-framework-reframe.md,superseded-product-framing,"maturity reset, continuous workspace, strict release gate, ordinary-framework and 10K maintenance requirements"
  2026-07-18T03:30:00-04:00,2026-07-18-0330-glm-blackwell-production-vertical-slice.md,historical-foundation,"provider/appliance/design/transaction/recovery and synthetic full emission"
  2026-07-18T02:05:00-04:00,2026-07-18-0205-repository-ingestion-boundary.md,foundation,"standalone repository ingestion"
  2026-07-18T01:15:00-04:00,2026-07-18-0115-graph-triage-ci-closure.md,foundation,"graph research disposition"
  2026-07-18T01:05:00-04:00,2026-07-18-0105-graph-learning-paper-triage.md,foundation,"learned graph promotion gates"
  2026-07-18T00:55:00-04:00,2026-07-18-0055-academic-crosswalk-harness-acceleration.md,foundation,"academic crosswalk and harness"

## authority

read_order[16]{order,file,role}:
  1,../identity.md,"two-product architect identity"
  2,../AGENTS.md,"product boundary and scientific operating contract"
  3,../CODEGRAPH.md,"framework/content code graphs and migration map"
  4,../README.md,"current monorepo product and maturity"
  5,../docs/planning/30-meta-plan-v3-executable-program.md,"current executable program rationale and phase authority"
  6,../planning/meta-plan-v3.json,"machine program, workstreams, outcomes, hypotheses"
  7,../planning/meta-plan-v3.steps.json,"machine TODO DAG, TDD, effects, rollback and pass metrics"
  8,MEMORY.md,"durable current state"
  9,2026-07-18-0630-content-program-adapter.md,"latest immutable handoff"
  10,../validation/reports/2026-07-18-content-program-adapter.md,"P1.3 exact validation proof"
  11,2026-07-18-0610-meta-plan-v3-framework-core-extraction.md,"P0.2/P1.1/P1.2 handoff"
  12,../validation/reports/2026-07-18-meta-plan-v3-framework-core-extraction.md,"P0.2/P1.1/P1.2 proof"
  13,../docs/architecture/29-product-boundary-research-and-root-folder-split.md,"research and folder decision"
  14,../hyper-site/README.md,"framework ownership"
  15,../hyper-content/README.md,"content compiler ownership"
  16,../validation/reports/,"measured reports"

## source state

layers[22]{layer,file,state}:
  program-index,../planning/meta-plan-v3.json,"workstreams, phases, placements, outcomes, hypotheses and draft branch policy"
  program-steps,../planning/meta-plan-v3.steps.json,"22 dependency-checked TODO steps; P0.2 and P1.1-P1.3 complete"
  plan-validator,../scripts/check-meta-plan.mjs,"DAG, metrics, preservation, outcome and revenue assertions"
  contribution-standard,../CONTRIBUTING.md,"branch, TDD, evidence, failure and claim rules"
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
  focused-ci,../.github/workflows/production-pipeline.yml,"plan, boundary, adapter, operator and focused regression gates"
  full-ci,../.github/workflows/reference.yml,"full tests, emission, orchestration, preview, browser and R3F"
  validation,../validation/reports/2026-07-18-content-program-adapter.md,"P1.3 exact proof and nonclaims"

## decisions

decisions[13]{id,decision,ref}:
  D01,"maturity remains research prototype approaching near-alpha",../AGENTS.md
  D02,"hyper-content may depend on hyper-site; reverse dependency is forbidden",../scripts/check-product-boundaries.mjs
  D03,"all existing technologies are preserved but activation is evidence-gated",../planning/meta-plan-v3.json
  D04,"revenue validation is an independent W6 authority, not an inference from technical tests",../docs/planning/30-meta-plan-v3-executable-program.md
  D05,"neutral web compilation precedes content geometry in the compatibility path",../reference/src/framework.ts
  D06,"Hyper Site public compile returns no packed content geometry",../hyper-site/test/boundary.test.mjs
  D07,"legacy web artifacts must remain exactly equal during extraction",../reference/test/framework-core-boundary.test.mjs
  D08,"legacy mixed manifest remains preserved until physical migration and consumer enumeration",../docs/planning/30-meta-plan-v3-executable-program.md
  D09,"current Wasm remains content/research infrastructure",../reference/src/wasm.ts
  D10,"nominal model memory and token pricing are hypotheses or formulas, not workload proof",../docs/planning/30-meta-plan-v3-executable-program.md
  D11,"ordinary-framework, real-provider, field and revenue evidence remain mandatory",../planning/meta-plan-v3.steps.json
  D12,"PR #3 stays draft until all release outcomes pass",../planning/meta-plan-v3.json
  D13,"Content Program adaptation is explicit, geometry-free, and artifact-parity checked",../reference/src/content-program-adapter.ts

## proof

focused_run{workflow,run,job,head,result,artifact,digest}:
  "Hyper Site Near-Alpha Pipeline",29640789068,88070853269,0294935130deeed5ba9f2d4d975f464a79aa4b65,success,8428543453,"sha256:5c6468620f48c8a2caff69d87e915bd4d8253251752a84d6d5849547dfe86276"

focused_steps:
  "TypeScript build; plan validation; product boundary and explicit adapter gate; package tests; operator checks; framework-core/content-program parity; backend/near-alpha/release/workspace tests"

reference_run{workflow,run,job,head,result}:
  "Hyper Site Reference",29640789083,88070853184,0294935130deeed5ba9f2d4d975f464a79aa4b65,success

reference_steps:
  "full npm test; manifest; UI; orchestration; framework validate/preview; browser; R3F"

proof_interpretation:
  "P0.2 and P1.1-P1.3 pass; public Hyper Site is geometry-free; Hyper Content preserves legacy packed behavior and now has an explicit neutral adapter; independent ship, field and commercial outcomes remain unproven"

## not proven

not_proven[13]:
  physical-source-ownership-in-hyper-site-src
  independent-package-tarball-consumption
  create-project-command
  dev-server-or-hmr
  publisher-or-deploy-command
  real-five-page-hyper-site-case
  ordinary-framework-comparison
  live-pcn-articleir-provider-case
  accepted-25-page-cohort
  real-gpu-throughput-or-concurrent-fit
  client-acceptance-or-positive-margin
  indexing-ranking-citations-or-conversion
  actual-near-alpha-release

## next

next[7]{order,step,task,gate}:
  1,P1.4,"move clean W1 source into hyper-site/src and make reference consume package","zero runtime reference imports from Hyper Site; single PageIR authority"
  2,P1.5,"move vector packing/prototypes/current Wasm physically behind Hyper Content","zero vector exports from Hyper Site; packed regressions green"
  3,P2.1,"create five-page standalone scaffold","three or fewer commands; no content concepts"
  4,P2.2-P2.4,"dev/preview/publisher and frozen ordinary-framework comparison","correctness, repeatability and identical fixture"
  5,P3.1-P3.3,"real provider cohort and recovery proof","25 accepted noindex pages; zero unsupported claims"
  6,P4.1-P4.3,"paid or signed client delivery","acceptance, positive gross margin and substantiated claims"
  7,P5.1-P5.5,"preregistered calibration and scale decisions","100 outcomes; held-out promotion or negative result"
