// Calculadoras novas ou corrigidas do M13 (porte verbatim do script da fonte).
// Posse: a sessão de porte do M13. Uma chave aqui SUBSTITUI a de mesmo id em
// INSTRUMENT_CALCULATORS — é assim que um conserto (Q05/Q07) entra sem editar o arquivo grande.
//
// ══════════════════════════════════════════════════════════════════
// MÓDULO 13 — Análise Financeira de Empresas e Projetos
//
// Fonte (só leitura): `Alexandria modulos/alexandria_modulo13.html`, script
// L3379–4144, um bloco /* INST·NN */ por instrumento. Especificação linha a
// linha: `docs/alexandria-v2/extraction/m13/instrumentos.{json,md}`.
// Conferido por `tools/alexandria-dados/porte/verificar-instrumentos-m13.mjs`,
// que roda o script ORIGINAL em DOM simulado ao lado destas funções.
//
// Os dados tabulares (`var LENTES`, `var EMP`, `var ETAPAS`, `var CASOS`,
// `var ARQ`, `var R`, `var E`, `var NOTA`, `var TIT`, `var A`, `var ORDEM`,
// `var ROT`) foram copiados do script POR PROGRAMA, caractere a caractere —
// inclusive o `<b>` interno. A única alteração está marcada no lugar (Q04).
//
// Helpers replicados com o comportamento do original:
//   numOf(el, def, a, b) → `numOf` — vazio ou NaN vira o PADRÃO, e só então
//                          é preso em [a,b] por `clamp`.
//   fmt(n, d)            → `fmt`   — pt-BR, casas fixas, `—` para NaN/Infinity.
//
// Saída: os números que a fonte mostra como número vão em `valores`, com o
// id do readout da fonte. Tudo o que a fonte escreve como TEXTO — o veredito
// (Q06) e as leituras que viram texto num ramo ("n.d.", "prejuízo de…",
// "já abaixo do mínimo", "indefinido: crescimento ≥ taxa") — vai em
// `veredito`, em texto puro: o `InstrumentoV3` mostra o veredito como um
// parágrafo só, sem HTML. Por isso o `<b>` dos dados sai na hora de compor
// (`semTags`), e cada bloco rotulado da fonte (`<b>Rótulo</b>texto`) vira
// "Rótulo: texto".
//
// Q07 (defeito de script). Medido no espaço inteiro de entrada pelo
// verificador: nenhum ramo morto nos três instrumentos numéricos, nenhum
// campo vazio que valha 1 (o `numOf` devolve o padrão), faixas gêmeas
// number/range coerentes nos 22 campos. O único resíduo é de evento: na
// fonte, campo vazio vale o PADRÃO durante a digitação (`input`, via
// `numOf`) e o MÍNIMO ao sair do campo (`change`, via `pair`) — o mesmo
// campo com dois valores. Aqui só existe o primeiro: campo ausente ou
// vazio vale o padrão do script, sempre.
// ══════════════════════════════════════════════════════════════════
import type { CalculateFn, EntradaInstrumento } from '../alexandria-instrument-calculators';

type Entrada = EntradaInstrumento | undefined;

/** `clamp` da fonte: NaN vira o mínimo. */
const clamp = (v: number, a: number, b: number): number => (Number.isNaN(v) ? a : v < a ? a : v > b ? b : v);

/** `numOf` da fonte: vazio ou não-numérico vira o padrão; depois, clamp. */
const numOf = (v: Entrada, def: number, a: number, b: number): number => {
  if (v === undefined || v === '') return def;
  const x = typeof v === 'number' ? v : parseFloat(String(v).replace(',', '.'));
  if (Number.isNaN(x)) return def;
  return clamp(x, a, b);
};

/** `fmt` da fonte. */
const fmt = (n: number, d?: number): string => {
  if (Number.isNaN(n) || !Number.isFinite(n)) return '—';
  return n.toLocaleString('pt-BR', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 });
};

/** Valor de seleção: chave conhecida, ou o padrão do script. Na fonte uma
 *  chave desconhecida não existe (os botões só emitem chaves da lista). */
const umDe = <T extends string>(v: Entrada, validos: readonly T[], def: T): T =>
  (validos as readonly string[]).includes(String(v)) ? (String(v) as T) : def;

/** Texto puro a partir do HTML curto dos dados (só `<b>` na fonte). */
const semTags = (h: string): string => h.replace(/<[^>]*>/g, '');

/** Fecha uma frase de bloco: rótulos da fonte não têm ponto final. */
const fim = (t: string): string => (/[.?!:]$/.test(t) ? t : `${t}.`);

/** Bloco rotulado da fonte (`<b>Rótulo</b>texto`) em texto puro. */
const rotulado = (rotulo: string, texto: string): string => `${rotulo}: ${texto}`;

// ── Dados do script, literais ──────────────────────────────────

// INST·01 — `var LENTES` (L3382)
export const M13_LENTES: Record<'ctrl' | 'cap' | 'lac', string> = {
    ctrl:'A lente de controle pergunta quem decide, de fato, quando a decisão é difícil. Ela não se resolve com a tabela de participação: exige verificar composição por classe de ação, acordo de acionistas arquivado, limitação estatutária de voto, exigência setorial de controle obrigatório e decisões judiciais ou termos de conciliação que alterem composição de conselho. Os cinco juntos formam o mapa real; nenhum deles isolado é suficiente, e o único que costuma ser citado — a participação — é o menos informativo quando as classes divergem.',
    cap:'A lente de capital pergunta como a dívida e o capital próprio estão desenhados. Moeda de indexação, prazo médio, cronograma de vencimentos, garantias, covenants, e se o financiamento é corporativo — num balanço único — ou de projeto, em sociedade isolada com restrição de distribuição. Duas companhias com a mesma razão dívida líquida sobre resultado operacional podem carregar riscos incomparáveis se o desenho for diferente, e a razão sozinha não mostra nada disso.',
    lac:'A lente de lacuna pergunta o que o documento não diz e que a conclusão exige. Garantia constituída sem detalhamento de ativo e valor; contingência classificada como possível sem montante em nota; transação com parte relacionada sem preço de referência demonstrado; covenant mencionado sem definição; vencimento próximo sem plano de refinanciamento declarado; caixa consolidado sem indicação de quanto é livre para transitar até a holding. A saída é sempre uma pergunta formulável, nunca uma acusação.'
  };

export interface M13EmpresaPainel {
  k: string; n: string; arq: string; seg: string; ev: string;
  ctrl: string; cap: string; lac: string;
}
// INST·01 — `var EMP` (L3387)
export const M13_PAINEL_EMPRESAS: M13EmpresaPainel[] = [
    {k:'axia',n:'AXIA Energia',arq:'Estatal com voto limitado',seg:'Geração e transmissão',ev:'Mar 2026',
      ctrl:'Companhia sem controlador único desde a capitalização e privatização de 2022. A União mantém participação relevante no capital total, com direitos de voto <b>estatutariamente limitados a um teto</b>. Termo de conciliação homologado pelo Supremo Tribunal Federal ao fim de 2025 ampliou o conselho de administração de sete para dez membros, com três indicações da União — restaurando influência por via contratual e judicial, não por voto em assembleia. Participação econômica, poder de voto e assentos de conselho são <b>três grandezas distintas</b> aqui, e as três importam.',
      cap:'Dívida líquida ajustada de aproximadamente R$ 46,0 bilhões no 1T26, com prazo médio superior a quatro anos e meio e custo médio referenciado ao certificado de depósito interbancário. Alavancagem divulgada de 1,8 vez por resultado regulatório ajustado e cerca de 1,9 vez por resultado societário dos últimos doze meses — os dois corretos, medindo denominadores diferentes. Saldo relevante de empréstimos compulsórios permanece como passivo de natureza própria, distinto de dívida financeira contratada.',
      lac:'O que a divulgação não fecha sozinha: qual parcela do resultado operacional é comparável entre períodos depois dos ajustes da administração; qual o caixa livre efetivo depois de investimento e distribuição; como evolui a exposição contratada contra a exposição a preço de curto prazo ao longo dos próximos anos; e quais ativos do portfólio têm prazo, renovação ou indenização relevantes no horizonte de modelagem.'},
    {k:'cemig',n:'Cemig',arq:'Estatal subnacional',seg:'Integrada',ev:'Ciclo tarifário',
      ctrl:'Controlada pelo Governo do Estado de Minas Gerais, com capital dividido entre ações ordinárias e preferenciais. O controle é exercido pelo capital votante, e a participação econômica do controlador no capital total é <b>menor</b> que sua fatia do votante — o inverso exato do caso da operadora nuclear. O arquétipo estatal subnacional carrega um vetor que nenhum outro tem: o calendário eleitoral do controlador, que não coincide com o ciclo de maturação de investimento em rede.',
      cap:'Alavancagem ajustada reportada em torno de 2,3 vezes ao fim de 2025. Perfil de dívida predominantemente doméstico e indexado a índices locais, o que reduz exposição cambial direta e cria descasamento potencial entre o indexador da receita regulada e o indexador da dívida. Estrutura de holding com subsidiárias operacionais separadas: a alavancagem da holding e a de cada operacional divergem e precisam ser lidas separadamente.',
      lac:'O que perguntar: qual o retorno esperado do plano de investimento por subsidiária, e não apenas consolidado; como se separam os resultados de distribuição, geração e transmissão, e de gás; qual a política de capital e de distribuição sob cenários distintos de necessidade fiscal do controlador; e quanto do caixa de cada subsidiária é livre para transitar até a holding.'},
    {k:'engie',n:'ENGIE Brasil Energia',arq:'Controlador estrangeiro privado majoritário',seg:'Geração e transmissão',ev:'Jul 2026',
      ctrl:'Controlada pelo grupo francês Engie por meio de holding brasileira. Capital composto exclusivamente por ações ordinárias, o que torna participação econômica e poder de voto <b>coincidentes</b> — e isso é informação, não ausência dela: significa que o controle se lê diretamente da tabela de participação, sem camadas adicionais. O arquétipo de controlador estrangeiro implica que o Brasil compete por capital com outras geografias do mesmo grupo.',
      cap:'Perfil historicamente conservador para o setor, com dívida majoritariamente doméstica e indexada a índices locais. A oferta primária encerrada em 20 de julho de 2026 — 274.082.684 ações a R$ 30,50, totalizando cerca de R$ 8,36 bilhões — alterou materialmente a estrutura. Cerca de R$ 5,74 bilhões foram subscritos pela própria controladora, integralizados com ações de ativo hidrelétrico em vez de dinheiro. <b>Qualquer múltiplo anterior a julho de 2026 descreve um perímetro que não existe mais.</b>',
      lac:'A lacuna mais material é a de <b>transação com parte relacionada</b>: o valor atribuído ao ativo adquirido do controlador está divulgado, mas o referencial de mercado que o sustenta — laudo independente, metodologia, faixa de valor produzida e posição de comitê independente — é o que a conclusão exige. Dois acionistas relevantes votaram contra na assembleia, o que não prova nada sobre o preço e sinaliza que a lacuna foi percebida por outros.'},
    {k:'auren',n:'Auren Energia',arq:'Patrocinador financeiro',seg:'Geração e comercialização',ev:'Integração',
      ctrl:'Controle compartilhado entre um grupo industrial brasileiro e um fundo de pensão canadense, em estrutura de acionistas de referência sem controlador único clássico. O arquétipo de patrocinador financeiro implica horizonte de retorno definido e pressão por eventos de liquidez — venda de ativos, reciclagem de portfólio, combinações de negócios — que podem não coincidir com o ciclo de maturação dos ativos.',
      cap:'Alavancagem elevada no 1T26, em torno de 5,2 vezes, com dívida bruta de cerca de R$ 24,5 bilhões ao fim de 2025, prazo médio próximo de sete anos e parcela majoritária indexada a índice de preços. Perfil longo é proteção contra risco de refinanciamento imediato e não resolve o nível absoluto de alavancagem, que é a variável central da tese desta companhia.',
      lac:'O que perguntar: quanto das sinergias declaradas na combinação de negócios se converteu efetivamente em caixa, e não apenas em resultado contábil; qual o caixa livre antes e depois do investimento de crescimento; e quais ativos podem ser monetizados sem reduzir capacidade contratada — porque vender ativo com energia já vendida transfere obrigação sem transferir receita.'},
    {k:'eqtl',n:'Equatorial Energia',arq:'Corporação sem controlador definido',seg:'Multi-utility',ev:'Expansão',
      ctrl:'Não há acionista controlador. Capital pulverizado entre investidores institucionais nacionais e estrangeiros, com apenas ações ordinárias. As decisões estratégicas cabem à administração sob supervisão de conselho eleito por esse capital disperso. É o arquétipo mais raro do rol brasileiro, e o único em que a governança formal — estatuto, competências, quóruns qualificados — deixa de ser formalidade e passa a ser o único freio real.',
      cap:'Dívida líquida de cerca de R$ 44,3 bilhões no 1T26, com alavancagem de covenant de cerca de 2,7 vezes. A dívida está distribuída entre a holding e múltiplas subsidiárias e sociedades de projeto, o que torna a pergunta sobre caixa restrito especialmente material: o número consolidado pode ser muito maior que a liquidez efetivamente disponível onde o vencimento está.',
      lac:'Três lacunas típicas deste perfil: qual o retorno incremental por concessão adquirida, raramente divulgado de forma isolada; quanto de caixa fica retido em cada subsidiária por restrição contratual; e como se separam equivalência patrimonial de participações societárias e resultado operacional consolidado, já que as duas contribuições têm naturezas e riscos distintos.'},
    {k:'neo',n:'Neoenergia',arq:'Controlador estrangeiro privado majoritário',seg:'Redes reguladas',ev:'Mai 2026',
      ctrl:'Controlada pela Iberdrola, que consumou o fechamento de capital em maio de 2026: elevação de participação em setembro de 2025 com a compra da fatia de um fundo de pensão, oferta pública de aquisição com leilão em 9 de abril de 2026, e resgate compulsório das 24.255.394 ações remanescentes a R$ 34,02, aprovado em 4 de maio e pago em 15 de maio de 2026. Saída do segmento especial de listagem e migração de categoria de registro de emissor.',
      cap:'Companhia de rede regulada com ciclo pesado de investimento e alavancagem em torno de 3,5 vezes no 2T26, sobre base de remuneração regulatória de cerca de R$ 47,3 bilhões. Com o capital fechado, <b>a lente de capital passa a ser a única lente financeira disponível</b>: alavancagem, cobertura de juros, cronograma de vencimentos e covenants continuam sendo divulgados enquanto houver registro de emissor voltado a dívida.',
      lac:'A lacuna estrutural desta ficha é de outra natureza: com o capital fechado, o escopo da informação periódica se reduz conforme a categoria de registro. A pergunta correta deixa de ser o que a companhia não disse e passa a ser <b>o que ela ainda é obrigada a dizer</b>, e por quanto tempo — o que define se ela continua analisável como contraparte de crédito.'},
    {k:'enev',n:'Eneva',arq:'Patrocinador financeiro',seg:'Gás e geração térmica',ev:'Expansão',
      ctrl:'Companhia sem acionista controlador majoritário. O maior acionista é um banco de investimento brasileiro, com participação relevante e influência de governança, num capital que permanece disperso. Maior acionista não é o mesmo que controlador: a pergunta de verificação é se existe acordo de acionistas arquivado que agregue votos de mais de um sócio, o que converteria participações isoladas em bloco de controle.',
      cap:'Alavancagem reportada em torno de 2,6 vezes ao fim de 2025, com componente relevante de instrumentos incentivados de infraestrutura associados a projetos específicos. É a companhia do rol em que a pergunta sobre caixa restrito por sociedade de projeto é mais direta, porque o modelo de negócio se organiza por complexos com financiamento dedicado. Investimento trimestral superior ao resultado operacional trimestral no 1T26: perfil de companhia em construção.',
      lac:'O que perguntar: qual o valor atribuído por reserva de gás e por contrato de capacidade, separadamente; qual o investimento remanescente e a contingência orçamentária dos projetos em construção; e como se separa resultado de despacho conjuntural — que depende de decisão do operador do sistema — de receita fixa contratada, porque só a segunda é previsível.'},
    {k:'cpfl',n:'CPFL Energia',arq:'Controlador estrangeiro privado majoritário',seg:'Distribuição, geração e transmissão',ev:'Ciclo de investimento',
      ctrl:'Controlada pela <b>State Grid Corporation of China</b>, por meio de holding brasileira, com participação majoritária nas ações ordinárias. O Módulo 12 descreveu esta companhia apenas pela estrutura de capital, sem nomeá-la, porque o nome estava reservado para este bloco. Nota de precisão que aquele módulo já registrou: a controladora é a State Grid, e não a China Three Gorges — são duas estatais chinesas diferentes, com focos setoriais distintos, e a confusão entre elas circula em material de mercado.',
      cap:'Alavancagem de cerca de 2,3 vezes no 1T26, com dívida líquida de cerca de R$ 30,6 bilhões. Ciclo pesado de investimento em curso, com plano plurianual declarado para 2026-2030 — o que torna a pergunta sobre reconhecimento regulatório do investimento a variável central da estrutura de capital, e não uma questão de detalhe operacional.',
      lac:'O que perguntar: qual o retorno incremental sobre o capital do plano de investimento, e quanto dele é manutenção contra expansão; como evoluem a distribuição de resultado e a liquidez ao longo do ciclo; e como o controlador estrangeiro trata a competição interna por capital entre geografias do grupo, que é a variável de alocação que nenhum indicador local captura.'},
    {k:'vibra',n:'Vibra Energia',arq:'Corporação sem controlador definido',seg:'Distribuição de combustíveis',ev:'Integração',
      ctrl:'Capital pulverizado, sem acionista controlador. A companhia é historicamente o braço de distribuição de combustíveis vendido pela estatal de petróleo — frase de ponte factual; a estrutura da estatal e o regime do pré-sal pertencem integralmente ao Bloco 15 e não são desenvolvidos aqui. Adquiriu integralmente, em janeiro de 2025, uma plataforma de comercialização e gestão de energia, ampliando o perímetro para além de combustíveis líquidos.',
      cap:'Alavancagem reduzida a cerca de 2,0 vezes no 1T26. O desafio estrutural de crédito desta companhia é distinto do das demais: <b>capital de giro</b>. Distribuição de combustíveis opera com volume alto, margem unitária estreita e necessidade permanente de financiar estoque e recebível — o que torna a variação de capital de giro, e não o investimento, o principal consumidor de caixa.',
      lac:'O que perguntar: quanto do resultado operacional é recorrente contra efeito de choque de suprimento ou de preço; qual a necessidade normal de capital de giro num ciclo estabilizado, para separar caixa gerado de caixa liberado por redução de estoque; e qual o retorno sobre o capital investido nos negócios adjacentes de energia, que têm intensidade de capital diferente da distribuição de combustíveis.'},
    {k:'raiz',n:'Raízen',arq:'Associação com dois controladores coordenados',seg:'Bioenergia e combustíveis',ev:'30 jul 2026',
      ctrl:'Associação entre um grupo brasileiro de capital aberto e uma companhia integrada global de energia, em estrutura que exige convergência entre os dois para decisões relevantes. Nenhum dos dois decide sozinho — e é exatamente esse desenho que se torna crítico quando a decisão é aportar capital novo. Os passos declarados após a homologação incluem aumento de capital e conversão de créditos em títulos representativos de capital, o que pode <b>alterar a estrutura de controle</b>. Reverificação obrigatória.',
      cap:'É a única ficha do rol em que a estrutura de capital é o objeto, e não o contexto. Dívida quirografária sujeita de aproximadamente R$ 65,1 bilhões no ajuizamento, mais cerca de R$ 33,5 bilhões em obrigações entre empresas do grupo, subordinadas às dívidas externas na ordem de pagamento fixada na sentença. Reperfilamento efetivo de cerca de R$ 61,4 bilhões, vinculante para a totalidade dos credores sujeitos após a homologação de 30 de julho de 2026.',
      lac:'O que perguntar: qual o caixa normalizado por segmento depois da segregação anunciada entre distribuição de combustíveis e energia; quais ativos estão livres para alienação e quais estão onerados; qual o cronograma de vencimentos pós-reestruturação; e qual o investimento mínimo que preserva a capacidade produtiva — porque cortar investimento é a alavanca de liquidez mais rápida e a mais destrutiva no médio prazo.'}
  ];

// INST·01 — `var ORD` (L3429)
export const M13_PAINEL_ORDEM: Record<'arq' | 'seg' | 'ev', string[]> = {
    arq:['axia','cemig','engie','neo','cpfl','enev','auren','eqtl','vibra','raiz'],
    seg:['axia','engie','auren','enev','cemig','cpfl','neo','eqtl','vibra','raiz'],
    ev:['raiz','engie','neo','axia','cemig','auren','eqtl','enev','cpfl','vibra']
  };

// INST·01 — literais de `renderLente()`/`renderItem()` (L3437–3460)
export const M13_PAINEL_TITULO_LENTE: Record<'ctrl' | 'cap' | 'lac', string> = { ctrl: 'Lente de controle', cap: 'Lente de capital', lac: 'Lente de lacuna' };
export const M13_PAINEL_ROTULO_LENTE: Record<'ctrl' | 'cap' | 'lac', string> = { ctrl: 'Controle', cap: 'Capital', lac: 'Lacuna' };
export const M13_PAINEL_PERGUNTA: Record<'ctrl' | 'cap' | 'lac', string> = {
  ctrl: 'Participação econômica é igual a poder de voto neste caso? E existe acordo de acionistas, limitação estatutária ou decisão judicial que altere a resposta?',
  cap: 'Qual a definição de dívida líquida e de resultado operacional usada, e quanto do caixa consolidado é livre para transitar até a holding?',
  lac: 'Qual pergunta específica eu faria à área de relações com investidores, e como a resposta mudaria a minha conclusão?',
};
/** Rótulos dos botões de `#pn-ord` (markup L833–836). */
export const M13_PAINEL_ROTULO_ORDEM: Record<'arq' | 'seg' | 'ev', string> = { arq: 'Arquétipo de controle', seg: 'Segmento', ev: 'Evento mais recente' };

export interface M13Etapa { k: string; n: string; y: string; b: string; q: string }
// INST·04 — `var ETAPAS` (L3594)
export const M13_ETAPAS_LEITURA: Record<'rel' | 'fre', M13Etapa[]> = {
    rel:[
      {k:'r1',n:'Perímetro e contexto',y:'0-3 min',
       b:'Data, trimestre, moeda, escopo de consolidação e — o item que quase todo mundo pula — <b>mudanças de perímetro desde o período comparativo</b>. Uma aquisição, uma alienação ou a entrada em operação de um ativo relevante tornam a comparação anual inválida sem ajuste.',
       q:'Este trimestre é comparável ao mesmo trimestre do ano anterior? Se não, o que mudou?'},
      {k:'r2',n:'Ponte operacional',y:'3-7 min',
       b:'Volume, disponibilidade, mercado atendido, perdas, energia vendida, margens unitárias e eventos físicos do período. É a camada em que o resultado financeiro se explica por algo que aconteceu no mundo real, e não por reclassificação contábil.',
       q:'O que aconteceu fisicamente no trimestre que explica a variação do resultado?'},
      {k:'r3',n:'Resultado e ajustes',y:'7-12 min',
       b:'Receita, resultado operacional reportado, resultado operacional ajustado, resultado antes de juros e impostos, lucro, e a <b>reconciliação entre o reportado e o ajustado</b>. Se a reconciliação não existir ou não fechar, a linha ajustada não é utilizável.',
       q:'Qual rótulo de resultado operacional estou lendo, e a reconciliação com o número auditado fecha?'},
      {k:'r4',n:'Caixa',y:'12-17 min',
       b:'Caixa operacional, investimento com abertura entre manutenção e expansão, impostos pagos, juros, aquisições e distribuição. Reconstrua a ponte à mão: resultado operacional menos variação de capital de giro, menos impostos pagos, menos investimento.',
       q:'Quanto do resultado operacional divulgado virou caixa, e o que consumiu a diferença?'},
      {k:'r5',n:'Dívida',y:'17-22 min',
       b:'Dívida líquida com a definição declarada, alavancagem com o denominador declarado, cronograma de vencimentos, indexadores, custo médio, liquidez e covenants. O cronograma é o dado que mais importa e o menos citado em apresentação.',
       q:'Qual é o maior vencimento dos próximos vinte e quatro meses, e existe plano de refinanciamento declarado?'},
      {k:'r6',n:'Investimento e projeções',y:'22-26 min',
       b:'Execução contra plano, atrasos, licenças, orçamento, retorno esperado e forma de financiamento. Projeção divulgada é estimativa condicionada, não compromisso — e a distância entre executado e planejado é um indicador de qualidade de gestão.',
       q:'O investimento executado está no ritmo do plano, e o que financia o que falta?'},
      {k:'r7',n:'Perguntas',y:'26-30 min',
       b:'Três motores, três riscos, três lacunas — e, principalmente, <b>divergências entre a narrativa da apresentação e os números das tabelas</b>. Quando o texto destaca um percentual e a tabela mostra outra base, a divergência é o achado.',
       q:'O que a apresentação enfatiza que os números não sustentam, e vice-versa?'}
    ],
    fre:[
      {k:'f1',n:'Identificação e versão',y:'0-5 min',
       b:'Data da versão, responsáveis pelo conteúdo, e perímetro do emissor. O documento é vivo: versões são atualizadas após aquisição, emissão ou mudança relevante de risco, e ler uma versão antiga é o erro mais fácil e mais silencioso.',
       q:'Esta é a versão mais recente, e o que mudou em relação à anterior?'},
      {k:'f2',n:'Atividades e segmentos',y:'5-15 min',
       b:'Como a companhia ganha dinheiro, em que segmentos e em que geografias. É aqui que o arquétipo de negócio se define, e o arquétipo determina qual método de avaliação é apropriado antes de qualquer número.',
       q:'Os segmentos têm riscos suficientemente distintos para exigir soma das partes?'},
      {k:'f3',n:'Fatores de risco',y:'15-25 min',
       b:'Procure <b>linguagem específica</b>. Risco descrito de forma genérica é redação de conformidade; risco descrito com valor, prazo, contraparte ou norma nomeada é informação. A diferença entre os dois estilos, dentro do mesmo documento, é reveladora.',
       q:'Quais fatores de risco estão descritos com especificidade suficiente para serem modelados?'},
      {k:'f4',n:'Endividamento, garantias e contratos relevantes',y:'25-35 min',
       b:'Restrições, vencimentos, covenants com definição, garantias constituídas e obrigações contratuais. É a seção que responde à lente de capital e a que produz o maior número de lacunas por trecho lido.',
       q:'Que ativos estão onerados, a favor de quem, e o que aciona a execução?'},
      {k:'f5',n:'Capital, controle e partes relacionadas',y:'35-43 min',
       b:'Composição por classe de ação, acordo de acionistas, cláusulas estatutárias de voto, e transações com controlador ou entidades ligadas. É onde a lente de controle se resolve — e onde participação e voto se separam, quando se separam.',
       q:'Participação econômica é igual a poder de voto? E qual transação com parte relacionada carece de preço de referência?'},
      {k:'f6',n:'Administração e governança',y:'43-50 min',
       b:'Estrutura de conselho, comitês, competências e a métrica que remunera a administração. A métrica de remuneração é informação de primeira ordem: ela prevê quais números a administração vai otimizar.',
       q:'Qual indicador remunera a administração, e ele coincide com o que cria valor econômico?'},
      {k:'f7',n:'Contingências, auditoria e temas socioambientais',y:'50-56 min',
       b:'Processos, classificação de perda, montantes divulgados em nota, opinião do auditor e condicionantes de licenciamento. É a seção da cauda — eventos de baixa frequência e alto impacto que nenhum múltiplo captura.',
       q:'Existe contingência classificada como possível cuja magnitude seja material contra o patrimônio?'},
      {k:'f8',n:'Síntese três por três',y:'56-60 min',
       b:'Escreva. Três teses com âncora e contraponto, três riscos com evento, caminho até o caixa e indicador de alerta, três lacunas com pergunta formulável e impacto na conclusão. E a frase de fechamento em três partes: funciona se, muda se, falta confirmar.',
       q:'Consigo escrever as nove sem voltar ao documento? Se não, a leitura não terminou.'}
    ]
  };

export interface M13TrechoLacuna { k: string; n: string; y: string; tr: string; cat: string; perg: string; imp: string }
// INST·05 — `var CASOS` (L3666)
export const M13_TRECHOS_LACUNA: M13TrechoLacuna[] = [
    {k:'g1',n:'Garantias constituídas',y:'Trecho 01',
     tr:'"A Companhia mantém garantias reais e fidejussórias constituídas em favor de credores no âmbito de contratos de financiamento de suas controladas, conforme detalhado nas notas explicativas."',
     cat:'<b>Categoria: garantia não detalhada.</b> O trecho confirma a existência de garantias e não informa quais ativos foram onerados, em que valor contábil, a favor de qual credor, com que gatilho de execução, e — o ponto material — se há garantia prestada pela controladora em favor de dívida de controlada, o que reintroduz risco corporativo numa estrutura que parecia isolada.',
     perg:'Qual o valor contábil dos ativos onerados por contrato, e quais garantias corporativas a holding prestou em favor de dívidas de controladas e de sociedades de projeto?',
     imp:'A resposta altera duas coisas ao mesmo tempo: quanto de ativo permanece livre para sustentar novos financiamentos, e qual a exposição real da holding a um inadimplemento que ocorra em uma subsidiária. Sem ela, a dívida líquida consolidada subestima o compromisso econômico do controlador.'},
    {k:'g2',n:'Contingência possível',y:'Trecho 02',
     tr:'"A Companhia figura como parte em processos de natureza tributária e cível cuja expectativa de perda é classificada como possível, para os quais não foram constituídas provisões."',
     cat:'<b>Categoria: contingência sem valor provisionado.</b> A classificação como perda possível dispensa provisão pela norma contábil e <b>exige divulgação do montante envolvido em nota explicativa</b>. Se o montante não estiver na nota, a lacuna é de divulgação; se estiver, o exercício é comparar a magnitude com o patrimônio líquido e com a geração anual de caixa.',
     perg:'Qual o montante total das contingências classificadas como possíveis, aberto por natureza, e qual a expectativa de prazo processual de cada bloco relevante?',
     imp:'Uma contingência tributária de magnitude comparável a alguns anos de caixa livre não aparece em nenhum múltiplo e não reduz o resultado até que a classificação mude. Ela é a definição de cauda: baixa frequência, alto impacto, e invisível para quem lê apenas as três demonstrações.'},
    {k:'g3',n:'Parte relacionada',y:'Trecho 03',
     tr:'"A Companhia adquiriu de sua controladora participação societária em ativo operacional, tendo sido atribuído à operação o valor de mercado apurado pela administração."',
     cat:'<b>Categoria: transação com parte relacionada sem preço de referência demonstrado.</b> O valor está divulgado; o que falta é o <b>referencial</b>: houve laudo de avaliação independente, qual metodologia, qual a faixa de valor produzida, onde o preço acordado se situa nessa faixa, e qual comitê independente se manifestou.',
     perg:'Qual laudo de avaliação suportou o valor atribuído, qual a faixa produzida, e qual foi a manifestação do comitê independente e do conselho fiscal?',
     imp:'Define se a transação transferiu valor entre controlador e acionistas minoritários — e em que direção. É a lacuna cuja resposta muda a leitura da governança inteira, e não apenas a de um número.'},
    {k:'g4',n:'Covenant mencionado',y:'Trecho 04',
     tr:'"Os contratos de financiamento preveem o cumprimento de índices financeiros, apurados semestralmente, cujo descumprimento pode ensejar o vencimento antecipado das obrigações."',
     cat:'<b>Categoria: covenant não divulgado.</b> Sabe-se que existem índices e que o descumprimento tem consequência. Não se sabe <b>quais índices, com que definição, em que patamar, e qual a folga atual</b>. Sem a definição do denominador, o índice divulgado pela companhia não é reproduzível por terceiro.',
     perg:'Quais são os índices, com que definição exata de resultado operacional e de dívida líquida, em que patamar, e qual a distância atual entre o apurado e o limite?',
     imp:'Determina se a companhia tem liberdade para distribuir, para investir e para contrair nova dívida — ou se está operando com folga estreita, hipótese em que qualquer choque operacional vira evento de crédito antes de virar problema operacional.'},
    {k:'g5',n:'Vencimento sem plano',y:'Trecho 05',
     tr:'"A Companhia possui obrigações financeiras com vencimento nos próximos doze meses e avalia continuamente alternativas de captação disponíveis no mercado de capitais."',
     cat:'<b>Categoria: plano de refinanciamento ausente.</b> A frase confirma o vencimento e descreve uma intenção genérica. Não informa montante, natureza do instrumento, se há linha comprometida contratada, nem se existe caixa suficiente para amortização caso a captação não se materialize. Mercado aberto hoje não é mercado aberto no vencimento.',
     perg:'Qual o montante exato a vencer nos próximos doze meses, quanto está coberto por caixa livre e por linhas comprometidas, e qual a alternativa se a janela de mercado fechar?',
     imp:'É a diferença entre risco de refinanciamento gerenciado e risco de refinanciamento aberto. A resposta muda a leitura de liquidez, e liquidez é o único risco financeiro que se materializa em uma data específica e conhecida de antemão.'},
    {k:'g6',n:'Caixa consolidado',y:'Trecho 06',
     tr:'"A posição consolidada de caixa e equivalentes de caixa ao final do período era de valor suficiente para fazer frente aos compromissos de curto prazo do grupo."',
     cat:'<b>Categoria: caixa restrito por sociedade de projeto.</b> O número consolidado pode estar correto e a conclusão errada. Caixa dentro de sociedade de propósito específico frequentemente está bloqueado por contrato de financiamento enquanto testes de cobertura não forem cumpridos, e não pode transitar até a holding — que é onde o vencimento costuma estar.',
     perg:'Do caixa consolidado, quanto está na holding e em subsidiárias sem restrição, e quais são as condições contratuais para distribuição a partir das sociedades de projeto?',
     imp:'Pode transformar uma posição de liquidez aparentemente confortável em uma insuficiência na entidade que precisa pagar. É a lacuna mais específica do setor de infraestrutura, e a que mais frequentemente passa despercebida por quem lê apenas o balanço consolidado.'}
  ];
// INST·05 — literal de `render()` (L3704)
export const M13_LACUNA_VISTA: Record<'cat' | 'perg' | 'imp', string> = { cat: 'Categoria e diagnóstico', perg: 'Pergunta a fazer', imp: 'Impacto na conclusão' };

export interface M13Arquetipo { n: string; dec: string; est: string; ver: string }
// INST·06 — `var ARQ` (L3718)
export const M13_ARQUETIPOS: Record<'estvl' | 'estsub' | 'estrpriv' | 'patroc' | 'semctrl' | 'jv', M13Arquetipo> = {
    estvl:{n:'Estatal com voto limitado',
      dec:'Administração profissional, com participação estatal relevante cujo poder de voto está limitado por estatuto ou por acordo firmado no momento da desestatização. A influência do Estado, quando se restabelece, tende a fazê-lo por via contratual e judicial — termos de conciliação, composição de conselho — e não por voto em assembleia.',
      est:'Sob estresse, a tensão aparece entre disciplina de capital e prioridade de política pública. Disputas migram para o Judiciário em vez de se resolverem em assembleia, e o desfecho é mais lento e menos previsível que numa companhia com controlador único.',
      ver:'Qual o teto estatutário de voto, e existe termo de conciliação, acordo de investimento ou decisão judicial que altere a composição de conselho ou obrigações societárias?'},
    estsub:{n:'Estatal subnacional',
      dec:'Governo estadual, com ciclo político e horizonte de mandato próprios. O controle é exercido pelo capital votante, e a participação econômica do controlador no capital total costuma ser menor que sua fatia do votante — divergência que favorece o controlador.',
      est:'Alocação de capital sensível ao calendário eleitoral. A política de distribuição pode responder à necessidade fiscal do controlador, o que introduz um vetor de decisão que não é operacional nem financeiro e que nenhum indicador captura.',
      ver:'Qual a fatia do controlador no votante e no total, separadamente? E há iniciativa legislativa estadual de desestatização em tramitação, ou apenas debate público?'},
    estrpriv:{n:'Controlador estrangeiro privado majoritário',
      dec:'Matriz no exterior, com política global de alocação de capital. As decisões de aporte e de desinvestimento seguem lógica de portfólio internacional: o Brasil compete por capital com outras geografias do mesmo grupo, e essa competição não aparece em nenhum documento local.',
      est:'Disciplina financeira tipicamente alta e resposta rápida. O risco específico é oposto ao do arquétipo estatal: a companhia pode ser bem gerida e ainda assim receber menos capital do que precisa, se outra geografia do grupo oferecer retorno melhor.',
      ver:'O capital é composto apenas por ações ordinárias? Se sim, participação e voto coincidem. E existe transação relevante com o próprio controlador que exija preço de referência demonstrado?'},
    patroc:{n:'Patrocinador financeiro',
      dec:'Acionista de referência com horizonte de retorno definido — fundo, banco de investimento ou veículo de investimento — sem controle majoritário clássico. Maior acionista não é controlador: a pergunta decisiva é se existe acordo de acionistas que agregue votos e converta participações isoladas em bloco.',
      est:'Pressão por eventos de liquidez: venda de ativos, reciclagem de portfólio, combinações de negócios. Menor tolerância a ciclos longos de investimento sem retorno visível — o que pode colidir com o ciclo de maturação de ativos de infraestrutura.',
      ver:'Existe acordo de acionistas arquivado que vincule o voto de mais de um sócio? E qual o horizonte declarado ou inferível do acionista de referência?'},
    semctrl:{n:'Corporação sem controlador definido',
      dec:'A administração, sob supervisão de um conselho eleito por capital pulverizado entre investidores institucionais. É o arquétipo mais raro no Brasil, e o único em que a governança formal — estatuto, competências, quóruns qualificados, comitês — é o único freio real sobre a administração.',
      est:'Maior liberdade estratégica e maior risco de assimetria entre administração e acionista. Sob estresse, não há bolso de controlador para aportar: a resposta a uma crise de liquidez passa obrigatoriamente pelo mercado, o que é mais rápido quando o mercado está aberto e mais frágil quando não está.',
      ver:'Existem cláusulas de proteção contra aquisição hostil, e quóruns qualificados para decisões relevantes? E qual indicador remunera a administração?'},
    jv:{n:'Associação com dois controladores coordenados',
      dec:'Dois acionistas de referência que precisam concordar; nenhum decide sozinho. O arranjo funciona bem enquanto os interesses convergem e se torna a variável dominante no momento exato em que divergem.',
      est:'Paralisia possível quando os dois divergem — especialmente sobre aporte de capital novo, que é precisamente o ponto de tensão de qualquer reestruturação de dívida. Um credor que analise esta estrutura precisa perguntar não se os sócios podem aportar, mas se eles concordam em aportar.',
      ver:'Qual o escopo e a vigência do acordo entre os sócios, quais matérias exigem unanimidade, e o que acontece se um deles quiser sair?'}
  };

export interface M13CasoControle { k: string; n: string; a: keyof typeof M13_ARQUETIPOS; nota: string }
// INST·06 — `var CASOS` (L3744)
export const M13_CASOS_CONTROLE: M13CasoControle[] = [
    {k:'c1',n:'AXIA Energia',a:'estvl',nota:'Participação econômica, poder de voto e assentos de conselho divergem entre si. Verificado em 02·08·2026.'},
    {k:'c2',n:'Cemig',a:'estsub',nota:'Controle estadual pelo capital votante, com participação no capital total menor que a fatia do votante.'},
    {k:'c3',n:'ENGIE Brasil Energia',a:'estrpriv',nota:'Apenas ações ordinárias: participação e voto coincidem. A distinção da Aula 04 não se aplica — e isso é informação.'},
    {k:'c4',n:'CPFL Energia',a:'estrpriv',nota:'Controlada pela State Grid Corporation of China, por meio de holding brasileira. Não pela China Three Gorges — são estatais chinesas distintas.'},
    {k:'c5',n:'Neoenergia',a:'estrpriv',nota:'Controlada pela Iberdrola. Capital fechado desde maio de 2026: metade dos indicadores padrão deixa de existir, a outra metade permanece.'},
    {k:'c6',n:'Eneva',a:'patroc',nota:'Maior acionista é um banco de investimento brasileiro, em capital disperso. Maior acionista não é controlador.'},
    {k:'c7',n:'Auren Energia',a:'patroc',nota:'Grupo industrial brasileiro e fundo de pensão canadense como acionistas de referência.'},
    {k:'c8',n:'Equatorial Energia',a:'semctrl',nota:'Sem acionista controlador, apenas ações ordinárias, capital pulverizado entre institucionais.'},
    {k:'c9',n:'Vibra Energia',a:'semctrl',nota:'Capital pulverizado. Historicamente o braço de distribuição de combustíveis vendido pela estatal de petróleo.'},
    {k:'c10',n:'Raízen',a:'jv',nota:'Dois acionistas de referência coordenados. A conversão de créditos prevista no plano homologado pode alterar a estrutura — reverificação obrigatória.'},
    {k:'h1',n:'Hipotética · fundo com 45% e acordo',a:'jv',nota:'Caso hipotético. Dois sócios com 45% e 30% do votante e acordo que vincula o voto de ambos formam bloco de 75% — controle conjunto, ainda que nenhum detenha maioria isolada.'},
    {k:'h2',n:'Hipotética · 68% do total, 35% do voto',a:'estvl',nota:'Caso hipotético construído sobre o padrão real da operadora nuclear: participação econômica majoritária sem controle, porque a maioria do capital votante permanece com sócio estatal.'}
  ];
// INST·06 — literal fixo do terceiro cartão de `render()` (L3771)
export const M13_ARQUETIPO_NAO_CONCLUIR = 'Arquétipo de controle é dado de entrada da análise, nunca conclusão sobre a qualidade da companhia. Nenhum dos seis é melhor que outro em abstrato: cada um é mais adequado a um horizonte e a uma tolerância a risco diferentes.';

export interface M13CasoParticipacao {
  k: string; n: string;
  ka: string; va: string; ua: string; ma: string;
  kb: string; vb: string; ub: string; mb: string;
  mec: string;
}
// INST·07 — `var CASOS` (L3779)
export const M13_CASOS_PARTICIPACAO_VOTO: M13CasoParticipacao[] = [
    {k:'p1',n:'Operadora nuclear · 2026',
     ka:'Participação econômica adquirida',va:'68',ua:'% do capital total',
     ma:'Fatia do resultado e do patrimônio que passou a pertencer ao comprador privado. Em qualquer conta de valor econômico, é este número que importa.',
     kb:'Poder de voto adquirido',vb:'35,3',ub:'% do capital votante',
     mb:'Fatia da capacidade de decidir. A estatal federal que representa a União permaneceu com cerca de 64,7% do capital votante e cerca de 32% do capital total — e segue controlando.',
     mec:'<b>Mecanismo: classes de ações com direitos distintos, somadas a exigência setorial de controle.</b> A operação foi anunciada em outubro de 2025, aprovada pelo Cade em dezembro, liberada pela renúncia ao direito de preferência em fevereiro de 2026 e concluída em março de 2026. Quem leu apenas a manchete concluiu que o setor foi privatizado. <b>Consequência prática:</b> o comprador tem exposição econômica majoritária a um ativo cujas decisões operacionais e de investimento não controla — o que é uma posição de risco muito diferente da de um controlador.'},
    {k:'p2',n:'Companhia privatizada com teto de voto',
     ka:'Participação estatal no capital total',va:'relevante',ua:'sem controle',
     ma:'A União manteve, após a capitalização e privatização de 2022, participação economicamente relevante no capital total da companhia.',
     kb:'Poder de voto estatal',vb:'limitado',ub:'por estatuto',
     mb:'Os direitos de voto de qualquer acionista ficaram estatutariamente limitados a um teto, mecanismo desenhado no momento da desestatização para impedir recaptura de controle pelo Estado.',
     mec:'<b>Mecanismo: limitação estatutária de voto.</b> É o caso em que a divergência entre as duas grandezas foi <b>construída de propósito</b>, e não é subproduto de classes de ações. A parte instrutiva é o que aconteceu depois: um termo de conciliação homologado pelo Supremo Tribunal Federal ao fim de 2025 ampliou o conselho de sete para dez membros, com três indicações da União. <b>Consequência prática:</b> a influência estatal foi restabelecida parcialmente por via judicial e contratual, e nenhum percentual de participação ou de voto capturava isso.'},
    {k:'p3',n:'Estatal subnacional com preferenciais',
     ka:'Participação do controlador no capital total',va:'menor',ua:'que a do votante',
     ma:'Parcela relevante do capital está em ações preferenciais detidas pelo mercado, o que dilui a participação econômica do controlador sem diluir seu poder de decisão.',
     kb:'Participação do controlador no capital votante',vb:'maioria',ub:'do votante',
     mb:'O controle é exercido pela maioria das ações ordinárias, e é essa maioria que elege a administração e decide as matérias relevantes.',
     mec:'<b>Mecanismo: ações preferenciais sem direito de voto.</b> É a divergência clássica do direito societário brasileiro, e aqui ela opera <b>a favor</b> do controlador — o inverso do primeiro caso. <b>Consequência prática:</b> um investidor que adquira ações preferenciais desta companhia adquire exposição econômica sem qualquer influência sobre decisões que dependem do ciclo político do controlador estadual. Isso não é defeito: é a característica do instrumento, e precisa estar precificada.'},
    {k:'p4',n:'Companhia com apenas ordinárias',
     ka:'Participação do controlador no capital total',va:'idêntica',ua:'ao votante',
     ma:'Com capital composto exclusivamente por ações ordinárias, cada ação carrega um voto, e a fatia econômica é aritmeticamente igual à fatia de decisão.',
     kb:'Participação do controlador no capital votante',vb:'idêntica',ub:'ao total',
     mb:'Não há classe sem voto, e a leitura de controle se resolve diretamente na tabela de participação, sem camadas adicionais.',
     mec:'<b>Mecanismo: ausência de mecanismo.</b> Este caso está aqui porque a coincidência entre as duas grandezas é <b>informação positiva</b>, não ausência de informação: significa que a análise de controle é mais simples e mais estável. <b>Consequência prática:</b> a atenção migra da estrutura societária para a transação — se o controlador vende ativo próprio para a companhia, a governança da operação passa a ser o ponto de verificação, e não a composição do capital.'},
    {k:'p5',n:'Bloco formado por acordo',
     ka:'Participação individual de cada sócio',va:'45 e 30',ua:'% do votante',
     ma:'Isoladamente, nenhum dos dois sócios detém maioria do capital votante, e uma leitura ingênua da tabela de participação concluiria que a companhia não tem controlador.',
     kb:'Voto vinculado pelo acordo',vb:'75',ub:'% do votante',
     mb:'O acordo de acionistas vincula o voto de ambos nas matérias que especifica, criando um bloco que exerce controle de fato sobre essas matérias.',
     mec:'<b>Mecanismo: acordo de acionistas arquivado.</b> É a terceira grandeza — nem participação individual, nem voto individual, mas voto agregado por contrato — e é a que define o controle. Caso hipotético construído sobre um padrão frequente. <b>Consequência prática:</b> nenhuma tabela de participação, sozinha, mostraria isso. As perguntas decisivas são o escopo do acordo, sua vigência, e o que ocorre se um dos dois quiser sair.'}
  ];

export interface M13Risco { k: string; n: string; emp: string; prj: string; mit: string; alr: string }
// INST·09 — `var R` (L3883). Oito riscos.
// Q04 / QA-M13-A06 (decisão do Founder, 15/11/2026): o dado do instrumento
// (OITO riscos) vence o título retórico da Aula 06 ("Seis categorias…").
// Na fonte o texto de `cred.emp` abria com "A sexta categoria, ausente do
// currículo" — mas `cred` é o OITAVO item desta lista. A prosa fica sem o
// número: "A categoria ausente do currículo". Nenhuma palavra nova.
export const M13_RISCOS: M13Risco[] = [
    {k:'hid',n:'Hidrológico',
     emp:'Manifesta-se como variação de resultado: geração abaixo da garantia física obriga a companhia a comprar energia no mercado de curto prazo para honrar contratos, com custo que não estava no orçamento. Numa geradora diversificada por fonte e por bacia, é volatilidade; numa concentrada, é a variável dominante.',
     prj:'Manifesta-se como gatilho contratual: geração abaixo do percentil adverso usado no dimensionamento da dívida derruba o caixa disponível abaixo da cobertura mínima, aciona bloqueio de distribuição e pode caracterizar inadimplemento técnico antes de qualquer problema operacional real.',
     mit:'Diversificação de fontes e de bacias; desenho contratual que aloque o risco de forma explícita; sazonalização; e dimensionamento da dívida em percentil adverso de geração, não no cenário central.',
     alr:'Geração acumulada abaixo da garantia física por dois trimestres consecutivos; elevação do custo de compra de energia para revenda na demonstração de resultado.'},
    {k:'reg',n:'Regulatório',
     emp:'Mudança de parâmetro tarifário, de encargo setorial ou de metodologia altera a receita reconhecida sem que nada tenha mudado na operação. Em distribuição, o ciclo de revisão é o evento; entre revisões, o risco é de mudança normativa geral.',
     prj:'Alteração de condição de outorga, de regra de acesso ou de encargo muda a receita do projeto durante a vida da dívida. O credor exige, tipicamente, cláusula de reequilíbrio ou alocação explícita do risco entre patrocinador e projeto.',
     mit:'Acompanhamento de consultas públicas e da agenda regulatória; cláusulas contratuais de reequilíbrio; modelagem por cenário regulatório em vez de premissa única.',
     alr:'Abertura de consulta pública sobre parâmetro relevante; nota técnica preliminar do regulador divergente da metodologia vigente.'},
    {k:'cam',n:'Cambial',
     emp:'Atinge o custo de equipamento importado, o serviço da dívida em moeda estrangeira e, em algumas cadeias, o preço do insumo. Em companhia com receita integralmente doméstica, é descasamento puro: não há receita na mesma moeda para compensar.',
     prj:'Concentra-se na fase de construção, quando o investimento importado é contratado, e no serviço de dívida externa, se houver. Em projeto com receita em moeda local, a proteção cambial é custo, não escolha.',
     mit:'Proteção contratada com prazo compatível com a exposição; contingência orçamentária em moeda; e, quando existir, receita denominada na mesma moeda da dívida.',
     alr:'Exposição líquida crescente com proteção de prazo mais curto que a dívida; renovação sucessiva de instrumentos de proteção a custo crescente.'},
    {k:'idx',n:'Descasamento de indexador',
     emp:'Receita atrelada a um índice e dívida atrelada a outro produzem resultado que oscila sem que operação ou mercado tenham mudado. Uma dívida majoritariamente indexada a índice de preços pode ser proteção natural se a receita seguir o mesmo índice — e descasamento se seguir outro.',
     prj:'Mais severo em projeto que em empresa, porque não há diversificação de contratos para compensar. Se a receita é fixa em termos nominais e a dívida é indexada, a cobertura se deteriora com a inflação de forma previsível e inevitável.',
     mit:'Casamento de indexadores entre receita e dívida; instrumentos de troca de indexador; conta-reserva dimensionada para absorver descasamento temporário.',
     alr:'Divergência acumulada entre o índice da receita e o da dívida acima de alguns pontos percentuais em doze meses.'},
    {k:'ope',n:'Operacional',
     emp:'Indisponibilidade de ativo, acidente, falha de equipamento e — em distribuição — perda não técnica de energia. Esta última é um risco de crédito disfarçado de risco operacional: energia distribuída e não faturada tem o mesmo efeito financeiro que inadimplência.',
     prj:'Desempenho abaixo do contratado durante a operação, cobertura por contrato de operação e manutenção, e disponibilidade como parâmetro contratual com penalidade associada.',
     mit:'Contrato de operação e manutenção com penalidade; seguro operacional com franquia e exclusões verificadas; reserva de manutenção; plano de manutenção compatível com a vida dos equipamentos.',
     alr:'Elevação do indicador de indisponibilidade forçada; perda não técnica acima do nível regulatório reconhecido; postergação de manutenção programada.'},
    {k:'cons',n:'Construção',
     emp:'Custo acima do orçado e atraso na entrada em operação de projetos em carteira, com efeito sobre o retorno do investimento e sobre a data em que a receita começa.',
     prj:'É o risco dominante da fase pré-operacional. Atraso significa juros durante a construção acima do orçado e receita adiada, com o serviço da dívida começando conforme cronograma contratual — a combinação que consome contingência mais rápido.',
     mit:'Contrato de construção integral com multa por atraso e desempenho; garantia de conclusão do patrocinador; contingência orçamentária real; e cronograma de desembolso vinculado a medição física.',
     alr:'Desvio acumulado no cronograma crítico; reivindicações contratuais do construtor; consumo de contingência acima do proporcional ao avanço físico.'},
    {k:'mer',n:'Mercado e recontratação',
     emp:'Preço, volume e risco de contraparte. A variável estrutural é a proporção de energia contratada contra a exposta a preço de curto prazo, e o preço a que os contratos que vencem serão renovados.',
     prj:'Cauda de exposição a preço após o vencimento dos contratos que sustentaram a dívida. Se a dívida for mais longa que os contratos, o projeto passa a depender do mercado exatamente quando ainda deve.',
     mit:'Contratos de longo prazo casados com o prazo da dívida; limites de exposição; diversificação de contrapartes; e avaliação de crédito da contraparte, não apenas do preço.',
     alr:'Concentração de vencimentos contratuais num único ano; deterioração de crédito de contraparte relevante; elevação da parcela exposta a preço de curto prazo.'},
    {k:'cred',n:'Crédito e estrutura de capital',
     emp:'A categoria ausente do currículo e dominante no setor em 2026. Não é a probabilidade de a empresa ir mal: é a de não honrar obrigações no vencimento, o que pode ocorrer com companhia operacionalmente sólida se o desenho da dívida colidir com a geração de caixa.',
     prj:'Concentra-se no risco de refinanciamento de saldo residual e na dependência de aporte do patrocinador. Numa estrutura com dois patrocinadores que precisam concordar, o risco não é a capacidade de aportar — é a convergência entre eles.',
     mit:'Alongamento de prazo antes da necessidade; diversificação de fontes de financiamento; manutenção de linhas comprometidas; e, no desenho societário, definição prévia de como o aporte de emergência é decidido.',
     alr:'Alongamento sucessivo a custo crescente; dispensa formal de covenant divulgada; concentração de vencimento sem plano declarado; contratação de assessor financeiro para reestruturação.'}
  ];

export interface M13LinhaComparador {
  n: string;
  ctrl: [string, string]; seg: [string, string]; alav: [string, string]; ind: [string, string]; ev: [string, string];
}
// INST·10 — `var E` (L3945)
export const M13_COMPARADOR_EMPRESAS: M13LinhaComparador[] = [
    {n:'AXIA Energia',
     ctrl:['Sem controlador único; União com voto limitado por estatuto','Participação, voto e assentos de conselho divergem entre si'],
     seg:['Geração e transmissão nacional','Cerca de 44,0 GW e 74,8 mil km de linhas · 1T26'],
     alav:['1,8× regulatório ajustado · 1,9× societário','Os dois corretos, denominadores diferentes · 1T26'],
     ind:['Resultado operacional ajustado ≈ R$ 8,5 bi','Quatro rótulos distintos no mesmo trimestre · 1T26'],
     ev:['Alienação de participação concluída em mar 2026','Alteração de denominação social em out-nov 2025']},
    {n:'Cemig',
     ctrl:['Governo do Estado de Minas Gerais','Fatia do votante maior que a do capital total'],
     seg:['Integrada: distribuição, geração, transmissão e gás','Holding com subsidiárias separadas por segmento'],
     alav:['≈ 2,3× ajustada','Exercício 2025 · ler também por subsidiária'],
     ind:['Resultado operacional ≈ R$ 1,8 bi · lucro ≈ R$ 979 mi','1T26 · consolidado, exige abertura'],
     ev:['Ciclo tarifário e plano plurianual em curso','Desestatização é cenário em debate, não decisão']},
    {n:'ENGIE Brasil Energia',
     ctrl:['Grupo francês Engie, via holding brasileira','Apenas ordinárias: participação = voto'],
     seg:['Geração renovável, transmissão e comercialização','Participação em transporte de gás'],
     alav:['Perfil historicamente conservador','Base alterada pela oferta de jul 2026'],
     ind:['Resultado operacional ajustado ≈ R$ 2,2 bi','1T26 · anterior à oferta e à incorporação'],
     ev:['Oferta primária de R$ 8,36 bi encerrada em 20 jul 2026','274.082.684 ações a R$ 30,50; R$ 5,74 bi do controlador']},
    {n:'Auren Energia',
     ctrl:['Grupo industrial brasileiro e fundo de pensão canadense','Acionistas de referência sem controlador único clássico'],
     seg:['Geração e comercialização','Portfólio ampliado por combinação de negócios'],
     alav:['≈ 5,2× · a mais alta entre as abertas do rol','Prazo médio ≈ 7 anos, majoritariamente indexada a preços'],
     ind:['Resultado operacional ajustado ≈ R$ 926 mi · prejuízo ≈ R$ 602 mi','1T26'],
     ev:['Integração de ativos incorporados em 31 out 2024','Companhia incorporada deixou de ser negociada em 1 nov 2024']},
    {n:'Equatorial Energia',
     ctrl:['Sem acionista controlador','Capital pulverizado, apenas ordinárias'],
     seg:['Multi-utility: distribuição, transmissão, renováveis e saneamento','Soma das partes obrigatória'],
     alav:['≈ 2,7× de covenant','Dívida líquida ≈ R$ 44,3 bi · 1T26'],
     ind:['Resultado operacional ajustado ≈ R$ 2,9 bi · investimento ≈ R$ 2,6 bi','1T26'],
     ev:['Expansão para saneamento e participações societárias','Integração de ativos de ciclos anteriores']},
    {n:'Neoenergia',
     ctrl:['Iberdrola','Capital fechado desde mai 2026'],
     seg:['Redes reguladas, geração e clientes','Base de remuneração regulatória ≈ R$ 47,3 bi · 2T26'],
     alav:['≈ 3,5×','2T26 · segue divulgável enquanto houver registro para dívida'],
     ind:['Resultado operacional ≈ R$ 3,55 bi · 17,2 mi de clientes','2T26 · trimestre diferente das demais linhas'],
     ev:['Resgate compulsório a R$ 34,02 pago em 15 mai 2026','Saída do segmento especial e mudança de categoria']},
    {n:'Eneva',
     ctrl:['Sem controlador majoritário; maior acionista é banco de investimento','Maior acionista não é controlador'],
     seg:['Gás natural integrado a geração térmica','Concentração em Norte e Nordeste'],
     alav:['≈ 2,6×','Exercício 2025'],
     ind:['Resultado operacional ≈ R$ 1,7 bi · investimento ≈ R$ 2,1 bi','1T26 · investimento acima do resultado do trimestre'],
     ev:['Ciclo de expansão com projetos contratados','Sem evento de mudança de controle registrado']},
    {n:'CPFL Energia',
     ctrl:['State Grid Corporation of China, via holding brasileira','Não é a China Three Gorges — estatais distintas'],
     seg:['Distribuição, geração e transmissão','Concentração no Sudeste e Sul'],
     alav:['≈ 2,3×','Dívida líquida ≈ R$ 30,6 bi · 1T26'],
     ind:['Resultado operacional ≈ R$ 3,86 bi','1T26'],
     ev:['Plano de investimento plurianual 2026-2030','Sem evento de mudança de controle registrado']},
    {n:'Vibra Energia',
     ctrl:['Capital pulverizado, sem controlador','Braço de distribuição vendido pela estatal de petróleo'],
     seg:['Combustíveis, lubrificantes, aviação e plataforma de energia','Plataforma adquirida integralmente em jan 2025'],
     alav:['≈ 2,0×','1T26 · o consumidor de caixa é capital de giro, não investimento'],
     ind:['Resultado operacional ajustado ≈ R$ 3,2 bi · volume 8,737 mi m³','1T26'],
     ev:['Integração da plataforma de energia adquirida','Ampliação de perímetro para além de combustíveis líquidos']},
    {n:'Raízen',
     ctrl:['Dois acionistas de referência coordenados','Conversão de créditos pode alterar a estrutura'],
     seg:['Bioenergia, açúcar, combustíveis e logística','Lado agroindustrial pertence ao Bloco 14'],
     alav:['≈ 5,2×','Ano-safra 2025/26 · múltiplo não é o instrumento aqui'],
     ind:['Resultado operacional ajustado ≈ R$ 2,8 bi · prejuízo ≈ R$ 7,3 bi','Ano-safra 2025/26'],
     ev:['Recuperação extrajudicial homologada em 30 jul 2026','81,6% de adesão; ≈ R$ 61,4 bi reperfilados']}
  ];
// INST·10 — `var NOTA` (L4007)
export const M13_COMPARADOR_RESSALVAS: Record<'ctrl' | 'seg' | 'alav' | 'ind' | 'ev', string> = {
    ctrl:'<b>A comparação mais legítima da tabela — e a única que não depende de trimestre.</b> Arquétipo de controle é estrutural: muda por evento societário, não por resultado. Repare que três companhias compartilham o mesmo arquétipo de controlador estrangeiro privado e têm comportamentos muito diferentes, porque o arquétipo prevê <b>como</b> a decisão é tomada, não qual decisão será tomada.',
    seg:'<b>A ressalva aqui é sobre o significado do denominador.</b> Chamar todas de "empresas de energia" esconde que uma distribuidora regulada, uma transmissora, uma geradora contratada, uma produtora integrada de gás, uma distribuidora de combustíveis e uma companhia de bioenergia têm motores de receita, intensidades de capital e riscos dominantes distintos. O rótulo "EBITDA" significa coisas diferentes em cada linha.',
    alav:'<b>Esta é a coluna mais perigosa da tabela, e ela está aqui para provar isso.</b> Os números vêm de definições diferentes de dívida líquida e de resultado operacional, de trimestres diferentes, e alguns são de covenant contratual em vez de razão contábil. A primeira linha exibe explicitamente dois valores para a mesma companhia no mesmo trimestre. <b>Nenhuma ordenação desta coluna é uma ordenação de risco.</b>',
    ind:'<b>Não compare trimestres diferentes sem normalizar.</b> Uma linha traz o segundo trimestre de 2026, outra traz um ano-safra, as demais trazem o primeiro trimestre de 2026 — e uma delas foi divulgada antes de uma oferta de ações que alterou o perímetro. Comparar valores absolutos entre companhias de portes e segmentos distintos é, além disso, uma comparação sem denominador.',
    ev:'<b>A coluna com a data de validade mais curta.</b> Quatro das dez linhas mudaram de estado societário entre outubro de 2025 e julho de 2026, e uma delas mudou três dias antes da data de verificação. Status societário é o dado que mais envelhece em silêncio, e é por isso que toda ficha deste módulo carrega a data em que foi verificado.'
  };
// INST·10 — `var TIT` (L4014)
export const M13_COMPARADOR_TITULOS: Record<'ctrl' | 'seg' | 'alav' | 'ind' | 'ev', string> = {ctrl:'Controlador',seg:'Modelo de negócio',alav:'Alavancagem divulgada',ind:'Resultado mais recente',ev:'Evento societário'};

export interface M13ItemAndaime { t: string; anc: string; cp: string }
export interface M13FichaAndaime { n: string; tese: M13ItemAndaime[]; risco: M13ItemAndaime[]; lacuna: M13ItemAndaime[] }
// INST·11 — `var A` (L4031)
export const M13_ANDAIME: Record<'axia' | 'cemig' | 'engie' | 'eneva' | 'eqtl' | 'raiz', M13FichaAndaime> = {
    axia:{n:'AXIA Energia',
      tese:[
        {t:'Escala e diversificação convertidas em caixa livre',anc:'Resultado operacional ajustado de ordem de R$ 8,5 bi no 1T26 contra investimento de cerca de R$ 1,4 bi no mesmo trimestre, com alavancagem divulgada entre 1,8× e 1,9× conforme o denominador.',cp:'Cai se a distância entre resultado operacional divulgado e caixa livre efetivo se mantiver por conta de itens que os ajustes gerenciais removem mas o caixa não: provisões judiciais, empréstimos compulsórios e resgate de ações. Resultado operacional alto não é a tese; conversão em caixa é.'},
        {t:'Portfólio de transmissão como piso de receita',anc:'Cerca de 74,8 mil km de linhas com receita reconhecida por disponibilidade, o que estabelece um componente de receita descorrelacionado de hidrologia e de preço de curto prazo.',cp:'Cai se a receita de transmissão for erodida por parcela variável decorrente de indisponibilidade, ou se o ciclo de revisão do segmento reduzir a receita reconhecida. Receita contratada não é receita garantida — é receita condicionada a desempenho.'},
        {t:'Simplificação do portfólio depois da alienação de participação minoritária',anc:'Conclusão, em março de 2026, da alienação de participação em ativo nuclear, com liberação de obrigações associadas a projeto de longo prazo e alto consumo de capital.',cp:'Cai se as obrigações liberadas forem substituídas por outras de natureza equivalente, ou se a redução de risco já estiver integralmente refletida no valor — hipótese em que a tese descreve o passado, não o futuro.'}],
      risco:[
        {t:'Recontratação de energia a preço desconhecido',anc:'Evento: vencimento de contratos de venda de energia ao longo do horizonte de modelagem, com renovação a preço de mercado.',cp:'Caminho até o caixa: menor preço médio de venda com custo fixo inalterado comprime margem diretamente. Alerta: elevação da parcela de energia descontratada nos anos seguintes, quando divulgada por ano.'},
        {t:'Ambiguidade de governança entre participação, voto e conselho',anc:'Evento: nova disputa sobre a extensão da influência estatal, decidida fora da assembleia — em juízo ou em termo de conciliação.',cp:'Caminho até o caixa: decisão de investimento ou de distribuição alterada por acordo institucional, não por deliberação societária. Alerta: novo processo ou termo em negociação envolvendo governança da companhia.'},
        {t:'Passivos de natureza própria fora da dívida financeira',anc:'Evento: alteração no tratamento ou no valor de passivos de natureza especial mantidos no balanço, que não integram a dívida financeira contratada.',cp:'Caminho até o caixa: desembolso não previsto no cronograma de amortização. Alerta: mudança de classificação ou de estimativa em nota explicativa.'}],
      lacuna:[
        {t:'Reconciliação completa entre os quatro rótulos de resultado operacional',anc:'Onde procurar: nota de reconciliação no release e no relatório de administração; se não fechar, área de relações com investidores.',cp:'Impacto: define qual denominador usar em toda a análise. Sem isso, nenhuma alavancagem calculada é comparável com a de qualquer outra companhia.'},
        {t:'Caixa livre depois de investimento, distribuição e resgate de ações',anc:'Onde procurar: demonstração de fluxo de caixa e destinação de resultado.',cp:'Impacto: separa a tese de conversão de caixa da narrativa de resultado operacional. É a lacuna que decide a primeira tese.'},
        {t:'Exposição contratada por ano no horizonte de modelagem',anc:'Onde procurar: apresentação institucional e abertura de posição contratada, quando divulgada por ano.',cp:'Impacto: converte o risco de recontratação de preocupação genérica em variável modelável, com ano e volume.'}]},
    cemig:{n:'Cemig',
      tese:[
        {t:'Reconhecimento regulatório do ciclo de investimento',anc:'Plano plurianual declarado com revisão tarifária da distribuidora como evento determinante do reconhecimento na base de remuneração.',cp:'Cai se parcela relevante do investimento não for reconhecida como prudente, hipótese em que a companhia consome caixa sem o degrau de receita correspondente.'},
        {t:'Valor não capturado pelo múltiplo consolidado',anc:'Estrutura de holding com distribuição, geração, transmissão e gás em subsidiárias separadas, cada uma com risco e intensidade de capital distintos.',cp:'Cai se a soma das partes, uma vez calculada com alocação explícita de dívida e de custos corporativos, não produzir diferença material contra o consolidado.'},
        {t:'Ativos maduros sustentando distribuição',anc:'Base de geração e transmissão com investimento já executado, gerando caixa com necessidade de reinvestimento inferior à da distribuição.',cp:'Cai se a necessidade de capital da distribuidora consumir o excedente das demais subsidiárias, transformando a companhia em consumidora líquida de caixa.'}],
      risco:[
        {t:'Calendário do controlador estadual',anc:'Evento: decisão de distribuição ou de investimento condicionada por necessidade fiscal ou por ciclo político do controlador.',cp:'Caminho até o caixa: distribuição acima da capacidade recorrente financiada por dívida, ou investimento adiado com efeito sobre indicadores de qualidade. Alerta: divergência entre distribuição e caixa livre por dois exercícios.'},
        {t:'Perdas e inadimplência na área de concessão',anc:'Evento: perda não técnica acima do nível reconhecido pelo regulador.',cp:'Caminho até o caixa: energia distribuída e não faturada com custo já pago — efeito financeiro idêntico ao de inadimplência. Alerta: indicador de perda acima do regulatório por trimestres consecutivos.'},
        {t:'Desestatização tratada como fato',anc:'Evento: alteração ou não do controle acionário por iniciativa legislativa estadual.',cp:'Caminho até o caixa: reprecificação abrupta em qualquer direção conforme o desfecho. Alerta: tramitação legislativa formal, distinta de declaração pública.'}],
      lacuna:[
        {t:'Retorno esperado do plano de investimento por subsidiária',anc:'Onde procurar: apresentação do plano plurianual; se apenas consolidado, área de relações com investidores.',cp:'Impacto: sem abertura, não é possível distinguir investimento que cria valor de investimento que apenas amplia a base de ativos.'},
        {t:'Política de capital sob cenários distintos',anc:'Onde procurar: política de distribuição divulgada e histórico de destinação de resultado.',cp:'Impacto: define se a distribuição é uma variável de decisão da companhia ou uma variável de necessidade do controlador.'},
        {t:'Caixa livre por subsidiária e restrições à transferência',anc:'Onde procurar: notas de partes relacionadas e de empréstimos entre companhias do grupo.',cp:'Impacto: determina a liquidez efetiva da holding, que pode ser muito menor que o caixa consolidado divulgado.'}]},
    engie:{n:'ENGIE Brasil Energia',
      tese:[
        {t:'Ativo hidrelétrico de grande porte já em operação',anc:'Incorporação de participação de 40% em ativo que já gera receita e caixa, aprovada em assembleia de 2 de julho de 2026, com valor atribuído de cerca de R$ 5,7 bi.',cp:'Cai se o preço pago não deixar espaço para retorno acima do custo de capital. Ativo bom e preço alto produzem a mesma tese ruim que ativo ruim e preço baixo.'},
        {t:'Exposição a geração firme em ciclo de restrição de rede',anc:'Ampliação da parcela de geração hidrelétrica contratada num período em que fontes intermitentes enfrentam cortes de geração relevantes no sistema.',cp:'Cai se a hidrologia adversa transformar a geração firme em exposição a compra de energia no curto prazo — o risco simétrico ao do corte de geração.'},
        {t:'Estrutura de capital reforçada pela oferta',anc:'Oferta primária encerrada em 20 de julho de 2026 com cerca de R$ 8,36 bi, dos quais parcela declarada como destinada a fortalecer a estrutura de capital além do financiamento da incorporação.',cp:'Cai se o efeito por ação da diluição superar o benefício da redução de alavancagem. Foram emitidas 274.082.684 ações a R$ 30,50 — o denominador de todo indicador por ação mudou.'}],
      risco:[
        {t:'Transação com o próprio controlador',anc:'Evento: questionamento sobre o preço da operação com parte relacionada, em foro societário ou regulatório.',cp:'Caminho até o caixa: custo de contencioso e, no limite, revisão de condições. Alerta: dois acionistas relevantes já votaram contra na assembleia.'},
        {t:'Diluição e comparabilidade histórica',anc:'Evento: comparação de indicadores por ação entre períodos anteriores e posteriores à oferta sem ajuste de base.',cp:'Caminho até o caixa: nenhum — é risco de análise, não de operação. Alerta: qualquer série histórica de indicador por ação que atravesse julho de 2026 sem nota de ajuste.'},
        {t:'Competição interna por capital dentro do grupo',anc:'Evento: realocação de capital do grupo controlador para outras geografias.',cp:'Caminho até o caixa: menor aporte disponível para expansão local, com efeito sobre a taxa de crescimento da base de ativos. Alerta: comunicações de estratégia global do controlador.'}],
      lacuna:[
        {t:'Laudo e faixa de valor da transação com parte relacionada',anc:'Onde procurar: documentos da assembleia de 2 de julho de 2026, manifestação de comitê independente e do conselho fiscal.',cp:'Impacto: define se houve transferência de valor entre controlador e minoritários, e em que direção. É a lacuna prioritária desta ficha.'},
        {t:'Perímetro contábil consolidado pós-incorporação',anc:'Onde procurar: primeira divulgação trimestral posterior à conclusão da operação.',cp:'Impacto: até que exista, qualquer múltiplo calculado descreve um perímetro que deixou de existir.'},
        {t:'Destinação declarada do excedente da oferta',anc:'Onde procurar: prospecto e comunicados da oferta; confirmação na demonstração de fluxo de caixa seguinte.',cp:'Impacto: separa redução de alavancagem de financiamento de expansão — duas teses diferentes com o mesmo dinheiro.'}]},
    eneva:{n:'Eneva',
      tese:[
        {t:'Integração entre produção de gás e geração térmica',anc:'Modelo em que a companhia produz o próprio combustível e o consome em usinas no mesmo complexo, com contratos de capacidade associados.',cp:'Cai se o custo de produção do gás próprio convergir para o custo de aquisição de terceiros, hipótese em que a integração deixa de ser vantagem econômica e passa a ser apenas maior exposição a risco exploratório.'},
        {t:'Receita fixa de capacidade como piso',anc:'Contratos de capacidade que remuneram disponibilidade independentemente de despacho, criando componente de receita descorrelacionado da decisão do operador do sistema.',cp:'Cai se a proporção de receita fixa contra receita variável de despacho for menor do que a narrativa sugere — a abertura entre as duas é exatamente a lacuna correspondente.'},
        {t:'Projetos contratados em construção como degrau de resultado',anc:'Investimento de cerca de R$ 2,1 bi no 1T26, superior ao resultado operacional do trimestre, indicando fase de construção com receita futura contratada.',cp:'Cai por execução: atraso ou custo acima do orçado consome contingência e adia a receita, enquanto o serviço da dívida começa conforme cronograma contratual.'}],
      risco:[
        {t:'Reserva e execução exploratória',anc:'Evento: revisão para baixo de reserva certificada ou resultado exploratório abaixo do esperado.',cp:'Caminho até o caixa: necessidade de comprar combustível de terceiros a preço de mercado, eliminando a vantagem do modelo integrado. Alerta: revisão de certificação de reserva; elevação do custo unitário de produção.'},
        {t:'Concentração de projetos em construção',anc:'Evento: atraso simultâneo em mais de um projeto relevante.',cp:'Caminho até o caixa: juros durante a construção acima do orçado, receita adiada e consumo de contingência. Alerta: desvio no cronograma crítico; reivindicações contratuais de construtores.'},
        {t:'Ausência de controlador com bolso definido',anc:'Evento: necessidade de aporte de capital em momento de mercado fechado.',cp:'Caminho até o caixa: dependência de emissão em condições adversas, ou de venda de ativo. Alerta: deterioração de indicadores de cobertura com investimento em curso.'}],
      lacuna:[
        {t:'Abertura entre receita fixa de capacidade e receita variável de despacho',anc:'Onde procurar: release trimestral, abertura de receita por natureza; se ausente, área de relações com investidores.',cp:'Impacto: é a lacuna que decide a segunda tese. Receita de despacho é conjuntural; receita de capacidade é estrutural.'},
        {t:'Investimento remanescente e contingência por projeto',anc:'Onde procurar: apresentação de projetos e notas de compromissos assumidos.',cp:'Impacto: define quanto de capital ainda é necessário antes de o portfólio gerar caixa livre positivo.'},
        {t:'Caixa restrito por sociedade de projeto',anc:'Onde procurar: nota de caixa e equivalentes, com abertura entre livre e restrito; contratos de financiamento por projeto.',cp:'Impacto: separa liquidez consolidada de liquidez disponível onde os vencimentos corporativos estão.'}]},
    eqtl:{n:'Equatorial Energia',
      tese:[
        {t:'Recuperação operacional de concessões adquiridas',anc:'Histórico de aquisição de concessões com indicadores operacionais abaixo do padrão e subsequente recuperação, com crescimento da base de remuneração regulatória.',cp:'Cai se o retorno incremental por concessão adquirida ficar abaixo do custo de capital — hipótese em que a escala cresce e o valor econômico diminui simultaneamente.'},
        {t:'Valor não capturado pelo múltiplo consolidado',anc:'Portfólio com distribuição, transmissão, geração renovável, saneamento e participações societárias, cada segmento com regulador e risco distintos.',cp:'Cai se a soma das partes, com alocação explícita de dívida e de custos corporativos, não produzir diferença material — ou se a complexidade justificar o desconto que o mercado aplica.'},
        {t:'Ausência de controlador como liberdade de alocação',anc:'Capital pulverizado, sem controlador, o que permite perseguir oportunidades sem restrição de prioridade de política pública ou de necessidade fiscal.',cp:'Cai porque a mesma ausência remove o principal freio: sem controlador, o único contrapeso à administração é a governança formal, e aquisições sucessivas com retorno abaixo do custo de capital inverteriam a tese.'}],
      risco:[
        {t:'Execução simultânea em frentes distintas',anc:'Evento: atraso ou custo acima do orçado em mais de um segmento ao mesmo tempo — concessões em recuperação, obras de transmissão e ativos de saneamento.',cp:'Caminho até o caixa: investimento acima do planejado com receita adiada em múltiplas frentes. Alerta: divergência crescente entre investimento executado e plano.'},
        {t:'Dívida absoluta elevada com múltiplas entidades emissoras',anc:'Evento: necessidade de refinanciamento em entidade específica com mercado fechado.',cp:'Caminho até o caixa: liquidez da holding insuficiente para socorrer subsidiária, por restrição de distribuição. Alerta: concentração de vencimento em entidade com covenant apertado.'},
        {t:'Assimetria entre administração e acionista',anc:'Evento: decisão de expansão cujo retorno incremental não é demonstrado antes da execução.',cp:'Caminho até o caixa: capital empregado a retorno abaixo do custo, com efeito cumulativo. Alerta: métrica de remuneração da administração baseada em escala em vez de retorno.'}],
      lacuna:[
        {t:'Retorno incremental por concessão adquirida',anc:'Onde procurar: abertura por segmento no release; se ausente, área de relações com investidores.',cp:'Impacto: é a lacuna que decide as três teses simultaneamente. Sem ela, a tese de recuperação operacional é uma narrativa.'},
        {t:'Caixa retido em subsidiárias e condições de distribuição',anc:'Onde procurar: notas de caixa restrito e contratos de financiamento por subsidiária.',cp:'Impacto: determina a liquidez efetiva onde os vencimentos corporativos estão, que pode ser fração do consolidado.'},
        {t:'Separação entre equivalência patrimonial e resultado consolidado',anc:'Onde procurar: nota de investimentos em coligadas e abertura de resultado por natureza.',cp:'Impacto: as duas contribuições têm naturezas e riscos distintos, e somá-las num único indicador impede avaliar qualquer uma delas.'}]},
    raiz:{n:'Raízen',
      tese:[
        {t:'Reperfilamento com adesão ampla e sem impugnação',anc:'Plano homologado em 30 de julho de 2026 com adesão de 81,6% dos créditos quirografários sujeitos e nenhuma impugnação, reperfilando cerca de R$ 61,4 bi e vinculando a totalidade dos credores sujeitos.',cp:'Cai se a sentença for reformada em recurso, ou se as condições reperfiladas ainda não couberem na geração de caixa da companhia — reperfilamento resolve prazo, não resolve capacidade de pagamento.'},
        {t:'Subordinação dos créditos entre empresas do grupo',anc:'Cerca de R$ 33,5 bi em obrigações internas subordinadas às dívidas financeiras externas na ordem de pagamento fixada na sentença.',cp:'Cai se a subordinação for questionada, ou se sua eficácia prática depender de reorganizações societárias ainda não executadas.'},
        {t:'Aporte de capital e segregação de negócios',anc:'Passos declarados após a homologação: aumento de capital de R$ 3,5 bi a R$ 4 bi e segregação entre distribuição de combustíveis e energia.',cp:'Cai por execução: o aporte depende da convergência entre dois acionistas de referência, e a segregação depende de reorganizações societárias com prazo e custo próprios. Anúncio não é execução.'}],
      risco:[
        {t:'Liquidez no período de transição',anc:'Evento: necessidade de caixa antes da conclusão do aumento de capital e da emissão de novos títulos.',cp:'Caminho até o caixa: encurtamento de prazo por fornecedores e restrição de crédito comercial, que consome capital de giro exatamente quando ele é escasso. Alerta: alteração em condições comerciais divulgada.'},
        {t:'Alteração da estrutura de controle',anc:'Evento: conversão de créditos em títulos representativos de capital, prevista no plano para os credores que optarem pela modalidade correspondente.',cp:'Caminho até o caixa: a composição societária ao fim do processo pode não ser a do início, com efeito sobre decisões de investimento e sobre a própria capacidade de aporte futuro. Alerta: comunicados de conversão e de emissão.'},
        {t:'Corte de investimento como alavanca de liquidez',anc:'Evento: redução do investimento abaixo do mínimo que preserva a capacidade produtiva.',cp:'Caminho até o caixa: alívio imediato e deterioração de produtividade nos períodos seguintes, que reduz a geração que sustenta o plano. Alerta: investimento abaixo do nível histórico de manutenção por períodos consecutivos.'}],
      lacuna:[
        {t:'Cronograma de vencimentos pós-reestruturação',anc:'Onde procurar: plano homologado, escrituras dos novos títulos e comunicados subsequentes.',cp:'Impacto: define se o reperfilamento efetivamente cabe na geração de caixa projetada, ou apenas adia a mesma pergunta.'},
        {t:'Ativos livres para alienação',anc:'Onde procurar: relação de garantias constituídas e notas de ativos onerados.',cp:'Impacto: determina a capacidade real de gerar liquidez por desinvestimento, que é a segunda alavanca do plano.'},
        {t:'Investimento mínimo que preserva a capacidade produtiva',anc:'Onde procurar: plano de investimento divulgado e histórico de manutenção.',cp:'Impacto: separa redução de investimento como escolha de eficiência de redução como consumo de capacidade futura. É a lacuna que distingue recuperação de deterioração lenta.'}]}
  };
// INST·11 — `var ORDEM` (L4111)
export const M13_ANDAIME_ORDEM: { k: keyof typeof M13_ANDAIME; n: string }[] = [{k:'axia',n:'AXIA Energia'},{k:'cemig',n:'Cemig'},{k:'engie',n:'ENGIE Brasil Energia'},
             {k:'eneva',n:'Eneva'},{k:'eqtl',n:'Equatorial Energia'},{k:'raiz',n:'Raízen'}];
export interface M13RotuloAndaime { cl: string; a: string; c: string; br: string; no: string }
// INST·11 — `var ROT` (L4114)
export const M13_ANDAIME_ROTULOS: Record<'tese' | 'risco' | 'lacuna', M13RotuloAndaime> = {
    tese:{cl:'Três teses de investimento',a:'Âncora',c:'Contraponto',
      br:'Cada tese diz <b>como</b> o valor seria criado, por qual via e em que horizonte — não se a companhia é boa. A âncora é o número ou fato verificável que a sustenta; o contraponto é o que a derruba, e é ele que define o que monitorar.',
      no:'Isto não é recomendação de compra, venda ou manutenção, não define preço-alvo e não projeta retorno. São hipóteses formuladas com condição de falha explícita, precisamente para não serem lidas como conclusão.'},
    risco:{cl:'Três riscos críticos',a:'Evento',c:'Caminho até o caixa e alerta',
      br:'Cada risco nomeia um <b>evento observável</b>, o caminho pelo qual ele chega ao caixa da companhia, e o indicador que aparece antes. Risco sem caminho até o caixa é preocupação; risco sem indicador de alerta não é monitorável.',
      no:'Nomear risco não é previsão de que ele ocorrerá, nem juízo sobre a administração da companhia. É a identificação da variável que destrói o caixa primeiro, que é o que qualquer comitê de crédito pergunta antes de qualquer outra coisa.'},
    lacuna:{cl:'Três lacunas de informação',a:'Onde procurar',c:'Impacto na conclusão',
      br:'Cada lacuna nomeia um dado <b>necessário para decidir</b> que não está suficientemente aberto, onde procurá-lo, e como a resposta mudaria a conclusão. Se a resposta não muda nada, não era lacuna — era curiosidade.',
      no:'Lacuna não é erro, irregularidade ou omissão indevida da companhia. A divulgação pode estar integralmente conforme a norma e ainda deixar a lacuna aberta — e a saída correta é sempre uma pergunta formulável, nunca uma acusação.'}
  };

// ── As onze calculadoras ───────────────────────────────────────

// ── m13 INST·01 · Painel de controle setorial (§ MAP, fora de aula) ──
// Consulta pura. Lente × empresa → os dois painéis (`#pn-lens`, `#pn-item`).
// A ordenação (`#pn-ord`) não muda nenhum painel na fonte: muda a ordem e o
// subtítulo dos botões da grade. Como a grade aqui é um campo de opções
// fixas, a lista ordenada, com o subtítulo de cada botão, fecha o veredito —
// é o que a fonte mostra quando se alterna a ordenação.
const i1m13: CalculateFn = (i) => {
  const lente = umDe(i['pn-seg'], ['ctrl', 'cap', 'lac'] as const, 'ctrl');
  const o = umDe(i['pn-ord'], ['arq', 'seg', 'ev'] as const, 'arq');
  const e = M13_PAINEL_EMPRESAS.find((x) => x.k === i['pn-grid']) ?? M13_PAINEL_EMPRESAS[0];
  const ordem = M13_PAINEL_ORDEM[o].map((k) => {
    const x = M13_PAINEL_EMPRESAS.find((y) => y.k === k)!;
    const y = o === 'arq' ? x.arq : o === 'seg' ? x.seg : x.ev;
    return `${y} · ${x.n}`;
  });
  return {
    valores: {},
    veredito: [
      `Lente ativa · ${M13_PAINEL_TITULO_LENTE[lente]}.`,
      semTags(M13_LENTES[lente]),
      `${M13_PAINEL_ROTULO_LENTE[lente]} · ${e.arq} · ${e.n}.`,
      semTags(e[lente]),
      rotulado('Pergunta de verificação', M13_PAINEL_PERGUNTA[lente]),
      fim(rotulado(`Ordenar as dez por ${M13_PAINEL_ROTULO_ORDEM[o]}`, ordem.join('; '))),
    ].join(' '),
  };
};

// ── m13 INST·02 · Calculadora de múltiplo com alavancagem (Aula 01) ──
// Transliteração de `upd()` (L3480–3524), mesma ordem de operação.
const i2m13: CalculateFn = (i) => {
  const eq = numOf(i['mu-eq-n'], 30, 0.5, 120);
  const dl = numOf(i['mu-dl-n'], 25, 0, 120);
  const eb = numOf(i['mu-eb-n'], 10, 0.2, 45);
  const jf = numOf(i['mu-jf-n'], 30, 0, 95);
  const da = numOf(i['mu-da-n'], 25, 0, 80);
  const tx = numOf(i['mu-tx-n'], 34, 0, 45);
  const ev = eq + dl;
  const ee = ev / eb;
  const al = dl / eb;
  const de = dl / ev * 100;
  const ebit = eb * (1 - da / 100);
  const lai = ebit - eb * (jf / 100);
  const lucro = lai > 0 ? lai * (1 - tx / 100) : lai;
  const pe = lucro > 0 ? eq / lucro : NaN;

  const valores: Record<string, number> = { 'mu-ev': ev, 'mu-ee': ee, 'mu-al': al, 'mu-de': de };
  const leituras: string[] = [];
  if (lucro > 0) {
    valores['mu-pe'] = pe;
    valores['mu-lu'] = lucro;
  } else {
    // `mu-pe` e `mu-lu` viram texto neste ramo da fonte.
    leituras.push(rotulado('P / E', 'n.d.'));
    leituras.push(fim(rotulado('Lucro implícito', 'prejuízo de R$ ' + fmt(Math.abs(lucro), 2) + ' bi')));
  }

  let txt: string;
  if (lucro <= 0) {
    txt = '<b>Preço sobre lucro indefinido — e isso é informação, não falha do instrumento.</b> Com despesa financeira de ' + fmt(jf, 0) + '% do resultado operacional e depreciação de ' + fmt(da, 0) + '%, não sobra lucro tributável. O múltiplo de lucro deixa de existir, e a análise migra obrigatoriamente para a lente de crédito: cobertura de juros, cronograma de vencimentos e capacidade de refinanciamento. O valor da firma sobre resultado operacional de ' + fmt(ee, 1) + ' vezes continua calculável e continua não dizendo, sozinho, se é caro ou barato.';
  } else if (al >= 4 && ee >= 8) {
    txt = '<b>Dois sinais na mesma direção, e é a combinação que importa.</b> Alavancagem de ' + fmt(al, 2) + ' vezes com valor da firma a ' + fmt(ee, 1) + ' vezes o resultado operacional significa que ' + fmt(de, 0) + '% do valor da firma é dívida. O múltiplo elevado aqui não está descrevendo expectativa de crescimento — está descrevendo o peso do passivo no numerador. <b>Não conclua "caro":</b> conclua que a variável central desta companhia é a estrutura de capital, e que a próxima pergunta é o cronograma de vencimentos, não o comparável setorial.';
  } else if (al >= 4) {
    txt = '<b>Alavancagem alta com múltiplo contido — combinação que exige a terceira pergunta.</b> Dívida líquida de ' + fmt(al, 2) + ' vezes o resultado operacional e valor da firma a ' + fmt(ee, 1) + ' vezes. Isso pode significar que o mercado precifica risco de crédito, ou que o resultado operacional está inflado por itens não recorrentes, ou que há ativo relevante fora do perímetro consolidado. <b>Nenhuma das três se resolve com múltiplo:</b> resolvem-se com a definição do resultado usado, o cronograma de dívida e a abertura por segmento.';
  } else if (ee >= 8 && al < 2) {
    txt = '<b>Múltiplo elevado com alavancagem baixa — sinais em direções opostas.</b> Com dívida líquida de apenas ' + fmt(al, 2) + ' vezes o resultado operacional, os ' + fmt(ee, 1) + ' vezes de valor da firma <b>não</b> vêm do peso da dívida no numerador. Vêm de expectativa embutida no valor do capital próprio, ou de um denominador temporariamente deprimido. O instrumento se recusa a classificar: a pergunta correta é qual dos dois, e ela se responde com a série histórica do resultado operacional e com o investimento à frente.';
  } else if (ee < 5 && al < 3) {
    txt = '<b>Múltiplo baixo com alavancagem contida — e ainda assim não é conclusão.</b> Valor da firma a ' + fmt(ee, 1) + ' vezes com dívida líquida de ' + fmt(al, 2) + ' vezes. É a combinação que menos exige explicação estrutural, o que a torna a mais perigosa: ativos em fim de concessão são sistematicamente "baratos" por múltiplo até deixarem de existir. <b>Antes de qualquer leitura, verifique o prazo remanescente do direito econômico</b> — é a variável que este instrumento não observa e que pode inverter a leitura inteira.';
  } else {
    txt = '<b>Faixa intermediária nos dois sinais.</b> Valor da firma a ' + fmt(ee, 1) + ' vezes o resultado operacional, alavancagem de ' + fmt(al, 2) + ' vezes, dívida representando ' + fmt(de, 0) + '% do valor da firma, e preço sobre lucro de ' + fmt(pe, 1) + ' vezes. Nenhum dos dois sinais está em território que exija explicação imediata — o que significa que a tese desta companhia não estará nos múltiplos. <b>Vá para a lente de controle e para a lente de lacuna:</b> é onde a diferença competitiva costuma estar quando a estrutura financeira é comum.';
  }
  return { valores, veredito: [...leituras, semTags(txt)].join(' ') };
};

// ── m13 INST·03 · Simulador de DCF de concessão com prazo definido (Aula 02) ──
// Transliteração de `vp()` e `upd()` (L3531–3587). As quatro barras de
// sensibilidade saem como `dc-v1`..`dc-v4`, os ids dos valores na fonte.
// `dc-pp` é composto ("R$ X mi · Y× o valor correto") ou texto
// ("indefinido…") na fonte: vai inteiro como leitura textual.
const vp13 = (taxa: number, hz: number, f1: number, gr: number, ind: number, pi: number) => {
  let vo = 0;
  for (let t = 1; t <= hz; t++) {
    const f = f1 * Math.pow(1 + gr / 100, t - 1);
    vo += f / Math.pow(1 + taxa, t);
  }
  const vi = (ind * pi / 100) / Math.pow(1 + taxa, hz);
  return { vo, vi, tot: vo + vi };
};
const i3m13: CalculateFn = (i) => {
  const se = numOf(i['dc-se-n'], 14.25, 2, 25);
  const ip = numOf(i['dc-ip-n'], 5.16, 0, 15);
  const pr = numOf(i['dc-pr-n'], 0.5, 0, 10);
  const hz = Math.round(numOf(i['dc-hz-n'], 20, 1, 40));
  const f1 = numOf(i['dc-f1-n'], 900, 50, 6000);
  const gr = numOf(i['dc-gr-n'], 1, -4, 6);
  const ind = numOf(i['dc-in-n'], 1200, 0, 12000);
  const pi = numOf(i['dc-pi-n'], 70, 0, 100);
  const rreal = (1 + se / 100) / (1 + ip / 100) - 1;
  let taxa = rreal + pr / 100;
  if (taxa <= 0.001) taxa = 0.001;
  const b = vp13(taxa, hz, f1, gr, ind, pi);
  const perp = (taxa - gr / 100) > 0.002 ? f1 / (taxa - gr / 100) : NaN;
  const c1 = vp13(Math.max(taxa - 0.01, 0.001), hz, f1, gr, ind, pi).tot;
  const c3 = vp13(taxa + 0.01, hz, f1, gr, ind, pi).tot;
  const c4 = vp13(taxa, Math.max(hz - 5, 1), f1, gr, ind, pi).tot;
  const dtaxa = (c1 - c3) / b.tot * 100;
  const dhz = (b.tot - c4) / b.tot * 100;
  const pesoInd = b.vi / b.tot * 100;

  const leitura = fim(rotulado('Se fosse perpetuidade', Number.isFinite(perp) ? 'R$ ' + fmt(perp, 0) + ' mi · ' + fmt(perp / b.tot, 1) + '× o valor correto' : 'indefinido: crescimento ≥ taxa'));

  let txt: string;
  if (pesoInd >= 25) {
    txt = '<b>A indenização responde por ' + fmt(pesoInd, 1) + '% do valor — e ela é a premissa menos verificável do modelo.</b> Com horizonte de ' + hz + ' anos e probabilidade de recebimento de ' + fmt(pi, 0) + '%, mais de um quarto do valor calculado depende de um fluxo cuja base legal, cujo valor de apuração e cuja data de recebimento efetivo ainda não estão fixados. Isso não invalida o modelo: <b>exige que a indenização seja apresentada como linha separada</b>, com a norma, o precedente de cálculo e o prazo processual declarados. Um valor único que a embuta no total esconde exatamente a premissa mais frágil.';
  } else if (hz <= 7) {
    txt = '<b>Horizonte curto: ' + hz + ' anos.</b> Reduzir cinco anos derruba o valor em ' + fmt(dhz, 1) + '%, o que é a maior sensibilidade individual deste modelo. Em concessão com prazo remanescente curto, a variável dominante deixa de ser operacional e passa a ser <b>jurídica</b>: existe prorrogação em negociação, com que condicionantes de investimento, e em que estágio formal? A recomendação de prorrogação por um regulador não é a assinatura do aditivo, e a distância entre as duas é a diferença entre cenário e direito.';
  } else if (Math.abs(dtaxa) >= 22) {
    txt = '<b>Modelo dominado pela taxa: um ponto percentual para cada lado move o valor em ' + fmt(Math.abs(dtaxa), 1) + '%.</b> Com horizonte de ' + hz + ' anos e taxa real de ' + fmt(taxa * 100, 2) + '%, a duração do fluxo torna o resultado altamente sensível ao custo de capital — e é exatamente por isso que a taxa não pode ser escolhida por conveniência. Declare os componentes separadamente: taxa livre de risco real derivada da política monetária vigente, prêmio, e a data em que ambos foram verificados. Sem isso, o valor é uma opinião com casas decimais.';
  } else {
    txt = '<b>Modelo equilibrado entre os componentes.</b> Valor da firma simplificado de R$ ' + fmt(b.tot, 0) + ' milhões, dos quais ' + fmt(pesoInd, 1) + '% vêm da indenização esperada e o restante dos fluxos operacionais até o termo. Sensibilidade de ' + fmt(Math.abs(dtaxa), 1) + '% a um ponto percentual de taxa e de ' + fmt(dhz, 1) + '% a cinco anos de horizonte. <b>Comparação obrigatória:</b> se este mesmo fluxo fosse tratado como perpetuidade, o resultado apareceria como ' + (Number.isFinite(perp) ? fmt(perp / b.tot, 1) + ' vezes maior' : 'indefinido') + ' — a diferença entre modelar um direito que expira e supor que ele não expira.';
  }
  return {
    valores: {
      'dc-tx': taxa * 100,
      'dc-vo': b.vo,
      'dc-vi': b.vi,
      'dc-ev': b.tot,
      'dc-pw': b.vi / b.tot * 100,
      'dc-v1': c1,
      'dc-v2': b.tot,
      'dc-v3': c3,
      'dc-v4': c4,
    },
    veredito: `${leitura} ${semTags(txt)}`,
  };
};

// ── m13 INST·04 · Roteiro cronometrado de leitura (Aula 03) ──
// Documento × etapa → `#rt-item`. Na fonte a grade de etapas é refeita a
// cada troca de documento e volta para a primeira etapa (`sel=lista()[0].k`).
// Aqui a grade é um campo só com as quinze etapas; etapa de outro documento
// tem o mesmo efeito da troca na fonte: a primeira etapa do documento ativo.
const i4m13: CalculateFn = (i) => {
  const doc = umDe(i['rt-seg'], ['rel', 'fre'] as const, 'rel');
  const lista = M13_ETAPAS_LEITURA[doc];
  const e = lista.find((x) => x.k === i['rt-grid']) ?? lista[0];
  return {
    valores: {},
    veredito: [
      `${e.y} · ${doc === 'rel' ? 'Release trimestral' : 'Formulário de Referência'} · ${e.n}.`,
      semTags(e.b),
      rotulado('Esta etapa precisa deixar respondido', e.q),
    ].join(' '),
  };
};

// ── m13 INST·05 · Verificador de lacuna (Aula 03) ──
// Trecho × vista → `#lc-item`. Seis trechos (INST·05, decisão do Founder).
const i5m13: CalculateFn = (i) => {
  const e = M13_TRECHOS_LACUNA.find((x) => x.k === i['lc-grid']) ?? M13_TRECHOS_LACUNA[0];
  const l = umDe(i['lc-seg'], ['cat', 'perg', 'imp'] as const, 'cat');
  return {
    valores: {},
    veredito: [
      `${e.y} · ${M13_LACUNA_VISTA[l]} · ${e.n}.`,
      rotulado('Trecho hipotético', e.tr),
      semTags(e[l]),
    ].join(' '),
  };
};

// ── m13 INST·06 · Classificador de arquétipo de controle (Aula 04) ──
// Caso → arquétipo (tabela fixa) → `#ct-item` e os três cartões de `#ct-out`.
const i6m13: CalculateFn = (i) => {
  const c = M13_CASOS_CONTROLE.find((x) => x.k === i['ct-grid']) ?? M13_CASOS_CONTROLE[0];
  const a = M13_ARQUETIPOS[c.a];
  return {
    valores: {},
    // O arquétipo calculado, para a previsão por escolha (modulos-v3/m13.ts). Não é saída
    // de tela: `ct-arq` não está em `outputs`, e o veredito já o mostra.
    textos: { 'ct-arq': a.n },
    veredito: [
      fim(rotulado('Arquétipo identificado', a.n)),
      `Quem decide de fato. ${semTags(a.dec)}`,
      rotulado('Nota da companhia', semTags(c.nota)),
      rotulado('Comportamento sob estresse', semTags(a.est)),
      rotulado('Pergunta de verificação', a.ver),
      rotulado('O que não concluir', M13_ARQUETIPO_NAO_CONCLUIR),
    ].join(' '),
  };
};

// ── m13 INST·07 · Comparador de participação e voto (Aula 04) ──
// Situação → as duas colunas de `#pv-dual` e `#pv-note`. Os "valores" das
// colunas são TEXTO na fonte ('68', 'relevante', '45 e 30') — vão no veredito.
const i7m13: CalculateFn = (i) => {
  const c = M13_CASOS_PARTICIPACAO_VOTO.find((x) => x.k === i['pv-grid']) ?? M13_CASOS_PARTICIPACAO_VOTO[0];
  const valor = (v: string, u: string) => (u.startsWith('%') ? `${v}${u}` : `${v} ${u}`);
  return {
    valores: {},
    veredito: [
      fim(rotulado(c.ka, valor(c.va, c.ua))),
      c.ma,
      fim(rotulado(c.kb, valor(c.vb, c.ub))),
      c.mb,
      `Mecanismo e consequência · ${c.n}.`,
      semTags(c.mec),
    ].join(' '),
  };
};

// ── m13 INST·08 · Régua de estrutura de capital e cobertura (Aula 05) ──
// Transliteração de `servico()` e `upd()` (L3826–3876), mesma ordem.
const servico13 = (dv: number, kd: number, pz: number): number => {
  const i = kd / 100;
  if (i <= 0) return dv / pz;
  return dv * i / (1 - Math.pow(1 + i, -pz));
};
const i8m13: CalculateFn = (i) => {
  const cx = numOf(i['ds-cx-n'], 2100, 100, 9000);
  const alv = numOf(i['ds-al-n'], 70, 0, 90);
  const kd = numOf(i['ds-kd-n'], 7.5, 1, 16);
  const pz = Math.round(numOf(i['ds-pz-n'], 15, 3, 30));
  const cf = numOf(i['ds-cf-n'], 235, 10, 1200);
  const mn = numOf(i['ds-mn-n'], 1.25, 1, 2.5);
  const lk = numOf(i['ds-lk-n'], 1.35, 1, 3);
  const ch = numOf(i['ds-ch-n'], 10, 0, 45);
  const dv = cx * alv / 100, eq = cx - dv;
  const sv = servico13(dv, kd, pz);
  const d0 = sv > 0 ? cf / sv : NaN;
  const cfc = cf * (1 - ch / 100);
  const d1 = sv > 0 ? cfc / sv : NaN;
  const quedaMin = cf > 0 ? (1 - (mn * sv) / cf) * 100 : NaN;

  // `d0`/`d1` são NaN sem dívida (proporção 0%): a fonte mostra "—". Aqui a
  // saída fica de fora de `valores`, e o painel não a desenha.
  const valores: Record<string, number> = { 'ds-dv': dv, 'ds-eq': eq, 'ds-sv': sv };
  if (Number.isFinite(d0)) valores['ds-d0'] = d0;
  if (Number.isFinite(d1)) valores['ds-d1'] = d1;
  const leituras: string[] = [];
  if (quedaMin > 0) valores['ds-be'] = quedaMin;
  else leituras.push(fim(rotulado('Choque até o mínimo', 'já abaixo do mínimo')));

  const folgaLk = d0 - lk, folgaMn = d0 - mn;
  let txt: string;
  if (lk < mn) {
    txt = '<b>Parâmetros contratuais incoerentes: o gatilho de bloqueio de dividendos (' + fmt(lk, 2) + '×) está abaixo do mínimo de covenant (' + fmt(mn, 2) + '×).</b> Nessa configuração o bloqueio nunca protege ninguém: quando a cobertura cai o suficiente para acioná-lo, o inadimplemento técnico já ocorreu. O bloqueio existe para dar ao credor um sinal <b>antes</b> do descumprimento; posicioná-lo abaixo do mínimo elimina essa função. Corrija a hierarquia antes de ler qualquer outro resultado deste instrumento.';
  } else if (folgaMn <= 0) {
    txt = '<b>Cobertura de ' + fmt(d0, 2) + '× já no cenário base, abaixo do mínimo de ' + fmt(mn, 2) + '×.</b> Isso caracteriza inadimplemento técnico desde o primeiro ano, e a estrutura não é financiável nesta configuração. As alavancas são três, e nenhuma é gratuita: reduzir a proporção de dívida — hoje em ' + fmt(alv, 0) + '% —, alongar o prazo de ' + pz + ' anos, ou esculpir a amortização para acompanhar o perfil do caixa. <b>Aumentar o caixa projetado não é alavanca:</b> é premissa, e mudá-la para fazer a conta fechar é exatamente o defeito que o teste de sanidade de fontes e usos existe para pegar.';
  } else if (d1 < mn) {
    txt = '<b>Dois sinais cruzados, e o segundo é o que decide.</b> No cenário base a cobertura é de ' + fmt(d0, 2) + '×, acima do mínimo — mas um choque de ' + fmt(ch, 0) + '% no caixa disponível a leva a ' + fmt(d1, 2) + '×, abaixo do mínimo de ' + fmt(mn, 2) + '×. A margem até o descumprimento é de apenas ' + fmt(quedaMin, 1) + '% de queda. <b>Uma estrutura que só funciona no cenário base não é uma estrutura financiável:</b> credores modelam geração em percentis adversos de excedência, estresse de preço, atraso de obra e custo acima do orçado — e frequentemente correlacionados entre si.';
  } else if (d1 < lk) {
    txt = '<b>Resiste ao mínimo, não resiste ao bloqueio.</b> Cobertura base de ' + fmt(d0, 2) + '× e de ' + fmt(d1, 2) + '× sob choque de ' + fmt(ch, 0) + '%: acima do mínimo de ' + fmt(mn, 2) + '× e abaixo do gatilho de ' + fmt(lk, 2) + '×. O projeto continua adimplente e <b>o capital próprio para de receber</b>. Para o credor, é o desenho funcionando como previsto; para o acionista, é o retorno adiado para além do horizonte de modelagem. As duas leituras são corretas e é por isso que a taxa interna de retorno do capital próprio no cenário base não descreve esta estrutura.';
  } else if (folgaLk >= 0.35 && alv <= 70) {
    txt = '<b>Folga em ambos os sinais.</b> Cobertura base de ' + fmt(d0, 2) + '× e de ' + fmt(d1, 2) + '× sob choque de ' + fmt(ch, 0) + '%, ambas acima do gatilho de bloqueio de ' + fmt(lk, 2) + '×, com proporção de dívida de ' + fmt(alv, 0) + '%. Seria necessária uma queda de ' + fmt(quedaMin, 1) + '% no caixa disponível para atingir o mínimo. <b>A pergunta que sobra não é de cobertura, é de eficiência:</b> uma estrutura com folga ampla pode estar subalavancada, deixando retorno do capital próprio na mesa — e a decisão entre folga e alavancagem é de tolerância a risco, não de cálculo.';
  } else {
    txt = '<b>Cobertura adequada com folga estreita — e as duas coisas precisam ser ditas juntas.</b> Base de ' + fmt(d0, 2) + '×, choque de ' + fmt(ch, 0) + '% levando a ' + fmt(d1, 2) + '×, mínimo de ' + fmt(mn, 2) + '× e gatilho de ' + fmt(lk, 2) + '×, com queda tolerada de ' + fmt(quedaMin, 1) + '% até o mínimo. A estrutura passa nos testes do primeiro ano. <b>O primeiro ano não é o teste:</b> a cobertura precisa ser calculada em todos os períodos, com amortização esculpida ao perfil do caixa, e o risco migra para o fim do prazo se houver saldo residual relevante a refinanciar.';
  }
  return { valores, veredito: [...leituras, semTags(txt)].join(' ') };
};

// ── m13 INST·09 · Matriz de risco em duas lentes (Aula 06) ──
// Risco × lente → `#rk-item` e os dois cartões de `#rk-out`. Oito riscos por
// duas lentes, dezesseis combinações (QA-M13-A06).
const i9m13: CalculateFn = (i) => {
  const e = M13_RISCOS.find((x) => x.k === i['rk-grid']) ?? M13_RISCOS[0];
  const l = umDe(i['rk-seg'], ['emp', 'prj'] as const, 'emp');
  return {
    valores: {},
    veredito: [
      `${l === 'emp' ? 'Empresa aberta' : 'Sociedade de projeto'} · Risco ${e.n.toLowerCase()}.`,
      semTags(e[l]),
      rotulado('Mitigação', e.mit),
      rotulado('Indicador de alerta', e.alr),
    ].join(' '),
  };
};

// ── m13 INST·10 · Comparador empresa × indicador (Aula 07) ──
// Indicador → a tabela das dez linhas (`#cp-tab`) e a ressalva (`#cp-note`).
// A tabela sai linha a linha: "Empresa — valor (subtítulo)".
const i10m13: CalculateFn = (i) => {
  const k = umDe(i['cp-seg'], ['ctrl', 'seg', 'alav', 'ind', 'ev'] as const, 'ctrl');
  const linhas = M13_COMPARADOR_EMPRESAS.map((e) => `${e.n} — ${e[k][0]} (${e[k][1]})`);
  return {
    valores: {},
    veredito: [
      fim(rotulado(`Empresa · ${M13_COMPARADOR_TITULOS[k]}`, linhas.join('; '))),
      `Ressalva de comparabilidade · ${M13_COMPARADOR_TITULOS[k]}.`,
      semTags(M13_COMPARADOR_RESSALVAS[k]),
    ].join(' '),
  };
};

// ── m13 INST·11 · Andaime de tese de investimento (Aula 08) ──
// Empresa × bloco → `#an-bd`: os três itens, cada um com âncora e contraponto.
const i11m13: CalculateFn = (i) => {
  const k = umDe(i['an-grid'], M13_ANDAIME_ORDEM.map((o) => o.k), 'axia');
  const bloco = umDe(i['an-nav'], ['tese', 'risco', 'lacuna'] as const, 'tese');
  const d = M13_ANDAIME[k];
  const r = M13_ANDAIME_ROTULOS[bloco];
  const itens = d[bloco].map((o) => [fim(o.t), rotulado(r.a, o.anc), rotulado(r.c, o.cp)].join(' '));
  return {
    valores: {},
    veredito: [
      `${d.n} · ${r.cl}.`,
      ...itens,
      rotulado('Como ler este bloco', semTags(r.br)),
      rotulado('O que este bloco não é', r.no),
    ].join(' '),
  };
};

const CALCULOS: Record<string, CalculateFn> = {
  // O `m13-inst-01` é do § MAP, fora de aula.
  'm13-inst-01': i1m13,
  'm13-inst-02': i2m13,
  'm13-inst-03': i3m13,
  'm13-inst-04': i4m13,
  'm13-inst-05': i5m13,
  'm13-inst-06': i6m13,
  'm13-inst-07': i7m13,
  'm13-inst-08': i8m13,
  'm13-inst-09': i9m13,
  'm13-inst-10': i10m13,
  'm13-inst-11': i11m13,
};

// Todo veredito deste módulo já sai formatado em pt-BR pelo próprio porte (ponto só como
// separador de milhar: "Lei nº 14.948", "4.818×", "R$ 8.854 milhões"). `vereditoPtBr` diz
// à tela para não trocar ponto por vírgula (medido em todos os cenários das opções e dos
// extremos das faixas: nenhum ponto decimal).
export const CALCULADORAS: Record<string, CalculateFn> = Object.fromEntries(
  Object.entries(CALCULOS).map(([id, fn]) => [id, ((i) => ({ ...fn(i), vereditoPtBr: true })) as CalculateFn]),
);
