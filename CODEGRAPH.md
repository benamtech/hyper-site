# CODEGRAPH.md — Hyper Useful Framework Path

Status: active architecture map; physical extraction incomplete  
Updated: 2026-07-18

## Current physical graph

```text
hyper-site/index.mjs
  -> reference/dist/framework-core.js
  -> reference/dist/site-manifest.js

reference/src/framework-core.ts
reference/src/site-manifest.ts
reference/src/*
  current mixed implementation authority

hyper-content/src/content-program-adapter.ts
  first physically extracted stable content adapter
```

`reference/` is still runtime authority for most behavior. Folder names and facades are not package ownership.

## Active product graph

```text
approved or hand-authored facts/pages/design
        |
        v
portable SiteSource
        |
        v
@amtech/hyper-site
  validate
  -> PageIR
  -> HTML/CSS/assets/metadata/JSON-LD
  -> sitemap/instructions
  -> manifest/dependencies/hashes
        |
        v
static output directory

@amtech/hyper-content
  optional later producer of portable SiteSource
```

Hard rules:

```text
hyper-content -> hyper-site
hyper-site -X-> hyper-content
hyper-site -X-> reference runtime
framework workflow -X-> LLM/GPU/database requirement
compiler output -X-> proof of usefulness or ranking
```

## Target package graph

```text
hyper-site/
  src/
    contracts/
      site-source
      page-ir
      artifacts
      diagnostics
    compiler/
      validate
      normalize
      compile
    renderer/
      html
      metadata
      structured-data
      sitemap
      instructions
    framework/
      design-tokens
      components
      layouts
      assets
      routing
    cli/
      create
      dev
      build
      preview
      inspect
      publish-local
    test/
  dist/
  package.json

hyper-content/
  src/
    facts/
    evidence/
    claims/
    pages/
    adapter/
      site-source
    experimental/
  test/
  dist/

reference/
  compatibility/
  fixtures/
  examples/
  benchmarks/
```

## Compiler graph

```text
SiteSource
-> validate base URL, IDs, references, routes and evidence thresholds
-> normalize modules/pages/dependencies
-> PageIR
-> render complete static artifacts
-> artifact manifest + dependency index + hashes
```

## Framework workflow graph

```text
install packed package
-> create starter
-> edit facts/pages/design
-> dev
-> build atomically
-> preview built output
-> inspect routes/links/metadata/dependencies
-> publish locally by copying accepted output
```

This path has no Hyper Content, model provider, agent runtime, GPU or database dependency.

## Extraction graph — U1

```text
inventory every reference/src file
-> assign one owner and role
-> freeze positive and negative fixtures
-> move compiler/renderer cluster to hyper-site/src
-> build hyper-site/dist
-> switch package exports
-> make reference consume Hyper Site
-> npm pack
-> isolated valid consumer
-> isolated invalid consumer
-> parity report
```

Forbidden U1 changes:

- new renderer semantics;
- new content-generation features;
- ontology/vector/GPU integration;
- CLI product expansion before package ownership passes;
- duplicate compiler authority.

## Starter and browser graph — U2/U3

```text
five approved page records
+ real facts/copy/assets
+ design tokens/components/layouts
-> Hyper build
-> static file server
-> browser assertions
-> link/route/metadata checks
-> automated accessibility scan
-> manual review
```

Direct controls use the same brief:

```text
typed JSON + direct templates
Astro static site
```

## Maintenance graph — U4

```text
freeze expected affected set
-> apply one shared/page/design/retirement/invalid change
-> rebuild
-> compare actual changed set
-> record missed required and unexpected changes
-> record operator/reviewer effort
-> advance | narrow | stop
```

The dependency index is a hypothesis. It cannot prove its own completeness.

## Optional content graph — U5

```text
approved facts and evidence
-> validated claims and page records
-> portable SiteSource
-> public Hyper Site compiler
```

No LLM, ontology, vector selection or agent runtime is required for U5.

## Proof graph

```text
U1 package ownership
-> U2 ordinary CLI/starter
-> U3 five-page browser acceptance
-> U4 maintenance correctness and value
-> U5 optional minimal content adapter
```

## Deferred graph

The following have no edge into the active proof graph:

```text
agent runtime
task surfaces
remote publication
SDRT/custom graph languages
GNN internal linking
GPU/Zig/Wasm promotion
binary LLM prompting
10K publication
enterprise claims
```

They remain research until U4 records `advance` and a new measured requirement is approved.

## Governed task-surface graph

```text
Hyper Content optional task proposal
  goal + evidence + inputs + outputs + limits
              |
              v
W7 protocol-neutral TaskServiceManifest / SurfacePlan
              |
      +-------+-------+
      |               |
      v               v
static fallback   runtime adapter interface
      |               |
      v               v
PageIR/HTML       intent -> events -> resource/receipt
      |               |
      +-------+-------+
              v
       governed task page
```

W7 is permanent. W1 remains static framework and renderer authority, W3 remains the temporary migration bridge, W4 owns observability/recovery/security infrastructure, and W6 owns field and revenue acceptance. Protocol adapters live outside the canonical ABI.
