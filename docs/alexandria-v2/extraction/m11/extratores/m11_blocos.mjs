// Extrator genérico de blocos de um contêiner (div.wrap de uma section).
// Cada bloco carrega html literal (espaços colapsados), texto sem tags e origem.
import * as L from './m11_lib.mjs';

export function wrapOf(sectionId) {
  const s = L.sections.find((x) => x.id === sectionId);
  if (!s) throw new Error(`section ${sectionId}`);
  return { sec: s, wrap: L.find(s.node, (x) => L.hasClass(x, 'wrap')) };
}

export function marcador(sec) {
  const h = L.inner(sec.secId);
  const m = h.match(/^([\s\S]*?)·\s*<b>([\s\S]*?)<\/b>\s*$/);
  return {
    html: L.htmlNorm(h),
    num: L.ws(m[1]),
    rotulo: L.stripTags(m[2]),
    origem: L.origem(sec.secId, `section#${sec.id} .sec-id`),
  };
}

export function blocos(wrap, prefix, sectionId) {
  const out = [];
  let k = 0;
  const id = (t) => `${prefix}-b${L.pad(++k)}-${t}`;
  for (const n of wrap.children) {
    const sel = `section#${sectionId} > .wrap > ${n.tag}${n.attrs.class ? '.' + n.attrs.class.replace(/\s+/g, '.') : ''}`;
    if (L.hasClass(n, 'sec-id') || n.tag === 'h2') continue;
    if (n.tag === 'p') {
      out.push({ id: id(L.hasClass(n, 'lede') ? 'lede' : 'paragrafo'), tipo: L.hasClass(n, 'lede') ? 'lede' : 'paragrafo', ...L.lit(n), origem: L.origem(n, sel) });
    } else if (n.tag === 'h3') {
      const num = L.find(n, (x) => L.hasClass(x, 'num'));
      const texto = L.stripTags(L.inner(n).replace(/<span class="num">[\s\S]*?<\/span>/, ''));
      out.push({ id: id('titulo'), tipo: 'titulo', numero: num ? L.stripTags(L.inner(num)) : null, texto, origem: L.origem(n, sel) });
    } else if (n.tag === 'div' && L.hasClass(n, 'box')) {
      const tag = L.find(n, (x) => L.hasClass(x, 'tag'));
      const ps = L.kids(n, (x) => x.tag === 'p');
      out.push({
        id: id('callout'), tipo: 'callout', classe: n.attrs.class,
        rotulo: tag ? L.stripTags(L.inner(tag)) : null,
        paragrafos: ps.map((p) => ({ ...L.lit(p), origem: L.origem(p, `${sel} > p`) })),
        origem: L.origem(n, sel),
      });
    } else if (n.tag === 'div' && L.hasClass(n, 'inst')) {
      const idn = L.find(n, (x) => L.hasClass(x, 'id'));
      const nm = L.find(n, (x) => L.hasClass(x, 'nm'));
      out.push({ id: id('instrumento'), tipo: 'instrumento_ref', id_fonte: L.stripTags(L.inner(idn)), titulo: L.stripTags(L.inner(nm)), nota: 'Conteúdo completo em instrumentos.json.', origem: L.origem(n, sel, L.inner(idn) + ' ' + L.inner(nm)) });
    } else if (n.tag === 'ol' || n.tag === 'ul') {
      out.push({ id: id('lista'), tipo: n.tag === 'ol' ? 'lista_numerada' : 'lista', classe: n.attrs.class ?? null, itens: L.kids(n, (x) => x.tag === 'li').map((li) => ({ ...L.lit(li), origem: L.origem(li, `${sel} > li`) })), origem: L.origem(n, sel) });
    } else {
      out.push({ id: id('outro'), tipo: `nao_mapeado:${n.tag}.${n.attrs.class ?? ''}`, ...L.lit(n), origem: L.origem(n, sel) });
    }
  }
  return out;
}
