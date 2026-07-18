# 2026-07-18 — Repository Ingestion Boundary

format: TOON-oriented Markdown  
status: validation report  
scope: standalone repository root

## change

implemented[4]:
  repository-snapshot-contract
  explicit-yaml-project-declaration
  field-level-evidence-binding
  deterministic-byte-and-ingestion-hashes

rejected[6]:
  inferred-business-purpose
  inferred-services-or-offers
  missing-declared-source-bytes
  unknown-field-evidence-source
  duplicate-repository-path
  root-relative-path-traversal

canonical_source:
  reference/src/repository-ingestion.ts

tests:
  reference/test/repository-ingestion.test.mjs

## validation vectors

validation[4]{vector,pass,fail,severity}:
  determinism,"same logical snapshot under file reordering has identical ingestionHash","hash depends on file ordering",hard
  byte-fidelity,"every declared source/asset resolves to captured bytes and content hash","missing path is accepted",hard
  evidence-fidelity,"all promoted field groups declare known source IDs","field is promoted without evidence or with unknown source",hard
  no-invention,"missing explicit business truth rejects even when prose contains plausible text","repository prose silently fills ProjectInput",hard

simpler_baseline:
  "hand-authored ProjectInput fixture without repository byte verification or field-level evidence"

## proof boundary

source proof is accepted only after the exact branch head passes the restored standalone workflow:

```text
npm test
manifest:emit
ui:emit
orchestration:check
framework:validate
framework:preview
browser:check
ui:r3f:build
```

The report does not claim a real operator declaration has been ingested. It does not claim relevance, information gain, useful page bodies, indexing, ranking, citations, conversion, revenue, or native/Wasm benefit.

## next gate

next[4]:
  real-repository-snapshot-adapter-and-operator-fixture
  stage1-json-schema-provider
  independent-reviewer-observation-approval
  frozen-real-context-corpus
