import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
const dir=path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/,'$1'));
const records=[
 {id:'itaipu-aerial',title:'Itaipu Dam, aerial photograph.jpg',author:'acediscovery',date:'2013-01-02',license:'CC BY 4.0',licenseUrl:'https://creativecommons.org/licenses/by/4.0/',url:'https://upload.wikimedia.org/wikipedia/commons/9/9e/Itaipu_Dam%2C_aerial_photograph.jpg',dimensions:[2600,2773],status:'preferred-candidate'},
 {id:'itaipu-control-room',title:'Itaipu-Wasserkraftwerk Kontrollraum.JPG',author:'Anagoria',date:'2010-11-20',license:'CC BY 3.0',licenseUrl:'https://creativecommons.org/licenses/by/3.0/',url:'https://upload.wikimedia.org/wikipedia/commons/8/8c/Itaipu-Wasserkraftwerk_Kontrollraum.JPG',dimensions:[3648,2736],status:'preferred-candidate',note:'CC BY 3.0 selected from dual license; not GFDL.'},
 {id:'itaipu-power-lines',title:'Power lines and Itaipu lake (8155778229) (2).jpg',author:'Leandro Neumann Ciuffo',date:'2012-11-04',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',url:'https://upload.wikimedia.org/wikipedia/commons/9/94/Power_lines_and_Itaipu_lake_%288155778229%29_%282%29.jpg',dimensions:[3462,2310],status:'preferred-candidate',note:'Pylons on Paraguay side. Binational infrastructure; do not relabel Brazilian-side transmission.'},
 {id:'itaipu-spillway',title:'Itaipu Dam Spillway.jpg',author:'Gabriel Resende Veiga',date:'2016-08-10',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',url:'https://upload.wikimedia.org/wikipedia/commons/f/f7/Itaipu_Dam_Spillway.jpg',dimensions:[5312,2988],status:'conditional-candidate',note:'If adapted, distribute adapted media under CC BY-SA 4.0; preserve attribution and modifications.'},
 {id:'itaipu-generator-hall',title:'Itaipu Décembre 2007 - Salle des Générateurs.jpg',author:'Martin St-Amant',date:'2007-12-22',license:'CC BY 3.0 (formal license; conflicting nearby-credit request says BY-SA 3.0)',licenseUrl:'https://creativecommons.org/licenses/by/3.0/',url:'https://upload.wikimedia.org/wikipedia/commons/9/9b/Itaipu_D%C3%A9cembre_2007_-_Salle_des_G%C3%A9n%C3%A9rateurs.jpg',dimensions:[4542,1660],status:'secondary-candidate-license-discrepancy',note:'Formal license and authored permission paragraphs link BY 3.0, but requested adjacent credit says CC-BY-SA-3.0. Preserve discrepancy, do not silently change license. No message sent to author.'},
];
await fs.mkdir(path.join(dir,'originals'),{recursive:true});
await fs.mkdir(path.join(dir,'source-pages'),{recursive:true});
for (const item of records) {
 item.sourcePage='https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(item.title.replaceAll(' ','_'));
 item.retrievedAt=new Date().toISOString();
 const out=path.join(dir,'originals',item.id+'.jpg');
 let b;
 try {b=await fs.readFile(out);} catch {
  const res=await fetch(item.url,{headers:{'User-Agent':'NIVARResearch/1.0'}});
  if(!res.ok) {item.downloadStatus=res.status; console.log(item.id,'download deferred',res.status);continue;}
  b=Buffer.from(await res.arrayBuffer()); await fs.writeFile(out,b);
 }
 item.original='originals/'+item.id+'.jpg'; item.bytes=b.length; item.sha256=crypto.createHash('sha256').update(b).digest('hex'); item.modifications='None. Original bytes preserved.';
 try {const saved=path.join(dir,'source-pages',item.id+'.html');try{await fs.access(saved);item.sourceSnapshot='source-pages/'+item.id+'.html';}catch{const page=await fetch(item.sourcePage); item.snapshotStatus=page.status; if(page.ok){const html=await page.text();await fs.writeFile(saved,html);item.sourceSnapshot='source-pages/'+item.id+'.html';}}}catch(error){item.snapshotError=String(error);}
 console.log(item.id,item.bytes,item.sha256);
}
await fs.writeFile(path.join(dir,'asset-provenance.json'),JSON.stringify({scope:'Research candidates only; no runtime assets',checkedAt:new Date().toISOString(),records},null,2)+'\n');
