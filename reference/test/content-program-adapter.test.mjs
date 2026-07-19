import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  adaptContentProgramSiteSource,
  compileContentProgramManifest,
} from "../dist/content-program-adapter.js";
import { compileFrameworkManifest } from "../dist/manifest.js";

const manifestText = await readFile(new URL("../../site-manifest.yaml", import.meta.url), "utf8");

test("content program adapter emits a geometry-free Hyper Site source", () => {
  const legacy = compileFrameworkManifest(manifestText);
  const source = adaptContentProgramSiteSource(legacy.source);

  assert.equal("vectorIdentity" in source, false);
  assert.ok(source.pages.length > 0);
  for (const page of source.pages) {
    assert.equal("features" in page, false);
    assert.equal("vectorPrototypes" in page, false);
    assert.equal("primaryPrototypeId" in page, false);
  }
});

test("content program adapter preserves exact Hyper Site web artifacts", () => {
  const compiled = compileContentProgramManifest(manifestText);

  assert.equal(compiled.hyperSite.sitemapXml, compiled.site.sitemapXml);
  assert.equal(compiled.hyperSite.pages.length, compiled.site.pages.length);
  assert.deepEqual(
    compiled.hyperSite.pages.map(({ page, html, instructionMarkdown, sha256 }) => ({ id: page.id, html, instructionMarkdown, sha256 })),
    compiled.site.pages.map(({ page, html, instructionMarkdown, sha256 }) => ({ id: page.id, html, instructionMarkdown, sha256 })),
  );
});
