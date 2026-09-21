import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
globalThis.WebSocket=createRequire('C:/dev/nivar-g21-tools/package.json')('ws');
const {connect}=await import('../../../g2-1/terminal/native-session.mjs');
const b=await connect();
await b.cdp('Page.navigate',{url:'http://127.0.0.1:4173/br'});await b.until('document.querySelector(".g22-finale")');
console.log(JSON.stringify(await b.evaluate(`[...document.querySelectorAll('.g2-terminal-passage button,.g2-terminal-passage summary,.g2-terminal-passage a,.g2-terminal-passage input,.g22-finale-notebook button')].map(e=>({tag:e.tagName,class:e.className,text:e.innerText,aria:e.getAttribute('aria-label'),href:e.getAttribute('href'),parentClass:e.parentElement.className,grandparentClass:e.parentElement.parentElement.className}))`),null,2));
await b.close();
