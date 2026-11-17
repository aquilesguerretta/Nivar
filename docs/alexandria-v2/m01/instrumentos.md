# M01 · Os sete instrumentos e o laboratório — o delta até a tela

**Rodada:** fechamento do Módulo 01 em qualidade final (decisão do Founder, 2026-09-21).
**O que este documento é:** o **delta**. A especificação dos 165 já existe em
[`extraction/instrumentos/instrumentos.json`](../extraction/instrumentos/instrumentos.json) — entradas, saídas,
fórmulas verbatim, cenário-padrão, forma prometida, tolerância e previsão. Aqui está só o que separa essa
especificação do instrumento **funcionando na tela**.

**O que este documento não é.** Nada foi construído nesta rodada. `src/`, `public/`, `tools/`, `app/`, git e a
porta 5311 foram lidos e não tocados. Cada linha de "o que o produto tem hoje" é arquivo e linha, conferidos por
leitura do código nesta sessão.

**Fonte única.** `extraction/m01/` (`modulo.json`, `aparato.json`, `aula-08.json`) e
`extraction/instrumentos/instrumentos.json`. Nenhum fato vem de fora dela. Onde a fonte não diz, o documento diz
que não diz — e isso vira **pesquisa**, não unidade de trabalho.

**Regra de admissão da tabela.** Uma linha só é unidade de trabalho se puder ser **verificada no render**: abrir a
tela, olhar, e dizer feito ou não feito. O que não passa nesse teste está na §7.

---

## 1. O quadro dos sete

A pergunta do bar, instrumento a instrumento: **está portado? desenha a forma que o nome promete (C5)? tem previsão
registrada antes do resultado, com previsto × calculado no mesmo cenário? tem tolerância declarada pela fonte?**

| Instrumento | Camada fonte | Portado? | Desenha a forma prometida? | Previsão registrada? | Tolerância da fonte |
|---|---|---|---|---|---|
| **INST·01** · Calculadora · kWh = kW × h | **ausente** (D18) | sim — `alexandria-modulo-01-content.ts:42`, calculadora em `alexandria-instrument-calculators.ts:1667` | **indeterminável**: sem camada fonte não há promessa a medir | não | não declarada |
| **INST·02** · Calculadora · Lei de Ohm | **ausente** (D18) | sim — `…content.ts:56`, `…calculators.ts:1683` | indeterminável | não | não declarada |
| **INST·03** · Calculadora · Perdas resistivas | **ausente** (D18) | sim — `…content.ts:71`, `…calculators.ts:1716` | indeterminável | não | não declarada |
| **INST·04** · Calculadora · Demanda média e fator de carga | **ausente** (D18) | sim — `…content.ts:85`, `…calculators.ts:1727` | indeterminável | não | não declarada |
| **INST·05** · Controles · Triângulo de potência | **ausente** (D18) | sim — `…content.ts:102`, `…calculators.ts:1755` | **sim** — `InstrumentPanel.tsx:363` → `TrianguloDePotencia` (`:719`). É o **único instrumento do produto inteiro** que desenha a forma que o nome promete | não | não declarada |
| **INST·06** · Calculadora · Fator de capacidade | **extraída** | sim, **duas vezes**: prancha da aula em `AulaM01A08.tsx:459-613` e calculadora genérica em `…calculators.ts:1776` | a fonte **não promete forma** (`forma_prometida.promete: false`). A proposta da camada Alexandria — pôr o FCap calculado como marca móvel sobre a figura `cf-chart` que já existe — **está feita**: `AulaM01A08.tsx:765`, `<ReguaDeFaixas … marca={fcap}>` | **sim** — `AulaM01A08.tsx:334` (ato) + `:473` (quadro previsto × calculado) | não declarada |
| **LAB·01** · Laboratório · Comparador de perfil elétrico | **extraída** | sim — `…content.ts:131`, `…calculators.ts:1817`; renderizado em `FolhaDoModulo.tsx:1025` | **não** — `promete: true`, `estado_c5: "promessa sem desenho"`. Hoje são dez linhas de texto em duas colunas | não | não declarada |

**Tolerância: a resposta é não, nos sete.** O currículo inteiro tem **1 tolerância declarada em 165**
(`m08-inst-04`, três pontos percentuais). Nos sete do M01 o campo é `null`. Consequência de gate, literal:

> **C5** — "Dentro" e "fora" só com tolerância real, nunca inventada (P6).
> **C5, heurística** — Sem tolerância: autoavaliação na escala de C7.
> **C7** — Autoavaliação em três níveis (*atende · atende em parte · não atende*).

Nenhum dos sete pode emitir veredito "dentro/fora" **sobre a resposta do learner**, e nenhum dos sete oferece hoje a
autoavaliação em três níveis (unidade **U03**). O M01 **não entra** na lista dos cinco pedidos de revisão técnica de
tolerância (`m10-inst-09`, `m11-inst-06/07/08`, `m12-inst-02`) — aqui não há o que pedir, e inventar seria P6.

**Uma distinção que precisa ficar escrita.** O `veredito` que o INST·05 emite hoje — *"FP dentro do mínimo
regulatório de 0,92"* — não é veredito sobre a resposta do learner: é o **ramo de leitura** do fenômeno, com o 0,92
que a própria aula ensina. Isso é legítimo. O que **não** é legítimo é a cor que acompanha esse ramo (U14).

**Os cinco vazios não são desleixo de extração — são D18.** O M01 é o único módulo sem `instrumentos.json`. Os cinco
existem no código, mas **o código não é camada fonte**: especificá-los a partir do porte seria inventar a fonte a
partir da cópia. Enquanto D18 não fechar, a coluna "forma prometida" de INST·01–05 fica indeterminável, e a
aritmética "165 instrumentos" do bar fecha em **158 medidos + 7 sem camada fonte**.

---

## 2. As unidades de trabalho

Trinta linhas. Cada uma verificável no render. O tamanho usa a escala do
[`PORTAR.md`](../extraction/instrumentos/PORTAR.md): **P** ≈ meio dia · **M** ≈ um dia e meio · **G** ≈ três dias.

### 2.1 Sistema — um toque serve seis pranchas

Vale para as seis pranchas que passam pelo `InstrumentPanel` genérico (INST·01–05 + LAB·01). A A08 já resolveu
estas seis por conta própria, na prancha dela, e é exatamente por isso que elas entram como **sistema** e não como
seis correções de superfície — a lição r07 → r09 é literal: *"corrigir por superfície e não por sistema"*.

| # | Unidade | O que a fonte tem | O que o produto tem hoje | O que falta | Gate | Tam. |
|---|---|---|---|---|---|---|
| **U01** | **Pergunta na prancha** | `o_que_pergunta.pergunta_da_fonte: null` nos sete — a fonte **não** dá pergunta de instrumento. A pergunta é da camada Alexandria, rotulada como tal | `InstrumentPanel.tsx:224-420` imprime número, título, campos, saídas, veredito, fonte e nota. **Nenhuma pergunta.** A A08 tem a dela em `AulaM01A08.tsx:467`, com `<Voz rotulo="Pergunta" fonte="Alexandria">` | Slot de pergunta no `InstrumentPanel`, com a marca de camada; a redação de cada uma é P3/P11 | C5 ("Conteúdo: **pergunta**; controles…") | **M** |
| **U02** | **Previsão registrada + previsto × calculado** | Overlay declara `previsao.util: true` para INST·06 e LAB·01; os outros cinco sem camada fonte | `grep previs InstrumentPanel.tsx` → **0 ocorrências**. O maquinário existe e está provado: `tronco.tsx:725` `Ato`, `:1328` `QuadroDeComparacao` (sticky a 390, `:1338`), `:564` `useLoop` | Levar `Ato` + `QuadroDeComparacao` para o `InstrumentPanel`, ou compor as pranchas restantes sobre o tronco como a A08 fez | C5 ("o learner se compromete antes de ver o resultado; vê previsto × calculado **no mesmo cenário**; esse quadro fica visível enquanto ele explora") · C3 | **G** |
| **U03** | **Autoavaliação em três níveis** | Tolerância `null` nos sete ⇒ a escala de C7 é a única saída permitida | `tronco.tsx:1487` `Autoavaliacao` existe e é usada nas quatro aulas compostas. O `InstrumentPanel` não a tem. Na A08 a **meta** registra `atende`/`atende em parte` (`:672`), mas a **previsão** registra só o resumo (`:365`) | A escala de três níveis presente em todo ato que compara resposta com referência, inclusive a previsão da A08 | C7 · C5 (heurística "sem tolerância") | **M** |
| **U04** | **Linha de fonte sob a prancha** | Todos os sete têm procedência a declarar; o INST·06 traz `fonte_dos_numeros_nota` explícita ("A fonte não cita procedência para o cenário-padrão… nem para os limiares") | `InstrumentPanel.tsx:405` renderiza `{fonte}` — mas a prop só é passada **uma vez** em toda a árvore: `FolhaDoModulo.tsx:1028`, para o LAB·01. `AulaViewer.tsx:126` chama `<InstrumentPanel instrumento={inst} />` **sem fonte** | Linha de fonte nas cinco pranchas de aula, com a ausência declarada onde a fonte não cita procedência | S4 · C5 ("Conteúdo: … **fonte**") | **P** |
| **U05** | **Ordem interna da prancha** | — | Ordem atual: título → nota (só no modo correção) → campos → saídas → diagrama → veredito → fonte → nota | Ordem da heurística C5: número, título com escopo, **pergunta**, controles, **figura**, saídas, fonte, **leitura**. Hoje a figura vem *depois* das saídas e a leitura vem *antes* da fonte | C5 (heurística "Prancha em ordem") | **P** |
| **U06** | **Posição no ponto da prosa** | `invocacoes_no_texto` na extração marca onde cada aula chama o instrumento ("Pratique abaixo.", "Veja:") | `AulaViewer.tsx:126`: os instrumentos saem **todos juntos**, depois do corpo inteiro da apostila e antes dos exercícios. A A08 é a única que põe a prancha dentro da 8.2 (`AulaM01A08.tsx:444-459`) | Ancorar cada instrumento no bloco que o invoca, nas cinco aulas restantes | C5 ("Posição: no ponto da prosa que o invoca") · Regra-mãe 1 | **M** |
| **U07** | **Uma régua graduada, não duas** | — | **Duas implementações independentes do mesmo controle da casa**: `ControlesDeInstrumento.tsx:158` (`onMudar`, `movel`) e `tronco.tsx:1080` (`aoMudar`, `marcas`, `nota`, `captura`). As aulas compostas usam a do tronco; o `InstrumentPanel` usa a outra | Uma definição só. Duas línguas para o mesmo objeto é exatamente como a "caixa default" voltou na r09 numa superfície nova | S2 (materialidade por sistema) · §6 | **P** |

### 2.2 INST·01 · Calculadora · kWh = kW × h

| # | Unidade | O que a fonte tem | O que o produto tem hoje | O que falta | Gate | Tam. |
|---|---|---|---|---|---|---|
| **U08** | **A comparação que a nota pede não existe na prancha** | Camada fonte ausente (D18). O que está **na tela** é a nota portada: *"Experimente comparar dois cenários: 50 kW × 1 h e 1 kW × 50 h… O kWh igual mascara que são problemas de engenharia opostos"* (`…content.ts:53`) | Dois assentos de valor e uma saída. Um cenário por vez: para comparar, o learner apaga e redigita | Os dois cenários **lado a lado no mesmo quadro** — é o texto da própria prancha que promete, e é a tese do módulo | C5 (forma prometida pelo texto da prancha) · C6 | **P** |

### 2.3 INST·02 · Calculadora · Lei de Ohm

| # | Unidade | O que a fonte tem | O que o produto tem hoje | O que falta | Gate | Tam. |
|---|---|---|---|---|---|---|
| **U09** | **A instrução de operação virou rodapé** | Camada fonte ausente (D18) | Três assentos vazios (`defaultValue: ''`, `…content.ts:61-63`) e, no rodapé, o veredito *"Aguardando 2 valores..."* (`…calculators.ts:1692`). O learner encontra três campos vazios e nenhuma instrução acima deles | A regra de operação no topo da prancha, onde é lida antes de o campo ser tocado — não como saída de um estado de espera | C5 ("Conteúdo: pergunta; controles…") · C3 | **P** |

### 2.4 INST·03 · Calculadora · Perdas resistivas

| # | Unidade | O que a fonte tem | O que o produto tem hoje | O que falta | Gate | Tam. |
|---|---|---|---|---|---|---|
| **U10** | **"Exponencial" ao lado de `P = I² × R`** | `QA-M01-A04` em `reconciliacao/DECIDIR.md:60`, classificado **[C] Conserto**: *"Troca editorial de uma palavra, refutada pela fórmula da própria seção. Nenhum número novo"* | `…content.ts:83`: *"Esse comportamento **exponencial** é a razão…"*, impresso a poucos pixels de `formula: "P = I² × R"` (`…content.ts:75`). As duas coisas estão na mesma prancha, na mesma tela | Trocar a palavra por "quadrático", com a proveniência da correção declarada | §6 (honestidade de conteúdo) · C4 | **P** |
| **U11** | **A curva que a prancha promete** | Camada fonte ausente (D18) — a forma prometida **não é verificável na fonte única**, e a figura só pode ser especificada depois de R1 | Duas réguas graduadas (corrente, resistência) e um readout. A nota na tela diz *"Dobre a corrente. Veja a perda quadruplicar"* — e não há nada para ver | A parábola P(I) com o ponto corrente e o ponto de "corrente dobrada", que é o que a frase na tela promete | C5 · C6 ("desenha a relação que a aula afirma") | **M** |

### 2.5 INST·04 · Calculadora · Demanda média e fator de carga

| # | Unidade | O que a fonte tem | O que o produto tem hoje | O que falta | Gate | Tam. |
|---|---|---|---|---|---|---|
| **U12** | **Dois textos concorrentes na mesma prancha** | Camada fonte ausente (D18). O mesmo defeito que a extração do INST·06 registra como **DIV-01**: a nota do markup é o valor *antes* de o script rodar, e o script a sobrescreve | A nota estática (`…content.ts:100`) congela o ramo "FC 0,15–0,40" e fica **sempre** na tela; o veredito vivo (`…calculators.ts:1740-1753`) mostra o ramo ativo logo acima. Nos valores-padrão (144.000 / 720 / 800 ⇒ FC = 0,25) os dois concordam por acaso; mova a demanda máxima para 300 kW e a prancha afirma duas faixas ao mesmo tempo | Uma leitura só, a do ramo ativo, rotulada como leitura do instrumento | C5 ("a leitura de um parágrafo, que mostra só o ramo ativo") · S4 | **P** |
| **U13** | **Campo vazio produz número falso** | — | `nOu(i['i04-h'], 1)` (`…calculators.ts:1732`) preserva o `\|\| 1` da fonte: apagar "Horas do período" faz T = 1 h e o fator de carga explode, **sem nenhum aviso**. O porte registra a escolha em comentário (`:1723-1726`), e ela é fiel — mas o comentário não está na tela | Estado de espera declarado quando um campo obrigatório está vazio, em vez de um resultado que parece cálculo | §6 (ausência desonesta) · C5 ("saídas legíveis") | **P** |

### 2.6 INST·05 · Controles · Triângulo de potência

O único instrumento do produto que desenha a forma que o nome promete — e o que tem os dois defeitos mais caros.

| # | Unidade | O que a fonte tem | O que o produto tem hoje | O que falta | Gate | Tam. |
|---|---|---|---|---|---|---|
| **U14** | **Semáforo de cor no fator de potência** | Camada fonte ausente (D18). O estudo de aula registra que a fonte colore o FP em verde, ouro e vermelho — e o S2 proíbe | `InstrumentPanel.tsx:732`: `const corFp = fp >= 0.92 ? A.oliva : fp >= 0.85 ? A2.ouroSobreNavy : A.terracota`, aplicado à hipotenusa (`:748`) e ao readout "Fator de potência" (`:761`). **Três cores codificando bom / atenção / ruim** | Estado por **silhueta e palavra**, nunca por cor. Verificação: captura em cinza — hoje os três estados colapsam num só | **S2 hard gate** ("Zero semáforo. Nenhuma cor codifica certo/errado") · C7 ("Nenhuma cor marca certo ou errado (S2)") | **P** |
| **U15** | **O arco de φ não corresponde ao triângulo desenhado** | — | `InstrumentPanel.tsx:726`: `MAX_KW = 1500`, `MAX_KVAR = 1200`, e o cateto vertical ainda leva um fator `0.85` (`:728`). Os dois eixos têm **escalas diferentes**, mas o arco é desenhado com o φ verdadeiro (`:741`). O ângulo que o learner vê e o ângulo que o readout diz são dois ângulos | Escala comum aos dois eixos, ou o arco construído na geometria desenhada. Verificação: nos valores-padrão (800 kW / 480 kVAr) o readout diz 31,0° e o desenho não | C6 ("desenha a relação que a aula afirma") | **P** |
| **U16** | **A meta de 0,92 não existe, e o mostrador mente na fronteira** | — | Duas réguas e três readouts. Não há ato de meta. E o readout tem duas casas (`fmt(fp, 2)`, `:761`): **em 350 kVAr o produto exibe "0,92"** quando o FP verdadeiro é 0,9162 — abaixo da meta | O ato "reduzir o kVAr até FP ≥ 0,92" dentro da prancha, com a detecção no valor **não arredondado** e o estado por palavra ("meta atingida" / "ainda abaixo") | C5 (ato de meta; "Mostrador arredondado que declara a meta atingida por engano") · C7 | **P** |

### 2.7 INST·06 · Calculadora · Fator de capacidade — as linhas abertas

Ver §3 para a leitura cláusula a cláusula do C5.

| # | Unidade | O que a fonte tem | O que o produto tem hoje | O que falta | Gate | Tam. |
|---|---|---|---|---|---|---|
| **U17** | **Faixas inventadas onde a fonte declara ausência de máximo** | Três entradas `number`: `i06-cap` padrão 100, `"0 – sem atributo max na fonte / passo 10"`; `i06-gen` padrão 220000, `"0 – … / passo 1000"`; `i06-h` padrão 8760, `"0 – … / passo 24"` | `AulaM01A08.tsx:521-556`: três **réguas** com `min/max` que a fonte não tem — 20–200 MW (passo 5), 0–876.000 MWh (passo 2000), 720–8.760 h (passo 24). O campo digitável **desapareceu**: não há como escrever 131 MW, o valor da placa documental da própria 8.1 | Campo numérico **e** deslizador com a mesma faixa (`SISTEMA.md` §3.1, item 3.3); e a faixa do deslizador rotulada como regra de entrada da Alexandria, já que a fonte não declara máximo | C5 ("controles com rótulo e unidade") · S4 (camada) · P19 | **P** |
| **U18** | **A leitura por faixa foi reescrita, e um limiar novo foi criado** | Seis ramos com texto **verbatim** (`formulas_da_fonte.texto_leitura.ramos`, linhas 2952-2957): ≥0,85 · ≥0,55 · ≥0,40 · ≥0,25 · ≥0,15 · else | `…calculators.ts:1786-1814` preserva os seis verbatim. **A prancha da aula não os usa**: `AulaM01A08.tsx:941` tem **sete** ramos, cinco com texto reescrito e um limiar novo em **45%** que a fonte não tem. Verificação: em FCap 50%, a fonte diz *"hidrelétrica brasileira (média anual) ou eólica em região de bom regime de ventos (Nordeste)"* e o produto diz *"hidrelétrica brasileira média, dependente do regime hidrológico do ano"* | Ou o texto da fonte, ou o rótulo de camada Alexandria em cada ramo reescrito. O limiar de 45% **resolve** a `QA-FCap-01`, que está declarada como não resolvível sem o Founder (P20) | S4 · P20 · §6 | **P** |
| **U19** | **A previsão não tem autoavaliação** | Tolerância `null` ⇒ a escala de C7 é a saída obrigatória | `AulaM01A08.tsx:365`: `loop.registrar('previsao', { resumo })` — sem `atende`. O quadro compara e diz "N pontos acima/abaixo" (`:502`), o que é **descrição**, correta e permitida; mas o learner não se avalia | Os três níveis oferecidos depois da comparação, como a meta já faz em `:672` | C7 · C5 (heurística) | **P** |
| **U20** | **Duas saídas derivadas sem rótulo de camada** | Uma saída: `i06-fc`, "Fator de capacidade", `%` | `AulaM01A08.tsx:578-590` mostra três: FCap, "Teto teórico (capacidade × horas)" e "Geração no período". As duas últimas são aritmética da camada Alexandria sobre números da fonte | A marca de camada nas duas derivadas, como a prancha já faz com a pergunta (`:467`) | S4 | **P** |
| **U21** | **Duas verdades para o mesmo instrumento** | Um instrumento | `inst-06` existe **duas vezes e diferente**: a calculadora genérica (verbatim, seis ramos) e a prancha da A08 (sete ramos reescritos). Enquanto `arquetipos.ts:30` roteia `modulo-01:8` para a prancha, a calculadora fica viva e divergente no array | Uma só, ou a divergência declarada e datada. É a mesma classe de risco de U07 | §6 · S4 | **P** |

### 2.8 LAB·01 · Laboratório · Comparador de perfil elétrico

| # | Unidade | O que a fonte tem | O que o produto tem hoje | O que falta | Gate | Tam. |
|---|---|---|---|---|---|---|
| **U22** | **O laboratório não tem enunciado** | `lab_01.enunciado` (L2261, verbatim): *"Esta é a demonstração que valida toda a tese central do módulo. Ajuste as variáveis nas duas fábricas — mantendo o mesmo consumo total — e observe como a fatura mensal estimada diverge. O perfil elétrico é a diferença."* | `dossieModulos.ts:421` põe **o título da seção** no campo `enunciado`: `enunciado: 'Duas fábricas. Mesmo kWh. Contas diferentes.'`. O lead da fonte **não está em lugar nenhum da árvore** (`grep "demonstração que valida"` → 0) | O enunciado literal acima da prancha. É a frase que liga o laboratório à tese (`vinculos.tese: "m01-tese"`) | C2 · C3 · S4 | **P** |
| **U23** | **A instrução interna sumiu** | `lab_01.instrucao_interna` (L2270, verbatim): *"Ambas as fábricas consomem o mesmo volume de energia. As variáveis abaixo definem o **perfil**."* | `grep "Ambas as fábricas consomem"` → 0 ocorrências na árvore | A instrução no topo da bancada, onde ela explica por que dois dos oito controles são comuns | C5 ("Conteúdo: pergunta; controles…") | **P** |
| **U24** | **O cabeçalho da coluna perdeu a metade que importa** | `colunas[].cabecalho`: **"Fábrica A · Operação estável"** e **"Fábrica B · Operação concentrada"** | Os rótulos do código são compostos (`"Fábrica A · Demanda máxima"`, `…content.ts:138`) e `InstrumentPanel.tsx:34` `separaColuna` casa só `/^(Fábrica [AB])\s*·\s*(.+)$/` — a coluna imprime **"Fábrica A"** (`:333`). "Operação estável" e "Operação concentrada" nunca chegam à tela | Os dois cabeçalhos literais. Sem eles, o laboratório mostra duas fábricas sem dizer o que as distingue — que é o assunto | C5 ("título com escopo") · S4 · Q08 do `DECIDIR.md` | **P** |
| **U25** | **A forma prometida — duas barras empilhadas** | `forma_prometida.promete: true`, `estado_c5: "promessa sem desenho"`. `desenho_declarado_na_fonte`: *"não há figura: a comparação existe só como duas colunas de texto"*. A especificação já está escrita: duas barras empilhadas lado a lado, **mesma escala vertical**, segmentadas em Energia · Demanda · Reativo excedente · Adicional ponta, com o total rotulado no topo; eixo y em R$/mês começando em zero; a relação a mostrar: *"O segmento Energia é idêntico nas duas barras por construção… toda a divergência vem dos outros três"* | Dez readouts de texto em duas colunas (`InstrumentPanel.tsx:344-350`, `Saidas` em `:693`). Nenhuma figura | A figura. Família **F6 · pilha ordenada e barra composta**, que serve outros 15 instrumentos do currículo | **C5 (forma prometida)** · C6 | **M** |
| **U26** | **Duas terracotas por viewport** | — | `InstrumentPanel.tsx:702`: o total recebe `A.terracota` por `/fatura estimada/i` (`:697`). O LAB tem **dois** totais, um por coluna — logo, duas ocorrências de terracota lado a lado | Terracota como pontuação rara (≈1 por viewport). No comparador, a cor deveria marcar **a diferença**, não os dois lados dela | S2 (heurística de cor) | **P** |
| **U27** | **O laboratório não termina em nada** | `passos: null` · `entregavel: null` — **ausência declarada**, com nota (`passos_nota`, `entregavel_nota`). A fonte não pede registro nem fechamento | `FolhaDoModulo.tsx:1015-1040`: a prancha abre no lugar dela no roteiro (isso já está certo, C2) e acaba. Sem ato, sem registro, sem "Praticado", sem próximo passo | Um ato de fechamento **da camada Alexandria**, declarado como tal — a fonte não dá passos, e inventar passos atribuídos a ela seria S4 quebrado. O ato natural existe e é da fonte: *"mantendo o mesmo consumo total"* | C2 ("o caso termina em decisão") · C10 | **M** |
| **U28** | **A previsão do LAB está destravada e ninguém a usou** | `previsao.bloqueio: "reconciliacao-pendente"` — e a reconciliação **já saiu**: `DECIDIR.md:81` (D05) decide **3.200 / 68.825**, porque *"A fonte resolve sozinha: (0,92 − 0,84) × 100.000 × 0,4 = 3.200. O markup estático é que está desatualizado"* | `…calculators.ts:1827` já implementa a fórmula do script — a tela **já mostra** 3.200 e 68.825. A pergunta de previsão especificada ("Quantos por cento a fatura da B fica acima da fatura da A?") não existe | Registrar D05 no `instrumentos.json` (tirar o `bloqueio`) e montar a previsão. Resposta de referência derivável do cenário-padrão: **31,4 %** (52.375 → 68.825) | C3 ("Previsão") · C5 | **P** |
| **U29** | **Os coeficientes didáticos não têm ficha** | Os doze verbatim (L3031-3044), com o comentário da própria fonte: *"Coeficientes didáticos (NÃO usar para cálculos reais de fatura)"*. E `fonte_dos_numeros_nota`: *"A fonte não cita procedência para tarifa, demanda, fator de potência nem percentual de ponta"* | A nota de "simulação didática" está na tela (`…content.ts:157`, via `InstrumentPanel.tsx:409`) e é literal. Mas `FolhaDoModulo.tsx:1028` passa `fonte={<FonteDoBloco dossie={dossie} />}` — a fonte **do módulo**, não a dos quatro coeficientes | Ficha dos coeficientes: R$ 25/kW, 0,92, fator 0,4, adicional 50% — cada um com "procedência externa não declarada" | S4 ("todo número factual tem fonte à vista") | **P** |
| **U30** | **As duas faixas do mesmo campo** | A fonte declara **dois** controles por campo, com faixas **diferentes** (div-09): `lab-a-dem` número `min 50`, sem max, passo 10 — e o deslizador gêmeo `100–800`, passo 10. Idem FP (`0,5–1` × `0,7–1`) e ponta (`0–100` × `0–50`) | `…content.ts:138-143` ficou só com a faixa do **deslizador** e descartou a do campo. O learner não consegue pôr 50 kW, que a fonte permite | Campo e deslizador com a mesma faixa, e a escolha de qual faixa prevalece declarada como decisão da Alexandria | C5 · S4 · div-09 | **P** |

**Soma.** 23 **P** · 6 **M** · 1 **G**. Pela escala do `PORTAR.md`, ordem de grandeza de **~23,5 dias** — número
derivado da escala, não promessa de prazo.

---

## 3. O INST·06 contra o C5 inteiro

É a prancha da aula-padrão e a única do M01 já composta sobre o tronco (`arquetipos.ts:30`,
`AulaM01A08.tsx:459-613`). Medida cláusula a cláusula:

| Cláusula do C5 | Estado | Onde se vê |
|---|---|---|
| **Posição** — no ponto da prosa que o invoca | **cumprido** | A prancha abre dentro da 8.2, logo depois do parágrafo que a invoca (`:444-459`). A frase "25,1%" do próprio parágrafo fica **velada** até o registro (`:450`, `<Velado>` em `:452`) — o C7 aplicado à prosa, não só ao ato |
| **Conteúdo · pergunta** | **cumprido** | `:467-470`, com `<Voz rotulo="Pergunta" fonte="Alexandria">` |
| **Conteúdo · controles com rótulo e unidade** | **cumprido em parte** | Três réguas com rótulo e unidade (`:521-556`) — mas com faixa inventada e sem campo digitável (**U17**) |
| **Conteúdo · saídas legíveis** | **cumprido em parte** | `:578-590`, três saídas, duas delas derivadas sem marca de camada (**U20**) |
| **Conteúdo · fonte** | **cumprido** | `:591-613`, com `<Selo pendente>faixas do módulo · verificação pendente</Selo>` e ficha de três pares |
| **Com previsão · compromisso antes do resultado** | **cumprido** | `:334-380`. O ato é o primeiro da página, com os valores do cenário e o rótulo P19 ("Cenário didático presente no módulo; fonte externa dos valores não declarada", `:345`) |
| **Com previsão · previsto × calculado no mesmo cenário** | **cumprido** | `:473-511`. Três colunas: previsão, calculado, comparação em prosa |
| **Com previsão · quadro visível enquanto explora** | **cumprido** | O quadro está dentro da prancha, acima dos controles; `tronco.tsx:1338` o torna `sticky` a 390 (PR-8) |
| **Tolerância** — só com tolerância real | **cumprido** | Nenhum "dentro/fora" sobre a resposta. A comparação diz "N pontos acima/abaixo", que é descrição |
| **Tolerância** — sem tolerância, autoavaliação de C7 | **não cumprido** | A meta tem os três níveis (`:672`); a previsão não (**U19**) |
| **Forma prometida** | **cumprido, e além** | A fonte **não promete forma**. A proposta do overlay (marca móvel sobre a figura `cf-chart` existente) está feita em `:765`, e a prancha ainda ganhou a caixa teórica V-RET (`:953`), que é a forma da aula, não do instrumento |
| **Heurística · prancha em ordem** | **cumprido** | número · título · pergunta · quadro · controles + figura · saídas · fonte · leitura |
| **Heurística · leitura mostra só o ramo ativo** | **cumprido na forma, quebrado no texto** | `:588-593` mostra um ramo só — mas o texto dos ramos foi reescrito e um limiar novo foi criado (**U18**) |

**O veredito.** Dez das treze cláusulas cumpridas. O que falta no INST·06 são **quatro linhas P**, nenhuma
estrutural: U17, U18, U19, U20 — mais U21, que é o instrumento existir duas vezes. Como régua dos outros dezesseis
módulos, o INST·06 já serve; o que ele ainda não prova é a autoavaliação de C7 e a disciplina de camada no texto de
leitura.

---

## 4. O LAB·01 — o único laboratório do currículo

Os outros dezesseis módulos não têm laboratório. Este é o único, e o enunciado da fonte diz por quê: *"a
demonstração que valida toda a tese central do módulo"*.

### 4.1 O que a fonte dá

| Peça | O que é | Onde |
|---|---|---|
| **Enunciado** | 1 parágrafo, verbatim | `modulo.json › lab_01.enunciado`, L2261 |
| **Instrução interna** | 1 frase, verbatim | `lab_01.instrucao_interna`, L2270 |
| **Título da seção** | "Duas fábricas. Mesmo kWh. Contas diferentes." | `lab_01.secao.titulo` |
| **Dois campos comuns** | Consumo mensal · ambas (kWh, 100.000) · Tarifa energia média (R$/MWh, 450) | `lab_01.campos_comuns`, L2274 / L2278 |
| **Duas colunas × três campos** | Demanda máxima (kW) · Fator de potência · Consumo em horário de ponta (%), cada um com **campo numérico + deslizador gêmeo de faixa diferente** | `lab_01.colunas`, L2287-2297 e L2317-2327 |
| **Quatro saídas + total, por coluna** | Energia · Demanda · Reativo excedente · Adicional ponta · **Fatura estimada** | L2303-2310 e L2333-2340 |
| **A nota** | O aviso de simulação didática, verbatim | L2345 |
| **Doze linhas de coeficiente** | O `update()` inteiro, verbatim | L3031-3044 |

### 4.2 O que falta para ele existir como **lugar** no módulo

O laboratório já abre no lugar dele dentro do roteiro — `FolhaDoModulo.tsx:1015`, e o comentário do arquivo dá a
razão certa: *"O laboratório é um LUGAR do módulo, não um link no rodapé (C2)"*. O que falta é tudo o que faz um
lugar ser um lugar:

1. **Chegar com o enunciado** (U22) — hoje o dossiê põe o título da seção onde deveria estar o lead da fonte.
2. **Dizer a regra do jogo** (U23) — "Ambas as fábricas consomem o mesmo volume; as variáveis abaixo definem o
   perfil". Sem ela, oito controles são só oito controles.
3. **Nomear as duas fábricas inteiras** (U24) — "Operação estável" × "Operação concentrada" é o conteúdo.
4. **Desenhar a comparação** (U25) — é a única promessa de forma do M01, e a espec já está escrita.
5. **Pedir a previsão** (U28) — destravada por D05.
6. **Terminar em alguma coisa** (U27).

### 4.3 O que a fonte **não** dá — ausência declarada, não item a inventar

| Campo | Valor | A nota da própria extração |
|---|---|---|
| `lab_01.passos` | `null` | *"A fonte não enumera passos. A única instrução de ação é a frase do enunciado."* |
| `lab_01.entregavel` | `null` | *"A fonte não declara entregável, registro nem pergunta de fechamento para o LAB · 01."* |
| `lab_01.vinculos.aula` | `null` | *"Nenhuma aula referencia o LAB · 01; ele vive no aparato § Lab."* |
| `o_que_pergunta.pergunta_da_fonte` | `null` | A pergunta do laboratório, se houver, é camada Alexandria |
| procedência dos coeficientes | — | *"A fonte não cita procedência para tarifa, demanda, fator de potência nem percentual de ponta"* |

**Isto não é uma lista de tarefas.** É o limite da fonte. Um passo a passo ou um entregável para o LAB·01 é
**redação nova**, cai em P3/P11, e é o Founder quem assina. O que **pode** ser feito sem sair da fonte é o ato de
U27: a própria fonte manda *"mantendo o mesmo consumo total"* — o ato é manter o kWh e encontrar de quanto a conta
pode divergir. A meta sai da mecânica, não de texto inventado.

**A divergência que travava o laboratório está resolvida.** `DECIDIR.md:81` (D05): markup estático R$ 1.800 /
R$ 67.425 × script R$ 3.200 / R$ 68.825 → **vence o script**, porque a fonte resolve sozinha
(`(0,92 − 0,84) × 100.000 × 0,4 = 3.200`). O produto já calcula assim. Falta propagar a decisão para
`instrumentos.json`, onde `previsao.bloqueio` ainda diz `"reconciliacao-pendente"`.

---

## 5. Os controles — o desenho da casa, por tipo de entrada

A rodada passada foi reprovada porque a prancha do Laboratório eram **seis deslizadores de trilho chapado com botão
circular do sistema operacional**, mais cinco campos retangulares com fundo próprio. O diagnóstico do Craft foi
literal: *"é o mesmo erro da r07: corrigir por superfície e não por sistema"*.

**As duas regras de sistema que quebraram juntas ali:**

1. **Nenhuma caixa default.** Retângulo fechado por fio nos quatro lados não é campo. Profundidade só por **fio de
   1px** ou troca de superfície (S2). Gate mecânico: `alexandria-no-default-control-box` (P1).
2. **Nenhum círculo de formulário.** Disco, anel, botão redondo de deslizador (S2: raio 0, exceto círculo pleno;
   zero sombra, gradiente, vidro ou brilho). Gates mecânicos: `alexandria-no-form-circle` (P1) e
   `alexandria-no-native-range` (**P0**) — o range nativo entrega o botão ao agente de usuário, e aí *"a
   materialidade de S2 deixa literalmente de ser nossa"*.

**O desenho da casa já existe e está construído**, em
`src/components/alexandria/viewer/ControlesDeInstrumento.tsx`:

| Tipo de entrada | Controle da casa | Onde | O que é |
|---|---|---|---|
| **Valor contínuo** (deslizar numa faixa) | **RÉGUA GRADUADA** | `ControlesDeInstrumento.tsx:158` | Escala gravada — traço maior a cada divisão inteira, traço menor entre elas — com um **cursor de fio e índice em losango** correndo sobre ela. É o mesmo losango que marca estação na carta: o cursor é a posição, na mesma língua. A graduação é escolhida pela **largura medida** (`graduacaoPara`, `:80`), não fixada. O alvo de S7 é o corpo inteiro da régua: 28 px em mesa, **46 px a 390** (`:57-61`). Teclado: setas, Home/End, PageUp/PageDown (`:220`) |
| **Escolha entre estados nomeados** | **ESCALA DE POSIÇÕES** | `:398` | As opções são posições gravadas na mesma régua, com o mesmo índice em losango. **Nenhum `<select>` nativo**, que desenha a seta e o realce do sistema operacional |
| **Número digitado** | **ASSENTO DE VALOR** | `:319` | O número se assenta sobre um **fio de 1px com a largura do próprio número**. Sem caixa, sem fundo, sem moldura — o papel passa por baixo, como debaixo de toda a folha |
| **Comando** | **MARCA DE AÇÃO** | `:521` | Cartela entalhada com chanfro (`Chanfro`, `:565`) — a mesma peça terminal da Retomada. Nunca retângulo com fio nos quatro lados |

**Duas regras valem para os quatro.** (a) Cada peça carrega rótulo, unidade e valor legíveis (≥ 11 px), opera por
teclado com a semântica ARIA do controle que ela é, e tem alvo ≥ 24×24 px (≥ 44×44 a 390) — S7. (b) **Terracota não
entra no controle.** Ela é pontuação rara da casa; seis trilhos terracota numa prancha eram o oposto disso. A régua
inteira é tinta e fio, e a cor volta a significar no total.

**O foco tem uma armadilha registrada (lição L12 do `SISTEMA.md`).** `input`, `select` e `textarea` são *replaced
elements* e **não renderizam `::after`** — a marca de canto da casa é um pseudo-elemento, e por isso o campo de
previsão recebia foco de teclado sem marca nenhuma, a 1440 e a 390. A marca passou para o **hospedeiro**, por
`:has(> input:focus-visible)` em `CSS_CHROME`. Quem escrever um controle novo herda isso sem precisar saber.

### Qual controle cada entrada do M01 pede

| Instrumento | Entradas | Controle |
|---|---|---|
| INST·01 | 2 números (kW, h) | 2 assentos de valor |
| INST·02 | 3 números, todos vazios no início | 3 assentos de valor |
| INST·03 | 2 faixas (corrente, resistência) | 2 réguas graduadas |
| INST·04 | 3 números | 3 assentos de valor |
| INST·05 | 2 faixas (kW, kVAr) | 2 réguas graduadas |
| INST·06 | 3 números na fonte | 3 assentos **+** 3 réguas de mesma faixa (`SISTEMA.md` §3.1) — hoje só réguas, ver **U17** |
| LAB·01 | 2 números comuns + 6 faixas | 2 assentos + **6 réguas** — eram exatamente os seis deslizadores reprovados |

O M01 **não tem nenhum `select`** (`InstrumentPanel.tsx:81`). A escala de posições existe para o M02, que tem seis.

**O estado do gate hoje, medido.** `alexandria-no-native-range` tinha 1 achado P0 em `InstrumentPanel.tsx:584`,
*"exatamente o da prancha do Laboratório"*. `grep 'type="range"' src/components/alexandria/` devolve hoje **zero
ocorrências em código** — as duas únicas linhas que casam são comentários que contam a história (`:5` e `:582`). O
defeito da r09 está fechado. **O risco novo é U07**: existem **duas** réguas graduadas na árvore
(`ControlesDeInstrumento.tsx:158` e `tronco.tsx:1080`), e foi assim que a caixa default voltou numa superfície nova.

---

## 6. Ordem de porte e o custo de cada forma prometida

### 6.1 As formas prometidas do M01

| Instrumento | Promete forma? | Estado C5 | O que desenhar | Família | Custo da figura |
|---|---|---|---|---|---|
| `m01-inst-06` | **não** | sem promessa de forma | — (a proposta da camada Alexandria, marca móvel sobre a `cf-chart`, **já está feita**) | — | **P**, gasto |
| `m01-lab-01` | **sim** | **promessa sem desenho** | Duas barras empilhadas lado a lado, mesma escala vertical, quatro segmentos nomeados pela fonte, total rotulado no topo; eixo y em R$/mês desde zero | **F6 · pilha ordenada e barra composta** (16 instrumentos no currículo) | **M** |
| `m01-inst-01` … `m01-inst-05` | **indeterminável** | sem camada fonte (D18) | Nada é exigível pela fonte. Exigível é o que o texto da própria prancha promete na tela: U08 (dois cenários) e U11 (a curva) | — | U08 **P** · U11 **M** |

O M01 contribui com **uma** das 61 promessas sem desenho do currículo, e abre a família F6 — que é o argumento para
fazer a figura do LAB·01 bem: o custo se amortiza em outros 15 instrumentos.

### 6.2 A ordem

**Onda 0 — decisão, sem builder.** Não bloqueia o resto do porte.

- **R1 · D18** — re-extrair os instrumentos do M01 para `instrumentos.json`. Destrava a coluna "forma prometida" de
  cinco dos sete e fecha a aritmética dos 165 do bar.
- **R2 · QA-FCap-01 (P20)** — as faixas de FCap conflitantes. Enquanto não houver decisão, **U18** é reversão, não
  ajuste: o produto já resolveu a divergência por conta própria.
- **D05 — já decidida.** Só falta propagar: tirar `previsao.bloqueio` do `m01-lab-01`.

**Onda 1 — sistema.** Sete unidades, e cada uma acerta seis pranchas de uma vez. Nesta ordem, porque cada uma
depende da anterior: **U07** (uma régua só) → **U05** (ordem da prancha) → **U01** (pergunta) → **U04** (fonte) →
**U02** (previsão + quadro) → **U03** (autoavaliação) → **U06** (posição na prosa).

**Onda 2 — os gates quebrados, do mais caro ao mais barato.** Todas **P**, todas isoladas:
**U14** (semáforo de cor — hard gate de S2) → **U18** (texto de leitura reescrito) → **U15** (o ângulo que mente) →
**U12** (dois textos concorrentes) → **U13** (`|| 1`) → **U16** (o "0,92" arredondado) → **U10** ("exponencial") →
**U17** (faixas inventadas) → **U22**, **U23**, **U24** (o laboratório sem enunciado, sem instrução, sem nome de
coluna) → **U30** (as duas faixas do gêmeo) → **U26** (duas terracotas) → **U29** (ficha dos coeficientes) →
**U19**, **U20**, **U21** (as três linhas abertas do INST·06).

**Onda 3 — as figuras.** **U25** (LAB·01, M, abre a família F6) → **U08** (INST·01, P) → **U11** (INST·03, M —
**depende de R1**).

**Onda 4 — fechamento.** **U27** (o laboratório termina em alguma coisa) → **U28** (a previsão do LAB) → revisão do
conjunto contra PR-1…PR-8 do `SISTEMA.md`.

---

## 7. Pesquisa — o que não é unidade de trabalho

Nenhuma destas linhas se verifica no render. São decisão, extração ou content QA.

| # | O que é | De quem é | Por que trava |
|---|---|---|---|
| **R1** | **D18** — o M01 é o único módulo sem `instrumentos.json`. INST·01–05 saem com título nulo, entradas vazias e ausência declarada em todos os campos | extração | Sem ela, "o instrumento desenha a forma que o nome promete" não é uma pergunta respondível para cinco dos sete. E os "165 instrumentos" do bar fecham por aritmética (158 + 7), não por medição |
| **R2** | **QA-FCap-01 (P20)** — as faixas de fator de capacidade conflitam entre o script do INST·06, a figura `cf-chart` e o § Lex (solar ~20–28% na figura × corte em 0,25 no script; carvão 55–75% × ≥0,85). Três leituras do mesmo número, sem precedência | Founder | A extração é explícita: *"Não proponho número."* O produto **já escolheu** uma (limiar 45%, `AulaM01A08.tsx:944`) — U18 é a reversão dessa escolha até haver decisão |
| **R3** | **Q08 do `DECIDIR.md`** — o código carrega rótulos que a fonte não tem: os rótulos compostos do LAB·01 ("Fábrica A · Demanda máxima"), `points: 1` em todo exercício, "Veredito"/"Seleção" como rótulo de saída. 23 pontos | Founder | U24 é a fatia do LAB·01 dessa decisão. O resto é maior que os instrumentos |
| **R4** | **QA-M01-A07 [C]** — a 7.3 diz *"FP 0,85 → os outros 15% são reativos"*, e o triângulo do INST·05 na mesma aula mostra ≈0,53. A refutação sai da fórmula da própria aula, mas a frase substituta é **texto novo** (P11) | Founder assina a redação | O content QA vem **antes** de pôr o triângulo vivo ao lado do parágrafo. Hoje os dois já convivem |
| **R5** | **P24 / D09** — "GridAlpha" e "Trava 4 do War Room" na prosa que cerca INST·04, INST·05 e o § Caso; a fonte diz "Trava 4" três vezes e "Trava 3" uma | editorial | Troca de marca, registrada. Não é dos instrumentos, mas está na mesma tela que eles |
| **R6** | **Tolerância** — nenhum dos sete declara, e o M01 não entra nos cinco pedidos de revisão técnica | Founder, se quiser abrir | Confirmar que o M01 fica **sem veredito dentro/fora**, com a escala de C7 no lugar. É o que P6 já manda; falta a decisão ser explícita, porque o M01 é a régua dos outros dezesseis |
| **R7** | **`passos` e `entregavel` do LAB·01 são `null`** — ausência declarada | Founder, se quiser um entregável | Escrever passos ou entregável é redação nova (P3/P11) e não pode ser atribuído à fonte. U27 contorna usando o ato que a própria fonte enuncia ("mantendo o mesmo consumo total") |
| **R8** | **A nota da A08 e a figura `cf-chart`** — o ramo FC ≥ 0,15 do script manda *"Compare com FCs típicos abaixo"*, e o produto cumpriu pondo a marca do learner sobre a figura. Mas o texto do ramo e os rótulos da figura discordam entre si (é R2 no nível da frase, D10) | Founder | Sai junto com R2 |

---

## 8. Posse

Escrito só em `docs/alexandria-v2/m01/instrumentos.md`. Não foram tocados `src/`, `public/`, `tools/`, `app/`,
`index.html`, git, nem a porta 5311. Todas as referências a arquivo e linha foram lidas nesta sessão, na árvore como
ela está — e há um builder trabalhando em `src/` agora, então as linhas envelhecem.
