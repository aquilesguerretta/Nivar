import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {connect} from '../../../g2-1/terminal/native-session.mjs';
const out=path.dirname(fileURLToPath(import.meta.url));
const url='file:///C:/dev/gridalpha-v2-nivar-g2/docs/g2-dream-build/g2-2/review.html';
const s=await connect();
try{
 await s.cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
 await s.cdp('Page.navigate',{url});
 await s.delay(1800);
 await s.screenshot(path.join(out,'01-desktop-top.png'));
 const structure=await s.evaluate(`({url:location.href,title:document.title,text:document.body.innerText,headings:[...document.querySelectorAll('h1,h2,h3')].map(e=>({text:e.innerText,top:e.getBoundingClientRect().top+scrollY})),resources:[...document.querySelectorAll('[href],[src],[poster]')].flatMap(e=>['href','src','poster'].filter(a=>e.hasAttribute(a)).map(a=>({tag:e.tagName,attr:a,value:e.getAttribute(a),resolved:new URL(e.getAttribute(a),location.href).href}))),images:[...document.images].map(e=>({src:e.currentSrc,complete:e.complete,naturalWidth:e.naturalWidth,rect:{top:e.getBoundingClientRect().top+scrollY,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height}})),videos:[...document.querySelectorAll('video')].map((e,i)=>({index:i,src:e.currentSrc,poster:e.poster,controls:e.controls,readyState:e.readyState,error:e.error?.message,rect:{top:e.getBoundingClientRect().top+scrollY,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height}}))})`);
 await fs.writeFile(path.join(out,'desktop-dom.json'),JSON.stringify(structure,null,2));
 const local=[];
 for(const r of structure.resources){
  if(!r.resolved.startsWith('file:'))continue;
  const u=new URL(r.resolved);u.hash='';u.search='';
  const p=fileURLToPath(u);let exists=false;try{await fs.access(p);exists=true;}catch{}
  local.push({...r,path:p,exists});
 }
 await fs.writeFile(path.join(out,'local-targets.json'),JSON.stringify(local,null,2));
 console.log(JSON.stringify({title:structure.title,headings:structure.headings,videos:structure.videos,brokenImages:structure.images.filter(i=>!i.complete||!i.naturalWidth),missing:local.filter(r=>!r.exists)}));
 for(const [i,v] of structure.videos.entries()){
  await s.evaluate(`document.querySelectorAll('video')[${i}].scrollIntoView({block:'center'})`);
  await s.delay(400);
  await s.screenshot(path.join(out,`desktop-video-${i}.png`));
 }
 await s.cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 await s.evaluate('window.scrollTo(0,0)');await s.delay(700);
 await s.screenshot(path.join(out,'02-phone-top.png'));
 const phone=await s.evaluate(`({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,videos:[...document.querySelectorAll('video')].map((e,i)=>({index:i,src:e.currentSrc,poster:e.poster,controls:e.controls,readyState:e.readyState,error:e.error?.message,rect:{left:e.getBoundingClientRect().left,top:e.getBoundingClientRect().top+scrollY,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height}}))})`);
 await fs.writeFile(path.join(out,'phone-dom.json'),JSON.stringify(phone,null,2));
 for(const [i,v] of phone.videos.entries()){
  await s.evaluate(`document.querySelectorAll('video')[${i}].scrollIntoView({block:'center'})`);
  await s.delay(400);
  await s.screenshot(path.join(out,`phone-video-${i}.png`));
 }
 console.log(JSON.stringify({phone}));
}finally{await s.close();}
