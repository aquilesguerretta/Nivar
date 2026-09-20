import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import { connect } from '../../../g2-1/terminal/native-session.mjs';
globalThis.WebSocket=createRequire('C:/dev/nivar-g21-tools/package.json')('ws');
const dir=new URL('.',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1');
const s=await connect();const{cdp,evaluate:ev,delay,until,screenshot}=s;
const results=[];
const note=async(name,expr)=>{const value=await ev(expr);results.push({name,at:new Date().toISOString(),value});console.log(name,JSON.stringify(value));};
const key=async key=>{await cdp('Input.dispatchKeyEvent',{type:'keyDown',key,code:key});await cdp('Input.dispatchKeyEvent',{type:'keyUp',key,code:key});await delay(80);};
const scroll=async selector=>{await ev(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'center',behavior:'instant'})`);await delay(100);};
const click=async selector=>{await scroll(selector);const p=await ev(`(()=>{const e=document.querySelector(${JSON.stringify(selector)}),b=e.getBoundingClientRect();return {x:b.x+b.width/2,y:b.y+b.height/2};})()`);await cdp('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...p});await cdp('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...p});await delay(100);};
const goto=async route=>{await cdp('Page.navigate',{url:'http://127.0.0.1:4173'+route});await delay(900);};
const state=`({url:location.href,region:document.querySelector('.g2t-spatial-tag')?.innerText,period:document.querySelector('.g2-terminal')?.dataset.period,metric:document.querySelector('.g2-terminal')?.dataset.metric,probe:document.querySelector('.g2t-probe-heading')?.innerText,focus:document.activeElement?.outerHTML.slice(0,250)})`;
try{
 await cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
 await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 await goto('/br/familia/software');await click('.g22-aj-regions button:nth-child(4)');await click('.g22-aj-action button');
 await note('after-source-focus',`({phase:document.querySelector('.g22-ariadne').dataset.phase,focus:document.activeElement?.outerHTML.slice(0,250)})`);await key('Tab');await note('source-next-tab',`document.activeElement?.outerHTML.slice(0,400)`);
 await click('.g22-aj-action button:last-child');await until('document.querySelector(".g2-terminal")');await delay(500);await note('after-reveal-focus',`({phase:document.querySelector('.g22-ariadne').dataset.phase,focus:document.activeElement?.outerHTML.slice(0,250)})`);await key('Tab');await note('reveal-next-tab',`document.activeElement?.outerHTML.slice(0,400)`);
 await click('.g2t-regions button:first-child');await click('.g2t-metric-control button:nth-child(2)');await click('.g2t-period-control button:nth-child(2)');await click('.g2-terminal input[type=range]');await key('Home');await key('ArrowRight');await note('edited-preview-state',state);await note('fullscreen-link',`document.querySelector('.g22-aj-terminal-title a').href`);await screenshot(dir+'15-edited-preview.png');
 await click('.g22-aj-terminal-title a');await until('!document.querySelector(".g22-ariadne")');await delay(500);await note('edited-preview-fullscreen',state);await scroll('.g2t-series');await screenshot(dir+'16-fullscreen-after-edited-preview.png');
 await cdp('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:dir,browserContextId:s.browserContextId},null);await click('.g2t-export');await delay(400);const csv=(await fs.readdir(dir)).find(n=>n.endsWith('.csv'));results.push({name:'actual-export',csv,text:csv?await fs.readFile(dir+csv,'utf8'):null});
 await goto('/br/terminal?region=invalid&observation=-9');await note('invalid-handoff',state);
 await goto('/br');await click('.g2-mode');await scroll('.g22-finale-heading');await screenshot(dir+'17-finale-night.png');await note('portal-night',`({mode:document.querySelector('.g2-shell').dataset.mode,finaleBackground:getComputedStyle(document.querySelector('.g22-finale')).backgroundColor,headingColor:getComputedStyle(document.querySelector('.g22-finale-heading h2')).color})`);
 await goto('/g2/g22/real-brazil/credits.html');await note('credits-loaded',`({title:document.title,images:[...document.images].map(e=>({src:e.currentSrc,naturalWidth:e.naturalWidth})),links:[...document.links].map(e=>e.href)})`);
 await goto('/alexandria');await note('alexandria-isolation',`({url:location.href,title:document.title,g2:document.querySelectorAll('.g2,.g2-shell,.g2-terminal,.g22-hero-film,.g22-finale').length,heading:document.querySelector('h1')?.innerText,headingFont:document.querySelector('h1')&&getComputedStyle(document.querySelector('h1')).fontFamily,bodyFont:getComputedStyle(document.body).fontFamily})`);
 results.push({name:'errors',exceptions:s.exceptions,logs:s.logs});
}catch(error){results.push({error:error.stack});console.error(error);}finally{await fs.writeFile(dir+'followup-evidence.json',JSON.stringify(results,null,2));await s.close();}
