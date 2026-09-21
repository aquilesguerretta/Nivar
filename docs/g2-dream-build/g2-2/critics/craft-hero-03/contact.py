import json
from pathlib import Path
from PIL import Image, ImageDraw
p=Path(__file__).parent
for kind in ('desktop','mobile','cred','must'):
    f=p/(kind+'-playback.json')
    if not f.exists(): continue
    data=json.loads(f.read_text())
    samples=data['samples']
    tw,th=(600,278) if kind=='desktop' else (270,431) if kind=='mobile' else (280,560)
    cols=3 if kind=='desktop' else 4
    per=cols*3
    for start in range(0,len(samples),per):
        sheet=Image.new('RGB',(tw*cols,(th+26)*3),'#242424')
        d=ImageDraw.Draw(sheet)
        for n,s in enumerate(samples[start:start+per]):
            im=Image.open(p/s['file']).convert('RGB')
            if kind in ('cred','must'): im=im.crop((410,65,790,835))
            im.thumbnail((tw,th))
            x=(n%cols)*tw;y=(n//cols)*(th+26)
            sheet.paste(im,(x+(tw-im.width)//2,y+26))
            d.text((x+8,y+6),f"{kind} #{s['index']} | {s['time']:.3f}s",fill='white')
        sheet.save(p/f'{kind}-contact-{start//per:02}.jpg',quality=94)
