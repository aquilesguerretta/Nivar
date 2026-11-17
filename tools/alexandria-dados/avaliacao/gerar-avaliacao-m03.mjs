// Gera src/lib/alexandria/avaliacao/m03.dados.ts — exercícios por aula, prova e
// checklist do M03. Método e regras: montar-avaliacao-m02-m03.mjs (o aparato do M03 é
// lido para a forma do M02 em avaliacao-m02-m03.mjs, normalizarAparato). Conferência:
// node tools/alexandria-dados/avaliacao/verificar-avaliacao-m03.mjs
//
// Dez exercícios na fonte: nove com aula na tag; Ex·10 (Síntese) sem aula, por vínculo
// mecânico. Itens derivados: resposta literal na aula; nenhum usa número do cenário-padrão
// do instrumento da aula nem entrega a resposta de outro item (por isso nenhum derivado da
// A09 cita "o produto leiloado é potência (MW)", que é a resposta (b) do Ex·08).
//
// Uso: node tools/alexandria-dados/avaliacao/gerar-avaliacao-m03.mjs

import { contexto } from './avaliacao-m02-m03.mjs';
import { montarAvaliacao, escreverDados } from './montar-avaliacao-m02-m03.mjs';

// D11 (decisões de 15/11): o distrator D da Q08 perde o número "1,4 GW", que o módulo nunca
// estabelece (o corpo da Aula 08 não dá potência para Angra 3).
export const EDITORIAIS = [['escoar 1,4 GW no Sudeste', 'escoar a energia no Sudeste']];

// "atributos" aparece nas Aulas 08 e 10 → Aula 10.
export const VINCULOS = { 'm03-ex-10': ['atributos'] };

export const ALERTAS = {
  'm03-ex-08': [
    'O enunciado (100 MW / 400 MWh, 88%) é o cenário-padrão do INST·07 (Aula 09): deslocado, consumido e perdido são o calculado do instrumento. O cálculo do INST·07 só abre depois da tentativa deste exercício.',
  ],
  'm03-ex-09': [
    'O enunciado (CAPEX R$ 3.500/kW, O&M R$ 50, FC 27%, 25 anos, WACC 10%) é o cenário-padrão do INST·08 (Aula 10): o LCOE é o calculado do instrumento. O cálculo do INST·08 só abre depois da tentativa deste exercício.',
  ],
  'm03-quiz-q08': ['D11: a alternativa D perdeu o número "1,4 GW", que o módulo nunca estabelece.'],
};

export const ESPECIFICACOES = [
  // ── Aula 01 (fonte: Ex·01, Ex·02) ──
  {
    aula: 1, tipo: 'aberto',
    enunciado: 'Por que a MMGD não aparece como geração nos painéis do ONS, segundo a aula?',
    evidencias: ['a MMGD não aparece como geração nos painéis do ONS — aparece como redução de carga. O telhado da fábrica gera atrás do medidor; o operador enxerga só o líquido.'],
  },
  // ── Aula 02 (fonte: Ex·03) ──
  {
    aula: 2, tipo: 'escolha',
    enunciado: 'Como se chama a medida da "bateria do Brasil", publicada diariamente pelo ONS por subsistema?',
    alternativas: ['ENA', 'EAR', 'CVU', 'GSF'],
    correta: 1,
    evidencias: ['A medida dessa bateria tem nome técnico: EAR — Energia Armazenada, publicada diariamente pelo ONS por subsistema.'],
  },
  {
    aula: 2, tipo: 'aberto',
    enunciado: 'Que caso a aula chama de "trauma formativo" do preço socioambiental dos reservatórios, e por quê?',
    evidencias: ['O trauma formativo tem nome: Balbina (AM, anos 1980) — área gigante alagada para potência pífia, o anti-exemplo citado até hoje.'],
  },
  // ── Aula 03 ──
  {
    aula: 3, tipo: 'aberto',
    enunciado: 'Por que Belo Monte gera, em média, bem menos do que a sua capacidade instalada?',
    evidencias: ['porque o Xingu tem uma das sazonalidades mais brutais do planeta — caudaloso na cheia amazônica, magro na seca.'],
  },
  {
    aula: 3, tipo: 'escolha',
    enunciado: 'Qual hidráulica a aula descreve como a "bateria hidráulica" clássica, que bombeia água morro acima com energia barata?',
    alternativas: ['PCH', 'CGH', 'reversível (UHR)'],
    correta: 2,
    evidencias: ['e a reversível (UHR) — bombeia água morro acima com energia barata para turbinar na hora cara, a "bateria hidráulica" clássica'],
  },
  {
    aula: 3, tipo: 'aberto',
    enunciado: "Para onde migrou a regularização que o sistema perdeu com as hidrelétricas a fio d'água?",
    evidencias: ['A regularização que o sistema perdeu migrou para outros ombros: os reservatórios antigos (cada vez mais exigidos), as térmicas flexíveis (Aula 06), e — a partir do leilão de 2026 — as baterias eletroquímicas (Aula 09).'],
  },
  // ── Aula 04 (fonte: Ex·04) ──
  {
    aula: 4, tipo: 'escolha',
    enunciado: 'Acima de que velocidade do vento (cut-out) a turbina desliga para se proteger, segundo a aula?',
    alternativas: ['~3 m/s', '~12 m/s', '~25 m/s'],
    correta: 2,
    evidencias: ['da nominal ao limite de segurança (cut-out, ~25 m/s) ela entrega potência cheia controlando o ângulo das pás; acima, desliga para se proteger.'],
  },
  {
    aula: 4, tipo: 'aberto',
    enunciado: 'Que complementaridade sazonal a aula descreve entre o vento do Nordeste e os reservatórios do Sudeste?',
    evidencias: ['O vento do NE sopra mais forte no segundo semestre — exatamente a estação seca dos reservatórios do Sudeste. Quando a chuva vai embora, o vento chega.'],
  },
  // ── Aula 05 (fonte: Ex·05) ──
  {
    aula: 5, tipo: 'escolha',
    enunciado: 'Que norma consolidou o marco legal da MMGD, segundo a aula?',
    alternativas: ['Lei 15.097/2025', 'Lei 14.300/2022', 'Portaria Normativa nº 136/2026'],
    correta: 1,
    evidencias: ['a Lei 14.300/2022 consolidou o marco legal'],
  },
  {
    aula: 5, tipo: 'aberto',
    enunciado: 'O que a aula chama de canibalização da solar?',
    evidencias: ['canibalização (cada novo MW solar gera nas mesmas horas dos anteriores e corrói o próprio preço)'],
  },
  // ── Aula 06 (fonte: Ex·06) ──
  {
    aula: 6, tipo: 'escolha',
    enunciado: 'Qual configuração de térmica tem eficiência na casa de 55–60%, segundo a aula?',
    alternativas: ['Ciclo simples (ou aberto)', 'Ciclo combinado', 'Carvão'],
    correta: 1,
    evidencias: ['Ciclo combinado: aproveita o calor de exaustão para gerar vapor e girar uma segunda turbina. Eficiência sobe para 55–60%'],
  },
  {
    aula: 6, tipo: 'aberto',
    enunciado: 'Por que, segundo a aula, flexibilidade não é atributo da turbina?',
    evidencias: ['flexibilidade não é atributo da turbina, é atributo do conjunto máquina + contrato + combustível. Uma turbina ágil presa a um take-or-pay é um atleta de pernas amarradas.'],
  },
  // ── Aula 07 ──
  {
    aula: 7, tipo: 'escolha',
    enunciado: 'Que encargo socializa nacionalmente o sobrecusto do diesel dos sistemas isolados?',
    alternativas: ['ESS', 'CCC', 'GSF'],
    correta: 1,
    evidencias: ['O sobrecusto é socializado nacionalmente pela CCC (Conta de Consumo de Combustíveis)'],
  },
  {
    aula: 7, tipo: 'aberto',
    enunciado: 'Por que a aula diz que a biomassa da cana é complementar à hidrologia?',
    evidencias: ['a safra do Centro-Sul vai de abril a novembro — precisamente a estação seca dos reservatórios. Quando a água some, a cana chega.'],
  },
  {
    aula: 7, tipo: 'aberto',
    enunciado: 'Que paradoxo amazônico a aula descreve?',
    evidencias: ['Eis o paradoxo amazônico: a energia mais cara do país atende as populações de menor renda — e todo consumidor brasileiro ajuda a pagar.'],
  },
  // ── Aula 08 (fonte: Ex·07) ──
  {
    aula: 8, tipo: 'aberto',
    enunciado: 'Por que a Eletronuclear ficou fora da privatização da Eletrobras, segundo a aula?',
    evidencias: ['ficou fora da privatização da Eletrobras por exigência constitucional: a atividade nuclear é monopólio da União'],
  },
  {
    aula: 8, tipo: 'aberto',
    enunciado: 'O que são os SMRs e que problema a aula diz que eles prometem atacar?',
    evidencias: ['Pequenos reatores modulares (SMRs) prometem atacar exatamente o problema do prazo e da escala'],
  },
  // ── Aula 09 (fonte: Ex·08) ──
  {
    aula: 9, tipo: 'escolha',
    enunciado: 'Que vocação a aula atribui a uma bateria com duração de menos de 1 hora?',
    alternativas: ['serviços rápidos', 'pico e arbitragem', 'deslocamento longo'],
    correta: 0,
    evidencias: ['menos de 1 hora, é máquina de serviços rápidos'],
  },
  {
    aula: 9, tipo: 'aberto',
    enunciado: 'Por que a aula diz que a bateria não veio substituir o reservatório?',
    evidencias: ['o reservatório desloca energia entre estações; a bateria, entre horas. A bateria não veio substituir o reservatório — veio substituir a térmica de ponta, o diesel de emergência e o corte de renovável.'],
  },
  // ── Aula 10 (fonte: Ex·09; Ex·10 por vínculo) ──
  {
    aula: 10, tipo: 'aberto',
    enunciado: 'Que conceito sucessor do LCOE a aula apresenta, e o que ele pergunta?',
    evidencias: ['O conceito sucessor — valor de sistema, ou "LCOE ajustado" — pergunta o que cada MWh vale dado quando e onde entra.'],
  },
];

if (process.argv[1] && process.argv[1].endsWith('gerar-avaliacao-m03.mjs')) {
  const ctx = await contexto(3);
  const r = montarAvaliacao(ctx, { especificacoes: ESPECIFICACOES, editoriais: EDITORIAIS, alertas: ALERTAS, vinculos: VINCULOS });
  for (let a = 1; a <= 10; a++) {
    const xs = r.itens.filter((x) => x.aula === a);
    console.log(`  A${String(a).padStart(2, '0')}: ${xs.length} = ${xs.filter((x) => x.origem === 'fonte').length} fonte + ${xs.filter((x) => x.origem !== 'fonte').length} derivado`);
  }
  console.log(`  sem aula: ${r.soltos.map((x) => x.id).join(', ') || '—'} · prova ${r.prova.questoes.length} questões, ${r.prova.faixas.length} faixas, critério ${r.prova.acertosMinimos}/${r.prova.total} · checklist ${r.checklist.itens.length}`);
  console.log(`  trocas: ${JSON.stringify(r.uso)}`);
  if (r.problemas.length) { console.log('PROBLEMAS:'); for (const p of r.problemas) console.log('  - ' + p); process.exit(1); }
  console.log('  gerado: ' + escreverDados(3, r, 'tools/alexandria-dados/avaliacao/gerar-avaliacao-m03.mjs'));
}
