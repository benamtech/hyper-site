# Official Manjaro External Verification Handoff

Timestamp: 2026-07-18T20:30:00-04:00  
Branch: `agent/glm-blackwell-vertical-slice`  
PR: #3, draft and unmerged

## Delivered

- `scripts/manjaro-clone-and-test-hyper.sh`
- `scripts/clone-and-test-hyper.sh`
- `scripts/run-compiler-limit-test-v2.mjs`
- `test/manjaro-runner.test.mjs`
- `test/compiler-limit-harness.test.mjs`
- updated root README
- updated documentation lifecycle index
- updated portable validation authority
- updated durable memory

## Official command

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/benamtech/hyper-site/agent/glm-blackwell-vertical-slice/scripts/manjaro-clone-and-test-hyper.sh)
```

## Safety and fidelity

- operating-system dependency installation is opt-in through `HYPER_INSTALL_DEPS=1`;
- Manjaro/Arch installation uses `sudo pacman -Syu --needed`, not a partial upgrade;
- the runner verifies the live remote branch head before cloning;
- the local clone commit must equal the remote branch head;
- an optional `HYPER_EXPECTED_COMMIT` pin can reject a moving branch;
- the actual public compiler entrypoint is used;
- the current delegation to `reference/dist/framework-core.js` remains explicit;
- all generated reports record exact repository, branch, commit, runtime and harness data.

## Proof boundary

A passing run proves deterministic behavior, hash recomputation, declared dependency-index coverage, output escaping, sitemap/indexability behavior, instruction projection, and rejection behavior for the generated fixture on the named commit and machine.

It does not prove W1 completion, clean tarball consumption, useful real pages, maintenance advantage, ranking, conversion, revenue or production readiness.

## Next gate

W1 remains active. The next implementation step is still complete classification of `reference/src`, followed by physical compiler extraction into `hyper-site/src` and clean packed-package consumers.
