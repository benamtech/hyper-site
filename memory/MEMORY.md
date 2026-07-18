# Hyper Site Durable Memory

format: TOON-oriented Markdown  
status: active  
scope: standalone repository root  
updated_at: 2026-07-18T03:30:00-04:00

## protocol

memory_model{index,handoffs,mutation}:
  "memory/MEMORY.md","memory/YYYY-MM-DD-HHMM-<slug>.md","append immutable handoff; reconcile index; never overwrite timestamped files"

rules[8]:
  read-MEMORY-first
  read-newest-handoff-next
  timestamped-handoffs-immutable
  source-tests-artifacts-over-docs
  one-canonical-pipeline
  no-invented-business-truth
  no-same-model-self-acceptance
  bounded-repair-or-reject

## current

state{branch,pr,status}:
  agent/glm-blackwell-vertical-slice,3,"GLM/Blackwell production software vertical slice and operator CLI implemented; synthetic full emission passed; real field run pending"

pipeline:
  "repository/config/style/assets -> ProjectInput -> GLM Stage 1 proposal -> exact-hash approval -> existing ontology/graph/opportunity compiler -> approved core design -> GLM Stage 2 PageDraft batches -> external validation/repair -> existing PageConcept/SiteSource/PageIR compiler -> static design render -> bounded local corpus validation -> noindex site/reports/checkpoints"

physical_model_calls:
  "Stage 1 one bounded project proposal; Stage 2 deterministic page batches; Stage 3 optional observation-only independent review/repair"

## newest handoffs

handoffs[5]{at,file,status,scope}:
  2026-07-18T03:30:00-04:00,2026-07-18-0330-glm-blackwell-production-vertical-slice.md,current,"provider, appliance, approvals, design, transaction, recovery, operator CLI, 25/100/500/10K synthetic full path"
  2026-07-18T02:05:00-04:00,2026-07-18-0205-repository-ingestion-boundary.md,foundation,"standalone path reconciliation and explicit repository ingestion"
  2026-07-18T01:15:00-04:00,2026-07-18-0115-graph-triage-ci-closure.md,foundation,"graph research disposition and prior exact-head proof"
  2026-07-18T01:05:00-04:00,2026-07-18-0105-graph-learning-paper-triage.md,foundation,"learned graph promotion gates"
  2026-07-18T00:55:00-04:00,2026-07-18-0055-academic-crosswalk-harness-acceleration.md,foundation,"academic crosswalk and external harness"

## authority

read_order[13]{order,file,role}:
  1,../identity.md,"repository identity"
  2,../AGENTS.md,"operating contract"
  3,../CODEGRAPH.md,"implementation map"
  4,../README.md,"current product/operator boundary"
  5,MEMORY.md,"durable current state"
  6,2026-07-18-0330-glm-blackwell-production-vertical-slice.md,"latest immutable handoff"
  7,../validation/reports/2026-07-18-glm-blackwell-production-vertical-slice.md,"current measured report"
  8,2026-07-18-0205-repository-ingestion-boundary.md,"ingestion handoff"
  9,2026-07-18-0115-graph-triage-ci-closure.md,"prior exact-head proof"
  10,../26-graph-learning-paper-triage-and-promotion-gates.md,"learned-method gates"
  11,../25-academic-crosswalk-agent-harness-structured-generation-and-acceleration.md,"research crosswalk"
  12,../24-agent-discovered-ontology-and-10k-site-program.md,"compiler design authority"
  13,../validation/reports/,"measured reports"

Standalone rule: former parent/subtree/source-repository paths are historical only, never live targets.

## source state

layers[14]{layer,file,state}:
  operator-cli,../reference/scripts/production-cli.mjs,"doctor, ingest, provider check, approved run, static emission"
  stage1-cli,../reference/scripts/production-stage1.mjs,"live proposal command; credentials required"
  approval-cli,../reference/scripts/production-approve.mjs,"exact-hash ontology/design approval"
  appliance,../reference/src/appliance-contract.ts,"Blackwell optimized; H200/H100/A100/5090/4090 compatibility candidates"
  provider,../reference/src/glm-provider.ts,"Z.AI JSON mode + external validation + bounded repair"
  schemas,../reference/src/generation-schemas.ts,"Stage 1, Stage 2, optional Stage 3 contracts"
  design,../reference/src/design-authoring.ts,"core briefs, safe shared CSS, independent approval, restyle invariant"
  repository-ingestion,../reference/src/repository-ingestion.ts,"implemented; real operator snapshot pending"
  ontology-graph-opportunity,../reference/src/agent-site-orchestrator.ts,"existing governed compiler retained"
  transaction,../reference/src/page-draft-transaction.ts,"atomic PageConcept/SiteSource/PageIR/static build"
  corpus,../reference/src/corpus-validation-production.ts,"bounded exact/lexical/local-semantic/evidence/render validation"
  recovery,../reference/src/production-orchestrator.ts,"dependency-bound persistent checkpoint interface"
  publication,../reference/src/framework.ts,"static noindex PageIR authority"
  ci,../.github/workflows/production-pipeline.yml,"focused operator/production tests with transcript artifact"

## decisions

decisions[12]{id,decision,ref}:
  D01,"repository config is explicit truth, not extraction",../reference/src/repository-ingestion.ts
  D02,"every promoted field requires known source IDs",../reference/src/repository-ingestion.ts
  D03,"GLM JSON mode is transport safety, not semantic authority",../reference/src/glm-provider.ts
  D04,"two physical generation stages replace seven mandatory per-page API calls",../reference/src/production-orchestrator.ts
  D05,"same generator cannot approve ontology or design",../reference/src/generation-schemas.ts
  D06,"core-site design precedes bulk pages",../reference/src/design-authoring.ts
  D07,"one shared CSS artifact may restyle without changing content hashes",../reference/src/design-authoring.ts
  D08,"PageDrafts converge on existing PageConcept/SiteSource/PageIR compilers",../reference/src/page-draft-transaction.ts
  D09,"accepted outputs checkpoint after bounded validation",../reference/src/production-orchestrator.ts
  D10,"corpus validation is bounded and local-compute friendly",../reference/src/corpus-validation-production.ts
  D11,"hardware price is soft observed metadata",../reference/src/appliance-contract.ts
  D12,"synthetic full emission is not relevance or commercial proof",../README.md

## proof

focused_run{workflow,run,head,tests,total_ms,artifact_digest}:
  "Hyper Site Production Pipeline",29635741933,5cfcc85fd6fe6910b9e4a2e366581e5514f08ffa,"10/10",32641.755,"sha256:28026bc9919e9e0bebfa7de6fb4d59cddec37dc8b1c255134b9f30d225e4d8a8"

scale[3]{pages,elapsed_ms,candidates,html_bytes}:
  100,2489.626,3675,"recorded"
  500,3142.146,509,"recorded"
  10000,19179.290,12949,54291900

reference_validation:
  "same code/example head passed npm test, manifest, UI, orchestration, framework validate/preview, browser, and R3F"

## not proven

not_proven[10]:
  real-repository-run
  live-glm-quality-cost-latency
  real-gpu-throughput
  useful-insightful-pages
  factual-completeness
  real-design-quality
  held-out-relevance
  indexing-ranking-citations
  conversion-revenue-lifecycle
  gpu-hrr-ann-wasm-zig-advantage

## next

next[8]{order,task,gate}:
  1,"probe a real rented node","hardware/runtime/economic report"
  2,"capture one real repository/config/style/assets","operator approval and no invented truth"
  3,"run live provider check and Stage 1","schema/source/evidence/token/latency record"
  4,"independent ontology and core-design approval","exact hashes and observations"
  5,"generate 25 real noindex pages","atomic transaction and persistent recovery"
  6,"local semantic/evidence/render/browser/crawler/accessibility review","no hard failures"
  7,"freeze held-out human relevance judgments","independent acceptance corpus"
  8,"scale 100 -> 500 -> 10000","only after usefulness and lifecycle gates"
