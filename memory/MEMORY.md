# Hyper Monorepo Durable Memory

status: active
updated_at: 2026-07-18T20:30:00-04:00

## State

branch: agent/glm-blackwell-vertical-slice
pr: 3
draft: true
merged: false
maturity: research prototype approaching near-alpha

## Boundary

hyper-content -> hyper-site
hyper-site -X-> hyper-content

## Physical truth

- `hyper-content/src/content-program-adapter.ts` owns the first extracted content adapter implementation.
- `reference/src/content-program-adapter.ts` is a temporary compatibility wrapper.
- most package source still lives under `reference/src`.
- `hyper-site/index.mjs` currently delegates compiler exports to `reference/dist/framework-core.js`.
- W1 physical extraction is incomplete.

## Verified execution state

A one-page fixture executed through the current public Hyper Site entrypoint and therefore through the transitional `reference/dist/framework-core.js` implementation.

Verified: SiteSource validation, reference resolution, evidence-threshold rejection, PageIR, semantic HTML, metadata, instruction Markdown, sitemap, dependency index, page hash, and build hash.

Portable randomized verification now has two wrappers:

- `scripts/manjaro-clone-and-test-hyper.sh` is the official Manjaro/Arch external entrypoint. It checks `pacman`, supports explicit dependency-install opt-in, verifies the live branch head, clones the named branch, records the exact commit and URLs, runs the full test sequence, runs the randomized compiler harness, and retains machine-readable artifacts.
- `scripts/clone-and-test-hyper.sh` remains the generic Unix-like wrapper for machines that already have Git, Node.js 20+, npm, and curl.
- `scripts/run-compiler-limit-test-v2.mjs` is the canonical randomized harness. It generates unique arbitrary structured input, compiles twice, independently recomputes hashes, checks dependencies and escaping, and runs ten rejection cases.
- `test/compiler-limit-harness.test.mjs` exercises multi-page and one-page workloads inside the repository test suite.
- authority: `docs/validation/40-portable-compiler-limit-test.md`.

A passing external run proves current compiler behavior for the generated fixture and exact commit only. It does not prove W1 completion, independent package ownership, page usefulness, framework superiority, or production readiness.

## Four-part program

Current authority: `docs/planning/38-four-part-product-workstream-map.md`.

```text
W1 physical package extraction
-> W2 standalone five-page static proof
-> W3 measured maintenance proof
-> W4 optional local task proof
```

The repository is in W1.

Immediate next slice:

```text
reference/src ownership inventory
-> neutral compiler-cluster extraction into hyper-site/src
-> public entrypoint switch
-> reference consumer conversion
-> verified one-page byte/hash parity
```

Do not begin W2 until this slice passes. Do not begin W4 until W3 demonstrates that the static product remains justified.

## SDRT and internal-linking decision

SDRT remains research-only. Its native purpose is discourse interpretation through rhetorical relations, anaphora, ambiguity, and discourse coherence; it has no established advantage for website internal-link decisions.

The required first internal-linking baseline is:

```text
canonical entities and evidence
-> page-entity incidence
-> entity co-occurrence and shared-evidence candidates
-> route, intent, redundancy, and editorial rules
-> held-out review
```

SDRT, embeddings, GNNs, five-dimensional vectors, or a custom graph query language may be promoted only after they beat explicit links and the interpretable entity/co-occurrence baseline on held-out acceptance, direction, coherence, harmful-link rate, reviewer time, and explanation quality.

Authority: `docs/research/41-critical-claims-sdrt-and-internal-linking.md`.

## Rules

- one canonical compiler, renderer, and publisher during migration
- every `reference/src` file receives exactly one owner and role
- stable and experimental exports remain separate
- future framework demonstrations record the public entrypoint, reached implementation, immutable input, artifacts, independent verification, rejection test, and limitations
- every advanced method has a direct simpler control
- every page needs independent existence justification
- new dependencies require a demonstrated fixture need and measured benefit
- current public delegation to `reference/dist` remains explicit
- one-page or randomized compiler verification is not completion of W1 or W2
- synthetic throughput and deterministic hashes are software evidence only
- the official external runner must print the exact repository, branch, commit, raw script, harness, report, and artifact paths
- dependency installation is explicit opt-in; Manjaro/Arch installation uses a full `pacman -Syu` transaction
- PR #3 stays draft

## Authorities

- README.md
- docs/README.md
- docs/catalog.json
- planning/meta-plan-v3.json
- planning/meta-plan-v3.steps.json
- docs/research/34-intellectual-competitive-and-use-case-landscape.md
- docs/research/41-critical-claims-sdrt-and-internal-linking.md
- docs/research/42-critical-compiler-network-and-llm-claims.md
- docs/architecture/35-reality-grounded-product-and-integration-boundary.md
- docs/planning/38-four-part-product-workstream-map.md
- docs/planning/36-next-three-workstreams-reality-grounded-plan.md (superseded for execution ordering)
- docs/validation/37-reality-grounded-product-validation-matrix.md
- docs/validation/39-w1-w3-validation-first-execution.md
- docs/validation/40-portable-compiler-limit-test.md

## Nonclaims

No complete extraction, independent package proof, five-page framework advantage, maintenance advantage, accepted real cohort, internal-linking model advantage, task advantage, production readiness, or business outcome is established.
