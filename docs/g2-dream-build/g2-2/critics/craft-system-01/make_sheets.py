import json,sys
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
out=Path(__file__).parent
for name in sys.argv[1:]:
    data=json.loads((out/(name+'-playback.json')).read_text())
    frames=data['frames']
    for n in range(0,len(frames),12):
        selected=frames[n:n+12]
        sheet=Image.new('RGB',(1440,350*((len(selected)+2)//3)),'#eee')
        for i,f in enumerate(selected):
            im=ImageOps.contain(Image.open(f['file']).convert('RGB'),(480,322))
            x=(i%3)*480;y=(i//3)*350
            sheet.paste(im,(x+(480-im.width)//2,y+28+(322-im.height)//2))
            ImageDraw.Draw(sheet).text((x+8,y+6),f"{name} · {f['time']:.2f}s · rate {f['rate']}",fill='#111')
        dest=out/f'{name}-sheet-{n//12+1:02}.jpg'
        sheet.save(dest,quality=91)
        print(dest)
