# Low-Level Kernel Promotion Gates

Status: active validation contract  
Date: 2026-07-18

## Rule

Zig, native code, WebAssembly, CBOR or MessagePack may not be promoted because they are theoretically compact or fast. Promotion requires a frozen operation contract, exact semantic parity and an end-to-end measured advantage after all conversion and packaging costs.

## Gate L0 — critical-path independence

Pass only when:

- R1 package extraction is not delayed;
- the ordinary TypeScript path remains complete;
- the experiment is optional;
- no public contract requires the challenger;
- failure falls back safely or stops without corrupting artifacts.

## Gate L1 — workload evidence

Required evidence:

- profiler output from a representative build;
- exact commit and fixture;
- operation consumes at least 10% of relevant build CPU time, memory, serialized bytes or latency; or a documented sandboxing/portability requirement exists;
- optimization target is stated before implementation.

A synthetic microbenchmark alone fails L1.

## Gate L2 — frozen interface

Freeze:

- input and output schema versions;
- maximum sizes and nesting;
- error taxonomy;
- determinism requirements;
- fallback behavior;
- host capabilities;
- semantic oracle.

## Gate L3 — semantic parity

The challenger must match the TypeScript oracle across:

- standard fixtures;
- randomized fixtures;
- boundary values;
- malformed values;
- duplicate keys and references;
- Unicode and escaping;
- numeric limits;
- order variation;
- adversarial nesting;
- empty and maximum-size inputs.

For serialization, verify semantic round-trip rather than merely successful decode.

## Gate L4 — deterministic bytes

When the output is used for hashing, caching or signatures:

- identical semantic input produces identical bytes across repeated runs;
- identical semantic input produces identical bytes on every supported platform and implementation;
- map ordering is specified;
- number encoding is specified;
- Unicode handling is specified;
- version/profile identifiers are included;
- noncanonical encodings are rejected where required.

Ordinary MessagePack fails this gate unless a repository canonical profile is defined and tested.

## Gate L5 — boundary-inclusive performance

Measure:

```text
TypeScript baseline total
versus
encode/copy/lower
+ instantiate or load
+ kernel execution
+ decode/copy/lift
+ validation
+ fallback and diagnostics overhead
```

Required promotion threshold:

- at least 1.25x end-to-end speedup on the target operation and representative build; or
- at least 30% peak-memory reduction with no material latency regression; or
- a required portable sandbox capability unavailable in the TypeScript path.

Report p50, p95 and cold-start results. Do not promote from best-case averages.

## Gate L6 — resource safety

Test:

- maximum linear memory;
- allocation failure;
- decompression or nesting bombs;
- malformed lengths;
- integer overflow;
- timeouts;
- cancellation;
- repeated invocation;
- concurrent invocation;
- hostile module behavior when Wasm is used;
- host import denial.

Wasm sandboxing does not waive host-level quotas.

## Gate L7 — packaging and developer experience

Prove on every supported environment:

- clean install;
- deterministic build or verified prebuilt artifact;
- architecture selection;
- checksum verification;
- useful error messages;
- source maps or equivalent diagnostics;
- no undeclared system dependency;
- fallback operation;
- license and supply-chain inventory.

At minimum test Linux x86_64 and the environments used by CI and external consumers.

## Gate L8 — static-framework preservation

A promoted kernel must not:

- require runtime SSR;
- require a server for static output;
- add a model or GPU dependency;
- hide build artifacts from inspection;
- weaken HTML, metadata, accessibility or schema validation;
- become publication authority.

## Gate L9 — binary-format decision

### Canonical JSON control

Measure minified and deterministic JSON for:

- bytes;
- encode/decode time;
- allocations;
- diffability;
- token count under each actual model tokenizer used;
- error quality.

### CBOR challenger

Measure deterministic CBOR for:

- raw bytes;
- encode/decode time;
- cross-language deterministic parity;
- base64/transport expansion where applicable;
- model token count after the actual transport representation;
- malformed-input handling.

### MessagePack challenger

May be benchmarked for cache or IPC throughput. It cannot become content-addressing authority without an explicit deterministic profile.

Binary prompt promotion requires a provider interface that accepts the bytes natively and a measured reduction in total tokens/cost without loss of schema reliability. Otherwise it fails.

## Gate L10 — orchestrator integration

When selected by an agent control plane, record:

```text
run_id
step_id
operation
implementation
implementation_version
input_hash
output_hash
limits
started_at
completed_at
result
fallback_used
trace_id
```

Circuit breakers use typed rolling-window metrics with sample counts. They cannot be derived from one opaque `E` scalar.

## Decision

Each experiment ends with exactly one result:

```text
promote
retain_optional
reject
```

A rejected experiment leaves no mandatory dependency in Hyper Site or Hyper Content.

## Current state

```text
Zig kernel: NOT JUSTIFIED
Wasm kernel: NOT JUSTIFIED
CBOR cache artifact: RESEARCH CANDIDATE
MessagePack cache artifact: BENCHMARK CONTROL
binary LLM prompt: REJECTED BY DEFAULT
runtime Zig SSR: OUT OF SCOPE
```
