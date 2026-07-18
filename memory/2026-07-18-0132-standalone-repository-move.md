# 2026-07-18 01:32 ET — Standalone Repository Move Handoff

format: TOON-oriented Markdown  
status: immutable handoff  
scope: repository root

## state

move{destination,source_repository,source_branch,source_sha}:
  benamtech/hyper-site,benamtech/ai-employee-v1,agent/ui-metaprogramming-pass-1,1238678e065e6b46ca9154ff9b93c22b6e042318

extraction_method:
  "git subtree split --prefix=GTM-RESEARCH/website-framework"

root_adjustments[6]:
  AMTECH_IDENTITY.md
  docs/AMTECH_WEB_DESIGN_SYSTEM.md
  identity.md
  AGENTS.md
  README.md
  CODEGRAPH.md

validation:
  "destination reference build, tests, emissions, orchestration, framework validation/preview, browser check, and R3F build run before push"

## next

next[4]:
  1,"treat benamtech/hyper-site as canonical framework repository"
  2,"implement real repository/source ingestion"
  3,"connect Stage-1 provider and reviewer workflow"
  4,"run the 100-500 real noindex Stage-2 cohort"
