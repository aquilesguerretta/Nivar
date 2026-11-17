// Módulo 12 no modelo de aula v3. Posse: a sessão de porte do M12.
// Relatório: docs/alexandria-v3/porte/m12.md.
//
// PREVISÕES. Três: duas numéricas (02, 09) e uma por escolha (10, o classificador de
// nome, cujo cálculo aponta uma das sete categorias). Sem previsão, com registro no
// relatório: o 08 (cenário-padrão é o projeto vazio, 0/18 — previsão trivial), o 06 (a
// prosa da Aula 04 já diz que energia foi isentada, que é o cenário-padrão) e os de
// consulta (01, 03, 04, 05, 07, 11), cujo cálculo não aponta uma opção. Todas no
// cenário-padrão do instrumento, com a pergunta montada com rótulo, valor e unidade da fonte.
//
// O VÉU. Nenhum trecho da leitura escreve o calculado das duas previsões (16,5 p.p. no
// INST·02; 4.818× no INST·09): `velar` vazio. As notas dos instrumentos são intro + disc
// da fonte e não interpretam o cenário: `velarNota: false`. Os diagramas não desenham
// cenário de instrumento: `velarFiguras` vazio.
//
// FIGURAS. Dois diagramas de eixo de tempo (regra 3), com as datas da própria aula.
// Nenhuma foto nesta rodada (ver o relatório).

import type { ModuloV3 } from './tipos';
import { DIAGRAMAS_M12 } from '@/components/alexandria/v3/diagramas/m12';
import { MODULO_12_CATEGORIAS_NOME } from '@/lib/data/alexandria-modulo-12-content';

const MOD = 'modulo-12';

export const MODULO_V3: ModuloV3 = {
  moduloId: MOD,
  pronto: true,
  figuras: [
    {
      id: 'm12-a04-duas-politicas',
      moduloId: MOD,
      aula: 4,
      classe: 'diagrama',
      ancora: 'm12-a04-b08-paragrafo',
      diagrama: 'DuasPoliticasAmericanas',
      alt: 'Eixo de tempo de julho de 2025 a dezembro de 2027 com duas faixas: os prazos dos créditos fiscais americanos e as etapas das tarifas sobre produtos brasileiros.',
      legenda: 'As duas políticas americanas da aula no mesmo eixo: a dos créditos fiscais e a das tarifas, cada uma com a sua base jurídica e o seu calendário.',
      credito: 'diagrama · Módulo 12, Aula 04, seções 04.1 e 04.2',
      fonte: 'Módulo 12, Aula 04, seções 04.1 e 04.2',
    },
    {
      id: 'm12-a06-espera-decreto',
      moduloId: MOD,
      aula: 6,
      classe: 'diagrama',
      ancora: 'm12-a06-b06-paragrafo',
      diagrama: 'EsperaPeloDecreto',
      alt: 'Eixo de tempo de agosto de 2024 a setembro de 2026: as duas leis do hidrogênio em 2024 e os anúncios de publicação do decreto, de novembro de 2025 a julho de 2026, sem publicação até a data de verificação.',
      legenda: 'Da sanção das duas leis à data de verificação do módulo: os anúncios de publicação do decreto e nenhuma publicação.',
      credito: 'diagrama · Módulo 12, Aula 06, seções 06.1 e 06.2',
      fonte: 'Módulo 12, Aula 06, seções 06.1 e 06.2',
    },
  ],
  trechos: {
    // 04.2, a cronologia da política comercial (bloco 8 da Aula 04).
    'm12-a04-b08-paragrafo': 'Açúcar e etanol ficaram expostos.',
    // 06.2, a cronologia da espera (bloco 6 da Aula 06).
    'm12-a06-b06-paragrafo': 'A cronologia da espera é, ela própria',
  },
  diagramas: DIAGRAMAS_M12,
  previsoes: [
    {
      // A01 · 01.1 termina em "pergunte qual é o denominador." (bloco 6); o INST·02 vem logo
      // depois na fonte (paragrafo_imediatamente_anterior da extração). Cenário-padrão:
      // 86,8% · 19% · 41% · 50%. A saída prevista é a "Contribuição da eletricidade",
      // que nenhum trecho da aula escreve.
      instrumentoId: 'm12-inst-02',
      depoisDoBloco: 6,
      cenario: { 'sg-el': 86.8, 'sg-pe': 19, 'sg-ne': 41, 'sg-of': 50 },
      pergunta:
        'A eletricidade pesa 19% da energia total, e 86,8% dela é renovável. Quantos pontos percentuais da renovabilidade agregada vêm só da eletricidade?',
      grandeza: { tipo: 'numero', saida: 'sg-co', unidade: 'p.p.', casas: 1 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 02',
    },
    {
      // A07 · fim de 07.3 (bloco 13, o parágrafo do nióbio); o INST·09 vem logo depois na
      // fonte. Cenário-padrão: 21 Mt · 85 Mt · 0,02 kt/ano · 390 kt/ano. A aula diz "cerca de
      // 25%" da reserva e "menos de um centésimo de um por cento" da produção, mas não
      // escreve a razão entre as duas (4.818×), que é a saída prevista.
      instrumentoId: 'm12-inst-09',
      depoisDoBloco: 13,
      cenario: { 'rp-rn': 21, 'rp-rm': 85, 'rp-pn': 0.02, 'rp-pm': 390 },
      pergunta:
        'Um país tem 21 Mt de uma reserva mundial de 85 Mt e produz 0,02 kt/ano de uma produção mundial de 390 kt/ano. Quantas vezes a participação dele na reserva é maior que a participação na produção?',
      grandeza: { tipo: 'numero', saida: 'rp-ra', unidade: '×', casas: 0 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 09',
    },
    {
      // A08 · depois da taxonomia de nomeação (bloco 9, a 6ª categoria); na fonte o INST·10
      // vem logo depois dela. Previsão por escolha: aplicar a taxonomia que acabou de ser
      // lida à entidade do cenário-padrão (e1). O calculado é a classificação da
      // calculadora (`textos['cn-cat']`), casada com o rótulo de uma das sete opções.
      // A Categoria 1 é a resposta do item (c) do Ex·04 (exercício do módulo, nesta mesma
      // aula): o cálculo abre depois da tentativa dele.
      instrumentoId: 'm12-inst-10',
      depoisDoBloco: 9,
      cenario: { 'cn-sel': 'e1' },
      pergunta:
        'Uma estatal estrangeira que controla ativo regulado no Brasil aparece na sua pesquisa. Em que categoria da taxonomia de nomeação ela cai?',
      grandeza: {
        tipo: 'escolha',
        saida: 'cn-cat',
        opcoes: Object.entries(MODULO_12_CATEGORIAS_NOME).map(([valor, c]) => ({ valor, rotulo: c.n })),
      },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valor padrão do instrumento 10',
      abreDepoisDoExercicio: 'm12-ex-04',
    },
  ],
};
