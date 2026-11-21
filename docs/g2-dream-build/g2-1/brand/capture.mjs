import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const version=await(await fetch('http://127.0.0.1:9235/json/version')).json();
const socket=new WebSocket(version.webSocketDebuggerUrl);await new Promise((r,j)=>{socket.onopen=r;socket.onerror=j});
let seq=0,sessionId;const pending=new Map();
const cdp=(method,params={},sid=sessionId)=>new Promise((resolve,reject)=>{const id=++seq;const timer=setTimeout(()=>{pending.delete(id);reject(Error(method+' timeout'));},25000);pending.set(id,{resolve,reject,timer});socket.send(JSON.stringify({id,method,params,...(sid?{sessionId:sid}:{})}));});
socket.onmessage=({data})=>{const m=JSON.parse(data);if(m.id){const p=pending.get(m.id);if(!p)return;clearTimeout(p.timer);pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result)}};
const delay=ms=>new Promise(r=>setTimeout(r,ms));
const evaluate=async expression=>{const r=await cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.text);return r.result.value;};
const {browserContextId}=await cdp('Target.createBrowserContext',{},null);const report=[];
try{
 const {targetId}=await cdp('Target.createTarget',{url:'about:blank',browserContextId},null);({sessionId}=await cdp('Target.attachToTarget',{targetId,flatten:true},null));await cdp('Page.enable');await cdp('Runtime.enable');
 const refs=process.argv.includes('--refs');
 const targets=process.argv.includes('--runtime')?[
 ['brand-runtime','http://127.0.0.1:4173/docs/g2-dream-build/g2-1/brand/brand-runtime.html',[0,780]],
 ]:process.argv.includes('--directions')?[
 ['emblem-directions','http://127.0.0.1:4173/docs/g2-dream-build/g2-1/brand/emblem-directions.html',[0,700]],
 ]:refs?[
 ['logobook-n','https://logobook.com/letter/n/',[0,650]],
 ['typewolf-fraunces','https://www.typewolf.com/fraunces',[270,880]],
 ['fontshare-general-sans','https://www.fontshare.com/fonts/general-sans',[0,1150]],
 ['nasa-brand','https://www.nasa.gov/nasa-brand-center/brand-guidelines/',[550,2100,'architecture']],
 ['literata','https://fonts.google.com/specimen/Literata',[0,550]],
 ]:[
 ['wordmarks','http://127.0.0.1:4173/docs/g2-dream-build/g2-1/brand/index.html?mode=marks',[0,650]],
 ['type','http://127.0.0.1:4173/docs/g2-dream-build/g2-1/brand/index.html?mode=type',[0,780,1350]],
 ['emblems','http://127.0.0.1:4173/docs/g2-dream-build/g2-1/brand/index.html?mode=emblems',[0,780]],
 ];
 for(const [name,url,positions] of targets){
  await cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});await cdp('Page.navigate',{url});await delay(refs?4500:800);await cdp('Page.bringToFront');await evaluate('document.fonts.ready.then(()=>true)').catch(()=>false);
  for(const y of positions){await evaluate(y==='architecture'?`[...document.querySelectorAll('h2,h3,h4')].find(h=>h.textContent.includes('Emblems: Crew')).scrollIntoView()`:`window.scrollTo(0,${y})`);await delay(180);const screenshot=await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});const file=`${refs?'references':'screens'}/${name}-1440-${y}.png`;await fs.writeFile(path.join(dir,file),Buffer.from(screenshot.data,'base64'));report.push({name,file,url,y,...await evaluate(`({width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,title:document.title,fontStatus:document.fonts.status,loadedFonts:[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family+' '+f.style+' '+f.weight),body:document.body.innerText.slice(0,16000)})`)});}
  if(name==='brand-runtime'){
   for(const mode of ['light','dark']){
    await evaluate(`document.body.classList.toggle('dark',${mode==='dark'})`);
    for(const [width,height] of [[1440,1000],[390,844]]){
     await cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width===390});
     for(const y of [0,width===390?700:780]){
      await evaluate(`window.scrollTo(0,${y}); document.querySelectorAll('img').forEach(i=>i.loading='eager')`);await evaluate(`Promise.all([...document.images].map(i=>i.decode().catch(()=>null)))`);await delay(150);
      const shot=await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});const file=`screens/brand-runtime-${width}-${mode}-${y}.png`;await fs.writeFile(path.join(dir,file),Buffer.from(shot.data,'base64'));
      report.push({name,file,mode,...await evaluate(`({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,images:[...document.images].map(i=>({src:i.currentSrc,width:i.naturalWidth,height:i.naturalHeight,complete:i.complete})),variants:[...document.querySelectorAll('[data-emblem-variant]')].map(e=>({variant:e.dataset.emblemVariant,tag:e.tagName,box:e.getBoundingClientRect().width}))})`)});
     }
    }
   }
  }
  if(name==='type'||name==='wordmarks'){
   await cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
   const sels=name==='type'?['.system-a','.system-b','.system-c']:['.panel:nth-child(1)','.panel:nth-child(2)','.panel:nth-child(3)'];
   for(let i=0;i<sels.length;i++){await evaluate(`document.querySelector('${sels[i]}').scrollIntoView({block:'start'})`);await delay(180);const shot=await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});const file=`screens/${name}-390-${i+1}.png`;await fs.writeFile(path.join(dir,file),Buffer.from(shot.data,'base64'));report.push({name,file,url,...await evaluate(`({width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth})`)});}
  }
  console.log(name+' captured');
 }
}finally{await fs.writeFile(path.join(dir,process.argv.includes('--refs')?'reference-captures.json':process.argv.includes('--directions')?'emblem-direction-checks.json':process.argv.includes('--runtime')?'runtime-checks.json':'render-checks.json'),JSON.stringify(report,null,2));await cdp('Target.disposeBrowserContext',{browserContextId},null);socket.close();}
