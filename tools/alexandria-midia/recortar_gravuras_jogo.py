"""Recorta o fundo branco das gravuras de jogo e exporta webp com alfa.

O fundo é o branco LIGADO À BORDA (inundação a partir das bordas), não todo
pixel claro: assim o papel do livro, do calendário e da folha continua opaco.
O aro do emblema também perde o miolo branco (inundação a partir do centro).
Uso: py -I recortar.py <pasta-brutas> <pasta-saida>
"""
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter

ORIGEM = Path(sys.argv[1])
SAIDA = Path(sys.argv[2])
SAIDA.mkdir(parents=True, exist_ok=True)

LADO = {"i": 192, "m": 384}
LADO_ARO = 512


def mascara_de_fundo(im: Image.Image, sementes: list[tuple[int, int]]) -> Image.Image:
    """255 onde é fundo (branco quase puro ligado às sementes)."""
    rgb = im.convert("RGB")
    # claro o bastante = candidato a fundo
    cinza = rgb.convert("L")
    minimo = ImageChops.darker(ImageChops.darker(*rgb.split()[:2]), rgb.split()[2])
    claro = minimo.point(lambda v: 255 if v >= 236 else 0)
    # inundação: pinta de 128 a região clara conectada a cada semente
    m = claro.copy()
    for s in sementes:
        if m.getpixel(s) == 255:
            ImageDraw.floodfill(m, s, 128)
    fundo = m.point(lambda v: 255 if v == 128 else 0)
    # borda macia: fecha furos de 1 px e suaviza a transição
    fundo = fundo.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
    del cinza
    return fundo


for f in sorted(ORIGEM.glob("*.png")):
    im = Image.open(f).convert("RGBA")
    w, h = im.size
    sementes = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]
    aro = f.stem == "i-aro"
    if aro:
        sementes.append((w // 2, h // 2))
    fundo = mascara_de_fundo(im, sementes)
    alfa = ImageChops.invert(fundo)
    im.putalpha(ImageChops.multiply(im.getchannel("A"), alfa))
    caixa = im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    im = im.crop(caixa)
    # quadrado com margem de 4%
    lado = max(im.size)
    margem = round(lado * 0.04)
    quadro = Image.new("RGBA", (lado + 2 * margem, lado + 2 * margem), (0, 0, 0, 0))
    quadro.paste(im, ((quadro.width - im.width) // 2, (quadro.height - im.height) // 2))
    alvo = LADO_ARO if aro else LADO[f.stem[0]]
    for escala, sufixo in ((1, ""), (2, "@2x")):
        if aro and escala == 2:
            continue
        px = alvo // 2 * escala if not aro else alvo
        saida = quadro.resize((px, px), Image.LANCZOS)
        saida.save(SAIDA / f"{f.stem}{sufixo}.webp", "WEBP", quality=88, method=6)
    print(f.stem, caixa, "->", alvo)
