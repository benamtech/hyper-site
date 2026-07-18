import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const readText = (path) => readFile(resolve(root, path), "utf8");
const readJson = async (path) => JSON.parse(await readText(path));

const [rootPackage, sitePackage, contentPackage, siteIndex, contentIndex, frameworkCore, siteManifest, frameworkAdapter, contentProgramAdapter] = await Promise.all([
  readJson("package.json"),
  readJson("hyper-site/package.json"),
  readJson("hyper-content/package.json"),
  readText("hyper-site/index.mjs"),
  readText("hyper-content/index.mjs"),
  readText("reference/src/framework-core.ts"),
  readText("reference/src/site-manifest.ts"),
  readText("reference/src/framework.ts"),
  readText("reference/src/content-program-adapter.ts"),
]);

const errors = [];
const expectedWorkspaces = ["hyper-content", "hyper-site"];
const actualWorkspaces = [...(rootPackage.workspaces ?? [])].sort();
if (JSON.stringify(actualWorkspaces) !== JSON.stringify(expectedWorkspaces)) {
  errors.push(`root workspaces must be exactly ${expectedWorkspaces.join(", ")}; received ${actualWorkspaces.join(", ")}`);
}
if (sitePackage.name !== "@amtech/hyper-site") errors.push("hyper-site package name is incorrect");
if (contentPackage.name !== "@amtech/hyper-content") errors.push("hyper-content package name is incorrect");

const contentDependencies = { ...(contentPackage.dependencies ?? {}), ...(contentPackage.peerDependencies ?? {}), ...(contentPackage.devDependencies ?? {}) };
if (!("@amtech/hyper-site" in contentDependencies)) errors.push("hyper-content must depend on hyper-site");
const siteDependencies = { ...(sitePackage.dependencies ?? {}), ...(sitePackage.peerDependencies ?? {}), ...(sitePackage.devDependencies ?? {}) };
if ("@amtech/hyper-content" in siteDependencies) errors.push("hyper-site must not depend on hyper-content");

const forbiddenSiteSurface = [
  "ontology", "context-corpus", "sparse-lexical", "opportunity", "site-program", "page-generation",
  "glm-provider", "pcn-emitter", "articleir-parser", "unfolder", "wasm", "content-program-adapter",
  "../reference/dist/manifest.js", "../reference/dist/framework.js",
];
for (const token of forbiddenSiteSurface) if (siteIndex.includes(token)) errors.push(`hyper-site public facade leaks forbidden content token: ${token}`);
for (const required of ["framework-core", "site-manifest", "browser-targets", "css-modern"]) {
  if (!siteIndex.includes(required)) errors.push(`hyper-site public facade is missing ${required}`);
}

const forbiddenCoreImports = [
  'from "./benchmark.js"', 'from "./core.js"', 'from "./manifest.js"', 'from "./wasm.js"',
  "ontology", "provider", "vectorIdentity", "vectorPrototypes", "packSite",
];
for (const token of forbiddenCoreImports) if (frameworkCore.includes(token)) errors.push(`framework core contains forbidden content dependency or field: ${token}`);
for (const token of ["vector_space", "agent_harness", "coverage_policy", "profiles", "feature_atoms", "prototypes", "provider"]) {
  if (siteManifest.includes(token)) errors.push(`site manifest contains content-program field: ${token}`);
}
if (!frameworkAdapter.includes('from "./framework-core.js"')) errors.push("legacy framework adapter must delegate to framework-core");
if (!frameworkAdapter.includes("compileFrameworkCore")) errors.push("legacy framework adapter does not call the neutral compiler");
if (!contentProgramAdapter.includes('from "./framework-core.js"')) errors.push("content program adapter must target the neutral Hyper Site contract");
if (!contentProgramAdapter.includes("adaptContentProgramSiteSource")) errors.push("content program adapter must expose an explicit SiteSource adaptation");
if (contentProgramAdapter.includes('from "../hyper-content')) errors.push("content program adapter must not depend on the package that owns it");

const requiredContentSurface = [
  "hyper-site", "compileContentSite", "compileContentProgramManifest", "content-program-adapter",
  "packSite", "pcn-emitter", "articleir-parser", "unfolder", "ontology-graph", "wasm", "manifest",
];
for (const token of requiredContentSurface) if (!contentIndex.includes(token)) errors.push(`hyper-content public facade is missing required token: ${token}`);

if (errors.length > 0) {
  console.error(JSON.stringify({ status: "fail", errors }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({
    status: "pass",
    workspaces: actualWorkspaces,
    dependencyDirection: "hyper-content -> hyper-site",
    neutralFrameworkSource: "reference/src/framework-core.ts",
    neutralManifestSource: "reference/src/site-manifest.ts",
    contentProgramAdapter: "reference/src/content-program-adapter.ts",
    siteSurfaceForbiddenTokens: forbiddenSiteSurface.length,
    contentSurfaceRequiredTokens: requiredContentSurface.length,
  }));
}
