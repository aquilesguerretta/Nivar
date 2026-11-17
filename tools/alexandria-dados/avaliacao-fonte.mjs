// Leitura comum da extração verificada do M01 — usada pelo gerador e pelo verificador
// de avaliação. Nada aqui inventa conteúdo: só localiza texto e linha na extração.
//
// `indiceDoTextoDaAula(n)` percorre `blocos` de aula-0N.json e devolve cada string de
// texto (chaves texto/eq_texto/desc_texto/desc/rotulo_texto/rotulo) com o CAMINHO dela
// no JSON e a linha do HTML-fonte (a do ancestral mais próximo que declara
// origem.linha_aprox). É a mesma lista nos dois lados: o gerador cita, o verificador
// reencontra pelo caminho.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const EXT_REL = 'docs/alexandria-v2/extraction/m01';
export const EXT = path.join(RAIZ, EXT_REL);

export const lerJson = (nome) => JSON.parse(fs.readFileSync(path.join(EXT, nome), 'utf8'));
export const arquivoDaAula = (n) => `${EXT_REL}/aula-${String(n).padStart(2, '0')}.json`;
export const ARQUIVO_APARATO = `${EXT_REL}/aparato.json`;

const CHAVES_TEXTO = new Set(['texto', 'eq_texto', 'desc_texto', 'desc', 'rotulo_texto', 'rotulo']);

// Normalização para comparar por substring: espaço colapsado, sem tags, aspas retas.
export const norm = (s) =>
  String(s ?? '')
    .replace(/<[^>]+>/g, '')
    .replace(/[\u00a0\s]+/g, ' ')
    .trim();

export function indiceDoTextoDaAula(n) {
  const a = lerJson(`aula-${String(n).padStart(2, '0')}.json`);
  const itens = [];
  const walk = (o, caminho, linha) => {
    if (Array.isArray(o)) {
      o.forEach((x, i) => walk(x, `${caminho}[${i}]`, linha));
      return;
    }
    if (!o || typeof o !== 'object') return;
    const l = o.origem && typeof o.origem.linha_aprox === 'number' ? o.origem.linha_aprox : linha;
    for (const [k, v] of Object.entries(o)) {
      if (k === 'origem') continue;
      if (typeof v === 'string' && CHAVES_TEXTO.has(k)) itens.push({ caminho: `${caminho}.${k}`, texto: v, linha: l });
      else if (v && typeof v === 'object') walk(v, `${caminho}.${k}`, l);
    }
  };
  walk(a.blocos, 'blocos', null);
  return itens;
}

// Reencontra uma string pelo caminho "blocos[3].paragrafos[0].texto".
export function valorNoCaminho(json, caminho) {
  const passos = caminho.match(/[^.[\]]+/g) ?? [];
  let o = json;
  for (const p of passos) {
    if (o == null) return undefined;
    o = o[/^\d+$/.test(p) ? Number(p) : p];
  }
  return o;
}
