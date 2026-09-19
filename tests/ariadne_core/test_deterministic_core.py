"""Database-free tests for Ariadne's domain-neutral deterministic model."""

from __future__ import annotations

from copy import deepcopy
from types import SimpleNamespace

import pytest

from app.services.ariadne_core import (
    DETERMINISTIC_SCALAR_CONFIGURATION,
    DETERMINISTIC_SCALAR_IMPLEMENTATION,
    DETERMINISTIC_SCALAR_INPUT_CONTRACT,
    DETERMINISTIC_SCALAR_MODEL,
    DETERMINISTIC_SCALAR_OUTPUT_CONTRACT,
    DETERMINISTIC_SCALAR_SEMANTIC_VERSION,
    _execute_model_version,
    execute_deterministic_scalar,
)


def test_deterministic_scalar_multiplies_integer_inputs():
    assert execute_deterministic_scalar(
        state_payload={"value": 10},
        assumption_values={"multiplier": 2},
        execution_configuration=DETERMINISTIC_SCALAR_CONFIGURATION,
    ) == {"value": 20}


def test_deterministic_scalar_replays_identically():
    manifest = {
        "state_payload": {"value": 12},
        "assumption_values": {"multiplier": 2},
        "execution_configuration": DETERMINISTIC_SCALAR_CONFIGURATION,
    }
    assert execute_deterministic_scalar(**manifest) == execute_deterministic_scalar(**manifest)


def _registered_model_metadata(**overrides):
    metadata = {
        "semantic_version": DETERMINISTIC_SCALAR_SEMANTIC_VERSION,
        "implementation_identity": DETERMINISTIC_SCALAR_IMPLEMENTATION,
        "input_contract": deepcopy(DETERMINISTIC_SCALAR_INPUT_CONTRACT),
        "output_contract": deepcopy(DETERMINISTIC_SCALAR_OUTPUT_CONTRACT),
    }
    metadata.update(overrides)
    return SimpleNamespace(**metadata)


def test_registered_scalar_executor_requires_the_exact_versioned_metadata():
    assert _execute_model_version(
        SimpleNamespace(name=DETERMINISTIC_SCALAR_MODEL),
        _registered_model_metadata(),
        SimpleNamespace(payload={"value": 10}),
        SimpleNamespace(values={"multiplier": 2}),
        DETERMINISTIC_SCALAR_CONFIGURATION,
    ) == {"value": 20}


@pytest.mark.parametrize(
    ("definition_name", "version_overrides"),
    [
        ("unregistered_model", {}),
        (DETERMINISTIC_SCALAR_MODEL, {"semantic_version": "2.0.0"}),
        (DETERMINISTIC_SCALAR_MODEL, {"implementation_identity": "unknown"}),
        (DETERMINISTIC_SCALAR_MODEL, {"input_contract": {}}),
        (DETERMINISTIC_SCALAR_MODEL, {"output_contract": {}}),
    ],
)
def test_executor_metadata_drift_fails_closed(definition_name, version_overrides):
    with pytest.raises(ValueError, match="no registered deterministic executor"):
        _execute_model_version(
            SimpleNamespace(name=definition_name),
            _registered_model_metadata(**version_overrides),
            SimpleNamespace(payload={"value": 10}),
            SimpleNamespace(values={"multiplier": 2}),
            DETERMINISTIC_SCALAR_CONFIGURATION,
        )


@pytest.mark.parametrize(
    ("state", "assumptions", "configuration"),
    [
        ({"value": 1.5}, {"multiplier": 2}, DETERMINISTIC_SCALAR_CONFIGURATION),
        ({"value": 1}, {"multiplier": True}, DETERMINISTIC_SCALAR_CONFIGURATION),
        ({"value": 1}, {"multiplier": 2}, {}),
        ({"value": 1}, {"multiplier": 2}, {"arithmetic": "floating"}),
    ],
)
def test_deterministic_scalar_rejects_inputs_outside_its_versioned_contract(
    state, assumptions, configuration
):
    with pytest.raises(ValueError):
        execute_deterministic_scalar(
            state_payload=state,
            assumption_values=assumptions,
            execution_configuration=configuration,
        )
