# Catálogo de instrumento — Alexandria

Auditoria de fechamento: FOUNDRY, wave de catálogo (pós-Módulo 07). Não é
extração nova — é consolidação. Sete módulos já extraídos (LYCEUM, Waves
4/18/19/24/25/29/30) encontraram catorze nomes de instrumento fora dos 9
membros de `InstrumentKind`, cada um mapeado por mecânica real e documentado
em prosa espalhada por sete seções diferentes do `CLAUDE.md`. Este arquivo é
o lugar único para consultar essa decisão antes de extrair o Módulo 8 em
diante, em vez de reler sete seções de histórico.

## Como decidir o `kind` de um instrumento novo

1. **Nome não decide — mecânica decide.** O prefixo do título na fonte
   ("Mapa", "Termômetro", "Comparador"...) é o rótulo que o aluno lê, não o
   contrato interno. Dois instrumentos com o mesmo prefixo já apareceram com
   mecânicas diferentes — ver "Termômetro" e "Mapa" abaixo.
2. **Nome repetido de módulo anterior não garante mesma mecânica — sempre
   confirma de novo.** A suposição errada ("já vi esse nome, mapeio igual")
   já teria produzido dois `kind` errados neste currículo, se alguém tivesse
   confiado no nome sozinho.
3. **Se a mecânica genuinamente não couber em nenhum `kind` existente, é
   decisão de generalização de tipo — não mapeamento forçado.** Até o
   fechamento desta auditoria (Módulos 01-07), isso nunca aconteceu: todo
   instrumento com nome fora do enum tinha uma mecânica que já existia sob
   outro nome. Se acontecer, generaliza por superconjunto documentado (mesma
   disciplina da FOUNDRY Wave 2) e registra a mudança real no relatório de
   fechamento da wave — não faz isso silenciosamente dentro da mesma fase de
   extração.
4. **Forma idêntica não implica `kind` idêntico.** `comparador` e
   `explorador` podem ter exatamente a mesma forma de campo (um `select` só,
   zero saídas numéricas — ver "Comparador de instrumentos jurídicos" no
   Módulo 07, mecanicamente indistinguível dos seis `explorador` do mesmo
   módulo). A diferença é semântica — o instrumento põe duas ou mais
   alternativas lado a lado para comparação (`comparador`) ou revela um fato
   sobre uma seleção única (`explorador`) — não estrutural. Não existe teste
   de forma que substitua ler o que o instrumento realmente faz.

## `InstrumentKind` real, hoje (9 membros)

Lido diretamente de `src/lib/types/alexandria.ts` nesta wave — não
reconstruído de memória:

```
calculadora · controles · laboratorio · simulador · comparador ·
explorador · cadeia-de-transformacao · dimensionador · quebra-cabeca
```

Nenhum membro foi acrescentado ou removido por esta wave. A auditoria dos
sete módulos (54 instrumentos extraídos como dado real, mais 2 descritos em
comentário mas nunca materializados como `Instrument` — ver contagem
abaixo) não encontrou mecânica que não coubesse em algum destes nove.

## Catálogo — agrupado por `kind`

### `calculadora` (8)

| Título literal | Módulo | Mecânica |
| --- | --- | --- |
| Calculadora · kWh = kW × h | 01 | 2 campos numéricos → 1 saída, com fórmula (`kWh = kW × h`) |
| Calculadora · Lei de Ohm | 01 | 3 campos numéricos → status textual, sem saída numérica (`unit: null`) |
| Calculadora · Perdas resistivas | 01 | 2 campos (range) → 1 saída, com fórmula quadrática (`P = I²R`) |
| Calculadora · Demanda média e fator de carga | 01 | 3 campos numéricos → 3 saídas |
| Calculadora · Fator de capacidade | 01 | 3 campos numéricos → 1 saída, com fórmula |
| Calculadora · Bateria: potência × energia | 02 | 2 campos (range) → 2 saídas + veredito |
| Calculadora · Perda embutida na conta | 02 | 3 campos (range) → saídas de energia injetada/custo |
| Calculadora · FC × energia anual | 03 | 2 campos (range) → 3 saídas + veredito |

### `controles` (1)

| Título literal | Módulo | Mecânica |
| --- | --- | --- |
| Controles · Triângulo de potência | 01 | 2 campos (range) → zero saídas — desenha diagrama em vez de imprimir número |

### `laboratorio` (1)

| Título literal | Módulo | Mecânica |
| --- | --- | --- |
| Laboratório · Comparador de perfil elétrico (`lab-01`) | 01 | 8 campos → 10 saídas — compara duas configurações fixas ("Fábrica A" × "Fábrica B") lado a lado. Fora de qualquer aula (§ Lab, aparato) desde a Wave 4. |

### `simulador` (27 — o mais frequente, e o mais heterogêneo)

| Título literal | Módulo | Mecânica |
| --- | --- | --- |
| Simulador · Perdas na transmissão | 02 | 2 campos numéricos + 2 select → 5 saídas + veredito |
| Simulador · Curva líquida e a rampa do fim da tarde | 02 | campos numéricos → saídas de curva |
| Simulador · Despacho por ordem de mérito | 02 | campos numéricos → saídas de despacho |
| Simulador · Excursão de frequência | 02 | 2 campos (range) + 1 select → 4 saídas (RoCoF, nadir, veredito) |
| Simulador · Dois submercados, um fio | 02 | campos numéricos → saídas de submercado |
| Simulador · A bateria do Brasil (EAR ao longo do ano) | 03 | campos numéricos → curva de EAR |
| Simulador · O dia do sistema: solar, vento e o resíduo | 03 | 2 campos (range) → 4 saídas + veredito |
| Simulador · A pilha de CVU: monte a ordem de mérito | 03 | 2 campos (range) + 1 select → 4 saídas + veredito |
| Simulador · Formador de preço | 04 | campos numéricos → preço formado + veredito |
| Simulador · PLD ao longo do ano | 04 | campos numéricos → curva de PLD, mês crítico |
| Simulador · O dinheiro que falta | 04 | campos numéricos → *missing money* |
| Simulador · Sala do leilão reverso | 04 | campos numéricos → preço de corte |
| Simulador · Contrato × spot ao longo de 12 meses | 04 | campos numéricos → composto mensal |
| **Mesa de hedge · swap simples** | 04 | campos numéricos → 4 saídas — nome fora do enum; mecânica idêntica aos outros seis do módulo (campo → readout → veredito), por isso `kind: 'simulador'` |
| Simulador · Portfólio em camadas | 04 | campos numéricos → composição de portfólio |
| Simulador · Quando duplicar a rede fica caro | 05 | campos numéricos → veredito |
| Simulador · Grau de separação | 05 | campos numéricos → grau + veredito |
| Simulador · Composição de contratação | 05 | campos numéricos → composição |
| Simulador · Ciclo de revisão tarifária | 05 | 6 campos (range) → 5 saídas (Parcela B ano 0/4, efeito WACC, veredito) |
| **Mapa · Posição no desenho de mercado** | 05 | 3 campos (range) → 5 saídas (quadrante, coerência, distância, risco, veredito) — nome fora do enum; **ver nota "Mapa" abaixo** |
| Simulador · a erosão do custo histórico | 06 | 5 campos (range) → 3 saídas |
| Simulador · como se forma uma dívida intrassetorial | 06 | 5 campos (range) → 4 saídas |
| **Termômetro do racionamento** | 06 | 4 campos (range) → 2 saídas numéricas (corte necessário, queda mensal) — nome fora do enum; **ver nota "Termômetro" abaixo** |
| Simulador · o efeito de uma liminar num sistema de rateio | 06 | 4 campos (range) → 4 saídas |
| **Linha da abertura** | 06 | 2 campos numéricos → 4 saídas — nome fora do enum; mesma mecânica campo→readout→veredito dos outros `simulador` do módulo |
| Anatomia de um ato regulatório · rito e janela de influência | 07 | 6 campos (range, dias) → 3 saídas (ciclo total, janela de influência, aviso prévio) |
| Régua do ciclo mensal · contabilização, garantia e liquidação | 07 | 5 campos (range, dias) → 3 saídas |

### `comparador` (4)

| Título literal | Módulo | Mecânica |
| --- | --- | --- |
| Comparador · Reservatório × fio d'água sob a mesma seca | 03 | 1 campo numérico aplicado a duas usinas fixas em paralelo → 5 saídas + veredito |
| Comparador · LCOE por tecnologia — e seus limites | 03 | 2 campos numéricos + 1 select (tecnologia) → 5 saídas (LCOE decomposto) + veredito |
| Comparador · três arquiteturas e onde o risco pousa | 06 | 1 campo numérico → 3 saídas (risco de faltar/sobrar/atrito, comparando três arquiteturas) |
| **Comparador de instrumentos jurídicos** | 07 | 1 campo `select` (11 opções) → zero saída numérica, revela texto — mecanicamente **idêntico** aos `explorador` do mesmo módulo; nome bate com o enum por convenção semântica (compara instrumentos lado a lado), não por forma distinta. Ver nota de nuance abaixo. |

### `explorador` (9)

| Título literal | Módulo | Mecânica |
| --- | --- | --- |
| Explorador · Camadas da rede | 02 | 1 campo `select` (4 categorias) → 6 saídas textuais fixas por categoria |
| Explorador · A matriz nas duas lentes | 03 | seleção → texto |
| **Mapa trauma → cicatriz regulatória** | 06 | 1 campo `select` (11 opções, período histórico) → zero saída numérica, revela par trauma/cicatriz de um array externo (`MODULO_06_TRAUMA_CICATRIZ`) — nome fora do enum; **ver nota "Mapa" abaixo** |
| Estante da EPE · qual documento responde qual pergunta | 07 | 1 campo `select` (7 perguntas) → zero saída, revela texto |
| Cadeia temporal da operação · produto, decisão e leitura | 07 | 1 campo `select` (5 horizontes) → zero saída, revela texto |
| Escada do travamento · o que parou o projeto e quem destrava | 07 | seleção → texto |
| Roteador de decisão | 07 | seleção → texto |
| Localizador de dado | 07 | seleção → texto |
| Calendário institucional · o que sai quando e de quem | 07 | seleção de mês/evento → texto |

### `cadeia-de-transformacao` (1)

| Título literal | Módulo | Mecânica |
| --- | --- | --- |
| Cadeia de transformação · por perfil | 02 | 1 campo `select` (3 perfis de consumidor) → 1 saída numérica (% de perda acumulada até a entrega) |

### `dimensionador` (1)

| Título literal | Módulo | Mecânica |
| --- | --- | --- |
| Dimensionador · MW, MWh e o preço da viagem no tempo | 03 | 3 campos numéricos (potência, duração, eficiência) → 5 saídas (tanque, deslocado/dia, perdido/dia, vocação, veredito) |

### `quebra-cabeca` (2)

| Título literal | Módulo | Mecânica |
| --- | --- | --- |
| Quebra-cabeça · O encaixe sazonal das fontes | 03 | 4 chaves booleanas (ligada/desligada, sem peso) → 3 saídas (razão mês fraco/forte, vale do portfólio, veredito) |
| **Termômetro · Risco de captura** | 05 | 8 chaves booleanas **com peso** (22+20+20+12+12+6+5+3 = 100) + 1 campo de materialidade → 5 saídas (índice de opacidade, exposição, veredito) — nome fora do enum; **ver nota "Termômetro" abaixo** |

## Duas notas de risco resolvidas nesta wave

### "Termômetro" — DUAS mecânicas diferentes, confirmado por leitura

- **Módulo 05 — "Termômetro · Risco de captura"** (`m05-inst-04`, `quebra-cabeca`):
  8 campos `select` booleanos (Presente/Ausente), cada um com peso fixo
  documentado no rótulo, mais 1 campo de materialidade em R$ — o padrão
  exato de `quebra-cabeca` (chaves com peso → índice agregado).
- **Módulo 06 — "Termômetro do racionamento"** (`m06-inst-04`, `simulador`):
  4 campos numéricos de balanço de energia (armazenamento inicial,
  afluência, margem de capacidade firme, meses até o período úmido) → 2
  saídas numéricas — nenhuma chave booleana, nenhum peso. É simulação de
  balanço físico, não pontuação de indício.

Mesmo prefixo, zero sobreposição de mecânica. Já estava registrado em prosa
na CLAUDE.md da Wave 29; confirmado aqui por leitura direta dos dois
arquivos de conteúdo antes de catalogar.

### "Mapa" — DUAS mecânicas diferentes, confirmado por leitura nesta wave

Esta era a pergunta explícita do brief desta wave — não estava resolvida em
prosa antes, porque a Wave 29 apenas listou "Mapa trauma → cicatriz" como
"fora do enum" sem detalhar a mecânica ao lado da do Módulo 05.

- **Módulo 05 — "Mapa · Posição no desenho de mercado"** (`m05-inst-06`,
  `simulador`): 3 campos numéricos em `range` (revelação de custo,
  remuneração de capacidade, peso do recurso armazenável) → 5 saídas
  (quadrante, coerência com o parque, distância do Brasil, risco dominante,
  veredito). É simulação paramétrica contínua — mover um slider desloca a
  posição num plano de dois eixos.
- **Módulo 06 — "Mapa trauma → cicatriz regulatória"** (`m06-inst-08`,
  `explorador`): 1 campo `select` de 11 opções (uma por período histórico,
  1879-2028) → zero saída numérica; a seleção revela um par
  problema/resposta/cicatriz/risco-novo de um array de dados separado
  (`MODULO_06_TRAUMA_CICATRIZ`, 11 entradas). É consulta discreta — não há
  eixo contínuo, não há posição, não há veredito computado.

**Confirmado: não são a mesma mecânica.** O nome "Mapa" sozinho levaria a
mapear os dois iguais; a leitura dos campos mostra dois instrumentos com
zero em comum além do prefixo — um é simulação paramétrica de posição
(`simulador`), o outro é consulta discreta de arquivo histórico
(`explorador`). É o segundo caso confirmado do mesmo risco que "Termômetro"
já demonstrava, e a razão de este catálogo existir.

## Nuance registrada, não um erro: `comparador` × `explorador` na mesma forma

Dentro do próprio Módulo 07, "Comparador de instrumentos jurídicos"
(`comparador`) e os seis `explorador` do módulo (Estante da EPE, Cadeia
temporal, Escada do travamento, Roteador de decisão, Localizador de dado,
Calendário institucional) têm **exatamente a mesma forma de campo**: um
`select` só, zero saída numérica declarada, texto revelado por seleção.

A escolha de `kind` entre os dois não vem da forma — vem de que a fonte
chama um de "Comparador" (compara N instrumentos jurídicos lado a lado
numa mesma pergunta) e os outros de exploração de um catálogo (qual
documento responde qual pergunta, qual horizonte é qual). É decisão de
LYCEUM Wave 30, documentada no próprio arquivo de conteúdo do Módulo 07;
esta wave não reabre nem reverte a escolha — só registra que "forma
idêntica, `kind` diferente" é um padrão real no currículo, ao lado de "nome
idêntico, mecânica diferente" (Termômetro, Mapa). Quem for decidir o `kind`
de um instrumento novo com essa forma (select único → texto) precisa ler a
intenção da fonte, não só contar campos.

## Contagem — reconciliação contra o que cada wave já reportou

| Módulo | Wave de extração | Na fonte (mencionado, extraído ou não) | Extraído como `Instrument` | De aula | Fora de aula |
| --- | --- | --- | --- | --- | --- |
| 01 | Wave 4 | 7 | 7 | 6 | 1 (`lab-01`) |
| 02 | Wave 18 | 9 | 9 | 9 | 0 |
| 03 | Wave 19 | 9 | 9 | 9 | 0 |
| 04 | Wave 24 | 7 | 7 | 7 | 0 |
| 05 | Wave 25 | 6 | 6 | 6 | 0 |
| 06 | Wave 29 | 8 | 7 | 7 | 1 ("Linha do tempo", nunca materializado como `Instrument` — sem cálculo) |
| 07 | Wave 30 | 10 | 9 | 9 | 1 ("Mapa institucional", nunca materializado como `Instrument` — 0 campos, chips clicáveis) |
| **Total** | | **56** | **54** | **53** | **3** |

Os números "na fonte" batem exatamente com o que cada wave já tinha
reportado no fechamento (Wave 4: 7 · Wave 18: 9 · Wave 19: 9 · Wave 24: 7 ·
Wave 25: 6 · Wave 29: 8 na fonte/7 de aula · Wave 30: 10 na fonte/9 de aula)
— zero divergência encontrada nesta auditoria.

**Diferença entre "na fonte" e "extraído como `Instrument`":** dois
instrumentos fora de aula (Módulo 01's `LAB · 01`, Módulo 06's "Linha do
tempo", Módulo 07's "Mapa institucional") são mencionados nos comentários
dos arquivos de conteúdo como existindo na fonte HTML, mas só `lab-01`
chegou a ser materializado como objeto `Instrument` real (fica órfão, sem
`aula` que o referencie). "Linha do tempo" (Módulo 06) e "Mapa
institucional" (Módulo 07) nunca viraram dado — são chips clicáveis "sem
cálculo", e as próprias waves de extração decidiram que não há campo nem
saída a modelar, então não criaram o objeto. É por isso que a coluna
"Extraído como `Instrument`" (54) é menor que "Na fonte" (56) por 2, não
por 3.

**Tally por `kind` (54 extraídos):** calculadora 8 · controles 1 ·
laboratorio 1 · simulador 27 · comparador 4 · explorador 9 ·
cadeia-de-transformacao 1 · dimensionador 1 · quebra-cabeca 2. Soma = 54,
bate com o total extraído.

## Veredito desta auditoria

Os 9 membros de `InstrumentKind` **permaneceram suficientes** para os 54
instrumentos extraídos dos Módulos 01-07. Nenhuma mecânica genuinamente nova
apareceu — todo instrumento com nome fora do enum (Mesa de hedge, Termômetro
×2, Mapa ×2, Linha da abertura, Comparador de instrumentos jurídicos) tinha
uma mecânica que já existia sob outro rótulo. O tipo não foi generalizado
por esta wave.
