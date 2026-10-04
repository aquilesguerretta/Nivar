# Desempenho e limites — G2.2

- Nenhuma dependência adicionada. Bibliotecas, lockfile, roteamento global e configuração de build permanecem iguais ao G2.1.
- 9 novos arquivos de runtime totalizam aproximadamente 1,648MB: seis WebP responsivos de fotografias reais, duas versões da nova ilustração e a página de créditos. Tamanhos e SHA-256 estão em `verification/asset-budget.json`.
- Hero em HTML/SVG/CSS, com um único relógio nativo de 18s. Fotografias estáticas são identificadas como históricas; movimento editorial não é filmagem operacional. Não há vídeo, WebGL ou renderização 3D montados no hero. A perspectiva da publicação é CSS.
- Reprodução suspensa fora da tela e em aba oculta; controles manuais e composição estática com movimento reduzido. Os mesmos registros mantêm valores e ausências durante as transformações.
- Terminal completo só monta depois da ação do usuário. A importação dinâmica de Ariadne não separa o download em um novo chunk porque a rota também importa o Terminal estaticamente; o relatório de build registra esse limite. Não alegamos economia de bytes por esse lazy mount.
- A prévia pública é um gráfico nativo pequeno, baseado na mesma fixture. A animação inicial é finita; números mudam diretamente para a observação existente, sem contagem interpolada de dados.
- O novo Diógenes usa imagem responsiva lazy. Caderno detalhado permanece em HTML acessível, aberto sob demanda.

O bundle principal herdado continua grande: aproximadamente 8,13MB de JavaScript minificado / 2,43MB gzip. O CSS principal fica em torno de 435KB / 74KB gzip. Os números finais exatos estão no log de build e no manifesto. Resolver a arquitetura global de chunks exigiria uma rodada própria e não justificaria alterar Alexandria neste trabalho.

Warnings conhecidos: base do Browserslist desatualizada, chunk principal acima de 500KB, importação estática/dinâmica de GridAtlasMap e Terminal, e comentário inválido de CSS preexistente. Não foram feitas alterações nas superfícies protegidas para silenciar esses avisos.

## Evidência temporal

Gravações vêm do navegador nativo: frames e timestamps originais são preservados, codificados em MP4 para inspeção. Não houve aceleração deliberada dos filmes para atingir o ritmo pedido. Os arquivos do hero incluem o ciclo e o começo do seguinte. Captura, codificação e reprodução em máquina compartilhada podem produzir intervalos maiores entre frames; estas gravações comprovam sequência e comportamento, não 60fps, Core Web Vitals ou desempenho em aparelhos físicos.

A primeira volta completa do Portal percorreu 9859px, carregou todas as imagens visíveis e não apresentou overflow horizontal. A gravação atualizada fica em `scroll/iteration02/`. As verificações cobrem Chromium nativo; não houve certificação Safari, leitor de tela ou WCAG integral. Fluxos autenticados não foram reexecutados, pois não foram alterados nesta rodada.
