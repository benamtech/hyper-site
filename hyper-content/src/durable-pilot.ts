import { createHash, randomUUID } from "node:crypto";
import { mkdir, open, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { compileLivingSurface, type LivingSurfaceState } from "@amtech/hyper-site";
import {
  applyReceipt,
  executeApprovedSurfaceAction,
  type ActionReceiptStore,
  type ExternalActionEffectResult,
  type ExternalActionExecutor,
  type ExternalActionRequest,
  type ImmutableActionReceipt,
} from "./action-runtime.js";
import {
  runSemanticGeneration,
  type ApprovedSemanticCorpus,
  type ProviderProposal,
  type SemanticGenerationCheckpoint,
  type SemanticGenerationInput,
  type SemanticGenerationResult,
  type SemanticProposalProvider,
} from "./semantic-generation.js";

export interface TenantActorContext {
  tenantId: string;
  actorId: string;
  roles: string[];
  scopes: string[];
  authenticatedAt: string;
}

export interface AuthorizedActionRequest extends ExternalActionRequest {
  tenantId: string;
  actor: TenantActorContext;
  requiredRole: string;
  requiredScope: string;
  approvalTenantId: string;
  approvalActorId: string;
  approvalExpiresAt: string;
}

export interface DurableLease {
  key: string;
  ownerId: string;
  expiresAt: string;
}

export interface DurableAuditEvent {
  id: string;
  type: string;
  tenantId: string;
  actorId: string;
  at: string;
  dataHash: string;
}

export interface DurablePilotState {
  schemaVersion: 1;
  revision: number;
  checkpoints: Record<string, SemanticGenerationCheckpoint>;
  receipts: Record<string, ImmutableActionReceipt>;
  leases: Record<string, DurableLease>;
  shadowEffects: Record<string, ShadowEffectRecord>;
  audit: DurableAuditEvent[];
}

export interface ShadowEffectRecord {
  idempotencyKey: string;
  tenantId: string;
  connector: string;
  actionId: string;
  payloadHash: string;
  status: "shadowed";
  createdAt: string;
  providerReceiptId: string;
}

export interface DurableTransactionContext {
  state: DurablePilotState;
  appendAudit(event: Omit<DurableAuditEvent, "id" | "at">): void;
}

export class DurableJsonTransactionStore implements ActionReceiptStore {
  readonly #path: string;
  readonly #lockPath: string;
  readonly #lockTimeoutMs: number;
  readonly #staleLockMs: number;

  constructor(path: string, options: { lockTimeoutMs?: number; staleLockMs?: number } = {}) {
    this.#path = resolve(path);
    this.#lockPath = `${this.#path}.lock`;
    this.#lockTimeoutMs = options.lockTimeoutMs ?? 5_000;
    this.#staleLockMs = options.staleLockMs ?? 30_000;
  }

  async initialize(): Promise<void> {
    await mkdir(dirname(this.#path), { recursive: true });
    try { await stat(this.#path); }
    catch { await this.#atomicWrite(emptyState()); }
  }

  async read(): Promise<DurablePilotState> {
    await this.initialize();
    return validateState(JSON.parse(await readFile(this.#path, "utf8")));
  }

  async transaction<T>(mutator: (context: DurableTransactionContext) => Promise<T> | T): Promise<T> {
    await this.initialize();
    const ownerId = randomUUID();
    const lock = await this.#acquireLock(ownerId);
    try {
      const current = await this.read();
      const next = structuredClone(current);
      const context: DurableTransactionContext = {
        state: next,
        appendAudit: (event) => next.audit.push({ ...event, id: `audit:${next.revision + 1}:${next.audit.length}`, at: new Date().toISOString() }),
      };
      const result = await mutator(context);
      next.revision = current.revision + 1;
      await this.#atomicWrite(validateState(next));
      return result;
    } finally {
      await lock.close().catch(() => undefined);
      await rm(this.#lockPath, { force: true }).catch(() => undefined);
    }
  }

  async get(idempotencyKey: string): Promise<ImmutableActionReceipt | undefined> {
    const receipt = (await this.read()).receipts[idempotencyKey];
    return receipt ? { ...receipt } : undefined;
  }

  async put(receipt: ImmutableActionReceipt): Promise<void> {
    await this.transaction(({ state }) => {
      const existing = state.receipts[receipt.idempotencyKey];
      if (existing && existing.receiptHash !== receipt.receiptHash) throw new Error(`idempotency conflict for ${receipt.idempotencyKey}`);
      state.receipts[receipt.idempotencyKey] = { ...receipt };
    });
  }

  async saveCheckpoint(key: string, checkpoint: SemanticGenerationCheckpoint, actor: TenantActorContext): Promise<void> {
    assertActor(actor);
    await this.transaction(({ state, appendAudit }) => {
      state.checkpoints[key] = structuredClone(checkpoint);
      appendAudit({ type: "checkpoint.saved", tenantId: actor.tenantId, actorId: actor.actorId, dataHash: hashCanonical(checkpoint) });
    });
  }

  async loadCheckpoint(key: string): Promise<SemanticGenerationCheckpoint | undefined> {
    const value = (await this.read()).checkpoints[key];
    return value ? structuredClone(value) : undefined;
  }

  async acquireLease(key: string, ownerId: string, ttlMs: number): Promise<DurableLease> {
    if (!key.trim() || !ownerId.trim() || !Number.isInteger(ttlMs) || ttlMs < 100) throw new Error("invalid lease request");
    return this.transaction(({ state }) => {
      const now = Date.now();
      const existing = state.leases[key];
      if (existing && Date.parse(existing.expiresAt) > now && existing.ownerId !== ownerId) throw new Error(`lease ${key} is held by another owner`);
      const lease = { key, ownerId, expiresAt: new Date(now + ttlMs).toISOString() };
      state.leases[key] = lease;
      return lease;
    });
  }

  async releaseLease(key: string, ownerId: string): Promise<void> {
    await this.transaction(({ state }) => {
      const existing = state.leases[key];
      if (existing && existing.ownerId !== ownerId) throw new Error(`lease ${key} owner mismatch`);
      delete state.leases[key];
    });
  }

  async recordShadowEffect(effect: ShadowEffectRecord, actor: TenantActorContext): Promise<void> {
    await this.transaction(({ state, appendAudit }) => {
      const existing = state.shadowEffects[effect.idempotencyKey];
      if (existing && hashCanonical(existing) !== hashCanonical(effect)) throw new Error(`shadow effect conflict for ${effect.idempotencyKey}`);
      state.shadowEffects[effect.idempotencyKey] = { ...effect };
      appendAudit({ type: "connector.shadowed", tenantId: actor.tenantId, actorId: actor.actorId, dataHash: hashCanonical(effect) });
    });
  }

  async #acquireLock(ownerId: string) {
    const deadline = Date.now() + this.#lockTimeoutMs;
    while (true) {
      try {
        const handle = await open(this.#lockPath, "wx");
        await handle.writeFile(JSON.stringify({ ownerId, createdAt: new Date().toISOString() }));
        return handle;
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
        try {
          const metadata = await stat(this.#lockPath);
          if (Date.now() - metadata.mtimeMs > this.#staleLockMs) await rm(this.#lockPath, { force: true });
        } catch { /* lock raced */ }
        if (Date.now() >= deadline) throw new Error(`transaction lock timeout for ${this.#path}`);
        await delay(20);
      }
    }
  }

  async #atomicWrite(state: DurablePilotState): Promise<void> {
    const temporary = `${this.#path}.${process.pid}.${randomUUID()}.tmp`;
    const handle = await open(temporary, "wx", 0o600);
    try {
      await handle.writeFile(`${JSON.stringify(state, null, 2)}\n`);
      await handle.sync();
    } finally { await handle.close(); }
    await rename(temporary, this.#path);
  }
}

export interface GlmStructuredOutputOptions {
  endpoint: string;
  apiKey: string;
  model: string;
  systemPrompt: string;
  schema: Record<string, unknown>;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

export class GlmStructuredOutputProvider implements SemanticProposalProvider {
  readonly #options: GlmStructuredOutputOptions;
  constructor(options: GlmStructuredOutputOptions) {
    if (!options.endpoint.startsWith("https://")) throw new Error("GLM endpoint must use HTTPS");
    if (!options.apiKey.trim() || !options.model.trim()) throw new Error("GLM apiKey and model are required");
    this.#options = options;
  }

  async propose(input: SemanticGenerationInput, attempt: number): Promise<ProviderProposal> {
    const started = Date.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.#options.timeoutMs ?? 30_000);
    try {
      const response = await (this.#options.fetchImpl ?? fetch)(this.#options.endpoint, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${this.#options.apiKey}` },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.#options.model,
          messages: [
            { role: "system", content: this.#options.systemPrompt },
            { role: "user", content: JSON.stringify({ task: input.task, corpus: input.corpus, attempt }) },
          ],
          response_format: { type: "json_schema", json_schema: { name: "hyper_semantic_proposal", strict: true, schema: this.#options.schema } },
          temperature: 0,
        }),
      });
      if (!response.ok) throw new Error(`GLM HTTP ${response.status}: ${(await response.text()).slice(0, 500)}`);
      const envelope = await response.json() as Record<string, unknown>;
      const content = extractCompatibleContent(envelope);
      const proposal = typeof content === "string" ? JSON.parse(content) : content;
      const usage = asRecord(envelope.usage);
      return {
        provider: "glm-compatible",
        model: this.#options.model,
        requestId: String(envelope.id ?? randomUUID()),
        proposal: proposal as ProviderProposal["proposal"],
        usage: {
          inputTokens: numberOrZero(usage.prompt_tokens ?? usage.input_tokens),
          outputTokens: numberOrZero(usage.completion_tokens ?? usage.output_tokens),
          cachedInputTokens: numberOrZero(usage.cached_tokens ?? usage.cached_input_tokens),
          costUsd: 0,
          latencyMs: Date.now() - started,
        },
      };
    } finally { clearTimeout(timer); }
  }
}

export interface AuthorizationDecision {
  allowed: boolean;
  reasons: string[];
  decisionHash: string;
}

export function authorizeAction(request: AuthorizedActionRequest): AuthorizationDecision {
  const reasons: string[] = [];
  assertActor(request.actor);
  if (request.actor.tenantId !== request.tenantId) reasons.push("actor tenant does not match requested tenant");
  if (request.approvalTenantId !== request.tenantId) reasons.push("approval tenant does not match requested tenant");
  if (request.approvalActorId === request.actor.actorId) reasons.push("executor actor cannot approve its own consequential action");
  if (!request.actor.roles.includes(request.requiredRole)) reasons.push(`actor lacks role ${request.requiredRole}`);
  if (!request.actor.scopes.includes(request.requiredScope)) reasons.push(`actor lacks scope ${request.requiredScope}`);
  if (Date.parse(request.approvalExpiresAt) <= Date.now()) reasons.push("approval has expired");
  const stable = { tenantId: request.tenantId, actorId: request.actor.actorId, actionId: request.actionId, approvalId: request.approvalId, approvalEpoch: request.approvalEpoch, reasons };
  return { allowed: reasons.length === 0, reasons, decisionHash: hashCanonical(stable) };
}

export class ShadowConnectorExecutor implements ExternalActionExecutor {
  readonly #tenantId: string;
  readonly #connector: string;
  readonly #actor: TenantActorContext;
  readonly #store: DurableJsonTransactionStore;
  readonly #failuresBeforeSuccess: number;
  #calls = 0;

  constructor(options: { tenantId: string; connector: string; actor: TenantActorContext; store: DurableJsonTransactionStore; failuresBeforeSuccess?: number }) {
    this.#tenantId = options.tenantId;
    this.#connector = options.connector;
    this.#actor = options.actor;
    this.#store = options.store;
    this.#failuresBeforeSuccess = options.failuresBeforeSuccess ?? 0;
  }

  get calls(): number { return this.#calls; }

  async execute(request: ExternalActionRequest): Promise<ExternalActionEffectResult> {
    this.#calls += 1;
    if (this.#calls <= this.#failuresBeforeSuccess) throw new Error("synthetic transient connector failure");
    const payloadHash = hashCanonical(request.payload);
    const idempotencyKey = hashCanonical({ tenantId: this.#tenantId, connector: this.#connector, runId: request.runId, actionId: request.actionId, approvalEpoch: request.approvalEpoch, payloadHash });
    const record: ShadowEffectRecord = {
      idempotencyKey,
      tenantId: this.#tenantId,
      connector: this.#connector,
      actionId: request.actionId,
      payloadHash,
      status: "shadowed",
      createdAt: new Date().toISOString(),
      providerReceiptId: `shadow:${idempotencyKey.slice(0, 24)}`,
    };
    await this.#store.recordShadowEffect(record, this.#actor);
    return { summary: `Shadowed ${this.#connector} action ${request.actionId}`, providerReceiptId: record.providerReceiptId, artifactUrl: `shadow://${this.#connector}/${record.providerReceiptId}` };
  }
}

export interface RetryPolicy { maxAttempts: number; timeoutMs: number; baseDelayMs: number; }

export async function executeAuthorizedDurableAction(options: {
  state: LivingSurfaceState;
  request: AuthorizedActionRequest;
  connector: ExternalActionExecutor;
  store: DurableJsonTransactionStore;
  retry: RetryPolicy;
}): Promise<{ receipt: ImmutableActionReceipt; state: LivingSurfaceState; replayed: boolean; attempts: number; decision: AuthorizationDecision }> {
  const decision = authorizeAction(options.request);
  if (!decision.allowed) throw new Error(`authorization denied: ${decision.reasons.join("; ")}`);
  const leaseKey = `effect:${options.request.tenantId}:${options.request.runId}:${options.request.actionId}:${options.request.approvalEpoch}`;
  const ownerId = `${options.request.actor.actorId}:${randomUUID()}`;
  await options.store.acquireLease(leaseKey, ownerId, options.retry.timeoutMs * 2);
  try {
    let lastError: unknown;
    for (let attempt = 1; attempt <= options.retry.maxAttempts; attempt += 1) {
      try {
        const result = await withTimeout(
          executeApprovedSurfaceAction(options.state, options.request, options.connector, options.store),
          options.retry.timeoutMs,
          `connector attempt ${attempt} timed out`,
        );
        return { ...result, attempts: attempt, decision };
      } catch (error) {
        lastError = error;
        if (attempt < options.retry.maxAttempts) await delay(options.retry.baseDelayMs * 2 ** (attempt - 1));
      }
    }
    throw lastError instanceof Error ? lastError : new Error(String(lastError));
  } finally { await options.store.releaseLease(leaseKey, ownerId); }
}

export async function runDurableSemanticGeneration(options: {
  input: SemanticGenerationInput;
  provider: SemanticProposalProvider;
  store: DurableJsonTransactionStore;
  actor: TenantActorContext;
  maxAttempts: number;
}): Promise<SemanticGenerationResult> {
  const key = `${options.actor.tenantId}:${options.input.runId}`;
  const checkpoint = await options.store.loadCheckpoint(key);
  const result = await runSemanticGeneration(options.input, options.provider, { maxAttempts: options.maxAttempts, ...(checkpoint ? { checkpoint } : {}) });
  await options.store.saveCheckpoint(key, result.checkpoint, options.actor);
  return result;
}

export function compileDeterministicPostEffectSurface(state: LivingSurfaceState, receipt: ImmutableActionReceipt) {
  const completed = applyReceipt(state, receipt);
  const operator = compileLivingSurface(completed, "operator");
  return { state: completed, operator, receiptHash: receipt.receiptHash, projectionHash: operator.buildHash };
}

function emptyState(): DurablePilotState { return { schemaVersion: 1, revision: 0, checkpoints: {}, receipts: {}, leases: {}, shadowEffects: {}, audit: [] }; }
function validateState(value: unknown): DurablePilotState { const state = value as DurablePilotState; if (!state || state.schemaVersion !== 1 || !Number.isInteger(state.revision) || state.revision < 0) throw new Error("invalid durable state"); return state; }
function assertActor(actor: TenantActorContext): void { if (!actor.tenantId.trim() || !actor.actorId.trim()) throw new Error("tenantId and actorId are required"); if (Number.isNaN(Date.parse(actor.authenticatedAt))) throw new Error("authenticatedAt must be a date"); }
function extractCompatibleContent(envelope: Record<string, unknown>): unknown { const choices = envelope.choices as Array<Record<string, unknown>> | undefined; const message = choices?.[0]?.message as Record<string, unknown> | undefined; const content = message?.content ?? envelope.output; if (content === undefined) throw new Error("GLM response has no structured content"); return content; }
function asRecord(value: unknown): Record<string, unknown> { return value && typeof value === "object" ? value as Record<string, unknown> : {}; }
function numberOrZero(value: unknown): number { return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : 0; }
function hashCanonical(value: unknown): string { return createHash("sha256").update(JSON.stringify(value)).digest("hex"); }
function delay(ms: number): Promise<void> { return new Promise((resolvePromise) => setTimeout(resolvePromise, ms)); }
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> { const controller = new AbortController(); const timeout = new Promise<never>((_, reject) => { const id = setTimeout(() => { controller.abort(); reject(new Error(message)); }, timeoutMs); controller.signal.addEventListener("abort", () => clearTimeout(id), { once: true }); }); try { return await Promise.race([promise, timeout]); } finally { controller.abort(); } }
