import fs from 'node:fs/promises';
import path from 'node:path';
import {connect} from '../../terminal/native-session.mjs';
const out=path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/,'$1'));
const events=[];
async function run(name,url,width,work){
 const b=await connect();
 const record=async(label)=>{await b.screenshot(path.join(out,`${name}-${label}.png`));const state=await b.evaluate(`({url:location.href,active:document.activeElement?.outerHTML.slice(0,1000),tabs:[...document.querySelectorAll('[role=tab]')].map(e=>({text:e.innerText,selected:e.getAttribute('aria-selected'),tabindex:e.tabIndex})),text:document.body.innerText.slice(-4000)})`);events.push({name,label,...state});};
 const target=async(selector,text)=>b.evaluate(`(()=>{const e=[...document.querySelectorAll(${JSON.stringify(selector)})].find(e=>${text?`e.innerText.replace(/\\s+/g,' ').trim()===${JSON.stringify(text)} && `:''}e.getBoundingClientRect().width>0);if(!e)throw Error('Target not found');e.scrollIntoView({block:'nearest'});const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()`);
 const point=async(selector,text,hover=false)=>{const xy=await target(selector,text);await b.cdp('Input.dispatchMouseEvent',{type:'mouseMoved',...xy});if(!hover){await b.cdp('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...xy});await b.cdp('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...xy});}await b.delay(900);};
 try {await b.cdp('Emulation.setDeviceMetricsOverride',{width,height:width===390?844:1000,deviceScaleFactor:1,mobile:width===390});await b.cdp('Page.navigate',{url});await b.delay(5500);await work(b,point,record);console.log(name,'done');}catch(e){events.push({name,error:String(e)});console.log(name,String(e));}finally{await b.close();}
}
await run('chesapeake','https://chesapeakeplywood.com/',1440,async(b,p,r)=>{await p('a[href$="/products/"]','PRODUCTS',true);await r('products-open');await p('a[href$="/services/"]','SERVICES',true);await r('services-open');});
await run('water','https://waterworksproject.nl/en',390,async(b,p,r)=>{await p('button','( ENTER )');await r('map');await p('button','( SEE ALL )');await r('index');await p('a[href$="/asaka-canal"]','Asaka Canal');await r('detail');});
await run('common','https://www.incommonwith.com/collections/all-lighting',390,async(b,p,r)=>{await r('off');await p('button','Toggle Lighting');await r('on');});
await run('ariakit','https://ariakit.com/components/tab',1440,async(b,p,r)=>{await p('[role=tab]','Vegetables');await b.cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});await b.cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});await b.delay(200);await r('arrowright-meat');await b.cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await b.cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await r('tab-panel-focus');});
await run('carbon','https://carbondesignsystem.com/data-visualization/color-palettes/',1440,async(b,p,r)=>{await p('button','Dark');await r('dark-categorical');});
await run('direct','https://wearedirect.co/',1440,async(b,p,r)=>{await b.evaluate('window.scrollTo(0,document.body.scrollHeight)');await b.delay(1300);await r('entry');await p('a[href="work.html"]');await b.delay(1400);await r('work-route');});
await fs.writeFile(path.join(out,'interaction-observations.json'),JSON.stringify(events,null,2));
