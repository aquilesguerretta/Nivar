import { connect } from '../../../g2-1/terminal/native-session.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
const root='C:/dev/gridalpha-v2-nivar-g2/docs/g2-dream-build/g2-2/critics/craft-hero-01';
const s=await connect();
const [mode,url,name='capture']=process.argv.slice(2);
await s.cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
try {
 await s.cdp('Page.navigate',{url});
 await s.until('document.readyState === "complete"');
 if(mode==='still'){
   await s.delay(5000); await s.screenshot(`${root}/${name}.png`);
   console.log(JSON.stringify(await s.evaluate('({title:document.title,text:document.body.innerText.slice(0,5000),videos:[...document.querySelectorAll("video")].map(v=>({src:v.currentSrc,duration:v.duration,paused:v.paused,rate:v.playbackRate}))})')));
 } else {
   await s.until('document.querySelector("video")?.readyState >= 2');
   console.log(JSON.stringify(await s.evaluate('({duration:document.querySelector("video").duration,width:document.querySelector("video").videoWidth,height:document.querySelector("video").videoHeight})')));
   await s.evaluate('(()=>{const v=document.querySelector("video");v.currentTime=0;v.playbackRate=1;v.loop=false;v.muted=true;v.play();})()');
   const frames=[]; const start=Date.now();
   for(let i=0;i<240;i++){
     const state=await s.evaluate('({time:document.querySelector("video").currentTime,ended:document.querySelector("video").ended,rate:document.querySelector("video").playbackRate,paused:document.querySelector("video").paused})');
     const file=`${name}/${String(i).padStart(3,'0')}.png`; await s.screenshot(`${root}/${file}`);
     frames.push({file,wallMs:Date.now()-start,...state});
     if(state.ended)break;
     await s.delay(Math.max(0,(i+1)*250-(Date.now()-start)));
   }
   await fs.writeFile(`${root}/${name}-timing.json`,JSON.stringify(frames,null,2));
   console.log(JSON.stringify({frames:frames.length,last:frames.at(-1)}));
 }
}finally{await s.close();}
