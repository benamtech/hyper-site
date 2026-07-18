import assert from "node:assert/strict";
import test from "node:test";

import * as hyperContent from "../index.mjs";

test("hyper-content targets hyper-site and exposes the content compiler backend", () => {
  for (const required of [
    "compileSite",
    "compileContentSite",
    "packSite",
    "compileApprovedOntology",
    "emitPageContract",
    "emitPageContractFromCompilerState",
    "parseArticleIR",
    "validateArticleIR",
    "unfoldArticleIR",
    "instantiateHyperKernel",
    "generateStageOneOntology",
  ]) {
    assert.equal(typeof hyperContent[required], "function", `${required} is missing from hyper-content`);
  }
});
