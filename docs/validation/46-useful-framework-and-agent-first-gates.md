# Useful Framework Validation Gates

Status: active validation contract  
Updated: 2026-07-18

## Principle

A green compiler fixture is not a useful framework. Each gate requires evidence from the public package and user-visible workflow.

## Gate U1 — Package ownership

Pass only when:

- canonical compiler and renderer source resides under `hyper-site/src`;
- `hyper-site/dist` is built from package-owned source;
- package exports resolve only package-owned files;
- Hyper Site runtime imports do not enter `reference/`;
- `reference/` consumes Hyper Site rather than implementing it;
- two isolated `npm pack` consumers pass;
- frozen positive and negative behavior remains equivalent.

Failure examples:

- copied `dist` presented as source ownership;
- workspace-only relative imports;
- facade still delegates to `reference/dist`;
- hidden second compiler or renderer;
- tarball requires the monorepo root.

## Gate U2 — Ordinary framework workflow

Pass only when a clean consumer can perform:

```text
create -> dev -> build -> preview -> inspect -> local publish
```

without Hyper Content, an LLM SDK, GPU, database or external service.

Required evidence:

- exact install and command transcript;
- command help and exit-code tests;
- starter artifact tree;
- atomic build test;
- text and JSON diagnostics;
- preview of the built output;
- local publish hash parity with the accepted build.

## Gate U3 — Five-page usefulness

Pass only when:

- five pages have distinct accepted purposes;
- facts, copy, design and assets are real and approved;
- Hyper, direct-template and Astro controls use the same brief;
- route, link, metadata and static-file assertions pass;
- browser tests verify user-visible behavior;
- accessibility scanning reports no critical automatically detectable violation;
- manual review is recorded;
- output is usable from a basic static file server;
- superiority claims are limited to measured results.

Automated accessibility checks are partial evidence and cannot replace manual review.

## Gate U4 — Maintenance correctness and value

For each frozen change, define the expected affected set before execution.

Pass correctness only when:

```text
required_but_missed = 0
invalid_change_accepted = false
partial_accepted_output_after_failure = false
```

Unexpected changed artifacts must be zero or explicitly justified.

Pass value only when Hyper demonstrates at least one of:

- materially lower operator or review time;
- lower defect rate;
- safer rejection or rollback;
- a required evidence/reference invariant absent from controls;
- more precise affected-set behavior.

Otherwise the required decision is `narrow` or `stop`.

## Gate U5 — Minimal Hyper Content adapter

Blocked until U4 records `advance`.

Pass only when:

- approved facts and evidence deterministically produce portable `SiteSource`;
- Hyper Site remains usable without Hyper Content;
- no private Hyper Site implementation is imported;
- invalid claims and broken references reject before accepted output;
- the adapter is simpler than hand-authoring for the frozen fixture.

No LLM or ontology gate is part of U5.

## Adversarial matrix

Every gate includes tests for:

- missing files and references;
- duplicate IDs and routes;
- path traversal and output-directory escape;
- malformed metadata and unsafe HTML text;
- nondeterministic ordering;
- stale output surviving a failed build;
- package exports that work only in the workspace;
- changed source not represented in hashes;
- under-invalidation and over-invalidation;
- command interruption and cleanup;
- broken links and inaccessible controls.

## Current expected state

```text
U1 RED
U2 BLOCKED BY U1
U3 BLOCKED BY U2
U4 BLOCKED BY U3
U5 BLOCKED BY U4 ADVANCE
```

Agent, task-surface, low-level runtime and 10K-scale gates are not active product gates.
