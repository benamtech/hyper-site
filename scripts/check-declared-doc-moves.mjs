import { readFile, readdir, stat } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const moves = JSON.parse(await readFile(resolve(root, "docs/legacy-root-moves.json"), "utf8"));
const ignored = new Set([".git", "node_modules", "dist", "coverage", ".cache"]);
const extensions = new Set([".md", ".json", ".mjs", ".ts", ".yml", ".yaml"]);

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

const errors = [];
for (const [from, to] of Object.entries(moves)) {
  if (await exists(resolve(root, from))) errors.push(`legacy root source still exists: ${from}`);
  if (!(await exists(resolve(root, to)))) errors.push(`declared destination is missing: ${to}`);
}

for (const path of await walk(root)) {
  if (!extensions.has(extname(path))) continue;
  const relative = path.slice(root.length + 1);
  if (["scripts/apply-doc-moves.mjs", "scripts/check-declared-doc-moves.mjs", "docs/legacy-root-moves.json"].includes(relative)) continue;
  const text = await readFile(path, "utf8");
  for (const from of Object.keys(moves)) {
    const pattern = new RegExp(`(^|[\\s('"\\x60])${from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?=$|[\\s)'"\\x60,:])`, "m");
    if (pattern.test(text)) errors.push(`${relative} contains stale legacy-root reference ${from}`);
  }
}

if (errors.length > 0) {
  console.error(JSON.stringify({ status: "fail", errors: [...new Set(errors)].sort() }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ status: "pass", declaredMoves: Object.keys(moves).length }));
}
