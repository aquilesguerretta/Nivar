"""Internal Petrobras EDGAR submissions pilot (NIV-88)."""

from .client import EdgarClient, EdgarConfigurationError, EdgarRequestError, PollResult
from .metadata import SOURCE, FilingChange, FilingMetadata, FilingVersion, EdgarPayloadError

__all__ = [
    "SOURCE",
    "EdgarClient",
    "EdgarConfigurationError",
    "EdgarPayloadError",
    "EdgarRequestError",
    "FilingChange",
    "FilingMetadata",
    "FilingVersion",
    "PollResult",
]
