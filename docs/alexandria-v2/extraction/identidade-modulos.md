# Identidade dos 17 módulos — frase, marca gravada e objetos reais

> Camada **Alexandria** (produto), construída sobre a camada **fonte** de `extraction/mNN/`.
> Nenhum fato novo: cada frase é recorte de uma string já conferida como substring exata do HTML de origem.
> Onde a fonte não declara, está escrito "não declarado" — nunca preenchido por plausibilidade (S4).

**Por que este arquivo existe.** Hoje, com os títulos cobertos, os 17 módulos são o mesmo anel. Isso é a
lacuna **B4** da Peça B do bar (*"com os títulos cobertos, os nós se distinguem, e não só por cor"*), e é
o que falta para o Sumário e a carta pararem de imprimir a mesma linha de metadado para todos.

**O que este arquivo não faz.** Não desenha nada — a série de medalhas r04 já existe e é ela que entra
como marca. Não reconcilia contagem nem título divergente: isso é trabalho separado (P8), e o que se mede
aqui fica registrado nas colunas de divergência.

- Dados legíveis por máquina: [`identidade-modulos.json`](identidade-modulos.json)
- Marcas: `media-lab/movimento-e-conquistas/medalhas/webp/_indice.json` (série r04, **variante B** — a decidida para papel)
- Regras: `bar.md` B4 · `estudos/movimento-e-conquistas/sistema-de-conquistas.md` §6.3–§6.5 · `estudos/movimento-e-conquistas/features-propostas.md` F-MD3 · P5, P8, P14, P18, P25, S4

---

## 1. Os 17, numa tabela

`Terr.` = território do globo (§6.4: I · Fundamentos Universais M01–M05, II · Setor Elétrico Brasileiro
M06–M12, III · Especialização Estratégica M13–M17). `pal.` = palavras da frase.

| # | Módulo | Terr. | Frase de identidade (camada Alexandria) | pal. | Marca gravada |
|---|---|---|---|---|---|
| 01 | Física de Energia e Eletricidade | I | **Uma conta de luz não é uma cobrança por energia.** | 10 | `conclusao-modulo-01` |
| 02 | Como Funciona uma Rede Elétrica | I | **Eletricidade, em escala de rede, não se armazena de forma economicamente significativa.** | 12 | `conclusao-modulo-02` |
| 03 | Tecnologias de Geração | I | **O sistema elétrico não compra fontes — compra atributos.** | 9 | `conclusao-modulo-03` |
| 04 | Economia de Mercados de Energia | I | **O mercado elétrico não precifica MWh.** | 6 | `conclusao-modulo-04` |
| 05 | Regulação e Desenho de Mercados | I | **O desenho do setor elétrico não escolhe entre mercado e Estado.** | 11 | `conclusao-modulo-05` |
| 06 | História do Setor Elétrico Brasileiro | II | **Toda estrutura de hoje tem uma data e uma causa.** | 10 | `conclusao-modulo-06` |
| 07 | Estrutura Institucional do Setor Elétrico Brasileiro | II | **O setor elétrico brasileiro não tem um chefe.** | 8 | `conclusao-modulo-07` |
| 08 | Matriz Elétrica Brasileira em Profundidade | II | **Não existe a matriz elétrica brasileira.** | 6 | `conclusao-modulo-08` |
| 09 | Os Mercados ACR e ACL em Profundidade | II | **A comparação entre os dois nunca é uma comparação de preço.** | 11 | `conclusao-modulo-09` |
| 10 | Tarifas e a Conta de Luz Industrial | II | **A fatura industrial é composta por quatro eixos de controle.** | 10 | `conclusao-modulo-10` |
| 11 | Geração Distribuída e a Anatomia de uma Proposta Solar | II | **A proposta solar não é um orçamento.** | 7 | `conclusao-modulo-11` |
| 12 | Geopolítica Energética do Brasil | II | **O Brasil não escolheu entre ser potência renovável e potência fóssil.** | 11 | `conclusao-modulo-12` |
| 13 | Análise Financeira de Empresas e Projetos | III | **Nenhum múltiplo se lê sozinho.** | 5 | `conclusao-modulo-13` |
| 14 | Biocombustíveis e Bioenergia | III | **A mesma tonelada vira quatro produtos.** | 6 | `conclusao-modulo-14` |
| 15 | Petróleo, Gás e Petrobras | III | **Todo número pertence a um regime e a uma camada.** | 10 | `conclusao-modulo-15` |
| 16 | Tendências e Disrupções | III | **Toda tendência tem um estágio e um gargalo.** | 8 | `conclusao-modulo-16` |
| 17 | Cenário Internacional Comparativo | III | **Nenhum número de um mercado é comparável ao de outro.** | 10 | `conclusao-modulo-17` |

---

## 2. De onde vem cada frase

`fidelidade`: **exata** = a frase é substring literal do campo citado · **exata-até-pontuação** = idem, com
ponto final acrescentado (a fonte é um título, sem ponto) · **elisão** = corte declarado dentro da frase da
fonte, sem acrescentar palavra. Só o M15 usa elisão, e está justificado abaixo.

| # | Campo de origem | Bloco na fonte | Fidelidade | Trecho citado |
|---|---|---|---|---|
| 01 | `tese.citacao.texto` | § 00 · Filosofia do módulo — pull-quote | exata | Uma conta de luz não é uma cobrança por energia. É uma fotografia econômica de como uma instalação usa potência, tempo, tensão, corrente, infraestrutura e qualidade elétrica. |
| 02 | `tese.lead.texto` | § 00 · lead da tese | exata | Eletricidade, em escala de rede, não se armazena de forma economicamente significativa. Tudo o que parece burocracia no setor […] existe por causa dessa única frase. |
| 03 | `tese.lead.texto` | § 00 · lead da tese | exata-ate-pontuacao | O sistema elétrico não compra fontes — compra atributos: energia barata, potência firme, flexibilidade para subir e descer, inércia, localização certa. |
| 04 | `tese.blocos[4].paragrafos[0].texto` | callout "Ideia central do módulo" | exata | O mercado elétrico não precifica MWh. Ele precifica tempo, localização, risco, flexibilidade e confiabilidade, e cobra tudo isso embutido em um número por MWh. |
| 05 | `tese.blocos[15].texto` | box "Ideia central do módulo" | exata | O desenho do setor elétrico não escolhe entre mercado e Estado. Ele coloca competição onde ela funciona, regulação onde ela é inevitável e transparência nos dois […]. |
| 06 | `tese.titulo_secao.texto` | § 00 · título da tese | exata-ate-pontuacao | Toda estrutura de hoje tem uma data e uma causa |
| 07 | `tese.titulo.texto` | § 00 · título da tese | exata-ate-pontuacao | O setor elétrico brasileiro não tem um chefe |
| 08 | `tese.blocos[1].texto` | § Tese · titulo_secao | exata-ate-pontuacao | Não existe a matriz elétrica brasileira  (no HTML: "Não existe <em>a</em> matriz elétrica brasileira") |
| 09 | `tese.blocos[4].paragrafos[0].texto` | box "A frase que organiza o módulo inteiro" | exata | A comparação entre os dois nunca é uma comparação de preço. É uma comparação entre dois arranjos de alocação de risco. |
| 10 | `tese.blocos[3].paragrafos[0].texto` | box "A afirmação que organiza o módulo" | exata | A fatura industrial é composta por quatro eixos de controle. O que a empresa controla […]. O que a empresa negocia […]. O que a empresa apenas suporta […]. O que muda sozinho e quando […]. |
| 11 | `tese.blocos[0].texto (lede do § 00)` | § 00 · lede da tese | exata | A proposta solar não é um orçamento. Ela é um empilhamento de premissas […]. |
| 12 | `tese.frase_organizadora.paragrafos[0].texto` | box "A frase que organiza o módulo inteiro" | exata | O Brasil não escolheu entre ser potência renovável e potência fóssil. Expandiu as duas ao mesmo tempo, e quem só vê um dos lados não entende nem a oportunidade nem o risco que o resto do mundo enxerga no país. |
| 13 | `voz.roteiro_oral.paragrafos[0].texto (mesma frase em tese.blocos[3].corpo.texto, ali em caixa-alta)` | § Tese · div.form + § Voz · roteiro oral | exata | O ponto central deste bloco cabe em uma frase: nenhum múltiplo se lê sozinho. ‖ NENHUM MÚLTIPLO SE LÊ SOZINHO. EV/EBITDA, dívida líquida sobre EBITDA e dividend yield só significam alguma coisa quando se sabe quem controla a em… |
| 14 | `tese.blocos[1].texto` | § 00 · título da tese | exata-ate-pontuacao | A mesma tonelada vira quatro produtos, e quem escolhe qual não é o operador nacional |
| 15 | `tese.blocos[6].paragrafos[0].texto` | caixa "A espinha dorsal do Bloco 15" | elisao | Todo número de petróleo e gás pertence a um regime e a uma camada. |
| 16 | `tese.caixas[0].paragrafos[0].texto` | box "A afirmação que organiza o módulo" | exata | Toda tendência tem um estágio e um gargalo. O estágio decide se o número citado descreve o que existe, o que foi autorizado ou o que foi anunciado. O gargalo decide o que precisaria mudar para que a curva continue […]. |
| 17 | `tese.blocos[4].partes[0].texto` | destaque "A afirmação que organiza o módulo" | exata-ate-pontuacao | Nenhum número de um mercado é comparável ao de outro sem que se declare o que está dentro dele. |

**Um padrão que a fonte já tinha e que esta tarefa só colheu.** Dez dos dezessete módulos trazem, dentro do
§ 00, um bloco declarado com a frase organizadora — rotulado *"Ideia central do módulo"* (M04, M05),
*"A frase que organiza o módulo inteiro"* (M09, M12), *"A afirmação que organiza o módulo"* (M10, M16, M17),
*"A regra que organiza este módulo"* (M08), *"A espinha dorsal"* (M15) ou *"Regra de leitura deste módulo"* (M06).
Onde esse bloco existe, ele **é** a frase de identidade — não houve escolha editorial a fazer. Onde não existe
(M01, M02, M03, M07, M11, M13, M14), a frase veio do lead, do pull-quote ou do título do § 00, e a coluna
acima diz qual.

**M15, a única elisão.** A fonte diz *"Todo número de petróleo e gás pertence a um regime e a uma camada"* —
14 palavras, acima do teto de 12 do B4. O corte para *"Todo número pertence a um regime e a uma camada"*
retira apenas o objeto, que o título do módulo (*Petróleo, Gás e Petrobras*) devolve na mesma linha do Sumário.
Nenhuma palavra foi acrescentada. Está marcado como `elisao` no JSON.

**M13, a única normalização de caixa.** No § Tese a frase está em caixa-alta
(*"NENHUM MÚLTIPLO SE LÊ SOZINHO."*). A forma em caixa baixa usada aqui é literal do § Voz
(`voz.roteiro_oral.paragrafos[0].texto`), então não há invenção de forma: as duas existem na fonte.

---

## 3. A marca gravada de cada módulo

Nada foi desenhado. A decisão **F-MD3** diz que a estação do globo e a medalha são o mesmo objeto — o disco
de latão da estação vira a medalha, e a placa do tímpano sai da mesma carta r04 do globo, com o triângulo da
estação na mesma posição relativa da ilha. Por isso o mapeamento é 1:1 e dispensa arte nova.

O arquivo é o mesmo nome nas três faixas, trocando só a pasta — por isso a tabela dá o nome uma vez e as
pastas na coluna seguinte. Raiz: `docs/alexandria-v2/media-lab/movimento-e-conquistas/medalhas/webp/`.

| # | Slug da marca | Conquista | Arquivo (obtida) | Faixas |
|---|---|---|---|---|
| 01 | `conclusao-modulo-01` | `conclusao.modulo.modulo-01` | `conclusao-modulo-01-obtida.webp` | `96/` (P, 48 CSS) · `192/` (M, 96 CSS) · `384/` (G, 192 CSS) |
| 02 | `conclusao-modulo-02` | `conclusao.modulo.modulo-02` | `conclusao-modulo-02-obtida.webp` | `96/` (P, 48 CSS) · `192/` (M, 96 CSS) · `384/` (G, 192 CSS) |
| 03 | `conclusao-modulo-03` | `conclusao.modulo.modulo-03` | `conclusao-modulo-03-obtida.webp` | `96/` (P, 48 CSS) · `192/` (M, 96 CSS) · `384/` (G, 192 CSS) |
| 04 | `conclusao-modulo-04` | `conclusao.modulo.modulo-04` | `conclusao-modulo-04-obtida.webp` | `96/` (P, 48 CSS) · `192/` (M, 96 CSS) · `384/` (G, 192 CSS) |
| 05 | `conclusao-modulo-05` | `conclusao.modulo.modulo-05` | `conclusao-modulo-05-obtida.webp` | `96/` (P, 48 CSS) · `192/` (M, 96 CSS) · `384/` (G, 192 CSS) |
| 06 | `conclusao-modulo-06` | `conclusao.modulo.modulo-06` | `conclusao-modulo-06-obtida.webp` | `96/` (P, 48 CSS) · `192/` (M, 96 CSS) · `384/` (G, 192 CSS) |
| 07 | `conclusao-modulo-07` | `conclusao.modulo.modulo-07` | `conclusao-modulo-07-obtida.webp` | `96/` (P, 48 CSS) · `192/` (M, 96 CSS) · `384/` (G, 192 CSS) |
| 08 | `conclusao-modulo-08` | `conclusao.modulo.modulo-08` | `conclusao-modulo-08-obtida.webp` | `96/` (P, 48 CSS) · `192/` (M, 96 CSS) · `384/` (G, 192 CSS) |
| 09 | `conclusao-modulo-09` | `conclusao.modulo.modulo-09` | `conclusao-modulo-09-obtida.webp` | `96/` (P, 48 CSS) · `192/` (M, 96 CSS) · `384/` (G, 192 CSS) |
| 10 | `conclusao-modulo-10` | `conclusao.modulo.modulo-10` | `conclusao-modulo-10-obtida.webp` | `96/` (P, 48 CSS) · `192/` (M, 96 CSS) · `384/` (G, 192 CSS) |
| 11 | `conclusao-modulo-11` | `conclusao.modulo.modulo-11` | `conclusao-modulo-11-obtida.webp` | `96/` (P, 48 CSS) · `192/` (M, 96 CSS) · `384/` (G, 192 CSS) |
| 12 | `conclusao-modulo-12` | `conclusao.modulo.modulo-12` | `conclusao-modulo-12-obtida.webp` | `96/` (P, 48 CSS) · `192/` (M, 96 CSS) · `384/` (G, 192 CSS) |
| 13 | `conclusao-modulo-13` | `conclusao.modulo.modulo-13` | `conclusao-modulo-13-obtida.webp` | `96/` (P, 48 CSS) · `192/` (M, 96 CSS) · `384/` (G, 192 CSS) |
| 14 | `conclusao-modulo-14` | `conclusao.modulo.modulo-14` | `conclusao-modulo-14-obtida.webp` | `96/` (P, 48 CSS) · `192/` (M, 96 CSS) · `384/` (G, 192 CSS) |
| 15 | `conclusao-modulo-15` | `conclusao.modulo.modulo-15` | `conclusao-modulo-15-obtida.webp` | `96/` (P, 48 CSS) · `192/` (M, 96 CSS) · `384/` (G, 192 CSS) |
| 16 | `conclusao-modulo-16` | `conclusao.modulo.modulo-16` | `conclusao-modulo-16-obtida.webp` | `96/` (P, 48 CSS) · `192/` (M, 96 CSS) · `384/` (G, 192 CSS) |
| 17 | `conclusao-modulo-17` | `conclusao.modulo.modulo-17` | `conclusao-modulo-17-obtida.webp` | `96/` (P, 48 CSS) · `192/` (M, 96 CSS) · `384/` (G, 192 CSS) |

Nível de detalhe por faixa (§6.5): **96 px / 48 CSS** = orla da família + motivo simplificado, sem trama
fina · **192 px / 96 CSS** = orla, tímpano e ponto, com trama leve · **384 px / 192 CSS** = detalhe completo.
Cada faixa é **renderizada no próprio tamanho**, não reduzida de uma imagem grande.

Ao lado de cada `-obtida.webp` existe o `-cega.webp` (mesma geometria em relevo sobre papel, sem tinta —
o estado "não obtida, obtível hoje"). A variante **N**, ouro sobre navy, vive em `webp-ouro/`, com a faixa
extra de 768 px; pelo §6 ela só entra na vitrine de território do Progresso, nunca na Home.

Cada módulo tem ainda uma segunda arte, `pratica-instrumentos-do-modulo-NN`, que **não** é a marca de
identidade: é a conquista de prática. Na r04 ela deixou de repetir o anel de oito mostradores e passou a ser
limbo graduado + alidade + índice + vernier, girados pelo rumo real de chegada da rota à estação. Terreno
(conclusão) × leitura (prática).

### 3.1 Em que tamanho a marca serve de identidade

**A 24 px ela não serve, e não é defeito de render: é o contrato.** O §6.5 do `sistema-de-conquistas.md`
não publica raster nessa faixa — a 24 px o ativo é um **SVG vetorial que desenha só a silhueta de estado**.
Conferido na folha pedida, `medalhas/contato/silhuetas-24-cinza.png` (gerador `folha_silhuetas_24.py`): ela
traz três silhuetas, e as três são estados, não módulos —

| Silhueta a 24 px | O que é | Distingue |
|---|---|---|
| disco cheio · anel · ponto central vazado | **obtida** | estado |
| anel de 1 px tracejado · sem ponto | **não obtida** (obtível hoje) | estado |
| retângulo cheio 4:3 · raio 0 | sinal de competência (reservado) | estado |

**Qual par colide a 24 px: todos.** Não há par anômalo a apontar, porque nenhum motivo de módulo é desenhado
nessa faixa. Os 17 são a mesma silhueta por construção. Essa é a resposta honesta, e é a que o Sumário precisa.

**A partir de 48 px CSS ela serve, e está medido.** Medição feita agora, com a métrica de
`medalhas/verificar.py` (distância euclidiana entre vetores do disco em cinza sobre pergaminho `#F2E9D6`,
centrados e normalizados), restrita aos 17 slugs `conclusao-modulo-NN`, variante B:

| Faixa | Arquivo | Mínimo entre os 17 | Mediana do vizinho | Par mais próximo |
|---|---|---|---|---|
| 48 CSS | `webp/96/` | **0,840** | 0,957 | M01 × M05 |
| 96 CSS | `webp/192/` | **0,803** | 0,920 | M05 × M13 |

Para referência: o piso da **série inteira** (74 artes) a 48 CSS na variante B é **0,288**
(`pratica-previsao-comparada` × `pratica-primeira-previsao`, em `verificacao/verificacao-B.json`). O pior par
dos 17 módulos está **2,9× acima desse piso**, e nenhum par `conclusao-modulo-*` aparece entre os doze mais
próximos da série. Os módulos são a família que melhor se separa — o que faz sentido, porque o enquadramento
r04 centra a placa na estação com aproximação 1,95×, em vez de mostrar a ilha inteira.

Pares mais próximos entre os 17, a 48 CSS: **M01 × M05** (0,840) e **M15 × M16** (0,886) — vizinhos dentro
do mesmo território, com estações próximas na mesma ilha; **M07 × M08** (0,942), idem no Território II; e
**M05 × M13** (0,862), que são de ilhas diferentes e ficam próximos só por posição relativa da estação no
recorte. Nenhum deles é colisão: todos estão bem acima do piso da série.

*(Medida sintética, para registro: forçar o raster de 96 px para 24 px dá mínimo 0,834, M15 × M16. Não vale
como aceite — a 24 px o sistema não serve raster, e o vetor que ele serve não carrega motivo de módulo.)*

**Consequência para o Sumário.** Duas saídas, nenhuma inventa arte:

1. a linha de sumário usa a marca a **48 px CSS**, onde a distinção está medida; ou
2. a linha fica a **24 px** e usa a silhueta de estado — e quem distingue o módulo ali é a **frase de
   identidade** mais a **fila de glifos dos objetos**, exatamente as duas heurísticas que o B4 pede.

Pelo **P18**, o rótulo do estado terminal na linha é **"Concluído"**. Nunca "Aprovado".

---

## 4. Os objetos reais de cada módulo

Números do `aparato.json` e do `instrumentos.json` de cada módulo. É esta tabela que tira do Sumário a linha
de metadado repetida: **conferido, as 17 linhas abaixo são todas distintas entre si**.

| # | Instr. | Lab | Caso | Quiz | Checklist | Exerc. | Ref. | Glossário | Fichas |
|---|---|---|---|---|---|---|---|---|---|
| 01 | não decl. | **1** | 1 | 10 | 16 | 8 | 8 | 38 | — |
| 02 | 9 | 0 | 1 | 10 | 18 | 10 | 16 | 65 | — |
| 03 | 9 | 0 | 1 | 10 | 18 | 10 | 17 | 63 | — |
| 04 | 7 | 0 | 1 | 10 | 20 | 9 | 11 | 58 | — |
| 05 | 6 | 0 | 1 | 10 | 21 | 10 | 16 | 72 | — |
| 06 | 8 | 0 | 1 | 10 | 24 | 10 | 21 | 99 | — |
| 07 | 10 | 0 | 1 | 10 | 26 | 12 | 27 | 118 | — |
| 08 | 11 | 0 | 1 | 10 | 26 | 12 | 28 | 124 | — |
| 09 | 11 | 0 | 1 | 10 | 28 | 14 | 30 | 136 | — |
| 10 | 11 | 0 | 1 | 10 | 28 | 14 | 35 | 161 | — |
| 11 | 11 | 0 | 1 | 10 | 28 | 14 | 32 | 150 | — |
| 12 | 11 | 0 | 1 | 10 | 28 | 14 | 34 | 152 | — |
| 13 | 11 | 0 | 1 | 10 | 28 | 14 | 36 | 180 | — |
| 14 | 10 | 0 | 1 | 10 | 26 | 14 | 34 | 158 | — |
| 15 | 10 | 0 | 1 | 10 | 28 | 15 | 36 | 174 | — |
| 16 | 11 | 0 | 1 | 10 | 30 | 16 | 38 | 184 | 6 |
| 17 | 12 | 0 | 1 | 10 | 30 | 18 | 8 * | 192 | 6 |

\* M17: são **8 parágrafos-bloco**, não 8 referências individuais. A fonte não lista referência com título
nem URL nesse módulo (`aparato.json → referencias.nota_itens`). O número não é comparável com os demais.

**O que essa tabela revela, e que nenhuma linha de metadado genérica mostrava:**

- **Laboratório existe em um módulo só.** O **M01** tem o § Lab (LAB·01, *Comparador de perfil elétrico*).
  Os outros dezesseis não têm § Lab, e isso está declarado como ausência medida em cada `modulo.json`
  (`laboratorios.nota`: *"zero ocorrências"*), não presumido. Onde há instrumento fora de aula, ele é o
  INST·01 do § MAP — recurso de módulo, não laboratório. Um marco "laboratório" em dezesseis nós seria
  destino falso.
- **Instrumentos vão de 6 a 12** (M05 com 6; M17 com 12), e o **M01 é "não declarado"**: aquele módulo não
  tem `instrumentos.json`, porque a extração cobriu só o INST·06 (aula 08) e o LAB·01. Zero seria mentira.
- **O quiz é 10 em todos os 17.** É o único número que não distingue nada — e, pelo **P5**, ele é resultado
  de avaliação, nunca "Demonstrado". Não deve ser o que a linha do Sumário mostra.
- **Checklist cresce com o currículo**: 16 no M01, 30 no M16 e no M17. Itens orais ou cronometrados entram
  como **"atividade recomendada"** (P14), nunca como requisito de conclusão.
- **Exercícios vão de 8 a 18**, e somam **214** nos dezessete. O bar registra em B4 o problema de *"119
  exercícios invisíveis"*: a contagem real da fonte é maior que isso, e a diferença é ela própria uma
  reconciliação pendente (P8) — aqui fica o número medido, sem ajuste.
- **Glossário vai de 38 a 192 termos.** É o objeto que mais separa os módulos e o mais barato de imprimir.
- **Fichas** só existem no M16 e no M17 (6 em cada): é um objeto de módulo que nenhum outro tem.
- **Quantos campos o Sumário precisa imprimir para não repetir linha.** Conferido: com *instrumentos +
  laboratório + checklist + exercícios + glossário* as 17 linhas já ficam distintas. Com só *instrumentos +
  laboratório + exercícios* caem para 12 linhas, e colidem **M02 × M03** e o bloco **M09 × M11 × M12 × M13**.
  Se a linha for curta, o glossário é o campo que a salva.
- **Experiência jogável: "em desenho" nos 17.** Pelo **P25**, jogo está fora desta wave; a peça reserva a
  linha, sem controle inerte e sem destino (P16, S4). O M08 é caso à parte só porque o § Caso dele traz
  `decisao_pedida` — é o **"Exercício de decisão"** que o B4 cita, marco de tipo caso, não jogo.

---

## 5. Divergências encontradas (registradas, não resolvidas)

Pelo **P8**, divergência de título e de contagem é reconciliação separada. Nenhuma foi escolhida aqui.

| # | Divergência |
|---|---|
| 01 | Sem `instrumentos.json`: a extração cobriu só o INST·06 (aula 08) e o LAB·01. A contagem de instrumentos do M01 fica **não declarada** (S4) — não é zero. |
| 01 | § Lex: a prosa declara "Vinte e oito termos"; o markup traz 38 (`aparato.json → glossario.contagem`). Registrado, não reconciliado (P8). |
| 01 | Três critérios de domínio coexistem na fonte (Drill 6/8, Quiz 8/10, Checklist 16/16) sem precedência declarada (`modulo.json → criterio.nota_p5`). |
| 01 | Título do hero ("Física de energia e eletricidade: o módulo que transforma watts em decisão financeira.") ≠ título do catálogo. Reconciliação separada (P8). |
| 02 | § Ex: a prosa declara "Oito"; o markup traz 10 (`aparato.json → contagens.exercicios`). Registrado, não reconciliado (P8). |
| 02 | Título do hero é frase longa ≠ título do catálogo; no catálogo do código o bloco-02 está como `priority: confirmar`, com horas nulas. "Título a confirmar" não é experiência normal (P8). |
| 03 | Título do hero é frase longa ≠ título do catálogo. Reconciliação separada (P8). |
| 08 | O § Caso traz `decisao_pedida`: é o "Exercício de decisão" que o bar cita em B4. Marco de tipo caso/decisão — não "jogo". |
| 15 | A frase de identidade é uma elisão: a fonte diz "Todo número de petróleo e gás pertence a um regime e a uma camada" (14 palavras). O corte para 10 palavras é decisão de produto; o título do módulo devolve o contexto na mesma linha do Sumário. |
| 17 | § Ref: a fonte não lista referências individuais. São 8 parágrafos-bloco, cada um agregando várias publicações, sem título nem URL (`aparato.json → referencias.nota_itens`). O 8 é de blocos, não de referências: não é comparável com os demais módulos. |

Além dessas, três pendências que atravessam os dezessete e não são desta tarefa:

1. **`totalAulas: null` em M10–M17** no catálogo do código (`alexandria-trilhas.ts`) — é por isso que o
   limbo de N tiques da medalha de módulo não grava N, e a série deixou o anel de tiques como camada SVG
   viva que some quando a contagem não está reconciliada (`medalhas/DECISOES.md`, "Limite honesto").
2. **Título do hero ≠ título do catálogo em M01, M02 e M03** — nesses três o `<h1>` é uma frase longa. O
   bloco-02 ainda está `priority: confirmar` com horas nulas no catálogo; "título a confirmar" **não é
   experiência normal** (P8), e a carta precisa dizer isso em vez de imprimir um título provisório como se
   fosse definitivo.
3. **Critérios de domínio concorrentes** (mais visível no M01: Drill 6/8, Quiz 8/10, Checklist 16/16, sem
   precedência declarada). Registrado em `modulo.json → criterio.nota_p5` de cada módulo.

---

## 6. Como o Sumário usa isto

Uma linha de módulo, com os títulos cobertos, fica assim — e as três partes vêm de três lugares diferentes
deste arquivo:

```
[marca 48px] · "A proposta solar não é um orçamento." · 11 instrumentos · caso · 28 itens · 14 exercícios · 150 termos
 §3 (webp/96/)        §1–2 (fonte, camada Alexandria)                    §4 (aparato.json)
```

- A marca entra a **48 px CSS**, nunca a 24 (§3.1).
- A frase é a coluna do §1; ela é **camada Alexandria** e precisa ser marcada como tal onde o produto
  distinguir camadas — o texto é fiel, mas o recorte é decisão de produto.
- A fila de objetos imprime **só o que aquele módulo tem**: "laboratório" aparece no M01 e em mais nenhum,
  "fichas" no M16 e no M17, e o quiz — que é 10 em todos — não entra na fila por não distinguir nada.
- O **glossário entra na fila**: sem ele a linha curta repete entre M02 e M03 e entre M09, M11, M12 e M13 (§4).
- Onde o dado não existe, a fila diz **"não declarado"** em vez de zero. É o caso dos instrumentos do M01.
- O estado terminal se chama **"Concluído"** (P18).
- A linha de experiência jogável, quando aparecer, diz **"em desenho"**, sem controle e sem destino (P25).

