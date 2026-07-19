import {
  DEFAULT_PRODUCTION_CORPUS_POLICY,
  commitPageDraftTransaction,
  compileApprovedDesignAuthority,
  createDesignApproval,
  hash32,
  prepareAgentSiteProgram,
  validateProductionCorpus,
} from "../dist/index.js";
import { createScaleAgentSiteFixture } from "../fixtures/agent-site-fixture.mjs";

export const GENERATED_AT = "2026-07-18T07:00:00Z";

export function createApprovedDesign(project, options = {}) {
  const draft = {
    id: `design:${project.input.id}`,
    version: options.version ?? "1",
    brandName: project.input.brand.name,
    generatedBy: options.generatedBy ?? "design-generator:fixture",
    sourceIds: [project.sourceLedger[0].id],
    palette: {
      ink: "#111111", canvas: "#F7F9FC", surface: "#FFFFFF",
      primary: options.primary ?? "#2563EB", secondary: "#E11D2A", accent: "#DFF6FF", success: "#168A57",
    },
    typography: {
      bodyStack: "Inter, ui-sans-serif, system-ui, sans-serif",
      headingStack: "Inter, ui-sans-serif, system-ui, sans-serif",
      monoStack: "ui-monospace, SFMono-Regular, Menlo, monospace",
    },
    visualRules: ["clear hierarchy", "light surfaces", "restrained motion", "strong mobile composition"],
    componentRules: ["semantic modules", "one shared stylesheet", "conversion path remains visible"],
    prohibitedPatterns: ["decorative dashboards", "generic gradient hero", "runtime-only canonical content"],
    corePageBriefs: [{
      id: "core:home", route: "/",
      purpose: "Explain the primary offer and move a qualified operator into the main conversion path.",
      preferredArchetype: "workflow-led",
      requiredModuleKinds: ["hero", "answer", "proof", "cta"],
      notes: ["design the core site before landing-page expansion"],
    }],
    ...(options.customCss === undefined ? {} : { customCss: options.customCss }),
  };
  const approval = createDesignApproval(draft, {
    reviewerId: options.reviewerId ?? "operator:fixture",
    reviewerClass: "human",
    decision: "approved",
    approvedAt: GENERATED_AT,
    notes: ["approved fixture design"],
  });
  return compileApprovedDesignAuthority(draft, approval, new Set(project.sourceLedger.map((item) => item.id)));
}

export function buildDrafts(jobs, designAuthorityHash, scope = "fixture") {
  return jobs.map((job, index) => {
    const ordinal = String(index + 1).padStart(5, "0");
    const fingerprint = job.jobHash.slice(0, 20);
    const namespace = `${slug(scope)}-${slug(job.id)}-${ordinal}`;
    const pageId = `page:${namespace}`;
    const labels = job.attributes.map((item) => item.label).join(", ");
    const claimId = `claim:${namespace}`;
    const informationId = `information:${namespace}`;
    const utilityId = `utility:${namespace}`;
    const sourceIds = [...job.sourceIds];
    const evidenceIds = [...job.evidenceIds];
    const common = ["semantic-hierarchy", "responsive-grid", "mobile-priority", "reduced-motion"];
    const identity = `job ${fingerprint}, scenario ${ordinal}`;
    return {
      jobId: job.id,
      pageId,
      route: `/research/${slug(scope)}/${slug(job.id)}-${ordinal}`,
      canonicalQuestion: `What is the evidence-bounded operating path for ${labels} in ${identity}?`,
      intent: `evaluate-${fingerprint}-${ordinal}`,
      title: `Scenario ${ordinal} · ${fingerprint} · ${labels}`,
      description: `A source-bounded operating guide for ${identity}, covering ${labels} without invented proof or pricing.`,
      expressedAttributeIds: job.attributes.map((item) => item.id),
      evidenceIds,
      sourceIds,
      claims: [{
        id: claimId,
        text: `The operating boundary for ${identity} is limited to the declared ledger for ${labels}.`,
        evidenceIds,
        requiredLevel: 1,
      }],
      informationObjects: [{
        id: informationId,
        kind: "field-note",
        title: `Decision record ${fingerprint}`,
        body: `Use ${identity} and its selected attributes to distinguish this answer from neighboring jobs while preserving business constraints.`,
        evidenceIds,
      }],
      utilityTasks: [{
        id: utilityId,
        title: `Operator checklist ${fingerprint}`,
        body: `Confirm source coverage, review the output, and approve the next action for ${identity}.`,
        evidenceIds,
      }],
      conversionPathId: "conversion:primary",
      modules: [
        module(`${namespace}:hero`, "hero", "lead", `A bounded path for ${identity}`, `This page answers one specific operating question for ${labels} and ${identity}.`, [], [], common, sourceIds),
        module(`${namespace}:answer`, "answer", "support", "What changes in this scenario", `The selected region changes the workflow, vocabulary, evidence emphasis, or conversion path for ${identity}.`, [claimId], [informationId], [...common, "long-form-reading", "structured-data-visible"], sourceIds),
        module(`${namespace}:proof`, "proof", "proof", "Evidence boundary", `No claim for ${identity} may exceed the supplied evidence ledger.`, [claimId], [], [...common, "evidence-dense", "progressive-disclosure", "structured-data-visible"], sourceIds),
        module(`${namespace}:cta`, "cta", "conversion", "Review the next action", `Use the approved conversion path only after reviewing ${identity}.`, [], [], [...common, "conversion-panel"], sourceIds),
      ],
      internalPageIds: [],
      commercialValue: 1,
      lifecycleCost: 1,
      designAuthorityHash,
    };
  });
}

export function createFixtureEmbeddingBackend(dimensions = 64) {
  return {
    id: `fixture-local-embedding-${dimensions}`,
    async embed(texts) {
      return texts.map((text) => {
        const vector = new Float32Array(dimensions);
        let state = hash32(text) || 0x9e3779b9;
        for (let index = 0; index < dimensions; index += 1) {
          state ^= state << 13;
          state ^= state >>> 17;
          state ^= state << 5;
          state >>>= 0;
          vector[index] = (state & 1) === 0 ? -1 : 1;
        }
        return vector;
      });
    },
  };
}

export function permissiveProductionPolicy(overrides = {}) {
  return {
    ...DEFAULT_PRODUCTION_CORPUS_POLICY,
    lexicalDuplicateThreshold: 0.999999,
    semanticDuplicateThreshold: 0.999999,
    maximumPostingSize: 256,
    maximumCandidatesPerPage: 48,
    ...overrides,
  };
}

export async function compileSyntheticCohort(targetPages) {
  const fixture = createScaleAgentSiteFixture(targetPages);
  const prepared = prepareAgentSiteProgram(fixture);
  const design = createApprovedDesign(prepared.project, { version: `scale-${targetPages}` });
  const drafts = buildDrafts(prepared.siteGenerationPlan.pageConceptJobs, design.authorityHash, `scale-${targetPages}`);
  const transaction = commitPageDraftTransaction({
    project: prepared.project,
    ontology: prepared.ontology,
    plan: prepared.siteGenerationPlan,
    drafts,
    design,
    baseUrl: `https://scale-${targetPages}.example.com`,
  });
  const corpus = await validateProductionCorpus(transaction, createFixtureEmbeddingBackend(), permissiveProductionPolicy());
  return { fixture, prepared, design, drafts, transaction, corpus };
}

function module(suffix, kind, layoutRole, heading, body, claimIds, informationObjectIds, requiredCapabilities, sourceIds) {
  return { id: `module:${suffix}`, kind, layoutRole, heading, body, claimIds, informationObjectIds, requiredCapabilities, sourceIds };
}

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
