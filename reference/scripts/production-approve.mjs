import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  createDesignApproval,
  createOntologyApproval,
} from "../dist/index.js";

const [kind, artifactPath, reviewPath, outputPath] = process.argv.slice(2);

try {
  if (kind !== "ontology" && kind !== "design") {
    throw new Error("usage: production-approve <ontology|design> <artifact.json> <review.json> <output.json>");
  }
  const artifact = readJson(required(artifactPath, "artifact path is required"));
  const review = readJson(required(reviewPath, "review path is required"));
  const output = kind === "ontology"
    ? createOntologyApproval(artifact, {
        reviewerId: review.reviewerId,
        reviewerClass: review.reviewerClass,
        decision: review.decision,
        approvedAt: review.approvedAt,
        approvedSensitiveAttributeIds: review.approvedSensitiveAttributeIds ?? [],
        observations: review.observations ?? [],
        notes: review.notes ?? [],
      })
    : createDesignApproval(artifact, {
        reviewerId: review.reviewerId,
        reviewerClass: review.reviewerClass,
        decision: review.decision,
        approvedAt: review.approvedAt,
        notes: review.notes ?? [],
      });
  const target = resolve(required(outputPath, "output path is required"));
  mkdirSync(resolve(target, ".."), { recursive: true });
  const temporary = `${target}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(output, null, 2)}\n`);
  renameSync(temporary, target);
  console.log(JSON.stringify({ kind, output: target, approvalHash: output.approvalHash, decision: output.decision }, null, 2));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}

function readJson(path) {
  return JSON.parse(readFileSync(resolve(path), "utf8"));
}

function required(value, message) {
  if (!value) throw new Error(message);
  return value;
}
