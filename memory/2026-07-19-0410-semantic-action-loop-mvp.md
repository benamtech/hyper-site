# Semantic-to-action loop MVP handoff

Date: 2026-07-19  
Branch: `agent/glm-blackwell-vertical-slice`  
Measured source commit: `cf9e9553637ba1b8f6337735fca3fbc2255ffe30`  
Workflow: `29679215879`  
PR: #3 draft and unmerged

## Completed

Hyper Content now owns a bounded semantic-generation and approved-effect MVP:

```text
approved corpus
-> provider proposal
-> independent validator
-> bounded repair/reject
-> accepted SiteSource + LivingSurfaceState
-> deterministic Hyper Site compilation
-> resumable checkpoint
-> approval
-> external executor
-> immutable idempotent receipt
```

Package APIs:

- `@amtech/hyper-content/semantic-generation`
- `@amtech/hyper-content/action-runtime`

## Measured truth

```text
H0 PASS
H1 PASS
H2 MVP PASS
H3 MVP PASS
H4 MVP PASS
```

- first unsupported proposal rejected;
- second proposal accepted;
- accepted checkpoint resumes without provider execution;
- exhausted invalid attempts are atomic;
- public projection excludes private pricing and send controls;
- approved action executes once;
- identical replay returns the same receipt;
- final surface action is completed and receipt-bound.

Measured authority:

- `validation/reports/2026-07-19-semantic-action-loop-mvp.md`

## Important limits

- provider is a deterministic fixture;
- receipt store is in-memory;
- executor is injected and simulated;
- no real credentials or external system are touched;
- no tenant authorization, durable lease, dead-letter queue or connector policy exists yet.

## Next gate

Real provider and connector pilot:

1. persist checkpoints and receipts in a durable transactional store;
2. implement a GLM-compatible provider adapter with schema-constrained output and recorded usage;
3. use one approved real business corpus;
4. add tenant/actor authorization and approval epochs;
5. implement one sandbox or shadow connector;
6. prove retry, timeout, duplicate delivery and process-restart behavior;
7. retain an immutable receipt and deterministic post-effect surface.

No production external effect should be enabled before these gates pass.
