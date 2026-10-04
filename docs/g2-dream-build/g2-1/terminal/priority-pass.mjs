import fs from 'node:fs/promises';
import path from 'node:path';
import {connect} from './native-session.mjs';
const dir=path.resolve('docs/g2-dream-build/g2-1/terminal/priority-pass');await fs.mkdir(dir,{recursive:true});
const b=await connect(),checks=[];
try {
 for(const width of [1440,390]) {
  await b.cdp('Emulation.setDeviceMetricsOverride',{width,height:width===390?844:1000,deviceScaleFactor:1,mobile:width===390});
  await b.cdp('Page.navigate',{url:'http://127.0.0.1:4173/br/terminal'});await b.until("document.querySelector('.g2t-evidence-dock')");await b.evaluate('document.fonts.ready');await b.delay(900);
  await b.screenshot(path.join(dir,`${width}-dark.png`));
  checks.push({width,value:await b.evaluate(`(()=>{const t=document.querySelector('.g2-terminal'),q=s=>getComputedStyle(document.querySelector(s));return {width:t.clientWidth,scrollWidth:t.scrollWidth,workspace:q('.g2t-workspace').backgroundColor,toolbar:q('.g2t-toolbar').backgroundColor,series:q('.g2t-series').backgroundColor,plot:q('.g2t-chart-figure').backgroundColor,geography:q('.g2t-map-stage').backgroundColor,reading:q('.g2t-interpretation').backgroundColor,regionalValueFont:q('.g2t-region-value').fontSize}})()`)});
  await b.click('.g2t-icon-button');await b.delay(350);await b.screenshot(path.join(dir,`${width}-paper.png`));await b.click('.g2t-icon-button');
  if(width===1440){
   await b.click('.g2t-timeline-events button:last-child');await b.delay(700);await b.screenshot(path.join(dir,'1440-note-03.png'));
   const p=await b.evaluate(`(()=>{const e=document.querySelectorAll('.g2t-map-label')[1],p=new DOMPoint(0,0).matrixTransform(e.getScreenCTM());return {x:p.x,y:p.y};})()`);
   for(const type of ['mousePressed','mouseReleased'])await b.cdp('Input.dispatchMouseEvent',{type,button:'left',clickCount:1,...p});await b.delay(650);
   checks.push({name:'native hotspot',value:await b.evaluate(`document.querySelector('.g2t-map-region[aria-label="Selecionar Nordeste"]').getAttribute('aria-pressed')==='true'`)});
   await b.click('.g2t-context-heading button');await b.delay(350);await b.screenshot(path.join(dir,'1440-sources.png'));checks.push({name:'source lens',value:await b.evaluate("document.querySelector('.g2t-source-dialog').open")});
  }else {
   await b.evaluate("document.querySelector('.g2-terminal').scrollTop=420");await b.screenshot(path.join(dir,'390-probe.png'));
   await b.evaluate("document.querySelector('.g2-terminal').scrollTop=0");await b.click('.g2t-mobile-map-toggle');await b.delay(350);await b.screenshot(path.join(dir,'390-map.png'));
  }
 }
 await b.cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});await b.cdp('Page.navigate',{url:'http://127.0.0.1:4173/br'});await b.until("document.querySelector('.g2-terminal--compact .g2t-evidence-dock')");
 await b.evaluate(`(()=>{const s=document.querySelector('.g2-shell'),t=document.querySelector('.g2-terminal--compact');s.scrollTop+=t.getBoundingClientRect().top-50;})()`);await b.delay(800);await b.screenshot(path.join(dir,'1440-portal.png'));
 checks.push({name:'compact no overflow',value:await b.evaluate(`(()=>{const t=document.querySelector('.g2-terminal--compact');return t.scrollWidth<=t.clientWidth})()`)});
}finally{await fs.writeFile(path.join(dir,'checks.json'),JSON.stringify({checks,exceptions:b.exceptions},null,2));await b.close();}
console.log(JSON.stringify(checks));
