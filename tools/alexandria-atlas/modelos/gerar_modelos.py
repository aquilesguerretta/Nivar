# Atlas da Alexandria v3 — maquetes 3D dos tipos de instalação elétrica (e de gás e petróleo).
#
# Roda no Blender em segundo plano e exporta um GLB por tipo para
# public/alexandria/atlas/modelos/:
#
#   "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" --background ^
#       --python tools/alexandria-atlas/modelos/gerar_modelos.py -- [--folha] [--so <nome>]
#
#   --folha   também fotografa cada modelo (tools/alexandria-atlas/modelos/folha/*.png);
#             a prancha (docs/alexandria-v3/atlas/modelos-folha.png) é montada depois por
#             node tools/alexandria-atlas/modelos/montar-folha.mjs
#
# São REPRESENTAÇÕES ESQUEMÁTICAS DO TIPO, não retratos de uma instalação: uma
# hidrelétrica genérica, um aerogerador genérico. Pela regra de imagem do Founder,
# é a categoria "precisa demonstrar algo e é educacional: gerado, com visual
# coerente com a realidade". As proporções seguem ordens de grandeza reais (torre
# eólica de 100 m e pás de 58 m; chaminé de carvão de 150 m; torre de 230 kV de
# 40 m; estaiada de 500 kV de 40 m com 32 m de mísula), e o mapa diz que são
# esquema e que estão fora de escala no zoom baixo.
#
# Cinco materiais, pelo NOME (o mapa troca a cor conforme o modo claro/noturno; a regra
# de uso de cada um — a gramática da família — está em "a gramática da família", abaixo):
#   "papel"     corpo — concreto, chapa; ganha contorno de tinta no mapa;
#   "chao"      a laje de contato com o chão (pátio), um tom abaixo do papel;
#   "tinta"     o detalhe que define o tipo, sobre o corpo (comporta, módulo solar,
#               topo de chaminé, pilha de carvão, radiador de transformador);
#   "estrutura" o metal fino ao ar livre (treliça de torre, pórtico de subestação,
#               braço de carregamento). No claro é tinta; no noturno clareia, para a
#               treliça não sumir contra o mapa escuro. Desenhado dos dois lados;
#   "acento"    UMA peça pequena por modelo na cor da fonte (modelos.json, campo "acento").
#
# Depois de gerar: node tools/alexandria-atlas/modelos/montar-folha.mjs (a prancha),
# blender ... --python tools/alexandria-atlas/modelos/testar_silhuetas.py (critério A15) e
# blender ... --python tools/alexandria-atlas/modelos/gerar_regua.py (a régua da legenda).
#
# Nenhum modelo traz água: no mapa, rio, reservatório e mar são os da base
# cartográfica. A laje ("chao") é só a pegada dos prédios com folga pequena; o mapa não
# desenha contorno em volta dela e a apaga quando a maquete é pequena na tela. As faces
# de baixo rente ao chão saem do modelo (nunca são vistas e brigavam com o contorno). O aerogerador sai em dois
# objetos, "torre" e "rotor", para o rotor girar.
#
# Unidade: metro. Origem: o ponto do chão sob o centro do modelo. Eixos do Blender:
# +y é o sentido do rumo (norte quando o rumo é 0), +x é a direita (leste). Torres
# e subestações são giradas no mapa para o rumo da linha; usinas ficam com a
# convenção fixa (rumo 0), porque o cadastro não diz para onde a usina está virada.

import json
import math
import os
import sys

import bmesh
import bpy
from mathutils import Matrix, Vector

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.abspath(os.path.join(AQUI, "..", "..", ".."))
SAIDA = os.path.join(RAIZ, "public", "alexandria", "atlas", "modelos")
FOTOS = os.path.join(AQUI, "folha")
os.makedirs(SAIDA, exist_ok=True)

ARGS = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
FOLHA = "--folha" in ARGS
SO = ARGS[ARGS.index("--so") + 1] if "--so" in ARGS else None


def limpar():
    global FONTE
    FONTE = None
    bpy.ops.wm.read_factory_settings(use_empty=True)


CORES = {
    "papel": (0.93, 0.90, 0.83, 1),
    "chao": (0.84, 0.80, 0.72, 1),
    "tinta": (0.035, 0.06, 0.13, 1),
    "estrutura": (0.035, 0.06, 0.13, 1),
}

# ── a gramática da família (vale para todo modelo de usina, rede e ANP) ──────────────
#
#   laje   uma só: h = 0,9 m e chanfro de 1,2 m, material "chao" (o mapa a apaga abaixo de
#          120 px na tela; acima disso é ela que une as maquetes como coleção);
#   papel  o corpo; todo volume grande é papel;
#   tinta  SÓ a assinatura do tipo (comporta, crista, mesa solar, pilha de carvão, bucha),
#          nunca um volume grande;
#   acento UMA peça pequena por modelo (topo da chaminé, faixa da nacele, tampa da unidade,
#          cinta da contenção, eletrocentro) na cor da FONTE da PALETA do Atlas — a mesma do
#          disco 2D. É categoria, não estado. O nome do material é "acento"; a cor gravada
#          no GLB é a da fonte no modo claro, e modelos.json diz qual fonte ("acento"). Um
#          leitor que não conheça o material o desenha como papel (o modelo continua certo);
#   altura no mínimo 0,2 da maior medida, para nada ler como placa com a inclinação
#          (exceções medidas e declaradas: solar, que é campo, e os pátios de subestação).
LAJE_H = 0.9
LAJE_C = 1.2

# cores das fontes: PALETA.claro.categoria de src/lib/alexandria/atlas/estilo.ts
FONTES = {
    "hidro": "#15476d",
    "eolica": "#0c9892",
    "solar": "#ca9829",
    "nuclear": "#7e4ea8",
    "biomassa": "#5c7d2a",
    "gas": "#e14e8a",
    "carvao": "#2d313a",
    "oleo": "#634011",
    "outros": "#646464",
}
FONTE = None  # a fonte do modelo em construção (define a cor do acento)


def fonte(nome):
    global FONTE
    FONTE = nome


def _srgb_linear(h):
    def c(v):
        v = int(v, 16) / 255
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4

    return (c(h[1:3]), c(h[3:5]), c(h[5:7]), 1)


def material(nome):
    if nome not in bpy.data.materials:
        m = bpy.data.materials.new(nome)
        m.use_nodes = True
        cor = _srgb_linear(FONTES[FONTE or "outros"]) if nome == "acento" else CORES[nome]
        bsdf = m.node_tree.nodes.get("Principled BSDF")
        if bsdf:
            bsdf.inputs["Base Color"].default_value = cor
            bsdf.inputs["Roughness"].default_value = 0.92
        m.diffuse_color = cor
        m.use_backface_culling = False
    return bpy.data.materials[nome]


def rot_z(graus):
    return Matrix.Rotation(math.radians(graus), 3, "Z")


class Peca:
    """Acumula geometria num bmesh, com um índice de material por face."""

    def __init__(self):
        self.bm = bmesh.new()
        self.mats = []

    def _mat(self, nome):
        if nome not in self.mats:
            self.mats.append(nome)
        return self.mats.index(nome)

    def _marcar(self, faces, nome):
        i = self._mat(nome)
        for f in faces:
            f.material_index = i

    def _faces(self, vs):
        return {f for v in vs for f in v.link_faces}

    # ── primitivos ─────────────────────────────────────────────

    def caixa(self, centro, tam, mat="papel", rot=None):
        r = bmesh.ops.create_cube(self.bm, size=1.0)
        vs = r["verts"]
        bmesh.ops.scale(self.bm, vec=Vector(tam), verts=vs)
        if rot is not None:
            bmesh.ops.rotate(self.bm, cent=Vector((0, 0, 0)), matrix=rot, verts=vs)
        bmesh.ops.translate(self.bm, vec=Vector(centro), verts=vs)
        self._marcar(self._faces(vs), mat)
        return vs

    def bloco(self, x0, x1, y0, y1, z0, z1, mat="papel"):
        return self.caixa(((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2), (x1 - x0, y1 - y0, z1 - z0), mat)

    def tronco(self, cx, cy, z0, lx0, ly0, lx1, ly1, h, mat="papel", rot=0.0):
        """Tronco de pirâmide retangular: base lx0×ly0, topo lx1×ly1 (laje chanfrada, pilha, torre maciça)."""
        r = rot_z(rot)
        cs = []
        for (lx, ly, z) in ((lx0, ly0, z0), (lx1, ly1, z0 + h)):
            for sx, sy in ((-1, -1), (1, -1), (1, 1), (-1, 1)):
                cs.append(self.bm.verts.new(r @ Vector((sx * lx / 2, sy * ly / 2, 0)) + Vector((cx, cy, z))))
        b, t = cs[:4], cs[4:]
        faces = [self.bm.faces.new(b[::-1]), self.bm.faces.new(t)]
        for i in range(4):
            faces.append(self.bm.faces.new((b[i], b[(i + 1) % 4], t[(i + 1) % 4], t[i])))
        self._marcar(faces, mat)
        return cs

    def laje(self, x0, x1, y0, y1, h=LAJE_H, c=LAJE_C, mat="chao"):
        """Laje de contato com o chão: fina, com chanfro que pega luz. Só a pegada dos prédios
        com uma folga pequena (a crítica: a laje grande virava cartão; o mapa ainda a apaga
        quando a maquete ocupa menos de 120 px e não desenha contorno em volta dela)."""
        return self.tronco((x0 + x1) / 2, (y0 + y1) / 2, 0, x1 - x0, y1 - y0, x1 - x0 - 2 * c, y1 - y0 - 2 * c, h, mat)

    def cilindro(self, base, raio_base, raio_topo, altura, lados=10, mat="papel", eixo="z", tampas=True):
        r = bmesh.ops.create_cone(self.bm, cap_ends=tampas, cap_tris=False, segments=lados, radius1=raio_base, radius2=raio_topo, depth=altura)
        vs = r["verts"]
        bmesh.ops.translate(self.bm, vec=Vector((0, 0, altura / 2)), verts=vs)
        if eixo == "x":
            bmesh.ops.rotate(self.bm, cent=Vector((0, 0, 0)), matrix=Matrix.Rotation(math.radians(90), 3, "Y"), verts=vs)
        elif eixo == "y":
            bmesh.ops.rotate(self.bm, cent=Vector((0, 0, 0)), matrix=Matrix.Rotation(math.radians(-90), 3, "X"), verts=vs)
        bmesh.ops.translate(self.bm, vec=Vector(base), verts=vs)
        self._marcar(self._faces(vs), mat)
        return vs

    def barra(self, a, b, esp, mat="estrutura", lados=4, tampas=False, esp_b=None):
        """Peça reta entre dois pontos (perna de treliça, tubo, correia, estai)."""
        a = Vector(a)
        b = Vector(b)
        d = b - a
        if d.length < 1e-6:
            return []
        r = bmesh.ops.create_cone(self.bm, cap_ends=tampas, cap_tris=False, segments=lados, radius1=esp / 2, radius2=(esp_b if esp_b is not None else esp) / 2, depth=d.length)
        vs = r["verts"]
        bmesh.ops.rotate(self.bm, cent=Vector((0, 0, 0)), matrix=d.to_track_quat("Z", "Y").to_matrix(), verts=vs)
        bmesh.ops.translate(self.bm, vec=(a + b) / 2, verts=vs)
        self._marcar(self._faces(vs), mat)
        return vs

    def fita(self, a, b, larg, normal, mat="estrutura"):
        """Quadrilátero plano entre a e b, de largura larg, no plano de normal dada (diagonal de treliça)."""
        a = Vector(a)
        b = Vector(b)
        s = (b - a).cross(Vector(normal))
        if s.length < 1e-6:
            return []
        s = s.normalized() * (larg / 2)
        vs = [self.bm.verts.new(p) for p in (a - s, b - s, b + s, a + s)]
        f = self.bm.faces.new(vs)
        self._marcar([f], mat)
        return vs

    def cupula(self, centro, raio, lados=12, aneis=5, mat="papel"):
        r = bmesh.ops.create_uvsphere(self.bm, u_segments=lados, v_segments=aneis * 2, radius=raio)
        vs = r["verts"]
        abaixo = [v for v in vs if v.co.z < -1e-4]
        bmesh.ops.delete(self.bm, geom=abaixo, context="VERTS")
        vs = [v for v in vs if v.is_valid]
        bmesh.ops.translate(self.bm, vec=Vector(centro), verts=vs)
        self._marcar(self._faces(vs), mat)
        return vs

    def esfera(self, centro, raio, lados=12, aneis=6, mat="papel"):
        r = bmesh.ops.create_uvsphere(self.bm, u_segments=lados, v_segments=aneis, radius=raio)
        vs = r["verts"]
        bmesh.ops.translate(self.bm, vec=Vector(centro), verts=vs)
        self._marcar(self._faces(vs), mat)
        return vs

    def prisma(self, perfil_xz, y0, y1, mat="papel"):
        """Extrude um perfil (lista de (x, z)) ao longo de y."""
        a = [self.bm.verts.new((x, y0, z)) for x, z in perfil_xz]
        b = [self.bm.verts.new((x, y1, z)) for x, z in perfil_xz]
        faces = [self.bm.faces.new(a[::-1]), self.bm.faces.new(b)]
        n = len(a)
        for i in range(n):
            faces.append(self.bm.faces.new((a[i], a[(i + 1) % n], b[(i + 1) % n], b[i])))
        self._marcar(faces, mat)
        return a + b

    def prisma_x(self, perfil_yz, x0, x1, mat="papel"):
        """Extrude um perfil (lista de (y, z)) ao longo de x."""
        a = [self.bm.verts.new((x0, y, z)) for y, z in perfil_yz]
        b = [self.bm.verts.new((x1, y, z)) for y, z in perfil_yz]
        faces = [self.bm.faces.new(a[::-1]), self.bm.faces.new(b)]
        n = len(a)
        for i in range(n):
            faces.append(self.bm.faces.new((a[i], a[(i + 1) % n], b[(i + 1) % n], b[i])))
        self._marcar(faces, mat)
        return a + b

    # ── compostos ──────────────────────────────────────────────

    def galpao(self, x0, x1, y0, y1, h, cumeeira, mat_telhado="papel", ao_longo="y"):
        """Galpão de duas águas; a cumeeira corre ao longo de y (padrão) ou de x."""
        self.bloco(x0, x1, y0, y1, 0, h)
        if ao_longo == "y":
            xm = (x0 + x1) / 2
            self.prisma([(x0 - 0.6, h), (x1 + 0.6, h), (xm, h + cumeeira)], y0 - 0.6, y1 + 0.6, mat_telhado)
        else:
            ym = (y0 + y1) / 2
            self.prisma_x([(y0 - 0.6, h), (y1 + 0.6, h), (ym, h + cumeeira)], x0 - 0.6, x1 + 0.6, mat_telhado)

    def predio(self, x0, x1, y0, y1, h, c=1.0, mat="papel"):
        """Bloco com a borda de cima chanfrada (pega luz na aresta)."""
        self.bloco(x0, x1, y0, y1, 0, h - c, mat)
        self.tronco((x0 + x1) / 2, (y0 + y1) / 2, h - c, x1 - x0, y1 - y0, x1 - x0 - 2 * c, y1 - y0 - 2 * c, c, mat)

    def chamine(self, x, y, z0, r0, r1, h, faixa=3.0, lados=12, topo="tinta"):
        """Chaminé de papel com o topo marcado (tinta, ou o acento da fonte nas térmicas)."""
        self.cilindro((x, y, z0), r0, r1 + (r0 - r1) * faixa / h, h - faixa, lados=lados)
        self.cilindro((x, y, z0 + h - faixa), r1 + (r0 - r1) * faixa / h, r1, faixa, lados=lados, mat=topo)

    def tanque(self, x, y, r, h, lados=16, teto="cone", faixa=True):
        self.cilindro((x, y, 0), r, r, h, lados=lados)
        if teto == "cone":
            self.cilindro((x, y, h), r, r * 0.12, r * 0.22, lados=lados)
        if faixa:
            self.cilindro((x, y, h - 1.2), r + 0.12, r + 0.12, 1.2, lados=lados, mat="tinta", tampas=False)

    def ventiladores(self, x0, x1, y, z, n, r):
        """Fileira de ventiladores de torre de resfriamento em célula (aros de tinta no teto)."""
        for i in range(n):
            x = x0 + (x1 - x0) * (i + 0.5) / n
            self.cilindro((x, y, z), r, r, 1.6, lados=12, mat="tinta")

    def portico(self, x0, x1, y, h, esp=0.9, mat="estrutura"):
        """Pórtico de subestação: duas colunas e a viga, ao longo de x."""
        self.barra((x0, y, 0), (x0, y, h), esp, mat)
        self.barra((x1, y, 0), (x1, y, h), esp, mat)
        self.barra((x0, y, h), (x1, y, h), esp * 0.9, mat)

    def transformador(self, x, y, lx=10, ly=7, h=7, buchas=3, alt_bucha=5):
        self.predio(x - lx / 2, x + lx / 2, y - ly / 2, y + ly / 2, h, c=0.5)
        self.bloco(x - lx / 2 - 2.0, x - lx / 2, y - ly / 2 + 0.6, y + ly / 2 - 0.6, 0.6, h - 0.8, "tinta")  # radiadores
        for k in range(buchas):
            bx = x - lx / 2 + lx * (k + 1) / (buchas + 1)
            self.cilindro((bx, y, h), 0.55, 0.3, alt_bucha, lados=6, mat="tinta")

    def objeto(self, nome, origem=(0, 0, 0), tirar_fundo=True):
        bmesh.ops.remove_doubles(self.bm, verts=self.bm.verts, dist=1e-4)
        bmesh.ops.recalc_face_normals(self.bm, faces=self.bm.faces)
        if tirar_fundo:
            # As faces de baixo rente ao chão nunca são vistas (a câmera do mapa está sempre
            # acima) e, no mapa, a casca de contorno da face de baixo da laje empatava em
            # profundidade com a face de cima, a menos de 1 m: metade da laje saía coberta de
            # tinta, cortada na diagonal (medido na crítica, Assis z14.8). Saem as da LAJE (material
            # "chao"); as dos CORPOS ficam (onda 2, limitações): sem elas a casca não desenhava o fio
            # no pé do corpo e a refinaria lia sem borda contra o chão (2,98:1). Onde o corpo assenta
            # na laje, o polygonOffset da casca a deixa atrás do topo da laje.
            def da_laje(f):
                return 0 <= f.material_index < len(self.mats) and self.mats[f.material_index] == "chao"

            fundo = [f for f in self.bm.faces if f.normal.z < -0.98 and max(v.co.z for v in f.verts) < 2.5 and da_laje(f)]
            bmesh.ops.delete(self.bm, geom=fundo, context="FACES_ONLY")
        bmesh.ops.triangulate(self.bm, faces=self.bm.faces)
        malha = bpy.data.meshes.new(nome)
        self.bm.to_mesh(malha)
        self.bm.free()
        for m in self.mats:
            malha.materials.append(material(m))
        # normais suaves na malha: o mapa pinta em faces planas (flatShading) e usa a
        # normal suave só para empurrar o contorno de tinta para fora, na tela
        for p in malha.polygons:
            p.use_smooth = True
        ob = bpy.data.objects.new(nome, malha)
        bpy.context.scene.collection.objects.link(ob)
        if origem != (0, 0, 0):
            malha.transform(Matrix.Translation(Vector(origem) * -1))
            ob.location = origem
        return ob


def exportar(nome, objetos):
    bpy.ops.object.select_all(action="DESELECT")
    for o in objetos:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objetos[0]
    caminho = os.path.join(SAIDA, nome + ".glb")
    bpy.ops.export_scene.gltf(
        filepath=caminho,
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_yup=True,
        export_normals=True,
        export_texcoords=False,
        export_materials="EXPORT",
        export_animations=False,
        export_cameras=False,
        export_lights=False,
    )
    tris = sum(len(o.data.polygons) for o in objetos)
    bpy.context.view_layer.update()
    pts = [o.matrix_world @ Vector(c) for o in objetos for c in o.bound_box]
    mn = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    mx = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    tam = mx - mn
    mats = sorted({m.name for o in objetos for m in o.data.materials if m})
    maior = max(tam.x, tam.y, tam.z)
    if tam.z < 0.2 * maior:
        print("AVISO altura relativa %.2f < 0,2 em %s" % (tam.z / maior, nome))
    return {
        "arquivo": nome + ".glb",
        "bytes": os.path.getsize(caminho),
        "triangulos": tris,
        "dimensoes": [round(tam.x, 1), round(tam.y, 1), round(tam.z, 1)],
        "dimensao": round(maior, 1),
        "objetos": [o.name for o in objetos],
        # acrescentados na reforma da família (só campos novos; os de cima não mudam de forma)
        "materiais": mats,
        "acento": FONTE if "acento" in mats else None,
        "alturaRelativa": round(tam.z / maior, 2),
    }


def um(nome, peca):
    ob = peca.objeto(nome)
    return exportar(nome, [ob]), [ob]


# ── treliça ──────────────────────────────────────────────────────────


def corpo_trelica(p, niveis, esp=0.55, diag=0.32, diagonais_ate=None, mat="estrutura"):
    """Fuste de treliça de seção quadrada: niveis = [(z, meia-largura), ...] de baixo para cima.
    Pernas como barras; travessas e diagonais em X como fitas planas nas quatro faces."""
    for i, ((z0, a0), (z1, a1)) in enumerate(zip(niveis, niveis[1:])):
        for sx in (-1, 1):
            for sy in (-1, 1):
                p.barra((sx * a0, sy * a0, z0), (sx * a1, sy * a1, z1), esp, mat)
        for s in (-1, 1):
            # travessas no topo do trecho
            p.fita((-a1, s * a1, z1), (a1, s * a1, z1), diag, (0, s, 0), mat)
            p.fita((s * a1, -a1, z1), (s * a1, a1, z1), diag, (s, 0, 0), mat)
            if diagonais_ate is not None and i >= diagonais_ate:
                continue
            for sinal in (-1, 1):
                p.fita((-a0 * sinal, s * a0, z0), (a1 * sinal, s * a1, z1), diag, (0, s, 0), mat)
                p.fita((s * a0, -a0 * sinal, z0), (s * a1, a1 * sinal, z1), diag, (s, 0, 0), mat)


def misula(p, z, meia_largura, meia_base, altura=3.2, esp=0.4, mat="estrutura"):
    """Mísula triangular dos dois lados do fuste, ao longo de x (perpendicular à linha)."""
    for s in (-1, 1):
        p.barra((s * meia_base, 0, z), (s * meia_largura, 0, z), esp, mat)
        p.barra((s * meia_base, 0, z + altura), (s * meia_largura, 0, z), esp * 0.85, mat)


def cadeia(p, x, z, comp, y=0.0, r=0.45):
    """Cadeia de isoladores pendurada (tinta)."""
    p.cilindro((x, y, z - comp), r, r, comp, lados=6, mat="tinta", tampas=False)


# ── usinas ───────────────────────────────────────────────────────────


def aerogerador():
    # torre tubular cônica de ~100 m, nacele chanfrada, rotor de três pás de 58 m (ordem de
    # grandeza de um aerogerador de 4–5 MW no Nordeste). Engrossado para LER a 36–60 px:
    # a pá real tem 0,8 m de espessura e some na tela; aqui a corda dobra (5 m na raiz,
    # 0,9 m na ponta, ponta pouco afilada), a torre afunila de 3,2 m a 2,3 m de raio e a
    # nacele cresce 30%, com o teto em tinta e uma faixa de acento (a fonte). A laje é o
    # plinto octogonal de 20 m (some na tela pequena, como toda laje).
    fonte("eolica")
    t = Peca()
    t.cilindro((0, 0, 0), 10.0, 10.0 - LAJE_C, LAJE_H, lados=8, mat="chao")  # plinto
    t.cilindro((0, 0, LAJE_H), 3.22, 2.3, 98.6, lados=12)
    zn = 99.5
    s = 1.3
    perfil = [(-2.1 * s, zn), (2.1 * s, zn), (2.45 * s, zn + 2.3 * s), (1.9 * s, zn + 4.4 * s), (-1.9 * s, zn + 4.4 * s), (-2.45 * s, zn + 2.3 * s)]
    t.prisma(perfil, -5.5, 12.3)
    # teto da nacele em tinta (a assinatura vista do alto) e a faixa de acento
    t.bloco(-1.9 * s + 0.2, 1.9 * s - 0.2, -4.6, 11.4, zn + 4.4 * s, zn + 4.4 * s + 0.5, "tinta")
    faixa = [(x * 1.04, zn + (z - zn) * 1.0) for x, z in perfil]
    t.prisma(faixa, 6.0, 8.2, "acento")
    torre = t.objeto("torre")
    r = Peca()
    r.cilindro((0, -3.4, 0), 0.3, 2.5, 5.0, lados=10, eixo="y")  # ogiva
    for k in range(3):
        ang = math.radians(90 + 120 * k)
        rot = Matrix.Rotation(ang, 3, "Y")
        # corda dobrada, ponta menos afilada
        perfil = [(1.6, -2.2), (11, -5.0), (32, -2.9), (58, -0.9), (58, 0.9), (32, 2.4), (11, 4.0), (1.6, 2.0)]
        vs = r.prisma(perfil, -0.5, 0.5)
        bmesh.ops.rotate(r.bm, cent=Vector((0, 0, 0)), matrix=rot, verts=vs)
    rotor = r.objeto("rotor", tirar_fundo=False)  # o rotor gira: nenhuma face fica sempre embaixo
    rotor.location = (0, -5.5 - 0.6, zn + 2.3 * s)
    return exportar("aerogerador", [torre, rotor]), [torre, rotor]


def _uhe(nome, unidades, vaos, crista, ombreira):
    """UHE como BARRAGEM, com o MURO como volume dominante (a crítica: a rampa de jusante de
    45° em papel lia como laje pálida, e a crista era um fio de 1 px). Eixo x: montante (−x)
    para jusante (+x); y ao longo do muro. De montante para jusante:
      paramento de montante VERTICAL, com a pele em tinta (de qualquer rumo que se olhe o
      lado do reservatório, é uma parede escura);
      crista LARGA em tinta (20 m: a assinatura de longe, ~8 px a 160 px de maquete);
      jusante em PAPEL, curta e em três DEGRAUS grossos (patamares que pegam luz, não rampa);
      vertedouro: a calha em TINTA descendo a jusante, cortada por pilares grossos em papel
      (o ritmo claro/escuro é o que diz "vertedouro" a 100 px; poucos vãos, largos);
      casa de força BAIXA e LARGA ao pé do muro, com as tampas das unidades no acento e a
      faixa das bocas do tubo de sucção em tinta, contínua.
    A grande difere pela FORMA, não pela contagem fina: quase o dobro de vãos de vertedouro
    e a casa de força duas vezes mais longa. Sem laje (decisão do orquestrador: a laje da
    hidrelétrica era maior que a barragem). Água não: o reservatório é o da base cartográfica."""
    fonte("hidro")
    p = Peca()
    passo = 28.0  # uma unidade geradora na casa de força
    vao = 26.0  # um vão do vertedouro (pilar a pilar)
    larg_vert = vaos * vao
    larg_cf = unidades * passo
    comp = 2 * ombreira + larg_vert + larg_cf
    y0 = -comp / 2
    yv0, yv1 = y0 + ombreira, y0 + ombreira + larg_vert
    yt0, yt1 = yv1, yv1 + larg_cf
    yf = comp / 2
    c = crista
    xm, xc = -10.0, 10.0  # faces de montante e de jusante na crista
    x1, x2 = xc + 0.13 * c, xc + 0.26 * c  # os dois patamares
    z1, z2 = 0.36 * c, 0.68 * c
    muro = [(xm, 0), (x2, 0), (x2, z1), (x1, z1), (x1, z2), (xc, z2), (xc, c), (xm, c)]
    for a, b in ((y0, yv0), (yv1, yf)):
        p.prisma(muro, a, b)
    p.bloco(xm - 1.2, xm, y0, yf, 0, c, "tinta")  # paramento de montante
    p.bloco(xm - 1.2, xc + 1.0, y0, yf, c, c + 3.5, "tinta")  # crista
    # vertedouro: calha em tinta, pilares de papel
    zs = 0.72 * c  # soleira
    xe = x2 + 0.1 * c  # pé da calha
    p.prisma([(xm, 0), (xe, 0), (xe, 3.0), (xc + 2, zs), (xm, zs)], yv0, yv1, "tinta")
    # pilares grossos, que correm a calha inteira 6 m acima dela: a calha escura fica
    # repartida em faixas (os vãos), não um bloco preto
    for k in range(vaos + 1):
        y = yv0 + k * vao
        yp0, yp1 = max(yv0, y - 4.5), min(yv1, y + 4.5)
        if k == 0:
            yp0, yp1 = yv0, yv0 + 6
        if k == vaos:
            yp0, yp1 = yv1 - 6, yv1
        p.prisma([(xm, 0), (xe, 0), (xe, 9.0), (xc + 2, zs + 6), (xc + 2, c), (xm, c)], yp0, yp1)
    # casa de força baixa e larga ao pé do muro
    h_cf = 0.26 * c
    xf = x2 + 0.42 * c
    p.predio(x2 - 2, xf, yt0 + 3, yt1 - 3, h_cf, c=1.6)
    p.bloco(xf, xf + 1.2, yt0 + 6, yt1 - 6, 1.5, 0.5 * h_cf, "tinta")  # bocas do tubo de sucção
    for k in range(unidades):
        yc = yt0 + (k + 0.5) * passo
        p.cilindro(((x2 + xf) / 2, yc, h_cf), 7.5, 7.5, 1.6, lados=10, mat="acento")
    return um(nome, p)


def hidreletrica():
    # UHE comum: quatro vãos de vertedouro e cinco unidades; muro de ~380 m × 80 m
    return _uhe("hidreletrica", 5, 4, 80.0, 48.0)


def hidreletrica_grande():
    # UHE de 1 GW ou mais (escolhida pela potência do cadastro, não pelo retrato da usina):
    # sete vãos de vertedouro e dez unidades (casa de força duas vezes mais longa); muro de
    # ~570 m × 110 m
    return _uhe("hidreletrica-grande", 10, 7, 110.0, 56.0)


def pch():
    # PCH/CGH: a mesma gramática da UHE em pequeno — soleira curta atravessando o rio com a
    # crista em tinta, o conduto forçado em tinta descendo a encosta (a assinatura) e a casa
    # de força de duas águas, ~15 m de cumeeira, com a tampa da unidade no acento.
    fonte("hidro")
    p = Peca()
    p.prisma([(-4, 0), (8, 0), (2, 7), (-4, 7)], -26, 18)  # soleira
    p.bloco(-4, 2, -26, 18, 7, 8.2, "tinta")  # crista
    p.bloco(-12, -4, -26, 30, 0, 3)  # patamar de montante
    p.predio(-5, 6, 18, 30, 11, c=0.6)  # tomada d'água
    p.barra((6, 24, 9), (44, 24, 3.4), 4.0, "tinta", lados=8)  # conduto forçado
    for x in (16, 30):
        z = 9 - (x - 6) * 5.6 / 38
        p.bloco(x - 1.4, x + 1.4, 21.5, 26.5, 0, z - 1.6)  # selas
    p.laje(40, 72, 12, 40)
    p.galpao(44, 62, 16, 36, 10, 5.5)
    p.bloco(49, 57, 20, 32, 15.0, 16.6, "acento")  # lanternim sobre a unidade
    p.bloco(62, 66, 20, 32, 0.9, 3, "tinta")  # boca do canal de fuga
    return um("pch", p)


def solar():
    # UFV de seguidor de um eixo: no máximo 8 fileiras de mesas (tinta) com VÃO IGUAL À
    # LARGURA DA MESA — o chão aparece entre elas, a crítica: 20 fileiras coladas viravam um
    # borrão escuro. No corredor, os eletrocentros (acento); no canto, a subestação de saída
    # com o pórtico de 14 m, o único ponto alto. Solar é campo: a altura relativa fica abaixo
    # de 0,2 (exceção declarada).
    fonte("solar")
    p = Peca()
    incl = Matrix.Rotation(math.radians(14), 3, "Y")
    larg = 6.4
    for i in range(8):
        x = -45 + i * 2 * larg
        for y0, y1 in ((-42, -5), (5, 42)):
            p.caixa((x, (y0 + y1) / 2, 2.6), (larg, y1 - y0, 0.35), mat="tinta", rot=incl)
            for y in (y0 + 4, y1 - 4):
                p.bloco(x - 0.4, x + 0.4, y - 0.4, y + 0.4, 0, 2.4)
    for x in (-32.2, 12.6):
        p.predio(x - 4.5, x + 4.5, -2.4, 2.4, 3.6, c=0.3, mat="acento")  # eletrocentro
    p.laje(52, 76, -14, 14)
    _trafo(p, 62, -4, 7, 5, 5, buchas=3, alt_bucha=2.5)
    p.portico(56, 72, 8, 14, 0.8)
    return um("solar", p)


def nuclear():
    # PWR: a CONTENÇÃO é o volume dominante (diâmetro +25%, 68 m até o topo da cúpula), com
    # a cinta de acento a meia altura; o prédio das turbinas fica mais baixo que ela; a
    # chaminé de ventilação também. Tinta: só o lanternim e as grades da tomada d'água.
    fonte("nuclear")
    p = Peca()
    p.laje(-56, 94, -48, 58)
    rc = 27.5
    p.cilindro((-24, -2, LAJE_H), rc, rc, 40, lados=28)
    p.cilindro((-24, -2, 31), rc + 0.3, rc + 0.3, 3.2, lados=28, mat="acento", tampas=False)  # cinta
    p.cupula((-24, -2, 40.9), rc, lados=28, aneis=6)
    p.predio(-52, 4, -46, -30, 20, c=1.0)  # prédio auxiliar / combustível
    p.predio(8, 90, -18, 18, 22, c=1.2)  # prédio das turbinas, mais baixo que a cúpula
    p.bloco(12, 86, -3, 3, 22, 25, "tinta")  # lanternim
    p.chamine(0, -38, LAJE_H, 2.0, 1.6, 56, faixa=3, lados=10, topo="papel")
    for x in (40, 58, 76):
        p.transformador(x, -32, lx=9, ly=7, h=7, buchas=3, alt_bucha=4)
    p.predio(20, 44, 40, 54, 10, c=0.6)  # casa de bombas da tomada d'água
    p.bloco(20, 44, 53.8, 54.6, 1, 8, "tinta")  # grades
    p.prisma_x([(56, 0), (66, 0), (62, 6), (59, 6)], -90, 94)  # quebra-mar
    return um("nuclear", p)


def termica_gas():
    # ciclo combinado, em massa que lê em qualquer rumo (a crítica: as duas caldeiras longas
    # e estreitas, vistas pelo eixo, viravam dois esquis em pé). DUAS caldeiras de
    # recuperação baixas e largas (planta 34 × 20 m, < 2:1), lado a lado; à frente delas, o
    # SALÃO DAS TURBINAS atravessado, que dá a massa; nas pontas, as casas de filtro com a
    # tomada de ar em tinta (a assinatura no corpo); atrás, as DUAS chaminés, o único ponto
    # alto, com o topo no acento. Nenhum teto em tinta.
    fonte("gas")
    p = Peca()
    p.laje(-46, 46, -34, 34)
    p.galpao(-32, 32, -30, -14, 15, 4, ao_longo="x")  # salão das turbinas
    for s in (-1, 1):
        x0, x1 = sorted((s * 8, s * 28))
        p.predio(x0, x1, -14, 20, 26, c=1.0)  # caldeira de recuperação
        xa0, xa1 = sorted((s * 30, s * 42))
        p.predio(xa0, xa1, -6, 10, 14, c=0.5)  # casa de filtros
        xg = s * 42.6
        p.bloco(min(xg, s * 42), max(xg, s * 42), -4, 8, 3, 12, "tinta")  # tomada de ar
        p.chamine(s * 18, 27, LAJE_H, 3.2, 2.8, 62, faixa=5, lados=12, topo="acento")
    return um("termica-gas", p)


def termica_carvao():
    # carvão: UMA chaminé muito alta (≈ a maior medida do modelo) e o pátio com o monte de
    # carvão, trapezoidal, em tinta; a caldeira alta, o salão das turbinas e a correia.
    fonte("carvao")
    p = Peca()
    p.laje(-74, 76, -24, 30)
    p.predio(-14, 16, -18, 14, 62, c=1.4)  # caldeira
    p.galpao(16, 64, -16, 12, 26, 6)  # turbinas
    p.predio(-44, -18, -14, 12, 22, c=0.8)  # precipitador
    p.barra((-44, -1, 16), (-60, -1, 16), 6, "papel")
    p.chamine(-64, -1, LAJE_H, 7.5, 4.8, 150, faixa=8, lados=14, topo="acento")
    p.tronco(-4, 62, 0, 120, 30, 100, 8, 16, "tinta")  # monte de carvão
    p.barra((30, 50, 1), (8, 14, 50), 3.2, "papel")  # correia
    return um("termica-carvao", p)


def biomassa_cana():
    # usina de cana: a caldeira de bagaço com uma chaminé (topo no acento), o MONTE CÔNICO
    # de bagaço ao lado (papel com o cume em tinta: um volume grande não vai em tinta cheia)
    # e a esteira inclinada subindo do monte à caldeira; a moenda, longa e baixa.
    fonte("biomassa")
    p = Peca()
    p.laje(-58, 20, -30, 22)
    p.predio(-22, 4, -12, 12, 34, c=1.0)  # caldeira
    p.chamine(-30, 6, LAJE_H, 2.6, 2.2, 46, faixa=4, lados=12, topo="acento")
    p.galpao(-56, -26, -28, -14, 12, 4, ao_longo="x")  # moenda
    p.galpao(4, 18, -10, 10, 13, 4)  # turbogerador
    p.cilindro((38, 40, 0), 34, 7, 22, lados=20)  # monte de bagaço
    p.cilindro((38, 40, 18), 11.2, 4, 6, lados=20, mat="tinta")  # cume
    p.barra((24, 26, 1), (-2, 4, 32), 3.0, "papel")  # esteira
    return um("biomassa-cana", p)


def biomassa():
    # biomassa sólida (lenha, cavaco, casca, licor negro): a caldeira alta e estreita com UMA
    # chaminé alta (topo no acento) e o PÁTIO DE TORAS — pilhas de cilindros deitados, em
    # tinta, fininhas: o que separa de cana a 30 px é a pilha baixa e comprida.
    fonte("biomassa")
    p = Peca()
    p.laje(-38, 30, -22, 22)
    p.predio(-16, 14, -14, 14, 50, c=1.0)  # caldeira
    p.chamine(22, 0, LAJE_H, 3.2, 2.6, 80, faixa=5, lados=12, topo="acento")
    p.barra((14, 0, 40), (22, 0, 40), 3.0, "papel")
    p.galpao(-36, -16, -12, 12, 14, 4)  # turbogerador
    for k, y in enumerate((36, 52, 68)):
        for (dx, z) in ((-3.1, 2.8), (3.1, 2.8), (0, 7.8)):
            p.cilindro((-40, y + dx, z), 2.8, 2.8, 70, lados=8, mat="tinta" if z > 5 else "papel", eixo="x")
    return um("biomassa", p)


def termica_motores():
    # motores (diesel, óleo combustível): um galpão CURTO e ALTO (3:1; a crítica: o galpão
    # comprido com dez dentes lia como vagão), QUATRO chaminés curtas e grossas atrás (topos
    # no acento) e o TANQUE redondo de combustível ao lado, com a cinta em tinta — a
    # assinatura que separa de uma térmica genérica.
    fonte("oleo")
    p = Peca()
    p.laje(-31, 31, -13, 19)
    p.galpao(-27, 27, -9, 9, 14, 3.5, ao_longo="x")
    for i in range(4):
        x = -19.5 + i * 13
        p.bloco(x - 1.6, x + 1.6, 9, 14, 6, 9)  # duto de escape
        p.chamine(x, 15.5, LAJE_H, 2.4, 2.1, 26, faixa=3.5, lados=10, topo="acento")
    p.tanque(46, 2, 11, 13, lados=16)
    return um("termica-motores", p)


def termeletrica():
    # térmica genérica (gás abaixo de 50 MW, gás de refinaria, calor de processo, outros): o
    # cadastro não diz o arranjo, então o modelo afirma o mínimo — UM bloco de máquinas com
    # lanternim em papel (a crítica: o lanternim em tinta lia como telhado preto) e UMA
    # chaminé média (topo no acento).
    fonte("gas")
    p = Peca()
    p.laje(-26, 28, -16, 16)
    p.predio(-22, 10, -12, 12, 26, c=1.0)
    p.predio(-19, 7, -3, 3, 29, c=0.6)  # lanternim
    p.chamine(20, 0, LAJE_H, 2.8, 2.4, 56, faixa=4, lados=12, topo="acento")
    return um("termeletrica", p)


def biogas():
    # biogás e resíduo sólido urbano: os DIGESTORES (cúpulas sobre cilindros baixos, com a
    # cinta em tinta), o galpão dos motores e a tocha com o topo no acento.
    fonte("biomassa")
    p = Peca()
    p.laje(22, 50, -26, 30)  # a laje só sob os motores e a tocha: os digestores assentam no chão
    for x, y in ((-26, -8), (6, -8), (-26, 24), (6, 24)):
        p.cilindro((x, y, 0), 13, 13, 8, lados=16)
        p.cilindro((x, y, 6.5), 13.15, 13.15, 1.5, lados=16, mat="tinta", tampas=False)
        p.cupula((x, y, 8), 13, lados=16, aneis=4)
    p.galpao(26, 46, -22, -4, 8, 2.5)  # motores
    p.chamine(38, 22, LAJE_H, 1.0, 0.8, 24, faixa=3, lados=8, topo="acento")  # tocha
    return um("biogas", p)


def alto_forno():
    # gás de alto-forno (siderúrgica): o ALTO-FORNO alto, os três regeneradores (cowpers) de
    # cúpula, e a central termelétrica com a chaminé (topo no acento).
    fonte("outros")
    p = Peca()
    p.laje(16, 60, -32, 32)  # a laje sob a central; forno e regeneradores assentam no chão
    p.cilindro((-30, 0, 0), 11, 8, 46, lados=14)  # alto-forno
    p.cilindro((-30, 0, 46), 8, 4, 14, lados=14, mat="tinta")
    p.barra((-30, 0, 60), (-30, 0, 78), 2.4, "papel")
    for x in (-30 - 14, -30 + 14):  # estrutura em volta do forno
        p.barra((x, -12, 0), (x, -12, 54), 1.4)
        p.barra((x, 12, 0), (x, 12, 54), 1.4)
    for y in (-22, 0, 22):  # cowpers
        p.cilindro((2, y, 0), 7.5, 7.5, 40, lados=12)
        p.cupula((2, y, 40), 7.5, lados=12, aneis=3)
    p.galpao(20, 56, -28, 28, 18, 5)  # central termelétrica
    p.chamine(50, 0, 18, 2.2, 2.0, 40, faixa=3, lados=10, topo="acento")
    return um("alto-forno", p)


# ── rede ─────────────────────────────────────────────────────────────
#
# A rede é fundo: pesa menos que a geração. Só ESTRUTURA em fio (pórticos e as colunas dos
# equipamentos) sobre a laje, transformadores pequenos em tinta e a casa de comando em
# papel. Sem telhado em tinta, sem isoladores nem barramentos finos (a 40 px viravam
# hachura). O PORTE se lê pelo número de vãos — 2, 4, 6, 8 pórticos — e pela altura
# deles, não pela escala.


def _trafo(p, x, y, lx, ly, h, buchas=3, alt_bucha=5, mat="tinta"):
    """Transformador de potência (tinta por padrão) com os radiadores em papel e as buchas."""
    p.bloco(x - lx / 2, x + lx / 2, y - ly / 2, y + ly / 2, 0, h, mat)
    p.bloco(x - lx / 2 - 2.4, x - lx / 2, y - ly / 2 + 0.6, y + ly / 2 - 0.6, 0.6, h - 1.0, "papel")  # radiadores
    for k in range(buchas):
        bx = x - lx / 2 + lx * (k + 1) / (buchas + 1)
        p.cilindro((bx, y, h), 0.7, 0.35, alt_bucha, lados=6, mat="tinta")


def _patio(nome, vaos, h, largura_vao, trafos, reator=False):
    """Pátio de subestação em MASSA (a crítica: pórtico fino, coluna de equipamento e
    bucha viravam pó de pontos a 30–58 px). Três coisas só, grandes:
      o PÓRTICO de entrada de linha como um quadro contínuo — `vaos`+1 colunas e uma viga —
      em estrutura GROSSA (≈ 4,5% da maior medida: ~2 px na tela no tamanho da rede);
      os TRANSFORMADORES (e o reator) como blocos cheios em papel, com contorno;
      a CASA DE COMANDO em papel.
    O quadro é a assinatura em estrutura (tinta no claro, creme no noturno: lê contra o mapa
    escuro sem depender da laje, que some abaixo de 120 px); o resto é papel, como em toda a
    família (blocos em tinta deixavam a rede mais pesada que a geração).
    Sem barramento, isolador, bucha nem coluna de equipamento. O porte se lê pelo número de
    vãos e pela altura do quadro; o pátio é compacto para os elementos crescerem na tela.
    A linha entra por +y."""
    p = Peca()
    meia = vaos * largura_vao / 2
    fundo = 0.62 * meia + 10
    maior = max(2 * meia + 16, 2 * fundo)
    e = 0.045 * maior  # espessura do quadro
    p.laje(-meia - 8, meia + 8, -fundo, fundo)
    # fio da laje (onda 2): a rede tem laje sempre, e a borda da laje clara contra o mapa claro
    # dava contraste de 1,6 (Manaus z14, subestação de 84 px). Um fio em estrutura (tinta no
    # claro, creme no noturno) na borda de fora da laje fecha a silhueta, como o fio de 1 px do
    # resto do sistema; ~2 px na tela no tamanho mínimo legível
    fio = 0.025 * maior
    xa, xb = -meia - 8, meia + 8
    zf = LAJE_H + 0.15
    p.bloco(xa, xb, -fundo, -fundo + fio, 0, zf, "estrutura")
    p.bloco(xa, xb, fundo - fio, fundo, 0, zf, "estrutura")
    p.bloco(xa, xa + fio, -fundo + fio, fundo - fio, 0, zf, "estrutura")
    p.bloco(xb - fio, xb, -fundo + fio, fundo - fio, 0, zf, "estrutura")
    yq = fundo - 6
    for k in range(vaos + 1):
        x = -meia + k * largura_vao
        p.bloco(x - e / 2, x + e / 2, yq - e / 2, yq + e / 2, 0, h, "estrutura")
    p.bloco(-meia - e / 2, meia + e / 2, yq - e / 2, yq + e / 2, h - e, h, "estrutura")  # viga
    # transformadores: blocos cheios, um por vão a partir da esquerda
    lt = 0.5 * largura_vao
    passo = 2 * meia / trafos
    yt = -fundo + 6 + lt * 0.35
    for k in range(trafos):
        xt = -meia + (k + 0.5) * passo
        p.bloco(xt - lt / 2, xt + lt / 2, yt - lt * 0.35, yt + lt * 0.35, 0, 0.36 * h)
    if reator:
        p.cilindro((meia + 2, yq - 0.45 * fundo, 0), 0.22 * largura_vao, 0.22 * largura_vao, 0.4 * h, lados=10)
    p.predio(-meia - 6, -meia + 0.5 * largura_vao, -2, 0.42 * fundo, 0.28 * h, c=0.5)  # casa de comando
    return um(nome, p)


def subestacao_pequena():
    # até 138 kV (ou sem tensão no cadastro): UM vão, quadro de 12 m, um transformador
    return _patio("subestacao-pequena", 1, 12, 24, 1)


def subestacao():
    # 230–345 kV: DOIS vãos, quadro de 18 m, dois transformadores
    return _patio("subestacao", 2, 18, 26, 2)


def subestacao_grande():
    # 440–800 kV: TRÊS vãos, quadro de 26 m, banco de três transformadores e o reator
    return _patio("subestacao-grande", 3, 26, 30, 3, reator=True)


def subestacao_no():
    # nó da rede (440 kV ou mais e oito linhas ou mais): a MESMA gramática da grande, com
    # QUATRO vãos e quatro transformadores
    return _patio("subestacao-no", 4, 26, 30, 4, reator=True)


def conversora():
    # estação conversora CA/CC em massa. Assinatura: os dois SALÕES DE VÁLVULAS, altos e
    # lisos, em PAPEL — o maior volume da rede —, a fileira de transformadores conversores
    # em blocos cheios (papel) encostada em cada salão, e UM quadro de saída CC grosso.
    p = Peca()
    # B6: a laje de 124 m × 100 m era a borda da maquete inteira e os transformadores em papel
    # se fundiam com ela (papel sobre papel; o contorno do pé do corpo fica sob a laje): contraste
    # 1,28 contra o mapa no claro. Agora a laje só fica sob os salões e os transformadores, com
    # 3 m de folga (o quadro CC fica de pé no chão, como as torres), e os transformadores
    # conversores vão em TINTA, como o transformador das subestações: a fileira escura separa
    # o corpo da laje nas duas bordas compridas. Fecho (16/11/2026): de pé sozinho no chão, a
    # 26 m dos salões, o quadro CC lia como um poste solto ao lado do pátio; com a laje estendida
    # até ele, a borda voltava a ser laje clara (contraste 1,59). Ficou o quadro CC encostado nos
    # salões, na borda da laje: a quarta borda também fecha em estrutura escura
    p.laje(-47, 24, -47, 47)
    for s in (-1, 1):
        y0, y1 = (6, 34) if s > 0 else (-34, -6)
        p.predio(-44, 14, y0, y1, 34, c=1.4)  # salão de válvulas
        yt0, yt1 = (y1 + 1, y1 + 10) if s > 0 else (y0 - 10, y0 - 1)
        for x in (-36, -20, -4):
            p.bloco(x - 5, x + 5, yt0, yt1, 0, 11, "tinta")  # transformador conversor
    p.predio(-40, 8, -5, 5, 14, c=0.6)  # controle, entre os salões
    e = 4.5
    xq = 20  # quadro CC na borda leste da laje, a 3,75 m dos salões
    for y in (-26, 0, 26):
        p.bloco(xq - e / 2, xq + e / 2, y - e / 2, y + e / 2, 0, 24, "estrutura")
    p.bloco(xq - e / 2, xq + e / 2, -26 - e / 2, 26 + e / 2, 24 - e, 24, "estrutura")  # quadro CC
    return um("conversora", p)


def torre():
    # autoportante de circuito duplo, até 345 kV: fuste de treliça de 36 m, três mísulas
    # por lado (a silhueta de pinheiro) e o pico do para-raios. Mais leve que antes: as
    # cadeias de isoladores saem da tinta e entram na estrutura.
    p = Peca()
    niveis = [(0, 4.6), (9, 3.3), (17, 2.3), (23, 1.7), (36, 1.25)]
    corpo_trelica(p, niveis, esp=0.55, diag=0.3, diagonais_ate=3)
    for z, larg in ((24, 7.6), (29, 9.6), (34, 7.6)):
        misula(p, z, larg, 1.6, altura=3.0, esp=0.42)
        for s in (-1, 1):
            p.barra((s * (larg - 0.3), 0, z), (s * (larg - 0.3), 0, z - 3.0), 0.5, lados=4)
    for sx, sy in ((-1, -1), (1, 1), (1, -1), (-1, 1)):
        p.barra((sx * 1.25, sy * 1.25, 36), (0, 0, 41), 0.4)
    return um("torre", p)


def torre_lod():
    # de longe (menos de 64 px): só o CONTORNO do mastro (as quatro pernas) e as mísulas
    p = Peca()
    for sx in (-1, 1):
        for sy in (-1, 1):
            # pernas de 2,6 m (onda 2, limitações: com 1,5 m a perna saía pontilhada a ~28 px).
            # Leva 2, item 5: a perna saía fina embaixo (o prisma de 3 lados mostra a aresta
            # conforme o rumo); agora seção quadrada e afunilada para cima, 3,4 m no pé e 2,2 m
            # no topo: a base lê mais larga que o mastro, como na torre de verdade
            p.barra((sx * 4.4, sy * 4.4, 0), (sx * 1.3, sy * 1.3, 36), 3.4, lados=4, esp_b=2.2)
    for z, larg in ((24, 7.6), (29, 9.6), (34, 7.6)):
        p.barra((-larg, 0, z), (larg, 0, z), 2.0, lados=3)
    p.barra((0, 0, 35), (0, 0, 41), 1.2, lados=3, esp_b=0.3)
    return um("torre-lod", p)


def _mastro(p, base, topo, lado=1.6, zigs=9, esp=0.38, diag=0.28):
    """Mastro treliçado de seção quadrada constante, entre dois pontos."""
    base = Vector(base)
    topo = Vector(topo)
    d = (topo - base).normalized()
    u = d.cross(Vector((0, 1, 0)))
    if u.length < 1e-6:
        u = Vector((1, 0, 0))
    u.normalize()
    v = d.cross(u).normalized()
    h = lado / 2
    cantos = [(su, sv) for su in (-1, 1) for sv in (-1, 1)]
    for su, sv in cantos:
        off = u * (su * h) + v * (sv * h)
        p.barra(base + off * 0.35, topo + off, esp)
    for sv in (-1, 1):
        for k in range(zigs):
            t0 = k / zigs
            t1 = (k + 1) / zigs
            a = base + (topo - base) * t0
            b = base + (topo - base) * t1
            fa = 0.35 + 0.65 * t0
            fb = 0.35 + 0.65 * t1
            sa = -1 if k % 2 == 0 else 1
            pa = a + u * (sa * h * fa) + v * (sv * h * fa)
            pb = b + u * (-sa * h * fb) + v * (sv * h * fb)
            p.fita(pa, pb, diag, v * sv)


def torre_ehv():
    # estaiada em V, 440–765 kV: dois mastros treliçados, a mísula de ~32 m, as três fases em
    # cadeia em V (estrutura, não tinta) e os quatro estais.
    p = Peca()
    z = 38
    for s in (-1, 1):
        _mastro(p, (0, 0, 0), (s * 11, 0, z), lado=1.7)
    for sy in (-0.9, 0.9):
        p.barra((-16, sy, z), (16, sy, z), 0.4)
        p.barra((-14, sy, z + 2.6), (14, sy, z + 2.6), 0.36)
        for k in range(14):
            x0 = -14 + 28 * k / 14
            x1 = -14 + 28 * (k + 1) / 14
            a, b = ((x0, sy, z), (x1, sy, z + 2.6)) if k % 2 == 0 else ((x0, sy, z + 2.6), (x1, sy, z))
            p.fita(a, b, 0.26, (0, 1 if sy > 0 else -1, 0))
    for x in (-13, 0, 13):
        p.barra((x - 2.2, 0, z), (x, 0, z - 6.4), 0.7, lados=4)
        p.barra((x + 2.2, 0, z), (x, 0, z - 6.4), 0.7, lados=4)
    for s in (-1, 1):
        p.barra((s * 14, 0, z + 2.6), (s * 15, 0, z + 5.5), 0.4)
    for sx in (-1, 1):
        for sy in (-1, 1):
            p.barra((sx * 10.5, 0, z - 1), (sx * 7, sy * 24, 0), 0.22, lados=3)
    return um("torre-ehv", p)


def torre_ehv_lod():
    p = Peca()
    for s in (-1, 1):
        # pernas de 2,6 m e estais de 1,0 m (onda 2, limitações: 1,6 e 0,5 m davam ~1 px a L 28).
        # Leva 2, item 5: a perna afinava para baixo (2,6 no pé, 3,0 no topo) e o V terminava
        # num fio; agora 3,4 m no pé e 2,6 m no topo, seção quadrada
        p.barra((0, 0, 0), (s * 11, 0, 38), 3.4, lados=4, esp_b=2.6)
    p.barra((-16, 0, 39), (16, 0, 39), 2.4, lados=3)
    for sx in (-1, 1):
        for sy in (-1, 1):
            p.barra((sx * 10.5, 0, 37), (sx * 7, sy * 24, 0), 1.0, lados=3)
    return um("torre-ehv-lod", p)


def torre_cc():
    # corrente contínua, ±600/800 kV: fuste autoportante de 48 m com a mísula em T, um polo
    # de cada lado em cadeia em V (estrutura) e os dois picos de para-raios.
    p = Peca()
    niveis = [(0, 5.2), (12, 3.7), (24, 2.7), (36, 2.0), (48, 1.6)]
    corpo_trelica(p, niveis, esp=0.6, diag=0.32)
    for sy in (-1.2, 1.2):
        p.barra((-14, sy, 48), (14, sy, 48), 0.5)
        p.barra((-1.6, sy, 52), (-14, sy, 48), 0.45)
        p.barra((1.6, sy, 52), (14, sy, 48), 0.45)
    p.barra((-1.6, 0, 48), (-1.6, 0, 52), 0.5)
    p.barra((1.6, 0, 48), (1.6, 0, 52), 0.5)
    for s in (-1, 1):
        x = s * 11.5
        p.barra((x - 2.4, 0, 48), (x, 0, 39), 0.75, lados=4)
        p.barra((x + 2.4, 0, 48), (x, 0, 39), 0.75, lados=4)
        p.barra((s * 1.6, 0, 52), (s * 4.5, 0, 58), 0.45)
    return um("torre-cc", p)


def torre_cc_lod():
    p = Peca()
    for sx in (-1, 1):
        for sy in (-1, 1):
            # pernas de 2,6 m (onda 2, limitações); leva 2, item 5: quadradas e afuniladas,
            # 3,4 m no pé e 2,2 m no topo, como a torre-lod
            p.barra((sx * 5, sy * 5, 0), (sx * 1.6, sy * 1.6, 48), 3.4, lados=4, esp_b=2.2)
    p.barra((-14, 0, 48.5), (14, 0, 48.5), 2.4, lados=3)
    for s in (-1, 1):
        p.barra((s * 1.6, 0, 50), (s * 4.5, 0, 58), 1.2, lados=3)
    return um("torre-cc-lod", p)


# ── gás e petróleo (capítulo O combustível: um ponto da camada da ANP, uma maquete) ──


def refinaria():
    # refinaria em MASSA e COMPACTA (a crítica: o desenho de linha fina, espalhado em 190 m,
    # sumia a 80 px e a térmica vizinha pesava mais). Num quadrado de ~130 m: a plataforma de
    # processo, um bloco baixo de onde saem as DUAS colunas de destilação grossas (cada uma
    # com uma cinta em tinta); o craqueamento, bloco alto com o reator; o forno com a chaminé
    # (topo no acento); QUATRO tanques largos juntos; a TOCHA alta em tinta. Sem rack de tubos.
    fonte("oleo")
    p = Peca()
    p.laje(-66, 66, -46, 46)
    p.predio(-60, -4, -40, 2, 12, c=0.6)  # plataforma de processo
    for x, y, r, h in ((-44, -18, 8.0, 72), (-22, -18, 6.4, 56)):
        p.cilindro((x, y, LAJE_H), r, r * 0.9, h, lados=14)
        p.cilindro((x, y, h * 0.62), r + 0.8, r + 0.8, 3.2, lados=14, mat="tinta", tampas=False)
    p.predio(-60, -32, 8, 40, 26, c=0.8)  # craqueamento
    p.cilindro((-46, 24, 26), 7, 7, 16, lados=14)  # reator
    p.predio(-26, -6, 12, 36, 16, c=0.6)  # forno
    p.chamine(-12, 30, 16, 2.8, 2.4, 30, faixa=4, lados=10, topo="acento")
    for x in (22, 50):
        for y in (-22, 22):
            p.tanque(x, y, 13, 16, lados=16, teto="plano")
    # tocha: em papel com o topo no acento, mais grossa e mais baixa (r2: a haste de tinta de
    # 90 m era o traço mais forte da maquete e lia como um risco preto solto no mapa)
    p.chamine(-60, 40, LAJE_H, 3.4, 2.8, 58, faixa=4, lados=10, topo="acento")
    return um("refinaria", p)


def terminal_gnl():
    # terminal de GNL. No Brasil a regaseificação é por navio (FSRU) atracado ao píer — o
    # modelo segue isso: o PÍER e a ponte de acesso em tinta (a assinatura), o navio em papel
    # com os DOIS grandes volumes de tanque sobre o convés e o módulo de regaseificação, e em
    # terra um tanque e a chegada do gasoduto. Mar em +x.
    fonte("gas")
    p = Peca()
    p.laje(-64, -4, -34, 30)
    p.predio(-58, -36, -28, -12, 9, c=0.5)
    p.tanque(-22, 16, 11, 14, lados=14)
    p.bloco(-4, 112, -3.5, 3.5, 9, 10.8, "tinta")  # ponte de acesso
    for x in range(10, 110, 25):
        p.barra((x, 0, 0), (x, 0, 9), 2.2, "papel")
    p.bloco(112, 134, -18, 18, 0, 12, "tinta")  # plataforma de atracação
    casco = [(-140, 0), (130, 0), (146, 8), (150, 24), (-142, 24), (-144, 10)]
    a = [p.bm.verts.new((138, y, z)) for y, z in casco]
    b = [p.bm.verts.new((184, y, z)) for y, z in casco]
    fs = [p.bm.faces.new(a[::-1]), p.bm.faces.new(b)]
    for i in range(len(a)):
        fs.append(p.bm.faces.new((a[i], a[(i + 1) % len(a)], b[(i + 1) % len(a)], b[i])))
    p._marcar(fs, "papel")
    for v in a + b:  # afina a proa
        if v.co.y > 128:
            k = (v.co.y - 128) / 22
            v.co.x = 161 + (v.co.x - 161) * (1 - 0.8 * k)
    p.predio(146, 176, -136, -112, 46, c=0.8)  # superestrutura
    for y0, y1 in ((-104, -14), (2, 104)):  # os dois tanques de carga
        p.predio(146, 176, y0, y1, 36, c=2.4)
    p.predio(150, 168, -10, -2, 44, c=0.4, mat="acento")  # módulo de regaseificação
    return um("terminal-gnl", p)


def upgn():
    # unidade de processamento de gás natural, em massa e compacta (~75 m): DUAS colunas de
    # fracionamento grossas, as duas ESFERAS de GLP (a assinatura, uma com a cinta no
    # acento), o galpão dos compressores e a TOCHA alta em tinta. Sem rack de tubos.
    fonte("gas")
    p = Peca()
    p.laje(-38, 34, -32, 30)
    p.galpao(-34, -4, -28, -8, 12, 3, ao_longo="x")  # compressores
    for x, r, h in ((-24, 5.0, 46), (-9, 4.0, 36)):
        p.cilindro((x, 10, LAJE_H), r, r, h, lados=12)
        p.cilindro((x, 10, h * 0.62), r + 0.6, r + 0.6, 2.6, lados=12, mat="tinta", tampas=False)
    for k, y in enumerate((-14, 14)):  # esferas de GLP
        p.esfera((20, y, 14), 11.5, lados=14, aneis=8)
        p.cilindro((20, y, 3), 6, 6, 4, lados=10)  # saia
        p.cilindro((20, y, 13.2), 11.7, 11.7, 1.6, lados=14, mat="acento" if k == 0 else "tinta", tampas=False)
    p.chamine(-32, 22, 0, 2.8, 2.3, 44, faixa=3.5, lados=10, topo="acento")  # tocha, em papel (como na refinaria)
    return um("upgn", p)


def terminal_liquidos():
    # terminal de granéis líquidos: só os TANQUES cilíndricos em grade, sobre a laje (a bacia
    # de contenção), com a faixa do topo em tinta; um deles com o acento.
    fonte("oleo")
    p = Peca()
    p.laje(-66, 66, -46, 46)
    for i, x in enumerate((-44, 0, 44)):
        for j, y in enumerate((-22, 22)):
            p.tanque(x, y, 16, 22, lados=16, teto="cone" if j == 0 else "plano")
    p.cilindro((44, -22, 12), 16.12, 16.12, 2.0, lados=16, mat="acento", tampas=False)
    return um("terminal-liquidos", p)


# ── execução ─────────────────────────────────────────────────────────

MODELOS = [
    aerogerador,
    hidreletrica,
    hidreletrica_grande,
    pch,
    solar,
    nuclear,
    termica_gas,
    termica_carvao,
    biomassa_cana,
    biomassa,
    termica_motores,
    termeletrica,
    biogas,
    alto_forno,
    subestacao_pequena,
    subestacao,
    subestacao_grande,
    subestacao_no,
    conversora,
    torre,
    torre_lod,
    torre_ehv,
    torre_ehv_lod,
    torre_cc,
    torre_cc_lod,
    refinaria,
    terminal_gnl,
    upgn,
    terminal_liquidos,
]

if SO:
    MODELOS = [f for f in MODELOS if f.__name__ == SO.replace("-", "_")]

caminho_json = os.path.join(SAIDA, "modelos.json")
anteriores = {}
if SO and os.path.exists(caminho_json):
    with open(caminho_json, encoding="utf-8") as f:
        anteriores = {m["arquivo"]: m for m in json.load(f)["modelos"]}

resumo = []
for fazer in MODELOS:
    limpar()
    info, _ = fazer()
    resumo.append(info)
    print("MODELO", info)

# remove os GLB da geração anterior que não existem mais
if not SO:
    vivos = {m["arquivo"] for m in resumo}
    for nome in os.listdir(SAIDA):
        if nome.endswith(".glb") and nome not in vivos:
            os.remove(os.path.join(SAIDA, nome))
            print("REMOVIDO", nome)
else:
    for m in resumo:
        anteriores[m["arquivo"]] = m
    resumo = list(anteriores.values())

with open(caminho_json, "w", encoding="utf-8") as f:
    json.dump(
        {
            "nota": "Maquetes esquemáticas por tipo de instalação; geradas por tools/alexandria-atlas/modelos/gerar_modelos.py (Blender %s). dimensao = maior medida do modelo, em metros." % bpy.app.version_string,
            "modelos": resumo,
        },
        f,
        ensure_ascii=False,
        indent=2,
    )


# ── fotos para a prancha ─────────────────────────────────────────────


def fotografar(fazer):
    """Uma foto por modelo, fundo transparente, sombra só onde cai no chão (a prancha
    é montada por montar-folha.mjs, com os nomes e as escalas)."""
    limpar()
    info, obs = fazer()
    for o in obs:
        for pol in o.data.polygons:
            pol.use_smooth = False
    cena = bpy.context.scene
    bpy.context.view_layer.update()
    pts = [o.matrix_world @ Vector(c) for o in obs for c in o.bound_box]
    centro = sum(pts, Vector()) / len(pts)
    direcao = Vector((0.55, -1.0, 0.72)).normalized()
    cam_d = bpy.data.cameras.new("cam")
    cam_d.type = "ORTHO"
    cam_d.clip_end = 20000
    cam = bpy.data.objects.new("cam", cam_d)
    cena.collection.objects.link(cam)
    rot = (-direcao).to_track_quat("-Z", "Y")
    cam.rotation_euler = rot.to_euler()
    R = rot.to_matrix()
    dir_x, dir_y = R @ Vector((1, 0, 0)), R @ Vector((0, 1, 0))
    us = [q.dot(dir_x) for q in pts]
    vs = [q.dot(dir_y) for q in pts]
    larg = max(us) - min(us)
    alt = max(vs) - min(vs)
    res_x, res_y = 900, 640
    escala = max(larg, alt * res_x / res_y) * 1.14
    cam_d.ortho_scale = escala
    alvo = dir_x * ((max(us) + min(us)) / 2) + dir_y * ((max(vs) + min(vs)) / 2) + direcao * centro.dot(direcao)
    cam.location = alvo + direcao * 5000
    cena.camera = cam
    bpy.ops.mesh.primitive_plane_add(size=20000, location=(0, 0, -0.02))
    chao = bpy.context.object
    chao.is_shadow_catcher = True
    sol_d = bpy.data.lights.new("sol", "SUN")
    sol_d.energy = 1.25
    sol_d.angle = math.radians(6)
    sol = bpy.data.objects.new("sol", sol_d)
    cena.collection.objects.link(sol)
    sol.rotation_euler = (math.radians(48), 0, math.radians(-34))
    mundo = bpy.data.worlds.new("mundo")
    mundo.use_nodes = True
    mundo.node_tree.nodes["Background"].inputs[0].default_value = (0.96, 0.93, 0.87, 1)
    mundo.node_tree.nodes["Background"].inputs[1].default_value = 0.42
    cena.world = mundo
    cena.render.engine = "CYCLES"
    cena.cycles.samples = 48
    cena.cycles.device = "CPU"
    cena.cycles.use_denoising = True
    cena.render.film_transparent = True
    cena.render.resolution_x = res_x
    cena.render.resolution_y = res_y
    cena.render.image_settings.file_format = "PNG"
    cena.render.image_settings.color_mode = "RGBA"
    cena.view_settings.view_transform = "Standard"
    nome = info["arquivo"].replace(".glb", "")
    cena.render.filepath = os.path.join(FOTOS, nome + ".png")
    bpy.ops.render.render(write_still=True)
    # metros por pixel da foto: a prancha desenha a régua de escala com isto
    return {"nome": nome, "metrosPorPixel": escala / res_x}


if FOLHA:
    os.makedirs(FOTOS, exist_ok=True)
    escalas = {}
    caminho_esc = os.path.join(FOTOS, "escalas.json")
    if SO and os.path.exists(caminho_esc):
        with open(caminho_esc, encoding="utf-8") as f:
            escalas = json.load(f)
    for fazer in MODELOS:
        r = fotografar(fazer)
        escalas[r["nome"]] = r["metrosPorPixel"]
        print("FOTO", r)
    with open(caminho_esc, "w", encoding="utf-8") as f:
        json.dump(escalas, f, indent=2)
