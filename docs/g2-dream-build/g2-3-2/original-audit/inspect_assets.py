from pathlib import Path
from PIL import Image
import hashlib,json,subprocess
ROOT=Path(__file__).resolve().parents[4]
OUT=Path(__file__).resolve().parent
entries=[]
for name in ('argos','socrates','perseu','ariadne','hefesto','diogenes'):
    paths=[ROOT/f'public/g2/g21/emblems/{name}-hero-600.webp',ROOT/f'public/g2/g21/emblems/{name}-hero-1200.webp',ROOT/f'docs/g2-dream-build/g2-1/brand/emblems/{name}-intaglio-study.png',ROOT/f'public/patronos/{name}-384.webp']
    for path in paths:
        with Image.open(path) as im:
            entries.append({'patron':name,'path':path.relative_to(ROOT).as_posix(),'width':im.width,'height':im.height,'mode':im.mode,'bytes':path.stat().st_size,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()})
for path in sorted((ROOT/'public/g2/g22/real-brazil').glob('*.webp')):
    with Image.open(path) as im:
        entries.append({'path':path.relative_to(ROOT).as_posix(),'width':im.width,'height':im.height,'mode':im.mode,'bytes':path.stat().st_size,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()})
(OUT/'asset-audit.json').write_text(json.dumps(entries,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(entries,ensure_ascii=False,indent=2))
