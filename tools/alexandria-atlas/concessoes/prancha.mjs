#!/usr/bin/env node
// Prancha de conferência: desenha distribuicao-areas.geojson (sem o app) em PNG, para olhar
// o polígono de cada distribuidora contra o contorno do Brasil (Natural Earth 110m).
// Não é a camada do Atlas: é só a verificação visual do dado.
//
// Uso: node tools/alexandria-atlas/concessoes/prancha.mjs <pasta-saida>

import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

const req = createRequire('C:/Users/aquil/AppData/Roaming/npm/node_modules/@playwright/cli/package.json');
const { chromium } = req('playwright');
const topo = createRequire(import.meta.url)('topojson-client');

const OUT = path.resolve(process.argv[2] ?? 'prancha-concessoes');
fs.mkdirSync(OUT, { recursive: true });
const areas = JSON.parse(fs.readFileSync('public/alexandria/atlas/dados/distribuicao-areas.geojson', 'utf8'));
const w = JSON.parse(fs.readFileSync('public/alexandria/geo/world-110m.json', 'utf8'));
const brasil = topo.feature(w, w.objects.countries).features.find((f) => f.properties.name === 'Brazil');

const VISTAS = [
  { nome: 'brasil', bbox: [-74.5, -34.2, -31.8, 5.8], w: 1400, h: 1400 },
  { nome: 'sul', bbox: [-58, -34, -47.5, -25.5], w: 1400, h: 1200 },
  { nome: 'sudeste', bbox: [-53.5, -25.5, -39, -14], w: 1400, h: 1200 },
  { nome: 'rr-am', bbox: [-74, -10, -56, 5.5], w: 1400, h: 1200 },
];

const html = (v) => `<!doctype html><meta charset=utf-8><body style="margin:0;background:#f2ecdf">
<canvas id=c width=${v.w} height=${v.h}></canvas><script>
const A=${JSON.stringify(areas)},B=${JSON.stringify(brasil)},V=${JSON.stringify(v)};
const c=document.getElementById('c').getContext('2d');
const my=(la)=>Math.log(Math.tan(Math.PI/4+la*Math.PI/360));
const [x0,y0,x1,y1]=V.bbox; const sx=V.w/(x1-x0), Y0=my(y0), Y1=my(y1), sy=V.h/(Y1-Y0); const s=Math.min(sx,sy*(Math.PI/180));
const P=([x,y])=>[(x-x0)*sx, V.h-(my(y)-Y0)*sy];
function anel(r){r.forEach((p,i)=>{const [a,b]=P(p); i?c.lineTo(a,b):c.moveTo(a,b)}); c.closePath();}
function geo(g){c.beginPath(); const ps=g.type==='Polygon'?[g.coordinates]:g.coordinates; ps.forEach(p=>p.forEach(anel));}
for(const f of A.features){ geo(f.geometry);
  const perm=f.properties.tipo==='permissionária';
  c.fillStyle=perm?'rgba(154,59,34,0.28)':'rgba(21,33,59,0.07)'; c.fill('evenodd');
  c.strokeStyle=perm?'rgba(154,59,34,0.9)':'rgba(21,33,59,0.75)'; c.lineWidth=perm?0.8:1; c.stroke(); }
geo(B.geometry); c.strokeStyle='rgba(176,140,60,0.9)'; c.setLineDash([4,3]); c.lineWidth=1.2; c.stroke(); c.setLineDash([]);
c.font='11px monospace'; c.fillStyle='#15213b';
for(const f of A.features){ const g=f.geometry; const ps=g.type==='Polygon'?[g.coordinates]:g.coordinates;
  let best=null,ba=0; for(const p of ps){let a=0;const r=p[0];for(let i=0;i<r.length-1;i++)a+=r[i][0]*r[i+1][1]-r[i+1][0]*r[i][1];a=Math.abs(a);if(a>ba){ba=a;best=r}}
  const [px,py]=P([best.reduce((s,p)=>s+p[0],0)/best.length,best.reduce((s,p)=>s+p[1],0)/best.length]);
  const pxA=ba*sx*sx; if(pxA>V.w*V.h/40000) c.fillText(f.properties.codigo+' '+f.properties.nome.slice(0,18),px-20,py); }
</script>`;

const b = await chromium.launch({ channel: 'chrome' });
for (const v of VISTAS) {
  const p = await b.newPage({ viewport: { width: v.w, height: v.h } });
  await p.setContent(html(v));
  await p.waitForTimeout(300);
  await p.screenshot({ path: path.join(OUT, `concessoes-${v.nome}.png`) });
  await p.close();
}
await b.close();
console.log('prancha em', OUT);
