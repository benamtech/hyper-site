import assert from "node:assert/strict";
import test from "node:test";
import {
  ZaiGlmProvider,
  emitPageContract,
  emitPageContractFromCompilerState,
  lowerPageContractBatch,
  parseArticleIR,
  unfoldArticleIR,
  validateArticleIR,
} from "../dist/index.js";

const usage = { promptTokens: 100, completionTokens: 50, cachedTokens: 0, totalTokens: 150 };
const lede = "The system works because validated evidence controls each decision and prevents unsupported claims before publication in the final rendered page (e1).";
const mechanism = "Inputs move through capture validation and deterministic assembly because each stage preserves provenance before emitting accessible static output for users online (e2).";
const validArticleIR = `§lede:20
${lede}

§mechanism:21
${mechanism}

§links
up|page:parent|Parent guide

§schema
HowTo|totalTime:PT1H`;

function contract(pageId = "page:guide", route = "/guide") {
  return emitPageContract({
    id: `contract:${pageId}`,
    pageId,
    route,
    canonicalUrl: `https://example.com${route}`,
    canonicalQuestion: "How does the system work?",
    intent: "Explain the evidence-bound mechanism",
    titleHint: "Mechanism Guide",
    voice: ["precise", "direct"],
    entities: [
      { id: "service", kind: "S", label: "Automation", detail: "Automates bounded work" },
      { id: "problem", kind: "P", label: "Manual delay", detail: "Manual delay blocks throughput" },
    ],
    edges: [{ fromId: "service", toId: "problem", relation: "resolves" }],
    mechanismSteps: ["capture input", "validate state", "emit output"],
    constraints: ["fails without source data"],
    evidence: [
      { id: "e1", sourceId: "source:1", statement: "Measured source fact", url: "https://example.com/source-1" },
      { id: "e2", sourceId: "source:2", statement: "Second source fact", url: "https://example.com/source-2" },
    ],
    sections: [
      { id: "lede", heading: "The result", targetWords: 20, requiredEvidenceIds: ["e1"] },
      { id: "mechanism", heading: "How it works", targetWords: 21, requiredEvidenceIds: ["e2"] },
    ],
    mandatoryPatterns: [{ id: "causal", pattern: "because" }],
    forbiddenPatterns: [{ id: "slop", pattern: "furthermore" }],
    links: [{ relation: "up", pageId: "page:parent", route: "/parent", anchorText: "Parent guide" }],
    schema: { type: "HowTo", fields: { totalTime: "PT1H" } },
    sourceIds: ["source:2", "source:1"],
    designAuthorityHash: "design:hash",
    ontologyHash: "ontology:hash",
    seedHash: `seed:${pageId}`,
  });
}

test("PCN is deterministic compiler state, not a prompt-authored page plan", () => {
  const first = contract();
  const second = contract();
  assert.equal(first.contractHash, second.contractHash);
  assert.equal(first.pcnHash, second.pcnHash);
  assert.match(first.pcn, /#causal_chain/);
  assert.match(first.pcn, /sections:lede\|mechanism/);
});

test("compiler artifacts lower directly into PCN", () => {
  const emitted = emitPageContractFromCompilerState({
    seed: {
      id: "page:compiler",
      route: "/compiler",
      canonicalQuestion: "How is compiler state lowered?",
      intent: "Explain deterministic lowering",
      serviceOfferIds: ["service"],
      topicProblemIds: ["problem"],
      workflowIntegrationIds: ["workflow"],
      desiredOutcomeIds: ["outcome"],
      primaryPrototypeId: "prototype:1",
      prototypes: [{ id: "prototype:1", feature_atoms: [{ dimension: "industry", value: "contractors", source_id: "source:1", provenance: "authored" }] }],
      evidenceIds: ["e1", "e2"],
      sourceIds: ["source:1", "source:2"],
      informationObjectIds: ["info:1"],
      utilityOrTaskContractIds: [],
      requiredModuleKinds: ["workflow"],
      requiredLayoutRoles: ["lead"],
      requiredCapabilities: ["semantic-hierarchy"],
      graphEdges: [],
      conversionPathId: "conversion:1",
      commercialValue: 1,
      lifecycleCost: 1,
      rareGroupIds: [],
      eligibility: { requiredSharedDimensions: ["industry"], excludedAtomSets: [] },
    },
    ontology: {
      id: "ontology:1", version: "1", generatedBy: "fixture", sourceIds: ["source:1"],
      attributes: [
        { id: "service", label: "Automation", description: "Automates work" },
        { id: "problem", label: "Delay", description: "Manual delay" },
        { id: "workflow", label: "Validation", description: "Validates state" },
        { id: "outcome", label: "Published page", description: "Produces the page" },
      ],
      relations: [{ fromAttributeId: "service", toAttributeId: "problem", type: "supports-topic" }],
      ontologyHash: "ontology:hash",
    },
    evidenceLedger: [
      { id: "e1", sourceIds: ["source:1"], statement: "Measured source fact" },
      { id: "e2", sourceIds: ["source:2"], statement: "Second source fact" },
    ],
    sourceLedger: [
      { id: "source:1", summary: "Measured source fact", uri: "https://example.com/source-1" },
      { id: "source:2", summary: "Second source fact", uri: "https://example.com/source-2" },
    ],
    design: { authorityHash: "design:hash" },
    baseUrl: "https://example.com",
    voice: ["direct", "mechanistic"],
    sections: contract().contract.sections,
    links: contract().contract.links,
    mandatoryPatterns: contract().contract.mandatoryPatterns,
    forbiddenPatterns: contract().contract.forbiddenPatterns,
    schema: contract().contract.schema,
  });
  assert.match(emitted.pcn, /I:context:industry:contractors/);
  assert.match(emitted.pcn, /service->problem:supports-topic/);
});

test("ArticleIR parser enforces sections, evidence, prose rules, links, and schema", () => {
  const emitted = contract();
  const article = parseArticleIR(validArticleIR, emitted);
  assert.equal(article.wordCount, 41);
  assert.deepEqual(article.citationIds, ["e1", "e2"]);

  const unknownEvidence = validateArticleIR(validArticleIR.replace("(e2)", "(e999)"), emitted);
  assert.equal(unknownEvidence.article, null);
  assert.ok(unknownEvidence.errors.some((error) => error.includes("unknown evidence e999")));

  const slop = validateArticleIR(validArticleIR.replace("The system", "Furthermore the system"), emitted);
  assert.equal(slop.article, null);
  assert.ok(slop.errors.some((error) => error.includes("forbidden pattern matched: slop")));
});

test("unfolder emits real static artifacts and no runtime generation", () => {
  const emitted = contract();
  const article = parseArticleIR(validArticleIR, emitted);
  const artifact = unfoldArticleIR(article, emitted, { id: "design", authorityHash: "design:hash", siteName: "Example" });
  assert.match(artifact.markdown, /\[\^e1\]/);
  assert.match(artifact.html, /<main data-page-id="page:guide"/);
  assert.match(artifact.html, /application\/ld\+json/);
  assert.match(artifact.html, /noindex,nofollow/);
  assert.equal(artifact.sitemapEntry, null);
  assert.equal(artifact.jsonLd["@type"], "HowTo");
});

test("GLM batch backend repairs invalid ArticleIR before deterministic unfolding", async () => {
  const emitted = contract();
  let calls = 0;
  const provider = new ZaiGlmProvider({ apiKey: "", maximumRepairAttempts: 1 }, {
    id: "articleir-fixture",
    async complete(request) {
      calls += 1;
      const articleIR = calls === 1 ? validArticleIR.replace("(e2)", "(e999)") : validArticleIR;
      return {
        requestId: `${request.id}:${calls}`,
        model: "fixture-model",
        content: JSON.stringify({ articles: [{ pageId: emitted.contract.pageId, articleIR }] }),
        finishReason: "stop",
        usage,
      };
    },
  });
  const result = await lowerPageContractBatch(provider, {
    requestId: "backend:fixture",
    contracts: [{ emitted }],
    design: { id: "design", authorityHash: "design:hash", siteName: "Example" },
  });
  assert.equal(calls, 2);
  assert.equal(result.attempts, 2);
  assert.equal(result.pages.length, 1);
  assert.match(result.pages[0].artifact.html, /Mechanism Guide/);
});
