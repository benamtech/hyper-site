# Useful Framework and Agent-First Depth Audit Handoff

Timestamp: 2026-07-18T21:15:00-04:00  
Branch: `agent/glm-blackwell-vertical-slice`  
PR: #3, draft and unmerged

## Completed

- audited current repository claims against an ordinary static framework floor;
- audited agent claims against durable orchestration, checkpoint, approval, idempotency and observability requirements;
- separated Hyper Site, Hyper Content and the external agent control plane;
- established Astro as the first ordinary-framework control;
- established Temporal/LangGraph categories as orchestration controls and OpenTelemetry as the telemetry control;
- corrected the dependency-index claim to require over- and under-invalidation testing;
- deferred task surfaces and advanced research until the five-page maintenance proof passes;
- updated root identity, operating contract, code graph, README, documentation index and durable memory.

## New authority chain

```text
docs/research/43-useful-framework-and-agent-first-pipeline-audit.md
-> docs/architecture/44-useful-framework-and-agent-first-target-architecture.md
-> docs/planning/45-depth-first-framework-and-agent-recovery-plan.md
-> docs/validation/46-useful-framework-and-agent-first-gates.md
```

## Target architecture

```text
Hyper Content (optional producer) -> Hyper Site
external agent control plane -> public tools and artifacts
Hyper Site -X-> Hyper Content
package cores -X-> runtime internals
```

## Current expected gate state

```text
F1 package ownership: RED
F2 ordinary framework workflow: BLOCKED
F3 five-page usefulness: BLOCKED
F4 incremental correctness: BLOCKED
F5 maintenance value: BLOCKED
A1-A6 durable agent gates: NOT IMPLEMENTED
P1 product coherence: RED
```

## Immediate next work

Execute R1 only:

```text
complete reference/src inventory
-> extract compiler source to hyper-site/src
-> switch public entrypoint
-> convert reference to package consumer
-> preserve positive and negative parity
-> prove two isolated packed consumers
```

## Nonclaims

This documentation pass does not complete package extraction, framework workflow, five-page validation, agent runtime, effect safety or production readiness.
