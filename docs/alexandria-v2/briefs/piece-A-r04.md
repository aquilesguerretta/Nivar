# Peça A · Rodada 4 — o globo precisa ser gravura, não infográfico sobre gravura

Continuam valendo os briefs anteriores: [`piece-A.md`](piece-A.md), [`piece-A-r02.md`](piece-A-r02.md) e
[`piece-A-r03.md`](piece-A-r03.md).

## Resultado da rodada 3

Na comparação cega, 3 juízes (presença, composição e acabamento) julgaram seis pares:

| Par | Resultado |
|---|---|
| r03 × North Star, em E2 e em E0 | **3 × 0, margem clara** nos dois |
| r03 × Atlas atual | 3 × 0, margem clara |
| r03 × r00 (1440) | 3 × 0, margem clara |
| r03 × r00 (390) | 3 × 0 (2 claras, 1 leve) |
| r03 × r02 | 2 × 1, margem leve |

Vereditos dos críticos:

| Critic | Veredito | Maior lacuna |
|---|---|---|
| Brief | FAIL | A 390, selo "você está aqui" e marcador nunca aparecem juntos: o selo fica sob a barra de abas. O Titã ocupa ~640px sem função. Em E0, o rótulo III é cortado na borda |
| System | FAIL | A5: salto de layout no carregamento, quando as fontes trocam (f02→f03). A ação principal desce ~75px e o selo de posição muda de lugar. Também: 3440 pior que 1920; prancha única marcada "explicação" contendo atmosfera; legenda quase ilegível |
| Craft | FAIL | O globo não pertence à gravura: parece esfera navy lisa na escala de exibição, com ~20 etiquetas brancas retangulares (UI sobre ilustração), e os continentes não se leem como terra. A 3440 a faixa de legenda corta o rosto do Titã. Contra a r02, a margem é só leve |

## A maior lacuna — acabamento do globo (material + letreiro)

**Material.** O globo precisa ler como gravura **na escala em que é exibido** (~400 CSS px a 1440, ~250 a 390,
~700 a 3440), e não só no arquivo de 2000px.
- **Traço calibrado para a exibição:** passo de linha de ≈ 3–4 px de dispositivo no tamanho final. Renderize por
  tamanho de exibição, sem reduzir um único arquivo grande.
- **Mar:** uma direção forte é mar navy como **gravura de linhas sobre o papel**, com o papel aparecendo entre os
  traços, em vez de navy chapado. A identidade navy continua.
- **Sombra e terra:**
  - terminador em contra-hachura visível;
  - luz coerente com a prancha;
  - terra com relevo sombreado legível: costas com water-lining, montanhas em perfil, rios e florestas visíveis
    na escala.

**Letreiro cartográfico, não etiquetas.**
- Nomes de território e códigos de estação escritos como numa carta antiga: tipografia da casa (Cinzel ou Lora
  versalete) direto sobre o mapa, com halo de papel ou navy para contraste (`paint-order`/stroke), sem caixas
  retangulares.
- Nomes de território podem seguir o arco da ilha (SVG `textPath`, que é dado exato).
- **Hierarquia:**
  - território > estação atual > estações do território atual > demais;
  - pode haver menos rótulos se continuar valendo "estações visíveis têm código legível" (ex.: código ao lado do
    disco, 11px com halo).
- **Posicionamento determinístico por vista e por largura.** Tabela fixa ou algoritmo com restrições:
  - nada sai da moldura;
  - nada cobre marcador;
  - nada fica sob a barra de abas a 390.
- **Selo de posição:** sai do navy chapado para o registro da carta. Precisa ser a coisa mais legível do objeto.

## Entram junto (gates)

1. **A5 — carregamento sem salto.**
   - Fontes com fallback de métrica ajustada (`size-adjust`, `ascent-override`…) e/ou preload.
   - Caixa do objeto reservada.
   - Rótulos posicionados só com métrica final, ou com posição que não depende da fonte.
   - Verificação: `account-load-E2-1440` f02→f05 sem deslocamento da ação principal nem do selo.
   - Os quadros brancos antes do JS dependem do `index.html` (ARCHITECT): registrar, não editar.
2. **A2 a 390.**
   - No 1º viewport: marcador de posição + selo + nome do território atual, inteiros, acima da barra de abas.
   - Nenhum rótulo cortado na borda.
   - Objeto ≈ 25–40% do viewport; a figura a 390 é recortada (cabeça e ombros), sem torso longo sem função.
   - "Seu registro" até o 2º viewport; ganchos de Glossário e Biblioteca até o 3º.
3. **§7 M4 — classes separadas.**
   - Prancha (atmosfera), globo (explicação) e mãos à frente (atmosfera) viram camadas/imagens separadas, cada uma
     com `data-media-class` própria.
   - Na rota, "Sobre esta figura" (disclosure ou linha) com créditos.
   - Legenda de classe legível: ≥ 12px e contraste ≥ 4,5:1.
4. **S7 — larguras grandes.**
   - A 1920 e a 3440 nada piora em relação a 1440: sem faixa vazia > 30%, sem corte do rosto do Titã, letreiro
     proporcional.
   - A prancha pode ganhar extensão lateral (outpaint/reframe) para ocupar a largura com paisagem gravada.

## Oportunidade (Founder: "imagens verdadeiras são muito boas")

"Sobre esta figura" pode mostrar as fontes reais da ideia, em domínio público: a *Utopiae Typus* de Ortelius (a
tradição de cartas de terras inventadas que justifica o globo não geográfico) e o frontispício do *Atlas* de Mercator
(a figura que dá nome aos atlas). Arquivos, licenças e créditos estão em
`../media-lab/fontes-reais/atlas-gravuras-identidade/` (catálogo em `../media-lab/fontes-reais/CATALOGO.md`). Use só
as versões recortadas sem régua ou carimbo, com o crédito exato. Nada disso pode poluir o 1º viewport.

## Detalhes

- Foco do "PROGRESSO" com respiro (o anel encosta nas letras em `tab-f08`).
- Selo "ponto de partida" em E0 com tamanho à altura do momento (hoje some entre 01 e 02).
- A 1280, o selo não pode disputar espaço com 06/07 nem com o rótulo II.
- **Decisões do Founder de 2026-09-16** ([`../decisoes/2026-09-16-ambiguidades-de-conteudo.md`](../decisoes/2026-09-16-ambiguidades-de-conteudo.md)),
  aplicáveis à Home:
  - **P21:** o gancho de Glossário exibe "Fator de capacidade (FCap)", nunca "(FC)". A troca é na exibição: o
    verbete da fonte continua literal no dado.
  - **P24:** nenhuma ocorrência de "GridAlpha" no shell nem na Home.
  - **P18:** nenhum "Aprovado" ou "Dominado"; "Concluído" só para requisitos de consumo cumpridos.
  - **P22:** contagens sempre derivadas da coleção.

## Fora da Peça A (registrado)

- **Peça B:** trilha e módulo divergem da Home (M01 "Concluído", M02 "Aula 4 de 10", "9 de 9 concluídas"); títulos em
  caixa alta total.
- **Peça C:**
  - `aula_iniciada` duplicado, e emitido para visitante (401);
  - texto de 10px;
  - alvos pequenos no módulo.
- **Peça D:** o glossário mostra "§ LEX" e "nenhuma aula extraída trata o termo" (linguagem interna, S4).
