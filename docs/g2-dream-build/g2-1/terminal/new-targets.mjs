import fs from 'node:fs/promises';
import path from 'node:path';
import {connect} from './native-session.mjs';
const dir=path.resolve('docs/g2-dream-build/g2-1/terminal/optical-pass'),b=await connect(),checks=[];
try {
 await b.cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 for(const context of ['standalone','house']) {
  await b.cdp('Page.navigate',{url:`http://127.0.0.1:4173/${context==='house'?'br':'br/terminal'}`});await b.until("document.querySelector('.g2t-evidence-dock')");await b.evaluate('document.fonts.ready');await b.delay(650);
  if(context==='house'){await b.evaluate(`(()=>{const s=document.querySelector('.g2-shell'),t=document.querySelector('.g2-terminal--compact');s.scrollTop+=t.getBoundingClientRect().top-90})()`);await b.delay(700);}
  await b.evaluate(`(()=>{const c=document.querySelector('.g2t-chart'),s=document.querySelector('${context==='house'?'.g2-shell':'.g2-terminal'}');s.scrollTop+=c.getBoundingClientRect().top-230;})()`);await b.delay(250);
  const result=await b.evaluate(`(()=>{const source=document.querySelector('.g2t-context-heading > button'),r=source.getBoundingClientRect(),lens=document.querySelector('.g2t-context-plane').getBoundingClientRect(),dot=document.querySelector('.recharts-reference-dot circle').getBoundingClientRect(),range=document.querySelector('.g2t-time-scrub').getBoundingClientRect();return {source:{width:r.width,height:r.height},timelineHeights:[...document.querySelectorAll('.g2t-timeline-events button')].map(e=>e.getBoundingClientRect().height),mapToggleHeight:document.querySelector('.g2t-mobile-map-toggle').getBoundingClientRect().height,rangeHeight:range.height,selectedPointClear:!(dot.right>lens.left&&dot.left<lens.right&&dot.bottom>lens.top&&dot.top<lens.bottom),sourceHits:[.1,.5,.9].map(y=>document.elementFromPoint(r.x+r.width/2,r.y+r.height*y)?.closest('button')===source),lensEndsBeforeRange:lens.bottom<range.top,scrollWidth:document.querySelector('.g2-terminal').scrollWidth,clientWidth:document.querySelector('.g2-terminal').clientWidth}})()`);
  await b.screenshot(path.join(dir,`390-new-targets-${context}.png`));
  await b.evaluate("document.querySelector('.g2t-time-scrub').focus({preventScroll:true})");for(const type of ['keyDown','keyUp'])await b.cdp('Input.dispatchKeyEvent',{type,key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});await b.delay(400);
  checks.push({context,...result,rangeKeyboardIndex:await b.evaluate("document.querySelector('.g2t-time-scrub').value")});
 }
}finally{await fs.writeFile(path.join(dir,'new-targets-checks.json'),JSON.stringify({checks,exceptions:b.exceptions},null,2));await b.close();}
console.log(JSON.stringify(checks));
if(checks.some(c=>c.source.height<44||c.source.width<44||c.timelineHeights.some(h=>h<44)||c.mapToggleHeight<44||c.rangeHeight<44||!c.selectedPointClear||c.sourceHits.some(hit=>!hit)||!c.lensEndsBeforeRange||c.scrollWidth>c.clientWidth||c.rangeKeyboardIndex!=='15'))process.exitCode=1;
