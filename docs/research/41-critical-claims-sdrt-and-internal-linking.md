# Critical Claims: SDRT, Graphs, and Internal Linking

Status: active research constraint  
Updated: 2026-07-18

## Decision

SDRT is not promoted as the internal-linking model for Hyper Site or Hyper Content.

The current evidence supports a simpler baseline:

```text
approved page content
-> extract or reuse canonical entities
-> build page-entity incidence data
-> derive entity co-occurrence and shared-evidence scores
-> generate directed internal-link candidates
-> apply route, intent, redundancy, and editorial rules
-> held-out human review
```

SDRT, dense embeddings, graph neural networks, or a custom query language may remain research candidates only when they beat this baseline on frozen, held-out internal-link decisions.

## Claim assessment

### Claim: SDRT is useful for discourse semantics, not naturally for site topology

Assessment: supported.

Segmented Discourse Representation Theory models discourse segments and rhetorical relations to reason about interpretation, anaphora, ambiguity, temporal structure, and discourse coherence. Its native problem is the semantics/pragmatics interface within discourse. Website internal linking is a different decision problem involving pages, user tasks, entities, routes, authority, redundancy, navigation, and editorial intent.

Primary sources:

- Lascarides and Asher, "Discourse Relations and Defeasible Knowledge," ACL 1991, DOI 10.3115/981344.981352.
- Lascarides, Asher, and Oberlander, "Inferring Discourse Relations in Context," ACL 1992, DOI 10.3115/981967.981968.
- Lascarides and Asher, "Segmented Discourse Representation Theory: Dynamic Semantics with Discourse Structure," 2007.

Conclusion: SDRT may help analyze local rhetorical structure inside a page or generated article. It has no established privilege for deciding which website pages should link to one another.

### Claim: the existing evidence -> claims -> modules -> pages graph is already more directly useful

Assessment: supported with qualification.

The repository already records explicit provenance and page dependencies. That structure can provide exact signals unavailable to a discourse parser:

- shared evidence sources;
- shared claims;
- shared information objects;
- shared canonical entities;
- explicit page purpose and route;
- declared related pages;
- indexability and retirement state.

The limitation is that the current dependency index is a build/maintenance structure. It is not automatically an internal-link recommendation system. Direction, anchor context, user task, redundancy, and editorial usefulness must be modeled separately.

### Claim: entity co-occurrence is the correct first baseline

Assessment: supported as a baseline, not as a complete solution.

Entity co-occurrence and shared relational context are established ingredients in entity recommendation and link prediction. They are cheap, interpretable, and compatible with the repository's typed content model. However, raw co-occurrence can over-recommend globally frequent entities, create circular clusters, ignore page purpose, and produce semantically related but operationally useless links.

A minimal candidate score should therefore be decomposable:

```text
candidate(page_a -> page_b) =
  shared_entity_score
+ shared_evidence_score
+ task_continuation_score
+ complementary_information_score
+ route_hierarchy_score
- redundancy_penalty
- self_competition_penalty
- already_linked_penalty
```

Every term must be visible in the recommendation report. No opaque combined score is accepted as evidence.

Relevant research:

- Ni, Liu, and Torzec, "Layered Graph Embedding for Entity Recommendation using Wikipedia in the Yahoo! Knowledge Graph," 2020.
- Zhou, Cox, and Petricek, "Characterising Web Site Link Structure," 2007.
- Nguyen et al., "Node Co-occurrence based Graph Neural Networks for Knowledge Graph Link Prediction," 2021. This is evidence that co-occurrence can be useful, not evidence that Hyper needs a GNN.

### Claim: a graph model could improve internal linking

Assessment: plausible but unproven for Hyper.

Graph methods can model topology, connectivity, centrality, communities, and candidate links. Recent internal-linking experiments also show a tradeoff between authority redistribution and semantic coherence, reinforcing the need for editorial review. No graph method should be promoted from this literature alone.

Promotion requires a held-out comparison against:

1. explicit manually authored related-page links;
2. shared-entity and shared-evidence rules;
3. lexical similarity;
4. route hierarchy and page-purpose rules;
5. a combined simple scoring baseline.

The advanced method must improve at least one action-level outcome without unacceptable regression:

- reviewer acceptance;
- task-continuation usefulness;
- semantic coherence;
- discovery of useful cross-cluster links;
- reduction in orphan pages;
- reduced cannibalization or redundant links;
- maintenance effort;
- explanation quality.

## Required validation fixture

Freeze a set of pages and candidate pairs before evaluating any model.

Each pair must include:

```json
{
  "source_page": "page-a",
  "target_page": "page-b",
  "eligible": true,
  "expected_direction": "a-to-b",
  "editorial_judgment": "accept",
  "reasons": ["shared-entity", "task-continuation"],
  "forbidden_reasons": ["duplicate-intent"]
}
```

Metrics:

- precision at the reviewed candidate budget;
- recall of accepted links;
- direction accuracy;
- orphan-page reduction;
- duplicate/cannibalizing link rate;
- reviewer minutes;
- explanation sufficiency;
- stability after a source-fact or page-retirement change.

## Attack and failure vectors

- high-frequency entities dominate recommendations;
- pages with duplicated intent become tightly linked rather than retired;
- symmetric similarity produces the wrong link direction;
- route hierarchy overrides actual user task;
- evidence co-dependency is mistaken for navigational usefulness;
- anchor text leaks unsupported claims;
- retired or noindex pages remain recommended;
- graph centrality creates rich-get-richer topology;
- evaluation labels are written after model output is seen;
- a sophisticated method is compared against an intentionally weak baseline.

## Repository rule

No SDRT, 5D vector, embedding, GNN, or custom graph-query implementation belongs on the active product path for internal linking until:

```text
held_out_simple_baseline_complete == true
advanced_method_acceptance_gain > 0
unexpected_or_harmful_link_rate does not regress
reviewer_time does not materially regress
explanations remain inspectable
```

Until then, use explicit links and the entity/co-occurrence baseline.