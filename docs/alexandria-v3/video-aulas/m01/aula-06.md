# M01 · Aula 06 — vídeo-aula de abertura

**A tensão de fornecimento define a tarifa que você paga.** · Tensão como categoria econômica
Título e tema: `src/lib/data/alexandria-modulo-01-content.ts`, MODULO_01_AULAS[5].title / subtitle, L478.

| | |
|---|---|
| Duração | 70.4 s (abertura muda 4.5 s + narração 60.3 s + créditos) |
| Arquivos | `public/alexandria/v3/aulas/m01/video/aula-06.{mp4,webm}`, `aula-06-poster.webp`, `aula-06.pt-BR.vtt` |
| Voz | ElevenLabs `eleven_v4`, voz "Henrique – Clear and Knowledgeable" (`3ULAAai0IVN00DTWA6vF`), a mesma nas nove aulas |
| Legendas | 15 deixas; texto na notação da aula, tempo pela transcrição local da narração (Parakeet), 94 % das palavras da fala casadas |
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

Cartela muda de 4.5 s: *Alexandria · Módulo 01 · Física de Energia e Eletricidade* / *Aula 06* /
título / tema. É aqui que entra a fala gravada do Founder: troca-se a cena `s0` pela gravação e
aumenta-se `T0` em `composicao/gerar.mjs`; narração, cenas e legendas andam juntas. Nenhuma pessoa
foi gerada no lugar dele.

## Blocos

### 00:04.5 · p · Fonte (literal)

> Por que sua tensão de fornecimento define seu grupo tarifário?

| Origem | Campo | Linha |
|---|---|---|
| `docs/alexandria-v2/extraction/m01/aula-06.json` | aula.pergunta_mapa.pergunta_texto | HTML-fonte L1344 (§ MAP) |

Imagem: A pergunta da aula em Newsreader, termos-chave em óxido.

### 00:08.4 · e · Fonte (literal)

> No Brasil, tensão não é apenas um parâmetro técnico. É o eixo central de classificação tarifária.

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_LEAD['aula-01-06'] | L168 |

Imagem: Letreiro: a frase-chave do bloco, com a linha de fonte embaixo. Linha de fonte na tela: "FONTE · M01 · Aula 06 · abertura".

### 00:15.1 · g · Fonte (literal)

> Grupo B paga uma tarifa simples (essencialmente: kWh × tarifa). Grupo A paga uma estrutura tarifária binômia: uma componente para consumo (kWh) e outra para demanda (kW).

Fala: *Grupo B paga uma tarifa simples: essencialmente, quilowatts-hora vezes tarifa. Grupo A paga uma estrutura tarifária binômia: uma componente para consumo, em quilowatts-hora, e outra para demanda, em quilowatts.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-06'] · 6.1, parágrafo 2 | L270 |

Imagem: Duas colunas: Grupo B · kWh × tarifa; Grupo A · consumo (kWh) + demanda (kW). Nenhum limite de tensão (QA-M01-A06 fora).

### 00:28.3 · c · Fonte (literal)

> Quanto mais alta a tensão de fornecimento, mais próximo o consumidor está fisicamente da geração e da transmissão troncal, e menos camadas de rede ele atravessa.

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-06'] · 6.3, parágrafo | L275 |

Imagem: Esquema sem escala: Geração → Transmissão troncal → Distribuição → Baixa tensão.

### 00:39.2 · l · Fonte (literal)

> Logo: menos perdas técnicas embutidas na sua tarifa; menos uso de ativos de distribuição de baixa tensão; menor componente de TUSD comparada à TE.

Fala: *Logo: menos perdas técnicas embutidas na sua tarifa; menos uso de ativos de distribuição de baixa tensão; menor componente de tusd comparada à tê é.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-06'] · 6.3, parágrafo | L275 |
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-06'] · 6.3, lista | L276 |

Imagem: Foto real com legenda e crédito na tela; leve aproximação (Ken Burns, 4,5 %). Foto: `m01v3-a06-transformador-poste-1500.webp` — Transformador de distribuição montado em poste (Austrália) (Bidgee, CC BY 3.0).

### 00:50.2 · x · Fonte (literal)

> Um cliente A1 (em 230 kV) paga, em geral, tarifa total menor que um A4 (em 13,8 kV) para o mesmo kWh — exatamente porque o A1 está usando muito menos infraestrutura de rede.

Fala: *Um cliente A1, em duzentos e trinta quilovolts, paga, em geral, tarifa total menor que um A4, em treze vírgula oito quilovolts, para o mesmo quilowatt-hora, exatamente porque o A1 está usando muito menos infraestrutura de rede.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-06'] · 6.3, parágrafo final | L277 |

Imagem: O mesmo esquema com o cliente A1 (230 kV) e o A4 (13,8 kV) na cadeia; posição ilustrativa.

## 01:05.4 · Créditos

Cartela: texto e números da própria aula; narração em voz sintética (ElevenLabs) lendo o texto da aula; diagramas com os números da aula; fotos: Bidgee (CC BY 3.0), via Wikimedia Commons.

## Fotos usadas

| Arquivo | Mostra | Autor | Licença |
|---|---|---|---|
| `public/alexandria/v3/aulas/m01/m01v3-a06-transformador-poste-1500.webp` | Transformador de distribuição montado em poste (Austrália) | Bidgee | CC BY 3.0 |

Procedência completa (SHA-1, página do Commons, o que a legenda não pode afirmar): `docs/alexandria-v2/media-provenance.md`, seção "Alexandria v3 — aulas do M01".
