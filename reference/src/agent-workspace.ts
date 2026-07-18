import { sha256 } from "./core.js";
import {
  createAgentWorkspaceSnapshot,
  type AgentWorkspaceArtifact,
  type AgentWorkspaceSnapshot,
} from "./near-alpha-framework.js";

export interface WorkspaceInvalidationEdge {
  dependencyId: string;
  dependentId: string;
}

export interface WorkspaceInvalidationPlan {
  workspaceHash: string;
  changedArtifactIds: readonly string[];
  invalidatedArtifactIds: readonly string[];
  unaffectedArtifactIds: readonly string[];
  edges: readonly WorkspaceInvalidationEdge[];
  planHash: string;
}

export interface WorkspaceLifecycleCoverage {
  hasInitialAuthoring: boolean;
  hasStarterSite: boolean;
  hasBulkGeneration: boolean;
  hasPostGenerationMaintenance: boolean;
  complete: boolean;
  artifactCountsByPhase: Readonly<Record<string, number>>;
}

export function appendAgentWorkspaceArtifact(
  snapshot: AgentWorkspaceSnapshot,
  artifact: AgentWorkspaceArtifact,
  nextVersion: string,
  createdAt: string,
): AgentWorkspaceSnapshot {
  assertWorkspaceHash(snapshot);
  if (!artifact.id.trim()) throw new Error("workspace artifact ID is required");
  if (snapshot.artifacts.some((item) => item.id === artifact.id)) throw new Error(`workspace artifact ${artifact.id} already exists`);
  const knownIds = new Set(snapshot.artifacts.map((item) => item.id));
  for (const dependencyId of artifact.dependencyIds) {
    if (!knownIds.has(dependencyId)) throw new Error(`workspace artifact ${artifact.id} references unknown dependency ${dependencyId}`);
    if (dependencyId === artifact.id) throw new Error(`workspace artifact ${artifact.id} cannot depend on itself`);
  }
  if (!artifact.producedBy.trim() || !artifact.contentHash.trim()) throw new Error(`workspace artifact ${artifact.id} requires producer and content hash`);
  if (artifact.sourceIds.length === 0 && artifact.kind !== "post-generation-patch") throw new Error(`workspace artifact ${artifact.id} requires source IDs`);
  return createAgentWorkspaceSnapshot({
    id: snapshot.id,
    version: nextVersion,
    maturity: snapshot.maturity,
    createdAt,
    priorSnapshotHash: snapshot.snapshotHash,
    pageCount: snapshot.pageCount + (artifact.kind === "starter-page" || artifact.kind === "page-batch" ? 1 : 0),
    routeCount: snapshot.routeCount + (artifact.kind === "starter-page" || artifact.kind === "page-batch" ? 1 : 0),
    ...(snapshot.designAuthorityHash === undefined ? {} : { designAuthorityHash: snapshot.designAuthorityHash }),
    ...(snapshot.transactionHash === undefined ? {} : { transactionHash: snapshot.transactionHash }),
    artifacts: [...snapshot.artifacts, canonicalArtifact(artifact)],
  });
}

export function replaceAgentWorkspaceArtifact(
  snapshot: AgentWorkspaceSnapshot,
  replacement: AgentWorkspaceArtifact,
  nextVersion: string,
  createdAt: string,
): AgentWorkspaceSnapshot {
  assertWorkspaceHash(snapshot);
  const existingIndex = snapshot.artifacts.findIndex((item) => item.id === replacement.id);
  if (existingIndex < 0) throw new Error(`workspace artifact ${replacement.id} does not exist`);
  const knownIds = new Set(snapshot.artifacts.map((item) => item.id));
  for (const dependencyId of replacement.dependencyIds) {
    if (!knownIds.has(dependencyId)) throw new Error(`workspace artifact ${replacement.id} references unknown dependency ${dependencyId}`);
    if (dependencyId === replacement.id) throw new Error(`workspace artifact ${replacement.id} cannot depend on itself`);
  }
  const artifacts = [...snapshot.artifacts];
  artifacts[existingIndex] = canonicalArtifact(replacement);
  assertAcyclicArtifacts(artifacts);
  return createAgentWorkspaceSnapshot({
    id: snapshot.id,
    version: nextVersion,
    maturity: snapshot.maturity,
    createdAt,
    priorSnapshotHash: snapshot.snapshotHash,
    pageCount: snapshot.pageCount,
    routeCount: snapshot.routeCount,
    ...(snapshot.designAuthorityHash === undefined ? {} : { designAuthorityHash: snapshot.designAuthorityHash }),
    ...(snapshot.transactionHash === undefined ? {} : { transactionHash: snapshot.transactionHash }),
    artifacts,
  });
}

export function planAgentWorkspaceInvalidation(
  snapshot: AgentWorkspaceSnapshot,
  changedArtifactIds: readonly string[],
): WorkspaceInvalidationPlan {
  assertWorkspaceHash(snapshot);
  assertAcyclicArtifacts(snapshot.artifacts);
  const artifactsById = new Map(snapshot.artifacts.map((item) => [item.id, item]));
  const changed = [...new Set(changedArtifactIds.map((item) => item.trim()).filter(Boolean))].sort();
  if (changed.length === 0) throw new Error("workspace invalidation requires at least one changed artifact");
  for (const id of changed) if (!artifactsById.has(id)) throw new Error(`workspace invalidation references unknown artifact ${id}`);

  const dependents = new Map<string, string[]>();
  const edges: WorkspaceInvalidationEdge[] = [];
  for (const artifact of snapshot.artifacts) {
    for (const dependencyId of artifact.dependencyIds) {
      const items = dependents.get(dependencyId) ?? [];
      items.push(artifact.id);
      dependents.set(dependencyId, items);
      edges.push({ dependencyId, dependentId: artifact.id });
    }
  }
  for (const items of dependents.values()) items.sort();
  edges.sort((left, right) => left.dependencyId.localeCompare(right.dependencyId) || left.dependentId.localeCompare(right.dependentId));

  const invalidated = new Set(changed);
  const queue = [...changed];
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;
    for (const dependentId of dependents.get(current) ?? []) {
      if (invalidated.has(dependentId)) continue;
      invalidated.add(dependentId);
      queue.push(dependentId);
    }
  }
  const invalidatedArtifactIds = [...invalidated].sort();
  const unaffectedArtifactIds = snapshot.artifacts.map((item) => item.id).filter((id) => !invalidated.has(id)).sort();
  const canonical = {
    workspaceHash: snapshot.snapshotHash,
    changedArtifactIds: changed,
    invalidatedArtifactIds,
    unaffectedArtifactIds,
    edges,
  };
  return { ...canonical, planHash: sha256(JSON.stringify(canonical)) };
}

export function summarizeWorkspaceLifecycle(snapshot: AgentWorkspaceSnapshot): WorkspaceLifecycleCoverage {
  assertWorkspaceHash(snapshot);
  const counts: Record<string, number> = {};
  for (const artifact of snapshot.artifacts) counts[artifact.phase] = (counts[artifact.phase] ?? 0) + 1;
  const hasInitialAuthoring = (counts["datasheet-authoring"] ?? 0) > 0 && (counts["design-authoring"] ?? 0) > 0;
  const hasStarterSite = (counts["starter-site"] ?? 0) > 0;
  const hasBulkGeneration = (counts["bulk-generation"] ?? 0) > 0;
  const hasPostGenerationMaintenance = (counts["post-generation-maintenance"] ?? 0) > 0;
  return {
    hasInitialAuthoring,
    hasStarterSite,
    hasBulkGeneration,
    hasPostGenerationMaintenance,
    complete: hasInitialAuthoring && hasStarterSite && hasBulkGeneration && hasPostGenerationMaintenance,
    artifactCountsByPhase: Object.fromEntries(Object.entries(counts).sort(([left], [right]) => left.localeCompare(right))),
  };
}

export function assertWorkspaceHash(snapshot: AgentWorkspaceSnapshot): void {
  const canonical = {
    id: snapshot.id.trim(),
    version: snapshot.version.trim(),
    maturity: snapshot.maturity,
    createdAt: snapshot.createdAt.trim(),
    ...(snapshot.priorSnapshotHash === undefined ? {} : { priorSnapshotHash: snapshot.priorSnapshotHash.trim() }),
    pageCount: snapshot.pageCount,
    routeCount: snapshot.routeCount,
    ...(snapshot.designAuthorityHash === undefined ? {} : { designAuthorityHash: snapshot.designAuthorityHash.trim() }),
    ...(snapshot.transactionHash === undefined ? {} : { transactionHash: snapshot.transactionHash.trim() }),
    artifacts: snapshot.artifacts.map(canonicalArtifact),
  };
  if (sha256(JSON.stringify(canonical)) !== snapshot.snapshotHash) throw new Error("workspace snapshot hash mismatch");
}

function assertAcyclicArtifacts(artifacts: readonly AgentWorkspaceArtifact[]): void {
  const byId = new Map(artifacts.map((item) => [item.id, item]));
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (id: string): void => {
    if (visited.has(id)) return;
    if (visiting.has(id)) throw new Error(`workspace dependency cycle detected at ${id}`);
    const artifact = byId.get(id);
    if (!artifact) throw new Error(`workspace dependency references unknown artifact ${id}`);
    visiting.add(id);
    for (const dependencyId of artifact.dependencyIds) visit(dependencyId);
    visiting.delete(id);
    visited.add(id);
  };
  for (const artifact of artifacts) visit(artifact.id);
}

function canonicalArtifact(artifact: AgentWorkspaceArtifact): AgentWorkspaceArtifact {
  return {
    id: artifact.id.trim(),
    kind: artifact.kind,
    phase: artifact.phase,
    status: artifact.status,
    producedBy: artifact.producedBy.trim(),
    sourceIds: [...new Set(artifact.sourceIds.map((item) => item.trim()).filter(Boolean))].sort(),
    dependencyIds: [...new Set(artifact.dependencyIds.map((item) => item.trim()).filter(Boolean))].sort(),
    contentHash: artifact.contentHash.trim(),
  };
}
