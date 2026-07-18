import { DESIGN_CAPABILITIES, type DesignCapability } from "./benchmark.js";
import { sha256 } from "./core.js";
import {
  validateDesignSystemSuperset,
  type CompiledSite,
  type DesignSystemContract,
  type LayoutRole,
  type ModuleKind,
  type PageIR,
} from "./framework.js";
import { buildValidationReport, finding, type ValidationAttribute, type ValidationReport } from "./validation-contracts.js";

export interface CorePageDesignBrief {
  id: string;
  route: string;
  purpose: string;
  preferredArchetype: "editorial" | "workflow-led" | "proof-led" | "comparison-led" | "utility-led";
  requiredModuleKinds: readonly ModuleKind[];
  notes: readonly string[];
}

export interface DesignAuthorityDraft {
  id: string;
  version: string;
  brandName: string;
  generatedBy: string;
  sourceIds: readonly string[];
  palette: Readonly<Record<"ink" | "canvas" | "surface" | "primary" | "secondary" | "accent" | "success", string>>;
  typography: {
    bodyStack: string;
    headingStack: string;
    monoStack: string;
  };
  visualRules: readonly string[];
  componentRules: readonly string[];
  prohibitedPatterns: readonly string[];
  corePageBriefs: readonly CorePageDesignBrief[];
  customCss?: string;
}

export interface DesignApprovalRecord {
  designDraftHash: string;
  reviewerId: string;
  reviewerClass: "human" | "independent-model";
  decision: "approved" | "rejected";
  approvedAt: string;
  notes: readonly string[];
  approvalHash: string;
}

export interface ApprovedDesignAuthority extends DesignAuthorityDraft {
  sourceIds: readonly string[];
  visualRules: readonly string[];
  componentRules: readonly string[];
  prohibitedPatterns: readonly string[];
  corePageBriefs: readonly CorePageDesignBrief[];
  designContract: DesignSystemContract;
  css: string;
  cssHash: string;
  draftHash: string;
  approval: DesignApprovalRecord;
  authorityHash: string;
  validation: ValidationReport;
}

export interface RenderedDesignPage {
  pageId: string;
  route: string;
  html: string;
  htmlHash: string;
  canonicalContentHash: string;
}

export interface RenderedDesignSite {
  authorityId: string;
  authorityHash: string;
  sourceBuildHash: string;
  cssPath: "/assets/hyper-site.css";
  css: string;
  cssHash: string;
  pages: readonly RenderedDesignPage[];
  siteHash: string;
  validation: ValidationReport;
}

export const DESIGN_AUTHORITY_VALIDATION: readonly ValidationAttribute[] = [
  {
    id: "design.provenance",
    feature: "Source-bound design authority",
    workflowStep: "design-before-generation",
    algorithmChoice: "versioned style authority with explicit source IDs",
    userEffect: "the operator can upload a style guide and know which design state governed the site",
    developerEffect: "brand and visual truth are not reconstructed from prompt history",
    validationVector: ["draft ID", "version", "generator", "source IDs", "stable hash"],
    passVector: ["all design sources resolve", "identity is stable"],
    failVector: ["anonymous design", "unknown style source", "unversioned restyle"],
    simplerBaseline: "one style prompt",
    severity: "hard",
  },
  {
    id: "design.approval",
    feature: "Independent design approval",
    workflowStep: "approve-design",
    algorithmChoice: "reviewer identity and exact draft-hash approval",
    userEffect: "the core site is not visually finalized by the same generator that proposed it",
    developerEffect: "design approval cannot drift to another draft",
    validationVector: ["draft hash", "reviewer identity", "reviewer class", "decision"],
    passVector: ["approved exact draft", "reviewer differs from generator"],
    failVector: ["self-approval", "stale approval", "rejected design"],
    simplerBaseline: "generator declares its design good",
    severity: "hard",
  },
  {
    id: "design.tokens",
    feature: "Deterministic visual token system",
    workflowStep: "compile-design",
    algorithmChoice: "validated palette, typography, spacing, type, radii, and content-width tokens",
    userEffect: "the core site and 10K-page corpus share one coherent visual system",
    developerEffect: "CSS is compiled rather than regenerated per page",
    validationVector: ["seven color roles", "font stacks", "design-system capabilities", "CSS hash"],
    passVector: ["valid colors", "complete component coverage", "bounded CSS"],
    failVector: ["missing token", "invalid color", "page-specific design drift"],
    simplerBaseline: "inline page styles",
    severity: "hard",
  },
  {
    id: "design.core-pages",
    feature: "Core-site design briefs",
    workflowStep: "design-before-bulk-pages",
    algorithmChoice: "explicit high-value page briefs before landing-page expansion",
    userEffect: "the product can create a strong homepage and core conversion pages, not only bulk landing pages",
    developerEffect: "bulk modules inherit a reviewed visual and interaction grammar",
    validationVector: ["unique routes", "purpose", "archetype", "module coverage"],
    passVector: ["at least one core brief", "every brief has required modules"],
    failVector: ["bulk pages exist without a designed core", "duplicate core route"],
    simplerBaseline: "generate landing pages first",
    severity: "hard",
  },
  {
    id: "design.css-safety",
    feature: "Static CSS safety boundary",
    workflowStep: "compile-design",
    algorithmChoice: "reject remote imports, scriptable URLs, HTML termination, and unbounded CSS",
    userEffect: "uploaded CSS guidance cannot inject executable or remote content into emitted pages",
    developerEffect: "custom styling remains static and reviewable",
    validationVector: ["forbidden patterns", "maximum bytes"],
    passVector: ["safe local CSS", "CSS <= 48 KB"],
    failVector: ["@import", "javascript URL", "style-tag escape", "oversized CSS"],
    simplerBaseline: "append uploaded CSS verbatim",
    severity: "hard",
  },
];

export const DESIGN_RENDER_VALIDATION: readonly ValidationAttribute[] = [
  {
    id: "design-render.satisfiability",
    feature: "PageIR design satisfiability",
    workflowStep: "render",
    algorithmChoice: "existing semantic module and capability superset check",
    userEffect: "every generated page can be expressed by the approved design system",
    developerEffect: "unsupported modules fail before static emission",
    validationVector: ["module kinds", "layout roles", "design capabilities"],
    passVector: ["no missing module or capability"],
    failVector: ["renderer lacks required component", "capability silently dropped"],
    simplerBaseline: "render best effort",
    severity: "hard",
  },
  {
    id: "design-render.static",
    feature: "Static attractive rendering",
    workflowStep: "render",
    algorithmChoice: "one shared stylesheet over canonical semantic PageIR",
    userEffect: "pages remain useful without client JavaScript while receiving a coherent visual system",
    developerEffect: "restyling changes CSS without regenerating page prose",
    validationVector: ["stylesheet link", "semantic module attributes", "page count", "hashes"],
    passVector: ["all pages rendered", "no inline scripts added", "shared CSS path"],
    failVector: ["missing page", "runtime-only content", "per-page CSS generation"],
    simplerBaseline: "neutral compiler HTML only",
    severity: "hard",
  },
  {
    id: "design-render.noindex",
    feature: "Research cohort index boundary",
    workflowStep: "render",
    algorithmChoice: "preserve canonical robots state from PageIR",
    userEffect: "preview pages cannot accidentally become indexable during design iteration",
    developerEffect: "design rendering cannot override publication authority",
    validationVector: ["robots metadata", "PageIR indexable flag"],
    passVector: ["noindex pages remain noindex"],
    failVector: ["renderer changes publication state"],
    simplerBaseline: "template controls robots",
    severity: "hard",
  },
];

export function hashDesignDraft(draft: DesignAuthorityDraft): string {
  return sha256(JSON.stringify(canonicalDraft(draft)));
}

export function createDesignApproval(
  draft: DesignAuthorityDraft,
  input: Omit<DesignApprovalRecord, "designDraftHash" | "approvalHash">,
): DesignApprovalRecord {
  const designDraftHash = hashDesignDraft(draft);
  const canonical = {
    designDraftHash,
    reviewerId: input.reviewerId.trim(),
    reviewerClass: input.reviewerClass,
    decision: input.decision,
    approvedAt: input.approvedAt.trim(),
    notes: sorted(input.notes),
  };
  if (!canonical.reviewerId || !canonical.approvedAt) throw new Error("design approval requires reviewer identity and timestamp");
  return { ...canonical, approvalHash: sha256(JSON.stringify(canonical)) };
}

export function compileApprovedDesignAuthority(
  draft: DesignAuthorityDraft,
  approval: DesignApprovalRecord,
  allowedSourceIds: ReadonlySet<string>,
): ApprovedDesignAuthority {
  const canonical = canonicalDraft(draft);
  const draftHash = sha256(JSON.stringify(canonical));
  for (const sourceId of canonical.sourceIds) if (!allowedSourceIds.has(sourceId)) throw new Error(`design references unknown source ${sourceId}`);
  if (approval.designDraftHash !== draftHash) throw new Error("design approval references a different draft hash");
  if (approval.decision !== "approved") throw new Error("design authority was not approved");
  if (approval.reviewerId === canonical.generatedBy) throw new Error("design generator cannot approve its own design");
  validatePalette(canonical.palette);
  validateCoreBriefs(canonical.corePageBriefs);
  const customCssErrors = validateCustomCss(canonical.customCss ?? "");
  if (customCssErrors.length > 0) throw new Error(`custom CSS rejected: ${customCssErrors.join("; ")}`);
  const designContract = buildDesignContract(canonical);
  const css = renderDesignCss(canonical);
  const cssBytes = new TextEncoder().encode(css).byteLength;
  const validation = buildValidationReport(`design:${canonical.id}:${canonical.version}`, DESIGN_AUTHORITY_VALIDATION, [
    finding("design.provenance", canonical.sourceIds.length > 0 ? "pass" : "fail", `${canonical.sourceIds.length} design source IDs; draft=${draftHash}`),
    finding("design.approval", "pass", `${approval.reviewerClass}:${approval.reviewerId} approved exact draft ${draftHash}`),
    finding("design.tokens", cssBytes <= 48_000 ? "pass" : "fail", `${designContract.capabilities.length} capabilities; CSS=${cssBytes} bytes`, { measured: cssBytes, threshold: 48_000 }),
    finding("design.core-pages", canonical.corePageBriefs.length > 0 ? "pass" : "fail", `${canonical.corePageBriefs.length} reviewed core-page briefs`),
    finding("design.css-safety", cssBytes <= 48_000 ? "pass" : "fail", customCssErrors.length === 0 ? "custom CSS passed static safety checks" : customCssErrors.join("; ")),
  ]);
  const cssHash = sha256(css);
  const authorityCanonical = {
    draftHash,
    approvalHash: approval.approvalHash,
    designContract,
    cssHash,
    validationHash: validation.reportHash,
  };
  return {
    ...canonical,
    designContract,
    css,
    cssHash,
    draftHash,
    approval,
    authorityHash: sha256(JSON.stringify(authorityCanonical)),
    validation,
  };
}

export function renderApprovedDesignSite(site: CompiledSite, authority: ApprovedDesignAuthority): RenderedDesignSite {
  const satisfiability = validateDesignSystemSuperset(site, authority.designContract);
  const pages = site.pages.map((artifact): RenderedDesignPage => {
    const html = decorateCanonicalHtml(artifact.page, artifact.html);
    return {
      pageId: artifact.page.id,
      route: artifact.page.route,
      html,
      htmlHash: sha256(html),
      canonicalContentHash: artifact.sha256,
    };
  });
  const staticPass = pages.length === site.pages.length
    && pages.every((page) => page.html.includes('<link rel="stylesheet" href="/assets/hyper-site.css">'))
    && pages.every((page) => !/<script(?! type="application\/ld\+json")/i.test(page.html));
  const noindexPass = site.pages.every((artifact) => artifact.page.indexable || artifact.html.includes('name="robots" content="noindex,nofollow"'))
    && pages.every((page) => {
      const source = site.pages.find((artifact) => artifact.page.id === page.pageId);
      return Boolean(source?.page.indexable) || page.html.includes('name="robots" content="noindex,nofollow"');
    });
  const validation = buildValidationReport(`design-render:${authority.id}:${site.buildHash}`, DESIGN_RENDER_VALIDATION, [
    finding("design-render.satisfiability", satisfiability.ok ? "pass" : "fail", satisfiability.ok ? "approved design is a semantic superset" : [...satisfiability.errors, ...satisfiability.missingCapabilities, ...satisfiability.missingModuleKinds].join("; ")),
    finding("design-render.static", staticPass ? "pass" : "fail", `${pages.length}/${site.pages.length} pages share one static CSS artifact`),
    finding("design-render.noindex", noindexPass ? "pass" : "fail", "renderer preserved canonical PageIR publication state"),
  ]);
  const stable = {
    authorityHash: authority.authorityHash,
    sourceBuildHash: site.buildHash,
    cssHash: authority.cssHash,
    pages: pages.map((page) => [page.pageId, page.htmlHash, page.canonicalContentHash]),
    validationHash: validation.reportHash,
  };
  return {
    authorityId: authority.id,
    authorityHash: authority.authorityHash,
    sourceBuildHash: site.buildHash,
    cssPath: "/assets/hyper-site.css",
    css: authority.css,
    cssHash: authority.cssHash,
    pages,
    siteHash: sha256(JSON.stringify(stable)),
    validation,
  };
}

export function assertDesignRefinementPreservesContent(
  before: RenderedDesignSite,
  after: RenderedDesignSite,
): void {
  const beforeContent = new Map(before.pages.map((page) => [page.pageId, page.canonicalContentHash]));
  if (before.pages.length !== after.pages.length) throw new Error("design refinement changed page count");
  for (const page of after.pages) {
    if (beforeContent.get(page.pageId) !== page.canonicalContentHash) throw new Error(`design refinement changed canonical content for ${page.pageId}`);
  }
}

function buildDesignContract(draft: DesignAuthorityDraft): DesignSystemContract {
  const kinds: ModuleKind[] = ["hero", "answer", "workflow", "proof", "comparison", "faq", "cta", "instruction"];
  const roles: LayoutRole[] = ["lead", "support", "proof", "decision", "conversion"];
  return {
    id: `${draft.id}:${draft.version}`,
    capabilities: [...DESIGN_CAPABILITIES],
    components: kinds.map((kind) => ({ kind, supportedLayoutRoles: [...roles], capabilities: capabilitiesFor(kind) })),
    tokens: {
      spacingScale: [4, 8, 12, 16, 24, 32, 48, 64, 96, 128],
      typeScale: [12, 14, 16, 18, 22, 28, 40, 56, 72],
      radii: [0, 8, 12, 18, 28, 999],
      maxContentWidths: [680, 1120, 1440],
    },
  };
}

function capabilitiesFor(kind: ModuleKind): DesignCapability[] {
  const common: DesignCapability[] = ["semantic-hierarchy", "responsive-grid", "mobile-priority", "reduced-motion"];
  switch (kind) {
    case "hero": return common;
    case "answer": return [...common, "long-form-reading", "structured-data-visible"];
    case "workflow": return [...common, "workflow-steps"];
    case "proof": return [...common, "evidence-dense", "progressive-disclosure", "structured-data-visible"];
    case "comparison": return [...common, "comparison-table"];
    case "faq": return [...common, "progressive-disclosure", "long-form-reading"];
    case "cta": return [...common, "conversion-panel"];
    case "instruction": return [...common, "instruction-pointer"];
  }
}

function renderDesignCss(draft: DesignAuthorityDraft): string {
  const p = draft.palette;
  return `@layer reset,tokens,base,layout,components,utilities;
@layer tokens {
  :root {
    color-scheme: only light;
    --hs-ink:${p.ink}; --hs-canvas:${p.canvas}; --hs-surface:${p.surface};
    --hs-primary:${p.primary}; --hs-secondary:${p.secondary}; --hs-accent:${p.accent}; --hs-success:${p.success};
    --hs-border:color-mix(in srgb,var(--hs-ink) 12%,transparent);
    --hs-shadow:0 24px 70px color-mix(in srgb,var(--hs-ink) 10%,transparent);
    --hs-radius:1.25rem; --hs-content:72rem; --hs-measure:68ch;
  }
}
@layer reset { *,*::before,*::after{box-sizing:border-box} html{scroll-behavior:smooth} body,h1,h2,h3,p,ul,ol{margin:0} img,svg,video{display:block;max-inline-size:100%} }
@layer base {
  body.hs-site{min-inline-size:20rem;background:radial-gradient(circle at 12% 0%,color-mix(in srgb,var(--hs-accent) 22%,transparent),transparent 32rem),var(--hs-canvas);color:var(--hs-ink);font-family:${draft.typography.bodyStack};line-height:1.65;text-rendering:optimizeLegibility}
  h1,h2,h3{font-family:${draft.typography.headingStack};line-height:1.05;letter-spacing:-.035em;text-wrap:balance}
  h1{font-size:clamp(2.6rem,7vw,6rem);max-inline-size:16ch} h2{font-size:clamp(1.8rem,4vw,3.4rem);max-inline-size:24ch} h3{font-size:1.2rem}
  p{max-inline-size:var(--hs-measure);text-wrap:pretty} a{color:inherit;text-underline-offset:.22em} :focus-visible{outline:3px solid color-mix(in srgb,var(--hs-primary) 40%,transparent);outline-offset:3px}
}
@layer layout {
  .hs-shell{inline-size:min(100% - clamp(1.25rem,5vw,5rem),var(--hs-content));margin-inline:auto;padding-block:clamp(2rem,6vw,5rem) clamp(5rem,10vw,9rem)}
  .hs-hero{display:grid;gap:1.5rem;padding-block:clamp(4rem,10vw,8rem);border-block-end:1px solid var(--hs-border)}
  .hs-hero>p{font-family:${draft.typography.monoStack};font-size:.78rem;font-weight:760;letter-spacing:.12em;text-transform:uppercase;color:var(--hs-primary)}
  .hs-module{display:grid;gap:1.1rem;padding-block:clamp(3.5rem,8vw,7rem);border-block-end:1px solid var(--hs-border)}
  .hs-related{padding-block:3rem}.hs-related ul{display:flex;flex-wrap:wrap;gap:.75rem;padding:0;list-style:none}
}
@layer components {
  .hs-module[data-module-kind="hero"]{background:linear-gradient(135deg,color-mix(in srgb,var(--hs-primary) 9%,var(--hs-surface)),var(--hs-surface));padding-inline:clamp(1rem,4vw,3rem);border-radius:var(--hs-radius);box-shadow:var(--hs-shadow)}
  .hs-module[data-module-kind="workflow"]{counter-reset:step}.hs-module[data-module-kind="workflow"] p{padding:1rem 1.25rem;border-inline-start:.3rem solid var(--hs-secondary);background:var(--hs-surface);border-radius:0 var(--hs-radius) var(--hs-radius) 0}
  .hs-module[data-module-kind="proof"],.hs-module[data-module-kind="comparison"]{padding-inline:clamp(1rem,4vw,3rem);background:var(--hs-surface);border:1px solid var(--hs-border);border-radius:var(--hs-radius);box-shadow:var(--hs-shadow)}
  .hs-module[data-module-kind="cta"]{padding:clamp(1.5rem,5vw,4rem);background:var(--hs-ink);color:var(--hs-surface);border-radius:var(--hs-radius)}
  .hs-module article{display:grid;gap:.55rem;padding:1.2rem;border:1px solid var(--hs-border);border-radius:calc(var(--hs-radius) * .75);background:var(--hs-surface)}
  .hs-related a{display:inline-block;padding:.7rem 1rem;border:1px solid var(--hs-border);border-radius:999px;background:var(--hs-surface);text-decoration:none}
}
@media (prefers-reduced-motion:no-preference){.hs-module,.hs-hero{animation:hs-reveal .5s both;animation-timeline:view();animation-range:entry 5% cover 25%}@keyframes hs-reveal{from{opacity:.45;transform:translateY(1rem)}to{opacity:1;transform:none}}}
${draft.customCss ?? ""}
`;
}

function decorateCanonicalHtml(page: PageIR, html: string): string {
  return html
    .replace("</head>", '<link rel="stylesheet" href="/assets/hyper-site.css">\n</head>')
    .replace(/<body([^>]*)>/, '<body$1 class="hs-site">')
    .replace("<main>", '<main class="hs-shell">')
    .replace("<header>", '<header class="hs-hero">')
    .replaceAll("<section ", '<section class="hs-module" ')
    .replace('<nav aria-label="Related pages">', '<nav class="hs-related" aria-label="Related pages">')
    .replace('data-design-contract="semantic-v1"', `data-design-contract="${escapeAttribute(page.id)}"`);
}

function validatePalette(palette: DesignAuthorityDraft["palette"]): void {
  for (const [name, value] of Object.entries(palette)) {
    if (!/^#[0-9a-fA-F]{6}$/.test(value)) throw new Error(`design color ${name} must be a six-digit hex value`);
  }
}

function validateCoreBriefs(briefs: readonly CorePageDesignBrief[]): void {
  if (briefs.length === 0) throw new Error("at least one core-page design brief is required");
  const ids = new Set<string>();
  const routes = new Set<string>();
  for (const brief of briefs) {
    if (!brief.id.trim() || ids.has(brief.id)) throw new Error(`invalid or duplicate core-page brief ${brief.id}`);
    if (!brief.route.startsWith("/") || routes.has(brief.route)) throw new Error(`invalid or duplicate core-page route ${brief.route}`);
    if (!brief.purpose.trim() || brief.requiredModuleKinds.length === 0) throw new Error(`core-page brief ${brief.id} requires purpose and modules`);
    ids.add(brief.id);
    routes.add(brief.route);
  }
}

function validateCustomCss(css: string): string[] {
  const errors: string[] = [];
  const normalized = css.toLowerCase();
  if (/@import\b/.test(normalized)) errors.push("@import is prohibited");
  if (/url\s*\(\s*["']?https?:/.test(normalized)) errors.push("remote CSS URLs are prohibited");
  if (/javascript\s*:/.test(normalized)) errors.push("javascript URLs are prohibited");
  if (/<\/?style|<script/.test(normalized)) errors.push("HTML or script termination is prohibited");
  if (new TextEncoder().encode(css).byteLength > 16_000) errors.push("custom CSS exceeds 16 KB");
  return errors;
}

function canonicalDraft(draft: DesignAuthorityDraft): DesignAuthorityDraft {
  return {
    ...draft,
    id: draft.id.trim(),
    version: draft.version.trim(),
    brandName: draft.brandName.trim(),
    generatedBy: draft.generatedBy.trim(),
    sourceIds: sorted(draft.sourceIds),
    palette: Object.fromEntries(Object.entries(draft.palette).sort(([left], [right]) => left.localeCompare(right))) as DesignAuthorityDraft["palette"],
    typography: {
      bodyStack: draft.typography.bodyStack.trim(),
      headingStack: draft.typography.headingStack.trim(),
      monoStack: draft.typography.monoStack.trim(),
    },
    visualRules: sorted(draft.visualRules),
    componentRules: sorted(draft.componentRules),
    prohibitedPatterns: sorted(draft.prohibitedPatterns),
    corePageBriefs: [...draft.corePageBriefs].sort((left, right) => left.id.localeCompare(right.id)).map((brief) => ({
      ...brief,
      requiredModuleKinds: [...new Set(brief.requiredModuleKinds)].sort(),
      notes: sorted(brief.notes),
    })),
    ...(draft.customCss === undefined ? {} : { customCss: draft.customCss.trim() }),
  };
}

function sorted(values: readonly string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))].sort();
}

function escapeAttribute(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
