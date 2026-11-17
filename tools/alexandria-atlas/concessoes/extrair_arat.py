"""Extrai a camada ARAT (área de atuação) das BDGD da ANEEL sem baixar o .gdb.zip inteiro.

O GDAL lê o diretório central do zip e só os blocos da tabela ARAT por requisição de faixa
(/vsizip/{/vsicurl/<url>}/<nome>.gdb). Cada distribuidora vira um GeoJSON bruto em
tools/alexandria-atlas/bruto/concessoes/arat/<codigo>.geojson, com a geometria ORIGINAL
(EPSG:4674, SIRGAS 2000), sem simplificar.

Requisitos (venv isolado, fora do repo):
    py -3 -m venv %TEMP%\\atlas-concessoes\\venv
    %TEMP%\\atlas-concessoes\\venv\\Scripts\\python.exe -m pip install pyogrio shapely numpy

Uso (da raiz do repo):
    node tools/alexandria-atlas/concessoes/listar-bdgd.mjs
    <venv>\\Scripts\\python.exe -I tools/alexandria-atlas/concessoes/extrair_arat.py [--so <codigo,...>] [--paralelo 6]

O GDAL às vezes não devolve o processo ao fim (threads do curl no Windows); por isso cada
distribuidora roda num processo filho que grava o arquivo e é encerrado pelo pai.
"""
import json, os, subprocess, sys, time, hashlib
from concurrent.futures import ThreadPoolExecutor

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
BRUTO = os.path.join(RAIZ, "tools", "alexandria-atlas", "bruto", "concessoes")
SAIDA = os.path.join(BRUTO, "arat")
UA = "Mozilla/5.0 (atlas-data-fetch)"


def filho(iid, titulo, destino):
    import pyogrio
    from pyogrio import set_gdal_config_options
    import shapely

    set_gdal_config_options({"GDAL_HTTP_USERAGENT": UA, "GDAL_DISABLE_READDIR_ON_OPEN": "EMPTY_DIR",
                             "GDAL_HTTP_MAX_RETRY": "4", "GDAL_HTTP_RETRY_DELAY": "3"})
    url = f"https://www.arcgis.com/sharing/rest/content/items/{iid}/data"
    p = f"/vsizip/{{/vsicurl/{url}}}/{titulo}.gdb"
    info = pyogrio.read_info(p, layer="ARAT")
    meta, _, geom, campos = pyogrio.raw.read(p, layer="ARAT")
    feats = []
    for i, g in enumerate(geom):
        props = {n: (c[i].item() if hasattr(c[i], "item") else c[i]) for n, c in zip(meta["fields"], campos)}
        feats.append({"type": "Feature", "properties": props,
                      "geometry": json.loads(shapely.to_geojson(shapely.from_wkb(g))) if g is not None else None})
    fc = {"type": "FeatureCollection", "crs_origem": info.get("crs"), "item": iid, "titulo": titulo, "features": feats}
    tmp = destino + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(fc, f)
    os.replace(tmp, destino)
    sys.stdout.write("ok\n"); sys.stdout.flush()
    os._exit(0)


def um(e, py):
    destino = os.path.join(SAIDA, f"{e['codigo']}.geojson")
    if os.path.exists(destino):
        return e["codigo"], "já existia", 0
    t = time.time()
    proc = subprocess.Popen([py, "-I", __file__, "--filho", e["id"], e["titulo"], destino],
                            stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    limite = time.time() + 600
    while time.time() < limite:
        if os.path.exists(destino):
            break
        if proc.poll() is not None:
            break
        time.sleep(0.5)
    erro = ""
    if not os.path.exists(destino):
        try:
            proc.kill(); _, err = proc.communicate(timeout=10); erro = err.decode("utf-8", "replace")[-400:]
        except Exception as x:
            erro = str(x)
    else:
        time.sleep(1); proc.kill()
    return e["codigo"], ("ok" if os.path.exists(destino) else "FALHA " + erro.strip()), round(time.time() - t, 1)


def main():
    if len(sys.argv) > 1 and sys.argv[1] == "--filho":
        filho(*sys.argv[2:5])
        return
    so = None
    par = 6
    a = sys.argv[1:]
    if "--so" in a: so = {int(x) for x in a[a.index("--so") + 1].split(",")}
    if "--paralelo" in a: par = int(a[a.index("--paralelo") + 1])
    os.makedirs(SAIDA, exist_ok=True)
    with open(os.path.join(BRUTO, "bdgd-itens.json"), encoding="utf-8") as f:
        itens = json.load(f)["escolhidos"]
    if so: itens = [e for e in itens if e["codigo"] in so]
    with ThreadPoolExecutor(par) as ex:
        for cod, st, s in ex.map(lambda e: um(e, sys.executable), itens):
            print(cod, st, f"{s}s", flush=True)


if __name__ == "__main__":
    main()
