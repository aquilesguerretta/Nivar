# Comércio exterior de energia do Brasil, 2025 (Comex Stat · ONS · rotas próprias sobre o Natural Earth)

Dado do capítulo "O comércio". Produz `public/alexandria/atlas/dados/comercio-2025.json` (175 KB, 34 KB
comprimido). Desde a leva 2 as rotas marítimas são calculadas aqui (`roteador.mjs`) sobre o Natural Earth, de
domínio público: o arquivo não carrega mais geometria da rede do Eurostat nem o `comercio-rotas-licenca.json`.

## Reproduzir

```
node tools/alexandria-atlas/comercio/baixar.mjs              # bruto em tools/alexandria-atlas/bruto/comercio/ (fora do git)
node --max-old-space-size=6000 tools/alexandria-atlas/comercio/construir.mjs   # monta o arquivo publicado (~1,5 min)
node tools/alexandria-atlas/comercio/construir.mjs --marnet  # variante da leva 1: rede MARNET (EUPL 1.2, escreve a licença)
node tools/alexandria-atlas/comercio/construir.mjs --arco    # rotas marítimas por arco geodésico
node tools/alexandria-atlas/comercio/construir.mjs --rotas-json <t.json>   # + pontos medidos sobre terra, por rota
node tools/alexandria-atlas/comercio/desenhar.mjs --out <pasta> [--base <outro.json>] [--trechos <t.json>]
                                                             # prova visual: mundo, os recortes (com os de perto da leva 3) e 4 globos em PNG
node --max-old-space-size=6000 tools/alexandria-atlas/comercio/medir-folga.mjs [--antes <comercio-antigo.json>]
                                                             # menor distância rota–terra por rota (leva 3), antes e depois pela mesma régua
```

Node 24 (usa `node:sqlite` para ler os GeoPackage). O IBGE vem zipado: depois do download, extraia
`ibge-localidades-2022-gpkg.zip` para `bruto/comercio/ibge/` (no Windows, `C:\Windows\System32\tar.exe -xf`;
o `tar` do Git Bash não abre zip). `baixar.mjs --so <regex>` baixa só o que casar.

`baixar.mjs` grava `bruto/comercio/consultas.json`: por arquivo, endereço, método, o CORPO da consulta
(para o Comex Stat, que é POST), data de acesso, bytes e SHA-256. `construir.mjs` recusa rodar se algum
arquivo do bruto não bater com o SHA-256 registrado. Nenhum formulário, nenhuma conta, User-Agent genérico.

## Fontes

| Arquivo do bruto | Órgão · conjunto | Licença como declarada |
| --- | --- | --- |
| `comex-2025-{exportacao,importacao}-ncm-pais-urf-via.json` | MDIC/SECEX · Comex Stat, `POST /general` (posições 2701 2702 2704 2709 2710 2711 2713 2207 2612 2844 8401 2716; NCM × país × URF × via; 2025-01 a 2025-12) | A API não declara. O rodapé do sítio da API: "Todo o conteúdo deste site está publicado sob a licença" CC BY-ND 3.0 |
| `comex-2025-*-eletricidade-mensal.json` | idem, NCM 27160000 por país e mês | idem |
| `comex-paises.json`, `comex-paises-iso.json` | idem, `/tables/countries` e `/tables/countries/{id}` (código ISO de cada país) | idem |
| `comex-unidade-*.json` | idem, `/tables/ncm?search=` (unidade da quantidade estatística) | idem |
| `ons-intercambio-internacional-2025.csv` + dicionário + pacote | ONS · Intercâmbio do SIN com outros países (horário, MWmed) | CC-BY (portal de dados abertos do ONS) |
| `anp-importacoes-exportacoes-petroleo-2000-2025.csv` | ANP · importações e exportações de petróleo (só conferência) | o conjunto não declara; rodapé gov.br CC BY-ND 3.0 |
| `anac-aerodromos-publicos.csv` | ANAC · lista de aeródromos públicos | não declarada no arquivo |
| `ibge-localidades-2022-gpkg.zip` | IBGE · Localidades do Brasil 2022 | não lida |
| `natural-earth-countries-50m.json` | Natural Earth 50m, distribuição world-atlas 2.0.2 (a mesma do world-110m do "O mundo") | domínio público (Natural Earth) |
| `natural-earth-countries-10m.json` | Natural Earth 10m, mesma distribuição: a terra do roteador | domínio público (Natural Earth) |
| `natural-earth-minor-islands-10m.geojson` | Natural Earth 10m, ilhas pequenas (`ne_10m_minor_islands`, v5.1.2, repositório oficial): terra extra do roteador (leva 3) | domínio público (Natural Earth) |
| `natural-earth-ports-10m.geojson` | Natural Earth 10m, portos (`ne_10m_ports`, v5.1.2, repositório oficial do Natural Earth): os dois extremos do portão do Panamá | domínio público (Natural Earth) |
| `eurostat-marnet_plus_20km.gpkg`, `eurostat-searoute-LICENSE.txt`, `-README.md` | Eurostat · SeaRoute, rede marítima MARNET (só `--marnet`) | EUPL 1.2 (LICENSE do repositório; o .gpkg não traz licença própria) |

## Regras do arquivo publicado

- **Produto**: recorte por NCM (tabela `PRODUTOS` em `construir.mjs`). Ordem e % por peso líquido; urânio e
  eletricidade por valor FOB.
- **Fluxo** = produto × sentido × país × via com 1% ou mais do produto no sentido. URFs listadas no fluxo: 5% do
  fluxo ou 1% do produto. Todo fluxo leva `fonte` e `rota` (sempre com a palavra "esquemática").
- **Âncora (URF)**: a URF é a unidade de despacho da Receita, não o cais. Coordenada, nesta ordem: aeroporto →
  ANAC pelo OACI (o município da ANAC tem de bater com o da URF); porto → o terminal da Transpetro do município
  quando é o único dela ali, no `combustivel-instalacoes.geojson` já publicado (ANP); senão a sede municipal do
  IBGE (`Cidade`/`Sede Municipal`). Suape usa a localidade do IBGE com esse nome (Ipojuca). A ligação URF →
  município está na tabela `URFS` e é a única curadoria manual.
- **País**: o código de três letras vem do próprio Comex (`/tables/countries/{id}`) e é conferido contra a tabela
  numérico → alfa-3 de `src/lib/atlas/worldApi.ts` para todo país desenhado no 110m. Ponto: centroide do maior
  polígono no 110m; se o país não está no 110m (Singapura, Malta...), no 50m.
- **Rota marítima** (`metodo: 'mar'`): um traçado por par URF–país marítimo com 5% ou mais do produto no
  sentido, ou entre os 3 maiores pares do produto, quando o produto soma 10 kt ou mais no sentido. O traçado é do
  `roteador.mjs` (o cabeçalho dele diz o algoritmo inteiro): terra dos países do Natural Earth 10m numa grade fina
  de 1/30°, busca de caminho mínimo numa grade de 0,1° com 16 vizinhos, custo maior perto da terra e
  entre 38° S e 48° S (até ×1,5), fechado ao sul de 50° S e ao norte de 71,5° N; alisado sem tocar terra
  (segmentos retos em Mercator, como o mapa desenha, até 1.000 km); conserto final contra os polígonos (ilha fina
  atravessada é engrossada e a busca refeita).
  **Folga da costa (leva 3).** A distância à terra (km) é medida na grade fina por transformada de chanfro, com as
  ilhas pequenas do Natural Earth (`ne_10m_minor_islands`) e as ilhotas dos países (caixa < 0,12°) engrossadas,
  sem fechar célula grossa (senão Gibraltar e o canal de São Sebastião fechavam). O custo de um passo é
  × (1 + 2,5·q²), q = (45 − d)/45 para d < 45 km: em mar aberto a rota corre ao largo, num estreito o mínimo fica
  no meio do canal. O alisamento exige em cada ponto da reta min(30 km, a folga do caminho da grade ali) × 0,85.
  Depois, onde a reta passa a menos de 30 km da terra, ganha um vértice no ponto mais perto dela e cada vértice
  é deslocado (disco de até ~18 km) para a posição de maior folga dos dois segmentos vizinhos, sem cruzar terra;
  por fim sai o vértice cuja retirada não perde folga (desfaz zigue-zague). `folgaMinKm` vai em cada rota. Começa no mar mais perto da âncora (`ligacaoKm`), termina no mar
  junto ao maior polígono do país, no trecho mais próximo pelo mar em km (leva 4, abaixo; `chegadaKm`). `sobreTerraKm` mede, contra os polígonos do 10m, o que cai em
  terra fora dos portões: **0 km nas 67 rotas**. Portão: Canal do Panamá, reta entre Cristobal e Balboa da camada
  de portos do Natural Earth (`portoes: ['panama']`; só a rota de Manaus ao Peru usa). Suez **sem portão**: a
  camada de portos traz Port Said, mas não a ponta sul; rota que o usaria contorna a África.
- **Rota aérea** (`metodo: 'arco'`, `via: 'aérea'`): QAV com via aérea, par aeroporto (âncora da ANAC) × país com
  1% ou mais do QAV exportado: arco de círculo máximo ao centro do país, um vértice a cada ~400 km. URF de interior
  com via aérea (Belo Horizonte) e destino "Brasil" ficam sem arco. A frase sobre o que o dado não diz está em `leia`.
- **Viagens** (`viagens`): a lista pronta para desenhar, uma entrada por produto × sentido × URF × país com rota
  (`id`, `produto`, `sentido`, `urf`, `pais`, `rota`, `via`, `kt`, `fobUS`, `pctDoProduto`, `classe`). Classe:
  `petroleiro` (petróleo, diesel, gasolina, nafta, QAV por mar, óleo combustível, etanol), `graneleiro` (carvão e
  coques), `gaseiro` (GNL, GLP), `carga` (urânio, em contêiner), `aviao` (via aérea). Ordem: exportação primeiro,
  depois kt decrescente. 120 viagens (58 de exportação).
- **Condutos** (`condutos`): gás natural da Bolívia, declarado com via "conduto ou rede de transmissão" na URF de
  Corumbá; o ponto é a sede municipal do IBGE (não a travessia do duto).
- **Eletricidade**: ONS, horas positivas = exportação (o dicionário diz; conferido pelos totais contra o Comex,
  bloco `conferencia.sentidoDoONS`). `eletricidade.interligacoes`: um ponto por conversora com cadastro (Garabi I e
  II, Rivera, Acaray), com país, ponto do SINDAT já publicado, `serie` (a chave do país em `eletricidade.paises`: a
  série do ONS é por país, não por conversora) e nota. Acaray não tem série (o ONS não traz o Paraguai em 2025).
  Itaipu: nenhuma fonte usada dá o MWh da energia paraguaia cedida.
  **Leva 4:** `eletricidade.paises.*.horasPorMes` (horas que o ONS publicou em cada mês), `horasDoAno` (8.760) e
  `horasDosMeses`: a soma do ano é a das horas publicadas (Argentina 8.424, Uruguai 8.448; março 600 de 744).
  `eletricidade.paraguaiComex` guarda o valor do Comex do Paraguai (US$ 900 mi, URF não informada) SEM ligá-lo ao
  ponto de Acaray; a nota de Acaray e a de Itaipu deixaram de dizer "Itaipu fica de fora" e dizem que a
  quantidade não está em nenhuma fonte usada e o valor, sim.
- **Leva 4, texto que vai para a tela:** `fonteDaCoordenada.conjunto` e `fonteDoPonto` sem nome de arquivo (o
  arquivo vai em `arquivo` / `arquivoDoPonto`); o `leia` das rotas sem nome de campo; `leia` chama cada item da
  lista de **remessa** (um produto, de uma URF para um país, somado no ano). O centro da Rússia (`paises.RUS`)
  saía em 202,79° de longitude (o anel do 110m cruza o antimeridiano e o centróide desembrulhava): agora o anel é
  deslocado antes da conta e a longitude volta a [-180, 180] (99,89° E, 61,73° N).

## Licença das rotas (decisão da leva 2)

A leva 1 usou a rede MARNET do Eurostat, sob EUPL 1.2, copyleft sobre as geometrias derivadas. O orquestrador
decidiu trocar por rotas calculadas aqui sobre o Natural Earth (domínio público): o arquivo publicado não deve
licença a ninguém e o `comercio-rotas-licenca.json` saiu do `public/`. A variante MARNET continua atrás de
`--marnet`, que volta a escrever o texto da licença ao lado do arquivo.

Comparação com a MARNET da leva 1 (mesmos ids, `km` da linha): 66 das 67 rotas ficam a menos de 15% (a maior
parte a menos de 5%). Acima, só a da Arábia Saudita (+17,2%: sem portão de Suez, entra no Mar Vermelho pelo sul,
14.051 km contra 11.994; a MARNET passava por Suez e cruzava 451 km de terra no 110m). O `ligacaoKm` caiu de
~250 km (Salvador) e ~190 km (Campos) para 5 e 39 km: a grade entra nas baías que a rede não alcançava. Tabela
completa: rodar `desenhar.mjs` e a comparação da leva 2 (relatório do agente comercio-dados).

## Limitações medidas

- A grade não sobe rios nem entra em lagoa: Manaus começa no mar a 1.070 km da âncora (foz do Amazonas), Porto
  Alegre a 102 km (a Lagoa dos Patos fica fora do oceano), Campos dos Goytacazes a 39 km (`ligacaoKm`); as demais
  a menos de 30 km. A linha começa no mar; ligar a âncora a ele é da interface.
- **Onde a rota termina (leva 4).** No trecho de costa do maior polígono do país MAIS PRÓXIMO DA ORIGEM PELO MAR,
  em km: uma busca só de distância (sem a folga da costa nem o custo do mar do Sul, com o portão do Panamá) acha a
  célula de destino; a busca com custo só decide o caminho até ela. Na leva 3 o custo escolhia também o destino, e
  a Rússia (de Santos, Itaguaí, Rio, Paranaguá e Maceió) terminava no mar de Barents porque os estreitos
  dinamarqueses ficavam "caros"; agora termina no golfo da Finlândia [27,95; 59,75], passando pelo meio do Øresund
  (folga 2,1 km em Helsingør, onde o estreito tem ~4 km; 0 amostra em terra na base do Mapbox). De Manaus a costa
  russa mais próxima pelo mar continua sendo o Barents (a saída do Amazonas vem por oeste da Escócia). Estados
  Unidos na Flórida, Emirados em Fujairah, Austrália no sudoeste. Os ids de rotas e viagens não mudaram.
- **Contorno por falta de portão (leva 4).** Teste do Suez, nunca desenhado: Port Said (camada de portos do
  Natural Earth) ligado à célula de mar mais ao norte do golfo de Suez na grade, em reta. Rota que passa ao sul
  da África e cuja costa de destino ficaria 3% ou mais perto com essa ligação ganha `contorno` (texto para a
  ficha). Hoje só `0717800-SAU` (Arábia Saudita, que entra no Mar Vermelho pelo sul). O construtor ficou mais
  lento (~3,7 min) por causa das duas buscas a mais por origem.
- Paraguai (nafta e etanol "marítimos", de Rio Grande e Suape) não tem costa: fica sem traçado, e o fluxo diz isso.
- Folga (leva 3), medida contra o Natural Earth com `medir-folga.mjs`, fora dos 50 km das pontas e do portão:
  mediana 22,8 km (era 3,3); menor 3,7 km, na aproximação de Balboa (Peru, ilhas da baía do Panamá, junto ao
  portão); 5,2 km no meio do canal entre Sangiang e Sumatra (Sunda) e em Bab el-Mandeb; 7,4 km no meio de
  Gibraltar. A base do Mapbox tem costa e ilhotas que o Natural Earth não tem: a prova é a captura de perto.
- Suez sem portão (acima). Bósforo e Kiel também sem portão; nenhuma rota precisa do Mar Negro.
- Escolhas de modelo declaradas em `fontes.rotas`: o custo extra rente à costa e no mar do Sul e os limites de 50° S
  e 71,5° N mudam o traçado; sem o custo do sul, as rotas da Ásia desciam até 50° S e corriam ao longo do limite.
- O país de destino pode ser entreposto ou bandeira (Singapura, Panamá, Libéria, Ilhas Marshall).
- O Comex registra o mês do despacho: a série mensal de eletricidade dele anda dois meses atrás da do ONS.
