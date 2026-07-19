import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const mode = process.argv[2] || 'status';
const outIndex = process.argv.indexOf('--out');
const out = outIndex >= 0 ? process.argv[outIndex + 1] : null;

const join = (p) => path.join(root, p);
const exists = (p) => fs.existsSync(join(p));
const json = (p) => { try { return JSON.parse(fs.readFileSync(join(p), 'utf8')); } catch { return null; } };
function walk(rel) {
  if (!exists(rel)) return [];
  return fs.readdirSync(join(rel), { withFileTypes: true }).flatMap((e) => {
    const p = `${rel}/${e.name}`;
    return e.isDirectory() ? walk(p) : e.isFile() ? [p] : [];
  }).sort();
}
function importEdges(rel) {
  const pattern = /(?:\.\.\/reference|reference\/(?:src|dist))/;
  return walk(rel).filter((p) => /\.(?:[cm]?js|ts)$/.test(p) && pattern.test(fs.readFileSync(join(p), 'utf8')));
}
const check = (id, ok, evidence) => ({ id, ok: Boolean(ok), evidence });
const finish = (name, checks) => ({ name, passed: checks.every((c) => c.ok), checks, failures: checks.filter((c) => !c.ok).map((c) => c.id) });

function w1() {
  const files = walk('reference/src');
  const inventory = json('validation/reference-source-inventory.json') || { records: [] };
  const records = Array.isArray(inventory.records) ? inventory.records : [];
  const paths = records.map((r) => r.path).filter(Boolean);
  const missing = files.filter((p) => !paths.includes(p));
  const duplicates = paths.filter((p, i) => paths.indexOf(p) !== i);
  const orphan = paths.filter((p) => !files.includes(p));
  const incomplete = records.filter((r) => !r.owner || !r.role || !Array.isArray(r.dependencies) || !Array.isArray(r.tests) || !Number.isInteger(r.migration_order));
  const consumers = json('validation/evidence/w1-packed-consumers.json');
  const parity = json('validation/evidence/w1-artifact-parity.json');
  const referenceConsumer = json('validation/evidence/w1-reference-consumer.json');
  return finish('W1', [
    check('inventory-covers-reference-src', files.length > 0 && missing.length === 0, { count: files.length, missing }),
    check('inventory-has-single-owner', duplicates.length === 0, { duplicates }),
    check('inventory-has-no-orphans', orphan.length === 0, { orphan }),
    check('inventory-records-are-complete', incomplete.length === 0 && records.length === files.length, { incomplete: incomplete.length }),
    check('hyper-site-owns-compiler-source', exists('hyper-site/src/framework-core.ts') || exists('hyper-site/src/framework-core.js'), {}),
    check('hyper-site-has-no-reference-runtime-edge', importEdges('hyper-site').length === 0, { files: importEdges('hyper-site') }),
    check('hyper-content-owns-stable-source', walk('hyper-content/src').length > 0, { files: walk('hyper-content/src') }),
    check('hyper-content-has-no-reference-runtime-edge', importEdges('hyper-content').length === 0, { files: importEdges('hyper-content') }),
    check('reference-is-consumer', referenceConsumer?.passed === true, { report: referenceConsumer }),
    check('two-packed-consumers-pass', consumers?.passed === true && consumers?.consumer_count === 2, { report: consumers }),
    check('legacy-artifact-parity-intact', parity?.passed === true && parity?.failures === 0, { report: parity })
  ]);
}
function signed(name) {
  const r = json(`validation/evidence/${name}-gate-report.json`);
  return r?.passed === true && typeof r.commit === 'string' && r.commit.length >= 7;
}
function w2(prior) {
  const e = json('validation/evidence/w2-five-page-proof.json');
  return finish('W2', [
    check('W1-entry-gate', prior.passed && signed('w1'), { live: prior.passed, signed: signed('w1') }),
    check('clean-package-consumer', e?.clean_package_consumer === true, e),
    check('five-distinct-pages', e?.five_pages_rendered === 5 && e?.distinct_page_purposes === 5, e),
    check('dev-build-preview-inspect', ['dev','build','preview','inspect'].every((k) => e?.commands?.[k]?.passed === true), e),
    check('deterministic-output', e?.deterministic_rebuild_hash_match === true, e),
    check('direct-control-equivalent', e?.ordinary_static_fixture_equivalent === true, e),
    check('critical-accessibility-findings-zero', e?.critical_accessibility_findings === 0, e),
    check('operator-time-and-cost-recorded', Number.isFinite(e?.operator_minutes) && Number.isFinite(e?.cost_usd), e)
  ]);
}
function w3(prior) {
  const e = json('validation/evidence/w3-maintenance-proof.json');
  const names = ['shared_fact','page_fact','shared_design','retirement','invalid_change'];
  return finish('W3', [
    check('W2-entry-gate', prior.passed && signed('w2'), { live: prior.passed, signed: signed('w2') }),
    check('five-scenarios-measured', names.every((n) => e?.scenarios?.[n]?.measured === true), e),
    check('expected-sets-frozen', names.every((n) => typeof e?.scenarios?.[n]?.expected_set_hash === 'string'), e),
    check('unexpected-changed-pages-zero', e?.unexpected_changed_pages === 0, e),
    check('invalid-change-rejected-atomically', e?.scenarios?.invalid_change?.rejected === true && e?.scenarios?.invalid_change?.prior_manifest_unchanged === true, e),
    check('control-comparison-complete', e?.control_comparison_complete === true, e),
    check('business-decision-recorded', ['advance','narrow','stop'].includes(e?.decision) && typeof e?.decision_rationale === 'string', e),
    check('advantage-invariant-or-stop', e?.maintenance_advantage === true || e?.required_invariant_identified === true || ['narrow','stop'].includes(e?.decision), e)
  ]);
}

const a = w1();
const b = w2(a);
const c = w3(b);
const workstreams = mode === 'w1' ? [a] : mode === 'w2' ? [a,b] : [a,b,c];
const report = { schema: 'hyper-workstream-validation/v1', generated_at: new Date().toISOString(), mode, passed: workstreams.every((w) => w.passed), workstreams };
const text = JSON.stringify(report, null, 2) + '\n';
if (out) { fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true }); fs.writeFileSync(path.resolve(out), text); }
console.log(text);
process.exitCode = report.passed ? 0 : 1;
