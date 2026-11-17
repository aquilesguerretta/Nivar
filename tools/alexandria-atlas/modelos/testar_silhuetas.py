# Atlas da Alexandria v3 — teste de silhuetas das maquetes (critério A15 da especificação de
# colocação).
#
#   "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" --background ^
#       --python tools/alexandria-atlas/modelos/testar_silhuetas.py -- [--px 32] [--png <pasta>]
#
# Lê os GLB EXPORTADOS (public/alexandria/atlas/modelos/*.glb), não o gerador: mede o que o
# mapa de fato carrega. Para cada modelo, uma câmera ortográfica a 45° de inclinação e rumo 0
# (olhando para o norte, como o mapa com rumo 0), com a escala do mapa: a MAIOR MEDIDA do
# modelo ocupa --px pixels (32 por padrão, o piso da lei de tamanho). O pé do modelo (a
# origem, o ponto do cadastro) cai no mesmo pixel em todas as imagens, porque no mapa todas
# as maquetes se assentam no próprio pé. A silhueta é o alfa binarizado em 0,5; a
# comparação é a interseção sobre a união par a par.
#
# Limite do critério: IoU < 0,7 em todo par das térmicas (termica-gas, termica-carvao,
# termica-motores, termeletrica, biomassa, biomassa-cana, biogas, alto-forno).
#
# Saída: a matriz no console e em folha/silhuetas.json; com --png, cada silhueta ampliada
# (8×) para olhar.

import json
import math
import os
import sys

import bpy
import numpy as np
from mathutils import Vector

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.abspath(os.path.join(AQUI, "..", "..", ".."))
MODELOS = os.path.join(RAIZ, "public", "alexandria", "atlas", "modelos")
ARGS = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
PX = int(ARGS[ARGS.index("--px") + 1]) if "--px" in ARGS else 32
PNG = ARGS[ARGS.index("--png") + 1] if "--png" in ARGS else None
# a laje sai por padrão (o mapa a apaga abaixo de 120 px); --com-laje a mantém
COM_LAJE = "--com-laje" in ARGS

TERMICAS = ["termica-gas", "termica-carvao", "termica-motores", "termeletrica", "biomassa", "biomassa-cana", "biogas", "alto-forno"]
OUTRAS = ["nuclear", "hidreletrica", "hidreletrica-grande", "pch", "solar", "aerogerador"]
LIMITE = 0.7

# tela: o pé fica em (LARG/2, ALT*0.7) — sobra mais espaço para cima, onde o modelo cresce
LARG, ALT = PX * 2, PX * 2
INCL = math.radians(45)


def silhueta(nome):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=os.path.join(MODELOS, nome + ".glb"))
    obs = [o for o in bpy.context.scene.objects if o.type == "MESH"]
    bpy.context.view_layer.update()
    # medida antes de tirar a laje: a escala do mapa é pela maior medida do modelo inteiro
    pts = [o.matrix_world @ Vector(c) for o in obs for c in o.bound_box]
    tam = Vector((max(p[i] for p in pts) - min(p[i] for p in pts) for i in range(3)))
    if not COM_LAJE:
        # o mapa apaga a laje ("chao") abaixo de 120 px na tela: a 32 px ela não existe
        import bmesh

        for o in obs:
            idx = {i for i, m in enumerate(o.data.materials) if m and m.name.startswith("chao")}
            if not idx:
                continue
            bm = bmesh.new()
            bm.from_mesh(o.data)
            bmesh.ops.delete(bm, geom=[f for f in bm.faces if f.material_index in idx], context="FACES")
            bm.to_mesh(o.data)
            bm.free()
    maior = max(tam)
    cena = bpy.context.scene
    # câmera ortográfica olhando para o norte (+y no Blender), inclinada 45° a partir da vertical
    direcao = Vector((0, -math.sin(INCL), math.cos(INCL)))  # do alvo para a câmera
    cam_d = bpy.data.cameras.new("cam")
    cam_d.type = "ORTHO"
    cam_d.clip_end = 20000
    cam = bpy.data.objects.new("cam", cam_d)
    cena.collection.objects.link(cam)
    rot = (-direcao).to_track_quat("-Z", "Y")
    cam.rotation_euler = rot.to_euler()
    R = rot.to_matrix()
    dir_x, dir_y = R @ Vector((1, 0, 0)), R @ Vector((0, 1, 0))
    # metros por pixel: a maior medida ocupa PX pixels (a lei do mapa mede pela maior medida)
    mpp = maior / PX
    cam_d.ortho_scale = mpp * max(LARG, ALT)
    # o pé (origem) projetado em (LARG/2, ALT*0.7): desloca o centro da câmera
    du = 0.0
    dv = (ALT * 0.7 - ALT / 2) * mpp  # o pé fica abaixo do centro
    alvo = dir_x * du + dir_y * dv
    cam.location = alvo + direcao * 5000
    cena.camera = cam
    cena.render.engine = "BLENDER_WORKBENCH"
    cena.display.shading.light = "FLAT"
    cena.display.shading.color_type = "SINGLE"
    cena.render.film_transparent = True
    cena.render.resolution_x = LARG
    cena.render.resolution_y = ALT
    cena.render.resolution_percentage = 100
    cena.render.filter_size = 0.0  # sem filtro: o pixel é coberto ou não
    cena.render.image_settings.file_format = "PNG"
    cena.render.image_settings.color_mode = "RGBA"
    caminho = os.path.join(bpy.app.tempdir, "sil_" + nome + ".png")
    cena.render.filepath = caminho
    bpy.ops.render.render(write_still=True)
    img = bpy.data.images.load(caminho)
    a = np.array(img.pixels[:], dtype=np.float32).reshape(ALT, LARG, 4)[:, :, 3]
    mascara = a[::-1] > 0.5
    if PNG:
        os.makedirs(PNG, exist_ok=True)
        grande = np.kron(mascara.astype(np.float32), np.ones((8, 8), dtype=np.float32))
        h, w = grande.shape
        out = bpy.data.images.new("sil", w, h, alpha=True)
        px = np.ones((h, w, 4), dtype=np.float32)
        px[:, :, 0] = px[:, :, 1] = px[:, :, 2] = 1 - grande * 0.9
        out.pixels = px[::-1].ravel()
        out.filepath_raw = os.path.join(PNG, nome + ".png")
        out.file_format = "PNG"
        out.save()
    return mascara


def iou(a, b):
    u = np.logical_or(a, b).sum()
    return float(np.logical_and(a, b).sum() / u) if u else 0.0


nomes = TERMICAS + [n for n in OUTRAS if os.path.exists(os.path.join(MODELOS, n + ".glb"))]
mascaras = {n: silhueta(n) for n in nomes}
matriz = {a: {b: round(iou(mascaras[a], mascaras[b]), 3) for b in nomes} for a in nomes}
pior = max(((matriz[a][b], a, b) for i, a in enumerate(TERMICAS) for b in TERMICAS[i + 1 :]), default=(0, "", ""))

abrev = {n: n.replace("termica-", "t-").replace("biomassa", "bio").replace("hidreletrica", "uhe").replace("termeletrica", "termel").replace("aerogerador", "aero")[:9] for n in nomes}
linhas = ["%-10s" % "" + "".join("%10s" % abrev[b] for b in nomes)]
for a in nomes:
    linhas.append("%-10s" % abrev[a] + "".join("%10.2f" % matriz[a][b] for b in nomes))
print("\n".join(linhas))
print("PIXELS", {n: int(m.sum()) for n, m in mascaras.items()})
print("PIOR_PAR_TERMICAS %.3f %s x %s -> %s" % (pior[0], pior[1], pior[2], "PASSA" if pior[0] < LIMITE else "FALHA"))
with open(os.path.join(AQUI, "folha", "silhuetas.json"), "w", encoding="utf-8") as f:
    json.dump({"px": PX, "inclinacao": 45, "rumo": 0, "comLaje": COM_LAJE, "limite": LIMITE, "termicas": TERMICAS, "matriz": matriz, "pior": list(pior), "pixels": {n: int(m.sum()) for n, m in mascaras.items()}}, f, ensure_ascii=False, indent=2)
