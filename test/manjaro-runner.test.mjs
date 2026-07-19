import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import test from "node:test";

const runnerPath = "scripts/manjaro-clone-and-test-hyper.sh";
const branch = "agent/glm-blackwell-vertical-slice";
const repo = "benamtech/hyper-site";

test("official Manjaro runner has valid Bash syntax", () => {
  const result = spawnSync("bash", ["-n", runnerPath], {
    cwd: process.cwd(),
    encoding: "utf8",
  });

  assert.equal(
    result.status,
    0,
    `bash -n failed\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
  );
});

test("official Manjaro runner pins the live repository and branch URLs", async () => {
  const source = await readFile(runnerPath, "utf8");

  assert.match(source, new RegExp(repo.replace("/", "\\/")));
  assert.match(source, new RegExp(branch.replaceAll("/", "\\/")));
  assert.match(source, /git ls-remote --heads/);
  assert.match(source, /git clone/);
  assert.match(source, /run-compiler-limit-test-v2\.mjs/);
  assert.match(source, /npm ci --no-audit --no-fund/);
  assert.match(source, /npm run build/);
  assert.match(source, /npm test/);
  assert.match(source, /npm run test:validation/);
  assert.match(source, /sudo pacman -Syu --needed/);
  assert.match(source, /HYPER_INSTALL_DEPS/);
  assert.match(source, /clone-context\.json/);
});
