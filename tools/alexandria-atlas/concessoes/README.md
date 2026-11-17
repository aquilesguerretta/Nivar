# Áreas de atuação das distribuidoras (ANEEL · BDGD · camada ARAT)

Fonte: Base de Dados Geográfica da Distribuidora (BDGD), publicada pela ANEEL no ArcGIS Online
(organização `J5unWNi0P2dwjI3y`, Hub `dadosabertos-aneel.opendata.arcgis.com`), um File Geodatabase
zipado por distribuidora e por data-base. A camada `ARAT` é a área de atuação declarada pela própria
distribuidora; o campo `COD_ID` traz o contrato (`C.NNN.UF.AAAA` concessão, `P.NNN.UF.AAAA` permissão).

O SIGEL (`sigel.aneel.gov.br`), o CKAN (`dadosabertos.aneel.gov.br`) e o webmap da EPE estavam fora do ar
em 15/11/2026; a BDGD é o único caminho oficial que respondeu.

## Reproduzir

```
# venv isolado, fora do repo (pyogrio traz o GDAL 3.12 na roda)
py -3 -m venv %TEMP%\atlas-concessoes\venv
%TEMP%\atlas-concessoes\venv\Scripts\python.exe -m pip install pyogrio shapely numpy

node tools/alexandria-atlas/concessoes/listar-bdgd.mjs                          # itens e data-base
<venv>\Scripts\python.exe -I tools/alexandria-atlas/concessoes/extrair_arat.py  # só a ARAT, por faixa HTTP
<venv>\Scripts\python.exe -I tools/alexandria-atlas/concessoes/construir_areas.py
<venv>\Scripts\python.exe -I tools/alexandria-atlas/concessoes/validar_areas.py <brasil.geojson>
node tools/alexandria-atlas/concessoes/prancha.mjs <pasta>                      # conferência visual
```

A extração não baixa o `.gdb.zip` inteiro (de 1 MB a mais de 1 GB): o GDAL lê o diretório central do zip
e os blocos da tabela ARAT por requisição de faixa (`/vsizip/{/vsicurl/<url>}/<nome>.gdb`). O bruto fica
em `tools/alexandria-atlas/bruto/concessoes/` (ignorado pelo git), com `relatorio.json` (sucessões,
sobreposições, SHA-256 de cada ARAT extraída).

## O que o arquivo publicado diz e o que não diz

- Uma feição por distribuidora ativa, da BDGD de data-base mais recente (`dataBase`).
- BDGD antiga coberta em 85% ou mais por distribuidora de mesma outorga com BDGD mais nova é tratada
  como sucedida (fusões) e fica de fora; a lista está no `relatorio.json`.
- **Sobreposição é dado, não erro**: permissionária (cooperativa) atua dentro da área de concessionária.
  O arquivo vem ordenado da maior área para a menor, para a permissionária ser desenhada por cima.
- Não há campo de UF: a UF dentro do `COD_ID` não bate com o polígono em ao menos dois casos
  (Cernhe 6609 traz RJ e fica em SP; Cerci 5279 traz SP e fica no RJ). O `codArat` vai cru.
- Geometria simplificada (tolerância registrada no relatório) e coordenadas com 4 casas.
