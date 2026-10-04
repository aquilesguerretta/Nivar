import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
const WebSocket=createRequire('C:/dev/nivar-g21-tools/package.json')('ws');
export async function browser(){
 const info=await(await fetch('http://127.0.0.1:9235/json/version')).json();const ws=new WebSocket(info.webSocketDebuggerUrl);await new Promise(r=>ws.once('open',r));let seq=0;const pending=new Map(),errors=[];let sink=null;
 ws.on('message',raw=>{const m=JSON.parse(String(raw));if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(Error(m.error.message)):p.resolve(m.result);}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails);else if(m.method==='Page.screencastFrame'&&sink)sink(m.params);});
 const cdp=(method,params={},sessionId)=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params,sessionId}));});
 const {browserContextId}=await cdp('Target.createBrowserContext');const {targetId}=await cdp('Target.createTarget',{url:'about:blank',browserContextId});const {sessionId}=await cdp('Target.attachToTarget',{targetId,flatten:true});const call=(m,p={})=>cdp(m,p,sessionId);
 await call('Page.enable');await call('Runtime.enable');
 const ev=async expression=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
 const wait=ms=>new Promise(r=>setTimeout(r,ms));
 const shot=async path=>{const r=await call('Page.captureScreenshot',{format:'png'});await fs.writeFile(path,Buffer.from(r.data,'base64'));};
 const click=async selector=>{const rect=await ev(`(()=>{const e=document.querySelector(${JSON.stringify(selector)}),r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()`);await call('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...rect});await call('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...rect});};
 const open=async(width,url='http://127.0.0.1:4173/br/terminal')=>{await call('Emulation.setDeviceMetricsOverride',{width,height:width<700?844:1000,deviceScaleFactor:1,mobile:false});await call('Page.navigate',{url});for(let i=0;i<80;i++){if(await ev("!!document.querySelector('.g2-terminal')"))break;await wait(100);}await ev('document.fonts.ready');await wait(900);};
 return {call,ev,wait,shot,click,open,errors,setSink:f=>sink=f,close:async()=>{await cdp('Target.disposeBrowserContext',{browserContextId});ws.close();}};
}
if(process.argv.includes('--baseline')){const b=await browser();await fs.mkdir(new URL('./baseline/',import.meta.url),{recursive:true});for(const width of[1440,390]){await b.open(width);await b.shot(new URL(`./baseline/${width}-default.png`,import.meta.url));if(width===390){await b.click('.g2t-mobile-map-toggle');await b.shot(new URL(`./baseline/${width}-map.png`,import.meta.url));}await b.ev("document.querySelector('.g2t-series').scrollIntoView({block:'start'})");await b.wait(100);await b.shot(new URL(`./baseline/${width}-chart.png`,import.meta.url));}console.log(b.errors);await b.close();}
