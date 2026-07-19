# Low-Level Runtime and Serialization Boundary

Status: active target architecture  
Date: 2026-07-18

## Purpose

Define how Hyper Site and Hyper Content may use Zig, WebAssembly and binary serialization without creating a second semantic authority or delaying the useful-framework critical path.

## Boundary model

```text
Hyper Content
  validates evidence/content and emits typed SiteSource
          |
          | canonical JSON-compatible object
          v
Hyper Site
  validates -> PageIR -> static artifacts
          |
          +--> canonical textual artifact for inspection and hashing
          |
          +--> optional deterministic CBOR cache artifact
          |
          +--> optional pure kernel adapter
                    |
                    +--> TypeScript baseline
                    +--> Zig native challenger
                    +--> Zig/Wasm challenger
```

Hard direction:

```text
semantic contracts -> low-level kernels
low-level kernels -X-> semantic policy
low-level kernels -X-> publication authority
low-level kernels -X-> durable orchestration state
```

## Sources of truth

### Semantic source of truth

The in-memory typed `SiteSource`, `PageIR` and artifact contracts owned by Hyper Site remain authoritative.

### Reviewable serialized source

A deterministic JSON representation is the default review, fixture, diff and interoperability format.

### Derived binary artifact

Deterministic CBOR may be emitted for cache, IPC or storage experiments. It must contain:

```text
schema_version
semantic_hash
encoder_profile
encoder_version
payload
```

A decoder must:

1. reject unknown mandatory schema versions;
2. enforce resource limits before allocation;
3. decode into the public typed contract;
4. rerun semantic validation;
5. recompute the semantic hash;
6. reject mismatches;
7. never authorize an effect.

## Canonicalization and hashing

Hashing rules:

```text
validated semantic object
-> canonical JSON bytes under one specified profile
-> SHA-256 content digest
```

The digest is the semantic identity control until a cross-language deterministic-CBOR profile passes all parity fixtures.

Do not hash:

- native struct memory;
- language-specific map iteration order;
- ordinary MessagePack maps without a repository canonical profile;
- base64 transport wrappers;
- compressed bytes whose compressor metadata is unstable.

## Kernel interface

A promoted kernel must expose a small typed interface with no ambient authority.

Example conceptual contract:

```text
input:
  schema_version
  operation
  bounded bytes or typed arrays
  limits

output:
  status
  result bytes or typed arrays
  diagnostics
  implementation_version
```

The host owns:

- file and network access;
- clocks and randomness;
- credentials;
- policy;
- cancellation;
- retries;
- tracing;
- artifact writes;
- publication.

The kernel receives only explicitly passed capabilities.

## Native versus Wasm

### Zig native

Use only when a machine-local kernel needs maximum throughput and cross-platform native packaging is justified.

### Zig/Wasm

Use when portability, sandboxing or browser/server reuse is part of the requirement. Prefer WIT/Component Model interfaces when toolchain maturity and target runtimes support the required profile.

### TypeScript

Remain the baseline and semantic oracle. Every native or Wasm implementation must have a TypeScript reference implementation or fixture oracle.

## Allowed kernels

- canonical encoding preparation;
- deterministic CBOR encode/decode;
- bounded hashing preparation;
- large set intersections and dependency diffing;
- sparse numeric operations;
- vector packing and similarity after separate product validation;
- sandboxed pure transforms.

## Forbidden kernels

- compiler policy and validation authority;
- evidence approval;
- page-existence decisions;
- HTML semantic correctness authority;
- agent planning;
- checkpoint mutation;
- approval decisions;
- authorization;
- connector execution;
- publication;
- receipt acceptance.

## Static framework rule

The production artifact path stays:

```text
source
-> build-time validation
-> build-time compilation
-> immutable static artifacts
-> deployment
```

A low-level runtime may accelerate build-time work. It does not convert Hyper Site into a runtime SSR framework.

## Failure containment

Every kernel call must define:

```text
maximum input bytes
maximum output bytes
maximum records
maximum nesting depth
maximum linear memory
wall-clock timeout
cancellation behavior
fallback behavior
```

Malformed or oversized binary input must fail closed before unbounded allocation.

## Agent-control-plane relation

The future orchestrator may select an implementation based on measured capability, but it must invoke the same public operation contract.

```text
orchestrator task
-> operation adapter
-> TypeScript or promoted kernel
-> evidence-bearing result
-> independent validator
```

Worker state and circuit-breaker state remain typed durable runtime records, not opaque numeric vectors inside the compiler.

## Promotion sequence

```text
P0 profile TypeScript end to end
-> P1 freeze operation contract and fixtures
-> P2 implement challenger
-> P3 prove semantic and byte parity
-> P4 measure boundary-inclusive performance
-> P5 test failure and resource limits
-> P6 test packaging on supported platforms
-> P7 retain TypeScript fallback
-> P8 approve or reject promotion
```

No challenger becomes mandatory for `create`, `dev`, `build`, `preview`, `inspect` or `publish` until the ordinary framework floor passes.
