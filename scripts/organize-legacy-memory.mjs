import { mkdir, readFile, readdir, rename, stat, writeFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const moves = {
  "memory/2026-07-17-agent-ontology-10k-site-program.md": "memory/legacy/2026-07-17-agent-ontology-10k-site-program.md",
  "memory/2026-07-17-ui-metaprogramming-pass-1.md": "memory/legacy/2026-07-17-ui-metaprogramming-pass-1.md",
  "memory/2026-07-17-unified-vector-space-ui-readiness.md": "memory/legacy/2026-07-17-unified-vector-space-ui-readiness.md"
};
const ignored = new Set([".git", "node_modules", "dist", "coverage", ".cache"]);
const extensions = new Set([".md", ".json", ".mjs", ".ts", ".yml", ".yaml"]);
const self = resolve(root, "scripts/organize-legacy-memory.mjs");

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
  if (hasSource && hasDestination) throw new Error(`memory move collision: ${from} -> ${to}`);
  if (hasSource) {
    await mkdir(resolve(root, "memory/legacy"), { recursive: true });
    await rename(source, destination);
    moved.push({ from, to });
  } else if (!hasDestination) {
    throw new Error(`missing memory source and destination: ${from}`);
  }
}

const rewritten = [];
for (const path of await walk(root)) {
  if (path === self || !extensions.has(extname(path))) continue;
  let text = await readFile(path, "utf8");
  const before = text;
  for (const [from, to] of Object.entries(moves)) text = text.split(from).join(to);
  if (text !== before) {
    await writeFile(path, text);
    rewritten.push(path.slice(root.length + 1));
  }
}

console.log(JSON.stringify({ status: "pass", moved, rewritten }, null, 2));
