// Atlas da Alexandria v3 — a prancha das maquetes.
//
// Monta docs/alexandria-v3/atlas/modelos-folha.png a partir das fotos que o Blender tira
// (gerar_modelos.py -- --folha grava tools/alexandria-atlas/modelos/folha/*.png e a escala
// de cada foto em escalas.json) e de public/alexandria/atlas/modelos/modelos.json:
//
//   node tools/alexandria-atlas/modelos/montar-folha.mjs
//
// A prancha é a apresentação das maquetes: nome, regra de escolha pelo cadastro, medida
// real, triângulos e peso, e uma régua de 50 m desenhada na escala de cada foto. Abre o
// HTML no Chrome do sistema (Playwright) e fotografa a página inteira.

import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..', '..');
const FOTOS = path.join(AQUI, 'folha');
const SAIDA = path.join(RAIZ, 'docs', 'alexandria-v3', 'atlas', 'modelos-folha.png');

const req = createRequire('C:/Users/aquil/AppData/Roaming/npm/node_modules/@playwright/cli/package.json');
const { chromium } = req('playwright');

const resumo = JSON.parse(await fs.readFile(path.join(RAIZ, 'public', 'alexandria', 'atlas', 'modelos', 'modelos.json'), 'utf8'));
const escalas = JSON.parse(await fs.readFile(path.join(FOTOS, 'escalas.json'), 'utf8'));
const porNome = Object.fromEntries(resumo.modelos.map((m) => [m.arquivo.replace('.glb', ''), m]));

/** nome, regra pelo cadastro, e quanto da largura da prancha a foto ocupa (hierarquia por escala) */
const SECOES = [
  {
    titulo: 'Geração',
    nota: 'Uma maquete por ponto do cadastro da ANEEL, escolhida pelo combustível, pela fonte, pela sigla do tipo e pela potência. Logo depois do zoom das maquetes só as usinas de 300 MW ou mais ganham uma; de perto, todas a partir de 1 MW.',
    itens: [
      ['hidreletrica-grande', 'Hidrelétrica grande', 'UHE de 1 GW ou mais · casa de força 2× mais longa', 2],
      ['hidreletrica', 'Hidrelétrica', 'UHE · atravessada à direção usina → reservatório do ONS', 2],
      ['nuclear', 'Nuclear', 'UTN', 2],
      ['termica-gas', 'Térmica a gás, ciclo combinado', 'gás natural, 50 MW ou mais', 1],
      ['termica-carvao', 'Térmica a carvão', 'carvão mineral', 1],
      ['biomassa-cana', 'Usina de cana', 'bagaço de cana', 1],
      ['biomassa', 'Biomassa sólida', 'lenha, cavaco, casca, licor negro', 1],
      ['alto-forno', 'Gás de alto-forno', 'siderúrgica (gás de alto-forno)', 1],
      ['biogas', 'Biogás', 'biogás e resíduo sólido urbano', 1],
      ['termica-motores', 'Térmica a motores', 'óleo diesel e óleo combustível', 1],
      ['termeletrica', 'Térmica genérica', 'gás abaixo de 50 MW e o resto', 1],
      ['aerogerador', 'Eólica', 'EOL · um aerogerador por parque', 1],
      ['solar', 'Solar fotovoltaica', 'UFV', 1],
      ['pch', 'Pequena central hidrelétrica', 'PCH e CGH', 1],
    ],
  },
  {
    titulo: 'Rede',
    nota: 'Subestação pela maior tensão (ou a das linhas que chegam nela) e pelo número de linhas que terminam nela; conversora onde termina linha de corrente contínua; torre pela classe da linha, só de 230 kV para cima.',
    itens: [
      ['subestacao-no', 'Nó da rede', '440 kV ou mais e oito linhas ou mais', 2],
      ['conversora', 'Estação conversora', 'ponta de linha CC', 2],
      ['subestacao-grande', 'Subestação, 440 a 800 kV', '440 kV ou mais', 1],
      ['subestacao', 'Subestação, 230 a 345 kV', '200 a 439 kV', 1],
      ['subestacao-pequena', 'Subestação, até 138 kV', 'abaixo de 200 kV ou sem tensão', 1],
      ['torre', 'Torre autoportante', '230 a 345 kV · na cor da classe', 1],
      ['torre-ehv', 'Torre estaiada em V', '440 a 800 kV', 1],
      ['torre-cc', 'Torre de corrente contínua', 'linha CC', 1],
      ['torre-lod', 'Torre, versão de longe', 'menos de 64 px na tela', 0.5],
      ['torre-ehv-lod', 'Estaiada, de longe', 'menos de 64 px', 0.5],
      ['torre-cc-lod', 'CC, de longe', 'menos de 64 px', 0.5],
    ],
  },
  {
    titulo: 'Gás e petróleo',
    nota: 'Capítulo O combustível: um ponto da camada da ANP, uma maquete, só o que a fonte diz que opera. A refinaria cresce com o refino declarado em barris por dia.',
    itens: [
      ['refinaria', 'Refinaria', 'ANP · refino', 2],
      ['terminal-gnl', 'Terminal de GNL', 'ANP · regaseificação', 1],
      ['upgn', 'Unidade de processamento de gás', 'ANP · UPGN', 1],
      ['terminal-liquidos', 'Terminal de líquidos', 'ANP · tancagem', 1],
    ],
  },
];

const LARG_FOTO = 900; // px da foto do Blender
const kb = (b) => `${(b / 1024).toFixed(1).replace('.', ',')} KB`;
const m = (v) => `${String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} m`;

async function foto(nome) {
  const b = await fs.readFile(path.join(FOTOS, `${nome}.png`));
  return `data:image/png;base64,${b.toString('base64')}`;
}

let corpo = '';
for (const s of SECOES) {
  let celulas = '';
  for (const [nome, titulo, regra, peso] of s.itens) {
    const info = porNome[nome];
    if (!info) throw new Error(`sem ${nome} em modelos.json`);
    const larguraFoto = peso >= 2 ? 560 : peso >= 1 ? 340 : 200;
    // régua: 50 m na escala da foto, redimensionada para a largura exibida
    const regua = (50 / escalas[nome]) * (larguraFoto / LARG_FOTO);
    const [dx, dy, dz] = info.dimensoes;
    celulas += `
      <figure class="c p${String(peso).replace('.', '')}">
        <img src="${await foto(nome)}" style="width:${larguraFoto}px" alt="">
        <div class="regua"><span style="width:${regua.toFixed(1)}px"></span><b>50 m</b></div>
        <figcaption>
          <h3>${titulo}</h3>
          <p class="regra">${regra}</p>
          <p class="dado">${m(dx)} × ${m(dy)} × ${m(dz)} · ${info.triangulos} triângulos · ${kb(info.bytes)}</p>
        </figcaption>
      </figure>`;
  }
  corpo += `
    <section>
      <header><h2>${s.titulo}</h2><p>${s.nota}</p></header>
      <div class="grade">${celulas}</div>
    </section>`;
}

// a mesma foto no tamanho em que o mapa a desenha (a 44 px e a 95 px de maior medida): é aí
// que a silhueta tem de ler, não na prancha grande
let faixa = '';
for (const s of SECOES) {
  for (const [nome, titulo] of s.itens) {
    if (nome.endsWith('-lod')) continue;
    const f = await foto(nome);
    faixa += `<figure class="mini"><div class="par"><img src="${f}" style="width:${Math.round(44 * 1.14 * 2)}px"><img src="${f}" style="width:${Math.round(95 * 1.14 * 2)}px"></div><figcaption>${titulo}</figcaption></figure>`;
  }
}
corpo += `
    <section>
      <header><h2>No tamanho do mapa</h2><p>Cada maquete a 44 px e a 95 px de maior medida (a lei de tamanho dá 44 px a 30 MW e 95 px a 1 GW), ampliada 2× para a prancha. É neste tamanho que a silhueta tem de dizer o tipo.</p></header>
      <div class="grade mini-grade">${faixa}</div>
    </section>`;

const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500&family=Instrument+Sans:wght@400;500&family=IBM+Plex+Mono:wght@400&display=block" rel="stylesheet">
<style>
  :root { --papel:#f2ecdf; --tinta:#15213b; --suave:#4a5163; --fraca:#6d6a62; --ouro:#a8854f; --fio:rgba(21,33,59,.16); }
  * { box-sizing:border-box; margin:0; }
  body { background:var(--papel); color:var(--tinta); font-family:'Instrument Sans',sans-serif; width:2400px; padding:96px 112px 104px; }
  .topo { display:grid; grid-template-columns: 1.3fr 1fr; gap:96px; align-items:end; padding-bottom:40px; border-bottom:1px solid var(--tinta); }
  .topo .sobre { font-family:'IBM Plex Mono',monospace; font-size:15px; letter-spacing:.14em; text-transform:uppercase; color:var(--suave); margin-bottom:18px; }
  .topo h1 { font-family:'Newsreader',serif; font-weight:400; font-size:112px; line-height:.95; letter-spacing:-.02em; }
  .topo .lede { font-family:'Newsreader',serif; font-size:27px; line-height:1.35; color:var(--suave); max-width:820px; }
  section { padding-top:56px; }
  section > header { display:grid; grid-template-columns: 360px 1fr; gap:48px; align-items:baseline; padding-bottom:8px; }
  section h2 { font-family:'Newsreader',serif; font-weight:400; font-size:48px; }
  section > header p { font-size:19px; color:var(--suave); max-width:980px; line-height:1.45; }
  .grade { display:flex; flex-wrap:wrap; align-items:flex-end; gap:8px 40px; }
  figure { display:flex; flex-direction:column; }
  figure img { display:block; height:auto; }
  .regua { display:flex; align-items:center; gap:10px; height:18px; margin:-8px 0 10px 8px; }
  .regua span { display:block; height:5px; border:1px solid var(--tinta); border-top:0; }
  .regua b { font-family:'IBM Plex Mono',monospace; font-weight:400; font-size:12px; color:var(--fraca); }
  figcaption { padding-left:8px; max-width:360px; }
  .p2 figcaption { max-width:520px; }
  figcaption h3 { font-family:'Newsreader',serif; font-weight:400; font-size:25px; line-height:1.15; }
  .p2 figcaption h3 { font-size:34px; }
  .p05 figcaption h3 { font-size:19px; }
  .regra { font-size:16px; color:var(--suave); margin-top:4px; }
  .dado { font-family:'IBM Plex Mono',monospace; font-size:12.5px; color:var(--fraca); margin-top:8px; letter-spacing:.02em; }
  .mini-grade { gap:24px 36px; align-items:flex-end; }
  .mini .par { display:flex; align-items:flex-end; gap:6px; }
  .mini figcaption { font-size:14px; color:var(--suave); padding-left:0; margin-top:4px; }
  .pe { margin-top:64px; padding-top:20px; border-top:1px solid var(--fio); display:flex; justify-content:space-between; font-family:'IBM Plex Mono',monospace; font-size:13px; color:var(--fraca); }
</style></head><body>
  <div class="topo">
    <div><p class="sobre">Alexandria · Atlas · maquetes</p><h1>O tipo de cada instalação,<br>em papel e tinta</h1></div>
    <p class="lede">Esquema do tipo, não retrato da obra. Proporções na ordem de grandeza real; a posição é a do cadastro; de longe a maquete cresce para caber na tela e só chega à escala real de perto. A obra de verdade aparece na foto de satélite.</p>
  </div>
  ${corpo}
  <div class="pe"><span>gerado por tools/alexandria-atlas/modelos/gerar_modelos.py e montar-folha.mjs</span><span>${resumo.nota.match(/Blender [\d.]+/)?.[0] ?? ''}</span></div>
</body></html>`;

const arquivoHtml = path.join(FOTOS, 'folha.html');
await fs.writeFile(arquivoHtml, html);
const browser = await chromium.launch({ channel: 'chrome' });
const pagina = await browser.newPage({ viewport: { width: 2400, height: 1200 }, deviceScaleFactor: 1 });
await pagina.goto('file:///' + arquivoHtml.replace(/\\/g, '/'));
await pagina.evaluate(() => document.fonts.ready);
await pagina.waitForTimeout(500);
await pagina.screenshot({ path: SAIDA, fullPage: true });
await browser.close();
await fs.rm(arquivoHtml);
console.log('prancha', SAIDA);
