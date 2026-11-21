"""Run the v0 projection against the merged local journeys."""

import json
import subprocess
from datetime import date, datetime, timezone
from pathlib import Path

import pytest

from app.services.argos_knowledge_projection import Capability, ReadContext, VersionRef
from app.services.argos_knowledge_projection.journeys import from_merged_journeys


CURRENT = ReadContext(date(2026, 11, 20))
SOLAR = "technology:solar-pv"
TOPCON = "variant:solar-pv:c-si:topcon"
WAFER = "element:solar-pv:wafer"
CHINA = "country:CHN"


@pytest.fixture(scope="module")
def snapshot():
    exporter = Path(__file__).with_name("export-merged-journeys.mjs")
    output = subprocess.run(
        ["node", str(exporter)], check=True, capture_output=True, encoding="utf-8", timeout=20,
    )
    return json.loads(output.stdout)


@pytest.fixture(scope="module")
def projection(snapshot):
    # These grants exercise the resolver against the checked-in local catalogs.
    # They represent fixture authorization and are never part of the adapter.
    return from_merged_journeys(
        snapshot, rights=lambda source, document, channel, use: use in {
            Capability.FACT, Capability.EVIDENCE_METADATA, Capability.EVIDENCE_LINK,
        },
    )


def read_ok(result):
    assert result["status"] == "RESOLVED", result
    return result["data"]


def relations(model, object_id):
    return read_ok(model.read_object(object_id, CURRENT))["relations"]


def test_j1_ancestry_wafer_china_share_and_search(projection, snapshot):
    assert {row["to"] for row in relations(projection, SOLAR) if row["from"] == SOLAR} >= {
        "variant:solar-pv:c-si", snapshot["j4"]["tandem"],
    }
    assert any(edge["to"] == WAFER for edge in relations(projection, TOPCON))
    wafer_pin = next(edge["fact"] for edge in relations(projection, WAFER) if edge["from"] == CHINA)
    assert wafer_pin in read_ok(projection.read_object(CHINA, CURRENT))["facts"]
    pin = VersionRef(**wafer_pin)
    read = read_ok(projection.read_fact(pin, CURRENT))
    expected = snapshot["j1"]["catalog"]["observations"][pin.id]["versions"][0]
    assert read["value"]["value"] == expected["estimate"]
    assert read["value"]["basis"]["reference_period"] == str(expected["referenceYear"])
    assert read["value"]["kind"] == "estimated"
    assert "evidence" not in read and "official_url" not in json.dumps(read)
    chain = read_ok(projection.read_evidence(pin, CURRENT))["evidence"]
    assert chain[0]["source"]["id"] == "source:iea"
    assert chain[0]["document"]["ref"] == {
        "id": expected["documentRef"], "version": str(expected["documentVersion"]),
    }
    groups = read_ok(projection.search("china wafers 2024", CURRENT))["groups"]
    assert [(group["type"], [item["id"] for item in group["items"]]) for group in groups] == [
        ("Country", [CHINA]), ("TechnologyElement", [WAFER]),
    ]


def test_j3_event_original_document_material_applications_and_country(projection, snapshot):
    case = snapshot["j3"]
    event_id = case["event"]["id"]
    assert read_ok(projection.search("mofcom", CURRENT))["groups"][0]["items"][0]["id"] == event_id
    event = read_ok(projection.read_object(event_id, CURRENT))
    assert event["type"] == "Event"
    assert {row["to"] for row in event["relations"]} == {CHINA, case["material"]["id"]}
    original = case["documents"]["april"]
    pin = VersionRef(case["event"]["claim"]["id"], "1")
    chain = read_ok(projection.read_evidence(pin, CURRENT))["evidence"]
    assert chain[0]["document"]["ref"] == {"id": original["id"], "version": str(original["version"])}
    assert chain[0]["document"]["language"] == "zh-CN"
    assert chain[0]["document"]["authority"] == "original"
    assert chain[0]["document"]["known_at"] is None
    application_edges = [
        relation for relation in relations(projection, case["material"]["id"])
        if relation["predicate"] == "material_application"
    ]
    assert {row["to"] for row in application_edges} == {
        case["applications"]["motor"]["id"], case["applications"]["generator"]["id"],
    }
    assert len({VersionRef(**row["fact"]) for row in application_edges}) == 1
    assert projection.read_object("j3:country:CHN", CURRENT) == projection.read_object(CHINA, CURRENT)
    assert projection.read_object("China", CURRENT)["status"] == "UNRESOLVED"
    assert projection.read_object("j3:country:chn", CURRENT)["status"] == "UNRESOLVED"
    assert all(event_id not in (row["from"], row["to"]) for row in relations(projection, TOPCON))
    assert projection.read_object(event_id, ReadContext(date(2025, 4, 3)))["status"] == "UNKNOWN"


def test_j4_reuses_topcon_and_replays_native_publication_pins(projection, snapshot):
    j4 = snapshot["j4"]
    tandem = j4["tandem"]
    topcon_links = [row for row in relations(projection, TOPCON) if row["predicate"] == "milestone_bottom_cell_variant"]
    assert len(topcon_links) == 2
    for edge in topcon_links:
        pin = edge["fact"]
        assert pin in read_ok(projection.read_object(tandem, CURRENT))["facts"]
        assert pin in read_ok(projection.read_object(edge["from"], CURRENT))["facts"]

    prototype = next(item for item in j4["milestones"] if item["id"].endswith("ise-oxford-prototype"))
    newer, earlier = prototype["versions"]
    pins = [VersionRef(row["id"], row["version"]) for row in (newer, earlier)]
    released = [read_ok(projection.read_fact(pin, CURRENT)) for pin in pins]
    assert released[0]["value"]["value"] == released[1]["value"]["value"]
    assert released[0]["value"]["uncertainty"] is not None
    assert released[1]["value"]["uncertainty"] is None
    assert released[0]["value"]["additional_measurements"][0]["metric"] == newer["metrics"][1]["kind"]
    assert released[0]["supersedes"] == pins[1].version
    for pin, native in zip(pins, (newer, earlier), strict=True):
        document = read_ok(projection.read_evidence(pin, CURRENT))["evidence"][0]["document"]
        assert document["ref"] == {"id": native["evidence"][0]["documentId"], "version": native["evidence"][0]["version"]}
    issued = ReadContext(CURRENT.as_of, datetime(2026, 11, 20, tzinfo=timezone.utc))
    assert projection.read_fact(pins[0], issued)["reason"] == "knowledge_date_unrecorded"


def test_merged_journeys_fail_closed_without_policy_and_leave_real_j2_unavailable(snapshot):
    model = from_merged_journeys(snapshot)
    event_id = snapshot["j3"]["event"]["id"]
    assert model.read_object(event_id, CURRENT) == {"status": "RESTRICTED", "reason": "use_denied", "data": None}
    assert read_ok(model.search("MOFCOM", CURRENT))["groups"] == []
    assert read_ok(model.search("china wafers 2024", CURRENT))["groups"] == []
    assert read_ok(model.search("Petrobras", CURRENT))["groups"] == []
    assert not read_ok(model.read_object(TOPCON, CURRENT))["facts"]
