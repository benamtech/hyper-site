import {
  compileSite,
  type ClaimSource,
  type CompiledSite,
  type DesignCapability,
  type EvidenceSource,
  type InformationObjectSource,
  type LayoutRole,
  type ModuleKind,
  type SiteSource,
} from "./framework-core.js";

export interface SiteManifestModule {
  id: string;
  kind: ModuleKind;
  layout_role: LayoutRole;
  heading?: string;
  body?: string;
  claim_ids: string[];
  information_object_ids: string[];
  required_capabilities: DesignCapability[];
  source_ids: string[];
}

export interface SiteManifestPage {
  id: string;
  route: string;
  canonical_question: string;
  title: string;
  description: string;
  module_ids: string[];
  internal_page_ids: string[];
  required_capabilities: DesignCapability[];
  instruction_pointers?: string[];
  indexable: boolean;
}

export interface SiteManifest {
  version: string;
  base_url: string;
  evidence: EvidenceSource[];
  claims: ClaimSource[];
  information_objects: InformationObjectSource[];
  modules: SiteManifestModule[];
  pages: SiteManifestPage[];
}

export interface CompiledSiteManifest {
  manifest: SiteManifest;
  source: SiteSource;
  site: CompiledSite;
}

export function compileSiteManifest(manifest: SiteManifest): CompiledSiteManifest {
  validateSiteManifest(manifest);
  const source: SiteSource = {
    baseUrl: manifest.base_url,
    evidence: manifest.evidence.map((item) => ({ ...item })),
    claims: manifest.claims.map((item) => ({ ...item, evidenceIds: [...item.evidenceIds] })),
    informationObjects: manifest.information_objects.map((item) => ({ ...item, evidenceIds: [...item.evidenceIds] })),
    modules: manifest.modules.map((module) => ({
      id: module.id,
      kind: module.kind,
      layoutRole: module.layout_role,
      ...(module.heading ? { heading: module.heading } : {}),
      ...(module.body ? { body: module.body } : {}),
      claimIds: [...module.claim_ids],
      informationObjectIds: [...module.information_object_ids],
      requiredCapabilities: [...module.required_capabilities],
      sourceIds: [...module.source_ids],
    })),
    pages: manifest.pages.map((page) => ({
      id: page.id,
      route: page.route,
      canonicalQuestion: page.canonical_question,
      title: page.title,
      description: page.description,
      moduleIds: [...page.module_ids],
      internalPageIds: [...page.internal_page_ids],
      requiredCapabilities: [...page.required_capabilities],
      ...(page.instruction_pointers ? { instructionPointers: [...page.instruction_pointers] } : {}),
      indexable: page.indexable,
    })),
  };
  return { manifest, source, site: compileSite(source) };
}

export function validateSiteManifest(manifest: SiteManifest): void {
  if (!manifest || typeof manifest !== "object") throw new Error("site manifest must be an object");
  if (!manifest.version?.trim()) throw new Error("site manifest version is required");
  if (!Array.isArray(manifest.modules) || !Array.isArray(manifest.pages)) throw new Error("site manifest modules and pages are required");
  if (manifest.pages.length === 0) throw new Error("site manifest requires at least one page");
  if (manifest.modules.length === 0) throw new Error("site manifest requires at least one module");
}
