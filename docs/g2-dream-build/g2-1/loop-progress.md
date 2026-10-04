# NIVAR G2.1 — Design Loop

Continuação do checkpoint estrutural 69a84a5. G0/G1 continuam sendo a constituição aprovada. O proprietário rejeitou o acabamento de G2; os PASS do registro anterior são históricos, não a régua desta rodada. A seleção humana de G2.1 permanece aberta.

## Referência → composição → crítica → correção

1. Reabrimos marca, tipografia, imagem, movimento e materiais. Refero e páginas reais de Media.Work, Rivian, DGC, 60fps, Logobook, NASA e outros sistemas foram examinados com capturas. A cobertura, as limitações de acesso e os mecanismos observados estão em ../g2-1-reference-dossier.md.

2. Três wordmarks originais e três sistemas tipográficos foram comparados com o mesmo conteúdo de produto. Seleção: Interval + Literata / Manrope / Geist Mono. A largura de abertura do A recebe ajuste óptico pequeno; os acentos e o itálico real foram verificados em Chrome. Current e Civic, Plex e Fraunces/DM permanecem no arquivo de comparação.

3. Seis emblemas ganharam escala micro, standard e hero. A variante em bronze foi rejeitada por parecer medalhão; transparência falsa e inversão fantasmática no escuro também foram rejeitadas. A seleção é uma gravura sobre papel mineral, com gestos próprios de cada patrono.

4. Higgsfield produziu 18 estudos estáticos e quatro clipes reais. Transmissão, hidrologia e exame de documento foram selecionados para o filme; a segunda transmissão venceu a alternativa mais tempestuosa. Cenas e pessoas são ilustrações geradas, sem atribuição factual a instalações ou clientes reais. O antigo objeto de laboratório não voltou à direção.

5. Três composições de abertura foram exploradas. A escolhida dá à tese um campo tipográfico amplo acima do filme de território. A hipótese em tríptico e a de leitura lateral foram guardadas em concepts/. A seleção usa proporção e continuidade, não reprodução literal das imagens G1.

6. O protótipo de 18 segundos foi arquivado. A composição nativa de 24 segundos mantém EV—001 em Medir, Organizar, Observar, Questionar, Transmitir e Procurar. Fonte, dia ilustrativo e MW acompanham 68, 64, ausente, 81, ausente, 108. O gráfico não inventa continuidade. A hipótese chega a “Tendência não demonstrada”.

7. A primeira crítica independente do Terminal respondeu NÃO: profundidade pouco convincente, painel opaco e excesso de névoa. A correção separou base, instrumento e poço do gráfico, colocou a lente sobre a geometria e preservou o ponto selecionado.

8. A crítica visual 02, sem código ou explicações do construtor, respondeu NÃO para Terminal e público. No Terminal, o grande campo cinza dava peso semelhante a tudo. No público, retrato, fotografia e painel pareciam ativos justapostos. Retiramos a laje cinza do Terminal; demos autonomia à leitura. Na casa, a gravura passou a habitar o mesmo campo da imagem. No filme, o registro se abre em um campo analítico mais transparente.

9. A crítica visual 03 confirmou as duas correções anteriores. Ainda respondeu NÃO no conjunto: os rótulos do Terminal precisavam de escala óptica e a gravura móvel tinha uma costura horizontal. Rótulos essenciais foram ampliados para 11–12 px e a gravura passou a ocupar a altura inteira de sua composição móvel.

10. A crítica fresca do briefing encontrou uma falha concreta: os links de produtos na casa repetiam o destino da família. Corrigimos Energy Brief → /br/brief, Alexandria → /alexandria?trilha=brasil e Terminal Brasil → /br/terminal. Ela também pediu que Software demonstrasse organização. O capítulo agora contém a visualização nativa interativa do Terminal; a cópia posterior foi retirada. Veredito após a inspeção desktop/mobile: PASS de propósito, com limites explícitos.

11. A crítica fresca de sistema encontrou áreas de toque insuficientes nos novos controles. Links da casa, pausa do filme Advisory, transporte do Portal, fonte contextual, notas da linha do tempo, alternância do mapa e régua foram corrigidos para pelo menos 40 px em desktop e 44 px no celular. Testes nativos preservam o ponto selecionado, foco, fonte e enquadramento. Veredito de sistema: PASS no escopo inspecionado, separado de craft.

12. Um júri visual final, em outro contexto e vendo somente 16 imagens, respondeu SIM ao público e NÃO ao Terminal. A lacuna indicada foi a materialidade dos grandes planos azul-acinzentados. Uma correção final retoma grafite, espresso e aubergine, com atenção à profundidade dos planos e à transparência da lente. A história retém esse NÃO; ele não é rebatizado como aprovação.

13. O mesmo júri voltou às referências Dovetail/Fey e examinou sete capturas novas, incluindo o Terminal isolado, a visualização real da casa e o tema claro. Respondeu SIM: poço do gráfico, superfície do instrumento e lente passaram a ocupar planos legíveis. Ainda aponta repetição de molduras/metadados e acabamento atmosférico mais fino em Fey. O parecer anterior continua intacto em final-visual-jury.md. As críticas de imagem não certificam movimento.

## Evidência de execução

- final-surfaces/results.json: 22 verificações nativas em 390, 430, 768, 1024, 1440 e 1920; sem transbordamento horizontal ou exceção. Um único Terminal no Portal; seleção e destinos corretos.
- motion-review/report.json: execução real do filme em desktop e celular, 29 registros, vídeos com tempo avançando, estados manuais e reduced motion. A primeira gravação expôs corte transitório ao crescer o painel; a âncora inferior corrigiu isso e a gravação seguinte teve zero recortes nos instantes medidos.
- material-lab/results.json: quatro combinações de tema/largura, com teclado, foco de 2 px, ausência em três superfícies, um segmento conectado e duas lacunas. /br/sistema usa os componentes React reais.
- terminal/material-finish/: 24 verificações finais; tema claro e grafite, regiões, sonda, fonte, foco e lente. Fonte com 44 × 44 px; instância real na casa com 886 px em desktop e 348 px no celular. O passe óptico anterior permanece arquivado em terminal/optical-pass/.
- families/: cinco experiências e seus filtros/estados; correções móveis registradas. A primeira crítica das famílias tinha contexto de implementação e não é apresentada como crítica cega.
- Alexandria foi aberta pelo link real do Portal: zero elementos .g2 ou ancestrais do novo shell; estilos próprios preservados. Não houve alteração de backend, auth/API, amostras compartilhadas, src/main.tsx ou src/index.css.

## Ferramentas e limites

Penpot respondeu que não havia instância conectada; a mesa editável HTML/SVG é o fallback. Storybook e MotionSites não tinham ferramentas callable no inventário; não declaramos uso bem-sucedido. O laboratório local substitui a inspeção de componentes, e 60fps/DGC fornecem evidência real de movimento. Chrome DevTools teve trava de perfil; Chrome nativo por CDP/Node realizou as inspeções. Blender produziu um estudo salvo de papel, metal, cobre e vidro, sem forçar um objeto fictício no produto.

Mobbin permitiu examinar entrada/login públicos, mas não a biblioteca autenticada. Pageflows interrompeu o preview aos 20 segundos; o restante do fluxo não é declarado como visto. Blueprint permitiu verificar seleção por teclado em uma tabela real.

Build, lint ou consistência não certificam acabamento excepcional. As críticas estáticas não aprovam a cadência cinematográfica completa. A autoria gerada e o custo do bundle global permanecem limites explícitos. O próximo julgamento humano deve examinar o produto real, os filmes gravados e as referências lado a lado.
