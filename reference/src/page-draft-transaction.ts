import { type DesignCapability, type FeatureMap } from "./benchmark.js";
import { sha256 } from "./core.js";
import {
  compileSite,
  type ClaimSource,
  type CompiledSite,
  type EvidenceLevel,
  type EvidenceSource,
  type InformationObjectSource,
  type ModuleSource,
  type PageSource,
  type SiteSource,
} from "./framework.js";
import type { ApprovedOntology } from "./ontology-discovery.js";
import type { NormalizedProject } from "./project-input.js";
import { buildSparseLexicalIndex, lexicalNeighbors } from "./sparse-lexical.js";
import {
  compilePageConceptProposals,
  type CompiledPageConcepts,
  type SiteGenerationPlan,
  type SiteGenerationPolicy,
} from "./site-program.js";
import {
  type GeneratedPageDraft,
  toPageConceptProposal,
} from "./generation-schemas.js";
import {
  renderApprovedDesignSite,
  type ApprovedDesignAuthority,
  type RenderedDesignSite,
} from "./design-authoring.js";
import {
  assertValidationPass,
  buildValidationReport,
  finding,
  type ValidationAttribute,
  type ValidationReport,
} from "./validation-contracts.js";

export interface PageDraftTransactionInput {
  project: NormalizedProject;
  ontology: ApprovedOntology;
  plan: SiteGenerationPlan;
  drafts: readonly GeneratedPageDraft[];
  design: ApprovedDesignAuthority;
  baseUrl: string;
  vectorDimensions?: number;
  siteGenerationPolicy?: SiteGenerationPolicy;
}

export interface PageDraftTransaction {
  projectHash: string;
  ontologyHash: string;
  planHash: string;
  designAuthorityHash: string;
  pageConcepts: CompiledPageConcepts;
  draftHashes: Readonly<Record<string, string>>;
  source: SiteSource;
  site: CompiledSite;
  rendered: RenderedDesignSite;
  validation: ValidationReport;
  transactionHash: string;
}

export interface CorpusValidationPolicy {
  lexicalDuplicateThreshold: number;
  semanticDuplicateThreshold: number;
  neighborLimit: number;
  minimumInformationObjectsPerPage: number;
  minimumEvidenceReferencesPerPage: number;
}

export interface LocalEmbeddingBackend {
  id: string;
  embed(texts: readonly string[]): Promise<readonly Float32Array[]>;
}

export interface LocalEmbeddingEndpointConfig {
  id?: string;
  endpoint: string;
  model: string;
  apiKey?: string;
  batchSize?: number;
  timeoutMilliseconds?: number;
}

export interface DuplicatePair {
  leftPageId: string;
  rightPageId: string;
  lexicalSimilarity: number;
  semanticSimilarity?: number;
}

export interface CorpusValidationResult {
  pageCount: number;
  lexicalIndexHash: string;
  embeddingBackendId: string | null;
  candidatePairs: number;
  rejectedPairs: readonly DuplicatePair[];
  validation: ValidationReport;
  validationHash: string;
}

export const PAGE_TRANSACTION_VALIDATION: readonly ValidationAttribute[] = [
  {
    id: "transaction.coverage",
    feature: "Complete Stage-2 draft coverage",
    workflowStep: "commit-page-drafts",
    algorithmChoice: "existing PageConceptProposal compiler over one draft per planned job",
    userEffect: "the operator receives either the complete requested cohort or an explicit rejection",
    developerEffect: "missing and duplicate jobs cannot create a partial silent commit",
    validationVector: ["job IDs", "accepted concepts", "rejection ledger"],
    passVector: ["every planned job accepted exactly once"],
    failVector: ["missing draft", "duplicate job", "rejected proposal"],
    simplerBaseline: "append every model response",
    severity: "hard",
  },
  {
    id: "transaction.evidence",
    feature: "Evidence-bound PageIR materialization",
    workflowStep: "compile-site-source",
    algorithmChoice: "claims and information objects resolve through canonical evidence ledger",
    userEffect: "visible page assertions cannot exceed supplied evidence",
    developerEffect: "compileSite remains the semantic authority",
    validationVector: ["claim evidence", "information evidence", "source IDs", "evidence level"],
    passVector: ["all references resolve", "claim levels are supported"],
    failVector: ["unknown evidence", "unsupported claim", "source-free module"],
    simplerBaseline: "write prose directly to HTML",
    severity: "hard",
  },
  {
    id: "transaction.atomic",
    feature: "Atomic PageDraft to PageIR transaction",
    workflowStep: "compile-and-commit",
    algorithmChoice: "validate all drafts, build one immutable SiteSource, then compile the whole cohort",
    userEffect: "a failed page cannot leave a half-generated deployment",
    developerEffect: "transaction identity and all page hashes are deterministic",
    validationVector: ["draft hashes", "SiteSource", "build hash", "transaction hash"],
    passVector: ["one complete compiled site", "stable hash under input order"],
    failVector: ["partial mutation", "order-dependent output", "mixed accepted and unvalidated artifacts"],
    simplerBaseline: "write each page as soon as it arrives",
    severity: "hard",
  },
  {
    id: "transaction.noindex",
    feature: "Initial noindex publication gate",
    workflowStep: "compile-site-source",
    algorithmChoice: "PageSource indexable=false for every generated draft",
    userEffect: "the cohort remains a private review artifact until separate publication approval",
    developerEffect: "the model cannot set robots policy",
    validationVector: ["PageSource indexable", "rendered robots metadata", "sitemap"],
    passVector: ["all pages noindex", "empty indexable sitemap"],
    failVector: ["generated page becomes indexable", "model controls robots"],
    simplerBaseline: "template default",
    severity: "hard",
  },
  {
    id: "transaction.design",
    feature: "Approved design authority binding",
    workflowStep: "render",
    algorithmChoice: "every draft binds the exact approved design hash and renders from canonical PageIR",
    userEffect: "core and bulk pages share the reviewed visual system",
    developerEffect: "design changes do not require prose regeneration",
    validationVector: ["design authority hash", "design validation", "render validation"],
    passVector: ["all drafts match authority", "render passes"],
    failVector: ["stale design", "page-specific visual prompt", "unsatisfied component"],
    simplerBaseline: "model generates CSS per page",
    severity: "hard",
  },
];

export const CORPUS_VALIDATION: readonly ValidationAttribute[] = [
  {
    id: "corpus.lexical",
    feature: "Corpus-wide sparse duplicate screen",
    workflowStep: "validate-corpus",
    algorithmChoice: "TF-IDF/BM25 local-neighbor candidates after exact eligibility",
    userEffect: "noun-swapped and highly overlapping pages are rejected before publication",
    developerEffect: "10K validation avoids a dense all-pairs matrix",
    validationVector: ["lexical index", "bounded neighbor list", "duplicate threshold"],
    passVector: ["no pair exceeds threshold"],
    failVector: ["near-duplicate page pair", "order-dependent index"],
    simplerBaseline: "unique route only",
    severity: "hard",
  },
  {
    id: "corpus.semantic",
    feature: "Local semantic duplicate screen",
    workflowStep: "validate-corpus",
    algorithmChoice: "local embedding backend over sparse lexical candidate pairs",
    userEffect: "semantically duplicate pages with different wording are visible",
    developerEffect: "GPU-backed validation is independent of GLM generation and remains bounded",
    validationVector: ["embedding backend ID", "vector count", "candidate-pair cosine"],
    passVector: ["all vectors present", "no candidate exceeds semantic threshold"],
    failVector: ["missing local backend", "dimension mismatch", "semantic duplicate"],
    simplerBaseline: "lexical screen only",
    severity: "hard",
  },
  {
    id: "corpus.information",
    feature: "Per-page information-gain floor",
    workflowStep: "validate-corpus",
    algorithmChoice: "visible information-object and evidence-reference counts",
    userEffect: "pages must contain a real field note, workflow, calculation, comparison, dataset, or utility",
    developerEffect: "title variation cannot satisfy corpus quality",
    validationVector: ["information objects", "evidence references"],
    passVector: ["every page meets both floors"],
    failVector: ["prose-only page", "evidence-free page"],
    simplerBaseline: "minimum word count",
    severity: "hard",
  },
  {
    id: "corpus.render",
    feature: "Static rendering and crawl integrity",
    workflowStep: "validate-rendered-cohort",
    algorithmChoice: "deterministic HTML checks over every emitted page",
    userEffect: "review pages contain titles, descriptions, canonicals, robots, semantic main content, and working internal routes",
    developerEffect: "large-cohort failures are reported before deployment",
    validationVector: ["unique routes", "HTML shell", "canonical", "robots", "internal link targets"],
    passVector: ["all pages pass", "all links resolve"],
    failVector: ["broken route", "missing metadata", "indexable preview", "missing main content"],
    simplerBaseline: "build command exits zero",
    severity: "hard",
  },
  {
    id: "corpus.scale",
    feature: "Bounded cohort-scale validation",
    workflowStep: "validate-corpus",
    algorithmChoice: "linear indexing plus bounded neighbors and batched embeddings",
    userEffect: "25, 100, 500, and 10K runs use the same acceptance path",
    developerEffect: "scale fixtures measure the real validator rather than a separate benchmark",
    validationVector: ["page count", "candidate pairs", "stable validation hash"],
    passVector: ["requested cohort completes"],
    failVector: ["special 10K bypass", "unbounded all-pairs validation"],
    simplerBaseline: "validate a small sample only",
    severity: "hard",
  },
];

export const DEFAULT_CORPUS_VALIDATION_POLICY: CorpusValidationPolicy = {
  lexicalDuplicateThreshold: 0.92,
  semanticDuplicateThreshold: 0.965,
  neighborLimit: 12,
  minimumInformationObjectsPerPage: 1,
  minimumEvidenceReferencesPerPage: 1,
};

export function commitPageDraftTransaction(input: PageDraftTransactionInput): PageDraftTransaction {
  if (!/^https:\/\//.test(input.baseUrl)) throw new Error("page transaction baseUrl must be https");
  assertValidationPass(input.project.validation);
  assertValidationPass(input.ontology.validation);
  assertValidationPass(input.plan.validation);
  assertValidationPass(input.design.validation);
  const orderedDrafts = [...input.drafts].sort((left, right) => left.jobId.localeCompare(right.jobId));
  if (orderedDrafts.some((draft) => draft.designAuthorityHash !== input.design.authorityHash)) throw new Error("one or more drafts reference a stale design authority");
  const pageConcepts = compilePageConceptProposals(
    input.plan,
    input.ontology,
    orderedDrafts.map(toPageConceptProposal),
    input.siteGenerationPolicy,
  );
  assertValidationPass(pageConcepts.validation);
  const draftByPageId = new Map(orderedDrafts.map((draft) => [draft.pageId, draft]));
  if (draftByPageId.size !== orderedDrafts.length) throw new Error("duplicate page draft ID");
  const acceptedPageIds = new Set(pageConcepts.candidateSeeds.map((seed) => seed.id));
  for (const draft of orderedDrafts) for (const linkedId of draft.internalPageIds) {
    if (!acceptedPageIds.has(linkedId)) throw new Error(`page ${draft.pageId} links to uncommitted page ${linkedId}`);
    if (linkedId === draft.pageId) throw new Error(`page ${draft.pageId} cannot link to itself`);
  }
  const evidence = input.project.evidenceLedger.map((item): EvidenceSource => ({
    id: item.id,
    level: confidenceLevel(item.confidence),
    summary: item.statement,
  }));
  const claims: ClaimSource[] = [];
  const informationObjects: InformationObjectSource[] = [];
  const modules: ModuleSource[] = [];
  const pages: PageSource[] = [];
  const globalIds = new Set<string>();
  const seedById = new Map(pageConcepts.candidateSeeds.map((seed) => [seed.id, seed]));
  for (const draft of orderedDrafts) {
    const seed = required(seedById, draft.pageId, "candidate seed");
    for (const claim of draft.claims) {
      claimUnique(globalIds, claim.id, "claim");
      claims.push({ id: claim.id, text: claim.text, evidenceIds: sorted(claim.evidenceIds), requiredLevel: claim.requiredLevel });
    }
    for (const item of draft.informationObjects) {
      claimUnique(globalIds, item.id, "information object");
      informationObjects.push({ id: item.id, kind: item.kind, title: item.title, body: item.body, evidenceIds: sorted(item.evidenceIds) });
    }
    const utilityObjectIds: string[] = [];
    for (const utility of draft.utilityTasks) {
      claimUnique(globalIds, utility.id, "utility task");
      utilityObjectIds.push(utility.id);
      informationObjects.push({ id: utility.id, kind: "workflow", title: utility.title, body: utility.body, evidenceIds: sorted(utility.evidenceIds) });
    }
    for (const module of draft.modules) {
      claimUnique(globalIds, module.id, "module");
      modules.push({
        id: module.id,
        kind: module.kind,
        layoutRole: module.layoutRole,
        ...(module.heading === undefined ? {} : { heading: module.heading }),
        body: module.body,
        claimIds: sorted(module.claimIds),
        informationObjectIds: sorted(module.informationObjectIds),
        requiredCapabilities: sorted(module.requiredCapabilities),
        sourceIds: sorted(module.sourceIds),
      });
    }
    const moduleIds = draft.modules.map((item) => item.id);
    if (utilityObjectIds.length > 0) {
      const utilityModuleId = `module:${draft.pageId}:utility`;
      claimUnique(globalIds, utilityModuleId, "module");
      modules.push({
        id: utilityModuleId,
        kind: "instruction",
        layoutRole: "support",
        heading: "Use this workflow",
        body: "Apply the following bounded task using the supplied business evidence and constraints.",
        claimIds: [],
        informationObjectIds: utilityObjectIds,
        requiredCapabilities: ["semantic-hierarchy", "responsive-grid", "instruction-pointer", "mobile-priority", "reduced-motion"],
        sourceIds: sorted(draft.sourceIds),
      });
      moduleIds.push(utilityModuleId);
    }
    const primary = required(new Map(seed.prototypes.map((item) => [item.id, item])), seed.primaryPrototypeId, "primary prototype");
    const features: FeatureMap = Object.fromEntries(primary.feature_atoms.map((atom) => [atom.dimension, atom.value]));
    pages.push({
      id: draft.pageId,
      route: draft.route,
      canonicalQuestion: draft.canonicalQuestion,
      title: draft.title,
      description: draft.description,
      features,
      vectorPrototypes: seed.prototypes.map((prototype) => ({
        id: prototype.id,
        features: Object.fromEntries(prototype.feature_atoms.map((atom) => [atom.dimension, atom.value])),
      })),
      primaryPrototypeId: seed.primaryPrototypeId,
      moduleIds,
      internalPageIds: sorted(draft.internalPageIds),
      requiredCapabilities: sorted(draft.modules.flatMap((item) => item.requiredCapabilities)),
      instructionPointers: [`/instructions/${encodeURIComponent(draft.pageId)}.md`],
      indexable: false,
    });
  }
  const source: SiteSource = {
    baseUrl: input.baseUrl.replace(/\/$/, ""),
    evidence,
    claims,
    informationObjects,
    modules,
    pages,
  };
  const site = compileSite(source, input.vectorDimensions ?? 64);
  const rendered = renderApprovedDesignSite(site, input.design);
  assertValidationPass(rendered.validation);
  const draftHashes = Object.fromEntries(orderedDrafts.map((draft) => [draft.pageId, sha256(JSON.stringify(canonicalDraft(draft)))]));
  const noindexPass = source.pages.every((page) => page.indexable === false)
    && site.pages.every((artifact) => artifact.html.includes('name="robots" content="noindex,nofollow"'))
    && !site.sitemapXml.includes("<url>");
  const validation = buildValidationReport(`page-draft-transaction:${input.plan.id}`, PAGE_TRANSACTION_VALIDATION, [
    finding("transaction.coverage", pageConcepts.validation.passes && pages.length === input.plan.pageConceptJobs.length ? "pass" : "fail", `${pages.length}/${input.plan.pageConceptJobs.length} planned jobs committed`),
    finding("transaction.evidence", site.pages.length === pages.length ? "pass" : "fail", `${claims.length} claims and ${informationObjects.length} information/utility objects compiled through ${evidence.length} evidence records`),
    finding("transaction.atomic", site.pages.length === orderedDrafts.length ? "pass" : "fail", `one immutable SiteSource compiled to build ${site.buildHash}`),
    finding("transaction.noindex", noindexPass ? "pass" : "fail", `${site.pages.length} pages remain noindex with an empty indexable sitemap`),
    finding("transaction.design", rendered.validation.passes ? "pass" : "fail", `design authority ${input.design.authorityHash} produced rendered site ${rendered.siteHash}`),
  ]);
  assertValidationPass(validation);
  const canonical = {
    projectHash: input.project.projectHash,
    ontologyHash: input.ontology.ontologyHash,
    planHash: input.plan.planHash,
    designAuthorityHash: input.design.authorityHash,
    pageConceptCompilationHash: pageConcepts.compilationHash,
    draftHashes,
    sourceBuildHash: site.buildHash,
    renderedSiteHash: rendered.siteHash,
    validationHash: validation.reportHash,
  };
  return {
    projectHash: input.project.projectHash,
    ontologyHash: input.ontology.ontologyHash,
    planHash: input.plan.planHash,
    designAuthorityHash: input.design.authorityHash,
    pageConcepts,
    draftHashes,
    source,
    site,
    rendered,
    validation,
    transactionHash: sha256(JSON.stringify(canonical)),
  };
}

export async function validateCorpus(
  transaction: PageDraftTransaction,
  embeddingBackend: LocalEmbeddingBackend | null,
  policy: CorpusValidationPolicy = DEFAULT_CORPUS_VALIDATION_POLICY,
): Promise<CorpusValidationResult> {
  validateCorpusPolicy(policy);
  const documents = transaction.site.pages.map((artifact) => ({ id: artifact.page.id, text: pageText(artifact.page) }));
  const index = buildSparseLexicalIndex(documents);
  const lexicalCandidates = new Map<string, DuplicatePair>();
  for (const document of index.documents) {
    for (const neighbor of lexicalNeighbors(index, document.id, policy.neighborLimit)) {
      const [leftPageId, rightPageId] = [document.id, neighbor.documentId].sort();
      const key = `${leftPageId}\0${rightPageId}`;
      const current = lexicalCandidates.get(key);
      if (!current || neighbor.cosine > current.lexicalSimilarity) lexicalCandidates.set(key, { leftPageId, rightPageId, lexicalSimilarity: neighbor.cosine });
    }
  }
  const embeddings = embeddingBackend ? await embeddingBackend.embed(documents.map((item) => item.text)) : [];
  if (embeddingBackend && embeddings.length !== documents.length) throw new Error(`embedding backend returned ${embeddings.length} vectors for ${documents.length} pages`);
  const vectorById = new Map<string, Float32Array>();
  embeddings.forEach((vector, indexValue) => {
    if (vector.length === 0) throw new Error(`embedding backend returned an empty vector for ${documents[indexValue].id}`);
    vectorById.set(documents[indexValue].id, vector);
  });
  const rejectedPairs: DuplicatePair[] = [];
  for (const pair of lexicalCandidates.values()) {
    const semanticSimilarity = embeddingBackend
      ? cosineFloat(required(vectorById, pair.leftPageId, "embedding"), required(vectorById, pair.rightPageId, "embedding"))
      : undefined;
    if (pair.lexicalSimilarity >= policy.lexicalDuplicateThreshold
      || (semanticSimilarity !== undefined && semanticSimilarity >= policy.semanticDuplicateThreshold)) {
      rejectedPairs.push({ ...pair, ...(semanticSimilarity === undefined ? {} : { semanticSimilarity }) });
    }
  }
  rejectedPairs.sort((left, right) => left.leftPageId.localeCompare(right.leftPageId) || left.rightPageId.localeCompare(right.rightPageId));
  const informationPass = transaction.site.pages.every((artifact) => {
    const infoCount = artifact.page.modules.reduce((sum, module) => sum + module.informationObjects.length, 0);
    const evidenceCount = new Set(artifact.page.modules.flatMap((module) => module.sourceIds.filter((id) => id.startsWith("evidence:")))).size;
    return infoCount >= policy.minimumInformationObjectsPerPage && evidenceCount >= policy.minimumEvidenceReferencesPerPage;
  });
  const renderErrors = validateRenderedCohort(transaction);
  const semanticState = embeddingBackend ? (rejectedPairs.some((pair) => (pair.semanticSimilarity ?? 0) >= policy.semanticDuplicateThreshold) ? "fail" : "pass") : "pending";
  const lexicalState = rejectedPairs.some((pair) => pair.lexicalSimilarity >= policy.lexicalDuplicateThreshold) ? "fail" : "pass";
  const validation = buildValidationReport(`corpus:${transaction.transactionHash}`, CORPUS_VALIDATION, [
    finding("corpus.lexical", lexicalState, `${index.documents.length} pages; ${lexicalCandidates.size} sparse candidate pairs; threshold=${policy.lexicalDuplicateThreshold}`),
    finding("corpus.semantic", semanticState, embeddingBackend ? `${embeddingBackend.id} produced ${embeddings.length} vectors; threshold=${policy.semanticDuplicateThreshold}` : "local embedding backend was not supplied"),
    finding("corpus.information", informationPass ? "pass" : "fail", `minimum information objects=${policy.minimumInformationObjectsPerPage}; evidence references=${policy.minimumEvidenceReferencesPerPage}`),
    finding("corpus.render", renderErrors.length === 0 ? "pass" : "fail", renderErrors.length === 0 ? `${transaction.rendered.pages.length} static pages passed crawl checks` : renderErrors.join("; ")),
    finding("corpus.scale", transaction.site.pages.length > 0 ? "pass" : "fail", `${transaction.site.pages.length} pages validated with ${lexicalCandidates.size} bounded candidate pairs`),
  ]);
  const canonical = {
    pageCount: documents.length,
    lexicalIndexHash: index.indexHash,
    embeddingBackendId: embeddingBackend?.id ?? null,
    candidatePairs: lexicalCandidates.size,
    rejectedPairs,
    validationHash: validation.reportHash,
  };
  return { ...canonical, validation, validationHash: sha256(JSON.stringify(canonical)) };
}

export function createOpenAiCompatibleEmbeddingBackend(config: LocalEmbeddingEndpointConfig): LocalEmbeddingBackend {
  const batchSize = config.batchSize ?? 64;
  const timeoutMilliseconds = config.timeoutMilliseconds ?? 120_000;
  if (!config.endpoint.trim() || !config.model.trim()) throw new Error("embedding endpoint and model are required");
  if (!Number.isInteger(batchSize) || batchSize < 1 || batchSize > 512) throw new Error("embedding batchSize must be between 1 and 512");
  return {
    id: config.id?.trim() || `local-embeddings:${config.model}`,
    async embed(texts) {
      const vectors: Float32Array[] = [];
      for (let offset = 0; offset < texts.length; offset += batchSize) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), timeoutMilliseconds);
        try {
          const response = await fetch(config.endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {}),
            },
            signal: controller.signal,
            body: JSON.stringify({ model: config.model, input: texts.slice(offset, offset + batchSize) }),
          });
          const text = await response.text();
          if (!response.ok) throw new Error(`embedding request failed (${response.status}): ${text.slice(0, 500)}`);
          const payload = JSON.parse(text) as { data?: Array<{ index?: number; embedding?: number[] }> };
          const ordered = [...(payload.data ?? [])].sort((left, right) => (left.index ?? 0) - (right.index ?? 0));
          if (ordered.length !== Math.min(batchSize, texts.length - offset)) throw new Error("embedding response count mismatch");
          for (const item of ordered) {
            if (!item.embedding || item.embedding.length === 0 || item.embedding.some((value) => !Number.isFinite(value))) throw new Error("embedding response contains an invalid vector");
            vectors.push(Float32Array.from(item.embedding));
          }
        } finally {
          clearTimeout(timeout);
        }
      }
      return vectors;
    },
  };
}

function validateRenderedCohort(transaction: PageDraftTransaction): string[] {
  const errors: string[] = [];
  const routes = new Set(transaction.rendered.pages.map((page) => page.route));
  if (routes.size !== transaction.rendered.pages.length) errors.push("rendered routes are not unique");
  const pageIdByRoute = new Map(transaction.source.pages.map((page) => [page.route, page.id]));
  for (const page of transaction.rendered.pages) {
    if (!page.html.includes("<!doctype html>") || !page.html.includes("<main") || !page.html.includes("</html>")) errors.push(`${page.pageId} lacks a complete HTML shell`);
    if (!page.html.includes('<meta name="robots" content="noindex,nofollow">')) errors.push(`${page.pageId} lost noindex metadata`);
    if (!page.html.includes('<link rel="canonical" href="https://')) errors.push(`${page.pageId} lacks an HTTPS canonical`);
    if (!page.html.includes('<link rel="stylesheet" href="/assets/hyper-site.css">')) errors.push(`${page.pageId} lacks the shared stylesheet`);
    const hrefs = [...page.html.matchAll(/<a href="([^"]+)"/g)].map((match) => match[1]);
    for (const href of hrefs) if (href.startsWith("/") && !pageIdByRoute.has(href)) errors.push(`${page.pageId} has broken internal route ${href}`);
  }
  return [...new Set(errors)].sort();
}

function pageText(page: CompiledSite["pages"][number]["page"]): string {
  return [
    page.title,
    page.description,
    page.canonicalQuestion,
    ...page.modules.flatMap((module) => [module.heading ?? "", ...module.paragraphs, ...module.informationObjects.flatMap((item) => [item.title, item.body])]),
  ].join("\n");
}

function canonicalDraft(draft: GeneratedPageDraft): object {
  return {
    ...draft,
    expressedAttributeIds: sorted(draft.expressedAttributeIds),
    evidenceIds: sorted(draft.evidenceIds),
    sourceIds: sorted(draft.sourceIds),
    claims: [...draft.claims].sort((left, right) => left.id.localeCompare(right.id)).map((item) => ({ ...item, evidenceIds: sorted(item.evidenceIds) })),
    informationObjects: [...draft.informationObjects].sort((left, right) => left.id.localeCompare(right.id)).map((item) => ({ ...item, evidenceIds: sorted(item.evidenceIds) })),
    utilityTasks: [...draft.utilityTasks].sort((left, right) => left.id.localeCompare(right.id)).map((item) => ({ ...item, evidenceIds: sorted(item.evidenceIds) })),
    modules: [...draft.modules].sort((left, right) => left.id.localeCompare(right.id)).map((item) => ({
      ...item,
      claimIds: sorted(item.claimIds),
      informationObjectIds: sorted(item.informationObjectIds),
      requiredCapabilities: sorted(item.requiredCapabilities),
      sourceIds: sorted(item.sourceIds),
    })),
    internalPageIds: sorted(draft.internalPageIds),
  };
}

function confidenceLevel(confidence: NormalizedProject["evidenceLedger"][number]["confidence"]): EvidenceLevel {
  switch (confidence) {
    case "verified": return 4;
    case "high": return 3;
    case "medium": return 2;
    case "low": return 1;
  }
}

function claimUnique(ids: Set<string>, id: string, label: string): void {
  if (!id.trim() || ids.has(id)) throw new Error(`invalid or duplicate ${label} ${id}`);
  ids.add(id);
}

function cosineFloat(left: Float32Array, right: Float32Array): number {
  if (left.length !== right.length) throw new Error("embedding dimension mismatch");
  let dot = 0; let leftNorm = 0; let rightNorm = 0;
  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index];
    leftNorm += left[index] * left[index];
    rightNorm += right[index] * right[index];
  }
  if (leftNorm <= 0 || rightNorm <= 0) throw new Error("embedding norm must be positive");
  return dot / Math.sqrt(leftNorm * rightNorm);
}

function validateCorpusPolicy(policy: CorpusValidationPolicy): void {
  if (![policy.lexicalDuplicateThreshold, policy.semanticDuplicateThreshold].every((value) => Number.isFinite(value) && value >= 0 && value <= 1)) throw new Error("corpus duplicate thresholds must be within [0,1]");
  if (!Number.isInteger(policy.neighborLimit) || policy.neighborLimit < 1) throw new Error("corpus neighborLimit must be positive");
  if (!Number.isInteger(policy.minimumInformationObjectsPerPage) || policy.minimumInformationObjectsPerPage < 1) throw new Error("information-object floor must be positive");
  if (!Number.isInteger(policy.minimumEvidenceReferencesPerPage) || policy.minimumEvidenceReferencesPerPage < 1) throw new Error("evidence-reference floor must be positive");
}

function sorted<T extends string>(values: readonly T[]): T[] {
  return [...new Set(values)].sort() as T[];
}

function required<K, V>(map: ReadonlyMap<K, V>, key: K, label: string): V {
  const value = map.get(key);
  if (value === undefined) throw new Error(`${label} references unknown ${String(key)}`);
  return value;
}
