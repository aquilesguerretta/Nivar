# Critics — Peça C · Loop de aprendizagem (página de Módulo + página de Aula)

As regras comuns são as de [`piece-A-critic-briefs.md`](piece-A-critic-briefs.md):
- contexto limpo; só renders e `legend.json`;
- veredito binário;
- uma maior lacuna;
- gates decidem;
- estados ≠ E0 vêm de fixture de rede declarada;
- referências marcadas `parc` ou `bloq` não são UI observada.

**Duas páginas, um veredito por página.** Elas são julgadas separadamente e nunca compensam uma à outra:
- **Módulo** (M01 como padrão-ouro, mais M02, M08, M12, M14 e M16 como prova de que a composição não é molde de um
  módulo só) — mecanismos **C1–C2**.
- **Aula** (M01·A08 como padrão, mais M02·A04 e uma aula de M13) — mecanismos **C3–C10** e a **Regra-mãe** do §4.

**Estados e viewports:** 1440 e 390 em toda rodada; módulo em E1 e E2; aula em E0, E1, E2 e (para C10) E3. Página
longa vem com página inteira **e** filmstrip — a aula não pode ser julgada só pelo 1º viewport.

**Duas âncoras que o Brief e o System aplicam antes de qualquer outra coisa:**

### Teste do §0 — mínimo 3 marcadores

Verificado a 1440, em E2, no 1º ou no 2º viewport. Os seis marcadores: (1) território ou rota com a posição do
learner — *lista de aulas sozinha não conta*; (2) fonte junto a um número ou item de consulta; (3) ato do learner
registrado; (4) previsão antes do resultado, onde a previsão ensina; (5) classe de imagem honesta; (6) gravura ou
cartografia que faz trabalho.

- **O critic nomeia quais marcadores vê.** Menos de três é FAIL de hard gate do §6 ("LMS / SaaS genérico"), não
  ajuste de detalhe.
- **Linha de base do módulo: ZERO.** `captures/B/r02/modulo-E2-1440.png` não tem nenhum dos seis no 1º viewport
  (T32). Um render que mantenha a grade curricular numerada reprova pelo mesmo motivo, com ou sem melhora
  cosmética.
- **Na aula** o mínimo de 3 continua valendo, com duas exceções: o marcador **3 é obrigatório** e o **4 é
  obrigatório quando a aula tem previsão útil**; ambos verificados no filmstrip da aula inteira. Nas 10 aulas sem
  previsão útil (entre elas M13·A06 e M13·A08), o marcador 2 ou o 6 precisa aparecer até o 2º viewport.

### Regra-mãe da aula — seis itens, cada um reprova sozinho

1. instrumento como apêndice depois de toda a prosa;
2. referência mostrada antes da tentativa, onde a tarefa exige tentativa;
3. aula sem ato do learner;
4. conclusão como única ação, ou conclusão apresentada como competência;
5. vídeo, aba ou card no lugar do primeiro ato;
6. exercícios escondidos em aba.

---

## Brief critic — "o módulo orienta e a aula ensina?"

**Julga:** S1, S3; C1–C3; os gates de C4–C6; C7–C10; a Regra-mãe; o teste do §0; a linha "Além do conceito" da
Peça C (a previsão registrada reaparece no instrumento como previsto × calculado; a recuperação repete a pergunta
de uma aula anterior antes de mostrar a resposta antiga).

### Na página de MÓDULO

- **C1 — mission control.** Só com o texto do 1º viewport, a 1440 e a 390, em E1 e E2: por que este módulo importa,
  do que o learner será capaz, onde ele está na rota da trilha e qual é o próximo passo. Faltando qualquer uma das
  quatro, é FAIL de C1.
  - A tese e as capacidades existem literais na fonte (M01: §00 e os 7 itens de "Resultado esperado"). Se a página
    diz "ainda não disponível" onde a extração existe, é ausência desonesta, não estado honesto.
  - Sem extração ou derivação (§9, P11), a linha "ainda não disponível" é legítima e a peça fica **aguardando
    dependência**, não FAIL.
- **Rota, não lista.** Existe um trecho da carta com as estações do módulo e a posição do learner desenhada? Uma
  lista de aulas ao lado não substitui — e não conta como marcador 1.
- **Progresso nas camadas de S3** (Percorrido · Praticado · Demonstrado). Nenhum número finge competência; nenhum
  percentual sem escopo.
- **Critério do módulo.** Nunca aparece como cumprido só porque a avaliação foi aprovada. Critérios orais ou
  cronometrados aparecem como "atividade recomendada" (P14). "Concluído" nunca vira "Aprovado" nem "Dominado"
  (P18). O quiz é resultado de avaliação, nunca Demonstrado (P5), e o critério literal aparece **antes**.
- **C2 — tipos de objeto distinguíveis:** aulas · instrumentos e laboratório · caso · experiência jogável ·
  revisão · avaliação · fontes e léxico. Nada vira "recursos" anexado no fim.
  - Os aparatos do roteiro entram **na ordem da jornada** (no M01 são 10, hoje invisíveis), com glifo e verbo iguais
    aos do mapa.
  - O laboratório é um lugar no módulo, não um link de rodapé.
  - Exercícios da Revisão visíveis **sem trocar de aba**; exercício sem vínculo com aula fica na Revisão (P9).
  - Experiência jogável: linha de metadado "em desenho", **sem controle e sem destino** (P16, P25). Nunca card
    vazio, nunca "sem experiência".
- **Horas e eixos.** "4 – 6 horas" é literal da fonte e precisa aparecer; eixos são `null` na fonte e entram como
  "não declarado" (S4), nunca inventados.
- **Uma só ação principal** (S1), com rótulo que nomeia objeto e motivo e destino de estudo real.
- **Coerência de dado.** Os números batem com a Home, com Trilhas e com o mapa no mesmo estado. Divergência entre
  telas é gate de dado falso.
- **Teste do §0.** Nomear os marcadores presentes. Menos de três reprova. Lembrar que a linha de base é zero.

### Na página de AULA

- **C3 — orientar antes de ler.** Antes de qualquer leitura, o learner sabe o que a aula resolve (pergunta ou
  objetivo com verbo observável, derivado da fonte). Em seguida vem o primeiro ato ou a leitura. Nenhum cartão de
  vídeo sem vídeo, vídeo nunca acima do primeiro ato, nenhuma ausência no topo (T22). A 390, a pergunta e o caminho
  para o primeiro ato ficam no 1º viewport.
  - **Previsão.** Onde o erro de previsão ensina, a aula pede previsão registrada com os valores do cenário na
    pergunta (na A08: "usina solar de 100 MW, 1 ano: fator de capacidade, %"). Instrumento exploratório ou de
    sandbox pode abrir por outro ato — meta a alcançar, comparação, condição a encontrar.
- **C4 (gate) — explicação no fluxo.** A explicação visual fica junto do parágrafo que explica; termos do léxico
  ligam à definição sem sair da aula; nenhuma coluna lateral fixa.
- **C5 (gate) — instrumento como etapa.** No ponto da prosa que o invoca, com pergunta, controles rotulados com
  unidade, saídas legíveis e fonte. Com previsão: o learner se compromete antes de ver o resultado, vê **previsto ×
  calculado no mesmo cenário**, e esse quadro fica visível enquanto explora. "Dentro"/"fora" só com tolerância real
  (P6); sem tolerância, autoavaliação em três níveis. Se o nome promete uma forma, o instrumento **desenha** a
  forma (M02·A04: curva líquida com curva).
- **C6 (gate) — visualização útil.** Toda figura da aula tem trabalho cognitivo nomeável e desenha a relação que a
  aula afirma. Nenhuma figura decorativa na coluna da aula.
- **C7 — tentativa antes da referência.** A referência só aparece depois da tentativa registrada; não existe
  "Revelar gabarito"; nenhuma cor marca certo ou errado — estado por silhueta e palavra. O véu cobre **tudo** que
  permite ler ou calcular a referência: controle, linha de fonte, rótulo, `aria-label`, célula vizinha.
- **C8 — aplicação e jogos.** Nada aparece abaixo da decisão antes do registro; consequências em ≥ 2 dimensões, sem
  escore único; quiz temático nunca é jogo; M08 é "Exercício de decisão" até o game pass (P4).
- **C9 — ato autêntico.** Toda aula tem ao menos um ato que exercita o **mecanismo central** da aula. O fim é
  registro "Percorrido · Praticado · Serve a [capacidade/critério ou 'ainda não disponível']", nunca "concluída".
  Em E0 o ato funciona e uma linha informa que registrar exige conta. Antes do ato existe "Registrar leitura sem
  prática". "Explique com suas palavras" só como fallback — um módulo não fecha a maioria das aulas em texto
  aberto. A aula de M13 (sem instrumento nem exercício portado) é onde isso se prova: o ato precisa ser autêntico
  **e** derivado da fonte.
- **C10 — recuperação e próximo passo.** O próximo passo depende do que aconteceu (E2 × E3): "não atende" → "Rever
  [seção]"; leitura sem prática → "Fazer o ato desta aula"; demais → "Próxima · [código — título]"; última aula →
  Revisão → Avaliação com o critério mostrado antes. A recuperação traz a origem visível e **não mostra a resposta
  anterior antes da nova tentativa**.
- **Regra-mãe:** percorrer os seis itens e dizer qual disparou, se disparou.
- **Arquétipo.** O corpo é o do arquétipo do **ato principal**, não do assunto
  ([`../estudos/aulas/SISTEMA.md`](../estudos/aulas/SISTEMA.md) §1). Variedade sem mudança de mecanismo é
  inconsistência, e vira a maior lacuna.

**Ignore o gosto estético**, a não ser que ele impeça o trabalho.

---

## System critic — "o sistema foi respeitado?"

**Julga:** S2, S4–S7; §6; §7, com os mesmos materiais e a mesma tabela de checagem da Peça A
(`captures/token-swatches.png` e `legend.json`).

**Do tronco de SISTEMA.md (T1–T14), o que se vê no render** — vale para as duas páginas onde couber:

| Elemento | O que verificar |
|---|---|
| T1 | Localizador "Trilha › Módulo › Aula NN" com nomes iguais aos do catálogo (P8, P24); item atual não é link; sobrevive à rolagem, ≈ 32 px; sem sidebar nem rail; "Sumário da aula" é gaveta rotulada e começa fechada |
| T3 | Máquina de estados única em todos os atos: vazio → registrado → comparação → próximo; "N de M atos" e "Ato k de M" conferem |
| T4 | Bloco de fonte a ≈ 24 px abaixo de toda figura, tabela ou instrumento com número factual, **antes** da prosa que interpreta; ficha em até 2 ações; rótulos fixos de P19/P20 e "verificado em DD/MM/AAAA" |
| T5 | Camada Alexandria em voz de aparato (versalete), nunca com rótulo de fonte; figura sem escala leva "esquemático" |
| T6/T7 | Termo → prévia (1 ação) → verbete (2 ações), com volta à mesma posição; três níveis em disclosure no ponto de uso, nunca em aba nem no fim |
| T8 | Coluna de leitura de 60–72 caracteres, 16–18 px; ≈ 1.350 px sem ato a 1440 é o teto (heurística: trecho maior sem ato é lacuna nomeada) |
| T12 | Ausência em linha de metadado, sem aparência de controle: "em desenho" · "ainda não disponível" · "não declarado". Nunca no topo, nunca como zero, nunca vocabulário interno |
| T13 | Alvos ≥ 24 px (≥ 44 px na ação principal a 390); texto ≥ 11 px **renderizado**, inclusive rótulo dentro de viewBox; foco visível e nunca sob o header; figura com versão vertical própria a 390, nunca miniatura da de 1440; movimento reduzido chega ao mesmo estado final |
| T14 | Toda imagem declara a classe e passa no teste de remoção; nenhuma imagem acima do primeiro ato; vídeo nunca é herói; imagem gerada nunca nomeia lugar real |

**Invariantes entre arquétipos (SISTEMA §2.5).** Sobrepor capturas de três arquétipos diferentes: abertura,
componente de ato, bloco de fonte, voz da camada, registro e próximo passo têm a mesma forma, a mesma posição
relativa e o mesmo rótulo. Um palco por aula; larguras na escala da casa (leitura ≈ 680 px, palco ≈ 840–1.000 px);
glifos de estado da família do S3, nunca uma família própria do módulo.

**Densidade (S7):** Módulo 25–45; Aula 12–25. Fora da faixa é heurística, não gate — mas é nomeada.

**Tiques da peça C** (lista viva em [`../briefs/varredura-anti-ia.md`](../briefs/varredura-anti-ia.md)):

| Tique | O que reprova |
|---|---|
| **T32** | Página de módulo como grade curricular numerada (número · título · legenda · fio entre todas · estado à direita). É o hard gate do §6, via teste do §0 — reprova sozinho |
| **T4** | Coluna ou chip de estado colorido repetido linha a linha: semáforo com outra paleta. Estado é palavra em tinta mais a marca da rota (fio cheio / meia marca / fio pontilhado); terracota volta a ser pontuação rara |
| **T11** | Faixa de acento vertical marcando item ativo, no módulo ou na aula: estado dito só por cor. A posição usa a flâmula do jogo de marcas aprovado, a mesma do globo, do localizador e da nav |
| **T23** | Título de conteúdo em caixa alta total, a 390 em especial. Conteúdo é serifa em caixa alta e baixa; quem fala em versalete é a identidade |
| **T22** | Ausência como caixa de borda pontilhada ("vídeo em produção"; "experiência jogável · em desenho" repetido). A ausência é uma linha de aparato, e o que é igual em todos os módulos é dito uma vez no aparato da trilha |
| **T26** | Volta duplicada: seta de retorno logo abaixo de um localizador que diz o mesmo. Uma rota só |

Mais o **recorte-e-cola** elemento por elemento em tudo que a rodada criar, e as lições L1–L9 de §2.6 do SISTEMA
(figura renderizada duas vezes por largura; véu furado por controle, linha de fonte ou tabela vizinha; numeração
que não fecha com o aparato; unidade só no placeholder; figura lateral empurrando o parágrafo seguinte).

**Hard gates do §6 a confirmar explicitamente:** LMS/SaaS genérico · sidebar permanente · dado falso ou mock como
real · ausência desonesta · imagem enganosa · mobile e acessibilidade · aula sem aprendizagem (Regra-mãe) · jogo
falso · competência falsa · consulta morta · controle inerte · materialidade quebrada · contaminação NIVAR G2 /
Portal / Terminal · gênero ou skin errados · cópia literal do North Star.

**`legend.json`:** `horizontalOverflow`, `minFontPx`, `truncatedText`, `smallTargets`, `overflowingElements`,
`media`, `consoleErrors`.

---

## Craft critic — "está autoral, ou gerado?"

**Julga:** composição e identidade de C4–C6 (a coluna editorial, a prancha do instrumento, a visualização) e a
qualidade de mídia (§7 M5, M7); registra as heurísticas quebradas e se o resultado ficou claramente mais forte.

**Método cego:** pares X/Y, sem dizer qual é o render em julgamento. Para cada par, qual é mais forte como página
de um produto educacional autoral, e por quê, em termos observáveis (hierarquia, composição, detalhe, ritmo,
presença, identidade). Depois do mapeamento revelado: veredito e **a maior lacuna**.

**Pares:**
1. Render × North Star aprovado. Piso, não teto: PASS exige igual ou mais forte em presença e identidade, sem
   copiar a composição (e sem disparar o gate de cópia literal).
2. Render × Atlas atual (a referência interna de craft mais forte).
3. **Módulo:** render × `captures/B/r02/modulo-E2-1440.png`. **Aula:** render × a aula atual. Nos dois casos, o
   render precisa ser claramente mais forte.
4. Render × a rodada anterior desta peça, quando existir.

**Checar ainda:**
- O módulo lê como **mission control** ou como sumário de curso? O trecho da carta tem presença de atlas **e**
  função — mostra as estações e a posição —, ou é ilustração no topo?
- Com os títulos cobertos, os módulos se distinguem entre si? A identidade gravada por módulo vem da rodada 3 da
  Peça B; se a série ainda não existir, este ponto fica **aguardando dependência**, não FAIL.
- Em cinza, os estados se distinguem sem cor?
- A aula parece editorial e composta, ou um documento longo com widgets colados? A prancha do instrumento é um
  palco, ou um formulário?
- A figura desenha a relação, ou enfeita o parágrafo? Toda imagem faz trabalho nomeado (M7) — o módulo pode
  perfeitamente não ter nenhuma além da carta.
- A 390, é composição própria ou desktop espremido? A figura tem versão vertical própria?
- A 1920 e a 3440, nada piora em relação a 1440.
- A linguagem é coerente com a Home, as Trilhas e o mapa (globo, gravura, flâmula, letreiro de carta)?
- O render parece autoral ou gerado? Se fosse re-skinnado, venderia como LMS genérico?
