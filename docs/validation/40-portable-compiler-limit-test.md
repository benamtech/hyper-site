# Portable Compiler Limit Test

Status: active validation authority  
Updated: 2026-07-18

## Supported current claim

The repository contains a functioning evidence-aware static compiler prototype. A valid `SiteSource` can be transformed into `PageIR`, semantic HTML, metadata, JSON-LD, instruction Markdown, sitemap XML, dependency metadata, page hashes, and a whole-build hash.

The public entrypoint is `hyper-site/index.mjs`. At this branch state it delegates compiler exports to `reference/dist/framework-core.js`. This proves prototype behavior, not independent package ownership or product readiness.

## Run from any Unix-like computer

Requirements:

- internet access;
- Git;
- Node.js 20 or newer;
- npm.

```bash
curl -fsSL https://raw.githubusercontent.com/benamtech/hyper-site/agent/glm-blackwell-vertical-slice/scripts/clone-and-test-hyper.sh | bash
```

Optional controls:

```bash
HYPER_TEST_PAGES=500 \
HYPER_TEST_SEED=my-unique-run \
HYPER_REF=agent/glm-blackwell-vertical-slice \
bash scripts/clone-and-test-hyper.sh /tmp/hyper-limit-test
```

The script:

1. clones the exact branch;
2. records the exact commit;
3. installs locked dependencies with `npm ci`;
4. builds the repository;
5. runs the complete repository tests;
6. runs the validation-baseline tests;
7. generates arbitrary unique evidence, claims, information objects, modules, and pages;
8. compiles the same input twice;
9. independently verifies page and build hashes;
10. checks dependency-index coverage, escaping, sitemap behavior, and instruction projections;
11. executes ten invalid-input rejection cases;
12. writes a self-contained report and emitted artifacts.

## Positive assertions

- requested and emitted page counts match;
- identical input produces identical page and build hashes;
- every page hash recomputes independently;
- the whole-build hash recomputes independently;
- dependency-index entries contain every declared page dependency;
- hostile HTML remains escaped text;
- instruction projections are emitted;
- noindex pages are excluded from the sitemap.

## Rejection matrix

- non-HTTPS base URL;
- duplicate evidence ID;
- duplicate route;
- empty canonical question;
- page with no modules;
- missing module reference;
- missing claim reference;
- missing evidence reference;
- claim exceeding evidence level;
- missing internal-page reference.

## Output

Each run writes:

```text
validation/reports/portable-<seed>/
  clone-context.json
  report.json
  site-source.json
  compiled-summary.json
  dependency-index.json
  sitemap.xml
  html/
  *.instructions.md
```

## Interpretation

A passing result proves that the current compiler implementation behaved consistently for that generated fixture on that machine and commit. It does not prove:

- complete W1 extraction;
- independent packed-package consumption;
- framework superiority;
- useful real pages;
- ranking, conversion, or revenue;
- production readiness.

Scale is configurable up to 2,000 pages in this harness. Larger synthetic tests require a separately reviewed workload and resource budget; synthetic scale remains software evidence only.