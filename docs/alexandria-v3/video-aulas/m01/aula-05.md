# M01 · Aula 05 — vídeo-aula de abertura

**Por que uma fábrica paga por capacidade reservada.** · Demanda e fator de carga
Título e tema: `src/lib/data/alexandria-modulo-01-content.ts`, MODULO_01_AULAS[4].title / subtitle, L444.

| | |
|---|---|
| Duração | 94.3 s (abertura muda 4.5 s + narração 84.2 s + créditos) |
| Arquivos | `public/alexandria/v3/aulas/m01/video/aula-05.{mp4,webm}`, `aula-05-poster.webp`, `aula-05.pt-BR.vtt` |
| Voz | ElevenLabs `eleven_v4`, voz "Henrique – Clear and Knowledgeable" (`3ULAAai0IVN00DTWA6vF`), a mesma nas nove aulas |
| Legendas | 18 deixas; texto na notação da aula, tempo pela transcrição local da narração (Parakeet), 98 % das palavras da fala casadas |
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

Cartela muda de 4.5 s: *Alexandria · Módulo 01 · Física de Energia e Eletricidade* / *Aula 05* /
título / tema. É aqui que entra a fala gravada do Founder: troca-se a cena `s0` pela gravação e
aumenta-se `T0` em `composicao/gerar.mjs`; narração, cenas e legendas andam juntas. Nenhuma pessoa
foi gerada no lugar dele.

## Blocos

### 00:04.5 · p · Fonte (literal)

> Por que uma fábrica paga por capacidade reservada, não só por energia?

| Origem | Campo | Linha |
|---|---|---|
| `docs/alexandria-v2/extraction/m01/aula-05.json` | aula.pergunta_mapa.pergunta_texto | HTML-fonte L1343 (§ MAP) |

Imagem: A pergunta da aula em Newsreader, termos-chave em óxido.

### 00:09.2 · r · Recorte (literal, com corte/junção)

> Imagine uma estrada que liga uma fábrica a um centro logístico. […] Se a fábrica concentra toda a operação em um turno de quatro horas — descarrega tudo, depois fica vazia — a estrada precisa ser dimensionada para o pico, não para a média.

Fala: *Imagine uma estrada que liga uma fábrica a um centro logístico. Se a fábrica concentra toda a operação em um turno de quatro horas, descarrega tudo, depois fica vazia, a estrada precisa ser dimensionada para o pico, não para a média.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-05'] · 5.1, parágrafo 1 | L251 |
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-05'] · 5.1, parágrafo 1 | L251 |

Imagem: Letreiro: a frase-chave do bloco, com a linha de fonte embaixo. Linha de fonte na tela: "FONTE · M01 · Aula 05 · 5.1".

### 00:23.6 · d · Fonte (literal)

> Na rede elétrica, a lógica é idêntica. A distribuidora precisa ter transformadores, cabos, subestações e proteção dimensionados para o pior momento simultâneo em que todos os clientes daquela rede puxam energia.

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-05'] · 5.1, parágrafo 2 | L252 |

Imagem: Foto real com legenda e crédito na tela; leve aproximação (Ken Burns, 4,5 %). Foto: `m01v3-a02-subestacao-cpfl-2000.webp` — Pátio de uma subestação da CPFL, visto da rua (enioprado, CC BY-SA 3.0).

### 00:37.3 · c · Fonte (literal)

> Demanda é a cobrança por essa capacidade reservada da rede.

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-05'] · 5.1, parágrafo 3 | L253 |

Imagem: Letreiro: a frase-chave do bloco, com a linha de fonte embaixo. Linha de fonte na tela: "FONTE · M01 · Aula 05 · 5.1".

### 00:41.3 · m · Fonte (literal)

> Demanda média é uma construção: o consumo total do período dividido pelas horas do período.

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-05'] · 5.3, parágrafo 1 | L258 |

Imagem: As duas fórmulas da seção 5.3, uma por bloco. Linha de fonte na tela: "FONTE · M01 · Aula 05 · 5.3".

### 00:47.5 · fc · Fonte (literal)

> Fator de carga é a razão entre demanda média e demanda máxima. Ele mede quão bem a instalação aproveita a capacidade que paga.

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-05'] · 5.3, parágrafo 2 | L260 |

Imagem: continua a cena anterior (próximo passo do diagrama).

### 00:55.9 · x · Fonte (literal)

> Uma empresa consome 144.000 kWh em um mês de 720 horas. Demanda máxima medida foi 800 kW.

Fala: *Uma empresa consome cento e quarenta e quatro mil quilowatts-hora em um mês de setecentas e vinte horas. Demanda máxima medida foi oitocentos quilowatts.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_AULAS[4] · Ex · 04 · prompt | L458 |

Imagem: Diagrama D-A05-1: barras 800 kW (máxima) e 200 kW (média), eixo em kW; ao lado, os dados do Ex · 04 e a conta.

### 01:03.7 · g · Fonte (literal)

> Demanda média: 144.000 ÷ 720 = 200 kW. Fator de carga: 200 ÷ 800 = 0,25 = 25%.

Fala: *Demanda média: cento e quarenta e quatro mil dividido por setecentos e vinte, duzentos quilowatts. Fator de carga: duzentos dividido por oitocentos, zero vírgula vinte e cinco, vinte e cinco por cento.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_AULAS[4] · Ex · 04 · gabarito | L460 |

Imagem: continua a cena anterior (próximo passo do diagrama).

### 01:13.9 · i · Fonte (literal)

> Fator de carga baixo indica picos elevados em relação ao consumo médio. […] não recomende mudança contratual sem ver 12 meses de histórico e entender a operação.

Fala: *Fator de carga baixo indica picos elevados em relação ao consumo médio. Não recomende mudança contratual sem ver doze meses de histórico e entender a operação.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_AULAS[4] · Ex · 04 · gabarito (interpretação) | L460 |
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_AULAS[4] · Ex · 04 · gabarito (interpretação) | L460 |

Imagem: Diagrama D-A05-3: régua 0–1 com as quatro faixas da tabela 5.4 (tons de tinta, sem semáforo); 0,90–1,00 marcado "sem faixa na tabela"; o 0,25 do exemplo em óxido.

## 01:29.3 · Créditos

Cartela: texto e números da própria aula; narração em voz sintética (ElevenLabs) lendo o texto da aula; diagramas com os números da aula; fotos: enioprado (CC BY-SA 3.0), via Wikimedia Commons.

## Fotos usadas

| Arquivo | Mostra | Autor | Licença |
|---|---|---|---|
| `public/alexandria/v3/aulas/m01/m01v3-a02-subestacao-cpfl-2000.webp` | Pátio de uma subestação da CPFL, visto da rua | enioprado | CC BY-SA 3.0 |

Procedência completa (SHA-1, página do Commons, o que a legenda não pode afirmar): `docs/alexandria-v2/media-provenance.md`, seção "Alexandria v3 — aulas do M01".
