import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {browser} from './browser.mjs';
const b=await browser(),report=[];
try {
 for(const [index,expected] of [[18,18],[-1,14],[999,23]]){
  await b.open(1440,`http://127.0.0.1:4173/docs/g2-dream-build/g2-2/terminal/initial-selection.html?index=${index}`);
  const state=await b.ev("(()=>{const r=document.querySelector('.g2-terminal');return {region:r.querySelector('.g2t-series .g2t-panel-heading h2').textContent,index:Number(r.querySelector('input[type=range]').value),trace:r.querySelector('.g2t-observation-trace').textContent}})()");
  assert.equal(state.index,expected);assert.ok(state.region.endsWith('Nordeste'));report.push({input:index,...state,pass:true});
 }
 await fs.writeFile(new URL('./initial-selection-results.json',import.meta.url),JSON.stringify({report,errors:b.errors},null,2));console.log(report);
}finally{await b.close();}
