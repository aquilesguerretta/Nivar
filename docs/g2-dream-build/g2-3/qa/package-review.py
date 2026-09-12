"""Package committed G2.3 documents and their local HTML/CSS dependencies.

Raw playback frames and lossless masters remain local, outside the portable set.
The archive preserves repository-relative paths so relative references still work.
Run from the repository root with --output <absolute zip path> after committing docs.
"""
import argparse
import hashlib
import json
from pathlib import Path
import re
import subprocess
import zipfile

parser = argparse.ArgumentParser()
parser.add_argument('--output', required=True)
args = parser.parse_args()
root = Path.cwd().resolve()
doc = Path('docs/g2-dream-build/g2-3')
paths = {Path(p) for p in subprocess.check_output(
    ['git', 'ls-files', str(doc), 'public/g2/g23'], text=True).splitlines()}
queue = list(paths)
missing = []
while queue:
    relative = queue.pop()
    file = root / relative
    if file.suffix not in {'.html', '.css'}:
        continue
    text = file.read_text(encoding='utf-8-sig')
    refs = re.findall(r'(?:src|href)=["\']([^"\']+)', text)
    refs += re.findall(r'url\(["\']?([^\)"\']+)', text)
    for ref in refs:
        if re.match(r'^(?:https?:|data:|mailto:|#)', ref):
            continue
        clean = ref.split('#')[0].split('?')[0]
        target = (file.parent / clean).resolve()
        if not target.is_relative_to(root):
            raise ValueError(f'Reference outside repository: {relative}: {ref}')
        if not target.is_file():
            missing.append(f'{relative}: {ref}')
            continue
        target_relative = target.relative_to(root)
        if target_relative not in paths:
            paths.add(target_relative)
            queue.append(target_relative)
if missing:
    raise ValueError('Missing local references:\n' + '\n'.join(missing))

head = subprocess.check_output(['git', 'rev-parse', 'HEAD'], text=True).strip()
branch = subprocess.check_output(['git', 'branch', '--show-current'], text=True).strip()
manifest = {'branch': branch, 'commit': head, 'files': []}
output = Path(args.output).resolve()
output.parent.mkdir(parents=True, exist_ok=True)
with zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
    for relative in sorted(paths):
        data = (root / relative).read_bytes()
        name = relative.as_posix()
        manifest['files'].append({'path': name, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()})
        archive.writestr('NIVAR-G23/' + name, data)
    archive.writestr('NIVAR-G23/START.html', '<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=docs/g2-dream-build/g2-3/review.html"><title>NIVAR G2.3</title><a href="docs/g2-dream-build/g2-3/review.html">Abrir revisão NIVAR G2.3</a>')
    archive.writestr('NIVAR-G23/PACKAGE.json', json.dumps(manifest, ensure_ascii=False, indent=2))
with zipfile.ZipFile(output) as archive:
    failure = archive.testzip()
    if failure:
        raise ValueError(f'Archive integrity failed: {failure}')
print(json.dumps({'output': str(output), 'commit': head, 'files': len(paths), 'bytes': output.stat().st_size, 'sha256': hashlib.sha256(output.read_bytes()).hexdigest()}, indent=2))
