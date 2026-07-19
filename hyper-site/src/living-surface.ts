import { createHash } from "node:crypto";

export type SurfaceAudience = "public" | "operator";
export type SurfaceVisibility = "public" | "operator" | "both";
export type SurfaceNodeKind = "status" | "work" | "evidence" | "approval" | "artifact" | "command";
export type ActionAuthority = "user" | "agent" | "mixed";
export type ActionStatus = "available" | "running" | "approval-required" | "blocked" | "completed" | "failed";
export type RuntimeStatus = "idle" | "working" | "waiting-approval" | "degraded" | "failed";
export type AgencyMode = "agent-led" | "mixed-initiative" | "user-led";

export interface ContinuousInterfaceVector {
  visibility: number;
  scale: number;
  curvature: number;
  density: number;
  governance: number;
  agency: number;
  relevance: number;
  valence: number;
  urgency: number;
}

export interface SurfaceInformationObject {
  id: string;
  title: string;
  body: string;
  visibility: SurfaceVisibility;
  evidenceIds: string[];
}

export interface GovernedSurfaceAction {
  id: string;
  label: string;
  description: string;
  visibility: SurfaceVisibility;
  authority: ActionAuthority;
  status: ActionStatus;
  risk: number;
  agency: number;
  evidenceIds: string[];
  taskId?: string;
  approvalId?: string;
  receiptId?: string;
}

export interface SurfaceApproval {
  id: string;
  actionId: string;
  summary: string;
  requestedBy: "agent" | "user" | "system";
  status: "pending" | "approved" | "rejected" | "expired";
  visibility: SurfaceVisibility;
}

export interface SurfaceReceipt {
  id: string;
  actionId: string;
  summary: string;
  artifactUrl?: string;
  createdAt: string;
  visibility: SurfaceVisibility;
}

export interface SurfaceNode {
  id: string;
  kind: SurfaceNodeKind;
  title: string;
  body: string;
  visibility: SurfaceVisibility;
  field: ContinuousInterfaceVector;
  informationObjectIds: string[];
  actionIds: string[];
  evidenceIds: string[];
}

export interface SurfaceRuntimeHealth {
  status: RuntimeStatus;
  activeAgents: number;
  queueDepth: number;
  pendingApprovals: number;
  costUsd: number;
  lastHeartbeatAt: string;
}

export interface LivingSurfaceState {
  schemaVersion: 1;
  id: string;
  title: string;
  purpose: string;
  currentTask: string;
  governanceThreshold: number;
  evidenceIds: string[];
  informationObjects: SurfaceInformationObject[];
  actions: GovernedSurfaceAction[];
  approvals: SurfaceApproval[];
  receipts: SurfaceReceipt[];
  nodes: SurfaceNode[];
  runtime: SurfaceRuntimeHealth;
}

export interface SurfaceNodeDecision {
  nodeId: string;
  score: number;
  order: number;
  agencyMode: AgencyMode;
  blendRadius: number;
  approvalCurvature: number;
  requiresApproval: boolean;
  reasons: string[];
}

export interface ProjectedLivingSurface {
  audience: SurfaceAudience;
  state: LivingSurfaceState;
  decisions: SurfaceNodeDecision[];
  stateHash: string;
}

export interface CompiledLivingSurface {
  projection: ProjectedLivingSurface;
  html: string;
  htmlHash: string;
  buildHash: string;
}

export function compileLivingSurface(source: LivingSurfaceState, audience: SurfaceAudience): CompiledLivingSurface {
  validateLivingSurface(source);
  const projection = projectLivingSurface(source, audience);
  const html = renderLivingSurfaceHtml(projection);
  const htmlHash = sha256(html);
  return {
    projection,
    html,
    htmlHash,
    buildHash: sha256(JSON.stringify({ audience, stateHash: projection.stateHash, htmlHash })),
  };
}

export function projectLivingSurface(source: LivingSurfaceState, audience: SurfaceAudience): ProjectedLivingSurface {
  validateLivingSurface(source);
  const visible = (visibility: SurfaceVisibility): boolean => visibility === "both" || visibility === audience;
  const informationObjects = source.informationObjects.filter((item) => visible(item.visibility)).map(cloneInformationObject);
  const informationIds = new Set(informationObjects.map((item) => item.id));
  const actions = source.actions.filter((action) => visible(action.visibility)).map((action) => resolveAction(action, source.governanceThreshold));
  const actionIds = new Set(actions.map((action) => action.id));
  const approvals = source.approvals.filter((approval) => visible(approval.visibility) && actionIds.has(approval.actionId)).map(cloneApproval);
  const approvalIds = new Set(approvals.map((approval) => approval.id));
  const receipts = source.receipts.filter((receipt) => visible(receipt.visibility) && actionIds.has(receipt.actionId)).map(cloneReceipt);
  const receiptIds = new Set(receipts.map((receipt) => receipt.id));

  const nodes = source.nodes
    .filter((node) => visible(node.visibility))
    .map((node) => ({
      ...cloneNode(node),
      informationObjectIds: node.informationObjectIds.filter((id) => informationIds.has(id)),
      actionIds: node.actionIds.filter((id) => actionIds.has(id)),
    }));

  const projectedActions = actions.map((action) => ({
    ...action,
    ...(action.approvalId && approvalIds.has(action.approvalId) ? { approvalId: action.approvalId } : {}),
    ...(action.receiptId && receiptIds.has(action.receiptId) ? { receiptId: action.receiptId } : {}),
  }));

  const state: LivingSurfaceState = canonicalizeState({
    ...source,
    informationObjects,
    actions: projectedActions,
    approvals,
    receipts,
    nodes,
    evidenceIds: uniqueSorted(source.evidenceIds),
    runtime: { ...source.runtime },
  });

  const decisions = state.nodes
    .map((node) => decideNode(node, state.actions, state.governanceThreshold))
    .sort((left, right) => right.score - left.score || left.nodeId.localeCompare(right.nodeId))
    .map((decision, order) => ({ ...decision, order }));

  return {
    audience,
    state,
    decisions,
    stateHash: sha256(JSON.stringify(state)),
  };
}

export function validateLivingSurface(source: LivingSurfaceState): void {
  if (source.schemaVersion !== 1) throw new Error("living surface schemaVersion must equal 1");
  if (!source.id.trim()) throw new Error("living surface id is required");
  if (!source.title.trim()) throw new Error("living surface title is required");
  if (!source.purpose.trim()) throw new Error("living surface purpose is required");
  assertUnit(source.governanceThreshold, "governanceThreshold");
  assertNonNegativeInteger(source.runtime.activeAgents, "runtime.activeAgents");
  assertNonNegativeInteger(source.runtime.queueDepth, "runtime.queueDepth");
  assertNonNegativeInteger(source.runtime.pendingApprovals, "runtime.pendingApprovals");
  if (!Number.isFinite(source.runtime.costUsd) || source.runtime.costUsd < 0) throw new Error("runtime.costUsd must be a non-negative finite number");
  assertIsoDate(source.runtime.lastHeartbeatAt, "runtime.lastHeartbeatAt");

  assertUnique(source.informationObjects, "information object");
  assertUnique(source.actions, "action");
  assertUnique(source.approvals, "approval");
  assertUnique(source.receipts, "receipt");
  assertUnique(source.nodes, "node");

  const informationIds = new Set(source.informationObjects.map((item) => item.id));
  const actionIds = new Set(source.actions.map((item) => item.id));
  const approvalIds = new Set(source.approvals.map((item) => item.id));
  const receiptIds = new Set(source.receipts.map((item) => item.id));
  const evidenceIds = new Set(source.evidenceIds);

  for (const item of source.informationObjects) {
    if (!item.title.trim() || !item.body.trim()) throw new Error(`information object ${item.id} requires title and body`);
    assertReferences(item.evidenceIds, evidenceIds, `information object ${item.id} evidence`);
  }

  for (const action of source.actions) {
    if (!action.label.trim() || !action.description.trim()) throw new Error(`action ${action.id} requires label and description`);
    assertUnit(action.risk, `action ${action.id} risk`);
    assertUnit(action.agency, `action ${action.id} agency`);
    assertReferences(action.evidenceIds, evidenceIds, `action ${action.id} evidence`);
    if (action.approvalId && !approvalIds.has(action.approvalId)) throw new Error(`action ${action.id} references missing approval ${action.approvalId}`);
    if (action.receiptId && !receiptIds.has(action.receiptId)) throw new Error(`action ${action.id} references missing receipt ${action.receiptId}`);
  }

  for (const approval of source.approvals) {
    if (!actionIds.has(approval.actionId)) throw new Error(`approval ${approval.id} references missing action ${approval.actionId}`);
    if (!approval.summary.trim()) throw new Error(`approval ${approval.id} requires summary`);
  }

  for (const receipt of source.receipts) {
    if (!actionIds.has(receipt.actionId)) throw new Error(`receipt ${receipt.id} references missing action ${receipt.actionId}`);
    if (!receipt.summary.trim()) throw new Error(`receipt ${receipt.id} requires summary`);
    assertIsoDate(receipt.createdAt, `receipt ${receipt.id} createdAt`);
  }

  for (const node of source.nodes) {
    if (!node.title.trim() || !node.body.trim()) throw new Error(`node ${node.id} requires title and body`);
    validateField(node.field, node.id);
    assertReferences(node.informationObjectIds, informationIds, `node ${node.id} information objects`);
    assertReferences(node.actionIds, actionIds, `node ${node.id} actions`);
    assertReferences(node.evidenceIds, evidenceIds, `node ${node.id} evidence`);
  }
}

export function agencyMode(agency: number): AgencyMode {
  assertUnit(agency, "agency");
  if (agency <= 0.25) return "agent-led";
  if (agency >= 0.75) return "user-led";
  return "mixed-initiative";
}

export function agencyBlendRadius(agency: number, maximum = 24): number {
  assertUnit(agency, "agency");
  if (!Number.isFinite(maximum) || maximum < 0) throw new Error("maximum blend radius must be non-negative");
  return round(maximum * (1 - agency));
}

export function approvalBoundaryCurvature(risk: number, threshold: number): number {
  assertUnit(risk, "risk");
  assertUnit(threshold, "threshold");
  return round(1 / (1 + Math.exp(-12 * (risk - threshold))));
}

export function renderLivingSurfaceHtml(projection: ProjectedLivingSurface): string {
  const { state, audience, decisions } = projection;
  const decisionById = new Map(decisions.map((decision) => [decision.nodeId, decision]));
  const informationById = new Map(state.informationObjects.map((item) => [item.id, item]));
  const actionById = new Map(state.actions.map((item) => [item.id, item]));
  const approvalById = new Map(state.approvals.map((item) => [item.id, item]));
  const receiptById = new Map(state.receipts.map((item) => [item.id, item]));

  const orderedNodes = [...state.nodes].sort((left, right) => {
    const leftDecision = required(decisionById, left.id, "node decision");
    const rightDecision = required(decisionById, right.id, "node decision");
    return leftDecision.order - rightDecision.order;
  });

  const cards = orderedNodes.map((node) => {
    const decision = required(decisionById, node.id, "node decision");
    const information = node.informationObjectIds.map((id) => {
      const item = required(informationById, id, `information object for node ${node.id}`);
      return `<article class="information-object"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.body)}</p></article>`;
    }).join("");
    const actions = node.actionIds.map((id) => {
      const action = required(actionById, id, `action for node ${node.id}`);
      const approval = action.approvalId ? approvalById.get(action.approvalId) : undefined;
      const receipt = action.receiptId ? receiptById.get(action.receiptId) : undefined;
      const disabled = action.status === "blocked" || action.status === "running" || action.status === "completed" || action.status === "failed" || action.status === "approval-required";
      const details = [
        `<span>Mode: ${escapeHtml(agencyMode(action.agency))}</span>`,
        `<span>Risk: ${formatPercent(action.risk)}</span>`,
        `<span>Status: ${escapeHtml(action.status)}</span>`,
      ].join("");
      return `<section class="action" data-action-id="${escapeHtml(action.id)}"><div><h3>${escapeHtml(action.label)}</h3><p>${escapeHtml(action.description)}</p><div class="action-meta">${details}</div></div><button type="button"${disabled ? " disabled" : ""}>${escapeHtml(action.status === "approval-required" ? "Approval required" : action.label)}</button>${approval ? `<p class="approval">Approval: ${escapeHtml(approval.status)} — ${escapeHtml(approval.summary)}</p>` : ""}${receipt ? `<p class="receipt">Receipt: ${escapeHtml(receipt.summary)}</p>` : ""}</section>`;
    }).join("");
    const style = fieldStyle(node.field, decision);
    return `<section class="surface-node" id="${escapeHtml(node.id)}" data-kind="${escapeHtml(node.kind)}" data-agency-mode="${decision.agencyMode}" style="${style}"><header><p class="eyebrow">${escapeHtml(node.kind)} · relevance ${formatPercent(node.field.relevance)}</p><h2>${escapeHtml(node.title)}</h2><p>${escapeHtml(node.body)}</p></header>${information}${actions}<details><summary>Why this is here</summary><ul>${decision.reasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")}</ul></details></section>`;
  }).join("\n");

  const runtime = state.runtime;
  const runtimeSummary = `${runtime.status}; ${runtime.activeAgents} active agents; ${runtime.queueDepth} queued; ${runtime.pendingApprovals} approvals; $${runtime.costUsd.toFixed(2)} cost`;
  return [
    "<!doctype html>",
    '<html lang="en">',
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1">',
    `<title>${escapeHtml(state.title)} · ${escapeHtml(audience)}</title>`,
    `<meta name="description" content="${escapeHtml(state.purpose)}">`,
    '<style>:root{font-family:Inter,ui-sans-serif,system-ui,sans-serif;color-scheme:dark;background:#090b10;color:#f5f7fb}*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at top,#182137 0,#090b10 48rem);min-height:100vh}main{width:min(1180px,calc(100% - 2rem));margin:auto;padding:2rem 0 5rem}.surface-header,.runtime,.surface-node{border:1px solid rgba(255,255,255,.14);background:rgba(12,16,25,.86);backdrop-filter:blur(14px);box-shadow:0 18px 70px rgba(0,0,0,.28)}.surface-header{padding:clamp(1.5rem,5vw,4rem);border-radius:2rem}.surface-header h1{font-size:clamp(2.25rem,7vw,5.5rem);line-height:.95;margin:.35rem 0 1rem;max-width:12ch}.kicker,.eyebrow{font-size:.76rem;letter-spacing:.13em;text-transform:uppercase;color:#a7b4ce}.runtime{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:.75rem;margin:1rem 0;padding:1rem;border-radius:1.25rem}.runtime div{padding:.85rem;border-radius:.8rem;background:rgba(255,255,255,.045)}.runtime strong{display:block;font-size:1.4rem}.field{display:grid;grid-template-columns:repeat(12,1fr);gap:1rem;align-items:start}.surface-node{grid-column:span var(--span);padding:clamp(1.1rem,3vw,2rem);border-radius:var(--radius);opacity:var(--visibility);transform:scale(var(--scale));transform-origin:center;order:var(--order);border-color:rgba(142,176,255,var(--governance));transition:transform .2s ease}.surface-node h2{font-size:clamp(1.45rem,3vw,2.4rem);margin:.25rem 0 .75rem}.information-object,.action{margin-top:1rem;padding:1rem;border-radius:1rem;background:rgba(255,255,255,.05)}.action{display:grid;grid-template-columns:1fr auto;gap:1rem;align-items:center}.action button{border:0;border-radius:999px;padding:.8rem 1rem;font-weight:700}.action button:not(:disabled){cursor:pointer;background:#d9ff52;color:#111}.action button:disabled{background:#4b5364;color:#c8cfdd}.action-meta{display:flex;gap:.65rem;flex-wrap:wrap;color:#aeb8ca;font-size:.8rem}.approval{color:#ffd166}.receipt{color:#8cf0c8}details{margin-top:1rem;color:#aeb8ca}summary{cursor:pointer}@media(max-width:800px){.field{display:block}.surface-node{margin-top:1rem}.action{grid-template-columns:1fr}.action button{width:100%}}@media(prefers-reduced-motion:reduce){*{transition:none!important}}</style>',
    "</head>",
    `<body data-surface-id="${escapeHtml(state.id)}" data-audience="${audience}">`,
    "<main>",
    `<header class="surface-header"><p class="kicker">Living website · ${escapeHtml(audience)} projection</p><h1>${escapeHtml(state.title)}</h1><p>${escapeHtml(state.purpose)}</p><p><strong>Current task:</strong> ${escapeHtml(state.currentTask)}</p></header>`,
    `<section class="runtime" aria-label="Runtime health"><div><span>Status</span><strong>${escapeHtml(runtime.status)}</strong></div><div><span>Active agents</span><strong>${runtime.activeAgents}</strong></div><div><span>Queue</span><strong>${runtime.queueDepth}</strong></div><div><span>Approvals</span><strong>${runtime.pendingApprovals}</strong></div><div><span>Cost</span><strong>$${runtime.costUsd.toFixed(2)}</strong></div></section>`,
    `<p class="kicker" aria-label="Runtime summary">${escapeHtml(runtimeSummary)}</p>`,
    `<section class="field" aria-label="Agent operating surface">${cards}</section>`,
    "</main>",
    "</body>",
    "</html>",
    "",
  ].join("\n");
}

function decideNode(node: SurfaceNode, actions: readonly GovernedSurfaceAction[], threshold: number): SurfaceNodeDecision {
  const nodeActions = node.actionIds.map((id) => actions.find((action) => action.id === id)).filter((action): action is GovernedSurfaceAction => action !== undefined);
  const maximumRisk = nodeActions.reduce((maximum, action) => Math.max(maximum, action.risk), 0);
  const requiresApproval = nodeActions.some((action) => action.status === "approval-required" || action.risk >= threshold);
  const agency = nodeActions.length > 0 ? nodeActions.reduce((sum, action) => sum + action.agency, 0) / nodeActions.length : node.field.agency;
  const score = round(
    node.field.relevance * 0.35
    + node.field.urgency * 0.25
    + Math.max(node.field.governance, maximumRisk) * 0.2
    + node.field.visibility * 0.1
    + Math.min(node.field.density, 1) * 0.1,
  );
  const reasons = [
    `relevance contributes ${formatPercent(node.field.relevance)}`,
    `urgency contributes ${formatPercent(node.field.urgency)}`,
    `governance boundary is ${formatPercent(Math.max(node.field.governance, maximumRisk))}`,
    `agency is ${agencyMode(agency)} at ${formatPercent(agency)} user control`,
  ];
  if (requiresApproval) reasons.push("one or more actions cross the approval threshold");
  return {
    nodeId: node.id,
    score,
    order: 0,
    agencyMode: agencyMode(agency),
    blendRadius: agencyBlendRadius(agency),
    approvalCurvature: approvalBoundaryCurvature(maximumRisk, threshold),
    requiresApproval,
    reasons,
  };
}

function resolveAction(action: GovernedSurfaceAction, threshold: number): GovernedSurfaceAction {
  const requiresApproval = action.risk >= threshold && action.status === "available";
  return {
    ...action,
    status: requiresApproval ? "approval-required" : action.status,
    evidenceIds: uniqueSorted(action.evidenceIds),
  };
}

function canonicalizeState(source: LivingSurfaceState): LivingSurfaceState {
  return {
    ...source,
    evidenceIds: uniqueSorted(source.evidenceIds),
    informationObjects: [...source.informationObjects].sort(byId).map(cloneInformationObject),
    actions: [...source.actions].sort(byId).map(cloneAction),
    approvals: [...source.approvals].sort(byId).map(cloneApproval),
    receipts: [...source.receipts].sort(byId).map(cloneReceipt),
    nodes: [...source.nodes].sort(byId).map(cloneNode),
    runtime: { ...source.runtime },
  };
}

function fieldStyle(field: ContinuousInterfaceVector, decision: SurfaceNodeDecision): string {
  const span = Math.max(4, Math.min(12, Math.round(4 + Math.min(field.density, 1) * 4 + field.relevance * 4)));
  const radius = Math.max(4, Math.round(decision.blendRadius));
  return [
    `--visibility:${round(field.visibility)}`,
    `--scale:${round(Math.max(0.85, Math.min(1.08, 0.9 + field.scale * 0.1)))}`,
    `--span:${span}`,
    `--radius:${radius}px`,
    `--governance:${round(Math.max(field.governance, decision.approvalCurvature))}`,
    `--order:${decision.order}`,
  ].join(";");
}

function validateField(field: ContinuousInterfaceVector, nodeId: string): void {
  assertUnit(field.visibility, `node ${nodeId} field.visibility`);
  if (!Number.isFinite(field.scale) || field.scale < 0) throw new Error(`node ${nodeId} field.scale must be non-negative`);
  if (!Number.isFinite(field.curvature) || field.curvature < -1 || field.curvature > 1) throw new Error(`node ${nodeId} field.curvature must be between -1 and 1`);
  if (!Number.isFinite(field.density) || field.density < 0) throw new Error(`node ${nodeId} field.density must be non-negative`);
  assertUnit(field.governance, `node ${nodeId} field.governance`);
  assertUnit(field.agency, `node ${nodeId} field.agency`);
  assertUnit(field.relevance, `node ${nodeId} field.relevance`);
  assertUnit(field.valence, `node ${nodeId} field.valence`);
  assertUnit(field.urgency, `node ${nodeId} field.urgency`);
}

function cloneInformationObject(item: SurfaceInformationObject): SurfaceInformationObject { return { ...item, evidenceIds: uniqueSorted(item.evidenceIds) }; }
function cloneAction(item: GovernedSurfaceAction): GovernedSurfaceAction { return { ...item, evidenceIds: uniqueSorted(item.evidenceIds) }; }
function cloneApproval(item: SurfaceApproval): SurfaceApproval { return { ...item }; }
function cloneReceipt(item: SurfaceReceipt): SurfaceReceipt { return { ...item }; }
function cloneNode(item: SurfaceNode): SurfaceNode { return { ...item, field: { ...item.field }, informationObjectIds: uniqueSorted(item.informationObjectIds), actionIds: uniqueSorted(item.actionIds), evidenceIds: uniqueSorted(item.evidenceIds) }; }
function byId<T extends { id: string }>(left: T, right: T): number { return left.id.localeCompare(right.id); }
function uniqueSorted(values: readonly string[]): string[] { return [...new Set(values)].sort(); }
function sha256(value: string): string { return createHash("sha256").update(value).digest("hex"); }
function round(value: number): number { return Number(value.toFixed(6)); }
function formatPercent(value: number): string { return `${Math.round(value * 100)}%`; }
function escapeHtml(value: string): string { return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;"); }
function assertUnit(value: number, label: string): void { if (!Number.isFinite(value) || value < 0 || value > 1) throw new Error(`${label} must be between 0 and 1`); }
function assertNonNegativeInteger(value: number, label: string): void { if (!Number.isInteger(value) || value < 0) throw new Error(`${label} must be a non-negative integer`); }
function assertIsoDate(value: string, label: string): void { if (!value || Number.isNaN(Date.parse(value))) throw new Error(`${label} must be an ISO-compatible date`); }
function assertUnique<T extends { id: string }>(items: readonly T[], label: string): void { const ids = new Set<string>(); for (const item of items) { if (!item.id.trim()) throw new Error(`${label} id is required`); if (ids.has(item.id)) throw new Error(`duplicate ${label} id: ${item.id}`); ids.add(item.id); } }
function assertReferences(values: readonly string[], allowed: ReadonlySet<string>, label: string): void { for (const value of values) if (!allowed.has(value)) throw new Error(`${label} references missing id ${value}`); }
function required<K, V>(map: ReadonlyMap<K, V>, key: K, label: string): V { const value = map.get(key); if (value === undefined) throw new Error(`missing ${label}: ${String(key)}`); return value; }
