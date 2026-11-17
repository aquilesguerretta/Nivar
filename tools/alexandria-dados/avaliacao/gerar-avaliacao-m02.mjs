// Gera src/lib/alexandria/avaliacao/m02.dados.ts — exercícios por aula, prova e
// checklist do M02. Método e regras: montar-avaliacao-m02-m03.mjs. Conferência:
// node tools/alexandria-dados/avaliacao/verificar-avaliacao-m02.mjs
//
// D07: a fonte tem DEZ exercícios no markup (a prosa do § Ex diz "Oito"). Entram os dez: oito na
// aula que a tag declara; Ex·09 e Ex·10 (tag sem aula) por vínculo mecânico (VINCULOS, abaixo).
//
// Itens derivados: a resposta está literal no texto da aula (`evidencias`). Em `escolha`,
// toda alternativa é termo ou frase que aparece nas aulas do M02. Nenhum derivado usa número
// do cenário-padrão de instrumento da mesma aula, nem entrega a resposta de outro item.
// O Founder delegou os exercícios (15/11/2026); a lista está no relatório.
//
// Uso: node tools/alexandria-dados/avaliacao/gerar-avaliacao-m02.mjs

import { contexto } from './avaliacao-m02-m03.mjs';
import { montarAvaliacao, escreverDados } from './montar-avaliacao-m02-m03.mjs';

// Q03 no texto da fonte: "Summit" é evento interno; sai a referência, sem nada no lugar.
export const EDITORIAIS = [['No Summit, um executivo', 'Um executivo']];

// Vínculo mecânico (guia de porte, 15/11): frase do próprio enunciado; vai para a última aula
// cujo texto a contém. "potência máxima" só aparece na Aula 07; "térmica cara", nas Aulas 05 e 10.
export const VINCULOS = {
  'm02-ex-09': ['potência máxima'],
  'm02-ex-10': ['térmica cara'],
};

export const ALERTAS = {
  'm02-ex-09': [
    'O enunciado (20 MW / 80 MWh) é o cenário-padrão do INST·06 (Aula 07): a resposta (a) é o calculado do instrumento. O cálculo do INST·06 só abre depois da tentativa deste exercício (abreDepoisDoExercicio).',
  ],
};

export const ESPECIFICACOES = [
  // ── Aula 01 ──
  {
    aula: 1, tipo: 'escolha',
    enunciado: 'Segundo a aula, a partir de que tensão uma instalação de transmissão faz parte da Rede Básica?',
    alternativas: ['69 a 138 kV', 'igual ou superior a 230 kV', '13,8 – 34,5 kV', '127 – 440 V'],
    correta: 1,
    evidencias: ['a Rede Básica é o conjunto de instalações de transmissão em tensão igual ou superior a 230 kV'],
  },
  {
    aula: 1, tipo: 'escolha',
    enunciado: 'Quem se conecta abaixo da fronteira dos 230 kV paga qual tarifa, segundo a aula?',
    alternativas: ['TUST', 'TUSD', 'CCC', 'ESS'],
    correta: 1,
    evidencias: ['Quem se conecta abaixo assina com a distribuidora (CUSD) e paga TUSD.'],
  },
  {
    aula: 1, tipo: 'aberto',
    enunciado: 'A aula compara a rede a um sistema de transporte, mas avisa onde a analogia quebra. Onde ela quebra, e para que a aula diz que ela serve?',
    evidencias: ['Carga espera no acostamento; eletricidade não espera em lugar nenhum. Não há pátio, não há estoque, não há "chega amanhã".', 'Use a analogia para explicar a estrutura; nunca para explicar a operação.'],
  },
  // ── Aula 02 (fonte: Ex·01, Ex·02) ──
  {
    aula: 2, tipo: 'escolha',
    enunciado: 'Por que a metade 50 Hz de Itaipu chega ao Brasil por bipolos de corrente contínua?',
    alternativas: ['distância muito longa', 'interligação assíncrona', 'travessias submarinas'],
    correta: 1,
    evidencias: ['Segunda: interligação assíncrona. DC conecta sistemas que não batem na mesma frequência — é exatamente por isso que a metade 50 Hz de Itaipu (lado paraguaio) chega ao Brasil por bipolos DC de ±600 kV até Ibiúna/SP: não há como sincronizar 50 Hz com 60 Hz em AC.'],
  },
  {
    aula: 2, tipo: 'escolha',
    enunciado: 'Dos cinco limites de uma linha, qual a aula chama de "o teto absoluto"?',
    alternativas: ['Térmico', 'De tensão', 'De estabilidade', 'De proteção'],
    correta: 0,
    evidencias: ['Térmico — Corrente alta aquece o condutor; cabo quente dilata, cede em direção ao solo e perde resistência mecânica. É o teto absoluto.'],
  },
  // ── Aula 03 ──
  {
    aula: 3, tipo: 'escolha',
    enunciado: 'Qual equipamento da subestação a aula descreve como o único capaz de interromper corrente de curto-circuito com segurança?',
    alternativas: ['Seccionadora', 'Disjuntor', 'Religador', 'Para-raios'],
    correta: 1,
    evidencias: ['Disjuntor — Abre e fecha o circuito sob carga ou sob falha — É o único equipamento capaz de interromper corrente de curto-circuito com segurança.'],
  },
  {
    aula: 3, tipo: 'aberto',
    enunciado: 'Que cinco qualidades a proteção precisa ter ao mesmo tempo, segundo a aula?',
    evidencias: ['rápida (atua antes do dano se propagar), seletiva (desliga só o trecho necessário), sensível (detecta falhas reais), confiável (atua quando deve — e não atua quando não deve) e coordenada (os dispositivos trabalham na sequência correta).'],
  },
  {
    aula: 3, tipo: 'aberto',
    enunciado: 'O que fica definido no ponto de conexão, segundo a aula?',
    evidencias: ['Nele estão definidos: a tensão de fornecimento (logo, o grupo tarifário), a medição de faturamento — que para agentes do mercado livre segue os requisitos do Sistema de Medição para Faturamento (SMF) da CCEE —, os limites de responsabilidade por qualidade (os indicadores do PRODIST Módulo 8 que você estudou no Módulo 01 valem no ponto de conexão), e a titularidade dos ativos: da fronteira para dentro, transformador, cabine e proteção são do cliente — manutenção, perdas e riscos inclusos.'],
  },
  // ── Aula 04 ──
  {
    aula: 4, tipo: 'aberto',
    enunciado: 'Como a aula define a carga líquida, e por que é ela, e não a carga total, que importa ao operador?',
    evidencias: ['Carga líquida = Carga total − Geração solar − Geração eólica — É a curva líquida que define quanta geração despachável precisa estar pronta'],
  },
  {
    aula: 4, tipo: 'escolha',
    enunciado: 'Na leitura da frequência que a aula propõe, o que indica que falta potência?',
    alternativas: ['Frequência estável', 'frequência caindo', 'frequência subindo'],
    correta: 1,
    evidencias: ['Frequência estável = equilíbrio; frequência caindo = falta potência; frequência subindo = sobra potência.'],
  },
  {
    aula: 4, tipo: 'aberto',
    enunciado: 'Quais recursos a aula lista para vencer a rampa do fim da tarde?',
    evidencias: ['Hidrelétricas flexíveis (a vantagem estrutural brasileira), térmicas flexíveis, baterias (descarregam exatamente nessa janela), resposta da demanda (indústrias que deslocam consumo) e importação entre subsistemas.'],
  },
  // ── Aula 05 (fonte: Ex·03) ──
  {
    aula: 5, tipo: 'escolha',
    enunciado: 'Como a aula chama o custo de atender 1 MWh a mais de carga, hora a hora?',
    alternativas: ['CVU', 'CMO', 'PLD', 'ESS'],
    correta: 1,
    evidencias: ['O resultado da otimização é o CMO — Custo Marginal de Operação: o custo de atender 1 MWh a mais de carga, hora a hora.'],
  },
  {
    aula: 5, tipo: 'escolha',
    enunciado: 'Na cadeia de modelos de otimização, qual faz a programação diária, com resolução horária?',
    alternativas: ['NEWAVE', 'DECOMP', 'DESSEM'],
    correta: 2,
    evidencias: ['DESSEM (programação diária, resolução horária)'],
  },
  {
    aula: 5, tipo: 'aberto',
    enunciado: 'Quando uma usina é despachada fora da ordem de mérito, para onde vai o custo desse desvio, segundo a aula?',
    evidencias: ['Esses desvios custam dinheiro, e esse dinheiro não entra no preço da energia: vira encargo (ESS), rateado entre consumidores.'],
  },
  // ── Aula 06 (fonte: Ex·04) ──
  {
    aula: 6, tipo: 'escolha',
    enunciado: 'Qual etapa da cascata de horizontes transforma a diretriz mensal em programação horária?',
    alternativas: ['PMO · Programa Mensal da Operação', 'PDO · Programa Diário da Operação', 'Tempo real', 'Pós-operação'],
    correta: 1,
    evidencias: ['PDO · Programa Diário da Operação — dia seguinte, por hora — Transforma a diretriz mensal em programação horária'],
  },
  {
    aula: 6, tipo: 'aberto',
    enunciado: 'Segundo a aula, como se dividem os papéis entre o SCADA, o EMS e o operador?',
    evidencias: ['Em resumo: o SCADA enxerga; o EMS pensa; o operador decide.'],
  },
  // ── Aula 07 ──
  {
    aula: 7, tipo: 'escolha',
    enunciado: 'Qual reserva a aula compara ao "jogador aquecido no banco, pronto para entrar agora"?',
    alternativas: ['Girante (spinning)', 'Operativa', 'Fria'],
    correta: 0,
    evidencias: ['Girante (spinning) — Usinas já sincronizadas, girando abaixo da capacidade — segundos — Jogador aquecido no banco, pronto para entrar agora'],
  },
  {
    aula: 7, tipo: 'escolha',
    enunciado: 'Qual serviço ancilar é a capacidade de algumas usinas de partir sem energia externa e energizar a rede do zero após um colapso total?',
    alternativas: ['Controle de frequência', 'Suporte de tensão / reativo', 'Reserva de potência', 'Black start'],
    correta: 3,
    evidencias: ['Black start — A capacidade de algumas usinas de partir sem energia externa e energizar a rede do zero após um colapso total.'],
  },
  {
    aula: 7, tipo: 'aberto',
    enunciado: 'Por que, segundo a aula, solar e eólica aumentam o valor dos serviços ancilares — e por que isso não é argumento contra elas?',
    evidencias: ['Solar e eólica conectadas por inversores trazem variabilidade, menor inércia síncrona e maior dependência de previsão. Isso não é argumento contra renováveis — é argumento a favor de operação moderna'],
  },
  // ── Aula 08 (fonte: Ex·05, Ex·06) ──
  {
    aula: 8, tipo: 'escolha',
    enunciado: 'Qual critério de segurança exige que o sistema suporte a perda de qualquer elemento único relevante sem corte de carga?',
    alternativas: ['N-1', 'ERAC', 'CAG', 'RoCoF'],
    correta: 0,
    evidencias: ['O critério de segurança que governa planejamento e operação é o N-1: o sistema deve suportar a perda de qualquer elemento único relevante — linha, transformador, usina — sem corte de carga nem violação de limites.'],
  },
  {
    aula: 8, tipo: 'aberto',
    enunciado: 'Qual é a lição que a aula tira da noite de Itaipu, em 2009?',
    evidencias: ['Lição: o critério N-1 protege contra falhas simples, não contra modos de falha comuns que derrubam três circuitos do mesmo corredor de uma vez.'],
  },
  // ── Aula 09 ──
  {
    aula: 9, tipo: 'escolha',
    enunciado: 'Onde, segundo a aula, acontece a maior parte das perdas técnicas?',
    alternativas: ['Rede Básica (transmissão)', 'nos níveis baixos de tensão', 'em altíssima tensão'],
    correta: 1,
    evidencias: ['a maior parte acontece nos níveis baixos de tensão, onde a corrente é alta'],
  },
  {
    aula: 9, tipo: 'aberto',
    enunciado: 'Quem paga pela energia perdida dentro do nível regulatório, e o que acontece com o que excede esse nível?',
    evidencias: ['Esse volume de energia perdida é comprado pela distribuidora e repassado à tarifa de todos os consumidores: você paga, todo mês, por energia que nunca chegou a ninguém. O que exceder o nível regulatório sai da margem do acionista — é o incentivo econômico para combater o furto.'],
  },
  {
    aula: 9, tipo: 'aberto',
    enunciado: 'Por que, no mercado livre, o consumidor compra mais energia do que mede no seu ponto?',
    evidencias: ['a contabilização da CCEE aplica fatores de perda da Rede Básica — na prática, o consumidor livre compra cerca de 3% a mais do que mede no seu ponto para cobrir o transporte até ele.'],
  },
  // ── Aula 10 (fonte: Ex·07, Ex·08) ──
  {
    aula: 10, tipo: 'escolha',
    enunciado: 'Quando a restrição está dentro de um submercado, onde vai parar o sobrecusto do redespacho, segundo a aula?',
    alternativas: ['PLD', 'ESS', 'TUST', 'RAP'],
    correta: 1,
    evidencias: ['O sobrecusto do redespacho não aparece em preço nenhum: vira ESS — Encargos de Serviços do Sistema — rateado entre os consumidores na liquidação da CCEE.'],
  },
  {
    aula: 10, tipo: 'escolha',
    enunciado: 'Como as transmissoras recebem a RAP, segundo a aula?',
    alternativas: ['por MWh transportado', 'por disponibilidade', 'por submercado'],
    correta: 1,
    evidencias: ['recebida por disponibilidade: a linha ganha por existir e estar disponível, com desconto (Parcela Variável) quando fica indisponível. A linha não ganha por MWh transportado.'],
  },
];

if (process.argv[1] && process.argv[1].endsWith('gerar-avaliacao-m02.mjs')) {
  const ctx = await contexto(2);
  const r = montarAvaliacao(ctx, { especificacoes: ESPECIFICACOES, editoriais: EDITORIAIS, alertas: ALERTAS, vinculos: VINCULOS });
  for (let a = 1; a <= 10; a++) {
    const xs = r.itens.filter((x) => x.aula === a);
    console.log(`  A${String(a).padStart(2, '0')}: ${xs.length} = ${xs.filter((x) => x.origem === 'fonte').length} fonte + ${xs.filter((x) => x.origem !== 'fonte').length} derivado`);
  }
  console.log(`  sem aula: ${r.soltos.map((x) => x.id).join(', ')} · prova ${r.prova.questoes.length} questões, ${r.prova.faixas.length} faixas, critério ${r.prova.acertosMinimos}/${r.prova.total} · checklist ${r.checklist.itens.length}`);
  console.log(`  trocas: ${JSON.stringify(r.uso)}`);
  if (r.problemas.length) { console.log('PROBLEMAS:'); for (const p of r.problemas) console.log('  - ' + p); process.exit(1); }
  console.log('  gerado: ' + escreverDados(2, r, 'tools/alexandria-dados/avaliacao/gerar-avaliacao-m02.mjs'));
}
