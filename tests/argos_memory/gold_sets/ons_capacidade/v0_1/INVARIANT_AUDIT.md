# NIV-45 invariant coverage audit

Read-only audit completed against PR #14 head
`7b4966b05811ffb249c2ce913a1ee75fa63c594b`, base
`300c38aa6f70461aa94f427ccd3c6311c5c60954`, before implementation.

Sources read completely: expected policy, manifest, validator, focused tests,
all 13 Gold CSVs, all five reused CSVs, all four contexts, existing ONS
parser/diff, [canonical policy](https://app.notion.com/p/3e09ca62107081f48f1fc4d376d4382c),
[NIV-44](https://linear.app/nivarenergy/issue/NIV-44) including Founder sign-off
and amendment 1, and [NIV-45](https://linear.app/nivarenergy/issue/NIV-45)
acceptance criteria and all 21 existing discussion comments.

## Root cause and audit findings

Closed keys do not prove covered values. `content_delta` is the only case
field absent from all frozen-value sources, but that is not the only hole
in the combined validator/test design:

1. SG-001/015/016/017/018 have **NO VALIDATION AUTHORITY** for `content_delta`.
2. Python equality is not exact JSON equality: `True == 1`, `False == 0`.
   Frozen booleans and recomputed `content_equal` can accept numeric values.
   This affects rights attribution, local-resolution flags, raw-byte facts,
   and controlled/non-publisher-history markers. Some individual identity
   checks happen to reject other instances; there is no complete typed rule.
3. Recomputation alone permits coordinated evidence/delta drift. SG-008..014
   compare changed field/before/after but omit the changed identity when
   relating the delta to frozen candidate facts. Other per-case tests cover
   parts of this relationship, without one complete check for every delta.

Read-only reproduction combined numeric SG-004 attribution, SG-001 local
resolution, SG-002 raw-byte fact/content equality, SG-020 controlled marker,
and SG-008 fixture/delta identity substitution (`PUBLISHER-ASSET-FAKE`), with
the original frozen facts/claim intact: **22 passed, 0 failed, 0 skipped**.
No committed fixture or manifest was edited for this reproduction.

## Authority matrix (implementation target)

A = EXACT_FROZEN; B = DETERMINISTIC_RECOMPUTE;
C = CROSS_FIELD_INVARIANT; D = CONTEXT_CROSSCHECK;
E = MUST_BE_NULL_OR_FORBIDDEN.

A compares independent expected values including JSON types, nested keys,
list order, and list contents. B runs in the focused behavioral tests using
actual committed bytes and the existing parser/diff. `validate_manifest`
alone is the policy/context gate, not the deterministic behavioral gate.
Both gates are required. This is a bounded contract, not proof against a
developer intentionally rewriting the independent oracle and its tests.

### Manifest root: every allowed field

| Field | Authority | Enforcement / initial gap |
| --- | --- | --- |
| gold_set_version | A | EXPECTED_MANIFEST_METADATA |
| released_identifier_reserved | A | EXPECTED_MANIFEST_METADATA |
| release_status | A | EXPECTED_MANIFEST_METADATA |
| canonical_policy_ref | A | EXPECTED_MANIFEST_METADATA |
| source_id | A | EXPECTED_MANIFEST_METADATA |
| cases | A+C | Exact ordered SG-001..020, unique IDs, object entries; per-case contract |

Root keys are closed; unknown fields are E. Metadata is already covered.

### Case records: every allowed field

| Field | Authority | Enforcement / initial gap |
| --- | --- | --- |
| case_id | A+C | Exact ordered inventory; selects independent case contract |
| gold_set_version | A+C | Exact alpha version; agrees with root |
| source_id | A+C | Exact ONS source; agrees with root |
| evidence_kind | A | Independent per-case policy |
| evidence_refs | A+C+D | Complete ordered records; local files exist; actual contexts loaded |
| parser_version | A+B+E | Frozen version; actual parser constant for delta/failure; null for 001/017/018 |
| diff_version | A+B+E | Frozen version; actual diff constant for delta; null for 001/015..018 |
| byte_relation | A+B | Frozen enum; actual byte comparison for all 15 delta cases; reference/N/A otherwise |
| deterministic_result_kind | A+C | Frozen per case; selects payload compatibility, never evidence_kind alone |
| content_delta | B+C or A+C+E | B for 002..014/019/020; null for 001/015..018. Initial null gap, typed-equality gap, incomplete fact relationship |
| candidate_event_kind | A+C | Frozen event; delta membership/field/no-change relationship; rights remain gate |
| candidate_event_facts | A+B+C+D | Exact nested policy; delta identities/field values and parser failures; context consistency. Initial type/identity-relationship gaps |
| source_health_state | A+D | Frozen; SG-017 actual context consistency |
| rights_state_for_surface | A+C+D | Exact nested rights; PROMOTE attribution; SG-019 context. Initial numeric-boolean gap |
| expected_decision | A+C | Frozen decision plus legal reason/claim/caveat/rights combinations |
| decision_reason_code | A+C | Exact case reason plus decision vocabulary |
| materiality_rationale | A | Exact text; no threshold extension |
| expected_factual_claim | A+C+E | Exact approved claim or null; SG-020 fallback equals SG-004 |
| forbidden_claims | A | Exact ordered string list, including every element |
| required_evidence_refs | A+C+D | Exact ordered string list; frozen actual refs; SG-001 receipt and context consistency |
| required_caveats | A+C | Exact ordered string list; unresolved gate requires caveat |
| human_gold_reviewer | A | HUMAN_PROVENANCE |
| human_gold_reviewed_at | A | HUMAN_PROVENANCE |
| human_gold_rationale_version | A | HUMAN_PROVENANCE |
| claim_guard | A+C+D+E | SG-020 only, exact nested contract/context and SG-004 fallback; forbidden elsewhere |

There are 24 base fields and one SG-020-only field. Unknown case keys are E.

### Every nested case field and list element

| Object / applicability | Every allowed child | Authority |
| --- | --- | --- |
| evidence_refs[]: local records | role, type, path | A; C file existence; D context artifact where applicable |
| evidence_refs[]: SG-001 records | role, type, value, local_resolution_expected | A+C; false flag typed; no production resolution |
| candidate_event_facts: SG-001 | revision, sha256, bytes | A+C receipt consistency; exact integer bytes |
| candidate_event_facts: SG-002 | raw_bytes_differ | A+B; exact boolean |
| candidate_event_facts: SG-003 | normalization | A+B; trim-only parser behavior |
| candidate_event_facts: SG-004/005/008..014/019/020 | identity, field, before, after | A+B+C; entire observed change must match frozen event facts |
| candidate_event_facts: SG-006/007 | identity, membership | A+B+C; selected added/removed identity; full pair delta remains checked |
| candidate_event_facts: SG-015 | error_class, failure_mode | A+B; real SchemaError |
| candidate_event_facts: SG-016 | error_class, identity_column | A+B; real DuplicateRowIdentityError |
| candidate_event_facts: SG-017 | observation | A+D |
| candidate_event_facts: SG-018 | required_evidence_reconstructible | A+D; exact false |
| rights_state_for_surface: every case | surface, state | A+C; D for SG-019 |
| rights_state_for_surface: SG-001/004/006/008..012/019/020 | rights_record_ref | A; C for SG-001; D for SG-019 |
| rights_state_for_surface: SG-004/006/008..012/020 | attribution_required | A+C; exact true |
| content_delta: all CONTENT_DELTA cases | content_equal, added, removed, changed | B+C; exact serialized comparison including types and full lists |
| content_delta.added[], removed[] | Each identity string | B+C |
| content_delta.changed[] | identity, changes | B+C; full ordered rows/changes |
| content_delta.changed[].changes[] | field, before, after | B+C; exact strings, blank remains blank |
| claim_guard: SG-020 | candidate_wording, result, reason_code, prohibited_reason_codes, fallback_claim | A+C+D |
| claim_guard.prohibited_reason_codes[] | Each reason string | A+D; both causality and publisher-revision prohibitions |
| forbidden_claims[], required_evidence_refs[], required_caveats[] | Each string, ordering and cardinality | A |

These are per-case shapes, not unions that permit a child everywhere. All
unlisted children are E through exact object equality (A/D), or exact full
serialization comparison (B). No extra semantic dictionary key is ignored.

### Every controlled-context field

| Context | Every allowed field | Authority |
| --- | --- | --- |
| SG-017 | context_kind, controlled, not_publisher_history, source_health_state, observation, prohibition | A+D; C health and observation |
| SG-018 | context_kind, controlled, not_publisher_history, required_evidence_ref, required_evidence_available, observation | A+D; C unavailable evidence/gate |
| SG-019 | context_kind, controlled, not_publisher_history, intended_surface, rights_state, rights_record_ref, invariant | A+D; C manifest rights/event |
| SG-020 | context_kind, controlled, candidate_wording, result, reason_code, prohibited_reason_codes, fallback_claim | A+D; C guard and SG-004 fallback |
| SG-020 prohibited_reason_codes[] | Every reason string, order and cardinality | A+D |
| Independent context locator (not manifest data) | path, evidence_role, payload | A+D; fixed local path/role and full expected payload |

Context objects are closed; missing/extra keys fail. SG-020 has no
`not_publisher_history` field: adding one is forbidden, not silently allowed.

## Canonical content_delta semantics

| deterministic_result_kind | Cases | Required value / authority |
| --- | --- | --- |
| CONTENT_DELTA | SG-002..014, SG-019/020 | Non-null object, exact real parser/diff serialization (B), consistent with frozen facts (C) |
| REFERENCE_RECEIPT | SG-001 | null (A+C+E); verified receipt only, no production reads |
| PARSER_FAILURE | SG-015/016 | null (A+C+E); execute parser and require approved failure |
| CONTROLLED_CONTEXT | SG-017/018 | null (A+C+E); no trustworthy/reconstructible data observation |

Canonical policy does not contradict these rules. SG-019's evidence_kind
is CONTROLLED_CONTEXT but its deterministic_result_kind is CONTENT_DELTA:
it layers a rights gate on a real controlled delta. SG-020 likewise retains
the SG-004 delta. SG-002/003 use a non-null *empty* ContentDelta, distinct
from having no ContentDelta authority at all.

## Adversarial model fixed before implementation

| Attack class | At audited head | Required protection |
| --- | --- | --- |
| Contradictory allowed policy field / valid key with wrong value | Rejected except numeric boolean aliases | Typed A |
| Null/non-null contradiction for non-delta cases | Accepted | A+C+E |
| Missing/null/impossible CONTENT_DELTA | Behavioral suite rejects most; validator ignores it; numeric equality escapes some cases | C object requirement plus typed B |
| Parser failure carrying fake delta | Accepted SG-015/016 | A+C+E |
| Controlled context carrying fake delta | Accepted SG-017/018 | A+C+E |
| Reference receipt carrying fake asset change | Accepted SG-001 | A+C+E |
| Changed candidate facts alone | Rejected, except raw-byte numeric boolean | Typed A |
| Delta inconsistent with actual evidence | B rejects, except numeric equality | Typed B |
| Coordinated evidence/delta identity drift with original claim/facts | Accepted SG-008 reproduction | B+C full identity/field relationship |
| Nested extra semantic key | A/D reject; B rejects delta extras only in delta cases | A/B/D closure plus E non-delta |
| Rights/source-health contradiction | Rejected except typed alias boundary | Typed A+D |
| Cross-case evidence swap with same resulting delta | Rejected | A exact ordered references |
| Missing/extra/reordered case, provenance or metadata drift | Rejected | A+C closed inventory |

The existing 38 manifest / 26 context review attacks remain required, as do
the committed regression attacks. New tests must exercise every allowed
field and nested shape, rather than only repeating known examples.

## Smallest correction and completeness guard

- Freeze null only for the five non-delta cases; enforce kind/payload compatibility.
- Use type-sensitive recursive equality for frozen JSON values and behavioral comparisons.
- Retain real parser/diff recomputation, checking its whole output against the
  declaration and its entire event change against independently frozen facts.
- Add a test-only authority map covering root, base/optional case fields,
  nested shapes and contexts. Compare its keys with the allowed schema and
  verify that A entries have actual independent expected values. Fail when
  an allowed field is added without authority, including in nested objects.
- Add explicit required fake-delta attacks, numeric alias attacks, coordinated
  evidence/delta attacks, and systematic field/shape mutation regressions.

No policy decision, fixture, context, production resource, runtime, parser,
diff implementation or Notion content needs to change.

## Implemented verification

The correction follows the matrix above. The original 22 focused tests and
their prior adversarial mutations remain, with the common recomputation
test strengthened. The explicit authority inventory covers six root fields,
72 case/nested paths, and 27 context field/list paths. The meta-test also
demonstrates failure for a new base field, a new SG-020-only field, a new
nested fact, and removal of an independent frozen authority.

New negative checks passed:

- All five required non-delta cases reject the fake added-asset delta and
  six other non-null payloads (35 checks).
- 2,190 manifest value/type/removal/shape/list/nested-injection mutations
  reject through the policy gate or actual deterministic behavioral gate.
- 64 controlled-context mutations reject, including numeric boolean aliases.
- Four actual context-file substitutions prove that the validator loads
  artifacts from disk and rejects `controlled: 1`.
- All 15 ContentDelta cases reject coordinated fixture/delta drift against
  frozen event facts, including SG-008's previously accepted identity drift.
- A separate read-only exhaustive replay rejected all 378 distinct
  cross-case evidence-reference swaps. Identical reference lists, such as
  SG-006/007, are not mutations and are excluded.

Final commands (with JUnit receipts outside the repository):

| Command | Passed | Failed / errors | Skipped |
| --- | --- | --- | --- |
| `python -m pytest tests/argos_memory/test_signal_gold_set_v01.py -q` | 47 | 0 | 0 |
| `python -m pytest tests/argos_memory -q` | 97 | 0 | 0 |

Both ran against a newly initialized disposable PostgreSQL 17.11 cluster,
PostGIS 3.6.2 and pgcrypto 1.3, loopback `127.0.0.1:55447`, database
`niv45_invariant_test`. JUnit totals independently confirm zero errors,
failures and skips. The full suite reported 68 existing Alembic configuration
deprecation warnings. The database was dropped and the server stopped;
`pg_ctl status` confirms no server running. Execution policy blocked removal
of the stopped cluster directory outside the repository.

No production database, Railway resource, live ONS endpoint, production
snapshot or production credential was accessed. No runtime, API, UI,
migration, parser/diff, manifest policy, fixture, context or Notion content
changed. `git diff --check` passed. PR #14 remains open and unmerged;
NIV-45 remains In Review for ARGOS owner review.
