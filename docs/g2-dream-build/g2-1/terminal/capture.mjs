import fs from 'node:fs/promises';
import path from 'node:path';
const dir=path.resolve('docs/g2-dream-build/g2-1/terminal');
await fs.mkdir(dir,{recursive:true});
const version=await(await fetch('http://127.0.0.1:9235/json/version')).json();
const socket=new WebSocket(version.webSocketDebuggerUrl);
await new Promise((r,j)=>{socket.onopen=r;socket.onerror=j;});
let seq=0,sessionId;const pending=new Map();
const cdp=(method,params={},sid=sessionId)=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params,...(sid?{sessionId:sid}:{})}));});
socket.onmessage=({data})=>{const m=JSON.parse(data);if(m.id){const p=pending.get(m.id);if(!p)return;pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}};
const delay=ms=>new Promise(r=>setTimeout(r,ms));
const evaluate=async expression=>{const r=await cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.text);return r.result.value;};
const {browserContextId}=await cdp('Target.createBrowserContext',{},null);
const report=[];
try {
 const {targetId}=await cdp('Target.createTarget',{url:'about:blank',browserContextId},null);
 ({sessionId}=await cdp('Target.attachToTarget',{targetId,flatten:true},null));
 await cdp('Page.enable');await cdp('Runtime.enable');
 const refs=process.argv.includes('--refs') ? [
 ['fey','https://www.fey.com'],['linear','https://linear.app'],['origin','https://www.useorigin.com'],['dovetail','https://dovetail.com'],['windy','https://www.windy.com/?-15.78,-47.93,4'],['kepler','https://kepler.gl/demo']
 ] : [['terminal','http://127.0.0.1:4173/br/terminal']];
 for(const [name,url] of refs){
  await cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await cdp('Page.navigate',{url});await delay(6000);
  await evaluate('document.fonts.ready.then(()=>true)').catch(()=>null);
  for(const y of [0,700]){
   await evaluate(`(()=>{const e=document.querySelector('.g2-terminal');if(e)e.scrollTop=${y};else window.scrollTo(0,${y});})()`);await delay(700);
   const data=await evaluate(`({url:location.href,title:document.title,width:innerWidth,height:innerHeight,body:document.body.innerText.slice(0,18000),scrollWidth:document.documentElement.scrollWidth,images:[...document.images].filter(i=>i.getBoundingClientRect().height>50).map(i=>({src:i.currentSrc,loaded:i.complete&&i.naturalWidth>0}))})`);
   const screenshot=await cdp('Page.captureScreenshot',{format:'png'});const file=`${name}-1440-${y}.png`;
   await fs.writeFile(path.join(dir,file),Buffer.from(screenshot.data,'base64'));report.push({name,file,y,...data});
  }
  if(name==='terminal'){
   await cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
   for(const y of [0,600]){await evaluate(`document.querySelector('.g2-terminal').scrollTop=${y}`);await delay(300);const screenshot=await cdp('Page.captureScreenshot',{format:'png'});const file=`terminal-390-${y}.png`;await fs.writeFile(path.join(dir,file),Buffer.from(screenshot.data,'base64'));report.push({name,file,y,width:await evaluate('innerWidth'),scrollWidth:await evaluate("document.querySelector('.g2-terminal').scrollWidth")});}
  }
  console.log(name+' captured');
 }
}finally {await fs.writeFile(path.join(dir,process.argv.includes('--refs')?'reference-captures.json':'current-captures.json'),JSON.stringify(report,null,2));await cdp('Target.disposeBrowserContext',{browserContextId},null);socket.close();}
