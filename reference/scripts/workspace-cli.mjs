import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  appendAgentWorkspaceArtifact,
  createAgentWorkspaceSnapshot,
  planAgentWorkspaceInvalidation,
  replaceAgentWorkspaceArtifact,
  summarizeWorkspaceLifecycle,
} from "../dist/index.js";

const [command = "help", ...args] = process.argv.slice(2);

try {
  switch (command) {
    case "init": {
      const input = readJson(required(args[0], "init requires an input JSON path"));
      const output = required(args[1], "init requires an output workspace path");
      const snapshot = createAgentWorkspaceSnapshot(input);
      atomicJson(output, snapshot);
      print({ command, output: resolve(output), workspaceHash: snapshot.snapshotHash });
      break;
    }
    case "append": {
      const snapshot = readJson(required(args[0], "append requires a workspace JSON path"));
      const artifact = readJson(required(args[1], "append requires an artifact JSON path"));
      const version = required(args[2], "append requires a next version");
      const output = required(args[3], "append requires an output workspace path");
      const next = appendAgentWorkspaceArtifact(snapshot, artifact, version, new Date().toISOString());
      atomicJson(output, next);
      print({ command, output: resolve(output), priorSnapshotHash: next.priorSnapshotHash, workspaceHash: next.snapshotHash });
      break;
    }
    case "replace": {
      const snapshot = readJson(required(args[0], "replace requires a workspace JSON path"));
      const artifact = readJson(required(args[1], "replace requires an artifact JSON path"));
      const version = required(args[2], "replace requires a next version");
      const output = required(args[3], "replace requires an output workspace path");
      const next = replaceAgentWorkspaceArtifact(snapshot, artifact, version, new Date().toISOString());
      atomicJson(output, next);
      print({ command, output: resolve(output), priorSnapshotHash: next.priorSnapshotHash, workspaceHash: next.snapshotHash });
      break;
    }
    case "invalidate": {
      const snapshot = readJson(required(args[0], "invalidate requires a workspace JSON path"));
      const changed = readJson(required(args[1], "invalidate requires a changed-artifact ID array"));
      if (!Array.isArray(changed)) throw new Error("changed-artifact input must be a JSON array");
      const output = required(args[2], "invalidate requires an output plan path");
      const plan = planAgentWorkspaceInvalidation(snapshot, changed);
      atomicJson(output, plan);
      print({ command, output: resolve(output), planHash: plan.planHash, invalidatedArtifacts: plan.invalidatedArtifactIds.length, unaffectedArtifacts: plan.unaffectedArtifactIds.length });
      break;
    }
    case "summary": {
      const snapshot = readJson(required(args[0], "summary requires a workspace JSON path"));
      print({ workspaceHash: snapshot.snapshotHash, lifecycle: summarizeWorkspaceLifecycle(snapshot) });
      break;
    }
    case "help":
    case "--help":
    case "-h":
      console.log(`Hyper Site agent workspace CLI

Commands:
  init <workspace-input.json> <workspace.json>
  append <workspace.json> <artifact.json> <next-version> <next-workspace.json>
  replace <workspace.json> <artifact.json> <next-version> <next-workspace.json>
  invalidate <workspace.json> <changed-artifact-ids.json> <plan.json>
  summary <workspace.json>

Every mutation creates a new immutable snapshot linked to the prior snapshot hash. Invalidation traverses declared artifact dependencies and identifies unaffected artifacts that must remain unchanged.`);
      break;
    default:
      throw new Error(`unknown workspace command ${command}`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}

function readJson(path) {
  return JSON.parse(readFileSync(resolve(path), "utf8"));
}

function atomicJson(path, value) {
  const target = resolve(path);
  mkdirSync(resolve(target, ".."), { recursive: true });
  const temporary = `${target}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`);
  renameSync(temporary, target);
}

function required(value, message) {
  if (!value) throw new Error(message);
  return value;
}

function print(value) {
  console.log(JSON.stringify(value, null, 2));
}
