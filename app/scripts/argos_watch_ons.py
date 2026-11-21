"""Run the explicit, synthetic-only ONS Source Watch from the repository root."""

import argparse
import json

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.services.argos_source_watch.rights import synthetic_archive_policy
from app.services.argos_source_watch.worker import SourceWatch, WatchConfig

# Deliberately independent of DATABASE_URL, .env, and the application's pool.
DISPOSABLE_DATABASE = "postgresql://argos_watch@127.0.0.1:54884/argos_watch_test"


def _emit(report: dict) -> None:
    print(json.dumps(report, ensure_ascii=True), flush=True)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__, allow_abbrev=False)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--once", action="store_true", help="perform one check")
    mode.add_argument("--run", action="store_true", help="opt in to a foreground schedule")
    parser.add_argument("--synthetic-url", required=True, help="fixture URL on http://127.0.0.1:5284")
    parser.add_argument("--checks", type=int, help="stop a scheduled run after this many ticks")
    parser.add_argument("--interval-seconds", type=float, default=60)
    parser.add_argument("--jitter-seconds", type=float, default=5)
    parser.add_argument("--stale-after-seconds", type=float, default=180)
    parser.add_argument("--timeout-seconds", type=float, default=5)
    parser.add_argument("--attempts", type=int, default=3)
    args = parser.parse_args(argv)
    if args.checks is not None and (args.checks < 1 or args.once):
        parser.error("--checks requires --run and a positive count")

    engine = create_engine(
        DISPOSABLE_DATABASE,
        connect_args={
            "hostaddr": "127.0.0.1",
            "connect_timeout": 3,
            "options": "-c statement_timeout=5000",
        },
    )
    try:
        try:
            watch = SourceWatch(
                args.synthetic_url,
                sessionmaker(engine),
                WatchConfig(
                    args.interval_seconds, args.jitter_seconds, args.stale_after_seconds,
                    args.timeout_seconds, args.attempts,
                ),
                policy=synthetic_archive_policy(args.synthetic_url),
            )
        except ValueError as exc:
            parser.error(str(exc))

        _emit(watch.report())
        report = None
        for report in watch.run(1 if args.once else args.checks):
            _emit(report)
        return int(report is None or "evidence" not in report)
    except KeyboardInterrupt:
        return 130
    finally:
        engine.dispose()


if __name__ == "__main__":
    raise SystemExit(main())
