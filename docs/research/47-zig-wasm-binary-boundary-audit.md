# Zig, WebAssembly and Binary Boundary Audit

Status: active research disposition  
Date: 2026-07-18  
Scope: Hyper Site, Hyper Content, and the future external agent control plane

## Executive verdict

Zig, WebAssembly, CBOR and MessagePack are not a new product architecture. They are possible implementation techniques for narrowly measured boundaries.

The current critical path remains:

```text
R1 physical package extraction
-> R2 ordinary framework floor
-> R3 five-page usefulness comparison
-> R4 maintenance correctness and value
```

No low-level runtime work may delay R1-R4.

The accepted disposition is:

```text
canonical authoring and public interchange: typed SiteSource + deterministic JSON
optional derived cache or IPC artifact: deterministic CBOR
LLM prompt representation: compact text or provider-native structured output
pure measured kernels: TypeScript baseline first, optional Zig/Wasm challenger
orchestration, policy and effects: external runtime, never Wasm compiler core
```

## Claims reviewed

The supplied ORCHESTRATOR v6 guide proposes state vectors, worker pools, schema validation, checkpoints, circuit breakers and exact-SHA evidence binding. These are useful design prompts, but the guide is not an implemented durable runtime and its cost figures are not repository evidence.

The supplied binary-format proposal claims MessagePack or CBOR can save up to 50% in LLM token costs and that Zig runtime rendering can produce perfect SEO and Lighthouse scores. Those claims are not accepted.

## Binary serialization findings

### Supported

CBOR is an IETF standard designed for compact code, relatively small messages and extensibility. RFC 8949 also defines deterministic encoding requirements suitable for content-addressing when a protocol adopts them.

MessagePack is a compact JSON-like binary format and may reduce wire or storage bytes.

Binary encodings can be useful for:

- cache artifacts;
- local IPC;
- large repeated numeric arrays;
- content-addressed immutable snapshots;
- crossing a stable native/Wasm boundary;
- reducing parse allocation in a proven hotspot.

### Rejected or unproven

Binary bytes are not automatically cheaper LLM input. Most model interfaces accept text or provider-defined structured objects. Raw binary commonly needs base64, hexadecimal or pre-decoding, adding representation overhead and reducing human inspectability. Token cost depends on the model tokenizer and the exact transport representation, not byte count alone.

MessagePack map ordering is not a sufficiently portable integrity contract by itself. Cross-language deterministic hashing would require a separately specified canonical profile and conformance tests.

CBOR supports trees and arrays/maps; it does not natively preserve arbitrary graph semantics. Hyper graph identity and references remain application-level contracts.

Binary serialization does not improve factual quality, SEO, accessibility, rendering correctness, or business usefulness.

### Canonical format decision

The public and reviewable source of truth remains a typed `SiteSource` represented as JSON-compatible data.

For deterministic hashing, use one explicit canonicalization contract. The initial control is RFC 8785 JSON Canonicalization Scheme semantics or an equivalently specified repository implementation with cross-language fixtures.

A deterministic CBOR representation may be emitted only as a derived artifact after the JSON-compatible object passes validation. It must round-trip to the same semantic object and must not become a second authoring authority.

## Zig findings

Zig is credible for small native or Wasm components because it has explicit allocator control, compile-time execution, no mandatory runtime and straightforward cross-compilation.

Those properties do not make Zig automatically faster or safer for this repository. Manual memory management creates new correctness obligations. A Zig implementation also adds:

- another compiler and toolchain;
- ABI and ownership contracts;
- generated bindings;
- cross-platform packaging;
- debugging complexity;
- parity tests;
- release and supply-chain work;
- fallback requirements.

Zig is therefore a challenger implementation, never the semantic oracle.

## WebAssembly findings

WebAssembly is a portable, sandboxed compilation target with strong validation and relatively deterministic execution. The Component Model and Canonical ABI can carry typed interfaces across language boundaries.

Wasm is useful when the repository needs one or more of:

- portable sandboxing for untrusted pure transforms;
- the same pure kernel in browser, Node and server runtimes;
- isolation with a narrow capability surface;
- a proven CPU-heavy kernel that outperforms JavaScript after boundary costs;
- language-neutral components composed through WIT.

Wasm is not an authorization boundary by itself. Host imports define capability. Resource exhaustion remains possible. Publication, credentials, policy and durable effects stay outside the module.

## Candidate low-level kernels

Candidates must be pure or observational and accept bounded typed input.

Initial candidates, in priority order only after profiling:

1. canonical serialization and digest preparation for very large manifests;
2. dependency-set comparison and artifact-diff classification;
3. large sparse lexical scoring or candidate filtering;
4. vector packing and batch similarity only if the simple baseline is useful;
5. sandboxed third-party content transforms;
6. compressed immutable cache artifact encoding/decoding.

Explicitly forbidden low-level ownership:

- `SiteSource` or `PageIR` semantics;
- source/evidence approval;
- HTML or JSON-LD correctness authority;
- route and indexability policy;
- agent planning;
- checkpoint truth;
- approval decisions;
- credential access;
- publishing or other effects;
- telemetry authority.

## Rendering and SEO correction

Rendering a page dynamically through Zig does not make it static. Server-side rendering can emit indexable HTML, but runtime rendering introduces availability, caching and operational dependencies.

The framework remains static-first:

```text
validated source
-> deterministic build
-> complete HTML/CSS/assets
-> deploy immutable artifacts
```

SEO and Lighthouse outcomes require separate validation of HTML semantics, metadata, structured data, accessibility, assets, caching, JavaScript weight and field performance. No language can guarantee a score of 100.

## ORCHESTRATOR v6 disposition

Keep these concepts:

- explicit run and worker state;
- bounded task allocation;
- schema validation at every tool boundary;
- exact commit and artifact binding;
- checkpoints;
- circuit breaking;
- queue backpressure;
- explicit completion gates;
- human escalation.

Correct these concepts:

- replace positional state vectors with typed named records at durable boundaries;
- treat local JSON checkpoint files as development fixtures, not durable concurrency-safe state;
- replace regex-only anti-pattern detection with AST, type, policy and behavioral tests;
- calculate error rates over explicit windows with minimum sample sizes;
- do not route a failing task to a weaker model merely because the worker tier is cheaper;
- freeze provider pricing and model identity in measured run evidence instead of architecture prose;
- use idempotency and leases for merges and effects;
- retain immutable input, output, tool and approval evidence;
- distinguish schema validity from semantic correctness.

The guide's worker names, context sizes, token prices and ROI numbers are hypotheses until reproduced from current provider terms and actual runs.

## Research sources

Primary and standards sources:

- RFC 8949, Concise Binary Object Representation: https://www.rfc-editor.org/rfc/rfc8949.html
- RFC 8785, JSON Canonicalization Scheme: https://www.rfc-editor.org/rfc/rfc8785.html
- MessagePack specification site: https://msgpack.org/
- WebAssembly specifications: https://webassembly.org/specs/
- WebAssembly security model: https://webassembly.org/docs/security/
- WebAssembly Component Model Canonical ABI: https://component-model.bytecodealliance.org/advanced/canonical-abi.html
- Zig overview and memory model: https://ziglang.org/learn/overview/

Relevant systems research:

- Faasm, USENIX ATC 2020: https://www.usenix.org/conference/atc20/presentation/shillaker
- Wasabi, USENIX NSDI 2026: https://www.usenix.org/conference/nsdi26/presentation/baqershahi
- WebAssembly resource-isolation attack surface, USENIX Security 2025: https://www.usenix.org/conference/usenixsecurity25/presentation/yu-zhaofeng

## Final disposition

```text
Zig/Wasm: permitted research challenger for measured pure kernels
CBOR: permitted deterministic derived artifact after validation
MessagePack: permitted benchmark control, not integrity authority
binary LLM prompts: rejected by default
runtime Zig SSR: rejected from current critical path
TypeScript: semantic oracle until a promoted kernel proves exact parity
```
