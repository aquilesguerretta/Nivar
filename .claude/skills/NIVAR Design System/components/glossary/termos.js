/** Termos que o sistema declara como não traduzíveis. Ordem alfabética. */
export const TERMOS = [
  {
    termo: 'apuração',
    definicao: 'Fechamento do dado de um ciclo pela fonte oficial. Antes da apuração o valor é preliminar; depois dela é definitivo e datado. Todo número exibido carrega a apuração de que veio.',
    fonte: 'CCEE · ONS',
  },
  {
    termo: 'carga',
    definicao: 'Demanda de energia efetivamente verificada num submercado, em MW médios. É medida, não contratada — não confundir com demanda contratada.',
    fonte: 'ONS · carga verificada',
  },
  {
    termo: 'contraditório',
    definicao: 'Parecer que sustenta a posição oposta à conclusão apresentada. É produzido junto com o parecer principal, não depois dele.',
    fonte: 'NIVAR Advisory',
  },
  {
    termo: 'mercado livre',
    definicao: 'Ambiente de Contratação Livre (ACL), onde o consumidor negocia preço, prazo e fornecedor diretamente. Opõe-se ao mercado cativo, em que a distribuidora define a tarifa.',
    fonte: 'ANEEL · CCEE',
  },
  {
    termo: 'migração',
    definicao: 'Passagem de uma unidade consumidora do mercado cativo para o livre. Exige adesão à CCEE e prazo de denúncia junto à distribuidora.',
    fonte: 'CCEE · adesão',
  },
  {
    termo: 'MWh',
    sigla: 'megawatt-hora',
    definicao: 'Unidade de energia: um megawatt de potência sustentado por uma hora. Preço de energia é sempre por MWh; potência contratada é em MW. Os dois não se somam.',
  },
  {
    termo: 'PLD',
    sigla: 'preço de liquidação das diferenças',
    definicao: 'Preço horário que liquida a energia não coberta por contrato, por submercado. Não é o preço que o consumidor paga — é o preço da diferença entre o contratado e o verificado.',
    fonte: 'CCEE · apuração horária',
  },
  {
    termo: 'submercado',
    definicao: 'Recorte geográfico do SIN com preço próprio: Sudeste/Centro-Oeste, Sul, Nordeste e Norte. A divisão existe porque a transmissão entre regiões tem limite físico.',
    fonte: 'ONS · SIN',
  },
];
