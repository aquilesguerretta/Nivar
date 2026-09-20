"""Inventory the review package without deleting evidence or staging Git files."""
from pathlib import Path
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parents[4]
PACKAGE = ROOT / "docs/g2-dream-build/g2-2"
OUTPUT = PACKAGE / "verification"
RAW_PATTERNS = [
    r"critics/craft-hero-01/(?:desktop|mobile|cred|media|must)-1x/.*",
    r"critics/craft-hero-03/(?:iteration07/)?captures/(?:desktop|mobile|reference-cred|reference-must|must-buffered)-\d+\.png",
    r"critics/craft-system-01/(?:ariadne|terminal|finale)-(?:desktop|phone)-\d+\.png",
    r"critics/craft-system-01/reference-(?:cred|must)-\d+\.png",
    r"terminal/ariadne-context-iteration\d+/(?:1440|390)-frames/.*",
    r".*(?:__pycache__|\.cache)/.*",
]


def main():
    # Keep any precise image cited by a written critique, even if it is a raw frame.
    cited = set()
    for doc in PACKAGE.rglob("*.md"):
        for target in re.findall(r"\]\(([^)]+)\)", doc.read_text(encoding="utf-8", errors="replace")):
            if target.startswith(("http:", "https:", "#")):
                continue
            target = target.strip("<>").split("#")[0]
            resolved = Path(target) if re.match(r"^[A-Za-z]:", target) else doc.parent / target
            cited.add(resolved.resolve())
    include, exclude = [], []
    for p in sorted(PACKAGE.rglob("*")):
        if not p.is_file() or p.name in {"artifact-manifest.json", "staging-paths.txt"}:
            continue
        relative = p.relative_to(PACKAGE).as_posix()
        reason = "redundant raw capture frames; selected stills, sheets, videos and timing logs retained"
        raw = any(re.fullmatch(pattern, relative) for pattern in RAW_PATTERNS)
        if relative == "real-brazil/originals/itaipu-generator-hall.jpg":
            raw = True
            reason = "unused research candidate with unresolved license conflict; provenance record retained"
        if p.resolve() in cited and relative != "real-brazil/originals/itaipu-generator-hall.jpg":
            raw = False
        record = {"path": p.relative_to(ROOT).as_posix(), "bytes": p.stat().st_size,
                  "sha256": hashlib.sha256(p.read_bytes()).hexdigest()}
        if raw:
            record["reason"] = reason
            exclude.append(record)
        else:
            include.append(record)
    manifest = {"scope": "G2.2 review artifacts only; no runtime files or prior G2.1 package",
                "policy": "No evidence deleted. Excluded originals remain in the local workspace.",
                "rawPatterns": RAW_PATTERNS, "included": include, "localOnly": exclude,
                "includedBytes": sum(p["bytes"] for p in include),
                "localOnlyBytes": sum(p["bytes"] for p in exclude)}
    (OUTPUT / "artifact-manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    paths = [p["path"] for p in include] + ["docs/g2-dream-build/g2-2/verification/artifact-manifest.json", "docs/g2-dream-build/g2-2/verification/staging-paths.txt"]
    (OUTPUT / "staging-paths.txt").write_text("\n".join(paths) + "\n", encoding="utf-8")
    print(json.dumps({"includedFiles": len(paths), "includedBytes": manifest["includedBytes"],
                      "localOnlyFiles": len(exclude), "localOnlyBytes": manifest["localOnlyBytes"]}))


if __name__ == "__main__":
    main()
