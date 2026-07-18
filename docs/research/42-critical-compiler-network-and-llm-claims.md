# Critical Compiler, Network, and LLM Claims

Status: active research constraint  
Updated: 2026-07-18

## Purpose

Classify aggressive criticisms as supported, qualified, unresolved, or rejected before they influence product architecture.

## Claim ledger

### "The compiler is a DAG, not an agent"

Assessment: supported as a classification.

The verified `SiteSource -> PageIR -> artifacts` path is deterministic compilation over explicit dependencies. It does not independently perceive, plan, choose tools, recover from environmental feedback, or pursue an open-ended goal. Calling this path an agent would obscure its actual invariants. Hyper Content may later orchestrate model-backed proposal steps, but the compiler remains a compiler.

Constraint: do not market deterministic compilation as autonomous agency.

### "A dependency graph guarantees correct incremental maintenance"

Assessment: overstated.

Dependency graphs are useful only when the captured dependency model is complete. Incremental-build research shows that missing environmental or filesystem dependencies can silently produce incorrect outputs. Hyper's dependency index therefore remains an impact-planning hypothesis until W3 compares intended and actual affected pages across controlled changes.

Primary source: Curtsinger and Barowy, "Riker: Always-Correct and Fast Incremental Builds from Simple Specifications," USENIX ATC 2022.

Constraint: `unexpected_changed_pages == 0` is necessary but insufficient; missed required changes must also be zero.

### "Compiler speed is meaningless because content generation is the bottleneck"

Assessment: directionally correct but absolute wording rejected.

Compiler speed matters for feedback latency, CI cost, large rebuilds, and maintenance. It does not establish end-to-end product speed when evidence collection, model generation, review, images, deployment, or crawling dominate elapsed time.

Constraint: report compiler time separately from provider latency, review time, total wall-clock time, and operator time.

### "BM25, graph methods, and calibration are meaningless unless they improve outcomes"

Assessment: supported with qualification.

BM25 is a strong lexical baseline in multiple domains. Graph methods and isotonic regression are legitimate methods, but method validity does not establish product value. Calibration can improve probability interpretation without improving ranking discrimination; graph metrics can describe topology without improving a held-out decision.

Primary sources:

- Guo et al., "MultiReQA," ACL AdaptNLP 2021.
- Rosa et al., "Yes, BM25 is a Strong Baseline for Legal Case Retrieval," 2021.
- Berta, Bach, and Jordan, "Classifier Calibration with ROC-Regularized Isotonic Regression," AISTATS 2024.

Constraint: every advanced method must beat BM25, explicit rules, arrays/maps, or another direct control on a frozen held-out task.

### "Structured or grammar-constrained output solves semantic safety"

Assessment: contradicted.

Grammar-constrained decoding can guarantee membership in a syntactic language. It cannot prove factual support, authorization, safe intent, evidence fidelity, or business correctness.

Primary sources:

- Geng et al., "Grammar-Constrained Decoding for Structured NLP Tasks without Finetuning," EMNLP 2023.
- Park, Zhou, and D'Antoni, "Flexible and Efficient Grammar-Constrained Decoding," ICML 2025.

Constraint: syntax validation, semantic validation, evidence validation, and action authorization remain separate gates.

### "Prompt injection is unacknowledged and data/instruction separation is enough"

Assessment: first clause historically plausible; second clause contradicted.

Indirect prompt injection is a practical attack surface when external content is retrieved into LLM or agent contexts. Structural cues and context separation can reduce risk but do not eliminate it. Systems with tools or secrets require least privilege, explicit action authorization, untrusted-content labeling, output validation, and side-effect isolation.

Primary sources:

- Chen et al., "Can Indirect Prompt Injection Attacks Be Detected and Removed?" ACL 2025.
- Chang et al., "Overcoming the Retrieval Barrier: Indirect Prompt Injection in the Wild for LLM Systems," USENIX Security 2026.

Constraint: model-generated proposals have no publication or external-action authority.

### "Synthetic 10K throughput proves the system is valuable"

Assessment: contradicted.

Synthetic scale can establish bounded software behavior, throughput, memory use, and deterministic artifact production. It cannot establish that pages deserve to exist, are supported, accessible, useful, indexable, rankable, maintainable, or profitable.

Constraint: scale results remain software evidence; real-page and maintenance gates remain independent.

### "SDRT should drive internal linking"

Assessment: not supported.

SDRT is a discourse-semantics framework for rhetorical relations, anaphora, ambiguity, and coherence. Internal linking is better matched initially by explicit page purposes, canonical entities, shared evidence, route hierarchy, task continuation, and editorial review.

Authority: `docs/research/41-critical-claims-sdrt-and-internal-linking.md`.

## Promotion rule

No method moves onto the stable product path because it is mathematically sophisticated, academically valid, popular, or fast on a synthetic fixture.

Promotion requires:

```text
frozen task
+ strong direct baseline
+ held-out evaluation
+ measured operational outcome
+ no required-invariant regression
+ inspectable failure report
```

Otherwise the method remains experimental, is narrowed, or is removed.