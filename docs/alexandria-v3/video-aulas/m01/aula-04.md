# M01 · Aula 04 — vídeo-aula de abertura

**Por que perdas crescem ao quadrado. E por que isso desenhou toda a rede.** · Tensão, corrente e perdas
Título e tema: `src/lib/data/alexandria-modulo-01-content.ts`, MODULO_01_AULAS[3].title / subtitle, L417.

| | |
|---|---|
| Duração | 95.0 s (abertura muda 4.5 s + narração 84.9 s + créditos) |
| Arquivos | `public/alexandria/v3/aulas/m01/video/aula-04.{mp4,webm}`, `aula-04-poster.webp`, `aula-04.pt-BR.vtt` |
| Voz | ElevenLabs `eleven_v4`, voz "Henrique – Clear and Knowledgeable" (`3ULAAai0IVN00DTWA6vF`), a mesma nas nove aulas |
| Legendas | 20 deixas; texto na notação da aula, tempo pela transcrição local da narração (Parakeet), 98 % das palavras da fala casadas |
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

Cartela muda de 4.5 s: *Alexandria · Módulo 01 · Física de Energia e Eletricidade* / *Aula 04* /
título / tema. É aqui que entra a fala gravada do Founder: troca-se a cena `s0` pela gravação e
aumenta-se `T0` em `composicao/gerar.mjs`; narração, cenas e legendas andam juntas. Nenhuma pessoa
foi gerada no lugar dele.

## Blocos

### 00:04.5 · p · Fonte (literal)

> Por que transmissão usa alta tensão? Por que perdas crescem ao quadrado?

| Origem | Campo | Linha |
|---|---|---|
| `docs/alexandria-v2/extraction/m01/aula-04.json` | aula.pergunta_mapa.pergunta_texto | HTML-fonte L1342 (§ MAP) |

Imagem: A pergunta da aula em Newsreader, termos-chave em óxido.

### 00:09.7 · j · Fonte (literal)

> Quando corrente elétrica passa por um condutor com resistência, parte da energia elétrica se transforma em calor. Isso é dissipação resistiva — o famoso "efeito Joule".

Fala: *Quando corrente elétrica passa por um condutor com resistência, parte da energia elétrica se transforma em calor. Isso é dissipação resistiva, o famoso efeito Joule.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-04'] · 4.1, parágrafo 1 | L238 |

Imagem: Fórmula da aula em destaque, com o texto de apoio. Linha de fonte na tela: "FONTE · M01 · Aula 04 · 4.1".

### 00:20.3 · f · Fonte (literal)

> P perdas = I² × R. Perdas resistivas crescem com o quadrado da corrente.

Fala: *A perda é igual à corrente ao quadrado vezes a resistência. Perdas resistivas crescem com o quadrado da corrente.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-04'] · 4.1, fórmula (o sobrescrito de I² se perdeu na extração: 'I 2') | L239 |
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-04'] · 4.1, fórmula | L239 |

Notação: "P perdas = I² × R" na legenda = "P perdas = I 2 × R" na extração.

Imagem: continua a cena anterior (próximo passo do diagrama).

### 00:27.9 · q · Fonte (literal)

> Se a corrente dobra, as perdas quadruplicam. Se a corrente triplica, as perdas crescem nove vezes.

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-04'] · 4.1, parágrafo 2 | L240 |

Imagem: Diagrama D-A04-1: P = I² × 0,5 Ω, eixo 0–300 A × 0–50.000 W, pontos 100 A · 5.000 W, 200 A · 20.000 W (×4), 300 A · 45.000 W (×9).

### 00:35.1 · e · Fonte (literal)

> Para transmitir a mesma potência (P = V × I), você pode escolher: usar tensão alta com corrente baixa, ou tensão baixa com corrente alta. Como perdas dependem de I² × R, a primeira opção dissipa drasticamente menos energia ao longo dos cabos.

Fala: *Para transmitir a mesma potência, você pode escolher: usar tensão alta com corrente baixa, ou tensão baixa com corrente alta. Como perdas dependem da corrente ao quadrado vezes a resistência, a primeira opção dissipa drasticamente menos energia ao longo dos cabos.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-04'] · 4.2, parágrafo | L242 |

Imagem: Esquema sem escala: mesma potência, cabo fino (tensão alta, corrente baixa) × cabo grosso (tensão baixa, corrente alta).

### 00:51.8 · t · Fonte (literal)

> Transmissão usa tensões altíssimas (230 kV, 345 kV, 500 kV, 750 kV) para mover blocos de centenas de MW por centenas ou milhares de quilômetros.

Fala: *Transmissão usa tensões altíssimas, de duzentos e trinta, trezentos e quarenta e cinco, quinhentos e setecentos e cinquenta quilovolts, para mover blocos de centenas de megawatts por centenas ou milhares de quilômetros.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-04'] · 4.2, lista, item 1 | L243 |

Imagem: Foto real com legenda e crédito na tela; leve aproximação (Ken Burns, 4,5 %). Foto: `m01v3-a04-candiota-2000.webp` — Torre de transmissão e o complexo termelétrico de Candiota (RS) (Ryan Garcia, CC BY 2.0).

### 01:05.6 · b · Fonte (literal)

> Baixa tensão residencial chega em 127/220 V, próximo ao ponto de uso, onde correntes pequenas e curtos caminhos tornam as perdas aceitáveis.

Fala: *Baixa tensão residencial chega em cento e vinte e sete ou duzentos e vinte volts, próximo ao ponto de uso, onde correntes pequenas e curtos caminhos tornam as perdas aceitáveis.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-04'] · 4.2, lista, item 3 | L243 |

Imagem: Três degraus da lista 4.2: transmissão 230–750 kV, subtransmissão/distribuição 13,8–138 kV, baixa tensão 127/220 V; no 2º bloco, os nomes alta / média / baixa tensão da abertura da aula.

### 01:16.0 · l · Fonte (literal)

> Toda a arquitetura física do sistema elétrico brasileiro — alta tensão na transmissão, média tensão na distribuição, baixa tensão no consumidor — existe porque perdas resistivas crescem com o quadrado da corrente.

Fala: *Toda a arquitetura física do sistema elétrico brasileiro, alta tensão na transmissão, média tensão na distribuição, baixa tensão no consumidor, existe porque perdas resistivas crescem com o quadrado da corrente.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_LEAD['aula-01-04'] | L166 |

Imagem: continua a cena anterior (próximo passo do diagrama).

## 01:30.0 · Créditos

Cartela: texto e números da própria aula; narração em voz sintética (ElevenLabs) lendo o texto da aula; diagramas com os números da aula; fotos: Ryan Garcia (CC BY 2.0), via Wikimedia Commons.

## Fotos usadas

| Arquivo | Mostra | Autor | Licença |
|---|---|---|---|
| `public/alexandria/v3/aulas/m01/m01v3-a04-candiota-2000.webp` | Torre de transmissão e o complexo termelétrico de Candiota (RS) | Ryan Garcia | CC BY 2.0 |

Procedência completa (SHA-1, página do Commons, o que a legenda não pode afirmar): `docs/alexandria-v2/media-provenance.md`, seção "Alexandria v3 — aulas do M01".
