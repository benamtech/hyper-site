# Useful Framework Target Architecture

Status: active target architecture  
Updated: 2026-07-18

## Decision

The current product architecture has two boundaries only:

```text
Hyper Content (optional, later)
  -> portable SiteSource
  -> Hyper Site
  -> static artifacts
```

Hyper Site must be independently useful. Hyper Content cannot compensate for a weak framework.

Agent runtimes, task surfaces and consequential publication are future integrations, not current layers of the product architecture.

## Hyper Site ownership

Hyper Site owns:

- `SiteSource`, `PageIR`, artifact and diagnostic contracts;
- structural validation and reference resolution;
- evidence-threshold enforcement already present in the compiler;
- deterministic normalization and compilation;
- HTML, CSS, metadata, JSON-LD and sitemap rendering;
- route and link validation;
- design tokens, layouts and a minimal component set;
- dependency declarations and artifact hashes;
- create, dev, build, preview and inspect commands;
- a local publish command that copies accepted static output to a target directory.

Hyper Site must not require:

- Hyper Content;
- an LLM or model provider;
- an agent loop;
- a database;
- a GPU;
- Zig, Wasm or binary serialization;
- private repository paths.

## Hyper Content boundary

Hyper Content is optional and starts only after the framework and maintenance gates pass.

Its first useful responsibility is intentionally small:

```text
approved business facts and evidence
-> validated claims and page records
-> portable SiteSource
```

It does not initially own autonomous research, ontology discovery, 10K selection, publication, runtime UI or durable workflow state.

## Package graph

Current:

```text
hyper-site/index.mjs
-> reference/dist/framework-core.js
```

Target:

```text
hyper-site/src
-> hyper-site/dist
-> package exports
-> isolated tarball consumer

reference
-> imports @amtech/hyper-site
-> compatibility fixtures and benchmarks only
```

There must be one compiler and one renderer authority during extraction. Compatibility wrappers may delegate, but may not become a second implementation.

## External developer workflow

```text
npm install <packed-hyper-site>
-> npx hyper-site create ./site
-> npm run dev
-> npm run build
-> npm run preview
-> npm run inspect
-> npm run publish:local -- ./published
```

The exact command names may change once, before the external fixture is frozen. After that, compatibility and diagnostics are part of the public contract.

## Starter architecture

The starter contains:

```text
site.config.*
content/
  facts.*
  pages.*
design/
  tokens.*
src/
  components/
  layouts/
public/
dist/
```

The first accepted site has exactly five distinct page purposes:

1. home;
2. service or product detail;
3. process or methodology;
4. evidence or case example;
5. contact or next-step page.

These are fixture roles, not a permanent restriction on the framework.

## Build outputs

Every build emits:

- complete route files;
- shared and page CSS/assets;
- canonical and robots metadata;
- sitemap;
- structured data where declared;
- artifact manifest;
- dependency index;
- page and build hashes;
- diagnostics in human-readable and JSON form.

A failed build is atomic: no new accepted output directory is promoted.

## Incremental boundary

The dependency index is a declared model, not proof of completeness.

For each maintenance fixture:

```text
freeze expected affected artifacts
-> apply one change
-> rebuild
-> compare actual changed artifacts
-> report missed required and unexpected changes
```

## Future work boundary

The following remain outside the active architecture until the maintenance decision is `advance`:

- model-backed generation;
- durable agent orchestration;
- public task surfaces;
- remote publication effects;
- 10K page programs;
- graph, vector, GPU, Zig or Wasm promotion.

## Removal rule

Any subsystem that is not required by the five-page site or does not beat a simpler control stays outside the critical path.
