#!/usr/bin/env bash
set -euo pipefail

REPO_URL="${HYPER_REPO_URL:-https://github.com/benamtech/hyper-site.git}"
REF="${HYPER_REF:-agent/glm-blackwell-vertical-slice}"
PAGES="${HYPER_TEST_PAGES:-100}"
SEED="${HYPER_TEST_SEED:-portable-$(date -u +%Y%m%dT%H%M%SZ)-${RANDOM}}"
DEST="${1:-${TMPDIR:-/tmp}/hyper-site-test-${SEED}}"

command -v git >/dev/null 2>&1 || { echo "git is required" >&2; exit 2; }
command -v node >/dev/null 2>&1 || { echo "Node.js 20+ is required" >&2; exit 2; }
command -v npm >/dev/null 2>&1 || { echo "npm is required" >&2; exit 2; }

NODE_MAJOR="$(node -p 'Number(process.versions.node.split(".")[0])')"
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo "Node.js 20+ is required; found $(node --version)" >&2
  exit 2
fi

rm -rf "$DEST"
echo "Cloning $REPO_URL at $REF into $DEST"
git clone --filter=blob:none --branch "$REF" --single-branch "$REPO_URL" "$DEST"
cd "$DEST"

COMMIT="$(git rev-parse HEAD)"
echo "Commit: $COMMIT"
echo "Installing locked dependencies..."
npm ci --no-audit --no-fund

echo "Building current repository implementation..."
npm run build

echo "Running repository tests..."
npm test

echo "Running validation-baseline tests..."
npm run test:validation

echo "Running unique compiler limit test: pages=$PAGES seed=$SEED"
node scripts/run-compiler-limit-test-v2.mjs \
  --pages "$PAGES" \
  --seed "$SEED" \
  --output "validation/reports/portable-${SEED}"

cat > "validation/reports/portable-${SEED}/clone-context.json" <<JSON
{
  "repository": "$REPO_URL",
  "ref": "$REF",
  "commit": "$COMMIT",
  "node": "$(node --version)",
  "npm": "$(npm --version)",
  "pages": $PAGES,
  "seed": "$SEED",
  "harness": "scripts/run-compiler-limit-test-v2.mjs"
}
JSON

echo
echo "PASS: repository tests and compiler limit harness completed."
echo "Artifacts: $DEST/validation/reports/portable-${SEED}"
echo "Primary report: $DEST/validation/reports/portable-${SEED}/report.json"
