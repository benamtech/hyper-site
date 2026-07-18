# Reality-Grounded Product and Integration Boundary

Status: accepted architecture addendum  
Updated: 2026-07-18  
Input: `docs/research/34-intellectual-competitive-and-use-case-landscape.md`

## Decision

Hyper is governed as two products plus one optional integration boundary:

```text
approved evidence and content operations
-> @amtech/hyper-content
-> portable SiteSource, page contracts, task proposals and validation results
-> @amtech/hyper-site
-> static artifacts and governed task mounts
-> optional runtime adapter
-> durable workflow or AI Employee system
```

No layer may require the next layer for its core value.

## Product authority

### Hyper Site owns

- content-neutral static compilation;
- PageIR and deterministic web artifacts;
- trusted renderer contracts;
- design, accessibility and browser budgets;
- static fallback and service mounts;
- publisher interfaces;
- protocol-neutral public task-surface contracts.

It does not own ontology discovery, evidence ranking, model providers, durable execution, connector catalogs, identity, authorization, experimentation statistics or enterprise workflow administration.

### Hyper Content owns

- source and evidence intake;
- claim and information-object proposals;
- ontology and opportunity methods;
- page-existence and duplicate analysis;
- provider dispatch and structured generation;
- PCN and ArticleIR acceptance;
- corpus validation and invalidation proposals;
- optional task-semantic proposals.

It does not own HTML rendering, theme components, browser state, runtime effects, credentials or publication authority.

### Runtime adapters own

- authentication and actor identity;
- policy enforcement;
- durable state and retries;
- tools and connectors;
- external effects;
- idempotency;
- receipts and audit;
- private session state.

Hyper may provide a reference runtime adapter but must not make a homegrown durable runtime a prerequisite for the framework or compiler.

## Buy, integrate, or build rule

A capability is built in core only when all are true:

1. it is necessary to preserve a Hyper-owned invariant;
2. existing software cannot satisfy the invariant through a stable adapter;
3. the capability is exercised by the first five-page-plus-one-task fixture;
4. a simpler implementation is included as a control;
5. removal or replacement remains possible.

Otherwise the default is integration.

### Integrate first

- Temporal or equivalent for durable workflows;
- LangGraph or equivalent for stateful agent orchestration;
- n8n, Power Automate or line-of-business systems for connector-rich effects;
- OpenFeature/GrowthBook/Optimizely for experiment delivery and analysis;
- OpenTelemetry for observability;
- OPA, Cedar or host policy systems for authorization;
- existing CMSs for editorial workflow where required;
- ordinary frameworks as publisher targets or controls.

### Build in core

- deterministic Hyper contracts;
- evidence-to-page adaptation;
- explicit rejection and provenance boundaries;
- content-neutral PageIR;
- static fallback guarantees;
- author-boundary enforcement;
- portable task-service declarations;
- dependency and invalidation metadata unique to the compiler contract.

## Baseline-first rule

Every advanced method must compete against a lower-complexity baseline:

| Advanced method | Required control |
|---|---|
| ontology graph | typed JSON or relational schema |
| graph database | PostgreSQL tables and indexes |
| embeddings | lexical retrieval and explicit rules |
| HRR/HDC or vector packing | ordinary arrays/maps and deterministic IDs |
| GPU acceleration | CPU implementation |
| Wasm | native JavaScript or server implementation |
| generative UI | trusted static/native components |
| agent workflow | deterministic state machine or workflow engine |
| autonomous opportunity selection | human-curated page plan |

No method becomes architectural authority from novelty, elegance or synthetic scale.

## Initial commercial boundary

The first credible product fixture is:

```text
one approved business evidence set
-> five justified pages
-> one bounded task surface
-> one portable static deployment
-> one durable workflow adapter
-> human approval before publication or consequential effect
```

Out of scope for this gate:

- autonomous mass publication;
- enterprise DAM replacement;
- full CMS replacement;
- general-purpose BPM/RPA;
- universal agent platform;
- proprietary experiment statistics;
- ten-thousand-page publication claims;
- browser authorization derived from semantic vectors.

## Portability requirements

1. Hyper Content output is serializable and versioned.
2. Hyper Site output can be hosted as ordinary static assets.
3. Task services declare capabilities without embedding runtime credentials.
4. Runtime adapters can be replaced without regenerating static content unless the public contract changes.
5. Protocol adapters cannot widen capabilities.
6. No private session or artifact is indexable by default.
7. Reference fixtures must run without enterprise software.

## Enterprise gap register

Any enterprise positioning must explicitly account for:

- SSO and identity lifecycle;
- tenant isolation;
- fine-grained permissions;
- audit retention;
- localization and regional governance;
- digital asset management;
- editorial workflow and legal hold;
- migration and import tooling;
- integration catalogs;
- observability and support operations;
- SLAs, incident response and disaster recovery;
- accessibility governance;
- data residency and retention;
- procurement and partner ecosystem.

These are not secondary polish. They explain much of the cost and defensibility of Adobe, Sitecore, Optimizely, Microsoft, Salesforce and ServiceNow.

## Self-reinforcing documentation chain

```text
research landscape
-> this architecture boundary
-> executable workstream plan
-> validation matrix
-> implementation and CI
-> measured report
-> immutable memory handoff
-> catalog and bootstrap reconciliation
-> next research update
```

A downstream contradiction must either update this decision or be recorded as an explicit exception. Historical documents remain preserved but cannot silently override this boundary.

## Consequences

- P1.4 and P1.5 remain the immediate implementation priority.
- P1.6 begins only after product source ownership is physically credible.
- P2 uses ordinary frameworks and integrated systems as controls.
- P3 proves one real provider and runtime path before larger cohorts.
- Advanced vector, graph, GPU and Wasm work remains experimental until promotion gates pass.
- Enterprise platform comparisons inform requirements but do not expand the immediate product scope.
