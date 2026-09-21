import fs from 'node:fs/promises';
import path from 'node:path';
import {connect} from './native-session.mjs';
const dir=path.resolve('docs/g2-dream-build/g2-1/terminal/material-pass');
const b=await connect(),frames=[];
try {
 await b.cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
 await b.cdp('Page.navigate',{url:'http://127.0.0.1:4173/br/terminal'});await b.until("document.querySelector('.g2t-evidence-dock')");await b.evaluate('document.fonts.ready');await b.delay(800);
 const start=Date.now();await b.click('.g2t-timeline-events button:first-child');
 for(const [i,wait] of [65,80,600].entries()){await b.delay(wait);const elapsed=Date.now()-start;await b.screenshot(path.join(dir,`motion-${i}.png`));frames.push({file:`motion-${i}.png`,elapsedBeforeCaptureMs:elapsed});}
 await fs.writeFile(path.join(dir,'motion.json'),JSON.stringify(frames,null,2));
 await b.cdp('Page.navigate',{url:'file:///C:/dev/gridalpha-v2-nivar-g2/docs/g2-dream-build/g2-1/terminal/comparison.html'});await b.delay(500);await b.cdp('Emulation.setDeviceMetricsOverride',{width:2880,height:1140,deviceScaleFactor:1,mobile:false});await b.delay(300);await b.screenshot(path.resolve('docs/g2-dream-build/g2-1/terminal/comparison-depth.png'));
 await b.cdp('Page.navigate',{url:'file:///C:/dev/gridalpha-v2-nivar-g2/docs/g2-dream-build/g2-1/terminal/material-studies.html'});await b.cdp('Emulation.setDeviceMetricsOverride',{width:1600,height:1350,deviceScaleFactor:1,mobile:false});await b.delay(500);await b.screenshot(path.resolve('docs/g2-dream-build/g2-1/terminal/material-studies.png'));
}finally {await b.close();}
console.log(JSON.stringify(frames));
