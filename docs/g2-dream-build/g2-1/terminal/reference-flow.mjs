import fs from 'node:fs/promises';
import path from 'node:path';
import {connect} from './native-session.mjs';
const dir=path.resolve('docs/g2-dream-build/g2-1/terminal/reference-flow');await fs.mkdir(dir,{recursive:true});
const b=await connect(),report=[];
try {
 await b.cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
 await b.cdp('Page.navigate',{url:'https://kepler.gl/demo'});await b.delay(7000);
 const data=await b.evaluate(`({text:document.body.innerText,controls:[...document.querySelectorAll('button,a,[role="button"]')].map(e=>({tag:e.tagName,text:e.innerText,aria:e.getAttribute('aria-label'),class:e.className})).filter(e=>e.text||e.aria)})`);report.push({name:'kepler-entry',...data});
 const target=await b.evaluate(`(()=>{const e=[...document.querySelectorAll('*')].find(e=>e.children.length===0&&e.textContent.trim()==='Try sample data');if(!e)return null;const b=e.getBoundingClientRect();return {x:b.x+b.width/2,y:b.y+b.height/2};})()`);
 if(target){for(const type of ['mousePressed','mouseReleased'])await b.cdp('Input.dispatchMouseEvent',{type,button:'left',clickCount:1,...target});await b.delay(1200);await b.screenshot(path.join(dir,'01-kepler-samples.png'));report.push({name:'kepler-samples',text:await b.evaluate('document.body.innerText')});}
 await b.cdp('Page.navigate',{url:'https://www.windy.com/?-15.78,-47.93,4'});await b.delay(7000);await b.screenshot(path.join(dir,'02-windy-current.png'));
 report.push({name:'windy-controls',value:await b.evaluate(`({buttons:[...document.querySelectorAll('button,[role="button"]')].map(e=>({text:e.innerText,aria:e.getAttribute('aria-label'),id:e.id})),timeline:[...document.querySelectorAll('[id]')].filter(e=>/progress|calendar|play|timeline/.test(e.id)).map(e=>({id:e.id,text:e.innerText.slice(0,400)}))})`)});
 const targetTime=await b.evaluate(`(()=>{const e=[...document.querySelectorAll('*')].find(e=>e.children.length===0&&/Sunday 13/.test(e.textContent));if(!e)return null;const b=e.getBoundingClientRect();return {x:b.x+b.width/2,y:b.y+b.height/2};})()`);
 if(targetTime){for(const type of ['mousePressed','mouseReleased'])await b.cdp('Input.dispatchMouseEvent',{type,button:'left',clickCount:1,...targetTime});await b.delay(1000);await b.screenshot(path.join(dir,'03-windy-time-selection.png'));report.push({name:'windy-time-selection',text:await b.evaluate('document.body.innerText')});}
 await b.cdp('Page.navigate',{url:'https://linear.app'});await b.delay(5000);await b.evaluate('window.scrollTo(0,450)');await b.delay(500);
 for(let i=0;i<3;i++){await b.screenshot(path.join(dir,`0${4+i}-linear-motion-${i}.png`));await b.delay(1600);}
 report.push({name:'linear-live-demo',text:await b.evaluate('document.body.innerText')});
}finally {await fs.writeFile(path.join(dir,'flow.json'),JSON.stringify(report,null,2));await b.close();}
console.log('Reference flow captured');
