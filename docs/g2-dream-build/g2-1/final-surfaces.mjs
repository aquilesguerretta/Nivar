import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire('C:/dev/nivar-g21-tools/package.json');
const WebSocket=require('ws');
const directory=new URL('./final-surfaces/',import.meta.url); await fs.mkdir(directory,{recursive:true});
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
 for(let i=0;i<90;i++){if(await evaluate("!!document.querySelector('.g21-house-instrument')"))break;await wait(100);}
 await evaluate("document.fonts.ready");await evaluate("document.querySelector('.g2-film-chapters button').click()");await wait(900);await screenshot(width+'-portal');
 report.push(await evaluate("({width:innerWidth,kind:'portal',overflow:document.querySelector('.g2-shell').scrollWidth>innerWidth,button:document.querySelector('.g21-film-stage-pause').getBoundingClientRect().height,previewCount:document.querySelectorAll('.g2-terminal--compact').length,fonts:getComputedStyle(document.querySelector('.g2')).fontFamily})"));
 await evaluate("document.getElementById('g21-house-software').scrollIntoView({block:'start',behavior:'instant'})");await wait(500);await screenshot(width+'-software');
 report.push(await evaluate("(()=>{const r=document.querySelector('.g21-house-instrument'),b=[...r.querySelectorAll('.g2t-regions button')].find(e=>e.innerText.includes('Nordeste'));b.click();return {width:innerWidth,kind:'software',overflow:r.scrollWidth>r.clientWidth,regionControlVisible:b.getClientRects().length>0&&getComputedStyle(b.closest('.g2t-geography')).display!=='none',productLinks:[...document.querySelectorAll('.g21-house-caption>a')].map(a=>({label:a.innerText,path:a.getAttribute('href'),height:a.getBoundingClientRect().height}))}})()"));
 await wait(300);report.push(await evaluate("({width:innerWidth,kind:'selection',value:document.querySelector('.g21-house-instrument .g2t-major-value')?.innerText,region:document.querySelector('.g21-house-instrument .g2t-series .g2t-panel-heading')?.innerText})"));
 if(width===390){await evaluate("document.querySelector('.g21-house-instrument .g2t-chart').scrollIntoView({block:'center',behavior:'instant'})");await screenshot('390-software-chart');await evaluate("document.getElementById('g21-house-intelligence').scrollIntoView({block:'center',behavior:'instant'})");await screenshot('390-intelligence');}
}
await call('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
await call('Page.navigate',{url:'http://127.0.0.1:4173/br'});await wait(1100);
await evaluate("document.querySelector('#g21-house-academy .g21-house-caption>a').click()");await wait(1800);await screenshot('alexandria-from-portal');
report.push(await evaluate("({kind:'alexandria',url:location.pathname+location.search,g2Ancestor:!!document.querySelector('.g2-shell'),font:getComputedStyle(document.body).fontFamily,headings:[...document.querySelectorAll('h1')].map(e=>e.innerText),g2Nodes:document.querySelectorAll('.g2').length})"));
for(const url of ['/entrar','/operador','/operador/conta-de-luz-express/cle-8f2a']){await call('Page.navigate',{url:'http://127.0.0.1:4173'+url});await wait(1200);await screenshot('1440-'+(url.includes('cle-')?'case':url.slice(1)));await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:false});await wait(250);await screenshot('390-'+(url.includes('cle-')?'case':url.slice(1)));report.push(await evaluate("({kind:'flow',url:location.pathname,overflow:document.querySelector('.g2-shell')?.scrollWidth>innerWidth,title:document.querySelector('h1')?.innerText})"));await call('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});}
await fs.writeFile(new URL('results.json',directory),JSON.stringify({report,errors},null,2));await cdp('Target.disposeBrowserContext',{browserContextId:context.browserContextId});socket.close();console.log(JSON.stringify({count:report.length,errors,failed:report.filter(x=>x.overflow||x.regionControlVisible===false||x.previewCount>1||x.g2Nodes>0)}));