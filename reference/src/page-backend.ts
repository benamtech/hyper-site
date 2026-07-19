import { sha256 } from "./core.js";
import { parseArticleIR, validateArticleIR, type ArticleIR, type ArticleIRValidationPolicy } from "./articleir-parser.js";
import type { ZaiGlmProvider, StructuredGenerationResult } from "./glm-provider.js";
import type { EmittedPageContract } from "./pcn-emitter.js";
import { unfoldArticleIR, type LoweredPageArtifact, type UnfolderDesignAuthority, type UnfolderOptions } from "./unfolder.js";

export interface ArticleIRBackendPayload {
  articles: readonly { pageId: string; articleIR: string }[];
}

export interface PageBackendContractInput {
  emitted: EmittedPageContract;
  evidenceTextById?: Readonly<Record<string, string>>;
}

export interface PageBackendBatchInput {
  requestId: string;
  contracts: readonly PageBackendContractInput[];
  design: UnfolderDesignAuthority;
  maximumOutputTokens?: number;
  articlePolicy?: ArticleIRValidationPolicy;
  unfoldOptions?: UnfolderOptions;
}

export interface LoweredBackendPage {
  emitted: EmittedPageContract;
  article: ArticleIR;
  artifact: LoweredPageArtifact;
}

export interface PageBackendBatchResult {
  requestId: string;
  providerRequestId: string;
  model: string;
  attempts: number;
  pages: readonly LoweredBackendPage[];
  resultHash: string;
  providerResult: StructuredGenerationResult<ArticleIRBackendPayload>;
}

export interface ConcurrentBackendBatchInput {
  id: string;
  input: PageBackendBatchInput;
}

export interface ConcurrentBackendResult {
  batches: readonly { id: string; result: PageBackendBatchResult }[];
  concurrency: number;
  resultHash: string;
}

const ARTICLE_IR_BATCH_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["articles"],
  properties: {
    articles: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["pageId", "articleIR"],
        properties: {
          pageId: { type: "string", minLength: 1 },
          articleIR: { type: "string", minLength: 1 },
        },
      },
    },
  },
} as const;

/**
 * Treats the LLM as a compiler backend: PCN is the input contract, ArticleIR is
 * the only accepted backend output, and deterministic code owns final syntax.
 */
export async function lowerPageContractBatch(
  provider: ZaiGlmProvider,
  input: PageBackendBatchInput,
): Promise<PageBackendBatchResult> {
  validateBatchInput(input);
  const byPageId = new Map(input.contracts.map((item) => [item.emitted.contract.pageId, item]));
  const sourceIds = [...new Set(input.contracts.flatMap((item) => item.emitted.contract.sourceIds))].sort();
  const request = {
    id: input.requestId,
    stage: "stage-2-page-batch" as const,
    systemPrompt: [
      "You are the prose backend of a deterministic web compiler.",
      "Execute each Page Contract Notation exactly; do not redesign intent, evidence, links, schema, or section weights.",
      "Return one JSON object with an articles array. Each articleIR string must use §section:targetWords blocks, then §links and §schema.",
      "Cite only declared evidence IDs using (evidence:id) or (e1) syntax. Do not emit Markdown, HTML, CSS, JSON-LD, or commentary inside articleIR.",
      "External deterministic parsers decide acceptance and will reject missing sections, word-count drift, unknown evidence, forbidden patterns, link drift, or schema drift.",
    ].join(" "),
    userPrompt: JSON.stringify({
      contracts: input.contracts.map((item) => ({
        pageId: item.emitted.contract.pageId,
        contractHash: item.emitted.contractHash,
        pcn: item.emitted.pcn,
        evidence: item.emitted.contract.evidence.map((evidence) => ({
          id: evidence.id,
          sourceId: evidence.sourceId,
          statement: evidence.statement,
          text: item.evidenceTextById?.[evidence.id] ?? evidence.excerpt ?? evidence.statement,
        })),
      })),
    }),
    schemaName: "ArticleIRBatch",
    schema: ARTICLE_IR_BATCH_SCHEMA,
    sourceIds,
    maximumOutputTokens: input.maximumOutputTokens ?? Math.min(64_000, 4_000 * input.contracts.length),
  };
  const result = await provider.generate<ArticleIRBackendPayload>(request, (value) => validateBackendPayload(value, byPageId, input.articlePolicy));
  const payloadByPageId = new Map(result.value.articles.map((item) => [item.pageId, item.articleIR]));
  const pages = input.contracts.map((item): LoweredBackendPage => {
    const raw = payloadByPageId.get(item.emitted.contract.pageId);
    if (raw === undefined) throw new Error(`provider result omitted ${item.emitted.contract.pageId} after validation`);
    const article = parseArticleIR(raw, item.emitted, input.articlePolicy);
    const artifact = unfoldArticleIR(article, item.emitted, input.design, input.unfoldOptions);
    return { emitted: item.emitted, article, artifact };
  });
  const canonical = {
    requestId: input.requestId,
    providerRequestId: result.requestId,
    model: result.model,
    attempts: result.attempts,
    pages: pages.map((item) => [item.artifact.pageId, item.article.articleHash, item.artifact.artifactHash]),
    providerResultHash: result.resultHash,
  };
  return {
    requestId: input.requestId,
    providerRequestId: result.requestId,
    model: result.model,
    attempts: result.attempts,
    pages,
    resultHash: sha256(JSON.stringify(canonical)),
    providerResult: result,
  };
}

export async function lowerPageContractsConcurrently(
  provider: ZaiGlmProvider,
  batches: readonly ConcurrentBackendBatchInput[],
  concurrency = 10,
): Promise<ConcurrentBackendResult> {
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 64) throw new Error("backend concurrency must be an integer between 1 and 64");
  const ids = new Set<string>();
  for (const batch of batches) {
    if (!batch.id.trim() || ids.has(batch.id)) throw new Error(`invalid or duplicate backend batch ${batch.id}`);
    ids.add(batch.id);
  }
  const results = new Array<{ id: string; result: PageBackendBatchResult }>(batches.length);
  let cursor = 0;
  const worker = async () => {
    while (true) {
      const index = cursor;
      cursor += 1;
      if (index >= batches.length) return;
      const batch = batches[index];
      results[index] = { id: batch.id, result: await lowerPageContractBatch(provider, batch.input) };
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, batches.length) }, () => worker()));
  const canonical = {
    concurrency,
    batches: results.map((item) => [item.id, item.result.resultHash]),
  };
  return { batches: results, concurrency, resultHash: sha256(JSON.stringify(canonical)) };
}

function validateBackendPayload(
  value: unknown,
  byPageId: ReadonlyMap<string, PageBackendContractInput>,
  policy?: ArticleIRValidationPolicy,
): string[] {
  const errors: string[] = [];
  if (!value || typeof value !== "object" || Array.isArray(value)) return ["ArticleIR backend payload must be an object"];
  const articles = (value as { articles?: unknown }).articles;
  if (!Array.isArray(articles)) return ["ArticleIR backend payload requires an articles array"];
  const seen = new Set<string>();
  for (const item of articles) {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      errors.push("ArticleIR batch item must be an object");
      continue;
    }
    const pageId = (item as { pageId?: unknown }).pageId;
    const articleIR = (item as { articleIR?: unknown }).articleIR;
    if (typeof pageId !== "string" || typeof articleIR !== "string") {
      errors.push("ArticleIR batch item requires string pageId and articleIR");
      continue;
    }
    if (seen.has(pageId)) errors.push(`duplicate ArticleIR page ${pageId}`);
    seen.add(pageId);
    const contract = byPageId.get(pageId);
    if (!contract) {
      errors.push(`ArticleIR returned unrequested page ${pageId}`);
      continue;
    }
    errors.push(...validateArticleIR(articleIR, contract.emitted, policy).errors.map((error) => `${pageId}: ${error}`));
  }
  for (const pageId of byPageId.keys()) if (!seen.has(pageId)) errors.push(`ArticleIR omitted requested page ${pageId}`);
  return errors;
}

function validateBatchInput(input: PageBackendBatchInput): void {
  if (!input.requestId.trim() || input.contracts.length === 0) throw new Error("page backend batch requires request identity and contracts");
  if (input.contracts.length > 25) throw new Error("page backend batch cannot exceed 25 contracts");
  const pageIds = new Set<string>();
  for (const item of input.contracts) {
    const pageId = item.emitted.contract.pageId;
    if (pageIds.has(pageId)) throw new Error(`duplicate page backend contract ${pageId}`);
    pageIds.add(pageId);
    if (item.emitted.contract.designAuthorityHash !== input.design.authorityHash) throw new Error(`page contract ${pageId} references another design authority`);
  }
}
