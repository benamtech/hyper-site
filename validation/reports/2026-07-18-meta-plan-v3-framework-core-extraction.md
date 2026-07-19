# Validation Report — META-PLAN-V3 and Neutral Framework Extraction

Date: 2026-07-18  
Branch: `agent/glm-blackwell-vertical-slice`  
Baseline: `e3e85c291d465bf79037c8c3b5c16edefceaff6e`  
Validated implementation head: `c7b56bfe20dcd404aa77683b4f0789d50ce04d00`  
PR: #3, open and draft

## Scope

This report validates the first executable slice of `META-PLAN-V3`:

- P0.2 machine-readable program governance;
- P1.1 content-neutral framework compilation;
- P1.2 neutral SiteManifest introduction;
- compatibility preservation for legacy content geometry and packed IR.

It does not validate physical source migration, independent framework shipping, live provider output, a client delivery, revenue, ranking, GPU fit, or advanced-method superiority.

## Implemented authority changes

1. `reference/src/framework-core.ts` is the content-neutral static compiler.
2. `reference/src/site-manifest.ts` is the content-neutral manifest contract.
3. `reference/src/framework.ts` is now a compatibility adapter: neutral web compilation first, content geometry and packing second.
4. `hyper-site/index.mjs` exposes only the neutral compiler, neutral SiteManifest, browser targets, and modern CSS tools.
5. `hyper-content/index.mjs` retains the content-aware compiler and `packSite` explicitly.
6. `planning/meta-plan-v3.json` plus `planning/meta-plan-v3.steps.json` define the validated 7-workstream, 6-phase, 22-step program.

## TDD evidence

Characterization and boundary tests were added before accepting the extraction:

- exact neutral/legacy HTML parity;
- exact sitemap parity;
- exact instruction projection and page artifact hash parity;
- deterministic neutral compilation under source reordering;
- design capability contract parity;
- Hyper Site output has no `packed` field;
- Hyper Site API does not expose content compiler or packing authority;
- Hyper Content retains content-aware compile and packing authority;
- plan validator rejects cycles, missing metrics, and technology removal.

## Machine gates

### Hyper Site Near-Alpha Pipeline

- Workflow run: `29640302422`
- Job: `88069605262`
- Head: `c7b56bfe20dcd404aa77683b4f0789d50ce04d00`
- Result: success
- Artifact: `near-alpha-test-log-29640302422`
- Artifact ID: `8428400516`
- Artifact digest: `sha256:7ec84641887dbf92d39341313fdf013869b4f1d54e09f3260abbf92554400387`

Passed steps:

- TypeScript build;
- executable-plan validation and negative tests;
- product dependency and source-boundary validation;
- Hyper Site and Hyper Content package tests;
- operator command validation;
- framework-core parity/determinism tests;
- production pipeline, backend, near-alpha, release, and workspace tests.

### Hyper Site Reference

- Workflow run: `29640302427`
- Job: `88069605330`
- Head: `c7b56bfe20dcd404aa77683b4f0789d50ce04d00`
- Result: success

Passed steps:

- full `npm test`;
- manifest emission;
- UI emission;
- orchestration check;
- framework validation;
- framework preview;
- browser target check;
- R3F build.

## Step decisions

| Step | Decision | Evidence |
|---|---|---|
| P0.2 | pass | plan validator reports 7 workstreams, 6 phases, 22 steps, 22 preserved technologies, 4 outcomes, and 4 hypotheses; negative tests pass |
| P1.1 | pass | neutral source boundary, exact web-artifact parity, no packed Hyper Site output, full regression suite green |
| P1.2 | pass for neutral-contract introduction | neutral SiteManifest compiles and contains no vector/profile/agent/provider fields; legacy mixed manifest remains preserved for migration |

## Effects

- Hyper Site no longer executes vector packing through its public compile path.
- Hyper Content continues to preserve every existing vector/prototype/packed-IR behavior through the adapter.
- The existing renderer, PageIR semantics, sitemap, instruction projection, and publication path remain singular.
- P1.3 is now the next dependency: explicit ContentProgramManifest-to-SiteSource adaptation through the public Hyper Site contract.

## Remaining failures or pending evidence

None for this implementation slice.

The overall program remains incomplete. PR #3 must stay draft because P1.3–P5.5 and all four product outcomes remain pending.
