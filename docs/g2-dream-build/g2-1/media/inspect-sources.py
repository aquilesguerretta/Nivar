from pathlib import Path
from PIL import Image, ImageChops, ImageStat
import subprocess,json,hashlib
root=Path(__file__).parent
manifest=json.loads((root/'completed-sources.json').read_text())
out=[]
for item in manifest:
    ext='mp4' if item['type']=='video' else 'png'
    path=root/'sources'/f'{item["index"]}-{item["slug"]}.{ext}'
    record={**item,'local_file':str(path.relative_to(root)),'bytes':path.stat().st_size,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()}
    if ext=='png':
        with Image.open(path) as im:record['width'],record['height']=im.size
    else:
        probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','stream=codec_type,codec_name,width,height,avg_frame_rate,nb_frames','-show_entries','format=duration','-of','json',str(path)]))
        record['media']=probe
        raw=subprocess.check_output(['ffmpeg','-hide_banner','-loglevel','error','-i',str(path),'-vf','fps=1,scale=320:180','-f','rawvideo','-pix_fmt','rgb24','-'])
        size=320*180*3
        frames=[Image.frombytes('RGB',(320,180),raw[i:i+size]) for i in range(0,len(raw),size)]
        means=[sum(ImageStat.Stat(ImageChops.difference(a,b)).mean)/3 for a,b in zip(frames,frames[1:])]
        record['motion_check']={'sample_fps':1,'sample_frames':len(frames),'consecutive_frame_mean_absolute_rgb_difference':means,'all_sampled_transitions_change':all(v>.05 for v in means)}
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-i',str(path),'-f','null','-'],check=True)
        record['full_decode_ok']=True
    out.append(record)
(root/'source-inspection.json').write_text(json.dumps(out,indent=2))
print(json.dumps([{'index':x['index'],'motion':x.get('motion_check'),'decode':x.get('full_decode_ok')} for x in out if x['type']=='video'],indent=2))
