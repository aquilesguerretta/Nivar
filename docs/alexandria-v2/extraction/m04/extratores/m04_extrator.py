# -*- coding: utf-8 -*-
"""Extração programática do M04 (grupos modulo, aparato, instrumentos).

Todo texto de conteúdo sai do HTML-fonte por árvore de DOM (bs4 +
html.parser, que preserva `sourceline`); nada é digitado. Campos que não são
texto da fonte (nota, marcacao_p14, divergências, comparação com código) são
anotação desta extração e estão marcados como tal no JSON.

Uso:
  python m04_extrator.py <harness.json> <pasta-de-saida>
O harness.json vem de m04_harness_script.mjs (executa o <script> original).
Só leitura sobre a fonte e sobre src/.
"""
import difflib
import html as htmlmod
import json
import re
import subprocess
import sys
import unicodedata
from pathlib import Path

from bs4 import BeautifulSoup, NavigableString, Tag

SRC = Path('C:/dev/GridAlpha v2/Alexandria modulos/alexandria_modulo04.html')
REPO = Path('C:/dev/gridalpha-v2-alexandria-v2-restructure')
TS_CONTENT = REPO / 'src/lib/data/alexandria-modulo-04-content.ts'
TS_GLOSS = REPO / 'src/lib/data/alexandria-glossario.ts'
TS_BLOCKS = REPO / 'src/lib/data/alexandria-blocks.ts'
TS_TRILHAS = REPO / 'src/lib/data/alexandria-trilhas.ts'
TS_CALC = REPO / 'src/lib/data/alexandria-instrument-calculators.ts'
TS_BADGES = REPO / 'src/lib/data/alexandria-badges.ts'
CATALOGO = Path('C:/dev/GridAlpha v2/docs/catalogo-modulos-alexandria.md')

HARNESS = Path(sys.argv[1])
OUTDIR = Path(sys.argv[2])

RAW = SRC.read_text(encoding='utf-8')
LINES = RAW.split('\n')
soup = BeautifulSoup(RAW, 'html.parser')

ANOT = 'anotacao_da_extracao'  # marca de campo que não é texto da fonte


# ── helpers ─────────────────────────────────────────────────────────────
def ws(s):
    return re.sub(r'\s+', ' ', s).strip()


def ser(nodes):
    """Serializa nós como estão na fonte (bs4 escreve <br/>; a fonte usa <br>)."""
    return ws(''.join(str(c) for c in nodes)).replace('<br/>', '<br>')


def inner(tag):
    """HTML interno literal (espaços colapsados)."""
    return ser(tag.contents)


# string JS/TS entre aspas duplas, com escapes
JSQ = r'"((?:[^"\\]|\\.)*)"'


def unq(s):
    return s.replace('\\"', '"').replace('\\\\', '\\')


def text(tag):
    return ws(tag.get_text())


def trecho(line):
    return LINES[line - 1].strip()[:90]


def origem(tag, seletor, line=None):
    n = line or tag.sourceline
    return {'seletor': seletor, 'trecho_inicial': trecho(n), 'linha_aprox': n}


def txt(tag):
    return {'html': inner(tag), 'texto': text(tag)}


def slug(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')


def ln_of(pattern, start=1):
    for i in range(start - 1, len(LINES)):
        if re.search(pattern, LINES[i]):
            return i + 1
    raise ValueError(pattern)


# ── seções ──────────────────────────────────────────────────────────────
SECTIONS = soup.find_all('section')
SEC = {}
ROTEIRO = []
for s in SECTIONS:
    sid = s.find('div', class_='sec-id')
    b = sid.find('b')
    marcador = b.get_text()
    rotulo = ws(sid.get_text().replace(marcador, '', 1)).lstrip('· ').strip()
    h2 = s.find('h2')
    lede = s.find('p', class_='lede')
    is_aula = bool(re.fullmatch(r'Aula \d\d', marcador))
    SEC[s['id']] = s
    item = {
        'id': f"m04-roteiro-{s['id']}",
        'tipo': 'aula' if is_aula else 'aparato',
        'ordem_na_fonte': len(ROTEIRO) + 1,
        'ancora_html': s['id'],
        'marcador': marcador,
        'rotulo': rotulo,
        'titulo': txt(h2),
        'lede': txt(lede) if lede else None,
        'origem': origem(sid, f"section#{s['id']} .sec-id"),
    }
    if is_aula:
        n = marcador[-2:]
        item['aula'] = n
        item['subsecoes'] = [
            {'numero': h.find('span', class_='num').get_text(),
             'titulo': ws(''.join(str(c) for c in h.contents if not (isinstance(c, Tag) and 'num' in (c.get('class') or [])))),
             'linha_aprox': h.sourceline}
            for h in s.find_all('h3')]
        item['instrumentos'] = [i.find('span', class_='id').get_text() for i in s.find_all('div', class_='inst')]
        item['explicadores_tres_niveis'] = [text(l.find('div', class_='lv-hd')) for l in s.find_all('div', class_='lv')]
        item['callouts'] = [{'classe': ' '.join(bx['class']), 'rotulo': text(bx.find('span', class_='tag')), 'linha_aprox': bx.sourceline}
                            for bx in s.find_all('div', class_='box')]
        item['tabelas'] = len(s.find_all('table'))
    ROTEIRO.append(item)

# ── código: aulas ──────────────────────────────────────────────────────
TS = TS_CONTENT.read_text(encoding='utf-8')
code_aulas = re.findall(r"id: 'aula-04-(\d\d)',[\s\S]*?title: \"(.*?)\",\s*subtitle: \"(.*?)\"", TS)
code_total = re.findall(r"totalInModule: (\d+)", TS)
BLOCKS = TS_BLOCKS.read_text(encoding='utf-8')
bloco04 = re.search(r"\{ id: 'bloco-04'.*?\}", BLOCKS).group(0)
TRILHAS = TS_TRILHAS.read_text(encoding='utf-8')
aulas_por_bloco = re.search(r"'bloco-04': (\d+)", TRILHAS).group(1)
CAT = CATALOGO.read_text(encoding='utf-8')
cat_start = CAT.index('## Módulo 04 — ')
cat_sec = CAT[cat_start:CAT.index('## Módulo 05 — ')]
cat_aulas = re.findall(r'^\| (\d\d) \| (.*?) \| (.*?) \|$', cat_sec, re.M)

# ═════════════════════════════════════════════════════════════════════════
# GRUPO MÓDULO
# ═════════════════════════════════════════════════════════════════════════
hero = soup.find('div', class_='hero')
pills = hero.find_all('span', class_='pill')
kicker = hero.find('div', class_='kicker')
h1 = hero.find('h1')
sub = hero.find('p', class_='sub')
footer = soup.find('footer')

identidade = {
    'id': 'm04-identidade',
    'tipo': 'identidade',
    'title_documento': {'texto': soup.title.get_text(), 'origem': origem(soup.title, 'head > title')},
    'kicker': {**txt(kicker), 'origem': origem(kicker, 'div.hero .kicker')},
    'titulo': {**txt(h1), 'origem': origem(h1, 'div.hero h1')},
    'subtitulo': {**txt(sub), 'origem': origem(sub, 'div.hero p.sub')},
    'pills': [{'id': f'm04-pill-{i+1:02d}', **txt(p), 'numero_declarado': (p.find('b').get_text() if p.find('b') else None),
               'origem': origem(p, 'div.hero .pill-row .pill')} for i, p in enumerate(pills)],
    'horas': {
        'texto': text(pills[-1]),
        'min': None, 'max': None,
        'nota': 'A fonte declara só a string "3–4h de estudo" (último pill do hero). Não convertida em números aqui; o catálogo do código (alexandria-blocks.ts, bloco-04) traz estimatedHoursMin 3 / estimatedHoursMax 4.',
        'origem': origem(pills[-1], 'div.hero .pill-row .pill:last'),
    },
    'eixos': None,
    'eixos_nota': 'A fonte não declara "eixos" do módulo. O mais próximo é a enumeração do callout "Ideia central do módulo" (§00: "tempo, localização, risco, flexibilidade e confiabilidade") e as "cinco perguntas" de §00 0.2 (construir, gerar agora, custar, assumir o risco, segurança de suprimento). Nenhuma é rotulada como eixo; não promovidas.',
    'trilha_declarada': None,
    'trilha_nota': 'A fonte não declara trilha nem nível; só "Alexandria · GridAlpha · Módulo 04" (kicker). O catálogo canônico marca a trilha como "atribuída".',
    'rodape': {
        'linhas': [{'html': inner(p), 'texto': text(p), 'linha_aprox': p.sourceline} for p in footer.find_all('p')],
        'origem': origem(footer, 'footer'),
    },
}

# § 00 tese: blocos na ordem
tese_sec = SEC['tese']


def blocos(container, secid):
    out = []
    wrap = container.find('div', class_='wrap')
    for el in wrap.children:
        if not isinstance(el, Tag):
            continue
        cls = el.get('class') or []
        if 'sec-id' in cls or el.name == 'h2' or 'lede' in cls:
            continue
        o = None
        if el.name == 'p':
            o = {'tipo': 'paragrafo', **txt(el)}
        elif el.name == 'h3':
            o = {'tipo': 'titulo', 'numero': el.find('span', class_='num').get_text(),
                 'html': ws(''.join(str(c) for c in el.contents if not (isinstance(c, Tag) and 'num' in (c.get('class') or [])))),
                 'texto': ws(''.join((c.get_text() if isinstance(c, Tag) else str(c)) for c in el.contents if not (isinstance(c, Tag) and 'num' in (c.get('class') or []))))}
        elif 'scroll' in cls or el.name == 'table':
            t = el.find('table')
            o = {'tipo': 'tabela', 'linhas': [[inner(c) for c in tr.find_all(['th', 'td'])] for tr in t.find_all('tr')]}
        elif 'box' in cls:
            tg = el.find('span', class_='tag')
            o = {'tipo': 'callout', 'classe': ' '.join(cls), 'rotulo': tg.get_text(),
                 'paragrafos': [txt(p) for p in el.find_all('p')]}
        elif el.name in ('ol', 'ul'):
            o = {'tipo': 'lista', 'classe': ' '.join(cls), 'itens': [txt(li) for li in el.find_all('li', recursive=False)]}
        elif 'map-grid' in cls or 'inst' in cls or 'lv' in cls or el.name == 'details' or el.name == 'div':
            continue
        else:
            o = {'tipo': el.name, **txt(el)}
        o['origem'] = origem(el, f'section#{secid} > .wrap > {el.name}' + (('.' + '.'.join(cls)) if cls else ''))
        out.append(o)
    return out


tese = {
    'id': 'm04-tese',
    'tipo': 'tese',
    'marcador': tese_sec.find('div', class_='sec-id').find('b').get_text(),
    'rotulo': ROTEIRO[0]['rotulo'],
    'titulo_secao': txt(tese_sec.find('h2')),
    'lede': txt(tese_sec.find('p', class_='lede')),
    'blocos': blocos(tese_sec, 'tese'),
    'origem': ROTEIRO[0]['origem'],
}
for i, b in enumerate(tese['blocos']):
    b['id'] = f'm04-tese-b{i+1:02d}'

# critério do §00 (box gd)
crit_box = [b for b in tese_sec.find_all('div', class_='box') if 'Critério' in b.find('span', class_='tag').get_text()][0]

# § MAP
map_sec = SEC['map']
mapa = {
    'id': 'm04-mapa',
    'tipo': 'mapa_do_modulo',
    'marcador': map_sec.find('div', class_='sec-id').find('b').get_text(),
    'rotulo': ROTEIRO[1]['rotulo'],
    'titulo_secao': txt(map_sec.find('h2')),
    'intro': txt(map_sec.find('p', class_='lede')),
    'cartoes': [],
    'perguntas': None,
    'perguntas_nota': 'O §MAP do M04 é uma grade de 7 cartões (número, título, descrição), sem coluna de "pergunta" como o § MAP do M01. As descrições são literais; algumas contêm frase interrogativa implícita ("Por que o preço brasileiro é calculado por modelo…"), mas nenhuma é rotulada como pergunta da aula. Não promovidas.',
    'origem': ROTEIRO[1]['origem'],
}
for a in map_sec.find_all('a', class_='map-card'):
    n = a.find('div', class_='n').get_text()
    mapa['cartoes'].append({
        'id': f"m04-map-{a['href'][1:]}",
        'tipo': 'cartao_de_aula',
        'href': a['href'],
        'numero': n,
        'titulo_cartao': txt(a.find('div', class_='t')),
        'descricao': txt(a.find('div', class_='d')),
        'vinculos': {'aula_id_codigo': f"aula-04-{n[-2:]}", 'secao_fonte': a['href']},
        'origem': origem(a, 'section#map .map-grid a.map-card'),
    })

# critérios
quiz_sec = SEC['quiz']
final_sec = SEC['final']
voz_sec = SEC['voz']
SCRIPT_START = ln_of(r'^<script>')


def p14(s):
    t = s.lower()
    tags = []
    if re.search(r'segundos|minuto|cronometr', t):
        tags.append('cronometrado')
    if re.search(r'voz alta|explica|defende|descreve|define|distingue|diferencia|nomeia|lista|l[êe] a|mostra|grave|responda', t):
        tags.append('producao_oral_ou_livre')
    if re.search(r'sem consultar|sem travar|de mem[oó]ria', t):
        tags.append('sem_consulta')
    return tags


final_items = []
for i, li in enumerate(final_sec.find('ul', class_='ck').find_all('li')):
    final_items.append({'id': f'm04-check-{i+1:02d}', 'tipo': 'item_de_checklist', 'ordem': i + 1, **txt(li),
                        'marcacao_p14': p14(li.get_text()),
                        'origem': origem(li, 'section#final ul.ck > li')})

msg_pass_line = ln_of(r"Critério de domínio atingido", SCRIPT_START)
msg_fail_line = ln_of(r"Abaixo do critério de 8/10", SCRIPT_START)
js_str = lambda n: re.search(r"textContent='(.*)';", LINES[n - 1]).group(1)

criterio = {
    'id': 'm04-criterios',
    'nota': 'Critérios literais, cada um com sua origem. Nenhum prevalece (P18): conclusão, desempenho e evidência ficam separados na camada Alexandria.',
    'itens': [
        {'id': 'm04-crit-00-tese', 'onde': '§00 · callout "Critério de domínio deste módulo"',
         'rotulo': crit_box.find('span', class_='tag').get_text(),
         **txt(crit_box.find('p')),
         'marcacao_p14': ['producao_oral_ou_livre', 'sem_consulta'],
         'origem': origem(crit_box, 'section#tese .box.gd')},
        {'id': 'm04-crit-hero', 'onde': 'hero · pill', **txt(pills[3]), 'marcacao_p14': ['automatizavel_quiz'],
         'origem': origem(pills[3], 'div.hero .pill:nth(4)')},
        {'id': 'm04-crit-quiz', 'onde': '§Quiz · lede',
         **txt(quiz_sec.find('p', class_='lede')),
         'limiar_literal': quiz_sec.find('p', class_='lede').find('strong').get_text(),
         'mensagens_script': [
             {'condicao_codigo': ws(LINES[msg_pass_line - 3]), 'classe': 'score show pass', 'mensagem': js_str(msg_pass_line), 'linha_aprox': msg_pass_line},
             {'condicao_codigo': '}else{', 'classe': 'score show fail', 'mensagem': js_str(msg_fail_line), 'linha_aprox': msg_fail_line},
         ],
         'marcacao_p14': ['automatizavel_quiz'],
         'origem': origem(quiz_sec.find('p', class_='lede'), 'section#quiz p.lede')},
        {'id': 'm04-crit-final', 'onde': '§Final',
         'rotulo_secao': ROTEIRO[[r['ancora_html'] for r in ROTEIRO].index('final')]['rotulo'],
         'titulo': txt(final_sec.find('h2')),
         'lede': txt(final_sec.find('p', class_='lede')),
         'itens': final_items,
         'marcacao_p14': ['producao_oral_ou_livre', 'sem_consulta'],
         'origem': origem(final_sec.find('h2'), 'section#final h2')},
    ],
    'marcacao_p14_nota': f'{ANOT}: marcacao_p14 é inferida por palavra-chave (segundos/minuto/cronometr → cronometrado; verbos de produção → producao_oral_ou_livre; "sem consultar/sem travar/de memória" → sem_consulta). Precisa de revisão humana. Os critérios de §Voz (hesitação > 3 s, 90 s por ataque, 5 min gravados) estão em voz.* e são cronometrados.',
}

# laboratórios
laboratorios = {
    'itens': [],
    'nota': 'Zero seção "§ Lab" e zero instrumento fora de aula no M04 (medido: 7 div.inst, todos dentro de section#a01..a07). Nada a extrair.',
}

# § Voz
v_h3 = voz_sec.find_all('h3')
v1_ol = voz_sec.find('ol', class_='two-col')
v2_ol = voz_sec.find('ol', class_='num-list')
v3_ps = [p for p in v_h3[2].find_all_next('p') if p.find_parent('section') is voz_sec and not p.find_parent('div', class_='box')]
voz_box = voz_sec.find('div', class_='box')


def h3parts(h):
    num = h.find('span', class_='num').get_text()
    rest = [c for c in h.contents if not (isinstance(c, Tag) and 'num' in (c.get('class') or []))]
    return num, ws(''.join(str(c) for c in rest))


voz = {
    'id': 'm04-voz',
    'tipo': 'dominio_oral',
    'marcador': voz_sec.find('div', class_='sec-id').find('b').get_text(),
    'rotulo': ROTEIRO[[r['ancora_html'] for r in ROTEIRO].index('voz')]['rotulo'],
    'titulo_secao': txt(voz_sec.find('h2')),
    'lede': txt(voz_sec.find('p', class_='lede')),
    'v1_perguntas_relampago': {
        'numero': h3parts(v_h3[0])[0], 'titulo': h3parts(v_h3[0])[1],
        'instrucao': txt(v_h3[0].find_next_sibling('p')),
        'itens': [{'id': f'm04-relampago-{i+1:02d}', 'ordem': i + 1, **txt(li), 'origem': origem(li, 'section#voz ol.two-col > li')}
                  for i, li in enumerate(v1_ol.find_all('li'))],
        'marcacao_p14': ['producao_oral_ou_livre', 'sem_consulta', 'cronometrado'],
        'origem': origem(v_h3[0], 'section#voz h3 (V.1)'),
    },
    'v2_ataques_de_decisor': {
        'numero': h3parts(v_h3[1])[0], 'titulo': h3parts(v_h3[1])[1],
        'instrucao': txt(v_h3[1].find_next_sibling('p')),
        'itens': [{'id': f'm04-ataque-{i+1:02d}', 'ordem': i + 1, 'persona': li.find('b').get_text(),
                   'pergunta': ws(''.join(str(c) for c in li.contents if c is not li.find('b'))), **txt(li),
                   'origem': origem(li, 'section#voz ol.num-list > li')}
                  for i, li in enumerate(v2_ol.find_all('li'))],
        'marcacao_p14': ['producao_oral_ou_livre', 'cronometrado'],
        'origem': origem(v_h3[1], 'section#voz h3 (V.2)'),
    },
    'v3_roteiro_cinco_minutos': {
        'numero': h3parts(v_h3[2])[0], 'titulo': h3parts(v_h3[2])[1],
        'minutos': [{'id': f'm04-roteiro-min-{i+1}', 'rotulo': p.find('strong').get_text(), **txt(p),
                     'origem': origem(p, 'section#voz > p (V.3)')} for i, p in enumerate(v3_ps)],
        'marcacao_p14': ['producao_oral_ou_livre', 'cronometrado'],
        'origem': origem(v_h3[2], 'section#voz h3 (V.3)'),
    },
    'como_treinar': {'rotulo': voz_box.find('span', class_='tag').get_text(), **txt(voz_box.find('p')),
                     'origem': origem(voz_box, 'section#voz .box.cy')},
}

# princípios / voz editorial (callouts de aparato e recorrentes)
all_boxes = soup.find_all('div', class_='box')
principios = []
for bx in all_boxes:
    tag = bx.find('span', class_='tag').get_text()
    sec = bx.find_parent('section')['id']
    if tag.startswith('Números vivos') or tag in ('Ideia central do módulo', 'Disciplina do caso', 'Onde isso entra no produto'):
        principios.append({
            'id': f"m04-principio-{sec}-L{bx.sourceline}",
            'rotulo': tag, 'classe': ' '.join(bx['class']), 'secao': sec,
            'paragrafos': [txt(p) for p in bx.find_all('p')],
            'exibir_ao_learner': (False if tag == 'Onde isso entra no produto' else None),
            'nota': ('P7/P24: bloco de produto GridAlpha; registrado como proveniência, não exibível.' if tag == 'Onde isso entra no produto' else None),
            'origem': origem(bx, f'section#{sec} .box'),
        })

# erros comuns
erros_sec = SEC['erros']
erros = {
    'id': 'm04-erros',
    'marcador': erros_sec.find('div', class_='sec-id').find('b').get_text(),
    'rotulo': ROTEIRO[[r['ancora_html'] for r in ROTEIRO].index('erros')]['rotulo'],
    'titulo_secao': txt(erros_sec.find('h2')),
    'lede': txt(erros_sec.find('p', class_='lede')),
    'itens': [{'id': f'm04-erro-{i+1:02d}', 'ordem': i + 1, 'titulo': txt(li.find('b')),
               'corpo': {'html': ws(''.join(str(c) for c in li.contents if c is not li.find('b'))),
                         'texto': ws(''.join((c.get_text() if isinstance(c, Tag) else str(c)) for c in li.contents if c is not li.find('b')))},
               **txt(li), 'vinculos': {'aula': None}, 'origem': origem(li, 'section#erros ol.num-list > li')}
              for i, li in enumerate(erros_sec.find('ol').find_all('li'))],
    'nota': 'Nenhum erro declara aula de origem. Callouts vermelhos (box rd) dentro das aulas são "Números vivos", não erros comuns.',
}

# explicadores 3 níveis (índice)
lv_index = []
for lv in soup.find_all('div', class_='lv'):
    sec = lv.find_parent('section')['id']
    lv_index.append({'rotulo': text(lv.find('div', class_='lv-hd')), 'secao': sec,
                     'abas': [b.get_text() for b in lv.find_all('button')],
                     'linha_aprox': lv.sourceline})

# comparação com código / catálogo (módulo)
aulas_fonte = [r for r in ROTEIRO if r['tipo'] == 'aula']
cmp_aulas = []
for r in aulas_fonte:
    n = r['aula']
    code = next((c for c in code_aulas if c[0] == n), None)
    card = next(c for c in mapa['cartoes'] if c['numero'] == f'Aula {n}')
    cat = next((c for c in cat_aulas if c[0] == n), None)
    cmp_aulas.append({
        'aula': n,
        'h2_fonte': r['titulo']['texto'],
        'rotulo_sec_id_fonte': r['rotulo'],
        'titulo_cartao_map_fonte': card['titulo_cartao']['texto'],
        'title_codigo': code[1] if code else None,
        'subtitle_codigo': code[2] if code else None,
        'titulo_catalogo': cat[2] if cat else None,
        'rotulo_catalogo': cat[1] if cat else None,
        'h2_igual_codigo': bool(code and code[1] == r['titulo']['texto']),
        'rotulo_igual_codigo': bool(code and code[2] == r['rotulo']),
        'h2_igual_cartao_map': card['titulo_cartao']['texto'] == r['titulo']['texto'],
        'h2_igual_catalogo': bool(cat and cat[2] == r['titulo']['texto']),
        'subsecoes': len(r['subsecoes']),
        'instrumentos': r['instrumentos'],
    })

comparacao_codigo = {
    ANOT: True,
    'contagem_aulas': {
        'marcadores_Aula_NN': len(aulas_fonte),
        'cartoes_map': len(mapa['cartoes']),
        'prosa_map': mapa['titulo_secao']['texto'],
        'pill_hero': pills[0].get_text(),
        'codigo_MODULO_04_AULAS': len(code_aulas),
        'codigo_totalInModule': sorted(set(code_total)),
        'codigo_AULAS_POR_BLOCO': int(aulas_por_bloco),
        'catalogo_canonico': len(cat_aulas),
    },
    'aulas': cmp_aulas,
    'catalogo_repo_bloco04': bloco04,
    'catalogo_canonico_cabecalho': cat_sec.split('\n')[0],
    'catalogo_canonico_escala': re.search(r'\*\*Escala\*\* · (.*?)\n\n', cat_sec, re.S).group(1).replace('\n', ' '),
    'o_que_o_codigo_nao_tem': ['tese (§00) fora das aulas', 'cartões do §MAP', 'critérios (§00, §Quiz, §Final)', '§Voz (32 + 6 + roteiro)',
                               '§Erros', '§Caso', '§Quiz', '§Final', '§Ref', 'badges do M04 (BLOCOS_COM_CONTEUDO = bloco-01..03)'],
}

divergencias_modulo = []


def div(id_, tema, a, b, fonte=True, extra=None):
    d = {'id': id_, 'tema': tema, 'leitura_a': a, 'leitura_b': b, 'resolvida': False, ANOT: True}
    if extra:
        d.update(extra)
    return d


card04 = next(c for c in mapa['cartoes'] if c['numero'] == 'Aula 04')
divergencias_modulo += [
    div('div-m04-titulo-aula04', 'Título da Aula 04: cartão do §MAP × h2 da aula (fonte × fonte)',
        f"§MAP (L{card04['origem']['linha_aprox']}): \"{card04['titulo_cartao']['texto']}\"",
        f"h2 (L{aulas_fonte[3]['origem']['linha_aprox']+1}): \"{aulas_fonte[3]['titulo']['texto']}\" — é o que o código (title) e o catálogo canônico usam"),
    div('div-m04-bloco-x-modulo', 'Nome da unidade: "Bloco 4" × "Módulo 04" (fonte × fonte)',
        '"Você domina o Bloco 4…" (§00 L296, §Final h2 L1181); "escopo do Bloco 9" (§Ref L1302)',
        '"Módulo 04" no <title>, kicker, rodapé; "Módulo 02/03" no corpo'),
    div('div-m04-marca', 'Marca GridAlpha em texto visível (P24)',
        'Fonte: kicker "Alexandria · GridAlpha · Módulo 04", rodapé "GridAlpha · Inteligência Energética Independente", callouts de produto ("GridAlpha Simulate", "portfólio GridAlpha")',
        'Produto hoje: Alexandria/NIVAR. Texto mantido literal; não exibir blocos "Onde isso entra no produto" (P7).'),
    div('div-m04-criterio-formas', 'Critério de domínio em três formas (P18)',
        '§00: explicar sem consultar (solar custo marginal ~0 × pagar capacidade; vender energia × disponibilidade)',
        'hero/§Quiz: 8/10; §Final: 20 verificações ("Você domina o Bloco 4 quando"); script do quiz: sc>=8 → "Critério de domínio atingido", senão "Não avance para o §Voz antes de fechar 8"',
        extra={'nota': 'Diferente do M01, aqui o script do placar é coerente com o limiar 8/10 (sem faixa contraditória). A contradição é só de forma (oral × quiz × checklist), não de número.'}),
    div('div-m04-horas', 'Horas: fonte × catálogo', 'fonte: "3–4h de estudo" (string)', f'alexandria-blocks.ts: estimatedHoursMin 3 / Max 4; catálogo canônico: "3–4 h declaradas" — concordam',
        extra={'severidade': 'nenhuma'}),
    div('div-m04-trilha', 'Trilha não declarada na fonte', 'fonte: só "Alexandria · GridAlpha · Módulo 04"', 'código/catálogo: track universal, Fundamentos Universais (atribuída)'),
    div('div-m04-dominio-oral-regra', 'Regra "Alexandria" citada na fonte como princípio de voz', '§Voz lede: "A regra Alexandria: todo conceito sobrevive em voz alta ou volta para a fila de estudo."', 'Não há outra formulação no módulo; registrada como princípio de voz da fonte.',
        extra={'severidade': 'nenhuma'}),
    div('div-m04-quiz-gating-voz', 'Mensagem de placar que trava a sequência (P18)',
        '"Não avance para o §Voz antes de fechar 8." (script L%d)' % msg_fail_line,
        'P18: nenhum limiar legado trava a próxima etapa; registro legado apenas.'),
]

modulo = {
    'modulo': '04',
    'fonte': str(SRC).replace('\\', '/'),
    'fonte_linhas': len(LINES) - (1 if LINES[-1] == '' else 0),
    'camada': 'fonte',
    'metodo': 'Python 3 + BeautifulSoup (html.parser, sourceline) sobre a árvore de DOM; extratores/m04_extrator.py. Nenhum texto digitado.',
    'identidade': identidade,
    'tese': tese,
    'resultado_esperado': None,
    'resultado_esperado_nota': 'A fonte do M04 não tem seção/lista "Resultado esperado" nem capacidades enumeradas no §00 (medido: zero "Resultado esperado", zero h4). O mais próximo são o callout "Critério de domínio deste módulo" (criterio.itens[0]) e as 20 verificações do §Final (criterio.itens[3].itens). Não promovidos a capacidades.',
    'mapa': mapa,
    'roteiro': ROTEIRO,
    'criterio': criterio,
    'laboratorios': laboratorios,
    'voz': voz,
    'principios_editoriais': principios,
    'erros_comuns': erros,
    'explicadores_tres_niveis_indice': lv_index,
    'tradutor': None,
    'tradutor_nota': 'Zero "§ Map"/Tradutor no M04 (só §MAP de percurso). Nada a extrair.',
    'comparacao_codigo': comparacao_codigo,
    'divergencias': divergencias_modulo,
}

# ═════════════════════════════════════════════════════════════════════════
# GRUPO APARATO
# ═════════════════════════════════════════════════════════════════════════
caso_sec = SEC['caso']
caso_h3 = caso_sec.find_all('h3')
caso_ps = [p for p in caso_sec.find('div', class_='wrap').find_all('p', recursive=False) if 'lede' not in (p.get('class') or [])]
caso_boxes = caso_sec.find_all('div', class_='box')
caso_ol = caso_sec.find('ol')
caso = {
    'id': 'm04-caso',
    'tipo': 'caso',
    'marcador': caso_sec.find('div', class_='sec-id').find('b').get_text(),
    'rotulo_fonte': ROTEIRO[[r['ancora_html'] for r in ROTEIRO].index('caso')]['rotulo'],
    'parte_declarada_na_fonte': re.search(r'Parte \d', ROTEIRO[[r['ancora_html'] for r in ROTEIRO].index('caso')]['rotulo']).group(0),
    'parte_nota': 'A fonte rotula este caso como "Operação A — Parte 4" e o lede cita "As Partes 1 a 3 olharam consumo, rede e tecnologia" (módulos anteriores). Registro literal; pelo P17 o produto não usa numeração de "Parte" como estrutura da Alexandria.',
    'titulo': txt(caso_sec.find('h2')),
    'lede': txt(caso_sec.find('p', class_='lede')),
    'contexto': [{'id': f'm04-caso-p{i+1}', **txt(p), 'origem': origem(p, 'section#caso > .wrap > p')} for i, p in enumerate(caso_ps) if p.sourceline < caso_h3[0].sourceline],
    'dados_do_caso': {
        'empresa': 'Operação A',
        'setor_e_local': 'mineração em Minas Gerais',
        ANOT: 'Os dois valores acima são substrings literais do lede (L%d). Não há tabela de dados numéricos no caso do M04.' % caso_sec.find('p', class_='lede').sourceline,
    },
    'perguntas': {
        'numero': h3parts(caso_h3[0])[0], 'titulo': h3parts(caso_h3[0])[1],
        'natureza': f'{ANOT}: perguntas de diagnóstico que o analista faz à operação (não perguntas de avaliação do learner).',
        'itens': [{'id': f'm04-caso-q{i+1:02d}', 'ordem': i + 1, 'tema': li.find('b').get_text(),
                   'pergunta': {'html': ws(''.join(str(c) for c in li.contents if c is not li.find('b'))),
                                'texto': ws(''.join((c.get_text() if isinstance(c, Tag) else str(c)) for c in li.contents if c is not li.find('b')))},
                   'origem': origem(li, 'section#caso ol.num-list > li')}
                  for i, li in enumerate(caso_ol.find_all('li'))],
    },
    'o_que_nao_faz': {
        'numero': h3parts(caso_h3[1])[0],
        'titulo': {'html': h3parts(caso_h3[1])[1], 'texto': ws(re.sub(r'<[^>]+>', '', h3parts(caso_h3[1])[1]))},
        **txt([p for p in caso_ps if p.sourceline > caso_h3[1].sourceline][0]),
        'origem': origem(caso_h3[1], 'section#caso h3 (C.2)'),
    },
    'decisao_pedida': None,
    'decisao_nota': 'A fonte declara explicitamente que o caso não pede decisão: "Não escolhe ambiente, não recomenda fornecedor, não estima economia. As oito perguntas produzem um mapa de exposição, não uma decisão." (C.2). Um Desafio de decisão (P17) é camada Alexandria e só pode usar os fatos acima.',
    'callouts': [{'rotulo': b.find('span', class_='tag').get_text(), 'classe': ' '.join(b['class']),
                  'paragrafos': [txt(p) for p in b.find_all('p')],
                  'exibir_ao_learner': (False if 'produto' in b.find('span', class_='tag').get_text() else None),
                  'origem': origem(b, 'section#caso .box')} for b in caso_boxes],
    'vinculos': {'aulas': None, 'nota': 'O caso cita "Módulo 03" (pergunta 6) e "a Parte 4"; não declara vínculo com aula do M04.'},
    'origem': ROTEIRO[[r['ancora_html'] for r in ROTEIRO].index('caso')]['origem'],
}

# quiz: avaliar o literal var Q=[...] em node
q_start = ln_of(r'^\s*var Q=\[', SCRIPT_START)
q_end = ln_of(r'^\s*\];', q_start)
q_src = '\n'.join(LINES[q_start - 1:q_end])
Q = json.loads(subprocess.run(['node', '-e', q_src + '\nprocess.stdout.write(JSON.stringify(Q))'],
                              capture_output=True, text=True, encoding='utf-8', check=True).stdout)
q_lines = [i + 1 for i in range(q_start - 1, q_end) if re.match(r"^\s*\{q:'", LINES[i])]
f_lines = [i + 1 for i in range(q_start - 1, q_end) if re.match(r"^\s*a:\d,f:'", LINES[i])]
LETRAS = 'ABCD'
questoes = []
for i, q in enumerate(Q):
    m = re.match(r'Aula (\d\d)\.', q['f'])
    questoes.append({
        'id': f'm04-quiz-q{i+1:02d}',
        'ordem': i + 1,
        'rotulo_renderizado': f'Questão {i+1} de 10',
        'enunciado': q['q'],
        'alternativas': [{'indice': j, 'letra': LETRAS[j], 'texto': o} for j, o in enumerate(q['o'])],
        'gabarito': {'indice': q['a'], 'letra': LETRAS[q['a']], 'texto': q['o'][q['a']]},
        'explicacao': q['f'],
        'aula_citada_na_explicacao': m.group(1) if m else None,
        'origem': {'seletor': 'script var Q[%d].q' % i, 'trecho_inicial': trecho(q_lines[i]), 'linha_aprox': q_lines[i]},
        'origem_explicacao': {'seletor': 'script var Q[%d].f' % i, 'trecho_inicial': trecho(f_lines[i]), 'linha_aprox': f_lines[i]},
    })
tmpl_line = ln_of(r"Questão '\+\(i\+1\)\+' de 10", q_end)
num_line = ln_of(r"q-num'\)\.textContent=sc\+' / 10'", q_end)
avaliacao = {
    'id': 'm04-quiz',
    'tipo': 'quiz',
    'marcador': quiz_sec.find('div', class_='sec-id').find('b').get_text(),
    'rotulo': ROTEIRO[[r['ancora_html'] for r in ROTEIRO].index('quiz')]['rotulo'],
    'titulo_secao': txt(quiz_sec.find('h2')),
    'lede': txt(quiz_sec.find('p', class_='lede')),
    'criterio_literal': quiz_sec.find('p', class_='lede').find('strong').get_text(),
    'questoes': questoes,
    'faixas_de_placar_script': [
        {'condicao_codigo': 'if(sc>=8){', 'classe': 'score show pass', 'mensagem': js_str(msg_pass_line), 'linha_aprox': msg_pass_line},
        {'condicao_codigo': '}else{', 'classe': 'score show fail', 'mensagem': js_str(msg_fail_line), 'linha_aprox': msg_fail_line},
    ],
    'faixas_nota': 'condicao_codigo é o trecho literal do if/else; só `mensagem` é texto exibido. P18: nenhuma faixa declara domínio no produto.',
    'rotulos_de_interface_fonte': {
        'botao_corrigir': quiz_sec.find('button', id='q-go').get_text(),
        'botao_refazer': quiz_sec.find('button', id='q-rst').get_text(),
        'placar_template_codigo': ws(LINES[num_line - 1]),
        'cabecalho_questao_template_codigo': ws(LINES[tmpl_line - 1])[:120],
        'linhas': [quiz_sec.find('button', id='q-go').sourceline, num_line, tmpl_line],
    },
    'mecanica_fonte': {
        ANOT: True,
        'descricao': 'Uma correção para as 10 questões de uma vez (botão Corrigir), feedback idêntico para acerto e erro, marcação verde/vermelha (opt right/wrong), botão Refazer limpa seleção, sem persistência. Questão não respondida conta como erro e ainda recebe o feedback.',
        'gabarito_sempre_b': all(q['a'] == 1 for q in Q),
        'nota_gabarito': 'Todas as 10 questões têm gabarito no índice 1 (alternativa B). Registro de fato da fonte; embaralhar é decisão da camada Alexandria.',
    },
    'vinculos': {'nota': 'Vínculo com aula só existe como prefixo "Aula NN." na explicação (aula_citada_na_explicacao).'},
    'origem': ROTEIRO[[r['ancora_html'] for r in ROTEIRO].index('quiz')]['origem'],
    'origem_script': {'seletor': 'script var Q', 'trecho_inicial': trecho(q_start), 'linha_aprox': q_start},
}

checklist_final = {
    'id': 'm04-checklist-final',
    'titulo': txt(final_sec.find('h2')),
    'lede': txt(final_sec.find('p', class_='lede')),
    'contagem_declarada_prosa': re.match(r'(\S+ \S+)\.', text(final_sec.find('p', class_='lede'))).group(1),
    'itens': final_items,
    'nota': 'Os mesmos 20 itens aparecem em modulo.json criterio.itens[3] (mesmos ids).',
    'origem': origem(final_sec.find('h2'), 'section#final h2'),
}

# exercícios
ex_sec = SEC['ex']
code_ex = {m.group(1): [None, m.group(1), unq(m.group(2)), m.group(3), unq(m.group(4)), unq(m.group(5))]
           for m in re.finditer(r'id: "m04-ex-(\d\d)",\s*kind: \'discursiva\' as const,\s*prompt: ' + JSQ + r',\s*points: (\d+),\s*config: \{ tag: ' + JSQ + r', gabarito: ' + JSQ + r' \}', TS)}


def norm_cmp(s):
    s = htmlmod.unescape(re.sub(r'<[^>]+>', '', s))
    return ws(s)


exercicios = []
for det in ex_sec.find_all('details'):
    summ = det.find('summary')
    num, titulo = summ.get_text().split(' · ', 1)
    ps = det.find('div', class_='det-bd').find_all('p')
    en = ps[0]
    en_html = ws(''.join(str(c) for c in en.contents if not (isinstance(c, Tag) and 'term' in (c.get('class') or []))))
    gab_ps = ps[1:]
    first_g = ws(''.join(str(c) for c in gab_ps[0].contents if not (isinstance(c, Tag) and 'term' in (c.get('class') or []))))
    gab = [first_g] + [inner(p) for p in gab_ps[1:]]
    alltext = ' '.join(p.get_text() for p in ps)
    code = code_ex.get(num)
    src_prompt = norm_cmp(en_html)
    src_gab = ' '.join(norm_cmp(g) for g in gab)
    exercicios.append({
        'id': f'm04-ex-{num}',
        'tag_summary': summ.get_text(),
        'numero': num,
        'titulo': titulo,
        'rotulos_fonte': [s.get_text() for s in det.find_all('span', class_='term')],
        'enunciado': {'html': en_html, 'texto': norm_cmp(en_html)},
        'resposta_referencia': [{'html': g, 'texto': norm_cmp(g)} for g in gab],
        'criterio': None,
        'criterio_nota': 'A fonte não declara critério por exercício; só a instrução geral do lede de §Ex.',
        'aula_vinculada': None,
        'sem_aula_P9': True,
        'mencao_aula_em_texto': re.findall(r'[Aa]ula\s*\d+', alltext),
        'mencao_outro_exercicio': re.findall(r'exercício \d\d', alltext),
        'codigo': {
            'id': f'm04-ex-{num}' if code else None,
            'prompt_igual': (code[2] == src_prompt) if code else None,
            'tag_igual': (code[4] == summ.get_text()) if code else None,
            'gabarito_igual_texto_concatenado': (ws(code[5]) == src_gab) if code else None,
            'gabarito_diferencas': ([{'fonte': repr(src_gab[o[1] - 12:o[2] + 12]), 'codigo': repr(code[5][o[3] - 12:o[4] + 12])}
                                     for o in difflib.SequenceMatcher(None, src_gab, code[5], autojunk=False).get_opcodes() if o[0] != 'equal']
                                    if code else None),
            'gabarito_preserva_paragrafos': False if code else None,
            'gabarito_preserva_html_inline': False if code else None,
            'points': int(code[3]) if code else None,
            'points_nota': 'points: 1 não tem origem na fonte.' if code else None,
        },
        'origem': origem(det, 'section#ex details'),
    })

exercicios_obj = {
    'id': 'm04-exercicios',
    'titulo_secao': txt(ex_sec.find('h2')),
    'lede': txt(ex_sec.find('p', class_='lede')),
    'itens': exercicios,
    'soltos_P9': [e['id'] for e in exercicios],
    'nota': 'Os 9 exercícios são soltos: o <summary> traz só "NN · Título" e a varredura por "Aula NN" em enunciado e gabarito dá zero. O exercício 02 cita "exercício 01" (dependência entre exercícios, não vínculo de aula).',
    'origem': ROTEIRO[[r['ancora_html'] for r in ROTEIRO].index('ex')]['origem'],
}

# referências
ref_sec = SEC['ref']
DATE_RE = re.compile(r'(\d{1,2}(?:º)? de [a-zç]+ de \d{4}|\d{1,2}/\d{1,2}/\d{4}|(?:de )?(?:janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro) de \d{4}|\d{4})')
referencias = []
for i, li in enumerate(ref_sec.find('ul', class_='ref-list').find_all('li')):
    src = li.find('span', class_='src')
    a = li.find('a')
    desc_nodes = [c for c in li.contents if c is not src and c is not a and not (isinstance(c, Tag) and c.name == 'br')]
    desc_html = ser(desc_nodes)
    desc_txt = ws(''.join((c.get_text() if isinstance(c, Tag) else str(c)) for c in desc_nodes))
    referencias.append({
        'id': f'm04-ref-{i+1:02d}',
        'rotulo_src': src.get_text(),
        'instituicao': src.get_text().split(' · ')[0] if ' · ' in src.get_text() else None,
        'titulo_ou_recorte': src.get_text().split(' · ', 1)[1] if ' · ' in src.get_text() else src.get_text(),
        'descricao': {'html': desc_html, 'texto': desc_txt},
        'url': a['href'] if a else None,
        'texto_do_link': a.get_text() if a else None,
        'datas_citadas': sorted(set(m.group(0) for m in DATE_RE.finditer(desc_txt + ' ' + src.get_text()) if not re.fullmatch(r'\d{4}', m.group(0)) or True)),
        'data_verificacao': None,
        'tipo_fonte': None,
        'li_html': inner(li),
        'origem': origem(li, 'section#ref ul.ref-list > li'),
    })
referencias_obj = {
    'id': 'm04-referencias',
    'titulo_secao': txt(ref_sec.find('h2')),
    'lede': txt(ref_sec.find('p', class_='lede')),
    'itens': referencias,
    'nota': f'{ANOT}: instituicao/titulo_ou_recorte são o rótulo span.src dividido em " · " (quando há). datas_citadas são substrings literais que casam padrão de data/ano (inclui anos soltos); nenhuma é data de verificação. data_verificacao e tipo_fonte são null: a fonte não declara. Colofão de versão: não há no M04 (rodapé sem versão/data).',
    'no_codigo': 'Nenhuma das 11 referências está em src/ como referência (BibliotecaView não tem M04; references: [] nas 7 aulas). A nota de fonte da Aula 02 (Despacho 3.850) está no corpo da aula.',
    'origem': ROTEIRO[[r['ancora_html'] for r in ROTEIRO].index('ref')]['origem'],
}

# glossário
lex_sec = SEC['lex']
GL = TS_GLOSS.read_text(encoding='utf-8')
code_terms = {}
for m in re.finditer(r'id: "(gl-m04-[^"]+)",\s*term: ' + JSQ + r',\s*unit: ' + JSQ + r',\s*definition:\s*' + JSQ + r',\s*aulaIds: \[(.*?)\]', GL, re.S):
    code_terms[unq(m.group(2))] = {'id': m.group(1), 'unit': unq(m.group(3)), 'definition': unq(m.group(4)), 'aulaIds': re.findall(r'"(.*?)"', m.group(5))}
familias = []
termos = []
for det in lex_sec.find_all('details'):
    summ = det.find('summary').get_text()
    fam, cnt = summ.rsplit(' · ', 1)
    fam_terms = det.find('div', class_='det-bd').find_all('p')
    familias.append({'rotulo_summary': summ, 'familia': fam, 'contagem_declarada': cnt,
                     'contagem_medida': len(fam_terms), 'linha_aprox': det.sourceline})
    for p in fam_terms:
        t = p.find('span', class_='term')
        term_raw = t.get_text()
        term = term_raw[:-1] if term_raw.endswith('.') else term_raw
        d_html = ws(''.join(str(c) for c in p.contents if c is not t))
        d_txt = norm_cmp(d_html)
        c = code_terms.get(term)
        termos.append({
            'id': f'm04-lex-{slug(term)}',
            'termo_span_literal': term_raw,
            'termo': term,
            'familia': fam,
            'definicao': {'html': d_html, 'texto': d_txt},
            'vinculos': {'aulas': None},
            'codigo': ({'id': c['id'], 'unit_igual_familia': c['unit'] == fam,
                        'definicao_igual': ws(htmlmod.unescape(c['definition'])) == d_txt,
                        'aulaIds_codigo': c['aulaIds']} if c else None),
            'no_codigo': bool(c),
            'origem': origem(p, 'section#lex details .det-bd > p'),
        })
lex_nota_p = lex_sec.find('div', class_='wrap').find_all('p', recursive=False)[-1]
src_term_names = {t['termo'] for t in termos}
glossario = {
    'id': 'm04-glossario',
    'titulo_secao': txt(lex_sec.find('h2')),
    'lede': txt(lex_sec.find('p', class_='lede')),
    'familias': familias,
    'termos': termos,
    'termos_nao_reintroduzidos': {**txt(lex_nota_p), 'origem': origem(lex_nota_p, 'section#lex > p (nota final)')},
    'comparacao_codigo': {
        ANOT: True,
        'termos_fonte': len(termos),
        'termos_codigo_gl_m04': len(code_terms),
        'faltam_no_codigo': sorted(src_term_names - set(code_terms)),
        'so_no_codigo': sorted(set(code_terms) - src_term_names),
        'definicao_divergente': [t['termo'] for t in termos if t['codigo'] and not t['codigo']['definicao_igual']],
        'familia_divergente': [t['termo'] for t in termos if t['codigo'] and not t['codigo']['unit_igual_familia']],
        'aulaIds_nota': 'aulaIds do código foram derivados pela Wave 34 (âncora estrutural); a fonte não declara vínculo termo→aula.',
    },
    'origem': ROTEIRO[[r['ancora_html'] for r in ROTEIRO].index('lex')]['origem'],
}

divergencias_aparato = [
    div('div-m04-caso-parte4', 'Caso rotulado "Parte 4" (P17)', 'fonte: "§Caso · Operação A — Parte 4"; lede cita Partes 1 a 3', 'P17: produto usa "Caso — Operação A", sem "Partes" como estrutura'),
    div('div-m04-quiz-gabarito-b', 'Gabarito do quiz sempre na alternativa B', 'fonte: a:1 nas 10 questões', 'Padrão previsível; nenhuma alteração na camada fonte'),
    div('div-m04-quiz-aula-q10', 'Aula citada no feedback da Q10', 'Q10 (leilão de reserva de capacidade) cita "Aula 03"', 'O tema também é tratado na Aula 04 (4.3) e em §Voz/§Final; registrado sem escolher'),
    div('div-m04-ex-codigo-gabarito', 'Gabarito dos exercícios no código achata a estrutura', 'fonte: 2–3 <p> por gabarito, com <strong>/<em>', 'código (MODULO_04_EXERCICIOS_SOLTOS): parágrafos concatenados com espaço e tags removidas; points: 1 sem origem'),
    div('div-m04-ex-codigo-espaco', 'Espaço espúrio antes da pontuação no código (Ex·06, Ex·08)',
        'fonte: "<strong>R$ 209,69/MWh</strong>." (sem espaço)',
        'código: "R$ 209,69/MWh ." — 1 ocorrência no Ex·06 e 4 no Ex·08 (ver exercicios.itens[].codigo.gabarito_diferencas)'),
    div('div-m04-corpo-codigo-residuos', 'Resíduos no corpo das aulas, vistos de passagem (fora do escopo deste grupo)',
        'fonte: <span class="hl">margem inframarginal</span> (Aula 01, 1.1); lede da Aula 02 "…o preço de uma <em>diferença</em>."',
        'código: 7 tags "</b>" órfãs em MODULO_04_CORPO, uma para cada span.hl das aulas (a 8ª span.hl da fonte está no §00, fora do código); ex.: "margem inframarginal</b>" (aula-04-01). E "diferença ." em MODULO_04_LEAD aula-04-02. A conferir na extração das aulas.'),
    div('div-m04-lex-contagem', 'Contagem do léxico', f'prosa "Cinquenta e oito termos" e summaries 15+14+16+13', f'markup: {len(termos)} termos; código: {len(code_terms)} gl-m04 — concordam',
        extra={'severidade': 'nenhuma'}),
    div('div-m04-catalogo-familia-contratos', 'Catálogo canônico lista 15 nomes na família "Contratos, cláusulas e ambientes (16)"', 'fonte: 16 termos, o primeiro é "PPA"', 'catálogo canônico: começa em "PPA físico" (omite "PPA")'),
    div('div-m04-ref-sem-versao', 'Referências sem data de verificação', 'fonte: datas só dentro das descrições (datas de atos)', 'lede: "verifique na data de uso"; D5 exige última verificação — ausente'),
    div('div-m04-final-vinculo-aula', '§Final diz que cada item aponta uma aula, mas nenhum item declara a aula', 'lede do §Final: "Cada uma que falhar aponta uma aula específica"', 'itens: zero referência "Aula NN"'),
]

aparato = {
    'modulo': '04',
    'fonte': str(SRC).replace('\\', '/'),
    'camada': 'fonte',
    'metodo': 'Python 3 + BeautifulSoup (html.parser) sobre a árvore; quiz avaliado a partir do literal `var Q=[…]` do <script> via node. extratores/m04_extrator.py.',
    'caso': caso,
    'avaliacao': avaliacao,
    'checklist_final': checklist_final,
    'exercicios': exercicios_obj,
    'referencias': referencias_obj,
    'glossario': glossario,
    'divergencias': divergencias_aparato,
}

# ═════════════════════════════════════════════════════════════════════════
# GRUPO INSTRUMENTOS
# ═════════════════════════════════════════════════════════════════════════
H = json.loads(HARNESS.read_text(encoding='utf-8'))
CALC = TS_CALC.read_text(encoding='utf-8')
code_inst = {}
for m in re.finditer(r'\{\s*id: "(m04-inst-\d\d)",\s*kind: "(\w+)",\s*title: "(.*?)",\s*formula: (null|".*?"),\s*fields: \[(.*?)\],\s*outputs: \[(.*?)\],\s*note: (null|".*?"),\s*\}', TS, re.S):
    code_inst[m.group(1)] = {
        'kind': m.group(2), 'title': m.group(3), 'formula': m.group(4), 'note': m.group(7),
        'fields': [dict(zip(['id', 'label', 'unit', 'kind', 'defaultValue', 'min', 'max', 'step'], f)) for f in
                   re.findall(r'\{ id: "(.*?)", label: "(.*?)", unit: "(.*?)", kind: "(.*?)", defaultValue: ([-\d.]+), min: ([-\d.]+), max: ([-\d.]+), step: ([-\d.]+) \}', m.group(5))],
        'outputs': [dict(zip(['id', 'label', 'unit'], o)) for o in re.findall(r'\{ id: "(.*?)", label: "(.*?)", unit: (null|".*?") \}', m.group(6))],
    }


def script_block(n):
    start = ln_of(r'/\* ---------- INST 0%d' % n, SCRIPT_START)
    end = ln_of(r'^\}\)\(\);', start)
    return start, end


insts = []
for inst in soup.find_all('div', class_='inst'):
    idl = inst.find('span', class_='id').get_text()
    num = int(idl[-2:])
    key = f'm04-inst-{num:02d}'
    sec = inst.find_parent('section')
    rot = next(r for r in ROTEIRO if r['ancora_html'] == sec['id'])
    fields = []
    for f in inst.find_all('div', class_='field'):
        lab = f.find('label')
        unit = lab.find('span', class_='unit')
        nin = f.find('input', type='number')
        rin = f.find('input', type='range')
        fields.append({
            'rotulo': ws(''.join(str(c) for c in lab.contents if c is not unit)),
            'unidade': unit.get_text() if unit else None,
            'id_number': nin['id'], 'id_range': rin['id'],
            'padrao': float(nin['value']), 'min': float(nin['min']), 'max': float(nin['max']), 'passo': float(nin['step']),
            'range_igual_number': all(nin[k] == rin[k] for k in ('min', 'max', 'step', 'value')),
            'origem': origem(f, f'div.inst({idl}) .field'),
        })
    readouts = []
    for ro in inst.find_all('div', class_='ro'):
        nel = ro.find('div', class_='n')
        extra = [d for d in ro.find_all('div', recursive=False) if d not in (ro.find('div', class_='k'), nel)]
        readouts.append({
            'id': nel['id'], 'rotulo': ro.find('div', class_='k').get_text(),
            'destaque': 'gold' in nel['class'],
            'markup_inicial': inner(nel),
            'unidade_no_markup_inicial': (nel.find('span', class_='u').get_text() if nel.find('span', class_='u') else None),
            'sub_rotulo': (extra[0].get_text() if extra else None),
            'origem': origem(ro, f'div.inst({idl}) .readout .ro'),
        })
    s0, s1 = script_block(num)
    block = LINES[s0 - 1:s1]
    # expressão de cada saída
    for r in readouts:
        for j, l in enumerate(block):
            mm = re.search(r"\$id\('%s'\)\.(textContent|innerHTML)=(.*);\s*$" % re.escape(r['id']), l)
            if mm:
                r['expressao_script'] = {'propriedade': mm.group(1), 'codigo': mm.group(2), 'linha_aprox': s0 + j}
        pd = H['padrao'][key]['original']
        r['valor_padrao_renderizado'] = pd['saidas'][r['id']]
        r['valor_padrao_bruto'] = pd['saidas_bruto'][r['id']]
        r['tipo_saida'] = 'textual' if r['id'] in ('i1-m', 'i1-lim', 'i2-mes', 'i5-lo', 'i5-w', 'i7-w') else 'numerica_formatada'
    # linhas de cálculo: do "function run(){" até a primeira atribuição de saída
    run_i = next(j for j, l in enumerate(block) if 'function run(){' in l)
    stop = re.compile(r"\$id\('i%d-[a-z]+'\)\.(textContent|innerHTML)=|var s=|var yMax=|var maxc=|var topo=" % num)
    out_i = next(j for j, l in enumerate(block) if j > run_i and stop.search(l))
    end_run = next(j for j, l in enumerate(block) if j > run_i and re.match(r'^  \}\s*$', l))
    calc_lines = [{'linha': s0 + j, 'codigo': block[j].rstrip()} for j in range(run_i + 1, out_i) if block[j].strip()]
    vd_prefix = [{'linha': s0 + j, 'codigo': block[j].strip()} for j in range(out_i, end_run) if re.match(r"\s*var v=\$id", block[j])]
    run_full = [{'linha': s0 + j, 'codigo': block[j].rstrip()} for j in range(run_i, end_run + 1)]
    consts = [{'linha': s0 + j, 'codigo': block[j].strip()} for j in range(0, run_i) if re.search(r'var |\{n:', block[j])]
    # ramos do veredito
    ramos = []
    for j, l in enumerate(block):
        mm = re.match(r"\s*(if|else if|else)\s*(\(.*?\))?\s*vd\(v,'(\w+)',(.*)\);\s*$", l)
        if mm:
            ramos.append({'ordem': len(ramos) + 1, 'palavra': mm.group(1), 'condicao': (mm.group(2) or None),
                          'classe': mm.group(3), 'texto_expressao_js': mm.group(4), 'linha_aprox': s0 + j})
    pad = H['padrao'][key]
    def ramo_casa(r, vtxt):
        # os trechos literais '...' da expressão JS aparecem, em ordem, no veredito renderizado
        pos = 0
        for lit in re.findall(r"'((?:[^'\\]|\\.)*)'", r['texto_expressao_js']):
            k = vtxt.find(lit, pos)
            if k < 0:
                return False
            pos = k + len(lit)
        return True

    cands = [r['ordem'] for r in ramos
             if r['classe'] == pad['original']['classe'].split()[-1] and ramo_casa(r, pad['original']['veredito'])]
    assert len(cands) == 1, (key, cands)
    ramo_padrao = cands[0]
    disc = inst.find('p', class_='disc')
    legend = inst.find('div', class_='chart-legend')
    svg = inst.find('svg')
    # posição na aula
    prev = inst.find_previous_sibling(lambda t: isinstance(t, Tag))
    nxt = inst.find_next_sibling(lambda t: isinstance(t, Tag))
    prev_h3 = inst.find_previous('h3')
    aula_txt = ' '.join(p.get_text() for p in sec.find_all(['p', 'li']) if not p.find_parent('div', class_='inst'))
    mencoes = [ws(m.group(0)) for m in re.finditer(r'[^.]*\b(simulador|[Oo] instrumento acima|desta página)\b[^.]*\.', aula_txt)]
    ci = code_inst.get(key)
    calc_ported = f"'{key}':" in CALC
    cmp_fields = []
    if ci:
        for f, cf in zip(fields, ci['fields']):
            cmp_fields.append({'id_fonte': f['id_number'], 'id_codigo': cf['id'],
                               'rotulo_igual': cf['label'] == f['rotulo'], 'unidade_igual': cf['unit'] == f['unidade'],
                               'faixa_igual': (float(cf['min']), float(cf['max']), float(cf['step']), float(cf['defaultValue'])) == (f['min'], f['max'], f['passo'], f['padrao'])})
    cod_out_ids = [o['id'] for o in ci['outputs']] if ci else []
    unidades_cod = {o['id']: (None if o['unit'] == 'null' else o['unit'].strip('"')) for o in ci['outputs']} if ci else {}
    divergencias_cod = []
    faltam_saidas = [r['id'] for r in readouts if r['id'] not in cod_out_ids]
    if faltam_saidas:
        divergencias_cod.append(f'Saídas ausentes no código (texto não cabe em Record<string, number>): {", ".join(faltam_saidas)}.')
    for r in readouts:
        if r['id'] in unidades_cod and r['unidade_no_markup_inicial'] is None:
            # unidade vem só do script (innerHTML) — conferir
            u = re.search(r"<span class=\"u\">(.*?)</span>", json.dumps(r['valor_padrao_bruto'], ensure_ascii=False).replace('\\"', '"'))
            u = u.group(1) if u else None
        else:
            u = r['unidade_no_markup_inicial']
            ub = re.search(r'<span class="u">(.*?)</span>', r['valor_padrao_bruto'].get('innerHTML', ''))
            u = ub.group(1) if ub else u
        r['unidade_renderizada'] = u
        if r['id'] in unidades_cod and unidades_cod[r['id']] != u and u is not None:
            divergencias_cod.append(f"Unidade de {r['id']}: fonte renderiza \"{u}\", código declara {unidades_cod[r['id']]!r}.")
    if ci and ci['note'] == 'null':
        divergencias_cod.append('note: null — a fonte tem p.disc (texto de contexto) e p.inst-intro; nenhum dos dois está no Instrument.')
    if ci and ci['formula'] == 'null':
        divergencias_cod.append('formula: null — coerente: a fonte não exibe fórmula (div.formula ausente).')
    divergencias_cod.append('Formatação: a porta emite número cru em valores; a fonte formata cada readout (brl/brl2/mi/num; ver saidas[].expressao_script).')
    extra_fmt = {
        'm04-inst-03': 'Onde a fonte mostra texto em vez de número a porta emite 0: i3-g "zero" (gap<=0) e i3-k "não precisa" (gap<=0).',
        'm04-inst-04': 'Onde a fonte mostra "—" (somaMW=0) em i4-c e i4-m, a porta emite 0.',
        'm04-inst-06': 'i6-r: a fonte prefixa "+ " ou "− " e formata o módulo com mi(); a porta emite o número com sinal.',
        'm04-inst-07': 'i7-e: a fonte mostra "−N%" quando há sobrecontratação; a porta emite -over (mesmo sinal).',
    }
    if key in extra_fmt:
        divergencias_cod.append(extra_fmt[key])
    if bars := inst.find('div', class_='bars'):
        divergencias_cod.append(f"Visual não portado: barras #{bars['id']} (desenhadas pelo script).")
    if svg:
        divergencias_cod.append(f"Visual não portado: gráfico SVG #{svg['id']} com legenda de {len(legend.find_all('span'))} itens.")
    divergencias_cod.append('Classe do veredito (ok/att/per → verde/âmbar/vermelho) não portada; as cores são semáforo e o sistema de design proíbe semáforo.')
    divergencias_cod.append('Entrada: na fonte o campo numérico vazio/NaN volta ao valor do deslizador e é limitado à faixa (link()); na porta, vazio vira 0 e não há clamp.')
    divergencias_cod.append('Posição: a fonte coloca o instrumento dentro do fluxo da aula; MODULO_04_CORPO não tem bloco de instrumento, e aula.instruments é renderizado à parte (não verificado na tela).')
    harness_cmp = H['comparacao'][key]
    obs_fonte = {
        'm04-inst-01': [
            'Ramo inalcançável (L1424): `else if(price>PLD_MAX_H){…lim=\'teto horário\';}` nunca executa. No déficit o preço é igualado a PLD_MAX_H (não maior) e cai no ramo seguinte; o readout "Limite aplicado" mostra "acima do teto estrutural" com "Usina marginal" = "déficit". Provado no espaço inteiro (1.145.277 combinações; extratores/m04_inst01_limite.mjs): rótulos alcançados = nenhum, piso R$ 57,31, acima do teto estrutural.',
            'Com óleo na margem (CVU 900) o preço formado é R$ 900/MWh, acima do PLDmax estrutural (R$ 785,27) e abaixo do horário: o simulador não aplica o teto estrutural (que a Aula 02 descreve como teto da média do período).',
            'Exercício 01 usa eólica a R$ 20/MWh e capacidades diferentes; o simulador usa eólica CVU 12 e a frota fixa da nota. Cenários distintos, não contradição.',
        ],
        'm04-inst-02': ['A legenda fixa o teto em "R$ 785,27" e o piso em "R$ 57,31"; a curva é limitada por PLD_MAX_H (1.611,04), não pelo estrutural. A nota declara "Superfície de resposta monotônica com sazonalidade fixa".'],
        'm04-inst-04': ['Lances fixos (BIDS, L1539–1546) diferem das propostas do Exercício 06 (A–D). Cenários distintos.'],
        'm04-inst-06': ['A faixa do PLD realizado (57–1611) usa os limites 2026 arredondados (PLD_MIN 57,31 → 57; PLD_MAX_H 1.611,04 → 1611).'],
        'm04-inst-05': ['A faixa "PLD médio do cenário" começa em 57 (PLD_MIN arredondado para baixo); a curva mensal é limitada em PLD_MIN=57,31.'],
    }.get(key, [])
    insts.append({
        'id': key,
        'id_literal_fonte': idl,
        'titulo': inst.find('span', class_='nm').get_text(),
        'kind_taxonomia': 'simulador',
        'kind_nota': 'Campos numéricos (par number+range) → readouts → veredito por ramos. "Mesa de hedge" (Inst · 06) tem a mesma mecânica; taxonomia já registra como simulador.' if num == 6 else 'Campos numéricos (par number+range) → readouts → veredito por ramos.',
        'aula': rot['aula'],
        'aula_id_codigo': f"aula-04-{rot['aula']}",
        'pergunta': None,
        'pergunta_nota': 'O instrumento não tem pergunta própria. A intro (inst-intro) é instrução, não pergunta; a pergunta de previsão, se houver, é camada Alexandria (P19).',
        'intro': {**txt(inst.find('p', class_='inst-intro')), 'origem': origem(inst.find('p', class_='inst-intro'), f'div.inst({idl}) p.inst-intro')},
        'entradas': fields,
        'saidas': readouts,
        'veredito': {'id': inst.find('div', class_='verdict')['id'], 'markup_inicial': inst.find('div', class_='verdict').get_text(),
                     'ramos': ramos, 'ramo_no_cenario_padrao': ramo_padrao},
        'script': {'linhas': [s0, s1], 'constantes_e_frota': consts, 'calculo': calc_lines,
                   'preambulo_do_veredito': vd_prefix, 'run_completo': run_full,
                   'nota': 'calculo = linhas de run() entre a leitura das entradas e a primeira saída/desenho; run_completo inclui desenho (SVG/barras) e ramos. Tudo literal.'},
        'constantes_globais_usadas': [c for c in ['PLD_MIN', 'PLD_MAX_H', 'PLD_MAX_E', 'MES'] if any(c in l for l in block)],
        'visual': {
            'barras': (inst.find('div', class_='bars')['id'] if inst.find('div', class_='bars') else None),
            'svg': ({'id': svg['id'], 'aria_label': svg.get('aria-label'),
                     'legenda': [ws(sp.get_text()) for sp in legend.find_all('span')]} if svg else None),
        },
        'cenario_padrao': {
            'entradas': pad['entradas'],
            'saidas_renderizadas': pad['original']['saidas'],
            'veredito': pad['original']['veredito'],
            'classe_veredito': pad['original']['classe'],
            'metodo': 'Execução do <script> original em DOM simulado (m04_harness_script.mjs), Node %s, toLocaleString pt-BR.' % subprocess.run(['node', '--version'], capture_output=True, text=True).stdout.strip(),
        },
        'nota_didatica': {**txt(disc), 'origem': origem(disc, f'div.inst({idl}) p.disc')},
        'fonte_dos_numeros': None,
        'fonte_dos_numeros_nota': (
            'Limites PLD_MIN/PLD_MAX_H/PLD_MAX_E: comentário do script "limites regulatórios vigentes 2026 — ANEEL Despacho 3.850/2025" (L%d), confirmado em §Ref item 1. ' % ln_of(r'limites regulatórios vigentes 2026')
            if any(c in ''.join(block) for c in ['PLD_MIN', 'PLD_MAX_H', 'PLD_MAX_E']) else '') +
            'Demais parâmetros (frota, curvas, lances, preços de camada, sazonalidades) sem fonte externa declarada; a própria nota diz "Didático/ilustrativo — não usar para dimensionamento real". Na interface: cenário didático, fonte externa não declarada (P19).',
        'tolerancias': None,
        'tolerancias_nota': 'Nenhuma tolerância declarada na fonte.',
        'observacoes_fonte': obs_fonte,
        'invocacao': {
            'secao_anterior_h3': {'numero': prev_h3.find('span', class_='num').get_text(), 'linha_aprox': prev_h3.sourceline},
            'elemento_anterior': {'tag': prev.name, 'classe': ' '.join(prev.get('class') or []), 'trecho': ws(prev.get_text())[:120], 'linha_aprox': prev.sourceline},
            'elemento_seguinte': {'tag': nxt.name, 'classe': ' '.join(nxt.get('class') or []), 'trecho': ws(nxt.get_text())[:120], 'linha_aprox': nxt.sourceline},
            'mencoes_no_texto_da_aula': mencoes,
            'origem': origem(inst, f'section#{sec["id"]} div.inst'),
        },
        'codigo': {
            'status': 'divergente' if ci and calc_ported else ('não portado' if not ci else 'divergente'),
            'status_nota': 'Cálculo e veredito portados fielmente (harness: %d combinações, %d vereditos divergentes); a divergência é de contrato/apresentação, listada abaixo.' % (harness_cmp['combinacoes'], harness_cmp['veredito_divergente']),
            'instrument_em': 'src/lib/data/alexandria-modulo-04-content.ts (INSTRUMENTOS_MODULO_04)',
            'calculadora_em': 'src/lib/data/alexandria-instrument-calculators.ts' if calc_ported else None,
            'title_igual': (ci['title'] == inst.find('span', class_='nm').get_text()) if ci else None,
            'kind_codigo': ci['kind'] if ci else None,
            'campos': cmp_fields,
            'saidas_codigo': cod_out_ids,
            'harness': harness_cmp,
            'divergencias': divergencias_cod,
        },
    })

instrumentos = {
    'modulo': '04',
    'fonte': str(SRC).replace('\\', '/'),
    'camada': 'fonte',
    'metodo': 'Markup por bs4; lógica e ramos lidos linha a linha do <script> (texto literal, sem reescrita); cenário-padrão e comparação com a porta por execução do script original em DOM simulado (extratores/m04_harness_script.mjs).',
    'constantes_globais': [{'linha': n, 'codigo': ws(LINES[n - 1])} for n in range(ln_of(r'limites regulatórios vigentes 2026'), ln_of(r'^var MES=') + 1)],
    'formatadores_script': [{'linha': n, 'codigo': ws(LINES[n - 1])} for n in range(ln_of(r'^function brl\('), ln_of(r'^function vd\(') + 1)],
    'ligacao_campos_script': {'linhas': [ln_of(r'^function link\('), ln_of(r'^function link\(') + 11],
                              'codigo': '\n'.join(LINES[ln_of(r'^function link\(') - 1: ln_of(r'^function link\(') + 11])},
    'instrumentos': insts,
    'instrumentos_de_modulo': [],
    'instrumentos_de_modulo_nota': 'Nenhum instrumento fora de aula (sem § Lab).',
    'nao_instrumentos_interativos': {
        ANOT: True,
        'explicadores_tres_niveis': len(lv_index),
        'nota': 'Os 6 div.lv (abas Criança de 12 anos / Executivo / Especialista) são interativos mas não calculam; pertencem ao corpo das aulas e não entram aqui.',
    },
}

# ═════════════════════════════════════════════════════════════════════════
# VERIFICAÇÃO: todo campo de conteúdo é substring da fonte
# ═════════════════════════════════════════════════════════════════════════
NORM_RAW = ws(RAW)
NORM_TXT = ws(htmlmod.unescape(re.sub(r'<[^>]+>', ' ', RAW)))
NORM_TXT2 = ws(htmlmod.unescape(re.sub(r'<[^>]+>', '', RAW)))
SKIP_KEYS = {'nota', 'id', 'tipo', 'origem', 'trecho_inicial', 'seletor', ANOT, 'tema', 'leitura_a', 'leitura_b',
             'onde', 'metodo', 'fonte', 'camada', 'status', 'status_nota', 'kind_nota', 'divergencias', 'natureza',
             'instrument_em', 'calculadora_em', 'saidas_renderizadas', 'veredito', 'valor_padrao_renderizado',
             'valor_padrao_bruto', 'classe_veredito', 'codigo', 'comparacao_codigo', 'harness', 'cenario_padrao',
             'marcacao_p14', 'marcacao_p14_nota', 'kind_taxonomia', 'aula_id_codigo', 'slug', 'rotulo_renderizado',
             'tipo_saida', 'unidade_renderizada', 'datas_citadas', 'faixas_nota', 'mecanica_fonte', 'contagem_medida',
             'aula_citada_na_explicacao', 'mencoes_no_texto_da_aula', 'trecho', 'palavra', 'condicao', 'texto_expressao_js',
             'condicao_codigo', 'classe', 'href', 'url', 'empresa', 'setor_e_local', 'sem_aula_P9', 'soltos_P9',
             'id_number', 'id_range', 'propriedade', 'observacoes_fonte', 'constantes_e_frota', 'calculo', 'preambulo_do_veredito', 'run_completo', 'constantes_globais',
             'formatadores_script', 'ligacao_campos_script', 'placar_template_codigo', 'cabecalho_questao_template_codigo',
             'no_codigo', 'vinculos', 'exibir_ao_learner', 'catalogo_canonico_escala', 'catalogo_repo_bloco04',
             'catalogo_canonico_cabecalho', 'o_que_o_codigo_nao_tem', 'prosa_map', 'pill_hero', 'termo', 'numero',
             'parte_nota', 'decisao_nota', 'perguntas_nota', 'pergunta_nota', 'eixos_nota', 'trilha_nota', 'tradutor_nota',
             'resultado_esperado_nota', 'fonte_dos_numeros_nota', 'tolerancias_nota', 'criterio_nota', 'points_nota',
             'nota_gabarito', 'aulaIds_nota', 'instrumentos_de_modulo_nota', 'secao', 'instituicao', 'titulo_ou_recorte',
             'aria_label', 'legenda', 'ancora_html', 'aula', 'rotulo_catalogo', 'titulo_catalogo', 'title_codigo',
             'subtitle_codigo', 'h2_fonte', 'rotulo_sec_id_fonte', 'titulo_cartao_map_fonte', 'descricao',
             'id_literal_fonte', 'unidade_no_markup_inicial', 'markup_inicial', 'contagem_declarada_prosa', 'sub_rotulo'}
checked = 0
fails = []


def norm_check(s):
    global checked
    if not isinstance(s, str) or len(s.strip()) < 2:
        return
    checked += 1
    a = ws(s)
    if a in NORM_RAW or ws(htmlmod.unescape(a)) in NORM_TXT or ws(htmlmod.unescape(a)) in NORM_TXT2:
        return
    # html com espaços colapsados entre tags
    if ws(re.sub(r'>\s+<', '><', a)) in ws(re.sub(r'>\s+<', '><', RAW)):
        return
    # string JS (quiz): comparar contra o literal do script com escapes
    if a.replace("'", "\\'") in NORM_RAW:
        return
    fails.append(a[:120])


def walk(o, key=None):
    if isinstance(o, dict):
        for k, v in o.items():
            if k in SKIP_KEYS and k not in ('descricao',):
                continue
            walk(v, k)
        # descricao de cartão/ref: conteúdo real
        if isinstance(o.get('descricao'), dict):
            walk(o['descricao'], 'descricao')
    elif isinstance(o, list):
        for v in o:
            walk(v, key)
    elif isinstance(o, str):
        norm_check(o)


for obj in (modulo, aparato, instrumentos):
    walk(obj)

# origem: trecho_inicial está na linha declarada
orig_bad = []


def walk_orig(o):
    if isinstance(o, dict):
        if 'trecho_inicial' in o and 'linha_aprox' in o:
            n = o['linha_aprox']
            if not any(o['trecho_inicial'] in LINES[k].strip() for k in range(max(0, n - 4), min(len(LINES), n + 3))):
                orig_bad.append(o)
        for v in o.values():
            walk_orig(v)
    elif isinstance(o, list):
        for v in o:
            walk_orig(v)


for obj in (modulo, aparato, instrumentos):
    walk_orig(obj)

# cobertura por token (§5) nas seções de aparato + tese/map/hero
def tokens(s):
    return re.findall(r'\w+', htmlmod.unescape(s).lower())


def collect(o, acc):
    if isinstance(o, dict):
        for k, v in o.items():
            if k in ('texto', 'enunciado', 'explicacao', 'mensagem', 'pergunta', 'termo_span_literal', 'rotulo', 'rotulo_src',
                     'texto_do_link', 'tag_summary', 'rotulo_summary', 'marcador', 'titulo', 'numero', 'persona',
                     'botao_corrigir', 'botao_refazer', 'rotulo_fonte', 'tema', 'texto_expressao_js', 'sub_rotulo',
                     'markup_inicial', 'unidade', 'rotulos_fonte', 'titulo_cartao', 'legenda', 'aria_label') and not isinstance(v, (dict, list)):
                acc.extend(tokens(str(v)))
            elif k == 'rotulos_fonte' or k == 'legenda':
                for x in v:
                    acc.extend(tokens(x))
            elif k == 'alternativas':
                for x in v:
                    acc.extend(tokens(x['texto']))
            elif k == 'linhas' and isinstance(v, list) and v and isinstance(v[0], list):
                for row in v:
                    for c in row:
                        acc.extend(tokens(re.sub(r'<[^>]+>', ' ', c)))
            else:
                collect(v, acc)
    elif isinstance(o, list):
        for v in o:
            collect(v, acc)


from collections import Counter

cobertura = {}


def cover(name, src_tag, obj):
    src_t = Counter(tokens(re.sub(r'<[^>]+>', ' ', ws(src_tag.get_text(' ')))))
    acc = []
    collect(obj, acc)
    ext = Counter(acc)
    hit = sum(min(c, ext[w]) for w, c in src_t.items())
    tot = sum(src_t.values())
    miss = [w for w, c in (src_t - ext).items()][:15]
    cobertura[name] = {'tokens_fonte': tot, 'cobertos': hit, 'pct': round(100 * hit / tot, 1), 'amostra_nao_cobertos': miss}


cover('§00', SEC['tese'], {'m': tese, 'c': criterio['itens'][0]})
cover('§MAP', SEC['map'], mapa)
cover('§Caso', SEC['caso'], caso)
cover('§Erros', SEC['erros'], erros)
cover('§Ex', SEC['ex'], exercicios_obj)
cover('§Quiz', SEC['quiz'], {'a': avaliacao, 'r': ROTEIRO[[r['ancora_html'] for r in ROTEIRO].index('quiz')]})
cover('§Voz', SEC['voz'], voz)
cover('§Final', SEC['final'], {'c': checklist_final, 'r': ROTEIRO[[r['ancora_html'] for r in ROTEIRO].index('final')]})
cover('§Lex', SEC['lex'], glossario)
cover('§Ref', SEC['ref'], referencias_obj)
cover('hero', hero, identidade)
for i_obj, inst in zip(insts, soup.find_all('div', class_='inst')):
    cover(i_obj['id_literal_fonte'], inst, i_obj)

# acrescenta sec-id/h2/lede (roteiro) às seções de aparato já cobertas por objeto próprio
verificacao = {
    'strings_conferidas': checked,
    'falhas_substring': fails,
    'origens_fora_da_linha': [o['trecho_inicial'] for o in orig_bad],
    'cobertura_por_token': cobertura,
    'nota': 'Conferência automática: cada string de conteúdo (campos não listados como anotação) é substring da fonte (HTML cru, texto sem tags ou literal do script, com espaços colapsados); cada origem.trecho_inicial está a até ±3 linhas de linha_aprox. A cobertura por token mede o texto da seção presente no objeto extraído (sec-id/h2/lede das seções entram via roteiro em modulo.json e não são somados aqui).',
}

for name, obj in (('modulo', modulo), ('aparato', aparato), ('instrumentos', instrumentos)):
    obj['verificacao_automatica'] = verificacao
    (OUTDIR / f'{name}.json').write_text(json.dumps(obj, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

print('strings conferidas:', checked, '| falhas:', len(fails), '| origens ruins:', len(orig_bad))
for f in fails[:40]:
    print('  FALHA:', f)
for o in orig_bad[:10]:
    print('  ORIGEM:', o)
for k, v in cobertura.items():
    print(f"  cobertura {k}: {v['pct']}% ({v['cobertos']}/{v['tokens_fonte']}) {v['amostra_nao_cobertos'][:8]}")
print('glossario:', glossario['comparacao_codigo'])
print('ramos padrao:', [(i['id'], i['veredito']['ramo_no_cenario_padrao'], len(i['veredito']['ramos'])) for i in insts])
