from pathlib import Path
from PIL import Image, ImageOps
import json, subprocess, hashlib
root=Path(__file__).parent
repo=root.parents[3]
dest=repo/'public/g2/g21'
dest.mkdir(parents=True,exist_ok=True)
chosen={1,2,3,7,11,12,14,15,16,17,18}
manifest=[]
for p in sorted((root/'sources').glob('*.png'),key=lambda p:int(p.stem.split('-')[0])):
    idx=int(p.stem.split('-')[0])
    if idx not in chosen: continue
    slug=p.stem.split('-',1)[1]
    im=Image.open(p).convert('RGB')
    original=im.size
    if idx in (17,18):
        im=ImageOps.fit(im,(512,512),method=Image.Resampling.LANCZOS)
        im.save(dest/f'{slug}.webp',quality=78,method=6)
        paths=[dest/f'{slug}.webp']
    else:
        im.thumbnail((1800,1800),Image.Resampling.LANCZOS)
        im.save(dest/f'{slug}.webp',quality=85,method=6)
        mobile=ImageOps.fit(Image.open(p).convert('RGB'),(720,900),method=Image.Resampling.LANCZOS)
        mobile.save(dest/f'{slug}-mobile.webp',quality=83,method=6)
        paths=[dest/f'{slug}.webp',dest/f'{slug}-mobile.webp']
    for f in paths:
        with Image.open(f) as check:
            manifest.append({'kind':'image','source':str(p.relative_to(repo)).replace('\\','/'),'path':'/'+str(f.relative_to(repo/'public')).replace('\\','/'),'source_size':list(original),'width':check.width,'height':check.height,'bytes':f.stat().st_size,'sha256':hashlib.sha256(f.read_bytes()).hexdigest()})
for p in sorted((root/'sources').glob('*.mp4')):
    slug=p.stem.split('-',1)[1]
    # Art-directed framing stays centered. No fabricated UI/data in the video.
    for mode,filter_ in [('desktop','scale=1600:900:force_original_aspect_ratio=increase,crop=1600:900'),('mobile','scale=-2:960,crop=540:960')]:
        target=dest/f'{slug}-{mode}.mp4'
        if not target.exists():
            subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-i',str(p),'-t','6','-vf',filter_+',setsar=1','-r','24','-an','-c:v','libx264','-profile:v','high','-pix_fmt','yuv420p','-crf','24','-preset','slow','-movflags','+faststart','-y',str(target)],check=True)
        poster=dest/f'{slug}-{mode}-poster.webp'
        if not poster.exists():
            subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-ss','0.5','-i',str(target),'-frames:v','1','-c:v','libwebp','-quality','86','-y',str(poster)],check=True)
        probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=width,height,avg_frame_rate,nb_frames','-show_entries','format=duration','-of','json',str(target)]))
        stream=probe['streams'][0]
        manifest.append({'kind':'video','source':str(p.relative_to(repo)).replace('\\','/'),'path':'/'+str(target.relative_to(repo/'public')).replace('\\','/'),'poster':'/'+str(poster.relative_to(repo/'public')).replace('\\','/'),'mode':mode,'width':stream['width'],'height':stream['height'],'fps':stream['avg_frame_rate'],'frames':stream['nb_frames'],'duration':float(probe['format']['duration']),'bytes':target.stat().st_size,'sha256':hashlib.sha256(target.read_bytes()).hexdigest()})
(root/'runtime-assets.json').write_text(json.dumps(manifest,indent=2))
print(json.dumps({'files':len(manifest),'bytes':sum(x['bytes'] for x in manifest),'path':str(dest)}))
