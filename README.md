# Hyper Monorepo

Status: H0-H4 bounded MVP loop PASS  
Updated: 2026-07-19  
PR: #3 remains draft and unmerged

## Working loop

```text
approved corpus
-> bounded semantic proposal
-> independent evidence validation
-> bounded repair or atomic rejection
-> accepted SiteSource + LivingSurfaceState
-> deterministic Hyper Site compilation
-> public/operator living surfaces
-> resumable accepted checkpoint
-> explicit approval
-> injected external action executor
-> immutable idempotent receipt
-> completed living-surface state
```

`@amtech/hyper-site` owns deterministic site and living-surface compilation. `@amtech/hyper-content` owns bounded semantic proposals, independent validation, checkpoints, approved external actions and receipts.

```ts
import { runSemanticGeneration } from "@amtech/hyper-content/semantic-generation";
import { executeApprovedSurfaceAction } from "@amtech/hyper-content/action-runtime";
```

## Measured result

Validated source commit: `cf9e9553637ba1b8f6337735fca3fbc2255ffe30`  
Workflow run: `29679215879`  
Artifact: `h0-h1-proof-29679215879`

```text
H0 integration: PASS
H1 compiler/package extraction: PASS
H2 bounded semantic-generation MVP: PASS
H3 living-surface MVP: PASS
H4 approved idempotent-action MVP: PASS
```

- Hyper Site tests: 8/8;
- Hyper Content tests: 4/4;
- legacy tests: 80/80;
- isolated tarball consumers: PASS;
- unsupported proposal rejection and repair: PASS;
- accepted checkpoint resume without provider call: PASS;
- atomic bounded rejection: PASS;
- public/private projection boundary: PASS;
- approval-before-effect: PASS;
- exactly-once executor behavior under replay: PASS;
- immutable receipt replay: PASS;
- randomized 25-page compiler/rejection suite: PASS.

Measured authority: `validation/reports/2026-07-19-semantic-action-loop-mvp.md`

## Run it

```bash
git clone --single-branch --branch agent/glm-blackwell-vertical-slice https://github.com/benamtech/hyper-site.git
cd hyper-site
npm --prefix hyper-site install
npm --prefix hyper-content install
npm --prefix reference install
npm run mvp:semantic-action
npm run proof:h0-h1
```

## Next gate

Real provider and connector pilot:

1. durable transactional checkpoint and receipt storage;
2. GLM-compatible structured-output provider adapter;
3. one approved real business corpus;
4. tenant, actor and approval-epoch authorization;
5. one sandbox or shadow connector;
6. timeout, retry, duplicate-delivery and process-restart tests;
7. deterministic post-effect surface and receipt.

The current provider and executor are deterministic fixtures. Production connector safety, credential custody, durable leases, dead-letter handling and live browser execution are not yet proven.
