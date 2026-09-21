import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire('C:/dev/nivar-g21-tools/package.json');
const WebSocket=require('ws');
const directory=new URL('./portal-review/',import.meta.url); await fs.mkdir(directory,{recursive:true});
const info=await (await fetch('http://127.0.0.1:9235/json/version')).json();
const socket=new WebSocket(info.webSocketDebuggerUrl); await new Promise((r,j)=>{socket.once('open',r);socket.once('error',j)});
let seq=0; const pending=new Map(); const errors=[];
socket.on('message',data=>{const m=JSON.parse(data);if(m.id){const p=pending.get(m.id);if(!p)return;pending.delete(m.id);m.error?p.j(Error(JSON.stringify(m.error))):p.r(m.result)}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text)});
const cdp=(method,params={},sessionId)=>new Promise((r,j)=>{const id=++seq;pending.set(id,{r,j});socket.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));});
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const context=await cdp('Target.createBrowserContext');
const target=await cdp('Target.createTarget',{url:'about:blank',browserContextId:context.browserContextId});
const {sessionId}=await cdp('Target.attachToTarget',{targetId:target.targetId,flatten:true});
const call=(method,params)=>cdp(method,params,sessionId);
await call('Page.enable'); await call('Runtime.enable');
const evaluate=async expression=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.text);return r.result.value;};
const screenshot=async name=>{const r=await call('Page.captureScreenshot',{format:'png'});await fs.writeFile(new URL(name+'.png',directory),Buffer.from(r.data,'base64'));};
const report=[];
for(const width of [1440,390,430,768,1024,1920]){
 await call('Emulation.setDeviceMetricsOverride',{width,height:width<700?844:1000,deviceScaleFactor:1,mobile:false});
 await call('Page.navigate',{url:'http://127.0.0.1:4173/br'});
 for(let i=0;i<80;i++){if(await evaluate("!!document.querySelector('.g2-film-stage')"))break;await wait(200);}
 await evaluate("Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,1800))])");
 await evaluate("document.querySelector('.g2-film-chapters button').click();document.querySelector('.g2-shell').scrollTo({top:0,behavior:'instant'})");await wait(1400);
 await screenshot(`${width}-opening`);
 report.push(await evaluate(`({width:innerWidth,kind:'opening',overflow:document.querySelector('.g2-shell').scrollWidth>innerWidth,fonts:getComputedStyle(document.querySelector('.g2')).getPropertyValue('--g2-serif'),images:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)})`));
 const chapterCount=width===1440||width===390?6:1;
 for(let chapter=0;chapter<chapterCount;chapter++){
  await evaluate(`document.querySelectorAll('.g2-film-chapters button')[${chapter}].click();var stage=document.querySelector('.g2-film-stage');var shell=document.querySelector('.g2-shell');shell.scrollTo({top:shell.scrollTop+stage.getBoundingClientRect().top-90,behavior:'instant'})`);await wait(1400);
  const state=await evaluate(`(()=>{const e=document.querySelector('.g2-film-evidence').getBoundingClientRect(),s=document.querySelector('.g2-film-stage').getBoundingClientRect(),v=document.querySelector('.g2-film-cinema video');return {width:innerWidth,kind:'film',chapter:${chapter},contained:e.top>=s.top&&e.bottom<=s.bottom,evidenceHeight:e.height,stageHeight:s.height,video:{ready:v.readyState,width:v.videoWidth,paused:v.paused,duration:v.duration,src:v.currentSrc,error:v.error?.message},visibleText:document.querySelector('.g2-film-evidence').innerText}})()`);
  report.push(state);await screenshot(`${width}-film-${chapter}`);
 }
 if(width===1440||width===390){
  for(const id of ['intelligence','advisory','software']){
   await evaluate(`document.getElementById('g21-house-${id}').scrollIntoView({block:'center',behavior:'instant'})`);await wait(500);
   await screenshot(`${width}-house-${id}`);
   report.push(await evaluate(`(()=>{const a=document.getElementById('g21-house-${id}'),h=a.querySelector('h3').getBoundingClientRect(),p=a.querySelector('.g21-house-portrait').getBoundingClientRect();return {width:innerWidth,kind:'house',id:'${id}',headingVisible:p.top>=h.bottom,active:document.querySelector('.g21-house-nav [aria-pressed=true]')?.textContent,heroLoaded:a.querySelector('.g2-emblem--hero')?.naturalWidth}})()`));
  }
 }
 console.log('Captured',width);
}
await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await call('Page.navigate',{url:'http://127.0.0.1:4173/br'});await wait(1800);
report.push(await evaluate("({kind:'reduced',playing:document.querySelector('.g2-hero-film')?.dataset.playing,paused:document.querySelector('.g2-film-cinema video')?.paused})"));
await fs.writeFile(new URL('report.json',directory),JSON.stringify({report,errors},null,2));
console.log(JSON.stringify({errors,failed:report.filter(r=>r.contained===false||r.overflow===true||r.headingVisible===false),count:report.length},null,2));
await cdp('Target.disposeBrowserContext',{browserContextId:context.browserContextId});socket.close();
