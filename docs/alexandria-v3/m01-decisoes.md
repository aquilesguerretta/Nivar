# M01 — decisões de conteúdo de 15/11/2026 aplicadas

Base: [`DECISOES-2026-11-15.md`](DECISOES-2026-11-15.md). Fonte de fato: só `docs/alexandria-v2/extraction/m01/`.
Frase nova entra como **voz da Alexandria**, rotulada na tela ("Nota da Alexandria · …"), e só reorganiza o que a
fonte já diz. Cada troca no texto da fonte está registrada também em `tools/alexandria-dados/verificar-porte-m01.mjs`
(`EDITORIAIS`), que a aplica do lado da extração e conta: nada da fonte some sem nome.

## Texto das aulas

| # | Pendência | Onde | Antes (fonte) | Depois | Registro |
|---|---|---|---|---|---|
| 1 | **QA-M01-A06** · Grupo A × AS | A06, tabela 6.1, linha Grupo A | "Alta e média tensão (≥ 2,3 kV)" | "Alta e média tensão (**em regra**, ≥ 2,3 kV)" | `EDITORIAIS`: QA-M01-A06 |
| 1 | idem | A06, depois da tabela 6.1 | — | Nota da Alexandria · a exceção do AS: "Em regra, o Grupo A começa em 2,3 kV. A exceção está na própria tabela de subgrupos da seção 6.2: o AS, atendido por rede subterrânea, fica abaixo de 2,3 kV e ainda assim pertence ao Grupo A." | nota nova (acréscimo); nenhum número novo |
| 2 | **QA-M01-A07** · "os outros 15% são reativos" | A07, 7.3 | "…apenas 85% da potência aparente vira trabalho útil; os outros 15% são reativos circulando pela rede. FP baixo…" | "…apenas 85% da potência aparente vira trabalho útil. FP baixo…" | `EDITORIAIS`: QA-M01-A07 |
| 2 | idem | A07, depois do parágrafo 7.3 | — | Nota da Alexandria · leitura do triângulo: os 15% que faltam não são a reativa; kW e kVAr são catetos, kVA a hipotenusa (combinação vetorial, Aula 02 §2.5); com FP 0,85 a reativa é ≈ 53% da aparente (sen(arccos 0,85) ≈ 0,53) | nota nova; o 53% é calculado do triângulo da própria aula |
| 4 | **QA-M01-A04** · "exponencial" | A04, 4.1 | "O exponencial é o que muda tudo." | "O quadrático é o que muda tudo." | `EDITORIAIS`: QA-M01-A04 |
| 4 | idem | nota do INST·03 | "Esse comportamento exponencial…" | "Esse comportamento quadrático…" | idem |
| 5 | **Q03 / D09** · vocabulário interno | A05, nota "Onde isso entra no produto" | "Promessa sem validação fere a Trava 4 do War Room." | "Promessa sem validação fere uma trava operacional da NIVAR." | `EDITORIAIS`: Q03 / D09 |
| 5 | idem | prova do módulo, explicação da Q10 | "…fere a Trava 4 do War Room." | "…fere uma trava operacional da NIVAR." | `gerar-avaliacao.mjs` (troca Q03, 1 ocorrência) e `verificar-avaliacao.mjs` (mesma troca do lado da extração) |
| Q02 | nome do módulo seguinte | checklist do módulo, introdução (aparece na A09 desde `bb6e44b`) | "…pronto para o Módulo 02 — A Rede Elétrica." | "…pronto para o Módulo 02 — Como Funciona uma Rede Elétrica." (nome do catálogo, `alexandria-blocks.ts`, `bloco-02`) | `gerar-avaliacao.mjs` (troca Q02, 1 ocorrência); `verificar-avaliacao.mjs` passa a conferir também a introdução do checklist, com a mesma troca |

**Q03, varredura.** "GridAlpha" já saía pela troca P24 (4 ocorrências no corpo das aulas, 2 na avaliação). "War Room"
aparecia em 1 lugar do corpo (A05) e 1 da prova (Q10); "Cobaia Zero" e "Summit" não aparecem no texto das aulas do
M01 nem na avaliação (medido por busca no `.ts` e no render das 9 aulas). A frase de troca é a que a própria A05 já
usa no callout 5.2 ("Esta é uma trava operacional da NIVAR"), por isso **o número da trava sai** e o **D09
(Trava 3 × Trava 4) deixa de existir na tela**. Depois da troca, "War Room", "Cobaia" e "Summit" não restam em
nenhum arquivo do M01 em `src/` (busca; as ocorrências que sobram são de `alexandria-modulo-02/03-content.ts`, das
sessões de porte desses módulos). As outras ocorrências do D09 na fonte (§ 00 L1314, § Caso L2192) não têm texto
portado no M01.

## Instrumentos

| # | Pendência | Mudança |
|---|---|---|
| 3 | **QA-FCap-01** · veredito do INST·06 | Os seis ramos de veredito do script (L2952–2957) saíram de `INSTRUMENT_CALCULATORS['inst-06']`: o instrumento só calcula o FC. Eles contradiziam a figura `cf-chart`, que governa (ex.: 25,1% caía em "eólica … ou solar com tracker" no script e em solar ~20–28% na figura). A nota estática do instrumento (texto da marcação, "Faixa típica de usina solar fotovoltaica em latitudes brasileiras. Compare com FCs típicos abaixo.") **fica**: é a leitura do cenário padrão e concorda com a figura; continua velada até a previsão. |
| 3 | **Limiar de 45%** | Não existe em nenhum arquivo do modelo v3 do M01. Só sobrevive em `src/components/alexandria/aula/AulaM01A08.tsx` (arquétipo PRANCHA, L138, L154, L990), que **não é montado** para o M01: o roteador manda o M01 inteiro para o modelo v3 antes de consultar `arquetipos.ts`. Esse arquivo não é da posse desta sessão; **pedido à coordenação**: retirar o registro `'modulo-01:8'` de `arquetipos.ts` e o componente, ou ao menos o limiar. |
| 6 | **D05** · LAB·01 | A calculadora já implementa o script (`(0,92 − 0,84) × 100.000 × 0,4 = 3.200`; fatura B = 45.000 + 15.000 + 3.200 + 5.625 = **68.825**). Nenhum arquivo de `src/` carrega os valores estáticos da marcação (1.800 / 67.425) — conferido por busca. O LAB·01 não é montado no modelo v3 (`RecursosDoModulo` só é usado por `ModuloAulaList`, que nenhum arquivo importa). |

A edição do INST·06 tocou `src/lib/data/alexandria-instrument-calculators.ts`, que não estava na lista de posse do
brief: é o único lugar onde a frase vive. A mudança é só o bloco `'inst-06'` (o M01 não tem `calculadoras/m01.ts`),
para não colidir com as sessões de porte, que usam `calculadoras/mNN.ts`.

## Q08 — campos sem origem: o que dá e o que não dá para remover aqui

| Campo | Onde | Situação |
|---|---|---|
| `points: 1` | 8 exercícios em `MODULO_01_AULAS` e `MODULO_01_SINTESE` | **Não removido.** `LessonActivity.points` é obrigatório no tipo compartilhado `src/lib/types/alexandria.ts` (FOUNDRY). Nenhum arquivo lê o campo (busca por `.points` em `src/`). **Pedido:** tornar `points` opcional ou removê-lo do tipo; depois disso, apagar as 8 linhas é mecânico. |
| `expReward` | `src/lib/data/alexandria-badges.ts` (badges do M01) | **Não removido**: arquivo fora da posse desta sessão, e o tipo `Badge` exige o campo. A decisão MV-32 (`docs/alexandria-v2/m01/movimento.md`) já prevê o tipo novo `Conquista` sem ele. |
| Rótulos compostos do LAB·01 ("Fábrica A · Demanda máxima") | `INSTRUMENTOS_MODULO_01`, `lab-01` | **Não removido.** O prefixo é o mecanismo de coluna do `InstrumentPanel` legado (`separaColuna`), porque `InstrumentField` não tem campo de grupo. Na tela, a coluna imprime "Fábrica A" e o campo imprime o rótulo da fonte ("Demanda máxima"). O conserto fiel (cabeçalho "Fábrica A · Operação estável", U24) exige um campo de grupo no tipo compartilhado. O LAB·01 não aparece em nenhuma tela do modelo v3 hoje. |
| "Veredito"/"Seleção" como rótulo de saída | — | Nenhum no M01. O "Status" do INST·02 é rótulo da fonte (`saidas[0].rotulo`). |

## Diagramas liberados

| Id | Componente | Aula · âncora | Dado | Véu |
|---|---|---|---|---|
| D-A06-2 | `SistemasDeFases` | 6.4, depois da tabela de sistemas | tabela 6.4 (≤ ~10 kW; acima de ~15 kW; bifásico sem número) e **120° do verbete "Trifásico" do § Lex do M01 (L2661)**; 60 Hz da A03 | aula sem instrumento |
| D-A06-1 | `SubgruposPorTensao` (atualizado) | 6.2 | Grupo A "em regra, ≥ 2,3 kV"; a nota diz que o AS é a exceção | — |
| D-A07-3 | `ReferenciaFatorDePotencia` | 7.4, depois do parágrafo do 0,92 | 0,85 e 1,00 (7.3), 0,92 indutivo e capacitivo (7.4); a reativa de 53% é calculada no componente | não desenha o cenário do INST·05 (800/480 → 0,86); fora de `velarFiguras` |
| D-A08-2 | `FatoresDeCapacidadeTipicos` | 8.3, depois da figura `cf-chart` | as sete faixas da figura, verbatim | não marca o 25,1% do INST·06; fora de `velarFiguras` |
| D-A09-2 | `FenomenosDeTensao` | 9.3, depois da tabela de fenômenos | nome e "o que é" da tabela 9.3; 120° do § Lex | aula sem instrumento |

**Achado de método.** A especificação de D-A06-2 dizia que "a defasagem (120°) não está em nenhuma linha da extração
do M01". Está: o verbete "Trifásico" do § Lex (L2661, `termos_lexico` em `aula-03.json`, `aula-06.json` e
`aula-09.json`) diz "três fases defasadas em 120°". O diagrama cita o verbete. Não precisou de conteúdo novo.

**D-A09-2 é ilustrativo.** A fonte não dá magnitude nenhuma (quanto afunda, quanto sobe, por quantos ciclos, que
ordem harmônica). A figura não tem número em eixo nenhum; o subtítulo diz "Ilustrativo, sem escala de norma", e a
nota diz que as formas mostram o tipo do fenômeno e não servem para medir nem comparar com limite de norma.

Continuam fora: **D-A05-2** (curva de carga) e **D-A08-3** (capacidade × geração da matriz), que esperam dado.

## Imagens (decisão 9)

As **23 imagens** que `figuras.ts` põe nas nove aulas (22 derivados v3 em `public/alexandria/v3/aulas/m01/` e
Sobradinho, `m01-a08-04`, que segue em `public/alexandria/v2/aulas/`) foram revisadas e estão **`aprovado` em
2026-11-15**. Por imagem: página do Commons lida pela API (licença, autor, data, descrição); original baixado e
**SHA-1 do baixado = SHA-1 da API = SHA-1 registrado** nas 23 (o de Sobradinho, que não estava registrado, passa a
estar: `7290eab97ae8c1527aba652dbec9beed3f70d625`); derivado publicado comparado ao original em miniatura 16×16 (diferença
média ≤ 7 em 0–255 em todas; o forno dá 3,3 contra o recorte do original, ver abaixo). Nenhuma saiu.

Seis legendas foram **ajustadas** por afirmarem o que nem a página nem a extração dizem: Tesla (licença à
Westinghouse), frequencímetro ("Tchecoslováquia"), medidor de kWh ("Alemanha"), banco de capacitores ("bem maior que o
de uma indústria"), transformador de poste ("é ele que" → "do tipo usado na Austrália … esse equipamento") e
Sobradinho ("barragem" → "reservatório", como a descrição da Agência Brasil). Tabela completa, com hash e licença de
cada uma: `docs/alexandria-v2/media-provenance.md`, "Revisão factual das imagens das aulas do M01". As cinco linhas
antigas do M01 (`m01-a02-01`, `m01-a03-01`, `m01-a03-02`, `m01-a07-02`, `m01-a08-04`, esta em duas tabelas) passaram a
`aprovado`. Nenhuma imagem **gerada** entra nas aulas do M01 no modelo v3.

- **Recorte do forno:** `m01v3-a07-forno-eletrico-918.webp` é o original de 1.024×831 sem a borda do filme; o encaixe
  medido é a janela 918×714 em (44, 56) do original.
- **Anel de Faraday:** a página do Commons dá autor desconhecido e cita F. Bedell, *The Principles of the Transformer*
  (Macmillan, 1896), p. 288, fig. 162. A linha antiga dizia "F. Uppenborn (1889)", sem fonte que a sustente. A legenda
  segue o Commons; a divergência fica registrada no `media-provenance.md`.

## Verificação

Medido em 15/11/2026, na árvore desta sessão, **depois do rebase sobre `wave/alexandria-v3` em `acd787f`** (modelo de
aula com vários instrumentos, Ex·08 e checklist na última aula, veredito renderizado como HTML). O INST·06 não devolve
veredito, então o caminho HTML do veredito não renderiza nada para ele.

O hook de pre-commit **está ativo** nesta árvore (`core.hooksPath` aponta para `.husky/` no `config.worktree`), ao
contrário do que diz o `AGENTS.md`. Ele chama o `bin/` do auditor, que precisa de `tools/gridalpha-detect/node_modules`
(o `npm ci` da raiz não instala esse pacote); sem ele, o `bin` cai no `npx` com shell e quebra no espaço do caminho, e o
hook bloqueia todo commit com TS. Rodar `npm ci` em `tools/gridalpha-detect/` resolve; nenhum commit usou `--no-verify`.

| Portão | Resultado |
|---|---|
| `npx tsc -b` | 0 erros |
| auditor (`gridalpha-detect src`) | 1 P0 / 19 P1 / 36 P2 — a linha de base; o P0 é o "backend" de `atlas/PaisPerfil.tsx`. Nada nos arquivos desta sessão |
| `verificar-porte-m01.mjs` | 423 esperados, **0 falta, 0 órfão**; substituições nomeadas: P24 ×4, QA-M01-A04 ×2, QA-M01-A06 ×1, QA-M01-A07 ×1, Q03/D09 ×1 |
| `gerar-avaliacao.mjs` | regenerado; mudaram só a explicação da Q10 da prova (troca Q03 ×1) e a introdução do checklist (troca Q02 ×1). Nenhum trecho citado pelos itens derivados mudou |
| `verificar-avaliacao.mjs` | **0 falhas** (os 6 avisos de distrator são os de antes), agora conferindo também a introdução do checklist |

Depois do `npm ci` em `tools/gridalpha-detect/`, o auditor roda pelo `bin/` normalmente (mesmo resultado).

**Render** (Chrome do sistema por `playwright`, dev server desta árvore; o painel Browser nasceu 0×0 e não compõe
quadro). As 9 aulas × 1440 e 390 × claro e noturno × visitante (E0) e conta (E1, fixture de
`tools/alexandria-capture/fixtures.mjs`) = **72 renders, 72 limpos**: `innerWidth` igual ao viewport, modo medido igual
ao pedido, **0 rolagem lateral** da página, **224 imagens carregadas, 0 quebradas** (`naturalWidth > 0`, depois de
rolar a raiz `.alx3`), os quatro diagramas novos no DOM nas suas aulas, e nenhuma ocorrência de "exponencial",
"War Room", "GridAlpha", "Cobaia", "Summit" ou "os outros 15% são reativos" no texto das aulas. Os únicos erros de
console são do harness: o 401 do `/api/auth/me` do visitante (igual à produção) e o 404 "sem registro" que a fixture
E1 devolve para o progresso por aula.

**Véu** (8 aulas com instrumento ou diagrama novo, 1440 e 390, claro e noturno): os diagramas velados (A01, A04, A05,
A07 e A08) estão **fora do DOM antes da previsão** e entram depois dela; a A05 continua fechada depois da previsão,
esperando o Ex·04; na A08, "25,1%" não está no DOM antes da previsão e está depois, e o INST·06 **não mostra
veredito** (0 `.av-veredito`), só o FC calculado e a nota da marcação. Os quatro diagramas novos estão visíveis desde
o início, como devem (não desenham cenário de instrumento). A 390 os diagramas rolam dentro da própria figura
(`min-width: 600px`, o desenho comum dos diagramas do M01); a página não rola de lado.

Os textos que só aparecem depois da previsão foram conferidos depois dela: a nota do INST·03 diz "quadrático"; a do
INST·06 é a frase da marcação. Os rótulos "Nota da Alexandria · …" foram conferidos por `textContent` (o CSS os põe
em caixa alta no `innerText`).

## Pedidos à coordenação (fora da posse desta sessão)

1. **`LessonActivity.points` opcional** no tipo compartilhado (FOUNDRY), para o M01 tirar `points: 1` dos 8
   exercícios (Q08). Nada lê o campo.
2. **Campo de grupo em `InstrumentField`** (ou equivalente), para o LAB·01 deixar de compor "Fábrica A · …" no rótulo e
   mostrar o cabeçalho da fonte ("Fábrica A · Operação estável", U24). Só faz diferença quando o LAB·01 voltar a ter tela.
3. **`expReward`** dos badges do M01 em `alexandria-badges.ts` (Q08; MV-32 já prevê o tipo `Conquista` sem ele).
4. **`AulaM01A08.tsx` + registro `'modulo-01:8'` em `arquetipos.ts`**: único lugar onde o limiar de 45% sobrevive. Não é
   montado para o M01, mas o código continua lá.
5. A edição de `alexandria-instrument-calculators.ts` (bloco `'inst-06'`) foi feita aqui, fora da lista de posse, porque
   é o único lugar da frase de veredito; ver "Instrumentos".
