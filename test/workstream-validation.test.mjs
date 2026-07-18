import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';

const run = spawnSync(process.execPath, ['scripts/validate-workstreams.mjs', 'status'], { encoding: 'utf8' });
const report = JSON.parse(run.stdout);

test('current repository cannot falsely pass W1-W3', () => {
  assert.equal(run.status, 1);
  assert.equal(report.passed, false);
  assert.deepEqual(report.workstreams.map((w) => w.name), ['W1', 'W2', 'W3']);
});

test('W1 reports concrete physical-extraction blockers', () => {
  const w1 = report.workstreams.find((w) => w.name === 'W1');
  assert.ok(w1.failures.includes('inventory-covers-reference-src'));
  assert.ok(w1.failures.includes('hyper-site-owns-compiler-source'));
  assert.ok(w1.failures.includes('two-packed-consumers-pass'));
  assert.ok(w1.failures.includes('legacy-artifact-parity-intact'));
});

test('later workstreams remain blocked behind signed prior reports', () => {
  const w2 = report.workstreams.find((w) => w.name === 'W2');
  const w3 = report.workstreams.find((w) => w.name === 'W3');
  assert.ok(w2.failures.includes('W1-entry-gate'));
  assert.ok(w3.failures.includes('W2-entry-gate'));
});

test('validation vector space covers W1, W2, and W3 deeply', () => {
  const matrix = JSON.parse(fs.readFileSync('planning/workstream-validation-vector-space.json', 'utf8'));
  for (const name of ['W1', 'W2', 'W3']) {
    assert.ok(matrix.workstreams[name]);
    assert.ok(matrix.workstreams[name].failure_vectors.length >= 10);
    assert.ok(matrix.workstreams[name].exit.length >= 5);
  }
});
