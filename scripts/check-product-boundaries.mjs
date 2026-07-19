import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const readText = (path) => readFile(resolve(root, path), "utf8");
const readJson = async (path) => JSON.parse(await readText(path));

const [
  rootPackage,
  sitePackage,
  contentPackage,
  siteIndex,
  contentIndex,
  frameworkCore,
  siteManifest,
  referenceFrameworkCore,
  referenceSiteManifest,
  frameworkAdapter,
  referenceContentProgramAdapter,
  ownedContentProgramAdapter,
] = await Promise.all([
  readJson("package.json"),
  readJson("hyper-site/package.json"),
  readJson("hyper-content/package.json"),
  readText("hyper-site/index.mjs"),
  readText("hyper-content/index.mjs"),
  readText("hyper-site/src/framework-core.ts"),
  readText("hyper-site/src/site-manifest.ts"),
  readText("reference/src/framework-core.ts"),
  readText("reference/src/site-manifest.ts"),
  readText("reference/src/framework.ts"),
  readText("reference/src/content-program-adapter.ts"),
  readText("hyper-content/src/content-program-adapter.ts"),
]);

const errors = [];
const expectedWorkspaces = ["hyper-content", "hyper-site"];
const actualWorkspaces = [...(rootPackage.workspaces ?? [])].sort();
if (JSON.stringify(actualWorkspaces) !== JSON.stringify(expectedWorkspaces)) errors.push(`root workspaces must be exactly ${expectedWorkspaces.join(", ")}; received ${actualWorkspaces.join(", ")}`);
if (sitePackage.name !== "@amtech/hyper-site") errors.push("hyper-site package name is incorrect");
if (contentPackage.name !== "@amtech/hyper-content") errors.push("hyper-content package name is incorrect");

const contentDependencies = { ...(contentPackage.dependencies ?? {}), ...(contentPackage.peerDependencies ?? {}), ...(contentPackage.devDependencies ?? {}) };
if (!("@amtech/hyper-site" in contentDependencies)) errors.push("hyper-content must depend on hyper-site");
const siteDependencies = { ...(sitePackage.dependencies ?? {}), ...(sitePackage.peerDependencies ?? {}), ...(sitePackage.devDependencies ?? {}) };
if ("@amtech/hyper-content" in siteDependencies) errors.push("hyper-site must not depend on hyper-content");

const forbiddenSiteSurface = [
  "ontology", "context-corpus", "sparse-lexical", "opportunity", "site-program", "page-generation",
  "glm-provider", "pcn-emitter", "articleir-parser", "unfolder", "wasm", "content-program-adapter", "../reference",
];
for (const token of forbiddenSiteSurface) if (siteIndex.includes(token)) errors.push(`hyper-site public facade leaks forbidden content or compatibility token: ${token}`);
for (const required of ["framework-core", "site-manifest", "browser-targets", "css-modern"]) if (!siteIndex.includes(`./dist/${required}.js`)) errors.push(`hyper-site public facade is missing package-owned ${required}`);

const forbiddenCoreImports = ['from "./benchmark.js"', 'from "./core.js"', 'from "./manifest.js"', 'from "./wasm.js"', "ontology", "provider", "vectorIdentity", "vectorPrototypes", "packSite"];
for (const token of forbiddenCoreImports) if (frameworkCore.includes(token)) errors.push(`framework core contains forbidden content dependency or field: ${token}`);
for (const token of ["vector_space", "agent_harness", "coverage_policy", "profiles", "feature_atoms", "prototypes", "provider"]) if (siteManifest.includes(token)) errors.push(`site manifest contains content-program field: ${token}`);

if (!referenceFrameworkCore.includes("../../hyper-site/dist/framework-core.js")) errors.push("reference framework-core must consume built Hyper Site source");
if (!referenceSiteManifest.includes("../../hyper-site/dist/site-manifest.js")) errors.push("reference site-manifest must consume built Hyper Site source");
if (!frameworkAdapter.includes('from "./framework-core.js"')) errors.push("legacy framework adapter must delegate through the compatibility wrapper");
if (!frameworkAdapter.includes("compileFrameworkCore")) errors.push("legacy framework adapter does not call the neutral compiler");

if (!ownedContentProgramAdapter.includes("adaptContentProgramSiteSource")) errors.push("Hyper Content must own the SiteSource adapter implementation");
for (const forbidden of ["../reference", "../../reference", "compileFrameworkManifest", "compileHyperSite", "packSite"]) if (ownedContentProgramAdapter.includes(forbidden)) errors.push(`owned Hyper Content adapter contains forbidden compatibility dependency: ${forbidden}`);
if (!referenceContentProgramAdapter.includes("../../hyper-content/dist/content-program-adapter.js")) errors.push("reference compatibility wrapper must consume the built Hyper Content adapter");
if (!referenceContentProgramAdapter.includes("compileContentProgramManifest")) errors.push("reference compatibility wrapper must retain the transitional legacy compiler");
if (!contentIndex.includes('./dist/content-program-adapter.js')) errors.push("hyper-content public facade must export its owned adapter build");

const requiredContentSurface = ["hyper-site", "compileContentSite", "compileContentProgramManifest", "content-program-adapter", "packSite", "pcn-emitter", "articleir-parser", "unfolder", "ontology-graph", "wasm", "manifest"];
for (const token of requiredContentSurface) if (!contentIndex.includes(token)) errors.push(`hyper-content public facade is missing required token: ${token}`);

if (errors.length > 0) {
  console.error(JSON.stringify({ status: "fail", errors }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({
    status: "pass",
    workspaces: actualWorkspaces,
    dependencyDirection: "hyper-content -> hyper-site; reference -> hyper-site",
    neutralFrameworkSource: "hyper-site/src/framework-core.ts",
    neutralManifestSource: "hyper-site/src/site-manifest.ts",
    compatibilityFrameworkWrapper: "reference/src/framework-core.ts",
    contentProgramAdapterAuthority: "hyper-content/src/content-program-adapter.ts",
    contentProgramCompatibilityWrapper: "reference/src/content-program-adapter.ts",
    siteSurfaceForbiddenTokens: forbiddenSiteSurface.length,
    contentSurfaceRequiredTokens: requiredContentSurface.length,
  }, null, 2));
}
