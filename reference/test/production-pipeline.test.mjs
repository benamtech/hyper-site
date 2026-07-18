import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import test from "node:test";
import {
  DEFAULT_PRODUCTION_CORPUS_POLICY,
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
  hash32,
  normalizeProjectInput,
  prepareAgentSiteProgram,
  prepareApprovedProductionProgram,
  renderApprovedDesignSite,
  runStageOneDiscovery,
  validateProductionCorpus,
} from "../dist/index.js";
import { createAgentSiteFixture, createScaleAgentSiteFixture } from "../fixtures/agent-site-fixture.mjs";

const GENERATED_AT = "2026-07-18T07:00:00Z";

function usage() {
  return { promptTokens: 100, completionTokens: 50, cachedTokens: 25, totalTokens: 150 };
}

function response(content, requestId = "fixture-request", model = "glm-5.2") {
  return { requestId, model, content, finishReason: "stop", usage: usage() };
}

function createApprovedDesign(project, options = {}) {
  const version = options.version ?? "1";
  const draft = {
    id: `design:${project.input.id}`,
    version,
    brandName: project.input.brand.name,
    generatedBy: options.generatedBy ?? "design-generator:fixture",
    sourceIds: [project.sourceLedger[0].id],
    palette: {
      ink: "#111111",
      canvas: "#F7F9FC",
      surface: "#FFFFFF",
      primary: options.primary ?? "#2563EB",
      secondary: "#E11D2A",
      accent: "#DFF6FF",
      success: "#168A57",
    },
    typography: {
      bodyStack: "Inter, ui-sans-serif, system-ui, sans-serif",
      headingStack: "Inter, ui-sans-serif, system-ui, sans-serif",
      monoStack: "ui-monospace, SFMono-Regular, Menlo, monospace",
    },
    visualRules: ["clear hierarchy", "light surfaces", "restrained motion", "strong mobile composition"],
    componentRules: ["semantic modules", "one shared stylesheet", "conversion path remains visible"],
    prohibitedPatterns: ["decorative dashboards", "generic gradient hero", "runtime-only canonical content"],
    corePageBriefs: [{
      id: "core:home",
      route: "/",
      purpose: "Explain the primary offer and move a qualified operator into the main conversion path.",
      preferredArchetype: "workflow-led",
      requiredModuleKinds: ["hero", "answer", "proof", "cta"],
      notes: ["design the high-value core site before expanding the landing-page corpus"],
    }],
    ...(options.customCss === undefined ? {} : { customCss: options.customCss }),
  };
  const approval = createDesignApproval(draft, {
    reviewerId: options.reviewerId ?? "operator:fixture",
    reviewerClass: "human",
    decision: "approved",
    approvedAt: GENERATED_AT,
    notes: ["approved fixture design authority"],
  });
  return compileApprovedDesignAuthority(draft, approval, new Set(project.sourceLedger.map((item) => item.id)));
}

function safeSlug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function buildDrafts(jobs, designAuthorityHash, scope = "fixture") {
  return jobs.map((job, index) => {
    const ordinal = String(index + 1).padStart(5, "0");
    const namespace = `${safeSlug(scope)}-${safeSlug(job.id)}-${ordinal}`;
    const pageId = `page:${namespace}`;
    const labels = job.attributes.map((item) => item.label).join(", ");
    const claimId = `claim:${namespace}`;
    const informationId = `information:${namespace}`;
    const utilityId = `utility:${namespace}`;
    const sourceIds = [...job.sourceIds];
    const evidenceIds = [...job.evidenceIds];
    const commonCapabilities = ["semantic-hierarchy", "responsive-grid", "mobile-priority", "reduced-motion"];
    return {
      jobId: job.id,
      pageId,
      route: `/research/${safeSlug(scope)}/${safeSlug(job.id)}-${ordinal}`,
      canonicalQuestion: `What is the evidence-bounded operating path for ${labels} in scenario ${ordinal}?`,
      intent: `evaluate-bounded-workflow-${ordinal}`,
      title: `Scenario ${ordinal}: ${labels}`,
      description: `A source-bounded operating guide for scenario ${ordinal}, covering ${labels} without invented proof or pricing.`,
      expressedAttributeIds: job.attributes.map((item) => item.id),
      evidenceIds,
      sourceIds,
      claims: [{
        id: claimId,
        text: `Scenario ${ordinal} is constrained to the declared source and evidence ledger for ${labels}.`,
        evidenceIds,
        requiredLevel: 1,
      }],
      informationObjects: [{
        id: informationId,
        kind: "field-note",
        title: `Scenario ${ordinal} decision record`,
        body: `Use the selected attributes for ${labels} to distinguish this page from neighboring jobs while preserving the declared business constraints.`,
        evidenceIds,
      }],
      utilityTasks: [{
        id: utilityId,
        title: `Scenario ${ordinal} operator checklist`,
        body: `Confirm source coverage, review the output, and approve the next action for scenario ${ordinal}.`,
        evidenceIds,
      }],
      conversionPathId: "conversion:primary",
      modules: [
        {
          id: `module:${namespace}:hero`,
          kind: "hero",
          layoutRole: "lead",
          heading: `A bounded path for scenario ${ordinal}`,
          body: `This page answers one specific operating question for ${labels}.`,
          claimIds: [],
          informationObjectIds: [],
          requiredCapabilities: commonCapabilities,
          sourceIds,
        },
        {
          id: `module:${namespace}:answer`,
          kind: "answer",
          layoutRole: "support",
          heading: "What changes in this scenario",
          body: `The selected region changes the workflow, vocabulary, evidence emphasis, or conversion path for scenario ${ordinal}.`,
          claimIds: [claimId],
          informationObjectIds: [informationId],
          requiredCapabilities: [...commonCapabilities, "long-form-reading", "structured-data-visible"],
          sourceIds,
        },
        {
          id: `module:${namespace}:proof`,
          kind: "proof",
          layoutRole: "proof",
          heading: "Evidence boundary",
          body: `No claim on scenario ${ordinal} may exceed the supplied evidence ledger.`,
          claimIds: [claimId],
          informationObjectIds: [],
          requiredCapabilities: [...commonCapabilities, "evidence-dense", "progressive-disclosure", "structured-data-visible"],
          sourceIds,
        },
        {
          id: `module:${namespace}:cta`,
          kind: "cta",
          layoutRole: "conversion",
          heading: "Review the next action",
          body: `Use the approved conversion path only after reviewing scenario ${ordinal}.`,
          claimIds: [],
          informationObjectIds: [],
          requiredCapabilities: [...commonCapabilities, "conversion-panel"],
          sourceIds,
        },
      ],
      internalPageIds: [],
      commercialValue: 1,
      lifecycleCost: 1,
      designAuthorityHash,
    };
  });
}

function createFixtureEmbeddingBackend(dimensions = 64) {
  return {
    id: `fixture-local-embedding-${dimensions}`,
    async embed(texts) {
      return texts.map((text) => {
        const vector = new Float32Array(dimensions);
        for (let index = 0; index < dimensions; index += 1) {
          vector[index] = (hash32(`${text}\0${index}`) & 1) === 0 ? -1 : 1;
        }
        return vector;
      });
    },
  };
}

function permissiveProductionPolicy(overrides = {}) {
  return {
    ...DEFAULT_PRODUCTION_CORPUS_POLICY,
    lexicalDuplicateThreshold: 0.999999,
    semanticDuplicateThreshold: 0.999999,
    maximumPostingSize: 256,
    maximumCandidatesPerPage: 48,
    ...overrides,
  };
}

async function compileSyntheticCohort(targetPages) {
  const fixture = createScaleAgentSiteFixture(targetPages);
  const prepared = prepareAgentSiteProgram(fixture);
  const design = createApprovedDesign(prepared.project, { version: `scale-${targetPages}` });
  const drafts = buildDrafts(prepared.siteGenerationPlan.pageConceptJobs, design.authorityHash, `scale-${targetPages}`);
  const transaction = commitPageDraftTransaction({
    project: prepared.project,
    ontology: prepared.ontology,
    plan: prepared.siteGenerationPlan,
    drafts,
    design,
    baseUrl: `https://scale-${targetPages}.example.com`,
  });
  const corpus = await validateProductionCorpus(transaction, createFixtureEmbeddingBackend(), permissiveProductionPolicy());
  return { fixture, prepared, design, drafts, transaction, corpus };
}

test("minimum appliance contract distinguishes optimized and compatibility hardware", () => {
  const contract = createMinimumApplianceContract();
  const blackwell = assessAppliance({
    profileId: "rtx-pro-6000-blackwell-96gb",
    gpuVendor: "NVIDIA",
    gpuModel: "RTX PRO 6000 Blackwell",
    gpuCount: 1,
    gpuMemoryGiB: 96,
    computeCapability: 12,
    systemMemoryGiB: 160,
    localNvmeFreeGiB: 500,
    cudaVersion: "12.8",
    nodeVersion: "v22.14.0",
    os: "linux",
    architecture: "x64",
    observedHourlyRateUsd: 1.89,
  }, contract);
  assert.equal(blackwell.validation.passes, true);
  assert.equal(blackwell.profile.supportState, "optimized");

  const a100 = assessAppliance({
    profileId: "a100-80gb",
    gpuVendor: "NVIDIA",
    gpuModel: "A100 80GB",
    gpuCount: 1,
    gpuMemoryGiB: 80,
    computeCapability: 8,
    systemMemoryGiB: 128,
    localNvmeFreeGiB: 250,
    cudaVersion: "12.8",
    nodeVersion: "22.14.0",
    os: "linux",
    architecture: "x64",
    observedHourlyRateUsd: 1.49,
  }, contract);
  assert.equal(a100.validation.passes, true);
  assert.equal(a100.profile.supportState, "compatibility-candidate");

  const undersized = assessAppliance({
    profileId: "rtx-pro-6000-blackwell-96gb",
    gpuVendor: "NVIDIA",
    gpuModel: "undersized fixture",
    gpuCount: 1,
    gpuMemoryGiB: 48,
    computeCapability: 12,
    systemMemoryGiB: 64,
    localNvmeFreeGiB: 50,
    cudaVersion: "12.8",
    nodeVersion: "22.14.0",
    os: "linux",
    architecture: "x64",
  }, contract);
  assert.equal(undersized.validation.passes, false);
  assert.ok(undersized.validation.hardFailures.includes("appliance.profile"));
  assert.ok(undersized.validation.hardFailures.includes("appliance.host"));
});

test("GLM adapter uses JSON mode plus external bounded repair", async () => {
  let calls = 0;
  const transport = {
    id: "fixture-transport",
    async complete() {
      calls += 1;
      return response(calls === 1 ? JSON.stringify({ answer: 42 }) : JSON.stringify({ answer: "accepted" }), `fixture-${calls}`);
    },
  };
  const provider = new ZaiGlmProvider({ apiKey: "", maximumRepairAttempts: 1 }, transport);
  const result = await provider.generate({
    id: "request:repair",
    stage: "stage-1-ontology",
    systemPrompt: "Return structured output.",
    userPrompt: "Fixture request.",
    schemaName: "Answer",
    schema: { type: "object", required: ["answer"], properties: { answer: { type: "string" } } },
    sourceIds: ["source:fixture"],
  }, (value) => value?.answer === "accepted" ? [] : ["answer must equal accepted"]);
  assert.equal(result.attempts, 2);
  assert.equal(result.validation.passes, true);
  assert.equal(calls, 2);

  const rejecting = new ZaiGlmProvider({ apiKey: "", maximumRepairAttempts: 0 }, {
    id: "rejecting-transport",
    async complete() { return response("not-json"); },
  });
  await assert.rejects(() => rejecting.generate({
    id: "request:reject",
    stage: "stage-1-ontology",
    systemPrompt: "Return structured output.",
    userPrompt: "Fixture request.",
    schemaName: "Answer",
    schema: { type: "object" },
    sourceIds: ["source:fixture"],
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
      const proposal = {
        ...fixture.ontologyProposal,
        id: "ontology:provider-fixture",
        version: "1",
        generatedAt: GENERATED_AT,
        generatedBy: provider.id,
        attributes: fixture.ontologyProposal.attributes.map((item) => ({ ...item, reviewerApproved: false })),
      };
      return response(JSON.stringify(proposal), request.id);
    },
  };
  provider = new ZaiGlmProvider({ apiKey: "", maximumRepairAttempts: 0 }, transport);
  const checkpoints = new SnapshotCheckpointStore();
  const stageOneInput = {
    runId: "run:stage-one",
    requestId: "request:stage-one",
    proposalId: "ontology:provider-fixture",
    proposalVersion: "1",
    generatedAt: GENERATED_AT,
    project,
    sourceExcerpts,
    provider,
    checkpoints,
  };
  const first = await runStageOneDiscovery(stageOneInput);
  const second = await runStageOneDiscovery(stageOneInput);
  assert.equal(first.resumed, false);
  assert.equal(second.resumed, true);
  assert.equal(calls, 1);

  const approval = createOntologyApproval(first.proposal, {
    reviewerId: "operator:ontology-review",
    reviewerClass: "human",
    decision: "approved",
    approvedAt: GENERATED_AT,
    approvedSensitiveAttributeIds: ["attr:pet:dog", "attr:pet:cat"],
    observations: [],
    notes: ["approved only explicit self-declared lifestyle fixture attributes"],
  });
  const approvedProposal = applyOntologyApproval(first.proposal, approval);
  assert.equal(approvedProposal.attributes.find((item) => item.id === "attr:pet:dog")?.reviewerApproved, true);
  assert.equal(approvedProposal.attributes.find((item) => item.id === "attr:unreviewed:age")?.reviewerApproved, false);

  const prepared = prepareApprovedProductionProgram({
    project: fixture.project,
    proposal: first.proposal,
    approval,
    vectorIdentity: fixture.vectorIdentity,
    opportunityPolicy: fixture.opportunityPolicy,
    siteGenerationPolicy: fixture.siteGenerationPolicy,
  });
  assert.equal(prepared.ontology.validation.passes, true);
  assert.ok(prepared.siteGenerationPlan.pageConceptJobs.length >= 8);
});

test("design authority covers core-site authoring and CSS-only refinement", async () => {
  const fixture = createAgentSiteFixture();
  const project = normalizeProjectInput(fixture.project);
  const design = createApprovedDesign(project);
  assert.equal(design.validation.passes, true);
  assert.equal(design.corePageBriefs[0].route, "/");
  assert.match(design.css, /--hs-primary/);

  const selfDraft = {
    id: "design:self",
    version: "1",
    brandName: "Fixture",
    generatedBy: "same-reviewer",
    sourceIds: [project.sourceLedger[0].id],
    palette: { ink: "#111111", canvas: "#F7F9FC", surface: "#FFFFFF", primary: "#2563EB", secondary: "#E11D2A", accent: "#DFF6FF", success: "#168A57" },
    typography: { bodyStack: "system-ui", headingStack: "system-ui", monoStack: "monospace" },
    visualRules: ["clear"], componentRules: ["semantic"], prohibitedPatterns: ["runtime-only"],
    corePageBriefs: [{ id: "core:self", route: "/", purpose: "fixture", preferredArchetype: "editorial", requiredModuleKinds: ["hero"], notes: [] }],
  };
  const selfApproval = createDesignApproval(selfDraft, { reviewerId: "same-reviewer", reviewerClass: "human", decision: "approved", approvedAt: GENERATED_AT, notes: [] });
  assert.throws(() => compileApprovedDesignAuthority(selfDraft, selfApproval, new Set(project.sourceLedger.map((item) => item.id))), /cannot approve its own design/);
  assert.throws(() => createApprovedDesign(project, { version: "unsafe", customCss: '@import url("https://example.com/style.css");' }), /custom CSS rejected/);
});

test("25-page PageDraft transaction is atomic, noindex, rendered, and deterministic", { timeout: 120_000 }, async () => {
  const { prepared, design, drafts, transaction, corpus } = await compileSyntheticCohort(25);
  assert.equal(transaction.validation.passes, true);
  assert.equal(transaction.site.pages.length, 25);
  assert.equal(transaction.rendered.pages.length, 25);
  assert.equal(transaction.site.sitemapXml.includes("<url>"), false);
  assert.ok(transaction.rendered.pages.every((page) => page.html.includes('name="robots" content="noindex,nofollow"')));
  assert.ok(transaction.rendered.pages.every((page) => page.html.includes('/assets/hyper-site.css')));
  assert.equal(corpus.validation.passes, true);

  const reordered = commitPageDraftTransaction({
    project: prepared.project,
    ontology: prepared.ontology,
    plan: prepared.siteGenerationPlan,
    drafts: [...drafts].reverse(),
    design,
    baseUrl: "https://scale-25.example.com",
  });
  assert.equal(reordered.transactionHash, transaction.transactionHash);

  const invalid = [...drafts];
  invalid[0] = { ...invalid[0], evidenceIds: ["evidence:missing"] };
  assert.throws(() => commitPageDraftTransaction({
    project: prepared.project,
    ontology: prepared.ontology,
    plan: prepared.siteGenerationPlan,
    drafts: invalid,
    design,
    baseUrl: "https://scale-25.example.com",
  }), /validation failed/);

  const refinedDesign = createApprovedDesign(prepared.project, { version: "scale-25-refined", primary: "#0F766E" });
  const refined = renderApprovedDesignSite(transaction.site, refinedDesign);
  assertDesignRefinementPreservesContent(transaction.rendered, refined);
  assert.notEqual(refined.cssHash, transaction.rendered.cssHash);
});

test("production corpus validator rejects a near-duplicate page pair", { timeout: 120_000 }, async () => {
  const fixture = createScaleAgentSiteFixture(25);
  const prepared = prepareAgentSiteProgram(fixture);
  const design = createApprovedDesign(prepared.project, { version: "duplicate-screen" });
  const drafts = buildDrafts(prepared.siteGenerationPlan.pageConceptJobs, design.authorityHash, "duplicate-screen");
  drafts[1] = {
    ...drafts[1],
    title: drafts[0].title,
    description: drafts[0].description,
    modules: drafts[1].modules.map((module, index) => ({ ...module, heading: drafts[0].modules[index].heading, body: drafts[0].modules[index].body })),
    informationObjects: drafts[1].informationObjects.map((item) => ({ ...item, title: drafts[0].informationObjects[0].title, body: drafts[0].informationObjects[0].body })),
    utilityTasks: drafts[1].utilityTasks.map((item) => ({ ...item, title: drafts[0].utilityTasks[0].title, body: drafts[0].utilityTasks[0].body })),
  };
  const transaction = commitPageDraftTransaction({
    project: prepared.project,
    ontology: prepared.ontology,
    plan: prepared.siteGenerationPlan,
    drafts,
    design,
    baseUrl: "https://duplicates.example.com",
  });
  const result = await validateProductionCorpus(transaction, createFixtureEmbeddingBackend(), permissiveProductionPolicy({ lexicalDuplicateThreshold: 0.75 }));
  assert.equal(result.validation.passes, false);
  assert.ok(result.validation.hardFailures.includes("corpus.lexical"));
  assert.ok(result.rejectedPairs.length > 0);
});

test("Stage-2 physical batches resume without regenerating accepted model output", { timeout: 180_000 }, async () => {
  const fixture = createScaleAgentSiteFixture(25);
  fixture.siteGenerationPolicy = { ...fixture.siteGenerationPolicy, pageConceptBatchSize: 10 };
  const prepared = prepareAgentSiteProgram(fixture);
  const design = createApprovedDesign(prepared.project, { version: "recovery" });
  const excerpts = [{ sourceId: prepared.project.sourceLedger[0].id, excerptId: "excerpt:recovery", content: prepared.project.sourceLedger[0].summary }];
  let calls = 0;
  const transport = {
    id: "stage-two-fixture",
    async complete(request) {
      calls += 1;
      const payload = JSON.parse(request.userPrompt);
      const drafts = buildDrafts(payload.jobs, payload.designAuthorityHash, payload.batch.id);
      return response(JSON.stringify({ batchId: payload.batch.id, drafts }), request.id);
    },
  };
  const provider = new ZaiGlmProvider({ apiKey: "", maximumRepairAttempts: 0 }, transport);
  const store = new SnapshotCheckpointStore();
  const input = {
    runId: "run:recovery",
    provider,
    prepared,
    design,
    sourceExcerpts: excerpts,
    checkpoints: store,
    embeddingBackend: createFixtureEmbeddingBackend(),
    baseUrl: "https://recovery.example.com",
    generatedAt: GENERATED_AT,
    corpusPolicy: permissiveProductionPolicy(),
  };
  const first = await generateProductionCohort(input);
  const callsAfterFirst = calls;
  const second = await generateProductionCohort(input);
  assert.equal(first.generatedBatchCount, 3);
  assert.equal(first.resumedBatchCount, 0);
  assert.equal(second.generatedBatchCount, 0);
  assert.equal(second.resumedBatchCount, 3);
  assert.equal(calls, callsAfterFirst);
  assert.equal(first.transaction.transactionHash, second.transaction.transactionHash);
  assert.equal(second.validation.passes, true);
});

for (const targetPages of [100, 500]) {
  test(`same full transaction and corpus validator scale to ${targetPages} synthetic pages`, { timeout: 180_000 }, async () => {
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

test("same full transaction and bounded corpus validator scale to 10,000 synthetic pages", { timeout: 300_000 }, async () => {
  const started = performance.now();
  const result = await compileSyntheticCohort(10_000);
  const elapsedMilliseconds = performance.now() - started;
  console.log(`production-scale-10000 ${JSON.stringify({ elapsedMilliseconds, pages: result.transaction.site.pages.length, htmlBytes: result.transaction.rendered.pages.reduce((sum, page) => sum + Buffer.byteLength(page.html), 0), candidates: result.corpus.candidatePairs, transactionHash: result.transaction.transactionHash, corpusHash: result.corpus.validationHash })}`);
  assert.equal(result.transaction.site.pages.length, 10_000);
  assert.equal(result.transaction.rendered.pages.length, 10_000);
  assert.equal(result.corpus.pageCount, 10_000);
  assert.equal(result.transaction.validation.passes, true);
  assert.equal(result.corpus.validation.passes, true);
  assert.ok(result.corpus.candidatePairs <= 10_000 * permissiveProductionPolicy().maximumCandidatesPerPage * 2);
});
