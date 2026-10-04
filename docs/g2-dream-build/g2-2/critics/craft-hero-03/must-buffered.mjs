import fs from 'node:fs/promises';
import {connect} from '../../../g2-1/terminal/native-session.mjs';
const out=new URL('./',import.meta.url).pathname.replace(/^\/(\w:)/,'$1');
const s=await connect();
try{
 await s.cdp('Emulation.setDeviceMetricsOverride',{width:1200,height:900,deviceScaleFactor:1,mobile:false});
 const {frameTree}=await s.cdp('Page.getFrameTree');
 await s.cdp('Page.setDocumentContent',{frameId:frameTree.frame.id,html:'<!doctype html><body style="margin:0;background:#111"><video muted preload="auto" style="width:100vw;height:100vh;object-fit:contain" src="https://video.gumlet.io/66b49d08225b7b88f78b7b44/66b4bb27371d29849d7bcb71/download.mp4?craft03buffer=1"></video>'});
 const buffers=[];
 for(let i=0;i<60;i++){
  const state=await s.evaluate('(()=>{const v=document.querySelector("video");return {time:v.currentTime,duration:v.duration,ready:v.readyState,buffered:[...Array(v.buffered.length)].map((_,i)=>[v.buffered.start(i),v.buffered.end(i)]),error:v.error?.message}})()');
  buffers.push(state);
  if(i%10===0) console.log(JSON.stringify({buffer:i,...state}));
  if(state.buffered.some(x=>x[1]>=state.duration-.05))break;
  await s.delay(1000);
 }
 await s.evaluate('(()=>{const v=document.querySelector("video");v.muted=true;v.playbackRate=1;window.ev=[];["play","playing","seeking","seeked","ended","ratechange","waiting"].forEach(n=>v.addEventListener(n,()=>ev.push({event:n,time:v.currentTime,rate:v.playbackRate})));return v.play()})()');
 const samples=[],start=Date.now();
 for(let i=0;i<100;i++){
  const state=await s.evaluate('(()=>{const v=document.querySelector("video");return {time:v.currentTime,duration:v.duration,paused:v.paused,ended:v.ended,rate:v.playbackRate}})()');
  const file=`captures/must-buffered-${String(i).padStart(3,'0')}.png`;
  await s.screenshot(out+file);samples.push({index:i,file,wallMs:Date.now()-start,...state});
  if(state.ended)break;
  await s.delay(200);
 }
 const events=await s.evaluate('ev');
 await fs.writeFile(out+'must-buffered-playback.json',JSON.stringify({kind:'must-buffered',buffers,events,samples},null,2));
 console.log(JSON.stringify({first:samples[0],last:samples.at(-1),events}));
}finally{await s.close();}
