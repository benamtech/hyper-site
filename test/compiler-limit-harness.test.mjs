import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

test("compiler limit harness verifies deterministic output and rejection matrix", async () => {
  const output = await mkdtemp(join(tmpdir(), "hyper-compiler-limit-"));
  try {
    const result = spawnSync(process.execPath, [
      "scripts/run-compiler-limit-test.mjs",
      "--pages", "8",
      "--seed", "test-seed-unique-001",
      "--output", output,
    ], {
      cwd: process.cwd(),
      encoding: "utf8",
    });

    assert.equal(result.status, 0, `stdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
    const report = JSON.parse(await readFile(join(output, "report.json"), "utf8"));
    assert.equal(report.passed, true);
    assert.equal(report.input.pages, 8);
    assert.equal(report.output.pageCount, 8);
    assert.ok(report.checks.length >= 9);
    assert.ok(report.checks.every((item) => item.ok));
    assert.equal(report.rejectionTests.length, 10);
    assert.ok(report.rejectionTests.every((item) => item.ok));
  } finally {
    await rm(output, { recursive: true, force: true });
  }
});
