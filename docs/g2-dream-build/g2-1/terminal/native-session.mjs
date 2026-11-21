import fs from 'node:fs/promises';
import path from 'node:path';
export async function connect() {
 const version=await(await fetch('http://127.0.0.1:9235/json/version')).json();
 const socket=new WebSocket(version.webSocketDebuggerUrl);
 await new Promise((r,j)=>{socket.onopen=r;socket.onerror=j;});
 let seq=0,sessionId;const pending=new Map(),exceptions=[],logs=[];
 const cdp=(method,params={},sid=sessionId)=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params,...(sid?{sessionId:sid}:{})}));});
 socket.onmessage=({data})=>{const m=JSON.parse(data);if(m.id){const p=pending.get(m.id);if(!p)return;pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}else if(m.sessionId===sessionId&&m.method==='Runtime.exceptionThrown')exceptions.push(m.params.exceptionDetails);else if(m.sessionId===sessionId&&m.method==='Log.entryAdded')logs.push(m.params.entry);};
 const {browserContextId}=await cdp('Target.createBrowserContext',{},null);
 const {targetId}=await cdp('Target.createTarget',{url:'about:blank',browserContextId},null);
 ({sessionId}=await cdp('Target.attachToTarget',{targetId,flatten:true},null));
 await cdp('Page.enable');await cdp('Runtime.enable');await cdp('Log.enable');
 const evaluate=async expression=>{const r=await cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description??r.exceptionDetails.text);return r.result.value;};
 const delay=ms=>new Promise(r=>setTimeout(r,ms));
 const until=async expression=>{for(let i=0;i<100;i++){if(await evaluate(`Boolean(${expression})`))return;await delay(200);}throw Error('Timeout: '+expression);};
 const screenshot=async file=>{await fs.mkdir(path.dirname(file),{recursive:true});const shot=await cdp('Page.captureScreenshot',{format:'png'});await fs.writeFile(file,Buffer.from(shot.data,'base64'));};
 const click=async selector=>{const bounds=await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});if(!e)throw Error('Missing target');e.scrollIntoView({block:'nearest'});const b=e.getBoundingClientRect();return {x:b.x+b.width/2,y:b.y+b.height/2};})()`);await cdp('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...bounds});await cdp('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...bounds});};
 return {cdp,evaluate,delay,until,screenshot,click,exceptions,logs,browserContextId,close:async()=>{await cdp('Target.disposeBrowserContext',{browserContextId},null);socket.close();}};
}
