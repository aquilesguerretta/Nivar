# Atlas da Alexandria v3 — a régua de tamanho da legenda (três silhuetas).
#
#   "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" --background ^
#       --python tools/alexandria-atlas/modelos/gerar_regua.py
#
# Grava em public/alexandria/atlas/modelos/ três PNG de silhueta, desenhados no tamanho que
# a lei de tamanho do mapa dá a cada potência (L = 44 · (MW/30)^0,22, a maior medida do
# modelo na tela):
#
#   regua-30mw.png   aerogerador          30 MW   L =  44 px
#   regua-1gw.png    termica-gas           1 GW   L =  95 px
#   regua-10gw.png   hidreletrica-grande  10 GW   L = 158 px
#
# Vista do mapa (45° de inclinação, rumo 0), sem a laje (o mapa a apaga abaixo de 120 px),
# CONTORNO da silhueta, em traço de tinta (#15213b), sobre fundo transparente, em 2× (retina): a imagem tem
# o dobro dos px de CSS. A interface pode usá-la como máscara (mask-image) e pintar com a
# cor do modo (tinta no claro, creme no noturno). regua.json traz as medidas de CSS.

import json
import math
import os

import bmesh
import bpy
import numpy as np
from mathutils import Matrix, Vector

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.abspath(os.path.join(AQUI, "..", "..", ".."))
MODELOS = os.path.join(RAIZ, "public", "alexandria", "atlas", "modelos")
INCL = math.radians(45)
TINTA = (0x15 / 255, 0x21 / 255, 0x3B / 255)
ESCALA = 2  # retina

lei = lambda mw: 44 * (mw / 30) ** 0.22
# giro: a régua mostra cada modelo de flanco (a barragem atravessada à vista, como o mapa a
# gira contra o rio; a térmica com as duas linhas lado a lado)
REGUA = [("regua-30mw", "aerogerador", 30, 0), ("regua-1gw", "termica-gas", 1000, -70), ("regua-10gw", "hidreletrica-grande", 10000, -90)]


# A régua é TRAÇO, não mancha (a crítica: os 10 GW eram um bloco cinza que pesava mais que o
# mapa). Só o contorno da silhueta, com FIO px de largura (em px da imagem 2×: 1,2 px de CSS).
FIO = 2.4


def contorno(alfa):
    """Contorno da silhueta: a máscara menos a sua erosão por um disco de raio FIO (alfa
    suavizado pela distância, para o fio não sair serrilhado)."""
    m = alfa > 0.5
    h, w = m.shape
    r = int(math.ceil(FIO)) + 1
    p = np.pad(m, r, constant_values=False)
    # distância (em px) até o fora da máscara, por varredura nos deslocamentos do disco
    dist = np.full(m.shape, float(r), dtype=np.float32)
    for dy in range(-r, r + 1):
        for dx in range(-r, r + 1):
            d = math.hypot(dx, dy)
            if d > r:
                continue
            fora = ~p[r + dy : r + dy + h, r + dx : r + dx + w]
            dist = np.where(fora & (d < dist), d, dist)
    a = np.clip(FIO + 0.5 - dist, 0.0, 1.0)
    return np.where(m, a, 0.0).astype(np.float32)


def silhueta(modelo, L, giro):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=os.path.join(MODELOS, modelo + ".glb"))
    obs = [o for o in bpy.context.scene.objects if o.type == "MESH"]
    raizes = [o for o in bpy.context.scene.objects if o.parent is None]
    for o in raizes:
        o.rotation_mode = "XYZ"
        o.rotation_euler = (0, 0, math.radians(giro))
        o.location = Matrix.Rotation(math.radians(giro), 3, "Z") @ o.location
    bpy.context.view_layer.update()
    pts = [o.matrix_world @ Vector(c) for o in obs for c in o.bound_box]
    maior = max(max(p[i] for p in pts) - min(p[i] for p in pts) for i in range(3))
    for o in obs:
        idx = {i for i, m in enumerate(o.data.materials) if m and m.name.startswith("chao")}
        if idx:
            bm = bmesh.new()
            bm.from_mesh(o.data)
            bmesh.ops.delete(bm, geom=[f for f in bm.faces if f.material_index in idx], context="FACES")
            bm.to_mesh(o.data)
            bm.free()
    cena = bpy.context.scene
    direcao = Vector((0, -math.sin(INCL), math.cos(INCL)))
    cam_d = bpy.data.cameras.new("cam")
    cam_d.type = "ORTHO"
    cam_d.clip_end = 20000
    cam = bpy.data.objects.new("cam", cam_d)
    cena.collection.objects.link(cam)
    cam.rotation_euler = (-direcao).to_track_quat("-Z", "Y").to_euler()
    px = L * ESCALA
    mpp = maior / px
    lado = int(px * 1.6) + 8
    cam_d.ortho_scale = mpp * lado
    cam.location = direcao * 5000
    cena.camera = cam
    cena.render.engine = "BLENDER_WORKBENCH"
    cena.display.shading.light = "FLAT"
    cena.display.shading.color_type = "SINGLE"
    cena.display.shading.single_color = TINTA
    cena.view_settings.view_transform = "Standard"
    cena.render.film_transparent = True
    cena.render.resolution_x = cena.render.resolution_y = lado
    cena.render.resolution_percentage = 100
    caminho = os.path.join(bpy.app.tempdir, "regua.png")
    cena.render.filepath = caminho
    cena.render.image_settings.file_format = "PNG"
    cena.render.image_settings.color_mode = "RGBA"
    bpy.ops.render.render(write_still=True)
    img = bpy.data.images.load(caminho)
    a = np.array(img.pixels[:], dtype=np.float32).reshape(lado, lado, 4)[:, :, 3]
    linhas = np.where(a.max(axis=1) > 0.02)[0]
    colunas = np.where(a.max(axis=0) > 0.02)[0]
    r0, r1, c0, c1 = linhas.min(), linhas.max() + 1, colunas.min(), colunas.max() + 1
    recorte = a[r0:r1, c0:c1]
    h, w = recorte.shape
    out = bpy.data.images.new("r", w, h, alpha=True)
    pix = np.zeros((h, w, 4), dtype=np.float32)
    pix[:, :, 0], pix[:, :, 1], pix[:, :, 2] = TINTA
    pix[:, :, 3] = contorno(recorte)
    out.pixels = pix.ravel()
    return out, w, h


saida = {"nota": "Régua de tamanho da legenda: silhuetas a 45°, no L da lei de tamanho (L = 44·(MW/30)^0,22, maior medida do modelo em px de CSS). Imagens em 2×; largura/altura abaixo em px de CSS.", "itens": []}
for nome, modelo, mw, giro in REGUA:
    L = lei(mw)
    img, w, h = silhueta(modelo, L, giro)
    arq = os.path.join(MODELOS, nome + ".png")
    img.filepath_raw = arq
    img.file_format = "PNG"
    img.save()
    saida["itens"].append({"arquivo": nome + ".png", "modelo": modelo, "mw": mw, "L": round(L, 1), "largura": round(w / ESCALA, 1), "altura": round(h / ESCALA, 1)})
    print("REGUA", nome, modelo, mw, round(L, 1), w, h)
with open(os.path.join(MODELOS, "regua.json"), "w", encoding="utf-8") as f:
    json.dump(saida, f, ensure_ascii=False, indent=2)
