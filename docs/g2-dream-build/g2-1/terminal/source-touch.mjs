import fs from 'node:fs/promises';
import path from 'node:path';
import {connect} from './native-session.mjs';
const dir=path.resolve('docs/g2-dream-build/g2-1/terminal/optical-pass');
const b=await connect(),checks=[];
try {
 for(const width of [1440,390]) for(const context of ['standalone','house']) {
  await b.cdp('Emulation.setDeviceMetricsOverride',{width,height:width===390?844:1000,deviceScaleFactor:1,mobile:width===390});
  await b.cdp('Page.navigate',{url:`http://127.0.0.1:4173/${context==='house'?'br':'br/terminal'}`});
  await b.until("document.querySelector('.g2t-evidence-dock')");await b.evaluate('document.fonts.ready');await b.delay(650);
  if(context==='house'){await b.evaluate(`(()=>{const s=document.querySelector('.g2-shell'),t=document.querySelector('.g2-terminal--compact');s.scrollTop+=t.getBoundingClientRect().top-90})()`);await b.delay(800);}
  for(const state of ['default','peak']) {
   if(state==='peak'){await b.click('.g2t-timeline-events button:last-child');await b.delay(650);}
   await b.evaluate(`(()=>{const c=document.querySelector('.g2t-chart'),s=document.querySelector('${context==='house'?'.g2-shell':'.g2-terminal'}');s.scrollTop+=c.getBoundingClientRect().top-(innerHeight-c.getBoundingClientRect().height)/2;document.querySelector('.g2t-context-heading > button').focus({preventScroll:true})})()`);await b.delay(350);
   const result=await b.evaluate(`(()=>{const e=document.querySelector('.g2t-context-heading > button'),c=document.querySelector('.g2t-context-plane').getBoundingClientRect(),d=document.querySelector('.recharts-reference-dot circle').getBoundingClientRect(),r=e.getBoundingClientRect();return {button:{width:r.width,height:r.height},lens:{width:c.width,height:c.height},selectedPointClear:!(d.right>c.left&&d.left<c.right&&d.bottom>c.top&&d.top<c.bottom),selectedPointOnscreen:d.top>=0&&d.bottom<=innerHeight,hitAreaSamples:[.1,.5,.9].map(y=>document.elementFromPoint(r.x+r.width/2,r.y+r.height*y)?.closest('button')===e),focusVisible:e.matches(':focus-visible'),readout:document.querySelector('.g2t-context-plane').innerText}})()`);
   checks.push({width,context,state,selectedIndex:await b.evaluate("document.querySelector('.g2t-time-scrub').value"),...result});
   if(width===390)await b.screenshot(path.join(dir,`390-source-focus-${context}-${state}.png`));
  }
 }
}finally{await fs.writeFile(path.join(dir,'source-touch-checks.json'),JSON.stringify({checks,exceptions:b.exceptions},null,2));await b.close();}
console.log(JSON.stringify(checks));
if(checks.some(c=>c.selectedIndex!==(c.state==='default'?'14':'19')||c.button.height<(c.width===390?44:40)||c.button.width<44||!c.selectedPointClear||!c.selectedPointOnscreen||c.hitAreaSamples.some(hit=>!hit)))process.exitCode=1;
