import {
  compileSite as compileHyperSite,
  type CompiledSite as CompiledHyperSite,
  type SiteSource as HyperSiteSource,
} from "./framework-core.js";
import type { SiteSource as ContentSiteSource } from "./framework.js";
import {
  compileFrameworkManifest,
  type CompiledFrameworkManifest,
  type FrameworkManifest,
} from "./manifest.js";

export interface CompiledContentProgramManifest extends CompiledFrameworkManifest {
  siteSource: HyperSiteSource;
  hyperSite: CompiledHyperSite;
}

/**
 * Removes Hyper Content geometry from the legacy compatibility source and
 * returns the content-neutral contract accepted by Hyper Site.
 */
export function adaptContentProgramSiteSource(source: ContentSiteSource): HyperSiteSource {
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

/**
 * Transitional public compiler for the mixed legacy Content Program manifest.
 * It preserves the content-aware result and independently verifies that the
 * same adapted input produces identical web artifacts through Hyper Site.
 */
export function compileContentProgramManifest(
  textOrManifest: string | FrameworkManifest,
): CompiledContentProgramManifest {
  const compiled = compileFrameworkManifest(textOrManifest);
  const siteSource = adaptContentProgramSiteSource(compiled.source);
  const hyperSite = compileHyperSite(siteSource);
  assertWebArtifactParity(hyperSite, compiled.site);
  return { ...compiled, siteSource, hyperSite };
}

function assertWebArtifactParity(hyperSite: CompiledHyperSite, contentSite: CompiledFrameworkManifest["site"]): void {
  if (hyperSite.sitemapXml !== contentSite.sitemapXml) throw new Error("content-program adapter sitemap drift");
  if (hyperSite.pages.length !== contentSite.pages.length) throw new Error("content-program adapter page-count drift");

  const contentById = new Map(contentSite.pages.map((artifact) => [artifact.page.id, artifact]));
  for (const artifact of hyperSite.pages) {
    const contentArtifact = contentById.get(artifact.page.id);
    if (!contentArtifact) throw new Error(`content-program adapter missing page ${artifact.page.id}`);
    if (artifact.html !== contentArtifact.html) throw new Error(`content-program adapter HTML drift for ${artifact.page.id}`);
    if (artifact.instructionMarkdown !== contentArtifact.instructionMarkdown) {
      throw new Error(`content-program adapter instruction drift for ${artifact.page.id}`);
    }
    if (artifact.sha256 !== contentArtifact.sha256) throw new Error(`content-program adapter artifact hash drift for ${artifact.page.id}`);
  }

  const hyperDependencies = normalizeDependencyIndex(hyperSite.dependencyIndex);
  const contentDependencies = normalizeDependencyIndex(contentSite.dependencyIndex);
  if (JSON.stringify(hyperDependencies) !== JSON.stringify(contentDependencies)) {
    throw new Error("content-program adapter dependency-index drift");
  }
}

function normalizeDependencyIndex(index: ReadonlyMap<string, readonly string[]>): [string, string[]][] {
  return [...index.entries()]
    .map(([key, values]) => [key, [...values].sort()] as [string, string[]])
    .sort(([left], [right]) => left.localeCompare(right));
}
