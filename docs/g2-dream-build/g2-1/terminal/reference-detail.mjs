import fs from 'node:fs/promises';
import path from 'node:path';
import {connect} from './native-session.mjs';
const dir=path.resolve('docs/g2-dream-build/g2-1/terminal/reference-flow');const b=await connect(),report=[];
const findText=async text=>b.evaluate(`(()=>{const es=[...document.querySelectorAll('body *')].filter(e=>e.textContent.trim().replace(/\\s+/g,' ')===${JSON.stringify(text)}).map(e=>({e,r:e.getBoundingClientRect()})).filter(x=>x.r.width>0&&x.r.height>0).sort((a,b)=>a.r.width*a.r.height-b.r.width*b.r.height);const r=es[0]?.r;return r?{x:r.x+r.width/2,y:r.y+r.height/2}:null;})()`);
const at=async point=>{await b.cdp('Input.dispatchMouseEvent',{type:'mouseMoved',...point});await b.delay(150);for(const type of ['mousePressed','mouseReleased'])await b.cdp('Input.dispatchMouseEvent',{type,button:'left',clickCount:1,...point});};
try {
 await b.cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
 await b.cdp('Page.navigate',{url:'https://kepler.gl/demo'});await b.delay(6500);let target=await findText('Try sample data');if(target){await at(target);await b.delay(1000);await b.screenshot(path.join(dir,'01-kepler-samples.png'));report.push({name:'kepler-samples',text:await b.evaluate('document.body.innerText')});target=await findText('NYC Taxi Trips');if(target){await at(target);await b.delay(4500);await b.screenshot(path.join(dir,'08-kepler-trip-layer.png'));report.push({name:'kepler-trip-layer',text:await b.evaluate('document.body.innerText')});}}
 await b.cdp('Page.navigate',{url:'https://www.windy.com/?-15.78,-47.93,4'});await b.delay(6500);target=await findText('Sunday 13');if(target){await at(target);await b.delay(3000);await b.screenshot(path.join(dir,'03-windy-time-selection.png'));report.push({name:'windy-time-selection',target,text:await b.evaluate('document.body.innerText')});}
 await b.cdp('Page.navigate',{url:'https://images.refero.design/styles/www.fey.com/bbc8d444-1624-4d01-baba-64e3325f6481/preview_0.jpg'});await b.delay(1500);await b.screenshot(path.join(dir,'07-fey-refero-archive.png'));report.push({name:'fey-archive',images:await b.evaluate('[...document.images].map(i=>({width:i.naturalWidth,height:i.naturalHeight,src:i.src}))')});
}finally {await fs.writeFile(path.join(dir,'details.json'),JSON.stringify(report,null,2));await b.close();}
console.log(report.map(x=>x.name).join(', '));
