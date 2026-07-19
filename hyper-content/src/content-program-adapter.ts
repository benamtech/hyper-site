export interface NeutralEvidenceSource {
  id: string;
  level: 0 | 1 | 2 | 3 | 4;
  summary: string;
  url?: string;
}

export interface NeutralClaimSource {
  id: string;
  text: string;
  evidenceIds: string[];
  requiredLevel: 0 | 1 | 2 | 3 | 4;
}

export interface NeutralInformationObjectSource {
  id: string;
  kind: "workflow" | "dataset" | "calculation" | "diagram" | "comparison" | "field-note";
  title: string;
  body: string;
  evidenceIds: string[];
}

export interface NeutralModuleSource {
  id: string;
  kind: "hero" | "answer" | "workflow" | "proof" | "comparison" | "faq" | "cta" | "instruction";
  layoutRole: "lead" | "support" | "proof" | "decision" | "conversion";
  heading?: string;
  body?: string;
  claimIds: string[];
  informationObjectIds: string[];
  requiredCapabilities: string[];
  sourceIds: string[];
}

export interface NeutralPageSource {
  id: string;
  route: string;
  canonicalQuestion: string;
  title: string;
  description: string;
  moduleIds: string[];
  internalPageIds: string[];
  requiredCapabilities: string[];
  instructionPointers?: string[];
  indexable: boolean;
}

export interface NeutralSiteSource {
  baseUrl: string;
  evidence: NeutralEvidenceSource[];
  claims: NeutralClaimSource[];
  informationObjects: NeutralInformationObjectSource[];
  modules: NeutralModuleSource[];
  pages: NeutralPageSource[];
}

export interface ContentProgramSiteSource extends NeutralSiteSource {
  vectorIdentity?: unknown;
  features?: unknown;
  vectorPrototypes?: unknown;
  primaryPrototypeId?: unknown;
}

/**
 * Canonical Hyper Content boundary adapter.
 *
 * It copies only the content-neutral fields accepted by Hyper Site. Content
 * geometry, vector prototypes and packing metadata are intentionally omitted.
 */
export function adaptContentProgramSiteSource(source: ContentProgramSiteSource): NeutralSiteSource {
  return {
    baseUrl: source.baseUrl,
    evidence: source.evidence.map((item) => ({ ...item })),
    claims: source.claims.map((item) => ({ ...item, evidenceIds: [...item.evidenceIds] })),
    informationObjects: source.informationObjects.map((item) => ({ ...item, evidenceIds: [...item.evidenceIds] })),
    modules: source.modules.map((module) => ({
      ...module,
      claimIds: [...module.claimIds],
      informationObjectIds: [...module.informationObjectIds],
      requiredCapabilities: [...module.requiredCapabilities],
      sourceIds: [...module.sourceIds],
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
