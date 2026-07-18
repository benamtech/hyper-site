import { sha256 } from "./core.js";
import type { ArticleIR, ArticleIRSection } from "./articleir-parser.js";
import type { EmittedPageContract, PageContractEvidence } from "./pcn-emitter.js";

export interface UnfolderDesignAuthority {
  id: string;
  authorityHash: string;
  siteName: string;
  cssPath?: string;
  language?: string;
  bodyClass?: string;
}

export interface UnfolderOptions {
  indexable?: boolean;
  generatedAt?: string;
}

export interface LoweredPageArtifact {
  pageId: string;
  route: string;
  canonicalUrl: string;
  title: string;
  description: string;
  markdown: string;
  jsonLd: Readonly<Record<string, unknown>>;
  html: string;
  sitemapEntry: string | null;
  evidenceIds: readonly string[];
  internalPageIds: readonly string[];
  markdownHash: string;
  jsonLdHash: string;
  htmlHash: string;
  artifactHash: string;
}

/** Deterministically unfolds accepted ArticleIR into publication artifacts. */
export function unfoldArticleIR(
  article: ArticleIR,
  emitted: EmittedPageContract,
  design: UnfolderDesignAuthority,
  options: UnfolderOptions = {},
): LoweredPageArtifact {
  if (article.contractHash !== emitted.contractHash || article.pageId !== emitted.contract.pageId) throw new Error("ArticleIR does not belong to the supplied page contract");
  if (!design.id.trim() || !design.authorityHash.trim() || !design.siteName.trim()) throw new Error("unfolder requires a design authority identity and site name");
  if (design.authorityHash !== emitted.contract.designAuthorityHash) throw new Error("unfolder design authority hash does not match the page contract");
  const contract = emitted.contract;
  const evidenceById = new Map(contract.evidence.map((item) => [item.id, item]));
  const title = contract.titleHint || sentenceTitle(article.sections[0]?.prose ?? contract.canonicalQuestion);
  const description = summarize(article.sections[0]?.prose ?? contract.canonicalQuestion, 160);
  const markdown = renderMarkdown(title, article, emitted, evidenceById);
  const jsonLd = renderJsonLd(title, description, article, emitted, evidenceById, design.siteName);
  const html = renderHtml(title, description, article, emitted, evidenceById, design, jsonLd, options.indexable === true);
  const sitemapEntry = options.indexable === true
    ? `<url><loc>${escapeXml(contract.canonicalUrl)}</loc>${options.generatedAt ? `<lastmod>${escapeXml(options.generatedAt)}</lastmod>` : ""}</url>`
    : null;
  const canonical = {
    pageId: contract.pageId,
    route: contract.route,
    canonicalUrl: contract.canonicalUrl,
    title,
    description,
    markdownHash: sha256(markdown),
    jsonLdHash: sha256(JSON.stringify(jsonLd)),
    htmlHash: sha256(html),
    evidenceIds: article.citationIds,
    internalPageIds: contract.links.map((item) => item.pageId),
    designAuthorityHash: design.authorityHash,
    contractHash: emitted.contractHash,
    articleHash: article.articleHash,
    indexable: options.indexable === true,
  };
  return {
    pageId: canonical.pageId,
    route: canonical.route,
    canonicalUrl: canonical.canonicalUrl,
    title,
    description,
    markdown,
    jsonLd,
    html,
    sitemapEntry,
    evidenceIds: canonical.evidenceIds,
    internalPageIds: canonical.internalPageIds,
    markdownHash: canonical.markdownHash,
    jsonLdHash: canonical.jsonLdHash,
    htmlHash: canonical.htmlHash,
    artifactHash: sha256(JSON.stringify(canonical)),
  };
}

function renderMarkdown(
  title: string,
  article: ArticleIR,
  emitted: EmittedPageContract,
  evidenceById: ReadonlyMap<string, PageContractEvidence>,
): string {
  const body = article.sections.map((section) => `## ${section.heading}\n\n${replaceMarkdownCitations(section.prose, article.citationIds)}`).join("\n\n");
  const links = emitted.contract.links.length === 0
    ? ""
    : `\n\n## Related pages\n\n${emitted.contract.links.map((item) => `- [${item.anchorText}](${item.route})`).join("\n")}`;
  const evidence = article.citationIds.length === 0
    ? ""
    : `\n\n## Evidence\n\n${article.citationIds.map((id) => {
      const item = required(evidenceById, id, "evidence");
      const destination = item.url ?? `source:${item.sourceId}`;
      return `[^${footnoteId(id)}]: ${item.statement} — ${destination}`;
    }).join("\n")}`;
  return `# ${title}\n\n${body}${links}${evidence}\n`;
}

function renderJsonLd(
  title: string,
  description: string,
  article: ArticleIR,
  emitted: EmittedPageContract,
  evidenceById: ReadonlyMap<string, PageContractEvidence>,
  siteName: string,
): Readonly<Record<string, unknown>> {
  const contract = emitted.contract;
  const fields = Object.fromEntries(Object.entries(contract.schema.fields ?? {}));
  return {
    "@context": "https://schema.org",
    "@type": contract.schema.type,
    "@id": `${contract.canonicalUrl}#primary`,
    url: contract.canonicalUrl,
    name: title,
    headline: title,
    description,
    isPartOf: { "@type": "WebSite", name: siteName, url: new URL(contract.canonicalUrl).origin },
    mainEntityOfPage: { "@type": "WebPage", "@id": contract.canonicalUrl },
    citation: article.citationIds.map((id) => {
      const item = required(evidenceById, id, "evidence");
      return item.url ?? item.statement;
    }),
    ...fields,
  };
}

function renderHtml(
  title: string,
  description: string,
  article: ArticleIR,
  emitted: EmittedPageContract,
  evidenceById: ReadonlyMap<string, PageContractEvidence>,
  design: UnfolderDesignAuthority,
  jsonLd: Readonly<Record<string, unknown>>,
  indexable: boolean,
): string {
  const contract = emitted.contract;
  const cssPath = design.cssPath?.trim() || "/assets/hyper-site.css";
  const sections = article.sections.map((section) => renderHtmlSection(section, article.citationIds)).join("\n");
  const links = contract.links.length === 0 ? "" : `<nav aria-label="Related pages"><h2>Related pages</h2><ul>${contract.links.map((item) => `<li data-relation="${escapeHtml(item.relation)}"><a href="${escapeHtml(item.route)}">${escapeHtml(item.anchorText)}</a></li>`).join("")}</ul></nav>`;
  const evidence = article.citationIds.length === 0 ? "" : `<section aria-labelledby="evidence-heading"><h2 id="evidence-heading">Evidence</h2><ol>${article.citationIds.map((id, index) => {
    const item = required(evidenceById, id, "evidence");
    const body = item.url ? `<a href="${escapeHtml(item.url)}" rel="cite noopener">${escapeHtml(item.statement)}</a>` : escapeHtml(item.statement);
    return `<li id="evidence-${escapeHtml(footnoteId(id))}" data-evidence-id="${escapeHtml(id)}"><span aria-hidden="true">${index + 1}. </span>${body}</li>`;
  }).join("")}</ol></section>`;
  const json = JSON.stringify(jsonLd).replace(/</g, "\\u003c");
  return `<!doctype html>
<html lang="${escapeHtml(design.language?.trim() || "en")}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${escapeHtml(contract.canonicalUrl)}">
<meta name="robots" content="${indexable ? "index,follow" : "noindex,nofollow"}">
<link rel="stylesheet" href="${escapeHtml(cssPath)}">
<script type="application/ld+json">${json}</script>
</head>
<body${design.bodyClass ? ` class="${escapeHtml(design.bodyClass)}"` : ""}>
<header><a href="/">${escapeHtml(design.siteName)}</a></header>
<main data-page-id="${escapeHtml(contract.pageId)}" data-contract-hash="${escapeHtml(emitted.contractHash)}">
<article>
<header><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p></header>
${sections}
${links}
${evidence}
</article>
</main>
</body>
</html>`;
}

function renderHtmlSection(section: ArticleIRSection, allCitationIds: readonly string[]): string {
  const paragraphs = section.prose.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean);
  return `<section data-section-id="${escapeHtml(section.id)}"><h2>${escapeHtml(section.heading)}</h2>${paragraphs.map((paragraph) => `<p>${replaceHtmlCitations(paragraph, allCitationIds)}</p>`).join("")}</section>`;
}

function replaceMarkdownCitations(prose: string, ids: readonly string[]): string {
  let output = prose;
  for (const id of ids) output = output.replaceAll(`(${id})`, `[^${footnoteId(id)}]`).replaceAll(`[${id}]`, `[^${footnoteId(id)}]`);
  return output;
}

function replaceHtmlCitations(prose: string, ids: readonly string[]): string {
  let output = escapeHtml(prose);
  for (const [index, id] of ids.entries()) {
    const marker = `<sup><a href="#evidence-${escapeHtml(footnoteId(id))}" aria-label="Evidence ${index + 1}">[${index + 1}]</a></sup>`;
    output = output.replaceAll(escapeHtml(`(${id})`), marker).replaceAll(escapeHtml(`[${id}]`), marker);
  }
  return output;
}

function sentenceTitle(value: string): string {
  const sentence = value.trim().split(/(?<=[.!?])\s+/)[0].replace(/[.!?]+$/, "");
  return summarize(sentence || "Untitled page", 72);
}

function summarize(value: string, maximum: number): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maximum) return normalized;
  return `${normalized.slice(0, Math.max(1, maximum - 1)).replace(/\s+\S*$/, "")}…`;
}

function footnoteId(id: string): string {
  return id.replace(/[^A-Za-z0-9_-]+/g, "-");
}

function required<K, V>(map: ReadonlyMap<K, V>, key: K, label: string): V {
  const value = map.get(key);
  if (value === undefined) throw new Error(`missing ${label} ${String(key)}`);
  return value;
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function escapeXml(value: string): string {
  return escapeHtml(value);
}
