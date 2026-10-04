# Cinema editorial novo — seleção G2.3.1

Três filmes novos foram gerados. Dois foram selecionados depois da avaliação de matéria, contato e movimento; o primeiro foi rejeitado. O resultado definitivo está em `final-selection.json`. `generation-manifest.json` é o registro da submissão inicial, preservado com os prompts; os resultados concluídos estão em `finished-jobs.json` e `refinement-result.json`.

## Seleção

**C — Contato de calibração.** Um probe aproxima-se do cobre, encontra o rebaixo por volta de 3 s e permanece estável. O movimento da câmera revela profundidade e muda a reflexão do metal. Três rebaixos ficam visíveis; o pedido de seis não foi cumprido literalmente. Isso não prejudica a inserção editorial, desde que a interface não afirme uma contagem física nem derive dados dessa imagem. O filme não contém escala, letras ou numerais. Use `calibration-review.html` para reprodução independente.

**B — Transmissão óptica.** O afastamento e a elevação da câmera revelam a relação entre vidro, papel, traços e sombra. O foco muda de forma contínua. Dois traços finos e a sombra mais larga do suporte ficam legíveis; o resultado não deve ser descrito como três amostras exatas. A imagem dá forma ao gesto de transmitir uma leitura, sem representar a origem dos valores. Use `optical-review.html` para reprodução independente.

**A — Régua de cobre, rejeitada.** A matéria e o movimento do probe eram convincentes, mas surgiram numerais que não estavam autorizados no desenho. O refinamento trocou a gramática da régua por rebaixos discretos e sem inscrições. O original, o filme comprimido e a folha de 24 frames continuam em `calibration/` como prova da rejeição. Não há cópia desse candidato no diretório público do produto.

## Canais considerados

O inventário de ferramentas encontrou geração de vídeo Seedance, Kling e MiniMax via Higgsfield; imagegen para storyboards e quadros de partida; Blender/3D Jutsu; composição por FFmpeg; além dos canais locais Three/WebGL e da animação nativa React/SVG. A busca automática de recomendação retornou Clipify, sem relação com o objetivo, e foi descartada. A consulta direta do catálogo Seedance confirmou 1080p, 4–30 s e áudio opcional antes da submissão.

Seedance foi escolhido porque o problema pedia movimento novo de matéria e câmera, com parallax e foco. Imagegen permaneceu como opção de direção por quadro, sem uma chamada apenas protocolar. A interface analítica deve continuar precisa e nativa: nenhum valor, rótulo ou dado foi solicitado ao modelo de vídeo. O Brasil real foi pesquisado por uma trilha independente; estes dois takes são **editoriais gerados, não documentais**.

## Verificação e peso

Cada seleção foi reproduzida por clique real no browser até o fim natural de 6,042 s. Durante a reprodução, capturas contínuas permitiram observar entrada, contato/foco, deslocamento da câmera e repouso. Os JSONs `*-browser-playback.json` registram relógio real do vídeo e estado carregado. Folhas de 24 frames a 4 fps são apenas complemento. Nenhum seek, alteração de velocidade ou relógio artificial foi usado nessa avaliação.

A primeira página com dois vídeos e controles nativos provocou um crash do IAB; a revisão foi retomada com uma única pista ativa e botão explícito por página. Os dois filmes reproduziram integralmente nessa condição. O Hero integrado ainda exige sua própria verificação desktop/mobile e de pausa fora da tela, conduzida pela implementação principal.

Originais: 1920×1080, 24 fps, HEVC Main 10, sem áudio. Derivadas: 960×540, H.264 yuv420p, CRF 22, `faststart`, cadência preservada, sem crop ou retiming. Os dois vídeos somam **601.758 bytes**; os posters, **34.704 bytes**. Total editorial acrescentado ao produto: **636.462 bytes**. O material original e os rejeitados ficam somente no pacote de revisão.

Preflight: 54 créditos estimados por take, três takes, 162 créditos estimados no total. A cobrança final não foi retornada separadamente. Não houve merge, deploy ou commit nesta subtrilha.
