# Catálogo dos 17 módulos da Alexandria — o que cada um ensina

Inventário do conteúdo educacional real dos dezessete módulos do currículo,
lido arquivo por arquivo. Não avalia qualidade, não recomenda nada, não
compara com nenhum documento de design. Descreve o que está na fonte.

## Procedência

A fonte é o **HTML original de cada módulo**, em `Alexandria modulos/`, na
raiz do repositório — dezessete arquivos, `alexandria_modulo01.html` a
`alexandria_modulo17.html`, 5,3 MB somados. `AGENTS.md` declara esse HTML
como única fonte de aula, exercício e instrumento, e é dele que sai tudo
abaixo. Os dados extraídos em `src/lib/data/alexandria-modulo-NN-content.ts`
foram lidos em paralelo, mas só para uma coisa: medir o estado da extração,
registrado ao final. Onde o TS e o HTML divergem, vale o HTML.

Extração determinística (título, marcador de seção, cabeçalho de aula,
cabeçalho e nota de instrumento, verbete de glossário, item de checklist),
não transcrição. Os dois vocabulários de marcação da série foram tratados
separadamente:

- **Módulos 01–03** — `.aula-marker` + `.aula-title`; instrumentos em
  `.instrument`, com `.instrument-title` e `.instrument-id`; glossário em
  `.glossary-item`. Zero ocorrência de `sec-id`.
- **Módulos 04–17** — `.sec-id` + `<h2>` + `.lede`; instrumentos em
  `.inst-hd` (`.id` + `.nm`/`.ti`) e `.inst-intro`; glossário em `<details>`
  por família, verbetes em `.term`. Zero ocorrência de `aula-marker`.

Um defeito de extração foi encontrado e corrigido antes de escrever: no
vocabulário dos Módulos 01–03 o `.instrument-id` vem **depois** do
`.instrument-title` no DOM, e um extrator que ancore no id casa o título do
instrumento seguinte. O resultado saía deslocado em uma posição nos sete
instrumentos do Módulo 01. A correção foi ancorar no elemento `.instrument`
que envolve os dois; a conferência é contra `INSTRUMENTOS_MODULO_01` no
repositório, que bate 1:1 depois do conserto.

Contagens medidas conferem com o que o próprio hero de cada módulo declara —
aulas, instrumentos, termos e referências — em todos os módulos que declaram
número. Conferem também com a tabela `AULAS_POR_BLOCO` de
`src/lib/data/alexandria-trilhas.ts`, medição independente feita em waves
anteriores. Onde o hero não declara, a contagem vem do título da própria
seção, e está marcada como tal.

## Quatro divergências medidas

Não são erros a corrigir aqui — são estados a declarar, porque quem usar
este catálogo vai encontrar os dois lados.

**1 · Título.** Quatro módulos têm, na fonte, título diferente do que o
catálogo do repositório (`src/lib/data/alexandria-blocks.ts`) registra:

| # | Título na fonte (`<title>` e `<h1>`) | Título no catálogo do repo |
| --- | --- | --- |
| 07 | Estrutura Institucional do Setor Elétrico Brasileiro | Estrutura Institucional Detalhada |
| 08 | Matriz Elétrica Brasileira em Profundidade | Matriz Elétrica |
| 09 | Os Mercados ACR e ACL em Profundidade | Mercado ACR e ACL |
| 11 | Geração Distribuída e a Anatomia de uma Proposta Solar | Energia Solar e Análise de Propostas |

Nos treze restantes os dois coincidem. Abaixo uso o título da fonte, com o
do catálogo ao lado quando diferem.

**2 · Trilha.** Só sete dos dezessete arquivos declaram trilha ou nível no
próprio texto:

- **Módulos 01, 02, 03** — `Nível 1 · Fundamentos Universais`, no hero; os
  Módulos 02 e 03 repetem `Nível 1 — Fundamentos Universais` no rodapé.
- **Módulos 08, 09, 10** — `Trilha 2 — Setor Elétrico Brasileiro` no hero
  (o Módulo 10 escreve `Trilha 2 — O setor elétrico brasileiro`, em caixa
  baixa).
- **Módulo 14** — `Trilha 2 · Bloco 14 do Currículo Definitivo`, no rodapé.

Os outros dez (04–07, 11–13, 15–17) trazem apenas
`Alexandria · GridAlpha · Módulo NN`. A trilha deles, abaixo, vem do
catálogo do repositório, e está marcada como atribuída, não declarada.

O caso do Módulo 14 é uma contradição interna da própria fonte: o rodapé o
coloca na Trilha 2, e o corpo do §00 fala nele como um dos "blocos finais do
**Nível 3**". O catálogo do repositório o registra no nível 3. Registrado, não
resolvido — resolver é decisão de quem é dono do currículo.

**3 · Critério de domínio, quando não existe no currículo.** Três módulos
declaram, dentro do próprio texto, que o Currículo Definitivo **não fornece**
critério de domínio para o bloco, e que o critério apresentado é construção
do módulo: **14**, **15** e (por menção do 14) **16**. O Módulo 16 depois
contradiz isso e cita o critério do currículo verbatim. O Módulo 17 declara
construção própria para a decomposição em três parcelas, não para o critério.
Onde o critério é construído, isso está dito na entrada.

**4 · Estado da extração no repositório.** Cinco módulos — **09, 13, 14, 16 e
17** — têm hoje todas as aulas com `instruments: []` em
`src/lib/data/`, e nenhum deles exporta lista de instrumentos. Na fonte HTML
esses cinco módulos têm, respectivamente, 11, 11, 10, 11 e 12 instrumentos
reais: **55 instrumentos existem no HTML e não estão extraídos**. A hipótese
registrada na memória do projeto falava em quatro módulos; medido hoje, são
cinco. Os instrumentos desses cinco módulos estão descritos abaixo a partir
do HTML, como os dos outros doze.

---

# Trilha 1 — Fundamentos Universais

Declarada literalmente na fonte dos três módulos. Cinco módulos no catálogo
do repositório (01–05); os Módulos 04 e 05 não declaram a trilha no texto.

---

## Módulo 01 — Física de Energia e Eletricidade

**Trilha** · Fundamentos Universais — declarada (`Nível 1 · Fundamentos
Universais · Módulo 01`).
**Escala** · 9 aulas · 7 instrumentos · 38 termos · 8 exercícios · 16 itens
de checklist · 4–6 h declaradas.

### Tese

> "Energia elétrica industrial não é comprada apenas como volume. É comprada
> como volume, capacidade, perfil de uso, qualidade e risco. Se você confunde
> essas cinco dimensões, não consegue analisar uma fatura industrial; você
> está apenas lendo um boleto."

O título da abertura é **"A tese que organiza todo o resto."** O hero
acrescenta o enquadramento: "A maioria das pessoas olha a conta de luz
procurando consumo. Empresa industrial precisa olhar consumo e capacidade e
perfil e qualidade e risco."

### Aulas

| # | Aula | O que ela afirma |
| --- | --- | --- |
| 01 | Energia × Potência | Energia é volume. Potência é velocidade. |
| 02 | As sete unidades essenciais | Sete símbolos. Toda a linguagem. |
| 03 | Corrente alternada e frequência | A rede tem um batimento cardíaco. Ele se chama 60 Hz. |
| 04 | Tensão, corrente e perdas | Por que perdas crescem ao quadrado. E por que isso desenhou toda a rede. |
| 05 | Demanda e fator de carga | Por que uma fábrica paga por capacidade reservada. |
| 06 | Tensão como categoria econômica | A tensão de fornecimento define a tarifa que você paga. |
| 07 | Triângulo de potência e fator de potência | Existe energia que ocupa a rede e não vira produção. |
| 08 | Capacidade instalada e fator de capacidade | 100 MW solar ≠ 100 MW térmica. |
| 09 | Qualidade de energia | Energia ruim pode custar mais do que energia cara. |

Aparato do módulo, além das nove aulas: § 00 Filosofia, § MAP Mapa das aulas,
§ Caso (leitura de uma fatura industrial — Operação A, mineração em Minas
Gerais, que reaparece em todos os dezessete módulos), § Lab, § Map Tradutor,
§ Drill, § Quiz, § Final, § Lex, § Ref.

### Instrumentos

Seis calculadoras numeradas `INST · 01` a `INST · 06`, mais um laboratório
`LAB · 01`. Todos com entrada editável e saída calculada.

| Id | Nome | O que calcula |
| --- | --- | --- |
| INST · 01 | Calculadora · kWh = kW × h | Energia a partir de potência × tempo. A nota força a comparação 50 kW × 1 h contra 1 kW × 50 h: mesmo kWh, exigência de rede oposta. |
| INST · 02 | Calculadora · Lei de Ohm | V, I e R; deriva a cadeia V × A → W → kW → kWh × tarifa = R$. |
| INST · 03 | Calculadora · Perdas resistivas | P = I² × R, com corrente e resistência em faixa deslizante. Dobrar a corrente quadruplica a perda. |
| INST · 04 | Calculadora · Demanda média e fator de carga | Demanda média a partir de kWh e horas; fator de carga contra demanda máxima; devolve FC absoluto e percentual. |
| INST · 05 | Controles · Triângulo de potência | kW e kVAr como controles; mostra o efeito sobre fator de potência e kVA exigido da rede. |
| INST · 06 | Calculadora · Fator de capacidade | FC = geração ÷ (capacidade × horas), com faixa típica por fonte para comparação. |
| LAB · 01 | Laboratório · Comparador de perfil elétrico | Duas fábricas com o mesmo consumo mensal e perfis diferentes — tarifa, demanda máxima, fator de potência, fração em ponta — e a fatura estimada de cada uma. Declara-se simulação didática. |

### Termos centrais

Trinta e oito verbetes, cada um com uma categoria curta ao lado. As grandezas
— Energia (kWh), Potência (W/kW/MW), Tensão (V), Ampere, Watt, kVA, kVAr,
Frequência (Hz); as razões — Fator de carga, Fator de potência (cos φ), Fator
de capacidade, Eficiência; a classificação tarifária — Grupo A, Grupo B,
Demanda, Demanda contratada, Modalidade tarifária, TUSD, UFER; a qualidade e
continuidade — Harmônicos, DEC/FEC, DIC/FIC/DMIC/DICRI, Perdas técnicas,
Perdas não técnicas; as instituições e normas — ONS, CCEE, PLD, PRODIST,
REN ANEEL 1.000/2021, CUSD; a física — Lei de Ohm, Corrente alternada,
Corrente contínua, Trifásico, Banco de capacitores.

### Critério de domínio

> "O critério de conclusão. Você só passa neste módulo se conseguir, sem
> consultar nenhum material, fazer todas as ações abaixo. Marque ao longo do
> estudo. Quando todas estiverem marcadas, você está pronto para o Módulo 02
> — A Rede Elétrica."

Dezesseis ações, entre elas explicar kW vs kWh em trinta segundos com exemplo
numérico; calcular fator de carga e interpretá-lo operacionalmente; justificar
fisicamente por que transmissão usa alta tensão; desenhar o triângulo kW, kVAr,
kVA; listar exatamente quais dados pedir antes de recomendar economia; e saber
**em que situação não recomendar** redução de demanda contratada. O § Drill
declara critério próprio: "resolver pelo menos seis dos oito sem consulta"; o
§ Quiz, "acertar pelo menos 8 de 10 sem consultar".

---

## Módulo 02 — Como Funciona uma Rede Elétrica

**Trilha** · Fundamentos Universais — declarada, hero e rodapé.
**Escala** · 10 aulas · 9 instrumentos · 65 termos · 8 exercícios · 30
perguntas-relâmpago · 4–5 h declaradas.

### Tese

> "Eletricidade, em escala de rede, não se armazena de forma economicamente
> significativa. Tudo o que parece burocracia no setor — o ONS decidindo quem
> gera, o preço que muda de hora em hora, usinas paradas 'de reserva',
> encargos com siglas — existe por causa dessa única frase. Quem entende a
> restrição entende o desenho. Quem decora o desenho sem entender a restrição
> vira papagaio de sigla."

Título da abertura: **"Uma única restrição física explica todo o setor
elétrico."** A igualdade que o módulo persegue está escrita no corpo:
*Geração = Carga + Perdas · a cada instante*.

### Aulas

| # | Aula | O que ela afirma |
| --- | --- | --- |
| 01 | Anatomia da rede e o SIN | Quatro camadas, um organismo. |
| 02 | Alta tensão, HVDC e os limites do fio | A matemática que desenha o sistema. |
| 03 | Subestações e proteção | As articulações do sistema. |
| 04 | Carga, curva de carga e curva líquida | A demanda respira — e o operador respira junto. |
| 05 | Despacho e ordem de mérito | Quem liga agora — e por quê. |
| 06 | ONS, centros de operação e horizontes | A sala que enxerga um continente. |
| 07 | Reservas e serviços ancilares | Os bastidores que ninguém vê — e todo mundo paga. |
| 08 | Estabilidade, inércia e a anatomia de um apagão | Os dez segundos que decidem tudo. |
| 09 | Perdas técnicas e não técnicas | A energia que some — e quem paga por ela. |
| 10 | Da física ao custo: fio, congestionamento e curtailment | Onde a infraestrutura encosta no dinheiro. |

A Aula 08 é ancorada num evento datado: a saída de uma linha de 500 kV no
Ceará às 8h31 de 15 de agosto de 2023, e a separação do Norte e Nordeste do
resto do SIN em segundos.

### Instrumentos

| Id | Nome | O que calcula ou demonstra |
| --- | --- | --- |
| INST · 01 | Explorador · Camadas da rede | Navegação pelas quatro camadas — geração, transmissão, distribuição, consumo. |
| INST · 02 | Simulador · Perdas na transmissão | Potência, distância, tensão da linha e número de circuitos → perda; modelo trifásico simplificado, cos φ 0,95. |
| INST · 03 | Cadeia de transformação · por perfil | Perda técnica acumulada típica até a entrega, por trecho. |
| INST · 04 | Simulador · Curva líquida e a rampa do fim da tarde | Pico do dia, solar instalada (UFV + MMGD) e condição do céu → barriga do meio-dia e inclinação da rampa. |
| INST · 05 | Simulador · Despacho por ordem de mérito | Demanda do SIN, vento no NE, solar e nível de reservatório → pilha de despacho e usina marginal. Declara-se maquete pedagógica, não o modelo do ONS. |
| INST · 06 | Calculadora · Bateria: potência × energia | Duração = MWh ÷ MW. A versão sistêmica do kW × kWh do Módulo 01. |
| INST · 07 | Simulador · Excursão de frequência | Geração perdida, carga e inércia do mix → profundidade do afundamento de frequência, com limiares de ERAC simplificados. |
| INST · 08 | Calculadora · Perda embutida na conta | Injetada = consumo ÷ (1 − perdas); mostra o custo que viaja escondido no preço da energia. |
| INST · 09 | Simulador · Dois submercados, um fio | Modelo de dois nós: vento disponível no NE, demanda no SE, limite de intercâmbio → fio com folga produz preço único, fio saturado produz preços separados e corte. |

### Termos centrais

Sessenta e cinco verbetes. A rede e seus equipamentos — SIN, Rede Básica,
DIT, Subestação, Barramento, Alimentador, Disjuntor, Seccionadora, Religador,
Relé de proteção, Seletividade; a operação — Despacho centralizado, Ordem de
mérito, PMO/PDO, CMO, CVU, Valor da água, Inflexibilidade, Rampa, Curva de
carga, Curva líquida, Intercâmbio, Congestionamento, Curtailment,
Constrained-on/off; a estabilidade — Inércia, RoCoF, Regulação primária, CAG,
ERAC, Ilhamento, Recomposição, Black start, N-1, Resiliência; os modelos —
NEWAVE, DECOMP, DESSEM, SCADA, SMF; a economia da rede — TUSD, TUST, Fio B,
RAP, Parcela Variável, ESS, Sinal locacional, Submercado, PLD; a rede moderna
— HVDC, Bipolo, Grid-forming/grid-following, Microrrede, MMGD, Resposta da
demanda, Reserva girante/operativa, Serviços ancilares.

### Critério de domínio

Declarado duas vezes, com a mesma substância. No corpo:

> "Você passa no Bloco 2 quando consegue, sem consultar nada: (1) explicar por
> que um apagão em uma região pode atingir outra região em segundos; e (2)
> desenhar num guardanapo a cadeia geração → transmissão → distribuição →
> consumo, com as tensões típicas e quem é dono de cada trecho."

No § Final, dezoito verificações, com a condição de passagem explícita:
"Quando todas estiverem marcadas — e o quiz fechar em 8/10 ou mais — você está
pronto para o Módulo 03." Entre elas: provar com I²R por que dobrar a tensão
divide as perdas por quatro; dizer o que é a Rede Básica (≥ 230 kV) e por que
essa fronteira muda contrato e cobrança; narrar a cascata de horizontes
PMO → PDO → tempo real → pós-operação; listar três coisas que o ONS faz e três
que ele não faz, nomeando quem faz.

---

## Módulo 03 — Tecnologias de Geração

**Trilha** · Fundamentos Universais — declarada, hero e rodapé.
**Escala** · 10 aulas · 9 instrumentos · 63 termos · 10 exercícios · 30
perguntas-relâmpago · 4–5 h declaradas.

### Tese

> "O erro de quem chega de fora é perguntar qual é a melhor tecnologia de
> geração. A pergunta está mal formulada. O sistema elétrico não compra fontes
> — compra atributos: energia barata, potência firme, flexibilidade para subir
> e descer, inércia, localização certa. Cada tecnologia é um pacote diferente
> de atributos com uma estrutura de custo diferente. A matriz brasileira não é
> uma lista de usinas: é um portfólio montado ao longo de setenta anos, onde
> cada peça responde a uma pergunta que as outras não respondem."

Título da abertura: **"Não existe 'melhor fonte'. Existe portfólio."** A
divisão que organiza o módulo inteiro é declarada logo abaixo: Família 1 —
capital pesado, combustível zero (hidro, eólica, solar, nuclear); Família 2 —
o inverso.

### Aulas

| # | Aula | O que ela afirma |
| --- | --- | --- |
| 01 | A matriz em três lentes | Capacidade, energia e o fator que liga as duas. |
| 02 | Hidrelétrica com reservatório | A bateria que veio antes do lítio. |
| 03 | Fio d'água | A hidrelétrica que não escolhe quando gerar. |
| 04 | Eólica | O vento de classe mundial do Nordeste. |
| 05 | Solar — UFV e MMGD | A fonte que quebrou a curva de custos — e endureceu o relógio. |
| 06 | Térmicas a gás | A flexibilidade que se paga — e o sistema paga. |
| 07 | Carvão, óleo e biomassa | O resto do parque térmico: o que cada um ainda resolve. |
| 08 | Nuclear | Angra 3, ou: uma aula de custo de capital em concreto armado. |
| 09 | Armazenamento | A bateria desloca energia. Quem gera é o resto. |
| 10 | LCOE, valor de sistema e portfólio | A planilha que ordena custos não é a planilha que decide o sistema. |

### Instrumentos

| Id | Nome | O que calcula ou demonstra |
| --- | --- | --- |
| INST · 01 | Explorador · A matriz nas duas lentes | Participação por fonte em capacidade e em energia, lado a lado. |
| INST · 02 | Calculadora · FC × energia anual | Potência instalada e fator de capacidade → energia anual, comparada ao consumo nacional. |
| INST · 03 | Simulador · A bateria do Brasil (EAR ao longo do ano) | Balanço mensal de estoque hidrelétrico sob cenário de ENA e EAR inicial. Declara-se "não é o NEWAVE — é a intuição do NEWAVE". |
| INST · 04 | Comparador · Reservatório × fio d'água sob a mesma seca | Duas usinas sob a mesma afluência: energia média contra energia firme. |
| INST · 05 | Simulador · O dia do sistema: solar, vento e o resíduo | Solar e eólica sobre a carga diária → resíduo para hidro despachável, térmicas e baterias. |
| INST · 06 | Simulador · A pilha de CVU: monte a ordem de mérito | Demanda, valor da água e preço do gás → ordem de mérito e custo marginal do sistema. |
| INST · 07 | Dimensionador · MW, MWh e o preço da viagem no tempo | Potência, duração e eficiência de ciclo — potência e energia como produtos distintos. |
| INST · 08 | Comparador · LCOE por tecnologia — e seus limites | Capital anualizado por CRF + O&M fixo ÷ energia anual + variável, com FC e WACC editáveis. O teste declarado: baixar o FC do gás de 45% para 15% quase dobra o LCOE sem mudar nada na usina. |
| INST · 09 | Quebra-cabeça · O encaixe sazonal das fontes | Perfis mensais por fonte, ligados um a um, mostrando o índice mês-fraco/mês-forte subir com o encaixe. |

### Termos centrais

Sessenta e três verbetes com categoria. Hidrologia — Afluência, ENA, EAR, MLT,
Fio d'água, UHE, PCH, CGH, Vertimento, GSF, Valor da água, Itaipu, Tucuruí,
Balbina; eólica — Aerogerador, Curva de potência, Cut-in/cut-out, Micrositing,
Nacele; solar — UFV, MMGD, Tracker, SCEE, Lei 14.300/2022; térmica — CVU,
Heat rate, Ciclo simples, Ciclo combinado, Cogeração, GNL, Take-or-pay,
Must-run, Inflexibilidade; nuclear — Fissão, Densidade energética, SMR;
armazenamento — BESS, Arbitragem, Eficiência de ciclo (round-trip), Reversível
(UHR); atributos e economia — Despachabilidade, Energia firme/firmeza,
Garantia física, Inércia síncrona, Fator de capacidade, LCOE, CAPEX, O&M, CRF,
WACC, Canibalização, Curtailment, Repotenciação, LRCAP, Piso do PLD,
Autoprodução, Transição justa, Lei 15.097/2025.

### Critério de domínio

> "Você passa no Bloco 3 quando consegue, sem consultar nada: (1) desenhar num
> guardanapo a matriz elétrica brasileira com a ordem de grandeza de cada
> fonte — em capacidade e em energia, que são desenhos diferentes; e (2)
> explicar em voz alta, para cada tecnologia, por que ela ocupa o lugar que
> ocupa."

O § Final desdobra em dezoito verificações, com passagem condicionada ao quiz
em 8/10. Entre elas: explicar a "usina invisível" — por que a MMGD aparece
como redução de carga e não como geração; defender o vento do NE pelo cubo da
velocidade e pela complementaridade sazonal com a hidrologia; separar UFV de
MMGD pela régua econômica, atacado contra tarifa cheia.
---

## Módulo 04 — Economia de Mercados de Energia

**Trilha** · Fundamentos Universais — **atribuída** pelo catálogo do
repositório; a fonte traz apenas `Alexandria · GridAlpha · Módulo 04`.
**Escala** · 7 aulas · 7 instrumentos · 58 termos · 9 exercícios · 32
perguntas-relâmpago · 20 itens de checklist · 3–4 h declaradas.

Primeiro módulo do vocabulário `sec-id`, e o primeiro com a estrutura que
vale até o fim do currículo: §00 Tese, §MAP, aulas, §Caso, §Erros, §Ex, §Quiz,
§Voz, §Final, §Lex, §Ref.

### Tese

> "Petróleo, soja e minério compartilham uma propriedade discreta que quase
> ninguém percebe: se o preço estiver ruim hoje, você guarda. Eletricidade não
> tem esse botão. E é dessa única ausência que decorre praticamente toda a
> economia deste módulo."

Título da abertura: **"A commodity que não espera."** O hero acrescenta o
recorte do módulo: "Como a fila física de despacho que você já conhece vira um
número em R$/MWh — e por que esse número não é o preço que a fábrica paga."

### Aulas

| # | Aula | Título |
| --- | --- | --- |
| 01 | Formação de preço | Ordem de mérito como formador de preço |
| 02 | Curto prazo | PLD: o preço do curto prazo |
| 03 | Desenho de mercado | Energia × capacidade e o missing money |
| 04 | Descoberta de preço | Leilões: como o regulador descobre o preço |
| 05 | Longo prazo | PPA: onde mora a economia real |
| 06 | Gestão de risco | Hedge: travando exposição ao PLD |
| 07 | Síntese | Portfólio de contratação |

A Aula 02 declara o eixo do módulo em uma frase: "O PLD é o número mais citado
e mais mal-usado do setor elétrico brasileiro. Ele não é o preço da energia.
Ele é o preço de uma diferença." A Aula 05 desloca o objeto do PPA: "Um PPA é
apresentado como um preço. Ele é, na verdade, uma alocação de riscos entre
duas partes, em que o preço é apenas a cláusula que todo mundo lê."

### Instrumentos

| Id | Nome | O que calcula ou demonstra |
| --- | --- | --- |
| Inst · 01 | Simulador · Formador de preço | Monta a fila de despacho e mostra qual usina fica marginal, qual preço ela forma e quando o limite regulatório passa a mandar mais que a economia. |
| Inst · 02 | Simulador · PLD ao longo do ano | Trajetória mensal do preço sob cenário hidrológico, com período seco marcado e cruzamento do teto estrutural. |
| Inst · 03 | Simulador · O dinheiro que falta | Usina de ponta tentando se pagar só com energia: horas de operação, receita por MWh e custo de disponibilidade → *missing money* medido em R$/kW-ano. |
| Inst · 04 | Simulador · Sala do leilão reverso | Seis propostas, volume a contratar e teto de edital → separação entre preço de corte e preço médio. |
| Inst · 05 | Simulador · Contrato × spot ao longo de 12 meses | Indústria de 10.000 MWh/mês decidindo quanto contratar; separa o efeito do contrato sobre a média do efeito sobre a amplitude. |
| Inst · 06 | Mesa de hedge · swap simples | Volume travado contra consumo fixo; mostra o que acontece quando o travado excede o consumo. |
| Inst · 07 | Simulador · Portfólio em camadas | Distribuição do consumo entre camadas de contratação, com o resíduo exposto ao PLD e choque de preço aplicável no segundo semestre. |

O módulo fixa três constantes regulatórias no topo do arquivo — piso do PLD,
teto horário e teto estrutural — usadas pelos instrumentos.

### Termos centrais

Cinquenta e oito verbetes em quatro famílias declaradas:

- **Formação de preço e despacho** (15) — Custo fixo, variável, marginal e
  médio; CVU; Ordem de mérito; Usina marginal; Margem inframarginal; CMO;
  Valor da água; Despacho centralizado; Efeito ordem de mérito; Heat rate;
  Curva de oferta; Demanda flexível.
- **Curto prazo, liquidação e hidrologia** (14) — PLD, PLDmin, PLDmax horário,
  PLDmax estrutural, Submercado, Acoplamento, Liquidação, Exposição, ENA, EAR,
  Período úmido e seco, Preço spot, Curva forward, Prêmio de risco.
- **Contratos, cláusulas e ambientes** (16) — PPA físico, PPA financeiro,
  Contrato por diferença, PPA virtual, Modulação, Sazonalização, Contrato
  flat, Flexibilidade, Take-or-pay, Sobrecontratação, Indexação, Change in
  law, Lastro, ACR, ACL.
- **Capacidade, leilões, risco e métrica** (13) — Capacidade, Energia, Missing
  money, Energy-only, Preço de escassez, Valor da energia não suprida, Reserva
  de capacidade, LRCAP, Leilão reverso, Preço de corte, Revenue stacking,
  Risco de base, Canibalização.

### Critério de domínio

> "Você domina o Bloco 4 quando consegue explicar, sem consultar nada, por que
> a solar pode ter custo marginal próximo de zero e ainda assim o sistema
> precisar pagar por capacidade — e quando entende, com precisão, a diferença
> entre vender energia e vender disponibilidade."

O §Final o desdobra em vinte verificações, sob a regra que se repete nos
módulos seguintes: "Cada uma que falhar aponta uma aula específica — e a aula
é para ser refeita inteira, não consultada em diagonal."

---

## Módulo 05 — Regulação e Desenho de Mercados

**Trilha** · Fundamentos Universais — **atribuída** pelo catálogo do
repositório; a fonte traz apenas `Alexandria · GridAlpha · Módulo 05`.
**Escala** · 6 aulas · 6 instrumentos · 72 termos · 10 exercícios · 34
perguntas-relâmpago · 21 itens de checklist · 3–5 h declaradas.

### Tese

> "Nos quatro módulos anteriores, uma frase apareceu dezenas de vezes sem
> nunca ser interrogada: 'a ANEEL fixa o limite', 'o ONS despacha', 'a
> distribuidora é concessionária'. Tratamos isso como física — como se fosse
> um dado do mundo. Não é. Cada uma dessas frases é uma decisão de desenho,
> tomada por alguém, contra alternativas concretas, por razões econômicas que
> se pode reconstruir. Este módulo reconstrói."

Título da abertura: **"A pergunta que estava embaixo das outras quatro."** O
corpo desfaz explicitamente a oposição regulação × mercado: "Regulação
elétrica não existe porque alguém desconfia de mercado — existe porque partes
específicas da cadeia elétrica têm propriedades que impedem um mercado
competitivo de se formar, e porque outras partes têm propriedades que
permitem."

### Aulas

| # | Aula | Título |
| --- | --- | --- |
| 01 | Fundamento econômico | Por que regulado |
| 02 | Arquitetura setorial | Unbundling |
| 03 | Desenho do atacado | Pool e bilateral |
| 04 | Economia política da regulação | Captura regulatória |
| 05 | Regulação econômica | Revisão tarifária |
| 06 | Síntese | Desenho de mercado comparado |

A Aula 03 fixa a distinção que o módulo chama de dissolvente de metade da
confusão do setor: "contrato coordena dinheiro; operador coordena elétrons".
A Aula 05 declara a identidade central da regulação econômica: base de ativos
× custo de capital, mais custo operacional eficiente, mais depreciação
regulatória — a receita que a rede tem direito de recuperar.

### Instrumentos

| Id | Nome | O que calcula ou demonstra |
| --- | --- | --- |
| Inst · 01 | Simulador · Quando duplicar a rede fica caro | Divide um mercado entre operadores concorrentes e mostra o custo médio por consumidor; o objeto é a forma da curva, não o número. |
| Inst · 02 | Simulador · Grau de separação | Grau de unbundling contra necessidade de coordenação, decomposto em conflito residual e custo de coordenação — duas parcelas que se movem em direções opostas. |
| Inst · 03 | Simulador · Composição de contratação | Volume entre longo prazo, curto prazo e exposição descoberta; devolve custo esperado e, principalmente, a largura da faixa de resultados. |
| Inst · 04 | Termômetro · Risco de captura | Marcação de sinais presentes num processo decisório concreto; o veredito indica quanto do resultado é verificável por terceiros e onde a verificação falha. |
| Inst · 05 | Simulador · Ciclo de revisão tarifária | Parcela B ao longo de um ciclo: revisão no ano zero, reajustes anuais por índice de preços menos Fator X, com sensibilidade ao custo de capital. |
| Inst · 06 | Mapa · Posição no desenho de mercado | Dois eixos, quatro quadrantes: o que cada configuração compra e onde ela tende a quebrar. Pontos de referência declarados genéricos e anônimos. |

### Termos centrais

Setenta e dois verbetes em cinco famílias:

- **Fundamento econômico da regulação** (12) — Monopólio natural,
  Subaditividade de custos, Economias de escala e de densidade, Custo
  afundado, Infraestrutura essencial, Externalidade, Bem essencial, Demanda
  inelástica, Falha de mercado, Falha de governo, Competição pelo mercado.
- **Unbundling e cadeia de valor** (12) — os quatro graus de separação
  (contábil, funcional, jurídica, societária), Integração vertical, Subsídio
  cruzado, Discriminação vertical, Acesso não discriminatório, Livre acesso,
  Concessão, Área de concessão.
- **Desenho do atacado** (11) — Pool, Bilateral, Despacho por custo, Despacho
  por oferta, Despacho centralizado de segurança, ACR, ACL, Liquidação de
  diferenças, Lastro, Submercado, Otimização hidrotérmica intertemporal.
- **Captura e governança regulatória** (17) — Captura regulatória, cognitiva e
  política; Porta giratória; Assimetria de informação; Benefício concentrado e
  custo difuso; Ação coletiva; Quarentena; Mandato fixo; Consulta e audiência
  públicas; Análise de impacto regulatório; Motivação; Accountability;
  Reprodutibilidade; Independência analítica.
- **Regulação econômica e tarifa** (20) — Regulação por incentivo, Custo de
  serviço, Empresa de referência, Base de Remuneração Regulatória, Prudência,
  Glosa, Quota de reintegração regulatória, WACC regulatório e de projeto,
  Parcela A, Parcela B, Fator X, Revisão tarifária periódica, Reajuste anual,
  Revisão extraordinária, Modicidade tarifária.

### Critério de domínio

> "Você domina o Bloco 5 quando, diante de qualquer regra do setor elétrico,
> responde as quatro perguntas da régua sem consultar nada — e quando consegue
> explicar, para um decisor cético, por que a independência analítica não é um
> slogan de posicionamento, mas a resposta estrutural ao mesmo problema de
> incentivos que a captura regulatória descreve."

A régua das quatro perguntas, enunciada no §Final na ordem correta: falha
corrigida, incentivo criado, dono do risco, caminho até o consumidor. Vinte e
uma verificações no total.

---

# Trilha 2 — Setor Elétrico Brasileiro

Declarada literalmente na fonte dos Módulos 08, 09 e 10, e no rodapé do 14.
Sete módulos no catálogo do repositório (06–12).

---

## Módulo 06 — História do Setor Elétrico Brasileiro

**Trilha** · Setor Elétrico Brasileiro — **atribuída**; a fonte traz apenas
`Alexandria · GridAlpha · Módulo 06`.
**Escala** · 6 aulas · 8 instrumentos · 99 termos · 10 exercícios · 36
perguntas-relâmpago · 24 itens de checklist · roteiro oral de 10 min · 3–4 h
declaradas.

### Tese

> "O Módulo 05 respondeu por que existe regulação elétrica em geral. Ficou
> faltando a pergunta que vem logo depois e que ninguém consegue responder com
> teoria econômica: por que a regulação brasileira tem exatamente a forma que
> tem. [...] Nenhuma dessas respostas está na teoria. Todas estão numa
> sequência de decisões datadas, quase todas tomadas em resposta a alguma
> coisa que deu errado antes."

Título da abertura: **"Toda estrutura de hoje tem uma data e uma causa."** O
corpo formula a diferença de método em relação ao módulo anterior: "a
diferença entre o Módulo 05 e este é a diferença entre lógica e sequência."

### Aulas

Seis aulas por arco narrativo, não por cronologia bruta — cada uma cobre um
ciclo completo em que um modelo se instala, resolve o problema do anterior,
acumula tensão própria e é encerrado por uma crise que já é o começo da aula
seguinte.

| # | Período | Título |
| --- | --- | --- |
| 01 | 1879–1934 | Antes do Estado |
| 02 | 1934–1988 | O Estado dono de tudo |
| 03 | 1988–2002 | A reforma inacabada e o trauma fundador |
| 04 | 2003–2011 | A reconstrução deliberada |
| 05 | 2012–2021 | O modelo é testado de novo |
| 06 | 2022–2028 | Onde a história pousa hoje (síntese) |

A Aula 03 é declarada a aula central do bloco. A Aula 05 enuncia a lei que o
módulo atribui à década de 2010: "risco mal alocado não desaparece — ele muda
de forma. Vira dívida, vira encargo, vira bandeira na conta, vira liminar."

### Instrumentos

| Id | Nome | O que calcula ou demonstra |
| --- | --- | --- |
| Inst · 01 | Linha do tempo · quatorze marcos, de 1879 a 2028 | Cada marco abre o que aconteceu e qual característica do setor de hoje nasceu ali. |
| Inst · 02 | Simulador · a erosão do custo histórico | Inflação, tempo e parcela importada do equipamento → cobertura da receita reconhecida em relação ao custo de reposição. |
| Inst · 03 | Simulador · como se forma uma dívida intrassetorial | Tarifa abaixo do custo, peso da dívida externa e desvalorização cambial → divisão do déficit anual entre dívida contratada e conta não paga. |
| Inst · 04 | Termômetro do racionamento · balanço de energia num período seco | Água guardada, afluência, capacidade firme não hidráulica e tempo até a cheia → profundidade de corte de consumo necessária. |
| Inst · 05 | Comparador · três arquiteturas e onde o risco pousa | Três regimes históricos contra as seis perguntas da régua, com o horizonte de contratação obrigatória como controle: mais longe reduz risco de faltar e aumenta risco de sobrar. |
| Inst · 06 | Simulador · o efeito de uma liminar num sistema de rateio | Fração do valor devido protegida por decisão judicial → quanto cada credor deixa de receber, e como o padrão se realimenta nos ciclos seguintes. |
| Inst · 07 | Linha da abertura · quando cada consumidor passou a poder escolher | Ano, carga e grupo tarifário → elegibilidade ao mercado livre e norma aplicável, de 1995 a 2028. |
| Inst · 08 | Mapa trauma → cicatriz regulatória | Onze pressões históricas com a cadeia completa: o que revelou, o que o país fez, o que continua operando, e qual risco novo a resposta trouxe. |

### Termos centrais

Noventa e nove verbetes em seis famílias:

- **Órgãos, empresas e instituições** (21) — CNAEE, DNAEE, Eletrobras, AXIA
  Energia, Chesf, Furnas, Eletronorte, Cemig, Itaipu Binacional, BNDE/BNDES,
  Light, Amforp, GCOI, MAE, ONS, ANEEL, CCEE, EPE, CMSE, GCE, Canambra.
- **Marcos legais e normativos** (22) — Código de Águas; Leis 3.890-A/1961,
  4.156/1962, 8.631/1993, 8.987/1995, 9.074/1995, 9.427/1996, 9.648/1998,
  10.438/2002, 10.847 e 10.848/2004, 12.783/2013, 13.203/2015, 14.052/2020,
  14.182/2021, 14.300/2022, 15.269/2025; Decretos 2.655/1998 e 5.163/2004;
  Projeto RE-SEB; MP 579/2012; Portarias MME 514/2018, 465/2019 e 50/2022.
- **Regimes de propriedade e organização** (14) — Concessão, Poder concedente,
  Outorga, Verticalização, Desverticalização, Estatização, Nacionalização,
  Privatização, Liberalização, Capitalização, Corporation, Ação de classe
  especial, Recuperação judicial, Universalização.
- **Tarifa, financiamento e passivos históricos** (16) — Cláusula-ouro, Custo
  histórico, Serviço pelo custo, Remuneração garantida, Equalização tarifária,
  Dívida intrassetorial, Encontro de contas, Imposto Único, Empréstimo
  compulsório, Acordo Geral do Setor Elétrico, Conta-ACR, Conta-Covid,
  Bandeiras tarifárias, Bandeira escassez hídrica, Revisão extraordinária, CDE.
- **Segurança de suprimento e crise** (13) — Racionamento, Blecaute, Segurança
  de suprimento, Margem de capacidade firme, Energia assegurada, Garantia
  física, Lastro, MRE, GSF, Risco hidrológico, Judicialização, Rateio,
  Repactuação do risco hidrológico.
- **Mercado, abertura e classes de consumidor** (13) — ACR, ACL, Consumidor
  livre e especial, Produtor independente, Autoprodutor, Comercializador
  varejista, Grupo A, Grupo B, Supridor de última instância, Produto padrão de
  baixa tensão, Geração distribuída, Mercado endereçável.

### Critério de domínio

> "Você domina o Bloco 6 quando conta a história do setor elétrico brasileiro
> em dez minutos, sem consultar nada, e conecta cada marco a uma característica
> regulatória de hoje."

O módulo declara ser **o único do currículo cujo critério de domínio é ele
próprio um exercício oral** — e por isso a §Voz nele é maior e não opcional.
Vinte e quatro verificações no §Final, ancoradas numa segunda régua, a dos
seis: dono, financiador, planejador, operador, formação de preço, crise que
encerra.

---

## Módulo 07 — Estrutura Institucional do Setor Elétrico Brasileiro

*(catálogo do repositório: "Estrutura Institucional Detalhada")*

**Trilha** · Setor Elétrico Brasileiro — **atribuída**; a fonte traz apenas
`Alexandria · GridAlpha · Módulo 07`.
**Escala** · 7 aulas · 10 instrumentos · 118 termos · 8 fichas institucionais
· 12 exercícios · 40 perguntas-relâmpago · 26 itens de checklist · 25 fontes
· 6–8 h declaradas. Data de verificação institucional declarada: 29 de julho
de 2026.

### Tese

> "Existe uma pergunta que separa quem acompanha o setor de quem trabalha
> nele, e ela nunca é sobre teoria. É esta: saiu uma portaria do Ministério
> ontem — de qual secretaria, sobre o quê, e o que vem depois? Quem responde
> em quinze segundos consegue ler o setor. Quem não responde fica esperando
> alguém explicar a notícia, e a essa altura o prazo de contribuição já
> fechou."

Título da abertura: **"O setor elétrico brasileiro não tem um chefe."** O
rodapé carrega a frase institucional que o módulo manda decorar: "Política
escolhe. Planejamento testa. Regulação transforma em regra. Operação executa.
Comercialização contabiliza. Monitoramento alerta. Concorrência disciplina."

### Aulas

| # | Camada | Título |
| --- | --- | --- |
| 01 | Política · MME e CNPE | Onde a diretriz nasce |
| 02 | Planejamento · EPE | Indicativo, não determinativo |
| 03 | Regulação · ANEEL por dentro | A agência é um processo antes de ser uma decisão |
| 04 | Operação · ONS | Uma entidade privada com função pública |
| 05 | Liquidação · CCEE | Onde o físico vira financeiro |
| 06 | Monitoramento e periferia | Os órgãos que não aparecem no organograma e travam projeto |
| 07 | Síntese · onde a frase não se sustenta | A decisão real atravessa quatro órgãos |

O §MAP declara a chave do módulo: dois mapas sobrepostos que não coincidem —
o fluxo de autoridade e o fluxo de dado. "A instituição que tem menos
autoridade formal sobre você pode ser a que mais alimenta a sua análise."

### Instrumentos

| Id | Nome | O que calcula ou demonstra |
| --- | --- | --- |
| Inst · 01 | Mapa institucional · autoridade × dado | Mesmos nós, dois fluxos alternáveis; as setas mudam completamente entre um e outro. |
| Inst · 02 | Comparador de instrumentos jurídicos | Onze instrumentos: quem emite, o que pode e **o que não pode** dispor, tempo de mudança, onde é publicado, quem contesta. |
| Inst · 03 | Estante da EPE · qual documento responde qual pergunta | Sete perguntas → produto a abrir, seção a ler primeiro, defasagem típica, erro clássico, e o que aquele documento não responde. |
| Inst · 04 | Anatomia de um ato regulatório · rito e janela de influência | Duração de cada etapa do rito → previsibilidade do processo e janela real em que uma contribuição técnica ainda altera o texto. As duas métricas não andam juntas. |
| Inst · 05 | Cadeia temporal da operação · produto, decisão e leitura | Cinco horizontes, do plurianual à pós-operação: produto, o que decide, cadência, o que se lê primeiro, qual dado sai no portal, erro clássico. |
| Inst · 06 | Régua do ciclo mensal · contabilização, garantia e liquidação | Prazos de cada etapa → tempo entre consumo e desembolso, janela para contestar antes de virar obrigação, e folga entre saber o valor e aportar garantia. |
| Inst · 07 | Escada do travamento · o que parou o projeto e quem destrava | Nove travamentos: órgão competente, instrumento que resolve, prazo típico, erro de endereçamento comum, o que fazer em paralelo. |
| Inst · 08 | Roteador de decisão | O instrumento central do bloco: tipo de decisão → órgão emissor, instrumento jurídico, rito prévio, onde é publicado, cadência, quem contesta. |
| Inst · 09 | Localizador de dado | Dado desejado → órgão, portal, caminho, granularidade, formato, defasagem e a armadilha específica daquela série. |
| Inst · 10 | Calendário institucional · o que sai quando e de quem | Mês a mês, em três camadas: cadência fixa, ciclo anual, e o que um analista deveria estar fazendo naquele mês. |

### Termos centrais

Cento e dezoito verbetes — o módulo os declara o vocabulário mais denso do
currículo — em sete famílias: Instituições e natureza jurídica (16);
Instrumentos jurídicos e atos (17 — Lei, Decreto, MP, Resolução CNPE, Portaria
normativa e ordinária, REN, REH, REA, Despacho, Edital, Contrato de concessão,
Procedimentos de Rede, Regras e Procedimentos de Comercialização); Rito,
processo e participação (15 — Diretoria colegiada, Mandato fixo escalonado,
Sabatina, Relator, Voto vencido, Tomada de subsídios, Consulta e audiência
públicas, AIR, Nota técnica, Janela de influência); Planejamento e seus
produtos (14 — PDE, BEN, PNE, Cenário de referência, Sensibilidade, Ano-base,
Data de corte, Margem de escoamento); Operação: centros, produtos e modelos
(18 — SIN, CNOS, COSR, PMO, PDO, Pré-operação, Tempo real, Pós-operação,
NEWAVE, DECOMP, DESSEM, Função de custo futuro, Parecer de acesso);
Comercialização (22 — MCP, PLD, Contabilização, Liquidação multilateral,
Rateio, Garantia financeira, Recontabilização, Contestação, CCEAR, CCEAL,
CCEN, CCGF, CER, CRCAP, SCDE, Varejista); Regulação econômica, periferia e
controle (16 — PRORET, PRODIST, RTP, RTA, Ouvidoria setorial, BNDES, IBAMA,
LP/LI/LO, ANA, DRDH, TCU, ANP, Ato de concentração).

### Critério de domínio

Declarado duplo:

> "O componente oral: diante de qualquer ato do setor, dizer em quinze segundos
> de qual órgão saiu, sob qual instrumento e o que vem depois. O componente
> operacional: navegar os portais sem tutorial."

O módulo registra que a segunda metade "nenhum bloco anterior exigiu" — e que
ela não se resolve lendo, mas sabendo, para cada dado, qual órgão publica, em
qual portal, com qual granularidade e qual defasagem. Vinte e seis afirmações
no §Final, com a instrução de marcar apenas o que se sustenta em voz alta
diante de alguém que trabalha no setor.
---

## Módulo 08 — Matriz Elétrica Brasileira em Profundidade

*(catálogo do repositório: "Matriz Elétrica")*

**Trilha** · Setor Elétrico Brasileiro — **declarada** (`Alexandria · Módulo
08 · Trilha 2 — Setor Elétrico Brasileiro`).
**Escala** · 7 aulas · 11 instrumentos · 124 termos · 6 fichas de fonte · 12
exercícios · 18 erros comuns · 40 perguntas-relâmpago · 7 ataques de decisor ·
26 itens de checklist · 28 referências · 4–5 h declaradas. Todas as grandezas
verificadas em fonte primária em 1º de agosto de 2026.

### Tese

> "Existem várias respostas corretas para a mesma pergunta, todas publicadas
> por órgão oficial, todas verificáveis, todas diferentes entre si. Quem não
> sabe disso vai passar a carreira inteira citando o número certo na conversa
> errada."

Título da abertura: **"Não existe a matriz elétrica brasileira."** O corpo
abre com quatro respostas oficiais divergentes para "quanto o Brasil tem de
capacidade instalada", cada uma com valor, data-base, universo medido e onde
está publicada.

### Aulas

| # | Aula | Título |
| --- | --- | --- |
| 01 | Os três eixos · a aula que vem antes de qualquer número | Seis pizzas para a mesma pergunta |
| 02 | A matriz por fonte · quanto, onde, e por que a ordem muda | Seis fontes, dois rankings, uma troca que explica tudo |
| 03 | Sazonalidade e complementaridade · três escalas de tempo | A matriz muda de forma três vezes: no ano, no dia e na hora |
| 04 | Hidro-dependência · a mesma característica é vantagem e vulnerabilidade | O maior sistema de armazenamento de energia do mundo não tem uma bateria |
| 05 | Transmissão e gargalos · onde a energia trava | O recurso está a dois mil quilômetros da carga |
| 06 | Distribuição e consumo · a concessão como ativo com prazo | Dois casos, um decreto, desfechos opostos |
| 07 | Síntese · a matriz é fluxo, não foto | Três forças, e o que cada uma já mudou de forma mensurável |

A Aula 01 é declarada sem nenhum número decorável, e isso é intencional: ela
ensina as três perguntas que precedem qualquer estatística de matriz.

### Instrumentos

| Id | Nome | O que calcula ou demonstra |
| --- | --- | --- |
| INST · 01 | Mapa físico do Brasil elétrico · geração × escoamento | Dois fluxos sobre a mesma geografia: nós dimensionam concentração de fonte; nos mesmos pontos, origem, corredor ou destino, e os gargalos aparecem. |
| INST · 02 | Conversor de três eixos · as duas pizzas lado a lado | Capacidade instalada e fator de capacidade por fonte → as duas pizzas, marcando em dourado toda fonte que troca de posição entre elas. |
| INST · 03 | Calculadora de fator de capacidade · com faixa típica por fonte | Potência, energia e período → FC, comparado à faixa típica da fonte, com o que um valor fora da faixa costuma indicar. |
| INST · 04 | Reconstrutor de matriz · desenhe as duas pizzas de memória | Declarado o único do sistema Alexandria que exige produzir a resposta antes de ver a correção: estimativa por fonte em capacidade e em geração → erro por fonte, erro total e diagnóstico do viés. |
| INST · 05 | Leitura lateral · o mesmo campo nas seis fontes | Vira a tabela das fichas: um campo, seis fontes lado a lado. |
| INST · 06 | Curvas de complementaridade · três escalas sobrepostas | Carga, carga líquida e fontes ligáveis; quando a soma ultrapassa a carga líquida, o excedente aparece — "o corte de geração antes de ele ter nome". |
| INST · 07 | Calendário sazonal · doze meses do sistema | Chuva, vento, safra, carga e risco de corte simultâneos, mês a mês. |
| INST · 08 | Termômetro hidrológico · estoque contra fluxo | Duas dimensões, quatro quadrantes, quatro diagnósticos distintos. |
| INST · 09 | Anatomia do corte de geração · causa, hora e quem paga | Patamar horário, dia da semana, região e condição da rede → causa predominante do corte, fonte atingida e o que resolveria aquele caso. |
| INST · 10 | Perfil de carga · casamento com a curva de geração | Perfil montado → fator de carga, demanda de ponta implícita, qual fonte casa e qual introduz descasamento. |
| INST · 11 | Roteador de recorte · qual base responde a qual pergunta | Pergunta e granularidade → base a abrir, universo coberto, defasagem, armadilha da série. |

### Termos centrais

Cento e vinte e quatro verbetes em sete famílias: Grandezas, unidades e
universos (18 — Capacidade instalada/fiscalizada/outorgada, Geração
efetiva/bruta/líquida, MW, MWh, MWmed, TWh, GW, tep, Matriz elétrica × Matriz
energética, Oferta interna, Recorte); Métricas de utilização e desempenho (16
— Fator de capacidade e FC potencial, Fator de carga, Disponibilidade,
Indisponibilidade programada e forçada, Despachabilidade, Inflexibilidade,
Rampa, Potência firme, Garantia física, Intensidade de carbono); Fontes de
geração no agregado (18 — Geração centralizada, MMGD, Autoprodução e
autoprodução não injetada, Cogeração, Bioeletricidade, Bagaço, Licor preto,
Fio d'água, Reservatório, PCH, CGH, BESS, Bombeamento reversível); Hidrologia
e armazenamento (16 — ENA, MLT, EAR, Volume útil, Reservatório equivalente de
energia, Deplecionamento, Defluência, Vertimento, Uso múltiplo da água, MRE,
Fator de ajuste); Sistema, submercados e transmissão (20 — SIN, Sistema
isolado, Submercado, Rede Básica e Rede Básica de Fronteira, DIT, Intercâmbio
e seus limites, HVDC, Bipolo, Estação conversora, Compensador síncrono,
Contingência, CUST, Margem de conexão); Restrição de geração e operação
horária (16 — Corte de geração, Restrição por confiabilidade e por razão
energética, Geração frustrada, Carga líquida, Patamar horário, Inversão de
fluxo, Observabilidade, Rateio dos cortes, Resposta da demanda); Distribuição,
consumo e bases de dados (20 — Concessionária, Permissionária, Cooperativa,
Área de concessão, Caducidade, DEC, FEC, Perdas regulatórias, Unidade
consumidora, Setor eletrointensivo, BEN, Anuário, PDE).

### Critério de domínio

> "Você domina o Bloco 8 quando desenha de memória as duas pizzas — capacidade
> e geração — com a ordem correta das fontes e a troca de posições explicada
> pelo fator de capacidade; quando qualifica pelos três eixos qualquer número
> de matriz que alguém lhe apresente, antes de aceitá-lo; e quando explica a
> complementaridade hidro-eólica."

O módulo trata explicitamente a tensão entre esse critério e a própria tese —
"o critério manda desenhar de memória a pizza; a tese diz que não existe a
pizza" — e resolve declarando o que se decora: **a ordem e a ordem de
grandeza, não o decimal**. Vinte e seis verificações, com tolerância declarada
de três pontos por fonte. O §Voz observa que "o critério deste bloco não tem
frase para decorar — tem forma para carregar".

---

## Módulo 09 — Os Mercados ACR e ACL em Profundidade

*(catálogo do repositório: "Mercado ACR e ACL")*

**Trilha** · Setor Elétrico Brasileiro — **declarada**, hero e rodapé.
**Escala** · 8 aulas · 11 instrumentos · 136 termos · 6 fichas de contrato ·
14 exercícios · 20 erros comuns · 40 perguntas-relâmpago · 8 ataques de
decisor · 28 itens de checklist · 30 referências · 6–8 h declaradas.
Verificação em 1º de agosto de 2026.

> **Estado da extração** — os 11 instrumentos abaixo existem no HTML e **não
> estão extraídos** no repositório: todas as aulas do Módulo 09 em
> `src/lib/data/alexandria-modulo-09-content.ts` têm `instruments: []`.

### Tese

> "São dois arranjos de alocação de risco. O preço decorre do arranjo. Quem
> inverte essa ordem — e o mercado inteiro inverte — compara duas grandezas
> que não são comparáveis e chama o resultado de economia."

Título da abertura: **"Os dois ambientes não são dois preços."** O corpo
detalha a cena: dois números corretos numa proposta, e uma subtração entre
eles que não significa nada, "porque eles não medem o mesmo objeto" — um é o
preço de um pacote fechado com o seguro embutido, o outro é o preço de um
componente isolado entregue sem seguro.

### Aulas

| # | Aula | Título |
| --- | --- | --- |
| 01 | Os quatro eixos | O que muda e o que não muda quando se migra |
| 02 | Ambiente regulado | O regulado por dentro: como a carteira é montada e como o resultado chega |
| 03 | Ambiente livre | O livre por dentro: quem pode, quando, por qual porta e sob qual obrigação |
| 04 | Anatomia do contrato | O contrato é um sistema de alocação de risco. O preço é uma cláusula entre onze. |
| 05 | Risco | Os riscos, um a um: quem carrega, o que dispara, o que mitiga e o que sobra descoberto |
| 06 | Preço de curto prazo | O preço que liquida a diferença — e por que a variável é a exposição, não o preço |
| 07 | Realocação e fator de ajuste | Por que uma indústria que não gera precisa entender isto |
| 08 | Síntese | Quando vale, quando não vale e quando não dá para dizer |

O §MAP fixa a topologia do módulo: energia física, contrato e dinheiro
percorrem a mesma rede de agentes por caminhos diferentes.

### Instrumentos

| Id | Nome | O que calcula ou demonstra |
| --- | --- | --- |
| INST·01 | Mapa do mercado — energia, contrato, dinheiro | Mesma topologia, três fluxos alternáveis; mostra quais setas mudam, desaparecem ou permanecem. |
| INST·02 | Comparador componente a componente | Dez componentes de custo nos dois ambientes, classificados por natureza da mudança: troca de fornecedor, troca só de mecanismo, permanece devido, ou passa a existir. |
| INST·03 | Anatomia do produto de leilão | Seis famílias de produto, quatro perguntas idênticas para cada; segundo seletor alterna as duas modalidades do contrato regulado e mostra qual campo troca de dono. |
| INST·04 | Régua de elegibilidade e cronograma condicionado | Segmento e cinco requisitos legais → estado de elegibilidade, o que falta, e o que a resposta correta a um cliente deve conter. Datas são entrada editável, de propósito. |
| INST·05 | Montador de contrato — perfil de risco resultante | Cinco dimensões contratuais → quem carrega o quê, o que ficou coberto e o que ficou descoberto. Não devolve preço nem economia, por decisão de projeto: devolve exposição residual. |
| INST·06 | Matriz contrato × risco — produto cartesiano completo | Seis estruturas × sete classes de risco = 42 células, cada uma com quem carrega, o que dispara e o que mitiga. Nenhuma célula vazia. |
| INST·07 | Simulador de exposição residual | Estrutura contratual e formato da carga → exposição descoberta em percentual e em MWh, nunca em dinheiro. |
| INST·08 | Anatomia do fator de ajuste | Mecanismo de transmissão do déficit do conjunto até a posição de um contrato específico. |
| INST·09 | Roteador — vale investigar, não vale, ou não dá para dizer | Seis perguntas, três classes de veredito; devolve diagnóstico e a lista das perguntas que faltam, e trata "não sei" como informação. |
| INST·10 | Régua do ciclo comercial — o que pode dar errado em cada etapa | Por etapa do ciclo: o que custa e que risco cria para quem está do lado do consumidor. |
| INST·11 | Localizador de dado de mercado | Qual série pública responde qual pergunta, com que defasagem, e como citá-la sem errar o recorte. |

### Termos centrais

Cento e trinta e seis verbetes em seis grupos: Ambientes, agentes e topologia
(24 — ACR, ACL, Consumidor cativo, livre, especial e representado,
Distribuidora, Gerador, Comercializador varejista, Autoprodução por
equiparação, Supridor de última instância, Submercado, Ponto de entrega
contábil); Contratação regulada, leilões e portfólio (24 — Contrato de
comercialização no ambiente regulado, Modalidade por quantidade e por
disponibilidade, Energia nova e existente, Leilão de ajuste, Fontes
alternativas, Energia de reserva, Encargo de reserva de capacidade,
Nomenclatura por antecedência, Garantia física, Cota de garantia física,
Portfólio da distribuidora, Sobrecontratação, Subcontratação, Exposição
involuntária, Mecanismo de compensação de sobras e déficits, Modicidade
tarifária, Bandeira tarifária, Conta de desenvolvimento energético);
Migração, elegibilidade e representação (22 — Elegibilidade × Prontidão,
Denúncia do contrato, CUSD, Modelagem, SMF, Adesão direta, Representação
varejista, Retorno ao ambiente regulado, Produto padrão, Mercado endereçável);
Contrato: volume, preço e cláusulas (28 — Volume plano, Sazonalização,
Modulação, Flexibilidade, Banda, Take-or-pay, Assimetria de banda, Indexação,
Energia incentivada, Atributo ambiental, Change in law, Prazo de cura, Multa
de rescisão); Preço de curto prazo, exposição e liquidação (20 — PLD, MCP,
Piso regulatório, Teto horário, Teto estrutural, TEO, TSA, Exposição residual,
Posição comprada e vendida, Contabilização, Chamada de recomposição, ESS,
Marcação a mercado); Risco, realocação e regra em transição (18 — as sete
classes de risco, Hedge, Contratação em camadas, Política de contratação, MRE,
Fator de ajuste, Energia secundária, Repactuação do risco hidrológico).

### Critério de domínio

O §Final abre com vinte e oito itens e declara a assimetria que organiza o
bloco:

> "O primeiro item é reconstrução de memória. O último é a capacidade de
> dizer, sem constrangimento, que a pergunta não é respondível com o que foi
> apresentado."

E, no corpo, a razão:

> "Um analista que só sabe produzir o 'sim' fundamentado não domina a matéria:
> domina metade dela, e é justamente a metade que qualquer vendedor competente
> também domina. A competência escassa é o 'não' fundamentado, e a competência
> mais escassa ainda é o 'não é possível concluir'."

O §Ex distribui os catorze exercícios nessa mesma proporção: quatro de
reconstrução estrutural, cinco de diagnóstico negativo ou inconclusivo, cinco
de leitura de contrato.

---

## Módulo 10 — Tarifas e a Conta de Luz Industrial

**Trilha** · Setor Elétrico Brasileiro — **declarada** (`Trilha 2 — O setor
elétrico brasileiro`).
**Escala** · 9 aulas · 11 instrumentos · 161 termos · 6 fichas de modalidade ·
14 exercícios · 20 erros · 28 itens de checklist · 35 referências.
Consulta de todas as fontes: 1º de agosto de 2026.

### Tese

> "Existe uma pergunta que todo diretor financeiro faz e que quase ninguém
> responde direito: por que a conta subiu se o consumo caiu? A resposta não
> está em nenhuma linha isolada da fatura. Está no fato de que a fatura é a
> soma de quatro famílias de decisões independentes, tomadas em quatro
> relógios diferentes, e que só uma dessas famílias pertence à empresa."

Título da abertura: **"Quatro eixos, quatro horizontes, um documento."** O §MAP
declara a estrutura da fatura industrial do Grupo A: trinta a quarenta linhas
que são desdobramento contábil de **catorze famílias**, lidas sob três lentes.

### Aulas

| # | Aula | Título |
| --- | --- | --- |
| 01 | Fundamento | Os quatro eixos de controle |
| 02 | Enquadramento | Grupos, subgrupos e modalidades |
| 03 | Demanda | Demanda contratada: o custo de errar para cada lado |
| 04 | Postos horários | Como a mesma energia custa diferente conforme a hora |
| 05 | Reativo | Fator de potência e excedente reativo |
| 06 | Encargos | Encargos setoriais, um a um |
| 07 | Tributos | Tributos e a transição em curso |
| 08 | Ciclo | O ciclo que produz o número |
| 09 | Síntese | A ordem de leitura em cinco minutos |

A Aula 03 nomeia a única linha da fatura em que errar em qualquer direção
custa dinheiro. A Aula 06 fixa a distinção comercial: encargo não é tarifa e
não é tributo, e "ninguém negocia a quota unitária de um encargo com a
distribuidora". A Aula 07 declara fronteira estrita: matéria tributária entra
só na medida em que altera a base de cobrança, sem doutrina e sem juízo.

### Instrumentos

| Id | Nome | O que calcula ou demonstra |
| --- | --- | --- |
| Inst · 01 | Mapa da fatura — três lentes sobre a mesma estrutura | Lente escolhida muda a pergunta feita simultaneamente às catorze linhas; a linha escolhida detalha a resposta. |
| Inst · 02 | Comparador de modalidades — diferença estrutural por linha | Perfil de carga e modalidade → direção da mudança por linha, o que falta saber, e elegibilidade do subgrupo. Não devolve valor de economia — decisão de projeto declarada. |
| Inst · 03 | Dimensionador de demanda — faixas de diagnóstico | Contrato vigente, maior demanda medida e demanda média → utilização do contrato, folga até a tolerância e diagnóstico por faixa, incluindo a faixa em que a resposta correta é não concluir. |
| Inst · 04 | Simulador de ultrapassagem — todos os parâmetros editáveis | Torna visível a não linearidade da penalidade: varia a demanda em torno do limite e mostra o salto quando o gatilho dispara. |
| Inst · 05 | Deslocador de carga entre postos — volume, nunca dinheiro | Consumo total, fração em ponta e fração deslocável → participação da ponta antes e depois, volume deslocado e classe de esforço exigida. |
| Inst · 06 | Apurador de excedente reativo — limites e janelas editáveis | FP por janela e intervalos em violação → proporção em violação e classificação entre estrutural e pontual. |
| Inst · 07 | Anatomia dos encargos — quem financia, quem paga, o que mudou | Onze itens da linha de encargos, quatro campos fixos cada, para leitura lateral. |
| Inst · 08 | Régua do ciclo tarifário — do processo à linha da fatura | Oito etapas: o que acontece, quem decide, o que pode surpreender, o que arquivar. |
| Inst · 09 | Reconstrutor de fatura — estime antes de ver | Cem pontos distribuídos entre seis blocos, contra a composição real → erro por bloco, direção do viés e diagnóstico do padrão. Não devolve nota. |
| Inst · 10 | Ordem de leitura cronometrada — o instrumento assinatura | Nove passos em ordem: o que olhar, critério de parada, o achado que torna os demais irrelevantes, o que registrar. |
| Inst · 11 | Roteador de diagnóstico — três classes de veredito | Vale investigar, não vale nas condições informadas, ou não é possível concluir — mais a lista específica do que falta. |

### Termos centrais

Cento e sessenta e um verbetes em oito famílias declaradas: Estrutura e
componentes da fatura; Grupos, subgrupos e modalidades (Horária azul, Horária
verde, Convencional binômia e monômia, Horária branca, Situação legada);
Demanda e potência (Demanda contratada, medida, faturável, complementar, de
ultrapassagem; Tolerância; Multiplicador; Gatilho contra franquia; Capacidade
ociosa contratada); Postos horários (Posto de ponta, fora de ponta,
intermediário; Deslocamento de carga; Ponta tarifária contra pico da planta);
Reativo e fator de potência (Fator de potência de referência e do intervalo,
Janela capacitiva e indutiva, Sobrecompensação, Excedente estrutural e
pontual, Ressonância harmônica); Encargos e tributos (Conta de desenvolvimento
energético, Quota anual de encargo, Rateio por nível de tensão, Teto de
arrecadação, Encargo de complemento de recursos, Encargo de serviços do
sistema, Encargo de energia de reserva, Programa de incentivo a fontes
alternativas, Obrigação de pesquisa e desenvolvimento, Obrigação de eficiência
energética, Taxa de fiscalização, Tarifa social, Seletividade, Essencialidade,
Modulação de efeitos, Ano de transição tributária); Ciclo
tarifário e processo (RTA, RTP, Revisão extraordinária, Aniversário tarifário,
Efeito preço × Efeito quantidade, Bandeira e rateio no ciclo, Patamar de
contingência); Medição, auditoria e diagnóstico (Memória de massa, Fator de
multiplicação, Quebra de série, Ordem de leitura, Critério de parada, Achado
confirmado e provável, Diagnóstico negativo, Dado faltante, Veredito
inconclusivo, Viés de composição).

### Critério de domínio

Declarado cronometrado, e o módulo distingue o critério oficial da sua forma
operacional:

> "O critério oficial deste bloco não é conceitual, é operacional: pegar
> qualquer fatura industrial e identificar, em cinco minutos, se há erro de
> enquadramento, demanda subótima, problema de fator de potência ou
> oportunidade de mudança de ambiente de contratação."

O §Final traduz isso em vinte e oito verificações "antes de assinar um
parecer", a primeira sendo a execução completa da ordem de leitura em cinco
minutos. O módulo tabula, para cada um dos quatro achados nomeados no
critério, a evidência mínima para levantar a hipótese, a evidência mínima para
concluir, e a saída correta se faltar evidência.

---

## Módulo 11 — Geração Distribuída e a Anatomia de uma Proposta Solar

*(catálogo do repositório: "Energia Solar e Análise de Propostas")*

**Trilha** · Setor Elétrico Brasileiro — **atribuída**; a fonte traz apenas
`Alexandria · GridAlpha · Módulo 11`.
**Escala** · 8 aulas · 11 instrumentos · 150 termos · 10 fichas de campo fixo
· 14 exercícios · 20 erros comuns · 28 itens de checklist · 32 referências ·
roteiro oral de 10 min. Verificação em 1º de agosto de 2026.

### Tese

> "A proposta solar não é um orçamento. Ela é um empilhamento de premissas
> escolhidas por quem tem interesse econômico no resultado, e a competência
> que este módulo constrói é a de desempilhá-las, uma a uma, contra a fonte
> que confirma ou refuta cada uma sem depender de nova conversa com o
> vendedor."

Título da abertura: **"Quatro eixos, e só um deles depende da palavra de quem
vendeu."** O corpo dá a razão estrutural: "a maior parte do que ela afirma não
é um preço, é uma projeção".

### Aulas

| # | Aula | Título |
| --- | --- | --- |
| 01 | Os quatro eixos | A aula que impede toda promessa de retorno prematura |
| 02 | Marco regulatório | De 2012 a 2025: seis instrumentos, duas pendências e duas fronteiras |
| 03 | Porte e modalidades | Dois limiares, quatro modalidades, e o que a proposta precisa provar |
| 04 | Regimes e cronograma | GD I, GD II, GD III — e o ano em que a regra ainda não existe |
| 05 | Premissa técnica | Irradiância, geração estimada, degradação e certificação |
| 06 | Premissa financeira | Trajetória tarifária, operação e manutenção, e o crédito que expira |
| 07 | Contrato e enquadramento | O que fica sem resposta se o equipamento falhar — e como se perde o regime |
| 08 | Síntese | Trinta minutos, duas trilhas, três vereditos |

A Aula 04 é declarada a mais densa do módulo: a frase "o sistema paga sessenta
por cento do componente de rede" é incompleta e falsa metade das vezes sem o
sujeito — sessenta por cento aplica-se a **qual regime**, e o regime depende
da data de protocolo, não do equipamento.

### Instrumentos

| Id | Nome | O que calcula ou demonstra |
| --- | --- | --- |
| Inst · 01 | Mapa da proposta — quatro lentes | Lente determina a pergunta, item determina a resposta; nenhuma célula devolve valor de economia ou prazo de retorno, por construção. |
| Inst · 02 | Separador de eixos | Doze afirmações típicas de proposta comercial → a que eixo pertencem, que método de verificação admitem, e que tipo de conclusão **não** autorizam. |
| Inst · 03 | Régua do marco regulatório — sete marcos | Por marco: qual instrumento, desde quando, o que mudou, e qual o estado de regulamentação. Os dois últimos não têm vigência no passado — são compromissos com prazo. |
| Inst · 04 | Classificador de porte e modalidade | Potência em corrente alternada, fonte e arranjo de titularidade → classe de porte, modalidade regulatória e o documento que prova o enquadramento. |
| Inst · 05 | Roteador de regime — data de protocolo determina tudo | Data de protocolo, porte, fonte, modalidade e concentração → classe de faturamento, percentual do ano corrente e estado da regra futura. |
| Inst · 06 | Verificador de geração estimada | Dados da proposta contra irradiação da localidade específica (entrada editável, não constante) → desvio entre geração declarada e geração de referência, com diagnóstico por faixa. |
| Inst · 07 | Verificador de degradação declarada | Taxa da projeção contra taxa máxima do termo de garantia do módulo → divergência e produção relativa no fim do horizonte sob cada premissa, em percentual, nunca em dinheiro. |
| Inst · 08 | Verificador de trajetória tarifária | Taxa anual assumida contra referência histórica da concessionária → afastamento e efeito composto sobre o valor relativo da energia compensada. |
| Inst · 09 | Anatomia dos oito sinais de alerta | Por sinal: o que o caracteriza, qual fonte independente o confirma, o que o comprador verifica sozinho, e a pergunta específica a levar ao vendedor. |
| Inst · 10 | Roteador de veredito — três classes | Estado dos três eixos verificáveis e da documentação → classe de veredito, redação recomendada e próximo passo. Insuficiência documental tem precedência sobre qualquer outro estado. |
| Inst · 11 | Ordem de avaliação em trinta minutos — instrumento assinatura | Oito passos, cada um com trilha, janela de tempo, o que fazer, fonte a consultar e o erro que previne; pontos de sincronização marcados. |

### Termos centrais

Cento e cinquenta verbetes em sete famílias: Regime jurídico e marcos
normativos (Marco legal da MMGD, Condições gerais de fornecimento, Resolução
originária de 2012, Reforma do setor elétrico de 2025, Tomada de subsídios,
AIR, Veto pendente); Porte, classificação e conexão (Microgeração,
Minigeração, Potência instalada em corrente alternada × Potência de pico,
Solicitação e Parecer de acesso, Orçamento de conexão, Vistoria, Vedação de
divisão de central, Sistema de medição bidirecional, Análise de inversão de
fluxo); Modalidades e sistema de compensação (SCEE, Autoconsumo local e
remoto, Geração compartilhada, Empreendimento com múltiplas unidades
consumidoras, Crédito, Expiração de créditos, Alocação por posto tarifário,
Custo de disponibilidade, Valor mínimo faturável); Faturamento, transição e
componentes (GD I, GD II, GD III, Direito adquirido, Regra de transição,
Regime agravado de concentração, Janela de postergação para 2031, Componente
de rede, Benefício locacional, Vedação de dupla contagem); Recurso solar e
grandezas de projeto (Irradiância, Irradiação global horizontal, direta normal
e difusa, Atlas Brasileiro de Energia Solar, Desempenho global, Perda por
temperatura e por sujidade, Sombreamento parcial, Degradação anual,
Superdimensionamento, Premissa embutida por omissão); Equipamento e
certificação (Módulo, Inversor, Microinversor, Certificação compulsória,
Registro de objeto, Laboratório acreditado, Escopo e exclusão de escopo,
Datasheet); Contrato, garantia e método (Garantia de produto × de performance,
Cláusula de sobrevivência, Aditivo por reforço de rede, Premissa ancorada ×
premissa solta, Veredito de insuficiência, Conflito de interesse estrutural,
Marketing travestido de explicação regulatória).

### Critério de domínio

> "O critério de domínio deste bloco tem duas dimensões, não uma: identificar
> se as premissas são realistas e se o contrato tem cláusula tóxica. São
> competências distintas, com fontes distintas e ritmos distintos, e a única
> forma de executá-las em trinta minutos é rodá-las em paralelo, com
> sincronização em três pontos."

O §Final o traduz em vinte e oito verificações "antes de assinar um parecer",
sendo a última "a capacidade de dizer que a proposta é sólida quando ela for".
O módulo registra uma divergência declarada com o Currículo Definitivo: a
faixa de prazo de retorno típico presente na seção "Economia" do currículo
**não é reproduzida** aqui, por incompatibilidade com a política de linguagem
de oportunidade e por ausência de fonte primária que a sustente.

---

## Módulo 12 — Geopolítica Energética do Brasil

**Trilha** · Setor Elétrico Brasileiro — **atribuída**; a fonte traz apenas
`Alexandria · GridAlpha · Módulo 12`.
**Escala** · 8 aulas · 11 instrumentos · 152 termos · 6 fichas de campo fixo ·
14 exercícios · 20 erros comuns · 28 itens de checklist · 34 referências ·
roteiro oral de 10 min. Verificação em 2 de agosto de 2026.

### Tese

> "Os onze módulos anteriores desceram cada vez mais fundo dentro de um mesmo
> objeto [...]. Este módulo faz o movimento contrário. Sai da unidade
> consumidora e sobe até o país inteiro, e a pergunta que organiza tudo deixa
> de ser o que este documento afirma e passa a ser como o Brasil aparece para
> quem olha de fora — o investidor que decide alocar capital, o diplomata que
> negocia texto, o comprador industrial que precisa de rastreabilidade de
> carbono, o governo estrangeiro que quer diversificar cadeia de suprimento."

Título da abertura: **"Duas colunas que precisam ser ditas juntas, e três
vetores que as ligam ao resto do mundo."** O hero enuncia o paradoxo: "O
Brasil não escolheu entre ser potência renovável e potência fóssil. Expandiu
as duas ao mesmo tempo."

### Aulas

| # | Aula | Título |
| --- | --- | --- |
| 01 | O paradoxo | Oitenta e sete por cento de quê, exatamente |
| 02 | COP30 e o ciclo climático | O que foi decidido, o que ficou de fora, e por que a distinção é o conteúdo |
| 03 | China | Complementaridade forte, concentração alta, e a diferença entre as duas |
| 04 | Estados Unidos | Duas políticas simultâneas que puxam em direções opostas |
| 05 | Europa e capital multilateral | Quando a regra é o produto de exportação |
| 06 | Hidrogênio de baixa emissão | Duas leis sancionadas, um regime que ainda não opera |
| 07 | Minerais críticos e estratégicos | Vinte e cinco por cento da reserva, menos de um por cento da produção |
| 08 | Síntese | Os trinta minutos: oito movimentos, nenhum argumento repetido |

O §MAP declara cinco frentes — protagonismo global, ciclo climático, relações
bilaterais, hidrogênio, minerais críticos — atravessadas por três vetores:
capital, regulação e diplomacia, cadeia de valor.

### Instrumentos

| Id | Nome | O que calcula ou demonstra |
| --- | --- | --- |
| Inst · 01 | Tabuleiro geopolítico — três vetores sobre cinco frentes | Quinze combinações, nenhuma célula vazia, nenhuma contendo nome de empresa, fabricante ou plataforma de dados estrangeira. |
| Inst · 02 | Separador de grandeza | Três entradas editáveis com fonte declarada → renovabilidade agregada implícita, comparada ao valor oficial informado pelo usuário. Devolve a distância entre duas grandezas citadas como se fossem uma. |
| Inst · 03 | Verificador de fonte de número | Número que circula → qual fonte provavelmente o produziu, o que a grandeza mede, erro típico de citação, e o que verificar antes de repetir. |
| Inst · 04 | Régua diplomático-regulatória | Por marco: o que é, estado na data de verificação, e o que falta. Existe para tornar impossível citar um marco sem citar o seu estado. |
| Inst · 05 | Comparador de parceiros bilaterais | Quatro parceiros × três vetores; nenhum parceiro é "melhor" em abstrato — a leitura muda inteiramente conforme o vetor. |
| Inst · 06 | Roteador de instrumento comercial | Instrumento e classe de produto → quem tem autoridade, prazo típico, controle judicial aplicável e tratamento daquela classe. Vinte e quatro combinações. |
| Inst · 07 | Diagnóstico de prontidão de dado de carbono para exportação | Quatro eixos categóricos, oitenta e uma combinações → se a posição de carbono de um exportador é defensável, e qual eixo bloqueia quando não é. |
| Inst · 08 | Régua de maturidade de projeto anunciado | Nove itens de evidência em três estados (ausente, indicativo, vinculante), total de 0 a 18 → estágio real do projeto. Mede a distância entre anunciado e comprovado, não mérito técnico. |
| Inst · 09 | Razão reserva-produção | Quatro entradas editáveis → participação na reserva mundial, na produção mundial, e a razão entre as duas — a assimetria medida, não afirmada. |
| Inst · 10 | Classificador de nome | O único instrumento autorreferente do módulo: tipo de entidade → categoria, se pode ser nomeada, onde pode aparecer, e qual a substituição correta quando não pode. |
| Inst · 11 | Andaime de conversa — trinta minutos, oito movimentos | Percorrido em ordem na primeira vez; depois treinado por entradas aleatórias, porque em conversa real quem escolhe o ponto de entrada é o interlocutor. |

### Termos centrais

Cento e cinquenta e dois verbetes em oito famílias: Grandezas e contabilidade
energética (19 — Matriz elétrica × Matriz energética, Oferta Interna de
Energia × Oferta Interna de Energia Elétrica, Tonelada equivalente de
petróleo, Renovabilidade, Balanço Energético Nacional, Ano-base, Fator de
emissão da eletricidade, Intensidade energética, Mistura obrigatória,
Reinjeção de gás); Instituições, normas e instrumentos brasileiros (20 —
Empresa de Pesquisa Energética, Ministério de Minas e Energia, Agência
Nacional de Mineração, Serviço Geológico do Brasil, Comissão Brasileira de
Recursos e Reservas, Plano Nacional de Mineração 2050, Leis 14.948/2024,
14.990/2024, 15.042/2024 e 15.269/2025, Decreto regulamentador, Estado de
vigência); Clima, carbono e compromissos (20 — Convenção-Quadro,
Conferência das Partes, Pacote de Belém, Decisão por consenso × Roteiro
voluntário, Contribuição Nacionalmente Determinada, Meta Global de Adaptação,
Sistema Brasileiro de Comércio de Emissões, Teto e comércio, Adicionalidade,
Dupla contagem, Fronteira do inventário); Comércio, tarifa e instrumentos
externos (19 — Tarifa de importação, Código tarifário, Poderes de emergência
econômica, Mecanismo de ajuste de carbono na fronteira, Regime transitório ×
definitivo, Emissão incorporada, Valor padrão, Precursor, Cadeia de custódia);
Capital, financiamento e condicionalidade (18 — Investimento direto, Estoque ×
fluxo de capital, Capital estatal estrangeiro, Novo Banco de Desenvolvimento,
Condicionalidade, Compra vinculada, Risco cambial, Decisão final de
investimento, Bancabilidade, Memorando de entendimento e sua natureza não
vinculante); Hidrogênio e derivados (19 — Hidrogênio de baixa emissão,
Neutralidade tecnológica, Convenção de cores, Eletrólise, Eletrolisador,
Hidrogênio natural, Rehidro, Habilitação e coabilitação, Sistema Brasileiro de
Certificação do Hidrogênio, Análise de ciclo de vida, Amônia, Metanol, Ferro
pré-reduzido); Minerais, mineração e cadeia de valor (19 — Mineral crítico ×
estratégico, Recurso × reserva mineral, Fatores modificadores, Óxidos totais
de terras-raras equivalente, Argila iônica, Ímã permanente, Nióbio,
Espodumênio, Grau bateria, Razão reserva-produção, Licença social); Método de
análise
geopolítica (18 — os três vetores, Complementaridade, Concentração,
Diversificação, Valor de opção, Segurança energética, Poder de barganha,
Taxonomia de nomeação, Régua de maturidade, Andaime de conversa, Devolução de
premissa).

### Critério de domínio

O módulo declara que o critério deste bloco é **diferente em espécie** dos
anteriores:

> "Todos os módulos anteriores tinham um critério de domínio ancorado em um
> objeto externo: ler uma fatura, verificar uma proposta, classificar um
> contrato. O critério deste é diferente em espécie — sustentar trinta minutos
> de conversa com um interlocutor cético sem repetir um argumento, e articular
> o paradoxo sem negar nenhum dos dois lados."

Vinte e oito itens no §Final, o primeiro sendo esse critério e o último a
pergunta que encerra qualquer conversa de investimento. Os exercícios seguem a
mesma natureza: "sustente este ponto por mais dois minutos sem repetir", "este
número está desatualizado — qual é o estado atual e de onde vem".
---

# Trilha 3 — Especialização Estratégica

Nenhum dos cinco arquivos declara esta trilha no texto. A atribuição vem
inteira do catálogo do repositório, que registra os blocos 13–17 no nível 3
mantendo o track `brasil`. O Módulo 14 contradiz isso no rodapé (ver
divergência 2, acima).

---

## Módulo 13 — Análise Financeira de Empresas e Projetos

**Trilha** · Especialização Estratégica — **atribuída**; a fonte traz apenas
`Alexandria · GridAlpha · Módulo 13`.
**Escala** · 8 aulas · 11 instrumentos · 180 termos · 6 fichas de empresa · 14
exercícios · 20 erros comuns · 28 itens de checklist · 36 referências ·
roteiro oral de 10 min. Verificação em 2 de agosto de 2026.

> **Estado da extração** — os 11 instrumentos abaixo existem no HTML e **não
> estão extraídos**: todas as aulas em
> `src/lib/data/alexandria-modulo-13-content.ts` têm `instruments: []`.

### Tese

> "Este módulo muda o objeto. Ele entra dentro de empresas específicas e faz a
> única pergunta que um investidor institucional faz de verdade: esta
> companhia é uma aposta defensável, e por quê? O documento a ser lido deixa
> de ser operacional — fatura, proposta, contrato — e passa a ser o
> instrumento que existe justamente para responder a essa pergunta: o
> Formulário de Referência."

Título da abertura: **"Extração não é análise, e a diferença cabe em três
lentes."** A armadilha que organiza o módulo está declarada no corpo: ler um
Formulário de Referência é fácil; extrair dele EBITDA, dívida líquida e payout
é trabalho de meia hora.

### Aulas

| # | Aula | Título |
| --- | --- | --- |
| 01 | Múltiplos | Por que EV/EBITDA e não P/E — e por que alavancagem infla os dois por razões opostas |
| 02 | DCF de concessão | O que acontece com um fluxo de caixa descontado quando o direito econômico tem data para acabar |
| 03 | Leitura de documento | Trinta minutos no release, sessenta no Formulário de Referência, e a pergunta que só a segunda leitura permite |
| 04 | Lente de controle | Participação econômica não é poder de voto — e no Brasil elas divergem com frequência |
| 05 | Project finance | A dívida que o projeto paga sozinho — e a métrica que decide quanto dela cabe |
| 06 | Riscos | Seis categorias de risco, e a sexta é a que o currículo não nomeia |
| 07 | Fichas de empresa | Seis fichas, um arquétipo cada, e um campo deixado deliberadamente em branco |
| 08 | Síntese | O andaime: três teses, três riscos, três lacunas — em uma hora, com âncora e contraponto |

O §MAP declara o recorte do painel: "Dez empresas vivas, seis arquétipos de
controle, quatro estados societários" — o rol canônico do currículo tem onze
nomes, e um deles deixou de existir como companhia independente. A Aula 06
registra que o currículo lista cinco riscos e que a lista está incompleta para
2026, por omitir risco de crédito e de estrutura de capital.

### Instrumentos

| Id | Nome | O que calcula ou demonstra |
| --- | --- | --- |
| INST·01 | Painel de controle setorial | Uma empresa lida por controle, por capital e por lacuna produz três diagnósticos diferentes; a ordenação muda o significado do ranking. |
| INST·02 | Calculadora de múltiplo com alavancagem | Valor de mercado, dívida líquida, EBITDA e parcela consumida por despesa financeira e impostos → EV/EBITDA e P/E lado a lado, com diagnóstico que recusa dizer "caro" ou "barato" a partir de múltiplo isolado. |
| INST·03 | Simulador de DCF de concessão com prazo definido | Entradas todas editáveis, inclusive a taxa livre de risco (derivada de Selic e inflação declaradas) → valor presente, contribuição de cada componente e sensibilidade a cada entrada. |
| INST·04 | Roteiro cronometrado de leitura | Documento e etapa → o que procurar, onde, e qual pergunta a etapa precisa deixar respondida antes de avançar. |
| INST·05 | Verificador de lacuna | Fragmentos hipotéticos de release ou Formulário construídos para serem verdadeiros, completos em si e insuficientes → categoria de lacuna, pergunta exata a fazer à área de relações com investidores, e como a resposta mudaria a conclusão. |
| INST·06 | Classificador de arquétipo de controle | Empresa (ou caso hipotético) → arquétipo, quem decide de fato, comportamento esperado sob estresse, e a pergunta de verificação. Os seis arquétipos são todos alcançáveis. |
| INST·07 | Comparador de participação e voto | Cinco situações em que os dois números divergem — ou não — com o mecanismo que produz a divergência e a consequência para leitura de risco. |
| INST·08 | Régua de estrutura de capital e cobertura | Investimento, proporção de dívida, custo real, prazo e caixa disponível para o serviço da dívida → serviço da dívida, índice de cobertura e comportamento sob choque, cruzando cobertura com folga até o gatilho de bloqueio de dividendos. |
| INST·09 | Matriz de risco em duas lentes | Oito riscos × duas lentes (empresa e projeto) = 16 combinações: como o risco se manifesta, o que mitiga, e o indicador de alerta observável antes do problema. |
| INST·10 | Comparador empresa × indicador | Dez empresas × cinco indicadores; devolve, além do valor, a ressalva que impede a comparação direta. |
| INST·11 | Andaime de tese de investimento (instrumento assinatura) | Empresa e bloco → três itens estruturados com âncora e contraponto declarados, como modelo de forma; o treino é produzir os nove sem consultar o painel, em menos de uma hora. |

### Termos centrais

Cento e oitenta verbetes em oito famílias: Demonstrações financeiras e
contabilidade (26 — Balanço patrimonial, DRE, DFC, Regime de competência,
Ativo contratual e regulatório, Receita de construção, Intangível de
concessão, Ágio, Redução ao valor recuperável, Equivalência patrimonial,
Perímetro de consolidação, Contabilidade regulatória); Resultado,
rentabilidade e distribuição (22 — EBITDA reportado, ajustado e regulatório,
EBIT, FCFF, FCFE, ROIC, ROE, Índice de distribuição, Juros sobre capital
próprio, Item não recorrente, Assimetria de ajustes); Dívida, crédito e
cobertura (26 — Dívida bruta e líquida, Alavancagem, Cobertura de juros,
Indexador, Risco de refinanciamento, Covenant, Inadimplemento técnico e
cruzado, Dispensa formal, Subordinação, Recuperação judicial e extrajudicial,
Reperfilamento, Conversão de dívida em capital); Múltiplos e avaliação (24 —
EV/EBITDA, P/E, P/VPA, Soma das partes, Desconto de conglomerado, DCF, VPL,
TIR, Valor terminal, Indenização por investimento não amortizado, Ativo
reversível, DCF reverso, Falsa precisão); Custo de capital e regulação
econômica (20 — WACC, Custo de capital próprio e de terceiros, Taxa livre de
risco, Prêmio-país, Beta, Prêmios sobrepostos, Taxa nominal × real, Base de
remuneração regulatória, Receita anual permitida, Parcela variável, Fator de
eficiência); Financiamento de projeto e garantias (26 — Project finance ×
financiamento corporativo, Sociedade de propósito específico, Patrocinador,
Recurso limitado, CFADS, ICSD, Amortização esculpida, Fontes e usos, Juros
durante a construção, Ordem de uso do caixa, Conta-reserva, Bloqueio de
distribuição, Direito de intervenção do credor, Debênture incentivada, Cessão
fiduciária de recebíveis); Estrutura societária e controle (20 — Capital total
× capital votante, Participação econômica, Ação ordinária e preferencial,
Acordo de acionistas, Limitação estatutária de voto, Bloco de controle,
Capital pulverizado, Oferta pública de aquisição, Fechamento de capital,
Incorporação de ações, Erro de perímetro, Transação com parte relacionada);
Documentos, processos e risco setorial (16 — Formulário de Referência, Fato
relevante, Release, Pesquisa sell-side, Conflito de interesse estrutural, Data
de verificação, e as sete categorias de risco).

### Critério de domínio

> "É literalmente três teses de investimento, três riscos críticos e três
> lacunas de informação, a partir de um documento, em uma hora."

O §Final abre com esse critério inteiro no primeiro item, exigindo cada tese
com âncora e contraponto, cada risco com evento e caminho até o caixa, cada
lacuna com pergunta formulável e impacto na conclusão. Vinte e oito itens no
total; o último é "a disciplina que torna todos os outros publicáveis".

---

## Módulo 14 — Biocombustíveis e Bioenergia

**Trilha** · registro contraditório na própria fonte — o rodapé diz `Trilha 2 ·
Bloco 14 do Currículo Definitivo`; o §00 fala nele como um dos "blocos finais
do Nível 3"; o catálogo do repositório o coloca no nível 3.
**Escala** · 8 aulas · 10 instrumentos · 158 termos · 6 fichas de rota · 14
exercícios · 18 erros comuns · 26 itens de checklist · 34 referências ·
roteiro oral de 8 min. Verificação em 2 de agosto de 2026.

> **Estado da extração** — os 10 instrumentos abaixo existem no HTML e **não
> estão extraídos**: `MODULO_14_INSTRUMENTOS` é um array vazio, e todas as
> aulas têm `instruments: []`.

### Tese

> "Este módulo muda de eixo de um jeito que nenhum anterior mudou: ele sai da
> eletricidade. É o primeiro cujo objeto principal não é o elétron — é a
> molécula."

Título da abertura: **"A mesma tonelada vira quatro produtos, e quem escolhe
qual não é o operador nacional."** O hero completa a régua de leitura: "Nenhum
número de bioenergia se lê sem três coisas: o ano-safra, a rota, e o produto
concorrente que deixou de ser feito." O corpo declara a consequência
pedagógica: quase nada do que treze módulos ensinaram sobre despacho
centralizado, garantia física e formação de preço em mercado organizado se
aplica aqui.

### Aulas

| # | Aula | Título |
| --- | --- | --- |
| 01 | Etanol hidratado e etanol anidro | Dois produtos da mesma destilaria, dois mercados que não se parecem em nada |
| 02 | O mix açúcar-etanol | A arbitragem que a planta faz todo dia, e a restrição que o preço relativo não mostra |
| 03 | Rotas alternativas de etanol | Uma rota que não tem safra do mesmo jeito, e outra que come o insumo da própria caldeira |
| 04 | Biodiesel e a política de conteúdo obrigatório | Como um percentual fixado por resolução cria um mercado inteiro — e quem paga por ele |
| 05 | Bagaço, cogeração e a sazonalidade | Três números para a mesma planta, e por que meio ano de entrega é complementaridade |
| 06 | Biogás e biometano | O resíduo como insumo, e uma economia que é de logística e de escala mínima |
| 07 | RenovaBio e o crédito de descarbonização | O produto que não é físico: quem tem obrigação, como o preço se forma, e por que ele não pode ser cravado |
| 08 | Síntese — ler uma cadeia | Seis fichas de campo fixo, e um campo deixado deliberadamente em branco |

O §MAP fixa a pergunta em cinco partes que abre toda leitura de bioenergia: de
qual insumo, por qual conversão, virando qual produto, vendido em qual
mercado, regulado por qual órgão.

### Instrumentos

| Id | Nome | O que calcula ou demonstra |
| --- | --- | --- |
| INST·01 | Mapa de rotas — insumo, conversão, produto, mercado, órgão | Seis rotas reorganizadas conforme a dimensão de ordenação escolhida; cada rota abre a cadeia completa e o produto concorrente pelo mesmo insumo. |
| INST·02 | Calculadora de paridade por custo/km | Quatro entradas editáveis, nenhum limiar cravado; cruza índice de preço com razão de rendimento medida → diferença de custo por quilômetro, e o que falta para a conclusão ser utilizável. |
| INST·03 | Régua de mix açúcar-etanol | Perfil industrial da planta define a faixa de alternância; remuneração relativa por quilo de ATR em cada destino e mix já praticado → veredito que cruza dois sinais. |
| INST·04 | Comparador de rotas de etanol — três rotas, sete dimensões | Cada dimensão traz coluna de ressalva de comparabilidade: o que precisa ser igualado antes de a comparação significar algo. |
| INST·05 | Calculadora de demanda derivada por conteúdo obrigatório | O percentual carrega estado além de valor: o instrumento recusa tratar os quatro estados como equivalentes, mesmo com o mesmo número digitado. |
| INST·06 | Simulador de cogeração sazonal — as três grandezas lado a lado | Potência instalada, dias de safra, autoconsumo e disponibilidade → potência, energia gerada e energia exportada simultaneamente; cruza fator de capacidade anual com dias de safra. |
| INST·07 | Régua de biometano — escala mínima e rota de entrega | Rota, volume, distância e preço líquido → energia entregue, custo logístico incremental e margem por metro cúbico normal. |
| INST·08 | Régua de crédito de descarbonização | Rota certificada, volume, diferencial de intensidade de carbono e preço → ordem de grandeza de créditos emissíveis e receita associada; recusa tratá-la como firme sem elegibilidade, certificação e titularidade. |
| INST·09 | Classificador de insumo | Produto cartesiano insumo × destino → rota, produto, órgão competente, onde entra na matriz, e o que deixou de ser feito com aquele insumo. |
| INST·10 | Verificador de base temporal e rota (instrumento assinatura) | Doze enunciados: defeito dominante, o que falta, a pergunta a fazer, e a forma corrigida do enunciado. |

### Termos centrais

Cento e cinquenta e oito verbetes em oito famílias: Base temporal e estatística
(12 — Ano-safra × Ano-calendário, Levantamento, Fechamento de safra, Data-base,
Entressafra, Safra Centro-Sul × Norte-Nordeste, Cobertura estatística); Cana,
milho e camada agrícola (20 — ATR, TCH, Moagem, Renovação de canavial, Pol,
Fibra, Impureza mineral e vegetal, CCT, Raio médio, Segunda safra, Sebo);
Etanol e destilaria (22 — Hidratado, Anidro, E1G, E2G, Fermentação, Destilação,
Desidratação, Gasolina A e C, E30/E32/E35, Veículo flex, Índice de paridade,
Custo por quilômetro, Destilaria autônoma, Unidade mista, Mix); Biodiesel
(20 — B100, Diesel A e B, B15/B16/B20/B25, Transesterificação, FAME,
Glicerina, HVO, SAF, Estabilidade à oxidação, Ponto de entupimento a frio,
Selo social); Biogás, biometano e resíduos (20 — Digestão anaeróbia,
Digestato, Substrato, Vinhaça, Torta de filtro, Dejeto animal, Purificação,
Sulfeto de hidrogênio, Siloxano, Nm³, PCI, PCS, Bio-GNC, Bio-GNL, Injeção em
rede, Raio econômico de coleta); Bioeletricidade e cogeração (20 — Bagaço,
Palha, Licor preto, Caldeira de alta pressão, Turbina de contrapressão e de
condensação, Vapor de processo, Excedente exportável, Complementaridade
sazonal, Curtailment); Política, certificação e carbono (24 — RenovaBio, CBIO,
Meta nacional e individual, Parte obrigada, Emissor primário, Escriturador,
Aposentadoria, Nota de eficiência, RenovaCalc, Intensidade de carbono, Firma
inspetora, Combustível do Futuro, ProBioQAV, CNPE, Conteúdo obrigatório);
Economia e leitura de projeto (20 — Demanda derivada, Arbitragem, Capacidade
de alternância, Custo de oportunidade, Coproduto, DDGS, Balanço de massa,
Ramp-up, Capacidade autorizada, Potencial técnico-econômico, Régua de
maturidade, Risco de base, Ressalva de comparabilidade).

### Critério de domínio

Este é o primeiro dos módulos que declara o critério como construção própria:

> "O Currículo Definitivo não fornece critério de domínio para o Bloco 14.
> Todos os blocos numerados de 1 a 13 têm a seção 'Critério de domínio' e a
> seção 'Recursos primários'; o Bloco 14 não tem nenhuma das duas — é uma
> tabela de oito tópicos com uma frase de justificativa, e nada mais. Os
> Blocos 15 e 16 também não têm."

O critério construído, declarado como tal:

> "Diante de qualquer número de bioenergia apresentado em conversa ou em
> material — volume, percentual de mistura, potência, preço de crédito —,
> consegue nomear em menos de um minuto a base temporal, a rota de conversão e
> o produto concorrente; e consegue explicar, sem consultar nota, por que uma
> usina sucroenergética entrega energia firme durante metade do ano."

Vinte e seis itens no §Final.

---

## Módulo 15 — Petróleo, Gás e Petrobras

**Trilha** · Especialização Estratégica — **atribuída**; a fonte traz apenas
`Alexandria · GridAlpha · Módulo 15`.
**Escala** · 9 aulas · 10 instrumentos · 174 termos · 6 fichas de elo · 15
exercícios · 20 erros comuns · 28 itens de checklist · 36 referências ·
roteiro oral de 9 min. Verificação em 4 de agosto de 2026.

### Tese

> "Todo número de petróleo e gás pertence a um regime e a uma camada. O regime
> decide quem é dono da molécula; a camada decide qual preço está sendo
> citado. E no fim da cadeia do gás existe uma termelétrica — que é por onde
> este mundo atravessa a fronteira e aparece no preço da eletricidade."

O título da abertura repete a espinha dorsal: **"Todo número de petróleo e gás
pertence a um regime e a uma camada."** O corpo registra a relação com o
módulo anterior: o Módulo 14 suspendeu o vocabulário elétrico; este fecha o
circuito e o traz de volta na Aula 08.

### Aulas

Organizadas por três lentes declaradas — Regime, Camada e Acoplamento
Elétrico.

| # | Lente | Título |
| --- | --- | --- |
| 01 | Regime | Três regimes, um subsolo: quem é dono da molécula |
| 02 | Regime | Recurso, reserva e produção: três grandezas, e a maior é sempre a citada |
| 03 | Regime | A parcela do Estado: royalty não é participação especial, e nenhum dos dois é imposto |
| 04 | Camada | "Preço do petróleo" não é um preço: seis camadas entre o reservatório e a bomba |
| 05 | Camada | Refino: por que o país exporta petróleo e importa derivado ao mesmo tempo |
| 06 | Camada | Gás natural: o preço quase nunca é preço de mercado |
| 07 | Camada | GNL e o Novo Mercado de Gás: o que a reforma abriu e o que ainda depende de norma |
| 08 | Acoplamento elétrico | Do contrato de gás ao preço da eletricidade — e por que a térmica despacha sem sinal econômico |
| 09 | Síntese | Ler um número ponta a ponta, e o dilema apresentado pelos dois lados |

O §MAP declara a cadeia em nove elos, cada um uma jurisdição diferente: muda o
regime jurídico, o órgão competente, a grandeza medida, a unidade e a natureza
do preço.

### Instrumentos

| Id | Nome | O que calcula ou demonstra |
| --- | --- | --- |
| INST·01 | Mapa da cadeia · quatro reagrupamentos | Os nove elos são sempre os mesmos; muda a pergunta. Cada elo abre regime, órgão competente, grandeza medida, natureza do preço e o que aquele número não diz. |
| INST·02 | Comparador de regimes | Regime × dimensão, com ressalva de comparabilidade em toda dimensão. |
| INST·03 | Régua de grandeza de subsolo | Volume provado e razões típicas entre critérios → a mesma jazida sob os três critérios, mais R/P e índice de reposição; recusa veredito sem data de certificação. |
| INST·04 | Calculadora de parcela do Estado | Parâmetros editáveis, inclusive alíquotas → royalty e participação especial separados; exige volume, preço e câmbio ao mesmo tempo. |
| INST·05 | Decompositor de preço de combustível | Cada camada editável, inclusive a subvenção (com sinal negativo) → composição, participação percentual de cada camada, e recusa de atribuir a variação a uma única camada. |
| INST·06 | Régua de refino · capacidade contra produto | Quatro entradas → quanto de um produto o parque entrega e onde fica o descompasso; separa as quatro causas possíveis do déficit. |
| INST·07 | Régua de contrato de gás | Separa molécula de transporte, aplica retirada mínima sobre o volume consumido → custo efetivo entregue, comparado ao preço de referência do dia apenas para medir a distância. |
| INST·08 | Classificador de elo | Grandeza citada × elo → se a combinação se aplica, qual regime e órgão a governam, e onde aquela grandeza de fato mora quando não se aplica. |
| INST·09 | Simulador de acoplamento gás → despacho | Monta o CVU a partir do gás entregue e mostra a posição na ordem de despacho; exige posição relativa ao custo marginal e patamar de inflexibilidade declarada. |
| INST·10 | Verificador de regime e de camada (instrumento assinatura) | Doze enunciados verdadeiros e insuficientes, nenhum com erro factual; identifica o defeito dominante, com filtro por categoria. |

### Termos centrais

Cento e setenta e quatro verbetes em oito famílias, com três glosas de
desambiguação declaradas — bacia, reserva e concessão, palavras que já
apareceram nos módulos anteriores significando outra coisa. As famílias:
Regimes e contratos de E&P (24 — Concessão, Partilha, Cessão onerosa, Custo em
óleo, Excedente em óleo, Bônus de assinatura, Programa exploratório mínimo,
Declaração de comercialidade, Individualização da produção, Polígono do
pré-sal, Oferta Permanente); Subsolo, reservas e recursos (20 — Recurso
contingente, 1P/2P/3P, Data de referência, Volume in situ, Fator de
recuperação, Relação reserva/produção, Índice de reposição, Pré-sal, Pós-sal);
Produção, medição e unidades (22 — Ponto de medição fiscal, bbl/d, boe, m³/d,
Poço exploratório, produtor e injetor, Unidade flutuante de produção,
Comissionamento, Primeiro óleo, Platô, Declínio, Custo de elevação, Preço de
equilíbrio, Descomissionamento); Participações governamentais e fiscalidade
(18 — Royalty, Participação especial, Preço de referência, Município
confrontante, Zona de produção principal, Fundo Social, Volatilidade de
receita petrolífera, Leilão de petróleo e de gás da União); Refino, derivados
e formação de preço (22 — Configuração de refinaria, Conversão profunda,
Margem de refino, Cesta de produtos, Diferencial de qualidade, Preço
realizado, Janela de apreçamento, Valor líquido na origem, Custo alternativo
do cliente, Subvenção econômica, Camada de preço, Preço na bomba); Gás natural
(28 — Gás associado e não associado, Reinjeção, Queima em flare, UPGN, City
gate, Carregador, Transportador, Entrada e saída, Capacidade firme e
interruptível, Retirada mínima, Nominação, GNL, Terminal de regaseificação,
FSRU, Infraestrutura essencial); Acoplamento elétrico e despacho (20 — Consumo
específico, CVU, Ordem de mérito, CMO, Inflexibilidade declarada, Despacho por
restrição elétrica e por garantia de suprimento, Contrato por disponibilidade,
Receita fixa e variável, Térmica marginal); Instituições, normas e governança
(20 — ANP, CNPE, MME, EPE, PPSA, Leis 9.478/1997, 12.351/2010, 12.276/2010,
12.304/2010 e 14.134/2021, Decreto 10.712/2021, Resolução ANP 1.003/2026).

### Critério de domínio

Como o Módulo 14, declara-se construído:

> "O currículo definitivo não fornece critério de domínio para o Bloco 15, e
> não fornece lista de recursos primários — verificado no arquivo, não
> presumido. Ele fornece oito tópicos, duas horas estimadas, prioridade média
> e uma frase-chave de posicionamento. O critério abaixo é construção deste
> módulo."

Na forma operacional do §Final:

> "Diante de qualquer número de petróleo ou gás, nomeio em menos de um minuto
> o regime, a camada e a grandeza — e digo qual dos três a fonte omitiu."

Vinte e oito itens, e o módulo declara sobre o último: "é o que separa
analista de militante".

---

## Módulo 16 — Tendências e Disrupções

**Trilha** · Especialização Estratégica — **atribuída**; a fonte traz apenas
`Alexandria · GridAlpha · Módulo 16`.
**Escala** · 10 aulas · 11 instrumentos · 6 fichas de tendência · 184 termos ·
16 exercícios · 20 erros comuns · 30 itens de checklist · 38 referências ·
roteiro oral de 10 min. Verificação em 4 de agosto de 2026.

> **Duas medições sobre este módulo.** Primeira: o hero traz travessão no
> lugar do número em cinco campos — termos, exercícios, erros comuns, itens de
> checklist e referências. Os números existem e estão nos títulos das próprias
> seções (184, 16, 20, 30 e 38, respectivamente); é o hero que ficou
> incompleto. Segunda: os 11 instrumentos existem no HTML e **não estão
> extraídos** — `MODULO_16_INSTRUMENTOS` é array vazio e todas as aulas têm
> `instruments: []`.

### Tese

> "Os quinze módulos anteriores descreveram um sistema que existe. [...] Todos
> descreveram o presente. Este é o primeiro cujo objeto é o que ainda não é —
> e essa diferença exige um método próprio antes de exigir qualquer conteúdo."

Título da abertura: **"Toda tendência tem um estágio e um gargalo."** O hero
completa: "O estágio decide se o número citado descreve o que existe, o que
foi autorizado ou o que foi anunciado. O gargalo decide o que precisaria mudar
para a curva continuar — e quase nunca é a tecnologia. E toda tendência
termina em MW, em MWh e num atributo de flexibilidade."

### Aulas

Organizadas por três lentes declaradas — Estágio, Gargalo e Carga.

| # | Lente | Título |
| --- | --- | --- |
| 01 | Estágio | Cinco posições, e a evidência que cada uma exige |
| 02 | Gargalo | Cinco candidatos, e quase nunca é o primeiro |
| 03 | Carga | Eletrificação de transporte: converter frota em MW |
| 04 | Carga | Armazenamento: potência, energia e duração são três números |
| 05 | Gargalo | Medição avançada: o que ela habilita, quem paga, e de quem é o dado |
| 06 | Gargalo | Descentralização depois da geração distribuída |
| 07 | Estágio | Carbono: dois mercados sem relação de substituição |
| 08 | Carga | Centros de dados: os cinco números do mesmo empreendimento |
| 09 | Gargalo | Inteligência artificial aplicada: separar previsão de decisão |
| 10 | Síntese | Mapear posicionamento sem emitir veredito sobre ninguém |

A Aula 01 substitui a expressão "em formação" — que o módulo declara não ser
um estado, mas a ausência de um — por cinco posições testáveis. A Aula 09
registra que a inteligência artificial aplicada é a única das seis famílias
que não acrescenta nem retira um megawatt do sistema, e por isso entra na
lente de gargalo, não na de carga.

### Instrumentos

| Id | Nome | O que calcula ou demonstra |
| --- | --- | --- |
| INST·01 | Mapa das seis tendências | Quatro dimensões de reagrupamento; a ordem dos cartões muda a cada dimensão. |
| INST·02 | Régua de estágio de maturidade | Tendência × posição = 30 células preenchidas: a evidência que a posição exigiria, a efetivamente disponível na data de verificação, e o veredito sobre se a tendência está naquela posição, abaixo ou acima. |
| INST·03 | Comparador de gargalo | Seis tendências × cinco candidatos = 30 combinações: se vincula ou não, por quê, e o que precisaria mudar. Dizer que um candidato não vincula é declarado afirmação com conteúdo, sujeita à mesma verificação. |
| INST·04 | Conversor de frota em carga | Valores de referência editáveis (padrão: frota plug-in do primeiro semestre de 2026 e consumo de referência do plano decenal para 2035) → participação no agregado nacional cruzada com pressão sobre o limite local declarado. |
| INST·05 | Régua de armazenamento | Valores iniciais reproduzindo os parâmetros mínimos do certame de dezembro de 2026 (30 MW, quatro horas, teto de 366 ciclos), todos editáveis → margem e o quanto falta; declara que a decisão exige segunda fonte de receita e verificação de compatibilidade. |
| INST·06 | Rampa de medição avançada | Converte a regra de ritmo obrigatório em pontos, anos e capital; cruza cobertura alcançada com intensidade de capital e recusa afirmar que o programa vale a pena. |
| INST·07 | Verificador de estado da política de carbono | Cada dispositivo do sistema classificado nos quatro estados de política, com data e evidência — mostra quantos estão em estados diferentes ao mesmo tempo. |
| INST·08 | Calculadora de escopo 2 — os dois métodos lado a lado | Os dois métodos calculados sempre juntos; o veredito recusa tratar a diferença como redução física de emissão. |
| INST·09 | Decompositor de demanda de centro de dados | Potência de tecnologia da informação → carga média e energia anual, mais a razão entre o solicitado e o que seria consumido; separa os cinco números e recusa concluir que o pedido descreve demanda. |
| INST·10 | Grade de mapeamento de posicionamento | Tendência × elo = 30 combinações: a capacidade que uma empresa precisa ter para ocupar o elo, e três perguntas de verificação cuja resposta seja documento ou número. Nenhum ocupante é nomeado. |
| INST·11 | Verificador de estágio e de gargalo | Doze enunciados, três por categoria de defeito: defeito dominante, o que falta, a pergunta a fazer e a forma corrigida. |

### Termos centrais

Cento e oitenta e quatro verbetes em oito famílias, com quatro palavras de
colisão declaradas — crédito, carga, capacidade e flexibilidade — cada uma
aparecendo com o sentido em uso neste módulo e remissão ao módulo que usou os
outros. As famílias: Estágio, evidência e maturidade (20 — Em operação em
escala, Em operação piloto, Regulado e não construído, Anunciado com data,
Projeção, Solicitado, Com parecer emitido, Contratado, Energizado, Consumido,
Sobre-solicitação, Valor de opção, Marco verificável); Gargalo, restrição e
conexão (20 — Gargalo vinculante, Restrição folgada, Deslocamento de gargalo,
Maturidade tecnológica, Regra habilitante, Sinal econômico tarifário, Cadeia
de suprimento, Parecer de acesso, Capacidade remanescente de escoamento, Fila
de acesso, Localização como variável de primeira ordem, Diagnóstico
invertido); Carga, flexibilidade e conversão (22 — Carga rígida × flexível,
Janela de deslocamento, Penalidade de deslocamento, Frequência admissível,
Fator de coincidência, Potência coincidente, Demanda máxima integrada, Carga
não convertida); Eletrificação e recarga (22 — Veículo elétrico a bateria,
Híbrido plug-in, Híbrido sem tomada, Emplacamento, Frota circulante, Recarga
em corrente alternada e contínua, Recarga de destino e de frota em garagem,
Fluxo bidirecional veículo-rede); Armazenamento (28 — Potência, Energia
armazenada, Duração, Profundidade de descarga, Eficiência de ciclo,
Degradação, Arbitragem, Spread mínimo de equilíbrio, Empilhamento de receitas,
Atrás do medidor × à frente do medidor, Armazenamento colocalizado e
autônomo); Digitalização e recursos distribuídos (24 — Medição avançada,
Sistema de gestão de dados de medição, Interoperabilidade, Governança de
dados, Submedição, Rede inteligente, Capacidade de hospedagem, Agregação,
Agregador, Microrrede, Comunidade de energia, Segurança cibernética de
tecnologia operacional); Carbono e relato (26 — Mercado regulado × voluntário,
Cota de emissões, Registro central, Plano nacional de alocação, Mensuração,
relato e verificação, Adicionalidade, Permanência, Vazamento de emissões,
Escopo 2, Método baseado em localização × em mercado, Fator médio × fator
residual); Centros de dados, modelo e comparação (22 — Potência de tecnologia
da informação, Eficiência do uso de energia, Densidade de rack, Rampa de
ocupação, Cliente âncora, Redundância, Latência, Previsão × Decisão, Validação
temporal sequencial, Uso de informação futura, Sobreajuste, Desvio de
distribuição, Custo de falso negativo).

### Critério de domínio

Diferente dos Módulos 14 e 15, aqui o currículo **fornece** o critério, e o
módulo o cita verbatim:

> "Consegue identificar 3 tendências relevantes para 2026 e mapear quais
> empresas brasileiras estão posicionadas para capturar cada uma."

O módulo registra duas ressalvas sobre ele: a âncora "2026" envelhece por
construção, e a segunda metade colide com a régua de nomeação do ativo. A
resolução declarada é que "o ativo entrega a grade e a conversa entrega os
nomes" — daí as fichas serem de tendência, e não de empresa. O §Final tem
trinta itens; o módulo descreve o último como "uma recusa".

---

## Módulo 17 — Cenário Internacional Comparativo

**Trilha** · Especialização Estratégica — **atribuída**; a fonte traz apenas
`Alexandria · GridAlpha · Módulo 17`.
**Escala** · 11 aulas — o maior número do currículo · 12 instrumentos · 6
fichas de jurisdição · 17 mercados na grade · 192 termos · 18 exercícios · 20
erros comuns · 30 itens de checklist · roteiro oral de 10 min. Verificação em
4 de agosto de 2026.

> **Duas medições sobre este módulo.** Primeira: como no Módulo 16, o hero
> traz travessão no lugar do número em sete campos — aulas, instrumentos,
> mercados na grade, termos, exercícios, erros comuns, itens de checklist e
> referências. Os números medidos e/ou declarados nas seções estão acima;
> apenas o total de referências não é declarado em lugar nenhum. Segunda: os
> 12 instrumentos existem no HTML e **não estão extraídos** — todas as aulas
> têm `instruments: []`.

### Tese

> "Você vai ouvir a frase. De um investidor, de um parceiro estrangeiro, de um
> colega de sala, de um comprador industrial. Ela vem em quatro variantes — lá
> é mais barato, eles descarbonizaram mais rápido, o modelo deles funciona e o
> nosso não, o Brasil está atrasado em mercado de capacidade — e todas as
> quatro compartilham o mesmo defeito de construção: comparam dois números que
> não medem a mesma coisa e, quando por acaso medem, atribuem a diferença à
> parcela errada."

Título da abertura: **"'Lá a energia é mais barata' quase nunca é uma
afirmação verificável."** O hero declara a decomposição que organiza o bloco:
"toda diferença que sobrevive à declaração se decompõe em três parcelas:
dotação, que o país não escolheu; desenho, que ele escolheu na arquitetura de
mercado; e política, que ele escolheu fora dela. Uma diferença dominada por
dotação não é lição — é geografia."

### Aulas

| # | Aula | Título |
| --- | --- | --- |
| 01 | Perímetro | As sete declarações que precedem qualquer comparação de preço |
| 02 | Atribuição | Dotação, desenho e política: a diferença que sobreviveu ao perímetro |
| 03 | Desenho de despacho | Por custo declarado ou por oferta; nodal, zonal ou uniforme |
| 04 | Disponibilidade | Mercado de capacidade é um produto, não uma quantidade |
| 05 | Mercados organizados | Sete operadores, um país, e o experimento mais limpo do mundo |
| 06 | Ciclo político | A parcela de política, isolada no ambiente mais limpo possível |
| 07 | Escala e direcionamento | O maior sistema do mundo em capacidade instalada, e o que isso não significa |
| 08 | Carbono comparado | Teto e comércio, tributo e fronteira são três mecanismos distintos |
| 09 | Penetração | Quatro números diferentes recebem o mesmo nome |
| 10 | Os outros mercados | Cinco casos que ensinam o que os grandes não ensinam |
| 11 | Síntese | O verificador aplicado, e o fechamento sem ranking |

O §MAP declara dezessete mercados sob quatro ordenações — preço,
descarbonização, regulação e investimento — e o achado que precede o conteúdo:
"as quatro ordenações discordam entre si", e nenhuma é ordenação de qualidade.
A Aula 04 registra a pior colisão semântica do currículo: "capacidade" já
colidia em quatro sentidos no Módulo 16, todos quantidades que se medem; o
quinto sentido é um mecanismo de remuneração que se compra.

### Instrumentos

| Id | Nome | O que calcula ou demonstra |
| --- | --- | --- |
| Instrumento 01 | Mapa das jurisdições · reagrupamento por dimensão | As dezessete jurisdições reagrupadas por dimensão; a composição dos grupos muda por completo entre uma e outra. |
| Instrumento 02 | Verificador de perímetro de preço | Marcação do que foi declarado sobre cada um dos dois números → o que falta e se a comparação sobrevive. Recusa concluir enquanto qualquer declaração estiver ausente. |
| Instrumento 03 | Decompositor de diferença | Par de jurisdições × dimensão → qual das três parcelas vincula, quais concorrem, e qual explicitamente não explica nada. |
| Instrumento 04 | Comparador de desenho de despacho | Quem despacha, por qual critério, com que granularidade o preço se forma, e quem assume o risco de volume. |
| Instrumento 05 | Grade de remuneração de disponibilidade | Por jurisdição: quem remunera, com que produto, formado por que preço, com que penalidade e sob que instituição. Inclui o instrumento brasileiro, que existe com nome diferente. |
| Instrumento 06 | Conversor de preço de disponibilidade | Preço de capacidade → custo anual e equivalente por MWh para uma carga com fator de carga declarado; recusa tratar o resultado como custo real de uma carga específica. |
| Instrumento 07 | Régua de estágio aplicada a política estrangeira | A régua de cinco posições do Módulo 16, citada e não reconstruída, aplicada a instrumentos estrangeiros: posição, evidência exigida, o que não autoriza concluir, e o gatilho que mudaria a posição. |
| Instrumento 08 | Verificador de pressuposto institucional | Mecanismo estrangeiro decomposto nas funções institucionais de que depende — operar, contabilizar, liquidar, fiscalizar, julgar, financiar — e qual instituição brasileira ocupa cada uma, ou se está ausente. Usa o mapa do Módulo 07 como gabarito. |
| Instrumento 09 | Calculadora de ajuste de fronteira | Parâmetros editáveis com fonte e data → custo incremental, recusando tratá-lo como imposto sobre o produto; a inclusão ou não da parcela elétrica altera o resultado mais que qualquer outro parâmetro. |
| Instrumento 10 | Decompositor de penetração renovável | Quatro números editáveis; recusa reportar qualquer um isolado e mostra a razão entre o maior e o menor — o tamanho do erro que uma citação sem rótulo comete. |
| Instrumento 11 | Normalizador de preço ao consumidor | Pilha de custo de dois consumidores industriais em jurisdições diferentes, camada por camada, todas editáveis; recusa concluir enquanto o perímetro não estiver declarado nos dois lados. |
| Instrumento 12 | Verificador de comparação (instrumento assinatura) | Doze enunciados comparativos, três por categoria de defeito, todos verdadeiros e insuficientes: defeito dominante, o que falta, a pergunta a fazer e a forma corrigida. |

### Termos centrais

Cento e noventa e dois verbetes — a maior contagem do currículo — em oito
famílias, com seis palavras de colisão declaradas: mercado, capacidade,
despacho, preço, reserva e carbono. As famílias: Perímetro e base de
comparação (Camada de custo, Média aritmética horária × ponderada pela carga ×
ponderada pelo perfil, Ano hidrológico, Câmbio nominal, Paridade de poder de
compra, Deflacionamento, Subsídio explícito × cruzado, Tributo recuperável,
Dado de ponto × de região, Ficha de metadados); Atribuição (Dotação, Desenho,
Política, Parcela vinculante × concorrente × que não explica, Erro de
atribuição, Inveja institucional, Provincianismo analítico, Condicionalidade
de desenho, Lição transferível, Imitação impossível); Desenho de despacho e
formação de preço (Despacho por custo declarado × por oferta, Preço nodal,
zonal e uniforme por submercado, Componente de congestionamento e de perdas,
Redespacho, Direito financeiro de transmissão, Acoplamento de mercados, Renda
de congestionamento, Monitor de mercado, Cootimização, Zona de oferta,
Otimização estocástica); Adequação e remuneração de disponibilidade (Mercado
de capacidade, Capacidade acreditada, Acreditação probabilística, Curva de
demanda administrada, Requisito de confiabilidade, Margem de reserva,
Penalidade por não-desempenho, Mercado só de energia, Preço de escassez,
Obrigação de lastro, Reserva estratégica, Leilão de retaguarda); Penetração,
matriz e intercâmbio (Penetração em capacidade instalada × em geração no ano ×
em instante de pico × em energia consumida líquida, Canibalização de preço,
Preço capturado, Saldo de intercâmbio, Carga líquida, Rampa líquida,
Intensidade de emissão da matriz, Demanda operacional, Geração atrás do
medidor); Carbono, fronteira e comércio (Teto e comércio, Tributo sobre
carbono, Mecanismo de ajuste de fronteira, Carbono incorporado, Emissão direta
× indireta, Certificado de fronteira, Fator de entrada gradual, Abatimento por
preço pago na origem, Limiar de dispensa, Alocação gratuita); Instituições e
pressupostos (Pressuposto institucional, as seis funções, Operador
independente, Organização regional de transmissão, Regulador de atacado,
Comissão estadual, Agência de cooperação entre reguladores, Plano quinquenal,
Código de rede, Instância de arbitragem, Prevalência estatal); Investimento,
risco e verificação (Custo de capital, Contrato por diferença, Prêmio
regulado, Crédito tributário transferível, Início de construção, Restrição de
cadeia, Cascata de risco, Índice de concentração, os quatro defeitos de
comparação, Enunciado verdadeiro e insuficiente).

### Critério de domínio

O critério vem do currículo e está citado no §MAP:

> "O critério do currículo pede comparar o Brasil com cinco outros mercados em
> quatro dimensões — preço, descarbonização, regulação e investimento — e
> explicar por que cada um é diferente."

O que o módulo declara como construção própria é o **método** de cumprir a
segunda metade: "O currículo pede que você 'explique por que cada um é
diferente'. Não diz como. A decomposição em dotação, desenho e política é a
estrutura que escolhi para cumprir essa metade do critério, e ela precisa ser
declarada como escolha porque outras estruturas seriam defensáveis."

O §Final tem trinta itens, percorridos "antes de aceitar, produzir ou repetir
qualquer comparação internacional" — o primeiro é o mais usado, o último o
mais difícil de cumprir. O fechamento do módulo é declarado **sem ranking**.

---

# Contagens medidas

Medidas no HTML, por extração determinística. Comparadas ao que o hero de cada
módulo declara: onde os dois existem, coincidem.

| # | Módulo | Seções | Aulas | Instrumentos | Termos |
| --- | --- | --- | --- | --- | --- |
| 01 | Física de Energia e Eletricidade | 19 | 9 | 7 | 38 |
| 02 | Como Funciona uma Rede Elétrica | 20 | 10 | 9 | 65 |
| 03 | Tecnologias de Geração | 20 | 10 | 9 | 63 |
| 04 | Economia de Mercados de Energia | 17 | 7 | 7 | 58 |
| 05 | Regulação e Desenho de Mercados | 16 | 6 | 6 | 72 |
| 06 | História do Setor Elétrico Brasileiro | 16 | 6 | 8 | 99 |
| 07 | Estrutura Institucional | 17 | 7 | 10 | 118 |
| 08 | Matriz Elétrica Brasileira | 17 | 7 | 11 | 124 |
| 09 | Os Mercados ACR e ACL | 18 | 8 | 11 | 136 |
| 10 | Tarifas e a Conta de Luz Industrial | 19 | 9 | 11 | 161 |
| 11 | Geração Distribuída e Proposta Solar | 18 | 8 | 11 | 150 |
| 12 | Geopolítica Energética do Brasil | 18 | 8 | 11 | 152 |
| 13 | Análise Financeira | 18 | 8 | 11 | 180 |
| 14 | Biocombustíveis e Bioenergia | 18 | 8 | 10 | 158 |
| 15 | Petróleo, Gás e Petrobras | 19 | 9 | 10 | 174 |
| 16 | Tendências e Disrupções | 21 | 10 | 11 | 184 |
| 17 | Cenário Internacional Comparativo | 22 | 11 | 12 | 192 |
| | **Total** | **313** | **141** | **165** | **2.124** |

"Seções" conta aulas mais aparato (§00, §MAP, §Caso, §Erros, §Ex, §Quiz, §Voz,
§Final, §Lex, §Ref, e as §Fichas nos Módulos 16 e 17). O aparato é de dez
seções em quase todo o currículo; onze no Módulo 16, que tem §Fichas próprio,
e onze no 17, pela mesma razão.

# Estado da extração no repositório

Contagem por módulo dos instrumentos presentes no HTML e dos efetivamente
extraídos em `src/lib/data/alexandria-modulo-NN-content.ts`.

| # | No HTML | Extraídos | Estado |
| --- | --- | --- | --- |
| 01 | 7 | 7 | completo |
| 02 | 9 | 9 | completo |
| 03 | 9 | 9 | completo |
| 04 | 7 | 7 | completo |
| 05 | 6 | 6 | completo |
| 06 | 8 | 8 | completo |
| 07 | 10 | 10 | completo |
| 08 | 11 | 11 | completo |
| 09 | 11 | **0** | `instruments: []` em todas as 8 aulas |
| 10 | 11 | 11 | completo |
| 11 | 11 | 11 | completo |
| 12 | 11 | 11 | completo |
| 13 | 11 | **0** | `instruments: []` em todas as 8 aulas |
| 14 | 10 | **0** | `MODULO_14_INSTRUMENTOS = []` |
| 15 | 10 | 10 | completo |
| 16 | 11 | **0** | `MODULO_16_INSTRUMENTOS = []` |
| 17 | 12 | **0** | `instruments: []` em todas as 11 aulas |
| | **165** | **110** | **55 instrumentos sem extração** |

Todas as 141 aulas dos dezessete módulos estão agregadas em
`src/lib/data/alexandria-curriculo.ts`, com corpo e lead. A lacuna é só de
instrumento.

Este catálogo descreve os 165 instrumentos que existem na fonte, não os 110
que estão no código.
