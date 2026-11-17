# M01 · Aula 03 — vídeo-aula de abertura

**A rede tem um batimento cardíaco. Ele se chama 60 Hz.** · Corrente alternada e frequência
Título e tema: `src/lib/data/alexandria-modulo-01-content.ts`, MODULO_01_AULAS[2].title / subtitle, L396.

| | |
|---|---|
| Duração | 89.3 s (abertura muda 4.5 s + narração 79.2 s + créditos) |
| Arquivos | `public/alexandria/v3/aulas/m01/video/aula-03.{mp4,webm}`, `aula-03-poster.webp`, `aula-03.pt-BR.vtt` |
| Voz | ElevenLabs `eleven_v4`, voz "Henrique – Clear and Knowledgeable" (`3ULAAai0IVN00DTWA6vF`), a mesma nas nove aulas |
| Legendas | 16 deixas; texto na notação da aula, tempo pela transcrição local da narração (Parakeet), 98 % das palavras da fala casadas |
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

Cartela muda de 4.5 s: *Alexandria · Módulo 01 · Física de Energia e Eletricidade* / *Aula 03* /
título / tema. É aqui que entra a fala gravada do Founder: troca-se a cena `s0` pela gravação e
aumenta-se `T0` em `composicao/gerar.mjs`; narração, cenas e legendas andam juntas. Nenhuma pessoa
foi gerada no lugar dele.

## Blocos

### 00:04.5 · p · Fonte (literal)

> Por que a rede oscila 60 vezes por segundo, e por que isso importa?

Fala: *Por que a rede oscila sessenta vezes por segundo, e por que isso importa?*

| Origem | Campo | Linha |
|---|---|---|
| `docs/alexandria-v2/extraction/m01/aula-03.json` | aula.pergunta_mapa.pergunta_texto | HTML-fonte L1341 (§ MAP) |

Imagem: A pergunta da aula em Newsreader, termos-chave em óxido.

### 00:09.7 · dc · Fonte (literal)

> Corrente contínua (DC) tem fluxo em uma direção principal constante.

Fala: *Corrente contínua tem fluxo em uma direção principal constante.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-03'] · 3.1 | L220 |

Imagem: Diagrama D-A03-1: DC (constante) e AC 60 Hz, eixo em ms (4 ciclos ≈ 66,7 ms, derivado de 60 Hz), amplitude em unidade relativa.

### 00:13.9 · ac · Fonte (literal)

> Corrente alternada (AC) tem fluxo cujo sentido alterna periodicamente. No Brasil, a alternância ocorre 60 vezes por segundo — frequência de 60 Hz.

Fala: *Corrente alternada tem fluxo cujo sentido alterna periodicamente. No Brasil, a alternância ocorre sessenta vezes por segundo: frequência de sessenta hertz.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-03'] · 3.2 | L222 |

Imagem: continua a cena anterior (próximo passo do diagrama).

### 00:23.1 · g · Fonte (literal)

> Na chamada Guerra das Correntes do final do século XIX (Westinghouse/Tesla pela AC vs. Edison pela DC), a corrente alternada venceu por uma razão técnica decisiva: com AC é simples elevar e reduzir tensão usando transformadores.

Fala: *Na chamada Guerra das Correntes do final do século dezenove, Westinghouse e Tesla pela corrente alternada, contra Edison pela contínua, a corrente alternada venceu por uma razão técnica decisiva: com ela, é simples elevar e reduzir tensão usando transformadores.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-03'] · 3.3, parágrafo 1 | L225 |

Imagem: Retratos: Westinghouse e Tesla (pela AC), Edison (pela DC), cada um com legenda e crédito.

### 00:40.9 · n · Fonte (literal)

> Essa habilidade de mudar de tensão é o que torna possível transmitir energia em alta tensão por centenas de quilômetros e depois entregá-la em baixa tensão para a casa do consumidor.

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-03'] · 3.3, parágrafo 2 | L226 |

Imagem: Foto real com legenda e crédito na tela; leve aproximação (Ken Burns, 4,5 %). Foto: `m01v3-a03-niagara-geradores-804.webp` — Geradores Westinghouse na casa de força de Niagara Falls (foto de 1904) (Westinghouse Electric & Manufacturing Co., domínio público).

### 00:51.4 · b1 · Recorte (literal, com corte/junção)

> A regra física que governa todo sistema interligado em corrente alternada é simples e absoluta: Geração ≈ Consumo, em tempo real.

Fala: *A regra física que governa todo sistema interligado em corrente alternada é simples e absoluta: geração aproximadamente igual a consumo, em tempo real.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-03'] · 3.4, parágrafo | L229 |
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-03'] · 3.4, fórmula | L230 |

Imagem: Diagrama D-A03-2 (conceitual): equilíbrio, consumo > geração (frequência cai), geração > consumo (sobe). Sem número além de 60 Hz.

### 01:01.5 · b2 · Fonte (literal)

> Se o consumo aumenta e a geração não acompanha, a frequência da rede cai. Se a geração supera o consumo, a frequência sobe.

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-03'] · 3.4, parágrafo 2 | L231 |

Imagem: continua a cena anterior (próximo passo do diagrama).

### 01:09.4 · o · Fonte (literal)

> O ONS não "organiza energia" como quem organiza planilha. Coordena um sistema físico que precisa equilibrar oferta e demanda 86.400 vezes por dia — uma vez por segundo, todos os segundos.

Fala: *O ONS não organiza energia como quem organiza planilha. Coordena um sistema físico que precisa equilibrar oferta e demanda oitenta e seis mil e quatrocentas vezes por dia: uma vez por segundo, todos os segundos.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-03'] · 3.4, nota (Conexão com o Bloco 02) | L232 |

Imagem: Contador até 86.400 vezes por dia.

## 01:24.3 · Créditos

Cartela: texto e números da própria aula; narração em voz sintética (ElevenLabs) lendo o texto da aula; diagramas com os números da aula; fotos: Joseph Gaylord Gessford (CC0), Napoleon Sarony (domínio público), Louis Bachrach (rest. Michel Vuijlsteke) (domínio público), Westinghouse Electric & Manufacturing Co. (domínio público), via Wikimedia Commons.

## Fotos usadas

| Arquivo | Mostra | Autor | Licença |
|---|---|---|---|
| `public/alexandria/v3/aulas/m01/m01v3-a03-westinghouse-1677.webp` | George Westinghouse, 1906 | Joseph Gaylord Gessford | CC0 |
| `public/alexandria/v3/aulas/m01/m01v3-a03-tesla-752.webp` | Nikola Tesla, c. 1890 | Napoleon Sarony | domínio público |
| `public/alexandria/v3/aulas/m01/m01v3-a03-edison-2000.webp` | Thomas A. Edison, c. 1922 | Louis Bachrach (rest. Michel Vuijlsteke) | domínio público |
| `public/alexandria/v3/aulas/m01/m01v3-a03-niagara-geradores-804.webp` | Geradores Westinghouse na casa de força de Niagara Falls (foto de 1904) | Westinghouse Electric & Manufacturing Co. | domínio público |

Procedência completa (SHA-1, página do Commons, o que a legenda não pode afirmar): `docs/alexandria-v2/media-provenance.md`, seção "Alexandria v3 — aulas do M01".
