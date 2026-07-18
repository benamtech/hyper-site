# Hyper Monorepo Durable Memory

format: TOON-oriented Markdown  
status: active  
scope: standalone repository root  
updated_at: 2026-07-18T05:30:00-04:00

## protocol

memory_model{index,handoffs,mutation}:
  "memory/MEMORY.md","memory/YYYY-MM-DD-HHMM-<slug>.md","append immutable handoff; reconcile index; never overwrite timestamped files"

rules[12]:
  read-MEMORY-first
  read-newest-handoff-next
  timestamped-handoffs-immutable
  source-tests-artifacts-over-docs
  two-products-one-publication-target
  hyper-content-depends-on-hyper-site-only
  no-invented-business-truth
  no-same-model-self-acceptance
  bounded-repair-or-reject
  synthetic-scale-is-not-framework-quality
  content-pipeline-timing-is-not-framework-timing
  ordinary-framework-and-real-case-gates-before-alpha

## current

state{branch,pr,status,maturity,merge}:
  agent/glm-blackwell-vertical-slice,3,"root hyper-site/hyper-content package boundaries plus PCN/ArticleIR backend implemented; exact CI green; physical source extraction and real cases pending","research prototype approaching near-alpha","keep draft; do not merge"

product_identity:
  "two products in one monorepo: hyper-site static web framework; hyper-content ontology/evidence/content compiler targeting hyper-site"

dependency_direction:
  "hyper-content -> hyper-site; reverse dependency prohibited"

compatibility_path:
  "hyper-content facade -> hyper-site facade -> reference/dist/framework.js; one canonical publication authority during migration"

content_backend:
  "approved compiler state -> deterministic PCN -> LLM prose backend -> external ArticleIR acceptance -> deterministic unfolder -> hyper-site"

continuous_agent:
  "repeated explicit checkpointed invocations over versioned artifacts; never opaque perpetual loop or automatic publication"

## newest handoffs

handoffs[7]{at,file,status,scope}:
  2026-07-18T05:30:00-04:00,2026-07-18-0530-product-boundary-folder-split.md,current,"research-supported two-product decision, root folders, boundary tests, PCN backend classification, exact CI"
  2026-07-18T04:00:00-04:00,2026-07-18-0400-near-alpha-framework-reframe.md,superseded-product-framing,"maturity reset, continuous workspace, strict release gate, ordinary-framework and 10K maintenance requirements"
  2026-07-18T03:30:00-04:00,2026-07-18-0330-glm-blackwell-production-vertical-slice.md,historical-foundation,"provider/appliance/design/transaction/recovery and synthetic full emission; production maturity framing superseded"
  2026-07-18T02:05:00-04:00,2026-07-18-0205-repository-ingestion-boundary.md,foundation,"standalone repository ingestion"
  2026-07-18T01:15:00-04:00,2026-07-18-0115-graph-triage-ci-closure.md,foundation,"graph research disposition"
  2026-07-18T01:05:00-04:00,2026-07-18-0105-graph-learning-paper-triage.md,foundation,"learned graph promotion gates"
  2026-07-18T00:55:00-04:00,2026-07-18-0055-academic-crosswalk-harness-acceleration.md,foundation,"academic crosswalk and harness"

## authority

read_order[17]{order,file,role}:
  1,../identity.md,"two-product architect identity"
  2,../AGENTS.md,"product boundary and scientific operating contract"
  3,../CODEGRAPH.md,"separate framework/content code graphs and migration map"
  4,../README.md,"current monorepo product, maturity, and gates"
  5,../29-product-boundary-research-and-root-folder-split.md,"research, falsification, classification, and folder decision"
  6,MEMORY.md,"durable current state"
  7,2026-07-18-0530-product-boundary-folder-split.md,"latest immutable handoff"
  8,../validation/reports/2026-07-18-product-boundary-folder-split.md,"exact boundary and regression proof"
  9,../hyper-site/README.md,"framework public ownership"
  10,../hyper-content/README.md,"content compiler public ownership"
  11,../27-near-alpha-framework-validation-and-continuous-agent-workspace.md,"inherited maturity and real-case gate"
  12,../28-agent-first-web-framework-and-llm-backend.md,"PCN/ArticleIR backend rationale; now hyper-content-owned"
  13,2026-07-18-0400-near-alpha-framework-reframe.md,"prior one-product framing; retain maturity evidence only"
  14,../26-graph-learning-paper-triage-and-promotion-gates.md,"content graph/network promotion gates"
  15,../25-academic-crosswalk-agent-harness-structured-generation-and-acceleration.md,"research crosswalk"
  16,../24-agent-discovered-ontology-and-10k-site-program.md,"content compiler and 10K experiment"
  17,../validation/reports/,"measured reports"

Standalone rule: former parent/subtree/source-repository paths are historical only, never live targets.

## source state

layers[25]{layer,file,state}:
  root-workspaces,../package.json,"hyper-site and hyper-content npm workspaces"
  boundary-gate,../scripts/check-product-boundaries.mjs,"one-way dependency and facade-surface assertions"
  hyper-site-facade,../hyper-site/index.mjs,"static compiler/browser/CSS public surface; compatibility delegation"
  hyper-site-test,../hyper-site/test/boundary.test.mjs,"content authority absent from framework surface"
  hyper-content-facade,../hyper-content/index.mjs,"framework target plus ontology/provider/PCN/ArticleIR/content public surface"
  hyper-content-test,../hyper-content/test/boundary.test.mjs,"content backend and framework target present"
  pcn,../reference/src/pcn-emitter.ts,"deterministic approved compiler state to Page Contract Notation"
  articleir,../reference/src/articleir-parser.ts,"strict external section/word/evidence/schema/link/pattern acceptance"
  unfolder,../reference/src/unfolder.ts,"deterministic Markdown/JSON-LD/HTML/sitemap lowering"
  page-backend,../reference/src/page-backend.ts,"provider batch dispatch over PCN and ArticleIR"
  maturity-evaluator,../reference/src/near-alpha-framework.ts,"legacy combined maturity and real-case validation"
  release-gate,../reference/src/near-alpha-release.ts,"complete non-synthetic case plus zero fail/pending required"
  workspace,../reference/src/agent-workspace.ts,"immutable snapshots, cycles, lifecycle, transitive invalidation"
  provider,../reference/src/glm-provider.ts,"Z.AI JSON mode + external validation + bounded repair"
  design,../reference/src/design-authoring.ts,"core briefs, design tokens, safe shared CSS, restyle invariant"
  repository-ingestion,../reference/src/repository-ingestion.ts,"explicit bytes/config/evidence; real operator snapshot pending"
  ontology-graph-opportunity,../reference/src/agent-site-orchestrator.ts,"hyper-content-owned governed compiler"
  transaction,../reference/src/page-draft-transaction.ts,"content drafts converge toward canonical SiteSource/PageIR"
  corpus,../reference/src/corpus-validation-production.ts,"hyper-content exact/lexical/local-semantic/evidence/render validation"
  recovery,../reference/src/production-orchestrator.ts,"dependency-bound generation checkpoints"
  publication,../reference/src/framework.ts,"legacy canonical static compiler; still mixed with vector packing"
  mixed-manifest,../reference/src/manifest.ts,"must split SiteManifest from ContentProgramManifest"
  current-wasm,../reference/src/wasm.ts,"vector/facility kernels; hyper-content-owned, not browser runtime"
  focused-ci,../.github/workflows/production-pipeline.yml,"product boundary, backend, operator, near-alpha tests"
  full-ci,../.github/workflows/reference.yml,"legacy full build/manifest/UI/browser/R3F suite"

## decisions

decisions[25]{id,decision,ref}:
  D01,"maturity is research prototype approaching near-alpha, not production",../AGENTS.md
  D02,"repository contains hyper-site and hyper-content as separate products",../29-product-boundary-research-and-root-folder-split.md
  D03,"hyper-content may depend on hyper-site; reverse dependency is forbidden",../scripts/check-product-boundaries.mjs
  D04,"root folders are public package boundaries while physical migration is staged",../README.md
  D05,"one canonical PageIR/renderer/publication path remains during migration",../CODEGRAPH.md
  D06,"current framework.ts vector packing is legacy coupling to extract",../29-product-boundary-research-and-root-folder-split.md
  D07,"current manifest.ts is primarily mixed content program state and must split",../29-product-boundary-research-and-root-folder-split.md
  D08,"current Wasm is content vector/facility math, not browser interactivity",../reference/src/wasm.ts
  D09,"validation-contracts is generic typed acceptance infrastructure",../reference/src/validation-contracts.ts
  D10,"exact competitor build constants require frozen local reproduction",../validation/reports/2026-07-18-product-boundary-folder-split.md
  D11,"PCN/ArticleIR/unfolder is hyper-content backend, not framework onboarding",../hyper-content/README.md
  D12,"content-pipeline timing is not hyper-site framework timing",../README.md
  D13,"10K is a hyper-content scale tier unless rendering is isolated",../AGENTS.md
  D14,"continuous agent means checkpointed workspace invocations",../reference/src/agent-workspace.ts
  D15,"strict release requires a complete real case and zero pending",../reference/src/near-alpha-release.ts
  D16,"ordinary framework baseline is mandatory for hyper-site",../AGENTS.md
  D17,"every generated page requires task, information/utility, evidence, neighbor difference, and owner",../reference/src/near-alpha-framework.ts
  D18,"network science is hyper-content research and requires held-out outcomes",../AGENTS.md
  D19,"repository config is explicit truth, not extraction",../reference/src/repository-ingestion.ts
  D20,"GLM JSON mode is transport structure, not semantic authority",../reference/src/glm-provider.ts
  D21,"same generator cannot approve ontology or design",../reference/src/generation-schemas.ts
  D22,"PageDrafts converge on the existing static compiler authority",../reference/src/page-draft-transaction.ts
  D23,"hardware price is soft observed metadata",../reference/src/appliance-contract.ts
  D24,"synthetic full emission is not relevance, framework, or commercial proof",../validation/reports/2026-07-18-near-alpha-framework-reframe.md
  D25,"PR #3 stays draft through physical extraction, publisher, real cases, and comparisons",../README.md

## proof

product_boundary_run{workflow,run,job,head,result,artifact_digest}:
  "Hyper Site Near-Alpha Pipeline",29639039474,88066298004,d2d5f2266198aa0e697e0ec480d4b971ef0c8169,success,"sha256:382db7d285b55ac6e4952234a4b3a7e5e5c60713231d17354a8b4b03b5636378"

product_boundary_steps:
  "reference TypeScript build; static dependency gate; hyper-site and hyper-content facade tests; operator checks; PCN backend tests; near-alpha and workspace suites"

reference_run{workflow,run,job,head,result}:
  "Hyper Site Reference",29639039488,88066297939,d2d5f2266198aa0e697e0ec480d4b971ef0c8169,success

reference_steps:
  "full tests; manifest; UI; orchestration; framework validate/preview; browser; R3F"

legacy_scale[3]{pages,elapsed_ms,candidates,html_bytes}:
  100,2724.549,3675,"recorded"
  500,3425.700,509,"recorded"
  10000,21867.767,12949,54291900

proof_interpretation:
  "root API/dependency separation and no legacy regression; synthetic legacy scale remains hyper-content plus deterministic-output evidence, not isolated framework proof"

## not proven

not_proven[18]:
  physical-source-extraction
  site-manifest-content-program-manifest-split
  vector-free-hyper-site-compiler
  create-project-command
  dev-server-or-hmr
  publisher-or-deploy-command
  real-five-page-hyper-site-case
  ordinary-framework-comparison
  live-pcn-articleir-provider-case
  real-gpu-throughput
  browser-wasm-value
  real-design-typography-layout-graphics-quality
  continuous-operation-beyond-file-snapshots
  real-page-relevance-information-gain-accessibility
  useful-indexable-content-cohort
  indexing-ranking-citations
  conversion-revenue-lifecycle-return
  actual-near-alpha-release

## next

next[10]{order,task,gate}:
  1,"split SiteManifest from ContentProgramManifest","no site package content-vector/provider fields"
  2,"remove vector/prototype packing from hyper-site compileSite","same static HTML and sitemap with no content imports"
  3,"extract content-neutral UI contracts","framework scaffold/renderer no mixed manifest dependency"
  4,"add create/dev/build/deploy framework surface","ordinary developer can build a small site without content concepts"
  5,"add one static publisher adapter","repeatable deploy and rollback"
  6,"build real five-page hyper-site-only fixture","approved design/assets/accessibility and operator record"
  7,"run ordinary-framework comparison","same pages/assets/machine/cache/output"
  8,"run live hyper-content PCN/ArticleIR case into same target","tokens/cost/latency/repair/evidence report"
  9,"extend to 25 real noindex pages","page-existence records and held-out judgments"
  10,"complete physical migration and decide alpha","remove reference compatibility layer; real cases; zero hard pending"
