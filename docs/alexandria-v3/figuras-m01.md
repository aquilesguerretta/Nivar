# Figuras do M01 — especificação por aula (regra de imagem da v3)

Base: [`REGRA-DE-IMAGEM.md`](REGRA-DE-IMAGEM.md) (decisão do Founder, 14/11/2026).
Fonte de dado e de texto: **somente** `docs/alexandria-v2/extraction/m01/` — nada aqui foi
buscado fora dela, a não ser as fotos reais (que ficam em `public/alexandria/v3/aulas/m01/`,
com linha em [`../alexandria-v2/media-provenance.md`](../alexandria-v2/media-provenance.md),
seção "Alexandria v3 — aulas do M01").

Classes, como na regra: **real** (1) · **gerada realista** (2) · **diagrama** (3) · **estética** (4).
Linha de origem = linha do HTML-fonte `alexandria_modulo01.html`, como nas extrações (±3).

## Como ler uma especificação de diagrama

Cada `D-Axx-n` diz: o que a figura mostra e **de qual linha da extração vem o dado**, eixos e
unidades, o que **não** está na fonte (e portanto não pode ser inventado), e a linha de fonte a
escrever embaixo. Estado possível:

- **pronto para desenhar** — dado inteiro na extração;
- **espera dado** — a extração não tem a série/valor; desenhar seria inventar;
- **espera decisão do Founder** — a própria fonte entra em conflito, ou a figura exigiria
  conteúdo que a aula não tem.

Regras comuns a todos os diagramas (regra 3): fundo liso, eixos com rótulo e unidade, escala
legível, sem hachura de gravura, sem papel envelhecido, sem ornamento; **sem cor de semáforo**
(invariante de design); fonte escrita embaixo. Onde a extração diz "procedência não declarada",
a legenda diz **"valores da aula"**, nunca "dados oficiais".

---

## Tabela-resumo: aula × figura × classe × arquivo

`real` = baixada, licença conferida na página do arquivo; `existente` = já registrada em
`media-provenance.md` (não mexi); `D-…` = especificação neste documento.

| Aula | Figura / ponto do texto | Classe | Arquivo ou estado |
|---|---|---|---|
| A01 | Itaipu (≈ 14 GW, tabela 1.3, L1406) | real | `m01v3-a01-itaipu` |
| A01 | Medidor de kWh (consumo que aparece na fatura; 1.3, L1407) | real | `m01v3-a01-medidor-kwh` |
| A01 | Escala de potência W → GW (tabela 1.3, L1403–1406) | diagrama | D-A01-1 · pronto (valores da aula) |
| A01 | kWh = kW × h; 50 kW × 1 h × 1 kW × 50 h (1.4 e nota do INST·01) | diagrama | D-A01-2 · pronto |
| A01 | Usina em corte (bloco 4) | gerada realista | `m01-a01-01` existente — reavaliar (§ Geradas) |
| A01 | Torneira / caixa d'água (bloco 9; tabela 1.2, L1386–1389) | gerada realista | `m01-a01-02` existente — manter, com ressalva |
| A02 | Linha de transmissão de ≥ 230 kV (tabela 2.1, L1507) | real | `m01v3-a02-torres-itaipu` |
| A02 | Subestação (subtransmissão → distribuição, 2.1) | real | `m01v3-a02-subestacao-cpfl` |
| A02 | Pilha de Volta (história da tensão) | real (gravura documental) | `m01-a02-01` existente |
| A02 | Escada de tensões 127 V → 230 kV+ (tabela 2.1, L1496–1509) | diagrama | D-A02-1 · pronto (valores da aula) |
| A02 | Cadeia V × A → W → kW → kWh × tarifa = custo (L1517) | diagrama | D-A02-2 · pronto |
| A02 | Triângulo kW / kVAr / kVA (2.5, L1578) | diagrama | reusa D-A07-1 |
| A03 | Gerador do Adams Power Plant, Niagara (AC vence, 3.3, L1622) | real (documento histórico) | `m01v3-a03-niagara-geradores` |
| A03 | Edison · Westinghouse · Tesla (Guerra das Correntes, L1622) | real (retratos PD) | `m01v3-a03-edison`, `-westinghouse`, `-tesla` |
| A03 | Onda senoidal no osciloscópio (3.2, L1596) | real | `m01v3-a03-osciloscopio-senoide` (10 kHz — ver legenda) |
| A03 | Frequencímetro de lâminas | real | `m01-a03-02` existente |
| A03 | Anel de Faraday | real (documento histórico) | `m01-a03-01` existente |
| A03 | DC × AC (figura-fonte `m01-a03-fig-01`, L1599–1619) | diagrama | D-A03-1 · pronto |
| A03 | Geração ≈ consumo → frequência (3.4, L1629–1636) | diagrama | D-A03-2 · conceitual, sem número |
| A04 | Usina térmica + torre de transmissão (perdas, cadeia da rede) | real | `m01v3-a04-candiota` |
| A04 | Torres de alta tensão (4.2, L1700) | real | reusa `m01v3-a02-torres-itaipu` |
| A04 | Ligação clandestina (perdas não técnicas, 4.3, L1712–1720) | real (não é no Brasil) | `m01v3-a04-furto-energia` |
| A04 | Cadeia de tensão da usina à casa (bloco 5) | gerada realista | `m01-a04-01` existente — reavaliar |
| A04 | Perdas I²R × corrente (4.1, L1661–1666 + INST·03) | diagrama | D-A04-1 · pronto (cenário didático) |
| A04 | Mesma potência, mais tensão (4.2, L1698) | diagrama | D-A04-2 · pronto (derivado das duas fórmulas) |
| A05 | Estrada fábrica → centro logístico (5.1, L1737) | gerada realista | `m01-a05-01` existente — reavaliar; **sem foto real adequada achada** |
| A05 | Capacidade que paga × média usada (INST·04, 144.000 kWh / 720 h / 800 kW) | diagrama | D-A05-1 · pronto (cenário didático) |
| A05 | Curva de carga no tempo | diagrama | D-A05-2 · **espera dado** |
| A05 | Faixas de fator de carga (tabela, L1811–1816) | diagrama | D-A05-3 · pronto, com 2 lacunas da fonte |
| A06 | Transformador de poste (Grupo B / A4 → B, 6.1) | real (não é no Brasil) | `m01v3-a06-transformador-poste` |
| A06 | Subestação | real | reusa `m01v3-a02-subestacao-cpfl` |
| A06 | Subgrupos A1…AS e Grupo B por tensão (tabelas L1843 e L1856) | diagrama | D-A06-1 · pronto, com lacunas da fonte |
| A06 | Mono / bi / trifásico (tabela L1884) | diagrama | D-A06-2 · **publicado 15/11** (120° do § Lex, L2661; ver rodada 3) |
| A06 | Cadeia de tensão (bloco 8) | gerada realista | reusa `m01-a04-01` — reavaliar |
| A07 | Banco de capacitores | real | `m01-a07-02` existente |
| A07 | Forno elétrico de aço (carga indutiva/não linear, 7.1 e A09) | real (documento histórico, 1941) | `m01v3-a07-forno-eletrico` |
| A07 | Triângulo de potência (figura-fonte `m01-a07-fig-01`, L1917–1948) | diagrama | D-A07-1 · pronto |
| A07 | Corrente em fase × atrasada (7.1, L1908–1910) | diagrama | D-A07-2 · pronto (ângulo derivado) |
| A07 | Referência 0,92 e leitura de FP (L1981, L1986) | diagrama | D-A07-3 · **publicado 15/11** (decisão 2; ver rodada 3) |
| A07 | Rebocador na sirga (analogia do reativo, bloco 5) | gerada realista | `m01-a07-01` existente — reavaliar |
| A08 | Hidrelétrica | real | `m01v3-a01-itaipu` (reuso) e `m01-a08-04` existente (Sobradinho) |
| A08 | Solar fotovoltaica no Brasil | real | `m01v3-a08-solar-pirapora` |
| A08 | Eólica no Nordeste | real | `m01v3-a08-eolica-cutia` |
| A08 | Nuclear | real | `m01v3-a08-nuclear-angra` |
| A08 | Térmica (UTE Candiota III; combustível a confirmar) | real | `m01v3-a04-candiota` (reuso) |
| A08 | Térmica (motogeradores, combustível não confirmado) | real | `m01v3-a08-termica-camacari` |
| A08 | Solar e térmica, dia e noite (bloco 2) | gerada (gravura) | `m01-a08-02` existente — **substituir** (§ Geradas) |
| A08 | Exemplo 100 MW × 8.760 h = 876.000 MWh; real 220.000 MWh (L2023) | diagrama | D-A08-1 · pronto (cenário didático) |
| A08 | FCs típicos por fonte (figura `cf-chart`, L2059–2085) | diagrama | D-A08-2 · **publicado 15/11** (decisão 3: faixas da figura; ver rodada 3) |
| A08 | Capacidade instalada × geração efetiva da matriz (L2090) | diagrama | D-A08-3 · **espera dado** |
| A09 | Apagão (interrupção, DEC/FEC) | real (não é no Brasil) | `m01v3-a09-apagao-madrid` |
| A09 | Forno elétrico (flicker) | real | reusa `m01v3-a07-forno-eletrico` |
| A09 | Janela de medição de tensão: 10 min × 7 dias = 1.008 leituras (L2152) | diagrama | D-A09-1 · pronto |
| A09 | Afundamento, sobretensão, harmônicos (tabela L2140) | diagrama | D-A09-2 · **publicado 15/11** (ilustrativo, sem número; ver rodada 3) |

Pontos do texto que **não** pedem imagem (tabelas e listas ficam como tabela/lista): demanda
contratada × medida × ultrapassagem (A05, L1746); siglas DEC/FEC/DIC/FIC/DMIC/DICRI (A09, L2123);
as três dimensões da qualidade (A09, L2111); perdas técnicas × não técnicas (A04, L1712 — a foto
acompanha a tabela, não a substitui); os três níveis de explicação (A01, L1461–1472, texto).

---

## Aula 01 — Energia é volume. Potência é velocidade.

A fonte não tem figura (extração: "Figuras: 0"). Os pontos do texto que se beneficiam de imagem:
a analogia da torneira (1.2), a escala de unidades (1.3) e a fórmula com o instrumento (1.4).

### D-A01-1 · Escala de potência (diagrama)

- **O que mostra.** Quatro exemplos da tabela 1.3: lâmpada LED ≈ 9 W (L1403), chuveiro elétrico
  ≈ 5,5 kW (L1404), britador de mineração ≈ 2 MW (L1405), Itaipu ≈ 14 GW de capacidade (L1406).
- **Forma.** Marcas (ponto + rótulo) sobre **um eixo horizontal logarítmico**.
- **Eixos e unidade.** Eixo x: potência, **W**, escala log de 1 W a 100 GW, com marcadores nos
  prefixos W · kW · MW · GW (L1403–1406: "1.000 W", "1.000 kW", "1.000 MW").
- **Não está na fonte.** Procedência dos números ("O que a fonte não tem", extração A01, L144).
- **Fonte a escrever.** "Valores ilustrativos da aula (Alexandria, M01 · Aula 01, 1.3)."
  Não escrever "Itaipu Binacional" nem outra fonte sem que a procedência seja conferida.
- **Estado.** Pronto para desenhar; os valores são os da aula.

### D-A01-2 · Mesma energia, perfis opostos (diagrama)

- **O que mostra.** Dois retângulos de **mesma área**: 50 kW × 1 h e 1 kW × 50 h (nota do
  INST·01, "Experimente comparar dois cenários…"; execução do script em DOM simulado: ambos dão
  **50 kWh**). A área é a energia (E = P × t, fórmula 1.4, L1416).
- **Eixos e unidade.** x: tempo, **h**; y: potência, **kW**; área rotulada "50 kWh" nos dois.
  Dois painéis lado a lado com escalas próprias e declaradas (o painel de 1 kW × 50 h não cabe
  na mesma escala do de 50 kW × 1 h — escrever isso no rótulo, não esconder).
- **Fonte a escrever.** "Cenários da nota do instrumento INST·01 (Aula 01)."
- **Estado.** Pronto.
- **Cuidado (DIV-01 da A01).** A tabela 1.2 (L1386–1389) faz vazão = potência e diâmetro = corrente;
  a A02 (L1512) faz corrente = vazão. Esta figura **não usa a analogia da água**, de propósito.

---

## Aula 02 — Volts, amperes, watts

A fonte não tem figura (extração A02: "Figuras: 0"). Tem uma tabela de tensões e duas fórmulas.

### D-A02-1 · Escada de tensões (diagrama)

- **O que mostra.** As sete linhas da tabela 2.1 (L1496–1509): 127 / 220 V; 220 / 380 / 440 V;
  13,8 kV; 23 / 34,5 kV; 69 kV; 88 / 138 kV; 230 kV +, cada uma com "onde aparece" e "quem consome".
- **Forma.** Faixas horizontais sobre eixo logarítmico; cada faixa leva o rótulo da tabela.
- **Eixos e unidade.** x: tensão, **V** (escala log, 100 V a 1 MV), com rótulo em kV acima de 1 kV.
- **Lacuna da fonte.** A tabela não dá valor para 1 kV–13,8 kV nem 34,5–69 kV, e "230 kV +" não
  tem teto. Desenhar só o que a tabela diz; "230 kV +" termina em seta aberta.
- **Fonte a escrever.** "Tabela 2.1 da aula (Alexandria, M01 · Aula 02). Níveis de tensão
  conforme a aula; procedência não declarada."
- **Estado.** Pronto (valores da aula).

### D-A02-2 · Cadeia de unidades (diagrama)

- **O que mostra.** O texto de apoio da fórmula 2.3 (L1517): "V × A → W → kW → kWh × tarifa = custo".
- **Forma.** Fluxograma horizontal de cinco caixas com a operação entre elas (÷ 1.000; × horas;
  × tarifa). Sem número.
- **Estado.** Pronto. Sem dado, logo sem eixo; a regra 3 pede só rótulo e unidade em cada caixa.

---

## Aula 03 — Corrente alternada e frequência

A fonte tem **uma figura** (`m01-a03-fig-01`, L1599–1619, extração `figuras[0]`): duas células,
"Direct Current" e "Alternating Current — 60 Hz", em SVG, **sem título, sem escala, sem unidade,
sem fonte citada** e com h5 em inglês.

### D-A03-1 · DC × AC (diagrama — substitui a figura-fonte)

- **O que mostra.** Painel 1: tensão constante (DC). Painel 2: senoide de 60 Hz (AC). A figura-fonte
  desenha 8 semiondas (4 ciclos) no quadro de 300 unidades (extração, "Medido do desenho").
- **Eixos e unidade.** x: tempo, **ms**. A fonte diz "60 vezes por segundo — 60 Hz" (L1596), logo o
  período é 1/60 s ≈ **16,7 ms**; 4 ciclos ≈ 66,7 ms. Esse cálculo é derivado da frequência da
  aula, não um dado novo. y: tensão, **unidade relativa** (a fonte não dá amplitude; **não
  escrever 127 V ou 220 V** na figura — a aula não liga a figura a uma tensão).
- **Rótulos.** Em português: "Corrente contínua (DC)" e "Corrente alternada (AC) — 60 Hz". Os
  rótulos de uso da fonte ("baterias, solar pré-inversor, eletrônica" e "padrão da rede pública
  brasileira") entram como legenda de cada painel.
- **Fonte a escrever.** "Figura-fonte do M01 · Aula 03 (refeita com eixos); frequência da rede
  brasileira conforme a aula."
- **Estado.** Pronto.
- **Foto de acompanhamento (real).** `m01v3-a03-osciloscopio-senoide` mostra uma senoide de
  **10 kHz** num osciloscópio Tektronix 7613 — **não é a rede**. A legenda precisa dizer
  "sinal senoidal de 10 kHz; a rede brasileira oscila a 60 Hz". Não usar a foto como se fosse a figura do texto.

### D-A03-2 · Geração ≈ consumo → frequência (diagrama conceitual)

- **O que mostra.** A regra da fórmula 3.4 (L1631: "Geração ≈ Consumo, em tempo real"; "Desequilíbrio se
  manifesta como desvio de frequência") e o parágrafo L1636: consumo sobe e geração não acompanha →
  frequência cai; geração supera consumo → frequência sobe.
- **Forma.** Balança de dois pratos (geração × consumo) com a seta de frequência; três estados:
  equilíbrio, consumo > geração (frequência ↓), geração > consumo (frequência ↑).
- **Eixos e unidade.** Sem eixo numérico: **a fonte não dá faixa de frequência nem valor de
  desvio**. Não escrever "59,9 Hz" nem "± 0,5 Hz". O único número da aula é 60 Hz.
- **Fonte a escrever.** "M01 · Aula 03, seção 3.4."
- **Estado.** Pronto como diagrama conceitual. Uma **curva de frequência no tempo** espera dado
  (o ONS publica; a extração não tem).

---

## Aula 04 — Tensão, corrente e perdas

A fonte não tem figura (extração A04: "Figuras 0"). O instrumento INST·03 faz o papel de gráfico.

### D-A04-1 · Perdas I²R (diagrama)

- **O que mostra.** P = I² × R (fórmula L1661) com **R = 0,5 Ω** (padrão do INST·03) e corrente de
  0 a 500 A (faixa do deslizador: 10–500 A). Três pontos marcados, todos da execução do script
  original: **100 A → 5.000 W**, **200 A → 20.000 W** (dobra a corrente, quadruplica a perda),
  **300 A → 45.000 W** (triplica, ×9) — o texto da aula diz exatamente isso (L1666).
- **Eixos e unidade.** x: corrente, **A**; y: perda dissipada, **W**. Curva contínua + os três pontos.
- **Cuidado.** A marcação da fonte traz "5,000" e o script escreve "5.000" (DIV-01 da A04); usar
  "5.000 W". O INST·03 tem "Fonte dos números: null" — rotular "cenário didático (R = 0,5 Ω)".
- **Fonte a escrever.** "INST·03, M01 · Aula 04 (cenário didático, R = 0,5 Ω)."
- **Estado.** Pronto.

### D-A04-2 · Mesma potência com mais tensão (diagrama)

- **O que mostra.** A escolha do parágrafo L1698: P = V × I constante; se a tensão é ×k, a corrente é ÷k
  e as perdas (∝ I²) caem a 1/k².
- **Forma.** Barras de **perda relativa** (índice 100 = tensão-base) para ×1, ×2, ×4: 100 · 25 · 6,25.
- **Aviso.** O número 25 e o 6,25 **não estão na fonte**: são a aplicação das duas fórmulas da
  aula (P = V × I, L1698; P = I² × R, L1661). Rotular "derivado das fórmulas da aula". O texto
  cita 230 / 345 / 500 / 750 kV (L1700) mas **não** dá um par baixa × alta tensão com números;
  **não** montar o exemplo com 13,8 kV × 500 kV.
- **Eixos e unidade.** x: fator de tensão (×1, ×2, ×4); y: perda relativa (% da perda com ×1).
- **Estado.** Pronto, com o rótulo de derivação.

---

## Aula 05 — Demanda e fator de carga

A fonte não tem figura. Tem três tabelas, duas fórmulas e o INST·04.

### D-A05-1 · Capacidade que se paga × média que se usa (diagrama)

- **O que mostra.** Cenário-padrão do INST·04: **144.000 kWh em 720 h** com **demanda máxima 800 kW**
  → demanda média **200 kW** → fator de carga **0,25 (25%)** (extração A05: "Cenário-padrão").
- **Forma.** Duas barras: demanda máxima (800 kW) e demanda média (200 kW); a razão 0,25 escrita
  entre elas. Fórmulas da fonte nos rótulos: "Demanda média = kWh ÷ horas" (L1763) e
  "Fator de carga = Demanda média ÷ Demanda máxima" (L1769).
- **Eixos e unidade.** y: demanda, **kW**.
- **Cuidado (DIV-04 da A08).** "FC" designa fator de **carga** aqui e fator de **capacidade** na A08:
  na figura, escrever **"Fator de carga"** por extenso, nunca só "FC".
- **Fonte a escrever.** "INST·04, M01 · Aula 05 (cenário didático)."
- **Estado.** Pronto.

### D-A05-2 · Curva de carga no tempo (diagrama)

- **O que mostraria.** O perfil de demanda ao longo de um dia ou mês (a analogia da fábrica de turno
  de quatro horas, L1737, pede exatamente isto).
- **Por que não está pronto.** **A extração não tem série temporal alguma.** O § Caso (L2179), onde
  poderia haver dados de uma operação, está marcado "Não extraído" na extração do aparato. Qualquer
  curva desenhada seria inventada.
- **Estado.** **Espera dado** — ou uma curva de fatura real/anonimizada fornecida pelo Founder, ou a
  extração do § Caso. Enquanto isso, D-A05-1 cobre a ideia sem inventar curva.

### D-A05-3 · Faixas de fator de carga (diagrama)

- **O que mostra.** Tabela L1811–1816: 0,70–0,90 (operação contínua, carga estável 24/7);
  0,40–0,70 (turnos, sazonalidade moderada); 0,15–0,40 (picos altos, operação concentrada);
  < 0,15 (padrão raro, possível erro de medição ou contratação superdimensionada); com a
  implicação de cada uma.
- **Forma.** Régua horizontal 0 a 1 com as quatro faixas; marcador do cenário-padrão em **0,25**.
- **Eixos e unidade.** x: fator de carga, **adimensional (0 a 1)**.
- **Lacunas da fonte.** A fonte **não diz nada acima de 0,90** e escreve as bordas 0,70 e 0,40 e 0,15
  nas duas faixas vizinhas. Desenhar a régua como a tabela diz, **sem preencher 0,90–1,00**
  ("sem faixa na tabela"). Não usar as cores como semáforo.
- **Fonte a escrever.** "Tabela de leitura do fator de carga, M01 · Aula 05."
- **Estado.** Pronto com as duas lacunas declaradas.

---

## Aula 06 — Estrutura tarifária por tensão

A fonte não tem figura. Três tabelas (grupos, subgrupos, fases).

### D-A06-1 · Grupos e subgrupos por tensão (diagrama)

- **O que mostra.** Tabela de grupos (L1843): Grupo B < 2,3 kV; Grupo A ≥ 2,3 kV. Tabela de subgrupos
  (L1856): A1 ≥ 230 kV · A2 88 a 138 kV · A3 69 kV · A3a 30 a 44 kV · A4 2,3 a 25 kV · AS < 2,3 kV
  (subterrâneo).
- **Forma.** Faixas horizontais sobre eixo logarítmico de tensão, mesma escala de D-A02-1 (para que
  as duas figuras se leiam juntas).
- **Eixos e unidade.** x: tensão, **kV** (0,1 a 1.000, escala log).
- **Lacunas da fonte.** A tabela deixa de fora **25–30 kV, 44–69 kV e 138–230 kV**; AS (< 2,3 kV)
  **sobrepõe** o Grupo B por construção. Desenhar as faixas como escritas; as lacunas ficam
  vazias com o rótulo "sem subgrupo na tabela da aula"; AS em linha tracejada (mesmo intervalo de B).
  Não escolher os limites reais de norma (isso seria dado de fora da extração).
- **Fonte a escrever.** "Tabelas 6.1 e 6.2 da aula (Alexandria, M01 · Aula 06); subgrupos conforme a aula."
- **Estado.** Pronto, com as lacunas visíveis.

### D-A06-2 · Mono, bi e trifásico (diagrama)

- **O que mostraria.** A organização das fases (tabela L1884: monofásico ≤ ~10 kW; bifásico, limites
  regionais; trifásico padrão acima de ~15 kW).
- **Por que não está pronto.** A figura natural é de **três senoides defasadas**. **A defasagem
  (120°) não está em nenhuma linha da extração do M01** — a aula só diz "fases são a forma de
  organizar a entrega" (L1880).
- **Estado.** **Espera decisão do Founder:** ou o texto da aula ganha a defasagem (conteúdo novo, fora
  da regra de só-extração), ou a figura vira só tabela. Não desenhar enquanto isso.

---

## Aula 07 — Fator de potência

A fonte tem **uma figura** (`m01-a07-fig-01`, `div.triangle-vis`, L1917–1948): triângulo em SVG
dinâmico com os rótulos kW (ciano), kVAr (ouro), kVA e o ângulo φ, **sem título e sem fonte citada**,
seguido do INST·05 (controles de kW e kVAr).

### D-A07-1 · Triângulo de potência (diagrama comum)

- **O que mostra.** Triângulo retângulo: cateto horizontal = potência ativa (**kW**), cateto vertical =
  reativa (**kVAr**), hipotenusa = aparente (**kVA**), ângulo **φ** entre kW e kVA. Valores do
  estado inicial do instrumento (L1942–1944): **800 kW, 480 kVAr, 933 kVA, FP 0,86**.
- **Escala.** Desenhado **em escala** (catetos 800 : 480), com a mesma unidade nos dois eixos,
  rotulados em kW e kVAr; ângulo φ calculado dos catetos (tan φ = kVAr ÷ kW), não digitado.
- **Fórmula embaixo.** "FP = kW ÷ kVA = cos φ" (L1976).
- **Cuidado.** Não usar semáforo nas cores; manter ciano/ouro só como identidade de cateto, se o
  sistema NIVAR/Alexandria as autorizar — é decisão de design, não de conteúdo.
- **Fonte a escrever.** "M01 · Aula 07, 7.2 e INST·05 (cenário didático: 800 kW, 480 kVAr)."
- **Estado.** Pronto. É o mesmo diagrama pedido pela A02 (L1578).

### D-A07-2 · Corrente em fase × atrasada (diagrama)

- **O que mostra.** O texto 7.1 (L1908–1910): carga resistiva → corrente em fase com a tensão;
  carga indutiva → corrente "atrasada". Dois painéis com tensão e corrente senoidais.
- **Eixos e unidade.** x: tempo, **ms**, período de 16,7 ms (60 Hz, L1596 da A03); y: tensão e corrente
  em unidade relativa. Atraso do painel indutivo: φ ≈ **31°** (≈ 1,4 ms), **derivado** do cenário do
  triângulo (arctan 480/800). A fonte **não dá ângulo de atraso** — rotular "ilustrativo, φ do
  cenário 800 kW / 480 kVAr".
- **Fonte a escrever.** "Conceito: M01 · Aula 07, 7.1. Ângulo: derivado do cenário didático do INST·05."
- **Estado.** Pronto.

### D-A07-3 · Referência 0,92 e leitura do FP (diagrama)

- **O que mostra.** Régua de FP: 0,92 como mínimo de referência do Grupo A, indutivo e capacitivo
  (L1986); FP 1,00 e FP 0,85 como exemplos da aula (L1981).
- **Por que não está pronto.** O texto de L1981 diz que FP 0,85 significa que **85%** da aparente vira
  trabalho "e os outros 15% são reativos". Isso **não é aritmética de potência**: com FP = 0,85,
  kVAr ÷ kVA = √(1 − 0,85²) ≈ **0,53**, não 0,15 (o triângulo de D-A07-1 mostra o mesmo: 480 ÷ 933
  ≈ 0,51). Uma barra empilhada 85% + 15% **reproduziria** o deslize; uma barra correta
  **contradiria** o texto.
- **Estado.** **Espera decisão do Founder** (corrigir a frase da aula, ou manter e não desenhar a
  barra). A régua simples 0,92 / 1,00 sem barra empilhada pode ser feita já, sem risco.

---

## Aula 08 — Fator de capacidade

A fonte tem **uma figura** (`m01-a08-fig-01`, `div.cf-chart`, L2059–2085): 7 barras horizontais, em CSS,
**sem título, sem eixo, sem unidade declarada e sem fonte citada**.

### D-A08-1 · Capacidade × geração no exemplo (diagrama)

- **O que mostra.** L2023: usina de **100 MW**, geração máxima teórica em um ano **100 × 8.760 =
  876.000 MWh**; geração efetiva **220.000 MWh** → FC **25,1%**. Fórmula L2019.
- **Forma.** Duas barras (876.000 e 220.000 MWh); a fração 25,1% escrita entre elas.
- **Eixos e unidade.** y: energia anual, **MWh**.
- **Cuidado.** O INST·06 é "cenário didático" (P19); rotular assim. Escrever "fator de capacidade"
  por extenso (DIV-04).
- **Fonte a escrever.** "M01 · Aula 08, 8.2 (cenário didático: 100 MW, 220.000 MWh, 8.760 h)."
- **Estado.** Pronto.

### D-A08-2 · FCs típicos por fonte (diagrama) — **espera decisão do Founder (QA-FCap-01)**

- **Forma proposta.** Barras flutuantes (do mínimo ao máximo) numa linha por fonte, eixo x de 0 a
  100%, **unidade %** (a unidade da fonte é inferida do rótulo "~85–95%"; não há eixo declarado).
- **Os números estão em conflito dentro da própria fonte.** Não escolhi nenhum. As três leituras:

  | Fonte | Figura `cf-chart` (L2061–2085) | Script do INST·06 (L2952–2957) | § Léxico (L2577) |
  |---|---|---|---|
  | Nuclear | ~85–95% | ≥ 0,85 → "nuclear ou carvão base load" | 85–95% |
  | Carvão (base load) | ~55–75% | aparece no ramo ≥ 0,85 | — |
  | Gás CCGT | ~40–60% | só entra em ≥ 0,55 | — |
  | Hidrelétrica BR (média) | ~45–55% | ramo ≥ 0,40 | ~50% |
  | Eólica NE | ~40–55% | ramo ≥ 0,40 e ≥ 0,25 | — |
  | Solar FV BR | ~20–28% | corte em 0,25 | ~25% (ponto) |
  | Térmica a óleo (peaker) | ~5–15% | — | < 15% |

  Também em conflito: faixa × ponto (DIV-03), e o gabarito do Ex06 usa "abaixo de 15%".
- **O que falta para desenhar.** Decisão sobre qual leitura vale (ou verificação autoritativa,
  P20) — **o Founder decide**, não eu. Visão 06 da rodada 01 já está sinalizada na regra de imagem.
- **Fonte a escrever (quando decidido).** Instituição que sustenta o número escolhido; hoje, nenhuma.
- **Estado.** **Espera decisão do Founder.**

### D-A08-3 · Capacidade instalada × geração efetiva da matriz (diagrama)

- **O que mostraria.** O destaque L2090: "60% hidro" é participação por **capacidade**; em geração
  efetiva flutua com chuvas, despacho térmico e reservatórios.
- **Por que não está pronto.** A extração tem o "60%" e o "FC hidro ~50%", mas **nenhuma série** de
  geração por fonte. Fontes de verdade do projeto para isso: ONS, EPE (e Our World in Data para
  panorama) — **fora desta extração**, e a regra deste trabalho é "dado só da extração".
- **Estado.** **Espera dado** (ONS/EPE, com ano e fonte citados).

---

## Aula 09 — Qualidade de energia

A fonte não tem figura. Três tabelas e um destaque (janela de medição).

### D-A09-1 · Janela de medição de tensão (diagrama)

- **O que mostra.** L2152: medição em intervalos de **10 minutos** por pelo menos **sete dias
  consecutivos**, **1.008 leituras** (conferência: 7 × 24 × 6 = 1.008); sobre essa amostra
  calculam-se DRP e DRC.
- **Forma.** Linha do tempo de 7 dias, um tique por leitura (1.008), com o intervalo de 10 min
  ampliado num quadro lateral.
- **Eixos e unidade.** x: tempo, **dias** (0 a 7); tique = 10 min.
- **Não está na fonte.** Valores de tensão, faixas adequada/precária/crítica em volts, fórmula de
  DRP/DRC. **Não desenhar curva de tensão nem limites.**
- **Fonte a escrever.** "M01 · Aula 09 (janela de medição conforme a aula)."
- **Estado.** Pronto.

### D-A09-2 · Fenômenos de tensão em forma de onda (diagrama)

- **O que mostraria.** Tabela L2140: harmônicos (distorção da forma de onda), afundamento (queda
  rápida e temporária), sobretensão (elevação acima dos limites), desequilíbrio entre fases,
  flicker (variações rápidas e visíveis).
- **Por que não está pronto.** Uma forma de onda exige uma **magnitude** (quanto afunda, por
  quantos ciclos, que ordem harmônica). **A extração não dá nenhum desses números.**
- **Estado.** **Espera decisão do Founder:** aceitar formas "ilustrativas" com eixos em unidade
  relativa (p.u.) e a etiqueta "ilustrativo, sem escala de norma", ou fornecer os números. Não
  chamar de "seguindo o PRODIST" sem número.

---

## Geradas já usadas pelas aulas — reavaliação (regra 2)

Só `m01-a08-02` e `m01-a08-04` têm arquivo neste repositório (`public/alexandria/v2/aulas/`); as
outras quatro eu avalio **pela nota de curadoria de `media-provenance.md`**, sem ter visto o
pixel — marcado abaixo. Critério: (1) a coisa existe e dá para fotografar? → deveria ser real;
(2) só dá para gerar → precisa ser realista, sem estilo de gravura, com classe na legenda.

| Id | O que é | Veredito | Substituta proposta |
|---|---|---|---|
| `m01-a08-02` (**visto**) | Painéis solares e usina térmica com torre, dia × noite, em **gravura** | **Trocar por real.** Mostra coisas que existem (usina solar e usina térmica) em estilo de gravura — viola a regra 1 e a 2 ao mesmo tempo. A térmica da imagem tem uma torre de resfriamento e uma chaminé de fantasia | Par de fotos reais: `m01v3-a08-solar-pirapora` + `m01v3-a04-candiota` (UTE Candiota III com torre de transmissão; combustível a confirmar antes de legendar). O "solar não gera à noite" vira diagrama de curva diária **quando houver dado** (espera dado); sem dado, fica no texto |
| `m01-a01-01` (nota) | Corte de barragem → tomada d'água → conduto → caixa espiral → rotor → gerador | **Fica como gerada realista**, mas com o par real à frente. Corte interno não se fotografa. A nota diz "rotor estilizado, não é um corte fiel de rotor Francis" — a regra 2 pede proporção e material corretos | Foto real do que existe: `m01v3-a01-itaipu`. Regerar o corte só se o rotor puder ficar fiel; senão rotular "ilustração gerada · esquemático" e não rotular pás |
| `m01-a01-02` (nota) | Duas torneiras, caixas d'água e ampulhetas (potência × energia) | **Fica** como gerada realista, **uma só** analogia. Já corrigida (r2) | — (baixa prioridade). Cuidado com DIV-01 da A01: a imagem não carrega vazão × corrente |
| `m01-a04-01` (nota) | Cadeia de tensão usina → elevadora → torres → rebaixadora → siderúrgica → poste → casa | **Fica** como gerada realista/esquemática — é um mapa de cadeia, não uma coisa que se fotografa inteira. A nota admite "escala e fiação esquemáticas" | Fotos reais dos **elos**: `m01v3-a04-candiota` (usina + linha), `m01v3-a02-torres-itaipu` (alta tensão), `m01v3-a02-subestacao-cpfl` (subestação), `m01v3-a06-transformador-poste` (poste). Em estilo de gravura ela deixa de servir; confirmar o estilo do pixel |
| `m01-a05-01` (nota) | Estrada com carroças puxadas por cavalos (analogia do pico) | **Trocar.** Cavalos e carroças para "uma fábrica a um centro logístico" é anacronismo; a analogia da aula é de estrada de **caminhões**. A rejeição de r1 (cavalos atrás das carroças) mostra que o gerador tropeça nisso | **Não achei foto real adequada** (as fotos de caminhões na BR-116 são de protesto/bloqueio, não de fluxo normal). Proposta: regerar realista (estrada, caminhões, pico × vazio) com classe declarada — **ou** substituir pela D-A05-1 |
| `m01-a07-01` (nota) | Barqueiro puxando barco pela sirga, canal e caminho paralelos (analogia do reativo) | **Fica**, mas ver se vira real: a prática de **sirga** existe e há fotografias históricas de barcaça puxada por animal em canal (domínio público no Commons); a analogia fica mais honesta com foto real. A nota exige que os vetores SVG sigam o ângulo medido na imagem | Procurar foto PD de barcaça em sirga (**não busquei nesta rodada**, ver "O que não achei"). Se não houver, manter a gerada, realista, "ilustração gerada · analogia" |

`m01-a08-04` (Sobradinho, Agência Brasil) e `m01-a07-02` (banco de capacitores 150 kV) já são
fotos reais com licença — **mantidas**.

---

## O que precisa de decisão do Founder

1. **QA-FCap-01** (D-A08-2): qual leitura das faixas de fator de capacidade vale.
2. **D-A07-3**: a frase "os outros 15% são reativos" (L1981) não bate com a conta (≈ 53%). Corrigir o
   texto, ou manter e não desenhar a barra.
3. **D-A06-2**: a figura de três fases exige a defasagem de 120°, que a aula não diz.
4. **D-A09-2**: aceitar formas de onda "ilustrativas" em p.u., ou dar os números.
5. **D-A05-2 e D-A08-3**: dado de curva de carga (fatura/§ Caso) e de matriz (ONS/EPE) — o Founder
   fornece, ou autoriza a extração de dado de fonte primária para estas duas figuras.
6. Fotos com **ressalva de geografia** (legenda não pode dizer "no Brasil"): medidor de kWh alemão
   (50 Hz, 3 × 220/380 V), transformador de poste australiano, ligação clandestina de Cape Town,
   apagão de Madrid. Aceitar assim, ou procurar equivalente brasileiro.

## O que não encontrei com licença aberta

- **Estrada com tráfego normal de caminhões** (A05, 5.1): só vieram fotos de bloqueio/protesto.
- **Transformador de poste e medidor no Brasil**: o Commons tem pouco, e o que há não é limpo/legível.
- **Rede subterrânea (subgrupo AS, A06)**: nada utilizável.
- **Medidor de qualidade de energia e forma de onda com harmônicos** (A09): nada utilizável; vira D-A09-2.
- **Barcaça em sirga** (A07): **não busquei** — fica como pendência, não como "não existe".
- **Apagão no Brasil** (A09): a busca por "apagão" trouxe Madrid, Kiev, Cuba; os brasileiros que vieram
  eram imagem escura sem informação.

---

# Rodada 2 — diagramas em código, contrato `figuras.ts` e o que sai das aulas

## O que foi construído

- **Diagramas** (SVG gerado por código, `src/components/alexandria/v3/diagramas/`, registro em `index.ts`):
  15 dos 21 especificados acima. Eixo, rótulo, unidade na caixa certa (kW, kWh, MWh, h, ms — nada em caixa alta),
  escala declarada e a linha "Fonte: Módulo 01, Aula NN, seção X" dentro da própria figura. Cores só pelos tokens da v3
  (`--tinta`, `--tinta-suave`, `--tinta-fraca`, `--fio`, `--fio-forte`; `--oxido` só no destaque), então valem nos dois
  modos; sem hachura, gradiente, sombra nem raio.
- **Contrato** `src/lib/alexandria/figuras.ts`: `FIGURAS` (dado), `figurasDaAula(moduloId, aula)` (forma pronta que a
  casca `v3/aula/contratos.ts` lê sem adaptação), `srcDaFigura`, `srcSetDaFigura`. Âncora por trecho literal, conferido
  contra o texto da extração (cada trecho aparece primeiro no bloco pretendido).
- **Foto do forno**: o arquivo de origem (Library of Congress, 1.024 px) trazia a borda do filme. Recortei: virou
  `m01v3-a07-forno-eletrico-918.webp` (918×714); os derivados `-1000` e `-1024` foram removidos. A linha de procedência
  continua valendo (mesmo original); só acrescentar "recortada a borda do filme".

| Id do diagrama | Componente | Aula · seção |
|---|---|---|
| D-A01-1 | `EscalaDePotencia` | 1 · 1.3 |
| D-A01-2 | `EnergiaPotenciaTempo` | 1 · 1.4 |
| D-A02-1 | `EscadaDeTensoes` | 2 · 2.1 |
| D-A02-2 | `CadeiaDeUnidades` | 2 · 2.3 |
| D-A03-1 | `CorrenteDcAc` | 3 · 3.2 |
| D-A03-2 | `GeracaoConsumoFrequencia` | 3 · 3.4 |
| D-A04-1 | `PerdasI2R` | 4 · 4.1 |
| D-A04-2 | `MesmaPotenciaMaisTensao` | 4 · 4.2 |
| D-A05-1 | `DemandaMaximaMedia` | 5 · 5.3 |
| D-A05-3 | `FaixasFatorDeCarga` | 5 · 5.4 |
| D-A06-1 | `SubgruposPorTensao` | 6 · 6.1 e 6.2 |
| D-A07-1 | `TrianguloDePotencia` | 7 · 7.2 |
| D-A07-2 | `FaseCorrente` | 7 · 7.1 |
| D-A08-1 | `CapacidadeGeracaoExemplo` | 8 · 8.2 |
| D-A09-1 | `JanelaDeMedicao` | 9 · 9.3 |

Detalhes que o código fixou e a especificação deixava aberto: `EscadaDeTensoes` e `SubgruposPorTensao` usam a mesma
escala logarítmica (4 décadas); `TrianguloDePotencia` calcula 933 kVA, φ ≈ 31° e FP 0,86 dos catetos 800 e 480
(não digitados) e aceita `kW`/`kVAr` por prop; `FaseCorrente` usa o mesmo φ do triângulo; `JanelaDeMedicao` calcula
7 × 24 × 6 = 1.008 no código.

## O que NÃO foi publicado, e por quê

| Id | Motivo | Quem destrava |
|---|---|---|
| D-A08-2 FCs típicos por fonte | QA-FCap-01: as faixas conflitam na própria fonte; sem número até haver decisão | Founder |
| D-A07-3 referência 0,92 / leitura do FP | a frase "os outros 15% são reativos" (L1981) não bate com a conta | Founder (corrigir o texto ou não desenhar) |
| D-A06-2 mono / bi / trifásico | exige a defasagem de 120°, que a aula não diz | Founder (conteúdo novo) |
| D-A09-2 formas de onda dos fenômenos | exige magnitude (quanto afunda, quantos ciclos) que a extração não dá | Founder |
| D-A05-2 curva de carga no tempo | a extração não tem série temporal | dado (fatura ou § Caso) |
| D-A08-3 capacidade × geração da matriz | a extração não tem série por fonte | dado (ONS/EPE) |

## O que deve SAIR das aulas do M01

O modelo novo de aula só mostra o que está em `figuras.ts`; o que não estiver lá some sozinho. Esta lista diz o que
**precisa** sair e por quê, para a sessão do modelo não religar nada por engano. (Só `m01-a08-02` e `m01-a08-04` têm
arquivo neste repositório, em `public/alexandria/v2/aulas/`; o veredito dos outros vem da nota de curadoria em
`media-provenance.md`, **sem ter visto o pixel**.)

| Imagem | Aula (colocação) | Classe hoje | Veredito | Por quê |
|---|---|---|---|---|
| `m01-a08-02` (solar e térmica, dia e noite) | A08 bloco 2, via `AulaM01A08.tsx` | gerada, **em gravura** (visto) | **SAI** | mostra coisas que existem (usina solar e térmica) em estilo de gravura: viola as regras 1 e 2; a torre e a chaminé são de fantasia. Substituída pelas 6 fotos reais da A08 |
| `m01-a05-01` (estrada com carroças e cavalos) | A05 bloco 1 | gerada | **SAI** | carroças para "fábrica → centro logístico" é anacronismo; o gerador já errou o sentido dos cavalos na r1. Sem substituta real achada; a A05 fica com os dois diagramas. Se o Founder quiser a imagem, regerar **realista** (caminhões) com classe declarada |
| `m01-a04-01` (cadeia de tensão, usina → casa) | A04 bloco 5 **e** A06 bloco 8 (reuso) | gerada, esquemática | **SAI das duas** | as fotos reais cobrem os elos (usina e linha, torres de alta tensão, subestação, transformador de poste) e o diagrama de perdas cobre o argumento; na A06 o reuso não ensina nada novo. Se quiserem a cadeia inteira, regerar realista e confirmar o estilo no pixel |
| `m01-a01-01` (corte de barragem → turbina → gerador) | A01 bloco 4 | gerada, rotor "estilizado, não é um corte fiel" | **SAI** | a A01 não desenvolve a conversão hidráulica; a nota de curadoria admite rotor não fiel; Itaipu real cobre o "o que existe". Voltar só se regerada fiel |
| `m01-a01-02` (torneiras, caixas, ampulhetas) | A01 bloco 9 | gerada | **FICA, condicional** | a analogia da torneira é do texto (tabela 1.2) e a imagem carrega só potência × energia. Condição: confirmar no pixel que **não** está em gravura; se estiver, sai |
| `m01-a07-01` (rebocador na sirga) | A07 bloco 5 | gerada | **FICA, condicional** | analogia "camada Alexandria", com limite a declarar (o reativo oscila, não é força lateral constante). Condição: não estar em gravura, e a legenda declarar o limite. Se houver foto PD de sirga, trocar |

Gravuras **estéticas** (capas de trilha, abertura, `public/alexandria/gravuras/*`, medalhas): não entram em aula
nenhuma do M01 nesta lista, e **não devem** entrar — não ensinam. O que já é foto real e **fica**: `m01-a08-04`
(Sobradinho), `m01-a07-02` (banco de capacitores), `m01-a03-02` (frequencímetro), `m01-a03-01` (anel de Faraday),
`m01-a02-01` (pilha de Volta) — todos incluídos em `figuras.ts`.

## Derivados v3 das fotos documentais que já estavam registradas

As cinco fotos reais que o M01 já tinha (`media-provenance.md`, linhas `m01-a02-01`, `m01-a03-01`, `m01-a03-02`,
`m01-a07-02`, `m01-a08-04`) **não tinham arquivo neste repositório**, exceto Sobradinho. Para não sumirem das aulas
quando o modelo novo passar a ler só `figuras.ts`, baixei de novo os quatro originais do Commons (SHA-1 conferido
contra a API; os de `m01-a03-02` e `m01-a07-02` batem com o SHA-1 já registrado) e derivei em
`public/alexandria/v3/aulas/m01/`. Sobradinho segue em `public/alexandria/v2/aulas/` (560 e 1000 px).

| asset_id v3 | Registro antigo | Licença | SHA-1 do original | Original |
|---|---|---|---|---|
| `m01v3-a02-pilha-volta` | `m01-a02-01` | CC BY 4.0 (Wellcome Collection) | `02e951216c210925fe74b83e487d085e3eea7778` | 2887×3632 |
| `m01v3-a03-anel-faraday` | `m01-a03-01` | domínio público | `3385cbc6f409481bc2f00d4f4c0e722aa5ce66f9` | 1484×1568 |
| `m01v3-a03-frequencimetro` | `m01-a03-02` | CC BY-SA 4.0 (Mister rf) | `7473555d9bd5c00d988067bd7a97d58ce8690416` | 3350×4270 |
| `m01v3-a07-banco-capacitores` | `m01-a07-02` | domínio público (Philippe Mertens) | `f40eca3d26527cb9d103c8448b33311c75fb83dd` | 926×1382 (sem ampliação) |

**Divergência a conferir (não resolvi):** a linha antiga de `m01-a03-01` atribui o anel de Faraday a "Ilustração em
F. Uppenborn (1889)"; a página atual do arquivo no Commons diz "autor desconhecido" e data **1896**. A legenda em
`figuras.ts` segue a página ("ilustração, 1896 · autor desconhecido"); se a atribuição a Uppenborn tiver fonte,
trocar no crédito.

---

# Rodada 3 — os quatro diagramas liberados pelas decisões de 15/11/2026

Registro completo das mudanças de texto e de instrumento em [`m01-decisoes.md`](m01-decisoes.md).

| Id | Componente | Âncora (bloco da extração · trecho) | O que destravou |
|---|---|---|---|
| D-A06-2 | `SistemasDeFases` | `m01-a06-b15-tabela` · "Padrão acima de ~15 kW" | Os 120° **estão** na extração: verbete "Trifásico" do § Lex (L2661), "três fases defasadas em 120°". A nota desta especificação que dizia o contrário estava errada. A régua de kW usa só os limites da tabela 6.4; o bifásico fica sem barra ("limites regionais variam") |
| D-A07-3 | `ReferenciaFatorDePotencia` | `m01-a07-b15-paragrafo` · "fator de potência mínimo de referência de 0,92" | Decisão 2: a frase dos 15% saiu de 7.3. A figura tem a régua 0,85 / 0,92 / 1,00 e o triângulo do FP 0,85 com a aparente = 100%: ativa 85%, reativa ≈ 53% (calculado, sen(arccos 0,85)) |
| D-A08-2 | `FatoresDeCapacidadeTipicos` | `m01-a08-b11-figura` · "Térmica a óleo (peaker) ~5–15%" | Decisão 3: a figura `cf-chart` governa. Sete barras flutuantes com as faixas verbatim; o script do INST·06 perdeu os vereditos e o § Lex não entra |
| D-A09-2 | `FenomenosDeTensao` | `m01-a09-b09-tabela` · "Comum em cargas como fornos" | Publicado como **ilustrativo, sem escala de norma**: nenhum eixo tem número, porque a fonte não dá magnitude. Nome e descrição de cada fenômeno são os da tabela 9.3 |

**Véu.** Nenhum dos quatro desenha cenário de instrumento (A06 e A09 não têm instrumento; D-A07-3 não desenha o
800 kW / 480 kVAr do INST·05; D-A08-2 não marca o 25,1% do INST·06), então nenhum entra em `velarFiguras`. O
comentário de cabeçalho de `previsoes.ts` registra isso.

**D-A06-1** mudou junto: a linha do Grupo A diz "em regra, ≥ 2,3 kV" e a nota diz que o AS é a exceção.

Seguem fora: **D-A05-2** (curva de carga) e **D-A08-3** (matriz por capacidade × geração), que esperam dado.

## O que precisa de decisão do Founder — situação em 15/11/2026

Os itens 1 a 4 da lista acima foram decididos (delegação de 15/11) e estão publicados. O item 5 continua esperando
dado. O item 6 (fotos com ressalva de geografia) foi resolvido pela revisão factual: as legendas dizem o país
quando a foto não é do Brasil, e nenhuma afirma "no Brasil" (ver `media-provenance.md`, revisão de 15/11).

A **divergência do anel de Faraday** está fechada do lado da legenda: a página do Commons dá autor desconhecido e
cita como origem F. Bedell, *The Principles of the Transformer* (Macmillan, Nova York, 1896), p. 288, fig. 162. A
legenda segue o Commons ("ilustração, 1896 · autor desconhecido"). A linha antiga que atribui a F. Uppenborn (1889)
fica registrada como divergência em `media-provenance.md`, sem fonte que a sustente.
