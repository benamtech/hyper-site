#!/usr/bin/env bash
set -euo pipefail

: "${SOURCE_REPOSITORY:=benamtech/ai-employee-v1}"
: "${SOURCE_BRANCH:=agent/ui-metaprogramming-pass-1}"
: "${SOURCE_SHA:=8bae01f511dce3d5b6c422c667a422bc27359b18}"
: "${SOURCE_PR:=17}"
: "${SOURCE_CI_RUN:=29631749674}"

source_dir="$RUNNER_TEMP/ai-employee-v1"
rm -rf "$source_dir"
git init "$source_dir"
git -C "$source_dir" remote add origin "https://github.com/${SOURCE_REPOSITORY}.git"
if ! git -C "$source_dir" fetch --depth=1 origin "$SOURCE_SHA"; then
  git -C "$source_dir" fetch --depth=1 origin "refs/heads/${SOURCE_BRANCH}:refs/remotes/origin/source"
fi
git -C "$source_dir" checkout --detach FETCH_HEAD
actual_source_sha="$(git -C "$source_dir" rev-parse HEAD)"
test "$actual_source_sha" = "$SOURCE_SHA"

find . -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -a "$source_dir/GTM-RESEARCH/website-framework/." .
mkdir -p docs .github/workflows
cp "$source_dir/identity.md" AMTECH_IDENTITY.md
cp "$source_dir/docs/AMTECH_WEB_DESIGN_SYSTEM.md" docs/AMTECH_WEB_DESIGN_SYSTEM.md

python <<'PY'
from pathlib import Path
import os
import re

source_repo = os.environ.get("SOURCE_REPOSITORY", "benamtech/ai-employee-v1")
source_branch = os.environ.get("SOURCE_BRANCH", "agent/ui-metaprogramming-pass-1")
source_sha = os.environ.get("SOURCE_SHA", "8bae01f511dce3d5b6c422c667a422bc27359b18")
source_pr = os.environ.get("SOURCE_PR", "17")
source_ci = os.environ.get("SOURCE_CI_RUN", "29631749674")

identity = Path("identity.md")
text = identity.read_text()
text = text.replace(
    "> Read the root `identity.md` first. This file adds the operating identity required for the website-framework subtree.",
    "> Read `AMTECH_IDENTITY.md` first. This file adds the mathematical, compiler, research, and interaction identity required for this repository.",
)
identity.write_text(text)

agents = Path("AGENTS.md")
text = agents.read_text()
read_first = """## Read first

1. `AMTECH_IDENTITY.md`
2. `identity.md`
3. `CODEGRAPH.md`
4. `README.md`
5. `memory/MEMORY.md`
6. newest immutable file under `memory/`
7. `26-graph-learning-paper-triage-and-promotion-gates.md`
8. `25-academic-crosswalk-agent-harness-structured-generation-and-acceleration.md`
9. `24-agent-discovered-ontology-and-10k-site-program.md`
10. `23-groundwork-orchestration-implementation.md`
11. `22-agent-operated-framework-workflow-validation-matrix.md`
12. `21-vector-to-generation-job-compiler.md`
13. `20-agent-operated-vector-site-generation-and-wasm.md`
14. `18-vector-node-path-web-framework-model.md`
15. `19-vector-native-corrections-and-csi-validation.md`
16. newest validation report
17. `site-manifest.yaml`
18. `reference/README.md`
19. `docs/AMTECH_WEB_DESIGN_SYSTEM.md` when changing UI or interaction behavior
"""
text = re.sub(r"## Read first\n\n.*?\n## Scope", read_first + "\n## Scope", text, count=1, flags=re.S)
text = text.replace(
    "This subtree is an agent-operated vector-native website-generation research framework.",
    "This repository is an agent-operated vector-native website-generation research framework.",
)
agents.write_text(text)

codegraph = Path("CODEGRAPH.md")
text = codegraph.read_text()
text = re.sub(r"^Scope: `GTM-RESEARCH/website-framework/`$", "Scope: repository root", text, flags=re.M)
boundary = f"""

## Standalone repository boundary

This repository was extracted from `{source_repo}` branch `{source_branch}` at `{source_sha}` after successful source workflow run `{source_ci}`. The framework directory is now the repository root. Historical research documents and immutable handoffs may retain their original monorepo paths as provenance; current commands, agent rules, CI, and mutable authority files are root-relative.
"""
insert_at = text.find("\n## Product and source graph")
if insert_at != -1 and "## Standalone repository boundary" not in text:
    text = text[:insert_at] + boundary + text[insert_at:]
codegraph.write_text(text)

readme = Path("README.md")
text = readme.read_text()
boundary = f"""

## Repository boundary

`hyper-site` is the standalone home of the framework formerly located at `GTM-RESEARCH/website-framework/` in `{source_repo}`. This extraction is pinned to source branch `{source_branch}`, commit `{source_sha}`, PR #{source_pr}, and successful source CI run `{source_ci}`.

The framework directory is now the repository root. `AMTECH_IDENTITY.md` and `docs/AMTECH_WEB_DESIGN_SYSTEM.md` are copied source authorities required by the standalone agent and UI contracts. Historical research documents and immutable memory files retain original monorepo paths where those paths are part of the recorded evidence.
"""
insert_at = text.find("\n## Product interface")
if insert_at != -1 and "## Repository boundary" not in text:
    text = text[:insert_at] + boundary + text[insert_at:]
text = text.replace(
    "1. root/scoped `identity.md`, `AGENTS.md`, and `CODEGRAPH.md`;",
    "1. `AMTECH_IDENTITY.md`, `identity.md`, `AGENTS.md`, and `CODEGRAPH.md`;",
)
readme.write_text(text)

reference_readme = Path("reference/README.md")
reference_readme.write_text(reference_readme.read_text().replace("-> ../../site-manifest.yaml", "-> ../site-manifest.yaml"))

ui_handoff = Path("reference/UI-DESIGN-SYSTEM-HANDOFF.md")
ui_handoff.write_text(ui_handoff.read_text().replace("cd GTM-RESEARCH/website-framework/reference", "cd reference"))
PY

cat > .gitignore <<'EOF'
reference/node_modules/
reference/ui-r3f/node_modules/
reference/dist/
reference/ui-r3f/dist/
reference/generated-manifest/
reference/generated-ui/
reference/generated-orchestration/
reference/generated-framework-preview/
reference/ci-test.log
reference/package-lock.json
reference/ui-r3f/package-lock.json
*.log
EOF

cat > MIGRATION.md <<EOF
# Standalone repository extraction

- Destination: \`benamtech/hyper-site\`
- Source repository: \`${SOURCE_REPOSITORY}\`
- Source branch: \`${SOURCE_BRANCH}\`
- Source commit: \`${SOURCE_SHA}\`
- Source pull request: \`#${SOURCE_PR}\`
- Source CI run: \`${SOURCE_CI_RUN}\` (successful)
- Extraction model: the contents of \`GTM-RESEARCH/website-framework/\` were flattened into the repository root; required external AMTECH identity and design authorities were copied into explicit standalone paths.

This repository begins with a provenance-preserving snapshot rather than rewritten subtree Git history. Exact source identity is recorded above and in the newest memory handoff.
EOF

stamp="$(TZ=America/New_York date +%Y-%m-%d-%H%M)"
handoff="memory/${stamp}-standalone-repository-extraction.md"
cat > "$handoff" <<EOF
# ${stamp} ET — Standalone Repository Extraction Handoff

format: TOON-oriented Markdown  
status: immutable handoff  
scope: repository root

## state

extraction{destination,source_repository,source_branch,source_sha,source_pr,source_ci}:
  benamtech/hyper-site,${SOURCE_REPOSITORY},${SOURCE_BRANCH},${SOURCE_SHA},${SOURCE_PR},${SOURCE_CI_RUN}

layout:
  "former GTM-RESEARCH/website-framework contents flattened to repository root"

copied_authorities[2]:
  AMTECH_IDENTITY.md
  docs/AMTECH_WEB_DESIGN_SYSTEM.md

adapted_mutable_authorities[6]:
  identity.md
  AGENTS.md
  README.md
  CODEGRAPH.md
  reference/README.md
  reference/UI-DESIGN-SYSTEM-HANDOFF.md

preserved_history_rule:
  "timestamped memory and historical research/validation documents retain original monorepo paths when those paths are provenance"

## validation

source_exact_head:
  "${SOURCE_SHA}"

source_ci:
  "${SOURCE_CI_RUN}: success"

destination_validation:
  "strict build, complete Node test suite, manifest/UI/orchestration emissions, framework validation/preview, browser targets, and R3F build run before destination commit"

## next

next[4]:
  1,"treat benamtech/hyper-site as canonical framework repository"
  2,"implement real repository/source ingestion"
  3,"connect Stage-1 provider and reviewer workflow"
  4,"run 100-500 real noindex Stage-2 cohort before scale publication"
EOF

python <<PY
from pathlib import Path

path = Path("memory/MEMORY.md")
text = path.read_text()
entry = """

## ${stamp} — standalone repository extraction

extraction{destination,source,branch,sha,pr,ci}:
  benamtech/hyper-site,${SOURCE_REPOSITORY},${SOURCE_BRANCH},${SOURCE_SHA},${SOURCE_PR},${SOURCE_CI_RUN}

current_boundary:
  "framework directory is repository root; AMTECH_IDENTITY.md and docs/AMTECH_WEB_DESIGN_SYSTEM.md are local authorities; historical immutable paths remain provenance"

handoff:
  `${handoff}`
"""
first_newline = text.find("\n")
path.write_text(text[: first_newline + 1] + entry + text[first_newline + 1 :])
PY

cat > .github/workflows/reference.yml <<'EOF'
name: Hyper Site Reference

on:
  pull_request:
  push:
    branches: [main, "agent/**"]

permissions:
  contents: read

jobs:
  reference:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: reference
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: |
            reference/package.json
            reference/ui-r3f/package.json
      - run: npm install --no-audit --no-fund --no-package-lock
      - name: Run reference tests
        shell: bash
        run: |
          set -o pipefail
          npm test 2>&1 | tee ci-test.log
      - name: Upload test diagnostics
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: hyper-site-test-diagnostics
          path: |
            reference/ci-test.log
            reference/src/manifest.ts
            reference/src/framework-orchestrator.ts
            reference/src/page-coordinate.ts
            reference/src/page-generation.ts
          retention-days: 7
      - run: npm run manifest:emit
      - run: npm run ui:emit
      - run: npm run orchestration:check
      - run: npm run framework:validate
      - run: npm run framework:preview
      - run: npm run browser:check
      - run: npm run ui:r3f:build
      - uses: actions/upload-artifact@v4
        with:
          name: hyper-site-emissions
          path: |
            reference/generated-manifest
            reference/generated-ui
            reference/generated-orchestration
            reference/generated-framework-preview
          retention-days: 7
EOF

rm -f .migration-bootstrap .bootstrap-trigger
rm -f .github/workflows/bootstrap-hyper-site.yml .github/bootstrap-hyper-site.sh

test -f README.md
test -f AGENTS.md
test -f CODEGRAPH.md
test -f identity.md
test -f AMTECH_IDENTITY.md
test -f docs/AMTECH_WEB_DESIGN_SYSTEM.md
test -f 26-graph-learning-paper-triage-and-promotion-gates.md
test -f memory/2026-07-18-0115-graph-triage-ci-closure.md
test -f .github/workflows/reference.yml
test ! -e GTM-RESEARCH
! grep -nF '../../identity.md' AGENTS.md
! grep -nF '../../CODEGRAPH.md' AGENTS.md
grep -nF "$SOURCE_SHA" MIGRATION.md

cd reference
npm install --no-audit --no-fund --no-package-lock
npm test
npm run manifest:emit
npm run ui:emit
npm run orchestration:check
npm run framework:validate
npm run framework:preview
npm run browser:check
npm run ui:r3f:build
cd ..

rm -rf reference/node_modules reference/ui-r3f/node_modules
rm -rf reference/dist reference/ui-r3f/dist
rm -rf reference/generated-manifest reference/generated-ui
rm -rf reference/generated-orchestration reference/generated-framework-preview
rm -f reference/ci-test.log reference/package-lock.json reference/ui-r3f/package-lock.json

git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
git add -A
git status --short
git commit -m "chore: extract website framework into hyper-site"
git push origin HEAD:main
