import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import { connect } from '../../../g2-1/terminal/native-session.mjs';
globalThis.WebSocket = createRequire('C:/dev/nivar-g21-tools/package.json')('ws');
const dir = new URL('.', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const session = await connect();
const { cdp, evaluate, delay, until, screenshot } = session;
const route = process.argv[2] || '/br';
try {
  await cdp('Emulation.setDeviceMetricsOverride', { width:1440, height:1000, deviceScaleFactor:1, mobile:false });
  await cdp('Page.navigate', { url:'http://127.0.0.1:4173'+route });
  await until('document.querySelector(".g2-shell, .g2-terminal")');
  await delay(1000);
  console.log(JSON.stringify(await evaluate(`({url:location.href,innerWidth,innerHeight,hidden:document.hidden,title:document.title,text:document.body.innerText,buttons:[...document.querySelectorAll('button')].map(e=>({text:e.textContent,label:e.getAttribute('aria-label'),class:e.className})),inputs:[...document.querySelectorAll('input,select')].map(e=>({tag:e.tagName,label:e.getAttribute('aria-label'),type:e.type,options:e.tagName==='SELECT'?[...e.options].map(o=>({value:o.value,text:o.text})):undefined})),images:[...document.images].filter(e=>e.currentSrc.includes('/g2/g22')).map(e=>({src:e.currentSrc,naturalWidth:e.naturalWidth}))})`),null,2));
  await screenshot(dir+'initial-'+route.replaceAll('/','-')+'.png');
} finally { await session.close(); }
