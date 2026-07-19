# Handoff — META-PLAN-V3 and Neutral Framework Extraction

at: 2026-07-18T06:10:00-04:00  
branch: `agent/glm-blackwell-vertical-slice`  
pr: `#3` draft  
validated_head: `c7b56bfe20dcd404aa77683b4f0789d50ce04d00`

## Current state

`META-PLAN-V3` is now executable repository authority rather than free-form planning text.

Program shape:

```text
7 workstreams
6 phases
22 dependency-checked steps
22 preserved technologies
4 product outcomes
4 falsifiable research hypotheses
```

Completed in this slice:

- P0.2 plan validator, TDD, branch, evidence, effects, rollback, and pass/fail standards;
- P1.1 neutral framework compiler extraction;
- P1.2 neutral SiteManifest introduction.

## Canonical paths

- `planning/meta-plan-v3.json`
- `planning/meta-plan-v3.steps.json`
- `scripts/check-meta-plan.mjs`
- `docs/planning/30-meta-plan-v3-executable-program.md`
- `CONTRIBUTING.md`
- `reference/src/framework-core.ts`
- `reference/src/site-manifest.ts`
- `reference/src/framework.ts` compatibility adapter
- `reference/test/framework-core-boundary.test.mjs`
- `validation/reports/2026-07-18-meta-plan-v3-framework-core-extraction.md`

## Product boundary after extraction

```text
hyper-site public compile
-> reference/dist/framework-core.js
-> static PageIR/HTML/sitemap only

hyper-content content-aware compile
-> reference/dist/framework.js adapter
-> framework-core web artifacts
-> vector prototypes and packed IR
```

The source still physically builds from `reference/`; physical ownership migration is P1.4, not complete.

## Exact proof

Near-alpha workflow:

```text
run 29640302422
job 88069605262
success
artifact 8428400516
sha256:7ec84641887dbf92d39341313fdf013869b4f1d54e09f3260abbf92554400387
```

Full reference workflow:

```text
run 29640302427
job 88069605330
success
```

Both validated exact head `c7b56bfe20dcd404aa77683b4f0789d50ce04d00`.

## Next dependency order

1. P1.3: explicit ContentProgramManifest-to-public-Hyper-Site adapter.
2. P1.4: move clean framework source into `hyper-site/src`; make reference consume the package.
3. P1.5: move packed geometry/current Wasm ownership physically behind Hyper Content.
4. P2.1: five-page standalone scaffold only after package extraction.

## Nonclaims

Do not claim independent shipping, framework benchmark superiority, provider quality, client value, revenue, GPU fit, ranking, or production readiness from this slice.

Keep PR #3 draft and unmerged.
