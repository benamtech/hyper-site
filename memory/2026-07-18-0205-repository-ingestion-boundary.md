# 2026-07-18 02:05 ET — Repository Ingestion Boundary Handoff

format: TOON-oriented Markdown  
status: immutable handoff  
scope: standalone repository root

## state

branch_pr{branch,pr,base}:
  agent/frontier-ingestion-20260718,2,main

implemented[7]:
  standalone-authority-path-reconciliation
  restored-reference-ci-workflow
  repository-snapshot-contract
  explicit-hyper-site-project-yaml-ingestion
  repository-source-and-asset-byte-verification
  field-level-evidence-binding
  deterministic-ingestion-hash

source[3]:
  reference/src/repository-ingestion.ts
  reference/src/index.ts
  reference/test/repository-ingestion.test.mjs

docs[5]:
  AGENTS.md
  CODEGRAPH.md
  README.md
  validation/reports/2026-07-18-repository-ingestion-boundary.md
  memory/MEMORY.md

## invariants

rules[7]:
  explicit-business-truth-only
  no-repository-prose-promotion
  every-promoted-field-has-known-source-ids
  every-declared-source-or-asset-resolves-to-bytes
  root-relative-paths-only
  deterministic-under-file-ordering
  normalize-through-existing-ProjectInput-pipeline

## proof

validation:
  "exact final branch head must pass .github/workflows/reference.yml before merge to main"

new_tests[4]:
  deterministic-file-order
  missing-source-byte-rejection
  unsupported-field-rejection
  no-business-truth-inference

not_claimed[8]:
  real-business-ingestion-complete
  real-relevance
  useful-pages
  indexing-or-ranking
  ai-citations
  conversion-or-revenue
  10k-complete-ui
  wasm-or-gpu-advantage

## next

next[6]{order,task,gate}:
  1,"capture one real repository plus operator-approved config","no invented ProjectInput truth"
  2,"Stage-1 JSON-schema provider adapter","schema + semantic + evidence fidelity"
  3,"independent reviewer and observation approval","approved real ontology"
  4,"frozen real ContextCorpus","held-out judgments"
  5,"100-500 noindex Stage-2 jobs plus atomic output transaction","information gain and cannibalization"
  6,"browser/crawler/accessibility/static validation","delivery acceptance before scale"
