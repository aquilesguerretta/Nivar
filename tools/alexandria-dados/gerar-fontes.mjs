// Gera src/lib/alexandria/fontes.dados.ts — o § Ref (bibliografia) dos 17
// módulos da Alexandria — a partir SÓ da extração verificada
// (docs/alexandria-v2/extraction/mNN/aparato.json, chave `referencias`).
//
// Regra dura: nada vem de fora da fonte. Toda string emitida é literal (ou
// substring com espaço normalizado) do que a extração guarda para aquele item
// ou módulo. Onde a extração não declara, sai `null` / `[]` — nunca sigla
// expandida, URL adivinhada nem título inventado. Tirar tag HTML é permitido.
//
// Os 17 módulos têm esquemas diferentes; por isso há um adaptador por módulo,
// explícito, logo abaixo. Cada adaptador diz de qual campo vem cada coisa.
//
// Uso: node tools/alexandria-dados/gerar-fontes.mjs
// Conferência: node tools/alexandria-dados/verificar-fontes.mjs

import fs from 'node:fs';
import path from 'node:path';

const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..', '..');
const EXT = path.join(RAIZ, 'docs/alexandria-v2/extraction');
const SAIDA = path.join(RAIZ, 'src/lib/alexandria/fontes.dados.ts');
const ler = (p) => JSON.parse(fs.readFileSync(path.join(EXT, p), 'utf8'));

// ───────────────────────── utilitários literais ─────────────────────────

/** Tira tag HTML e colapsa espaço. Não muda nenhuma palavra. */
export function limpar(s) {
  if (s == null) return null;
  const t = String(s).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  return t.length ? t : null;
}
const txt = (v) => (v == null ? null : typeof v === 'string' ? limpar(v) : limpar(v.texto ?? (v.html != null ? v.html : null)));
const lista = (v) => {
  if (v == null) return [];
  const arr = Array.isArray(v) ? v : [v];
  const out = [];
  for (const x of arr) {
    const t = typeof x === 'string' ? limpar(x) : txt(x);
    if (t && !out.includes(t)) out.push(t); // dedup: a fonte às vezes repete o mesmo ano
  }
  return out;
};
/** Separadores que a fonte usa entre título e descrição. */
const SEP_INICIO = /^[\s·—–,;:.]+/;
/** Resto de `texto` depois de `inicio` (que tem de ser prefixo literal). */
function resto(texto, inicio) {
  if (!texto || !inicio) return null;
  if (!texto.startsWith(inicio)) return null;
  return limpar(texto.slice(inicio.length).replace(SEP_INICIO, ''));
}
/** Primeira frase literal: até o primeiro ponto seguido de espaço e maiúscula. */
function primeiraFrase(texto) {
  if (!texto) return null;
  const m = texto.match(/^(.+?[.!?])\s+(?=["“(]?[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ])/);
  return m ? m[1] : texto;
}
/** Titulo = 1ª frase; descrição = o resto. */
function porFrase(texto) {
  const t = limpar(texto);
  const titulo = primeiraFrase(t);
  return { titulo, descricao: resto(t, titulo) };
}
/** Parte do texto de link antes de " · " (o domínio/caminho citado). */
function dominioDoLink(s) {
  const t = limpar(s);
  if (!t) return null;
  const d = t.split(' · ')[0].trim();
  return /^https?:\/\//i.test(d) ? null : d;
}
const urlDe = (v) => {
  const u = Array.isArray(v) ? v[0] : v;
  return typeof u === 'string' && /^https?:\/\//i.test(u) ? u : null;
};
/** Tira o domínio citado do fim do texto, se ele estiver lá literalmente. */
function semDominioNoFim(s, dominio) {
  if (!s || !dominio) return s;
  return s.endsWith(dominio) ? limpar(s.slice(0, -dominio.length)) : s;
}

// Título de m02/m03: o trecho inicial do texto até o fim da obra em itálico
// (livros: "Autor — Obra") ou até o fim do primeiro negrito. Descrição: o resto
// do texto, sem o domínio do fim (que vai em `dominio`).
function tituloPorNegrito(it, obras, dominio) {
  const texto = limpar(it.texto);
  const negrito = limpar((it.titulos_em_negrito ?? [])[0]);
  let titulo = negrito && texto.startsWith(negrito) ? negrito : null;
  const obra = obras.length ? limpar(obras[obras.length - 1]) : null;
  if (obra) {
    const i = texto.indexOf(obra);
    if (i >= 0) titulo = texto.slice(0, i + obra.length);
  }
  if (!titulo) return porFrase(texto);
  const desc = semDominioNoFim(resto(texto, titulo), dominio);
  return { titulo, descricao: desc && desc.length ? desc : null };
}

// ───────────────────────── adaptadores por módulo ─────────────────────────
// Cada um devolve { itens: [{raw, titulo, descricao, natureza, instituicoes,
// url, dominio, datas, secundaria}], cab: {rotulo, titulo, introducao,
// verificadaEm} }.

const base = (raw, o) => ({
  raw,
  natureza: null,
  instituicoes: [],
  url: null,
  dominio: null,
  datas: [],
  secundaria: false,
  ...o,
});

const ADAPTADORES = {
  // M01 — itens planos; o negrito é a instituição; a descrição é `descricao_verbatim`.
  // Sem título próprio: título = 1ª frase da descrição; tipo_fonte é null em todos.
  '01': (r) => ({
    cab: { rotulo: r.rotulo_marcador, titulo: txt(r.titulo), introducao: txt(r.introducao), verificadaEm: null },
    itens: r.itens.map((it) => base(it, {
      ...porFrase(it.descricao_verbatim),
      natureza: limpar(it.tipo_fonte),
      instituicoes: lista(it.instituicao),
      url: urlDe(it.url),
      dominio: limpar(it.dominio_citado),
      datas: lista(it.data),
    })),
  }),
  // M02 — grupos[].itens; natureza = título do grupo (h4).
  '02': (r) => ({
    cab: { rotulo: r.rotulo_marcador, titulo: txt(r.titulo), introducao: txt(r.introducao), verificadaEm: null },
    itens: r.grupos.flatMap((g) => g.itens.map((it) => {
      const dominio = limpar(it.dominio_ou_caminho_citado);
      return base(it, {
        ...tituloPorNegrito(it, it.titulo_obra ? [it.titulo_obra] : [], dominio),
        natureza: limpar(g.titulo),
        instituicoes: lista(it.instituicao),
        url: urlDe(it.url),
        dominio,
        datas: lista(it.datas_citadas),
      });
    })),
  }),
  // M03 — grupos[].itens; natureza = rótulo do grupo; `instituicao_ou_autor`
  // mistura instituição e autor (é o que a extração declara).
  '03': (r) => ({
    cab: { rotulo: r.rotulo_marcador, titulo: txt(r.titulo), introducao: txt(r.introducao), verificadaEm: null },
    itens: r.grupos.flatMap((g) => g.itens.map((it) => {
      const dominio = limpar(it.dominio_citado);
      return base(it, {
        ...tituloPorNegrito(it, it.obras_em_italico ?? [], dominio),
        natureza: limpar(g.grupo),
        instituicoes: lista(it.instituicao_ou_autor),
        url: urlDe(it.url),
        dominio,
        datas: lista(it.data),
      });
    })),
  }),
  // M04 — span.src dividido em instituicao + titulo_ou_recorte; domínio é o
  // início do texto do link.
  '04': (r) => ({
    cab: { rotulo: null, titulo: txt(r.titulo_secao), introducao: txt(r.lede), verificadaEm: null },
    itens: r.itens.map((it) => base(it, {
      titulo: limpar(it.titulo_ou_recorte),
      descricao: txt(it.descricao),
      natureza: limpar(it.tipo_fonte),
      instituicoes: lista(it.instituicao),
      url: urlDe(it.url),
      dominio: dominioDoLink(it.texto_do_link),
      datas: lista(it.datas_citadas),
    })),
  }),
  // M05 — rótulo "esquerda · direita"; com instituição, o título é a direita;
  // sem instituição (normas), o rótulo inteiro.
  '05': (r) => ({
    cab: { rotulo: r.rotulo_marcador, titulo: txt(r.titulo), introducao: txt(r.introducao), verificadaEm: null },
    itens: r.itens.map((it) => base(it, {
      titulo: limpar(it.instituicao ? it.rotulo_direita : it.rotulo_src),
      descricao: limpar(it.descricao_texto),
      natureza: limpar(it.tipo_fonte),
      instituicoes: lista(it.instituicao),
      url: urlDe(it.url),
      dominio: dominioDoLink(it.link_texto),
      datas: lista(it.ano_no_rotulo),
    })),
  }),
  // M06 — `url` é array (até 3 links); emite-se o primeiro.
  '06': (r) => ({
    cab: { rotulo: limpar(r.marcador?.rotulo), titulo: txt(r.titulo), introducao: txt(r.lede), verificadaEm: null },
    itens: r.itens.map((it) => base(it, {
      titulo: limpar(it.titulo),
      descricao: txt(it.descricao),
      instituicoes: lista(it.instituicao),
      url: urlDe(it.url),
      dominio: dominioDoLink(it.links?.[0]?.texto),
      datas: lista(it.datas_no_texto),
    })),
  }),
  '07': (r) => ({
    cab: { rotulo: r.rotulo_marcador, titulo: txt(r.titulo), introducao: txt(r.lede), verificadaEm: txt(r.data_de_verificacao_do_modulo) },
    itens: r.itens.map((it) => base(it, {
      titulo: limpar(it.titulo),
      descricao: limpar(it.descricao_texto),
      instituicoes: lista(it.instituicao),
      url: urlDe(it.url),
      dominio: dominioDoLink(it.texto_do_link),
      datas: lista(it.datas_citadas),
    })),
  }),
  // M08 — natureza = grupo (função). A data de corte vive só num box de prosa,
  // sem campo próprio: verificadaEm fica null.
  '08': (r) => ({
    cab: { rotulo: limpar(r.marcador?.rotulo), titulo: txt(r.titulo), introducao: txt(r.lead), verificadaEm: null },
    itens: r.itens.map((it) => base(it, {
      titulo: limpar(it.titulo),
      descricao: limpar(it.descricao),
      natureza: limpar(it.grupo),
      instituicoes: lista(it.instituicao),
      url: urlDe(it.url),
      dominio: limpar(it.dominio),
      datas: lista(it.datas_e_anos_literais),
    })),
  }),
  '09': (r) => ({
    cab: { rotulo: r.rotulo_marcador, titulo: txt(r.titulo), introducao: txt(r.introducao), verificadaEm: limpar(r.data_de_verificacao_declarada) },
    itens: r.itens.map((it) => base(it, {
      titulo: limpar(it.titulo_literal),
      descricao: limpar(it.descricao_literal),
      natureza: limpar(it.tipo_fonte),
      instituicoes: lista(it.instituicao),
      url: urlDe(it.url),
      dominio: limpar(it.dominio),
      datas: lista(it.marcas_de_data_no_texto),
      secundaria: it.secundaria === true,
    })),
  }),
  // M10 — a descrição repete o título no começo; emite-se só o resto.
  '10': (r) => ({
    cab: { rotulo: r.rotulo_marcador, titulo: txt(r.titulo), introducao: txt(r.lede), verificadaEm: limpar(r.data_de_consulta_de_todas) },
    itens: r.itens.map((it) => {
      const titulo = limpar(it.titulo);
      const d = txt(it.descricao);
      return base(it, {
        titulo,
        descricao: d && d.startsWith(titulo) ? resto(d, titulo) : d,
        natureza: limpar(it.rotulo),
        instituicoes: lista(it.instituicao_citada),
        url: urlDe(it.url),
        dominio: limpar(it.dominio),
        datas: lista(it.datas_citadas),
      });
    }),
  }),
  '11': (r) => ({
    cab: { rotulo: limpar(r.marcador?.rotulo), titulo: txt(r.titulo), introducao: txt(r.introducao), verificadaEm: limpar(r.data_de_consulta_declarada) },
    itens: r.itens.map((it) => {
      const texto = limpar(it.texto);
      const titulo = limpar(it.primeira_frase) ?? primeiraFrase(texto);
      return base(it, {
        titulo,
        descricao: resto(texto, titulo),
        natureza: limpar(it.rotulo_fonte),
        instituicoes: lista(it.instituicoes_citadas),
        url: urlDe(it.url),
        dominio: limpar(it.dominio_citado),
        datas: lista(it.datas_e_anos_citados),
      });
    }),
  }),
  // M12 — `referencias` é um array puro, sem cabeçalho. Rótulo e título do
  // § Ref vêm da entrada m12-roteiro-ref de m12/modulo.json (mesma extração).
  // verificadaEm: `data_consulta` de cada item, cuja origem declarada é o h2
  // do § Ref (vale para todos) — só emitida se for idêntica nos 34.
  '12': (r) => {
    const mod = ler('m12/modulo.json');
    const roteiroRef = JSON.stringify(mod).includes('m12-roteiro-ref') ? acharPorId(mod, 'm12-roteiro-ref') : null;
    const consultas = [...new Set(r.map((it) => it.data_consulta))];
    return {
      cab: {
        rotulo: limpar(roteiroRef?.rotulo),
        titulo: txt(roteiroRef?.titulo),
        introducao: null,
        verificadaEm: consultas.length === 1 ? limpar(consultas[0]) : null,
      },
      itens: r.map((it) => base(it, {
        titulo: txt(it.titulo),
        descricao: null,
        natureza: limpar(it.categoria),
        instituicoes: lista(it.instituicao),
        url: urlDe(it.url),
        dominio: limpar(it.texto_do_link),
        datas: lista(it.datas_no_texto),
      })),
    };
  },
  // M13 — sem título (titulo_nota); `natureza_ou_instituicao` é o span.src e
  // mistura natureza ("Legislação federal") e emissor ("ANEEL"): vai em
  // `natureza`, literal; instituicoes fica [] porque a extração não separa.
  '13': (r) => ({
    cab: { rotulo: limpar(r.marcador?.rotulo), titulo: txt(r.titulo), introducao: txt(r.lede), verificadaEm: null },
    itens: r.itens.map((it) => base(it, {
      ...porFrase(txt(it.descricao)),
      natureza: limpar(it.natureza_ou_instituicao),
      url: urlDe(it.url),
      dominio: limpar(it.dominio_citado),
      datas: lista(it.datas_citadas),
    })),
  }),
  // M14 — mesmo caso de M13 (`natureza_ou_emissor`); descricao_texto às vezes
  // começa com ", " porque o título corta a frase: tira-se só o separador.
  '14': (r) => ({
    cab: { rotulo: r.rotulo_marcador, titulo: txt(r.titulo), introducao: txt(r.introducao), verificadaEm: null },
    itens: r.itens.map((it) => base(it, {
      titulo: limpar(it.titulo),
      descricao: limpar((it.descricao_texto ?? '').replace(SEP_INICIO, '')),
      natureza: limpar(it.natureza_ou_emissor),
      instituicoes: lista(it.instituicao),
      url: urlDe(it.url),
      dominio: limpar(it.dominio_citado),
      datas: lista(it.datas_literais),
    })),
  }),
  '15': (r) => ({
    cab: { rotulo: r.rotulo_marcador, titulo: txt(r.titulo), introducao: txt(r.introducao), verificadaEm: limpar(r.data_de_consulta_da_secao) },
    itens: r.itens.map((it) => {
      const texto = limpar(it.texto);
      const titulo = limpar(it.titulo) ?? primeiraFrase(texto);
      return base(it, {
        titulo,
        descricao: resto(texto, titulo),
        natureza: limpar(it.rotulo_fonte),
        instituicoes: lista(it.instituicao_citada),
        url: urlDe(it.url),
        dominio: limpar(it.dominio_citado),
        datas: lista(it.datas_citadas),
      });
    }),
  }),
  '16': (r) => ({
    cab: {
      rotulo: limpar(String(r.sec_id?.texto ?? '').split(' · ')[1]),
      titulo: txt(r.titulo), introducao: txt(r.lede), verificadaEm: txt(r.data_de_consulta_global),
    },
    itens: r.itens.map((it) => {
      const texto = limpar(it.texto);
      const titulo = limpar(it.titulo) ?? primeiraFrase(texto);
      return base(it, {
        titulo,
        descricao: resto(texto, titulo),
        natureza: limpar(it.categoria_fonte),
        instituicoes: lista(it.instituicao),
        url: urlDe(it.url),
        dominio: limpar(it.dominio_citado),
        datas: lista(it.datas_citadas),
      });
    }),
  }),
  // M17 — 8 parágrafos-bloco, não referências individuais; título = nome do bloco.
  '17': (r) => ({
    cab: {
      rotulo: limpar(String(r.marcador?.texto ?? '').split(' · ')[1]),
      titulo: txt(r.titulo), introducao: txt(r.introducao), verificadaEm: limpar(r.data_de_verificacao_geral),
    },
    itens: r.itens.map((it) => base(it, {
      titulo: limpar(it.bloco),
      descricao: limpar(it.descricao_verbatim),
      instituicoes: lista(it.instituicoes),
      url: urlDe(it.url),
      dominio: limpar(it.dominio_citado),
      datas: lista(it.datas_citadas),
    })),
  }),
};

function acharPorId(no, id) {
  if (no == null || typeof no !== 'object') return null;
  if (!Array.isArray(no) && no.id === id) return no;
  for (const v of Object.values(no)) {
    const a = acharPorId(v, id);
    if (a) return a;
  }
  return null;
}

// ───────────────────────── montagem ─────────────────────────

export const CODIGOS = Array.from({ length: 17 }, (_, i) => String(i + 1).padStart(2, '0'));

// ───────────── filtro de vocabulário interno (auditor S4 / P24) ─────────────
// Documento interno não é bibliografia pública. Sai do dado (só a contagem
// por módulo fica, em FONTES_INTERNAS_OMITIDAS) todo item que:
//   · a extração marca como interno (`interna: true`), ou
//   · menciona a marca morta "GridAlpha" em qualquer texto do item cru
//     (fora de `origem` e das notas do extrator).
// Código de seção do pipeline ("§00", "§Ref", "§MAP"…; mesma lista do
// auditor alexandria-no-internal-vocabulary — NÃO pega "§ 17" de artigo de
// lei) é removido frase a frase de título/descrição; se cair no título, o
// item sai e conta como omitido.
export const MARCA_MORTA = /\bgrid\s?alpha\b/i;
export const CODIGO_DE_SECAO = /§\s?(?:00|MAP|Final|Caso|Quiz|Lab|Drill|Lex|Ref)\b/i;

function textosDoItem(no, chave = '', out = []) {
  if (/^origem$|nota/i.test(chave)) return out;
  if (typeof no === 'string') out.push(no);
  else if (Array.isArray(no)) no.forEach((v) => textosDoItem(v, '', out));
  else if (no && typeof no === 'object') for (const [k, v] of Object.entries(no)) textosDoItem(v, k, out);
  return out;
}
export function ehInterno(raw) {
  return raw.interna === true || textosDoItem(raw).some((s) => MARCA_MORTA.test(s));
}
/** Tira as frases com código de seção; mantém o primeiro trecho contíguo (literal). */
function semCodigoDeSecao(s) {
  if (s == null || !CODIGO_DE_SECAO.test(s)) return s;
  const frases = s.split(/(?<=[.!?])\s+(?=["“(]?[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ])/);
  const trechos = [];
  let atual = [];
  for (const f of frases) {
    if (CODIGO_DE_SECAO.test(f)) { if (atual.length) trechos.push(atual); atual = []; }
    else atual.push(f);
  }
  if (atual.length) trechos.push(atual);
  return trechos.length ? limpar(trechos[0].join(' ')) : null;
}

export function montar() {
  const fontes = [];
  const refs = [];
  const omitidas = [];
  for (const nn of CODIGOS) {
    const r = ler(`m${nn}/aparato.json`).referencias;
    const { cab, itens: todos } = ADAPTADORES[nn](r);
    const itens = [];
    for (const it of todos) {
      if (ehInterno(it.raw) || CODIGO_DE_SECAO.test(it.titulo ?? '')) continue;
      itens.push({ ...it, descricao: semCodigoDeSecao(it.descricao) });
    }
    omitidas.push({ moduloId: `modulo-${nn}`, total: todos.length - itens.length });
    itens.forEach((it, i) => {
      if (!it.titulo) throw new Error(`m${nn}: item ${it.raw.id} ficou sem título`);
      const emitidos = [it.titulo, it.descricao, it.natureza, it.dominio, ...it.instituicoes, ...it.datas];
      if (emitidos.some((s) => s && (MARCA_MORTA.test(s) || CODIGO_DE_SECAO.test(s)))) {
        throw new Error(`m${nn}: item ${it.raw.id} ainda carrega vocabulário interno`);
      }
      fontes.push({
        id: it.raw.id,
        moduloId: `modulo-${nn}`,
        codigo: `M${nn}`,
        ordem: i + 1,
        natureza: it.natureza ?? null,
        instituicoes: it.instituicoes,
        titulo: it.titulo,
        descricao: it.descricao ?? null,
        url: it.url,
        dominio: it.dominio ?? null,
        datas: it.datas,
        secundaria: it.secundaria,
      });
    });
    refs.push({
      moduloId: `modulo-${nn}`,
      codigo: `M${nn}`,
      rotulo: limpar(cab.rotulo),
      titulo: limpar(cab.titulo),
      introducao: limpar(cab.introducao),
      verificadaEm: limpar(cab.verificadaEm),
      total: itens.length,
    });
  }
  return { fontes, refs, omitidas };
}

function objeto(o, ind) {
  const pad = ' '.repeat(ind);
  const linhas = Object.entries(o).map(([k, v]) => `${pad}  ${JSON.stringify(k)}: ${JSON.stringify(v)}`);
  return `${pad}{\n${linhas.join(',\n')}\n${pad}}`;
}

function escrever() {
  const { fontes, refs, omitidas } = montar();
  const nOmit = omitidas.reduce((a, o) => a + o.total, 0);
  const hoje = new Date().toISOString().slice(0, 10);
  const ts = `// GERADO por tools/alexandria-dados/gerar-fontes.mjs — não editar à mão.
// Fonte: docs/alexandria-v2/extraction/mNN/aparato.json (chave \`referencias\`)
// e, só para o cabeçalho do M12, m12/modulo.json (m12-roteiro-ref).
// Conferência: node tools/alexandria-dados/verificar-fontes.mjs
// ${fontes.length} fontes · ${refs.length} módulos · ${nOmit} itens internos omitidos · gerado em ${hoje}.
//
// Toda string abaixo é literal da extração (tags HTML removidas, espaço
// colapsado). \`null\` / \`[]\` = a extração não declara o campo.
// Documentos internos (marcados \`interna\` ou que citam a marca antiga) não
// são bibliografia pública: saem do dado; só a contagem fica no fim do arquivo.

export interface FonteDoCurriculo {
  id: string;
  moduloId: string;
  codigo: string;
  /** Posição 1-based dentro do § Ref do módulo. */
  ordem: number;
  /** Rótulo que a própria fonte dá ao item ou ao grupo dele, literal. */
  natureza: string | null;
  /** Instituições que a extração declara para o item; [] se nenhuma. */
  instituicoes: string[];
  /** Título literal; sem título na fonte, a 1ª frase do texto do item. */
  titulo: string;
  /** Resto do texto do item, literal, sem repetir o título. */
  descricao: string | null;
  /** Só URL http(s) completa que a extração guarda para o item. */
  url: string | null;
  /** Domínio ou caminho citado no texto (sem protocolo). */
  dominio: string | null;
  /** Datas literais que a extração lista para o item. */
  datas: string[];
  /** true só quando a extração marca o item como fonte secundária. */
  secundaria: boolean;
}

export interface RefDoModulo {
  moduloId: string;
  codigo: string;
  rotulo: string | null;
  titulo: string | null;
  introducao: string | null;
  /** Data de verificação/consulta do módulo, só quando a extração declara uma. */
  verificadaEm: string | null;
  total: number;
}

export const FONTES_DO_CURRICULO: readonly FonteDoCurriculo[] = [
${fontes.map((f) => objeto(f, 2)).join(',\n')}
];

export const REFS_DOS_MODULOS: readonly RefDoModulo[] = [
${refs.map((r) => objeto(r, 2)).join(',\n')}
];

/** Itens do § Ref retirados por serem documento interno — só a contagem. */
export const FONTES_INTERNAS_OMITIDAS: readonly { moduloId: string; total: number }[] = [
${omitidas.map((o) => objeto(o, 2)).join(',\n')}
];
`;
  fs.writeFileSync(SAIDA, ts, 'utf8');
  console.log(`escrito ${path.relative(RAIZ, SAIDA)} — ${fontes.length} fontes em ${refs.length} módulos`);
  for (const r of refs) console.log(`  ${r.codigo}: ${r.total}` + (omitidas.find((o) => o.moduloId === r.moduloId).total ? ` (+${omitidas.find((o) => o.moduloId === r.moduloId).total} omitidos)` : ''));
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'))) {
  escrever();
}
