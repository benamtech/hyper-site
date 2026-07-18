import assert from "node:assert/strict";
import test from "node:test";

import { DESIGN_CAPABILITIES as CONTENT_CAPABILITIES } from "../dist/benchmark.js";
import { compileSite as compileLegacySite } from "../dist/framework.js";
import { DESIGN_CAPABILITIES as SITE_CAPABILITIES, compileSite as compileCoreSite } from "../dist/framework-core.js";

function fixture() {
  return {
    baseUrl: "https://example.com",
    evidence: [{ id: "e:1", level: 4, summary: "primary evidence" }],
    claims: [{ id: "c:1", text: "Supported claim.", evidenceIds: ["e:1"], requiredLevel: 2 }],
    informationObjects: [{ id: "i:1", kind: "workflow", title: "Workflow", body: "Do the work.", evidenceIds: ["e:1"] }],
    modules: [{ id: "m:1", kind: "answer", layoutRole: "lead", heading: "Answer", body: "Body.", claimIds: ["c:1"], informationObjectIds: ["i:1"], requiredCapabilities: ["semantic-hierarchy"], sourceIds: ["e:1"] }],
    pages: [{ id: "p:1", route: "/", canonicalQuestion: "What is the answer?", title: "Answer", description: "A supported answer.", features: { intent: "answer" }, moduleIds: ["m:1"], internalPageIds: [], requiredCapabilities: [], instructionPointers: ["/instructions/p-1.md"], indexable: true }],
  };
}

function withoutGeometry(source) {
  return {
    ...source,
    pages: source.pages.map(({ features, vectorPrototypes, primaryPrototypeId, ...page }) => page),
  };
}

test("content-neutral compiler preserves legacy web artifacts before vector packing", () => {
  const source = fixture();
  const core = compileCoreSite(withoutGeometry(source));
  const legacy = compileLegacySite(source, 64);

  assert.equal("packed" in core, false);
  assert.equal("packed" in legacy, true);
  assert.equal(core.sitemapXml, legacy.sitemapXml);
  assert.deepEqual(
    core.pages.map(({ html, instructionMarkdown, sha256 }) => ({ html, instructionMarkdown, sha256 })),
    legacy.pages.map(({ html, instructionMarkdown, sha256 }) => ({ html, instructionMarkdown, sha256 })),
  );
});

test("content-neutral compilation is deterministic under source reordering", () => {
  const source = withoutGeometry(fixture());
  const first = compileCoreSite(source);
  const second = compileCoreSite({
    ...source,
    evidence: [...source.evidence].reverse(),
    claims: [...source.claims].reverse(),
    informationObjects: [...source.informationObjects].reverse(),
    modules: [...source.modules].reverse(),
    pages: [...source.pages].reverse(),
  });
  assert.equal(first.buildHash, second.buildHash);
});

test("design capability contracts remain in parity during migration", () => {
  assert.deepEqual(SITE_CAPABILITIES, CONTENT_CAPABILITIES);
});
