import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import sharp from 'sharp';
const directory=path.dirname(fileURLToPath(import.meta.url));
const packageRoot=path.resolve(directory,'../..');
const bg=[18,17,23];
const hash=buffer=>crypto.createHash('sha256').update(buffer).digest('hex');
const items=[
  {file:'intelligence-390-final',css:'390 × 844',label:'01 / Intelligence'},
  {file:'academy-430-final',css:'430 × 932',label:'03 / Academy'},
  {file:'finale-430-dark-final',css:'430 × 932',label:'Diógenes / escuro'},
  {file:'finale-430-light-final',css:'430 × 932',label:'Diógenes / claro'},
  {file:'method-390-gap-preserved',css:'390 × 844',label:'08:00 / lacuna preservada'},
  {file:'software-1440-dark-final',css:'1440 × 1000',label:'04 / Software — escuro'},
  {file:'software-1440-light-final',css:'1440 × 1000',label:'04 / Software — claro'},
];
for(const item of items){
  const source=`evidence/house/${item.file}.png`;
  const bytes=await fs.readFile(path.join(packageRoot,source));
  const {data,info}=await sharp(bytes).removeAlpha().raw().toBuffer({resolveWithObject:true});
  let left=info.width,top=info.height,right=0,bottom=0;
  for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){
    const i=(y*info.width+x)*info.channels;
    if(data[i]!==bg[0]||data[i+1]!==bg[1]||data[i+2]!==bg[2]){left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x+1);bottom=Math.max(bottom,y+1);}
  }
  if(left!==0||top!==0||right<210||bottom<470)throw new Error(`Unexpected capture bounds: ${item.file}`);
  const crop={left,top,width:right-left,height:bottom-top};
  const output=`${item.file}-crop.png`;
  await sharp(bytes).extract(crop).png().toFile(path.join(directory,output));
  Object.assign(item,{source,sourceBytes:bytes.length,sourceSha256:hash(bytes),sourcePixels:[info.width,info.height],crop,output,outputSha256:hash(await fs.readFile(path.join(directory,output)))});
}
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const sheets=[];
for(const set of [{file:'mobile-final-native.png',title:'Móvel · capturas finais',items:items.slice(0,5)},{file:'software-final-native.png',title:'Software · Ariadne na página de família',items:items.slice(5)}]){
  const width=32+set.items.reduce((n,item)=>n+item.crop.width+32,0);
  const height=180+Math.max(...set.items.map(x=>x.crop.height))+40;
  const labels=[`<text x="32" y="40" font-size="26" font-family="Georgia">${esc(set.title)}</text>`,`<text x="32" y="70" font-size="13">Pixels da captura preservados: só padding uniforme RGB(18,17,23) removido; sem resize, nitidez ou retoque.</text>`,`<text x="32" y="94" font-size="13">Viewport CSS e resolução capturada são diferentes. A folha não comprova tipografia em resolução integral.</text>`];
  const overlays=[];let x=32;
  for(const item of set.items){
    labels.push(`<text x="${x}" y="125" font-size="13" font-weight="600">${esc(item.label)}</text>`,`<text x="${x}" y="146" font-size="12">CSS ${item.css}</text>`,`<text x="${x}" y="164" font-size="12">Captura ${item.crop.width} × ${item.crop.height} px</text>`);
    overlays.push({input:path.join(directory,item.output),left:x,top:180});x+=item.crop.width+32;
  }
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#ede8eb"/><g fill="#28252d" font-family="Arial,sans-serif">${labels.join('')}</g></svg>`;
  await sharp(Buffer.from(svg)).composite(overlays).png().toFile(path.join(directory,set.file));
  sheets.push({file:set.file,width,height,sourceFiles:set.items.map(x=>x.source),sha256:hash(await fs.readFile(path.join(directory,set.file)))});
}
await fs.writeFile(path.join(directory,'final-native-provenance.json'),JSON.stringify({created:'2026-09-12',operation:'Exact bounding box of non-padding pixels; preserve faint capture edges; no source pixel changed or rescaled. Contact labels are outside source content.',paddingRGB:bg,items,sheets},null,2)+'\n');
console.log(JSON.stringify({crops:items.map(x=>({file:x.file,crop:x.crop})),sheets},null,2));
