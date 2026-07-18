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
10. current research -> architecture -> plan -> validation chain

Current authority chain:

- `docs/research/43-useful-framework-and-agent-first-pipeline-audit.md`
- `docs/architecture/44-useful-framework-and-agent-first-target-architecture.md`
- `docs/planning/45-depth-first-framework-and-agent-recovery-plan.md`
- `docs/validation/46-useful-framework-and-agent-first-gates.md`

Historical filenames do not change their current useful-framework authority.

## Active product boundary

```text
Hyper Content (optional later) -> portable SiteSource -> Hyper Site -> static artifacts
Hyper Site -X-> Hyper Content
Hyper Site -X-> reference runtime in target state
```

### Hyper Site

Owns `SiteSource`, `PageIR`, validation, deterministic compilation, rendering, routes, metadata, JSON-LD, sitemap, design tokens, layouts, components, assets, diagnostics, dependencies, hashes and the ordinary CLI.

Must work without Hyper Content, an LLM, agent runtime, database, GPU, Zig or Wasm.

### Hyper Content

Blocked until the framework maintenance decision is `advance`.

Its first allowed scope is approved facts/evidence -> validated claims/page records -> portable `SiteSource`.

### Reference

`reference/` is current transitional runtime authority. Its target role is compatibility consumer, fixtures, examples and benchmarks.

Current truth:

- most canonical source remains under `reference/src`;
- `hyper-site/index.mjs` delegates to `reference/dist/framework-core.js`;
- package extraction is incomplete;
- folder names and facades are not ownership.

## One-authority rule

Never create a second compiler, renderer, `SiteSource`, `PageIR`, sitemap or hash authority. Freeze behavior, move ownership, delegate compatibility, prove parity, then remove the old authority.

## Active execution order

```text
U1 package ownership and isolated consumption
-> U2 ordinary CLI and starter
-> U3 five-page browser-accepted proof
-> U4 maintenance comparison and advance/narrow/stop
-> U5 optional minimal Hyper Content adapter
```

Only U1 is unblocked.

## U1 implementation rule

U1 moves existing behavior without feature redesign.

Required sequence:

```text
inventory reference/src
-> assign one owner/role per file
-> freeze positive and negative fixtures
-> extract compiler/renderer cluster to hyper-site/src
-> build hyper-site/dist
-> switch exports
-> make reference consume Hyper Site
-> npm pack
-> two isolated consumers
-> parity report
```

Stop when:

- a tarball needs the monorepo;
- runtime imports still enter `reference/`;
- output or rejection behavior drifts without an approved contract change;
- duplicate authorities appear.

## Ordinary framework floor

No framework differentiation claim is allowed until a clean external developer can complete:

```text
install -> create -> dev -> build -> preview -> inspect -> local publish
```

for five distinct real pages.

The direct controls are typed JSON plus direct templates and Astro using the same facts, routes, design and acceptance criteria.

## Browser and accessibility rule

Tests verify user-visible behavior, complete static output, routes, links, metadata and browser rendering. Automated accessibility scanning is required but partial; manual review remains required.

## Baseline-first rule

Every advanced method requires a simpler control:

- ontology graph vs typed records;
- embeddings vs lexical/rule retrieval;
- SDRT/GNN linking vs explicit links and entity co-occurrence;
- HRR/HDC vs ordinary maps/vectors;
- Wasm/Zig vs JavaScript;
- GPU vs CPU/provider API;
- generated UI vs trusted static components;
- autonomous page plan vs human-curated plan.

Advanced methods cannot enter the active graph before U4 advances.

## Incremental correctness

For every maintenance test freeze the expected affected set before execution and report:

```text
required but missed
unexpected changed
unchanged as expected
partial accepted output after failure
```

The dependency index cannot prove its own completeness.

## Required evidence

Every substantive change names:

```text
hypothesis
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

## Deferred work

Until U4 records `advance`, do not implement:

- model-backed bulk generation;
- agent runtime or task surfaces;
- remote publication effects;
- SDRT/custom graph languages;
- GNN/GPU/Zig/Wasm promotion;
- binary LLM prompting;
- 10K publication;
- enterprise claims.

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

Existing green compiler fixtures do not satisfy U1-U5. PR #3 remains draft.

## Governed task-surface boundary

- Hyper Content may propose a task goal, evidence, static examples, input/output classes, limitations, and review triggers. It must not emit UI implementation logic.
- Hyper Site owns protocol-neutral service, surface, theme, mount, public-projection, and growth-policy contracts. It must not own reasoning, credentials, private memory, connectors, or consequential authorization.
- Browser surfaces submit typed intents; they never mutate canonical runtime state directly.
- Public projections are allowlisted and must not include full ontology state, hidden reasoning, private memory, credentials, raw provider payloads, or unrelated tenant resources.
- Static fallback remains complete. Dynamic native, declarative, and sandboxed tiers are progressive enhancement.
- A2UI, AG-UI, MCP Apps, and AI Employee integrations are adapters, not internal authority.
- Growth operators may vary approved presentation, sequencing, allocation, and conversion. They may not widen capabilities, lower safety, alter private-data policy, or index sessions and generated artifacts.
- Run `node scripts/check-doc-system.mjs` with plan and boundary validation.

## Documentation lifecycle

Documentation lifecycle: `docs/README.md`. Every research or architecture mutation must follow intake -> research -> architecture -> executable plan -> validation report -> immutable memory handoff.
