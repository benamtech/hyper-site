# Direct Product Validation Matrix

Status: active validation contract  
Updated: 2026-07-18

## Purpose

Every product claim must name a direct control, metric, failure threshold, and evidence artifact. Architecture breadth, package maturity, protocol conformance, and synthetic scale are not substitutes for user value.

## Source ownership

Pass only when canonical source lives under the owning package, public exports are explicit, clean package consumers work, dependency direction is one-way, and `reference/` consumes the packages rather than implementing them.

## Framework execution evidence

A statement that a site was built "with Hyper Site" is valid only when the evidence records:

1. exact public import entrypoint;
2. exact implementation path reached by that entrypoint;
3. immutable input fixture;
4. emitted HTML and companion artifacts;
5. independently recomputed hash or byte comparison;
6. at least one relevant rejection test;
7. environment and packaging limitations.

A copied, reconstructed, or behaviorally similar harness is not framework execution evidence.

Current verified state:

```text
consumer
-> hyper-site/index.mjs
-> reference/dist/framework-core.js
-> compileSite(SiteSource)
```

The verified one-page fixture demonstrated structural validation, evidence-threshold rejection, PageIR construction, HTML, instruction Markdown, sitemap, dependency index, page hash, and build hash. It does not satisfy source ownership, clean package consumption, five-page usefulness, publisher, or real-cohort gates.

## Hyper Site comparison

Freeze the same routes, content, assets, structured data, accessibility requirements, deployment target, and change scenarios.

Measure setup effort, time to first correct page, development latency, cold and incremental build time, memory, output bytes, accessibility, deployment, rollback, and maintenance effort.

Hyper Site fails if an ordinary static implementation reaches equivalent results with materially lower lifecycle cost and no loss of a required invariant.

## Hyper Content comparison

For every accepted page require an explicit user task, approved evidence, supported claims, distinct information object, duplicate review, freshness rule, retirement rule, and held-out acceptance decision.

Measure unsupported claims, citation-scope errors, stale evidence, page-existence acceptance, duplicate rejection, review minutes, provider cost, repair attempts, and maintenance minutes.

Compare against typed JSON or Markdown, direct templates, an explicit page list, lexical checks, and disciplined human review.

## Local task comparison

Compare one side-effect-free task with a normal HTML form and deterministic multi-step form.

Measure required-input completion, result completion, artifact usefulness, clarity, accessibility, abandonment, duplicate artifacts, and operator intervention.

The task fails if it is more confusing, less accessible, less reliable, or more expensive without a better result.

## Advanced-method promotion

| Candidate | Direct control | Promotion requirement |
|---|---|---|
| ontology | typed data | better accepted outcomes or maintenance |
| embeddings | lexical rules | held-out retrieval or duplicate gain |
| packed vectors | arrays and maps | measured workload benefit |
| Wasm | direct implementation | measured latency or portability benefit |
| GPU | CPU | measured throughput or cost benefit |
| generated task | ordinary form | better task or artifact outcome |
| automated page selection | explicit page list | better accepted cohort without extra risk |

Promotion requires a dated validation report. Otherwise the method remains experimental or is removed.

## Real-use ladder

1. Verified one-page compiler execution.
2. Clean package consumer and tarball proof.
3. Five-page internal fixture.
4. Independent rebuild.
5. One noindex real-business cohort.
6. One measured maintenance event.
7. One bounded local task with form control.
8. Paid pilot with explicit success criteria.
9. Repeatable second site.

## Documentation integrity

Research must point to architecture or rejection. Architecture must point to an active plan. Plans must point to validation. Passing claims must point to an exact-head report and immutable handoff.

Fail when active docs name noncanonical code, a compatibility harness is presented as framework execution, historical docs appear current, completion lacks a report, current CI evidence points to an older head, or PR nonclaims contradict repository state.