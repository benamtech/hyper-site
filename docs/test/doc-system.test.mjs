import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { validateCatalogShape, validateDocumentationSystem } from "../../scripts/check-doc-system.mjs";

const root = resolve(fileURLToPath(new URL("../..", import.meta.url)));

test("canonical documentation system passes repository validation", async () => {
  assert.deepEqual(await validateDocumentationSystem(root), []);
});

test("legacy experiment path normalization remains idempotent", async () => {
  const implementationPlan = await readFile(resolve(root, "docs/planning/08-implementation-plan.md"), "utf8");
  assert.equal(
    implementationPlan.includes("docs/research/experiments/docs/research/experiments/"),
    false,
    "canonical experiment paths must not grow another docs/research/experiments prefix"
  );
});

test("catalog validation rejects duplicate identifiers and paths", () => {
  const catalog = {
    version: "1.0.0",
    rootAllowlist: ["README.md"],
    documents: [
      { id: "docs-system", path: "docs/README.md", kind: "bootstrap", status: "active", authority: "one" },
      { id: "docs-system", path: "docs/README.md", kind: "research", status: "active", authority: "two" }
    ]
  };
  const errors = validateCatalogShape(catalog);
  assert.ok(errors.some((error) => error.includes("duplicates docs-system")));
  assert.ok(errors.some((error) => error.includes("duplicates docs/README.md")));
});

test("catalog validation rejects unknown lifecycle kinds", () => {
  const catalog = {
    version: "1.0.0",
    rootAllowlist: ["README.md"],
    documents: [
      { id: "docs-system", path: "docs/README.md", kind: "misc", status: "active", authority: "one" }
    ]
  };
  assert.ok(validateCatalogShape(catalog).some((error) => error.includes("kind misc is invalid")));
});
