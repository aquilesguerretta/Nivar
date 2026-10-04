# G2.3.1 — verificação final

Base real: `aa54f8f32f11e1742cfd1cbe80c7219a217c2de7`. Branch `wave/nivar-g2-dream-build`. Somente Hero e insígnias, com inserções de identidade na navegação e no rótulo do Terminal. Sem merge, push ou deploy.

| Verificação | Resultado e limite |
| --- | --- |
| `npm run build` (`tsc -b && vite build`) | Passou. Build final em 29,27 s; log completo em `build.log`. |
| `node node_modules/eslint/bin/eslint.js src/components/g2 src/pages/terminal-brasil` | Passou, zero diagnóstico em todo o escopo integrado. `scoped-lint.log` vazio é o resultado normal de sucesso. |
| Lint do repositório inteiro | 300 erros e 11 avisos fora da G2.3.1. `lint-summary.json` compara cada arquivo com o HEAD inicial. Não foram corrigidos arquivos protegidos para fazer a contagem global desaparecer. |
| `gridalpha-detect src` | Zero P0. Ocorrências P2 informativas em superfícies anteriores; log completo anexado. |
| Testes existentes de análise do Terminal | 8/8 passaram, zero falha; `terminal-tests.log`. |
| Fronteiras | 1.105 arquivos da base comparados, 1.099 iguais e seis modificações autorizadas. Quatro arquivos de código novos. 209/209 hashes de Alexandria preservados. `boundary-audit.md` discrimina blocos e dependências. |
| Movimento real | Desktop 1280×720 e móvel 390×844 aprovados após exame das sete cenas e de todas as transições. Capturas amostradas, com timestamps variáveis preservados, sem interpolação. A gravação tem duração de parede diferente do relógio narrativo de 32 s. |
| Responsivo | Sem overflow horizontal em 320×812, 390×844, 430×932, 768×1024, 1024×768, 1280×720 e 1440×900. Nas cinco medidas adicionais, CTA e registro terminam acima do rodapé da folha. `responsive-checks.json` contém retângulos medidos. |
| Temas e insígnias | Cinco cabeçalhos reais em claro e noturno, patronos carregados (`naturalWidth > 0`), insígnias compactas presentes. Navegação móvel testada e capturada nos dois temas. Prova vetorial separada em 16/20/24/32 px; os contextos editoriais da prancha são identificados como estudos. |
| Leitura sem movimento | Controle real abre o estado estático com **zero elementos de vídeo**, relógio32 e instrumento legível, nos dois temas e nos dois viewports. As provas usam a mesma ramificação React que recebe `prefers-reduced-motion`. A preferência do sistema operacional não foi emulada por esta ferramenta; sua inicialização/listener e a regra CSS foram inspecionados, sem apresentar isso como teste de OS. |
| Pausa e retomada | Relógio parou em0,200 e permaneceu igual entre chamadas. Retomada chegou a5,138 com o vídeo de calibração em reprodução. Fora da tela, relógio parou em5,188 e ambos os vídeos pausaram. `motion-controls.json`. |
| Hero → Terminal | Clique real preservou SE/CO,24h,carga,observação18. Painel de fontes mostrou68,1GW,18h e a mesma versão sintética. `terminal-source-handoff.png` e `browser-checks.json`. |
| Operador | Entrada no build de produção local carregou os sete pedidos ilustrativos e a navegação da bancada. Nenhum pedido alterado. Os14 arquivos do operador e suas dependências protegidas estão iguais à base. Não houve ação sobre fila real. |

As fotografias são documentos históricos; os macros gerados são criações editoriais. A série sintética do Terminal não descreve a usina ou as linhas fotografadas. Essa distinção está no próprio filme, na transcrição e nos créditos.

O browser produz pixels reduzidos quando recebe certos overrides de viewport. Por isso, a prova móvel final foi capturada na superfície nativa1633×1089 com o produto dentro de um iframe390×844, e recortada exatamente em0,0,390,844, sem redimensionamento. Nenhum CSS do produto foi mudado pelo harness. Os arquivos `*-full.png` e frames brutos ficam no arquivo de trabalho; os manifestos documentam o corte. Overrides temporários foram restaurados.

Impacto de arquivos: vídeos+posters novos somam636.462 bytes; fotografias escolhidas somam328.302 bytes no desktop ou75.186 no móvel. Total dos meios do Hero:964.764 bytes desktop /711.648 móvel. Os cinco SVGs portáveis somam1.251 bytes; no produto os paths estão inline, sem requests próprios. Entry JS final≈3.309,40 kB (gzip 1.014,07 kB), contra3.310,89kB(gzip1.014,73kB) documentados na G2.3. Isto é orçamento de arquivos/build, não benchmark de rede, LCP ou interatividade. Permanecem os avisos anteriores de chunks grandes, imports mistos, Browserslist e comentário CSS. `performance.json` e `build.log` são as medidas de referência.

O `.blend` do owner já modificado antes desta rodada não foi incluído. O HEAD final e a lista exata de arquivos do commit serão recibados em `delivery.json` após o commit, evitando autorreferência ao hash.
