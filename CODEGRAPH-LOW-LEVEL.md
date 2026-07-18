# CODEGRAPH-LOW-LEVEL.md — Zig, Wasm and Serialization Boundaries

Status: active supplement to `CODEGRAPH.md`  
Date: 2026-07-18

## Current graph

```text
Hyper Content
  -> typed JSON-compatible SiteSource
  -> Hyper Site public compiler
  -> PageIR
  -> static artifacts

reference/
  -> still owns most current implementation

Zig/Wasm/CBOR/MessagePack
  -> no production authority
  -> no critical-path dependency
```

## Target serialization graph

```text
validated SiteSource object
        |
        +-> deterministic JSON
        |     review / fixtures / diffs / semantic hashing
        |
        +-> optional deterministic CBOR
              derived cache / IPC artifact only
              schema_version + semantic_hash + encoder_profile
```

Forbidden:

```text
CBOR -X-> second semantic authority
MessagePack -X-> unprofiled content-addressing
binary bytes -X-> assumed LLM token savings
native struct layout -X-> stable interchange
```

## Target kernel graph

```text
public pure operation contract
        |
        +-> TypeScript oracle
        |
        +-> optional Zig native challenger
        |
        +-> optional Zig/Wasm challenger
        |
        v
independent parity validator
        |
        v
artifact or diagnostic result
```

Candidate operations:

```text
canonical encoding preparation
deterministic CBOR encode/decode
large dependency-set diff
sparse lexical scoring
vector packing / batch similarity
sandboxed pure transforms
```

Forbidden operations:

```text
source or evidence approval
PageIR semantics
HTML correctness authority
route/indexability policy
agent planning
checkpoint truth
approval or authorization
credentials and connectors
publication or receipt acceptance
```

## Wasm capability graph

```text
host
  owns filesystem, network, clocks, randomness, credentials,
  policy, cancellation, tracing, artifact writes and effects
        |
        | explicit bounded imports only
        v
Wasm component
  pure/sandboxed computation
  bounded memory and time
  no ambient authority
```

## Boundary-cost graph

```text
host object
-> encode/copy/lower
-> instantiate/load
-> kernel
-> decode/copy/lift
-> host validation
-> artifact
```

Every benchmark includes the entire graph. Kernel-only timing is non-authoritative.

## Promotion graph

```text
R1-R4 remain independent
        |
        v
profile representative TypeScript workload
        |
        v
freeze interface + fixtures + target
        |
        v
implement optional challenger
        |
        v
semantic parity
        |
        v
deterministic-byte parity where required
        |
        v
boundary-inclusive p50/p95/cold measurements
        |
        v
resource, packaging and fallback tests
        |
        +-> promote
        +-> retain_optional
        +-> reject
```

## Agent orchestrator graph

```text
durable typed run record
-> bounded task
-> operation adapter
-> selected implementation
-> independent validation
-> immutable evidence
-> checkpoint
```

Corrected from ORCHESTRATOR v6:

```text
positional M/W vectors
  -> named versioned records

local checkpoint JSON
  -> development fixture only

regex anti-pattern rules
  -> supplemental signal beside AST/type/policy/behavior tests

single E scalar
  -> rolling-window typed metrics + sample count

provider/model cost prose
  -> measured run evidence bound to date and provider terms
```

## Static-output graph

```text
build-time validated source
-> build-time compilation
-> complete static HTML/CSS/assets
-> immutable deployment
```

Zig/Wasm may accelerate build-time pure work. It does not move rendering to request time and does not guarantee SEO or Lighthouse outcomes.

## Authority

- `docs/research/47-zig-wasm-binary-boundary-audit.md`
- `docs/architecture/48-low-level-runtime-and-serialization-boundary.md`
- `docs/validation/49-low-level-kernel-promotion-gates.md`
- `CODEGRAPH.md`
- `memory/MEMORY.md`
