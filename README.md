# Hyper Site

Status: standalone vector-native site-generation compiler with an operator CLI, Z.AI GLM structured-generation adapter, independent approval gates, approved design authority, atomic PageDraft-to-PageIR transaction, resumable batches, and bounded local corpus validation. Synthetic 10,000-page full emission passes; real business, provider, hardware, relevance, and field acceptance remain pending.  
Updated: 2026-07-18

## Product boundary

Hyper Site turns explicit approved business truth into a finite static site. Model output is proposal state. Deterministic compilers, operator or independent reviewer approval, and local validation decide acceptance.

```text
repository + hyper-site.project.yaml
-> evidence-bound ProjectInput
-> GLM Stage 1 AgentOntologyProposal
-> exact-hash operator/reviewer approval
-> ApprovedOntology + typed graph + hard constraints
-> bounded opportunity selection
-> SiteGenerationPlan
-> GLM Stage 2 PageDraft batches
-> external schema/evidence validation + bounded repair
-> existing PageConceptProposal compiler
-> atomic SiteSource -> PageIR -> static HTML transaction
-> local lexical/semantic/information/crawl validation
-> noindex review site + reports + resumable checkpoints
```

Stage 3 is optional independent review or targeted repair. It produces observations only; it never overrides compiler acceptance.

## Minimum appliance contract

`reference/src/appliance-contract.ts` defines one optimized target and several explicit compatibility candidates.

- optimized: NVIDIA RTX PRO 6000 Blackwell 96 GB;
- host floor: 128 GiB RAM and 100 GiB free local NVMe;
- runtime floor: Linux x64, Node 22, CUDA 12.8;
- price is observed metadata and a soft budget check, never a capability claim;
- H200, H100, A100 80 GB, RTX 5090, and RTX 4090 remain compatibility candidates until measured on the same workloads.

The GPU is intended for local corpus processing, embeddings/reranking, specialist validators, asset work, browser/render workloads, and optional local models. GLM generation remains API-side unless another provider adapter is supplied.

## Design before and after bulk generation

`reference/src/design-authoring.ts` prevents the project from becoming a bulk-page compiler with an unattractive core site.

Before generation:

- the operator supplies brand/style sources, palette, typography, visual rules, component rules, and core-page design briefs;
- homepage and core conversion-page needs are explicit before landing-page expansion;
- the generator cannot approve its own design;
- unsafe CSS imports, remote URLs, scriptable URLs, HTML escapes, and oversized custom CSS reject.

After generation:

- one shared static stylesheet renders canonical semantic `PageIR`;
- design refinement can change CSS and presentation without regenerating accepted prose;
- content hashes and publication state must remain unchanged.

## Operator workflow

Run from `reference/`.

```bash
npm install --no-audit --no-fund --no-package-lock

# 1. Validate the rented machine
npm run production -- doctor examples/appliance-probe.example.json

# 2. Capture a repository and compile explicit business truth
npm run production -- ingest /path/to/business-repo hyper-site.project.yaml generated-operator/repository-ingestion.json

# 3. Verify the provider transport
ZAI_API_KEY=... npm run production -- provider-check glm-5.2

# 4. Produce the Stage-1 ontology proposal
ZAI_API_KEY=... npm run production:stage1 -- \
  generated-operator/repository-ingestion.json \
  examples/source-excerpts.example.json \
  generated-stage1

# 5. Approve exact proposal and design hashes
npm run production:approve -- ontology \
  generated-stage1/ontology-proposal.json \
  examples/ontology-review.example.json \
  generated-stage1/ontology-approval.json

npm run production:approve -- design \
  design-draft.json \
  examples/design-review.example.json \
  design-approval.json

# 6. Run approved Stage-2 batches, local validation, and static emission
ZAI_API_KEY=... npm run production -- run production-run.json generated-production-site
```

The final run requires:

- raw approved `ProjectInput` from the ingestion artifact;
- Stage-1 proposal and exact-hash approval;
- design draft and exact-hash approval;
- source excerpts;
- Z.AI credentials through environment variables;
- a local OpenAI-compatible embedding endpoint;
- base URL, run ID, vector identity, and optional compiler policies.

Accepted Stage-2 batches are written to an immutable checkpoint file after every successful batch. Restarting with unchanged dependencies reuses them. Changing sources, prior accepted batches, design, provider identity, base URL, embedding backend, or validation policy changes checkpoint identity or rejects stale state.

## Current authorities

| Area | Source |
|---|---|
| repository capture and ingestion | `reference/src/repository-ingestion.ts`, `reference/scripts/production-cli.mjs` |
| appliance contract | `reference/src/appliance-contract.ts` |
| GLM JSON transport and bounded repair | `reference/src/glm-provider.ts` |
| Stage-1/Stage-2 schemas and approval | `reference/src/generation-schemas.ts` |
| design authority and static styling | `reference/src/design-authoring.ts` |
| atomic canonical transaction | `reference/src/page-draft-transaction.ts` |
| bounded corpus validation | `reference/src/corpus-validation-production.ts` |
| recovery and physical orchestration | `reference/src/production-orchestrator.ts` |
| semantic PageIR/static compiler | `reference/src/framework.ts` |
| production acceptance tests | `reference/test/production-pipeline.test.mjs` |

## Validation

Two workflows run on pull requests and `agent/**` or `main` pushes:

- `.github/workflows/reference.yml`: existing full compiler, manifest, UI, browser, and R3F suite;
- `.github/workflows/production-pipeline.yml`: operator command checks plus focused production-boundary tests and retained transcript artifact.

Measured production fixture on branch head `5cfcc85fd6fe6910b9e4a2e366581e5514f08ffa`, workflow run `29635741933`:

| Cohort | Full synthetic path | Bounded candidate pairs | Rendered HTML |
|---:|---:|---:|---:|
| 100 | 2,489.626 ms | 3,675 | recorded in transaction |
| 500 | 3,142.146 ms | 509 | recorded in transaction |
| 10,000 | 19,179.290 ms | 12,949 | 54,291,900 bytes |

The focused suite passed 10/10 tests in 32,641.755 ms. It covers appliance classification, GLM external repair, Stage-1 approval/resume, core design and CSS-only refinement, 25-page atomic/noindex emission, near-duplicate rejection, Stage-2 checkpoint recovery, and the same full transaction at 100, 500, and 10,000 synthetic pages.

This is stronger than the prior 10,000-region planning proof, but it is still synthetic. It proves bounded software execution and static emission, not useful or market-worthy pages.

## Explicit nonclaims

Not proven:

- a real operator-approved business repository has completed the workflow;
- the live GLM-5.2 endpoint has produced an accepted ontology or PageDraft batch;
- an RTX PRO 6000 Blackwell or compatibility GPU has run the workload;
- generated pages are relevant, insightful, factually complete, or commercially useful;
- indexing, ranking, AI citations, conversion, revenue, or lifecycle return;
- 10,000 distinct high-quality designs or utilities;
- GPU, Wasm, Zig, HRR, or ANN superiority over simpler baselines.

## Next production gate

```text
one real business repository
+ reviewed hyper-site.project.yaml
+ real Markdown/CSS style authority
+ owned/licensed assets
+ live GLM credentials
+ measured Blackwell-class node
+ independent acceptance corpus
-> 25 real noindex pages
-> human and held-out evaluation
-> 100, then 500
-> 10,000 only after relevance, information gain, cannibalization, accessibility, crawl, and lifecycle gates pass
```
