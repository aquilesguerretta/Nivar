import fs from 'node:fs/promises';
import {browser} from './browser.mjs';
const iteration=process.argv[2]??'iteration02';if(!/^iteration\d+$/.test(iteration))throw Error('Invalid iteration directory');const b=await browser();
try {
 const report=[];
 const out=new URL(`./${iteration}/playback/`,import.meta.url);await fs.mkdir(out,{recursive:true});
 for(const width of[1440,390]){
  await b.call('Emulation.setDeviceMetricsOverride',{width,height:width<700?844:1000,deviceScaleFactor:1,mobile:false});
  await b.call('Page.navigate',{url:`http://127.0.0.1:4173/docs/g2-dream-build/g2-2/terminal/${iteration}/${width}-interaction.mp4`});
  for(let i=0;i<80;i++){if(await b.ev("!!document.querySelector('video')?.duration"))break;await b.wait(100);}
  await b.ev("(()=>{const v=document.querySelector('video');v.muted=true;v.currentTime=0;v.playbackRate=1;return v.play()})()");
  let ended=false,frame=0;
  while(!ended){await b.wait(2200);const state=await b.ev("(()=>{const v=document.querySelector('video');return{time:v.currentTime,duration:v.duration,rate:v.playbackRate,ended:v.ended,ready:v.readyState}})()");report.push({width,...state});await b.shot(new URL(`${width}-${String(frame++).padStart(2,'0')}.png`,out));ended=state.ended;if(frame>25)throw Error('Playback did not end');}
 }
 await fs.writeFile(new URL('playback.json',out),JSON.stringify(report,null,2));console.log(report);
}finally{await b.close();}
