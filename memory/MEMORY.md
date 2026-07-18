# Hyper Site Durable Memory

format: TOON-oriented Markdown  
status: active  
scope: standalone repository root  
updated_at: 2026-07-18T02:05:00-04:00

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
  agent/frontier-ingestion-20260718,2,"evidence-gated repository ingestion implemented; exact-head CI required before merge"

pipeline:
  "repository snapshot + explicit config -> ProjectInput -> AgentOntologyProposal -> ApprovedOntology -> typed sparse graph/constraints -> bounded opportunity regions -> sparse concave selection -> HRR -> SiteGenerationPlan -> PageConceptProposal -> CandidatePageSeed -> PageCoordinate/CorpusPlan/PageGenerationJob -> manifest/PageIR/static UI"

job_boundary:
  "one job is one finite full-site generation run; not request-time serving"

## newest handoffs

handoffs[4]{at,file,status,scope}:
  2026-07-18T02:05:00-04:00,2026-07-18-0205-repository-ingestion-boundary.md,current,"standalone path reconciliation and explicit repository ingestion"
  2026-07-18T01:15:00-04:00,2026-07-18-0115-graph-triage-ci-closure.md,foundation,"graph research disposition and prior exact-head proof"
  2026-07-18T01:05:00-04:00,2026-07-18-0105-graph-learning-paper-triage.md,foundation,"learned graph promotion gates"
  2026-07-18T00:55:00-04:00,2026-07-18-0055-academic-crosswalk-harness-acceleration.md,foundation,"academic crosswalk, external harness, structured generation, acceleration"

## authority

read_order[12]{order,file,role}:
  1,../identity.md,"repository identity"
  2,../AGENTS.md,"operating contract"
  3,../CODEGRAPH.md,"implementation map"
  4,../README.md,"current product boundary"
  5,MEMORY.md,"durable current state"
  6,2026-07-18-0205-repository-ingestion-boundary.md,"latest immutable handoff"
  7,2026-07-18-0115-graph-triage-ci-closure.md,"latest prior proof"
  8,../26-graph-learning-paper-triage-and-promotion-gates.md,"learned-method gates"
  9,../25-academic-crosswalk-agent-harness-structured-generation-and-acceleration.md,"research crosswalk"
  10,../24-agent-discovered-ontology-and-10k-site-program.md,"compiler design authority"
  11,../validation/reports/2026-07-18-repository-ingestion-boundary.md,"current validation boundary"
  12,../validation/reports/,"measured reports"

Standalone rule: former `GTM-RESEARCH/website-framework`, parent-directory, removed `mvp-build`, and source-repository paths are historical only, never live targets.

## source state

layers[10]{layer,file,state}:
  repository-ingestion,../reference/src/repository-ingestion.ts,"implemented; real operator snapshot pending"
  project-truth,../reference/src/project-input.ts,implemented
  ontology,../reference/src/ontology-discovery.ts,"compiler-gated; real provider/reviewer pending"
  graph,../reference/src/ontology-graph.ts,"typed sparse; real observations pending"
  opportunity,../reference/src/opportunity-space-production.ts,"synthetic 10k planning pass"
  hrr,../reference/src/opportunity-space-optimized.ts,"structural representation only"
  stage2,../reference/src/site-program.ts,"contract; provider/transaction pending"
  generation,../reference/src/page-generation.ts,"provider-neutral runner"
  publication,../reference/src/framework.ts,"static source pass; field validation pending"
  ci,../.github/workflows/reference.yml,"restored standalone validation workflow"

## decisions

decisions[8]{id,decision,ref}:
  D01,"repository config is explicit truth, not an extraction prompt",../reference/src/repository-ingestion.ts
  D02,"every promoted field requires known source IDs",../reference/src/repository-ingestion.ts
  D03,"declared source and asset paths must resolve to captured bytes",../reference/src/repository-ingestion.ts
  D04,"repository prose never fills missing business truth",../reference/src/repository-ingestion.ts
  D05,"Stage-1 and Stage-2 model output remains proposal state",../AGENTS.md
  D06,"TypeScript remains semantic/production oracle",../reference/src/acceleration-decision.ts
  D07,"graph/learned/native methods remain comparison-only",../26-graph-learning-paper-triage-and-promotion-gates.md
  D08,"synthetic source proof is not search or commercial proof",../README.md

## proof

inherited_scale{tests,candidates,selected,batches,total_ms}:
  "46/46",15000,10000,400,5284.510

current_validation:
  "new ingestion tests plus full standalone workflow; exact final head/run must be recorded after completion"

not_proven[8]:
  real-relevance
  useful-page-bodies
  indexing
  ranking-or-citations
  conversion
  revenue
  complete-10k-ui
  wasm-or-gpu-advantage

## next

next[6]{order,task,gate}:
  1,"real repository/config capture","no invented ProjectInput truth"
  2,"Stage-1 JSON-schema provider","schema + semantic + evidence fidelity"
  3,"independent reviewer workflow","approved ontology and observations"
  4,"frozen real ContextCorpus","held-out judgments"
  5,"100-500 noindex Stage-2 jobs + atomic transaction","information gain and cannibalization"
  6,"browser/crawler/accessibility/static validation","acceptance before scale"
