import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  evaluateNearAlphaFramework,
  evaluateNearAlphaReleaseCandidate,
} from "../dist/index.js";

const [command = "help", inputPath, outputPath] = process.argv.slice(2);

try {
  switch (command) {
    case "evaluate": {
      const input = readJson(required(inputPath, "evaluate requires an input JSON path"));
      const result = evaluateNearAlphaFramework(input);
      writeResult(required(outputPath, "evaluate requires an output JSON path"), result);
      console.log(JSON.stringify({ mode: command, evaluationHash: result.evaluationHash, passes: result.validation.passes, hardFailures: result.validation.hardFailures, pending: result.validation.pending }, null, 2));
      if (!result.validation.passes) process.exitCode = 1;
      break;
    }
    case "release": {
      const input = readJson(required(inputPath, "release requires an input JSON path"));
      const result = evaluateNearAlphaReleaseCandidate(input);
      writeResult(required(outputPath, "release requires an output JSON path"), result);
      console.log(JSON.stringify({ mode: command, evaluationHash: result.evaluationHash, passes: true }, null, 2));
      break;
    }
    case "help":
    case "--help":
    case "-h":
      console.log(`Hyper Site near-alpha evaluation CLI

Commands:
  evaluate <evaluation-input.json> <evaluation-result.json>
      Run the research evaluation and preserve all pass, fail, and pending gates.

  release <evaluation-input.json> <release-result.json>
      Hard-require a complete non-synthetic case study and zero failed or pending validation gates.

The CLI never creates baseline or case-study evidence. It only validates supplied, versioned artifacts.`);
      break;
    default:
      throw new Error(`unknown near-alpha command ${command}`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}

function readJson(path) {
  return JSON.parse(readFileSync(resolve(path), "utf8"));
}

function writeResult(path, value) {
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
