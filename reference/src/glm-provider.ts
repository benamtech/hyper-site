import { sha256 } from "./core.js";
import { buildValidationReport, finding, type ValidationAttribute, type ValidationReport } from "./validation-contracts.js";

export type PhysicalGenerationStage = "stage-1-ontology" | "stage-2-page-batch" | "stage-3-review-repair";

export type JsonSchema = Readonly<Record<string, unknown>>;

export interface StructuredGenerationRequest {
  id: string;
  stage: PhysicalGenerationStage;
  systemPrompt: string;
  userPrompt: string;
  schemaName: string;
  schema: JsonSchema;
  sourceIds: readonly string[];
  temperature?: number;
  topP?: number;
  maximumOutputTokens?: number;
}

export interface StructuredGenerationUsage {
  promptTokens: number;
  completionTokens: number;
  cachedTokens: number;
  totalTokens: number;
}

export interface StructuredTransportResponse {
  requestId: string;
  model: string;
  content: string;
  reasoningContent?: string;
  finishReason: string;
  usage: StructuredGenerationUsage;
}

export interface StructuredModelTransport {
  id: string;
  complete(request: StructuredGenerationRequest, repairContext?: string): Promise<StructuredTransportResponse>;
}

export interface ZaiGlmProviderConfig {
  apiKey: string;
  model?: string;
  baseUrl?: string;
  timeoutMilliseconds?: number;
  maximumRepairAttempts?: number;
  defaultTemperature?: number;
  defaultTopP?: number;
  defaultMaximumOutputTokens?: number;
}

export interface StructuredGenerationResult<T> {
  requestId: string;
  stage: PhysicalGenerationStage;
  model: string;
  value: T;
  attempts: number;
  responseHashes: readonly string[];
  usage: StructuredGenerationUsage;
  validation: ValidationReport;
  resultHash: string;
}

export const GLM_PROVIDER_VALIDATION: readonly ValidationAttribute[] = [
  {
    id: "provider.transport",
    feature: "GLM-5.2 provider transport",
    workflowStep: "generate",
    algorithmChoice: "Z.AI OpenAI-style chat-completions endpoint with bounded timeout",
    userEffect: "the operator can connect one API key without provider state becoming framework truth",
    developerEffect: "provider transport is replaceable and testable",
    validationVector: ["transport ID", "request ID", "model", "finish reason"],
    passVector: ["one bounded response returned"],
    failVector: ["missing response", "unbounded request", "anonymous provider"],
    simplerBaseline: "inline fetch call in an agent prompt",
    severity: "hard",
  },
  {
    id: "provider.json",
    feature: "JSON-mode transport safety",
    workflowStep: "decode",
    algorithmChoice: "JSON object response mode plus strict local parsing",
    userEffect: "invalid prose cannot silently enter the compiler",
    developerEffect: "parsing failures are explicit and replayable",
    validationVector: ["valid JSON object", "response hash"],
    passVector: ["JSON parses exactly"],
    failVector: ["markdown-only response", "truncated JSON", "non-object root"],
    simplerBaseline: "regex extraction from free-form prose",
    severity: "hard",
  },
  {
    id: "provider.schema",
    feature: "Client-side schema and semantic contract",
    workflowStep: "validate",
    algorithmChoice: "external validator independent of model self-critique",
    userEffect: "the model cannot approve its own malformed ontology or page batch",
    developerEffect: "server JSON mode is not mistaken for arbitrary JSON-Schema enforcement",
    validationVector: ["schema name", "external validator", "bounded error list"],
    passVector: ["validator returns no errors"],
    failVector: ["missing required fields", "unknown references", "model declares itself valid"],
    simplerBaseline: "trust response_format=json_object",
    severity: "hard",
  },
  {
    id: "provider.repair",
    feature: "Bounded structured repair",
    workflowStep: "repair-or-reject",
    algorithmChoice: "exact parse and validation errors returned for a finite number of retries",
    userEffect: "failed output is repaired once or rejected instead of looping indefinitely",
    developerEffect: "retry cost and state are deterministic",
    validationVector: ["attempt count", "maximum repair attempts", "response hashes"],
    passVector: ["accepted within budget"],
    failVector: ["repair budget exhausted", "unbounded reflection loop"],
    simplerBaseline: "retry until valid",
    severity: "hard",
  },
  {
    id: "provider.sources",
    feature: "Declared source boundary",
    workflowStep: "prompt-assembly",
    algorithmChoice: "stable source IDs included in every physical model request",
    userEffect: "generated output remains tied to approved project material",
    developerEffect: "source usage can be audited independently of prompt history",
    validationVector: ["non-empty unique source IDs"],
    passVector: ["all request source IDs are explicit"],
    failVector: ["source-free request", "duplicate or blank source IDs"],
    simplerBaseline: "paste sources into a conversation",
    severity: "hard",
  },
];

export class ZaiGlmProvider {
  readonly id: string;
  readonly model: string;
  readonly maximumRepairAttempts: number;
  private readonly transport: StructuredModelTransport;

  constructor(config: ZaiGlmProviderConfig, transport?: StructuredModelTransport) {
    if (!config.apiKey.trim() && !transport) throw new Error("Z.AI API key is required when no test transport is supplied");
    this.model = config.model?.trim() || "glm-5.2";
    this.maximumRepairAttempts = config.maximumRepairAttempts ?? 1;
    if (!Number.isInteger(this.maximumRepairAttempts) || this.maximumRepairAttempts < 0 || this.maximumRepairAttempts > 3) {
      throw new Error("maximumRepairAttempts must be an integer between 0 and 3");
    }
    this.transport = transport ?? createFetchTransport({
      apiKey: config.apiKey,
      model: this.model,
      baseUrl: config.baseUrl?.trim() || "https://api.z.ai/api/paas/v4",
      timeoutMilliseconds: config.timeoutMilliseconds ?? 120_000,
      defaultTemperature: config.defaultTemperature ?? 0.2,
      defaultTopP: config.defaultTopP ?? 0.9,
      defaultMaximumOutputTokens: config.defaultMaximumOutputTokens ?? 32_768,
    });
    this.id = `zai-glm:${this.model}:${this.transport.id}`;
  }

  async generate<T>(
    request: StructuredGenerationRequest,
    validate: (value: unknown) => readonly string[],
  ): Promise<StructuredGenerationResult<T>> {
    validateRequest(request);
    const responseHashes: string[] = [];
    let repairContext: string | undefined;
    let usage = emptyUsage();
    let latestRequestId = "";
    let latestModel = this.model;
    for (let attempt = 0; attempt <= this.maximumRepairAttempts; attempt += 1) {
      const response = await this.transport.complete(request, repairContext);
      latestRequestId = response.requestId;
      latestModel = response.model;
      usage = addUsage(usage, response.usage);
      responseHashes.push(sha256(response.content));
      const parsed = parseJsonObject(response.content);
      const errors = parsed.errors.length > 0 ? parsed.errors : [...validate(parsed.value)];
      if (errors.length === 0) {
        const attempts = attempt + 1;
        const validation = buildValidationReport(`provider:${request.id}`, GLM_PROVIDER_VALIDATION, [
          finding("provider.transport", "pass", `${this.transport.id} returned ${response.finishReason || "unknown finish reason"}`),
          finding("provider.json", "pass", `response ${responseHashes[responseHashes.length - 1]} parsed as a JSON object`),
          finding("provider.schema", "pass", `${request.schemaName} passed external validation`),
          finding("provider.repair", "pass", `${attempts} attempt(s) used from budget ${this.maximumRepairAttempts + 1}`),
          finding("provider.sources", "pass", `${request.sourceIds.length} declared source IDs`),
        ]);
        const canonical = {
          requestId: latestRequestId,
          stage: request.stage,
          model: latestModel,
          value: parsed.value,
          attempts,
          responseHashes,
          usage,
          validationHash: validation.reportHash,
        };
        return { ...canonical, value: parsed.value as T, validation, resultHash: sha256(JSON.stringify(canonical)) };
      }
      if (attempt >= this.maximumRepairAttempts) {
        throw new Error(`structured generation rejected for ${request.id}: ${errors.join("; ")}`);
      }
      repairContext = buildRepairContext(request, response.content, errors);
    }
    throw new Error(`structured generation rejected for ${request.id}`);
  }
}

interface FetchTransportConfig {
  apiKey: string;
  model: string;
  baseUrl: string;
  timeoutMilliseconds: number;
  defaultTemperature: number;
  defaultTopP: number;
  defaultMaximumOutputTokens: number;
}

function createFetchTransport(config: FetchTransportConfig): StructuredModelTransport {
  if (!config.apiKey.trim()) throw new Error("Z.AI API key is required");
  if (!Number.isFinite(config.timeoutMilliseconds) || config.timeoutMilliseconds <= 0) throw new Error("provider timeout must be positive");
  return {
    id: `zai-chat-completions:${config.baseUrl}`,
    async complete(request, repairContext) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), config.timeoutMilliseconds);
      try {
        const response = await fetch(`${config.baseUrl.replace(/\/$/, "")}/chat/completions`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${config.apiKey}`,
            "Content-Type": "application/json",
            "Accept-Language": "en-US,en",
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: config.model,
            messages: [
              { role: "system", content: request.systemPrompt },
              {
                role: "user",
                content: repairContext
                  ? `${request.userPrompt}\n\n${repairContext}`
                  : `${request.userPrompt}\n\nReturn one JSON object matching schema ${request.schemaName}:\n${JSON.stringify(request.schema)}`,
              },
            ],
            temperature: request.temperature ?? config.defaultTemperature,
            top_p: request.topP ?? config.defaultTopP,
            max_tokens: request.maximumOutputTokens ?? config.defaultMaximumOutputTokens,
            response_format: { type: "json_object" },
            stream: false,
          }),
        });
        const text = await response.text();
        if (!response.ok) throw new Error(`Z.AI request failed (${response.status}): ${text.slice(0, 500)}`);
        const payload = JSON.parse(text) as {
          id?: string;
          request_id?: string;
          model?: string;
          choices?: Array<{ message?: { content?: string; reasoning_content?: string }; finish_reason?: string }>;
          usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number; prompt_tokens_details?: { cached_tokens?: number } };
        };
        const choice = payload.choices?.[0];
        const content = choice?.message?.content;
        if (!content) throw new Error("Z.AI response did not contain assistant content");
        return {
          requestId: payload.request_id ?? payload.id ?? sha256(text).slice(0, 24),
          model: payload.model ?? config.model,
          content,
          ...(choice?.message?.reasoning_content ? { reasoningContent: choice.message.reasoning_content } : {}),
          finishReason: choice?.finish_reason ?? "unknown",
          usage: {
            promptTokens: payload.usage?.prompt_tokens ?? 0,
            completionTokens: payload.usage?.completion_tokens ?? 0,
            cachedTokens: payload.usage?.prompt_tokens_details?.cached_tokens ?? 0,
            totalTokens: payload.usage?.total_tokens ?? 0,
          },
        };
      } finally {
        clearTimeout(timeout);
      }
    },
  };
}

function validateRequest(request: StructuredGenerationRequest): void {
  if (!request.id.trim() || !request.systemPrompt.trim() || !request.userPrompt.trim()) throw new Error("structured request requires identity and prompts");
  if (!request.schemaName.trim() || !request.schema || typeof request.schema !== "object") throw new Error("structured request requires a named schema");
  const sourceIds = request.sourceIds.map((item) => item.trim());
  if (sourceIds.length === 0 || sourceIds.some((item) => !item) || new Set(sourceIds).size !== sourceIds.length) throw new Error("structured request requires unique non-empty source IDs");
}

function parseJsonObject(content: string): { value: unknown; errors: string[] } {
  const trimmed = content.trim();
  const withoutFence = trimmed.startsWith("```")
    ? trimmed.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "")
    : trimmed;
  try {
    const value = JSON.parse(withoutFence) as unknown;
    if (!value || typeof value !== "object" || Array.isArray(value)) return { value, errors: ["response root must be a JSON object"] };
    return { value, errors: [] };
  } catch (error) {
    return { value: null, errors: [`invalid JSON: ${error instanceof Error ? error.message : String(error)}`] };
  }
}

function buildRepairContext(request: StructuredGenerationRequest, priorOutput: string, errors: readonly string[]): string {
  return [
    "The prior output was rejected by an external deterministic validator.",
    `Schema: ${request.schemaName}`,
    `Errors: ${errors.join(" | ")}`,
    `Required JSON Schema: ${JSON.stringify(request.schema)}`,
    `Rejected output: ${priorOutput}`,
    "Return a corrected JSON object only. Do not claim that it is valid; the external validator decides.",
  ].join("\n");
}

function emptyUsage(): StructuredGenerationUsage {
  return { promptTokens: 0, completionTokens: 0, cachedTokens: 0, totalTokens: 0 };
}

function addUsage(left: StructuredGenerationUsage, right: StructuredGenerationUsage): StructuredGenerationUsage {
  return {
    promptTokens: left.promptTokens + right.promptTokens,
    completionTokens: left.completionTokens + right.completionTokens,
    cachedTokens: left.cachedTokens + right.cachedTokens,
    totalTokens: left.totalTokens + right.totalTokens,
  };
}
