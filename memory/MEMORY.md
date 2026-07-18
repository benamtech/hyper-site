# Hyper Site Durable Memory

format: TOON-oriented Markdown  
status: active  
scope: standalone repository root  
updated_at: 2026-07-18T04:00:00-04:00

## protocol

memory_model{index,handoffs,mutation}:
  "memory/MEMORY.md","memory/YYYY-MM-DD-HHMM-<slug>.md","append immutable handoff; reconcile index; never overwrite timestamped files"

rules[10]:
  read-MEMORY-first
  read-newest-handoff-next
  timestamped-handoffs-immutable
  source-tests-artifacts-over-docs
  one-canonical-publication-pipeline
  no-invented-business-truth
  no-same-model-self-acceptance
  bounded-repair-or-reject
  synthetic-scale-is-not-framework-quality
  ordinary-framework-and-real-case-gates-before-alpha

## current

state{branch,pr,status,maturity,merge}:
  agent/glm-blackwell-vertical-slice,3,"GLM/GPU boundary plus continuous workspace and near-alpha rejection authority implemented; synthetic suites pass; real framework evidence pending","research prototype approaching near-alpha","keep draft; do not merge"

product_identity:
  "agent-first web framework and experience compiler; large-batch page generation is one workload, not the product definition"

lifecycle:
  "repository intake -> business datasheets/evidence -> design/type/layout/graphics/starter site -> bounded ontology/PageDraft jobs -> canonical PageIR/static site -> review -> post-generation maintenance -> next immutable workspace snapshot"

continuous_agent:
  "repeated explicit checkpointed invocations over versioned artifacts; never an opaque perpetual loop or automatic publication"

physical_model_calls:
  "Stage 1 one bounded ontology proposal; Stage 2 deterministic PageDraft batches; Stage 3 optional independent observation/repair only"

## newest handoffs

handoffs[6]{at,file,status,scope}:
  2026-07-18T04:00:00-04:00,2026-07-18-0400-near-alpha-framework-reframe.md,current,"maturity reset, continuous workspace, strict release gate, ordinary-framework and 10K maintenance requirements"
  2026-07-18T03:30:00-04:00,2026-07-18-0330-glm-blackwell-production-vertical-slice.md,historical-foundation,"provider/appliance/design/transaction/recovery and synthetic full emission; production maturity framing superseded"
  2026-07-18T02:05:00-04:00,2026-07-18-0205-repository-ingestion-boundary.md,foundation,"standalone repository ingestion"
  2026-07-18T01:15:00-04:00,2026-07-18-0115-graph-triage-ci-closure.md,foundation,"graph research disposition"
  2026-07-18T01:05:00-04:00,2026-07-18-0105-graph-learning-paper-triage.md,foundation,"learned graph promotion gates"
  2026-07-18T00:55:00-04:00,2026-07-18-0055-academic-crosswalk-harness-acceleration.md,foundation,"academic crosswalk and harness"

## authority

read_order[15]{order,file,role}:
  1,../identity.md,"near-alpha architect identity"
  2,../AGENTS.md,"operating and scientific contract"
  3,../CODEGRAPH.md,"canonical lifecycle and implementation map"
  4,../README.md,"current product, CLI, maturity, and next gates"
  5,MEMORY.md,"durable current state"
  6,2026-07-18-0400-near-alpha-framework-reframe.md,"latest immutable handoff"
  7,../validation/reports/2026-07-18-near-alpha-framework-reframe.md,"current measured validation and nonclaims"
  8,../27-near-alpha-framework-validation-and-continuous-agent-workspace.md,"near-alpha framework design authority"
  9,../26-graph-learning-paper-triage-and-promotion-gates.md,"graph/network promotion gates"
  10,../25-academic-crosswalk-agent-harness-structured-generation-and-acceleration.md,"research crosswalk"
  11,../24-agent-discovered-ontology-and-10k-site-program.md,"10K experiment and compiler design"
  12,2026-07-18-0330-glm-blackwell-production-vertical-slice.md,"historical software vertical-slice handoff"
  13,2026-07-18-0205-repository-ingestion-boundary.md,"ingestion handoff"
  14,2026-07-18-0115-graph-triage-ci-closure.md,"prior proof"
  15,../validation/reports/,"measured reports"

Standalone rule: former parent/subtree/source-repository paths are historical only, never live targets.

## source state

layers[19]{layer,file,state}:
  maturity-evaluator,../reference/src/near-alpha-framework.ts,"bulk/core/TDD/science/network/real-case/page/baseline/scale validation"
  release-gate,../reference/src/near-alpha-release.ts,"complete non-synthetic case plus zero fail/pending required"
  workspace,../reference/src/agent-workspace.ts,"immutable snapshots, cycles, lifecycle, transitive invalidation; logical only"
  workspace-cli,../reference/scripts/workspace-cli.mjs,"init/append/replace/invalidate/summary"
  near-alpha-cli,../reference/scripts/near-alpha-cli.mjs,"research evaluate and strict release modes"
  operator-cli,../reference/scripts/production-cli.mjs,"doctor, ingest, provider check, approved run, static emission"
  stage1-cli,../reference/scripts/production-stage1.mjs,"live proposal command; credentials required"
  approval-cli,../reference/scripts/production-approve.mjs,"exact-hash ontology/design approval"
  appliance,../reference/src/appliance-contract.ts,"Blackwell optimized; H200/H100/A100/5090/4090 compatibility candidates"
  provider,../reference/src/glm-provider.ts,"Z.AI JSON mode + external validation + bounded repair"
  schemas,../reference/src/generation-schemas.ts,"Stage 1, Stage 2, optional Stage 3 contracts"
  design,../reference/src/design-authoring.ts,"core briefs, design tokens, safe shared CSS, restyle invariant"
  repository-ingestion,../reference/src/repository-ingestion.ts,"explicit bytes/config/evidence; real operator snapshot pending"
  ontology-graph-opportunity,../reference/src/agent-site-orchestrator.ts,"existing governed compiler retained"
  transaction,../reference/src/page-draft-transaction.ts,"atomic PageConcept/SiteSource/PageIR/static build"
  corpus,../reference/src/corpus-validation-production.ts,"bounded exact/lexical/local-semantic/evidence/render validation"
  recovery,../reference/src/production-orchestrator.ts,"dependency-bound generation checkpoints"
  publication,../reference/src/framework.ts,"canonical static noindex PageIR authority"
  ci,../.github/workflows/production-pipeline.yml,"near-alpha commands and 20 focused rejection/positive/scale tests"

## decisions

decisions[18]{id,decision,ref}:
  D01,"maturity is research prototype approaching near-alpha, not production",../AGENTS.md
  D02,"10K is an experimental tier, not minimum job or product definition",../24-agent-discovered-ontology-and-10k-site-program.md
  D03,"large-batch generation is one framework workload",../README.md
  D04,"continuous agent means checkpointed workspace invocations",../reference/src/agent-workspace.ts
  D05,"workspace spans initial authoring, starter site, bulk generation, and maintenance",../reference/src/near-alpha-framework.ts
  D06,"artifact kind never infers page or route cardinality",../reference/src/agent-workspace.ts
  D07,"strict near-alpha release requires a complete real case and zero pending",../reference/src/near-alpha-release.ts
  D08,"ordinary static/SSR/SPA baseline is mandatory",../27-near-alpha-framework-validation-and-continuous-agent-workspace.md
  D09,"10K evidence requires incremental maintenance and invalidation matrix",../27-near-alpha-framework-validation-and-continuous-agent-workspace.md
  D10,"every page requires task, information/utility, evidence, neighbor difference, and owner",../reference/src/near-alpha-framework.ts
  D11,"network science requires simpler baseline and held-out action outcome",../26-graph-learning-paper-triage-and-promotion-gates.md
  D12,"repository config is explicit truth, not extraction",../reference/src/repository-ingestion.ts
  D13,"GLM JSON mode is transport safety, not semantic authority",../reference/src/glm-provider.ts
  D14,"same generator cannot approve ontology or design",../reference/src/generation-schemas.ts
  D15,"core-site design precedes bulk pages",../reference/src/design-authoring.ts
  D16,"PageDrafts converge on existing PageConcept/SiteSource/PageIR authorities",../reference/src/page-draft-transaction.ts
  D17,"hardware price is soft observed metadata",../reference/src/appliance-contract.ts
  D18,"synthetic full emission is not relevance, framework, or commercial proof",../validation/reports/2026-07-18-near-alpha-framework-reframe.md

## proof

near_alpha_run{workflow,run,job,head,tests,total_ms,artifact_digest}:
  "Hyper Site Near-Alpha Pipeline",29636565648,88059836329,9e03b1b6d43a574bb09fdcfd28f6edd153e56c68,"20/20",36321.318,"sha256:a9d4362b7068ac8e76b0088995700b9e62234b647c4886e0cbbe21970bd6c3d1"

scale[3]{pages,elapsed_ms,candidates,html_bytes}:
  100,2724.549,3675,"recorded"
  500,3425.700,509,"recorded"
  10000,21867.767,12949,54291900

reference_run{workflow,run,job,head,result}:
  "Hyper Site Reference",29636565641,88059836315,9e03b1b6d43a574bb09fdcfd28f6edd153e56c68,success

reference_steps:
  "npm test; manifest; UI; orchestration; framework validate/preview; browser; R3F"

proof_interpretation:
  "synthetic source wiring, rejection, recovery, canonical static emission, logical workspace invalidation, and bounded 10K execution only"

## not proven

not_proven[15]:
  actual-near-alpha-release
  real-five-page-starter-site
  complete-non-synthetic-case-study
  live-glm-quality-cost-latency
  real-gpu-throughput
  real-design-typography-layout-graphics-quality
  real-asset-generation-and-rights-workflow
  continuous-operation-beyond-file-snapshots
  incremental-compiler-or-dev-server-performance
  ordinary-framework-advantage
  real-page-relevance-information-gain-accessibility
  network-science-benefit
  useful-indexable-10k-pages
  indexing-ranking-citations
  conversion-revenue-lifecycle-return

## next

next[10]{order,task,gate}:
  1,"freeze one real five-page starter-site case","inspectable goals, sources, design judgments, assets, operator"
  2,"capture business/design/type/layout/graphics/asset authority","no invented facts or rights"
  3,"link actual compiler/design/asset outputs into workspace","real dependencies and canonical cardinality"
  4,"run live provider and rented node","tokens/latency/failures/hardware/runtime/economic report"
  5,"build same case in an ordinary framework","same fixture/machine/runtime/build/cache controls"
  6,"compare authoring/cold/incremental/dev/output/browser/accessibility/operator work","predeclared falsifiable hypotheses"
  7,"extend to 25 real noindex pages","page-existence records and post-generation changes"
  8,"freeze held-out design/relevance/graph judgments","independent acceptance corpus"
  9,"scale 100 then 500","same full framework path and maintenance"
  10,"run 10K maintenance matrix and decide alpha","strict release gate: real case + zero fail/pending"
