from pathlib import Path
from PIL import Image
import json,html
root=Path(__file__).parent
sources=json.loads((root/'completed-sources.json').read_text())
meta=json.loads((root/'image-requests.json').read_text())['specs']
lookup={s['index']:s for s in meta}
preview=root/'previews'; preview.mkdir(exist_ok=True)
cards=[]
for item in sources:
    if item['type']!='image': continue
    slug=item['slug']; idx=item['index']
    p=root/'sources'/f'{idx}-{slug}.png'
    im=Image.open(p).convert('RGB'); im.thumbnail((640,640),Image.Resampling.LANCZOS)
    im.save(preview/f'{slug}.webp',quality=82,method=6)
    fam=lookup.get(idx,{}).get('family','Portal / Territory')
    cards.append(f'<article><a href="sources/{idx}-{slug}.png"><img src="previews/{slug}.webp" loading="lazy" alt="{slug.replace("-"," ")}"></a><p class="meta">{idx:02} / {html.escape(fam)}</p><h3>{slug.replace("-"," ").title()}</h3></article>')
videos=[]
for item in sources:
    if item['type']!='video': continue
    slug=item['slug']
    def video(mode):
        rel=f'../../../../public/g2/g21/{slug}-{mode}'
        return f'<video controls muted playsinline loop preload="metadata" poster="{rel}-poster.webp"><source src="{rel}.mp4" type="video/mp4"></video>'
    videos.append(f'<section class="motion"><header><p class="meta">{item["index"]} / {item["model"]}</p><h2>{slug.replace("-"," ").title()}</h2></header><div class="comparison"><div>{video("desktop")}<p>1600 × 900 · 24 fps · 6 sec</p></div><div class="phone">{video("mobile")}<p>540 × 960 · center crop</p></div></div></section>')
doc='''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NIVAR G2.1 — source review</title><style>
*{box-sizing:border-box}body{margin:0;background:#eae5da;color:#262321;font:16px/1.5 Arial,sans-serif}main{max-width:1480px;margin:auto;padding:48px}h1{font-size:clamp(36px,5vw,72px);line-height:1;letter-spacing:-.06em;font-weight:500;max-width:800px;margin:22px 0}h2{font-size:32px;letter-spacing:-.035em;font-weight:500}h3{font-weight:500;margin:0}.intro{max-width:740px;margin-bottom:40px}.meta{font:11px/1.3 monospace;text-transform:uppercase;letter-spacing:.13em;color:#655c52;margin:16px 0 8px}.motion{border-top:1px solid #b8afa2;padding:26px 0 42px}.comparison{display:grid;grid-template-columns:minmax(0,1fr) 220px;gap:28px;align-items:start}video{width:100%;display:block;background:#151716;aspect-ratio:16/9}.phone video{aspect-ratio:9/16}.comparison p{font:12px monospace;color:#6a6056}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:40px 22px}article img{width:100%;aspect-ratio:4/3;object-fit:cover;display:block}button{cursor:pointer;font:12px monospace;border:1px solid #4f463d;background:transparent;color:inherit;padding:12px 20px;margin:0 8px 22px 0}button:hover{background:#262321;color:#eee8dc}a{color:inherit}footer{border-top:1px solid #b8afa2;margin-top:50px;padding-top:20px;font-size:12px}.review{font:12px monospace;color:#675d53} @media(max-width:800px){main{padding:24px}.comparison{grid-template-columns:1fr}.phone{width:55%;margin:auto}.grid{grid-template-columns:1fr 1fr}} @media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
</style><main><p class="meta">NIVAR / G2.1 / production source studies</p><h1>Weather.<br>Copper. Paper.</h1><p class="intro">A physical world for energy intelligence. These are generated editorial illustrations of anonymous infrastructure, materials and research practices. They are not evidence of a named installation, an actual client, a measurement, or a factual document.</p><button id="play">Play all motion</button><button id="pause">Pause all</button><p class="review" id="status">Select a shot to inspect full-screen. Desktop and portrait crops share the same source.</p>'''+''.join(videos)+'''<section><p class="meta">18 distinct source studies / original PNGs preserved</p><h2>Candidate world</h2><div class="grid">'''+''.join(cards)+'''</div></section><footer>Prompts, model parameters, generation jobs and provenance are in adjacent JSON files. Reference screenshots are research-only. Final runtime editorial selection remains separate from the complete study archive.</footer></main><script>const videos=[...document.querySelectorAll('video')];document.querySelector('#play').onclick=()=>videos.forEach(v=>{v.currentTime=0;v.play()});document.querySelector('#pause').onclick=()=>videos.forEach(v=>v.pause());setInterval(()=>{document.querySelector('#status').textContent=videos.map((v,i)=>`Shot ${i+1}: ${v.currentTime.toFixed(2)}s ${v.paused?'paused':'playing'}`).join(' · ')},250);</script></html>'''
(root/'index.html').write_text(doc,encoding='utf-8')
print(root/'index.html')
