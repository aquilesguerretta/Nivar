import fs from 'fs';
const L=fs.readFileSync('C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo01.html','utf8').split('\n');
const sec=L.slice(2005,2095).join(' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
const terms=[...L.join('\n').matchAll(/<span class="term">([^<]+)<\/span>/g)].map(m=>m[1]);
console.log(terms.length, terms.join(' ; '));
const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
for(const t of terms){
  const b=t.replace(/\s*\(.*\)\s*/,'').trim();
  const re=new RegExp('(^|[^\\p{L}])'+esc(b)+'(?![\\p{L}])','giu');
  const m=sec.match(re); if(m) console.log('MATCH',t,m.length);
  const ab=(t.match(/\(([^)]+)\)/)||[])[1];
  if(ab){const r2=new RegExp('(^|[^\\p{L}])'+esc(ab)+'(?![\\p{L}])','gu');const m2=sec.match(r2); if(m2) console.log('ABBR',t,ab,m2.length);}
}
