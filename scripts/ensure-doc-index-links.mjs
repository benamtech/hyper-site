import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const targets = [
  {
    path: "README.md",
    requiredReference: "docs/README.md",
    block: "## Documentation system\n\nDocumentation lifecycle and machine-readable authority are in `docs/README.md` and `docs/catalog.json`."
  },
  {
    path: "AGENTS.md",
    requiredReference: "docs/README.md",
    block: "## Documentation lifecycle\n\nDocumentation lifecycle is defined in `docs/README.md`."
  }
];

const changed = [];
for (const target of targets) {
  const path = resolve(root, target.path);
  let text = await readFile(path, "utf8");
  if (!text.includes(target.requiredReference)) {
    text = `${text.trimEnd()}\n\n${target.block}\n`;
    await writeFile(path, text);
    changed.push(target.path);
  }
}

console.log(JSON.stringify({ status: "pass", purpose: "ensure bootstrap links only", updated: changed }, null, 2));
