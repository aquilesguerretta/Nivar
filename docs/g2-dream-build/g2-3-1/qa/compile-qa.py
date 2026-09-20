"""Summarize the actual lint run and runtime asset weights against the frozen base."""
from pathlib import Path
import json
import subprocess

qa = Path(__file__).resolve().parent
repo = qa.parents[3]
base = 'aa54f8f32f11e1742cfd1cbe80c7219a217c2de7'
results = json.loads((qa / 'full-lint.json').read_text(encoding='utf-8'))
readable = ['Final repository-wide ESLint diagnostics, rendered from full-lint.json.',
            'This is the final run after fixing the Hero effect; scoped lint passes separately.', '']
for result in results:
    if not result['messages']:
        continue
    readable.append(str(Path(result['filePath']).relative_to(repo)))
    for message in result['messages']:
        readable.append(f"  {message.get('line', 0)}:{message.get('column', 0)} "
                        f"{'error' if message['severity'] == 2 else 'warning'} "
                        f"{message.get('ruleId')}: {message['message']}")
    readable.append('')
(qa / 'lint.log').write_text('\n'.join(readable), encoding='utf-8')
issues = []
for item in results:
    if not (item['errorCount'] or item['warningCount']):
        continue
    name = Path(item['filePath']).relative_to(repo).as_posix()
    prior = subprocess.run(['git', 'show', f'{base}:{name}'], cwd=repo, capture_output=True)
    current = (repo / name).read_bytes().replace(b'\r\n', b'\n')
    issues.append({'path': name, 'errors': item['errorCount'], 'warnings': item['warningCount'],
                   'unchangedFromStartingHead': prior.returncode == 0 and prior.stdout.replace(b'\r\n', b'\n') == current,
                   'outsideG231': not name.startswith('docs/g2-dream-build/g2-3-1/') and not name.startswith('src/components/g2/') and not name.startswith('src/pages/terminal-brasil/')})
summary = {'command': 'node node_modules/eslint/bin/eslint.js . --format json --output-file docs/g2-dream-build/g2-3-1/qa/full-lint.json',
           'errors': sum(i['errors'] for i in issues), 'warnings': sum(i['warnings'] for i in issues),
           'filesWithDiagnostics': len(issues), 'allDiagnosticFilesUnchangedFromStartingHead': all(i['unchangedFromStartingHead'] for i in issues),
           'allDiagnosticsOutsideG231': all(i['outsideG231'] for i in issues), 'files': issues}
(qa / 'lint-summary.json').write_text(json.dumps(summary, indent=2) + '\n', encoding='utf-8')
asset_root = repo / 'public/g2/g231/hero'
weights = {p.relative_to(repo).as_posix(): p.stat().st_size for p in sorted(asset_root.rglob('*')) if p.is_file()}
films = sum(v for k, v in weights.items() if k.endswith('.mp4'))
posters = sum(v for k, v in weights.items() if '-poster.webp' in k)
desktop = sum(v for k, v in weights.items() if '/real/' in k and k.endswith('.webp') and '-mobile.' not in k)
mobile = sum(v for k, v in weights.items() if '-mobile.webp' in k)
budget = {'files': weights, 'generatedMp4Bytes': films, 'postersBytes': posters,
          'desktopPhotoBytes': desktop, 'mobilePhotoBytes': mobile,
          'desktopHeroMediaBytes': films + posters + desktop, 'mobileHeroMediaBytes': films + posters + mobile,
          'notes': ['Uncompressed transfer file weights, not measured network or Core Web Vitals.',
                    'Video sources preload=none, play once only while visible; native video elements are absent in static mode.',
                    'Both generated files are 960x540 H.264,24fps,6.042s,no audio. The Hero uses a32-second directed clock.',
                    'The small lazy HeroInstrument wrapper reuses Terminal modules that already belong to the portal entry graph. It is not claimed as a full Terminal code split.']}
(qa / 'performance.json').write_text(json.dumps(budget, indent=2) + '\n', encoding='utf-8')
print(json.dumps({k: v for k, v in summary.items() if k != 'files'}, indent=2))
print(json.dumps({k: v for k, v in budget.items() if k not in ['files', 'notes']}, indent=2))
