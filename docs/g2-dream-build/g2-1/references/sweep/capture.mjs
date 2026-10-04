import fs from 'node:fs/promises';
import path from 'node:path';
import {connect} from '../../terminal/native-session.mjs';
const out = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/,'$1'));
const sites = process.argv[2] ? JSON.parse(await fs.readFile(process.argv[2],'utf8')) : [
 ['inspora','https://inspora.design/'],
 ['recent','https://recent.design/'],
 ['loadmore','https://loadmo.re/'],
 ['navbar','https://navbar.gallery/'],
 ['cta','https://cta.gallery/'],
 ['component','https://component.gallery/'],
 ['owid','https://ourworldindata.org/redesigning-our-interactive-data-visualizations'],
 ['carbon','https://carbondesignsystem.com/data-visualization/color-palettes/'],
];
for (const [name,url,opts={}] of sites) {
 const b=await connect();
 try {
  await b.cdp('Emulation.setDeviceMetricsOverride',{width:opts.width||1440,height:opts.height||1000,deviceScaleFactor:1,mobile:!!opts.mobile});
  await b.cdp('Page.navigate',{url}); await b.delay(4200);
  if (opts.script) {await b.evaluate(opts.script);await b.delay(700);}
  if (opts.click) {await b.click(opts.click);await b.delay(900);}
  await b.screenshot(path.join(out,`${name}-landing.png`));
  const data=await b.evaluate(`({url:location.href,title:document.title,text:document.body.innerText.slice(0,18000),links:[...document.querySelectorAll('a')].map(a=>({text:a.innerText.trim().slice(0,100),href:a.href})),buttons:[...document.querySelectorAll('button')].map(a=>({text:a.innerText.trim().slice(0,100),label:a.getAttribute('aria-label')})),media:[...document.querySelectorAll('img,video,iframe')].map(a=>({tag:a.tagName,src:a.currentSrc||a.src,alt:a.alt,rect:{x:a.getBoundingClientRect().x,y:a.getBoundingClientRect().y,w:a.getBoundingClientRect().width,h:a.getBoundingClientRect().height},paused:a.paused,time:a.currentTime})),controls:[...document.querySelectorAll('[role],input,select')].map(a=>({tag:a.tagName,role:a.getAttribute('role'),label:a.getAttribute('aria-label'),id:a.id,text:a.innerText?.slice(0,100)})).slice(0,90)})`);
  if (opts.secondFrame) {await b.delay(1800);await b.screenshot(path.join(out,`${name}-frame2.png`));}
  await fs.writeFile(path.join(out,`${name}-landing.json`),JSON.stringify(data,null,2));
  console.log(name, data.title, data.url, data.text.slice(0,240).replace(/\n/g,' | '));
 } catch(e) {console.log(name,'ERROR',String(e));}
 finally {await b.close();}
}
