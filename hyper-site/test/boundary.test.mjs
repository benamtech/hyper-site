import assert from "node:assert/strict";
import test from "node:test";

import * as hyperSite from "../index.mjs";

function manifest() {
  return {
    version: "1",
    base_url: "https://example.com",
    evidence: [{ id: "e:1", level: 4, summary: "source" }],
    claims: [{ id: "c:1", text: "Supported.", evidenceIds: ["e:1"], requiredLevel: 2 }],
    information_objects: [{ id: "i:1", kind: "workflow", title: "Workflow", body: "Steps.", evidenceIds: ["e:1"] }],
    modules: [{ id: "m:1", kind: "answer", layout_role: "lead", claim_ids: ["c:1"], information_object_ids: ["i:1"], required_capabilities: ["semantic-hierarchy"], source_ids: ["e:1"] }],
    pages: [{ id: "p:1", route: "/", canonical_question: "What is Hyper Site?", title: "Hyper Site", description: "A static site.", module_ids: ["m:1"], internal_page_ids: [], required_capabilities: [], indexable: true }],
  };
}

test("hyper-site compiles content-neutral web artifacts without packed content geometry", () => {
  const compiled = hyperSite.compileSiteManifest(manifest());
  assert.equal(typeof hyperSite.compileSite, "function");
  assert.equal(typeof hyperSite.validateDesignSystemSuperset, "function");
  assert.equal(compiled.site.pages.length, 1);
  assert.equal("packed" in compiled.site, false);
  assert.ok(compiled.site.pages[0].html.includes('<link rel="canonical" href="https://example.com/">'));
});

test("hyper-site exposes no content compiler authority", () => {
  for (const forbidden of [
    "compileApprovedOntology",
    "emitPageContract",
    "emitPageContractFromCompilerState",
    "parseArticleIR",
    "unfoldArticleIR",
    "instantiateHyperKernel",
    "generateStageOneOntology",
    "packSite",
    "compileContentSite",
  ]) {
    assert.equal(forbidden in hyperSite, false, `${forbidden} leaked into hyper-site`);
  }
});
