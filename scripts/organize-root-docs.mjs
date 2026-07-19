import { mkdir, readFile, readdir, rename, stat, unlink, writeFile } from "node:fs/promises";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));

const moves = {
  "24-agent-discovered-ontology-and-10k-site-program.md": "docs/research/24-agent-discovered-ontology-and-10k-site-program.md",
  "25-academic-crosswalk-agent-harness-structured-generation-and-acceleration.md": "docs/research/25-academic-crosswalk-agent-harness-structured-generation-and-acceleration.md",
  "26-graph-learning-paper-triage-and-promotion-gates.md": "docs/research/26-graph-learning-paper-triage-and-promotion-gates.md",
  "27-near-alpha-framework-validation-and-continuous-agent-workspace.md": "docs/validation/27-near-alpha-framework-validation-and-continuous-agent-workspace.md",
  "28-agent-first-web-framework-and-llm-backend.md": "docs/architecture/28-agent-first-web-framework-and-llm-backend.md",
  "29-product-boundary-research-and-root-folder-split.md": "docs/architecture/29-product-boundary-research-and-root-folder-split.md",
  "30-meta-plan-v3-executable-program.md": "docs/planning/30-meta-plan-v3-executable-program.md"
};

const ignoredDirectories = new Set([".git", "node_modules", "dist", "coverage", ".cache"]);
const rewriteExtensions = new Set([".md", ".json", ".mjs", ".ts", ".yml", ".yaml"]);
const selfPath = resolve(root, "scripts/organize-root-docs.mjs");

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function moveDocuments() {
  const results = [];
  for (const [from, to] of Object.entries(moves)) {
    const source = resolve(root, from);
    const destination = resolve(root, to);
    const sourceExists = await exists(source);
    const destinationExists = await exists(destination);

    if (sourceExists && destinationExists) {
      const [left, right] = await Promise.all([readFile(source, "utf8"), readFile(destination, "utf8")]);
      if (left !== right) throw new Error(`document move collision: ${from} -> ${to}`);
      await unlink(source);
      results.push({ from, to, action: "removed-duplicate-source" });
    } else if (sourceExists) {
      await mkdir(dirname(destination), { recursive: true });
      await rename(source, destination);
      results.push({ from, to, action: "moved" });
    } else if (!destinationExists) {
      throw new Error(`missing document at both old and new path: ${from}`);
    }
  }
  return results;
}

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

async function rewriteReferences() {
  const changed = [];
  for (const path of await walk(root)) {
    if (path === selfPath || !rewriteExtensions.has(extname(path))) continue;
    let text = await readFile(path, "utf8");
    const before = text;
    for (const [from, to] of Object.entries(moves)) text = text.split(from).join(to);
    if (text !== before) {
      await writeFile(path, text);
      changed.push(path.slice(root.length + 1));
    }
  }
  return changed;
}

const moved = await moveDocuments();
const rewritten = await rewriteReferences();

console.log(JSON.stringify({
  status: "pass",
  purpose: "organize root documents and repair moved-document references only",
  roadmapMutation: false,
  moved,
  rewritten
}, null, 2));
