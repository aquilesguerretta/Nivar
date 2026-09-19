"""Database-free tests for Ariadne's domain-neutral deterministic model."""

from __future__ import annotations

import pytest

from app.services.ariadne_core import (
    DETERMINISTIC_SCALAR_CONFIGURATION,
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
