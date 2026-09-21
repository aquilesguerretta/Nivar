from pathlib import Path
from PIL import Image, ImageOps, ImageDraw, ImageFont
import json
root=Path(__file__).parent
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',20)
small=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',16)
files=sorted((root/'sources').glob('*.png'),key=lambda p:int(p.stem.split('-')[0]))
cols=3; w=480; h=325; pad=24
out=Image.new('RGB',(cols*w+pad*2,((len(files)+cols-1)//cols)*h+110),(237,233,224))
d=ImageDraw.Draw(out)
d.text((pad,24),'NIVAR G2.1  /  WEATHER, COPPER, PAPER',font=font,fill=(35,32,29))
d.text((pad,56),'Generated source studies — anonymous illustrative scenes, not factual evidence',font=small,fill=(96,88,80))
for i,p in enumerate(files):
    x=pad+(i%cols)*w; y=100+(i//cols)*h
    im=Image.open(p).convert('RGB')
    thumb=ImageOps.fit(im,(w-16,260),method=Image.Resampling.LANCZOS)
    out.paste(thumb,(x,y))
    d.text((x,y+273),p.stem.replace('-',' ').upper(),font=small,fill=(35,32,29))
out.save(root/'candidate-board.jpg',quality=94)
print(root/'candidate-board.jpg')
