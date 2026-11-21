import {connect} from '../../../g2-1/terminal/native-session.mjs';
const root='C:/dev/gridalpha-v2-nivar-g2/docs/g2-dream-build/g2-2/critics/craft-hero-01';
const s=await connect(); const name=process.argv[2];
try{
 await s.cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
 await s.cdp('Page.navigate',{url:name==='spark'?'https://spark.thedigitalpanda.com/':'https://ten.375.studio/'});
 await s.until('document.readyState === "complete"'); await s.delay(12000);
 await s.screenshot(`${root}/reference-${name}-ready.png`);
 console.log(await s.evaluate('document.body.innerText.slice(0,2000)'));
 if(name==='spark'){
  await s.cdp('Input.dispatchMouseEvent',{type:'mousePressed',x:720,y:860,button:'left',clickCount:1});
  await s.delay(2000); await s.cdp('Input.dispatchMouseEvent',{type:'mouseReleased',x:720,y:860,button:'left',clickCount:1});
 }else{
  const b=await s.evaluate('(()=>{const e=[...document.querySelectorAll("*")].filter(e=>e.textContent.trim().toLowerCase()==="enter without sound").sort((a,b)=>a.children.length-b.children.length)[0];if(!e)return null;const b=e.getBoundingClientRect();return {x:b.x+b.width/2,y:b.y+b.height/2};})()');
  if(b&&b.x>0) {await s.cdp('Input.dispatchMouseEvent',{type:'mousePressed',...b,button:'left',clickCount:1}); await s.cdp('Input.dispatchMouseEvent',{type:'mouseReleased',...b,button:'left',clickCount:1});}
 }
 await s.delay(6000);await s.screenshot(`${root}/reference-${name}-entered.png`);console.log(await s.evaluate('document.body.innerText.slice(0,2000)'));
 const second=name==='spark'?{x:720,y:920}:{x:720,y:500};
 await s.cdp('Input.dispatchMouseEvent',{type:'mousePressed',...second,button:'left',clickCount:1});
 await s.delay(name==='spark'?2000:80);await s.cdp('Input.dispatchMouseEvent',{type:'mouseReleased',...second,button:'left',clickCount:1});
 await s.delay(5000);await s.screenshot(`${root}/reference-${name}-scene.png`);
 for(let i=0;i<12;i++){
  await s.cdp('Input.dispatchMouseEvent',{type:'mouseWheel',x:1050,y:750,deltaX:0,deltaY:650});await s.delay(350);
  await s.screenshot(`${root}/reference-${name}-scroll-${String(i).padStart(2,'0')}.png`);
 }
}finally{await s.close();}
