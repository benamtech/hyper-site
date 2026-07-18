# Validation Report — Task-Surface Research and Documentation System

Status: documentation, research, architecture, executable-plan mutation, idempotent organization, and strengthened inherited CI complete  
Date: 2026-07-18  
Branch: `agent/glm-blackwell-vertical-slice`  
PR: `#3` draft  
Validated migration input head: `e93ea60592722c00152bbb11b4c9117c1d78d29a`  
Organized repository head: `d9ba0e36191c3d977a711740b21899d75cc4f3a5`  
Validated strengthened CI head: `05d8961791c6451e480a6be453351b8722bca81f`

## Scope

This pass did not implement the task-surface runtime. It:

- researched next-generation declarative, event-driven, sandboxed, model-based, graph, provenance, experimentation, observability, and accessibility approaches;
- classified the supplied relationship-tensor thesis as partially accepted research rather than canonical architecture;
- defined a protocol-neutral governed task-surface architecture;
- added explicit theme-developer, site-developer, and growth-operator boundaries;
- made 10,000-page surface scale a mandatory performance and maintenance tier;
- modified P1.4, P1.5, P2, and P3 and added P1.6, P2.5, and P3.4;
- organized all repository-root documents into lifecycle folders;
- installed a stateful writing, catalog, validation, and durable-memory workflow;
- made documentation-system validation a permanent focused-CI gate.

## Research inputs

Machine-readable source registry:

- `docs/research/sources/2026-07-18-task-surfaces.sources.json`

Source classes include:

- W3C WebDriver and model-based UI work;
- Google A2UI official public-preview repository;
- AG-UI official protocol documentation;
- MCP Apps official extension documentation;
- JSON Schema Draft 2020-12 and JSON Forms;
- RDF 1.2 working drafts, SHACL, and PROV-O;
- CloudEvents, RFC 6902, W3C Trace Context, OpenTelemetry, and OpenFeature;
- WCAG 2.2 and web-platform performance references;
- original SDRT discourse-semantics research;
- current Hyper Site source;
- current AMTECH AI Employee materialization and Free Estimator source fixture.

## Research corrections

The following supplied claims were narrowed before architecture acceptance:

1. WebDriver is a useful wire-boundary analogy, not proof that ontology, PCN, and ArticleIR form a browser-equivalent state machine.
2. Interactive surfaces cannot be pure read-only consumers. They submit typed intents; canonical state changes only after server-side acceptance and event/receipt production.
3. Ontology, PCN, ArticleIR, SiteManifest/PageIR, and AI Employee materialization retain separate authorities.
4. `SDRT` cannot be adopted as the public name because it already denotes Segmented Discourse Representation Theory.
5. Numeric vectors cannot be authorization, legality, privacy, indexing, or safety authority.
6. A2UI, AG-UI, MCP Apps, OpenFeature, and semantic-web formats are adapters or comparison arms, not the canonical internal ABI.

## Accepted architecture

```text
Hyper Content optional task proposal
  goal + evidence + inputs + outputs + limitations
                    |
                    v
W7 protocol-neutral TaskServiceManifest / SurfacePlan
                    |
          +---------+---------+
          |                   |
          v                   v
static fallback       runtime adapter interface
          |                   |
          v                   v
PageIR / HTML         intent -> event -> resource / receipt
          |                   |
          +---------+---------+
                    v
            governed task page
```

Boundary:

```text
hyper-content -> hyper-site
hyper-site -X-> hyper-content
hyper-site -X-> AI Employee internals
AI Employee adapter -> Hyper Site public task-surface contract
```

## Executable plan mutation

The plan now contains:

```text
8 workstreams
6 phases
25 dependency-checked steps
31 preserved technologies or protocol arms
5 plan outcomes
6 falsifiable research hypotheses
```

New permanent workstream:

- `W7 task-surface-platform`

New or materially changed steps:

- P1.4: physical framework extraction plus UI ownership classification;
- P1.5: content geometry/Wasm ownership plus content-neutral UI proof;
- P1.6: protocol-neutral task/surface ABI;
- P2.1: five-page scaffold with one governed task page and static fallback;
- P2.2: dev/preview surface invalidation and replay;
- P2.3: publisher surface-asset manifest;
- P2.4: ordinary-framework and mandatory 10K surface matrix;
- P2.5: A2UI, AG-UI, MCP Apps, and AI Employee adapter fixtures;
- P3.1: independent ArticleIR and task-service proposal acceptance;
- P3.3: service/surface checkpoints and duplicate-effect proof;
- P3.4: real governed-surface cohort, isolation, completion measurement, and recovery.

New outcome:

- `O5 governed_task_surfaces`

New hypotheses:

- H5: protocol-neutral adapter interoperability;
- H6: relationship-projection notation gain over typed JSON and graph/event baselines.

## Documentation organization

Root Markdown is now restricted to:

```text
README.md
AGENTS.md
CODEGRAPH.md
CONTRIBUTING.md
identity.md
```

Moved documents:

- 24 historical numbered documents (`00` through `23`);
- 7 newer numbered documents (`24` through `30`);
- 3 former root handoff/research-note documents.

Total root documents organized: **34**.

Destination classes:

```text
docs/intake/
docs/research/
docs/research/experiments/
docs/architecture/
docs/planning/
docs/validation/
docs/archive/
```

Three pre-HHMM memory files were preserved under `memory/legacy/`. New top-level memory handoffs continue to require `YYYY-MM-DD-HHMM-<slug>.md`.

## Stateful writing controls

Added:

- `docs/README.md` lifecycle and read/write protocol;
- `docs/catalog.json` machine-readable authority registry;
- `docs/legacy-root-moves.json` declarative migration record;
- `scripts/apply-doc-moves.mjs`;
- `scripts/check-declared-doc-moves.mjs`;
- `scripts/organize-legacy-memory.mjs`;
- `scripts/organize-root-docs.mjs`;
- `scripts/normalize-doc-paths.mjs`;
- `scripts/ensure-doc-index-links.mjs`;
- `scripts/check-doc-system.mjs`;
- `docs/test/doc-system.test.mjs`;
- `.github/workflows/organize-documents.yml`;
- a permanent `Validate documentation system` stage in `.github/workflows/production-pipeline.yml`.

Lifecycle:

```text
intake
-> source verification
-> research disposition
-> architecture decision
-> executable plan mutation
-> implementation and TDD
-> measured validation report
-> immutable memory handoff
-> MEMORY.md reconciliation
```

## TDD and failure evidence

The document migration did not commit until its validators passed.

RED findings caught and repaired:

1. Initial root inventory omitted 27 older documents.
2. Three historical memory files predated the HHMM naming convention.
3. The move runner rewrote its own manifest and produced false duplicated paths.
4. The stale-reference checker treated catalog provenance (`moved from`) as a live stale link.
5. A global basename rewrite repeatedly prefixed one historical `docs/research/experiments/` path on synchronization reruns.
6. The normalizer rewrote its own negative-control fixture, invalidating the test instead of the repository path.

Repairs:

- complete declarative root inventory;
- `memory/legacy/` preservation;
- move-manifest exclusion from rewriting;
- provenance-file exclusion from live-link scanning;
- boundary-aware replacement of unqualified legacy paths;
- protected migration scripts, manifests, and test fixtures during normalization;
- an explicit idempotency regression test;
- permanent root allowlist, path existence, catalog, plan, memory, and focused-CI gates.

## Migration proof

```text
Organize Repository Documents
run 29642918708
job 88076295118
success
```

Passed:

- script syntax checks;
- complete root and legacy-memory migration;
- stale-link and destination validation;
- documentation catalog validation;
- root allowlist validation;
- executable-plan validation;
- negative plan and documentation tests;
- `git diff --check`;
- atomic commit of the organized tree.

## Exact strengthened CI proof

Validated head:

```text
05d8961791c6451e480a6be453351b8722bca81f
```

Documentation synchronization:

```text
Organize Repository Documents
run 29643257965
job 88077138733
success
```

The synchronization workflow completed with no follow-up mutation, proving the organizer is idempotent on the validated head.

Focused pipeline:

```text
Hyper Site Near-Alpha Pipeline
run 29643257962
job 88077138692
success
artifact 8429258946
sha256:0f87a20a3e581573fdbba759e1fe1e31ec362bebfdce47bf3de990a60a837694
```

Passed:

- TypeScript build;
- executable-plan validation and negative tests;
- declared-document-move validation;
- documentation-system validation and negative tests;
- product-boundary and package tests;
- operator command checks;
- framework/content adapter parity;
- backend, near-alpha, release, and workspace suites.

Full reference pipeline:

```text
Hyper Site Reference
run 29643257988
job 88077138720
success
```

Passed full `npm test`, manifest and UI emission, orchestration, framework validation and preview, browser validation, and R3F build.

## Explicit nonclaims

This pass does not prove:

- P1.4 or P1.5 physical implementation;
- a canonical task-surface ABI implementation;
- A2UI, AG-UI, MCP Apps, or AI Employee conformance;
- runtime isolation or public-service safety;
- dynamic accessibility;
- 10K task-surface performance;
- conversion gain;
- relationship-projection notation value;
- production or alpha readiness.

## Next dependency order

1. P1.4: physically move clean W1 source into `hyper-site/src` and classify/extract content-neutral UI contracts.
2. P1.5: move vectors, prototypes, packing, geometry, and current Wasm behind Hyper Content.
3. P1.6: implement the protocol-neutral task-service and surface ABI with tests first.
4. P2: build the five-page static fixture, one governed task page, dev/preview, publisher, adapters, and 10K matrix.
5. P3: run real content and task-service proposal cohorts with independent acceptance and recovery.

PR #3 remains draft and unmerged.
