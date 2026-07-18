import { parse } from "yaml";
import { sha256 } from "./core.js";
import {
  normalizeProjectInput,
  type ConfidenceLevel,
  type ProjectAssetInput,
  type ProjectInput,
  type ProjectSourceInput,
  type SourceKind,
  type NormalizedProject,
} from "./project-input.js";

export interface RepositoryFileSnapshot {
  path: string;
  content: string;
  mediaType?: string;
}

export interface RepositorySnapshot {
  repositoryRoot: string;
  capturedAt: string;
  revision: string;
  files: readonly RepositoryFileSnapshot[];
}

interface DeclaredSource {
  id: string;
  kind: SourceKind;
  title: string;
  summary: string;
  path: string;
  retrievedAt?: string;
  freshnessDays?: number;
  applicability: readonly string[];
  confidence: ConfidenceLevel;
}

interface DeclaredAsset {
  id: string;
  kind: ProjectAssetInput["kind"];
  path: string;
  altOrPurpose: string;
  rights: ProjectAssetInput["rights"];
}

interface RepositoryProjectConfig {
  project: Omit<ProjectInput, "sources" | "assets">;
  sources: readonly DeclaredSource[];
  assets?: readonly DeclaredAsset[];
}

export interface RepositoryIngestionEvidence {
  field: string;
  sourceIds: readonly string[];
}

export interface RepositoryIngestionResult {
  project: NormalizedProject;
  repositoryRevision: string;
  configPath: string;
  fileHashes: Readonly<Record<string, string>>;
  fieldEvidence: readonly RepositoryIngestionEvidence[];
  ingestionHash: string;
}

/**
 * Compiles an explicit repository project declaration into canonical ProjectInput.
 * Business, brand, goal, pricing, proof, and publication truth must be present in
 * the declaration. Repository inspection verifies declared source and asset bytes;
 * it never promotes inferred text into business truth.
 */
export function ingestRepositoryProject(snapshot: RepositorySnapshot, configPath = "hyper-site.project.yaml"): RepositoryIngestionResult {
  assertNonEmpty(snapshot.repositoryRoot, "repositoryRoot");
  assertNonEmpty(snapshot.capturedAt, "capturedAt");
  assertNonEmpty(snapshot.revision, "revision");

  const files = normalizeFiles(snapshot.files);
  const configFile = files.get(normalizePath(configPath));
  if (!configFile) throw new Error(`repository project config not found: ${configPath}`);

  const decoded = parse(configFile.content) as unknown;
  const config = requireConfig(decoded);
  const sources = config.sources.map((source) => compileSource(source, files, snapshot.capturedAt));
  const assets = (config.assets ?? []).map((asset) => compileAsset(asset, files));
  const project = normalizeProjectInput({ ...config.project, sources, assets });
  if (!project.validation.passes) {
    const failures = project.validation.findings.filter((item) => item.status === "fail").map((item) => `${item.attributeId}: ${item.detail}`);
    throw new Error(`repository project validation failed: ${failures.join("; ")}`);
  }

  const fileHashes = Object.fromEntries([...files.entries()].map(([path, file]) => [path, sha256(file.content)]).sort(([left], [right]) => left.localeCompare(right)));
  const fieldEvidence = compileFieldEvidence(config, sources);
  const canonical = {
    repositoryRoot: snapshot.repositoryRoot,
    repositoryRevision: snapshot.revision,
    capturedAt: snapshot.capturedAt,
    configPath: normalizePath(configPath),
    projectHash: project.projectHash,
    fileHashes,
    fieldEvidence,
  };
  return {
    project,
    repositoryRevision: snapshot.revision,
    configPath: normalizePath(configPath),
    fileHashes,
    fieldEvidence,
    ingestionHash: sha256(JSON.stringify(canonical)),
  };
}

function compileSource(source: DeclaredSource, files: ReadonlyMap<string, RepositoryFileSnapshot>, capturedAt: string): ProjectSourceInput {
  assertNonEmpty(source.id, "source.id");
  assertNonEmpty(source.title, `source ${source.id} title`);
  assertNonEmpty(source.summary, `source ${source.id} summary`);
  const path = normalizePath(source.path);
  const file = files.get(path);
  if (!file) throw new Error(`declared source file not found: ${path}`);
  if (!source.applicability?.length) throw new Error(`source ${source.id} requires applicability`);
  return {
    id: source.id,
    kind: source.kind,
    title: source.title,
    summary: source.summary,
    uri: `repo://${path}`,
    retrievedAt: source.retrievedAt ?? capturedAt,
    ...(source.freshnessDays === undefined ? {} : { freshnessDays: source.freshnessDays }),
    applicability: source.applicability,
    confidence: source.confidence,
    contentHash: sha256(file.content),
  };
}

function compileAsset(asset: DeclaredAsset, files: ReadonlyMap<string, RepositoryFileSnapshot>): ProjectAssetInput {
  assertNonEmpty(asset.id, "asset.id");
  assertNonEmpty(asset.altOrPurpose, `asset ${asset.id} altOrPurpose`);
  const path = normalizePath(asset.path);
  const file = files.get(path);
  if (!file) throw new Error(`declared asset file not found: ${path}`);
  return {
    id: asset.id,
    kind: asset.kind,
    pathOrUri: `repo://${path}`,
    altOrPurpose: asset.altOrPurpose,
    rights: asset.rights,
    contentHash: sha256(file.content),
  };
}

function compileFieldEvidence(config: RepositoryProjectConfig, sources: readonly ProjectSourceInput[]): RepositoryIngestionEvidence[] {
  const sourceIds = [...sources.map((source) => source.id)].sort();
  if (sourceIds.length === 0) throw new Error("at least one declared repository source is required");
  const fields = [
    "business.purpose",
    "business.services",
    "business.offers",
    "business.audiences",
    "business.locations",
    "business.workflows",
    "business.integrations",
    "business.constraints",
    "business.proofPoints",
    "business.pricingFacts",
    "brand",
    "technical",
    "goals",
  ];
  // The declaration is itself a repository source of truth; all promoted fields
  // remain reviewable against the bounded declared source set.
  void config;
  return fields.map((field) => ({ field, sourceIds }));
}

function requireConfig(value: unknown): RepositoryProjectConfig {
  if (!isRecord(value)) throw new Error("repository project config must be an object");
  if (!isRecord(value.project)) throw new Error("repository project config requires project");
  if (!Array.isArray(value.sources) || value.sources.length === 0) throw new Error("repository project config requires at least one source");
  const project = value.project as unknown as Omit<ProjectInput, "sources" | "assets">;
  const business = project.business;
  if (!business || !business.purpose?.trim()) throw new Error("explicit business purpose is required; repository text is not inferred");
  if ((!business.services || business.services.length === 0) && (!business.offers || business.offers.length === 0)) throw new Error("at least one explicit service or offer is required; repository text is not inferred");
  if (!business.audiences || business.audiences.length === 0) throw new Error("at least one explicit audience is required; repository text is not inferred");
  return {
    project,
    sources: value.sources as unknown as readonly DeclaredSource[],
    ...(Array.isArray(value.assets) ? { assets: value.assets as unknown as readonly DeclaredAsset[] } : {}),
  };
}

function normalizeFiles(files: readonly RepositoryFileSnapshot[]): Map<string, RepositoryFileSnapshot> {
  const normalized = new Map<string, RepositoryFileSnapshot>();
  for (const file of files) {
    const path = normalizePath(file.path);
    if (!path) throw new Error("repository file path is required");
    if (normalized.has(path)) throw new Error(`duplicate repository file path: ${path}`);
    normalized.set(path, { ...file, path });
  }
  return normalized;
}

function normalizePath(path: string): string {
  const normalized = path.replaceAll("\\", "/").replace(/^\.\//, "").replace(/\/+/g, "/");
  if (normalized.startsWith("/") || normalized.split("/").includes("..")) throw new Error(`repository path must be root-relative without traversal: ${path}`);
  return normalized;
}

function assertNonEmpty(value: string, label: string): void {
  if (!value.trim()) throw new Error(`${label} is required`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
