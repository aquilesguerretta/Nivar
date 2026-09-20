import {connect} from './native-session.mjs';
const b=await connect();
try{await b.cdp('Page.navigate',{url:'http://127.0.0.1:4173/br/terminal'});await b.delay(4000);console.log(await b.evaluate(`({url:location.href,ready:document.readyState,title:document.title,body:document.body.innerText,requests:performance.getEntriesByType('resource').filter(r=>r.responseStatus!==200).map(r=>({name:r.name,duration:r.duration,response:r.responseStatus}))})`));console.log(JSON.stringify({logs:b.logs,exceptions:b.exceptions}));}finally{await b.close();}
