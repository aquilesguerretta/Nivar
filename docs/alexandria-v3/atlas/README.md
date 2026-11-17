# Atlas da Alexandria v3

O Atlas (`/alexandria/atlas`) é um mapa real do sistema elétrico brasileiro, dentro da casca v3 da Alexandria. Este
documento diz o que existe, onde está, como as aulas se ligam a ele e como os dados são atualizados. A procedência
de cada camada está em [`procedencia.md`](procedencia.md).

## Decisão: o globo Three.js saiu, o globo é o do Mapbox

O Atlas anterior desenhava o mundo com `react-globe.gl` (Three.js) e o Brasil como uma camada sobre a mesma esfera.
O novo usa **Mapbox GL em projeção globo**, e só ele. O argumento:

- **Um motor, uma câmera.** A mesma câmera vai do planeta inteiro até uma subestação, sem troca de cena. Com dois
  motores haveria uma costura (o globo de um lado, o mapa do Brasil do outro) e o leitor perceberia a troca.
- **O que o Atlas precisa mostrar é mapa.** Linhas de transmissão, 24 mil usinas, relevo, rios, foto de satélite e
  nome de lugar são trabalho de motor cartográfico. Refazer isso em Three.js seria reescrever o Mapbox pior.
- **Peso.** O `react-globe.gl` custava cerca de 600 KB só para esta rota. O `mapbox-gl` já está no projeto (o terminal
  americano usa) e fica em chunk próprio, carregado só aqui.
- **O Three.js continua, onde faz sentido:** as maquetes 3D são uma camada "custom" do Mapbox desenhada com Three no
  mesmo contexto WebGL, e só são baixadas quando o leitor aproxima.
- **O Titã voltou como gravura, não como cena.** A figura que segura o globo é a imagem da Alexandria posta por cima
  do globo do Mapbox, presa a ele quadro a quadro (seção "A abertura e o Titã").

O estilo do mapa não é um estilo pronto do Mapbox: é desenhado em `src/lib/alexandria/atlas/estilo.ts` sobre os tiles
vetoriais (papel e tinta no claro, tinta invertida no noturno), para o Atlas ser uma prancha do mesmo livro.

`react-globe.gl` ficou sem uso no `package.json` (fora da posse do Atlas: quem cuida da raiz pode remover).

## O que existe e onde

Caminhos sem prefixo são de `src/components/alexandria/atlas/`.

| O quê | Onde |
| --- | --- |
| Rota (carrega o Atlas por `React.lazy`) | `src/pages/alexandria/AtlasStub.tsx` (o nome ficou: é o que o roteador importa) |
| Página: estado, composição, endereço, gaveta do celular | `AtlasV3.tsx` |
| Única parte que fala com o mapbox-gl, e o invólucro React dela | `mapa/controleDoMapa.ts`, `mapa/MapaAtlas.tsx` |
| Gravura do Titã sobre o globo | `Frontispicio.tsx` |
| Símbolos de usina somados de longe | `mapa/generalizacao.ts` |
| Maquetes 3D (Three.js, sob demanda): só o desenho | `mapa/camada3d.ts` |
| Regra de colocação das maquetes (o que ganha maquete, onde, com que tamanho; sem Three.js) | `mapa/maquetes.ts` |
| Áreas de atuação das distribuidoras no mapa (camadas, carga, tons, rótulo, ordem) | `mapa/distribuicao.ts` |
| Camadas do combustível (rótulo, ordem, preparo) | `mapa/combustivel.ts` |
| "O comércio": camada (rotas, veículos, pontos por terra), dado tipado, painel, ficha, estilo | `mapa/comercio.ts`, `src/lib/alexandria/atlas/comercio.ts`, `paineis/PainelComercio.tsx`, `FichaDoComercio.tsx`, `atlas-comercio.css` |
| "Um dia real": camada do pulso, dado tipado, seção, ficha, estilo | `mapa/pulso.ts`, `src/lib/alexandria/atlas/operacao.ts`, `paineis/SecaoDiaReal.tsx`, `FichaDaOperacao.tsx`, `atlas-operacao.css` |
| Linha do tempo da frota: a regra (sem mapa), a seção e a régua compacta | `src/lib/alexandria/atlas/tempo.ts`, `paineis/SecaoLinhaDoTempo.tsx`, `atlas-tempo.css` |
| Quem é dono: a regra (sem mapa) e a seção | `src/lib/alexandria/atlas/donos.ts`, `paineis/SecaoDonos.tsx` |
| Painel de "A rede": estrutura, conta da tela, aulas do capítulo | `paineis/PainelRede.tsx`, `NestaTela.tsx`, `VistasDoCapitulo.tsx`, `atlas-rede.css` |
| Seção "Distribuição" (lente Rede do painel) | `paineis/SecaoDistribuicao.tsx` e `atlas-distribuicao.css` |
| Painéis dos outros capítulos, das aulas e das fontes | `paineis/` |
| Ficha do ativo, cartão da vista, busca, régua, gráficos | `*.tsx` da pasta |
| Ficha da distribuidora (sobreposição e procedência; o corpo fica em `FichaDoAtivo.tsx`) | `FichaDaDistribuidora.tsx` |
| Nome do cadastro em caixa de título, só na exibição (nenhuma letra acrescentada) | `nomes.ts` |
| Estilo da página | `atlas-v3.css` |
| Estilo do mapa e paleta (claro e noturno) | `src/lib/alexandria/atlas/estilo.ts` |
| Tipos e carga dos dados | `src/lib/alexandria/atlas/tipos.ts`, `dados.ts` |
| **Contrato com as aulas** | `src/lib/alexandria/atlas/nas-aulas.ts` |
| Dados publicados | `public/alexandria/atlas/dados/` |
| Gravura do Titã | `public/alexandria/gravuras/grav-atlas-segurando-o-globo.png` |
| Vistas publicadas | `public/alexandria/atlas/vistas.json` |
| Modelos 3D e as medidas deles | `public/alexandria/atlas/modelos/*.glb`, `modelos.json` |
| Gerador dos modelos e prancha | `tools/alexandria-atlas/modelos/`, `docs/alexandria-v3/atlas/modelos-folha.png` |
| Ferramentas (baixar, construir, verificar, capturar) | `tools/alexandria-atlas/` |
| Comércio exterior: baixar, construir, roteador das rotas, prova desenhada, medida da folga | `tools/alexandria-atlas/comercio/` (o README de lá tem os comandos) |
| Operação hora a hora: baixar e construir | `tools/alexandria-atlas/operacao/` (o README de lá tem os comandos) |
| Montagem das áreas das distribuidoras (Python + GDAL) | `tools/alexandria-atlas/concessoes/` |
| Bancada de colocação das maquetes | `tools/alexandria-atlas/medir-colocacao.mjs` |
| Plano de cenas da bancada | `tools/alexandria-atlas/bancada-colocacao.json` |
| Curadoria das vistas (fonte de verdade) | `tools/alexandria-atlas/vistas/mNN.json` |
| Leitura das 141 aulas | `docs/alexandria-v3/atlas/leitura/mNN.json` |

Arquivos de dados da onda 2: `submercados.geojson` (o Norte com Roraima, e Roraima à parte), `comercio-2025.json` e
`operacao-dias.json`. As usinas (`usinas-principais.json`, `usinas-menores.json`) ganharam as colunas `prec`, `rumoB` e
`etapas`. O `comercio-rotas-licenca.json` da primeira versão do comércio saiu do `public/` (só volta com `--marnet`).
A procedência de cada um está em [`procedencia.md`](procedencia.md), seções 1, 8, 9 e 9b.

### Os sete capítulos

1. **A rede** — usinas por fonte (símbolo de área proporcional à potência; de longe, somado com as vizinhas), linhas por
   tensão, bipolos de corrente contínua, subestações, áreas de atuação das distribuidoras, submercados, reservatórios,
   bacias, relevo, foto de satélite e maquetes 3D; no painel, a conta da tela, a linha do tempo da frota e quem é dono.
2. **A água** — energia armazenada por subsistema e por reservatório, mês a mês, de 2000 até a última data do ONS. O
   número grande é o armazenamento do SIN no mês; cada subsistema tem um quadro com o ano escolhido contra a faixa
   mínimo–máximo dos anos da série (`FaixasDoAno` em `graficos.tsx`).
3. **O combustível** — gasodutos de transporte, terminais de GNL, UPGN, refinarias, terminais de líquidos, campos de
   produção, blocos exploratórios, bacias sedimentares e o polígono do pré-sal (ANP), com as térmicas a gás, óleo e
   carvão do cadastro da ANEEL por cima. Seção própria abaixo.
4. **As trocas** — intercâmbio líquido entre os quatro subsistemas, mês a mês (setas esquemáticas, declaradas como tal;
   uma ponta só por fluxo, no destino, com o arco aparado na caixa do rótulo do nó). O número grande é o maior
   intercâmbio do mês; a data é o sobretítulo da régua.
5. **Um dia** — dois modos: "Média do mês" (o perfil horário médio de geração por fonte e de carga em cada
   subsistema, como antes) e "Um dia real" (seção própria abaixo).
6. **O mundo** — perfil elétrico de cada país (dado que já existia), no mesmo globo, aberto nas mãos do Titã.
7. **O comércio** — o que o Brasil vende e compra de energia, e por onde. Seção própria abaixo.

Atalhos de teclado: `1` a `7` trocam de capítulo, `A` recolhe o painel e pede tela cheia (de novo, volta), `/` vai à
busca, `?` mostra a lista. Não valem com Ctrl, Alt ou Meta nem com o foco num campo ou num controle deslizante.

### Rotas profundas

Como `AtlasV3.tsx` lê o endereço:

| Parâmetro | O que faz |
| --- | --- |
| `?c=rede\|agua\|combustivel\|trocas\|dia\|mundo\|comercio` | abre o capítulo; outro valor abre "A rede" |
| `?vista=<id>` | abre uma vista de aula |
| `?camada=<lista>` | liga camadas que abrem desligadas; aceita só `distribuicao`, `linhas-previstas`, `reservatorios`, `bacias` e `usinas-futuras` (`CAMADAS_POR_LINK`); outro valor é ignorado |
| `?cam=lon,lat,zoom[,inclinacao[,rumo]]` | lido uma vez, na abertura: vence o pouso padrão e a câmera da vista, e pousa exato (sem o deslocamento das margens). Fora da faixa (longitude ±180, latitude ±85, zoom 0 a 22, inclinação 0 a 85) é ignorado. Com zoom até o de repouso do Titã + 0,35 e inclinação abaixo de 8°, abre na composição do Titã, centrada no ponto do link (`titaSePerto`) |
| `?ano=AAAA` | ano da linha do tempo em "A rede" (quatro dígitos, de 1880 a 2100; depois de carregar as usinas, ano antes do primeiro do cadastro vai ao primeiro, e ano depois do último vira "hoje") |
| `?dono=<nome>` | dono destacado em "A rede"; o texto é normalizado pela regra dos donos, e dono que não existe na frota cai |
| `?dia=AAAA-MM-DD` | abre "Um dia" no modo dia real; dia que o arquivo não tem abre no último publicado |
| `?hora=0..23` | a hora do dia real (só com `?dia`; sem ela, 12h) |

O Atlas escreve de volta: `?cam` quando a câmera assenta, por `history.replaceState` (nenhuma entrada no histórico a
cada movimento); `?ano`, `?dono`, `?dia` e `?hora` com 400 ms de folga, lidos do endereço corrente no instante da
escrita, e de novo depois do Voltar do navegador. O botão "Link" (no celular, na folha "Mapa") copia o endereço.
Exemplos: `/alexandria/atlas?camada=distribuicao`, `/alexandria/atlas?ano=1990`,
`/alexandria/atlas?c=dia&dia=2026-11-14&hora=19`.

### A abertura e o Titã

A gravura do Titã segurando o globo (`Frontispicio.tsx`) fica por cima do mapa, com máscara circular no lugar do
globo, sem receber ponteiro e abaixo da busca, dos controles e da ficha. A cada quadro o controle entrega o globo na
tela (`seguirGlobo`, que avisa o `globoNaTela()`: centro projetado e raio do limbo) e a gravura se posiciona por ele. A geometria da imagem,
medida no alfa do arquivo, é `GRAVURA_DO_TITA` (`controleDoMapa.ts`): o círculo que encosta nas duas mãos; a máscara
corta as mãos no limbo, e por isso a figura lê como "segurando". A opacidade cai com a distância ao zoom de repouso
da composição (inteira até esse zoom + 0,1, nenhuma a partir de + 0,55) e com a inclinação (some em 8°). No noturno
a gravura leva `brightness(0.62) sepia(0.25)`. Em "O comércio" ela não aparece.

**A composição.** `comporTita` mede, para a tela atual, o zoom de repouso e o padding que põem o globo nas mãos,
dentro da área livre (entre a coluna e a ficha): com a ficha de um país aberta, a composição desliza para o novo
centro. Se o raio do globo ficar abaixo de 120 px (`RAIO_MINIMO_DO_TITA`), a gravura esmaece e fica só o globo
(é o que acontece no celular com a ficha aberta). O `minZoom` do mapa acompanha a tela: o menor entre 0,9 e o zoom de
repouso − 0,1. O padding só é diferente de zero na composição: todo voo o zera, e ele sai quando o zoom passa do de
repouso + 0,6 (`ZOOM_DE_SAIDA_DO_TITA`).

**Um pedido de câmera novo cancela os pendentes.** Cada pedido de câmera ganha um número (`geracaoDaCamera`) e para o
movimento anterior dentro de `novoPedidoDeCamera()`. O que nasce do fim de um voo interrompido (soltar o padding,
assentar na composição, recentrar depois da ficha, subir depois do voo) só age se o número ainda for o dele. Sem isso,
um `ir()` pedido durante o voo de abertura parava o voo, o Mapbox disparava o `zoomend` do voo velho dentro do pedido
novo, e o deslize que solta o padding regravava o centro antigo com o zoom novo: a câmera terminava no centro do
capítulo, sobre terra vazia (visto nas cenas de Santos da bancada, em 2 de 5 rodadas; depois do conserto, 15 de 15 em
cada cena e 6 de 6 por capítulo com o `ir()` em pleno voo, medidos pelo integrador em 17/11/2026).

**A abertura.** Sem vista, sem `?cam` e sem movimento reduzido, o mapa já nasce na composição (medida no
construtor, com `projection: 'globe'` posta ali), segura o Titã por 2,1 s depois do carregamento (`PAUSA_DO_TITA`) e
voa ao Brasil em 2,6 s. Qualquer gesto do leitor, botão ou pedido de câmera cancela o voo automático
(`cancelarVooDaAbertura`) e deixa a câmera onde o leitor a pôs. Com vista ou `?cam`, a câmera vai direto ao alvo, sem
Titã (salvo o `?cam` na escala da composição, acima). Com movimento reduzido, abre no Brasil, sem voo.

**Perto da composição a rede é silhueta.** Na escala do Titã o Brasil é só a silhueta dos submercados e a malha das
linhas em fio fino; símbolos de usina, anéis, selos, subestações e rótulos de submercado entram em rampa entre o
zoom de repouso + 0,25 e + 0,7 (`RAMPA_DA_REDE_NO_TITA`, relativa ao zoom de repouso, que no celular é menor). Usina
apagada pela rampa não responde a clique nem a pairar.

**Voltar ao Titã.** O botão "Globo" (acima de "Brasil"; no celular, na folha "Mapa") leva à composição; em "O mundo"
ele não aparece, porque o capítulo já abre nela e o botão "Mundo" leva a ela. Afastando à mão (ou voltando a 0° de
inclinação) até o zoom de repouso + 0,35 (`ZOOM_DE_ASSENTAR_NO_TITA`), a câmera assenta na composição (seco no
movimento reduzido). Na escala do Titã o botão "Inclinar" leva ao Brasil já inclinado, num voo só.

### Os símbolos de longe: a soma das vizinhas

O cadastro registra cada parque eólico e cada usina solar em separado (o maior registro eólico tem 105 MW), e um piso
de 300 MW por registro apagava as duas fontes no zoom do Brasil. Abaixo do zoom 10 (`ZOOM_SEM_AGREGACAO`), em cada faixa de zoom inteiro de 3 a 9 (o Mapbox avalia o
filtro no zoom inteiro do tile), `marcarGeneralizacao` (`mapa/generalizacao.ts`) junta as usinas em operação da
mesma fonte a menos de R px da maior, sem encadear, num símbolo só, **no ponto da maior**: ninguém sai do lugar. O
sobrevivente leva a soma (`s3`…`s9`, em kW) e o número de membros (`n3`…`n9`); o piso de desenho e o selo da fonte
leem a soma. A tabela por faixa é `REGRA_DA_FAIXA`:

| Faixa (zoom do tile) | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R (px) | 48 | 48 | 44 | 36 | 32 | 28 | 64 |
| Piso da soma | 300 MW | 300 MW | 200 MW | 30 MW | 5 MW | 1 MW | 0 |
| Selo da fonte a partir de | 1,5 GW | 1 GW | 600 MW | 200 MW | 60 MW | 20 MW | 5 MW |

- Nas faixas 3 a 6 só entram na soma registros de 5 MW ou mais (`KW_MINIMO_NA_SOMA_DE_LONGE`): a soma não muda
  quando o arquivo das menores chega. Da faixa 7 em diante (`FAIXA_DA_SOMA_COMPLETA`) entram todos.
- Usina de 3 GW ou mais nunca entra na soma de outra (`KW_NUNCA_NA_SOMA_DE_OUTRA`): Tucuruí tem símbolo próprio em
  todo zoom.
- Ficam fora da soma, sozinhas: usina que não está em operação, posição a confirmar e grupo gerador a óleo abaixo de
  5 MW.
- Na vista de aula nada é somado: o piso é o de `LIMIAR_POR_ZOOM`, pela potência própria, com a folga da vista.
- `REGRA_DAS_USINAS` (`controleDoMapa.ts`) é o filtro do mapa e a frase do painel ao mesmo tempo.

**Como se desenha.** Halo de papel em todo símbolo (`usinas-halo`) e um anel fino quando ele soma mais de uma usina
(`usinas-anel`); o selo da fonte entra desde o zoom 3, com colisão e prioridade pela soma, e os nomes dos estados
(`base-rotulo-uf`) ficam logo abaixo dele na ordem das camadas, para o selo ser colocado antes. O símbolo somado não
leva nome de usina no mapa. Ao pairar e na ficha: quantas usinas, a soma e a maior, com as dez maiores clicáveis e
"e mais N". No claro, a solar e a eólica são `#a87d1c` e `#0a8a85` (`estilo.ts`). A legenda diz, numa linha, que o
anel é soma do mapa e o raio em km daquele zoom.

**A ficha abre pelo objeto.** Clicada num símbolo somado, a ficha começa pela usina (nome, potência, ano, lugar, dono);
a soma vira a linha discreta "este símbolo soma N usinas · X GW · ver", refeita quando o zoom ou o ano mudam (some
quando a usina deixa de somar). As ressalvas (posição a confirmar, coordenada curta, desenho da barragem) e a fonte
ficam num único "Sobre este dado", recolhido.

### O painel de "A rede"

De cima para baixo (`PainelRede.tsx`):

- uma linha "Três aulas usam este capítulo" que abre a lista (`VistasDoCapitulo.tsx`, compacta em todos os capítulos);
- o sobretítulo do escopo: "Nesta tela" a partir do zoom 4 (`ZOOM_DA_CONTA` em `NestaTela.tsx`), "Brasil, no
  cadastro" abaixo dele, com o ano escolhido e a saída "voltar a hoje";
- o único número grande: GW e quantas usinas;
- a linha visível "Fonte: ANEEL, sem a geração distribuída (telhados).";
- a barra por fonte: cada fatia é um botão que liga ou desliga a fonte no mapa; desligada, fica hachurada e continua
  na conta;
- a régua compacta do ano (`ReguaCompactaDoAno`), colada ao número que ela muda;
- o alternador de lente **Fontes | Donos | Rede** (abas com setas do teclado; a lente escolhida é lembrada no
  navegador, em `localStorage`). Fontes: as cinco maiores, a legenda das fontes com a potência (acompanha o ano) e
  "Em construção", e, recolhido, o gráfico "A frota por período de entrada". Donos: a seção "Quem é dono". Rede: linhas,
  linhas sem entrada em operação, subestações, as legendas de tensão e porte e as áreas das distribuidoras;
- as camadas em fichas: Submercados, Reservatórios, Bacias, Relevo e Maquetes 3D, com o aviso das maquetes
  (`[data-atlas="resumo-maquetes"]`);
- um só "Como ler este mapa", com as seções A conta, Os símbolos, As maquetes, Linhas e subestações, O ano, Os donos e
  O território.

**A conta da tela.** Sai dos arquivos, não de `queryRenderedFeatures`: as usinas principais e menores em operação e
as linhas em operação dentro da área livre da tela (sem os painéis). De cima e sem rumo, a área é a caixa geográfica
(`limitesDaTela`); com a câmera inclinada ou girada, é o polígono da área livre levado ao chão (`poligonoDaTela`, 48
pontos; `contarNaCaixa(…, areaLivre)` em `NestaTela.tsx`, com a caixa como recuo), para a lista não trazer usina que
está fora da tela. Conta também o que o mapa não desenha naquele zoom, e diz isso. É refeita quando a câmera assenta (`aoAssentar`, chamada no `moveend` e de novo no quadro
seguinte, porque no globo a projeção só se atualiza um quadro depois do salto) e quando a área livre muda sem
movimento (coluna recolhida, ficha aberta, janela redimensionada). As maiores têm piso de 1 MW
(`PISO_DAS_MAIORES_KW`), até cinco, com o título por extenso ("A maior desta tela", "As três maiores…"), e aparecem
também no escopo do Brasil. As linhas: "N linhas de transmissão cruzam a tela, X km de ponta a ponta", contando os
trechos fora dela; se o arquivo das linhas falhou, o painel diz "As linhas de transmissão não responderam agora."
(carregando: "Carregando as linhas…"), nunca zero. Com um ano escolhido, a conta usa a potência daquele ano
(`kwNoAno`), as maiores são ordenadas por ela, e as usinas sem ano saem da conta numa linha à parte ("Fora da conta,
sem ano no cadastro: …").

### A linha do tempo da frota

Um ano escolhido faz o mapa mostrar só o que já operava naquele ano, e o painel contar o mesmo. A regra única de "já
existia no ano X" mora em `tempo.ts` (`kwNoAno`, `anoDeEntrada`, `faixasDoTempo`), usada pelo mapa, pela conta da
tela e pelo gráfico. O que é cada campo:

- **Usina, ano**: o ano de `DatEntradaOperacao` do SIGA (ANEEL), a entrada do empreendimento. Só usina em operação tem
  ano; o SIGA grava 1900 quando não tem a data, e o Atlas lê isso como ausência.
- **Usina, `etapas`**: para as usinas casadas com o cadastro de unidades geradoras do ONS (`CAPACIDADE_GERACAO.csv`,
  pelo núcleo do CEG), o construtor publica `[ano1, kWacum1, ano2, kWacum2, …]`: a potência acumulada até o fim de cada
  ano em que entraram unidades ativas (o setor de 50 Hz de Itaipu fica fora). O total é o da ANEEL; onde a soma das
  unidades do ONS difere, a forma vem do ONS e a escala da ANEEL (`kwAcum = kw × MW do ONS até o ano / MW do ONS no
  total`). São 1.961 usinas em operação (192,6 GW), 144 delas com mais de um ano; 19 divergem mais de 5% entre ONS e
  ANEEL; o índice dá a contagem e dez exemplos (`indice.json › camadas.usinas.etapasPorUnidade.divergenciaAcimaDe5PorCento`). Com etapas, a usina passa a existir na
  primeira etapa e conta, em cada ano, o que já tinha; sem etapas, entra inteira no ano do SIGA.
- **Linha e subestação**: `op` é o ano de entrada em operação; `opAntesDe` é o ano da data de carga da base, gravado
  no lugar da entrada nos ativos antigos (o ativo já operava naquele ano, não se sabe desde quando). Sem os dois: sem
  entrada em operação (prevista).

O resultado em 1990, conferido sobre os arquivos publicados: 50,1 GW em 641 usinas (sem as etapas eram 57,8 GW em
638), com Tucuruí em 3,5 GW e Itaipu (parte brasileira) em 4,9 GW. As 156 usinas em operação sem ano (499 MW) ficam
num estado próprio: fora da conta, em contorno de tinta suave, sem a cor da fonte, e só aparecem de perto (são
pequenas); nunca no ano zero. Usina futura, linha e subestação previstas saem com um ano escolhido. A linha do tempo
é a idade da frota de **hoje**, não a história da matriz: usina desativada não está no cadastro. A tela diz isso
junto do gráfico e sob a régua (`FraseDaRegra`): só usinas que operam hoje, quantas têm a data de cada unidade no
cadastro do ONS, e que as outras entram inteiras no ano da ANEEL.

**Controles.** A régua compacta vai do primeiro ano do cadastro a "hoje" (o degrau depois do último ano; "hoje" inclui
as sem ano, o último ano não), com o histograma de entrada por ano como fundo do trilho e o botão de tocar, que avança
um ano a cada 110 ms até "hoje" e não existe no movimento reduzido. O gráfico por períodos de cinco anos, por fonte,
mostra cheio o que já entrou até o ano escolhido sobre a barra do período inteiro. Durante o arrasto e o tocar, o
mapa aplica só o filtro barato (a soma do símbolo só da faixa da câmera) e refaz a soma inteira ao soltar. Roraima
fica fora do Norte com um ano anterior a 2025 (seção "Submercados").

### Quem é dono

A seção "Quem é dono" (lente Donos) lista os maiores donos por potência em operação, do campo de proprietário do SIGA:
oito, ampliáveis a 25, com busca. Clicar num dono destaca as usinas dele no mapa (as demais recuam a 18%, sem selo nem
rótulo, nunca em óxido; o símbolo do dono tem raio mínimo de 5 px, `PISO_DO_DONO`, e todas as usinas dele entram,
inclusive as menores) e abre a lista das maiores dele; clicar de novo desfaz. A regra está no topo de `donos.ts` e é
dita sob "Como ler", com as contagens:

- é o dono **direto**, com a participação declarada, não o controlador final; empresas do mesmo grupo ficam separadas,
  e nada se junta por conhecimento de fora do arquivo;
- a parte de cada dono é a potência da usina vezes a fração declarada; participação repetida e igual conta uma vez;
  frações que somam mais de 100% são divididas pela soma; "Não Informado" é ausência de dono; o SIGA corta o texto em
  500 caracteres, e a participação cortada fica ilegível;
- a chave junta grafias por regra mecânica (sem acento, caixa alta, pontuação vira espaço, "S.A."/"S/A"/"SA" viram
  "SA", "LTDA." vira "LTDA"); a forma societária fica, e o regime (PIE, SP, APE, REG) sai da chave.

Os donos são os de hoje: não acompanham o ano.

### O combustível

De onde vêm o gás e o óleo que as térmicas queimam. Os dados são as camadas do GeoServer da ANP (WFS), gerados por
`construir.mjs` em `public/alexandria/atlas/dados/combustivel-*.geojson` e resumidos no bloco `combustivel` de
`indice.json` (contagens, fontes, licença como declarada, ausências, repetições). A procedência está na seção 6 de
[`procedencia.md`](procedencia.md).

| O quê | Onde |
| --- | --- |
| Camadas do Mapbox e preparo dos dados (rótulo, ordem) | `src/components/alexandria/atlas/mapa/combustivel.ts` |
| Quando cada camada aparece, carga sob demanda, clique, destaque | `mapa/controleDoMapa.ts` (como as outras camadas) |
| Símbolos, larguras e cores (mapa e legenda) | `src/lib/alexandria/atlas/estilo.ts`, seção "a linguagem do combustível" |
| Painel do capítulo | `paineis/PainelCombustivel.tsx` e `atlas-combustivel.css` |
| Ficha de cada tipo | `FichaDoAtivo.tsx`, função `fichaDoCombustivel` |

**Linguagem cartográfica.** O gasoduto é traço contínuo na cor da fonte "gás natural" (a mesma da usina a gás), com
casco de papel; a espessura cresce com o diâmetro nominal declarado, e trecho sem diâmetro na fonte fica com o traço
mais fino. Nas instalações a **forma** diz a função e a **cor** diz o fluido: hexágono é processamento (refinaria,
UPGN), losango é terminal (GNL, líquidos); cor do óleo para refinaria e terminal de líquidos, cor do gás para UPGN e
GNL. O terminal de líquidos, o mais numeroso, é só contorno. Nenhuma instalação é círculo nem quadrado (essas formas
são das usinas). Campo de produção: preenchimento translúcido na cor do fluido principal declarado, com fio; bloco
exploratório: só fio; bacia sedimentar: areia acinzentada (`PALETA.sedimento`); pré-sal: limite tracejado com o nome
ao longo da linha. As instalações ficam acima do selo das usinas e entram na colisão: onde um terminal e uma usina
estão no mesmo ponto, o selo cede e a usina segue no símbolo proporcional.

**Camadas.** Ligadas ao abrir: gasodutos, GNL, UPGN, refinarias, campos e pré-sal. Desligadas (contexto pesado):
terminais de líquidos, blocos e bacias sedimentares. Cada arquivo só é baixado quando uma camada ligada, um destaque
ou a seleção pede. As usinas do capítulo são as das fontes gás natural, óleo e diesel e carvão, com as mesmas chaves
do capítulo A rede (o estado das chaves é compartilhado).

**O que a interface declara** (tudo lido do índice, nada fixo no código): que as linhas são só gasodutos de
transporte (sem escoamento, distribuição nem oleodutos); que a capacidade dos terminais de GNL e a área e lâmina d'água
dos campos não têm unidade declarada; que a licença não é declarada pela ANP; e, no painel de fontes, as dez
ausências do bloco `combustivel`, os dois registros repetidos de gasoduto e as datas ilegíveis.

**Busca.** Gasoduto (pelo nome do duto e do trecho), refinaria e terminal de GNL (pela sigla e pelo nome), UPGN,
terminal de líquidos, campo e bacia sedimentar. Esse índice chega à parte e não atrasa o resto da busca.

**Vista de aula no capítulo.** `capitulo: "combustivel"`, `camadas` com as camadas do capítulo que a vista quer
ligadas (e `gas`, `oleo`, `carvao` se as usinas devem aparecer) e `destaque.combustivel` com os `id` da ANP
(prefixos `gd-`, `refinaria-`, `gnl-`, `upgn-`, `terminal-`, `campo-`, `bloco-`, `bacia-sed-` e `presal`; ache com
`node tools/alexandria-atlas/buscar.mjs gasoduto|refinaria|gnl|upgn|terminal|campo|bloco|bacia-sedimentar "<termo>"`).
O verificador exige ao menos um destaque, que o id exista, que a camada de cada id destacado esteja em `camadas` e
que a usina destacada tenha a fonte dela ligada; `destaque.combustivel` fora deste capítulo é erro. Exemplo:

```json
{
  "id": "m03-a06-onde-o-gnl-atraca",
  "modulo": "modulo-03",
  "aula": 6,
  "titulo": "Onde o GNL atraca: o terminal de Santos",
  "capitulo": "combustivel",
  "camera": { "limites": [-46.75, -24.1, -46.1, -23.7] },
  "camadas": ["gas", "oleo", "carvao", "gasodutos", "gnl", "upgn", "refinarias", "campos", "presal", "relevo"],
  "destaque": { "combustivel": ["gnl-terminal-de-regaseificacao-de-gnl-de-sao-paulo-trsp", "refinaria-rpbc"] },
  "satelite": false,
  "momento": null,
  "trecho": { "texto": "…frase literal da aula…", "arquivo": "src/lib/data/alexandria-modulo-03-content.ts", "linha": 296 },
  "nota_de_dado": "A camada da ANP traz só os gasodutos de transporte."
}
```

### O comércio

O que o Brasil vende e compra de energia em 2025, e por onde. Fonte, acesso, licenças, hashes e a conferência estão
na seção 9 de [`procedencia.md`](procedencia.md); os comandos, em `tools/alexandria-atlas/comercio/README.md`.

**O arquivo** (`comercio-2025.json`, 183.466 bytes). Comex Stat (MDIC), 2025 fechado, nos dois sentidos, por NCM ×
país × URF × via; ONS para a eletricidade física. Blocos principais (há também `ano`, `geradoEm`, `semAncora`, para a URF sem ponto, e
`paisesComo` e `paisesCodigo`, que dizem como o ponto e o código de cada país foram obtidos): `fontes`; `leia` (as dez frases que a interface tem de dizer
ao leitor); `produtos` (15); `ancoras` (uma por URF, com a coordenada da ANAC para aeroporto, de um terminal da ANP
quando é o único do município, ou da sede municipal do IBGE, e de onde ela veio: a URF é a unidade de despacho, não o
cais); `paises` (ponto e como foi obtido); `fluxos` (172: produto × sentido × país × via, com 1% ou mais do produto
no sentido); `rotas` (96: 67 marítimas e 29 arcos aéreos); `viagens` (as 120 **remessas**, 58 de exportação: um
produto, de uma URF de despacho para um país, somado no ano, com `kt`, `fobUS`, parte do produto e a classe do
veículo); `condutos` (o gás da Bolívia, por duto, em Corumbá); `eletricidade` (Argentina e Uruguai mês a mês, do ONS,
as interligações, a nota de Itaipu e a importação do Paraguai no Comex); `conferencia` (contra a ANP e o ONS).

**As rotas são nossas e esquemáticas.** `roteador.mjs` calcula cada rota marítima sobre o Natural Earth 10m (países e
ilhas pequenas como terra; domínio público), numa grade de busca de 0,1°, fechada ao sul de 50° S e ao norte de
71,5° N, com alisamento em Mercator que não toca terra. As escolhas de modelo estão escritas no arquivo
(`fontes.rotas.escolhasDeModelo`): a **folga da costa** (o custo do passo cresce rente à terra, até 45 km dela, para a
rota correr ao largo em mar aberto e pelo meio do canal nos estreitos) e o custo maior entre 38° S e 48° S. Cada rota
marítima (67) traz `km`, `ligacaoKm` (da âncora até o mar), `chegadaKm`, `sobreTerraKm` (0 nas 67) e `folgaMinKm` (a
menor folga da terra fora das pontas: 2,1 km nas rotas da Rússia, no meio do Øresund; mediana de 21,4 km); os 29 arcos
aéreos não têm os dois últimos. A rota começa no mar
mais perto da âncora (Manaus fica a 1.070 km do mar, Porto Alegre a 102 km) e **termina** na célula de mar junto ao
maior polígono do país que fica mais perto da origem em quilômetros pelo mar: o custo da folga decide o caminho, não
o destino. Por isso as rotas da Rússia saídas de Paranaguá, Santos, Rio de Janeiro e Maceió terminam no golfo da
Finlândia, e a de Manaus no mar de Barents. A ficha de toda rota diz, numa linha, onde ela termina e por quê, e dá o comprimento arredondado a centenas
("≈ 14.200 km").

**Portões.** O Canal do Panamá é um portão entre Cristobal e Balboa, os dois portos da camada `ne_10m_ports` do
Natural Earth. Suez não tem portão: a mesma camada traz Port Said e não a ponta sul, e sem as duas pontas com fonte
não há passagem; a rota para a Arábia Saudita dá a volta pela África e leva o campo `contorno`, que a ficha mostra.
A variante sobre a rede MARNET do Eurostat (EUPL 1.2) fica atrás de `construir.mjs --marnet`.

**A via aérea.** O Comex registra querosene de aviação exportado por aeroportos com via "aérea". Esses fluxos são
arcos de círculo máximo do aeroporto (ponto da ANAC) ao centro do país (`metodo: "arco"`), calculados pela NIVAR e
declarados como não sendo rota de voo; a ficha cita a frase do arquivo sobre o que a fonte diz e o que não diz (não
diz se é carga ou combustível posto na aeronave). Destino "Brasil" e URF de interior não têm arco.

**Por terra.** As interligações elétricas (Garabi I e II, Rivera, Acaray) são pontos clicáveis com ficha própria: os
doze meses de 2025 nos dois sentidos, do ONS. A série do ONS é por país, não por conversora, e cobre as horas que o
ONS publicou: a ficha diz "soma das N horas que o ONS publicou" (na Argentina, 8.424 de 8.760), e o gráfico marca os
meses incompletos com barra vazada. A via que o Comex dá à eletricidade aparece como "via declarada no despacho:
rodoviária". A importação do Paraguai no Comex fica numa linha à parte, só em valor (URF não informada: o Comex não
diz por onde entra); Acaray fica como a conversora que o ONS cita, e a nota de Itaipu diz que a quantidade não está em
nenhuma fonte usada. O gás da Bolívia é um ponto em Corumbá, com ficha.

**O desenho** (`mapa/comercio.ts`). Ao abrir: exportação, as maiores remessas (as 15 maiores por mar mais as 2
maiores por ar, `MAIORES` e `AEREAS_ENTRE_AS_MAIORES` em `src/lib/alexandria/atlas/comercio.ts`; com um produto
isolado, as 15 maiores dele por qualquer via). O leitor troca para importação ou "as duas", isola um produto ou pede
todas. A rota é linha nativa do mapa em três espessuras por tonelagem; tinta na exportação, ouro na importação, a
selecionada (e só ela) em óxido; a aérea, tracejada. Em "todas", as que estariam entre as maiores do mesmo recorte
ficam cheias e com veículo, e as demais viram fio fraco, sem veículo; a aérea fora das maiores só aparece com o
querosene isolado. Os países parceiros ganham um tom leve que some em rampa entre os zooms 3 e 3,8
(`TOM_DOS_PARCEIROS`: de perto o polígono grosseiro corta o mar). Trocar o sentido ou o produto derruba a seleção e
volta à câmera do capítulo quando o Brasil saiu da tela. A câmera de abertura é `CAMERA_DO_COMERCIO` (`AtlasV3.tsx`).

**Os veículos.** Silhuetas desenhadas em código (imagens SDF), viradas no rumo da rota, na cor do sentido, uma por
classe: petroleiro (líquidos), graneleiro (carvão e coques), gaseiro (GNL e GLP), carga (urânio, que vai em
contêiner) e avião. Por remessa, `clamp(round(√(kt/1000)), 1, 4)`, com teto de 40 na tela (`veiculosDaViagem`,
`TETO_DE_VEICULOS`). Andam com fase por índice, sem acaso, a uma velocidade ilustrativa (`VELOCIDADE`: 320 km de rota
por segundo no mar, 700 no ar), dita como ilustrativa no "Como ler"; a posição vai ao mapa a no máximo ~20 Hz, só com
o capítulo aberto e a aba visível. A partir do zoom 4 (`ZOOM_DO_PORTO`) o primeiro veículo de cada remessa anda num
trecho junto do porto, para a ponta da rota não ficar vazia. O lado de trás do globo esconde rota e veículo (são
camadas nativas). No toque, vence o veículo mais perto do dedo num raio de 22 px, e no empate de 4 px o de mais
toneladas; o avião tem prioridade num raio de 30 px. Movimento reduzido: veículos parados, espalhados ao longo do
traçado (nenhum par no mesmo ponto), sem laço.

**A ficha** (`FichaDoComercio.tsx`) tem três degraus: o título; uma linha de onde → para onde · peso · valor; e um
único "Sobre este dado" recolhido, com a URF ("não o cais"), o país declarado (pode ser entreposto ou bandeira), a
parte do produto, a via, a rota esquemática, onde ela termina, as fontes e o acesso. Nome de arquivo não aparece na
tela.

**O painel** (`PainelComercio.tsx`): uma frase-número montada do arquivo; o alternador de sentido (em "as duas",
"saiu" e "entrou"); os produtos com barra (urânio e eletricidade, medidos em valor, à parte); a lista de remessas ("As
17 maiores remessas", "Todas as 120 remessas"), com a linha visível de que as rotas são esquemáticas; "Por terra"; e
"Como ler" recolhido, com o bloco `leia` e a conferência.

### Um dia real

O modo "Um dia real" do capítulo "Um dia" (alternador "Média do mês | Um dia real"; o arquivo só é buscado quando o
leitor escolhe o modo) mostra cada usina que o ONS despacha com a geração da hora e, nas eólicas e solares, o corte
que o ONS estimou. Fonte e procedência: seção 9b de [`procedencia.md`](procedencia.md); comandos e casamento em
`tools/alexandria-atlas/operacao/README.md`.

**O arquivo** (`operacao-dias.json`, 461.765 bytes, em colunas de inteiros, MW médios na hora). Os dias seguem a regra
gravada em `regraDosDias`: o dia de maior carga do SIN em cada um dos quatro últimos trimestres fechados (a maior soma
das 24 horas de `val_carga` do SIN no balanço do ONS) e o último dia inteiro nas quatro bases (geração por usina,
corte eólico, corte fotovoltaico e balanço). Hoje: 02/12/2025, 19/02/2026, 07/04/2026, 30/09/2026 e 14/11/2026; cada
um leva a sua `razao`, que o seletor mostra.

- **Entidades** (644): usina casada pelo núcleo do CEG (a chave publicada é o CEG da ANEEL), ou conjunto do ONS como
  entidade própria, no centro dos membros que o Atlas posiciona, com a lista dos membros. A geração do conjunto **não
  se reparte** entre os membros. Os membros são os do dia mostrado quando a composição muda entre os dias
  (`membrosNoDia`); o ponto do conjunto é o do dia mais novo, e a ficha diz.
- **Itaipu** 60 Hz e 50 Hz são duas entidades; a de 50 Hz nunca entra na soma do Brasil e é desenhada encostada à de
  60 Hz, a oeste (deslocamento pictórico, dito no "Como ler"). Um CEG que o ONS publica em mais de uma linha (Belo
  Monte e Pimental, por exemplo) fica em entidades separadas no mesmo ponto (`cegEmLinhas`), e a ficha diz que a
  potência da ANEEL é a da usina inteira.
- **Sem ponto no mapa**: pequenas usinas e Tipo III por estado, que o portal do ONS publica como previsão, vão num
  bloco à parte, somado por hora e marcado como previsão.
- **Corte**: dos conjuntos `restricao_coff_eolica_usi` e `restricao_coff_fotovoltaica`, a hora como média das duas
  meias-horas. O campo se chama `naoRealizadaEstimada`: é estimativa do ONS. O motivo vem por hora (REL, CNF, ENE,
  PAR), com a origem (LOC, SIS) e o texto do fluxo controlado mais frequente. Entra no corte só quem perdeu ao menos
  0,5 MWh no dia.
- **Subsistema**: para dois conjuntos o arquivo mensal de geração dá um subsistema diferente do que o balanço do ONS
  conta; o Atlas usa o do balanço, grava a divergência por dia (`subNoDia`, `conferencia.subsistemaDoArquivoDoMes`) e a
  ficha a declara.
- **Conferência** gravada por dia: a soma publicada contra o balanço por subsistema. O Sudeste só fecha somando a
  Itaipu 50 Hz, porque o balanço conta as duas. A parte da energia do dia com ponto no mapa vai de 78,7% (14/11/2026) a
  88,1% (07/04/2026).
- Entidade listada no dia sem valor publicado (vazio, não zero) não é desenhada, nem quando tem corte; a lista do
  corte a marca "sem geração publicada no dia, fora do mapa".

**O desenho** (`mapa/pulso.ts`). Disco na cor da fonte com área proporcional à geração da hora (raio r0 + k(zoom)·√MW,
`K_POR_ZOOM`); o corte é um anel vazado em volta, cuja área soma a geração e o corte estimado, na cor da fonte e nunca
em vermelho. Piso por zoom (`PISO_POR_ZOOM`, escrito no "Como ler"): 150 MW na hora com o Brasil inteiro, descendo a
60, 20, 5 e 1 MW e a nenhum piso do zoom 7,4 em diante; quem não gera aparece só de perto, como anel mínimo. A troca de
hora ou de dia anda em ~0,9 s; movimento reduzido: seca. No capítulo, os discos por subsistema da média do mês saem e
os submercados ficam de fundo.

**O painel** (`SecaoDiaReal.tsx`): o seletor dos dias com a razão de cada um; a hora (régua e "Tocar o dia", uma hora
por segundo; no movimento reduzido não toca sozinho); o número grande é a **geração verificada** no Sistema Interligado
na hora (as entidades, sem a Itaipu 50 Hz), e a previsão do ONS vem numa linha à parte, com o total; a barra por fonte
mostra a parte prevista vazada; a carga; o corte da hora com o motivo dominante. Na lista, "Outras térmicas" (no ONS
essa categoria não diz se é fóssil). A escolha de uma entidade na lista enquadra o mapa nela.

**A ficha** (`FichaDaOperacao.tsx`): a curva das 24 horas (geração em área, corte estimado tracejado por cima, cursor
na hora), o motivo com o texto da fonte entre aspas, a origem, os membros do conjunto (clicar abre a usina do Atlas,
`ceg:<CEG>`, sem sair do capítulo), fonte e data. A média do mês continua intacta; no celular, o raio máximo dos seus
discos depende da largura útil e do espaço entre os nós.

### Submercados: Roraima no Norte

O Atlas tem arquivo próprio de submercados (`submercados.geojson`), montado por `construir.mjs` a partir dos dois
arquivos do IBGE do Portal BR (que não são alterados): o trecho do anel do Norte entre os dois tríplices de Roraima
troca a divisa com o Pará e o Amazonas pela fronteira internacional do estado. O construtor para se não achar os
tríplices, se houver autointerseção ou se o ganho de área se afastar da área oficial do IBGE; as conferências estão no
`provenance` do arquivo e na seção 8 de [`procedencia.md`](procedencia.md). O "Como ler" dos capítulos que pintam os
submercados diz: "Roraima entrou no Norte em
setembro de 2025, pela linha de 500 kV Manaus – Boa Vista (entrada em operação em 16/09/2025 no cadastro do ONS). Os
números do Norte incluem Roraima desde então, sem separar o estado." (`NOTA_RORAIMA`).

**Antes de setembro de 2025** Roraima não era Norte. O arquivo traz, no topo da coleção, o membro `roraimaAParte`
(`primeiroMesNoNorte` "2025-09", `primeiroAnoNoNorte` 2025, o polígono de Roraima e o Norte sem ele). Em "A água" e em
"As trocas" com a régua num mês anterior (`mesDosSubmercados`), e em "A rede" com um ano anterior a 2025, o mapa
desenha o Norte sem Roraima e Roraima só em contorno tracejado, sem preenchimento (`roraima-fio`). Em "A água" e em "As
trocas" aparece sob a régua "Roraima no Norte a partir de set/2025; antes disso ela não estava ligada ao sistema
interligado." (`notaDeRoraima`, em `paineis/Tempo.tsx`). Em "A rede" a régua do ano não diz isso: só o "Como ler"
(`NOTA_RORAIMA`).

### Áreas de atuação das distribuidoras

Uma área por distribuidora, a área de atuação que ela mesma declara à ANEEL na BDGD (camada ARAT). Não é o ato de
outorga. Fonte, acesso, licença, hash e método estão na seção 7 de [`procedencia.md`](procedencia.md).

**O dado.** `public/alexandria/atlas/dados/distribuicao-areas.geojson`, resumido no bloco `distribuicao` de
`indice.json`: 102 áreas, 51 de concessionárias e 51 de permissionárias (68 `Polygon`, 34 `MultiPolygon`). Cada feição
traz `codigo` (código ANEEL), `nome`, `tipo`, `contrato`, `codArat`, `dataBase` e `item`. 99 têm data-base 31/12/2025
e 3 têm 31/12/2023. Quatro distribuidoras não têm área no arquivo: CFLO (84), CNEE (75), EDEVP (5217) e EEB (386), cuja
BDGD é de 2016 e não tem camada ARAT. Os outros oito códigos fora do arquivo são sucedidos por fusão (lista em
`fora.sucedidas` do índice).

**Como é desenhada** (`mapa/distribuicao.ts`). Só no capítulo "A rede", desligada ao abrir. Cada concessionária leva
um de cinco tons de tinta (0 a 4, opacidades em `TONS_DA_DISTRIBUICAO` de `estilo.ts`), por coloração gulosa: vizinhas
(bordas a menos de ~4 km, grade de 0,04°) não repetem tom quando há tom livre. A permissionária vai por cima, com
preenchimento próprio e fio tracejado. O nome de cada área entra no ponto mais longe da divisa e só a partir do zoom
inteiro em que cabe dentro dela, entre os zooms 5 e 11 (a permissionária nunca antes do 7). Desligada, a camada mora
no fundo, logo abaixo dos submercados (`FUNDO`). Ligada, sobe para o topo das camadas de dado com um véu de papel
(`VEU`: 0,55 no claro, 0,72 no noturno) que cobre linhas, subestações, usinas e os nomes delas: a rede fica em segundo
plano. O preenchimento dos submercados vai a zero (fica o fio e o nome); as marcas de chão (anel da seleção, do
destaque e do conjunto, âncora) e a camada 3D sobem junto, por cima do véu.

**Clique e ficha.** A permissionária responde antes da concessionária que a contém (`ALVOS_DA_DISTRIBUICAO`); a bacia
hidrográfica, quando ligada, responde antes das duas. A ficha mostra outorga, contrato, data-base do dado, código
ANEEL e, quando outra área cobre o ponto do clique, a linha "Sobreposição" (calculada da geometria publicada naquele
ponto). O rodapé declara que é a área declarada pela distribuidora, não o ato de outorga, com o contorno simplificado,
e cita ANEEL, BDGD, camada ARAT, data-base e acesso.

**Busca.** Pelo nome e pelo tipo de outorga. O resultado leva ao capítulo da rede, liga a camada e abre a ficha; se o
arquivo ainda não chegou, o mapa enquadra a área na chegada.

**Rota.** `/alexandria/atlas?camada=distribuicao` abre com a camada ligada.

**O que a interface declara** (seção "Distribuição", na lente Rede do painel; contagens lidas do índice): a chave "Áreas de atuação
das distribuidoras" com o total; a legenda "Concessionárias" e "Permissionárias, por cima" com a contagem de cada
uma; a linha das distribuidoras sem área no arquivo, pelo nome; com a camada ligada, "Com as áreas ligadas, a rede
fica em segundo plano."; se o arquivo não carregar, "Áreas indisponíveis agora: o arquivo não carregou. Desligue e
ligue a chave para tentar de novo."; e, sob "Como ler", as datas-base com a contagem de cada uma. Em "Fontes e
licenças" ficam a nota, as ausências e as fusões.

**Refazer o dado.** As ferramentas de `tools/alexandria-atlas/concessoes/` (o README de lá tem os comandos):
`listar-bdgd.mjs` lista os itens e a data-base de cada distribuidora; `extrair_arat.py` lê só a camada ARAT por
requisição de faixa HTTP, sem baixar o `.gdb.zip` inteiro; `construir_areas.py` monta o GeoJSON publicado;
`validar_areas.py` confere; `prancha.mjs` desenha o arquivo em PNG para conferência visual. Depois,
`construir.mjs` lê o arquivo e grava o bloco `distribuicao` do índice, e `gerar-procedencia.mjs` regrava a seção 7.

### O celular

Até 860 px de largura o painel é uma gaveta com três alturas: fechada (só o puxador), meia (40% do palco) e
aberta. Ela desce sozinha da aberta para a meia quando muda algo que mexe no mapa (ano, dono, filtro do comércio, dia
ou hora, mês, modo do mundo, camadas, capítulo): a regra olha o estado, não cada controle. Na meia altura o controle
tocado é rolado para a faixa visível e a câmera põe o centro no meio da faixa livre de cima, sem mudar o zoom (depois
de uma troca de capítulo, espera o voo assentar). Fechada, o puxador carrega numa segunda linha, com alvo de 44 px, o
estado ativo e a saída dele ("até 1970 · voltar a hoje", "<dono> · desfazer", "18h · 14 nov 2026 · média do mês",
"Importação · desfazer").

A folha "Mapa" (camadas, satélite, "Globo", "Link") cresce para cima, acima do puxador, e fecha depois de uma
escolha. Os créditos do mapa abrem por um "i" de 44 px ao lado do logotipo. A ficha sobe até 46% do palco e a câmera
enquadra o selecionado na faixa de cima; ao fechar a ficha, a câmera recentra o que estava selecionado, e "+"/"−"
aproximam em torno do último selecionado enquanto ele estiver na tela (isto vale em toda largura). No celular cabem
três maquetes por tela (seção "Regra de colocação das maquetes").

**Foco.** Com o canvas focado pelo teclado (`:focus-visible`), o mapa ganha um fio de 1 px de tinta por dentro, não
uma moldura de óxido; depois de Esc o foco volta ao canvas.

## Como ligar o Atlas nas aulas

O Atlas **não edita** os componentes de aula. Ele entrega um contrato, e quem cuida da aula decide onde mostrar.

```ts
import { vistasDaAula } from '@/lib/alexandria/atlas/nas-aulas';

const vistas = vistasDaAula('modulo-08', 5);
// → [{ id, moduloId, aula, titulo, capitulo, rota }]   ([] quando a aula não tem geografia)
```

- `rota` é `/alexandria/atlas?vista=<id>`: o Atlas abre já enquadrado, com a frase da aula e o botão "Abrir a aula".
- O arquivo é leve (só o índice) e **não puxa o mapa** para o bundle da aula.
- `vistasDoModulo(moduloId)`, `vistaPorId(id)` e `coberturaDasVistas()` completam a leitura.

Sugestão de uso na aula (decisão de quem cuida da aula; nada disto está implementado nos componentes de aula):

```tsx
const vistas = vistasDaAula(modulo.id, aula.numero);
{vistas.length > 0 && (
  <aside aria-label="Esta aula no Atlas">
    <p className="v-dado">No Atlas</p>
    <ul>
      {vistas.map((v) => (
        <li key={v.id}>
          <Link to={v.rota}>{v.titulo}</Link>
        </li>
      ))}
    </ul>
  </aside>
)}
```

Para ancorar o link junto do parágrafo certo, cada vista em `public/alexandria/atlas/vistas.json` traz
`trecho.texto`, `trecho.arquivo` e `trecho.linha`: é a frase literal da aula, com o arquivo e a linha de onde saiu.

### O que é uma vista

Um enquadramento do mapa que ilustra **uma frase de uma aula**: câmera, capítulo, camadas ligadas, o que fica em
destaque, opcionalmente um mês (água, trocas, um dia) e a foto de satélite. Regras que o verificador impõe
(`tools/alexandria-atlas/verificar-vistas.mjs`):

- a citação é **substring exata** de uma linha do arquivo-fonte da aula;
- todo ativo destacado **existe** nos dados do Atlas;
- vista de rede ou de água precisa de pelo menos um destaque real; de mundo, de pelo menos um país;
- o título e a nota são texto do Atlas (não da aula): a nota diz o que o mapa mostra **a menos** do que a frase.

Publicar: `node tools/alexandria-atlas/gerar-vistas.mjs` (recusa-se a publicar se o verificador acusar erro).

### O que ficou sem vista

`docs/alexandria-v3/atlas/sem-vista.json` lista, por aula, o que a aula cita e o Atlas não consegue mostrar, com o
motivo. É a fila de trabalho da próxima rodada de dados (irradiação, por exemplo). Os registros que citam gasodutos,
terminais de GNL e refinarias já podem virar vista no capítulo "O combustível".

As áreas de atuação das distribuidoras já são camada (seção acima), e `verificar-vistas.mjs` aceita `distribuicao` em
`camadas`. Nenhuma vista usa a camada ainda (nenhuma em `tools/alexandria-atlas/vistas/`), e os registros de
`sem-vista.json` cujo motivo cita as áreas de concessão (35) foram escritos antes dela: são os candidatos a vista
nova.

## Como atualizar os dados

```
node tools/alexandria-atlas/baixar.mjs --tudo      # fontes oficiais → tools/alexandria-atlas/bruto/ (fora do git)
node tools/alexandria-atlas/construir.mjs          # → public/alexandria/atlas/dados/ (menos comércio e operação)
node tools/alexandria-atlas/comercio/baixar.mjs    # Comex Stat, ONS, ANP, ANAC, IBGE, Natural Earth → bruto/comercio/
node --max-old-space-size=6000 tools/alexandria-atlas/comercio/construir.mjs   # → comercio-2025.json
node tools/alexandria-atlas/operacao/baixar.mjs    # ONS (geração por usina, corte, balanço, conjuntos) → bruto/operacao/
node tools/alexandria-atlas/operacao/construir.mjs # → operacao-dias.json e as entradas operacao-* do manifesto
node tools/alexandria-atlas/gerar-procedencia.mjs  # → docs/alexandria-v3/atlas/procedencia.md
node tools/alexandria-atlas/gerar-vistas.mjs       # confere as vistas contra os dados novos e publica
```

O bruto inteiro fica fora do git (`tools/alexandria-atlas/bruto/.gitignore`); o que prova a procedência é o
`manifesto-fontes.json` (entradas sem prefixo, `comercio-*` e `operacao-*`) e, no comércio e na operação, o
`consultas.json` da pasta do bruto, com endereço, acesso, bytes e SHA-256. Os construtores do comércio e da operação param se um arquivo do bruto
não bater com o hash registrado. As opções de cada um (`--marnet`, `--arco`, `--dias`, `--hoje`…) estão no README da
pasta. O construtor principal também monta, das fontes já baixadas: `submercados.geojson` (com Roraima), `prec` (das
coordenadas da fonte bruta), `rumoB` (do serviço de massas d'água da ANA, `baixar.mjs` › `ana-massas-dagua-hidro`) e
`etapas` (do `CAPACIDADE_GERACAO.csv` do ONS); o resumo de cada um vai a `indice.json`. A tabela "Arquivos publicados"
da procedência cobre a pasta `dados/` inteira, com o hash calculado no disco, e `gerar-procedencia.mjs` para se o hash
de um arquivo do `construir.mjs` divergir do índice: regenere a procedência depois de qualquer construtor.

Depois de atualizar, as vistas que citam um mês ou um número na nota precisam ser relidas: o verificador confere
identificadores e citações, não a aritmética das notas.

## Como verificar

```
npx tsc -b
node tools/gridalpha-detect/bin/gridalpha-detect.mjs src      # exige npm ci em tools/gridalpha-detect
node tools/alexandria-atlas/verificar-leitura.mjs
node tools/alexandria-atlas/verificar-vistas.mjs
node tools/alexandria-atlas/capturar.mjs --gpu [--so <regex>] [--out <pasta>]   # render real: 30 cenas
```

`capturar.mjs` usa o Chrome do sistema via Playwright. O painel Browser da sessão não serve para o Atlas: não dispara
`requestAnimationFrame` e bloqueia a rede externa (medido). Sem `--gpu` o WebGL roda em rasterizador por software e o
FPS não representa nada; com `--gpu` usa a placa da máquina (ANGLE sobre Direct3D 11). O plano tem 30 cenas: os sete
capítulos, claro e noturno, 1440 e 390, a troca de modo ao vivo, o movimento reduzido, e as cenas da onda 2
(`rede-ano-1990`, `rede-ano-1985`, `rede-dono` ×2, `dia-real` ×2, `dia-real-ficha`, e as cinco do comércio). A espera
padrão de cada cena é de 5.200 ms, porque o voo da abertura termina por volta de 4 s. A cena `dia-real-ficha-1440` abre
a ficha clicando na primeira de "As maiores da hora", e a bateria inteira roda também contra o build de produção
(`--base http://localhost:4173`). Uma ação que falha vira erro da cena, e a cena quebrada entra no `medidas.json` com o
erro, sem derrubar a rodada.

Ganchos de verificação, só em desenvolvimento: `window.__atlas` (FPS, `ir()`, `maquetes()`, `rotulos()`,
`motivos()`, `papeis()`, `estabilidade()` e o resto declarado em `AtlasV3.tsx`) e `globalThis.__controleDoAtlas` (o
controle do mapa, exposto porque a recarga a quente quebrava as sondas). Uma recarga a quente no meio de uma medição
pode desmontar o mapa: repita a cena.

Cada captura do plano pode declarar `exige` (o que tem de estar na tela depois das ações): `modo`, `camadas`,
`seletor` e, agora, `zoom`, o zoom esperado da vista, comparado ao zoom vivo do mapa com tolerância `tolZoom`
(padrão 0,3). Plano sem o campo não muda de comportamento; nenhuma captura do plano usa `zoom` hoje.

### Bancada de colocação das maquetes

```
node tools/alexandria-atlas/medir-colocacao.mjs --out <pasta> [--so <regex>] [--gpu]
     [--plano tools/alexandria-atlas/bancada-colocacao.json] [--base http://localhost:5173]
     [--ab] [--sobrepor] [--estabilidade] [--variantes] [--sem-fps] [--janela]
```

Roda as cenas de `bancada-colocacao.json` (42 cenas: 39 a 1440×900 e 3 a 390×844; cada uma com `nome`, `rota`,
`viewport`, `modo`, `espera`, `acoes` e `porque`, e às vezes `assunto`, `reduzido` e `coberturaInformativa`) no
Chrome do sistema, como o `capturar.mjs`. As treze `col-perto-*` são as de perto: UFV de 3 MW, PCH de 8 MW, subestação
de 230 kV (uma colada a uma usina e uma isolada, Itagiba, sem usina a menos de 27 km), de 500 kV, terminal de GNL,
RMSP, Manaus e Recôncavo a 14 e a 15, e Copesul a 16; a do GNL e a do Recôncavo "14" ficam no zoom 14,3, para
exercitarem o nível 4. Precisa do servidor de desenvolvimento: lê `window.__atlas.maquetes()` e `window.__atlas.rotulos()`,
que só existem nele. Grava `<out>/<cena>.png`, `<out>/medidas.json` e uma tabela por cena no console; sai com código 1
se algum critério dá FALHA ou uma cena não fica pronta. Sem `--out`, a pasta é
`%TEMP%/atlas-colocacao-medidas/ultima`.

- `--ab`: custo das maquetes, FPS em movimento com e sem a camada 3D (informativo).
- `--sobrepor`: grava também `<cena>-caixas.png` com caixas, pés e rótulos desenhados.
- `--estabilidade`: mede o A10 no fim da cena.
- `--variantes`: cada cena nos dois modos e a 1440×900 e 390×844 (nome `~<modo>-<largura>`). A 390, a cena com
  `assunto` recentra a câmera nele.
- `--sem-fps`: pula o A11 nas variantes. `--janela`: janela visível.

**A rodada que mediu a regra nova** (integrador da leva 4, 16/11/2026, `--gpu --sobrepor --ab --estabilidade`, em lotes de
seis cenas com `--so`): 42 de 42 cenas, nenhuma FALHA. A1 a A5, A7, A9 a A12 passam nas 42; o A16 passa em 30 cenas
de 1440 e é n/d nas outras 12 (as três de celular entre elas); o A15 passa em 13 e é n/d em 29. Contagens que mudaram
contra a leva 3, por regra nova: a cena do Founder a 1440 de 9 para 8 maquetes (sai Dreen São Bento do Norte, pela
entrada adiada), a 390 de 2 para 3; `rmsp-12` ganha Itaú Mooca (a maior da tela); em Santos, a refinaria RPBC dá lugar
a Cubatão (a maior da tela); em Macaé entra Marlim Azul (a térmica deixou de ser membro); de perto em São Paulo,
"ficaram só no símbolo" sobe porque os geradores a óleo não somem mais em conjuntos; `col-rn-reduzido` também de 9
para 8 (o mesmo Dreen); em `col-perto-se-230` a maquete passa de Prosperidade II a Prosperidade III. Uma mudança sem
explicação provada: `col-rn-satelite-12`, de 8 para 7 (sai Ventos de Santo Dimas). Nessa rodada
`col-santos-combustivel-390` caiu de 1 para 0 maquetes e o A14 dela ficou n/d: era a câmera intermitente (seção "A
abertura e o Titã").

**A rodada final** (integrador do arremate, 17/11/2026, mesmas opções): 42 de 42 cenas, nenhuma FALHA, nenhuma
regressão contra a rodada anterior e a mesma lista de itens em 41 cenas; a única diferença é
`col-santos-combustivel-390`, que voltou a ter 1 maquete (Cubatão, a mesma da cena de 1440), com o A14 passando.
As duas cenas de Santos, repetidas 15 vezes cada, terminaram na câmera certa nas 30.

Critérios (`avaliar` em `medir-colocacao.mjs`). Sem dado para medir, o critério sai `n/d`, não FALHA.

| | O que mede | Peso |
| --- | --- | --- |
| A1 | Sobreposição entre caixas medidas das maquetes (torres incluídas): par não forçado acima de 2% da menor caixa | reprova |
| A2 | Distância entre pés (sem torres) contra `max(D do nível, (La+Lb)/2 + 16, 72)`, tolerância de 2 px, × 0,85 com histerese | reprova |
| A3 | Tetos por nível (× 0,75 no satélite); torres: teto de 12 (4 no celular), zoom efetivo ≥ 13, inclinação ≥ 25°, sem satélite, 158 px entre torres, até 3 por linha; a torre lembrada (memória) tem a folga dela, zoom efetivo ≥ 12,85 e 118 px da vizinha; o mesmo teste roda também depois de afastar 0,3; nenhuma usina contada duas vezes (maquete e membro, ou membro de dois) | reprova |
| A4 | Rótulo sobre maquete alheia; topo do rótulo do vencedor de 2 a 12 px abaixo da caixa | reprova |
| A5 | Pé desenhado contra `map.project` do cadastro (1 px; 3 px com relevo); membros do conjunto no disco (ou sob a própria maquete) | reprova |
| A6 | Cobertura: MW representados sobre MW na tela | alarme: reprova só abaixo de 0,30 no nível 1 e de 0,50 do nível 2 em diante, a 1440; informação no celular, no satélite de perto, no nível 0 e na cena que declara `coberturaInformativa` (o motivo, por extenso) |
| A7 | Hierarquia: L igual à lei de tamanho (ou à escala real, ou ao piso do mínimo legível do nível 3 em diante); MW × 3,3 dá L × 1,28 fora do piso; pela lei, Belo Monte > Tucuruí > Itaipu e o L de Itaipu ≥ 3 × o de 30 MW | reprova |
| A8 | A partir do zoom 9,8: nenhum símbolo 2D de vencedor à vista, âncora para cada maquete, nenhum rótulo de usina em repouso | reprova |
| A9 | O aviso de uma linha contra o resumo da escolha: o total na tela e os que "ficaram só no símbolo" (cortados pelo teto, pelo espaço e pela entrada adiada) | reprova |
| A10 | Estabilidade (`--estabilidade`): no arrasto, nenhum item que cabe inteiro nas duas telas (caixa da maquete somada à do rótulo) deixa de ser desenhado; zero piscadas (some e volta) na varredura de zoom ± 0,6; na ida e volta de 0,3 de zoom, não se perde quem continuava desenhado no meio. O que entra no arrasto, quem sai na ida pela borda e o "aparece e some" saem à parte, como informação | reprova |
| A11 | FPS ≥ 50 em movimento e no zoom com as maquetes ligadas; escolha ≤ 3 ms na cena `rmsp-10.5` a 1440. O custo do `--ab` é informação | reprova |
| A12 | Nenhuma maquete com zoom efetivo abaixo de 9,4; em repouso, em qualquer zoom, toda maquete inteira: escala vertical 1, rótulo com opacidade 1, selo da troca a 0 e nenhum símbolo 2D de vencedor visível sob ela | reprova |
| A13 | Com inclinação abaixo de 25°: nenhum aerogerador nem torre em 3D, selo no pé de cada eólica, aviso "incline o mapa" | reprova |
| A14 | Satélite a partir de 12,5 sem maquete; nenhum repaint parado com movimento reduzido; contraste da borda ≥ 3; nenhum pixel do óxido da seleção sem seleção, fora do satélite e fora dos retângulos da casca (o "Inclinar" pressionado é óxido) | reprova |
| A15 | De perto: todo candidato com zoom efetivo ≥ 14, nome, coordenada confirmada e espaço livre tem maquete (lê `__atlas.motivos()`, que traz o zoom efetivo de cada candidato). Recusa legítima: espaço, casca ou borda, pé fora da área útil, sem nome, já num conjunto, teto, rótulos do celular, entrada adiada, precisão da fonte (`prec`). A cena feita para o A15 sem nenhum candidato no nível 4 FALHA | reprova |
| A16 | Coerência com o painel, só a 1440: se a tela desenha maquete de usina, a maior usina em operação da área útil (1 MW ou mais, recontada sobre o arquivo carregado) tem maquete, própria ou como membro, ou motivo declarado (coordenada imprecisa, posição a confirmar, aquém do zoom, sob a casca ou na borda) | reprova |

## Maquetes 3D

29 arquivos em `public/alexandria/atlas/modelos/`, de 2.432 a 21.228 bytes e de 46 a 930 triângulos (lidos de
`modelos.json`): 26 tipos de
maquete (`TipoDeMaquete` em `mapa/maquetes.ts`) e a versão simplificada de cada uma das três torres.

| Família | Tipos |
| --- | --- |
| Geração | `aerogerador`, `hidreletrica`, `hidreletrica-grande`, `pch`, `solar`, `nuclear`, `termica-gas`, `termica-carvao`, `biomassa-cana`, `biomassa`, `termica-motores`, `termeletrica`, `biogas`, `alto-forno` |
| Rede | `subestacao-pequena`, `subestacao`, `subestacao-grande`, `subestacao-no`, `conversora`, `torre`, `torre-ehv`, `torre-cc` (as torres com `-lod`) |
| Gás e petróleo (ANP) | `refinaria`, `terminal-gnl`, `upgn`, `terminal-liquidos` |

O tipo sai só de atributo do cadastro (`maqueteDaUsina`, `maqueteDaSubestacao`, `torreDaLinha`): fonte, sigla,
combustível e potência da usina (UHE de 1.000 MW ou mais, `KW_DA_HIDRELETRICA_GRANDE`, é a barragem de oito unidades;
térmica a gás natural abaixo de 50 MW, `KW_DO_CICLO_COMBINADO`, fica no modelo genérico, porque o cadastro não diz o
ciclo); a maior tensão da subestação e as linhas que chegam nela (conversora na ponta de linha de corrente contínua;
nó quando 440 kV ou mais e oito linhas ou mais, `TERMINAIS_DO_NO`); a classe da linha, para a torre; o tipo da
instalação da ANP.

**Como são gerados.** No Blender, em segundo plano:

```
"C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" --background ^
    --python tools/alexandria-atlas/modelos/gerar_modelos.py -- [--folha] [--so <nome>]
```

O script exporta um GLB por tipo e grava `modelos.json` com, por arquivo, bytes, triângulos, medidas
(`dimensoes`, leste, norte e altura em metros), maior medida, objetos, materiais, `acento` e altura relativa.
`maquetes.ts` lê as medidas e o acento desse arquivo no build: regenerar os modelos atualiza a régua sem copiar número
para o código. Com `--folha` o Blender fotografa cada modelo, e `node tools/alexandria-atlas/modelos/montar-folha.mjs`
monta a prancha `docs/alexandria-v3/atlas/modelos-folha.png`. O teste de silhuetas é
`tools/alexandria-atlas/modelos/testar_silhuetas.py`, também no Blender.

**Estilo.** Cinco materiais, pelo nome: `papel` (o corpo), `chao` (a laje do pátio), `tinta` (o detalhe que define o
tipo), `estrutura` (treliça, pórtico, braço de carregamento; clareia no noturno) e `acento`, uma peça pequena na cor
da fonte (18 dos 29 arquivos; na usina vale a fonte do próprio cadastro). O contorno de tinta tem espessura constante
na tela (constantes de `camada3d.ts`): 1,1 px (`PX_DO_CONTORNO`), 1,4 px sobre a foto de satélite
(`PX_DO_CONTORNO_NO_SATELITE`) e, fora do satélite, 0,8 px na maquete menor que 40 px (`PX_DO_FIO_FINO`). Nada de
sombra projetada, brilho ou cor de estado. Nenhum modelo traz água: rio, reservatório e mar são os da base. Fora da
rede, a laje sai quando a maquete tem menos de 120 px na tela (`PX_DA_LAJE`); na rede fica sempre, com um fio de
`estrutura` na borda (no pátio claro a subestação sumia), menos na conversora, que não tem laje. A torre abaixo de 64
px usa a versão simplificada (`PX_DO_LOD`), de pernas de seção quadrada, mais grossas no pé, e, nas linhas abaixo de
440 kV, leva a cor da classe da linha; as outras, a cor cheia da classe de 500 kV (`matEstruturaTorre`). O campo
solar tem material próprio para o painel (`matPainel`), que no noturno se separa do chão escuro. O aerogerador sai em dois objetos, torre e rotor; o rotor gira (parado no movimento
reduzido) e o modelo acompanha o rumo da câmera, a três quartos dela (`rumoDoAerogerador(B) = B + 35°`,
`ROTOR_A_TRES_QUARTOS` em `maquetes.ts`): o rotor nunca fica de perfil. A maquete é esquema; o rotor real segue o
vento.

**Entrada e saída no tempo.** Em zoom parado não há maquete pela metade: em repouso ela está inteira (escala 1,
opaca, rótulo opaco, símbolo 2D do vencedor escondido) ou não está. Quando um item entra na escolha, a maquete cresce
do chão em 300 ms (`DURACAO_DA_TROCA_MS`, desaceleração cúbica), e encolhe quando sai; o relógio só começa no
primeiro quadro em que o modelo é desenhado (o GLB baixado pela primeira vez chegava depois dos 300 ms). Movimento
reduzido: troca seca. O símbolo 2D do vencedor some pela **cor** (feature-state `maquete` levando a cor a
transparente, `SOME_SOB_A_MAQUETE` em `controleDoMapa.ts`), nunca pela opacidade: trocar o `icon-opacity` entre uma
expressão com feature-state e outra só de câmera deixava baldes do Mapbox com o ligante antigo, e o voo de perto para
longe quebrava com `this.expression.evaluate is not a function`.

**O que continua valendo.** São **esquema do tipo de instalação**, não retrato: uma barragem genérica no ponto do
cadastro, torres ao longo do traçado generalizado da linha. Ficam maiores que a escala real enquanto o zoom é baixo e
nunca menores que ela de perto. Em "Como ler", a interface diz que a maquete é esquema do tipo, não retrato, e que
fica sempre no ponto do cadastro. Pela regra de imagem do Founder, é a categoria
"precisa demonstrar algo e é educacional"; a obra real aparece na foto de satélite, que é a categoria "existe e pode
ser fotografado".

## Regra de colocação das maquetes

O que ganha maquete no enquadramento corrente, qual, onde, com que rumo e tamanho: `escolherMaquetes` em
`mapa/maquetes.ts`, refeita a cada movimento da câmera. O desenho é de `camada3d.ts`; o arquivo da regra não importa
o Three.js. Toda constante abaixo está em `maquetes.ts`, salvo indicação.

**Zoom e níveis.** Não há maquete abaixo do zoom 9,4 (`ZOOM_DAS_MAQUETES`). A maquete não cresce mais com o zoom:
entra e sai no tempo (seção "Maquetes 3D"); `ZOOM_DA_MAQUETE_INTEIRA` (9,8) só guia a saída do selo dos perdedores e
dos membros, que é símbolo 2D. O nível de cada item vem do zoom efetivo **no ponto** (a perspectiva da câmera
inclinada conta), em quatro faixas (`NIVEIS`; `FOLGA_DO_NIVEL` de 0,001 tira o ruído numérico na fronteira):

| Nível | Zoom efetivo | Piso de porte (MW do conjunto) | Semente ou usina sozinha | Subestação | ANP | Raio do conjunto (`Rpx` no `zRef`, mínimo) | `D` (px entre pés) | Teto [tela, celular] |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 9,4 a 10,5 | 300 | 5 MW (óleo: 30 MW) | 500 kV ou mais | não | 180 px no 9,9, 600 m | 180 | 10, 4 |
| 2 | 10,5 a 12 | 5 | sozinha 30 MW; semente 10 MW (óleo: 30 MW) | 230 kV ou mais | sim | 200 px no 11, 600 m | 140 | 20, 6 |
| 3 | 12 a 14 | 1 | 1 MW (óleo: 5 MW) | todas, também sem tensão | sim | 110 px no 12,8, 600 m | 110 | 24, 8 |
| 4 | 14 em diante | nenhum | qualquer potência (óleo: 1 MW) | todas, também sem tensão | sim | 90 px no 15,5, 250 m | 90 | 24, 8 |

O piso da semente é `podeSemear`; o de 30 MW sozinha e 10 MW de semente (`MW_DA_USINA_SOZINHA`, `MW_DA_SEMENTE`) vale só
no nível 2; o do óleo no nível 4 é `KW_DO_OLEO_NO_NIVEL_4`. De perto, portanto, toda usina em operação com coordenada
confirmada é candidata e ganha maquete onde houver espaço. A conversora entra em qualquer nível. Quem estava
desenhado e cruzou a fronteira de nível por menos de 0,35 (`HISTERESE_DE_NIVEL`) fica no nível de antes.

**Conjunto, só de parques.** O conjunto existe para os parques que o cadastro da ANEEL reparte em vários registros:
só eólica e solar (`FONTES_DO_CONJUNTO`). Nelas, da maior para a menor, a maior livre vira semente e absorve as livres
da **mesma fonte e do mesmo tipo de maquete** a menos de R dela, sem encadear (o raio é medido da semente;
`raioDoConjuntoM`). Nas outras fontes cada usina concorre sozinha, pela própria potência (em São Paulo a zoom 10 a
única maquete era uma térmica somada a 42 geradores a diesel de prédios). A semente ganha a maquete; os membros ficam no disco proporcional de sempre, cada um no seu ponto. A segunda
linha do rótulo diz "+n parques · X MW" nas eólicas e "+n usinas · X MW" nas solares, numa linha só (espaço
inquebrável e "∙"), com corpo de 12 px ou mais (`corpoDoRotulo`), em tinta. A ficha aberta pela maquete começa pelo
conjunto ("<nome> e mais n parques", a potência somada, a lista, cada item leva à ficha do parque) e diz "Agrupadas pelo
mapa, não pelo cadastro" com o raio em km. Quando a semente sai da tela, o maior membro na tela que pode semear refaz
o conjunto com os membros à vista.

**A maior usina da tela.** Se a tela desenha alguma maquete de usina, a maior usina em operação da área útil (1 MW ou
mais, fontes ligadas: a primeira de "As maiores desta tela") tem maquete, salvo motivo declarado. `maiorDaTela` a acha;
o item que a contém ganha prioridade `PRIO_DA_MAIOR` (abaixo dos pedidos, acima de qualquer potência) e sobe ao
mínimo legível; se nenhum candidato a contém, ela entra sozinha, desde que haja outra usina candidata. O motivo fica
em `__atlas.motivos().maior`; a bancada mede isto no A16.

**Seleção por espaço.** Uma fila única: usinas e conjuntos pelos MW somados; subestações pela tensão (conversora com
peso 1500); instalações da ANP por um peso editorial de desempate (`PESO_DA_INSTALACAO`: refinaria 1000, GNL 800,
UPGN 300, terminal 50). Quem foi desenhado no enquadramento anterior ganha prioridade × 2 (`HISTERESE_PRIO`) e
distância × 0,85 (`HISTERESE_D`). A escolha é gulosa, na tela, e recusa o item:

- com o pé fora da área útil (no celular, a área útil acaba na folha inferior);
- sem nome para o rótulo (maquete em repouso sempre tem rótulo);
- cuja caixa, somada à do rótulo, sai da área livre: a tela menos 16 px de cada borda (`MARGEM_DA_TELA`) e menos as
  zonas da casca (busca, controles, atribuição e logotipo do mapa, ficha, cartão da vista), infladas 4 px;
- cuja coordenada tem erro maior que metade da maquete no chão (abaixo, "Precisão da coordenada");
- abaixo do mínimo de leitura do tipo, onde ele não é piso (abaixo);
- além do teto do nível (× 0,75 com o satélite ligado, `FATOR_DO_SATELITE`);
- no celular (largura abaixo de 700 px, `LARGURA_DO_CELULAR`), além da terceira maquete à vista (`ROTULOS_NO_CELULAR`;
  o item pedido conta entre as três quando o pé dele está na área visível);
- a menos de `max(D, (La + Lb)/2 + 16, 72)` px do pé de um aceito (`distanciaMinima`), ou com a caixa a menos de 8 px
  da dele (`FOLGA_DA_CAIXA`).

O aviso do painel conta, numa linha, as maquetes na tela e quantas "ficaram só no símbolo" (`textoDoResumo`),
incluídas as adiadas pela entrada adiada.

**Estabilidade.** Três mecanismos, além da histerese de prioridade, distância e nível:

- **Memória por faixa de zoom** (`MemoriaDeVencedores` em `controleDoMapa.ts`): cada faixa de 0,05 de zoom guarda o
  conjunto entregue por 3 s; voltando à mesma faixa com a mesma pose (centro a menos de 48 px, rumo e inclinação a
  menos de 1°), é esse conjunto que ganha a histerese. Limpa na troca de capítulo, de camadas, de modo e de tamanho.
- **Entrada adiada** (`adiarEntrada`, `DZ_DA_ENTRADA_ADIADA` de 0,15): um recém-chegado (não estava desenhado, não é
  pedido) só entra se também vence num zoom vizinho, z − 0,15 ou z + 0,15; quem a memória devolveu não é recém-chegado,
  e a histerese de nível no vizinho é só de quem continua. Acabou com a "maquete de vida curta" que aparecia num único
  passo da varredura de zoom.
- **Torres com memória**: a torre que já estava desenhada entra primeiro, sem o filtro de perspectiva, com folga de
  0,15 no zoom efetivo, é procurada também no meio passo quando o passo dobra e só cede à vizinha a menos de 0,75 ×
  160 px; a torre nova passa pela entrada adiada.

**Lei de tamanho.** L é a maior medida do modelo na tela, em px. Usina e conjunto:
`L = 44 × (MW / 30)^0,22`, entre 30 e 170 px (36 no mínimo para o aerogerador), sem degrau (`LEI`, `ladoPelaPotencia`).
No celular, × 0,85 e no máximo 140 px. O aerogerador tem teto por nível, 76, 96, 112 e 124 px
(`TETO_DO_AEROGERADOR`), que só cresce ao aproximar. A rede tem L fixo pela classe (`ladoDaRede`): conversora 72;
nó 60; 440 kV ou mais 60; 345 kV 56; 230 kV 38; abaixo, 30. ANP: refinaria 100, GNL 72, UPGN 80, terminal 64
(`LADO_DA_ANP`). Torre: 24 px, 28 na de 440 kV ou mais e na de corrente contínua (`LADO_DA_TORRE`). Em todos, L nunca
fica abaixo da escala real no ponto.

**Mínimo de leitura** (`MINIMO_LEGIVEL`): as quatro subestações 84 px, conversora 72, PCH 56, usina de cana 56,
UPGN 76, terminal de GNL 110, refinaria 96, terminal de líquidos 64. Abaixo disso o modelo vira rabisco. De perto o
mínimo é **piso** do tamanho, não recusa: o item cresce até ele nas usinas e nas instalações da ANP do nível 3 em
diante, na rede do nível 4 em diante (no 12 e no 13 a subestação de 84 px ficaria maior que a usina de 30 MW), e em
qualquer nível no item pedido e na maior usina da tela. Fora disso, abaixo do mínimo fica o símbolo 2D. Como a lei da
rede não passa de 60 px, a maquete da subestação vem do nível 4, pela escala real, ou pedida.

**Torres.** Só no capítulo da rede, com a camada de linhas ligada, de pé (inclinação de 25° ou mais) e fora do
satélite, com zoom efetivo 13 ou mais (`ZEF_DAS_TORRES`), em linhas de 230 kV ou mais (`KV_MINIMO_DA_TORRE`) ou de
corrente contínua, depois de usinas e subestações, dentro da área livre e fora da casca. Passo = vão de 450 m (`VAO`) ×
potência de 2, em múltiplos absolutos do vão, para as posições ficarem estáveis enquanto a câmera anda; 160 px entre
torres (`PX_ENTRE_TORRES`); até 3 por linha (`TORRES_POR_LINHA`); teto de 12 na tela e 4 no celular
(`TETO_DE_TORRES`). A linha que não cruza o enquadramento sai antes de se medir o traçado. A memória das torres está em
"Estabilidade", acima.

**Piso do óleo.** Grupos geradores a óleo abaixo de 5 MW (`KW_DO_OLEO_PEQUENO`) só aparecem como símbolo do zoom 13 em
diante (`ZOOM_DO_OLEO_PEQUENO`) e ficam fora da soma dos símbolos de longe. A linha do painel declara o piso; a busca
acha todos.

**Precisão da coordenada.** O construtor grava por registro o campo `prec` (usinas, subestações e instalações da ANP):
as casas decimais significativas da coordenada **na fonte bruta**, de 0 a 4 (4 quer dizer 4 ou mais; zero final não
conta; vale a pior das duas coordenadas). `erroDaCoordenadaM` lê `prec`: o erro é meia unidade da última casa (2 casas,
cerca de 560 m). Das usinas em operação, 22.036 têm 4 casas ou mais, 305 têm 3, 73 têm 2, 6 têm 1 e 7 têm 0. A
maquete cujo erro passa da metade dela no chão não é desenhada; com `prec` de 2 ou menos a ficha diz que a fonte dá a
posição com poucas casas e que, por isso, de perto, a maquete não é desenhada (Paraibuna some ao aproximar por isso).
Usina e subestação com **posição a confirmar** no cadastro (`susp`) nunca ganham maquete, nem como membro: ficam no
símbolo com contorno tracejado, e o pairar e a ficha dizem "posição a confirmar".

**Itens pedidos.** O ativo selecionado, o destino da busca e o destaque da aula entram forçados: furam teto, piso,
distância, margem e casca, empurram quem colide com eles e, abaixo do mínimo de leitura do tipo, sobem até ele. Se o
pedido é membro de um conjunto, o conjunto inteiro é forçado (o membro já está representado no disco dele). Usina
pedida que não é semente entra sozinha, no ponto dela. Com só o item pedido na tela e nada cortado, o aviso não
aparece: a ficha e o anel dizem.

**Satélite.** Com a foto ligada, os tetos caem para 75% e não há torre. A partir do zoom 12,5
(`ZOOM_SEM_MAQUETE_NO_SATELITE`) nenhuma maquete é desenhada; ficam a âncora e o rótulo, e o aviso diz "Satélite de
perto: a foto mostra a obra, sem maquete."

**Câmera de cima.** Abaixo de 25° de inclinação (`INCLINACAO_DE_PE`) aerogerador e torre leem como cruz: o
aerogerador não é desenhado em 3D (fica o selo no pé), nenhuma torre é escolhida, e o aviso acrescenta "incline o mapa
para ver de pé".

**Rumo.** O cadastro não diz para onde a instalação está virada.

- **Barragem** (UHE, UHE grande, PCH): onde o reservatório mapeado pela ANA (serviço `SNIRH2016/Massa_dagua`) passa no
  teste da água do construtor, a usina traz `rumoB`, o rumo do **montante** em graus (0 a 360), e a barragem gira
  `rumoB + 90` (`rumoDaBarragem`). São 30 UHE e 1 PCH. Paraibuna passou no teste, mas tem `prec` 2 e ficou na
  convenção. As demais ficam atravessadas no sentido leste–oeste por convenção (`giro: 90` em `MODELOS`). A ficha da
  hidrelétrica diz qual regra vale ("o rumo segue o reservatório mapeado pela ANA" ou "rumo por convenção"). O
  polígono da ANA, a lista das que têm rumo e a licença como a ANA a declara estão em
  `indice.json › camadas.usinas.rumoDasBarragens` e na seção 1 de [`procedencia.md`](procedencia.md).
- **Subestação**: gira pela saída da linha de maior tensão que termina nela (ponta a até 1.500 m, `RAIO_DA_PONTA_M`).
- **Torre**: pelo trecho da linha. **Aerogerador**: pela câmera (seção "Maquetes 3D").
- As demais ficam no rumo fixo do modelo.

**Nada sai do ponto do cadastro.** A maquete fica no ponto da usina, da subestação ou da instalação; a torre, sobre o
traçado do ONS. Membro de conjunto fica no próprio disco; a soma dos símbolos de longe esconde, não desloca; o que cai
sob a casca deixa de ser escolhido, não é empurrado.

## Desempenho

Medido pelos integradores da onda 2, em 16 e 17/11/2026, numa GeForce RTX 4070 (Chrome via Playwright, ANGLE sobre
Direct3D 11), com `capturar.mjs --gpu` e com a bancada de colocação. Quadros por segundo com o mapa parado e com a
câmera em movimento. A linha do build é da rodada final (17/11/2026, sobre o código do arremate); a do servidor de
desenvolvimento é da leva 4 (sobre o código do commit `dfb71bcd`).

| Onde | Cenas | Mapa pronto | Parado | Em movimento |
| --- | --- | --- | --- | --- |
| Build de produção (`npm run build` + `vite preview`) | 30 da bateria | 0,7 a 1,7 s | 210 a 237 | 99 a 238 |
| Servidor de desenvolvimento | 30 da bateria | 0,8 a 2,6 s | 209 a 235 | 88 a 238 |

No build, a 390×844: 212 a 237 parado e 214 a 238 em movimento. O menor número em movimento, nos dois, é o da cena
de movimento reduzido a 1440. A bateria inclui a troca de modo ao vivo (`alternar-modo-*`). Nenhum `pageerror` nem
erro de console nas duas baterias; as únicas falhas de rede são o `/api/auth/me` da casca e tiles do Mapbox cancelados
no meio de um voo.

**Com maquetes** (bancada, 42 cenas, servidor de desenvolvimento): na rodada final (17/11/2026), em movimento, 54 ou
mais em todas; durante o zoom, 65 ou mais (as duas mínimas são da cena `col-rn-reduzido`, a de menor folga da
bancada; na rodada de 16/11/2026 as mesmas mínimas eram 71 e 77). A meta é 50. Na rodada de 16/11/2026 a escolha das
maquetes levou 0,85 ms na mediana e 1,42 ms na mais cara; 1,04 ms na cena de São Paulo no zoom 10,5 (meta de 3 ms
nessa cena).

**Peso** (build de produção da rodada final, 17/11/2026): o pedaço do Atlas tem 477,65 kB (151,07 kB comprimido) e o
CSS dele 83,62 kB (13,01 kB); o `mapbox-gl`, 1.254,23 kB (344,22 kB). A camada 3D, com o Three.js, é um pedaço à
parte, baixado só quando há maquete para desenhar (`camada3d-*.js`, 605,79 kB; 156,42 kB comprimido). Na primeira
onda o pedaço do Atlas tinha 272 kB (86 kB comprimido): a onda 2 o quase dobrou (comércio, dia real, linha do tempo,
donos, Titã). O build avisa do tamanho do pedaço do `mapbox-gl` e de um
`js-comment-in-css` que não vem dos CSS do Atlas.

## Limitações conhecidas

Abertas ao fim da onda 2 (17/11/2026), pelo integrador da rodada final e pelos autores de cada frente. Nenhuma é
segredo da interface: onde afeta a leitura, o painel ou a ficha dizem.

**Estabilidade e densidade das maquetes.** A histerese, a memória e a entrada adiada prometem que o que está desenhado
fica; não prometem que voltar ao mesmo zoom devolve o mesmo conjunto. A bancada mede como informação, sem reprovar, o
que entra no arrasto (a vaga de quem saiu pela borda; no celular, com três vagas, aparece mais), quem sai na ida pela
borda e o "aparece e some" da varredura. A entrada adiada também corta item legítimo no alto da tela ou na borda (no
litoral do RN a 11,2, União dos Ventos 2 a 1440; a torre de corrente contínua em Itaipu). Na cena do Founder (litoral
do RN, inclinação 55° a 58°, rumo 20), o integrador contou, nos zooms 9,3 / 9,5 / 9,7 / 10 / 11,2: 0 / 2 / 4 / 3 / 6
maquetes a 1440 e 0 / 5 / 6 / 4 / 8 a 1920.

**Painel e mapa falam de objetos diferentes.** Com a câmera inclinada, "As maiores desta tela" já só lista o que está
na tela (o polígono da área livre). Mas a lista é de usinas e as maquetes do litoral do RN são de conjuntos: a zoom
11,2 (rumo 20, 1440) a primeira da lista é São Fernando 4, desenhada só como símbolo, a 46 px da borda
(`motivos().maior` diz "candidata", e o A16 aceita como "sob a casca ou na borda"), enquanto as maquetes são "Asa
Branca VII +11 parques" e as vizinhas. De cima, a lista pode trazer usina que o mapa não desenha por generalização
(GNA I, no mesmo ponto da GNA II, a zoom 6; Serra das Almas IV, V e VI, sobrepostas, a zoom 8 na Bahia).

**Padding da rota do comércio.** Para pôr a rota inteira na área livre o controle usa padding no transform, como na
composição do Titã (`voarComPaddingDaRota`); ele fica enquanto a ficha da rota está aberta. É estado a mais: uma
chamada nova de `easeTo` sem padding o herdaria.

**Comércio.** As rotas para a China e o Extremo Oriente não cabem no disco: ao selecionar uma, o mapa mostra a ponta
brasileira e o meio da rota (até o sul da África); o destino fica atrás do globo, a 1440 (zoom 2,45, 17 a 18 de ~30
vértices ocultos) e no celular (14 a 16 ocultos). As três maiores remessas da lista são justamente petróleo → China. A
rota da Rússia cabe a 1440 (zoom 2,3 a 2,35), com a origem a ~80 px da borda de baixo. No celular, com a gaveta em
meia altura, a rolagem até o controle tocado corta o número do topo (relatado na leva 4; não reconferido). As rotas usam o Natural
Earth como régua da terra: a costa mais fina da base do Mapbox pode ter ilhota sob a rota em lugar não olhado (em
Gaspar, 1 km por rota cai sobre uma); no Øresund a folga é de 2,1 km, rente na tela de perto; há um gancho pequeno em
Sunda e um "V" no golfo da Finlândia. O laço do porto muda de tamanho por degrau inteiro de zoom, e o veículo salta ao
cruzar 5, 6… A ficha da Arábia Saudita fica longa pela frase do Suez.

**Um dia real.** O Nordeste fica acima do balanço do ONS em 07/04/2026 (+1,09% no dia) e em 30/09/2026 (+0,82%),
todo na eólica e na solar; a causa não foi achada (está no README da ferramenta). Entidade sem valor publicado no dia
não aparece: 85 em 30/09/2026 e 39 em 14/11/2026. O dicionário do ONS não declara o fuso. O ponto do conjunto é o do
dia mais novo, mesmo num dia com outros membros. O arquivo passou do teto combinado de ~450 KB (461.765 bytes). No
zoom 6 a 7 o aglomerado de Açu (RN) é denso, no limite do amontoado.

**Linha do tempo e donos.** As 19 usinas em que ONS e ANEEL divergem mais de 5% ganham a forma no tempo do ONS sobre o
total da ANEEL (declarado, mas é escolha). Com ano anterior a 2025, Roraima sai do Norte; com 2025, o ano inteiro
conta como Norte, embora a interligação seja de setembro. O histograma da régua é linear: o pico de 2021–2022 domina e
os anos antigos ficam rasos. A régua compacta só aparece quando o cadastro inteiro chegou (antes disso diz "Carregando
o ano de entrada das usinas…"). Em "A rede", com um ano anterior a 2025, Roraima sai do Norte sem frase visível sob a
régua. Os donos não acompanham o ano, e o símbolo do dono mostra a usina inteira, não a fração dele.

**Painel de "A rede".** A meta de ~1.100 px de rolagem a 1440 não foi atingida: a coluna rola 1.553 px na lente padrão
(o painel em si tem 1.017 px; cerca de 500 px acima dele são a lista de capítulos e o título da página). Na leva 4 as
lentes de Donos e de Rede tinham 1.634 e 1.644 px; não foram remedidas. As fatias estreitas da barra por fonte
(nuclear, outros fósseis, às vezes a solar) não servem de alvo de toque; o caminho para elas é a legenda da lente
Fontes, com células de 155×49 px (172×49 px a 390).

**Símbolos de longe.** Do zoom 3 ao 5 quase todo símbolo tem anel, e o anel deixa de distinguir. No zoom 10 a soma
acaba e o número de símbolos salta. O símbolo eólico somado do RN fica do tamanho de Itaipu: é honesto porque a ficha e
a legenda dizem que é soma.

**Roraima.** O contorno de qualidade mínima do IBGE deixa 9 usinas pequenas de Bonfim e Uiramutã do lado da Guiana. O
rótulo "NORTE" fica no centro do Norte inteiro mesmo quando Roraima está à parte. O contorno tracejado de Roraima antes
de set/2025 (`roraima-fio`) foi conferido por diferença de pixel com a camada ligada e desligada (claro e noturno);
`queryRenderedFeatures` devolve 0 feições de linha no globo em zoom baixo (3,22) mesmo com a camada visível, e 2 a
zoom 5,4: sonda que conte linha por essa consulta em zoom de globo erra.

**Detalhes que ficaram.** Nomes do ONS e da ANEEL aparecem como a fonte escreve, sem acento acrescentado ("FOZ DO
IGUACU 50HZ"). Depois de um Esc dado ao teclado, o fio de 1 px de tinta do foco contorna o mapa inteiro. No celular o
Titã fica inteiro por 1,88 s na abertura (claro; 1,97 s no noturno), com folga pequena sobre o mínimo de 1,8 s. A
fronteira generalizada dos submercados corta o mar em São Paulo e Angra a zoom 11. Durante o arrasto, o obstáculo de
borda dos rótulos (a borda da tela, a busca e os controles, desde o zoom 3) fica defasado até a câmera assentar. No
desktop, o rótulo dos anos da régua da frota (`.atl-regua-anos`) tem 11 px; os números (`.atl-num`) têm piso de 12 px.
Em "O mundo", o "i" dos créditos e o logotipo do mapa encostam na cabeça do Titã (relatado pela frente da página, não
medido pelo integrador).

**Angra.** As usinas da central aparecem no mapa com o nome atual do cadastro, "Almirante Álvaro Alberto", porque o
rótulo nunca usa o nome antigo. A busca compara com o nome inteiro, que traz "(Antiga Angra I)", e a ficha o mostra.

**Bacias e distribuidoras ligadas juntas.** A bacia fica por cima e é ela que responde ao clique no mapa; a
distribuidora continua na busca. A interface não avisa.

**Ficha sobre a área.** Ao selecionar uma área (distribuidora, bacia, submercado), a ficha pode cobrir parte dela: a
câmera só desliza para tirar de baixo da ficha o que é ponto.

**Modelo que não carrega.** O caminho existe no código (o item volta ao símbolo 2D e a nova tentativa espera de 15 a
60 s), mas não foi exercitado no render com uma falha real de rede.

**Ficou para depois** (fonte levantada, nada implementado): a rede planejada da EPE, as usinas em implantação com o
cronograma (RALIE), a eólica no mar (Ibama), os vizinhos e a margem de conexão; um portão de Suez com as duas pontas de
fonte aberta (hoje a rota da Arábia Saudita dá a volta pela África); e, de perto, o parque eólico como fileira de
aerogeradores pelo número de unidades do cadastro, em vez de uma turbina só (várias instâncias por ponto quebrariam a
medida por caixa da bancada). A crítica pediu também que a hidrelétrica cresça de perto até a escala do eixo real;
não foi feito.
