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

function upsertById(items, item) {
  const index = items.findIndex((candidate) => candidate.id === item.id);
  if (index === -1) items.push(item);
  else items[index] = { ...items[index], ...item };
}

function upsertTechnology(items, technology) {
  const index = items.findIndex((candidate) => candidate.technology === technology.technology);
  if (index === -1) items.push(technology);
  else items[index] = { ...items[index], ...technology };
}

function metric(metric, comparator, threshold, evidence) {
  return { metric, comparator, threshold, evidence };
}

async function mutatePlan() {
  const planPath = resolve(root, "planning/meta-plan-v3.json");
  const stepsPath = resolve(root, "planning/meta-plan-v3.steps.json");
  const plan = JSON.parse(await readFile(planPath, "utf8"));
  const steps = JSON.parse(await readFile(stepsPath, "utf8"));

  plan.scope = [...new Set([...(plan.scope ?? []), "governed_task_surfaces", "10k_surface_scale"] )];
  plan.constraints = [...new Set([...(plan.constraints ?? []), "zero_ui_logic_in_content_pipeline", "public_projection_only", "10k_surface_scale_required"] )];

  upsertById(plan.workstreams, {
    id: "W7",
    name: "task-surface-platform",
    intent: "protocol-neutral task services, public projections, theme/site/growth contracts and adapters",
    product: "shared-surface"
  });

  const technologies = [
    ["JSON_Schema_2020_12", "canonical structural input/output validation and schema references", "canonical initial surface schema"],
    ["A2UI", "declarative component-intent adapter", "comparison adapter after internal ABI passes"],
    ["AG-UI", "bidirectional event, snapshot, delta, interrupt and resume adapter", "comparison adapter after internal ABI passes"],
    ["MCP_Apps", "sandboxed open-ended application adapter", "comparison adapter after sandbox and CSP gates"],
    ["CloudEvents", "event identity and duplicate-recognition baseline", "adopt compatible identity semantics before literal wire conformance"],
    ["OpenFeature", "growth experiment evaluation adapter", "activate only behind immutable policy and audit contracts"],
    ["OpenTelemetry", "surface traces, metrics, logs and cost telemetry", "canonical W4 observability integration"],
    ["RDF_1_2_SHACL_PROV", "meta-relation, graph-validation and provenance comparison", "W5 interoperability research only"],
    ["relationship_projection_notation", "compact entity/relation/meta-relation research representation", "rename and promote only after held-out gain over typed JSON and graph baselines"]
  ];
  for (const [technology, role, activation] of technologies) {
    upsertTechnology(plan.techPlacements, {
      technology,
      owner: technology === "OpenTelemetry" ? "W4" : technology === "OpenFeature" ? "W6" : technology === "RDF_1_2_SHACL_PROV" || technology === "relationship_projection_notation" ? "W5" : "W7",
      state: "preserved",
      role,
      activation
    });
  }

  upsertById(plan.researchHypotheses, {
    id: "H5",
    claim: "One protocol-neutral task-surface ABI can map to A2UI, AG-UI, MCP Apps and the AMTECH AI Employee fixture without widening capabilities or losing required semantics",
    status: "unverified_interoperability_hypothesis",
    test: "Freeze one service fixture and measure field, lifecycle, action, receipt, recovery and privacy parity across adapters.",
    pass: "All required semantics round-trip; private projection leaks and capability widening are zero; documented adapter-specific loss is noncritical.",
    fail: "Keep adapters separate, narrow the common ABI, or reject the incompatible adapter."
  });
  upsertById(plan.researchHypotheses, {
    id: "H6",
    claim: "A compact relationship-projection notation improves semantic extraction or validation over typed JSON and graph/event baselines",
    status: "unverified_representation_hypothesis",
    test: "Rename the format and compare canonical parsing, bytes, tokens, schema evolution, provenance, replay, model extraction and policy failures on frozen fixtures.",
    pass: "Material preregistered gain without interoperability, safety or maintenance regression.",
    fail: "Preserve as noncanonical research and use established typed formats."
  });

  upsertById(plan.planOutcomes, {
    id: "O5",
    outcome: "governed_task_surfaces",
    metrics: [
      metric("surface_reverse_dependencies", "==", 0),
      metric("public_private_projection_leaks", "==", 0),
      metric("duplicate_irreversible_effects_per_intent", "<=", 1),
      metric("successful_effects_without_receipt", "==", 0),
      metric("static_fallback_completeness", "==", 1),
      metric("critical_accessibility_findings", "==", 0),
      metric("per_page_generated_runtime_bundle_bytes", "==", 0),
      metric("task_artifact_cost_latency_conversion_measured", "==", 1)
    ]
  });

  const byId = new Map(steps.map((step) => [step.id, step]));
  const p14 = byId.get("P1.4");
  p14.action = "Move clean W1 source into hyper-site/src, classify mixed UI modules, and make reference consume the workspace package";
  p14.passMetrics = [
    metric("hyper_site_runtime_reference_imports", "==", 0, "boundary script"),
    metric("single_PageIR_authority", "==", 1, "symbol audit"),
    metric("single_renderer_authority", "==", 1, "symbol audit"),
    metric("mixed_UI_imports_in_W1", "==", 0, "source audit"),
    metric("published_tarball_fixture_success", "==", 1, "consumer test")
  ];
  p14.effects.unblocks = [...new Set([...(p14.effects.unblocks ?? []).filter((id) => id !== "P2.1"), "P1.6"] )];
  p14.testsFirst = ["workspace package build", "reference consumer test", "published tarball smoke test", "UI ownership classification test", "legacy artifact parity"];

  const p15 = byId.get("P1.5");
  p15.effects.unblocks = [...new Set([...(p15.effects.unblocks ?? []), "P1.6"] )];
  p15.passMetrics = [
    metric("hyper_site_vector_exports", "==", 0, "package API test"),
    metric("hyper_site_current_wasm_exports", "==", 0, "package API test"),
    metric("W1_ui_vector_fields", "==", 0, "source audit"),
    metric("content_packed_ir_regressions", "==", 0, "reference suite")
  ];
  p15.testsFirst = ["packed IR deterministic test", "Wasm scalar parity test", "hyper-site export leak test", "content-neutral UI plan test"];

  upsertById(steps, {
    id: "P1.6",
    phase: "P1",
    workstream: "W7",
    action: "Freeze protocol-neutral task-service, surface-plan, public-projection, intent, event, receipt, theme and growth-policy contracts",
    dependencies: ["P1.4", "P1.5"],
    passMetrics: [
      metric("external_protocol_types_in_core_ABI", "==", 0, "API audit"),
      metric("private_fixture_fields_in_projection", "==", 0, "projection test"),
      metric("unknown_components_accepted", "==", 0, "schema test"),
      metric("duplicate_effects_per_intent", "<=", 1, "idempotency test"),
      metric("successful_effects_without_receipt", "==", 0, "receipt test"),
      metric("static_fallback_fixture_pass", "==", 1, "fixture build")
    ],
    effects: {
      unblocks: ["P2.1", "P2.5", "P3.1"],
      risks: ["premature protocol lock-in", "surface contract absorbs runtime authorization"],
      rollback: "retain research contracts outside package exports and keep static framework canonical"
    },
    failPolicy: "No external protocol or AI runtime becomes the canonical internal model; no browser projection includes private runtime state.",
    status: "planned",
    testsFirst: ["schema rejection tests", "public projection leak test", "intent idempotency test", "receipt completeness test", "static fallback fixture", "theme/site/growth authority test"]
  });

  const p21 = byId.get("P2.1");
  p21.dependencies = ["P1.6"];
  p21.action = "Create one-command five-page scaffold with one governed task-service fixture and complete static fallback";
  p21.passMetrics = [
    metric("commands_to_first_build", "<=", 3, "clean-room transcript"),
    metric("fixture_pages", ">=", 5, "dist audit"),
    metric("governed_task_pages", ">=", 1, "fixture manifest"),
    metric("static_fallback_completeness", "==", 1, "no-JS audit")
  ];
  p21.testsFirst = ["CLI snapshot test", "fixture build test", "path traversal rejection test", "no-JS task completion fallback test", "shared runtime bundle test"];

  const p22 = byId.get("P2.2");
  p22.passMetrics = [
    metric("changed_page_only_rebuild_p95_ms", "<=", 500, "local benchmark"),
    metric("stale_output_failures", "==", 0, "test"),
    metric("surface_bundle_cache_reuse", "==", 1, "watch fixture"),
    metric("reconnect_mock_replay", "==", 1, "runtime fixture")
  ];
  p22.testsFirst = ["watch rebuild test", "service mount invalidation test", "shared bundle cache test", "mock event replay test", "404 test", "clean shutdown test"];

  const p23 = byId.get("P2.3");
  p23.passMetrics = [
    metric("publisher_adapters", ">=", 1, "package API"),
    metric("partial_publish_on_failure", "==", 0, "fault injection"),
    metric("surface_assets_in_immutable_manifest", "==", 1, "publisher plan")
  ];
  p23.testsFirst = ["publisher dry-run test", "atomic upload plan test", "shared surface asset manifest test", "credential absence test"];

  upsertById(steps, {
    id: "P2.5",
    phase: "P2",
    workstream: "W7",
    action: "Build protocol-adapter conformance fixtures for A2UI, AG-UI, MCP Apps and an AMTECH AI Employee mock adapter",
    dependencies: ["P1.6", "P2.1"],
    passMetrics: [
      metric("protocol_adapter_fixture_arms", ">=", 4, "conformance report"),
      metric("capability_widening_findings", "==", 0, "adapter audit"),
      metric("private_projection_leaks", "==", 0, "adapter tests"),
      metric("critical_semantic_loss_findings", "==", 0, "round-trip report")
    ],
    effects: {
      unblocks: ["P2.4", "P3.4"],
      risks: ["preview protocol churn", "lowest-common-denominator ABI"],
      rollback: "keep incompatible adapters noncanonical and preserve the internal ABI"
    },
    failPolicy: "Rendering success alone is not conformance; adapters may not widen capabilities or bypass receipts, policy, isolation or fallback.",
    status: "planned",
    testsFirst: ["A2UI mapping fixture", "AG-UI snapshot/delta/resume fixture", "MCP Apps sandbox/CSP fixture", "AMTECH public projection fixture", "semantic loss report"]
  });

  const p24 = byId.get("P2.4");
  p24.dependencies = ["P2.2", "P2.3", "P2.5"];
  p24.action = "Run frozen framework comparison and mandatory 10K surface-scale matrix on identical fixtures";
  p24.passMetrics = [
    metric("fixture_equivalence", "==", 1, "route/assets/content/surface manifest"),
    metric("reported_runs_per_arm", ">=", 20, "raw results"),
    metric("ten_thousand_page_matrix_complete", "==", 1, "benchmark report"),
    metric("per_page_generated_runtime_bundle_bytes", "==", 0, "dist audit"),
    metric("shared_bundle_duplicate_hashes", "==", 0, "dist audit")
  ];
  p24.testsFirst = ["benchmark harness determinism", "20 clean runs per arm", "10K page and surface mount matrix", "incremental service/component/theme/growth invalidation tests"];

  const p31 = byId.get("P3.1");
  p31.dependencies = ["P1.6", "P2.1"];
  p31.action = "Run real PCN to provider to ArticleIR to Hyper Site pass with independently validated task-service proposal support";
  p31.passMetrics = [
    metric("accepted_real_pages", ">=", 5, "artifact set"),
    metric("unsupported_claim_rate", "==", 0, "review ledger"),
    metric("renderer_implementation_fields_from_hyper_content", "==", 0, "proposal audit")
  ];
  p31.testsFirst = ["provider contract test", "ArticleIR rejection tests", "task-service proposal rejection tests", "content/surface independent acceptance test", "deterministic unfolding test"];

  const p32 = byId.get("P3.2");
  p32.effects.unblocks = [...new Set([...(p32.effects.unblocks ?? []).filter((id) => id !== "P4.1"), "P3.4"] )];
  const p33 = byId.get("P3.3");
  p33.effects.unblocks = [...new Set([...(p33.effects.unblocks ?? []).filter((id) => id !== "P4.1"), "P3.4"] )];
  p33.testsFirst = ["fault injection after each content stage", "task-service proposal checkpoint test", "surface compilation checkpoint test", "resume test", "duplicate side-effect test"];

  upsertById(steps, {
    id: "P3.4",
    phase: "P3",
    workstream: "W7",
    action: "Compile an accepted real content cohort into governed task surfaces and prove isolation, completion measurement and deterministic recovery",
    dependencies: ["P2.5", "P3.2", "P3.3"],
    passMetrics: [
      metric("accepted_real_task_surface_pages", ">=", 5, "cohort report"),
      metric("public_private_projection_leaks", "==", 0, "isolation audit"),
      metric("task_completion_measurement_coverage", "==", 1, "telemetry report"),
      metric("duplicate_external_effects", "==", 0, "receipt ledger")
    ],
    effects: {
      unblocks: ["P4.1"],
      risks: ["content acceptance conflated with runtime acceptance", "public service reuses private assignment"],
      rollback: "publish static pages only and keep task surfaces noindex or disabled"
    },
    failPolicy: "Content, service proposal, runtime isolation and artifact completion are independently rejectable; traffic is not task success.",
    status: "planned",
    testsFirst: ["real public projection isolation test", "task and artifact completion telemetry test", "public assignment isolation test", "receipt and replay test"]
  });

  const p41 = byId.get("P4.1");
  p41.dependencies = ["P2.4", "P3.4"];

  const p55 = byId.get("P5.5");
  const outcomeMetric = p55.passMetrics.find((item) => item.metric === "plan_outcomes_passed");
  if (outcomeMetric) outcomeMetric.threshold = 5;

  const ordered = steps.sort((left, right) => {
    const phase = left.phase.localeCompare(right.phase);
    if (phase !== 0) return phase;
    return left.id.localeCompare(right.id, undefined, { numeric: true });
  });

  await writeFile(planPath, `${JSON.stringify(plan, null, 2)}\n`);
  await writeFile(stepsPath, `${JSON.stringify(ordered, null, 2)}\n`);
  return { workstreams: plan.workstreams.length, technologies: plan.techPlacements.length, hypotheses: plan.researchHypotheses.length, outcomes: plan.planOutcomes.length, steps: ordered.length };
}

async function appendOnce(path, marker, text) {
  const full = resolve(root, path);
  let content = await readFile(full, "utf8");
  if (!content.includes(marker)) {
    content = `${content.trimEnd()}\n\n${text.trim()}\n`;
    await writeFile(full, content);
    return true;
  }
  return false;
}

async function updateBootstrapDocs() {
  const changed = [];
  if (await appendOnce("README.md", "## Governed task surfaces", `## Governed task surfaces\n\nHyper Site's next interaction layer is a protocol-neutral governed task-surface platform. Static pages remain complete and indexable; optional runtime services accept typed intents and return public projections, resources, artifacts, actions, and receipts. Theme developers own trusted renderers, site developers own mounts and fallbacks, and growth operators own bounded experiment and conversion policy. Hyper Content may propose task semantics but contains zero UI implementation logic.\n\nCurrent authority:\n\n- \`docs/intake/2026-07-18-next-generation-task-surfaces.md\`\n- \`docs/research/31-next-generation-task-surfaces-protocol-crosswalk.md\`\n- \`docs/architecture/32-governed-task-surface-architecture.md\`\n- \`docs/validation/33-task-surface-validation-matrix.md\`\n\nA2UI, AG-UI, MCP Apps, and AMTECH AI Employee are adapters after the internal ABI passes. Ten-thousand-page surface scale is a mandatory benchmark tier, not a page-usefulness claim.`)) changed.push("README.md");

  if (await appendOnce("AGENTS.md", "## Governed task-surface boundary", `## Governed task-surface boundary\n\n- Hyper Content may propose a task goal, evidence, static examples, input/output classes, limitations, and review triggers. It must not emit UI implementation logic.\n- Hyper Site owns protocol-neutral service, surface, theme, mount, public-projection, and growth-policy contracts. It must not own reasoning, credentials, private memory, connectors, or consequential authorization.\n- Browser surfaces submit typed intents; they never mutate canonical runtime state directly.\n- Public projections are allowlisted and must not include full ontology state, hidden reasoning, private memory, credentials, raw provider payloads, or unrelated tenant resources.\n- Static fallback remains complete. Dynamic native, declarative, and sandboxed tiers are progressive enhancement.\n- A2UI, AG-UI, MCP Apps, and AI Employee integrations are adapters, not internal authority.\n- Growth operators may vary approved presentation, sequencing, allocation, and conversion. They may not widen capabilities, lower safety, alter private-data policy, or index sessions and generated artifacts.\n- Run \`node scripts/check-doc-system.mjs\` with plan and boundary validation.`)) changed.push("AGENTS.md");

  if (await appendOnce("CODEGRAPH.md", "## Governed task-surface graph", `## Governed task-surface graph\n\n\`\`\`text\nHyper Content optional task proposal\n  goal + evidence + inputs + outputs + limits\n              |\n              v\nW7 protocol-neutral TaskServiceManifest / SurfacePlan\n              |\n      +-------+-------+\n      |               |\n      v               v\nstatic fallback   runtime adapter interface\n      |               |\n      v               v\nPageIR/HTML       intent -> events -> resource/receipt\n      |               |\n      +-------+-------+\n              v\n       governed task page\n\`\`\`\n\nW7 is permanent. W1 remains static framework and renderer authority, W3 remains the temporary migration bridge, W4 owns observability/recovery/security infrastructure, and W6 owns field and revenue acceptance. Protocol adapters live outside the canonical ABI.`)) changed.push("CODEGRAPH.md");

  if (await appendOnce("CONTRIBUTING.md", "## Stateful documentation", `## Stateful documentation\n\nUse the lifecycle defined in \`docs/README.md\`:\n\n\`\`\`text\nintake -> research -> architecture -> executable plan -> validation report -> memory handoff\n\`\`\`\n\nRoot Markdown is restricted to the bootstrap allowlist. Update \`docs/catalog.json\` for every document addition, move, supersession, or authority change. Timestamped memory handoffs and validation reports are immutable records. Run:\n\n\`\`\`bash\nnode scripts/check-doc-system.mjs\nnode scripts/check-meta-plan.mjs planning/meta-plan-v3.json\nnode --test planning/test/meta-plan.test.mjs\nnode scripts/check-product-boundaries.mjs\n\`\`\``)) changed.push("CONTRIBUTING.md");

  if (await appendOnce("docs/planning/30-meta-plan-v3-executable-program.md", "## 7. Governed task-surface program mutation", `## 7. Governed task-surface program mutation\n\nThe UI research adds W7, a permanent task-surface platform workstream, rather than overloading W1 or the temporary W3 migration bridge. The executable program now contains P1.6, P2.5, and P3.4 plus a fifth plan outcome.\n\n- P1.4 physically extracts neutral framework and classifies mixed UI modules.\n- P1.5 removes vector geometry and current Wasm from all framework/UI paths.\n- P1.6 freezes protocol-neutral task, surface, projection, event, receipt, theme, and growth contracts.\n- P2 adds one governed task page, adapter conformance fixtures, shared-bundle constraints, and the mandatory 10K surface matrix.\n- P3 keeps content and task-service proposals independently rejectable, then proves a real governed-surface cohort and recovery.\n\nA2UI, AG-UI, MCP Apps, OpenFeature, RDF/SHACL/PROV, and relationship-projection notation remain evidence-gated adapters or research arms.`)) changed.push("docs/planning/30-meta-plan-v3-executable-program.md");
  return changed;
}

const moved = await moveDocuments();
const references = await rewriteReferences();
const plan = await mutatePlan();
const bootstrap = await updateBootstrapDocs();
console.log(JSON.stringify({ status: "pass", moved, referencesUpdated: references, plan, bootstrapUpdated: bootstrap }, null, 2));
