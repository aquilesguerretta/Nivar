# Peça A · Rodada 3 — lacuna a corrigir: o globo que trabalha precisa ser a peça mais bela

O brief-base continua valendo ([`piece-A.md`](piece-A.md)), e a diretriz "imagem primeiro" também
([`piece-A-r02.md`](piece-A-r02.md)).

## Resultado da rodada 2 (críticos de contexto limpo)

| Critic | Veredito | Maior lacuna |
|---|---|---|
| Brief | PASS | O globo faz só metade do trabalho: em E0, E1 e E2 mostra só os territórios I e II. Ele mede ~215px, e a figura domina o teste de miniatura |
| System | FAIL | A 390, o localizador corta rótulos ("M01 Físic...") e reduz as etapas intermediárias a "…" (S7, S5, §6) |
| Craft | FAIL | O globo é a peça mais fraca: esfera navy lisa, cara de vetor, com uma mancha creme sem forma, colada numa gravura rica. Ele não distingue E0 de E2. No par r01 × r02, 2 de 3 juízes cegos preferiram a carta da r01, que carregava o currículo. O North Star foi vencido só por margem leve |

Comparação cega (3 juízes: presença, composição, acabamento):
- **Contra a baseline r00:** r02 venceu com margem clara nos três.
- **Contra o North Star:** r02 venceu, mas em geral por margem leve.
- **Contra o Atlas atual:** 2 × 1 para r02.
- **Contra a r01:** 2 × 1 para a r01.

**O que o Founder aprovou na r02:** a direção Titã + gravura + faixa navy. Ela fica.

## A maior lacuna — o globo do currículo

O globo carrega a posição do learner, e é justamente o objeto mais pobre da tela. Na rodada 3 ele precisa ser, ao
mesmo tempo, **o objeto mais belo e o mais informativo do hero**.

1. **Material coerente com a gravura.** O globo precisa ler como gravura a buril, como a figura e o céu, e não como
   esfera lisa com mancha.
   - Linguagem honesta: **cartografia imaginária**, na tradição das cartas de terras inventadas (ex.: *Utopiae Typus*).
     São ilhas inventadas com relevo em perfil gravado, rios, florestas e povoados (as estações), e a rota como
     estrada pontilhada.
   - Nenhuma massa pode lembrar continente real. O globo do Atlas (Natural Earth) continua sendo a única imagem
     geográfica da Home (A4).
2. **Escala dominante.**
   - **A 1440:** diâmetro ≈ 45% ou mais da altura útil do hero. O globo é o centro de gravidade, e a figura o sustenta.
     No teste de miniatura, a região dominante é **globo + retomada** (S1).
   - **A 390:** o objeto ocupa ≈ 25% ou mais da altura do 1º viewport, depois da ação (A2).
   - Pode exigir outra prancha, com a esfera monumental e a figura vista de mais perto, mantendo o estilo e a figura
     que o Founder aprovou.
3. **Trabalho visível no objeto, em todos os estados.**
   - Os três territórios aparecem e são nomeados no objeto (I, II, III), com o atual à frente.
   - As estações visíveis têm código legível (overlay HTML) e a rota tem estados sem depender de cor: percorrido ×
     atual × a seguir, por silhueta e traço.
   - E0 e E2 são distinguíveis no objeto:
     - E0 mostra o ponto de partida;
     - E2 mostra o trecho percorrido até a posição atual;
     - E2b mostra a Trilha I percorrida e a II em curso.
   - Granularidade: onde o dado de aula existir, a posição dentro do módulo pode aparecer (ex.: "Aula 08").
     Nunca invente contagem.

## Entram junto, porque são gates

1. **Localizador a 390 sem nenhum rótulo cortado** (S7, S5, §6).
   - Nada de reticências.
   - Nomes iguais ao dado; pode quebrar linha ou recompor (ex.: linha "‹ M01 · Física de Energia e Eletricidade"
     mais a linha do item atual).
   - Alvos ≥ 24px.
   - A regra do brief r02 ("só os intermediários podem ser abreviados") **está revogada**: o gate do bar prevalece.
2. **Alvos.**
   - Links de conteúdo ≥ 24px de altura (hoje "Ver as três trilhas lado a lado →" e "Abrir o Atlas →" medem 21px).
   - Nav global e conta a 390 ≥ 44×44, com alvo visível.
   - `legend.json → smallTargets` precisa voltar vazio nas rotas da Home.

## Composição (heurísticas nomeadas pelos juízes)

- **Sem redundância.**
  - O título da aula aparece uma vez. Cartão e ação principal se fundem, e o rótulo da ação continua nomeando objeto
    e motivo (S1).
  - A lista dos três territórios não aparece três vezes no 1º viewport. A caixa-legenda flutuando sobre o céu sai; a
    declaração honesta da figura ("Modelo do currículo, não mapa geográfico · Gravura gerada, não documental") vira
    legenda junto à imagem, sem cobrir a gravura.
- **A coluna de texto participa do mundo.** Página e imagem não podem ler como duas metades. O builder escolhe o meio
  (escala e voz do H1, horizonte compartilhado, atmosfera imperceptível atrás do texto, etc.) e declara.
- **No máximo uma região de ênfase navy grande por viewport**, ou uma justificativa de que ficou mais forte.
- **Degradês:** esmaecimento só dentro da imagem, nunca como gradiente de UI em CSS. Declare na legenda.

## Detalhes

- **E0:** a retomada diz "ponto de partida", não "não iniciada" (não há registro que sustente um estado).
- **E2b:** corrigir "1 dia seguidos" (concordância).
- **`document.title` com um formato só:** "<local> — Alexandria"; na Home, "Alexandria — Atlas do conhecimento em
  energia".
- **Tab:** o foco do nó M01 não pode invadir o rótulo do M02.
- **Quadros brancos antes do primeiro paint** (`account-load` f00/f01): o fundo do documento antes do JS pertence ao
  `index.html` (ARCHITECT). Registrar como dependência, sem editar.

## Harness (orquestrador)

- **Novas capturas:** `home-E0-1440-scroll`, `home-E0-390-scroll`, `home-E1-390`, `shell-modulo-E2-390`; Tab com 30
  paradas.
- **Novas medidas na `legend.json`:**
  - `truncatedText`: reticências literais ou texto recortado;
  - `smallTargets`: < 24px; nav global < 44px abaixo de 768;
  - `minFontPxShell` e `minFontPxMain`.

## Fora da Peça A (registrado para B/C/D)

- **Página de trilha:** diz "M01 Concluído · M02 Aula 4 de 10" com a mesma fixture E2 (divergência entre telas,
  Peça B).
- **Aula M01·A01 a 390:**
  - tabela de 494px;
  - `aula_iniciada` emitido para visitante, com 401 no console;
  - texto de 10px em aula e glossário (Peças C e D).
