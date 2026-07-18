# AGENTS.md — Hyper Monorepo Operating Contract

Status: active implementation contract  
Updated: 2026-07-18

## Read first

1. `identity.md`
2. `AGENTS.md`
3. `CODEGRAPH.md`
4. `README.md`
5. `docs/README.md`
6. `docs/catalog.json`
7. `memory/MEMORY.md`
8. newest immutable handoff
9. newest measured validation report
10. current task-specific research -> architecture -> plan -> validation chain

Current authority chain:

- `docs/research/43-useful-framework-and-agent-first-pipeline-audit.md`
- `docs/architecture/44-useful-framework-and-agent-first-target-architecture.md`
- `docs/planning/45-depth-first-framework-and-agent-recovery-plan.md`
- `docs/validation/46-useful-framework-and-agent-first-gates.md`

## Three-layer boundary

```text
Hyper Content (optional producer) -> Hyper Site
External agent control plane -> public tools and artifacts
Hyper Site -X-> Hyper Content
Package cores -X-> orchestration runtime internals
Browser surfaces -X-> durable effects
```

### Hyper Site

Owns content-neutral `SiteSource`, `PageIR`, deterministic compilation, rendering, routing, metadata, structured data, sitemap, components, layouts, themes, assets, diagnostics, framework CLI and publisher interfaces.

Must work without Hyper Content, an LLM, an agent runtime or a GPU.

### Hyper Content

Owns evidence intake, claims, page-existence records, content proposals, structured generation, validation, maintenance proposals and portable Hyper Site input.

Experimental graph, vector, retrieval, Wasm and GPU methods remain optional and removable.

### External agent control plane

Owns run state, checkpoints, retries, timeouts, cancellation, human approval, policy, credentials, connectors, idempotency, effects, receipts and telemetry.

Use an established durable runtime category through adapters. Do not hide a custom durable runtime inside Hyper Site or Hyper Content.

### Reference

`reference/` is transitional implementation authority. Its target role is consumer, compatibility suite, fixture library, examples and benchmarks.

Current truth:

- most canonical source still resides under `reference/src`;
- `hyper-site/index.mjs` still delegates to `reference/dist/framework-core.js`;
- package extraction is incomplete;
- folder names and facades are not proof of ownership.

## One-authority rule

During extraction, never create a second compiler, `PageIR`, renderer, sitemap or publisher. Add a compatibility adapter, prove parity, move ownership, then remove the old authority.

## Ordinary framework floor

No framework differentiation claim is allowed until a clean external developer can complete:

```text
create -> dev -> build -> preview -> inspect -> local publish
```

for five distinct real pages without Hyper Content or the agent control plane.

The direct control is Astro or another suitable ordinary static framework using the same facts, design, assets and output requirements.

## Agent-first rule

Agent-first means durable and operator-visible, not autonomous by default.

Every run must have:

```text
run_id
input snapshot
bounded plan
step state
tool evidence
checkpoint
approval state
artifact manifest
trace correlation
final receipt or failure
```

Workflow/planning logic is side-effect free and replay-safe. Non-deterministic model calls and consequential effects are isolated tasks/activities. Effects require idempotency and commit-time revalidation of approval, branch, artifact, policy and target.

## Build versus integrate

Build only Hyper-owned invariants:

- compiler and renderer contracts;
- framework CLI and diagnostics;
- artifact and dependency manifests;
- portable content contracts;
- validation needed by the five-page proof.

Integrate first for:

- durable workflow execution;
- agent checkpointing and human interruption;
- connectors and business effects;
- authorization and secret management;
- telemetry collection/export;
- experiment statistics;
- editorial CMS workflow.

## Baseline-first rule

Every advanced method requires a simpler control:

- ontology graph vs typed JSON/relational data;
- embeddings vs lexical/rule retrieval;
- SDRT/GNN linking vs explicit links and entity co-occurrence;
- HRR/HDC vs ordinary maps/vectors;
- Wasm vs JavaScript/server code;
- GPU vs CPU/provider API;
- generated UI vs trusted static components;
- agent workflow vs deterministic state machine or established orchestrator;
- autonomous page plan vs human-curated plan.

Novelty, mathematical validity and synthetic scale do not establish product value.

## Incremental correctness

The dependency index is a hypothesis about affected artifacts. Every maintenance test freezes an expected affected set before execution and records:

```text
required but missed
unexpected changed
unchanged as expected
partial output after rejection
```

A graph that only verifies its declared edges cannot prove complete dependency capture.

## Current execution order

```text
R0 truth reconciliation
-> R1 physical extraction
-> R2 ordinary framework floor
-> R3 five-page usefulness comparison
-> R4 maintenance correctness and value
-> R5 durable agent wrapper
-> R6 approved idempotent publication
```

Task-surface implementation, SDRT, GNNs, GPU promotion, browser Wasm promotion, 10K publication and autonomous effects remain blocked until R4 passes.

## Required evidence for substantive changes

Every architecture, algorithm, performance or promotion change names:

```text
hypothesis
owned invariant
primary metric
falsification rule
simple baseline
negative control
fixture and environment
pass/fail threshold
rollback
measured evidence
```

Hard failures stop execution. Pending and not-run remain visible.

## Page-existence boundary

Every accepted page requires a distinct task, information object or utility, evidence references, nearest-neighbor comparison, material-difference statement, freshness policy and lifecycle owner. Unique routes, titles or embeddings are insufficient.

## Effect boundary

Compilation is not publication authorization.

A consequential effect requires:

```text
run_id
input_snapshot_hash
compiler_commit
artifact_manifest_hash
policy_version
approval_id and epoch
target
idempotency_key
```

Revalidate immediately before commit. Duplicate or ambiguous retries must produce at most one durable effect.

## Documentation lifecycle

```text
intake
-> source verification and critical research
-> architecture disposition
-> executable plan
-> RED/GREEN/REFACTOR implementation
-> measured validation report
-> immutable memory handoff
-> catalog, bootstrap and PR reconciliation
```

## Validation commands

```bash
npm ci
npm run build
npm test
npm run test:validation
npm run test:compiler-limit
npm run validate:workstreams
node scripts/check-doc-system.mjs
```

Existing green compiler fixtures do not satisfy the new framework or agent gates. PR #3 remains draft until the physical package and useful framework gates pass.
