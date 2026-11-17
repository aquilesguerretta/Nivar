"""Monta public/alexandria/atlas/dados/distribuicao-areas.geojson a partir das ARAT extraídas.

Entrada: tools/alexandria-atlas/bruto/concessoes/bdgd-itens.json (listar-bdgd.mjs)
         tools/alexandria-atlas/bruto/concessoes/arat/<codigo>.geojson (extrair_arat.py)
Saída:   public/alexandria/atlas/dados/distribuicao-areas.geojson
         tools/alexandria-atlas/bruto/concessoes/relatorio.json (validação + procedência)

Regras:
- Entra a BDGD mais recente de cada distribuidora (código ANEEL). Uma BDGD antiga só entra se a
  distribuidora não tiver sido absorvida: código cuja área está >= 90% coberta por área de
  distribuidora com BDGD mais nova é declarado "sucedido" e fica de fora (ver relatório).
- Atributos vêm do próprio dado: COD_ID da ARAT é o contrato ANEEL ("C.NNN.UF.AAAA" =
  concessão nº NNN/AAAA; "P.NNN.UF.AAAA" = permissão). Daí saem tipo e número do contrato.
  A UF do código NÃO é publicada: em ao menos dois casos ela não bate com o polígono (Cernhe 6609
  traz RJ e cai em SP; Cerci 5279 traz SP e cai no RJ). Nada é inferido do nome.
- Geometria: simplificação em graus (SIRGAS 2000 ~ WGS84 na escala do mapa) e coordenadas com
  4 casas (~11 m). A tolerância é escolhida para o arquivo caber no orçamento.

Uso: <venv>\\Scripts\\python.exe -I tools/alexandria-atlas/concessoes/construir_areas.py [--tol 0.004]
"""
import json, os, re, sys, glob, hashlib
import shapely
from shapely import area, intersection, union_all, make_valid, set_precision
from shapely.geometry import shape, mapping

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
BRUTO = os.path.join(RAIZ, "tools", "alexandria-atlas", "bruto", "concessoes")
SAIDA = os.path.join(RAIZ, "public", "alexandria", "atlas", "dados", "distribuicao-areas.geojson")
ORCAMENTO = 1_500_000
LIMIAR_SUCESSAO = 0.85

args = sys.argv[1:]
TOL = float(args[args.index("--tol") + 1]) if "--tol" in args else None

itens = json.load(open(os.path.join(BRUTO, "bdgd-itens.json"), encoding="utf-8"))
escolhidos = {e["codigo"]: e for e in itens["escolhidos"]}

RE_CONTRATO = re.compile(r"^([CP])\.(\d{3})\.([A-Z]{2})\.(\d{4})$")


def carregar():
    dist = {}
    for f in glob.glob(os.path.join(BRUTO, "arat", "*.geojson")):
        cod = int(os.path.basename(f).split(".")[0])
        if cod not in escolhidos:
            continue
        j = json.load(open(f, encoding="utf-8"))
        geoms = [make_valid(shape(x["geometry"])) for x in j["features"] if x.get("geometry")]
        g = union_all(geoms)
        props = [x["properties"] for x in j["features"]]
        dist[cod] = {"item": escolhidos[cod], "geom": g, "props": props,
                     "sha256": hashlib.sha256(open(f, "rb").read()).hexdigest(), "bytes": os.path.getsize(f)}
    return dist


def main():
    dist = carregar()
    # 1. Sucessão: BDGD antiga coberta por BDGD mais nova de outro código
    # Permissionária dentro de concessionária é sobreposição legítima (a ARAT é área de atuação),
    # então só conta como sucessão quando o tipo de outorga é o mesmo (ou desconhecido no antigo).
    def outorga(d):
        m = RE_CONTRATO.match(d["props"][0].get("COD_ID") or "")
        return m.group(1) if m else None

    sucedidos = {}
    for c, d in dist.items():
        a = area(d["geom"])
        for c2, d2 in dist.items():
            if c2 == c or d2["item"]["dataBase"] <= d["item"]["dataBase"]:
                continue
            if outorga(d) is not None and outorga(d) != outorga(d2):
                continue
            frac = area(intersection(d["geom"], d2["geom"])) / a if a else 0
            if frac >= LIMIAR_SUCESSAO:
                sucedidos[c] = {"por": c2, "fracao": round(frac, 4)}
                break
    ativos = {c: d for c, d in dist.items() if c not in sucedidos}

    # 2. Sobreposições entre ativos (área em graus², relatada como fração da menor)
    sobre = []
    cods = sorted(ativos)
    arv = shapely.STRtree([ativos[c]["geom"] for c in cods])
    for i, c in enumerate(cods):
        for j in arv.query(ativos[c]["geom"]):
            c2 = cods[j]
            if c2 <= c:
                continue
            ia = area(intersection(ativos[c]["geom"], ativos[c2]["geom"]))
            m = min(area(ativos[c]["geom"]), area(ativos[c2]["geom"]))
            if m and ia / m > 0.001:
                sobre.append({"a": c, "b": c2, "fracaoDaMenor": round(ia / m, 4)})

    # 3. Saída simplificada no orçamento
    # Ordem de desenho: maior área primeiro, para a permissionária ficar por cima da concessionária
    ordem = sorted(cods, key=lambda c: -area(ativos[c]["geom"]))

    def montar(tol):
        feats = []
        for c in ordem:
            d = ativos[c]
            g = shapely.simplify(d["geom"], tol, preserve_topology=True) if tol else d["geom"]
            g = set_precision(g, 1e-4)
            g = make_valid(g)
            if g.geom_type == "GeometryCollection":
                g = union_all([p for p in g.geoms if p.geom_type in ("Polygon", "MultiPolygon")])
            if g.is_empty:
                g = d["geom"].representative_point().buffer(tol or 0.001)
            cid = d["props"][0].get("COD_ID")
            m = RE_CONTRATO.match(cid or "")
            descr = (d["props"][0].get("DESCR") or "").strip() or None
            nome = d["item"]["nome"].replace("_", " ")
            feats.append({"type": "Feature", "properties": {
                "codigo": c,
                "nome": nome,
                "tipo": ({"C": "concessionária", "P": "permissionária"}[m.group(1)] if m else None),
                "contrato": (f"{m.group(2)}/{m.group(4)}" if m else None),
                "codArat": cid,
                "dataBase": d["item"]["dataBase"],
                "item": d["item"]["id"],
            }, "geometry": json.loads(shapely.to_geojson(g, indent=None))})
        fc = {"type": "FeatureCollection", "features": feats}
        txt = json.dumps(fc, ensure_ascii=False, separators=(",", ":"))
        txt = re.sub(r"(-?\d+\.\d{4})\d+", r"\1", txt)
        return fc, txt

    tols = [TOL] if TOL is not None else [0.002, 0.003, 0.004, 0.005, 0.0065, 0.008, 0.01, 0.0125, 0.015]
    for t in tols:
        fc, txt = montar(t)
        if len(txt.encode("utf-8")) <= ORCAMENTO:
            break
    with open(SAIDA, "w", encoding="utf-8", newline="\n") as f:
        f.write(txt)
    print("tolerância", t, "bytes", len(txt.encode("utf-8")), "feições", len(fc["features"]))

    # 4. Cobertura do território: união dos ativos vs. Brasil (área)
    uniao = union_all([d["geom"] for d in ativos.values()])
    vertices_saida = sum(len(shapely.get_coordinates(shape(x["geometry"]))) for x in fc["features"])
    rel = {
        "acessoListagem": itens["acessadoEm"],
        "tolerancia": t,
        "bytes": len(txt.encode("utf-8")),
        "sha256Saida": hashlib.sha256(txt.encode("utf-8")).hexdigest(),
        "verticesSaida": vertices_saida,
        "ativos": len(ativos),
        "sucedidos": {str(k): v | {"nome": dist[k]["item"]["nome"], "dataBase": dist[k]["item"]["dataBase"]} for k, v in sucedidos.items()},
        "sobreposicoes": sobre,
        "uniaoAreaGraus2": round(area(uniao), 4),
        "uniaoBounds": [round(x, 3) for x in uniao.bounds],
        "distribuidoras": [{
            "codigo": c, "nome": ativos[c]["item"]["nome"], "codArat": ativos[c]["props"][0].get("COD_ID"),
            "dataBase": ativos[c]["item"]["dataBase"], "item": ativos[c]["item"]["id"], "titulo": ativos[c]["item"]["titulo"],
            "aratBytes": ativos[c]["bytes"], "aratSha256": ativos[c]["sha256"],
            "vertices": len(shapely.get_coordinates(ativos[c]["geom"])),
        } for c in cods],
    }
    with open(os.path.join(BRUTO, "relatorio.json"), "w", encoding="utf-8") as f:
        json.dump(rel, f, ensure_ascii=False, indent=1)
    print("ativos", len(ativos), "sucedidos", sorted(sucedidos), "sobreposições", len(sobre))
    uniao.normalize()
    with open(os.path.join(BRUTO, "uniao.wkb"), "wb") as f:
        f.write(shapely.to_wkb(uniao))


if __name__ == "__main__":
    main()
