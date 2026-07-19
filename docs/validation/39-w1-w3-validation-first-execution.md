# W1-W3 Validation-First Execution

Status: active validation authority  
Updated: 2026-07-18

## Purpose

Define and test the failure surface before implementing W1, W2, or W3. These checks answer whether repository state supports the business claim that Hyper can produce and maintain a small evidence-grounded static site with fewer defects or lower lifecycle cost than a direct typed-content and template implementation.

No package extraction, five-page build, or maintenance experiment is performed by this validation pass.

## Local commands

```bash
npm run test:validation
npm run validate:workstreams
npm run validate:w1
npm run validate:w2
npm run validate:w3
```

The validation commands intentionally return exit code `1` while required evidence is absent or a gate is red. Reports are written under `validation/reports/` when invoked through npm.

## Authoritative inputs

- `planning/workstream-validation-vector-space.json`: business goals, exit conditions, and thirty mapped failure vectors across W1-W3.
- `validation/reference-source-inventory.json`: one-record-per-file W1 ownership inventory. It begins empty and therefore correctly keeps W1 red.
- `scripts/validate-workstreams.mjs`: local repository-state and evidence validator.
- `test/workstream-validation.test.mjs`: tests that the current repository cannot falsely pass and that later gates remain blocked.

## W1 evidence contracts

The validator requires these measured files before W1 can pass:

### `validation/reference-source-inventory.json`

Every regular file under `reference/src` must have exactly one record:

```json
{
  "path": "reference/src/example.ts",
  "owner": "hyper-site-stable",
  "role": "compiler contract",
  "dependencies": [],
  "tests": ["reference/test/example.test.mjs"],
  "migration_order": 10
}
```

Missing, duplicate, orphan, or incomplete records fail W1.

### `validation/evidence/w1-reference-consumer.json`

```json
{
  "passed": true,
  "commit": "exact-head-sha",
  "reference_runtime_implementations": 0,
  "package_imports_verified": true
}
```

### `validation/evidence/w1-packed-consumers.json`

```json
{
  "passed": true,
  "commit": "exact-head-sha",
  "consumer_count": 2,
  "consumers": [
    {"name": "hyper-site-only", "isolated_install": true, "passed": true},
    {"name": "hyper-content-to-site", "isolated_install": true, "passed": true}
  ]
}
```

### `validation/evidence/w1-artifact-parity.json`

```json
{
  "passed": true,
  "commit": "exact-head-sha",
  "failures": 0,
  "compared": [
    "html",
    "instruction_markdown",
    "sitemap",
    "dependency_index",
    "negative_rejection",
    "page_hash",
    "build_hash"
  ]
}
```

After all live W1 checks pass, create `validation/evidence/w1-gate-report.json` with `passed: true` and the exact commit. W2 refuses to run as green without that report.

## W2 evidence contract

`validation/evidence/w2-five-page-proof.json` must record a clean packed-package consumer, five distinct page purposes, successful `dev`, `build`, `preview`, and `inspect` commands, byte-identical clean rebuilds, equivalent direct control, zero critical accessibility findings, and operator time and cost.

After live W2 checks pass, create `validation/evidence/w2-gate-report.json` tied to the exact commit. W3 remains blocked without it.

## W3 evidence contract

`validation/evidence/w3-maintenance-proof.json` must contain frozen expected-set hashes and measured results for:

1. shared fact change;
2. page-specific fact change;
3. shared design change;
4. retirement or indexability change;
5. invalid change rejected without partial output.

The report must include the direct-control comparison, unexpected changed-page count, operator time including diagnosis and repair, and one explicit decision: `advance`, `narrow`, or `stop`.

A neutral or losing result cannot be converted into roadmap success. When no meaningful advantage or required invariant is found, the decision must be `narrow` or `stop`.

## Failure and adversarial model

The vector-space contract maps ten failure vectors per workstream. Highest-risk classes are:

- false ownership caused by generated output or compatibility re-exports;
- monorepo-only package success;
- parity drift in routes, escaping, metadata, ordering, hashes, or rejection behavior;
- W2 starting before W1 through repository-relative imports;
- duplicated pages being counted as five distinct pages;
- an intentionally weakened direct control;
- deterministic hashes that omit relevant artifacts;
- expected maintenance impact defined after observing results;
- partial writes after a rejected change;
- selective operator-time accounting;
- continuation of framework expansion after a neutral or losing W3 result.

## Current expected state

The correct state is red:

- the source inventory is incomplete;
- Hyper Site does not yet own `framework-core` under `hyper-site/src`;
- runtime delegation to `reference/dist` still exists;
- packed-consumer evidence does not exist;
- parity evidence does not exist;
- W2 and W3 are blocked by prior gates.

A red report is not a test failure in the planning sense. It is the truthful baseline from which test-driven extraction begins.
