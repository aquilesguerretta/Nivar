// Native Chrome inspection of all public G2 surfaces. Anonymous API responses are browser-local.
import fs from 'node:fs/promises';
import path from 'node:path';
const detailsOnly=process.argv.includes('--details-only');const out=path.resolve('docs/g2-dream-build/'+(detailsOnly?'portal-final-details':'public-final'));await fs.mkdir(out,{recursive:true});
const version=await(await fetch('http://127.0.0.1:9235/json/version')).json();const socket=new WebSocket(version.webSocketDebuggerUrl);
await new Promise((r,j)=>{socket.onopen=r;socket.onerror=j;});let seq=0,sessionId;const pending=new Map(),exceptions=[],results=[];
const cdp=(method,params={},sid=sessionId)=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params,...(sid?{sessionId:sid}:{})}));});
socket.onmessage=({data})=>{const m=JSON.parse(data);if(m.id){const p=pending.get(m.id);if(!p)return;pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);return;}if(m.sessionId!==sessionId)return;if(m.method==='Runtime.exceptionThrown')exceptions.push(m.params.exceptionDetails.exception?.description??m.params.exceptionDetails.text);if(m.method==='Fetch.requestPaused')cdp('Fetch.fulfillRequest',{requestId:m.params.requestId,responseCode:401,responseHeaders:[{name:'Content-Type',value:'application/json'}],body:Buffer.from('{"detail":"Anonymous QA fixture"}').toString('base64')}).catch(e=>exceptions.push(e.message));};
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function evaluate(expression){const r=await cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description??r.exceptionDetails.text);return r.result.value;}
async function until(expression){for(let i=0;i<200;i++){if(await evaluate(`Boolean(${expression})`))return;await delay(100);}throw Error('Timeout '+expression);}
const {browserContextId}=await cdp('Target.createBrowserContext',{},null);
try{
const {targetId}=await cdp('Target.createTarget',{url:'about:blank',browserContextId},null);({sessionId}=await cdp('Target.attachToTarget',{targetId,flatten:true},null));await cdp('Page.enable');await cdp('Runtime.enable');await cdp('Fetch.enable',{patterns:[{urlPattern:'http://127.0.0.1:4173/api/*',requestStage:'Request'}]});await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
await cdp('Page.navigate',{url:'http://127.0.0.1:4173/br'});await until("document.querySelector('.g2-shell')");
for(const mode of ['light','dark']){await evaluate(`localStorage.setItem('nivar-g2-mode','${mode}')`);
for(const [size,width,height] of [['desktop',1440,1000],['mobile',390,844]]){await cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:size==='mobile'});
for(const slug of (detailsOnly?['portal']:['portal','intelligence','advisory','academy','software','hardware','brief','metodo','sistema'])){
const url='http://127.0.0.1:4173/br'+(slug==='portal'?'':'/'+slug);await cdp('Page.navigate',{url});await until("document.querySelector('.g2-shell h1')");await cdp('Page.bringToFront');await evaluate('document.fonts.ready.then(()=>true)');await delay(180);
await evaluate("(()=>{const s=document.querySelector('.g2-shell');for(const i of s.querySelectorAll('img'))i.loading='eager';return Promise.all([...s.querySelectorAll('img')].map(i=>i.decode().catch(()=>null)));})()");await delay(100);
const measured=await evaluate("(()=>{const s=document.querySelector('.g2-shell');return {title:document.title,heading:s.querySelector('h1').textContent,width:innerWidth,scrollWidth:s.scrollWidth,theme:s.dataset.g2Theme,broken:[...s.querySelectorAll('img')].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src),font:getComputedStyle(s.querySelector('h1')).fontFamily};})()");
const name=`${slug}-${size}-${mode}.png`;const shot=await cdp('Page.captureScreenshot',{format:'png'});await fs.writeFile(path.join(out,name),Buffer.from(shot.data,'base64'));results.push({url,size,mode,file:name,...measured,pass:measured.width===width&&measured.scrollWidth<=width&&measured.theme===mode&&measured.broken.length===0});
if(slug==='portal'&&size==='mobile')for(const [section,selector] of [['house','.g2-house-index'],['terminal','.g2-terminal-passage'],['editorial','.g2-editorial-feature'],['advisory','.g2-advisory-passage'],['human','.g2-human-pair']]){const found=await evaluate(`(()=>{const s=document.querySelector('.g2-shell'),e=s.querySelector('${selector}');if(!e)return false;s.scrollTo({top:s.scrollTop+e.getBoundingClientRect().top-80,behavior:'instant'});return true;})()`);if(found){await delay(120);const image=await cdp('Page.captureScreenshot',{format:'png'});await fs.writeFile(path.join(out,`portal-${section}-mobile-${mode}.png`),Buffer.from(image.data,'base64'));}}
}
}
}
}finally{await fs.writeFile(path.join(out,'results.json'),JSON.stringify({date:new Date().toISOString(),results,exceptions},null,2));await cdp('Target.disposeBrowserContext',{browserContextId},null);socket.close();}
console.log(JSON.stringify({pass:results.filter(r=>r.pass).length,total:results.length,failures:results.filter(r=>!r.pass),exceptions}));if(exceptions.length||results.some(r=>!r.pass))process.exitCode=1;
