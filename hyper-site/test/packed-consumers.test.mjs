import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const packageDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function run(command, args, options = {}) {
  return execFileSync(command, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], ...options });
}

function packPackage(root) {
  const output = JSON.parse(run("npm", ["pack", "--json", "--pack-destination", root], { cwd: packageDir }));
  assert.equal(output.length, 1);
  const record = output[0];
  const paths = record.files.map((file) => file.path);
  assert(paths.includes("index.mjs"));
  assert(paths.includes("dist/framework-core.js"));
  assert(paths.includes("dist/framework-core.d.ts"));
  assert(paths.every((path) => !path.includes("reference/")), "tarball must not contain reference runtime files");
  return join(root, record.filename);
}

function installConsumer(root, name, tarball, source) {
  const dir = join(root, name);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "package.json"), JSON.stringify({ name, private: true, type: "module" }, null, 2));
  run("npm", ["install", "--no-audit", "--no-fund", tarball], { cwd: dir });
  writeFileSync(join(dir, "test.mjs"), source);
  return run(process.execPath, ["test.mjs"], { cwd: dir });
}

const validSource = `
import assert from "node:assert/strict";
import { compileSite } from "@amtech/hyper-site";
const source = {
  baseUrl: "https://clean-room.example",
  evidence: [{ id: "e1", level: 4, summary: "approved" }],
  claims: [{ id: "c1", text: "Supported claim", evidenceIds: ["e1"], requiredLevel: 3 }],
  informationObjects: [],
  modules: [{ id: "m1", kind: "hero", layoutRole: "lead", heading: "Clean room", claimIds: ["c1"], informationObjectIds: [], requiredCapabilities: ["semantic-hierarchy"], sourceIds: ["e1"] }],
  pages: [{ id: "home", route: "/", canonicalQuestion: "Does the packed package compile?", title: "Packed Hyper Site", description: "Clean-room package proof", moduleIds: ["m1"], internalPageIds: [], requiredCapabilities: ["responsive-grid"], instructionPointers: ["/instructions.md"], indexable: true }]
};
const first = compileSite(source);
const second = compileSite(structuredClone(source));
assert.equal(first.buildHash, second.buildHash);
assert.equal(first.pages.length, 1);
assert.match(first.pages[0].html, /Packed Hyper Site/);
assert.match(first.sitemapXml, /https:\/\/clean-room\.example\//);
assert.deepEqual(first.dependencyIndex.get("e1"), ["home"]);
console.log(JSON.stringify({ passed: true, buildHash: first.buildHash, pageHash: first.pages[0].sha256 }));
`;

const invalidSource = `
import assert from "node:assert/strict";
import { compileSite } from "@amtech/hyper-site";
const source = {
  baseUrl: "https://clean-room.example",
  evidence: [{ id: "e1", level: 1, summary: "insufficient" }],
  claims: [{ id: "c1", text: "Unsupported claim", evidenceIds: ["e1"], requiredLevel: 4 }],
  informationObjects: [],
  modules: [{ id: "m1", kind: "hero", layoutRole: "lead", claimIds: ["c1"], informationObjectIds: [], requiredCapabilities: [], sourceIds: [] }],
  pages: [{ id: "home", route: "/", canonicalQuestion: "Should this fail?", title: "Invalid", description: "Invalid fixture", moduleIds: ["m1"], internalPageIds: [], requiredCapabilities: [], indexable: false }]
};
assert.throws(() => compileSite(source), /claim c1 exceeds evidence e1/);
console.log(JSON.stringify({ passed: true, rejected: "under-supported claim" }));
`;

test("npm pack installs into two isolated consumers without reference access", () => {
  const root = mkdtempSync(join(tmpdir(), "hyper-site-packed-"));
  try {
    const tarball = packPackage(root);
    const valid = JSON.parse(installConsumer(root, "valid-consumer", tarball, validSource));
    const invalid = JSON.parse(installConsumer(root, "invalid-consumer", tarball, invalidSource));
    assert.equal(valid.passed, true);
    assert.equal(invalid.passed, true);
    assert.equal(invalid.rejected, "under-supported claim");
    assert.equal(readFileSync(join(root, "valid-consumer", "node_modules", "@amtech", "hyper-site", "index.mjs"), "utf8").includes("reference"), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
