import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {browser} from './browser.mjs';
const iteration=process.argv[2]??'iteration02';if(!/^iteration\d+$/.test(iteration))throw Error('Invalid iteration directory');const b=await browser();const base=new URL(`./${iteration}/`,import.meta.url);await fs.mkdir(base,{recursive:true});const report=[];
const snapshot=async(kind,width)=>{const state=await b.ev(`(()=>{const root=document.querySelector('.g2-terminal'),p=root.querySelector('.recharts-area-curve'),source=root.querySelector('.g2t-source-context');return {kind:${JSON.stringify(kind)},width:${width},region:root.querySelector('.g2t-series .g2t-panel-heading h2 span')?.textContent,period:root.dataset.period,metric:root.dataset.metric,motion:root.dataset.curveMotion,probe:root.querySelector('.g2t-probe-heading output')?.textContent,trace:root.querySelector('.g2t-observation-trace')?.textContent,source:source?.textContent,range:root.querySelector('input[type=range]')?.value,curve:p?.getAttribute('d'),rendered:p&&getComputedStyle(p).d,animations:p?.getAnimations().length??0,markerTransform:root.querySelector('.recharts-reference-line:has(line[x])')&&getComputedStyle(root.querySelector('.recharts-reference-line:has(line[x])')).transform,markerAnimations:root.querySelector('.recharts-reference-line:has(line[x])')?.getAnimations().length??0,overflow:root.scrollWidth>root.clientWidth,dialog:root.querySelector('dialog').open,live:root.querySelector('.g2t-source-date').textContent}})()`);report.push(state);return state;};
async function key(k){await b.call('Input.dispatchKeyEvent',{type:'keyDown',key:k,code:k});await b.call('Input.dispatchKeyEvent',{type:'keyUp',key:k,code:k});}
for(const width of[1440,390]){
 await b.open(width);await snapshot('initial',width);await b.shot(new URL(`${width}-default.png`,base));
 const temp=new URL(`frames-${width}/`,base);await fs.mkdir(temp,{recursive:true});const frames=[],writes=[];
 b.setSink(p=>{const name=`frame-${String(frames.length).padStart(5,'0')}.jpg`;frames.push({name,timestamp:p.metadata.timestamp});writes.push(fs.writeFile(new URL(name,temp),Buffer.from(p.data,'base64')));void b.call('Page.screencastFrameAck',{sessionId:p.sessionId});});
 await b.call('Page.startScreencast',{format:'jpeg',quality:88,maxWidth:width,maxHeight:1000,everyNthFrame:1});await b.wait(650);
 if(width===390){await b.click('.g2t-mobile-map-toggle');await b.wait(400);await b.ev("document.querySelector('.g2t-regions').scrollIntoView({block:'center'})");await b.wait(200);}
 await b.click('.g2t-regions > button:nth-child(2)');await b.wait(100);await snapshot('region-100ms',width);await b.wait(220);await snapshot('region-320ms',width);await b.wait(450);await snapshot('region-settled',width);await b.shot(new URL(`${width}-region.png`,base));
 await b.ev("document.querySelector('.g2t-series').scrollIntoView({block:'start'})");await b.wait(350);
 await b.ev("document.querySelector('.g2t-time-scrub').focus({preventScroll:true})");await key('ArrowRight');await b.wait(100);await snapshot('probe-moving',width);await b.wait(700);await snapshot('probe-keyboard',width);await b.shot(new URL(`${width}-probe.png`,base));
 await b.click('.g2t-context-heading button');await b.wait(650);await snapshot('source-dialog',width);await b.shot(new URL(`${width}-source.png`,base));await b.wait(900);await key('Escape');await b.wait(400);
 if(width===1440){await b.ev("document.querySelector('.g2-terminal').scrollTo({top:0,behavior:'instant'})");await b.wait(200);}
 const period=width<700?'.g2t-mobile-period':'.g2t-period-control';
 await b.click(`${period} > button:nth-child(2)`);await b.wait(120);await snapshot('daily-frequency-change',width);await b.wait(500);
 await b.ev("document.querySelector('.g2t-time-scrub').focus({preventScroll:true})");await key('ArrowRight');await b.wait(650);const before=await snapshot('daily-selected',width);
 await b.click(`${period} > button:nth-child(3)`);await b.wait(700);const after=await snapshot('daily-expanded',width);report.push({kind:'timestamp-preserved',width,pass:before.source?.match(/2026-09-\d\d/)?.[0]===after.source?.match(/2026-09-\d\d/)?.[0],before:before.source,after:after.source});
 await b.click('.g2t-metric-control > button:nth-child(2)');await b.wait(700);await snapshot('metric-load',width);await b.shot(new URL(`${width}-load.png`,base));await b.wait(700);
 await b.call('Page.stopScreencast');b.setSink(null);await Promise.all(writes);
 const concat=frames.flatMap((f,i)=>[`file '${f.name}'`,`duration ${Math.max(.01,(frames[i+1]?.timestamp??f.timestamp+.04)-f.timestamp).toFixed(6)}`]);concat.push(`file '${frames.at(-1).name}'`);await fs.writeFile(new URL('frames.txt',temp),concat.join('\n'));
 await fs.writeFile(new URL(`${width}-timestamps.json`,base),JSON.stringify(frames,null,2));const result=spawnSync('ffmpeg',['-hide_banner','-loglevel','error','-f','concat','-safe','0','-i',fileURLToPath(new URL('frames.txt',temp)),'-vf','fps=30','-an','-c:v','libx264','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart','-y',fileURLToPath(new URL(`${width}-interaction.mp4`,base))],{encoding:'utf8'});if(result.status)throw Error(result.stderr);
 if(!temp.pathname.includes(`/g2-2/terminal/${iteration}/frames-`))throw Error('Unbounded frame deletion');await fs.rm(temp,{recursive:true,force:true});
 await b.ev("document.querySelector('.g2-terminal').scrollTo({top:0,behavior:'instant'})");await b.wait(200);await b.click('[aria-label="Usar tema claro"]');await b.wait(350);await b.shot(new URL(`${width}-paper.png`,base));
 console.log('Recorded and checked',width);
}
await b.call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await b.open(1440);await b.click('.g2t-regions > button:nth-child(2)');await b.wait(80);await snapshot('reduced-motion',1440);
await b.ev("(()=>{const s=document.querySelector('.g2t-source-select select');s.value='unavailable';s.dispatchEvent(new Event('change',{bubbles:true}))})()");await b.wait(200);await snapshot('unavailable',1440);await b.shot(new URL('unavailable.png',base));
await fs.writeFile(new URL('results.json',base),JSON.stringify({report,errors:b.errors},null,2)+'\n');console.log(JSON.stringify({checks:report.length,errors:b.errors,overflow:report.filter(x=>x.overflow),failed:report.filter(x=>x.pass===false)}));await b.close();
