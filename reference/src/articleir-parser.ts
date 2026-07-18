import { sha256 } from "./core.js";
import { compileRule, type EmittedPageContract, type PageContractLinkRelation } from "./pcn-emitter.js";

export interface ArticleIRSection {
  id: string;
  heading: string;
  declaredTargetWords: number;
  actualWords: number;
  prose: string;
  citationIds: readonly string[];
}

export interface ArticleIRLink {
  relation: PageContractLinkRelation;
  pageId: string;
  anchorText: string;
}

export interface ArticleIRSchema {
  type: string;
  fields: Readonly<Record<string, string>>;
}

export interface ArticleIR {
  pageId: string;
  contractHash: string;
  sections: readonly ArticleIRSection[];
  links: readonly ArticleIRLink[];
  schema: ArticleIRSchema;
  citationIds: readonly string[];
  wordCount: number;
  rawHash: string;
  articleHash: string;
}

export interface ArticleIRValidationPolicy {
  wordToleranceRatio: number;
  requireSectionEvidence: boolean;
  maximumCharacters: number;
}

export interface ArticleIRValidationResult {
  article: ArticleIR | null;
  errors: readonly string[];
}

export class ArticleIRValidationError extends Error {
  readonly errors: readonly string[];

  constructor(errors: readonly string[]) {
    super(`ArticleIR rejected: ${errors.join("; ")}`);
    this.name = "ArticleIRValidationError";
    this.errors = errors;
  }
}

export const DEFAULT_ARTICLE_IR_POLICY: ArticleIRValidationPolicy = {
  wordToleranceRatio: 0.15,
  requireSectionEvidence: true,
  maximumCharacters: 160_000,
};

export function parseArticleIR(
  raw: string,
  emitted: EmittedPageContract,
  policy: ArticleIRValidationPolicy = DEFAULT_ARTICLE_IR_POLICY,
): ArticleIR {
  const result = validateArticleIR(raw, emitted, policy);
  if (!result.article) throw new ArticleIRValidationError(result.errors);
  return result.article;
}

export function validateArticleIR(
  raw: string,
  emitted: EmittedPageContract,
  policy: ArticleIRValidationPolicy = DEFAULT_ARTICLE_IR_POLICY,
): ArticleIRValidationResult {
  const errors: string[] = [];
  validatePolicy(policy);
  if (!raw.trim()) return { article: null, errors: ["ArticleIR output is empty"] };
  if (raw.length > policy.maximumCharacters) return { article: null, errors: [`ArticleIR exceeds ${policy.maximumCharacters} characters`] };
  const blocks = splitBlocks(raw, errors);
  const contract = emitted.contract;
  const knownEvidence = new Set(contract.evidence.map((item) => item.id));
  const expectedSectionIds = contract.sections.map((item) => item.id);
  const actualSectionIds = [...blocks.keys()].filter((id) => id !== "links" && id !== "schema");
  for (const sectionId of expectedSectionIds) if (!blocks.has(sectionId)) errors.push(`missing required section ${sectionId}`);
  for (const sectionId of actualSectionIds) if (!expectedSectionIds.includes(sectionId)) errors.push(`unknown section ${sectionId}`);

  const sections: ArticleIRSection[] = [];
  for (const expected of contract.sections) {
    const block = blocks.get(expected.id);
    if (!block) continue;
    if (block.declaredTargetWords === null) {
      errors.push(`section ${expected.id} must declare target words as §${expected.id}:${expected.targetWords}`);
      continue;
    }
    if (block.declaredTargetWords !== expected.targetWords) errors.push(`section ${expected.id} declares ${block.declaredTargetWords} words but PCN requires ${expected.targetWords}`);
    const prose = block.body.trim();
    if (!prose) errors.push(`section ${expected.id} is empty`);
    const actualWords = countWords(prose);
    const minimum = Math.floor(expected.targetWords * (1 - policy.wordToleranceRatio));
    const maximum = Math.ceil(expected.targetWords * (1 + policy.wordToleranceRatio));
    if (actualWords < minimum || actualWords > maximum) errors.push(`section ${expected.id} contains ${actualWords} words; expected ${minimum}..${maximum}`);
    const citationIds = extractCitationIds(prose);
    for (const citationId of citationIds) if (!knownEvidence.has(citationId)) errors.push(`section ${expected.id} cites unknown evidence ${citationId}`);
    if (policy.requireSectionEvidence) {
      for (const evidenceId of expected.requiredEvidenceIds ?? []) if (!citationIds.includes(evidenceId)) errors.push(`section ${expected.id} is missing required evidence ${evidenceId}`);
    }
    sections.push({
      id: expected.id,
      heading: expected.heading,
      declaredTargetWords: block.declaredTargetWords,
      actualWords,
      prose,
      citationIds,
    });
  }

  const completeProse = sections.map((item) => item.prose).join("\n\n");
  for (const rule of contract.forbiddenPatterns) if (compileRule(rule).test(completeProse)) errors.push(`forbidden pattern matched: ${rule.id}`);
  for (const rule of contract.mandatoryPatterns) if (!compileRule(rule).test(completeProse)) errors.push(`mandatory pattern missing: ${rule.id}`);

  const links = parseLinks(blocks.get("links")?.body ?? "", emitted, errors);
  const schema = parseSchema(blocks.get("schema")?.body ?? "", emitted, errors);
  const citationIds = [...new Set(sections.flatMap((item) => item.citationIds))].sort();
  const rawHash = sha256(raw.replace(/\r\n/g, "\n").trim());
  const canonical = {
    pageId: contract.pageId,
    contractHash: emitted.contractHash,
    sections,
    links,
    schema,
    citationIds,
    wordCount: sections.reduce((sum, item) => sum + item.actualWords, 0),
    rawHash,
  };
  const article = { ...canonical, articleHash: sha256(JSON.stringify(canonical)) };
  return { article: errors.length === 0 ? article : null, errors };
}

interface ParsedBlock {
  id: string;
  declaredTargetWords: number | null;
  body: string;
}

function splitBlocks(raw: string, errors: string[]): Map<string, ParsedBlock> {
  const normalized = raw.replace(/\r\n/g, "\n").trim();
  const matches = [...normalized.matchAll(/^§([A-Za-z0-9_-]+)(?::(\d+))?\s*$/gm)];
  const blocks = new Map<string, ParsedBlock>();
  if (matches.length === 0) {
    errors.push("ArticleIR contains no §section headers");
    return blocks;
  }
  if ((matches[0].index ?? 0) !== 0 && normalized.slice(0, matches[0].index).trim()) errors.push("ArticleIR contains prose before the first section header");
  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    const id = match[1];
    if (blocks.has(id)) {
      errors.push(`duplicate ArticleIR block ${id}`);
      continue;
    }
    const bodyStart = (match.index ?? 0) + match[0].length;
    const bodyEnd = index + 1 < matches.length ? matches[index + 1].index ?? normalized.length : normalized.length;
    blocks.set(id, {
      id,
      declaredTargetWords: match[2] === undefined ? null : Number.parseInt(match[2], 10),
      body: normalized.slice(bodyStart, bodyEnd).trim(),
    });
  }
  return blocks;
}

function parseLinks(raw: string, emitted: EmittedPageContract, errors: string[]): ArticleIRLink[] {
  const expected = new Map(emitted.contract.links.map((item) => [`${item.relation}:${item.pageId}`, item]));
  const links: ArticleIRLink[] = [];
  if (expected.size > 0 && !raw.trim()) errors.push("missing §links block entries");
  for (const line of nonEmptyLines(raw)) {
    const [relation, pageId, ...anchorParts] = line.split("|").map((item) => item.trim());
    if (relation !== "up" && relation !== "sideways" && relation !== "down") {
      errors.push(`invalid ArticleIR link relation ${relation || "<empty>"}`);
      continue;
    }
    const anchorText = anchorParts.join("|").trim();
    const key = `${relation}:${pageId}`;
    const planned = expected.get(key);
    if (!planned) {
      errors.push(`ArticleIR contains unplanned link ${key}`);
      continue;
    }
    if (anchorText !== planned.anchorText) errors.push(`ArticleIR link ${key} changed planned anchor text`);
    links.push({ relation, pageId, anchorText });
  }
  const actual = new Set(links.map((item) => `${item.relation}:${item.pageId}`));
  for (const key of expected.keys()) if (!actual.has(key)) errors.push(`ArticleIR is missing planned link ${key}`);
  return links.sort((left, right) => left.relation.localeCompare(right.relation) || left.pageId.localeCompare(right.pageId));
}

function parseSchema(raw: string, emitted: EmittedPageContract, errors: string[]): ArticleIRSchema {
  const lines = nonEmptyLines(raw);
  if (lines.length === 0) {
    errors.push("missing §schema block");
    return { type: "", fields: {} };
  }
  if (lines.length > 1) errors.push("§schema must contain one pipe-delimited line");
  const [type, ...pairs] = lines[0].split("|").map((item) => item.trim());
  if (type !== emitted.contract.schema.type) errors.push(`ArticleIR schema type ${type || "<empty>"} does not match ${emitted.contract.schema.type}`);
  const fields: Record<string, string> = {};
  for (const pair of pairs) {
    const separator = pair.indexOf(":");
    if (separator < 1) {
      errors.push(`invalid schema field ${pair}`);
      continue;
    }
    const key = pair.slice(0, separator).trim();
    const value = pair.slice(separator + 1).trim();
    if (!key || !value || key in fields) errors.push(`invalid or duplicate schema field ${key || "<empty>"}`);
    else fields[key] = value;
  }
  const plannedFields = Object.fromEntries(Object.entries(emitted.contract.schema.fields ?? {}).map(([key, value]) => [key, String(value)]));
  for (const key of Object.keys(fields)) if (!(key in plannedFields)) errors.push(`ArticleIR schema contains unplanned field ${key}`);
  for (const [key, value] of Object.entries(plannedFields)) {
    if (!(key in fields)) errors.push(`ArticleIR schema is missing planned field ${key}`);
    else if (fields[key] !== value) errors.push(`ArticleIR schema field ${key} changed planned value`);
  }
  return { type, fields: Object.fromEntries(Object.entries(fields).sort(([left], [right]) => left.localeCompare(right))) };
}

export function extractCitationIds(prose: string): string[] {
  const ids: string[] = [];
  for (const match of prose.matchAll(/(?:\(|\[)(e(?:vidence:)?[A-Za-z0-9_.:-]+)(?:\)|\])/g)) ids.push(match[1]);
  return [...new Set(ids)].sort();
}

export function countWords(prose: string): number {
  const withoutCitations = prose.replace(/(?:\(|\[)e(?:vidence:)?[A-Za-z0-9_.:-]+(?:\)|\])/g, " ");
  return withoutCitations.match(/[\p{L}\p{N}]+(?:['’.-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
}

function nonEmptyLines(raw: string): string[] {
  return raw.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
}

function validatePolicy(policy: ArticleIRValidationPolicy): void {
  if (!Number.isFinite(policy.wordToleranceRatio) || policy.wordToleranceRatio < 0 || policy.wordToleranceRatio > 1) throw new Error("wordToleranceRatio must be between 0 and 1");
  if (!Number.isInteger(policy.maximumCharacters) || policy.maximumCharacters < 1) throw new Error("maximumCharacters must be a positive integer");
}
