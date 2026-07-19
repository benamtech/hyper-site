import { DESIGN_CAPABILITIES, type DesignCapability } from "./benchmark.js";
import { sha256 } from "./core.js";
import type { EvidenceLevel, InformationObjectSource, LayoutRole, ModuleKind } from "./framework.js";
import type { NormalizedProject } from "./project-input.js";
import type {
  AgentOntologyProposal,
  MaterialEffect,
  OntologyRelationType,
  OntologySensitivity,
} from "./ontology-discovery.js";
import type { PageConceptJob, SiteGenerationBatch, SiteGenerationPlan } from "./site-program.js";
import {
  ZaiGlmProvider,
  type JsonSchema,
  type StructuredGenerationResult,
} from "./glm-provider.js";

export interface SourceExcerpt {
  sourceId: string;
  excerptId: string;
  content: string;
}

export interface StageOneGenerationInput {
  requestId: string;
  proposalId: string;
  proposalVersion: string;
  generatedAt: string;
  project: NormalizedProject;
  sourceExcerpts: readonly SourceExcerpt[];
}

export interface ReviewerObservation {
  id: string;
  targetId: string;
  state: "pass" | "fail";
  severity: "hard" | "soft";
  detail: string;
  evidenceIds: readonly string[];
}

export interface OntologyApprovalRecord {
  proposalHash: string;
  reviewerId: string;
  reviewerClass: "human" | "independent-model";
  decision: "approved" | "rejected";
  approvedAt: string;
  approvedSensitiveAttributeIds: readonly string[];
  observations: readonly ReviewerObservation[];
  notes: readonly string[];
  approvalHash: string;
}

export interface GeneratedClaimDraft {
  id: string;
  text: string;
  evidenceIds: readonly string[];
  requiredLevel: EvidenceLevel;
}

export interface GeneratedInformationObjectDraft {
  id: string;
  kind: InformationObjectSource["kind"];
  title: string;
  body: string;
  evidenceIds: readonly string[];
}

export interface GeneratedUtilityTaskDraft {
  id: string;
  title: string;
  body: string;
  evidenceIds: readonly string[];
}

export interface GeneratedModuleDraft {
  id: string;
  kind: ModuleKind;
  layoutRole: LayoutRole;
  heading?: string;
  body: string;
  claimIds: readonly string[];
  informationObjectIds: readonly string[];
  requiredCapabilities: readonly DesignCapability[];
  sourceIds: readonly string[];
}

export interface GeneratedPageDraft {
  jobId: string;
  pageId: string;
  route: string;
  canonicalQuestion: string;
  intent: string;
  title: string;
  description: string;
  expressedAttributeIds: readonly string[];
  evidenceIds: readonly string[];
  sourceIds: readonly string[];
  claims: readonly GeneratedClaimDraft[];
  informationObjects: readonly GeneratedInformationObjectDraft[];
  utilityTasks: readonly GeneratedUtilityTaskDraft[];
  conversionPathId: string;
  modules: readonly GeneratedModuleDraft[];
  internalPageIds: readonly string[];
  commercialValue: number;
  lifecycleCost: number;
  designAuthorityHash: string;
}

export interface StageTwoBatchOutput {
  batchId: string;
  drafts: readonly GeneratedPageDraft[];
}

export interface PageDraftReviewFinding {
  id: string;
  pageId: string;
  attributeId: string;
  severity: "hard" | "soft";
  state: "pass" | "fail";
  detail: string;
}

export interface StageThreeReviewOutput {
  batchId: string;
  reviewerId: string;
  findings: readonly PageDraftReviewFinding[];
}

const ONTOLOGY_SENSITIVITIES: readonly OntologySensitivity[] = ["operational", "business", "lifestyle", "demographic", "protected", "private", "inferred-sensitive"];
const MATERIAL_EFFECTS: readonly MaterialEffect[] = ["problem-framing", "workflow", "offer-fit", "proof", "utility", "conversion", "vocabulary", "ui"];
const RELATION_TYPES: readonly OntologyRelationType[] = ["compatible", "requires", "excludes", "cooccurs", "broader", "narrower", "supports-offer", "supports-topic", "supports-workflow"];
const MODULE_KINDS: readonly ModuleKind[] = ["hero", "answer", "workflow", "proof", "comparison", "faq", "cta", "instruction"];
const LAYOUT_ROLES: readonly LayoutRole[] = ["lead", "support", "proof", "decision", "conversion"];
const INFORMATION_KINDS: readonly InformationObjectSource["kind"][] = ["workflow", "dataset", "calculation", "diagram", "comparison", "field-note"];

export const STAGE_ONE_ONTOLOGY_SCHEMA: JsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["id", "version", "generatedBy", "generatedAt", "sourceIds", "attributes", "relations", "observations"],
  properties: {
    id: { type: "string", minLength: 1 },
    version: { type: "string", minLength: 1 },
    generatedBy: { type: "string", minLength: 1 },
    generatedAt: { type: "string", minLength: 1 },
    sourceIds: { type: "array", minItems: 1, items: { type: "string" } },
    attributes: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "label", "description", "dimensionHint", "sourceIds", "evidenceIds", "confidence", "sensitivity", "publicTargetingAllowed", "reviewerApproved", "materialEffects"],
        properties: {
          id: { type: "string" }, label: { type: "string" }, description: { type: "string" }, dimensionHint: { type: "string" },
          sourceIds: { type: "array", items: { type: "string" } }, evidenceIds: { type: "array", items: { type: "string" } },
          confidence: { type: "number", minimum: 0, maximum: 1 }, sensitivity: { enum: ONTOLOGY_SENSITIVITIES },
          publicTargetingAllowed: { type: "boolean" }, reviewerApproved: { const: false }, materialEffects: { type: "array", items: { enum: MATERIAL_EFFECTS } },
          anchorKind: { enum: ["service", "offer", "problem", "topic", "intent", "workflow", "outcome", "location"] },
        },
      },
    },
    relations: { type: "array", items: { type: "object" } },
    observations: { type: "array", minItems: 1, items: { type: "object" } },
  },
};

export const STAGE_TWO_PAGE_BATCH_SCHEMA: JsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["batchId", "drafts"],
  properties: {
    batchId: { type: "string" },
    drafts: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["jobId", "pageId", "route", "canonicalQuestion", "intent", "title", "description", "expressedAttributeIds", "evidenceIds", "sourceIds", "claims", "informationObjects", "utilityTasks", "conversionPathId", "modules", "internalPageIds", "commercialValue", "lifecycleCost", "designAuthorityHash"],
        properties: {
          jobId: { type: "string" }, pageId: { type: "string" }, route: { type: "string" }, canonicalQuestion: { type: "string" }, intent: { type: "string" }, title: { type: "string" }, description: { type: "string" },
          expressedAttributeIds: { type: "array", items: { type: "string" } }, evidenceIds: { type: "array", items: { type: "string" } }, sourceIds: { type: "array", items: { type: "string" } },
          claims: { type: "array", items: { type: "object" } }, informationObjects: { type: "array", items: { type: "object" } }, utilityTasks: { type: "array", items: { type: "object" } },
          conversionPathId: { type: "string" }, modules: { type: "array", minItems: 1, items: { type: "object" } }, internalPageIds: { type: "array", items: { type: "string" } },
          commercialValue: { type: "number" }, lifecycleCost: { type: "number", exclusiveMinimum: 0 }, designAuthorityHash: { type: "string" },
        },
      },
    },
  },
};

export const STAGE_THREE_REVIEW_SCHEMA: JsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["batchId", "reviewerId", "findings"],
  properties: {
    batchId: { type: "string" }, reviewerId: { type: "string" },
    findings: { type: "array", items: { type: "object", required: ["id", "pageId", "attributeId", "severity", "state", "detail"] } },
  },
};

export async function generateStageOneOntology(
  provider: ZaiGlmProvider,
  input: StageOneGenerationInput,
): Promise<StructuredGenerationResult<AgentOntologyProposal>> {
  validateSourceExcerpts(input.project, input.sourceExcerpts);
  const request = {
    id: input.requestId,
    stage: "stage-1-ontology" as const,
    systemPrompt: [
      "You propose an evidence-bound site ontology for a deterministic compiler.",
      "Never invent business truth, pricing, proof, locations, rights, or customer facts.",
      "Every attribute, relation, and observation must cite only supplied source and evidence IDs.",
      "Set reviewerApproved=false for every attribute. A separate reviewer controls approval.",
      "Protected, private, and inferred-sensitive traits may be identified for rejection but must not be marked public-targeting allowed.",
    ].join(" "),
    userPrompt: JSON.stringify({
      proposalIdentity: { id: input.proposalId, version: input.proposalVersion, generatedAt: input.generatedAt, generatedBy: provider.id },
      project: input.project.input,
      sourceLedger: input.project.sourceLedger,
      evidenceLedger: input.project.evidenceLedger,
      sourceExcerpts: canonicalExcerpts(input.sourceExcerpts),
    }),
    schemaName: "AgentOntologyProposal",
    schema: STAGE_ONE_ONTOLOGY_SCHEMA,
    sourceIds: input.project.sourceLedger.map((item) => item.id),
    maximumOutputTokens: 64_000,
  };
  return provider.generate<AgentOntologyProposal>(request, (value) => validateOntologyProposal(value, input, provider.id));
}

export function createOntologyApproval(
  proposal: AgentOntologyProposal,
  input: Omit<OntologyApprovalRecord, "proposalHash" | "approvalHash">,
): OntologyApprovalRecord {
  const proposalHash = hashOntologyProposal(proposal);
  const canonical = {
    proposalHash,
    reviewerId: input.reviewerId.trim(),
    reviewerClass: input.reviewerClass,
    decision: input.decision,
    approvedAt: input.approvedAt.trim(),
    approvedSensitiveAttributeIds: sorted(input.approvedSensitiveAttributeIds),
    observations: [...input.observations].sort((left, right) => left.id.localeCompare(right.id)).map((item) => ({ ...item, evidenceIds: sorted(item.evidenceIds) })),
    notes: sorted(input.notes),
  };
  if (!canonical.reviewerId || !canonical.approvedAt) throw new Error("ontology approval requires reviewer identity and timestamp");
  return { ...canonical, approvalHash: sha256(JSON.stringify(canonical)) };
}

export function applyOntologyApproval(
  proposal: AgentOntologyProposal,
  approval: OntologyApprovalRecord,
): AgentOntologyProposal {
  const proposalHash = hashOntologyProposal(proposal);
  if (approval.proposalHash !== proposalHash) throw new Error("ontology approval references a different proposal hash");
  if (approval.decision !== "approved") throw new Error("ontology proposal was rejected");
  if (approval.reviewerId === proposal.generatedBy) throw new Error("ontology generator cannot approve its own output");
  const unresolvedHard = approval.observations.filter((item) => item.severity === "hard" && item.state === "fail");
  if (unresolvedHard.length > 0) throw new Error(`ontology has unresolved hard reviewer findings: ${unresolvedHard.map((item) => item.id).join(", ")}`);
  const approvedSensitive = new Set(approval.approvedSensitiveAttributeIds);
  const knownIds = new Set(proposal.attributes.map((item) => item.id));
  for (const id of approvedSensitive) if (!knownIds.has(id)) throw new Error(`approval references unknown attribute ${id}`);
  return {
    ...proposal,
    attributes: proposal.attributes.map((item) => ({
      ...item,
      reviewerApproved: approvedSensitive.has(item.id),
    })),
  };
}

export async function generateStageTwoPageBatch(
  provider: ZaiGlmProvider,
  input: {
    requestId: string;
    project: NormalizedProject;
    plan: SiteGenerationPlan;
    batch: SiteGenerationBatch;
    designAuthorityHash: string;
    sourceExcerpts: readonly SourceExcerpt[];
    acceptedPageSummaries?: readonly { pageId: string; route: string; title: string; canonicalQuestion: string }[];
  },
): Promise<StructuredGenerationResult<StageTwoBatchOutput>> {
  validateSourceExcerpts(input.project, input.sourceExcerpts);
  const jobById = new Map(input.plan.pageConceptJobs.map((item) => [item.id, item]));
  const jobs = input.batch.pageConceptJobIds.map((id) => required(jobById, id, "stage-two batch"));
  const request = {
    id: input.requestId,
    stage: "stage-2-page-batch" as const,
    systemPrompt: [
      "You generate a bounded batch of complete structured page drafts for a deterministic static-site compiler.",
      "Use only declared source and evidence IDs. Do not invent claims, proof, pricing, locations, or rights.",
      "Every page must materially express all job attributes and provide a distinct information object or utility task.",
      "Return prose and semantic modules, not raw HTML or CSS. All pages are research-only and noindex downstream.",
      "Do not critique or approve your own output; external validators decide acceptance.",
    ].join(" "),
    userPrompt: JSON.stringify({
      project: input.project.input,
      batch: input.batch,
      jobs,
      designAuthorityHash: input.designAuthorityHash,
      sourceExcerpts: canonicalExcerpts(input.sourceExcerpts),
      acceptedPageSummaries: [...(input.acceptedPageSummaries ?? [])].sort((left, right) => left.pageId.localeCompare(right.pageId)),
    }),
    schemaName: "StageTwoBatchOutput",
    schema: STAGE_TWO_PAGE_BATCH_SCHEMA,
    sourceIds: sorted(jobs.flatMap((item) => item.sourceIds)),
    maximumOutputTokens: 128_000,
  };
  return provider.generate<StageTwoBatchOutput>(request, (value) => validateStageTwoOutput(value, jobs, input.batch.id, input.designAuthorityHash));
}

export async function generateStageThreeReview(
  reviewer: ZaiGlmProvider,
  input: {
    requestId: string;
    batchId: string;
    drafts: readonly GeneratedPageDraft[];
    deterministicFindings: readonly { pageId: string; attributeId: string; severity: "hard" | "soft"; detail: string }[];
    sourceIds: readonly string[];
    generationProviderId: string;
  },
): Promise<StructuredGenerationResult<StageThreeReviewOutput>> {
  if (reviewer.id === input.generationProviderId) throw new Error("stage-three reviewer must differ from the generation provider identity");
  const request = {
    id: input.requestId,
    stage: "stage-3-review-repair" as const,
    systemPrompt: [
      "You are an independent reviewer. Review another model's page drafts against supplied deterministic findings.",
      "Do not declare pages accepted. Return observations only; the compiler remains authoritative.",
      "Do not introduce new business facts or sources.",
    ].join(" "),
    userPrompt: JSON.stringify({ batchId: input.batchId, drafts: input.drafts, deterministicFindings: input.deterministicFindings }),
    schemaName: "StageThreeReviewOutput",
    schema: STAGE_THREE_REVIEW_SCHEMA,
    sourceIds: sorted(input.sourceIds),
    maximumOutputTokens: 24_000,
  };
  return reviewer.generate<StageThreeReviewOutput>(request, (value) => validateStageThreeOutput(value, input.batchId, input.drafts));
}

export function toPageConceptProposal(draft: GeneratedPageDraft) {
  return {
    jobId: draft.jobId,
    pageId: draft.pageId,
    route: draft.route,
    canonicalQuestion: draft.canonicalQuestion,
    intent: draft.intent,
    expressedAttributeIds: sorted(draft.expressedAttributeIds),
    evidenceIds: sorted(draft.evidenceIds),
    sourceIds: sorted(draft.sourceIds),
    informationObjectIds: sorted(draft.informationObjects.map((item) => item.id)),
    utilityOrTaskContractIds: sorted(draft.utilityTasks.map((item) => item.id)),
    conversionPathId: draft.conversionPathId,
    requiredModuleKinds: [...new Set(draft.modules.map((item) => item.kind))].sort(),
    requiredLayoutRoles: [...new Set(draft.modules.map((item) => item.layoutRole))].sort(),
    requiredCapabilities: [...new Set(draft.modules.flatMap((item) => item.requiredCapabilities))].sort(),
    graphEdges: [],
    commercialValue: draft.commercialValue,
    lifecycleCost: draft.lifecycleCost,
  };
}

export function hashOntologyProposal(proposal: AgentOntologyProposal): string {
  return sha256(JSON.stringify({
    ...proposal,
    sourceIds: sorted(proposal.sourceIds),
    attributes: [...proposal.attributes].sort((left, right) => left.id.localeCompare(right.id)),
    relations: [...proposal.relations].sort((left, right) => left.id.localeCompare(right.id)),
    observations: [...proposal.observations].sort((left, right) => left.id.localeCompare(right.id)),
  }));
}

function validateOntologyProposal(value: unknown, input: StageOneGenerationInput, providerId: string): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["ontology output must be an object"];
  if (value.id !== input.proposalId) errors.push("proposal id does not match request");
  if (value.version !== input.proposalVersion) errors.push("proposal version does not match request");
  if (value.generatedAt !== input.generatedAt) errors.push("generatedAt does not match request");
  if (value.generatedBy !== providerId) errors.push("generatedBy does not match provider identity");
  const sourceIds = allowedStrings(value.sourceIds, "proposal sourceIds", errors);
  const allowedSources = new Set(input.project.sourceLedger.map((item) => item.id));
  const allowedEvidence = new Set(input.project.evidenceLedger.map((item) => item.id));
  validateSubset(sourceIds, allowedSources, "proposal source", errors);
  const attributes = recordArray(value.attributes, "attributes", errors);
  const attributeIds = new Set<string>();
  for (const attribute of attributes) {
    const id = stringField(attribute, "id", errors);
    if (attributeIds.has(id)) errors.push(`duplicate attribute ${id}`);
    attributeIds.add(id);
    stringField(attribute, "label", errors); stringField(attribute, "description", errors); stringField(attribute, "dimensionHint", errors);
    validateSubset(allowedStrings(attribute.sourceIds, `attribute ${id} sourceIds`, errors), allowedSources, `attribute ${id} source`, errors);
    validateSubset(allowedStrings(attribute.evidenceIds, `attribute ${id} evidenceIds`, errors), allowedEvidence, `attribute ${id} evidence`, errors);
    if (typeof attribute.confidence !== "number" || attribute.confidence < 0 || attribute.confidence > 1) errors.push(`attribute ${id} has invalid confidence`);
    if (!ONTOLOGY_SENSITIVITIES.includes(attribute.sensitivity as OntologySensitivity)) errors.push(`attribute ${id} has invalid sensitivity`);
    if (attribute.reviewerApproved !== false) errors.push(`attribute ${id} attempted model self-approval`);
    if (typeof attribute.publicTargetingAllowed !== "boolean") errors.push(`attribute ${id} lacks publicTargetingAllowed`);
    const effects = allowedStrings(attribute.materialEffects, `attribute ${id} materialEffects`, errors);
    if (effects.length === 0 || effects.some((item) => !MATERIAL_EFFECTS.includes(item as MaterialEffect))) errors.push(`attribute ${id} has invalid material effects`);
  }
  const relations = recordArray(value.relations, "relations", errors);
  const relationIds = new Set<string>();
  for (const relation of relations) {
    const id = stringField(relation, "id", errors);
    if (relationIds.has(id)) errors.push(`duplicate relation ${id}`);
    relationIds.add(id);
    const from = stringField(relation, "fromAttributeId", errors);
    const to = stringField(relation, "toAttributeId", errors);
    if (!attributeIds.has(from) || !attributeIds.has(to)) errors.push(`relation ${id} references unknown endpoint`);
    if (!RELATION_TYPES.includes(relation.type as OntologyRelationType)) errors.push(`relation ${id} has invalid type`);
    if (typeof relation.weight !== "number" || relation.weight <= 0 || relation.weight > 1) errors.push(`relation ${id} has invalid weight`);
    stringField(relation, "rationale", errors);
    validateSubset(allowedStrings(relation.sourceIds, `relation ${id} sourceIds`, errors), allowedSources, `relation ${id} source`, errors);
    validateSubset(allowedStrings(relation.evidenceIds, `relation ${id} evidenceIds`, errors), allowedEvidence, `relation ${id} evidence`, errors);
  }
  const observations = recordArray(value.observations, "observations", errors);
  if (observations.length === 0) errors.push("at least one ontology observation is required");
  for (const observation of observations) {
    const id = stringField(observation, "id", errors);
    const ids = allowedStrings(observation.attributeIds, `observation ${id} attributeIds`, errors);
    if (ids.length < 2 || ids.some((item) => !attributeIds.has(item))) errors.push(`observation ${id} has invalid attributes`);
    validateSubset(allowedStrings(observation.sourceIds, `observation ${id} sourceIds`, errors), allowedSources, `observation ${id} source`, errors);
    validateSubset(allowedStrings(observation.evidenceIds, `observation ${id} evidenceIds`, errors), allowedEvidence, `observation ${id} evidence`, errors);
    if (typeof observation.weight !== "number" || observation.weight <= 0) errors.push(`observation ${id} has invalid weight`);
    stringField(observation, "description", errors);
  }
  return unique(errors);
}

function validateStageTwoOutput(value: unknown, jobs: readonly PageConceptJob[], batchId: string, designHash: string): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["stage-two output must be an object"];
  if (value.batchId !== batchId) errors.push("batchId does not match request");
  const drafts = recordArray(value.drafts, "drafts", errors);
  const jobById = new Map(jobs.map((item) => [item.id, item]));
  const seenJobs = new Set<string>();
  const pageIds = new Set<string>();
  const routes = new Set<string>();
  const questions = new Set<string>();
  for (const draft of drafts) {
    const jobId = stringField(draft, "jobId", errors);
    if (seenJobs.has(jobId)) errors.push(`duplicate draft for ${jobId}`);
    seenJobs.add(jobId);
    const job = jobById.get(jobId);
    if (!job) { errors.push(`draft references unknown job ${jobId}`); continue; }
    const pageId = stringField(draft, "pageId", errors);
    if (pageIds.has(pageId)) errors.push(`duplicate pageId ${pageId}`); pageIds.add(pageId);
    const route = stringField(draft, "route", errors);
    if (!route.startsWith("/") || routes.has(route)) errors.push(`invalid or duplicate route ${route}`); routes.add(route);
    const question = stringField(draft, "canonicalQuestion", errors).toLowerCase();
    if (questions.has(question)) errors.push(`duplicate canonical question ${question}`); questions.add(question);
    stringField(draft, "intent", errors); stringField(draft, "title", errors); stringField(draft, "description", errors); stringField(draft, "conversionPathId", errors);
    if (draft.designAuthorityHash !== designHash) errors.push(`draft ${jobId} used wrong design authority hash`);
    const expressed = new Set(allowedStrings(draft.expressedAttributeIds, `draft ${jobId} expressedAttributeIds`, errors));
    for (const attribute of job.attributes) if (!expressed.has(attribute.id)) errors.push(`draft ${jobId} misses attribute ${attribute.id}`);
    const sources = allowedStrings(draft.sourceIds, `draft ${jobId} sourceIds`, errors);
    const evidence = allowedStrings(draft.evidenceIds, `draft ${jobId} evidenceIds`, errors);
    validateSubset(sources, new Set(job.sourceIds), `draft ${jobId} source`, errors);
    validateSubset(evidence, new Set(job.evidenceIds), `draft ${jobId} evidence`, errors);
    if (sources.length === 0 || evidence.length === 0) errors.push(`draft ${jobId} requires sources and evidence`);
    const claims = recordArray(draft.claims, `draft ${jobId} claims`, errors);
    const claimIds = validateClaims(claims, new Set(job.evidenceIds), jobId, errors);
    const information = recordArray(draft.informationObjects, `draft ${jobId} informationObjects`, errors);
    const informationIds = validateInformationObjects(information, new Set(job.evidenceIds), jobId, errors);
    const utilities = recordArray(draft.utilityTasks, `draft ${jobId} utilityTasks`, errors);
    validateUtilities(utilities, new Set(job.evidenceIds), jobId, errors);
    if (information.length === 0 && utilities.length === 0) errors.push(`draft ${jobId} requires an information object or utility task`);
    const modules = recordArray(draft.modules, `draft ${jobId} modules`, errors);
    if (modules.length === 0) errors.push(`draft ${jobId} requires modules`);
    validateModules(modules, claimIds, informationIds, new Set(job.sourceIds), jobId, errors);
    if (!Array.isArray(draft.internalPageIds) || !draft.internalPageIds.every((item) => typeof item === "string")) errors.push(`draft ${jobId} has invalid internalPageIds`);
    if (typeof draft.commercialValue !== "number" || !Number.isFinite(draft.commercialValue)) errors.push(`draft ${jobId} has invalid commercialValue`);
    if (typeof draft.lifecycleCost !== "number" || !Number.isFinite(draft.lifecycleCost) || draft.lifecycleCost <= 0) errors.push(`draft ${jobId} has invalid lifecycleCost`);
  }
  for (const job of jobs) if (!seenJobs.has(job.id)) errors.push(`missing draft for ${job.id}`);
  if (drafts.length !== jobs.length) errors.push(`draft count ${drafts.length} does not match job count ${jobs.length}`);
  return unique(errors);
}

function validateStageThreeOutput(value: unknown, batchId: string, drafts: readonly GeneratedPageDraft[]): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["stage-three output must be an object"];
  if (value.batchId !== batchId) errors.push("review batchId does not match request");
  stringField(value, "reviewerId", errors);
  const pageIds = new Set(drafts.map((item) => item.pageId));
  for (const finding of recordArray(value.findings, "findings", errors)) {
    stringField(finding, "id", errors);
    const pageId = stringField(finding, "pageId", errors);
    if (!pageIds.has(pageId)) errors.push(`review finding references unknown page ${pageId}`);
    stringField(finding, "attributeId", errors); stringField(finding, "detail", errors);
    if (finding.severity !== "hard" && finding.severity !== "soft") errors.push("review finding has invalid severity");
    if (finding.state !== "pass" && finding.state !== "fail") errors.push("review finding has invalid state");
  }
  return unique(errors);
}

function validateClaims(claims: readonly Record<string, unknown>[], allowedEvidence: ReadonlySet<string>, pageId: string, errors: string[]): Set<string> {
  const ids = new Set<string>();
  for (const claim of claims) {
    const id = stringField(claim, "id", errors);
    if (ids.has(id)) errors.push(`page ${pageId} has duplicate claim ${id}`); ids.add(id);
    stringField(claim, "text", errors);
    validateSubset(allowedStrings(claim.evidenceIds, `claim ${id} evidenceIds`, errors), allowedEvidence, `claim ${id} evidence`, errors);
    if (!Number.isInteger(claim.requiredLevel) || Number(claim.requiredLevel) < 0 || Number(claim.requiredLevel) > 4) errors.push(`claim ${id} has invalid requiredLevel`);
  }
  return ids;
}

function validateInformationObjects(items: readonly Record<string, unknown>[], allowedEvidence: ReadonlySet<string>, pageId: string, errors: string[]): Set<string> {
  const ids = new Set<string>();
  for (const item of items) {
    const id = stringField(item, "id", errors);
    if (ids.has(id)) errors.push(`page ${pageId} has duplicate information object ${id}`); ids.add(id);
    stringField(item, "title", errors); stringField(item, "body", errors);
    if (!INFORMATION_KINDS.includes(item.kind as InformationObjectSource["kind"])) errors.push(`information object ${id} has invalid kind`);
    validateSubset(allowedStrings(item.evidenceIds, `information object ${id} evidenceIds`, errors), allowedEvidence, `information object ${id} evidence`, errors);
  }
  return ids;
}

function validateUtilities(items: readonly Record<string, unknown>[], allowedEvidence: ReadonlySet<string>, pageId: string, errors: string[]): void {
  const ids = new Set<string>();
  for (const item of items) {
    const id = stringField(item, "id", errors);
    if (ids.has(id)) errors.push(`page ${pageId} has duplicate utility ${id}`); ids.add(id);
    stringField(item, "title", errors); stringField(item, "body", errors);
    validateSubset(allowedStrings(item.evidenceIds, `utility ${id} evidenceIds`, errors), allowedEvidence, `utility ${id} evidence`, errors);
  }
}

function validateModules(modules: readonly Record<string, unknown>[], claimIds: ReadonlySet<string>, informationIds: ReadonlySet<string>, allowedSources: ReadonlySet<string>, pageId: string, errors: string[]): void {
  const ids = new Set<string>();
  for (const module of modules) {
    const id = stringField(module, "id", errors);
    if (ids.has(id)) errors.push(`page ${pageId} has duplicate module ${id}`); ids.add(id);
    if (!MODULE_KINDS.includes(module.kind as ModuleKind)) errors.push(`module ${id} has invalid kind`);
    if (!LAYOUT_ROLES.includes(module.layoutRole as LayoutRole)) errors.push(`module ${id} has invalid layout role`);
    stringField(module, "body", errors);
    const moduleClaims = allowedStrings(module.claimIds, `module ${id} claimIds`, errors);
    for (const claimId of moduleClaims) if (!claimIds.has(claimId)) errors.push(`module ${id} references unknown claim ${claimId}`);
    const moduleInformation = allowedStrings(module.informationObjectIds, `module ${id} informationObjectIds`, errors);
    for (const informationId of moduleInformation) if (!informationIds.has(informationId)) errors.push(`module ${id} references unknown information object ${informationId}`);
    const capabilities = allowedStrings(module.requiredCapabilities, `module ${id} requiredCapabilities`, errors);
    if (capabilities.length === 0 || capabilities.some((item) => !DESIGN_CAPABILITIES.includes(item as DesignCapability))) errors.push(`module ${id} has invalid design capabilities`);
    validateSubset(allowedStrings(module.sourceIds, `module ${id} sourceIds`, errors), allowedSources, `module ${id} source`, errors);
  }
}

function validateSourceExcerpts(project: NormalizedProject, excerpts: readonly SourceExcerpt[]): void {
  const sources = new Set(project.sourceLedger.map((item) => item.id));
  const ids = new Set<string>();
  for (const excerpt of excerpts) {
    if (!sources.has(excerpt.sourceId)) throw new Error(`source excerpt references unknown source ${excerpt.sourceId}`);
    if (!excerpt.excerptId.trim() || ids.has(excerpt.excerptId)) throw new Error(`invalid or duplicate source excerpt ${excerpt.excerptId}`);
    if (!excerpt.content.trim()) throw new Error(`source excerpt ${excerpt.excerptId} is empty`);
    ids.add(excerpt.excerptId);
  }
}

function canonicalExcerpts(excerpts: readonly SourceExcerpt[]): SourceExcerpt[] {
  return [...excerpts].sort((left, right) => left.excerptId.localeCompare(right.excerptId)).map((item) => ({ ...item, content: item.content.trim() }));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function recordArray(value: unknown, label: string, errors: string[]): Record<string, unknown>[] {
  if (!Array.isArray(value)) { errors.push(`${label} must be an array`); return []; }
  const records: Record<string, unknown>[] = [];
  for (const item of value) {
    if (!isRecord(item)) errors.push(`${label} contains a non-object item`);
    else records.push(item);
  }
  return records;
}

function allowedStrings(value: unknown, label: string, errors: string[]): string[] {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string" && item.trim())) {
    errors.push(`${label} must contain non-empty strings`);
    return [];
  }
  return value.map((item) => String(item).trim());
}

function stringField(record: Record<string, unknown>, field: string, errors: string[]): string {
  const value = record[field];
  if (typeof value !== "string" || !value.trim()) { errors.push(`${field} must be a non-empty string`); return ""; }
  return value.trim();
}

function validateSubset(values: readonly string[], allowed: ReadonlySet<string>, label: string, errors: string[]): void {
  for (const value of values) if (!allowed.has(value)) errors.push(`${label} references unknown ${value}`);
}

function required<K, V>(map: ReadonlyMap<K, V>, key: K, label: string): V {
  const value = map.get(key);
  if (value === undefined) throw new Error(`${label} references unknown ${String(key)}`);
  return value;
}

function sorted<T extends string>(values: readonly T[]): T[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean) as T[])].sort() as T[];
}

function unique(values: readonly string[]): string[] {
  return [...new Set(values)].sort();
}
