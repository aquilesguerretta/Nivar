"""Run a single, explicitly authorized development smoke check."""

import argparse
from collections import Counter

from .client import EdgarClient, EdgarConfigurationError, EdgarRequestError
from .metadata import EdgarPayloadError


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--allow-live", action="store_true")
    args = parser.parse_args()
    try:
        with EdgarClient(allow_live=args.allow_live) as client:
            counts = Counter(change.kind for change in client.poll().changes)
    except (EdgarConfigurationError, EdgarRequestError, EdgarPayloadError) as error:
        parser.exit(1, f"{error}\n")
    print(f"SEC submissions smoke succeeded. New metadata records: {counts['new']}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
