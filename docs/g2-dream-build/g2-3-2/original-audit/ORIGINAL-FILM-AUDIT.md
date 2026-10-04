# G2.3 original — elenco, composição e movimento a recuperar

Auditoria delimitada em 12 de setembro de 2026. Fonte de código: `aa54f8f32f11e1742cfd1cbe80c7219a217c2de7`, anterior à versão G2.3.1 rejeitada. Trabalho somente de leitura no produto; os arquivos desta pasta são documentação. A orientação atual do proprietário prevalece sobre os briefs anteriores: filme de marca e energia brasileira, representantes das famílias presentes, mais ação e movimento; nenhum dashboard sustentando a narrativa.

## Conclusão operacional

Recuperar **o elenco, a gravura, os gestos e o vínculo com energia brasileira**. A restauração literal do G2.3 seria insuficiente: ali a maior parte da ação era movimento de números, enquanto as figuras eram imagens imóveis. A G2.3.1 retirou justamente o principal patrimônio emocional que o proprietário agora explicitou. A próxima produção precisa colocar os personagens em ação cinematográfica e lhes dar planos próprios reconhecíveis.

O sentido de continuidade deve passar de um gesto para outro — água, matéria, fio, observação, exame, transmissão, procura — sem depender de uma tabela ou gráfico. O Terminal pode permanecer fora da montagem; se houver uma aparição, tratá-la como breve detalhe de mundo, e não como assunto do filme.

## Evidência e limites da análise

- Código completo de `HeroFilm.tsx`, `hero-film.css` e `Brand.tsx` lido diretamente no commit original.
- Seis WebPs de 600 px abertos e inspecionados visualmente, incluindo mãos, objetos, perfil e direção do olhar. Dimensões, formato, peso e SHA-256 de 30 ativos medidos localmente por Pillow, em [asset-audit.json](asset-audit.json).
- Gravação `g2-3/evidence/motion/hero-desktop-final.mp4` aberta no player do navegador. Foi visto o trecho de Ariadne em reprodução, uma leitura do player a 11,520 s e o encerramento. Uma tentativa de repetir e instrumentar o ciclo completo encontrou falhas de seleção e de controle do player. **Não reivindico ter assistido a um ciclo contínuo completo controlado nesta auditoria.**
- Para examinar toda a sequência, foram lidos os metadados originais e inspecionados a folha de contato original e os quadros nativos `011`, `038`, `050`, `056`, `066`, `076`; a folha de contato cobre também `000`, `016`, `026`, `044`, `065`, `077`. Estes são quadros da gravação real preservada, não storyboards novos.
- A gravação original tem 83 quadros em 23,472 s, 818 × 568 pixels; a página capturada usava viewport CSS 1440 × 1000. Não é uma captura contínua de 24/30/60 fps e não comprova suavidade em alta frequência. A versão mobile tem 120 quadros em 24,174 s, 226 × 482 pixels. Não confundir a resolução CSS com resolução da evidência.
- O [player local de auditoria](playback.html) aponta para o MP4 original sem reedição. Não altera o Hero nem entrega nova produção.

## Ativos exatos do elenco

Todos os seis masters de runtime são quadrados, opacos **RGB**, em **600 × 600 e 1200 × 1200**. Todos derivam de PNGs **1254 × 1254** em `docs/g2-dream-build/g2-1/brand/emblems/{nome}-intaglio-study.png`. As referências conceituais do proprietário estão em `public/patronos/{nome}-384.webp`, **384 × 384 RGBA**. Para condicionamento de nova mídia, o intaglio de 1254 px é a referência de identidade mais completa; o WebP de 1200 px é uma cópia de alta qualidade já usada no produto. Não são fotografias de pessoas ou instalações reais.

| Personagem / família | Runtime 600 / 1200 | Composição e identidade a manter | Gesto que torna a família reconhecível |
| --- | --- | --- | --- |
| **Argos / Intelligence** | `public/g2/g21/emblems/argos-hero-600.webp` / `argos-hero-1200.webp` · 94.466 / 356.514 B | Rosto jovem em perfil voltado à direita; cabelo com olhos; mão elevada sombreia a sobrancelha. Face e cabelo ocupam esquerda; arco do braço chega da direita. Única linha fina de cobre sai à altura do olhar. | Busca atenta no território. Manter a mão, o perfil e os olhos do cabelo; não reduzir a um olho genérico. |
| **Sócrates / Advisory** | `public/g2/g21/emblems/socrates-hero-600.webp` / `socrates-hero-1200.webp` · 115.214 / 433.398 B | Rosto mais velho, calvo e barbado entra do alto à esquerda; indicador aponta ao rolo em diagonal à direita; outra mão sustenta a folha. O intervalo dedo–evidência é central. Uma linha de cobre, sem escrita falsa. | Examinar e interromper uma certeza; a aproximação do dedo e o desdobrar da folha têm consequência. |
| **Perseu / Academy** | `public/g2/g21/emblems/perseu-hero-600.webp` / `perseu-hero-1200.webp` · 86.632 / 339.552 B | Perfil jovem à esquerda, elmo alado reconhecível no alto; mão aberta em primeiro plano à direita sustenta pequena chama de cobre. Espaço claro entre rosto e chama. | Oferecer e transmitir. Preservar este personagem do sistema autoral do proprietário; não "corrigir" sua iconografia trocando-o por outro mito. |
| **Ariadne / Software** | `public/g2/g21/emblems/ariadne-hero-600.webp` / `ariadne-hero-1200.webp` · 82.080 / 318.142 B | Rosto parcial à esquerda; braço alto à direita sustenta carretel; outra mão trabalha o fio no centro inferior. Um fio contínuo de cobre descreve uma curva aberta e termina num pequeno ponto. | Organizar relações por tensão, direção e passagem do fio. Manter duas mãos, carretel e continuidade física do fio. |
| **Hefesto / Hardware** | `public/g2/g21/emblems/hefesto-hero-600.webp` / `hefesto-hero-1200.webp` · 115.362 / 454.940 B | Face concentrada no quadrante superior esquerdo; mãos em primeiro plano; paquímetro abraça uma pequena peça; bigorna fornece plano de apoio abaixo. Traço de cobre cruza a medição. | Medir e construir. O paquímetro deve fechar sobre a peça de maneira inteligível; não trocar a precisão por martelo fantasioso. |
| **Diógenes / Casa** | `public/g2/g21/emblems/diogenes-hero-600.webp` / `diogenes-hero-1200.webp` · 105.484 / 389.716 B | Rosto calvo e barbado acima à esquerda; mão e argola sustentam lanterna à direita; luz pequena no vidro e um fio de cobre horizontal. | Procurar: deslocar a luz para revelar mais mundo. Diógenes é a casa/continuação, não uma sexta família comercial. |

Também existe a composição aprovada do finale: `public/g2/g22/finale/diogenes-gesture-1536.webp`, derivada do original 1536 × 1024. Ela é referência útil para lanterna e direção de cena. Esta auditoria não solicita modificar o finale aprovado.

## Gramática visual comum

As gravuras partilham tinta lavanda/grafite, papel mineral quente, hachura fina, contorno hierarquizado e cobre usado apenas no gesto. Não são seis skins independentes. A corporeidade vem de olhos, mão, objeto e intervalo entre eles. As faces não precisam virar atores fotográficos para ganhar vida: manter o traço e animar articulação, tensão, material, luz e câmera pode preservar mais identidade.

No filme original a imagem era suavemente mascarada sobre campo escuro. O override final mantinha `filter: grayscale(.25)`, `mix-blend-mode: normal` e opacidade de imagem `.7`; o sistema já havia rejeitado a inversão fotográfica dos rostos. Novos vídeos devem evitar rosto em negativo, moeda/medalhão, manequim plástico, super-herói com armadura e confusão de mão/objeto. A tipografia NIVAR deve continuar sendo renderizada de forma controlada, não alucinada pelo modelo de vídeo.

## O que realmente acontecia nos 24 segundos do G2.3

| Tempo nominal | Personagem selecionado | Movimento e composição constatados | Leitura para a nova direção |
| --- | --- | --- | --- |
| 0–4 s | Hefesto | Itaipu aérea dá lugar às torres por dissolução; fotografia tem aumento de escala e campo se retrai; observação "68" aparece. A gravura começa a emergir tardiamente. No quadro 011, 3,8 s, torres e 68 dominam; o nome/gesto de medir é discreto. | Manter grande escala energética, mas mostrar água/câmera/matéria realmente se movendo; dar a Hefesto rosto e gesto legíveis desde seu plano. |
| 4–8 s | Ariadne | Ariadne grande à esquerda, fio e carretel visíveis, verbo "Organizar"; números se alinham em tabela à direita. É a presença de personagem mais forte dos quadros analisados. | Recuperar essa escala e tornar a passagem do fio uma ação que conduz ao próximo plano. |
| 8–12 s | Argos | Dados abrem em gráfico; Argos vira pequena testemunha na parte superior direita. Quadro 038 a 11,4 s confirma rosto/mão reconhecíveis porém periféricos. | O olhar de Argos deve motivar câmera e revelação de território, ocupando um plano em vez de decorar uma interface. |
| 12–16 s | Sócrates | Sócrates permanece pequeno no alto; pergunta e lacunas do gráfico são assunto principal. Quadro 050 a 14,6 s mostra isso claramente. | O exame pode acontecer no movimento físico da folha/luz/foco. A semântica não precisa de eixos numéricos. |
| 16–20 s | Perseu | Plano de evidência faz giro 3D e se torna folha clara com gráfico e texto. Em 18–19 s, a folha domina e Perseu não é visualmente discernível nos quadros inspecionados. | Perseu precisa ter um momento pleno de transmissão, com mão/chama/rosto visíveis e ação concluída. |
| 20–24 s | Diógenes | Pergunta final/wordmark/CTA sobre a folha; depois a folha sai e o território retorna. Diógenes não é discernível em 21,7–22 s. | Terminar com a procura e a luz da casa, não com uma tela analítica. |

O `CHAPTERS` lista os seis, mas presença no código não equivale a presença no filme. A variável global do retrato fecha entre aproximadamente **15,53 e 16,07 s** (`1 - ramp(t, 23.3, 24.1)`, com `t = seconds * 1.5`). Assim a seleção de Perseu/Diógenes não lhes garante exposição. A cena pode ter boas entradas e ainda falhar como apresentação de todo o elenco.

O movimento corporal era uma única animação de entrada: **12 px em Y, desfoque de 3 px para zero, 0,9 s**. As mãos, olhos, fios, chama, lanterna e paquímetro não se articulavam. Fotos eram stills com zoom de aproximadamente 1,02 a 1,13; não havia paralaxe física real ou ação no território. O principal movimento elaborado era **número → tabela → gráfico → folha que gira**. Esse mecanismo foi elogiado em críticas técnicas anteriores, mas agora o proprietário deixou explícito que não é o assunto que deseja para o filme de marca.

## Território anterior: referência documental, não mídia nova

| Fotografia | Dimensões desktop / mobile | Procedência documentada no acervo |
| --- | --- | --- |
| `public/g2/g22/real-brazil/itaipu-aerial.webp` / `itaipu-aerial-mobile.webp` | 1800 × 1920 / 780 × 832 | Itaipu, acediscovery, 02/01/2013, CC BY 4.0. |
| `public/g2/g22/real-brazil/itaipu-power-lines.webp` / `itaipu-power-lines-mobile.webp` | 1800 × 1201 / 780 × 520 | Itaipu, fotografada do lado paraguaio, Leandro Neumann Ciuffo, 04/11/2012, CC BY 2.0. |
| `public/g2/g22/real-brazil/itaipu-control-room.webp` / `itaipu-control-room-mobile.webp` | 1800 × 1350 / 780 × 585 | Itaipu, Anagoria, 20/11/2010, CC BY 3.0. |

Estas informações vêm do manifesto já existente `g2-2/real-brazil/runtime-provenance.json`; não houve nova auditoria de licenças na web neste subtrabalho. O que funcionava na abertura era a presença imediata de infraestrutura e escala reconhecíveis. Não proponho reutilizar a sala de controle como substituto de ação. Uma cena gerada a partir de um local real continua sendo interpretação editorial; não deve ser rotulada como filmagem documental do local.

## Proposta de coreografia, sem UI

Direção de montagem proposta, ainda não executada: **uma força percorre o Brasil e os gestos da NIVAR a tornam legível, cuidada e transmissível**. Ritmo com contrastes reais de escala e velocidade, sem preencher todos os planos com movimento idêntico.

1. **Energia / entrada, 3–4 s.** Travelling baixo sobre água em movimento em direção à massa de uma barragem; escala humana e matéria. O corte é motivado por uma aresta/curva do fluxo, não por um efeito de transição sobre uma fotografia parada.
2. **Hefesto / contato, 4–5 s.** Close de mão e paquímetro fechando sobre peça de cobre, com rosto concentrado em segundo plano; rápido deslocamento lateral revela o olhar e a bigorna. O contato do instrumento conclui uma ação visível. Corte de continuidade da aresta de cobre para um condutor realista.
3. **Ariadne / condução, 4–5 s.** O mesmo sentido de movimento entra em seu fio. Carretel gira pouco, uma mão puxa e a outra dirige; a curva solta ganha tensão. A câmera acompanha o fio e revela a face. O fio atravessa o quadro como elemento do mundo, não como linha de gráfico.
4. **Argos / escala, 4–5 s.** Rosto e mão em primeiro plano; a mão levanta o suficiente para ampliar a vista. Movimento de câmera motivado pelo olhar abre uma extensão de geração/transmissão brasileira. Manter os olhos na cabeleira estáveis e coerentes; evitar piscadas independentes grotescas.
5. **Sócrates / interrupção, 4–5 s.** O ritmo desacelera. Sua mão intercepta a passagem de uma folha e a abre; o foco migra entre dedo, intervalo e rosto. Uma mudança de luz revela uma segunda textura/camada. Não inserir números, pseudotexto ou gráfico para explicar a pergunta.
6. **Perseu / passagem, 4–5 s.** Mão eleva e oferece a chama de cobre; sombra e luz atravessam a gravura, a câmera contorna ligeiramente a palma e inclui o elmo/perfil. A energia luminosa é entregue adiante por corte motivado, sem virar um efeito de explosão ou personagem de fantasia.
7. **Diógenes / continuação, 4–5 s.** A luz da cena anterior encontra sua lanterna. Um deslocamento curto da mão/lanterna ilumina matéria e abre profundidade na direção do Brasil. Seu olhar acompanha. A assinatura NIVAR entra numa área de repouso suficiente para ser reconhecida; o filme termina com mundo ainda à frente.

Essa proposta ocupa cerca de **27–34 s**, a ajustar pela qualidade real dos planos gerados. Para um master maior, acrescentar um ou dois planos brasileiros entre gestos pode funcionar; não prolongar mãos imóveis até cumprir duração. Cada família deve receber pelo menos um plano com rosto **e** gesto inequívocos. Na versão vertical, reencenar ou reenquadrar os planos com mãos e objetos dentro do campo; crop automático central de um master largo pode amputar exatamente a identidade a preservar.

### Piloto Hefesto de 8 segundos: critérios concretos de curadoria

**0–1,5 s:** reconhecer imediatamente face, mão de medição, paquímetro, peça e plano da bigorna. A peça permanece firme na mão de apoio; o instrumento se desloca lateralmente pelo seu trilho, não por dobramento das hastes.

**1,5–3,5 s:** a mão de medição fecha a mandíbula móvel sobre a peça. O movimento para com um contato inequívoco entre as duas mandíbulas e as duas faces da peça; não esmagar metal, não atravessar a peça, não trocar o paquímetro por pinça. Rosto mantém concentração, com microajuste do olhar ao contato. **Esse contato é o evento decisivo do plano.**

**3,5–5 s:** Hefesto retira o instrumento e assenta a peça no plano da bigorna, com peso e apoio legíveis. O pequeno traço de cobre responde ao contato como luz rasante/material, sem números ou HUD. O gesto deve concluir antes da abertura de escala; um brilho que surge sozinho não substitui ação.

**5–8 s:** a câmera acompanha a aresta/linha de cobre já estabelecida e a usa para revelar, por corte motivado ou transição material clara, um condutor e grande infraestrutura hidrelétrica/transmissão brasileira em movimento. É metáfora de montagem: o personagem não é apresentado como causa factual de produção elétrica. Na abertura de escala, conservar um único sentido dominante de deslocamento e uma relação legível entre primeiro plano e território.

**Selecionar o piloto pelo que realmente aconteceu:** (a) rosto e gravura permaneceram os mesmos; (b) o calibre fechou fisicamente sobre a peça; (c) mãos e ferramenta mantiveram anatomia/topologia; (d) houve um segundo gesto concluído; (e) a escala abriu a partir desse gesto; (f) a energia apareceu como mundo vivo; (g) nenhum painel, escrita falsa ou adereço substituiu a ação. Se um piloto só fizer dolly sobre gravura, ele não supera o filme anterior. Se a ferramenta deformar na passagem para o Brasil, preferir uma boa ação preservada seguida de corte editorial controlado a uma transformação contínua defeituosa.

## Critérios de corte para a produção

- Um plano só entra se houver ação corporal ou material clara, começo e consequência; apenas pan sobre gravura não satisfaz o pedido.
- Reconhecer o representante com rótulos desligados. Personagem, gesto e objeto não podem desaparecer para acomodar copy.
- A mudança de câmera tem motivo: contato, tensão, olhar, exame, oferta, procura. Alternar aproximação, deslocamento e abertura; evitar seis zooms idênticos.
- Continuar o traço da gravura e o cobre contido entre planos. Não aceitar drift de rosto, dedos extras, paquímetro impossível, fio que teleporta ou chama que muda de posição sem a mão.
- Nenhum gráfico/tabela/dashboard como centro visual. A energia brasileira é mundo, matéria, escala e pessoas; o nome NIVAR encerra uma experiência de marca.
- Não declarar "obra de arte" ou superioridade sobre referências antes de ver os planos e o corte em tempo real. O próximo gate é a revisão do material efetivamente produzido.

Nenhum ativo, componente, rota, insígnia, finale ou funcionalidade do produto foi alterado por esta auditoria. Nenhuma geração, upload, crédito ou gasto foi executado.
