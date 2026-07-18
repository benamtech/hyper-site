# 31 — Next-Generation Task Surfaces: Protocol, Prior-Art, and Scale Crosswalk

Status: verified research disposition; architecture and implementation require separate gates  
Updated: 2026-07-18  
Intake: `docs/intake/2026-07-18-next-generation-task-surfaces.md`  
Sources: `docs/research/sources/2026-07-18-task-surfaces.sources.json`

## 1. Research question

Can Hyper Site support indexable static pages that become governed task-completion surfaces for theme developers, site developers, and growth operators, while preserving:

```text
hyper-content -> hyper-site
hyper-site -X-> hyper-content
hyper-site -X-> AI Employee internals
runtime adapter -> public Hyper Site surface contract
```

The question is not whether a model can emit React or HTML. The question is whether one stable, testable, protocol-neutral contract can support static explanation, structured interaction, streamed work state, artifacts, approvals, experimentation, and conversion at 10,000-page scale.

## 2. Method

The research used five source classes:

1. current Hyper Site source and executable plan;
2. current AI Employee materialization and public-estimator fixture;
3. primary standards and official protocol documentation;
4. original model-based UI and discourse-semantics research;
5. mature open-source schema-driven UI architecture.

Every conclusion is classified as:

- `retain`: directly useful as current architecture;
- `adapter`: useful external compatibility surface but not internal authority;
- `research`: plausible and falsifiable, not canonical;
- `reject`: conflicts with boundaries or lacks required semantics.

## 3. The WebDriver analogy

The W3C WebDriver specification defines a platform- and language-neutral wire protocol between a local end and a remote end. It supports session identity and remote browser control while leaving local-end APIs implementation-defined.

Useful transfer:

```text
stable protocol boundary
independent client implementations
session identity
black-box compatible remote endpoints
```

Invalid transfer:

- WebDriver does not turn DOM, page text, or browser state into a universal domain ontology;
- it does not define generative UI, task models, evidence, or authorization;
- it controls a browser rather than compiling domain semantics into multiple interfaces.

Disposition: retain the wire-boundary analogy only. Use model-based UI and command/event architecture as the stronger design precedent.

## 4. Model-based UI prior art

The W3C Model-Based UI report and CAMELEON reference framework distinguish:

```text
tasks and concepts
-> abstract user interface
-> concrete user interface
-> final user interface
```

This maps closely to the required Hyper architecture:

```text
task/service semantics
-> protocol-neutral surface plan
-> theme/component binding
-> static HTML or interactive runtime
```

This prior art prevents a false novelty claim. Hyper Site's potentially differentiated contribution is not abstract-to-concrete UI generation by itself. The opportunity is the combination of:

- evidence-rich static pages;
- governed task execution;
- one protocol-neutral surface ABI;
- theme/site/growth author separation;
- 10K static scale and maintenance;
- proof, receipts, and commercial outcome measurement.

Disposition: retain as the principal architectural model.

## 5. Protocol crosswalk

### 5.1 A2UI

A2UI is an official Google public-preview project for updateable, declarative agent-generated interfaces. The agent describes component intent and data; the host maps abstract components to trusted native implementations. It is transport-independent and explicitly supports renderer registries.

Useful role:

- declarative component-intent adapter;
- cross-renderer conformance fixture;
- host-owned component and trust registry;
- structured dynamic forms and dashboards.

Constraints:

- public preview and still evolving;
- does not replace task authorization, event identity, persistence, receipts, or static publication;
- an A2UI tree is a concrete surface proposal, not the canonical task model.

Disposition: adapter, never internal authority.

### 5.2 AG-UI

AG-UI defines a bidirectional event protocol between agent backends and frontends. It includes run lifecycle, message and tool streams, snapshots, RFC 6902 state deltas, activity events, serialization, resume, and human interrupts.

Useful role:

- event-transport adapter;
- streaming lifecycle and reconnect comparison;
- snapshot/delta state synchronization;
- interrupt and approval conformance.

Critical correction to the intake: AG-UI describes shared state that both sides may update. Hyper Site should expose a stricter projection model. A browser may update local form state and submit commands, but canonical domain state changes only after runtime acceptance.

Disposition: adapter and test oracle for event semantics.

### 5.3 MCP Apps

MCP Apps links tools to UI resources rendered in sandboxed iframes. Hosts mediate capabilities, use `postMessage` and a JSON-RPC dialect, enforce sandboxing, and require declared CSP origins for network and external resources.

Useful role:

- open-ended custom application tier;
- sandbox and host-capability security baseline;
- rich media, canvas, diagram, and 3D surface adapter;
- host-mediated tool and download behavior.

Constraints:

- not appropriate for every surface;
- iframe and bridge cost must be measured;
- host support varies;
- static page fallback remains required.

Disposition: adapter for the sandboxed tier.

### 5.4 JSON Schema and JSON Forms

JSON Schema Draft 2020-12 provides versioned structural validation, reusable vocabularies, compound schemas, and annotations. JSON Forms separates data schema, UI schema, and renderer sets with a UI-framework-neutral core.

Useful role:

- canonical input and output schema format;
- static form generation baseline;
- custom renderer registry precedent;
- negative control against inventing a new grammar.

Constraints:

- JSON Schema is not authorization or workflow state;
- UI schemas can become renderer-specific if not bounded;
- forms are only one surface class.

Disposition: retain JSON Schema as the initial canonical structural contract; compare or reuse JSON Forms rather than rebuilding basic form rendering.

## 6. Relationship and provenance representation

### 6.1 The supplied relationship tensor

The proposed entity/relation/meta-relation/context notation is expressive enough to sketch a sparse labeled hypergraph with feature vectors. It is not yet a state machine or interoperable protocol.

Missing semantics include:

- commands and accepted events;
- transition functions and invariants;
- temporal and causal ordering;
- identity, replay, and duplicate rules;
- schema evolution and compatibility;
- uncertainty and measurement units;
- authorization and policy evaluation;
- escaping and canonical serialization;
- conflict resolution;
- public/private projection rules.

The notation also overloads dimensions. For example, one axis cannot safely serve legality, source reliability, ethics, and authorization without a formal domain-specific schema.

Disposition: research comparison only.

### 6.2 Name collision

SDRT already denotes Segmented Discourse Representation Theory in computational linguistics. Publishing another semantic representation under that acronym would create avoidable confusion in search, academic review, package naming, and interoperability.

Disposition: reject `SDRT` as the public name.

### 6.3 Existing graph standards

RDF 1.2 working drafts add quoted triples, allowing statements about statements. SHACL defines graph shapes, constraints, and validation reports. PROV-O defines entities, activities, agents, and portable provenance relationships.

These standards may be too heavy for the runtime wire format, but they are required comparison baselines for:

- meta-relations;
- provenance;
- conflict annotations;
- graph constraints;
- public interchange.

Disposition: W5 research adapters. Do not make the browser consume RDF or the complete content graph.

## 7. Runtime event and state baseline

CloudEvents provides a protocol-neutral event envelope with required `id`, `source`, `specversion`, and `type`. Its `source + id` duplicate semantics are directly useful for retries. W3C Trace Context provides portable request correlation. OpenTelemetry separates traces, metrics, logs, and baggage.

Recommended internal event baseline:

```text
surface event
  event_id
  event_type
  schema_version
  source
  service_id
  session_id
  intent_id
  sequence
  occurred_at
  trace_context
  public_projection
```

Canonical effects require a receipt containing:

```text
intent_id
accepted_or_rejected
resulting_resource_ids
effect_ids
policy_decision_ref
audit_ref
idempotency_ref
```

Disposition: retain CloudEvents-like identity, Trace Context propagation, and OpenTelemetry instrumentation without requiring literal wire compatibility in the first implementation.

## 8. Three-author model

### Theme developers

Own:

- trusted component implementations;
- design tokens and themes;
- component capabilities and slots;
- accessibility behavior;
- static, declarative, and sandbox mount renderers;
- responsive and reduced-motion behavior.

Do not own:

- task meaning;
- business authorization;
- private runtime data;
- experiment assignment;
- irreversible effects.

### Site developers

Own:

- page and route composition;
- static explanatory modules;
- approved service mounts;
- no-JS fallback;
- adapter configuration;
- deployment and rollback;
- local data boundary declarations.

Do not own:

- model reasoning internals;
- private employee credentials;
- cross-tenant state;
- undeclared capabilities.

### Growth operators

Own declarative, bounded configuration:

- offer and audience eligibility;
- entry context and qualification sequence;
- static copy variants within approved claims;
- surface ordering and renderer preference;
- conversion destinations;
- experiment allocation;
- task, artifact, cost, conversion, and retention metrics.

Do not own:

- arbitrary executable code;
- safety or authorization downgrades;
- private data projection;
- indexing of generated sessions or artifacts;
- effect idempotency policy.

OpenFeature is a useful vendor-neutral evaluation API, but it does not define a complete experiment control plane. Growth configuration therefore needs its own schema and audit record, with an OpenFeature adapter permitted later.

## 9. Static and runtime architecture

### Build time

```text
Hyper Content optional task proposal
  canonical question
  static evidence and examples
  intended user goal
  input/output classes
  prohibited and review conditions
        |
        v
human or policy approval
        |
        v
TaskServiceManifest
        |
        +-> static modules and no-JS form/fallback
        +-> protocol-neutral SurfacePlan
        +-> schema and policy references
        +-> shared runtime bundle reference
        v
SiteManifest -> SiteSource -> PageIR -> static output
```

Hyper Content may propose task semantics but never React trees, CSS, component IDs, or runtime implementation details.

### Runtime

```text
user interaction
-> typed intent with stable ID
-> runtime adapter and policy evaluation
-> event stream
-> public resource projection
-> optional bounded action
-> receipt
-> artifact or completed goal
-> measured conversion
```

The UI may be static, native/declarative, or sandboxed. The service semantics and event contract do not change with renderer selection.

## 10. Ten-thousand-page performance model

The correct 10K question is not “can 10,000 pages include chat?” It is whether the compiler and browser avoid page-count-multiplied runtime cost.

Required design:

- one content-addressed service manifest per unique service version;
- one shared renderer/runtime chunk per renderer tier;
- page HTML stores only a small mount descriptor and static fallback;
- no per-page generated JavaScript;
- no per-page runtime endpoint;
- schemas and component catalogs deduplicated by hash;
- dynamic code loaded only after explicit interaction or viewport policy;
- sandboxed bundles shared and cached by content hash;
- static pages remain crawlable and complete without runtime activation;
- `content-visibility` may reduce long-page rendering cost but cannot hide accessibility or semantic content;
- incremental invalidation follows dependency IDs from service, schema, theme, component, page, and growth policy.

Mandatory matrices:

```text
page counts: 5, 25, 100, 500, 10,000
surface mounts: 0, 1, 100, 10,000
unique services: 1, 10, 100
renderer tiers: static, declarative, sandboxed
changes: page, service schema, component, theme token, growth policy, adapter
```

Measure cold build, incremental build, peak memory, output bytes, duplicate bundles, static HTML completeness, first-interaction cost, accessibility, reconnect behavior, and invalidation scope.

## 11. AMTECH compatibility findings

Current AI Employee source already provides useful primitives:

- `SurfaceEnvelope` combines render hints, safety, proof, resource, and actions;
- `WorkResource` is owner-safe and surface-agnostic;
- `WorkAction` expresses bounded action choices;
- signed preview contracts preserve scoped access;
- the Free Estimator demonstrates session creation, messages, a structured artifact preview, copy/download behavior, and conversion intent.

Required boundary:

```text
AI Employee internal materialization
-> AMTECH public-service adapter
-> Hyper Site task-surface events/resources
```

Hyper Site must not import AI Employee internals. Public service mode must use isolated assignment, memory, credentials, quotas, retention, and capabilities rather than hiding controls from a private employee session.

## 12. Accepted architecture disposition

Retain now:

- protocol-neutral task/service contract;
- JSON Schema structural validation;
- command/event/receipt model;
- static fallback first;
- trusted component registry;
- theme/site/growth author separation;
- public projection and least privilege;
- 10K bundle and invalidation constraints;
- AI Employee adapter as the first runtime compatibility target.

Adapters after the internal ABI is stable:

- A2UI for declarative component intent;
- AG-UI for bidirectional events and resume;
- MCP Apps for sandboxed open-ended applications;
- OpenFeature for experiment evaluation;
- RDF/SHACL/PROV adapters for semantic interchange where justified.

Research only:

- relationship tensors and numeric semantic dimensions;
- a universal graph serialization;
- automatic UI generation from the full ontology;
- protocol superiority claims.

Reject:

- UI logic in Hyper Content;
- reasoning or authorization in Hyper Site;
- browser access to the complete semantic graph;
- direct client mutation of canonical state;
- arbitrary generated executable UI outside a sandbox;
- page-count-multiplied runtime bundles;
- traffic or chat activity as a substitute for successful goal and artifact completion.
