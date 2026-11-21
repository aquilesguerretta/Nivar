import fs from 'node:fs/promises';
import path from 'node:path';
import {connect} from '../../terminal/native-session.mjs';
const out=path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/,'$1'));
const b=await connect();
try {
 await b.cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 await b.cdp('Page.navigate',{url:'https://www.incommonwith.com/collections/all-lighting'});await b.delay(5500);
 console.log('common toggle DOM',await b.evaluate(`[...document.querySelectorAll('#lighting-toggle,#lighting-toggle-utility,label[for*=lighting]')].map(e=>({html:e.outerHTML,rect:e.getBoundingClientRect().toJSON()}))`));
 await b.click('label[for="lighting-toggle"]');await b.delay(800);await b.screenshot(path.join(out,'common-on.png'));
 console.log('common after',await b.evaluate(`[...document.querySelectorAll('#lighting-toggle,#lighting-toggle-utility')].map(e=>({id:e.id,checked:e.checked}))`));
 await b.cdp('Page.navigate',{url:'https://waterworksproject.nl/en/asaka-canal'});await b.delay(5000);
 const ent=await b.evaluate(`(()=>{const e=[...document.querySelectorAll('button')].find(e=>e.innerText.includes('ENTER'));if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);
 if(ent){await b.cdp('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...ent});await b.cdp('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...ent});}
 await b.delay(1600);await b.screenshot(path.join(out,'water-detail-settled.png'));console.log('water',await b.evaluate(`({url:location.href,text:document.body.innerText.slice(-4000)})`));
 await b.cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
 await b.cdp('Page.navigate',{url:'https://carbondesignsystem.com/data-visualization/color-palettes/#categorical-palettes'});await b.delay(5000);
 console.log('carbon close',await b.evaluate(`[...document.querySelectorAll('button,[role=button]')].filter(e=>/close|dismiss/i.test(e.getAttribute('aria-label')||e.innerText)||e.innerText==='×').map(e=>({html:e.outerHTML.slice(0,700),rect:e.getBoundingClientRect().toJSON()}))`));
 await b.evaluate(`document.getElementById('categorical-palettes')?.scrollIntoView()`);await b.delay(200);await b.cdp('Input.dispatchMouseEvent',{type:'mouseWheel',x:1000,y:600,deltaX:0,deltaY:450});await b.delay(500);await b.screenshot(path.join(out,'carbon-categorical-light.png'));
 console.log('carbon dark',await b.evaluate(`[...document.querySelectorAll('button')].filter(e=>e.innerText==='Dark').map(e=>({html:e.outerHTML.slice(0,700),rect:e.getBoundingClientRect().toJSON()}))`));
}finally{await b.close();}
