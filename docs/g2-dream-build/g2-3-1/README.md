# NIVAR G2.3.1 — revisão do owner

Abra **[review.html](review.html)**. O percurso reúne filme antes/depois, mídia criada e licenciada, rejeições, cinco insígnias, provas de tamanho, matéria e QA. As [sete respostas](OWNER-ANSWERS.md) também estão em texto.

Branch: `wave/nivar-g2-dream-build`.

Início real: `aa54f8f32f11e1742cfd1cbe80c7219a217c2de7`.

O HEAD final e os arquivos exatos são registrados em **`delivery.json` após o commit**, sem tentar gravar o hash de um commit dentro dele próprio. Esse arquivo acompanha o ZIP e pode ser aberto mesmo quando o navegador bloqueia seu carregamento automático em `file://`. Não houve merge ou deploy.

## Filme

A edição de 32 s atravessa realidade, medição, estrutura, observação, pergunta, transmissão e investigação aberta. Duas fotografias brasileiras novas e dois takes editoriais novos substituem o repertório anterior. O registro sintético SE/CO, 24 h, carga, 18 h, 68,1 GW vem do Terminal e continua no destino; não é atribuído às instalações fotografadas.

- [Depois — desktop](hero/evidence/encoded/hero-g231-after-desktop.mp4), [depois — mobile](hero/evidence/encoded/hero-g231-after-mobile.mp4).
- [Antes — nova captura G2.3 desktop](hero/evidence/encoded/hero-g23-before-desktop.mp4).
- [Antes — ciclo G2.3 desktop arquivado](../g2-3/evidence/motion/hero-desktop-final.mp4), [antes — ciclo G2.3 mobile arquivado](../g2-3/evidence/motion/hero-mobile-final.mp4).
- [Método, cadência e validação das gravações](hero/evidence/encoded/README.md), [crítica de movimento](hero/MOTION-CRITIQUE.md).
- [Três takes gerados / seleção e rejeição](hero/generated/review.html), [inventário e proveniência](hero/generated/final-selection.json).
- [Sete fotografias / seleção e rejeição](hero/real-media/SELECTION.md), [proveniência fotográfica](hero/real-media/selected-provenance.json), [pesquisa nova](hero/research/REFERENCE-DECISIONS.md).

As gravações são capturas reais de navegador **amostradas**, montadas com os intervalos de tempo originais. Não são capturas a 30/60 fps, não têm frames interpolados e não demonstram fluidez a essa cadência. Desktop final: pixels nativos 1280 × 720. Mobile final: retângulo nativo 390 × 844 de um iframe da aplicação, removendo apenas o harness externo. Os registros G2.3 arquivados têm dimensões de imagem menores: desktop 818 × 568, mobile 226 × 482. A nova captura desktop anterior tem 1633 × 1089 pixels de origem e 1 px de padding no MP4; cobre 22,143 s. Os viewports de antes/depois não são idênticos.

## Insígnias

[Prancha de conceitos](insignia/concept-board.html) → [provas em pixels reais](insignia/small-size-actual-pixels.png) → [contextos](insignia/in-context.html) → [matéria](insignia/material.html).

[Os cinco masters](insignia/selected-masters.json), [pesquisa e decisões](insignia/research.md), [rejeições intermediárias](insignia/topology-revision-02.png), [exploração Image Gen](insignia/generated-provenance.md), [paridade entre exportação e runtime](insignia/master-parity.json).

As pranchas de contexto mostram aplicações editoriais de header, índice, navegação e cartão, em claro e noturno. São provas de identidade, identificadas separadamente das capturas integradas do produto. Os renders materiais não entram no bundle. Os retratos grandes e a assinatura NIVAR permanecem.

## QA e escopo

[QA final](qa/FINAL-QA.md), [auditoria de fronteiras](qa/boundary-audit.md), [Alexandria: comparação dos 209 hashes](qa/alexandria-hash-comparison.json), [build](qa/build.log), [lint completo](qa/lint.log), [lint do escopo](qa/scoped-lint.log), [Gridalpha](qa/gridalpha.log), [oito testes existentes do Terminal](qa/terminal-tests.log).

O lint completo registra 300 erros e 11 avisos existentes em 74 arquivos fora do escopo; ele não deve ser descrito como aprovado. A [análise por arquivo](qa/lint-summary.json) comprova sua preservação em relação ao baseline. Build, lint de G2/Terminal, oito testes existentes e auditoria de 209 hashes passaram. A [verificação de responsividade](qa/responsive-checks.json), os [controles do filme](qa/motion-controls.json) e o [peso](qa/performance.json) têm registros separados.

A leitura sem movimento foi ativada pelo controle real, no mesmo ramo de apresentação usado por `prefers-reduced-motion`. A ferramenta não emulou a preferência do sistema operacional; esse teste não é alegado. As capturas desktop/mobile de ambos os temas estão na revisão. A auditoria de fronteiras preserva operator, backend, Alexandria, fluxos aprovados, wordmark, retratos, footer e demais áreas fora das duas correções. O `.blend` pré-existente do owner não integra esta entrega.

## Pacote compacto

`compact-package-spec.json` contém uma seleção explícita. `package-review.py --dry-run` confere arquivos e links HTML sem criar ZIP. Depois de `delivery.json` estar pronto, `package-review.py --build --output CAMINHO.zip` cria o pacote, com hashes e índice de entrada. O ZIP mantém os caminhos relativos do repositório para não romper as provas e inclui apenas os vídeos de review, derivados leves, pranchas, metadados e QA. Não inclui milhares de frames, masters RGB, renders de processo redundantes, JPEGs originais ou o projeto Blender.

Para abrir o pacote sem restrições de `file://`, sirva sua pasta extraída com um servidor HTTP local e abra `index.html`. Nenhuma ferramenta de geração, dependência de aplicação ou conta externa é necessária para a leitura.
