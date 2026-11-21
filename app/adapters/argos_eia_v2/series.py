"""Fixed source scope, query parameters and validation for EIA retail prices."""

from __future__ import annotations

import json
import re
from dataclasses import dataclass
from datetime import date, timedelta
from typing import Any, Literal, NewType, NoReturn

SourceId = NewType("SourceId", str)
SOURCE_ID = SourceId("eia.electricity.retail_sales.co.res.price.monthly")
CANONICAL_ROUTE = "https://api.eia.gov/v2/electricity/retail-sales/data"
ADAPTER_VERSION = "0.1.0"
UNIT = "cents per kilowatthour"
FREQUENCY = "monthly"
DATE_FORMAT = "YYYY-MM"
MAX_MONTHS = 13
MAX_RESPONSE_BYTES = 128 * 1024
FACETS = (("stateid", "CO"), ("sectorid", "RES"))
PRICE_PATTERN = re.compile(r"[0-9]{1,12}(?:\.[0-9]{1,12})?")
MONTH_PATTERN = re.compile(r"[0-9]{4}-(?:0[1-9]|1[0-2])")
API_VERSION_PATTERN = re.compile(r"2\.[0-9]{1,3}\.[0-9]{1,3}")
Coverage = Literal["observed", "missing_row", "missing_value", "unverified"]


def _month_index(period: str) -> int:
    if not isinstance(period, str) or not MONTH_PATTERN.fullmatch(period):
        raise ValueError("expected a reference period in YYYY-MM")
    year, month = map(int, period.split("-"))
    return year * 12 + month - 1


@dataclass(frozen=True)
class Window:
    """Inclusive reference months of a single request."""

    start: str
    end: str

    def __post_init__(self) -> None:
        start, end = _month_index(self.start), _month_index(self.end)
        if start < 2001 * 12 or not 1 <= end - start + 1 <= MAX_MONTHS:
            raise ValueError(f"choose 1–{MAX_MONTHS} ordered months starting in 2001 or later")

    @property
    def periods(self) -> tuple[str, ...]:
        return tuple(
            f"{index // 12:04d}-{index % 12 + 1:02d}"
            for index in range(_month_index(self.start), _month_index(self.end) + 1)
        )

    def query(self) -> tuple[tuple[str, str], ...]:
        # EIA compares a YYYY-MM token before the first day of that month.
        # The day before the first month and day one of the final month bracket it.
        before_start = date.fromisoformat(f"{self.start}-01") - timedelta(days=1)
        return (
            ("frequency", FREQUENCY),
            ("data[]", "price"),
            *((f"facets[{name}][]", value) for name, value in FACETS),
            ("start", before_start.isoformat()),
            ("end", f"{self.end}-01"),
            ("sort[0][column]", "period"),
            ("sort[0][direction]", "asc"),
            ("offset", "0"),
            ("length", str(len(self.periods))),
        )


def _unique_object(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    obj = dict(pairs)
    if len(obj) != len(pairs):
        raise ValueError("duplicate JSON keys")
    return obj


def _invalid_constant(_: str) -> NoReturn:
    raise ValueError("nonstandard JSON constant")


@dataclass(frozen=True)
class PricePage:
    prices: dict[str, str | None]
    api_version: str | None


def parse_prices(body: bytes, window: Window) -> PricePage:
    """Validate the whole page before its rows can reach the version chain."""
    if len(body) > MAX_RESPONSE_BYTES:
        raise ValueError("response exceeds the pilot limit")
    document = json.loads(
        body.decode("utf-8"), object_pairs_hook=_unique_object, parse_constant=_invalid_constant
    )
    if not isinstance(document, dict) or {"error", "warning", "warnings"} & document.keys():
        raise ValueError("unexpected API envelope")
    api_version = document.get("apiVersion")
    if api_version is not None and (
        not isinstance(api_version, str) or not API_VERSION_PATTERN.fullmatch(api_version)
    ):
        raise ValueError("unexpected API version")
    response = document.get("response")
    if (
        not isinstance(response, dict)
        or {"error", "warning", "warnings"} & response.keys()
        or response.get("frequency") != FREQUENCY
        or response.get("dateFormat") != DATE_FORMAT
    ):
        raise ValueError("unexpected API response")

    rows = response.get("data")
    total = response.get("total")
    periods = set(window.periods)
    if (
        not isinstance(rows, list)
        or len(rows) > len(periods)
        or not isinstance(total, str)
        or total != str(len(rows))
    ):
        raise ValueError("row count does not match the bounded query")

    prices: dict[str, str | None] = {}
    for row in rows:
        if not isinstance(row, dict):
            raise ValueError("expected an observation object")
        period = row.get("period")
        if (
            not isinstance(period, str)
            or period not in periods
            or period in prices
            or any(row.get(name) != value for name, value in FACETS)
            or row.get("price-units") != UNIT
            or "price" not in row
        ):
            raise ValueError("unexpected observation identity or unit")
        price = row["price"]
        if price is not None and (
            not isinstance(price, str) or not PRICE_PATTERN.fullmatch(price)
        ):
            raise ValueError("expected a nonnegative decimal string or explicit null")
        prices[period] = price
    return PricePage(prices, api_version)
