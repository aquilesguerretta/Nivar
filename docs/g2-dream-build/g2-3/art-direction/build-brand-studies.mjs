import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = path.dirname(fileURLToPath(import.meta.url));
const marks = [
  {
    id: '01-interval-optical', name: 'Interval · optical', width: 333,
    rationale: 'Controle: mesma inscrição; intervalos mais firmes e eixo de leitura preservado. A abertura A/R permanece a assinatura.',
    change: 'Ajuste óptico do ritmo N–I–V e reforço de um pixel nas hastes; curva do R permanece humana.',
    paths: [
      'M0 76V4h13l39 50V4h13v72H52L13 26v50z',
      'M81 4h13v72H81z',
      'M108 4h14l22 54 22-54h14l-30 72h-12z',
      'M180 76l29-72h13l29 72h-14l-7-18h-29l4-11h21l-11-28-22 57z',
      'M265 76V4h31c23 0 34 10 34 25 0 12-7 20-19 23l22 24h-17l-29-34h9c15 0 21-4 21-13s-6-14-21-14h-18v61z',
    ],
  },
  {
    id: '02-aperture', name: 'Abertura · institutional', width: 344,
    rationale: 'Uma inscrição mais densa. A diagonal se repete; A e R deixam o exame aberto. Terminais planos e ombros precisos.',
    change: 'V/A com mesma inclinação; R de ombros facetados; proporção larga e pausas curtas sem ligaturas ornamentais.',
    paths: [
      'M0 76V4h14l38 49V4h14v72H52L14 27v49z',
      'M82 4h14v72H82z',
      'M108 4h15l22 54 22-54h15l-30 72h-14z',
      'M181 76l30-72h14l30 72h-15l-8-19h-27l5-12h17l-9-24-22 55z',
      'M270 76V4h37l27 15v22l-21 12 31 23h-22l-35-34h17l16-9v-7l-16-9h-20v59z',
    ],
  },
  {
    id: '03-incision', name: 'Incisão · editorial technical', width: 354,
    rationale: 'A mesma casa vista pela publicação. Pequenas cunhas terminais e contraste contido dão à inscrição um traço gravado.',
    change: 'Terminais em cunha de 3 px, haste moderada e R curvo; mantém A aberto em vez de assumir um masthead clássico.',
    paths: [
      'M0 76v-3l5-2V9L0 7V4h19l39 51V9l-5-2V4h22v3l-5 2v67H58L17 24v47l5 2v3z',
      'M88 76v-3l5-2V9l-5-2V4h28v3l-5 2v62l5 2v3z',
      'M128 4h28v3l-6 2 19 49 19-49-6-2V4h23v3l-6 2-28 67h-10L133 9l-5-2z',
      'M199 76V73L205 71L232 3H242L270 71L276 73V76H248V73L254 71L247 53H225L229 43H243L235 22L215 71L221 73V76z',
      'M287 76v-3l5-2V9l-5-2V4h34c21 0 31 9 31 23 0 12-8 19-21 22l19 22 4 2v3h-20l-25-35h8c13 0 21-4 21-13s-7-14-21-14h-11v57l5 2v3z',
    ],
  },
];

const original = {
  id:'00-g21-original',name:'G2.1 original',width:333,
  paths:[
    'M0 76V4h12l40 51V4h12v72H52L12 25v51z',
    'M82 4h12v72H82z','M109 4h13l22 55 22-55h13l-29 72h-12z',
    'M179 76l29-72h13l29 72h-13l-7-18h-29l4-11h21l-12-29-22 58z',
    'M265 76V4h31c23 0 34 10 34 25 0 12-7 20-19 23l22 24h-16l-30-34h9c15 0 22-4 22-13s-7-14-22-14h-19v61z',
  ],
};
const artwork = (m, color = 'currentColor') => `<g fill="${color}" fill-rule="evenodd">${m.paths.map(d=>`<path d="${d}"/>`).join('')}</g>`;
const svg = (m, color='currentColor') => `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="NIVAR" viewBox="0 0 ${m.width} 80" fill="none">${artwork(m,color)}</svg>`;
const monogram = m => `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="NIVAR" viewBox="-7 -3 88 86"><path fill="currentColor" d="${m.paths[0]}"/></svg>`;
await fs.mkdir(path.join(here,'wordmarks'),{recursive:true});
for(const m of [original,...marks]) {
  await fs.writeFile(path.join(here,'wordmarks',`${m.id}.svg`),svg(m));
  await fs.writeFile(path.join(here,'wordmarks',`${m.id}-monogram.svg`),monogram(m));
}
await fs.writeFile(path.join(here,'wordmarks','candidates.json'), JSON.stringify({created:'2026-09-12',source:'src/components/g2/Brand.tsx at starting G2.3 tree',original, candidates:marks},null,2));

const wm=(m,h=32)=>`<span class="wm" style="height:${h}px;width:${h*m.width/80}px">${svg(m)}</span>`;
const unit='R$/MWh · MW · MWh · 12.09.2026 · 09:30 BRT';
const card=m=>`<article class="candidate" id="${m.id}"><div class="candidate-head"><span class="meta">${m.id.slice(0,2)} / ORIGINAL VECTOR</span><h2>${m.name}</h2><p>${m.rationale}</p><p class="meta">${m.change}</p></div><div class="large">${wm(m,76)}</div><div class="sizes"><span class="favicon">${monogram(m)}</span>${wm(m,16)}${wm(m,24)}</div><span class="meta caption">favicon 16 × 16 · wordmark 16px / 24px</span><div class="spec-header"><div>${wm(m,24)}<span class="descriptor">INTELIGÊNCIA<br>INDEPENDENTE</span></div><span class="meta">A CASA &nbsp; BUSCAR ↗</span></div><div class="spec-header dark"><div>${wm(m,24)}<span class="descriptor">INTELLIGENCE<br>ARGOS / OBSERVAR</span></div><span class="meta">CONTA ↗</span></div><div class="document"><div class="doc-top">${wm(m,28)}<span class="meta">ENERGY BRIEF<br>EDIÇÃO DE MÉTODO 01</span></div><h3>O preço mudou.<br><em>A explicação também?</em></h3><p>Antes de interpretar uma variação, identifique a série. Fonte, unidade, período e transformação devem acompanhar cada leitura.</p><span class="meta">NULLIUS IN VERBA. &nbsp; ${unit}</span></div><div class="terminal dark"><div class="terminal-top">${wm(m,22)}<span class="meta">TERMINAL BRASIL</span></div><div class="datum">68<small>MW</small></div><span class="meta">EV–001 · ESTUDO SINTÉTICO</span><div class="data-row"><span>00h</span><span>04h</span><span>08h</span><span>12h</span><span>16h</span><span>20h</span></div><div class="data-row"><span>68</span><span>64</span><span>—</span><span>81</span><span>—</span><span>108</span></div><p>4 observações · 2 ausências preservadas.</p></div><div class="title-frame"><span class="meta">UMA CASA INDEPENDENTE</span>${wm(m,56)}<em>Método antes do resultado.</em></div><div class="black-white"><div>${wm(m,24)}</div><div>${wm(m,24)}</div></div></article>`;
const html=`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NIVAR G2.3 · Inscrição da casa</title><style>
@font-face{font-family:NivarStudySans;src:url('../../../../public/g2/g21/fonts/manrope-2.woff2')}@font-face{font-family:NivarStudySerif;src:url('../../../../public/g2/g21/fonts/literata-2.woff2')}@font-face{font-family:NivarStudySerif;src:url('../../../../public/g2/g21/fonts/literata-4.woff2');font-style:italic}@font-face{font-family:NivarStudyMono;src:url('../../../../public/g2/g21/fonts/geistmono-2.woff2')}
*{box-sizing:border-box}body{margin:0;background:#e4e0e5;color:#28252d;font:14px/1.65 NivarStudySans,Arial,sans-serif}header,main,footer{max-width:1680px;margin:auto;padding:24px 32px}header{border-bottom:1px solid #b8acbd;display:flex;justify-content:space-between;align-items:center;gap:24px}.meta{font:10px/1.5 NivarStudyMono,monospace;letter-spacing:.035em;color:#766b7c}.intro{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin:30px 0 42px}.intro h1{font:400 52px/1.1 NivarStudySerif,Georgia,serif;margin:0;letter-spacing:-.05em}.intro p{max-width:65ch;margin:0 0 12px}.control{display:flex;align-items:center;gap:24px;padding-top:12px}.board{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.candidate{min-width:0;background:#f3f0ed;border:1px solid #c2b8c7}.candidate-head{padding:24px 22px 0;min-height:247px}.candidate h2{font:400 26px/1.15 NivarStudySerif,Georgia,serif;margin:12px 0}.candidate p{font-size:12px}.wm{display:inline-flex;flex:none;max-width:100%}.wm svg{display:block;width:100%;height:100%}.large{padding:28px 22px 34px}.large .wm{width:100%!important;height:auto!important;aspect-ratio:4.25}.sizes{display:flex;gap:25px;align-items:center;padding:18px 22px;border-top:1px solid #d2c8d4}.favicon{display:block;width:16px;height:16px;flex:none}.favicon svg{width:16px;height:16px}.caption{display:block;padding:0 22px 22px}.spec-header{padding:18px 20px;border-top:1px solid #cabfcc;display:flex;justify-content:space-between;gap:12px;align-items:center}.spec-header>div{display:flex;align-items:center;gap:15px}.descriptor{font:8px/1.5 NivarStudyMono,monospace;letter-spacing:.08em}.dark{background:#252329;color:#f1eced}.dark .meta{color:#bdb0c6}.dark .spec-header{border-color:#4e4753}.document{margin:24px 18px;padding:23px 18px;background:#f9f5ee;border-left:3px solid #a99279}.doc-top{display:flex;align-items:start;justify-content:space-between;gap:20px}.doc-top .meta{text-align:right}.document h3{font:400 30px/1.2 NivarStudySerif,Georgia,serif;letter-spacing:-.03em;margin:35px 0 18px}.document p{font-size:12px;line-height:1.8}.document>.meta{display:block;border-top:1px solid #cbbeb7;padding-top:18px;margin-top:25px;font-size:9px}.terminal{margin:18px;padding:20px}.terminal-top{display:flex;justify-content:space-between;align-items:center;gap:14px}.datum{font:400 60px/1.15 NivarStudySans,Arial,sans-serif;letter-spacing:-.05em;margin-top:23px}.datum small{font:11px NivarStudyMono,monospace;margin-left:8px}.data-row{display:grid;grid-template-columns:repeat(6,1fr);font:11px NivarStudyMono,monospace;border-top:1px solid #514755;padding:10px 0;margin-top:8px}.terminal p{font-size:11px;color:#c6bacd}.title-frame{padding:25px 22px 34px;background:#d7cedc;display:grid;gap:24px;min-height:216px}.title-frame em{font:italic 18px NivarStudySerif,Georgia,serif}.black-white{display:grid;grid-template-columns:1fr 1fr}.black-white>div{padding:20px;background:white;color:black}.black-white>div+div{background:black;color:white}footer{margin-top:35px;font-size:12px;border-top:1px solid #b8acbd}a{color:inherit;text-underline-offset:4px}@media(max-width:1150px){.board{grid-template-columns:1fr}.candidate{max-width:680px}.candidate-head{min-height:0}.large .wm{max-width:520px}.intro{grid-template-columns:1fr}}@media(max-width:500px){header,main,footer{padding:20px}header{display:block}.intro h1{font-size:39px}.sizes{gap:20px}.spec-header>.meta{display:none}.document h3{font-size:28px}.candidate-head{padding:20px}.descriptor{font-size:7px}.control{flex-wrap:wrap}.title-frame .wm{width:100%!important;height:auto!important;aspect-ratio:4.25}}
</style><header><strong>NIVAR / G2.3</strong><span class="meta">ESTUDOS DA INSCRIÇÃO · 12 SET 2026<br>TRÊS DIREÇÕES / NENHUMA APROVAÇÃO IMPLÍCITA</span></header><main><section class="intro"><h1>Uma casa.<br>Três inscrições.</h1><div><p>O teste é de ritmo, contraforma e autoridade em uso. As três propostas são desenhos originais derivados do Interval; a identidade dos patronos permanece preservada.</p><p>Mesmo conteúdo, mesmas fontes licenciadas, mesmos tamanhos e dois materiais. Nenhum dado numérico deste estudo representa um mercado real.</p><div class="control"><span class="meta">CONTROLE G2.1</span>${wm(original,26)}<a href="wordmarks/00-g21-original.svg">SVG original ↗</a></div></div></section><section class="board">${marks.map(card).join('')}</section></main><footer>Proveniência: paths originais de Brand.tsx + novos desenhos locais. Nenhuma fonte incorporada ao desenho da marca. Tipografia de contexto: Literata / Manrope / Geist Mono, OFL, arquivos existentes. SVGs têm uma única cor e formas editáveis. <a href="wordmarks/candidates.json">Geometria e registro ↗</a></footer></html>`;
await fs.writeFile(path.join(here,'brand-comparison.html'),html);

// Deterministic offline vector specimen. These are actual proposed paths, not AI mockups.
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const mount=(m,x,y,h,fill)=>`<g transform="translate(${x} ${y}) scale(${h/80})">${artwork(m,fill)}</g>`;
const sheetW=1800,sheetH=1240;
let sheet=`<svg xmlns="http://www.w3.org/2000/svg" width="${sheetW}" height="${sheetH}" viewBox="0 0 ${sheetW} ${sheetH}"><rect width="1800" height="1240" fill="#e7e2e7"/><text x="55" y="54" fill="#28252d" font-family="Arial" font-size="24" font-weight="bold">NIVAR · G2.3 / ORIGINAL WORDMARK STUDIES</text><text x="55" y="90" fill="#736579" font-family="Arial" font-size="16">Same contours in one color, actual small scales and material contexts · 12 Sep 2026</text>`;
marks.forEach((m,i)=>{const x=40+i*588;sheet+=`<rect x="${x}" y="130" width="560" height="1060" fill="#f5f1ec"/><text x="${x+26}" y="175" font-family="Arial" font-size="22" fill="#28252d">${esc(m.name)}</text><text x="${x+26}" y="208" font-family="monospace" font-size="13" fill="#766a7a">${m.id} / paths, no font</text>${mount(m,x+26,265,112,'#29252d')}<line x1="${x+26}" y1="415" x2="${x+534}" y2="415" stroke="#c7bbc9"/><text x="${x+26}" y="449" font-family="monospace" font-size="12" fill="#766a7a">ACTUAL 16 px / 24 px / DERIVED N AT 16 px</text>${mount(m,x+26,479,16,'#29252d')}${mount(m,x+157,475,24,'#29252d')}<g transform="translate(${x+320} 478) scale(.20)"><path d="${m.paths[0]}" fill="#29252d"/></g><rect x="${x+26}" y="532" width="508" height="92" fill="#29252d"/>${mount(m,x+44,562,28,'#f4eff1')}<text x="${x+330}" y="579" font-family="monospace" font-size="11" fill="#c6b7ce">TERMINAL BRASIL</text><text x="${x+26}" y="676" font-family="monospace" font-size="12" fill="#766a7a">DOCUMENT / VIDEO TITLE</text>${mount(m,x+26,702,43,'#29252d')}<text x="${x+26}" y="811" font-family="Georgia" font-size="40" fill="#29252d">Método antes</text><text x="${x+26}" y="860" font-family="Georgia" font-style="italic" font-size="40" fill="#29252d">do resultado.</text><line x1="${x+26}" y1="902" x2="${x+534}" y2="902" stroke="#c7bbc9"/><text x="${x+26}" y="939" font-family="monospace" font-size="13" fill="#766a7a">68 MW · 00h / SÉRIE SINTÉTICA</text><text x="${x+26}" y="972" font-family="Arial" font-size="15" fill="#534958">Four observations. Two gaps. No interpolation.</text><rect x="${x+26}" y="1012" width="254" height="136" fill="#fff"/><rect x="${x+280}" y="1012" width="254" height="136" fill="#000"/>${mount(m,x+44,1067,35,'#000')}${mount(m,x+298,1067,35,'#fff')}`;});sheet+='</svg>';
await fs.writeFile(path.join(here,'wordmark-contact-sheet.svg'),sheet);
await sharp(Buffer.from(sheet)).png().toFile(path.join(here,'wordmark-contact-sheet.png'));
console.log(JSON.stringify({candidates:marks.map(m=>m.id),artifacts:['brand-comparison.html','wordmark-contact-sheet.png','wordmark-contact-sheet.svg','wordmarks/candidates.json']},null,2));
