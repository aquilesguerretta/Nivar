# M01 — as nove aulas, unidade por unidade

> **Para quê.** O Founder mandou fechar o **Módulo 01 inteiro em qualidade final** — aulas, instrumentos, interações
> e animações — para avaliar e então dar a régua do resto da Alexandria. Este documento é o inventário de trabalho
> das **nove aulas** (A01–A09). Cada linha das tabelas é uma unidade **verificável no render**: ou ela aparece na
> tela e pode ser reprovada, ou ela não é unidade de trabalho e foi para a §5 (Pesquisa).
>
> **Nada foi construído nesta rodada.** Nenhum arquivo de `src/`, `public/`, `tools/` ou `app/` foi tocado.
>
> **Data:** 2026-09-21. **Aviso de posse:** há um builder reescrevendo `src/` agora. A coluna "o que o produto tem
> hoje" é um retrato datado, medido por leitura de arquivo, não um contrato. Reconferir antes de agir.

---

## 0. De onde cada coisa veio

| Camada | Arquivo | O que dá |
|---|---|---|
| **Fonte (literal)** | `docs/alexandria-v2/extraction/m01/modulo.json` | § MAP (9 aulas × tema × pergunta), roteiro de 19 seções, 7 capacidades, 3 critérios, LAB·01, voz, Tradutor, 14 divergências |
| **Fonte (literal)** | `docs/alexandria-v2/extraction/m01/aparato.json` | Caso, quiz (10×4), checklist (16), índice dos 8 exercícios, 8 referências, **38 termos** do § Lex |
| **Fonte (literal)** | `docs/alexandria-v2/extraction/m01/aula-08.json` | **A única aula extraída inteira.** A08 (L2006–L2096), INST·06, figura `cf-chart`, Ex·06 |
| Camada Alexandria | `docs/alexandria-v2/estudos/aulas/m01.json` + `SISTEMA.md` + `mapa-aulas.json` | Arquétipo, mecanismo central, abertura C3, ato C9, visualização C6, instrumento C5, checagem C7, recuperação C10, mídia, 390 px, ambição — aula a aula |
| Instrumentos | `docs/alexandria-v2/extraction/instrumentos/instrumentos.json` | 7 registros M01 (INST·01–06 + LAB·01). **Só INST·06 e LAB·01 têm `fonte_extraida: true`** |
| Léxico | `docs/alexandria-v2/extraction/glossario/glossario.json` | 38 verbetes `m01-lex-01..38`, com `ancora.aula: "não declarado"` nos 38 |
| Mídia | `docs/alexandria-v2/media-lab/aulas/_publicar/manifesto.json` | 11 assets M01, todos já publicados em `public/alexandria/v2/aulas/` |
| Divergências | `docs/alexandria-v2/extraction/reconciliacao/DECIDIR.md` | 30 divergências do M01; QA-M01-A04, QA-M01-A06, QA-M01-A07, QA-FCap-01 |
| Régua | `docs/alexandria-v2/bar.md` §4 (C1–C10), S1–S7, Regra-mãe | Gates citados nas tabelas |

**Tamanho.** `P` = até meia jornada, dentro de peça já existente. `M` = uma a duas jornadas, peça nova mas com
primitiva pronta no tronco. `G` = tronco de arquétipo novo, componente novo do catálogo, ou figura sem precedente.

---

## 1. O quadro das nove

| Aula | Título (fonte) | Arquétipo | Tronco existe? | Ato principal (C9) | Previsão (C3) | Instrumento | Exerc. | Imagens publicadas | Estado hoje |
|---|---|---|---|---|---|---|---|---|---|
| **A01** | Energia é volume. Potência é velocidade. | **PRANCHA** | **sim** | identificar o erro | numérica | INST·01 (fonte não extraída) | Ex·01 | 2 | zero |
| **A02** | Sete símbolos. Toda a linguagem. | **SISTEMA** (2º: MESA) | **não** | classificar | não | INST·02 (fonte não extraída) | Ex·02 | 1 | zero |
| **A03** | A rede tem um batimento cardíaco. Ele se chama 60 Hz. | **SISTEMA** | **não** | prever (direção) + classificar | categórica | nenhum na fonte | 0 | 2 | zero |
| **A04** | Por que perdas crescem ao quadrado. | **PRANCHA** | **sim** | prever → manipular até meta | numérica | INST·03 (fonte não extraída) | Ex·03 | 1 | zero |
| **A05** | Por que uma fábrica paga por capacidade reservada. | **PRANCHA** (2º: DOSSIE) | **sim** | decidir com justificativa | numérica | INST·04 (fonte não extraída) | Ex·04, Ex·07 | 1 | zero |
| **A06** | A tensão de fornecimento define a tarifa que você paga. | **CARTA** | **não** | localizar no mapa | não | nenhum na fonte | 0 | 1 (reuso de A04) | zero |
| **A07** | Existe energia que ocupa a rede e não vira produção. | **PRANCHA** (2º: DOSSIE) | **sim** | manipular até uma meta | numérica | INST·05 (fonte não extraída) | Ex·05 | 2 | zero |
| **A08** | 100 MW solar ≠ 100 MW térmica. | **PRANCHA** | **sim** | prever → calcular → comparar | numérica | **INST·06 (extraído)** | Ex·06 | 2 | **construída** |
| **A09** | Energia ruim pode custar mais do que energia cara. | **MESA** | **sim** | classificar (sintoma → fenômeno) | não | nenhum na fonte | 0 | 0 (decisão fechada) | zero |

**Arquétipos que o M01 pede:** PRANCHA ×5, SISTEMA ×2, MESA ×1, CARTA ×1 (`mapa-aulas.json` → `contagens.por_modulo.M01`).
Dos quatro troncos construídos nesta wave (`src/components/alexandria/aula/arquetipos.ts:22-34` — PRANCHA, SERIE,
MESA, LUPA), **dois servem ao M01**: PRANCHA cobre A01/A04/A05/A07/A08 e MESA cobre A09. **SISTEMA e CARTA não
existem** — são dois troncos novos, para três aulas (A02, A03, A06).

**Fecho por "explique com suas palavras":** **zero das nove**. Os nove atos principais saem do catálogo do bar §4 C9
(identificar o erro ×1, classificar ×3, prever→manipular/calcular ×3, decidir com justificativa ×1, localizar no
mapa ×1). O bar proíbe que a maioria das aulas de um módulo feche em texto aberto; o M01 fecha **nenhuma**. Texto
aberto aparece só como ato **secundário** (Ex·07 na A05, e o Ex·08 de Síntese, que é do módulo e não de aula).

**O que o produto mostra hoje nas oito aulas a zero.** `src/pages/alexandria/AlexandriaRouter.tsx:263` procura o
componente do arquétipo; só `modulo-01:8` responde. As outras oito caem na rota legada a partir da linha 300:
`AulaViewer.tsx:123` imprime a apostila inteira (`MODULO_01_CORPO`), depois `:126` o instrumento, depois `:129` o
`ExercicioBlock` com **"Revelar gabarito"**, depois `:134` a linha de vídeo. Isto é, nas seis aulas com instrumento,
o instrumento é apêndice (**Regra-mãe 1 e C5 reprovam**) e o gabarito é revelação direta (**C7 reprova**).

---

## 2. A fonte das oito aulas não existe ainda — e isso governa tudo

Este é o bloqueio-mãe e precisa estar no topo, não numa nota de rodapé.

A pasta declarada fonte única (`extraction/m01/`) tem **três grupos**: `modulo`, `aparato` e `aula-08`. O grupo
`modulo` guarda das aulas apenas **marcador, rótulo, h2 e linha** (`modulo.json` → `roteiro[]`, 19 seções). **O corpo
verbatim de A01–A07 e A09 não foi extraído.** O README da extração diz isso com todas as letras: *"m01 tem extração
verificada da aula 08"*.

O que existe do corpo dessas oito aulas é o **código** (`src/lib/data/alexandria-modulo-01-content.ts`,
`MODULO_01_CORPO`, linhas 175–332), e o achado **T01** do estudo mede o que esse porte perdeu: as 6 linhas `desc` de
fórmula (hoje `desc: null` nas nove aulas), as duas fórmulas da 5.3, a fórmula da 8.2, as três listas `<ul>` (4.2,
6.3, 9.4) — que deixam parágrafos terminando em "Veja:", "Por isso:", "Logo:" e "prejuízo direto:" sem continuação —,
os parágrafos 2 e 3 do callout "Erro de fluência" da A01, os três painéis de "O conceito em três níveis" (1.6, sobrou
só o rótulo), a figura AC×DC da A03 e a figura `cf-chart` da A08. Os callouts viraram par `nota(rótulo)` + parágrafo
solto. Há `</span>` órfãos no parágrafo 1.4 (visível em `alexandria-modulo-01-content.ts:190`).

**Consequência.** Nenhum layout de A01–A07 ou A09 pode ser julgado sobre o corpo atual, porque o corpo atual não é a
fonte. A unidade **M-01** da §4 é pré-requisito das oito.

A mesma falta atinge os instrumentos: em `instrumentos.json`, **INST·01, 02, 03, 04 e 05 têm `fonte_extraida: false`**,
com entradas `[]`, saídas `[]` e `cenario_padrao: null`. Só INST·06 e o LAB·01 estão extraídos. Ou seja: hoje não há
de onde tirar rótulo, unidade, faixa, passo, casas decimais nem ramo de leitura para cinco dos seis instrumentos do
módulo. Os números que aparecem nas tabelas abaixo (100 A / 0,5 Ω / 5.000 W; 144.000 kWh / 720 h / 800 kW;
800 kW / 480 kVAr) vêm do estudo `estudos/aulas/m01.json`, que os leu no HTML com a linha de origem — servem para
desenhar o ato, **não** para escrever o instrumento sem re-extração.

---

## 3. Aula por aula

### A01 · Energia é volume. Potência é velocidade.
**§ MAP L1339 — "Por que kW e kWh não são a mesma coisa?"** · fonte L1358–L1480 · 21 blocos no código
(`alexandria-modulo-01-content.ts:176-197`)

**1. Arquétipo — PRANCHA (Prancha de mecanismo).** `mapa-aulas.json` a classifica assim e `SISTEMA.md` §1 explica por
quê: a pergunta 8 da régua ("existe uma relação quantitativa operável e o ato é prever, manipular até uma meta ou
calcular?") responde sim antes de qualquer outra — a relação é `E = P × t`, operada no INST·01. **Tronco construído**
(`arquetipos.ts:22`), o mesmo da A08.

**2. O ato autêntico (C9) — identificar o erro.** As duas frases do callout "Erro de fluência" (L1453–L1456):
*"Essa usina gerou 100 MW no mês."* e *"A empresa consumiu 500 kW no mês."* Para cada uma: qual unidade está errada e
como a frase fica correta. A referência é literal da fonte ("capacidade de 100 MW" ou "gerou 30.000 MWh no mês";
"demandou 500 kW em algum momento e consumiu X kWh") e fica velada até o registro. Exercita exatamente o mecanismo
central: separar grandeza instantânea de grandeza acumulada.
**Previsão (C3) — útil, numérica.** *"Duas instalações consomem os mesmos 50 kWh. Uma liga 50 kW por 1 hora; a outra,
1 kW por 50 horas. Qual exige mais da rede no pico?"* Valores do cenário-padrão: **50 kW × 1 h** e **1 kW × 50 h**
(nota do INST·01, L1445). Resposta: A — 50 kW de pico contra 1 kW; a energia é igual (50 kWh, derivado).

**3. Instrumento e exercícios.** **INST·01** (Calculadora · kWh = kW × h), invocado no fim da 1.4, no parágrafo que
termina em *"Pratique abaixo."* — bloco 14 do corpo, fonte L1424–L1448. Duas colunas, no mesmo cenário da previsão.
**1 exercício**: Ex·01 (`m01-ex-01`, tag "Ex · 01 · Aula 01", L2391). Renderizado hoje, sim — mas depois da apostila
inteira e com "Revelar gabarito" (`ExercicioBlock.tsx:4`).

**4. Mídia.** 2 publicadas: `m01-a01-01` (hidrelétrica em corte, explicação, bloco 4) e `m01-a01-02` (torneira e caixa
d'água, explicação, bloco 9). Ambas com quatro arquivos em `public/alexandria/v2/aulas/` (560/1000, 1× e 2×). **Não
falta imagem**: o manifesto planeja 2 e publicou 2.

**5. Termos do léxico (C4).** Energia, Potência, kW, kWh, Watt (W), Eficiência — seis dos 38. Nenhum tem âncora de
aula declarada na fonte (`glossario.json` → `ancoraDeAula.declaradas: 0`), então a atribuição é derivação nossa.

| # | O que a fonte tem | O que o produto tem hoje | O que falta | Gate | Tam. |
|---|---|---|---|---|---|
| A01-1 | L1358–L1480: 6 subseções, 2 tabelas, 1 fórmula com `desc`, callout de 3 parágrafos, 3 painéis de "três níveis" | `alexandria-modulo-01-content.ts:176-197`: 21 blocos, `desc: null`, callout com 1 de 3 parágrafos, 3 painéis ausentes, `</span>` órfãos em `:190` | Re-extração determinística verbatim da aula | C4, S4 | **G** |
| A01-2 | — | Nenhum componente: `arquetipos.ts` não tem `modulo-01:1` | `AulaM01A01.tsx` sobre a PRANCHA + registro em `arquetipos.ts` | Regra-mãe, C3–C10 | **M** |
| A01-3 | Pergunta § MAP L1339 + nota do INST·01 (50 kW×1 h; 1 kW×50 h) | Nada: `AulaViewer.tsx:123` abre pela apostila | Abertura com pergunta + caixa de previsão numérica registrada antes da 1.4 | C3 | **P** |
| A01-4 | Callout "Erro de fluência" L1453–L1456, com as correções literais | Parágrafo solto sem o rótulo e sem 2 dos 3 parágrafos | Ato "identificar o erro": duas frases, campo de correção, referência velada até o registro | **C9**, C7 | **M** |
| A01-5 | INST·01 após o bloco 14 ("Pratique abaixo.") | `alexandria-modulo-01-content.ts:363` liga `inst-01`; `AulaViewer.tsx:126` o imprime **depois da apostila inteira** | Instrumento no ponto da prosa, 2 colunas (A e B), quadro previsto × calculado fixo | **C5**, Regra-mãe 1 | **M** |
| A01-6 | `E = P × t` (fórmula 1.4) e a escada de escalas (tabela 1.3) | Tabela estática; nenhuma figura | **V-RET**: plano P×t com dois retângulos de mesma área e rótulo "mesmos 50 kWh"; **V-ESC**: escada W→GW / kWh→TWh | C6 | **G** |
| A01-7 | Ex·01 (`m01-ex-01`, L2391) com gabarito | `ExercicioBlock` com "Revelar gabarito" | Campo numérico + escolha fechada (kW / kWh / ambos), registro antes da referência | **C7** | **P** |
| A01-8 | — (as gravuras são da casa) | 8 arquivos webp publicados; nenhum componente os usa | Colocar `m01-a01-01` no bloco 4 e `m01-a01-02` no bloco 9, com legenda, crédito e classe à vista | C4, S4 | **P** |
| A01-9 | 38 verbetes do § Lex (L2527+) | `GlossarioView.tsx` existe; **nenhuma aula usa `<Termo>`** (0 ocorrências em todos os `Aula*.tsx`) | Ligar Energia, Potência, kW, kWh, Watt, Eficiência via `tronco.tsx:267` (prévia 1 ação → verbete 2 ações) | **C4**, D6 | **P** |
| A01-10 | § 00: "Duas empresas … mesmos 100.000 kWh … contas diferentes" | Nenhuma recuperação; próxima aula fixa | Primeira aula: gancho da tese sem resposta; próximo passo condicional para A02, e "Serve a" = m01-cap-01, m01-cap-02, checklist 01 e 02 | **C10**, C9 | **P** |

---

### A02 · Sete símbolos. Toda a linguagem.
**§ MAP L1340 — "O que volt, ampere, watt, kVA e kVAr realmente medem?"** · fonte L1484–L1581 · 17 blocos
(`alexandria-modulo-01-content.ts:199-216`)

**1. Arquétipo — SISTEMA (Diagrama de sistema), secundário MESA.** A régua do `SISTEMA.md` §1 chega à pergunta 9 —
"o mecanismo é uma estrutura de partes (cadeia, camadas, balança) que se entende desenhada?" — porque nenhuma das
oito anteriores passou: não há decisão sob incerteza, não há artefato a anotar, não há número publicado a qualificar,
não há forma no tempo, e o ato principal é classificar, não calcular. A estrutura é a cadeia rígida
**V × A → W → kW → kWh × tarifa = R$**, com o ramo kVA/kVAr. **Tronco NÃO construído** — SISTEMA é um dos seis que
faltam.

**2. O ato autêntico (C9) — classificar.** Pôr cada unidade na grandeza que mede: V, A, W/kW, kWh, kVAr, kVA, Ω →
tensão · corrente · potência ativa · energia · potência reativa · potência aparente · resistência. Os pares são da
fonte (2.1–2.5 e tabela 2.5). **Previsão — não útil**, e o estudo diz por quê: os cálculos (220 × 20) são diretos; o
erro útil aqui é de classificação, não de estimativa. Cabe no catálogo do bar como "classificar ou ordenar", sem
fallback de texto aberto.

**3. Instrumento e exercícios.** **INST·02** (Calculadora · Lei de Ohm), entre o bloco 12 (parágrafo *"Resistência não
é maldade física…"*) e o título 2.5 — fonte L1533–L1562. A instrução literal *"Preencha dois campos. O terceiro é
calculado."* **é a pergunta do instrumento e foi perdida no porte** (T01). Estados reais do script:
"Aguardando 2 valores…", resultado, "Coerente", "Inconsistente — limpe um campo". **1 exercício**: Ex·02
(`m01-ex-02`, L2400), renderizado com "Revelar gabarito".

**4. Mídia.** 1 publicada: `m01-a02-01` (pilha de Volta, *Philosophical Transactions* 1800, Wellcome CC BY 4.0),
documental, bloco 1, slots 560/780. Planejadas 1, publicadas 1 — **não falta**. Ressalva registrada no estudo: a prosa
da aula não cita Volta; a legenda não pode acrescentar história sem revisão (P3).

**5. Termos do léxico (C4).** Volt (V), Ampere (A), Watt (W), kW, kWh, kVA, kVAr, Lei de Ohm, Potência, Tensão — dez
dos 38. É a aula com maior densidade de léxico do módulo, e a que mais depende do C4 para não virar lista de siglas.

| # | O que a fonte tem | O que o produto tem hoje | O que falta | Gate | Tam. |
|---|---|---|---|---|---|
| A02-1 | L1484–L1581: 5 subseções, régua de tensão (2.1), fórmula 2.3 com `desc`, fechamento 2.5 (L1578) | `:199-216`, 17 blocos, `desc: null` na fórmula 2.3 | Re-extração verbatim | C4, S4 | **G** |
| A02-2 | — | Arquétipo SISTEMA inexistente em `arquetipos.ts` | **Tronco SISTEMA** (gramática de diagrama de partes) + `AulaM01A02.tsx` | Regra-mãe | **G** |
| A02-3 | Pergunta § MAP L1340 + fechamento 2.5 | Apostila direta | Abertura com a pergunta; **sem** caixa de previsão (declarar por que não há) | C3 | **P** |
| A02-4 | Pares 2.1–2.5 e tabela 2.5 | Nada | Ato de classificar 7 unidades → 7 grandezas, teclado operável, pares revelados só após registro | **C9**, C7 | **M** |
| A02-5 | INST·02 após o bloco 12; instrução "Preencha dois campos. O terceiro é calculado."; 4 estados do script | `:390` liga `inst-02`; instrução perdida; instrumento depois da apostila | Instrumento no ponto, com a instrução restaurada como pergunta e os 4 estados literais | **C5**, Regra-mãe 1 | **M** |
| A02-6 | Cadeia V·A→W→kW→kWh→R$ (implícita na ordem 2.1–2.5) + tabela 2.1 de tensões | Tabelas estáticas | **V-CADEIA**: espinha com estações que acendem por seção e recebem os valores do INST·02 (220 V × 10 A → 2.200 W → 2,2 kW → 11 kWh em 5 h); **V-ESC**: régua log de 127 V a 230 kV+ | C6 | **G** |
| A02-7 | Ex·02 (`m01-ex-02`, L2400): 220 V, 20 A → kW; 6 h → kWh | "Revelar gabarito" | Dois campos numéricos; a cadeia só se preenche depois do registro | **C7** | **P** |
| A02-8 | — | 4 arquivos webp de `m01-a02-01` publicados, sem uso | Colocação no bloco 1 com crédito Wellcome CC BY 4.0 e classe "documental" | C4, S4 | **P** |
| A02-9 | 10 verbetes (Volt, Ampere, Watt, kW, kWh, kVA, kVAr, Lei de Ohm, Potência, Tensão) | Nenhuma ligação | `<Termo>` nos 10, no ponto de uso | **C4** | **P** |
| A02-10 | — | Próxima fixa | Recuperação com o Ex·01 da A01 ("15 kW por 12 h: muda kW, kWh ou ambos?") sem mostrar a resposta antiga; "Serve a" = m01-cap-02, m01-cap-05 (introdução), checklist 06 | **C10** | **P** |

---

### A03 · A rede tem um batimento cardíaco. Ele se chama 60 Hz.
**§ MAP L1341 — "Por que a rede oscila 60 vezes por segundo, e por que isso importa?"** · fonte L1585–L1647 ·
16 blocos (`:218-234`)

**1. Arquétipo — SISTEMA.** Mesma rota da régua que a A02: o mecanismo é uma **balança** (geração ≈ consumo em tempo
real) cujo desequilíbrio aparece como desvio de frequência. É estrutura de partes com conservação, que só se entende
desenhada. `mapa-aulas.json` marca esta aula como **`exemplo_do_arquetipo: true`** — é a aula-protótipo do SISTEMA em
todo o currículo, o que aumenta o valor de construí-la cedo. **Tronco NÃO construído.**

**2. O ato autêntico (C9) — prever direção + classificar.** Três situações no palco (consumo sobe; geração sobe; ambos
sobem juntos): para cada uma, a frequência cai, sobe ou fica? Depois: classificar baterias, painel solar antes do
inversor, eletrônica interna, rede pública e elo HVDC em DC ou AC. As relações e os itens são da fonte (3.1–3.4).
**Previsão (C3) — útil, categórica.** *"Consumo sobe, geração fica igual: a frequência cai · sobe · não muda?"*
Valor do cenário: **60 Hz nominal**. Resposta: **cai** — literal em 3.4, L1636. A intuição comum é que "a rede tem
folga"; a fonte afirma que não há buffer físico.

**3. Instrumento e exercícios.** **Nenhum instrumento na fonte** — a A03 é uma das 11 aulas do currículo assim
(`mapa-aulas.json` → `sem_instrumento_na_fonte`). O ato substituto é o **palco de equilíbrio**, camada Alexandria,
derivado das tabelas da própria aula, entrando após o bloco 11 (parágrafo *"Se o consumo aumenta…"*) e antes da nota
gold. Obrigatório o selo **"esquemático"**: o mostrador indica só direção, nunca Hz com casas decimais de desvio.
**Zero exercícios** — a A03 é uma das três aulas do M01 sem exercício na fonte (junto de A06 e A09).

**4. Mídia.** 2 publicadas: `m01-a03-01` (anel de Faraday, Uppenborn 1889, domínio público, bloco 5) e `m01-a03-02`
(frequencímetro de lâminas vibrantes, Metra Blansko, CC BY-SA 4.0, bloco 11). Planejadas 2, publicadas 2 — **não
falta**. Nota do estudo: o medidor de frequência poderia virar o mostrador do palco, mas a preferência é desenho
programático; a foto fica como objeto documental ao lado.

**5. Termos do léxico (C4).** Frequência, Corrente alternada (AC), Corrente contínua (DC), ONS — quatro dos 38.

| # | O que a fonte tem | O que o produto tem hoje | O que falta | Gate | Tam. |
|---|---|---|---|---|---|
| A03-1 | L1585–L1647: 5 subseções + figura DC (linha reta) × AC (senoide) | `:218-234`, 16 blocos; **figura AC×DC não portada** (T01) | Re-extração verbatim, com a figura | C4, C6 | **G** |
| A03-2 | — | SISTEMA inexistente | `AulaM01A03.tsx` sobre o tronco SISTEMA (protótipo do arquétipo) | Regra-mãe | **M** |
| A03-3 | 3.4, L1636 (consumo sobe → frequência cai) | Apostila direta | Abertura + previsão categórica (cai · sobe · não muda), registrada | **C3** | **P** |
| A03-4 | Relações de 3.1–3.4 e os itens DC/AC | Nada | Ato em duas partes: 3 previsões de direção no palco + classificação de 5 itens em DC/AC | **C9** | **M** |
| A03-5 | — (não há instrumento) | `alexandria-modulo-01-content.ts` não liga instrumento à A03 | **Palco de equilíbrio** (camada Alexandria): dois pratos, mostrador só direcional, selo "esquemático", ato opcional de ajustar a geração até "estável" | C5, **S4** | **G** |
| A03-6 | Figura DC × AC da fonte | Ausente | **V-ONDA**: osciloscópio esquemático DC × AC com rótulos diretos | C6 | **M** |
| A03-7 | Nenhum exercício | `ExercicioBlock` vazio | Declarar a ausência em linha de aparato — nunca como caixa tracejada (T22 da varredura) | S4, C7 | **P** |
| A03-8 | — | 8 arquivos webp publicados, sem uso | Colocações nos blocos 5 e 11, com os dois créditos e a ressalva de atribuição do anel | C4, S4 | **P** |
| A03-9 | Frequência, AC, DC, ONS | Nenhuma ligação | `<Termo>` nos 4 | **C4** | **P** |
| A03-10 | 3.5 promete "voltaremos a este ponto" na A09 | Próxima fixa | Recuperação abrindo com a classificação da A02; "Serve a" = checklist 08 e 09 (orais, P14) e m01-cap-06 parcial; **fio de retorno** para a A09, que a fonte promete e não cumpre | **C10** | **P** |

---

### A04 · Por que perdas crescem ao quadrado. E por que isso desenhou toda a rede.
**§ MAP L1342 — "Por que transmissão usa alta tensão? Por que perdas crescem ao quadrado?"** · fonte L1651–L1725 ·
11 blocos (`:236-247`)

**1. Arquétipo — PRANCHA.** Pergunta 8 da régua: relação quantitativa operável (`P = I² × R`) com instrumento de
controles, e o ato é prever e manipular até uma meta. **Tronco construído.**

**2. O ato autêntico (C9) — prever → manipular até uma meta.** Registrar a previsão, mover a corrente para 200 A,
comparar previsto × calculado e depois **encontrar a corrente que dá 9× a perda inicial**. A meta é derivada:
9 × 5.000 W = 45.000 W → **300 A**, dentro da faixa do deslizador (10–500 A, passo 5). Exercita o expoente 2.
**Previsão (C3) — útil, numérica.** *"Um cabo com 0,5 Ω leva 100 A e dissipa 5.000 W. Se a corrente dobrar para
200 A, quanto ele dissipa?"* Valores do cenário-padrão do INST·03 (L1680–L1690): **100 A · 0,5 Ω · 5.000 W**.
Resposta: **20.000 W** (derivado, 200² × 0,5). A intuição linear ("dobra → 10.000 W") é o erro exato que a aula
existe para desfazer.

**3. Instrumento e exercícios.** **INST·03** (Calculadora · Perdas resistivas), após o bloco 3 — o parágrafo que
termina em *"Veja:"* — e antes do título 4.2; fonte L1669–L1695. Saída em W sem casas. A fonte tem campo numérico
**e** deslizador gêmeos com faixas diferentes (Q07 do DECIDIR). **1 exercício**: Ex·03 (`m01-ex-03`, tag "Ex · 03 ·
Aula 04", L2409) — pede justificativa, então é campo curto + referência após o registro.

**4. Mídia.** 1 publicada: `m01-a04-01` (cadeia de tensão da usina à casa, ilustração da casa, explicação, bloco 5).
Planejadas 1, publicadas 1. **Detalhe que muda o plano:** este mesmo asset tem **duas colocações** no manifesto —
`aula-01-04` bloco 5 **e** `aula-01-06` bloco 8. Quem construir a A04 precisa saber que a A06 reusa a mesma gravura,
com legenda própria, para não publicar duas variantes.

**5. Termos do léxico (C4).** Perdas técnicas, Perdas não técnicas, Tensão, Corrente (Ampere), TUSD — cinco dos 38.
A quebra de ordem alfabética do § Lex ("Perdas técnicas" antes de "Perdas não técnicas") é da fonte e está registrada.

| # | O que a fonte tem | O que o produto tem hoje | O que falta | Gate | Tam. |
|---|---|---|---|---|---|
| A04-1 | L1651–L1725: 3 subseções, fórmula com `desc`, **lista `<ul>` da 4.2** (níveis de tensão), tabela 4.3 | `:236-247`, 11 blocos; **a lista da 4.2 sumiu**, deixando o parágrafo terminar em "Por isso:" | Re-extração verbatim, com a lista | C4, S4 | **G** |
| A04-2 | — | Sem componente | `AulaM01A04.tsx` sobre a PRANCHA | Regra-mãe | **M** |
| A04-3 | Padrão do INST·03 (100 A, 0,5 Ω, 5.000 W) + 4.1 ("se a corrente dobra, as perdas quadruplicam") | Apostila direta | Abertura + previsão numérica em W, com regra de entrada por arredondamento técnico (P19) — **nunca** tolerância atribuída à fonte | **C3**, S4 | **P** |
| A04-4 | Faixa do deslizador 10–500 A, passo 5 | Nada | Ato de meta: achar a corrente de 9× a perda (300 A); detecção **sem arredondamento**, estado por palavra | **C9**, S2 | **M** |
| A04-5 | INST·03 após o bloco 3 ("Veja:") | `:438` liga `inst-03`; impresso depois da apostila; código só tem `range` (os gêmeos da fonte se perderam) | Instrumento no ponto, quadro previsto × calculado **fixo enquanto explora** | **C5**, Regra-mãe 1 | **M** |
| A04-6 | Fórmula `P = I² × R`; níveis 230–750 kV, 13,8–138 kV, 127/220 V (lista 4.2) | Nada | **V-XY**: parábola com ponto atual e ponto "corrente dobrada"; **V-ESC**: escada de tensão com perda **relativa** ∝ 1/V² (aritmética, sem fato novo) | C6 | **G** |
| A04-7 | Ex·03 (L2409) + tabela 4.3 (técnicas × não técnicas) | "Revelar gabarito" | Resposta curta antes do gabarito + classificação de 5 itens (furto, aquecimento de cabo, fraude no medidor, perda em transformador, erro de medição) | **C7** | **P** |
| A04-8 | — | 4 arquivos webp publicados, sem uso | Colocação no bloco 5, legenda própria (o mesmo asset volta na A06 com outra legenda) | C4, S4 | **P** |
| A04-9 | Perdas técnicas, Perdas não técnicas, Tensão, Ampere, TUSD | Nenhuma ligação | `<Termo>` nos 5 | **C4** | **P** |
| A04-10 | — | Próxima fixa | Recuperação com o Ex·02 da A02 (220 V × 20 A → kW), que é a mesma `P = V × I` da 4.2; "Serve a" = checklist 06 e 07, m01-cap-06 | **C10** | **P** |

---

### A05 · Por que uma fábrica paga por capacidade reservada.
**§ MAP L1343 — "Por que uma fábrica paga por capacidade reservada, não só por energia?"** · fonte L1729–L1827 ·
15 blocos (`:249-264`)

**1. Arquétipo — PRANCHA, secundário DOSSIE.** `SISTEMA.md` §1 usa esta aula como **exemplo escrito da regra de
desempate**: ela responde sim à pergunta 2 (decisão sob informação incompleta, com "não é possível concluir"
legítimo) e à pergunta 8 (relação operável). Ganha a que define onde fica o instrumento — o instrumento é o palco,
então a aula é PRANCHA, com DOSSIE como fecho. **Tronco construído** (o fecho DOSSIE, não).

**2. O ato autêntico (C9) — decidir com justificativa.** *"Com o FCarga calculado e um único mês de dados: você
recomenda reduzir a demanda contratada? (sim · não · **não é possível concluir**) Justifique em uma frase."* A
resposta de referência é **"não é possível concluir"**, e o critério é da fonte: o gabarito do Ex·04 diz *"não
recomende mudança contratual sem ver 12 meses de histórico"*, o callout da 5.2 manda validar a regra do contrato, e a
tabela 5.4 fala em "investigação operacional necessária". É o ato mais valioso do módulo: treina não prometer
economia sem histórico.
**Previsão (C3) — útil, numérica.** *"Uma empresa consumiu 144.000 kWh num mês de 720 horas e teve pico de 800 kW.
Estime o fator de carga (0 a 1) antes de calcular."* Valores do cenário-padrão: **144.000 kWh · 720 h · 800 kW**.
Resposta: **0,25** (derivado: 200 ÷ 800). Quem olha só o volume tende a achar o uso alto; o número baixo abre a
leitura da tabela 5.4.

**3. Instrumento e exercícios.** **INST·04** (Calculadora · Demanda média e fator de carga), após o bloco 10 e antes
do título 5.4; fonte L1774–L1806. Leitura dinâmica de **4 ramos** no script (L2846–L2849) — no porte virou nota
estática com um ramo só. **Armadilha de C7 desta aula:** o cenário-padrão do INST·04 é **idêntico ao enunciado do
Ex·04**, então abrir o instrumento revela a resposta do exercício. A ordem tem de inverter: **Ex·04 primeiro, depois
o instrumento** (ou o instrumento abre velado). **2 exercícios**: Ex·04 (`m01-ex-04`, L2418) e Ex·07 (`m01-ex-07`,
tag "Ex · 07 · 3 níveis · Aula 05") — a única aula do M01 com dois. O Ex·07 é texto aberto, e por isso entra como
secundário com autoavaliação em três níveis, nunca como fecho.

**4. Mídia.** 1 publicada: `m01-a05-01` (ponte no pico e no vale, explicação, bloco 1 — a analogia da estrada).
Planejadas 1, publicadas 1. O estudo recomendava 0 imagens (a figura programática carrega a aula); o manifesto
publicou 1, que passa no teste de remoção por desenhar a analogia que o gabarito do Ex·04 também usa.
**Lacuna declarada:** medidor de energia / registro de demanda não existe no catálogo — só se a Revisão pedir.

**5. Termos do léxico (C4).** Demanda, Demanda contratada, Fator de carga (FC), Potência, Modalidade tarifária,
Grupo A — seis dos 38. **Aqui mora o P21:** a sigla FC do § Lex designa tanto fator de carga (A05) quanto fator de
capacidade (A08). Na tela: **FCarga** aqui, **FCap** na A08, nome completo na primeira ocorrência de cada aula.

| # | O que a fonte tem | O que o produto tem hoje | O que falta | Gate | Tam. |
|---|---|---|---|---|---|
| A05-1 | L1729–L1827: 4 subseções, **2 fórmulas na 5.3**, tabela 5.2, tabela 5.4 com 4 faixas, callout de ultrapassagem | `:249-264`, 15 blocos; **as 2 fórmulas da 5.3 sumiram** (T01); bloco P7 "Onde isso entra no produto" no fim | Re-extração verbatim; o bloco P7 não aparece, e a aula precisa de outro fechamento | C4, S4, P7 | **G** |
| A05-2 | — | Sem componente | `AulaM01A05.tsx` sobre a PRANCHA + **fecho DOSSIE** | Regra-mãe | **M** |
| A05-3 | Ex·04 e padrão do INST·04 (144.000 kWh; 720 h; 800 kW) + 5.3 | Apostila direta | Abertura + previsão numérica de FCarga (0 a 1) | **C3** | **P** |
| A05-4 | Gabarito do Ex·04 ("12 meses"), callout 5.2, tabela 5.4 | Nada | Ato de decisão com **"não é possível concluir" como opção de primeira classe** + justificativa em uma frase | **C9**, C8 | **M** |
| A05-5 | INST·04 após o bloco 10; 4 ramos de leitura (L2846–L2849) | `:472` liga `inst-04`; impresso depois da apostila; leitura reduzida a um ramo estático; coerção `\|\| 1` faz campo vazio valer 1 | Instrumento no ponto, **velado até o Ex·04 ser registrado**; 4 ramos, só o ativo à vista; nunca mostrar resultado com campo vazio | **C5**, **C7**, Regra-mãe 1 | **G** |
| A05-6 | Demanda média 200 kW sob pico de 800 kW; 4 faixas da tabela 5.4 | Tabela estática | **V-RET** (reuso da A01): retângulo da média sob a linha da máxima, FCarga como razão de alturas; **V-FAIXA**: régua 0–1 com as 4 faixas e o marcador do cálculo | C6 | **M** |
| A05-7 | Ex·04 (L2418) e Ex·07 (3 níveis) com gabaritos | Ambos com "Revelar gabarito" | Ex·04 com dois campos + escolha de faixa **antes** do instrumento; Ex·07 com autoavaliação (atende · atende em parte · não atende) e referência literal só após o envio | **C7** | **M** |
| A05-8 | — | 4 arquivos webp publicados, sem uso | Colocação no bloco 1 | C4 | **P** |
| A05-9 | Demanda, Demanda contratada, Fator de carga (FC), Potência, Modalidade tarifária, Grupo A | Nenhuma ligação; a sigla FC colide com a da A08 | `<Termo>` nos 6, com **FCarga** por extenso na primeira ocorrência (P21) | **C4**, P21 | **P** |
| A05-10 | Tabela 5.4 e callout de ultrapassagem | Próxima fixa | Recuperação com a pergunta da A01 (50 kW×1 h × 1 kW×50 h); próximo passo **condicional**: "não atende" na decisão → "Rever 5.4 e o callout de ultrapassagem"; demais → A06. "Serve a" = m01-cap-03, 04, 07 e checklist 03, 04, 05, 16 | **C10** | **P** |

---

### A06 · A tensão de fornecimento define a tarifa que você paga.
**§ MAP L1344 — "Por que sua tensão de fornecimento define seu grupo tarifário?"** · fonte L1831–L1896 · 14 blocos
(`:266-280`)

**1. Arquétipo — CARTA (Carta de posicionamento).** A régua para na pergunta 7: *"o ato principal é posicionar algo
num espaço com eixos (escada de tensão, plano 2D, mapa, régua de estágio)?"* — sim, e é literalmente a escada de
tensão. Não é MESA porque o ato não é classificar em caixas soltas: é **localizar numa escala contínua** onde a
posição carrega o significado. **Tronco NÃO construído** — CARTA é o terceiro tronco novo que o M01 pede.

**2. O ato autêntico (C9) — localizar no mapa.** Posicionar cinco fornecimentos — **220 V, 13,8 kV, 34,5 kV, 69 kV,
230 kV** — na escada e dizer grupo/subgrupo e se a fatura é monômia (kWh) ou binômia (kWh + kW). As tensões e os
enquadramentos são das tabelas 2.1, 6.1 e 6.2. **Previsão — não útil:** não há resultado numérico a prever; o erro
útil é de enquadramento, e o ato de localizar já o captura. Secundários: ordenar A1 (230 kV) e A4 (13,8 kV) por
tarifa total esperada "em geral", marcando as três razões da lista 6.3; e classificar três cargas em mono, bi ou
trifásico (tabela 6.4).

**3. Instrumento e exercícios.** **Nenhum instrumento na fonte.** O ato substituto é o **mapa de enquadramento**,
camada Alexandria, entrando após o bloco 5 (a tabela 6.2) e antes do parágrafo de prospecção. Mesa estática com
fichas arrastáveis **e** alternativa por teclado/seleção (S7). **Zero exercícios.**

**4. Mídia.** 1 colocação: o asset `m01-a04-01` (cadeia de tensão) **reusado** no bloco 8 desta aula, com legenda
própria. Não há imagem exclusiva da A06 no manifesto, e a A06 **não** está em `aulas_sem_imagem` — ou seja, a
colocação existe e está publicada; o que falta é montá-la. Candidata em aberto no estudo (topo da escada, A1) com
teste de remoção fraco: só entra se a escada ganhar miniaturas nos extremos.

**5. Termos do léxico (C4).** Grupo A, Grupo B, Tensão, Modalidade tarifária, Trifásico, TUSD, CUSD — sete dos 38.

| # | O que a fonte tem | O que o produto tem hoje | O que falta | Gate | Tam. |
|---|---|---|---|---|---|
| A06-1 | L1831–L1896: 4 subseções, tabela 6.1, tabela 6.2 (A1…B), **lista `<ul>` da 6.3**, tabela 6.4 | `:266-280`, 14 blocos; **a lista da 6.3 sumiu**, deixando o parágrafo terminar em "Logo:"; "prospecção da GridAlpha" no bloco 6 | Re-extração verbatim + troca editorial da marca (P24) | C4, S4, P24 | **G** |
| A06-2 | — | CARTA inexistente | **Tronco CARTA** + `AulaM01A06.tsx` | Regra-mãe | **G** |
| A06-3 | Tabelas 2.1, 6.1, 6.2 + parágrafo 6.1 sobre tarifa binômia | Apostila direta | Abertura com a pergunta (13,8 kV → grupo, subgrupo, estrutura de fatura); declarar que não há previsão e por quê | C3 | **P** |
| A06-4 | 6 faixas da tabela 6.2 (A1 ≥ 230 kV; A2 88–138; A3 69; A3a 30–44; A4 2,3–25; B < 2,3) | Tabela estática | Ato de localizar 5 fornecimentos na escada, com fichas e alternativa por teclado; referência com a linha da tabela que justifica cada posição | **C9**, S7 | **G** |
| A06-5 | — (não há instrumento) | Nenhum instrumento ligado à A06 | **Mapa de enquadramento** (camada Alexandria) após o bloco 5, com rótulo de camada | C5, T5 | **M** |
| A06-6 | Faixas da 6.2, com **intervalos sem subgrupo** | Nada | **V-ESC**: escada vertical com faixas pintadas e os vazios desenhados como "não declarado"; **V-CADEIA**: camadas de rede atravessadas (6.3) | C6, **S4** | **G** |
| A06-7 | Nenhum exercício | `ExercicioBlock` vazio | Ausência declarada em linha de aparato | S4 | **P** |
| A06-8 | — | `m01-a04-01` publicado; nenhuma colocação montada | Reuso do asset no bloco 8, com legenda própria desta aula | C4 | **P** |
| A06-9 | Grupo A, Grupo B, Tensão, Modalidade tarifária, Trifásico, TUSD, CUSD | Nenhuma ligação | `<Termo>` nos 7 | **C4** | **P** |
| A06-10 | — | Próxima fixa | Recuperação com a previsão da A04 (100 A → 200 A), que liga "menos perdas" da 6.3 ao I²R; "Serve a" = m01-cap-06 e checklist 14 (reescrito sem a marca antiga) | **C10**, P24 | **P** |

> **A06 está bloqueada por conteúdo.** `DECIDIR.md` §2, **QA-M01-A06** `[R]`: a subseção 6.1 diz "Grupo A ≥ 2,3 kV" e
> a 6.2 lista o subgrupo **AS "< 2,3 kV" dentro do Grupo A**. A fonte não declara qual prevalece, e decidir exige
> conhecimento normativo externo. Sem resposta do Founder, a escada desta aula não pode ser desenhada sem afirmar
> uma das duas leituras. Saídas sem inventar: (i) mostrar as duas literais com rótulo de conflito; (ii) o Founder
> declara a leitura.

---

### A07 · Existe energia que ocupa a rede e não vira produção.
**§ MAP L1345 — "Por que existe energia que ocupa a rede mas não vira produção?"** · fonte L1900–L2002 · 18 blocos
(`:282-300`) — **a aula mais longa do módulo**

**1. Arquétipo — PRANCHA, secundário DOSSIE.** Relação operável (`kVA² = kW² + kVAr²`, `FP = kW ÷ kVA = cos φ`) com
instrumento de controles, e o ato é manipular até uma meta. O triângulo **é** o palco. O fecho é decisão (Ex·05),
como na A05. **Tronco construído.**

**2. O ato autêntico (C9) — manipular até uma meta.** *"Mantendo 800 kW, reduza a potência reativa até o FP chegar à
referência de 0,92. Quanto kVAr a instalação pode puxar da rede, no máximo?"* Meta derivada:
kVAr ≤ 800 × tan(arccos 0,92) ≈ **340,8 kVAr**; com passo 10, 340 kVAr dá FP 0,9204 e 350 dá 0,9162.
**Cuidado de implementação registrado:** o mostrador de 2 casas exibe "0,92" para 350 kVAr, que está **abaixo**. A
detecção de meta usa o valor não arredondado, e a leitura mostra 3 casas perto da referência, ou a palavra
"abaixo/atingida".
**Previsão (C3) — útil, numérica.** *"Uma instalação usa 800 kW de ativa e 480 kVAr de reativa. O FP fica acima ou
abaixo de 0,92?"* Valores do cenário-padrão (L1941–L1947): **800 kW · 480 kVAr · 933 kVA · FP 0,86 · φ 31,0°**.
Resposta: **abaixo — 0,86** (literal da fonte). A tentação é comparar 480 com 800 linearmente ("60%"); só o triângulo
dá 0,86.

**3. Instrumento e exercícios.** **INST·05** (Controles · Triângulo de potência), após o bloco 5 (*"As três potências
formam um triângulo retângulo:"*) e antes do título 7.3; fonte L1917–L1973. Campo numérico e deslizador gêmeos com
faixas diferentes (número min 0 passo 50/20; deslizador 100–1500 passo 10 e 0–1200 passo 10) — Q07. O código tem o
diagrama ancorado no id, mas com **outputs vazios**. **A referência 0,92 desenha-se como arco-limite de ângulo
(φ ≈ 23,1°, derivado) — sem semáforo** (S2). **1 exercício**: Ex·05 (`m01-ex-05`, tag "Ex · 05 · Aula 07", L2427):
900 kW, 1.000 kVA → FP 0,90, com a decisão "recomendar banco de capacitores agora?" e a referência da fonte
(diagnóstico antes de solução, 7.5).

**4. Mídia.** 2 publicadas: `m01-a07-01` (cavalo e barcaça — a analogia clássica do FP, explicação, bloco 5) e
`m01-a07-02` (banco de capacitores de 75 Mvar em Zandvliet, documental, domínio público, bloco 15). Planejadas 2,
publicadas 2 — **não falta**. A lacuna de catálogo que o estudo apontava (banco de capacitores industrial) **foi
resolvida** com a foto documental.

**5. Termos do léxico (C4).** Fator de potência (FP), kVA, kVAr, kW, Banco de capacitores, UFER, Grupo A — sete dos
38. UFER é o termo que liga a aula à linha de cobrança real da fatura.

| # | O que a fonte tem | O que o produto tem hoje | O que falta | Gate | Tam. |
|---|---|---|---|---|---|
| A07-1 | L1900–L2002: 5 subseções, fórmula com `desc`, callout regulatório com fonte nomeada, 7.5 com o critério de diagnóstico | `:282-300`, 18 blocos, `desc: null`; callout partido em nota+parágrafo; "linguagem GridAlpha correta" no bloco 17 | Re-extração verbatim + troca editorial da marca (P24) | C4, S4, P24 | **G** |
| A07-2 | — | Sem componente | `AulaM01A07.tsx` sobre a PRANCHA + fecho DOSSIE | Regra-mãe | **M** |
| A07-3 | Leituras padrão L1941–L1947 (800 kW, 480 kVAr, 933 kVA, FP 0,86, φ 31,0°) + 7.4 (0,92) | Apostila direta | Abertura + previsão (acima/abaixo de 0,92, com valor opcional) | **C3** | **P** |
| A07-4 | Referência 0,92 (7.4) | Nada | Ato de meta com detecção **sem arredondamento** e leitura de 3 casas perto da referência; estado por palavra | **C9**, S2, C5 | **M** |
| A07-5 | INST·05 após o bloco 5 | `:520` liga `inst-05`; impresso depois da apostila; **outputs vazios** no código; faixas gêmeas divergentes | Instrumento no ponto, com as 5 leituras (kW, kVAr, kVA, FP, φ) e o quadro previsto × calculado fixo | **C5**, Regra-mãe 1 | **M** |
| A07-6 | Triângulo retângulo kVA² = kW² + kVAr² | Diagrama existe no código para `inst-05`, sem valores | **V-TRI**: triângulo com **arco-limite de 0,92 (φ ≈ 23,1°)**, escalas de eixo corrigidas, **sem semáforo** | C6, **S2** | **M** |
| A07-7 | Ex·05 (L2427) com gabarito | "Revelar gabarito" | Campo numérico (FP) + decisão (sim · não · diagnosticar antes) antes do gabarito; autoavaliação na parte "qual cuidado" | **C7** | **P** |
| A07-8 | — | 6 arquivos webp publicados, sem uso | Colocações nos blocos 5 e 15, com os dois créditos | C4, S4 | **P** |
| A07-9 | FP, kVA, kVAr, kW, Banco de capacitores, UFER, Grupo A | Nenhuma ligação | `<Termo>` nos 7 | **C4** | **P** |
| A07-10 | 7.5 (diagnóstico antes de solução) | Próxima fixa | Recuperação com a classificação da A02 (kW · kVAr · kVA: qual vira produção?); próximo passo condicional: decisão "instalar já" → "Rever 7.5"; demais → A08. "Serve a" = m01-cap-05, m01-cap-07, checklist 10 e 11 | **C10** | **P** |

> **A07 tem um erro de conteúdo dentro da própria aula.** `DECIDIR.md` §2, **QA-M01-A07** `[C]`: a subseção 7.3 diz
> *"FP 0,85 → os outros 15% são reativos"*. Com FP = 0,85, a fração reativa é `sin(arccos 0,85) ≈ 0,53` da potência
> aparente. A refutação sai da **fórmula da própria aula**, mas a frase substituta é texto novo e cai em P11: **o
> Founder assina a redação**. Isto não é opcional para esta aula, porque a figura viva do triângulo vai contradizer
> o parágrafo ao lado na mesma tela.

---

### A08 · 100 MW solar ≠ 100 MW térmica. — **a única construída**
**§ MAP L1346 — "Por que 100 MW solar ≠ 100 MW térmica?"** · fonte L2006–L2096 (INST·06 no script L2935–L2962) ·
9 blocos no código legado (`:302-311`) · **construída em `src/components/alexandria/aula/AulaM01A08.tsx`**

**1. Arquétipo — PRANCHA.** É a aula-protótipo do arquétipo (`exemplo_do_arquetipo: true`) e o alvo de captura
declarado do bar (§4: *"Peça Aula (M01·A08): julgada por C3–C10 e pela Regra-mãe"*). **Tronco construído e em uso**
(`arquetipos.ts:31`).

**2. O ato autêntico (C9) — prever → calcular → comparar.** Registrar a previsão do FCap, calcular no INST·06, ver
previsto × calculado no mesmo cenário, e depois mover a geração para outra faixa da figura e dizer que tipo de fonte
aquela faixa descreve. Construído: `AulaM01A08.tsx:334` (ato de previsão), `:616` (ato de meta, faixa
"Hidrelétrica (BR · média)" 45–55%), `:816` (Ex·06).
**Previsão (C3) — útil, numérica, construída.** *"Uma usina solar de 100 MW gerou 220.000 MWh em 1 ano (8.760 h).
Qual foi o fator de capacidade, em %?"* Valores do cenário-padrão: **100 MW · 220.000 MWh · 8.760 h**. Resposta:
**25,1%** (fonte). Rótulo obrigatório à vista: *"Cenário didático presente no módulo; fonte externa dos valores não
declarada."* (P19). O parágrafo 8.2 diz "25,1%" antes do instrumento — a previsão tem de vir antes dele, e vem
(`:315` Abertura, antes de `:444` Seção 8.2).

**3. Instrumento e exercícios.** **INST·06** (Calculadora · Fator de capacidade) — **o único instrumento do M01 com
extração de fonte verificada**: 3 entradas (Capacidade instalada, Geração no período, Horas do período), 1 saída com
**1 casa fixa**, 6 ramos de leitura. Construído no ponto da prosa que o invoca (`AulaM01A08.tsx:458-462`, id
`inst06`), entre *"Use a calculadora abaixo:"* e o h3 8.3 — corrigindo COD-02. **1 exercício**: Ex·06
(`m01-ex-06`, L2445; 50 MW, 131.400 MWh, 8.760 h → 30%), construído em `:816-898` com registro antes da referência e
autoavaliação para a parte interpretativa.

**4. Mídia.** 2 publicadas e **2 em uso no componente**: `m01-a08-02` (solar e térmica, dia e noite — explicação,
bloco 2) em `AulaM01A08.tsx:92-102`, e `m01-a08-04` (Sobradinho na seca de 2015, documental, CC BY 3.0 BR, bloco 8)
em `:104-115`. O manifesto marca 10 colocações planejadas para a A08 (o maior plano do módulo); **8 não foram
publicadas** e não são lacuna de render: são fichas opcionais por faixa da figura 8.3, com revisão factual pendente
em todas.

**5. Termos do léxico (C4).** Fator de capacidade (FC), Potência, Energia, Eficiência — quatro dos 38.
**Nenhum está ligado:** `<Termo>` tem **0 ocorrências** em `AulaM01A08.tsx`, embora a primitiva exista em
`tronco.tsx:267`. **Esta é a falha aberta do C4 na aula-protótipo.**

| # | O que a fonte tem | O que o produto tem hoje | O que falta | Gate | Tam. |
|---|---|---|---|---|---|
| A08-1 | `aula-08.json`: 12 blocos verificados, 8.1–8.3, fórmula `div.formula`, figura `cf-chart` de 7 barras | `AulaM01A08.tsx` completo: abertura `:315`, 8.1 `:428`, 8.2 `:444`, palco `:458`, 8.3 `:709` | **nada** — esta é a única aula com fonte extraída e corpo construído | C4 | — |
| A08-2 | — | Componente sobre a PRANCHA, registrado em `arquetipos.ts:31` | **nada** | Regra-mãe | — |
| A08-3 | § MAP L1346 + cenário-padrão do INST·06 | `Abertura` em `:315`, `Ato id="previsao"` em `:334-378` | **nada** | C3 | — |
| A08-4 | Faixas por fonte (8.3) | Ato de meta em `:616-646`, com `Medida ato="previsao"` | **nada** | C9 | — |
| A08-5 | INST·06 entre L2023 e o h3 8.3; 1 casa fixa; 6 ramos | Palco em `:458-462` (id `inst06`), `leituraDaFaixa` em `:941` | **nada** — COD-02, COD-05, COD-06 e COD-07 já corrigidos no componente | C5 | — |
| A08-6 | Fórmula da 8.2 + figura `cf-chart` (7 barras) | `CaixaTeorica` em `:953` (876.000 MWh × 220.000 MWh, com a linha da previsão) e `ReguaDeFaixas` em `:1107`, com selo P20 | **nada** | C6, S4 | — |
| A08-7 | Ex·06 (L2445) com gabarito | Ato em `:816-898`, com `Autoavaliacao id="exercicio"` | **nada** | C7 | — |
| A08-8 | — | 2 assets em uso (`:92`, `:104`, `:417`, `:777`) com legenda, crédito e classe | **nada** publicável agora; as 8 colocações restantes do manifesto dependem de revisão factual | C4, M6 | — |
| A08-9 | 4 verbetes (Fator de capacidade, Potência, Energia, Eficiência) | **0 `<Termo>` no componente**, com a primitiva pronta em `tronco.tsx:267` | Ligar os 4 termos no ponto de uso, com **FCap** por extenso na primeira ocorrência (P21) | **C4**, P21 | **P** |
| A08-10 | — | `Recuperacao` em `:392` (frase-erro da A01), `RegistroDaAula` em `:904`, `ProximoPasso` em `:915` com `aRevisar` | **nada** | C10 | — |

---

### A09 · Energia ruim pode custar mais do que energia cara.
**§ MAP L1347 — "Por que tensão ruim é problema financeiro, não só técnico?"** · fonte L2100–L2175 · 14 blocos
(`:313-332`)

**1. Arquétipo — MESA (Mesa de classificação e leitura lateral).** É a única aula do M01 que chega ao fim da régua:
não há decisão com consequência em duas dimensões, não há artefato a anotar, não há número publicado a qualificar,
não há forma no tempo, não há posicionamento em eixo, não há relação operável, e a estrutura não é uma cadeia — é
**taxonomia**: sintoma → fenômeno, e N objetos lidos pelos mesmos campos. Pergunta 10. **Tronco construído**
(`arquetipos.ts:33`, o mesmo da M13·A06).

**2. O ato autêntico (C9) — classificar (sintoma → fenômeno).** Quatro relatos de fábrica, compostos **só** com as
colunas "o que é" e "consequência industrial" da tabela 9.3: *"a linha parou e os controles reiniciaram após uma
queda rápida e temporária da tensão"*; *"motores aquecem e vibram, e as três fases não medem igual"*;
*"transformadores aquecem e proteções disparam desde que instalamos inversores"*; *"a iluminação da vizinhança
oscila quando o forno a arco liga"*. Referência: **afundamento de tensão; desequilíbrio entre fases; harmônicos;
flicker**. Exercita reconhecer o fenômeno pelo efeito, que é como ele chega ao analista.
**Previsão — não útil:** a fonte não traz números de custo nem limites; não há resultado a prever sem inventar. O
ato é de reconhecimento.

**3. Instrumento e exercícios.** **Nenhum instrumento na fonte.** O ato substituto é a **prancha de fenômenos**,
camada Alexandria, após o bloco 7 (tabela 9.3) e antes do callout PRODIST, com seleção por teclado. **Zero
exercícios.** Secundários: classificar definições → DEC, FEC, DIC, FIC, DMIC, DICRI e coletivo × individual
(tabelas 9.1 e 9.2); e decidir o caminho técnico, com a referência sendo medição conforme PRODIST Módulo 8 (DRP/DRC)
e tratativa com a distribuidora (callout 9.3) — **não** o bloco P7 de triagem interna.

**4. Mídia.** **0 imagens, e isso é decisão fechada, não lacuna.** O manifesto registra a A09 em `aulas_sem_imagem`:
*"taxonomia regulatória e fenômenos de forma de onda: o que explica é visualização programática (C6), não imagem."*
O estudo acrescenta que não há foto de dano por qualidade de energia no catálogo e que **não se deve gerar** — é
tema documental.

**5. Termos do léxico (C4).** Harmônicos, DEC / FEC, DIC / FIC / DMIC / DICRI, PRODIST, REN ANEEL 1.000/2021,
Tensão, Frequência — sete dos 38. É a aula que mais depende do léxico regulatório, e a que mais sofre hoje com a
ausência de ligação.

| # | O que a fonte tem | O que o produto tem hoje | O que falta | Gate | Tam. |
|---|---|---|---|---|---|
| A09-1 | L2100–L2175: 4 subseções, tabelas 9.1, 9.2, 9.3, callout PRODIST, **lista `<ul>` da 9.4** | `:313-332`, 14 blocos; **a lista da 9.4 sumiu**, deixando o parágrafo terminar em "prejuízo direto:"; "PQA da GridAlpha" no bloco 13 | Re-extração verbatim + troca editorial da marca (P24) | C4, S4, P24 | **G** |
| A09-2 | — | Sem componente; MESA existe e está em uso na M13·A06 | `AulaM01A09.tsx` sobre a MESA | Regra-mãe | **M** |
| A09-3 | § MAP L1347 + § Map/Tradutor ("qualidade ruim … vira custo operacional") | Apostila direta | Abertura com a pergunta; declarar que não há previsão e por quê; **recuperação no topo com a previsão da A03** (a 3.5 prometeu retomar frequência aqui e a fonte não cumpre) | **C3**, C10 | **P** |
| A09-4 | Colunas "o que é" e "consequência industrial" da tabela 9.3 | Tabela estática | Ato de classificar 4 relatos → 4 fenômenos, com os relatos marcados como composição da camada Alexandria (T5) e pares revelados só após registro | **C9**, C7, T5 | **M** |
| A09-5 | — (não há instrumento) | Nenhum instrumento ligado à A09 | **Prancha de fenômenos** (camada Alexandria) após o bloco 7, com seleção por teclado | C5, S7 | **M** |
| A09-6 | Tabela 9.3 (5 fenômenos) + callout PRODIST (7 dias × 144 intervalos de 10 min) | Nada | **V-ONDA**: 5 pequenos múltiplos esquemáticos sobre a senoide de referência (reuso da A03), **sem escala numérica**; grade 7×144 da amostra (1.008 leituras, derivado); cadeia fenômeno → consequência → custo (a 9.4 recuperada) | C6, S4 | **G** |
| A09-7 | Nenhum exercício | `ExercicioBlock` vazio | Ausência declarada em aparato; a segunda classificação (DEC/FEC/DIC/FIC/DMIC/DICRI) e a decisão de caminho técnico cobrem o C7 | S4, C7 | **P** |
| A09-8 | — | Nada | **Nada a publicar.** A decisão de zero imagens fica dita uma vez, no aparato, não como espaço vazio | M7, S4 | **P** |
| A09-9 | Harmônicos, DEC/FEC, DIC/FIC/DMIC/DICRI, PRODIST, REN ANEEL 1.000/2021, Tensão, Frequência | Nenhuma ligação | `<Termo>` nos 7 | **C4** | **P** |
| A09-10 | Última aula do módulo | Próxima fixa | Próximo passo para a **Revisão** (Caso — Operação A + Desafio de decisão, LAB·01, Ex·08 Síntese) e daí para a Avaliação, com o critério apresentado antes e **nunca** virando Demonstrado (P18); "Serve a" = m01-cap-06, m01-cap-07, checklist 12 | **C10**, P18 | **M** |

---

## 4. Unidades de módulo — o que nenhuma aula resolve sozinha

| # | O que a fonte tem | O que o produto tem hoje | O que falta | Gate | Tam. |
|---|---|---|---|---|---|
| **M-01** | `extraction/m01/` tem `modulo`, `aparato` e **só a aula 08** | `MODULO_01_CORPO` (`:175-332`) com as perdas do T01 medidas | **Re-extração determinística e verificada de A01–A07 e A09**, no mesmo padrão do `aula-08.json` | C4, S4 | **G** |
| **M-02** | `instrumentos.json`: INST·01–05 com `fonte_extraida: false`, entradas `[]`, saídas `[]`, cenário `null` | `INSTRUMENTOS_MODULO_01` (`:40`) com 6 instrumentos portados e divergentes | Extração de camada fonte dos **5** instrumentos: rótulo, unidade, faixa, passo, casas, ramos de leitura, cenário-padrão | **C5**, S4 | **G** |
| **M-03** | — | **Tronco PRANCHA + MESA construídos**; SISTEMA e CARTA não existem | Dois troncos novos (**SISTEMA**, **CARTA**), que servem A02, A03 e A06 | Regra-mãe, §3 do SISTEMA.md | **G** |
| **M-04** | — | `tronco.tsx:267` tem `<Termo>`; **0 usos em 4 componentes de aula** | Ligação de léxico em todas as nove aulas (prévia 1 ação → verbete 2 ações → volta à mesma posição) | **C4**, D6 | **M** |
| **M-05** | 4 ramos/6 ramos de leitura nos scripts; 4 mensagens de placar | `estudo.progresso.aulasConcluidas` no router (`:268`) | **§9: registro de previsão, classificação, meta e decisão** como eventos de prática — sem ele, C7 e C9 não fecham em nenhuma das nove | **C9**, C7, §9 | **G** |
| **M-06** | — | `tronco.tsx`: **0 ocorrências** de `animate`, `@keyframes` ou `transition:` | Coreografia dos **momentos 4, 5 e 6** (abertura → primeiro ato; previsão registrada → comparação; conclusão de aula ≤ 1.500 ms), com contrato de `prefers-reduced-motion` e aceite em filmstrip | **S6**, M6 | **G** |
| **M-07** | Módulo de 9 aulas; 3 critérios contraditórios | `VinhetaModulo.tsx` e `TrechoDaCarta.tsx` citam medalha | **Momento 7** (conclusão de módulo) + **medalha do M01** cunhada a partir de `media-lab/movimento-e-conquistas/medalhas/` | S6, S3 | **M** |

---

## 5. Pesquisa — o que não se verifica no render

Nenhuma linha abaixo é unidade de trabalho: não há tela onde reprová-la. Todas precisam de decisão ou de leitura
externa antes de virar trabalho.

| ID | O que é | Onde está | De quem é a resposta |
|---|---|---|---|
| **R1** | **QA-M01-A06** `[R]` — 6.1 "Grupo A ≥ 2,3 kV" × 6.2 subgrupo AS "< 2,3 kV" dentro do Grupo A | `DECIDIR.md` §2 | **Founder** (normativo externo). **Bloqueia a A06.** |
| **R2** | **QA-M01-A07** `[C]` — "FP 0,85 → os outros 15% são reativos"; a fração real é ≈ 0,53. A refutação é da própria aula, mas a frase nova cai em P11 | `DECIDIR.md` §2 | **Founder assina a redação.** Bloqueia o parágrafo 7.3 da A07. |
| **R3** | **QA-M01-A04** `[C]` — 4.1 e a nota do INST·03 chamam o crescimento de "exponencial"; a fórmula da mesma seção é `P = I² × R`, quadrático | `DECIDIR.md` §2 | Conserto editorial de uma palavra, com proveniência. |
| **R4** | **QA-FCap-01 / P20** — faixas de FCap conflitantes entre INST·06, figura `cf-chart` e § Lex (solar 20–28% × corte 0,25; carvão 55–75% × ≥0,85; CCGT 40–60% × ≥0,55) | `DECIDIR.md` §2; `aula-08.json` | **Verificação autoritativa pendente.** Até lá, selo "faixas do módulo · verificação pendente" na A08 — já aplicado. |
| **R5** | Analogia contraditória dentro do módulo: a tabela 1.2 da A01 mapeia "diâmetro do cano → corrente", mas a 2.2 da A02 (L1512) e o verbete Ampere dizem "corrente é vazão" | `estudos/aulas/m01.json` → A01 `qa_conteudo` | Content QA antes de desenhar a analogia da A01. |
| **R6** | Exemplos de escala da tabela 1.3 sem fonte (Itaipu ≈ 14 GW; Brasil ≈ 530 TWh/ano); "86.400 vezes por dia" e o elo HVDC de Belo Monte na A03 | T06; dependências de A01 e A03 | Ou ficam com "fonte externa não declarada", ou saem. Não inventar número. |
| **R7** | **Q01** do DECIDIR — o critério do módulo existe em quatro formas (§Drill "seis dos oito", §Quiz "8 de 10", §Final 16/16, mensagens do script). Nenhuma prevalece | `modulo.json` → `divergencias`; `DECIDIR.md` Q01 | **Founder.** Afeta o "Serve a" das nove aulas e o próximo passo da A09. |
| **R8** | **Q03 / P23 / P24** — "GridAlpha" no corpo de A05, A06, A07 e A09; "Trava 4 do War Room"; "PQA da GridAlpha" | T04; `DECIDIR.md` Q03 | **Founder** decide terminar a troca agora ou depois do porte. Afeta 4 das 9 aulas. |
| **R9** | O léxico não liga termo a aula: `ancoraDeAula.declaradas: 0` nos 38 verbetes | `glossario.json` | A atribuição termo → aula nas tabelas acima é **derivação nossa** e precisa de revisão antes de virar âncora. |
| **R10** | O vínculo aula → capacidade ("Serve a") não é declarado pela fonte; as 7 capacidades e os 16 itens do checklist não citam aula | `modulo.json`; README da extração | Derivação, com revisão. O P14 marca 15 dos 16 itens como orais ou livres — nenhum vira evidência automatizada. |
| **R11** | O LAB·01 tem divergência não reconciliada (markup R$ 1.800 / R$ 67.425 × script R$ 3.200 / R$ 68.825), e `instrumentos.json` marca `bloqueio: "reconciliacao-pendente"` | `instrumentos.json` → `m01-lab-01` | Não é aula, mas entra na Revisão que a A09 aponta. Bloqueia a pergunta de previsão do LAB. |

---

## 6. Contagem e ordem de construção

**Contagem.**
- **8 aulas a zero** (A01, A02, A03, A04, A05, A06, A07, A09) — nenhuma tem componente de arquétipo; todas caem na
  rota legada com instrumento em apêndice e "Revelar gabarito".
- **1 aula construída** (A08), com **uma falha aberta**: nenhum termo do léxico ligado (C4).
- **6 das 9 têm tronco de arquétipo pronto** — PRANCHA para A01, A04, A05, A07, A08 e MESA para A09.
- **3 das 9 pedem tronco novo** — SISTEMA para A02 e A03, CARTA para A06.
- **6 aulas têm instrumento na fonte**; **5 deles sem extração de camada fonte**. 3 aulas (A03, A06, A09) não têm
  instrumento e precisam de ato substituto da camada Alexandria.
- **7 exercícios** com tag de aula (A01, A02, A04, A05 ×2, A07, A08) + 1 solto (Ex·08 Síntese, do módulo). 3 aulas
  (A03, A06, A09) não têm exercício. Todos os 7 estão renderizados hoje — com "Revelar gabarito", que o C7 proíbe.
- **11 assets de mídia publicados**, cobrindo 8 das 9 aulas (a A09 é decisão fechada de zero imagens, e a A06 reusa o
  asset da A04). **Nenhum está em uso** fora da A08. Não falta produzir imagem para o M01.
- **Zero aulas fechariam em "explique com suas palavras".**

**Ordem recomendada — a que mais ensina o sistema primeiro.**

| Ordem | Aula | Por que aqui | O que o resto herda |
|---:|---|---|---|
| **1** | **A01** | PRANCHA pronta; é a raiz pedagógica do módulo e a base geométrica que A05 e A08 reusam (T10); a recuperação da A08 já depende da frase-erro dela | **V-RET** (plano P×t), **V-ESC**, o ato "identificar o erro", e o primeiro `<Termo>` em produção |
| **2** | **A04** | Primeiro **C-META** do módulo (34 aulas do currículo dependem do componente); parábola e escada num só palco | **C-META** com detecção sem arredondamento; **V-XY** |
| **3** | **A02** | Primeiro **tronco SISTEMA** e a **V-CADEIA**, a figura mais pedida de todo o currículo (40 aulas) | Tronco SISTEMA; V-CADEIA; a mesa de classificação em regime de produção |
| **4** | **A05** | Primeiro **DOSSIE** ("não é possível concluir") e o caso de C7 mais difícil do módulo: o instrumento revela o exercício, e a ordem tem de inverter | Fecho DOSSIE; a regra de "instrumento velado até o registro"; **V-FAIXA** reusada da A08 |
| **5** | **A07** | Segundo C-META, com o cuidado de arredondamento que a A04 não exercita; **V-TRI** e o arco-limite sem semáforo | A prova de que meta + decisão convivem numa PRANCHA |
| **6** | **A03** | SISTEMA reusado, protótipo declarado do arquétipo, com palco 100% da camada Alexandria e selo "esquemático" | **V-ONDA** (senoide de referência), que a A09 reusa; a gramática do rótulo de camada (T5) |
| **7** | **A09** | MESA pronta, zero imagens, zero instrumento, zero exercício — a aula mais barata, e a que fecha o módulo e abre a Revisão | O próximo passo para Revisão → Avaliação, com o critério antes (P18) |
| **8** | **A06** | Tronco CARTA novo **e** bloqueio de conteúdo aberto (R1). Última por causa do bloqueio, não da dificuldade | Tronco CARTA, para 10 aulas do currículo |

**Duas observações sobre a ordem.** A08 não está na lista porque já existe; a única coisa que falta nela (ligar os
quatro termos) é **P** e deve entrar junto com a A01, para que as duas provem o C4 no mesmo dia. E **M-01** e **M-02**
da §4 são pré-requisito de todas as oito: enquanto o corpo e os cinco instrumentos não forem re-extraídos, qualquer
aula construída estará sendo julgada sobre um texto que não é a fonte.
