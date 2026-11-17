// Calculadoras novas ou corrigidas do M14 (porte verbatim do script da fonte).
// Posse: a sessão de porte do M14. Uma chave aqui SUBSTITUI a de mesmo id em
// INSTRUMENT_CALCULATORS — é assim que um conserto (Q05/Q07) entra sem editar o arquivo grande.
//
// TRANSLITERAÇÃO do `<script>` de `Alexandria modulos/alexandria_modulo14.html`
// (L3308–L4229), uma função por INST·NN. As tabelas de dado do script estão no bloco
// de dados gerados logo abaixo dos helpers, gerado da extração. Conferência: o script
// ORIGINAL é executado (tools/alexandria-dados/porte/verificar-instrumentos-m14.mjs) e
// cada saída e cada veredito destas funções tem de bater com o que ele escreve, num
// leque de cenários.
//
// Diferenças deliberadas em relação ao script, e só estas:
//   · CONSERTOS da própria fonte (decisões Q05, D01, D02, QA-M14-02b — ver
//     docs/alexandria-v3/porte/m14.md): INST·07 `en = vol*36` (era vol*36/1000);
//     INST·08 `evit = energiaMJ*dic/1e6` com `dic` em gCO₂e/MJ, como o rótulo do campo
//     diz (era % do fóssil), o veredito diz "gCO₂e/MJ" no lugar de "%", e o etanol usa
//     21,1 MJ/L (o do gabarito do Ex 13; o script dizia 21,3). O verificador aplica os
//     mesmos consertos como remendo textual ao script antes de executá-lo.
//   · Cada saída vai em `textos` com a formatação exata do script ("R$ 0,519/km",
//     "30% a 65%", "Nenhum"); `valores` guarda o número, que serve à previsão. O
//     veredito é o innerHTML do script (com <b>), e `vereditoPtBr` porque `fmt` já é pt-BR.
//   · Explorador (INST·01, 04, 09, 10): cada campo dos painéis do script vira uma saída
//     textual (rótulo da fonte), na ordem do painel.

import type { CalculateFn, EntradaInstrumento } from '../alexandria-instrument-calculators';

// ── helpers do script (L3244–L3252), mesma semântica ─────────
type E = Record<string, EntradaInstrumento>;
const clamp = (v: number, a: number, b: number) => (Number.isNaN(v) ? a : v < a ? a : v > b ? b : v);
/** `numOf(el, def, a, b)`: campo ausente ou não numérico → padrão; senão, preso à faixa. */
function numOf(i: E, id: string, def: number, a: number, b: number): number {
  const x = i[id];
  if (x === undefined || x === '') return def;
  const v = typeof x === 'number' ? x : parseFloat(String(x).replace(',', '.'));
  return Number.isNaN(v) ? def : clamp(v, a, b);
}
/** `segVal(...) || padrão`. */
const sel = (i: E, id: string, def: string): string => {
  const x = i[id];
  return x === undefined || x === '' ? def : String(x);
};
/** `fmt(n, d)`: toLocaleString pt-BR com d casas fixas; NaN/∞ → "—". */
const fmt = (n: number, d = 0) =>
  Number.isNaN(n) || !Number.isFinite(n) ? '—' : n.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });

// <dados-gerados>
// GERADO por tools/alexandria-dados/porte/gerar-instrumentos-m14.mjs a partir de
// docs/alexandria-v2/extraction/m14/instrumentos.json (`dados_do_script`, literais avaliados do
// script da fonte). Não editar à mão: rode o gerador.
/** INST·01 · `ROTAS` (L3311–L3372). */
const I01_ROTAS = {
  "cana1g": {
    "n": "Etanol de cana · 1G",
    "insumo": "Caldo e melaço de cana-de-açúcar",
    "conv": "Moagem, fermentação, destilação e — para o anidro — desidratação",
    "prod": "Etanol hidratado e etanol anidro",
    "merc": "Bomba (hidratado) e mistura obrigatória (anidro)",
    "org": "ANP para especificação; CNPE para o teor de mistura",
    "matriz": "Matriz energética · transportes",
    "conc": "Açúcar, pelo mesmo ATR",
    "gi": "Cana-de-açúcar",
    "gp": "Líquido de ciclo Otto",
    "gs": "Sazonal por safra",
    "go": "ANP + teor fixado pelo CNPE",
    "nota": "A rota de referência do setor. Todo número dela precisa de ano-safra, porque o ciclo do Centro-Sul atravessa dois anos-calendário — e precisa do mix, porque o mesmo ATR poderia ter virado açúcar."
  },
  "milho": {
    "n": "Etanol de milho",
    "insumo": "Milho, sobretudo de segunda safra",
    "conv": "Moagem do grão, liquefação, sacarificação, fermentação e destilação",
    "prod": "Etanol, mais DDGS, óleo de milho e dióxido de carbono biogênico",
    "merc": "Mesmos mercados da rota de cana; coprodutos em mercados próprios",
    "org": "ANP — mesma especificação de produto da rota de cana",
    "matriz": "Matriz energética · transportes",
    "conc": "Milho para ração, exportação e alimentação humana",
    "gi": "Milho",
    "gp": "Líquido de ciclo Otto",
    "gs": "Operação quase contínua",
    "go": "ANP · sem teor próprio",
    "nota": "Grão armazenável quebra a sazonalidade de safra — e o preço disso é uma fonte térmica externa contratada, que a rota de cana não precisa comprar e que entra na intensidade de carbono."
  },
  "e2g": {
    "n": "Etanol de 2ª geração",
    "insumo": "Frações celulósicas de bagaço e palha",
    "conv": "Pré-tratamento, hidrólise enzimática, fermentação e separação",
    "prod": "Etanol — a mesma molécula da rota de cana",
    "merc": "Mesmos mercados; prêmio potencial por baixa intensidade de carbono",
    "org": "ANP — sem marco próprio de rota; diferença está na certificação de carbono",
    "matriz": "Matriz energética · transportes, reduzindo a contribuição elétrica da mesma planta",
    "conc": "Vapor de processo, eletricidade exportada e venda de biomassa",
    "gi": "Cana-de-açúcar",
    "gp": "Líquido de ciclo Otto",
    "gs": "Sazonal por safra",
    "go": "ANP · sem teor próprio",
    "nota": "A ilustração mais limpa da Lente de Arbitragem: a fibra que vira etanol aqui é a fibra que não vira vapor nem eletricidade na mesma unidade."
  },
  "biodiesel": {
    "n": "Biodiesel",
    "insumo": "Óleos e gorduras, com predominância de óleo de soja",
    "conv": "Transesterificação com álcool, gerando ésteres e glicerina",
    "prod": "B100 para mistura no diesel A, mais glicerina",
    "merc": "Demanda inteiramente derivada do teor obrigatório no diesel B",
    "org": "ANP para especificação; CNPE para o teor de mistura",
    "matriz": "Matriz energética · transportes",
    "conc": "Óleo de soja para alimentação e exportação; diesel verde e combustível de aviação",
    "gi": "Óleo e gordura",
    "gp": "Líquido de ciclo Diesel",
    "gs": "Operação contínua",
    "go": "ANP + teor fixado pelo CNPE",
    "nota": "O caso mais puro de mercado criado por regra: sem teor obrigatório, a demanda não cai — some. Por isso o percentual, com os seus quatro estados, é o dado central desta rota."
  },
  "biometano": {
    "n": "Biogás e biometano",
    "insumo": "Resíduos orgânicos distribuídos: vinhaça, torta, dejeto, aterro e esgoto",
    "conv": "Digestão anaeróbia e purificação até a especificação",
    "prod": "Biogás para uso local; biometano para rede, indústria, carreta ou frota",
    "merc": "Substituição de gás natural, com camada de certificado de origem",
    "org": "ANP para especificação e certificação; CNPE para a meta de descarbonização do gás",
    "matriz": "Matriz energética como gás; matriz elétrica apenas na parcela cogerada",
    "conc": "Outros destinos do mesmo resíduo, inclusive a emissão do metano",
    "gi": "Resíduo orgânico",
    "gp": "Gasoso",
    "gs": "Contínua, com sazonalidade de substrato",
    "go": "ANP + meta fixada pelo CNPE",
    "nota": "A economia é de logística e de escala mínima, não de tecnologia. O insumo está espalhado, e é a dispersão que define o raio econômico de coleta."
  },
  "cogeracao": {
    "n": "Cogeração a bagaço",
    "insumo": "Bagaço da moagem e palha recolhida",
    "conv": "Queima em caldeira, expansão em turbina, extração de vapor de processo",
    "prod": "Vapor de processo e eletricidade — autoconsumida e exportada",
    "merc": "Ambiente regulado e ambiente livre, com sazonalização declarada",
    "org": "ANEEL e ONS para capacidade e operação; CCEE para comercialização",
    "matriz": "Matriz elétrica — a única rota do módulo cujo produto principal é eletricidade",
    "conc": "Etanol de segunda geração e venda de biomassa, pelo mesmo bagaço",
    "gi": "Cana-de-açúcar",
    "gp": "Eletricidade",
    "gs": "Sazonal por safra",
    "go": "ANEEL, ONS e CCEE",
    "nota": "Três grandezas para a mesma planta, e a sazonalidade como complementaridade à hidrologia. É a rota em que confundir potência instalada com energia exportada custa mais caro."
  }
} as const;
/** INST·01 · `ORD` (L3373–L3378). */
const I01_ORD = {
  "insumo": [
    "cana1g",
    "e2g",
    "cogeracao",
    "milho",
    "biodiesel",
    "biometano"
  ],
  "produto": [
    "cana1g",
    "milho",
    "e2g",
    "biodiesel",
    "biometano",
    "cogeracao"
  ],
  "sazon": [
    "cana1g",
    "e2g",
    "cogeracao",
    "biometano",
    "milho",
    "biodiesel"
  ],
  "orgao": [
    "cana1g",
    "biodiesel",
    "biometano",
    "milho",
    "e2g",
    "cogeracao"
  ]
} as const;
/** INST·01 · `GK` (L3379–L3379). */
const I01_GK = {
  "insumo": "gi",
  "produto": "gp",
  "sazon": "gs",
  "orgao": "go"
} as const;
/** INST·03 · `PERFIS` (L3476–L3483). */
const I03_PERFIS = {
  "mista": {
    "n": "Mista equilibrada",
    "min": 30,
    "max": 65,
    "d": "Unidade com capacidade de cristalização e de destilação instaladas, capaz de deslocar mix dentro de uma faixa ampla ao longo da safra."
  },
  "acuc": {
    "n": "Vocacionada a açúcar",
    "min": 55,
    "max": 80,
    "d": "Unidade com capacidade de cristalização dimensionada acima da destilação, e com piso de açúcar imposto por contrato de fornecimento e por logística de escoamento."
  },
  "dest": {
    "n": "Destilaria autônoma",
    "min": 0,
    "max": 0,
    "d": "Unidade sem capacidade de cristalização: teto de açúcar igual a zero. Nenhum sinal de preço a favor do açúcar desloca um quilo de ATR."
  }
} as const;
/** INST·04 · `D` (L3554–L3590). */
const I04_D = {
  "insumo": {
    "t": "Insumo",
    "a": "Caldo e melaço de cana. Insumo <b>perecível</b>: moagem em horas após a colheita.",
    "b": "Grão de milho, sobretudo de segunda safra. Insumo <b>armazenável</b>, comprável fora da janela de colheita.",
    "c": "Frações celulósicas de bagaço e palha — insumo já presente dentro da própria unidade, e já disputado.",
    "r": "Ressalva: quantidade de insumo não é comparável entre rotas sem converter para a mesma base energética ou para litros de produto. Tonelada de cana, saca de milho e tonelada seca de fibra não se somam."
  },
  "sazon": {
    "t": "Sazonalidade",
    "a": "Sazonal por construção: a operação industrial acompanha a janela de moagem, que no Centro-Sul concentra-se entre abril e novembro.",
    "b": "Operação quase contínua ao longo do ano, limitada por programação industrial e por estoque de grão, não por colheita.",
    "c": "Herda a sazonalidade da unidade que a hospeda: sem moagem não há bagaço fresco, e o estoque de fibra tem limite prático.",
    "r": "Ressalva: comparar volumes anuais entre rotas com sazonalidades diferentes exige declarar se o número é de ano-safra ou de ano-calendário. É a comparação em que a base temporal mais engana."
  },
  "termica": {
    "t": "Fonte térmica",
    "a": "Autossuficiente: o bagaço fornece o vapor de processo e ainda pode gerar excedente elétrico exportável.",
    "b": "Depende de fonte térmica <b>externa contratada</b> — biomassa comprada, cavaco ou gás —, com custo e exposição a preço próprios.",
    "c": "Consome fibra que estaria no circuito térmico da unidade: cada tonelada hidrolisada é vapor ou eletricidade que deixa de existir.",
    "r": "Ressalva: custo de produção por litro não é comparável entre rotas sem declarar a fonte térmica e o seu preço. É a linha de custo que mais varia entre rotas que produzem a mesma molécula."
  },
  "copro": {
    "t": "Coprodutos",
    "a": "Vinhaça, torta de filtro, bagaço e palha — todos com uso alternativo dentro ou fora da unidade, e nenhum deles gratuito.",
    "b": "DDGS para ração, óleo de milho e dióxido de carbono biogênico — cada um com mercado, especificação e logística próprios.",
    "c": "Lignina e resíduos de processo, com destino energético ou material a definir por projeto.",
    "r": "Ressalva: receita de coproduto só é comparável quando há mercado comprovado à distância econômica. DDGS sem confinamento próximo é custo de disposição, não receita."
  },
  "carb": {
    "t": "Intensidade de carbono",
    "a": "Depende de produtividade agrícola, consumo de diesel na operação, fertilização, raio médio e cogeração renovável cobrindo a demanda térmica.",
    "b": "Depende de origem do grão, secagem, <b>fonte térmica contratada</b> e método de alocação atribuído aos coprodutos.",
    "c": "Tende a ser distinta da rota de primeira geração da mesma unidade, e é o principal argumento comercial da rota.",
    "r": "Ressalva: intensidade de carbono é <b>por unidade produtora certificada</b>, não por rota nem por combustível. Comparar médias de rota esconde a dispersão que decide a nota de cada planta."
  },
  "conc": {
    "t": "Produto concorrente",
    "a": "<b>Açúcar</b>, pelo mesmo ATR, dentro da faixa de alternância da unidade.",
    "b": "<b>Milho para ração, exportação e alimentação humana</b> — e a rota devolve parte do grão como DDGS.",
    "c": "<b>Vapor de processo, eletricidade exportada e venda de biomassa</b> — três destinos, dentro da mesma planta.",
    "r": "Ressalva: o produto concorrente muda completamente o significado de um crescimento de volume. Crescer etanol de cana pode ser deslocamento de mix; crescer etanol de milho é competição com outra cadeia inteira."
  },
  "matur": {
    "t": "Maturidade da rota",
    "a": "Rota madura, com parque instalado de escala nacional e décadas de operação comercial.",
    "b": "Rota em expansão rápida, com parque em construção e nova geografia produtiva se formando.",
    "c": "Rota em estágio inicial em escala comercial: exige prova de rendimento em regime, curva de ramp-up e disponibilidade de fibra.",
    "r": "Ressalva: aplique a régua de maturidade antes de somar qualquer coisa — memorando, estudo conceitual, planta anunciada e planta com contrato e financiamento são estágios que não se somam na mesma tabela."
  }
} as const;
/** INST·05 · `BASES` (L3617–L3622). */
const I05_BASES = {
  "diesel": {
    "n": "diesel B",
    "bio": "biodiesel B100",
    "vig": 15,
    "teto": 25,
    "anun": 20,
    "venc": 16,
    "not": "Em vigor desde 1º de agosto de 2025. Teto legal de 25% na Lei nº 14.993/2024, mediante viabilidade técnica comprovada. Trajetória legal apontando para 20% até março de 2030. B16 com prazo legal de março de 2026 não implementado."
  },
  "gasolina": {
    "n": "gasolina C comum",
    "bio": "etanol anidro",
    "vig": 32,
    "teto": 35,
    "anun": 35,
    "venc": 30,
    "not": "E32 em vigor desde 1º de agosto de 2026 por resolução do conselho, em caráter excepcional e temporário, com 180 dias prorrogáveis uma vez. Teto legal de 35% na Lei nº 14.993/2024, com adoção definitiva condicionada aos testes para E35. E30 foi o teor vigente até 31 de julho de 2026."
  }
} as const;
/** INST·05 · `EST` (L3623–L3632). */
const I05_EST = {
  "vigente": {
    "n": "em vigor",
    "d": "É o único estado que descreve litros efetivamente comercializados hoje. Pode ser citado como fato, com norma e data."
  },
  "teto": {
    "n": "teto legal autorizado",
    "d": "Descreve o máximo que o conselho pode fixar sem lei nova. <b>Não descreve nenhum litro vendido.</b> Citá-lo como se fosse o teor em vigor é o erro mais frequente de material de imprensa sobre este tema."
  },
  "anunciado": {
    "n": "anunciado ou de trajetória",
    "d": "Descreve intenção com data futura, sujeita a condicionante técnica e a deliberação. Citável apenas com a data e a condicionante declaradas."
  },
  "vencido": {
    "n": "prazo legal vencido e não implementado",
    "d": "Existe no texto da lei, a data passou, e o percentual não entrou em vigor. É o estado que só aparece para quem confere a resolução depois de ler a lei."
  }
} as const;
/** INST·07 · `R` (L3780–L3789). */
const I07_R = {
  "local": {
    "n": "térmica local",
    "fix": 0.05,
    "km": 0.0002,
    "esc": 2,
    "d": "Sem compressão e sem frete longo. A restrição não é econômica, é de localização: exige cliente térmico junto à fonte, com demanda compatível e contínua."
  },
  "gnc": {
    "n": "comprimido em carreta",
    "fix": 0.45,
    "km": 0.0035,
    "esc": 8,
    "d": "Compressão, cilindros, frete e retorno vazio da carreta. É a rota que mais degrada com distância, e a que mais depende de escala para diluir o investimento em compressão."
  },
  "rede": {
    "n": "injeção em rede",
    "fix": 0.35,
    "km": 0.0008,
    "esc": 12,
    "d": "Escala e fungibilidade física com o gás natural, ao custo de qualidade, ponto de conexão, tarifa de acesso e capacidade disponível na malha — quatro condições que não dependem do projeto."
  },
  "frota": {
    "n": "veicular dedicado",
    "fix": 0.55,
    "km": 0.003,
    "esc": 6,
    "d": "Desloca diesel e reduz emissões locais, mas exige frota adaptada, estação de abastecimento e contrato de prazo longo dos dois lados."
  }
} as const;
/** INST·08 · `R` (L3856–L3869). */
const I08_R = {
  "e1g": {
    "n": "etanol de cana · 1G",
    "u": "milhões de litros",
    "us": "mi L",
    "mj": 21.3,
    "ref": 87.4,
    "rn": "gasolina A",
    "cr": "CBIO",
    "d": "Rota madura no programa, com nota de eficiência calculada por unidade produtora a partir de produtividade agrícola, consumo de diesel na operação, fertilização e cobertura térmica por bagaço."
  },
  "milho": {
    "n": "etanol de milho",
    "u": "milhões de litros",
    "us": "mi L",
    "mj": 21.3,
    "ref": 87.4,
    "rn": "gasolina A",
    "cr": "CBIO",
    "d": "A nota depende fortemente da <b>fonte térmica contratada</b> e do método de alocação atribuído aos coprodutos — duas variáveis que não existem na rota de cana, e que produzem dispersão grande entre plantas da mesma rota."
  },
  "bio": {
    "n": "biodiesel",
    "u": "milhões de litros",
    "us": "mi L",
    "mj": 32.6,
    "ref": 86.4,
    "rn": "diesel A",
    "cr": "CBIO",
    "d": "A nota depende da matéria-prima: soja, sebo, óleo residual e outras oleaginosas entram no cálculo com trajetórias distintas, e a mesma planta pode ter notas diferentes conforme a cesta de insumos do período."
  },
  "bmet": {
    "n": "biometano",
    "u": "milhões de Nm³",
    "us": "mi Nm³",
    "mj": 36,
    "ref": 77,
    "rn": "gás natural fóssil",
    "cr": "CBIO e CGOB",
    "d": "Rota com <b>dois instrumentos possíveis sobre o mesmo lastro</b>: o crédito de descarbonização e a garantia de origem. A norma admite emissão concomitante sobre a mesma nota fiscal, desde que o registro declare expressamente a concomitância — o que transforma a pergunta de auditoria de \"houve dupla contagem?\" em \"a concomitância foi declarada, e o comprador sabe o que está comprando?\"."
  }
} as const;
/** INST·08 · `C` (L3870–L3874). */
const I08_C = {
  "vigente": {
    "n": "certificado vigente",
    "f": 1
  },
  "renov": {
    "n": "em renovação",
    "f": 1
  },
  "sem": {
    "n": "sem certificação",
    "f": 0
  }
} as const;
/** INST·09 · `DEST` (L3959–L3967). */
const I09_DEST = [
  {
    "k": "acucar",
    "n": "Açúcar"
  },
  {
    "k": "etanol",
    "n": "Etanol"
  },
  {
    "k": "eletr",
    "n": "Vapor e eletricidade"
  },
  {
    "k": "bmet",
    "n": "Biometano"
  },
  {
    "k": "diesel",
    "n": "Biodiesel e diesel renovável"
  },
  {
    "k": "racao",
    "n": "Ração e alimento"
  },
  {
    "k": "mat",
    "n": "Uso material"
  }
] as const;
/** INST·09 · `M` (L3968–L4084). */
const I09_M = {
  "cana": {
    "n": "cana-de-açúcar",
    "acucar": {
      "s": "sim",
      "c": "Etanol, pelo mesmo ATR",
      "d": "Destino central e histórico da cana. A unidade com flexibilidade de mix decide entre açúcar e etanol dentro de uma faixa, e a decisão é tomada safra a safra, às vezes semana a semana.",
      "q": "Um crescimento de produção de açúcar pode ser apenas deslocamento de mix dentro da mesma moagem — e não expansão de cana. Verifique a moagem antes de ler o volume de produto."
    },
    "etanol": {
      "s": "sim",
      "c": "Açúcar, pelo mesmo ATR",
      "d": "Destino alternativo do mesmo ATR, dividido ainda entre anidro e hidratado — dois produtos com demandas de natureza distinta.",
      "q": "É o caso que a Lente de Arbitragem existe para tratar: a mesma tonelada, dois produtos, uma decisão. Volume de etanol crescendo com moagem estável significa açúcar caindo."
    },
    "eletr": {
      "s": "indireto",
      "c": "—",
      "d": "A cana como colmo não vai para a caldeira. Quem vai é o <b>bagaço</b>, depois da extração do caldo, e a palha, quando recolhida.",
      "q": "A combinação existe fisicamente, mas o insumo correto para classificar este destino é bagaço e palha, não cana. Trocar o insumo no seletor muda completamente o painel — e é essa troca que revela a cascata."
    },
    "bmet": {
      "s": "indireto",
      "c": "Fertirrigação e adubação",
      "d": "A rota real parte de <b>vinhaça e torta de filtro</b>, resíduos do processamento, não da cana em si.",
      "q": "A vinhaça já tem uso consolidado em fertirrigação. Direcioná-la à biodigestão não cria valor do nada: desloca um uso existente, e a comparação precisa incluir o custo do fertilizante que deixará de ser substituído."
    },
    "diesel": {
      "s": "nao",
      "c": "—",
      "d": "Combinação <b>não aplicável</b> em escala comercial: a cana não é matéria-prima de biodiesel nem de diesel renovável.",
      "q": "Rotas de conversão de açúcares em hidrocarbonetos existem em desenvolvimento, e nenhuma delas descreve o parque instalado brasileiro hoje. Se aparecer numa apresentação, o pedido correto é a régua de maturidade: memorando, planta-piloto ou planta com contrato?"
    },
    "racao": {
      "s": "marginal",
      "c": "Moagem",
      "d": "Cana forrageira e ponta de cana são usadas como volumoso na pecuária, em circuito local, e não na cadeia industrial sucroenergética.",
      "q": "É um uso real e de escala pequena diante da moagem industrial. Não confunda os dois circuitos ao somar área plantada: nem toda cana plantada entra em usina."
    },
    "mat": {
      "s": "marginal",
      "c": "Etanol e açúcar",
      "d": "Química renovável a partir de açúcares — polímeros, ácidos e intermediários — existe em escala comercial limitada e cresce a partir do mesmo ATR.",
      "q": "Toda expansão desta rota disputa o mesmo ATR que já tem dois destinos consolidados. A pergunta é sempre a mesma: a que preço este destino ganha do açúcar e do etanol?"
    }
  },
  "bagaco": {
    "n": "bagaço e palha",
    "acucar": {
      "s": "nao",
      "c": "—",
      "d": "Combinação <b>não aplicável</b>: o açúcar sai do caldo, e o bagaço é justamente o que sobra depois da extração.",
      "q": "A ordem física importa. Bagaço é resíduo de processo, e nenhum processo o converte de volta em sacarose."
    },
    "etanol": {
      "s": "sim",
      "c": "Vapor, eletricidade e venda de biomassa",
      "d": "É a rota de segunda geração: hidrólise das frações celulósicas para produzir etanol a partir da fibra.",
      "q": "Aqui está o erro mais comum do bloco inteiro — dizer que a 2G aproveita resíduo que seria descartado. Não seria: o bagaço já é o combustível da unidade. Cada tonelada hidrolisada é vapor ou eletricidade que deixa de existir."
    },
    "eletr": {
      "s": "sim",
      "c": "Etanol de 2ª geração e venda de biomassa",
      "d": "Destino consolidado e majoritário: o bagaço responde pela maior parte da bioeletricidade brasileira, com o licor preto da celulose em segundo lugar.",
      "q": "É o destino que sustenta a complementaridade sazonal — a safra do Centro-Sul coincide com o período seco, quando a hidrelétrica recua. Verifique se a energia é exportada ou consumida internamente antes de somá-la à matriz."
    },
    "bmet": {
      "s": "limitado",
      "c": "Vapor e eletricidade",
      "d": "Material lignocelulósico é <b>pouco favorável</b> à digestão anaeróbia convencional: a lignina resiste, e o rendimento em metano é baixo diante do de resíduos ricos em matéria orgânica facilmente degradável.",
      "q": "Quando um projeto de biometano cita bagaço como substrato principal, o pedido correto é o ensaio de potencial bioquímico de metano do substrato específico — não a média da literatura."
    },
    "diesel": {
      "s": "nao",
      "c": "—",
      "d": "Combinação <b>não aplicável</b> em escala comercial no parque brasileiro atual.",
      "q": "Rotas termoquímicas de conversão de biomassa em hidrocarbonetos existem em desenvolvimento. Aplique a régua de maturidade antes de somá-las a qualquer tabela de capacidade."
    },
    "racao": {
      "s": "marginal",
      "c": "Vapor e eletricidade",
      "d": "Bagaço hidrolisado ou tratado é usado como volumoso em confinamento, em escala local e sazonal.",
      "q": "Uso real, mercado pequeno e dependente de distância. Nunca é a variável que decide o destino do bagaço de uma unidade de porte industrial."
    },
    "mat": {
      "s": "limitado",
      "c": "Vapor e eletricidade",
      "d": "Painéis, papel, embalagem moldada e extração de lignina para uso químico. Existe, cresce, e ainda é pequeno diante do volume gerado.",
      "q": "Cada tonelada desviada para uso material também sai do circuito térmico. O balanço energético da unidade precisa fechar antes de a receita material entrar na conta."
    }
  },
  "milho": {
    "n": "milho",
    "acucar": {
      "s": "nao",
      "c": "—",
      "d": "Combinação <b>não aplicável</b> no sentido próprio do termo: o milho produz adoçantes de amido, não açúcar de cana.",
      "q": "A distinção não é vocabular. São cadeias industriais distintas, com plantas, especificações e mercados distintos."
    },
    "etanol": {
      "s": "sim",
      "c": "Ração, exportação e alimentação humana",
      "d": "Rota em expansão rápida no Centro-Oeste, sobretudo a partir do grão de segunda safra, com operação quase contínua ao longo do ano.",
      "q": "Diferente da cana, aqui o concorrente não está dentro da usina — é uma cadeia inteira. E a rota devolve parte do grão ao mercado de ração como DDGS, o que significa que o deslocamento líquido é menor que o volume bruto processado."
    },
    "eletr": {
      "s": "nao",
      "c": "—",
      "d": "Combinação <b>não aplicável</b>: o grão não é o combustível da planta. A rota de milho <b>consome</b> energia térmica de fonte externa contratada — biomassa comprada, cavaco ou gás.",
      "q": "É a assimetria estrutural entre as duas rotas de etanol, e a origem do erro de dizer que \"a usina é autossuficiente em energia\" sem declarar a rota. Na de milho, a fonte térmica é linha de custo e exposição a preço."
    },
    "bmet": {
      "s": "limitado",
      "c": "Ração",
      "d": "A rota parte da vinhaça de milho e de resíduos do processo, não do grão, e depende da escala e da continuidade do efluente.",
      "q": "O substrato tem sazonalidade menor que o da cana, por a planta operar quase o ano inteiro — o que muda o dimensionamento do biodigestor."
    },
    "diesel": {
      "s": "sim",
      "c": "Óleo alimentício e ração",
      "d": "O óleo de milho extraído no processo é matéria-prima de biodiesel — e é o ponto onde as duas cadeias deste módulo se cruzam dentro da mesma planta.",
      "q": "Coproduto com mercado alternativo real. Ele só vira biodiesel quando o preço do biodiesel ganha do preço do óleo alimentício — mais uma arbitragem, dentro de uma rota que já é feita de arbitragens."
    },
    "racao": {
      "s": "sim",
      "c": "Etanol e exportação",
      "d": "Destino histórico e majoritário do milho brasileiro, e principal concorrente da rota de etanol — que devolve ao mesmo mercado o DDGS.",
      "q": "É a combinação que impede de ler o crescimento do etanol de milho como ganho líquido do agro. Parte do grão volta como ração; a pergunta correta é qual o deslocamento líquido, não o volume processado."
    },
    "mat": {
      "s": "limitado",
      "c": "Ração e etanol",
      "d": "Amido industrial, adoçantes e insumos para a indústria química e de papel.",
      "q": "Cadeia estabelecida, com escala própria e independente do ciclo de combustíveis."
    }
  },
  "oleo": {
    "n": "óleo e gordura",
    "acucar": {
      "s": "nao",
      "c": "—",
      "d": "Combinação <b>não aplicável</b>: não há rota de conversão de material graxo em sacarose.",
      "q": "Se aparecer, é erro de classificação de insumo, não hipótese tecnológica."
    },
    "etanol": {
      "s": "nao",
      "c": "—",
      "d": "Combinação <b>não aplicável</b>: etanol vem de açúcares ou de amido, não de material graxo.",
      "q": "A confusão costuma vir de tratar \"biocombustível\" como categoria única. Não é: são moléculas diferentes, com insumos, plantas e mercados diferentes."
    },
    "eletr": {
      "s": "marginal",
      "c": "Biodiesel e oleoquímica",
      "d": "Queima direta em motogerador é possível e economicamente inferior à conversão em biodiesel na quase totalidade dos casos.",
      "q": "Quando aparece, costuma ser solução para óleo residual sem logística de coleta estruturada, não escolha de destino."
    },
    "bmet": {
      "s": "limitado",
      "c": "Biodiesel e ração",
      "d": "Gordura residual entra como cossubstrato em biodigestão, elevando o rendimento de metano — em proporção limitada, sob pena de inibir o processo.",
      "q": "É cossubstrato, não substrato principal. Projetos que dimensionam o biodigestor pela gordura disponível costumam descobrir o limite de inibição depois da partida."
    },
    "diesel": {
      "s": "sim",
      "c": "Óleo alimentício, ração e oleoquímica",
      "d": "Destino central: soja, sebo bovino, óleo residual e outras oleaginosas, cada um com trajetória própria de intensidade de carbono e disponibilidade.",
      "q": "Nesta rota o concorrente é sempre alimentar ou industrial. É por isso que o teor obrigatório de mistura no diesel move preço em cadeias que nada têm a ver com energia — a demanda derivada é a Lente de Política operando sobre o mercado de alimentos."
    },
    "racao": {
      "s": "sim",
      "c": "Biodiesel e oleoquímica",
      "d": "Gordura e farelo são destinos consolidados, com mercado, especificação e preço próprios.",
      "q": "Concorrência direta e permanente. Elevar o teor obrigatório de mistura não cria oleaginosa — desloca a existente."
    },
    "mat": {
      "s": "sim",
      "c": "Biodiesel, ração e alimento",
      "d": "Oleoquímica: tensoativos, lubrificantes, cosméticos e insumos industriais, com valor unitário frequentemente superior ao energético.",
      "q": "É o destino que mais frequentemente ganha do energético em valor por tonelada. Um projeto de biodiesel que assume disponibilidade plena de matéria-prima sem verificar a demanda oleoquímica local está subestimando o próprio custo de insumo."
    }
  },
  "resid": {
    "n": "resíduo orgânico",
    "acucar": {
      "s": "nao",
      "c": "—",
      "d": "Combinação <b>não aplicável</b>.",
      "q": "Sem rota física. Classificação incorreta de insumo."
    },
    "etanol": {
      "s": "nao",
      "c": "—",
      "d": "Combinação <b>não aplicável</b> em escala comercial no Brasil hoje.",
      "q": "Rotas de resíduo sólido urbano a etanol existem em desenvolvimento. Régua de maturidade antes de qualquer tabela."
    },
    "eletr": {
      "s": "sim",
      "c": "Biometano",
      "d": "Biogás queimado em motogerador — rota de menor investimento e de menor exigência de qualidade do gás, porque dispensa a purificação a especificação de biometano.",
      "q": "É a alternativa que todo projeto de biometano precisa vencer no caso base. Gerar eletricidade é mais simples; o biometano só ganha quando existe cliente térmico, veicular ou rede acessível."
    },
    "bmet": {
      "s": "sim",
      "c": "Eletricidade a partir de biogás",
      "d": "Destino central da rota: purificação do biogás a especificação de gás natural, com marco regulatório consolidado entre 2025 e 2026 e primeiro agente certificador de origem credenciado em abril de 2026.",
      "q": "A decisão não é técnica, é de destino de entrega. A régua do INST·07 existe para isso: rota térmica local, comprimido em carreta, injeção em rede ou veicular dedicado mudam mais o resultado que o preço do gás."
    },
    "diesel": {
      "s": "nao",
      "c": "—",
      "d": "Combinação <b>não aplicável</b> por rota direta.",
      "q": "A exceção é a fração graxa separada do resíduo, que pertence à classificação de óleo e gordura, não à de resíduo orgânico genérico."
    },
    "racao": {
      "s": "nao",
      "c": "—",
      "d": "Combinação <b>não aplicável</b>: restrição sanitária, não econômica.",
      "q": "É a única linha deste instrumento em que a barreira é regulatória de saúde animal, e não de preço, escala ou logística."
    },
    "mat": {
      "s": "sim",
      "c": "Biometano e eletricidade",
      "d": "Compostagem e digestato como fertilizante orgânico — e, no caso da biodigestão, o digestato é <b>coproduto</b>, não alternativa.",
      "q": "Aqui os dois destinos convivem: a mesma tonelada gera biometano e devolve digestato. É a única linha do classificador em que a concorrência não é excludente — e por isso mesmo a que mais exige verificar se a receita de fertilizante já está contratada ou é apenas suposta."
    }
  }
} as const;
/** INST·09 · `S` (L4085–L4091). */
const I09_S = {
  "sim": {
    "r": "DESTINO CONSOLIDADO",
    "c": "ok"
  },
  "indireto": {
    "r": "APLICÁVEL POR ROTA INDIRETA — O INSUMO CORRETO É OUTRO",
    "c": "att"
  },
  "limitado": {
    "r": "TECNICAMENTE POSSÍVEL, LIMITADO EM ESCALA",
    "c": "att"
  },
  "marginal": {
    "r": "USO REAL, MERCADO MARGINAL",
    "c": "att"
  },
  "nao": {
    "r": "COMBINAÇÃO NÃO APLICÁVEL",
    "c": "per"
  }
} as const;
/** INST·10 · `E` (L4132–L4193). */
const I10_E = [
  {
    "k": "e1",
    "t": "base",
    "n": "“A gasolina brasileira tem 30% de etanol anidro.”",
    "y": "base temporal",
    "df": "Base temporal vencida — por vinte e quatro horas.",
    "fa": "A norma e a data. O teor de 30% vigorou até 31 de julho de 2026. Desde 1º de agosto de 2026 o teor da gasolina C comum é de <b>32%</b>, por resolução do conselho publicada em edição extra do Diário Oficial em 30 de julho, aprovada na reunião de 14 de julho.",
    "pg": "“Isso é da resolução de qual ano? Porque houve resolução número 9 em 2025 fixando E30, e resolução número 9 em 2026 fixando E32.”",
    "co": "“Desde 1º de agosto de 2026, a gasolina C comum tem 32% de etanol anidro, em caráter excepcional e temporário por 180 dias prorrogáveis uma vez. A premium permanece em 25%.”"
  },
  {
    "k": "e2",
    "t": "base",
    "n": "“O Brasil produz 40,7 bilhões de litros de etanol por ano.”",
    "y": "base temporal",
    "df": "Mistura de base de safra com base de ano-calendário.",
    "fa": "Declarar qual das duas bases. Os 40,69 bilhões de litros são a <b>estimativa de safra 2026/27</b> do primeiro levantamento de abril de 2026. A produção de <b>ano-calendário 2025</b> apurada foi de 35,94 bilhões de litros — quase cinco bilhões de diferença entre dois números igualmente corretos.",
    "pg": "“Esse número é de safra ou de ano-calendário? E é levantamento estimado ou apuração fechada?”",
    "co": "“A estimativa para a safra 2026/27 é de 40,69 bilhões de litros; a produção apurada no ano-calendário de 2025 foi de 35,94 bilhões.”"
  },
  {
    "k": "e3",
    "t": "base",
    "n": "“O biodiesel está em B16 desde março de 2026.”",
    "y": "estado de política",
    "df": "Prazo legal vencido tratado como percentual em vigor.",
    "fa": "A distinção entre o que a lei calendarizou e o que a resolução implementou. A Lei nº 14.993/2024 apontava março de 2026 para o B16; a data passou e o percentual <b>não</b> entrou em vigor. O teor vigente segue sendo B15, desde 1º de agosto de 2025.",
    "pg": "“A lei previa, mas o conselho deliberou? Qual resolução colocou o B16 em vigor?”",
    "co": "“A lei apontava B16 para março de 2026, mas o percentual não foi implementado. O teor em vigor é B15, com teto legal de 25% e trajetória apontando para 20% até março de 2030.”"
  },
  {
    "k": "e4",
    "t": "rota",
    "n": "“Usina de etanol é autossuficiente em energia — ela queima o próprio bagaço.”",
    "y": "rota não declarada",
    "df": "Generalização de uma rota para todas as rotas.",
    "fa": "Declarar a rota. A afirmação descreve a rota de cana, em que o bagaço fornece o vapor de processo e ainda gera excedente exportável. A rota de <b>milho</b> não tem bagaço: depende de fonte térmica externa contratada, que é linha de custo e exposição a preço.",
    "pg": "“Estamos falando de qual rota? Porque em milho a fonte térmica é comprada, e o preço dela entra no custo por litro.”",
    "co": "“Usina de cana é autossuficiente em energia térmica e frequentemente exportadora de eletricidade; usina de milho depende de fonte térmica contratada.”"
  },
  {
    "k": "e5",
    "t": "rota",
    "n": "“O etanol tem intensidade de carbono de tantos gramas por megajoule.”",
    "y": "rota não declarada",
    "df": "Atributo de unidade produtora tratado como atributo de combustível.",
    "fa": "A unidade a que o número se refere. No programa de descarbonização, a nota de eficiência é calculada <b>por unidade produtora certificada</b>, a partir da produtividade agrícola, do consumo de diesel, da fertilização e da fonte térmica daquela planta. Duas usinas da mesma rota, na mesma safra, têm notas diferentes.",
    "pg": "“Essa nota é da unidade específica ou é média da rota? Porque se for média, não serve para precificar o crédito de nenhuma planta.”",
    "co": "“A unidade tal, certificada na safra tal, tem nota de eficiência energético-ambiental de tantos gramas por megajoule.”"
  },
  {
    "k": "e6",
    "t": "rota",
    "n": "“Essa nova planta de etanol vai adicionar excedente elétrico ao sistema.”",
    "y": "rota não declarada",
    "df": "Atribuição de um efeito de uma rota a um projeto de outra rota.",
    "fa": "A rota da planta e o desenho da caldeira. Planta de milho <b>consome</b> energia térmica de fonte externa e não exporta eletricidade a partir do próprio insumo. Mesmo em cana, exportar excedente depende de caldeira de alta pressão, de eficiência no uso de vapor e de conexão sem restrição.",
    "pg": "“É planta de cana ou de milho? E, se for cana, qual a pressão da caldeira e qual o autoconsumo previsto?”",
    "co": "“Planta de cana com caldeira de alta pressão e autoconsumo de tantos por cento tende a exportar tantos gigawatts-hora dentro da safra.”"
  },
  {
    "k": "e7",
    "t": "grand",
    "n": "“A usina tem 80 MW instalados, então gera cerca de 700 GWh por ano.”",
    "y": "grandeza confundida",
    "df": "Potência instalada multiplicada por 8.760 horas numa fonte sazonal.",
    "fa": "Os dias efetivos de safra, a disponibilidade e o autoconsumo. Uma unidade que mói cerca de 210 dias opera aproximadamente 5.040 horas, não 8.760 — e boa parte da geração é absorvida internamente como vapor de processo, antes de qualquer exportação.",
    "pg": "“Quantos dias de safra, qual a disponibilidade e quanto é autoconsumo? Porque a diferença entre gerado e exportado costuma ser metade.”",
    "co": "“80 MW instalados, cerca de 210 dias de safra e autoconsumo de 55% resultam em algo próximo de 350 GWh gerados e 160 GWh exportados.”"
  },
  {
    "k": "e8",
    "t": "grand",
    "n": "“As vendas de hidratado caíram 5,9%, logo a produção caiu na mesma proporção.”",
    "y": "grandeza confundida",
    "df": "Venda tratada como produção.",
    "fa": "A distinção entre as duas séries. A queda de 5,9% no hidratado em 2025 é de <b>vendas</b>. No mesmo ano, a produção de anidro <b>subiu</b> 3,1% — puxada pelo teor obrigatório na gasolina, que é demanda derivada de política, não de escolha do consumidor no posto.",
    "pg": "“Esse número é de vendas, de produção ou de moagem? E é do total ou só do hidratado?”",
    "co": "“As vendas de hidratado caíram 5,9% em 2025, enquanto a produção de anidro cresceu 3,1% no mesmo período.”"
  },
  {
    "k": "e9",
    "t": "grand",
    "n": "“O projeto de biometano tem margem de R$ 1,20 por metro cúbico. É viável.”",
    "y": "grandeza confundida",
    "df": "Margem unitária tratada como viabilidade de projeto.",
    "fa": "A escala e a continuidade do substrato. Margem por metro cúbico não dilui investimento em compressão, medição e infraestrutura de entrega. Um projeto com margem unitária excelente e volume abaixo da referência da rota é o modo mais comum de um caso de biometano falhar.",
    "pg": "“Qual o volume anual, e o substrato está contratado e é contínuo ao longo do ano?”",
    "co": "“O projeto tem margem de R$ 1,20 por metro cúbico sobre volume de tantos milhões de metros cúbicos por ano, com substrato contratado por tantos anos.”"
  },
  {
    "k": "e10",
    "t": "conc",
    "n": "“A produção de etanol de cana cresceu; o setor está em expansão.”",
    "y": "concorrente omitido",
    "df": "Crescimento de produto lido como crescimento de insumo.",
    "fa": "A moagem e o mix. A mesma tonelada de cana produz açúcar ou etanol dentro de uma faixa de alternância. Crescimento de etanol com moagem estável significa açúcar recuando — deslocamento de mix, não expansão. No primeiro levantamento de 2026/27, o etanol cresce 8,5% e o açúcar recua 0,5%.",
    "pg": "“A moagem cresceu quanto? Porque se ela ficou estável, o que cresceu foi a fatia, não o bolo.”",
    "co": "“Com moagem estimada em alta de 5,3%, o etanol cresce 8,5% e o açúcar recua 0,5% — parte do crescimento é expansão e parte é deslocamento de mix.”"
  },
  {
    "k": "e11",
    "t": "conc",
    "n": "“O etanol de milho cresceu 12%; é ganho líquido para o agro.”",
    "y": "concorrente omitido",
    "df": "Volume processado tratado como deslocamento líquido.",
    "fa": "O destino alternativo do grão e o retorno do coproduto. O milho processado sairia para ração, exportação ou alimentação humana; e a rota devolve ao mercado de ração o DDGS. O deslocamento líquido é menor que o volume processado, e a diferença depende da alocação atribuída ao coproduto.",
    "pg": "“Qual o volume de DDGS gerado, e ele encontra confinamento a que distância? Porque DDGS sem comprador próximo é custo de disposição, não receita.”",
    "co": "“A rota processou tantos milhões de toneladas de milho e devolveu tantas ao mercado de ração como DDGS; o deslocamento líquido foi de tanto.”"
  },
  {
    "k": "e12",
    "t": "conc",
    "n": "“A segunda geração aproveita resíduo que hoje é descartado.”",
    "y": "concorrente omitido",
    "df": "Insumo com uso consolidado descrito como resíduo sem destino.",
    "fa": "O uso atual da fibra. O bagaço não é descartado: é o combustível que gera o vapor de processo e a bioeletricidade que responde por parte relevante da matriz elétrica brasileira. Cada tonelada desviada para hidrólise é vapor ou eletricidade que deixa de existir.",
    "pg": "“De onde vem a fibra? Sai da caldeira, do estoque de palha, ou de recolhimento adicional no campo? Porque as três têm custos de oportunidade diferentes.”",
    "co": "“A segunda geração converte fibra que hoje tem destino energético dentro da unidade; o ganho líquido depende de comparar o valor do etanol adicional com o da energia deslocada.”"
  }
] as const;
/** INST·10 · `LB` (L4194–L4194). */
const I10_LB = {
  "base": "Base temporal",
  "rota": "Rota não declarada",
  "grand": "Grandeza confundida",
  "conc": "Concorrente omitido"
} as const;
// </dados-gerados>

type Chave<T> = keyof T & string;
const de = <T extends object>(t: T, k: string, padrao: Chave<T>): T[Chave<T>] =>
  (k in t ? t[k as Chave<T>] : t[padrao]);
/** Sinal "+" do script (`(x>0?'+':'')+fmt(x,d)`). */
const comSinal = (x: number, d: number) => (x > 0 ? '+' : '') + fmt(x, d);

// ── INST·01 — Mapa de rotas (L3308–L3409) ────────────────────
// Explorador de consulta: o painel (mp-flux + mp-panel) sai em `textos`, com os
// rótulos do script. A ordenação (mp-dim) dá o agrupamento de cada rota (`gi/gp/gs/go`).
const ROT_DIM: Record<string, string> = { insumo: 'Insumo de origem', produto: 'Produto final', sazon: 'Sazonalidade', orgao: 'Órgão competente' };
const inst01: CalculateFn = (i) => {
  const d = sel(i, 'mp-dim', 'insumo') as Chave<typeof I01_ORD>;
  const ordem = I01_ORD[d] ?? I01_ORD.insumo;
  const gk = (I01_GK[d] ?? I01_GK.insumo) as 'gi' | 'gp' | 'gs' | 'go';
  // o script reconstrói os chips e pinta o primeiro da ordem; aqui vale a rota
  // escolhida, e na falta dela o primeiro da ordem
  const r = de(I01_ROTAS, sel(i, 'mp-chips', ordem[0]), ordem[0] as Chave<typeof I01_ROTAS>);
  return {
    valores: {},
    textos: {
      'mp-grupo': `${ROT_DIM[d] ?? ROT_DIM.insumo} · ${r[gk]}`,
      'mp-insumo': r.insumo,
      'mp-conv': r.conv,
      'mp-prod': r.prod,
      'mp-merc': r.merc,
      'mp-org': r.org,
      'mp-matriz': r.matriz,
      'mp-conc': `<b>${r.conc}</b>`,
      'mp-nota': r.nota,
    },
    vereditoPtBr: true,
  };
};

// ── INST·02 — Paridade por custo/km (L3411–L3471) ────────────
const inst02: CalculateFn = (i) => {
  const pg = numOf(i, 'pd-pg-n', 6.2, 3, 12);
  const pe = numOf(i, 'pd-pe-n', 4.15, 2, 10);
  const cg = numOf(i, 'pd-cg-n', 11.5, 4, 22);
  const ce = numOf(i, 'pd-ce-n', 8.0, 3, 18);
  const ix = pe / pg;
  const ef = ce / cg;
  const kg = pg / cg, ke = pe / ce;
  const dif = ((ke - kg) / kg) * 100;
  const base =
    ' O índice de preço é ' + fmt(ix * 100, 1) + '% e a razão de rendimento medida é ' +
    fmt(ef * 100, 1) + '% — os dois sinais precisam ser lidos juntos, e a regra dos 70% não entra na conta.';
  let t: string;
  if (dif <= -5) {
    t = 'ETANOL MAIS BARATO POR QUILÔMETRO, COM MARGEM CONFORTÁVEL.' + base +
      ' Diferença de ' + fmt(Math.abs(dif), 1) + '% a favor do etanol. Antes de tratar isso como conclusão: ' +
      'o rendimento foi medido no mesmo veículo, mesmo trajeto e mesmo período? E o par de preços é da sua praça, ' +
      'com a carga tributária estadual que ela carrega? Sem as duas respostas, isto é triagem, não decisão.';
  } else if (dif <= -2) {
    t = 'ETANOL MAIS BARATO POR QUILÔMETRO, COM MARGEM ESTREITA.' + base +
      ' Diferença de ' + fmt(Math.abs(dif), 1) + '%, dentro da faixa em que uma variação normal de preço semanal ' +
      'ou um erro de medição de consumo inverte o resultado. Trate como empate técnico até ter três ' +
      'abastecimentos completos medidos.';
  } else if (dif < 2) {
    t = 'INDIFERENÇA TÉCNICA ENTRE OS DOIS COMBUSTÍVEIS.' + base +
      ' A diferença de ' + fmt(Math.abs(dif), 1) + '% está dentro do ruído de medição. A decisão sai de outros ' +
      'fatores — disponibilidade na sua rota, tempo de abastecimento, política de manutenção — e não do preço. ' +
      'Este é exatamente o caso em que a regra dos 70% produziria uma conclusão falsamente confiante.';
  } else if (dif < 5) {
    t = 'GASOLINA MAIS BARATA POR QUILÔMETRO, COM MARGEM ESTREITA.' + base +
      ' Diferença de ' + fmt(dif, 1) + '% a favor da gasolina. Margem que uma variação de preço reverte; ' +
      'confirme o rendimento com etanol antes de mudar hábito, porque ele é o número mais frequentemente ' +
      'estimado em vez de medido.';
  } else {
    t = 'GASOLINA MAIS BARATA POR QUILÔMETRO, COM MARGEM CONFORTÁVEL.' + base +
      ' Diferença de ' + fmt(dif, 1) + '% a favor da gasolina. Se o índice de preço estiver abaixo de 70% e ainda ' +
      'assim a gasolina ganhar, a explicação está no rendimento do veículo — e é a demonstração direta de por que ' +
      'o limiar de 70% é aproximação histórica e não lei.';
  }
  return {
    valores: { 'pd-ix': ix * 100, 'pd-ef': ef * 100, 'pd-cg': kg, 'pd-ce': ke, 'pd-df': dif },
    textos: {
      'pd-ix': fmt(ix * 100, 1) + '%',
      'pd-ef': fmt(ef * 100, 1) + '%',
      'pd-cg': 'R$ ' + fmt(kg, 3) + '/km',
      'pd-ce': 'R$ ' + fmt(ke, 3) + '/km',
      'pd-df': comSinal(dif, 1) + '%',
    },
    veredito: t,
    vereditoPtBr: true,
  };
};

// ── INST·03 — Régua de mix açúcar-etanol (L3473–L3549) ───────
const inst03: CalculateFn = (i) => {
  const P = de(I03_PERFIS, sel(i, 'mx-perf', 'mista'), 'mista');
  const pa = numOf(i, 'mx-pa-n', 1.18, 0.4, 2.5);
  const pe = numOf(i, 'mx-pe-n', 1.26, 0.4, 2.5);
  const mx = numOf(i, 'mx-mx-n', 48, 0, 100);
  const premio = ((pa - pe) / ((pa + pe) / 2)) * 100;
  const alvo = premio > 0 ? P.max : P.min;
  const atual = clamp(mx, P.min, P.max);
  const desloc = alvo - atual;
  const fixo = (P.min as number) === (P.max as number);
  const sinal = Math.abs(premio) < 1.5 ? 'indiferente' : premio > 0 ? 'açúcar' : 'etanol';
  const b = ' Perfil industrial: ' + P.n + '. ' + P.d;
  let t: string;
  if (fixo) {
    t = 'ARBITRAGEM INEXECUTÁVEL POR RESTRIÇÃO ESTRUTURAL.' + b +
      ' O preço relativo aponta para ' + sinal + ', e isso não altera nada: sem capacidade de cristalização, ' +
      'o sinal de preço não tem para onde deslocar ATR. Este é o caso extremo do ponto da aula — ' +
      'preço relativo é um sinal, capacidade de alternância é a restrição, e concluir a partir do primeiro ' +
      'sem verificar a segunda produz uma previsão que os dados vão desmentir.';
  } else if (Math.abs(premio) < 1.5) {
    t = 'SINAL DE PREÇO INDIFERENTE ENTRE OS DOIS DESTINOS.' + b +
      ' Prêmio relativo de ' + fmt(Math.abs(premio), 1) + '%, dentro da faixa em que custo de troca, posição já ' +
      'contratada e proteção de preço já montada decidem mais que o preço corrente. Nenhuma conclusão de mix ' +
      'é defensável aqui sem a posição de venda já firmada da unidade.';
  } else if (Math.abs(desloc) < 3) {
    t = 'SINAL CLARO, MAS A UNIDADE JÁ ESTÁ NO LIMITE DA FAIXA.' + b +
      ' O preço aponta para ' + sinal + ' com prêmio de ' + fmt(Math.abs(premio), 1) + '%, e o mix praticado já está a ' +
      fmt(Math.abs(desloc), 0) + ' ponto percentual do teto executável. Um sinal de preço que aponta para além do ' +
      'teto físico não desloca produção — e vai aparecer nos dados como "o setor não respondeu ao preço", ' +
      'que é uma descrição errada de uma restrição de engenharia.';
  } else {
    t = 'DOIS SINAIS CRUZADOS: HÁ PRÊMIO E HÁ FAIXA DISPONÍVEL.' + b +
      ' O preço aponta para ' + sinal + ' com prêmio de ' + fmt(Math.abs(premio), 1) + '%, e restam ' +
      fmt(Math.abs(desloc), 0) + ' pontos percentuais de deslocamento dentro da faixa. Isto ainda não é uma ' +
      'conclusão: falta a terceira informação, que é quanto da produção já está vendida a termo e quanto de ' +
      'proteção de preço já foi montada — porque ATR com preço já travado não responde a sinal novo.';
  }
  // `alvo` e `atual` são variáveis do script (alvo = extremo da faixa para onde o preço
  // empurra); `alvo` é a grandeza da previsão da aula.
  const valores: Record<string, number> = { 'mx-pr': premio, 'mx-alvo': alvo, 'mx-atual': atual };
  // `Math.abs(desloc)` é o número que o veredito escreve ("restam N pontos percentuais de
  // deslocamento dentro da faixa"); é a grandeza da previsão da Aula 02
  if (!fixo) { valores['mx-de'] = desloc; valores['mx-desloc'] = Math.abs(desloc); }
  return {
    valores,
    textos: {
      'mx-fa': fixo ? P.min + '% fixo' : P.min + '% a ' + P.max + '%',
      'mx-pr': comSinal(premio, 1) + '%',
      'mx-di': Math.abs(premio) < 1.5 ? 'Indiferente' : premio > 0 ? 'Açúcar' : 'Etanol',
      'mx-de': fixo ? 'Nenhum' : comSinal(desloc, 0) + ' p.p.',
    },
    veredito: t,
    vereditoPtBr: true,
  };
};

// ── INST·04 — Comparador de rotas de etanol (L3551–L3612) ────
// rt-dim e rt-dim2 são um controle só (clicar num limpa o outro): uma dimensão em sete.
const inst04: CalculateFn = (i) => {
  const d = de(I04_D, sel(i, 'rt-dim', 'insumo'), 'insumo');
  return {
    valores: {},
    textos: { 'rt-a': d.a, 'rt-b': d.b, 'rt-c': d.c },
    veredito:
      '<b>RESSALVA DE COMPARABILIDADE NESTA DIMENSÃO.</b> ' + d.r +
      ' O comparador não classifica nenhuma rota como superior — a resposta a "qual rota é melhor" depende de ' +
      'logística, escala e política locais, e não existe em abstrato.',
    vereditoPtBr: true,
  };
};

// ── INST·05 — Demanda derivada por conteúdo obrigatório (L3614–L3694)
const inst05: CalculateFn = (i) => {
  const ek = sel(i, 'dm-est', 'vigente');
  const B = de(I05_BASES, sel(i, 'dm-base', 'diesel'), 'diesel');
  const Es = de(I05_EST, ek, 'vigente');
  const vol = numOf(i, 'dm-vol-n', 60, 1, 90);
  const p1 = numOf(i, 'dm-pct-n', 15, 0, 40);
  const p2 = numOf(i, 'dm-cmp-n', 16, 0, 40);
  const q1 = (vol * p1) / 100, q2 = (vol * p2) / 100;
  const pp = vol * 0.01;
  const ref = ek === 'vigente' ? B.vig : ek === 'teto' ? B.teto : ek === 'anunciado' ? B.anun : B.venc;
  const bate = Math.abs(p1 - ref) < 0.25;
  const b = ' Base: ' + B.n + ', biocombustível: ' + B.bio + '. Estado simulado: <b>' + Es.n + '</b> — ' + Es.d +
    ' Referência verificada em 2 de agosto de 2026 para este estado: <b>' + ref + '%</b>. ' + B.not;
  const d = ' A diferença entre ' + fmt(p1, 1) + '% e ' + fmt(p2, 1) + '% move <b>' + fmt(Math.abs(q2 - q1), 2) +
    ' bilhão de litros</b> de demanda derivada sobre o volume informado.';
  let t: string;
  if (ek === 'vigente' && bate) {
    t = '<b>ESTADO COERENTE: PERCENTUAL EM VIGOR, VALOR CONFERIDO.</b>' + b + d +
      ' Este é o único par estado-valor que pode ser citado como fato sem qualificação adicional — e ainda assim ' +
      'exige norma e data, porque medidas temporárias existem.';
  } else if (ek === 'vigente' && !bate) {
    t = '<b>ESTADO INCOERENTE: DECLARADO COMO VIGENTE, VALOR DIVERGENTE.</b>' + b + d +
      ' O valor digitado não corresponde ao percentual em vigor verificado. Antes de usar este número em ' +
      'qualquer material, reconfirme na resolução do conselho — ou reclassifique o estado, porque um percentual ' +
      'que não está em vigor não pode ser apresentado como se estivesse.';
  } else if (ek === 'teto') {
    t = '<b>TETO LEGAL: DIMENSIONA O MÁXIMO POSSÍVEL, NÃO O MERCADO ATUAL.</b>' + b + d +
      ' Dois sinais precisam andar juntos aqui: o volume calculado e o fato de que ele descreve um cenário ' +
      'que exige deliberação e, no caso do teto, comprovação de viabilidade técnica. Apresentar este volume sem ' +
      'a segunda parte transforma uma autorização legal em previsão de mercado.';
  } else if (ek === 'anunciado') {
    t = '<b>PERCENTUAL ANUNCIADO OU DE TRAJETÓRIA: TEM DATA, NÃO TEM VIGÊNCIA.</b>' + b + d +
      ' O volume calculado é uma projeção condicionada. Cite sempre com a data-alvo e com a condicionante ' +
      'declarada — e verifique se a data já passou, porque nesse caso o estado correto é outro.';
  } else {
    t = '<b>PRAZO LEGAL VENCIDO E NÃO IMPLEMENTADO: O VOLUME NÃO EXISTE.</b>' + b + d +
      ' Este é o estado que quase nunca aparece em material de imprensa, e é o que mais gera afirmação ' +
      'confiante e errada: alguém lê o calendário da lei, vê a data passada e conclui que o percentual está em ' +
      'vigor. A verificação que resolve é sempre a mesma — leia a lei para saber o calendário, e a resolução ' +
      'para saber o que vale.';
  }
  return {
    valores: { 'dm-q1': q1, 'dm-q2': q2, 'dm-pp': pp, 'dm-fo': vol - q1 },
    textos: {
      'dm-q1': fmt(q1, 2) + ' bi L',
      'dm-q2': fmt(q2, 2) + ' bi L',
      'dm-pp': fmt(pp, 2) + ' bi L / p.p.',
      'dm-fo': fmt(vol - q1, 2) + ' bi L',
    },
    veredito: t,
    vereditoPtBr: true,
  };
};

// ── INST·06 — Cogeração sazonal (L3696–L3775) ────────────────
const inst06: CalculateFn = (i) => {
  const pot = numOf(i, 'cg-pot-n', 80, 5, 300);
  const dia = numOf(i, 'cg-dia-n', 210, 60, 365);
  const aut = numOf(i, 'cg-aut-n', 55, 0, 95);
  const dis = numOf(i, 'cg-dis-n', 88, 30, 100);
  const hs = dia * 24;
  const ger = (pot * hs * (dis / 100)) / 1000; /* GWh brutos */
  const exp = ger * (1 - aut / 100); /* GWh exportados */
  const fca = ((exp * 1000) / (pot * 8760)) * 100;
  const fcs = ((exp * 1000) / (pot * hs)) * 100;
  const teto = (pot * 8760) / 1000;
  const b = ' Três grandezas para a mesma planta: <b>' + fmt(pot, 0) + ' MW</b> instalados, <b>' + fmt(ger, 0) +
    ' GWh</b> gerados e <b>' + fmt(exp, 0) + ' GWh</b> exportados. A multiplicação ingênua de potência por 8.760 horas ' +
    'daria ' + fmt(teto, 0) + ' GWh — uma planta que não existe.';
  const s = ' Dois sinais cruzados: fator de capacidade anual de ' + fmt(fca, 1) + '% e ' + fmt(dia, 0) +
    ' dias efetivos de safra. Nenhum dos dois se lê sozinho.';
  let t: string;
  if (aut >= 90) {
    t = '<b>PLANTA SEM EXCEDENTE RELEVANTE: A ENERGIA VIRA PROCESSO.</b>' + b + s +
      ' Com ' + fmt(aut, 0) + '% de autoconsumo, praticamente toda a geração é absorvida internamente. Isso <b>não</b> ' +
      'caracteriza uma planta ruim: caracteriza uma unidade que resolveu o próprio vapor e não vende energia. ' +
      'Citar a potência instalada dessa unidade como contribuição à matriz elétrica é o erro que a Lente de ' +
      'Sazonalidade existe para impedir.';
  } else if (dia >= 330) {
    t = '<b>OPERAÇÃO QUASE CONTÍNUA: VERIFIQUE SE O COMBUSTÍVEL FECHA O ANO.</b>' + b + s +
      ' Com ' + fmt(dia, 0) + ' dias, esta planta não descreve uma cogeração sucroenergética típica do Centro-Sul — ' +
      'descreve uma unidade com combustível disponível o ano inteiro, como licor preto em celulose, ou uma planta ' +
      'que compra biomassa na entressafra. Se a premissa era cana, o número de dias está errado; se era outra ' +
      'biomassa, a sazonalidade do módulo não se aplica e a rota precisa ser declarada.';
  } else if (fca >= 35) {
    t = '<b>FATOR DE CAPACIDADE ANUAL ALTO PARA UMA FONTE SAZONAL.</b>' + b + s +
      ' Um fator anual acima de 35% em planta que opera ' + fmt(dia, 0) + ' dias implica autoconsumo baixo e ' +
      'disponibilidade alta — combinação que existe, e que exige verificação: caldeira de alta pressão, fábrica ' +
      'eficiente no uso de vapor, e conexão sem restrição. Confirme os três antes de aceitar o número.';
  } else if (fca >= 18) {
    t = '<b>PERFIL COERENTE COM COGERAÇÃO SUCROENERGÉTICA SAZONAL.</b>' + b + s +
      ' Fator de capacidade anual na faixa em que uma unidade que mói meio ano e consome vapor de processo ' +
      'costuma operar. Dentro da safra o fator sobe para ' + fmt(fcs, 1) + '% — e é a diferença entre os dois números ' +
      'que resolve a frase "energia firme na safra": firme enquanto mói, e o contrato precisa dizer quem cobre ' +
      'a entressafra.';
  } else {
    t = '<b>FATOR DE CAPACIDADE ANUAL BAIXO: A EXPORTAÇÃO É MARGINAL.</b>' + b + s +
      ' Com ' + fmt(fca, 1) + '% no ano e ' + fmt(aut, 0) + '% de autoconsumo, a receita de venda de energia é pequena ' +
      'diante da potência instalada. Antes de concluir qualquer coisa sobre a planta, verifique se o autoconsumo ' +
      'é característica do desenho térmico — caldeira de baixa pressão — ou consequência de indisponibilidade, ' +
      'porque as duas causas pedem decisões opostas.';
  }
  return {
    valores: { 'cg-p1': pot, 'cg-p2': ger, 'cg-p3': exp, 'cg-fc': fca, 'cg-fs': fcs },
    textos: {
      'cg-p1': fmt(pot, 0) + ' MW',
      'cg-p2': fmt(ger, 0) + ' GWh',
      'cg-p3': fmt(exp, 0) + ' GWh',
      'cg-fc': fmt(fca, 1) + '%',
      'cg-fs': fmt(fcs, 1) + '%',
    },
    veredito: t,
    vereditoPtBr: true,
  };
};

// ── INST·07 — Régua de biometano (L3777–L3851) ───────────────
const inst07: CalculateFn = (i) => {
  const R1 = de(I07_R, sel(i, 'bm-rota', 'local'), 'local');
  const vol = numOf(i, 'bm-vol-n', 15, 0.5, 60);
  const dis = numOf(i, 'bm-dis-n', 80, 0, 600);
  const prc = numOf(i, 'bm-prc-n', 2.3, 0.5, 6);
  const opx = numOf(i, 'bm-opx-n', 0.85, 0.2, 4);
  const log = R1.fix + R1.km * dis;
  const mg = prc - opx - log;
  // CONSERTO D01 / QA-M14-01: o script fazia `vol*36/1000` com `vol` já em milhões de
  // Nm³ — mil vezes menor ("1 TJ/ano" no padrão). A própria fonte dá a conta certa
  // (Aula 06; Ex 08: 8 milhões × 36 = 288 TJ): 15 milhões × 36 MJ = 540 TJ/ano.
  const en = vol * 36; /* TJ, a 36 MJ/Nm3 */
  const b = ' Rota: ' + R1.n + '. ' + R1.d + ' Custo logístico de R$ ' + fmt(log, 2) + '/Nm³ a ' + fmt(dis, 0) + ' km.';
  const s = ' Dois sinais cruzados: margem unitária de R$ ' + fmt(mg, 2) + '/Nm³ e escala de ' + fmt(vol, 1) +
    ' milhões de Nm³/ano contra a referência de ' + fmt(R1.esc, 0) + ' milhões desta rota.';
  let t: string;
  if (mg <= 0) {
    t = '<b>MARGEM UNITÁRIA NEGATIVA OU NULA NESTA CONFIGURAÇÃO.</b>' + b + s +
      ' O preço líquido na planta não cobre o custo operacional mais o logístico. Antes de descartar o projeto, ' +
      'teste a outra ponta: reduzir distância, trocar de rota de entrega, ou encontrar cliente térmico local — ' +
      'porque em biometano a rota de entrega muda mais o resultado que o preço.';
  } else if (vol < R1.esc * 0.6) {
    t = '<b>ESCALA MUITO ABAIXO DA REFERÊNCIA DA ROTA.</b>' + b + s +
      ' A margem unitária é positiva e isso não basta: compressão, medição e infraestrutura de entrega têm ' +
      'componente fixo que não se dilui neste volume. É a falha mais comum e a menos discutida em projeto de ' +
      'biometano — margem por metro cúbico bonita, volume que não paga a planta.';
  } else if (vol < R1.esc) {
    t = '<b>ESCALA PRÓXIMA DA REFERÊNCIA, MAS AINDA ABAIXO.</b>' + b + s +
      ' Configuração de fronteira: a margem existe e o volume está perto do ponto em que o investimento fixo se ' +
      'dilui. Antes de concluir, confirme a <b>continuidade do substrato</b> — resíduo de usina tem sazonalidade ' +
      'e resíduo de aterro tem curva de decaimento; nenhum dos dois é uma linha reta.';
  } else if (mg < 0.4) {
    t = '<b>ESCALA SUFICIENTE, MARGEM ESTREITA.</b>' + b + s +
      ' O volume dilui o custo fixo da rota, mas a margem por metro cúbico deixa pouco espaço para erro de ' +
      'produção, de preço ou de disponibilidade. Nesta faixa, o que decide não é o preço médio — é o piso do ' +
      'contrato e o mecanismo de reajuste.';
  } else {
    t = '<b>DOIS SINAIS FAVORÁVEIS: ESCALA ACIMA DA REFERÊNCIA E MARGEM FOLGADA.</b>' + b + s +
      ' Isto ainda não é conclusão de viabilidade. Faltam três verificações que nenhum instrumento substitui: ' +
      'o substrato está contratado e é contínuo? existe cliente com contrato de prazo compatível? e a receita ' +
      'de atributo ambiental, se houver, está fora do caso base — como deve estar, porque atributo é ganho ' +
      'adicional, não salvamento de projeto.';
  }
  return {
    valores: { 'bm-en': en, 'bm-lg': log, 'bm-mg': mg, 'bm-es': R1.esc },
    textos: {
      'bm-en': fmt(en, 0) + ' TJ/ano',
      'bm-lg': 'R$ ' + fmt(log, 2) + '/Nm³',
      'bm-mg': 'R$ ' + fmt(mg, 2) + '/Nm³',
      'bm-es': fmt(R1.esc, 0) + ' mi Nm³/ano',
    },
    veredito: t,
    vereditoPtBr: true,
  };
};

// ── INST·08 — Régua de crédito de descarbonização (L3853–L3954)
/** QA-M14-02b: densidade do etanol. O script usa 21,3 MJ/L; o gabarito do Ex 13 usa
 *  21,1 MJ/L, e é com ele que o aluno se confere. Vale 21,1 nas duas rotas de etanol
 *  (mesma molécula). O 21,3 fica registrado em docs/alexandria-v3/porte/m14.md. */
const MJ_POR_L_ETANOL = 21.1;
const inst08: CalculateFn = (i) => {
  const rk = sel(i, 'cb-rota', 'e1g');
  const ck = sel(i, 'cb-cert', 'vigente');
  const R1 = de(I08_R, rk, 'e1g');
  const C1 = de(I08_C, ck, 'vigente');
  const vol = numOf(i, 'cb-vol-n', 100, 1, 500);
  const dic = numOf(i, 'cb-dic-n', 55, 5, 95);
  const prc = numOf(i, 'cb-prc-n', 30, 5, 250);
  const mj = rk === 'e1g' || rk === 'milho' ? MJ_POR_L_ETANOL : R1.mj;
  const energiaMJ = vol * 1e6 * mj;
  // CONSERTO D02 / QA-M14-02a: o campo é "Diferencial de intensidade de carbono,
  // gCO₂e/MJ" (rótulo da fonte), e o script o usava como % do fóssil
  // (`energiaMJ*R1.ref*(dic/100)/1e6`). Em gCO₂e/MJ, a conta é energia × diferencial —
  // a do gabarito do Ex 13 (100 mi L × 21,1 MJ/L × 55 g/MJ ≈ 116.050 t).
  const evit = (energiaMJ * dic) / 1e6; /* toneladas de CO2 equivalente */
  const qt = evit * C1.f;
  const rec = qt * prc;
  const unit = vol > 0 ? rec / (vol * 1e6) : 0;
  const b = ' Rota: ' + R1.n + ', contra ' + R1.rn + ' como referência fóssil, com diferencial de intensidade de ' +
    fmt(dic, 0) + ' gCO₂e/MJ. Instrumento aplicável: ' + R1.cr + '. ' + R1.d;
  const s = ' Dois sinais cruzados: estado da certificação (<b>' + C1.n + '</b>) e efeito sobre a margem ' +
    '(R$ ' + fmt(unit, 3) + ' por ' + (rk === 'bmet' ? 'Nm³' : 'litro') + ').';
  let t: string;
  if (ck === 'sem') {
    t = '<b>SEM CERTIFICAÇÃO NÃO HÁ CRÉDITO — E ISSO NÃO É DETALHE DE PROCESSO.</b>' + b + s +
      ' O volume existe, a energia existe, e as emissões evitadas fisicamente existem. O crédito, não: ' +
      'ele nasce da certificação da unidade produtora e da comercialização com nota fiscal, não do fato físico. ' +
      'A linha de "Créditos" está zerada de propósito. Qualquer projeção que some receita de crédito antes da ' +
      'certificação emitida está somando um número que ainda não tem lastro.';
  } else if (ck === 'renov') {
    t = '<b>CERTIFICAÇÃO EM RENOVAÇÃO: RECEITA CONDICIONADA, NÃO FIRME.</b>' + b + s +
      ' Os números do painel descrevem o que existiria com a certificação vigente. Enquanto a renovação não ' +
      'se conclui, a nota de eficiência pode mudar — e ela muda com produtividade agrícola, com fonte térmica e ' +
      'com o método de alocação, não só com a vontade da unidade. Trate esta linha como cenário com data e ' +
      'condicionante declaradas.';
  } else if (dic >= 85) {
    t = '<b>DIFERENCIAL DE INTENSIDADE NO LIMITE SUPERIOR: VERIFIQUE A NOTA REAL.</b>' + b + s +
      ' Um diferencial de ' + fmt(dic, 0) + ' gCO₂e/MJ descreve uma unidade excepcional, não a média de uma rota. ' +
      'Intensidade de carbono é atributo <b>da unidade produtora certificada</b>, não do combustível: duas plantas ' +
      'da mesma rota, na mesma safra, têm notas diferentes. Antes de usar este número, peça a nota da unidade ' +
      'específica — se a resposta vier como média da rota, o número não serve para decisão.';
  } else if (prc >= 90) {
    t = '<b>PREÇO ACIMA DA FAIXA CORRENTE: O CENÁRIO DESCREVE OUTRO ANO.</b>' + b + s +
      ' Um preço de R$ ' + fmt(prc, 0) + ' por crédito descreve o mercado de 2024, não o de 2026. Ao longo de 2026 o ' +
      'crédito operou nos menores níveis desde 2020, pressionado por estoque acumulado da ordem de dezenas de ' +
      'milhões de unidades no início do ano. Números vivos: confirme a cotação corrente antes de projetar. ' +
      'Usar preço de pico como caso base é o modo mais rápido de transformar um complemento de receita em ' +
      'premissa de viabilidade.';
  } else if (unit < 0.05) {
    t = '<b>ORDEM DE GRANDEZA COERENTE: COMPLEMENTO DE RECEITA, NÃO PILAR.</b>' + b + s +
      ' O crédito adiciona R$ ' + fmt(unit, 3) + ' por ' + (rk === 'bmet' ? 'metro cúbico' : 'litro') + ' — relevante numa ' +
      'indústria de margem estreita, e insuficiente para sustentar sozinho qualquer decisão de investimento. ' +
      'É exatamente assim que ele deve entrar num caso base: fora dele, como sensibilidade declarada.';
  } else {
    t = '<b>CONTRIBUIÇÃO UNITÁRIA ALTA: CONFIRME PREÇO, NOTA E TITULARIDADE.</b>' + b + s +
      ' R$ ' + fmt(unit, 3) + ' por ' + (rk === 'bmet' ? 'metro cúbico' : 'litro') + ' é uma contribuição grande o bastante ' +
      'para mudar a decisão — e por isso mesmo precisa das três verificações antes de entrar em qualquer ' +
      'planilha: a cotação é corrente ou de pico? a nota é da unidade ou média da rota? e a titularidade do ' +
      'crédito é da planta ou já foi cedida em contrato de fornecimento? A terceira é a que mais aparece ' +
      'depois da assinatura.';
  }
  return {
    valores: { 'cb-en': energiaMJ / 1e6, 'cb-ev': evit, 'cb-qt': qt, 'cb-rc': rec / 1e6, 'cb-mg': unit },
    textos: {
      'cb-en': fmt(energiaMJ / 1e6, 0) + ' TJ',
      'cb-ev': fmt(evit, 0) + ' t CO₂e',
      'cb-qt': C1.f ? fmt(qt, 0) + ' ' + (rk === 'bmet' ? 'unid.' : 'CBIO') : '0',
      'cb-rc': 'R$ ' + fmt(rec / 1e6, 2) + ' mi',
      'cb-mg': 'R$ ' + fmt(unit, 3) + '/' + (rk === 'bmet' ? 'Nm³' : 'L'),
    },
    veredito: t,
    vereditoPtBr: true,
  };
};

// ── INST·09 — Classificador de destino de insumo (L3956–L4127)
const inst09: CalculateFn = (i) => {
  const I = de(I09_M, sel(i, 'cl-ins', 'cana'), 'cana');
  let dest = sel(i, 'cl-dest', 'acucar');
  if (!(dest in I)) dest = 'acucar';
  const Ec = I[dest as Chave<typeof I>] as { s: string; c: string; d: string; q: string };
  const St = de(I09_S, Ec.s, 'sim');
  return {
    valores: {},
    textos: {
      'cl-insumo': I.n,
      'cl-destino': (I09_DEST.find((d) => d.k === dest) ?? { n: '—' }).n,
      'cl-estado': St.r,
      'cl-deixa': Ec.c,
    },
    veredito:
      '<b>' + St.r + '.</b> ' + Ec.d +
      (Ec.c === '—'
        ? ' Como a combinação não se realiza, não há uso alternativo a declarar — e essa ausência é informação, não lacuna do painel.'
        : ' <b>Destino deslocado:</b> ' + Ec.c + '. Toda vez que esta rota cresce, aquele destino recua na mesma unidade de insumo.') +
      ' ' + Ec.q,
    vereditoPtBr: true,
  };
};

// ── INST·10 — Verificador de base temporal e rota (L4129–L4229)
const inst10: CalculateFn = (i) => {
  const tipo = sel(i, 'vf-tipo', 'todos');
  const lista = I10_E.filter((e) => tipo === 'todos' || e.t === tipo);
  let k = sel(i, 'vf-chips', 'e1');
  // o script remonta os chips ao trocar o filtro e seleciona o primeiro da lista
  if (!lista.some((e) => e.k === k)) k = lista.length ? lista[0].k : '';
  const e = I10_E.find((x) => x.k === k);
  if (!e) return { valores: {} };
  return {
    valores: {},
    textos: {
      'vf-en': e.n,
      'vf-df': e.df,
      'vf-cat': I10_LB[e.t as Chave<typeof I10_LB>],
      'vf-fa': e.fa,
      'vf-pg': `<i>${e.pg}</i>`,
      'vf-co': e.co,
    },
    veredito:
      'Repare no que o enunciado original <b>não</b> tem: ele não é falso por invenção. ' +
      'Ele é verdadeiro e insuficiente — e é por isso que sobrevive a uma reunião inteira sem ser contestado.',
    vereditoPtBr: true,
  };
};

export const CALCULADORAS: Record<string, CalculateFn> = {
  'm14-inst-01': inst01,
  'm14-inst-02': inst02,
  'm14-inst-03': inst03,
  'm14-inst-04': inst04,
  'm14-inst-05': inst05,
  'm14-inst-06': inst06,
  'm14-inst-07': inst07,
  'm14-inst-08': inst08,
  'm14-inst-09': inst09,
  'm14-inst-10': inst10,
};
