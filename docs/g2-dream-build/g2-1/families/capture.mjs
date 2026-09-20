import fs from 'node:fs/promises';
import path from 'node:path';
const dir=path.resolve('docs/g2-dream-build/g2-1/families');
const version=await(await fetch('http://127.0.0.1:9235/json/version')).json();
const socket=new WebSocket(version.webSocketDebuggerUrl);
await new Promise((r,j)=>{socket.onopen=r;socket.onerror=j;});
let seq=0,sessionId;const pending=new Map(),browserErrors=[];
const cdp=(method,params={},sid=sessionId)=>new Promise((resolve,reject)=>{const id=++seq;const timer=setTimeout(()=>reject(Error(method+' timeout')),30000);pending.set(id,{resolve,reject,timer});socket.send(JSON.stringify({id,method,params,...(sid?{sessionId:sid}:{})}));});
socket.onmessage=({data})=>{const m=JSON.parse(data);if(m.id){const p=pending.get(m.id);if(!p)return;pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}else if(m.sessionId===sessionId&&(m.method==='Runtime.exceptionThrown'||m.method==='Log.entryAdded'&&m.params.entry.level==='error'))browserErrors.push(m);};
const delay=ms=>new Promise(r=>setTimeout(r,ms));
const evaluate=async expression=>{const r=await cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.text);return r.result.value;};
const {browserContextId}=await cdp('Target.createBrowserContext',{},null);
const report=[];
const prefix=process.argv.find(a=>a.startsWith('--prefix='))?.split('=')[1]??'iteration01';
try {
 const {targetId}=await cdp('Target.createTarget',{url:'about:blank',browserContextId},null);
 ({sessionId}=await cdp('Target.attachToTarget',{targetId,flatten:true},null));
 await cdp('Page.enable');await cdp('Runtime.enable');await cdp('Log.enable');
 await cdp('Page.bringToFront');
 const selected=process.argv.find(a=>a.startsWith('--family='))?.split('=')[1];
 const dark=process.argv.includes('--dark');
 const singleWidth=Number(process.argv.find(a=>a.startsWith('--width='))?.split('=')[1]??0);
 for(const family of selected?[selected]:['intelligence','advisory','academy','software','hardware']){
  for(const [width,height] of singleWidth?[[singleWidth,1000]]:dark?[[1440,1000]]:[[1440,1000],[390,844]]){
   await cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width===390});
   await cdp('Page.navigate',{url:'http://127.0.0.1:4173/br/familia/'+family});await delay(1300);
   await evaluate('document.fonts.ready.then(()=>true)');
   if(dark && await evaluate("document.querySelector('.g2-shell').dataset.g2Theme!=='dark'")){
    const point=await evaluate("(()=>{const r=document.querySelector('.g2-mode').getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()");
    await cdp('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...point});await cdp('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...point});await delay(150);
   }
   const positions=singleWidth||dark?[0]:width===390?[0,620,1200]:[0,650];
   for(const y of positions){
    await evaluate(`document.querySelector('.g2-shell').scrollTo({top:${y},behavior:'instant'})`);await delay(600);
    const metrics=await evaluate(`({url:location.href,title:document.title,width:innerWidth,height:innerHeight,scrollWidth:document.querySelector('.g2-shell').scrollWidth,scrollHeight:document.querySelector('.g2-shell').scrollHeight,scrollTop:document.querySelector('.g2-shell').scrollTop,heading:document.querySelector('h1').textContent,headingFont:getComputedStyle(document.querySelector('h1')).fontFamily,images:[...document.images].map(i=>({src:i.currentSrc,width:i.naturalWidth,height:i.naturalHeight,complete:i.complete,box:i.getBoundingClientRect().toJSON()})),videos:[...document.querySelectorAll('video')].map(v=>({src:v.currentSrc,poster:v.poster,readyState:v.readyState,paused:v.paused,currentTime:v.currentTime,duration:v.duration,error:v.error})),overflows:[...document.querySelectorAll('main *')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&(b.right>innerWidth+1||b.left< -1)}).slice(0,12).map(e=>({tag:e.tagName,class:e.className,box:e.getBoundingClientRect().toJSON()}))})`);
    const shot=await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});const file=`screens/${prefix}-${family}-${width}-${y}.png`;
    await fs.writeFile(path.join(dir,file),Buffer.from(shot.data,'base64'));report.push({family,file,y,...metrics});
   }
   console.log(family+' '+width+' captured');
  }
 }
}finally{await fs.writeFile(path.join(dir,prefix+'-render-checks.json'),JSON.stringify({report,browserErrors},null,2));await cdp('Target.disposeBrowserContext',{browserContextId},null);socket.close();}
