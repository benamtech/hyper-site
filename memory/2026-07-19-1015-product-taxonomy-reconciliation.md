# Product taxonomy reconciliation handoff

Date: 2026-07-19  
Branch: `agent/glm-blackwell-vertical-slice`  
PR: #3 draft and unmerged

## Canonical identity

```text
Hyper Content = evidence-grounded content generation and validation
Hyper Site = deterministic website framework/compiler/presentation
Hyper Runtime = identity, approvals, durable jobs, connectors and receipts
AI Employee = product composed from the three layers
```

Authority:

- `docs/architecture/52-product-taxonomy-and-runtime-boundaries.md`

## Corrected active authorities

- `README.md`;
- `identity.md`;
- `AGENTS.md`;
- `CODEGRAPH.md`;
- `docs/README.md`;
- `hyper-site/README.md`;
- `hyper-content/README.md`.

## Physical/logical distinction

Hyper Runtime code currently lives at:

```text
hyper-content/src/action-runtime.ts
hyper-content/src/durable-pilot.ts
hyper-content/src/production-runtime.ts
```

This is transitional physical placement. Runtime responsibilities are no longer documented as Hyper Content’s product identity.

A later `@amtech/hyper-runtime` extraction is package cleanup and must preserve current contracts, tests and effect behavior.

## Defects closed

- stale package-extraction claims in bootstrap docs;
- Hyper Site described as an AI Employee runtime;
- Hyper Content described as owner of durable connector effects;
- AI Employee used as an undefined repository/package synonym;
- pure compilation and external side effects undocumented as separate graphs.

Measured documentation report:

- `validation/reports/2026-07-19-product-taxonomy-documentation-reconciliation.md`.

## Product statement

Use:

> Hyper is a deterministic website framework and evidence-grounded content pipeline with an optional governed execution runtime. An AI Employee is a product built from those layers.

Do not use:

> Hyper Site is an AI Employee.

> Hyper Content owns connector execution.

## Next packaging decision

Do not immediately move files solely to make the folder graph look clean. First freeze public runtime exports and packed-consumer behavior, then extract to `@amtech/hyper-runtime` with compatibility re-exports and exact parity proof.
