# M01 · Aula 08 — vídeo-aula de abertura

**100 MW solar ≠ 100 MW térmica.** · Capacidade instalada e fator de capacidade
Título e tema: `src/lib/data/alexandria-modulo-01-content.ts`, MODULO_01_AULAS[7].title / subtitle, L526.

| | |
|---|---|
| Duração | 82.6 s (abertura muda 4.5 s + narração 72.5 s + créditos) |
| Arquivos | `public/alexandria/v3/aulas/m01/video/aula-08.{mp4,webm}`, `aula-08-poster.webp`, `aula-08.pt-BR.vtt` |
| Voz | ElevenLabs `eleven_v4`, voz "Henrique – Clear and Knowledgeable" (`3ULAAai0IVN00DTWA6vF`), a mesma nas nove aulas |
| Legendas | 15 deixas; texto na notação da aula, tempo pela transcrição local da narração (Parakeet), 93 % das palavras da fala casadas |
| Procedência | [`procedencia.md`](procedencia.md) |

## Regra seguida

Toda frase narrada vem da aula — literal, ou recorte: trechos literais juntados, com corte marcado
por "[…]" na legenda e as palavras de ligação ("de… a…", "e") listadas no bloco.
Na **fala**, números e siglas vão por extenso para a voz pronunciar ("60 Hz" → "sessenta hertz");
a **legenda** mantém a notação da aula. A coluna *Origem* dá arquivo, campo e linha; o
verificador `composicao/verificar.mjs` acha cada trecho, literal, no arquivo citado.

Ficam de fora em todas as aulas: QA-M01-A06 (limite de 2,3 kV do Grupo A), QA-M01-A07
("os outros 15% são reativos"), QA-FCap-01 (faixas de fator de capacidade por fonte) e a
palavra "exponencial" (QA-M01-A04).

## 00:00 · Abertura — ponto de entrada do Founder

Cartela muda de 4.5 s: *Alexandria · Módulo 01 · Física de Energia e Eletricidade* / *Aula 08* /
título / tema. É aqui que entra a fala gravada do Founder: troca-se a cena `s0` pela gravação e
aumenta-se `T0` em `composicao/gerar.mjs`; narração, cenas e legendas andam juntas. Nenhuma pessoa
foi gerada no lugar dele.

## Blocos

### 00:04.5 · p · Fonte (literal)

> Por que 100 MW solar ≠ 100 MW térmica?

Fala: *Por que cem megawatts solar não é o mesmo que cem megawatts térmica?*

| Origem | Campo | Linha |
|---|---|---|
| `docs/alexandria-v2/extraction/m01/aula-08.json` | aula.pergunta_mapa.pergunta_texto | HTML-fonte L1346 (§ MAP) |

Imagem: A pergunta da aula em Newsreader, termos-chave em óxido.

### 00:09.3 · c · Fonte (literal)

> Capacidade instalada é o tamanho nominal da usina ou equipamento de geração — o máximo teórico que ela pode produzir se operasse em potência plena, 24 horas por dia, 365 dias por ano.

Fala: *Capacidade instalada é o tamanho nominal da usina ou equipamento de geração: o máximo teórico que ela pode produzir se operasse em potência plena, vinte e quatro horas por dia, trezentos e sessenta e cinco dias por ano.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-08'] · 8.1, parágrafo 1 | L303 |

Imagem: Letreiro: a frase-chave do bloco, com a linha de fonte embaixo. Linha de fonte na tela: "FONTE · M01 · Aula 08 · 8.1".

### 00:22.7 · s · Fonte (literal)

> Isso não significa que ela gera 100 MW o tempo todo. A solar não gera à noite.

Fala: *Isso não significa que ela gera cem megawatts o tempo todo. A solar não gera à noite.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-08'] · 8.1, parágrafo 2 | L304 |

Imagem: Foto real com legenda e crédito na tela; leve aproximação (Ken Burns, 4,5 %). Foto: `m01v3-a08-solar-pirapora-1600.webp` — Complexo solar de Pirapora (MG) (CoyoteBR, CC BY-SA 4.0).

### 00:28.2 · eo · Fonte (literal)

> A eólica depende do vento.

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-08'] · 8.1, parágrafo 2 | L304 |

Imagem: Foto real com legenda e crédito na tela; leve aproximação (Ken Burns, 4,5 %). Foto: `m01v3-a08-eolica-cutia-2000.webp` — Parque eólico Cutia, litoral do Rio Grande do Norte (2019) (Copel, CC0).

### 00:30.1 · h · Fonte (literal)

> A hidrelétrica depende de chuva e reservatório.

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-08'] · 8.1, parágrafo 2 | L304 |

Imagem: Foto real com legenda e crédito na tela; leve aproximação (Ken Burns, 4,5 %). Foto: `m01v3-a01-itaipu-2000.webp` — Barragem de Itaipu, vista aérea (2011) (Jonas de Carvalho, CC BY-SA 2.0).

### 00:33.2 · te · Fonte (literal)

> A térmica depende de combustível disponível e despacho do sistema.

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-08'] · 8.1, parágrafo 2 | L304 |

Imagem: Foto real com legenda e crédito na tela; leve aproximação (Ken Burns, 4,5 %). Foto: `m01v3-a08-termica-camacari-2000.webp` — Casa de máquinas de usina termelétrica em Camaçari (BA), 2010 (Fotos Gov/Ba, CC BY 2.0).

### 00:37.7 · g · Fonte (literal)

> Geração efetiva é o que a usina realmente produziu em um período, medido em MWh.

Fala: *Geração efetiva é o que a usina realmente produziu em um período, medido em megawatts-hora.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-08'] · 8.1, parágrafo 2 | L304 |

Imagem: Fórmula da aula em destaque, com o texto de apoio. Linha de fonte na tela: "FONTE · M01 · Aula 08 · 8.1 e 8.2 · FC = fator de capacidade".

### 00:42.4 · f · Fonte (literal)

> FC = Geração real ÷ (Capacidade instalada × horas do período)

Fala: *O fator de capacidade é a geração real dividida pela capacidade instalada vezes as horas do período.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-08'] · 8.2, fórmula | L306 |

Imagem: continua a cena anterior (próximo passo do diagrama).

### 00:50.5 · x · Fonte (literal)

> Uma usina de 100 MW tem geração máxima teórica em um ano de 100 × 8.760 = 876.000 MWh. Se ela gerou efetivamente 220.000 MWh, o FC foi de 25,1%.

Fala: *Uma usina de cem megawatts tem geração máxima teórica, em um ano, de cem vezes oito mil setecentos e sessenta: oitocentos e setenta e seis mil megawatts-hora. Se ela gerou efetivamente duzentos e vinte mil megawatts-hora, o fator de capacidade foi de vinte e cinco vírgula um por cento.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-08'] · 8.2, parágrafo | L307 |

Imagem: Diagrama D-A08-1: barras 876.000 MWh (máximo teórico) e 220.000 MWh (real); contador até 25,1 %.

### 01:07.0 · l · Fonte (literal)

> Para análise séria, o que importa é o fator de capacidade — quanto a usina efetivamente entrega ao longo do tempo.

Fala: *Para análise séria, o que importa é o fator de capacidade: quanto a usina efetivamente entrega ao longo do tempo.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_LEAD['aula-01-08'] | L170 |

Imagem: Letreiro: a frase-chave do bloco, com a linha de fonte embaixo. Linha de fonte na tela: "FONTE · M01 · Aula 08 · abertura".

## 01:17.6 · Créditos

Cartela: texto e números da própria aula; narração em voz sintética (ElevenLabs) lendo o texto da aula; diagramas com os números da aula; fotos: CoyoteBR (CC BY-SA 4.0), Copel (CC0), Jonas de Carvalho (CC BY-SA 2.0), Fotos Gov/Ba (CC BY 2.0), via Wikimedia Commons.

## Fotos usadas

| Arquivo | Mostra | Autor | Licença |
|---|---|---|---|
| `public/alexandria/v3/aulas/m01/m01v3-a08-solar-pirapora-1600.webp` | Complexo solar de Pirapora (MG) | CoyoteBR | CC BY-SA 4.0 |
| `public/alexandria/v3/aulas/m01/m01v3-a08-eolica-cutia-2000.webp` | Parque eólico Cutia, litoral do Rio Grande do Norte (2019) | Copel | CC0 |
| `public/alexandria/v3/aulas/m01/m01v3-a01-itaipu-2000.webp` | Barragem de Itaipu, vista aérea (2011) | Jonas de Carvalho | CC BY-SA 2.0 |
| `public/alexandria/v3/aulas/m01/m01v3-a08-termica-camacari-2000.webp` | Casa de máquinas de usina termelétrica em Camaçari (BA), 2010 | Fotos Gov/Ba | CC BY 2.0 |

Procedência completa (SHA-1, página do Commons, o que a legenda não pode afirmar): `docs/alexandria-v2/media-provenance.md`, seção "Alexandria v3 — aulas do M01".
