import fs from 'node:fs/promises';
import path from 'node:path';
import {connect} from '../native-session.mjs';

const dir=path.resolve('docs/g2-dream-build/g2-1/terminal/material-finish');
await fs.mkdir(dir,{recursive:true});
const b=await connect(), checks=[];
const audit=()=>b.evaluate(`(()=>{
  const t=document.querySelector('.g2-terminal'), q=s=>t.querySelector(s), rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom}};
  const lens=rect(q('.g2t-context-plane')), dot=rect(q('.recharts-reference-dot circle')), source=q('.g2t-context-heading > button'), button=rect(source), range=rect(q('.g2t-time-scrub'));
  const selectedPointClear=!(dot.right>lens.x&&dot.x<lens.right&&dot.bottom>lens.y&&dot.y<lens.bottom);
  const selectors=['.g2t-source-select select','.g2t-source-date','.g2t-region-code','.g2t-region-value','.g2t-map-caption button','.g2t-metric-control > button','.g2t-major-value > span','.g2t-chart-legend','.g2t-probe-heading > span','.g2t-probe-heading output','.g2t-probe-heading output small','.g2t-timeline-events button strong','.g2t-chart-figure figcaption','.g2t-series-extents > div > span','.g2t-context-heading > span','.recharts-cartesian-axis-tick-value'];
  return {viewport:innerWidth,width:t.clientWidth,scrollWidth:t.scrollWidth,tone:t.dataset.tone,selectedPointClear,button,lens,dot,lensEndsBeforeRange:lens.bottom<range.y,sourceHits:[.1,.5,.9].map(y=>document.elementFromPoint(button.x+button.width/2,button.y+button.height*y)?.closest('button')===source),timelineHeights:[...t.querySelectorAll('.g2t-timeline-events button')].map(e=>e.getBoundingClientRect().height),rangeHeight:range.height,selectedIndex:q('.g2t-time-scrub').value,materials:Object.fromEntries(['.g2t-series','.g2t-chart-figure','.g2t-interpretation','.g2t-context-plane','.g2t-map-stage'].map(s=>{const c=getComputedStyle(q(s));return [s,{background:c.background,shadow:c.boxShadow,blur:c.backdropFilter}]})),fonts:selectors.map(selector=>{const e=q(selector),s=getComputedStyle(e);return {selector,size:s.fontSize,visible:!!e.getClientRects().length}})};
})()`);
async function showChart(context) {
  await b.evaluate(`(()=>{const c=document.querySelector('.g2t-chart'),s=document.querySelector('${context==='house'?'.g2-shell':'.g2-terminal'}');s.scrollTop+=c.getBoundingClientRect().top-${context==='house'?190:230};})()`);
  await b.delay(350);
}
try {
  for(const width of [1440,390]) for(const context of ['standalone','house']) {
    await b.cdp('Emulation.setDeviceMetricsOverride',{width,height:width===390?844:1000,deviceScaleFactor:1,mobile:width===390});
    await b.cdp('Page.navigate',{url:`http://127.0.0.1:4173/${context==='house'?'br':'br/terminal'}`});
    await b.until("document.querySelector('.g2t-evidence-dock')");await b.evaluate('document.fonts.ready');await b.delay(800);
    if(context==='house') {await b.evaluate("(()=>{const s=document.querySelector('.g2-shell'),t=document.querySelector('.g21-house-instrument');s.scrollTop+=t.getBoundingClientRect().top-80})()");await b.delay(700);}
    await b.screenshot(path.join(dir,`${width}-${context}-dark.png`));
    if(width===390||context==='house')await showChart(context);
    checks.push({width,context,state:'default',...await audit()});
    await b.screenshot(path.join(dir,`${width}-${context}-instrument.png`));
    await b.click('.g2t-context-heading button');await b.delay(250);
    checks.push({width,context,name:'source opens from actual click',passed:await b.evaluate("document.querySelector('.g2t-source-dialog').open")});
    if(width===1440&&context==='standalone')await b.screenshot(path.join(dir,'1440-standalone-sources.png'));
    for(const type of ['keyDown','keyUp'])await b.cdp('Input.dispatchKeyEvent',{type,key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
    await b.click('.g2t-timeline-events button:last-child');await b.delay(650);await showChart(context);
    checks.push({width,context,state:'peak',...await audit()});
    await b.screenshot(path.join(dir,`${width}-${context}-peak.png`));
    await b.evaluate("document.querySelector('.g2t-time-scrub').focus({preventScroll:true})");
    for(const type of ['keyDown','keyUp'])await b.cdp('Input.dispatchKeyEvent',{type,key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});
    await b.delay(350);checks.push({width,context,name:'range keyboard moves 19 to 20',passed:await b.evaluate("document.querySelector('.g2t-time-scrub').value==='20'")});
    await b.click('.g2t-timeline-events button:nth-child(2)');await b.delay(550);
    if(context==='house') {await b.evaluate("(()=>{const s=document.querySelector('.g2-shell'),t=document.querySelector('.g2-terminal');s.scrollTop+=t.getBoundingClientRect().top-90})()");await b.delay(350);}
    await b.click('.g2t-icon-button');await b.delay(400);
    checks.push({width,context,name:'native theme click reaches paper',passed:await b.evaluate("document.querySelector('.g2-terminal').dataset.tone==='paper'")});
    if(width===1440&&context==='standalone')await b.evaluate("document.querySelector('.g2-terminal').scrollTop=0");else await showChart(context);
    await b.screenshot(path.join(dir,`${width}-${context}-paper.png`));
    checks.push({width,context,state:'paper',...await audit()});
  }
} finally {
  await fs.writeFile(path.join(dir,'checks.json'),JSON.stringify({checks,exceptions:b.exceptions},null,2));
  await b.close();
}
const failed=checks.filter(c=>c.passed===false||(c.state&&(!c.selectedPointClear||c.button.width<44||c.button.height<44||c.sourceHits.some(hit=>!hit)||c.scrollWidth>c.width||!c.lensEndsBeforeRange||(c.viewport===390&&c.timelineHeights.some(h=>h<44)))));
console.log(JSON.stringify({checks:checks.length,failed,exceptions:b.exceptions,houseWidths:checks.filter(c=>c.context==='house'&&c.state==='default').map(c=>({viewport:c.viewport,width:c.width}))},null,2));
if(failed.length||b.exceptions.length)process.exitCode=1;
