import { createHash } from "node:crypto";
import type { LivingSurfaceState, SurfaceApproval, SurfaceReceipt } from "@amtech/hyper-site";

export interface ExternalActionRequest {
  runId: string;
  surfaceStateHash: string;
  actionId: string;
  approvalId: string;
  approvalEpoch: number;
  payload: unknown;
}

export interface ExternalActionEffectResult {
  summary: string;
  artifactUrl?: string;
  providerReceiptId?: string;
}

export interface ExternalActionExecutor {
  execute(request: ExternalActionRequest): Promise<ExternalActionEffectResult>;
}

export interface ImmutableActionReceipt extends SurfaceReceipt {
  runId: string;
  approvalId: string;
  approvalEpoch: number;
  idempotencyKey: string;
  surfaceStateHash: string;
  payloadHash: string;
  providerReceiptId?: string;
  receiptHash: string;
}

export interface ActionReceiptStore {
  get(idempotencyKey: string): Promise<ImmutableActionReceipt | undefined>;
  put(receipt: ImmutableActionReceipt): Promise<void>;
}

export class InMemoryActionReceiptStore implements ActionReceiptStore {
  readonly #records = new Map<string, ImmutableActionReceipt>();

  async get(idempotencyKey: string): Promise<ImmutableActionReceipt | undefined> {
    const receipt = this.#records.get(idempotencyKey);
    return receipt ? cloneReceipt(receipt) : undefined;
  }

  async put(receipt: ImmutableActionReceipt): Promise<void> {
    const existing = this.#records.get(receipt.idempotencyKey);
    if (existing && existing.receiptHash !== receipt.receiptHash) {
      throw new Error(`idempotency conflict for ${receipt.idempotencyKey}`);
    }
    this.#records.set(receipt.idempotencyKey, cloneReceipt(receipt));
  }
}

export async function executeApprovedSurfaceAction(
  state: LivingSurfaceState,
  request: ExternalActionRequest,
  executor: ExternalActionExecutor,
  store: ActionReceiptStore,
): Promise<{ receipt: ImmutableActionReceipt; state: LivingSurfaceState; replayed: boolean }> {
  validateRequest(request);
  const action = state.actions.find((candidate) => candidate.id === request.actionId);
  if (!action) throw new Error(`missing action ${request.actionId}`);
  const approval = state.approvals.find((candidate) => candidate.id === request.approvalId);
  if (!approval) throw new Error(`missing approval ${request.approvalId}`);
  assertApproval(action.id, approval, request.approvalEpoch);
  if (action.status !== "approval-required") throw new Error(`action ${action.id} must be approval-required before execution`);
  if (action.approvalId !== approval.id) throw new Error(`action ${action.id} is not bound to approval ${approval.id}`);

  const payloadHash = hashCanonical(request.payload);
  const idempotencyKey = hashCanonical({
    runId: request.runId,
    surfaceStateHash: request.surfaceStateHash,
    actionId: request.actionId,
    approvalId: request.approvalId,
    approvalEpoch: request.approvalEpoch,
    payloadHash,
  });

  const existing = await store.get(idempotencyKey);
  if (existing) {
    return { receipt: existing, state: applyReceipt(state, existing), replayed: true };
  }

  const effect = await executor.execute({ ...request });
  if (!effect.summary.trim()) throw new Error("external action executor must return a summary");
  const createdAt = new Date().toISOString();
  const stable = {
    id: `receipt:${idempotencyKey.slice(0, 24)}`,
    actionId: request.actionId,
    summary: effect.summary,
    createdAt,
    visibility: "operator" as const,
    runId: request.runId,
    approvalId: request.approvalId,
    approvalEpoch: request.approvalEpoch,
    idempotencyKey,
    surfaceStateHash: request.surfaceStateHash,
    payloadHash,
    ...(effect.artifactUrl ? { artifactUrl: effect.artifactUrl } : {}),
    ...(effect.providerReceiptId ? { providerReceiptId: effect.providerReceiptId } : {}),
  };
  const receipt: ImmutableActionReceipt = {
    ...stable,
    receiptHash: hashCanonical(stable),
  };
  await store.put(receipt);
  return { receipt, state: applyReceipt(state, receipt), replayed: false };
}

export function applyReceipt(state: LivingSurfaceState, receipt: ImmutableActionReceipt): LivingSurfaceState {
  if (state.receipts.some((candidate) => candidate.id === receipt.id && JSON.stringify(candidate) !== JSON.stringify(receipt))) {
    throw new Error(`receipt id conflict: ${receipt.id}`);
  }
  return {
    ...state,
    actions: state.actions.map((action) => action.id === receipt.actionId
      ? { ...action, status: "completed", receiptId: receipt.id }
      : { ...action }),
    approvals: state.approvals.map((approval) => approval.id === receipt.approvalId
      ? { ...approval, status: "approved" }
      : { ...approval }),
    receipts: state.receipts.some((candidate) => candidate.id === receipt.id)
      ? state.receipts.map((candidate) => ({ ...candidate }))
      : [...state.receipts.map((candidate) => ({ ...candidate })), receipt].sort((left, right) => left.id.localeCompare(right.id)),
    runtime: {
      ...state.runtime,
      status: state.runtime.queueDepth > 0 ? "working" : "idle",
      pendingApprovals: Math.max(0, state.runtime.pendingApprovals - 1),
      lastHeartbeatAt: receipt.createdAt,
    },
  };
}

export function approveSurfaceAction(
  state: LivingSurfaceState,
  approvalId: string,
): LivingSurfaceState {
  const approval = state.approvals.find((candidate) => candidate.id === approvalId);
  if (!approval) throw new Error(`missing approval ${approvalId}`);
  if (approval.status !== "pending") throw new Error(`approval ${approvalId} must be pending`);
  return {
    ...state,
    approvals: state.approvals.map((candidate) => candidate.id === approvalId ? { ...candidate, status: "approved" } : { ...candidate }),
  };
}

function assertApproval(actionId: string, approval: SurfaceApproval, approvalEpoch: number): void {
  if (approval.actionId !== actionId) throw new Error(`approval ${approval.id} is bound to another action`);
  if (approval.status !== "approved") throw new Error(`approval ${approval.id} is not approved`);
  if (!Number.isInteger(approvalEpoch) || approvalEpoch < 1) throw new Error("approvalEpoch must be a positive integer");
}

function validateRequest(request: ExternalActionRequest): void {
  if (!request.runId.trim()) throw new Error("runId is required");
  if (!/^[a-f0-9]{64}$/i.test(request.surfaceStateHash)) throw new Error("surfaceStateHash must be a SHA-256 hex digest");
  if (!request.actionId.trim() || !request.approvalId.trim()) throw new Error("actionId and approvalId are required");
  if (!Number.isInteger(request.approvalEpoch) || request.approvalEpoch < 1) throw new Error("approvalEpoch must be a positive integer");
}

function cloneReceipt(receipt: ImmutableActionReceipt): ImmutableActionReceipt { return { ...receipt }; }
function hashCanonical(value: unknown): string { return createHash("sha256").update(JSON.stringify(value)).digest("hex"); }
