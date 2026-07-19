import { createHash } from "node:crypto";
import {
  compileLivingSurface,
  compileSite,
  validateLivingSurface,
  type CompiledLivingSurface,
  type CompiledSite,
  type LivingSurfaceState,
  type SiteSource,
} from "@amtech/hyper-site";

export interface ApprovedCorpusEvidence {
  id: string;
  level: 0 | 1 | 2 | 3 | 4;
  summary: string;
  sourceUrl?: string;
}

export interface ApprovedCorpusFact {
  id: string;
  statement: string;
  evidenceIds: string[];
}

export interface ApprovedSemanticCorpus {
  id: string;
  version: string;
  baseUrl: string;
  evidence: ApprovedCorpusEvidence[];
  facts: ApprovedCorpusFact[];
}

export interface SemanticProposal {
  siteSource: SiteSource;
  livingSurface: LivingSurfaceState;
}

export interface ProviderUsage {
  inputTokens: number;
  outputTokens: number;
  cachedInputTokens: number;
  costUsd: number;
  latencyMs: number;
}

export interface ProviderProposal {
  provider: string;
  model: string;
  requestId: string;
  proposal: SemanticProposal;
  usage: ProviderUsage;
}

export interface SemanticProposalProvider {
  propose(input: SemanticGenerationInput, attempt: number): Promise<ProviderProposal>;
}

export interface SemanticGenerationInput {
  runId: string;
  corpus: ApprovedSemanticCorpus;
  task: string;
}

export interface SemanticValidationFailure {
  code: string;
  path: string;
  message: string;
}

export interface SemanticAttemptRecord {
  attempt: number;
  provider: string;
  model: string;
  requestId: string;
  proposalHash: string;
  usage: ProviderUsage;
  accepted: boolean;
  failures: SemanticValidationFailure[];
}

export interface AcceptedSemanticState {
  proposal: SemanticProposal;
  proposalHash: string;
  site: CompiledSite;
  publicSurface: CompiledLivingSurface;
  operatorSurface: CompiledLivingSurface;
}

export interface SemanticGenerationCheckpoint {
  schemaVersion: 1;
  runId: string;
  inputHash: string;
  attempts: SemanticAttemptRecord[];
  accepted?: {
    proposal: SemanticProposal;
    proposalHash: string;
  };
}

export type SemanticGenerationResult =
  | {
      status: "accepted";
      checkpoint: SemanticGenerationCheckpoint;
      accepted: AcceptedSemanticState;
    }
  | {
      status: "rejected";
      checkpoint: SemanticGenerationCheckpoint;
      failures: SemanticValidationFailure[];
    };

export interface SemanticGenerationOptions {
  maxAttempts: number;
  checkpoint?: SemanticGenerationCheckpoint;
}

export async function runSemanticGeneration(
  input: SemanticGenerationInput,
  provider: SemanticProposalProvider,
  options: SemanticGenerationOptions,
): Promise<SemanticGenerationResult> {
  if (!input.runId.trim()) throw new Error("runId is required");
  if (!input.task.trim()) throw new Error("task is required");
  if (!Number.isInteger(options.maxAttempts) || options.maxAttempts < 1 || options.maxAttempts > 10) {
    throw new Error("maxAttempts must be an integer between 1 and 10");
  }
  validateApprovedCorpus(input.corpus);

  const inputHash = hashCanonical({ corpus: canonicalCorpus(input.corpus), task: input.task });
  const checkpoint = normalizeCheckpoint(input.runId, inputHash, options.checkpoint);

  if (checkpoint.accepted) {
    const validated = validateSemanticProposal(input.corpus, checkpoint.accepted.proposal);
    if (!validated.ok) {
      return { status: "rejected", checkpoint, failures: validated.failures };
    }
    return {
      status: "accepted",
      checkpoint,
      accepted: compileAccepted(checkpoint.accepted.proposal, checkpoint.accepted.proposalHash),
    };
  }

  let latestFailures: SemanticValidationFailure[] = [];
  for (let attempt = checkpoint.attempts.length + 1; attempt <= options.maxAttempts; attempt += 1) {
    const providerResult = await provider.propose(input, attempt);
    validateProviderResult(providerResult);
    const proposal = canonicalProposal(providerResult.proposal);
    const proposalHash = hashCanonical(proposal);
    const validation = validateSemanticProposal(input.corpus, proposal);
    latestFailures = validation.ok ? [] : validation.failures;
    checkpoint.attempts.push({
      attempt,
      provider: providerResult.provider,
      model: providerResult.model,
      requestId: providerResult.requestId,
      proposalHash,
      usage: { ...providerResult.usage },
      accepted: validation.ok,
      failures: latestFailures.map((failure) => ({ ...failure })),
    });

    if (validation.ok) {
      checkpoint.accepted = { proposal, proposalHash };
      return {
        status: "accepted",
        checkpoint,
        accepted: compileAccepted(proposal, proposalHash),
      };
    }
  }

  return {
    status: "rejected",
    checkpoint,
    failures: latestFailures,
  };
}

export function validateSemanticProposal(
  corpus: ApprovedSemanticCorpus,
  proposal: SemanticProposal,
): { ok: true } | { ok: false; failures: SemanticValidationFailure[] } {
  const failures: SemanticValidationFailure[] = [];
  const evidenceById = new Map(corpus.evidence.map((evidence) => [evidence.id, evidence]));
  const approvedFactByText = new Map(corpus.facts.map((fact) => [normalizeText(fact.statement), fact]));

  if (proposal.siteSource.baseUrl !== corpus.baseUrl) {
    failures.push({ code: "BASE_URL_MISMATCH", path: "siteSource.baseUrl", message: "proposal baseUrl must equal approved corpus baseUrl" });
  }

  const proposedEvidenceIds = new Set(proposal.siteSource.evidence.map((evidence) => evidence.id));
  for (const evidence of proposal.siteSource.evidence) {
    const approved = evidenceById.get(evidence.id);
    if (!approved) {
      failures.push({ code: "UNAPPROVED_EVIDENCE", path: `siteSource.evidence.${evidence.id}`, message: `evidence ${evidence.id} is not approved` });
      continue;
    }
    if (evidence.level !== approved.level || evidence.summary !== approved.summary) {
      failures.push({ code: "EVIDENCE_DRIFT", path: `siteSource.evidence.${evidence.id}`, message: `evidence ${evidence.id} differs from the approved corpus` });
    }
  }

  for (const claim of proposal.siteSource.claims) {
    const fact = approvedFactByText.get(normalizeText(claim.text));
    if (!fact) {
      failures.push({ code: "UNAPPROVED_CLAIM", path: `siteSource.claims.${claim.id}`, message: `claim ${claim.id} is not an approved fact` });
      continue;
    }
    const allowedEvidence = new Set(fact.evidenceIds);
    for (const evidenceId of claim.evidenceIds) {
      if (!allowedEvidence.has(evidenceId)) {
        failures.push({ code: "CLAIM_EVIDENCE_MISMATCH", path: `siteSource.claims.${claim.id}.evidenceIds`, message: `claim ${claim.id} cites evidence outside its approved fact binding` });
      }
      if (!proposedEvidenceIds.has(evidenceId)) {
        failures.push({ code: "MISSING_PROPOSED_EVIDENCE", path: `siteSource.claims.${claim.id}.evidenceIds`, message: `claim ${claim.id} cites evidence ${evidenceId} absent from SiteSource` });
      }
    }
  }

  for (const evidenceId of proposal.livingSurface.evidenceIds) {
    if (!evidenceById.has(evidenceId)) {
      failures.push({ code: "SURFACE_UNAPPROVED_EVIDENCE", path: "livingSurface.evidenceIds", message: `surface evidence ${evidenceId} is not approved` });
    }
  }

  try {
    compileSite(proposal.siteSource);
  } catch (error) {
    failures.push({ code: "SITE_COMPILE_REJECTED", path: "siteSource", message: errorMessage(error) });
  }

  try {
    validateLivingSurface(proposal.livingSurface);
    compileLivingSurface(proposal.livingSurface, "public");
    compileLivingSurface(proposal.livingSurface, "operator");
  } catch (error) {
    failures.push({ code: "SURFACE_COMPILE_REJECTED", path: "livingSurface", message: errorMessage(error) });
  }

  return failures.length === 0 ? { ok: true } : { ok: false, failures };
}

export function checkpointHash(checkpoint: SemanticGenerationCheckpoint): string {
  return hashCanonical(checkpoint);
}

function compileAccepted(proposal: SemanticProposal, proposalHash: string): AcceptedSemanticState {
  return {
    proposal,
    proposalHash,
    site: compileSite(proposal.siteSource),
    publicSurface: compileLivingSurface(proposal.livingSurface, "public"),
    operatorSurface: compileLivingSurface(proposal.livingSurface, "operator"),
  };
}

function normalizeCheckpoint(runId: string, inputHash: string, source?: SemanticGenerationCheckpoint): SemanticGenerationCheckpoint {
  if (!source) return { schemaVersion: 1, runId, inputHash, attempts: [] };
  if (source.schemaVersion !== 1) throw new Error("checkpoint schemaVersion must equal 1");
  if (source.runId !== runId) throw new Error("checkpoint runId does not match input");
  if (source.inputHash !== inputHash) throw new Error("checkpoint inputHash does not match input");
  return {
    schemaVersion: 1,
    runId,
    inputHash,
    attempts: source.attempts.map((attempt) => ({
      ...attempt,
      usage: { ...attempt.usage },
      failures: attempt.failures.map((failure) => ({ ...failure })),
    })),
    ...(source.accepted ? { accepted: { proposal: canonicalProposal(source.accepted.proposal), proposalHash: source.accepted.proposalHash } } : {}),
  };
}

function canonicalProposal(proposal: SemanticProposal): SemanticProposal {
  return {
    siteSource: {
      ...proposal.siteSource,
      evidence: [...proposal.siteSource.evidence].sort(byId).map((item) => ({ ...item })),
      claims: [...proposal.siteSource.claims].sort(byId).map((item) => ({ ...item, evidenceIds: uniqueSorted(item.evidenceIds) })),
      informationObjects: [...proposal.siteSource.informationObjects].sort(byId).map((item) => ({ ...item, evidenceIds: uniqueSorted(item.evidenceIds) })),
      modules: [...proposal.siteSource.modules].sort(byId).map((item) => ({ ...item, claimIds: uniqueSorted(item.claimIds), informationObjectIds: uniqueSorted(item.informationObjectIds), requiredCapabilities: uniqueSorted(item.requiredCapabilities), sourceIds: uniqueSorted(item.sourceIds) })),
      pages: [...proposal.siteSource.pages].sort(byId).map((item) => ({ ...item, moduleIds: uniqueSorted(item.moduleIds), internalPageIds: uniqueSorted(item.internalPageIds), requiredCapabilities: uniqueSorted(item.requiredCapabilities), ...(item.instructionPointers ? { instructionPointers: uniqueSorted(item.instructionPointers) } : {}) })),
    },
    livingSurface: {
      ...proposal.livingSurface,
      evidenceIds: uniqueSorted(proposal.livingSurface.evidenceIds),
      informationObjects: [...proposal.livingSurface.informationObjects].sort(byId).map((item) => ({ ...item, evidenceIds: uniqueSorted(item.evidenceIds) })),
      actions: [...proposal.livingSurface.actions].sort(byId).map((item) => ({ ...item, evidenceIds: uniqueSorted(item.evidenceIds) })),
      approvals: [...proposal.livingSurface.approvals].sort(byId).map((item) => ({ ...item })),
      receipts: [...proposal.livingSurface.receipts].sort(byId).map((item) => ({ ...item })),
      nodes: [...proposal.livingSurface.nodes].sort(byId).map((item) => ({ ...item, field: { ...item.field }, informationObjectIds: uniqueSorted(item.informationObjectIds), actionIds: uniqueSorted(item.actionIds), evidenceIds: uniqueSorted(item.evidenceIds) })),
      runtime: { ...proposal.livingSurface.runtime },
    },
  };
}

function canonicalCorpus(corpus: ApprovedSemanticCorpus): ApprovedSemanticCorpus {
  return {
    ...corpus,
    evidence: [...corpus.evidence].sort(byId).map((item) => ({ ...item })),
    facts: [...corpus.facts].sort(byId).map((item) => ({ ...item, evidenceIds: uniqueSorted(item.evidenceIds) })),
  };
}

function validateApprovedCorpus(corpus: ApprovedSemanticCorpus): void {
  if (!corpus.id.trim() || !corpus.version.trim()) throw new Error("corpus id and version are required");
  const url = new URL(corpus.baseUrl);
  if (url.protocol !== "https:") throw new Error("corpus baseUrl must use HTTPS");
  assertUnique(corpus.evidence, "corpus evidence");
  assertUnique(corpus.facts, "corpus fact");
  const evidenceIds = new Set(corpus.evidence.map((item) => item.id));
  for (const fact of corpus.facts) {
    if (!fact.statement.trim()) throw new Error(`corpus fact ${fact.id} requires statement`);
    if (fact.evidenceIds.length === 0) throw new Error(`corpus fact ${fact.id} requires evidence`);
    for (const evidenceId of fact.evidenceIds) if (!evidenceIds.has(evidenceId)) throw new Error(`corpus fact ${fact.id} references missing evidence ${evidenceId}`);
  }
}

function validateProviderResult(result: ProviderProposal): void {
  if (!result.provider.trim() || !result.model.trim() || !result.requestId.trim()) throw new Error("provider result requires provider, model and requestId");
  for (const [name, value] of Object.entries(result.usage)) {
    if (!Number.isFinite(value) || value < 0) throw new Error(`provider usage ${name} must be non-negative`);
  }
}

function normalizeText(value: string): string { return value.trim().replace(/\s+/g, " ").toLowerCase(); }
function uniqueSorted(values: readonly string[]): string[] { return [...new Set(values)].sort(); }
function byId<T extends { id: string }>(left: T, right: T): number { return left.id.localeCompare(right.id); }
function hashCanonical(value: unknown): string { return createHash("sha256").update(JSON.stringify(value)).digest("hex"); }
function errorMessage(error: unknown): string { return error instanceof Error ? error.message : String(error); }
function assertUnique<T extends { id: string }>(items: readonly T[], label: string): void { const ids = new Set<string>(); for (const item of items) { if (!item.id.trim()) throw new Error(`${label} id is required`); if (ids.has(item.id)) throw new Error(`duplicate ${label} id: ${item.id}`); ids.add(item.id); } }
