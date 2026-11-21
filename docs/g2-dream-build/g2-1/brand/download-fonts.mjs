import fs from 'node:fs/promises';
import path from 'node:path';
const root = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/i, '$1'));
const families = [
 ['Literata','Literata:ital,opsz,wght@0,7..72,400..600;1,7..72,400..600','literata'],
 ['Manrope','Manrope:wght@400..700','manrope'],
 ['Geist Mono','Geist+Mono:wght@400..600','geistmono'],
 ['IBM Plex Serif','IBM+Plex+Serif:ital,wght@0,400;0,500;1,400','ibmplexserif'],
 ['IBM Plex Sans','IBM+Plex+Sans:wght@400;500;600','ibmplexsans'],
 ['IBM Plex Mono','IBM+Plex+Mono:wght@400;500','ibmplexmono'],
 ['Fraunces','Fraunces:ital,opsz,wght@0,9..144,400..600;1,9..144,400..600','fraunces'],
 ['DM Sans','DM+Sans:opsz,wght@9..40,400..600','dmsans'],
 ['DM Mono','DM+Mono:wght@400;500','dmmono'],
];
await fs.mkdir(path.join(root,'fonts'),{recursive:true});
const provenance=[]; let css='/* Original licensed font files, local delivery for reproducible comparison. */\n';
for(const [family,query,slug] of families){
 const url=`https://fonts.googleapis.com/css2?family=${query}&display=swap`;
 const res=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'}});
 if(!res.ok)throw Error(`${family}: ${res.status}`);
 const original=await res.text();await fs.writeFile(path.join(root,'fonts',`${slug}-source.css`),original);
 const blocks=original.match(/\/\* latin(?:-ext)? \*\/[\s\S]*?\}/g)||[];
 if(!blocks.length)throw Error(`No Latin face ${family}`);
 let i=0;
 for(let block of blocks){
   const src=block.match(/url\((.*?)\)/)?.[1];if(!src)continue;
   const filename=`${slug}-${++i}.woff2`;
   const response=await fetch(src);if(!response.ok)throw Error(`${src}: ${response.status}`);
   const bytes=Buffer.from(await response.arrayBuffer());
   await fs.writeFile(path.join(root,'fonts',filename),bytes);
   css+=block.replace(src,`./fonts/${filename}`)+'\n';
   provenance.push({family,file:`fonts/${filename}`,source:src,cssSource:url,bytes:bytes.length});
 }
 const licenseUrl=`https://raw.githubusercontent.com/google/fonts/main/ofl/${slug}/OFL.txt`;
 const license=await fetch(licenseUrl);if(!license.ok)throw Error(`License ${family}: ${license.status}`);
 await fs.writeFile(path.join(root,'fonts',`${slug}-OFL.txt`),await license.text());
 console.log(`${family}: ${i} Latin / Latin Extended faces, OFL captured`);
}
await fs.writeFile(path.join(root,'fonts.css'),css);
await fs.writeFile(path.join(root,'font-provenance.json'),JSON.stringify(provenance,null,2));
