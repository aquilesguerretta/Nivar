import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {connect} from '../../../g2-1/terminal/native-session.mjs';
const out=path.dirname(fileURLToPath(import.meta.url));
const s=await connect();const tests=[];
const state=async i=>s.evaluate(`(()=>{const v=document.querySelectorAll('video')[${i}],b=v.getBoundingClientRect();return {index:${i},time:v.currentTime,paused:v.paused,ready:v.readyState,duration:v.duration,error:v.error?.message,x:b.x,y:b.y,width:b.width,height:b.height}})()`);
try{
 await s.cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
 await s.cdp('Page.navigate',{url:'file:///C:/dev/gridalpha-v2-nivar-g2/docs/g2-dream-build/g2-2/review.html'});await s.delay(1200);
 const n=await s.evaluate('document.querySelectorAll("video").length');
 for(let i=0;i<n;i++){
  await s.evaluate(`document.querySelectorAll('video')[${i}].scrollIntoView({block:'center'})`);await s.delay(200);
  const before=await state(i),x=before.x+25,y=before.y+before.height-47;
  await s.cdp('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,x,y});
  await s.cdp('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,x,y});
  let after;
  for(let j=0;j<12;j++){await s.delay(250);after=await state(i);if(after.time>.1||after.error)break;}
  await s.evaluate(`document.querySelectorAll('video')[${i}].pause()`);
  tests.push({viewport:'desktop',before,after});
  if([0,1,8,10].includes(i))await s.screenshot(path.join(out,`desktop-played-${i}.png`));
 }
 const imageCount=await s.evaluate('document.images.length');
 for(let i=0;i<imageCount;i++){await s.evaluate(`document.images[${i}].scrollIntoView({block:'center'})`);await s.delay(500);await s.screenshot(path.join(out,`desktop-image-${i}.png`));}
 const images=await s.evaluate('Array.from(document.images).map(e=>({src:e.currentSrc,complete:e.complete,naturalWidth:e.naturalWidth,naturalHeight:e.naturalHeight}))');
 await s.cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 for(const i of [0,1,8,9]){
  await s.evaluate(`document.querySelectorAll('video')[${i}].scrollIntoView({block:'center'})`);await s.delay(250);
  const before=await state(i),x=before.x+25,y=before.y+before.height-47;
  await s.cdp('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,x,y});
  await s.cdp('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,x,y});
  await s.delay(800);const after=await state(i);await s.evaluate(`document.querySelectorAll('video')[${i}].pause()`);
  tests.push({viewport:'phone',before,after});await s.screenshot(path.join(out,`phone-played-${i}.png`));
 }
 const anchors=await s.evaluate('Array.from(document.querySelectorAll("a[href^=\\\"#\\\"]")).map(a=>({href:a.getAttribute("href"),found:!!document.getElementById(a.hash.slice(1))}))');
 const result={tests,images,anchors};await fs.writeFile(path.join(out,'activation-and-images.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
}finally{await s.close();}
