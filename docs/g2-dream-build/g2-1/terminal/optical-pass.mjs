import fs from 'node:fs/promises';
import path from 'node:path';
import {connect} from './native-session.mjs';
const dir=path.resolve('docs/g2-dream-build/g2-1/terminal/optical-pass');await fs.mkdir(dir,{recursive:true});
const b=await connect(),checks=[];
const audit=()=>b.evaluate(`(()=>{const t=document.querySelector('.g2-terminal'),selectors=['.g2t-source-select select','.g2t-source-date','.g2t-region-code','.g2t-region-value','.g2t-map-caption button','.g2t-metric-control > button','.g2t-major-value > span','.g2t-chart-legend','.g2t-probe-heading > span','.g2t-probe-heading output','.g2t-probe-heading output small','.g2t-timeline-events button strong','.g2t-chart-figure figcaption','.g2t-series-extents > div > span','.g2t-context-heading > span','.recharts-cartesian-axis-tick-value'];return {viewport:innerWidth,width:t.clientWidth,scrollWidth:t.scrollWidth,fonts:selectors.map(selector=>{const e=t.querySelector(selector),s=getComputedStyle(e);return {selector,size:s.fontSize,color:s.color,opacity:s.opacity,visible:!!e.getClientRects().length}}),mapLabelPixels:(()=>{const e=t.querySelector('.g2t-map-label text');return parseFloat(getComputedStyle(e).fontSize)*e.getScreenCTM().a})(),lensClear:(()=>{const c=t.querySelector('.g2t-context-plane').getBoundingClientRect(),d=t.querySelector('.recharts-reference-dot circle').getBoundingClientRect();return !(d.right>c.left&&d.left<c.right&&d.bottom>c.top&&d.top<c.bottom)})()}})()`);
try {
 for(const width of [1440,390]) {
  await b.cdp('Emulation.setDeviceMetricsOverride',{width,height:width===390?844:1000,deviceScaleFactor:1,mobile:width===390});
  await b.cdp('Page.navigate',{url:'http://127.0.0.1:4173/br/terminal'});await b.until("document.querySelector('.g2t-evidence-dock')");await b.evaluate('document.fonts.ready');await b.delay(900);
  await b.screenshot(path.join(dir,`${width}-dark.png`));checks.push({name:`standalone ${width}`,value:await audit()});
  await b.click('.g2t-icon-button');await b.delay(350);await b.screenshot(path.join(dir,`${width}-paper.png`));await b.click('.g2t-icon-button');
  if(width===1440){await b.click('.g2t-context-heading button');await b.delay(350);await b.screenshot(path.join(dir,'1440-sources.png'));}
  else{await b.evaluate("document.querySelector('.g2-terminal').scrollTop=420");await b.screenshot(path.join(dir,'390-probe.png'));await b.evaluate("document.querySelector('.g2-terminal').scrollTop=0");await b.click('.g2t-mobile-map-toggle');await b.delay(350);await b.screenshot(path.join(dir,'390-map.png'));}
  await b.cdp('Page.navigate',{url:'http://127.0.0.1:4173/br'});await b.until("document.querySelector('.g21-house-instrument .g2-terminal--compact .g2t-evidence-dock')");
  await b.evaluate(`(()=>{const s=document.querySelector('.g2-shell'),t=document.querySelector('.g21-house-instrument .g2-terminal--compact');s.scrollTop+=t.getBoundingClientRect().top-90;})()`);await b.delay(900);await b.screenshot(path.join(dir,`${width}-house-preview.png`));checks.push({name:`House preview ${width}`,value:await audit()});
 }
}finally{await fs.writeFile(path.join(dir,'checks.json'),JSON.stringify({checks,exceptions:b.exceptions},null,2));await b.close();}
console.log(JSON.stringify(checks));
