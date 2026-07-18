import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const readText = (path) => readFile(resolve(root, path), "utf8");
const readJson = async (path) => JSON.parse(await readText(path));

const [rootPackage, sitePackage, contentPackage, siteIndex, contentIndex] = await Promise.all([
  readJson("package.json"),
  readJson("hyper-site/package.json"),
  readJson("hyper-content/package.json"),
  readText("hyper-site/index.mjs"),
  readText("hyper-content/index.mjs"),
]);

const errors = [];
const expectedWorkspaces = ["hyper-content", "hyper-site"];
const actualWorkspaces = [...(rootPackage.workspaces ?? [])].sort();
if (JSON.stringify(actualWorkspaces) !== JSON.stringify(expectedWorkspaces)) {
  errors.push(`root workspaces must be exactly ${expectedWorkspaces.join(", ")}; received ${actualWorkspaces.join(", ")}`);
}

if (sitePackage.name !== "@amtech/hyper-site") errors.push("hyper-site package name is incorrect");
if (contentPackage.name !== "@amtech/hyper-content") errors.push("hyper-content package name is incorrect");

const contentDependencies = {
  ...(contentPackage.dependencies ?? {}),
  ...(contentPackage.peerDependencies ?? {}),
  ...(contentPackage.devDependencies ?? {}),
};
if (!("@amtech/hyper-site" in contentDependencies)) errors.push("hyper-content must depend on hyper-site");

const siteDependencies = {
  ...(sitePackage.dependencies ?? {}),
  ...(sitePackage.peerDependencies ?? {}),
  ...(sitePackage.devDependencies ?? {}),
};
if ("@amtech/hyper-content" in siteDependencies) errors.push("hyper-site must not depend on hyper-content");

const forbiddenSiteSurface = [
  "ontology",
  "context-corpus",
  "sparse-lexical",
  "opportunity",
  "site-program",
  "page-generation",
  "glm-provider",
  "pcn-emitter",
  "articleir-parser",
  "unfolder",
  "wasm",
  "manifest",
];
for (const token of forbiddenSiteSurface) {
  if (siteIndex.includes(token)) errors.push(`hyper-site public facade leaks forbidden content module token: ${token}`);
}

const requiredContentSurface = [
  "hyper-site",
  "pcn-emitter",
  "articleir-parser",
  "unfolder",
  "ontology-graph",
  "wasm",
  "manifest",
];
for (const token of requiredContentSurface) {
  if (!contentIndex.includes(token)) errors.push(`hyper-content public facade is missing required token: ${token}`);
}

if (errors.length > 0) {
  console.error(JSON.stringify({ status: "fail", errors }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({
    status: "pass",
    workspaces: actualWorkspaces,
    dependencyDirection: "hyper-content -> hyper-site",
    siteSurfaceForbiddenTokens: forbiddenSiteSurface.length,
    contentSurfaceRequiredTokens: requiredContentSurface.length,
  }));
}
