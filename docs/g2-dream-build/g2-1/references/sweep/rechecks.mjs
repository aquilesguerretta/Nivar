import fs from 'node:fs/promises';
import path from 'node:path';
import {connect} from '../../terminal/native-session.mjs';
const out=path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/,'$1'));
const b=await connect();const log=[];
const point=async xy=>{await b.cdp('Input.dispatchMouseEvent',{type:'mouseMoved',...xy});await b.cdp('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...xy});await b.cdp('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...xy});};
try{
 await b.cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
 await b.cdp('Page.navigate',{url:'https://wearedirect.co/'});await b.delay(5000);
 const xy=await b.evaluate(`(()=>{const e=[...document.querySelectorAll('a')].find(e=>e.innerText.includes('Go to next page')&&e.innerText.includes('More Work'));if(!e)throw Error('No footer CTA');e.scrollIntoView({block:'center'});const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);await b.delay(700);await b.screenshot(path.join(out,'direct-footer-cta.png'));
 await point(xy);await b.delay(5000);await b.screenshot(path.join(out,'direct-footer-cta-destination.png'));log.push({name:'direct',state:await b.evaluate(`({url:location.href,title:document.title,text:document.body.innerText.slice(0,700)})`)});
 await b.cdp('Page.navigate',{url:'https://carbondesignsystem.com/data-visualization/color-palettes/'});await b.delay(5000);
 const cxy=await b.evaluate(`(()=>{const e=[...document.querySelectorAll('button')].filter(e=>e.innerText==='Dark')[1];e.scrollIntoView({block:'center'});const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()`);await b.delay(400);await point(cxy);await b.delay(500);await b.cdp('Input.dispatchMouseEvent',{type:'mouseWheel',x:1100,y:500,deltaX:0,deltaY:200});await b.delay(700);await b.screenshot(path.join(out,'carbon-color-group-dark.png'));log.push({name:'carbon',state:await b.evaluate(`[...document.querySelectorAll('[role=tab]')].filter(e=>e.innerText==='Light'||e.innerText==='Dark').map(e=>({text:e.innerText,selected:e.getAttribute('aria-selected')}))`)});
 await b.cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await b.cdp('Page.navigate',{url:'https://chesapeakeplywood.com/'});await b.delay(5500);await b.screenshot(path.join(out,'chesapeake-mobile-before-menu.png'));await point({x:345,y:51});await b.delay(900);await b.screenshot(path.join(out,'chesapeake-mobile-menu.png'));log.push({name:'chesapeake-mobile',state:await b.evaluate(`({url:location.href,text:document.body.innerText.slice(0,1500)})`)});
}catch(e){log.push({error:String(e)});}finally{await fs.writeFile(path.join(out,'recheck-observations.json'),JSON.stringify(log,null,2));await b.close();console.log(log);}
