# Living Surface MVP handoff

Date: 2026-07-19  
Branch: `agent/glm-blackwell-vertical-slice`  
Measured source commit: `f5734533da137f1f28509d495f7fc67a187495ad`  
PR: #3 draft and unmerged

## Completed

`@amtech/hyper-site` now exports a package-owned living-surface MVP:

```text
LivingSurfaceState
-> validate
-> public/operator permission projection
-> agency and governance decision resolution
-> deterministic static HTML
-> hashes and explanation ledger
```

Key source:

- `hyper-site/src/living-surface.ts`
- `hyper-site/test/living-surface.test.mjs`
- `scripts/run-living-surface-mvp.mjs`

Package version advanced to `0.3.0-alpha.0` and exposes `@amtech/hyper-site/living-surface`.

## Measured state

Workflow `29677235149` passed on source commit `f5734533da137f1f28509d495f7fc67a187495ad`.

- Hyper Site tests: 8/8;
- legacy tests: 80/80;
- packed runtime and strict TypeScript consumers: pass;
- living-surface demo: pass;
- H0/H1: pass;
- H3 MVP substrate: pass.

Measured report:

- `validation/reports/2026-07-19-living-surface-mvp.md`

## Product truth

The continuous-interface field is currently a typed deterministic presentation and governance model. The MVP implements nine field channels, agency blend radius, approval curvature, audience filtering, node priority and static fallback.

It does not yet implement PDE evolution, CSG composition, WebGPU, psychographic profiling, live action execution or remote runtime effects.

## Next gate

H2/H3 integration:

```text
approved corpus
-> bounded semantic generation
-> independent evidence validation
-> accepted SiteSource and LivingSurfaceState
-> deterministic public/operator projections
-> bounded external action adapter
-> approval and receipt
```

The generator may propose semantic/runtime state but cannot approve itself or directly perform consequential effects.
