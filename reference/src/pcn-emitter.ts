import { sha256 } from "./core.js";
import type { ApprovedDesignAuthority } from "./design-authoring.js";
import type { ApprovedOntology } from "./ontology-discovery.js";
import type { CandidatePageSeed } from "./page-coordinate.js";
import type { EvidenceLedgerEntry, SourceLedgerEntry } from "./project-input.js";

export type PageContractEntityKind = "S" | "P" | "T" | "O" | "I";
export type PageContractLinkRelation = "up" | "sideways" | "down";
export type PageContractSchemaType = "Article" | "HowTo" | "FAQPage" | "Service" | "WebPage";

export interface PageContractEntity {
  id: string;
  kind: PageContractEntityKind;
  label: string;
  detail: string;
}

export interface PageContractEdge {
  fromId: string;
  toId: string;
  relation: string;
}

export interface PageContractEvidence {
  id: string;
  sourceId: string;
  statement: string;
  url?: string;
  excerpt?: string;
}

export interface PageContractSection {
  id: string;
  heading: string;
  targetWords: number;
  requiredEvidenceIds?: readonly string[];
}

export interface PageContractPatternRule {
  id: string;
  pattern: string;
  flags?: string;
}

export interface PageContractLink {
  relation: PageContractLinkRelation;
  pageId: string;
  route: string;
  anchorText: string;
}

export interface PageContractSchema {
  type: PageContractSchemaType;
  fields?: Readonly<Record<string, string | number | boolean>>;
}

export interface PageContractInput {
  id: string;
  pageId: string;
  route: string;
  canonicalUrl: string;
  canonicalQuestion: string;
  intent: string;
  titleHint?: string;
  voice: readonly string[];
  entities: readonly PageContractEntity[];
  edges: readonly PageContractEdge[];
  mechanismSteps: readonly string[];
  constraints: readonly string[];
  evidence: readonly PageContractEvidence[];
  sections: readonly PageContractSection[];
  mandatoryPatterns: readonly PageContractPatternRule[];
  forbiddenPatterns: readonly PageContractPatternRule[];
  links: readonly PageContractLink[];
  schema: PageContractSchema;
  sourceIds: readonly string[];
  designAuthorityHash: string;
  ontologyHash: string;
  seedHash: string;
}

export interface CanonicalPageContract extends Omit<PageContractInput,
  "voice" | "entities" | "edges" | "mechanismSteps" | "constraints" | "evidence" |
  "sections" | "mandatoryPatterns" | "forbiddenPatterns" | "links" | "sourceIds" | "schema"
> {
  voice: readonly string[];
  entities: readonly PageContractEntity[];
  edges: readonly PageContractEdge[];
  mechanismSteps: readonly string[];
  constraints: readonly string[];
  evidence: readonly PageContractEvidence[];
  sections: readonly PageContractSection[];
  mandatoryPatterns: readonly PageContractPatternRule[];
  forbiddenPatterns: readonly PageContractPatternRule[];
  links: readonly PageContractLink[];
  sourceIds: readonly string[];
  schema: PageContractSchema;
}

export interface CompilerPageContractInput {
  seed: CandidatePageSeed;
  ontology: ApprovedOntology;
  evidenceLedger: readonly EvidenceLedgerEntry[];
  sourceLedger: readonly SourceLedgerEntry[];
  design: ApprovedDesignAuthority;
  baseUrl: string;
  sections: readonly PageContractSection[];
  links: readonly PageContractLink[];
  mandatoryPatterns?: readonly PageContractPatternRule[];
  forbiddenPatterns?: readonly PageContractPatternRule[];
  schema?: PageContractSchema;
  titleHint?: string;
  voice: readonly string[];
  mechanismSteps?: readonly string[];
  constraints?: readonly string[];
  seedHash?: string;
}

export interface EmittedPageContract {
  contract: CanonicalPageContract;
  pcn: string;
  contractHash: string;
  pcnHash: string;
}

/** Connects the canonical compiler frontend to PCN without another model pass. */
export function emitPageContractFromCompilerState(input: CompilerPageContractInput): EmittedPageContract {
  if (!/^https:\/\//.test(input.baseUrl)) throw new Error("compiler page contract baseUrl must use https");
  if (!input.design.authorityHash.trim()) throw new Error("compiler page contract requires an approved design authority");
  const attributes = new Map(input.ontology.attributes.map((item) => [item.id, item]));
  const evidence = new Map(input.evidenceLedger.map((item) => [item.id, item]));
  const sources = new Map(input.sourceLedger.map((item) => [item.id, item]));
  const selectedIds = new Set([
    ...input.seed.serviceOfferIds,
    ...input.seed.topicProblemIds,
    ...input.seed.workflowIntegrationIds,
    ...input.seed.desiredOutcomeIds,
  ]);
  const entities: PageContractEntity[] = [];
  const addAttribute = (id: string, kind: PageContractEntityKind) => {
    if (entities.some((item) => item.id === id)) return;
    const attribute = attributes.get(id);
    if (!attribute) throw new Error(`page seed ${input.seed.id} references unknown ontology attribute ${id}`);
    entities.push({ id: attribute.id, kind, label: attribute.label, detail: attribute.description });
  };
  for (const id of input.seed.serviceOfferIds) addAttribute(id, "S");
  for (const id of input.seed.topicProblemIds) addAttribute(id, "P");
  for (const id of input.seed.workflowIntegrationIds) addAttribute(id, "T");
  for (const id of input.seed.desiredOutcomeIds) addAttribute(id, "O");
  const primary = input.seed.prototypes.find((item) => item.id === input.seed.primaryPrototypeId);
  if (!primary) throw new Error(`page seed ${input.seed.id} is missing primary prototype ${input.seed.primaryPrototypeId}`);
  for (const atom of primary.feature_atoms) {
    const id = `context:${atom.dimension}:${atom.value}`;
    if (!entities.some((item) => item.id === id) && !selectedIds.has(id)) entities.push({ id, kind: "I", label: atom.value, detail: `${atom.dimension} context from ${atom.source_id}` });
  }
  const entityIds = new Set(entities.map((item) => item.id));
  const edges = input.ontology.relations
    .filter((item) => entityIds.has(item.fromAttributeId) && entityIds.has(item.toAttributeId))
    .map((item) => ({ fromId: item.fromAttributeId, toId: item.toAttributeId, relation: item.type }));
  const contractEvidence = input.seed.evidenceIds.map((id): PageContractEvidence => {
    const item = evidence.get(id);
    if (!item) throw new Error(`page seed ${input.seed.id} references unknown evidence ${id}`);
    const sourceId = item.sourceIds[0];
    if (!sourceId) throw new Error(`evidence ${id} has no source`);
    const source = sources.get(sourceId);
    if (!source) throw new Error(`evidence ${id} references unknown source ${sourceId}`);
    return { id, sourceId, statement: item.statement, ...(source.uri ? { url: source.uri } : {}), excerpt: source.summary };
  });
  const schema = input.schema ?? inferSchema(input.seed);
  const base = input.baseUrl.replace(/\/$/, "");
  const route = input.seed.route.startsWith("/") ? input.seed.route : `/${input.seed.route}`;
  const mechanismSteps = input.mechanismSteps ?? [
    ...input.seed.workflowIntegrationIds.map((id) => attributes.get(id)?.label ?? id),
    ...input.seed.desiredOutcomeIds.map((id) => attributes.get(id)?.label ?? id),
  ];
  const constraints = input.constraints ?? [
    ...input.seed.eligibility.excludedAtomSets.map((set) => `exclude:${set.map((atom) => `${atom.dimension}=${atom.value}`).join("+")}`),
    ...input.seed.eligibility.requiredSharedDimensions.map((dimension) => `require_dimension:${dimension}`),
  ];
  return emitPageContract({
    id: `pcn:${input.seed.id}`,
    pageId: input.seed.id,
    route,
    canonicalUrl: `${base}${route === "/" ? "" : route}`,
    canonicalQuestion: input.seed.canonicalQuestion,
    intent: input.seed.intent,
    ...(input.titleHint === undefined ? {} : { titleHint: input.titleHint }),
    voice: input.voice,
    entities,
    edges,
    mechanismSteps: mechanismSteps.length > 0 ? mechanismSteps : [input.seed.canonicalQuestion],
    constraints,
    evidence: contractEvidence,
    sections: input.sections,
    mandatoryPatterns: input.mandatoryPatterns ?? [],
    forbiddenPatterns: input.forbiddenPatterns ?? [],
    links: input.links,
    schema,
    sourceIds: input.seed.sourceIds,
    designAuthorityHash: input.design.authorityHash,
    ontologyHash: input.ontology.ontologyHash,
    seedHash: input.seedHash ?? sha256(JSON.stringify(input.seed)),
  });
}

function inferSchema(seed: CandidatePageSeed): PageContractSchema {
  if (seed.requiredModuleKinds.includes("faq")) return { type: "FAQPage" };
  if (seed.requiredModuleKinds.includes("workflow") || seed.requiredModuleKinds.includes("instruction")) return { type: "HowTo" };
  if (seed.serviceOfferIds.length > 0) return { type: "Service" };
  return { type: "Article" };
}

/**
 * Page Contract Notation is a deterministic lowering of already-approved
 * compiler state. It does not ask a model to discover intent, evidence,
 * structure, links, schema, or design authority.
 */
export function emitPageContract(input: PageContractInput): EmittedPageContract {
  const contract = canonicalizePageContract(input);
  validatePageContract(contract);
  const pcn = serializePageContract(contract);
  return {
    contract,
    pcn,
    contractHash: sha256(JSON.stringify(contract)),
    pcnHash: sha256(pcn),
  };
}

export function canonicalizePageContract(input: PageContractInput): CanonicalPageContract {
  const schemaFields = Object.fromEntries(
    Object.entries(input.schema.fields ?? {}).sort(([left], [right]) => left.localeCompare(right)),
  );
  return {
    ...input,
    id: input.id.trim(),
    pageId: input.pageId.trim(),
    route: input.route.trim(),
    canonicalUrl: input.canonicalUrl.trim(),
    canonicalQuestion: input.canonicalQuestion.trim(),
    intent: input.intent.trim(),
    ...(input.titleHint === undefined ? {} : { titleHint: input.titleHint.trim() }),
    voice: uniqueSorted(input.voice),
    entities: [...input.entities]
      .map((item) => ({ ...item, id: item.id.trim(), label: item.label.trim(), detail: item.detail.trim() }))
      .sort((left, right) => left.kind.localeCompare(right.kind) || left.id.localeCompare(right.id)),
    edges: [...input.edges]
      .map((item) => ({ fromId: item.fromId.trim(), toId: item.toId.trim(), relation: item.relation.trim() }))
      .sort((left, right) => left.fromId.localeCompare(right.fromId) || left.toId.localeCompare(right.toId) || left.relation.localeCompare(right.relation)),
    mechanismSteps: input.mechanismSteps.map((item) => item.trim()).filter(Boolean),
    constraints: uniqueSorted(input.constraints),
    evidence: [...input.evidence]
      .map((item) => ({
        id: item.id.trim(),
        sourceId: item.sourceId.trim(),
        statement: item.statement.trim(),
        ...(item.url === undefined ? {} : { url: item.url.trim() }),
        ...(item.excerpt === undefined ? {} : { excerpt: item.excerpt.trim() }),
      }))
      .sort((left, right) => left.id.localeCompare(right.id)),
    sections: input.sections.map((item) => ({
      id: item.id.trim(),
      heading: item.heading.trim(),
      targetWords: item.targetWords,
      requiredEvidenceIds: uniqueSorted(item.requiredEvidenceIds ?? []),
    })),
    mandatoryPatterns: canonicalRules(input.mandatoryPatterns),
    forbiddenPatterns: canonicalRules(input.forbiddenPatterns),
    links: [...input.links]
      .map((item) => ({ ...item, pageId: item.pageId.trim(), route: item.route.trim(), anchorText: item.anchorText.trim() }))
      .sort((left, right) => relationRank(left.relation) - relationRank(right.relation) || left.pageId.localeCompare(right.pageId)),
    schema: { type: input.schema.type, ...(Object.keys(schemaFields).length === 0 ? {} : { fields: schemaFields }) },
    sourceIds: uniqueSorted(input.sourceIds),
    designAuthorityHash: input.designAuthorityHash.trim(),
    ontologyHash: input.ontologyHash.trim(),
    seedHash: input.seedHash.trim(),
  };
}

export function validatePageContract(contract: CanonicalPageContract): void {
  const requiredStrings = [
    contract.id,
    contract.pageId,
    contract.route,
    contract.canonicalUrl,
    contract.canonicalQuestion,
    contract.intent,
    contract.designAuthorityHash,
    contract.ontologyHash,
    contract.seedHash,
  ];
  if (requiredStrings.some((item) => !item)) throw new Error("page contract requires identity, intent, route, canonical URL, and compiler hashes");
  if (!contract.route.startsWith("/")) throw new Error("page contract route must start with /");
  if (!/^https:\/\//.test(contract.canonicalUrl)) throw new Error("page contract canonicalUrl must use https");
  if (contract.sourceIds.length === 0) throw new Error("page contract requires source IDs");
  assertUniqueIds(contract.entities, "entity");
  assertUniqueIds(contract.evidence, "evidence");
  assertUniqueIds(contract.sections, "section");
  assertUniqueIds(contract.mandatoryPatterns, "mandatory pattern");
  assertUniqueIds(contract.forbiddenPatterns, "forbidden pattern");
  if (contract.entities.length === 0) throw new Error("page contract requires at least one ontology entity");
  if (contract.evidence.length === 0) throw new Error("page contract requires at least one evidence item");
  if (contract.sections.length === 0) throw new Error("page contract requires at least one section");
  const entityIds = new Set(contract.entities.map((item) => item.id));
  for (const edge of contract.edges) {
    if (!entityIds.has(edge.fromId) || !entityIds.has(edge.toId)) throw new Error(`page contract edge ${edge.fromId}->${edge.toId} references an unknown entity`);
    if (edge.fromId === edge.toId) throw new Error(`page contract edge ${edge.fromId}->${edge.toId} is a self-loop`);
    if (!edge.relation) throw new Error("page contract edge relation is required");
  }
  const evidenceIds = new Set(contract.evidence.map((item) => item.id));
  const sourceIds = new Set(contract.sourceIds);
  for (const evidence of contract.evidence) {
    if (!evidence.statement || !sourceIds.has(evidence.sourceId)) throw new Error(`evidence ${evidence.id} must reference a declared source and statement`);
    if (evidence.url && !/^https:\/\//.test(evidence.url)) throw new Error(`evidence ${evidence.id} URL must use https`);
  }
  for (const section of contract.sections) {
    if (!section.id || !section.heading || !Number.isInteger(section.targetWords) || section.targetWords < 1) throw new Error(`section ${section.id || "<unknown>"} requires heading and positive integer targetWords`);
    for (const evidenceId of section.requiredEvidenceIds ?? []) if (!evidenceIds.has(evidenceId)) throw new Error(`section ${section.id} references unknown evidence ${evidenceId}`);
  }
  for (const rule of [...contract.mandatoryPatterns, ...contract.forbiddenPatterns]) {
    if (!rule.id || !rule.pattern) throw new Error("page contract pattern rules require identity and pattern");
    compileRule(rule);
  }
  const linkedPages = new Set<string>();
  for (const link of contract.links) {
    if (!link.pageId || !link.route.startsWith("/") || !link.anchorText) throw new Error("page contract links require page ID, route, and anchor text");
    if (link.pageId === contract.pageId || link.route === contract.route) throw new Error(`page contract ${contract.pageId} cannot link to itself`);
    const key = `${link.relation}:${link.pageId}`;
    if (linkedPages.has(key)) throw new Error(`duplicate page contract link ${key}`);
    linkedPages.add(key);
  }
}

export function compileRule(rule: PageContractPatternRule): RegExp {
  const flags = rule.flags ?? "iu";
  if (!/^[dgimsuvy]*$/.test(flags)) throw new Error(`pattern rule ${rule.id} has invalid flags`);
  try {
    return new RegExp(rule.pattern, flags);
  } catch (error) {
    throw new Error(`pattern rule ${rule.id} is invalid: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function serializePageContract(contract: CanonicalPageContract): string {
  const lines: string[] = [
    "#page",
    `id:${pcn(contract.pageId)}`,
    `contract:${pcn(contract.id)}`,
    `route:${pcn(contract.route)}`,
    `canonical:${pcn(contract.canonicalUrl)}`,
    `question:${pcn(contract.canonicalQuestion)}`,
    `intent:${pcn(contract.intent)}`,
    `schema:${pcn(contract.schema.type)}`,
    `voice:${contract.voice.map(pcn).join("|")}`,
    ...(contract.titleHint ? [`title_hint:${pcn(contract.titleHint)}`] : []),
    `design:${pcn(contract.designAuthorityHash)}`,
    `ontology:${pcn(contract.ontologyHash)}`,
    `seed:${pcn(contract.seedHash)}`,
    `sources:${contract.sourceIds.map(pcn).join("|")}`,
    "#",
    "#entities",
    ...contract.entities.map((item) => `${item.kind}:${pcn(item.id)}|${pcn(item.label)}|${pcn(item.detail)}`),
    "#",
    "#causal_chain",
    ...contract.edges.map((item) => `${pcn(item.fromId)}->${pcn(item.toId)}:${pcn(item.relation)}`),
    "#",
    "#mechanism",
    `pipeline:${contract.mechanismSteps.map(pcn).join("->")}`,
    ...contract.constraints.map((item) => `constraint:${pcn(item)}`),
    "#",
    "#evidence",
    ...contract.evidence.map((item) => [item.id, item.sourceId, item.statement, item.url ?? "", item.excerpt ?? ""].map(pcn).join("|")),
    "#",
    "#structure",
    `sections:${contract.sections.map((item) => pcn(item.id)).join("|")}`,
    `headings:${contract.sections.map((item) => pcn(item.heading)).join("|")}`,
    `weights:${contract.sections.map((item) => item.targetWords).join("|")}`,
    `evidence:${contract.sections.map((item) => `${pcn(item.id)}=${(item.requiredEvidenceIds ?? []).map(pcn).join(",")}`).join(";")}`,
    `mandatory:${contract.mandatoryPatterns.map((item) => pcn(item.id)).join("|")}`,
    `forbidden:${contract.forbiddenPatterns.map((item) => pcn(item.id)).join("|")}`,
    "#",
    "#links",
    ...contract.links.map((item) => `${item.relation}|${pcn(item.pageId)}|${pcn(item.route)}|${pcn(item.anchorText)}`),
    "#",
    "#schema_fields",
    ...Object.entries(contract.schema.fields ?? {}).map(([key, value]) => `${pcn(key)}:${pcn(String(value))}`),
  ];
  return `${lines.join("\n")}\n`;
}

function canonicalRules(rules: readonly PageContractPatternRule[]): PageContractPatternRule[] {
  return [...rules]
    .map((item) => ({ id: item.id.trim(), pattern: item.pattern, ...(item.flags === undefined ? {} : { flags: item.flags }) }))
    .sort((left, right) => left.id.localeCompare(right.id));
}

function uniqueSorted(values: readonly string[]): string[] {
  const normalized = values.map((item) => item.trim()).filter(Boolean);
  if (new Set(normalized).size !== normalized.length) throw new Error("page contract arrays must not contain duplicates");
  return normalized.sort();
}

function assertUniqueIds(items: readonly { id: string }[], label: string): void {
  const ids = new Set<string>();
  for (const item of items) {
    if (!item.id) throw new Error(`${label} ID is required`);
    if (ids.has(item.id)) throw new Error(`duplicate ${label} ID ${item.id}`);
    ids.add(item.id);
  }
}

function relationRank(relation: PageContractLinkRelation): number {
  return relation === "up" ? 0 : relation === "sideways" ? 1 : 2;
}

function pcn(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/\|/g, "\\|")
    .replace(/#/g, "\\#")
    .trim();
}
