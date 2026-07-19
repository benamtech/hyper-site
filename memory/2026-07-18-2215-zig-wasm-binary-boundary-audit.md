# Zig, Wasm and Binary Boundary Handoff

Timestamp: 2026-07-18T22:15:00-04:00  
Branch: `agent/glm-blackwell-vertical-slice`  
PR: #3 draft and unmerged

## Task

Evaluate whether Zig, WebAssembly, MessagePack, CBOR or another low-level runtime should form the groundwork between Hyper Content and Hyper Site, using the supplied ORCHESTRATOR v6 guide as abstract inspiration.

## Result

No low-level implementation was justified.

Accepted architecture:

```text
Hyper Content
-> validated typed SiteSource
-> deterministic JSON-compatible public interchange
-> Hyper Site
-> PageIR and static artifacts

optional derived path:
validated semantic object
-> deterministic CBOR cache/IPC artifact

optional performance path:
pure public operation
-> TypeScript oracle
-> Zig/native/Wasm challenger
-> independent parity validator
```

## Critical corrections

- Smaller binary byte size is not equivalent to lower LLM token count.
- Raw binary commonly requires base64, hexadecimal or pre-decoding for model APIs.
- MessagePack map ordering is not a cross-language integrity contract without an explicit profile.
- CBOR is suitable only as a deterministic derived artifact after semantic validation.
- Zig compile-time reflection and explicit allocation do not automatically produce zero-copy operation across host/Wasm boundaries.
- Wasm sandboxing limits direct memory authority but does not eliminate resource exhaustion or unsafe host imports.
- Runtime SSR does not become static generation and cannot guarantee SEO or Lighthouse scores.
- A microbenchmark cannot justify a mandatory package dependency.

## ORCHESTRATOR v6 disposition

Retained concepts:

- bounded allocation;
- explicit run and worker state;
- schema validation;
- checkpointing;
- exact commit/artifact evidence;
- circuit breaking and backpressure;
- completion gates;
- human escalation.

Required corrections:

- positional vectors become named versioned durable records;
- local checkpoint JSON remains a development fixture only;
- regex detection supplements AST, type, policy and behavioral validation;
- error rates use explicit rolling windows and sample counts;
- model/provider pricing is measured run evidence, not architecture truth;
- merge and effect operations require leases and idempotency;
- schema validity is not semantic correctness.

## Promotion controls

A low-level challenger must pass:

```text
critical-path independence
-> representative profile evidence
-> frozen operation contract
-> semantic parity
-> deterministic bytes where required
-> boundary-inclusive p50/p95/cold measurements
-> resource-safety tests
-> packaging/fallback tests
-> static-framework preservation
-> explicit promote/retain_optional/reject decision
```

Default quantitative threshold:

- at least 1.25x end-to-end operation speedup; or
- at least 30% peak-memory reduction without material latency regression; or
- a required portable sandbox capability unavailable in the TypeScript path.

## Files created

- `docs/research/47-zig-wasm-binary-boundary-audit.md`
- `docs/architecture/48-low-level-runtime-and-serialization-boundary.md`
- `docs/validation/49-low-level-kernel-promotion-gates.md`
- `docs/architecture/CODEGRAPH-LOW-LEVEL.md`
- this handoff

## Files reconciled

- `README.md`
- `docs/README.md`
- `memory/MEMORY.md`

## Current decision state

```text
Zig kernel: NOT JUSTIFIED
Wasm kernel: NOT JUSTIFIED
CBOR cache/IPC: RESEARCH CANDIDATE
MessagePack cache/IPC: BENCHMARK CONTROL
binary LLM prompting: REJECTED BY DEFAULT
runtime Zig SSR: OUT OF SCOPE
R1 physical extraction: still the only valid implementation priority
```

## Nonclaims

No performance advantage, token reduction, framework improvement, SEO improvement, Lighthouse result, Wasm security guarantee or production orchestrator has been demonstrated.
