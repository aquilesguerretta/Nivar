# NIVAR G2.3.1 — pesquisa e decisões de insígnia

Pesquisa nova realizada em 12–13 setembro de 2026. O objetivo foi uma família de identificadores persistentes, subordinados à casa NIVAR, capaz de sobreviver em uma cor a 16 px. Nenhuma forma de terceiros foi importada, traçada ou usada como geometria dos cinco masters.

## Vocabulário de trabalho

Estas são distinções operacionais para este projeto, não uma taxonomia universal. Um **ícone** ajuda a reconhecer uma ação ou objeto da interface. Um **símbolo** adquire significado por associação continuada. Um **emblema** reúne elementos numa composição. Uma **insígnia** identifica pertencimento estável a uma família ou programa. Um **selo** comunica autenticação ou autoridade formal. Um **identificador** é o papel desempenhado pela marca. Um **monograma** combina letras. A NIVAR precisa do papel de insígnia; nem um selo cerimonial nem cinco novos logotipos empresariais.

O retrato do patrono é a camada narrativa e emocional. O ordinal é a ordem taxonômica. A nova marca compacta identifica a família. A palavra NIVAR continua sendo a assinatura principal.

## Referências e mudanças materiais de decisão

| Fonte consultada | Observação sustentada pela fonte | Decisão aplicada à NIVAR |
| --- | --- | --- |
| [NASA — Brand Guidelines](https://www.nasa.gov/nasa-brand-center/brand-guidelines/) | A agência distingue insígnia, logotipo e identificadores de missões/programas; estes não substituem a identidade da agência. | Preservar o master wordmark NIVAR; usar marcas de família junto ao nome/contexto. Não criar cinco marcas-mãe. |
| [NASA Science — Apollo Mission Patches](https://science.nasa.gov/resource/apollo-mission-patches/) | A descrição dos patches relaciona composição e elementos às intenções particulares de cada missão. | Partir de comportamentos específicos. Não impor o mesmo contêiner circular, brasão ou patch às cinco famílias; não repetir a iconografia espacial. |
| [Pentagram — MIT Media Lab](https://www.pentagram.com/work/mit-media-lab) | O sistema usa uma malha comum para o identificador principal e 23 grupos de pesquisa. | Criar regras comuns de massa e intervalo, mas testar a diferença entre silhuetas. A malha sete por sete e os glifos do MIT não foram adotados. |
| [IBM — 8-Bar](https://www.ibm.com/design/language/ibm-logos/8-bar/) | As versões positiva e reversa recebem compensações ópticas; igualdade matemática não garante peso aparente igual. | Avaliar claro/noturno a 16, 20, 24 e 32 px. Manter intervalos amplos e massas de 6 unidades, em vez de linhas finas; o nosso teste não exigiu masters separados por polaridade. |
| [Pentagram — Muriel](https://www.pentagram.com/work/muriel) | O colofão do MIT Press condensa livros e letras em barras; o projeto posterior explora suas possibilidades de movimento. | Uma forma compacta pode carregar uma ação editorial sem ilustrar um objeto inteiro. Movimento fica subordinado à qualidade estática. Nenhuma animação ornamental foi adicionada. |
| [Pentagram — Skittledog](https://www.pentagram.com/work/skittledog) | O imprint articula símbolo e desenho de letras, relacionando forma e caráter. | Procurar caráter nos ombros, cortes e massas, em vez de depender de uma cor por família. Não usar o peixe, sua silhueta ou a solução de monograma. |
| [V&A — Graphic Communication](https://vanda-production-assets.s3.amazonaws.com/2024/10/31/12/08/23/7aa2d396-ad55-4698-8bd3-f1bf89aa43f9/V%26A-GraphicCommmunication_A4.pdf) | A documentação do museu explica a subtração de parte do A e o papel do ampersand na marca de Fletcher. | Uma ausência deve ter função estrutural. Os cortes são parte do comportamento e da leitura, não um ornamento aplicado depois. |
| [Royal Society — Charter Book](https://www.royalsociety.org/blog/2019/07/turning-a-new-page-in-the-charter-book/) | A publicação mostra brasão completo, crista e escudo em diferentes lugares do mesmo objeto institucional. | Separar níveis de representação: patrono grande, insígnia pequena. Não reduzir uma gravura complexa até virar borrão. |
| [CERN — FCC Visual Identity](https://twiki.cern.ch/twiki/bin/view/FCC/LogoDesign) | O projeto declara uma identidade própria inserida em CERN e oferece versões por meio/contexto. | Entregar master vetorial e derivado material, com o mesmo contorno. O derivado Blender não é carregado no produto e não altera o master. |
| [Logobook — critérios](https://logobook.com/about-us/), [Publishing](https://logobook.com/business/publishing/), [Engineering](https://logobook.com/business/engineering/), [Heraldry](https://logobook.com/object/heraldry-shields-flags/) | O arquivo separa categorias formais e profissionais; seus critérios priorizam comunicação em preto e branco. | Rejeitar a sedução da prancha colorida. A primeira prova decisiva foi uma folha de pixels reais em duas polaridades. O catálogo é referência de curadoria, não banco de peças. |

## Geração, rejeição e refinamento

Os quinze desenhos estão em `candidates/`; o processo reproduzível está em `build-studies.mjs`. A prancha `concept-board.html` compara três caminhos por patrono. Dez foram rejeitados por leitura genérica de interface, associação literal, semelhança entre famílias ou comportamento insuficiente. O primeiro conjunto selecionado não foi tratado como final.

`candidates-iteration-01.json` e `small-size-iteration-01.png` preservam a primeira prova. Ela mostrou dois problemas: Perseu parecia um P quebrado, e Hefesto era próximo demais de Ariadne. Uma primeira correção separou os dois, mas a crítica independente rejeitou a leitura alfabética do conjunto G/S/rr/E/L. Esse estágio não foi aprovado por ser tecnicamente legível.

`topology-revision-02.png/json` registra uma nova rodada descartada: abertura genérica, cruz médica, letra C, tridente e checkmark. Foram então produzidas duas pranchas novas com Image Gen, documentadas com prompts em `generated-provenance.md`. Elas romperam o vocabulário alfabético. A releitura nativa `topology-revision-03.png/json` mudou Sócrates para duas massas desiguais, Perseu para matriz/fragmento e Ariadne para canais realmente unidos. Argos foi refinado novamente porque campo e ponto acima sugeriam paisagem/sol; `argos-refinement-04.png/json` coloca o registro no corte interno e rejeita as duas alternativas que reconstruíam D. Hefesto foi preservado como controle. `selected-masters.json` e `small-size-actual-pixels.png` registram a seleção final. Nenhuma ampliação foi usada para simular um resultado a 16 px.

## Cinco escolhas

| Família / patrono | Insígnia | Comportamento codificado |
| --- | --- | --- |
| Intelligence / Argos | Campo registrado | Um campo curvo é lido contra uma aresta fixa; o registro cruza o corte interno. |
| Advisory / Sócrates | Contraprova | Massas desiguais disputam um mesmo intervalo; uma continuidade plausível encontra uma objeção. |
| Academy / Perseu | Matriz e passagem | Um fragmento ausente da matriz aparece adiante, conservando sua correspondência geométrica. |
| Software / Ariadne | Registro convergente | Entradas de ritmos e espessuras diferentes convergem fisicamente numa espinha comum. |
| Hardware / Hefesto | Esquadro e padrão | Uma forma material estabelece referência diagonal e batente, enquanto um padrão destacado permite a comparação. |

## Gramática compartilhada

Caixa 32 × 32, desenho entre 24 e 28 unidades, margens ópticas de 1 a 4 unidades. Massas largas, cortes nítidos, terminais retos, ombros curvos quando a ação pede continuidade; as aberturas são desenhadas para sobreviver à redução. As cinco são massas preenchidas, não linhas de uma biblioteca de ícones. A regra comum é a relação entre matéria e intervalo, não um círculo, escudo, quadrado ou espessura mecânica repetida. Usam uma cor herdada do contexto. Não há gradiente, textura, animação ou bitmap necessário para reconhecimento.

Argos tem um corte vertical registrado, Sócrates uma silhueta partida desigual, Perseu uma matriz angular com fragmento, Ariadne um registro em canais, Hefesto uma diagonal com padrão. Isso permite distingui-los mesmo quando o nome e a cor estão ausentes.

O parentesco visual é uma proposta de design avaliada em conjunto; não equivale a um teste de reconhecimento longitudinal com usuários. A revisão do owner continua sendo a decisão final de identidade.
