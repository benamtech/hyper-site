# Handoff — Content Program to Hyper Site Adapter

at: 2026-07-18T06:30:00-04:00  
branch: `agent/glm-blackwell-vertical-slice`  
pr: `#3` draft  
validated_implementation_head: `0294935130deeed5ba9f2d4d975f464a79aa4b65`

## Completed

P1.3 is complete.

New public Hyper Content boundary:

```text
ContentProgramManifest
-> compileFrameworkManifest compatibility result
-> adaptContentProgramSiteSource
-> geometry-free Hyper Site SiteSource
-> framework-core compile
-> exact artifact parity assertion
```

Files:

- `reference/src/content-program-adapter.ts`
- `reference/test/content-program-adapter.test.mjs`
- explicit exports in `hyper-content/index.mjs`
- adapter assertions in `scripts/check-product-boundaries.mjs`

## TDD findings

1. Exporting neutral and compatibility modules from the same legacy barrel caused a TypeScript symbol collision. The package facades now remain the authority for product-specific names.
2. Star exports were insufficient for a source-auditable contract. Adapter functions are explicitly exported from Hyper Content.

## Proof

```text
focused run 29640789068
job 88070853269
artifact 8428543453
sha256:5c6468620f48c8a2caff69d87e915bd4d8253251752a84d6d5849547dfe86276
success

full reference run 29640789083
job 88070853184
success
```

## Next

1. P1.4: move neutral framework source into `hyper-site/src`; make `reference/` consume the workspace package.
2. P1.5: move content geometry, packing, prototypes, and current vector Wasm physically behind Hyper Content.
3. P2.1 only after P1.4: build the standalone five-page scaffold.

Keep PR #3 draft and unmerged.
