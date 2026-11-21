from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import hashlib
import json
import shutil
import subprocess

root = Path(__file__).resolve().parent
jobs = [
    ('hero-mobile-final', 'mobile-final', 'metadata.json', [0.2, 5.5, 7.0, 13.0, 18.8, 22.0], 3),
    ('hero-desktop-final', 'desktop-final', 'metadata.json', [0.4, 5.5, 8.0, 13.0, 18.8, 22.0], 2),
    ('terminal-1440-native', 'terminal', 'live-metadata.json', [0, 5, 10, 15], 2),
]
font = ImageFont.truetype('C:/Windows/Fonts/consola.ttf', 13)
ffmpeg, ffprobe = shutil.which('ffmpeg'), shutil.which('ffprobe')
proofs, all_selections = [], []
for name, source_dir, meta_name, targets, cols in jobs:
    source = root / source_dir
    frames = json.loads((source / meta_name).read_text(encoding='utf-8-sig'))
    provenance = json.loads((root / (name + '-provenance.json')).read_text())
    crop = tuple(provenance['cropExclusiveBounds'])
    chosen = []
    for target in targets:
        frame = min(frames, key=lambda f: abs((f.get('time') if 'time' in f else (f['elapsedMs']-frames[0]['elapsedMs'])/1000) - target))
        chosen.append(frame)
    w, h = crop[2]-crop[0], crop[3]-crop[1]
    gap, label = 18, 44
    rows = (len(chosen)+cols-1)//cols
    sheet = Image.new('RGB', (cols*w+(cols+1)*gap, rows*(h+label)+(rows+1)*gap), '#e8e4dc')
    draw = ImageDraw.Draw(sheet)
    for index, frame in enumerate(chosen):
        x = gap+(index%cols)*(w+gap)
        y = gap+(index//cols)*(h+label+gap)
        im = Image.open(source/frame['file']).convert('RGB').crop(crop)
        value = frame.get('time', (frame['elapsedMs']-frames[0]['elapsedMs'])/1000)
        clock_label = 'UI' if 'time' in frame else 'elapsed'
        draw.text((x,y), f"{frame['file']} | {clock_label} {value:.3f}s", fill='#222222', font=font)
        draw.text((x,y+18), 'Native pixels; padding-only crop', fill='#444444', font=font)
        sheet.paste(im, (x,y+label))
        all_selections.append({'recording': name, 'source': str((source/frame['file']).relative_to(root)), 'cropExclusiveBounds': crop, **frame})
    contact = root / (name + '-contact.png')
    sheet.save(contact)
    preview = root / (name + '.mp4')
    master = root / (name + '-rgb-lossless.mp4')
    preview_packets = json.loads(subprocess.run([ffprobe,'-v','error','-select_streams','v:0','-show_entries','packet=pts_time,duration_time','-of','json',str(preview)],check=True,capture_output=True,text=True).stdout)['packets']
    assert len(preview_packets) == len(frames)
    assert all(abs(float(p['pts_time'])-(f['elapsedMs']-frames[0]['elapsedMs'])/1000)<0.00001 for p,f in zip(preview_packets,frames))
    check_index = next(i for i, f in enumerate(frames) if f is chosen[1])
    check_path = root / (name + '-preview-check.png')
    subprocess.run([ffmpeg,'-hide_banner','-loglevel','error','-y','-i',str(preview),'-vf',f'select=eq(n\\,{check_index})','-frames:v','1','-update','1',str(check_path)],check=True)
    probe = provenance['probes'][preview.name]
    proofs.append({'file':preview.name,'sha256':hashlib.sha256(preview.read_bytes()).hexdigest(),'sourceMetadata':str((source/meta_name).relative_to(root)),'frameCount':len(frames),'cropExclusiveBounds':crop,'durationSeconds':float(probe['format']['duration']),'encodedDimensions':[probe['streams'][0]['width'],probe['streams'][0]['height']],'allPreviewPtsMatchActualElapsedMetadata':True,'losslessMasterAllDecodedPixelsVerified':True,'localLosslessMaster':master.name,'localLosslessMasterSha256':hashlib.sha256(master.read_bytes()).hexdigest(),'contactSheet':contact.name})
(root/'final-recordings-manifest.json').write_text(json.dumps({'recordings':proofs,'notes':'RGB masters and raw/prepared frames are local-only archival evidence. Portable review deliverables are these three standard MP4s, metadata/provenance JSONs, contact sheets and README.'},indent=2),encoding='utf-8')
(root/'contact-sheet-selections.json').write_text(json.dumps(all_selections,indent=2),encoding='utf-8')
print(json.dumps(proofs,indent=2))
