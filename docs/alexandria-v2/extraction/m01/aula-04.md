# M01·A04: Tensão, corrente e perdas

**Por que perdas crescem ao quadrado. E por que isso desenhou toda a rede.**

Arquivo de dados: [`aula-04.json`](aula-04.json).

- **Fonte (só leitura):** `C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo01.html`, 3.212 linhas. A section da aula ocupa as linhas 1651 a 1724 (o comentário de abertura está nas linhas 1648 a 1650).
- **Camada de script:** o script do INST·03 está nas linhas 2794 a 2821 e foi extraído linha a linha e executado contra um DOM mínimo (instrumentos[0].script e medido_execucao_script_simulada).
- **Como foi extraído:** `extratores/gen-aulas-03-04.mjs` percorre a section linha a linha e lança erro se encontrar uma linha que não classifica. O campo `html` guarda o innerHTML literal; `texto` guarda o mesmo sem tags (tags removidas sem espaço, então `<sub>`/`<span>` vizinhos colam). Nenhuma prosa foi digitada à mão.
- **Cobertura por token (§5):** 465 de 465 tokens casados (100%), sem contar o markup do instrumento. Tokens não casados: nenhum.
- **Verificação:** ver a seção "Verificação" no fim.

## Estrutura do JSON

| Chave | Conteúdo |
|---|---|
| `meta` | Fonte, linhas, método, convenções de id e de campos medidos |
| `aula` | Marcador ("Aula 04"), título do h2 (html e texto), comentário de abertura e a pergunta do § MAP (L1342): "Por que transmissão usa alta tensão? Por que perdas crescem ao quadrado?". Duração, dificuldade e vídeo ficam em `null`, com nota |
| `blocos[]` | 13 blocos na ordem da fonte (ver mapa abaixo). Cada bloco tem `origem {seletor, trecho_inicial, linha_aprox, linha_fim_aprox}` |
| `tabelas` / `listas` / `destaques` | ids dos blocos de cada tipo: 1 tabela(s), 1 lista(s), 1 destaque(s). "Vale lembrar" não existe na fonte |
| `paragrafos_que_terminam_em_dois_pontos` | Medida de quais parágrafos prometem um bloco seguinte e qual bloco a fonte põe em seguida |
| `termos_lexico` | Candidatos por correspondência textual (sem vínculo declarado), com contexto e a leitura de cada um |
| `instrumentos[]` | INST·03 completo: campos (number + range gêmeo), saída, nota estática, cenário-padrão medido, execução simulada e script literal |
| `exercicios[]` / `exercicios_verificacao` | Ex · 03 com enunciado e gabarito verbatim; as 8 tags verbatim e a varredura de referências em prosa |
| `relacionados_nao_vinculados[]` | m01-quiz-q03, m01-checklist-06, m01-checklist-07, m01-tradutor-04 (sem tag de aula, fora da posse da aula, P9) |
| `ocorrencias_fora_da_secao` | Varredura do arquivo inteiro por padrão temático (47 ocorrências) com a leitura por seção |
| `divergencias[]` | 4 divergências da fonte, cada uma com as duas leituras e sem escolha |
| `comparacao_codigo` | Verificação estruturada contra o .ts, o que está conforme e 12 divergências COD |

## Mapa de blocos

| # | Tipo | Linhas | Início do texto |
|---|---|---|---|
| 1 | lead | L1656 | Toda a arquitetura física do sistema elétrico brasileiro — a |
| 2 | titulo 4.1 | L1658 | De onde vem a perda |
| 3 | paragrafo | L1659 | Quando corrente elétrica passa por um condutor com resistênc |
| 4 | formula | L1661–1664 | Pperdas = I2 × R |
| 5 | paragrafo | L1666 | O exponencial é o que muda tudo. Se a corrente dobra, as per |
| 6 | instrumento | L1669–1695 | Calculadora · Perdas resistivas |
| 7 | titulo 4.2 | L1697 | A solução: trocar corrente por tensão |
| 8 | paragrafo | L1698 | Para transmitir a mesma potência (P = V × I), você pode esco |
| 9 | lista | L1700–1704 | Transmissão usa tensões altíssimas (230 kV, 345 kV, 500 kV,  |
| 10 | destaque | L1706–1709 | Por que isso aparece na sua fatura |
| 11 | titulo 4.3 | L1711 | Perdas técnicas vs. perdas não técnicas |
| 12 | tabela | L1712–1720 | Tipo |
| 13 | paragrafo | L1722 | Para o analista, essa distinção importa porque perdas não té |

**Contagens.** 13 blocos: lead 1, titulo 3, paragrafo 4, formula 1, instrumento 1, lista 1, destaque 1, tabela 1. Seções 4.1, 4.2, 4.3. Fórmulas 1 (1 com descrição). Figuras 0, tabelas 1, listas 1, destaques 1, instrumentos 1. Exercícios vinculados 1, relacionados sem vínculo 4, termos candidatos 7 entre os 38 do léxico. Divergências: 4 da fonte e 12 com o código.

## INST·03: resumo da especificação

- **Título:** "Calculadora · Perdas resistivas". O id na fonte é "INST · 03". Na taxonomia, o kind é `calculadora`.
- **Pergunta:** `null`. A prancha não tem pergunta própria; a pergunta da aula está no § MAP.
- **Entradas** (cada uma é um input number com deslizador gêmeo):

| Id | Rótulo | Unid. | Padrão | Number: mín / máx / passo | Range: mín / máx / passo |
|---|---|---|---|---|---|
| `i03-i` | Corrente | A | 100 | 0 / sem máx. / 5 | 10 / 500 / 5 |
| `i03-r` | Resistência | Ω | 0.5 | 0 / sem máx. / 0.1 | 0.1 / 5 / 0.1 |

- **Saída `i03-out`:** "Perda dissipada", em W. O script calcula `const P = I * I * R` (com as coerções `|| 0` das duas leituras) e escreve em pt-BR com 0 casas decimais.
- **Texto de leitura:** não há. O `div.instrument-note` é estático ("Dobre a corrente. Veja a perda quadruplicar. Esse comportamento exponencial é a razão por que transmissão de energia em escala continental usa alta tensão.") e o script não o toca.
- **Cenário-padrão:** 100 A e 0.5 Ω. A marcação traz "5,000" e o script escreve "5.000" (DIV-01).
- **Medido contra a própria nota:** dobrar a corrente quadruplica a saída (confere); triplicar multiplica por 9 (confere).
- **Fonte dos números:** `null`. A fonte não cita procedência para o cenário nem para as faixas dos deslizadores.
- **Tolerâncias:** `null`. Nenhuma declarada (P6); o instrumento não tem previsão nem correção.

| Caso (execução do script original) | Saída |
|---|---|
| carregamento, padrões da marcação | 5.000 W |
| dobra a corrente (200 A, 0,5 Ω) | 20.000 W |
| triplica a corrente (300 A, 0,5 Ω) | 45.000 W |
| valores fracionários que arredondam (15 A, 0,3 Ω = 67,5 W) | 68 W |
| campo vazio (corrente "") | 0 W |
| número fora da faixa do deslizador (600 A) | 180.000 W |

## Onde o instrumento é invocado (C5)

1. **L1666, último parágrafo de 4.1.** Termina em "…as perdas crescem nove vezes. Veja:". O `div.instrument` vem logo depois (L1669–1695) e antes do h3 **4.2**. A posição correta é esta: depois de "Veja:", antes de "A solução: trocar corrente por tensão".
2. A nota do próprio instrumento ("Dobre a corrente. Veja a perda quadruplicar.") repete a lição do parágrafo; não remete a outro bloco.

## Parágrafos que terminam em ":" (o que a fonte põe depois)

| Parágrafo | Termina em | Próximo bloco na fonte |
|---|---|---|
| L1659 | "…de toda a engenharia elétrica:" | formula |
| L1666 | "…perdas crescem nove vezes. Veja:" | instrumento |
| L1698 | "…longo dos cabos. Por isso:" | lista |

## Exercício

**Ex · 03 · Aula 04** (L2409–2416): Se a corrente em um condutor dobra, o que acontece com as perdas resistivas? Por quê? O gabarito está verbatim no JSON; o botão da fonte é "Revelar gabarito". Ex · 03 (tag "Ex · 03 · Aula 04") é o único exercício vinculado. Nenhum outro enunciado ou gabarito cita a Aula 04 em prosa (medido).

## Relacionados sem vínculo de aula (P9)

- `m01-quiz-q03` (L3090): Se a corrente em um cabo triplica, o que acontece com as perdas resistivas?
- `m01-checklist-06` (L2502): Explicar a Lei de Ohm e por que perdas crescem com I².
- `m01-checklist-07` (L2503): Justificar fisicamente por que transmissão usa alta tensão.
- `m01-tradutor-04` (L2370): Corrente alta · perdas

## Léxico: candidatos e leitura do contexto

| Termo | Ocorrências (palavra) | Leitura |
|---|---|---|
| Energia | 5 | Ocorrências em sentido genérico ("energia elétrica se transforma em calor", "dissipa menos energia", "custo da energia em si"). Não é o assunto declarado; não mapear. |
| Grupo A | 1 | Uma ocorrência, em "Grupo A1, A2" (subgrupos), no callout de 4.2. O verbete "Grupo A" define a classe e sua subdivisão está sob a pendência QA-M01-A06 (decisão do Founder, não resolvida aqui). Não mapear sem essa decisão. |
| Perdas técnicas | 3 | Conceito do verbete e assunto de 4.2 (callout) e 4.3 (título e tabela). Ligação plausível, não declarada. |
| Perdas não técnicas | 2 | Conceito do verbete e assunto de 4.3 (título, tabela, último parágrafo). Ligação plausível, não declarada. |
| Potência | 1 | Uma ocorrência, em "transmitir a mesma potência (P = V × I)", no sentido do verbete. Assunto lateral da aula; ligação fraca. |
| Tensão | 11 | Conceito do verbete, assunto de 4.2 ("tensão alta com corrente baixa") e do marcador. Ligação plausível, não declarada. |
| TUSD | 2 | Conceito do verbete: "TUSD-fio" no callout e "embutidas na TUSD" na tabela 4.3. Ligação plausível, não declarada. |
| (sem verbete) | — | "Efeito Joule" e "dissipação resistiva" (4.1) não têm verbete. "Lei de Ohm" tem verbete cuja definição cita P = I² × R (perdas resistivas), mas o nome não ocorre no texto da A04 (ocorre na A02). |

## Divergências na fonte (sem escolha)

- **DIV-01** (fonte_marcacao_x_script). Saída inicial do INST·03: o texto da marcação e o que o script escreve no carregamento.
  - Leitura A (L1689): "<span id="i03-out">5,000</span>"
  - Leitura B (L2808): "out.textContent = P.toLocaleString('pt-BR', { maximumFractionDigits: 0 });"
  - Com os padrões da marcação (100 A, 0,5 Ω) o script, executado contra um DOM mínimo, escreve "5.000" (calc() roda no carregamento), enquanto a marcação traz "5,000": o mesmo valor numérico de entrada com separador diferente. O learner vê a saída do script. A fonte não diz qual formato é o pretendido.
  - Decisão: não escolhida — as duas formas coexistem na fonte.
- **DIV-02** (terminologia_interna). A aula descreve a relação da perda com a corrente ora como "ao quadrado", ora como "exponencial".
  - Leitura A (L1666): "O exponencial é o que muda tudo." e "Esse comportamento exponencial é a razão por que transmissão de energia em escala continental usa alta tensão." (L1692)
  - Leitura B (L1654): "Por que perdas crescem ao quadrado." e "Perdas resistivas crescem com o quadrado da corrente" (L1663) e "Esse crescimento quadrático" (L3093)
  - O título, a legenda da fórmula e o feedback do quiz usam "quadrado/quadrático"; o parágrafo de 4.1 e a nota do instrumento usam "exponencial". A fórmula da própria aula é P = I² × R (L1662). A fonte não distingue os dois termos. Observação do extrator (não é fato da fonte): o texto trata como sinônimos dois rótulos que a fórmula da aula não trata como iguais; não foi alterado.
  - Decisão: não escolhida — rótulos preservados como na fonte.
- **DIV-03** (relacao_sem_ressalva). A 4.2 usa "P = V × I" para a transmissão sem a ressalva que a Aula 02 e o léxico fazem.
  - Leitura A (L1698): "Para transmitir a mesma potência (P = V × I)"
  - Leitura B (L1515): "Em corrente contínua (e como aproximação inicial em corrente alternada), a relação é direta:" e "P = V × I (potência em DC)" (L2621) e "todo sistema interligado em corrente alternada" (L1629)
  - A Aula 02 apresenta P = V × I como relação direta "em corrente contínua (e como aproximação inicial em corrente alternada)" e o léxico (Lei de Ohm) a rotula "potência em DC"; a Aula 03 diz que o sistema interligado é de corrente alternada. A 4.2 aplica a mesma expressão à transmissão sem qualificar. Não se afirma erro: a fonte só não repete a ressalva.
  - Decisão: não escolhida — texto preservado como na fonte.
- **DIV-04** (campo_duplo_com_faixas_diferentes). Cada campo do INST·03 tem um input number e um deslizador gêmeo com limites diferentes.
  - Leitura A (L1678): "<input type="number" id="i03-i" value="100" min="0" step="5">" e "<input type="number" id="i03-r" value="0.5" min="0" step="0.1">" (L1683)
  - Leitura B (L1679): "<input type="range" id="i03-i-range" min="10" max="500" value="100" step="5">" e "<input type="range" id="i03-r-range" min="0.1" max="5" value="0.5" step="0.1">" (L1684)
  - O number não tem max e aceita 0; o deslizador vai de 10 a 500 A e de 0,1 a 5 Ω. O script calcula sempre a partir dos valores dos inputs number e copia o valor de um para o outro nas duas direções. Medido: com 600 A digitado, a saída do script é 180.000 (600² × 0,5); o que o navegador faz com o deslizador nesse caso não foi medido aqui.
  - Decisão: não escolhida — as duas faixas coexistem; o porte (campo único) precisa decidir qual vale.

## Divergências em relação ao código portado

| Id | Gravidade | Onde | Divergência | Fonte |
|---|---|---|---|---|
| COD-01 | alta | MODULO_01_CORPO['aula-01-04'] bloco de 4.2 | A lista (ul com 3 li: Transmissão, Subtransmissão e distribuição, Baixa tensão residencial) não foi portada. O parágrafo de 4.2 termina em "Por isso:" e, no código, o próximo bloco é o callout: o parágrafo termina no vazio. É a lista que traz os níveis de tensão de cada trecho da rede (230–750 kV, 13,8–138 kV, 127/220 V). ApostilaPanel já tem o kind lista (l.124); a perda é de porte, não de componente. | L1698–1704 |
| COD-02 | alta | AulaViewer.tsx + MODULO_01_AULAS aula-01-04 .instruments | O INST·03 não tem posição no fluxo: fica em aula.instruments e é renderizado depois de TODA a apostila (AulaViewer.tsx l.123–127). Na fonte ele está entre o parágrafo de 4.1 que termina em "Veja:" e o h3 4.2. Viola C5 (posição no ponto da prosa) e a Regra-mãe 1; o "Veja:" fica sem nada depois. | L1666–1697 |
| COD-03 | média | MODULO_01_CORPO['aula-01-04'] fórmula de 4.1 | A fórmula foi portada como eq "P perdas = I 2 × R" com desc: null. A fonte tem eq com <sub>perdas</sub> e <sup>2</sup> (texto sem tags: "Pperdas = I2 × R") e div.desc "Perdas resistivas crescem com o quadrado da corrente". Os índices viraram texto solto com espaço ("P perdas", "I 2") e a descrição se perdeu. Observação: o campo formula.eq do componente é texto puro (protocolo §14), então a forma fiel (eq_html) não cabe sem decisão de render. | L1661–1664 |
| COD-04 | média | MODULO_01_CORPO['aula-01-04'] callout de 4.2 | O callout (sem classe de tom) foi portado como nota { tom: "neutro", label: null, html: "Por que isso aparece na sua fatura" } seguida de parágrafo solto com o corpo. Na fonte o texto é o RÓTULO (div.callout-label) e o parágrafo é o CORPO do mesmo callout. O corpo está verbatim; o tom "neutro" é do código (a fonte não declara tom). | L1706–1709 |
| COD-05 | média | INSTRUMENTOS_MODULO_01 inst-03 .formula | formula = "P = I² × R" não existe no HTML dentro do instrumento. A fórmula da aula é a div.formula de 4.1 (P com <sub>perdas</sub>, I com <sup>2</sup>), fora do div.instrument; o instrumento não declara fórmula. | L1661–1664 (eq); instrumento L1669–1695 |
| COD-06 | baixa | INSTRUMENTOS_MODULO_01 inst-03 .fields | Cada par number+range virou 1 campo kind "range" (protocolo §12): i03-i min 10 max 500 step 5; i03-r min 0.1 max 5 step 0.1. Na fonte o input number tem min 0 e não tem max; só o range tem 10–500 e 0,1–5 (DIV-04). O código adotou as faixas do range e perdeu a do number. | L1678–1684 |
| COD-07 | baixa | InstrumentPanel.tsx fmt() (l.705) + alexandria-instrument-calculators.ts | Formatação da saída: a fonte usa toLocaleString pt-BR com 0 casas (maximumFractionDigits: 0): 15 A × 0,3 Ω = 67,5 W aparece "68". O painel usa até 2 casas para saídas que não são R$ ("67,5"). Não medido na renderização; deduzido do código (mesmo achado da COD-07 da aula-08). | L2808 |
| COD-08 | baixa | alexandria-instrument-calculators.ts n() | n() usa Number(v) e o original usa parseFloat(v) \|\| 0 (L2805–2806). Diferem para strings com sufixo não numérico ("12abc"); com input type=number a diferença é praticamente inalcançável. Registrada por fidelidade (§10). A lógica P = I² × R é a mesma. | L2805–2807 |
| COD-09 | baixa | MODULO_01_AULAS aula-01-04 activities[0].points | `points: 1` não tem origem na fonte (o § Drill não pontua exercícios). Valor atribuído pelo código. Tag, enunciado e gabarito do Ex · 03 estão verbatim. | L2409–2416 |
| COD-10 | baixa | MODULO_01_AULAS aula-01-04 .illustrations | illustrations lista fis-03-transformador-elevador.png; a fonte não tem nenhum <img> (medido no arquivo inteiro). Origem a confirmar fora desta extração. | arquivo inteiro (0 <img>) |
| COD-11 | baixa | alexandria-glossario.ts aulaIds | aulaIds inclui "aula-01-04" em 6 verbetes (Energia; Perdas técnicas; Perdas não técnicas; Potência; Tensão; TUSD). A fonte não declara aula por termo; ligação derivada pelo código. "Energia" e "Potência" casam só por sentido genérico (ver leitura_do_contexto). | L2540–2680 |
| COD-12 | informativa | ids | Código usa "aula-01-04", "inst-03", "ex-03"; esta extração usa "m01-a04", "m01-inst-03", "m01-ex-03". Mapeamento 1:1. | — |

**O que está conforme:**
- Lead verbatim; títulos 4.1–4.3 conferem; os 4 parágrafos (4.1 ×2, 4.2, 4.3) verbatim; a tabela 4.3 (cabeçalho + 2 linhas × 3 colunas) verbatim, célula a célula.
- Corpo do callout verbatim.
- Título da aula = texto do h2 sem <em> (conferido); subtítulo = marcador (conferido).
- INST·03: título, ids dos campos, rótulos, unidades, padrões (100 / 0,5), rótulo e unidade da saída e a nota estática verbatim; a lógica P = I² × R é a mesma do script.
- Ex · 03: tag, enunciado e gabarito verbatim; vinculado à aula-01-04 pela tag.
- durationMinutes/difficulty/video = null, coerente com a fonte.

## O que a fonte não tem (ausência declarada)

- Sem duração, dificuldade, vídeo, <img>, referência por aula ou "Vale lembrar" dentro da section. Medido na section L1651–1724; o arquivo inteiro não tem <img>, <video> nem <iframe>.
- Pergunta de previsão, tolerâncias, gabarito de instrumento: não existem na fonte (P3/P6/P11).
- O instrumento não tem fonte dos números nem texto de leitura dinâmico.
- Vínculo entre aula e termo do léxico, ou entre aula e item de quiz/checklist: não declarado.

## Pendências do Founder

Esta aula não toca QA-M01-A06 (Grupo A ≥ 2,3 kV × subgrupo AS) nem QA-M01-A07 (FP 0,85 → 15% de reativos). O callout de 4.2 cita "Grupo A1, A2" (subgrupos); não foi lido como pendência, só registrado em termos_lexico.

## Verificação

<!-- verif:start -->
Rodei `node extratores/verify-aulas-03-04.mjs` (independente do gerador) em 2026-11-14. Resultado:

- 1) LITERAL   strings de conteúdo verificadas: 202; presentes: 202 (155 dentro da janela de origem ±3 linhas, 47 só por existência no arquivo); falhas de literal: 0. Chaves editoriais ignoradas (nota/argumento/decisão/medido…): 243.
- 2) ORIGEM    origens com linha: 113; trecho inicial achado dentro de ±3 linhas: 113; falhas: 0.
- 3) LINHAS    linhas de conteúdo na section: 48 (+26 estruturais: div/section/comentário/branco); sem bloco dono: 0; com mais de um dono: 0; blocos em ordem crescente.
- 4) COBERTURA 465 de 465 tokens da fonte casados (100%) (markup do instrumento fora do denominador, §5); não casados: nenhum; tokens extraídos sem par na fonte (duplicações de html/texto não contam; só campos canônicos): 0.
- 5) CONSISTÊNCIA pares html/texto conferidos: 24; linhas de script conferidas contra o HTML cru: 25; falhas: 0.
- 6) .TS       blocos ditos verbatim e achados no .ts: 5; blocos ditos ausentes e confirmados ausentes: 1; falhas: 0.

**RESULTADO: 0 falhas.**
<!-- verif:end -->
