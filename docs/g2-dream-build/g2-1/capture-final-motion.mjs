import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
const WebSocket=createRequire('C:/dev/nivar-g21-tools/package.json')('ws');
const base=new URL('./motion-review/',import.meta.url);await fs.mkdir(base,{recursive:true});
const info=await (await fetch('http://127.0.0.1:9235/json/version')).json();
const ws=new WebSocket(info.webSocketDebuggerUrl);await new Promise(r=>ws.once('open',r));
let seq=0;const pending=new Map(),errors=[];let frameSink=null;
ws.on('message',data=>{const m=JSON.parse(data);if(m.id){const p=pending.get(m.id);if(p){pending.delete(m.id);m.error?p.j(Error(JSON.stringify(m.error))):p.r(m.result);}}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text);else if(m.method==='Page.screencastFrame'&&frameSink)frameSink(m.params);});
const cdp=(method,params={},sessionId)=>new Promise((r,j)=>{const id=++seq;pending.set(id,{r,j});ws.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));});
const context=await cdp('Target.createBrowserContext');const target=await cdp('Target.createTarget',{url:'about:blank',browserContextId:context.browserContextId});
const {sessionId}=await cdp('Target.attachToTarget',{targetId:target.targetId,flatten:true});
const call=(m,p)=>cdp(m,p,sessionId);await call('Page.enable');await call('Runtime.enable');
const ev=async expression=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const shot=async name=>{const r=await call('Page.captureScreenshot',{format:'png'});await fs.writeFile(new URL(name+'.png',base),Buffer.from(r.data,'base64'));};
const report=[];
for(const width of [1440,390]){
 await call('Emulation.setDeviceMetricsOverride',{width,height:width<700?844:1000,deviceScaleFactor:1,mobile:false});
 await call('Page.navigate',{url:'http://127.0.0.1:4173/br'});
 for(let i=0;i<100;i++){if(await ev("!!document.querySelector('.g2-film-stage')"))break;await wait(100);}
 await ev("document.fonts.ready");await ev("document.querySelector('.g2-film-chapters button').click();const s=document.querySelector('.g2-shell'),v=document.querySelector('.g2-film-stage');s.scrollTo({top:s.scrollTop+v.getBoundingClientRect().top-90,behavior:'instant'})");await wait(1500);
 // Frames are temporary local capture material; the MP4 and timestamp report are the deliverables.
 const temp=new URL(`frames-${width}/`,base);await fs.mkdir(temp,{recursive:true});const frames=[],writes=[];
 frameSink=p=>{const name=`frame-${String(frames.length).padStart(5,'0')}.jpg`;frames.push({name,timestamp:p.metadata.timestamp});writes.push(fs.writeFile(new URL(name,temp),Buffer.from(p.data,'base64')));void call('Page.screencastFrameAck',{sessionId:p.sessionId});};
 await call('Page.startScreencast',{format:'jpeg',quality:86,maxWidth:width,maxHeight:1000,everyNthFrame:2});
 await ev("document.querySelector('[aria-label=\"Reiniciar filme\"]').click()");
 for(let i=0;i<13;i++){await wait(2000);report.push(await ev(`(()=>{const f=document.querySelector('.g2-hero-film'),v=f.querySelector('video'),e=f.querySelector('.g2-film-evidence').getBoundingClientRect(),s=f.querySelector('.g2-film-stage').getBoundingClientRect();return {width:${width},at:${i*2+2},chapter:f.dataset.chapter,clock:f.querySelector('.g2-film-control-group>span').textContent,playing:f.dataset.playing,current:v.currentTime,ready:v.readyState,src:v.currentSrc,contained:e.top>=s.top&&e.bottom<=s.bottom}})()`));}
 await call('Page.stopScreencast');frameSink=null;await Promise.all(writes);
 await fs.writeFile(new URL(`timestamps-${width}.json`,base),JSON.stringify(frames,null,2));
 const lines=frames.flatMap((f,i)=>[`file '${f.name}'`,`duration ${Math.max(.01,(frames[i+1]?.timestamp??f.timestamp+.04)-f.timestamp).toFixed(6)}`]);if(frames.length)lines.push(`file '${frames.at(-1).name}'`);
 await fs.writeFile(new URL('frames.txt',temp),lines.join('\n'));
 const filename=new URL(`hero-${width<700?'mobile':'desktop'}.mp4`,base);
 const result=spawnSync('ffmpeg',['-hide_banner','-loglevel','error','-f','concat','-safe','0','-i',new URL('frames.txt',temp).pathname.replace(/^\//,''),'-vf',`crop=${width}:${width<700?570:620}:0:90,fps=24`,'-an','-c:v','libx264','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart','-y',filename.pathname.replace(/^\//,'')],{encoding:'utf8'});
 if(result.status!==0)throw Error(result.stderr);
 // Delete only this script's explicitly bounded temporary frame directory.
 if(!temp.pathname.includes('/docs/g2-dream-build/g2-1/motion-review/frames-'))throw Error('Bad frame path');
 await fs.rm(temp,{recursive:true,force:true});
 await ev("document.querySelectorAll('.g2-film-chapters button')[3].click()");await wait(1400);await shot(`${width}-question`);
 report.push(await ev(`({width:${width},kind:'manual',playing:document.querySelector('.g2-hero-film').dataset.playing,paused:document.querySelector('.g2-hero-film video').paused,poster:document.querySelector('.g2-hero-film video').poster})`));
 for(const id of ['intelligence','advisory','software']){await ev(`document.getElementById('g21-house-${id}').scrollIntoView({block:'center',behavior:'instant'})`);await wait(400);await shot(`${width}-house-${id}`);}
 console.log('Captured native film and composition',width);
}
await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await call('Page.navigate',{url:'http://127.0.0.1:4173/br'});await wait(1800);report.push(await ev("({kind:'reduced',playing:document.querySelector('.g2-hero-film')?.dataset.playing,paused:document.querySelector('.g2-hero-film video')?.paused,poster:document.querySelector('.g2-hero-film video')?.poster})"));
await fs.writeFile(new URL('report.json',base),JSON.stringify({report,errors},null,2));
await cdp('Target.disposeBrowserContext',{browserContextId:context.browserContextId});ws.close();console.log(JSON.stringify({count:report.length,errors,failed:report.filter(x=>x.contained===false)}));
