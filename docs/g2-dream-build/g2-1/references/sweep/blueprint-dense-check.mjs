import fs from 'node:fs/promises';
import path from 'node:path';
import { connect } from '../../terminal/native-session.mjs';
const dir=path.dirname(new URL(import.meta.url).pathname).replace(/^\/(\w:)/,'$1');
const b=await connect();
try {
 await b.cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
 await b.cdp('Page.navigate',{url:'https://blueprintjs.com/docs/#table/features'}); await b.delay(3500);
 const before=await b.evaluate(`({url:location.href,text:document.body.innerText.slice(0,12000),tables:[...document.querySelectorAll('[class*="table-container"],[role="grid"]')].map(e=>({html:e.outerHTML.slice(0,1000),rect:e.getBoundingClientRect().toJSON()}))})`);
 await fs.writeFile(path.join(dir,'blueprint-features.json'),JSON.stringify(before,null,2));
 console.log(JSON.stringify(before));
 const has=await b.evaluate(`(()=>{const e=document.querySelector('.bp6-table-container');if(!e)return false;e.scrollIntoView({block:'center'});return true})()`);
 await b.delay(300); await b.screenshot(path.join(dir,'blueprint-features-demo.png'));
 if(has){
  const selector='.bp6-table-cell';
  await b.click(selector); await b.delay(150);
  await b.screenshot(path.join(dir,'blueprint-cell-selected.png'));
  await b.cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowDown',code:'ArrowDown',windowsVirtualKeyCode:40});
  await b.cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowDown',code:'ArrowDown',windowsVirtualKeyCode:40});
  await b.delay(150); await b.screenshot(path.join(dir,'blueprint-cell-arrowdown.png'));
  await fs.writeFile(path.join(dir,'blueprint-cell-state.json'),JSON.stringify(await b.evaluate(`({active:document.activeElement.outerHTML.slice(0,3000),selected:[...document.querySelectorAll('[class*="selected"],[class*="focus"]')].filter(e=>e.getBoundingClientRect().height>0).map(e=>({class:e.className,text:e.innerText?.slice(0,120)})).slice(-25)})`),null,2));
 }
}finally{await b.close()}
