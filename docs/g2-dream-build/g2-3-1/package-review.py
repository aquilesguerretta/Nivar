"""Select and verify the G2.3.1 owner review; create ZIP only with a final receipt.

No third-party Python modules. No source mutation, git staging or git commit.
Paths inside the ZIP preserve the repository layout. The root index is an entry
link, and package-manifest.json records the exact bytes included in the archive.
"""

from __future__ import annotations

import argparse
from fnmatch import fnmatch
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import subprocess
from urllib.parse import unquote, urlsplit
from zipfile import ZIP_DEFLATED, ZipFile


HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
SPEC_PATH = HERE / "compact-package-spec.json"


def repo_path(path: Path) -> str:
    return path.resolve().relative_to(ROOT).as_posix()


def contained(path: Path) -> Path:
    resolved = path.resolve()
    if not resolved.is_relative_to(ROOT):
        raise ValueError(f"Path leaves repository: {path}")
    return resolved


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def package_bytes(path: Path, spec: dict) -> bytes:
    data = path.read_bytes()
    replacements = spec.get("portableHtmlRewrites", {}).get(repo_path(path), {})
    if replacements:
        content = data.decode("utf-8-sig")
        for original, portable in replacements.items():
            if content.count(original) != 1:
                raise ValueError(f"Expected exactly one portable-link replacement in {path}")
            content = content.replace(original, portable)
        return content.encode("utf-8")
    return data


class LocalReferences(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.refs: set[str] = set()

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        for name, value in attrs:
            if name in {"href", "src", "poster"} and value:
                self.refs.add(value)
            elif name == "srcset" and value:
                self.refs.update(entry.strip().split()[0] for entry in value.split(","))


def selected_files(spec: dict) -> tuple[list[Path], list[str]]:
    chosen: set[Path] = set()
    missing: list[str] = []
    for pattern in spec["include"]:
        matches = [contained(path) for path in ROOT.glob(pattern) if path.is_file()]
        if not matches and not any(char in pattern for char in "*?["):
            missing.append(pattern)
        chosen.update(matches)
    for list_name in spec.get("includeLists", []):
        listing = contained(ROOT / list_name)
        if not listing.is_file():
            missing.append(list_name)
            continue
        chosen.add(listing)
        for line in listing.read_text(encoding="utf-8-sig").splitlines():
            name = line.strip()
            if not name or name.startswith("#"):
                continue
            item = contained(listing.parent / name)
            if item.is_file():
                chosen.add(item)
            else:
                missing.append(repo_path(item))
    chosen = {
        path for path in chosen
        if not any(fnmatch(repo_path(path), pattern) for pattern in spec.get("exclude", []))
    }
    return sorted(chosen, key=repo_path), sorted(set(missing))


def audit_html(files: list[Path], delivery: dict | None, spec: dict) -> list[dict]:
    selected = set(files)
    broken: list[dict] = []
    for source in files:
        if source.suffix.lower() != ".html":
            continue
        parser = LocalReferences()
        parser.feed(package_bytes(source, spec).decode("utf-8-sig"))
        for reference in sorted(parser.refs):
            parsed = urlsplit(reference)
            if parsed.scheme or parsed.netloc or not parsed.path:
                continue
            if parsed.path.startswith("/"):
                broken.append({"source": repo_path(source), "reference": reference,
                               "reason": "Root-absolute URL is not portable"})
                continue
            try:
                target = contained(source.parent / unquote(parsed.path))
            except ValueError:
                broken.append({"source": repo_path(source), "reference": reference,
                               "reason": "Path leaves package"})
                continue
            if target not in selected:
                broken.append({"source": repo_path(source), "reference": reference,
                               "target": repo_path(target), "reason": "Not selected"})
    if delivery:
        for entry in delivery.get("evidence", []):
            if not isinstance(entry, dict) or not isinstance(entry.get("path"), str):
                continue
            target = contained(HERE / entry["path"])
            if target not in selected:
                broken.append({"source": repo_path(HERE / "delivery.json"),
                               "reference": entry["path"], "target": repo_path(target),
                               "reason": "Dynamic evidence not selected"})
    return broken


def read_delivery(spec: dict, required: bool) -> dict | None:
    path = contained(ROOT / spec["delivery"])
    if not path.exists():
        if required:
            raise ValueError("delivery.json is required after the final commit; ZIP not created.")
        return None
    delivery = json.loads(path.read_text(encoding="utf-8-sig"))
    if required:
        for key in ("startingHead", "finalHead"):
            if not re.fullmatch(r"[0-9a-f]{40}", str(delivery.get(key, ""))):
                raise ValueError(f"delivery.json needs a complete 40-character {key}.")
        if delivery["startingHead"] != spec["startingHead"]:
            raise ValueError("Starting HEAD does not match the real baseline.")
        if delivery.get("branch") != spec["branch"]:
            raise ValueError("Branch does not match the owner's working branch.")
        if not isinstance(delivery.get("changedFiles"), list) or not delivery["changedFiles"]:
            raise ValueError("delivery.json needs the exact nonempty changedFiles list.")
        observed = subprocess.check_output(
            ["git", "rev-parse", "HEAD"], cwd=ROOT, text=True
        ).strip()
        if observed != delivery["finalHead"]:
            raise ValueError("Current HEAD differs from finalHead; refresh the delivery receipt.")
    return delivery


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--dry-run", action="store_true", help="Inspect only; write no files")
    mode.add_argument("--build", action="store_true", help="Create ZIP after final delivery receipt")
    parser.add_argument("--output", type=Path, help="Explicit output ZIP; must not already exist")
    parser.add_argument("--list", action="store_true", help="Print all selected paths")
    args = parser.parse_args()
    spec = json.loads(SPEC_PATH.read_text(encoding="utf-8"))
    delivery = read_delivery(spec, required=args.build)
    files, missing = selected_files(spec)
    broken = audit_html(files, delivery, spec)
    pending_receipt = [name for name in missing if name == spec["delivery"]]
    real_missing = [name for name in missing if name != spec["delivery"]]
    real_broken = [item for item in broken if item.get("target") != spec["delivery"]]
    total = sum(len(package_bytes(path, spec)) for path in files)
    report = {"mode": "build" if args.build else "dry-run", "files": len(files),
              "uncompressedBytes": total, "uncompressedMiB": round(total / 1048576, 2),
              "missingFiles": real_missing, "brokenLocalHtmlLinks": real_broken,
              "pendingPostCommitReceipt": pending_receipt,
              "largest": [{"path": repo_path(path), "bytes": path.stat().st_size}
                          for path in sorted(files, key=lambda path: path.stat().st_size,
                                             reverse=True)[:8]]}
    if args.list:
        report["selectedFiles"] = [repo_path(path) for path in files]
    if real_missing or real_broken:
        print(json.dumps(report, ensure_ascii=False, indent=2))
        return 1
    if args.build:
        if not args.output or args.output.suffix.lower() != ".zip":
            raise ValueError("--build needs an explicit --output path ending in .zip.")
        output = args.output.resolve()
        if output.exists():
            raise ValueError(f"Refusing to overwrite an existing artifact: {output}")
        if not output.parent.is_dir():
            raise ValueError("Output directory must already exist.")
        manifest = {"name": spec["name"], "entry": spec["entry"],
                    "startingHead": delivery["startingHead"],
                    "finalHead": delivery["finalHead"], "branch": delivery["branch"],
                    "files": [{"path": repo_path(path), "bytes": len(package_bytes(path, spec)),
                               "sha256": hashlib.sha256(package_bytes(path, spec)).hexdigest(),
                               "portableLinkRewrite": repo_path(path) in spec.get("portableHtmlRewrites", {})}
                              for path in files],
                    "uncompressedBytes": total,
                    "note": "Manifest excludes itself and the generated root entry page. The credits return link is rewritten only in the ZIP to return to this review; source files are unchanged."}
        index = ("<!doctype html><html lang='pt-BR'><meta charset='utf-8'>"
                 "<meta name='viewport' content='width=device-width,initial-scale=1'>"
                 "<title>NIVAR G2.3.1 — revisão</title>"
                 "<body style='margin:48px;background:#f2eee6;color:#302938;"
                 "font:18px/1.6 Georgia,serif'><p>NIVAR · G2.3.1</p>"
                 f"<h1><a style='color:inherit' href='{spec['entry']}'>Abrir revisão do owner</a></h1>"
                 "<p>Filme antes/depois, cinco insígnias, pesquisa, rejeições e QA.</p>"
                 "<p>Pacote local. Sem merge ou deploy.</p></body></html>")
        with ZipFile(output, "x", compression=ZIP_DEFLATED, compresslevel=6) as archive:
            for path in files:
                archive.writestr(repo_path(path), package_bytes(path, spec))
            archive.writestr("index.html", index)
            archive.writestr("package-manifest.json",
                             json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
        with ZipFile(output) as archive:
            bad = archive.testzip()
            if bad:
                raise ValueError(f"ZIP CRC validation failed for {bad}")
        report.update({"output": str(output), "zipBytes": output.stat().st_size,
                       "zipSha256": sha256(output), "zipCrcValidation": "PASS"})
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (ValueError, OSError, json.JSONDecodeError, subprocess.CalledProcessError) as error:
        raise SystemExit(str(error)) from error
