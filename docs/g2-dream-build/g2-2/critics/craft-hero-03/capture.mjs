import fs from 'node:fs/promises';
import {connect} from '../../../g2-1/terminal/native-session.mjs';
const out=new URL('./',import.meta.url).pathname.replace(/^\/(\w:)/,'$1');
const s=await connect();
const series=[];
try {
 await s.cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
 await s.cdp('Page.navigate',{url:'http://127.0.0.1:4173/br'});
 await s.delay(1800);
 await s.screenshot(out+'captures/01-current-desktop.png');
 await fs.writeFile(out+'current-visible-text.txt',await s.evaluate('document.body.innerText'));
 await s.cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 await s.delay(1200);
 await s.screenshot(out+'captures/02-current-mobile-top.png');
 await s.evaluate('window.scrollTo(0,460)');
 await s.delay(600);
 await s.screenshot(out+'captures/03-current-mobile-hero.png');
 for(const [kind,w,h] of [['desktop',1438,666],['mobile',388,620]]) {
  await s.cdp('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:false});
  await s.cdp('Page.navigate',{url:'file:///C:/dev/gridalpha-v2-nivar-g2/docs/g2-dream-build/g2-2/hero/iteration05/hero-'+kind+'.mp4'});
  await s.until('document.querySelector("video")?.readyState>=2');
  await s.evaluate('(()=>{const v=document.querySelector("video");v.muted=true;v.controls=false;v.style="width:100vw;height:100vh;object-fit:contain";document.body.style="margin:0;background:#000";window.ev=[];["play","playing","seeking","seeked","ended","ratechange"].forEach(n=>v.addEventListener(n,()=>ev.push({event:n,time:v.currentTime,rate:v.playbackRate})));v.playbackRate=1;return v.play()})()');
  const start=Date.now(),samples=[];
  for(let i=0;i<200;i++) {
   const state=await s.evaluate('(()=>{const v=document.querySelector("video");return {time:v.currentTime,duration:v.duration,paused:v.paused,ended:v.ended,rate:v.playbackRate}})()');
   const file=`captures/${kind}-${String(i).padStart(3,'0')}.png`;
   await s.screenshot(out+file);
   samples.push({index:i,file,wallMs:Date.now()-start,...state});
   if(state.ended)break;
   await s.delay(200);
  }
  const events=await s.evaluate('ev');
  series.push({kind,wallMs:Date.now()-start,events,samples});
  await fs.writeFile(out+kind+'-playback.json',JSON.stringify(series.at(-1),null,2));
  console.log(JSON.stringify({kind,first:samples[0],last:samples.at(-1),events}));
 }
 await fs.writeFile(out+'playback.json',JSON.stringify(series,null,2));
} finally {await s.close();}
