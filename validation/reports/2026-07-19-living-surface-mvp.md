# Living Surface MVP measured proof

Status: PASS  
Date: 2026-07-19  
Source commit: `f5734533da137f1f28509d495f7fc67a187495ad`  
Workflow run: `29677235149`  
Artifact: `h0-h1-proof-29677235149`

## Implemented boundary

```text
LivingSurfaceState
-> validation
-> audience permission projection
-> action governance resolution
-> agency/priority decision ledger
-> deterministic static HTML
-> public and operator artifacts
```

The implementation is package-owned at `hyper-site/src/living-surface.ts` and exported from `@amtech/hyper-site` and `@amtech/hyper-site/living-surface`.

## Implemented MVP contracts

- nine-channel `ContinuousInterfaceVector`;
- typed information objects, actions, approvals, receipts and nodes;
- explicit `public`, `operator` and `both` visibility;
- explicit user, agent and mixed action authority;
- action risk and user-control agency values;
- runtime health projection;
- deterministic public/operator filtering before rendering;
- deterministic node scoring and ordering;
- agency mode classification;
- `k(A) = k_max * (1 - A)` blend-radius implementation;
- logistic approval-boundary curvature;
- accessible DOM/static HTML fallback;
- state, HTML and build hashes;
- human-readable decision explanations.

## Exact checks

- monorepo and package build: PASS;
- Hyper Site package tests: 8/8;
- legacy compatibility tests: 80/80;
- clean-room npm tarball runtime consumer: PASS;
- clean-room strict TypeScript consumer: PASS;
- living-surface JS and declaration files present in tarball: PASS;
- public projection excludes operator-only pricing and send controls: PASS;
- operator projection exposes approval gate: PASS;
- high-risk available action resolves to `approval-required`: PASS;
- hostile HTML is escaped: PASS;
- invalid field vectors and missing references reject: PASS;
- source reordering preserves state, HTML and build hashes: PASS;
- deterministic public/operator demo artifacts: PASS.

## Measured demo hashes

Public projection:

```text
state: 632a68e865af8e364c323d2187a24659ee8849b730855656ba24fc89dd34d80c
html:  c36b56624f6cc5aa4db31a21c81386c04981ca5ec73bd3fe223a4d9a7ba456de
build: d572dfad06444a3fe295d94acdf274c6887d10678afc602f482b310b64f5eb1a
```

Operator projection:

```text
state: 786bc3704519b8fce29599c6cc72cfa6a0cb2cba531823cf871a99fbe76cc103
html:  d63da6e4baf060402c3cc4fef9c78a02ee876cbc9e393a94c9b6d78df399527c
build: 8f294c782006bccec9290c294650c8f4fc815ec669ff829de9916b4f5d21db79
```

## Reproduction

```bash
npm --prefix hyper-site install
npm run mvp:living-surface
npm run proof:h0-h1
```

Generated local artifacts:

```text
validation/reports/living-surface-mvp/source.json
validation/reports/living-surface-mvp/public.html
validation/reports/living-surface-mvp/operator.html
validation/reports/living-surface-mvp/public-projection.json
validation/reports/living-surface-mvp/operator-projection.json
validation/reports/living-surface-mvp/report.json
```

## Scope decision

This is an executable H3 substrate, not the completed living-website product.

The following remain unproven and are not claimed by this report:

- provider-backed autonomous generation;
- durable remote agent execution;
- browser task execution;
- live event transport or interactive action handlers;
- psychographic inference;
- PDE or reaction-diffusion layout;
- CSG/WebGPU rendering advantage;
- SDRT/GNN advantage;
- GPU, Zig or Wasm advantage;
- production authorization, credentials or publication effects.

## Next implementation gate

Connect H2 accepted semantic generation output to `LivingSurfaceState`, then add a bounded event/action adapter whose side effects remain external, approved and receipt-bound.
