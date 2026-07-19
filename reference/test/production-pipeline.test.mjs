import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import test from "node:test";
import {
  SnapshotCheckpointStore,
  ZaiGlmProvider,
  applyOntologyApproval,
  assertDesignRefinementPreservesContent,
  assessAppliance,
  commitPageDraftTransaction,
  compileApprovedDesignAuthority,
  createDesignApproval,
  createMinimumApplianceContract,
  createOntologyApproval,
  generateProductionCohort,
  normalizeProjectInput,
  prepareAgentSiteProgram,
  prepareApprovedProductionProgram,
  renderApprovedDesignSite,
  runStageOneDiscovery,
  validateProductionCorpus,
} from "../dist/index.js";
import { createAgentSiteFixture, createScaleAgentSiteFixture } from "../fixtures/agent-site-fixture.mjs";
import {
  GENERATED_AT,
  buildDrafts,
  compileSyntheticCohort,
  createApprovedDesign,
  createFixtureEmbeddingBackend,
  permissiveProductionPolicy,
} from "./production-test-fixtures.mjs";

const usage = () => ({ promptTokens: 100, completionTokens: 50, cachedTokens: 25, totalTokens: 150 });
const response = (content, requestId = "fixture-request") => ({ requestId, model: "glm-5.2", content, finishReason: "stop", usage: usage() });

test("minimum appliance contract distinguishes optimized and compatibility hardware", () => {
  const contract = createMinimumApplianceContract();
  const optimized = assessAppliance({
    profileId: "rtx-pro-6000-blackwell-96gb", gpuVendor: "NVIDIA", gpuModel: "RTX PRO 6000 Blackwell",
    gpuCount: 1, gpuMemoryGiB: 96, computeCapability: 12, systemMemoryGiB: 160, localNvmeFreeGiB: 500,
    cudaVersion: "12.8", nodeVersion: "v22.14.0", os: "linux", architecture: "x64", observedHourlyRateUsd: 1.89,
  }, contract);
  assert.equal(optimized.validation.passes, true);
  assert.equal(optimized.profile.supportState, "optimized");

  const compatible = assessAppliance({
    profileId: "a100-80gb", gpuVendor: "NVIDIA", gpuModel: "A100 80GB",
    gpuCount: 1, gpuMemoryGiB: 80, computeCapability: 8, systemMemoryGiB: 128, localNvmeFreeGiB: 250,
    cudaVersion: "12.8", nodeVersion: "22.14.0", os: "linux", architecture: "x64", observedHourlyRateUsd: 1.49,
  }, contract);
  assert.equal(compatible.validation.passes, true);
  assert.equal(compatible.profile.supportState, "compatibility-candidate");

  const undersized = assessAppliance({
    profileId: "rtx-pro-6000-blackwell-96gb", gpuVendor: "NVIDIA", gpuModel: "undersized",
    gpuCount: 1, gpuMemoryGiB: 48, computeCapability: 12, systemMemoryGiB: 64, localNvmeFreeGiB: 50,
    cudaVersion: "12.8", nodeVersion: "22.14.0", os: "linux", architecture: "x64",
  }, contract);
  assert.equal(undersized.validation.passes, false);
  assert.ok(undersized.validation.hardFailures.includes("appliance.profile"));
  assert.ok(undersized.validation.hardFailures.includes("appliance.host"));
});

test("GLM adapter uses JSON mode plus external bounded repair", async () => {
  let calls = 0;
  const provider = new ZaiGlmProvider({ apiKey: "", maximumRepairAttempts: 1 }, {
    id: "fixture-transport",
    async complete() {
      calls += 1;
      return response(JSON.stringify({ answer: calls === 1 ? 42 : "accepted" }), `request-${calls}`);
    },
  });
  const result = await provider.generate({
    id: "request:repair", stage: "stage-1-ontology", systemPrompt: "Return JSON.", userPrompt: "Fixture.",
    schemaName: "Answer", schema: { type: "object", required: ["answer"] }, sourceIds: ["source:fixture"],
  }, (value) => value?.answer === "accepted" ? [] : ["answer must equal accepted"]);
  assert.equal(result.attempts, 2);
  assert.equal(result.validation.passes, true);
  assert.equal(calls, 2);

  const rejecting = new ZaiGlmProvider({ apiKey: "", maximumRepairAttempts: 0 }, {
    id: "rejecting-transport",
    async complete() { return response("not-json"); },
  });
  await assert.rejects(() => rejecting.generate({
    id: "request:reject", stage: "stage-1-ontology", systemPrompt: "Return JSON.", userPrompt: "Fixture.",
    schemaName: "Answer", schema: { type: "object" }, sourceIds: ["source:fixture"],
  }, () => []), /structured generation rejected/);
});

test("Stage 1 is schema-bound, independently approved, and resumable", async () => {
  const fixture = createAgentSiteFixture();
  const project = normalizeProjectInput(fixture.project);
  const sourceExcerpts = [{ sourceId: project.sourceLedger[0].id, excerptId: "excerpt:fixture", content: project.sourceLedger[0].summary }];
  let provider;
  let calls = 0;
  const transport = {
    id: "stage-one-fixture",
    async complete(request) {
      calls += 1;
      return response(JSON.stringify({
        ...fixture.ontologyProposal,
        id: "ontology:provider-fixture",
        version: "1",
        generatedAt: GENERATED_AT,
        generatedBy: provider.id,
        attributes: fixture.ontologyProposal.attributes.map((item) => ({ ...item, reviewerApproved: false })),
      }), request.id);
    },
  };
  provider = new ZaiGlmProvider({ apiKey: "", maximumRepairAttempts: 0 }, transport);
  const checkpoints = new SnapshotCheckpointStore();
  const input = {
    runId: "run:stage-one", requestId: "request:stage-one", proposalId: "ontology:provider-fixture",
    proposalVersion: "1", generatedAt: GENERATED_AT, project, sourceExcerpts, provider, checkpoints,
  };
  const first = await runStageOneDiscovery(input);
  const second = await runStageOneDiscovery(input);
  assert.equal(first.resumed, false);
  assert.equal(second.resumed, true);
  assert.equal(calls, 1);

  const approval = createOntologyApproval(first.proposal, {
    reviewerId: "operator:ontology-review", reviewerClass: "human", decision: "approved", approvedAt: GENERATED_AT,
    approvedSensitiveAttributeIds: ["attr:pet:dog", "attr:pet:cat"], observations: [], notes: ["bounded fixture approval"],
  });
  const applied = applyOntologyApproval(first.proposal, approval);
  assert.equal(applied.attributes.find((item) => item.id === "attr:pet:dog")?.reviewerApproved, true);
  assert.equal(applied.attributes.find((item) => item.id === "attr:unreviewed:age")?.reviewerApproved, false);
  const prepared = prepareApprovedProductionProgram({
    project: fixture.project, proposal: first.proposal, approval, vectorIdentity: fixture.vectorIdentity,
    opportunityPolicy: fixture.opportunityPolicy, siteGenerationPolicy: fixture.siteGenerationPolicy,
  });
  assert.equal(prepared.ontology.validation.passes, true);
  assert.ok(prepared.siteGenerationPlan.pageConceptJobs.length >= 8);
});

test("design authority covers core-site authoring and CSS-only refinement", () => {
  const project = normalizeProjectInput(createAgentSiteFixture().project);
  const design = createApprovedDesign(project);
  assert.equal(design.validation.passes, true);
  assert.equal(design.corePageBriefs[0].route, "/");
  assert.match(design.css, /--hs-primary/);

  const draft = {
    id: "design:self", version: "1", brandName: "Fixture", generatedBy: "same-reviewer",
    sourceIds: [project.sourceLedger[0].id],
    palette: { ink: "#111111", canvas: "#F7F9FC", surface: "#FFFFFF", primary: "#2563EB", secondary: "#E11D2A", accent: "#DFF6FF", success: "#168A57" },
    typography: { bodyStack: "system-ui", headingStack: "system-ui", monoStack: "monospace" },
    visualRules: ["clear"], componentRules: ["semantic"], prohibitedPatterns: ["runtime-only"],
    corePageBriefs: [{ id: "core:self", route: "/", purpose: "fixture", preferredArchetype: "editorial", requiredModuleKinds: ["hero"], notes: [] }],
  };
  const approval = createDesignApproval(draft, { reviewerId: "same-reviewer", reviewerClass: "human", decision: "approved", approvedAt: GENERATED_AT, notes: [] });
  assert.throws(() => compileApprovedDesignAuthority(draft, approval, new Set(project.sourceLedger.map((item) => item.id))), /cannot approve its own design/);
  assert.throws(() => createApprovedDesign(project, { version: "unsafe", customCss: '@import url("https://example.com/style.css");' }), /custom CSS rejected/);
});

test("25-page transaction is atomic, noindex, attractive, and deterministic", { timeout: 120_000 }, async () => {
  const { prepared, design, drafts, transaction, corpus } = await compileSyntheticCohort(25);
  assert.equal(transaction.validation.passes, true);
  assert.equal(corpus.validation.passes, true);
  assert.equal(transaction.site.pages.length, 25);
  assert.equal(transaction.site.sitemapXml.includes("<url>"), false);
  assert.ok(transaction.rendered.pages.every((page) => page.html.includes('name="robots" content="noindex,nofollow"')));
  assert.ok(transaction.rendered.pages.every((page) => page.html.includes('/assets/hyper-site.css')));

  const reordered = commitPageDraftTransaction({
    project: prepared.project, ontology: prepared.ontology, plan: prepared.siteGenerationPlan,
    drafts: [...drafts].reverse(), design, baseUrl: "https://scale-25.example.com",
  });
  assert.equal(reordered.transactionHash, transaction.transactionHash);

  const invalid = [...drafts];
  invalid[0] = { ...invalid[0], evidenceIds: ["evidence:missing"] };
  assert.throws(() => commitPageDraftTransaction({
    project: prepared.project, ontology: prepared.ontology, plan: prepared.siteGenerationPlan,
    drafts: invalid, design, baseUrl: "https://scale-25.example.com",
  }), /validation failed/);

  const refinedDesign = createApprovedDesign(prepared.project, { version: "scale-25-refined", primary: "#0F766E" });
  const refined = renderApprovedDesignSite(transaction.site, refinedDesign);
  assertDesignRefinementPreservesContent(transaction.rendered, refined);
  assert.notEqual(refined.cssHash, transaction.rendered.cssHash);
});

test("corpus validator rejects a near-duplicate pair", { timeout: 120_000 }, async () => {
  const fixture = createScaleAgentSiteFixture(25);
  const prepared = prepareAgentSiteProgram(fixture);
  const design = createApprovedDesign(prepared.project, { version: "duplicate-screen" });
  const drafts = buildDrafts(prepared.siteGenerationPlan.pageConceptJobs, design.authorityHash, "duplicate-screen");
  drafts[1] = {
    ...drafts[1], title: drafts[0].title, description: drafts[0].description,
    modules: drafts[1].modules.map((item, index) => ({ ...item, heading: drafts[0].modules[index].heading, body: drafts[0].modules[index].body })),
    informationObjects: drafts[1].informationObjects.map((item) => ({ ...item, title: drafts[0].informationObjects[0].title, body: drafts[0].informationObjects[0].body })),
    utilityTasks: drafts[1].utilityTasks.map((item) => ({ ...item, title: drafts[0].utilityTasks[0].title, body: drafts[0].utilityTasks[0].body })),
  };
  const transaction = commitPageDraftTransaction({
    project: prepared.project, ontology: prepared.ontology, plan: prepared.siteGenerationPlan,
    drafts, design, baseUrl: "https://duplicates.example.com",
  });
  const result = await validateProductionCorpus(transaction, createFixtureEmbeddingBackend(), permissiveProductionPolicy({ lexicalDuplicateThreshold: 0.75 }));
  assert.equal(result.validation.passes, false);
  assert.ok(result.validation.hardFailures.includes("corpus.lexical"));
  assert.ok(result.rejectedPairs.length > 0);
});

test("Stage-2 batches resume without regenerating accepted output", { timeout: 180_000 }, async () => {
  const fixture = createScaleAgentSiteFixture(25);
  fixture.siteGenerationPolicy = { ...fixture.siteGenerationPolicy, pageConceptBatchSize: 10 };
  const prepared = prepareAgentSiteProgram(fixture);
  const design = createApprovedDesign(prepared.project, { version: "recovery" });
  const sourceExcerpts = [{ sourceId: prepared.project.sourceLedger[0].id, excerptId: "excerpt:recovery", content: prepared.project.sourceLedger[0].summary }];
  let calls = 0;
  const provider = new ZaiGlmProvider({ apiKey: "", maximumRepairAttempts: 0 }, {
    id: "stage-two-fixture",
    async complete(request) {
      calls += 1;
      const payload = JSON.parse(request.userPrompt);
      return response(JSON.stringify({ batchId: payload.batch.id, drafts: buildDrafts(payload.jobs, payload.designAuthorityHash, payload.batch.id) }), request.id);
    },
  });
  const checkpoints = new SnapshotCheckpointStore();
  const input = {
    runId: "run:recovery", provider, prepared, design, sourceExcerpts, checkpoints,
    embeddingBackend: createFixtureEmbeddingBackend(), baseUrl: "https://recovery.example.com",
    generatedAt: GENERATED_AT, corpusPolicy: permissiveProductionPolicy(),
  };
  const first = await generateProductionCohort(input);
  const firstCalls = calls;
  const second = await generateProductionCohort(input);
  assert.equal(first.generatedBatchCount, 3);
  assert.equal(first.resumedBatchCount, 0);
  assert.equal(second.generatedBatchCount, 0);
  assert.equal(second.resumedBatchCount, 3);
  assert.equal(calls, firstCalls);
  assert.equal(first.transaction.transactionHash, second.transaction.transactionHash);
  assert.equal(second.validation.passes, true);
});

for (const targetPages of [100, 500]) {
  test(`full transaction and validator scale to ${targetPages} synthetic pages`, { timeout: 180_000 }, async () => {
    const started = performance.now();
    const result = await compileSyntheticCohort(targetPages);
    const elapsedMilliseconds = performance.now() - started;
    console.log(`production-scale-${targetPages} ${JSON.stringify({ elapsedMilliseconds, pages: result.transaction.site.pages.length, candidates: result.corpus.candidatePairs, transactionHash: result.transaction.transactionHash, corpusHash: result.corpus.validationHash })}`);
    assert.equal(result.transaction.site.pages.length, targetPages);
    assert.equal(result.corpus.pageCount, targetPages);
    assert.equal(result.transaction.validation.passes, true);
    assert.equal(result.corpus.validation.passes, true);
    assert.ok(result.corpus.candidatePairs <= targetPages * permissiveProductionPolicy().maximumCandidatesPerPage * 2);
  });
}

test("full transaction and bounded validator scale to 10,000 synthetic pages", { timeout: 300_000 }, async () => {
  const started = performance.now();
  const result = await compileSyntheticCohort(10_000);
  const elapsedMilliseconds = performance.now() - started;
  const htmlBytes = result.transaction.rendered.pages.reduce((sum, page) => sum + Buffer.byteLength(page.html), 0);
  console.log(`production-scale-10000 ${JSON.stringify({ elapsedMilliseconds, pages: result.transaction.site.pages.length, htmlBytes, candidates: result.corpus.candidatePairs, transactionHash: result.transaction.transactionHash, corpusHash: result.corpus.validationHash })}`);
  assert.equal(result.transaction.site.pages.length, 10_000);
  assert.equal(result.transaction.rendered.pages.length, 10_000);
  assert.equal(result.corpus.pageCount, 10_000);
  assert.equal(result.transaction.validation.passes, true);
  assert.equal(result.corpus.validation.passes, true);
  assert.ok(result.corpus.candidatePairs <= 10_000 * permissiveProductionPolicy().maximumCandidatesPerPage * 2);
});
