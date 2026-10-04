import fs from 'node:fs/promises';
import path from 'node:path';
import {connect} from '../../terminal/native-session.mjs';
const out=path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/,'$1'));
const b=await connect();const log=[];
try{
 await b.cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
 await b.cdp('Page.navigate',{url:'https://pageflows.com/post/desktop-web/onboarding/dovetail/'});await b.delay(4200);
 await b.evaluate(`document.querySelector('video').scrollIntoView({block:'center'})`);await b.delay(300);
 console.log('chapters',await b.evaluate(`[...document.querySelectorAll('a,button,li,div')].filter(e=>e.children.length<3&&['Set up workspace','Set workspace name','Select country','Search'].includes(e.innerText.trim())).map(e=>({html:e.outerHTML.slice(0,800),rect:e.getBoundingClientRect().toJSON()})).slice(-12)`));
 await b.click('video');await b.delay(2100);log.push({phase:'play',state:await b.evaluate(`(()=>{const v=document.querySelector('video');return {time:v.currentTime,duration:v.duration,paused:v.paused,ready:v.readyState}})()`)});await b.screenshot(path.join(out,'pageflows-dovetail-playing.png'));
 const seek=async(pct,label)=>{await b.cdp('Input.dispatchMouseEvent',{type:'mouseMoved',x:900,y:700});const r=await b.evaluate(`(()=>{const r=document.querySelector('video').getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}})()`);const xy={x:r.x+16+(r.w-32)*pct,y:r.y+r.h-22};await b.cdp('Input.dispatchMouseEvent',{type:'mouseMoved',...xy});await b.cdp('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...xy});await b.cdp('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...xy});await b.delay(1500);await b.screenshot(path.join(out,`pageflows-dovetail-${label}.png`));log.push({phase:label,state:await b.evaluate(`(()=>{const v=document.querySelector('video');return {time:v.currentTime,duration:v.duration,paused:v.paused,ready:v.readyState,gateText:document.body.innerText.includes('Sign up to unlock this user flow')}})()`)});};
 await seek(.29,'workspace');await seek(.34,'country');await seek(.91,'search');
 await b.cdp('Page.navigate',{url:'https://blueprintjs.com/docs/#table'});await b.delay(4000);await b.screenshot(path.join(out,'blueprint-table.png'));
 console.log('blueprint',await b.evaluate(`({text:document.body.innerText.slice(-13000),buttons:[...document.querySelectorAll('button')].map(e=>({text:e.innerText,label:e.getAttribute('aria-label')})).slice(-45),controls:[...document.querySelectorAll('[role],input')].filter(e=>e.getBoundingClientRect().width>0).map(e=>({html:e.outerHTML.slice(0,300)})).slice(-35)})`));
}catch(e){log.push({error:String(e)});}finally{await fs.writeFile(path.join(out,'public-flow-checks.json'),JSON.stringify(log,null,2));await b.close();console.log(log);}
