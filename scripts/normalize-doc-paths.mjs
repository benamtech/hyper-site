import { readFile, readdir, writeFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const ignoredDirectories = new Set([".git", "node_modules", "dist", "coverage", ".cache"]);
const extensions = new Set([".md", ".json", ".mjs", ".ts", ".yml", ".yaml"]);
const selfPath = resolve(root, "scripts/normalize-doc-paths.mjs");

// Keep the most specific prefixes first. The root-document migration rewrites legacy
// basenames inside already-canonical paths, so the post-pass must collapse any repeated
// canonical directory prefix and make the complete workflow idempotent.
const prefixes = [
  "docs/research/experiments/",
  "docs/research/sources/",
  "docs/research/",
  "docs/architecture/",
  "docs/planning/",
  "docs/validation/",
  "docs/intake/"
];

async function walk(directory) {
  const output = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) output.push(...await walk(path));
    else output.push(path);
  }
  return output;
}

const changed = [];
for (const path of await walk(root)) {
  if (path === selfPath || !extensions.has(extname(path))) continue;
  let text = await readFile(path, "utf8");
  const before = text;
  for (const prefix of prefixes) {
    const duplicated = `${prefix}${prefix}`;
    while (text.includes(duplicated)) text = text.split(duplicated).join(prefix);
  }
  if (text !== before) {
    await writeFile(path, text);
    changed.push(path.slice(root.length + 1));
  }
}

console.log(JSON.stringify({ status: "pass", normalized: changed }, null, 2));
