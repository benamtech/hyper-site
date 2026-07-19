# Handoff — Task-Surface Research and Documentation System

at: 2026-07-18T07:45:00-04:00  
branch: `agent/glm-blackwell-vertical-slice`  
pr: `#3` draft  
organized_repository_head: `d9ba0e36191c3d977a711740b21899d75cc4f3a5`  
report_commit: `2f549398e394ea757666263ffc905a89d2590abb`

## Completed

### Documentation system

- all 34 non-bootstrap root documents moved into lifecycle folders;
- root Markdown restricted to README, AGENTS, CODEGRAPH, CONTRIBUTING, and identity;
- machine catalog installed at `docs/catalog.json`;
- declarative migration manifest installed at `docs/legacy-root-moves.json`;
- stale-link, path-existence, catalog, root-allowlist, memory, and plan checks installed;
- three pre-HHMM memory handoffs preserved under `memory/legacy/`;
- current documents, immutable validation reports, and immutable memory handoffs remain separate authorities.

### Research and architecture

Created:

- `docs/intake/2026-07-18-next-generation-task-surfaces.md`
- `docs/research/31-next-generation-task-surfaces-protocol-crosswalk.md`
- `docs/research/sources/2026-07-18-task-surfaces.sources.json`
- `docs/architecture/32-governed-task-surface-architecture.md`
- `docs/validation/33-task-surface-validation-matrix.md`

Accepted target:

```text
static page explains and proves
-> protocol-neutral task service accepts typed intent
-> runtime adapter executes under policy
-> ordered events update an allowlisted public projection
-> resource, artifact, action, and receipt prove the outcome
```

A2UI, AG-UI, MCP Apps, and AMTECH AI Employee are adapters after the internal ABI passes. They are not the internal ABI.

### Corrected supplied thesis

- WebDriver remains a wire-boundary analogy only.
- Browser surfaces submit typed intents; they do not mutate canonical runtime state directly.
- ontology, PCN, ArticleIR, SiteManifest/PageIR, and AI Employee materialization retain separate authorities.
- the relationship-tensor notation remains W5 research and must not use `SDRT` publicly because the acronym is established in discourse semantics.
- numeric dimensions cannot decide authorization, privacy, legality, safety, or indexing.

### Executable program

Program shape is now:

```text
8 workstreams
6 phases
25 dependency-checked steps
31 preserved technologies/protocol arms
5 plan outcomes
6 falsifiable hypotheses
```

Added:

- W7 task-surface-platform;
- O5 governed-task-surface outcome;
- H5 protocol-adapter interoperability;
- H6 relationship-projection notation comparison;
- P1.6 protocol-neutral ABI;
- P2.5 protocol adapter fixtures;
- P3.4 real governed-surface cohort and recovery.

P1.4, P1.5, P2.1-P2.4, and P3.1-P3.3 were revised to include content-neutral UI extraction, static fallback, shared bundles, 10K surface scale, adapter conformance, independent content/service acceptance, idempotency, and receipts.

## Validation

Migration workflow:

```text
Organize Repository Documents
run 29642918708
job 88076295118
success
```

Inherited source/research regression:

```text
Hyper Site Near-Alpha Pipeline
run 29642918710
success
artifact 8429164477
sha256:1875d102673c7fae78e874968e880b051f456e58d5dac6fee7365683a53b0c04

Hyper Site Reference
run 29642918717
success
```

The next connector-authored evidence commit must trigger both inherited workflows on the organized tree and update the validation report with the exact final head and run IDs.

## Not implemented

- P1.4 physical framework ownership;
- P1.5 physical content geometry/Wasm ownership;
- P1.6 task-surface ABI source;
- protocol adapters;
- public AI Employee isolation;
- governed five-page task fixture;
- 10K surface benchmark;
- field, conversion, or revenue proof.

## Next

```text
P1.4
  physically extract neutral W1 source
  classify ui-scaffold/ui-metaprogramming/ui-renderer
  move only content-neutral contracts
  make reference consume workspace package

P1.5
  move vectors/prototypes/packing/current Wasm behind Hyper Content
  remove geometry from W1 UI plans

P1.6
  RED tests for schema, projection leakage, idempotency, receipts, fallback, and author boundaries
  implement protocol-neutral contracts only after P1.4/P1.5
```

Keep PR #3 draft and unmerged.
