#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
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

const commit = run("commit", "git", ["rev-parse", "HEAD"]);
const exactCommit = commit.stdoutTail.trim().split("\n").at(-1) ?? "unknown";
const checks = [
  run("build-all", "npm", ["run", "build"]),
  run("legacy-tests", "npm", ["run", "legacy:test"]),
  run("packed-consumers", "npm", ["run", "test:packed-consumers"]),
  run("validation-tests", "npm", ["run", "test:validation"]),
  run("compiler-limit-25", process.execPath, ["scripts/run-compiler-limit-test-v2.mjs", "--pages", "25", "--seed", `h0-h1-${exactCommit.slice(0, 12)}`, "--output", "validation/reports/h0-h1-compiler-limit"]),
];

const indexText = readFileSync(resolve(root, "hyper-site/index.mjs"), "utf8");
const referenceWrappers = ["framework-core.ts", "site-manifest.ts", "browser-targets.ts", "css-modern.ts"].map((name) => ({
  name,
  text: readFileSync(resolve(root, "reference/src", name), "utf8"),
}));
const structural = {
  publicEntrypointUsesPackageDist: indexText.includes("./dist/framework-core.js") && !indexText.includes("../reference"),
  referenceConsumesPackageDist: referenceWrappers.every((item) => item.text.includes("../../hyper-site/dist/")),
  packageOwnsCompilerSource: ["framework-core.ts", "site-manifest.ts", "browser-targets.ts", "css-modern.ts"].every((name) => {
    try { return readFileSync(resolve(root, "hyper-site/src", name), "utf8").length > 100; } catch { return false; }
  }),
};

const h0Passed = checks.every((check) => check.passed);
const h1Passed = h0Passed && Object.values(structural).every(Boolean);
const report = {
  schemaVersion: 1,
  hypothesis: "H0 integration plus H1 compiler extraction",
  startedAt,
  completedAt: new Date().toISOString(),
  commit: exactCommit,
  environment: { node: process.version, platform: process.platform, arch: process.arch },
  h0: { passed: h0Passed, claim: "all current streams integrate and the clean-room proof executes" },
  h1: { passed: h1Passed, claim: "the public compiler cluster is package-owned without accepted artifact or rejection drift", structural },
  checks,
  nonclaims: [
    "This does not prove a complete external create/dev/preview workflow.",
    "This does not prove autonomous generation, remote runtime, GenUI, SDRT, GNN, GPU, Zig, or Wasm value.",
    "Those remain first-class end-state hypotheses with independent promotion gates.",
  ],
  decision: h1Passed ? "advance-to-H2" : "repair-gate-failures-only",
};
writeFileSync(resolve(reportDir, "h0-h1-proof.json"), `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(resolve(reportDir, "h0-h1-proof.md"), `# H0/H1 measured proof\n\n- Commit: \`${exactCommit}\`\n- H0: **${h0Passed ? "PASS" : "FAIL"}**\n- H1: **${h1Passed ? "PASS" : "FAIL"}**\n- Decision: **${report.decision}**\n\n## Structural checks\n\n${Object.entries(structural).map(([key, value]) => `- ${value ? "PASS" : "FAIL"}: ${key}`).join("\n")}\n\n## Command checks\n\n${checks.map((check) => `- ${check.passed ? "PASS" : "FAIL"}: \`${check.command}\` (${check.durationMs} ms)`).join("\n")}\n\n## Nonclaims\n\n${report.nonclaims.map((item) => `- ${item}`).join("\n")}\n`);
console.log(JSON.stringify(report, null, 2));
process.exit(h1Passed ? 0 : 1);
