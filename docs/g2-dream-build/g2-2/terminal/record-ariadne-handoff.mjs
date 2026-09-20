import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { browser } from './browser.mjs';
const base=fileURLToPath(new URL(`./${process.argv[2]??'ariadne-context-iteration02'}/`,import.meta.url));
await fs.mkdir(base,{recursive:true});
const b=await browser();
const results=[];
const scroll=async selector=>{await b.ev(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'center',behavior:'instant'})`);await b.wait(100);};
const top=async selector=>{await b.ev(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});e.scrollIntoView({block:'start',behavior:'instant'});e.closest('.g2-shell').scrollTop-=92;})()`);await b.wait(80);};
try {
 for(const width of [1440,390]) {
  await b.call('Emulation.setDeviceMetricsOverride',{width,height:width===390?844:1000,deviceScaleFactor:1,mobile:false});
  await b.call('Page.navigate',{url:'http://127.0.0.1:4173/br/familia/software'});
  for(let i=0;i<100;i++){if(await b.ev("!!document.querySelector('.g22-aj-stage')"))break;await b.wait(100);}
  await b.ev('document.fonts.ready');await b.wait(800);await top('.g22-aj-stage');
  const frames=path.join(base,`${width}-frames`);await fs.mkdir(frames,{recursive:true});
  const stamps=[],writes=[],events=[];let number=0;
  b.setSink(params=>{const n=number++;stamps.push({n,timestamp:params.metadata.timestamp});writes.push(fs.writeFile(path.join(frames,`${String(n).padStart(5,'0')}.jpg`),Buffer.from(params.data,'base64')));void b.call('Page.screencastFrameAck',{sessionId:params.sessionId});});
  await b.call('Page.startScreencast',{format:'jpeg',quality:90,everyNthFrame:1});
  const mark=async name=>events.push({name,wallTime:Date.now(),state:await b.ev("({phase:document.querySelector('.g22-ariadne').dataset.phase,handoff:document.querySelector('.g22-ariadne').dataset.handoff,selected:document.querySelector('.g2t-time-scrub')?.getAttribute('aria-valuetext')??document.querySelector('.g22-aj-scrubber input').getAttribute('aria-valuetext')})")});
  await b.wait(700);await mark('before region');
  await b.click('.g22-aj-geography [data-market="sul"] circle');
  await b.wait(800);await mark('usable observation');await b.shot(path.join(base,`${width}-observation.png`));
  await scroll('.g22-aj-action button');await b.click('.g22-aj-action button');await b.wait(650);
  await top('.g22-aj-stage');await b.wait(1200);await b.shot(path.join(base,`${width}-source-context.png`));
  await b.ev("document.querySelector('.g22-aj-origin-enter').scrollIntoView({block:'end',behavior:'instant'})");await b.wait(600);
  await mark('source before handoff');await b.shot(path.join(base,`${width}-source.png`));
  await b.click('.g22-aj-origin-enter');await b.wait(180);await mark('receipt travelling');await b.shot(path.join(base,`${width}-transfer.png`));
  await b.wait(750);await mark('earned observation');await b.shot(path.join(base,`${width}-earned.png`));
  await b.wait(1500);
  await b.call('Page.stopScreencast');b.setSink(null);await Promise.all(writes);
  const list=stamps.map((s,i)=>`file '${String(s.n).padStart(5,'0')}.jpg'\nduration ${Math.max(.001,(stamps[i+1]?.timestamp??s.timestamp+1/30)-s.timestamp)}`).join('\n');
  await fs.writeFile(path.join(frames,'native.ffconcat'),`ffconcat version 1.0\n${list}\nfile '${String(stamps.at(-1).n).padStart(5,'0')}.jpg'\n`);
  execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-safe','0','-i',path.join(frames,'native.ffconcat'),'-vf','fps=30','-c:v','libx264','-crf','18','-pix_fmt','yuv420p',path.join(base,`${width}-ariadne-handoff.mp4`)]);
  const result={width,events,stamps,frameCount:stamps.length,nativeDuration:stamps.at(-1).timestamp-stamps[0].timestamp,exceptions:b.errors};
  await fs.writeFile(path.join(base,`${width}-timing.json`),JSON.stringify(result,null,2));results.push({width,nativeDuration:result.nativeDuration,frameCount:stamps.length,exceptions:b.errors});
 }
} finally {await b.close();}
await fs.writeFile(path.join(base,'results.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results));
