# M10 · grupo "instrumentos"

**Fonte (só leitura):** `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo10.html`. O markup dos 11 `div.inst`
vai da L580 à L2561, e o `<script>` dos instrumentos da L3606 à L4677.
**Arquivo gerado:** [`instrumentos.json`](instrumentos.json).
**Extrator:** [`extratores/m10_instrumentos.mjs`](extratores/m10_instrumentos.mjs). Usa a árvore de
[`extratores/lib.mjs`](extratores/lib.mjs) e o DOM simulado de [`extratores/shim.mjs`](extratores/shim.mjs). O código do
repositório entra só para leitura, por [`extratores/code.mjs`](extratores/code.mjs).
**Data:** 2026-09-17.

## Método (protocolo §10, "método mais forte")

1. **Markup.** Cada `div.inst` é lido pela árvore:
   - `inst-hd`: número e nome;
   - intro e aviso (`p` "Instrumento didático…");
   - `seg-lb` e `.seg`: botões e opção padrão (`on`);
   - `field-grid`: rótulo, unidade, `min`/`max`/`step`/`value` e o deslizador gêmeo, contados como **um** campo lógico
     (§12);
   - `tr-grid`: grade de chips gerada pelo script;
   - `.ro`: readouts com o texto estático do markup (`—`);
   - alvos de veredito, cartões e painéis.
2. **Dados.** Cada `var NOME=` literal do bloco do instrumento é avaliado só como dado e guardado em
   `dados_do_script`, com linha inicial e final.
3. **Lógica.** `logica_literal.codigo` copia o IIFE inteiro. Só os literais de dados são trocados por um comentário que
   aponta para `dados_do_script`.
4. **Saídas.** `expressao_exata` é a atribuição `$id(x).textContent=…` copiada do script, com a linha.
5. **Cenário-padrão.** O `<script>` inteiro, sem nenhuma alteração, roda no DOM simulado. O cenário é o estado depois
   do carregamento, sem interação: readouts, classe e HTML do veredito, cartões e painéis.
6. **Varredura contra o código.**
   - Os mesmos casos rodam no script original e em `INSTRUMENT_CALCULATORS`.
   - **Número:** o valor do código é comparado ao número exibido pela fonte, na precisão exibida.
   - **Texto:** cada folha de texto da fonte (veredito, rótulo e corpo de cartão, painel) precisa aparecer no veredito
     do código. O "resíduo" é o texto do código que não vem de folha nenhuma da fonte.
   - Casos por instrumento:

     | Inst | Casos |
     |---|---|
     | 01 | 43 |
     | 02 | 60 (espaço inteiro) |
     | 03 | 1.260 |
     | 04 | 891 |
     | 05 | 288 |
     | 06 | 1.620 |
     | 07 | 12 |
     | 08 | 73 |
     | 09 | 437 |
     | 10 | 91 |
     | 11 | 135 (espaço inteiro) |

7. **Catálogo.** A tabela "Instrumentos" do Módulo 10 no catálogo canônico (L975–985) é lida e guardada em
   `catalogo_canonico`.
8. **Achados fonte × fonte.** Vão em `achados_na_fonte`, medidos no script original (Inst · 09 e Inst · 10).

**Verificação** (`extratores/verify.mjs`):
- 927 strings de conteúdo conferidas como substring da fonte (markup, texto normalizado ou script);
- 124 origens conferidas na linha declarada;
- zero falha.

## Contagem

| Medida | Valor |
|---|---|
| Na fonte | **11** `div.inst`. O pill do hero diz "11 instrumentos" e o catálogo canônico lista 11, com nomes idênticos |
| Em aula | 10. A Aula 03, a Aula 08 e a Aula 09 têm dois cada |
| Fora de aula | 1: o Inst · 01, no § MAP, que vai para Recursos do Módulo (§3) |
| Entradas (campos lógicos) | 44 |
| Saídas numéricas (readouts) | 26, em 7 instrumentos |
| Com pergunta própria | 0. `pergunta` = null nos 11 (o intro é instrução de uso) |
| Com tolerância declarada | 0. `tolerancias` = null nos 11 |
| Com fonte externa por número | 0 com fonte por valor. Algumas notas citam norma (ver "Fonte dos números") |
| **Estado no código** | 11 presentes: **1 portado** (Inst · 02) e **10 divergentes**. Nenhum ausente |

A numeração `Inst · NN` bate com os ids internos (`INST·NN` no comentário do script) e com os ids do código
(`m10-inst-NN`).

## Os 11

| Inst | Título (literal) | Onde é invocado | Entradas | Saídas | `kind` no código | Estado |
|---|---|---|---|---|---|---|
| 01 | Mapa da fatura — três lentes sobre a mesma estrutura | § MAP, depois do parágrafo das três lentes (L574) e antes da caixa "O que o mapa já demonstra" (L611) | Lente (3, padrão "Quem define o valor unitário"); grade de 14 linhas da fatura, sem seleção inicial | 2 painéis de texto (`mf-lens`, `mf-line`) | explorador | divergente |
| 02 | Comparador de modalidades — diferença estrutural por linha | Aula 02, depois de "Números vivos" (L1083) e antes do destaque de produto (L1141) | Perfil (5, padrão "Plana em turnos"); modalidade (3, "Horária Azul"); subgrupo (4, "A4 · 2,3 a 25 kV") | Veredito e cartões | comparador | **portado** |
| 03 | Dimensionador de demanda — faixas de diagnóstico | Aula 03, fim de 03.2 (L1238), antes do h3 03.3 (L1302) | 5 números | 4 readouts, veredito e cartões | dimensionador | divergente |
| 04 | Simulador de ultrapassagem — todos os parâmetros editáveis | Aula 03, depois de "Números vivos" do multiplicador (L1331), antes do h3 03.4 (L1400) | 5 números | 5 readouts, veredito e cartões | simulador | divergente |
| 05 | Deslocador de carga entre postos — volume, nunca dinheiro | Aula 04, depois do parágrafo "o instrumento correto para avaliar deslocamento…" (L1567), antes da caixa das três perguntas (L1627) | 4 números | 4 readouts, veredito, cartões e barras (`dl-bars`) | simulador | divergente |
| 06 | Apurador de excedente reativo — limites e janelas editáveis | Aula 05, depois do bloco `.lv` de três níveis (L1738), antes do h3 05.4 (L1838) | 6 números | 4 readouts, veredito e cartões | simulador | divergente |
| 07 | Anatomia dos encargos — quem financia, quem paga, o que mudou | Aula 06, depois do parágrafo sobre o custeio (L1960), antes do h3 06.4 (L1989) | Grade de 11 itens, sem seleção inicial | Painel de texto (`en-panel`) | explorador | divergente |
| 08 | Régua do ciclo tarifário — do processo à linha da fatura | Aula 08, fim de 08.1 (L2238), antes do h3 08.2 (L2272) | Grade de 8 etapas: o 1º clique abre e o 2º marca como verificada | 2 readouts, veredito e painel | quebra-cabeca | divergente |
| 09 | Reconstrutor de fatura — estime antes de ver | Aula 08, depois do parágrafo dos dois vieses (L2347), antes do destaque de produto (L2453) | 12 números: 6 de estimativa e 6 de "Composição real da sua fatura" | 4 readouts, veredito, cartões e linhas de erro (`rb-rows`) | comparador | divergente |
| 10 | Ordem de leitura cronometrada — o instrumento assinatura | Aula 09, fim de 09.2 (L2500), antes do h3 09.3 (L2532) | Grade de 9 passos: o 1º clique abre e o 2º marca como executado | 3 readouts, veredito e painel | quebra-cabeca | divergente |
| 11 | Roteador de diagnóstico — três classes de veredito | Aula 09, depois da tabela 09.3 (L2555), antes do h3 09.4 (L2612) | Histórico (3), memória de massa (3), plano de produção (3), achado (5) | Veredito e cartões | quebra-cabeca | divergente |

**Menções no texto** (`invocacao.mencoes_no_texto`):
- O §00 cita os Inst · 02, 03, 05, 06, 09 e 10.
- O § Caso (C.4) cita "o instrumento de reativo desta aula", que é o Inst · 06.
- A prosa da Aula 09 cita o veredito do roteador (Inst · 11).

## Entradas (faixa e padrão literais do markup)

| Inst | Campo | Rótulo | Unidade | min–max / passo | Padrão |
|---|---|---|---|---|---|
| 03 | `dd-ctr` | Demanda contratada | kW | 10–20000 / 10 | 1200 |
| 03 | `dd-max` | Maior demanda medida na série | kW | 10–20000 / 10 | 1010 |
| 03 | `dd-med` | Demanda média do período | kW | 1–20000 / 10 | 720 |
| 03 | `dd-mes` | Meses de histórico disponíveis | meses | 1–36 / 1 | 12 |
| 03 | `dd-tol` | Tolerância de ultrapassagem | % | 0–20 / 0,5 | 5 |
| 04 | `ul-ctr` | Demanda contratada | kW | 10–20000 / 10 | 1000 |
| 04 | `ul-med` | Demanda medida no ciclo | kW | 10–20000 / 5 | 1060 |
| 04 | `ul-tol` | Tolerância aplicável | % | 0–20 / 0,5 | 5 |
| 04 | `ul-mul` | Multiplicador da tarifa | vezes | 1–4 / 0,5 | 2 |
| 04 | `ul-tar` | Tarifa de demanda da sua fatura | unidades por kW | 1–300 / 1 | 40 |
| 05 | `dl-tot` | Consumo total do ciclo | MWh | 1–20000 / 5 | 420 |
| 05 | `dl-pta` | Consumo no posto de ponta | MWh | 0–20000 / 1 | 42 |
| 05 | `dl-des` | Fração da ponta tecnicamente deslocável | % | 0–100 / 1 | 30 |
| 05 | `dl-hrs` | Horas de ponta faturadas no ciclo | horas | 1–200 / 1 | 63 |
| 06 | `fp-ref` | Fator de potência de referência | adimensional | 0,5–1 / 0,01 | 0,92 |
| 06 | `fp-ind` | Fator típico na janela diurna — indutivo | adimensional | 0,3–1 / 0,01 | 0,87 |
| 06 | `fp-cap` | Fator típico na janela noturna — capacitivo | adimensional | 0,3–1 / 0,01 | 0,95 |
| 06 | `fp-vd1` | Intervalos em violação — janela diurna | horas no ciclo | 0–600 / 1 | 180 |
| 06 | `fp-vn1` | Intervalos em violação — janela noturna | horas no ciclo | 0–200 / 1 | 0 |
| 06 | `fp-hrs` | Duração da janela noturna de apuração | horas por dia | 1–10 / 1 | 6 |
| 09 | `rb-e1`…`rb-e6` | Sua estimativa — energia / uso da rede / demanda / encargos / tributos / reativo, bandeira e outros | % do total | 0–100 / 1 | 30 / 25 / 15 / 10 / 18 / 2 |
| 09 | `rb-r1`…`rb-r6` | Real — (os mesmos seis blocos), no grupo "Composição real da sua fatura" | % do total | 0–100 / 1 | 26 / 22 / 21 / 9 / 19 / 3 |

**Seletores e grades** (opções literais em `entradas[].opcoes`):

| Inst | Entrada | Opções |
|---|---|---|
| 01 | Lente ativa | Quem define o valor unitário · Quem define a quantidade · Em que ciclo aquilo muda |
| 01 | Linha da fatura | As 14 linhas, de "Consumo de energia — ponta" a "Componentes financeiros e ajustes" |
| 02 | Perfil de carga | Plana em turnos · Diurna com pico na tarde · Desligada na ponta · Errática com picos · Sazonal de safra |
| 02 | Modalidade avaliada | Horária Azul · Horária Verde · Convencional Binômia |
| 02 | Subgrupo da unidade | A4 · A3a · A3 · A2 |
| 07 | Item | As 11 linhas, de "Conta de desenvolvimento energético" a "Contribuição de iluminação pública" |
| 08 | Etapas (a grade não tem rótulo) | As 8 etapas, de "Abertura do processo" a "Reconciliação e decomposição" |
| 10 | Passos (a grade não tem rótulo) | Os 9 passos, de "Cadastro" a "Inventário do que falta", cada um com segundos |
| 11 | Histórico disponível | Uma fatura · Seis meses · Doze meses ou mais |
| 11 | Memória de massa por intervalo | Indisponível · Parcial · Disponível |
| 11 | Plano de produção declarado | Não informado · Estável, sem expansão · Mudança prevista |
| 11 | Achado observado na leitura | Enquadramento suspeito · Demanda descolada · Excedente reativo presente · Volume compatível com ambiente livre · Nada fora do esperado |

**Nota sobre o padrão de campo vazio.** `numOf(el,def,a,b)` (L3560) devolve o `def` quando o campo não é número e
prende o valor entre `a` e `b`. No Inst · 09, o `def` é **0**, não o `value` do markup.

## Saídas: fórmula exata do script

| Inst | Readout (rótulo) | Cálculo (script) | Exibição (`expressao_exata`) |
|---|---|---|---|
| 03 | Utilização do contrato | `util=ctr>0?(max/ctr*100):0` | `fmt(util,1)+'%'` |
| 03 | Fator de carga aparente | `fc=max>0?(med/max*100):0` | `fmt(fc,1)+'%'` |
| 03 | Limite antes de ultrapassar | `lim=ctr*(1+tol/100)` | `fmt(lim,0)+' kW'` |
| 03 | Folga até o limite | `folga=lim-max` | `fmt(folga,0)+' kW'` |
| 04 | Limite de disparo | `lim=ctr*(1+tol/100)` | `fmt(lim,0)+' kW'` |
| 04 | Base da ultrapassagem | `disparou=med>lim`; `base=disparou?(med-ctr):0` | `fmt(base,0)+' kW'` |
| 04 | Parcela de demanda normal | `normal=ctr*tar` | `fmt(normal,0)` |
| 04 | Parcela de ultrapassagem | `pen=base*mul*tar` | `fmt(pen,0)` |
| 04 | Peso da penalidade no total | `total=normal+pen`; `peso=total>0?(pen/total*100):0` | `fmt(peso,1)+'%'` |
| 05 | Participação da ponta hoje | `if(pta>tot){pta=tot;…}`; `p0=tot>0?(pta/tot*100):0` | `fmt(p0,1)+'%'` |
| 05 | Participação após deslocar | `vol=pta*des/100`; `pta1=pta-vol`; `p1=tot>0?(pta1/tot*100):0` | `fmt(p1,1)+'%'` |
| 05 | Volume deslocado | `vol=pta*des/100` | `fmt(vol,1)+' MWh'` |
| 05 | Potência média em ponta | `pot=hrs>0?(pta*1000/hrs):0` | `fmt(pot,0)+' kW'` |
| 06 | Violação na janela diurna | `totDia=(24-hrs)*30`; `vdi` preso a `totDia`; `pd=totDia>0?(vdi/totDia*100):0` | `fmt(pd,1)+'%'` |
| 06 | Violação na janela noturna | `totNoite=hrs*30`; `vno` preso a `totNoite`; `pn=totNoite>0?(vno/totNoite*100):0` | `fmt(pn,1)+'%'` |
| 06 | Distância da referência — diurna | `dd=ref-ind` | `(dd>0?'−':'+')+fmt(Math.abs(dd),3)` |
| 06 | Distância da referência — noturna | `dn=ref-cap` | `(dn>0?'−':'+')+fmt(Math.abs(dn),3)` |
| 08 | Etapas verificadas | `n` = etapas marcadas | `fmt(n,0)+' de '+ET.length` |
| 08 | Situação do dossiê | `n===0` → "Dossiê não iniciado"; `n<4` → "Dossiê parcial"; `n<8` → "Dossiê em construção"; senão "Dossiê completo" | `est` |
| 09 | Soma da estimativa | `se` = Σ estimativas | `fmt(se,0)+'%'` |
| 09 | Soma do real | `sr` = Σ real | `fmt(sr,0)+'%'` |
| 09 | Erro absoluto total | `errTot` = Σ \|est−real\| | `fmt(errTot,0)+' p.p.'` |
| 09 | Maior desvio | `maiorI`/`maiorV`: o primeiro bloco com \|d\| estritamente maior | `NOMES[maiorI]+' · '+(maiorV>0?'+':'')+fmt(maiorV,0)` |
| 10 | Passos executados | `n` = passos marcados | `fmt(n,0)+' de '+PASSOS.length` |
| 10 | Tempo acumulado estimado | `tempo` = Σ `p.t` dos passos marcados | `fmt(Math.floor(tempo/60),0)+' min '+fmt(tempo%60,0)+' s'` |
| 10 | Estado da leitura | `n===0` → "Não iniciada"; `n<3` → "Triagem incompleta"; `n<7` → "Leitura parcial"; `n<9` → "Quase completa"; senão "Leitura completa" | `est` |

### Ramos de veredito (classe → título, dados em `dados_do_script`)

| Inst | Chave de escolha | Faixas / ramos |
|---|---|---|
| 02 | `m==='conv'` → per; senão elegível (`ELEG[s]`) → ok, e inelegível → per | "Modalidade elegível ao subgrupo X." · "Modalidade indisponível ao subgrupo X." · "Não é opção ordinária de enquadramento." `ELEG` = {a4: azul, verde; a3a: azul, verde; a3: azul; a2: azul}. `CEL` tem 15 células (modalidade \| perfil) |
| 03 | 1ª faixa com `util<=max` | ≤60 "Folga muito ampla" · ≤80 "Folga relevante" · ≤95 "Dimensionamento ajustado" · ≤105 "Operação na borda" · senão "Contrato insuficiente". Há notas extras para `mes<6` e `mes<12`, e um cartão "Zona de decisão de risco" quando `80<util<=95` e `mes>=12` (substituído por "Não é possível concluir" quando `mes<12`) |
| 04 | Se não disparou: `margem=(lim-med)/ctr*100` e `margem>2` → FAIXA[0], senão FAIXA[1]. Se disparou: `exc=(med/ctr-1)*100` e `exc<=15` → FAIXA[2], senão FAIXA[3] | "Sem cobrança e com margem" · "Na borda do gatilho" · "Ultrapassagem disparada" · "Descolamento substancial". Os campos `max` de FAIXA (0/2/15/1e9) não são os usados na escolha |
| 05 | 1ª faixa com `p0<=max` | ≤4 "Participação estruturalmente baixa" · ≤10 "Participação compatível com regime contínuo" · ≤18 "Concentração acima do proporcional" · senão "Concentração elevada" |
| 06 | `temInd=(vdi>0&&ind<ref)`, `temCap=(vno>0&&cap<ref)` | limpo "Sem violação nas duas janelas" · ind-pont "Violação indutiva pontual" (`pd<=25`) · ind-estr "Violação indutiva estrutural" (`pd>25`) · cap "Violação capacitiva — sobrecompensação" · ambas "Violação nas duas janelas" |
| 08 | `n` | n=0 "Nenhuma etapa verificada." e depois vereditos por estado |
| 09 | Classe: `errTot<=12` ok, `<=28` att, senão per. Título: `DIAG[key]` com `\|maiorV\|>=6` | energia "Viés de superestimação da energia" · demanda "Viés de subestimação da demanda" · rede "Viés na leitura do uso da rede" · tributos "Viés na leitura da carga tributária" · equilibrado "Estimativa calibrada". Aviso de soma quando \|se−100\|>2 ou \|sr−100\|>2 (**ver achado A1**) |
| 10 | `n` | "Leitura não iniciada." · "Triagem incompleta — n de 9." · "Leitura parcial — n de 9, com X acumulados." · "Quase completa — n de 9." · "Leitura completa em X." |
| 11 | `score(h,m,p)`: doze +3 / seis +1; sim +3 / parcial +1; estável +2 / mudança +1 | `a==='nada'&&s>=6` ok "Não vale investigar nas condições informadas" · `s>=6` att "Vale investigar" · `s<=1&&a!=='nada'` per "Não é possível concluir com o que foi informado" · `s<=1&&a==='nada'` per (mesmo título, outro corpo) · senão att "Não é possível concluir — investigação parcial viável". Lista `falta[]` por condição |

## Cenário-padrão (medido no carregamento)

| Inst | Readouts | Veredito (título) |
|---|---|---|
| 01 | — | Painel da lente "Quem define o valor unitário"; painel de linha vazio |
| 02 | — | "Modalidade elegível ao subgrupo A4." (ok) |
| 03 | 84,2% · 71,3% · 1.260 kW · 250 kW | "Dimensionamento ajustado." (ok) |
| 04 | 1.050 kW · 60 kW · 40.000 · 4.800 · 10,7% | "Ultrapassagem disparada." (per), com base de 60 kW e não de 10 kW |
| 05 | 10,0% · 7,0% · 12,6 MWh · 667 kW | "Participação compatível com regime contínuo." (ok) |
| 06 | 33,3% · 0,0% · −0,050 · +0,030 | "Violação indutiva estrutural." (per) |
| 07 | — | Painel "Anatomia / Escolha um item" |
| 08 | 0 de 8 · Dossiê não iniciado | "Nenhuma etapa verificada." (per) |
| 09 | 100% · 100% · 16 p.p. · Demanda · -6 | "Viés de subestimação da demanda." (att) |
| 10 | 0 de 9 · 0 min 0 s · Não iniciada | "Leitura não iniciada." (per) |
| 11 | — | "Não é possível concluir com o que foi informado." (per) |

Os HTMLs completos estão em `cenario_padrao`.

## Fonte dos números (`fonte_dos_numeros`)

| Inst | O que a fonte declara | Sem fonte declarada |
|---|---|---|
| 01 | Instrumento de consulta; "a legenda da própria fatura é a fonte de tradução" | — |
| 02 | Elegibilidade = tabela 02.1: "Fonte: ANEEL, página oficial de Modalidades Tarifárias, e Resolução Normativa nº 1.000/2021, art." | Células `CEL` |
| 03 | Tolerância de 5% como "valor de referência geral… deve ser confirmada no texto compilado vigente e no contrato de uso" | 1.200 / 1.010 / 720 / 12; cortes 60/80/95/105 |
| 04 | Tarifa 40 declarada genérica ("unidades monetárias genéricas"). Multiplicador 2 pela leitura da REN 1.000/2021, art. 301, **com divergência ativa registrada pela própria fonte**. 1.000/1.060 = exemplo do texto 03.3 | Cortes 2% e 15% |
| 05 | 63 h = três horas × vinte e um dias úteis (aviso) | 420 / 42 / 30%; cortes 4/10/18 |
| 06 | 0,92: REN 1.000/2021, art. 302. Janela noturna de 6 h na prosa da Aula 05. Ciclo de 30 dias como suposição do aviso | Corte de 25% |
| 07 | Normas citadas item a item (Lei 15.269/2025, Lei 15.235/2025, REN 1.147/2025, § 19 do art. 13 da Lei 10.438/2002); consulta em 1º/8/2026 | — |
| 08 | A cadência depende do contrato de concessão (aviso) | Limiares 0/4/8 |
| 09 | Valores iniciais "servem apenas para…", sem composição típica nacional (aviso) | Valores iniciais; cortes 6, 12 e 28 p.p. e 2 p.p. |
| 10 | Tempos "orientativos" (aviso); envelope de 5 min do §00.3 | Tempos por passo (soma 280 s) |
| 11 | — | Pesos 3/1, 3/1, 2/1 e cortes ≥6 e ≤1 |

**P19 aplicado.** Nenhum valor inicial vira dado real. São "cenário didático presente no módulo; fonte externa dos
valores não declarada", salvo onde a coluna do meio cita norma.

**Tolerâncias.** Nenhuma foi declarada. Os limiares são lógica de classificação, não tolerância de correção.

## Achados fonte × fonte (registrados, não resolvidos)

**A1 · Inst · 09, mapeamento do viés** (`achados_na_fonte[0]`, script L4430–4440). Medido no script original:

| Estimativa × real (26/22/21/9/19/3) | Maior desvio | Título exibido |
|---|---|---|
| Demanda **super**estimada (+10) | Demanda · +10 | "Viés de subestimação da demanda." |
| Demanda subestimada (−10) | Demanda · -10 | "Viés de subestimação da demanda." |
| Energia subestimada (−10) | Energia · -10 | "Viés na leitura do uso da rede." |
| Encargos +12 | Encargos · +12 | "Estimativa calibrada." |
| Reativo e outros +12 | Reativo e outros · +12 | "Estimativa calibrada." |

- **Leitura A.** O texto de `DIAG.demanda` diz que o aluno atribui à demanda peso **menor** do que ela tem.
- **Leitura B.** O ramo `maiorI===2&&maiorV>0` também leva a essa chave. Um desvio de 12 p.p. em encargos ou reativo
  sai como "calibrada".
- **No código.** A porta reproduz o mesmo mapeamento (conferido chamando a calculadora nos mesmos casos).

**A2 · Inst · 10, tempo dos três primeiros passos.**
- A Aula 09 (L2502) diz "menos de um minuto somados".
- O veredito do script (L4553) diz "menos de um minuto e meio somados".
- Os dados somam **75 s** (20 + 15 + 40), e os nove passos somam 280 s. É a mesma divergência da div-09 do
  `modulo.json`.

**A3 · Reescrita de campo (Inst · 05 e 06).** O script grava de volta no campo o valor preso ao limite:
- Inst · 05: `pta>tot` → `dl-pta := tot`;
- Inst · 06: `vdi`/`vno` presos às horas da janela.

Isso é comportamento do original, não defeito do código. O resultado depende da ordem das edições.

## Comparação com o código (`comparacao_codigo`)

**Base.** `INSTRUMENTOS_MODULO_10` (`alexandria-modulo-10-content.ts`) e `INSTRUMENT_CALCULATORS`
(`alexandria-instrument-calculators.ts`).

**O que confere nos 11:**
- títulos idênticos;
- nota = intro + aviso;
- dados (`LENTE`, `LINHAS`, `PERFIL`, `ELEG`, `SGNOME`, `CEL`, `FAIXA`, `ENC`, `ET`, `NOMES`, `DIAG`, `PASSOS`,
  `ACHADO`) com **0 diferença** contra as constantes `MODULO_10_*`;
- **0 divergência numérica** nas varreduras;
- vínculo de aula certo (o Inst · 01 fica sem aula, como na fonte).

| Inst | Estado | Divergências |
|---|---|---|
| 01 | divergente | A grade sem seleção virou select `mf-linha`, com padrão "te-p". O código reescreve os rótulos do painel: 70 folhas da fonte não aparecem literalmente (ex.: "Lente ativa", "Tributos · Quem define o valor unitário"), e 51 trechos só existem no código |
| 02 | **portado** | — (60 casos, espaço inteiro, texto e títulos idênticos) |
| 03 | divergente | A nota perde o `<b>` do intro e deixa espaço antes da pontuação ("plano de produção ."). Todas as saídas têm `unit: null` (na fonte o sufixo vem da expressão) |
| 04 | divergente | `unit: null` nas saídas |
| 05 | divergente | Nota com `<b>` perdido. `unit: null`. O código não grava o valor preso: com as mesmas edições (`dl-pta`=500 e depois `dl-tot`=1000), a fonte mostra 42,0% e o código 50. As barras `dl-bars` ("Ponta hoje", "Ponta depois", "Fora de ponta" e os MWh) não existem no código (47 folhas) |
| 06 | divergente | `unit: null`. Reescrita de campo: com `fp-vn1`=200 e depois `fp-hrs`=10, a fonte mostra 60,0% e o código 66,67 |
| 07 | divergente | A grade virou select `en-sel`, com rótulo "Item de encargo" (fonte: "Item") e padrão "cde". Não há estado "Escolha um item" (3 folhas). 1 trecho de rótulo só no código |
| 08 | divergente | A grade virou select `rc-sel` ("Etapa em foco", padrão "e1"), e a marcação por segundo clique virou 8 selects Não/Sim ("Etapa 1 — verificada"). O readout "Situação do dossiê" (`rc-est`) não existe no código: vira prosa no veredito ("Situação do dossiê: …"). `unit: null`. 12 folhas ausentes e 22 trechos só no código |
| 09 | divergente | O readout "Maior desvio" (`rb-maior`) não existe no código. `unit: null`. O rótulo "Erro por bloco" só existe no código |
| 10 | divergente | A grade virou select `ol-sel` ("Passo em foco"), mais 9 selects "— executado". O readout "Estado da leitura" (`ol-est`) não existe no código. `unit: null`; o tempo sai em segundos, e a fonte mostra "X min Y s". Título do veredito final: fonte "Leitura completa em 4 min 40 s." × código "Leitura completa — nove de nove, em 4 min 40 s.". Rótulos do painel reescritos ("O que se olha" → "O que olhar"; "O que torna os demais irrelevantes" → "Achado que muda tudo"). 27 folhas ausentes e 14 trechos só no código |
| 11 | divergente | Nota com `<b>` perdido. **A árvore de ramos foi reescrita**, detalhada abaixo |

**A árvore de ramos do Inst · 11 no código.**
- **Na fonte:**
  - `s<=1` → "Não é possível concluir com o que foi informado" (20 dos 135 casos);
  - o restante abaixo de 6 → "Não é possível concluir — investigação parcial viável" (90 casos).
- **No código:**
  - `s>=3` → "Vale investigar, com ressalva de material" (70 casos);
  - senão → "Material insuficiente para diagnóstico" (40 casos).
- **Efeito.** Nenhum dos dois títulos do código existe na fonte, e os dois títulos da fonte não aparecem no código. A
  varredura dá 100 folhas ausentes e 151 trechos só no código.
- **Cartões.** Os rótulos também mudam: "O que este achado exige para concluir" vira "O que exige", "O que já é
  afirmável com o disponível" vira "O mínimo que já responde", e o código usa "Sem os dados" e "O que ainda falta".
  Os rótulos "Lista do que falta" e "A resposta a 'quanto eu economizo'" não aparecem literalmente.
- **Valor extra.** A calculadora devolve `valores['rt-score']`, que não tem readout na fonte e não é declarado em
  `outputs`.

**`kind` no código.**

| `kind` | Instrumentos |
|---|---|
| explorador | 01, 07 |
| comparador | 02, 09 |
| dimensionador | 03 |
| simulador | 04, 05, 06 |
| quebra-cabeca | 08, 10, 11 |

A fonte não declara `kind`. É decisão do código (§3), registrada aqui sem juízo.

**Alcance na interface (deduzido da leitura, não medido na tela).** `RecursosDoModulo.tsx` não registra
`modulo-10`: não importa `INSTRUMENTOS_MODULO_10` nem `MODULO_10_EXERCICIOS_SOLTOS`. O Inst · 01, que é fora de aula,
parece inalcançável (div-12 do `modulo.json`).

## Comparação com o catálogo canônico

Os 11 nomes são idênticos aos títulos da fonte (`catalogo_canonico.nome_igual_ao_titulo_da_fonte` = true, L975–985).
As descrições do catálogo são paráfrases e ficam fora da verificação verbatim. Não há divergência de nome nem de
contagem.

## Lacunas

- **Pergunta própria.** Nenhum instrumento tem. Se houver pergunta de previsão, ela é da camada Alexandria (P19).
- **Respostas.** Nenhum declara tolerância ou resposta de referência. O Inst · 09 declara que "não devolve nota".
- **Fonte dos números.** Não é declarada para os valores iniciais dos Inst · 03, 05 e 09 nem para os limiares de
  faixa de todos.
- **Desenho.** As barras dos Inst · 05 e 09 não portam como desenho (§12). O texto delas foi extraído em
  `cenario_padrao.outros_html`.

## Verificação (verificador adversarial, 2026-09-17)

**Fórmulas, 100%.**
- As 11 `logica_literal.codigo` foram comparadas às linhas `linha..linha_fim` do HTML, com os literais elididos como
  lacunas: início, meio e fim batem.
- As 26 `expressao_exata` estão na `expressao_linha` declarada.
- Os literais de `dados_do_script` estão na linha declarada.

**Entradas e saídas recontadas no markup.**
- Entradas: 2 + 3 + 5 + 5 + 4 + 6 + 1 + 1 + 12 + 1 + 4 = **44**.
- Saídas: 4 + 5 + 4 + 4 + 2 + 4 + 3 = **26**.
- 120 origens foram conferidas em ±3 linhas.

**Cenário do Inst · 05, recalculado à mão.** Deu 10,0% · 7,0% · 12,6 MWh · 667 kW, na faixa "compatível" (≤10).

**Achados A1–A3, confirmados no script.**
- **A1.** Ramos `maiorI`/`maiorV` em L4430–4440.
- **A2.** Tempos 20/15/40/20/30/25/60/30/40: 75 s nos três primeiros passos, 280 s no total. O texto está em L2502
  e L4553.
- **A3.** `if(pta>tot){…value=pta}` na fonte × clamp só no valor no código: 42,0% × 50.

**Divergências com o código, conferidas nos arquivos.** Nenhuma inventada:
- Inst · 11: títulos e `rt-score`.
- Inst · 08 e 10: "Situação do dossiê" e "Estado da leitura" existem só como prosa no veredito (L1097 e L1191), e o
  título "Leitura completa — nove de nove" foi reescrito.
- Inst · 07: "Item de encargo".

**Nenhuma correção neste grupo.**
