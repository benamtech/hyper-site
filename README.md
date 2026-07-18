# Hyper Site

Status: research prototype approaching near-alpha. The repository contains a source-wired agent-first web-framework experiment, not a production product. Synthetic 10,000-page full emission passes; ordinary-framework comparison, real repositories, live providers, real hardware, operator usability, design quality, and field acceptance remain pending.  
Updated: 2026-07-18

## Product identity

Hyper Site is intended to become an **agent-first web framework and experience compiler**.

Large-batch page generation is one workload. The product definition is broader:

```text
repository understanding
-> business datasheets and evidence
-> design systems, typography, layouts, graphics, and starter pages
-> bounded ontology and page-generation jobs
-> canonical PageIR/static output
-> operator review
-> post-generation editing, restyling, retirement, drift, and maintenance
-> next checkpointed agent invocation
```

The framework fails if it can emit 10,000 pages but cannot create, preview, revise, and maintain an attractive five-page site with normal framework ergonomics.

`27-near-alpha-framework-validation-and-continuous-agent-workspace.md` is the current maturity and evaluation authority.

## Maturity boundary

- Current maturity is `research-prototype` / `near-alpha` only.
- Names containing `production` identify production-boundary experiments, not readiness claims.
- Model output remains proposal state.
- Synthetic scale proves bounded software behavior and static emission only.
- No performance claim is valid until Hyper Site is measured against an ordinary static, SSR, or SPA framework on the same fixture and machine.
- No usefulness claim is valid until non-synthetic case studies and held-out judgments pass.

## Canonical lifecycle

```text
repository + hyper-site.project.yaml
-> evidence-bound ProjectInput
-> business/design workspace artifacts
-> GLM Stage 1 AgentOntologyProposal
-> exact-hash independent approval
-> ApprovedOntology + typed graph + hard constraints
-> bounded opportunity selection
-> SiteGenerationPlan
-> GLM Stage 2 PageDraft batches
-> external schema/evidence validation + bounded repair
-> existing PageConceptProposal compiler
-> atomic SiteSource -> PageIR -> static HTML transaction
-> shared design-system render
-> local lexical/semantic/information/crawl validation
-> noindex review site + reports + resumable checkpoints
-> post-generation workspace edits and dependency invalidation
```

Stage 3 is optional independent review or targeted repair. It produces observations only and never overrides compiler acceptance.

## Continuous agent workspace

Continuous operation means repeated explicit invocations over an immutable workspace, not an uncontrolled always-on loop.

`reference/src/agent-workspace.ts` and `reference/scripts/workspace-cli.mjs` provide the first durable boundary:

- every artifact declares kind, phase, producer, sources, dependencies, status, and content hash;
- each mutation creates a new snapshot linked to the previous snapshot hash;
- dependency traversal calculates which artifacts must rebuild after a source, design, component, page, or family change;
- unaffected artifacts remain explicit and must preserve their hashes.

From `reference/`:

```bash
npm run workspace -- help
npm run workspace -- init workspace-input.json workspace.json
npm run workspace -- append workspace.json artifact.json 2 workspace-v2.json
npm run workspace -- replace workspace-v2.json revised-artifact.json 3 workspace-v3.json
npm run workspace -- invalidate workspace-v3.json changed-artifacts.json invalidation-plan.json
npm run workspace -- summary workspace-v3.json
```

The current workspace CLI is file-based and near-alpha. It is not yet integrated with a visual editor, asset-generation surface, development server, or persistent multi-user service.

## Core-site design before bulk work

`reference/src/design-authoring.ts` requires a source-bound, independently approved design authority.

Before bulk generation, the workspace should contain:

```text
business datasheet
evidence ledger
style guide
design system
typography system
layout system
graphics briefs and owned/licensed assets
starter pages and core conversion pages
```

After generation, one shared static stylesheet can refine the site without regenerating accepted prose. Canonical content hashes and publication state must remain unchanged.

This proves a safe design boundary, not human-perceived design quality. Real creative review is pending.

## Minimum appliance experiment

`reference/src/appliance-contract.ts` defines one optimized experimental target and explicit compatibility candidates.

- optimized target: NVIDIA RTX PRO 6000 Blackwell 96 GB;
- host floor: 128 GiB RAM and 100 GiB free local NVMe;
- runtime floor: Linux x64, Node 22, CUDA 12.8;
- compatibility candidates: H200, H100, A100 80 GB, RTX 5090, RTX 4090;
- rental price is observed soft metadata, never capability truth.

The GPU is intended for local embeddings, reranking, specialist validators, corpus processing, asset work, and browser/render workloads. GLM generation remains API-side unless another provider is supplied.

No real node has passed the framework workload yet.

## Operator experiment

Run from `reference/`.

```bash
npm install --no-audit --no-fund --no-package-lock

# Diagnose a rented node
npm run production -- doctor examples/appliance-probe.example.json

# Capture explicit repository truth
npm run production -- ingest /path/to/business-repo hyper-site.project.yaml generated-operator/repository-ingestion.json

# Verify live provider transport
ZAI_API_KEY=... npm run production -- provider-check glm-5.2

# Generate Stage-1 proposal
ZAI_API_KEY=... npm run production:stage1 -- \
  generated-operator/repository-ingestion.json \
  examples/source-excerpts.example.json \
  generated-stage1

# Independently approve exact hashes
npm run production:approve -- ontology \
  generated-stage1/ontology-proposal.json \
  examples/ontology-review.example.json \
  generated-stage1/ontology-approval.json

npm run production:approve -- design \
  design-draft.json \
  examples/design-review.example.json \
  design-approval.json

# Run approved Stage-2 batches and emit a noindex static review site
ZAI_API_KEY=... npm run production -- run production-run.json generated-near-alpha-site
```

The scripts retain the `production` prefix because they exercise the production boundary. They are not a production release interface.

## Near-alpha validation authority

`reference/src/near-alpha-framework.ts` rejects the framework when any of these conditions hold:

- the workspace is bulk-generation-only;
- core datasheet/design/typography/layout/graphics/starter-page artifacts are missing or appear after bulk generation;
- hypotheses lack tests or falsification rules;
- network-science metrics lack a simpler baseline or held-out outcomes;
- no complete non-synthetic case study exists;
- pages lack distinct tasks, information objects, evidence, nearest-neighbor differences, or lifecycle owners;
- Hyper Site lacks a directly comparable ordinary-framework baseline;
- 10K scale lacks incremental post-generation edit measurements;
- claimed scale exceeds the measured full-framework ceiling.

`reference/test/near-alpha-framework.test.mjs` and `reference/test/agent-workspace.test.mjs` exercise those rejection boundaries.

## Required framework comparison

The first serious benchmark must freeze one semantic fixture and run Hyper Site plus at least one ordinary framework on the same machine.

Required metrics include:

- cold build;
- incremental edit/build;
- development-server startup and update latency;
- peak memory;
- emitted HTML, JavaScript, CSS, asset, and total bytes;
- validation time;
- serving and crawl behavior;
- accessibility;
- design-system integrity and customization effort;
- agent retries, approvals, checkpoint recovery, and operator time;
- source, token, component, page, and page-family maintenance changes.

Planning or generation timing alone is not web-framework performance.

## Scale boundary

Required experimental tiers:

```text
5 qualitative starter pages
25 real noindex pages
100 pages
500 pages
10,000 pages
```

At 10K, the framework must separately measure changes to:

```text
one page-specific source fact
one family-wide source fact
one design token
one shared component
one page-specific information object
one page
one page family
one ontology relation
one evidence source
one interrupted batch
```

The result must record invalidated and unchanged artifacts, elapsed time, memory, output churn, crawl effects, review burden, and rollback.

No result beyond 10K may be claimed until this full maintenance experiment and an ordinary-framework comparison pass.

## Current authorities

| Area | Source |
|---|---|
| near-alpha maturity and benchmark gate | `27-near-alpha-framework-validation-and-continuous-agent-workspace.md`, `reference/src/near-alpha-framework.ts` |
| continuous artifact workspace | `reference/src/agent-workspace.ts`, `reference/scripts/workspace-cli.mjs` |
| repository capture and ingestion | `reference/src/repository-ingestion.ts`, `reference/scripts/production-cli.mjs` |
| appliance profiles | `reference/src/appliance-contract.ts` |
| GLM JSON transport and bounded repair | `reference/src/glm-provider.ts` |
| Stage-1/Stage-2 schemas and approval | `reference/src/generation-schemas.ts` |
| design authority and static styling | `reference/src/design-authoring.ts` |
| atomic canonical transaction | `reference/src/page-draft-transaction.ts` |
| bounded corpus validation | `reference/src/corpus-validation-production.ts` |
| recovery and physical orchestration | `reference/src/production-orchestrator.ts` |
| semantic PageIR/static compiler | `reference/src/framework.ts` |

## Validation

Two workflows run on pull requests and `agent/**` or `main` pushes:

- `.github/workflows/reference.yml`: full compiler, manifest, UI, browser, and R3F suite;
- `.github/workflows/production-pipeline.yml`: near-alpha operator checks, production-boundary tests, framework rejection tests, workspace invalidation tests, and retained transcript artifact.

The prior validated synthetic fixture emitted 10,000 complete PageIR/static HTML objects and passed bounded corpus validation. Exact current-head evidence belongs in the newest validation report and memory handoff.

That proof remains synthetic. It does not show that 10,000 pages deserve to exist or that Hyper Site is better than a conventional framework.

## Explicit nonclaims

Not proven:

- a real business repository has completed the workflow;
- the live GLM endpoint has produced accepted ontology and PageDraft outputs;
- any target or compatibility GPU has run the full workload;
- the agent creates consistently attractive starter sites, graphics, typography, or layouts;
- continuous multi-session operation works outside file-based fixtures;
- incremental invalidation is faster or smaller than an ordinary framework;
- generated pages are relevant, insightful, factually complete, accessible, or commercially useful;
- network science improves page selection or maintenance;
- indexing, ranking, AI citations, conversion, revenue, or lifecycle return;
- GPU, HRR, ANN, Wasm, Zig, or other advanced methods beat simpler baselines.

## Next near-alpha gate

```text
1. Freeze one real five-page starter-site case.
2. Capture approved business, style, typography, layout, graphics, and asset sources.
3. Run the live provider and a real rented node.
4. Complete the same case in Hyper Site and an ordinary framework.
5. Measure authoring, cold build, incremental edits, output, browser, accessibility, and operator effort.
6. Extend the real case to 25 noindex pages with page-existence justifications.
7. Freeze held-out relevance and design judgments.
8. Scale to 100, then 500.
9. Run the full 10K maintenance matrix only after those gates pass.
10. Decide whether the repository has earned an actual alpha milestone.
```
