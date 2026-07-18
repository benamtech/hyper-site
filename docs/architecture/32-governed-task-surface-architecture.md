# 32 — Governed Task-Surface Architecture

Status: accepted target architecture; implementation pending TDD gates  
Updated: 2026-07-18  
Research: `docs/research/31-next-generation-task-surfaces-protocol-crosswalk.md`  
Validation: `docs/validation/33-task-surface-validation-matrix.md`

## 1. Decision

Hyper Site will support protocol-neutral governed task surfaces. An indexable page may explain, prove, and statically support a task; an optional runtime service may complete that task and return a resource, artifact, action request, or receipt.

The architecture is not “generate a chat box.” It is:

```text
static page explains and proves
service contract defines bounded task completion
runtime executes under policy
surface renders approved projections
artifact and receipt prove the outcome
```

## 2. Product and dependency boundary

```text
hyper-content -> hyper-site
hyper-site -X-> hyper-content
hyper-site -X-> AI Employee internals
AI Employee adapter -> hyper-site public task-surface contract
```

### Hyper Content owns

- user-goal and content-opportunity research;
- evidence and static claims;
- canonical questions and examples;
- optional task-service proposals containing semantic goals, inputs, outputs, limitations, and review conditions;
- content distinctness, information gain, indexing, refresh, and retirement decisions.

It does not emit component trees, React, CSS, renderer identifiers, session code, or runtime authorization.

### Hyper Site owns

- `TaskServiceManifest` and `TaskSurfacePlan` contracts;
- static fallback and semantic HTML;
- trusted component registry and theme binding;
- service mount descriptors;
- surface adapter interfaces;
- browser policy, accessibility, performance, deployment, and rollback;
- public projection validation;
- runtime bundle and schema deduplication.

It does not own agent reasoning, private memory, connectors, credentials, billing, quotas, or consequential-action authorization.

### Runtime adapters own

- principal and assignment identity;
- session lifecycle;
- reasoning and tool execution;
- memory and connector access;
- quota and entitlement enforcement;
- accepted commands and canonical events;
- resources, artifacts, approvals, receipts, and audit records;
- reconnect and resume.

### Growth operations own

- bounded experiment and funnel configuration;
- approved copy and offer variants;
- qualification sequencing;
- renderer preference within permitted tiers;
- conversion actions;
- metric definitions and allocation.

Growth operations cannot widen capabilities, lower safety, expose private state, alter indexing policy for session output, or execute arbitrary code.

## 3. Permanent workstream

Add a permanent workstream rather than overloading migration or framework core:

```text
W7 task-surface-platform
```

W7 owns protocol-neutral task/surface contracts, component-intent binding, runtime adapter interfaces, public projections, growth configuration schemas, and protocol adapters.

W1 remains the static framework and renderer authority. W3 remains the temporary migration bridge. W4 owns infrastructure, observability, signing, and recovery. W6 owns field and revenue acceptance.

## 4. Abstraction levels

The architecture follows a model-based UI progression:

```text
Level 1: Task and domain semantics
  task goal, inputs, outputs, limitations, evidence, policies

Level 2: Abstract surface
  interaction regions, resources, actions, status, fallback requirements

Level 3: Concrete surface plan
  trusted component kinds, layout roles, renderer tier, schemas, slots

Level 4: Final interface
  static HTML, web component, declarative renderer, or sandboxed app
```

The final interface is replaceable. Task meaning, policy, accepted events, and receipts remain stable.

## 5. Core contracts

The following sketches define ownership, not final TypeScript spelling.

### Task service

```ts
type TaskServiceManifest = {
  id: string;
  version: string;
  canonicalQuestion: string;
  goal: string;
  mode: "public" | "authenticated" | "private";
  inputSchemaRef: string;
  outputSchemaRefs: string[];
  capabilityIds: string[];
  staticModuleIds: string[];
  fallbackModuleId: string;
  policies: {
    principal: "anonymous" | "pseudonymous" | "authenticated" | "business-member";
    retention: "ephemeral" | "session" | "project" | "business";
    authority: "read" | "draft" | "approval-required" | "consequential";
    risk: "low" | "review" | "regulated";
    cost: "free-bounded" | "metered" | "commercial";
    publicity: "public-input" | "private-input";
  };
  render: {
    permittedTiers: ("static" | "native" | "declarative" | "sandboxed")[];
    preferredTier: "static" | "native" | "declarative" | "sandboxed";
  };
  conversion?: {
    kind: "claim-output" | "create-employee" | "continue-project" | "contact-business" | "upgrade";
    destination: string;
  };
};
```

Policy fields are categorical and validated. Numeric feature vectors may exist in research metadata but are not accepted as policy authority.

### Static service mount

```ts
type TaskServiceMount = {
  serviceId: string;
  serviceVersion: string;
  pageId: string;
  entryIntentId: string;
  fallbackModuleId: string;
  publicContextRef?: string;
  growthPolicyRef?: string;
  rendererPreference?: "static" | "native" | "declarative" | "sandboxed";
};
```

A mount descriptor is small, deterministic, and content-addressable. It does not embed private state or a per-page application bundle.

### Intent

```ts
type SurfaceIntent = {
  intentId: string;
  serviceId: string;
  serviceVersion: string;
  sessionId: string;
  command: string;
  input: unknown;
  inputSchemaRef: string;
  traceparent?: string;
  expectedResourceVersion?: string;
};
```

### Event

```ts
type SurfaceEvent = {
  specVersion: "1.0";
  eventId: string;
  source: string;
  type: string;
  schemaRef: string;
  serviceId: string;
  sessionId: string;
  intentId?: string;
  sequence: number;
  occurredAt: string;
  traceparent?: string;
  projection: PublicSurfaceProjection;
};
```

### Public projection

```ts
type PublicSurfaceProjection = {
  status: "ready" | "collecting" | "working" | "needs-review" | "completed" | "failed";
  messages?: PublicMessage[];
  resources?: PublicResource[];
  actions?: PublicAction[];
  usage?: PublicUsage;
  progress?: PublicProgress;
  errors?: PublicError[];
};
```

The projection is allowlisted. It cannot contain hidden prompts, private memory, full ontology state, credentials, raw provider payloads, or unrelated tenant resources.

### Receipt

```ts
type ActionReceipt = {
  receiptId: string;
  intentId: string;
  outcome: "accepted" | "rejected" | "completed" | "failed";
  effectIds: string[];
  resourceIds: string[];
  policyDecisionRef: string;
  auditRef: string;
  createdAt: string;
};
```

A successful consequential effect without a receipt is invalid.

## 6. Renderer tiers

### Tier 0 — Static

- semantic HTML and CSS;
- complete explanation and limitations;
- useful no-JS input or continuation path where possible;
- no runtime JavaScript required for the page to answer its canonical question.

### Tier 1 — Native trusted components

- prebuilt components from the theme registry;
- smallest runtime and strongest accessibility control;
- preferred for common forms, progress, resources, actions, and artifacts.

### Tier 2 — Declarative generated surface

- protocol-neutral component-intent tree;
- validated against a trusted component catalog;
- A2UI adapter permitted;
- no arbitrary script or raw executable HTML.

### Tier 3 — Sandboxed application

- isolated application for canvas, complex visualization, rich media, or specialized workflows;
- MCP Apps adapter permitted;
- sandbox, CSP, capability requests, bridge limits, and host-mediated effects required;
- static fallback remains available.

Renderer escalation is policy-controlled. A service cannot request sandboxed execution merely because a model generated HTML.

## 7. Theme contract

A theme publishes:

```ts
type TaskSurfaceTheme = {
  id: string;
  version: string;
  tokens: DesignTokens;
  components: ComponentRegistration[];
  supportedTiers: RendererTier[];
  accessibilityClaims: AccessibilityClaim[];
  maximumSharedRuntimeBytes: number;
};
```

Each component registration declares:

- component kind and version;
- accepted schema;
- supported actions and states;
- static fallback behavior;
- focus, keyboard, error, loading, and reduced-motion behavior;
- renderer implementation;
- test fixture and accessibility evidence.

A theme may change presentation, not service semantics or policy.

## 8. Site contract

A site developer controls:

- routes and page composition;
- static modules and service placement;
- approved service and version;
- fallback and progressive enhancement;
- deployment configuration;
- allowed runtime origin and adapter;
- local privacy and retention copy;
- canonical and noindex behavior.

The compiler verifies that every mount references an existing service, schema, fallback, component capability, and allowed renderer tier.

## 9. Growth-operator contract

```ts
type GrowthPolicy = {
  id: string;
  version: string;
  eligibleRoutes: string[];
  entryVariants: GrowthVariant[];
  qualificationSteps: QualificationStep[];
  conversion: ConversionDefinition;
  allocation: ExperimentAllocation;
  metrics: GrowthMetricDefinition[];
  immutablePolicyRefs: string[];
};
```

Growth operators may vary:

- approved headline and explanatory modules;
- qualification question order;
- static versus native renderer preference;
- conversion destination;
- experiment allocation;
- follow-up offer after task completion.

They may not vary:

- service capability allowlist;
- data visibility;
- authority or risk class;
- receipt requirements;
- approval requirements;
- indexing of sessions or generated artifacts;
- private connector access.

OpenFeature may evaluate assignments, but the canonical policy remains an auditable Hyper Site contract.

## 10. Protocol adapters

The internal ABI is protocol-neutral. Adapters map only after the core contract and fixture pass.

### A2UI adapter

Maps concrete component intent and data binding to an A2UI response. Host component registration remains authoritative.

### AG-UI adapter

Maps lifecycle, messages, tool activity, state snapshots/deltas, interrupts, and resume to `SurfaceEvent` and `SurfaceIntent`.

### MCP Apps adapter

Maps sandboxed service resources, initialization, notifications, tool calls, and host-mediated exports.

### AMTECH AI Employee adapter

Maps owner-safe `SurfaceEnvelope`, `WorkResource`, `WorkAction`, safety, and proof fields into public projections, actions, and receipts. Public services use isolated assignments and policies.

No adapter may widen the core service contract.

## 11. Build and runtime flow

### Build

```text
approved service manifest
+ theme registry
+ site mounts
+ growth policies
-> schema and capability validation
-> static fallback compilation
-> surface plan compilation
-> content-addressed shared bundles
-> PageIR and static artifacts
-> service/schema/component dependency index
```

### Runtime

```text
mount activates after explicit interaction
-> adapter creates or resumes session
-> client submits intent
-> runtime evaluates policy and executes
-> ordered events update public projection
-> user may approve, edit, retry, or continue
-> runtime produces resource or artifact
-> receipt proves accepted effects
-> telemetry records task and business outcomes
```

## 12. Ten-thousand-page requirements

At 10K pages:

- static pages with no activated surface emit zero runtime requests;
- runtime bundles are shared by content hash and renderer tier;
- a repeated service manifest is emitted once;
- page mounts are small declarative records;
- schemas are deduplicated;
- service endpoints are shared, not generated per route;
- changing one page does not rebuild unrelated service bundles;
- changing one service invalidates only its mounts and manifest indexes;
- changing one component invalidates only surfaces using that component;
- changing one growth policy does not rebuild unrelated static content;
- output reports duplicated runtime bytes, schema count, service count, and invalidation scope.

Performance is measured for 5, 25, 100, 500, and 10,000 pages. Ten thousand remains a required scale tier, not evidence that 10,000 pages should be published.

## 13. Plan changes

### P1.4

Move clean framework source into `hyper-site/src`, but first classify the existing UI modules:

- content-neutral renderer and design contracts move with W1;
- vector/profile/manifest-derived UI planning stays in Hyper Content or the migration adapter;
- `reference/` consumes workspace package exports;
- no task-surface implementation is added until physical framework authority is singular.

### P1.5

Move vector geometry, prototypes, packed arrays, and current Wasm behind Hyper Content. Remove these dependencies from all W1 UI planning and rendering paths.

### P1.6 — new

Freeze the protocol-neutral task-service, surface-plan, public-projection, intent, event, receipt, theme, and growth-policy contracts with deterministic fixtures and no external protocol dependency.

### P2

The standalone scaffold includes five static pages and one governed task-service fixture. Dev, preview, publisher, benchmark, and 10K tests include shared surface bundles and static fallback.

### P3

Hyper Content may emit an approved task-service proposal containing semantics and evidence, but W7 compiles it to a surface plan. The real provider cohort must prove that content generation and task-surface proposal generation remain independently rejectable and recoverable.

## 14. Explicit nonclaims

This architecture does not yet prove:

- protocol conformance;
- A2UI, AG-UI, MCP Apps, or AI Employee interoperability;
- superior conversion;
- safe public runtime isolation;
- accessible dynamic rendering;
- 10K runtime performance;
- relationship-projection notation value;
- production readiness.
