import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
globalThis.WebSocket=createRequire('C:/dev/nivar-g21-tools/package.json')('ws');
const {connect}=await import('../../../g2-1/terminal/native-session.mjs');
const base='C:/dev/gridalpha-v2-nivar-g2/docs/g2-dream-build/g2-2/critics/brief-02';
const b=await connect();
const place=async s=>{await b.evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(s)});e.scrollIntoView({block:'start',behavior:'instant'});e.closest('.g2-shell').scrollTop-=90;})()`);};
const click=async s=>{await b.evaluate(`document.querySelector(${JSON.stringify(s)}).scrollIntoView({block:'center',behavior:'instant'})`);await b.delay(100);await b.click(s);};
await b.cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:960,deviceScaleFactor:1,mobile:false});
await b.cdp('Page.navigate',{url:'http://127.0.0.1:4173/br'});await b.until('document.querySelector(".g22-hero-film")');
await click('[aria-label="Reiniciar filme"]');await place('.g22-hero-film');
let prev=0;const timing=[];
for (const t of [.3,2.5,4.5,6.5,9.5,12.5,15.8,17,17.8,18.7,20]){
 await b.delay((t-prev)*1000);prev=t;
 await b.screenshot(base+'/04-hero-'+String(t).replace('.','-')+'s.png');
 timing.push(await b.evaluate(`({elapsed:${t},filmTime:document.querySelector('.g22-hero-film').dataset.filmTime,playing:document.querySelector('.g22-hero-film').dataset.playing,chapter:document.querySelector('.g22-hero-film').dataset.chapter})`));
}
await click('.g2-film-chapters button:nth-child(6)');await place('.g22-hero-film');await b.delay(200);await b.screenshot(base+'/05-hero-desktop-manual-procurar.png');
timing.push(await b.evaluate(`({manual:true,filmTime:document.querySelector('.g22-hero-film').dataset.filmTime,playing:document.querySelector('.g22-hero-film').dataset.playing,chapter:document.querySelector('.g22-hero-film').dataset.chapter})`));
await b.cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await b.cdp('Page.navigate',{url:'http://127.0.0.1:4173/br'});await b.until('document.querySelector(".g22-hero-film")');await click('.g2-film-chapters button:nth-child(6)');await place('.g22-hero-film');await b.delay(200);await b.screenshot(base+'/06-hero-mobile-manual-procurar.png');
await b.cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await b.cdp('Page.navigate',{url:'http://127.0.0.1:4173/br'});await b.until('document.querySelector(".g22-hero-film")');await place('.g22-hero-film');await b.delay(200);await b.screenshot(base+'/07-hero-mobile-reduced.png');
await fs.writeFile(base+'/04-hero-timing.json',JSON.stringify(timing,null,2));await b.close();
