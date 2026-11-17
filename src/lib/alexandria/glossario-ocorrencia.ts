// glossario-ocorrencia.ts — o vínculo termo → aula, mecânico.
//
// DECISÃO 5 (docs/alexandria-v3/DECISOES-2026-11-15.md). Nenhum aparato da fonte
// liga verbete a aula. O vínculo aceito é a OCORRÊNCIA: o termo aparece
// literalmente no texto da aula. É medida, não inferência de sentido — por isso
// a tela diz "aparece na Aula N", nunca "ensinado na Aula N".
//
// O que conta como "texto da aula": os blocos de leitura em que a aula liga
// termos (parágrafo, nota, itens de lista, células de tabela) — os mesmos que
// `Leitura.tsx` passa a `ligarTermos`. Título de seção, fórmula, lead e conteúdo
// de `span.calc` não contam, porque ali a aula também não liga termo.
//
// Como casa (a mesma regra de `termosDaAula`, que liga o termo na aula):
//   · o parêntese final sai ("Ampere (A)" → "Ampere"; "Fator de capacidade (FC)"
//     → "Fator de capacidade") — a sigla entre parênteses NÃO casa sozinha: "FC"
//     é capacidade num módulo e carga em outro (Q11), e casar a sigla ligaria a
//     definição errada;
//   · "A / B" vira duas variantes;
//   · sigla e unidade (até 4 letras, ou com maiúscula depois da primeira) casam
//     com a caixa exata; palavra comum casa sem caixa;
//   · fronteira de palavra: nem letra nem número colado antes ou depois;
//   · toda marca de HTML separa o texto, como os nós de texto separam no DOM —
//     um termo partido por <b> não casa, nem lá nem aqui.
//
// Arquivo puro (sem import): roda no navegador e no Node do verificador.

export interface PadraoDoTermo {
  variantes: string[];
  sensivel: boolean;
}

export function padraoDoTermo(termo: string): PadraoDoTermo | null {
  const base = decodificar(termo).replace(/\s*\([^)]*\)\s*/g, ' ').trim();
  const variantes = base
    .split(/\s+\/\s+/)
    .map((x) => x.trim())
    .filter((x) => x.length >= 2);
  if (!variantes.length) return null;
  const sensivel = variantes.every((x) => x.length <= 4 || /[A-Z]/.test(x.slice(1)));
  return { variantes, sensivel };
}

const escapar = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** O padrão que `ligarTermos` usa para achar o termo num nó de texto. */
export function regexDoTermo(p: PadraoDoTermo): RegExp {
  const corpo = p.variantes.map(escapar).join('|');
  return new RegExp(`(?<![\\p{L}\\p{N}])(?:${corpo})(?![\\p{L}\\p{N}])`, p.sensivel ? 'u' : 'iu');
}

// ── texto da aula ────────────────────────────────────────────

const ENTIDADES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’',
  ndash: '–', mdash: '—', hellip: '…', middot: '·', times: '×',
  ccedil: 'ç', atilde: 'ã', otilde: 'õ', aacute: 'á', eacute: 'é',
  iacute: 'í', oacute: 'ó', uacute: 'ú', acirc: 'â', ecirc: 'ê',
  ocirc: 'ô', agrave: 'à', eta: 'η', deg: '°', le: '≤', ge: '≥',
};

export function decodificar(s: string): string {
  if (!s.includes('&')) return s;
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === '#') {
      const n = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : m;
    }
    return ENTIDADES[e] ?? ENTIDADES[e.toLowerCase()] ?? m;
  });
}

/** Os trechos de texto de um HTML curto, partidos em toda marca, sem o
 *  conteúdo de `span.calc`. */
export function trechosDeTexto(html: string): string[] {
  const saida: string[] = [];
  const marca = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g;
  let ultimo = 0;
  let calc = 0; // profundidade de <span> dentro de um span.calc
  for (let m = marca.exec(html); m; m = marca.exec(html)) {
    if (!calc && m.index > ultimo) saida.push(decodificar(html.slice(ultimo, m.index)));
    ultimo = m.index + m[0].length;
    const fecha = m[1] === '/';
    const nome = m[2].toLowerCase();
    if (nome !== 'span') continue;
    if (calc) calc += fecha ? -1 : /\/\s*$/.test(m[3]) ? 0 : 1;
    else if (!fecha && /class\s*=\s*["'][^"']*\bcalc\b/.test(m[3])) calc = 1;
  }
  if (!calc && ultimo < html.length) saida.push(decodificar(html.slice(ultimo)));
  return saida.filter((t) => t.length > 0);
}

/** Forma mínima do bloco de aula que este arquivo lê. */
export type BlocoLido =
  | { kind: 'paragrafo'; html: string }
  | { kind: 'nota'; html: string }
  | { kind: 'lista'; itens: string[] }
  | { kind: 'tabela'; linhas: string[][] }
  | { kind: string };

function partesDoBloco(b: BlocoLido): string[] {
  switch (b.kind) {
    case 'paragrafo':
    case 'nota':
      return [(b as { html: string }).html];
    case 'lista':
      return (b as { itens: string[] }).itens;
    case 'tabela':
      return (b as { linhas: string[][] }).linhas.flat();
    default:
      return [];
  }
}

export interface TextoDaAula {
  /** Os trechos unidos por '\n' — um termo nunca casa atravessando dois trechos. */
  texto: string;
  minusculo: string;
}

export function textoDaAula(blocos: readonly BlocoLido[]): TextoDaAula {
  const texto = blocos.flatMap((b) => partesDoBloco(b).flatMap(trechosDeTexto)).join('\n');
  return { texto, minusculo: texto.toLowerCase() };
}

// ── ocorrência ───────────────────────────────────────────────

const LETRA_OU_NUMERO = /[\p{L}\p{N}]/u;

function livre(s: string, i: number): boolean {
  if (i < 0 || i >= s.length) return true;
  // Par substituto: olha o code point inteiro.
  const cp = s.codePointAt(i);
  const c = cp === undefined ? '' : String.fromCodePoint(cp);
  return !LETRA_OU_NUMERO.test(c);
}

function livreAntes(s: string, i: number): boolean {
  if (i <= 0) return true;
  const lo = s.charCodeAt(i - 1);
  // Fim de par substituto: volta mais um.
  const j = lo >= 0xdc00 && lo <= 0xdfff && i >= 2 ? i - 2 : i - 1;
  return livre(s, j);
}

/** Posições em que o termo aparece no texto, como palavra inteira. */
function posicoes(t: TextoDaAula, p: PadraoDoTermo): number[] {
  const saida: number[] = [];
  // `toLowerCase` pode mudar o comprimento (İ → i̇); aí a posição não serve e a
  // busca cai para a expressão regular, que é a regra de `ligarTermos`.
  const semCaixa = !p.sensivel;
  const viaRegex =
    (semCaixa && t.minusculo.length !== t.texto.length) ||
    p.variantes.some((v) => semCaixa && v.toLowerCase().length !== v.length);
  if (viaRegex) {
    const re = new RegExp(regexDoTermo(p).source, p.sensivel ? 'gu' : 'giu');
    for (let m = re.exec(t.texto); m; m = re.exec(t.texto)) {
      saida.push(m.index);
      if (m[0].length === 0) re.lastIndex++;
    }
    return saida;
  }
  const alvo = semCaixa ? t.minusculo : t.texto;
  for (const v of p.variantes) {
    const agulha = semCaixa ? v.toLowerCase() : v;
    for (let i = alvo.indexOf(agulha); i >= 0; i = alvo.indexOf(agulha, i + 1)) {
      if (livreAntes(alvo, i) && livre(alvo, i + agulha.length)) saida.push(i);
    }
  }
  return saida;
}

/** O termo aparece no texto da aula, como palavra inteira? */
export function aparece(t: TextoDaAula, p: PadraoDoTermo): boolean {
  return posicoes(t, p).length > 0;
}

/** Para cada termo de um módulo, as aulas do módulo em que ele aparece, na
 *  ordem das aulas. Junta as aulas num texto só (separadas por '\n') para
 *  varrer uma vez por termo, não uma vez por termo e por aula. */
export function aulasOndeAparece(
  aulas: readonly { id: string; blocos: readonly BlocoLido[] }[],
  termos: readonly { id: string; termo: string }[],
): Map<string, string[]> {
  const partes = aulas.map((a) => textoDaAula(a.blocos).texto);
  const inicios: number[] = [];
  let acc = 0;
  for (const p of partes) {
    inicios.push(acc);
    acc += p.length + 1;
  }
  const texto = partes.join('\n');
  const t: TextoDaAula = { texto, minusculo: texto.toLowerCase() };
  const aulaEm = (pos: number) => {
    let lo = 0;
    let hi = inicios.length - 1;
    while (lo < hi) {
      const meio = (lo + hi + 1) >> 1;
      if (inicios[meio] <= pos) lo = meio;
      else hi = meio - 1;
    }
    return lo;
  };
  const saida = new Map<string, string[]>();
  for (const termo of termos) {
    const p = padraoDoTermo(termo.termo);
    const achadas = new Set<number>();
    if (p) for (const pos of posicoes(t, p)) achadas.add(aulaEm(pos));
    saida.set(
      termo.id,
      [...achadas].sort((a, b) => a - b).map((i) => aulas[i].id),
    );
  }
  return saida;
}
