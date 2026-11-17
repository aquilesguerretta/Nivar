// Módulo 08 no modelo de aula v3. Posse: a sessão de porte do M08.
//
// Figuras (regra de imagem do Founder): dois diagramas, nenhuma foto. As duas tabelas que ganham
// com o desenho — subsistemas no plano estoque × fluxo (A04) e as cinco datas de Roraima numa linha
// do tempo (A05) — viram figura; o resto já está dito pelas tabelas e pelos instrumentos.
// Componentes em src/components/alexandria/v3/diagramas/m08/. Registro em docs/alexandria-v3/porte/m08.md.
//
// Previsões: cinco, onde há cálculo que aponta a resposta (regras de PORTE-POR-MODULO.md, 15/11).
// Cada uma fica no bloco onde a fonte põe o instrumento, com o cenário padrão dele (ou o cenário
// que a própria aula manda montar). Sem previsão (registro):
//   · Inst 01 — §MAP (percurso e mapa físico), consulta;
//   · Inst 04 — o reconstrutor já É produção antes da correção (as rodadas pedem a estimativa e só
//     corrigem no gesto "Corrigir esta rodada"); uma previsão em cima dele seria redundante;
//   · Inst 05, 07, 09, 11 — exploradores de consulta (fichas, calendário, anatomia do corte,
//     checklist de leitura), sem cálculo que aponte para uma opção.

import type { ModuloV3 } from './tipos';
import type { FiguraDaAula } from '../figuras';
import { DIAGRAMAS_M08 } from '@/components/alexandria/v3/diagramas/m08';

const MOD = 'modulo-08';

function diagrama(id: string, aula: number, ancora: string, componente: keyof typeof DIAGRAMAS_M08, secao: string, alt: string, legenda: string): FiguraDaAula {
  const fonte = `Módulo 08, ${secao}`;
  return { id, moduloId: MOD, aula, classe: 'diagrama', ancora, diagrama: componente, alt, legenda, credito: `diagrama · ${fonte}`, fonte };
}

const figuras: FiguraDaAula[] = [
  diagrama(
    'm08-a04-estoque-contra-fluxo',
    4,
    'm08-a04-junho-2026',
    'EstoqueContraFluxo',
    'Aula 04, tabela por subsistema',
    'Plano com afluência no eixo horizontal e armazenamento no vertical: Sudeste/Centro-Oeste em 93% e 66%, Sul em 82% e 63%, Nordeste em 59% e 89%, Norte em 58% e 95%. Os quatro ficam abaixo da média de longo termo e acima da metade do volume útil.',
    'As duas grandezas não andam juntas: os subsistemas que menos recebem são os que mais guardam.',
  ),
  diagrama(
    'm08-a05-cinco-datas',
    5,
    'm08-a05-cinco-datas',
    'CincoDatasDeRoraima',
    'Aula 05, tabela das datas da interligação',
    'Linha do tempo de setembro de 2025 a janeiro de 2026 com cinco pontos: licença de operação em 3 de setembro, testes de energização em 10 de setembro, interligação física em 16 de setembro, operação comercial em outubro e interligação para fins de comercialização em 1º de janeiro de 2026.',
    'Três datas cabem em duas semanas; a última, a da contabilização, vem quase quatro meses depois.',
  ),
];

const trechos: Record<string, string> = {
  'm08-a04-junho-2026': 'A situação verificada em junho de 2026 é o exemplo perfeito da independência entre as duas grandezas',
  'm08-a05-cinco-datas': 'essa interligação tem cinco datas, todas corretas, para perguntas diferentes',
};

export const MODULO_V3: ModuloV3 = {
  moduloId: MOD,
  pronto: true,
  figuras,
  trechos,
  diagramas: DIAGRAMAS_M08,
  previsoes: [
    {
      // A01 · fim do Eixo 1 (bloco 9), onde a fonte põe o Inst 02. Cenário: a fotografia de 2025 que
      // o instrumento traz.
      instrumentoId: 'm08-inst-02',
      depoisDoBloco: 9,
      cenario: {
        'i2c-hid': 110.2, 'i2f-hid': 41.6,
        'i2c-sol': 64.8, 'i2f-sol': 15.5,
        'i2c-eol': 34.7, 'i2f-eol': 38.3,
        'i2c-bio': 17.5, 'i2f-bio': 41.1,
        'i2c-fos': 31.8, 'i2f-fos': 27.5,
        'i2c-nuc': 2, 'i2f-nuc': 90.4,
      },
      pergunta:
        'Com a fotografia de 2025 (capacidade instalada e fator de capacidade de seis fontes), ordene as fontes pela participação na capacidade e depois pela participação na geração. Quantas fontes trocam de posição entre as duas pizzas?',
      grandeza: { tipo: 'numero', saida: 'i2-trocas', unidade: 'fontes', casas: 0 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 02 (fotografia de 2025)',
    },
    {
      // A01 · fim do Eixo 3 (bloco 21), onde a fonte põe o Inst 03.
      instrumentoId: 'm08-inst-03',
      depoisDoBloco: 21,
      cenario: { 'i3-s': 'hid', 'i3-p': 300, 'i3-e': 1200, 'i3-h': 8760 },
      pergunta: 'Uma hidrelétrica de 300 MW gerou 1.200 GWh num ano de 8.760 horas. Qual foi o fator de capacidade?',
      grandeza: { tipo: 'numero', saida: 'i3-fc', unidade: '%', casas: 1 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 03',
    },
    {
      // A03 · fim de 3.2 (bloco 14), onde a fonte põe o Inst 06. O cenário é o que a aula manda
      // montar logo depois ("Alterne para domingo de sol"), com as cinco fontes ligadas.
      instrumentoId: 'm08-inst-06',
      depoisDoBloco: 14,
      cenario: { 'i6-e': 'dom', 'i6-on-hid': 'sim', 'i6-on-eol': 'sim', 'i6-on-sol': 'sim', 'i6-on-bio': 'sim', 'i6-on-fos': 'sim' },
      pergunta:
        'Domingo de sol, as cinco fontes ligadas. Dos 12 pontos do dia no gráfico, em quantos a soma das fontes passa da carga líquida?',
      grandeza: { tipo: 'numero', saida: 'i6-exc', unidade: 'de 12', casas: 0 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'escala "domingo de sol" do instrumento 06, todas as fontes ligadas',
    },
    {
      // A04 · depois do bloco 7 ("Olhe o Nordeste e o Sudeste/Centro-Oeste lado a lado…"), onde a
      // fonte põe o Inst 08. Cenário: a fotografia do Sudeste/Centro-Oeste, padrão do instrumento.
      instrumentoId: 'm08-inst-08',
      depoisDoBloco: 7,
      cenario: { 'i8-ena': 93, 'i8-ear': 66, 'i8-mes': 6 },
      pergunta:
        'Sudeste/Centro-Oeste em junho: afluência de 93% da média de longo termo e 66% do volume útil armazenado. Em ordem de grandeza, quantos meses de folga esse estoque dá?',
      grandeza: { tipo: 'numero', saida: 'i8-folga', unidade: 'meses', casas: 0 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 08 (Sudeste/Centro-Oeste, junho de 2026)',
    },
    {
      // A06 · depois do bloco 20 (as duas leituras da tabela por classe), onde a fonte põe o Inst 10.
      instrumentoId: 'm08-inst-10',
      depoisDoBloco: 20,
      cenario: { 'i10-c': 120, 'i10-h': 24, 'i10-d': 7, 'i10-t': 40 },
      pergunta:
        'Uma planta consome 120 GWh por ano e opera 24 horas por dia, 7 dias por semana. Qual é o fator de carga anual dela?',
      grandeza: { tipo: 'numero', saida: 'i10-fc', unidade: '%', casas: 1 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 10',
    },
  ],
};
