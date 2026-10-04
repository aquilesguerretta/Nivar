import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const dir=path.dirname(fileURLToPath(import.meta.url));
const repo=path.resolve(dir,'../../../..');
const require=createRequire(path.join(repo,'package.json'));
const sharp=require('sharp');
const out=path.join(repo,'public/g2/g21/emblems');
await fs.mkdir(out,{recursive:true});
const records=[];
for(const id of ['argos','diogenes','socrates','perseu','ariadne','hefesto']){
 const input=path.join(dir,`emblems/${id}-intaglio-study.png`);
 const meta=await sharp(input).metadata();
 for(const size of [600,1200]){
  const file=`${id}-hero-${size}.webp`;const target=path.join(out,file);
  await sharp(input).resize({width:size,height:size,fit:'inside',withoutEnlargement:true}).webp({quality:88,effort:6}).toFile(target);
  const bytes=await fs.readFile(target);const output=await sharp(target).metadata();
  records.push({id,file:`public/g2/g21/emblems/${file}`,source:`docs/g2-dream-build/g2-1/brand/emblems/${id}-intaglio-study.png`,sourceWidth:meta.width,sourceHeight:meta.height,width:output.width,height:output.height,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),hasAlpha:output.hasAlpha,transform:'Resize only; no creative edits. WebP quality88 effort6.'});
 }
 console.log(id+' prepared');
}
await fs.writeFile(path.join(dir,'emblem-runtime-manifest.json'),JSON.stringify(records,null,2));
console.log('Runtime bytes: '+records.reduce((sum,r)=>sum+r.bytes,0));
