import { mkdir, readFile, readdir, rename, stat, writeFile } from "node:fs/promises";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const manifestPath = resolve(root, process.argv[2] ?? "docs/legacy-root-moves.json");
const moves = JSON.parse(await readFile(manifestPath, "utf8"));
const ignored = new Set([".git", "node_modules", "dist", "coverage", ".cache"]);
const textExtensions = new Set([".md", ".json", ".mjs", ".ts", ".yml", ".yaml"]);
const self = resolve(root, "scripts/apply-doc-moves.mjs");

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
    if (entry.isDirectory() && ignored.has(entry.name)) continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) output.push(...await walk(path));
    else output.push(path);
  }
  return output;
}

const moved = [];
for (const [from, to] of Object.entries(moves)) {
  const source = resolve(root, from);
  const destination = resolve(root, to);
  const hasSource = await exists(source);
  const hasDestination = await exists(destination);
  if (hasSource && hasDestination) throw new Error(`move collision: ${from} -> ${to}`);
  if (hasSource) {
    await mkdir(dirname(destination), { recursive: true });
    await rename(source, destination);
    moved.push({ from, to });
  } else if (!hasDestination) {
    throw new Error(`missing source and destination: ${from}`);
  }
}

const rewritten = [];
for (const path of await walk(root)) {
  if (path === self || !textExtensions.has(extname(path))) continue;
  let text = await readFile(path, "utf8");
  const before = text;
  for (const [from, to] of Object.entries(moves)) text = text.split(from).join(to);
  if (text !== before) {
    await writeFile(path, text);
    rewritten.push(path.slice(root.length + 1));
  }
}

const catalogPath = resolve(root, "docs/catalog.json");
const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
function kind(path) {
  if (path.startsWith("docs/architecture/")) return "architecture";
  if (path.startsWith("docs/planning/")) return "planning";
  if (path.startsWith("docs/validation/")) return "validation-contract";
  if (path.startsWith("docs/research/")) return "research";
  if (path.startsWith("docs/intake/")) return "intake";
  return "bootstrap";
}
function slug(path) {
  return path.replace(/^docs\//, "").replace(/\.md$/, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
}
for (const [from, path] of Object.entries(moves)) {
  const item = {
    id: `legacy-${slug(path)}`,
    path,
    kind: kind(path),
    status: path.startsWith("docs/archive/") ? "archived" : "historical-foundation",
    authority: `historical repository document moved from ${from}`
  };
  const index = catalog.documents.findIndex((candidate) => candidate.id === item.id || candidate.path === path);
  if (index === -1) catalog.documents.push(item);
  else catalog.documents[index] = { ...catalog.documents[index], ...item };
}
catalog.documents.sort((left, right) => left.path.localeCompare(right.path));
await writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);

console.log(JSON.stringify({ status: "pass", moved, rewritten, catalogDocuments: catalog.documents.length }, null, 2));
