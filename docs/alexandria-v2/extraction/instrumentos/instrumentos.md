# Os 165 instrumentos — especificação

> Gerado por `extratores/gerar-instrumentos.mjs`. **Não editar à mão.** O que é fato vem da
> extração; o que é julgamento vem de `overlay/*.json`. Ver `README.md`.

## Contagens

- **165 instrumentos**, 527 entradas e 591 saídas especificadas.
- **Unidade de saída:** 303 de 591 saídas com unidade declarada pela fonte (antes: 76 no campo bruto da extração) — origem: extração 60, rótulo 1, markup 0, script 242. Sem unidade: 203 não numéricas, 49 numéricas sem declaração, 36 sem id na extração. Cada uma com `unidade_motivo`.
- **0 sem extração de camada fonte:** .
- **Forma prometida:** 121 prometem; 53 a fonte já desenha; 7 desenha em parte; **61 prometem e não desenham nada**; 44 não prometem forma.
- **Tolerância:** 2 declarada pela fonte (m01-inst-02, m08-inst-04). 5 entram no pedido de revisão técnica. Todos os demais: autoavaliação em três níveis, sem veredito dentro/fora.
- **Previsão:** 108 instrumentos com pergunta de previsão útil; 3 bloqueados por divergência não reconciliada (m01-lab-01, m14-inst-07, m14-inst-08).
- **Custo de porte da forma:** P 64 · M 92 · G 4.

## Índice por módulo

| Módulo | Instrumentos | Prometem forma | Promessa sem desenho | Com tolerância |
|---|---:|---:|---:|---:|
| M01 | 7 | 1 | 1 | 1 |
| M02 | 9 | 5 | 1 | 0 |
| M03 | 9 | 7 | 2 | 0 |
| M04 | 7 | 6 | 0 | 0 |
| M05 | 6 | 5 | 0 | 0 |
| M06 | 8 | 8 | 0 | 0 |
| M07 | 10 | 7 | 3 | 0 |
| M08 | 11 | 9 | 2 | 1 |
| M09 | 11 | 7 | 5 | 0 |
| M10 | 11 | 8 | 8 | 0 |
| M11 | 11 | 9 | 8 | 0 |
| M12 | 11 | 7 | 5 | 0 |
| M13 | 11 | 9 | 6 | 0 |
| M14 | 10 | 9 | 5 | 0 |
| M15 | 10 | 8 | 2 | 0 |
| M16 | 11 | 7 | 5 | 0 |
| M17 | 12 | 9 | 8 | 0 |


## M01

### m01-inst-01 · Calculadora · kWh = kW × h

**Identidade.** INST · 01 · Aula 01 · tipo: calculadora

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* 

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i01-kw | Potência | kW | number | 10 | 0 – sem atributo max na fonte / passo 0.5 | — |
| i01-h | Tempo | h | number | 5 | 0 – sem atributo max na fonte / passo 0.5 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i01-out | Energia consumida | kWh (extração) | readout | `const v = (parseFloat(kw.value) \|\| 0) * (parseFloat(h.value) \|\| 0);` |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
- **Custo:** —

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada (P6). O instrumento não tem previsão, gabarito nem correção; não existe "dentro/fora".

**Previsão (C3).**

- **Útil:** não. —

**Avisos.**

- **Nota da fonte:** A fonte não cita procedência para os valores-padrão (10 kW, 5 h) nem para os cenários da nota (50 kW × 1 h, 1 kW × 50 h).

**Estado no código (informativo, não é camada fonte).** divergente ou parcial — tabela COD-xx em extraction/m01/aula-01.md

### m01-inst-02 · Calculadora · Lei de Ohm

**Identidade.** INST · 02 · Aula 02 · tipo: calculadora

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* 

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i02-v | Tensão | V | number | — | — – sem atributo max na fonte / passo any | — |
| i02-i | Corrente | A | number | — | — – sem atributo max na fonte / passo any | — |
| i02-r | Resistência | Ω | number | — | — – sem atributo max na fonte / passo any | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i02-status | Status | — | readout | `status.textContent = 'Aguardando 2 valores...'; V.value = (vI * vR).toFixed(2); status.textContent = 'V = I × R = ' + V.value + ' V'; I.value = (vV / vR).toFixed(2); status.textContent = 'I = V ÷ R = ' + I.value + ' A'; ` |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
- **Custo:** —

**Tolerância (P6).**

- **Declarada pela fonte:** {"coerencia_relativa":0.01,"descricao":"Único limiar do script: `diff < 0.01` na checagem de coerência quando os três campos estão preenchidos.","origem":{"seletor":"script calc()","trecho_inicial":"if (diff < 0.01) status.textContent","linha_aprox":2784}}
- **Veredito permitido:** dentro/fora.

**Previsão (C3).**

- **Útil:** não. —

**Avisos.**

- **Nota da fonte:** A fonte não cita procedência para os exemplos da nota (220 V × 10 A, 5 h) nem para os placeholders (ex: 220, ex: 10).

**Estado no código (informativo, não é camada fonte).** divergente ou parcial — tabela COD-xx em extraction/m01/aula-02.md

### m01-inst-03 · Calculadora · Perdas resistivas

**Identidade.** INST · 03 · Aula 04 · tipo: calculadora

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* 

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i03-i | Corrente | A | number + range gêmeo | 100 | 0 – sem atributo max na fonte / passo 5 | — |
| i03-r | Resistência | Ω | number + range gêmeo | 0.5 | 0 – sem atributo max na fonte / passo 0.1 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i03-out | Perda dissipada | W (extração) | readout | `const I = parseFloat(i.value) \|\| 0; const R = parseFloat(r.value) \|\| 0; const P = I * I * R;` |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
- **Custo:** —

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada (P6). Não há previsão, gabarito nem correção no instrumento.

**Previsão (C3).**

- **Útil:** não. —

**Avisos.**

- **Nota da fonte:** A fonte não cita procedência para o cenário-padrão (100 A, 0,5 Ω) nem para as faixas dos deslizadores (10–500 A; 0,1–5 Ω).

**Estado no código (informativo, não é camada fonte).** divergente ou parcial — tabela COD-xx em extraction/m01/aula-04.md

### m01-inst-04 · Calculadora · Demanda média e fator de carga

**Identidade.** INST · 04 · Aula 05 · tipo: calculadora

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* 

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i04-kwh | Consumo mensal | kWh | number | 144000 | 0 – sem atributo max na fonte / passo 1000 | — |
| i04-h | Horas do período | h | number | 720 | 0 – sem atributo max na fonte / passo 24 | — |
| i04-pmax | Demanda máxima | kW | number | 800 | 0 – sem atributo max na fonte / passo 50 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i04-pmed | Demanda média | kW (extração) | readout | `const E = parseFloat(kwh.value) \|\| 0; const T = parseFloat(h.value) \|\| 1; const Pmed = E / T;` |
| i04-fc | Fator de carga | — | readout | `const Pmax = parseFloat(pmax.value) \|\| 1; const FC = Pmax > 0 ? Pmed / Pmax : 0;` |
| i04-fcp | — | % (extração) | readout | — |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
- **Custo:** —

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada (P6). O instrumento não tem previsão, gabarito nem correção.

**Previsão (C3).**

- **Útil:** não. —

**Avisos.**

- **Nota da fonte:** A fonte não cita procedência para o cenário-padrão (144.000 kWh / 720 h / 800 kW) nem para os limiares das faixas (0,70 / 0,40 / 0,15). 720 h = 30 dias × 24 h (implícito no enunciado do Ex·04 "mês de 720 horas"; não declarado como tal no instrumento).

**Estado no código (informativo, não é camada fonte).** divergente ou parcial — tabela COD-xx em extraction/m01/aula-05.md

### m01-inst-05 · Controles · Triângulo de potência

**Identidade.** INST · 05 · Aula 07 · tipo: controles

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* 

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i05-kw | Potência ativa | kW | number + range gêmeo | 800 | 0 – sem atributo max na fonte / passo 50 | — |
| i05-kvar | Potência reativa | kVAr | number + range gêmeo | 480 | 0 – sem atributo max na fonte / passo 20 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| tri-kw-val | Pot. ativa | kW (extração) | readout (na figura) | — |
| tri-kvar-val | Pot. reativa | kVAr (extração) | readout (na figura) | — |
| tri-kva-val | Pot. aparente | kVA (extração) | readout (na figura) | — |
| tri-fp-val | Fator de potência | — | readout (na figura) | — |
| tri-angle-val | Ângulo φ | ° (extração) | readout (na figura) | — |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
- **Custo:** —

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada (P6). O instrumento não tem previsão, meta nem correção.

**Previsão (C3).**

- **Útil:** não. —

**Avisos.**

- **Nota da fonte:** A fonte não cita procedência para o cenário-padrão (800 kW / 480 kVAr) nem para os limiares 0,92 / 0,85 do script. O 0,92 é repetido na prosa de 7.4 como "fator de potência mínimo de referência" da regulação; o 0,85 só aparece no script (semáforo) e no exemplo de 7.3.

**Estado no código (informativo, não é camada fonte).** divergente ou parcial — tabela COD-xx em extraction/m01/aula-07.md

### m01-inst-06 · Calculadora · Fator de capacidade

**Identidade.** INST · 06 · Aula 08 · tipo: calculadora

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* 

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i06-cap | Capacidade instalada | MW | number | 100 | 0 – sem atributo max na fonte / passo 10 | — |
| i06-gen | Geração no período | MWh | number | 220000 | 0 – sem atributo max na fonte / passo 1000 | — |
| i06-h | Horas do período | h | number | 8760 | 0 – sem atributo max na fonte / passo 24 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i06-fc | Fator de capacidade | % (extração) | readout | `const C = parseFloat(cap.value) \|\| 0; const G = parseFloat(gen.value) \|\| 0; const T = parseFloat(h.value) \|\| 1; const max = C * T; const FC = max > 0 ? G / max : 0;` |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Calculadora · Fator de capacidade" — o prefixo não promete forma desenhada
  - a própria extração já registra figura_prometida: null (aula-08.json)
- **Sem promessa, mas (C6):** O ramo FC ≥ 0,15 do script manda "Compare com FCs típicos abaixo" — referência à figura m01-a08-fig-01 (div.cf-chart, 7 barras), que vive FORA do instrumento. Pôr o FCap calculado como marca móvel sobre essa figura já existente satisfaz C6 sem figura nova. Isso é proposta da camada Alexandria, não promessa da fonte.
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada (P6). O instrumento não tem previsão, gabarito nem correção; não existe "dentro/fora".
- **Por que não pedir:** P19 é explícito: arredondamento é regra de entrada da Alexandria, nunca "tolerância da fonte". Não pedir tolerância aqui.

**Previsão (C3).**

- **Útil:** sim. P19 autoriza expressamente a pergunta de previsão para este instrumento, na camada Alexandria e com os números do próprio cenário.
- **Pergunta (camada Alexandria):** Usina de 100 MW que gerou 220.000 MWh em 8.760 horas: qual o fator de capacidade, em %?
- **Cenário-padrão:** {"i06-cap":100,"i06-gen":220000,"i06-h":8760}
- **Resposta no cenário-padrão:** 25,1 % (FC bruto 0,2511415525114155; ramo ativo "else if (FC >= 0.25)")

**Avisos.**

- **Nota da fonte:** A fonte não cita procedência para o cenário-padrão (100 MW / 220.000 MWh / 8.760 h) nem para os limiares das faixas (0,85 / 0,55 / 0,40 / 0,25 / 0,15). 8.760 = horas de um ano não bissexto (implícito em "100 × 8.760" na linha 2023; não declarado como tal).

**Estado no código (informativo, não é camada fonte).** divergente (comparação registrada no README do M01)

### m01-lab-01 · Laboratório · Comparador de perfil elétrico

**Identidade.** LAB · 01 · § Lab (fora de aula) · tipo: laboratorio

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Esta é a demonstração que valida toda a tese central do módulo. Ajuste as variáveis nas duas fábricas — mantendo o mesmo consumo total — e observe como a fatura mensal estimada diverge. O perfil elétrico é a diferença.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| lab-kwh | Consumo mensal · ambas | kWh | number | 100000 | 10000 – sem atributo max na fonte / passo 5000 | — |
| lab-tarifa | Tarifa energia média | R$/MWh | number | 450 | 100 – sem atributo max na fonte / passo 10 | — |
| lab-a-dem | Demanda máxima | kW | number + range gêmeo | 250 | 50 – sem atributo max na fonte / passo 10 | — |
| lab-a-fp | Fator de potência | — | number + range gêmeo | 0.96 | 0.5 – 1 / passo 0.01 | — |
| lab-a-ponta | Consumo em horário de ponta | % | number + range gêmeo | 5 | 0 – 100 / passo 1 | — |
| lab-b-dem | Demanda máxima | kW | number + range gêmeo | 600 | 50 – sem atributo max na fonte / passo 10 | — |
| lab-b-fp | Fator de potência | — | number + range gêmeo | 0.84 | 0.5 – 1 / passo 0.01 | — |
| lab-b-ponta | Consumo em horário de ponta | % | number + range gêmeo | 25 | 0 – 100 / passo 1 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| lab-a-energia | Energia | R$/mês (extração) | linha de comparação | — |
| lab-a-demanda | Demanda | R$/mês (extração) | linha de comparação | — |
| lab-a-reativo | Reativo excedente | R$/mês (extração) | linha de comparação | — |
| lab-a-adicponta | Adicional ponta | R$/mês (extração) | linha de comparação | — |
| lab-a-total | Fatura estimada | R$/mês (extração) | total | — |
| lab-b-energia | Energia | R$/mês (extração) | linha de comparação | — |
| lab-b-demanda | Demanda | R$/mês (extração) | linha de comparação | — |
| lab-b-reativo | Reativo excedente | R$/mês (extração) | linha de comparação | — |
| lab-b-adicponta | Adicional ponta | R$/mês (extração) | linha de comparação | — |
| lab-b-total | Fatura estimada | R$/mês (extração) | total | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Laboratório · Comparador de perfil elétrico" — "Comparador"
  - titulo da seção: "Duas fábricas. Mesmo kWh. Contas diferentes."
  - enunciado: "observe como a fatura mensal estimada diverge"
- **Desenho na fonte:** não há figura: a comparação existe só como duas colunas de texto (.compare-row × 4 + .compare-bill)
- **O que precisa ser desenhado:** Duas barras empilhadas lado a lado, Fábrica A e Fábrica B, na MESMA escala vertical, cada uma segmentada nas quatro linhas que a fonte já nomeia: Energia, Demanda, Reativo excedente, Adicional ponta; o total ("Fatura estimada") rotulado no topo de cada barra.
- **Eixo x:** as duas fábricas (A · Operação estável; B · Operação concentrada)
- **Eixo y:** R$ por mês, escala comum às duas barras, começando em zero
- **Séries:** Energia · Demanda · Reativo excedente · Adicional ponta
- **Relação que a figura tem de mostrar:** O segmento "Energia" é idêntico nas duas barras por construção — o campo "Consumo mensal · ambas" e a "Tarifa energia média" são compartilhados. Toda a divergência do total vem dos outros três segmentos. É a tese do módulo desenhada: mesmo kWh, contas diferentes.
- **Derivação:** literal quanto aos rótulos e à estrutura (campos_comuns compartilhados, 4 compare-row + 1 compare-bill por coluna); a forma (barra empilhada) é escolha de desenho da camada Alexandria.
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada (P6).
- **Por que não pedir:** Antes de tolerância, este instrumento precisa da reconciliação markup × script (divergência registrada no README do M01).

**Previsão (C3).**

- **Útil:** sim. A saída é numérica e o cenário-padrão está no markup; o erro de previsão é exatamente o ponto pedagógico ("mesmo kWh").
- **Pergunta (camada Alexandria):** Duas fábricas consomem 100.000 kWh/mês à mesma tarifa de R$ 450/MWh. A Fábrica A tem demanda máxima de 250 kW, fator de potência 0,96 e 5% do consumo na ponta; a Fábrica B tem demanda máxima de 600 kW. Quantos por cento a fatura da B fica acima da fatura da A?
- **Cenário-padrão:** null
- **Resposta no cenário-padrão:** DIVERGÊNCIA NÃO RECONCILIADA (P8/P5): o markup mostra Fábrica A R$ 52.375 e Fábrica B R$ 1.800 / R$ 67.425, enquanto o script calcula R$ 3.200 / R$ 68.825. A resposta de referência não pode ser fixada antes da reconciliação — a pergunta de previsão só entra depois dela.
- **BLOQUEIO:** reconciliacao-pendente — não formular a pergunta antes da reconciliação.

**Avisos.**

- **Nota da fonte:** A fonte não cita procedência para tarifa, demanda, fator de potência nem percentual de ponta.

**Estado no código (informativo, não é camada fonte).** divergente: markup R$ 1.800 / R$ 67.425 contra script R$ 3.200 / R$ 68.825 (README do M01)


## M02

### m02-inst-01 · Explorador · Camadas da rede

**Identidade.** INST · 01 · Aula 01 · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* 

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i01-pills | — | — | pilulas | ger | — | Geração / Transmissão / Distribuição / Consumo |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i01-volt | Tensões típicas | — | celula | — |
| i01-dono | Dono típico | — | celula | — |
| i01-oper | Quem opera | — | celula | — |
| i01-reg | Regulador | — | celula | — |
| i01-rem | Como é remunerado | — | celula | — |
| i01-fat | Onde aparece na fatura | — | celula | — |
| i01-note | — | — | nota_dinamica | — |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Explorador · Camadas da rede" — "Explorador" não promete forma desenhada
  - as sete saídas são células de texto (tensões, dono, operador, regulador, remuneração, fatura) mais uma nota dinâmica
- **Sem promessa, mas (C6):** O parágrafo que o invoca pede "mapa mental permanente" das quatro camadas. Uma faixa horizontal Geração → Transmissão → Distribuição → Consumo com a camada ativa destacada é orientação de navegação, não figura de dado.
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** não. Saída puramente qualitativa; C3 manda outro ato para instrumento exploratório.
- **Ato alternativo (C3):** Condição a encontrar: "percorra as quatro camadas e encontre a única em que o regulador não é a ANEEL" — ou, com os textos da fonte, "em qual camada a remuneração é por leilão e não por tarifa?".

**Avisos.**

- **Nota da fonte:** A fonte não cita origem externa para constantes, cenário-padrão ou limiares. O que declara está na nota do instrumento (ex.: "ilustrativos", "didático"). Tratar como cenário didático (P19/P20).

**Estado no código (informativo, não é camada fonte).** {"arquivo_meta":"src/lib/data/alexandria-modulo-02-content.ts (INSTRUMENTOS_MODULO_02)","arquivo_calculo":"src/lib/data/alexandria-instrument-calculators.ts (L1870–2237)","id":"m02-inst-01","metadados

### m02-inst-02 · Simulador · Perdas na transmissão

**Identidade.** INST · 02 · Aula 02 · tipo: simulador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* 

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i02-p | Potência transmitida | MW | numero+deslizador | 1000 | 100 – 4000 / passo 50 | — |
| i02-d | Distância | km | numero+deslizador | 800 | 50 – 2600 / passo 50 | — |
| i02-v | Tensão da linha | kV | selecao | 500 | — | 138 kV / 230 kV / 345 kV / 500 kV / 765 kV |
| i02-n | Circuitos em paralelo | — | selecao | 2 | — | 1 circuito / 2 circuitos / 3 circuitos / 4 circuitos |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i02-i | Corrente total | A (script) | readout | — |
| i02-loss | Perdas | MW (script) | readout | — |
| i02-pct | Perda relativa | % (script) | readout | — |
| i02-yr | Energia perdida / ano* | R$ mi (script) | readout | — |
| i02-verdict | — | — | veredito | — |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Simulador · Perdas na transmissão" — nomeia a grandeza, não uma forma
  - as quatro saídas são readouts numéricos mais um veredito
- **Sem promessa, mas (C6):** A perda cresce com o quadrado da corrente (loss = 3·R·I²/N) e a corrente cai com a tensão (I = P·1e6/(√3·V·1000·0,95)). Uma curva perda-relativa × distância, com uma linha por tensão da lista (138/230/345/500/765 kV), desenharia o compromisso que o veredito afirma em palavras. É C6, não C5.
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.
- **Por que não pedir:** O veredito da fonte fala em "faixa de engenharia" sem declarar a faixa. Registrar como P20 (verificação autoritativa), não como tolerância.

**Previsão (C3).**

- **Útil:** sim. Saída numérica com cenário-padrão declarado; a intuição de quanto se perde em 800 km costuma errar por um fator.
- **Pergunta (camada Alexandria):** 1.000 MW transmitidos por 800 km em 500 kV, com 2 circuitos em paralelo: qual a perda relativa, em %?
- **Cenário-padrão:** {"i02-p":1000,"i02-d":800,"i02-v":"500","i02-n":"2"}
- **Resposta no cenário-padrão:** 3,9 % (corrente 1.215 A; perdas 39,0 MW)

**Avisos.**

- **Nota da fonte:** A fonte não cita origem externa para constantes, cenário-padrão ou limiares. O que declara está na nota do instrumento (ex.: "ilustrativos", "didático"). Tratar como cenário didático (P19/P20).

**Estado no código (informativo, não é camada fonte).** {"arquivo_meta":"src/lib/data/alexandria-modulo-02-content.ts (INSTRUMENTOS_MODULO_02)","arquivo_calculo":"src/lib/data/alexandria-instrument-calculators.ts (L1870–2237)","id":"m02-inst-02","metadados

### m02-inst-03 · Cadeia de transformação · por perfil

**Identidade.** INST · 03 · Aula 03 · tipo: cadeia-de-transformacao

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* 

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i03-pills | — | — | pilulas | a2 | — | Eletrointensiva · A2 (138 kV) / Indústria média · A4 (13,8 kV) / Residencial · B (220 V) |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i03-total | Perda técnica acumulada típica até a entrega | % (script) | output | — |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Cadeia de transformação · por perfil" — "cadeia"
  - a fonte gera o desenho: div#i03-chain, html montado pelo script
- **Desenho na fonte:** cadeia html gerada (#i03-chain)
- **O que precisa ser desenhado:** A escada de transformação do perfil escolhido: um degrau por etapa, na ordem do array, com o salto de tensão e o nome da etapa no degrau e a perda daquela etapa medindo o degrau.
- **Eixo x:** sequência das etapas, da usina até a entrega (13,8 → 500 kV · SE elevadora; 500 kV · tronco; 500 → 138 kV · SE abaixadora; depois as etapas próprias do perfil)
- **Eixo y:** perda técnica de cada etapa, em % — e a soma acumulada declarada no readout
- **Séries:** perda por etapa · perda acumulada
- **Relação que a figura tem de mostrar:** Quanto mais longe da alta tensão o consumidor está, mais degraus ele atravessa e maior a perda acumulada: A2 (138 kV) ~3,1%; os perfis A4 e B acrescentam degraus.
- **Derivação:** literal (os rótulos de tensão, os nomes das etapas e os valores l de perda estão no array base/prof do script; o total é total += s.l)
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Para um consumidor eletrointensivo em A2 (138 kV), qual a perda técnica acumulada típica até a entrega, em %?
- **Cenário-padrão:** {"i03-pills":"a2"}
- **Resposta no cenário-padrão:** ~3,1 %

**Avisos.**

- **Nota da fonte:** A fonte não cita origem externa para constantes, cenário-padrão ou limiares. O que declara está na nota do instrumento (ex.: "ilustrativos", "didático"). Tratar como cenário didático (P19/P20).

**Estado no código (informativo, não é camada fonte).** {"arquivo_meta":"src/lib/data/alexandria-modulo-02-content.ts (INSTRUMENTOS_MODULO_02)","arquivo_calculo":"src/lib/data/alexandria-instrument-calculators.ts (L1870–2237)","id":"m02-inst-03","metadados

### m02-inst-04 · Simulador · Curva líquida e a rampa do fim da tarde

**Identidade.** INST · 04 · Aula 04 · tipo: simulador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* 

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i08-pico | Pico de carga do dia | GW | numero+deslizador | 95 | 80 – 105 / passo 1 | — |
| i08-solar | Solar instalada (UFV + MMGD) | GW | numero+deslizador | 30 | 0 – 45 / passo 1 | — |
| i08-ceu | Condição do céu | — | selecao | 1 | — | Céu limpo / Parcialmente nublado / Encoberto |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i08-min | Carga líquida mínima | GW (script) | readout | — |
| i08-rampa | Rampa máxima | GW/h (script) | readout | — |
| i08-solpico | Solar no pico do dia | GW (script) | readout | — |
| i08-verdict | — | — | veredito | — |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Simulador · Curva líquida e a rampa do fim da tarde" — promete uma curva e uma rampa, nominalmente
  - a fonte desenha: svg#i08-svg, viewBox "0 0 680 250"
- **Desenho na fonte:** svg #i08-svg (0 0 680 250)
- **O que precisa ser desenhado:** Duas curvas sobre as 24 horas do dia: a carga bruta e a carga líquida (carga menos solar), com a área entre elas sombreada — a barriga solar. Marcar o ponto de mínimo da curva líquida e destacar o par de horas consecutivas de maior subida.
- **Eixo x:** hora do dia, 0 a 24 (o laço do script percorre h de 0 a 24 aplicando o perfil f[h])
- **Eixo y:** GW
- **Séries:** carga bruta L = pico × f[h] · solar s(h) = S × cond × max(0, sin(π·(h−6)/12))^1.5 para 6 ≤ h ≤ 18, zero fora disso · carga líquida = L − s · marca do mínimo (minNet, minH) · marca da rampa máxima (rampa, rH)
- **Relação que a figura tem de mostrar:** A barriga do meio-dia e a rampa do fim da tarde são o mesmo fenômeno visto em horas diferentes: quanto mais fundo o mínimo, mais íngreme a subida que vem depois. A figura precisa deixar ler a profundidade e a inclinação na mesma imagem.
- **Derivação:** derivado do código-fonte (as fórmulas de L, s e da rampa são verbatim do script, linhas 3540–3554); os rótulos de eixo não são literais da fonte.
- **Alerta de porte:** O C5/C6 do bar registra como problema "CURVA LÍQUIDA sem curva nenhuma". A fonte TEM a curva. Quem portar precisa portar o svg, não só os readouts.
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** sim. C3: a rampa é a grandeza que a intuição mais erra, e o cenário-padrão está declarado.
- **Pergunta (camada Alexandria):** Pico de carga de 95 GW, 30 GW de solar instalada, céu parcialmente nublado: qual a maior variação da carga líquida em uma hora, em GW/h?
- **Cenário-padrão:** {"i08-pico":95,"i08-solar":30,"i08-ceu":"1"}
- **Resposta no cenário-padrão:** +11,4 GW/h, entre 16h e 17h (carga líquida mínima de 56 GW às 12h)

**Avisos.**

- **Nota da fonte:** A fonte não cita origem externa para constantes, cenário-padrão ou limiares. O que declara está na nota do instrumento (ex.: "ilustrativos", "didático"). Tratar como cenário didático (P19/P20).

**Estado no código (informativo, não é camada fonte).** {"arquivo_meta":"src/lib/data/alexandria-modulo-02-content.ts (INSTRUMENTOS_MODULO_02)","arquivo_calculo":"src/lib/data/alexandria-instrument-calculators.ts (L1870–2237)","id":"m02-inst-04","metadados

### m02-inst-05 · Simulador · Despacho por ordem de mérito

**Identidade.** INST · 05 · Aula 05 · tipo: simulador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* 

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i04-dem | Demanda do SIN | GW | numero+deslizador | 82 | 60 – 105 / passo 1 | — |
| i04-vento | Vento no NE | % do parque | numero+deslizador | 55 | 0 – 100 / passo 5 | — |
| i04-sol | Geração solar | % do parque | numero+deslizador | 40 | 0 – 100 / passo 5 | — |
| i04-res | Reservatórios | % EAR | numero+deslizador | 60 | 10 – 100 / passo 5 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i04-cmo | CMO (proxy didático) | R$ (script) | readout | — |
| i04-marg | Usina marginal | — | readout | — |
| i04-term | Térmica despachada | GW (script) | readout | — |
| i04-cut | Corte de renovável | GW (script) | readout | — |
| i04-verdict | — | — | veredito | — |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Simulador · Despacho por ordem de mérito" — "ordem de mérito" é uma pilha ordenada
  - a fonte desenha: div#i04-stack, "pilha de despacho (html gerado)"
- **Desenho na fonte:** pilha de despacho html (#i04-stack)
- **O que precisa ser desenhado:** A fila das usinas ordenada por custo crescente, uma faixa por usina, com a parte despachada preenchida e a parte ociosa vazia; a usina que fecha a demanda marcada como marginal; as must-run no início com o rótulo que a fonte lhes dá.
- **Eixo x:** capacidade acumulada, em GW, na ordem crescente de custo
- **Eixo y:** custo variável da usina, em R$/MWh (o valor da água entra como va = max(PISO, min(650, round(650 − 6,2·r))))
- **Séries:** capacidade por usina · despacho efetivo por usina · corte de renovável quando must-run > demanda · linha do CMO na altura do custo da marginal
- **Relação que a figura tem de mostrar:** O preço não é um atributo da demanda: é a altura da última usina chamada. Mexer nos reservatórios desloca uma única faixa da pilha e o preço inteiro vai junto.
- **Derivação:** derivado do código-fonte (plantList, ordenação por cost, laço de despacho e cálculo do corte, linhas 3267–3304).
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Demanda do SIN de 82 GW, vento a 55% do parque, solar a 40%, reservatórios a 60% da EAR: qual usina fica marginal e qual CMO ela forma?
- **Cenário-padrão:** {"i04-dem":82,"i04-vento":55,"i04-sol":40,"i04-res":60}
- **Resposta no cenário-padrão:** Hidro reservatório, CMO (proxy didático) R$ 278; térmica despachada 9,0 GW; corte de renovável 0,0 GW

**Avisos.**

- **Nota da fonte:** A fonte não cita origem externa para constantes, cenário-padrão ou limiares. O que declara está na nota do instrumento (ex.: "ilustrativos", "didático"). Tratar como cenário didático (P19/P20).

**Estado no código (informativo, não é camada fonte).** {"arquivo_meta":"src/lib/data/alexandria-modulo-02-content.ts (INSTRUMENTOS_MODULO_02)","arquivo_calculo":"src/lib/data/alexandria-instrument-calculators.ts (L1870–2237)","id":"m02-inst-05","metadados

### m02-inst-06 · Calculadora · Bateria: potência × energia

**Identidade.** INST · 06 · Aula 07 · tipo: calculadora

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* 

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i09-mw | Potência | MW | numero+deslizador | 20 | 5 – 50 / passo 1 | — |
| i09-mwh | Energia armazenada | MWh | numero+deslizador | 80 | 10 – 200 / passo 5 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i09-h | Duração na potência máxima | h (script) | readout | — |
| i09-voc | Vocação típica | — | readout | — |
| i09-verdict | — | — | veredito | — |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Calculadora · Bateria: potência × energia" — nomeia duas grandezas, não uma forma
  - saídas: duração, vocação e veredito
- **Sem promessa, mas (C6):** O par (MW, MWh) é um ponto num plano, e os três ramos de vocação (h < 1; h ≤ 3; h > 3) são três faixas desse plano. Um plano potência × energia com as três faixas nomeadas e o ponto escolhido é C6 barato.
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Bateria de 20 MW e 80 MWh: quantas horas ela sustenta a potência máxima?
- **Cenário-padrão:** {"i09-mw":20,"i09-mwh":80}
- **Resposta no cenário-padrão:** 4,0 h — vocação "Rampa do fim da tarde · deslocamento de energia"

**Avisos.**

- **Nota da fonte:** A fonte não cita origem externa para constantes, cenário-padrão ou limiares. O que declara está na nota do instrumento (ex.: "ilustrativos", "didático"). Tratar como cenário didático (P19/P20).

**Estado no código (informativo, não é camada fonte).** {"arquivo_meta":"src/lib/data/alexandria-modulo-02-content.ts (INSTRUMENTOS_MODULO_02)","arquivo_calculo":"src/lib/data/alexandria-instrument-calculators.ts (L1870–2237)","id":"m02-inst-06","metadados

### m02-inst-07 · Simulador · Excursão de frequência

**Identidade.** INST · 07 · Aula 08 · tipo: simulador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* 

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i05-dp | Geração perdida | GW | numero+deslizador | 6 | 1 – 16 / passo 0.5 | — |
| i05-carga | Carga do SIN | GW | numero+deslizador | 80 | 65 – 100 / passo 1 | — |
| i05-h | Inércia do mix | — | selecao | 4.2 | — | Alta · hidro-dominado clássico / Média · mix atual / Baixa · alta penetração de inversores |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i05-rocof | RoCoF inicial | Hz/s (script) | readout | — |
| i05-nadir | Nadir de frequência | Hz (script) | readout | — |
| i05-status | Veredito | — | readout | — |
| i05-verdict | — | — | veredito | — |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Simulador · Excursão de frequência" — "excursão" é uma trajetória no tempo
  - a fonte desenha: svg#i05-svg, viewBox "0 0 680 240"
- **Desenho na fonte:** svg #i05-svg (0 0 680 240)
- **O que precisa ser desenhado:** A trajetória da frequência depois da perda de geração: queda, nadir e recomposição, com a tangente inicial (o RoCoF) visível como inclinação no instante zero e o nadir marcado como o ponto mais baixo.
- **Eixo x:** tempo após o evento, em segundos (o laço do script varre t e usa a constante de tempo 5)
- **Eixo y:** frequência, em Hz, com 60,00 Hz como referência
- **Séries:** f(t) = 60 − dfn · (t/5) · e^(1 − t/5) · marca do nadir · inclinação inicial = RoCoF = (ΔP/P)·60/(2H) · linha do limiar de corte de carga citada no ramo (nadir < 57,5)
- **Relação que a figura tem de mostrar:** A inércia H aparece duas vezes no mesmo desenho: ela governa a inclinação inicial e a profundidade do nadir. Trocar o mix muda as duas juntas — é o que o veredito afirma em palavras e a figura precisa mostrar.
- **Derivação:** derivado do código-fonte (rocof, dfn, nadir e f(t) verbatim, linhas 3367–3398).
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Perda súbita de 6 GW num SIN com 80 GW de carga e inércia do mix "Média · mix atual" (H = 4,2): onde fica o nadir de frequência, em Hz?
- **Cenário-padrão:** {"i05-dp":6,"i05-carga":80,"i05-h":"4.2"}
- **Resposta no cenário-padrão:** 59,04 Hz (RoCoF inicial −0,54 Hz/s; estado "Severo, contido")

**Avisos.**

- **Nota da fonte:** A fonte não cita origem externa para constantes, cenário-padrão ou limiares. O que declara está na nota do instrumento (ex.: "ilustrativos", "didático"). Tratar como cenário didático (P19/P20).

**Estado no código (informativo, não é camada fonte).** {"arquivo_meta":"src/lib/data/alexandria-modulo-02-content.ts (INSTRUMENTOS_MODULO_02)","arquivo_calculo":"src/lib/data/alexandria-instrument-calculators.ts (L1870–2237)","id":"m02-inst-07","metadados

### m02-inst-08 · Calculadora · Perda embutida na conta

**Identidade.** INST · 08 · Aula 09 · tipo: calculadora

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* 

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i06-c | Consumo medido | MWh/mês | numero+deslizador | 500 | 50 – 5000 / passo 50 | — |
| i06-p | Perdas do sistema a montante | % | numero+deslizador | 14 | 5 – 35 / passo 1 | — |
| i06-t | Custo da energia | R$/MWh | numero+deslizador | 350 | 150 – 800 / passo 10 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i06-inj | Energia injetada p/ te atender | MWh (script) | readout | — |
| i06-perd | Perdas atribuíveis | MWh (script) | readout | — |
| i06-rs | Custo de perdas / mês | R$ mil (script) | readout | — |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Calculadora · Perda embutida na conta" — três readouts, sem promessa de forma
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Unidade que mede 500 MWh/mês, com 14% de perdas a montante e energia a R$ 350/MWh: quanto custam as perdas atribuíveis por mês?
- **Cenário-padrão:** {"i06-c":500,"i06-p":14,"i06-t":350}
- **Resposta no cenário-padrão:** R$ 28,5 mil (581 MWh injetados; 81,4 MWh de perdas)

**Avisos.**

- **Nota da fonte:** A fonte não cita origem externa para constantes, cenário-padrão ou limiares. O que declara está na nota do instrumento (ex.: "ilustrativos", "didático"). Tratar como cenário didático (P19/P20).

**Estado no código (informativo, não é camada fonte).** {"arquivo_meta":"src/lib/data/alexandria-modulo-02-content.ts (INSTRUMENTOS_MODULO_02)","arquivo_calculo":"src/lib/data/alexandria-instrument-calculators.ts (L1870–2237)","id":"m02-inst-08","metadados

### m02-inst-09 · Simulador · Dois submercados, um fio

**Identidade.** INST · 09 · Aula 10 · tipo: simulador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* 

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i07-vento | Vento no NE | GW disponíveis | numero+deslizador | 18 | 4 – 26 / passo 1 | — |
| i07-dse | Demanda no SE | GW | numero+deslizador | 50 | 38 – 62 / passo 1 | — |
| i07-lim | Limite do intercâmbio | GW | numero+deslizador | 8 | 0 – 14 / passo 1 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i07-ne | PLD proxy · NE | R$ (script) | readout | — |
| i07-se | PLD proxy · SE | R$ (script) | readout | — |
| i07-flow | Fluxo NE → SE | GW (script) | readout | — |
| i07-cut | Vento cortado | GW (script) | readout | — |
| i07-verdict | — | — | veredito | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Simulador · Dois submercados, um fio" — o título nomeia dois lados e o fio entre eles
  - as saídas são um preço de cada lado, o fluxo e o corte
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** Duas pilhas de despacho lado a lado — NE e SE — com uma seta entre elas cuja espessura é o fluxo e cujo limite é uma barra fixa. Quando o fluxo encosta no limite, as duas pilhas passam a ter marginais diferentes e os dois preços se separam visivelmente.
- **Eixo x:** em cada pilha, capacidade acumulada em GW ordenada por custo; entre as pilhas, o fluxo NE → SE em GW contra o limite do intercâmbio
- **Eixo y:** custo variável em R$/MWh, escala comum às duas pilhas
- **Séries:** pilha NE · pilha SE · fluxo NE → SE e o limite · vento cortado no NE · PLD proxy de cada lado
- **Relação que a figura tem de mostrar:** Com folga no fio, uma única usina marginal precifica os dois lados e o spread é zero. Ao saturar, cada lado passa a ter a sua marginal e o spread abre — a mesma seta que transporta energia transporta preço, até o limite.
- **Derivação:** derivado do código-fonte (dispatchIsland, flow = genNE − DNE, f = ±L, pne/pse, cut, linhas 3478–3495).
- **Custo:** G

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** 18 GW de vento disponível no NE, 50 GW de demanda no SE e limite de intercâmbio de 8 GW: os dois PLDs proxy ficam iguais ou diferentes, e quanto de vento é cortado?
- **Cenário-padrão:** {"i07-vento":18,"i07-dse":50,"i07-lim":8}
- **Resposta no cenário-padrão:** Iguais — R$ 360 dos dois lados; fluxo 6,0 de 8,0 GW, com folga; vento cortado 0,0 GW

**Avisos.**

- **Nota da fonte:** A fonte não cita origem externa para constantes, cenário-padrão ou limiares. O que declara está na nota do instrumento (ex.: "ilustrativos", "didático"). Tratar como cenário didático (P19/P20).

**Estado no código (informativo, não é camada fonte).** {"arquivo_meta":"src/lib/data/alexandria-modulo-02-content.ts (INSTRUMENTOS_MODULO_02)","arquivo_calculo":"src/lib/data/alexandria-instrument-calculators.ts (L1870–2237)","id":"m02-inst-09","metadados


## M03

### m03-inst-01 · Explorador · A matriz nas duas lentes

**Identidade.** INST · 01 · {"marcador":"Aula 01","aula_id_codigo":"aula-03-01","pergunta_do_map":{"texto":"Quanto o Brasil tem de quê — e por que MW instalado não é MWh entregue?","linha_aprox":1444}} · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* 

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i01-pills | — | — | pilulas | cap | — | Capacidade instalada / Energia gerada |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Explorador · A matriz nas duas lentes"
  - a fonte desenha: pilha html #i01-stack, com nome e valor por fonte
- **Desenho na fonte:** pilha html (#i01-stack); no cenário-padrão, 6 faixas com largura em % e rótulo
- **O que precisa ser desenhado:** A participação das seis fontes na lente escolhida, uma faixa por fonte, largura proporcional à participação, com o valor em % no rótulo — exatamente o que a fonte já monta.
- **Eixo x:** participação em % (0 a 100)
- **Eixo y:** as seis fontes, ordenadas pela participação da lente ativa
- **Séries:** lente Capacidade instalada: Hidráulica 43,5 · Solar 25,0 · Eólica 13,5 · Térmicas fósseis 10,0 · Biomassa 6,5 · Nuclear 1,0 · lente Energia gerada: Hidráulica 56,0 · Eólica 13,5 · Solar 10,0 · Térmicas fósseis 10,0 · Biomassa 8,0 · Nuclear 2,5
- **Relação que a figura tem de mostrar:** Trocar a lente reordena a lista: a solar cai de segunda para terceira e a hidráulica passa de menos da metade para mais da metade. É a troca de posição que ensina, não o valor.
- **Derivação:** literal (os seis nomes e os doze valores estão no objeto DATA do script; as larguras em % do cenário-padrão vêm da execução registrada).
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, previsão nem gabarito para nenhum instrumento (P6). Qualquer regra de arredondamento é da camada Alexandria.

**Previsão (C3).**

- **Útil:** sim. A troca de posição entre as duas lentes é exatamente o erro de previsão que a aula quer provocar.
- **Pergunta (camada Alexandria):** Na lente de capacidade instalada a solar é a segunda fonte, com 25,0%. Na lente de energia gerada, em que posição ela fica e com que participação?
- **Cenário-padrão:** {"i01-pills":"cap"}
- **Resposta no cenário-padrão:** Terceira, com 10,0% — atrás da hidráulica (56,0%) e da eólica (13,5%)

**Avisos.**

- **Nota da fonte:** Nenhuma constante do script traz fonte por valor. A nota do instrumento declara o estatuto dos números em texto (ver nota_instrumento); atribuições nomeadas nela: "Participações didáticas, em ordem de grandeza, construídas sobre ANEEL/SIGA (capacidade, incl." "MMGD no total) e ONS/EPE (geração) — composições típicas recentes, não foto de um mês específico." P19/P20: tratar como cenário didático; n
- **Content QA (P20):** P20: a nota do instrumento declara "Participações didáticas, em ordem de grandeza". Nenhum dos doze valores pode ser apresentado como estatística oficial.

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","instrument_def":{"id":"m03-inst-01","kind":"explorador","title_igual":true,"formula":null,"nota_igual":true,"aula_codigo":"aula-03-01","aula_confere":true},"campos_codigo":[{"i

### m03-inst-02 · Calculadora · FC × energia anual

**Identidade.** INST · 02 · {"marcador":"Aula 01","aula_id_codigo":"aula-03-01","pergunta_do_map":{"texto":"Quanto o Brasil tem de quê — e por que MW instalado não é MWh entregue?","linha_aprox":1444}} · tipo: calculadora

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* 

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i02-mw | Potência instalada | MW | numero | 100 | 1 – 2000 / passo 1 | — |
| i02-fc | Fator de capacidade | % | numero | 27 | 5 – 95 / passo 1 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i02-gwh | Energia anual | GWh/ano (script) | — | `gwhOut.textContent = fb(gwh, 0) + " GWh/ano";` |
| i02-heq | Equivale a rodar pleno | h/ano (script) | — | `heqOut.textContent = fb(heq, 0) + " h/ano";` |
| i02-pct | Do consumo nacional* | % (script) | — | `pctOut.textContent = fb(pct, 3) + " %";` |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Calculadora · FC × energia anual"
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, previsão nem gabarito para nenhum instrumento (P6). Qualquer regra de arredondamento é da camada Alexandria.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** 100 MW instalados com fator de capacidade de 27%: quanta energia por ano, em GWh?
- **Cenário-padrão:** {"i02-mw":100,"i02-fc":27}
- **Resposta no cenário-padrão:** 237 GWh/ano (2.365 h/ano equivalentes a plena carga; 0,043 % do consumo nacional adotado)

**Avisos.**

- **Nota da fonte:** Nenhuma constante do script traz fonte por valor. A nota do instrumento declara o estatuto dos números em texto (ver nota_instrumento); atribuições nomeadas nela: "*Consumo nacional tomado em ~550 TWh/ano (EPE/ONS — número vivo)." P19/P20: tratar como cenário didático; não apresentar como dado oficial.
- **Content QA (P20):** P20: a nota declara "*Consumo nacional tomado em ~550 TWh/ano". Exibir como premissa do cenário, nunca como dado verificado.

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","instrument_def":{"id":"m03-inst-02","kind":"calculadora","title_igual":true,"formula":null,"nota_igual":true,"aula_codigo":"aula-03-01","aula_confere":true},"campos_codigo":[{"

### m03-inst-03 · Simulador · A bateria do Brasil (EAR ao longo do ano)

**Identidade.** INST · 03 · {"marcador":"Aula 02","aula_id_codigo":"aula-03-02","pergunta_do_map":{"texto":"Por que o Brasil construiu as maiores baterias do mundo antes da primeira célula de lítio?","linha_aprox":1445}} · tipo: simulador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* 

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i03-ena | Cenário hidrológico | ENA % da média | numero | 100 | 55 – 130 / passo 5 | — |
| i03-ear | EAR inicial (1º de janeiro) | % | numero | 60 | 20 – 95 / passo 5 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i03-min | EAR mínima do ano | % (script) | — | `minOut.textContent = fb(minP, 0) + " %";` |
| i03-mes | Mês crítico | — | — | `mesOut.textContent = MESES[minM];` |
| i03-term | Meses com térmica pesada | meses (script) | — | `termOut.textContent = termM + (termM === 1 ? " mês" : " meses");` |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Simulador · A bateria do Brasil (EAR ao longo do ano)" — "ao longo do ano" é uma trajetória
  - a fonte desenha: svg#i03-svg, viewBox "0 0 700 250"
- **Desenho na fonte:** svg #i03-svg (0 0 700 250)
- **O que precisa ser desenhado:** A trajetória mensal do estoque: uma linha de doze pontos que carrega na estação úmida e descarrega na seca, com o mês de mínimo marcado e a faixa abaixo de 30% sombreada (é ela que conta os "meses com térmica pesada").
- **Eixo x:** os doze meses do ano, na ordem do array MESES
- **Eixo y:** energia armazenada, em % da capacidade (CAPAC = 5 no modelo; pct = ear/CAPAC × 100)
- **Séries:** EAR mensal · marca do mês crítico · limiar de 30%
- **Relação que a figura tem de mostrar:** O reservatório é uma bateria de ciclo anual: o que entra na estação úmida é o que sustenta a seca. Baixar a ENA não desloca a curva para baixo por igual — ela afunda no fim do ciclo, que é onde o mínimo aparece.
- **Derivação:** derivado do código-fonte (laço de 12 meses com SHAPE[m]×ena, gen, ear e pct, linhas 2930–2945).
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, previsão nem gabarito para nenhum instrumento (P6). Qualquer regra de arredondamento é da camada Alexandria.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Ano hidrológico na média (ENA 100%) e EAR de 60% em 1º de janeiro: qual a EAR mínima do ano, em %, e em que mês?
- **Cenário-padrão:** {"i03-ena":100,"i03-ear":60}
- **Resposta no cenário-padrão:** 52 %, em Out; 0 meses com térmica pesada

**Avisos.**

- **Nota da fonte:** Nenhuma constante do script traz fonte por valor. A nota do instrumento declara o estatuto dos números em texto (ver nota_instrumento); atribuições nomeadas nela: "Não é o NEWAVE — é a intuição do NEWAVE." P19/P20: tratar como cenário didático; não apresentar como dado oficial.
- **Content QA (P20):** A nota do instrumento declara: "Não é o NEWAVE — é a intuição do NEWAVE." Manter esse aviso junto do bloco (S4).

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","instrument_def":{"id":"m03-inst-03","kind":"simulador","title_igual":true,"formula":null,"nota_igual":true,"aula_codigo":"aula-03-02","aula_confere":true},"campos_codigo":[{"id

### m03-inst-04 · Comparador · Reservatório × fio d'água sob a mesma seca

**Identidade.** INST · 04 · {"marcador":"Aula 03","aula_id_codigo":"aula-03-03","pergunta_do_map":{"texto":"Por que o país parou de construir reservatórios — e o que essa escolha custou em firmeza?","linha_aprox":1446}} · tipo: comparador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* 

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i04-ena | Hidrologia do ano | ENA % da média | numero | 100 | 55 – 130 / passo 5 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i04-fcfio | Fio d'água · FC anual | % (script) | — | `fcOut.textContent = fb(fcFio, 0) + " %";` |
| i04-minfio | Fio · pior mês (% da capac.) | % (script) | — | `minOut.textContent = fb(fioMin / FIO_CAP * 100, 0) + " %";` |
| i04-firme | Reservatório · entrega firme | % (script) | — | `firmeOut.textContent = fb(firmeMin * 100, 0) + " % do alvo";` |
| i04-stk | Reservatório · estoque final | % (script) | — | `stkOut.textContent = fb(stor / RES_CAP * 100, 0) + " %";` |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Comparador · Reservatório × fio d'água sob a mesma seca" — "×" e "sob a mesma seca" prometem duas trajetórias sobre a mesma série
  - a fonte não declara desenho algum
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** Duas trajetórias mensais desenhadas sobre a MESMA série de afluência: a geração do fio d'água (limitada pela capacidade) e a entrega firme do reservatório (limitada pelo alvo). Abaixo delas, numa faixa própria, o estoque do reservatório caindo — é ele que paga a firmeza.
- **Eixo x:** os doze meses, com a mesma série de afluência SHAPE[m] × ENA nos dois casos
- **Eixo y:** geração entregue, como fração da capacidade (fio) e do alvo (reservatório); faixa inferior em % do estoque
- **Séries:** fio d'água: g = min(FIO_CAP, inflow), FIO_CAP = 1,6 · reservatório: g = min(1, estoque + inflow), RES_CAP = 4, início 2,5 · estoque do reservatório ao longo do ano
- **Relação que a figura tem de mostrar:** Num ano bom as duas linhas quase se encostam e o instrumento parece não ter assunto. Ao arrastar a ENA para baixo, a linha do fio d'água afunda com a afluência enquanto a do reservatório se mantém — à custa do estoque, que some na faixa de baixo. A figura precisa deixar ver que a firmeza de um é o esvaziamento do outro.
- **Derivação:** derivado do código-fonte (laço único de 12 meses com gFio e gRes, constantes FIO_CAP/RES_CAP/RES_START, linhas 2994–3010).
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, previsão nem gabarito para nenhum instrumento (P6). Qualquer regra de arredondamento é da camada Alexandria.

**Previsão (C3).**

- **Útil:** sim. O instrumento existe para mostrar que o ano bom esconde a diferença — o erro de previsão é o próprio conteúdo.
- **Pergunta (camada Alexandria):** Hidrologia na média (ENA 100%): qual o fator de capacidade anual do fio d'água, em %, e quanto da entrega firme o reservatório consegue sustentar?
- **Cenário-padrão:** {"i04-ena":100}
- **Resposta no cenário-padrão:** Fio d'água a 63 % de FC anual, com pior mês em 31 % da capacidade; reservatório em 100 % do alvo, com estoque final de 55 %

**Avisos.**

- **Nota da fonte:** Nenhuma constante do script traz fonte por valor. A nota do instrumento declara o estatuto dos números em texto (ver nota_instrumento); atribuições nomeadas nela: "nenhuma" P19/P20: tratar como cenário didático; não apresentar como dado oficial.
- **Content QA (P20):** P20 e P8: o FCap do fio d'água aparece como 40–55% na tabela do módulo e 63% aqui. Divergência registrada, não resolvida.

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","instrument_def":{"id":"m03-inst-04","kind":"comparador","title_igual":true,"formula":null,"nota_igual":true,"aula_codigo":"aula-03-03","aula_confere":true},"campos_codigo":[{"i

### m03-inst-05 · Simulador · O dia do sistema: solar, vento e o resíduo

**Identidade.** INST · 05 · {"marcador":"Aula 05","aula_id_codigo":"aula-03-05","pergunta_do_map":{"texto":"O que acontece quando a fonte mais barata do leilão é também a mais rígida do relógio?","linha_aprox":1448}} · tipo: simulador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* 

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i05-sol | Solar total no sistema | GW instalados | numero | 35 | 0 – 80 / passo 5 | — |
| i05-eol | Eólica gerando | GW médios no dia | numero | 12 | 0 – 28 / passo 1 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i05-min | Resíduo mínimo (meio-dia) | GW (script) | — | `minOut.textContent = fb(minR, 0) + " GW";` |
| i05-rampa | Rampa do pôr do sol | GW/h (script) | — | `rampaOut.textContent = "+" + fb(rampa, 1) + " GW/h";` |
| i05-exc | Excedente didático | GWh/dia (script) | — | `excOut.textContent = fb(exc, 0) + " GWh/dia";` |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Simulador · O dia do sistema: solar, vento e o resíduo" — "o dia" e três grandezas nomeadas
  - a fonte desenha: svg#i05-svg, viewBox "0 0 700 250"
- **Desenho na fonte:** svg #i05-svg (0 0 700 250)
- **O que precisa ser desenhado:** O dia inteiro em três camadas: a carga por cima, a solar e a eólica preenchendo por baixo, e o resíduo — o que sobra para o despachável — como a faixa entre elas. Marcar a hora do resíduo mínimo e o trecho de 17h a 20h onde a rampa é medida.
- **Eixo x:** hora do dia, 0 a 24 (arrays LOAD e WFAC têm 25 posições, h = 0…24)
- **Eixo y:** GW
- **Séries:** carga LOAD[h] · solar gs = S × 0,78 × sin(π(h−6)/12) para 6 ≤ h ≤ 18 · eólica gw = W × WFAC[h] · resíduo r = LOAD[h] − gs − gw, com piso em zero · marca do mínimo (minR, minH) · janela da rampa, h de 16 a 20
- **Relação que a figura tem de mostrar:** Quanto mais fundo o resíduo cai ao meio-dia, mais íngreme é a subida do fim da tarde. A barriga e a rampa são a mesma curva em horas diferentes — e o excedente só aparece quando o resíduo bateria abaixo de zero.
- **Derivação:** derivado do código-fonte (LOAD, WFAC, gs, gw, r e o laço da rampa, linhas 3038–3050).
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, previsão nem gabarito para nenhum instrumento (P6). Qualquer regra de arredondamento é da camada Alexandria.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** 35 GW de solar instalada e 12 GW médios de eólica no dia: a quanto cai o resíduo no meio-dia, em GW, e qual a rampa do pôr do sol, em GW/h?
- **Cenário-padrão:** {"i05-sol":35,"i05-eol":12}
- **Resposta no cenário-padrão:** Resíduo mínimo de 47 GW; rampa de +12,5 GW/h; excedente didático 0 GWh/dia

**Avisos.**

- **Nota da fonte:** Nenhuma constante do script traz fonte por valor. A nota do instrumento declara o estatuto dos números em texto (ver nota_instrumento); atribuições nomeadas nela: "nenhuma" P19/P20: tratar como cenário didático; não apresentar como dado oficial.

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","instrument_def":{"id":"m03-inst-05","kind":"simulador","title_igual":true,"formula":null,"nota_igual":true,"aula_codigo":"aula-03-05","aula_confere":true},"campos_codigo":[{"id

### m03-inst-06 · Simulador · A pilha de CVU: monte a ordem de mérito

**Identidade.** INST · 06 · {"marcador":"Aula 06","aula_id_codigo":"aula-03-06","pergunta_do_map":{"texto":"Por que a usina mais cara de rodar pode ser a mais valiosa de ter?","linha_aprox":1449}} · tipo: simulador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* 

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i06-dem | Demanda do sistema | GW | numero | 75 | 40 – 105 / passo 1 | — |
| i06-agua | Valor da água | R$/MWh | numero | 150 | 60 – 650 / passo 10 | — |
| i06-gas | Preço do gás / GNL | — | selecao | 1 | — | Baixo (mercado folgado) / Médio / Alto (crise global, 2021/2022) |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i06-marg | Fonte marginal | — | — | `margOut.textContent = D <= mustCap ? "Renovável (sobra)" : (marg ? marg.name : "—");` |
| i06-cmo | CMO didático | R$/MWh (script) | — | `cmoOut.textContent = "R$ " + fb(cmo, 0) + "/MWh";` |
| i06-term | Térmica despachada | GW (script) | — | `termOut.textContent = fb(termGW, 1) + " GW";` |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Simulador · A pilha de CVU: monte a ordem de mérito" — "pilha" e "monte"
  - a fonte desenha: pilha html #i06-stack, com despachado/capacidade e o custo por faixa
- **Desenho na fonte:** pilha html (#i06-stack); no cenário-padrão, 8+ faixas com classes marginal/off
- **O que precisa ser desenhado:** A fila ordenada por custo, uma faixa por usina, preenchida na proporção do que foi despachado, com o rótulo que a fonte dá a cada uma ("must-run", "R$ 30 · base", "R$ 150 · valor da água"), a marginal destacada e as não chamadas apagadas.
- **Eixo x:** capacidade acumulada em GW, ordem crescente de custo
- **Eixo y:** custo variável em R$/MWh, do piso (PISO = 61) ao topo da fila
- **Séries:** capacidade e despacho por usina · posição da marginal · linha do CMO didático
- **Relação que a figura tem de mostrar:** O valor da água é a única faixa que se move quando o usuário mexe no reservatório, e ela arrasta o preço inteiro. Subir o preço do gás reordena a fila sem mexer na demanda. A figura tem de deixar ver a fila se reorganizando.
- **Derivação:** literal quanto aos nomes, capacidades e rótulos (array plantList); derivado quanto à ordenação e ao despacho.
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, previsão nem gabarito para nenhum instrumento (P6). Qualquer regra de arredondamento é da camada Alexandria.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Demanda de 75 GW, valor da água em R$ 150/MWh e preço do gás "Médio": qual fonte fica marginal e qual CMO ela forma?
- **Cenário-padrão:** {"i06-dem":75,"i06-agua":150,"i06-gas":"1"}
- **Resposta no cenário-padrão:** Hidro reservatório, CMO didático de R$ 150/MWh; térmica despachada 0,0 GW

**Avisos.**

- **Nota da fonte:** Nenhuma constante do script traz fonte por valor. A nota do instrumento declara o estatuto dos números em texto (ver nota_instrumento); atribuições nomeadas nela: "Pilha didática com capacidades e CVUs ilustrativos em ordem de grandeza (faixas inspiradas em CVUs homologados pela ANEEL/CCEE — vivos, mudam a cada revisão e a cada cotação de combustível)." "Piso de R$ 61 como referência do piso regul
- **Content QA (P20):** A nota declara "Pilha didática com capacidades e CVUs ilustrativos em ordem de grandeza" (P19/P20).

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","instrument_def":{"id":"m03-inst-06","kind":"simulador","title_igual":true,"formula":null,"nota_igual":true,"aula_codigo":"aula-03-06","aula_confere":true},"campos_codigo":[{"id

### m03-inst-07 · Dimensionador · MW, MWh e o preço da viagem no tempo

**Identidade.** INST · 07 · {"marcador":"Aula 09","aula_id_codigo":"aula-03-09","pergunta_do_map":{"texto":"Bateria gera energia ou desloca energia — e o que o leilão de 2026 está comprando de verdade?","linha_aprox":1452}} · tipo: dimensionador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* 

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i07-mw | Potência | MW | numero | 100 | 10 – 500 / passo 10 | — |
| i07-h | Duração | horas | numero | 4 | 0.5 – 6 / passo 0.5 | — |
| i07-eff | Eficiência de ciclo | % | numero | 88 | 82 – 95 / passo 1 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i07-mwh | Tanque (energia) | MWh (script) | — | `mwhOut.textContent = fb(E, 0) + " MWh";` |
| i07-desl | Deslocado por dia (1 ciclo) | MWh/dia (script) | — | `deslOut.textContent = fb(E, 0) + " MWh/dia";` |
| i07-perda | Perdido no caminho / dia | MWh/dia (script) | — | `perdaOut.textContent = fb(perda, 0) + " MWh/dia";` |
| i07-voc | Vocação | — | — | `vocOut.textContent = voc;` |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Dimensionador · MW, MWh e o preço da viagem no tempo" — nomeia grandezas, não forma
- **Sem promessa, mas (C6):** Os três ramos de vocação (H < 1; H ≤ 3; H > 3) recortam o plano potência × duração. Vale a mesma figura barata proposta no m02-inst-06 — e os dois instrumentos ganham em serem a mesma figura.
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, previsão nem gabarito para nenhum instrumento (P6). Qualquer regra de arredondamento é da camada Alexandria.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Bateria de 100 MW, 4 horas de duração e 88% de eficiência de ciclo: quanto ela desloca por dia, em MWh, e quanto perde no caminho?
- **Cenário-padrão:** {"i07-mw":100,"i07-h":4,"i07-eff":88}
- **Resposta no cenário-padrão:** 400 MWh/dia deslocados, com 55 MWh/dia perdidos; vocação "Rampa do pôr do sol"

**Avisos.**

- **Nota da fonte:** Nenhuma constante do script traz fonte por valor. A nota do instrumento declara o estatuto dos números em texto (ver nota_instrumento); atribuições nomeadas nela: "nenhuma" P19/P20: tratar como cenário didático; não apresentar como dado oficial.

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","instrument_def":{"id":"m03-inst-07","kind":"dimensionador","title_igual":true,"formula":null,"nota_igual":true,"aula_codigo":"aula-03-09","aula_confere":true},"campos_codigo":[

### m03-inst-08 · Comparador · LCOE por tecnologia — e seus limites

**Identidade.** INST · 08 · {"marcador":"Aula 10","aula_id_codigo":"aula-03-10","pergunta_do_map":{"texto":"Por que a planilha que ordena os custos não é a planilha que decide o despacho?","linha_aprox":1453}} · tipo: comparador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* 

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i08-pills | — | — | pilulas | solar | — | Solar UFV / Eólica NE / Gás CC / Hidro grande / Nuclear |
| i08-fc | Fator de capacidade | % | numero | 27 | 10 – 92 / passo 1 | — |
| i08-wacc | WACC real | % a.a. | numero | 10 | 8 – 14 / passo 0.5 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i08-lcoe | LCOE | R$/MWh (script) | — | `lcoeOut.textContent = "R$ " + fb(lcoe, 0) + "/MWh";` |
| i08-cap | Parcela de capital | R$ (script) | — | `capOut.textContent = "R$ " + fb(lcoeCap, 0) + " (" + fb(lcoeCap / lcoe * 100, 0) + "%)";` |
| i08-om | O&M + variável | R$/MWh (script) | — | `omOut.textContent = "R$ " + fb(lcoeOM, 0) + "/MWh";` |
| i08-pre | Premissas do preset | — | — | `preOut.textContent = p.label;` |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Comparador · LCOE por tecnologia — e seus limites" — "Comparador" e "por tecnologia"
  - a fonte não declara desenho algum; a comparação existe só como preset selecionado um de cada vez
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** Cinco barras, uma por tecnologia, cada uma partida em duas parcelas — capital e O&M mais variável — na mesma escala; a tecnologia selecionada destacada e as outras quatro presentes ao mesmo tempo, porque "comparador" que mostra um de cada vez não compara.
- **Eixo x:** as cinco tecnologias do preset (Solar UFV, Eólica NE, Gás CC, Hidro grande, Nuclear)
- **Eixo y:** LCOE em R$/MWh
- **Séries:** parcela de capital · O&M + variável · marca do valor recalculado com o FC e o WACC escolhidos pelo usuário
- **Relação que a figura tem de mostrar:** Onde o combustível é zero, quase todo o custo é capital — 89% na solar do cenário-padrão. É por isso que mover o WACC move a solar e a nuclear muito mais do que move o gás: o eixo do WACC age sobre a parcela de baixo, não sobre a de cima.
- **Derivação:** derivado do código-fonte (objeto PRESETS com capex, fc, om, vr e n por tecnologia; lcoeCap e lcoeOM calculados no script).
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, previsão nem gabarito para nenhum instrumento (P6). Qualquer regra de arredondamento é da camada Alexandria.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Solar UFV com fator de capacidade de 27% e WACC real de 10% a.a.: qual o LCOE, em R$/MWh, e quanto dele é capital?
- **Cenário-padrão:** {"i08-pills":"solar","i08-fc":27,"i08-wacc":10}
- **Resposta no cenário-padrão:** R$ 184/MWh, dos quais R$ 163 (89%) de capital e R$ 21/MWh de O&M mais variável

**Avisos.**

- **Nota da fonte:** Nenhuma constante do script traz fonte por valor. A nota do instrumento declara o estatuto dos números em texto (ver nota_instrumento); atribuições nomeadas nela: "Presets didáticos em ordem de grandeza (CAPEX, O&M, vida útil, custo variável inspirados em EPE / Lazard LCOE+ — vivos)." P19/P20: tratar como cenário didático; não apresentar como dado oficial.
- **Content QA (P20):** A nota declara "Presets didáticos em ordem de grandeza (CAPEX, O&M, vida útil)" (P19/P20).

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","instrument_def":{"id":"m03-inst-08","kind":"comparador","title_igual":true,"formula":null,"nota_igual":true,"aula_codigo":"aula-03-10","aula_confere":true},"campos_codigo":[{"i

### m03-inst-09 · Quebra-cabeça · O encaixe sazonal das fontes

**Identidade.** INST · 09 · {"marcador":"Aula 10","aula_id_codigo":"aula-03-10","pergunta_do_map":{"texto":"Por que a planilha que ordena os custos não é a planilha que decide o despacho?","linha_aprox":1453}} · tipo: quebra-cabeca

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* 

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i09-checks | — | — | chaves_booleanas | — | — | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i09-ratio | Mês mais fraco vs mais forte | % (script) | — | `ratioOut.textContent = active.length ? fb(ratio, 0) + " %" : "—";` |
| i09-vale | Vale do portfólio | — | — | `valeOut.textContent = active.length ? MESES[minM] : "—";` |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Quebra-cabeça · O encaixe sazonal das fontes" — "encaixe sazonal" é um perfil ao longo do ano
  - a fonte desenha: svg#i09-svg, viewBox "0 0 700 250"
- **Desenho na fonte:** svg #i09-svg (0 0 700 250)
- **O que precisa ser desenhado:** O perfil mensal do portfólio montado: as fontes ligadas empilhadas mês a mês, com a linha do total por cima, e os meses de mínimo e de máximo marcados — porque é a razão entre eles que o readout devolve.
- **Eixo x:** os doze meses
- **Eixo y:** geração do portfólio, em índice (soma de w × perfil[m]/100 das fontes ligadas)
- **Séries:** hidro (peso 50) · eólica (peso 15) · solar (peso 12) · biomassa (peso 6) · total do portfólio · marca do vale e do pico
- **Relação que a figura tem de mostrar:** Cada fonte tem um vale em mês diferente: a hidro no inverno, a eólica no verão, a biomassa fora da safra. Ligar uma segunda fonte não aumenta a média — aumenta o mês mais fraco. A figura precisa deixar ver o vale subindo, não a pilha crescendo.
- **Derivação:** literal quanto aos pesos e aos doze valores por fonte (objeto PROF); derivado quanto à empilhagem.
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, previsão nem gabarito para nenhum instrumento (P6). Qualquer regra de arredondamento é da camada Alexandria.

**Previsão (C3).**

- **Útil:** sim. C3 admite aqui também o ato de meta; a previsão numérica funciona porque o estado inicial é declarado (só hidro ligada).
- **Pergunta (camada Alexandria):** Portfólio só com hidro: o mês mais fraco entrega quantos por cento do mês mais forte?
- **Cenário-padrão:** {"i09-checks-hidro":"on","i09-checks-eolica":"off","i09-checks-solar":"off","i09-checks-bio":"off"}
- **Resposta no cenário-padrão:** 32 %, com vale em Ago
- **Ato alternativo:** Meta a alcançar: ligue o menor número de fontes que leve a razão mês fraco/mês forte acima de 50%.

**Avisos.**

- **Nota da fonte:** Nenhuma constante do script traz fonte por valor. A nota do instrumento declara o estatuto dos números em texto (ver nota_instrumento); atribuições nomeadas nela: "Perfis mensais didáticos (índice 100 = média do ano de cada fonte; pesos aproximados de participação na energia), inspirados nas sazonalidades reais ONS/UNICA/ABEEólica." P19/P20: tratar como cenário didático; não apresentar como dado o
- **Content QA (P20):** A nota declara "Perfis mensais didáticos (índice 100 = média do ano de cada fonte)".

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","instrument_def":{"id":"m03-inst-09","kind":"quebra-cabeca","title_igual":true,"formula":null,"nota_igual":true,"aula_codigo":"aula-03-10","aula_confere":true},"campos_codigo":[


## M04

### m04-inst-01 · Simulador · Formador de preço

**Identidade.** Inst · 01 · 01 · tipo: simulador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Monte a fila e veja qual usina fica marginal, qual preço ela forma e quando o limite regulatório passa a mandar mais que a economia. Repare especialmente no que acontece com a hidráulica quando o reservatório cai.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i1-d-n | Demanda do sistema | MW | — | 1000 | 300 – 1600 / passo 25 | — |
| i1-r-n | Disponibilidade renovável | % | — | 100 | 0 – 100 / passo 5 | — |
| i1-h-n | Nível de reservatório | % | — | 100 | 0 – 100 / passo 5 | — |
| i1-g-n | Preço do gás no CVU | R$/MWh | — | 250 | 120 – 600 / passo 10 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i1-p | Preço formado | /MWh (extração) | numerica_formatada | `brl(price)+'<span class="u">/MWh</span>'` |
| i1-m | Usina marginal | — | textual | `marg?marg.n:'—'` |
| i1-def | Déficit | MW (extração) | numerica_formatada | `num(def)+'<span class="u">MW</span>'` |
| i1-lim | Limite aplicado | — | textual | `lim` |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - intro literal: "Monte a fila e veja qual usina fica marginal, qual preço ela forma e quando o limite regulatório passa a mandar mais que a economia"
  - a fonte desenha: div#i1-bars
- **Desenho na fonte:** barras (#i1-bars)
- **O que precisa ser desenhado:** A fila das cinco usinas ordenada por custo, largura proporcional à capacidade disponível, com a parte despachada preenchida, a marginal destacada e — o que o intro promete e as barras sozinhas não entregam — os dois limites regulatórios como linhas horizontais que cortam a pilha.
- **Eixo x:** capacidade acumulada em MW (Solar 200·R, Eólica 300·R, Hidráulica, Gás, Óleo)
- **Eixo y:** custo variável em R$/MWh, com as linhas de piso e de teto regulatório traçadas na mesma escala
- **Séries:** capacidade e despacho por usina · valor da água agua = 30 + (100 − nível)/100 × 320 · piso e teto regulatórios · déficit quando a fila acaba antes da demanda
- **Relação que a figura tem de mostrar:** Enquanto a marginal estiver abaixo do teto, quem manda é a economia da fila. Quando a última usina chamada ultrapassa o teto, o preço para de subir com ela — e é aí que "o limite regulatório passa a mandar mais que a economia", que é a frase do próprio intro. O teto precisa ser uma linha visível, não só um readout de texto.
- **Derivação:** derivado do código-fonte (frota e fórmula do valor da água verbatim, linhas 1404–1409)
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Demanda de 1.000 MW, renováveis 100% disponíveis, reservatório a 100% e gás a R$ 250/MWh no CVU: qual usina fica marginal e qual preço ela forma?
- **Cenário-padrão:** {"i1-d":1000,"i1-r":100,"i1-h":100,"i1-g":250}
- **Resposta no cenário-padrão:** Gás, R$ 250/MWh; déficit 0 MW; limite aplicado: nenhum

**Avisos.**

- **Nota da fonte:** Limites PLD_MIN/PLD_MAX_H/PLD_MAX_E: comentário do script "limites regulatórios vigentes 2026 — ANEEL Despacho 3.850/2025" (L1337), confirmado em §Ref item 1. Demais parâmetros (frota, curvas, lances, preços de camada, sazonalidades) sem fonte externa declarada; a própria nota diz "Didático/ilustrativo — não usar para dimensionamento real". Na interface: cenário didático, fonte externa não declara
- **Procedência declarada:** Os limites PLD_MIN / PLD_MAX_H / PLD_MAX_E têm procedência declarada no próprio script (comentário na L1337) e no §Ref item 1. É a única procedência externa declarada do M04 — os demais parâmetros são "Didático/ilustrativo".
- **Divergência (P5/P8):** O ramo "teto horário" é inalcançável em 1.145.277 combinações varridas. Portar o ramo, não o fingir alcançável.

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","status_nota":"Cálculo e veredito portados fielmente (harness: 8100 combinações, 0 vereditos divergentes); a divergência é de contrato/apresentação, listada abaixo.","instrument

### m04-inst-02 · Simulador · PLD ao longo do ano

**Identidade.** Inst · 02 · 02 · tipo: simulador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Defina o cenário hidrológico e acompanhe a trajetória do preço mês a mês, com o período seco marcado. Repare em que momento a curva cruza o teto estrutural — e quanto custa, no mês crítico, um megawatt médio descoberto.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i2-e-n | ENA — afluência | % da MLT | — | 100 | 40 – 140 / passo 2 | — |
| i2-a-n | EAR inicial em janeiro | % | — | 60 | 10 – 95 / passo 1 | — |
| i2-c-n | Variação da carga | % | — | 0 | -5 – 10 / passo 1 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i2-p | PLD médio do ano | /MWh (extração) | numerica_formatada | `brl(med)+'<span class="u">/MWh</span>'` |
| i2-mes | Mês crítico | — | textual | `MES[mxi]` |
| i2-max | Pico do ano | /MWh (extração) | numerica_formatada | `brl(mx)+'<span class="u">/MWh</span>'` |
| i2-x | 1 MW médio descoberto | R$ mil (script) | numerica_formatada | `mi(mx*730)` |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Simulador · PLD ao longo do ano" — "ao longo do ano"
  - intro: "acompanhe a trajetória do preço mês a mês, com o período seco marcado"
  - a fonte desenha: svg#i2-svg, aria-label "Trajetória mensal estimada do PLD"
- **Desenho na fonte:** svg #i2-svg, com legenda literal: "PLD mensal estimado", "Teto estrutural R$ 785,27", "Piso R$ 57,31", "Período seco"
- **O que precisa ser desenhado:** A trajetória mensal do preço com as duas linhas de limite traçadas e a faixa do período seco sombreada — exatamente os quatro itens que a legenda da fonte nomeia.
- **Eixo x:** os doze meses (array SEAS de sazonalidade)
- **Eixo y:** R$/MWh, com a linha do piso e a do teto estrutural em escala
- **Séries:** PLD mensal estimado · Teto estrutural R$ 785,27 · Piso R$ 57,31 · faixa do Período seco
- **Relação que a figura tem de mostrar:** O preço só cruza o teto quando a pressão hidrológica acumulada empurra a curva para cima nos meses secos. A figura tem de deixar ver em que mês a curva encosta no teto — que é a pergunta que o intro faz.
- **Derivação:** literal (os quatro itens da legenda, com valores, são texto da fonte)
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** ENA na média (100% da MLT), EAR de 60% em janeiro e carga sem variação: qual o PLD médio do ano e em que mês fica o pico?
- **Cenário-padrão:** {"i2-e":100,"i2-a":60,"i2-c":0}
- **Resposta no cenário-padrão:** PLD médio de R$ 106/MWh; pico em Set, a R$ 158/MWh; 1 MW médio descoberto custa R$ 115 mil no mês crítico

**Avisos.**

- **Nota da fonte:** Limites PLD_MIN/PLD_MAX_H/PLD_MAX_E: comentário do script "limites regulatórios vigentes 2026 — ANEEL Despacho 3.850/2025" (L1337), confirmado em §Ref item 1. Demais parâmetros (frota, curvas, lances, preços de camada, sazonalidades) sem fonte externa declarada; a própria nota diz "Didático/ilustrativo — não usar para dimensionamento real". Na interface: cenário didático, fonte externa não declara

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","status_nota":"Cálculo e veredito portados fielmente (harness: 1000 combinações, 0 vereditos divergentes); a divergência é de contrato/apresentação, listada abaixo.","instrument

### m04-inst-03 · Simulador · O dinheiro que falta

**Identidade.** Inst · 03 · 03 · tipo: simulador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Uma usina de ponta tenta se pagar só vendendo energia. Ajuste quantas horas ela roda, quanto ganha por MWh quando roda e quanto custa mantê-la disponível — e veja o buraco aparecer, medido em reais por kW-ano.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i3-p-n | Potência do ativo | MW | — | 200 | 10 – 500 / passo 10 | — |
| i3-h-n | Horas de despacho por ano | h | — | 200 | 10 – 3000 / passo 10 | — |
| i3-m-n | Margem líquida quando gera | R$/MWh | — | 400 | 20 – 1400 / passo 10 | — |
| i3-f-n | Custo fixo de disponibilidade | R$/kW-ano | — | 300 | 80 – 700 / passo 10 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i3-r | Receita de energia | R$ mi (script) | numerica_formatada | `mi(rec)` |
| i3-c | Custo fixo anual | R$ mi (script) | numerica_formatada | `mi(cst)` |
| i3-g | Dinheiro que falta | R$ mi (script) | numerica_formatada | `gap>0?mi(gap):'zero'` |
| i3-k | Preço de capacidade necessário | R$/kW (script) | numerica_formatada | `gap>0?('R$ '+num(need)+'/kW-ano'):'não precisa'` |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Simulador · O dinheiro que falta" — o que falta é uma diferença entre duas grandezas
  - intro: "veja o buraco aparecer, medido em reais por kW-ano"
  - a fonte desenha: div#i3-bars
- **Desenho na fonte:** barras (#i3-bars)
- **O que precisa ser desenhado:** Duas colunas na mesma escala — receita de energia e custo fixo anual — com a diferença entre os topos marcada e rotulada como o buraco; ao lado, a altura que o preço de capacidade necessário acrescentaria à coluna da receita até igualar a do custo.
- **Eixo x:** as duas parcelas (receita de energia; custo fixo anual) e a parcela que falta
- **Eixo y:** R$ por ano, escala única
- **Séries:** receita = P × h × margem · custo fixo = P × 1000 × F · gap = custo − receita · preço de capacidade necessário = gap / (P × 1000)
- **Relação que a figura tem de mostrar:** O buraco não some ao aumentar a margem por MWh: ele some ao aumentar as horas de despacho — e um ativo de ponta existe justamente para rodar poucas horas. A figura tem de deixar ver que as duas colunas se movem por eixos diferentes.
- **Derivação:** derivado do código-fonte (rec, cst, gap e need verbatim, linhas 1511–1512)
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Usina de ponta de 200 MW que roda 200 horas por ano, com margem líquida de R$ 400/MWh quando gera e custo fixo de disponibilidade de R$ 300/kW-ano: quanto dinheiro falta por ano?
- **Cenário-padrão:** {"i3-p":200,"i3-h":200,"i3-m":400,"i3-f":300}
- **Resposta no cenário-padrão:** Faltam R$ 44 mi (receita R$ 16 mi contra custo fixo R$ 60 mi); seriam necessários R$ 220/kW-ano de receita de disponibilidade

**Avisos.**

- **Nota da fonte:** Demais parâmetros (frota, curvas, lances, preços de camada, sazonalidades) sem fonte externa declarada; a própria nota diz "Didático/ilustrativo — não usar para dimensionamento real". Na interface: cenário didático, fonte externa não declarada (P19).

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","status_nota":"Cálculo e veredito portados fielmente (harness: 10000 combinações, 0 vereditos divergentes); a divergência é de contrato/apresentação, listada abaixo.","instrumen

### m04-inst-04 · Simulador · Sala do leilão reverso

**Identidade.** Inst · 04 · 04 · tipo: simulador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Seis propostas na mesa. Ajuste quanto o comprador quer contratar e onde fica o teto do edital — e observe o preço de corte se separar do preço médio, e o teto começar a barrar oferta.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i4-d-n | Quantidade demandada | MW | — | 1000 | 0 – 2100 / passo 50 | — |
| i4-t-n | Preço-teto do edital | R$/MWh | — | 300 | 150 – 400 / passo 5 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i4-q | Contratado | MW (extração) | numerica_formatada | `num(somaMW)+'<span class="u">MW</span>'` |
| i4-c | Preço de corte | /MWh (extração) | numerica_formatada | `somaMW>0?(brl(corte)+'<span class="u">/MWh</span>'):'—'` |
| i4-m | Preço médio por lance | /MWh (extração) | numerica_formatada | `somaMW>0?(brl2(med)+'<span class="u">/MWh</span>'):'—'` |
| i4-f | Demanda não atendida | MW (extração) | numerica_formatada | `num(falta)+'<span class="u">MW</span>'` |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Simulador · Sala do leilão reverso"
  - intro: "observe o preço de corte se separar do preço médio, e o teto começar a barrar oferta"
  - a fonte desenha: div#i4-bars
- **Desenho na fonte:** barras (#i4-bars)
- **O que precisa ser desenhado:** A curva de oferta em escada: os seis lances ordenados por preço crescente, cada degrau com a largura do volume ofertado e a altura do preço pedido; uma vertical na quantidade demandada — onde ela cruza a escada é o preço de corte; uma horizontal no teto do edital, que apaga os degraus acima dela; e uma tracejada no preço médio ponderado por lance.
- **Eixo x:** MW acumulados de oferta (Solar A 500, Eólica B 400, Hidro C 150, Gás D 600, Biomassa E 120, Térmica F 300)
- **Eixo y:** R$/MWh (170, 195, 230, 265, 280, 340 nos lances)
- **Séries:** escada de oferta · vertical da quantidade demandada · horizontal do preço-teto · tracejada do preço médio por lance · demanda não atendida
- **Relação que a figura tem de mostrar:** Preço de corte e preço médio são alturas diferentes da mesma escada: o corte é a altura do degrau que fecha a demanda, o médio é a média ponderada dos degraus abaixo dele. Baixar o teto não abaixa o corte — corta degraus e pode deixar demanda sem atendimento. As duas afirmações do intro só se leem numa escada.
- **Derivação:** literal quanto aos seis lances (array BIDS com nome, MW e preço); derivado quanto à forma de escada
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Comprador quer 1.000 MW e o edital tem preço-teto de R$ 300/MWh. Qual o preço de corte e qual o preço médio por lance?
- **Cenário-padrão:** {"i4-d":1000,"i4-t":300}
- **Resposta no cenário-padrão:** Corte R$ 230/MWh; médio R$ 186,00/MWh; 1.000 MW contratados e 0 MW de demanda não atendida

**Avisos.**

- **Nota da fonte:** Demais parâmetros (frota, curvas, lances, preços de camada, sazonalidades) sem fonte externa declarada; a própria nota diz "Didático/ilustrativo — não usar para dimensionamento real". Na interface: cenário didático, fonte externa não declarada (P19).

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","status_nota":"Cálculo e veredito portados fielmente (harness: 100 combinações, 0 vereditos divergentes); a divergência é de contrato/apresentação, listada abaixo.","instrument_

### m04-inst-05 · Simulador · Contrato × spot ao longo de 12 meses

**Identidade.** Inst · 05 · 05 · tipo: simulador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Uma indústria com consumo de 10.000 MWh/mês decide quanto contratar. O gráfico mostra o custo mês a mês: a parcela travada não se move, a parcela exposta acompanha o PLD. Repare no que o contrato faz com a média e no que ele faz com a amplitude — são efeitos diferentes e é o segundo que costuma decidir.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i5-c-n | Parcela contratada em PPA | % | — | 70 | 0 – 100 / passo 5 | — |
| i5-p-n | Preço do PPA | R$/MWh | — | 355 | 180 – 500 / passo 5 | — |
| i5-l-n | PLD médio do cenário | R$/MWh | — | 250 | 57 – 800 / passo 1 | — |
| i5-s-n | Amplitude mensal do PLD | ± R$/MWh | — | 120 | 0 – 350 / passo 10 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i5-a | Custo médio | R$ mi (script) | numerica_formatada | `mi(med)` |
| i5-lo | Mês mais barato | — | textual | `MES[mni]+' · '+mi(mn)` |
| i5-w | Mês mais caro | — | textual | `MES[mxi]+' · '+mi(mx)` |
| i5-r | Amplitude anual | R$ mil (script) | numerica_formatada | `mi(mx-mn)` |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Simulador · Contrato × spot ao longo de 12 meses"
  - intro: "O gráfico mostra o custo mês a mês: a parcela travada não se move, a parcela exposta acompanha o PLD"
  - a fonte desenha: svg#i5-svg, aria-label "Custo mensal com parcela contratada e parcela exposta"
- **Desenho na fonte:** svg #i5-svg, com legenda literal: "Parcela contratada (fixa)", "Parcela exposta ao PLD", "Custo médio"
- **O que precisa ser desenhado:** Doze colunas empilhadas: a base fixa, idêntica em todos os meses, e a parcela exposta variando por cima; a linha do custo médio atravessando as doze. A distância entre a coluna mais alta e a mais baixa é a amplitude.
- **Eixo x:** os doze meses (array WAVE de sazonalidade)
- **Eixo y:** custo mensal em R$, com a linha do custo médio
- **Séries:** Parcela contratada (fixa) · Parcela exposta ao PLD · Custo médio
- **Relação que a figura tem de mostrar:** O contrato mexe pouco na média e muito na dispersão. A figura precisa deixar ver que a base fixa é literalmente plana e que toda a variação está na faixa de cima — é o segundo efeito, diz o intro, que costuma decidir.
- **Derivação:** literal quanto à legenda; derivado quanto à empilhagem (fix = C×P×CONS e pld = clamp(L + S·WAVE[i]), linhas 1591–1594)
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Indústria com 10.000 MWh/mês contrata 70% em PPA a R$ 355/MWh, com PLD médio de R$ 250/MWh e amplitude mensal de ±R$ 120/MWh: qual a amplitude anual do custo, em reais?
- **Cenário-padrão:** {"i5-c":70,"i5-p":355,"i5-l":250,"i5-s":120}
- **Resposta no cenário-padrão:** R$ 720 mil (custo médio R$ 3,25 mi; mês mais barato Fev, R$ 2,87 mi; mês mais caro Ago, R$ 3,6 mi)

**Avisos.**

- **Nota da fonte:** Limites PLD_MIN/PLD_MAX_H/PLD_MAX_E: comentário do script "limites regulatórios vigentes 2026 — ANEEL Despacho 3.850/2025" (L1337), confirmado em §Ref item 1. Demais parâmetros (frota, curvas, lances, preços de camada, sazonalidades) sem fonte externa declarada; a própria nota diz "Didático/ilustrativo — não usar para dimensionamento real". Na interface: cenário didático, fonte externa não declara

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","status_nota":"Cálculo e veredito portados fielmente (harness: 10000 combinações, 0 vereditos divergentes); a divergência é de contrato/apresentação, listada abaixo.","instrumen

### m04-inst-06 · Mesa de hedge · swap simples

**Identidade.** Inst · 06 · 06 · tipo: simulador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Consumo fixo de 10.000 MWh/mês. Você trava um preço fixo para parte dele. Mexa no volume travado — e repare no que acontece quando ele passa do consumo.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i6-f-n | Preço fixo do swap | R$/MWh | — | 300 | 150 – 600 / passo 5 | — |
| i6-p-n | PLD realizado no mês | R$/MWh | — | 250 | 57 – 1611 / passo 1 | — |
| i6-v-n | Volume travado | MWh | — | 8000 | 0 – 16000 / passo 500 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i6-r | Resultado do swap | R$ mil (script) | numerica_formatada | `(pay>=0?'+ ':'− ')+mi(Math.abs(pay))` |
| i6-a | Custo sem hedge | R$ mi (script) | numerica_formatada | `mi(semH)` |
| i6-b | Custo com hedge | R$ mi (script) | numerica_formatada | `mi(comH)` |
| i6-u | Custo efetivo | /MWh (extração) | numerica_formatada | `brl2(efe)+'<span class="u">/MWh</span>'` |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Mesa de hedge · swap simples" — nomeia o instrumento financeiro, não uma forma
  - a fonte não declara desenho: visual.barras e visual.svg são ambos nulos
- **Sem promessa, mas (C6):** O resultado do swap é uma reta: pay = (PLD − F) × V. Desenhar essa reta contra o PLD realizado, com o zero no preço travado e o custo efetivo por cima, mostraria de uma vez o que o intro pede ("repare no que acontece quando ele passa do consumo"): acima do consumo, a inclinação inverte de sinal e o hedge vira posição. É C6 e é barato.
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Consumo de 10.000 MWh/mês, swap de 8.000 MWh travado a R$ 300/MWh e PLD realizado de R$ 250/MWh: qual o custo efetivo, em R$/MWh?
- **Cenário-padrão:** {"i6-f":300,"i6-p":250,"i6-v":8000}
- **Resposta no cenário-padrão:** R$ 290,00/MWh (resultado do swap −R$ 400 mil; sem hedge R$ 2,5 mi; com hedge R$ 2,9 mi)

**Avisos.**

- **Nota da fonte:** Demais parâmetros (frota, curvas, lances, preços de camada, sazonalidades) sem fonte externa declarada; a própria nota diz "Didático/ilustrativo — não usar para dimensionamento real". Na interface: cenário didático, fonte externa não declarada (P19).

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","status_nota":"Cálculo e veredito portados fielmente (harness: 900 combinações, 0 vereditos divergentes); a divergência é de contrato/apresentação, listada abaixo.","instrument_

### m04-inst-07 · Simulador · Portfólio em camadas

**Identidade.** Inst · 07 · 07 · tipo: simulador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Distribua o consumo de 10.000 MWh/mês entre as camadas. O que sobrar fica exposto ao PLD. Aplique um choque de preço no segundo semestre e observe o custo mensal — e o que acontece se a soma das camadas passar de 100%.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i7-a-n | Base longa · R$ 330/MWh | % | — | 50 | 0 – 120 / passo 5 | — |
| i7-b-n | Camada média · R$ 348/MWh | % | — | 25 | 0 – 120 / passo 5 | — |
| i7-c-n | Camada curta · R$ 366/MWh | % | — | 15 | 0 – 120 / passo 5 | — |
| i7-s-n | Choque de PLD no 2º semestre | intensidade | — | 0 | 0 – 100 / passo 5 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i7-e | Exposição residual | % (extração) | numerica_formatada | `(over>0?('−'+num(over)):num(resid))+'<span class="u">%</span>'` |
| i7-m | Custo médio anual | R$ mi (script) | numerica_formatada | `mi(med)` |
| i7-w | Pior mês | — | textual | `MES[mxi]+' · '+mi(mx)` |
| i7-r | Amplitude do ano | R$ mil (script) | numerica_formatada | `mi(mx-mn)` |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Simulador · Portfólio em camadas" — "camadas"
  - intro: "observe o custo mensal — e o que acontece se a soma das camadas passar de 100%"
  - a fonte desenha: svg#i7-svg, aria-label "Custo mensal por camada de contratação"
- **Desenho na fonte:** svg #i7-svg, com legenda literal: "Base longa", "Média", "Curta", "Exposição ao PLD", "Sobra revendida (crédito)"
- **O que precisa ser desenhado:** Doze colunas empilhadas pelas quatro camadas que a legenda nomeia, com a quinta série — a sobra revendida — descendo abaixo da linha do zero como crédito, porque é assim que a sobrecontratação aparece.
- **Eixo x:** os doze meses (SEAS de sazonalidade e RAMP do choque no 2º semestre)
- **Eixo y:** custo mensal em R$; o zero precisa estar no eixo porque a sobra revendida é negativa
- **Séries:** Base longa (R$ 330/MWh) · Média (R$ 348/MWh) · Curta (R$ 366/MWh) · Exposição ao PLD · Sobra revendida (crédito)
- **Relação que a figura tem de mostrar:** A exposição residual é a única camada que muda de altura mês a mês; as três contratadas são retângulos planos. Passar de 100% não elimina a variação — inverte o sinal dela, e a sobra revendida passa a ser uma exposição de venda. A figura tem de deixar ver isso cruzando o zero.
- **Derivação:** literal quanto à legenda e aos três preços de camada; derivado quanto à empilhagem
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Consumo de 10.000 MWh/mês distribuído em 50% base longa, 25% camada média e 15% camada curta, sem choque de PLD: qual a exposição residual e qual a amplitude do ano?
- **Cenário-padrão:** {"i7-a":50,"i7-b":25,"i7-c":15,"i7-s":0}
- **Resposta no cenário-padrão:** Exposição residual de 10%; amplitude anual de R$ 120 mil; custo médio R$ 3,27 mi (pior mês Set, R$ 3,33 mi)

**Avisos.**

- **Nota da fonte:** Limites PLD_MIN/PLD_MAX_H/PLD_MAX_E: comentário do script "limites regulatórios vigentes 2026 — ANEEL Despacho 3.850/2025" (L1337), confirmado em §Ref item 1. Demais parâmetros (frota, curvas, lances, preços de camada, sazonalidades) sem fonte externa declarada; a própria nota diz "Didático/ilustrativo — não usar para dimensionamento real". Na interface: cenário didático, fonte externa não declara

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","status_nota":"Cálculo e veredito portados fielmente (harness: 8100 combinações, 0 vereditos divergentes); a divergência é de contrato/apresentação, listada abaixo.","instrument


## M05

### m05-inst-01 · Simulador · Quando duplicar a rede fica caro

**Identidade.** Inst · 01 · 01 · tipo: instrumento

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Divida um mercado entre operadores concorrentes e observe o que acontece com o custo médio por consumidor. O ponto do instrumento não é o número — é a forma da curva, e a pergunta de quando ela deixa de subir o suficiente para importar.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i1-q | Consumidores no mercado | mil | number + range gêmeo (um campo lógico) | 200 | 5 – 1000 / passo 5 | — |
| i1-f | Custo fixo de uma rede completa | R$ mi | number + range gêmeo (um campo lógico) | 900 | 50 – 3000 / passo 25 | — |
| i1-c | Custo incremental por consumidor | R$/ano | number + range gêmeo (um campo lógico) | 180 | 20 – 1200 / passo 10 | — |
| i1-n | Operadores concorrentes na área | redes | number + range gêmeo (um campo lógico) | 1 | 1 – 6 / passo 1 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i1-cm | Custo médio | R$/ano (script) | — | `$id('i1-cm').innerHTML=brl(cur)+'<span class="u">/ano</span>';` |
| i1-c1 | Com rede única | R$/ano (script) | — | `$id('i1-c1').innerHTML=brl(one)+'<span class="u">/ano</span>';` |
| i1-w | Desperdício | R$/ano (script) | — | `$id('i1-w').innerHTML=(waste<=0.001?'zero':(brl(waste)+'<span class="u">/ano</span>'));` |
| i1-tf | Custo fixo total | R$ mi (script) | — | `$id('i1-tf').textContent=mi(N*f);` |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - intro literal: "O ponto do instrumento não é o número — é a forma da curva, e a pergunta de quando ela deixa de subir o suficiente para importar"
  - a fonte desenha: svg#i1-svg, viewBox "0 0 720 260"
- **Desenho na fonte:** svg #i1-svg, com legenda literal ("Custo médio anual por consumidor", "Configuração escolhida") e rótulos de eixo literais no script: '1 rede','2 redes','3 redes','4 redes','5 redes','6 redes'
- **O que precisa ser desenhado:** A curva do custo médio por consumidor contra o número de operadores concorrentes, de 1 a 6, com o ponto da configuração escolhida destacado sobre ela.
- **Eixo x:** operadores concorrentes na área, com os seis rótulos literais da fonte
- **Eixo y:** custo médio anual por consumidor, em R$/ano — cm(n,q,f,c) = (n·f·CRF + c·q)/q, com CRF = 0,10
- **Séries:** curva do custo médio · marca da configuração escolhida
- **Relação que a figura tem de mostrar:** Só o termo de custo fixo é multiplicado por n; o custo incremental por consumidor não muda. A curva é uma reta em n cuja inclinação é f·CRF/q — quanto maior o mercado, mais rasa ela fica. É a forma, e não o valor, que responde "quando duplicar a rede fica caro".
- **Derivação:** literal quanto à legenda e aos rótulos do eixo x; a fórmula cm() é verbatim da L1464
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte (P6).

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Mercado de 200 mil consumidores, custo fixo de R$ 900 mi por rede completa e R$ 180/ano de custo incremental por consumidor, com um único operador: qual o custo médio por consumidor?
- **Cenário-padrão:** {"i1-q":200,"i1-f":900,"i1-c":180,"i1-n":1}
- **Resposta no cenário-padrão:** R$ 630/ano, igual ao custo com rede única; desperdício zero; custo fixo total R$ 900 mi

**Avisos.**

- **Nota da fonte:** A fonte não cita origem externa para constantes nem cenário-padrão; o próprio instrumento se declara "Didático/ilustrativo — não usar para dimensionamento real" (disclaimer). Na interface: "cenário didático; fonte externa não declarada" (P19).

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","id_codigo":"m05-inst-01","kind_codigo":"simulador","titulo_igual":true,"formula_codigo":null,"nota_igual_disclaimer":true,"campos_divergentes":[{"campo":"i1-n","diferencas":["i

### m05-inst-02 · Simulador · Grau de separação

**Identidade.** Inst · 02 · 02 · tipo: instrumento

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Escolha o grau de unbundling e o quanto o desenho depende de coordenação entre segmentos. O instrumento decompõe o resultado em duas parcelas que se movem em direções opostas — conflito residual e custo de coordenação — e mostra onde a soma das duas é menor.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i2-g | Grau de separação | 1 contábil → 4 societária | number + range gêmeo (um campo lógico) | 3 | 1 – 4 / passo 1 | — |
| i2-c | Dependência de coordenação | índice | number + range gêmeo (um campo lógico) | 50 | 0 – 100 / passo 5 | — |
| i2-f | Qualidade da fiscalização de acesso | índice | number + range gêmeo (um campo lógico) | 55 | 0 – 100 / passo 5 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i2-r | Conflito residual | — | — | `$id('i2-r').textContent=cur.c.toFixed(0);` |
| i2-k | Custo de coordenação | — | — | `$id('i2-k').textContent=cur.k.toFixed(0);` |
| i2-t | Atrito total | — | — | `$id('i2-t').textContent=cur.t.toFixed(0);` |
| i2-b | Grau de menor atrito | — | — | `$id('i2-b').textContent=NOME[best-1];` |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - intro literal: "decompõe o resultado em duas parcelas que se movem em direções opostas — conflito residual e custo de coordenação"
  - a fonte desenha: svg#i2-svg, viewBox "0 0 720 260"
- **Desenho na fonte:** svg #i2-svg, com legenda literal ("Conflito residual", "Custo de coordenação", "Grau escolhido") e rótulos de eixo literais: 'Contábil','Funcional','Jurídica','Societária'
- **O que precisa ser desenhado:** Duas curvas cruzando-se sobre os quatro graus de separação — uma descendo, outra subindo — e a soma das duas por cima, com o mínimo da soma marcado e o grau escolhido destacado.
- **Eixo x:** os quatro graus, com os rótulos literais Contábil · Funcional · Jurídica · Societária
- **Eixo y:** índice de atrito, sem unidade (a fonte declara "escalas relativas sem unidade")
- **Séries:** Conflito residual, base BC = [100, 68, 40, 12] · Custo de coordenação, base BK = [6, 22, 45, 85] · Atrito total (soma) · marca do Grau escolhido
- **Relação que a figura tem de mostrar:** As duas parcelas se movem em direções opostas, então a soma tem mínimo interior — nem o grau mais fraco nem o mais forte. Só a curva da soma responde à pergunta do instrumento; qualquer uma das duas isolada responde errado.
- **Derivação:** literal quanto à legenda, aos rótulos e às duas bases (L1505–1507)
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte (P6).

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Separação jurídica (grau 3), dependência de coordenação em 50 e qualidade da fiscalização de acesso em 55: qual o atrito total, e qual o grau de menor atrito?
- **Cenário-padrão:** {"i2-g":3,"i2-c":50,"i2-f":55}
- **Resposta no cenário-padrão:** Atrito total 63 (conflito residual 32, custo de coordenação 30); grau de menor atrito: Jurídica

**Avisos.**

- **Nota da fonte:** A fonte não cita origem externa para constantes nem cenário-padrão; o próprio instrumento se declara "Didático/ilustrativo — não usar para dimensionamento real" (disclaimer). Na interface: "cenário didático; fonte externa não declarada" (P19).

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","id_codigo":"m05-inst-02","kind_codigo":"simulador","titulo_igual":true,"formula_codigo":null,"nota_igual_disclaimer":true,"campos_divergentes":[],"saidas_codigo":["i2-r","i2-k"

### m05-inst-03 · Simulador · Composição de contratação

**Identidade.** Inst · 03 · 03 · tipo: instrumento

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Distribua o volume de um consumidor entre contratação de longo prazo, contratação de curto prazo e exposição descoberta. Observe o que muda no custo esperado e, principalmente, o que muda na largura da faixa de resultados possíveis — que é onde mora o risco.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i3-l | Contrato longo | % do volume | number + range gêmeo (um campo lógico) | 60 | 0 – 100 / passo 5 | — |
| i3-c | Contrato curto | % do volume | number + range gêmeo (um campo lógico) | 25 | 0 – 100 / passo 5 | — |
| i3-p | Prêmio do contrato longo | R$/MWh | number + range gêmeo (um campo lógico) | 40 | -60 – 160 / passo 5 | — |
| i3-v | Volatilidade do curto prazo | índice | number + range gêmeo (um campo lógico) | 55 | 0 – 100 / passo 5 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i3-e | Custo esperado | R$/MWh (script) | — | `$id('i3-e').innerHTML=brl2(custo)+'<span class="u">/MWh</span>';` |
| i3-w | Cenário ruim | R$/MWh (script) | — | `$id('i3-w').innerHTML=brl2(ruim)+'<span class="u">/MWh</span>';` |
| i3-a | Amplitude | R$/MWh (script) | — | `$id('i3-a').innerHTML=brl2(amp)+'<span class="u">/MWh</span>';` |
| i3-d | Descoberto | % (script) | — | `$id('i3-d').innerHTML=(over>0?('−'+num(over)):num(D))+'<span class="u">%</span>';` |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte, mas a promessa é de faixa e as barras sozinhas dão altura, não largura de faixa
  - intro literal: "o que muda na largura da faixa de resultados possíveis"
  - a fonte desenha: div#i3-bars
- **Desenho na fonte:** barras (#i3-bars)
- **O que precisa ser desenhado:** Para a composição escolhida, uma barra do custo esperado com um intervalo vertical sobreposto indo do melhor ao pior cenário — a faixa. Ao lado, a mesma faixa para duas ou três composições de referência, para que a largura possa ser comparada, que é o que o intro promete.
- **Eixo x:** a composição escolhida (longo / curto / descoberto) e as composições de comparação
- **Eixo y:** R$/MWh, escala única para todas as faixas
- **Séries:** custo esperado · cenário ruim · amplitude entre os dois · parcela descoberta
- **Relação que a figura tem de mostrar:** Mover volume do descoberto para o longo muda pouco o centro da faixa e muito a largura dela. O instrumento existe para mostrar que contratar não é comprar barato — é estreitar a faixa.
- **Derivação:** derivado do código-fonte (SP = 200, soma, over, D e o cálculo de custo/ruim/amplitude, linhas 1555–1559)
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte (P6).

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** 60% em contrato longo, 25% em contrato curto, prêmio de R$ 40/MWh no longo e volatilidade de curto prazo em 55: qual a amplitude entre o custo esperado e o cenário ruim, em R$/MWh?
- **Cenário-padrão:** {"i3-l":60,"i3-c":25,"i3-p":40,"i3-v":55}
- **Resposta no cenário-padrão:** R$ 184,80/MWh de amplitude (custo esperado R$ 227,50/MWh; cenário ruim R$ 319,90/MWh; 15% descoberto)

**Avisos.**

- **Nota da fonte:** A fonte não cita origem externa para constantes nem cenário-padrão; o próprio instrumento se declara "Didático/ilustrativo — não usar para dimensionamento real" (disclaimer). Na interface: "cenário didático; fonte externa não declarada" (P19).

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","id_codigo":"m05-inst-03","kind_codigo":"simulador","titulo_igual":true,"formula_codigo":null,"nota_igual_disclaimer":true,"campos_divergentes":[],"saidas_codigo":["i3-e","i3-w"

### m05-inst-04 · Termômetro · Risco de captura

**Identidade.** Inst · 04 · 04 · tipo: instrumento

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Marque os sinais presentes num processo decisório concreto — uma revisão tarifária, uma consulta pública, uma mudança de metodologia. O veredito não acusa ninguém: ele indica quanto do resultado é verificável por terceiros e onde a verificação falha.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i4-m | Materialidade da decisão | R$ mi/ano em jogo | number + range gêmeo (um campo lógico) | 120 | 1 – 2000 / passo 1 | — |
| — | Resultado não reproduzível por terceiro | — | — | — | — | — |
| — | Metodologia divulgada depois da decisão | — | — | — | — | — |
| — | Dados de entrada não disponíveis | — | — | — | — | — |
| — | Contribuições sem resposta motivada | — | — | — | — | — |
| — | Tratamento assimétrico entre pares | — | — | — | — | — |
| — | Decisão contraria metodologia publicada | — | — | — | — | — |
| — | Trânsito de quadros sem quarentena efetiva | — | — | — | — | — |
| — | Participação concentrada no próprio setor | — | — | — | — | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i4-n | Sinais marcados | — | — | `$id('i4-n').innerHTML=n+'<span class="u">/8</span>';` |
| i4-o | Índice de opacidade | — | — | `$id('i4-o').innerHTML=op+'<span class="u">/100</span>';` |
| i4-e | Exposição | R$ mi (script) | — | `$id('i4-e').textContent=mmi(expo)+'/ano';` |
| i4-r | Reprodutibilidade | — | — | `$id('i4-r').textContent=repro;` |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Termômetro · Risco de captura" — "termômetro" nomeia uma leitura, não uma forma desenhada
  - a fonte desenha barras (#i4-bars), mas o título não as promete
- **Sem promessa, mas (C6):** Os oito sinais têm pesos diferentes (o array SIG carrega um p por sinal). Uma barra por sinal, ordenada pelo peso, com os marcados preenchidos, deixa ver que o índice de opacidade não é contagem — e essa é a leitura que o veredito faz em palavras.
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte (P6).
- **Por que não pedir:** O instrumento declara explicitamente que "o veredito não acusa ninguém". Veredito dentro/fora seria exatamente o que ele recusa.

**Previsão (C3).**

- **Útil:** não. O ato aqui é de marcação sobre um caso real trazido pelo learner ("um processo decisório concreto — uma revisão tarifária, uma consulta pública"), não de acerto numérico.
- **Ato alternativo (C3):** Condição a encontrar: marque os sinais de um processo que você conheça e identifique o menor conjunto de sinais que já levaria o índice acima da faixa seguinte.

**Avisos.**

- **Nota da fonte:** A fonte não cita origem externa para constantes nem cenário-padrão; o próprio instrumento se declara "Didático/ilustrativo — não usar para dimensionamento real" (disclaimer). Na interface: "cenário didático; fonte externa não declarada" (P19).
- **Nota de extração:** Os oito sinais não têm id no markup; a extração os identifica por posição (sinal-0 … sinal-7).

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","id_codigo":"m05-inst-04","kind_codigo":"quebra-cabeca","titulo_igual":true,"formula_codigo":null,"nota_igual_disclaimer":true,"campos_divergentes":[{"campo":"i4-s0","diferencas

### m05-inst-05 · Simulador · Ciclo de revisão tarifária

**Identidade.** Inst · 05 · 05 · tipo: instrumento

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Monte a Parcela B de uma distribuidora hipotética e acompanhe a trajetória dela ao longo de um ciclo — a revisão no ano zero, seguida dos reajustes anuais corrigidos por índice de preços menos o Fator X. Repare no efeito de um único ponto percentual no custo de capital.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i5-b | Base de remuneração líquida | R$ mi | number + range gêmeo (um campo lógico) | 4000 | 200 – 20000 / passo 100 | — |
| i5-w | WACC regulatório | % real a.a. | number + range gêmeo (um campo lógico) | 7.5 | 3 – 14 / passo 0.1 | — |
| i5-o | OPEX eficiente | R$ mi/ano | number + range gêmeo (um campo lógico) | 620 | 30 – 3000 / passo 10 | — |
| i5-d | Reintegração regulatória | R$ mi/ano | number + range gêmeo (um campo lógico) | 180 | 10 – 1500 / passo 10 | — |
| i5-e | Energia faturada | GWh/ano | number + range gêmeo (um campo lógico) | 14000 | 500 – 60000 / passo 500 | — |
| i5-x | Índice de preços − Fator X | % a.a. | number + range gêmeo (um campo lógico) | 2.5 | -4 – 12 / passo 0.5 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i5-p | Parcela B ano 0 | R$ bi (script) | — | `$id('i5-p').textContent=mmi(pb0);` |
| i5-c | Componente médio | R$/MWh (script) | — | `$id('i5-c').innerHTML=brl2(comp)+'<span class="u">/MWh</span>';` |
| i5-s | Efeito de +1 p.p. no WACC | R$ mi (script) | — | `$id('i5-s').textContent=mmi(sens)+'/ano';` |
| i5-f | Parcela B ano 4 | R$ bi (script) | — | `$id('i5-f').textContent=mmi(anos[4].t);` |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - intro literal: "acompanhe a trajetória dela ao longo de um ciclo — a revisão no ano zero, seguida dos reajustes anuais"
  - a fonte desenha: svg#i5-svg, viewBox "0 0 720 260"
- **Desenho na fonte:** svg #i5-svg, com legenda literal ("OPEX eficiente", "Remuneração do capital", "Reintegração", "Componente médio R$/MWh") e rótulos de eixo literais: 'Revisão','+1 ano','+2 anos','+3 anos','+4 anos'
- **O que precisa ser desenhado:** Cinco colunas empilhadas — uma por ano do ciclo — com as três parcelas da Parcela B, e a linha do componente médio em R$/MWh num eixo próprio por cima.
- **Eixo x:** os cinco anos do ciclo, com os rótulos literais Revisão · +1 ano · +2 anos · +3 anos · +4 anos
- **Eixo y:** R$ mi/ano para as colunas; eixo secundário em R$/MWh para a linha do componente médio
- **Séries:** OPEX eficiente · Remuneração do capital (= base × WACC) · Reintegração · Componente médio R$/MWh
- **Relação que a figura tem de mostrar:** A revisão define a altura de partida; os reajustes só aplicam índice menos Fator X sobre ela. Um ponto a mais de WACC levanta uma única faixa da coluna do ano zero e todo o ciclo sobe junto — é o que o readout "Efeito de +1 p.p. no WACC" mede e o que a figura tem de deixar ver.
- **Derivação:** literal quanto à legenda e aos rótulos de eixo; rem, pb0 e a trajetória são verbatim (L1656–1657)
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte (P6).

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Base de remuneração líquida de R$ 4.000 mi, WACC regulatório de 7,5% real, OPEX eficiente de R$ 620 mi/ano, reintegração de R$ 180 mi/ano e 14.000 GWh faturados: quanto vale a Parcela B no ano 0 e quanto custa um ponto percentual a mais de WACC?
- **Cenário-padrão:** {"i5-b":4000,"i5-w":7.5,"i5-o":620,"i5-d":180,"i5-e":14000,"i5-x":2.5}
- **Resposta no cenário-padrão:** Parcela B ano 0 de R$ 1,1 bi; componente médio R$ 78,57/MWh; +1 p.p. no WACC = R$ 40 mi/ano; Parcela B ano 4 de R$ 1,21 bi

**Avisos.**

- **Nota da fonte:** A fonte não cita origem externa para constantes nem cenário-padrão; o próprio instrumento se declara "Didático/ilustrativo — não usar para dimensionamento real" (disclaimer). Na interface: "cenário didático; fonte externa não declarada" (P19).

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","id_codigo":"m05-inst-05","kind_codigo":"simulador","titulo_igual":true,"formula_codigo":null,"nota_igual_disclaimer":true,"campos_divergentes":[],"saidas_codigo":["i5-p","i5-c"

### m05-inst-06 · Mapa · Posição no desenho de mercado

**Identidade.** Inst · 06 · 06 · tipo: instrumento

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Mova os dois eixos e observe em que quadrante a configuração cai, o que ela compra e onde ela tende a quebrar. Os três pontos de referência são configurações genéricas e anônimas, incluídas apenas para dar escala ao mapa — não representam nenhum sistema identificável.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i6-x | Revelação de custo | 0 oferta → 100 custo declarado | number + range gêmeo (um campo lógico) | 85 | 0 – 100 / passo 5 | — |
| i6-y | Remuneração de capacidade | 0 só energia → 100 formal | number + range gêmeo (um campo lógico) | 45 | 0 – 100 / passo 5 | — |
| i6-h | Peso do recurso armazenável plurianual | % | number + range gêmeo (um campo lógico) | 60 | 0 – 100 / passo 5 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i6-q | Quadrante | — | — | `$id('i6-q').textContent=quad;` |
| i6-co | Coerência com o parque | — | — | `$id('i6-co').innerHTML=coer.toFixed(0)+'<span class="u">/100</span>';` |
| i6-d | Distância do Brasil | — | — | `$id('i6-d').textContent=dist.toFixed(0);` |
| i6-r | Risco dominante | — | — | `$id('i6-r').textContent=risco;` |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Mapa · Posição no desenho de mercado" — "Mapa" e "posição"
  - intro: "Mova os dois eixos e observe em que quadrante a configuração cai"
  - a fonte desenha: svg#i6-svg, viewBox "0 0 720 300"
- **Desenho na fonte:** svg #i6-svg, com legenda literal: "Configuração escolhida", "Referências genéricas A · B · C", "Posição do Brasil"
- **O que precisa ser desenhado:** Um plano de dois eixos dividido em quatro quadrantes nomeados, com o ponto da configuração escolhida, os três pontos de referência anônimos e o ponto do Brasil — e a distância entre a configuração e o Brasil legível como comprimento.
- **Eixo x:** revelação de custo, de 0 (oferta) a 100 (custo declarado)
- **Eixo y:** remuneração de capacidade, de 0 (só energia) a 100
- **Séries:** Configuração escolhida · Referências genéricas A (20,15) · B (25,80) · C (55,50) · Posição do Brasil (85,45) · grade dos quatro quadrantes
- **Relação que a figura tem de mostrar:** Nenhum quadrante é melhor: cada um compra uma coisa e quebra de um jeito. A figura existe para tornar a distância do Brasil a uma configuração proposta uma grandeza medida, não uma impressão — e é essa distância que o readout devolve.
- **Derivação:** literal quanto à legenda e às coordenadas de BR e REF (L1713–1714)
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte (P6).

**Previsão (C3).**

- **Útil:** não. Instrumento de posicionamento, sem resposta numérica que valha comprometer-se antes; C3 manda outro ato.
- **Ato alternativo (C3):** Condição a encontrar: desloque os dois eixos até achar a configuração que zera a distância do Brasil e diga qual risco dominante ela carrega.

**Avisos.**

- **Nota da fonte:** A fonte não cita origem externa para constantes nem cenário-padrão; o próprio instrumento se declara "Didático/ilustrativo — não usar para dimensionamento real" (disclaimer). Na interface: "cenário didático; fonte externa não declarada" (P19).
- **Content QA (P20):** O intro declara que os três pontos de referência "são configurações genéricas e anônimas, incluídas apenas para dar escala ao mapa". Manter o aviso junto (S4).

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","id_codigo":"m05-inst-06","kind_codigo":"simulador","titulo_igual":true,"formula_codigo":null,"nota_igual_disclaimer":true,"campos_divergentes":[],"saidas_codigo":["i6-q","i6-co


## M06

### m06-inst-01 · Linha do tempo · quatorze marcos, de 1879 a 2028

**Identidade.** Inst · 01 · §MAP (fora de aula) · tipo: —

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Clique em qualquer marco — no eixo ou nas etiquetas — para ver o que aconteceu e, principalmente, qual característica do setor de hoje nasceu ali. Percorra na ordem pelo menos uma vez: a sequência é o conteúdo, não a lista.”

**Entradas.** Nenhuma no markup — o instrumento é percorrido, não parametrizado.

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| t1-yr | Cicatriz que ainda opera hoje | — | campo de painel | — |
| t1-ti | Cicatriz que ainda opera hoje | — | campo de painel | — |
| t1-bd | Cicatriz que ainda opera hoje | — | campo de painel | — |
| t1-lg | Cicatriz que ainda opera hoje | — | campo de painel | — |
| — | painel/ficha renderizado (painel) | — | painel | — |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Linha do tempo · quatorze marcos, de 1879 a 2028" — "linha do tempo" e um intervalo de datas
  - intro: "Percorra na ordem pelo menos uma vez: a sequência é o conteúdo, não a lista"
  - a fonte desenha: svg#t1-svg (viewBox "0 0 760 168") mais a fileira div.tl-chips#t1-chips
- **Desenho na fonte:** svg #t1-svg + chips #t1-chips
- **O que precisa ser desenhado:** Um eixo de tempo único de 1879 a 2028 com os catorze marcos posicionados pela data real — não igualmente espaçados — e as quatro eras do array ERA como faixas de fundo contínuas sob o eixo; o marco selecionado destacado e o painel abaixo mostrando ano, título, corpo e a cicatriz.
- **Eixo x:** o tempo, de 1879 a 2028, em escala proporcional
- **Eixo y:** não há grandeza vertical: a altura serve às quatro faixas de era (ERA = marcos 0–2, 2–7, 7–11, 11–13)
- **Séries:** catorze marcos · quatro eras como faixas · posição atual
- **Relação que a figura tem de mostrar:** A distância entre marcos é o conteúdo: décadas sem nada e depois três marcos em cinco anos. Espaçar os catorze igualmente destruiria exatamente a leitura que o intro pede ("a sequência é o conteúdo").
- **Derivação:** literal quanto ao intervalo e à divisão em eras (array ERA, L1641); a exigência de escala proporcional é leitura do intro
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância nem resposta esperada.

**Previsão (C3).**

- **Útil:** não. Instrumento de percurso, sem saída numérica.
- **Ato alternativo (C3):** Percurso ordenado com registro: ao fim dos catorze marcos, nomear a cicatriz que mais aparece nos módulos seguintes.

**Avisos.**

- **Fonte dos números:** {"disc":{"html":"Didático/ilustrativo. As datas dos marcos legais correspondem à norma de origem indicada em §Ref; onde a norma foi editada num ano e a instituição instalada em outro, o painel diz explicitamente os dois. Marcos futuros — os prazos de 2027 e 2028 — são obrigações de cronograma legal, não eventos ocorridos, e dependem de regulamentação complementar.","texto":"Didático/ilustrativo. A

**Estado no código (informativo, não é camada fonte).** {"id_codigo":"m06-inst-01","existe_objeto":true,"existe_calculadora":true,"kind_codigo":"explorador","titulo_codigo":"Linha do tempo · quatorze marcos","titulo_igual":false,"formula_codigo":null,"note

### m06-inst-02 · Simulador · a erosão do custo histórico

**Identidade.** Inst · 02 · Aula 01 · tipo: —

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Uma concessionária investiu, foi remunerada por uma taxa fixa sobre o valor histórico daquele investimento, e agora precisa decidir se expande. Ajuste inflação, tempo e parcela importada do equipamento e observe a cobertura: quanto a receita reconhecida representa do que seria necessário para remunerar o mesmo ativo a ”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i2-h-n | Investimento original reconhecido | índice | number+range | 100 | 20 – 500 / passo 5 | — |
| i2-i-n | Inflação média anual | % a.a. | number+range | 12 | 0 – 40 / passo 1 | — |
| i2-n-n | Anos desde o investimento | anos | number+range | 15 | 1 – 30 / passo 1 | — |
| i2-m-n | Parcela importada do equipamento | % | number+range | 60 | 0 – 100 / passo 5 | — |
| i2-c-n | Câmbio acima da inflação | p.p. a.a. | number+range | 4 | 0 – 15 / passo 1 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i2-cb | Cobertura | % (script) | — | `$id('i2-cb').textContent=pct(cb*100);` |
| i2-rp | Custo de reposição | índice (script) | — | `$id('i2-rp').innerHTML=num(rep,0)+'<span class="u">índice</span>';` |
| i2-pc | Poder de compra da receita | a.a. (script) | — | `$id('i2-pc').innerHTML=num(pc,1)+'<span class="u">a.a. real</span>';` |
| i2-a5 | Anos até cair a 50% | anos (script) | — | `$id('i2-a5').textContent=a5;` |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - intro literal: "observe a cobertura: quanto a receita reconhecida cobre do custo de reposição"
  - a fonte desenha: svg#i2-svg, viewBox "0 0 720 260"
- **Desenho na fonte:** svg #i2-svg, com legenda literal: "Cobertura da receita reconhecida", "Ano escolhido", "Limiar de 50%"
- **O que precisa ser desenhado:** A curva da cobertura ao longo dos anos desde o investimento, com o ano escolhido marcado sobre ela e a linha horizontal do limiar de 50% — que é o que o readout "Anos até cair a 50%" localiza.
- **Eixo x:** anos desde o investimento, 1 a 30 (NMAX = 30)
- **Eixo y:** cobertura da receita reconhecida, em % do custo de reposição
- **Séries:** curva da cobertura · marca do ano escolhido · linha do limiar de 50%
- **Relação que a figura tem de mostrar:** A erosão é composta, não linear: a cobertura despenca cedo e depois se arrasta. A figura tem de deixar ver que o cruzamento dos 50% acontece muito antes do meio do prazo — a intuição linear erra por anos.
- **Derivação:** literal quanto à legenda; a função fator(n,i,m,c) é verbatim (L1699–1701)
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância nem resposta esperada.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Investimento reconhecido em índice 100, inflação média de 12% a.a. por 15 anos, com 60% do equipamento importado e câmbio 4 p.p. acima da inflação: quanto da receita reconhecida cobre o custo de reposição, em %?
- **Cenário-padrão:** {"i2-h-n":100,"i2-i-n":12,"i2-n-n":15,"i2-m-n":60,"i2-c-n":4}
- **Resposta no cenário-padrão:** 12,9 % de cobertura (custo de reposição em índice 775; poder de compra da receita 1,8 a.a. real; 6 anos até cair a 50%)

**Avisos.**

- **Fonte dos números:** {"disc":{"html":"Didático/ilustrativo — não é reconstituição contábil de nenhuma concessionária histórica. O modelo aplica uma taxa de remuneração fixa de 10% ao ano sobre o valor histórico, corrige o custo de reposição pela inflação na parcela nacional e por inflação mais desvalorização na parcela importada, e ignora depreciação, reavaliação de ativos, reinvestimento e a existência de outras rece

**Estado no código (informativo, não é camada fonte).** {"id_codigo":"m06-inst-02","existe_objeto":true,"existe_calculadora":true,"kind_codigo":"simulador","titulo_codigo":"Simulador · a erosão do custo histórico","titulo_igual":true,"formula_codigo":null,

### m06-inst-03 · Simulador · como se forma uma dívida intrassetorial

**Identidade.** Inst · 03 · Aula 02 · tipo: —

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Uma empresa estatal tem obrigação legal de expandir e não controla a própria tarifa. Ajuste o nível da tarifa em relação ao custo do serviço, o peso da dívida externa e a desvalorização cambial, e observe como o déficit anual se divide entre dívida financeira contratada e conta simplesmente não paga — que é a definição”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i3-i-n | Investimento anual exigido | índice | number+range | 100 | 20 – 300 / passo 5 | — |
| i3-t-n | Tarifa em relação ao custo do serviço | % | number+range | 72 | 35 – 130 / passo 1 | — |
| i3-s-n | Participação da dívida externa | % | number+range | 45 | 0 – 90 / passo 5 | — |
| i3-c-n | Câmbio acima da inflação | p.p. a.a. | number+range | 9 | 0 – 30 / passo 1 | — |
| i3-y-n | Anos de regime | anos | number+range | 8 | 3 – 12 / passo 1 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i3-af | Autofinanciamento | % (script) | — | `$id('i3-af').textContent=pct(autofin/I*100,0);` |
| i3-df | Dívida financeira | índice (script) | — | `$id('i3-df').innerHTML=num(df,0)+'<span class="u">índice</span>';` |
| i3-di | Dívida intrassetorial | índice (script) | — | `$id('i3-di').innerHTML=num(di,0)+'<span class="u">índice</span>';` |
| i3-rt | Passivo / investimento anual | × (script) | — | `$id('i3-rt').innerHTML=num((df+di)/I,1)+'<span class="u">× o ano</span>';` |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - intro literal: "observe como o déficit anual se transforma em dívida"
  - a fonte desenha: svg#i3-svg, viewBox "0 0 720 260"
- **Desenho na fonte:** svg #i3-svg, com legenda literal: "Autofinanciamento pela tarifa", "Dívida contratada", "Conta não paga", "Passivo total acumulado"
- **O que precisa ser desenhado:** Ano a ano do regime, uma coluna partida nas três formas de pagar o investimento — o que a tarifa financia, o que vira dívida contratada e o que simplesmente não é pago — com a linha do passivo total acumulado subindo por cima.
- **Eixo x:** anos de regime, 3 a 12
- **Eixo y:** índice (o investimento anual exigido é índice 100 por construção); eixo secundário para o passivo acumulado
- **Séries:** Autofinanciamento pela tarifa · Dívida contratada · Conta não paga · Passivo total acumulado
- **Relação que a figura tem de mostrar:** Tarifa abaixo do custo do serviço não faz o investimento parar: faz a diferença migrar para as outras duas faixas. A figura tem de deixar ver que a soma das três é sempre o mesmo investimento exigido — o que muda é quem paga e quando.
- **Derivação:** literal quanto à legenda; autofin e as parcelas são verbatim (L1757 em diante)
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância nem resposta esperada.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Investimento anual exigido em índice 100, tarifa a 72% do custo do serviço, 45% da dívida em moeda externa, câmbio 9 p.p. acima da inflação, por 8 anos: qual a razão entre o passivo acumulado e o investimento anual?
- **Cenário-padrão:** {"i3-i-n":100,"i3-t-n":72,"i3-s-n":45,"i3-c-n":9,"i3-y-n":8}
- **Resposta no cenário-padrão:** 5,5 × o ano (autofinanciamento 40%; dívida financeira em índice 468; dívida intrassetorial em índice 83)

**Avisos.**

- **Fonte dos números:** {"disc":{"html":"Didático/ilustrativo — não reproduz a contabilidade de nenhuma empresa do período. O modelo supõe que a tarifa financia até 55% do investimento quando cobre integralmente o custo do serviço, que a captação anual de dívida tem teto de 50% do investimento, e que tudo o que excede esses dois limites vira obrigação não honrada dentro do setor. Não trata reinvestimento, receitas não ta

**Estado no código (informativo, não é camada fonte).** {"id_codigo":"m06-inst-03","existe_objeto":true,"existe_calculadora":true,"kind_codigo":"simulador","titulo_codigo":"Simulador · como se forma uma dívida intrassetorial","titulo_igual":true,"formula_c

### m06-inst-04 · Termômetro do racionamento · balanço de energia num período seco

**Identidade.** Inst · 04 · Aula 03 · tipo: —

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Quatro variáveis decidem se um sistema hidrotérmico atravessa um período seco ou entra em racionamento: quanta água estava guardada, quanta chegou, quanta capacidade firme não hidráulica existe para poupar reservatório, e quanto tempo falta até a próxima cheia. Ajuste as quatro e veja qual profundidade de corte de cons”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i4-e-n | Armazenamento inicial | % do máximo | number+range | 32 | 5 – 100 / passo 1 | — |
| i4-a-n | Afluência no período seco | % da média | number+range | 72 | 30 – 140 / passo 1 | — |
| i4-m-n | Margem de capacidade firme não hidráulica | % da carga | number+range | 3 | 0 – 30 / passo 1 | — |
| i4-t-n | Meses até o período úmido | meses | number+range | 7 | 1 – 12 / passo 1 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i4-ct | Corte necessário | % (script) | — | `$id('i4-ct').textContent=pct(r*100,1);` |
| i4-ms | Meses até o limite | meses (script) | — | `$id('i4-ms').textContent=ms;` |
| i4-nf | Nível final sem corte | % (script) | — | `$id('i4-nf').textContent=(fim<0?'esgotado':pct(fim,0));` |
| i4-qm | Queda mensal sem corte | p.p./mês (script) | — | `$id('i4-qm').innerHTML=(d<=0?('+'+num(-d,2)):num(d,2))+'<span class="u">'+(d<=0?'p.p./mês · recompõe':'p.p./mês')+'</span>';` |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Termômetro do racionamento · balanço de energia num período seco"
  - a fonte desenha: svg#i4-svg, viewBox "0 0 720 260"
- **Desenho na fonte:** svg #i4-svg, com legenda literal: "Trajetória sem corte", "Trajetória com o corte calculado", "Limite operacional"
- **O que precisa ser desenhado:** Duas trajetórias de armazenamento partindo do mesmo ponto — uma sem corte e outra com o corte calculado — e a linha horizontal do limite operacional. Onde a primeira cruza o limite é o readout "Meses até o limite"; a segunda existe para mostrar o corte que evita o cruzamento.
- **Eixo x:** meses até o período úmido, 1 a 12
- **Eixo y:** armazenamento em % do máximo, com a linha do limite operacional (FLOOR = 15)
- **Séries:** Trajetória sem corte · Trajetória com o corte calculado · Limite operacional
- **Relação que a figura tem de mostrar:** O corte necessário não é proporcional ao déficit: ele é o que muda a inclinação da queda o suficiente para a trajetória não cruzar o piso antes do período úmido. As duas trajetórias no mesmo par de eixos são a única forma de ler isso.
- **Derivação:** literal quanto à legenda; BASE, FLOOR e RES são verbatim (L1818)
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância nem resposta esperada.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Armazenamento inicial de 32% do máximo, afluência de 72% da média no período seco, margem de capacidade firme não hidráulica de 3% da carga e 7 meses até o período úmido: qual o corte necessário, em %?
- **Cenário-padrão:** {"i4-e-n":32,"i4-a-n":72,"i4-m-n":3,"i4-t-n":7}
- **Resposta no cenário-padrão:** 21,4 % de corte (meses até o limite: 3,9; nível final sem corte: 2%; queda mensal sem corte: 4,33 p.p./mês)

**Avisos.**

- **Fonte dos números:** {"disc":{"html":"Didático/ilustrativo — não é modelo de operação, não substitui estudo energético e não representa nenhum subsistema real. O modelo trata o armazenamento como um único reservatório equivalente, supõe consumo de 11 pontos percentuais de armazenamento por mês em condição média, converte margem firme faltante em consumo adicional de reservatório, adota limite operacional de 15% e exig

**Estado no código (informativo, não é camada fonte).** {"id_codigo":"m06-inst-04","existe_objeto":true,"existe_calculadora":true,"kind_codigo":"simulador","titulo_codigo":"Termômetro do racionamento · balanço de energia num período seco","titulo_igual":tr

### m06-inst-05 · Comparador · três arquiteturas e onde o risco pousa

**Identidade.** Inst · 05 · Aula 04 · tipo: —

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Escolha um dos três regimes históricos e veja como ele responde as seis perguntas da régua. Depois mova o horizonte de contratação obrigatória e observe o trade-off central de todo desenho de expansão: quanto mais longe você obriga a contratar, menor o risco de faltar e maior o risco de sobrar — e sobra também é custo,”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i5-h-n | Horizonte de contratação obrigatória | anos | number+range | 0 | 0 – 6 / passo 1 | — |
| i5-seg | Regime histórico | — | segmentado (botões) | — | — | 1962–1993 · estatal / 1995–2003 · transição / 2004– · híbrido |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i5-rf | Risco de faltar | — | — | `$id('i5-rf').textContent=num(f,0);` |
| i5-rs | Risco de sobrar | — | — | `$id('i5-rs').textContent=num(s,0);` |
| i5-rt | Atrito total | — | — | `$id('i5-rt').textContent=num(t,0);` |
| i5-rb | Horizonte de menor atrito | anos (script) | — | `$id('i5-rb').textContent=best+' ano'+(best===1?'':'s');` |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte para a grade; o trade-off pede curva
  - titulo: "Comparador · três arquiteturas e onde o risco pousa" — "Comparador"
  - intro: "observe o trade-off central de todo desenho de expansão"
  - a fonte desenha: div.gcmp#i5-grid (grade comparativa) e div.bars#i5-bars
- **Desenho na fonte:** grade #i5-grid + barras #i5-bars
- **O que precisa ser desenhado:** Duas coisas: (a) a grade das sete perguntas da régua respondida pelos três regimes lado a lado, com as sete linhas fixas — é a leitura lateral que a fonte já monta; (b) duas curvas contra o horizonte de contratação obrigatória, risco de faltar caindo e risco de sobrar subindo, com a soma por cima e o mínimo marcado.
- **Eixo x:** na grade, os três regimes (1962–1993 · estatal; 1995–2003 · transição; 2004– · híbrido); na curva, o horizonte obrigatório de 0 a 6 anos
- **Eixo y:** na grade, as sete perguntas literais ("Quem é dono", "Quem financia a expansão", "Quem planeja", "Quem opera", "Como o preço é definido", "Quem carrega o risco de expansão", "Modo de falha característico"); na curva, índice de risco sem unidade
- **Séries:** Risco de faltar · Risco de sobrar · Atrito total · marca do horizonte de menor atrito
- **Relação que a figura tem de mostrar:** Quanto mais longe se obriga a contratar, menor o risco de faltar e maior o de sobrar. O mínimo da soma é interior — e o regime escolhido desloca as duas curvas ao mesmo tempo. É o mesmo desenho do m05-inst-02, com outro conteúdo; vale portar a mesma figura duas vezes.
- **Derivação:** literal quanto às sete perguntas (array KEYS, L1890) e aos três rótulos de regime
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância nem resposta esperada.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Regime estatal de 1962–1993, com horizonte de contratação obrigatória em zero: qual o atrito total e qual horizonte minimizaria esse atrito?
- **Cenário-padrão:** {"i5-h-n":0}
- **Resposta no cenário-padrão:** Atrito total 45 (risco de faltar 45; risco de sobrar 0); horizonte de menor atrito: 4 anos

**Avisos.**

- **Fonte dos números:** {"disc":{"html":"Didático/ilustrativo — os índices de risco são escalas relativas sem unidade, construídas para tornar visível o trade-off, e não medições de nenhum sistema real. Regimes históricos são caracterizações de arquitetura, não descrições exaustivas: em todos os três períodos coexistiram arranjos de propriedade e contratação diferentes dos dominantes.","texto":"Didático/ilustrativo — os 
- **Divergência (P5/P8):** O Inst 05 do código só tem o regime 0 — os outros dois não foram portados.

**Estado no código (informativo, não é camada fonte).** {"id_codigo":"m06-inst-05","existe_objeto":true,"existe_calculadora":true,"kind_codigo":"comparador","titulo_codigo":"Comparador · três arquiteturas e onde o risco pousa","titulo_igual":true,"formula_

### m06-inst-06 · Simulador · o efeito de uma liminar num sistema de rateio

**Identidade.** Inst · 06 · Aula 05 · tipo: —

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “A liquidação do mercado de curto prazo distribui exatamente o que arrecada. Ajuste quanto do valor devido está protegido por decisão judicial e observe duas coisas: quanto cada credor deixa de receber no ciclo, e como o padrão se realimenta nos ciclos seguintes quando quem levou o corte busca a mesma proteção.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i6-d-n | Valor a liquidar no ciclo | R$ mi | number+range | 1500 | 200 – 6000 / passo 50 | — |
| i6-p-n | Parcela do devido protegida por liminar | % | number+range | 35 | 0 – 80 / passo 1 | — |
| i6-g-n | Garantias e reservas disponíveis | % do devido | number+range | 8 | 0 – 40 / passo 1 | — |
| i6-n-n | Agentes credores no rateio | agentes | number+range | 120 | 10 – 600 / passo 5 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i6-tx | Taxa de recebimento | % (script) | — | `$id('i6-tx').textContent=pct(tx*100,1);` |
| i6-fa | Falta no ciclo | R$ mi (script) | — | `$id('i6-fa').textContent=mmi(f1);` |
| i6-pm | Perda média por credor | R$ mi (script) | — | `$id('i6-pm').textContent=mmi(perda);` |
| i6-ac | Retido em 3 ciclos | R$ bi (script) | — | `$id('i6-ac').textContent=mmi(acum);` |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - intro literal: "observe duas coisas: quanto cada credor deixa de receber no ciclo, e como o padrão se realimenta"
  - a fonte desenha: div.bars#i6-bars
- **Desenho na fonte:** barras (#i6-bars)
- **O que precisa ser desenhado:** Duas leituras na mesma figura: as barras do ciclo corrente — devido, arrecadado, garantias e falta — e, ao lado, três colunas de ciclos sucessivos mostrando o retido acumulando, porque é a realimentação que o intro promete e uma barra de um ciclo só não mostra.
- **Eixo x:** as parcelas do ciclo e, na segunda leitura, os três ciclos
- **Eixo y:** R$ mi
- **Séries:** valor a liquidar · parcela protegida por liminar · garantias e reservas · falta no ciclo · retido acumulado em 3 ciclos
- **Relação que a figura tem de mostrar:** A liquidação distribui exatamente o que arrecada — então a parcela protegida não some, ela é subtraída de todos os credores proporcionalmente. E, repetida, a falta acumula: o retido em três ciclos é quase o valor de um ciclo inteiro.
- **Derivação:** derivado do código-fonte (tx, f1, perda e acum, linhas 1948–1989)
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância nem resposta esperada.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** R$ 1.500 mi a liquidar no ciclo, 35% do devido protegido por liminar, 8% do devido em garantias e 120 agentes credores: qual a taxa de recebimento?
- **Cenário-padrão:** {"i6-d-n":1500,"i6-p-n":35,"i6-g-n":8,"i6-n-n":120}
- **Resposta no cenário-padrão:** 73,0 % (falta no ciclo R$ 405 mi; perda média por credor R$ 3 mi; retido em 3 ciclos R$ 1,62 bi)

**Avisos.**

- **Fonte dos números:** {"disc":{"html":"Didático/ilustrativo — não reproduz as regras de contabilização, garantia financeira ou tratamento de inadimplência da câmara de comercialização, que são consideravelmente mais detalhadas. O modelo supõe credores homogêneos, rateio proporcional, garantias aplicadas integralmente à falta e realimentação linear: a cada ciclo, a parcela protegida cresce em trinta por cento do corte s

**Estado no código (informativo, não é camada fonte).** {"id_codigo":"m06-inst-06","existe_objeto":true,"existe_calculadora":true,"kind_codigo":"simulador","titulo_codigo":"Simulador · o efeito de uma liminar num sistema de rateio","titulo_igual":true,"for

### m06-inst-07 · Linha da abertura · quando cada consumidor passou a poder escolher

**Identidade.** Inst · 07 · Aula 06 · tipo: —

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “A escada descendente abaixo é a história da elegibilidade ao mercado livre. Escolha um ano, informe a carga da unidade e o grupo tarifário, e veja se aquela unidade poderia migrar — e sob qual norma. Deslize o ano de 1995 até 2028 mantendo a mesma carga: você está vendo o mercado endereçável de qualquer produto de inte”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i7-y-n | Ano | ano | number+range | 2024 | 1995 – 2028 / passo 1 | — |
| i7-k-n | Carga da unidade | kW | number+range | 800 | 5 – 5000 / passo 5 | — |
| i7-seg-g | Grupo tarifário da unidade | — | segmentado (botões) | — | — | Grupo A · média/alta tensão / Grupo B · baixa tensão |
| i7-seg-f | Origem da energia pretendida | — | segmentado (botões) | — | — | Convencional / Fonte incentivada |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i7-st | Situação | — | — | `$id('i7-st').textContent=ok?'Elegível':'Não elegível';` |
| i7-lm | Limiar no ano | kW (script) | — | `$id('i7-lm').innerHTML=(t<0?'—':(t===0?'sem limite':(num(t,0)+'<span class="u">kW</span>')));` |
| i7-nm | Norma habilitante | — | — | `$id('i7-nm').textContent=norma(Yr,grupo,fonte);` |
| i7-el | Elegível a partir de | — | — | `$id('i7-el').textContent=first;` |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - intro literal: "A escada descendente abaixo é a história da elegibilidade ao mercado livre" — a fonte nomeia a forma
  - a fonte desenha: svg#i7-svg, viewBox "0 0 720 260"
- **Desenho na fonte:** svg #i7-svg, com legenda literal: "Carga mínima exigida", "Carga da unidade", "Faixa sem exigência de carga"
- **O que precisa ser desenhado:** A escada descendente do limiar de carga ao longo dos anos — degraus, não curva suave, porque cada degrau é uma norma — com a linha horizontal da carga da unidade atravessando; onde a linha passa acima do degrau, a unidade é elegível. A faixa final sem exigência de carga entra como região sombreada.
- **Eixo x:** ano, de 1995 a 2028 (Y0 = 1995, Y1 = 2028)
- **Eixo y:** carga mínima exigida, em kW, em escala que permita ler os degraus grandes e os pequenos (a escada desce ordens de grandeza)
- **Séries:** Carga mínima exigida (degraus por norma) · Carga da unidade · Faixa sem exigência de carga
- **Relação que a figura tem de mostrar:** O cruzamento entre a linha horizontal da unidade e a escada descendente é literalmente a data em que aquela unidade passou a poder escolher — e é o que o readout "Elegível a partir de" devolve. A figura torna a data uma leitura, não um resultado.
- **Derivação:** literal quanto à legenda e à palavra "escada descendente" (intro); a função thr(year,g,inc) é verbatim (L1998)
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância nem resposta esperada.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Unidade do Grupo A com 800 kW de carga, energia convencional, em 2024: ela é elegível, e a partir de que ano passou a ser?
- **Cenário-padrão:** {"i7-y-n":2024,"i7-k-n":800}
- **Resposta no cenário-padrão:** Elegível; limiar no ano: sem limite; norma habilitante Port. Norm. 50/2022; elegível a partir de 2023

**Avisos.**

- **Fonte dos números:** {"disc":{"html":"Didático/ilustrativo. A escada até 2023 reproduz os limites de carga das Portarias MME nº 514/2018 e nº 465/2019; o patamar sem limite de carga para o Grupo A decorre da Portaria Normativa nº 50/GM/MME de 2022; os degraus de 2027 e 2028 são <strong>prazos legais da Lei nº 15.269/2025</strong>, condicionados a regulamentação — não elegibilidade já vigente. O patamar anterior a 2019
- **Divergência (P5/P8):** O Inst 07 do código não tem os alternadores de grupo e de fonte, e mostra "Elegível" para qualquer unidade de baixa tensão.

**Estado no código (informativo, não é camada fonte).** {"id_codigo":"m06-inst-07","existe_objeto":true,"existe_calculadora":true,"kind_codigo":"simulador","titulo_codigo":"Linha da abertura · quando cada consumidor passou a poder escolher","titulo_igual":

### m06-inst-08 · Mapa trauma → cicatriz regulatória

**Identidade.** Inst · 08 · Aula 06 · tipo: —

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Onze pressões históricas, e a cadeia completa de cada uma: o que ela revelou, o que o país fez em resposta, o que dessa resposta continua operando hoje — e qual risco novo a resposta trouxe junto. Clique em qualquer uma. Percorra as onze na ordem pelo menos uma vez: é este o mapa que você precisa conseguir reconstruir ”

**Entradas.** Nenhuma no markup — o instrumento é percorrido, não parametrizado.

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Mapa trauma → cicatriz regulatória" — a seta está no título
  - intro: "a cadeia completa de cada uma: o que ela revelou, o que o país fez em resposta, o que dessa resposta continua operando hoje — e qual risco novo a resposta trouxe junto"
  - a fonte desenha: div.tr-grid#i8-grid e a cadeia de quatro caixas
- **Desenho na fonte:** grade #i8-grid + cadeia de 4 caixas (#i8-p Problema revelado, #i8-r Resposta institucional, #i8-c Cicatriz que opera hoje, #i8-n Risco novo em troca)
- **O que precisa ser desenhado:** A cadeia de quatro elos ligados por setas, na ordem literal que a fonte dá às caixas, para a pressão selecionada entre as onze — e a quarta caixa nunca vazia, que é o ponto que o veredito afirma.
- **Eixo x:** a cadeia, da esquerda para a direita: Problema revelado → Resposta institucional → Cicatriz que opera hoje → Risco novo em troca
- **Eixo y:** não há grandeza; a leitura é sequencial
- **Séries:** as onze pressões históricas como seleção · os quatro elos da cadeia
- **Relação que a figura tem de mostrar:** Nenhuma resposta institucional do bloco eliminou um risco sem criar outro — é o que o veredito do cenário-padrão diz e é o que a quarta caixa, sempre preenchida, demonstra ao longo das onze.
- **Derivação:** literal (os quatro rótulos de caixa são texto do markup, linhas 1043–1046)
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância nem resposta esperada.

**Previsão (C3).**

- **Útil:** não. Instrumento de percurso qualitativo.
- **Ato alternativo (C3):** Percurso com registro: percorrer as onze e nomear, ao final, o risco novo que ainda não teve resposta.

**Avisos.**

- **Fonte dos números:** {"disc":{"html":"Didático/ilustrativo. A atribuição de causa em história setorial é sempre parcialmente interpretativa: os fatos institucionais — norma, data, criação de órgão — são verificáveis, mas a ligação entre um evento e uma característica atual envolve leitura. Onde há disputa relevante de interpretação, o painel diz. Use como estrutura de raciocínio, não como sentença.","texto":"Didático/

**Estado no código (informativo, não é camada fonte).** {"id_codigo":"m06-inst-08","existe_objeto":true,"existe_calculadora":true,"kind_codigo":"explorador","titulo_codigo":"Mapa trauma → cicatriz regulatória","titulo_igual":true,"formula_codigo":null,"not


## M07

### m07-inst-01 · Mapa institucional · autoridade × dado

**Identidade.** Inst · 01 · modulo · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Alterne entre os dois fluxos e clique em qualquer nó. As setas mudam completamente entre um fluxo e outro — e é isso que o instrumento existe para mostrar. No fluxo de autoridade, a câmara de comercialização é ponta de linha; no fluxo de dado, ela é uma das duas maiores fontes do setor.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i1-seg | Fluxo exibido | — | seletor-3-botoes | aut | — | Autoridade / Dado / Os dois |
| i1-chips | — | — | chips (gerados por script) | cnpe | — | CNPE / MME / ANEEL / EPE / ONS / CCEE / CMSE / Agentes e mercado |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i1-svg | — | — | svg | `draw(): arestas AUT (cor #F59E0B) se flow ∈ {aut, amb}; arestas DAD (cor #06B6D4) se flow ∈ {dad, amb}; rótulos das arestas só quando flow ≠ amb (one=(flow!=='amb')); nós fora do selecionado com opacidade .34` |
| i1-leg | — | — | legenda (LEGS[flow]) | — |
| i1-panel | — | — | ficha (panel(d.k,d.t,d.b,d.r,d.l)) | `pan.innerHTML=panel(d.k,d.t,d.b,d.r,d.l) — o fluxo NÃO altera a ficha (show() ignora flow)` |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Mapa institucional · autoridade × dado" — "Mapa" e dois fluxos
  - intro: "As setas mudam completamente entre um fluxo e outro — e é isso que o instrumento existe para mostrar"
  - a fonte desenha: grafo com nós posicionados (x, y literais) e dois conjuntos de arestas, AUT (#F59E0B) e DAD (#06B6D4)
- **Desenho na fonte:** grafo #i1-svg: 8 nós com coordenadas literais (CNPE 196,48; MME 386,132; ANEEL 300,220; EPE 92,220; …), arestas AUT e DAD com rótulo, legenda LEGS[flow]
- **O que precisa ser desenhado:** Os mesmos oito órgãos nas mesmas posições nos três estados do seletor, com o conjunto de setas trocando: só as de autoridade, só as de dado, ou os dois ao mesmo tempo. Os rótulos das arestas aparecem quando um fluxo só está em exibição e somem no modo "Os dois" (one = flow !== 'amb').
- **Eixo x:** não há eixo de grandeza: as posições dos nós são fixas e literais, e é a fixidez que permite comparar os dois fluxos
- **Eixo y:** idem
- **Séries:** arestas de autoridade · arestas de dado · nó selecionado (opacidade dos demais reduzida) · legenda por fluxo
- **Relação que a figura tem de mostrar:** Os nós não se movem; só as setas mudam. No fluxo de autoridade a câmara de comercialização é ponta de linha; no fluxo de dado ela é origem. A figura só ensina se as duas leituras couberem na mesma geometria — trocar as posições entre os fluxos destruiria o instrumento.
- **Derivação:** literal (coordenadas, cores e a regra one = flow !== 'amb' são verbatim do script)
- **Custo:** G

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** não. Instrumento de mapa e ficha, sem saída numérica.
- **Ato alternativo (C3):** Condição a encontrar: aponte o único órgão cuja posição no fluxo de autoridade é oposta à do fluxo de dado.

**Avisos.**

- **Nota da fonte:** A fonte não cita procedência externa para os valores; o p.disc declara o instrumento "Didático/ilustrativo" (texto em `aviso_didatico`). P19 se aplica por analogia na camada Alexandria.

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","id_codigo":"m07-inst-01","onde":"MODULO_07_INSTRUMENTOS + M07_INST01_ORGAOS/LEGENDAS (alexandria-modulo-07-content.ts); calculadora m07i1M08 (alexandria-instrument-calculators.

### m07-inst-02 · Comparador de instrumentos jurídicos

**Identidade.** Inst · 02 · Política · MME e CNPE · tipo: comparador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Onze instrumentos, do mais forte ao mais operacional. Selecione um e o painel devolve quem emite, o que ele pode e não pode dispor, quanto tempo leva para mudar, onde é publicado e quem pode contestar. Confundir dois instrumentos é o erro que mais custa credibilidade numa conversa técnica — e o segundo campo, "o que el”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i2-grid | — | — | seleção única (tr-chip gerados por script) | 0 | — | Legislativo · Lei ordinária / Executivo · urgência · Medida provisória / Executivo · regulamento · Decreto / Conselho · política · Resolução do conselho de política / Ministério · política · Portaria  |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i2-panel | — | — | painel (panel()) | `p.innerHTML=panel(d.k,d.n,d.b,d.r,d.l)` |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Comparador de instrumentos jurídicos" — "Comparador"
  - intro: "Onze instrumentos, do mais forte ao mais operacional" — a fonte declara uma ordenação
  - a fonte não desenha: a seleção revela uma ficha por vez
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** A régua dos onze instrumentos na ordem declarada pela fonte — do mais forte (lei ordinária) ao mais operacional — como uma escada vertical, e ao lado a leitura lateral: os cinco campos fixos (quem emite, o que pode e não pode dispor, quanto tempo leva para mudar, onde é publicado, quem pode contestar) exibidos ao menos para o instrumento selecionado e os seus dois vizinhos na escada.
- **Eixo x:** os cinco campos fixos, iguais para os onze
- **Eixo y:** a hierarquia declarada, do mais forte ao mais operacional
- **Séries:** os onze instrumentos jurídicos · os cinco campos fixos
- **Relação que a figura tem de mostrar:** Confundir dois instrumentos é o erro que o intro nomeia. A confusão é entre vizinhos na escada — e só a vizinhança desenhada torna a diferença visível: mesmo campo, resposta diferente, uma linha acima.
- **Derivação:** literal quanto aos onze rótulos e aos cinco campos; a forma de escada vem do "do mais forte ao mais operacional" do intro
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Condição a encontrar: qual é o instrumento mais forte que ainda pode ser mudado sem passar pelo Congresso?

**Avisos.**

- **Nota da fonte:** A fonte não cita procedência externa para os valores; o p.disc declara o instrumento "Didático/ilustrativo" (texto em `aviso_didatico`). P19 se aplica por analogia na camada Alexandria.

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","id_codigo":"m07-inst-02","aula_codigo":"aula-07-01","onde":"INSTRUMENTOS_MODULO_07 + MODULO_07_EXPLORADORES (alexandria-modulo-07-content.ts); explorar07() (alexandria-instrume

### m07-inst-03 · Estante da EPE · qual documento responde qual pergunta

**Identidade.** Inst · 03 · Planejamento · EPE · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Escolha a pergunta que você precisa responder. O instrumento devolve qual produto abrir, qual seção ler primeiro, qual é a defasagem típica do dado, qual é o erro clássico de uso e o que não se responde com aquele documento. Sete perguntas cobrem a maioria dos usos reais.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i3-grid | — | — | seleção única (tr-chip gerados por script) | 0 | — | Pergunta 01 · Quanta demanda o país projeta para os próximos dez anos? / Pergunta 02 · Quanto o país consumiu por fonte e por setor no ano passado? / Pergunta 03 · Que futuro de longo prazo o Estado c |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i3-panel | — | — | painel (panel()) | `p.innerHTML=panel(d.k,d.n,d.b,d.r,d.l)` |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Estante da EPE · qual documento responde qual pergunta" — "estante" é metáfora do acervo, não promessa de figura
  - as saídas são um painel de ficha
- **Sem promessa, mas (C6):** A fonte declara, por documento, a defasagem típica do dado. Sete marcas numa régua de defasagem (de dias a anos) tornariam comparável o que hoje se lê um por vez — C6, não C5.
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Condição a encontrar: escolha a pergunta cuja resposta tem a maior defasagem e diga o que ela não responde.

**Avisos.**

- **Nota da fonte:** A fonte não cita procedência externa para os valores; o p.disc declara o instrumento "Didático/ilustrativo" (texto em `aviso_didatico`). P19 se aplica por analogia na camada Alexandria.

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","id_codigo":"m07-inst-03","aula_codigo":"aula-07-02","onde":"INSTRUMENTOS_MODULO_07 + MODULO_07_EXPLORADORES (alexandria-modulo-07-content.ts); explorar07() (alexandria-instrume

### m07-inst-04 · Anatomia de um ato regulatório · rito e janela de influência

**Identidade.** Inst · 04 · Regulação · ANEEL por dentro · tipo: simulador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Ajuste a duração de cada etapa do rito de uma norma e observe dois vereditos: quanto de previsibilidade o processo oferece a quem precisa se preparar, e qual é a janela real de influência — o tempo em que uma contribuição técnica ainda pode alterar o texto. As duas métricas não andam juntas, e é isso que o instrumento ”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i4-a | Tomada de subsídios | dias | range + number (campo lógico único) | 45 | — | — |
| i4-b | Elaboração de minuta e AIR | dias | range + number (campo lógico único) | 120 | — | — |
| i4-c | Consulta pública | dias | range + number (campo lógico único) | 45 | — | — |
| i4-d | Análise das contribuições | dias | range + number (campo lógico único) | 90 | — | — |
| i4-e | Relatoria e deliberação | dias | range + number (campo lógico único) | 60 | — | — |
| i4-f | Vacância até a vigência | dias | range + number (campo lógico único) | 90 | — | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i4-tot | Ciclo total | dias (script) | numero | — |
| i4-jan | Janela de influência | dias (script) | numero | — |
| i4-avi | Aviso prévio efetivo | dias (script) | numero | — |
| i4-reg | Regime | — | texto | — |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Anatomia de um ato regulatório · rito e janela de influência" — "rito" é sequência e "janela" é um trecho dela
  - a fonte desenha: barras de etapa com seis rótulos e seis cores literais
- **Desenho na fonte:** etapas em barras, rótulos literais: Tomada de subsídios (#F59E0B), Minuta e análise de impacto (#06B6D4), Consulta pública, Análise das contribuições, Relatoria e deliberação, Vacância até a vigência
- **O que precisa ser desenhado:** As seis etapas encadeadas numa única barra horizontal de duração acumulada, do dia zero ao fim do ciclo, com as duas etapas que formam a janela de influência — tomada de subsídios e consulta pública — destacadas na mesma barra, para que a janela se leia como fração do todo.
- **Eixo x:** dias acumulados, de 0 ao ciclo total
- **Eixo y:** uma única faixa; a altura não carrega grandeza
- **Séries:** as seis etapas em sequência · realce das duas etapas da janela de influência (jan = a + c) · marca da vacância, que é o aviso prévio efetivo
- **Relação que a figura tem de mostrar:** A janela de influência é a soma de duas etapas separadas por uma terceira em que já não se contribui. Desenhá-las como dois trechos destacados dentro da mesma barra é o que mostra que a janela é curta e descontínua — que é a leitura que o readout "Regime" nomeia.
- **Derivação:** literal quanto aos seis rótulos e cores; tot = a+b+c+d+e+f e jan = a+c são verbatim (L2412–2413)
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Rito com 45 dias de tomada de subsídios, 120 de minuta e AIR, 45 de consulta pública, 90 de análise das contribuições, 60 de relatoria e deliberação e 90 de vacância: quantos dias tem o ciclo total, e quantos deles são janela real de influência?
- **Cenário-padrão:** {"i4-a":45,"i4-b":120,"i4-c":45,"i4-d":90,"i4-e":60,"i4-f":90}
- **Resposta no cenário-padrão:** Ciclo total 450 dias; janela de influência 90 dias; aviso prévio efetivo 90 dias; regime "Aberto com janela estreita"

**Avisos.**

- **Nota da fonte:** A fonte não cita procedência externa para os valores; o p.disc declara o instrumento "Didático/ilustrativo" (texto em `aviso_didatico`). P19 se aplica por analogia na camada Alexandria.
- **Divergência (P5/P8):** A etapa b tem dois nomes na fonte ("Elaboração de minuta e AIR" no campo, "Minuta e análise de impacto" no rótulo da barra). P8: divergência registrada, não resolvida.

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","status_nota":"Cálculo e veredito conferidos contra o original na grade; divergências abaixo são de apresentação (readout textual, barras, classe).","id_codigo":"m07-inst-04","a

### m07-inst-05 · Cadeia temporal da operação · produto, decisão e leitura

**Identidade.** Inst · 05 · Operação · ONS · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Selecione um horizonte e o painel devolve o produto correspondente, o que ele decide, a cadência de publicação, o que se lê primeiro, qual dado sai disso no portal aberto e qual é o erro clássico de interpretação daquele horizonte. Cinco horizontes, do plurianual ao pós-operação.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i5-chips | — | — | seleção única (tl-chip gerados por script) | 0 | — | Plurianual e anual / Mensal / Semanal / Diário / Tempo real e pós-operação |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i5-panel | — | — | painel (panel()) | `p.innerHTML=panel(d.k+' · '+d.n,d.t,d.b,d.r,d.l)` |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Cadeia temporal da operação · produto, decisão e leitura" — "cadeia temporal"
  - a fonte não desenha: chips de horizonte revelam uma ficha por vez
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** Os cinco horizontes como faixas encaixadas sobre um mesmo eixo de tempo, do plurianual ao tempo real, cada faixa com a cadência de publicação marcada como repetição — porque o que distingue os cinco produtos é a razão entre o horizonte que eles olham e a frequência com que são refeitos.
- **Eixo x:** tempo, em escala que comporte de anos a minutos (necessariamente logarítmica ou quebrada, e a quebra precisa estar declarada)
- **Eixo y:** os cinco horizontes, encaixados do mais longo ao mais curto
- **Séries:** Plurianual e anual · Mensal · Semanal · Diário · Tempo real e pós-operação · cadência de publicação de cada um
- **Relação que a figura tem de mostrar:** Cada horizonte decide uma coisa diferente e é refeito numa cadência diferente — e o erro clássico que a fonte registra por horizonte é justamente ler o produto de um horizonte como se decidisse no outro. O encaixe é a figura que torna o erro impossível de cometer distraidamente.
- **Derivação:** literal quanto aos cinco rótulos de horizonte; a forma de encaixe vem de "cadeia temporal" no título
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Condição a encontrar: qual horizonte decide de fato, e qual não decide nada de forma direta e imediata?

**Avisos.**

- **Nota da fonte:** A fonte não cita procedência externa para os valores; o p.disc declara o instrumento "Didático/ilustrativo" (texto em `aviso_didatico`). P19 se aplica por analogia na camada Alexandria.

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","id_codigo":"m07-inst-05","aula_codigo":"aula-07-04","onde":"INSTRUMENTOS_MODULO_07 + MODULO_07_EXPLORADORES (alexandria-modulo-07-content.ts); explorar07() (alexandria-instrume

### m07-inst-06 · Régua do ciclo mensal · contabilização, garantia e liquidação

**Identidade.** Inst · 06 · Liquidação · CCEE · tipo: simulador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Ajuste os prazos de cada etapa do ciclo comercial mensal e observe o efeito sobre duas coisas que decidem a operação financeira de um agente: quanto tempo se passa entre o consumo e o desembolso, e qual é a janela real para contestar um número antes que ele vire obrigação. O terceiro indicador é o de folga: quantos dia”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i6-a | Fechamento da medição | dias após o mês | range + number (campo lógico único) | 8 | — | — |
| i6-b | Apuração e prévia | dias | range + number (campo lógico único) | 12 | — | — |
| i6-c | Janela de contestação | dias | range + number (campo lógico único) | 5 | — | — |
| i6-d | Aporte de garantia | dias | range + number (campo lógico único) | 6 | — | — |
| i6-e | Liquidação financeira | dias | range + number (campo lógico único) | 4 | — | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i6-tot | Consumo → desembolso | dias (script) | numero | — |
| i6-jan | Janela de contestação | dias (script) | numero | — |
| i6-fol | Folga até o aporte | dias (script) | numero | — |
| i6-reg | Regime de caixa | — | texto | — |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Régua do ciclo mensal · contabilização, garantia e liquidação" — "Régua"
  - a fonte desenha: barras de etapa com cinco rótulos e cores literais
- **Desenho na fonte:** etapas em barras, rótulos literais: Fechamento da medição, Apuração e prévia, Janela de contestação, Aporte de garantia, Liquidação financeira
- **O que precisa ser desenhado:** As cinco etapas encadeadas numa régua de dias a partir do fim do mês de consumo, com a janela de contestação destacada como trecho e a folga até o aporte marcada como distância entre dois pontos — os dois números que o instrumento devolve.
- **Eixo x:** dias após o mês de consumo, de 0 ao desembolso
- **Eixo y:** faixa única
- **Séries:** as cinco etapas · janela de contestação (c) · folga até o aporte (c + d) · marca do desembolso
- **Relação que a figura tem de mostrar:** Consumo e desembolso estão separados por mais de um mês, e a única janela em que se pode contestar é curta e cai no meio. A régua torna as duas leituras — prazo de caixa e prazo de defesa — a mesma imagem.
- **Derivação:** literal quanto aos cinco rótulos; tot = a+b+c+d+e, fol = c+d e prev = a+b são verbatim (L2530)
- **Reúso:** Mesma figura do m09-inst-10, que percorre este mesmo ciclo com outra pergunta. Portar uma vez.
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Ciclo com 8 dias de fechamento da medição, 12 de apuração e prévia, 5 de janela de contestação, 6 de aporte de garantia e 4 de liquidação: quantos dias separam o consumo do desembolso?
- **Cenário-padrão:** {"i6-a":8,"i6-b":12,"i6-c":5,"i6-d":6,"i6-e":4}
- **Resposta no cenário-padrão:** 35 dias (janela de contestação 5 dias; folga até o aporte 11 dias; regime "Ciclo padrão")

**Avisos.**

- **Nota da fonte:** A fonte não cita procedência externa para os valores; o p.disc declara o instrumento "Didático/ilustrativo" (texto em `aviso_didatico`). P19 se aplica por analogia na camada Alexandria.

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","status_nota":"Cálculo e veredito conferidos contra o original na grade; divergências abaixo são de apresentação (readout textual, barras, classe).","id_codigo":"m07-inst-06","a

### m07-inst-07 · Escada do travamento · o que parou o projeto e quem destrava

**Identidade.** Inst · 07 · Monitoramento e periferia · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Selecione um sintoma — a forma como o problema costuma ser descrito por quem está dentro do projeto — e o instrumento devolve qual órgão tem competência, qual instrumento resolve, qual é o prazo típico de ordem de grandeza, qual é o erro de endereçamento mais comum e o que fazer em paralelo enquanto se espera. Nove tra”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i7-grid | — | — | seleção única (tr-chip gerados por script) | 0 | — | Sintoma 01 · A obra está pronta e a usina não pode operar comercialmente / Sintoma 02 · O licenciamento ambiental não sai / Sintoma 03 · A conexão à rede não tem prazo definido / Sintoma 04 · A outorg |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i7-panel | — | — | painel (panel()) | `p.innerHTML=panel(d.k,d.n,d.b,d.r,d.l)` |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Escada do travamento · o que parou o projeto e quem destrava" — "Escada"
  - a fonte declara, por sintoma, "o prazo típico de ordem de grandeza"
  - a fonte não desenha: chips revelam uma ficha por vez
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** Os sintomas como degraus de uma escada, ordenados pelo prazo típico que a fonte declara para cada um, com o comprimento do degrau proporcional a esse prazo e o órgão competente rotulado no degrau. O sintoma selecionado destacado; os demais visíveis.
- **Eixo x:** prazo típico de destravamento, em ordem de grandeza declarada pela fonte
- **Eixo y:** os sintomas, ordenados por prazo
- **Séries:** os sintomas de travamento · órgão competente por degrau · instrumento que resolve
- **Relação que a figura tem de mostrar:** Os travamentos não são equivalentes: alguns se resolvem em semanas e outros em ciclos regulatórios inteiros. Quem entra no instrumento pelo sintoma precisa sair sabendo em que degrau caiu — e degrau alto não é degrau difícil, é degrau longo.
- **Derivação:** literal quanto aos rótulos de sintoma e à existência do campo de prazo; a ordenação por prazo é escolha de desenho da camada Alexandria
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Condição a encontrar: entre os sintomas, achar os que o próprio empreendedor pode destravar e os que dependem de terceiro.

**Avisos.**

- **Nota da fonte:** A fonte não cita procedência externa para os valores; o p.disc declara o instrumento "Didático/ilustrativo" (texto em `aviso_didatico`). P19 se aplica por analogia na camada Alexandria.

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","id_codigo":"m07-inst-07","aula_codigo":"aula-07-06","onde":"INSTRUMENTOS_MODULO_07 + MODULO_07_EXPLORADORES (alexandria-modulo-07-content.ts); explorar07() (alexandria-instrume

### m07-inst-08 · Roteador de decisão

**Identidade.** Inst · 08 · Síntese · onde a frase não se sustenta · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “O instrumento central do bloco. Escolha um tipo de decisão do setor e o roteador devolve seis campos: órgão emissor, instrumento jurídico, rito prévio exigido, onde é publicado, cadência típica e quem pode contestar. Use-o como treino ativo: leia o tipo de decisão, responda os seis campos de cabeça, e só então clique. ”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i8-grid | — | — | seleção única (tr-chip gerados por script) | 0 | — | Decisão 01 · Reajuste tarifário anual de distribuidora / Decisão 02 · Revisão tarifária periódica / Decisão 03 · Formação do preço de curto prazo / Decisão 04 · Despacho de térmica fora da ordem de mé |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i8-panel | — | — | painel (panel()) | `p.innerHTML=panel(d.k,d.n,d.b,null,d.l)` |
| i8-out | — | — | seis cartões (cards(d.c)) | `o.innerHTML=cards(d.c)` |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Roteador de decisão" — roteia, não desenha
  - as saídas são um painel e seis cartões fixos
- **Sem promessa, mas (C6):** Os seis campos são os mesmos para todas as decisões: órgão emissor, instrumento jurídico, rito prévio exigido, onde é publicado, cadência típica e quem pode contestar. Como os seis são fixos, uma grade de decisões × campos permitiria a leitura lateral que o intro pede ("use-o como treino") sem figura nova.
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Treino: dada uma decisão, dizer os seis campos antes de abrir o painel. É o uso que o próprio intro descreve.

**Avisos.**

- **Nota da fonte:** A fonte não cita procedência externa para os valores; o p.disc declara o instrumento "Didático/ilustrativo" (texto em `aviso_didatico`). P19 se aplica por analogia na camada Alexandria.

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","id_codigo":"m07-inst-08","aula_codigo":"aula-07-07","onde":"INSTRUMENTOS_MODULO_07 + MODULO_07_EXPLORADORES (alexandria-modulo-07-content.ts); explorar07() (alexandria-instrume

### m07-inst-09 · Localizador de dado

**Identidade.** Inst · 09 · Síntese · onde a frase não se sustenta · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Escolha o dado que você precisa. O instrumento devolve órgão, portal, caminho, granularidade típica, formato, defasagem típica e a armadilha de uso daquele dado específico — o erro que se comete quando se cruza essa série com outra sem declarar a diferença de definição.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i9-grid | — | — | seleção única (tr-chip gerados por script) | 0 | — | Dado 01 · Carga de energia por subsistema / Dado 02 · Geração por fonte, com resolução horária / Dado 03 · Armazenamento dos reservatórios / Dado 04 · Intercâmbio entre subsistemas / Dado 05 · Preço d |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i9-panel | — | — | painel (panel()) | `p.innerHTML=panel(d.k,d.n,d.b,null,d.l)` |
| i9-out | — | — | seis cartões (cards(d.c)) | `o.innerHTML=cards(d.c)` |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Localizador de dado" — localiza, não desenha
  - as saídas são um painel e seis cartões fixos
- **Sem promessa, mas (C6):** A fonte declara a defasagem típica de cada dado. Uma régua de defasagem comum ao m07-inst-03 e a este resolveria os dois com uma figura só.
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Treino: dado o dado que se precisa, dizer órgão, portal e defasagem antes de abrir o painel.

**Avisos.**

- **Nota da fonte:** A fonte não cita procedência externa para os valores; o p.disc declara o instrumento "Didático/ilustrativo" (texto em `aviso_didatico`). P19 se aplica por analogia na camada Alexandria.

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","id_codigo":"m07-inst-09","aula_codigo":"aula-07-07","onde":"INSTRUMENTOS_MODULO_07 + MODULO_07_EXPLORADORES (alexandria-modulo-07-content.ts); explorar07() (alexandria-instrume

### m07-inst-10 · Calendário institucional · o que sai quando e de quem

**Identidade.** Inst · 10 · Síntese · onde a frase não se sustenta · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Selecione um mês e veja o que tipicamente acontece nele — e o que acontece em todo mês, independentemente de qual seja. O painel separa três camadas: os eventos de cadência fixa que se repetem sempre, os eventos de ciclo anual que caem tipicamente naquele período, e o que um analista deveria estar fazendo naquele mês.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i10-cal | — | — | seleção única (12 botões .cal-m) | 0 | — | JAN / FEV / MAR / ABR / MAI / JUN / JUL / AGO / SET / OUT / NOV / DEZ |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i10-panel | — | — | painel | `p.innerHTML=panel('Mês '+(k+1)+' de 12',d.n, <texto fixo>, rows, FIXO, 'Camada fixa'); rows = ['Ciclo anual · '+(x+1), d.a[x]] … + ['O que fazer no mês','<b>'+d.f+'</b>']` |

**Forma prometida (C5).**

- **Promete:** sim — cumprido em parte — a fonte dá a fileira dos doze meses, mas não desenha a separação em camadas que o próprio intro promete
  - titulo: "Calendário institucional · o que sai quando e de quem" — "Calendário"
  - intro: "O painel separa três camadas: os eventos de cadência fixa que se repetem sempre, os eventos de ciclo anual que caem neste período, e o que fazer no mês"
  - a fonte desenha em parte: doze botões .cal-m
- **Desenho na fonte:** fileira de 12 botões .cal-m (#i10-cal); as três camadas só existem no painel de texto
- **O que precisa ser desenhado:** Os doze meses numa faixa horizontal com duas trilhas sobrepostas: uma trilha contínua atravessando os doze, que é a cadência fixa (ela não depende do mês, e desenhá-la como faixa contínua é o que prova isso); e, acima dela, marcas nos meses onde caem os eventos de ciclo anual. O mês selecionado destacado nas duas trilhas.
- **Eixo x:** os doze meses, JAN a DEZ (rótulos literais dos botões)
- **Eixo y:** duas trilhas: camada fixa (contínua) e ciclo anual (pontual)
- **Séries:** camada de cadência fixa · eventos de ciclo anual por mês · ação recomendada do mês
- **Relação que a figura tem de mostrar:** O intro afirma que parte do calendário não depende do mês. Uma faixa contínua sob marcas pontuais é a forma que torna essa afirmação visível — e impede a leitura errada de que tudo no setor tem data.
- **Derivação:** literal quanto aos doze rótulos e à separação em camadas (texto do painel); a forma de duas trilhas é escolha de desenho
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Condição a encontrar: aponte o mês em que mais eventos de ciclo anual coincidem, e diga o que isso exige de quem planeja.

**Avisos.**

- **Nota da fonte:** A fonte não cita procedência externa para os valores; o p.disc declara o instrumento "Didático/ilustrativo" (texto em `aviso_didatico`). P19 se aplica por analogia na camada Alexandria.
- **Content QA (P20):** O painel declara que os eventos de ciclo anual são "padrões observados, não compromisso de calendário". O aviso é parte do bloco (S4).

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","id_codigo":"m07-inst-10","aula_codigo":"aula-07-07","onde":"INSTRUMENTOS_MODULO_07 + MODULO_07_EXPLORADORES[\"10\"]","divergencias":["o corpo portado começa pelo número \"3\" (


## M08

### m08-inst-01 · Mapa físico do Brasil elétrico · geração × escoamento

**Identidade.** Inst · 01 · instrumento de módulo (§MAP) · tipo: —

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Dois fluxos sobre a mesma geografia. No fluxo de geração, os nós dimensionam onde cada fonte está concentrada. No fluxo de escoamento, os mesmos pontos viram origem, corredor ou destino — e os gargalos aparecem. Clique em qualquer nó ou etiqueta para abrir o painel.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i1-seg | Fluxo exibido | — | — | — | — | Geração · onde nasce / Escoamento · por onde sai / Os dois |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| — | painel/ficha renderizado (painel) | — | painel | — |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Mapa físico do Brasil elétrico · geração × escoamento" — "Mapa"
  - intro: "Dois fluxos sobre a mesma geografia"
  - a fonte desenha: svg viewBox "0 0 560 470" com nós posicionados, arestas e gargalos em vermelho
- **Desenho na fonte:** svg 560×470: nós com x, y e raio; arestas curvas (ponto médio deslocado 0,12); cor #EF4444 para gargalo, #F59E0B para o nó selecionado, #06B6D4 para os demais
- **O que precisa ser desenhado:** A mesma geografia nos dois fluxos: no fluxo de geração, o raio dos nós dimensiona a concentração de recurso; no fluxo de escoamento, os mesmos pontos passam a ser origem, corredor ou destino e as arestas aparecem. Os nós marcados como gargalo ficam em vermelho nos dois.
- **Eixo x:** geografia (posições literais no viewBox); não é um eixo de grandeza
- **Eixo y:** idem
- **Séries:** nós de geração dimensionados por recurso · arestas de escoamento · gargalos · nó selecionado
- **Relação que a figura tem de mostrar:** Onde o recurso está e por onde ele sai são duas leituras da mesma figura — e o gargalo é o ponto em que a segunda contradiz a primeira. A legenda da fonte já nomeia as quatro classes: "Corredor de escoamento", "Vizinhança de recurso", "Gargalo estruturante", "Nó selecionado".
- **Derivação:** literal quanto às posições, cores e rótulos de legenda
- **Custo:** G

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Condição a encontrar: localizar o nó que não é ponto de geração e ainda assim aparece nos dois fluxos.

**Avisos.**

- **Nota da fonte:** Sem span.srcnote neste instrumento. O que houver de procedência está só no disclaimer (p.disc).

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","ids":["m08-inst-01"],"problemas":["intro (p.inst-intro) não aparece verbatim na nota do código","disclaimer (p.disc) não aparece verbatim na nota do código"],"comparacao_estati

### m08-inst-02 · Conversor de três eixos · as duas pizzas lado a lado

**Identidade.** Inst · 02 · instrumento de aula · tipo: —

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Digite a capacidade instalada e o fator de capacidade de cada fonte. O instrumento devolve as duas pizzas e marca em dourado toda fonte que trocou de posição entre elas. Os valores iniciais são a fotografia de 2025 declarada abaixo; substitua qualquer um deles e a lição continua funcionando — é essa a razão de o instru”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i2c-hid / i2f-hid | Hidrelétrica | GW · FC % | campos gerados por script | 110.2 / 41.6 | 0 – 400 / passo 0.1 | — |
| i2c-sol / i2f-sol | Solar | GW · FC % | campos gerados por script | 64.8 / 15.5 | 0 – 400 / passo 0.1 | — |
| i2c-eol / i2f-eol | Eólica | GW · FC % | campos gerados por script | 34.7 / 38.3 | 0 – 400 / passo 0.1 | — |
| i2c-bio / i2f-bio | Biomassa | GW · FC % | campos gerados por script | 17.5 / 41.1 | 0 – 400 / passo 0.1 | — |
| i2c-fos / i2f-fos | Térmica fóssil | GW · FC % | campos gerados por script | 31.8 / 27.5 | 0 – 400 / passo 0.1 | — |
| i2c-nuc / i2f-nuc | Nuclear | GW · FC % | campos gerados por script | 2 / 90.4 | 0 – 400 / passo 0.1 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| — | Capacidade total | GW (extração) | — | `f1(tA)` |
| — | Geração implícita | TWh/ano (extração) | — | `f0(tB)` |
| — | Fator de capacidade médio | % (extração) | — | `(tA>0? f1(tB/(tA*8.76)*100):'0,0')` |
| — | Fontes que trocam de posição | — | — | `trocas.length` |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Conversor de três eixos · as duas pizzas lado a lado" — a forma está escrita no título, com o arranjo
  - a fonte desenha: função pieSVG(items, total) renderizando #i2-pieA e #i2-pieB
- **Desenho na fonte:** duas pizzas em svg (#i2-pieA e #i2-pieB), geradas por pieSVG começando em −π/2
- **O que precisa ser desenhado:** Duas pizzas com as mesmas seis fontes e a mesma cor por fonte, uma ordenada por capacidade instalada e outra por geração implícita, na mesma legenda; as fontes que trocam de posição entre uma e outra marcadas em dourado nas duas.
- **Eixo x:** ângulo = participação percentual dentro de cada pizza
- **Eixo y:** não há; a comparação é entre as duas pizzas, que precisam estar lado a lado e nunca alternadas
- **Séries:** pizza A: capacidade instalada por fonte · pizza B: geração implícita = cap × (FC/100) × 8,76 · marca das fontes que trocam de posição · maior subida e maior queda em pontos percentuais
- **Relação que a figura tem de mostrar:** O fator de capacidade é o que transforma uma pizza na outra. Fonte com FC alto ganha fatia da esquerda para a direita; fonte com FC baixo perde. As duas pizzas juntas tornam essa conversão visível sem uma única palavra — é isso que o título chama de "conversor de três eixos".
- **Derivação:** literal (pieSVG, os arrays A e B, a contagem de trocas e o cálculo de pa/pb/d são verbatim do script, linhas 2209–2306)
- **Alerta de porte:** A fonte desenha as duas pizzas. Qualquer porte que entregue só os quatro readouts perde o instrumento inteiro — o título promete o arranjo lado a lado, não os totais.
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** sim. A troca de posição entre as duas pizzas é exatamente o erro de previsão que o instrumento provoca.
- **Pergunta (camada Alexandria):** Com a fotografia inicial de capacidade e fator de capacidade por fonte, quantas fontes trocam de posição entre a pizza de capacidade instalada e a de geração implícita?
- **Cenário-padrão:** null
- **Resposta no cenário-padrão:** 2 fontes (capacidade total 261,0 GW; geração implícita 761 TWh/ano; fator de capacidade médio 33,3 %)

**Avisos.**

- **Fonte dos números:** Referência inicial: capacidade e geração por fonte no conceito amplo do balanço energético, ano-base 2025, publicado em junho de 2026; fatores de capacidade derivados da razão entre as duas séries. Consulta em 1º de agosto de 2026.
- **Procedência declarada:** Referência inicial declarada: capacidade e geração por fonte no conceito amplo do balanço energético.

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","ids":["m08-inst-02"],"problemas":["campo formula do código não existe como texto na fonte: \"TWh/ano = GW × (FC ÷ 100) × 8,76\""],"comparacao_estatica":[{"id":"m08-inst-02","au

### m08-inst-03 · Calculadora de fator de capacidade · com faixa típica por fonte

**Identidade.** Inst · 03 · instrumento de aula · tipo: —

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Entre com a potência instalada, a energia gerada e o período. O instrumento devolve o fator de capacidade e o compara com a faixa típica da fonte selecionada — e diz o que um valor fora da faixa costuma indicar.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i3-seg | Fonte de referência | — | — | — | — | Hidrelétrica / Eólica / Solar / Biomassa / Gás natural / Nuclear |
| i3-p / i3-pn | Potência instalada | MW | campos gerados por script | 300 / 300 | 1 – 15000 / passo 1 | — |
| i3-e / i3-en | Energia gerada no período | GWh | campos gerados por script | 1200 / 1200 | 1 – 80000 / passo 1 | — |
| i3-h / i3-hn | Período | horas | campos gerados por script | 8760 / 8760 | 24 – 8784 / passo 1 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| — | Energia teórica máxima | GWh (extração) | — | `f0(teor)` |
| — | Fator de capacidade | % (extração) | — | `f1(fc)` |
| — | Horas equivalentes a plena carga | h (extração) | — | `f0(horasEq)` |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Calculadora de fator de capacidade · com faixa típica por fonte" — a faixa é um intervalo, e intervalo é forma
  - intro: "compara com a faixa típica da fonte selecionada — e diz o que um valor fora da faixa costuma indicar"
  - a fonte não desenha: a faixa sai como texto ("40% a 60%")
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** Uma régua horizontal de fator de capacidade de 0 a 100%, com a faixa típica da fonte selecionada sombreada entre os seus dois limites e o FCap calculado como marca sobre a régua. Nada mais: é uma figura de uma linha.
- **Eixo x:** fator de capacidade, 0 a 100%
- **Eixo y:** não há
- **Séries:** faixa típica da fonte selecionada (fx.lo a fx.hi) · marca do FCap calculado · opcionalmente, as faixas das outras cinco fontes em cinza, para escala
- **Relação que a figura tem de mostrar:** "Dentro da faixa" aqui descreve a usina, não corrige o learner: a faixa é conteúdo declarado pela fonte sobre o mundo, não margem de acerto. A figura tem de deixar isso óbvio — a marca é uma posição, não um veredito.
- **Derivação:** literal quanto à existência e aos limites das faixas (array I3.faixas com lo e hi por fonte)
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.
- **Por que não pedir:** A faixa típica NÃO é tolerância: ela descreve o comportamento da fonte de energia, não a margem de acerto de uma resposta. Confundir as duas é exatamente o que P6 proíbe.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Usina hidrelétrica com a potência, a energia e o período do cenário inicial: qual o fator de capacidade, em %, e ele cai dentro da faixa típica da hidrelétrica?
- **Cenário-padrão:** null
- **Resposta no cenário-padrão:** 45,7 % (energia teórica máxima 2.628 GWh; 4.000 h equivalentes a plena carga); faixa típica da hidrelétrica: 40 % a 60 %

**Avisos.**

- **Nota da fonte:** Sem span.srcnote neste instrumento. O que houver de procedência está só no disclaimer (p.disc).
- **Content QA (P20):** P20: as faixas de FCap divergem entre este instrumento e outros pontos do currículo. Verificação autoritativa pendente; nenhuma faixa vira verdade transversal.

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","ids":["m08-inst-03"],"problemas":["campo formula do código não existe como texto na fonte: \"FC = energia gerada ÷ (potência × período) × 100\"","1104 casos com texto da fonte 

### m08-inst-04 · Reconstrutor de matriz · desenhe as duas pizzas de memória

**Identidade.** Inst · 04 · instrumento de aula · tipo: —

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Este é o instrumento que atende diretamente o critério de domínio, e é o único do sistema Alexandria que exige que você produza a resposta antes de ver a correção. Sem consultar as fichas acima: estime a fatia de cada fonte, primeiro em capacidade, depois em geração. O instrumento devolve o erro por fonte, o erro total”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i4-seg | Rodada | — | — | — | — | 1 · Capacidade instalada / 2 · Geração efetiva |
| i4i-hid | Hidrelétrica | % da pizza | campos gerados por script |  | 0 – 100 / passo 0.1 | — |
| i4i-sol | Solar | % da pizza | campos gerados por script |  | 0 – 100 / passo 0.1 | — |
| i4i-eol | Eólica | % da pizza | campos gerados por script |  | 0 – 100 / passo 0.1 | — |
| i4i-bio | Biomassa | % da pizza | campos gerados por script |  | 0 – 100 / passo 0.1 | — |
| i4i-fos | Térmica fóssil | % da pizza | campos gerados por script |  | 0 – 100 / passo 0.1 | — |
| i4i-nuc | Nuclear | % da pizza | campos gerados por script |  | 0 – 100 / passo 0.1 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| — | Fontes dentro da tolerância | — | — | `acertos` |
| — | Erro absoluto total | pp (extração) | — | `f1(errTotal)` |
| — | Sua soma | % (extração) | — | `f1(soma)` |
| — | Ordem das fontes | — | — | `(ordemOk?'Correta':'Incorreta')` |

**Forma prometida (C5).**

- **Promete:** sim — cumprido em parte — a fonte desenha o erro, não as pizzas que o título manda desenhar
  - titulo: "Reconstrutor de matriz · desenhe as duas pizzas de memória" — o verbo "desenhe" está no título
  - intro: "é o único do sistema Alexandria que exige que você produza a resposta antes de ver a correção"
  - a fonte desenha em parte: barras de desvio divergentes a partir do centro (style left:50% / right:50%, largura min(50, \|d\|/30×50), classes over/under)
- **Desenho na fonte:** barras de desvio por fonte (divergentes do centro), com classe over/under aplicada quando \|d\| > I4.tol
- **O que precisa ser desenhado:** Depois da entrega, duas coisas na mesma tela: (a) a pizza estimada e a pizza de referência lado a lado, mesmas seis fontes e mesmas cores — as "duas pizzas" do título; (b) por fonte, a barra de desvio divergindo de um eixo central, com a banda de tolerância de ±3 pontos percentuais desenhada como região sombreada em torno do zero. Este é o único instrumento dos 165 em que uma banda de tolerância pode ser desenhada, porque é o único em que a fonte a declara.
- **Eixo x:** desvio em pontos percentuais em relação à referência, negativo à esquerda e positivo à direita, com a banda de ±3 p.p. marcada
- **Eixo y:** as seis fontes
- **Séries:** pizza estimada · pizza de referência · desvio por fonte · banda de tolerância ±3 p.p. · ordem das fontes (correta / incorreta)
- **Relação que a figura tem de mostrar:** O erro tem duas partes independentes: o desvio de cada fatia e a ordem das fontes. Dá para acertar a ordem e errar todas as fatias, e vice-versa. A figura tem de deixar as duas legíveis ao mesmo tempo — é o que os readouts "Fontes dentro da tolerância" e "Ordem das fontes" medem separadamente.
- **Derivação:** literal (tol: 3, a largura da barra, as classes over/under e a comparação de ordem são verbatim, linhas 2369–2500)
- **Custo:** M

**Tolerância (P6).**

- **Declarada pela fonte:** {"valor":3,"unidade":"pontos percentuais por fonte","declaracoes":[{"texto":"tol: 3","origem":{"seletor":"script I4.tol","trecho_inicial":"tol: 3","linha_aprox":2385}},{"texto":"Didático/ilustrativo. A tolerância de acerto é de 3 pontos percentuais por fonte, escolhida porque abaixo disso o exercíci
- **Veredito permitido:** dentro/fora.

**Previsão (C3).**

- **Útil:** sim. C3/C5 em estado puro: o instrumento já exige produzir antes de ver, e a fonte já declara a referência e a tolerância. Não há nada a inventar.
- **Pergunta (camada Alexandria):** Sem consultar as fichas: estime a fatia de cada uma das seis fontes na capacidade instalada (rodada 1) e depois na geração efetiva (rodada 2).
- **Cenário-padrão:** null
- **Resposta no cenário-padrão:** A referência é a declarada pela fonte (fotografia de 2025 no conceito amplo do balanço energético, ano-base 2025). O cenário-padrão não tem saída numérica porque a paleta começa vazia: o veredito inicial é a instrução da rodada.

**Avisos.**

- **Fonte dos números:** Fonte da referência: balanço energético nacional, relatório síntese, ano-base 2025, publicado em junho de 2026, complementado pelo anuário estatístico de energia elétrica do mesmo ciclo. Consulta: 1º de agosto de 2026.
- **Procedência declarada:** Fonte da referência declarada no próprio instrumento: balanço energético nacional, relatório síntese, ano-base 2025.
- **Divergência (P5/P8):** Registrado no README do M08: "O INST 04 aprova fora da tolerância". Conferir a comparação \|d\| <= tol no porte antes de exibir qualquer veredito.

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","ids":["m08-inst-04-cap","m08-inst-04-ger"],"problemas":["título do código difere: \"Reconstrutor de matriz · desenhe as duas pizzas de memória — 1 · Capacidade instalada\"","tí

### m08-inst-05 · Leitura lateral · o mesmo campo nas seis fontes

**Identidade.** Inst · 05 · instrumento de aula · tipo: —

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “As fichas acima se leem na vertical, uma fonte de cada vez. Este instrumento vira a tabela: escolha um campo e veja as seis fontes lado a lado. É onde os padrões do sistema aparecem — e onde fica claro que sazonalidade, e não volume, é o que organiza a operação.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i5-chips | Campo em exibição | — | — | — | — |  |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| — | painel/ficha renderizado (corpo_texto) | — | painel | — |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Leitura lateral · o mesmo campo nas seis fontes" — a forma é a tabela virada, e o título a nomeia
  - a fonte monta: uma linha por fonte (src-row) para o campo selecionado
- **Desenho na fonte:** linhas src-row, uma por fonte, para o campo em exibição
- **O que precisa ser desenhado:** Não é figura: é a tabela transposta. O campo escolhido no topo e as seis fontes em linhas, com o texto de cada uma lado a lado. O que a forma exige é que as seis apareçam juntas — exibir uma por vez seria a leitura vertical que o instrumento existe para negar.
- **Eixo x:** o campo selecionado (um de cada vez)
- **Eixo y:** as seis fontes, sempre todas
- **Séries:** as seis fontes
- **Relação que a figura tem de mostrar:** Os padrões do sistema só aparecem na horizontal. O intro afirma que fica claro que sazonalidade, e não volume, é o que distingue as fontes — e essa afirmação é indefensável com uma fonte por tela.
- **Derivação:** literal (o título nomeia a forma; a montagem por src-row é verbatim)
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Comparação: escolher o campo em que as seis fontes mais se parecem e o campo em que mais se separam.

**Avisos.**

- **Nota da fonte:** Sem span.srcnote neste instrumento. O que houver de procedência está só no disclaimer (p.disc).

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","ids":["m08-inst-05"],"problemas":["disclaimer (p.disc) não aparece verbatim na nota do código"],"comparacao_estatica":[{"id":"m08-inst-05","aula_no_codigo":"aula-08-02","kind":

### m08-inst-06 · Curvas de complementaridade · três escalas sobrepostas

**Identidade.** Inst · 06 · instrumento de aula · tipo: —

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Alterne a escala de tempo e ligue ou desligue cada fonte. A linha branca é a carga; a linha tracejada é a carga líquida, ou seja, a carga menos o que o operador não comanda. Quando a soma das fontes ligadas ultrapassa a carga líquida, a área de excedente aparece em vermelho — e essa área é o corte de geração antes de e”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i6-seg | Escala de tempo | — | — | — | — | Mês a mês · o ano / Hora a hora · dia útil / Hora a hora · domingo de sol |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| — | Fontes ligadas | — | — | `ligadas` |
| — | Pontos com excedente | — | — | `horasExc` |
| — | Maior excedente | un. (extração) | — | `f0(maxExc)` |
| — | Maior déficit contra a carga | un. (extração) | — | `f0(maxDef)` |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Curvas de complementaridade · três escalas sobrepostas" — "Curvas" e "sobrepostas"
  - intro: "A linha branca é a carga; a linha tracejada é a carga líquida" — a fonte descreve o próprio desenho
  - a fonte desenha: svg 700×300 com margens, grade de 0 a 100 em passos de 25 e doze pontos
- **Desenho na fonte:** svg 700×300 (ml 42, mr 12, mt 14, mb 26; n = 12; maxV = 100), com grade horizontal a cada 25 unidades
- **O que precisa ser desenhado:** Doze pontos no eixo do tempo, na escala escolhida, com a carga como linha cheia, a carga líquida como linha tracejada, as fontes ligadas empilhadas por baixo e o excedente marcado nos pontos em que a soma das ligadas ultrapassa a carga líquida.
- **Eixo x:** doze pontos, com o rótulo da escala escolhida (mês a mês no ano; hora a hora num dia útil; hora a hora num domingo de sol)
- **Eixo y:** 0 a 100 unidades, grade a cada 25 — a fonte declara a unidade como "un.", sem grandeza física
- **Séries:** carga (linha cheia) · carga líquida (tracejada) · cada fonte ligada, empilhada · excedente por ponto · déficit contra a carga
- **Relação que a figura tem de mostrar:** Complementaridade não é uma fonte compensar outra na média: é o vale de uma coincidir com o pico da outra ponto a ponto. Só a sobreposição no mesmo eixo mostra isso — e trocar a escala de tempo muda quais fontes se complementam, que é o motivo de haver três escalas.
- **Derivação:** literal quanto à geometria, à grade e aos rótulos de escala; derivado quanto ao empilhamento
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Com as cinco fontes ligadas, na escala mês a mês do ano: em quantos dos doze pontos a soma das fontes ultrapassa a carga líquida?
- **Cenário-padrão:** null
- **Resposta no cenário-padrão:** 12 de 12 pontos com excedente; maior excedente 23 un.; maior déficit contra a carga 4 un.
- **Ato alternativo:** Meta a alcançar: desligue fontes até zerar os pontos com excedente e diga qual foi a última que precisou sair.

**Avisos.**

- **Nota da fonte:** Sem span.srcnote neste instrumento. O que houver de procedência está só no disclaimer (p.disc).

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","ids":["m08-inst-06"],"problemas":["disclaimer (p.disc) não aparece verbatim na nota do código"],"comparacao_estatica":[{"id":"m08-inst-06","aula_no_codigo":"aula-08-03","kind":

### m08-inst-07 · Calendário sazonal · doze meses do sistema

**Identidade.** Inst · 07 · instrumento de aula · tipo: —

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Clique em qualquer mês. O painel mostra o que está acontecendo simultaneamente com chuva, vento, safra, carga e risco de corte — porque a leitura útil não é de uma variável de cada vez, é da coincidência entre elas.”

**Entradas.** Nenhuma no markup — o instrumento é percorrido, não parametrizado.

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| — | painel/ficha renderizado (painel) | — | painel | — |

**Forma prometida (C5).**

- **Promete:** sim — cumprido em parte — a fonte dá a grade dos doze meses e nega, no desenho, a coincidência que o intro declara ser a leitura útil
  - titulo: "Calendário sazonal · doze meses do sistema" — "Calendário"
  - intro: "a leitura útil não é de uma variável de cada vez, é da coincidência entre elas"
  - a fonte desenha em parte: doze células .cal-m geradas por i7render()
- **Desenho na fonte:** doze células .cal-m (#i7-cal), com o nome do mês abreviado em três letras; as cinco variáveis só existem no painel de texto
- **O que precisa ser desenhado:** Uma faixa de doze colunas (os meses) por cinco linhas (chuva, vento, safra, carga, risco de corte), cada célula com a intensidade declarada pela fonte para aquele mês e aquela variável. O mês selecionado destacado como coluna inteira, e o painel de texto abaixo detalhando a coluna.
- **Eixo x:** os doze meses
- **Eixo y:** as cinco variáveis, nas linhas — chuva, vento, safra, carga e risco de corte
- **Séries:** as cinco variáveis, uma linha cada
- **Relação que a figura tem de mostrar:** O intro é explícito: a leitura é da coincidência. Julho, no cenário-padrão, tem vento no início da safra, carga baixa, seco pleno e risco de corte alto ao mesmo tempo — e é a simultaneidade, não nenhuma das cinco isoladas, que explica a tensão de escoamento. Uma coluna inteira legível de uma vez é a única forma de mostrar isso.
- **Derivação:** literal quanto aos doze meses e às cinco variáveis por mês (array I7.meses, com os campos de chuva, vento, safra, carga e risco); a forma de faixa 12×5 é escolha de desenho
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Condição a encontrar: ache o mês em que as cinco variáveis se alinham no pior arranjo possível e diga por quê.

**Avisos.**

- **Nota da fonte:** Sem span.srcnote neste instrumento. O que houver de procedência está só no disclaimer (p.disc).

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","ids":["m08-inst-07"],"problemas":["disclaimer (p.disc) não aparece verbatim na nota do código"],"comparacao_estatica":[{"id":"m08-inst-07","aula_no_codigo":"aula-08-03","kind":

### m08-inst-08 · Termômetro hidrológico · estoque contra fluxo

**Identidade.** Inst · 08 · instrumento de aula · tipo: —

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Duas dimensões, quatro quadrantes, quatro diagnósticos completamente diferentes. Mova os controles e observe o ponto migrar. Os valores iniciais são a fotografia declarada abaixo; substitua-os pelo dado do dia e o instrumento continua correto.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i8-seg | Carregar fotografia de | — | — | — | — | Sudeste/Centro-Oeste / Sul / Nordeste / Norte |
| i8-ena / i8-enan | Afluência do mês | % da média de longo termo | campos gerados por script | 93 / 93 | 10 – 200 / passo 1 | — |
| i8-ear / i8-earn | Energia armazenada | % do volume útil | campos gerados por script | 66 / 66 | 0 – 100 / passo 1 | — |
| i8-mes / i8-mesn | Posição no ciclo anual | mês | campos gerados por script | 6 / 6 | 1 – 12 / passo 1 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| — | Quadrante | — | — | `(ear>=50?'Estoque alto':'Estoque baixo')+' · '+(ena>=100?'fluxo forte':'fluxo fraco')` |
| — | Tendência do estoque | — | — | `tend` |
| — | Posição no ciclo | — | — | `(umido?'Período úmido':'Período seco')` |
| — | Folga aproximada | meses (extração) | — | `meses` |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - intro literal: "Duas dimensões, quatro quadrantes, quatro diagnósticos completamente diferentes. Mova os controles e observe o ponto migrar."
  - a fonte desenha: #i8-quad, com dois eixos, quatro rótulos de quadrante literais e um ponto posicionado em qx, qy
- **Desenho na fonte:** #i8-quad: eixo vertical em ((100−10)/190×100)%, eixo horizontal em 50%, quatro rótulos literais ("Estoque alto · fluxo fraco", "Estoque alto · fluxo forte", "Estoque baixo · fluxo fraco", "Estoque baixo · fluxo forte") e o ponto .quad-dot
- **O que precisa ser desenhado:** O plano de dois eixos com os quatro quadrantes nomeados exatamente como a fonte os nomeia, a linha vertical no ponto em que a afluência iguala a média e a horizontal no meio do estoque, com o ponto migrando conforme os controles.
- **Eixo x:** afluência do mês, de 10 a 200% da média (qx = clamp((ena−10)/190×100, 0, 100)); a linha vertical marca os 100%
- **Eixo y:** energia armazenada, em % do volume útil, com o eixo invertido (qy = 100 − ear), de modo que estoque alto fique em cima
- **Séries:** ponto do subsistema · quatro quadrantes rotulados · linha dos 100% da média · linha dos 50% de estoque
- **Relação que a figura tem de mostrar:** Estoque e fluxo são independentes, e é a combinação que diagnostica. Estoque alto com fluxo fraco não é o mesmo problema que estoque baixo com fluxo forte — e o instrumento só ensina isso se os quatro quadrantes estiverem visíveis enquanto o ponto se move.
- **Derivação:** literal (as duas fórmulas de posição, as posições das linhas e os quatro rótulos são verbatim)
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Subsistema com afluência do mês em 93% da média e energia armazenada em 66% do volume útil, em mês de período seco: em que quadrante ele cai e quantos meses de folga aproximada isso dá?
- **Cenário-padrão:** null
- **Resposta no cenário-padrão:** Quadrante "Estoque alto · fluxo fraco"; tendência do estoque "estável"; posição no ciclo "Período seco"; folga aproximada de 17 meses

**Avisos.**

- **Fonte dos números:** Fotografias iniciais: afluência e armazenamento por subsistema em junho de 2026, conforme reportado ao comitê de monitoramento do setor elétrico. Consulta: 1º de agosto de 2026.
- **Procedência declarada:** Fotografias iniciais declaradas: afluência e armazenamento por subsistema em junho de 2026.
- **Divergência (P5/P8):** Registrado no README do M08: o quadrante corta em 100% da MLT e o texto de veredito corta em 70%. P8/P5: divergência preservada.

**Estado no código (informativo, não é camada fonte).** {"status":"portado","ids":["m08-inst-08"],"problemas":[],"comparacao_estatica":[{"id":"m08-inst-08","aula_no_codigo":"aula-08-04","kind":"simulador","titulo":"Termômetro hidrológico · estoque contra f

### m08-inst-09 · Anatomia do corte de geração · causa, hora e quem paga

**Identidade.** Inst · 09 · instrumento de aula · tipo: —

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Monte um cenário: escolha o patamar horário, o dia da semana, a região e a condição da rede. O instrumento devolve qual causa de corte predomina, sobre qual fonte ela recai e o que efetivamente resolveria aquele caso — que quase nunca é o que a manchete sugere.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i9-pat | Patamar horário | — | — | — | — | P1 · 00h–07h / P2 · transição / P3 · 09h–16h / P4 · 18h–24h |
| i9-dia | Dia | — | — | — | — | Dia útil / Domingo ou feriado |
| i9-reg | Região da usina | — | — | — | — | Nordeste / Norte / Sudeste/Centro-Oeste / Sul |
| i9-rede | Condição da rede | — | — | — | — | Normal / Limite de exportação atingido / Equipamento indisponível |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| — | Causa predominante | — | — | `esc(causa)` |
| — | Sobre quem recai | — | — | `esc(fonte)` |
| — | O que efetivamente resolve | — | — | `esc(resolve)` |
| — | Carga líquida no patamar | — | — | `(cargaBaixa?'Baixa':'Elevada')` |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Anatomia do corte de geração · causa, hora e quem paga" — nomeia três perguntas, não uma forma
  - as saídas são quatro leituras de texto
- **Sem promessa, mas (C6):** O patamar horário é um dos quatro controles, e a fonte já classifica cada patamar como carga alta ou baixa. Marcar o patamar escolhido sobre a curva do m08-inst-06 ligaria os dois instrumentos sem figura nova.
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** sim. A saída é categórica, mas é exatamente o tipo de categoria em que a intuição erra — a causa predominante muda com o patamar.
- **Pergunta (camada Alexandria):** Patamar P3 (09h–16h), dia útil, usina no Nordeste, rede em condição normal: qual causa de corte predomina e sobre quem ela recai?
- **Cenário-padrão:** null
- **Resposta no cenário-padrão:** Causa predominante: razão energética; recai predominantemente sobre a fotovoltaica centralizada, com parcela eólica no rateio; carga líquida no patamar: baixa

**Avisos.**

- **Nota da fonte:** Sem span.srcnote neste instrumento. O que houver de procedência está só no disclaimer (p.disc).

**Estado no código (informativo, não é camada fonte).** {"status":"portado","ids":["m08-inst-09"],"problemas":[],"comparacao_estatica":[{"id":"m08-inst-09","aula_no_codigo":"aula-08-05","kind":"simulador","titulo":"Anatomia do corte de geração · causa, hor

### m08-inst-10 · Perfil de carga · casamento com a curva de geração

**Identidade.** Inst · 10 · instrumento de aula · tipo: —

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Duas plantas com o mesmo consumo anual podem ter custo e risco completamente diferentes. Monte um perfil e veja o fator de carga resultante, a demanda de ponta implícita e qual fonte casa melhor com a curva — e qual introduz descasamento que precisaria ser coberto.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i10-c / i10-cn | Consumo anual | GWh/ano | campos gerados por script | 120 / 120 | 1 – 600 / passo 1 | — |
| i10-h / i10-hn | Horas de operação por dia | h | campos gerados por script | 24 / 24 | 4 – 24 / passo 1 | — |
| i10-d / i10-dn | Dias de operação por semana | dias | campos gerados por script | 7 / 7 | 1 – 7 / passo 1 | — |
| i10-t / i10-tn | Concentração no turno diurno | % do consumo | campos gerados por script | 40 / 40 | 0 – 100 / passo 1 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| — | Demanda média em operação | MW (extração) | — | `f1(demMed)` |
| — | Fator de carga anual | % (extração) | — | `f1(fatorCarga)` |
| — | Horas de operação por ano | h (extração) | — | `f0(horasAno)` |
| — | Cobertura solar teórica | % (extração) | — | `f0(coberturaSolar)` |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Perfil de carga · casamento com a curva de geração" — "perfil" e "curva", e "casamento" é a sobreposição das duas
  - a fonte não desenha: as quatro saídas são readouts de texto
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** Um dia de 24 horas com duas curvas sobrepostas: o perfil de carga da planta, construído a partir das horas de operação por dia e da concentração no turno diurno, e a curva de geração solar; a área de interseção entre as duas sombreada — ela é a cobertura solar teórica que o readout devolve.
- **Eixo x:** hora do dia, 0 a 24, com o recorte diurno que o script usa (horasDiurnas = min(h, 7))
- **Eixo y:** potência em MW
- **Séries:** perfil de carga da planta · curva de geração solar · área de interseção = cobertura solar teórica
- **Relação que a figura tem de mostrar:** Duas plantas com o mesmo consumo anual podem ter casamentos completamente diferentes com a mesma curva solar — é a primeira frase do intro. Sem as duas curvas no mesmo eixo, "casamento" vira um percentual sem referente, e o instrumento não cumpre o que o nome promete.
- **Derivação:** derivado do código-fonte (horasAno, demMed, fatorCarga, horasDiurnas, potDiurna e coberturaSolar são verbatim, linhas 2897–2948)
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Planta com o consumo anual, as horas de operação por dia, os dias por semana e a concentração diurna do cenário inicial: qual o fator de carga anual e qual a cobertura solar teórica?
- **Cenário-padrão:** null
- **Resposta no cenário-padrão:** Fator de carga anual 99,7 %; cobertura solar teórica 40 %; demanda média em operação 13,7 MW; 8.736 h de operação por ano

**Avisos.**

- **Nota da fonte:** Sem span.srcnote neste instrumento. O que houver de procedência está só no disclaimer (p.disc).

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","ids":["m08-inst-10"],"problemas":["campo formula do código não existe como texto na fonte: \"fator de carga = (consumo ÷ 8.760) ÷ demanda média em operação × 100\""],"comparaca

### m08-inst-11 · Roteador de recorte · qual base responde a qual pergunta

**Identidade.** Inst · 11 · instrumento de aula · tipo: —

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Diga que pergunta você precisa responder e com que granularidade. O instrumento devolve qual base abrir, qual universo ela cobre, com que defasagem publica e qual é a armadilha específica daquela série. É o fechamento do ciclo aberto no Módulo 07.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i11-tema | Sobre o que é a pergunta | — | — | — | — | Capacidade instalada / Geração por fonte / Condição hidrológica / Corte de geração / Consumo e mercado / Expansão futura |
| i11-gran | Granularidade necessária | — | — | — | — | Tempo real ou diária / Mensal / Anual consolidada |
| i11-uso | Uso pretendido | — | — | — | — | Análise interna / Material publicado |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| — | painel/ficha renderizado (ficha_texto) | — | painel | — |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Roteador de recorte · qual base responde a qual pergunta" — roteia
  - as saídas são uma ficha de base indicada
- **Sem promessa, mas (C6):** A fonte declara, por base, o universo coberto e a defasagem. Uma matriz tema × granularidade com a base indicada em cada célula mostraria de uma vez que a mesma pergunta muda de base conforme a granularidade — que é a tese do instrumento.
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Condição a encontrar: ache a combinação de tema e granularidade para a qual nenhuma base responde bem, e diga o que ela exige.

**Avisos.**

- **Nota da fonte:** Sem span.srcnote neste instrumento. O que houver de procedência está só no disclaimer (p.disc).

**Estado no código (informativo, não é camada fonte).** {"status":"portado","ids":["m08-inst-11"],"problemas":[],"comparacao_estatica":[{"id":"m08-inst-11","aula_no_codigo":"aula-08-07","kind":"explorador","titulo":"Roteador de recorte · qual base responde


## M09

### m09-inst-01 · Mapa do mercado — energia, contrato, dinheiro

**Identidade.** INST·01 · {"secao":"map","marcador":"§MAP","aula":null,"aula_nota":"Fora de aula: §MAP (vai para Recursos do Módulo, protocolo §3).","subsecao_anterior":null,"bloco_antes":{"tipo":"paragrafo","rotulo":null,"trecho_inicial":"A consequência operacional é que a geração física não segue o contrato","linha_aprox":528},"bloco_depois":{"tipo":"destaque","rotulo":"O teste do guardanapo, versão mínima","trecho_inicial":"O teste do guardanapo, versão mínima","linha_aprox":653},"linhas_markup":[530,651]} · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Mesma topologia, três fluxos alternáveis. Troque o fluxo e observe quais setas mudam de direção, quais desaparecem e quais permanecem idênticas. Clique em qualquer agente para ver o que ele faz naquele fluxo específico. O ponto do instrumento não é decorar o desenho: é ver que os três fluxos não coincidem.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| mp-seg | Fluxo em exibição | — | — | — | — | Energia física / Contrato / Dinheiro |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| mp-flow | — | — | — | — |
| mp-node | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Mapa do mercado — energia, contrato, dinheiro" — "Mapa" e três fluxos
  - intro: "Troque o fluxo e observe quais setas mudam de direção, quais desaparecem e quais permanecem idênticas"
  - a fonte desenha: svg com aria-label "Mapa do mercado de energia elétrica brasileiro" e três grupos de arestas
- **Desenho na fonte:** svg com três grupos de arestas e rótulos literais — e-fisico: injeção, transmissão, distribuição, entrega, entrega; e-contrato: leilão · CCEAR, bilateral · CCEAL, registro, registro; e-dinheiro: tarifa cheia, TUSD, pagamento contratual, liquidação MCP
- **O que precisa ser desenhado:** Uma topologia fixa de agentes com três conjuntos de setas alternáveis, cada conjunto com os seus rótulos literais. Trocar o fluxo troca as setas e mantém os agentes exatamente onde estavam.
- **Eixo x:** não há eixo de grandeza; as posições são fixas e a fixidez é o instrumento
- **Eixo y:** idem
- **Séries:** fluxo de energia física · fluxo de contrato · fluxo de dinheiro · agente selecionado
- **Relação que a figura tem de mostrar:** A topologia física é idêntica para cativo e livre — é a frase literal do painel do cenário-padrão. O que distingue os dois ambientes está no fluxo de contrato e no de dinheiro, não no de energia. Três conjuntos de setas sobre a mesma geometria é a única forma de provar isso sem argumentar.
- **Derivação:** literal (os rótulos das arestas dos três fluxos são texto da fonte)
- **Custo:** G

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada. Não há resposta de referência (ref/tol) em nenhum dos 11.

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Condição a encontrar: aponte a seta que existe no fluxo de dinheiro e não existe no de energia, e diga o que ela paga.

**Avisos.**

- **Nota da fonte:** Instrumento sem número calculado; o texto é qualitativo.

**Estado no código (informativo, não é camada fonte).** {"estado":"não portado","calculators":"nenhuma chave m09-inst-* em alexandria-instrument-calculators.ts","aula_instruments":null,"recursos_do_modulo":"RecursosDoModulo.tsx: 'modulo-09' → instrumentos:

### m09-inst-02 · Comparador componente a componente

**Identidade.** INST·02 · {"secao":"a01","marcador":"Aula 01","aula":"aula-09-01","aula_nota":null,"subsecao_anterior":{"numero":"Eixo 1b","texto":"O que não muda em absolutamente nada","linha_aprox":697},"bloco_antes":{"tipo":"paragrafo","rotulo":null,"trecho_inicial":"Do mesmo modo, o consumidor livre não escolhe fisicamente de qual usin","linha_aprox":701},"bloco_depois":{"tipo":"titulo","rotulo":"Eixo 2","trecho_inicial":"Eixo 2 Quem carrega cada risco","linha_aprox":728},"linhas_markup":[703,726]} · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Dez componentes do custo de eletricidade de uma unidade industrial, lado a lado nos dois ambientes. Cada componente é classificado por natureza da mudança — o que troca de fornecedor, o que troca só de mecanismo, o que permanece devido de qualquer forma, e o que passa a existir. Clique num componente para abrir o detal”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| cmp-grid | Componente | — | — | — | — | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| cmp-c1 | Troca de fornecedor | — | — | — |
| cmp-c2 | Muda de mecanismo | — | — | — |
| cmp-c3 | Permanece devido | — | — | — |
| cmp-c4 | Passa a existir | — | — | — |
| cmp-note | — | — | — | — |
| cmp-out | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — cumprido em parte — a fonte conta as classes e detalha um componente por vez; o "lado a lado nos dois ambientes" que o intro promete não está desenhado
  - titulo: "Comparador componente a componente" — "Comparador" e a unidade de comparação
  - intro: "Dez componentes do custo de eletricidade de uma unidade industrial, lado a lado nos dois ambientes" — a fonte escreve "lado a lado"
  - a fonte desenha em parte: grade dinâmica #cmp-grid e quatro contadores por classe
- **Desenho na fonte:** grade #cmp-grid (10 componentes) + quatro contadores com rótulo e unidade literais
- **O que precisa ser desenhado:** Dez linhas, uma por componente, e duas colunas — ambiente regulado e ambiente livre — com cada linha marcada pela classe de mudança que a fonte lhe atribui: troca de fornecedor, muda de mecanismo, permanece devido, passa a existir. Os quatro contadores viram a legenda da figura.
- **Eixo x:** os dois ambientes, lado a lado
- **Eixo y:** os dez componentes do custo
- **Séries:** Troca de fornecedor (1 de 10 componentes) · Muda de mecanismo (mesma contraparte) · Permanece devido (indiferente ao ambiente) · Passa a existir (custo novo)
- **Relação que a figura tem de mostrar:** Um único componente de dez troca efetivamente de fornecedor. A nota da fonte diz exatamente isso, e diz que é por isso que comparar o preço do contrato livre com o total da fatura cativa "produz uma diferença que não descreve nada". A figura precisa deixar essa proporção óbvia antes de qualquer texto.
- **Derivação:** literal (as quatro classes, os rótulos, as unidades e as contagens 1 / 3 / 4 / 2 são verbatim do script e do cenário-padrão)
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada. Não há resposta de referência (ref/tol) em nenhum dos 11.

**Previsão (C3).**

- **Útil:** sim. A proporção é contraintuitiva e a fonte já a declara em números.
- **Pergunta (camada Alexandria):** Dos dez componentes do custo de eletricidade de uma unidade industrial, quantos efetivamente trocam de fornecedor quando ela migra para o mercado livre?
- **Cenário-padrão:** {"seletores":{},"campos":{}}
- **Resposta no cenário-padrão:** 1 de 10 (3 mudam de mecanismo com a mesma contraparte; 4 permanecem devidos, indiferentes ao ambiente; 2 passam a existir como custo novo)

**Avisos.**

- **Nota da fonte:** Instrumento sem número calculado; o texto é qualitativo.

**Estado no código (informativo, não é camada fonte).** {"estado":"não portado","calculators":"nenhuma chave m09-inst-* em alexandria-instrument-calculators.ts","aula_instruments":"aula-09-01.instruments = []","recursos_do_modulo":"RecursosDoModulo.tsx: 'm

### m09-inst-03 · Anatomia do produto de leilão

**Identidade.** INST·03 · {"secao":"a02","marcador":"Aula 02","aula":"aula-09-02","aula_nota":null,"subsecao_anterior":{"numero":"02.4","texto":"As famílias de leilão, por função e não por sigla","linha_aprox":827},"bloco_antes":{"tipo":"paragrafo","rotulo":null,"trecho_inicial":"Vale registrar uma atualização de moldura legal que o material corrent","linha_aprox":831},"bloco_depois":{"tipo":"titulo","rotulo":"02.5","trecho_inicial":"02.5 Quantidade e disponibilidade: a mesma palavra \"contrato\", dois ar","linha_aprox":866},"linhas_markup":[833,864]} · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Seis famílias de produto, quatro perguntas idênticas para cada uma. Os campos são fixos de propósito: a leitura lateral — percorrer a mesma pergunta em todas as famílias — é o que revela que produtos com nomes parecidos resolvem problemas opostos. Para os contratos de comercialização no ambiente regulado, use o segundo”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| lei-seg | Família de produto | — | — | — | — | Energia nova / Energia existente / Ajuste |
| lei-seg2 | Família de produto | — | — | — | — | Fontes alternativas / Energia de reserva / Reserva de capacidade |
| mod-seg | Modalidade do contrato regulado | — | — | — | — | Por quantidade / Por disponibilidade |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| lei-mod | — | — | — | — |
| lei-out | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Anatomia do produto de leilão"
  - intro: "Seis famílias de produto, quatro perguntas idênticas para cada uma. Os campos são fixos de propósito: a leitura lateral — percorrer a mesma pergunta em todas as famílias — é o que revela…" — a fonte nomeia a forma e diz por que ela é obrigatória
  - a fonte não desenha: uma família por vez
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** A matriz 6 × 4 inteira: seis famílias de produto nas linhas, quatro perguntas fixas nas colunas, com a célula selecionada expandida e as outras vinte e três legíveis ao menos em resumo. O seletor de modalidade (por quantidade / por disponibilidade) altera a coluna de risco.
- **Eixo x:** as quatro perguntas fixas (objeto econômico, risco que resolve, prazo e uso típico, e a quarta declarada na fonte)
- **Eixo y:** as seis famílias (Energia nova, Energia existente, Ajuste, Fontes alternativas, Energia de reserva, Reserva de capacidade)
- **Séries:** as 24 células · o efeito da modalidade sobre a coluna de risco
- **Relação que a figura tem de mostrar:** O intro afirma que produtos com nomes parecidos resolvem problemas diferentes. Essa afirmação é indemonstrável com uma família por tela: ela só aparece quando a mesma pergunta é lida na vertical, atravessando as seis.
- **Derivação:** literal (os seis rótulos de família, os dois de modalidade e a exigência de leitura lateral são texto da fonte)
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada. Não há resposta de referência (ref/tol) em nenhum dos 11.

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Comparação: percorrer uma pergunta nas seis famílias e nomear as duas que mais se parecem e a diferença que as separa.

**Avisos.**

- **Nota da fonte:** Instrumento sem número calculado; o texto é qualitativo.

**Estado no código (informativo, não é camada fonte).** {"estado":"não portado","calculators":"nenhuma chave m09-inst-* em alexandria-instrument-calculators.ts","aula_instruments":"aula-09-02.instruments = []","recursos_do_modulo":"RecursosDoModulo.tsx: 'm

### m09-inst-04 · Régua de elegibilidade e cronograma condicionado

**Identidade.** INST·04 · {"secao":"a03","marcador":"Aula 03","aula":"aula-09-03","aula_nota":null,"subsecao_anterior":{"numero":"03.1","texto":"O cronograma da baixa tensão não é uma data — é uma data condicionada","linha_aprox":950},"bloco_antes":{"tipo":"destaque","rotulo":"Regra em movimento · consulta em 1º/8/2026","trecho_inicial":"Regra em movimento · consulta em 1º/8/2026","linha_aprox":966},"bloco_depois":{"tipo":"titulo","rotulo":"03.2","trecho_inicial":"03.2 Elegibilidade não é prontidão","linha_aprox":1018},"linhas_markup":[971,1016]} · tipo: simulador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Selecione o segmento e marque quais dos cinco requisitos legais já foram cumpridos. O instrumento devolve o estado de elegibilidade, o que ainda falta e o que a resposta correta a um cliente deve conter. As datas são entrada editável de propósito: elas vão mudar, e o instrumento precisa continuar correto quando mudarem”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| el-seg | Segmento do consumidor | — | — | — | — | Grupo A · qualquer demanda / Baixa tensão · indústria e comércio / Baixa tensão · demais |
| el-d0 | Publicação da lei (marco zero do cronograma) | mês/ano | — | 11/2025 | — | — |
| el-m1 | Prazo legal · indústria e comércio em BT | meses | — | 24 | 0 – 120 / passo 1 | — |
| el-m2 | Prazo legal · demais consumidores em BT | meses | — | 36 | 0 – 120 / passo 1 | — |
| el-req | Requisitos legais prévios já cumpridos | — | — | — | — | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| el-n | Requisitos cumpridos | — | — | — |
| el-p | Teto de prazo aplicável | — | — | — |
| el-e | Estado | — | — | — |
| el-v | — | — | — | — |
| el-out | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Régua de elegibilidade e cronograma condicionado" — "Régua" e "cronograma"
  - intro: "As datas são entrada editável" — a fonte torna o cronograma manipulável
  - a fonte não desenha: readouts e painel de texto
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** Um eixo de tempo a partir do marco zero editável, com dois marcos posicionados pelos prazos legais também editáveis, e o hoje marcado sobre ele; abaixo do eixo, os cinco requisitos legais como blocos que precisam estar cumpridos para que os marcos valham — porque é isso que "condicionado" quer dizer no título.
- **Eixo x:** meses desde a publicação da lei (marco zero), com os dois prazos legais marcados
- **Eixo y:** duas trilhas: os marcos de abertura por segmento e os cinco requisitos prévios
- **Séries:** marco zero · prazo legal para indústria e comércio em BT · prazo legal para os demais consumidores em BT · os cinco requisitos legais prévios · posição do hoje
- **Relação que a figura tem de mostrar:** O cronograma não corre sozinho: os requisitos prévios condicionam a abertura. A figura precisa deixar ver que um prazo cumprido no calendário e um requisito não cumprido produzem estados diferentes — e que para o Grupo A nenhum dos dois se aplica, que é a leitura do cenário-padrão.
- **Derivação:** literal quanto aos rótulos dos campos e aos cinco requisitos (array REQ); derivado quanto à forma de eixo
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada. Não há resposta de referência (ref/tol) em nenhum dos 11.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Consumidor do Grupo A, com marco zero em 11/2025 e nenhum dos cinco requisitos legais marcado: qual o estado de elegibilidade e qual teto de prazo se aplica?
- **Cenário-padrão:** {"seletores":{"el-seg":"ga"},"campos":{"el-d0":"11/2025","el-m1":"24","el-m2":"36"}}
- **Resposta no cenário-padrão:** Estado "elegível hoje"; teto de prazo "não se aplica"; 0 de 5 requisitos cumpridos — os requisitos condicionam a abertura da baixa tensão, não o Grupo A

**Avisos.**

- **Nota da fonte:** A fonte não declara origem para coeficientes, pesos, limiares e padrões (ex.: 0,15 e 0,20 no INST·07; pesos cam no INST·05; 0,85/1,0/±0,05 no INST·08; 24/36 meses e "11/2025" no INST·04 vêm da Lei 15.269/2025 citada na Aula 03, mas o instrumento não cita). Tratar como cenário didático (P19).
- **Content QA (P20):** Os prazos de 24 e 36 meses e a data de 11/2025 são valores iniciais editáveis da fonte. Exibi-los como dado normativo exige verificação autoritativa (P20).

**Estado no código (informativo, não é camada fonte).** {"estado":"não portado","calculators":"nenhuma chave m09-inst-* em alexandria-instrument-calculators.ts","aula_instruments":"aula-09-03.instruments = []","recursos_do_modulo":"RecursosDoModulo.tsx: 'm

### m09-inst-05 · Montador de contrato — perfil de risco resultante

**Identidade.** INST·05 · {"secao":"a04","marcador":"Aula 04","aula":"aula-09-04","aula_nota":null,"subsecao_anterior":{"numero":"04.5","texto":"Garantias, mudança em lei e término","linha_aprox":1234},"bloco_antes":{"tipo":"paragrafo","rotulo":null,"trecho_inicial":"E o término. Uma cláusula equilibrada define inadimplemento material, ","linha_aprox":1240},"bloco_depois":{"tipo":"destaque","rotulo":"Onde isso entra no produto","trecho_inicial":"Onde isso entra no produto","linha_aprox":1299},"linhas_markup":[1242,1297]} · tipo: quebra-cabeca

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Monte uma estrutura contratual escolhendo as cinco dimensões e leia o perfil de risco que ela produz: quem carrega o quê, o que ficou coberto e o que ficou descoberto. O instrumento não devolve preço e não devolve economia — de propósito. Ele devolve exposição residual, que é o objeto sobre o qual a decisão deveria ser”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| mc-hz | Horizonte | — | — | — | — | Até 12 meses / 13 a 36 meses / Acima de 36 meses |
| mc-vol | Forma de entrega do volume | — | — | — | — | Plano / Sazonalizado / Modulado / Acompanha a carga |
| mc-flex | Flexibilidade de volume | — | — | — | — | Rígido, sem banda / Banda estreita / Banda ampla com mínimo |
| mc-idx | Preço e indexação | — | — | — | — | Nominal fixo / Índice de preços / Câmbio / Indexado ao curto prazo com teto |
| mc-sub | Submercado de entrega contábil | — | — | — | — | Mesmo do consumo / Diferente do consumo |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| mc-r1 | Risco de preço | — | — | — |
| mc-r2 | Risco de volume | — | — | — |
| mc-r3 | Risco de perfil | — | — | — |
| mc-r4 | Camadas descobertas | — | — | — |
| mc-v | — | — | — | — |
| mc-out | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Montador de contrato — perfil de risco resultante" — "perfil"
  - intro: "leia o perfil de risco que ela produz: quem carrega o quê, o que ficou coberto e o que ficou descoberto"
  - a fonte não desenha: quatro readouts de texto e um painel
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** Cinco faixas, uma por camada de risco, cada uma com um marcador indicando quem a carrega e se ela ficou coberta ou descoberta pela estrutura montada. As camadas descobertas em vazado; o contador "Camadas descobertas: N de 5" é a leitura da figura, não um número à parte.
- **Eixo x:** estado da camada: coberta / parcialmente coberta / descoberta, e quem carrega
- **Eixo y:** as cinco camadas de risco do contrato
- **Séries:** risco de preço · risco de volume · risco de perfil · as demais camadas até cinco · quem carrega cada uma
- **Relação que a figura tem de mostrar:** Cada uma das cinco escolhas do montador cobre uma camada e frequentemente descobre outra — o instrumento não devolve preço nem economia, de propósito, porque o que ele mede é a realocação de risco. Um perfil de cinco faixas mostra a realocação; quatro readouts de texto não mostram.
- **Derivação:** literal quanto às cinco dimensões de entrada, aos três readouts de risco e ao contador "de 5"
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada. Não há resposta de referência (ref/tol) em nenhum dos 11.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Contrato de horizonte até 12 meses, entrega plana, rígido sem banda, preço nominal fixo e submercado igual ao do consumo: quantas das cinco camadas ficam descobertas e quem carrega o risco de preço?
- **Cenário-padrão:** {"seletores":{"mc-hz":"curto","mc-vol":"flat","mc-flex":"rig","mc-idx":"fixo","mc-sub":"mesmo"},"campos":{}}
- **Resposta no cenário-padrão:** Risco de preço: "vendedor, sobre o contratado" (as demais leituras do cenário-padrão estão no registro da extração)

**Avisos.**

- **Nota da fonte:** A fonte não declara origem para coeficientes, pesos, limiares e padrões (ex.: 0,15 e 0,20 no INST·07; pesos cam no INST·05; 0,85/1,0/±0,05 no INST·08; 24/36 meses e "11/2025" no INST·04 vêm da Lei 15.269/2025 citada na Aula 03, mas o instrumento não cita). Tratar como cenário didático (P19).

**Estado no código (informativo, não é camada fonte).** {"estado":"não portado","calculators":"nenhuma chave m09-inst-* em alexandria-instrument-calculators.ts","aula_instruments":"aula-09-04.instruments = []","recursos_do_modulo":"RecursosDoModulo.tsx: 'm

### m09-inst-06 · Matriz contrato × risco — produto cartesiano completo

**Identidade.** INST·06 · {"secao":"a05","marcador":"Aula 05","aula":"aula-09-05","aula_nota":null,"subsecao_anterior":{"numero":"05.7","texto":"Regulatório","linha_aprox":1354},"bloco_antes":{"tipo":"paragrafo","rotulo":null,"trecho_inicial":"A mitigação é contratual e é imperfeita: cláusula de mudança em lei co","linha_aprox":1358},"bloco_depois":{"tipo":"titulo","rotulo":"05.8","trecho_inicial":"05.8 Correlação: o risco que a diversificação não resolve sozinha","linha_aprox":1389},"linhas_markup":[1360,1387]} · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Seis estruturas de contrato, sete classes de risco, quarenta e duas células. Cada célula responde três perguntas idênticas: quem carrega, o que dispara e o que mitiga. Nenhuma célula está vazia — a matriz é completa de propósito, porque é a completude que permite ler lateralmente. Selecione a estrutura e a classe de ri”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| mx-c1 | Estrutura de contrato | — | — | — | — | Plano / Sazonalizado / Modulado |
| mx-c2 | Estrutura de contrato | — | — | — | — | Acompanha carga / Banda com mínimo / Indexado com teto |
| mx-risk | Classe de risco | — | — | — | — | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| mx-res | — | — | — | — |
| mx-out | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho — e é a promessa mais explícita do módulo: o instrumento se chama matriz, declara 42 células e mostra uma
  - titulo: "Matriz contrato × risco — produto cartesiano completo" — a palavra é "Matriz" e a fonte declara a completude
  - intro: "Seis estruturas de contrato, sete classes de risco, quarenta e duas células. […] Nenhuma célula está vazia — a matriz é completa de propósito"
  - a fonte não desenha: uma célula por vez
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** A grade 6 × 7 inteira e visível: seis estruturas de contrato nas linhas, sete classes de risco nas colunas, 42 células preenchidas, com a célula selecionada aberta abaixo respondendo as três perguntas fixas (quem carrega, o que dispara, o que mitiga).
- **Eixo x:** as sete classes de risco (a primeira é "Preço", seguida de "Volume", "Perfil", "Submercado" e as demais do array RISCOS)
- **Eixo y:** as seis estruturas de contrato (Plano, Sazonalizado, Modulado, Acompanha carga, Banda com mínimo, Indexado com teto)
- **Séries:** as 42 células · célula selecionada
- **Relação que a figura tem de mostrar:** A completude é o conteúdo. Uma matriz sem buraco afirma que nenhuma estrutura de contrato elimina uma classe de risco — apenas move quem a carrega. Mostrar uma célula por vez transforma essa afirmação estrutural numa sequência de fichas, e o instrumento deixa de ensinar o que se propôs.
- **Derivação:** literal (as seis estruturas, as sete classes, as 42 células e as três perguntas fixas são declaradas no intro e no array RISCOS)
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada. Não há resposta de referência (ref/tol) em nenhum dos 11.

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Comparação: percorrer uma classe de risco nas seis estruturas e dizer qual delas mais desloca esse risco para o comprador.

**Avisos.**

- **Nota da fonte:** Instrumento sem número calculado; o texto é qualitativo.

**Estado no código (informativo, não é camada fonte).** {"estado":"não portado","calculators":"nenhuma chave m09-inst-* em alexandria-instrument-calculators.ts","aula_instruments":"aula-09-05.instruments = []","recursos_do_modulo":"RecursosDoModulo.tsx: 'm

### m09-inst-07 · Simulador de exposição residual

**Identidade.** INST·07 · {"secao":"a06","marcador":"Aula 06","aula":"aula-09-06","aula_nota":null,"subsecao_anterior":{"numero":"06.2","texto":"O preço de hoje não é o preço de amanhã, e nunca foi","linha_aprox":1431},"bloco_antes":{"tipo":"tres_niveis_ref","rotulo":"Exposição ao preço de curto prazo — em três níveis","trecho_inicial":"Exposição ao preço de curto prazo — em três níveis","linha_aprox":1436},"bloco_depois":{"tipo":"destaque","rotulo":"Onde isso entra no produto","trecho_inicial":"Onde isso entra no produto","linha_aprox":1513},"linhas_markup":[1458,1511]} · tipo: simulador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Quanto do consumo fica descoberto conforme a estrutura contratual e o formato da carga. Saída em percentual e em megawatt-hora, nunca em dinheiro — porque converter exposição em reais exigiria projetar preço, e projetar preço é exatamente o que este módulo ensina a não fazer. Mova os controles e observe a exposição res”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| ex-seg | Forma de entrega contratada | — | — | — | — | Plano / Sazonalizado / Modulado |
| ex-c | Consumo médio mensal | MWh | — | 1000 | 50 – 50000 / passo 50 | — |
| ex-s | Amplitude sazonal da carga | ± % ao mês | — | 15 | 0 – 60 / passo 1 | — |
| ex-h | Dispersão horária dentro do mês | ± % na hora | — | 20 | 0 – 80 / passo 1 | — |
| ex-v | Volume contratado | % do consumo médio | — | 100 | 0 – 130 / passo 1 | — |
| ex-f | Banda de flexibilidade | ± % | — | 10 | 0 – 40 / passo 1 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| ex-p | Exposição residual | % (extração) | — | — |
| ex-m | Volume exposto | MWh/mês (extração) | — | — |
| ex-os | Origem sazonal | % (script) | — | — |
| ex-oh | Origem horária | % (script) | — | — |
| ex-vd | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Simulador de exposição residual" — nomeia a grandeza
  - intro: "Saída em percentual e em megawatt-hora, nunca em dinheiro"
- **Sem promessa, mas (C6):** A fonte separa a exposição em origem sazonal e origem horária — dois readouts. Duas barras somando a exposição total mostrariam de onde ela vem, que é o que o instrumento tem a dizer e o que o texto do veredito repete em palavras.
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada. Não há resposta de referência (ref/tol) em nenhum dos 11.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Entrega plana contratada, consumo médio de 1.000 MWh/mês, amplitude sazonal de ±15% ao mês, dispersão horária de ±20% na hora, volume contratado em 100% do consumo médio e banda de flexibilidade de ±10%: qual a exposição residual, em % do consumo?
- **Cenário-padrão:** {"seletores":{"ex-seg":"flat"},"campos":{"ex-c":"1000","ex-s":"15","ex-h":"20","ex-v":"100","ex-f":"10"}}
- **Resposta no cenário-padrão:** 15,0 % (volume exposto de 150 MWh/mês médio; origem sazonal 15,0 %; origem horária 20,0 %)

**Avisos.**

- **Nota da fonte:** A fonte não declara origem para coeficientes, pesos, limiares e padrões (ex.: 0,15 e 0,20 no INST·07; pesos cam no INST·05; 0,85/1,0/±0,05 no INST·08; 24/36 meses e "11/2025" no INST·04 vêm da Lei 15.269/2025 citada na Aula 03, mas o instrumento não cita). Tratar como cenário didático (P19).
- **Content QA (P20):** Os coeficientes 0,15 e 0,20 usados no cálculo não têm procedência declarada na fonte.

**Estado no código (informativo, não é camada fonte).** {"estado":"não portado","calculators":"nenhuma chave m09-inst-* em alexandria-instrument-calculators.ts","aula_instruments":"aula-09-06.instruments = []","recursos_do_modulo":"RecursosDoModulo.tsx: 'm

### m09-inst-08 · Anatomia do fator de ajuste

**Identidade.** INST·08 · {"secao":"a07","marcador":"Aula 07","aula":"aula-09-07","aula_nota":null,"subsecao_anterior":{"numero":"07.2","texto":"Uma atualização técnica que passou despercebida","linha_aprox":1551},"bloco_antes":{"tipo":"paragrafo","rotulo":null,"trecho_inicial":"A Lei nº 15.269/2025 também limitou a variação das revisões ordinárias","linha_aprox":1553},"bloco_depois":{"tipo":"tres_niveis_ref","rotulo":"Fator de ajuste — em três níveis","trecho_inicial":"Fator de ajuste — em três níveis","linha_aprox":1594},"linhas_markup":[1555,1591]} · tipo: simulador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Mova o fator e observe o que acontece com a alocação de um participante e com a posição de quem comprou energia lastreada nele. O instrumento é sobre estrutura, não sobre previsão: ele mostra o mecanismo de transmissão do déficit do conjunto até a posição de um contrato específico.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| gs-f | Fator de ajuste do conjunto | geração ÷ referência | — | 0.92 | 0.60 – 1.20 / passo 0.01 | — |
| gs-g | Garantia física do participante | MW médios | — | 100 | 1 – 2000 / passo 1 | — |
| gs-v | Posição vendida do participante | % da garantia física | — | 95 | 0 – 130 / passo 1 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| gs-a | Energia alocada | MW (extração) | — | — |
| gs-c | Posição contratada | MW (extração) | — | — |
| gs-d | Diferença a liquidar | MW (extração) | — | — |
| gs-s | Situação | — | — | — |
| gs-vd | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Anatomia do fator de ajuste" — nomeia o mecanismo, não uma forma
  - intro: "O instrumento é sobre estrutura, não sobre previsão"
- **Sem promessa, mas (C6):** Energia alocada, posição contratada e diferença a liquidar são três alturas na mesma escala. Três barras, com a diferença marcada entre as duas primeiras, tornam o mecanismo de transmissão do déficit visível numa olhada.
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada. Não há resposta de referência (ref/tol) em nenhum dos 11.

**Previsão (C3).**

- **Útil:** sim. O intro adverte que o instrumento não é sobre previsão de fator — mas a pergunta de previsão aqui é sobre a consequência estrutural de um fator dado, que é exatamente o que ele ensina.
- **Pergunta (camada Alexandria):** Fator de ajuste do conjunto em 0,92, garantia física do participante de 100 MW médios e posição vendida em 95% da garantia: quantos MW médios ficam a liquidar, e em que situação o participante fica?
- **Cenário-padrão:** {"seletores":{},"campos":{"gs-f":"0.92","gs-g":"100","gs-v":"95"}}
- **Resposta no cenário-padrão:** 3,0 MW médios a liquidar (energia alocada 92,0; posição contratada 95,0); situação "posição comprada"

**Avisos.**

- **Nota da fonte:** A fonte não declara origem para coeficientes, pesos, limiares e padrões (ex.: 0,15 e 0,20 no INST·07; pesos cam no INST·05; 0,85/1,0/±0,05 no INST·08; 24/36 meses e "11/2025" no INST·04 vêm da Lei 15.269/2025 citada na Aula 03, mas o instrumento não cita). Tratar como cenário didático (P19).

**Estado no código (informativo, não é camada fonte).** {"estado":"não portado","calculators":"nenhuma chave m09-inst-* em alexandria-instrument-calculators.ts","aula_instruments":"aula-09-07.instruments = []","recursos_do_modulo":"RecursosDoModulo.tsx: 'm

### m09-inst-09 · Roteador — vale investigar, não vale, ou não dá para dizer

**Identidade.** INST·09 · {"secao":"a08","marcador":"Aula 08","aula":"aula-09-08","aula_nota":null,"subsecao_anterior":{"numero":"08.1","texto":"Sinais favoráveis e sinais de cautela","linha_aprox":1633},"bloco_antes":{"tipo":"destaque","rotulo":"A estrutura da decisão, sem número","trecho_inicial":"A estrutura da decisão, sem número","linha_aprox":1666},"bloco_depois":{"tipo":"titulo","rotulo":"08.2","trecho_inicial":"08.2 Janeiro de 2024 e o mercado endereçável","linha_aprox":1693},"linhas_markup":[1671,1691]} · tipo: {"valor":null,"justificativa":"Seis perguntas ternárias (Sim/Não/Não sei), duas classes de pergunta (dado × impedimento) → 3 contadores + veredito em 4 ramos com prioridade. Não é o \"Roteador de decisão\" do M07 (explorador, select → texto): nome igual, mecânica diferente (taxonomia §3). Decisão de tipo pendente.","nota":"Anotação desta extração (taxonomia §\"Como decidir\"), não texto da fonte."}

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Seis perguntas. Três classes de veredito. O instrumento não devolve número de economia — devolve diagnóstico e a lista das perguntas que faltam. Responda "não sei" quando for verdade: a resposta "não sei" é informação, e o instrumento a trata como tal.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| rt-qs | — | — | — | — | — | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| rt-n | Respondidas | — | — | — |
| rt-l | Lacunas declaradas | — | — | — |
| rt-i | Impedimentos | — | — | — |
| rt-v | — | — | — | — |
| rt-out | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Roteador — vale investigar, não vale, ou não dá para dizer" — nomeia três vereditos, não uma forma
- **Sem promessa, mas (C6):** Três contadores — respondidas, lacunas declaradas e impedimentos — governam a classe do veredito. Uma barra de seis segmentos, um por pergunta, com três estados visuais distintos, mostraria o estado do diagnóstico sem número.
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada. Não há resposta de referência (ref/tol) em nenhum dos 11.

**Previsão (C3).**

- **Útil:** não. O ato aqui é declarar o que se sabe e o que não se sabe sobre um caso do learner; previsão numérica não se aplica.
- **Ato alternativo (C3):** Registro de lacuna: responder as seis, usando "não sei" quando for verdade, e sair com a lista das perguntas que faltam.

**Avisos.**

- **Nota da fonte:** Instrumento sem número calculado; o texto é qualitativo.
- **Nota C5:** Este instrumento já oferece nativamente o "não é possível concluir" que C5 exige de instrumento de veredito. Vale como referência de forma para os demais roteadores do currículo.

**Estado no código (informativo, não é camada fonte).** {"estado":"não portado","calculators":"nenhuma chave m09-inst-* em alexandria-instrument-calculators.ts","aula_instruments":"aula-09-08.instruments = []","recursos_do_modulo":"RecursosDoModulo.tsx: 'm

### m09-inst-10 · Régua do ciclo comercial — o que pode dar errado em cada etapa

**Identidade.** INST·10 · {"secao":"a08","marcador":"Aula 08","aula":"aula-09-08","aula_nota":null,"subsecao_anterior":{"numero":"08.3","texto":"A transição até 2028, e como acompanhá-la sem depender de intermediário","linha_aprox":1710},"bloco_antes":{"tipo":"lista","rotulo":null,"trecho_inicial":"Novas migrações e participação da representação varejista, nos boletin","linha_aprox":1714},"bloco_depois":{"tipo":"instrumento_ref","rotulo":"INST·11","trecho_inicial":"INST·11","linha_aprox":1746},"linhas_markup":[1727,1742]} · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “O Módulo 07 ensinou quem faz e quando. Esta régua responde outra pergunta: o que cada etapa custa e que risco ela cria para quem está do lado do consumidor. Selecione uma etapa do ciclo.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| cc-grid | Etapa do ciclo mensal | — | — | — | — | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| cc-v | — | — | — | — |
| cc-out | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Régua do ciclo comercial — o que pode dar errado em cada etapa" — "Régua"
  - intro: "O Módulo 07 ensinou quem faz e quando. Esta régua responde outra pergunta: o que cada etapa custa e que risco ela cria"
  - a fonte não desenha: grade de etapas e painel
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** A mesma régua de dias do m07-inst-06, com as etapas do ciclo mensal em sequência — e, sobre cada etapa, uma marca de risco do lado do consumidor. A etapa selecionada abre abaixo com o que entra, o que sai e o risco que ela cria.
- **Eixo x:** dias do ciclo mensal, a partir do fim do mês de consumo
- **Eixo y:** duas trilhas: as etapas do ciclo e o risco associado a cada uma
- **Séries:** as etapas do ciclo mensal · risco por etapa
- **Relação que a figura tem de mostrar:** O próprio intro declara a relação com o M07: mesma régua, outra pergunta. Portar duas réguas diferentes para o mesmo ciclo seria contradizer a fonte; portar a mesma régua com uma trilha a mais é o que ela pede.
- **Derivação:** literal quanto à referência ao M07 e aos rótulos de etapa (array ET)
- **Reúso:** Reaproveita a figura do m07-inst-06.
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada. Não há resposta de referência (ref/tol) em nenhum dos 11.

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Condição a encontrar: aponte a etapa em que o consumidor ainda pode agir e a primeira em que ele já não pode.

**Avisos.**

- **Nota da fonte:** Instrumento sem número calculado; o texto é qualitativo.

**Estado no código (informativo, não é camada fonte).** {"estado":"não portado","calculators":"nenhuma chave m09-inst-* em alexandria-instrument-calculators.ts","aula_instruments":"aula-09-08.instruments = []","recursos_do_modulo":"RecursosDoModulo.tsx: 'm

### m09-inst-11 · Localizador de dado de mercado

**Identidade.** INST·11 · {"secao":"a08","marcador":"Aula 08","aula":"aula-09-08","aula_nota":null,"subsecao_anterior":{"numero":"08.3","texto":"A transição até 2028, e como acompanhá-la sem depender de intermediário","linha_aprox":1710},"bloco_antes":{"tipo":"instrumento_ref","rotulo":"INST·10","trecho_inicial":"INST·10","linha_aprox":1729},"bloco_depois":{"tipo":"destaque","rotulo":"Onde isso entra no produto","trecho_inicial":"Onde isso entra no produto","linha_aprox":1760},"linhas_markup":[1744,1758]} · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Qual série pública responde qual pergunta, com que defasagem ela sai e como citá-la sem errar o recorte. Selecione a pergunta que você precisa responder.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| ld-grid | Pergunta a responder | — | — | — | — | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| ld-out | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Localizador de dado de mercado" — localiza
- **Sem promessa, mas (C6):** Mesma régua de defasagem proposta para o m07-inst-03 e o m07-inst-09. Três instrumentos, uma figura.
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada. Não há resposta de referência (ref/tol) em nenhum dos 11.

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Condição a encontrar: escolher a pergunta cuja série sai com maior defasagem e dizer o que ela impede de afirmar.

**Avisos.**

- **Nota da fonte:** Instrumento sem número calculado; o texto é qualitativo.

**Estado no código (informativo, não é camada fonte).** {"estado":"não portado","calculators":"nenhuma chave m09-inst-* em alexandria-instrument-calculators.ts","aula_instruments":"aula-09-08.instruments = []","recursos_do_modulo":"RecursosDoModulo.tsx: 'm


## M10

### m10-inst-01 · Mapa da fatura — três lentes sobre a mesma estrutura

**Identidade.** Inst · 01 · O mapa da fatura · tipo: —

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Escolha uma lente e depois uma linha da fatura. A lente muda a pergunta feita a todas as catorze linhas simultaneamente; a linha detalha a resposta. Uma fatura real pode agregar ou desdobrar essas famílias conforme o leiaute da distribuidora — o que não muda é a natureza de cada componente.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| mf-seg | Lente ativa | — | segmentado (seleção única) | unit | — | Quem define o valor unitário / Quem define a quantidade / Em que ciclo muda |
| mf-grid | Linha da fatura | — | grade de chips gerada pelo script | — | — | Consumo de energia — ponta / Consumo de energia — fora de ponta / Uso do sistema — parcela sobre energia / Uso do sistema — parcela sobre demanda / Demanda faturada / Demanda de ultrapassagem / Energi |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| mf-lens | paineis | — | alvo de texto | — |
| mf-line | paineis | — | alvo de texto | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Mapa da fatura — três lentes sobre a mesma estrutura" — "Mapa" e "a mesma estrutura"
  - intro: "A lente muda a pergunta feita a todas as catorze linhas simultaneamente"
  - a fonte não desenha: dois painéis de texto
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** As catorze linhas da fatura empilhadas numa única coluna, sempre as mesmas e sempre na mesma ordem, recoloridas de uma vez conforme a lente ativa: quem define o valor unitário, quem define a quantidade, em que ciclo muda. A linha escolhida abre o painel de detalhe sem tirar as outras treze da tela.
- **Eixo x:** a lente ativa (três estados)
- **Eixo y:** as catorze linhas da fatura, na ordem declarada pela fonte (consumo ponta, consumo fora de ponta, uso do sistema sobre energia, uso do sistema sobre demanda, demanda faturada, demanda de ultrapassagem, energia reativa excedente, demanda reativa excedente, adicional…)
- **Séries:** as catorze linhas · a classificação de cada linha na lente ativa
- **Relação que a figura tem de mostrar:** A palavra do intro é "simultaneamente": a lente reclassifica as catorze de uma vez. Se o learner só vê a linha que clicou, a reclassificação simultânea — que é o instrumento inteiro — não acontece na tela.
- **Derivação:** literal quanto aos rótulos das linhas e aos três rótulos de lente; a forma de coluna recolorida vem de "a todas as catorze linhas simultaneamente"
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância de resposta declarada pela fonte. Os limiares de faixa são lógica de classificação, não tolerância de correção.

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Condição a encontrar: com a lente "Em que ciclo muda", aponte a única linha cujo valor pode mudar fora do ciclo tarifário.

**Avisos.**

- **Fonte dos números:** {"nota":"Instrumento de consulta; sem número de entrada. As afirmações por linha citam o mecanismo, não uma fonte externa específica por item.","frases_literais":[{"texto":"A nomenclatura de cada linha varia por distribuidora; a legenda da própria fatura é a fonte de tradução.","origem":{"seletor":"p","trecho_inicial":"Instrumento didático. A nomenclatura de cada linha varia por","linha_aprox":605
- **Content QA (P20):** A fonte declara que "uma fatura real pode agregar ou desdobrar essas famílias conforme o leiaute da distribuidora". O aviso é parte do bloco (S4).

**Estado no código (informativo, não é camada fonte).** {"id_codigo":"m10-inst-01","presente":true,"divergencias":[{"tema":"entrada mf-grid","detalhe":"grade de chips (sem seleção inicial) virou select «mf-linha» com rótulo «Linha da fatura» e padrão «te-p

### m10-inst-02 · Comparador de modalidades — diferença estrutural por linha

**Identidade.** Inst · 02 · {"numero":2,"id_codigo":"aula-10-02"} · tipo: —

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Escolha um perfil de carga e uma modalidade. O instrumento devolve, para cada linha da fatura, em que direção o resultado mudaria em relação à situação atual, o que ainda falta saber para concluir, e a elegibilidade do subgrupo. Ele não devolve valor de economia — e essa é uma decisão de projeto, não uma limitação: sem”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| cm-perf | Perfil de carga | — | segmentado (seleção única) | plana | — | Plana em turnos / Diurna com pico na tarde / Desligada na ponta / Errática com picos / Sazonal de safra |
| cm-mod | Modalidade avaliada | — | segmentado (seleção única) | azul | — | Horária Azul / Horária Verde / Convencional Binômia |
| cm-sg | Subgrupo da unidade | — | segmentado (seleção única) | a4 | — | A4 · 2,3 a 25 kV / A3a · 30 a 44 kV / A3 · 69 kV / A2 · 88 a 138 kV |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| cm-vd | veredito | — | alvo de texto | — |
| cm-out | cartoes | — | alvo de texto | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Comparador de modalidades — diferença estrutural por linha" — "Comparador" e "por linha"
  - intro: "O instrumento devolve, para cada linha da fatura, em que direção o resultado mudaria"
  - a fonte não desenha: veredito e cartões de texto
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** As linhas da fatura em coluna e, ao lado de cada uma, a direção da mudança em relação à situação atual — sobe, desce, indiferente, ou falta saber — representada por posição e silhueta, nunca por cor de certo e errado (S2). A elegibilidade do subgrupo entra como porta: modalidade não elegível apaga a comparação inteira em vez de mostrá-la.
- **Eixo x:** direção da mudança, com um estado explícito para "ainda falta saber para concluir"
- **Eixo y:** as linhas da fatura
- **Séries:** direção por linha · o que falta saber por linha · estado de elegibilidade do subgrupo
- **Relação que a figura tem de mostrar:** A modalidade não muda a fatura por um fator único: ela mexe em algumas linhas para cima e noutras para baixo, e em algumas não dá para dizer sem mais dado. Por isso o quarto estado — "falta saber" — precisa ser tão visível quanto os outros três; sem ele a figura mente por omissão.
- **Derivação:** literal quanto aos cinco perfis, três modalidades, quatro subgrupos e à tabela de elegibilidade (ELEG, que coincide com a tabela 02.1 do módulo)
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância de resposta declarada pela fonte. Os limiares de faixa são lógica de classificação, não tolerância de correção.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Unidade em A4 com carga plana em turnos, avaliando a modalidade Horária Azul: ela é elegível, e em que direção a linha de demanda mudaria?
- **Cenário-padrão:** {"cm-perf":"plana","cm-mod":"azul","cm-sg":"a4"}
- **Resposta no cenário-padrão:** Elegível ao subgrupo A4; o veredito do cenário-padrão é da classe "ok" e descreve a carga plana em turnos contínuos

**Avisos.**

- **Fonte dos números:** {"nota":"A elegibilidade (ELEG) coincide com a tabela 02.1, cuja nota de fonte é literal abaixo. As células CEL não citam fonte.","frases_literais":[{"texto":"Fonte: ANEEL, página oficial de Modalidades Tarifárias, e Resolução Normativa nº 1.000/2021, art.","origem":{"seletor":"span","trecho_inicial":"Fonte: ANEEL, página oficial de Modalidades Tarifárias, e Re","linha_aprox":918}},{"texto":"A pág

**Estado no código (informativo, não é camada fonte).** {"id_codigo":"m10-inst-02","presente":true,"divergencias":[],"kind_codigo":"comparador","aula_no_codigo":"aula-10-02","titulo_igual":true,"nota_igual_intro_mais_aviso":true,"campos":[],"saidas":[],"da

### m10-inst-03 · Dimensionador de demanda — faixas de diagnóstico

**Identidade.** Inst · 03 · {"numero":3,"id_codigo":"aula-10-03"} · tipo: —

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Informe o contrato vigente, a maior demanda medida na série e a demanda média do período. O instrumento devolve a utilização do contrato, a folga em relação ao limite de tolerância e um diagnóstico por faixa — incluindo a faixa em que a resposta correta é que não é possível concluir sem o plano de produção. Todos os pa”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| dd-ctr | Demanda contratada | kW | número + deslizador gêmeo | 1200 | — | — |
| dd-max | Maior demanda medida na série | kW | número + deslizador gêmeo | 1010 | — | — |
| dd-med | Demanda média do período | kW | número + deslizador gêmeo | 720 | — | — |
| dd-mes | Meses de histórico disponíveis | meses | número + deslizador gêmeo | 12 | — | — |
| dd-tol | Tolerância de ultrapassagem | % | número + deslizador gêmeo | 5 | — | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| dd-util | Utilização do contrato | % (script) | — | — |
| dd-fc | Fator de carga aparente | % (script) | — | — |
| dd-lim | Limite antes de ultrapassar | kW (script) | — | — |
| dd-folga | Folga até o limite | kW (script) | — | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Dimensionador de demanda — faixas de diagnóstico" — "faixas" está no título
  - a fonte não desenha: quatro readouts; as faixas existem só como array FAIXA no script
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** Uma régua horizontal de utilização do contrato, com as faixas de diagnóstico do array FAIXA sombreadas e nomeadas ao longo dela — inclusive a faixa de subutilização, que o intro cita expressamente — e três marcas sobre a mesma régua: a maior demanda medida, a demanda média e o limite de disparo.
- **Eixo x:** utilização do contrato, em % — e, na mesma régua, kW, porque contrato, medida, média e limite são todos kW
- **Eixo y:** não há; é uma régua de uma linha
- **Séries:** faixas de diagnóstico · demanda contratada · maior demanda medida · demanda média · limite antes de ultrapassar = contratada × (1 + tolerância)
- **Relação que a figura tem de mostrar:** Folga e ultrapassagem são a mesma distância medida para lados opostos do limite. Numa régua única, "250 kW de folga" deixa de ser um número e vira um comprimento — e a subutilização passa a ser tão visível quanto o risco de estouro.
- **Derivação:** derivado do código-fonte (o array FAIXA de diagnóstico e o cálculo de utilização, fator de carga, limite e folga são verbatim, linhas 3831–3857)
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância de resposta declarada pela fonte. Os limiares de faixa são lógica de classificação, não tolerância de correção.
- **Por que não pedir:** A "tolerância de ultrapassagem" aqui é parâmetro do contrato de energia, não margem de acerto de resposta. São coisas diferentes com o mesmo nome — não confundir (P6).

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Contrato de 1.200 kW, maior demanda medida de 1.010 kW, demanda média de 720 kW, 12 meses de histórico e tolerância de ultrapassagem de 5%: qual a utilização do contrato e qual a folga até o limite?
- **Cenário-padrão:** {"dd-ctr":1200,"dd-max":1010,"dd-med":720,"dd-mes":12,"dd-tol":5}
- **Resposta no cenário-padrão:** Utilização de 84,2 %; fator de carga aparente 71,3 %; limite antes de ultrapassar 1.260 kW; folga 250 kW

**Avisos.**

- **Fonte dos números:** {"nota":"Contrato 1.200 kW, medida 1.010 kW, média 720 kW e 12 meses são valores iniciais sem fonte declarada. A tolerância de 5% é declarada como referência geral, a confirmar. Os limites das faixas (60/80/95/105) não têm fonte declarada.","frases_literais":[{"texto":"A tolerância vem preenchida com o valor de referência geral para demanda contratada de consumo do grupo A e deve ser confirmada no

**Estado no código (informativo, não é camada fonte).** {"id_codigo":"m10-inst-03","presente":true,"divergencias":[{"tema":"nota (intro + aviso)","fonte":"Informe o contrato vigente, a maior demanda medida na série e a demanda média do período. O instrumen

### m10-inst-04 · Simulador de ultrapassagem — todos os parâmetros editáveis

**Identidade.** Inst · 04 · {"numero":3,"id_codigo":"aula-10-03"} · tipo: —

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Este instrumento existe para tornar visível a não linearidade da penalidade. Varie a demanda medida em torno do limite e observe o salto no momento em que o gatilho dispara. Tolerância, multiplicador e tarifa são entradas editáveis: preencha com os valores do contrato e do ato homologatório da concessionária da unidade”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| ul-ctr | Demanda contratada | kW | número + deslizador gêmeo | 1000 | — | — |
| ul-med | Demanda medida no ciclo | kW | número + deslizador gêmeo | 1060 | — | — |
| ul-tol | Tolerância aplicável | % | número + deslizador gêmeo | 5 | — | — |
| ul-mul | Multiplicador da tarifa | vezes | número + deslizador gêmeo | 2 | — | — |
| ul-tar | Tarifa de demanda da sua fatura | unidades por kW | número + deslizador gêmeo | 40 | — | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| ul-lim | Limite de disparo | kW (script) | — | — |
| ul-base | Base da ultrapassagem | kW (script) | — | — |
| ul-norm | Parcela de demanda normal | — | — | — |
| ul-pen | Parcela de ultrapassagem | — | — | — |
| ul-peso | Peso da penalidade no total | % (script) | — | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho — e a promessa é a mais literal possível: a fonte diz que o instrumento existe para tornar algo visível, e nada é desenhado
  - intro literal: "Este instrumento existe para tornar visível a não linearidade da penalidade. Varie a demanda medida em torno do limite e observe o salto no momento em que o gatilho dispara."
  - a fonte não desenha: cinco readouts de texto
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** O valor faturado de demanda contra a demanda medida, varrendo uma faixa em torno do limite: uma reta até o limite de disparo e, a partir dele, uma segunda inclinação multiplicada. A quebra tem de estar na figura, com a vertical do limite marcada e o ponto da demanda medida atual sobre a curva.
- **Eixo x:** demanda medida no ciclo, em kW, varrida em torno do limite de disparo
- **Eixo y:** valor faturado de demanda, em unidades monetárias genéricas (a fonte declara a tarifa como genérica)
- **Séries:** parcela de demanda normal · parcela de ultrapassagem · total faturado · vertical do limite de disparo = contratada × (1 + tolerância) · ponto da demanda medida atual
- **Relação que a figura tem de mostrar:** A penalidade não é proporcional ao excesso: ela é proporcional ao excesso multiplicado. Um quilowatt a mais do lado errado do limite custa o múltiplo, e um quilowatt a menos não custa nada — é um degrau, não uma rampa. Nenhum readout faz um degrau aparecer; só a curva faz.
- **Derivação:** derivado do código-fonte (limite, base da ultrapassagem, parcela normal, parcela de ultrapassagem e peso são verbatim, linhas 3914–3935)
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância de resposta declarada pela fonte. Os limiares de faixa são lógica de classificação, não tolerância de correção.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Contrato de 1.000 kW, demanda medida de 1.060 kW, tolerância de 5%, multiplicador de 2 vezes e tarifa de demanda de 40 unidades por kW: quanto pesa a parcela de ultrapassagem no total?
- **Cenário-padrão:** {"ul-ctr":1000,"ul-med":1060,"ul-tol":5,"ul-mul":2,"ul-tar":40}
- **Resposta no cenário-padrão:** 10,7 % do total (limite de disparo 1.050 kW; base da ultrapassagem 60 kW; parcela normal 40.000; parcela de ultrapassagem 4.800)

**Avisos.**

- **Fonte dos números:** {"nota":"A tarifa 40 é declarada genérica (unidades monetárias genéricas). O multiplicador 2 é declarado como valor inicial conforme a leitura da REN 1.000/2021, art. 301, com divergência ativa registrada pela própria fonte. Contrato 1.000 / medida 1.060 coincidem com o exemplo do texto 03.3 (\"mil quilowatts com medição de mil e sessenta\"). Os cortes 2% e 15% da escolha de faixa não têm fonte.",
- **Content QA (P20):** A fonte declara a tarifa 40 como genérica e não declara procedência para o multiplicador. Exibir como cenário, não como regra vigente (P19/P20).

**Estado no código (informativo, não é camada fonte).** {"id_codigo":"m10-inst-04","presente":true,"divergencias":[{"tema":"unidade das saídas","detalhe":"Todas as saídas no código têm unit: null; na fonte a unidade/sufixo vem da expressão (ex.: $id('ul-li

### m10-inst-05 · Deslocador de carga entre postos — volume, nunca dinheiro

**Identidade.** Inst · 05 · {"numero":4,"id_codigo":"aula-10-04"} · tipo: —

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Informe o consumo total do ciclo, quanto dele está no posto de ponta e qual fração desse consumo de ponta é tecnicamente deslocável. O instrumento devolve a participação da ponta antes e depois, o volume deslocado e o diagnóstico de qual classe de esforço o resultado exigiria. Não devolve valor economizado: esse número”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| dl-tot | Consumo total do ciclo | MWh | número + deslizador gêmeo | 420 | — | — |
| dl-pta | Consumo no posto de ponta | MWh | número + deslizador gêmeo | 42 | — | — |
| dl-des | Fração da ponta tecnicamente deslocável | % | número + deslizador gêmeo | 30 | — | — |
| dl-hrs | Horas de ponta faturadas no ciclo | horas | número + deslizador gêmeo | 63 | — | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| dl-p0 | Participação da ponta hoje | % (script) | — | — |
| dl-p1 | Participação após deslocar | % (script) | — | — |
| dl-vol | Volume deslocado | MWh (script) | — | — |
| dl-pot | Potência média em ponta | kW (script) | — | — |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Deslocador de carga entre postos — volume, nunca dinheiro" — nomeia a operação e o que ela recusa devolver
- **Sem promessa, mas (C6):** Antes e depois da participação da ponta são duas alturas do mesmo consumo total. Uma barra única com o segmento de ponta desenhado duas vezes — situação atual e situação após deslocar — mostra o efeito sem introduzir dinheiro, que é justamente o que o título proíbe.
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância de resposta declarada pela fonte. Os limiares de faixa são lógica de classificação, não tolerância de correção.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Consumo de 420 MWh no ciclo, 42 MWh no posto de ponta, 30% da ponta tecnicamente deslocável e 63 horas de ponta faturadas: qual a participação da ponta depois de deslocar?
- **Cenário-padrão:** {"dl-tot":420,"dl-pta":42,"dl-des":30,"dl-hrs":63}
- **Resposta no cenário-padrão:** 7,0 % (era 10,0 %); volume deslocado 12,6 MWh; potência média em ponta 667 kW

**Avisos.**

- **Fonte dos números:** {"nota":"Horas de ponta 63 = três horas × vinte e um dias úteis, declarado no aviso. Consumo 420 / ponta 42 / 30% deslocável sem fonte. Cortes das faixas (4/10/18%) sem fonte.","frases_literais":[{"texto":"As horas de ponta faturadas dependem do número de dias úteis do ciclo de leitura e dos feriados nacionais aplicáveis; o valor inicial supõe três horas diárias em vinte e um dias úteis e deve ser
- **Content QA (P20):** A fonte declara que 63 horas = três horas × vinte e um dias úteis.

**Estado no código (informativo, não é camada fonte).** {"id_codigo":"m10-inst-05","presente":true,"divergencias":[{"tema":"nota (intro + aviso)","fonte":"Informe o consumo total do ciclo, quanto dele está no posto de ponta e qual fração desse consumo de p

### m10-inst-06 · Apurador de excedente reativo — limites e janelas editáveis

**Identidade.** Inst · 06 · {"numero":5,"id_codigo":"aula-10-05"} · tipo: —

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Informe o fator de potência típico observado em cada uma das duas janelas, quantos intervalos horários violaram a referência em cada uma, e o limite aplicável. O instrumento devolve a proporção de intervalos em violação, a classificação entre estrutural e pontual, e o que ainda falta para transformar o achado em projet”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| fp-ref | Fator de potência de referência | adimensional | número + deslizador gêmeo | 0.92 | — | — |
| fp-ind | Fator típico na janela diurna — indutivo | adimensional | número + deslizador gêmeo | 0.87 | — | — |
| fp-cap | Fator típico na janela noturna — capacitivo | adimensional | número + deslizador gêmeo | 0.95 | — | — |
| fp-vd1 | Intervalos em violação — janela diurna | horas no ciclo | número + deslizador gêmeo | 180 | — | — |
| fp-vn1 | Intervalos em violação — janela noturna | horas no ciclo | número + deslizador gêmeo | 0 | — | — |
| fp-hrs | Duração da janela noturna de apuração | horas por dia | número + deslizador gêmeo | 6 | — | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| fp-pd | Violação na janela diurna | % (script) | — | — |
| fp-pn | Violação na janela noturna | % (script) | — | — |
| fp-dd | Distância da referência — diurna | — | — | — |
| fp-dn | Distância da referência — noturna | — | — | — |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Apurador de excedente reativo — limites e janelas editáveis" — nomeia a apuração e os parâmetros
- **Sem promessa, mas (C6):** As duas janelas têm referências de sinal oposto — indutivo de dia, capacitivo de noite. Uma régua de fator de potência com a referência no meio e as duas janelas marcadas em lados opostos dela mostra por que o mesmo 0,92 vale para os dois e por que a distância é negativa numa e positiva na outra.
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância de resposta declarada pela fonte. Os limiares de faixa são lógica de classificação, não tolerância de correção.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Referência de 0,92, fator típico de 0,87 na janela diurna com 180 intervalos em violação, 0,95 na noturna com nenhum, e janela noturna de 6 horas por dia: qual a proporção de intervalos em violação na janela diurna?
- **Cenário-padrão:** {"fp-ref":0.92,"fp-ind":0.87,"fp-cap":0.95,"fp-vd1":180,"fp-vn1":0,"fp-hrs":6}
- **Resposta no cenário-padrão:** 33,3 % na janela diurna e 0,0 % na noturna; distância da referência de −0,050 na diurna e +0,030 na noturna

**Avisos.**

- **Fonte dos números:** {"nota":"Referência 0,92 declarada com artigo (REN 1.000/2021, art. 302). Janela noturna de 6 h declarada na prosa da Aula 05 (período de seis horas consecutivas entre 23h30 e 6h30). O ciclo de 30 dias é suposição declarada no aviso. O corte de 25% (estrutural × pontual) não tem fonte.","frases_literais":[{"texto":"Fator de potência de referência de 0,92 para o grupo A: art.","origem":{"seletor":"
- **Procedência declarada:** A fonte declara a referência 0,92 com artigo (REN 1.000/2021, art. 302).

**Estado no código (informativo, não é camada fonte).** {"id_codigo":"m10-inst-06","presente":true,"divergencias":[{"tema":"unidade das saídas","detalhe":"Todas as saídas no código têm unit: null; na fonte a unidade/sufixo vem da expressão (ex.: $id('fp-pd

### m10-inst-07 · Anatomia dos encargos — quem financia, quem paga, o que mudou

**Identidade.** Inst · 07 · {"numero":6,"id_codigo":"aula-10-06"} · tipo: —

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Onze itens da linha de encargos e obrigações setoriais. Para cada um, quatro campos fixos: o que financia, quem paga, como aparece na fatura, e o que mudou ou pode mudar por norma recente. Campo fixo permite leitura lateral — comparar o mesmo campo entre itens ensina mais do que ler um item inteiro.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| en-grid | Item | — | grade de chips gerada pelo script | — | — | Conta de desenvolvimento energético / Encargo de serviços do sistema / Encargo de energia de reserva / Programa de incentivo a fontes alternativas / Obrigação de pesquisa e desenvolvimento / Obrigação |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| en-panel | paineis | — | alvo de texto | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - intro literal: "Campo fixo permite leitura lateral — comparar o mesmo campo entre itens" — a fonte nomeia a forma e a justifica
  - a fonte não desenha: um painel por item
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** A matriz dos onze itens de encargo nas linhas e dos quatro campos fixos nas colunas — o que financia, quem paga, como aparece na fatura, o que mudou ou pode mudar por norma recente — com o item selecionado expandido e os outros dez legíveis.
- **Eixo x:** os quatro campos fixos
- **Eixo y:** os onze itens de encargo e obrigação setorial
- **Séries:** as 44 células
- **Relação que a figura tem de mostrar:** A leitura lateral é o que a fonte declara ser o ponto. Na coluna "quem paga", por exemplo, a repetição atravessa os onze itens e é a repetição que ensina — item por item, ela some.
- **Derivação:** literal (o intro nomeia "leitura lateral" e os quatro campos; os onze rótulos são texto da fonte)
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância de resposta declarada pela fonte. Os limiares de faixa são lógica de classificação, não tolerância de correção.

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Comparação: percorrer a coluna "quem paga" nos onze e apontar o único item cuja resposta difere do padrão.

**Avisos.**

- **Fonte dos números:** {"nota":"Os textos citam as normas dentro de cada item (Lei nº 15.269/2025, Lei nº 15.235/2025, REN ANEEL nº 1.147/2025, § 19 do art. 13 da Lei nº 10.438/2002). Data de verificação: 1º de agosto de 2026.","frases_literais":[{"texto":"Data de consulta das verificações normativas deste módulo: 1º de agosto de 2026.","origem":{"seletor":"p","trecho_inicial":"Este módulo trata simultaneamente de númer

**Estado no código (informativo, não é camada fonte).** {"id_codigo":"m10-inst-07","presente":true,"divergencias":[{"tema":"entrada en-grid","detalhe":"grade de chips (sem seleção inicial) virou select «en-sel» com rótulo «Item de encargo» e padrão «cde»; 

### m10-inst-08 · Régua do ciclo tarifário — do processo à linha da fatura

**Identidade.** Inst · 08 · {"numero":8,"id_codigo":"aula-10-08"} · tipo: —

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Oito etapas, do início do processo tarifário até o efeito na fatura da unidade. Para cada uma: o que acontece, quem decide, o que pode surpreender o consumidor industrial naquela etapa, e o que o analista deve arquivar. Marque as etapas já verificadas para a concessionária que estiver analisando.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| rc-grid | — | — | grade de chips gerada pelo script | — | — | Abertura do processo / Apuração de custos / Definição da estrutura / Deliberação e homologação / Aplicação na fatura / Camada mensal de bandeira / Mudança por lei fora do ciclo / Reconciliação e decom |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| rc-cnt | Etapas verificadas | — | — | — |
| rc-est | Situação do dossiê | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Régua do ciclo tarifário — do processo à linha da fatura" — "Régua" e um percurso com destino declarado
  - a fonte não desenha: dois readouts e um painel
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** As oito etapas numa régua em sequência, da abertura do processo até o efeito na fatura, cada etapa com o estado de verificação do dossiê marcado; a seta final aponta explicitamente para a linha da fatura que a etapa afeta, porque é esse trajeto que o subtítulo promete.
- **Eixo x:** as oito etapas em ordem: Abertura do processo, Apuração de custos, Definição da estrutura, Deliberação e homologação, Aplicação na fatura, Camada mensal de bandeira, Mudança por lei fora do ciclo, Reconciliação e decomposição
- **Eixo y:** duas trilhas: a etapa e o estado de verificação
- **Séries:** as oito etapas · etapas verificadas · situação do dossiê
- **Relação que a figura tem de mostrar:** Duas das oito etapas — a camada mensal de bandeira e a mudança por lei fora do ciclo — não estão na sequência do processo tarifário: elas entram por fora. A régua tem de mostrar isso graficamente, ou o learner sai achando que tudo que muda a fatura passou pelo ciclo.
- **Derivação:** literal quanto aos oito rótulos de etapa (array ET)
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância de resposta declarada pela fonte. Os limiares de faixa são lógica de classificação, não tolerância de correção.

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Dossiê: marcar as etapas verificadas e sair com a lista do que falta arquivar.

**Avisos.**

- **Fonte dos números:** {"nota":"Sem número de entrada. O limiar de estados (0/4/8) não tem fonte.","frases_literais":[{"texto":"A cadência da revisão periódica é definida no contrato de concessão de cada distribuidora e varia; confirme no contrato e no calendário de processos tarifários publicado pela agência reguladora.","origem":{"seletor":"p","trecho_inicial":"Instrumento didático. A cadência da revisão periódica é d
- **Content QA (P20):** A fonte declara que o limiar de estados (0 / 4 / 8) não tem fonte.

**Estado no código (informativo, não é camada fonte).** {"id_codigo":"m10-inst-08","presente":true,"divergencias":[{"tema":"entrada rc-grid","detalhe":"grade de chips (sem seleção inicial) virou select «rc-sel» com rótulo «Etapa em foco» e padrão «e1»; a f

### m10-inst-09 · Reconstrutor de fatura — estime antes de ver

**Identidade.** Inst · 09 · {"numero":8,"id_codigo":"aula-10-08"} · tipo: —

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Distribua cem pontos entre os seis blocos de uma fatura industrial cativa típica do grupo A. Depois informe a composição real da sua fatura nos mesmos seis blocos. O instrumento devolve o erro por bloco, a direção do viés e o diagnóstico do padrão — não uma nota. O objetivo é que o analista descubra a própria distorção”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| rb-e1 | Sua estimativa — energia | % do total | número + deslizador gêmeo | 30 | — | — |
| rb-e2 | Sua estimativa — uso da rede | % do total | número + deslizador gêmeo | 25 | — | — |
| rb-e3 | Sua estimativa — demanda | % do total | número + deslizador gêmeo | 15 | — | — |
| rb-e4 | Sua estimativa — encargos | % do total | número + deslizador gêmeo | 10 | — | — |
| rb-e5 | Sua estimativa — tributos | % do total | número + deslizador gêmeo | 18 | — | — |
| rb-e6 | Sua estimativa — reativo, bandeira e outros | % do total | número + deslizador gêmeo | 2 | — | — |
| rb-r1 | Real — energia | % do total | número + deslizador gêmeo | 26 | — | — |
| rb-r2 | Real — uso da rede | % do total | número + deslizador gêmeo | 22 | — | — |
| rb-r3 | Real — demanda | % do total | número + deslizador gêmeo | 21 | — | — |
| rb-r4 | Real — encargos | % do total | número + deslizador gêmeo | 9 | — | — |
| rb-r5 | Real — tributos | % do total | número + deslizador gêmeo | 19 | — | — |
| rb-r6 | Real — reativo, bandeira e outros | % do total | número + deslizador gêmeo | 3 | — | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| rb-se | Soma da estimativa | % (script) | — | — |
| rb-sr | Soma do real | % (script) | — | — |
| rb-err | Erro absoluto total | p.p. (script) | — | — |
| rb-maior | Maior desvio | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Reconstrutor de fatura — estime antes de ver"
  - intro: "Distribua cem pontos entre os seis blocos […] O instrumento devolve o erro por bloco, a direção do viés e o diagnóstico"
  - a fonte não desenha: quatro readouts e cartões de texto
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** Duas barras empilhadas de cem pontos lado a lado — a estimativa e o real — com os seis blocos nas mesmas cores; abaixo, uma barra de erro por bloco divergindo de um eixo central, que é o que torna a direção do viés legível. Se e quando houver tolerância declarada, ela entra como banda em torno do zero; enquanto não houver, o eixo central fica sem banda.
- **Eixo x:** na barra de erro, desvio em pontos percentuais, negativo à esquerda e positivo à direita
- **Eixo y:** os seis blocos: energia, uso da rede, demanda, encargos, tributos, reativo e bandeira e outros
- **Séries:** estimativa (soma 100%) · real (soma 100%) · erro por bloco · erro absoluto total · maior desvio
- **Relação que a figura tem de mostrar:** O erro absoluto total não diz nada sobre o viés: dá para errar 16 pontos percentuais espalhados ou concentrados num bloco só. A barra divergente separa magnitude de direção — e é a direção que o diagnóstico da fonte lê ("viés de subestimação da demanda").
- **Derivação:** derivado do código-fonte (soma, erro absoluto, maior desvio e o array DIAG são verbatim, linhas 4370 em diante)
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância de resposta declarada pela fonte. Os limiares de faixa são lógica de classificação, não tolerância de correção.
- **Revisão técnica pedida ao Founder:** Este é o gêmeo exato do m08-inst-04, que declara 3 pontos percentuais por bloco. Aqui a fonte não declara nada e o instrumento mesmo assim emite diagnóstico. Pedido ao Founder: fixar (ou recusar) uma tolerância por bloco. Enquanto não houver, o instrumento não pode dizer "dentro" nem "fora" — oferece a autoavaliação em três níveis de C7 sobre a leitura do viés.

**Previsão (C3).**

- **Útil:** sim. O instrumento já é de previsão por construção — "estime antes de ver" está no título.
- **Pergunta (camada Alexandria):** Distribua cem pontos entre energia, uso da rede, demanda, encargos, tributos e reativo/bandeira/outros numa fatura industrial cativa típica do grupo A.
- **Cenário-padrão:** {"rb-e1":30,"rb-e2":25,"rb-e3":15,"rb-e4":10,"rb-e5":18,"rb-e6":2,"rb-r1":26,"rb-r2":22,"rb-r3":21,"rb-r4":9,"rb-r5":19,"rb-r6":3}
- **Resposta no cenário-padrão:** No cenário-padrão da fonte, estimativa 30/25/15/10/18/2 contra real 26/22/21/9/19/3: erro absoluto total de 16 p.p., maior desvio em Demanda (−6 p.p.), diagnóstico "viés de subestimação da demanda"

**Avisos.**

- **Fonte dos números:** {"nota":"Os valores iniciais (estimativa 30/25/15/10/18/2; real 26/22/21/9/19/3) são declarados como não típicos e sem fonte. Os cortes 6 p.p., 12 e 28 p.p. e 2 p.p. (somas) não têm fonte.","frases_literais":[{"texto":"A composição real varia enormemente por concessionária, subgrupo, modalidade, fator de carga e estado — não existe composição típica nacional, e os valores iniciais servem apenas pa
- **Content QA (P20):** A fonte declara que os valores iniciais (estimativa e real) são declarados como cenário, não como fatura medida.

**Estado no código (informativo, não é camada fonte).** {"id_codigo":"m10-inst-09","presente":true,"divergencias":[{"tema":"saída rb-maior","detalhe":"ausente no código (rótulo da fonte: «Maior desvio»)"},{"tema":"unidade das saídas","detalhe":"Todas as sa

### m10-inst-10 · Ordem de leitura cronometrada — o instrumento assinatura

**Identidade.** Inst · 10 · {"numero":9,"id_codigo":"aula-10-09"} · tipo: —

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Percorra os nove passos na ordem. Marque cada um conforme executa. Para cada passo, o instrumento mostra o que olhar, o critério de parada, o achado que torna os demais irrelevantes e o que registrar. O contador acompanha o progresso e o painel indica em que estado a análise está.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| ol-grid | — | — | grade de chips gerada pelo script | — | — | Cadastro / Período / Demanda / Reativo / Distribuição por posto / Bandeira e ajustes / Reconciliação de uma linha / Tributos / Inventário do que falta |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| ol-cnt | Passos executados | — | — | — |
| ol-tempo | Tempo acumulado estimado | min (script) | — | — |
| ol-est | Estado da leitura | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Ordem de leitura cronometrada — o instrumento assinatura" — "cronometrada"
  - a fonte declara os tempos por passo: 20/15/40/20/30/25/60/30/40 segundos, soma 280 s
  - a fonte não desenha: três readouts e um painel
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** Uma barra de tempo de zero a 280 segundos dividida em nove segmentos com o comprimento de cada passo declarado pela fonte, preenchendo-se conforme o learner marca cada um. O passo 07 — reconciliação de uma linha, 60 segundos — é visivelmente o maior, e isso é conteúdo.
- **Eixo x:** segundos acumulados, 0 a 280
- **Eixo y:** uma faixa única, com os nove passos como segmentos
- **Séries:** os nove passos (Cadastro, Período, Demanda, Reativo, Distribuição por posto, Bandeira e ajustes, Reconciliação de uma linha, Tributos, Inventário do que falta) · passos executados · tempo acumulado
- **Relação que a figura tem de mostrar:** Os nove passos não custam o mesmo. Uma lista de nove itens sugere nove esforços iguais; a barra proporcional mostra que um terço do tempo está num passo só — e é esse passo que o learner tende a pular.
- **Derivação:** literal (os nove rótulos e os nove tempos, com a soma de 280 s, são declarados na fonte)
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância de resposta declarada pela fonte. Os limiares de faixa são lógica de classificação, não tolerância de correção.

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Percurso cronometrado: executar os nove na ordem sobre uma fatura real e sair com o inventário do que falta.

**Avisos.**

- **Fonte dos números:** {"nota":"Os tempos por passo (20/15/40/20/30/25/60/30/40 s, soma 280 s) são declarados orientativos. O envelope de cinco minutos vem do critério de domínio (§00.3).","frases_literais":[{"texto":"Os tempos são orientativos e supõem fatura em formato legível e legenda disponível.","origem":{"seletor":"p","trecho_inicial":"Instrumento didático. Os tempos são orientativos e supõem fa","linha_aprox":25
- **Divergência (P5/P8):** Registrado no README do M10: o tempo dos três primeiros passos aparece como "menos de um minuto", "um minuto e meio" e 75 s. P8/P5: as leituras ficam preservadas, e a barra usa os tempos do array, declarando-o.

**Estado no código (informativo, não é camada fonte).** {"id_codigo":"m10-inst-10","presente":true,"divergencias":[{"tema":"entrada ol-grid","detalhe":"grade de chips (sem seleção inicial) virou select «ol-sel» com rótulo «Passo em foco» e padrão «p1»; a f

### m10-inst-11 · Roteador de diagnóstico — três classes de veredito

**Identidade.** Inst · 11 · {"numero":9,"id_codigo":"aula-10-09"} · tipo: —

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Informe o que você tem em mãos e o que observou. O roteador devolve um de três vereditos — vale investigar, não vale nas condições informadas, ou não é possível concluir com o que foi informado — mais a lista específica do que falta. Percorra a varredura completa: a terceira saída é a mais frequente, e isso é caracterí”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| rt-hist | Histórico disponível | — | segmentado (seleção única) | uma | — | Uma fatura / Seis meses / Doze meses ou mais |
| rt-mm | Memória de massa por intervalo | — | segmentado (seleção única) | nao | — | Indisponível / Parcial / Disponível |
| rt-plano | Plano de produção declarado | — | segmentado (seleção única) | nao | — | Não informado / Estável, sem expansão / Mudança prevista |
| rt-ach | Achado observado na leitura | — | segmentado (seleção única) | enq | — | Enquadramento suspeito / Demanda descolada / Excedente reativo presente / Volume compatível com ambiente livre / Nada fora do esperado |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| rt-vd | veredito | — | alvo de texto | — |
| rt-out | cartoes | — | alvo de texto | — |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Roteador de diagnóstico — três classes de veredito" — nomeia as classes, não uma forma
- **Sem promessa, mas (C6):** As quatro entradas pontuam e os cortes decidem a classe. Quatro segmentos somando numa régua com os dois cortes marcados mostrariam por que uma resposta a mais muda o veredito — mas a própria fonte declara que a pontuação e os cortes não têm fonte, então a régua precisaria vir rotulada como mecânica do instrumento, não como critério do setor.
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância de resposta declarada pela fonte. Os limiares de faixa são lógica de classificação, não tolerância de correção.

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Diagnóstico com lacuna declarada: informar o que se tem e sair com a lista do que falta.

**Avisos.**

- **Fonte dos números:** {"nota":"A pontuação (3/1, 3/1, 2/1) e os cortes (≥6, ≤1) não têm fonte declarada.","frases_literais":null}
- **Divergência (P5/P8):** Registrado no README do M10: a árvore do Inst·11 foi reescrita no código, com títulos inventados e um campo rt-score que não existe na fonte. Portar a fonte, não o código.
- **Nota C5:** Oferece nativamente o "não é possível concluir" que C5 exige. Serve de referência de forma.

**Estado no código (informativo, não é camada fonte).** {"id_codigo":"m10-inst-11","presente":true,"divergencias":[{"tema":"nota (intro + aviso)","fonte":"Informe o que você tem em mãos e o que observou. O roteador devolve um de três vereditos — vale inves


## M11

### m11-inst-01 · Mapa da proposta — quatro lentes sobre a mesma estrutura

**Identidade.** Inst · 01 · — · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Escolha a lente e depois o item da proposta. A lente determina a pergunta; o item determina a resposta. Nenhuma célula está vazia, e nenhuma resposta contém valor de economia ou prazo de retorno — por construção.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| mp-seg | Lente ativa | — | — | eixo | — | A que eixo pertence / Qual fonte independente confirma / O que o comprador confirma sozinho / O que falta se estiver ausente |
| mp-grid | — | — | — | — | — | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| mp-lens | — | — | — | — |
| mp-item | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Mapa da proposta — quatro lentes sobre a mesma estrutura" — "Mapa"
  - intro: "Nenhuma célula está vazia, e nenhuma resposta contém valor de economia ou prazo de retorno — por construção"
  - a fonte não desenha: dois painéis de texto
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** Os itens da proposta numa coluna fixa, recoloridos pela lente ativa — a que eixo pertence, qual fonte independente confirma, o que o comprador confirma sozinho, o que falta se estiver ausente — com o item escolhido abrindo o painel sem tirar os outros da tela. Mesma forma do m10-inst-01.
- **Eixo x:** a lente ativa (quatro estados)
- **Eixo y:** os itens da proposta
- **Séries:** os itens · a classificação na lente ativa
- **Relação que a figura tem de mostrar:** Quatro lentes sobre a mesma lista significa que a lista não muda e a pergunta sim. Só uma coluna estável recolorida mostra isso; painéis sucessivos mostram quatro listas diferentes.
- **Derivação:** literal quanto aos quatro rótulos de lente e aos itens
- **Reúso:** Mesma figura do m10-inst-01 e do m13-inst-01. Uma só implementação serve aos três.
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada. Os limiares dos ramos (ex.: dev>30, delta<=0.1, gap>1.5) são classificação do veredito, não tolerância de resposta.

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Condição a encontrar: com a lente "o que falta se estiver ausente", apontar o item cuja ausência sozinha invalida a proposta.

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","problemas":["p.srcnote não portado"],"aula_codigo":"módulo (MODULO_11_INSTRUMENTOS)","aula_fonte":"módulo (§MAP)","aula_igual":true,"campos":[{"id_codigo":"mp-lente","id_fonte"

### m11-inst-02 · Separador de eixos — a que categoria pertence cada afirmação

**Identidade.** Inst · 02 · — · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Escolha uma afirmação típica de proposta comercial. O instrumento devolve a que eixo ela pertence, qual método de verificação ela admite, e — crucialmente — qual tipo de conclusão ela não autoriza. Doze afirmações, todas colhidas do padrão de linguagem corrente em material comercial do setor.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| se-grid | — | — | — | — | — | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| se-out | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Separador de eixos — a que categoria pertence cada afirmação" — "Separador" e "categoria"
  - intro: "Doze afirmações, todas colhidas…" e a saída declara o eixo, o método de verificação e o que a afirmação não autoriza
  - a fonte não desenha: um painel por afirmação
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** As doze afirmações separadas em colunas pelos eixos que a fonte nomeia — físico, regulatório, financeiro — com a afirmação escolhida destacada na sua coluna e o painel abaixo trazendo método de verificação e o que ela não autoriza. Separar é o verbo do título; a figura tem de separar.
- **Eixo x:** os eixos da fonte (o painel do cenário-padrão abre com "Eixo 1 — físico")
- **Eixo y:** as doze afirmações, distribuídas nas colunas
- **Séries:** as doze afirmações por eixo · o que cada uma não autoriza
- **Relação que a figura tem de mostrar:** Uma proposta comercial mistura os eixos numa frase só, e o erro de avaliação é tratar uma afirmação física como se fosse financeira. Ver as doze já separadas é o treino; ler uma por vez não treina a separação, porque a separação já vem feita na resposta.
- **Derivação:** literal quanto aos doze rótulos de afirmação e ao nome dos eixos
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada. Os limiares dos ramos (ex.: dev>30, delta<=0.1, gap>1.5) são classificação do veredito, não tolerância de resposta.

**Previsão (C3).**

- **Útil:** sim. O ato natural é classificar antes de conferir — é o que o instrumento devolve.
- **Pergunta (camada Alexandria):** A afirmação "Gera 1.750 kWh por kWp ao ano" pertence a qual eixo, e que tipo de conclusão ela não autoriza?
- **Cenário-padrão:** {"se-grid":{"data-a":"a1","rotulo":"Gera 1.750 kWh por kWp ao ano","on":true}}
- **Resposta no cenário-padrão:** Eixo 1 — físico (o restante do painel está no registro da extração)

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","problemas":["rótulos/opções de campo não literais: se-a","p.inst-intro não portado no instrumento (note null)"],"aula_codigo":"aula-11-01","aula_fonte":"aula-11-01","aula_igual

### m11-inst-03 · Régua do marco regulatório — sete marcos com data, efeito e estado

**Identidade.** Inst · 03 · — · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Percorra a cadeia normativa marco a marco. Cada painel carrega os quatro campos obrigatórios: qual instrumento, desde quando, o que efetivamente mudou, e qual o estado de regulamentação. Repare que os dois últimos marcos não têm data de vigência no passado — eles são compromissos com prazo.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| rg-nav | — | — | — | — | — | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| rg-panel | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Régua do marco regulatório — sete marcos com data, efeito e estado" — "Régua" e "data"
  - intro: "Repare que os dois últimos marcos não têm data" — a fonte declara a ausência
  - a fonte não desenha: navegação e painel
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** Um eixo de tempo com os cinco marcos datados posicionados pela data real e, separada do eixo por uma quebra explícita, uma faixa de "sem data declarada" com os dois últimos. Os dois não vão para o fim do eixo nem para hoje: eles saem do eixo, porque a fonte declara que não têm data.
- **Eixo x:** tempo, a partir de 2012 (o primeiro marco é a resolução normativa de 17 de abril de 2012)
- **Eixo y:** uma faixa no eixo, mais uma faixa fora dele para os marcos sem data
- **Séries:** os cinco marcos datados · os dois marcos sem data declarada · estado de regulamentação por marco
- **Relação que a figura tem de mostrar:** É o caso mais limpo de ausência honesta do currículo inteiro (S4): a fonte diz que dois marcos não têm data e o instrumento inteiro é uma régua de datas. Pôr os dois no fim do eixo inventaria uma data; tirá-los esconderia o marco. A quebra declarada é a única saída.
- **Derivação:** literal (a data do primeiro marco e a frase sobre os dois últimos são texto da fonte)
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada. Os limiares dos ramos (ex.: dev>30, delta<=0.1, gap>1.5) são classificação do veredito, não tolerância de resposta.

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Condição a encontrar: apontar o marco cujo estado de regulamentação ainda impede a aplicação do efeito que ele declara.

**Avisos.**

- **Divergência (P5/P8):** Registrado no README do M11: Portaria Inmetro 140 aparece como 2022 e como 2021. P8: as duas leituras ficam preservadas.

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","problemas":["rótulos/opções de campo não literais: rg-m","p.inst-intro não portado no instrumento (note null)","p.srcnote não portado"],"aula_codigo":"aula-11-02","aula_fonte":

### m11-inst-04 · Classificador de porte e modalidade — produto cartesiano completo

**Identidade.** Inst · 04 · — · tipo: simulador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Combine potência instalada em corrente alternada, fonte, e arranjo de titularidade descrito na proposta. O instrumento devolve a classificação de porte, a modalidade regulatória correspondente e o documento que a proposta precisa apresentar para provar o enquadramento. Nenhuma combinação devolve valor de economia, e ne”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| cl-pot | Potência instalada em corrente alternada | kW | — | 180 | 1 – 6000 / passo 1 | — |
| cl-fonte | Fonte e armazenamento | — | — | solar | — | Solar sem baterias / Solar com baterias qualificadas / Outra fonte despachável |
| cl-arr | Arranjo de titularidade descrito na proposta | — | — | local | — | Gera e consome na mesma unidade / Outras unidades, mesmo titular / Titulares distintos em associação / Mesma propriedade, área comum |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| cl-porte | Classificação de porte | — | — | `porte` |
| cl-teto | Teto de porte aplicável | MW (script) | — | `tetoTx` |
| cl-mod | Modalidade regulatória | — | — | `m.n` |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Classificador de porte e modalidade — produto cartesiano completo" — "produto cartesiano completo"
  - a fonte não desenha: três readouts de texto e veredito
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** Duas coisas na mesma prancha: uma régua de potência instalada em corrente alternada, de 1 kW ao teto máximo, com os limiares de porte marcados e a potência informada como marca sobre ela; e a grade fonte × arranjo de titularidade com a célula ativa destacada, porque é o cruzamento das duas que decide a modalidade.
- **Eixo x:** potência instalada em kW, escala logarítmica ou quebrada — a faixa vai de 1 a 6.000 kW e os limiares de porte estão concentrados na parte baixa
- **Eixo y:** na grade, as três fontes e os quatro arranjos de titularidade
- **Séries:** régua de potência com os limiares de porte · marca da potência informada · grade fonte × arranjo · documento exigido pela célula ativa
- **Relação que a figura tem de mostrar:** Porte e modalidade não são o mesmo eixo: a potência define o porte, o arranjo define a modalidade, e o documento exigido sai do cruzamento. Duas figuras separadas na mesma prancha é o que torna essa independência legível.
- **Derivação:** literal quanto às opções de fonte e de arranjo e à faixa 1–6.000 kW; derivado quanto à forma
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada. Os limiares dos ramos (ex.: dev>30, delta<=0.1, gap>1.5) são classificação do veredito, não tolerância de resposta.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** 180 kW em corrente alternada, solar sem baterias, gerando e consumindo na mesma unidade: qual a classificação de porte, qual o teto aplicável e qual a modalidade regulatória?
- **Cenário-padrão:** {"cl-pot":180,"cl-fonte":"solar","cl-arr":"local"}
- **Resposta no cenário-padrão:** Minigeração distribuída; teto de porte aplicável "3 MW — fonte não despachável"; modalidade conforme o painel do cenário-padrão

**Avisos.**

- **Divergência (P5/P8):** Registrado no README do M11: teto da fotovoltaica com bateria aparece como 3 MW e como 5 MW; e com 1.000 kW exatos o instrumento cai ora no ramo de 2,5%, ora no de 5%. P8/P5: as duas leituras ficam preservadas e o limite de borda precisa de decisão antes do porte.

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","problemas":["rótulos/opções de campo não literais: cl-fonte, cl-arr","saídas de texto da fonte (cl-porte, cl-teto, cl-mod) sem slot em outputs; vão no veredito com rótulo compo

### m11-inst-05 · Roteador de regime — data de protocolo determina tudo

**Identidade.** Inst · 05 · — · tipo: simulador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Informe a data de protocolo do pedido de acesso, o porte, a fonte, a modalidade e a concentração de participação no excedente. O instrumento devolve a classe de faturamento aplicável, o percentual do ano corrente e o estado da regra futura. Os três campos obrigatórios — qual norma, desde quando, e se está regulamentada”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| rr-ano | Ano de referência da leitura | ano | — | 2026 | 2023 – 2032 / passo 1 | — |
| rr-data | Data de protocolo do pedido de acesso | — | — | ate2022 | — | Até 7 de janeiro de 2022 / 8 jan 2022 a 7 jan 2023 / 8 jan 2023 a 7 jul 2023 / Após 7 de julho de 2023 |
| rr-porte | Porte e fonte | — | — | micro | — | Microgeração, até 75 kW / Minigeração até 500 kW / Minigeração acima de 500 kW, não despachável |
| rr-mod | Modalidade e concentração do excedente | — | — | localemuc | — | Autoconsumo local ou empreendimento com múltiplas unidades / Remoto ou compartilhado, maior titular abaixo de 25% / Remoto ou compartilhado, maior titular com 25% ou mais |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| rr-classe | Classe de faturamento | — | — | `classe` |
| rr-perc | Componentes de distribuição sobre a energia compensada | % (script) | — | `perc` |
| rr-estado | Estado da regra no ano informado | — | — | `estado` |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Roteador de regime — data de protocolo determina tudo" — a data é o eixo e o título diz que ela determina tudo
  - intro: "o percentual do ano corrente e o estado da regra futura"
  - a fonte não desenha: três readouts de texto
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** Uma escada de percentual ao longo dos anos de referência, uma trajetória por classe de faturamento, com o ano escolhido marcado por uma vertical e o ponto da classe aplicável destacado sobre ela. As quatro janelas de data de protocolo entram como faixas que selecionam qual trajetória vale.
- **Eixo x:** ano de referência da leitura, de 2023 a 2032
- **Eixo y:** componentes de distribuição sobre a energia compensada, em %
- **Séries:** trajetória por classe de faturamento · faixas das quatro janelas de protocolo · vertical do ano escolhido · estado da regra no ano informado
- **Relação que a figura tem de mostrar:** A data de protocolo escolhe a trajetória inteira, e não o percentual de um ano. O learner que só vê o percentual do ano corrente não enxerga que dois vizinhos com protocolos separados por uma semana seguem escadas diferentes pela década toda — que é o que o título afirma.
- **Derivação:** literal quanto às quatro janelas de protocolo, às três classes de porte e ao intervalo 2023–2032
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada. Os limiares dos ramos (ex.: dev>30, delta<=0.1, gap>1.5) são classificação do veredito, não tolerância de resposta.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Pedido de acesso protocolado até 7 de janeiro de 2022, microgeração até 75 kW em autoconsumo local, lido no ano de 2026: qual a classe de faturamento e qual percentual se aplica?
- **Cenário-padrão:** {"rr-ano":2026,"rr-data":"ate2022","rr-porte":"micro","rr-mod":"localemuc"}
- **Resposta no cenário-padrão:** Classe "GD I — direito adquirido"; o percentual e o estado da regra estão no registro da extração

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","problemas":["rótulos/opções de campo não literais: rr-porte, rr-mod","saídas de texto da fonte (rr-classe, rr-perc, rr-estado) sem slot em outputs; vão no veredito com rótulo c

### m11-inst-06 · Verificador de geração estimada — desvio contra referência independente

**Identidade.** Inst · 06 · — · tipo: calculadora

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Preencha com os dados da proposta e com a irradiação da localidade específica, consultada na base nacional. A irradiação é entrada editável e não constante cravada, porque varia por município: o valor de uma cidade não serve para outra a duzentos quilômetros. A saída é o desvio entre a geração declarada e a geração de ”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| gv-pot | Potência instalada declarada | kWp | — | 100 | 1 – 3000 / passo 1 | — |
| gv-ger | Geração anual declarada na proposta | MWh/ano | — | 175 | 1 – 6000 / passo 1 | — |
| gv-irr | Irradiação da localidade, plano dos módulos | kWh/m²·dia | — | 5.2 | 2 – 7.5 / passo 0.05 | — |
| gv-pr | Desempenho global de referência adotado na conferência | % | — | 78 | 50 – 92 / passo 1 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| gv-ref | Geração de referência reconstruída | MWh/ano (script) | — | `fmt(refMWh,1)+' MWh/ano'` |
| gv-dev | Desvio da declarada sobre a referência | % (script) | — | `(dev>=0?'+':'')+fmt(dev,1)+'%'` |
| gv-prim | Desempenho global implícito na proposta | % (script) | — | `fmt(prImp,1)+'%'` |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Verificador de geração estimada — desvio contra referência independente" — desvio entre dois valores é uma distância
  - a fonte não desenha: três readouts de texto
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** Duas colunas na mesma escala — geração declarada na proposta e geração de referência reconstruída a partir da irradiação da localidade — com a diferença entre os topos marcada e rotulada como o desvio. Ao lado, uma segunda leitura: o desempenho global implícito na proposta contra o adotado na conferência, na mesma forma.
- **Eixo x:** as duas grandezas comparadas
- **Eixo y:** MWh/ano na primeira leitura; % na segunda
- **Séries:** geração declarada · geração de referência · desvio · desempenho global implícito × adotado
- **Relação que a figura tem de mostrar:** O desvio da geração e o desempenho implícito são a mesma informação vista de dois lados: uma proposta que promete mais energia com a mesma irradiação está, implicitamente, prometendo um desempenho global que ela não declarou. As duas leituras lado a lado tornam a implicação visível.
- **Derivação:** derivado do código-fonte (refMWh, dev e prImp são verbatim, linhas 3473–3535)
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada. Os limiares dos ramos (ex.: dev>30, delta<=0.1, gap>1.5) são classificação do veredito, não tolerância de resposta.
- **Revisão técnica pedida ao Founder:** O veredito classifica o desvio em faixas (o cenário-padrão cai em "faixa de desvio material"), e os limiares não têm procedência declarada. Pedido ao Founder: fixar a faixa de desvio aceitável entre geração declarada e geração reconstruída, com fonte. Enquanto não houver, o instrumento descreve o desvio e não emite aprovação nem reprovação.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Proposta de 100 kWp declarando 175 MWh/ano, com irradiação local de 5,2 kWh/m²·dia no plano dos módulos e desempenho global de referência de 78%: qual o desvio da declarada sobre a referência?
- **Cenário-padrão:** {"gv-pot":100,"gv-ger":175,"gv-irr":5.2,"gv-pr":78}
- **Resposta no cenário-padrão:** +18,2 % (geração de referência 148,0 MWh/ano; desempenho global implícito na proposta 92,2 %)

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","problemas":["formatação exibida diverge da fonte em 4003/4500 saídas (painel usa até 2 casas, sem sinal)","classe do veredito (ok/att/per) descartada no código (`void cls`)","p

### m11-inst-07 · Verificador de degradação declarada — planilha contra garantia do fabricante

**Identidade.** Inst · 07 · — · tipo: calculadora

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Compare a taxa de degradação usada na projeção com a taxa máxima garantida no termo de garantia de performance do módulo especificado. As duas são entradas editáveis: a primeira vem da proposta, a segunda vem do datasheet. O instrumento devolve a divergência e a produção relativa no fim do horizonte sob cada uma das du”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| dg-prop | Degradação anual usada na proposta | %/ano | — | 0.4 | 0 – 2 / passo 0.05 | — |
| dg-ds | Degradação máxima garantida no datasheet | %/ano | — | 0.55 | 0 – 2 / passo 0.05 | — |
| dg-y1 | Perda declarada no primeiro ano | % | — | 2 | 0 – 5 / passo 0.1 | — |
| dg-hz | Horizonte da projeção da proposta | anos | — | 25 | 5 – 30 / passo 1 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| dg-p1 | Produção final sob a premissa da proposta | % (script) | — | `fmt(A.fin*100,1)+'%'` |
| dg-p2 | Produção final sob a garantia do fabricante | % (script) | — | `fmt(B.fin*100,1)+'%'` |
| dg-gap | Energia acumulada a menos no horizonte | % (script) | — | `(gap>=0?'':'')+fmt(gap,1)+'%'` |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Verificador de degradação declarada — planilha contra garantia do fabricante" — "contra" é comparação de duas trajetórias
  - intro: "a diferença, composta ao longo de 25 anos, acumula…" — a fonte fala em acumulação ao longo do horizonte
  - a fonte não desenha: três readouts de texto
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** Duas curvas de produção relativa ao longo do horizonte, partindo do mesmo primeiro ano: uma sob a premissa da proposta e outra sob a taxa máxima garantida no datasheet. A área entre as duas é a energia acumulada a menos — o readout que a fonte devolve — e precisa estar sombreada, porque é ela o resultado.
- **Eixo x:** anos da projeção, do ano 1 ao horizonte declarado
- **Eixo y:** produção relativa, em % da produção inicial
- **Séries:** curva sob a premissa da proposta · curva sob a garantia do fabricante · área entre as duas = energia acumulada a menos · perda declarada no primeiro ano, comum às duas
- **Relação que a figura tem de mostrar:** Uma diferença de 0,15 ponto percentual ao ano parece desprezível como número e vira 1,8% de energia ao fim de 25 anos. Só a área entre duas curvas transforma uma diferença de inclinação em uma quantidade — e é a quantidade que decide.
- **Derivação:** derivado do código-fonte (A.fin, B.fin e gap são verbatim, linhas 3536–3605)
- **Reúso:** Mesma figura do m11-inst-08 (duas trajetórias compostas e a área entre elas). Uma implementação, dois instrumentos.
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada. Os limiares dos ramos (ex.: dev>30, delta<=0.1, gap>1.5) são classificação do veredito, não tolerância de resposta.
- **Revisão técnica pedida ao Founder:** A faixa de atenção do veredito é acionada por uma divergência de 0,15 ponto percentual ao ano sem procedência declarada. Pedido ao Founder: fixar, com fonte, a divergência aceitável entre taxa de projeção e taxa garantida.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Proposta que usa 0,4%/ano de degradação contra datasheet que garante no máximo 0,55%/ano, com 2% de perda no primeiro ano e horizonte de 25 anos: quanta energia acumulada a menos a garantia assegura, em %?
- **Cenário-padrão:** {"dg-prop":0.4,"dg-ds":0.55,"dg-y1":2,"dg-hz":25}
- **Resposta no cenário-padrão:** 1,8 % (produção final sob a premissa da proposta 89,0 %; sob a garantia do fabricante 85,9 %)

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","problemas":["formatação exibida diverge da fonte em 1706/1980 saídas (painel usa até 2 casas, sem sinal)","classe do veredito (ok/att/per) descartada no código (`void cls`)","p

### m11-inst-08 · Verificador de trajetória tarifária — premissa contra ancoragem histórica

**Identidade.** Inst · 08 · — · tipo: calculadora

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Informe a taxa anual de crescimento da tarifa assumida na proposta e a referência histórica da concessionária específica, obtida dos atos homologatórios de reajuste. As duas são entradas editáveis; nenhuma é constante cravada, porque trajetória tarifária varia por área de concessão. A saída é o afastamento entre premis”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| tt-prop | Reajuste anual assumido na proposta | %/ano | — | 9 | 0 – 20 / passo 0.25 | — |
| tt-hist | Média histórica homologada da concessionária | %/ano | — | 6 | 0 – 20 / passo 0.25 | — |
| tt-hz | Horizonte da projeção | anos | — | 20 | 5 – 30 / passo 1 | — |
| tt-anc | O que a proposta declara sobre a premissa | — | — | fonte | — | Declara a taxa e a fonte da ancoragem / Declara a taxa, sem dizer de onde veio / Não declara a taxa; ela está embutida |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| tt-gap | Afastamento anual da ancoragem | p.p. (script) | — | `(gap>=0?'+':'')+fmt(gap,2)+' p.p.'` |
| tt-i1 | Índice final sob a premissa da proposta | — | — | `fmt(ip*100,0)` |
| tt-exc | Excesso acumulado sobre a ancoragem | % (script) | — | `(exc>=0?'+':'')+fmt(exc,1)+'%'` |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Verificador de trajetória tarifária — premissa contra ancoragem histórica" — "trajetória" e "contra"
  - a fonte não desenha: três readouts de texto
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** Duas curvas de índice ao longo do horizonte, partindo de 100: uma sob o reajuste assumido na proposta e outra sob a média histórica homologada da concessionária. A área entre elas é o excesso acumulado, e o afastamento anual é a diferença de inclinação.
- **Eixo x:** anos da projeção, de 0 ao horizonte
- **Eixo y:** índice, base 100 no ano zero
- **Séries:** índice sob a premissa da proposta · índice sob a ancoragem histórica · área entre as duas = excesso acumulado · estado da declaração da premissa (declarada com fonte / sem fonte / embutida)
- **Relação que a figura tem de mostrar:** Três pontos percentuais ao ano compostos por vinte anos produzem 74,7% de diferença no índice final. É o mesmo mecanismo do m11-inst-07 com outro conteúdo, e é por isso que a mesma figura serve: a mensagem das duas é que inclinação pequena, composta, vira quantidade grande.
- **Derivação:** derivado do código-fonte (gap, ip e exc são verbatim, linhas 3606–3664)
- **Reúso:** Mesma figura do m11-inst-07.
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada. Os limiares dos ramos (ex.: dev>30, delta<=0.1, gap>1.5) são classificação do veredito, não tolerância de resposta.
- **Revisão técnica pedida ao Founder:** Mesmo pedido do m11-inst-06 e do m11-inst-07: os limiares de faixa do veredito não têm procedência. Tratá-los como um conjunto só na revisão técnica.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Proposta que assume 9%/ano de reajuste contra média histórica homologada de 6%/ano, em horizonte de 20 anos: quanto o índice final da premissa fica acima do índice da ancoragem?
- **Cenário-padrão:** {"tt-prop":9,"tt-hist":6,"tt-hz":20,"tt-anc":"fonte"}
- **Resposta no cenário-padrão:** +74,7 % (afastamento anual +3,00 p.p.; índice final sob a premissa 560)

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","problemas":["formatação exibida diverge da fonte em 1389/1485 saídas (painel usa até 2 casas, sem sinal)","rótulos/opções de campo não literais: tt-anc","classe do veredito (ok

### m11-inst-09 · Anatomia dos oito sinais de alerta — sinal, fonte, conta, pergunta

**Identidade.** Inst · 09 · — · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Os oito sinais canônicos, cada um operacionalizado em quatro campos: o que exatamente caracteriza o sinal, qual fonte independente o confirma, o que o comprador consegue verificar sozinho sem ajuda técnica, e qual é a pergunta específica a levar ao vendedor. Nenhum campo devolve valor de economia. Escolha o sinal.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| sa-grid | — | — | — | — | — | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| sa-out | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Anatomia dos oito sinais de alerta — sinal, fonte, conta, pergunta" — nomeia os quatro campos, não uma forma
- **Sem promessa, mas (C6):** Os quatro campos são fixos para os oito sinais. A mesma matriz proposta no m10-inst-07 serve aqui: oito linhas × quatro campos, com a leitura lateral que o instrumento pede sem declarar.
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada. Os limiares dos ramos (ex.: dev>30, delta<=0.1, gap>1.5) são classificação do veredito, não tolerância de resposta.

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Treino: dado um sinal, dizer o que o comprador consegue verificar sozinho antes de abrir o painel.

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","problemas":["rótulos/opções de campo não literais: sa-s","p.inst-intro não portado no instrumento (note null)","p.srcnote não portado"],"aula_codigo":"aula-11-07","aula_fonte":

### m11-inst-10 · Roteador de veredito — três classes, todas alcançáveis

**Identidade.** Inst · 10 · — · tipo: quebra-cabeca

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Informe o estado de cada um dos três eixos verificáveis e o estado da documentação contratual. O instrumento devolve a classe de veredito, a redação recomendada e o próximo passo. Repare que a insuficiência documental tem precedência sobre qualquer outro estado: não se conclui sobre o que não se leu.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| rv-e1 | Eixo 1 — premissa técnica | — | — | ok | — | Confere com a fonte independente / Desvio material identificado / Falta dado para verificar |
| rv-e2 | Eixo 2 — enquadramento regulatório | — | — | ok | — | Correto para o arranjo descrito / Incompatível com o arranjo / Falta declarar data ou titularidade |
| rv-e3 | Eixo 3 — premissa financeira | — | — | ok | — | Declarada e ancorada / Declarada sem ancoragem / Embutida por omissão |
| rv-e4 | Eixo 4 — documentação contratual | — | — | ok | — | Contrato completo e responde às cinco perguntas / Contrato completo, com lacuna de responsabilidade / Contrato ou anexos não fornecidos |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Roteador de veredito — três classes, todas alcançáveis" — nomeia as classes
- **Sem promessa, mas (C6):** A fonte declara que a insuficiência documental tem precedência sobre os outros eixos. Uma cadeia de quatro portas em que a quarta curto-circuita as três primeiras mostra a precedência sem texto.
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada. Os limiares dos ramos (ex.: dev>30, delta<=0.1, gap>1.5) são classificação do veredito, não tolerância de resposta.

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Diagnóstico: informar o estado dos quatro eixos e sair com a redação recomendada e o próximo passo.

**Avisos.**

- **Nota de extração:** A extração não encontrou readouts para este instrumento: a única saída é o painel de veredito (rv-vd). Registrar como está.
- **Nota C5:** Se "todas alcançáveis" é afirmação da fonte, o porte tem de provar que as três classes são atingíveis nas 81 combinações — é verificação, não desenho.

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","problemas":["rótulos/opções de campo não literais: rv-e2, rv-e3, rv-e4","classe do veredito (ok/att/per) descartada no código (`void cls`)","p.inst-intro não portado no instrum

### m11-inst-11 · Ordem de avaliação em trinta minutos — duas trilhas sincronizadas

**Identidade.** Inst · 11 · — · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Este é o instrumento assinatura do módulo. Percorra os oito passos na ordem. Cada passo declara a trilha, a janela de tempo, o que fazer, a fonte a consultar, e o erro típico que o passo previne. Os pontos de sincronização estão marcados.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| or-nav | — | — | — | — | — | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| or-panel | — | — | — | — |
| or-bars | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — cumprido em parte — a fonte tem barras de tempo, mas as duas trilhas paralelas e os conectores de sincronização são o que o título promete
  - titulo: "Ordem de avaliação em trinta minutos — duas trilhas sincronizadas" — duas trilhas e sincronização
  - intro: "Os pontos de sincronização estão marcados"
  - a fonte desenha em parte: barras de tempo (#or-bars)
- **Desenho na fonte:** barras de tempo (#or-bars); o painel traz "Passo 01 · trilha Técnica · minuto 0 ao 3"
- **O que precisa ser desenhado:** Duas faixas paralelas de trinta minutos — trilha Técnica e trilha Documental — com os oito passos posicionados pelas janelas de minuto que a fonte declara, e conectores verticais ligando as duas faixas exatamente nos pontos de sincronização. O passo atual destacado nas duas.
- **Eixo x:** minutos, de 0 a 30
- **Eixo y:** as duas trilhas, em faixas paralelas
- **Séries:** passos da trilha Técnica · passos da trilha Documental · conectores dos pontos de sincronização · passo atual
- **Relação que a figura tem de mostrar:** Trilhas paralelas com pontos de encontro é uma afirmação sobre método: há trabalho que pode correr em paralelo e momentos em que um lado precisa do outro. Uma lista de oito passos em sequência apaga exatamente essa afirmação.
- **Derivação:** literal quanto às janelas de minuto e aos rótulos de trilha; a forma paralela vem de "duas trilhas sincronizadas" no título
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada. Os limiares dos ramos (ex.: dev>30, delta<=0.1, gap>1.5) são classificação do veredito, não tolerância de resposta.

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Percurso cronometrado com registro: executar os oito passos sobre uma proposta real e sair com a redação do veredito.

**Avisos.**

- **Divergência (P5/P8):** Registrado no README do M11: os pontos de sincronização aparecem como "três" e como dois, e a divisão dos trinta minutos tem três leituras. P8/P5: nenhuma foi escolhida. O desenho precisa da reconciliação antes de fixar os conectores.

**Estado no código (informativo, não é camada fonte).** {"status":"divergente","problemas":["rótulos/opções de campo não literais: or-p","p.inst-intro não portado no instrumento (note null)","p.srcnote não portado"],"aula_codigo":"aula-11-08","aula_fonte":


## M12

### m12-inst-01 · Tabuleiro geopolítico — três vetores sobre cinco frentes

**Identidade.** Inst · 01 · O tabuleiro · tipo: instrumento

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Escolha o vetor e depois a frente. O vetor determina a pergunta; a frente determina a resposta. Quinze combinações, nenhuma célula vazia, nenhuma resposta contendo nome de empresa, de fabricante ou de plataforma de dados estrangeira — por construção, e pela razão explicada na Aula 08.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| tb-seg | Vetor ativo | — | segmentado (botões no markup) | — | — | Capital — quem financia e o que vem junto / Regulação e diplomacia — o que está em vigor / Cadeia de valor — onde o Brasil está posicionado |
| tb-grid | Frente do bloco | — | grade de chips (botões gerados pelo script) | — | — | Protagonismo global / COP30 e ciclo climático / Relações bilaterais / Hidrogênio de baixa emissão / Minerais críticos |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| tb-lens | — | — | — | — |
| tb-item | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Tabuleiro geopolítico — três vetores sobre cinco frentes" — "Tabuleiro" é uma grade, e as dimensões estão declaradas
  - intro: "Quinze combinações, nenhuma célula vazia"
  - a fonte não desenha: dois painéis de texto
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** A grade 3 × 5 inteira: três vetores nas linhas, cinco frentes nas colunas, quinze células preenchidas e visíveis, com a célula ativa aberta abaixo. Um tabuleiro com uma casa por vez não é tabuleiro.
- **Eixo x:** as cinco frentes (Protagonismo global, COP30 e ciclo climático, Relações bilaterais, Hidrogênio de baixa emissão, Minerais críticos)
- **Eixo y:** os três vetores (Capital — quem financia e o que vem junto; Regulação e diplomacia — o que está em vigor; Cadeia de valor — onde o Brasil está posicionado)
- **Séries:** as quinze células · célula ativa
- **Relação que a figura tem de mostrar:** O mesmo país ocupa posições diferentes conforme o vetor: forte numa frente pelo capital e fraco nela pela cadeia de valor. A grade completa é o que impede a leitura de que o Brasil "está bem" ou "está mal" em abstrato.
- **Derivação:** literal quanto aos três vetores, às cinco frentes e à contagem de quinze
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, gabarito nem previsão para nenhum instrumento (P6).

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Condição a encontrar: achar a frente em que os três vetores dão leituras opostas.

**Avisos.**

- **Fonte dos números:** Base das células: Balanço Energético Nacional 2026, ano-base 2025, EPE/MME; Anuário Estatístico Brasileiro do Petróleo, Gás Natural e Biocombustíveis 2026, ANP; Pacote de Belém, decisões da COP30, UNFCCC; Leis nº 14.948/2024, nº 14.990/2024, nº 15.042/2024 e nº 15.269/2025; Projeto de Lei nº 2.780/2024, em tramitação no Senado Federal; Sumário Mineral 2025 da Agência Nacional de Mineração e Minera
- **Nota da fonte:** Literal do p.srcnote do instrumento. Nenhum número aqui foi verificado contra a fonte primária (P19/P20).
- **Procedência declarada:** A fonte declara a base das células: Balanço Energético Nacional 2026, ano-base 2025, EPE/MME, e Anuário Estatístico. Reproduzir a declaração junto do bloco (S4).

**Estado no código (informativo, não é camada fonte).** {"arquivo_dados":"src/lib/data/alexandria-modulo-12-content.ts","arquivo_calculo":"src/lib/data/alexandria-instrument-calculators.ts","id":"m12-inst-01","kind":"explorador","formula":null,"aula":null,

### m12-inst-02 · Separador de grandeza — quanto a eletricidade explica da energia total

**Identidade.** Inst · 02 · 01 · tipo: instrumento

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Os três campos abaixo são entradas editáveis com fonte declarada, não constantes cravadas, porque os três mudam de ano para ano e por metodologia. O instrumento devolve a renovabilidade agregada implícita e a compara com o valor oficial que você mesmo informar. Ele não estima economia, não projeta nada e não devolve va”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| sg-el | Renováveis na matriz elétrica | % | — | 86.8 | 0 – 100 / passo 0.1 | — |
| sg-pe | Peso da eletricidade na energia total | % | — | 19 | 1 – 100 / passo 0.5 | — |
| sg-ne | Renováveis fora da eletricidade | % | — | 41 | 0 – 100 / passo 0.5 | — |
| sg-of | Renováveis na matriz energética, valor oficial | % | — | 50 | 0 – 100 / passo 0.5 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| sg-ag | Renovabilidade agregada implícita | % (script) | — | — |
| sg-di | Distância entre as duas grandezas | p.p. (script) | — | — |
| sg-de | Desvio contra o valor oficial | p.p. (script) | — | — |
| sg-co | Contribuição da eletricidade | p.p. (script) | — | — |
| — | Elétrica | — | — | — |
| — | Energética | — | — | — |
| — | Fora da eletricidade | — | — | — |
| sg-vd | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Separador de grandeza — quanto a eletricidade explica da energia total"
  - a fonte desenha: três barras rotuladas "Elétrica", "Energética", "Fora da eletricidade"
- **Desenho na fonte:** três barras (#sg-bars), rótulos literais Elétrica · Energética · Fora da eletricidade
- **O que precisa ser desenhado:** Três barras na mesma escala de 0 a 100% — renováveis na matriz elétrica, renováveis na matriz energética agregada e renováveis fora da eletricidade — com a distância entre a primeira e a segunda marcada, porque é ela que o readout chama de "distância entre as duas grandezas".
- **Eixo x:** 0 a 100%
- **Eixo y:** as três grandezas
- **Séries:** Elétrica · Energética (implícita) · Fora da eletricidade · marca do valor oficial informado · distância entre elétrica e agregada
- **Relação que a figura tem de mostrar:** Os 86,8% da matriz elétrica e os cerca de 50% da matriz energética não se contradizem: a eletricidade é menos de um quinto da energia total. A figura tem de mostrar as duas alturas e o peso que as liga, ou o learner sai achando que uma das duas está errada.
- **Derivação:** literal quanto aos três rótulos de barra; a fórmula da agregação é verbatim do upd()
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, gabarito nem previsão para nenhum instrumento (P6).
- **Revisão técnica pedida ao Founder:** ATENÇÃO — possível tolerância já declarada e não classificada: o texto do veredito da fonte diz, literalmente, que o resultado é consistente quando "a renovabilidade agregada implícita fica dentro de dois pontos percentuais do valor oficial que você informou". A extração registra tolerancias: null. Pedido ao Founder: decidir se esses dois pontos percentuais são tolerância declarada — e então o veredito "dentro/fora" é legítimo aqui — ou apenas limiar de ramo de texto. Até a decisão, não exibir veredito de aprovação.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Matriz elétrica 86,8% renovável, eletricidade com peso de 19% na energia total e 41% de renováveis fora da eletricidade: qual a renovabilidade agregada implícita?
- **Cenário-padrão:** null
- **Resposta no cenário-padrão:** 49,7 % (distância entre as duas grandezas +37,1 p.p.; desvio contra o valor oficial informado −0,3 p.p.; contribuição da eletricidade 16,5 p.p. dos 49,7 agregados)

**Avisos.**

- **Fonte dos números:** Base: Balanço Energético Nacional 2026, ano-base 2025, EPE/MME, Relatório Síntese, Tabela 1.3.b das séries históricas para a renovabilidade da Oferta Interna de Energia. Consulta em 2 de agosto de 2026.
- **Nota da fonte:** Literal do p.srcnote do instrumento. Nenhum número aqui foi verificado contra a fonte primária (P19/P20).
- **Procedência declarada:** Base declarada: Balanço Energético Nacional 2026, ano-base 2025, EPE/MME, Relatório Síntese.

**Estado no código (informativo, não é camada fonte).** {"arquivo_dados":"src/lib/data/alexandria-modulo-12-content.ts","arquivo_calculo":"src/lib/data/alexandria-instrument-calculators.ts","id":"m12-inst-02","kind":"calculadora","formula":null,"aula":"aul

### m12-inst-03 · Verificador de fonte de número — de onde vem, o que mede, o que verificar

**Identidade.** Inst · 03 · 01 · tipo: instrumento

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Escolha um número que circula sobre o Brasil. O instrumento devolve qual fonte provavelmente o produziu, o que exatamente a grandeza mede, qual o erro típico de citação e o que verificar antes de repetir. Nenhuma célula devolve o número em si como verdade permanente: devolve o caminho até a fonte que o mantém.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| vf-grid | Número em circulação | — | grade de chips (botões gerados pelo script) | — | — | "O Brasil é 88% renovável" / "Maior matriz renovável do G20" / "3,8 milhões de barris por dia" / "Reservas de 17,5 bilhões de barris" / "21 milhões de toneladas de terras-raras" / "Redução de 59% a 67 |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| vf-out | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Verificador de fonte de número — de onde vem, o que mede, o que verificar" — nomeia os campos
  - intro: "Nenhuma célula devolve o número" — a fonte recusa devolver grandeza
- **Sem promessa, mas (C6):** Oito números em circulação × quatro campos fixos é a mesma matriz de leitura lateral já proposta em m10-inst-07 e m11-inst-09. Desenhar grandeza aqui seria contrariar o instrumento, que recusa devolver número de propósito.
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, gabarito nem previsão para nenhum instrumento (P6).

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Treino: dado um número em circulação, dizer a fonte provável e o erro típico de citação antes de abrir os cartões.

**Avisos.**

- **Fonte dos números:** Fontes de referência do instrumento: EPE/MME (Balanço Energético Nacional e Resenha Energética Brasileira); ANP (Anuário Estatístico e boletins mensais de produção); ONS (dados abertos de intercâmbio internacional e geração); ANEEL; Agência Nacional de Mineração (Sumário Mineral); Serviço Geológico dos Estados Unidos (Mineral Commodity Summaries); UNFCCC (registro de Contribuições Nacionalmente De
- **Nota da fonte:** Literal do p.srcnote do instrumento. Nenhum número aqui foi verificado contra a fonte primária (P19/P20).

**Estado no código (informativo, não é camada fonte).** {"arquivo_dados":"src/lib/data/alexandria-modulo-12-content.ts","arquivo_calculo":"src/lib/data/alexandria-instrument-calculators.ts","id":"m12-inst-03","kind":"explorador","formula":null,"aula":"aula

### m12-inst-04 · Régua diplomático-regulatória — o que existe, em que estado, com que prazo

**Identidade.** Inst · 04 · 02 · tipo: instrumento

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Cada marco abaixo tem três campos fixos: o que é, estado na data de verificação e o que ainda falta. A régua existe para tornar impossível citar um marco sem citar o seu estado — que é o erro mais caro deste bloco inteiro. Selecione um marco para ler os três campos.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| rg-grid | — | — | grade de chips (botões gerados pelo script) | — | — | Marco legal do hidrogênio / Programa de crédito fiscal ao hidrogênio / Segunda Contribuição Nacionalmente Determinada / Sistema Brasileiro de Comércio de Emissões / COP30 e Pacote de Belém / Anúncio d |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| rg-panel | — | — | — | — |
| rg-prev | ◀ Anterior | — | — | — |
| rg-next | Próximo ▶ | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Régua diplomático-regulatória — o que existe, em que estado, com que prazo" — "Régua" e "prazo"
  - intro: "A régua existe para tornar impossível citar um marco sem citar o seu estado"
  - a fonte não desenha: painel com anterior/próximo
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** Os doze marcos numa linha do tempo, posicionados pela data que cada um declara, e cada marco pintado pelo seu estado — em vigor, em regulamentação, anunciado, prazo vencido. O estado tem de ser atributo visual do marco, nunca só texto no painel: é literalmente o que o intro pede ao dizer que a régua existe para tornar impossível citar sem o estado.
- **Eixo x:** tempo, a partir de agosto de 2024 (primeiro marco: Lei nº 14.948, de 2 de agosto de 2024)
- **Eixo y:** uma faixa, com os estados codificados por silhueta e rótulo (S2: sem cor de certo e errado)
- **Séries:** os doze marcos · estado de cada um na data de verificação · o que ainda falta, por marco
- **Relação que a figura tem de mostrar:** Citar um marco sem o estado é o erro mais caro do bloco — é a frase da fonte. Uma régua em que o estado é visual torna o erro difícil de cometer; um painel em que o estado é o terceiro parágrafo o torna fácil.
- **Derivação:** literal quanto ao primeiro marco, à contagem de doze e à base declarada (textos integrais no portal do Planalto das Leis nº 14.948/2024 e outras)
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, gabarito nem previsão para nenhum instrumento (P6).

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Condição a encontrar: apontar quantos dos doze marcos estão, na data de verificação, num estado que ainda não produz efeito.

**Avisos.**

- **Fonte dos números:** Base: textos integrais no portal do Planalto das Leis nº 14.948, de 2 de agosto de 2024; nº 14.990, de 27 de setembro de 2024; nº 15.042, de 11 de dezembro de 2024; e nº 15.269, de 2025. Tramitação do Projeto de Lei nº 2.780/2024 nos portais da Câmara dos Deputados e do Senado Federal. Decisões da COP30 e registro de Contribuições Nacionalmente Determinadas na Convenção-Quadro das Nações Unidas so
- **Nota da fonte:** Literal do p.srcnote do instrumento. Nenhum número aqui foi verificado contra a fonte primária (P19/P20).

**Estado no código (informativo, não é camada fonte).** {"arquivo_dados":"src/lib/data/alexandria-modulo-12-content.ts","arquivo_calculo":"src/lib/data/alexandria-instrument-calculators.ts","id":"m12-inst-04","kind":"explorador","formula":null,"aula":"aula

### m12-inst-05 · Comparador de parceiros bilaterais — quatro parceiros, três vetores

**Identidade.** Inst · 05 · 03 · tipo: instrumento

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Doze cruzamentos entre parceiro e vetor. Cada célula devolve o que está em jogo naquele cruzamento, sempre por estrutura e nunca por nome de empresa, de fabricante ou de banco. Note que nenhum parceiro é "melhor" em abstrato: a leitura muda inteiramente conforme o vetor pelo qual se pergunta, e dizer isso é o conteúdo.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| cb-par | Parceiro | — | segmentado (botões no markup) | — | — | China / Estados Unidos / Europa / Arranjo multilateral do BRICS |
| cb-vet | Vetor | — | segmentado (botões no markup) | — | — | Capital / Regulação e diplomacia / Cadeia de valor |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| cb-out | — | — | — | — |
| cb-vd | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Comparador de parceiros bilaterais — quatro parceiros, três vetores" — "Comparador" e as duas dimensões
  - intro: "Doze cruzamentos" e "nenhum parceiro é 'melhor' em abstrato: a leitura muda"
  - a fonte não desenha: cartões e veredito de texto
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** A grade 4 × 3 inteira — quatro parceiros nas linhas, três vetores nas colunas — com o cruzamento ativo aberto abaixo em cartões. Doze células visíveis, porque a afirmação do intro é sobre a variação entre elas.
- **Eixo x:** os três vetores (Capital; Regulação e diplomacia; Cadeia de valor)
- **Eixo y:** os quatro parceiros (China, Estados Unidos, Europa, arranjo multilateral do BRICS)
- **Séries:** as doze células
- **Relação que a figura tem de mostrar:** Nenhum parceiro domina as três colunas. A grade completa é a prova da frase "nenhum parceiro é melhor em abstrato" — e, célula a célula, essa prova não existe.
- **Derivação:** literal quanto aos quatro parceiros, aos três vetores e à contagem de doze
- **Reúso:** Mesma forma do m12-inst-01. Uma grade parametrizável serve aos dois.
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, gabarito nem previsão para nenhum instrumento (P6).

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Comparação: percorrer o vetor "Cadeia de valor" nos quatro parceiros e dizer em qual o Brasil está mais exposto.

**Avisos.**

- **Fonte dos números:** Base: comunicados e atos bilaterais do Ministério das Relações Exteriores e do Ministério de Minas e Energia; documentos oficiais da Convenção-Quadro das Nações Unidas sobre Mudança do Clima; Regulamento (UE) 2023/956; notificação final de ação sob a Seção 301 da Lei de Comércio de 1974 dos Estados Unidos, publicada em 15 de julho de 2026; atos constitutivos do Novo Banco de Desenvolvimento. Consu
- **Nota da fonte:** Literal do p.srcnote do instrumento. Nenhum número aqui foi verificado contra a fonte primária (P19/P20).
- **Content QA (P20):** A fonte declara que nenhuma célula contém nome de empresa, de fabricante ou de banco. Manter a regra no porte (P24 e §3 das decisões de 2026-09-21).

**Estado no código (informativo, não é camada fonte).** {"arquivo_dados":"src/lib/data/alexandria-modulo-12-content.ts","arquivo_calculo":"src/lib/data/alexandria-instrument-calculators.ts","id":"m12-inst-05","kind":"comparador","formula":null,"aula":"aula

### m12-inst-06 · Roteador de instrumento comercial — a base jurídica decide o comportamento

**Identidade.** Inst · 06 · 04 · tipo: instrumento

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Escolha o instrumento e a classe de produto. O instrumento devolve quem tem autoridade, qual o prazo típico, qual o controle judicial aplicável, e qual o tratamento daquela classe de produto sob aquele instrumento. Vinte e quatro combinações. O objetivo é treinar o reflexo de perguntar sob qual dispositivo antes de per”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| rt-inst | Instrumento | — | segmentado (botões no markup) | — | — | Poderes de emergência econômica / Tarifa setorial por segurança nacional / Ação por prática comercial desleal / Tarifa geral temporária de balanço |
| rt-prod | Classe de produto brasileiro | — | segmentado (botões no markup) | — | — | Petróleo e produtos energéticos / Etanol e açúcar / Aço e alumínio / Terras-raras e minerais críticos / Café, carne e suco / Manufaturados diversos |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| rt-aut | Autoridade | — | — | — |
| rt-pra | Prazo típico | — | — | — |
| rt-jud | Controle judicial | — | — | — |
| rt-rev | Reversibilidade | — | — | — |
| rt-vd | — | — | — | — |
| rt-nota | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Roteador de instrumento comercial — a base jurídica decide o comportamento" — roteia
  - intro: "Vinte e quatro combinações"
- **Sem promessa, mas (C6):** As quatro leituras — autoridade, prazo típico, controle judicial, reversibilidade — são fixas para as 24 combinações. A mesma grade de leitura lateral serve; o nome do instrumento, porém, não a promete.
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, gabarito nem previsão para nenhum instrumento (P6).

**Previsão (C3).**

- **Útil:** sim. A saída é categórica e contraintuitiva: instrumentos parecidos têm prazos e controles judiciais completamente diferentes.
- **Pergunta (camada Alexandria):** Poderes de emergência econômica aplicados a petróleo e produtos energéticos: qual a autoridade, qual o prazo típico e qual o controle judicial?
- **Cenário-padrão:** null
- **Resposta no cenário-padrão:** Autoridade: Executivo, por declaração de emergência; prazo típico: indeterminado enquanto durar a emergência; as demais leituras estão no registro da extração

**Avisos.**

- **Fonte dos números:** Base: Lei de Comércio dos Estados Unidos de 1974, Seções 122, 301 e 304; Seção 232 da Lei de Expansão Comercial de 1962; Lei de Poderes Econômicos de Emergência Internacional; decisão da Suprema Corte americana de fevereiro de 2026; notificação final de ação publicada em 15 de julho de 2026 e seus anexos de isenção. Consulta em 2 de agosto de 2026.
- **Nota da fonte:** Literal do p.srcnote do instrumento. Nenhum número aqui foi verificado contra a fonte primária (P19/P20).

**Estado no código (informativo, não é camada fonte).** {"arquivo_dados":"src/lib/data/alexandria-modulo-12-content.ts","arquivo_calculo":"src/lib/data/alexandria-instrument-calculators.ts","id":"m12-inst-06","kind":"quebra-cabeca","formula":null,"aula":"a

### m12-inst-07 · Diagnóstico de prontidão de dado de carbono para exportação

**Identidade.** Inst · 07 · 05 · tipo: instrumento

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Quatro eixos categóricos, oitenta e uma combinações. O instrumento devolve se a posição de carbono de um exportador brasileiro é defensável perante um comprador que precisa comprovar emissão incorporada — e, quando não é, aponta qual eixo bloqueia. Ele não calcula custo, não estima certificado e não projeta preço: a fa”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| pc-fr | Fronteira do inventário declarado | — | segmentado (botões no markup) | — | — | Corporativo — escopos 1 e 2 da organização / Produto, portão a portão / Produto, berço ao portão |
| pc-vr | Verificação do inventário | — | segmentado (botões no markup) | — | — | Nenhuma / Interna, pela própria empresa / Por terceiro acreditado |
| pc-pr | Dado primário de precursor | — | segmentado (botões no markup) | — | — | Não obtido dos fornecedores / Parcial, principais fornecedores / Completo, com cadeia de custódia |
| pc-cd | Preço de carbono doméstico reconhecível | — | segmentado (botões no markup) | — | — | Sem regime operacional no país / Regime em regulamentação / Regime operacional e reconhecido |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| pc-pos | Posição do dado | — | — | — |
| pc-blq | Eixo que bloqueia | — | — | — |
| pc-vpd | Risco de valor padrão | — | — | — |
| pc-des | Desconto de carbono doméstico | — | — | — |
| pc-vd | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Diagnóstico de prontidão de dado de carbono para exportação" — nomeia o diagnóstico
  - intro: "Quatro eixos categóricos, oitenta e uma combinações"
- **Sem promessa, mas (C6):** Os quatro eixos têm peso 0, 1 ou 2 e um deles é o "eixo que bloqueia" — a fonte devolve qual. Quatro segmentos numa régua, com o bloqueante destacado, mostraria por que melhorar o eixo errado não muda o diagnóstico.
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, gabarito nem previsão para nenhum instrumento (P6).

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Inventário corporativo de escopos 1 e 2, sem verificação, sem dado primário de precursor e sem regime de preço de carbono doméstico operacional: qual a posição do dado e qual eixo bloqueia?
- **Cenário-padrão:** null
- **Resposta no cenário-padrão:** Posição "Não atribuível a produto"; eixo que bloqueia: "Fronteira do inventário"; risco de valor padrão: alto

**Avisos.**

- **Fonte dos números:** Base: Regulamento (UE) 2023/956 e atos de execução do mecanismo de ajuste de carbono na fronteira, regime definitivo desde 1º de janeiro de 2026; Lei nº 15.042, de 11 de dezembro de 2024, e o estado da regulamentação infralegal do Sistema Brasileiro de Comércio de Emissões na data de consulta. Consulta em 2 de agosto de 2026.
- **Nota da fonte:** Literal do p.srcnote do instrumento. Nenhum número aqui foi verificado contra a fonte primária (P19/P20).
- **Procedência declarada:** Base declarada: Regulamento (UE) 2023/956 e atos de execução do mecanismo de ajuste de carbono na fronteira.

**Estado no código (informativo, não é camada fonte).** {"arquivo_dados":"src/lib/data/alexandria-modulo-12-content.ts","arquivo_calculo":"src/lib/data/alexandria-instrument-calculators.ts","id":"m12-inst-07","kind":"quebra-cabeca","formula":null,"aula":"a

### m12-inst-08 · Régua de maturidade de projeto anunciado

**Identidade.** Inst · 08 · 06 · tipo: instrumento

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Nove itens de evidência, cada um com três estados: ausente (0), indicativo (1) e vinculante (2). O total vai de 0 a 18 e classifica o estágio real do projeto. A régua não avalia mérito técnico, não estima prazo de entrega e não devolve valor de investimento — devolve apenas a distância entre o que foi anunciado e o que”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| mp-i1 | Contrato de compra de energia | — | segmentado (gerado pelo script dentro de #mp-itens) | — | — | Sem contrato; suprimento apenas indicado em estudo / Memorando ou carta de intenção com fornecedor / Contrato firmado, com preço, prazo e garantia definidos |
| mp-i2 | Comprador contratado | — | segmentado (gerado pelo script dentro de #mp-itens) | — | — | Sem comprador identificado; mercado descrito como "potencial" / Memorando de entendimento ou carta de interesse não vinculante / Contrato de compra vinculante, com volume, prazo e cláusula de rescisão |
| mp-i3 | Financiamento e decisão final de investimento | — | segmentado (gerado pelo script dentro de #mp-itens) | — | — | Sem estrutura de capital definida / Mandato de estruturação, carta de interesse de financiador ou termo indicativo / Capital comprometido e decisão final de investimento tomada |
| mp-i4 | Licenciamento ambiental | — | segmentado (gerado pelo script dentro de #mp-itens) | — | — | Não protocolado / Protocolado ou licença prévia obtida / Licença de instalação obtida |
| mp-i5 | Acesso e conexão à rede | — | segmentado (gerado pelo script dentro de #mp-itens) | — | — | Sem consulta ao acesso / Parecer de acesso solicitado ou emitido / Contrato de uso do sistema assinado |
| mp-i6 | Terreno e direito de uso | — | segmentado (gerado pelo script dentro de #mp-itens) | — | — | Área apenas indicada / Opção de compra, pré-arrendamento ou termo com autoridade portuária / Contrato de aquisição ou arrendamento firmado |
| mp-i7 | Maturidade de engenharia | — | segmentado (gerado pelo script dentro de #mp-itens) | — | — | Estudo conceitual / Engenharia básica ou projeto de referência / Engenharia detalhada com orçamento fechado |
| mp-i8 | Fornecimento de equipamento principal | — | segmentado (gerado pelo script dentro de #mp-itens) | — | — | Sem cotação; tecnologia ainda não escolhida / Cotação recebida ou reserva de posição em fila de fabricação / Pedido firme com prazo de entrega contratado |
| mp-i9 | Habilitação a regime de incentivo | — | segmentado (gerado pelo script dentro de #mp-itens) | — | — | Não habilitado; regra de acesso ainda não existe / Requisitos conhecidos e projeto estruturado para atendê-los / Habilitação ou coabilitação concedida por ato administrativo |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| mp-pts | Pontuação | — | — | — |
| mp-est | Estágio classificado | — | — | — |
| mp-vin | Itens vinculantes | — | — | — |
| mp-blq | Bloqueios críticos | — | — | — |
| mp-vd | — | — | — | — |
| mp-red | — | — | — | — |
| mp-itens | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Régua de maturidade de projeto anunciado" — "Régua"
  - intro: "O total vai de 0 a 18 e classifica o estágio real do projeto" — a fonte declara a escala e as faixas
  - a fonte não desenha: readouts e itens em texto
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** Uma régua de 0 a 18 com as cinco faixas de estágio nomeadas ao longo dela e a pontuação atual como marca; abaixo, os nove itens de evidência em linhas, cada um mostrando o seu estado (ausente 0, indicativo 1, vinculante 2), com os três itens críticos identificados como tais.
- **Eixo x:** pontuação, de 0 a 18, com as cinco faixas de estágio
- **Eixo y:** os nove itens de evidência
- **Séries:** régua de estágio · marca da pontuação · estado dos nove itens · os três itens críticos · bloqueios críticos
- **Relação que a figura tem de mostrar:** Pontuação e bloqueio são independentes: dá para somar pontos nos itens fáceis e continuar travado num dos três críticos. A régua mostra a soma; a lista dos nove mostra onde ela veio. Exibir só a soma esconderia justamente o que a fonte chama de bloqueio crítico.
- **Derivação:** literal quanto aos nove itens, aos três estados por item, à escala 0–18 e às cinco faixas
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, gabarito nem previsão para nenhum instrumento (P6).

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Projeto anunciado em que nenhum dos nove itens de evidência está cumprido: qual a pontuação, qual o estágio classificado e quantos bloqueios críticos existem?
- **Cenário-padrão:** null
- **Resposta no cenário-padrão:** 0 de 18; estágio "Anúncio"; 0 de 9 itens vinculantes; 3 bloqueios críticos

**Avisos.**

- **Fonte dos números:** Base metodológica: separação de estágio adotada em documentos de planejamento e chamada pública do Ministério de Minas e Energia para polos de hidrogênio; classificação de recursos e reservas da Comissão Brasileira de Recursos e Reservas, para a lógica de fatores modificadores. Consulta em 2 de agosto de 2026.
- **Nota da fonte:** Literal do p.srcnote do instrumento. Nenhum número aqui foi verificado contra a fonte primária (P19/P20).
- **Content QA (P20):** A fonte declara a base metodológica como "separação de estágio adotada em documentos de planejamento e chamada pública" — não é norma. E declara que a régua não avalia mérito técnico nem estima prazo.

**Estado no código (informativo, não é camada fonte).** {"arquivo_dados":"src/lib/data/alexandria-modulo-12-content.ts","arquivo_calculo":"src/lib/data/alexandria-instrument-calculators.ts","id":"m12-inst-08","kind":"quebra-cabeca","formula":null,"aula":"a

### m12-inst-09 · Razão reserva-produção — a assimetria medida, não afirmada

**Identidade.** Inst · 09 · 07 · tipo: instrumento

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Quatro entradas editáveis com fonte declarada. O instrumento devolve a participação do país na reserva mundial, a participação na produção mundial, e a razão entre as duas — que é a medida da assimetria entre dotação e cadeia. Todos os valores de referência são editáveis porque todos mudam de ano e de metodologia. Nenh”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| rp-rn | Reserva nacional | Mt | — | 21 | 0.1 – 200 / passo 0.1 | — |
| rp-rm | Reserva mundial | Mt | — | 85 | 1 – 500 / passo 1 | — |
| rp-pn | Produção nacional | kt/ano | — | 0.02 | 0 – 500 / passo 0.01 | — |
| rp-pm | Produção mundial | kt/ano | — | 390 | 1 – 5000 / passo 1 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| rp-pr | Participação na reserva | % (script) | — | — |
| rp-pp | Participação na produção | % (script) | — | — |
| rp-ra | Razão de assimetria | × (script) | — | — |
| rp-an | Anos de reserva ao ritmo atual | — | — | — |
| — | Reserva | — | — | — |
| — | Produção | — | — | — |
| rp-vd | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte, com um defeito de escala que o porte precisa resolver
  - titulo: "Razão reserva-produção — a assimetria medida, não afirmada"
  - a fonte desenha: duas barras rotuladas "Reserva" e "Produção"
- **Desenho na fonte:** duas barras (#rp-bars), rótulos literais Reserva · Produção
- **O que precisa ser desenhado:** As duas participações — na reserva mundial e na produção mundial — na mesma figura. Atenção: no cenário-padrão elas são 24,7% e 0,0051%, quatro ordens de grandeza de diferença. Em escala linear a segunda barra desaparece e a figura passa a afirmar "zero", o que S4 proíbe expressamente ("sem dado — não é zero", e aqui não é zero mesmo). A escala precisa ser logarítmica e declarada como tal, ou a figura principal precisa ser a própria razão.
- **Eixo x:** participação mundial, em % — em escala logarítmica declarada
- **Eixo y:** as duas grandezas (Reserva, Produção)
- **Séries:** participação na reserva · participação na produção · razão de assimetria
- **Relação que a figura tem de mostrar:** A assimetria é medida, não afirmada — é o subtítulo. Uma barra invisível não mede nada; ela afirma. Ou a escala mostra as duas, ou o número que vale é a razão.
- **Derivação:** literal quanto aos dois rótulos de barra e aos valores do cenário-padrão; a exigência de escala é leitura direta desses valores contra o gate S4
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, gabarito nem previsão para nenhum instrumento (P6).

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Reserva nacional de 21 Mt numa reserva mundial de 85 Mt, com produção nacional de 0,02 kt/ano numa produção mundial de 390 kt/ano: quantas vezes a participação na reserva é maior que a participação na produção?
- **Cenário-padrão:** null
- **Resposta no cenário-padrão:** 4.818 × (participação na reserva 24,7 %; na produção 0,0051 %; anos de reserva ao ritmo atual 1.050.000)

**Avisos.**

- **Fonte dos números:** Valores iniciais: reserva nacional e mundial de terras-raras conforme Mineral Commodity Summaries do Serviço Geológico dos Estados Unidos, edição de 2026, ano-base 2025; produção nacional conforme divulgação do Serviço Geológico do Brasil, ano-base 2024; produção mundial conforme a mesma edição do levantamento internacional. Para a metodologia brasileira mais restritiva, substitua a reserva nacion
- **Nota da fonte:** Literal do p.srcnote do instrumento. Nenhum número aqui foi verificado contra a fonte primária (P19/P20).
- **Procedência declarada:** Valores iniciais declarados: reserva nacional e mundial de terras-raras conforme Mineral Commodity Summaries.

**Estado no código (informativo, não é camada fonte).** {"arquivo_dados":"src/lib/data/alexandria-modulo-12-content.ts","arquivo_calculo":"src/lib/data/alexandria-instrument-calculators.ts","id":"m12-inst-09","kind":"calculadora","formula":null,"aula":"aul

### m12-inst-10 · Classificador de nome — em que categoria cai, e o que fazer com ele

**Identidade.** Inst · 10 · 08 · tipo: instrumento

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “O único instrumento autorreferente do módulo: ele não ensina um fato do mundo, ensina a disciplina do próprio ativo. Escolha o tipo de entidade que apareceu em pesquisa. O instrumento devolve a categoria, se pode ser nomeada, onde pode aparecer, e qual é a substituição correta quando não pode.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| cn-grid | Entidade encontrada em pesquisa | — | grade de chips (botões gerados pelo script) | — | — | Estatal estrangeira que controla ativo regulado no Brasil / Empresa privada estrangeira que adquiriu ativo mineral / Empresa brasileira em fato histórico concluído há décadas / Fabricante de módulo, c |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| cn-out | — | — | — | — |
| cn-vd | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Classificador de nome — em que categoria cai, e o que fazer com ele" — classifica
  - intro: "O único instrumento autorreferente do módulo: ele não ensina um fato do mundo, ensina a disciplina do próprio ativo"
- **Sem promessa, mas (C6):** As sete categorias formam uma escala do que pode ser nomeado ao que não pode. Uma régua de sete posições com a entidade escolhida marcada mostraria a fronteira — mas o instrumento é sobre regra editorial, e texto basta.
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, gabarito nem previsão para nenhum instrumento (P6).

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Estatal estrangeira que controla ativo regulado no Brasil apareceu numa pesquisa: em que categoria ela cai e onde o nome dela pode aparecer?
- **Cenário-padrão:** null
- **Resposta no cenário-padrão:** "Categoria 1 — Estrutura de propriedade, sem nome"; onde pode aparecer: "Em nenhum lugar" (a substituição correta está no registro da extração)

**Avisos.**

- **Nota da fonte:** O instrumento não tem p.srcnote. Nenhuma fonte de números declarada no bloco (null).
- **Nota de produto:** Este instrumento codifica a própria regra P24 / §3 das decisões de 2026-09-21. Vale como referência para o content QA do currículo inteiro.

**Estado no código (informativo, não é camada fonte).** {"arquivo_dados":"src/lib/data/alexandria-modulo-12-content.ts","arquivo_calculo":"src/lib/data/alexandria-instrument-calculators.ts","id":"m12-inst-10","kind":"explorador","formula":null,"aula":"aula

### m12-inst-11 · Andaime de conversa — trinta minutos, oito movimentos, sem repetição

**Identidade.** Inst · 11 · 08 · tipo: instrumento

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Percorra em ordem na primeira vez. Depois, treine entrando por movimentos aleatórios, porque em conversa real o interlocutor escolhe o ponto de entrada — e a competência que importa é saber, de qualquer movimento, para onde ir em seguida sem atropelar o que ainda não foi estabelecido.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| ad-nav | — | — | navegação por movimentos (gerada pelo script) | — | — | Tese / Grandeza / Clima / Carteira / Comércio / Padrão / Aposta / Fecho |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| ad-nav | — | — | — | — |
| ad-bd | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Andaime de conversa — trinta minutos, oito movimentos, sem repetição" — tempo e contagem no título
  - a fonte renderiza o relógio: "Minuto 00–03 · movimento 1 de 8"
  - a fonte não desenha: só o relógio em texto
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** Uma barra de trinta minutos dividida nos oito movimentos pelas janelas de minuto que a fonte declara, com o movimento atual destacado e todos os oito clicáveis — porque o intro manda treinar entrando por movimentos aleatórios, e isso só funciona se os oito estiverem à mão.
- **Eixo x:** minutos, de 0 a 30
- **Eixo y:** faixa única, oito segmentos
- **Séries:** os oito movimentos (Tese, Grandeza, Clima, Carteira, Comércio, Padrão, Aposta, Fecho) · movimento atual · ponte para o movimento seguinte
- **Relação que a figura tem de mostrar:** "Sem repetição" e "trinta minutos" são restrições de forma, não de conteúdo: a barra é o que torna as duas verificáveis pelo próprio learner enquanto ele fala.
- **Derivação:** literal quanto aos oito rótulos de movimento e ao formato do relógio
- **Reúso:** Mesma figura do m13-inst-11 e do m10-inst-10 (barra de tempo segmentada por passos declarados).
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, gabarito nem previsão para nenhum instrumento (P6).

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Treino de entrada aleatória: começar por um movimento sorteado e dizer para onde ir em seguida.

**Avisos.**

- **Fonte dos números:** Âncoras dos movimentos: Balanço Energético Nacional 2026, ano-base 2025, EPE/MME; Anuário Estatístico Brasileiro do Petróleo, Gás Natural e Biocombustíveis 2026, ANP; Pacote de Belém e registro da Contribuição Nacionalmente Determinada, UNFCCC; Leis nº 14.948/2024, nº 14.990/2024, nº 15.042/2024 e nº 15.269/2025; Projeto de Lei nº 2.780/2024; Sumário Mineral da Agência Nacional de Mineração e Mine
- **Nota da fonte:** Literal do p.srcnote do instrumento. Nenhum número aqui foi verificado contra a fonte primária (P19/P20).

**Estado no código (informativo, não é camada fonte).** {"arquivo_dados":"src/lib/data/alexandria-modulo-12-content.ts","arquivo_calculo":"src/lib/data/alexandria-instrument-calculators.ts","id":"m12-inst-11","kind":"explorador","formula":null,"aula":"aula


## M13

### m13-inst-01 · Painel de controle setorial

**Identidade.** INST·01 · Painel setorial (fora de aula) · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Escolha uma lente e uma empresa. A mesma companhia lida por controle, por capital e por lacuna produz três diagnósticos diferentes — e é a sobreposição dos três, não qualquer um deles isolado, que sustenta uma tese. Alterne também a ordenação para ver que o ranking muda de significado conforme a dimensão.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| pn-seg | Lente ativa | — | segmentado (um botão ativo) | — | — | Controle / Capital / Lacuna |
| pn-ord | Ordenar as dez por | — | segmentado (um botão ativo) | — | — | Arquétipo de controle / Segmento / Evento mais recente |
| pn-grid | — | — | chips gerados por script (um ativo; o primeiro nasce ativo) | — | — | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| pn-lens | — | — | — | — |
| pn-item | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Painel de controle setorial" — painel é superfície, não ficha
  - intro: "é a sobreposição dos três, não qualquer um deles isolado, que sustenta uma tese"
  - a fonte não desenha: dois painéis de texto
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** As dez empresas numa coluna estável, reordenadas pelo seletor de ordenação e recoloridas pela lente ativa — controle, capital, lacuna. A empresa escolhida abre o painel sem tirar as outras nove da tela, porque o intro afirma que a tese vem da sobreposição das três lentes sobre o mesmo conjunto.
- **Eixo x:** a lente ativa (três estados) e a ordenação ativa (arquétipo de controle, segmento, evento mais recente)
- **Eixo y:** as dez empresas
- **Séries:** as dez empresas · classificação na lente ativa · ordem imposta pelo seletor de ordenação
- **Relação que a figura tem de mostrar:** Trocar a lente não troca a lista; trocar a ordenação não troca a classificação. Ver as duas operações agirem sobre a mesma coluna é o que ensina que controle, capital e lacuna são independentes.
- **Derivação:** literal quanto aos três rótulos de lente e aos três de ordenação
- **Reúso:** Mesma figura do m10-inst-01, m11-inst-01 e m15-inst-01: coluna estável recolorida e reordenada por seletor.
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Condição a encontrar: achar a empresa cuja leitura por controle contradiz a leitura por capital.

**Avisos.**

- **Fonte dos números:** {"valor":null,"nota":"Valores e estados societários em texto; o §MAP declara \"Estado societário verificado em 2 de agosto de 2026\" (p.srcnote L809) e manda confirmar na página de RI e na CVM. Nenhuma fonte por item."}
- **Content QA (P20):** Valores e estados societários em texto; o §MAP declara a data de verificação. Manter a data junto do bloco (S4).

**Estado no código (informativo, não é camada fonte).** {"status":"não portado","evidencia":"alexandria-modulo-13-content.ts: `instruments: []` nas 8 aulas (comentário \"INSTRUMENTOS: NÃO PORTADOS NESTA WAVE\"); nenhuma entrada m13 em alexandria-instrument

### m13-inst-02 · Calculadora de múltiplo com alavancagem

**Identidade.** INST·02 · Aula 01 · tipo: calculadora

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Informe valor de mercado, dívida líquida, EBITDA e a parcela do EBITDA consumida por despesa financeira e impostos. O instrumento devolve EV/EBITDA e P/E lado a lado — e um diagnóstico que recusa dizer "caro" ou "barato" a partir de um múltiplo isolado. Todos os valores são editáveis: nenhum deles é constante do setor.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| mu-eq-n | Valor de mercado do capital próprio | R$ bi | — | 30 | 0.5 – 120 / passo 0.5 | — |
| mu-dl-n | Dívida líquida | R$ bi | — | 25 | 0 – 120 / passo 0.5 | — |
| mu-eb-n | EBITDA dos últimos doze meses | R$ bi | — | 10 | 0.2 – 45 / passo 0.1 | — |
| mu-jf-n | Despesa financeira sobre EBITDA | % | — | 30 | 0 – 95 / passo 1 | — |
| mu-da-n | Depreciação sobre EBITDA | % | — | 25 | 0 – 80 / passo 1 | — |
| mu-tx-n | Alíquota efetiva de tributos | % | — | 34 | 0 – 45 / passo 1 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| mu-ev | Enterprise value | R$ bi (script) | — | `$id('mu-ev').innerHTML=fmt(ev,1)+'<span class="u">R$ bi</span>';` |
| mu-ee | EV / EBITDA | × (script) | — | `$id('mu-ee').innerHTML=fmt(ee,1)+'<span class="u">×</span>';` |
| mu-pe | P / E | × (script) | — | `$id('mu-pe').innerHTML=(lucro>0?fmt(pe,1)+'<span class="u">×</span>':'n.d.');` |
| mu-al | Dívida líq. / EBITDA | × (script) | — | `$id('mu-al').innerHTML=fmt(al,2)+'<span class="u">×</span>';` |
| mu-de | Dívida sobre EV | % (script) | — | `$id('mu-de').textContent=fmt(de,0)+'% do valor da firma';` |
| mu-lu | Lucro implícito | R$ bi (script) | — | `$id('mu-lu').textContent=(lucro>0?'R$ '+fmt(lucro,2)+' bi':'prejuízo de R$ '+fmt(Math.abs(lucro),2)+' bi');` |
| mu-ev | — | R$ bi (script) | — | — |
| mu-ee | — | × (script) | — | — |
| mu-pe | — | × (script) | — | — |
| mu-al | — | × (script) | — | — |
| mu-de | — | % (script) | — | — |
| mu-lu | — | R$ bi (script) | — | — |
| mu-vd | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - intro literal: "O instrumento devolve EV/EBITDA e P/E lado a lado" — a fonte escreve o arranjo
  - a fonte não desenha: seis readouts de texto
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** Uma barra do valor da firma partida em capital próprio e dívida líquida, com a fração da dívida rotulada; ao lado, uma régua de "vezes" com as duas marcas que o intro manda pôr lado a lado — EV/EBITDA e P/E — e, entre elas, a alavancagem como a distância que as separa.
- **Eixo x:** na barra, R$ bi; na régua, múltiplo em vezes
- **Eixo y:** uma linha para a barra, uma para a régua
- **Séries:** capital próprio · dívida líquida · EV/EBITDA · P/E · dívida líquida / EBITDA
- **Relação que a figura tem de mostrar:** Os dois múltiplos divergem porque um mede a firma inteira e o outro mede só a fatia do acionista. Quanto mais dívida, mais eles se afastam — e é por isso que o instrumento se recusa a dizer "caro" ou "barato" a partir de um deles. A distância entre as duas marcas é a alavancagem tornada visível.
- **Derivação:** derivado do código-fonte (ev = eq + dl; ee = ev/eb; al = dl/eb; de = dl/ev×100; pe = eq/lucro, verbatim)
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Capital próprio de R$ 30 bi, dívida líquida de R$ 25 bi, EBITDA de R$ 10 bi, com 30% do EBITDA em despesa financeira, 25% em depreciação e alíquota efetiva de 34%: quanto dão EV/EBITDA e P/E?
- **Cenário-padrão:** null
- **Resposta no cenário-padrão:** EV/EBITDA 5,5× e P/E 10,1× (enterprise value R$ 55,0 bi; dívida líquida/EBITDA 2,50×; dívida em 45% do valor da firma; lucro implícito R$ 2,97 bi)

**Avisos.**

- **Fonte dos números:** {"valor":null,"nota":"Cenário-padrão sem fonte: a própria intro diz \"Todos os valores são editáveis: nenhum deles é constante do setor.\" e o aviso chama o lucro implícito de \"aproximação didática\"."}
- **Content QA (P20):** A própria intro declara que todos os valores são de cenário. Não apresentar como demonstrativo de empresa.

**Estado no código (informativo, não é camada fonte).** {"status":"não portado","evidencia":"alexandria-modulo-13-content.ts: `instruments: []` nas 8 aulas (comentário \"INSTRUMENTOS: NÃO PORTADOS NESTA WAVE\"); nenhuma entrada m13 em alexandria-instrument

### m13-inst-03 · Simulador de DCF de concessão com prazo definido

**Identidade.** INST·03 · Aula 02 · tipo: simulador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Todas as entradas são editáveis, inclusive a taxa livre de risco — que é derivada da Selic corrente e da inflação projetada, ambas declaradas com fonte e data no painel abaixo, e nenhuma delas cravada no código. O instrumento devolve o valor presente, a contribuição de cada componente e a sensibilidade a cada entrada i”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| dc-se-n | Selic nominal (ou taxa livre de risco nominal) | % a.a. | — | 14.25 | 2 – 25 / passo 0.25 | — |
| dc-ip-n | Inflação projetada | % a.a. | — | 5.16 | 0 – 15 / passo 0.1 | — |
| dc-pr-n | Prêmio sobre a taxa livre de risco real | p.p. | — | 0.5 | 0 – 10 / passo 0.1 | — |
| dc-hz-n | Anos remanescentes de concessão | anos | — | 20 | 1 – 40 / passo 1 | — |
| dc-f1-n | Fluxo de caixa livre real no ano 1 | R$ mi | — | 900 | 50 – 6000 / passo 10 | — |
| dc-gr-n | Crescimento real do fluxo | % a.a. | — | 1 | -4 – 6 / passo 0.1 | — |
| dc-in-n | Indenização estimada no termo | R$ mi | — | 1200 | 0 – 12000 / passo 50 | — |
| dc-pi-n | Probabilidade de recebimento da indenização | % | — | 70 | 0 – 100 / passo 5 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| dc-tx | Taxa real de desconto | % (script) | — | `$id('dc-tx').innerHTML=fmt(taxa*100,2)+'<span class="u">% a.a.</span>';` |
| dc-vo | VP dos fluxos operacionais | R$ mi (script) | — | `$id('dc-vo').innerHTML=fmt(b.vo,0)+'<span class="u">R$ mi</span>';` |
| dc-vi | VP da indenização esperada | R$ mi (script) | — | `$id('dc-vi').innerHTML=fmt(b.vi,0)+'<span class="u">R$ mi</span>';` |
| dc-ev | Valor da firma simplificado | R$ mi (script) | — | `$id('dc-ev').innerHTML=fmt(b.tot,0)+'<span class="u">R$ mi</span>';` |
| dc-pw | Peso da indenização | % (script) | — | `$id('dc-pw').textContent=fmt(b.vi/b.tot*100,1)+'% do valor total';` |
| dc-pp | Se fosse perpetuidade | R$ mi (script) | — | `$id('dc-pp').textContent=(isFinite(perp)?'R$ '+fmt(perp,0)+' mi · '+fmt(perp/b.tot,1)+'× o valor correto':'indefinido: crescimento ≥ taxa');` |
| dc-tx | — | % (script) | — | — |
| dc-vo | — | R$ mi (script) | — | — |
| dc-vi | — | R$ mi (script) | — | — |
| dc-ev | — | R$ mi (script) | — | — |
| dc-pw | — | % (script) | — | — |
| dc-pp | — | R$ mi (script) | — | — |
| dc-s1 | — | — | — | — |
| dc-v1 | — | — | — | — |
| dc-s2 | — | — | — | — |
| dc-v2 | — | — | — | — |
| dc-s3 | — | — | — | — |
| dc-v3 | — | — | — | — |
| dc-s4 | — | — | — | — |
| dc-v4 | — | — | — | — |
| dc-vd | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - intro: "Todas as entradas são editáveis, inclusive a taxa livre de risco"
  - a fonte desenha: quatro barras de sensibilidade, com rótulos literais "Taxa −1 p.p." e "Cenário base" entre eles
- **Desenho na fonte:** quatro barras (#dc-s1…s4 com valores #dc-v1…v4), rótulos literais de cenário de taxa
- **O que precisa ser desenhado:** As quatro barras de sensibilidade à taxa, na mesma escala, com o cenário base destacado entre elas — e, ao lado, a comparação que o instrumento existe para fazer: o valor correto, com prazo definido, contra o valor que a perpetuidade produziria, com a razão entre os dois rotulada.
- **Eixo x:** R$ mi de valor da firma
- **Eixo y:** os quatro cenários de taxa e, na segunda leitura, as duas formas de avaliar
- **Séries:** Taxa −1 p.p. · Cenário base · os demais cenários de taxa · VP dos fluxos operacionais · VP da indenização esperada · valor sob perpetuidade
- **Relação que a figura tem de mostrar:** Uma concessão tem termo, e tratá-la como perpetuidade superestima — no cenário-padrão, em 1,2 vez. A segunda leitura da figura é a que contém a lição; as barras de sensibilidade sozinhas só dizem que taxa importa.
- **Derivação:** literal quanto aos rótulos de cenário; a função vp(taxa, hz, f1, gr, ind, pi) é verbatim
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Concessão com 20 anos remanescentes, fluxo real de R$ 900 mi no ano 1 crescendo 1% a.a., taxa real derivada de Selic nominal de 14,25% e inflação projetada de 5,16% mais prêmio de 0,5 p.p., com indenização estimada de R$ 1.200 mi a 70% de probabilidade: quanto vale a firma, e quantas vezes a perpetuidade exageraria?
- **Cenário-padrão:** null
- **Resposta no cenário-padrão:** Valor da firma R$ 8.854 mi (taxa real 9,14% a.a.; VP operacional R$ 8.708 mi; VP da indenização R$ 146 mi, 1,6% do total); sob perpetuidade, R$ 11.051 mi — 1,2× o valor correto

**Avisos.**

- **Fonte dos números:** parcial
- **Divergência (P5/P8):** Registrado no README do M13: taxa real aparece como 8,7% e como 8,64% em pontos diferentes do módulo. P8/P5.

**Estado no código (informativo, não é camada fonte).** {"status":"não portado","evidencia":"alexandria-modulo-13-content.ts: `instruments: []` nas 8 aulas (comentário \"INSTRUMENTOS: NÃO PORTADOS NESTA WAVE\"); nenhuma entrada m13 em alexandria-instrument

### m13-inst-04 · Roteiro cronometrado de leitura

**Identidade.** INST·04 · Aula 03 · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Escolha o documento e a etapa. O instrumento devolve o que procurar, onde procurar, e — o mais importante — qual pergunta essa etapa precisa deixar respondida antes de você avançar. Se a pergunta ficar aberta, não avance: anote como lacuna e siga.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| rt-seg | Documento | — | segmentado (um botão ativo) | — | — | Release trimestral · 30 min / Formulário de Referência · 60 min |
| rt-grid | — | — | chips gerados por script (um ativo; o primeiro nasce ativo) | — | — | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| rt-item | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Roteiro cronometrado de leitura" — "cronometrado"
  - a fonte declara as janelas por etapa: o painel abre em "0-3 min · Release trimestral", e os dois documentos têm 30 min e 60 min
  - a fonte não desenha: painel de texto
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** Uma barra de tempo por documento — 30 minutos para o release trimestral, 60 para o Formulário de Referência — segmentada nas etapas pelas janelas de minuto declaradas, com a etapa atual destacada. A etapa que consome mais minutos aparece maior, e isso é conteúdo.
- **Eixo x:** minutos, de 0 ao total do documento escolhido
- **Eixo y:** uma faixa por documento
- **Séries:** as etapas do release trimestral · as etapas do Formulário de Referência · etapa atual
- **Relação que a figura tem de mostrar:** O roteiro só é cronometrado se o tempo estiver na tela. Uma lista de etapas com o minuto escrito no cabeçalho do painel não é um cronômetro — é uma legenda.
- **Derivação:** literal quanto aos dois documentos, aos dois totais e ao formato da janela ("0-3 min")
- **Reúso:** Mesma barra de tempo segmentada do m10-inst-10, m12-inst-11 e m13-inst-11.
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Percurso cronometrado: executar as etapas sobre um documento real e sair com a lista das perguntas que ficaram abertas.

**Avisos.**

- **Fonte dos números:** {"valor":null,"nota":"Tempos por etapa sem fonte; o aviso diz \"Os tempos são referência de treino, não regra.\""}
- **Content QA (P20):** A fonte declara: "Os tempos são referência de roteiro" — não medição.

**Estado no código (informativo, não é camada fonte).** {"status":"não portado","evidencia":"alexandria-modulo-13-content.ts: `instruments: []` nas 8 aulas (comentário \"INSTRUMENTOS: NÃO PORTADOS NESTA WAVE\"); nenhuma entrada m13 em alexandria-instrument

### m13-inst-05 · Verificador de lacuna

**Identidade.** INST·05 · Aula 03 · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Cada trecho abaixo é um fragmento hipotético de release ou de Formulário de Referência, construído para ser verdadeiro, completo em si mesmo e insuficiente. Escolha um e identifique a categoria de lacuna. O instrumento devolve a categoria, a pergunta exata a fazer à área de relações com investidores, e como a resposta ”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| lc-seg | Ver por | — | segmentado (um botão ativo) | — | — | Categoria e diagnóstico / Pergunta a fazer / Impacto na conclusão |
| lc-grid | Trecho a analisar | — | chips gerados por script (um ativo; o primeiro nasce ativo) | — | — | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| lc-item | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Verificador de lacuna" — verifica
  - a fonte declara que todos os trechos são hipotéticos e construídos para serem verdadeiros e insuficientes
- **Sem promessa, mas (C6):** As três vistas — categoria e diagnóstico, pergunta a fazer, impacto na conclusão — são três colunas fixas sobre os mesmos trechos. A matriz trechos × vistas permitiria a leitura lateral sem figura nova.
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** sim. C3 em estado puro: o ato é classificar a lacuna antes de ver o diagnóstico, e a fonte já entrega a classificação.
- **Pergunta (camada Alexandria):** Dado um trecho de release ou de Formulário de Referência construído para ser verdadeiro e insuficiente: qual é a categoria de lacuna?
- **Cenário-padrão:** null
- **Resposta no cenário-padrão:** O cenário-padrão abre no Trecho 01, vista "Categoria e diagnóstico"; a categoria de cada trecho está no registro da extração

**Avisos.**

- **Fonte dos números:** {"valor":null,"nota":"O aviso declara: \"Todos os trechos são hipotéticos e construídos para o exercício.\""}
- **Divergência (P5/P8):** Registrado no README do M13: o texto diz "cinco" trechos e o markup tem 6. P8/P5.

**Estado no código (informativo, não é camada fonte).** {"status":"não portado","evidencia":"alexandria-modulo-13-content.ts: `instruments: []` nas 8 aulas (comentário \"INSTRUMENTOS: NÃO PORTADOS NESTA WAVE\"); nenhuma entrada m13 em alexandria-instrument

### m13-inst-06 · Classificador de arquétipo de controle

**Identidade.** INST·06 · Aula 04 · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Escolha uma empresa do rol — ou um dos dois casos hipotéticos ao fim da lista. O instrumento devolve o arquétipo, quem decide de fato, o comportamento esperado sob estresse e a pergunta de verificação que precisa ser respondida antes de aceitar a classificação. Produto cartesiano completo: os seis arquétipos são todos ”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| ct-grid | Empresa ou caso | — | chips gerados por script (um ativo; o primeiro nasce ativo) | — | — | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| ct-item | — | — | — | — |
| ct-out | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Classificador de arquétipo de controle" — classifica
- **Sem promessa, mas (C6):** Os arquétipos são poucos e as doze empresas e casos se distribuem entre eles. Agrupar os doze por arquétipo numa única tela mostraria a distribuição — e é ela que dá sentido aos dois casos hipotéticos que fecham a lista.
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Dada uma empresa do rol: qual o arquétipo de controle, e quem decide de fato?
- **Cenário-padrão:** null
- **Resposta no cenário-padrão:** O cenário-padrão abre com o arquétipo "Estatal…" identificado; a classificação completa está no registro da extração

**Avisos.**

- **Fonte dos números:** {"valor":null,"nota":"Classificação das 10 empresas sem fonte por item; nota de AXIA \"Verificado em 02·08·2026\". Dois casos declarados hipotéticos (h1, h2)."}
- **Content QA (P20):** A classificação das dez empresas não tem fonte por item. Manter a nota de verificação junto (S4).

**Estado no código (informativo, não é camada fonte).** {"status":"não portado","evidencia":"alexandria-modulo-13-content.ts: `instruments: []` nas 8 aulas (comentário \"INSTRUMENTOS: NÃO PORTADOS NESTA WAVE\"); nenhuma entrada m13 em alexandria-instrument

### m13-inst-07 · Comparador de participação e voto

**Identidade.** INST·07 · Aula 04 · tipo: comparador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Cinco situações em que os dois números divergem — ou não. Escolha uma e veja os dois lados declarados separadamente, com o mecanismo que produz a divergência e a consequência prática para leitura de risco.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| pv-grid | — | — | chips gerados por script (um ativo; o primeiro nasce ativo) | — | — | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| pv-dual | — | — | — | — |
| pv-note | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Comparador de participação e voto" — duas grandezas comparadas
  - intro: "veja os dois lados declarados separadamente"
  - a fonte desenha: bloco dual com duas colunas (.dc a e .dc b)
- **Desenho na fonte:** bloco dual de duas colunas (#pv-dual), rótulos literais "Participação econômica adquirida" e "Poder de voto adquirido"
- **O que precisa ser desenhado:** Duas barras na mesma escala de 0 a 100% — participação econômica e poder de voto — lado a lado, com a diferença entre elas marcada, e a nota do mecanismo que produz a divergência abaixo.
- **Eixo x:** 0 a 100% do capital (total numa barra, votante na outra — e a diferença de denominador precisa estar rotulada)
- **Eixo y:** as duas grandezas
- **Séries:** participação econômica adquirida · poder de voto adquirido · a diferença
- **Relação que a figura tem de mostrar:** No cenário-padrão, 68% do capital total contra 35,3% do capital votante. As duas barras respondem perguntas diferentes: uma mede quanto do resultado pertence ao comprador, a outra quanto da decisão. Somar ou confundir as duas é o erro que o instrumento existe para impedir.
- **Derivação:** literal (os dois rótulos e os dois percentuais são texto da fonte)
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Comprador privado adquire 68% do capital total de uma companhia: quanto do capital votante isso costuma representar nas situações do rol?
- **Cenário-padrão:** null
- **Resposta no cenário-padrão:** No caso do cenário-padrão, 35,3% do capital votante

**Avisos.**

- **Fonte dos números:** {"valor":null,"nota":"O aviso diz \"Percentuais aproximados, com data de verificação declarada em cada caso\", mas só p1 traz datas no texto (out 2025 – mar 2026); p2-p4 não têm data e p5 é \"Caso hipotético\"."}
- **Content QA (P20):** A fonte declara: "Percentuais aproximados, com data de verificação declarada."

**Estado no código (informativo, não é camada fonte).** {"status":"não portado","evidencia":"alexandria-modulo-13-content.ts: `instruments: []` nas 8 aulas (comentário \"INSTRUMENTOS: NÃO PORTADOS NESTA WAVE\"); nenhuma entrada m13 em alexandria-instrument

### m13-inst-08 · Régua de estrutura de capital e cobertura

**Identidade.** INST·08 · Aula 05 · tipo: simulador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Informe investimento total, proporção de dívida, custo real, prazo e o caixa disponível para o serviço da dívida no primeiro ano. O instrumento devolve o serviço da dívida, o índice de cobertura e o comportamento sob choque — e o veredito cruza cobertura com folga até o gatilho de bloqueio de dividendos, recusando clas”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| ds-cx-n | Investimento total do projeto | R$ mi | — | 2100 | 100 – 9000 / passo 10 | — |
| ds-al-n | Proporção financiada por dívida | % | — | 70 | 0 – 90 / passo 1 | — |
| ds-kd-n | Custo real da dívida | % a.a. | — | 7.5 | 1 – 16 / passo 0.1 | — |
| ds-pz-n | Prazo de amortização | anos | — | 15 | 3 – 30 / passo 1 | — |
| ds-cf-n | CFADS no ano 1 | R$ mi | — | 235 | 10 – 1200 / passo 1 | — |
| ds-mn-n | DSCR mínimo de covenant | × | — | 1.25 | 1 – 2.5 / passo 0.05 | — |
| ds-lk-n | Gatilho de bloqueio de dividendos | × | — | 1.35 | 1 – 3 / passo 0.05 | — |
| ds-ch-n | Choque de estresse sobre o CFADS | % | — | 10 | 0 – 45 / passo 1 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| ds-dv | Dívida sênior | R$ mi (script) | — | `$id('ds-dv').innerHTML=fmt(dv,0)+'<span class="u">R$ mi</span>';` |
| ds-eq | Capital próprio | R$ mi (script) | — | `$id('ds-eq').innerHTML=fmt(eq,0)+'<span class="u">R$ mi</span>';` |
| ds-sv | Serviço da dívida ano 1 | R$ mi (script) | — | `$id('ds-sv').innerHTML=fmt(sv,1)+'<span class="u">R$ mi</span>';` |
| ds-d0 | DSCR base | × (script) | — | `$id('ds-d0').innerHTML=fmt(d0,2)+'<span class="u">×</span>';` |
| ds-d1 | DSCR sob choque | × (script) | — | `$id('ds-d1').innerHTML=fmt(d1,2)+'<span class="u">×</span>';` |
| ds-be | Choque até o mínimo | % (script) | — | `$id('ds-be').textContent=(quedaMin>0?fmt(quedaMin,1)+'% de queda no CFADS':'já abaixo do mínimo');` |
| ds-dv | — | R$ mi (script) | — | — |
| ds-eq | — | R$ mi (script) | — | — |
| ds-sv | — | R$ mi (script) | — | — |
| ds-d0 | — | × (script) | — | — |
| ds-d1 | — | × (script) | — | — |
| ds-be | — | % (script) | — | — |
| ds-vd | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Régua de estrutura de capital e cobertura" — "Régua"
  - intro: "devolve o serviço da dívida, o índice de cobertura e o comportamento sob choque"
  - a fonte não desenha: seis readouts de texto
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** Uma régua de índice de cobertura, em vezes, com duas linhas verticais fixas — o mínimo de covenant e o gatilho de bloqueio de dividendos — e duas marcas: a cobertura no cenário base e a cobertura sob choque. Abaixo, a barra do investimento total partida em dívida sênior e capital próprio.
- **Eixo x:** índice de cobertura, em vezes, com as duas linhas de covenant marcadas
- **Eixo y:** uma régua, mais uma barra de estrutura de capital
- **Séries:** DSCR base · DSCR sob choque · mínimo de covenant · gatilho de bloqueio de dividendos · dívida sênior e capital próprio · choque até o mínimo
- **Relação que a figura tem de mostrar:** Existem dois limites e eles não estão no mesmo lugar. No cenário-padrão a cobertura sob choque fica acima do mínimo e abaixo do gatilho — o veredito da fonte diz exatamente "resiste ao mínimo, não resiste ao bloqueio". Isso é uma posição entre duas linhas, e sem as duas linhas desenhadas a frase não se verifica.
- **Derivação:** literal quanto aos rótulos dos dois covenants; a função servico(dv, kd, pz) e os DSCR são verbatim
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.
- **Por que não pedir:** Os dois limites aqui são covenants do contrato de financiamento, entradas editáveis do próprio instrumento — não margem de acerto de resposta.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Projeto de R$ 2.100 mi financiado em 70% por dívida a 7,5% real em 15 anos, com CFADS de R$ 235 mi no ano 1, DSCR mínimo de covenant de 1,25× e gatilho de bloqueio em 1,35×, sob choque de 10% no CFADS: a cobertura sob choque fica acima ou abaixo de cada um dos dois limites?
- **Cenário-padrão:** null
- **Resposta no cenário-padrão:** DSCR base 1,41× e sob choque 1,27× — acima do mínimo de 1,25× e abaixo do gatilho de 1,35×; serviço da dívida R$ 166,5 mi; o CFADS suporta 11,4% de queda até o mínimo

**Avisos.**

- **Fonte dos números:** {"valor":null,"nota":"Padrões sem fonte declarada. Observação (não é fonte): 2.100 e 70% reproduzem a tabela hipotética de fontes e usos da Aula 05 (L1756-1763: dívida 1.470, capital 630 — o que o instrumento devolve no padrão) e a heurística 70/30 (05.2); 1,25× coincide com o Ex 04 e o quiz Q07. CFADS 235, custo 7,5%, prazo 15, gatilho 1,35× e choque 10% não aparecem em outro ponto da fonte."}

**Estado no código (informativo, não é camada fonte).** {"status":"não portado","evidencia":"alexandria-modulo-13-content.ts: `instruments: []` nas 8 aulas (comentário \"INSTRUMENTOS: NÃO PORTADOS NESTA WAVE\"); nenhuma entrada m13 em alexandria-instrument

### m13-inst-09 · Matriz de risco em duas lentes

**Identidade.** INST·09 · Aula 06 · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Escolha uma categoria de risco e alterne entre a lente de empresa e a lente de projeto. Cada combinação devolve como o risco se manifesta, o que o mitiga, e o indicador de alerta — o sinal observável que aparece antes do problema. Produto cartesiano completo: oito riscos por duas lentes, dezesseis combinações, nenhuma ”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| rk-seg | Lente | — | segmentado (um botão ativo) | — | — | Empresa aberta / Sociedade de projeto |
| rk-grid | — | — | chips gerados por script (um ativo; o primeiro nasce ativo) | — | — | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| rk-item | — | — | — | — |
| rk-out | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Matriz de risco em duas lentes" — "Matriz"
  - intro: "Produto cartesiano completo"
  - a fonte não desenha: dois painéis de texto
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** A grade das oito categorias de risco por duas lentes — empresa aberta e sociedade de projeto — com as dezesseis células visíveis e a célula ativa aberta abaixo, trazendo como o risco se manifesta, o que o mitiga e o indicador de alerta.
- **Eixo x:** as duas lentes
- **Eixo y:** as oito categorias de risco
- **Séries:** as dezesseis células
- **Relação que a figura tem de mostrar:** O mesmo risco se manifesta de formas diferentes conforme o veículo. Só a grade mostra que a lente muda a manifestação sem mudar a lista — e que nenhuma das dezesseis células é vazia.
- **Derivação:** literal quanto às duas lentes e à declaração de produto cartesiano completo
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Comparação: percorrer um risco nas duas lentes e dizer em qual veículo o indicador de alerta aparece mais cedo.

**Avisos.**

- **Fonte dos números:** {"valor":null,"nota":"Classificação qualitativa; o aviso diz que não estima probabilidade nem severidade."}
- **Content QA (P20):** A fonte declara que a classificação é qualitativa e que o instrumento não estima probabilidade.

**Estado no código (informativo, não é camada fonte).** {"status":"não portado","evidencia":"alexandria-modulo-13-content.ts: `instruments: []` nas 8 aulas (comentário \"INSTRUMENTOS: NÃO PORTADOS NESTA WAVE\"); nenhuma entrada m13 em alexandria-instrument

### m13-inst-10 · Comparador empresa × indicador

**Identidade.** INST·10 · Aula 07 · tipo: comparador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Escolha um indicador. A tabela reordena as dez empresas vivas por aquela dimensão e devolve, além do valor, a ressalva que impede a comparação direta — porque em quase todos os casos existe uma. Produto cartesiano completo: dez empresas por cinco indicadores.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| cp-seg | Indicador | — | segmentado (um botão ativo) | — | — | Controle / Modelo de negócio / Alavancagem / Resultado / Evento societário |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| cp-tab | — | — | — | — |
| cp-note | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Comparador empresa × indicador" — "Comparador" e as duas dimensões
  - intro: "Produto cartesiano completo: dez empresas…"
  - a fonte monta: tabela #cp-tab, reordenada pelo indicador, com a ressalva em #cp-note
- **Desenho na fonte:** tabela das dez empresas (#cp-tab), reordenada pelo indicador escolhido, mais a ressalva
- **O que precisa ser desenhado:** Não é figura: é a tabela das dez empresas reordenada pelo indicador escolhido, com a coluna de ressalva de comparabilidade sempre visível ao lado do valor — nunca escondida atrás de um clique, porque, como a fonte diz, em quase todos os casos ela existe.
- **Eixo x:** o indicador selecionado (Controle, Modelo de negócio, Alavancagem, Resultado, Evento societário)
- **Eixo y:** as dez empresas, reordenadas pelo indicador
- **Séries:** valor por empresa · ressalva de comparabilidade por linha
- **Relação que a figura tem de mostrar:** A ordenação por indicador sugere ranking; a ressalva desmente o ranking. As duas têm de estar na mesma linha, senão a tabela ensina o contrário do que o instrumento quer.
- **Derivação:** literal quanto aos cinco indicadores e à existência da ressalva por linha
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Comparação com ressalva: escolher um indicador e dizer quais duas empresas não são comparáveis nele, e por quê.

**Avisos.**

- **Fonte dos números:** {"valor":null,"nota":"Valores com trimestre declarado por linha (1T26, 2T26, exercício 2025, ano-safra 2025/26); o aviso manda reconstruir na fonte primária antes de uso externo. Sem fonte por célula."}
- **Content QA (P20):** Os valores trazem o trimestre declarado por linha (1T26, 2T26, exercício). Manter o rótulo temporal junto do número (S4).

**Estado no código (informativo, não é camada fonte).** {"status":"não portado","evidencia":"alexandria-modulo-13-content.ts: `instruments: []` nas 8 aulas (comentário \"INSTRUMENTOS: NÃO PORTADOS NESTA WAVE\"); nenhuma entrada m13 em alexandria-instrument

### m13-inst-11 · Andaime de tese de investimento · instrumento assinatura

**Identidade.** INST·11 · Aula 08 · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Escolha uma das seis empresas com ficha e um dos três blocos. O andaime devolve três itens estruturados — cada um com âncora e contraponto declarados — não como resposta a ser copiada, mas como modelo de forma. O conteúdo dos itens deriva da estrutura verificável de cada companhia; a peça analítica final continua sendo”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| an-nav | Bloco | — | segmentado (um botão ativo) | — | — | Teses / Riscos / Lacunas |
| an-grid | Empresa | — | chips gerados por script (um ativo; o primeiro nasce ativo) | — | — | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| an-bd | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Andaime de tese de investimento · instrumento assinatura" — "andaime" é estrutura
  - intro: "não como resposta a ser copiada, mas como modelo de forma"
  - a fonte não desenha: um painel de texto
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** A grade das seis empresas com ficha por três blocos — teses, riscos, lacunas — com os dezoito cruzamentos alcançáveis e o cruzamento ativo aberto abaixo, trazendo os três itens, cada um com âncora e contraponto declarados.
- **Eixo x:** os três blocos
- **Eixo y:** as seis empresas com ficha
- **Séries:** os dezoito cruzamentos · âncora e contraponto por item
- **Relação que a figura tem de mostrar:** O andaime é forma, não conteúdo — é o que o intro diz. Ver a grade inteira mostra que a forma se repete e o conteúdo não, que é exatamente a lição.
- **Derivação:** literal quanto aos três blocos e à declaração de que os itens vêm da estrutura verificável de cada companhia
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** Nenhuma tolerância declarada na fonte.

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Modelo de forma: montar três teses sobre uma empresa fora do rol, com âncora e contraponto para cada uma.

**Avisos.**

- **Fonte dos números:** {"valor":null,"nota":"Itens derivados \"da estrutura verificável de cada companhia\" (intro); números repetem as fichas da Aula 07 (1T26 etc.). Sem fonte por item."}

**Estado no código (informativo, não é camada fonte).** {"status":"não portado","evidencia":"alexandria-modulo-13-content.ts: `instruments: []` nas 8 aulas (comentário \"INSTRUMENTOS: NÃO PORTADOS NESTA WAVE\"); nenhuma entrada m13 em alexandria-instrument


## M14

### m14-inst-01 · Mapa de rotas — insumo, conversão, produto, mercado, órgão

**Identidade.** INST·01 · — · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Escolha primeiro a dimensão de ordenação. A grade de rotas é reconstruída conforme a dimensão — o mesmo conjunto de seis rotas se organiza de forma diferente conforme a pergunta que você está fazendo. Depois escolha uma rota para ver a cadeia completa e o produto concorrente pelo mesmo insumo.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| mp-dim | Ordenar as rotas por: | — | — | — | — | Insumo de origem / Produto final / Sazonalidade / Órgão competente |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| mp-chips | — | — | — | — |
| mp-flux | — | — | — | — |
| mp-panel | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Mapa de rotas — insumo, conversão, produto, mercado, órgão" — "Mapa de rotas" e as cinco etapas no subtítulo
  - intro: "A grade de rotas é reconstruída conforme a dimensão"
  - a fonte desenha: #mp-flux, cadeia de blocos gerada pelo script
- **Desenho na fonte:** cadeia #mp-flux + chips #mp-chips reordenados pela dimensão
- **O que precisa ser desenhado:** A rota escolhida como cadeia de cinco elos na ordem do subtítulo — insumo, conversão, produto, mercado, órgão — e, acima dela, as seis rotas como chips reordenados pela dimensão ativa, para que a reconstrução da ordem seja visível como movimento.
- **Eixo x:** a cadeia, da esquerda para a direita, nos cinco elos
- **Eixo y:** as seis rotas, na ordem imposta pela dimensão escolhida
- **Séries:** as seis rotas · os cinco elos da rota ativa · a dimensão de ordenação (insumo de origem, produto final, sazonalidade, órgão competente)
- **Relação que a figura tem de mostrar:** O mesmo conjunto de seis rotas se organiza de forma diferente conforme a pergunta — é a frase do intro. A ordenação é a resposta, então a reordenação precisa acontecer na tela, e não entre dois cliques.
- **Derivação:** literal quanto aos cinco elos, às seis rotas e às quatro dimensões de ordenação (objeto ROTAS)
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância de resposta. Limiares de faixa do script estão em ramos_do_veredito.

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Condição a encontrar: achar a dimensão em que duas rotas de nomes parecidos ficam mais distantes na ordem.

**Avisos.**

- **Nota da fonte:** Nenhuma fonte declarada para a tabela ROTAS (texto descritivo, sem número).

**Estado no código (informativo, não é camada fonte).** {"estado":"não portado","evidencia":{"MODULO_14_INSTRUMENTOS":"[] (vazio)","instruments_nas_aulas":"8 de 8 aulas com instruments: []","ids_da_fonte_em_calculators":[],"titulo_em_codigo":false},"catalo

### m14-inst-02 · Calculadora de paridade por custo/km

**Identidade.** INST·02 · — · tipo: calculadora

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Quatro entradas, todas editáveis, nenhum limiar cravado. O instrumento recusa concluir a partir do índice de preço isolado: ele cruza o índice com a razão de rendimento medida e devolve a diferença de custo por quilômetro, mais o que ainda falta para a conclusão ser utilizável.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| pd-pg-n | Preço da gasolina C | R$/L | — | 6.2 | 3 – 12 / passo 0.01 | — |
| pd-pe-n | Preço do etanol hidratado | R$/L | — | 4.15 | 2 – 10 / passo 0.01 | — |
| pd-cg-n | Rendimento com gasolina | km/L | — | 11.5 | 4 – 22 / passo 0.1 | — |
| pd-ce-n | Rendimento com etanol | km/L | — | 8 | 3 – 18 / passo 0.1 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| pd-ix | Índice de preço | % (script) | — | `$id('pd-ix').textContent=fmt(ix*100,1)+'%';` |
| pd-ef | Razão de rendimento | % (script) | — | `$id('pd-ef').textContent=fmt(ef*100,1)+'%';` |
| pd-cg | Custo/km · gasolina | R$/km (script) | — | `$id('pd-cg').textContent='R$ '+fmt(kg,3)+'/km';` |
| pd-ce | Custo/km · etanol | R$/km (script) | — | `$id('pd-ce').textContent='R$ '+fmt(ke,3)+'/km';` |
| pd-df | Diferença | % (script) | — | `$id('pd-df').textContent=(dif>0?'+':'')+fmt(dif,1)+'%';` |
| pd-vd | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - intro literal: "O instrumento recusa concluir a partir do índice de preço isolado: ele cruza o índice com a razão de rendimento medida" — cruzar duas grandezas é um plano
  - o veredito do cenário-padrão diz, literalmente, "a regra dos 70% não entra na conta"
  - a fonte não desenha: cinco readouts de texto
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** Um plano com o índice de preço num eixo e a razão de rendimento no outro, a diagonal de indiferença traçada (onde os dois se igualam) e o ponto do caso atual marcado. Acima da diagonal, o etanol sai mais barato por quilômetro; abaixo, a gasolina. A linha vertical fixa em 70% — a regra popular — entra desenhada como referência errada, para que se veja quando ela acerta por acaso e quando erra.
- **Eixo x:** índice de preço (preço do etanol ÷ preço da gasolina), em %
- **Eixo y:** razão de rendimento medida (km/L com etanol ÷ km/L com gasolina), em %
- **Séries:** diagonal de indiferença · ponto do caso atual · linha de referência dos 70% · as duas barras de custo por quilômetro
- **Relação que a figura tem de mostrar:** A regra dos 70% supõe que a razão de rendimento é sempre 70%. Quando a razão medida é outra — 69,6% no cenário-padrão — a fronteira certa não está em 70%, está onde os dois eixos se igualam. Um plano com a diagonal mostra isso de uma vez; dois readouts não.
- **Derivação:** derivado do código-fonte (ix = pe/pg; ef = ce/cg; kg = pg/cg; ke = pe/ce; dif = (ke−kg)/kg×100, verbatim, linhas 3419–3422)
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância de resposta. Limiares de faixa do script estão em ramos_do_veredito.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Gasolina C a R$ 6,20/L rendendo 11,5 km/L e etanol hidratado a R$ 4,15/L rendendo 8,0 km/L: qual combustível sai mais barato por quilômetro, e por quanto?
- **Cenário-padrão:** {"pd-pg-n":6.2,"pd-pe-n":4.15,"pd-cg-n":11.5,"pd-ce-n":8}
- **Resposta no cenário-padrão:** Etanol, por 3,8 % (índice de preço 66,9 %; razão de rendimento 69,6 %; custo por km R$ 0,539 com gasolina e R$ 0,519 com etanol)

**Avisos.**

- **Nota da fonte:** Padrões (6,20; 4,15; 11,5; 8,0) sem fonte declarada. O p.disc manda usar "a pesquisa de preços da própria agência para a sua praça, ou nota fiscal, com data" e medir o rendimento no mesmo veículo.
- **Content QA (P20):** Os quatro padrões não têm fonte declarada; o aviso manda usar a pesquisa de preços oficial.

**Estado no código (informativo, não é camada fonte).** {"estado":"não portado","evidencia":{"MODULO_14_INSTRUMENTOS":"[] (vazio)","instruments_nas_aulas":"8 de 8 aulas com instruments: []","ids_da_fonte_em_calculators":[],"titulo_em_codigo":false},"catalo

### m14-inst-03 · Régua de mix açúcar-etanol

**Identidade.** INST·03 · — · tipo: simulador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Primeiro escolha o perfil industrial da planta — é ele que define a faixa de alternância. Depois ajuste a remuneração relativa por quilo de ATR em cada destino e o mix já praticado nesta safra. O veredito cruza dois sinais e recusa concluir por um só.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| mx-perf | Perfil industrial da unidade: | — | — | — | — | Mista equilibrada / Vocacionada a açúcar / Destilaria autônoma |
| mx-pa-n | Remuneração do ATR · açúcar | R$/kg ATR | — | 1.18 | 0.4 – 2.5 / passo 0.01 | — |
| mx-pe-n | Remuneração do ATR · etanol | R$/kg ATR | — | 1.26 | 0.4 – 2.5 / passo 0.01 | — |
| mx-mx-n | Mix já praticado nesta safra | % para açúcar | — | 48 | 0 – 100 / passo 1 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| mx-fa | Faixa de alternância | % (script) | — | `$id('mx-fa').textContent = (P.min===P.max) ? P.min+'% fixo' : P.min+'% a '+P.max+'%';` |
| mx-pr | Prêmio relativo | % (script) | — | `$id('mx-pr').textContent = (premio>0?'+':'')+fmt(premio,1)+'%';` |
| mx-di | Destino indicado pelo preço | — | — | `$id('mx-di').textContent = Math.abs(premio)<1.5 ? 'Indiferente' : (premio>0?'Açúcar':'Etanol');` |
| mx-de | Deslocamento executável | p.p. (script) | — | `$id('mx-de').textContent = (P.min===P.max) ? 'Nenhum' : ((desloc>0?'+':'')+fmt(desloc,0)+' p.p.');` |
| mx-bars | — | — | — | — |
| mx-vd | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Régua de mix açúcar-etanol" — "Régua"
  - intro: "é ele que define a faixa de alternância"
  - a fonte desenha: #mx-bars, com rótulos literais "Mix praticado · açúcar", "Mix praticado · etanol", "Teto físico · açúcar"
- **Desenho na fonte:** barras #mx-bars com rótulos literais de mix praticado e teto físico
- **O que precisa ser desenhado:** Uma régua de 0 a 100% de destinação ao açúcar com a faixa de alternância do perfil industrial sombreada entre o mínimo e o máximo, o mix já praticado marcado sobre ela e o destino indicado pelo preço como seta apontando para o limite daquela faixa. O comprimento da seta é o deslocamento executável.
- **Eixo x:** % do ATR destinado ao açúcar, de 0 a 100
- **Eixo y:** uma régua; as barras de mix praticado ficam abaixo dela
- **Séries:** faixa de alternância do perfil · mix praticado · destino indicado pelo preço · deslocamento executável
- **Relação que a figura tem de mostrar:** O preço diz para onde ir; o perfil industrial diz até onde dá. Uma destilaria autônoma tem faixa de um ponto só — e nesse caso o deslocamento executável é "Nenhum" por mais que o prêmio aponte. A régua com a faixa desenhada é o que impede a leitura de que preço alto move mix.
- **Derivação:** literal quanto aos três rótulos de barra e aos três perfis industriais; premio, alvo, atual e desloc são verbatim (linhas 3490–3493)
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância de resposta. Limiares de faixa do script estão em ramos_do_veredito.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Unidade de perfil misto equilibrado, ATR remunerado a R$ 1,18/kg no açúcar e R$ 1,26/kg no etanol, com mix já praticado de 48% para açúcar: para onde o preço aponta e quantos pontos percentuais são executáveis?
- **Cenário-padrão:** {"mx-pa-n":1.18,"mx-pe-n":1.26,"mx-mx-n":48}
- **Resposta no cenário-padrão:** Destino indicado: Etanol (prêmio relativo −6,6 %); deslocamento executável −18 p.p.; faixa de alternância 30 % a 65 %

**Avisos.**

- **Nota da fonte:** O p.disc declara que "as faixas usadas aqui são ilustrativas de perfil, não de qualquer planta específica" e que as remunerações por kg de ATR são entradas editáveis a reconstruir "com data e fonte".
- **Content QA (P20):** A fonte declara que as faixas são "ilustrativas de perfil, não de qualquer planta".

**Estado no código (informativo, não é camada fonte).** {"estado":"não portado","evidencia":{"MODULO_14_INSTRUMENTOS":"[] (vazio)","instruments_nas_aulas":"8 de 8 aulas com instruments: []","ids_da_fonte_em_calculators":[],"titulo_em_codigo":false},"catalo

### m14-inst-04 · Comparador de rotas de etanol — três rotas, sete dimensões

**Identidade.** INST·04 · — · tipo: comparador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Escolha a dimensão e compare as três rotas de etanol lado a lado. Cada dimensão traz uma coluna de ressalva de comparabilidade: a advertência do que precisa ser igualado antes de a comparação naquela dimensão significar alguma coisa. Comparar sem igualar a base é como comparar dois volumes de anos-safra diferentes.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| rt-dim | Dimensão de comparação: | — | — | — | — | Insumo / Sazonalidade / Fonte térmica / Coprodutos |
| rt-dim2 | — | — | — | — | — | Intensidade de carbono / Produto concorrente / Maturidade da rota |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| rt-out | — | — | — | — |
| rt-vd | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — cumprido em parte — a fonte compara as três rotas, mas só numa dimensão por vez, e o título promete sete
  - titulo: "Comparador de rotas de etanol — três rotas, sete dimensões" — as duas dimensões estão no título
  - intro: "Cada dimensão traz uma coluna de ressalva de comparabilidade"
  - a fonte monta a tabela de uma dimensão por vez (#rt-out)
- **Desenho na fonte:** tabela das três rotas para a dimensão ativa
- **O que precisa ser desenhado:** A matriz 3 × 7 inteira — três rotas nas linhas, sete dimensões nas colunas — com a célula ativa expandida e a coluna de ressalva de comparabilidade presente em todas as sete, porque o intro a declara obrigatória por dimensão.
- **Eixo x:** as sete dimensões (Insumo, Sazonalidade, Fonte térmica, Coprodutos, Intensidade de carbono, Produto concorrente, Maturidade da rota)
- **Eixo y:** as três rotas de etanol
- **Séries:** as 21 células · a ressalva de comparabilidade por dimensão
- **Relação que a figura tem de mostrar:** Nenhuma rota é melhor em todas as sete. A matriz completa mostra a troca; uma dimensão por vez permite sair com a impressão de que há uma vencedora.
- **Derivação:** literal quanto às sete dimensões e às três rotas
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância de resposta. Limiares de faixa do script estão em ramos_do_veredito.

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Comparação com ressalva: escolher a dimensão em que a comparação entre as três exige mais igualação prévia.

**Avisos.**

- **Nota da fonte:** Tabela qualitativa, sem número nem fonte.

**Estado no código (informativo, não é camada fonte).** {"estado":"não portado","evidencia":{"MODULO_14_INSTRUMENTOS":"[] (vazio)","instruments_nas_aulas":"8 de 8 aulas com instruments: []","ids_da_fonte_em_calculators":[],"titulo_em_codigo":false},"catalo

### m14-inst-05 · Calculadora de demanda derivada por conteúdo obrigatório

**Identidade.** INST·05 · — · tipo: calculadora

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “O percentual aqui carrega estado além de valor. Escolha primeiro o combustível base, depois o estado do percentual que você quer simular — e repare que o instrumento se recusa a tratar os quatro estados como equivalentes no veredito, mesmo quando o número digitado é o mesmo.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| dm-base | Combustível base: | — | — | — | — | Diesel B · biodiesel / Gasolina C · etanol anidro |
| dm-est | Estado do percentual simulado: | — | — | — | — | Em vigor / Teto legal autorizado / Anunciado / trajetória / Prazo vencido, não implementado |
| dm-vol-n | Volume do combustível base | bilhões de litros/ano | — | 60 | 1 – 90 / passo 0.1 | — |
| dm-pct-n | Percentual de mistura | % em volume | — | 15 | 0 – 40 / passo 0.5 | — |
| dm-cmp-n | Percentual de comparação | % em volume | — | 16 | 0 – 40 / passo 0.5 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| dm-q1 | Demanda derivada | bi L (script) | — | `$id('dm-q1').textContent=fmt(q1,2)+' bi L';` |
| dm-q2 | No percentual de comparação | bi L (script) | — | `$id('dm-q2').textContent=fmt(q2,2)+' bi L';` |
| dm-pp | Diferença por ponto | bi L / p.p. (script) | — | `$id('dm-pp').textContent=fmt(pp,2)+' bi L / p.p.';` |
| dm-fo | Base fóssil deslocada | bi L (script) | — | `$id('dm-fo').textContent=fmt(vol-q1,2)+' bi L';` |
| dm-vd | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - intro literal: "O percentual aqui carrega estado além de valor. […] o instrumento se recusa a tratar os quatro estados como equivalentes no veredito"
  - a fonte não desenha: quatro readouts e um veredito
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** Uma régua de percentual de mistura com os quatro estados marcados em posições distintas e com silhuetas distintas — em vigor, teto legal autorizado, anunciado ou em trajetória, prazo vencido e não implementado —, o percentual simulado e o percentual de comparação como duas marcas sobre ela, e a barra do volume derivado ao lado. Os quatro estados não podem parecer o mesmo tipo de marca: é a recusa de equivalência que o instrumento declara.
- **Eixo x:** percentual de mistura em volume, de 0 a 40%
- **Eixo y:** a régua, mais uma barra de volume em bilhões de litros
- **Séries:** os quatro estados do percentual · percentual simulado · percentual de comparação · demanda derivada · base fóssil deslocada
- **Relação que a figura tem de mostrar:** Só um dos quatro estados descreve litros efetivamente comercializados hoje — o veredito do cenário-padrão diz isso com todas as letras. Desenhar os quatro como pontos iguais numa mesma régua desfaria a distinção que o instrumento inteiro existe para fazer; por isso a silhueta de cada estado precisa ser diferente.
- **Derivação:** literal quanto aos dois combustíveis base, aos quatro estados e ao texto do veredito; q1, q2, pp e a comparação com a referência são verbatim (linhas 3640–3647)
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância de resposta. Limiares de faixa do script estão em ramos_do_veredito.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Diesel B com 60 bilhões de litros de base e percentual de mistura em vigor de 15%: qual a demanda derivada de biodiesel, e quanto muda por ponto percentual?
- **Cenário-padrão:** {"dm-vol-n":60,"dm-pct-n":15,"dm-cmp-n":16}
- **Resposta no cenário-padrão:** 9,00 bi L de demanda derivada; 0,60 bi L por ponto percentual; 51,00 bi L de base fóssil deslocada; estado coerente (percentual em vigor, valor conferido)

**Avisos.**

- **Fonte dos números:** Script: "Referência verificada em 2 de agosto de 2026 para este estado" + textos BASES[].not (citam a Lei nº 14.993/2024 e "resolução do conselho").
- **Nota da fonte:** O volume padrão (60 bilhões de litros) não tem fonte; o p.disc diz que o volume "está nas séries da agência" e o percentual "na resolução do conselho", a declarar pelo usuário.
- **Procedência declarada:** O script declara "Referência verificada em 2 de agosto de 2026 para este estado" e os textos por base.

**Estado no código (informativo, não é camada fonte).** {"estado":"não portado","evidencia":{"MODULO_14_INSTRUMENTOS":"[] (vazio)","instruments_nas_aulas":"8 de 8 aulas com instruments: []","ids_da_fonte_em_calculators":[],"titulo_em_codigo":false},"catalo

### m14-inst-06 · Simulador de cogeração sazonal — as três grandezas lado a lado

**Identidade.** INST·06 · — · tipo: simulador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “O instrumento que resolve a frase "energia firme na safra". Ajuste potência instalada, dias efetivos de safra, autoconsumo de processo e disponibilidade da planta, e veja as três grandezas simultaneamente — nunca apenas a que parecer mais impressionante. O veredito cruza fator de capacidade anual com dias de safra e re”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| cg-pot-n | Potência instalada | MW | — | 80 | 5 – 300 / passo 1 | — |
| cg-dia-n | Dias efetivos de safra | dias/ano | — | 210 | 60 – 365 / passo 1 | — |
| cg-aut-n | Autoconsumo de processo | % da geração bruta | — | 55 | 0 – 95 / passo 1 | — |
| cg-dis-n | Disponibilidade na safra | % das horas | — | 88 | 30 – 100 / passo 1 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| cg-p1 | Potência instalada | MW (script) | — | `$id('cg-p1').textContent=fmt(pot,0)+' MW';` |
| cg-p2 | Energia gerada | GWh (script) | — | `$id('cg-p2').textContent=fmt(ger,0)+' GWh';` |
| cg-p3 | Energia exportada | GWh (script) | — | `$id('cg-p3').textContent=fmt(exp,0)+' GWh';` |
| cg-fc | Fator de capacidade anual | % (script) | — | `$id('cg-fc').textContent=fmt(fca,1)+'%';` |
| cg-fs | FC dentro da safra | % (script) | — | `$id('cg-fs').textContent=fmt(fcs,1)+'%';` |
| cg-bars | — | — | — | — |
| cg-vd | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Simulador de cogeração sazonal — as três grandezas lado a lado" — o arranjo está no título
  - intro: "veja as três grandezas simultaneamente — nunca apenas a que parecer maior"
  - a fonte desenha: #cg-bars, com rótulos literais "Teto teórico anual", "Energia gerada", "Energia exportada"
- **Desenho na fonte:** barras #cg-bars com os três rótulos literais
- **O que precisa ser desenhado:** As três grandezas como barras encaixadas na mesma escala — o teto teórico anual como a maior, a energia gerada dentro dele e a exportada dentro dela — e, ao lado, uma régua de percentual com as duas leituras de fator de capacidade: a anual e a de dentro da safra.
- **Eixo x:** GWh na primeira leitura; % na segunda
- **Eixo y:** as três grandezas encaixadas; as duas leituras de fator de capacidade
- **Séries:** Teto teórico anual · Energia gerada · Energia exportada · fator de capacidade anual · fator de capacidade dentro da safra
- **Relação que a figura tem de mostrar:** A mesma planta tem dois fatores de capacidade porque tem dois denominadores — o ano inteiro e a safra. A frase "energia firme na safra" só se verifica com os dois na tela; com um só, ela é sempre verdadeira ou sempre falsa conforme qual foi escolhido.
- **Derivação:** literal quanto aos três rótulos de barra; hs, ger, exp, fca e fcs são verbatim (linhas 3704–3708)
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância de resposta. Limiares de faixa do script estão em ramos_do_veredito.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Cogeração de 80 MW instalados, 210 dias efetivos de safra, 55% de autoconsumo de processo e 88% de disponibilidade na safra: qual o fator de capacidade anual e qual o fator de capacidade dentro da safra?
- **Cenário-padrão:** {"cg-pot-n":80,"cg-dia-n":210,"cg-aut-n":55,"cg-dis-n":88}
- **Resposta no cenário-padrão:** 22,8 % anual e 39,6 % dentro da safra (energia gerada 355 GWh; exportada 160 GWh; teto teórico anual 701 GWh)

**Avisos.**

- **Nota da fonte:** O p.disc declara: "Nenhum número aqui descreve nenhuma unidade específica". Os padrões (80 MW, 210 dias, 55%, 88%) são os mesmos do Ex 02, da Q04 do quiz e do enunciado e7 do INST·10.
- **Content QA (P20):** A fonte declara: "Nenhum número aqui descreve nenhuma unidade específica."

**Estado no código (informativo, não é camada fonte).** {"estado":"não portado","evidencia":{"MODULO_14_INSTRUMENTOS":"[] (vazio)","instruments_nas_aulas":"8 de 8 aulas com instruments: []","ids_da_fonte_em_calculators":[],"titulo_em_codigo":false},"catalo

### m14-inst-07 · Régua de biometano — escala mínima e rota de entrega

**Identidade.** INST·07 · — · tipo: simulador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Escolha a rota de entrega e ajuste volume, distância até o cliente e preço líquido na planta. O instrumento devolve energia entregue, custo logístico incremental e a margem por metro cúbico normal — e recusa concluir sobre viabilidade a partir do preço isolado, porque a mesma tarifa por Nm³ significa coisas opostas em ”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| bm-rota | Rota de entrega: | — | — | — | — | Térmica local / Comprimido em carreta / Injeção em rede / Veicular dedicado |
| bm-vol-n | Volume vendável | milhões de Nm³/ano | — | 15 | 0.5 – 60 / passo 0.1 | — |
| bm-dis-n | Distância até o cliente | km | — | 80 | 0 – 600 / passo 5 | — |
| bm-prc-n | Preço líquido na planta | R$/Nm³ | — | 2.3 | 0.5 – 6 / passo 0.05 | — |
| bm-opx-n | Custo operacional na planta | R$/Nm³ | — | 0.85 | 0.2 – 4 / passo 0.05 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| bm-en | Energia entregue | TJ/ano (script) | — | `$id('bm-en').textContent=fmt(en,0)+' TJ/ano';` |
| bm-lg | Custo logístico | R$/Nm³ (script) | — | `$id('bm-lg').textContent='R$ '+fmt(log,2)+'/Nm³';` |
| bm-mg | Margem unitária | R$/Nm³ (script) | — | `$id('bm-mg').textContent='R$ '+fmt(mg,2)+'/Nm³';` |
| bm-es | Escala mínima da rota | mi Nm³/ano (script) | — | `$id('bm-es').textContent=fmt(R1.esc,0)+' mi Nm³/ano';` |
| bm-vd | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Régua de biometano — escala mínima e rota de entrega" — "Régua" e "escala mínima"
  - a fonte não desenha: cinco readouts de texto
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** Uma régua de volume vendável com a escala mínima da rota escolhida marcada como limiar e o volume informado como marca; abaixo, a decomposição da margem unitária como cascata: preço líquido na planta, menos custo operacional, menos custo logístico incremental, igual margem. Trocar a rota move o limiar e a parcela logística ao mesmo tempo.
- **Eixo x:** na régua, milhões de Nm³/ano; na cascata, R$/Nm³
- **Eixo y:** a régua, mais a cascata de três degraus
- **Séries:** escala mínima da rota · volume vendável informado · preço líquido na planta · custo operacional · custo logístico = fixo + km × distância · margem unitária
- **Relação que a figura tem de mostrar:** A rota decide duas coisas ao mesmo tempo — a escala mínima e a inclinação do custo logístico com a distância. Um instrumento que devolve cinco números soltos deixa essa dupla dependência implícita; a régua com o limiar e a cascata com a parcela logística a tornam a leitura principal.
- **Derivação:** derivado do código-fonte (log = R1.fix + R1.km×dis; mg = prc − opx − log; en = vol×36/1000, verbatim, linhas 3797–3799)
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância de resposta. Limiares de faixa do script estão em ramos_do_veredito.

**Previsão (C3).**

- **Útil:** não. BLOQUEADA por divergência aritmética não reconciliada (ver abaixo). Não formular pergunta de previsão sobre energia entregue antes da reconciliação.
- **BLOQUEIO:** reconciliacao-pendente — não formular a pergunta antes da reconciliação.

**Avisos.**

- **Nota da fonte:** O p.disc declara que os parâmetros logísticos por rota "são ilustrativos de ordem de grandeza ... não são benchmark de mercado nem devem ser citados como tal". PCI fixo de 36 MJ/Nm³ no script (comentário "a 36 MJ/Nm3"), sem fonte.
- **Content QA (P20):** A fonte declara que os parâmetros logísticos por rota são ilustrativos de ordem de grandeza.
- **Divergência (P5/P8):** Registrado no README do M14: o instrumento mostra "1 TJ/ano" no cenário-padrão, enquanto o Ex 08 implica 540 TJ — a expressão en = vol × 36 / 1000 carrega uma divisão a mais dado que o volume entra em milhões de Nm³. As duas leituras ficam preservadas (P5/P8). O readout de energia entregue não pode ser portado como está nem usado como resposta de referência.

**Estado no código (informativo, não é camada fonte).** {"estado":"não portado","evidencia":{"MODULO_14_INSTRUMENTOS":"[] (vazio)","instruments_nas_aulas":"8 de 8 aulas com instruments: []","ids_da_fonte_em_calculators":[],"titulo_em_codigo":false},"catalo

### m14-inst-08 · Régua de crédito de descarbonização

**Identidade.** INST·08 · — · tipo: simulador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Escolha a rota certificada e ajuste volume comercializado, diferencial de intensidade de carbono e preço corrente. O instrumento devolve a ordem de grandeza de créditos emissíveis e a receita associada — e o veredito recusa tratar essa receita como firme sem elegibilidade, certificação vigente e titularidade contratada”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| cb-rota | Rota certificada: | — | — | — | — | Etanol de cana 1G / Etanol de milho / Biodiesel / Biometano |
| cb-cert | Estado da certificação: | — | — | — | — | Certificado vigente / Em renovação / Sem certificação |
| cb-vol-n | Volume elegível comercializado | milhões de litros ou Nm³/ano | — | 100 | 1 – 500 / passo 1 | — |
| cb-dic-n | Diferencial de intensidade de carbono | gCO₂e/MJ | — | 55 | 5 – 95 / passo 1 | — |
| cb-prc-n | Preço corrente do crédito | R$/crédito · editável | — | 30 | 5 – 250 / passo 1 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| cb-en | Energia comercializada | TJ (script) | — | `$id('cb-en').textContent=fmt(energiaMJ/1e6,0)+' TJ';` |
| cb-ev | Emissões evitadas | t CO₂e (script) | — | `$id('cb-ev').textContent=fmt(evit,0)+' t CO₂e';` |
| cb-qt | Créditos · teto conceitual | unid. (script) | — | `$id('cb-qt').textContent=C1.f?fmt(qt,0)+' '+(rk==='bmet'?'unid.':'CBIO'):'0';` |
| cb-rc | Receita associada | R$ mi (script) | — | `$id('cb-rc').textContent='R$ '+fmt(rec/1e6,2)+' mi';` |
| cb-mg | Sobre a margem do produto | R$/L (script) | — | `$id('cb-mg').textContent='R$ '+fmt(unit,3)+'/'+(rk==='bmet'?'Nm³':'L');` |
| cb-vd | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Régua de crédito de descarbonização" — "Régua"
  - intro: "o veredito recusa tratar essa receita como pilar"
  - a fonte não desenha: seis readouts de texto
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** Uma cascata: energia comercializada, emissões evitadas, créditos emissíveis no teto conceitual, receita associada — e, no fim, a mesma receita expressa por unidade de produto, ao lado da margem do produto, para que a proporção entre as duas fique visível. O estado da certificação entra como porta antes do primeiro degrau: sem certificação, a cascata não começa.
- **Eixo x:** os degraus da cascata, cada um na sua unidade declarada
- **Eixo y:** valor do degrau
- **Séries:** energia comercializada (TJ) · emissões evitadas (t CO₂e) · créditos no teto conceitual · receita associada (R$ mi) · receita por unidade de produto contra a margem
- **Relação que a figura tem de mostrar:** O veredito do cenário-padrão diz "complemento de receita, não pilar". Essa é uma afirmação de proporção, e proporção se vê em cascata, comparando o último degrau com a margem do produto — nunca lendo a receita absoluta sozinha.
- **Derivação:** derivado do código-fonte (energiaMJ, evit, qt, rec, verbatim, linhas 3883–3886)
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância de resposta. Limiares de faixa do script estão em ramos_do_veredito.

**Previsão (C3).**

- **Útil:** não. BLOQUEADA por divergência não reconciliada (ver abaixo).
- **BLOQUEIO:** reconciliacao-pendente — não formular a pergunta antes da reconciliação.

**Avisos.**

- **Fonte dos números:** p.disc: "Fonte e data do preço: ordem de grandeza observada no primeiro semestre de 2026, a partir de análise de mercado sobre dados da bolsa registradora; consulta em 2 de agosto de 2026." § Ref item 29 (B3) diz que é a referência que deve substituir o valor padrão.
- **Nota da fonte:** Só o preço tem fonte declarada. Densidades (mj) e intensidades fósseis de referência (ref) são "valores de referência" sem documento citado.
- **Procedência declarada:** A fonte declara: "Fonte e data do preço: ordem de grandeza observada no primeiro semestre de 2026."
- **Divergência (P5/P8):** Registrado no README do M14: a entrada "Diferencial de intensidade de carbono" tem unidade gCO₂e/MJ e é usada no cálculo como percentual (dic/100), e o resultado de emissões evitadas aparece como 102.389 t e como 116.050 t em leituras diferentes. As duas ficam preservadas (P5/P8). Reconciliar antes de portar o readout.

**Estado no código (informativo, não é camada fonte).** {"estado":"não portado","evidencia":{"MODULO_14_INSTRUMENTOS":"[] (vazio)","instruments_nas_aulas":"8 de 8 aulas com instruments: []","ids_da_fonte_em_calculators":[],"titulo_em_codigo":false},"catalo

### m14-inst-09 · Classificador de insumo — rota, produto, órgão e concorrente

**Identidade.** INST·09 · — · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Produto cartesiano completo: cada insumo cruzado com cada destino tecnicamente possível. Escolha o insumo e depois o destino; o painel devolve rota, produto, órgão competente, onde entra na matriz e — a informação que quase nunca acompanha o número — o que deixou de ser feito com aquele mesmo insumo.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| cl-ins | Insumo de partida: | — | — | — | — | Cana-de-açúcar / Bagaço e palha / Milho / Óleo e gordura / Resíduo orgânico |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| cl-dest | — | — | — | — |
| cl-out | — | — | — | — |
| cl-vd | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - intro literal: "Produto cartesiano completo: cada insumo cruzado com cada destino tecnicamente possível"
  - a fonte gera os chips de destino com a etiqueta de aplicabilidade literal: consolidado, indireto, não se aplica, marginal
  - a fonte não desenha a grade: mostra um insumo por vez
- **Desenho na fonte:** chips de destino com etiqueta de aplicabilidade (#cl-dest)
- **O que precisa ser desenhado:** A grade insumo × destino inteira, com cada célula marcada pela etiqueta de aplicabilidade que a própria fonte atribui — consolidado, indireto, marginal, não se aplica — e a célula ativa abrindo abaixo com rota, produto, órgão competente, lugar na matriz e o concorrente.
- **Eixo x:** os destinos (Açúcar, Etanol, Vapor e eletricidade, Biometano, Biodiesel e diesel renovável, Ração e alimento, e os demais do array DEST)
- **Eixo y:** os insumos de partida (Cana-de-açúcar, Bagaço e palha, Milho, Óleo e gordura, Resíduo orgânico)
- **Séries:** as células do produto cartesiano · etiqueta de aplicabilidade por célula
- **Relação que a figura tem de mostrar:** "Não se aplica" é resposta, e é a mais informativa das quatro etiquetas: ela diz que a rota não existe tecnicamente, e não que faltou informação. A grade completa é o que torna as células vazias impossíveis — a fonte declara que o produto é completo, e uma tela por insumo esconde isso.
- **Derivação:** literal quanto aos cinco insumos, aos destinos e às quatro etiquetas de aplicabilidade
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância de resposta. Limiares de faixa do script estão em ramos_do_veredito.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Partindo da cana-de-açúcar: quais destinos são consolidados, quais são indiretos e qual não se aplica?
- **Cenário-padrão:** {}
- **Resposta no cenário-padrão:** Consolidados: Açúcar e Etanol; indiretos: Vapor e eletricidade, Biometano; não se aplica: Biodiesel e diesel renovável; marginal: Ração e alimento

**Avisos.**

- **Nota da fonte:** Tabela qualitativa sem fonte. Uma entrada cita "primeiro agente certificador de origem credenciado em abril de 2026".

**Estado no código (informativo, não é camada fonte).** {"estado":"não portado","evidencia":{"MODULO_14_INSTRUMENTOS":"[] (vazio)","instruments_nas_aulas":"8 de 8 aulas com instruments: []","ids_da_fonte_em_calculators":[],"titulo_em_codigo":false},"catalo

### m14-inst-10 · Verificador de base temporal e rota — instrumento assinatura

**Identidade.** INST·10 · — · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Doze enunciados. Escolha um, decida qual o defeito, e confira. O painel devolve o defeito dominante, o que exatamente falta, a pergunta que você faria ao interlocutor, e a forma corrigida do enunciado.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| vf-tipo | Filtrar por tipo de defeito: | — | — | — | — | Todos / Base temporal / Rota não declarada / Grandeza confundida / Concorrente omitido |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| vf-chips | — | — | — | — |
| vf-panel | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Verificador de base temporal e rota — instrumento assinatura" — verifica
  - as saídas são chips filtrados e um painel
- **Sem promessa, mas (C6):** Os doze enunciados se distribuem por quatro tipos de defeito, e o filtro já os agrupa. Uma grade doze × quatro com o defeito dominante marcado mostraria a distribuição — mas ela também entregaria a resposta antes da tentativa, o que C7 proíbe. Aqui a ausência de figura é acerto, não dívida: a grade só pode aparecer depois da tentativa registrada.
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância de resposta. Limiares de faixa do script estão em ramos_do_veredito.
- **Por que não pedir:** Classificação categórica com gabarito declarado: acerta ou não acerta a categoria. Não há grandeza contínua para tolerar.

**Previsão (C3).**

- **Útil:** sim. C3 e C7 em estado puro: o intro manda "decida qual o defeito, e confira". A tentativa vem antes da referência por construção.
- **Pergunta (camada Alexandria):** Enunciado: "A gasolina brasileira tem 30% de etanol anidro." Qual é o defeito dominante — base temporal, rota não declarada, grandeza confundida ou concorrente omitido?
- **Cenário-padrão:** {}
- **Resposta no cenário-padrão:** Base temporal (a etiqueta do chip é "base temporal"); o que falta, a pergunta a fazer e a forma corrigida estão no painel

**Avisos.**

- **Fonte dos números:** p.disc: "Os doze enunciados são construídos a partir de dados reais verificados em 2 de agosto de 2026"
- **Nota da fonte:** Nenhum enunciado cita documento; os números (40,69; 35,94; 5,9%; 3,1%; 8,5%; 5,3%) coincidem com a prosa das aulas e com o § Ref (Conab, ANP), sem vínculo declarado.
- **Procedência declarada:** A fonte declara: "Os doze enunciados são construídos a partir de dados reais verificados em 2 de agosto de 2026."

**Estado no código (informativo, não é camada fonte).** {"estado":"não portado","evidencia":{"MODULO_14_INSTRUMENTOS":"[] (vazio)","instruments_nas_aulas":"8 de 8 aulas com instruments: []","ids_da_fonte_em_calculators":[],"titulo_em_codigo":false},"catalo


## M15

### m15-inst-01 · Mapa da cadeia · quatro reagrupamentos

**Identidade.** INST·01 · §MAP · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Escolha a dimensão de agrupamento. Os nove elos são sempre os mesmos; o que muda é a pergunta. Clique em um elo para abrir a ficha resumida — regime, órgão competente, grandeza medida, natureza do preço e o que aquele número não diz.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| mp-dim | Agrupar por | — | seg (botões exclusivos) | seg | — | Segmento / Regime jurídico / Acoplamento elétrico / Natureza do preço |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| mp-flux | — | — | — | — |
| mp-panel | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Mapa da cadeia · quatro reagrupamentos" — "Mapa" e o número de reagrupamentos
  - intro: "Os nove elos são sempre os mesmos; o que muda é a pergunta"
  - a fonte desenha: #mp-flux, cadeia de blocos gerada pelo script
- **Desenho na fonte:** cadeia #mp-flux + painel de ficha #mp-panel
- **O que precisa ser desenhado:** Os nove elos sempre presentes, reagrupados pela dimensão ativa — segmento, regime jurídico, acoplamento elétrico, natureza do preço — com o elo escolhido abrindo a ficha resumida abaixo. O reagrupamento tem de ser visível como movimento dos mesmos nove, não como uma lista nova.
- **Eixo x:** a cadeia, na ordem do agrupamento ativo
- **Eixo y:** os nove elos, sempre os mesmos
- **Séries:** os nove elos · a dimensão de agrupamento ativa · ficha do elo: regime, órgão competente, grandeza medida, natureza do preço, e o que o número não diz
- **Relação que a figura tem de mostrar:** "Os nove elos são sempre os mesmos; o que muda é a pergunta" — frase literal do intro. Se o learner vê listas diferentes, o instrumento afirmou o contrário do que diz.
- **Derivação:** literal quanto aos quatro rótulos de agrupamento e à contagem de nove elos
- **Reúso:** Mesma figura do m10-inst-01, m11-inst-01, m13-inst-01 e m14-inst-01.
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, margem de acerto nem gabarito numérico para nenhum instrumento (P6/P19).

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Condição a encontrar: achar o elo cuja natureza do preço muda conforme o regime jurídico.

**Avisos.**

- **Fonte dos números:** Fonte da estrutura: Lei nº 9.478/1997 e Lei nº 12.351/2010 para os regimes de E&P; Lei nº 14.134/2021 e Decreto nº 10.712/2021, alterado pelo Decreto nº 12.153/2024, para transporte e infraestruturas essenciais de gás; competência estadual de distribuição de gás canalizado do art. 25, §2º da Constituição. Consulta em 4 de agosto de 2026.
- **Procedência declarada:** Fonte da estrutura declarada: Lei nº 9.478/1997 e Lei nº 12.351/2010 para os regimes de E&P, entre outras.
- **Divergência (P5/P8):** Registrado no README do M15: os nove elos do §MAP e os do INST·01 divergem na dimensão "natureza do preço" — 4 grupos contra 9 valores. P8/P5.

**Estado no código (informativo, não é camada fonte).** {"arquivo":"src/lib/data/alexandria-modulo-15-content.ts","linha_aprox":749,"onde":"MODULO_15_INSTRUMENTOS (fora de aula)","kind":"explorador","n_campos":2,"n_saidas":0,"calculadora":"alexandria-instr

### m15-inst-02 · Comparador de regimes

**Identidade.** INST·02 · Aula 01 · tipo: comparador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Escolha um regime e uma dimensão de comparação. Toda dimensão devolve, além da resposta, uma ressalva de comparabilidade: o que muda, naquela dimensão, quando você tenta comparar dois números produzidos sob regimes diferentes.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| rg-reg | Regime | — | seg (botões exclusivos) | conc | — | Concessão / Partilha / Cessão onerosa |
| rg-dim | Dimensão | — | seg (botões exclusivos) | tit | — | Titularidade da molécula / O que o Estado recebe / Como se disputa a área / Quem corre o risco |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| rg-out | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Comparador de regimes" — "Comparador"
  - intro: "Toda dimensão devolve, além da resposta, uma ressalva de comparabilidade"
  - a fonte não desenha: um cartão por cruzamento
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** A matriz 3 × 4 — concessão, partilha e cessão onerosa nas linhas; titularidade da molécula, o que o Estado recebe, como se disputa a área e quem corre o risco nas colunas — com a célula ativa aberta e a ressalva de comparabilidade visível na coluna, não escondida no veredito.
- **Eixo x:** as quatro dimensões
- **Eixo y:** os três regimes
- **Séries:** as doze células · ressalva de comparabilidade por dimensão
- **Relação que a figura tem de mostrar:** A ressalva não é um rodapé: ela diz o que precisa ser igualado antes de os números de dois regimes poderem ser comparados. Na matriz, a ressalva ocupa a coluna e vale para os três regimes ao mesmo tempo — que é o estatuto correto dela.
- **Derivação:** literal quanto aos três regimes e às quatro dimensões
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, margem de acerto nem gabarito numérico para nenhum instrumento (P6/P19).

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Comparação com ressalva: percorrer "o que o Estado recebe" nos três regimes e dizer por que a soma não é comparável entre eles.

**Avisos.**

- **Fonte dos números:** Fontes: Lei nº 9.478/1997 (concessão); Lei nº 12.351/2010 e Lei nº 12.304/2010 (partilha e PPSA); Lei nº 12.276/2010 (cessão onerosa); editais vigentes de Oferta Permanente de Concessão e de Partilha. Distribuição por regime das áreas produtoras conforme Boletim Mensal da Produção da ANP referente a junho de 2026, divulgado em 3 de agosto de 2026. Consulta em 4 de agosto de 2026.
- **Procedência declarada:** Fontes declaradas: Lei nº 9.478/1997 (concessão); Lei nº 12.351/2010 e Lei nº 12.304/2010 (partilha).

**Estado no código (informativo, não é camada fonte).** {"arquivo":"src/lib/data/alexandria-modulo-15-content.ts","linha_aprox":403,"onde":"aula-15-01","kind":"comparador","n_campos":2,"n_saidas":0,"calculadora":"alexandria-instrument-calculators.ts → 'm15

### m15-inst-03 · Régua de grandeza de subsolo

**Identidade.** INST·03 · Aula 02 · tipo: simulador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Informe um volume provado e as razões típicas entre critérios da sua carteira. O instrumento devolve a mesma jazida sob os três critérios lado a lado, calcula R/P e IRR, e se recusa a emitir veredito quando falta a data de certificação — porque um volume de reserva sem data de referência não é um número, é uma afirmaçã”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| gs-1p-n | Reserva provada · 1P | bi bbl | number+range | 17.488 | 0.1 – 120 / passo 0.001 | — |
| gs-2p-n | Razão 2P / 1P | × | number+range | 1.387 | 1 – 3 / passo 0.001 | — |
| gs-3p-n | Razão 3P / 1P | × | number+range | 1.651 | 1 – 4 / passo 0.001 | — |
| gs-pd-n | Produção anual | bi bbl/ano | number+range | 1.38 | 0.01 – 6 / passo 0.001 | — |
| gs-ad-n | Adições líquidas 1P no ano | bi bbl | number+range | 2.023 | 0 – 8 / passo 0.001 | — |
| gs-dt | Data de certificação declarada na fonte | — | seg (botões exclusivos) | sim | — | Sim — data de referência conhecida / Não — a fonte não declara |
| gs-cr | Critério citado pela fonte | — | seg (botões exclusivos) | p1 | — | 1P · provada / 2P / 3P / Não declarado |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| gs-v1 | Volume sob 1P | — | — | — |
| gs-v2 | Volume sob 2P | — | — | — |
| gs-v3 | Volume sob 3P | — | — | — |
| gs-am | Amplitude entre critérios | % (script) | — | — |
| gs-rp | R/P sobre o critério citado | anos (script) | — | — |
| gs-ir | IRR do período | % (script) | — | — |
| gs-bars | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Régua de grandeza de subsolo" — "Régua"
  - intro: "devolve a mesma jazida sob os três critérios lado a lado" — o arranjo está escrito
  - a fonte desenha: #gs-bars
- **Desenho na fonte:** barras #gs-bars
- **O que precisa ser desenhado:** Três barras encaixadas na mesma escala — 1P, 2P e 3P da mesma jazida — com a amplitude entre a menor e a maior marcada, e o critério efetivamente citado pela fonte destacado entre as três. Quando a data de certificação não é declarada, a figura mostra as três barras e recusa o veredito, que é o que o instrumento faz.
- **Eixo x:** bilhões de barris
- **Eixo y:** os três critérios
- **Séries:** volume sob 1P · volume sob 2P · volume sob 3P · amplitude entre critérios · critério citado pela fonte · estado da data de certificação
- **Relação que a figura tem de mostrar:** A mesma jazida vale 17,5 ou 28,9 bilhões de barris conforme o critério — 65,1% de amplitude no cenário-padrão. Citar um volume sem o critério é citar um número dentro de uma faixa larga como se fosse o número. Três barras lado a lado é a forma que torna a omissão visível.
- **Derivação:** literal quanto aos três critérios e à frase "lado a lado" do intro; os cálculos de volume, R/P e IRR são verbatim
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, margem de acerto nem gabarito numérico para nenhum instrumento (P6/P19).

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Reserva provada de 17,488 bi bbl, com razão 2P/1P de 1,387 e 3P/1P de 1,651: qual a amplitude entre o menor e o maior critério?
- **Cenário-padrão:** {"gs-1p-n":17.488,"gs-2p-n":1.387,"gs-3p-n":1.651,"gs-pd-n":1.38,"gs-ad-n":2.023,"gs-dt":"sim","gs-cr":"p1"}
- **Resposta no cenário-padrão:** +65,1 % (1P 17,488 bi; 2P 24,256 bi; 3P 28,873 bi; R/P sobre o critério citado 12,7 anos)

**Avisos.**

- **Fonte dos números:** Valores iniciais: reservas brasileiras declaradas à ANP com data de referência em 31/12/2025, publicadas no Boletim Anual de Recursos e Reservas em 10/04/2026. Razões 2P/1P e 3P/1P calculadas a partir dos volumes publicados. Produção anual e adições líquidas de 2025. Todos os campos são editáveis: substitua pelos números da carteira que você estiver lendo. Consulta em 4 de agosto de 2026.
- **Procedência declarada:** Valores iniciais declarados: reservas brasileiras declaradas à ANP com data de referência em 31/12/2025.
- **Divergência (P5/P8):** Registrado no README do M15: a IRR do período aparece como 146,6% e como 147,03%. P8/P5.

**Estado no código (informativo, não é camada fonte).** {"arquivo":"src/lib/data/alexandria-modulo-15-content.ts","linha_aprox":437,"onde":"aula-15-02","kind":"simulador","n_campos":7,"n_saidas":6,"calculadora":"alexandria-instrument-calculators.ts → 'm15-

### m15-inst-04 · Calculadora de parcela do Estado

**Identidade.** INST·04 · Aula 03 · tipo: calculadora

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Todos os parâmetros são editáveis, inclusive as alíquotas — porque nenhum deles é constante e porque alíquota efetiva não é alíquota nominal. O instrumento devolve royalty e participação especial separadamente, e o veredito se recusa a ler a receita fiscal por um único sinal: precisa de volume, preço e câmbio ao mesmo ”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| pe-vol-n | Produção do campo | mil bbl/d | number+range | 180 | 1 – 1200 / passo 1 | — |
| pe-pr-n | Preço de referência | US$/bbl | number+range | 80.61 | 20 – 160 / passo 0.01 | — |
| pe-cx-n | Câmbio | R$/US$ | number+range | 5.26 | 2.5 – 9 / passo 0.01 | — |
| pe-al-n | Alíquota de royalty | % | number+range | 10 | 5 – 15 / passo 0.1 | — |
| pe-de-n | Deduções sobre a receita bruta | % da receita | number+range | 45 | 10 – 90 / passo 0.5 | — |
| pe-pa-n | Alíquota de participação especial | % | number+range | 25 | 0 – 40 / passo 0.5 | — |
| pe-rep | Desenho de repartição aplicável | — | seg (botões exclusivos) | ter | — | Campo terrestre / Marítimo · comercialidade após 12/2012 / Marítimo no polígono · comercialidade anterior |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| pe-rb | Receita bruta anual | R$ bi (script) | — | — |
| pe-ry | Royalty anual | R$ bi (script) | — | — |
| pe-ps | Participação especial anual | R$ bi (script) | — | — |
| pe-tk | Parcela do Estado sobre a receita | % (script) | — | — |
| pe-es | Aos estados | R$ bi (script) | — | — |
| pe-mu | Aos municípios | R$ bi (script) | — | — |
| pe-bars | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Calculadora de parcela do Estado"
  - intro: "devolve royalty e participação especial separadamente"
  - a fonte desenha: #pe-bars
- **Desenho na fonte:** barras #pe-bars
- **O que precisa ser desenhado:** Uma barra da receita bruta anual partida em royalty, participação especial e o que resta ao concessionário, com a parcela do Estado somada e rotulada em percentual; ao lado, a repartição dessa parcela entre estados e municípios conforme o desenho selecionado.
- **Eixo x:** R$ bi por ano
- **Eixo y:** uma barra de composição e uma de repartição
- **Séries:** receita bruta · royalty · participação especial · parcela do Estado sobre a receita · aos estados · aos municípios
- **Relação que a figura tem de mostrar:** Royalty e participação especial incidem sobre bases diferentes — um sobre a receita bruta, outro sobre a receita depois das deduções. Desenhar as duas na mesma barra mostra por que mexer nas deduções move uma e não move a outra.
- **Derivação:** derivado do código-fonte (as seis entradas e os seis readouts são verbatim, linhas 3579 em diante)
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, margem de acerto nem gabarito numérico para nenhum instrumento (P6/P19).

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Campo terrestre produzindo 180 mil bbl/d a US$ 80,61/bbl, câmbio de R$ 5,26, royalty de 10%, deduções de 45% da receita bruta e alíquota de participação especial de 25%: qual a parcela do Estado sobre a receita?
- **Cenário-padrão:** {"pe-vol-n":180,"pe-pr-n":80.61,"pe-cx-n":5.26,"pe-al-n":10,"pe-de-n":45,"pe-pa-n":25,"pe-rep":"ter"}
- **Resposta no cenário-padrão:** 21,3 % (receita bruta R$ 27,9 bi; royalty R$ 2,79 bi; participação especial R$ 3,13 bi; aos estados R$ 2,37 bi; aos municípios R$ 0,59 bi)

**Avisos.**

- **Fonte dos números:** Modelo didático simplificado, não regime legal: as alíquotas reais de participação especial são progressivas por faixa e variam com a localização da lavra, o número de anos de produção e o volume trimestral fiscalizado, e as deduções seguem regra própria. Percentuais de repartição conforme art. 50 da Lei nº 9.478/1997 e Lei nº 12.858/2013. Preço e câmbio iniciais correspondem à média da referência
- **Content QA (P20):** A fonte declara: "Modelo didático simplificado, não regime legal: as alíquotas reais de participação especial…". Manter o aviso junto (S4/P19).

**Estado no código (informativo, não é camada fonte).** {"arquivo":"src/lib/data/alexandria-modulo-15-content.ts","linha_aprox":481,"onde":"aula-15-03","kind":"calculadora","n_campos":7,"n_saidas":6,"calculadora":"alexandria-instrument-calculators.ts → 'm1

### m15-inst-05 · Decompositor de preço de combustível

**Identidade.** INST·05 · Aula 04 · tipo: calculadora

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Cada camada é entrada editável, inclusive a subvenção — que entra com sinal negativo. O instrumento devolve a composição, a participação percentual de cada camada e um veredito que se recusa a atribuir a variação a uma única camada sem que você tenha mexido em uma só.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| cb-p4-n | Preço do produtor · camada 4 | R$/litro | number+range | 3.1 | 0.5 – 6 / passo 0.01 | — |
| cb-bi-n | Biocombustível de mistura | R$/litro | number+range | 0.62 | 0 – 2 / passo 0.01 | — |
| cb-tf-n | Tributos federais | R$/litro | number+range | 0.42 | 0 – 2 / passo 0.01 | — |
| cb-te-n | Tributo estadual | R$/litro | number+range | 1.47 | 0 – 3 / passo 0.01 | — |
| cb-dr-n | Distribuição e revenda | R$/litro | number+range | 0.98 | 0 – 3 / passo 0.01 | — |
| cb-sb-n | Subvenção econômica | R$/litro · negativa | number+range | 0 | 0 – 1.2 / passo 0.01 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| cb-tot | Preço final estimado | R$/L (script) | — | — |
| cb-pp | Parcela do produtor | % (script) | — | — |
| cb-ct | Carga tributária total | % (script) | — | — |
| cb-pb | Parcela de biocombustível | % (script) | — | — |
| cb-pd | Parcela de distribuição e revenda | % (script) | — | — |
| cb-bar | — | — | — | — |
| cb-lg | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Decompositor de preço de combustível" — decompor é partir uma grandeza em parcelas
  - intro: "devolve a composição, a participação percentual de cada camada"
  - a fonte desenha: barra #cb-bar mais legenda #cb-lg
- **Desenho na fonte:** barra de composição #cb-bar + legenda #cb-lg
- **O que precisa ser desenhado:** Uma barra única do preço final em R$/L, partida nas camadas que a fonte nomeia — preço do produtor, biocombustível de mistura, tributos federais, tributo estadual, distribuição e revenda — com a subvenção econômica entrando com sinal negativo, abaixo da linha do zero, porque é assim que a fonte a declara.
- **Eixo x:** R$ por litro, com o zero visível por causa da subvenção
- **Eixo y:** uma barra única de composição
- **Séries:** preço do produtor · biocombustível de mistura · tributos federais · tributo estadual · distribuição e revenda · subvenção econômica (negativa)
- **Relação que a figura tem de mostrar:** O veredito se recusa a atribuir a variação do preço final a uma única camada. Uma barra composta com todas as camadas visíveis é o que sustenta essa recusa: qualquer camada pode se mover, e o total é a soma.
- **Derivação:** literal quanto aos seis rótulos de camada e ao sinal negativo da subvenção
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, margem de acerto nem gabarito numérico para nenhum instrumento (P6/P19).

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Preço do produtor de R$ 3,10/L, biocombustível de mistura a R$ 0,62/L, tributos federais de R$ 0,42/L, tributo estadual de R$ 1,47/L, distribuição e revenda de R$ 0,98/L e sem subvenção: qual o preço final e qual a carga tributária total?
- **Cenário-padrão:** {"cb-p4-n":3.1,"cb-bi-n":0.62,"cb-tf-n":0.42,"cb-te-n":1.47,"cb-dr-n":0.98,"cb-sb-n":0}
- **Resposta no cenário-padrão:** R$ 6,59/L; carga tributária total 28,7 % (parcela do produtor 47,0 %; biocombustível 9,4 %; distribuição e revenda 14,9 %)

**Avisos.**

- **Fonte dos números:** Modelo didático de composição, com valores iniciais de ordem de grandeza para gasolina C. Não reproduz alíquota específica de nenhum estado nem preço de nenhum polo de suprimento: para números vigentes, consulte o levantamento de preços da ANP, a legislação tributária federal e estadual aplicável e a página de formação de preços do produtor. A parcela de biocombustível de mistura obrigatória é obj
- **Content QA (P20):** A fonte declara: "Modelo didático de composição, com valores iniciais de ordem de grandeza para gasolina C."

**Estado no código (informativo, não é camada fonte).** {"arquivo":"src/lib/data/alexandria-modulo-15-content.ts","linha_aprox":525,"onde":"aula-15-04","kind":"calculadora","n_campos":6,"n_saidas":5,"calculadora":"alexandria-instrument-calculators.ts → 'm1

### m15-inst-06 · Régua de refino · capacidade contra produto

**Identidade.** INST·06 · Aula 05 · tipo: calculadora

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Quatro entradas independentes. O instrumento devolve quanto de um produto específico o parque consegue entregar e onde fica o descompasso com a demanda — e o veredito separa as quatro causas possíveis do déficit em vez de atribuí-lo a "falta de refinaria".”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| rf-cap-n | Capacidade instalada | mil bpd | number+range | 1800 | 200 – 4000 / passo 10 | — |
| rf-uti-n | Fator de utilização | % | number+range | 86.4 | 40 – 100 / passo 0.1 | — |
| rf-ren-n | Rendimento em diesel | % da carga | number+range | 40 | 10 – 60 / passo 0.5 | — |
| rf-dem-n | Demanda nacional de diesel | mil bpd | number+range | 900 | 100 – 2000 / passo 5 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| rf-cg | Carga processada | — | — | — |
| rf-di | Diesel produzido | — | — | — |
| rf-de | Descompasso | — | — | — |
| rf-oc | Capacidade ociosa | — | — | — |
| rf-c1 | Diesel se rodasse a 100% | — | — | — |
| rf-rn | Rendimento necessário para zerar | % (script) | — | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Régua de refino · capacidade contra produto" — "Régua" e "contra"
  - intro: "devolve […] onde fica o descompasso com a demanda"
  - a fonte não desenha: seis readouts de texto
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** Uma régua em mil bpd com quatro marcas encaixadas — capacidade instalada, carga processada, diesel produzido e demanda nacional — e o descompasso desenhado como a distância entre as duas últimas. A capacidade ociosa é a distância entre as duas primeiras, e as duas distâncias precisam estar na mesma régua para que se veja que não se resolvem uma com a outra.
- **Eixo x:** mil barris por dia
- **Eixo y:** as quatro grandezas encaixadas
- **Séries:** capacidade instalada · carga processada · diesel produzido · demanda nacional · descompasso · capacidade ociosa · diesel se rodasse a 100% · rendimento necessário para zerar
- **Relação que a figura tem de mostrar:** O veredito separa quatro causas possíveis do déficit em vez de atribuí-lo a uma — e as quatro são distâncias diferentes na mesma régua: falta capacidade, falta utilização, falta rendimento, ou sobra demanda. Só a régua torna a separação verificável.
- **Derivação:** derivado do código-fonte (as quatro entradas e os seis readouts são verbatim, linhas 3684 em diante)
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, margem de acerto nem gabarito numérico para nenhum instrumento (P6/P19).

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Parque com 1.800 mil bpd de capacidade, 86,4% de utilização, 40% de rendimento em diesel e demanda nacional de 900 mil bpd: qual o descompasso, e qual rendimento zeraria o déficit?
- **Cenário-padrão:** {"rf-cap-n":1800,"rf-uti-n":86.4,"rf-ren-n":40,"rf-dem-n":900}
- **Resposta no cenário-padrão:** Descompasso de −278 mil bpd (carga processada 1.555; diesel produzido 622; capacidade ociosa 245; diesel se rodasse a 100%: 720); rendimento necessário para zerar: 50,0 % da carga

**Avisos.**

- **Fonte dos números:** Valores iniciais: capacidade instalada de processamento e fator de utilização de ordem de grandeza do parque nacional em 2025, conforme anuário estatístico da ANP; rendimento e demanda em valores didáticos editáveis. O instrumento não recomenda construir, ampliar nem importar: devolve a estrutura do descompasso e as quatro causas possíveis. Consulta em 4 de agosto de 2026.
- **Divergência (P5/P8):** Registrado no README do M15: a capacidade de refino aparece como 1.800 mil bpd e como cerca de 2,5 milhões implícitos em outro ponto. P20: verificação autoritativa obrigatória.

**Estado no código (informativo, não é camada fonte).** {"arquivo":"src/lib/data/alexandria-modulo-15-content.ts","linha_aprox":567,"onde":"aula-15-05","kind":"calculadora","n_campos":4,"n_saidas":6,"calculadora":"alexandria-instrument-calculators.ts → 'm1

### m15-inst-07 · Régua de contrato de gás

**Identidade.** INST·07 · Aula 06 · tipo: simulador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “O instrumento separa a molécula do transporte, aplica a retirada mínima sobre o volume efetivamente consumido e devolve o custo efetivo entregue — que é o número que importa e que quase nunca é o número citado. A comparação com o preço de referência do dia serve para mostrar de quanto é a distância, não para sugerir qu”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| gc-mol-n | Preço da molécula · contrato | US$/MMBtu | number+range | 8.5 | 2 – 30 / passo 0.01 | — |
| gc-tra-n | Custo de transporte | US$/MMBtu | number+range | 1.6 | 0 – 12 / passo 0.01 | — |
| gc-dis-n | Margem de distribuição e tributos | US$/MMBtu | number+range | 3.2 | 0 – 15 / passo 0.01 | — |
| gc-top-n | Retirada mínima contratada | % do volume | number+range | 80 | 0 – 100 / passo 1 | — |
| gc-ret-n | Volume efetivamente retirado | % do contratado | number+range | 65 | 0 – 120 / passo 1 | — |
| gc-spo-n | Referência de mercado do dia | US$/MMBtu | number+range | 6 | 1 – 40 / passo 0.01 | — |
| gc-cam | Camada em que o custo está sendo lido | — | seg (botões exclusivos) | mol | — | Molécula na saída do processamento / Entregue no city gate / Final ao consumidor industrial |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| gc-nom | Custo nominal da camada | US$/MMBtu (script) | — | — |
| gc-vf | Volume faturado | % (script) | — | — |
| gc-ef | Custo efetivo por unidade consumida | US$/MMBtu (script) | — | — |
| gc-sc | Sobrecusto da retirada mínima | US$/MMBtu (script) | — | — |
| gc-dt | Distância da referência do dia | % (script) | — | — |
| gc-bars | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Régua de contrato de gás" — "Régua"
  - intro: "O instrumento separa a molécula do transporte, aplica a retirada mínima […] e devolve o custo efetivo entregue"
  - a fonte desenha: #gc-bars
- **Desenho na fonte:** barras #gc-bars
- **O que precisa ser desenhado:** Uma pilha cumulativa de três camadas — molécula, transporte, margem de distribuição e tributos — com marcas nas três alturas, porque o seletor de camada muda apenas qual altura está sendo lida. Sobre a mesma régua, duas marcas a mais: o custo efetivo por unidade consumida, acima do nominal por causa da retirada mínima, e a referência de mercado do dia.
- **Eixo x:** US$ por MMBtu
- **Eixo y:** a pilha cumulativa das três camadas, mais as duas marcas de leitura
- **Séries:** molécula · transporte · margem de distribuição e tributos · custo nominal da camada lida · custo efetivo por unidade consumida · sobrecusto da retirada mínima · referência de mercado do dia
- **Relação que a figura tem de mostrar:** O custo efetivo fica acima do nominal porque se paga por um volume maior do que o retirado. A distância entre as duas marcas é o sobrecusto da retirada mínima — e é essa distância, não o preço da molécula, que o intro chama de "o número que importa e que quase nunca é o número citado".
- **Derivação:** literal quanto às três camadas e aos três rótulos do seletor; os cálculos são verbatim (linhas 3729 em diante)
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, margem de acerto nem gabarito numérico para nenhum instrumento (P6/P19).

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Molécula contratada a US$ 8,50/MMBtu, com retirada mínima de 80% do volume e retirada efetiva de 65% do contratado: qual o custo efetivo por unidade consumida?
- **Cenário-padrão:** {"gc-mol-n":8.5,"gc-tra-n":1.6,"gc-dis-n":3.2,"gc-top-n":80,"gc-ret-n":65,"gc-spo-n":6,"gc-cam":"mol"}
- **Resposta no cenário-padrão:** US$ 10,46/MMBtu (custo nominal da camada US$ 8,50; volume faturado 80% do contratado; sobrecusto da retirada mínima +US$ 1,96/MMBtu; distância da referência do dia +41,7%)

**Avisos.**

- **Fonte dos números:** Valores iniciais são didáticos e de ordem de grandeza. Para preços efetivamente praticados, a fonte primária é o boletim mensal de comercialização de gás natural da ANP, publicado em atendimento à Resolução ANP nº 52/2011, que divulga preço médio e volumes em três categorias separadas: vendas a distribuidoras e consumidores livres, vendas entre produtores e vendas a comercializadores. As três cate

**Estado no código (informativo, não é camada fonte).** {"arquivo":"src/lib/data/alexandria-modulo-15-content.ts","linha_aprox":608,"onde":"aula-15-06","kind":"simulador","n_campos":7,"n_saidas":5,"calculadora":"alexandria-instrument-calculators.ts → 'm15-

### m15-inst-08 · Classificador de elo

**Identidade.** INST·08 · Aula 07 · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Escolha a grandeza citada e o elo em que alguém a atribuiu. O instrumento devolve se a combinação se aplica, qual regime e qual órgão a governam, e o que aquele número não diz. Quando a combinação não se aplica, ele diz por que não e onde aquela grandeza de fato mora — porque atribuir a grandeza ao elo errado é um erro”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| cl-gr | Grandeza citada | — | seg (botões exclusivos) | po | — | Produção de petróleo / Produção de gás / Reserva |
| cl-gr2 | Grandeza citada | — | seg (botões exclusivos) | cp | — | Capacidade / Preço / Custo variável |
| cl-el | Elo ao qual foi atribuída | — | seg (botões exclusivos) | ca | — | Campo / Escoamento e processamento / Transporte / Distribuição / Termelétrica |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| cl-out | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Classificador de elo" — classifica
- **Sem promessa, mas (C6):** Grandeza × elo é um produto cartesiano com células que não se aplicam, e "não se aplica" é resposta. A mesma grade do m14-inst-09 serviria — mas aqui o nome não a promete.
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, margem de acerto nem gabarito numérico para nenhum instrumento (P6/P19).

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Produção de petróleo atribuída ao elo Campo: a combinação se aplica, e o que esse número não diz?
- **Cenário-padrão:** {"cl-gr":"po","cl-gr2":"cp","cl-el":"ca"}
- **Resposta no cenário-padrão:** O veredito do cenário-padrão é a ressalva "O que este número não diz": não diz sob qual regime o volume foi produzido, sem o que a receita não se apura

**Avisos.**

- **Fonte dos números:** A dimensão de grandeza tem dois seletores por espaço de tela: o segundo prevalece sobre o primeiro quando você clica nele, e vice-versa. Fontes de competência: Lei nº 9.478/1997 e Lei nº 12.351/2010 para E&P; Lei nº 14.134/2021 e Resolução ANP nº 1.003/2026 para infraestruturas essenciais de gás; competência estadual sobre distribuição de gás canalizado; Módulos 08 e 09 para as grandezas do setor 
- **Nota de extração:** A fonte tem dois seletores de grandeza por espaço de tela (cl-gr e cl-gr2), e o segundo prevalece sobre o primeiro. Registrado; não corrigir na camada fonte.

**Estado no código (informativo, não é camada fonte).** {"arquivo":"src/lib/data/alexandria-modulo-15-content.ts","linha_aprox":651,"onde":"aula-15-07","kind":"explorador","n_campos":2,"n_saidas":0,"calculadora":"alexandria-instrument-calculators.ts → 'm15

### m15-inst-09 · Simulador de acoplamento gás → despacho

**Identidade.** INST·09 · Aula 08 · tipo: simulador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Monte o CVU a partir do gás entregue e veja onde a usina cai na ordem de despacho. O veredito nunca conclui por um único sinal: ele exige a posição relativa ao custo marginal e o patamar de inflexibilidade declarada, porque uma usina pode estar gerando com CVU altíssimo e outra pode estar parada com CVU baixo.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| ac-gas-n | Gás entregue à usina | US$/MMBtu | number+range | 9 | 2 – 30 / passo 0.01 | — |
| ac-cx-n | Câmbio | R$/US$ | number+range | 5.4 | 2.5 – 9 / passo 0.01 | — |
| ac-hr-n | Consumo específico | MMBtu/MWh | number+range | 7.1 | 5.5 – 14 / passo 0.01 | — |
| ac-om-n | O&amp;M variável e encargos | R$/MWh | number+range | 58 | 0 – 200 / passo 1 | — |
| ac-cmo-n | Custo marginal de operação | R$/MWh | number+range | 330 | 20 – 1200 / passo 1 | — |
| ac-inf-n | Inflexibilidade declarada | % da capacidade | number+range | 40 | 0 – 100 / passo 1 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| ac-cc | Custo de combustível | R$/MWh (script) | — | — |
| ac-cvu | CVU simplificado | R$/MWh (script) | — | — |
| ac-ef | Eficiência implícita | % (script) | — | — |
| ac-po | Posição vs. custo marginal | — | — | — |
| ac-gs | Geração sem sinal econômico | % (script) | — | — |
| ac-gb | Preço do gás que zeraria a distância | US$/MMBtu (script) | — | — |
| ac-track | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Simulador de acoplamento gás → despacho" — a seta no título é a relação
  - intro: "Monte o CVU a partir do gás entregue e veja onde a usina cai na ordem de despacho"
  - a fonte desenha: #ac-track
- **Desenho na fonte:** trilha #ac-track
- **O que precisa ser desenhado:** Uma régua de R$/MWh com a linha do custo marginal de operação fixa e a marca do CVU simplificado da usina sobre ela: acima da linha, fora do mérito; abaixo, dentro. A distância entre as duas marcas é o que o readout chama de posição. Numa faixa própria, a inflexibilidade declarada, como a fração da capacidade que gera sem sinal econômico.
- **Eixo x:** R$/MWh
- **Eixo y:** a régua de custo, mais a faixa de inflexibilidade em % da capacidade
- **Séries:** custo marginal de operação · CVU simplificado · distância entre os dois · custo de combustível · inflexibilidade declarada · preço do gás que zeraria a distância
- **Relação que a figura tem de mostrar:** O veredito nunca conclui por um sinal só: a usina pode estar fora do mérito e ainda assim gerar, porque parte da capacidade é inflexível. As duas leituras — posição na régua e parcela inflexível — precisam estar na mesma prancha, ou o learner conclui despacho a partir de preço.
- **Derivação:** derivado do código-fonte (as seis entradas e os seis readouts são verbatim, linhas 3862 em diante)
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, margem de acerto nem gabarito numérico para nenhum instrumento (P6/P19).

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Gás entregue a US$ 9,00/MMBtu, câmbio de R$ 5,40, consumo específico de 7,1 MMBtu/MWh e O&M variável de R$ 58/MWh, contra custo marginal de operação de R$ 330/MWh: a usina fica dentro ou fora do mérito, e por quanto?
- **Cenário-padrão:** {"ac-gas-n":9,"ac-cx-n":5.4,"ac-hr-n":7.1,"ac-om-n":58,"ac-cmo-n":330,"ac-inf-n":40}
- **Resposta no cenário-padrão:** Fora do mérito, por +73 R$/MWh (CVU simplificado R$ 403/MWh; custo de combustível R$ 345/MWh; eficiência implícita 48,1 %; 40 % da capacidade gera sem sinal econômico; o gás a US$ 7,09/MMBtu zeraria a distância)

**Avisos.**

- **Fonte dos números:** Modelo didático. O CVU efetivo declarado ao operador segue metodologia própria e inclui componentes que este instrumento simplifica. A ordem de despacho real resulta de otimização energética que considera hidrologia, armazenamento, restrições elétricas, requisitos de acionamento e decisões de garantia de suprimento — o eixo aqui representa apenas a dimensão de custo. Consulte o programa mensal de 
- **Divergência (P5/P8):** Registrado no README do M15: no INST·09, o porte publica valor negativo onde a fonte mostra "—". P8/P5: portar a ausência como ausência (S4), não como zero nem como número negativo.

**Estado no código (informativo, não é camada fonte).** {"arquivo":"src/lib/data/alexandria-modulo-15-content.ts","linha_aprox":685,"onde":"aula-15-08","kind":"simulador","n_campos":6,"n_saidas":5,"calculadora":"alexandria-instrument-calculators.ts → 'm15-

### m15-inst-10 · Verificador de regime e de camada · instrumento assinatura

**Identidade.** INST·10 · Aula 09 · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Doze enunciados, todos verdadeiros e insuficientes. Nenhum contém erro factual; todos omitem algo que muda a conclusão. Identifique o defeito dominante, e compare com o diagnóstico. Use o filtro para treinar uma categoria por vez.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| vf-flt | Filtrar por tipo de defeito | — | seg (botões exclusivos) | all | — | Todos / Regime não declarado / Camada confundida / Grandeza confundida / Acoplamento omitido |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| vf-panel | — | — | — | — |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Verificador de regime e de camada · instrumento assinatura" — verifica
  - intro: "Doze enunciados, todos verdadeiros e insuficientes"
- **Sem promessa, mas (C6):** Mesma observação do m14-inst-10: a grade enunciados × defeitos entregaria a resposta antes da tentativa. A ausência de figura protege C7; a grade só entra depois do registro.
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, margem de acerto nem gabarito numérico para nenhum instrumento (P6/P19).

**Previsão (C3).**

- **Útil:** sim. C3 e C7: identificar o defeito dominante antes de comparar com o diagnóstico.
- **Pergunta (camada Alexandria):** Enunciado: "O campo produziu 180 mil barris por dia e a operadora tem 30% de participação; logo a receita dela foi de 54 mil barris por dia vezes o preço realizado." Qual o defeito dominante — regime não declarado, camada confundida, grandeza confundida ou acoplamento omitido?
- **Cenário-padrão:** {"vf-flt":"all"}
- **Resposta no cenário-padrão:** A classificação de cada um dos doze está no registro da extração, com o filtro por categoria de defeito

**Avisos.**

- **Fonte dos números:** Os doze enunciados foram construídos a partir de números e regras verificados em fontes primárias em 4 de agosto de 2026. Cada um seria aceito sem objeção numa conversa, e cada um levaria o interlocutor a uma conclusão que o dado não sustenta.
- **Procedência declarada:** A fonte declara que os doze enunciados foram construídos a partir de números e regras verificados em fontes primárias.

**Estado no código (informativo, não é camada fonte).** {"arquivo":"src/lib/data/alexandria-modulo-15-content.ts","linha_aprox":727,"onde":"aula-15-09","kind":"explorador","n_campos":2,"n_saidas":0,"calculadora":"alexandria-instrument-calculators.ts → 'm15


## M16

### m16-inst-01 · Mapa das seis tendências

**Identidade.** INST·01 · modulo · tipo: instrumento

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Escolha a dimensão de reagrupamento e depois a tendência. O painel devolve a leitura daquela tendência sob aquela dimensão — e a ordem dos cartões muda a cada dimensão escolhida.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| mp-dim | Dimensão de reagrupamento | — | seletor-segmentado | — | — | Estágio / Gargalo vinculante / Efeito sobre a carga / Horizonte de decisão |
| mp-chips | — | — | chips-gerados-pelo-script | — | — | as seis tendências, na ordem de ORD[dimensão], com o rótulo ROT[dimensão][tendência] |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| mp-flux | — | — | — | `  function fluxPara(d){ \|     return ORD[d].map(function(k,i){ \|       var cls=['i','c','p','m','o','c'][i]; \|       return '<div class="fz '+cls+'"><span class="fzk">'+(i+1)+'º</span>'+ \|         '<span class="fzv">` |
| mp-panel | — | — | — | `  function painel(d,k){ \|     var o=D[d][k]; \|     return '<div class="tl-panel"><div class="yr">'+esc(LAB[d])+'</div>'+ \|       '<div class="ti">'+esc(TND[k].n)+' — '+esc(o.t)+'</div>'+ \|       '<div class="bd2">'+e` |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Mapa das seis tendências" — "Mapa"
  - intro: "a ordem dos cartões muda a cada dimensão escolhida" — a reordenação é declarada como o conteúdo
  - a fonte desenha: #mp-flux, cartões ordenados por ORD[dimensão] com o rótulo ROT[dimensão][tendência]
- **Desenho na fonte:** fluxo #mp-flux (cartões numerados 1º…6º, reordenados pela dimensão) + painel #mp-panel
- **O que precisa ser desenhado:** As seis tendências como cartões numerados, reordenados a cada troca de dimensão — estágio, gargalo vinculante, efeito sobre a carga, horizonte de decisão — com o rótulo que aquela dimensão dá àquela tendência no cartão, e o painel abaixo detalhando a escolhida.
- **Eixo x:** a ordem imposta pela dimensão ativa (1º a 6º)
- **Eixo y:** as seis tendências
- **Séries:** as seis tendências · a ordem por dimensão · o rótulo por dimensão e tendência
- **Relação que a figura tem de mostrar:** A tendência que lidera pelo estágio não é a que lidera pelo horizonte de decisão. A reordenação visível é a afirmação; ler seis fichas é ler seis fichas.
- **Derivação:** literal (as funções fluxPara(d) e painel(d,k), os arrays ORD, ROT, LAB e TND são verbatim, linhas 4982–5072)
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância de resposta para este instrumento (não há resposta a conferir).

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Condição a encontrar: achar a tendência que mais muda de posição entre as quatro dimensões.

**Avisos.**

- **Fonte dos números:** Fontes por tendência declaradas no painel. Estágio e gargalo referem-se a 4 de agosto de 2026 e são as duas categorias que mais rapidamente envelhecem.
- **Procedência declarada:** A fonte declara as fontes por tendência no painel, e que estágio e gargalo se referem a 4 de agosto de 2026. A data é parte do bloco (S4).

**Estado no código (informativo, não é camada fonte).** {"status":"não portado","evidencia":["alexandria-modulo-16-content.ts: MODULO_16_INSTRUMENTOS é array vazio (confirmado)","alexandria-modulo-16-content.ts: 10 de 10 aulas com instruments: []","alexand

### m16-inst-02 · Régua de estágio de maturidade

**Identidade.** INST·02 · aula · tipo: instrumento

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Escolha a tendência e a posição. O painel devolve três coisas: a evidência que aquela posição exigiria, a evidência efetivamente disponível em 4 de agosto de 2026, e o veredito sobre se a tendência está naquela posição, abaixo dela ou acima dela. O produto cartesiano tem trinta células e todas estão preenchidas.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| rg-tnd | Tendência | — | seletor-segmentado | — | — | Eletrificação / Armazenamento / Medição / Agregação / Carbono regulado / Centros de dados |
| rg-pos | Posição testada | — | seletor-segmentado | — | — | 1 · escala / 2 · piloto / 3 · regulado / 4 · anunciado / 5 · projeção |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| rg-out | Posição testada · Evidência que esta posição exigiria · Evidência disponível em 04/08/2026 | — | — | — |
| rg-vd | — | — | veredito | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Régua de estágio de maturidade" — "Régua"
  - intro: "o veredito sobre se a tendência está naquela posição, abaixo ou acima" — o veredito é uma distância na régua
  - a fonte não desenha: três cartões de texto e um veredito
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** Uma régua de cinco posições, na ordem literal da fonte — 1 escala, 2 piloto, 3 regulado, 4 anunciado, 5 projeção — com duas marcas: a posição testada pelo learner e a posição real classificada na data de verificação. O veredito é a relação entre as duas marcas (é esta, está acima, está abaixo), e não um texto solto.
- **Eixo x:** as cinco posições da régua
- **Eixo y:** uma régua; abaixo dela, os três cartões (posição testada, evidência que a posição exigiria, evidência disponível na data)
- **Séries:** posição testada · posição real na data de verificação · evidência exigida × evidência disponível
- **Relação que a figura tem de mostrar:** A régua é o instrumento; o veredito é a distância entre duas marcas nela. É esta a régua que o m17-inst-07 diz citar sem reconstruir — portá-la uma vez e reutilizá-la é o que a própria fonte pede.
- **Derivação:** literal quanto às cinco posições e aos três rótulos de cartão; a comparação p vs REAL[t] em três ramos é verbatim
- **Reúso:** Esta régua é reaproveitada pelo m17-inst-07, que a fonte declara "citada, não reconstruída".
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância de resposta para este instrumento (não há resposta a conferir).
- **Por que não pedir:** Classificação em cinco posições discretas com gabarito declarado por data. Não há grandeza contínua para tolerar.

**Previsão (C3).**

- **Útil:** sim. C3: o learner testa uma posição e confere — o instrumento já é construído assim.
- **Pergunta (camada Alexandria):** Eletrificação de transporte, testada na posição 1 (em operação em escala): a tendência está nessa posição, acima ou abaixo dela, em 4 de agosto de 2026?
- **Cenário-padrão:** {"rg-tnd":"ele","rg-pos":"1"}
- **Resposta no cenário-padrão:** É esta a posição: classificada como em operação em escala em 4 de agosto de 2026, com a evidência disponível satisfazendo o que a posição exige (215.023 leves eletrificados no primeiro semestre de 2026)

**Avisos.**

- **Fonte dos números:** {"texto":null,"nota":"Os números de DISP (215.023, 167.026, 25.429, 21.061, 627 GWh, 7,8 TWh, 38 GW, 7,1 GW, R$ 159 bilhões, 26,3 GW, 1,2%–12,9%) não trazem referência ligada no instrumento; a nota de rodapé declara só a data de classificação. Várias descrições coincidem com itens do § Ref (ver aparato.json), sem vínculo declarado."}
- **Content QA (P20):** Os números de evidência (215.023, 167.026, 25.429, 21.061, 627 GWh, 7,8 T…) não têm referência ligada no instrumento. Verificação autoritativa pendente (P20).

**Estado no código (informativo, não é camada fonte).** {"status":"não portado","evidencia":["alexandria-modulo-16-content.ts: MODULO_16_INSTRUMENTOS é array vazio (confirmado)","alexandria-modulo-16-content.ts: 10 de 10 aulas com instruments: []","alexand

### m16-inst-03 · Comparador de gargalo

**Identidade.** INST·03 · aula · tipo: instrumento

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Trinta combinações: seis tendências por cinco candidatos. Para cada uma, o painel diz se aquele candidato vincula ou não vincula, por quê, e o que precisaria mudar. Dizer que um candidato não vincula é uma afirmação com conteúdo, e está sujeita à mesma verificação que a afirmação contrária.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| gg-tnd | Tendência | — | seletor-segmentado | — | — | Eletrificação / Armazenamento / Medição / Agregação / Carbono regulado / Centros de dados |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| gg-out | Vincula · Não vincula | — | — | — |
| gg-vd | — | — | veredito | — |

**Forma prometida (C5).**

- **Promete:** sim — cumprido em parte — a fonte compara os cinco candidatos dentro de uma tendência, e o título promete a comparação entre as seis
  - titulo: "Comparador de gargalo" — "Comparador"
  - intro: "Trinta combinações: seis tendências por cinco candidatos. […] Dizer que um candidato não vincula é uma afirmação com conteúdo"
  - a fonte mostra as cinco linhas da tendência ativa (#gg-out)
- **Desenho na fonte:** cinco linhas vincula / não vincula para a tendência ativa
- **O que precisa ser desenhado:** A grade 6 × 5 inteira, com cada célula marcada como vincula ou não vincula — e as células de "não vincula" tão visíveis quanto as outras, porque a fonte declara que negar é afirmar. A tendência ativa destacada como linha, com os cinco textos abertos abaixo.
- **Eixo x:** os cinco candidatos a gargalo (Maturidade tecnológica, Regra habilitante, cadeia de suprimento e os demais do array G)
- **Eixo y:** as seis tendências
- **Séries:** as trinta células · vincula / não vincula · gargalo vinculante por tendência
- **Relação que a figura tem de mostrar:** Cada tendência tem exatamente um gargalo vinculante e quatro candidatos avaliados e descartados. A grade mostra que o gargalo muda de coluna conforme a tendência — e que nenhuma tendência tem dois. Uma tendência por tela perde as duas leituras.
- **Derivação:** literal quanto às seis tendências, aos cinco candidatos e à contagem de trinta
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância de resposta para este instrumento (não há resposta a conferir).

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Eletrificação de transporte: qual dos cinco candidatos é o gargalo vinculante em 4 de agosto de 2026?
- **Cenário-padrão:** {"gg-tnd":"ele"}
- **Resposta no cenário-padrão:** Cadeia de suprimento — e os outros quatro foram avaliados e não vinculam

**Avisos.**

- **Fonte dos números:** {"texto":null,"nota":"Nenhuma referência ligada; a nota de rodapé declara a data de classificação (4 de agosto de 2026)."}

**Estado no código (informativo, não é camada fonte).** {"status":"não portado","evidencia":["alexandria-modulo-16-content.ts: MODULO_16_INSTRUMENTOS é array vazio (confirmado)","alexandria-modulo-16-content.ts: 10 de 10 aulas com instruments: []","alexand

### m16-inst-04 · Conversor de frota em carga

**Identidade.** INST·04 · aula · tipo: instrumento

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Todos os valores de referência são editáveis. O padrão inicial usa a frota plug-in comercializada no primeiro semestre de 2026 (167.026 unidades) e o consumo de referência do cenário de referência do plano decenal para 2035 (939 TWh). O veredito recusa concluir por um único sinal: cruza a participação no agregado nacio”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| fc-n-n | Veículos com tomada | unidades | numero-com-deslizador-gemeo | 167026 | 1000 – 5000000 / passo 1 | — |
| fc-km-n | Quilometragem anual | km/ano | numero-com-deslizador-gemeo | 12000 | 5000 – 60000 / passo 100 | — |
| fc-e-n | Consumo específico | kWh/km | numero-com-deslizador-gemeo | 0.170 | 0.10 – 0.40 / passo 0.005 | — |
| fc-ef-n | Eficiência de recarga | % | numero-com-deslizador-gemeo | 90 | 80 – 98 / passo 0.5 | — |
| fc-p-n | Potência por ponto | kW | numero-com-deslizador-gemeo | 7.4 | 3.7 – 350 / passo 0.1 | — |
| fc-fc-n | Fator de coincidência | % | numero-com-deslizador-gemeo | 30 | 5 – 100 / passo 1 | — |
| fc-ref-n | Consumo de referência do sistema | TWh/ano | numero-com-deslizador-gemeo | 939 | 300 – 1200 / passo 1 | — |
| fc-lim-n | Limite local disponível | MW | numero-com-deslizador-gemeo | 100 | 0.1 – 5000 / passo 0.1 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| fc-en | Energia anual da rede | MWh/ano (script) | — | — |
| fc-sh | Participação no agregado | % (script) | — | — |
| fc-pc | Potência coincidente | MW (script) | — | — |
| fc-ul | Uso do limite local | % (script) | — | — |
| fc-ev | Energia por veículo | kWh (script) | — | — |
| fc-he | Horas equivalentes na potência máxima | h/ano (script) | — | — |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Conversor de frota em carga" — converte
  - intro: "Todos os valores de referência são editáveis"
- **Sem promessa, mas (C6):** A conversão é uma cadeia de multiplicações: frota → quilometragem → consumo específico → eficiência de recarga → energia. Uma cascata de quatro degraus mostraria onde cada parâmetro age. E o uso do limite local, que no cenário-padrão passa de 100%, precisa de uma régua com o limite marcado — porque "370,8%" é um número que só significa alguma coisa contra o limite.
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância de resposta para este instrumento (não há resposta a conferir).

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** 167.026 veículos com tomada, 12.000 km/ano, 0,170 kWh/km, 90% de eficiência de recarga, 7,4 kW por ponto e fator de coincidência de 30%, contra consumo de referência do sistema de 939 TWh/ano e limite local de 100 MW: qual a participação no agregado e quanto do limite local a potência coincidente usa?
- **Cenário-padrão:** {"fc-n-n":"167026","fc-km-n":"12000","fc-e-n":"0.170","fc-ef-n":"90","fc-p-n":"7.4","fc-fc-n":"30","fc-ref-n":"939","fc-lim-n":"100"}
- **Resposta no cenário-padrão:** Participação no agregado 0,040 %; uso do limite local 370,8 % (energia anual da rede 378.592 MWh/ano; potência coincidente 370,8 MW; 2.267 kWh por veículo; 1.021 h equivalentes na potência máxima)

**Avisos.**

- **Fonte dos números:** O padrão inicial usa a frota plug-in comercializada no primeiro semestre de 2026 (167.026 unidades) e o consumo de referência do cenário de referência do plano decenal para 2035 (939 TWh).
- **Procedência declarada:** A fonte declara: frota plug-in comercializada no primeiro semestre de 2026 (167.026 unidades) e consumo de referência do cenário de referência do plano decenal para 2035 (939 TWh).

**Estado no código (informativo, não é camada fonte).** {"status":"não portado","evidencia":["alexandria-modulo-16-content.ts: MODULO_16_INSTRUMENTOS é array vazio (confirmado)","alexandria-modulo-16-content.ts: 10 de 10 aulas com instruments: []","alexand

### m16-inst-05 · Régua de armazenamento

**Identidade.** INST·05 · aula · tipo: instrumento

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Os valores iniciais reproduzem os parâmetros mínimos do certame de dezembro de 2026 — 30 MW, quatro horas, teto de 366 ciclos — e todos são editáveis. O veredito recusa concluir por arbitragem isolada: devolve a margem e devolve o quanto falta, e diz explicitamente que a decisão exige uma segunda fonte de receita e a v”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| ar-p-n | Potência | MW | numero-com-deslizador-gemeo | 30 | 1 – 500 / passo 1 | — |
| ar-d-n | Duração | horas | numero-com-deslizador-gemeo | 4 | 0.5 – 8 / passo 0.1 | — |
| ar-dod-n | Profundidade de descarga | % | numero-com-deslizador-gemeo | 90 | 50 – 100 / passo 1 | — |
| ar-rte-n | Eficiência de ciclo | % | numero-com-deslizador-gemeo | 86 | 70 – 95 / passo 0.5 | — |
| ar-pc-n | Preço de compra | R$/MWh | numero-com-deslizador-gemeo | 80 | 0 – 500 / passo 1 | — |
| ar-pv-n | Preço de venda | R$/MWh | numero-com-deslizador-gemeo | 400 | 0 – 1500 / passo 1 | — |
| ar-cy-n | Ciclos por ano | ciclos | numero-com-deslizador-gemeo | 366 | 50 – 730 / passo 1 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| ar-en | Energia nominal | MWh (script) | — | — |
| ar-eu | Energia útil por ciclo | MWh (script) | — | — |
| ar-ea | Energia entregue no ano | MWh/ano (script) | — | — |
| ar-ec | Energia comprada no ano | MWh/ano (script) | — | — |
| ar-sp | Spread mínimo de equilíbrio | R$/MWh (script) | — | — |
| ar-mg | Margem por MW-ano | ano (rótulo) | — | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Régua de armazenamento" — "Régua"
  - intro: "O veredito recusa concluir por arbitragem isolada: devolve a margem e devolve o que…"
  - a fonte não desenha: seis readouts de texto
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** Uma régua de R$/MWh com duas marcas: o spread mínimo de equilíbrio, calculado a partir da eficiência de ciclo e da profundidade de descarga, e o spread praticado, que é a distância entre o preço de venda e o de compra. A margem é a diferença entre as duas marcas. Numa faixa própria, a cadeia de energia: nominal, útil por ciclo, entregue no ano e comprada no ano.
- **Eixo x:** R$/MWh na régua; MWh na cadeia de energia
- **Eixo y:** a régua de spread, mais a cadeia de quatro quantidades de energia
- **Séries:** spread mínimo de equilíbrio · spread praticado · margem por MW-ano · energia nominal · energia útil por ciclo · energia entregue no ano · energia comprada no ano
- **Relação que a figura tem de mostrar:** Entra mais energia do que sai — 45.963 MWh comprados contra 39.528 entregues no cenário-padrão — e é essa perda que levanta o spread mínimo de equilíbrio acima de zero. A régua com as duas marcas mostra que a arbitragem só paga acima de um piso que a física impõe.
- **Derivação:** derivado do código-fonte (as sete entradas e os seis readouts são verbatim, linhas 5261 em diante)
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância de resposta para este instrumento (não há resposta a conferir).

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Bateria de 30 MW por 4 horas, 90% de profundidade de descarga, 86% de eficiência de ciclo, comprando a R$ 80/MWh e vendendo a R$ 400/MWh, com 366 ciclos no ano: qual o spread mínimo de equilíbrio?
- **Cenário-padrão:** {"ar-p-n":"30","ar-d-n":"4","ar-dod-n":"90","ar-rte-n":"86","ar-pc-n":"80","ar-pv-n":"400","ar-cy-n":"366"}
- **Resposta no cenário-padrão:** R$ 93,02/MWh (energia nominal 120,0 MWh; útil por ciclo 108,00 MWh; entregue no ano 39.528 MWh; comprada no ano 45.963 MWh; margem R$ 404 mil/MW-ano)

**Avisos.**

- **Fonte dos números:** Os valores iniciais reproduzem os parâmetros mínimos do certame de dezembro de 2026 — 30 MW, quatro horas, teto de 366 ciclos — e todos são editáveis.
- **Procedência declarada:** A fonte declara que os valores iniciais reproduzem os parâmetros mínimos do certame de dezembro de 2026 — 30 MW, quatro horas, teto de 366 ciclos.

**Estado no código (informativo, não é camada fonte).** {"status":"não portado","evidencia":["alexandria-modulo-16-content.ts: MODULO_16_INSTRUMENTOS é array vazio (confirmado)","alexandria-modulo-16-content.ts: 10 de 10 aulas com instruments: []","alexand

### m16-inst-06 · Rampa de medição avançada

**Identidade.** INST·06 · aula · tipo: instrumento

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Converte uma regra — “2% ao ano” — em pontos, anos e capital. Todos os parâmetros são editáveis, inclusive o ritmo obrigatório, para que se possa testar cenários alternativos de norma. O veredito cruza dois sinais — cobertura alcançada e intensidade de capital — e recusa afirmar que o programa vale a pena, porque essa ”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| am-uc-n | Unidades consumidoras | mil UCs | numero-com-deslizador-gemeo | 3000 | 10 – 30000 / passo 10 | — |
| am-ro-n | Ritmo obrigatório | %/ano | numero-com-deslizador-gemeo | 2 | 0 – 10 / passo 0.1 | — |
| am-ra-n | Ritmo adicional voluntário | %/ano | numero-com-deslizador-gemeo | 0 | 0 – 15 / passo 0.1 | — |
| am-cp-n | Custo por ponto | R$ | numero-com-deslizador-gemeo | 550 | 100 – 1500 / passo 10 | — |
| am-hz-n | Horizonte | anos | numero-com-deslizador-gemeo | 10 | 1 – 20 / passo 1 | — |
| am-rf-n | Referência de investimento anual | R$ bi/ano | numero-com-deslizador-gemeo | 20 | 1 – 100 / passo 0.5 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| am-pa | Pontos por ano | mil/ano (script) | — | — |
| am-cb | Cobertura no horizonte | % (script) | — | — |
| am-pt | Pontos acumulados | — | — | — |
| am-ca | Capital anual | R$ (script) | — | — |
| am-cc | Capital acumulado | R$ (script) | — | — |
| am-at | Anos para cobertura total | anos (script) | — | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho — o instrumento se chama rampa e não desenha rampa nenhuma
  - titulo: "Rampa de medição avançada" — "Rampa" é uma trajetória
  - intro: "Converte uma regra — '2% ao ano' — em pontos, anos e capital"
  - a fonte não desenha: seis readouts de texto
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** A trajetória de cobertura ao longo dos anos, do zero até a cobertura total, com o horizonte escolhido marcado por uma vertical — e o eixo estendido além do horizonte até o ano em que a cobertura fecha, porque é esse ponto distante que a régua do "2% ao ano" produz e que o readout devolve. Num eixo secundário, o capital acumulado.
- **Eixo x:** anos, do zero até a cobertura total
- **Eixo y:** cobertura em % das unidades consumidoras; eixo secundário em R$ bi de capital acumulado
- **Séries:** trajetória de cobertura · vertical do horizonte escolhido · capital anual · capital acumulado · ano da cobertura total
- **Relação que a figura tem de mostrar:** "2% ao ano" soa como um ritmo; desenhado, é meio século. A distância entre o horizonte de dez anos e o ano da cobertura total é a conversão que o intro promete — e ela só existe como comprimento.
- **Derivação:** derivado do código-fonte (as seis entradas e os seis readouts são verbatim, linhas 5314 em diante)
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância de resposta para este instrumento (não há resposta a conferir).

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** 3.000 mil unidades consumidoras, ritmo obrigatório de 2% ao ano, sem ritmo voluntário adicional, custo de R$ 550 por ponto e horizonte de 10 anos: qual a cobertura ao fim do horizonte e em quantos anos a cobertura total seria atingida?
- **Cenário-padrão:** {"am-uc-n":"3000","am-ro-n":"2","am-ra-n":"0","am-cp-n":"550","am-hz-n":"10","am-rf-n":"20"}
- **Resposta no cenário-padrão:** 20,0 % de cobertura em 10 anos; 50,0 anos para a cobertura total (60 mil pontos/ano; 600 mil pontos acumulados; capital anual R$ 0,03 bi; capital acumulado R$ 0,33 bi)

**Avisos.**

- **Fonte dos números:** Custo por ponto é parâmetro editável e não um valor de referência oficial: ele varia com tecnologia de comunicação, densidade da área e escopo de sistemas incluído. O instrumento converte regra em quantidade; ele não avalia mérito.
- **Content QA (P20):** A fonte declara que o custo por ponto é parâmetro editável e não valor de referência oficial.

**Estado no código (informativo, não é camada fonte).** {"status":"não portado","evidencia":["alexandria-modulo-16-content.ts: MODULO_16_INSTRUMENTOS é array vazio (confirmado)","alexandria-modulo-16-content.ts: 10 de 10 aulas com instruments: []","alexand

### m16-inst-07 · Verificador de estado da política de carbono

**Identidade.** INST·07 · aula · tipo: instrumento

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Cada dispositivo ou ato do sistema, classificado nos quatro estados de política, com data e com a evidência que sustenta a classificação. Escolha o dispositivo. Repare em quantos estão em estados diferentes ao mesmo tempo — é a razão pela qual “em formação” não descreve nada.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| cb-chips | — | — | chips-gerados-pelo-script | — | — | Lei do sistema de comércio de emissões / Prazo original da fase I / Prórroga da fase I / Secretaria com competências de órgão gestor / Órgão gestor permanente / Comitê técnico consultivo permanente /  |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| cb-panel | A pergunta que você faz | — | — | — |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Verificador de estado da política de carbono" — verifica
  - intro: "Repare em quantos estão em estados diferentes ao mesmo tempo"
- **Sem promessa, mas (C6):** Os dispositivos têm data e estado, e o intro pede que se repare em quantos estão em estados diferentes simultaneamente. É exatamente a régua datada e colorida por estado proposta no m12-inst-04 — a mesma figura, outro conjunto de marcos.
- **Reúso:** Mesma régua do m12-inst-04.
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância de resposta para este instrumento (não há resposta a conferir).

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Lei do sistema de comércio de emissões, de 12/12/2024: em que estado ela está na data de verificação?
- **Cenário-padrão:** {"cb-chips":"lei"}
- **Resposta no cenário-padrão:** "Em vigor na data da publicação" — e a fonte observa que essa informação, que parece formalidade, é a que permite contar todos os prazos

**Avisos.**

- **Fonte dos números:** {"texto":null,"nota":"Datas e dispositivos sem referência ligada no instrumento; coincidem com itens do § Ref (Lei nº 15.042/2024, decreto de 16/10/2025, resoluções do comitê de 11/05/2026, proposta de 19/05/2026, consulta até 28/08/2026), sem vínculo declarado."}
- **Content QA (P20):** Datas e dispositivos sem referência ligada no instrumento. Verificação autoritativa pendente (P20).

**Estado no código (informativo, não é camada fonte).** {"status":"não portado","evidencia":["alexandria-modulo-16-content.ts: MODULO_16_INSTRUMENTOS é array vazio (confirmado)","alexandria-modulo-16-content.ts: 10 de 10 aulas com instruments: []","alexand

### m16-inst-08 · Calculadora de escopo 2 — os dois métodos lado a lado

**Identidade.** INST·08 · aula · tipo: instrumento

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Os dois métodos são calculados sempre juntos, e o seletor apenas destaca qual está sendo discutido — porque exibir um sozinho é exatamente o defeito que a aula combate. O veredito recusa tratar a diferença como redução física de emissão.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| e2-cs-n | Consumo anual | GWh | numero-com-deslizador-gemeo | 120 | 0.1 – 5000 / passo 0.1 | — |
| e2-fm-n | Fator médio da rede | tCO2e/MWh | numero-com-deslizador-gemeo | 0.080 | 0.01 – 0.60 / passo 0.001 | — |
| e2-fr-n | Fator residual da rede | tCO2e/MWh | numero-com-deslizador-gemeo | 0.120 | 0.01 – 0.80 / passo 0.001 | — |
| e2-at-n | Consumo com atributo contratado | % | numero-com-deslizador-gemeo | 0 | 0 – 100 / passo 1 | — |
| e2-fi-n | Fator do instrumento contratado | tCO2e/MWh | numero-com-deslizador-gemeo | 0.000 | 0 – 0.60 / passo 0.001 | — |
| e2-mt | Método em discussão (os dois são sempre exibidos) | — | seletor-segmentado | — | — | Baseado em localização / Baseado em mercado |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| e2-df | Diferença entre métodos | tCO2e (script) | — | — |
| e2-rz | Razão mercado / localização | × (script) | — | — |
| e2-cb | Consumo coberto por atributo | MWh (script) | — | — |
| e2-fis | Emissão física da rede alterada | tCO2e (script) | — | — |
| — | Método de localização | — | — | — |
| — | Método de mercado | — | — | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho — e a fonte declara, no intro, que exibir um método sozinho é o defeito
  - titulo: "Calculadora de escopo 2 — os dois métodos lado a lado" — o arranjo está no título
  - intro: "Os dois métodos são calculados sempre juntos, e o seletor apenas destaca qual está sendo discutido — porque exibir um sozinho é exatamente o defeito que a aula combate"
  - a fonte não desenha: readouts de texto
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** Duas colunas na mesma escala em tCO₂e — método baseado em localização e método baseado em mercado — sempre as duas, com a diferença entre os topos marcada; e uma terceira marca, fixa e rotulada, na emissão física da rede, que não se move quando os métodos mudam. É essa terceira marca que impede a leitura de redução.
- **Eixo x:** os dois métodos, mais a referência física
- **Eixo y:** tCO₂e no ano
- **Séries:** método de localização · método de mercado · diferença entre métodos · razão mercado / localização · emissão física da rede alterada (sempre zero, e declarada como tal)
- **Relação que a figura tem de mostrar:** O veredito recusa tratar a diferença entre os métodos como redução física. A figura sustenta a recusa ao desenhar a terceira marca: a emissão física da rede não muda — no cenário-padrão, zero tCO₂e alterada — enquanto as duas colunas contábeis diferem em 4.800 tCO₂e.
- **Derivação:** literal quanto ao "lado a lado" do título e à obrigação de exibir os dois; os cálculos são verbatim (linhas 5365 em diante)
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância de resposta para este instrumento (não há resposta a conferir).

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Consumo anual de 120 GWh, fator médio da rede de 0,080 tCO₂e/MWh, fator residual de 0,120 tCO₂e/MWh e nenhum consumo com atributo contratado: quanto dá cada método, e quanto da emissão física da rede muda?
- **Cenário-padrão:** {"e2-cs-n":"120","e2-fm-n":"0.080","e2-fr-n":"0.120","e2-at-n":"0","e2-fi-n":"0.000","e2-mt":"loc"}
- **Resposta no cenário-padrão:** Localização 9.600 tCO₂e e mercado 14.400 tCO₂e — diferença de −4.800 tCO₂e, razão 1,50×; emissão física da rede alterada: 0 tCO₂e

**Avisos.**

- **Fonte dos números:** Fatores de emissão são entradas editáveis. O fator médio da rede brasileira é publicado oficialmente e varia mensalmente com a hidrologia; o fator residual não tem publicação oficial consolidada, o que é em si um achado analítico relevante.
- **Content QA (P20):** A fonte declara que os fatores de emissão são entradas editáveis e que o fator médio da rede brasileira é publicado oficialmente.

**Estado no código (informativo, não é camada fonte).** {"status":"não portado","evidencia":["alexandria-modulo-16-content.ts: MODULO_16_INSTRUMENTOS é array vazio (confirmado)","alexandria-modulo-16-content.ts: 10 de 10 aulas com instruments: []","alexand

### m16-inst-09 · Decompositor de demanda de centro de dados

**Identidade.** INST·09 · aula · tipo: instrumento

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Converte a potência de tecnologia da informação em carga média e em energia anual, e devolve a razão entre o que foi solicitado e o que seria consumido. O veredito separa os cinco números e recusa concluir que o pedido descreve demanda.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| dc-ti-n | Potência de tecnologia da informação | MW | numero-com-deslizador-gemeo | 100 | 1 – 1000 / passo 1 | — |
| dc-pue-n | Eficiência do uso de energia | PUE | numero-com-deslizador-gemeo | 1.30 | 1.05 – 2.00 / passo 0.01 | — |
| dc-fc-n | Fator de carga médio | % | numero-com-deslizador-gemeo | 90 | 10 – 100 / passo 1 | — |
| dc-sol-n | Potência no pedido de acesso | MW | numero-com-deslizador-gemeo | 200 | 1 – 3000 / passo 1 | — |
| dc-rp-n | Prazo de rampa até a ocupação | anos | numero-com-deslizador-gemeo | 4 | 0.5 – 10 / passo 0.5 | — |
| dc-ref-n | Consumo de referência do sistema | TWh/ano | numero-com-deslizador-gemeo | 939 | 300 – 1200 / passo 1 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| dc-cm | Carga média | MW (script) | — | — |
| dc-pn | Potência de conexão necessária | MW (script) | — | — |
| dc-ea | Energia anual em regime | GWh/ano (script) | — | — |
| dc-rz | Razão solicitado / carga média | × (script) | — | — |
| dc-sh | Participação no agregado | % (script) | — | — |
| dc-a1 | Carga média no primeiro ano | MW (script) | — | — |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Decompositor de demanda de centro de dados" — decompõe
  - intro: "O veredito separa os cinco números e recusa concluir que o pedido descreve demanda"
- **Sem promessa, mas (C6):** A cadeia potência de TI → carga média → potência de conexão necessária é uma cascata de duas multiplicações, e a razão entre o solicitado e a carga média é a distância entre duas marcas na mesma régua de MW. A rampa até a ocupação plena é uma trajetória curta com um ponto declarado no primeiro ano.
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância de resposta para este instrumento (não há resposta a conferir).

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** 100 MW de potência de tecnologia da informação, PUE de 1,30, fator de carga médio de 90%, pedido de acesso de 200 MW e rampa de 4 anos até a ocupação: qual a razão entre o solicitado e a carga média?
- **Cenário-padrão:** {"dc-ti-n":"100","dc-pue-n":"1.30","dc-fc-n":"90","dc-sol-n":"200","dc-rp-n":"4","dc-ref-n":"939"}
- **Resposta no cenário-padrão:** 1,71 × (carga média 117,0 MW; potência de conexão necessária 130,0 MW; energia anual em regime 1.025 GWh/ano; participação no agregado 0,109 %; carga média no primeiro ano 29,3 MW)

**Avisos.**

- **Fonte dos números:** A rampa é modelada como linear até a ocupação plena, o que é simplificação didática: rampas reais dependem de contratação de cliente âncora e costumam ser irregulares. Nenhuma projeção de mercado decorre deste instrumento.
- **Content QA (P20):** A fonte declara que a rampa é modelada como linear até a ocupação plena, e que isso é simplificação didática.

**Estado no código (informativo, não é camada fonte).** {"status":"não portado","evidencia":["alexandria-modulo-16-content.ts: MODULO_16_INSTRUMENTOS é array vazio (confirmado)","alexandria-modulo-16-content.ts: 10 de 10 aulas com instruments: []","alexand

### m16-inst-10 · Grade de mapeamento de posicionamento

**Identidade.** INST·10 · aula · tipo: instrumento

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Escolha a tendência e o elo. O painel devolve a capacidade que uma empresa precisa ter para ocupar aquele elo e três perguntas de verificação — formuladas de modo que a resposta seja um documento ou um número, nunca uma impressão. Trinta combinações, todas preenchidas. Nenhum ocupante é nomeado: os ocupantes são descri”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| gp-tnd | Tendência | — | seletor-segmentado | — | — | Eletrificação / Armazenamento / Medição / Agregação / Carbono regulado / Centros de dados |
| gp-elo | Elo de captura de valor | — | seletor-segmentado | — | — | Fabricação e fornecimento / Instalação e integração / Operação e serviço / Financiamento / Domínio do dado |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| gp-out | — | — | alvo dinâmico | — |
| — | painel renderizado | — | painel | `ver renderizacoes na extração do módulo` |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho — o instrumento se chama grade e mostra uma célula
  - titulo: "Grade de mapeamento de posicionamento" — "Grade" está no título
  - a fonte não desenha a grade: dois seletores revelam um painel por cruzamento
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** A grade 6 × 5 inteira — seis tendências nas linhas, cinco elos de captura de valor nas colunas — com a célula ativa aberta abaixo trazendo a capacidade exigida e as três perguntas de verificação, mais a caixa fixa "O que este painel não faz", que a fonte anexa e que precisa continuar visível.
- **Eixo x:** os cinco elos (Fabricação e fornecimento, Instalação e integração, Operação e serviço, Financiamento, Domínio do dado)
- **Eixo y:** as seis tendências
- **Séries:** as trinta células · capacidade exigida por célula · as três perguntas de verificação
- **Relação que a figura tem de mostrar:** Uma empresa não ocupa uma tendência: ocupa um elo dentro dela. A grade mostra que o mesmo elo exige capacidades diferentes conforme a tendência, e que a mesma tendência abre cinco posições distintas. Célula a célula, as duas leituras somem.
- **Derivação:** literal quanto às seis tendências, aos cinco elos e à caixa fixa
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância de resposta para este instrumento (não há resposta a conferir).

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Condição a encontrar: escolher o elo que mais se repete como exigência entre as seis tendências.

**Avisos.**

- **Fonte dos números:** {"texto":null,"nota":"Não há números de mercado; as perguntas não citam fonte."}
- **Content QA (P20):** A fonte declara que não há números de mercado aqui e que as perguntas não citam fonte.

**Estado no código (informativo, não é camada fonte).** {"status":"não portado","evidencia":["alexandria-modulo-16-content.ts: MODULO_16_INSTRUMENTOS é array vazio (confirmado)","alexandria-modulo-16-content.ts: 10 de 10 aulas com instruments: []","alexand

### m16-inst-11 · Verificador de estágio e de gargalo

**Identidade.** INST·11 · aula · tipo: instrumento

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Doze enunciados, três por categoria de defeito. Para cada um, o painel devolve o defeito dominante, o que exatamente falta, a pergunta que você faz e a forma corrigida do enunciado. Use o filtro para treinar uma categoria de cada vez.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| vf-flt | Filtrar por defeito dominante | — | seletor-segmentado | — | — | Todos / A · estágio / B · gargalo / C · carga / D · comparação |
| vf-chips | — | — | chips-gerados-pelo-script | — | — | 38 GW em acesso / Leilão de baterias / Capacidades somadas / Bateria e custo / Medição e tecnologia / Cinco desafios / Frota e demanda / Carbono e demanda elétrica / Bateria e rede / Atraso em rede in |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| vf-chips | — | GW (script) | alvo dinâmico | — |
| vf-panel | — | — | alvo dinâmico | — |
| — | painel renderizado | — | painel | `ver renderizacoes na extração do módulo` |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Verificador de estágio e de gargalo" — verifica
  - intro: "Doze enunciados, três por categoria de defeito"
- **Sem promessa, mas (C6):** Mesma observação do m14-inst-10 e do m15-inst-10: a grade enunciados × categorias entregaria a resposta antes da tentativa; ela entra depois do registro (C7).
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância de resposta para este instrumento (não há resposta a conferir).

**Previsão (C3).**

- **Útil:** sim. C3 e C7: classificar o defeito antes de conferir.
- **Pergunta (camada Alexandria):** Enunciado: "O Brasil tem 38 GW de projetos de centros de dados pedindo acesso à rede — mais de um terço da carga média projetada do país para 2035." Qual o defeito dominante — A estágio, B gargalo, C carga ou D comparação?
- **Cenário-padrão:** {"vf-flt":"all","vf-chips":"e1"}
- **Resposta no cenário-padrão:** A · estágio confundido. A frase é verdadeira e a comparação é aritmeticamente correta; falta declarar que 38 GW é o primeiro degrau de uma escada de cinco

**Avisos.**

- **Fonte dos números:** Os enunciados usam números verificados em 4 de agosto de 2026. Nenhum deles é falso — e nenhum sustenta a conclusão que aparenta sustentar.
- **Procedência declarada:** A fonte declara: "Os enunciados usam números verificados em 4 de agosto de 2026. Nenhum deles é falso."

**Estado no código (informativo, não é camada fonte).** {"status":"não portado","evidencia":["alexandria-modulo-16-content.ts: MODULO_16_INSTRUMENTOS é array vazio (confirmado)","alexandria-modulo-16-content.ts: 10 de 10 aulas com instruments: []","alexand


## M17

### m17-inst-01 · Mapa das jurisdições · reagrupamento por dimensão

**Identidade.** i01 · map (fora de aula) · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Escolha uma das quatro dimensões do critério. As dezessete jurisdições se reagrupam. Observe que a composição dos grupos muda por completo entre uma dimensão e outra — e que nenhuma das quatro é uma ordenação de qualidade.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i01-dim | — | — | chips | Preço | — | Preço / Descarbonização / Regulação / Investimento |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i01-out | — | — | texto | `J.filter(function(j){ return j[it.k]===b; })  // membros; contagem = membros.length` |
| i01-v | — | — | veredito | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Mapa das jurisdições · reagrupamento por dimensão" — "Mapa" e "reagrupamento"
  - intro: "as dezessete jurisdições se reagrupam. Observe que a composição dos grupos muda por completo entre uma dimensão e outra — e que nenhuma das quatro é uma ordenação de qualidade"
  - a fonte não desenha: texto de grupos e veredito
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** As dezessete jurisdições agrupadas em blocos pela dimensão ativa, com a contagem de membros em cada bloco, e a recomposição dos blocos visível ao trocar de dimensão. Restrição de desenho que a fonte impõe: os blocos não podem ser lidos como ranking — nada de ordem vertical decrescente, nada de escala de cor que sugira melhor e pior, porque a fonte declara que nenhuma das quatro dimensões é ordenação de qualidade.
- **Eixo x:** a dimensão ativa (Preço, Descarbonização, Regulação, Investimento)
- **Eixo y:** os blocos daquela dimensão, sem ordem de mérito
- **Séries:** as dezessete jurisdições · os blocos por dimensão · a contagem de membros por bloco
- **Relação que a figura tem de mostrar:** Duas jurisdições que caem no mesmo bloco pela formação de preço podem cair em blocos opostos pela regulação. A recomposição completa dos grupos é a afirmação — e desenhá-la como ranking a desmentiria.
- **Derivação:** literal quanto às quatro dimensões, à contagem de dezessete, ao rótulo do primeiro bloco ("Nodal por ponto da rede") e à advertência sobre ordenação de qualidade
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, gabarito numérico nem arredondamento de resposta para este instrumento.

**Previsão (C3).**

- **Útil:** não. —
- **Ato alternativo (C3):** Condição a encontrar: achar duas jurisdições que estão no mesmo grupo numa dimensão e em grupos opostos noutra.

**Estado no código (informativo, não é camada fonte).** não portado

### m17-inst-02 · Verificador de perímetro de preço

**Identidade.** i02 · a01 · tipo: quebra-cabeca

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Marque o que foi declarado sobre cada um dos dois números que alguém colocou lado a lado. O instrumento devolve o que falta e diz se a comparação sobrevive. Ele recusa concluir enquanto qualquer declaração estiver ausente — e essa recusa é o comportamento correto, não uma limitação.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i02-camada | O que está dentro | — | alternar (clique na linha) | Ausente. | — | Ausente. / Declarada. |
| i02-consum | Quem é o consumidor | — | alternar (clique na linha) | Ausente. | — | Ausente. / Declarada. |
| i02-mercado | Qual mercado formou | — | alternar (clique na linha) | Ausente. | — | Ausente. / Declarada. |
| i02-granul | Granularidade e período | — | alternar (clique na linha) | Ausente. | — | Ausente. / Declarada. |
| i02-tribut | Tributo e subsídio | — | alternar (clique na linha) | Ausente. | — | Ausente. / Declarada. |
| i02-cambio | Base cambial | — | alternar (clique na linha) | Ausente. | — | Ausente. / Declarada. |
| i02-desenho | Qual desenho formou | — | alternar (clique na linha) | Ausente. | — | Ausente. / Declarada. |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i02-rows | — | — | lista | — |
| i02-v | — | — | veredito | `falta = DECL.filter(d => !state[d.k]); classe = falta.length===0 ? 'ok' : (falta.length>=4 ? 'per' : 'att')` |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Verificador de perímetro de preço" — verifica
  - a fonte já monta a forma: sete linhas p7-r com "Declarada." ou "Ausente." e o texto de apoio
- **Sem promessa, mas (C6):** A lista de sete já é a forma certa. O que ela pede do porte é que as sete permaneçam visíveis enquanto o learner marca, e que o contador de ausentes seja lido na própria lista.
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, gabarito numérico nem arredondamento de resposta para este instrumento.
- **Por que não pedir:** A regra de classe conta declarações presentes ou ausentes — contagem exata, sem grandeza contínua. Não é tolerância.

**Previsão (C3).**

- **Útil:** sim. C3: o ato é declarar o que foi declarado, antes de o instrumento dizer se a comparação sobrevive.
- **Pergunta (camada Alexandria):** Alguém pôs dois preços lado a lado. Das sete declarações — o que está dentro, quem é o consumidor, qual mercado formou, granularidade e período, tributo e subsídio, base cambial, qual desenho formou — quantas precisam estar presentes para a comparação sobreviver?
- **Cenário-padrão:** null
- **Resposta no cenário-padrão:** As sete: no estado inicial, 7 de 7 ausentes, e o veredito da fonte diz "A comparação é inválida, não imprecisa". A regra de classe é literal: nenhuma faltando = ok; quatro ou mais faltando = per; entre uma e três = att

**Avisos.**

- **Nota C5:** O veredito "a comparação é inválida, não imprecisa" é a forma correta de recusar concluir, e serve de referência para os demais instrumentos de veredito do currículo.

**Estado no código (informativo, não é camada fonte).** não portado

### m17-inst-03 · Decompositor de diferença

**Identidade.** i03 · a02 · tipo: comparador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Escolha um par de jurisdições e uma dimensão. O instrumento identifica qual das três parcelas vincula a diferença, quais concorrem e qual explicitamente não explica nada — que é a informação que quase nunca aparece e que decide se a diferença é lição, geografia ou governo.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i03-par | — | — | chips | Brasil × meio-atlântico | — | Brasil × meio-atlântico / Meio-atlântico × sul central / Brasil × Alemanha / Brasil × China / Brasil × Chile / Alemanha × França |
| i03-dim | — | — | chips | Preço | — | Preço / Descarbonização / Regulação / Investimento |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i03-out | — | — | barra+legenda+nota | `tot = m.dot+m.des+m.pol; legenda '<parcela> '+peso+'/'+tot; segmento zero → 'par3-seg zero' com flex 0.6 e rótulo '<parcela>: 0'` |
| i03-v | — | — | veredito | `vinc = (m.dot>=m.des && m.dot>=m.pol) ? 'dotação' : (m.des>=m.pol ? 'desenho' : 'política'); classe fixa 'ok'` |

**Forma prometida (C5).**

- **Promete:** sim — cumprido na fonte
  - titulo: "Decompositor de diferença" — decompor é partir em parcelas
  - a fonte desenha: barra de três segmentos com legenda literal ("dotação 2/10", "desenho 7/10", "política 1/10") e regra explícita para o segmento zero
- **Desenho na fonte:** barra #i03-out de três segmentos (par3-seg), com legenda e nota; segmento zero renderizado com classe 'par3-seg zero', flex 0.6 e rótulo '<parcela>: 0'
- **O que precisa ser desenhado:** Uma barra de dez partes dividida em três segmentos — dotação, desenho, política — com o peso de cada um rotulado como fração de dez. Quando uma parcela vale zero, o segmento não desaparece: a fonte declara que ele é desenhado com largura reduzida e rótulo explícito "parcela: 0". A parcela que vincula é a de maior peso e recebe destaque.
- **Eixo x:** peso relativo, em décimos
- **Eixo y:** uma barra única de três segmentos
- **Séries:** dotação · desenho · política · parcela que vincula · parcela que não explica nada
- **Relação que a figura tem de mostrar:** A parcela que vale zero é informação, e a fonte chega a especificar como desenhá-la. É S4 escrito no código: ausência declarada não vira ausência de desenho. Saber que a política não explica nada naquele par é o que impede a recomendação errada — frase literal do instrumento.
- **Derivação:** literal (a legenda, os pesos, a regra do segmento zero e a fórmula de escolha da parcela vinculante são verbatim)
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, gabarito numérico nem arredondamento de resposta para este instrumento.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Brasil contra o mercado organizado do meio-atlântico, na dimensão preço: qual das três parcelas — dotação, desenho ou política — vincula a diferença?
- **Cenário-padrão:** {"par":"Brasil × meio-atlântico","dimensao":"Preço"}
- **Resposta no cenário-padrão:** Desenho, com peso 7 de 10 (dotação 2, política 1). A política é a parcela que não explica nada aqui

**Estado no código (informativo, não é camada fonte).** não portado

### m17-inst-04 · Comparador de desenho de despacho

**Identidade.** i04 · a03 · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Escolha uma jurisdição e uma dimensão de desenho. O instrumento devolve quem despacha, por qual critério, com que granularidade de preço se forma e quem assume o risco de volume — quatro perguntas que, respondidas juntas, descrevem uma arquitetura inteira.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i04-jur | — | — | chips | Brasil | — | Brasil / Mercado organizado do … / Mercado organizado do … / Alemanha / China / Chile |
| i04-dim | — | — | chips | Quem despacha e por qual critério | — | Quem despacha e por qual critério / Granularidade do preço / Quem assume risco de volume |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i04-out | — | — | pares | `j.desp · j.gran · j.risco · j.dot (base J)` |
| i04-v | — | — | veredito | `desp: custo declarado se j.desp começa com 'Custo declarado' ou contém 'custo auditado' (índice>0); gran: j.preco==='nodal' \| 'zonal' \| outro; risco: texto fixo; + sufixo fixo` |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Comparador de desenho de despacho" — "Comparador"
  - intro: "quatro perguntas que, respondidas juntas, descrevem um desenho"
  - a fonte não desenha: pares de texto por jurisdição
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** A matriz das seis jurisdições por quatro perguntas — quem despacha e por qual critério, granularidade do preço, quem assume risco de volume, e a dotação — com todas as células visíveis, porque o intro diz que as perguntas só descrevem um desenho quando respondidas juntas.
- **Eixo x:** as quatro perguntas
- **Eixo y:** as seis jurisdições (Brasil, os dois mercados organizados, Alemanha, China, Chile)
- **Séries:** as vinte e quatro células · classificação de despacho (custo declarado × oferta) · granularidade do preço (nodal, zonal, outro)
- **Relação que a figura tem de mostrar:** O veredito da fonte classifica o despacho e a granularidade em categorias — custo declarado ou oferta; nodal, zonal ou outro. A matriz permite ler que jurisdições com despacho parecido têm granularidade oposta, que é a combinação que importa.
- **Derivação:** literal quanto às seis jurisdições, às três dimensões do seletor e à regra de classificação do veredito
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, gabarito numérico nem arredondamento de resposta para este instrumento.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Brasil, dimensão "Quem despacha e por qual critério": qual a resposta?
- **Cenário-padrão:** {"jurisdicao":"Brasil","dimensao":"Quem despacha e por qual critério"}
- **Resposta no cenário-padrão:** "Custo declarado, otimização centralizada hidrotérmica"

**Avisos.**

- **Nota de extração:** Dois rótulos de jurisdição vêm truncados na fonte como "Mercado organizado do …". Registrado; não completar.

**Estado no código (informativo, não é camada fonte).** não portado

### m17-inst-05 · Grade de remuneração de disponibilidade

**Identidade.** i05 · a04 · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Para cada jurisdição: quem remunera disponibilidade, com que produto, formado por que preço, com que penalidade e sob que instituição. Inclui o instrumento brasileiro, que existe e tem nome diferente.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i05-jur | — | — | chips | Brasil | — | Brasil / Mercado organizado do … / Mercado organizado do … / Alemanha / China / Chile |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i05-out | — | — | pares | `j.disp · j.dispPreco · j.dispPen · j.dispInst` |
| i05-v | — | — | veredito | `ramo por j.regul: capacidade_central \| so_energia \| leilao_longo_prazo \| else (planejamento); classe fixa 'ok'` |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Grade de remuneração de disponibilidade" — "Grade" está no título
  - intro: "Para cada jurisdição: quem remunera disponibilidade, com que produto, formado por que preço, com que penalidade e sob que instituição" — cinco campos fixos
  - a fonte não desenha a grade: pares de texto por jurisdição
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** A grade das seis jurisdições por quatro campos fixos — quem remunera e com que produto, preço, penalidade, instituição — com todas visíveis, e o Brasil marcado como caso que existe com outro nome, que é o que o intro destaca.
- **Eixo x:** os quatro campos fixos
- **Eixo y:** as seis jurisdições
- **Séries:** as células · o regime de cada jurisdição (capacidade central, só energia, leilão de longo prazo, planejamento)
- **Relação que a figura tem de mostrar:** O intro afirma que o instrumento brasileiro existe e tem nome diferente. Essa afirmação só se verifica na grade: é ao ver a linha do Brasil preenchida nos quatro campos, ao lado das outras cinco, que a existência fica demonstrada.
- **Derivação:** literal quanto às seis jurisdições, aos quatro campos e aos quatro regimes do veredito
- **Reúso:** Mesma grade do m17-inst-04, com outros campos.
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, gabarito numérico nem arredondamento de resposta para este instrumento.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Brasil: quem remunera disponibilidade e com que produto?
- **Cenário-padrão:** {"jurisdicao":"Brasil"}
- **Resposta no cenário-padrão:** "Obrigação de lastro vinculada a contrato + leilões dedicados de potência"; regime classificado como leilão de longo prazo

**Estado no código (informativo, não é camada fonte).** não portado

### m17-inst-06 · Conversor de preço de disponibilidade

**Identidade.** i06 · a05 · tipo: calculadora

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Converte um preço de capacidade em custo anual e em equivalente por MWh, para uma carga com fator de carga declarado. Todos os valores de referência são entradas editáveis, com fonte e data no painel. O veredito recusa tratar o resultado como custo real de uma carga específica, e explica por quê.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i06-p | Preço de capacidade | US$/MW-dia | number + range espelhado | 325 | 0 – 900 / passo 1 | — |
| i06-mw | Capacidade acreditada | MW | number + range espelhado | 100 | 1 – 5000 / passo 1 | — |
| i06-fc | Fator de carga da carga | % | number + range espelhado | 85 | 5 – 100 / passo 1 | — |
| i06-d | Dias da janela de entrega | dias | number + range espelhado | 365 | 1 – 400 / passo 1 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| — | Custo da janela | — | — | `anual = p*mw*d; exibido 'US$ '+nfmt(anual/1e6,2)` |
| — | Energia no período | GWh (extração) | — | `mwh = mw*fc*24*d; exibido nfmt(mwh/1000,1)` |
| — | Equivalente | /MWh (extração) | — | `perMwh = mwh>0 ? anual/mwh : NaN; exibido 'US$ '+nfmt(perMwh,2)` |
| — | Sobre a placa? | — | — | `texto fixo 'não'` |
| i06-v | — | — | veredito | — |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Conversor de preço de disponibilidade" — converte
  - intro: "O veredito recusa tratar o resultado como…"
- **Sem promessa, mas (C6):** A conversão de US$/MW-dia para US$/MWh depende do fator de carga, e o readout "Sobre a placa?" responde "não" de forma fixa. Duas marcas numa régua de US$/MWh — o equivalente calculado e a referência de energia com que ele costuma ser confundido — mostrariam a conversão como distância.
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, gabarito numérico nem arredondamento de resposta para este instrumento.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Preço de capacidade de US$ 325 por MW-dia, 100 MW acreditados, carga com fator de carga de 85% e janela de entrega de 365 dias: qual o equivalente em US$/MWh?
- **Cenário-padrão:** {"Preço de capacidade":325,"Capacidade acreditada":100,"Fator de carga da carga":85,"Dias da janela de entrega":365}
- **Resposta no cenário-padrão:** US$ 15,93/MWh (custo da janela US$ 11,86 mi; energia no período 744,6 GWh; "Sobre a placa?": não)

**Avisos.**

- **Fonte dos números:** Fonte dos valores de partida: relatórios de leilão de capacidade do operador, entregas 2026/2027 a 2028/2029; consulta em 4 de agosto de 2026. Números vivos. Grandeza: US$/MW-dia sobre capacidade acreditada, não sobre placa. Base cambial: nominal, sem conversão.
- **Procedência declarada:** A fonte declara: "Fonte dos valores de partida: relatórios de leilão de capacidade do operador, entregas 202…"
- **Divergência (P5/P8):** Registrado no README do M17: o teto declarado do leilão de capacidade é aritmeticamente falso em relação ao preço de partida (229,72 < 325). P20: verificação autoritativa obrigatória antes de exibir qualquer um dos dois como referência.

**Estado no código (informativo, não é camada fonte).** não portado

### m17-inst-07 · Régua de estágio aplicada a política estrangeira

**Identidade.** i07 · a06 · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “A régua de cinco posições construída no Módulo 16 é citada, não reconstruída. Aqui ela é aplicada a instrumentos de política e de regulação estrangeiros. Escolha um instrumento: o painel devolve a posição na régua, a evidência que aquela posição exige, o que ela não autoriza concluir e o gatilho que faria a posição mud”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i07-obj | — | — | chips | Ajuste de fronteira — regime definitivo | — | Ajuste de fronteira — regime definitivo / Venda de certificados de fronteira / Abatimento por preço de carbono pago na origem / Término antecipado de créditos de eletricidade limpa / Critério de gasto |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i07-out | — | — | pares | — |
| i07-v | — | — | veredito | `classe = POS[o.p].cls; texto = "O que esta posição não autoriza concluir." + o.nao + sufixo fixo` |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho, com a figura já especificada em outro módulo
  - titulo: "Régua de estágio aplicada a política estrangeira" — "Régua"
  - intro: "A régua de cinco posições construída no Módulo 16 é citada, não reconstruída" — a fonte declara a reutilização
  - a fonte não desenha: pares de texto e veredito
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** A mesma régua de cinco posições do m16-inst-02, agora com instrumentos de política e de regulação estrangeiros marcados sobre ela, e o veredito lendo o que aquela posição não autoriza concluir.
- **Eixo x:** as cinco posições da régua do M16
- **Eixo y:** a régua, com o instrumento selecionado marcado
- **Séries:** posição na régua · evidência que a posição exige · o que a posição não autoriza concluir
- **Relação que a figura tem de mostrar:** A fonte declara que a régua é citada e não reconstruída. Portar duas réguas diferentes contradiria o texto do próprio módulo — a figura tem de ser reconhecivelmente a mesma.
- **Derivação:** literal (a frase "citada, não reconstruída" é texto da fonte)
- **Reúso:** Reaproveita integralmente a régua do m16-inst-02.
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, gabarito numérico nem arredondamento de resposta para este instrumento.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Ajuste de fronteira em regime definitivo: em que posição da régua de cinco ele está?
- **Cenário-padrão:** "Ajuste de fronteira — regime definitivo"
- **Resposta no cenário-padrão:** "Em operação"

**Avisos.**

- **Fonte dos números:** Estados verificados em fonte primária — texto normativo, orientação administrativa e comunicado de operador — em 4 de agosto de 2026. Números vivos · ciclo político: esta é a categoria mais volátil das três parcelas, e a posição de qualquer item desta lista pode mudar sem que o desenho de mercado da jurisdição se altere.
- **Procedência declarada:** A fonte declara: "Estados verificados em fonte primária — texto normativo, orientação administrativa e comunicado."

**Estado no código (informativo, não é camada fonte).** não portado

### m17-inst-08 · Verificador de pressuposto institucional

**Identidade.** i08 · a07 · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Escolha um mecanismo estrangeiro. O instrumento decompõe de quais funções institucionais ele depende para existir — operar, contabilizar, liquidar, fiscalizar, julgar, financiar — e devolve, para cada função, qual instituição brasileira a ocupa, ou se ela está ausente. Usa o mapa do Módulo 07 como gabarito e não o reen”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i08-mec | — | — | chips | Mercado central de capacidade | — | Mercado central de capacidade / Preço nodal com direitos financeiros de transmissão / Despacho por oferta / Mercado só de energia com preço de escassez / Sistema de teto e comércio / Ajuste de frontei |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i08-out | — | — | pares | `chave = função+' — '+requisito; valor = selo(E[estado]) + '<br>' + situação brasileira` |
| i08-v | — | — | veredito | `aus = nº de 'aus'; classe = aus>=3 ? 'per' : (aus>=1 ? 'att' : 'ok'); texto = m.s + ' Funções ausentes: '+aus+' de '+m.f.length+'.' + sufixo` |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Verificador de pressuposto institucional"
  - intro: "decompõe de quais funções institucionais ele depende para existir — operar, contabilizar, liquidar, fiscalizar, julgar, financiar — e devolve, para cada função, qual instituição brasileira…"
  - a fonte não desenha: pares de texto com selo de estado
- **Desenho na fonte:** pares função + requisito, com selo de estado (E[estado]) e a situação brasileira
- **O que precisa ser desenhado:** As funções institucionais que o mecanismo escolhido exige, uma linha cada, com um selo de estado por linha — ocupada, de natureza distinta, ausente — e o contador de ausentes decidindo a classe do veredito. As três classes de estado precisam de silhuetas distintas e não de cor de certo e errado (S2).
- **Eixo x:** os três estados (ocupada, natureza distinta, ausente)
- **Eixo y:** as funções institucionais exigidas pelo mecanismo
- **Séries:** função e requisito · estado da instituição brasileira correspondente · contagem de ausentes
- **Relação que a figura tem de mostrar:** A pergunta "o Brasil deveria adotar?" não tem resposta binária: ela vira a contagem de quantas funções mudariam de natureza. No cenário-padrão, duas de cinco. É o contador, e não o mecanismo, que carrega a conclusão.
- **Derivação:** literal quanto às seis funções nomeadas no intro, aos três estados e à regra de classe (aus ≥ 3 = per; aus ≥ 1 = att; senão ok)
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, gabarito numérico nem arredondamento de resposta para este instrumento.
- **Por que não pedir:** Classificação por contagem exata de funções. Não há grandeza contínua para tolerar.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Mercado central de capacidade: das funções institucionais de que ele depende, quantas estão ausentes no Brasil e quantas mudariam de natureza?
- **Cenário-padrão:** "Mercado central de capacidade"
- **Resposta no cenário-padrão:** 1 ausente, 2 de natureza distinta e 2 ocupadas, de 5 funções — "Duas das cinco funções mudariam de natureza"

**Estado no código (informativo, não é camada fonte).** não portado

### m17-inst-09 · Calculadora de ajuste de fronteira

**Identidade.** i09 · a08 · tipo: calculadora

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Todos os parâmetros são entradas editáveis, com fonte e data no painel. O instrumento devolve o custo incremental e recusa tratá-lo como imposto sobre o produto, explicando o que ele é. Observe o efeito de mudar o setor: a inclusão ou não da parcela elétrica altera o resultado mais do que qualquer outro parâmetro.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i09-set | setor | — | chips | Ferro e aço | — | Ferro e aço / Alumínio / Cimento / Fertilizantes |
| i09-vol | Volume exportado | kt/ano | number + range espelhado | 100 | 0 – 2000 / passo 1 | — |
| i09-dir | Intensidade direta | tCO₂e/t | number + range espelhado | 1.6 | 0 – 12 / passo 0.01 | — |
| i09-ind | Intensidade indireta (eletricidade) | tCO₂e/t | number + range espelhado | 0.25 | 0 – 12 / passo 0.01 | — |
| i09-pc | Preço do certificado | €/t | number + range espelhado | 75 | 0 – 250 / passo 0.01 | — |
| i09-fe | Fator de entrada gradual | % | number + range espelhado | 5 | 0 – 100 / passo 0.5 | — |
| i09-or | Preço de carbono pago na origem | €/t | number + range espelhado | 0 | 0 – 250 / passo 0.01 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| — | Base contabilizada | kt CO₂e (extração) | — | `vol=kt*1000; intens = dir + (setor.ind ? ind : 0); tco2 = vol*intens; nfmt(tco2/1000,1)` |
| — | Exposição bruta | € (script) | — | `bruto = tco2*pc; '€ '+nfmt(bruto/1e6,2)` |
| — | Com fator de entrada | — | — | `comFe = bruto*fe (fe = %/100); '€ '+nfmt(comFe/1e6,2)` |
| — | Após abatimento | — | — | `liq = tco2*Math.max(0, pc-or)*fe; '€ '+nfmt(liq/1e6,2)` |
| — | Por tonelada | /t (extração) | — | `porT = vol>0 ? liq/vol : 0; '€ '+nfmt(porT,2)` |
| — | Indireta contabilizada | — | — | `setor.ind ? 'sim' : 'não'` |
| i09-v | — | — | veredito | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Calculadora de ajuste de fronteira"
  - intro: "O instrumento devolve o custo incremental e recusa tratá-lo como imposto sobre o produto, explicando o que ele é"
  - as saídas são uma sequência de reduções sucessivas sobre a mesma base
  - a fonte não desenha: readouts de texto
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** Uma cascata de quatro degraus sobre a mesma base: exposição bruta, depois o efeito do fator de entrada gradual, depois o abatimento pelo preço de carbono pago na origem, chegando ao valor líquido — e, ao lado, o mesmo valor por tonelada de produto. Cada degrau rotulado com o que o reduziu, porque é a sequência de reduções que explica o que o mecanismo é.
- **Eixo x:** os degraus da cascata
- **Eixo y:** € milhões, com o valor por tonelada numa leitura à parte
- **Séries:** base contabilizada (kt CO₂e) · exposição bruta · com fator de entrada · após abatimento · por tonelada · se a intensidade indireta é contabilizada naquele setor
- **Relação que a figura tem de mostrar:** A exposição bruta e o custo líquido diferem por vinte vezes no cenário-padrão, e a diferença inteira vem do fator de entrada gradual. Quem lê só o primeiro número acha que é um imposto; quem lê a cascata vê que é uma trajetória. Trocar o setor muda a base, porque a inclusão da intensidade indireta depende do setor.
- **Derivação:** derivado do código-fonte (vol, intens, tco2, bruto, comFe, liq e porT são verbatim)
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, gabarito numérico nem arredondamento de resposta para este instrumento.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Ferro e aço, 100 kt/ano exportados, intensidade direta de 1,6 tCO₂e/t, certificado a €75/t, fator de entrada gradual de 5% e nenhum preço de carbono pago na origem: qual o custo por tonelada?
- **Cenário-padrão:** null
- **Resposta no cenário-padrão:** € 6,00/t (base contabilizada 160,0 kt CO₂e; exposição bruta € 12,00 mi; com fator de entrada € 0,60 mi; após abatimento € 0,60 mi; intensidade indireta contabilizada: não)

**Avisos.**

- **Fonte dos números:** Fonte dos valores de partida: regulamento do mecanismo e atos de execução publicados até a data; preço de certificado conforme publicação oficial trimestral de 2026. Consulta em 4 de agosto de 2026. Números vivos · perímetro: intensidade por instalação e produto, não média nacional. Base cambial: euro nominal, sem conversão. Este instrumento não substitui cálculo jurídico nem verificação acreditad
- **Procedência declarada:** A fonte declara: "Fonte dos valores de partida: regulamento do mecanismo e atos de execução publicados até a…"

**Estado no código (informativo, não é camada fonte).** não portado

### m17-inst-10 · Decompositor de penetração renovável

**Identidade.** i10 · a09 · tipo: calculadora

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Entradas editáveis para os quatro números. O veredito recusa reportar qualquer um deles isolado e mostra a razão entre o maior e o menor — que é, na prática, o tamanho do erro que uma citação sem rótulo comete.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i10-cr | Capacidade renovável | GW | number + range espelhado | 140 | 0 – 4000 / passo 0.1 | — |
| i10-ct | Capacidade total | GW | number + range espelhado | 250 | 1 – 5000 / passo 0.1 | — |
| i10-gr | Geração renovável | TWh | number + range espelhado | 190 | 0 – 8000 / passo 1 | — |
| i10-gt | Geração total | TWh | number + range espelhado | 520 | 1 – 12000 / passo 1 | — |
| i10-pk | Pico instantâneo de participação | % | number + range espelhado | 78 | 0 – 100 / passo 0.1 | — |
| i10-cu | Corte de geração renovável | TWh | number + range espelhado | 12 | 0 – 2000 / passo 0.1 | — |
| i10-sx | Saldo importador líquido | TWh | number + range espelhado | 45 | -2000 – 2000 / passo 0.1 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| — | 1 · Capacidade instalada | % (extração) | — | `n1 = ct>0 ? cr/ct*100 : 0; nfmt(n1,1)` |
| — | 2 · Geração no ano | % (extração) | — | `n2 = gt>0 ? gr/gt*100 : 0` |
| — | 3 · Pico instantâneo | % (extração) | — | `n3 = pk` |
| — | 4 · Consumida líquida | % (extração) | — | `sx>=0: consumo = gt+sx, renCons = gr; sx<0: consumo = max(1e-9, gt+sx), renCons = max(0, gr+sx); n4 = renCons/consumo*100` |
| — | Corte sobre disponível | % (extração) | — | `perda = (gr+cu)>0 ? cu/(gr+cu)*100 : 0` |
| — | Maior ÷ menor | — | — | `razao = mn>0 ? mx/mn : Infinity; isFinite ? nfmt(razao,2)+'×' : '—'` |
| i10-v | — | — | veredito | — |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho
  - titulo: "Decompositor de penetração renovável" — decompõe uma grandeza em várias
  - intro: "O veredito recusa reportar qualquer um deles isolado e mostra a razão entre o maior e o menor"
  - a fonte não desenha: readouts de texto
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** Os quatro números sobre uma única régua de 0 a 100% — capacidade instalada, geração no ano, pico instantâneo e consumida líquida — com o maior e o menor marcados e a distância entre eles rotulada como a razão. É essa distância que o intro chama de "o tamanho do erro que uma citação sem rótulo comete".
- **Eixo x:** participação renovável, 0 a 100%
- **Eixo y:** as quatro definições sobre a mesma régua
- **Séries:** 1 · capacidade instalada · 2 · geração no ano · 3 · pico instantâneo · 4 · consumida líquida · razão maior ÷ menor · corte sobre disponível
- **Relação que a figura tem de mostrar:** As quatro medem coisas diferentes e todas se chamam "penetração renovável". Postas na mesma régua, a distância entre a maior e a menor é visível de imediato — 2,32 vezes no cenário-padrão. Reportar uma sozinha é escolher um ponto dessa régua sem dizer qual.
- **Derivação:** derivado do código-fonte (n1 a n4, perda e razao são verbatim)
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, gabarito numérico nem arredondamento de resposta para este instrumento.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** 140 GW renováveis em 250 GW de capacidade total, 190 TWh renováveis em 520 TWh de geração total, pico instantâneo de 78% e saldo importador líquido de 45 TWh: quantas vezes a maior das quatro definições de penetração renovável supera a menor?
- **Cenário-padrão:** null
- **Resposta no cenário-padrão:** 2,32 × (capacidade 56,0 %; geração no ano 36,5 %; pico instantâneo 78,0 %; consumida líquida 33,6 %; corte sobre disponível 5,9 %)

**Avisos.**

- **Fonte dos números:** Valores de partida ilustrativos, editáveis. Para uso externo, substituir por série de organismo oficial de estatística com metodologia publicada, declarando qual dos quatro números está sendo usado e qual o período. Números vivos · perímetro.
- **Content QA (P20):** A fonte declara que os valores de partida são ilustrativos e editáveis, e que para uso externo devem ser substituídos por série de organismo estatístico.

**Estado no código (informativo, não é camada fonte).** não portado

### m17-inst-11 · Normalizador de preço ao consumidor

**Identidade.** i11 · a10 · tipo: comparador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Monte a pilha de custo de dois consumidores industriais em jurisdições diferentes, camada por camada. Todas as camadas são entradas editáveis. O veredito recusa concluir enquanto o perímetro não estiver declarado nos dois lados — e mostra quanto da diferença aparente vinha de camadas que não estavam no mesmo número.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i11-ae | A · energia | un/MWh | number + range espelhado | 40 | 0 – 400 / passo 0.5 | — |
| i11-ar | A · transporte e encargos | un/MWh | number + range espelhado | 45 | 0 – 400 / passo 0.5 | — |
| i11-at | A · tributos não recuperáveis | un/MWh | number + range espelhado | 12 | 0 – 400 / passo 0.5 | — |
| i11-be | B · energia | un/MWh | number + range espelhado | 65 | 0 – 400 / passo 0.5 | — |
| i11-br | B · transporte e encargos | un/MWh | number + range espelhado | 20 | 0 – 400 / passo 0.5 | — |
| i11-bt | B · tributos não recuperáveis | un/MWh | number + range espelhado | 8 | 0 – 400 / passo 0.5 | — |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| — | Só energia | — | — | `nfmt(ae,1)+' vs '+nfmt(be,1)` |
| — | + transporte e encargos | — | — | `nfmt(ae+ar,1)+' vs '+nfmt(be+br,1)` |
| — | Fatura cheia | — | — | `nfmt(ae+ar+at,1)+' vs '+nfmt(be+br+bt,1)` |
| — | Δ só energia | % (extração) | — | `d(a,b) = b!==0 ? (a-b)/b*100 : 0 sobre a camada 1` |
| — | Δ fatura cheia | % (extração) | — | `d(c3a,c3b)` |
| — | Mais barato na cheia | — | — | `cheaper(a,b) = a<b ? 'A' : (a>b ? 'B' : 'empate')` |
| i11-v | — | — | veredito | `inv = cheaper(c1)!==cheaper(c3) && nenhum 'empate'` |

**Forma prometida (C5).**

- **Promete:** sim — promessa sem desenho — o intro manda montar uma pilha e nada é empilhado
  - titulo: "Normalizador de preço ao consumidor"
  - intro: "Monte a pilha de custo de dois consumidores industriais em jurisdições diferentes, camada por camada" — a fonte escreve "pilha" e "camada por camada"
  - a fonte não desenha: readouts de texto em pares "A vs B"
- **Desenho na fonte:** —
- **O que precisa ser desenhado:** Duas pilhas lado a lado, A e B, com as mesmas três camadas na mesma ordem e na mesma escala — energia, transporte e encargos, tributos não recuperáveis — e três linhas horizontais atravessando as duas nas alturas cumulativas: só energia, mais transporte e encargos, fatura cheia. Quando o mais barato muda de lado entre a primeira e a terceira linha, o cruzamento precisa estar visível.
- **Eixo x:** os dois consumidores, A e B
- **Eixo y:** unidades por MWh, escala comum
- **Séries:** A · energia · A · transporte e encargos · A · tributos não recuperáveis · B · idem · as três alturas cumulativas · marca de quem é mais barato em cada altura
- **Relação que a figura tem de mostrar:** No cenário-padrão, A é mais barato só na energia (40,0 contra 65,0), empata na segunda camada (85,0 contra 85,0) e fica mais caro na fatura cheia (97,0 contra 93,0). A inversão é o conteúdo do instrumento, e ela é um cruzamento de duas pilhas — impossível de ler em pares de números.
- **Derivação:** literal quanto aos seis rótulos de camada e aos três níveis de leitura; as fórmulas de diferença e de inversão são verbatim
- **Custo:** M

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, gabarito numérico nem arredondamento de resposta para este instrumento.

**Previsão (C3).**

- **Útil:** sim. —
- **Pergunta (camada Alexandria):** Consumidor A com 40 de energia, 45 de transporte e encargos e 12 de tributos; consumidor B com 65, 20 e 8: quem é mais barato só na energia, e quem é mais barato na fatura cheia?
- **Cenário-padrão:** null
- **Resposta no cenário-padrão:** Na energia, A (40,0 contra 65,0 — Δ −38,5%); na fatura cheia, B (97,0 contra 93,0 — Δ +4,3%). A comparação inverte

**Avisos.**

- **Fonte dos números:** Valores de partida ilustrativos e editáveis, não referência de mercado. Números vivos · base cambial: declare nominal ou paridade e use a mesma nos dois lados. Tributo recuperável pela indústria não é custo e deve ser zerado nos dois lados ou mantido nos dois.
- **Content QA (P20):** A fonte declara que os valores de partida são ilustrativos e editáveis, não referência de mercado.

**Estado no código (informativo, não é camada fonte).** não portado

### m17-inst-12 · Verificador de comparação · instrumento assinatura

**Identidade.** i12 · a11 · tipo: explorador

**O que ele pergunta.** *A fonte não dá pergunta própria ao instrumento.* — instrução da fonte: “Doze enunciados comparativos, três por categoria de defeito. Cada um é construído para ser verdadeiro e insuficiente. Filtre por tipo de defeito ou percorra todos. O painel devolve o defeito dominante, o que exatamente falta, a pergunta que você faz e a forma corrigida do enunciado.”

**Entradas.**

| id | rótulo | unidade | tipo | padrão | faixa | opções |
|---|---|---|---|---|---|---|
| i12-fil | — | — | chips | Todos | — | Todos / Perímetro / Atribuição / Pressuposto / Unidade |
| i12-nav | — | — | botões | — | — | ← anterior / próximo → |

**Saídas.**

| id | rótulo | unidade (origem) | tipo | fórmula declarada pela fonte |
|---|---|---|---|---|
| i12-out | — | — | painel | — |

**Forma prometida (C5).**

- **Promete:** não — o nome e o texto não prometem forma desenhada.
  - titulo: "Verificador de comparação · instrumento assinatura" — verifica
  - intro: "Doze enunciados comparativos, três por categoria de defeito"
- **Sem promessa, mas (C6):** Mesma observação do m14-inst-10, m15-inst-10 e m16-inst-11: a grade por categoria entrega a resposta antes da tentativa, e por isso entra depois do registro (C7).
- **Custo:** P

**Tolerância (P6).**

- `"tolerancia": null` — a fonte não declara.
- **Veredito permitido:** nenhum. Autoavaliação em três níveis (atende · atende em parte · não atende).
- **Nota da fonte:** A fonte não declara tolerância, gabarito numérico nem arredondamento de resposta para este instrumento.

**Previsão (C3).**

- **Útil:** sim. C3 e C7.
- **Pergunta (camada Alexandria):** Enunciado: "O preço médio de atacado deles foi de €89/MWh no ano passado; o nosso ficou bem abaixo d…" Qual o defeito dominante — perímetro, atribuição, pressuposto ou unidade?
- **Cenário-padrão:** null
- **Resposta no cenário-padrão:** Perímetro não declarado (enunciado 1 de 12, declarado pela fonte como "verdadeiro e insuficiente")

**Avisos.**

- **Nota C5:** É o instrumento assinatura do módulo e fecha a série dos quatro verificadores de enunciado (M14, M15, M16, M17). Portar os quatro com a mesma mecânica.

**Estado no código (informativo, não é camada fonte).** não portado
