// Módulo 17 no modelo de aula v3. Posse: a sessão de porte do M17.
//
// PREVISÕES. Regras do cabeçalho de previsoes.ts. O cenário é o padrão do
// instrumento (a instrução e a nota de fonte de cada um declaram os valores de
// partida). A grandeza é uma saída da calculadora (src/lib/data/calculadoras/m17.ts,
// script da fonte executado): um `ro()` do script, nas numéricas; nas por escolha,
// uma saída que a calculadora LÊ do HTML que o script escreveu (`extratores` em
// tools/alexandria-dados/porte/instrumentos-config-m16-m17.mjs). Rótulos das opções,
// literais da fonte. `depoisDoBloco` é o bloco da leitura que precede o instrumento
// no HTML-fonte (medido por tools/alexandria-dados/porte/).
//
// VÉU. O calculado foi procurado em toda a leitura da aula (números com 0 a 3 casas;
// nas de escolha, o rótulo): nenhum bloco o escreve e nenhuma nota o interpreta.
// O M17 não tem figura. `velar` fica vazio por medição.
//
// O §MAP (INST·01) entra na A01 com previsão própria, no fim da leitura.
//
// SEM PREVISÃO (4 de 12), registrados: INST·02 (a resposta do verificador — a
// comparação é inválida, não imprecisa — está na própria prosa que o invoca, 1.1);
// INST·04, 05 e 08 são exploradores de consulta (o painel devolve o desenho, a
// remuneração ou as funções de uma jurisdição; nada aponta uma opção).
import type { ModuloV3 } from './tipos';

export const MODULO_V3: ModuloV3 = {
  moduloId: 'modulo-17',
  pronto: true,
  figuras: [],
  trechos: {},
  diagramas: {},
  previsoes: [
    {
      // A01 · §MAP, no fim da leitura (bloco 6): a fonte o põe fora de aula.
      instrumentoId: 'm17-inst-01',
      depoisDoBloco: 6,
      cenario: {},
      pergunta: 'Reagrupadas pela dimensão preço, em que grupo o mapa põe o Brasil?',
      grandeza: {
        tipo: 'escolha',
        saida: 'i01-grupo-brasil',
        opcoes: [
          { valor: 'nodal', rotulo: 'Nodal por ponto da rede' },
          { valor: 'zonal', rotulo: 'Zonal por área ampla' },
          { valor: 'uniforme', rotulo: 'Uniforme por submercado, valor modelado' },
          { valor: 'administrado', rotulo: 'Administrado, em transição declarada para mercado' },
        ],
      },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 01 (§MAP)',
    },
    {
      // A02 · depois do exemplo estático (bloco 12).
      instrumentoId: 'm17-inst-03',
      depoisDoBloco: 12,
      cenario: {},
      pergunta: 'No par Brasil × meio-atlântico, na dimensão preço, qual parcela vincula a diferença?',
      grandeza: {
        tipo: 'escolha',
        saida: 'i03-vinculante',
        opcoes: [
          { valor: 'dotação', rotulo: 'dotação' },
          { valor: 'desenho', rotulo: 'desenho' },
          { valor: 'política', rotulo: 'política' },
        ],
      },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 03',
    },
    {
      // A05 · depois de "A leitura fácil e por que ela é errada" (bloco 9).
      instrumentoId: 'm17-inst-06',
      depoisDoBloco: 9,
      cenario: { 'i06-p': 325, 'i06-mw': 100, 'i06-fc': 85, 'i06-d': 365 },
      pergunta:
        'Um preço de capacidade de US$ 325/MW-dia, sobre 100 MW de capacidade acreditada, para uma carga com fator de carga de 85%, numa janela de 365 dias. Qual é o equivalente por MWh?',
      grandeza: { tipo: 'numero', saida: 'i06-r-3', unidade: 'US$/MWh', casas: 2 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 06',
    },
    {
      // A06 · fim da aula antes do produto (bloco 7).
      instrumentoId: 'm17-inst-07',
      depoisDoBloco: 7,
      cenario: {},
      pergunta: 'Em 4 de agosto de 2026, em que posição da régua está o ajuste de fronteira em regime definitivo?',
      grandeza: {
        tipo: 'escolha',
        saida: 'i07-posicao',
        opcoes: [
          { valor: 'anunciado', rotulo: 'Anunciado' },
          { valor: 'proposto', rotulo: 'Proposto' },
          { valor: 'aprovado', rotulo: 'Aprovado' },
          { valor: 'regulamentado', rotulo: 'Regulamentado' },
          { valor: 'operacao', rotulo: 'Em operação' },
        ],
      },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 07',
    },
    {
      // A08 · depois de "A leitura operacional é direta e desconfortável" (bloco 10).
      instrumentoId: 'm17-inst-09',
      depoisDoBloco: 10,
      cenario: { 'i09-vol': 100, 'i09-dir': 1.6, 'i09-ind': 0.25 },
      pergunta:
        'Uma exportação de 100 kt/ano de ferro e aço, com intensidade direta de 1,6 tCO₂e/t e intensidade indireta (eletricidade) de 0,25 tCO₂e/t. Qual é a base contabilizada?',
      grandeza: { tipo: 'numero', saida: 'i09-r-1', unidade: 'kt CO₂e', casas: 1 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 09',
      // o veredito do padrão escreve as razões da resposta do Ex·18 (mesma aula)
      abreDepoisDoExercicio: 'm17-ex-18',
    },
    {
      // A09 · depois do terceiro caso (bloco 8).
      instrumentoId: 'm17-inst-10',
      depoisDoBloco: 8,
      cenario: { 'i10-gr': 190, 'i10-gt': 520, 'i10-sx': 45 },
      pergunta:
        'Um sistema gera 520 TWh no ano, 190 TWh deles renováveis, e tem saldo importador líquido de 45 TWh. Tratando a importação como não renovável, qual é a participação renovável na energia consumida líquida?',
      grandeza: { tipo: 'numero', saida: 'i10-r-4', unidade: '%', casas: 1 },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 10',
    },
    {
      // A10 · depois de "A lição de desenho" (bloco 15).
      instrumentoId: 'm17-inst-11',
      depoisDoBloco: 15,
      cenario: { 'i11-ae': 40, 'i11-ar': 45, 'i11-at': 12, 'i11-be': 65, 'i11-br': 20, 'i11-bt': 8 },
      pergunta: 'O consumidor A paga menos que o B pela energia. Na fatura cheia, qual dos dois paga menos?',
      grandeza: {
        tipo: 'escolha',
        saida: 'i11-r-6',
        opcoes: [
          { valor: 'A', rotulo: 'A' },
          { valor: 'B', rotulo: 'B' },
          { valor: 'empate', rotulo: 'empate' },
        ],
      },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 11',
    },
    {
      // A11 · depois da tabela das quatro categorias (bloco 1).
      instrumentoId: 'm17-inst-12',
      depoisDoBloco: 1,
      cenario: {},
      pergunta:
        'Enunciado: “O preço médio de atacado deles foi de €89/MWh no ano passado; o nosso ficou bem abaixo disso.” Qual é o defeito dominante?',
      grandeza: {
        tipo: 'escolha',
        saida: 'i12-defeito',
        opcoes: [
          { valor: 'per', rotulo: 'Perímetro não declarado' },
          { valor: 'atr', rotulo: 'Atribuição errada' },
          { valor: 'ins', rotulo: 'Pressuposto omitido' },
          { valor: 'uni', rotulo: 'Unidade inconsistente' },
        ],
      },
      velar: [],
      velarFiguras: [],
      velarNota: false,
      origemDoCenario: 'valores padrão do instrumento 12',
    },
  ],
};
