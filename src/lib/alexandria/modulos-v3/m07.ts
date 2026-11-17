// Módulo 07 no modelo de aula v3. Posse: a sessão de porte do M07.
//
// Figuras (regra de imagem do Founder): três diagramas, nenhuma foto (nenhuma foto real com
// procedência aprovada e útil para estas aulas sem busca nova — registrado em
// docs/alexandria-v3/porte/m07.md). Componentes em src/components/alexandria/v3/diagramas/m07/.
//
// Previsões: três, onde há cálculo que aponta a resposta (regras do cabeçalho de
// components/alexandria/v3/aula/previsoes.ts e de PORTE-POR-MODULO.md, 15/11):
//   · Inst 04 e 06 — o regime que a calculadora classifica no cenário padrão, por escolha entre os
//     regimes literais do script;
//   · Inst 08 — o órgão emissor da decisão padrão. A própria fonte pede essa previsão ("responda os
//     seis campos de cabeça, e só então clique"). Opções = os primeiros órgãos emissores distintos do
//     dado da fonte, na ordem do dado (nenhum digitado).
// Os demais (01 §MAP, 02, 03, 05, 07, 09, 10) são fichas de consulta, sem previsão (registro).

import type { ModuloV3 } from './tipos';
import type { FiguraDaAula } from '../figuras';
import { DIAGRAMAS_M07 } from '@/components/alexandria/v3/diagramas/m07';
import { M07_DADOS_DOS_INSTRUMENTOS } from '@/lib/data/alexandria-modulo-07-content';

const MOD = 'modulo-07';

function diagrama(id: string, aula: number, ancora: string, componente: keyof typeof DIAGRAMAS_M07, secao: string, alt: string, legenda: string): FiguraDaAula {
  const fonte = `Módulo 07, ${secao}`;
  return { id, moduloId: MOD, aula, classe: 'diagrama', ancora, diagrama: componente, alt, legenda, credito: `diagrama · ${fonte}`, fonte };
}

const figuras: FiguraDaAula[] = [
  diagrama(
    'm07-a01-mapa-autoridade',
    1,
    'm07-a01-coordenacao',
    'MapaAutoridade',
    'Percurso e mapa institucional (instrumento 01)',
    'Grafo de oito instituições com setas de autoridade: CNPE para MME, diretriz homologada; MME para CMSE, EPE e ANEEL; ANEEL para ONS, CCEE e agentes; ONS e CCEE para os agentes e o mercado.',
    'O fluxo de autoridade do mapa institucional: na fonte, a câmara de comercialização é ponta de linha.',
  ),
  diagrama(
    'm07-a01-mapa-dado',
    1,
    'm07-a01-coordenacao',
    'MapaDado',
    'Percurso e mapa institucional (instrumento 01)',
    'O mesmo grafo com setas de dado: cada instituição publica para os agentes e o mercado, e os agentes informam a ANEEL e a CCEE.',
    'O fluxo de dado do mesmo mapa: aqui a câmara é uma das duas maiores fontes do setor.',
  ),
  diagrama(
    'm07-a02-rito-do-leilao',
    2,
    'm07-a02-cadastramento',
    'RitoDoLeilao',
    'Aula 02, seção 2.3',
    'Sete etapas numeradas em raias por instituição: diretrizes e calendário pelo MME; cadastramento, requisitos e parâmetros pela EPE; edital e sessão pela ANEEL; contrato e operacionalização pela CCEE; informes e reincorporação pela EPE.',
    'A bola muda de mão quatro vezes antes de o leilão terminar.',
  ),
];

const trechos: Record<string, string> = {
  'm07-a01-coordenacao': 'Quando um tema energético trava, com frequência ele não travou no ministério',
  'm07-a02-cadastramento': 'Abertura do cadastramento',
};

const REGIMES_04 = ['Aberto e previsível', 'Aberto com janela estreita', 'Formalmente aberto, praticamente fechado', 'Fechado à contribuição'];
const REGIMES_06 = ['Ciclo curto', 'Ciclo padrão', 'Ciclo longo', 'Ciclo muito longo'];
const ORGAOS_08 = [...new Set(M07_DADOS_DOS_INSTRUMENTOS.i08.map((d) => d.c[0]))].slice(0, 4);

export const MODULO_V3: ModuloV3 = {
  moduloId: MOD,
  pronto: true,
  figuras,
  trechos,
  diagramas: DIAGRAMAS_M07,
  previsoes: [
    {
      // A03 · fim de 3.7 (bloco 32), onde a fonte põe o Inst 04. Regimes literais do script (L2420–2424).
      instrumentoId: 'm07-inst-04',
      depoisDoBloco: 32,
      cenario: { 'i4-a-n': 45, 'i4-b-n': 120, 'i4-c-n': 45, 'i4-d-n': 90, 'i4-e-n': 60, 'i4-f-n': 90 },
      pergunta:
        'Uma norma passa por 45 dias de tomada de subsídios, 120 de minuta e análise de impacto, 45 de consulta pública, 90 de análise das contribuições, 60 de relatoria e deliberação e 90 de vacância até a vigência. Como o rito se classifica?',
      grandeza: { tipo: 'escolha', saida: 'i4-reg', opcoes: REGIMES_04.map((r) => ({ valor: r, rotulo: r })) },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 04',
    },
    {
      // A05 · fim da seção da frase correta (bloco 24). Regimes literais do script (L2548–2551).
      instrumentoId: 'm07-inst-06',
      depoisDoBloco: 24,
      cenario: { 'i6-a-n': 8, 'i6-b-n': 12, 'i6-c-n': 5, 'i6-d-n': 6, 'i6-e-n': 4 },
      pergunta:
        'O fechamento da medição leva 8 dias após o mês, a apuração e prévia 12, a janela de contestação 5, o aporte de garantia 6 e a liquidação financeira 4. Como se classifica o regime de caixa?',
      grandeza: { tipo: 'escolha', saida: 'i6-reg', opcoes: REGIMES_06.map((r) => ({ valor: r, rotulo: r })) },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 06',
    },
    {
      // A07 · depois do bloco 7, onde a fonte põe o Inst 08. A decisão padrão (01, reajuste tarifário
      // anual) é a do Ex·01 (exercício do módulo, nesta aula): o cálculo abre depois da tentativa dele.
      instrumentoId: 'm07-inst-08',
      depoisDoBloco: 7,
      cenario: {},
      pergunta: 'Reajuste tarifário anual de uma distribuidora: qual é o órgão emissor?',
      grandeza: { tipo: 'escolha', saida: 'i8-orgao', opcoes: ORGAOS_08.map((o) => ({ valor: o, rotulo: o })) },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'item padrão do instrumento 08 (Decisão 01)',
      abreDepoisDoExercicio: 'm07-ex-01',
    },
  ],
};
