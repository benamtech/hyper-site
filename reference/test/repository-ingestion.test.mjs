import assert from "node:assert/strict";
import test from "node:test";
import { ingestRepositoryProject } from "../dist/index.js";

const config = `
project:
  id: real-repository-fixture
  version: "1"
  business:
    purpose: Generate a static noindex reference site from approved business truth.
    services: [Repository-aware site generation]
    offers: []
    audiences: [Technical operators]
    locations: []
    workflows: [Source ingestion, Static compilation]
    integrations: []
    constraints: [No invented business truth]
    proofPoints: [Repository fixture is covered by deterministic tests]
    pricingFacts: [No pricing is declared]
  brand:
    name: Hyper Site Fixture
    voice: [technical, precise]
    prohibitedLanguage: [guaranteed rankings]
    palette: { foreground: "#111111", background: "#ffffff" }
    typography: [system-ui]
    visualRules: [static-first]
    componentRules: [semantic HTML]
  technical:
    repositoryRoot: .
    framework: TypeScript static compiler
    deploymentTarget: static files
    browserTargets: [defaults]
    performanceBudgets: { planningMilliseconds: 10000 }
    accessibilityStandard: WCAG 2.2 AA
  goals:
    primaryConversions: [Review generated plan]
    searchOutcomes: []
    utilityOutcomes: [Produce deterministic artifacts]
    publicationRiskTolerance: low
    minimumInitialPages: 1
    maximumInitialPages: 10
sources:
  - id: source:readme
    kind: repository
    title: Fixture README
    summary: Repository fixture describing the bounded compiler.
    path: README.md
    applicability: [business, brand, technical, goals]
    confidence: verified
assets: []
fieldEvidence:
  business.purpose: [source:readme]
  business.services: [source:readme]
  business.offers: [source:readme]
  business.audiences: [source:readme]
  business.locations: [source:readme]
  business.workflows: [source:readme]
  business.integrations: [source:readme]
  business.constraints: [source:readme]
  business.proofPoints: [source:readme]
  business.pricingFacts: [source:readme]
  brand: [source:readme]
  technical: [source:readme]
  goals: [source:readme]
`;

function snapshot(files) {
  return {
    repositoryRoot: ".",
    capturedAt: "2026-07-18T00:00:00Z",
    revision: "fixture-revision",
    files,
  };
}

test("repository ingestion is deterministic under file ordering", () => {
  const files = [
    { path: "hyper-site.project.yaml", content: config },
    { path: "README.md", content: "# Bounded compiler\nApproved fixture truth." },
  ];
  const first = ingestRepositoryProject(snapshot(files));
  const second = ingestRepositoryProject(snapshot([...files].reverse()));
  assert.equal(first.ingestionHash, second.ingestionHash);
  assert.equal(first.project.validation.passes, true);
  assert.equal(first.project.sourceLedger[0].uri, "repo://README.md");
  assert.equal(first.fieldEvidence.length, 13);
});

test("repository ingestion rejects missing declared bytes", () => {
  assert.throws(
    () => ingestRepositoryProject(snapshot([{ path: "hyper-site.project.yaml", content: config }])),
    /declared source file not found: README.md/,
  );
});

test("repository ingestion rejects unsupported promoted fields", () => {
  const invalid = config.replace("  goals: [source:readme]\n", "");
  assert.throws(
    () => ingestRepositoryProject(snapshot([
      { path: "hyper-site.project.yaml", content: invalid },
      { path: "README.md", content: "fixture" },
    ])),
    /fieldEvidence is required for goals/,
  );
});

test("repository ingestion never infers missing business truth from prose", () => {
  const invalid = config.replace("    purpose: Generate a static noindex reference site from approved business truth.\n", "    purpose: ''\n");
  assert.throws(
    () => ingestRepositoryProject(snapshot([
      { path: "hyper-site.project.yaml", content: invalid },
      { path: "README.md", content: "This prose mentions a business purpose but is not promoted automatically." },
    ])),
    /explicit business purpose is required/,
  );
});
