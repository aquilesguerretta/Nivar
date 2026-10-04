import path from 'node:path';
import {connect} from './native-session.mjs';
const b=await connect();
try {
 await b.cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 await b.cdp('Page.navigate',{url:'http://127.0.0.1:4173/br/terminal'});await b.until("document.querySelector('.g2t-evidence-dock')");await b.evaluate('document.fonts.ready');await b.delay(900);
 await b.screenshot(path.resolve('docs/g2-dream-build/g2-1/terminal/material-pass/390-dark.png'));
 await b.evaluate("document.querySelector('.g2-terminal').scrollTop=420");await b.screenshot(path.resolve('docs/g2-dream-build/g2-1/terminal/material-pass/390-probe.png'));
 await b.evaluate("document.querySelector('.g2-terminal').scrollTop=0");await b.click('.g2t-icon-button');await b.delay(350);await b.screenshot(path.resolve('docs/g2-dream-build/g2-1/terminal/material-pass/390-paper.png'));
}finally {await b.close();}
