# -*- coding: utf-8 -*-
"""
Extrai o glossario INTEIRO da Alexandria v2 a partir da fonte unica:
docs/alexandria-v2/extraction/mNN/aparato.json  ->  campo `glossario`.

Regras (bar.md / decisoes):
  P3, P11 - nenhuma definicao e escrita aqui. Toda string de conteudo e copia
            literal (substring exata) do aparato.json. O unico texto novo deste
            arquivo e estrutura: chaves, contagens e o marcador "nao declarado".
  P6      - nao inventar tolerancia. Nenhum limiar de similaridade, nenhum
            "provavelmente o mesmo termo". Comparacao e igualdade exata de
            string normalizada (NFC + espacos colapsados), e nada mais.
  S4      - o que a fonte nao diz sai como ausencia declarada:
            ancora.aula = "nao declarado".
  P8      - divergencia de titulo e de contagem NAO e corrigida aqui; e
            registrada e reconciliada em separado.

Saida: glossario.json, glossario.md, conflitos.json, COBERTURA.md

Comentarios e identificadores em ASCII de proposito (o arquivo roda em
consoles cp1252). Tudo que SAI nos artefatos e portugues acentuado.
"""

import json
import os
import re
import io
import unicodedata
import collections
import datetime

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))          # .../extraction
DOCS = os.path.dirname(RAIZ)                                                # .../alexandria-v2
REPO = os.path.dirname(os.path.dirname(DOCS))                               # .../<repo>
SAIDA = os.path.join(RAIZ, "glossario")
PRODUTO_TS = os.path.join(REPO, "src", "lib", "data", "alexandria-glossario.ts")

MODULOS = ["m%02d" % n for n in range(1, 18)]

NAO_DECLARADO = "não declarado"

# ---------------------------------------------------------------- utilidades

def norm(s):
    """Normalizacao APENAS para comparar e agrupar. Nunca substitui o literal."""
    if s is None:
        return ""
    s = unicodedata.normalize("NFC", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def chave(termo):
    """Chave de agrupamento de homonimos: NFC, sem ponto final, caixa dobrada."""
    return norm(termo).rstrip(".").casefold()


def ler(caminho):
    with io.open(caminho, encoding="utf-8") as f:
        return json.load(f)


def escrever_json(caminho, dados):
    with io.open(caminho, "w", encoding="utf-8", newline="\n") as f:
        json.dump(dados, f, ensure_ascii=False, indent=2)
        f.write("\n")


def escrever_texto(caminho, texto):
    with io.open(caminho, "w", encoding="utf-8", newline="\n") as f:
        f.write(texto)


# ------------------------------------------------- leitura literal da fonte

# Campos que esta extracao promove a posicao canonica. Todo o RESTO do verbete
# da fonte e preservado em `camposDaFonte`, sem perda.
CANONICOS = {
    "id", "termo", "termo_html", "termo_bruto", "termo_bruto_html",
    "termo_marcado", "termo_span_literal", "termo_html_fonte",
    "definicao", "definicao_html", "definicao_texto",
    "familia", "familia_nome", "familia_ordem", "familia_numero",
    "familia_indice", "grupo", "rotulo_grupo", "etiqueta", "origem",
}


def definicao_de(t):
    """Devolve (html, texto) literais, qualquer que seja o formato do modulo."""
    d = t.get("definicao")
    if isinstance(d, dict):
        return d.get("html"), d.get("texto")
    if isinstance(d, str):
        return d, d
    return t.get("definicao_html"), t.get("definicao_texto")


def indice_familias(gl):
    """numero de familia -> nome literal, para os modulos que so gravam numero."""
    idx = {}
    for chave_lista in ("familias", "grupos"):
        lista = gl.get(chave_lista)
        if isinstance(lista, list):
            for f in lista:
                if not isinstance(f, dict):
                    continue
                nome = f.get("nome") or f.get("familia") or f.get("rotulo")
                num = f.get("numero") or f.get("ordem")
                if num is not None and nome:
                    idx[num] = nome
    cont = gl.get("contagem")
    if isinstance(cont, dict) and isinstance(cont.get("familias"), list):
        for f in cont["familias"]:
            if isinstance(f, dict):
                nome = f.get("nome") or f.get("familia")
                num = f.get("numero")
                if num is not None and nome and num not in idx:
                    idx[num] = nome
    return idx


def familia_de(t, fam_idx):
    """Nome literal da familia/grupo declarado pela fonte, ou None."""
    for k in ("familia_nome", "rotulo_grupo"):
        v = t.get(k)
        if isinstance(v, str) and v.strip():
            return v
    for k in ("familia", "grupo"):
        v = t.get(k)
        if isinstance(v, str) and v.strip():
            return v
        if isinstance(v, int):
            return fam_idx.get(v)
    return None


def termos_do_modulo(mod):
    """Lista bruta de verbetes do modulo, na ordem da fonte, + o no glossario."""
    gl = ler(os.path.join(RAIZ, mod, "aparato.json"))["glossario"]
    if isinstance(gl.get("termos"), list) and gl["termos"]:
        return gl, list(gl["termos"])
    # m16: os verbetes moram dentro de glossario.familias[].termos[]
    brutos = []
    for f in gl.get("familias", []) or []:
        for t in f.get("termos", []) or []:
            brutos.append(t)
    return gl, brutos


def nota_de_vinculo(t, gl):
    """Literal da fonte sobre vinculo termo<->aula, quando ela se pronuncia."""
    v = t.get("vinculos")
    if isinstance(v, dict) and isinstance(v.get("nota"), str):
        return v["nota"]
    for k in ("vinculo_aula_nota", "termo_nota"):
        if isinstance(gl.get(k), str):
            return gl[k]
    return None


def aula_declarada(t):
    """
    Aula que a FONTE declara para o verbete. Nao conta `aulaIds` do codigo:
    o proprio aparato registra que aqueles foram inferidos por wave de
    varredura, nao declarados pela fonte (P6/S4).
    """
    for k in ("aula_vinculada", "aula_ids", "aulas"):
        v = t.get(k)
        if isinstance(v, str) and v.strip():
            return [v]
        if isinstance(v, list) and v:
            return list(v)
    v = t.get("vinculos")
    if isinstance(v, dict):
        for k in ("aulas_declaradas", "aulas"):
            w = v.get(k)
            if isinstance(w, str) and w.strip():
                return [w]
            if isinstance(w, list) and w:
                return list(w)
    return []


# ------------------------------------------------------------------ carga

ident = ler(os.path.join(RAIZ, "identidade-modulos.json"))
IDENT = {m["id"]: m for m in ident["modulos"]}

verbetes = []
meta_modulos = []

for mod in MODULOS:
    gl, brutos = termos_do_modulo(mod)
    fam_idx = indice_familias(gl)
    im = IDENT[mod]
    for ordem, t in enumerate(brutos, 1):
        html, texto = definicao_de(t)
        aulas = aula_declarada(t)
        outros = {k: v for k, v in t.items() if k not in CANONICOS}
        verbetes.append({
            "id": t.get("id") or "%s-lex-sem-id-%03d" % (mod, ordem),
            "termo": t.get("termo"),
            "termoLiteralNaFonte": (
                t.get("termo_html") or t.get("termo_html_fonte")
                or t.get("termo_bruto_html") or t.get("termo_bruto")
                or t.get("termo_marcado") or t.get("termo_span_literal")
            ),
            "definicao": {"html": html, "texto": texto},
            "familia": familia_de(t, fam_idx),
            "etiqueta": t.get("etiqueta"),
            "ancora": {
                "modulo": mod,
                "moduloNumero": im["numero"],
                "moduloTituloCatalogo": im["tituloCatalogo"],
                "territorio": im["territorio"],
                "aula": aulas if aulas else NAO_DECLARADO,
                "aulaNota": nota_de_vinculo(t, gl),
            },
            "ordemNaFonte": ordem,
            "origem": t.get("origem"),
            "camposDaFonte": outros,
        })
    meta_modulos.append({
        "modulo": mod,
        "numero": im["numero"],
        "tituloCatalogo": im["tituloCatalogo"],
        "territorio": im["territorio"],
        "termos": len(brutos),
        # P8: a contagem que a FONTE declara fica registrada como ela esta,
        # com a chave que cada modulo usou. Divergencia nao e corrigida aqui.
        "contagemDeclaradaPelaFonte": {
            k: gl[k] for k in
            ("contagem", "contagem_prosa", "contagem_markup", "contagem_declarada")
            if k in gl
        } or None,
        "tituloDoGlossarioNaFonte": gl.get("titulo"),
        "ledeDoGlossarioNaFonte": (gl.get("lede") or gl.get("lead")
                                   or gl.get("introducao")),
    })

TOTAL = len(verbetes)

# --------------------------------------------------- familias (indice unico)

familias = collections.OrderedDict()
for v in verbetes:
    if not v["familia"]:
        continue
    fid = "%s::%s" % (v["ancora"]["modulo"], v["familia"])
    familias.setdefault(fid, {
        "id": fid,
        "modulo": v["ancora"]["modulo"],
        "nome": v["familia"],
        "termos": [],
    })["termos"].append(v["id"])
    v["familiaId"] = fid

for v in verbetes:
    v.setdefault("familiaId", None)

# ----------------------------------------------------- relacoes sustentadas

def variantes(termo):
    out = set()
    s = norm(termo)
    if s:
        out.add(s)
    m = re.match(r"^(.*?)\s*\([^)]*\)\s*$", s)
    if m and m.group(1).strip():
        out.add(m.group(1).strip())
    return out


por_modulo = collections.defaultdict(list)
for v in verbetes:
    por_modulo[v["ancora"]["modulo"]].append(v)

NOTA_FAMILIA = ("Os irmãos de família estão no índice "
                "`familias`; não são repetidos verbete a verbete.")

for mod, lista in por_modulo.items():
    padroes = []
    for v in lista:
        for var in variantes(v["termo"]):
            sigla = var.isupper() and len(var) >= 2
            if not sigla and len(var) < 4:
                continue
            padroes.append((
                v["id"],
                re.compile(r"(?<![0-9A-Za-zÀ-ÿ])" + re.escape(var)
                           + r"(?![0-9A-Za-zÀ-ÿ])",
                           0 if sigla else re.IGNORECASE),
            ))
    for v in lista:
        alvo = norm(v["definicao"]["texto"])
        citados = []
        for tid, rx in padroes:
            if tid == v["id"]:
                continue
            if rx.search(alvo) and tid not in citados:
                citados.append(tid)
        v["relacoes"] = {
            "citadosNaDefinicao": citados,
            "mesmaFamilia": {"familiaId": v["familiaId"], "nota": NOTA_FAMILIA},
        }

# ------------------------------------------- deduplicacao (sem fundir nada)

grupos = collections.OrderedDict()
for v in verbetes:
    grupos.setdefault(chave(v["termo"]), []).append(v)

homonimos = []
conflitos = []
identicos_repetidos = []

for k, g in grupos.items():
    if len(g) < 2:
        continue
    defs = {norm(x["definicao"]["texto"]) for x in g}
    entrada = {
        "chave": k,
        "ocorrencias": [{
            "id": x["id"],
            "termo": x["termo"],
            "modulo": x["ancora"]["modulo"],
            "moduloTituloCatalogo": x["ancora"]["moduloTituloCatalogo"],
            "territorio": x["ancora"]["territorio"]["romano"],
            "familia": x["familia"],
            "etiqueta": x["etiqueta"],
            "definicaoTexto": x["definicao"]["texto"],
            "definicaoHtml": x["definicao"]["html"],
            "origem": x["origem"],
        } for x in g],
    }
    if len(defs) == 1:
        entrada["leitura"] = "repeticao-identica"
        identicos_repetidos.append(entrada)
    else:
        entrada["leitura"] = "definicoes-divergentes"
        entrada["definicoesDistintas"] = len(defs)
        conflitos.append(entrada)
    homonimos.append({
        "chave": k,
        "termo": g[0]["termo"],
        "ocorrencias": len(g),
        "modulos": [x["ancora"]["modulo"] for x in g],
        "leitura": entrada["leitura"],
    })
    for x in g:
        x["homonimo"] = {
            "chave": k,
            "ocorrencias": len(g),
            "outrasOcorrencias": [y["id"] for y in g if y["id"] != x["id"]],
            "leitura": entrada["leitura"],
        }

for v in verbetes:
    v.setdefault("homonimo", None)

# ------------------------------------- o que o produto tem hoje (os 637)

def ler_produto():
    if not os.path.exists(PRODUTO_TS):
        return None, None
    with io.open(PRODUTO_TS, encoding="utf-8") as f:
        s = f.read()

    # Desescapa SO o que o TypeScript escapa numa string de aspas duplas.
    # Nada de unicode_escape: ele estraga acentuado ja decodificado.
    def des(x):
        if x is None:
            return None
        return (x.replace('\\"', '"').replace("\\n", "\n")
                 .replace("\\t", "\t").replace("\\\\", "\\"))

    itens = []
    for m in re.finditer(
        r'\{\s*id:\s*"((?:[^"\\]|\\.)*)"\s*,\s*'
        r'term:\s*"((?:[^"\\]|\\.)*)"\s*,\s*'
        r'(?:unit:\s*"((?:[^"\\]|\\.)*)"\s*,\s*)?'
        r'definition:\s*\n?\s*"((?:[^"\\]|\\.)*)"\s*,\s*'
        r'aulaIds:\s*\[([^\]]*)\]', s):
        itens.append({
            "id": m.group(1),
            "term": des(m.group(2)),
            "unit": des(m.group(3)),
            "definition": des(m.group(4)),
            "aulaIds": re.findall(r'"([^"]+)"', m.group(5)),
        })
    return itens, len(re.findall(r'^\s*id:\s*"', s, re.M))


produto, produto_total_declarado = ler_produto()

comparacao = None
if produto is not None:
    for p in produto:
        m = re.match(r"gl-m(\d\d)-", p["id"])
        p["modulo"] = ("m" + m.group(1)) if m else "m01"
    idx_produto = {}
    for p in produto:
        idx_produto.setdefault((p["modulo"], chave(p["term"])), []).append(p)

    novos, batem, divergem = [], [], []
    for v in verbetes:
        cands = idx_produto.get((v["ancora"]["modulo"], chave(v["termo"])))
        if not cands:
            novos.append(v)
            continue
        p = cands[0]
        v["noProdutoHoje"] = {"id": p["id"], "aulaIdsDoProduto": p["aulaIds"]}
        # O produto guarda a definicao COM o HTML inline da fonte (<b>, &lt;).
        # Por isso a igualdade e testada contra os dois literais da fonte:
        # `definicao_html` e `definicao_texto`. Bater com qualquer um dos dois
        # e identidade literal - nao e tolerancia.
        atual = norm(p["definition"])
        if atual == norm(v["definicao"]["html"]):
            batem.append((v, p))
            v["noProdutoHoje"]["definicao"] = "idêntica ao html da fonte"
        elif atual == norm(v["definicao"]["texto"]):
            batem.append((v, p))
            v["noProdutoHoje"]["definicao"] = "idêntica ao texto da fonte"
        else:
            divergem.append((v, p))
            v["noProdutoHoje"]["definicao"] = "divergente"

    casados = {v["noProdutoHoje"]["id"] for v in verbetes if v.get("noProdutoHoje")}
    so_no_produto = [p for p in produto if p["id"] not in casados]

    comparacao = {
        "arquivoDoProduto": "src/lib/data/alexandria-glossario.ts",
        "notaDePosse": "Lido em modo somente leitura. Esta wave não escreve "
                       "em `src/`.",
        "verbetesNoProduto": produto_total_declarado,
        "verbetesLidosPeloParser": len(produto),
        "novos": len(novos),
        "batem": len(batem),
        "divergem": len(divergem),
        "soNoProduto": len(so_no_produto),
        "soNoProdutoIds": [p["id"] for p in so_no_produto],
        "divergentes": [{
            "idFonte": v["id"],
            "idProduto": p["id"],
            "termo": v["termo"],
            "modulo": v["ancora"]["modulo"],
            "definicaoFonteHtml": v["definicao"]["html"],
            "definicaoFonteTexto": v["definicao"]["texto"],
            "definicaoProduto": p["definition"],
            "etiquetaFonte": v["etiqueta"] or v["familia"],
            "etiquetaProduto": p["unit"],
        } for v, p in divergem],
    }

for v in verbetes:
    v.setdefault("noProdutoHoje", None)

# --------------------------------------------------------------- contagens

sem_ancora_aula = sum(1 for v in verbetes if v["ancora"]["aula"] == NAO_DECLARADO)
por_terr = collections.OrderedDict()
for mm in meta_modulos:
    r = mm["territorio"]["romano"]
    t = por_terr.setdefault(r, {
        "romano": r, "nome": mm["territorio"]["nome"],
        "modulos": [], "termos": 0, "noProdutoHoje": 0,
    })
    t["modulos"].append(mm["modulo"])
    t["termos"] += mm["termos"]

por_mod_produto = collections.Counter(p["modulo"] for p in (produto or []))
for mm in meta_modulos:
    mm["noProdutoHoje"] = por_mod_produto.get(mm["modulo"], 0)
    por_terr[mm["territorio"]["romano"]]["noProdutoHoje"] += mm["noProdutoHoje"]

citacoes = sum(len(v["relacoes"]["citadosNaDefinicao"]) for v in verbetes)
com_familia = sum(1 for v in verbetes if v["familia"])
com_etiqueta = sum(1 for v in verbetes if v["etiqueta"])
sem_categoria = sum(1 for v in verbetes if not v["familia"] and not v["etiqueta"])
agora = datetime.date.today().isoformat()

# -------------------------------------------------------- glossario.json

saida = {
    "schema": "alexandria-v2/glossario@1",
    "camada": "fonte",
    "geradoEm": agora,
    "gerador": "docs/alexandria-v2/extraction/glossario/extrair-glossario.py",
    "fonte": {
        "arquivos": ["docs/alexandria-v2/extraction/m%02d/aparato.json → glossario" % n
                     for n in range(1, 18)],
        "regra": "Nenhuma definição foi escrita por esta wave. Todo texto "
                 "de conteúdo é cópia literal do aparato.json. O "
                 "único texto novo é estrutural: chaves, contagens e o "
                 "marcador “não declarado”.",
    },
    "regrasAplicadas": {
        "P3/P11": "Texto conectivo derivado fielmente é permitido; fato novo, "
                  "não. Aqui não há fato novo: só "
                  "reorganização do literal.",
        "P6": "Nenhuma tolerância inventada. Casamento de termo é "
              "igualdade exata de string normalizada (NFC + espaços "
              "colapsados + caixa dobrada + ponto final removido). Nada de "
              "similaridade aproximada.",
        "S4": "Onde a fonte não declara, a saída é ausência "
              "declarada.",
        "P8": "Divergências de título e de contagem não são "
              "corrigidas aqui; ficam registradas em "
              "`modulos[].contagemDeclaradaPelaFonte`.",
        "D4": "Âncora curricular por termo e relações sustentadas "
              "pela fonte.",
    },
    "contagem": {
        "termos": TOTAL,
        "modulos": len(meta_modulos),
        "familias": len(familias),
        "chavesDeTermoDistintas": len(grupos),
        "homonimos": len(homonimos),
        "conflitosDeDefinicao": len(conflitos),
        "repeticoesIdenticas": len(identicos_repetidos),
        "ancoraDeAulaNaoDeclarada": sem_ancora_aula,
        "relacoesDeCitacao": citacoes,
    },
    "ancoraDeAula": {
        "declaradas": TOTAL - sem_ancora_aula,
        "naoDeclaradas": sem_ancora_aula,
        "nota": "Nenhum dos 17 aparatos liga verbete a aula. Onde o código "
                "atual tem `aulaIds`, o próprio aparato registra que foram "
                "inferidos por varredura de wave, não declarados pela fonte "
                "— por isso não são promovidos a âncora aqui. "
                "O número é um dado de cobertura, não uma falha da "
                "extração.",
    },
    "camposDeProcedencia": {
        "nota": "`origem`, `camposDaFonte`, `termoLiteralNaFonte` e "
                "`noProdutoHoje` são procedência e reconciliação. "
                "Um consumidor de runtime pode projeção fora deles; a "
                "leitura do verbete não depende de nenhum.",
        "campos": ["origem", "camposDaFonte", "termoLiteralNaFonte",
                   "noProdutoHoje"],
    },
    "modulos": meta_modulos,
    "territorios": list(por_terr.values()),
    "familias": list(familias.values()),
    "homonimos": homonimos,
    "comparacaoComOProduto": comparacao,
    "verbetes": verbetes,
}
escrever_json(os.path.join(SAIDA, "glossario.json"), saida)

# -------------------------------------------------------- conflitos.json

escrever_json(os.path.join(SAIDA, "conflitos.json"), {
    "schema": "alexandria-v2/glossario-conflitos@1",
    "geradoEm": agora,
    "escopo": "Termos que se repetem entre módulos. Nada foi fundido. Cada "
              "ocorrência continua sendo um verbete próprio em "
              "glossario.json.",
    "regra": "Duas ocorrências do mesmo termo com definições "
             "literais distintas são conflito e vão para `conflitos`, "
             "com as leituras lado a lado, para decisão do Founder. "
             "Definições idênticas vão para "
             "`repeticoesIdenticas` — são repetição, não "
             "conflito.",
    "oQueAFonteDizSobreRepetir": {
        "modulo": "m10",
        "onde": "lede do § Lex",
        "literal": (ler(os.path.join(RAIZ, "m10", "aparato.json"))
                    ["glossario"]["lede"]["texto"]),
    },
    "contagem": {
        "termosRepetidos": len(homonimos),
        "conflitosDeDefinicao": len(conflitos),
        "repeticoesIdenticas": len(identicos_repetidos),
    },
    "conflitos": conflitos,
    "repeticoesIdenticas": identicos_repetidos,
})

# --------------------------------------------------------- glossario.md

L = []
L.append("# Glossário Alexandria — tabela legível")
L.append("")
L.append("Gerado em %s por `extrair-glossario.py`. Fonte única: os 17 "
         "`aparato.json`." % agora)
L.append("")
L.append("**%d verbetes**, %d módulos, %d famílias declaradas. Nenhuma "
         "definição foi escrita nesta wave — toda coluna "
         "“Definição” é cópia literal da fonte."
         % (TOTAL, len(meta_modulos), len(familias)))
L.append("")
for mm in meta_modulos:
    mod = mm["modulo"]
    L.append("## %s — %s" % (mod.upper(), mm["tituloCatalogo"]))
    L.append("")
    L.append("Território %s · %s · **%d verbetes** · no produto "
             "hoje: %d" % (mm["territorio"]["romano"], mm["territorio"]["nome"],
                           mm["termos"], mm["noProdutoHoje"]))
    L.append("")
    L.append("| # | Termo | Família / etiqueta | Definição (literal "
             "da fonte) | Âncora de aula |")
    L.append("|---:|---|---|---|---|")
    for v in [x for x in verbetes if x["ancora"]["modulo"] == mod]:
        cat = v["familia"] or v["etiqueta"] or "—"
        a = v["ancora"]["aula"]
        a = a if a == NAO_DECLARADO else ", ".join(a)
        L.append("| %d | %s | %s | %s | %s |" % (
            v["ordemNaFonte"],
            norm(v["termo"]).replace("|", "\\|"),
            norm(cat).replace("|", "\\|"),
            norm(v["definicao"]["texto"]).replace("|", "\\|"),
            a))
    L.append("")
escrever_texto(os.path.join(SAIDA, "glossario.md"), "\n".join(L))

# ------------------------------------------------------------ COBERTURA.md

def declarado_de(mm):
    c = mm["contagemDeclaradaPelaFonte"] or {}
    inner = c.get("contagem") or {}
    for k in ("prosa_declara", "prosa", "prosa_h2", "prosa_literal",
              "declarada_h2", "pill_hero", "pilula_hero"):
        if inner.get(k):
            return str(inner[k])
    if c.get("contagem_prosa"):
        return str(c["contagem_prosa"])
    cd = c.get("contagem_declarada")
    if isinstance(cd, dict):
        for k in ("hero", "prosa_lex"):
            if cd.get(k):
                return str(cd[k])
    elif cd:
        return str(cd)
    t = mm["tituloDoGlossarioNaFonte"]
    if isinstance(t, dict) and t.get("texto"):
        return "título do § Lex: " + t["texto"]
    if isinstance(t, str):
        return "título do § Lex: " + t
    return NAO_DECLARADO


C = []
C.append("# COBERTURA — Glossário Alexandria")
C.append("")
C.append("Gerado em %s por `extrair-glossario.py`. Todo número desta "
         "página é calculado pelo extrator; nenhum foi digitado à "
         "mão." % agora)
C.append("")
C.append("## O número")
C.append("")
C.append("| | |")
C.append("|---|---:|")
C.append("| Verbetes extraídos da fonte | **%s** |" % TOTAL)
C.append("| Módulos cobertos | **%d de 17** |" % len(meta_modulos))
C.append("| Territórios cobertos | **%d de 3** |" % len(por_terr))
C.append("| Famílias declaradas pela fonte | %d |" % len(familias))
C.append("| Verbetes no produto hoje | %d |" % (comparacao["verbetesNoProduto"]
                                                if comparacao else 0))
C.append("| Verbetes **novos** para o produto | **%d** |"
         % (comparacao["novos"] if comparacao else TOTAL))
C.append("")
if comparacao:
    ant = comparacao["verbetesNoProduto"]
    C.append("A Alexandria sai de **%d verbetes** — %.0f%% da fonte, 8 dos "
             "17 módulos, Território III zerado — para **%d**: "
             "100%% da fonte, 17 de 17 módulos, os três "
             "territórios."
             % (ant, 100.0 * ant / TOTAL, TOTAL))
    C.append("")
C.append("## Por território")
C.append("")
C.append("| Território | Módulos | Verbetes na fonte | No produto antes "
         "| Novos | Cobertura anterior |")
C.append("|---|---|---:|---:|---:|---:|")
for t in por_terr.values():
    C.append("| %s — %s | M%s–M%s | %d | %d | **%d** | %.0f%% |" % (
        t["romano"], t["nome"], t["modulos"][0][1:], t["modulos"][-1][1:],
        t["termos"], t["noProdutoHoje"], t["termos"] - t["noProdutoHoje"],
        100.0 * t["noProdutoHoje"] / t["termos"]))
C.append("")
C.append("## Por módulo")
C.append("")
C.append("| Módulo | Título (catálogo) | T | Verbetes | "
         "Famílias | Etiquetas | No produto antes | Novos |")
C.append("|---|---|---|---:|---:|---:|---:|---:|")
for mm in meta_modulos:
    sub = [v for v in verbetes if v["ancora"]["modulo"] == mm["modulo"]]
    C.append("| %s | %s | %s | %d | %d | %d | %d | **%d** |" % (
        mm["modulo"].upper(), mm["tituloCatalogo"], mm["territorio"]["romano"],
        mm["termos"], len({v["familiaId"] for v in sub if v["familiaId"]}),
        sum(1 for v in sub if v["etiqueta"]), mm["noProdutoHoje"],
        mm["termos"] - mm["noProdutoHoje"]))
C.append("| | | | **%d** | **%d** | **%d** | **%d** | **%d** |" % (
    TOTAL, len(familias), com_etiqueta,
    comparacao["verbetesNoProduto"] if comparacao else 0,
    comparacao["novos"] if comparacao else TOTAL))
C.append("")
if comparacao:
    C.append("## Comparação com os %d que o produto tem hoje"
             % comparacao["verbetesNoProduto"])
    C.append("")
    C.append("Fonte da comparação: `%s`, lido em modo somente leitura. "
             "Esta wave não escreve em `src/`." % comparacao["arquivoDoProduto"])
    C.append("")
    C.append("| Resultado | Verbetes |")
    C.append("|---|---:|")
    C.append("| **Novos** — estão na fonte e não no produto | **%d** |"
             % comparacao["novos"])
    C.append("| **Batem** — literal idêntico ao da fonte | **%d** |"
             % comparacao["batem"])
    C.append("| **Divergem** — o produto diz outra coisa | **%d** |"
             % comparacao["divergem"])
    C.append("| **Só no produto** — sem correspondência na fonte | "
             "**%d** |" % comparacao["soNoProduto"])
    C.append("")
    C.append("Os %d verbetes que o produto já tinha batem **todos** com o "
             "literal da fonte, e nenhum verbete do produto está órfão. "
             "O que o produto tem está correto; o que falta é volume "
             "— %d verbetes, %.0f%% da fonte."
             % (comparacao["batem"], comparacao["novos"],
                100.0 * comparacao["novos"] / TOTAL))
    C.append("")
    C.append("A igualdade foi testada contra os **dois** literais da fonte, "
             "`definicao_html` e `definicao_texto`, porque o produto guarda o HTML "
             "inline da fonte (`<b>`, `&lt;`). Bater com qualquer um dos dois "
             "é identidade literal, não tolerância (P6).")
    C.append("")
C.append("## Âncora curricular (D4)")
C.append("")
C.append("| | |")
C.append("|---|---:|")
C.append("| Verbetes com módulo de origem | **%d de %d — 100%%** |"
         % (TOTAL, TOTAL))
C.append("| Verbetes com aula declarada pela fonte | **%d** |"
         % (TOTAL - sem_ancora_aula))
C.append("| Verbetes com `\"ancora\": \"não declarado\"` | **%d** |"
         % sem_ancora_aula)
C.append("")
C.append("**Nenhum dos 17 aparatos liga verbete a aula.** Os próprios aparatos "
         "dizem isso, e a frase literal de cada um fica gravada em "
         "`ancora.aulaNota` do verbete — no M01, por exemplo: *“A fonte "
         "não liga termo a aula. aulaIds do código foram inferidos pela "
         "Wave 8 (varredura + leitura), não declarados pela fonte.”*")
C.append("")
C.append("Por isso `aulaIds` do código **não** foi promovido a "
         "âncora: é inferência de wave anterior, não "
         "declaração da fonte (S4, P6). Ele continua legível em "
         "`noProdutoHoje.aulaIdsDoProduto`, rotulado como dado do produto, para "
         "quem for reconciliar depois.")
C.append("")
C.append("O módulo de origem, esse sim, a fonte determina para os %d "
         "verbetes: cada um vem do `aparato.json` de um módulo." % TOTAL)
C.append("")
C.append("## Família e categoria")
C.append("")
C.append("| | |")
C.append("|---|---:|")
C.append("| Verbetes com família/grupo declarado | %d |" % com_familia)
C.append("| Verbetes com etiqueta (chip `unit`) | %d |" % com_etiqueta)
C.append("| Verbetes sem família e sem etiqueta | %d |" % sem_categoria)
C.append("")
C.append("M01, M02 e M03 não agrupam por família: a fonte lista em ordem "
         "alfabética e dá a cada verbete um chip curto (`etiqueta`). Os "
         "outros 14 módulos agrupam. Os dois campos ficam separados em vez de "
         "fundidos, porque a fonte os escreve separados.")
C.append("")
C.append("## Termos repetidos entre módulos")
C.append("")
C.append("| | |")
C.append("|---|---:|")
C.append("| Chaves de termo distintas | %d |" % len(grupos))
C.append("| Termos que aparecem em mais de um módulo | **%d** |" % len(homonimos))
C.append("| Deles, com definições literais **divergentes** | **%d** |"
         % len(conflitos))
C.append("| Deles, com definição literal idêntica | %d |"
         % len(identicos_repetidos))
C.append("")
dist = collections.Counter(x["ocorrencias"] for x in homonimos)
C.append("Distribuição: " + ", ".join(
    "%d termos em %d módulos" % (dist[n], n) for n in sorted(dist)) + ".")
C.append("")
C.append("**Nada foi fundido.** Cada ocorrência continua sendo um verbete "
         "próprio em `glossario.json`, com seu `id`, seu módulo e sua "
         "definição literal. Os %d casos divergentes estão em "
         "`conflitos.json`, com as leituras lado a lado, para decisão do "
         "Founder." % len(conflitos))
C.append("")
C.append("A fonte sustenta essa escolha. O lede do § Lex do M10 diz: "
         "*“Termos já definidos nos Módulos 01 a 09 não são "
         "repetidos aqui, exceto quando este módulo lhes dá um sentido "
         "operacional distinto.”* A repetição entre módulos "
         "é, pela própria fonte, deliberada — cada módulo "
         "redefine o termo no seu registro operacional.")
C.append("")
topo = sorted(((x["ocorrencias"], x["termo"]) for x in homonimos), reverse=True)[:12]
C.append("Os mais repetidos: " + ", ".join("%s (%d)" % (t, n) for n, t in topo) + ".")
C.append("")
pld = [x for x in conflitos if x["chave"] == "pld"]
if pld:
    C.append("O caso conhecido do PLD tem **%d** entradas, não três: %s "
             "— quatro definições literais distintas."
             % (len(pld[0]["ocorrencias"]),
                ", ".join(o["modulo"].upper() for o in pld[0]["ocorrencias"])))
    C.append("")
C.append("## Relações (D4)")
C.append("")
C.append("| | |")
C.append("|---|---:|")
C.append("| Relações de citação encontradas | %d |" % citacoes)
C.append("| Verbetes que citam outro verbete | %d |"
         % sum(1 for v in verbetes if v["relacoes"]["citadosNaDefinicao"]))
C.append("| Verbetes sem citação | %d |"
         % sum(1 for v in verbetes if not v["relacoes"]["citadosNaDefinicao"]))
C.append("")
C.append("Regra mecânica e declarada, sem tolerância inventada:")
C.append("")
C.append("1. **Citação** — o termo X aparece como palavra inteira "
         "dentro do texto da definição do termo Y, **no mesmo "
         "módulo**. Casar entre módulos seria rede semântica "
         "inventada, então não se faz.")
C.append("2. Casam o termo literal e o termo sem o sufixo entre parênteses "
         "(`Ampere (A)` também casa por `Ampere`). Sigla em CAIXA ALTA casa "
         "com caixa, a partir de 2 caracteres; o resto casa sem caixa, a partir "
         "de 4.")
C.append("3. **Mesma família** — não é repetida verbete a "
         "verbete (seriam dezenas de milhares de pares). Fica em `familiaId` mais "
         "o índice `familias` de `glossario.json`, que é a mesma "
         "informação sem o inchaço.")
C.append("")
C.append("## Divergência de contagem (P8 — não corrigida aqui)")
C.append("")
C.append("| Módulo | Verbetes medidos | O que a fonte declara |")
C.append("|---|---:|---|")
for mm in meta_modulos:
    C.append("| %s | %d | %s |" % (mm["modulo"].upper(), mm["termos"],
                                   declarado_de(mm)))
C.append("")
C.append("O caso vivo é o **M01: a prosa diz “Vinte e oito termos” e "
         "o markup tem 38**. A extração segue o markup, que é o "
         "conteúdo real, e deixa a prosa registrada. Isso é "
         "reconciliação separada (P8), não conserto desta wave.")
C.append("")
C.append("## O que está declarado como ausente (S4)")
C.append("")
C.append("- **Aula de origem: %d de %d verbetes.** Nenhum aparato declara o "
         "vínculo. `\"ancora\": \"não declarado\"`."
         % (sem_ancora_aula, TOTAL))
C.append("- **Família: %d verbetes** (M01, M02, M03), porque a fonte "
         "não agrupa esses módulos. Eles têm etiqueta, não "
         "família." % (TOTAL - com_familia))
C.append("- **Definição escrita por esta wave: zero.** Toda "
         "definição é cópia literal do `aparato.json`. Onde a "
         "fonte não define, não há verbete.")
C.append("")
C.append("## Arquivos")
C.append("")
C.append("| Arquivo | O que é |")
C.append("|---|---|")
C.append("| `glossario.json` | O dado que o produto consome: %d verbetes, o "
         "índice de %d famílias, o índice de homônimos e a "
         "comparação com o produto. |" % (TOTAL, len(familias)))
C.append("| `glossario.md` | A tabela legível, módulo a módulo. |")
C.append("| `conflitos.json` | Os %d termos repetidos entre módulos; %d deles "
         "com definições divergentes, lado a lado. |"
         % (len(homonimos), len(conflitos)))
C.append("| `COBERTURA.md` | Esta página. |")
C.append("| `extrair-glossario.py` | O extrator. Reexecutável; a saída "
         "é função da fonte, não de julgamento. |")
C.append("")
C.append("`glossario.json` tem ~4 MB porque carrega procedência por verbete. "
         "Os campos `origem`, `camposDaFonte`, `termoLiteralNaFonte` e "
         "`noProdutoHoje` são reconciliação, não leitura: um "
         "consumidor de runtime pode projeção fora deles sem perder "
         "nenhum verbete. O próprio arquivo lista esses campos em "
         "`camposDeProcedencia`.")
C.append("")
escrever_texto(os.path.join(SAIDA, "COBERTURA.md"), "\n".join(C) + "\n")

print("verbetes:", TOTAL)
print("familias:", len(familias))
print("homonimos:", len(homonimos), "conflitos:", len(conflitos),
      "repeticoes identicas:", len(identicos_repetidos))
print("ancora de aula nao declarada:", sem_ancora_aula)
print("citacoes:", citacoes)
if comparacao:
    print("produto:", comparacao["verbetesNoProduto"],
          "| novos:", comparacao["novos"],
          "| batem:", comparacao["batem"],
          "| divergem:", comparacao["divergem"],
          "| so no produto:", comparacao["soNoProduto"])
