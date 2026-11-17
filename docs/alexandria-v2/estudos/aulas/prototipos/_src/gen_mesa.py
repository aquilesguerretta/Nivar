"""Gera _src/mesa-m13-a06.html com as células do INST·09 do Módulo 13 (extraction/m13/instrumentos.json).

Correção 2026-09-17 (critic):
- a matriz sai em duas versões: no estado inicial só a linha-exemplo (Regulatório) está aberta; as outras sete mostram
  categoria e posição na lista do currículo, com as células veladas até a bandeja de sinais (C7: tentativa antes da
  referência — as células "como se manifesta" entregavam a bandeja);
- cada linha declara se a categoria está na lista do currículo (cinco, conforme o lide) ou fora dela (três), para o
  learner reconstruir a contagem sem a numeração "a sexta" (P23).
"""
import json, html
from pathlib import Path

AQUI = Path(__file__).resolve().parent
J = json.loads((AQUI.parents[3] / "extraction/m13/instrumentos.json").read_text(encoding="utf-8"))
arr = J["instrumentos"] if isinstance(J, dict) else J
R = next(i for i in arr if i["id"] == "m13-inst-09")["dados"]["R"]["valor"]
# P23: não expor a numeração "a sexta" (a matriz tem oito categorias). Edição editorial registrada.
for r in R:
    if r["k"] == "cred":
        r["emp"] = r["emp"].replace("A sexta categoria, ausente do currículo e dominante no setor em 2026.",
                                    "A categoria ausente do currículo e dominante no setor em 2026.")
EXEMPLO = "reg"
NA_LISTA = {"hid", "reg", "cam", "idx", "ope"}  # os cinco riscos que o lide diz que o currículo lista
REG = {"hid": ("Hidrológico", "gatilho contratual", "mesma categoria da matriz"),
       "cred": ("Operacional", None, "categoria diferente da matriz"),
       "idx": ("Descasamento de indexador", None, "mesma categoria da matriz"),
       "mer": ("Mercado e recontratação", None, "mesma categoria da matriz")}
e = html.escape


def tag(k):
    if k in NA_LISTA:
        return '<span class="lst">na lista do currículo</span>'
    if k == "cred":
        return '<span class="lst fora forte">fora da lista · a que a aula nomeia</span>'
    return '<span class="lst fora">fora da lista do currículo</span>'


def nome(r, aberta):
    return (f'<div class="mz-c mz-n" role="rowheader"><button type="button" aria-expanded="{str(aberta).lower()}">'
            f'{e(r["n"])}{tag(r["k"])}<i>{"fechar" if aberta else "abrir"}</i></button></div>')


ini, reg = [], []
for r in R:
    ex = r["k"] == EXEMPLO
    # estado inicial
    if ex:
        ini.append(
            f'<div class="mz-l aberta exemplo" role="row">{nome(r, True)}'
            f'<div class="mz-c" role="cell"><span class="cl">{e(r["emp"])}</span></div>'
            f'<div class="mz-c" role="cell"><span class="cl">{e(r["prj"])}</span></div>'
            f'<div class="mz-c mz-a" role="cell"><span class="cl">{e(r["alr"])}</span></div>'
            f'<div class="mz-mit" role="cell"><b>O que mitiga</b> {e(r["mit"])} <em class="exm">linha-exemplo · aberta para mostrar como se lê</em></div></div>')
    else:
        ini.append(
            f'<div class="mz-l fechada" role="row">{nome(r, False)}'
            f'<div class="mz-c mz-vel" role="cell"><span class="vel">{{{{g:velado}}}} as duas lentes e o alerta abrem depois da bandeja de sinais</span></div></div>')
    # estado registrado
    alvo = r["k"] in REG
    marca = ""
    if alvo:
        sua, lente, veredito = REG[r["k"]]
        glifo = "{{g:percorrida}}" if veredito.startswith("mesma") else "{{g:vazio}}"
        marca = (f'<span class="sua so-reg-f">{glifo}<span>Um item seu caiu aqui · <b>{veredito}</b>'
                 + (f' · na lente de projeto: {lente} (mesma da matriz)' if lente else '') + '</span></span>')
    reg.append(
        f'<div class="mz-l{" aberta" if ex else ""}{" alvo" if alvo else ""}" role="row">{nome(r, ex)}'
        f'<div class="mz-c" role="cell"><span class="cl">{e(r["emp"])}</span></div>'
        f'<div class="mz-c" role="cell"><span class="cl">{e(r["prj"])}</span></div>'
        f'<div class="mz-c mz-a" role="cell"><span class="cl">{e(r["alr"])}</span>{marca}</div>'
        + (f'<div class="mz-mit" role="cell"><b>O que mitiga</b> {e(r["mit"])}</div>' if ex else "")
        + '</div>')

CAB = ('<div class="mz-l mz-h" role="row"><div class="mz-c" role="columnheader">Categoria</div>'
       '<div class="mz-c" role="columnheader">Empresa aberta · como se manifesta</div>'
       '<div class="mz-c" role="columnheader">Sociedade de projeto · como se manifesta</div>'
       '<div class="mz-c" role="columnheader">Indicador de alerta</div></div>')
MATRIZ = (f'<div class="mz so-ini" role="table" aria-label="Matriz de risco em duas lentes, antes da bandeja">{CAB}{"".join(ini)}</div>'
          f'<div class="mz so-reg" role="table" aria-label="Matriz de risco em duas lentes">{CAB}{"".join(reg)}</div>')
CATS = "".join(f'<button class="op">{e(r["n"])}</button>' for r in R)
OPTS = '<option value="">Pôr em…</option>' + "".join(f'<option>{e(r["n"])}</option>' for r in R)
src = (AQUI / "mesa-m13-a06.tpl").read_text(encoding="utf-8")
src = src.replace("@@MATRIZ@@", MATRIZ).replace("@@CATS@@", CATS).replace("@@OPTS@@", OPTS)
(AQUI / "mesa-m13-a06.html").write_text(src, encoding="utf-8")
print("ok", len(R))
