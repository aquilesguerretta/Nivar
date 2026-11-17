// verificar-lib.mjs — acha um trecho citado no arquivo-fonte e devolve a linha.
import fs from "node:fs";
const cache = new Map();
const linhas = (arq) => {
  if (!cache.has(arq)) cache.set(arq, fs.readFileSync(arq, 'utf8').split(/\r?\n/));
  return cache.get(arq);
};
const limpa = (s) => s.replace(/\\"/g, '"').replace(/<[^>]+>/g, '');
export const PROIBIDO = [/exponencial/i, /15\s*%/, /2,3 kV/, /20[–-]28/, /85[–-]95/];

export function resolver(src) {
  const [arq, campo, trecho] = src;
  if (arq.endsWith('.json')) {
    const d = JSON.parse(fs.readFileSync(arq, 'utf8'));
    if (campo === 'aula.pergunta_mapa.pergunta_texto') {
      const pm = d.aula.pergunta_mapa;
      return { ok: pm.pergunta_texto === trecho, linha: `HTML-fonte L${pm.origem.linha_aprox} (§ MAP)` };
    }
    const s = JSON.stringify(d);
    const i = s.indexOf(trecho);
    return { ok: i >= 0, linha: 'campo do JSON' };
  }
  const ls = linhas(arq);
  const achou = [];
  ls.forEach((l, i) => { if (limpa(l).includes(trecho)) achou.push(i + 1); });
  return { ok: achou.length > 0, linha: achou.length ? `L${achou.join(', L')}` : null };
}


// O que sobra da legenda depois de tirar os trechos citados (sem caixa nem pontuação).
// Sobra = palavra de ligação minha, ou citação faltando. O roteiro lista a sobra.
export function residuo(b) {
  const n = (s) => s.toLowerCase().replace(/[“”]/g, '"');
  let r = n(b.leg);
  for (const [a, f] of b.equivalencias || []) r = r.split(n(a)).join(n(f));
  for (const s of b.src) {
    const t = s[2].replace(/^(eq|desc): "/, '').replace(/^\[?"/, '').replace(/"\]?$/, '');
    for (const parte of t.split(/",\s*"/)) r = r.split(n(parte.replace(/;$/, ''))).join(' ');
  }
  return r.replace(/[\s.,:;—()"[\]…+]+/g, ' ').trim();
}
