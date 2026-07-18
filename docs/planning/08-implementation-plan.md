# 08 — v0.1 Implementation Plan

Status: next coding-session execution plan

## Goal

Produce a public `noindex` Cloudflare Request Mirror Lab that:

- server-renders request and Cloudflare metadata;
- optionally reveals bounded browser signals;
- accepts explicit synthetic trait fixtures;
- constructs a deterministic HRR context shape;
- ranks finite content slices;
- displays score/provenance/timing diagnostics;
- runs TypeScript and Zig/WASM cores side by side;
- falls back safely to the generic slice.

No AMTECH marketing redesign is required for v0.1.

## Proposed folder structure

```text
GTM-RESEARCH/website-framework/
├── README.md
├── docs/validation/00-scientific-and-feasibility-validation.md
├── docs/architecture/01-system-architecture.md
├── docs/research/02-shape-model-and-hrr-core.md
├── docs/research/03-agentic-seo-system.md
├── docs/validation/04-feature-validation-vectors.md
├── docs/validation/05-pass-fail-vectors.md
├── docs/validation/06-experimentation-privacy-operations.md
├── docs/research/experiments/docs/research/experiments/docs/research/experiments/07-v0.1-request-mirror-lab.md
├── docs/planning/08-implementation-plan.md
├── docs/intake/RESEARCH-NOTES-2026-07-17.md
├── site-manifest.yaml
├── packages/
│   ├── hrr-reference/
│   │   ├── src/index.ts
│   │   ├── src/prng.ts
│   │   ├── src/hrr.ts
│   │   ├── src/scoring.ts
│   │   └── test/
│   ├── hrr-zig/
│   │   ├── build.zig
│   │   ├── build.zig.zon
│   │   ├── src/hrr.zig
│   │   ├── src/exports.zig
│   │   └── test/
│   ├── content-schema/
│   │   ├── src/schema.ts
│   │   ├── src/manifest.ts
│   │   └── test/
│   └── compiler/
│       ├── src/build-vectors.ts
│       ├── src/build-graph.ts
│       ├── src/build-content.ts
│       ├── src/validate.ts
│       └── generated/
├── apps/
│   ├── request-mirror-worker/
│   │   ├── src/index.ts
│   │   ├── src/request-facts.ts
│   │   ├── src/features.ts
│   │   ├── src/matcher.ts
│   │   ├── src/render.ts
│   │   ├── src/security.ts
│   │   ├── src/timing.ts
│   │   ├── public/reveal-browser-signals.js
│   │   ├── wrangler.jsonc
│   │   └── test/
│   └── web-next/
│       ├── app/
│       ├── components/
│       ├── content/
│       ├── next.config.ts
│       └── open-next.config.ts
├── fixtures/
│   ├── generic-baseline.json
│   ├── homeowner-family-dog-residential.json
│   ├── ny-commercial-fleet.json
│   ├── contractor-estimate-evening.json
│   └── technical-security-first.json
├── content/
│   ├── slices/
│   ├── entities/
│   ├── proof/
│   └── graph/
├── validation/
│   ├── golden/
│   ├── relevance/
│   ├── privacy/
│   ├── seo-parity/
│   ├── load/
│   └── reports/
└── scripts/
    ├── build-artifacts.ts
    ├── compare-engines.ts
    ├── deploy-preview.sh
    ├── smoke-preview.sh
    └── append-research-note.ts
```

The first implementation does not need every directory populated. Create them only when used, but preserve separation of concerns.

## Priority 0 — repository and runtime bootstrap

1. Confirm package manager and monorepo convention.
2. Pin Node, Next.js, Zig, Wrangler, and TypeScript versions.
3. Create Worker app with `compatibility_date` and preview URL explicitly enabled.
4. Add `X-Robots-Tag: noindex, nofollow` and `Cache-Control: private, no-store` to every lab response.
5. Add a plain generic baseline page before matcher work.
6. Add CI commands for format, typecheck, unit, build, and Worker dry-run.

Done when:

- generic page renders locally and in a Cloudflare preview;
- response headers and real `request.cf` handling are verified;
- no HRR dependency is needed for page availability.

## Priority 1 — TypeScript reference core

Implement first because it is easier to inspect and becomes the oracle for Zig.

Required:

- deterministic seeded vector generator;
- normalize, weighted add, dot/cosine;
- circular bind/unbind reference;
- pre-bound feature lookup;
- flat top-k search;
- graph/prior score;
- policy and confidence gate;
- human-readable explanation;
- golden fixtures.

Done when:

- all algebra and fixture vectors pass;
- every candidate selection is deterministic;
- malformed values return explicit errors/fallback.

## Priority 2 — Zig/WASM core

Implement the minimal ABI from `docs/research/02-shape-model-and-hrr-core.md`.

Rules:

- no filesystem, network, threads, or WASI requirement;
- caller owns input/output memory;
- bounds checked;
- scalar first, SIMD only after scalar correctness;
- compile artifacts reproducibly;
- compare every function with TypeScript fixtures;
- include binary size and cold/warm benchmark.

Done when:

- PF-HRR P0 gates pass;
- Worker imports precompiled WASM successfully;
- WASM failure cleanly falls back.

Do not force WASM into production if PF-PERF-05 fails.

## Priority 3 — typed content and precomputation

Implement schemas independent of Contentlayer:

- context feature definitions;
- content facets;
- candidate slices;
- evidence levels;
- graph nodes/edges;
- fixture definitions;
- finite variant manifests.

Then validate Contentlayer against Next.js 16. If it fails compatibility/maintenance/build gates, switch to Velite or owned Zod/MDX compilation without changing schemas.

Compiler outputs:

- pre-bound feature vectors;
- candidate vectors;
- candidate and feature indexes;
- graph priors;
- eligibility data;
- checksums/version manifest.

Done when:

- one command creates deterministic artifacts;
- changed content changes expected checksums;
- invalid evidence/feature/content fails build.

## Priority 4 — Request Mirror Worker

Implement server sections:

- request identity;
- allowlisted headers;
- Cloudflare metadata;
- feature/inference ledger;
- match diagnostics;
- timing/cache report;
- selected and baseline slices.

Security:

- HTML escape every reflected value;
- redact query values by default;
- never print cookies/auth/security headers;
- cap field lengths and total response diagnostics;
- precise location hidden unless explicitly requested;
- no logs containing raw request fields.

Done when:

- all v0.1 server sections render from real preview requests;
- multiple networks/devices show expected metadata variation;
- unknown/null fields render safely.

## Priority 5 — opt-in browser reveal

Use one small progressive-enhancement script.

Flow:

1. user clicks reveal;
2. client displays the exact requested fields before submission if practical;
3. script POSTs a schema-validated bounded payload;
4. server recomputes shape and returns/updates diagnostics;
5. user can remove optional signals and clear state.

High-entropy hints are a separate action.

Done when:

- no browser signal is collected before action;
- Firefox/Safari fallback works;
- consent withdrawal clears temporary state;
- JS-disabled baseline remains complete.

## Priority 6 — explicit fixtures and synthetic trait testing

Implement signed/allowlisted fixtures from `site-manifest.yaml`.

Fixtures must clearly distinguish:

- direct request fact;
- explicit test input;
- safe inference;
- simulated trait.

Do not accept arbitrary trait names or free-form values from query parameters.

Done when:

- all five initial fixtures produce expected rankings;
- fixture tampering falls back/rejects;
- fixture URLs remain `noindex`.

## Priority 7 — matching benchmark

Compare:

- generic baseline;
- deterministic rules;
- bag-of-facets cosine;
- dense embedding baseline if available;
- HRR only;
- HRR + graph;
- HRR + graph + priors;
- JS versus WASM;
- dimensions 512/1024/2048/4096.

Do not optimize weights on the test set.

Done when:

- reports include relevance, latency, memory, binary/artifact size, and robustness;
- selected configuration passes PF-HRR/PF-REL/PF-PERF or remains research-only.

## Priority 8 — Cloudflare deployment validation

Preview checks:

```bash
wrangler versions upload --preview-alias v0-1
curl -I https://<preview-url>/
curl -sS https://<preview-url>/?fixture=contractor-estimate-evening
```

Verify:

- preview enabled intentionally;
- headers;
- `request.cf` fields;
- server timings;
- real public accessibility;
- cross-browser behavior;
- no accidental indexing;
- no secret/request-data logging.

Then attach custom lab subdomain for load tests/logs.

## Priority 9 — Next.js 16 integration

Only after Worker-native lab passes:

- create Next.js 16 App Router app;
- enable `cacheComponents: true`;
- canonical static shell outside dynamic boundaries;
- selected finite slice behind Suspense with no contradictory fallback;
- Worker sends signed variant header;
- Next validates variant against local manifest;
- test OpenNext/Cloudflare build;
- preserve noindex for lab.

Do not put Cache Components in `runtime = 'edge'`; current Next.js 16 docs require Node runtime for Cache Components.

## Priority 10 — SEO explainer

Build a separate stable canonical page only after the lab works:

- complete server-rendered explanation;
- no request-specific personal data;
- visible research status and limitations;
- links to safe lab;
- normal canonical/meta/schema;
- submit through Search Console URL Inspection.

Google indexing is not a v0.1 resolver acceptance criterion.

## Required artifacts per session

- commit SHA;
- deployed preview/custom URL;
- Wrangler/Next/Zig versions;
- artifact checksums;
- golden/relevance/load report paths;
- response header capture;
- representative HTML/screenshot captures;
- JS/WASM comparison;
- privacy/SEO/security vector results;
- appended research notes;
- explicit validation not run.

## Stop conditions

Stop materialization and serve baseline if:

- any P0 privacy/security/truth/SEO gate fails;
- resolver p95 exceeds budget with no obvious bounded repair;
- HRR does not beat simpler retrieval baselines;
- WASM adds complexity without measured benefit;
- request-derived traits are inaccurate or misleading;
- deployment cannot guarantee noindex/private handling for the lab;
- the system begins acting like hidden identity profiling rather than transparent context matching.