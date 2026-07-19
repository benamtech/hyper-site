# Semantic-to-action loop MVP measured proof

Status: PASS  
Date: 2026-07-19  
Source commit: `cf9e9553637ba1b8f6337735fca3fbc2255ffe30`  
Workflow run: `29679215879`  
Artifact: `h0-h1-proof-29679215879`

## Implemented vertical slice

```text
approved corpus
-> bounded provider proposal
-> independent evidence validator
-> rejected first attempt
-> accepted repaired proposal
-> checkpointed SiteSource + LivingSurfaceState
-> deterministic site/public/operator compilation
-> checkpoint resume without provider regeneration
-> explicit approval
-> injected external executor
-> immutable idempotent receipt
-> completed living-surface state
```

## Package-owned source

- `hyper-content/src/semantic-generation.ts`
- `hyper-content/src/action-runtime.ts`
- `hyper-content/test/semantic-loop.test.mjs`
- `scripts/run-semantic-action-mvp.mjs`

## H2 semantic-generation result

- first proposal: rejected with `UNAPPROVED_CLAIM`;
- second proposal: accepted;
- proposal attempts: 2;
- accepted proposal hash: `ae109f40dcb8e79a45f5cf7187b19ec9a2223219894df3a368aa15b3ab827b29`;
- accepted site build hash: `54c4bc9e345b99450d65b014fc94a20eb6700a4f196f2f4eeddd6b4ed36784ca`;
- accepted public surface build hash: `27c8787f3d99221b10010618f84c1fe50b0313ca62641266d55830673c3ee869`;
- accepted operator surface build hash: `ce2f7c5eafa572968edea4948f94cba7b77f8823ae17ecd7e3611cd0b426f2b0`;
- resume called provider zero additional times;
- exhausted invalid attempts leave no `checkpoint.accepted` value.

## H4 action result

The action adapter requires:

```text
run_id
surface_state_hash
action_id
approval_id
approval_epoch
payload_hash
```

These values produce the idempotency key.

Measured result:

- action was `approval-required` before execution;
- approval was explicitly changed from pending to approved;
- external executor calls: 1;
- first request: executed;
- identical replay: returned stored receipt;
- receipt hash: `66ec407dd9241e1469873aa92beccdd0b74a3ff6f04d92e3aea1585e2b03e9a1`;
- replay receipt hash: identical;
- final action status: `completed`;
- final pending approvals: 0;
- final receipt count: 1.

## Complete proof state

```text
H0 integration: PASS
H1 package extraction: PASS
H2 bounded semantic-generation MVP: PASS
H3 living-surface MVP: PASS
H4 approved idempotent-action MVP: PASS
```

Additional checks:

- Hyper Site tests: 8/8;
- Hyper Content tests: 4/4;
- legacy tests: 80/80;
- isolated Hyper Site tarball consumers: PASS;
- randomized 25-page compiler/rejection suite: PASS;
- all three exact-head workflows: PASS.

## Reproduction

```bash
npm run mvp:semantic-action
npm run proof:h0-h1
```

Generated local artifacts:

```text
validation/reports/semantic-action-mvp/corpus.json
validation/reports/semantic-action-mvp/checkpoint.json
validation/reports/semantic-action-mvp/site-source.json
validation/reports/semantic-action-mvp/living-surface.json
validation/reports/semantic-action-mvp/site.html
validation/reports/semantic-action-mvp/public.html
validation/reports/semantic-action-mvp/operator-before.html
validation/reports/semantic-action-mvp/operator-after-state.json
validation/reports/semantic-action-mvp/receipt.json
validation/reports/semantic-action-mvp/report.json
```

## Nonclaims

- The fixture provider does not establish GLM or another hosted model's semantic quality.
- The injected executor does not establish production email, CRM or browser connector safety.
- The in-memory receipt store is not durable across process failure.
- This does not yet provide authentication, tenant authorization, credential custody, durable leases, dead-letter handling or remote publication.

## Decision

`advance-to-real-provider-and-real-connector-pilot`

The next pilot must use one real approved business corpus, one configured hosted provider, a durable checkpoint/receipt store and one low-risk connector in shadow or sandbox mode before any live external effect is authorized.
