"""Unit tests for the deterministic core of the day-streak (Peça D).

No database involved. ``compute_streak_from_days`` is deliberately pure:
the caller has already decided which event types count and which zone
names the day, so everything tested here is arithmetic over a set of
calendar days — runs, the record's end date, and the difference between
a measured zero and an absence.

The zone bucketing itself is SQL (``occurred_at AT TIME ZONE :tz``) and
is covered end-to-end in ``test_progress_reads.py``, which needs a real
Postgres. Two guards at the bottom of this file are the cheap part of
that: they assert the module no longer contains the UTC-clock rule the
bucketing replaced, and they run anywhere.
"""

from __future__ import annotations

from datetime import date

import pytest

from app.db.models.progress import (
    DEFAULT_LEARNER_TIMEZONE,
    EVENT_TYPES,
    PRACTICE_EVENT_TYPES,
    STREAK_EVENT_TYPES,
)
from app.services import progress_service
from app.services.progress_service import compute_streak_from_days, normalize_timezone


def d(day: int, month: int = 9, year: int = 2026) -> date:
    return date(year, month, day)


# --- Which event types count -------------------------------------------


def test_badge_conquistado_does_not_count_toward_the_streak():
    """The machine's own congratulation cannot extend the learner's streak."""
    assert "badge_conquistado" in EVENT_TYPES
    assert "badge_conquistado" not in STREAK_EVENT_TYPES


def test_streak_types_are_the_four_real_learner_actions():
    assert set(STREAK_EVENT_TYPES) == {
        "aula_iniciada",
        "aula_concluida",
        "instrumento_usado",
        "exercicio_respondido",
    }


def test_streak_types_are_a_subset_of_the_check_constraint_vocabulary():
    # Anything here that the DB CHECK rejects could never be written, so a
    # drift between the two lists would silently shorten every streak.
    assert set(STREAK_EVENT_TYPES) <= set(EVENT_TYPES)


def test_practice_types_are_the_two_attempt_events():
    assert set(PRACTICE_EVENT_TYPES) == {"instrumento_usado", "exercicio_respondido"}
    assert set(PRACTICE_EVENT_TYPES) <= set(EVENT_TYPES)
    # Opening or finishing a lesson is Percorrido, not Praticado (bar.md §S3).
    assert "aula_iniciada" not in PRACTICE_EVENT_TYPES
    assert "aula_concluida" not in PRACTICE_EVENT_TYPES


# --- The empty case: absence, not zero ----------------------------------


def test_no_days_at_all_is_absence_and_not_a_zero_day_streak():
    facts = compute_streak_from_days([], today=d(20))
    assert facts.has_record is False
    assert facts.current_streak_days is None
    assert facts.longest_streak_days is None
    assert facts.last_active_date is None
    assert facts.longest_streak_ended_on is None


def test_a_broken_streak_is_a_measured_zero_and_not_an_absence():
    # Studied, then stopped for a week. That is a real zero — the learner
    # has a record, and the current run is empty. Distinct from above.
    facts = compute_streak_from_days([d(1), d(2)], today=d(20))
    assert facts.has_record is True
    assert facts.current_streak_days == 0
    assert facts.longest_streak_days == 2
    assert facts.last_active_date == d(2)


# --- Runs ---------------------------------------------------------------


def test_single_day_today_is_a_one_day_streak():
    facts = compute_streak_from_days([d(20)], today=d(20))
    assert (facts.current_streak_days, facts.longest_streak_days) == (1, 1)
    assert facts.longest_streak_ended_on == d(20)


def test_repeated_days_collapse_to_one_day():
    # Several events in one calendar day are one day of study, not several.
    facts = compute_streak_from_days([d(20), d(20), d(20)], today=d(20))
    assert facts.current_streak_days == 1


def test_consecutive_days_accumulate():
    facts = compute_streak_from_days([d(18), d(19), d(20)], today=d(20))
    assert facts.current_streak_days == 3
    assert facts.longest_streak_days == 3
    assert facts.last_active_date == d(20)


def test_a_gap_of_one_missed_day_breaks_the_run():
    facts = compute_streak_from_days([d(16), d(18), d(19), d(20)], today=d(20))
    assert facts.current_streak_days == 3  # 18-19-20, not 4
    assert facts.longest_streak_days == 3


def test_yesterday_keeps_the_streak_alive_through_today():
    # Studied yesterday, has not studied yet today. The streak is alive
    # until the day after the last study day ends.
    facts = compute_streak_from_days([d(18), d(19)], today=d(20))
    assert facts.current_streak_days == 2


def test_two_days_of_silence_ends_the_current_streak():
    facts = compute_streak_from_days([d(17), d(18)], today=d(20))
    assert facts.current_streak_days == 0
    assert facts.longest_streak_days == 2  # the record survives the break


# --- The record's end date — the field that used to be unknowable -------


def test_longest_streak_reports_the_day_it_ended():
    days = [d(1), d(2), d(3), d(4), d(5), d(10), d(19), d(20)]
    facts = compute_streak_from_days(days, today=d(20))
    assert facts.longest_streak_days == 5
    assert facts.longest_streak_ended_on == d(5)
    # …and that is NOT the last active day, which is what a naive
    # implementation would print next to "longest streak".
    assert facts.last_active_date == d(20)
    assert facts.current_streak_days == 2


def test_longest_streak_end_date_ties_resolve_to_the_earliest_run():
    # Two runs of three. The record was first set by the earlier one.
    days = [d(1), d(2), d(3), d(10), d(11), d(12)]
    facts = compute_streak_from_days(days, today=d(12))
    assert facts.longest_streak_days == 3
    assert facts.longest_streak_ended_on == d(3)


def test_current_run_that_is_also_the_record_ends_on_the_last_active_day():
    days = [d(16), d(17), d(18), d(19), d(20)]
    facts = compute_streak_from_days(days, today=d(20))
    assert facts.longest_streak_days == 5
    assert facts.longest_streak_ended_on == d(20)
    assert facts.last_active_date == d(20)


def test_days_out_of_order_are_sorted_before_the_run_is_computed():
    facts = compute_streak_from_days([d(20), d(18), d(19)], today=d(20))
    assert facts.current_streak_days == 3


def test_runs_cross_month_boundaries():
    days = [date(2026, 8, 30), date(2026, 8, 31), date(2026, 9, 1)]
    facts = compute_streak_from_days(days, today=date(2026, 9, 1))
    assert facts.current_streak_days == 3
    assert facts.longest_streak_ended_on == date(2026, 9, 1)


# --- Timezone naming ----------------------------------------------------


def test_default_zone_is_the_one_the_contract_declares():
    assert DEFAULT_LEARNER_TIMEZONE == "America/Sao_Paulo"
    assert normalize_timezone(None) == "America/Sao_Paulo"
    assert normalize_timezone("  ") == "America/Sao_Paulo"


def test_an_explicit_zone_is_kept():
    assert normalize_timezone("UTC") == "UTC"
    assert normalize_timezone("America/Argentina/Buenos_Aires") == (
        "America/Argentina/Buenos_Aires"
    )


@pytest.mark.parametrize(
    "bogus",
    ["'; DROP TABLE progress_event; --", "America/Sao Paulo", "../etc", "x" * 65],
)
def test_a_bogus_zone_is_refused_before_it_reaches_the_database(bogus):
    with pytest.raises(ValueError):
        normalize_timezone(bogus)


# --- Regression guards against the UTC-clock rule this replaced ---------


def test_the_streak_is_no_longer_computed_from_the_database_clock_day():
    """``CURRENT_DATE`` was the defect: the database's day, in UTC.

    Cheap and blunt on purpose — it runs without Postgres and would have
    caught the original bug. The behavioural proof (22:00 in Brasília
    counting as one day, not two) is in ``test_progress_reads.py``.
    """
    import inspect

    source = inspect.getsource(progress_service)
    body = source.split('"""', 2)[-1]  # skip the module docstring, which names it
    assert "CURRENT_DATE" not in body


def test_the_day_bucketing_names_a_zone_explicitly():
    sql = str(progress_service._LOCAL_STUDY_DAYS_SQL)
    assert "AT TIME ZONE" in sql
    assert ":tz" in sql


def test_the_streak_query_filters_to_the_counting_event_types():
    sql = str(progress_service._LOCAL_STUDY_DAYS_SQL)
    assert "event_type IN" in sql
