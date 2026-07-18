#!/usr/bin/env bash
set -Eeuo pipefail
IFS=$'\n\t'

# Official Manjaro/Arch external verification runner for Hyper Site.
#
# Default behavior is non-destructive: it checks dependencies and exits with
# an exact pacman command when packages are missing. Set HYPER_INSTALL_DEPS=1
# to allow the script to run a full Manjaro/Arch system sync and install them.

REPO_SLUG="${HYPER_REPO_SLUG:-benamtech/hyper-site}"
REPO_URL="${HYPER_REPO_URL:-https://github.com/${REPO_SLUG}.git}"
BRANCH="${HYPER_REF:-agent/glm-blackwell-vertical-slice}"
PAGES="${HYPER_TEST_PAGES:-100}"
SEED="${HYPER_TEST_SEED:-manjaro-$(date -u +%Y%m%dT%H%M%SZ)-${RANDOM}}"
DEST="${1:-${HOME}/hyper-site-tests/${SEED}}"
EXPECTED_COMMIT="${HYPER_EXPECTED_COMMIT:-}"
INSTALL_DEPS="${HYPER_INSTALL_DEPS:-0}"
KEEP_CLONE="${HYPER_KEEP_CLONE:-1}"

BRANCH_URL="https://github.com/${REPO_SLUG}/tree/${BRANCH}"
PR_URL="https://github.com/${REPO_SLUG}/pull/3"
RAW_RUNNER_URL="https://raw.githubusercontent.com/${REPO_SLUG}/${BRANCH}/scripts/manjaro-clone-and-test-hyper.sh"
RAW_PORTABLE_URL="https://raw.githubusercontent.com/${REPO_SLUG}/${BRANCH}/scripts/clone-and-test-hyper.sh"
RAW_HARNESS_URL="https://raw.githubusercontent.com/${REPO_SLUG}/${BRANCH}/scripts/run-compiler-limit-test-v2.mjs"

log()  { printf '\n\033[1;34m[hyper]\033[0m %s\n' "$*"; }
pass() { printf '\033[1;32m[pass]\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[warn]\033[0m %s\n' "$*" >&2; }
die()  { printf '\033[1;31m[fail]\033[0m %s\n' "$*" >&2; exit 1; }

on_error() {
  local code=$?
  printf '\n\033[1;31m[fail]\033[0m command failed with exit code %s at line %s: %s\n' \
    "$code" "${BASH_LINENO[0]:-unknown}" "${BASH_COMMAND:-unknown}" >&2
  if [[ -n "${DEST:-}" ]]; then
    printf 'Partial clone or reports may exist at: %s\n' "$DEST" >&2
  fi
  exit "$code"
}
trap on_error ERR

[[ "${PAGES}" =~ ^[0-9]+$ ]] || die "HYPER_TEST_PAGES must be an integer; received: ${PAGES}"
(( PAGES >= 1 && PAGES <= 2000 )) || die "HYPER_TEST_PAGES must be between 1 and 2000."

log "Official repository URLs"
printf 'Repository:       %s\n' "https://github.com/${REPO_SLUG}"
printf 'Branch:           %s\n' "$BRANCH_URL"
printf 'Draft PR:         %s\n' "$PR_URL"
printf 'Raw runner:       %s\n' "$RAW_RUNNER_URL"
printf 'Raw portable:     %s\n' "$RAW_PORTABLE_URL"
printf 'Raw limit harness:%s\n' " $RAW_HARNESS_URL"

if ! command -v pacman >/dev/null 2>&1; then
  die "This entrypoint is for Manjaro/Arch systems with pacman. Use ${RAW_PORTABLE_URL} on other Unix-like systems."
fi

required_commands=(git node npm curl)
missing_packages=()
for command_name in "${required_commands[@]}"; do
  if ! command -v "$command_name" >/dev/null 2>&1; then
    case "$command_name" in
      git)  missing_packages+=(git) ;;
      node) missing_packages+=(nodejs) ;;
      npm)  missing_packages+=(npm) ;;
      curl) missing_packages+=(curl) ;;
    esac
  fi
done

if (( ${#missing_packages[@]} > 0 )); then
  # Deduplicate package names without relying on non-core utilities.
  unique_packages=()
  for package_name in "${missing_packages[@]}"; do
    seen=0
    for existing in "${unique_packages[@]:-}"; do
      [[ "$existing" == "$package_name" ]] && seen=1
    done
    (( seen == 0 )) && unique_packages+=("$package_name")
  done

  if [[ "$INSTALL_DEPS" == "1" ]]; then
    log "Installing missing dependencies with a full Manjaro/Arch upgrade"
    sudo pacman -Syu --needed "${unique_packages[@]}"
  else
    printf '\nMissing packages: %s\n' "${unique_packages[*]}" >&2
    printf 'Install safely on Manjaro with:\n\n' >&2
    printf '  sudo pacman -Syu --needed %s\n\n' "${unique_packages[*]}" >&2
    printf 'Or rerun with automatic installation enabled:\n\n' >&2
    printf '  HYPER_INSTALL_DEPS=1 bash <(curl -fsSL %s)\n' "$RAW_RUNNER_URL" >&2
    exit 2
  fi
fi

NODE_MAJOR="$(node -p 'Number(process.versions.node.split(".")[0])')"
if (( NODE_MAJOR < 20 )); then
  die "Node.js 20 or newer is required; found $(node --version). Update with: sudo pacman -Syu --needed nodejs npm"
fi

log "Environment"
printf 'OS:      %s\n' "$(. /etc/os-release 2>/dev/null && printf '%s %s' "${NAME:-unknown}" "${VERSION_ID:-unknown}")"
printf 'Kernel:  %s\n' "$(uname -srmo)"
printf 'Bash:    %s\n' "$BASH_VERSION"
printf 'Git:     %s\n' "$(git --version)"
printf 'Node:    %s\n' "$(node --version)"
printf 'npm:     %s\n' "$(npm --version)"
printf 'Pages:   %s\n' "$PAGES"
printf 'Seed:    %s\n' "$SEED"
printf 'Clone:   %s\n' "$DEST"

if [[ -e "$DEST" ]]; then
  warn "Removing existing destination: $DEST"
  rm -rf -- "$DEST"
fi
mkdir -p -- "$(dirname -- "$DEST")"

log "Checking the live branch on GitHub"
REMOTE_COMMIT="$(git ls-remote --heads "$REPO_URL" "refs/heads/${BRANCH}" | awk 'NR==1 {print $1}')"
[[ -n "$REMOTE_COMMIT" ]] || die "Branch not found: ${BRANCH_URL}"
printf 'Remote branch head: %s\n' "$REMOTE_COMMIT"

if [[ -n "$EXPECTED_COMMIT" && "$REMOTE_COMMIT" != "$EXPECTED_COMMIT" ]]; then
  die "Remote branch head ${REMOTE_COMMIT} does not match HYPER_EXPECTED_COMMIT=${EXPECTED_COMMIT}."
fi

log "Cloning only the requested branch"
git clone \
  --filter=blob:none \
  --single-branch \
  --branch "$BRANCH" \
  "$REPO_URL" \
  "$DEST"
cd "$DEST"

COMMIT="$(git rev-parse HEAD)"
COMMIT_URL="https://github.com/${REPO_SLUG}/commit/${COMMIT}"
[[ "$COMMIT" == "$REMOTE_COMMIT" ]] || die "Clone head ${COMMIT} differs from remote branch head ${REMOTE_COMMIT}."
printf 'Verified commit: %s\n' "$COMMIT_URL"

log "Verifying repository identity and clean checkout"
[[ "$(git branch --show-current)" == "$BRANCH" ]] || die "Checked out unexpected branch: $(git branch --show-current)"
[[ -z "$(git status --porcelain)" ]] || die "Fresh clone is unexpectedly dirty."

git config --get remote.origin.url

log "Installing locked dependencies"
npm ci --no-audit --no-fund

log "Building current repository implementation"
npm run build

log "Running complete repository tests"
npm test

log "Running validation-baseline tests"
npm run test:validation

log "Running randomized compiler-limit test"
REPORT_DIR="validation/reports/manjaro-${SEED}"
node scripts/run-compiler-limit-test-v2.mjs \
  --pages "$PAGES" \
  --seed "$SEED" \
  --output "$REPORT_DIR"

REPORT_JSON="${REPORT_DIR}/report.json"
[[ -f "$REPORT_JSON" ]] || die "Expected report was not created: ${REPORT_JSON}"

node --input-type=module - "$REPORT_JSON" <<'NODE'
import { readFileSync } from "node:fs";
const reportPath = process.argv[2];
const report = JSON.parse(readFileSync(reportPath, "utf8"));
if (report.passed !== true) {
  console.error(JSON.stringify(report, null, 2));
  process.exit(1);
}
const failedChecks = [...(report.checks ?? []), ...(report.rejectionTests ?? [])]
  .filter((item) => item.ok !== true);
if (failedChecks.length > 0) {
  console.error("Report contains failed checks:", failedChecks);
  process.exit(1);
}
console.log(`Verified report: ${reportPath}`);
console.log(`Build hash: ${report.output?.buildHash ?? "missing"}`);
console.log(`Pages: ${report.output?.pageCount ?? "missing"}`);
console.log(`Positive checks: ${report.checks?.length ?? 0}`);
console.log(`Rejection checks: ${report.rejectionTests?.length ?? 0}`);
NODE

cat > "${REPORT_DIR}/clone-context.json" <<JSON
{
  "repository": "${REPO_URL}",
  "repositoryUrl": "https://github.com/${REPO_SLUG}",
  "branch": "${BRANCH}",
  "branchUrl": "${BRANCH_URL}",
  "commit": "${COMMIT}",
  "commitUrl": "${COMMIT_URL}",
  "pullRequestUrl": "${PR_URL}",
  "rawRunnerUrl": "${RAW_RUNNER_URL}",
  "rawHarnessUrl": "${RAW_HARNESS_URL}",
  "node": "$(node --version)",
  "npm": "$(npm --version)",
  "pages": ${PAGES},
  "seed": "${SEED}",
  "harness": "scripts/run-compiler-limit-test-v2.mjs"
}
JSON

pass "Repository build, tests, and randomized compiler verification passed."
printf '\nExact commit:   %s\n' "$COMMIT_URL"
printf 'Report:         %s/%s\n' "$DEST" "$REPORT_JSON"
printf 'HTML artifacts: %s/%s/html\n' "$DEST" "$REPORT_DIR"
printf 'Source fixture: %s/%s/site-source.json\n' "$DEST" "$REPORT_DIR"
printf 'Dependency map: %s/%s/dependency-index.json\n' "$DEST" "$REPORT_DIR"

if command -v xdg-open >/dev/null 2>&1 && [[ -n "${DISPLAY:-}${WAYLAND_DISPLAY:-}" ]]; then
  printf '\nOpen the report directory in Thunar with:\n  thunar "%s/%s"\n' "$DEST" "$REPORT_DIR"
fi

if [[ "$KEEP_CLONE" == "0" ]]; then
  log "HYPER_KEEP_CLONE=0: removing clone after successful verification"
  cd /
  rm -rf -- "$DEST"
  pass "Clone removed. The terminal output is the retained result."
fi
