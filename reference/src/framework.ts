import {
  compileHrrFeatures,
  DEFAULT_VECTOR_SPACE_IDENTITY,
  DESIGN_CAPABILITIES,
  type DesignCapability,
  type FeatureMap,
  type VectorSpaceIdentity,
} from "./benchmark.js";
import { sha256 } from "./core.js";
import {
  compileSite as compileFrameworkCore,
  createReferenceDesignContract,
  validateDesignSystemSuperset,
  type ClaimSource,
  type CompiledPageArtifact as CoreCompiledPageArtifact,
  type CompiledSite as CoreCompiledSite,
  type DesignComponentContract,
  type DesignSatisfiabilityResult,
  type DesignSystemContract,
  type EvidenceLevel,
  type EvidenceSource,
  type InformationObjectSource,
  type LayoutRole,
  type ModuleKind,
  type ModuleSource,
  type PageIR as CorePageIR,
  type PageSource as CorePageSource,
  type SemanticModuleIR,
  type SiteSource as CoreSiteSource,
} from "./framework-core.js";

export {
  createReferenceDesignContract,
  validateDesignSystemSuperset,
};
export type {
  ClaimSource,
  DesignComponentContract,
  DesignSatisfiabilityResult,
  DesignSystemContract,
  EvidenceLevel,
  EvidenceSource,
  InformationObjectSource,
  LayoutRole,
  ModuleKind,
  ModuleSource,
  SemanticModuleIR,
};

export interface VectorPrototypeSource { id: string; features: FeatureMap; }
export interface PageSource extends CorePageSource {
  features: FeatureMap;
  vectorPrototypes?: VectorPrototypeSource[];
  primaryPrototypeId?: string;
}
export interface SiteSource extends Omit<CoreSiteSource, "pages"> {
  vectorIdentity?: VectorSpaceIdentity;
  pages: PageSource[];
}
export interface VectorPrototypeIR { id: string; features: FeatureMap; }
export interface PageIR extends CorePageIR {
  features: FeatureMap;
  primaryPrototypeId: string;
  vectorPrototypes: VectorPrototypeIR[];
}
export interface PackedSiteIR {
  pageIds: string[];
  routes: string[];
  dimensions: number;
  vectorIdentity: VectorSpaceIdentity;
  pageVectors: Float32Array;
  prototypeOffsets: Uint32Array;
  prototypeIds: string[];
  prototypeVectors: Float32Array;
  graphOffsets: Uint32Array;
  graphTargets: Uint32Array;
  capabilityOffsets: Uint32Array;
  capabilityTargets: Uint16Array;
  stringTable: string[];
}
export interface CompiledPageArtifact extends Omit<CoreCompiledPageArtifact, "page"> {
  page: PageIR;
}
export interface CompiledSite extends Omit<CoreCompiledSite, "pages" | "buildHash"> {
  pages: CompiledPageArtifact[];
  packed: PackedSiteIR;
  buildHash: string;
}

export function compileSite(source: SiteSource, dimensions = 512): CompiledSite {
  validateVectorSource(source);
  const sourcePageById = new Map(source.pages.map((page) => [page.id, page]));
  const coreSite = compileFrameworkCore(toCoreSiteSource(source));
  const pages: CompiledPageArtifact[] = coreSite.pages.map((artifact) => {
    const sourcePage = required(sourcePageById, artifact.page.id, "framework adapter");
    const vectorPrototypes = normalizePrototypes(sourcePage);
    const page: PageIR = {
      ...artifact.page,
      features: stableRecord(vectorPrototypes[0].features),
      primaryPrototypeId: vectorPrototypes[0].id,
      vectorPrototypes,
    };
    return { ...artifact, page };
  });
  const vectorIdentity = source.vectorIdentity ?? DEFAULT_VECTOR_SPACE_IDENTITY;
  const packed = packSite(pages.map((artifact) => artifact.page), dimensions, vectorIdentity);
  const buildHash = sha256(JSON.stringify({
    vectorIdentity,
    pageHashes: pages.map((item) => [item.page.id, item.sha256]),
    sitemapXml: coreSite.sitemapXml,
    pageVectors: Array.from(packed.pageVectors),
    prototypeOffsets: Array.from(packed.prototypeOffsets),
    prototypeIds: packed.prototypeIds,
    prototypeVectors: Array.from(packed.prototypeVectors),
    graphOffsets: Array.from(packed.graphOffsets),
    graphTargets: Array.from(packed.graphTargets),
  }));
  return { pages, packed, sitemapXml: coreSite.sitemapXml, dependencyIndex: coreSite.dependencyIndex, buildHash };
}

export function packSite(
  pages: readonly PageIR[],
  dimensions = 512,
  vectorIdentity: VectorSpaceIdentity = DEFAULT_VECTOR_SPACE_IDENTITY,
): PackedSiteIR {
  const pageIds = pages.map((page) => page.id);
  const pageIndex = new Map(pageIds.map((id, index) => [id, index]));
  const routes = pages.map((page) => page.route);
  const pageVectors = new Float32Array(pages.length * dimensions);
  const prototypeOffsets = new Uint32Array(pages.length + 1);
  const prototypeIds: string[] = [];
  const prototypeVectorValues: number[] = [];

  pages.forEach((page, pageNumber) => {
    prototypeOffsets[pageNumber] = prototypeIds.length;
    page.vectorPrototypes.forEach((prototype, prototypeIndex) => {
      const vector = compileHrrFeatures(prototype.features, dimensions, vectorIdentity);
      prototypeIds.push(`${page.id}\0${prototype.id}`);
      for (let dimension = 0; dimension < dimensions; dimension += 1) {
        prototypeVectorValues.push(vector[dimension]);
        if (prototypeIndex === 0) pageVectors[pageNumber * dimensions + dimension] = vector[dimension];
      }
    });
  });
  prototypeOffsets[pages.length] = prototypeIds.length;

  const graphOffsets = new Uint32Array(pages.length + 1);
  const graphTargetsList: number[] = [];
  pages.forEach((page, index) => {
    graphOffsets[index] = graphTargetsList.length;
    for (const targetId of page.internalPageIds) graphTargetsList.push(required(pageIndex, targetId, `page graph ${page.id}`));
  });
  graphOffsets[pages.length] = graphTargetsList.length;

  const capabilityIndex = new Map(DESIGN_CAPABILITIES.map((capability, index) => [capability, index]));
  const capabilityOffsets = new Uint32Array(pages.length + 1);
  const capabilityTargetsList: number[] = [];
  pages.forEach((page, index) => {
    capabilityOffsets[index] = capabilityTargetsList.length;
    for (const capability of page.requiredCapabilities) capabilityTargetsList.push(required(capabilityIndex, capability, `page capability ${page.id}`));
  });
  capabilityOffsets[pages.length] = capabilityTargetsList.length;

  return {
    pageIds,
    routes,
    dimensions,
    vectorIdentity: { ...vectorIdentity },
    pageVectors,
    prototypeOffsets,
    prototypeIds,
    prototypeVectors: Float32Array.from(prototypeVectorValues),
    graphOffsets,
    graphTargets: Uint32Array.from(graphTargetsList),
    capabilityOffsets,
    capabilityTargets: Uint16Array.from(capabilityTargetsList),
    stringTable: uniqueSorted([...pageIds, ...routes, ...prototypeIds, ...pages.flatMap((page) => page.dependencyIds)]),
  };
}

function toCoreSiteSource(source: SiteSource): CoreSiteSource {
  return {
    baseUrl: source.baseUrl,
    evidence: source.evidence.map((item) => ({ ...item })),
    claims: source.claims.map((item) => ({ ...item, evidenceIds: [...item.evidenceIds] })),
    informationObjects: source.informationObjects.map((item) => ({ ...item, evidenceIds: [...item.evidenceIds] })),
    modules: source.modules.map((item) => ({
      ...item,
      claimIds: [...item.claimIds],
      informationObjectIds: [...item.informationObjectIds],
      requiredCapabilities: [...item.requiredCapabilities],
      sourceIds: [...item.sourceIds],
    })),
    pages: source.pages.map((page) => ({
      id: page.id,
      route: page.route,
      canonicalQuestion: page.canonicalQuestion,
      title: page.title,
      description: page.description,
      moduleIds: [...page.moduleIds],
      internalPageIds: [...page.internalPageIds],
      requiredCapabilities: [...page.requiredCapabilities],
      ...(page.instructionPointers ? { instructionPointers: [...page.instructionPointers] } : {}),
      indexable: page.indexable,
    })),
  };
}

function normalizePrototypes(page: PageSource): VectorPrototypeIR[] {
  const declared = page.vectorPrototypes?.length
    ? page.vectorPrototypes
    : [{ id: "primary", features: page.features }];
  const seen = new Set<string>();
  const normalized = declared.map((prototype) => {
    if (!prototype.id.trim()) throw new Error(`page ${page.id} has empty prototype id`);
    if (seen.has(prototype.id)) throw new Error(`page ${page.id} has duplicate prototype ${prototype.id}`);
    seen.add(prototype.id);
    const features = stableRecord(prototype.features);
    if (Object.keys(features).length === 0) throw new Error(`page ${page.id}/${prototype.id} has no vector features`);
    return { id: prototype.id, features };
  });
  const primaryId = page.primaryPrototypeId ?? normalized[0].id;
  const primary = normalized.find((prototype) => prototype.id === primaryId);
  if (!primary) throw new Error(`page ${page.id} primary prototype ${primaryId} does not exist`);
  return [primary, ...normalized.filter((prototype) => prototype.id !== primaryId).sort((left, right) => left.id.localeCompare(right.id))];
}

function validateVectorSource(source: SiteSource): void {
  if (source.vectorIdentity && (!source.vectorIdentity.namespace.trim() || !source.vectorIdentity.symbolVersion.trim())) {
    throw new Error("vector identity requires namespace and symbolVersion");
  }
  for (const page of source.pages) normalizePrototypes(page);
}
function stableRecord<T extends Record<string, unknown>>(value: T): T { return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b))) as T; }
function uniqueSorted<T extends string>(values: readonly T[]): T[] { return [...new Set(values)].sort() as T[]; }
function required<K, V>(map: ReadonlyMap<K, V>, key: K, context: string): V { const value = map.get(key); if (value === undefined) throw new Error(`missing reference ${String(key)} in ${context}`); return value; }
