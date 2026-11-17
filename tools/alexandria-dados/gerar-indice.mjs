// Gera src/lib/alexandria/indice.dados.ts — o índice de trilhas, módulos e aulas
// da Alexandria v3 — a partir SÓ da extração verificada (docs/alexandria-v2/extraction).
//
// Nada é redigitado: títulos, frases-tese, temas e ledes são copiados dos JSONs
// de extração; contagens são contadas aqui. Onde a fonte não traz um campo, o
// campo sai `null` (ausência declarada), nunca preenchido por plausibilidade.
//
// Uso: node tools/alexandria-dados/gerar-indice.mjs
// Sai com código 1 se alguma contagem não reconciliar com o catálogo do produto.

import fs from 'node:fs';
import path from 'node:path';

const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..', '..');
const EXT = path.join(RAIZ, 'docs/alexandria-v2/extraction');
const SAIDA = path.join(RAIZ, 'src/lib/alexandria/indice.dados.ts');
const ler = (p) => JSON.parse(fs.readFileSync(path.join(EXT, p), 'utf8'));

const textoDe = (v) => {
  if (v == null) return null;
  if (typeof v === 'string') return limpar(v);
  if (typeof v === 'object') return limpar(v.texto ?? v.text ?? (v.html ? v.html.replace(/<[^>]+>/g, '') : null));
  return null;
};
function limpar(s) {
  if (s == null) return null;
  const t = String(s).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  return t.length ? t : null;
}

const identidade = ler('identidade-modulos.json');
const listaIdent = Array.isArray(identidade) ? identidade : identidade.modulos ?? Object.values(identidade);
const instrumentos = ler('instrumentos/instrumentos.json');
const glossario = ler('glossario/glossario.json');
const verbetes = Array.isArray(glossario) ? glossario : glossario.verbetes ?? glossario.termos ?? Object.values(glossario);

// Trilha por numeral romano — mesmos ids de src/lib/data/alexandria-trilhas.ts.
const TRILHA_ID = {
  I: 'trilha-fundamentos-universais',
  II: 'trilha-setor-eletrico-brasileiro',
  III: 'trilha-especializacao-estrategica',
};

// Catálogo do produto (contagem de aulas por bloco) para reconciliar.
const catalogo = fs.readFileSync(path.join(RAIZ, 'src/lib/data/alexandria-trilhas.ts'), 'utf8');
const aulasNoCatalogo = {};
for (const m of catalogo.matchAll(/'bloco-(\d\d)':\s*(\d+)/g)) aulasNoCatalogo[m[1]] = Number(m[2]);

const problemas = [];
const modulos = [];

for (const id of listaIdent) {
  const nn = id.id.slice(1); // 'm01' → '01'
  const mod = ler(`m${nn}/modulo.json`);
  const roteiro = Array.isArray(mod.roteiro) ? mod.roteiro : [];
  const aulasFonte = roteiro.filter((r) => r.tipo === 'aula');

  // Lede/pergunta por aula. O M01 guarda a pergunta do mapa nas extrações de aula.
  const perguntaM01 = {};
  if (nn === '01') {
    for (let n = 1; n <= 9; n++) {
      const p = path.join(EXT, `m01/aula-0${n}.json`);
      if (!fs.existsSync(p)) continue;
      const a = JSON.parse(fs.readFileSync(p, 'utf8')).aula;
      perguntaM01[n] = textoDe(a?.pergunta_mapa?.pergunta_html ?? a?.pergunta_mapa?.pergunta);
    }
  }

  // Títulos que mudaram por decisão registrada (docs/alexandria-v3/DECISOES-2026-11-15.md).
  // QA-M13-A06 (Q04, o dado do instrumento vence): "Seis categorias de risco, e a sexta…" → oito.
  const TITULOS_DECIDIDOS = {
    'M13-6': 'Oito categorias de risco, e a que o currículo não nomeia',
  };

  const aulas = aulasFonte.map((r, i) => {
    const numTexto = r.marcador_num ?? r.marcador_texto ?? r.prefixo ?? (typeof r.marcador === 'string' ? r.marcador : null);
    const numMatch = String(numTexto ?? '').match(/(\d{1,2})/);
    const numero = r.numero_aula ?? (numMatch ? Number(numMatch[1]) : i + 1);
    return {
      numero,
      titulo: TITULOS_DECIDIDOS[`M${nn}-${numero}`] ?? textoDe(r.titulo) ?? textoDe(r.titulo_no_mapa),
      tema: limpar(r.marcador_rotulo ?? r.rotulo ?? null),
      // A sinopse é sempre texto da fonte: a pergunta do mapa (M01) ou o lede da aula.
      sinopse: nn === '01' ? (perguntaM01[numero] ?? null) : textoDe(r.lede),
    };
  });

  const noCatalogo = aulasNoCatalogo[nn];
  if (noCatalogo != null && noCatalogo !== aulas.length) {
    problemas.push(`M${nn}: ${aulas.length} aulas no roteiro da extração × ${noCatalogo} no catálogo`);
  }
  for (const a of aulas) if (!a.titulo) problemas.push(`M${nn} aula ${a.numero}: sem título na extração`);

  const romano = id.territorio?.romano ?? null;
  modulos.push({
    id: `modulo-${nn}`,
    codigo: `M${nn}`,
    numero: Number(nn),
    trilhaId: TRILHA_ID[romano] ?? null,
    titulo: limpar(id.tituloCatalogo),
    tese: limpar(id.frase),
    totalInstrumentos: instrumentos.contagens?.por_modulo?.[`M${nn}`] ?? null,
    totalTermos: verbetes.filter((v) => String(v.id ?? '').startsWith(`m${nn}`)).length || null,
    aulas,
  });
}

const trilhas = Object.entries(TRILHA_ID).map(([romano, id]) => {
  const ms = modulos.filter((m) => m.trilhaId === id);
  const nome = listaIdent.find((x) => x.territorio?.romano === romano)?.territorio?.nome ?? null;
  return { id, romano, nome, modulos: ms.map((m) => m.id) };
});

const totalAulas = modulos.reduce((s, m) => s + m.aulas.length, 0);
const cab = `// GERADO por tools/alexandria-dados/gerar-indice.mjs — não editar à mão.
// Fonte: docs/alexandria-v2/extraction (identidade-modulos, mNN/modulo.json,
// m01/aula-0N.json, instrumentos/instrumentos.json, glossario/glossario.json).
// ${modulos.length} módulos · ${totalAulas} aulas · gerado em ${new Date().toISOString().slice(0, 10)}.
`;
const corpo = `${cab}
import type { IndiceAlexandria } from './indice';

export const INDICE: IndiceAlexandria = ${JSON.stringify({ trilhas, modulos }, null, 2)};
`;
fs.mkdirSync(path.dirname(SAIDA), { recursive: true });
fs.writeFileSync(SAIDA, corpo);

console.log(`${modulos.length} módulos, ${totalAulas} aulas, ${trilhas.map((t) => `${t.romano}:${t.modulos.length}`).join(' ')}`);
console.log(`sinopses da fonte: ${modulos.flatMap((m) => m.aulas).filter((a) => a.sinopse).length}/${totalAulas}`);
if (problemas.length) {
  console.log('NÃO RECONCILIA:');
  for (const p of problemas) console.log('  - ' + p);
  process.exitCode = 1;
} else {
  console.log('reconciliação com o catálogo: ok');
}
