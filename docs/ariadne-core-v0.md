# Ariadne Core v0

NIV-46 adds the smallest case-independent Ariadne execution spine:

```text
EvidenceRef
  → immutable PrivateStateVersion
  → immutable AssumptionSetVersion
  → immutable Scenario
  → immutable ModelVersion
  → immutable ModelRun manifest
  → immutable Result
```

The invariant is: **current state may advance; historical ModelRuns remain
bound to the exact versions they actually used.** A correction appends a new
state version that supersedes the prior version. It never edits the prior row.
The current-state view resolves the lineage head, while a historical run keeps
its original state-version ID.

## Boundaries that stay explicit

- Observed state is not an assumption. They have separate stable identities
  and separate immutable version tables.
- A scenario is not observed state. It references an observed state version
  and an assumption-set version, and stores hypothetical state separately.
- A model definition is not a model version. The definition is stable identity;
  a version fixes implementation identity and input/output contracts.
- A model version is not a ModelRun. The run is the execution manifest that
  records the exact model, scenario, state, assumptions, and configuration.
- A correction is not mutation of historical state. Corrections append and
  point to the version they supersede.
- Reconstructibility is not reproducibility. `reconstruct_result_lineage`
  returns the exact stored chain from a result ID; `replay_result` separately
  executes that historical manifest and compares the new output with the
  stored result.

## Persistence and isolation

The implementation uses the repository's PostgreSQL, SQLAlchemy, and Alembic
stack. Composite foreign keys carry `tenant_id` across every private link, so
knowing an ID does not authorize cross-tenant resolution. Evidence is referenced
by source identity, source/content version, locator, typed time, and optional
transform reference; this does not grant permission to dereference source data.

PostgreSQL triggers reject updates and deletes to Ariadne lineage tables. The
v0 service appends records and flushes them but leaves transaction ownership to
its caller, consistent with existing backend services.

## Deliberate v0 limits

The only executable model is a domain-neutral integer scalar multiplication:
`state.value × assumptions.multiplier`. There is no energy-domain schema, API,
UI, ingestion pipeline, graph database, workflow engine, AI, authorization
system, or generic model builder. Scenarios bind one state version in v0; the
kernel can grow a multi-state binding table when a real reference case proves
that need.
