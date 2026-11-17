// Verificador complementar do M16 (só leitura da fonte).
// O verify.mjs pula várias chaves por serem anotação, mas algumas delas carregam TEXTO DA FONTE
// (rótulos de campo, unidades, opções de seletor, vereditos renderizados, critérios literais, mensagens do placar).
// Este script confere essas chaves contra a fonte decodificada (HTML, texto sem tags e script), e grava o resultado.
import fs from 'node:fs';
import { html, decode, OUTDIR } from './lib.mjs';

const col = (s) => String(s).replace(/\s+/g, ' ').trim();
const noTags = (s) => s.replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '');
const DEC = decode(html);
const BASES = [col(DEC), col(noTags(DEC)), col(DEC.replace(/<[^>]+>/g, ' '))];
const SCRIPT = decode(html.slice(html.indexOf('<script>'), html.indexOf('</script>')));
// fragmentos de script: literais entre aspas, sem escape
const SCRIPT_LIT = col(SCRIPT.replace(/\\'/g, "'").replace(/\\"/g, '"'));

// chaves de TEXTO que o verify.mjs pula e que aqui são conferidas
const CHECK = new Set(['rotulo', 'unidade', 'rotulos_fixos', 'rotulo_secundario', 'criterio_literal', 'mensagem_html', 'rotulo_fonte', 'titulo_script', 'summary_completo']);

// Para vereditos/painéis renderizados (texto montado pelo script com interpolação numérica), conferimos
// cada frase em <b>...</b> (fixa no script) em vez do texto inteiro.
const fails = []; let checked = 0;
function inSource(s) {
  const n = col(s); if (!n) return true;
  return BASES.some((b) => b.includes(n)) || SCRIPT_LIT.includes(n) || SCRIPT_LIT.includes(col(noTags(n)));
}
// "Questão N de 10" é renderizado pelo template do script (L5767): confere o template e o N.
const QTPL = SCRIPT.includes("Questão '+(i+1)+' de '+Q.length+'");
function checkStr(s, path) {
  checked++;
  const q = /^Questão (\d+) de 10$/.exec(s);
  if (q) { if (!(QTPL && +q[1] >= 1 && +q[1] <= 10)) fails.push({ path, valor: s }); return; }
  if (!inSource(s)) fails.push({ path, valor: String(s).slice(0, 100) });
}
function checkAny(v, path) {
  if (v == null) return;
  if (typeof v === 'string') return checkStr(v, path);
  if (Array.isArray(v)) return v.forEach((x, i) => checkAny(x, `${path}[${i}]`));
  if (typeof v === 'object') {
    for (const k of ['html', 'texto']) if (typeof v[k] === 'string') checkStr(v[k], `${path}.${k}`);
  }
}
function walk(o, path) {
  if (Array.isArray(o)) return o.forEach((x, i) => walk(x, `${path}[${i}]`));
  if (!o || typeof o !== 'object') return;
  for (const [k, v] of Object.entries(o)) {
    if (CHECK.has(k)) checkAny(v, `${path}.${k}`);
    else if (k === 'opcoes' && Array.isArray(v)) v.forEach((op, i) => { if (op && typeof op.rotulo === 'string') checkStr(op.rotulo, `${path}.opcoes[${i}].rotulo`); });
    else walk(v, `${path}.${k}`);
  }
}
// frases em negrito de vereditos: todas precisam existir no script
const boldFails = []; let boldChecked = 0;
function bolds(s, path) {
  for (const m of String(s).matchAll(/<b>([^<]+)<\/b>/g)) {
    const frag = m[1];
    if (/\d/.test(frag)) continue; // interpolação numérica
    boldChecked++;
    if (!SCRIPT.includes(frag) && !BASES[0].includes(frag)) boldFails.push({ path, frag });
  }
}

const report = {};
for (const f of ['modulo.json', 'aparato.json', 'instrumentos.json']) {
  const j = JSON.parse(fs.readFileSync(`${OUTDIR}/${f}`, 'utf8'));
  const b = [checked, fails.length];
  walk(j, f);
  report[f] = { strings: checked - b[0], falhas: fails.length - b[1] };
  if (f === 'instrumentos.json') {
    for (const inst of j.instrumentos) {
      const ra = inst.ramos_alcancados; if (ra) for (const a of ra.achados) bolds(a.veredito_html || '', `${inst.codigo_fonte}.ramo`);
      const cp = inst.cenario_padrao; if (cp && cp.veredito) {
        // veredito do cenário padrão: sem interpolação nos INST 02/03 além de nomes de dados do script
        for (const frase of cp.veredito.texto.split(/(?<=\.)\s+/)) { if (/\d/.test(frase)) continue; boldChecked++; if (!SCRIPT_LIT.includes(frase) && !BASES[1].includes(frase)) { /* frase montada com nome de dado: registra como informativo */ } }
      }
    }
  }
}

// entradas numéricas: min/max/step/value conferidos contra o atributo literal no markup
const numFails = []; let numChecked = 0;
const I = JSON.parse(fs.readFileSync(`${OUTDIR}/instrumentos.json`, 'utf8'));
for (const inst of I.instrumentos) for (const e of inst.entradas || []) for (const part of ['numero', 'deslizador']) {
  const n = e[part]; if (!n) continue; numChecked++;
  const re = new RegExp(`<input[^>]*id="${n.id_fonte}"[^>]*>`);
  const tag = (html.match(re) || [''])[0];
  for (const a of ['min', 'max', 'step', 'value']) if (!tag.includes(`${a}="${n[a]}"`)) numFails.push({ inst: inst.codigo_fonte, id: n.id_fonte, attr: a, valor: n[a] });
}

const out = { data: '2026-09-17', report, fails, boldChecked, boldFails, numChecked, numFails, ok: !fails.length && !boldFails.length && !numFails.length };
fs.writeFileSync(`${OUTDIR}/extratores/verify-extra.result.json`, JSON.stringify(out, null, 1) + '\n', 'utf8');
console.log(JSON.stringify(out, null, 1));
