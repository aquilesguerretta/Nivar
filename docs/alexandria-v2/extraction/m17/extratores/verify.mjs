// Verificador: confere que todo campo de conteúdo dos 3 JSONs é substring
// (normalizada) da fonte, e que cada `origem` aponta para a linha certa.
import fs from 'node:fs';
import * as L from './lib.mjs';

const RAW = L.collapse(L.html);
const TXT = L.collapse(L.decode(L.stripTags(L.html)));
const LINES = L.html.split('\n');
const SKIP_PATH = /(^|\.)(estados|estados_exemplo|cenario_padrao|ramos|leitura|divergencias|codigo_divergencias|verificacoes_da_fonte|comparacao_codigo|codigo|codigo_atual|resumo|script_verbatim|saidas|catalogo_canonico|catalogo_codigo_bloco_17|contagem|contagens|convencoes|sensibilidade_cenario_padrao_anotacao|anomalias_dos_dados|classes_medidas_sobre_128_combinacoes|grade_17|dados|mecanica_fonte|rotulos_de_interface_fonte|faixas_de_placar_script|script|marcacao_p14|limiar|criterio_literal|pills_nota|marca_P24|principios_editoriais|tradutor|capacidades_em_blocos_de_produto\.\d+\.origem|ponto_de_invocacao|mencoes_no_texto|markup_alvos|homonimos_em_outros_modulos)(\.|$)/;
const HTML_KEY = /(^html$|_html$)/;
const TEXT_KEY = /^(texto|.*_texto|rotulo|termo|chave|campo|jurisdicao|palavra|faixa|titulo|categoria|bloco|descricao_verbatim|frase_criterio|frase_introdutoria|valor_texto|fala_texto|resumo_texto|corpo_texto|serve_texto|nao_serve_texto|erro_texto|correcao_texto|agrupa_texto|nao_agrupa_texto|definicao_texto|enunciado_texto|resposta_referencia_texto|explicacao_texto|familia|categoria_estrutural|data_consulta)$/;
const ANOT = /(nota|evidencia|anotacao|decisao|observacoes|kind_)/;

const res = { checados: 0, falhas: [], origens: 0, origens_falhas: [] };
function check(file, path, key, v) {
  if (typeof v !== 'string' || !v.trim()) return;
  if (SKIP_PATH.test(path) || ANOT.test(key)) return;
  const isH = HTML_KEY.test(key), isT = TEXT_KEY.test(key);
  if (!isH && !isT) return;
  res.checados++;
  const c = L.collapse(v);
  const ok = isH ? (RAW.includes(c) || TXT.includes(L.collapse(L.decode(L.stripTags(c))))) : (TXT.includes(c) || RAW.includes(c));
  if (!ok) res.falhas.push({ file, path, amostra: c.slice(0, 90) });
}
function checkOrigem(file, path, o) {
  if (!o || typeof o.linha_aprox !== 'number' || !o.trecho_inicial) return;
  res.origens++;
  const lo = Math.max(0, o.linha_aprox - 4), hi = Math.min(LINES.length, o.linha_aprox + 12);
  const win = L.collapse(L.decode(L.stripTags(LINES.slice(lo, hi).join('\n'))));
  const winRaw = L.collapse(LINES.slice(lo, hi).join('\n'));
  const probe = L.collapse(o.trecho_inicial).slice(0, 24);
  const probeRaw = probe.replace(/^#/, '');
  if (!win.includes(probe) && !winRaw.includes(probeRaw) && !L.collapse(L.decode(winRaw)).includes(probe)) res.origens_falhas.push({ file, path, linha: o.linha_aprox, probe });
}
function walk(file, node, path) {
  if (Array.isArray(node)) return node.forEach((x, i) => walk(file, x, path + '.' + i));
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      const p = path ? path + '.' + k : k;
      if (k === 'origem' && v && typeof v === 'object') checkOrigem(file, p, v);
      if (typeof v === 'string') check(file, p, k, v); else walk(file, v, p);
    }
  }
}
for (const f of ['modulo.json', 'aparato.json', 'instrumentos.json']) {
  walk(f, JSON.parse(fs.readFileSync(L.OUTDIR + '/' + f, 'utf8')), '');
}
// textos exibidos por execução: cada fragmento literal entre tags deve existir no script
const inst = JSON.parse(fs.readFileSync(L.OUTDIR + '/instrumentos.json', 'utf8'));
let frag = 0, fragFail = [];
// junta as concatenações 'a'+'b' do código para que a prosa fique contígua
const SCRIPT = L.collapse(L.decode(L.scripts.map((s) => s.code).join('\n').replace(/'\s*\+\s*'/g, '')));
const INTERP = /(?:dotação|desenho|política|\d[\d.,]*×?|ausentes?|A|B)(?=[.;\s]|$)/;
for (const x of inst.instrumentos) {
  const vs = [...(x.estados || []), ...(x.estados_exemplo || []), x.cenario_padrao].filter(Boolean).map((e) => e.leitura && e.leitura.html).filter(Boolean);
  for (const h of vs) {
    for (const piece of h.split(/<[^>]+>/).map((s) => L.collapse(L.decode(s))).filter((s) => s.length > 25 && !/\d/.test(s))) {
      frag++;
      // divide em frases e em pontos de interpolação; cada pedaço longo precisa existir no script
      const partes = piece.split(/(?<=[.;:])\s+/).flatMap((q) => q.split(INTERP)).map((q) => q.trim()).filter((q) => q.length > 14);
      if (!partes.every((q) => SCRIPT.includes(q))) fragFail.push({ id: x.id, piece: piece.slice(0, 80), faltando: partes.filter((q) => !SCRIPT.includes(q)).slice(0, 2) });
    }
  }
}
res.fragmentos_de_veredito_checados = frag;
res.fragmentos_de_veredito_falhas = fragFail.slice(0, 20);
res.fragmentos_de_veredito_falhas_total = fragFail.length;
console.log(JSON.stringify({ checados: res.checados, falhas: res.falhas.length, origens: res.origens, origens_falhas: res.origens_falhas.length, fragmentos: frag, fragmentos_falhas: fragFail.length }));
console.log(JSON.stringify(res.falhas.slice(0, 30), null, 1));
console.log(JSON.stringify(res.origens_falhas.slice(0, 30), null, 1));
console.log(JSON.stringify(res.fragmentos_de_veredito_falhas, null, 1));
fs.writeFileSync(L.OUTDIR + '/extratores/verify-resultado.json', JSON.stringify(res, null, 2) + '\n');
// cobertura do verificador por grupo (para o relatório)
{
  const byTop = {};
  const walk2 = (file, node, path) => {
    if (Array.isArray(node)) return node.forEach((x, i) => walk2(file, x, path + '.' + i));
    if (node && typeof node === 'object') for (const [k, v] of Object.entries(node)) {
      const p = path ? path + '.' + k : k;
      if (typeof v === 'string') {
        if (!v.trim() || SKIP_PATH.test(p) || ANOT.test(k) || !(HTML_KEY.test(k) || TEXT_KEY.test(k))) continue;
        const top = file + ':' + p.split('.')[0] + (p.split('.')[0] === 'instrumentos' ? '' : '');
        byTop[top] = (byTop[top] || 0) + 1;
      } else walk2(file, v, p);
    }
  };
  for (const f of ['modulo.json', 'aparato.json', 'instrumentos.json']) walk2(f, JSON.parse(fs.readFileSync(L.OUTDIR + '/' + f, 'utf8')), '');
  console.log(JSON.stringify(byTop));
  res.por_grupo = byTop;
  fs.writeFileSync(L.OUTDIR + '/extratores/verify-resultado.json', JSON.stringify(res, null, 2) + '\n');
}
