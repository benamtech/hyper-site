import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { extname, join, relative, resolve, sep } from "node:path";
import { execFileSync } from "node:child_process";
import {
  SnapshotCheckpointStore,
  ZaiGlmProvider,
  assertValidationPass,
  assessAppliance,
  compileApprovedDesignAuthority,
  createMinimumApplianceContract,
  createOpenAiCompatibleEmbeddingBackend,
  generateProductionCohort,
  ingestRepositoryProject,
  normalizeProjectInput,
  prepareApprovedProductionProgram,
} from "../dist/index.js";

const [command = "help", ...args] = process.argv.slice(2);

try {
  switch (command) {
    case "doctor":
      doctor(args);
      break;
    case "ingest":
      ingest(args);
      break;
    case "provider-check":
      await providerCheck(args);
      break;
    case "run":
      await runProduction(args);
      break;
    case "help":
    case "--help":
    case "-h":
      printHelp();
      break;
    default:
      throw new Error(`unknown production command ${command}`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}

function doctor(args) {
  const probePath = requiredArg(args[0], "doctor requires an appliance probe JSON path");
  const probe = readJson(probePath);
  const assessment = assessAppliance(probe, createMinimumApplianceContract());
  console.log(JSON.stringify(assessment, null, 2));
  assertValidationPass(assessment.validation);
}

function ingest(args) {
  const repositoryRoot = resolve(requiredArg(args[0], "ingest requires a repository root"));
  const configPath = args[1] ?? "hyper-site.project.yaml";
  const outputPath = resolve(args[2] ?? "generated-operator/repository-ingestion.json");
  const files = captureRepository(repositoryRoot);
  const snapshot = {
    repositoryRoot,
    capturedAt: new Date().toISOString(),
    revision: repositoryRevision(repositoryRoot, files),
    files,
  };
  const result = ingestRepositoryProject(snapshot, configPath);
  atomicWriteJson(outputPath, result);
  console.log(JSON.stringify({ outputPath, ingestionHash: result.ingestionHash, projectHash: result.project.projectHash, sources: result.project.sourceLedger.length, assets: result.project.assetLedger.length }, null, 2));
}

async function providerCheck(args) {
  const model = args[0] ?? process.env.ZAI_MODEL ?? "glm-5.2";
  const provider = providerFromEnvironment(model);
  const result = await provider.generate({
    id: `provider-check:${Date.now()}`,
    stage: "stage-1-ontology",
    systemPrompt: "Return a single JSON object. Do not include prose outside the object.",
    userPrompt: 'Return exactly {"status":"ok"}.',
    schemaName: "ProviderHealth",
    schema: { type: "object", additionalProperties: false, required: ["status"], properties: { status: { const: "ok" } } },
    sourceIds: ["operator:provider-check"],
    maximumOutputTokens: 128,
  }, (value) => value?.status === "ok" ? [] : ["status must equal ok"]);
  console.log(JSON.stringify({ providerId: provider.id, model: result.model, attempts: result.attempts, usage: result.usage, validation: result.validation }, null, 2));
}

async function runProduction(args) {
  const configPath = resolve(requiredArg(args[0], "run requires a production-run JSON path"));
  const outputRoot = resolve(args[1] ?? "generated-production-site");
  const config = readJson(configPath);
  const project = normalizeProjectInput(config.project);
  assertValidationPass(project.validation);
  const design = compileApprovedDesignAuthority(
    config.designDraft,
    config.designApproval,
    new Set(project.sourceLedger.map((item) => item.id)),
  );
  assertValidationPass(design.validation);
  const prepared = prepareApprovedProductionProgram({
    project: config.project,
    proposal: config.ontologyProposal,
    approval: config.ontologyApproval,
    vectorIdentity: config.vectorIdentity,
    ...(config.ontologyPolicy === undefined ? {} : { ontologyPolicy: config.ontologyPolicy }),
    ...(config.graphPolicy === undefined ? {} : { graphPolicy: config.graphPolicy }),
    ...(config.opportunityPolicy === undefined ? {} : { opportunityPolicy: config.opportunityPolicy }),
    ...(config.siteGenerationPolicy === undefined ? {} : { siteGenerationPolicy: config.siteGenerationPolicy }),
  });
  const provider = providerFromEnvironment(config.model ?? process.env.ZAI_MODEL ?? "glm-5.2", config.provider);
  const embedding = config.embedding;
  if (!embedding?.endpoint || !embedding?.model) throw new Error("run config requires a local OpenAI-compatible embedding endpoint and model");
  const embeddingBackend = createOpenAiCompatibleEmbeddingBackend({
    id: embedding.id ?? `local:${embedding.model}`,
    endpoint: embedding.endpoint,
    model: embedding.model,
    ...(embedding.apiKeyEnv && process.env[embedding.apiKeyEnv] ? { apiKey: process.env[embedding.apiKeyEnv] } : {}),
    ...(embedding.batchSize === undefined ? {} : { batchSize: embedding.batchSize }),
    ...(embedding.timeoutMilliseconds === undefined ? {} : { timeoutMilliseconds: embedding.timeoutMilliseconds }),
  });
  const checkpointPath = resolve(config.checkpointPath ?? join(outputRoot, "checkpoints.json"));
  const checkpoints = new FileCheckpointStore(checkpointPath);
  const result = await generateProductionCohort({
    runId: config.runId,
    provider,
    prepared,
    design,
    sourceExcerpts: config.sourceExcerpts,
    checkpoints,
    embeddingBackend,
    baseUrl: config.baseUrl,
    generatedAt: config.generatedAt ?? new Date().toISOString(),
    ...(config.corpusPolicy === undefined ? {} : { corpusPolicy: config.corpusPolicy }),
  });
  emitStaticSite(outputRoot, result);
  console.log(JSON.stringify({
    outputRoot,
    runId: result.runId,
    runHash: result.runHash,
    transactionHash: result.transaction.transactionHash,
    buildHash: result.transaction.site.buildHash,
    corpusHash: result.corpus.validationHash,
    pages: result.transaction.site.pages.length,
    generatedBatchCount: result.generatedBatchCount,
    resumedBatchCount: result.resumedBatchCount,
    checkpointPath,
  }, null, 2));
}

class FileCheckpointStore {
  constructor(path) {
    this.path = path;
    const initial = existsSync(path) ? readJson(path) : [];
    if (!Array.isArray(initial)) throw new Error("checkpoint file must contain an array");
    this.store = new SnapshotCheckpointStore(initial);
  }

  async get(key) {
    return this.store.get(key);
  }

  async put(checkpoint) {
    await this.store.put(checkpoint);
    atomicWriteJson(this.path, this.store.snapshot());
  }

  async list(runId) {
    return this.store.list(runId);
  }
}

function providerFromEnvironment(model, overrides = {}) {
  const apiKeyEnv = overrides.apiKeyEnv ?? "ZAI_API_KEY";
  const apiKey = process.env[apiKeyEnv];
  if (!apiKey) throw new Error(`${apiKeyEnv} is required`);
  return new ZaiGlmProvider({
    apiKey,
    model,
    ...(overrides.baseUrl === undefined ? {} : { baseUrl: overrides.baseUrl }),
    ...(overrides.timeoutMilliseconds === undefined ? {} : { timeoutMilliseconds: overrides.timeoutMilliseconds }),
    ...(overrides.maximumRepairAttempts === undefined ? {} : { maximumRepairAttempts: overrides.maximumRepairAttempts }),
    ...(overrides.defaultTemperature === undefined ? {} : { defaultTemperature: overrides.defaultTemperature }),
    ...(overrides.defaultTopP === undefined ? {} : { defaultTopP: overrides.defaultTopP }),
    ...(overrides.defaultMaximumOutputTokens === undefined ? {} : { defaultMaximumOutputTokens: overrides.defaultMaximumOutputTokens }),
  });
}

function emitStaticSite(outputRoot, result) {
  mkdirSync(outputRoot, { recursive: true });
  const assetsRoot = join(outputRoot, "assets");
  mkdirSync(assetsRoot, { recursive: true });
  writeFileSync(join(assetsRoot, "hyper-site.css"), result.transaction.rendered.css);
  const renderedById = new Map(result.transaction.rendered.pages.map((item) => [item.pageId, item]));
  for (const artifact of result.transaction.site.pages) {
    const rendered = renderedById.get(artifact.page.id);
    if (!rendered) throw new Error(`missing rendered page ${artifact.page.id}`);
    const pagePath = routeOutputPath(outputRoot, artifact.page.route);
    mkdirSync(resolve(pagePath, ".."), { recursive: true });
    writeFileSync(pagePath, rendered.html);
    if (artifact.instructionMarkdown) {
      const instructionPath = join(outputRoot, "instructions", `${encodeURIComponent(artifact.page.id)}.md`);
      mkdirSync(resolve(instructionPath, ".."), { recursive: true });
      writeFileSync(instructionPath, artifact.instructionMarkdown);
    }
  }
  writeFileSync(join(outputRoot, "sitemap.xml"), result.transaction.site.sitemapXml);
  atomicWriteJson(join(outputRoot, "generation-report.json"), {
    runId: result.runId,
    runHash: result.runHash,
    validation: result.validation,
    transactionHash: result.transaction.transactionHash,
    transactionValidation: result.transaction.validation,
    buildHash: result.transaction.site.buildHash,
    renderedSiteHash: result.transaction.rendered.siteHash,
    corpus: result.corpus,
    checkpoints: result.checkpoints.map((item) => ({ key: item.key, stage: item.stage, checkpointHash: item.checkpointHash, dependencyHashes: item.dependencyHashes })),
  });
}

function routeOutputPath(root, route) {
  if (!route.startsWith("/") || route.split("/").includes("..")) throw new Error(`invalid output route ${route}`);
  if (route === "/") return join(root, "index.html");
  return join(root, ...route.split("/").filter(Boolean), "index.html");
}

function captureRepository(root) {
  const files = [];
  for (const path of walk(root)) {
    const relativePath = relative(root, path).split(sep).join("/");
    if (relativePath.startsWith(".git/") || relativePath.startsWith("node_modules/") || relativePath.startsWith("dist/")) continue;
    const stats = statSync(path);
    if (!stats.isFile() || stats.size > 5_000_000) continue;
    const extension = extname(path).toLowerCase();
    const text = new Set([".md", ".txt", ".json", ".yaml", ".yml", ".css", ".scss", ".html", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".svg", ".xml", ".csv"]);
    const content = readFileSync(path, text.has(extension) || relativePath === "hyper-site.project.yaml" ? "utf8" : "base64");
    files.push({ path: relativePath, content, mediaType: text.has(extension) ? "text/plain" : "application/base64" });
  }
  return files.sort((left, right) => left.path.localeCompare(right.path));
}

function walk(root) {
  const output = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) output.push(...walk(path));
    else output.push(path);
  }
  return output;
}

function repositoryRevision(root, files) {
  try {
    return execFileSync("git", ["-C", root, "rev-parse", "HEAD"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return `unversioned:${files.length}:${files.map((item) => item.path).join("|")}`;
  }
}

function readJson(path) {
  return JSON.parse(readFileSync(resolve(path), "utf8"));
}

function atomicWriteJson(path, value) {
  const target = resolve(path);
  mkdirSync(resolve(target, ".."), { recursive: true });
  const temporary = `${target}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`);
  renameSync(temporary, target);
}

function requiredArg(value, message) {
  if (!value) throw new Error(message);
  return value;
}

function printHelp() {
  console.log(`Hyper-Site production CLI

Commands:
  doctor <appliance-probe.json>
      Validate an optimized or compatibility-candidate GPU node.

  ingest <repository-root> [config-path] [output.json]
      Capture the local repository and compile explicit hyper-site.project.yaml truth.

  provider-check [model]
      Verify Z.AI JSON transport using ZAI_API_KEY without exposing the key.

  run <production-run.json> [output-directory]
      Run approved Stage 2 batches, local validation, checkpoints, PageIR compilation, and static emission.

The run command requires an operator-approved ontology and design authority. It never self-approves model output.`);
}
