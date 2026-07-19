# 25 — Academic Crosswalk: Agent Harness, Structured Generation, Vector Space, Acceleration, and Framework Validation

Status: verified research crosswalk; source, tests, real baselines, and validation reports remain implementation authority  
Updated: 2026-07-18  
Scope: standalone repository root  
Maturity authority: `docs/validation/27-near-alpha-framework-validation-and-continuous-agent-workspace.md`

## 1. Purpose

This document records which external research supports individual parts of Hyper Site, what remains inference, and which methods remain comparison arms.

No single paper validates the full system.

```text
business/source truth
-> agent proposes ontology
-> external compiler/reviewer approves or rejects
-> typed sparse graph + hard constraints
-> bounded candidate selection
-> agent proposes PageDraft batches
-> external compiler validates evidence and structure
-> canonical PageIR/static renderer
-> continuous workspace and post-generation maintenance
-> ordinary-framework, held-out, and real-case evaluation
```

The architecture is a synthesis. Every component needs an independent pass/fail vector.

## 2. Research-intake rule

Externally generated bibliographies are lead lists, not authority.

A source may influence canonical architecture only when:

```text
exact identity verified
primary source or publisher available
claimed result appears in the source
problem class matches
simpler baseline named
validation vector updated
negative control identified
source code or field evidence demonstrates the effect
maintenance and full-framework cost considered
```

Unverified titles, throughput, rental prices, model sizes, hardware claims, package names, and proposed actions remain notes only.

## 3. Verified research and applicability

### 3.1 HDC/VSA and HRR

Denis Kleyko, Dmitri A. Rachkovskij, Evgeny Osipov, and Abbas Rahimi:

- Part I: `https://arxiv.org/abs/2111.06077`
- Part II: `https://arxiv.org/abs/2112.15424`

Established:

- high-dimensional distributed representations are a legitimate representation family;
- binding, bundling, permutation, associative retrieval, and role-filler composition are established operations;
- fixed-width compositional state and hardware-oriented implementations are valid research directions.

Not established:

- page eligibility or usefulness;
- search demand, indexing, ranking, conversion, or revenue;
- web-framework performance;
- incremental maintenance benefit;
- replacement of typed evidence, constraints, lexical baselines, or graphs.

Decision:

```text
retain inspectable typed attributes as authority
retain HRR after eligibility
require namespace/version/parity
benchmark against simpler structures
never use vector similarity alone as publication authority
```

### 3.2 Context-document compatibility

Kong et al., “Personalized Search Via Neural Contextual Semantic Relevance Ranking”: `https://arxiv.org/abs/2309.05113`

Established:

- document/query relevance and document/context compatibility are distinct signals;
- lexical and semantic context signals can be combined and ablated;
- held-out and out-of-domain evaluation are appropriate.

Not established:

- construction of a public site corpus;
- demographic page generation;
- HRR as the representation;
- SEO or conversion lift;
- that a compatible context justifies a page.

Decision:

- preserve an independent `ContextCorpus`, frozen splits, assessor identity, and calibration path;
- treat compatibility as evaluation over proposed pages, not page-existence evidence;
- require held-out real judgments before any relevance claim.

### 3.3 Submodular coverage and CSI

Iyer et al., “Submodular Combinatorial Information Measures with Applications in Machine Learning”: `https://arxiv.org/abs/2006.15412`

Iyer, “Complement Submodular Information Measures for Balanced and Robust Data Selection”: `https://arxiv.org/abs/2605.24779`

Established:

- facility-location, set-cover, graph-cut, saturated-coverage, and related finite-selection objectives are legitimate;
- concave-over-modular coverage provides diminishing returns;
- complement-aware objectives can be relevant to balanced hidden-slice selection.

Not established:

- selected regions deserve pages;
- the framework’s composite objective inherits every guarantee of one submodular objective;
- CSI improves this site corpus without a frozen representative benchmark.

Decision:

- sparse concave coverage remains the deterministic scalable baseline;
- exact controls and tail/noise fixtures remain required;
- CSI remains a comparison arm for split or publication-cohort selection;
- every page still requires a task, information object, evidence, difference statement, and lifecycle owner.

### 3.4 Graph community detection

Traag, Waltman, and van Eck, “From Louvain to Leiden: guaranteeing well-connected communities”: `https://doi.org/10.1038/s41598-019-41695-z`

Established:

- Leiden improves graph partition quality and connectivity properties for its graph objectives.

Not established:

- communities are coherent customer segments, intents, page families, or routes;
- modularity or CPM is a publication objective;
- community detection improves maintenance or cannibalization decisions.

Decision:

- deterministic connected components remain the transparent descriptive baseline;
- Leiden may be tested against held-out family coherence, relevance, or maintenance outcomes;
- no community identifier becomes business or publication truth.

### 3.5 External harnesses and self-verification limits

Huang, “ReFlect”: `https://arxiv.org/abs/2605.05737`

Zhou et al., “Externalization in LLM Agents”: `https://arxiv.org/abs/2604.08224`

Stechly, Valmeekam, and Kambhampati, “On the Self-Verification Limitations of Large Language Models”: `https://arxiv.org/abs/2402.08115`

Established or strongly supported:

- externalized state, skills, protocols, and deterministic harness logic reduce dependence on model-internal reconstruction;
- same-model self-critique is not a sound correctness oracle;
- sound external verification can outperform prompt-only correction in studied tasks.

Decision:

```text
agent proposes
-> compiler validates schema, provenance, safety, evidence, graph, design, and workspace state
-> explicit findings drive bounded repair
-> independent approval remains separate
-> publication remains separate
```

Near-alpha extension:

- externalized state must include initial authoring artifacts and post-generation maintenance, not only generation checkpoints;
- “continuous agent” means versioned workspace snapshots and dependency graphs, not a hidden perpetual process.

### 3.6 Structured generation

Geng et al., JSONSchemaBench: `https://arxiv.org/abs/2501.10868`

Established:

- schema-constrained generation is a legitimate implementation approach;
- schema coverage, compliance, output quality, and efficiency are separate dimensions;
- implementations differ across real schemas.

Decision:

- Stage-1 and Stage-2 providers emit typed proposals;
- successful JSON parsing is necessary but insufficient;
- measure invalid-output rate, repair rate, semantic drift, evidence integrity, latency, tokens, and cost;
- server JSON mode does not replace external schema and semantic validation.

### 3.7 Agent-system ontology

Ekelhart et al., “AgentO: An Ontology for Modeling Agentic AI Systems”: `https://eprints.cs.univie.ac.at/8749/`

Established:

- agents, tasks, workflows, resources, and dependencies can be represented for reconstruction, reuse, and audit.

Decision:

- retain AgentO as an interoperability comparison;
- do not replace the business/site ontology;
- internal workspace artifacts already require task/resource/dependency/audit identity;
- add an adapter only for a real interoperability use case.

### 3.8 Structured model execution

Zheng et al., “SGLang”: `https://arxiv.org/abs/2312.07104`

Established:

- structured multi-call model programs can benefit from execution runtimes, constrained decoding, parallelism, and shared-prefix cache reuse.

Decision:

- SGLang or an equivalent may become a provider runtime;
- it is not ontology, evidence, page-selection, design, workspace, or publication authority;
- compare complete site-run cost, recovery, cache hits, quality, and maintenance behavior after real provider adapters exist.

### 3.9 WebAssembly

Official specifications: `https://webassembly.org/specs/`

Established:

- Wasm is a portable execution format with JavaScript/Web/WASI embedding and SIMD-capable numeric paths.

Not established:

- automatic speedup over JavaScript/V8;
- benefit for map/set/string/hash/heap-heavy compiler work;
- acceptable bridge, startup, copy, toolchain, and fallback cost;
- web-framework improvement.

Decision:

- TypeScript remains the semantic oracle;
- isolate only contiguous expensive numeric kernels;
- include bridge/copy/startup and full-build effects;
- require exact output parity and complete fallback;
- include incremental maintenance, not only cold generation, in promotion evidence.

## 4. New near-alpha framework crosswalk

The reviewed research supports external verification, structured proposals, sparse representations, bounded selection, and experimental acceleration. It does not validate Hyper Site as a web framework.

That requires separate software-engineering and empirical evidence.

### 4.1 Test-driven development

Every promotion requires:

```text
failing or negative-control test first
hypothesis and primary metric
falsification rule
simpler baseline
frozen fixture
machine/runtime identity
reproducible commands
result hash
```

A benchmark result without a prior failure boundary is descriptive, not scientific promotion evidence.

### 4.2 Continuous workspace

Externalization research is applied to the full lifecycle:

```text
business datasheets
evidence ledgers
design and typography systems
layout and graphics briefs
starter pages
bulk page batches
maintenance patches
case-study artifacts
```

Every artifact has producer, source, dependencies, status, and content hash. Workspace snapshots are immutable and linked.

### 4.3 Ordinary-framework baselines

Advanced compiler and vector concepts must be compared with ordinary static, SSR, or SPA frameworks on the same semantic fixture and machine.

Required metrics:

- cold build;
- incremental edit/build;
- development startup/update;
- peak memory;
- output HTML/JS/CSS/assets;
- validation and crawl;
- browser and accessibility;
- operator effort, recovery, and rollback.

Generation planning time alone is not framework performance.

### 4.4 Post-10K maintenance

A 10K result must measure source, design-token, shared-component, page, page-family, ontology, evidence, and interruption changes. It must identify invalidated, rebuilt, and unchanged artifacts.

### 4.5 Real cases

A case study is a versioned replayable artifact with repository revision, operators, sources, initial goals, assigned jobs, maintenance tasks, failures, baseline workflow, and held-out judgments.

Synthetic fixtures cannot satisfy this gate.

## 5. Validation-vector crosswalk

| Feature/workflow | Validation vector | Pass vector | Fail vector | Current status |
|---|---|---|---|---|
| Stage-1 ontology | IDs, sources, evidence, material effects, sensitivity, reviewer state | explicit proposal; compiler/reviewer controls approval | prompt output becomes truth | source-wired; live quality pending |
| lexical baseline | tokenization, TF-IDF/BM25, order determinism | related concepts and duplicates exposed | boilerplate collapses distinct concepts | synthetic pass |
| typed graph | channels, endpoints, provenance, constraints, pruning | constraints remain separate | similarity overrides exclusions | synthetic pass |
| opportunity expansion | seeds, neighbors, dimension uniqueness, candidate cap | bounded compatible expansions | Cartesian explosion | synthetic pass |
| eligibility | anchors, evidence, material effects, coherence, safety | hard gates before selection | mathematical point becomes page | synthetic pass |
| HRR/VSA | namespace, atoms, parity | deterministic structural vector | vector replaces evidence | synthetic pass |
| corpus selection | sparse coverage, tail/noise, determinism | finite nonredundant set | dense matrix or quota admits noise | synthetic planning pass |
| Stage-2 PageDraft | job identity, evidence, claims, objects, utilities, modules | complete evidence-bound draft | generic/noun-swapped or unsupported output | synthetic full emission pass; live pending |
| harness/repair | external findings, bounded attempts, checkpoints | verifier controls retries | self-critique accepts | source-wired |
| structured provider | schema, drift, evidence, latency, tokens | live provider passes | JSON-only semantic failure | not run live |
| core design | style/type/layout/graphics/starter artifacts, approval, content-hash restyle | coherent core before bulk | bulk-only unattractive site | source contract pass; human review pending |
| continuous workspace | producer/source/dependency/status/hash, invalidation | both lifecycle ends represented | detached or hidden state | source and synthetic tests pass |
| ordinary framework | shared fixture/machine/tiers and full metrics | direct comparison | self-only or planning-only timing | contract only; benchmark pending |
| network science | simpler baseline, held-out outcome, action | measured decision improvement | decorative graph metric | contract only; real study pending |
| page existence | task, object, evidence, neighbor difference, owner | one justification per page | unique route/vector only | contract only; real pages pending |
| real use | revision, operators, jobs, maintenance, held-out judgments | complete non-synthetic case | testimonial/synthetic only | pending |
| 10K transition | cold + incremental + invalidation + output + recovery | claimed ceiling <= measured full path | cold-only or overclaim | synthetic cold/full emission only |
| Wasm/native | kernel profile, repeated parity, bridge-inclusive benefit | full-framework gain and fallback | novelty or microbenchmark only | TypeScript retained |
| publication/search | static HTML, browser, crawler, accessibility, held-out field cohort | useful distinct pages and outcomes | synthetic count described as SEO proof | not run |

## 6. Canonical implementation decisions

Retain now:

```text
external compiler/harness authority
schema-bearing Stage-1 and Stage-2 proposals
explicit provenance and evidence
TF-IDF/BM25 baseline
typed graph and hard constraints
bounded graph expansion
sparse concave coverage
HRR after eligibility
TypeScript semantic oracle
canonical static PageIR
immutable workspace snapshots and explicit invalidation
```

Retain as later comparison/provider arms:

```text
structured-decoding framework comparisons
SGLang or equivalent provider runtime
AgentO interoperability
CSI hidden-slice cohort selection
Leiden exploratory partitions
learned embeddings and ANN
learned graph methods
native/Wasm kernels
local specialist GPU models
```

Do not promote from bibliography alone:

```text
same-model self-verification
learned graph authority without real labels
community/page equivalence
unbounded agent loops
GPU or native optimization without full-framework evidence
synthetic 10K described as useful web-framework success
```

## 7. Current evidence boundary

Source and synthetic tests establish increasingly complete wiring, deterministic rejection, recovery, canonical static emission, workspace invalidation, and scale execution.

They do not establish:

- real design quality;
- real continuous agent operation;
- ordinary-framework advantage;
- live model reliability or economics;
- real network-science benefit;
- real page usefulness, accessibility, or relevance;
- search or commercial outcomes.

## 8. Next research and engineering gates

```text
1. Freeze one real five-page starter-site fixture and judgments.
2. Run the live provider and rented-node experiments.
3. Connect actual generated artifacts to the continuous workspace.
4. Implement the same fixture in an ordinary framework.
5. Compare authoring, build, incremental edits, output, browser, accessibility, and operator effort.
6. Extend to 25 real noindex pages with page-existence justifications.
7. Freeze graph/relevance/design held-out judgments.
8. Scale 100 -> 500.
9. Run 10K emission plus the complete maintenance matrix.
10. Promote advanced methods only when predefined hypotheses pass.
