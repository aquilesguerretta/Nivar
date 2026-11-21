// Native rendered film QA in a new isolated Chrome context. API calls are blocked.
import fs from 'node:fs/promises';
import path from 'node:path';
const out = path.resolve('docs/g2-dream-build/motion-runtime');
await fs.mkdir(out,{recursive:true});
const version = await (await fetch('http://127.0.0.1:9235/json/version')).json();
const socket = new WebSocket(version.webSocketDebuggerUrl);
await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject;});
let sequence=0, sessionId;
const pending=new Map(),exceptions=[],checks=[],frames=[];
const cdp=(method,params={},sid=sessionId)=>new Promise((resolve,reject)=>{const id=++sequence;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params,...(sid?{sessionId:sid}:{})}));});
socket.onmessage=({data})=>{const m=JSON.parse(data);if(m.id){const p=pending.get(m.id);if(!p)return;pending.delete(m.id);if(m.error)p.reject(Error(JSON.stringify(m.error)));else p.resolve(m.result);return;}if(m.sessionId!==sessionId)return;if(m.method==='Runtime.exceptionThrown')exceptions.push(m.params.exceptionDetails.exception?.description??m.params.exceptionDetails.text);if(m.method==='Fetch.requestPaused')cdp('Fetch.fulfillRequest',{requestId:m.params.requestId,responseCode:401,responseHeaders:[{name:'Content-Type',value:'application/json'}],body:Buffer.from('{"detail":"QA anonymous session; no backend request"}').toString('base64')}).catch(e=>exceptions.push(e.message));};
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function evaluate(expression){const r=await cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description??r.exceptionDetails.text);return r.result.value;}
async function until(expression){for(let i=0;i<150;i++){if(await evaluate(`Boolean(${expression})`))return;await delay(100);}throw Error('Timeout: '+expression);}
async function click(selector){const p=await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});if(!e)throw Error('Missing control');const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);await cdp('Input.dispatchMouseEvent',{type:'mousePressed',...p,button:'left',clickCount:1});await cdp('Input.dispatchMouseEvent',{type:'mouseReleased',...p,button:'left',clickCount:1});await delay(60);}
const state=()=>evaluate(`(()=>{const e=document.querySelector('.g2-hero-film');return {chapter:e.dataset.chapter,playing:e.dataset.playing,time:e.querySelector('.g2-film-transport>span').textContent,hidden:document.hidden};})()`);
function check(label,pass,detail){checks.push({label,pass,detail});}
const {browserContextId}=await cdp('Target.createBrowserContext',{},null);
try{
 const {targetId}=await cdp('Target.createTarget',{url:'about:blank',browserContextId},null);
 ({sessionId}=await cdp('Target.attachToTarget',{targetId,flatten:true},null));
 await cdp('Page.enable');await cdp('Runtime.enable');await cdp('Fetch.enable',{patterns:[{urlPattern:'http://127.0.0.1:4173/api/*',requestStage:'Request'}]});
 await cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
 await cdp('Page.navigate',{url:'http://127.0.0.1:4173/br'});await until("document.querySelector('button[aria-label^=\"1. \"]')");await evaluate('document.fonts.ready.then(()=>true)');await cdp('Page.bringToFront');
 await click('button[aria-label^="1. "]');await delay(950);
 const rect=await evaluate("(()=>{const r=document.querySelector('.g2-hero-film').getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,scale:1};})()");
 await click('button[aria-label="Reproduzir filme do método NIVAR"]');
 const start=Date.now();
 for(let i=0;i<=13;i++){
  const target=i*1500;await delay(Math.max(0,start+target-Date.now()));
  const current=await state();const shot=await cdp('Page.captureScreenshot',{format:'png',clip:rect,captureBeyondViewport:false});
  const name=`frame-${String(i).padStart(2,'0')}.png`;await fs.writeFile(path.join(out,name),Buffer.from(shot.data,'base64'));
  frames.push({file:name,elapsedMs:Date.now()-start,...current});
 }
 const all=['medir','organizar','observar','questionar','transmitir','procurar'];
 check('All six chapters render during continuous native playback',all.every(c=>frames.some(f=>f.chapter===c)),frames.map(f=>[f.elapsedMs,f.chapter]));
 check('Film returns to measurement after the 18-second cycle',frames.at(-1).chapter==='medir',frames.at(-1));
 check('Playback remained visible and running through recorded cycle',frames.every(f=>f.playing==='true'&&!f.hidden),frames.filter(f=>f.playing!=='true'||f.hidden));
 await click('button[aria-label="Pausar filme do método NIVAR"]');const pauseBefore=await state();await delay(1200);const pauseAfter=await state();check('Pause holds the actual timeline',pauseBefore.time===pauseAfter.time&&pauseAfter.playing==='false',{pauseBefore,pauseAfter});
 await click('button[aria-label^="4. "]');await delay(950);const chosen=await state();await delay(1100);check('Manual chapter selection pauses persistently',chosen.chapter==='questionar'&&(await state()).time===chosen.time&&chosen.playing==='false',chosen);
 await click('button[aria-label="Reproduzir filme do método NIVAR"]');await evaluate("document.querySelector('.g2-shell').scrollTo({top:4000,behavior:'instant'})");await delay(350);const offBefore=await state();await delay(1100);const offAfter=await state();check('Offscreen film stops advancing',offBefore.time===offAfter.time&&offAfter.playing==='false',{offBefore,offAfter});
 await evaluate("document.querySelector('.g2-shell').scrollTo({top:0,behavior:'instant'})");await delay(250);
 const hiddenPage=await cdp('Target.createTarget',{url:'about:blank',browserContextId},null);const hiddenSession=await cdp('Target.attachToTarget',{targetId:hiddenPage.targetId,flatten:true},null);await cdp('Page.bringToFront',{},hiddenSession.sessionId);await delay(350);const hiddenBefore=await state();await delay(1100);const hiddenAfter=await state();check('Hidden document stops advancing',hiddenBefore.time===hiddenAfter.time&&hiddenAfter.hidden&&hiddenAfter.playing==='false',{hiddenBefore,hiddenAfter});await cdp('Target.closeTarget',{targetId:hiddenPage.targetId},null);await cdp('Page.bringToFront');
 await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await cdp('Page.reload');await until("document.querySelector('.g2-hero-film')");await delay(950);const reducedBefore=await state();await delay(1200);const reducedAfter=await state();check('Reduced motion opens on a still first frame',reducedBefore.chapter==='medir'&&reducedAfter.time===reducedBefore.time&&reducedAfter.playing==='false',{reducedBefore,reducedAfter});
 await cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await evaluate("(()=>{const s=document.querySelector('.g2-shell'),f=document.querySelector('.g2-hero-film');s.scrollTo({top:s.scrollTop+f.getBoundingClientRect().top-84,behavior:'instant'});})()");await click('button[aria-label^="6. "]');const mobile=await evaluate("(()=>{const f=document.querySelector('.g2-hero-film'),s=document.querySelector('.g2-shell');const b=f.querySelector('button[aria-label^=\"Reiniciar\"]');return {width:innerWidth,scrollWidth:s.scrollWidth,chapter:f.dataset.chapter,playing:f.dataset.playing,restartVisible:b.getBoundingClientRect().width>=40};})()");check('Reduced-motion mobile chapters and restart remain available',mobile.chapter==='procurar'&&mobile.playing==='false'&&mobile.restartVisible&&mobile.scrollWidth<=mobile.width,mobile);
 const reducedShot=await cdp('Page.captureScreenshot',{format:'png'});await fs.writeFile(path.join(out,'reduced-motion-mobile.png'),Buffer.from(reducedShot.data,'base64'));
 check('No JavaScript runtime exceptions',exceptions.length===0,exceptions);
}finally{await fs.writeFile(path.join(out,'results.json'),JSON.stringify({date:new Date().toISOString(),scope:'Native browser-only QA, isolated anonymous context; no backend requests',checks,frames,exceptions},null,2));await cdp('Target.disposeBrowserContext',{browserContextId},null);socket.close();}
console.log(JSON.stringify({pass:checks.filter(c=>c.pass).length,total:checks.length,failures:checks.filter(c=>!c.pass),frames:frames.length}));
if(checks.some(c=>!c.pass))process.exitCode=1;
