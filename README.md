# Hyper Monorepo

Status: research prototype approaching near-alpha  
Updated: 2026-07-18  
PR: #3 remains draft and unmerged

## Products

```text
@amtech/hyper-content
  source, evidence, content proposals, generation, validation
        |
        v
@amtech/hyper-site
  content-neutral static compilation and web artifacts
```

Allowed direction:

```text
hyper-content -> hyper-site
hyper-site -X-> hyper-content
```

## Current implementation truth

The package split is incomplete.

- `hyper-content/src/content-program-adapter.ts` is the first canonical Hyper Content implementation physically owned by that package.
- most canonical source still lives under `reference/src`.
- `hyper-site/index.mjs` currently re-exports compiler behavior from `reference/dist/framework-core.js`.
- `reference/` must become a package consumer, compatibility suite, fixture library, example set, and benchmark harness.

## What works now

Given a valid `SiteSource`, the current compiler can:

- validate pages, modules, claims, evidence, information objects, and references;
- reject claims whose required evidence level is not met;
- transform `SiteSource` into normalized `PageIR`;
- emit semantic static HTML;
- emit canonical metadata, robots directives, and JSON-LD;
- emit optional Markdown instruction projections;
- generate sitemap XML;
- generate a reverse dependency index;
- compute per-page and whole-build SHA-256 hashes.

The verified path is:

```text
consumer
-> hyper-site/index.mjs
-> reference/dist/framework-core.js
-> compileSite(SiteSource)
```

This is functioning prototype behavior. It is not proof of independent package ownership, a polished developer workflow, page usefulness, framework advantage, or production readiness.

## Official Manjaro external verification

Requirements: Manjaro or another Arch-derived system with Bash and `pacman`, plus internet access.

Run directly in an XFCE terminal:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/benamtech/hyper-site/agent/glm-blackwell-vertical-slice/scripts/manjaro-clone-and-test-hyper.sh)
```

The default mode does not modify system packages. When a required package is missing, it prints the exact safe installation command. To explicitly allow dependency installation through a full Manjaro/Arch sync:

```bash
HYPER_INSTALL_DEPS=1 \
bash <(curl -fsSL https://raw.githubusercontent.com/benamtech/hyper-site/agent/glm-blackwell-vertical-slice/scripts/manjaro-clone-and-test-hyper.sh)
```

Configure the workload and destination:

```bash
HYPER_TEST_PAGES=500 \
HYPER_TEST_SEED="manjaro-limit-$(date +%s)" \
bash <(curl -fsSL https://raw.githubusercontent.com/benamtech/hyper-site/agent/glm-blackwell-vertical-slice/scripts/manjaro-clone-and-test-hyper.sh) \
  "$HOME/hyper-site-tests/manual-500"
```

The runner:

- prints live repository, branch, PR and raw-file URLs;
- verifies the remote branch head before cloning;
- clones only `agent/glm-blackwell-vertical-slice`;
- verifies the local commit matches the remote branch head;
- installs locked npm dependencies;
- builds and runs the complete repository test suite;
- runs validation-baseline tests;
- generates unique arbitrary structured site data;
- compiles the same input twice;
- independently verifies page and build hashes;
- verifies dependency-index, escaping, sitemap and instruction behavior;
- runs ten invalid-input rejection cases;
- retains HTML and machine-readable reports.

Official script:

```text
scripts/manjaro-clone-and-test-hyper.sh
```

Canonical randomized harness:

```text
scripts/run-compiler-limit-test-v2.mjs
```

Cross-platform Unix-like fallback:

```bash
curl -fsSL https://raw.githubusercontent.com/benamtech/hyper-site/agent/glm-blackwell-vertical-slice/scripts/clone-and-test-hyper.sh | bash
```

Authority: `docs/validation/40-portable-compiler-limit-test.md`.

## Current execution order

```text
W1 physical package extraction
-> W2 standalone five-page static proof
-> W3 measured maintenance proof
-> W4 optional local task proof
```

The repository is in W1.

Immediate slice:

```text
classify every reference/src file
-> extract the neutral compiler cluster into hyper-site/src
-> switch the public entrypoint to package-owned output
-> make reference consume Hyper Site
-> preserve fixture byte/hash and rejection parity
-> prove two clean packed-package consumers
```

Authority: `docs/planning/38-four-part-product-workstream-map.md`.

## Research constraint: internal linking

SDRT is not the active internal-linking model. It is a theory of discourse interpretation and rhetorical relations, not a validated site-topology optimizer.

The required first baseline is:

```text
canonical entities and evidence
-> page-entity incidence
-> entity co-occurrence and shared-evidence candidates
-> route, intent, redundancy, and editorial rules
-> held-out review
```

SDRT, dense embeddings, graph neural networks, five-dimensional vectors, or custom graph query languages remain research-only until they beat explicit links and the interpretable baseline on held-out acceptance, direction, coherence, harmful-link rate, reviewer time, and explanation quality.

Authority: `docs/research/41-critical-claims-sdrt-and-internal-linking.md`.

## Commands

```bash
npm ci
npm run build
npm test
npm run test:validation
npm run test:compiler-limit
npm run validate:workstreams
```

The workstream validation commands are expected to remain red while required evidence is absent. Placeholder files cannot make a workstream pass.

## Nonclaims

The repository does not yet prove:

- complete physical source extraction;
- independent packed-package consumption;
- a normal install/create/dev/build/deploy workflow;
- five useful real pages;
- maintenance advantage over direct controls;
- internal-linking model advantage;
- framework superiority;
- production readiness;
- indexing, ranking, conversion, revenue, or retention.

Synthetic throughput, deterministic hashes, graph metrics, schema validity, and passing fixtures are software evidence only.

## Documentation authority

- lifecycle: `docs/README.md`
- catalog: `docs/catalog.json`
- architecture: `docs/architecture/35-reality-grounded-product-and-integration-boundary.md`
- execution plan: `docs/planning/38-four-part-product-workstream-map.md`
- validation: `docs/validation/37-reality-grounded-product-validation-matrix.md`
- validation-first baseline: `docs/validation/39-w1-w3-validation-first-execution.md`
- portable test: `docs/validation/40-portable-compiler-limit-test.md`
- internal-link research: `docs/research/41-critical-claims-sdrt-and-internal-linking.md`
- critical claim research: `docs/research/42-critical-compiler-network-and-llm-claims.md`
- durable state: `memory/MEMORY.md`

## Governed task surfaces

Hyper Site's next interaction layer is a protocol-neutral governed task-surface platform. Static pages remain complete and indexable; optional runtime services accept typed intents and return public projections, resources, artifacts, actions, and receipts. Theme developers own trusted renderers, site developers own mounts and fallbacks, and growth operators own bounded experiment and conversion policy. Hyper Content may propose task semantics but contains zero UI implementation logic.

Current authority:

- `docs/intake/2026-07-18-next-generation-task-surfaces.md`
- `docs/research/31-next-generation-task-surfaces-protocol-crosswalk.md`
- `docs/architecture/32-governed-task-surface-architecture.md`
- `docs/validation/33-task-surface-validation-matrix.md`

A2UI, AG-UI, MCP Apps, and AMTECH AI Employee are adapters after the internal ABI passes. Ten-thousand-page surface scale is a mandatory benchmark tier, not a page-usefulness claim.

## Documentation system

Documentation lifecycle and research catalog: `docs/README.md`. Machine-readable document authority: `docs/catalog.json`.
