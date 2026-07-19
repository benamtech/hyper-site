# 50 — H0/H1 Content-First Reinvention Program

Status: active implementation authority
Updated: 2026-07-19

## Product thesis

Hyper is not intended to stop at parity with a conventional static framework. The conventional workflow is a minimum falsification surface. The intended suite is a content-first, self-inspecting, autonomously operated system in which semantic state can drive static web, generative UI, browser tasks, agent surfaces and accelerated compilation without creating multiple truth authorities.

## H0 — integrated proof before additional architecture

H0 runs the complete current build, compatibility tests, clean-room package consumers, workstream validation and a bounded randomized compiler test. It writes a measured report tied to the exact commit.

Pass requires:

- all current package and compatibility builds pass;
- existing positive and negative compiler behavior passes;
- two `npm pack` consumers pass outside the monorepo;
- the randomized compiler fixture passes;
- no accepted test reaches `reference/` through the Hyper Site public entrypoint;
- failures produce the machine-readable decision `repair-gate-failures-only`, never additional feature work.

Canonical command:

```bash
npm run proof:h0-h1
```

Canonical outputs:

- `validation/reports/h0-h1-proof.json`
- `validation/reports/h0-h1-proof.md`
- `validation/reports/h0-h1-compiler-limit/`

## H1 — physical compiler extraction

Claim: the public content-neutral compiler cluster can be moved into `hyper-site/src` without unexplained artifact, ordering, hash or rejection drift.

Implemented extraction cluster:

- `framework-core.ts`;
- `site-manifest.ts`;
- `browser-targets.ts`;
- `css-modern.ts`.

Required direction:

```text
hyper-content -> hyper-site
reference -> hyper-site
hyper-site -X-> reference
hyper-site -X-> hyper-content
```

Falsification:

- any accepted output or rejection behavior changes without explicit approval;
- a packed consumer needs repository-relative files;
- the public entrypoint reaches `reference/`;
- TypeScript declarations or package exports do not resolve externally;
- compatibility tests pass only by importing the old implementation.

## End-state capability graph

```text
approved business/source truth
-> Hyper Content semantic compiler
-> evidence + claims + page existence + design intent
-> autonomous generation and repair harness
-> portable versioned semantic state
-> Hyper Site deterministic compiler
-> static HTML + GenUI projections + agent/browser task declarations
-> browser/runtime execution adapters
-> receipts, field outcomes and graph feedback
```

The static compiler remains a deterministic semantic oracle. It is not the product ceiling.

## Active hypothesis tracks after H1

### H2 — autonomous generation

A bounded provider-backed pipeline can generate or revise structured semantic state while an external compiler rejects unsupported, inconsistent or unsafe output.

First proof: one real five-page business site, then 25 noindex pages. Same-model self-acceptance is prohibited.

### H3 — self-aware generative UI

A versioned semantic state can describe information purpose, evidence, user task, layout constraints and component capabilities strongly enough for multiple UI projections without embedding business logic in generated UI.

First proof: deterministic static fallback plus one generated interactive projection with exact state and receipt parity.

### H4 — remote agent and browser task execution

A remote agent runtime can consume public task declarations, pause for approval, execute a bounded browser or API action, and return a typed receipt without gaining authority over source truth or publication policy.

First proof: one reversible or side-effect-free browser task.

### H5 — relationship and graph intelligence

SDRT, typed property graphs and GNNs may improve cross-page coherence, internal linking, task-state representation or repair prioritization.

Required control: explicit typed edges, entity co-occurrence, shared evidence, route hierarchy and lexical similarity. Promotion requires held-out improvement and explanation quality.

### H6 — accelerated substrate

GPU, Zig and Wasm may accelerate pure bounded kernels or provide portable sandboxed execution.

First candidates:

- corpus-wide semantic similarity and duplicate screening;
- graph expansion and ranking;
- vector packing and similarity;
- deterministic serialization or hashing;
- sandboxed pure UI transforms.

They may not own evidence approval, business truth, policy, credentials, publication or irreversible effects.

## Program order

```text
H0 integrated proof
-> H1 physical extraction
-> H2 real autonomous semantic generation
-> H3 multi-surface GenUI projection
-> H4 remote bounded task execution
-> H5 graph-learning comparison
-> H6 accelerated kernel comparison
```

H2-H6 may run research fixtures in parallel after H1, but none may create a second semantic authority or bypass compiler validation.

## Product end-state

`@amtech/hyper-site`:

- public typed semantic contract;
- deterministic compiler and renderer;
- static fallback;
- design and GenUI projection contracts;
- browser/task declaration ABI;
- artifact manifests, dependency explanations and receipts;
- local and remote adapters.

`@amtech/hyper-content`:

- source and repository ingestion;
- evidence/claim/page-existence modeling;
- autonomous generation and bounded repair;
- ontology and graph proposal workflows;
- corpus-wide uniqueness and consistency validation;
- provider and GPU execution adapters;
- deterministic `SiteSource` output.

External runtime:

- durable run state;
- approvals;
- provider credentials;
- browser/API effects;
- idempotency and receipts;
- telemetry and field feedback.

## Non-negotiable validation

Every hypothesis records:

- exact commit and environment;
- frozen input and control;
- positive and negative tests;
- independent validator;
- artifacts and hashes;
- cost and latency;
- failure and recovery behavior;
- promotion, repair or rejection decision.
