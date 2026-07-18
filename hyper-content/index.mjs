// Hyper Content owns the content compiler and targets the public Hyper Site
// contract. The remaining reference/dist exports are an explicit compatibility
// bridge until P1.5 physically migrates the legacy content compiler.

export * from "../hyper-site/index.mjs";
export { adaptContentProgramSiteSource } from "./dist/content-program-adapter.js";
export { compileSite, compileSite as compileContentSite, packSite } from "../reference/dist/framework.js";
export { compileContentProgramManifest } from "../reference/dist/content-program-adapter.js";

export * from "../reference/dist/benchmark.js";
export * from "../reference/dist/optimizer.js";
export * from "../reference/dist/csi.js";
export * from "../reference/dist/distribution.js";
export * from "../reference/dist/generator.js";
export * from "../reference/dist/wasm.js";
export * from "../reference/dist/resolver.js";
export * from "../reference/dist/manifest.js";
export * from "../reference/dist/agent-harness.js";
export * from "../reference/dist/validation-contracts.js";
export * from "../reference/dist/project-input.js";
export * from "../reference/dist/repository-ingestion.js";
export * from "../reference/dist/context-corpus.js";
export * from "../reference/dist/typed-graph.js";
export * from "../reference/dist/page-coordinate.js";
export * from "../reference/dist/corpus-plan.js";
export * from "../reference/dist/page-generation.js";
export * from "../reference/dist/framework-preview.js";
export * from "../reference/dist/framework-orchestrator.js";
export * from "../reference/dist/sparse-lexical.js";
export * from "../reference/dist/ontology-discovery.js";
export * from "../reference/dist/ontology-graph.js";
export * from "../reference/dist/opportunity-space.js";
export * from "../reference/dist/opportunity-generation-optimized.js";
export * from "../reference/dist/opportunity-space-optimized.js";
export * from "../reference/dist/opportunity-space-production.js";
export * from "../reference/dist/site-program.js";
export * from "../reference/dist/site-program-optimized.js";
export * from "../reference/dist/acceleration-decision.js";
export * from "../reference/dist/agent-site-orchestrator.js";
export * from "../reference/dist/appliance-contract.js";
export * from "../reference/dist/glm-provider.js";
export * from "../reference/dist/generation-schemas.js";
export * from "../reference/dist/design-authoring.js";
export * from "../reference/dist/page-draft-transaction.js";
export * from "../reference/dist/corpus-validation-production.js";
export * from "../reference/dist/production-orchestrator.js";
export * from "../reference/dist/near-alpha-framework.js";
export * from "../reference/dist/agent-workspace.js";
export * from "../reference/dist/near-alpha-release.js";
export * from "../reference/dist/pcn-emitter.js";
export * from "../reference/dist/articleir-parser.js";
export * from "../reference/dist/unfolder.js";
export * from "../reference/dist/page-backend.js";
