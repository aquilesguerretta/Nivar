import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
globalThis.WebSocket=createRequire('C:/dev/nivar-g21-tools/package.json')('ws');
const {connect}=await import('../../g2-1/terminal/native-session.mjs');
const directory=new URL('./correction-01/',import.meta.url).pathname.replace(/^\/([A-Z]:)/,'$1');
await fs.mkdir(directory,{recursive:true});
const results=[];
for(const width of [1440,1024,768,390,360]){
 const s=await connect();const height=width<700?844:1000;
 await s.cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
 await s.cdp('Page.navigate',{url:'http://127.0.0.1:4173/br'});
 await s.until('document.querySelector(".g22-finale")');await s.evaluate('document.fonts.ready');
 await s.evaluate('document.querySelector(".g22-finale").scrollIntoView({block:"start",behavior:"instant"})');
 await s.delay(500);
 for(const mode of ['light','dark']){
 if(mode==='dark')await s.click('.g2-mode');await s.delay(300);
 await s.screenshot(`${directory}/${width}-${mode}-opening.png`);
 await s.evaluate('document.querySelector(".g2-shell").scrollTo({top:1e8,behavior:"instant"})');await s.delay(250);
 await s.screenshot(`${directory}/${width}-${mode}-end.png`);
 results.push({width,mode,...await s.evaluate(`(()=>{const q=(x)=>{const r=document.querySelector(x).getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,width:r.width,height:r.height}};return{viewport:innerWidth,overflow:document.querySelector('.g2-shell').scrollWidth>innerWidth,imageLoaded:document.querySelector('.g22-finale-figure img').naturalWidth>0,figure:q('.g22-finale-figure'),question:q('.g22-finale-open-question'),action:q('.g22-finale-enter'),scene:q('.g22-finale-stage')}})()`)});
 await s.evaluate('document.querySelector(".g22-finale").scrollIntoView({block:"start",behavior:"instant"})');
 }
 await s.close();
}
await fs.writeFile(directory+'/responsive.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
