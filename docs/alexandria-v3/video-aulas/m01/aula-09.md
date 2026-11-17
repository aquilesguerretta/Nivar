# M01 · Aula 09 — vídeo-aula de abertura

**Energia ruim pode custar mais do que energia cara.** · Qualidade de energia
Título e tema: `src/lib/data/alexandria-modulo-01-content.ts`, MODULO_01_AULAS[8].title / subtitle, L553.

| | |
|---|---|
| Duração | 81.7 s (abertura muda 4.5 s + narração 71.6 s + créditos) |
| Arquivos | `public/alexandria/v3/aulas/m01/video/aula-09.{mp4,webm}`, `aula-09-poster.webp`, `aula-09.pt-BR.vtt` |
| Voz | ElevenLabs `eleven_v4`, voz "Henrique – Clear and Knowledgeable" (`3ULAAai0IVN00DTWA6vF`), a mesma nas nove aulas |
| Legendas | 15 deixas; texto na notação da aula, tempo pela transcrição local da narração (Parakeet), 96 % das palavras da fala casadas |
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

Cartela muda de 4.5 s: *Alexandria · Módulo 01 · Física de Energia e Eletricidade* / *Aula 09* /
título / tema. É aqui que entra a fala gravada do Founder: troca-se a cena `s0` pela gravação e
aumenta-se `T0` em `composicao/gerar.mjs`; narração, cenas e legendas andam juntas. Nenhuma pessoa
foi gerada no lugar dele.

## Blocos

### 00:04.5 · p · Fonte (literal)

> Por que tensão ruim é problema financeiro, não só técnico?

| Origem | Campo | Linha |
|---|---|---|
| `docs/alexandria-v2/extraction/m01/aula-09.json` | aula.pergunta_mapa.pergunta_texto | HTML-fonte L1347 (§ MAP) |

Imagem: A pergunta da aula em Newsreader, termos-chave em óxido.

### 00:08.6 · l · Fonte (literal)

> Qualidade de energia é tema técnico cuja consequência é financeira. Tensão fora da faixa, harmônicos, afundamentos, interrupções — qualquer um deles pode parar uma linha de produção, danificar equipamento, encurtar vida útil de motor.

Fala: *Qualidade de energia é tema técnico cuja consequência é financeira. Tensão fora da faixa, harmônicos, afundamentos, interrupções: qualquer um deles pode parar uma linha de produção, danificar equipamento, encurtar vida útil de motor.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_LEAD['aula-01-09'] | L171 |

Imagem: Os quatro fenômenos da abertura da aula e as três consequências.

### 00:23.9 · d · Recorte (literal, com corte/junção)

> A ANEEL trata qualidade do fornecimento em três dimensões: qualidade do serviço (continuidade), qualidade do produto (tensão) e qualidade comercial.

Fala: *A ANEEL trata qualidade do fornecimento em três dimensões: qualidade do serviço, ou continuidade; qualidade do produto, a tensão; e qualidade comercial.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-09'] · 9.1, parágrafo | L315 |
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-09'] · 9.1, tabela (coluna Dimensão) | L316 |
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-09'] · 9.1, tabela (coluna Dimensão) | L316 |
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-09'] · 9.1, tabela (coluna Dimensão) | L316 |

Fora dos trechos citados (palavras de ligação do roteiro): «e».

Imagem: Três cartões com as dimensões da tabela 9.1 e o que cada uma mede.

### 00:35.0 · c · Recorte (literal, com corte/junção)

> DEC: tempo total médio de interrupção por consumidor no ano (em horas). FEC: número médio de interrupções por consumidor no ano.

Fala: *Na continuidade, a duração equivalente de interrupção mede o tempo total médio de interrupção por consumidor no ano, em horas. A frequência equivalente mede o número médio de interrupções por consumidor no ano.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-09'] · 9.2, tabela, coluna Sigla | L318 |
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-09'] · 9.2, tabela, coluna Sigla | L318 |
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-09'] · 9.2, tabela, linha DEC | L318 |
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-09'] · 9.2, tabela, linha FEC | L318 |

Imagem: Foto real com legenda e crédito na tela; leve aproximação (Ken Burns, 4,5 %). Foto: `m01v3-a09-apagao-madrid-2000.webp` — Gran Vía, Madrid, durante o apagão de 28/04/2025 (Javier Perez Montes, CC BY-SA 4.0).

### 00:47.5 · m · Fonte (literal)

> A ANEEL define faixas para tensão entregue ao consumidor — adequada, precária e crítica — com medição integralizada em intervalos de 10 minutos por pelo menos sete dias consecutivos, totalizando 1.008 leituras.

Fala: *A ANEEL define faixas para tensão entregue ao consumidor, adequada, precária e crítica, com medição integralizada em intervalos de dez minutos por pelo menos sete dias consecutivos, totalizando mil e oito leituras.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-09'] · 9.3, nota (PRODIST Módulo 8) | L322 |

Imagem: Diagrama D-A09-1: linha do tempo de 7 dias com 1.008 traços (um por leitura de 10 min); as faixas adequada/precária/crítica só como nomes (a aula não dá valores).

### 01:01.6 · x · Recorte (literal, com corte/junção)

> Para uma residência, qualidade de energia ruim é incômodo. Para uma indústria, é prejuízo direto: linha de produção parada — perda de receita, atraso de entrega; material em processo perdido; equipamento danificado.

Fala: *Para uma residência, qualidade de energia ruim é incômodo. Para uma indústria, é prejuízo direto: linha de produção parada, perda de receita, atraso de entrega; material em processo perdido; equipamento danificado.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-09'] · 9.4, parágrafo | L324 |
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-09'] · 9.4, lista, itens 1–3 | L325 |
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-09'] · 9.4, lista, item 2 (sem o complemento) | L325 |
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-09'] · 9.4, lista, item 3 (sem o complemento) | L325 |

Imagem: Duas colunas: residência (incômodo) × indústria (prejuízo direto) com os três primeiros itens da lista 9.4.

## 01:16.7 · Créditos

Cartela: texto e números da própria aula; narração em voz sintética (ElevenLabs) lendo o texto da aula; diagramas com os números da aula; fotos: Javier Perez Montes (CC BY-SA 4.0), via Wikimedia Commons.

## Fotos usadas

| Arquivo | Mostra | Autor | Licença |
|---|---|---|---|
| `public/alexandria/v3/aulas/m01/m01v3-a09-apagao-madrid-2000.webp` | Gran Vía, Madrid, durante o apagão de 28/04/2025 | Javier Perez Montes | CC BY-SA 4.0 |

Procedência completa (SHA-1, página do Commons, o que a legenda não pode afirmar): `docs/alexandria-v2/media-provenance.md`, seção "Alexandria v3 — aulas do M01".
