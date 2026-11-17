// Gera src/lib/alexandria/avaliacao/m16.dados.ts (exercícios por aula, prova,
// checklist do Módulo 16). Modelo: tools/alexandria-dados/gerar-avaliacao.mjs (M01).
//
// FONTE. Itens `fonte`, prova e checklist: docs/alexandria-v2/extraction/m16/aparato.json,
// literais. Itens `derivado-da-aula`: pergunta de recuperação cuja resposta é um trecho
// LITERAL da aula (src/lib/data/alexandria-modulo-16-content.ts, conferido contra o
// HTML-fonte por tools/alexandria-dados/porte/verificar-porte-m16.mjs). O gerador para se
// um trecho citado não existir na aula.
//
// AULA DE CADA EXERCÍCIO DA FONTE. A fonte não liga nenhum dos 16 a aula (todos
// `solto_P9`). Cada um vai pela regra do vínculo mecânico (ver ANCORAS), registrada no
// próprio item.
//
// CRITÉRIO. O M16 não tem critério de contagem do drill ("seis dos oito" no M01). O
// único critério do §Ex é o do lede, literal: "O objetivo não é acertar o número — é
// produzir a pergunta correta em menos de um minuto." Vai em `criterio` dos 16 itens
// da fonte; `contaParaCriterioDoDrill` é `false` em todos (não há contagem a que somar).
//
// Uso: node tools/alexandria-dados/avaliacao/gerar-avaliacao-m16.mjs
// Conferência: node tools/alexandria-dados/avaliacao/verificar-avaliacao-m16.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const ARQ_APARATO = 'docs/alexandria-v2/extraction/m16/aparato.json';
const ARQ_CONTEUDO = 'src/lib/data/alexandria-modulo-16-content.ts';
const SAIDA = path.join(RAIZ, 'src/lib/alexandria/avaliacao/m16.dados.ts');
const MOD = 'modulo-16';

const ap = JSON.parse(fs.readFileSync(path.join(RAIZ, ARQ_APARATO), 'utf8'));
const conteudo = await import(pathToFileURL(path.join(RAIZ, ARQ_CONTEUDO)).href);

export const P24 = (s) => String(s).replace(/GridAlpha/g, 'NIVAR');
export const textoPlano = (h) =>
  String(h ?? '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/[\s ]+/g, ' ').trim();

/** Texto de cada bloco da aula N, como o produto entrega. */
export function blocosDaAula(n) {
  const id = `aula-16-${String(n).padStart(2, '0')}`;
  const lead = conteudo.MODULO_16_LEAD[id];
  const out = [];
  if (lead) out.push({ campo: `MODULO_16_LEAD['${id}']`, texto: textoPlano(lead) });
  conteudo.MODULO_16_CORPO[id].forEach((b, i) => {
    const t =
      b.kind === 'titulo' ? `${b.numero ?? ''} ${b.texto}` :
      b.kind === 'formula' ? `${b.eq} ${b.desc ?? ''}` :
      b.kind === 'lista' ? b.itens.join(' ') :
      b.kind === 'tabela' ? b.linhas.flat().join(' ') :
      b.kind === 'nota' ? `${b.label ?? ''} ${b.html}` : b.html;
    out.push({ campo: `MODULO_16_CORPO['${id}'][${i}]`, texto: textoPlano(t) });
  });
  return out;
}

// ── exercícios da fonte → aula: vínculo mecânico ────────────────────────────
// Regra do guia de porte (15/11, "Onde entra o que a fonte não põe em aula"): o
// exercício vai para a ÚLTIMA aula cujo texto contém todas as âncoras; sem casamento,
// fica em EXERCICIOS_DO_MODULO. Toda âncora é um termo LITERAL do próprio enunciado
// (o verificador confere), e o vínculo fica registrado no item (`alertas`).
export const ANCORAS = {
  'm16-ex-01': ['38 GW'],
  'm16-ex-02': ['primeiro leilão'],
  'm16-ex-03': ['em formação'],
  'm16-ex-04': ['jurisdição de relato'],
  'm16-ex-05': ['veículos com tomada'],
  'm16-ex-06': ['armazenamento', 'limitado'],
  'm16-ex-07': ['agregação de recursos distribuídos', '47 GW'],
  'm16-ex-08': ['desafios'],
  'm16-ex-09': ['recarga', 'perdas'],
  'm16-ex-10': ['carregadores', 'coincidência'],
  'm16-ex-11': ['profundidade de descarga', 'eficiência de ciclo'],
  'm16-ex-12': ['centro de dados', 'anuncia'],
  'm16-ex-13': ['frota elétrica'],
  'm16-ex-14': ['escopo 2', 'fator médio'],
  'm16-ex-15': ['elos de captura de valor'],
  'm16-ex-16': ['posicionadas', 'armazenamento'],
};
const contem = (texto, termo) => texto.toLowerCase().includes(termo.toLowerCase());
export function vinculoMecanico(ancoras, nAulas) {
  const casam = [];
  for (let a = 1; a <= nAulas; a++) {
    const t = blocosDaAula(a).map((b) => b.texto).join(' ');
    if (ancoras.length && ancoras.every((f) => contem(t, f))) casam.push(a);
  }
  const lista = ancoras.map((f) => `"${f}"`).join(' e ');
  if (!casam.length) return { aula: null, nota: `Sem vínculo: a fonte não prende este exercício a aula, e ${lista} não aparece no texto de nenhuma aula. Fica nos exercícios do módulo.` };
  const aula = casam[casam.length - 1];
  const onde = casam.length > 1 ? `aparece nas Aulas ${casam.join(', ')}; vai para a última, a ${aula}` : `aparece só na Aula ${aula}`;
  return { aula, nota: `Vínculo mecânico: a fonte não prende este exercício a aula; ${lista} ${onde}.` };
}

const CRITERIO_EX = 'O objetivo não é acertar o número — é produzir a pergunta correta em menos de um minuto.';
if (!textoPlano(ap.exercicios.lede.html).includes(CRITERIO_EX)) throw new Error('critério do §Ex não está no lede');

// Exercício cujo enunciado é o cenário-padrão de um instrumento (medido nos padrões de
// INSTRUMENTOS_MODULO_16; a previsão correspondente abre só depois da tentativa).
const ALERTAS = {
  'm16-ex-12':
    'Cenário igual ao padrão do INST·09 (100 MW de tecnologia da informação, PUE 1,30, fator de carga 90%): a carga média de 117 MW é o calculado do instrumento. O INST·09 não abre nesse cenário antes da tentativa deste exercício.',
  'm16-ex-14':
    'O padrão do INST·08 (120 GWh, fator médio 0,080) escreve no readout "Método de localização" os 9.600 tCO2e da resposta deste exercício. O INST·08 não abre antes da tentativa deste exercício.',
};

// ── derivados da aula ───────────────────────────────────────────────────────
// `evidencia`: trecho literal da aula (texto plano). `resposta` (escolha): a alternativa
// certa precisa aparecer na evidência; as outras, no texto das aulas do módulo.
const DERIVADOS = [
  { aula: 1, tipo: 'escolha', enunciado: 'Segundo a aula, qual destes estados produz o único número que descreve carga?',
    alternativas: ['O anúncio', 'O pedido de acesso', 'A outorga', 'A operação'], gabarito: 3,
    evidencia: 'E a operação produz o único número que descreve carga: o medido.' },
  { aula: 1, tipo: 'aberto', enunciado: 'De onde vem, segundo a aula, a distância entre a soma dos pedidos de acesso e a carga que de fato se materializa?',
    evidencia: 'A distorção não vem de má-fé. Vem de assimetria de custo: protocolar um pedido custa quase nada e energizar custa quase tudo.' },
  { aula: 1, tipo: 'aberto', enunciado: 'Segundo a aula, o que uma queda na fila de pedidos de acesso pode significar, e por quê?',
    evidencia: 'A resposta regulatória típica é exigir garantia vinculada ao pedido, o que converte opção gratuita em opção precificada e reduz o denominador da razão solicitado/energizado sem que a demanda real tenha mudado. Consequência analítica: uma queda na fila de pedidos pode significar aperto de garantia, e não arrefecimento de demanda.' },
  { aula: 2, tipo: 'aberto', enunciado: 'Segundo a aula, quando um candidato a gargalo vincula?',
    evidencia: 'Um candidato vincula quando relaxá-lo, sozinho, altera a trajetória.' },
  { aula: 3, tipo: 'escolha', enunciado: 'Segundo a aula, a eletrificação de transporte é um problema de quê?',
    alternativas: ['Energia nacional', 'Potência local', 'Maturidade tecnológica', 'Regra habilitante'], gabarito: 1,
    evidencia: 'A eletrificação de transporte é um problema de potência local, e não de energia nacional.' },
  { aula: 4, tipo: 'escolha', enunciado: 'Das três grandezas do armazenamento, qual a aula diz que identifica que tipo de ativo é?',
    alternativas: ['Potência', 'Energia', 'Duração'], gabarito: 2,
    evidencia: 'Duração · h — A razão entre as duas. É a grandeza que identifica que tipo de ativo é' },
  { aula: 5, tipo: 'escolha', enunciado: 'Quantos componentes integrados formam o sistema de medição inteligente, na proposta em discussão na agência reguladora?',
    alternativas: ['Dois', 'Três', 'Quatro', 'Cinco'], gabarito: 2,
    evidencia: 'define o sistema de medição inteligente como uma solução formada por quatro componentes integrados: o medidor, a interface de comunicação com o consumidor, o sistema de comunicação de dados e o sistema de gestão de dados.' },
  { aula: 5, tipo: 'escolha', enunciado: 'Segundo a correção de estágio da aula, qual é a posição correta da medição avançada na régua?',
    alternativas: ['Em discussão', 'Regulada e em implantação inicial', 'Arquitetura regulatória em formação'], gabarito: 1,
    evidencia: 'A posição correta na régua é regulada e em implantação inicial' },
  { aula: 5, tipo: 'aberto', enunciado: 'Que contrapartida do lado da demanda a aula diz que precisa acompanhar a medição avançada, e por quê?',
    evidencia: 'A agenda regulatória do biênio prevê tarifa horária obrigatória para consumidores de baixa tensão acima de 1.000 kWh por mês, o que alcança cerca de dois milhóes e meio de unidades consumidoras. Medição sem sinal de preço que varie no tempo não produz flexibilidade — produz um relatório.' },
  { aula: 6, tipo: 'aberto', enunciado: 'Segundo a aula, onde uma microrrede fecha?',
    evidencia: 'Microrrede não é uma tecnologia procurando aplicação — é uma arquitetura que fecha exatamente onde o custo da energia alternativa é muito alto ou o custo da interrupção é muito alto.' },
  { aula: 6, tipo: 'aberto', enunciado: 'Qual é, segundo a aula, a pergunta que separa material de marketing de desenho de mercado num arranjo que copia um rótulo estrangeiro?',
    evidencia: 'se este arranjo usa a rede e paga menos por ela, quem paga a diferença?' },
  { aula: 7, tipo: 'aberto', enunciado: 'Segundo a aula, comprar atributo ambiental contratado reduz a emissão física? O que a compra muda?',
    evidencia: 'Atributo ambiental contratado não é redução física de emissão. Comprar atributo muda o número reportado pelo método de mercado e não muda um grama do que a rede emitiu naquele ano.' },
  { aula: 8, tipo: 'aberto', enunciado: 'Segundo a aula, por que a maior parte da carga de um centro de dados é rígida?',
    evidencia: 'a maior parte da carga de um centro de dados é rígida por contrato, e não por física. O acordo de nível de serviço com o cliente, o desenho de redundância e a exigência de latência são o que a torna rígida.' },
  { aula: 9, tipo: 'escolha', enunciado: 'Segundo a aula, em qual das duas coisas o aprendizado estatístico é muito melhor?',
    alternativas: ['Previsão', 'Decisão'], gabarito: 0,
    evidencia: 'Previsão é estimar o que vai acontecer — carga, vento, irradiação, vazão, preço. Decisão é escolher o que fazer dadas as restrições. São problemas de natureza diferente, e o aprendizado estatístico é muito melhor no primeiro do que no segundo.' },
  { aula: 9, tipo: 'aberto', enunciado: 'Qual é, segundo a aula, a ordem correta antes de treinar um modelo sobre dados de medição?',
    evidencia: 'A ordem correta é sempre a mesma: cadastro de ativo, relógio sincronizado, unidade de medida explícita, sinalizadores de qualidade e de estimativa, proprietário declarado do dado — e só então modelo.' },
  { aula: 9, tipo: 'aberto', enunciado: 'Segundo a aula, por que a cibersegurança entra na conta econômica da digitalização, e não numa nota técnica?',
    evidencia: 'Um sistema que economiza energia mas permite parada de processo, fraude de medição ou comando indevido pode ter valor esperado negativo, e a conta que ignora isso está incompleta por construção.' },
  { aula: 10, tipo: 'aberto', enunciado: 'O que significa, segundo a aula, uma empresa estar “posicionada”?',
    evidencia: '“Posicionada” significa uma coisa específica: possuir ativo, capacidade, dado, cliente, licença, contrato ou competência que reduza o custo de capturar valor naquele elo específico da cadeia — e não significa que a empresa vencerá.' },
];

function localizar(n, trecho) {
  const achado = blocosDaAula(n).find((b) => b.texto.includes(trecho));
  if (!achado) throw new Error(`trecho não está na Aula ${n}: «${trecho.slice(0, 80)}»`);
  return achado.campo;
}

// ── montagem ────────────────────────────────────────────────────────────────
const itens = [];
const soltos = [];
const N_AULAS = conteudo.MODULO_16_AULAS.length;
for (const ex of ap.exercicios.itens) {
  const ancoras = ANCORAS[ex.id];
  if (!ancoras) throw new Error(`${ex.id} sem âncora`);
  for (const f of ancoras) if (!contem(textoPlano(ex.enunciado.html), f)) throw new Error(`${ex.id}: âncora "${f}" não está no enunciado`);
  const { aula, nota } = vinculoMecanico(ancoras, N_AULAS);
  const linha = ex.origem?.linha_aprox ?? null;
  const k = ap.exercicios.itens.indexOf(ex);
  const item = {
    id: ex.id,
    moduloId: MOD,
    aula,
    origem: 'fonte',
    tipo: 'aberto',
    enunciado: P24(ex.enunciado.html),
    gabarito: null,
    referencia: P24(ex.resposta_de_referencia.html),
    criterio: CRITERIO_EX,
    contaParaCriterioDoDrill: false,
    tolerancia: null,
    verificacao: 'autoavaliacao',
    fonte: { arquivo: ARQ_APARATO, campo: `exercicios.itens[${k}].enunciado.texto`, linha },
    evidencias: [
      { arquivo: ARQ_APARATO, campo: `exercicios.itens[${k}].enunciado.texto`, linha, trecho: P24(ex.enunciado.texto) },
      { arquivo: ARQ_APARATO, campo: `exercicios.itens[${k}].resposta_de_referencia.texto`, linha, trecho: P24(ex.resposta_de_referencia.texto) },
    ],
  };
  item.alertas = [nota, ...(ALERTAS[ex.id] ? [ALERTAS[ex.id]] : [])];
  (aula ? itens : soltos).push(item);
}
const contagem = {};
for (const d of DERIVADOS) {
  contagem[d.aula] = (contagem[d.aula] ?? 0) + 1;
  const id = `m16-a${String(d.aula).padStart(2, '0')}-d${String(contagem[d.aula]).padStart(2, '0')}`;
  const campo = localizar(d.aula, d.evidencia);
  const item = {
    id,
    moduloId: MOD,
    aula: d.aula,
    origem: 'derivado-da-aula',
    tipo: d.tipo,
    enunciado: d.enunciado,
    ...(d.tipo === 'escolha' ? { alternativas: d.alternativas, gabarito: d.gabarito } : { gabarito: null }),
    referencia: d.evidencia,
    contaParaCriterioDoDrill: false,
    tolerancia: null,
    verificacao: d.tipo === 'escolha' ? 'alternativa-correta' : 'autoavaliacao',
    fonte: { arquivo: ARQ_CONTEUDO, campo, linha: null },
    evidencias: [{ arquivo: ARQ_CONTEUDO, campo, linha: null, trecho: d.evidencia }],
  };
  itens.push(item);
}
// ordem de leitura: por aula, fonte antes de derivado
itens.sort((a, b) => a.aula - b.aula || (a.origem === b.origem ? 0 : a.origem === 'fonte' ? -1 : 1));

// prova
const q = ap.avaliacao;
const PALAVRAS = { um: 1, dois: 2, três: 3, quatro: 4, cinco: 5, seis: 6, sete: 7, oito: 8, nove: 9, dez: 10 };
const mm = q.criterio_literal.prosa.match(/(\p{L}+) de (\p{L}+)/u);
const acertosMinimos = PALAVRAS[mm[1]];
const total = PALAVRAS[mm[2]];
if (!acertosMinimos || total !== q.perguntas.length) throw new Error('critério da prova não lido');
if (q.criterio_literal.script !== `acertos>=${acertosMinimos}`) throw new Error('prosa e script do critério divergem');
const faixas = q.faixas_de_placar_script.map((f) => {
  const m = f.condicao.match(/acertos(>=|<)(\d+)/);
  const v = Number(m[2]);
  return m[1] === '>=' ? { min: v, max: total, mensagem: P24(f.mensagem) } : { min: 0, max: v - 1, mensagem: P24(f.mensagem) };
}).sort((a, b) => b.min - a.min);
const prova = {
  moduloId: MOD,
  criterio: q.criterio_literal.prosa,
  acertosMinimos,
  total,
  questoes: q.perguntas.map((p, i) => ({
    id: p.id,
    enunciado: P24(p.enunciado),
    alternativas: p.alternativas.map((a) => P24(a.texto)),
    correta: p.gabarito.indice,
    explicacao: P24(p.explicacao),
    fonte: { arquivo: ARQ_APARATO, campo: `avaliacao.perguntas[${i}]`, linha: p.origem?.linha_aprox ?? null },
  })),
  faixas,
  faixasFonte: { arquivo: ARQ_APARATO, campo: 'avaliacao.faixas_de_placar_script', linha: q.faixas_de_placar_script[0].origem?.linha_aprox ?? null },
  criterioFonte: { arquivo: ARQ_APARATO, campo: 'avaliacao.criterio_literal.prosa', linha: q.criterio_literal.origem?.linha_aprox ?? null },
};

// checklist
const ck = ap.checklist_final;
const checklist = {
  moduloId: MOD,
  introducao: P24(ck.titulo.texto),
  itens: ck.itens.map((it, i) => ({
    id: it.id,
    texto: P24(it.texto),
    fonte: { arquivo: ARQ_APARATO, campo: `checklist_final.itens[${i}].texto`, linha: it.origem?.linha_aprox ?? null },
  })),
};

const nFonte = itens.filter((i) => i.origem === 'fonte').length;
const nDer = itens.length - nFonte;
const linhas = [
  '// GERADO por tools/alexandria-dados/avaliacao/gerar-avaliacao-m16.mjs — não editar à mão.',
  '// Fonte: docs/alexandria-v2/extraction/m16/aparato.json (fonte, prova, checklist) e o texto das aulas',
  '// em src/lib/data/alexandria-modulo-16-content.ts (derivados). Posse: a sessão de porte do M16.',
  `// ${itens.length} itens por aula (${nFonte} da fonte, ${nDer} derivados) · ${prova.questoes.length} questões na prova · ${checklist.itens.length} itens no checklist.`,
  '',
  "import type { ChecklistDoModulo, ExercicioDaAula, ExercicioDoModulo, ProvaDoModulo } from '../avaliacao';",
  '',
  `export const EXERCICIOS_DAS_AULAS: ExercicioDaAula[] = ${JSON.stringify(itens, null, 2)};`,
  '',
  '/** Exercícios da fonte sem vínculo mecânico com aula (a aula v3 os mostra na última aula). */',
  `export const EXERCICIOS_DO_MODULO: ExercicioDoModulo[] = ${JSON.stringify(soltos.map((s) => ({ ...s, aula: null })), null, 2)};`,
  '',
  `export const PROVAS: ProvaDoModulo[] = ${JSON.stringify([prova], null, 2)};`,
  '',
  `export const CHECKLISTS: ChecklistDoModulo[] = ${JSON.stringify([checklist], null, 2)};`,
  '',
];
fs.writeFileSync(SAIDA, linhas.join('\n'));
console.log(`m16.dados.ts: ${itens.length} itens (${nFonte} fonte, ${nDer} derivados), prova ${prova.questoes.length}×${prova.questoes[0].alternativas.length}, critério ${acertosMinimos}/${total}, checklist ${checklist.itens.length}.`);
export { DERIVADOS, ALERTAS, CRITERIO_EX };
