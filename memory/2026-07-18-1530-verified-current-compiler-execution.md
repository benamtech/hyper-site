# Verified Current Compiler Execution

Status: immutable handoff  
Recorded: 2026-07-18 15:30 America/New_York

## Correction

An initial demonstration used a copied compatibility harness and therefore did not prove execution of the repository framework. Do not use that artifact as framework evidence.

## Verified path

A replacement fixture executed the current compiler through the present public boundary:

```text
consumer build script
-> hyper-site/index.mjs
-> reference/dist/framework-core.js
-> compileSite(SiteSource)
```

The public package boundary is real. Physical ownership is not complete because the public entrypoint still delegates to `reference/dist`.

## Verified behavior

The one-page fixture demonstrated:

- SiteSource structural validation;
- evidence, claim, information-object, module, and page reference resolution;
- evidence-level rejection;
- PageIR construction;
- semantic HTML emission;
- canonical, description, robots, and JSON-LD metadata;
- Markdown instruction projection;
- XML sitemap;
- reverse dependency index;
- per-page and whole-build SHA-256 hashes.

The negative fixture lowered `ev-business` below the requirement of `claim-practical` and was rejected with:

```text
claim claim-practical exceeds evidence ev-business
```

## Exact claim permitted

The current compiler implementation works for the verified one-page fixture when locally materialized and imported through the present Hyper Site boundary.

## Claims not permitted

This does not establish:

- independent npm or tarball consumption;
- a clean external repository consumer;
- complete source extraction;
- a five-page product fixture;
- developer tooling, theme, publisher, or deployment readiness;
- useful generated content;
- framework advantage;
- production readiness.

## Permanent demonstration rule

A future claim that an artifact was built with Hyper Site must include the exact public entrypoint, reached implementation path, immutable input, emitted outputs, independent hash or byte verification, a relevant rejection test, and environment limitations. A copied or behaviorally similar harness is not sufficient.

## Next gate

Commit a repository-owned fixture and repeat this proof from a clean package consumer after physical extraction and tarball support.