import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
globalThis.WebSocket=createRequire('C:/dev/nivar-g21-tools/package.json')('ws');
const {connect}=await import('../../../g2-1/terminal/native-session.mjs');
const b=await connect();const base='C:/dev/gridalpha-v2-nivar-g2/docs/g2-dream-build/g2-2/critics/brief-02';
const place=async s=>{await b.evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(s)});e.scrollIntoView({block:'start',behavior:'instant'});const shell=e.closest('.g2-shell');if(shell)shell.scrollTop-=95;})()`);await b.delay(150);};
const click=async s=>{await b.evaluate(`document.querySelector(${JSON.stringify(s)}).scrollIntoView({block:'center',behavior:'instant'})`);await b.delay(150);await b.click(s);};
const snap=async name=>{await b.screenshot(base+'/'+name+'.png');await fs.writeFile(base+'/'+name+'.json',JSON.stringify(await b.evaluate(`({url:location.href,text:document.body.innerText,phase:document.querySelector('.g22-ariadne')?.dataset.phase,handoff:document.querySelector('.g22-ariadne')?.dataset.handoff,receipt:document.querySelector('.g22-aj-transfer')?.innerText,controls:[...document.querySelectorAll('button,a,input,summary')].filter(e=>e.getBoundingClientRect().width>0).map(e=>({tag:e.tagName,text:e.innerText,aria:e.getAttribute('aria-label'),class:e.className,href:e.getAttribute('href')})),dialogOpen:document.querySelector('.g22-finale-notebook')?.open,focus:document.activeElement?.outerHTML.slice(0,300)})`),null,2));};
const key=async(selector,key,code,n=1)=>{await b.evaluate(`document.querySelector(${JSON.stringify(selector)}).focus()`);for(let i=0;i<n;i++){await b.cdp('Input.dispatchKeyEvent',{type:'keyDown',key,code:key,windowsVirtualKeyCode:code});await b.cdp('Input.dispatchKeyEvent',{type:'keyUp',key,code:key,windowsVirtualKeyCode:code});}};
for(const [mode,width,height] of [['desktop',1440,960],['mobile',390,844]]){
 await b.cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:mode==='mobile'});
 await b.cdp('Page.navigate',{url:'http://127.0.0.1:4173/br'});await b.until('document.querySelector(".g22-terminal-threshold")');
 await place('.g22-terminal-threshold');await snap('08-'+mode+'-public-preview-initial');
 await click('.g22-threshold-regions button:nth-child(2)');await b.delay(700);await key('.g22-threshold-scrub input','ArrowRight',39,2);await b.delay(300);await click('.g22-threshold-bottom summary');await place('.g22-terminal-threshold');await snap('09-'+mode+'-public-preview-selected-source');
 await click('.g22-threshold-bottom a');await b.delay(1100);await snap('10-'+mode+'-public-preview-entry');
 await b.cdp('Page.navigate',{url:'http://127.0.0.1:4173/br/familia/software'});await b.until('document.querySelector(".g22-ariadne")');await place('.g22-ariadne');await snap('11-'+mode+'-ariadne-initial');
 await click('.g22-aj-regions button:nth-child(4)');await b.delay(2400);await key('.g22-aj-scrubber input','ArrowRight',39);await b.delay(300);await click('.g22-aj-action button');await b.delay(900);await place('.g22-aj-record');await snap('12-'+mode+'-ariadne-source');
 await click('.g22-aj-origin-enter');await b.delay(100);await snap('13-'+mode+'-handoff-early');await b.delay(400);await snap('14-'+mode+'-handoff-mid');await b.delay(900);await snap('15-'+mode+'-handoff-landed');
 await b.delay(700);await place('.g22-aj-terminal');await snap('16-'+mode+'-ariadne-terminal');
 await click('.g22-aj-terminal-title a');await b.delay(1200);await snap('17-'+mode+'-ariadne-fullscreen');
 await b.cdp('Page.navigate',{url:'http://127.0.0.1:4173/br'});await b.until('document.querySelector(".g22-finale")');await place('.g22-finale');await snap('18-'+mode+'-finale');
 await click('.g22-finale-reveal');await b.delay(300);await place('.g22-finale-source-note');await snap('19-'+mode+'-finale-source');
 await click('.g22-finale-notebook-open');await b.delay(350);await snap('20-'+mode+'-finale-notebook');
 await click('.g22-finale-notebook .g22-finale-traces button:nth-child(4)');await b.delay(300);await snap('21-'+mode+'-finale-notebook-question');
 await b.cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await b.cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await b.delay(250);await snap('22-'+mode+'-finale-dialog-closed');
}
await b.close();
