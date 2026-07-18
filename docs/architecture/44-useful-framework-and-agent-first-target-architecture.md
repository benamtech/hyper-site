# Useful Framework and Agent-First Target Architecture

Status: accepted target architecture  
Updated: 2026-07-18

## Decision

The repository is a three-layer system with one optional producer, not one unified autonomous framework.

```text
Layer A: Hyper Site
  deterministic static framework and publisher contracts

Layer B: Hyper Content
  optional evidence/content producer that emits portable SiteSource

Layer C: external agent control plane
  durable orchestration, approvals, tools, policy, effects and telemetry
```

Dependency direction:

```text
hyper-content -> hyper-site
agent-control-plane -> hyper-content and hyper-site public tools
hyper-site -X-> hyper-content
package cores -X-> orchestration runtime internals
browser surface -X-> durable effects
```

## Layer A: Hyper Site

Required stable surface:

```text
create project
load validated site content
compile SiteSource to PageIR
render HTML/CSS/assets
build sitemap and metadata
emit artifact manifest and dependency declarations
preview static output
inspect diagnostics
publish through one adapter
```

Hyper Site owns:

- `SiteSource`, `PageIR` and artifact contracts;
- deterministic validation, compilation and rendering;
- routing, metadata, structured data and sitemap behavior;
- components, layouts, themes, assets and browser policy;
- framework CLI and diagnostics;
- declared dependency metadata;
- static preview and publisher adapter interfaces.

Hyper Site does not own:

- evidence discovery or ranking;
- LLM providers or agent loops;
- private memory or credentials;
- durable workflow state;
- connectors, authorization or consequential effects;
- experiment inference or commercial decisions.

## Layer B: Hyper Content

Hyper Content is optional. A developer may hand-author `SiteSource` without installing or understanding Hyper Content.

Hyper Content owns:

- source and evidence intake;
- claim and page-existence records;
- content proposals and structured generation;
- validation against evidence and duplicate controls;
- deterministic adaptation into portable Hyper Site input;
- maintenance proposals, refresh and retirement recommendations.

Experimental ontology, retrieval, graph, vector, Wasm and GPU methods remain replaceable arms behind stable content contracts.

## Layer C: external agent control plane

The control plane coordinates work but is not canonical content or rendering authority.

```text
run request
-> freeze input snapshot and policy
-> plan bounded steps
-> invoke deterministic or model-backed tools
-> persist checkpoint and tool evidence
-> evaluate result
-> interrupt for approval where required
-> revalidate commit conditions
-> invoke idempotent effect
-> record receipt, telemetry and final snapshot
```

Required runtime properties:

- durable checkpoints;
- explicit run and step identifiers;
- deterministic replay or documented resumption;
- side-effect-free workflow/planning logic;
- idempotent effect activities;
- bounded retries, timeouts and dead-letter state;
- human approval interrupts;
- commit-time validation of approval, branch, artifact and policy freshness;
- trace correlation across model, tool, compiler and publisher operations;
- cancellation and rollback procedures.

Temporal, LangGraph or another established runtime may implement these properties. The repository should define adapters and contracts, not duplicate the runtime category inside the compiler.

## Commit boundary

Compilation is not publication authorization.

A publication request must carry:

```text
run_id
input_snapshot_hash
compiler_commit
artifact_manifest_hash
policy_version
approval_id and approval_epoch
publisher_target
idempotency_key
```

Immediately before the durable effect, the runtime must verify that these values remain current and bound to the same intended effect.

## Incremental maintenance boundary

Every emitted artifact declares its direct dependencies. Maintenance evaluation compares the declared affected set with the actual required set.

A pass requires both:

- no unexplained changed artifacts; and
- no required artifact omitted from the rebuild.

The dependency index is diagnostic evidence, not self-proving completeness.

## User-facing product boundary

Hyper Site is useful only when a developer can use it as a normal framework without the agent pipeline.

The agent pipeline is useful only when it can operate the framework through public commands and artifacts without importing private compiler implementation.

## Migration target

```text
reference/src compiler cluster
-> hyper-site/src
-> package-owned build output
-> clean packed consumers
-> reference as compatibility consumer

experimental content clusters
-> hyper-content/src
-> portable SiteSource adapter

agent concepts in core docs
-> external control-plane contracts and one adapter proof
```

## Removal rule

Any advanced component that cannot demonstrate a required invariant or measurable improvement over the direct control is removed from the critical path and retained only as research.
