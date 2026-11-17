"""Monta os comps estáticos das aulas-protótipo (camada Alexandria, 2026-09-17).

Cada _src/<slug>.html começa com um comentário <!--meta {json} -->. O build envolve o corpo com o
tronco comum (header, localizador, gaveta, rodapé com colofão), embute tronco.css e tronco.js e
troca as fichas {{...}} por SVG ou por imagens redimensionadas em data URI (HTML autocontido).

Uso: python build.py            (todos)
     python build.py prancha-m01-a08
"""
import base64, io, json, re, sys
from pathlib import Path
from PIL import Image

AQUI = Path(__file__).resolve().parent
SAIDA = AQUI.parent
MIDIA = AQUI.parents[3] / "media-lab"  # docs/alexandria-v2/media-lab

FONTES = ('<link rel="preconnect" href="https://fonts.googleapis.com">'
          '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
          '<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap" rel="stylesheet">')

G = {
    "vazio": '<svg class="g" viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="5.2" fill="none" stroke="#5C5346" stroke-width="1.5"/></svg>',
    "leitura": '<svg class="g" viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="5.2" fill="none" stroke="#2A2620" stroke-width="1.5"/><path d="M7 1.8a5.2 5.2 0 0 0 0 10.4z" fill="#2A2620"/></svg>',
    "percorrida": '<svg class="g" viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="5.9" fill="#2A2620"/></svg>',
    "pratica": '<svg class="g" viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="5.2" fill="none" stroke="#2A2620" stroke-width="1.5"/><circle cx="7" cy="7" r="2.6" fill="#2A2620"/></svg>',
    "aqui": '<svg class="g" viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="6" fill="none" stroke="#2A2620" stroke-width="1.2"/><circle cx="7" cy="7" r="3" fill="#2A2620"/></svg>',
    "velado": '<svg class="g" viewBox="0 0 14 14" aria-hidden="true"><rect x="1.5" y="1.5" width="11" height="11" fill="none" stroke="#5C5346" stroke-width="1.3" stroke-dasharray="2.2 1.6"/></svg>',
}
SETA = '<svg viewBox="0 0 22 12" aria-hidden="true"><path d="M0 6h20M15 1l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>'

MARCA = ('<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="9.5" fill="none" stroke="#2A2620" stroke-width="1"/>'
         '<path d="M16 1l2.2 12.8L31 16l-12.8 2.2L16 31l-2.2-12.8L1 16l12.8-2.2z" fill="none" stroke="#2A2620" stroke-width="1.1"/>'
         '<path d="M16 1l2.2 12.8L16 16zM31 16l-12.8 2.2L16 16zM16 31l-2.2-12.8L16 16zM1 16l12.8-2.2L16 16z" fill="#2A2620"/></svg>')

ICONES = {
    "Trilhas": '<path d="M3 17l5-6 4 3 6-9" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="3" cy="17" r="1.6"/><circle cx="18" cy="5" r="1.6"/>',
    "Atlas": '<circle cx="10" cy="10" r="7.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M2.5 10h15M10 2.5c-4 4.5-4 10.5 0 15M10 2.5c4 4.5 4 10.5 0 15" fill="none" stroke="currentColor" stroke-width="1.2"/>',
    "Glossário": '<rect x="4" y="2.5" width="12" height="15" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" stroke-width="1.2"/>',
    "Biblioteca": '<path d="M3 17V4M6.5 17V4M10 17V6M13 17l3-12 2.5.6-3 12" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M2 17.5h17" stroke="currentColor" stroke-width="1.2"/>',
    "Mais": '<path d="M3 5.5h14M3 10h14M3 14.5h14" stroke="currentColor" stroke-width="1.6"/>',
}

_cache = {}


def img(rel, largura):
    chave = (rel, largura)
    if chave in _cache:
        return _cache[chave]
    im = Image.open(MIDIA / rel).convert("RGB")
    if im.width > largura:
        im = im.resize((largura, round(im.height * largura / im.width)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=80, optimize=True, progressive=True)
    uri = "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()
    _cache[chave] = uri
    return uri


def rota(total, atual, cod):
    x0, x1 = 14, 386
    passo = (x1 - x0) / (total - 1)
    partes = [f'<line x1="{x0}" y1="15" x2="{x1}" y2="15" stroke="#CFC1A4" stroke-width="1.2"/>']
    for i in range(1, total + 1):
        x = x0 + (i - 1) * passo
        rotulo = f"{i:02d}"
        if i == atual:
            partes.append(f'<circle cx="{x:.1f}" cy="15" r="9" fill="#F2E9D6" stroke="#2A2620" stroke-width="1.3"/>'
                          f'<circle cx="{x:.1f}" cy="15" r="4.4" fill="#2A2620"/>'
                          f'<text x="{x:.1f}" y="40" text-anchor="middle" font-size="11.5" font-weight="700" fill="#2A2620">{rotulo}</text>')
        else:
            partes.append(f'<a href="#" aria-label="Aula {rotulo}"><circle cx="{x:.1f}" cy="15" r="5.4" fill="#FBF6EA" stroke="#5C5346" stroke-width="1.3"/>'
                          f'<text x="{x:.1f}" y="40" text-anchor="middle" font-size="11" fill="#5C5346">{rotulo}</text></a>')
    svg = f'<svg viewBox="0 0 400 46" role="img" aria-label="Rota do módulo {cod}: aula {atual:02d} de {total:02d}">{"".join(partes)}</svg>'
    return (f'<nav class="rota" aria-label="Rota do módulo">'
            f'<div class="rota-h"><span class="eyebrow">Rota do módulo {cod}</span><span>Aula {atual:02d} de {total:02d}</span></div>{svg}'
            f'<div class="leg"><span>{G["aqui"]}você está aqui</span><span>{G["vazio"]}sem registro ainda</span></div></nav>'
            f'<div class="rota-mob"><span>{G["aqui"]} Aula {atual:02d} de {total:02d} · Módulo {cod[1:]}</span><span class="eyebrow">rota ›</span></div>')


def shell(meta, corpo, css, js):
    m = meta
    nav = "".join(f'<a href="#">{n}</a>' for n in ["Trilhas", "Atlas", "Glossário", "Biblioteca"])
    tab = "".join(f'<a href="#"><svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">{ICONES[n]}</svg>{n.upper()}</a>' for n in ICONES)
    sumario = "".join(f"<li>{s}</li>" for s in m["sumario"])
    creditos = "".join(f"<li>{c}</li>" for c in m["creditos"])
    loc = (f'<nav class="loc" aria-label="Localização">'
           f'<ol><li><a href="#">Trilha {m["trilha"]}</a></li>'
           f'<li class="m"><a href="#"><span class="cod">{m["mod_cod"]}</span>{m["modulo"]}</a></li>'
           f'<li><span aria-current="page">Aula {m["aula_n"]} · {m["aula_curto"]}</span></li></ol>'
           f'<span class="grow"></span><span class="pos">Aula {m["aula_n"]} de {m["aula_total"]}</span>'
           f'<button class="btn-sum" type="button" data-gaveta aria-expanded="false" aria-controls="gaveta">'
           f'<svg class="g" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 3.5h10M2 7h10M2 10.5h6" stroke="currentColor" stroke-width="1.4"/></svg><span>Sumário da aula</span></button></nav>')
    return f"""<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{m["titulo_pagina"]}</title>
{FONTES}
<style>{css}</style>
</head>
<body data-arquetipo="{m["arquetipo"]}">
<header class="hdr">
  <a class="brand" href="#">{MARCA}<b>ALEXANDRIA</b></a><span class="sep"></span>
  <nav class="nav" aria-label="Navegação global">{nav}</nav><span class="grow"></span>
  <a class="busca" href="#"><b>BUSCAR</b><i>aula, módulo ou termo</i><kbd>Ctrl K</kbd></a>
  <a class="conta" href="#"><span>PROGRESSO</span><span class="av">M</span></a>
</header>
{loc}
<aside class="gaveta" id="gaveta" aria-label="Sumário da aula"><button class="x" type="button" data-gaveta-fechar aria-label="Fechar sumário">×</button>
<h2>Sumário da aula</h2><ol>{sumario}</ol></aside>
<main class="wrap">
{corpo}
</main>
<footer class="rodape"><div class="wrap"><h2>Créditos desta rota</h2><ol>{creditos}</ol></div></footer>
<nav class="tabbar" aria-label="Navegação global">{tab}</nav>
<script>{js}</script>
</body>
</html>
"""


def montar(src):
    txt = src.read_text(encoding="utf-8")
    mm = re.match(r"\s*<!--meta\s*(\{.*?\})\s*-->", txt, re.S)
    meta = json.loads(mm.group(1))
    corpo = txt[mm.end():]
    corpo = re.sub(r"\{\{img:([^|}]+)\|(\d+)\}\}", lambda x: img(x.group(1), int(x.group(2))), corpo)
    corpo = re.sub(r"\{\{g:(\w+)\}\}", lambda x: G[x.group(1)], corpo)
    corpo = corpo.replace("{{seta}}", SETA)
    corpo = re.sub(r"\{\{rota:(\d+):(\d+):(\w+)\}\}", lambda x: rota(int(x.group(1)), int(x.group(2)), x.group(3)), corpo)
    css = (AQUI / "tronco.css").read_text(encoding="utf-8")
    extra = AQUI / f"{src.stem}.css"
    if extra.exists():
        css += "\n" + extra.read_text(encoding="utf-8")
    js = (AQUI / "tronco.js").read_text(encoding="utf-8")
    html = shell(meta, corpo, css, js)
    destino = SAIDA / f"{src.stem}.html"
    destino.write_text(html, encoding="utf-8")
    print(f"{destino.name}: {len(html)/1024:.0f} KB")


if __name__ == "__main__":
    alvos = sys.argv[1:]
    for s in sorted(AQUI.glob("*.html")):
        if not alvos or s.stem in alvos:
            montar(s)
