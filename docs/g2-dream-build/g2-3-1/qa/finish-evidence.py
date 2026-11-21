"""Package QA crops without rescaling; preserve source screenshots beside them."""
from pathlib import Path
import json
from PIL import Image

qa = Path(__file__).resolve().parent
report = []
for source in sorted(qa.glob('*-full.png')):
    target = source.with_name(source.name.replace('-full.png', '.png'))
    with Image.open(source) as image:
        if image.size != (1633, 1089):
            raise ValueError(f'Unexpected native source: {source}: {image.size}')
        image.crop((0, 0, 390, 844)).save(target)
    report.append({'source': source.name, 'output': target.name,
                   'sourcePixels': [1633, 1089], 'crop': [0, 0, 390, 844], 'rescaled': False})
(qa / 'static-capture-provenance.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print(json.dumps(report, indent=2))
