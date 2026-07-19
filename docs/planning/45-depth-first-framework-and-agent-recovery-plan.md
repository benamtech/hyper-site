# Useful Repository Execution Plan

Status: active execution plan  
Updated: 2026-07-18

## Objective

Produce one externally installable static framework, one accepted five-page site, and one measured maintenance decision before resuming content-generation or agent work.

## Execution order

```text
U1 package ownership and isolated consumption
-> U2 ordinary CLI and starter
-> U3 five-page browser-accepted proof
-> U4 maintenance comparison and decision
-> U5 optional minimal Hyper Content adapter
```

Only U1 is currently unblocked.

## U1 — Package ownership and isolated consumption

### U1.1 Inventory

For every file under `reference/src`, record:

- path;
- owner: `hyper-site`, `hyper-content`, `reference-only` or `research`;
- role;
- direct imports;
- public consumers;
- tests;
- migration order.

No file may have multiple owners.

### U1.2 Extract the compiler cluster

Move, without semantic redesign:

- `SiteSource` and `PageIR` contracts;
- validation and reference resolution;
- evidence-threshold checks;
- normalization;
- HTML and instruction rendering;
- metadata, JSON-LD and sitemap;
- dependency index;
- page and build hashing;
- content-neutral manifest behavior.

### U1.3 Build package-owned output

Required package changes:

- add `hyper-site/src` build input;
- emit `hyper-site/dist`;
- define explicit package exports;
- remove `private: true` only when tarball tests pass;
- ensure runtime code imports no file under `reference/`.

### U1.4 Reverse the compatibility dependency

```text
before: hyper-site -> reference

after:  reference -> @amtech/hyper-site
```

### U1.5 Isolated consumers

Create two temporary consumers from `npm pack` output:

1. valid fixture compiles and emitted artifacts match frozen legacy output;
2. invalid fixtures reject with equivalent codes or documented messages.

### U1 exit

- complete ownership inventory;
- no package runtime imports from `reference/`;
- tarball installs without the monorepo;
- positive artifact parity;
- negative rejection parity;
- exact command and hash report.

## U2 — Ordinary CLI and starter

Implement the smallest conventional workflow:

```text
hyper-site create
hyper-site dev
hyper-site build
hyper-site preview
hyper-site inspect
hyper-site publish --local <directory>
```

Requirements:

- Node 20+ only;
- no Hyper Content, LLM, GPU, database or external service;
- one starter with facts, pages, design tokens, layouts, components and assets;
- file watching for authoring changes;
- atomic build directory replacement;
- diagnostics in text and JSON;
- preview serves the built output, not a separate renderer;
- local publish only copies an already accepted build.

U2 exit:

- clean-machine transcript from install to preview;
- all commands have help and nonzero failure codes;
- starter can be edited without repository knowledge;
- pack consumer tests remain green.

## U3 — Five-page browser-accepted proof

Freeze one real, operator-approved business fixture with:

- five distinct page purposes;
- approved facts and evidence;
- real copy and assets;
- one minimal responsive theme;
- explicit metadata and route requirements;
- no generated placeholder variants.

Build the same site with:

1. Hyper Site;
2. typed JSON plus direct templates;
3. Astro using the same inputs and acceptance criteria.

Measure:

- setup and authoring steps;
- build and preview behavior;
- route/link correctness;
- HTML and metadata correctness;
- client JavaScript and asset bytes;
- automated accessibility findings;
- browser assertions on user-visible behavior;
- manual review findings;
- diagnostics quality.

U3 exit:

- all five pages accepted by a held-out reviewer;
- no broken internal links or duplicate routes;
- no automatically detectable critical accessibility violation;
- complete static output can be served from a basic file server;
- no superiority claim exceeds measured evidence.

## U4 — Maintenance comparison and decision

Freeze these changes before execution:

1. shared business fact;
2. page-specific fact;
3. shared design token or component;
4. page retirement or indexability change;
5. invalid unsupported claim or broken reference.

For each implementation record:

- expected affected artifact set;
- actual changed set;
- required but missed;
- unexpected changed;
- operator time;
- review time;
- build time;
- diagnostics;
- rollback steps;
- partial output after failure.

U4 exit:

```text
required_but_missed = 0
invalid_change_accepted = false
partial_accepted_output_after_failure = false
decision = advance | narrow | stop
```

`advance` additionally requires a meaningful maintenance advantage or a required invariant absent from the direct controls.

## U5 — Optional minimal Hyper Content adapter

Starts only after `decision = advance`.

First scope:

```text
approved facts and evidence
-> validated claims and page records
-> portable SiteSource
```

No model provider, ontology discovery, vector selection, agent runtime or 10K generation is required for this gate.

## Explicitly deferred

Until U4 advances:

- model-backed bulk generation;
- durable agent orchestration;
- task surfaces;
- remote publication;
- SDRT and custom graph languages;
- GNN, GPU, Zig and Wasm promotion;
- 10K-page cohorts;
- enterprise claims.

## Immediate next action

Complete U1.1 and U1.2 under frozen compiler fixtures. Do not add features while moving ownership.
