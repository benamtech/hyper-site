# Hyper Monorepo Durable Memory

status: active  
updated_at: 2026-07-19T04:10:00-04:00

## State

branch: agent/glm-blackwell-vertical-slice  
pr: 3  
draft: true  
merged: false  
maturity: H0-H4 bounded MVP loop measured PASS; real provider and durable connector pilot is next

## Active boundary

```text
Hyper Content -> accepted semantic/runtime state -> Hyper Site
reference -> Hyper Site compatibility surface
Hyper Site -X-> Hyper Content
Hyper Site -X-> reference runtime
external executor -X-> semantic approval authority
```

## Measured truth

Validated source commit: `cf9e9553637ba1b8f6337735fca3fbc2255ffe30`  
Workflow run: `29679215879`  
Artifact: `h0-h1-proof-29679215879`

```text
H0 integration: PASS
H1 physical extraction: PASS
H2 bounded semantic-generation MVP: PASS
H3 living-surface MVP: PASS
H4 approved idempotent-action MVP: PASS
```

## Physical truth

- `hyper-site/src` owns deterministic site and living-surface compilation.
- `hyper-content/src/semantic-generation.ts` owns bounded provider proposals, independent validation, repair attempts and checkpoints.
- `hyper-content/src/action-runtime.ts` owns approval verification, idempotency keys, executor invocation and immutable receipts.
- Hyper Site tests pass 8/8.
- Hyper Content tests pass 4/4.
- legacy compatibility tests pass 80/80.
- isolated Hyper Site tarball consumers pass.
- all three exact-head workflows passed on the measured commit.

## Complete bounded loop

```text
approved corpus
-> provider proposal attempt 1
-> independent UNAPPROVED_CLAIM rejection
-> provider proposal attempt 2
-> independent acceptance
-> SiteSource + LivingSurfaceState checkpoint
-> deterministic site/public/operator builds
-> resume without provider regeneration
-> explicit approval
-> injected external executor
-> immutable receipt
-> idempotent replay
-> completed surface state
```

Measured hashes:

- accepted proposal: `ae109f40dcb8e79a45f5cf7187b19ec9a2223219894df3a368aa15b3ab827b29`;
- site build: `54c4bc9e345b99450d65b014fc94a20eb6700a4f196f2f4eeddd6b4ed36784ca`;
- public surface: `27c8787f3d99221b10010618f84c1fe50b0313ca62641266d55830673c3ee869`;
- operator surface: `ce2f7c5eafa572968edea4948f94cba7b77f8823ae17ecd7e3611cd0b426f2b0`;
- receipt and replay: `66ec407dd9241e1469873aa92beccdd0b74a3ff6f04d92e3aea1585e2b03e9a1`.

## Authorities

- `README.md`
- `validation/reports/2026-07-19-h0-h1-extraction-proof.md`
- `validation/reports/2026-07-19-living-surface-mvp.md`
- `validation/reports/2026-07-19-semantic-action-loop-mvp.md`
- `memory/2026-07-19-0410-semantic-action-loop-mvp.md`

## Next gate

Real provider and connector pilot:

1. durable transactional checkpoint and receipt store;
2. GLM-compatible structured-output provider adapter;
3. approved real business corpus;
4. tenant, actor and approval-epoch authorization;
5. one sandbox/shadow connector;
6. timeout, retry, duplicate-delivery and process-restart proof;
7. deterministic post-effect projection and immutable receipt.

## Nonclaims

The provider and executor are fixtures. Current proof does not establish hosted-model quality, production connector safety, credential custody, multi-tenant authorization, durable leases, dead-letter handling, live browser execution or autonomous production publication.

PR #3 remains draft and unmerged.
