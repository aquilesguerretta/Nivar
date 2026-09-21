import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
globalThis.WebSocket=createRequire('C:/dev/nivar-g21-tools/package.json')('ws');
const {connect}=await import('../../../g2-1/terminal/native-session.mjs');
const b=await connect();
const base='C:/dev/gridalpha-v2-nivar-g2/docs/g2-dream-build/g2-2/critics/brief-01';
await b.cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:960,deviceScaleFactor:1,mobile:false});
await b.cdp('Page.navigate',{url:'http://127.0.0.1:4173/br'});await b.until('document.querySelector(".g22-hero-film")');
await b.evaluate(`(()=>{const e=document.querySelector('.g22-hero-film');e.scrollIntoView({block:'start',behavior:'instant'});e.closest('.g2-shell').scrollTop-=90;})()`);
let previous=0;
const measurements=[];
for (const seconds of [4,8,15,21,27,34,39]) {
 await b.delay((seconds-previous)*1000);previous=seconds;
 await b.screenshot(base+'/15-hero-live-'+String(seconds).padStart(2,'0')+'s.png');
 measurements.push(await b.evaluate(`({recordedAt:${seconds},filmTime:document.querySelector('.g22-hero-film').dataset.filmTime,playing:document.querySelector('.g22-hero-film').dataset.playing,chapter:document.querySelector('.g22-hero-film').dataset.chapter})`));
}
await fs.writeFile(base+'/15-hero-live-timing.json',JSON.stringify(measurements,null,2));
await b.close();
