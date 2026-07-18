# Useful Framework Reality Audit

Status: active research authority  
Updated: 2026-07-18

## Question

What is the shortest evidence-backed path from the current compiler prototype to software an outside developer can use?

## Current physical truth

The only demonstrated product behavior is:

```text
SiteSource
-> validation
-> PageIR
-> semantic HTML, metadata and JSON-LD
-> sitemap and optional instruction Markdown
-> dependency index
-> deterministic hashes
```

That behavior is real, but `hyper-site/index.mjs` still delegates to `reference/dist/framework-core.js`. The package is private, has no package-owned compiler build, and has not been proven from an isolated tarball consumer.

## External framework floor

Official npm documentation establishes that package exports define the public interface and that `npm pack` produces the distributable artifact. Therefore workspace imports and a facade are not package proof.

Official Astro documentation provides a practical direct control:

```text
create project
-> dev server
-> schema-validated content
-> static routes
-> build to dist
-> preview built output
```

Astro is not a required dependency. It is a falsification control for whether Hyper adds value beyond a normal static framework.

Playwright recommends testing user-visible behavior rather than private implementation details. Its accessibility guidance also states that automated scans catch only part of the accessibility problem. Hyper therefore needs browser assertions plus human review, not only compiler snapshots.

## Product decision

The active product is now only:

```text
Hyper Site
  installable deterministic static framework

Hyper Content
  optional later producer of portable SiteSource
```

An agent runtime, task surface, publication workflow, GPU path, Zig/Wasm kernel and 10K generation program are not active product milestones. They may be reconsidered only after the useful framework and maintenance gates pass.

## Definition of useful

A clean external developer must be able to:

```text
install a packed package
-> create a starter
-> edit structured facts and design tokens
-> run dev
-> build five distinct pages
-> preview the built site
-> inspect routes, metadata, links and dependencies
-> copy the static output to a local publish directory
```

The result must include complete HTML, CSS, assets, canonical metadata, sitemap, structured data where appropriate, deterministic artifact hashes and actionable diagnostics.

## Minimum differentiation hypothesis

Hyper is worth continuing only if it demonstrates at least one practical advantage over a direct typed-content/template control:

- unsupported claims or broken references fail before output is accepted;
- shared facts and design changes have precise, reviewable affected sets;
- page retirement and indexability changes are safer;
- artifacts and source dependencies are easier to audit;
- maintenance takes materially less operator or reviewer effort.

Compiler sophistication, graph metrics, vector math, synthetic scale and deterministic hashes do not establish this advantage by themselves.

## Research-backed execution order

```text
U1 package ownership and isolated consumption
-> U2 ordinary CLI and starter workflow
-> U3 five-page browser-accepted site
-> U4 maintenance comparison and go/no-go
-> U5 optional minimal Hyper Content adapter
```

No agent or scale milestone belongs in this sequence.

## Direct controls

1. A simple typed JSON plus template implementation.
2. An Astro static site using the same facts, routes, design and acceptance criteria.

Hyper must not weaken either control. The same operator receives the same brief, inputs and output requirements.

## Stop rules

Narrow or stop the framework if:

- the packed package still depends on repository-relative files;
- the CLI is harder to use than the direct control without a measured compensating invariant;
- the five pages are templated variants rather than distinct useful pages;
- browser or accessibility failures remain hidden by compiler tests;
- the dependency index misses required rebuilds;
- maintenance value cannot be demonstrated;
- advanced research repeatedly delays the external-user path.

## Source authority

Official and primary sources are recorded in `docs/research/sources/2026-07-18-framework-agent-architecture.sources.json`.
