import { readFile, readdir, stat } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ALLOWED_KINDS = new Set(["bootstrap", "intake", "research", "architecture", "planning", "validation-contract", "validation-report", "memory-index", "memory-handoff"]);
const REQUIRED_ROOT_MARKDOWN = ["README.md", "AGENTS.md", "CODEGRAPH.md", "CONTRIBUTING.md", "identity.md"];
const REQUIRED_DOCUMENT_IDS = ["docs-system", "research-useful-framework", "architecture-useful-framework", "architecture-product-taxonomy", "planning-useful-framework", "validation-useful-framework", "memory-index"];
const REQUIRED_AUTHORITY_PATHS = [
  "docs/research/43-useful-framework-and-agent-first-pipeline-audit.md",
  "docs/architecture/44-useful-framework-and-agent-first-target-architecture.md",
  "docs/architecture/52-product-taxonomy-and-runtime-boundaries.md",
  "docs/planning/50-h0-h1-content-first-reinvention-program.md",
  "docs/validation/46-useful-framework-and-agent-first-gates.md",
];
const TEXT_EXTENSIONS = new Set([".md", ".json", ".mjs", ".ts", ".yml", ".yaml"]);
const IGNORED_DIRECTORIES = new Set([".git", "node_modules", "dist", "coverage", ".cache"]);

async function exists(path) { try { await stat(path); return true; } catch { return false; } }
async function walk(directory) {
  const output = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && IGNORED_DIRECTORIES.has(entry.name)) continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) output.push(...await walk(path)); else output.push(path);
  }
  return output;
}

export function validateCatalogShape(catalog) {
  const errors = [];
  if (!catalog || typeof catalog !== "object") return ["catalog must be an object"];
  if (typeof catalog.version !== "string" || !catalog.version.trim()) errors.push("catalog.version is required");
  if (!Array.isArray(catalog.rootAllowlist) || catalog.rootAllowlist.length === 0) errors.push("catalog.rootAllowlist must be non-empty");
  if (!Array.isArray(catalog.documents) || catalog.documents.length === 0) return [...errors, "catalog.documents must be non-empty"];
  const ids = new Set(); const paths = new Set();
  for (const [index, document] of catalog.documents.entries()) {
    const prefix = `catalog.documents[${index}]`;
    if (!document || typeof document !== "object") { errors.push(`${prefix} must be an object`); continue; }
    if (typeof document.id !== "string" || !document.id.trim()) errors.push(`${prefix}.id is required`); else if (ids.has(document.id)) errors.push(`${prefix}.id duplicates ${document.id}`); else ids.add(document.id);
    if (typeof document.path !== "string" || !document.path.trim()) errors.push(`${prefix}.path is required`); else if (paths.has(document.path)) errors.push(`${prefix}.path duplicates ${document.path}`); else paths.add(document.path);
    if (!ALLOWED_KINDS.has(document.kind)) errors.push(`${prefix}.kind ${document.kind ?? "<missing>"} is invalid`);
    if (typeof document.status !== "string" || !document.status.trim()) errors.push(`${prefix}.status is required`);
    if (typeof document.authority !== "string" || !document.authority.trim()) errors.push(`${prefix}.authority is required`);
  }
  for (const required of REQUIRED_DOCUMENT_IDS) if (!ids.has(required)) errors.push(`catalog missing required document id ${required}`);
  return errors;
}

function validateProductTaxonomy(path, text) {
  const errors = [];
  for (const required of ["Hyper Content", "Hyper Site", "Hyper Runtime", "AI Employee"]) if (!text.includes(required)) errors.push(`${path} does not mention canonical product term ${required}`);
  if (!text.includes("docs/architecture/52-product-taxonomy-and-runtime-boundaries.md") && path !== "docs/architecture/52-product-taxonomy-and-runtime-boundaries.md") errors.push(`${path} does not link the canonical product taxonomy`);
  for (const forbidden of [
    "Hyper Site is an AI Employee",
    "Hyper Site is the AI Employee",
    "Hyper Content is an AI Employee",
    "the website IS the employee",
  ]) if (text.includes(forbidden)) errors.push(`${path} contains forbidden collapsed-taxonomy claim: ${forbidden}`);
  return errors;
}

export async function validateDocumentationSystem(root) {
  const errors = [];
  let catalog;
  try { catalog = JSON.parse(await readFile(resolve(root, "docs/catalog.json"), "utf8")); }
  catch (error) { return [`cannot read docs/catalog.json: ${error instanceof Error ? error.message : String(error)}`]; }
  errors.push(...validateCatalogShape(catalog));

  const rootMarkdown = (await readdir(root, { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name.endsWith(".md")).map((entry) => entry.name).sort();
  const expectedRoot = [...REQUIRED_ROOT_MARKDOWN].sort();
  if (JSON.stringify(rootMarkdown) !== JSON.stringify(expectedRoot)) errors.push(`root Markdown must be exactly ${expectedRoot.join(", ")}; received ${rootMarkdown.join(", ")}`);
  const catalogRoot = [...(catalog.rootAllowlist ?? [])].sort();
  if (JSON.stringify(catalogRoot) !== JSON.stringify(expectedRoot)) errors.push("catalog.rootAllowlist does not match the root Markdown allowlist");

  for (const document of catalog.documents ?? []) if (typeof document?.path === "string" && !(await exists(resolve(root, document.path)))) errors.push(`catalog path does not exist: ${document.path}`);
  for (const path of REQUIRED_AUTHORITY_PATHS) if (!(await exists(resolve(root, path)))) errors.push(`current authority path is missing: ${path}`);

  let linkedBootstrapCount = 0;
  for (const path of ["README.md", "AGENTS.md", "CONTRIBUTING.md"]) if ((await readFile(resolve(root, path), "utf8")).includes("docs/README.md")) linkedBootstrapCount += 1;
  if (linkedBootstrapCount < 2) errors.push("at least two bootstrap documents must link to docs/README.md");

  const sourceRegistry = JSON.parse(await readFile(resolve(root, "docs/research/sources/2026-07-18-framework-agent-architecture.sources.json"), "utf8"));
  if (!Array.isArray(sourceRegistry.sources) || sourceRegistry.sources.length < 5) errors.push("useful-framework source registry requires at least five official or primary sources");
  const sourceIds = new Set();
  for (const source of sourceRegistry.sources ?? []) {
    if (!source?.id) errors.push("source registry contains source without id"); else if (sourceIds.has(source.id)) errors.push(`source registry duplicates id ${source.id}`); else sourceIds.add(source.id);
    if (!source?.type || !source?.url || !Array.isArray(source?.supports)) errors.push(`source ${source?.id ?? "<missing>"} requires type, url and supports`);
  }

  const readme = await readFile(resolve(root, "README.md"), "utf8");
  const agents = await readFile(resolve(root, "AGENTS.md"), "utf8");
  const codegraph = await readFile(resolve(root, "CODEGRAPH.md"), "utf8");
  const docsReadme = await readFile(resolve(root, "docs/README.md"), "utf8");
  const memory = await readFile(resolve(root, "memory/MEMORY.md"), "utf8");
  const hyperSiteReadme = await readFile(resolve(root, "hyper-site/README.md"), "utf8");
  const hyperContentReadme = await readFile(resolve(root, "hyper-content/README.md"), "utf8");
  const taxonomy = await readFile(resolve(root, "docs/architecture/52-product-taxonomy-and-runtime-boundaries.md"), "utf8");

  for (const [path, text] of [["README.md", readme], ["memory/MEMORY.md", memory]]) {
    for (const required of ["H0", "H1", "H2", "H3", "H4", "H5", "H6"]) if (!text.includes(required)) errors.push(`${path} does not mention active hypothesis ${required}`);
    if (!text.includes("docs/planning/50-h0-h1-content-first-reinvention-program.md")) errors.push(`${path} does not link the active H0-H6 program`);
  }

  for (const [path, text] of [
    ["README.md", readme],
    ["AGENTS.md", agents],
    ["CODEGRAPH.md", codegraph],
    ["docs/README.md", docsReadme],
    ["memory/MEMORY.md", memory],
    ["hyper-site/README.md", hyperSiteReadme],
    ["hyper-content/README.md", hyperContentReadme],
    ["docs/architecture/52-product-taxonomy-and-runtime-boundaries.md", taxonomy],
  ]) errors.push(...validateProductTaxonomy(path, text));

  if (!taxonomy.includes("AI Employee") || !taxonomy.includes("product assembled")) errors.push("canonical taxonomy must define AI Employee as a composed product");
  if (!taxonomy.includes("transitional physical placement") && !taxonomy.includes("transitional physical")) errors.push("canonical taxonomy must document transitional runtime placement");
  if (!hyperSiteReadme.includes("does not own") || !hyperSiteReadme.includes("connector")) errors.push("Hyper Site README must deny connector/effect ownership");
  if (!hyperContentReadme.includes("Transitional runtime exports")) errors.push("Hyper Content README must label runtime exports as transitional");

  const currentPlan = await readFile(resolve(root, "docs/planning/50-h0-h1-content-first-reinvention-program.md"), "utf8");
  if (!currentPlan.includes("npm run proof:h0-h1")) errors.push("current plan must define the canonical H0/H1 proof command");
  if (!currentPlan.includes("repair-gate-failures-only")) errors.push("current plan must define repair-only behavior after H0/H1 failure");
  if (!currentPlan.includes("autonomous generation") || !currentPlan.includes("self-aware generative UI")) errors.push("current plan must preserve the content-first autonomous and GenUI end-state");

  const memoryEntries = (await readdir(resolve(root, "memory"), { withFileTypes: true })).filter((entry) => entry.isFile() && entry.name !== "MEMORY.md");
  const handoffPattern = /^\d{4}-\d{2}-\d{2}-\d{4}-[a-z0-9-]+\.md$/;
  for (const entry of memoryEntries) if (entry.name.endsWith(".md") && !handoffPattern.test(entry.name)) errors.push(`invalid memory handoff filename: ${entry.name}`);

  for (const path of await walk(root)) {
    if (!TEXT_EXTENSIONS.has(extname(path))) continue;
    const relative = path.slice(root.length + 1); const text = await readFile(path, "utf8");
    for (const prefix of ["docs/research/", "docs/architecture/", "docs/planning/", "docs/validation/", "docs/intake/"]) if (text.includes(`${prefix}${prefix}`)) errors.push(`${relative} contains duplicated documentation prefix ${prefix}${prefix}`);
  }
  return [...new Set(errors)].sort();
}

export async function readAndValidateDocumentationSystem(rootPath) { const root = resolve(rootPath); return { root, errors: await validateDocumentationSystem(root) }; }
const invoked = process.argv[1] ? pathToFileURL(process.argv[1]).href : null;
if (invoked === import.meta.url) {
  const root = process.argv[2] ? resolve(process.argv[2]) : resolve(fileURLToPath(new URL("..", import.meta.url)));
  const errors = await validateDocumentationSystem(root);
  if (errors.length > 0) { console.error(JSON.stringify({ status: "fail", errors }, null, 2)); process.exitCode = 1; }
  else {
    const catalog = JSON.parse(await readFile(resolve(root, "docs/catalog.json"), "utf8"));
    console.log(JSON.stringify({ status: "pass", rootMarkdown: REQUIRED_ROOT_MARKDOWN.length, catalogDocuments: catalog.documents.length, currentGate: "product-taxonomy", activeSequence: ["H0", "H1", "H2", "H3", "H4", "H5", "H6"] }));
  }
}
