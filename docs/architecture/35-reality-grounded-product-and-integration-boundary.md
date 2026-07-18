# Reality-Grounded Product Boundary

Status: accepted architecture correction  
Updated: 2026-07-18  
Input: `docs/research/34-intellectual-competitive-and-use-case-landscape.md`

## Correction

The previous version promoted external systems into architecture before Hyper had demonstrated a requirement for them. Active architecture now includes only capabilities required by the current packages and the next fixture.

## Product path

```text
approved source material
-> @amtech/hyper-content
-> portable content and site contracts
-> @amtech/hyper-site
-> deterministic static artifacts
```

Neither package requires a broader platform layer.

## Hyper Site owns

- content-neutral static compilation;
- PageIR and deterministic web artifacts;
- semantic rendering contracts;
- design, accessibility, and browser budgets;
- dependency and invalidation metadata;
- static publisher interfaces;
- optional local task declarations only after the static fixture passes.

It does not own content discovery, content generation, general workflow execution, connector catalogs, enterprise identity, editorial platforms, experiment systems, or broad runtime administration.

## Hyper Content owns

- source and evidence intake;
- claim and information-object proposals;
- page opportunity and page-existence methods;
- provider dispatch and structured generation;
- PCN and ArticleIR acceptance;
- corpus validation and invalidation proposals;
- portable output for Hyper Site.

It does not own HTML rendering, browser state, credentials, external effects, or publication authority.

## Dependency admission rule

A new dependency may enter an active plan only when:

1. a current fixture exposes a concrete requirement;
2. the requirement belongs to a Hyper-owned invariant;
3. the simplest local implementation fails a measured criterion;
4. the candidate improves a named pass metric;
5. integration cost and removal are documented;
6. the package remains optional unless the product cannot exist without it.

A package is never adopted merely because it is established or mature.

## Build now

- package-owned TypeScript source;
- deterministic schemas and contracts;
- static compilation;
- explicit validation and rejection;
- artifact provenance;
- dependency indexing and invalidation;
- filesystem/static-host publication;
- direct test fixtures and comparison harnesses.

## Do not build or integrate now

- general workflow engines;
- agent orchestration frameworks;
- connector marketplaces;
- enterprise authorization products;
- editorial platforms;
- experiment platforms;
- broad observability platforms;
- enterprise automation suites.

## First task boundary

If a task surface is tested, use a small local model:

```text
typed intent
-> schema validation
-> deterministic transition
-> append-only local record
-> public result or rejection
```

The first task is side-effect free. It does not require distributed retries, long-running waits, external connectors, enterprise policy, or multi-agent control.

## Baseline rule

| Candidate method | Direct control |
|---|---|
| ontology graph | typed JSON or relational schema |
| embeddings | lexical retrieval and explicit rules |
| HRR/HDC or packed vectors | arrays, maps, and deterministic IDs |
| Wasm | direct JavaScript or server implementation |
| GPU | CPU implementation |
| generated task surface | ordinary form or trusted static components |
| autonomous page selection | explicit human-authored page list |

No method becomes architectural authority from novelty or synthetic scale.

## Initial proof boundary

```text
one approved evidence set
-> five justified pages
-> one static deployment
-> one measured maintenance event
```

Only after that passes may one bounded, side-effect-free task be tested against an ordinary form.

## Consequences

- P1.4 and P1.5 remain the immediate priority.
- P1.6 must begin with local contracts and negative tests, not integrations.
- P2 compares equivalent direct implementations.
- P3 proves real evidence, real pages, and real maintenance before broader scope.
- External software is absent from the active architecture until a measured requirement exists.