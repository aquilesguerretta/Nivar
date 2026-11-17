# M02 · grupo "aparato"

Fonte (só leitura): `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo02.html` (3843 linhas). Saída: [`aparato.json`](aparato.json).
Camada: **fonte**. Todo texto entre aspas ou em tabela saiu do JSON, que saiu do HTML por script
(`extratores/`); nada foi digitado. `L` = linha aproximada no HTML-fonte. Divergências ficam com as duas
leituras e nenhuma é resolvida aqui (P17–P24 valem só na camada de produto).

## Contagens

| Item | Valor |
|---|---|
| caso: dados / leituras / callout / pedidos / perguntas / decisões | 6 / 5 / 1 / 5 / 0 / 0 |
| quiz: questões × alternativas | 10 × 4 |
| quiz: faixas do placar | 4 |
| quiz: gabarito | BBBCBBBBCB |
| checklist final: itens (como badge no código) | 18 (3) |
| exercícios: total / com aula / sem aula (prosa diz) | 10 / 8 / 2 ("Oito") |
| referências: itens / grupos / com domínio / com URL | 16 / 2 / 11 / 0 |
| glossário: termos / faltam no código / sobram / divergentes / quebras de ordem | 65 / 0 / 0 / 0 / 0 |
| divergências / lacunas | 9 / 6 |

## Caso — Operação A — a mesma fatura, agora com a lente da rede.

Marcador § Caso · Aplicação prática (L2468). Etiqueta literal: "Operação A · Caso de referência · Parte 2" (L2475).
A fonte do M02 rotula o caso como "Parte 2" e o primeiro item de "O que pedir" diz "(já solicitadas na Parte 1)", remetendo ao caso do M01 — que não carrega rótulo de parte (extração m01, caso.parte = null). Registrado literal; P17 manda não expor "Partes" da fonte no produto.

- **lead:** "No Módulo 01 você leu a fatura da Operação A com a lente das grandezas: demanda, fator de carga, fator de potência. Agora releia o mesmo cliente com a lente deste módulo: onde ele está pendurado no sistema, quanto de rede ele usa, e quais custos da fatura dele nasceram a centenas de quilômetros da mina."
- **cabeçalho:** "Mineração de médio porte · Minas Gerais · Grupo A4 (13,8 kV)"
- **aviso:** "Cliente fictício consolidado de traços comuns. Não representa cliente real. Linguagem responsável: nenhuma economia é prometida — fala-se em oportunidades potenciais a validar."

**Dados**

| Rótulo | Valor | Alerta na fonte | Origem |
|---|---|---|---|
| Submercado | Sudeste / Centro-Oeste |  | L2482 |
| Posição na cadeia | MT da distribuidora · 13,8 kV (A4) |  | L2486 |
| Demanda contratada | 500 kW |  | L2490 |
| Perdas a montante (típicas) | ~5–6% embutidas |  | L2494 |
| Fio + encargos na fatura | Ordem de metade — a validar | sim | L2498 |
| Ambiente | Cativo (ACR) · candidata a estudo ACL |  | L2502 |

**Leitura estruturada com a lente da rede**

| Dimensão | Texto literal | Remissões em prosa | Origem |
|---|---|---|---|
| Onde ela está | Onde ela está — conectada na média tensão da distribuidora, a Operação A usa a cadeia quase inteira da Aula 03: Rede Básica, subtransmissão, SE da distribuidora, rede de 13,8 kV. Pelo INST·03, isso significa algo como 5–6% de perdas técnicas embutidas a montante — energia que ela paga e nunca recebe (Aula 09). Estivesse conectada em 138 kV, carregaria perto de metade disso; mas a conexão A2 exige subestação própria de outro porte — é otimização de capital, não erro. | Aula 03, INST·03, Aula 09 | L2510 |
| O que é fio na conta dela | O que é fio na conta dela — como cliente A4, ela paga TUSD em duas dimensões: R$/kW sobre os 500 kW contratados (a reserva de capacidade do Módulo 01, agora entendida como pedágio de infraestrutura) e R$/MWh sobre a energia. Dentro dessa TUSD viajam Fio B da distribuidora, repasse de TUST, encargos e perdas reconhecidas. Nada disso é negociável com fornecedor de energia — só otimizável por enquadramento. Primeira tarefa do CLE: medir quanto da fatura é exatamente isso. | Módulo 01 | L2512 |
| O que o sistema faz com ela sem pedir licença | O que o sistema faz com ela sem pedir licença — no ambiente cativo, decisões tomadas a mil quilômetros chegam na conta: despacho térmico de estiagem vira bandeira tarifária; redespacho por restrição vira ESS rateado; o estado dos reservatórios da Aula 05 vira o humor da fatura do trimestre. A empresa não vê nenhum desses mecanismos — vê só o total subir. Traduzir esse canal é serviço de inteligência, não de venda. | Aula 05 | L2514 |
| Exposição física | Exposição física — alimentadores industriais de MT integram os esquemas de corte regional (ERAC) e estão sujeitos aos eventos da Aula 08. Para uma planta com britadores e bombas, interrupção não programada é perda de produção e risco de processo. Perguntas obrigatórias: histórico de interrupções do alimentador (DEC/FEC individuais — Módulo 01), existência de geração de emergência e lógica de religamento. | Aula 08, Módulo 01 | L2516 |
| A lente da rede moderna | A lente da rede moderna — releia a planta com a Aula 07 nos olhos: britadores e bombas com janelas de flexibilidade (resposta da demanda potencial), pátio com área para solar, carga crítica que justificaria bateria ou microrrede, gerador de emergência já existente. A Operação A é candidata clássica ao estudo que o GridAlpha Simulate faz: cruzar a curva de carga real da planta com cenários de bateria, geração local e deslocamento de produção — antes de qualquer fornecedor entrar na sala. Tudo como oportunidade potencial a validar com dados de medição, nunca como promessa. | Aula 07 | L2519 |

**Callout "Linguagem GridAlpha para esse caso"** (L2521): ""A fatura da Operação A tem três naturezas de custo: energia, uso de infraestrutura e encargos do sistema. A primeira é negociável; a segunda é regulada e só se otimiza por enquadramento — tensão, demanda contratada, modalidade; a terceira é política embutida. Antes de discutir mercado livre, vamos decompor as três com doze meses de faturas e quantificar oportunidades potenciais a validar em cada camada. Sem decomposição, qualquer número de economia seria especulação.""

**O que pedir ao cliente nesta etapa**

- As 12 faturas completas (já solicitadas na Parte 1), agora para decomposição energia × fio × encargos; (L2528)
- CUSD vigente: tensão de conexão, demanda contratada, ponto de entrega; (L2529)
- Titularidade e estado da subestação particular (trafo, proteção, última manutenção); (L2530)
- Histórico de interrupções e indicadores individuais de continuidade do alimentador; (L2531)
- Existência de geração própria/emergência e janelas críticas de processo. (L2532)

**Perguntas:** null. A fonte não faz perguntas ao learner no § Caso (zero "?" dirigido ao learner; as leituras chegam resolvidas). P17: o Desafio de decisão é da camada Alexandria, só com fatos do caso.
**Decisão pedida:** null. A fonte não pede decisão. O callout traz a fala recomendada ("vamos decompor as três com doze meses de faturas") e a lista do que pedir ao cliente.
**Código:** Busca literal em src/: nenhum arquivo contém o texto do § Caso do M02.

## Quiz — Dez perguntas. Resposta imediata.

Introdução: "Quiz de fluência. Cada resposta tem feedback explicativo. O critério de domínio do módulo é acertar pelo menos 8 de 10 sem consultar." (L2676). Rótulo por questão (template do
script): `Pergunta ${String(idx + 1).padStart(2, "0")} / 10`. O mesmo feedback é exibido para acerto e erro (fbEl.textContent = q.feedback).

### Q01 — Por que o sistema elétrico precisa equilibrar geração e consumo a cada segundo?

- A) Porque a regulação da ANEEL exige relatórios em tempo real
- B) Porque eletricidade, em escala de rede, não se armazena — todo desbalanço vira desvio de frequência imediatamente **← gabarito**
- C) Porque as térmicas não podem ser desligadas depois de acionadas
- D) Para reduzir as perdas técnicas da transmissão

Explicação: "É a tese central do módulo. Sem estoque no meio do caminho, geração ≠ consumo vira desvio de frequência na hora — e dessa única restrição derivam operador central, reservas, serviços ancilares, proteção automática e a separação energia × fio." (L3676)

### Q02 — O que define a Rede Básica no Brasil?

- A) Todas as linhas operadas por empresas estatais
- B) As instalações de transmissão em tensão igual ou superior a 230 kV **← gabarito**
- C) Apenas as linhas de 500 kV e os elos HVDC
- D) As linhas construídas após a Lei 9.648/1998

Explicação: "Rede Básica = transmissão ≥ 230 kV, operada centralizadamente pelo ONS, acessada via CUST e remunerada via TUST. Abaixo dela ficam as DIT e as redes de distribuição — é fronteira de regime jurídico, de operador e de cobrança." (L3687)

### Q03 — Para transmitir a mesma potência, dobrar a tensão da linha faz as perdas resistivas...

- A) Caírem pela metade
- B) Caírem a um quarto **← gabarito**
- C) Dobrarem
- D) Permanecerem iguais

Explicação: "P ≈ √3·V·I·cosφ: dobrar V corta I pela metade. Como perdas = 3·R·I², metade da corrente dá um quarto das perdas. Esse quadrado é a razão de existir de toda a escada de tensões — de 230 a 765 kV — e dos bipolos HVDC." (L3698)

### Q04 — Qual destas funções NÃO é do ONS?

- A) Despachar as usinas do SIN em tempo real
- B) Coordenar a recomposição do sistema após perturbações
- C) Definir as tarifas de uso da distribuição **← gabarito**
- D) Administrar os contratos de uso da transmissão (CUST)

Explicação: "Tarifa é ANEEL. O ONS opera, planeja a operação, administra a transmissão e coordena recomposição — não tarifa, não vende energia (CCEE liquida o mercado), não planeja a expansão (EPE/MME). Confundir esse mapa desqualifica em uma frase." (L3704)

### Q05 — No despacho brasileiro, o 'custo' que posiciona a hidroeletricidade na ordem de mérito é...

- A) Zero, porque água não tem custo de combustível
- B) O valor da água — custo de oportunidade calculado pela cadeia NEWAVE/DECOMP/DESSEM **← gabarito**
- C) O CVU declarado pelo gerador hidrelétrico
- D) O PLD do dia anterior

Explicação: "Água não custa, mas turbinar hoje custa não tê-la na estiagem. Esse custo de oportunidade — o valor da água — é calculado pelos modelos, não declarado, e na maior parte das horas é ele que precifica o Brasil." (L3715)

### Q06 — A frequência do SIN caiu para 59,7 Hz. O que isso indica?

- A) Sobra de geração no sistema
- B) O consumo está excedendo a geração naquele instante **← gabarito**
- C) Queda de tensão na Rede Básica
- D) Falha no SCADA do ONS

Explicação: "Frequência é o medidor do balanço: falta geração → as máquinas síncronas desaceleram → f cai. A inércia freia a queda, a regulação primária estanca e o CAG devolve a 60,00 Hz. Frequência subindo seria o sintoma oposto." (L3726)

### Q07 — O que caracteriza a reserva girante?

- A) Usinas desligadas que podem ser acionadas em algumas horas
- B) Capacidade já sincronizada ao sistema, capaz de elevar geração em segundos **← gabarito**
- C) A soma das baterias dos consumidores
- D) A margem disponível nos intercâmbios entre subsistemas

Explicação: "É o jogador aquecido no banco: usinas girando abaixo do máximo (80 MW podendo gerar 100 = 20 MW de reserva girante), prontas em segundos. É a primeira reserva a agir depois da inércia e da regulação primária — e custa dinheiro mesmo sem gerar, como todo seguro." (L3737)

### Q08 — Black start é...

- A) Um leilão de reserva de capacidade
- B) A capacidade de uma usina partir sem energia externa e ajudar a recompor o sistema **← gabarito**
- C) O corte automático e escalonado de carga por subfrequência
- D) Um modo de operação de inversores grid-forming

Explicação: "Depois de um colapso amplo, alguém precisa acender a primeira luz: unidades black start partem sozinhas, energizam trechos, permitem sincronizar outras usinas e reconectar cargas em blocos. O corte por subfrequência é outra coisa — é o ERAC." (L3748)

### Q09 — Dentro de um submercado brasileiro, o sobrecusto do redespacho por congestionamento aparece...

- A) No PLD daquele submercado
- B) Na TUST dos geradores envolvidos
- C) Como encargo (ESS), rateado entre os consumidores **← gabarito**
- D) Não existe congestionamento dentro de submercado

Explicação: "O desenho zonal trata a malha interna como placa de cobre: o PLD não enxerga a restrição. O constrained-on/off vira ESS na liquidação da CCEE — pago por todos, visível em preço nenhum. Entre submercados, o mesmo fenômeno aparece de outra forma: como spread de PLD." (L3759)

### Q10 — Uma indústria migra para o mercado livre (ACL). O que acontece com a conta da distribuidora?

- A) Deixa de existir — o fornecedor assume tudo
- B) Continua: ela segue pagando TUSD pelo uso do fio, além de encargos **← gabarito**
- C) É substituída por um pagamento direto ao ONS
- D) Vira opcional, negociada caso a caso

Explicação: "Migrar muda quem vende a energia; o fio é monopólio regulado da distribuidora local e continua sendo pago via TUSD (demanda + energia no Grupo A), com encargos e obrigações de agente na CCEE. Quem promete 'sair da distribuidora' vende uma impossibilidade física." (L3770)

### Placar ("Pontuação final", total "/10")

| Condição literal | Faixa (derivada) | Mensagem | Origem |
|---|---|---|---|
| correct >= 9 | 9–10 | Domínio sólido. Pronto para o Módulo 03 — Tecnologias de Geração. | L3829 |
| correct >= 7 | 7–8 | Bom. Revise os pontos errados, depois avance para o próximo módulo. | L3830 |
| correct >= 5 | 5–6 | Domínio parcial. Volte às aulas onde errou antes de avançar. | L3831 |
| else | 0–4 | Refaça o estudo. O critério de domínio é 8/10 — sem atalho. | L3832 |

As mensagens mandam avançar com 7 acertos ("depois avance para o próximo módulo") enquanto a prosa e a faixa 0–4 dizem "8/10". Registro legado; P18: nenhum limiar declara domínio.

## Checklist final — O critério de conclusão.

"Você só passa neste módulo se conseguir, sem consultar nenhum material, fazer todas as ações abaixo. Marque ao longo do estudo. Quando todas estiverem marcadas — e o quiz fechar em 8/10 ou mais — você está pronto para o Módulo 03 — Tecnologias de Geração." (L2762). Mecânica: toggle visual por clique (classList.toggle("checked")); sem persistência.

| # | Item literal | P14 (inferido) | Badge no código | Origem |
|---|---|---|---|---|
| 1 | Desenhar num guardanapo a cadeia geração → transmissão → distribuição → consumo, com tensões típicas e dono de cada trecho | desenho | sim | L2765 |
| 2 | Explicar por que um apagão numa região atinge outra em segundos — os cinco passos da cascata | producao_oral_ou_livre |  | L2766 |
| 3 | Separar rede elétrica de mercado elétrico em duas frases | producao_oral_ou_livre, limite_de_extensao |  | L2767 |
| 4 | Provar com I²R por que dobrar a tensão divide as perdas por quatro | producao_oral_ou_livre, calculo_ou_derivacao |  | L2768 |
| 5 | Dizer o que é a Rede Básica (≥ 230 kV) e por que essa fronteira muda contrato e cobrança | producao_oral_ou_livre |  | L2769 |
| 6 | Explicar quando HVDC vence o AC — e citar os bipolos de Belo Monte como exemplo | producao_oral_ou_livre |  | L2770 |
| 7 | Diferenciar disjuntor de seccionadora e explicar seletividade da proteção | producao_oral_ou_livre |  | L2771 |
| 8 | Desenhar a curva líquida de um dia ensolarado e apontar a rampa do fim da tarde | desenho |  | L2772 |
| 9 | Explicar a ordem de mérito e o valor da água — e por que estiagem encarece o Brasil inteiro | producao_oral_ou_livre |  | L2773 |
| 10 | Citar a frase: custo mínimo sujeito a restrições de segurança e física da rede | producao_oral_ou_livre |  | L2774 |
| 11 | Listar três coisas que o ONS faz e três que ele não faz, nomeando quem faz | producao_oral_ou_livre | sim | L2775 |
| 12 | Narrar a cascata de horizontes: PMO → PDO → tempo real → pós-operação | producao_oral_ou_livre |  | L2776 |
| 13 | Diferenciar reserva girante, operativa e fria — e defender por que reserva parada custa dinheiro | producao_oral_ou_livre |  | L2777 |
| 14 | Listar quatro serviços ancilares e conectar suporte de tensão ao kvar do Módulo 01 | producao_oral_ou_livre |  | L2778 |
| 15 | Narrar os dez segundos pós-perda de usina: inércia → regulação primária → CAG → ERAC | producao_oral_ou_livre | sim | L2779 |
| 16 | Contar 2001, 2009 e 2023 em duas frases cada — com a lição certa de cada um | producao_oral_ou_livre, limite_de_extensao |  | L2780 |
| 17 | Explicar TUSD × TUST e por que migrar ao livre não elimina a conta da distribuidora | producao_oral_ou_livre |  | L2781 |
| 18 | Explicar onde o custo do congestionamento aparece (spread de PLD) e onde se esconde (ESS) — e o que é curtailment | producao_oral_ou_livre |  | L2782 |

## Índice de exercícios — Oito exercícios. Gabarito escondido.

"Resolva antes de revelar. Os exercícios cobrem o arco completo do módulo — da física das perdas à conversa de Summit sobre curtailment.". Critério por exercício: null em todos (A fonte não traz critério por exercício (nem rubrica, nem pontuação). O § Ex também não declara limiar.).

| Tag | Aula vinculada | Enunciado | Resposta de referência | Limite literal | Código (id · enunciado= · gabarito) | Origem |
|---|---|---|---|---|---|---|
| Ex · 01 · Aula 02 | Aula 02 | Uma linha transmite potência fixa P. A tensão de operação é dobrada (mesmo condutor, mesma distância). O que acontece com a corrente e com as perdas resistivas? Justifique com as fórmulas. | Como P ≈ √3 × V × I × cos φ, dobrar V com P fixa faz a corrente cair pela metade. Como Pperdas = 3 × R × I², corrente pela metade dá (½)² = ¼ — as perdas caem a um quarto. Generalizando: perdas ∝ (P/V)². É a equação inteira por trás da escada de tensões: 230, 345, 500, 765 kV são respostas econômicas a esse quadrado. | — | ex-01 · sim · integral | L2574 |
| Ex · 02 · Aula 02 | Aula 02 | Um bloco de 600 MW é transmitido em 500 kV trifásico com cos φ = 0,95. Estime a corrente total de linha. (Use √3 ≈ 1,73.) | I = P ÷ (√3 × V × cos φ) = 600.000.000 ÷ (1,73 × 500.000 × 0,95) ≈ 730 A. Repare na mágica da alta tensão: 600 MW — a carga de uma cidade grande — atravessando o país com menos de mil ampères. O mesmo bloco em 13,8 kV exigiria dezenas de milhares de ampères, fisicamente inviável. | — | ex-02 · sim · integral | L2583 |
| Ex · 03 · Aula 05 | Aula 05 | Pilha simplificada: hidro fio d'água 10 GW (custo ~0), eólica 8 GW (~0), hidro reservatório 30 GW (valor da água R$ 120), GN 12 GW (CVU R$ 300), óleo 5 GW (CVU R$ 900). Demanda = 52 GW. Qual a usina marginal e o CMO? E se a demanda subir para 62 GW? | Empilhando do mais barato: 10 + 8 = 18 GW; + 30 de hidro = 48 GW — ainda faltam 4. Entra o GN: marginal = GN, despachando 4 dos 12 GW, e CMO = R$ 300/MWh. Com 62 GW: 48 + 12 (GN cheio) = 60; faltam 2 → óleo na margem, CMO = R$ 900/MWh. Repare que 10 GW a mais de demanda triplicaram o custo marginal — a pilha é convexa, e é por isso que pico custa desproporcionalmente caro. | — | ex-03 · sim · integral | L2592 |
| Ex · 04 · Aula 06 | Aula 06 | Cite três coisas que o ONS não faz — e diga, para cada uma, qual instituição faz. | Não define tarifas nem regula — ANEEL. Não contabiliza nem liquida energia (e não publica o PLD) — CCEE. Não planeja a expansão de longo prazo — EPE/MME (o ONS planeja a operação e propõe ampliações via PAR/PEL, mas a expansão é política de planejamento). Bônus: não constrói nem é dono de linha — transmissoras concessionárias. Confundir esse mapa em conversa de setor desqualifica na primeira frase. | — | ex-04 · sim · integral | L2601 |
| Ex · 05 · Aula 08 | Aula 08 | Por que é tecnicamente correto dizer que 2001 foi uma crise de energia, não de potência? Responda em até quatro frases usando o vocabulário do Módulo 01. | Potência (MW) é capacidade instantânea; energia (MWh) é estoque ao longo do tempo. Em 2001, o parque tinha MW suficientes para atender o pico — o que faltou foi estoque: anos de hidrologia ruim e subinvestimento esvaziaram os reservatórios, e um sistema hidro-dominado sem água não tem MWh para sustentar os meses seguintes. Por isso a solução foi racionar consumo acumulado (meta de ~20% de redução de kWh), não cortar picos. É a distinção kW × kWh decidindo política nacional — e a origem institucional da reforma de 2004. | até quatro frases | ex-05 · sim · integral | L2610 |
| Ex · 06 · Aula 08 | Aula 08 | Dois sistemas perdem a mesma usina de 6 GW com a mesma carga. O sistema A é hidro-dominado clássico; o sistema B tem alta penetração de geração por inversor. Compare RoCoF, nadir e risco de ERAC — e explique a causa física. | No sistema B a frequência cai mais rápido (RoCoF maior) e mais fundo (nadir menor), com risco maior de cruzar o limiar do ERAC. Causa: inércia é energia cinética de massa girante sincronizada; inversores não contribuem massa, então o mesmo desbalanço ΔP encontra menos "amortecedor" — RoCoF ∝ ΔP/(2H). A inércia não corrige nada: ela compra tempo para a regulação primária agir. Menos inércia = menos tempo = controles precisam ser mais rápidos (grid-forming, resposta rápida de frequência) — a conversa de engenharia da década. | — | ex-06 · sim · integral | L2619 |
| Ex · 07 · 3 níveis · Aula 10 | Aula 10 | Explique "por que uma empresa no mercado livre continua pagando a distribuidora" em três versões: criança de 12 anos, CFO industrial, especialista de setor. | 12 anos: "Você pode escolher de quem compra a água, mas o cano que traz a água até sua casa é um só, é da empresa da sua rua, e o aluguel do cano todo mundo paga sempre." ¶ CFO: "A migração ao ACL troca o fornecedor da energia — a mercadoria. O fio é monopólio regulado da distribuidora local: continuamos pagando TUSD sobre demanda e energia, mais encargos. O ganho do ACL vem da parcela energia; a parcela fio só se otimiza por enquadramento contratual. Qualquer proposta que some os dois sem separar está inflando a economia." ¶ Especialista: "O acesso permanece regido pelo CUSD com a concessionária de distribuição, com faturamento de TUSD (demanda e energia) homologado pela ANEEL — incluindo Fio B, repasses de Fio A/TUST, perdas regulatórias e encargos —, independentemente do ambiente de contratação da energia (ACR/ACL). A desverticalização separou commodity de rede; a rede permanece monopólio natural remunerado por tarifa de uso, nos termos da REN 1.000/2021." | em três versões | ex-07 · sim · truncado (170/969 caracteres de texto) | L2628 |
| Ex · 08 · Síntese · Aula 10 | Aula 10 | No Summit, um executivo com parque eólico no NE desabafa: "Minha usina foi cortada na terça — e no mesmo dia o PLD do Sudeste estava alto. Como isso faz sentido?" Responda em até oito linhas, com mecanismo e linguagem segura GridAlpha. | "Faz sentido físico, ainda que doa no caixa: a energia barata do seu parque só chega ao Sudeste se couber no intercâmbio. Com a interface saturada — e com as restrições operativas endurecidas desde 2023 —, o ONS corta geração no NE por segurança ou excesso local, enquanto o SE atende a ponta com térmica cara: os submercados se separam, e o seu corte e o PLD alto deles são duas faces da mesma restrição. Dentro do desenho atual, esse custo não aparece no preço do submercado — vira encargo e receita perdida, e a compensação do constrained-off ainda é disputa regulatória em andamento na ANEEL/MME. O que dá para fazer hoje é medir a exposição: histórico de cortes por razão, horas de saturação da interface, spread NE–SE — é exatamente a camada que o Brazil Pulse monitora. Quantificado o risco, as decisões de contrato e de tese de investimento ficam suas — com número, não com narrativa." | até oito linhas | ex-08 · sim · integral | L2639 |
| Ex · 09 | **sem aula (P9)** | Uma bateria de 20 MW / 80 MWh é instalada para ajudar na rampa do fim da tarde. (a) Por quanto tempo ela entrega a potência máxima? (b) Por que é tecnicamente errado dizer que ela "gera" energia? | (a) Duração = energia ÷ potência = 80 MWh ÷ 20 MW = 4 horas na potência máxima (desconsiderando perdas e profundidade de descarga). Vocação perfeita para a rampa: descarrega das 17h às 21h. ¶ (b) Porque a bateria não converte nenhuma fonte primária em eletricidade — ela armazena energia gerada antes (de sobra solar do meio-dia, por exemplo) e a devolve depois. É deslocamento temporal, não geração. Na prática isso importa: a bateria só vale o spread entre o custo da energia que a carrega e o valor da energia que ela substitui — Erro 4 da tabela de mitos. | — | ex-09 · sim · integral | L2648 |
| Ex · 10 | **sem aula (P9)** | Numa tarde de muito vento no Nordeste, uma térmica cara é despachada no Sudeste. Dê duas razões distintas que tornam isso tecnicamente correto — uma de rede, uma de segurança elétrica. | Razão de rede (escoamento): o intercâmbio NE→SE está no limite — a energia barata existe, mas não cabe no fio. O SE precisa ser atendido por geração local, mesmo cara (constrained-on), enquanto o vento pode estar sendo cortado do outro lado (constrained-off). ¶ Razão de segurança elétrica: a térmica é necessária onde está — suporte de tensão na região, reserva local, estabilidade, critério N-1. O sistema não busca custo mínimo absoluto; busca custo mínimo sujeito a restrições de segurança e física da rede. O sobrecusto das duas razões não aparece no PLD: vira ESS (Aula 10). | — | ex-10 · sim · integral | L2658 |

## Referências — Onde verificar cada afirmação.

"Regra editorial Alexandria: regra ou número oficial pede fonte primária. Esta é a estante mínima do módulo — instituições primeiro, livros canônicos depois."

### Fontes primárias · instituições

| Id | Título(s) em negrito | Obra | Instituição | Domínio/caminho (como está) | Datas no texto | Texto literal | Origem |
|---|---|---|---|---|---|---|---|
| m02-ref-01 | ONS — O que é o ONS | — | ONS | ons.org.br/paginas/sobre-o-ons/o-que-e-ons |  | ONS — O que é o ONS · mandato, natureza jurídica e atribuições. ons.org.br/paginas/sobre-o-ons/o-que-e-ons | L3072 |
| m02-ref-02 | ONS — O que é o SIN | — | ONS | ons.org.br/paginas/sobre-o-sin/o-que-e-o-sin |  | ONS — O que é o SIN · definição oficial e os quatro subsistemas. ons.org.br/paginas/sobre-o-sin/o-que-e-o-sin | L3073 |
| m02-ref-03 | ONS — Procedimentos de Rede | — | ONS | ons.org.br/paginas/sobre-o-ons/procedimentos-de-rede |  | ONS — Procedimentos de Rede · o corpo normativo da operação (o que são + submódulos vigentes, incl. serviços ancilares). ons.org.br/paginas/sobre-o-ons/procedimentos-de-rede | L3074 |
| m02-ref-04 | ONS — Atuação em tempo real + Programação da Operação (PMO/PDO) | — | ONS | ons.org.br › Sobre o ONS / Operação |  | ONS — Atuação em tempo real e Programação da Operação (PMO/PDO) · a cascata de horizontes da Aula 06. ons.org.br › Sobre o ONS / Operação | L3075 |
| m02-ref-05 | ONS — Sistemas Isolados | — | ONS | ons.org.br/paginas/sobre-o-sin/sistemas-isolados | 2017 | ONS — Sistemas Isolados · atribuições assumidas a partir de 2017. ons.org.br/paginas/sobre-o-sin/sistemas-isolados | L3076 |
| m02-ref-06 | ONS — Relatório de Análise de Perturbação · 15/08/2023 | — | ONS | — | 15/08/2023 | ONS — Relatório de Análise de Perturbação · 15/08/2023 · a fonte única para os números finos do evento da Aula 08. | L3077 |
| m02-ref-07 | ONS — Dados Abertos | — | ONS | dados.ons.org.br |  | ONS — Dados Abertos · carga, geração por fonte, intercâmbios, reservatórios, restrições — a matéria-prima do Brazil Pulse. dados.ons.org.br | L3078 |
| m02-ref-08 | ANEEL — PRODIST | — | ANEEL | gov.br/aneel › procedimentos-regulatorios/prodist |  | ANEEL — PRODIST (incl. Módulo 7, perdas, e Módulo 8, qualidade) · regras da distribuição. gov.br/aneel › procedimentos-regulatorios/prodist | L3079 |
| m02-ref-09 | ANEEL — REN 1.000/2021 + ANEEL — Micro e Minigeração Distribuída | — | ANEEL | gov.br/aneel › geracao-distribuida | 1.000/2021 | ANEEL — REN 1.000/2021 · direitos e deveres na relação consumidor–distribuidora; ANEEL — Micro e Minigeração Distribuída · MMGD e compensação. gov.br/aneel › geracao-distribuida | L3080 |
| m02-ref-10 | CCEE — Regras de Comercialização | — | CCEE | ccee.org.br |  | CCEE — Regras de Comercialização · PLD horário por submercado e liquidação do ESS. ccee.org.br | L3081 |
| m02-ref-11 | EPE — Plano Decenal de Expansão de Energia | — | EPE | epe.gov.br |  | EPE — Plano Decenal de Expansão de Energia · onde a expansão de geração e transmissão é planejada. epe.gov.br | L3082 |
| m02-ref-12 | IPEA — Impactos fiscais da crise de energia elétrica de 2001–2002 | — | IPEA | repositorio.ipea.gov.br | 2001–2002, maio/2001 | IPEA — Impactos fiscais da crise de energia elétrica de 2001–2002 · registro da Câmara de Gestão da Crise (maio/2001), citado na Aula 08. repositorio.ipea.gov.br | L3083 |
| m02-ref-13 | Leis 9.648/1998 e 10.848/2004 | — |  | — | 9.648/1998, 10.848/2004 | Leis 9.648/1998 e 10.848/2004 · criação do ONS e a reforma que criou EPE e CCEE — o arcabouço institucional (Bloco 6). | L3084 |

### Canônicos · estante de engenharia e economia de sistemas

| Id | Título(s) em negrito | Obra | Instituição | Domínio/caminho (como está) | Datas no texto | Texto literal | Origem |
|---|---|---|---|---|---|---|---|
| m02-ref-14 | Kirschen & Strbac | Fundamentals of Power System Economics |  | — |  | Kirschen & Strbac — Fundamentals of Power System Economics · a ponte definitiva entre física da rede e economia: despacho, congestionamento, serviços ancilares. | L3089 |
| m02-ref-15 | Kirtley | Electric Power Principles |  | — |  | Kirtley — Electric Power Principles · a base de máquinas, transformadores e linhas por trás das Aulas 02 e 03. | L3090 |
| m02-ref-16 | Wood, Wollenberg & Sheblé | Power Generation, Operation and Control |  | — |  | Wood, Wollenberg & Sheblé — Power Generation, Operation and Control · o clássico de operação: despacho econômico, reservas, controle de frequência. | L3091 |

URL: null em todos (A fonte não traz URL clicável nem esquema http(s); só o caminho/domínio em span.mono, preservado como está.) Datas/anos mencionados no texto do item (evento, norma, período) — não são data de publicação nem de acesso, que a fonte não declara.

Colofão (rodapé): "Produção própria sobre fontes primárias (ONS, ANEEL, CCEE, EPE, IPEA) e canônicas. Instrumentos interativos são didáticos — não substituem modelos oficiais nem dados vigentes. Linguagem responsável em todo o material: ordens de grandeza com atribuição, números vivos sinalizados para verificação, nenhuma economia prometida — apenas oportunidades potenciais a validar.". Código: src/pages/alexandria/BibliotecaView.tsx tem uma estante genérica (ONS, ANEEL, EPE…) com texto próprio; as 16 entradas do § Ref do M02 não estão em src/.

## Glossário — Glossário Alexandria.

"Sessenta e cinco termos — o vocabulário de rede que aparece em conversa real com operador, transmissora, gerador ou diretor industrial. Clique para expandir." Contagem: markup 65 · prosa "Sessenta e cinco" ·
catálogo 65 · código (gl-m02-*) 65.
**Faltam no código: nenhum.**
Sobram no código: nenhum. Divergentes (termo, etiqueta ou
definição): nenhum. aulaIds vazios no código:
41 (derivados pelo código, não declarados pela fonte).

| # | Termo | Etiqueta | Definição literal | Código | Origem |
|---|---|---|---|---|---|
| 1 | Alimentador | Distribuição | Circuito de média tensão que sai de uma subestação de distribuição e abastece uma região — bairros, distritos industriais, zonas rurais. A falha de um alimentador desliga todos os consumidores a jusante; por isso religadores e seletividade são desenhados nesse nível. | gl-m02-alimentador | L2797 |
| 2 | Barramento | Subestação | Condutor comum que interliga os circuitos dentro de uma subestação. A configuração do barramento (simples, duplo, em anel) define a flexibilidade de manobra e a confiabilidade da instalação inteira — é decisão de projeto, não detalhe. | gl-m02-barramento | L2801 |
| 3 | Bipolo | HVDC | Configuração padrão dos grandes elos de corrente contínua: dois polos (positivo e negativo) operando em conjunto, com capacidade de seguir transmitindo parcialmente se um polo falhar. Os elos de Itaipu (±600 kV), Madeira (±600 kV) e Belo Monte (±800 kV) são bipolos. | gl-m02-bipolo | L2805 |
| 4 | Black start | Ancilar | Capacidade de uma usina partir sem alimentação externa e energizar trechos da rede do zero após um colapso amplo. Define a velocidade da recomposição: unidades black start acendem ilhas, que sincronizam entre si até o sistema inteiro voltar. | gl-m02-black-start | L2809 |
| 5 | CAG | Controle | Controle Automático de Geração — a regulação secundária de frequência. Comandado pelos centros de operação do ONS, redistribui geração em escala de minutos para devolver a frequência a 60,00 Hz e os intercâmbios entre áreas aos valores programados, recompondo a reserva consumida pela regulação primária. | gl-m02-cag | L2813 |
| 6 | CCEE | Instituição | Câmara de Comercialização de Energia Elétrica. Contabiliza e liquida as operações de compra e venda do setor e publica o PLD. No vocabulário deste módulo: o ONS decide o despacho físico; a CCEE fecha as contas financeiras que resultam dele — inclusive o rateio do ESS. | gl-m02-ccee | L2817 |
| 7 | CMO | Preço | Custo Marginal de Operação — o custo de atender 1 MWh adicional de carga, apurado por submercado pela cadeia de modelos NEWAVE/DECOMP/DESSEM, com CVU auditado para térmicas e valor da água para hidrelétricas. É a base de cálculo do PLD, que o limita por piso e teto regulatórios. | gl-m02-cmo | L2821 |
| 8 | Congestionamento | Rede | Condição em que o fluxo desejado excede o limite de um elemento da rede, obrigando redespacho fora da ordem de mérito (constrained-on/off). Entre submercados, separa os PLDs e aparece como spread; dentro de um submercado, o modelo de preço não o enxerga — o sobrecusto vira ESS rateado entre consumidores. | gl-m02-congestionamento | L2825 |
| 9 | Constrained-on / constrained-off | Operação | Os dois lados do redespacho: constrained-on é a usina cara acionada fora da ordem de mérito por necessidade da rede; constrained-off é a usina barata impedida de gerar pela restrição. A compensação do constrained-off de eólicas e solares no NE é a disputa regulatória mais quente do tema no Brasil. | gl-m02-constrained-on-constrained-off | L2829 |
| 10 | Curtailment | Operação | Corte de geração disponível — tipicamente renovável — determinado pelo operador. No Brasil, classificado por razão elétrica (segurança/limites de rede) ou razão energética (excesso de oferta). Cresceu fortemente no Nordeste após as restrições operativas de 2023 e a expansão renovável acima do ritmo do escoamento. | gl-m02-curtailment | L2833 |
| 11 | Curva de carga | Operação | Representação da demanda ao longo do tempo — o retrato de como o consumo respira no dia, na semana, no ano. Residencial tem picos de manhã e noite; industrial pode ser 24/7, em turnos ou sazonal. O SIN soma todos os perfis. | gl-m02-curva-de-carga | L2837 |
| 12 | Curva líquida | Operação | Carga total menos a geração variável (solar e eólica) — o que sobra para a geração despachável atender. Afunda no meio do dia com o sol a pino e dispara no pôr do sol, criando a rampa do fim da tarde, a janela mais tensa da operação moderna. | gl-m02-curva-liquida | L2841 |
| 13 | CUST / CUSD | Contratos | Contratos de Uso do Sistema de Transmissão (com o ONS, para conectados à Rede Básica) e de Distribuição (com a distribuidora local). Definem a fronteira institucional de quem paga TUST e quem paga TUSD. O CUSD é fonte primária em qualquer diagnóstico de cliente industrial. | gl-m02-cust-cusd | L2845 |
| 14 | CVU | R$/MWh | Custo Variável Unitário de uma usina termelétrica — combustível e custos variáveis por MWh, declarado e auditado. É o que posiciona cada térmica na ordem de mérito do despacho brasileiro — no modelo de custo auditado, a usina não oferta preço: declara custo e é fiscalizada. | gl-m02-cvu | L2849 |
| 15 | DECOMP | Modelo | Modelo de médio prazo da cadeia de planejamento da operação: detalha a decisão do NEWAVE em horizonte de meses e semanas, conectando a política de uso dos reservatórios à programação que o DESSEM refinará em base horária. | gl-m02-decomp | L2853 |
| 16 | Despacho centralizado | Operação | Regime em que o operador do sistema — não o dono da usina — decide quem gera, quanto e quando, com base em custos auditados e otimização. É o modelo brasileiro, em contraste com mercados de ofertas onde o despacho emerge de lances dos agentes. | gl-m02-despacho-centralizado | L2857 |
| 17 | DESSEM | Modelo | Modelo de programação diária da operação, com resolução horária (e rede elétrica representada). Desde 2021 é dele que saem o CMO horário e, por consequência, o PLD horário publicado pela CCEE. | gl-m02-dessem | L2861 |
| 18 | Disjuntor | Equipamento | Equipamento de manobra capaz de interromper correntes de curto-circuito. Comandado pelos relés de proteção, abre o circuito em poucos ciclos (dezenas de milissegundos), isolando a falta. A dupla relé + disjuntor é o sistema imunológico da rede. | gl-m02-disjuntor | L2865 |
| 19 | DIT | Rede | Demais Instalações de Transmissão — ativos de transmissoras em tensão inferior a 230 kV (tipicamente 69–138 kV), fora da Rede Básica. Zona intermediária que conecta a malha principal às distribuidoras e a grandes consumidores. | gl-m02-dit | L2869 |
| 20 | ERAC | Proteção sistêmica | Esquema Regional de Alívio de Carga: corte automático e escalonado de blocos de consumo quando a frequência afunda além dos limiares (primeiro estágio tipicamente na casa de 58,5 Hz, conforme a região). Última linha de defesa — sacrifica parte da carga para evitar o colapso do sistema inteiro. | gl-m02-erac | L2873 |
| 21 | ESS | Encargo | Encargos de Serviços do Sistema — a conta dos custos de operação que não cabem no preço de energia: despacho fora da ordem de mérito por restrição elétrica ou segurança energética, serviços ancilares e afins. Rateado entre consumidores na liquidação da CCEE. É onde o congestionamento interno do submercado se esconde. | gl-m02-ess | L2877 |
| 22 | Fio B | Tarifa | Componente da TUSD que remunera os ativos e a operação da rede da própria distribuidora — em oposição ao Fio A, que repassa custos de transmissão a montante. Em discussões de reforma tarifária e de MMGD, "quem paga o Fio B" é a pergunta central. | gl-m02-fio-b | L2881 |
| 23 | Grid-forming / grid-following | Tecnologia | Duas filosofias de controle de inversores. Grid-following segue uma referência de tensão e frequência que já existe na rede; grid-forming ajuda a criar essa referência — comportamento essencial em sistemas com alta penetração renovável e pouca máquina síncrona. | gl-m02-grid-forming-grid-following | L2885 |
| 24 | HVDC | Tecnologia | High-Voltage Direct Current — transmissão em corrente contínua de alta tensão. Vence o AC em três situações: distâncias muito longas, interligação de sistemas assíncronos (Itaipu 50 Hz) e travessias submarinas. O Brasil opera alguns dos elos mais longos do mundo. | gl-m02-hvdc | L2889 |
| 25 | Ilhamento | Estabilidade | Separação elétrica de uma parte da rede, que passa a operar como ilha e precisa equilibrar sozinha sua geração e carga. Desequilíbrio grande derruba a ilha; ilhamento intencional e controlado, por outro lado, é a base de microrredes e de etapas da recomposição. | gl-m02-ilhamento | L2893 |
| 26 | Inércia | Física do sistema | Energia cinética armazenada nas massas girantes sincronizadas (turbinas, rotores), sacada automaticamente quando há desbalanço — freia a variação de frequência e compra tempo para os controles. Geração conectada por inversor não contribui inércia naturalmente, tornando o sistema mais sensível a perdas de geração. | gl-m02-inercia | L2897 |
| 27 | Inflexibilidade | Operação | Parcela mínima de geração que uma usina (tipicamente térmica) declara não poder reduzir por razões técnicas ou contratuais. Geração inflexível entra no balanço mesmo fora do mérito — e em cenários de excesso, compete com renovável e contribui para curtailment. | gl-m02-inflexibilidade | L2901 |
| 28 | Intercâmbio | Operação | Fluxo de energia entre subsistemas/submercados pelos grandes troncos de interligação. Quando o intercâmbio satura, os submercados se separam em preço — o spread de PLD é o sintoma visível. Monitorar intercâmbios é monitorar a costura do SIN. | gl-m02-intercambio | L2905 |
| 29 | Microrrede | Rede moderna | Sistema local — geração distribuída, bateria, geração de apoio e controle inteligente — capaz de operar conectado à rede principal ou ilhado dela. Aplicações típicas: hospitais, mineração, data centers, comunidades isoladas. Exige engenharia de controle e proteção, não só equipamentos. | gl-m02-microrrede | L2909 |
| 30 | MMGD | Geração | Micro e Minigeração Distribuída — majoritariamente solar em telhado, conectada na rede de distribuição e compensada via créditos. Dezenas de GW instalados que o operador enxerga como redução de carga, deprimindo a demanda líquida do meio-dia e criando a rampa do pôr do sol. | gl-m02-mmgd | L2913 |
| 31 | N-1 | Critério | Critério de segurança: o sistema deve suportar a perda de qualquer elemento único (linha, transformador, gerador) sem corte de carga nem violação de limites. Protege contra falhas simples — não contra modos de falha comuns que levam vários elementos de uma vez, como em Itaberá/2009. | gl-m02-n-1 | L2917 |
| 32 | NEWAVE | Modelo | Modelo de longo prazo (horizonte de anos) da cadeia de planejamento: decide a política ótima de uso dos reservatórios sob incerteza hidrológica, gerando a função de custo futuro da água que ancora todo o despacho hidrotérmico brasileiro. | gl-m02-newave | L2921 |
| 33 | ONS | Instituição | Operador Nacional do Sistema Elétrico (Lei 9.648/1998). Associação civil sem fins lucrativos, fiscalizada pela ANEEL, que opera o SIN: despacho centralizado, intercâmbios, segurança, administração da transmissão (CUST) e planejamento da operação, sob os Procedimentos de Rede. Não vende energia, não tarifa, não regula, não constrói. | gl-m02-ons | L2925 |
| 34 | Ordem de mérito | Operação | Princípio universal do despacho econômico: empilhar a oferta do menor para o maior custo variável e despachar até cobrir a demanda. A usina marginal — a última necessária para fechar o balanço — define o custo marginal do sistema: no Brasil, o CMO, base do PLD. | gl-m02-ordem-de-merito | L2929 |
| 35 | Parcela Variável | Transmissão | Desconto aplicado à RAP da transmissora quando a instalação fica indisponível ou opera com restrição. É o instrumento que transforma "receita por disponibilidade" em incentivo real: linha parada é receita perdida. | gl-m02-parcela-variavel | L2933 |
| 36 | Perdas não técnicas | Rede | Energia injetada e não faturada por furto ("gatos"), fraude de medição ou falhas de cadastro/faturamento. Concentradas na baixa tensão, com enorme variância regional. O nível regulatório reconhecido pela ANEEL é repassado à tarifa; o excedente sai da margem da distribuidora. | gl-m02-perdas-nao-tecnicas | L2937 |
| 37 | Perdas técnicas | Rede | Dissipação física inevitável do transporte: efeito Joule (I²R) em condutores e perdas de núcleo em transformadores. Crescem nos níveis baixos de tensão, onde a corrente é alta. Ordem de ~2% na Rede Básica e várias vezes isso na distribuição. | gl-m02-perdas-tecnicas | L2941 |
| 38 | PLD | R$/MWh · preview | Preço de Liquidação das Diferenças — o preço spot brasileiro, publicado pela CCEE por submercado e por hora: na essência, o CMO da cadeia de modelos submetido a piso e teto homologados anualmente pela ANEEL. Dissecação completa no Bloco 9. | gl-m02-pld | L2945 |
| 39 | PMO / PDO | Operação | Programa Mensal e Programa Diário da Operação — os dois elos da cascata de planejamento do ONS. O PMO fixa diretrizes de geração térmica e intercâmbios com discretização semanal; o PDO transforma a diretriz em programação horária do dia seguinte, que o tempo real executa e corrige. | gl-m02-pmo-pdo | L2949 |
| 40 | Ponto de conexão | Fronteira | Fronteira física e contratual entre a rede da concessionária e a instalação do consumidor. Define tensão de fornecimento (logo, grupo tarifário), local da medição de faturamento, referência dos indicadores de qualidade (PRODIST M8) e a divisa de titularidade de ativos e perdas. | gl-m02-ponto-de-conexao | L2953 |
| 41 | Procedimentos de Rede | Norma | Corpo normativo público elaborado pelo ONS e homologado pela ANEEL que disciplina a operação do SIN: conexão, planejamento da operação, operação em tempo real, proteção, recomposição e serviços ancilares. Fonte primária obrigatória para qualquer afirmação operativa em conversa técnica. | gl-m02-procedimentos-de-rede | L2957 |
| 42 | Rampa | Operação | Velocidade de variação da carga líquida que a geração despachável precisa acompanhar, medida em GW por hora. A rampa do fim da tarde — solar caindo enquanto o consumo residencial sobe — é a mais severa do dia e valoriza hidro flexível, baterias e resposta da demanda. | gl-m02-rampa | L2961 |
| 43 | RAP | Transmissão | Receita Anual Permitida — a remuneração da concessionária de transmissão, definida no leilão (vence a menor RAP) e paga por disponibilidade ao longo da concessão (tipicamente 30 anos). Independe do MWh transportado; sofre desconto de Parcela Variável por indisponibilidade. | gl-m02-rap | L2965 |
| 44 | Recomposição | Operação | Processo coordenado de religar o sistema após uma perturbação ampla: unidades black start energizam trechos, usinas sincronizam, cargas retornam em blocos, ilhas se reconectam. Segue procedimentos pré-estudados — religar tudo de uma vez derrubaria o sistema de novo. | gl-m02-recomposicao | L2969 |
| 45 | Rede Básica | Rede | Conjunto das instalações de transmissão em tensão igual ou superior a 230 kV. Operada centralizadamente pelo ONS, acessada via CUST e remunerada via TUST. Abaixo dela: DIT e redes de distribuição. A fronteira dos 230 kV é fronteira de regime jurídico, operador e cobrança. | gl-m02-rede-basica | L2973 |
| 46 | Regulação primária | Controle | Resposta automática e local dos reguladores de velocidade das usinas ao desvio de frequência, em escala de segundos. Estanca a queda (ou subida) em um valor estável — porém fora de 60,00 Hz; quem devolve ao valor nominal é a regulação secundária (CAG). | gl-m02-regulacao-primaria | L2977 |
| 47 | Relé de proteção | Equipamento | Dispositivo que monitora continuamente grandezas elétricas e, ao detectar uma falta, comanda a abertura de disjuntores em milissegundos. A coordenação entre relés implementa a seletividade. Atuação incorreta de proteção é gatilho recorrente de grandes perturbações — inclusive no 15/08/2023. | gl-m02-rele-de-protecao | L2981 |
| 48 | Religador | Proteção | Equipamento de distribuição que desliga ao detectar falta e tenta religar automaticamente após instantes. Resolve a maioria das faltas, que são temporárias — galho, animal, descarga atmosférica — sem deslocar equipe, e precisa de coordenação para não religar sobre falta permanente. | gl-m02-religador | L2985 |
| 49 | Reserva girante | Reserva | Capacidade já sincronizada ao sistema — usinas girando abaixo do máximo — pronta para elevar geração em segundos. É a primeira reserva a responder depois da inércia e da regulação primária. Exemplo: usina a 80 MW podendo gerar 100 carrega 20 MW de reserva girante. | gl-m02-reserva-girante | L2989 |
| 50 | Reserva operativa | Reserva | Margem de capacidade mantida disponível para cobrir variações de carga, erros de previsão e contingências, mobilizável em minutos. Junto da girante (segundos) e da fria (horas), forma o colchão que permite ao sistema absorver sustos — e que custa dinheiro mesmo parado. | gl-m02-reserva-operativa | L2993 |
| 51 | Resiliência | Confiabilidade | Capacidade de resistir, adaptar-se e recuperar-se depois que a falha acontece — complementar à confiabilidade, que busca evitá-la. Um sistema resiliente isola rápido, mantém cargas críticas, recompõe em etapas e aprende com o evento. | gl-m02-resiliencia | L2997 |
| 52 | Resposta da demanda | Rede moderna | Ajuste voluntário de consumo para ajudar o sistema ou reduzir custo: deslocar produção para fora do pico, reduzir carga na rampa, mudar horários de bombeamento. Transforma a demanda de passiva em recurso operacional — e, em desenhos maduros, em receita. | gl-m02-resposta-da-demanda | L3001 |
| 53 | RoCoF | Hz/s | Rate of Change of Frequency — a taxa inicial de variação da frequência após um desbalanço, inversamente proporcional à inércia do sistema (RoCoF ∝ ΔP/2H). Métrica central da discussão sobre penetração de inversores: menos inércia, RoCoF maior, menos tempo para os controles agirem. | gl-m02-rocof | L3005 |
| 54 | SCADA | Sistema | Supervisory Control and Data Acquisition — a camada de telemetria e telecomando que leva o estado de cada subestação aos centros de operação em tempo real e permite manobras remotas. É o sistema nervoso que torna possível operar um continente de uma sala. | gl-m02-scada | L3009 |
| 55 | Seccionadora | Subestação | Chave que isola trechos para manutenção criando separação visível e segura. Não interrompe corrente de falha — essa função é do disjuntor. Confundir os dois equipamentos é o erro clássico que denuncia quem nunca pisou numa subestação. | gl-m02-seccionadora | L3013 |
| 56 | Seletividade | Proteção | Princípio de coordenação da proteção: isolar a menor região possível, no menor tempo possível, deixando o resto do sistema intacto. Quando a seletividade falha, eventos locais escalam — o ingrediente clássico do apagão em cascata. | gl-m02-seletividade | L3017 |
| 57 | Serviços ancilares | Ancilar | Funções que não são venda de energia, mas sem as quais a rede não opera com segurança: controle de frequência (regulação primária e secundária), suporte de tensão e reativos, reservas de potência e black start. Coordenados pelo ONS e remunerados conforme regras setoriais. | gl-m02-servicos-ancilares | L3021 |
| 58 | SIN | Sistema | Sistema Interligado Nacional — a malha eletroenergética que conecta geração e carga em escala continental, atendendo a quase totalidade do consumo do país, dividida em quatro subsistemas (SE/CO, S, NE, N) que coincidem com os submercados de preço. | gl-m02-sin | L3025 |
| 59 | Sinal locacional | Conceito | Incentivo econômico que diferencia agentes pela posição na malha. No desenho brasileiro ele mora no fio — a TUST nodal, anual e estável — e não no preço da energia, que é zonal por submercado. Gerador longe da carga tende a pagar mais pelo uso da transmissão. | gl-m02-sinal-locacional | L3029 |
| 60 | SMF | Medição | Sistema de Medição para Faturamento — o conjunto de medidores e requisitos técnicos, no ponto de conexão, que lastreia a contabilização na CCEE para agentes do mercado. Sem SMF adequado, não há migração ao ACL. | gl-m02-smf | L3033 |
| 61 | Subestação | Rede | Instalação onde a rede transforma (tensão), manobra (disjuntores e seccionadoras), protege (relés) e mede/telecomanda (SCADA). As articulações do sistema — entre a usina e a tomada existem, tipicamente, de quatro a sete delas. | gl-m02-subestacao | L3037 |
| 62 | Submercado | Mercado | Zona de apuração do PLD — quatro no Brasil, coincidentes com os subsistemas do SIN. Dentro do submercado, preço único (restrições internas viram ESS); entre submercados, os preços se separam quando os intercâmbios saturam. | gl-m02-submercado | L3041 |
| 63 | TUSD | Tarifa | Tarifa de Uso do Sistema de Distribuição — o pedágio pago à distribuidora local por todo conectado à sua rede, inclusive consumidores livres. Para o Grupo A, cobrada em demanda (R$/kW) e energia (R$/MWh); carrega Fio B, repasses (Fio A/TUST), encargos e perdas reconhecidas. | gl-m02-tusd | L3045 |
| 64 | TUST | Tarifa | Tarifa de Uso do Sistema de Transmissão — paga por geradores e grandes consumidores conectados à Rede Básica (via CUST). Calculada por metodologia nodal: o valor depende da localização do agente na malha — o sinal locacional brasileiro. | gl-m02-tust | L3049 |
| 65 | Valor da água | R$/MWh | Custo de oportunidade de turbinar água hoje em vez de guardá-la para o futuro — calculado pela cadeia NEWAVE/DECOMP/DESSEM, não declarado por agente. É o que posiciona a hidroeletricidade na ordem de mérito e, na maior parte das horas, o que efetivamente precifica o Brasil. | gl-m02-valor-da-agua | L3053 |

## Divergências (9)

| Id | Tipo | Sev. | Tema | Leitura A | Leitura B | Nota |
|---|---|---|---|---|---|---|
| div-a02-01 | fonte×fonte (P17) | média | Caso rotulado "Parte 2" e remetendo a uma "Parte 1" | Operação A · Caso de referência · Parte 2 (L2475) | As 12 faturas completas (já solicitadas na Parte 1), agora para decomposição energia × fio × encargos; (L2528) | P17: no produto não existem "Partes" da fonte; o caso fica intacto como contexto e o Desafio de decisão é da camada Alexandria. |
| div-a02-02 | fonte×produto (P24) | baixa | Callout do caso com a marca no rótulo | Linguagem GridAlpha para esse caso (L2521) | P24: "GridAlpha" morta como marca voltada ao learner. (—) | Texto mantido literal na camada fonte. |
| div-a02-03 | fonte×fonte | alta | Faixas do placar × limiar 8/10 da introdução do quiz | Quiz de fluência. Cada resposta tem feedback explicativo. O critério de domínio do módulo é acertar pelo menos 8 de 10 sem consultar. (L2676) | correct >= 9 → "Domínio sólido. Pronto para o Módulo 03 — Tecnologias de Geração." \| correct >= 7 → "Bom. Revise os pontos errados, depois avance para o próximo módulo." \| correct >= 5 → "Domínio parcial. Volte às aulas onde errou antes de avançar." \| else → "Refaça o estudo. O critério de domínio é 8/10 — sem atalho." (L3829; L3830; L3831; L3832) | Com 7 acertos a mensagem já manda avançar; com 8 (o limiar declarado) diz "Revise"; a faixa else repete "8/10". Mesmo registro de modulo.divergencias div-m02-02. P18. |
| div-a02-04 | fonte×código | média | Ex · 07: gabarito truncado no código | 3 parágrafos (12 anos / CFO / Especialista) (L2628) | config.gabarito cobre truncado (170/969 caracteres de texto) (src/lib/data/alexandria-modulo-02-content.ts) | Perda de texto de resposta de referência no código; a fonte é a íntegra. |
| div-a02-05 | código sem origem | baixa | points: 1 em todos os exercícios | A fonte não pontua exercício (nem rubrica, nem peso). (L2570) | points: 1 (10 atividades) (src/lib/data/alexandria-modulo-02-content.ts) | Valor inventado pelo código (mesmo caso do Ex06 no M01). |
| div-a02-06 | fonte×fonte | baixa | Duas variantes de markup de exercício | Ex · 01–08: div.exercise-header > span.exercise-tag + button.exercise-toggle (L2574) | Ex · 09–10: div.exercise-label + button.reveal-btn, sem "Aula NN" na tag (L2648) | Sinal de acréscimo posterior à prosa "Oito exercícios" (ver modulo div-m02-03). Hipótese, não fato da fonte. |
| div-a02-07 | fonte (vínculo em prosa) | baixa | Exercícios sem aula com remissões em prosa | Ex · 09: enunciado usa "bateria de 20 MW / 80 MWh" (= cenário-padrão do INST · 06, Aula 07) e o gabarito cita "Erro 4 da tabela de mitos" (L2648) | Ex · 10: gabarito termina em "vira ESS (Aula 10)" (L2658) | P9: referência em prosa não é tag de posse; ambos ficam em recursos do módulo. O código faz o mesmo (MODULO_02_EXERCICIOS_SOLTOS). |
| div-a02-08 | fonte×código | baixa | Checklist final × badges | 18 itens com toggle visual (L2759) | 3 itens viraram badge (item 1, item 11, item 15), com name/category/expReward sem origem na fonte (alexandria-badges.ts L109) | Os critérios dos badges são literais (conferido). O resto do checklist não existe em src/. P18: marcar o checklist não é evidência de competência. |
| div-a02-09 | fonte (estrutura) | baixa | Item de referência com mais de um documento | m02-ref-04: ONS — Atuação em tempo real + Programação da Operação (PMO/PDO) \| m02-ref-09: ANEEL — REN 1.000/2021 + ANEEL — Micro e Minigeração Distribuída (L3075; L3080) | Um <li> por documento no resto da estante (—) | Registrado para quem modelar referência como 1 item = 1 documento. |

## Lacunas (6)

| Id | Campo | Valor | Nota |
|---|---|---|---|
| lac-a02-01 | caso.perguntas / caso.decisao_pedida | null | A fonte não faz perguntas ao learner no § Caso (zero "?" dirigido ao learner; as leituras chegam resolvidas). P17: o Desafio de decisão é da camada Alexandria, só com fatos do caso. |
| lac-a02-02 | quiz: vínculo por aula | null | Nenhuma questão declara aula. |
| lac-a02-03 | exercicios[].criterio | null | Sem rubrica, sem pontuação; "Revelar gabarito" revela direto (sem tentativa registrada). |
| lac-a02-04 | referencias[].url / data de publicação / data de acesso / tipo | null | Só caminho/domínio em span.mono (11 de 16); datas no texto são de evento/norma. |
| lac-a02-05 | glossario[].aula | null | A fonte não declara aula por verbete; aulaIds do código são derivados. |
| lac-a02-06 | código | null | Caso, quiz, referências e checklist (como estrutura) não existem em src/lib/data. |


## Verificação

Verificador independente (scripts próprios, fora desta pasta), contra o HTML-fonte:

- **Literalidade.** ~2.000 strings varridas no corpus normalizado; 1.766 conferidas também na janela da própria origem
  (linha_aprox −6/+80). As únicas "falhas" são campos de metadado (ids, classes, seções, faixas derivadas), não conteúdo.
- **Quiz (100%).** O literal `const questions` foi avaliado à parte: 10/10 enunciados, 40/40 alternativas (ordem e
  `correta`), 10/10 explicações e o gabarito BBBCBBBBCB são idênticos; as origens estão a ±3.
- **Checklist (100%).** 18/18 itens idênticos em html e texto, com origens a ±3. Três viram badge (itens 1, 11 e 15),
  conferido em `alexandria-badges.ts`.
- **Instrumentos (100% das fórmulas).** 172 linhas de script (leitura de entradas, cálculo, formatação, condições e
  atribuições dos ramos) conferidas verbatim a ±3 linhas; os 9 `codigo_completo` batem com as linhas declaradas
  (a menos de espaços). O ramo `minNet < 35` do INST · 04 foi re-simulado: nas 3.588 combinações ele só ocorre com
  `rampa > 10` (44 casos), portanto é de fato inalcançável.
- **Origens.** Todo `trecho_inicial` com `linha_aprox` fica a ±3 linhas.
- **Contagens recontadas no HTML.** Todas conferem:
  - 20 seções e 10 aulas, com subseções 5,5,5,4,4,4,3,6,4,6.
  - 9 instrumentos: 24 entradas (22 `.field` + 2 grupos de pílulas), 37 saídas e 689.556 combinações, recalculadas
    a partir das faixas.
  - 65 termos, 10 `div.exercise` (8 com aula) e 18 itens de checklist.
  - 16 referências (13 + 3), 11 delas com `span.mono`.
  - 8 erros, 30 perguntas-relâmpago e 7 parágrafos no roteiro.
  - 18 painéis "três níveis", em 6 blocos.
  - 21 callouts: 4 de "Números vivos" e 7 de produto/marca.
  - 16 ocorrências de "GridAlpha"; 0 LAB; 0 `<img>`, `<video>` ou `<iframe>`.
- **Esclarecimento (sem mudar número).** `ramos_de_leitura_alcancados` (25) conta *chaves de texto mascaradas*
  distintas, e não ramos `if/else` do script. O script tem 27 ramos literais, e 26 são alcançados:
  - o INST · 02 dá 4 chaves para 3 ramos, porque o "> 100" muda o texto;
  - o INST · 06 dá 3 chaves para 6 ramos, porque vocação e veredito andam juntos;
  - o INST · 08 conta "(sem veredito)" como 1.

**Correções feitas por esta verificação:** nenhuma neste grupo. As duas correções estão em `modulo.json`.

### Segunda verificação adversarial (2026-09-17)

Outro verificador, com método próprio (scripts fora desta pasta, sem reaproveitar `m02_verificar.mjs`):

- **Literalidade.** Todo valor string dos três JSONs, fora os ramos de metadado, foi procurado no HTML-fonte
  (tags removidas, e também com o markup cru). Resultado: 0 falhas de conteúdo. As únicas "falhas" são ids,
  faixas derivadas do placar, `tom` dos callouts, dados do catálogo e textos *renderizados* pelos scripts. Estes
  últimos foram conferidos de outro jeito, rodando o `<script>` original num DOM mínimo próprio.
- **Quiz (100%).** O array `questions` foi avaliado direto da fonte e comparado campo a campo (10 enunciados,
  40 alternativas, `correta`, 10 explicações, gabarito BBBCBBBBCB, origens a ±3). Tudo idêntico.
- **Checklist (100%).** Os 18 `.checklist-text` foram comparados em html e texto, e as origens estão a ±3. As
  marcações P14 (16 oral/livre, 2 desenho, 2 limite de extensão, 1 cálculo) e os 3 badges (itens 1, 11 e 15
  em `alexandria-badges.ts`) conferem.
- **Fórmulas dos instrumentos (100%).** 185 trechos de script (leitura, cálculo, formatação, condições e
  atribuições de ramo) foram conferidos verbatim a ±3 linhas. Os 9 `codigo_completo` são idênticos às linhas
  declaradas, a menos da quebra final. O cenário-padrão dos 9 foi refeito rodando o script original: os
  valores batem, e o INST · 02 também foi conferido à mão (1.215 A; 39,0 MW; 3,9 %; R$ 47,0 mi).
- **Contagens.** Todas foram recontadas no HTML e batem:
  - seções, aulas e subseções por aula (também em `MODULO_02_CORPO`);
  - instrumentos, entradas, saídas e combinações (recalculadas a partir das faixas do markup);
  - termos (65 `details`, em ordem alfabética), exercícios (10, dos quais 8 com tag de aula) e checklist;
  - referências (16; 11 com `span.mono`; 0 URL, já que os 5 `http` do arquivo são fontes/SVG);
  - callouts (21 = 8 neutros + 9 gold + 4 red), painéis "três níveis" (18, e 0 no código), "GridAlpha" (16, nas
    linhas listadas), "Summit", "Bloco N" e `<img>`.
- **Divergências.** As 32 foram reconferidas, e nenhuma foi inventada.

**Correções feitas pela segunda verificação:** nenhuma neste grupo.
