import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
const WS=createRequire('C:/dev/nivar-g21-tools/package.json')('ws');
const root='C:/dev/gridalpha-v2-nivar-g2/docs/g2-dream-build/g2-2/hero';
const iteration=process.argv[2]??'iteration02';
const out=path.join(root,iteration);await fs.mkdir(out,{recursive:true});
const delay=ms=>new Promise(r=>setTimeout(r,ms));
const version=await(await fetch('http://127.0.0.1:9235/json/version')).json();
const ws=new WS(version.webSocketDebuggerUrl);await new Promise(r=>ws.once('open',r));
let seq=0;const pending=new Map(),sinks=new Map();
const cdp=(method,params={},sessionId)=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));});
ws.on('message',raw=>{const m=JSON.parse(raw);if(m.id){const p=pending.get(m.id);if(!p)return;pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}else if(m.method==='Page.screencastFrame')sinks.get(m.sessionId)?.(m.params);});
for(const width of [1440,390]){
 const {browserContextId}=await cdp('Target.createBrowserContext');const {targetId}=await cdp('Target.createTarget',{url:'about:blank',browserContextId});const {sessionId}=await cdp('Target.attachToTarget',{targetId,flatten:true});const call=(m,p)=>cdp(m,p,sessionId);
 const ev=async expression=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.text);return r.result.value;};
 await call('Page.enable');await call('Runtime.enable');await call('Emulation.setDeviceMetricsOverride',{width,height:width<700?844:1000,deviceScaleFactor:1,mobile:false});await call('Page.navigate',{url:'http://127.0.0.1:4173/br'});
 for(let i=0;i<100;i++){if(await ev('Boolean(document.querySelector(".g22-hero-film"))'))break;await delay(150);}
 await ev('document.fonts.ready');await ev('document.querySelector(".g2-film-chapters button").click();const s=document.querySelector(".g2-shell"),f=document.querySelector(".g2-film-stage");s.scrollTo({top:s.scrollTop+f.getBoundingClientRect().top-90,behavior:"instant"})');await delay(600);
 const bounds=await ev('(()=>{const r=document.querySelector(".g2-film-stage").getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}})()');
 const temp=path.join(out,`frames-${width}`);await fs.mkdir(temp,{recursive:true});const frames=[],writes=[],observations=[];
 sinks.set(sessionId,p=>{const name=`f-${String(frames.length).padStart(5,'0')}.jpg`;frames.push({name,timestamp:p.metadata.timestamp});writes.push(fs.writeFile(path.join(temp,name),Buffer.from(p.data,'base64')));void call('Page.screencastFrameAck',{sessionId:p.sessionId});});
 await call('Page.startScreencast',{format:'jpeg',quality:88,maxWidth:width,maxHeight:1000,everyNthFrame:2});await ev('document.querySelector("[aria-label=\\"Reiniciar filme\\"]").click()');
 for(let i=0;i<20;i++){
  await delay(1000);const state=await ev('(()=>{const f=document.querySelector(".g22-hero-film");return {clock:f.dataset.filmTime,chapter:f.dataset.chapter,playing:f.dataset.playing,values:[...f.querySelectorAll(".g22-sample-value")].map(n=>n.textContent),samples:[...f.querySelectorAll(".g22-film-sample")].map(n=>({transform:n.getAttribute("transform"),opacity:n.style.opacity})),images:[...f.querySelectorAll("img")].map(n=>({src:n.currentSrc,width:n.naturalWidth}))}})()');observations.push(state);
  if(i%2===0){const shot=await call('Page.captureScreenshot',{format:'png'});await fs.writeFile(path.join(out,`${width}-${String(i+1).padStart(2,'0')}s.png`),Buffer.from(shot.data,'base64'));}
  if(i>=18)break;
 }
 await call('Page.stopScreencast');sinks.delete(sessionId);await Promise.all(writes);
 const lines=frames.flatMap((f,i)=>[`file '${f.name}'`,`duration ${Math.max(.01,(frames[i+1]?.timestamp??f.timestamp+.04)-f.timestamp).toFixed(6)}`]);lines.push(`file '${frames.at(-1).name}'`);await fs.writeFile(path.join(temp,'frames.txt'),lines.join('\n'));
 const fw=Math.floor(bounds.width/2)*2,fh=Math.floor(bounds.height/2)*2;
 const result=spawnSync('ffmpeg',['-hide_banner','-loglevel','error','-f','concat','-safe','0','-i',path.join(temp,'frames.txt'),'-vf',`crop=${fw}:${fh}:${Math.floor(bounds.x)}:${Math.floor(bounds.y)},fps=30`,'-an','-c:v','libx264','-crf','21','-pix_fmt','yuv420p','-movflags','+faststart','-y',path.join(out,`hero-${width<700?'mobile':'desktop'}.mp4`)],{encoding:'utf8'});if(result.status)throw Error(result.stderr);
 await fs.writeFile(path.join(out,`${width}-playback.json`),JSON.stringify({bounds,frames:frames.length,observations,timestamps:frames},null,2));
 // Only the verified task-specific temporary frame folder is removed.
 if(path.resolve(temp)!==path.resolve(out,`frames-${width}`)||!path.resolve(temp).startsWith(path.resolve(root)+path.sep))throw Error('Unsafe temp path');await fs.rm(temp,{recursive:true});
 await cdp('Target.disposeBrowserContext',{browserContextId});console.log(JSON.stringify({width,frames:frames.length,clock:observations.at(-1).clock,bounds}));
}
ws.close();
