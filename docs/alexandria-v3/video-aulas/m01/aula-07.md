# M01 · Aula 07 — vídeo-aula de abertura

**Existe energia que ocupa a rede e não vira produção.** · Triângulo de potência e fator de potência
Título e tema: `src/lib/data/alexandria-modulo-01-content.ts`, MODULO_01_AULAS[6].title / subtitle, L499.

| | |
|---|---|
| Duração | 106.4 s (abertura muda 4.5 s + narração 96.3 s + créditos) |
| Arquivos | `public/alexandria/v3/aulas/m01/video/aula-07.{mp4,webm}`, `aula-07-poster.webp`, `aula-07.pt-BR.vtt` |
| Voz | ElevenLabs `eleven_v4`, voz "Henrique – Clear and Knowledgeable" (`3ULAAai0IVN00DTWA6vF`), a mesma nas nove aulas |
| Legendas | 20 deixas; texto na notação da aula, tempo pela transcrição local da narração (Parakeet), 97 % das palavras da fala casadas |
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

Cartela muda de 4.5 s: *Alexandria · Módulo 01 · Física de Energia e Eletricidade* / *Aula 07* /
título / tema. É aqui que entra a fala gravada do Founder: troca-se a cena `s0` pela gravação e
aumenta-se `T0` em `composicao/gerar.mjs`; narração, cenas e legendas andam juntas. Nenhuma pessoa
foi gerada no lugar dele.

## Blocos

### 00:04.5 · p · Fonte (literal)

> Por que existe energia que ocupa a rede mas não vira produção?

| Origem | Campo | Linha |
|---|---|---|
| `docs/alexandria-v2/extraction/m01/aula-07.json` | aula.pergunta_mapa.pergunta_texto | HTML-fonte L1345 (§ MAP) |

Imagem: A pergunta da aula em Newsreader, termos-chave em óxido.

### 00:09.0 · r · Fonte (literal)

> Em equipamentos puramente resistivos — uma resistência de chuveiro, uma lâmpada incandescente — a corrente está perfeitamente em fase com a tensão.

Fala: *Em equipamentos puramente resistivos, uma resistência de chuveiro, uma lâmpada incandescente, a corrente está perfeitamente em fase com a tensão.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-07'] · 7.1, parágrafo 1 | L285 |

Imagem: Diagrama D-A07-2: tensão e corrente em fase (resistiva) × corrente atrasada (indutiva); atraso ilustrativo φ = 31°, derivado do INST·05.

### 00:18.3 · i · Fonte (literal)

> Em equipamentos indutivos — motores, transformadores, compressores, fornos a arco, bobinas de solda — algo diferente acontece. Esses equipamentos precisam de campos magnéticos para funcionar. A criação e sustentação desses campos exige que a corrente fique levemente "atrasada" em relação à tensão.

Fala: *Em equipamentos indutivos, motores, transformadores, compressores, fornos a arco, bobinas de solda, algo diferente acontece. Esses equipamentos precisam de campos magnéticos para funcionar. A criação e sustentação desses campos exige que a corrente fique levemente atrasada em relação à tensão.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-07'] · 7.1, parágrafo 2 | L286 |

Imagem: continua a cena anterior (próximo passo do diagrama).

### 00:37.9 · k · Fonte (literal)

> Parte da potência que circula entre a rede e a instalação não realiza trabalho útil no eixo da máquina — apenas oscila entre rede e equipamento, sustentando o campo magnético. Essa parcela é a potência reativa (kVAr). Ela é necessária para a operação, mas não vira produção.

Fala: *Parte da potência que circula entre a rede e a instalação não realiza trabalho útil no eixo da máquina: apenas oscila entre rede e equipamento, sustentando o campo magnético. Essa parcela é a potência reativa. Ela é necessária para a operação, mas não vira produção.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-07'] · 7.1, parágrafo 2 | L286 |
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-07'] · 7.1, parágrafo 3 | L287 |

Imagem: Foto real com legenda e crédito na tela; leve aproximação (Ken Burns, 4,5 %). Foto: `m01v3-a07-forno-eletrico-918.webp` — Vazamento de aço de um forno elétrico, Allegheny Ludlum Steel (EUA), c. 1941 (Alfred T. Palmer · Library of Congress, domínio público).

### 00:55.1 · t · Fonte (literal)

> FP = kW ÷ kVA = cos φ

Fala: *O fator de potência é a potência ativa dividida pela aparente: o cosseno do ângulo fi.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-07'] · 7.3, fórmula | L291 |

Imagem: Diagrama D-A07-1: triângulo em escala 800 : 480, catetos desenhados um a um.

### 01:00.7 · b · Fonte (literal)

> Quando uma instalação industrial opera com FP baixo, ela força a distribuidora a entregar mais kVA para produzir o mesmo kW útil.

Fala: *Quando uma instalação industrial opera com fator de potência baixo, ela força a distribuidora a entregar mais quilovolt-ampères para produzir o mesmo quilowatt útil.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-07'] · 7.4, parágrafo 1 | L294 |

Imagem: continua a cena anterior (próximo passo do diagrama).

### 01:11.3 · r92 · Fonte (literal)

> Para combater isso, a regulação brasileira estabelece um fator de potência mínimo de referência de 0,92 para unidades do Grupo A, tanto no comportamento indutivo quanto no capacitivo.

Fala: *Para combater isso, a regulação brasileira estabelece um fator de potência mínimo de referência de zero vírgula noventa e dois para unidades do Grupo A, tanto no comportamento indutivo quanto no capacitivo.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-07'] · 7.4, parágrafo 2 | L295 |

Imagem: Régua de FP de 0,80 a 1,00 com a referência 0,92 (ouro) e o 0,90 do Ex · 05 (óxido). Sem barra empilhada (QA-M01-A07 fora).

### 01:23.3 · x · Fonte (literal)

> Uma instalação industrial usa 900 kW de potência ativa e exige 1.000 kVA de potência aparente. FP: 900 ÷ 1.000 = 0,90. Está abaixo da referência prática de 0,92 para Grupo A.

Fala: *Uma instalação industrial usa novecentos quilowatts de potência ativa e exige mil quilovolt-ampères de potência aparente. Fator de potência: novecentos dividido por mil, zero vírgula noventa. Está abaixo da referência prática de zero vírgula noventa e dois para Grupo A.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_AULAS[6] · Ex · 05 · prompt | L513 |
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_AULAS[6] · Ex · 05 · gabarito | L515 |

Imagem: continua a cena anterior (próximo passo do diagrama).

## 01:41.4 · Créditos

Cartela: texto e números da própria aula; narração em voz sintética (ElevenLabs) lendo o texto da aula; diagramas com os números da aula; fotos: Alfred T. Palmer · Library of Congress (domínio público), via Wikimedia Commons.

## Fotos usadas

| Arquivo | Mostra | Autor | Licença |
|---|---|---|---|
| `public/alexandria/v3/aulas/m01/m01v3-a07-forno-eletrico-918.webp` | Vazamento de aço de um forno elétrico, Allegheny Ludlum Steel (EUA), c. 1941 | Alfred T. Palmer · Library of Congress | domínio público |

Procedência completa (SHA-1, página do Commons, o que a legenda não pode afirmar): `docs/alexandria-v2/media-provenance.md`, seção "Alexandria v3 — aulas do M01".
