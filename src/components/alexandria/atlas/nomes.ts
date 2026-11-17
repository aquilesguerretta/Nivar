// Atlas da Alexandria v3 — como os nomes do cadastro aparecem na tela.
//
// O cadastro do ONS e o da ANP escrevem muitos nomes em CAIXA ALTA ("SE FURNAS",
// "XINGUARA 2"). Na ficha e na busca, em serifa grande, a caixa alta grita. Aqui
// o nome ganha caixa de título SÓ NA EXIBIÇÃO: nenhuma letra é acrescentada,
// nenhum acento é posto onde a fonte não pôs, nada é completado. O nome como a
// fonte escreve continua na ficha, na linha "Nome no cadastro".

/** Palavras curtas que ficam em minúscula no meio do nome. */
const MINUSCULAS = new Set(['de', 'da', 'do', 'das', 'dos', 'e', 'em', 'a', 'o', 'as', 'os', 'na', 'no', 'nas', 'nos', 'para', 'por', 'com']);

/** Siglas do setor que ficam em maiúscula (o cadastro as usa como prefixo ou sufixo). */
const SIGLAS = new Set([
  'SE', 'LT', 'UHE', 'PCH', 'CGH', 'UTE', 'UTN', 'EOL', 'UFV', 'CC', 'CA', 'ONS', 'ANP', 'ANEEL', 'GNL', 'UPGN', 'HVDC',
  'BR', 'SA', 'S/A', 'S.A.', 'LTDA', 'CTEEP', 'CEMIG', 'CHESF', 'CELG', 'COPEL', 'CEEE', 'ELETROSUL', 'ELETRONORTE', 'TAESA',
]);

const ROMANO = /^(?=[IVXLC]+$)M{0,3}(C[MD]|D?C{0,3})(X[CL]|L?X{0,3})(I[XV]|V?I{0,3})$/;

const SO_MAIUSCULAS = /^[\p{Lu}]+$/u;

/** Caixa de título pt-BR, só para exibição, palavra a palavra: só muda a palavra que a
 *  fonte escreveu inteira em maiúscula ("Reservatório FURNAS", "LT 345 kV FURNAS /
 *  VARGINHA"). Sigla do setor, algarismo romano, palavra com dígito e sigla de duas
 *  letras (UF) ficam. Nome sem nenhuma palavra maiúscula de quatro letras ou mais fica
 *  inteiro como a fonte escreve. */
export function nomeDeExibicao(nome: string | null | undefined): string {
  if (!nome) return '';
  const partes = nome.split(/(\s+|-|\/|\(|\))/);
  const ehPalavraAlta = (p: string) => SO_MAIUSCULAS.test(p) && p.length >= 4 && !SIGLAS.has(p) && !ROMANO.test(p);
  if (!partes.some((p) => ehPalavraAlta(p.replace(/[.,;:]+$/, '')))) return nome;
  let primeira = true;
  return partes
    .map((parte, i, todas) => {
      if (!parte || /^(\s+|-|\/|\(|\))$/.test(parte)) return parte;
      const nu = parte.replace(/[.,;:]+$/, '');
      const resto = parte.slice(nu.length);
      // "S/A", "LTDA/ME": depois da barra, o curto é sigla, não artigo
      if (todas[i - 1] === '/' && nu.length <= 2) {
        primeira = false;
        return parte;
      }
      const eraPrimeira = primeira;
      primeira = false;
      if (!SO_MAIUSCULAS.test(nu) || SIGLAS.has(nu) || ROMANO.test(nu)) return parte;
      const baixo = nu.toLocaleLowerCase('pt-BR');
      if (!eraPrimeira && MINUSCULAS.has(baixo)) return baixo + resto;
      if (nu.length <= 2) return parte; // UF, sigla curta
      return baixo.charAt(0).toLocaleUpperCase('pt-BR') + baixo.slice(1) + resto;
    })
    .join('');
}

const NUM1 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });

/** Quilômetros em pt-BR, com no máximo uma casa: 157,3 km. */
export function km(v: unknown): string | null {
  const n = typeof v === 'number' ? v : typeof v === 'string' && v.trim() !== '' ? Number(v) : NaN;
  return Number.isFinite(n) ? `${NUM1.format(n)} km` : null;
}
