import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const targets = [
  {
    path: "README.md",
    marker: "Documentation lifecycle and research catalog: `docs/README.md`.",
    block: "## Documentation system\n\nDocumentation lifecycle and research catalog: `docs/README.md`. Machine-readable document authority: `docs/catalog.json`."
  },
  {
    path: "AGENTS.md",
    marker: "Documentation lifecycle: `docs/README.md`.",
    block: "## Documentation lifecycle\n\nDocumentation lifecycle: `docs/README.md`. Every research or architecture mutation must follow intake -> research -> architecture -> executable plan -> validation report -> immutable memory handoff."
  }
];

const changed = [];
for (const target of targets) {
  const path = resolve(root, target.path);
  let text = await readFile(path, "utf8");
  if (!text.includes(target.marker)) {
    text = `${text.trimEnd()}\n\n${target.block}\n`;
    await writeFile(path, text);
    changed.push(target.path);
  }
}

console.log(JSON.stringify({ status: "pass", updated: changed }, null, 2));
