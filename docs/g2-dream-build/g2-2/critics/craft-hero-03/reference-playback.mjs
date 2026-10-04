import fs from 'node:fs/promises';
import {connect} from '../../../g2-1/terminal/native-session.mjs';
const out=new URL('./',import.meta.url).pathname.replace(/^\/(\w:)/,'$1');
const s=await connect();
try {
 await s.cdp('Emulation.setDeviceMetricsOverride',{width:1200,height:900,deviceScaleFactor:1,mobile:false});
 for(const [kind,url] of [['cred','https://60fps.design/shots/cred-credit-card-full-page-offers-swipe-interaction'],['must','https://60fps.design/shots/must-movie-detail-sheet']]) {
  await s.cdp('Page.navigate',{url});
  await s.delay(6000);
  await s.screenshot(out+'captures/reference-'+kind+'-initial.png');
  console.log(JSON.stringify(await s.evaluate('({url:location.href,text:document.body.innerText.slice(0,2000),videos:[...document.querySelectorAll("video")].map(v=>({src:v.currentSrc,ready:v.readyState,error:v.error?.message}))})')));
  await s.screenshot(out+'captures/reference-'+kind+'-page.png');
  const video=await s.evaluate('(()=>{const v=document.querySelector("video");return {src:v.currentSrc,duration:v.duration,time:v.currentTime}})()');
  await s.cdp('Page.navigate',{url:video.src});
  await s.until('document.querySelector("video")?.readyState>=2');
  await s.evaluate('(()=>{const v=document.querySelector("video");v.muted=true;v.loop=false;v.controls=false;v.style="width:100vw;height:100vh;object-fit:contain";document.body.style="margin:0;background:#111";window.ev=[];["play","playing","seeking","seeked","ended","ratechange"].forEach(n=>v.addEventListener(n,()=>ev.push({event:n,time:v.currentTime,rate:v.playbackRate})));v.playbackRate=1;return v.play()})()');
  const start=Date.now(),samples=[];
  for(let i=0;i<200;i++) {
   const state=await s.evaluate('(()=>{const v=document.querySelector("video");return {time:v.currentTime,duration:v.duration,paused:v.paused,ended:v.ended,rate:v.playbackRate}})()');
   const file=`captures/reference-${kind}-${String(i).padStart(3,'0')}.png`;
   await s.screenshot(out+file);
   samples.push({index:i,file,wallMs:Date.now()-start,...state});
   if(state.ended)break;
   await s.delay(200);
  }
  const events=await s.evaluate('ev');
  await fs.writeFile(out+kind+'-playback.json',JSON.stringify({kind,url,video,wallMs:Date.now()-start,events,samples},null,2));
  console.log(JSON.stringify({kind,first:samples[0],last:samples.at(-1),events}));
 }
} finally {await s.close();}
