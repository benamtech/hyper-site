# AGENTS.md — Hyper Monorepo Operating Contract

Status: active implementation contract  
Updated: 2026-07-19

## Read first

1. `identity.md`
2. `AGENTS.md`
3. `README.md`
4. `CODEGRAPH.md`
5. `docs/README.md`
6. `docs/architecture/52-product-taxonomy-and-runtime-boundaries.md`
7. `docs/catalog.json`
8. `memory/MEMORY.md`
9. newest immutable handoff
10. newest measured validation report
11. current task-specific authority chain

## Canonical product boundary

```text
Hyper Content
  evidence-grounded content generation and validation
        |
        | SiteSource + optional task/surface proposals
        v
Hyper Site
  deterministic website framework and compiler
        |
        | optional governed task mounts
        v
Hyper Runtime
  identity, approvals, durable jobs, connectors and receipts

AI Employee
  product assembled from all three
```

The names are not interchangeable.

### Hyper Site

Owns:

- `SiteSource`, `PageIR`, validation and deterministic compilation;
- HTML, CSS, metadata, JSON-LD, sitemap and instruction projections;
- browser capability contracts;
- public/operator surface rendering;
- static fallback output;
- dependency declarations and hashes.

Must work without Hyper Content, an LLM, runtime service, database, GPU, Zig or Wasm.

Must not own credentials, authorization, connector execution or durable effects.

### Hyper Content

Owns:

- approved corpus and evidence intake;
- deterministic/model-backed semantic proposals;
- independent evidence validation;
- bounded repair and atomic rejection;
- accepted generation checkpoints;
- portable `SiteSource` and optional task/surface proposals.

Must not own HTML rendering, publication authority, approvals or external effects.

### Hyper Runtime

Owns:

- verified tenant and actor identity context;
- role, scope and approval policy;
- durable outbox and worker claims;
- connector dispatch and reconciliation;
- ambiguous-outcome quarantine;
- dead-letter/operator recovery state;
- immutable effect receipts.

Current implementation lives in `hyper-content/src/action-runtime.ts`, `durable-pilot.ts` and `production-runtime.ts`. This is transitional physical placement, not product identity.

### AI Employee

“AI Employee” is a composed deployment using Hyper Content, Hyper Site and Hyper Runtime.

Do not call Hyper Site, Hyper Content or the entire repository an AI Employee by itself.

## One-authority rules

Never create a second authority for:

- `SiteSource` or `PageIR`;
- deterministic HTML rendering;
- evidence acceptance;
- tenant authorization;
- approval decisions;
- effect receipts.

Move behavior through compatibility wrappers and prove parity before removing the old authority.

## Semantic authority rule

```text
provider proposes
independent validator accepts or rejects
provider -X-> self-validation
provider -X-> self-approval
provider -X-> direct publication/effect authority
```

## Effect safety rule

```text
succeeded -> immutable receipt
not sent + retryable -> bounded retry
rejected/exhausted -> dead letter
unknown -> ambiguous quarantine -> reconciliation
```

Unknown outcomes must never be automatically retried.

## Permission rule

- Permission filtering occurs before public rendering.
- Browser surfaces submit typed intents; they do not mutate canonical runtime state directly.
- Public projections are allowlisted.
- Rendered controls are not authorization enforcement.
- High-risk actions require an independently authorized approval.

## Packaging direction

```text
hyper-content -> hyper-site
hyper-site -X-> hyper-content
reference -> hyper-site compatibility surface
```

Future target:

```text
hyper-content   semantic pipeline
hyper-site      framework/presentation
hyper-runtime   governed execution
```

Extracting `hyper-runtime` is package cleanup and must preserve current behavior and tests.

## Baseline-first rule

Every advanced method requires a simpler control:

- ontology graph vs typed records;
- embeddings vs lexical/rule retrieval;
- SDRT/GNN linking vs explicit links and entity co-occurrence;
- HRR/HDC vs ordinary maps/vectors;
- Wasm/Zig vs JavaScript;
- GPU vs CPU/provider API;
- generated UI vs trusted static components;
- autonomous plan vs human-curated plan.

Advanced research cannot become semantic, rendering or effect authority without a measured promotion gate.

## Required evidence

Every substantive change names:

```text
hypothesis
logical owner
physical owner
owned invariant
primary metric
falsification rule
simple baseline
negative control
fixture/environment
pass threshold
rollback
measured evidence
```

Pending and not-run checks remain visible.

## Side-effect documentation

For every source or operational entry point document:

- file reads and writes;
- database queries and transaction boundaries;
- network requests;
- process spawns;
- environment and secret reads;
- external effects;
- retry and reconciliation behavior.

## Validation commands

```bash
npm run build
npm test
npm run test:validation
npm run test:compiler-limit
npm run validate:workstreams
node scripts/check-doc-system.mjs
```

Package-specific:

```bash
npm --prefix hyper-site test
npm --prefix hyper-content test
npm run proof:h0-h1
```

## Documentation lifecycle

```text
intake
-> source verification and direct controls
-> architecture
-> executable plan
-> RED/GREEN/REFACTOR
-> measured report
-> immutable handoff
-> catalog/bootstrap/PR reconciliation
```

Documents are stale if they collapse the subsystem taxonomy, claim unrun external integrations, present unknown effects as retryable or describe transitional package placement as the desired architecture.

PR #3 remains draft and unmerged until external deployment gates or an explicit scope decision changes that posture.
