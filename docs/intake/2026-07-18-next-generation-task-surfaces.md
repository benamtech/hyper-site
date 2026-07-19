# Intake — Next-Generation Task-Completion Surfaces

Status: preserved intake; partially accepted and not implementation authority  
Updated: 2026-07-18  
Source: user-supplied META-FORMAT-V4 and META-FORMAT-V5 notes plus current Hyper Site and AI Employee repositories  
Affected plan area: P1.4, P1.5, P2, P3, and field validation

## Objective

Investigate whether Hyper Site can support very large static sales-funnel systems whose indexable pages explain and prove a task while a governed AI service completes that task.

Three author classes must remain separate:

1. theme developers control trusted components, tokens, layout capabilities, accessibility, and renderer tiers;
2. site developers mount approved task services and compose static fallbacks;
3. growth operators configure bounded offers, qualification paths, experiments, conversion actions, and outcome metrics without owning runtime internals.

## Accepted principles

- Hyper Content must not own UI rendering logic.
- Hyper Site must not own agent reasoning, credentials, private memory, authorization, or business connectors.
- Public browser surfaces receive an approved projection, not the complete ontology, evidence graph, private memory, or reasoning state.
- Static HTML remains useful without JavaScript.
- Interactive surfaces use typed inputs, bounded capabilities, durable intent identity, receipts, and recovery.
- One task may have multiple renderers and transports.
- AI Employee SurfaceEnvelope, WorkResource, WorkAction, safety, and proof contracts are compatibility evidence.
- The current Free Estimator is a behavior fixture, not canonical framework architecture.
- Ten-thousand-page scale is a mandatory performance and maintenance tier, not a usefulness claim or minimum product page count.

## Corrections before architecture

### WebDriver is only a partial analogy

WebDriver standardizes remote browser control through a wire protocol. It does not establish that a content ontology is a browser-equivalent state machine. Model-based UI and command/event projections are closer prior art:

```text
task and domain model
-> abstract interaction model
-> concrete renderer plan
-> final interface
```

### Surfaces do not mutate canonical state directly

The supplied statement that surfaces never modify state is too strong for forms, approvals, uploads, and completed work.

Correct rule:

```text
surface submits a typed command or intent
server-side policy and runtime accept or reject it
runtime emits canonical events, resources, and receipts
surface renders an approved projection
```

### Existing representations retain separate authority

- ontology and evidence describe domain and content decisions;
- PCN is an LLM input contract;
- ArticleIR is an accepted content output contract;
- SiteManifest, SiteSource, and PageIR describe static web compilation;
- AI Employee materialization describes runtime work state.

An adapter may derive a task-service proposal from these artifacts. They should not be collapsed into one mutable format.

### The SDRT label cannot become public authority

SDRT is already an established acronym for Segmented Discourse Representation Theory. The proposed entity, relation, meta-relation, tensor, schema, and context notation remains a research input under the working label `relationship-projection notation`.

### Numeric dimensions are not policy authority

Publicity, legality, risk, cost, authority, and persistence require typed fields and explicit rules. Numeric vectors may be research features but cannot decide authorization, indexing, safety, or consequential effects.

### Self-description is unproven

The proposed notation does not yet specify stable escaping, identifiers, units, uncertainty, temporal order, transitions, versioning, conflict resolution, or validation. Existing standards must be compared before inventing a canonical grammar.

## Standards and prior art to compare

- JSON Schema and JSON Forms;
- A2UI;
- AG-UI;
- MCP Apps;
- JSON-LD and RDF 1.2 quoted triples;
- SHACL and PROV-O;
- CloudEvents and RFC 6902 JSON Patch;
- W3C Trace Context and OpenTelemetry;
- OpenFeature;
- WCAG 2.2;
- the CAMELEON model-based UI reference framework.

## Research questions

1. Can one internal task-surface ABI map to A2UI, AG-UI, MCP Apps, and AI Employee fixtures without semantic loss?
2. Which layer owns static fallback, component intent, streamed events, sandboxed applications, policy, and telemetry?
3. Can themes change rendering without changing task semantics?
4. Can growth operators vary presentation and sequencing without capability escalation?
5. Can 10,000 pages mount surfaces without duplicated JavaScript, schemas, or endpoints?
6. What is the minimum public projection needed for task completion?
7. Does relationship-projection notation beat typed JSON and graph/event baselines on compactness, validation, replay, or interoperability?

## Required outputs

- a primary-source protocol crosswalk;
- a protocol-neutral architecture;
- theme, site, and growth authoring boundaries;
- a 10K static and interactive performance model;
- security, accessibility, idempotency, recovery, and privacy gates;
- modified executable steps for P1.4, P1.5, P2, and P3;
- a durable memory handoff after validation.
