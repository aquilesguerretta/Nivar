import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
globalThis.WebSocket=createRequire('C:/dev/nivar-g21-tools/package.json')('ws');
const {connect}=await import('../../../g2-1/terminal/native-session.mjs');
const b=await connect();
const out='C:/dev/gridalpha-v2-nivar-g2/docs/g2-dream-build/g2-2/critics/brief-02';
const place=async s=>{await b.evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(s)});e.scrollIntoView({block:'start',behavior:'instant'});const shell=e.closest('.g2-shell');if(shell)shell.scrollTop-=95;})()`);await b.delay(200);};
const click=async s=>{await b.evaluate(`document.querySelector(${JSON.stringify(s)}).scrollIntoView({block:'center',behavior:'instant'})`);await b.delay(150);await b.click(s);};
const snap=async name=>{await b.screenshot(out+'/'+name+'.png');await fs.writeFile(out+'/'+name+'.json',JSON.stringify(await b.evaluate(`({url:location.href,text:document.body.innerText,entry:document.querySelector('.g22-aj-terminal-title a')?.getAttribute('href'),ranges:[...document.querySelectorAll('input[type=range]')].map(e=>({value:e.value,min:e.min,max:e.max,aria:e.getAttribute('aria-label')})),dialog:document.querySelector('.g22-finale-notebook')?.open,focus:document.activeElement?.outerHTML.slice(0,300)})`),null,2));};
for(const [mode,width,height] of [['desktop',1440,960],['mobile',390,844]]){
 await b.cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:mode==='mobile'});
 await b.cdp('Page.navigate',{url:'http://127.0.0.1:4173/br'});await b.until('document.querySelector(".g22-finale")');
 await place('.g22-finale');await b.until('[...document.querySelectorAll(".g22-finale img")].every(e=>e.complete&&e.naturalWidth>0)');await b.delay(1300);await snap('23-'+mode+'-finale-settled');
 await click('.g22-finale-notebook-open');await b.delay(500);
 await b.evaluate('document.querySelector(".g22-finale-notebook").scrollTop=10000');await b.delay(150);await snap('24-'+mode+'-finale-notebook-bottom');
 await b.cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await b.cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await b.delay(200);await snap('25-'+mode+'-finale-focus-return');
}
await b.cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:960,deviceScaleFactor:1,mobile:false});
await b.cdp('Page.navigate',{url:'http://127.0.0.1:4173/br/familia/software'});await b.until('document.querySelector(".g22-ariadne")');
await click('.g22-aj-regions button:nth-child(4)');await b.delay(2400);await click('.g22-aj-action button');await b.delay(700);await click('.g22-aj-origin-enter');await b.delay(2000);await place('.g22-aj-terminal');
console.log(JSON.stringify(await b.evaluate(`({regions:[...document.querySelectorAll('.g22-aj-terminal .g2t-regions button')].map(e=>({text:e.innerText,aria:e.getAttribute('aria-label')})),metrics:[...document.querySelectorAll('.g22-aj-terminal .g2t-metric-control button')].map(e=>e.innerText),periods:[...document.querySelectorAll('.g22-aj-terminal .g2t-period-control button')].map(e=>e.innerText),inputs:[...document.querySelectorAll('.g22-aj-terminal input')].map(e=>({class:e.className,type:e.type}))})`)));
await click('.g22-aj-terminal .g2t-regions button:nth-child(1)');await b.delay(600);
await click('.g22-aj-terminal .g2t-metric-control button:nth-child(2)');await b.delay(600);
await b.evaluate('document.querySelector(".g22-aj-terminal .g2t-time-scrub").focus()');
for(let i=0;i<3;i++){await b.cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});await b.cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});}
await b.delay(500);await place('.g22-aj-terminal');await snap('26-current-instrument-selection');
await click('.g22-aj-terminal-title a');await b.delay(1200);await snap('27-current-instrument-fullscreen');
await b.close();
