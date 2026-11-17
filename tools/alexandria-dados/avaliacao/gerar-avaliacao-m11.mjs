// gerar-avaliacao-m11.mjs — escreve src/lib/alexandria/avaliacao/m11.dados.ts.
//
// Fonte única: docs/alexandria-v2/extraction/m11/aparato.json (exercícios do §Ex, quiz
// do §Quiz, checklist do §Final) e o texto das aulas como está em
// src/lib/data/alexandria-modulo-11-content.ts (conferido contra o HTML original por
// tools/alexandria-dados/porte/verificar-porte-m11.mjs). Cada trecho citado é procurado
// por substring antes de escrever; se não existir, o gerador PARA.
//
// D04: os exercícios do M11 nunca apareciam na tela; no modelo v3 eles entram por aqui.
//
// VÍNCULO EXERCÍCIO → AULA (regra de colocação de 15/11, PORTE-POR-MODULO.md). Os 14 são
// soltos na fonte. Cada um tem um termo, que precisa estar literalmente no próprio
// exercício; ele vai para a ÚLTIMA aula cujo texto contém o termo; sem casamento, fica em
// EXERCICIOS_DO_MODULO. O vínculo é registrado como "vínculo mecânico" em `alertas`.
//
// ESQUEMA DA EXTRAÇÃO DO M11 (difere do M10): exercícios em `exercicios.soltos_P9[]`
// (enunciado sem o rótulo "N · Tipo.", que fica em `tag`; gabarito em
// `gabarito.paragrafos_html[]`); quiz em `avaliacao.perguntas[]`; critério na
// `avaliacao.introducao`; faixas em `avaliacao.faixas_de_placar_script[]`; checklist com
// `introducao`.
//
// DERIVADOS. Quatro perguntas de recuperação em voz da Alexandria (decisões 7 e 8), nas
// aulas que ficam sem exercício da fonte (01, 03). A resposta está literalmente no
// texto da aula; em `escolha`, toda alternativa aparece literalmente numa aula do M11.
// Nenhum derivado repete pergunta da prova nem cenário de instrumento.
//
// Uso: node tools/alexandria-dados/avaliacao/gerar-avaliacao-m11.mjs

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { RAIZ } from '../porte/porte-m09-m11-comum.mjs';

export const MODULO = 'modulo-11';
const APARATO = 'docs/alexandria-v2/extraction/m11/aparato.json';
const CONTEUDO = 'src/lib/data/alexandria-modulo-11-content.ts';
const SAIDA = path.join(RAIZ, 'src/lib/alexandria/avaliacao/m11.dados.ts');
export const N_AULAS = 8;

const ap = JSON.parse(fs.readFileSync(path.join(RAIZ, APARATO), 'utf8'));
const { MODULO_11_CORPO } = await import(pathToFileURL(path.join(RAIZ, CONTEUDO)).href);

export const editorial = (s) => String(s).replace(/GridAlpha/g, 'NIVAR');
export const texto = (s) => String(s ?? '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

/** Texto plano de um bloco da aula (o que o aluno lê). */
export function textoDoBloco(b) {
  if (!b) return '';
  if (b.kind === 'tabela') return texto(b.linhas.map((l) => l.join(' — ')).join(' · '));
  if (b.kind === 'lista') return texto(b.itens.join(' · '));
  if (b.kind === 'titulo') return texto(`${b.numero ?? ''} ${b.texto}`);
  if (b.kind === 'formula') return texto(`${b.eq} ${b.desc ?? ''}`);
  return texto(`${b.label ? b.label + ' ' : ''}${b.html ?? ''}`);
}
const idAula = (n) => `aula-11-0${n}`;
export const blocoDaAula = (n, i) => MODULO_11_CORPO[idAula(n)]?.[i];

function evidencia(n, bloco, trecho) {
  const t = textoDoBloco(blocoDaAula(n, bloco));
  if (!t.includes(trecho)) throw new Error(`A${n} bloco ${bloco}: trecho ausente «${trecho.slice(0, 80)}»`);
  return { arquivo: CONTEUDO, campo: `MODULO_11_CORPO['${idAula(n)}'][${bloco}]`, linha: null, trecho };
}

// ── termos do vínculo mecânico ──────────────────────────────────────────────
// Cada termo está literalmente no enunciado ou no gabarito do próprio exercício.
export const TERMOS = {
  'm11-ex-01': 'plano dos módulos',
  'm11-ex-02': 'faixa técnica',
  'm11-ex-03': 'instituto de metrologia',
  'm11-ex-04': 'sólida',
  'm11-ex-05': 'garantidor',
  'm11-ex-06': 'degradação',
  'm11-ex-07': '25%',
  'm11-ex-08': 'reforço',
  'm11-ex-09': 'não ancorada',
  'm11-ex-10': 'mão de obra',
  'm11-ex-11': 'consumidores livres',
  'm11-ex-12': 'parcela de aumento',
  'm11-ex-13': 'arrendamento',
  'm11-ex-14': 'insuficiência',
};

export function casamentos(termo) {
  const t = termo.toLowerCase();
  const out = [];
  for (let n = 1; n <= N_AULAS; n++) {
    const bs = MODULO_11_CORPO[idAula(n)] ?? [];
    const i = bs.findIndex((b) => textoDoBloco(b).toLowerCase().includes(t));
    if (i >= 0) out.push({ aula: n, bloco: i });
  }
  return out;
}

// ── os quatro derivados ─────────────────────────────────────────────────────
// Fora dos temas da prova na mesma aula: a prova cobra a potência em corrente alternada
// (Q01) e o teto com baterias (Q02) da A03, e o critério de "proposta sólida" (Q10); os
// derivados da A03 tratam do vocabulário das modalidades, e os da A01, das premissas e da
// pergunta do minuto zero.
export const DERIVADOS = [
  { id: 'm11-a01-d01', aula: 1, tipo: 'aberto', bloco: 1,
    enunciado: 'A conclusão de uma proposta solar é o produto de, tipicamente, sete premissas encadeadas. Quais são elas?',
    trecho: 'sete premissas encadeadas: irradiância do local, perdas do sistema, geração anual estimada, taxa de degradação, custo de operação e manutenção, trajetória de reajuste tarifário e regime regulatório aplicável ao faturamento da energia compensada.' },
  { id: 'm11-a01-d02', aula: 1, tipo: 'aberto', bloco: 2,
    enunciado: 'Um decisor entrega a proposta e pergunta se vale a pena. Segundo a aula, qual é a resposta correta no minuto zero?',
    trecho: 'A resposta correta à pergunta "vale a pena?" é, no minuto zero, outra pergunta, e ela é sempre a mesma: quais dessas premissas o documento declara, e de onde ele diz que cada uma veio?' },
  { id: 'm11-a03-d01', aula: 3, tipo: 'aberto', bloco: 11,
    enunciado: 'Quais são os quatro termos regulatórios das modalidades de participação, e o que a aula diz das expressões comerciais que circulam como sinônimos?',
    trecho: 'os termos regulatórios são autoconsumo local, autoconsumo remoto, geração compartilhada e empreendimento com múltiplas unidades consumidoras. Expressões comerciais que circulam como sinônimos — do tipo "energia por assinatura" — não são termos da norma. São marcas de posicionamento de plataformas específicas.' },
  { id: 'm11-a03-d02', aula: 3, tipo: 'escolha', bloco: 21,
    enunciado: 'Na leitura para o executivo, qual modalidade reúne titulares diferentes em consórcio, cooperativa ou associação civil?',
    alternativas: ['Autoconsumo local', 'Autoconsumo remoto', 'Geração compartilhada'], certa: 2,
    trecho: 'Geração compartilhada: titulares diferentes reunidos em consórcio, cooperativa ou associação civil.' },
];

const enunciadoDaFonte = (e) => editorial(e.enunciado.html);
const referenciaDaFonte = (e) => editorial(e.gabarito.paragrafos_html.join('<br><br>'));

function gerar() {
  const exs = ap.exercicios.soltos_P9;
  const EXERCICIOS_DAS_AULAS = [];
  const EXERCICIOS_DO_MODULO = [];
  for (const e of exs) {
    const termo = TERMOS[e.id];
    if (!termo) throw new Error(`exercício sem termo: ${e.id}`);
    const doEx = texto(`${e.enunciado.texto} ${e.gabarito.texto}`).toLowerCase();
    if (!doEx.includes(termo.toLowerCase())) throw new Error(`${e.id}: o termo «${termo}» não está no próprio exercício`);
    const casa = casamentos(termo);
    const ultima = casa.at(-1) ?? null;
    const aula = ultima ? ultima.aula : null;
    let evAula = null;
    if (ultima) {
      const t = textoDoBloco(blocoDaAula(ultima.aula, ultima.bloco));
      const k = t.toLowerCase().indexOf(termo.toLowerCase());
      evAula = evidencia(ultima.aula, ultima.bloco, t.slice(k, k + termo.length));
    }
    const k = exs.indexOf(e);
    const tag = e.tag.replace(/\.$/, '');
    (aula ? EXERCICIOS_DAS_AULAS : EXERCICIOS_DO_MODULO).push({
      id: e.id,
      moduloId: MODULO,
      aula,
      origem: 'fonte',
      tipo: 'aberto',
      enunciado: enunciadoDaFonte(e),
      gabarito: null,
      referencia: referenciaDaFonte(e),
      contaParaCriterioDoDrill: false,
      tolerancia: null,
      verificacao: 'autoavaliacao',
      fonte: { arquivo: APARATO, campo: `exercicios.soltos_P9[${k}].enunciado`, linha: e.origem.linha_aprox ?? null },
      evidencias: [
        { arquivo: APARATO, campo: `exercicios.soltos_P9[${k}].enunciado.html`, linha: e.origem.linha_aprox ?? null, trecho: enunciadoDaFonte(e) },
        ...(evAula ? [evAula] : []),
      ],
      alertas: [
        aula
          ? `Vínculo mecânico: a fonte não liga o Ex ${tag} a nenhuma aula (§Ex). O termo «${termo}», que está no exercício, aparece literalmente ${casa.length === 1 ? 'só na Aula ' + String(casa[0].aula).padStart(2, '0') + ', e o exercício vai para ela' : 'nas Aulas ' + casa.map((c) => String(c.aula).padStart(2, '0')).join(', ') + ', e o exercício vai para a última'} (regra de colocação de 15/11).`
          : `A fonte não liga o Ex ${tag} a nenhuma aula (§Ex), e o termo «${termo}» não aparece em nenhuma aula: fica nos exercícios do módulo (regra de colocação de 15/11).`,
      ],
    });
  }
  for (const d of DERIVADOS) {
    const ev = evidencia(d.aula, d.bloco, d.trecho);
    EXERCICIOS_DAS_AULAS.push({
      id: d.id,
      moduloId: MODULO,
      aula: d.aula,
      origem: 'derivado-da-aula',
      tipo: d.tipo,
      enunciado: d.enunciado,
      ...(d.tipo === 'escolha' ? { alternativas: d.alternativas, gabarito: d.certa } : { gabarito: null }),
      referencia: d.trecho,
      contaParaCriterioDoDrill: false,
      tolerancia: null,
      verificacao: d.tipo === 'escolha' ? 'alternativa-correta' : 'autoavaliacao',
      fonte: { arquivo: CONTEUDO, campo: ev.campo, linha: null },
      evidencias: [ev],
    });
  }
  EXERCICIOS_DAS_AULAS.sort((a, b) => a.aula - b.aula || (a.origem === b.origem ? 0 : a.origem === 'fonte' ? -1 : 1));

  // ── prova ── critério: a frase da introdução do §Quiz (Q01: nunca apresentado como "aprovação")
  const av = ap.avaliacao;
  const crit = 'O critério é oito acertos: abaixo disso, a matéria não está no ponto de sustentar uma avaliação cronometrada diante de um cliente.';
  if (!av.introducao.texto.includes(crit)) throw new Error('critério literal mudou');
  if (!/8 de 10/.test(av.titulo.texto)) throw new Error('"8 de 10" não está no título do §Quiz');
  const fx = av.faixas_de_placar_script;
  if (fx[0].minimo !== 8 || fx[1].minimo !== 0) throw new Error('faixas do script mudaram');
  const PROVAS = [{
    moduloId: MODULO,
    criterio: crit,
    acertosMinimos: 8,
    total: 10,
    questoes: av.perguntas.map((q, k) => ({
      id: q.id,
      enunciado: editorial(q.enunciado),
      alternativas: q.alternativas.map((a) => editorial(a.texto)),
      correta: q.gabarito.indice,
      explicacao: editorial(q.explicacao),
      fonte: { arquivo: APARATO, campo: `avaliacao.perguntas[${k}]`, linha: q.origem.linha_aprox ?? null },
    })),
    faixas: [
      { min: 8, max: 10, mensagem: editorial(fx[0].mensagem) },
      { min: 0, max: 7, mensagem: editorial(fx[1].mensagem) },
    ],
    faixasFonte: { arquivo: APARATO, campo: 'avaliacao.faixas_de_placar_script', linha: fx[0].linha_aprox ?? null },
    criterioFonte: { arquivo: APARATO, campo: 'avaliacao.introducao', linha: null },
  }];

  const ck = ap.checklist_final;
  const CHECKLISTS = [{
    moduloId: MODULO,
    introducao: editorial(ck.introducao.html),
    itens: ck.itens.map((i, k) => ({ id: i.id, texto: editorial(i.html), fonte: { arquivo: APARATO, campo: `checklist_final.itens[${k}]`, linha: i.origem?.linha_aprox ?? null } })),
  }];

  return { EXERCICIOS_DAS_AULAS, EXERCICIOS_DO_MODULO, PROVAS, CHECKLISTS };
}

export const DADOS = gerar();

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { EXERCICIOS_DAS_AULAS, EXERCICIOS_DO_MODULO, PROVAS, CHECKLISTS } = DADOS;
  const ts = `// Avaliação do M11 (exercícios por aula, prova, checklist). Posse: a sessão de porte do M11.
// GERADO por tools/alexandria-dados/avaliacao/gerar-avaliacao-m11.mjs — não editar à mão.
// Conferido por tools/alexandria-dados/avaliacao/verificar-avaliacao-m11.mjs.
import type { ChecklistDoModulo, ExercicioDaAula, ExercicioDoModulo, ProvaDoModulo } from '../avaliacao';

export const EXERCICIOS_DAS_AULAS: ExercicioDaAula[] = ${JSON.stringify(EXERCICIOS_DAS_AULAS, null, 2)};

/** Exercícios da fonte cujo termo não casa com nenhuma aula (regra de colocação de 15/11). */
export const EXERCICIOS_DO_MODULO: ExercicioDoModulo[] = ${JSON.stringify(EXERCICIOS_DO_MODULO, null, 2)};

export const PROVAS: ProvaDoModulo[] = ${JSON.stringify(PROVAS, null, 2)};

export const CHECKLISTS: ChecklistDoModulo[] = ${JSON.stringify(CHECKLISTS, null, 2)};
`;
  fs.writeFileSync(SAIDA, ts);
  const porAula = {};
  for (const e of EXERCICIOS_DAS_AULAS) porAula[e.aula] = (porAula[e.aula] ?? []).concat(e.origem === 'fonte' ? 'F' : 'D');
  console.log(`escrito ${path.relative(RAIZ, SAIDA)}: ${EXERCICIOS_DAS_AULAS.length} itens por aula ${JSON.stringify(porAula)} · do módulo ${EXERCICIOS_DO_MODULO.map((e) => e.id).join(', ') || 'nenhum'} · prova ${PROVAS[0].questoes.length} · checklist ${CHECKLISTS[0].itens.length}`);
}
