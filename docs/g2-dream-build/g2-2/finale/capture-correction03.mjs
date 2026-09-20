import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
globalThis.WebSocket=createRequire('C:/dev/nivar-g21-tools/package.json')('ws');
const {connect}=await import('../../g2-1/terminal/native-session.mjs');
const directory=path.join(path.dirname(fileURLToPath(import.meta.url)),'correction-03');
await fs.mkdir(directory,{recursive:true});
const reports=[];
for(const width of [1440,390]) for(const mode of ['light','dark']) {
 const s=await connect(),height=width<700?844:1000,label=`${width}-${mode}`,frames=[];
 let recording=false,loop;
 const framesDir=path.join(directory,'frames-'+label);await fs.mkdir(framesDir,{recursive:true});
 const snap=async name=>s.screenshot(path.join(directory,`${label}-${name}.png`));
 const capture=async()=>{while(recording){const shot=await s.cdp('Page.captureScreenshot',{format:'jpeg',quality:86});const file=path.join(framesDir,String(frames.length).padStart(5,'0')+'.jpg');frames.push({time:Date.now()/1000,file});await fs.writeFile(file,Buffer.from(shot.data,'base64'));await s.delay(60);}};
 const wheel=async delta=>{await s.cdp('Input.dispatchMouseEvent',{type:'mouseWheel',x:width-25,y:height*.62,deltaX:0,deltaY:delta});await s.delay(260);};
 const events=[];
 try{
  await s.cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
  await s.cdp('Page.navigate',{url:'http://127.0.0.1:4173/br'});await s.until('document.querySelector(".g22-finale")');await s.evaluate('document.fonts.ready');
  if(mode==='dark') await s.evaluate('document.querySelector(".g2-mode").click()');
  await s.evaluate('(()=>{const root=document.querySelector(".g2-shell"),scene=document.querySelector(".g22-finale");root.scrollTo({top:root.scrollTop+scene.getBoundingClientRect().top-330,behavior:"instant"})})()');await s.delay(600);
  recording=true;loop=capture();await s.delay(500);
  await wheel(120);await wheel(120);await s.delay(400);await snap('opening');
  await wheel(160);await wheel(160);await s.delay(350);await snap('closing');
  await s.click('.g22-finale-reveal');await s.delay(450);if(width<700)await wheel(125);await snap('source');events.push({event:'source-open',expanded:await s.evaluate('document.querySelector(".g22-finale-reveal").getAttribute("aria-expanded")')});
  await s.click('.g22-finale-reveal');await s.delay(300);
  await s.click('.g22-finale-notebook-open');await s.delay(400);await snap('notebook');
  for(let i=0;i<5;i++){await s.click(`.g22-finale-traces button:nth-child(${i+1})`);await s.delay(150);events.push({event:'trace',index:i,pressed:await s.evaluate(`document.querySelector('.g22-finale-traces button:nth-child(${i+1})').getAttribute('aria-pressed')`)});}
  await s.cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await s.cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await s.delay(400);
  events.push({event:'escape',...await s.evaluate('({closed:!document.querySelector(".g22-finale-notebook").open,returned:document.activeElement===document.querySelector(".g22-finale-notebook-open")})')});
  await wheel(500);await s.delay(600);await snap('resolution');
  const finalGeometry=await s.evaluate(`(()=>{const r=q=>{const a=document.querySelector(q).getBoundingClientRect();return{top:a.top,bottom:a.bottom,width:a.width,height:a.height}};return{width:innerWidth,overflow:document.querySelector('.g2-shell').scrollWidth>innerWidth,imageLoaded:document.querySelector('.g22-finale-figure img').naturalWidth>0,header:r('.g2-header'),heading:r('.g22-finale-heading h2'),kicker:r('.g22-finale-heading .g22-finale-kicker'),figure:r('.g22-finale-figure'),question:r('.g22-finale-open-question'),action:r('.g22-finale-enter')}})()`);
  recording=false;await loop;
  const concat=frames.map((f,i)=>`file '${f.file.replaceAll('\\','/')}'\nduration ${Math.max(.016,(frames[i+1]?.time??f.time+.15)-f.time)}`).join('\n');
  const concatPath=path.join(directory,`${label}-concat.txt`);await fs.writeFile(concatPath,concat);
  const output=path.join(directory,`${label}-interaction.mp4`);
  const encoded=spawnSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',concatPath,'-vf','fps=30,format=yuv420p','-c:v','libx264','-crf','23','-movflags','+faststart',output],{encoding:'utf8',windowsHide:true});if(encoded.status!==0)throw Error(encoded.stderr);
  const report={width,height,mode,url:'http://127.0.0.1:4173/br',nativeDuration:frames.at(-1).time-frames[0].time,frames:frames.map(({time},i)=>({index:i,time})),events,finalGeometry,exceptions:s.exceptions,output};
  await fs.writeFile(path.join(directory,`${label}-verification.json`),JSON.stringify(report,null,2));reports.push({...report,frames:frames.length});
  if(!path.resolve(framesDir).startsWith(path.resolve(directory)+path.sep)||!path.basename(framesDir).startsWith('frames-'))throw Error('Unsafe temporary frame path');await fs.rm(framesDir,{recursive:true});await fs.unlink(concatPath);
 } finally{recording=false;await loop;await s.close();}
}
await fs.writeFile(path.join(directory,'verification.json'),JSON.stringify(reports,null,2));console.log(JSON.stringify(reports,null,2));
