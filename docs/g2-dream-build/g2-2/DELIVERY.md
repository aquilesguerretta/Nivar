# NIVAR G2.2 — entrega e inspeção

Trabalho adicional sobre `06c7d35c8bed780000a884fa58285e9916ed0f61`, na branch `wave/nivar-g2-dream-build`. O checkpoint estrutural `69a84a5` permanece ancestral. Sem merge ou deploy. Commit de implementação: `c12360ebfc64e010a8272b3af7c4909685cf128c`. O HEAD final inclui também este caderno e é informado no fechamento da tarefa; `git log --oneline 06c7d35..HEAD` reproduz a sequência.

Abra [o caderno visual](review.html) ou o [Portal local](http://127.0.0.1:4173/br). Para iniciar o preview em outro checkout: `npm ci` e `npm run dev -- --host 127.0.0.1 --port 4173`. Os vídeos, capturas e relatórios deste diretório podem ser examinados independentemente do servidor do produto.

## O que mudou

- Hero: filme nativo de 18 segundos, fotografias históricas identificadas de Itaipu e um mesmo registro que se transforma em tabela, gráfico, questionamento e publicação. Os seis patronos têm ações distintas. O ciclo retorna à paisagem; controles e transcrição permitem leitura fora do tempo do filme.
- Software/Ariadne: região, observação, origem e Terminal formam um percurso. A observação selecionada atravessa a passagem visual e continua selecionada no instrumento. A expansão preserva o contexto atual, inclusive fonte indisponível e modo.
- Terminal público: uma prévia operável apresenta curva, seleção e proveniência antes da entrada. O instrumento completo coordena mudanças de contexto e protege lacunas e valores contra interpolação enganosa.
- Diógenes: gesto, evidência, pergunta, convite e assinatura ocupam uma cena final. O caderno completo permanece acessível por teclado, e o índice conserva os destinos do rodapé.

## Arquivos finais

| Entrega | Arquivo ou diretório |
|---|---|
| Hero desktop e celular | `hero/iteration07/hero-desktop.mp4` · `hero-mobile.mp4` |
| Coreografia e fontes | `hero-storyboard.md` · `real-brazil/runtime-provenance.json` |
| Software desktop e celular | `terminal/ariadne-context-iteration04/` |
| Terminal público | `public-terminal/iteration01/` — a revisão final também inspecionou o produto atual |
| Terminal completo | `terminal/iteration04/` |
| Diógenes, claro e noturno | `finale/correction-03/` |
| Cinco famílias e a casa | `family-contact/family-contact-sheet.jpg` |
| Rolagem completa do Portal | `scroll/iteration02/portal-scroll-desktop.mp4` |
| Histórico de decisões e falhas | `LOOP-HISTORY.md` · `critics/` |
| Verificação e isolamento | `verification/final-gates.json` · `verification/isolation.json` |
| Desempenho e orçamento | `PERFORMANCE.md` · `verification/asset-budget.json` |

## Pareceres independentes

Brief: [quatro YES](critics/brief-02.md). Sistema: [correções M1/M2 verificadas](critics/system-01-amendment.md). Hero: [sete critérios de craft aprovados](critics/craft-hero-03/iteration07/amendment-review.md). Software e finale: [emenda final aprovada, Terminal YES mantido](critics/craft-system-02/amendment-01/review-amendment.md).

Os relatórios iniciais negativos e as sequências rejeitadas não foram substituídos. O pacote mantém filmes, capturas selecionadas, folhas de sequência, metadados e scripts. Frames redundantes de captura podem permanecer apenas no workspace; a curadoria está documentada em `verification/artifact-curation.md` e no manifesto de entrega. O pacote G2.1 preexistente não faz parte destes commits.

## Verdade, fronteiras e limitações

As séries continuam explicitamente sintéticas. Fotografias históricas não são apresentadas como origem dos números. A transmissão junto a Itaipu é identificada como lado paraguaio. Autores, licenças, alterações e hashes acompanham os arquivos; o novo Diógenes é uma ilustração gerada, com prompt e proveniência preservados.

Alexandria, backend, autenticação, contratos, dados compartilhados, fixture do Terminal e configuração de deploy permanecem iguais à base. A prova compara todos os arquivos rastreados fora da lista de mudanças autorizadas e registra hashes dos pontos protegidos.

Permanecem oportunidades de refinamento: luz e textura do filme poderiam ganhar riqueza adicional; microtexto de fonte no celular exige a transcrição para leitura confortável; o bundle principal herdado continua grande. As gravações comprovam comportamento e composição, sem certificar 60 fps ou desempenho em aparelhos físicos. A verificação usa Chromium; Safari, leitor de tela e auditoria WCAG integral não foram realizados. Fluxos autenticados preservados do G2.1 não foram reexecutados. Consulte `PERFORMANCE.md` para os avisos de build e limites completos.

Um arquivo de pesquisa G2.1 (`nivar-material-study.blend`) e seu backup apareceram modificados no workspace durante o fechamento. Foram deixados intactos e excluídos dos commits G2.2. A prova de isolamento refere-se à árvore commitada.
