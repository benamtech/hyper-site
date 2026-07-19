# Portable Compiler Limit Test

Status: active validation authority  
Updated: 2026-07-18

## Supported current claim

The repository contains a functioning evidence-aware static compiler prototype. A valid `SiteSource` can be transformed into `PageIR`, semantic HTML, metadata, JSON-LD, instruction Markdown, sitemap XML, dependency metadata, page hashes, and a whole-build hash.

The public entrypoint is `hyper-site/index.mjs`. At this branch state it delegates compiler exports to `reference/dist/framework-core.js`. This proves prototype behavior, not independent package ownership or product readiness.

## Official Manjaro/Arch runner

Requirements:

- Manjaro or another Arch-derived Linux distribution;
- Bash and `pacman`;
- internet access;
- permission to create a local clone;
- optional `sudo` access only when automatic dependency installation is explicitly enabled.

Run from an XFCE terminal:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/benamtech/hyper-site/agent/glm-blackwell-vertical-slice/scripts/manjaro-clone-and-test-hyper.sh)
```

The default mode does not install operating-system packages. Missing packages produce the exact recommended command:

```bash
sudo pacman -Syu --needed git nodejs npm curl
```

To explicitly allow the runner to perform that full Manjaro/Arch sync and installation:

```bash
HYPER_INSTALL_DEPS=1 \
bash <(curl -fsSL https://raw.githubusercontent.com/benamtech/hyper-site/agent/glm-blackwell-vertical-slice/scripts/manjaro-clone-and-test-hyper.sh)
```

Configure the generated workload and clone directory:

```bash
HYPER_TEST_PAGES=500 \
HYPER_TEST_SEED="manjaro-limit-$(date +%s)" \
bash <(curl -fsSL https://raw.githubusercontent.com/benamtech/hyper-site/agent/glm-blackwell-vertical-slice/scripts/manjaro-clone-and-test-hyper.sh) \
  "$HOME/hyper-site-tests/manual-500"
```

Optional controls:

```text
HYPER_REPO_SLUG       default: benamtech/hyper-site
HYPER_REPO_URL        default: https://github.com/benamtech/hyper-site.git
HYPER_REF             default: agent/glm-blackwell-vertical-slice
HYPER_TEST_PAGES      default: 100; accepted range: 1..2000
HYPER_TEST_SEED       default: timestamp plus random suffix
HYPER_EXPECTED_COMMIT optional exact remote-head pin
HYPER_INSTALL_DEPS    default: 0; set to 1 for pacman installation
HYPER_KEEP_CLONE      default: 1; set to 0 to remove the successful clone
```

## Generic Unix-like runner

For another Unix-like machine that already has Git, Node.js 20+, npm and curl:

```bash
curl -fsSL https://raw.githubusercontent.com/benamtech/hyper-site/agent/glm-blackwell-vertical-slice/scripts/clone-and-test-hyper.sh | bash
```

## Live branch-specific URLs

```text
Repository:
https://github.com/benamtech/hyper-site

Branch:
https://github.com/benamtech/hyper-site/tree/agent/glm-blackwell-vertical-slice

Draft PR:
https://github.com/benamtech/hyper-site/pull/3

Official Manjaro runner:
https://raw.githubusercontent.com/benamtech/hyper-site/agent/glm-blackwell-vertical-slice/scripts/manjaro-clone-and-test-hyper.sh

Generic Unix-like runner:
https://raw.githubusercontent.com/benamtech/hyper-site/agent/glm-blackwell-vertical-slice/scripts/clone-and-test-hyper.sh

Canonical randomized harness:
https://raw.githubusercontent.com/benamtech/hyper-site/agent/glm-blackwell-vertical-slice/scripts/run-compiler-limit-test-v2.mjs
```

## Runner sequence

The official runner:

1. prints the live repository, branch, pull-request and raw-file URLs;
2. confirms the system provides `pacman`;
3. checks Git, Node.js, npm and curl;
4. installs missing packages only when `HYPER_INSTALL_DEPS=1`;
5. requires Node.js 20 or newer;
6. verifies that the named branch exists with `git ls-remote`;
7. optionally verifies `HYPER_EXPECTED_COMMIT`;
8. clones only the named branch;
9. verifies the local head equals the remote branch head;
10. verifies a clean checkout;
11. installs locked dependencies with `npm ci`;
12. builds the repository;
13. runs the complete repository tests;
14. runs the validation-baseline tests;
15. generates arbitrary unique evidence, claims, information objects, modules and pages;
16. compiles the same input twice;
17. independently verifies page and build hashes;
18. checks dependency-index coverage, escaping, sitemap behavior and instruction projections;
19. executes ten invalid-input rejection cases;
20. verifies `report.json` says the run passed;
21. writes a clone-context record containing exact URLs, commit, runtime and harness information.

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
validation/reports/manjaro-<seed>/
  clone-context.json
  report.json
  site-source.json
  compiled-summary.json
  dependency-index.json
  sitemap.xml
  html/
  *.instructions.md
```

The report and context files identify the exact source commit and runtime. The generated HTML and source fixture allow manual inspection beyond the automated assertions.

## Interpretation

A passing result proves that the current compiler implementation behaved consistently for that generated fixture on that machine and commit. It does not prove:

- complete W1 extraction;
- independent packed-package consumption;
- framework superiority;
- useful real pages;
- ranking, conversion or revenue;
- production readiness.

Scale is configurable up to 2,000 pages in this harness. Larger synthetic tests require a separately reviewed workload and resource budget; synthetic scale remains software evidence only.
