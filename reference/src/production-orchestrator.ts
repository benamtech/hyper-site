import type { VectorSpaceIdentity } from "./benchmark.js";
import { sha256 } from "./core.js";
import type { ApprovedDesignAuthority } from "./design-authoring.js";
import {
  applyOntologyApproval,
  generateStageOneOntology,
  generateStageTwoPageBatch,
  hashOntologyProposal,
  type OntologyApprovalRecord,
  type SourceExcerpt,
  type StageOneGenerationInput,
  type StageTwoBatchOutput,
} from "./generation-schemas.js";
import type { ZaiGlmProvider } from "./glm-provider.js";
import {
  commitPageDraftTransaction,
  type CorpusValidationResult,
  type LocalEmbeddingBackend,
  type PageDraftTransaction,
} from "./page-draft-transaction.js";
import {
  validateProductionCorpus,
  type ProductionCorpusValidationPolicy,
} from "./corpus-validation-production.js";
import {
  prepareAgentSiteProgram,
  type PreparedAgentSiteProgram,
} from "./agent-site-orchestrator.js";
import type { AgentOntologyProposal, OntologyCompilerPolicy } from "./ontology-discovery.js";
import type { OntologyGraphPolicy } from "./ontology-graph.js";
import type { OpportunitySpacePolicy } from "./opportunity-space.js";
import type { ProjectInput } from "./project-input.js";
import type { SparseSiteGenerationPolicy } from "./site-program-optimized.js";
import {
  assertValidationPass,
  buildValidationReport,
  finding,
  type ValidationAttribute,
  type ValidationReport,
} from "./validation-contracts.js";

export type CheckpointStage = "stage-1-ontology" | "stage-2-page-batch" | "transaction" | "corpus-validation";

export interface GenerationCheckpoint<T = unknown> {
  key: string;
  runId: string;
  stage: CheckpointStage;
  accepted: true;
  payload: T;
  payloadHash: string;
  dependencyHashes: Readonly<Record<string, string>>;
  createdAt: string;
  checkpointHash: string;
}

export interface GenerationCheckpointStore {
  get<T>(key: string): Promise<GenerationCheckpoint<T> | null>;
  put<T>(checkpoint: GenerationCheckpoint<T>): Promise<void>;
  list(runId: string): Promise<readonly GenerationCheckpoint[]>;
}

export class SnapshotCheckpointStore implements GenerationCheckpointStore {
  private readonly checkpoints = new Map<string, GenerationCheckpoint>();

  constructor(initial: readonly GenerationCheckpoint[] = []) {
    for (const checkpoint of initial) {
      validateCheckpoint(checkpoint);
      if (this.checkpoints.has(checkpoint.key)) throw new Error(`duplicate checkpoint ${checkpoint.key}`);
      this.checkpoints.set(checkpoint.key, checkpoint);
    }
  }

  async get<T>(key: string): Promise<GenerationCheckpoint<T> | null> {
    return (this.checkpoints.get(key) as GenerationCheckpoint<T> | undefined) ?? null;
  }

  async put<T>(checkpoint: GenerationCheckpoint<T>): Promise<void> {
    validateCheckpoint(checkpoint);
    const existing = this.checkpoints.get(checkpoint.key);
    if (existing && existing.checkpointHash !== checkpoint.checkpointHash) throw new Error(`checkpoint ${checkpoint.key} is immutable`);
    this.checkpoints.set(checkpoint.key, checkpoint);
  }

  async list(runId: string): Promise<readonly GenerationCheckpoint[]> {
    return [...this.checkpoints.values()].filter((item) => item.runId === runId).sort((left, right) => left.key.localeCompare(right.key));
  }

  snapshot(): readonly GenerationCheckpoint[] {
    return [...this.checkpoints.values()].sort((left, right) => left.key.localeCompare(right.key));
  }
}

export interface StageOneDiscoveryResult {
  runId: string;
  proposal: AgentOntologyProposal;
  proposalHash: string;
  checkpoint: GenerationCheckpoint<AgentOntologyProposal>;
  resumed: boolean;
}

export interface ProductionGenerationResult {
  runId: string;
  prepared: PreparedAgentSiteProgram;
  transaction: PageDraftTransaction;
  corpus: CorpusValidationResult;
  generatedBatchCount: number;
  resumedBatchCount: number;
  checkpoints: readonly GenerationCheckpoint[];
  validation: ValidationReport;
  runHash: string;
}

export const PRODUCTION_ORCHESTRATION_VALIDATION: readonly ValidationAttribute[] = [
  {
    id: "production.physical-stages",
    feature: "Two-stage physical model topology",
    workflowStep: "orchestrate",
    algorithmChoice: "one Stage-1 ontology request plus bounded Stage-2 page batches; Stage 3 remains conditional",
    userEffect: "the operator does not pay for seven independent model calls per page",
    developerEffect: "conceptual compiler passes remain deterministic code rather than API round trips",
    validationVector: ["Stage-1 checkpoint", "Stage-2 batch checkpoints", "optional reviewer outside acceptance"],
    passVector: ["one accepted Stage-1", "every batch accepted once"],
    failVector: ["per-page multi-pass loop", "missing batch", "model review controls acceptance"],
    simplerBaseline: "one prompt per conceptual pass",
    severity: "hard",
  },
  {
    id: "production.recovery",
    feature: "Interruption-safe accepted-work recovery",
    workflowStep: "resume",
    algorithmChoice: "immutable dependency-bound checkpoints",
    userEffect: "accepted ontology and page batches are not regenerated after interruption",
    developerEffect: "resume behavior is deterministic and externally persistable",
    validationVector: ["checkpoint key", "payload hash", "source hash", "prior accepted batch hashes", "dependency hashes"],
    passVector: ["matching checkpoint reused", "stale dependency rejected"],
    failVector: ["accepted batch regenerated", "checkpoint overwritten", "stale output reused"],
    simplerBaseline: "restart whole site run",
    severity: "hard",
  },
  {
    id: "production.transaction",
    feature: "Canonical output transaction",
    workflowStep: "commit",
    algorithmChoice: "all accepted batches converge on the existing PageConcept, SiteSource, PageIR, and static compiler",
    userEffect: "the result is a deployable noindex review site rather than disconnected model output",
    developerEffect: "one transaction and one build hash remain authoritative",
    validationVector: ["transaction validation", "render validation", "transaction hash"],
    passVector: ["atomic transaction passes"],
    failVector: ["parallel PageIR", "partial output", "unvalidated HTML"],
    simplerBaseline: "write model artifacts directly",
    severity: "hard",
  },
  {
    id: "production.corpus",
    feature: "Independent local corpus acceptance",
    workflowStep: "validate",
    algorithmChoice: "bounded sparse lexical plus local semantic, evidence, information, and crawl gates",
    userEffect: "the generated cohort is rejected when it is duplicative or structurally incomplete",
    developerEffect: "GLM cannot accept its own corpus",
    validationVector: ["corpus report", "local embedding backend", "policy hash", "render checks"],
    passVector: ["all hard corpus gates pass"],
    failVector: ["semantic backend absent", "duplicate pair", "broken render"],
    simplerBaseline: "same-model critique",
    severity: "hard",
  },
  {
    id: "production.scale",
    feature: "One path from 25 to 10K",
    workflowStep: "scale",
    algorithmChoice: "same plan batches, checkpoints, transaction, and validators for every cohort size",
    userEffect: "scale-up does not switch to a lower-quality generation path",
    developerEffect: "25, 100, 500, and 10K fixtures exercise the same contracts",
    validationVector: ["planned jobs", "committed pages", "validated pages"],
    passVector: ["counts match exactly"],
    failVector: ["sample-only acceptance", "special unvalidated 10K emitter"],
    simplerBaseline: "small proof plus synthetic count claim",
    severity: "hard",
  },
];

export async function runStageOneDiscovery(
  input: StageOneGenerationInput & {
    runId: string;
    provider: ZaiGlmProvider;
    checkpoints: GenerationCheckpointStore;
  },
): Promise<StageOneDiscoveryResult> {
  const dependencyHashes = canonicalHashes({
    project: input.project.projectHash,
    sources: sourceExcerptHash(input.sourceExcerpts),
    provider: sha256(input.provider.id),
  });
  const key = checkpointKey(input.runId, "stage-1-ontology", dependencyHashes);
  const existing = await input.checkpoints.get<AgentOntologyProposal>(key);
  if (existing) {
    assertDependencies(existing, dependencyHashes);
    validateCheckpoint(existing);
    return {
      runId: input.runId,
      proposal: existing.payload,
      proposalHash: hashOntologyProposal(existing.payload),
      checkpoint: existing,
      resumed: true,
    };
  }
  const result = await generateStageOneOntology(input.provider, input);
  assertValidationPass(result.validation);
  const checkpoint = createCheckpoint(input.runId, "stage-1-ontology", result.value, dependencyHashes, input.generatedAt);
  await input.checkpoints.put(checkpoint);
  return {
    runId: input.runId,
    proposal: result.value,
    proposalHash: hashOntologyProposal(result.value),
    checkpoint,
    resumed: false,
  };
}

export function prepareApprovedProductionProgram(input: {
  project: ProjectInput;
  proposal: AgentOntologyProposal;
  approval: OntologyApprovalRecord;
  vectorIdentity: VectorSpaceIdentity;
  ontologyPolicy?: OntologyCompilerPolicy;
  graphPolicy?: OntologyGraphPolicy;
  opportunityPolicy?: OpportunitySpacePolicy;
  siteGenerationPolicy?: SparseSiteGenerationPolicy;
}): PreparedAgentSiteProgram {
  const approvedProposal = applyOntologyApproval(input.proposal, input.approval);
  return prepareAgentSiteProgram({
    project: input.project,
    ontologyProposal: approvedProposal,
    vectorIdentity: input.vectorIdentity,
    ...(input.ontologyPolicy === undefined ? {} : { ontologyPolicy: input.ontologyPolicy }),
    ...(input.graphPolicy === undefined ? {} : { graphPolicy: input.graphPolicy }),
    ...(input.opportunityPolicy === undefined ? {} : { opportunityPolicy: input.opportunityPolicy }),
    ...(input.siteGenerationPolicy === undefined ? {} : { siteGenerationPolicy: input.siteGenerationPolicy }),
  });
}

export async function generateProductionCohort(input: {
  runId: string;
  provider: ZaiGlmProvider;
  prepared: PreparedAgentSiteProgram;
  design: ApprovedDesignAuthority;
  sourceExcerpts: readonly SourceExcerpt[];
  checkpoints: GenerationCheckpointStore;
  embeddingBackend: LocalEmbeddingBackend;
  baseUrl: string;
  generatedAt: string;
  corpusPolicy?: ProductionCorpusValidationPolicy;
}): Promise<ProductionGenerationResult> {
  assertValidationPass(input.design.validation);
  const outputs: StageTwoBatchOutput[] = [];
  const acceptedSummaries: { pageId: string; route: string; title: string; canonicalQuestion: string }[] = [];
  const excerptsHash = sourceExcerptHash(input.sourceExcerpts);
  let generatedBatchCount = 0;
  let resumedBatchCount = 0;

  for (const batch of input.prepared.siteGenerationPlan.batches) {
    const dependencyHashes = canonicalHashes({
      project: input.prepared.project.projectHash,
      ontology: input.prepared.ontology.ontologyHash,
      plan: input.prepared.siteGenerationPlan.planHash,
      batch: batch.batchHash,
      design: input.design.authorityHash,
      provider: sha256(input.provider.id),
      sources: excerptsHash,
      priorAcceptedBatches: sha256(JSON.stringify(outputs.map((item) => [item.batchId, sha256(JSON.stringify(item))]))),
    });
    const key = checkpointKey(input.runId, "stage-2-page-batch", dependencyHashes);
    const existing = await input.checkpoints.get<StageTwoBatchOutput>(key);
    let output: StageTwoBatchOutput;
    if (existing) {
      assertDependencies(existing, dependencyHashes);
      validateCheckpoint(existing);
      output = existing.payload;
      resumedBatchCount += 1;
    } else {
      const result = await generateStageTwoPageBatch(input.provider, {
        requestId: `${input.runId}:${batch.id}`,
        project: input.prepared.project,
        plan: input.prepared.siteGenerationPlan,
        batch,
        designAuthorityHash: input.design.authorityHash,
        sourceExcerpts: input.sourceExcerpts,
        acceptedPageSummaries: acceptedSummaries,
      });
      assertValidationPass(result.validation);
      output = result.value;
      await input.checkpoints.put(createCheckpoint(input.runId, "stage-2-page-batch", output, dependencyHashes, input.generatedAt));
      generatedBatchCount += 1;
    }
    outputs.push(output);
    for (const draft of output.drafts) {
      acceptedSummaries.push({ pageId: draft.pageId, route: draft.route, title: draft.title, canonicalQuestion: draft.canonicalQuestion });
    }
  }

  const transaction = commitPageDraftTransaction({
    project: input.prepared.project,
    ontology: input.prepared.ontology,
    plan: input.prepared.siteGenerationPlan,
    drafts: outputs.flatMap((output) => output.drafts),
    design: input.design,
    baseUrl: input.baseUrl,
  });
  assertValidationPass(transaction.validation);
  const transactionDependencies = canonicalHashes({
    project: input.prepared.project.projectHash,
    ontology: input.prepared.ontology.ontologyHash,
    plan: input.prepared.siteGenerationPlan.planHash,
    design: input.design.authorityHash,
    baseUrl: sha256(input.baseUrl),
    drafts: sha256(JSON.stringify(transaction.draftHashes)),
  });
  const transactionPayload = {
    transactionHash: transaction.transactionHash,
    buildHash: transaction.site.buildHash,
    renderedSiteHash: transaction.rendered.siteHash,
  };
  await input.checkpoints.put(createCheckpoint(input.runId, "transaction", transactionPayload, transactionDependencies, input.generatedAt));

  const corpus = await validateProductionCorpus(transaction, input.embeddingBackend, input.corpusPolicy);
  assertValidationPass(corpus.validation);
  const corpusPayload = {
    validationHash: corpus.validationHash,
    reportHash: corpus.validation.reportHash,
    pageCount: corpus.pageCount,
  };
  await input.checkpoints.put(createCheckpoint(input.runId, "corpus-validation", corpusPayload, canonicalHashes({
    transaction: transaction.transactionHash,
    embedding: sha256(input.embeddingBackend.id),
    policy: sha256(JSON.stringify(input.corpusPolicy ?? null)),
  }), input.generatedAt));

  const planned = input.prepared.siteGenerationPlan.pageConceptJobs.length;
  const validation = buildValidationReport(`production-run:${input.runId}`, PRODUCTION_ORCHESTRATION_VALIDATION, [
    finding("production.physical-stages", outputs.length === input.prepared.siteGenerationPlan.batches.length ? "pass" : "fail", `one approved Stage-1 program plus ${outputs.length} Stage-2 physical batch calls/checkpoints`),
    finding("production.recovery", generatedBatchCount + resumedBatchCount === outputs.length ? "pass" : "fail", `generated=${generatedBatchCount}; resumed=${resumedBatchCount}`),
    finding("production.transaction", transaction.validation.passes ? "pass" : "fail", `transaction=${transaction.transactionHash}; build=${transaction.site.buildHash}`),
    finding("production.corpus", corpus.validation.passes ? "pass" : "fail", `corpus=${corpus.validationHash}; backend=${input.embeddingBackend.id}`),
    finding("production.scale", transaction.site.pages.length === planned && corpus.pageCount === planned ? "pass" : "fail", `planned=${planned}; committed=${transaction.site.pages.length}; validated=${corpus.pageCount}`),
  ]);
  assertValidationPass(validation);
  const checkpoints = await input.checkpoints.list(input.runId);
  const canonical = {
    runId: input.runId,
    preparedHash: input.prepared.preparedHash,
    designHash: input.design.authorityHash,
    transactionHash: transaction.transactionHash,
    corpusHash: corpus.validationHash,
    checkpointHashes: checkpoints.map((item) => item.checkpointHash),
    validationHash: validation.reportHash,
  };
  return {
    runId: input.runId,
    prepared: input.prepared,
    transaction,
    corpus,
    generatedBatchCount,
    resumedBatchCount,
    checkpoints,
    validation,
    runHash: sha256(JSON.stringify(canonical)),
  };
}

function createCheckpoint<T>(
  runId: string,
  stage: CheckpointStage,
  payload: T,
  dependencyHashes: Readonly<Record<string, string>>,
  createdAt: string,
): GenerationCheckpoint<T> {
  const payloadHash = sha256(JSON.stringify(payload));
  const canonical = {
    key: checkpointKey(runId, stage, dependencyHashes),
    runId,
    stage,
    accepted: true as const,
    payload,
    payloadHash,
    dependencyHashes: canonicalHashes(dependencyHashes),
    createdAt,
  };
  return { ...canonical, checkpointHash: sha256(JSON.stringify(canonical)) };
}

function checkpointKey(runId: string, stage: CheckpointStage, dependencyHashes: Readonly<Record<string, string>>): string {
  return `checkpoint:${runId}:${stage}:${sha256(JSON.stringify(canonicalHashes(dependencyHashes))).slice(0, 24)}`;
}

function validateCheckpoint(checkpoint: GenerationCheckpoint): void {
  if (!checkpoint.key.trim() || !checkpoint.runId.trim() || !checkpoint.createdAt.trim()) throw new Error("checkpoint requires identity and timestamp");
  if (!checkpoint.accepted) throw new Error("only accepted outputs may be checkpointed");
  if (sha256(JSON.stringify(checkpoint.payload)) !== checkpoint.payloadHash) throw new Error(`checkpoint ${checkpoint.key} payload hash mismatch`);
  const canonical = {
    key: checkpoint.key,
    runId: checkpoint.runId,
    stage: checkpoint.stage,
    accepted: checkpoint.accepted,
    payload: checkpoint.payload,
    payloadHash: checkpoint.payloadHash,
    dependencyHashes: canonicalHashes(checkpoint.dependencyHashes),
    createdAt: checkpoint.createdAt,
  };
  if (sha256(JSON.stringify(canonical)) !== checkpoint.checkpointHash) throw new Error(`checkpoint ${checkpoint.key} hash mismatch`);
}

function assertDependencies(checkpoint: GenerationCheckpoint, dependencies: Readonly<Record<string, string>>): void {
  if (JSON.stringify(canonicalHashes(checkpoint.dependencyHashes)) !== JSON.stringify(canonicalHashes(dependencies))) {
    throw new Error(`checkpoint ${checkpoint.key} dependency mismatch`);
  }
}

function sourceExcerptHash(excerpts: readonly SourceExcerpt[]): string {
  return sha256(JSON.stringify([...excerpts]
    .sort((left, right) => left.excerptId.localeCompare(right.excerptId))
    .map((item) => ({ ...item, content: item.content.trim() }))));
}

function canonicalHashes(values: Readonly<Record<string, string>>): Readonly<Record<string, string>> {
  return Object.fromEntries(Object.entries(values).sort(([left], [right]) => left.localeCompare(right)));
}
