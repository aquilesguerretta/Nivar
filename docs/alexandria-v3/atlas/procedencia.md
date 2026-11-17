# Atlas da Alexandria v3 — procedência dos dados

> Documento **gerado** por `tools/alexandria-atlas/gerar-procedencia.mjs` em 17/11/2026, a
> partir de `tools/alexandria-atlas/manifesto-fontes.json` (o que foi baixado) e de
> `public/alexandria/atlas/dados/indice.json` (o que foi publicado). Não edite à mão.

Toda camada do Atlas vem de fonte primária oficial brasileira (ANEEL, ONS, ANP, IBGE, ANA e, no comércio exterior, MDIC/SECEX; o traçado esquemático das rotas marítimas é calculado sobre a terra do Natural Earth, de domínio público, seção 9), e cada uma tem aqui: a fonte, o
endereço, a data do acesso, a licença declarada, o hash do arquivo guardado (ver abaixo o caso do SINDAT) e o que foi feito com ele. Onde a fonte
não traz um dado, o mapa declara a ausência; nada foi estimado, interpolado ou completado.

## Como reproduzir

```
node tools/alexandria-atlas/baixar.mjs --tudo      # baixa as fontes para tools/alexandria-atlas/bruto/ e regrava o manifesto
node tools/alexandria-atlas/construir.mjs          # gera public/alexandria/atlas/dados/
node tools/alexandria-atlas/gerar-procedencia.mjs  # regrava este documento
```

O bruto (172 arquivos, cerca de 330 MB) **não está no git**: está em
`tools/alexandria-atlas/bruto/`, ignorado por um `.gitignore` local. O que prova a procedência é o manifesto, com o
SHA-256 de cada arquivo guardado no bruto. Para os arquivos do Portal de Dados Abertos do ONS e da ANEEL, é o hash dos
bytes exatamente como vieram do servidor. **Para as quatro camadas do SINDAT não é**: o serviço entrega páginas de até
1.000 feições, e o arquivo guardado é montado localmente por `baixar.mjs` (páginas concatenadas na ordem de
`OBJECTID`, mais um bloco `_servico` com o endereço, o total de feições, os sistemas de referência e os campos); o hash é
desse arquivo montado, e muda se a montagem mudar, mesmo com a fonte idêntica. Baixar de novo dá outro hash sempre que a
fonte tiver sido atualizada (o ONS atualiza os cadastros todos os dias); o manifesto registra o estado do dia do acesso.

## Acesso às fontes: o que foi medido em 15 e 16/11/2026

| Fonte | Endereço | Resultado medido |
| --- | --- | --- |
| ONS · SINDAT (serviço geográfico) | `sig.ons.org.br/server/rest/services/SINDAT` | Responde. Serviço ArcGIS público, sem token, com geometria real. |
| ONS · Dados Abertos | `dados.ons.org.br` (arquivos em `ons-aws-prod-opendata.s3.amazonaws.com`) | Responde. Licença CC-BY declarada em cada conjunto. |
| ANEEL · Dados Abertos (SIGA) | `dadosabertos.aneel.gov.br` | **Não conecta de fora do Brasil** (timeout de TCP). O arquivo usado é a captura íntegra do CSV oficial no Internet Archive. |
| ANEEL · SIGEL | `sigel.aneel.gov.br` | **Não conecta de fora do Brasil** (mesmo bloqueio). Não usado. |
| EPE · WebMap | `gisepeprd2.epe.gov.br` | **Fora do ar** ("Sistema em manutenção", HTTP 503). Não usado. |
| ANP · GeoServer | `gishub.anp.gov.br/geoserver` | Responde. WFS 2.0 público, sem token, 83 camadas no GetCapabilities (seção 6). |
| ANEEL · ArcGIS Online (BDGD) | `www.arcgis.com/sharing/rest/content/items/<item>/data` (organização `J5unWNi0P2dwjI3y`; Hub `dadosabertos-aneel.opendata.arcgis.com`) | Responde (HTTP 200, `Accept-Ranges: bytes`). 1.014 itens File Geodatabase da BDGD, de 114 códigos de distribuidora; a camada ARAT é lida por faixa HTTP (seção 7). Busca na organização por concessão, atuação, ARAT, distribuidoras ou permissionárias: 0 resultados; não existe Feature Service nacional de área de concessão. |
| IBGE · API de malhas e localidades | `servicodados.ibge.gov.br` | **Não conecta de fora do Brasil** (timeout de TCP; de novo em 16/11/2026). Não usado diretamente (os arquivos do Portal BR vieram dela em 26/07/2026). |
| IBGE · geoftp | `geoftp.ibge.gov.br` | Responde (medido em 16/11/2026). Usado só para a área oficial de Roraima, que confere a união de Roraima ao Norte (seção 8). |
| ANA · SNIRH (serviço geográfico) | `www.snirh.gov.br/arcgis/rest/services` | Responde (medido em 16/11/2026). ArcGIS público, sem token; a camada de massas d'água não pagina. Usado para o rumo das barragens (seção 1). O catálogo de metadados (`metadados.snirh.gov.br`) também responde. |

Medição das áreas de concessão, 15/11/2026 entre 19h10 e 19h30 UTC: o SIGEL (`sigel.aneel.gov.br`: `/arcgis/rest/services`,
`/PORTAL/Downloads/FeatureServer`, `/server/rest/services`, `/portal/home/`) e o CKAN da ANEEL (`dadosabertos.aneel.gov.br`,
`package_search?q=concess` e `?q=BDGD`) não responderam (conexão expirada em 21 s, sem código HTTP); o Internet Archive não
tem captura de `PORTAL/Downloads/FeatureServer`; o servidor da EPE (`gisepeprd2.epe.gov.br/arcgis/rest/services`) devolveu
HTTP 503, "Sistema em manutenção"; `dados.gov.br/dados/api` devolveu HTTP 401. A BDGD no ArcGIS Online foi o único caminho
oficial que respondeu.

Consequência: a rede de transmissão e as subestações vêm do ONS (SINDAT), e não da EPE/ANEEL como o brief previa. O
SINDAT é a base geográfica do próprio operador do sistema, então a troca não rebaixa a fonte. As camadas de gás e
petróleo vêm do GeoServer da ANP (seção 6); o que só a EPE publica (oleodutos, plano de expansão) **não entrou**. As áreas
de atuação das distribuidoras vêm da BDGD da ANEEL (seção 7), não do SIGEL.

## Camadas

### 1. Usinas — ANEEL · SIGA

| id | órgão | conjunto | acesso | bytes | SHA-256 do arquivo guardado no bruto |
| --- | --- | --- | --- | ---: | --- |
| `aneel-siga` | ANEEL | SIGA · Sistema de Informações de Geração da ANEEL · empreendimentos de geração (arquivo diário) | 15/11/2026 | 7.885.300 | `68c99ab5e6eaf8c3faab39f747d616aa387f6e97207c1c98335d215d3b61c174` |
| `ons-capacidade-geracao` | ONS | Dados Abertos · Capacidade Instalada de Geração | 15/11/2026 | 1.318.263 | `1fd2d0f089147f4a32f41a776b66a8c02adacf5b57c30e9756166ec33febf99f` |

- **Página do conjunto:** <https://dadosabertos.aneel.gov.br/dataset/siga-sistema-de-informacoes-de-geracao-da-aneel>
- **Endereço baixado:** `https://web.archive.org/web/20261019114216id_/https://dadosabertos.aneel.gov.br/dataset/6d90b77c-c5f5-4d81-bdec-7bc619494bb9/resource/2f65a1b0-19b8-4360-8238-b34ab4693d55/download/siga-empreendimentos-geracao-diario.csv`
- **Licença:** Dados Abertos da ANEEL — Open Database License (ODbL), declarada no portal.
- **Data-base do cadastro:** 19/10/2026 (coluna `DatGeracaoConjuntoDados` do próprio arquivo).
- **Observação de acesso:** Baixado da captura de 19/10/2026 11:42 UTC no Internet Archive (cópia íntegra do CSV oficial; a coluna DatGeracaoConjuntoDados traz 2026-10-19). O servidor da ANEEL não aceita conexão de fora do Brasil.
- **O que o cadastro tem:** 25.055 empreendimentos; 22.821 em operação, somando 220,9 GW de potência fiscalizada, e 2.234 que ainda não operam (em construção ou só outorgadas).
- **Empreendimentos repetidos na fonte:** o arquivo tem 25.058 linhas; 3 empreendimentos aparecem duas vezes, uma por tipo de outorga, iguais em todo o resto (Agro Trafo, PCH.PH.TO.000031-0.1, Monte Alto, UHE.PH.MG.001489-3.1, Rio Timbó, PCH.PH.SC.028744-0.1). São contados e desenhados uma vez. Se um CEG repetido divergir em qualquer outro campo, `construir.mjs` para com erro em vez de escolher uma linha.
- **O que está no mapa:** 24.566 usinas, das quais 22.427 em operação e 2.139 que ainda não operam. **As outras 489 não têm coordenada na fonte** (latitude e longitude zeradas) e ficam de fora; a interface diz isso na legenda.
- **Municípios:** como a fonte escreve, cada um com a própria UF ("Selvíria - MS, Ilha Solteira - SP"); usina em rio de divisa tem municípios de dois estados.
- **Transformação:** nenhuma sobre a posição além de arredondar a 4 casas (≈ 11 m). A fonte de geração do mapa é a do cadastro (`DscOrigemCombustivel`), com o fóssil aberto por `DscFonteCombustivel` em gás natural, carvão, petróleo e outros. A potência mostrada é a fiscalizada para usina em operação e a outorgada para a que ainda não opera.
- **Datas ausentes:** o SIGA grava 1900 (quase sempre 03/01/1900) em `DatEntradaOperacao` quando não tem a data; o Atlas lê esse ano como ausência. 156 usinas do mapa em operação estão nesse caso; a ficha diz "sem data na fonte". Usina que ainda não opera nunca mostra data.
- **Posição incoerente na própria fonte:** em 13 usinas a coordenada cai dentro de outro submercado que não o de nenhum estado dos municípios declarados, a mais de 0,25° da divisa (exemplos: Maranhão IV (Antiga MC2 Joinville), declarada em MA e posicionada no Sul; Maranhão V (Antiga MC2 João Neiva), declarada em MA e posicionada no Sudeste/Centro-Oeste; Fótons de São George 01 (Antiga Panorama 04), declarada em MS e posicionada no Nordeste). O Atlas **não corrige**: desenha onde o cadastro diz e avisa na ficha.
- **Proprietário:** a ficha mostra o campo de proprietário e regime como o cadastro escreve.
- **Vínculo com o ONS:** 1.985 usinas do mapa casam com a base de Capacidade Instalada do ONS pelo núcleo do CEG (o código de seis dígitos que as duas bases compartilham). Dessas a ficha traz modalidade de operação, subsistema e potência efetiva; das demais, a ficha diz "fora da base de capacidade do ONS". Unidades que o ONS marca fora dos quatro subsistemas não entram na soma da usina brasileira: ITAIPU 50 HZ (PY), 10 unidades.
- **Potência ao longo dos anos (coluna `etapas`):** 1.961 usinas em operação (192,6 GW) têm a potência datada por unidade geradora; 144 delas (94,4 GW) cresceram em mais de um ano, e em 52 o ano da primeira unidade difere do ano do SIGA. 20.466 usinas do mapa em operação não têm etapas. Regra: Usina em operação cujo núcleo do CEG casa com o cadastro de unidades geradoras do ONS (CAPACIDADE_GERACAO.csv): o ano de cada etapa é o de dat_entradaoperacao das unidades ativas (sem dat_desativacao) dos quatro subsistemas; o setor de 50 Hz de Itaipu (subsistema PY) fica fora. O total é a potência fiscalizada da ANEEL; onde a soma das unidades do ONS difere, a forma vem do ONS e a escala da ANEEL: kwAcum(ano) = round(kw × MW do ONS até o ano / MW do ONS no total). Unidades já desativadas não entram (o Atlas conta a frota que opera hoje). As demais usinas não têm data por unidade: entram inteiras no ano de entrada em operação do SIGA. Formato: [ano1, kwAcum1, ano2, kwAcum2, …] (array plano; anos crescentes; kW inteiros acumulados até o fim do ano; o último é o `kw` da usina); null quando a usina não opera ou não casa com o ONS. Em 19 usinas a soma das unidades do ONS difere da ANEEL em mais de 5% (Santa Cruz, ANEEL 500 MW e ONS 1.086 MW, Azulão, ANEEL 361,5 MW e ONS 295,4 MW, Piratininga, ANEEL 285 MW e ONS 385,1 MW, CMPC (Antiga Aracruz Unidade Guaíba), ANEEL 265 MW e ONS 282,4 MW, Três Lagoas (Antiga Luiz Carlos Prestes), ANEEL 252 MW e ONS 350 MW). Conferência contra o bruto: Tucuruí (SIGA: 1984) — 1984: 722,5 MW, 1985: 1.772,5 MW, 1986: 2.122,5 MW, 1987: 2.845 MW, 1988: 3.195 MW, 1989: 3.545 MW, 1991: 3.895 MW, 1992: 4.245 MW, 2003: 5.415 MW, 2004: 6.195 MW, 2005: 6.975 MW, 2006: 7.365 MW, 2007: 8.535 MW; Itaipu (Parte Brasileira) (SIGA: 1989) — 1987: 1.400 MW, 1988: 2.100 MW, 1989: 4.200 MW, 1990: 4.900 MW, 1991: 6.300 MW, 2007: 7.000 MW; Belo Monte (SIGA: 2016) — 2016: 1.988,7 MW, 2017: 4.510,9 MW, 2018: 7.566,4 MW, 2019: 11.233,1 MW; Xingó (SIGA: 1994) — 1994: 527 MW, 1995: 1.581 MW, 1996: 2.635 MW, 1997: 3.162 MW.
- **Arquivos publicados:** `public/alexandria/atlas/dados/usinas-principais.json` (877 KB) com as 5.066 usinas a partir de 5 MW, carregado de saída; `public/alexandria/atlas/dados/usinas-menores.json` (2.745 KB) com as 19.500 menores, carregado só quando o zoom pede ou quando alguém busca.

Cada par de colunas descreve a mesma população: "no cadastro" conta também as usinas sem coordenada; "no mapa" só as desenhadas. A camada de cada fonte desenha só as que operam; as demais ficam na camada de usinas em construção ou só outorgadas.

| Fonte | Usinas no cadastro (todas as fases) | No mapa (todas as fases) | Em operação no cadastro | GW em operação no cadastro | Em operação no mapa | GW em operação no mapa |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| hidro | 1.475 | 1.453 | 1.362 | 110,24 | 1.347 | 110,23 |
| eolica | 1.548 | 1.545 | 1.138 | 34,94 | 1.136 | 34,84 |
| solar | 18.923 | 18.536 | 17.323 | 23,84 | 16.964 | 23,56 |
| nuclear | 3 | 3 | 2 | 1,99 | 2 | 1,99 |
| biomassa | 692 | 672 | 655 | 18,03 | 643 | 17,92 |
| gas | 244 | 198 | 182 | 20,18 | 181 | 20,18 |
| carvao | 21 | 21 | 21 | 3,91 | 21 | 3,91 |
| oleo | 2.145 | 2.134 | 2.134 | 7,6 | 2.129 | 7,58 |
| outros | 4 | 4 | 4 | 0,17 | 4 | 0,17 |

#### Precisão da coordenada (campo `prec`)

- **O que é:** em cada usina, subestação e instalação da ANP, o número de casas decimais **significativas** da coordenada como a fonte bruta a traz, antes do arredondamento a 4 casas: o zero final não conta (o SIGA escreve 8 casas fixas) e o resíduo de ponto flutuante abaixo da 10ª casa é descartado; vale a pior das duas coordenadas; 4 quer dizer "4 ou mais". O erro da posição é meia unidade da última casa (4 casas ≈ 5,6 m; 3 ≈ 56 m; 2 ≈ 555 m; 1 ≈ 5,6 km). É o que a regra das maquetes lê para saber se a posição sustenta uma maquete; antes, ela lia o texto do número já arredondado, e o zero final derrubava usina precisa.
- **Usinas (todas as fases), casas → registros:** 4 ou mais: 24.103 · 3: 363 · 2: 86 · 1: 7 · 0: 7. Só as em operação: 4 ou mais: 22.036 · 3: 305 · 2: 73 · 1: 6 · 0: 7.
- **Subestações:** 4 ou mais: 1.327 · 3: 38 · 2: 12 · 1: 3 · 0: 1.
- **Instalações da ANP:** 4 ou mais: 156 · 3: 26 · 2: 4 · 1: 1 · 0: 0.

#### Rumo das barragens — ANA · SNIRH (campo `rumoB`)

| id | órgão | conjunto | acesso | bytes | SHA-256 do arquivo guardado no bruto |
| --- | --- | --- | --- | ---: | --- |
| `ana-massas-dagua-hidro` | ANA | SNIRH · Massas d'Água (serviço SNIRH2016/Massa_dagua, camada 0 "massa_dagua") · só os polígonos com nome iniciado por "UHE", "PCH" ou "CGH" | 16/11/2026 | 17.401.426 | `2dcda486816ee64c477493059d564f2ee96ad20728384d129a302c5bfd5b8f85` |

- **Serviço:** `https://www.snirh.gov.br/arcgis/rest/services/SNIRH2016/Massa_dagua/MapServer/0`. Ficha de metadados do conjunto: <https://metadados.snirh.gov.br/geonetwork/srv/por/catalog.search#/metadata/7d054e5a-8cc9-403c-9f1a-085fd933610c>.
- **Forma do acesso:** identificadores por prefixo do nome (returnIdsOnly, where nmoriginal LIKE 'UHE%', 'PCH%', 'CGH%'), feições em lotes de 25 por POST (f=geojson, outSR=4326, maxAllowableOffset=0,0001), concatenadas em ordem de identificador num GeoJSON montado localmente, com um bloco _servico; o sha256 é desse arquivo montado, não de uma resposta do servidor. O serviço não aceita paginação (supportsPagination: false; limite de 1.000 por consulta): os identificadores vêm de uma consulta returnIdsOnly por prefixo e as feições, em lotes de 25 identificadores, em GeoJSON (outSR=4326) com maxAllowableOffset=0,0001° (≈ 11 m: o serviço generaliza o contorno na origem). Sistema de referência de origem declarado pelo serviço: SIRGAS 2000 (EPSG:4674). A ficha de metadados descreve a versão 2019 do mapeamento; o serviço consultado é o da pasta SNIRH2016, e cada polígono traz a própria versão (deversao) e o satélite de origem (desatelite).
- **Licença:** Licença nominal não declarada. O serviço declara copyrightText "ANA"; a ficha de metadados do conjunto no catálogo do SNIRH declara, em restrições legais: "O acesso ao dado é livre." Uso com atribuição à ANA.
- **Para que serve:** o cadastro não diz para onde a barragem está virada. Onde a ANA mapeou o reservatório com o nome da usina, a borda do polígono junto ao ponto do cadastro dá o eixo da crista e o lado com água dá o montante. rumoB é o rumo do montante (graus a partir do norte, sentido horário, 0 a 360): a direção que sai da crista para o lado do reservatório. A crista corre a rumoB ± 90° (rumoDaCrista, de 0 a 180). Ausente (null): vale a convenção do modelo (crista leste–oeste, montante ao norte).
- **Critério (o teste da água):** mesmo nome da usina; borda do polígono a até 300 m do ponto do cadastro; trecho de ±1.200 m da borda com retidão ≥ 0,95 (1 − λ2/λ1 do eixo principal); água de um lado ≥ min(1.000 m, meio vão) e do outro ≤ 100 m; usina sem posição a confirmar; coordenada com 3 casas significativas ou mais na fonte (prec). Sem rumo derivado, a maquete segue a convenção leste–oeste, e a ficha diz qual das duas regras vale. Nenhum rumo foi medido a olho na foto de satélite.
- **Cobertura** (UHE e PCH em operação, com coordenada; 966 polígonos de UHE, PCH e CGH na fonte):

| Tipo | Em operação | Com rumo da ANA | Sem polígono a 1 km | Polígono de outro nome | Reprovadas no teste | Posição a confirmar |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| UHE | 215 | 30 | 10 | 7 | 167 | 0 |
| PCH | 431 | 1 | 103 | 18 | 309 | 0 |

- **Passaram no teste, mas ficam na convenção pela coordenada imprecisa na fonte** (menos de 3 casas significativas): Paraibuna.
- **Com rumo (rumoB = rumo do montante; entre parênteses, o eixo da crista):** Tucuruí 181° (91°); Itaipu (Parte Brasileira) 9° (99°); Jirau 219° (129°); Santo Antônio 251° (161°); Ilha Solteira 26° (116°); Jupiá (Eng° Souza Dias) 329° (59°); Porto Primavera (Eng° Sérgio Motta) 69° (159°); Luiz Gonzaga (Itaparica) 336° (66°); Água Vermelha (Antiga José Ermírio de Moraes) 83° (173°); Serra da Mesa 242° (152°); Estreito 170° (80°); Sobradinho 298° (28°); Luís Eduardo Magalhães (Lajeado) 233° (143°); Três Irmãos 64° (154°); Taquaruçu (Escola Politécnica) 111° (21°); Peixe Angical 84° (174°); Volta Grande 111° (21°); Nova Avanhandava (Rui Barbosa) 82° (172°); Colíder 51° (141°); Ferreira Gomes 270° (0°); Balbina 338° (68°); Samuel 92° (2°); Manso 109° (19°); Pedra do Cavalo 290° (20°); Passo Real 68° (158°); Ibitinga 68° (158°); Corumbá III 348° (78°); Salto do Rio Verdinho 249° (159°); Retiro Baixo 201° (111°); Itupararanga 132° (42°); Verde 4A 325° (55°).
- **Limites:** Rumo derivado do reservatório mapeado pela ANA (polígonos de 2015 a 2019, satélite variável por polígono). Falha por construção em barragem em arco e onde a casa de força fica longe do barramento (Belo Monte, Furnas): essas ficam na convenção, declarada.

### 2. Linhas de transmissão — ONS · SINDAT

| id | órgão | conjunto | acesso | bytes | SHA-256 do arquivo guardado no bruto |
| --- | --- | --- | --- | ---: | --- |
| `sindat-linhas` | ONS | SINDAT · Mapa do SIN · camada "Linha de Transmissão" | 15/11/2026 | 2.839.890 | `fc3dbd7c4f9de4a0798a332d47d2276e6c85af144ea84294fd181769fa2937d4` |
| `sindat-linhas-cc` | ONS | SINDAT · Mapa do SIN · camada "Linha de Corrente Contínua" | 15/11/2026 | 32.393 | `2a9fd6be9b6cf0eac71e81a5e2a261d64717212d7f8d35176d37eab68c413bf4` |

- **Serviço:** `https://sig.ons.org.br/server/rest/services/SINDAT/MAP_FT/MapServer/2` (corrente alternada) e `https://sig.ons.org.br/server/rest/services/SINDAT/MAP_FT/MapServer/3` (corrente contínua). Página: <https://sindat.ons.org.br/>
- **Forma do acesso:** consulta paginada ao serviço (where=1=1, outFields=*, outSR=4326, f=geojson), feições concatenadas na ordem de OBJECTID.
- **Licença:** Dado público do ONS; o serviço não declara licença (campo copyrightText vazio). Uso com atribuição ao ONS.
- **O que tem:** 2.040 linhas de corrente alternada e 14 circuitos de corrente contínua (contagem por identificador), em 2.067 feições desenhadas: o ONS entrega 13 linhas em duas feições com o mesmo identificador (em algumas as duas geometrias diferem; o Atlas desenha as duas e conta a linha uma vez). 195.456 km em operação pelo campo de comprimento da fonte, contado uma vez por linha.
- **Linhas sem entrada em operação:** 199 não têm data de entrada em operação na fonte; o mapa as desenha tracejadas, numa camada à parte, desligada de saída. **72 delas têm previsão registrada para um ano que já passou**: o cadastro não diz se já operam, e o Atlas não afirma que não operam. 4 trazem previsão em 2090 ou depois (2099), marcador de "sem previsão": o Atlas publica a previsão como ausente.
- **Data de carga do cadastro:** nos ativos antigos o SINDAT registra, no lugar da data de entrada em operação, a data em que a base foi carregada: o mesmo dia em centenas de instalações (31/12/1990, 02/06/2000; critério: dia repetido em 50 ou mais linhas e subestações). 288 linhas em operação estão nesse caso. O Atlas as trata como em operação, mas não publica esse ano como ano de entrada (`op` nulo, `opAntesDe` com o ano da carga); a ficha diz que o cadastro registra a data de carga da base, não a de entrada. Outros dias repetidos em poucas instalações não foram tratados como data de carga.
- **Traçado:** é o do ONS, **generalizado na origem** (média de 14 vértices por linha). Serve para a escala do país e do estado; não mostra cada torre. Nenhum vértice foi acrescentado ou movido; só o arredondamento a 4 casas.
- **Por tensão (kV), todas as linhas, por identificador:** 69: 1 · 88: 8 · 138: 9 · 230: 1135 · 242: 1 · 345: 188 · 440: 74 · 500: 513 · 525: 98 · 765: 9 · 34.5: 4 · CC 600: 8 · CC 800: 6.
- **Por tensão (kV), só em operação:** 69: 1 · 88: 8 · 138: 9 · 230: 1052 · 242: 1 · 345: 175 · 440: 66 · 500: 430 · 525: 88 · 765: 9 · 34.5: 4 · CC 600: 8 · CC 800: 4.
- **Arquivo publicado:** `public/alexandria/atlas/dados/rede-linhas.geojson` (1.167 KB).

### 3. Subestações — ONS · SINDAT e Dados Abertos

| id | órgão | conjunto | acesso | bytes | SHA-256 do arquivo guardado no bruto |
| --- | --- | --- | --- | ---: | --- |
| `sindat-subestacoes` | ONS | SINDAT · Mapa do SIN · camada "Subestação" | 15/11/2026 | 551.504 | `b2ee0090a442ee271ba30249b012f3d202435e9e14162bef86c7a1fb96a64390` |
| `ons-subestacao` | ONS | Dados Abertos · Subestação da Rede de Operação | 15/11/2026 | 161.670 | `25b7452641dcff60a6733299d870c2bad0d61d0aa432b1672f2c17d6055ea315` |

- **O que está no mapa:** 1.381 subestações: 1.236 do mapa do SINDAT e 145 que só existem no cadastro de Dados Abertos.
- **Posição:** a do SINDAT. **Tensão e subsistema:** do cadastro, quando o identificador casa.
- **Ausências declaradas:** 474 subestações não têm tensão no cadastro (a ficha diz "tensão não informada na fonte"); 24 pontos do SINDAT sem nome nem identificador e 9 linhas do cadastro sem coordenada ficaram fora.
- **Situação:** das 1.236 do SINDAT, 1.194 têm data de entrada em operação e 42 não têm (previstas; 3 delas com previsão em 2090 ou depois, publicada como ausente). As 145 que só existem no cadastro de Dados Abertos não têm situação na fonte.
- **Data de carga do cadastro:** 442 subestações em operação trazem como data de entrada a data de carga da base (31/12/1990, 02/06/2000); o Atlas não publica esse ano como ano de entrada, pelo mesmo critério das linhas.
- **Repetições na fonte:** o SINDAT devolve 4 pontos a mais com identificador já visto (CEPCT, MGBRO2, CEUCZS); fica o primeiro ponto de cada uma.
- **Divergência entre as duas bases do ONS:** em 49 subestações a posição difere em mais de 0,05° (≈ 5 km). O mapa usa a do SINDAT. A divergência não foi resolvida, só registrada.
- **Posição incoerente com o estado:** em 3 subestações a coordenada cai em outro submercado que não o do estado declarado, a mais de 0,25° da divisa (CENTENARIA, declarada em RJ e posicionada no Norte, UT.MARANHAO 4, declarada em MA e posicionada no Sul, UT.MARANHAO 5, declarada em MA e posicionada no Sudeste/Centro-Oeste). Mesmo critério das usinas; não corrigido. A conferência é por submercado: conflito entre estados do mesmo submercado não é detectado.
- **Arquivo publicado:** `public/alexandria/atlas/dados/rede-subestacoes.geojson` (398 KB).

### 4. Reservatórios e bacias — ONS · Dados Abertos

| id | órgão | conjunto | acesso | bytes | SHA-256 do arquivo guardado no bruto |
| --- | --- | --- | --- | ---: | --- |
| `ons-reservatorio` | ONS | Dados Abertos · Reservatórios | 15/11/2026 | 35.738 | `3fe0b61bc3869a73026e20356e52540698a5e0aa3cd8f27e96ced7240e58bb63` |
| `ons-bacia_contorno` | ONS | Dados Abertos · Contornos das Bacias Hidrográficas | 15/11/2026 | 1.622.722 | `1456e2b8c4446b9984be2fa4206588d94b8fe6e0270534f467c803f95c0198d4` |

- **Reservatórios:** 158 no mapa, 156 com volume útil. O cadastro tem 162 linhas porque traz uma por usina, e 3 reservatórios atendem mais de uma (HENRY BORDEN EXTERNA e HENRY BORDEN SUBTERRÂNEA, ITAIPU 60 HZ e ITAIPU 50 HZ, PAULO AFONSO I e PAULO AFONSO III e PAULO AFONSO II): são 158 reservatórios, um ponto cada, com as usinas juntas na ficha; nenhum ficou de fora (0 sem coordenada). Posição, rio, bacia, reservatório equivalente e volumes vêm do cadastro.
- **Bacias:** 31 contornos do shapefile do ONS (data do arquivo: 31/01/2023). **Simplificado** por Douglas-Peucker com tolerância de 0,02° (≈ 2 km): de 128.327 para 5.940 vértices. É a única geometria do Atlas que foi simplificada aqui.
- **Licença:** Creative Commons Atribuição (CC-BY), declarada no portal.
- **Arquivos publicados:** `public/alexandria/atlas/dados/agua-reservatorios.geojson` (50 KB) e `public/alexandria/atlas/dados/agua-bacias.geojson` (117 KB).

### 5. Séries — ONS · Dados Abertos

| Série | Arquivos | Acesso | Bytes | Hash |
| --- | --- | --- | ---: | --- |
| EAR Diário por Subsistema | 27 arquivos anuais (2000–2026) | 15/11/2026 | 1.757.972 | um hash por arquivo no manifesto |
| EAR Diário por Reservatório | 27 arquivos anuais (2000–2026) | 15/11/2026 | 156.480.274 | um hash por arquivo no manifesto |
| Intercâmbios entre Subsistemas | 27 arquivos anuais (2000–2026) | 15/11/2026 | 48.627.505 | um hash por arquivo no manifesto |
| Balanço de Energia nos Subsistemas | 27 arquivos anuais (2000–2026) | 15/11/2026 | 123.651.348 | um hash por arquivo no manifesto |

- **Licença:** Creative Commons Atribuição (CC-BY), declarada no portal.
- **Anos das séries:** os que o manifesto registra (o que foi baixado); `construir.mjs` para se faltar um ano no meio ou se o arquivo de um ano já fechado não chegar a 31/12.
- **Energia armazenada (capítulo "A água"):** de 2000-01 a 2026-11; o último mês (2026-11) está incompleto na fonte, que vai até 13/11/2026. O valor de cada mês é o do **último dia** (é variável de estoque), em % da energia armazenável máxima. A fonte traz série própria de 67 reservatórios: 62 estão no mapa; 5 (JORDÃO, ERNESTINA, GUARAPIRANGA, BILLINGS, LAJES) não estão no cadastro de reservatórios e por isso não têm ponto no mapa (a série fica no arquivo, sem tela que a mostre). Os demais reservatórios do mapa são a fio d'água ou não têm série na fonte. → `public/alexandria/atlas/dados/serie-ear-subsistema.json` (27 KB), `public/alexandria/atlas/dados/serie-ear-reservatorios.json` (109 KB).
- **Intercâmbio (capítulo "As trocas"):** saldo líquido mensal por elo (Norte–Nordeste, Norte–Sudeste, Nordeste–Sudeste, Sudeste–Sul), em MW médios. **A fonte tem dois formatos.** Até 2025, cada elo vem num sentido fixo, com sinal. Em 2026, cada hora vem uma vez por elo, rotulada pelo sentido em que a energia foi, sempre positiva, e há uma coluna nova de intercâmbio programado (não usada). Nos dois casos o Atlas soma com sinal no sentido de referência e divide pelas horas do mês com registro. Conferido em 10/08/2026 às 14h: Nordeste→Norte + Nordeste→Sudeste = 11.824,9 MW, igual ao intercâmbio do Nordeste no balanço da mesma hora. Par fora dos quatro elos, ou o mesmo elo duas vezes na mesma hora, faz `construir.mjs` parar. Série de 2000-01 a 2026-11; o último mês (2026-11) está incompleto na fonte, que vai até 13/11/2026 (último registro: 2026-11-13 23:00:00), e a média desse mês é das horas publicadas até então. → `public/alexandria/atlas/dados/serie-intercambio.json` (10 KB).
- **Balanço (capítulo "Um dia"):** perfil horário médio de geração por fonte e de carga em cada subsistema, nos doze últimos meses completos (2025-11 a 2026-10), decididos pelo último registro da fonte (2026-11-12 23:00:00). A fonte reúne todas as térmicas numa série só. Na média mensal, o último mês (2026-11) está incompleto na fonte, que vai até 12/11/2026. → `public/alexandria/atlas/dados/serie-perfil-horario.json` (34 KB), `public/alexandria/atlas/dados/serie-balanco-mensal.json` (36 KB).
- **Horas sem dado no balanço:** a fonte traz linhas de preenchimento (carga vazia ou zero, geração "0E-8") em 260 horas-subsistema, em 8 meses (2013-12, 2014-02, 2014-10, 2015-04, 2015-10, 2016-10, 2017-10, 2018-11): dias inteiros e as horas de virada do horário de verão. Não são horas medidas: saem da média, e o índice lista quantas por mês e subsistema.
- **As setas do capítulo "As trocas" são um esquema**, não geografia: ligam o centroide (calculado do polígono) de um subsistema ao de outro. A interface diz isso.

### 6. Gás e petróleo — ANP · GeoServer

| id | órgão | conjunto | acesso | bytes | SHA-256 do arquivo guardado no bruto |
| --- | --- | --- | --- | ---: | --- |
| `anp-wfs-capacidades` | ANP | GeoServer da ANP · WFS 2.0 · GetCapabilities (lista e título das camadas) | 15/11/2026 | 141.514 | `6951e7b27fa847f9d7529ba2050bec3748c6744c3f586826c80c9fb87561d594` |
| `anp-gasodutos-transporte` | ANP | GeoServer da ANP · camada BD_ANP:GASODUTOS_TRANSPORTE ("GASODUTOS_TRANSPORTE") | 15/11/2026 | 9.214.086 | `f10d4be6168170ba69e20603339ff8cad1733eae2555c6b52bc7fb4ea1274fa7` |
| `anp-terminais-gnl` | ANP | GeoServer da ANP · camada BD_ANP:Terminais_GNL ("Infraestrutura: Terminais de Gás Natural Liquefeito") | 15/11/2026 | 3.371 | `be4a8f570acb9e69cf4ea9a066afc8c2444c18b07ee534d191cbe55fca536f89` |
| `anp-refinarias` | ANP | GeoServer da ANP · camada BD_ANP:REFINARIAS_SIRGAS ("REFINARIAS") | 15/11/2026 | 9.174 | `1bd4c4d44c88b3a35fc77ee99e1bafc0d7a7fce023f2230d89ce4430059ed120` |
| `anp-upgn` | ANP | GeoServer da ANP · camada BD_ANP:UPGN ("Infraestrutura: Unidade de Processamento de Gás Natural") | 15/11/2026 | 10.567 | `1ff407b851786f4908f119f8557cf63bd827e32f0679428e44c6cc0875456abc` |
| `anp-terminais-liquidos` | ANP | GeoServer da ANP · camada BD_ANP:TERMINAIS_LIQ ("Infraestrutura: Terminais Combustíveis Líquidos") | 15/11/2026 | 55.978 | `b9799712cba8dc3a1f736365d8bceb1b6b5dab17e4e3a4b4a25ec44b083bdfb6` |
| `anp-campos-producao` | ANP | GeoServer da ANP · camada BD_ANP:CAMPOS_PRODUCAO_SIRGAS ("Campos_de_Produção") | 15/11/2026 | 1.120.833 | `eefd9966bb76cb168b861dd42e9f9461690c64e3f675b924a0dd579f6c8bcbaf` |
| `anp-blocos-exploratorios` | ANP | GeoServer da ANP · camada BD_ANP:BLOCOS_EXPLORATORIOS_SIRGAS ("Blocos Exploratórios") | 15/11/2026 | 742.928 | `61657bb652bb6a23156eb66cb122efc72bf04abc0c61f2a517be17d88a028f0b` |
| `anp-bacias-sedimentares` | ANP | GeoServer da ANP · camada BD_ANP:BACIAS_SEDIMENTARES_SIRGAS ("Bacias Sedimentares") | 15/11/2026 | 6.687.092 | `35867d40e58e91162f9ff0d511cb3286c238d39316c751eaea323dea8730f008` |
| `anp-presal` | ANP | GeoServer da ANP · camada BD_ANP:POLIGONO_PRESAL_PLSIRGAS ("Pré-Sal") | 15/11/2026 | 736 | `0f171824f5c0492cdab753174874b4f691088312451c81e9c48c4c8d6eb912ae` |

- **Serviço:** `https://gishub.anp.gov.br/geoserver/ows` (WFS 2.0, GeoServer). Página de dados abertos: <https://www.gov.br/anp/pt-br/centrais-de-conteudo/dados-abertos>
- **Forma do acesso:** uma requisição WFS 2.0 GetFeature (outputFormat=application/json, srsName=EPSG:4326, eixo lon,lat); o sha256 é dos bytes como vieram do servidor, que incluem um timeStamp da resposta.
- **Licença:** Licença não declarada na fonte (GetCapabilities com AccessConstraints e Fees vazios; nenhuma página de dados abertos da ANP consultada declara licença para estas camadas). Dado público da ANP, uso com atribuição à ANP. O rodapé do portal gov.br da ANP declara CC BY-ND 3.0 para "o conteúdo deste site"; isso não foi estendido aos dados do geoserviço.
- **Data do dado:** nenhuma camada traz campo de data de referência e o serviço não informa data de atualização: vale a data da consulta (15/11/2026).
- **Gasodutos de transporte:** 108 trechos de 70 dutos; 10.762 km pela extensão que a ANP declara em cada trecho e 11.224,8 km medidos no traçado da fonte. Traçado **simplificado** por Douglas-Peucker com tolerância de 0,0001° (≈ 11 m, abaixo de 1 pixel no zoom 11): de 464.124 para 31.275 vértices. Gasodutos de TRANSPORTE (a malha que liga produção, UPGN, terminais e city gates). A camada não traz gasodutos de escoamento da produção nem de distribuição. km é a extensão declarada pela ANP por trecho; kmTraco é medida no traçado da fonte (geodésica, antes da simplificação). Traçado simplificado por Douglas-Peucker. → `public/alexandria/atlas/dados/combustivel-gasodutos.geojson` (642 KB).
- **Instalações:** 17 refinarias (inclui a unidade de xisto), 7 terminais de GNL, 30 unidades de processamento de gás natural (UPGN e UPCGN), 133 terminais de combustíveis líquidos → `public/alexandria/atlas/dados/combustivel-instalacoes.geojson` (58 KB). Capacidade de refino somada: 2.426.193 bbl/d (385.737 m³/d) em 16 refinarias; sem capacidade na fonte: UNIDADE DE PRODUÇÃO DE XISTO. A fonte não publica dicionário de dados. CAPAC_BPD declara a unidade no próprio nome do campo (barris por dia). CAPAC_M3 não declara período; em todas as refinarias com os dois campos, CAPAC_BPD / CAPAC_M3 fica entre os valores de razaoBpdPorM3 (1 m³ = 6,2898 barris), ou seja, é a mesma capacidade diária em m³/d. O campo CAPACIDADE dos terminais de GNL não declara unidade, e a ANP não publica dicionário da camada. O número é publicado como está (cap), com unidade nula: a interface deve mostrá-lo com a ressalva "unidade não declarada na fonte" ou omiti-lo.
- **Campos de produção:** 427 polígonos, simplificados com tolerância de 0,001° (de 44.596 para 8.699 vértices) → `public/alexandria/atlas/dados/combustivel-campos.geojson` (338 KB).
- **Blocos exploratórios sob contrato:** 408 polígonos, tolerância de 0,002° (de 27.737 para 3.911 vértices) → `public/alexandria/atlas/dados/combustivel-blocos.geojson` (231 KB).
- **Bacias sedimentares:** 72 polígonos, tolerância de 0,01° (de 344.609 para 20.692 vértices) → `public/alexandria/atlas/dados/combustivel-bacias.geojson` (405 KB).
- **Polígono do pré-sal:** 1 polígono de 12 vértices, sem simplificação → `public/alexandria/atlas/dados/combustivel-presal.geojson` (0 KB).
- **Repetições na fonte:** gasodutos: GASALP (Gasoduto Pilar-Cabo) / Estação Pilar - PE Cabo — duas feições com o mesmo duto, trecho, origem e destino, mas extensão declarada (199.605 e 199.352 km) e traçado diferentes; a fonte não diz se são dutos paralelos ou registro repetido. As duas são publicadas e somadas.; gasodutos: Gasoduto TR-BGUA / Terminal BGB - ECOMP Campos Elíseos — duas feições com o mesmo duto, trecho, origem e destino, mas extensão declarada (14.871 e 15.356 km) e traçado diferentes; a fonte não diz se são dutos paralelos ou registro repetido. As duas são publicadas e somadas..
- **Incoerências detectadas no build:** nenhuma.
- **Fora do Brasil e da ZEE (marcado `fora: true`, não corrigido):** bacia bacia-sed-bacia-da-foz-do-amazonas-mar.
- **Datas ilegíveis na fonte (publicadas como nulas):** "21-02-202", "'''", "20-SEP-24", "11-OCT-24".
- **Ausências declaradas:**
  - Oleodutos, gasodutos de escoamento da produção e redes de distribuição de gás: o GeoServer da ANP não publica essas camadas (medido no GetCapabilities em 15/11/2026).
  - Pontos de entrega (city gates) e estações de compressão: não há camada própria; aparecem só como texto nos campos de origem e destino dos gasodutos.
  - Capacidade dos gasodutos (vazão) e pressão: a camada não traz.
  - Unidade da capacidade dos terminais de GNL: não declarada na fonte (cap publicado com unidade nula).
  - Capacidade das UPGN e dos terminais de líquidos: a camada não traz.
  - Data de referência das camadas: nenhuma traz campo de data do dado; vale a data da consulta (acesso).
  - Unidade dos campos AREA e MED_LAMINA (campos de produção) e AREA_TOTAL (blocos): não declarada na fonte.
  - Significado dos campos PAC_DIESEL, PAC_CONV, PAC_GASOLINA e PAC_HBIO das refinarias: não declarado na fonte; não publicados.
  - Produção de cada campo: está em outra base da ANP (painel de produção), não nesta camada.
  - Áreas de concessão de distribuição de energia elétrica: não são da ANP (são da ANEEL/SIGEL), e o GeoServer da ANP não tem camada desse tipo.
- **Camadas do serviço** (83, do GetCapabilities guardado): `BD_ANP:BACIAS_SEDIMENTARES_SIRGAS`, `BD_ANP:Bacias_Sedimentares2`, `Basemap:Batimetria_Sirgas2000`, `BD_ANP:BLCS_ARRM_CESSAO_ONEROSA1`, `BD_ANP:BLCS_ARRM_CESSAO_ONEROSA2`, `BD_ANP:BLCS_ARRM_OPC1`, `BD_ANP:BLCS_ARRM_OPC2`, `BD_ANP:BLCS_ARRM_OPC3`, `BD_ANP:BLCS_ARRM_OPC4`, `BD_ANP:BLCS_ARRM_OPC5`, `BD_ANP:BLCS_ARRM_OPP1`, `BD_ANP:BLCS_ARRM_OPP2`, `BD_ANP:BLCS_ARR_OPP4`, `BD_ANP:Blocos_Arrematados_Partilha_1`, `BD_ANP:Blocos_Arrematados_Partilha_2`, `BD_ANP:Blocos_Arrematados_Partilha_3`, `BD_ANP:Blocos_Arrematados_Partilha_4`, `BD_ANP:Blocos_Arrematados_Partilha_5`, `BD_ANP:Blocos_Arrematados_Partilha_6`, `BD_ANP:Blocos_Arrematados_R0`, `BD_ANP:Blocos_Arrematados_R1`, `BD_ANP:BLCS_ARRM_R10_SIRGAS`, `BD_ANP:BLCS_ARRM_R11_SIRGAS`, `BD_ANP:BLCS_ARRM_R12_SIRGAS`, `BD_ANP:BLCS_ARRM_R13_SIRGAS`, `BD_ANP:BLCS_ARRM_R14_SIRGAS`, `BD_ANP:BLCS_ARRM_R15_SIRGAS`, `BD_ANP:BLCS_ARRM_R16_SIRGAS`, `BD_ANP:BLCS_ARRM_R17_SIRGAS`, `BD_ANP:Blocos_Arrematados_R2`, `BD_ANP:Blocos_Arrematados_R3`, `BD_ANP:Blocos_Arrematados_R4`, `BD_ANP:BLCS_ARRM_R5_SIRGAS`, `BD_ANP:BLCS_ARRM_R6_SIRGAS`, `BD_ANP:BLCS_ARRM_R7_SIRGAS`, `BD_ANP:BLCS_ARRM_R9_SIRGAS`, `BD_ANP:BLOCOS_EXPLORATORIOS_SIRGAS`, `BD_ANP:BLCS_OFER_CESSAO_ONEROSA_LVECO1`, `BD_ANP:BLCS_OFER_CESSAO_ONEROSA_LVECO2`, `BD_ANP:BLCS_OFER_OPC1`, `BD_ANP:BLCS_OFER_OPC2`, `BD_ANP:BLCS_OFER_OPC3`, `BD_ANP:BLCS_OFER_OPC4`, `BD_ANP:BLCS_OFER_OPC5`, `BD_ANP:BLCS_OFER_R0`, `BD_ANP:BLCS_OFER_R1`, `BD_ANP:BLOC_OFER_R10_SIRGAS`, `BD_ANP:BLOC_OFER_R11_SIRGAS`, `BD_ANP:BLOC_OFER_R12_SIRGAS`, `BD_ANP:BLOC_OFER_R13_SIRGAS`, `BD_ANP:BLOC_OFER_R14_SIRGAS`, `BD_ANP:BLOC_OFER_R15_SIRGAS`, `BD_ANP:BLOC_OFER_R16_SIRGAS`, `BD_ANP:BLOC_OFER_R17_SIRGAS`, `BD_ANP:BLCS_OFER_R2`, `BD_ANP:BLCS_OFER_R3`, `BD_ANP:BLCS_OFER_R4`, `BD_ANP:BLCS_OFER_R5_SIRGAS`, `BD_ANP:BLCS_OFER_R6_SIRGAS`, `BD_ANP:BLOC_OFER_R7_SIRGAS`, `BD_ANP:BLOC_OFER_R9_SIRGAS`, `BD_ANP:CAMPOS_PRODUCAO_SIRGAS`, `BD_ANP:DADOS_TECNICOS_NAO_SISMICOS`, `BD_ANP:DADOS_TECNICOS_SISMICA_2D`, `BD_ANP:DADOS_TECNICOS_SISMICA_3D`, `oracleworskspace:brasil`, `BD_ANP:GASODUTOS_TRANSPORTE`, `BD_ANP:TERMINAIS_LIQ`, `BD_ANP:Terminais_GNL`, `BD_ANP:UPGN`, `Basemap:Limites_America_do_Sul_SIRGAS`, `Basemap:Limites_Estaduais`, `Basemap:Limites_Municipais`, `BD_ANP:POSTOSCOMBUSTIVEIS`, `BD_ANP:Pocos_Confidenciais`, `BD_ANP:Pocos_Publicos`, `SFI:Postos_Combustivel`, `BD_ANP:POCOS_SIRGAS`, `BD_ANP:POLIGONO_PRESAL_PLSIRGAS`, `BD_ANP:REFINARIAS_SIRGAS`, `BD_ANP:Setores_Margem_Equatorial`, `BD_ANP:Setores_Maritimos`, `BD_ANP:USINAS_DE_ETANOL`.

### 7. Áreas de atuação das distribuidoras — ANEEL · BDGD (camada ARAT)

| id | órgão | conjunto | acesso | bytes | SHA-256 do arquivo guardado no bruto |
| --- | --- | --- | --- | ---: | --- |
| `aneel-bdgd-arat` | ANEEL | BDGD — Base de Dados Geográfica da Distribuidora · camada ARAT (área de atuação), uma por distribuidora, data-base mais recente (99 em 2025-12-31, 3 em 2023-12-31) | 15/11/2026 | 54.067.219 | `80db480200f98176c40e3aef9e06366d6963268045cfa3921f61b9ee693bc5dc` |

- **Fonte:** BDGD — Base de Dados Geográfica da Distribuidora · camada ARAT (área de atuação), uma por distribuidora, data-base mais recente (99 em 2025-12-31, 3 em 2023-12-31). Hub de dados abertos da ANEEL no ArcGIS Online: <https://dadosabertos-aneel.opendata.arcgis.com/>. Endereço de cada item: `https://www.arcgis.com/sharing/rest/content/items/<item>/data` (item por distribuidora no campo 'item' de cada feição; organização ArcGIS J5unWNi0P2dwjI3y, dono aneel_aneel).
- **Forma do acesso:** um File Geodatabase zipado por distribuidora no ArcGIS Online da ANEEL, lido por requisição de faixa HTTP (GDAL /vsizip/{/vsicurl/<url>}/<titulo>.gdb), só a camada ARAT, sem baixar o .gdb.zip inteiro; extração e montagem em tools/alexandria-atlas/concessoes/ (README.md). bytes e sha256 desta entrada são do CONJUNTO das 102 ARAT usadas: bytes somados e SHA-256 da concatenação dos SHA-256 de cada ARAT (hex, sem separador), em ordem numérica do código da distribuidora; o hash e os bytes de cada uma estão em relatorio.json.
- **Licença:** Não declarada: licenseInfo e accessInformation vêm nulos no item e no Hub. Dado público da ANEEL; uso com atribuição à ANEEL. Confirmar quando dadosabertos.aneel.gov.br voltar.
- **Data-base:** a BDGD mais recente de cada distribuidora: 99 com data-base 31/12/2025 e 3 com data-base 31/12/2023 (campo `dataBase` de cada feição; as de 2023 são as únicas BDGD que a fonte tem dessas distribuidoras). Acesso em 15/11/2026.
- **O que tem:** 102 áreas de atuação, 51 de concessionárias e 51 de permissionárias, com código ANEEL, nome, tipo de outorga, número do contrato, `COD_ID` cru da ARAT, data-base e item do ArcGIS.
- **Método:** Área de atuação declarada pela própria distribuidora na BDGD (camada ARAT), não o ato de outorga. Permissionárias (cooperativas) se sobrepõem às concessionárias: é o dado, não erro; o arquivo vem da maior área para a menor, para a permissionária ser desenhada por cima. Geometria simplificada com tolerância de 0,003° (≈ 300 m), coordenadas com 4 casas. Tipo e número do contrato vêm do COD_ID da própria ARAT; a UF do COD_ID não é publicada porque contradiz o polígono em ao menos dois casos (Cernhe 6609 e Cerci 5279). Cada distribuidora vem da BDGD de data-base mais recente. Geometria Polygon/MultiPolygon em SIRGAS 2000, 64.789 vértices no arquivo. O GeoJSON é montado por `tools/alexandria-atlas/concessoes/` (Python + GDAL; ver o README de lá); `construir.mjs` só o lê, confere e registra no índice.
- **Fora do arquivo (12 códigos da BDGD):**
  - Sucedidas por fusão (BDGD antiga coberta em 85% ou mais por distribuidora de mesma outorga com BDGD mais nova): CPFL Mococa (70, 2017) → CPFL Santa Cruz (69), 95,4%; CPFL Leste Paulista (71, 2017) → CPFL Santa Cruz (69), 97,6%; CPFL Santa Cruz (BDGD antiga) (72, 2017) → CPFL Santa Cruz (69), 98,9%; CPFL Sul Paulista (73, 2017) → CPFL Santa Cruz (69), 98,8%; RGE Sul (397, 2018) → RGE (396), 98,6%; Energisa Borborema (6611, 2022) → Energisa PB (6600), 100%; Energisa Nova Friburgo (6612, 2022) → Energisa Minas Rio (6585), 87,4%; Cejama (BDGD antiga) (6896, 2017) → Cejama (5372), 100%.
  - Sem camada ARAT (BDGD de 2016, Módulo 6; nenhuma tem BDGD posterior): CFLO (84), CNEE (75), EDEVP (5217), EEB (386). A sucessão delas é presumida, sem prova geométrica; nada delas é publicado.
- **Ausências declaradas:**
  - Área de atuação de CFLO (84), CNEE (75), EDEVP (5217), EEB (386): a BDGD delas é de 2016 e não tem camada ARAT.
  - UF e sigla da distribuidora: a UF do COD_ID contradiz o polígono em ao menos dois casos, e a sigla não existe na fonte (campo DESCR vazio na maioria).
  - Área em km²: não publicada.
  - Ato de outorga (o polígono do contrato): não é este dado; a ARAT é a área declarada pela distribuidora.
- **Arquivo publicado:** `public/alexandria/atlas/dados/distribuicao-areas.geojson` (1.252 KB), SHA-256 `894915aaffe70bac10d23c5c222b0af10ec1aee04258c1f4ae3b304f0f79612d`.

### 8. Submercados — IBGE, com Roraima no Norte pelo cadastro do ONS

| id | órgão | conjunto | acesso | bytes | SHA-256 do arquivo guardado no bruto |
| --- | --- | --- | --- | ---: | --- |
| `ibge-rr-uf-2024` | IBGE | Malha Municipal Digital 2024 · limite da Unidade da Federação · Roraima (shapefile, SIRGAS 2000) | 16/11/2026 | 515.260 | `d73d9be9b8bbbd85c464f5da37a595ccf7bc632e1e4d50a3e647254badd8ffc3` |

- **Arquivo do Atlas:** `public/alexandria/atlas/dados/submercados.geojson` (60 KB), construído por `construir.mjs` (`montarSubmercados`) a partir de dois arquivos do Portal BR que **não são alterados**: `public/br/submercados.geojson` e `public/br/brasil-outline.geojson`, ambos da API de malhas do IBGE em qualidade mínima. Mesmas propriedades do arquivo do Portal (`id`, `nome`, `sigla`, `ufsIbge`); o Norte passa a listar 13, 14, 15, 16, 17, 21.
- **Por que:** Arquivo próprio do Atlas: os submercados do Portal BR com Roraima no Norte. Roraima entrou no Norte em setembro de 2025, pela linha de 500 kV Manaus – Boa Vista (entrada em operação em 16/09/2025 no cadastro do ONS; o MME dá 10/09/2025 como início da energização). As séries do ONS mostram o Norte inteiro: os números do Norte incluem Roraima desde a interligação, sem separar o estado. Área oficial de RR para a conferência: Malha Municipal Digital 2024 · limite da Unidade da Federação · Roraima (shapefile, SIRGAS 2000).
- **Operação:** no anel principal do Norte, o trecho entre os tríplices -58.8955,1.2277 (Pará, Roraima e Guiana) e -63.3721,2.2119 (Amazonas, Roraima e Venezuela) — a divisa de Roraima com o Pará e o Amazonas, 57 vértices — foi trocado pelo trecho do contorno do país entre os mesmos dois pontos (a fronteira internacional de Roraima, 34 vértices). Os dois tríplices existem, idênticos, nos dois arquivos. Nenhum vértice novo; o anel passa de 697 para 674 vértices.
- **Conferências que `construir.mjs` exige (senão para):** os dois tríplices presentes uma vez em cada anel; 0 autointerseções no anel novo; o ganho de área (224.392 km², esfera de raio 6.371,0088 km, soma trapezoidal sobre o anel (o mesmo método nas duas medidas)) a menos de 1% da área oficial de Roraima no IBGE (223.505,385 km², campo AREA_KM2 da malha 2024; desvio de 0,4%); as subestações de Roraima do cadastro do ONS (BOA VISTA, EQUADOR, JAGUATIRICA II) dentro do anel novo (e fora do antigo), todas no subsistema N; as 33 unidades geradoras de Roraima no cadastro de capacidade, no subsistema N; uma só data de entrada em operação para as linhas de 500 kV de Roraima (LT 500 kV BOA VISTA / EQUADOR C 1 RR; LT 500 kV BOA VISTA / EQUADOR C 2 RR; LT 500 kV EQUADOR / LECHUGA C 1 RR/AM; LT 500 kV EQUADOR / LECHUGA C 2 RR/AM): 16/09/2025.
- **Declarações oficiais consultadas:** ONS, <https://www.ons.org.br/Paginas/energia-no-futuro/suprimento-eletrico/parpel2025/sumario-executivo/index.aspx> (acesso em 16/11/2026): interligação de Roraima ao SIN em setembro de 2025, pela LT 500 kV Lechuga – Equador – Boa Vista C1 e C2; MME, <https://www.gov.br/mme/pt-br/com-investimento-de-r-3-3-bilhoes-lula-e-silveira-dao-inicio-a-energizacao-do-linhao-manaus2013boa-vista> (acesso em 16/11/2026): início da energização em 10/09/2025. As datas não coincidem: o MME dá o início da energização e o cadastro do ONS, a entrada em operação; o Atlas usa a do cadastro.
- **O que muda nos números:** nada nas séries (as do ONS já contam Roraima no Norte desde a interligação e não separam o estado). Na conferência de posição contra o estado declarado, as usinas e subestações de Roraima passam a cair no Norte (antes não caíam em submercado nenhum), menos algumas pequenas na faixa da fronteira com a Guiana, que o contorno de qualidade mínima deixa do lado de fora (sem acusação: só conta o ponto que cai DENTRO de outro submercado), e uma subestação declarada em outro estado mas posicionada em Roraima passou a ser acusada (seção 3).
- **Antes da interligação:** o arquivo traz, fora de `features`, o membro `roraimaAParte` (o anel de Roraima e a geometria do Norte sem Roraima, a do Portal BR, sem vértice novo), para o mapa desenhar Roraima fora do Norte nos meses anteriores a 09/2025 e nos anos anteriores a 2025. Antes de 09/2025 Roraima não estava ligada ao Sistema Interligado Nacional (o MME diz que a energização do Linhão Manaus–Boa Vista "marca a conexão de Roraima ao SIN"). A geometria do Norte sem Roraima é a do Portal BR, sem alteração; o anel de Roraima é a fronteira internacional do contorno do país mais a divisa com o Pará e o Amazonas, só vértices dos dois arquivos do IBGE. Data: entrada em operação das LT 500 kV de RR no cadastro do ONS.
- **Licença da área oficial:** Não lida nesta sessão no próprio arquivo (o zip não traz texto de licença). Segundo o levantamento de 16/11/2026, as notas metodológicas da Malha Municipal Digital 2023/2024 declaram compatibilidade com CC BY 4.0; a confirmar. Uso com atribuição ao IBGE.

### 9. Comércio exterior de energia (2025) — Comex Stat, ONS, ANP; rotas esquemáticas

- **Arquivos publicados:** `public/alexandria/atlas/dados/comercio-2025.json` (179 KB, SHA-256 `bd3c08a3952552ee`). Montados por `tools/alexandria-atlas/comercio/` (não por `construir.mjs`); esta seção lê os blocos `fontes`, `leia` e `conferencia` do próprio arquivo.

| órgão | conjunto | endereço | acesso | licença |
| --- | --- | --- | --- | --- |
| MDIC/SECEX | Comex Stat, API (exportação e importação por NCM × país × URF × via) | `https://api-comexstat.mdic.gov.br/general` | 16/11/2026 | A API não declara licença; o rodapé do sítio diz CC BY-ND 3.0 para o conteúdo do sítio. |
| NIVAR | Arcos de círculo máximo do aeroporto (ponto da ANAC, lista de aeródromos públicos) ao centro do país (Natural Earth 110m), para o querosene de aviação com via aérea | `tools/alexandria-atlas/comercio/construir.mjs` | 16/11/2026 | Calculados pela NIVAR; não são rota de voo |
| ONS | Intercâmbio do SIN com outros países | `https://ons-aws-prod-opendata.s3.amazonaws.com/dataset/intercambio_internacional_ho/INTERCAMBIO_INTERNACIONAL_2025.csv` | 16/11/2026 | CC-BY (declarada no portal de dados abertos do ONS) |
| ANP | Importações e exportações de petróleo (conferência) | `https://www.gov.br/anp/pt-br/centrais-de-conteudo/dados-abertos/arquivos/ie/petroleo/importacoes-exportacoes-petroleo-2000-2025.csv` | 16/11/2026 | não declarada no arquivo |
| NIVAR (roteador próprio) sobre o Natural Earth | Rotas marítimas esquemáticas: caminho mínimo numa grade de mar de 0,1° tirada dos países e das ilhas pequenas do Natural Earth 10m, com folga da costa | `tools/alexandria-atlas/comercio/roteador.mjs (terra: https://unpkg.com/world-atlas@2.0.2/countries-10m.json)` | 16/11/2026 | Natural Earth: domínio público. Rotas calculadas pela NIVAR, sem dever de licença. |

- **NIVAR (roteador próprio) sobre o Natural Earth, Rotas marítimas esquemáticas: caminho mínimo numa grade de mar de 0,1° tirada dos países e das ilhas pequenas do Natural Earth 10m, com folga da costa:** SHA-256 do arquivo usado `3bc6f1d367a9bcec479841bae0e76092f512838411d0cef124e92eec4db45f79`. Grade: busca em 0.1° (3600 × 1800); terra testada em 0.0333°; fechado ao sul de 50° S e ao norte de 71.5° N. Ilhas: Natural Earth 10m, ilhas pequenas (ne_10m_minor_islands, versão 5.1.2; manifesto: comercio-natural-earth-ilhas-10m): terra extra, sem fechar estreito. Escolhas de modelo: folga da costa: custo × até 3.5 rente à terra, caindo em curva quadrática até 1 a 45 km dela (em mar aberto a rota corre a dezenas de km da costa; num estreito, pelo meio do canal); o alisamento exige em cada ponto da reta a folga de min(30 km, a folga que o caminho da grade tinha ali) × 0,85; custo × até 1.5 entre 38° S e 48° S; segmentos retos em Mercator de até 1000 km. Destino: A rota termina na célula de mar, vizinha do maior polígono do país, mais próxima da origem pelo mar em km (busca só de distância, com o portão do Panamá). O custo da folga e do mar do Sul decide o caminho até ela, não o destino.. Contorno: Teste do Suez, nunca desenhado: Port Said (camada de portos do Natural Earth) ligado à célula de mar mais ao norte do golfo de Suez na grade (32.55° E, 29.85° N), 168 km em reta. Rota que passa ao sul da África e cuja costa de destino ficaria 3% ou mais perto com essa ligação ganha o campo "contorno".. Portão Canal do Panamá: Natural Earth 10m, camada de portos (ne_10m_ports): "Cristobal" (ne_id 1730087647) no Caribe e "Balboa" (ne_id 1730087645) no Pacífico. Suez: a camada de portos do Natural Earth 10m traz Port Said, mas não a ponta sul do canal; sem as duas pontas com fonte não há portão, e rota que usaria Suez contorna a África (é o caso da rota para a Arábia Saudita, que entra no Mar Vermelho pelo sul). Bósforo e Kiel: sem portão (nenhuma rota precisa do Mar Negro; o Báltico se alcança pelos estreitos dinamarqueses).
- **Como ler:**
  - Fluxo = produto × sentido × país × via, com 1% ou mais do produto no sentido (peso líquido; urânio e eletricidade por valor FOB).
  - A URF é a unidade da Receita Federal onde a mercadoria foi despachada, não o cais nem o terminal de onde o navio saiu.
  - O país é o país declarado de destino ou de origem. Entreposto e bandeira de conveniência (Singapura, Panamá, Libéria, Países Baixos) podem aparecer como destino.
  - Toda rota é esquemática: traçado ilustrativo, não o caminho dos navios. Começa no mar mais perto da unidade de despacho (a grade não sobe o Amazonas nem entra na Lagoa dos Patos) e termina no trecho de costa do país mais próximo pelo mar, contado em quilômetros, porque o dado não diz o porto. Entre as duas pontas, é o caminho mais curto por mar numa grade de 0,1° tirada do Natural Earth 10m (países e ilhas pequenas), evitando passar a menos de 45 km da terra (em mar aberto a rota corre ao largo; num estreito, pelo meio do canal) e o mar do Sul (abaixo de 38° S); fechada ao sul de 50° S e no Ártico.
  - Canais: Canal do Panamá, desenhado como reta entre os dois portos dos extremos (camada de portos do Natural Earth). Suez não tem portão, porque a camada não traz a ponta sul do canal: a rota que o usaria dá a volta pela África, e a ficha dela diz isso. O comprimento das rotas sai arredondado a centenas de km, e a distância à terra é medida contra o Natural Earth (a base do mapa tem costa mais fina).
  - Uma rota é desenhada por par URF–país marítimo com 5% ou mais do produto no sentido, ou entre os 3 maiores pares do produto, quando o produto soma 10 kt ou mais no sentido (urânio, medido em valor, entra); o mesmo traçado serve a todos os produtos daquele par.
  - Gás natural da Bolívia chega por duto (Corumbá): não tem navio nem rota marítima.
  - Eletricidade: os fluxos do Comex trazem o valor e a via declarada no despacho (inclusive "rodoviária"), que não descreve a linha de transmissão. A quantidade física por mês é a do ONS, no bloco eletricidade.
  - Via aérea: o Comex registra querosene de aviação exportado com via "aérea", despachado em aeroportos, por país de destino. O dado não diz se é carga levada por avião ou combustível posto no tanque de aeronave que parte para aquele país. O arco vai do aeroporto (ponto da ANAC) ao centro do país; não é rota de voo. Destino "Brasil" não tem arco.
  - Remessa: cada item da lista do mapa é um produto, de uma URF de despacho para um país (ou de um país para uma URF), somado no ano; há uma por produto × sentido × URF × país com rota desenhada, e várias remessas dividem o mesmo traçado. A classe do veículo segue o produto (petroleiro para líquidos, graneleiro para carvão e coques, gaseiro para GNL e GLP, carga para o urânio, avião para a via aérea); o dado não diz o navio nem quantas viagens houve.
- **Rotas que dão a volta por falta de portão:** `0717800-SAU`.
- **Horas do ONS na eletricidade:** ARGENTINA 8.424 de 8.760 horas; URUGUAI 8.448 de 8.760 horas. A soma do ano é a das horas que o ONS publicou: os meses com horas faltando (horasPorMes menor que horasDosMeses) estão incompletos na série.
- **Conferência contra fonte independente** (Cada linha compara o total do Comex Stat com uma fonte independente do mesmo fato, em 2025. A diferença é (Comex − referência) / referência.):
  - Petróleo bruto exportado: Comex 112.278.747, referência 111.583.684 m³ (Comex: quantidade estatística em "METRO CUBICO") (ANP, importações e exportações de petróleo, 2025 (12 meses)); diferença 0,6%.
  - Petróleo bruto importado: Comex 15.112.833, referência 14.290.330 m³ (Comex: quantidade estatística em "METRO CUBICO") (ANP, importações e exportações de petróleo, 2025 (12 meses)); diferença 5,8%.
  - Eletricidade exportada (Argentina e Uruguai): Comex 3.281.324, referência 3.150.757 MWh (Comex: quantidade estatística em "MIL QUILOWATT HORA") (ONS, intercâmbio internacional, soma das horas com valor positivo); diferença 4,1%.
  - Eletricidade exportada para a Argentina: Comex 3.072.151, referência 2.931.200 MWh (ONS (horas positivas, Argentina)); diferença 4,8%.
  - Eletricidade exportada para o Uruguai: Comex 209.173, referência 219.557 MWh (ONS (horas positivas, Uruguai)); diferença -4,7%.
- **Hash do bruto:** os 14 arquivos baixados para o comércio estão no `manifesto-fontes.json` sob o prefixo `comercio-` (o prefixo evita que entrem nas séries anuais do ONS e nas camadas da ANP, que são lidas por prefixo). O corpo de cada consulta ao Comex Stat está no campo `forma` da entrada.

| id | órgão | conjunto | acesso | bytes | SHA-256 do arquivo guardado no bruto |
| --- | --- | --- | --- | ---: | --- |
| `comercio-comex-2025-exportacao` | MDIC/SECEX | Comex Stat · exportação 2025 por NCM × país × URF × via | 16/11/2026 | 631.639 | `96060d77b4f32c54fe480869d42d42284f473739372556e200f7f63a6d7d81cf` |
| `comercio-comex-2025-importacao` | MDIC/SECEX | Comex Stat · importação 2025 por NCM × país × URF × via | 16/11/2026 | 394.885 | `6c3f46e4dc1fed504c42b513de3dd159a562dac7a149dc1e1b34f5c0a0126311` |
| `comercio-comex-2025-eletricidade-exportacao-mensal` | MDIC/SECEX | Comex Stat · NCM 27160000 por país e mês, exportação 2025 | 16/11/2026 | 3.143 | `e3b00ea7ab6197694a1094a46e8de8d713a808c34a775cd35ebeaf7889dc42c9` |
| `comercio-comex-2025-eletricidade-importacao-mensal` | MDIC/SECEX | Comex Stat · NCM 27160000 por país e mês, importação 2025 | 16/11/2026 | 3.067 | `b1da8f16077d6e69a84b8e1b5377d0139431edb8a92832f8fbf5d50b6bb23e85` |
| `comercio-comex-paises-iso` | MDIC/SECEX | Comex Stat · tabela de países com código ISO (uma consulta por país) | 16/11/2026 | 20.363 | `6692143761b21c7782a7b8e75214e701644fe6bb9136e147216cc946047837c5` |
| `comercio-ons-intercambio-internacional-2025` | ONS | Intercâmbio do SIN com outros países, 2025 (horário, MWmed) | 16/11/2026 | 569.946 | `5643e62293db1794f41f654b68d961838fc0f6a4f0545c9dbcd33533ec9e59bf` |
| `comercio-anp-ie-petroleo` | ANP | Importações e exportações de petróleo, 2000–2025 (conferência) | 16/11/2026 | 35.362 | `9d9de69c7df57ca1eb8307ddffcecf09c7b139f4d0506feeadb7435c369b5fe4` |
| `comercio-anac-aerodromos-publicos` | ANAC | Lista de aeródromos públicos | 16/11/2026 | 102.277 | `9c46fc3b7d347d680dd9a88a0d48fbd6ba33525cf3d8bd3afd967f85aa48d355` |
| `comercio-ibge-localidades-2022` | IBGE | Localidades do Brasil 2022 (GeoPackage) | 16/11/2026 | 6.477.540 | `1d96d5f0b379972a506d4b18c3696af974fbe59f8f6680557cb3a6dd38a0eb57` |
| `comercio-natural-earth-50m` | Natural Earth | Países 1:50m, distribuição world-atlas 2.0.2 | 16/11/2026 | 756.420 | `04342cdc1e3016bcd7db1630de95684d67b79fe3c8c460321e87aef469502394` |
| `comercio-natural-earth-10m` | Natural Earth | Países 1:10m, distribuição world-atlas 2.0.2 (terra do roteador marítimo das rotas do comércio) | 16/11/2026 | 3.661.071 | `3bc6f1d367a9bcec479841bae0e76092f512838411d0cef124e92eec4db45f79` |
| `comercio-natural-earth-portos-10m` | Natural Earth | Portos 1:10m (ne_10m_ports, versão 5.1.2): extremos do portão do Canal do Panamá (Cristobal e Balboa) | 16/11/2026 | 279.075 | `c5a5028f5187a5e1b9fe7f0fab99804a8be7482099a2365d404fb7e9dd6b5457` |
| `comercio-natural-earth-ilhas-10m` | Natural Earth | Ilhas pequenas 1:10m (ne_10m_minor_islands, versão 5.1.2): terra extra do roteador marítimo (ilhas que os países do 10m não trazem) | 16/11/2026 | 1.320.514 | `8c933ca7a4760256bdc46408355706e39764b0fa01c160c28888b90b4faec29f` |
| `comercio-eurostat-marnet-20km` | Eurostat | SeaRoute · rede marítima MARNET 20 km (só a variante --marnet; a rota publicada não usa a rede desde a leva 2) | 16/11/2026 | 2.891.776 | `8d909ba49d5062e1bdd7b305ee768e3366f1eab2d04b4ac448dfbdf9bf71a915` |

### 9b. Um dia real: geração por usina hora a hora e corte eólico e solar — ONS

- **Arquivo publicado:** `public/alexandria/atlas/dados/operacao-dias.json` (451 KB, SHA-256 `6a1e30b1ebed06ab`), montado por `tools/alexandria-atlas/operacao/` (não por `construir.mjs`); esta seção lê os blocos `regraDosDias`, `fontes`, `leia` e `conferencia` do próprio arquivo. 644 entidades (usina com CEG casado pelo núcleo com o cadastro da ANEEL, ou conjunto do ONS no centro dos membros que o Atlas posiciona), 5 dias.
- **Regra dos dias:** Para cada um dos quatro últimos trimestres fechados antes do acesso, o dia de maior carga do SIN: a maior soma das 24 horas de val_carga da linha SIN no balanço de energia por subsistema do ONS, contando só dia com as 24 horas de carga maior que zero. Mais o último dia completo publicado: o mais recente que está inteiro nas quatro bases (geração por usina, 24 horas; corte eólico e corte fotovoltaico, 48 meias-horas; balanço, 24 horas).
- **Unidade e hora:** MW médios na hora, inteiros (o mesmo número é a energia da hora em MWh). hora 0 é a linha 00:00 do ONS (din_instante); o dicionário do ONS não declara o fuso. O corte vem em meias-horas: a hora publicada é a média das duas.

| órgão | conjunto | endereço | acesso | licença |
| --- | --- | --- | --- | --- |
| ONS | Geração por usina em base horária (geracao-usina-2) | `https://ons-aws-prod-opendata.s3.amazonaws.com/dataset/geracao_usina_2_ho/GERACAO_USINA-2_AAAA_MM.csv` | 16/11/2026 | Creative Commons Atribuição (CC-BY), declarada no portal (sem número de versão) |
| ONS | Restrição de operação por constrained-off de usinas eólicas (restricao_coff_eolica_usi) | `https://ons-aws-prod-opendata.s3.amazonaws.com/dataset/restricao_coff_eolica_tm/RESTRICAO_COFF_EOLICA_AAAA_MM.csv` | 16/11/2026 | Creative Commons Atribuição (CC-BY), declarada no portal (sem número de versão) |
| ONS | Restrição de operação por constrained-off de usinas fotovoltaicas (restricao_coff_fotovoltaica) | `https://ons-aws-prod-opendata.s3.amazonaws.com/dataset/restricao_coff_fotovoltaica_tm/RESTRICAO_COFF_FOTOVOLTAICA_AAAA_MM.csv` | 16/11/2026 | Creative Commons Atribuição (CC-BY), declarada no portal (sem número de versão) |
| ONS | Balanço de energia nos subsistemas (carga e conferência) | `https://ons-aws-prod-opendata.s3.amazonaws.com/dataset/balanco_energia_subsistema_ho/BALANCO_ENERGIA_SUBSISTEMA_AAAA.csv` | 16/11/2026 | Creative Commons Atribuição (CC-BY), declarada no portal (sem número de versão) |
| ONS | Relacionamento entre conjuntos e usinas (membros de cada conjunto) | `https://ons-aws-prod-opendata.s3.amazonaws.com/dataset/usina_conjunto/RELACIONAMENTO_USINA_CONJUNTO.csv` | 16/11/2026 | Creative Commons Atribuição (CC-BY), declarada no portal (sem número de versão) |
| ANEEL | SIGA, pelo ponto já publicado no Atlas (usinas-principais.json e usinas-menores.json, data-base 2026-10-19) | `public/alexandria/atlas/dados/usinas-*.json` | 19/10/2026 | ver a seção das usinas na procedência |

- **Como ler:**
  - Geração verificada por usina, hora a hora, do ONS. A usina que o ONS despacha em conjunto aparece como o conjunto, no centro das usinas dele; a geração não é repartida entre elas.
  - Itaipu aparece duas vezes: o setor brasileiro (60 Hz) e o paraguaio (50 Hz). A de 50 Hz não entra na geração do Brasil.
  - Pequenas usinas e geração distribuída entram somadas por estado, sem ponto no mapa, e são previsão do ONS, não medição.
  - O corte (constrained-off) só existe para eólicas e solares Tipo I, II-B e II-C. A geração não realizada é estimativa do ONS.
  - O ONS revisa os dados depois de publicados; vale o arquivo da data do acesso.
  - O último dia é 2026-11-14: o mais recente inteiro nas quatro bases no dia do acesso.
- **Definições:** `naoRealizadaEstimada`: Geração não realizada apurada (GNRa), em MW médios na hora. Texto do ONS: "Geração Não Realizada Apurada (GNRa).Representa a estimativa de geração frustrada da usina ou conjunto de usina, obtida pela diferença entre a geração de referência e a geração verificada (Se menor que zero, GNRa = 0), nos períodos em que houve limitação de geração." É estimativa do ONS, não medição. `motivo`: Uma letra por hora (R, C, E, P; "-" sem restrição): o motivo da meia-hora de maior GNRa naquela hora. Texto do ONS: "Código da Razão da Restrição, podendo ser: REL – Razão de indisponibilidade externa (elétrica). CNF – Razão de atendimento a requisitos de confiabilidade. ENE – Razão energética PAR - Restrição indicada no parecer de acesso" `texto`: O detalhamento mais frequente entre as meias-horas com restrição (dsc_restricao). Texto do ONS: "Detalhamento do motivo da restrição de geração" `conjunto`: Conjunto de usinas do ONS: a geração vem somada, sem CEG. O ponto é a média das posições dos membros que o Atlas desenha; a geração NÃO é repartida entre os membros. `semPonto`: mmgd: "Pequenas Usinas (MMGD)" por estado; tipo3: "Pequenas Usinas (Tipo III)" por estado; os dois são PREVISÃO do ONS, não geração verificada. Texto do portal: "Os grupos de pequenas usinas são formados por usinas Tipo III, que não possuem relacionamento com o ONS, e os dados são referentes a previsões de geração." A usina ou o conjunto do ONS sem usina correspondente no Atlas (geração verificada, sem ponto) fica em `mw` como as demais entidades, com lon/lat nulos, e só é listado em conferencia.semPonto.semPar (não entra nos grupos, para não somar duas vezes).
- **Conferência por dia** (gravada no arquivo; publicado = soma das entidades (sem Itaipu 50 Hz) mais o bloco semPonto, em MWh do dia, contra a soma hidráulica + térmica + eólica + solar do balanço de energia por subsistema do ONS no mesmo dia; maxDifHoraPct é a maior diferença de uma hora, em % do balanço daquela hora):

| dia | por quê | publicado × balanço do ONS | com ponto no mapa | sem ponto | entidades com corte |
| --- | --- | --- | --- | --- | ---: |
| 02/12/2025 | maior carga do SIN no 4º trimestre de 2025 | N 0,06%, NE 0,02%, S 0,01%, SE -5,07%; Sudeste somando a Itaipu 50 Hz 0% | 529 entidades, 85,8% | 14,2% (previsão 294.475 MWh) | 182 |
| 19/02/2026 | maior carga do SIN no 1º trimestre de 2026 | N 0,06%, NE 0,17%, S 0,02%, SE -1,42%; Sudeste somando a Itaipu 50 Hz 0,1% | 547 entidades, 87,2% | 12,8% (previsão 279.892 MWh) | 10 |
| 07/04/2026 | maior carga do SIN no 2º trimestre de 2026 | N -0,09%, NE 1,09%, S 0,06%, SE -1,5%; Sudeste somando a Itaipu 50 Hz 0,04% | 537 entidades, 88,1% | 11,9% (previsão 248.164 MWh) | 214 |
| 30/09/2026 | maior carga do SIN no 3º trimestre de 2026 | N 0,27%, NE 0,82%, S 0%, SE -6,25%; Sudeste somando a Itaipu 50 Hz 0,02% | 518 entidades, 82% | 18% (previsão 384.472 MWh) | 228 |
| 14/11/2026 | último dia completo publicado nas quatro bases | N 0,17%, NE 0,05%, S 0,01%, SE -3,48%; Sudeste somando a Itaipu 50 Hz 0,02% | 532 entidades, 78,7% | 21,3% (previsão 421.145 MWh) | 210 |

- **Itaipu:** as linhas PRIT60 (60 Hz, setor brasileiro) e PYIT50 (50 Hz, setor paraguaio) são duas entidades; a de 50 Hz não entra na soma do Brasil. O balanço do ONS do Sudeste só fecha com a Itaipu 50 Hz somada: a geração do subsistema no balanço inclui as duas linhas de Itaipu. O Atlas mostra a 50 Hz como entidade própria e não a soma à geração do Brasil.
- **Subsistema:** Em `entidades`, sub é o subsistema que o ONS dá no dia mais novo em que a entidade aparece; é também o da relação usina–conjunto e o que o balanço por subsistema do ONS usa em todos os dias publicados. Num dia em que o arquivo de geração do mês dá outro, `dias[].subNoDia` traz o do arquivo do mês (índice da entidade → índice em `subsistemas`), só para dizer; a conferência usa `entidades.sub` e grava em conferencia.subsistemaDoArquivoDoMes como ficaria com o outro. Em 02/12/2025: CJU_BASDA1 (arquivo do mês NE, usado SE); com o do arquivo do mês, N 0,06%, NE 0,38%, S 0,01%, SE -5,24%. Em 19/02/2026: CJU_BASDA1 (arquivo do mês NE, usado SE), CJU_MTCFAZ (arquivo do mês N, usado SE); com o do arquivo do mês, N 0,37%, NE 0,69%, S 0,02%, SE -1,67%. Em 07/04/2026: CJU_BASDA1 (arquivo do mês NE, usado SE); com o do arquivo do mês, N -0,09%, NE 1,83%, S 0,06%, SE -1,83%.
- **Membros dos conjuntos:** Em `entidades`, os membros de um conjunto (e a potência somada deles, kw) são os da relação do ONS vigentes no dia mais novo publicado em que o conjunto aparece. Num dia em que a composição era outra, `dias[].membrosNoDia` traz os membros, os sem ponto e o kw daquele dia (pela data de início e de fim da relação). O ponto do conjunto é sempre a média dos membros do dia mais novo. Conjuntos com composição própria em algum dia: CJU_RN5ETGS, CJU_RNCAJ1.
- **Uma usina, várias linhas:** Usina da ANEEL que o ONS publica em mais de uma linha (Belo Monte e Pimental, Itaipu 60 e 50 Hz…): cegEmLinhas lista as outras linhas, e kw é a potência do CEG inteiro, não a da linha. Linhas assim: PABM, PAPI, MTUIQ1, MTUIQ2, PRIT60, PYIT50, RJUHAT, RJUHSI, SPHBE, SPHBS.
- **Hash do bruto:** os 26 arquivos baixados estão no `manifesto-fontes.json` sob o prefixo `operacao-` (o prefixo evita que entrem nas séries anuais do ONS, lidas por prefixo).

| id | órgão | conjunto | acesso | bytes | SHA-256 do arquivo guardado no bruto |
| --- | --- | --- | --- | ---: | --- |
| `operacao-ons-balanco-2025` | ONS | Balanço de energia nos subsistemas, horário, ano 2025 | 16/11/2026 | 4.077.517 | `69c163bca9c02c3ad256dca4ca390fc17922040ce7bb1341f85f0d0e770d2eac` |
| `operacao-ons-balanco-2026` | ONS | Balanço de energia nos subsistemas, horário, ano 2026 | 16/11/2026 | 4.009.944 | `c6512d2f0d83d2293752e322f20a7fcc53a6d06f8b044289e0f5ea648b1d1b9a` |
| `operacao-ons-relacionamento-usina-conjunto` | ONS | Relacionamento entre conjuntos e usinas | 16/11/2026 | 330.601 | `d57aa74d448137ca308ccda36fd67b92160bb67024fdb366ad4942e550b74bef` |
| `operacao-ons-dicionario-geracao-usina` | ONS | Dicionário de dados (geracao-usina) | 16/11/2026 | 1.508 | `5bc25c0f2d81371548fe9b23fb5b4ba61922755732291eca561ade07020640a3` |
| `operacao-ons-dicionario-corte-eolica` | ONS | Dicionário de dados (corte-eolica) | 16/11/2026 | 4.715 | `136d14be22a722e68e51b36c92800cc22eb5c7f2599cdfbceb70eaec7be74028` |
| `operacao-ons-dicionario-corte-fotovoltaica` | ONS | Dicionário de dados (corte-fotovoltaica) | 16/11/2026 | 4.667 | `d3f324977219d3b7ba98d131228dc7f8ea30984672b68f2e836db44b680c5d1e` |
| `operacao-ons-pacote-geracao-usina-2` | ONS | Metadados CKAN (package_show) de geracao-usina-2 | 16/11/2026 | 169.351 | `80b7a8d29ce790b44ecd4b4dfd2fbb766083bbeed6213fa8888a253e533ca45d` |
| `operacao-ons-pacote-restricao-coff-eolica-usi` | ONS | Metadados CKAN (package_show) de restricao-coff-eolica-usi | 16/11/2026 | 132.925 | `02b803c470310a655e37b55ec8c06d1f29aa72bad1e394d9ec23a4f78cc94700` |
| `operacao-ons-pacote-restricao-coff-fotovoltaica` | ONS | Metadados CKAN (package_show) de restricao-coff-fotovoltaica | 16/11/2026 | 74.803 | `01b1b813c7b4ca17250a99dad102c2235483b6591b071ec3ab90e14c6c0c01e7` |
| `operacao-ons-pacote-balanco-energia-subsistema` | ONS | Metadados CKAN (package_show) de balanco-energia-subsistema | 16/11/2026 | 62.734 | `1a1bdec285bd39eb448ce6c7d664f92b0b5d22050127db4b06d731cf68fffd21` |
| `operacao-ons-pacote-usina-conjunto` | ONS | Metadados CKAN (package_show) de usina-conjunto | 16/11/2026 | 8.617 | `cbea2fb934bb05935320793670abaf2f567c2557cd3f0f660679020240b16d7d` |
| `operacao-ons-geracao-usina-2026-11` | ONS | Geração por usina em base horária, mês 2026-11 | 16/11/2026 | 32.501.668 | `1f54cc37bcdd70aed65bf46d50ab36e08b52c5c51b80cf0ecf652bbf17a25886` |
| `operacao-ons-corte-eolica-2026-11` | ONS | Constrained-off de usinas eólicas, semi-horário, mês 2026-11 | 16/11/2026 | 21.079.858 | `113aaebcc929345df56d30882d7c319eb942c5ac95e26022313c770192736040` |
| `operacao-ons-corte-fotovoltaica-2026-11` | ONS | Constrained-off de usinas fotovoltaicas, semi-horário, mês 2026-11 | 16/11/2026 | 10.613.567 | `485e62b31d347b08161072c567790f2da64dbe60ec8e0eb0ed1322b811e0b86a` |
| `operacao-ons-geracao-usina-2025-12` | ONS | Geração por usina em base horária, mês 2025-12 | 16/11/2026 | 63.754.889 | `ac1f748ef6d0482fe3d4cd5ab858cecbf82d984b6d396713d727b2fbe35449ec` |
| `operacao-ons-corte-eolica-2025-12` | ONS | Constrained-off de usinas eólicas, semi-horário, mês 2025-12 | 16/11/2026 | 46.262.756 | `0c09f4de689b89747be3e93868a9561c054b7427d385faabccfde394b9382021` |
| `operacao-ons-corte-fotovoltaica-2025-12` | ONS | Constrained-off de usinas fotovoltaicas, semi-horário, mês 2025-12 | 16/11/2026 | 18.481.469 | `1fb74f48c6fa079ca76dbb18522b12d92ad8fe77d04dfc8ccf26983303a25fff` |
| `operacao-ons-geracao-usina-2026-02` | ONS | Geração por usina em base horária, mês 2026-02 | 16/11/2026 | 58.977.998 | `144b5681b867044c2db80e3aa190c6c26a22d66a35bc49b352501e81f6021236` |
| `operacao-ons-corte-eolica-2026-02` | ONS | Constrained-off de usinas eólicas, semi-horário, mês 2026-02 | 16/11/2026 | 34.430.370 | `33f7ea541d991a7c57e64e6bd3db0528a4f068e233ddcf846aed140bb554c296` |
| `operacao-ons-corte-fotovoltaica-2026-02` | ONS | Constrained-off de usinas fotovoltaicas, semi-horário, mês 2026-02 | 16/11/2026 | 16.212.939 | `fafd04ccf7c043e7522f97cf20bf0c3ecc0d62abd5b0de8eb888de9302123618` |
| `operacao-ons-geracao-usina-2026-04` | ONS | Geração por usina em base horária, mês 2026-04 | 16/11/2026 | 62.102.671 | `6624d441826d82547dba7da9ed7b49f2d75bc73d18dc81a8d9be89328f4f4dcf` |
| `operacao-ons-corte-eolica-2026-04` | ONS | Constrained-off de usinas eólicas, semi-horário, mês 2026-04 | 16/11/2026 | 39.428.467 | `9ff1ab834bf2e0ba7ba617ba497560196600a3ee37bcb72ec74936475ae60a1b` |
| `operacao-ons-corte-fotovoltaica-2026-04` | ONS | Constrained-off de usinas fotovoltaicas, semi-horário, mês 2026-04 | 16/11/2026 | 19.146.719 | `daa1a5529494a913a92a7b35c551a0ab4bf103e77a7fbdcf2a321668a31689de` |
| `operacao-ons-geracao-usina-2026-09` | ONS | Geração por usina em base horária, mês 2026-09 | 16/11/2026 | 67.400.547 | `236daab58502f3f28062697b0a1ea647a2ed7047422604eb01336e180c41b961` |
| `operacao-ons-corte-eolica-2026-09` | ONS | Constrained-off de usinas eólicas, semi-horário, mês 2026-09 | 16/11/2026 | 44.609.585 | `5c8bea342bef6b01fdffb46e8f8652be26f595a58e8f3d7861cc367c79be5ffe` |
| `operacao-ons-corte-fotovoltaica-2026-09` | ONS | Constrained-off de usinas fotovoltaicas, semi-horário, mês 2026-09 | 16/11/2026 | 20.891.996 | `8b7e7ef100754050da3a9843a1824164c290cbd0d592a619e394ff9dba7a0971` |

### 10. O que já existia e o Atlas só lê

| Camada | Arquivo | Fonte |
| --- | --- | --- |
| Submercados e contorno do país (Portal BR) | `public/br/submercados.geojson`, `public/br/brasil-outline.geojson` | IBGE, API de malhas territoriais v3, qualidade mínima (arquivos do Portal Brasil da NIVAR, Wave 2; no do Portal, Roraima não está em submercado nenhum). O Atlas não os altera: lê os dois para montar o próprio `submercados.geojson`, com Roraima no Norte (seção 8). |
| Fronteiras dos países | `public/alexandria/geo/world-110m.json` | Natural Earth 1:110m (TopoJSON `world-atlas@2.0.2`, MD5 registrado em `src/lib/atlas/worldApi.ts`). |
| Perfil energético dos países | `/api/atlas/world` (API da NIVAR) | Our World in Data, 188 países, fonte citada por campo no perfil. |
| Base cartográfica | tiles do Mapbox | Mapbox Streets v8, Terrain-DEM v1 e Satellite; © Mapbox © OpenStreetMap. Só desenho de fundo: relevo, água, divisas, nomes de lugar e foto de satélite. |

## O que não entrou, e por quê

| O que | Por quê |
| --- | --- |
| Oleodutos, gasodutos de escoamento e de distribuição, city gates, estações de compressão | O GeoServer da ANP não tem essas camadas (GetCapabilities de 15/11/2026); o WebMap da EPE estava fora do ar no dia do acesso. |
| Área de atuação de CFLO (84), CNEE (75), EDEVP (5217), EEB (386) | A BDGD dessas distribuidoras é de 2016 e não tem camada ARAT; nenhuma tem BDGD posterior (seção 7). As demais áreas de atuação entraram. |
| Geração distribuída (telhado) | O cadastro usado é o de usinas outorgadas ou registradas (SIGA); a GD tem base própria, na ANEEL. |
| Linhas e subestações de distribuição | O SINDAT cobre a Rede de Operação (transmissão). |
| Sistemas isolados como camada | Não há camada oficial acessível; as termelétricas a óleo e diesel da Amazônia aparecem na camada de usinas. |
| Traçado exato (torre a torre) das linhas | A fonte acessível é generalizada. O traçado detalhado é da EPE/ANEEL. |

## Arquivos publicados

| Arquivo | Tamanho | SHA-256 (16 primeiros) | Gerado por |
| --- | ---: | --- | --- |
| `agua-bacias.geojson` | 117 KB | `1d27d7684f76f9f3` | `construir.mjs` |
| `agua-reservatorios.geojson` | 50 KB | `ebec8bc5871021f6` | `construir.mjs` |
| `combustivel-bacias.geojson` | 405 KB | `a80f0cb40f65cbd2` | `construir.mjs` |
| `combustivel-blocos.geojson` | 231 KB | `e0d3990322d9fc99` | `construir.mjs` |
| `combustivel-campos.geojson` | 338 KB | `6dbc9b488ce76c53` | `construir.mjs` |
| `combustivel-gasodutos.geojson` | 642 KB | `9128614b00c22b3a` | `construir.mjs` |
| `combustivel-instalacoes.geojson` | 58 KB | `fc3b1f5565d20bd2` | `construir.mjs` |
| `combustivel-presal.geojson` | 0 KB | `92c5b6ee413819eb` | `construir.mjs` |
| `comercio-2025.json` | 179 KB | `bd3c08a3952552ee` | `tools/alexandria-atlas/comercio/` (seção 9) |
| `distribuicao-areas.geojson` | 1.252 KB | `894915aaffe70bac` | `construir.mjs` |
| `indice.json` | 46 KB | `64e680bf5c554219` | `construir.mjs` (o índice; não se lista a si mesmo) |
| `operacao-dias.json` | 451 KB | `6a1e30b1ebed06ab` | `tools/alexandria-atlas/operacao/` (seção 10) |
| `rede-linhas.geojson` | 1.167 KB | `c72bd452df3437c1` | `construir.mjs` |
| `rede-subestacoes.geojson` | 398 KB | `5fb5db52dba0827f` | `construir.mjs` |
| `serie-balanco-mensal.json` | 36 KB | `f1849baec48c028b` | `construir.mjs` |
| `serie-ear-reservatorios.json` | 109 KB | `6e18eb83d48917cf` | `construir.mjs` |
| `serie-ear-subsistema.json` | 27 KB | `c67aa1f3ae7098aa` | `construir.mjs` |
| `serie-intercambio.json` | 10 KB | `f398342a2ec6146e` | `construir.mjs` |
| `serie-perfil-horario.json` | 34 KB | `27d86874c57bd52d` | `construir.mjs` |
| `submercados.geojson` | 60 KB | `15a7c38442db6976` | `construir.mjs` |
| `usinas-menores.json` | 2.745 KB | `4d44727e843fd588` | `construir.mjs` |
| `usinas-principais.json` | 877 KB | `6347cc7ea04a00ac` | `construir.mjs` |

Os tamanhos são do arquivo sem compressão; o servidor entrega com gzip ou brotli. A tabela lista TODO arquivo da pasta
`public/alexandria/atlas/dados/` no momento em que este documento foi gerado: os de `construir.mjs` com o hash que o
índice registra; os demais (o próprio índice, o comércio e a operação) com o hash calculado aqui, sobre o arquivo como está.
