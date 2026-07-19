import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  SnapshotCheckpointStore,
  ZaiGlmProvider,
  runStageOneDiscovery,
} from "../dist/index.js";

const ingestionPath = resolve(required(process.argv[2], "usage: production-stage1 <repository-ingestion.json> <source-excerpts.json> [output-directory]"));
const excerptsPath = resolve(required(process.argv[3], "source-excerpts JSON path is required"));
const outputRoot = resolve(process.argv[4] ?? "generated-stage1");

try {
  const ingestion = readJson(ingestionPath);
  const sourceExcerpts = readJson(excerptsPath);
  if (!ingestion.project?.projectHash) throw new Error("repository ingestion artifact must contain a normalized project");
  if (!Array.isArray(sourceExcerpts) || sourceExcerpts.length === 0) throw new Error("source excerpts must be a non-empty array");
  const apiKey = process.env.ZAI_API_KEY;
  if (!apiKey) throw new Error("ZAI_API_KEY is required");
  const model = process.env.ZAI_MODEL ?? "glm-5.2";
  const provider = new ZaiGlmProvider({
    apiKey,
    model,
    baseUrl: process.env.ZAI_BASE_URL ?? "https://api.z.ai/api/paas/v4",
    maximumRepairAttempts: Number(process.env.ZAI_REPAIR_ATTEMPTS ?? 1),
  });
  mkdirSync(outputRoot, { recursive: true });
  const checkpointPath = join(outputRoot, "stage1-checkpoints.json");
  const initial = existsSync(checkpointPath) ? readJson(checkpointPath) : [];
  const checkpoints = new SnapshotCheckpointStore(initial);
  const runId = process.env.HYPER_SITE_RUN_ID ?? `run:${ingestion.project.input.id}`;
  const generatedAt = process.env.HYPER_SITE_GENERATED_AT ?? new Date().toISOString();
  const result = await runStageOneDiscovery({
    runId,
    requestId: `${runId}:stage-1`,
    proposalId: `ontology:${ingestion.project.input.id}`,
    proposalVersion: ingestion.project.input.version,
    generatedAt,
    project: ingestion.project,
    sourceExcerpts,
    provider,
    checkpoints,
  });
  atomicJson(join(outputRoot, "ontology-proposal.json"), result.proposal);
  atomicJson(join(outputRoot, "stage1-result.json"), {
    runId: result.runId,
    proposalHash: result.proposalHash,
    resumed: result.resumed,
    checkpointHash: result.checkpoint.checkpointHash,
    providerId: provider.id,
  });
  atomicJson(checkpointPath, checkpoints.snapshot());
  console.log(JSON.stringify({ outputRoot, runId, proposalHash: result.proposalHash, resumed: result.resumed, providerId: provider.id }, null, 2));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function atomicJson(path, value) {
  const temporary = `${path}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`);
  renameSync(temporary, path);
}

function required(value, message) {
  if (!value) throw new Error(message);
  return value;
}
