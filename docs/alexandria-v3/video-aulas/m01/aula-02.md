# M01 · Aula 02 — vídeo-aula de abertura

**Sete símbolos. Toda a linguagem.** · As sete unidades essenciais
Título e tema: `src/lib/data/alexandria-modulo-01-content.ts`, MODULO_01_AULAS[1].title / subtitle, L369.

| | |
|---|---|
| Duração | 103.6 s (abertura muda 4.5 s + narração 93.5 s + créditos) |
| Arquivos | `public/alexandria/v3/aulas/m01/video/aula-02.{mp4,webm}`, `aula-02-poster.webp`, `aula-02.pt-BR.vtt` |
| Voz | ElevenLabs `eleven_v4`, voz "Henrique – Clear and Knowledgeable" (`3ULAAai0IVN00DTWA6vF`), a mesma nas nove aulas |
| Legendas | 20 deixas; texto na notação da aula, tempo pela transcrição local da narração (Parakeet), 86 % das palavras da fala casadas |
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

Cartela muda de 4.5 s: *Alexandria · Módulo 01 · Física de Energia e Eletricidade* / *Aula 02* /
título / tema. É aqui que entra a fala gravada do Founder: troca-se a cena `s0` pela gravação e
aumenta-se `T0` em `composicao/gerar.mjs`; narração, cenas e legendas andam juntas. Nenhuma pessoa
foi gerada no lugar dele.

## Blocos

### 00:04.5 · p · Fonte (literal)

> O que volt, ampere, watt, kVA e kVAr realmente medem?

Fala: *O que volt, ampere, watt, quilovolt-ampère e quilovolt-ampère reativo realmente medem?*

| Origem | Campo | Linha |
|---|---|---|
| `docs/alexandria-v2/extraction/m01/aula-02.json` | aula.pergunta_mapa.pergunta_texto | HTML-fonte L1340 (§ MAP) |

Imagem: A pergunta da aula em Newsreader, termos-chave em óxido.

### 00:11.5 · v · Fonte (literal)

> Volt (V) mede tensão elétrica: a diferença de potencial que empurra a corrente pelo condutor.

Fala: *Volt mede tensão elétrica: a diferença de potencial que empurra a corrente pelo condutor.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-02'] · 2.1 | L201 |

Imagem: Três cartões: V, A, W, com a definição da aula; a fórmula P = V × I no terceiro.

### 00:17.4 · a · Fonte (literal)

> Ampere (A) mede corrente elétrica: o fluxo de carga elétrica passando pelo condutor por segundo.

Fala: *Ampere mede corrente elétrica: o fluxo de carga elétrica passando pelo condutor por segundo.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-02'] · 2.2 | L205 |

Imagem: continua a cena anterior (próximo passo do diagrama).

### 00:23.6 · w · Recorte (literal, com corte/junção)

> Watt (W) mede potência. Em corrente contínua (e como aproximação inicial em corrente alternada), a relação é direta: P (W) = V (volts) × I (amperes).

Fala: *Watt mede potência. Em corrente contínua, e como aproximação inicial em corrente alternada, a relação é direta: potência é igual a tensão vezes corrente.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-02'] · 2.3, parágrafo | L207 |
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-02'] · 2.3, fórmula | L208 |

Imagem: continua a cena anterior (próximo passo do diagrama).

### 00:34.2 · c1 · Fonte (literal)

> Em 220 V × 10 A, a potência aproximada é 2.200 W = 2,2 kW. Ligando por 5 horas: 11 kWh.

Fala: *Em duzentos e vinte volts vezes dez amperes, a potência aproximada é dois mil e duzentos watts, igual a dois vírgula dois quilowatts. Ligando por cinco horas: onze quilowatts-hora.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | INSTRUMENTOS_MODULO_01 · inst-02 · note | L68 |

Imagem: Diagrama D-A02-2: 220 V × 10 A → 2.200 W → 2,2 kW → × 5 h → 11 kWh; depois a cadeia V × A → W → kW → kWh × tarifa → R$.

### 00:44.3 · c2 · Fonte (literal)

> Essa cadeia V × A → W → kW → kWh × tarifa = R$ é a espinha física da fatura elétrica.

Fala: *Essa cadeia, de volts vezes amperes a watts, quilowatts, e quilowatts-hora vezes tarifa, em reais, é a espinha física da fatura elétrica.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | INSTRUMENTOS_MODULO_01 · inst-02 · note | L68 |

Imagem: continua a cena anterior (próximo passo do diagrama).

### 00:55.9 · t · Recorte (literal, com corte/junção)

> No Brasil, você verá tensões em escalas muito diferentes ao longo da cadeia elétrica: de 127 / 220 V, baixa tensão residencial e comercial, a 230 kV +, transmissão de alta tensão.

Fala: *No Brasil, você verá tensões em escalas muito diferentes ao longo da cadeia elétrica: de cento e vinte e sete e duzentos e vinte volts, na baixa tensão residencial e comercial, a duzentos e trinta quilovolts ou mais, na transmissão de alta tensão.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-02'] · 2.1, parágrafo 2 | L202 |
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-02'] · 2.1, tabela, 1ª e 7ª linhas | L203 |
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-02'] · 2.1, tabela, 7ª linha | L203 |

Fora dos trechos citados (palavras de ligação do roteiro): «de a».

Imagem: Diagrama D-A02-1: as sete faixas da tabela 2.1 em eixo logarítmico (100 V a 1 MV); "230 kV +" termina em seta aberta. Foto das torres ao lado. Foto: `m01v3-a02-torres-itaipu-2000.webp` — Linha de transmissão em Foz do Iguaçu (PR), com Itaipu ao fundo (enioprado, CC BY-SA 3.0).

### 01:10.5 · r1 · Fonte (literal)

> Em corrente alternada (que é o padrão da rede pública), a história é mais sutil. Nem toda potência que circula entre rede e instalação se converte em trabalho útil.

Fala: *Em corrente alternada, que é o padrão da rede pública, a história é mais sutil. Nem toda potência que circula entre rede e instalação se converte em trabalho útil.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-02'] · 2.5, parágrafo 1 | L214 |

Imagem: Diagrama D-A07-1: triângulo em escala 800 : 480, catetos desenhados um a um.

### 01:20.0 · r2 · Fonte (literal)

> Essas três grandezas formam um triângulo retângulo: kW e kVAr são os catetos, kVA é a hipotenusa. kW é o que vira produção; kVAr ocupa a rede sem virar produção; kVA é o que a rede precisa dimensionar.

Fala: *Essas três grandezas formam um triângulo retângulo: quilowatt e quilovolt-ampère reativo são os catetos, quilovolt-ampère é a hipotenusa. Quilowatt é o que vira produção; o reativo ocupa a rede sem virar produção; quilovolt-ampère é o que a rede precisa dimensionar.*

| Origem | Campo | Linha |
|---|---|---|
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-02'] · 2.5, parágrafo 2 | L216 |
| `src/lib/data/alexandria-modulo-01-content.ts` | MODULO_01_CORPO['aula-01-02'] · 2.5, parágrafo 2 | L216 |

Imagem: continua a cena anterior (próximo passo do diagrama).

## 01:38.6 · Créditos

Cartela: texto e números da própria aula; narração em voz sintética (ElevenLabs) lendo o texto da aula; diagramas com os números da aula; fotos: enioprado (CC BY-SA 3.0), via Wikimedia Commons.

## Fotos usadas

| Arquivo | Mostra | Autor | Licença |
|---|---|---|---|
| `public/alexandria/v3/aulas/m01/m01v3-a02-torres-itaipu-2000.webp` | Linha de transmissão em Foz do Iguaçu (PR), com Itaipu ao fundo | enioprado | CC BY-SA 3.0 |

Procedência completa (SHA-1, página do Commons, o que a legenda não pode afirmar): `docs/alexandria-v2/media-provenance.md`, seção "Alexandria v3 — aulas do M01".
