import { hash32, sha256 } from "./core.js";
import { buildSparseLexicalIndex, tfIdfCosine, type SparseLexicalDocument, type SparseLexicalIndex } from "./sparse-lexical.js";
import type {
  CorpusValidationPolicy,
  CorpusValidationResult,
  DuplicatePair,
  LocalEmbeddingBackend,
  PageDraftTransaction,
} from "./page-draft-transaction.js";
import { CORPUS_VALIDATION, DEFAULT_CORPUS_VALIDATION_POLICY } from "./page-draft-transaction.js";
import { buildValidationReport, finding } from "./validation-contracts.js";

export interface ProductionCorpusValidationPolicy extends CorpusValidationPolicy {
  rareTermsPerPage: number;
  maximumPostingSize: number;
  lexicalBands: number;
  semanticBands: number;
  maximumCandidatesPerPage: number;
}

export const DEFAULT_PRODUCTION_CORPUS_POLICY: ProductionCorpusValidationPolicy = {
  ...DEFAULT_CORPUS_VALIDATION_POLICY,
  rareTermsPerPage: 8,
  maximumPostingSize: 512,
  lexicalBands: 4,
  semanticBands: 4,
  maximumCandidatesPerPage: 96,
};

export async function validateProductionCorpus(
  transaction: PageDraftTransaction,
  embeddingBackend: LocalEmbeddingBackend | null,
  policy: ProductionCorpusValidationPolicy = DEFAULT_PRODUCTION_CORPUS_POLICY,
): Promise<CorpusValidationResult> {
  validatePolicy(policy);
  const documents = transaction.site.pages.map((artifact) => ({ id: artifact.page.id, text: pageText(artifact.page) }));
  const index = buildSparseLexicalIndex(documents);
  const candidateKeys = boundedLexicalCandidates(index, policy);
  addExactDuplicateCandidates(documents, candidateKeys);
  addSequentialCandidates(documents.map((item) => item.id), candidateKeys);

  const embeddings = embeddingBackend ? await embeddingBackend.embed(documents.map((item) => item.text)) : [];
  if (embeddingBackend && embeddings.length !== documents.length) {
    throw new Error(`embedding backend returned ${embeddings.length} vectors for ${documents.length} pages`);
  }
  const vectorById = new Map<string, Float32Array>();
  embeddings.forEach((vector, indexValue) => {
    if (vector.length === 0) throw new Error(`embedding backend returned an empty vector for ${documents[indexValue].id}`);
    if ([...vector].some((value) => !Number.isFinite(value))) throw new Error(`embedding backend returned a non-finite vector for ${documents[indexValue].id}`);
    vectorById.set(documents[indexValue].id, vector);
  });
  if (embeddingBackend) addSemanticLshCandidates(documents.map((item) => item.id), vectorById, candidateKeys, policy);

  const rejectedPairs: DuplicatePair[] = [];
  for (const key of [...candidateKeys].sort()) {
    const [leftPageId, rightPageId] = key.split("\0");
    const lexicalSimilarity = tfIdfCosine(index, leftPageId, rightPageId);
    const semanticSimilarity = embeddingBackend
      ? cosineFloat(required(vectorById, leftPageId), required(vectorById, rightPageId))
      : undefined;
    if (lexicalSimilarity >= policy.lexicalDuplicateThreshold
      || (semanticSimilarity !== undefined && semanticSimilarity >= policy.semanticDuplicateThreshold)) {
      rejectedPairs.push({ leftPageId, rightPageId, lexicalSimilarity, ...(semanticSimilarity === undefined ? {} : { semanticSimilarity }) });
    }
  }
  rejectedPairs.sort((left, right) => left.leftPageId.localeCompare(right.leftPageId) || left.rightPageId.localeCompare(right.rightPageId));

  const informationPass = hasInformationAndEvidence(transaction, policy);
  const renderErrors = validateRenderedCohort(transaction);
  const lexicalState = rejectedPairs.some((pair) => pair.lexicalSimilarity >= policy.lexicalDuplicateThreshold) ? "fail" : "pass";
  const semanticState = embeddingBackend
    ? rejectedPairs.some((pair) => (pair.semanticSimilarity ?? 0) >= policy.semanticDuplicateThreshold) ? "fail" : "pass"
    : "pending";
  const candidateCap = documents.length * (policy.maximumCandidatesPerPage * 2 + 2);
  const bounded = candidateKeys.size <= Math.max(1, candidateCap);
  const validation = buildValidationReport(`production-corpus:${transaction.transactionHash}`, CORPUS_VALIDATION, [
    finding("corpus.lexical", lexicalState, `${documents.length} pages; ${candidateKeys.size} bounded candidate pairs; threshold=${policy.lexicalDuplicateThreshold}`),
    finding("corpus.semantic", semanticState, embeddingBackend ? `${embeddingBackend.id} produced ${embeddings.length} vectors; threshold=${policy.semanticDuplicateThreshold}` : "local embedding backend was not supplied"),
    finding("corpus.information", informationPass ? "pass" : "fail", `minimum information objects=${policy.minimumInformationObjectsPerPage}; evidence references=${policy.minimumEvidenceReferencesPerPage}`),
    finding("corpus.render", renderErrors.length === 0 ? "pass" : "fail", renderErrors.length === 0 ? `${transaction.rendered.pages.length} static pages passed crawl checks` : renderErrors.join("; ")),
    finding("corpus.scale", bounded && documents.length > 0 ? "pass" : "fail", `${documents.length} pages validated with ${candidateKeys.size} candidates; cap=${candidateCap}`),
  ]);
  const canonical = {
    pageCount: documents.length,
    lexicalIndexHash: index.indexHash,
    embeddingBackendId: embeddingBackend?.id ?? null,
    candidatePairs: candidateKeys.size,
    rejectedPairs,
    validationHash: validation.reportHash,
  };
  return { ...canonical, validation, validationHash: sha256(JSON.stringify(canonical)) };
}

function boundedLexicalCandidates(index: SparseLexicalIndex, policy: ProductionCorpusValidationPolicy): Set<string> {
  const perPage = new Map<string, Set<string>>();
  for (const document of index.documents) {
    const local = perPage.get(document.id) ?? new Set<string>();
    const rareTerms = document.termFrequencies
      .map(([term]) => ({ term, postingSize: index.postings[term]?.length ?? 0 }))
      .filter((item) => item.postingSize > 1 && item.postingSize <= policy.maximumPostingSize)
      .sort((left, right) => left.postingSize - right.postingSize || left.term.localeCompare(right.term))
      .slice(0, policy.rareTermsPerPage);
    for (const { term } of rareTerms) {
      for (const otherId of index.postings[term] ?? []) {
        if (otherId !== document.id && local.size < policy.maximumCandidatesPerPage) local.add(otherId);
      }
    }
    perPage.set(document.id, local);
  }

  const buckets = new Map<string, string[]>();
  for (const document of index.documents) {
    lexicalBandSignatures(document, policy.lexicalBands).forEach((signature, band) => {
      const key = `${band}:${signature}`;
      const ids = buckets.get(key) ?? [];
      ids.push(document.id);
      buckets.set(key, ids);
    });
  }
  for (const ids of buckets.values()) addBucketPairs(ids, perPage, policy.maximumCandidatesPerPage);

  const candidates = new Set<string>();
  for (const [pageId, local] of perPage) for (const otherId of local) candidates.add(pairKey(pageId, otherId));
  return candidates;
}

function addExactDuplicateCandidates(documents: readonly { id: string; text: string }[], candidates: Set<string>): void {
  const groups = new Map<string, string[]>();
  for (const document of documents) {
    const normalized = document.text.normalize("NFKC").replace(/\s+/g, " ").trim().toLowerCase();
    const hash = sha256(normalized);
    const ids = groups.get(hash) ?? [];
    ids.push(document.id);
    groups.set(hash, ids);
  }
  for (const ids of groups.values()) {
    const ordered = [...ids].sort();
    for (let index = 1; index < ordered.length; index += 1) candidates.add(pairKey(ordered[index - 1], ordered[index]));
  }
}

function addSequentialCandidates(pageIds: readonly string[], candidates: Set<string>): void {
  const ordered = [...pageIds].sort();
  for (let index = 1; index < ordered.length; index += 1) candidates.add(pairKey(ordered[index - 1], ordered[index]));
}

function lexicalBandSignatures(document: SparseLexicalDocument, bands: number): string[] {
  const terms = document.tfIdf.filter(([, weight]) => weight > 0).map(([term]) => term);
  const signatures: string[] = [];
  for (let band = 0; band < bands; band += 1) {
    let minimum = 0xffffffff;
    for (const term of terms) minimum = Math.min(minimum, hash32(`${band}:${term}`));
    signatures.push(minimum.toString(16).padStart(8, "0"));
  }
  return signatures;
}

function addSemanticLshCandidates(
  pageIds: readonly string[],
  vectors: ReadonlyMap<string, Float32Array>,
  candidates: Set<string>,
  policy: ProductionCorpusValidationPolicy,
): void {
  const perPage = new Map<string, Set<string>>();
  const buckets = new Map<string, string[]>();
  for (const pageId of pageIds) {
    const vector = required(vectors, pageId);
    const width = Math.max(1, Math.floor(vector.length / policy.semanticBands));
    for (let band = 0; band < policy.semanticBands; band += 1) {
      let signature = 0;
      for (let offset = 0; offset < Math.min(16, width); offset += 1) {
        const vectorIndex = Math.min(vector.length - 1, band * width + offset);
        if (vector[vectorIndex] >= 0) signature |= 1 << offset;
      }
      const key = `${band}:${signature.toString(16)}`;
      const ids = buckets.get(key) ?? [];
      ids.push(pageId);
      buckets.set(key, ids);
    }
  }
  for (const ids of buckets.values()) addBucketPairs(ids, perPage, policy.maximumCandidatesPerPage);
  for (const [pageId, local] of perPage) for (const otherId of local) candidates.add(pairKey(pageId, otherId));
}

function addBucketPairs(ids: readonly string[], perPage: Map<string, Set<string>>, cap: number): void {
  const ordered = [...new Set(ids)].sort();
  if (ordered.length > cap * 4) return;
  for (let left = 0; left < ordered.length; left += 1) {
    const local = perPage.get(ordered[left]) ?? new Set<string>();
    for (let right = left + 1; right < ordered.length && local.size < cap; right += 1) local.add(ordered[right]);
    perPage.set(ordered[left], local);
  }
}

function hasInformationAndEvidence(transaction: PageDraftTransaction, policy: ProductionCorpusValidationPolicy): boolean {
  const claimById = new Map(transaction.source.claims.map((item) => [item.id, item]));
  const informationById = new Map(transaction.source.informationObjects.map((item) => [item.id, item]));
  const moduleById = new Map(transaction.source.modules.map((item) => [item.id, item]));
  return transaction.source.pages.every((page) => {
    const evidenceIds = new Set<string>();
    const informationIds = new Set<string>();
    for (const moduleId of page.moduleIds) {
      const module = required(moduleById, moduleId);
      for (const claimId of module.claimIds) {
        for (const evidenceId of required(claimById, claimId).evidenceIds) evidenceIds.add(evidenceId);
      }
      for (const informationId of module.informationObjectIds) {
        informationIds.add(informationId);
        for (const evidenceId of required(informationById, informationId).evidenceIds) evidenceIds.add(evidenceId);
      }
    }
    return informationIds.size >= policy.minimumInformationObjectsPerPage
      && evidenceIds.size >= policy.minimumEvidenceReferencesPerPage;
  });
}

function validateRenderedCohort(transaction: PageDraftTransaction): string[] {
  const errors: string[] = [];
  const routes = new Set(transaction.rendered.pages.map((page) => page.route));
  if (routes.size !== transaction.rendered.pages.length) errors.push("rendered routes are not unique");
  const knownRoutes = new Set(transaction.source.pages.map((page) => page.route));
  for (const page of transaction.rendered.pages) {
    if (!page.html.includes("<!doctype html>") || !page.html.includes("<main") || !page.html.includes("</html>")) errors.push(`${page.pageId} lacks a complete HTML shell`);
    if (!page.html.includes('<meta name="robots" content="noindex,nofollow">')) errors.push(`${page.pageId} lost noindex metadata`);
    if (!page.html.includes('<link rel="canonical" href="https://')) errors.push(`${page.pageId} lacks an HTTPS canonical`);
    if (!page.html.includes('<link rel="stylesheet" href="/assets/hyper-site.css">')) errors.push(`${page.pageId} lacks the shared stylesheet`);
    for (const match of page.html.matchAll(/<a href="([^"]+)"/g)) {
      const href = match[1];
      if (href.startsWith("/") && !knownRoutes.has(href)) errors.push(`${page.pageId} has broken internal route ${href}`);
    }
  }
  return [...new Set(errors)].sort();
}

function pageText(page: PageDraftTransaction["site"]["pages"][number]["page"]): string {
  return [
    page.title,
    page.description,
    page.canonicalQuestion,
    ...page.modules.flatMap((module) => [
      module.heading ?? "",
      ...module.paragraphs,
      ...module.informationObjects.flatMap((item) => [item.title, item.body]),
    ]),
  ].join("\n");
}

function pairKey(left: string, right: string): string {
  return left < right ? `${left}\0${right}` : `${right}\0${left}`;
}

function cosineFloat(left: Float32Array, right: Float32Array): number {
  if (left.length !== right.length) throw new Error("embedding dimension mismatch");
  let dot = 0;
  let leftNorm = 0;
  let rightNorm = 0;
  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index];
    leftNorm += left[index] * left[index];
    rightNorm += right[index] * right[index];
  }
  if (leftNorm <= 0 || rightNorm <= 0) throw new Error("embedding norm must be positive");
  return dot / Math.sqrt(leftNorm * rightNorm);
}

function validatePolicy(policy: ProductionCorpusValidationPolicy): void {
  if (![policy.lexicalDuplicateThreshold, policy.semanticDuplicateThreshold].every((value) => Number.isFinite(value) && value >= 0 && value <= 1)) {
    throw new Error("duplicate thresholds must be within [0,1]");
  }
  const integerValues = {
    neighborLimit: policy.neighborLimit,
    minimumInformationObjectsPerPage: policy.minimumInformationObjectsPerPage,
    minimumEvidenceReferencesPerPage: policy.minimumEvidenceReferencesPerPage,
    rareTermsPerPage: policy.rareTermsPerPage,
    maximumPostingSize: policy.maximumPostingSize,
    lexicalBands: policy.lexicalBands,
    semanticBands: policy.semanticBands,
    maximumCandidatesPerPage: policy.maximumCandidatesPerPage,
  };
  for (const [name, value] of Object.entries(integerValues)) {
    if (!Number.isInteger(value) || value < 1) throw new Error(`${name} must be a positive integer`);
  }
}

function required<K, V>(map: ReadonlyMap<K, V>, key: K): V {
  const value = map.get(key);
  if (value === undefined) throw new Error(`missing ${String(key)}`);
  return value;
}
