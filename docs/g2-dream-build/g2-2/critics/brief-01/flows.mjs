import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
globalThis.WebSocket=createRequire('C:/dev/nivar-g21-tools/package.json')('ws');
const {connect}=await import('../../../g2-1/terminal/native-session.mjs');
const base='C:/dev/gridalpha-v2-nivar-g2/docs/g2-dream-build/g2-2/critics/brief-01';
const b=await connect();
const place=async selector=>{await b.evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});e.scrollIntoView({block:'start',behavior:'instant'});const s=e.closest('.g2-shell');if(s)s.scrollTop-=100;})()`);await b.delay(150)};
const click=async selector=>{await b.evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'center',behavior:'instant'})`);await b.delay(150);await b.click(selector);};
const evidence=async(name)=>{await b.screenshot(base+'/'+name+'.png');await fs.writeFile(base+'/'+name+'.json',JSON.stringify(await b.evaluate(`({text:document.body.innerText,controls:[...document.querySelectorAll('button,a,input')].filter(e=>e.getBoundingClientRect().width>0).map(e=>({tag:e.tagName,class:e.className,text:e.innerText,aria:e.getAttribute('aria-label'),href:e.getAttribute('href')}))})`),null,2));};
for (const [mode,width,height] of [['desktop',1440,960],['mobile',390,844]]) {
 await b.cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:mode==='mobile'});
 await b.cdp('Page.navigate',{url:'http://127.0.0.1:4173/br/familia/software'});await b.delay(1100);await b.until('document.querySelector(".g22-aj-stage")');
 await place('.g22-ariadne');await evidence('04-'+mode+'-ariadne-initial');
 await click('.g22-aj-regions button:nth-child(4)');await b.delay(2400);await place('.g22-ariadne');await evidence('05-'+mode+'-ariadne-selected');
 await b.evaluate(`document.querySelector('.g22-aj-scrubber input').focus()`);await b.cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});await b.cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});
 await click('.g22-aj-action button');await b.delay(800);await place('.g22-aj-record');await evidence('06-'+mode+'-ariadne-origin');
 await click('.g22-aj-action button:last-child');await b.delay(1100);await place('.g22-aj-terminal');await evidence('07-'+mode+'-terminal-earned');
 if(mode==='desktop') {await click('.g22-aj-terminal-title a');await b.delay(1400);await evidence('08-terminal-fullscreen-entry');}
 await b.cdp('Page.navigate',{url:'http://127.0.0.1:4173/br'});await b.delay(1100);await b.until('document.querySelector(".g22-finale")');
 await place('.g22-finale');await evidence('09-'+mode+'-finale-initial');
 await click('.g22-finale-reveal');await b.delay(500);await place('.g22-finale-source-note');await evidence('10-'+mode+'-finale-source');
 await click('.g22-finale-traces button:nth-child(4)');await b.delay(400);await evidence('11-'+mode+'-finale-question');
 if(mode==='desktop') {
  await place('.g2-terminal-passage');await evidence('12-portal-terminal-passage');
  await place('.g22-ariadne');await evidence('13-portal-ariadne-initial');
 }
}
await b.cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
await b.cdp('Page.navigate',{url:'http://127.0.0.1:4173/br'});await b.delay(1100);await b.until('document.querySelector(".g22-hero-film")');
await place('.g22-hero-film');await evidence('14-mobile-reduced-hero');
await b.close();
