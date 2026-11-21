# ARGOS Source Registry v0

`source_id` identifies a reviewed resource. `policy_version` identifies a revision of its registry definition. Snapshots, Documents, timestamps of individual captures, content hashes and adapter versions stay with the evidence that owns them. Changing a current policy leaves the historical capture and its rights reference intact.

The initial resource is `ons.capacidade_geracao`. Its `local_archive` grant comes from NIV-13 and carries `NIV7-EXT-ONS-OPEN-DATA-2026-09-16` and the attribution requirement. `client_display` and `external_api` are held for this rollout. The records proposed for EIA Colorado residential prices and SEC Petrobras submissions in NIV-90 have no runtime grants. [NIV-11](https://linear.app/nivarenergy/issue/NIV-11) · [NIV-13](https://linear.app/nivarenergy/issue/NIV-13) · [NIV-74](https://linear.app/nivarenergy/issue/NIV-74) · [NIV-90](https://linear.app/nivarenergy/issue/NIV-90)

## Local registration and read

Point `DATABASE_URL` at a disposable Postgres with PostGIS, using the `postgresql+psycopg2` driver, and apply `python -m alembic upgrade head`. Register the ONS metadata once in an explicit transaction. The example makes zero source requests.

```python
from datetime import UTC, datetime
from os import environ

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from app.services.argos_source_registry import UsageChannel, read_source, register_source
from app.services.argos_source_registry.seed import ONS_CAPACITY_SOURCE

engine = create_engine(environ["DATABASE_URL"], hide_parameters=True)
with Session(engine) as session, session.begin():
    register_source(session, ONS_CAPACITY_SOURCE)
    decision = read_source(
        session, ONS_CAPACITY_SOURCE.source_id, UsageChannel.LOCAL_ARCHIVE, now=datetime.now(UTC)
    )
    assert decision.allowed and decision.source is not None
    print(decision.source.source_id, decision.source.policy_version, decision.source.health.status)
```

Initial output is `ons.capacidade_geracao 1 not_checked`. Registering the same ID again raises `SourceRegistryConflict`. Subsequent reads use the already-registered ID.

## Consumer contract

- A trusted internal caller requests an explicit channel and passes the current application time, including during a historical replay. `SourceDecision` carries the effective decision and reason. `source` is present only when allowed and contains the current `policy_version`, `.definition.rights` and `.health`. Recheck on each use, including before exposing historical evidence or serving previously projected material. A registry decision covers source policy. The caller still enforces user access, artifact disposition and downstream publication approval.
- `record_source_check` records a bounded success/failure observation for the exact `policy_version` and credential-free resource locator used. A Watch adapter should validate its response and coverage before reporting a success. The registry persists check status and UTC timestamps. Failed or stale checks leave the last success visible when one exists. A source may still be permitted for local archiving while `not_checked`, `broken` or `stale`. A content-change verdict requires a separate comparison of validated evidence.
- Pass a newly observed resource locator or notice version to `read_source` for a preflight decision. To persist a detected mismatch, report it with `record_source_check`. Drift holds the policy until an explicit `revise_source` from a trusted reviewer. A superseded policy version cannot accept a check. Omitting a notice observation means the caller has no fresh notice comparison. The registry performs no HTTP, notice monitoring or polling itself.
- `revise_source` appends a new definition with optimistic version checking. Denial can be represented by a channel grant, channel expiration, revocation, or a restricted source. Use `status="deleted"` for a terminal registry tombstone. The tombstone retains the ID and policy sequence for reference integrity. Evidence disposition and physical deletion of retained artifacts require their own authorized workflow. Source Registry stores policy metadata only.

ONS's 48-hour staleness threshold is an operational tolerance. It does not describe the publisher's update frequency or guarantee when new content is available. The notice identifier records the version reviewed in NIV-13. The legal CC BY version remains `unknown`.

To run the registry tests, set `ARGOS_SOURCE_REGISTRY_TEST_DATABASE_URL` to an empty disposable loopback PostgreSQL database with PostGIS using the same driver. Run `python -m pytest tests/argos_source_registry`. The persistence fixture upgrades and downgrades that database. The pure contract tests also run without a database.
