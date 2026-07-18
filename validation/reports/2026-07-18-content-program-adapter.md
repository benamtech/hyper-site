# Validation Report — Content Program to Hyper Site Adapter

Date: 2026-07-18  
Branch: `agent/glm-blackwell-vertical-slice`  
Validated implementation head: `0294935130deeed5ba9f2d4d975f464a79aa4b65`  
PR: #3, open and draft

## Step

P1.3 — Build an explicit Hyper Content adapter from the mixed Content Program manifest to the content-neutral Hyper Site `SiteSource` contract.

## Implementation

- `reference/src/content-program-adapter.ts`
  - strips `vectorIdentity`, `features`, `vectorPrototypes`, and `primaryPrototypeId` from the legacy compatibility source;
  - returns the neutral `SiteSource` accepted by `framework-core.ts`;
  - compiles the adapted source through Hyper Site;
  - rejects drift in sitemap, page count, HTML, instruction projection, artifact hashes, or dependency indexes.
- `hyper-content/index.mjs`
  - explicitly exports `adaptContentProgramSiteSource` and `compileContentProgramManifest`;
  - Hyper Site exposes neither function.
- `reference/test/content-program-adapter.test.mjs`
  - verifies geometry removal;
  - verifies exact web-artifact parity against the legacy content-aware compile.
- `scripts/check-product-boundaries.mjs`
  - requires the adapter to target `framework-core.ts`;
  - requires explicit Hyper Content exports;
  - rejects adapter leakage into Hyper Site.

## TDD trace

### RED 1

Head `a401a5fab4d53d449480a54ea6f4a3b6acf691af` failed TypeScript compilation because the legacy reference barrel exported neutral and compatibility types with colliding names.

Resolution: the neutral compiler remains authoritative through the Hyper Site package facade; the legacy reference barrel exports only its compatibility surface plus the content-program adapter.

### RED 2

Head `5e4453367b328e44bca6322362cb033985c22f6e` passed compilation but failed the static boundary gate because a star export did not make the adapter contract auditable by source inspection.

Resolution: Hyper Content now names both adapter exports explicitly.

### GREEN

Head `0294935130deeed5ba9f2d4d975f464a79aa4b65` passed both workflows.

## Exact proof

### Hyper Site Near-Alpha Pipeline

- run: `29640789068`
- job: `88070853269`
- result: success
- artifact: `8428543453`
- digest: `sha256:5c6468620f48c8a2caff69d87e915bd4d8253251752a84d6d5849547dfe86276`

Passed:

- TypeScript build;
- executable plan validation;
- product boundary scan;
- package facade tests;
- operator checks;
- framework-core and content-program adapter tests;
- inherited backend, near-alpha, release, and workspace suites.

### Hyper Site Reference

- run: `29640789083`
- job: `88070853184`
- result: success

Passed:

- full `npm test`;
- manifest and UI emission;
- orchestration;
- framework validation and preview;
- browser policy;
- R3F build.

## Pass metrics

| Metric | Result |
|---|---|
| adapter uses neutral Hyper Site contract | pass |
| reverse dependency count | 0 |
| adapted geometry fields | 0 |
| web artifact drift | 0 |
| inherited regression failures | 0 |

## Effects

- P1.4 is unblocked: clean framework source can now move into `hyper-site/src` behind an explicit compatibility boundary.
- P3.1 is logically unblocked by the adapter, but remains dependency-blocked by P1.5 and real-provider prerequisites.
- No PageIR, renderer, sitemap, or publication authority was duplicated.
- The legacy mixed manifest remains preserved until physical migration and consumer enumeration are complete.

## Nonclaims

This step does not prove independent package publication, create/dev/build/deploy UX, framework superiority, a real provider cohort, client value, revenue, or production readiness.
