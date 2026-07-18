import {
  adaptContentProgramSiteSource as adaptOwnedContentProgramSiteSource,
  type ContentProgramSiteSource,
} from "../../hyper-content/dist/content-program-adapter.js";
import {
  compileSite as compileHyperSite,
  type CompiledSite as CompiledHyperSite,
  type SiteSource as HyperSiteSource,
} from "./framework-core.js";
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
 * Compatibility re-export. Canonical geometry removal now lives in
 * @amtech/hyper-content; reference/ retains only the legacy compiler wrapper.
 */
export function adaptContentProgramSiteSource(source: ContentProgramSiteSource): HyperSiteSource {
  return adaptOwnedContentProgramSiteSource(source) as HyperSiteSource;
}

/**
 * Transitional compiler for the mixed legacy Content Program manifest.
 * It verifies that the Hyper Content adapter produces the same web artifacts
 * through the neutral compiler. This wrapper is removed after P1.5.
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
