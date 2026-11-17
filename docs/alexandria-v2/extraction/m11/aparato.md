# M11 · grupo "aparato"

Fonte (só leitura): `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo11.html`. Saída:
[`aparato.json`](aparato.json).

**Como foi extraído.** `extratores/m11_aparato.mjs` lê a marcação das seções por árvore. O quiz sai do literal `var Q=[…]`
do `<script>` original, avaliado com `new Function`, e as mensagens de placar saem das linhas do próprio script. Nada foi
digitado.

**Verificação.** `m11_verify.mjs` conferiu 1.093 strings de conteúdo e 266 origens, com 0 falhas. Os 40 textos do quiz
(10 enunciados e 30 alternativas/explicações em literal) batem 1:1 com os literais do script. Cobertura por token de
100% em § Caso, § Ex, § Quiz (markup), § Final, § Lex e § Ref. As recontagens independentes conferem: 14 exercícios,
28 itens, 32 referências, 10 questões, 150 termos e 7 famílias.

## Contagens

| Item | Fonte | Código |
|---|---|---|
| Caso | 1 seção, 3 subseções (11.1–11.3), 8 fragmentos de perfil, **1** pergunta literal, 0 decisão pedida | ausente |
| Quiz | **10** questões × 4 alternativas; gabarito **C A D B D A C B D A** (A 3, B 2, C 2, D 3); 2 faixas de placar | ausente |
| Checklist (§ Final) | **28** itens (2 cronometrados, 1 oral) | ausente |
| Exercícios (§ Ex) | **14**, todos soltos (P9); 5 de verificação de premissa, 4 de dado faltante, 2 de diagnóstico negativo, 3 de leitura contratual | 14 em `MODULO_11_EXERCICIOS_SOLTOS`, **não renderizados** |
| Referências (§ Ref) | **32** (0 URL, 0 domínio, 5 pendentes, 7 internas) | ausente |
| Glossário (§ Lex) | **150** termos em 7 famílias (20 abertos por padrão) | **0** `gl-m11-`: faltam os 150; 9 homônimos em outros módulos |

## Caso — "Operação A — Parte 11" (P17)

- **Rótulo.** `sec-id` "§Caso · Operação A — Parte 11" (L2296); h2 "Uma proposta solar chega à mineração em Minas
  Gerais". A fonte numera o caso como parte 11 de uma série transversal ("As dez partes anteriores construíram o
  perfil"). O literal é mantido aqui; a apresentação é da camada Alexandria (`div-m11-ap-04`).
- **Dados do perfil (8 fragmentos literais do lede).**
  1. Operação A — mineração em Minas Gerais;
  2. carga razoavelmente plana;
  3. operação em turnos;
  4. submercado Sudeste/Centro-Oeste;
  5. fator de carga elevado;
  6. pouca flexibilidade natural;
  7. enquadramento tarifário provavelmente adequado conforme o diagnóstico da Parte 10;
  8. e o bombeamento identificado como uma das poucas cargas com flexibilidade real.

  A fonte não tem tabela nem grade de dados.
- **Premissa e pergunta.** "Suponha que chega uma proposta de geração solar dimensionada para reduzir o consumo diurno
  de bombeamento. **O que já é possível dizer, e o que ainda não é?**" É a única pergunta literal, e o próprio texto a
  responde em 11.1–11.3.
- **11.1 O que já é verificável.** Quatro afirmações em negrito:
  - "A coincidência entre geração e carga é favorável, e isso é um dado, não uma esperança."
  - "A modalidade provável é autoconsumo local…"
  - "O regime é de transição, e o degrau é conhecido."
  - "A demanda contratada não muda sozinha."
- **11.2 O que falta (5 dados).** Irradiância específica do terreno; disponibilidade e natureza da área; orientação e
  inclinação; arranjo societário; regime tarifário do ponto de conexão da geração.
- **11.3 O parecer da Parte 11.** Dois parágrafos: o que se pode dizer hoje e o que não se pode dizer (economia,
  retorno…).
- **Decisão pedida: `null`.** O parecer vem pronto. A P17 autoriza um Desafio de decisão só na camada Alexandria, com os
  fatos do caso.
- **Citações em prosa.** Parte 10, Módulo 10, Aula 05, Aula 06 e Parte 11. São citações, não tags de posse.

## Avaliação — § Quiz (P18)

- **Título.** h2 "Dez questões · critério de aprovação 8 de 10".
- **Lede.** "Sem consulta ao módulo. O critério é oito acertos: abaixo disso, a matéria não está no ponto de sustentar
  uma avaliação cronometrada diante de um cliente."
- **Mecânica do script (L3843–3960).**
  - 10 cartões com radio, em ordem fixa e sem embaralhar.
  - "Corrigir" marca a certa e a errada escolhida.
  - O feedback `q.f` aparece em **todas** as questões, inclusive certas e em branco.
  - O placar mostra "acertos / 10"; "Refazer" reconstrói o quiz.
  - Sem persistência.
- **Rótulo por questão.** Composto pelo script: `'Questão '+(i+1)+' de '+Q.length`.

**Faixas de placar (script, L3952–3953).**

| Condição | Classe | Mensagem literal (início) |
|---|---|---|
| `acertos>=8` | `pass` | "Critério atingido. A matéria está no ponto de sustentar uma avaliação cronometrada nas duas trilhas…" |
| senão (0–7) | `fail` | "Abaixo do critério de oito acertos. Reveja as questões erradas antes de aplicar a ordem de avaliação a uma proposta real…" |

A prosa e o script concordam em 8/10. Pela P18, isso não vira "Aprovado" no produto.

**Questões.** Os enunciados, as 4 alternativas, o gabarito e a explicação completos estão no JSON.

| Q | Tema (enunciado, início) | Gabarito |
|---|---|---|
| 1 | 80 kWp em módulos, 68 kW de inversores: como se classifica o porte? | C (microgeração pela potência em CA) |
| 2 | Fotovoltaica de 2,4 MW com baterias (≥ 20% da geração mensal): é minigeração? | A (despachável, mas teto de 3 MW) |
| 3 | Indústria no ambiente livre recebe proposta de autoconsumo local | D (vedação de elegibilidade, art. 9º) |
| 4 | Inciso VII do art. 27 para o período a partir de 2029 | B (remete ao art. 17; metodologia em elaboração) |
| 5 | Minigeração de 700 kW, compartilhada, titular com 30%, protocolo em 2024 | D (regime especial do § 1º do art. 27) |
| 6 | Validade dos créditos de energia | A (sessenta meses) |
| 7 | Inversor de 100 kW sem registro no programa de conformidade | C (fora do escopo compulsório, > 75 kW) |
| 8 | Planilha com 0,3%/ano × garantia de 0,55%/ano | B (divergência com o documento de efeito jurídico) |
| 9 | Proposta só com o resultado consolidado | D (conclusão não auditável; lista do que falta) |
| 10 | Tudo confere: qual a saída? | A (declarar sólida, com rastro) |

Nenhuma questão declara aula.

## Checklist final — § Final

h2 "Vinte e oito verificações antes de assinar um parecer". Lede: "O primeiro item é a execução completa da avaliação
cronometrada nas duas trilhas. O último é a capacidade de dizer que a proposta é sólida quando ela for." Lista
estática (`ul.ck`), sem handler e sem marcação clicável.

Itens literais (C = cronometrado, O = oral; anotação P14 desta extração):

1. (C) Executei a avaliação completa de uma proposta em trinta minutos, cronometrada, nas duas trilhas — técnico-regulatória e contratual — em paralelo, e não em sequência.
2. (C) Solicitei contrato, datasheets e termo de garantia de performance nos primeiros cinco minutos, antes de qualquer análise.
3. Confirmei a irradiação da localidade específica na base nacional, por coordenada, e não usei valor de outro município.
4. Reconstruí a geração de referência e comparei com a declarada, registrando o desempenho global implícito.
5. Verifiquei se a proposta declara irradiação de referência, base de origem, desempenho global, orientação e inclinação.
6. Comparei a degradação usada na projeção com a taxa máxima garantida no termo de garantia do modelo especificado.
7. Confirmei modelo específico de módulo e de inversor, e verifiquei registro por modelo no portal do instituto de metrologia.
8. Verifiquei se o inversor do projeto está dentro ou fora do escopo da certificação compulsória, e não tratei "equipamento certificado" como resposta suficiente para minigeração.
9. Classifiquei o porte pela potência instalada em corrente alternada, e não pela potência de pico dos módulos.
10. Confirmei o teto de porte aplicável à fonte, sem supor que armazenamento eleva o limite da minigeração solar para cinco megawatts.
11. Identifiquei a modalidade regulatória correspondente ao arranjo descrito, traduzindo eventual vocabulário comercial para o termo da norma.
12. Verifiquei qual documento comprova o enquadramento na modalidade declarada, e confirmei que ele existe.
13. Obtive a data de protocolo do pedido de acesso e determinei a classe de faturamento aplicável.
14. Verifiquei se o protocolo cai na janela que posterga a incidência da regra pós-transição para 2031.
15. Em projeto acima de quinhentos quilowatts não despachável em modalidade remota ou compartilhada, obtive a participação do maior titular no excedente.
16. Confirmei o percentual do ano corrente das componentes de distribuição sobre a energia compensada, com data de consulta.
17. Registrei que os percentuais incidem sobre as componentes do caput do artigo 27, e não sobre a tarifa integral.
18. Identifiquei quantos anos da projeção estão sob regra vigente e quantos estão sob regra em elaboração, sem tratar 2029 como percentual fixo.
19. Verifiquei se a trajetória tarifária assumida está declarada e ancorada em histórico homologado da concessionária correta.
20. Verifiquei a presença de linha de operação e manutenção e de substituição de inversor na projeção.
21. Comparei a geração estimada ao consumo compensável e verifiquei risco de acúmulo de crédito além do prazo de sessenta meses.
22. Confirmei que a projeção não zera a fatura, respeitando o valor mínimo faturável.
23. Em minigeração acima de quinhentos quilowatts, verifiquei se a garantia de fiel cumprimento foi contemplada.
24. Separei garantia de produto e garantia de performance, com prazo, garantidor, procedimento, custeio de mão de obra e sobrevivência à extinção do fornecedor.
25. Verifiquei prazo legal de início de injeção aplicável e a consequência contratual do atraso imputável ao fornecedor.
26. Verifiquei se o arranjo de área e a forma de remuneração do arrendamento não impedem a inclusão no sistema de compensação.
27. Em proposta de ampliação, confirmei que a parcela nova foi tratada em regime próprio e separada da parcela original.
28. (O) Sei dizer, sem constrangimento e sem procurar um problema que não existe, que a proposta é sólida quando ela for.

Nenhum item é automatizável como evidência: 26 dos 28 descrevem verificação documental em proposta real.

## Índice de exercícios — § Ex (P9)

- **Título.** h2 "Quatorze exercícios, quatro tipos".
- **Lede.** Declara os quatro tipos e a regra "formule a resposta antes de abrir". Nenhum gabarito contém valor de
  economia ou prazo de retorno.
- **Gabarito.** Botão "Gabarito" (`details`).
- **Vínculo com aula.** **Nenhum exercício tem tag ou citação de aula** (varredura `/Aula \d\d/` em enunciado e
  gabarito). Todos são soltos (P9).
- **Critério por exercício.** `null`: a regra geral é a do lede.

| # | Tipo (tag literal sem "N · " e sem ponto) | Enunciado (início) |
|---|---|---|
| 1 | Verificação de premissa | Uma proposta declara 100 kWp instalados e geração anual de 190 MWh. A base nacional dá 5,1 kWh/m²·dia para a l… |
| 2 | Verificação de premissa | A mesma proposta, agora declarando 145 MWh. Realista? |
| 3 | Dado faltante | Uma proposta apresenta projeção de vinte e cinco anos e cita "módulos de alta eficiência com certificação". O … |
| 4 | Diagnóstico negativo | Uma proposta declara irradiação com fonte e data, desempenho global de 76%, degradação de 0,55%/ano igual à ga… |
| 5 | Leitura contratual | O contrato diz: "Garantia de 25 anos." O que essa cláusula deixa sem resposta? |
| 6 | Verificação de premissa | A projeção usa degradação de 0,3%/ano. O datasheet do módulo especificado garante degradação máxima de 0,55%/a… |
| 7 | Dado faltante | Uma proposta de geração compartilhada de 800 kW, solar, apresenta a lista de participantes mas não a distribui… |
| 8 | Leitura contratual | O contrato prevê que "eventuais obras de reforço de rede exigidas pela distribuidora serão faturadas em aditiv… |
| 9 | Verificação de premissa | A projeção assume reajuste tarifário de 11% ao ano por vinte anos. A média histórica homologada da concessioná… |
| 10 | Diagnóstico negativo | Um contrato define garantia de produto do fabricante por doze anos, garantia de performance do fabricante por … |
| 11 | Dado faltante | O cliente é uma indústria que iniciou processo de migração para o ambiente livre há três meses. A proposta pro… |
| 12 | Verificação de premissa | Uma proposta de ampliação de sistema existente, cujo original foi protocolado em 2022, projeta o conjunto inte… |
| 13 | Leitura contratual | A usina será instalada em terreno arrendado, e o contrato de arrendamento remunera o proprietário em valor por… |
| 14 | Dado faltante | Ao fim de trinta minutos, você tem: geração verificada e compatível, enquadramento correto, premissas financei… |

**Contas de gabarito conferidas (desta extração).**
- Ex. 1: 100 × 5,1 × 365 = 186.150 kWh. ✓
- Ex. 2: 145.000 / 186.150 = 77,9%, "aproximadamente 78%". ✓
- Ex. 9: 11 − 6,5 = 4,5 p.p. ✓

**Código.** Os 14 estão em `MODULO_11_EXERCICIOS_SOLTOS` (`ex-11-01`…`ex-11-14`), com prompt e gabarito idênticos. A
tag do código perde o ponto final que a fonte tem dentro do `<b>` ("1 · Verificação de premissa." vira
"1 · Verificação de premissa") nos 14 casos (`div-m11-ap-09`). O código também traz `points: 1`, sem origem na fonte
(`div-m11-ap-02`), e `kind: 'discursiva'`. Nenhum exercício é renderizado, porque `RecursosDoModulo.tsx` não tem
`'modulo-11'`.

## Referências — § Ref

- **Título.** h2 "Fontes primárias verificadas".
- **Lede.** "Toda referência normativa carrega número, data e, quando cabe, artigo. **Data de consulta de todas: 1º de
  agosto de 2026.**…"
- **Sem URL.** **Nenhuma referência tem URL nem domínio** (zero "http"/"www." na seção).
- **Campos.** A fonte não separa título de instituição: `texto` é literal. `instituicoes_citadas` e
  `datas_e_anos_citados` são leituras auxiliares desta extração.

| # | Rótulo da fonte | Primeira frase / identificação | Marca |
|---|---|---|---|
| 1 | Lei · marco legal | Lei nº 14.300, de 6 de janeiro de 2022 (DOU 7/1/2022) | |
| 2 | Norma · condições gerais de fornecimento | REN ANEEL nº 1.000, de 7/12/2021 | |
| 3 | Norma · regulamentação do marco legal | REN ANEEL nº 1.059, de 7/2/2023 | |
| 4 | Norma · autoconsumo local e inversão de fluxo | REN ANEEL nº 1.098, de 23/7/2024 | |
| 5 | Norma · origem infralegal | REN ANEEL nº 482, de 17/4/2012 | |
| 6 | Norma · cogeração qualificada | REN ANEEL nº 1.031, de 26/7/2022 | |
| 7 | Lei · reforma do setor elétrico | Lei nº 15.269, de 24/11/2025 | **Pendente** |
| 8 | Resolução · diretrizes de valoração | Resolução CNPE nº 2, de 22/4/2024 | |
| 9 | Processo · regra pós-2029 | Tomada de Subsídios ANEEL nº 23/2025 | |
| 10 | Norma · certificação de equipamento | Portaria Inmetro nº 140, de 21/3/2022 | **Pendente** |
| 11 | Norma · requisitos gerais de conformidade e registro | Portaria Inmetro nº 140/2021 e nº 258/2020 | |
| 12 | Portal · procedimento oficial de certificação | Inmetro, perguntas frequentes (datas 10/4/2026 e 1/8/2026) | |
| 13 | Base de dados · recurso solar | Atlas Brasileiro de Energia Solar — 2ª edição (LABREN / Instituto Nacional de Pesquisas Espaciais) | |
| 14 | Ferramenta · consulta por ponto | "Centro de Referência para Energia Solar e Eólica…", programa de consulta de irradiação solar | |
| 15 | Base de dados · solarimetria histórica | Atlas Solarimétrico do Brasil | |
| 16 | Painel · mercado de geração distribuída | Painel de Dados de MMGD da EPE | |
| 17 | Base aberta · empreendimentos e conexões | Portal de Dados Abertos da agência reguladora | |
| 18 | Dado oficial · estoque de geração distribuída | ANEEL, divulgação de agosto de 2025 (3,77 milhões de sistemas) | Números vivos |
| 19 | Publicação · planejamento decenal | Caderno de MMGD e Baterias do PDE (EPE) | |
| 20 | Norma · formulários de conexão | REH ANEEL nº 3.171, de 7/2/2023 | |
| 21–24 | Módulo interno | Alexandria · Módulos 10, 09, 05 e 07, 01 | interna |
| 25 | Documento interno · currículo | "GridAlpha — Currículo Definitivo, Bloco 11: Geração Distribuída e o Boom Solar" | interna · Divergência registrada |
| 26 | Documento interno · política de linguagem | "GridAlpha — War Room, Parte 1, Quatro Travas de Segurança" | interna |
| 27 | Documento interno · especificação de produto | "GridAlpha — Plano de Negócios, produto 02: Solar Proposal Validator" | interna |
| 28–29 | Nota metodológica | fontes secundárias; viés de origem | |
| 30–32 | Pendência declarada | texto integral da REN 1.059; painéis dinâmicos; cronograma de obrigatoriedade da certificação | **Pendente** |

A coluna "Primeira frase / identificação" abrevia datas para caber na tabela; o texto literal está no JSON. Pendentes:
refs. 7, 10, 30, 31 e 32. Internas: refs. 21–27.

## Glossário — § Lex

- **Título.** h2 "O vocabulário que este módulo introduz".
- **Lede.** "Agrupado por família. Termos já definidos nos Módulos 01 a 10 não são repetidos aqui, exceto quando este
  módulo lhes dá sentido operacional distinto…"
- **Contagem.** 150 termos no markup, igual à pill; a prosa não declara número.
- **Ordem.** Por família, não alfabética. Sem duplicatas.

Todos os termos, com a definição literal (`definicao_html`/`definicao_texto`), estão no JSON:

- **Regime jurídico e marcos normativos** (20): Marco legal da micro e minigeração distribuída; Condições gerais de fornecimento; Resolução de regulamentação do marco legal; Resolução de inclusão do autoconsumo local; Resolução originária de 2012; Reforma do setor elétrico de 2025; Diretrizes de valoração de custos e benefícios; Tomada de subsídios; Análise de impacto regulatório; Projeto regulatório; Veto pendente de deliberação; Autoprodutor; Autoprodução por equiparação; Consórcio de consumidores de energia elétrica; Programa de energia renovável social; Conta de desenvolvimento energético; Exposição contratual involuntária; Modicidade tarifária; Serviços ancilares; Microrrede.
- **Porte, classificação e conexão** (20): Microgeração distribuída; Minigeração distribuída; Potência instalada em corrente alternada; Potência de pico; Fonte despachável; Fonte não despachável; Solicitação de acesso; Orçamento de conexão; Parecer de acesso; Vistoria do ponto de conexão; Prazo de início de injeção; Garantia de fiel cumprimento; Participação financeira; Melhorias e reforços de rede; Sistema de medição bidirecional; Análise de inversão de fluxo; Vedação de divisão de central; Unidade flutuante; Aumento de potência instalada; Grupo B optante.
- **Modalidades e sistema de compensação** (25): Sistema de compensação de energia elétrica; Autoconsumo local; Geração junto à carga; Autoconsumo remoto; Geração compartilhada; Empreendimento com múltiplas unidades consumidoras; Consumidor-gerador; Excedente de energia elétrica; Crédito de energia elétrica; Expiração de créditos; Ordem de utilização dos créditos; Alocação de excedentes; Unidade beneficiária; Alocação por posto tarifário; Relação entre postos; Vedação de adesão por consumidor livre; Vedação de remuneração de área por energia; Transferência de titularidade de contas; Valor mínimo faturável; Custo de disponibilidade; Bandeira tarifária na compensação; Iluminação pública no sistema de compensação; Chamada pública de excedentes; Empréstimo gratuito; Simultaneidade entre geração e carga.
- **Faturamento, transição e componentes** (22): GD I; GD II; GD III; Direito adquirido; Regra de transição; Regime agravado de concentração; Janela de postergação para 2031; Regra pós-transição; Componentes de remuneração de ativos de distribuição; Quota de reintegração regulatória; Custo de operação e manutenção do serviço de distribuição; Componente de rede; Componentes de transmissão no regime agravado; Encargos no regime agravado; Valoração de custos e benefícios; Benefício locacional; Vedação de dupla contagem; Custo de transporte; Demanda de injeção; Cessação do regime preservado; Ato homologatório de reajuste; Ciclo de revisão tarifária.
- **Recurso solar e grandezas de projeto** (25): Irradiância; Irradiação; Irradiação global horizontal; Irradiação direta normal; Irradiação difusa; Irradiação no plano inclinado; Atlas Brasileiro de Energia Solar; Modelo de transferência radiativa; Estação solarimétrica; Atlas Solarimétrico do Brasil; Ferramenta nacional de consulta por ponto; Dado indicativo; Certificação de medições solarimétricas; Desempenho global do sistema; Perda por temperatura; Perda por sujidade; Descasamento entre módulos; Sombreamento parcial; Degradação anual; Perda do primeiro ano; Orientação e inclinação; Fator de capacidade; Superdimensionamento; Reprodutibilidade da estimativa; Premissa embutida por omissão.
- **Equipamento e certificação** (20): Módulo fotovoltaico; Inversor; Microinversor; Inversor híbrido; Controlador de carga; Certificação compulsória; Declaração da conformidade do fornecedor; Registro de objeto; Etiqueta nacional de conservação de energia; Laboratório acreditado; Faixa de potência medida; Potência não entregue; Escopo compulsório; Exclusão de escopo; Coincidência de limiar; Dispositivo de desconexão de emergência; Vigilância de mercado; Vigência do registro; Datasheet; Sistema de armazenamento.
- **Contrato, garantia e método de verificação** (18): Garantia de produto; Garantia de performance; Garantidor; Cobertura de mão de obra; Cláusula de sobrevivência; Cláusula de rescisão; Aditivo por reforço de rede; Eixo de verificação; Premissa ancorada; Premissa solta; Desvio de premissa; Diagnóstico por faixa; Veredito de insuficiência; Diagnóstico negativo; Conflito de interesse estrutural; Marketing travestido de explicação regulatória; Termo comercial de plataforma; Ponto de sincronização.

**Faltam no código: os 150.** `alexandria-glossario.ts` tem 637 verbetes, todos `gl-m02-`…`gl-m08-` ou sem prefixo de
módulo, e nenhum `gl-m11-`. A lista está em `glossario.codigo_atual.faltam_no_codigo_lista`.

**Homônimos (9).** Termo com o mesmo nome normalizado, definido em outro módulo. Pelo lede do § Lex, o M11 só repete um
termo quando lhe dá sentido operacional distinto, então a definição do M11 **não** é substituível pela existente:

| Termo | Ids no código |
|---|---|
| Tomada de subsídios | `gl-m07-tomada-de-subsidios` |
| Análise de impacto regulatório | `gl-m05-analise-de-impacto-regulatorio` |
| Autoprodutor | `gl-m06-autoprodutor` |
| Modicidade tarifária | `gl-m05-modicidade-tarifaria` |
| Serviços ancilares | `gl-m02-servicos-ancilares`, `gl-m08-servicos-ancilares` |
| Microrrede | `gl-m02-microrrede` |
| Parecer de acesso | `gl-m07-parecer-de-acesso` |
| Quota de reintegração regulatória | `gl-m05-quota-de-reintegracao-regulatoria` |
| Fator de capacidade | `gl-m03-fator-de-capacidade`, `gl-m08-fator-de-capacidade`, `gl-fator-de-capacidade-fc` |

## Divergências (aparato.json)

| id | Sev. | Resumo |
|---|---|---|
| `div-m11-ap-01-ex-sem-aula` | média | 14 exercícios sem aula (P9); o código tem `activities: []` nas 8 aulas e um bucket não renderizado |
| `div-m11-ap-02-points` | baixa | `points: 1` no código, sem origem na fonte |
| `div-m11-ap-03-glossario-ausente` | **alta** | 150 termos na fonte × 0 `gl-m11-` no código |
| `div-m11-ap-04-caso-parte` | média | "Operação A — Parte 11" × P17 |
| `div-m11-ap-05-ref-titulo-bloco` | baixa | Três nomes do módulo: h1, repo e ref. 25 ("…e o Boom Solar") |
| `div-m11-ap-06-ref-m09` | baixa | Ref. 22 "Mercados ACR e ACL em Profundidade" × catálogo "Os Mercados ACR e ACL em Profundidade" |
| `div-m11-ap-07-quiz-q2-x-lex` | baixa | Q2, erro 4 e "Fonte despachável" dizem 3 MW para FV com bateria; o verbete "Minigeração distribuída", lido isolado, dá 5 MW às despacháveis |
| `div-m11-ap-08-garantia-limiar` | baixa | § Lex: 5% "a partir de 1.000 kW" × Inst · 04: com 1.000 kW exatos, exibe o ramo de 2,5% |
| `div-m11-ap-09-tag-ponto-final` | baixa | **(nova)** Tag com ponto final na fonte × sem ponto no código (14/14) |
| `div-m11-ap-10-portaria-140` | baixa | **(nova)** "Portaria Inmetro nº 140, de 21 de março de 2022" (ref. 10, Aula 05 L1675, L625) × "Portaria Inmetro nº 140/2021" (ref. 11, L2901): mesmo número, anos e objetos diferentes |

## Verificação (verificador adversarial, 2026-09-17)

- **Quiz.** Os 10 enunciados, as 40 alternativas, o gabarito `CADBDACBDA`, as 10 explicações e as 2 mensagens de faixa
  foram conferidos um a um contra o array `Q` avaliado do `<script>`. Não há diferença.
- **Checklist.** Os 28 itens batem com `section#final ul.ck > li`, com origens a ±3 linhas.
- **Contagens recalculadas.** Exercícios: 14 (5/4/2/3). Referências: 32, com 5 pendentes (2 marcadas "Pendente:" e 3
  "Pendência declarada") e 7 internas. Termos: 150 em 7 famílias. Homônimos no código: 9. Caso: 3 subseções e 1 pergunta
  literal. Tudo confere.
- **Divergências.** Todas foram checadas na fonte e procedem (`ap-08`: com `pot>1000` e 1.000 kW exatos, o script cai no
  ramo de 2,5%; `ap-10`: L1675 × L2901).
- **Correções.** Nenhuma neste grupo.

## Verificação — segunda passada (verificador adversarial, 2026-09-17)

Conferência independente: todas as strings deste grupo, as 10 questões do quiz (40 alternativas, feedbacks, gabarito
`CADBDACBDA`, 2 faixas), os 28 itens do checklist, 266 origens e as contagens (14 exercícios 5/4/2/3, 32 referências
com 5 pendentes e 0 URL, 150 termos em 7 famílias, 9 homônimos, 20 erros, 3 subseções e 1 pergunta no caso). Tudo
confere com a fonte, e as 10 divergências deste grupo foram conferidas na fonte. **Nenhuma correção neste grupo.**
Detalhe em `modulo.md` › Verificação — segunda passada.
