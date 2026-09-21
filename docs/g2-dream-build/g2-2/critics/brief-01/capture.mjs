import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
globalThis.WebSocket = createRequire('C:/dev/nivar-g21-tools/package.json')('ws');
const {connect} = await import('../../../g2-1/terminal/native-session.mjs');
const base='C:/dev/gridalpha-v2-nivar-g2/docs/g2-dream-build/g2-2/critics/brief-01';
const b=await connect();
await b.cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:960,deviceScaleFactor:1,mobile:false});
for(const [id,route] of [['01-portal','/br'],['02-software','/br/familia/software'],['03-terminal','/br/terminal']]) {
 await b.cdp('Page.navigate',{url:'http://127.0.0.1:4173'+route});
 await b.delay(1800);
 await b.until('document.body.innerText.length>100');
 await b.screenshot(base+'/'+id+'.png');
 const info = await b.evaluate(`({title:document.title,text:document.body.innerText,controls:[...document.querySelectorAll('button,a,input,select')].map(e=>({tag:e.tagName,text:e.innerText,aria:e.getAttribute('aria-label'),href:e.getAttribute('href'),testid:e.getAttribute('data-testid')})),sections:[...document.querySelectorAll('section')].map(e=>({id:e.id,class:e.className,y:e.getBoundingClientRect().top+scrollY,height:e.getBoundingClientRect().height}))})`);
 await fs.writeFile(base+'/'+id+'.json',JSON.stringify(info,null,2));
}
await b.close();
