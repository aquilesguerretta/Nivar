import fs from 'node:fs/promises';
import path from 'node:path';
import {connect} from './native-session.mjs';
const dir=path.resolve('docs/g2-dream-build/g2-1/terminal/final');await fs.mkdir(dir,{recursive:true});
const b=await connect(),results=[];
try {
 for(const width of [1440,1024,768,390]) {
  await b.cdp('Emulation.setDeviceMetricsOverride',{width,height:width===390?844:1000,deviceScaleFactor:1,mobile:width===390});
  await b.cdp('Page.navigate',{url:'http://127.0.0.1:4173/br/terminal'});await b.until("document.querySelector('.g2-terminal .recharts-surface')");await b.evaluate('document.fonts.ready');await b.delay(800);
  for(const tone of ['dark','paper']) {
   if(tone==='paper'){await b.click('.g2t-icon-button');await b.delay(400);}
   await b.screenshot(path.join(dir,`${width}-${tone}.png`));
   results.push({width,tone,value:await b.evaluate(`(()=>{const s=document.querySelector('.g2-terminal'),chart=document.querySelector('.g2t-chart'),plane=document.querySelector('.g2t-interpretation');return {viewport:innerWidth,scrollWidth:s.scrollWidth,chartWidth:chart.getBoundingClientRect().width,plotWidth:chart.querySelector('.recharts-surface').getBoundingClientRect().width,planeRight:plane.getBoundingClientRect().right,font:getComputedStyle(s).fontFamily,loaded:document.fonts.check('400 12px "Nivar Manrope"')}})()`)});
  }
  if(width===390){await b.click('.g2t-mobile-map-toggle');await b.delay(450);await b.screenshot(path.join(dir,'390-map-paper.png'));await b.click('.g2t-mobile-map-toggle');await b.evaluate("document.querySelector('.g2-terminal').scrollTop=610");await b.screenshot(path.join(dir,'390-inspector-paper.png'));}
 }
 await b.cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});await b.cdp('Page.navigate',{url:'http://127.0.0.1:4173/br/terminal'});await b.until("document.querySelector('.g2-terminal .recharts-surface')");await b.delay(800);
 // Actual native map click at the rendered label/centroid, using its SVG screen transform.
 const point=await b.evaluate(`(()=>{const label=document.querySelectorAll('.g2t-map-label')[1],p=new DOMPoint(0,0).matrixTransform(label.getScreenCTM());return {x:p.x,y:p.y};})()`);
 for(const type of ['mousePressed','mouseReleased'])await b.cdp('Input.dispatchMouseEvent',{type,button:'left',clickCount:1,...point});await b.delay(800);await b.screenshot(path.join(dir,'1440-map-click.png'));results.push({name:'native polygon click',value:await b.evaluate(`document.querySelector('.g2t-map-region[aria-label="Selecionar Nordeste"]').getAttribute('aria-pressed')==='true'`)});
 await b.cdp('Page.navigate',{url:'http://127.0.0.1:4173/br'});await b.until("document.querySelector('.g2-terminal--compact .recharts-surface')");await b.evaluate(`(()=>{const s=document.querySelector('.g2-shell'),t=document.querySelector('.g2-terminal--compact');s.scrollTop+=t.getBoundingClientRect().top-50;})()`);await b.delay(900);await b.screenshot(path.join(dir,'1440-portal-preview.png'));results.push({name:'compact desktop',value:await b.evaluate(`(()=>{const t=document.querySelector('.g2-terminal--compact');return {scrollWidth:t.scrollWidth,visibleWidth:t.getBoundingClientRect().width}})()`)});
}finally {await fs.writeFile(path.join(dir,'results.json'),JSON.stringify({results,exceptions:b.exceptions},null,2));await b.close();}
console.log(JSON.stringify(results));
