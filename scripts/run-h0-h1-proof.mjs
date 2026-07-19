#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportDir = resolve(root, "validation/reports");
mkdirSync(reportDir, { recursive: true });
const startedAt = new Date().toISOString();

function run(id, command, args) {
  const start = performance.now();
  const result = spawnSync(command, args, { cwd: root, encoding: "utf8", env: process.env });
  return {
    id,
    command: [command, ...args].join(" "),
    passed: result.status === 0,
    status: result.status,
    durationMs: Number((performance.now() - start).toFixed(3)),
    stdoutTail: (result.stdout ?? "").split("\n").slice(-40).join("\n"),
    stderrTail: (result.stderr ?? "").split("\n").slice(-40).join("\n"),
  };
}

function walkTs(directory) {
  const absolute = resolve(root, directory);
  return readdirSync(absolute, { withFileTypes: true }).flatMap((entry) => {
    const relative = `${directory}/${entry.name}`;
    return entry.isDirectory() ? walkTs(relative) : entry.isFile() && entry.name.endsWith(".ts") ? [relative] : [];
  }).sort();
}

function resolveSourceCommit(checkoutCommit) {
  if (process.env.GITHUB_HEAD_SHA) return process.env.GITHUB_HEAD_SHA;
  if (process.env.GITHUB_EVENT_PATH) {
    try {
      const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"));
      if (typeof event?.pull_request?.head?.sha === "string") return event.pull_request.head.sha;
      if (typeof event?.after === "string") return event.after;
    } catch {
      // Local runs and malformed event payloads fall back to the checked-out commit.
    }
  }
  return checkoutCommit;
}

const commit = run("commit", "git", ["rev-parse", "HEAD"]);
const checkoutCommit = commit.stdoutTail.trim().split("\n").at(-1) ?? "unknown";
const sourceCommit = resolveSourceCommit(checkoutCommit);
const checks = [
  run("build-all", "npm", ["run", "build"]),
  run("hyper-site-tests", "npm", ["--prefix", "hyper-site", "test"]),
  run("legacy-tests", "npm", ["run", "legacy:test"]),
  run("packed-consumers", "npm", ["run", "test:packed-consumers"]),
  run("validation-tests", "npm", ["run", "test:validation"]),
  run("living-surface-mvp", "npm", ["run", "mvp:living-surface"]),
  run("compiler-limit-25", process.execPath, ["scripts/run-compiler-limit-test-v2.mjs", "--pages", "25", "--seed", `h0-h1-${sourceCommit.slice(0, 12)}`, "--output", "validation/reports/h0-h1-compiler-limit"]),
];

const indexText = readFileSync(resolve(root, "hyper-site/index.mjs"), "utf8");
const typedIndexText = readFileSync(resolve(root, "hyper-site/src/index.ts"), "utf8");
const referenceWrappers = ["framework-core.ts", "site-manifest.ts", "browser-targets.ts", "css-modern.ts"].map((name) => ({
  name,
  text: readFileSync(resolve(root, "reference/src", name), "utf8"),
}));
const implementationInventory = JSON.parse(readFileSync(resolve(root, "validation/reference-source-inventory.json"), "utf8"));
const declarationInventory = JSON.parse(readFileSync(resolve(root, "validation/reference-declaration-inventory.json"), "utf8"));
const inventories = [implementationInventory, declarationInventory];
const referenceFiles = walkTs("reference/src");
const inventoryRecords = inventories.flatMap((inventory) => Array.isArray(inventory.records) ? inventory.records : []);
const inventoryPaths = inventoryRecords.map((record) => record.path);
const inventoryMissing = referenceFiles.filter((path) => !inventoryPaths.includes(path));
const inventoryOrphans = inventoryPaths.filter((path) => !referenceFiles.includes(path));
const inventoryDuplicates = inventoryPaths.filter((path, index) => inventoryPaths.indexOf(path) !== index);
const inventoryIncomplete = inventoryRecords.filter((record) =>
  !["hyper-site", "hyper-content", "reference-only", "research-deferred"].includes(record.owner)
  || typeof record.role !== "string"
  || record.role.trim().length === 0
  || !Array.isArray(record.dependencies)
  || !Array.isArray(record.tests)
  || !Number.isInteger(record.migration_order));

const structural = {
  publicEntrypointUsesPackageDist: indexText.includes("./dist/index.js") && !indexText.includes("../reference") && !indexText.includes("reference/dist"),
  aggregateTypedEntrypointComplete: ["framework-core", "site-manifest", "browser-targets", "css-modern", "living-surface"].every((name) => typedIndexText.includes(`./${name}.js`)),
  referenceConsumesPackageDist: referenceWrappers.every((item) => item.text.includes("../../hyper-site/dist/")),
  packageOwnsCompilerSource: ["framework-core.ts", "site-manifest.ts", "browser-targets.ts", "css-modern.ts", "living-surface.ts", "index.ts"].every((name) => {
    try { return readFileSync(resolve(root, "hyper-site/src", name), "utf8").length > 100; } catch { return false; }
  }),
  inventoryStatusComplete: inventories.every((inventory) => inventory.status === "complete"),
  inventoryCoversReferenceSource: referenceFiles.length > 0 && inventoryMissing.length === 0 && inventoryOrphans.length === 0 && inventoryDuplicates.length === 0,
  inventoryRecordsComplete: inventoryRecords.length === referenceFiles.length && inventoryIncomplete.length === 0,
};

const h0Passed = checks.every((check) => check.passed);
const h1Passed = h0Passed && Object.values(structural).every(Boolean);
const report = {
  schemaVersion: 3,
  hypothesis: "H0 integration plus H1 compiler extraction with bounded H3 living-surface MVP",
  startedAt,
  completedAt: new Date().toISOString(),
  checkoutCommit,
  sourceCommit,
  environment: { node: process.version, platform: process.platform, arch: process.arch },
  h0: { passed: h0Passed, claim: "all current streams integrate and the clean-room proof executes" },
  h1: {
    passed: h1Passed,
    claim: "the public compiler cluster is package-owned without accepted artifact or rejection drift and every remaining reference source has one explicit owner",
    structural,
    inventory: {
      referenceFileCount: referenceFiles.length,
      recordCount: inventoryRecords.length,
      inventoryFiles: ["validation/reference-source-inventory.json", "validation/reference-declaration-inventory.json"],
      missing: inventoryMissing,
      orphans: inventoryOrphans,
      duplicates: inventoryDuplicates,
      incomplete: inventoryIncomplete.map((record) => record.path),
    },
  },
  h3Mvp: {
    passed: checks.find((check) => check.id === "living-surface-mvp")?.passed === true,
    claim: "typed public/operator living-surface projections compile to deterministic static HTML with explicit agency and governance decisions",
  },
  checks,
  nonclaims: [
    "This does not prove autonomous semantic generation quality.",
    "This does not prove remote runtime or browser-task safety.",
    "The continuous field is a deterministic presentation model; PDE, CSG, WebGPU, SDRT, GNN, GPU, Zig and Wasm advantages remain unproven.",
  ],
  decision: h1Passed ? "advance-to-H2-with-H3-mvp-substrate" : "repair-gate-failures-only",
};
writeFileSync(resolve(reportDir, "h0-h1-proof.json"), `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(resolve(reportDir, "h0-h1-proof.md"), `# H0/H1 measured proof\n\n- Source commit: \`${sourceCommit}\`\n- Checkout commit: \`${checkoutCommit}\`\n- H0: **${h0Passed ? "PASS" : "FAIL"}**\n- H1: **${h1Passed ? "PASS" : "FAIL"}**\n- Living-surface MVP: **${report.h3Mvp.passed ? "PASS" : "FAIL"}**\n- Decision: **${report.decision}**\n\n## Structural checks\n\n${Object.entries(structural).map(([key, value]) => `- ${value ? "PASS" : "FAIL"}: ${key}`).join("\n")}\n\n## Inventory\n\n- Reference source files: ${referenceFiles.length}\n- Inventory records: ${inventoryRecords.length}\n- Missing: ${inventoryMissing.length}\n- Orphans: ${inventoryOrphans.length}\n- Duplicates: ${inventoryDuplicates.length}\n- Incomplete: ${inventoryIncomplete.length}\n\n## Command checks\n\n${checks.map((check) => `- ${check.passed ? "PASS" : "FAIL"}: \`${check.command}\` (${check.durationMs} ms)`).join("\n")}\n\n## Nonclaims\n\n${report.nonclaims.map((item) => `- ${item}`).join("\n")}\n`);
console.log(JSON.stringify(report, null, 2));
process.exit(h1Passed ? 0 : 1);
