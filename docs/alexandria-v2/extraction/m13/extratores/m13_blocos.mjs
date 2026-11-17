// Walker de blocos para as sections do M13 (vocabulário sec-id/lede/inst).
// Cada estrutura da fonte vira um bloco tipado com `origem`. Estrutura sem
// regra conhecida vira `desconhecido` (e o verificador falha se aparecer).
import {
  S, DOC, all, first, kids, inner, byTag, byClass, hasClass, classes, txt, texto, htmlN, origem, innerSkipping, fail,
} from './m13_lib.mjs';

const sel = (sec, n) => `section#${sec} ${n.tag}${classes(n).map((c) => '.' + c).join('')}`;

export function secId(section) {
  const d = first(section, byClass('sec-id'));
  const b = first(d, byTag('b'));
  return {
    html: htmlN(inner(d)),
    codigo: texto(innerSkipping(d, (c) => c.tag === 'b')).replace(/\s*·\s*$/, ''),
    rotulo: texto(inner(b)),
    origem: origem(d, `section#${section.attrs.id} div.sec-id`),
  };
}

function tabela(secName, scroll) {
  const t = first(scroll, byTag('table'));
  const rows = all(t, byTag('tr'));
  const cab = all(rows[0], byTag('th')).map((c) => txt(inner(c)));
  return {
    tipo: 'tabela',
    cabecalho: cab,
    linhas: rows.slice(1).map((r) => ({ celulas: all(r, byTag('td')).map((c) => txt(inner(c))), linha_aprox: r.line })),
    origem: origem(t, sel(secName, t)),
  };
}

function lista(secName, n) {
  return {
    tipo: 'lista',
    ordenada: n.tag === 'ol',
    classe: n.attrs.class || null,
    itens: kids(n).filter((c) => c.tag === 'li').map((li, i) => ({ ordem: i + 1, ...txt(inner(li)), origem: origem(li, `${sel(secName, n)} > li`) })),
    origem: origem(n, sel(secName, n)),
  };
}

export function bloco(secName, n) {
  const c = classes(n);
  const o = origem(n, sel(secName, n));
  if (n.tag === 'div' && c.includes('sec-id')) return null;
  if (n.tag === 'h2') return { tipo: 'titulo_secao', ...txt(inner(n)), origem: o };
  if (n.tag === 'h3') {
    const num = first(n, byClass('num'));
    return { tipo: 'subsecao', numero: num ? texto(inner(num)) : null, ...txt(innerSkipping(n, (k) => hasClass(k, 'num'))), origem: o };
  }
  if (n.tag === 'p') {
    const t = c.includes('lede') ? 'lede' : c.includes('srcnote') ? 'nota_de_fonte' : c.includes('disc') ? 'aviso' : c.length ? `p.${c.join('.')}` : 'paragrafo';
    return { tipo: t, ...txt(inner(n)), origem: o };
  }
  if (n.tag === 'ol' || n.tag === 'ul') return lista(secName, n);
  if (n.tag === 'div' && c.includes('scroll')) return tabela(secName, n);
  if (n.tag === 'div' && c.includes('form')) {
    const note = first(n, byClass('note'));
    return { tipo: 'destaque', corpo: txt(innerSkipping(n, (k) => hasClass(k, 'note'))), complemento: note ? txt(inner(note)) : null, origem: o };
  }
  if (n.tag === 'div' && c.includes('box')) {
    const tag = first(n, byClass('tag'));
    const tom = c.find((x) => x !== 'box') || null;
    return {
      tipo: 'caixa', tom, rotulo: txt(inner(tag)),
      paragrafos: kids(n).filter((k) => k.tag === 'p').map((p) => ({ ...txt(inner(p)), origem: origem(p, `${sel(secName, n)} > p`) })),
      origem: o,
    };
  }
  if (n.tag === 'div' && c.includes('chain')) {
    return {
      tipo: 'cadeia', itens: kids(n).map((b) => {
        const lb = first(b, byClass('ck2'));
        return { classe: b.attrs.class, rotulo: texto(inner(lb)), corpo: txt(innerSkipping(b, (k) => hasClass(k, 'ck2'))), origem: origem(b, `${sel(secName, n)} > div.cbox`) };
      }), origem: o,
    };
  }
  if (n.tag === 'div' && c.includes('soc')) {
    return {
      tipo: 'cartoes_societarios', itens: kids(n).map((b) => ({
        classe: b.attrs.class,
        estado: texto(inner(first(b, byClass('ss')))),
        empresa: texto(inner(first(b, byClass('sn')))),
        descricao: txt(innerSkipping(b, (k) => hasClass(k, 'ss') || hasClass(k, 'sn'))),
        origem: origem(b, `${sel(secName, n)} > div.soc-c`),
      })), origem: o,
    };
  }
  if (n.tag === 'div' && c.includes('inst')) {
    const hd = first(n, byClass('inst-hd'));
    return { tipo: 'instrumento', id: texto(inner(first(hd, byClass('id')))), nome: texto(inner(first(hd, byClass('nm')))), ver: 'instrumentos.json', origem: origem(hd, `section#${secName} div.inst > div.inst-hd`) };
  }
  if (n.tag === 'div' && c.includes('lv')) {
    const tabs = all(n, byClass('lv-tab'));
    const panes = all(n, byClass('lv-pane'));
    return {
      tipo: 'tres_niveis', titulo: texto(inner(first(n, byClass('lv-hd')))),
      niveis: panes.map((p) => {
        const t = tabs.find((x) => x.attrs['data-lv'] === p.attrs['data-p']);
        return { chave: p.attrs['data-p'], rotulo: texto(inner(t)), inicial: hasClass(p, 'on'), ...txt(inner(p)), origem: origem(p, `${sel(secName, n)} div.lv-pane`) };
      }), origem: o,
    };
  }
  if (n.tag === 'div' && c.includes('fx')) {
    return {
      tipo: 'formula', nome: texto(inner(first(n, byClass('fn')))),
      equacao: txt(inner(first(n, byClass('fe')))),
      leitura: txt(inner(first(n, byClass('fd')))), origem: o,
    };
  }
  if (n.tag === 'div' && c.includes('dual')) {
    return {
      tipo: 'comparacao_lado_a_lado', colunas: kids(n).map((d) => ({
        classe: d.attrs.class,
        rotulo: texto(inner(first(d, byClass('dk')))),
        valor: txt(inner(first(d, byClass('dv')))),
        texto_coluna: txt(inner(first(d, byClass('dm')))),
        origem: origem(d, `${sel(secName, n)} > div.dc`),
      })), origem: o,
    };
  }
  if (n.tag === 'div' && c.includes('clk')) {
    return {
      tipo: 'cronologia', linhas: kids(n).map((r) => {
        const b = first(r, byClass('clk-b'));
        return {
          marco: texto(inner(first(r, byClass('clk-t')))),
          titulo: texto(inner(first(b, byTag('b')))),
          corpo: txt(innerSkipping(b, (k) => k === kids(b)[0])),
          origem: origem(r, `${sel(secName, n)} > div.clk-r`),
        };
      }), origem: o,
    };
  }
  if (n.tag === 'div' && c.includes('t333')) {
    return {
      tipo: 'tres_colunas', colunas: kids(n).map((col) => ({
        classe: col.attrs.class,
        titulo: texto(inner(first(col, byClass('th2')))),
        itens: all(col, byTag('li')).map((li, i) => {
          const b = kids(li).find((k) => k.tag === 'b');
          const it = kids(li).find((k) => k.tag === 'i');
          return {
            ordem: i + 1,
            titulo: texto(inner(b)),
            corpo: txt(innerSkipping(li, (k) => k === b || k === it)),
            complemento: it ? txt(inner(it)) : null,
            origem: origem(li, `${sel(secName, n)} div.tc li`),
          };
        }),
        origem: origem(col, `${sel(secName, n)} > div.tc`),
      })), origem: o,
    };
  }
  if (n.tag === 'div' && c.includes('and')) {
    const bd = first(n, byClass('and-bd'));
    const pick = (cl) => { const k = first(bd, byClass(cl)); return k ? k : null; };
    const labeled = (k) => { if (!k) return null; const b = kids(k).find((x) => x.tag === 'b' || hasClass(x, 'sk')); return { rotulo: b ? texto(inner(b)) : null, corpo: txt(innerSkipping(k, (x) => x === b)), origem: origem(k, `${sel(secName, n)} .${classes(k)[0]}`) }; };
    const nav = first(n, byClass('and-nav'));
    return {
      tipo: 'andaime',
      nav: nav ? kids(nav).map((b) => ({ chave: b.attrs['data-b'], rotulo: texto(innerSkipping(b, (x) => x.tag === 'i')), sub: texto(inner(first(b, byTag('i')))) })) : null,
      corpo_estatico: bd && bd.children.some((x) => x.tag !== '#text') ? {
        relogio: pick('and-clock') ? texto(inner(pick('and-clock'))) : null,
        pergunta: pick('and-q') ? txt(inner(pick('and-q'))) : null,
        secao: pick('and-sec') ? {
          rotulo: texto(inner(first(pick('and-sec'), byClass('sk')))),
          itens: all(pick('and-sec'), byTag('li')).map((li) => { const b = kids(li)[0]; return { titulo: texto(inner(b)), corpo: txt(innerSkipping(li, (x) => x === b)), origem: origem(li, `${sel(secName, n)} .and-anc li`) }; }),
        } : null,
        por_que: labeled(pick('and-br')),
        nunca: labeled(pick('and-no')),
      } : null,
      nota_corpo: bd && !bd.children.some((x) => x.tag !== '#text') ? 'Corpo vazio no markup (#an-bd); é preenchido pelo script do INST·11.' : null,
      origem: o,
    };
  }
  if (n.tag === 'div' && c.includes('emp')) {
    const hd = first(n, byClass('emp-hd'));
    const nm = first(hd, byClass('nm'));
    return {
      tipo: 'ficha_empresa',
      nome: texto(innerSkipping(nm, (k) => k.tag === 'small')),
      codigos: texto(inner(first(nm, byTag('small')))),
      arquetipo: texto(inner(first(hd, byClass('ar')))),
      linhas: all(n, (k) => hasClass(k, 'emp-row')).map((r) => {
        const v = first(r, byClass('emp-v'));
        const mini = first(v, byClass('mini'));
        return {
          campo: texto(inner(first(r, byClass('emp-k')))),
          aberto: hasClass(r, 'aberto'),
          valor: txt(innerSkipping(v, (k) => k === mini)),
          mini: mini ? txt(inner(mini)) : null,
          origem: origem(r, `${sel(secName, n)} div.emp-row`),
        };
      }),
      origem: o,
    };
  }
  if (n.tag === 'details') {
    const sm = first(n, byTag('summary'));
    return { tipo: 'details', resumo: texto(inner(sm)), origem: o };
  }
  if (n.tag === 'div' && n.attrs.id === 'quiz-box') return { tipo: 'quiz_container', nota: 'Vazio no markup; preenchido pelo script (ver aparato.json › avaliacao).', origem: o };
  if (n.tag === 'div' && n.attrs.class === 'score') return { tipo: 'quiz_placar', origem: o };
  if (n.tag === 'div' && /display:flex/.test(n.attrs.style || '')) {
    return { tipo: 'botoes', rotulos: all(n, byTag('button')).map((b) => ({ id: b.attrs.id, rotulo: texto(inner(b)) })), origem: o };
  }
  return { tipo: 'desconhecido', tag: n.tag, classe: n.attrs.class || null, trecho: htmlN(S.slice(n.start, n.start + 120)), origem: o };
}

export function blocosDaSecao(section) {
  const wrap = first(section, byClass('wrap'));
  return kids(wrap).map((n) => bloco(section.attrs.id, n)).filter(Boolean);
}

// menor elemento com tag `tag` que contém a substring `sub`
export function envolvente(sub, tags, from = 0) {
  const off = S.indexOf(sub, from);
  if (off < 0) fail(`envolvente: não achei ${sub.slice(0, 50)}`);
  const cands = all(DOC, (n) => tags.includes(n.tag) && n.openEnd <= off && n.closeStart >= off + sub.length);
  if (!cands.length) fail(`envolvente: sem ${tags} em volta de ${sub.slice(0, 50)}`);
  return cands.sort((a, b) => (a.end - a.start) - (b.end - b.start))[0];
}
