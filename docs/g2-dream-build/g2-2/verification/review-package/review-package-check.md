# Verificação do caderno visual

Executada pelo agente principal no Chromium nativo, após os pareceres independentes de produto. Não constitui um novo parecer independente de craft.

- `review.html` abriu a 1440 × 1000 e 390 × 844, sem overflow horizontal. Capturas desktop e celular estão neste diretório.
- As três imagens editoriais carregaram com `naturalWidth > 0`; as onze capas dos vídeos também foram decodificadas com dimensões válidas.
- Os onze vídeos carregaram metadados nativos, com dimensões e durações válidas e sem erro de mídia. `media-metadata.json` registra os resultados.
- Os 45 destinos locais de `href`, `src` e `poster` existem. `local-link-check.json` registra cada destino. Links locais do produto requerem o preview em execução.
- O filme de rolagem completa foi reproduzido no próprio caderno até `ended=true`, a 1×, em 32,4 s de tempo de mídia, sem erro. A composição final de Diógenes está presente no encerramento. O relógio da captura não certifica fluidez em aparelho físico.
- Todos os players têm controles nativos e não iniciam automaticamente ao abrir o documento. A verificação de mídia solicitou metadados programaticamente; depois o documento foi recarregado para verificar seu estado normal.

O servidor local havia encerrado durante o fechamento. Foi reiniciado a partir do checkout G2.2 na porta 4173, sem qualquer deploy.
