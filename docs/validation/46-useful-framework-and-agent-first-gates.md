# Useful Framework and Agent-First Validation Gates

Status: active validation contract  
Updated: 2026-07-18

## Principle

Each layer must pass independently. A powerful content pipeline cannot compensate for a poor framework, and a working compiler cannot compensate for an unreliable agent runtime.

## Gate F1 — Package ownership

Pass only when:

- canonical Hyper Site source resides under `hyper-site/src`;
- canonical stable Hyper Content source resides under `hyper-content/src`;
- package runtime imports do not enter `reference/`;
- two isolated packed consumers pass;
- legacy positive and negative artifacts remain equivalent.

Failure examples:

- copied `dist` presented as source ownership;
- workspace-only relative imports;
- facade delegates to `reference/dist`;
- hidden second compiler or renderer.

## Gate F2 — Ordinary framework workflow

Pass only when a clean consumer can perform:

```text
create -> dev -> build -> preview -> inspect -> local publish
```

without installing Hyper Content, an LLM SDK, agent runtime or GPU dependency.

Evidence:

- exact commands;
- clean environment identity;
- emitted five-page artifact tree;
- browser and accessibility report;
- operator time and errors encountered.

## Gate F3 — Five-page usefulness

Pass only when:

- five pages have distinct accepted purposes;
- content and design are not generated placeholder variants;
- an ordinary-framework direct control uses the same facts, design and output requirements;
- held-out reviewers accept the site as usable;
- no superiority claim exceeds measured evidence.

## Gate F4 — Incremental correctness

For each frozen maintenance change define the expected affected set before execution.

Pass only when:

```text
required_but_missed = 0
unexpected_changed = 0 or explicitly justified
invalid_change_accepted = false
partial_accepted_output_after_failure = false
```

The emitted dependency index alone cannot satisfy this gate.

## Gate F5 — Measured maintenance value

Pass only when Hyper Site demonstrates at least one of:

- materially lower operator time or review burden;
- lower defect rate;
- a required invariant absent from the direct control;
- simpler rollback or retirement;
- more precise affected-set behavior.

Otherwise record `narrow` or `stop`.

## Gate A1 — Durable run state

Pass only when an external orchestrator can:

- persist a run snapshot;
- resume after process failure;
- expose current and historical step state;
- cancel without corrupting accepted artifacts;
- correlate run, step, tool and artifact IDs.

A JSON checkpoint written by an ad hoc loop is insufficient unless crash/restart semantics are tested.

## Gate A2 — Deterministic and model-backed tool separation

Pass only when:

- compiler and validation calls are deterministic tools;
- model calls are explicitly non-deterministic activities with retained request/response evidence;
- retries do not silently replace previously approved model output;
- replay does not repeat side effects.

## Gate A3 — Human approval interruption

Pass only when:

- approval pauses durable execution;
- the pending state survives restart;
- the operator can inspect the exact artifact and policy being approved;
- rejection, edit and cancellation paths exist;
- approval cannot be reused for a changed artifact or target.

## Gate A4 — Idempotent effect boundary

Pass only when duplicate or retried publication attempts produce at most one durable effect.

Required tests:

- duplicate idempotency key;
- timeout after possible remote success;
- retry after worker crash;
- stale approval epoch;
- changed branch head;
- changed artifact hash;
- changed publisher target.

## Gate A5 — Observability

Pass only when one trace or correlated record connects:

```text
run
-> planning/model step
-> tool invocation
-> compiler commit and input hash
-> artifact manifest
-> approval
-> publisher effect
-> receipt or failure
```

Metrics and logs must retain enough context to distinguish retries, replays, duplicate requests and operator interventions.

## Gate A6 — Security boundary

Pass only when:

- untrusted content cannot directly widen tools or effects;
- secrets and private memory remain outside public artifacts;
- authorization is checked at commit time;
- policy and approval freshness are revalidated;
- browser task surfaces cannot mutate durable state directly;
- failure is closed for mismatched authority.

## Gate P1 — Product coherence

Pass only when:

- Hyper Site is usable without Hyper Content;
- Hyper Content has a portable output contract;
- the agent control plane uses public interfaces;
- each layer has a distinct user, responsibility and failure model;
- removal of experimental methods does not break the ordinary framework path.

## Current expected state

```text
F1 RED
F2 BLOCKED BY F1
F3 BLOCKED BY F2
F4 BLOCKED BY F3
F5 BLOCKED BY F4
A1-A6 NOT IMPLEMENTED
P1 RED
```

A green existing compiler fixture does not change this state.
