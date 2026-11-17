"""Validação de distribuicao-areas.geojson.

1. Cobertura: Brasil (Natural Earth 110m, public/alexandria/geo/world-110m.json, convertido para
   GeoJSON e passado como argumento) menos a união das áreas brutas (uniao.wkb). Lista os
   maiores vazios com o ponto representativo, para conferir no mapa o que fica de fora.
2. Casos conhecidos: ponto conhecido -> distribuidora(s) cujo polígono publicado o contém.

Uso: <venv>\\Scripts\\python.exe -I tools/alexandria-atlas/concessoes/validar_areas.py <brasil.geojson>
"""
import json, os, sys, math
import shapely
from shapely.geometry import shape, Point

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
BRUTO = os.path.join(RAIZ, "tools", "alexandria-atlas", "bruto", "concessoes")
SAIDA = os.path.join(RAIZ, "public", "alexandria", "atlas", "dados", "distribuicao-areas.geojson")


def km2(g):
    # área aproximada: graus² escalados por cos(latitude do centróide); só para ordem de grandeza
    if g.is_empty:
        return 0.0
    tot = 0.0
    for p in getattr(g, "geoms", [g]):
        lat = p.centroid.y
        tot += p.area * (111.32 ** 2) * math.cos(math.radians(lat))
    return tot


brasil = shapely.make_valid(shape(json.load(open(sys.argv[1], encoding="utf-8"))["geometry"]))
uniao = shapely.from_wkb(open(os.path.join(BRUTO, "uniao.wkb"), "rb").read())
fora = shapely.difference(brasil, uniao)
print(f"Brasil (NE 110m) ~{km2(brasil):,.0f} km2; união das áreas ~{km2(uniao):,.0f} km2; "
      f"Brasil não coberto ~{km2(fora):,.0f} km2 ({km2(fora) / km2(brasil):.2%})")
partes = sorted(getattr(fora, "geoms", [fora]), key=lambda p: -p.area)
for p in partes[:12]:
    rp = p.representative_point()
    print(f"  vazio ~{km2(p):,.0f} km2 em ({rp.x:.2f}, {rp.y:.2f})")
furos = sum(len(p.interiors) for p in getattr(uniao, "geoms", [uniao]) if p.geom_type == "Polygon")
print("furos internos na união:", furos)

fc = json.load(open(SAIDA, encoding="utf-8"))
geo = [(f["properties"], shape(f["geometry"])) for f in fc["features"]]
casos = {
    "São Paulo, Sé (Enel SP)": (-46.6339, -23.5505),
    "Campinas (CPFL Paulista)": (-47.0626, -22.9056),
    "Belo Horizonte (Cemig-D)": (-43.9378, -19.9208),
    "Belém (Equatorial PA)": (-48.4902, -1.4558),
    "Boa Vista (Roraima Energia)": (-60.6753, 2.8235),
    "Manaus (Amazonas Energia)": (-60.0217, -3.1190),
    "Porto Alegre (CEEE Equatorial)": (-51.2177, -30.0346),
    "Florianópolis (Celesc)": (-48.5482, -27.5954),
    "Brasília (Neoenergia Brasília)": (-47.8825, -15.7942),
    "Rio de Janeiro, Centro (Light)": (-43.1729, -22.9068),
    "Niterói (Enel RJ)": (-43.1036, -22.8832),
    "Fernando de Noronha": (-32.4240, -3.8540),
}
for nome, (x, y) in casos.items():
    pt = Point(x, y)
    hit = [f"{p['nome']} ({p['codigo']}, {p['tipo']})" for p, g in geo if g.contains(pt)]
    print(f"{nome}: {', '.join(hit) or 'NENHUMA'}")
