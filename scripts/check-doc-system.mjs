import { readFile, readdir, stat } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ALLOWED_KINDS = new Set([
  "bootstrap",
  "intake",
  "research",
  "architecture",
  "planning",
  "validation-contract",
  "validation-report",
  "memory-index",
  "memory-handoff"
]);
const REQUIRED_ROOT_MARKDOWN = ["README.md", "AGENTS.md", "CODEGRAPH.md", "CONTRIBUTING.md", "identity.md"];
const MOVED_ROOT_DOCUMENTS = [
  "24-agent-discovered-ontology-and-10k-site-program.md",
  "25-academic-crosswalk-agent-harness-structured-generation-and-acceleration.md",
  "26-graph-learning-paper-triage-and-promotion-gates.md",
  "27-near-alpha-framework-validation-and-continuous-agent-workspace.md",
  "28-agent-first-web-framework-and-llm-backend.md",
  "29-product-boundary-research-and-root-folder-split.md",
  "30-meta-plan-v3-executable-program.md"
];
const REQUIRED_DOCUMENT_IDS = [
  "docs-system",
  "architecture-product-boundary",
  "planning-meta-plan-v3",
  "intake-task-surfaces",
  "research-task-surfaces",
  "architecture-task-surfaces",
  "validation-task-surfaces",
  "memory-index"
];
const REQUIRED_PLAN_IDS = {
  workstreams: ["W7"],
  researchHypotheses: ["H5", "H6"],
  planOutcomes: ["O5"]
};
const REQUIRED_STEP_IDS = ["P1.6", "P2.5", "P3.4"];
const TEXT_EXTENSIONS = new Set([".md", ".json", ".mjs", ".ts", ".yml", ".yaml"]);
const IGNORED_DIRECTORIES = new Set([".git", "node_modules", "dist", "coverage", ".cache"]);

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function walk(directory) {
  const output = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && IGNORED_DIRECTORIES.has(entry.name)) continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) output.push(...await walk(path));
    else output.push(path);
  }
  return output;
}

export function validateCatalogShape(catalog) {
  const errors = [];
  if (!catalog || typeof catalog !== "object") return ["catalog must be an object"];
  if (typeof catalog.version !== "string" || !catalog.version.trim()) errors.push("catalog.version is required");
  if (!Array.isArray(catalog.rootAllowlist) || catalog.rootAllowlist.length === 0) errors.push("catalog.rootAllowlist must be non-empty");
  if (!Array.isArray(catalog.documents) || catalog.documents.length === 0) return [...errors, "catalog.documents must be non-empty"];

  const ids = new Set();
  const paths = new Set();
  for (const [index, document] of catalog.documents.entries()) {
    const prefix = `catalog.documents[${index}]`;
    if (!document || typeof document !== "object") {
      errors.push(`${prefix} must be an object`);
      continue;
    }
    if (typeof document.id !== "string" || !document.id.trim()) errors.push(`${prefix}.id is required`);
    else if (ids.has(document.id)) errors.push(`${prefix}.id duplicates ${document.id}`);
    else ids.add(document.id);
    if (typeof document.path !== "string" || !document.path.trim()) errors.push(`${prefix}.path is required`);
    else if (paths.has(document.path)) errors.push(`${prefix}.path duplicates ${document.path}`);
    else paths.add(document.path);
    if (!ALLOWED_KINDS.has(document.kind)) errors.push(`${prefix}.kind ${document.kind ?? "<missing>"} is invalid`);
    if (typeof document.status !== "string" || !document.status.trim()) errors.push(`${prefix}.status is required`);
    if (typeof document.authority !== "string" || !document.authority.trim()) errors.push(`${prefix}.authority is required`);
  }
  for (const required of REQUIRED_DOCUMENT_IDS) if (!ids.has(required)) errors.push(`catalog missing required document id ${required}`);
  return errors;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function staleReferencePattern(filename) {
  return new RegExp(`(^|[\\s('"\\x60])${escapeRegex(filename)}(?=$|[\\s)'"\\x60,:])`, "m");
}

export async function validateDocumentationSystem(root) {
  const errors = [];
  const catalogPath = resolve(root, "docs/catalog.json");
  let catalog;
  try {
    catalog = JSON.parse(await readFile(catalogPath, "utf8"));
  } catch (error) {
    return [`cannot read docs/catalog.json: ${error instanceof Error ? error.message : String(error)}`];
  }
  errors.push(...validateCatalogShape(catalog));

  const rootMarkdown = (await readdir(root, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name)
    .sort();
  const expectedRoot = [...REQUIRED_ROOT_MARKDOWN].sort();
  if (JSON.stringify(rootMarkdown) !== JSON.stringify(expectedRoot)) {
    errors.push(`root Markdown must be exactly ${expectedRoot.join(", ")}; received ${rootMarkdown.join(", ")}`);
  }
  const catalogRoot = [...(catalog.rootAllowlist ?? [])].sort();
  if (JSON.stringify(catalogRoot) !== JSON.stringify(expectedRoot)) errors.push("catalog.rootAllowlist does not match the enforced root Markdown allowlist");

  for (const filename of MOVED_ROOT_DOCUMENTS) {
    if (await exists(resolve(root, filename))) errors.push(`moved document still exists at root: ${filename}`);
  }

  for (const document of catalog.documents ?? []) {
    if (typeof document?.path === "string" && !(await exists(resolve(root, document.path)))) errors.push(`catalog path does not exist: ${document.path}`);
  }

  const requiredBootstrapLinks = ["README.md", "AGENTS.md", "CONTRIBUTING.md"];
  let linkedBootstrapCount = 0;
  for (const path of requiredBootstrapLinks) {
    const text = await readFile(resolve(root, path), "utf8");
    if (text.includes("docs/README.md")) linkedBootstrapCount += 1;
  }
  if (linkedBootstrapCount < 2) errors.push("at least two bootstrap documents must link to docs/README.md");

  const sourceRegistryPath = resolve(root, "docs/research/sources/2026-07-18-task-surfaces.sources.json");
  try {
    const registry = JSON.parse(await readFile(sourceRegistryPath, "utf8"));
    if (!Array.isArray(registry.sources) || registry.sources.length < 10) errors.push("task-surface source registry requires at least ten sources");
    const sourceIds = new Set();
    for (const source of registry.sources ?? []) {
      if (!source?.id) errors.push("source registry contains source without id");
      else if (sourceIds.has(source.id)) errors.push(`source registry duplicates id ${source.id}`);
      else sourceIds.add(source.id);
      if (!source?.class || !source?.status) errors.push(`source ${source?.id ?? "<missing>"} requires class and status`);
    }
  } catch (error) {
    errors.push(`cannot parse task-surface source registry: ${error instanceof Error ? error.message : String(error)}`);
  }

  const plan = JSON.parse(await readFile(resolve(root, "planning/meta-plan-v3.json"), "utf8"));
  const steps = JSON.parse(await readFile(resolve(root, "planning/meta-plan-v3.steps.json"), "utf8"));
  for (const [field, ids] of Object.entries(REQUIRED_PLAN_IDS)) {
    const present = new Set((plan[field] ?? []).map((item) => item.id));
    for (const id of ids) if (!present.has(id)) errors.push(`plan.${field} missing ${id}`);
  }
  const stepIds = new Set(steps.map((step) => step.id));
  for (const id of REQUIRED_STEP_IDS) if (!stepIds.has(id)) errors.push(`plan steps missing ${id}`);
  if (!(plan.constraints ?? []).includes("zero_ui_logic_in_content_pipeline")) errors.push("plan missing zero_ui_logic_in_content_pipeline constraint");
  if (!(plan.constraints ?? []).includes("10k_surface_scale_required")) errors.push("plan missing 10k_surface_scale_required constraint");

  if (!(await exists(resolve(root, "memory/MEMORY.md")))) errors.push("memory/MEMORY.md is missing");
  const memoryEntries = (await readdir(resolve(root, "memory"), { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name !== "MEMORY.md");
  const handoffPattern = /^\d{4}-\d{2}-\d{2}-\d{4}-[a-z0-9-]+\.md$/;
  for (const entry of memoryEntries) if (entry.name.endsWith(".md") && !handoffPattern.test(entry.name)) errors.push(`invalid memory handoff filename: ${entry.name}`);

  for (const path of await walk(root)) {
    if (!TEXT_EXTENSIONS.has(extname(path))) continue;
    const relative = path.slice(root.length + 1);
    const text = await readFile(path, "utf8");
    for (const prefix of ["docs/research/", "docs/architecture/", "docs/planning/", "docs/validation/", "docs/intake/"]) {
      if (text.includes(`${prefix}${prefix}`)) errors.push(`${relative} contains duplicated documentation prefix ${prefix}${prefix}`);
    }
    if (relative === "scripts/organize-root-docs.mjs" || relative === "scripts/check-doc-system.mjs") continue;
    for (const filename of MOVED_ROOT_DOCUMENTS) if (staleReferencePattern(filename).test(text)) errors.push(`${relative} contains stale root document reference ${filename}`);
  }

  return [...new Set(errors)].sort();
}

export async function readAndValidateDocumentationSystem(rootPath) {
  const root = resolve(rootPath);
  return { root, errors: await validateDocumentationSystem(root) };
}

const invoked = process.argv[1] ? pathToFileURL(process.argv[1]).href : null;
if (invoked === import.meta.url) {
  const defaultRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
  const root = process.argv[2] ? resolve(process.argv[2]) : defaultRoot;
  const errors = await validateDocumentationSystem(root);
  if (errors.length > 0) {
    console.error(JSON.stringify({ status: "fail", errors }, null, 2));
    process.exitCode = 1;
  } else {
    const catalog = JSON.parse(await readFile(resolve(root, "docs/catalog.json"), "utf8"));
    console.log(JSON.stringify({
      status: "pass",
      rootMarkdown: REQUIRED_ROOT_MARKDOWN.length,
      catalogDocuments: catalog.documents.length,
      taskSurfaceWorkstream: "W7",
      requiredScalePages: 10000
    }));
  }
}
