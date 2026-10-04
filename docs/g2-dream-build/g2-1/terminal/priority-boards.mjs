import path from 'node:path';
import {connect} from './native-session.mjs';
const b=await connect();
try {
 for(const [file,width,height,output] of [['comparison.html',2880,1140,'comparison-depth.png'],['material-studies.html',1600,1350,'material-studies.png']]) {
  await b.cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
  await b.cdp('Page.navigate',{url:`file:///C:/dev/gridalpha-v2-nivar-g2/docs/g2-dream-build/g2-1/terminal/${file}`});await b.delay(500);
  await b.screenshot(path.resolve('docs/g2-dream-build/g2-1/terminal',output));
 }
}finally {await b.close();}
