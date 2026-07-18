import assert from "node:assert/strict";
import test from "node:test";

import * as hyperSite from "../index.mjs";

test("hyper-site exposes framework primitives without content compiler authority", () => {
  assert.equal(typeof hyperSite.compileSite, "function");
  assert.equal(typeof hyperSite.validateDesignSystemSuperset, "function");

  for (const forbidden of [
    "compileApprovedOntology",
    "emitPageContract",
    "emitPageContractFromCompilerState",
    "parseArticleIR",
    "unfoldArticleIR",
    "instantiateHyperKernel",
    "generateStageOneOntology",
  ]) {
    assert.equal(forbidden in hyperSite, false, `${forbidden} leaked into hyper-site`);
  }
});
