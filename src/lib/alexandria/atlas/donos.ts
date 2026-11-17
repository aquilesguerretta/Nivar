// Atlas da Alexandria v3 — quem é dono (capítulo "A rede").
// Puro, sem mapa. Lê o campo de proprietário do cadastro (ANEEL · SIGA,
// `DscPropriRegimePariticipacao`), que o Atlas publica como a fonte escreve:
//   "60.5000% para ITÁ ENERGÉTICA S/A (PIE), 39.5000% para ENGIE BRASIL ENERGIA S.A. (PIE)"
// É o dono DIRETO, com a participação declarada, e não o controlador final: duas
// empresas do mesmo grupo econômico continuam separadas. Nada aqui junta nomes por
// conhecimento de fora do arquivo.
//
// A REGRA DE LEITURA (mecânica, declarada na tela):
//   1. cada participação é "<fração>% para <nome> (<regime>)"; o regime (PIE, SP, APE,
//      REG) é da usina, não do nome, e sai da chave;
//   2. "Não Informado" é ausência de dono: a usina conta em "sem dono no cadastro";
//   3. a mesma participação repetida, igual, na mesma usina conta uma vez;
//   4. se as frações declaradas somam mais que 100%, cada uma é dividida pela soma;
//   5. o cadastro corta o texto em 500 caracteres: a participação cortada no meio é
//      ilegível e a fração que falta para 100% fica em "parte ilegível";
//   6. a parte de cada dono é a potência da usina vezes a fração declarada.
// A REGRA DA CHAVE (o que junta grafias):
//   "&amp" vira "&"; sem acentos; caixa alta; toda pontuação vira espaço; espaços
//   repetidos somem; as grafias de sociedade anônima ("S.A.", "S/A", "S A", "SA")
//   viram "SA" e "LTDA." vira "LTDA". A forma societária NÃO sai: "USINA SÃO JOSÉ S/A"
//   e "USINA SÃO JOSÉ LTDA" são pessoas jurídicas diferentes e ficam separadas.

import type { FeicaoUsina } from './dados';
import type { Categoria } from './tipos';
import type { FonteDeUsinas } from './tempo';

export interface Participacao {
  chave: string;
  /** o nome como o cadastro escreve (só "&amp" decodificado) */
  nome: string;
  /** 0–1, já dividida pela soma quando as declaradas passam de 100% */
  fracao: number;
}

export interface LeituraDoDono {
  partes: Participacao[];
  /** fração sem dono legível (texto cortado na fonte) */
  ilegivel: number;
  naoInformado: boolean;
  /** as frações declaradas somavam mais que 100% (e foram divididas pela soma) */
  acimaDe100: boolean;
  /** havia participação repetida, igual, contada uma vez */
  repetida: boolean;
}

export interface DonoDaFrota {
  chave: string;
  /** a grafia com mais potência entre as juntadas */
  nome: string;
  /** soma proporcional: potência × fração, em kW */
  kw: number;
  /** usinas em operação com alguma participação deste dono */
  usinas: number;
  /** delas, quantas são 100% dele */
  inteiras: number;
  /** as grafias do cadastro juntadas nesta chave (uma só, quase sempre) */
  variantes: string[];
}

export interface UsinaDoDono {
  ceg: string;
  nome: string;
  cat: Categoria;
  uf: string;
  kw: number;
  fracao: number;
  /** kw × fracao */
  kwDoDono: number;
  lon: number;
  lat: number;
}

export interface NotaDosDonos {
  usinas: number;
  kw: number;
  naoInformado: { n: number; kw: number };
  ilegivel: { n: number; kw: number };
  acimaDe100: number;
  repetidas: number;
  /** quantas grafias distintas há no cadastro, e quantas chaves sobram depois da regra */
  grafias: number;
  chaves: number;
  /** as chaves que juntaram mais de uma grafia */
  juntadas: DonoDaFrota[];
}

const RE_FRACAO = /(\d+(?:[.,]\d+)?)% para /g;
const RE_REGIME = /\s*\([A-Za-z-]+\)$/;
/** O SIGA corta o campo em 500 caracteres (medido: 12 usinas em operação com o texto cortado). */
const CORTE_DA_FONTE = 499;

export const decodificar = (s: string) => s.replace(/&amp;?/gi, '&');

/** A chave de um nome: a regra mecânica descrita no topo do arquivo. */
export function normalizarNome(nome: string): string {
  const t = decodificar(nome)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9&]+/g, ' ')
    .trim();
  const w = t.split(' ');
  const saida: string[] = [];
  for (let i = 0; i < w.length; i++) {
    if (w[i] === 'S' && w[i + 1] === 'A') {
      saida.push('SA');
      i++;
      continue;
    }
    saida.push(w[i]);
  }
  return saida.join(' ');
}

const cacheDaLeitura = new Map<string, LeituraDoDono>();

/** Lê o campo de proprietário de UMA usina. */
export function lerParticipacoes(texto: string | null | undefined): LeituraDoDono {
  if (!texto || /^n[aã]o informado$/i.test(texto.trim())) return { partes: [], ilegivel: 0, naoInformado: true, acimaDe100: false, repetida: false };
  const pronto = cacheDaLeitura.get(texto);
  if (pronto) return pronto;
  const ms = [...texto.matchAll(RE_FRACAO)];
  const cortado = texto.length >= CORTE_DA_FONTE && !texto.trimEnd().endsWith(')');
  let partes: Participacao[] = [];
  const vistos = new Set<string>();
  let repetida = false;
  ms.forEach((m, j) => {
    const inicio = (m.index ?? 0) + m[0].length;
    const fim = j + 1 < ms.length ? (ms[j + 1].index ?? texto.length) : texto.length;
    let seg = texto.slice(inicio, fim).trim().replace(/,$/, '').trim();
    if (j === ms.length - 1 && cortado) {
      // a última participação foi cortada: só vale se o nome dela fechou com o regime
      const k = seg.search(/\([A-Za-z-]+\), [^()]*$/);
      if (k < 0) return;
      seg = seg.slice(0, seg.indexOf(')', k) + 1);
    }
    const nome = decodificar(seg.replace(RE_REGIME, '').trim());
    const fracao = Number(m[1].replace(',', '.')) / 100;
    const id = `${fracao}|${nome}`;
    if (vistos.has(id)) {
      repetida = true;
      return;
    }
    vistos.add(id);
    partes.push({ chave: normalizarNome(nome), nome, fracao });
  });
  let soma = partes.reduce((t, p) => t + p.fracao, 0);
  // arredondamento da fonte (100,0001%) não conta como "acima"
  const acimaDe100 = soma > 1.0001;
  if (soma > 1) {
    partes = partes.map((p) => ({ ...p, fracao: p.fracao / soma }));
    soma = 1;
  }
  // só o texto cortado deixa fração ilegível; abaixo de 100% sem corte é o que o cadastro registra
  const r: LeituraDoDono = { partes, ilegivel: cortado ? Math.max(0, 1 - soma) : 0, naoInformado: false, acimaDe100, repetida };
  cacheDaLeitura.set(texto, r);
  return r;
}

interface UsinaComDono {
  ceg: string;
  nome: string;
  cat: Categoria;
  uf: string;
  kw: number;
  lon: number;
  lat: number;
  dono: string | null;
}

const ehColunar = (f: FonteDeUsinas): f is Exclude<FonteDeUsinas, readonly FeicaoUsina[]> => !Array.isArray(f);

function* emOperacao(fontes: readonly FonteDeUsinas[]): Generator<UsinaComDono> {
  for (const f of fontes) {
    if (ehColunar(f)) {
      for (let i = 0; i < f.n; i++)
        if (f.fase[i] === 0)
          yield { ceg: f.ceg[i], nome: f.nome[i] ?? f.ceg[i], cat: f.categorias[f.cat[i]], uf: f.uf[i], kw: f.kw[i], lon: f.lon[i], lat: f.lat[i], dono: f.dono[i] >= 0 ? (f.donos[f.dono[i]] ?? null) : null };
    } else {
      for (const u of f) {
        const p = u.properties;
        if (p.fase === 0) yield { ceg: p.ceg, nome: p.nome, cat: p.cat, uf: p.uf, kw: p.kw, lon: u.geometry.coordinates[0], lat: u.geometry.coordinates[1], dono: p.dono };
      }
    }
  }
}

interface Calculo {
  lista: DonoDaFrota[];
  nota: NotaDosDonos;
  porChave: Map<string, UsinaDoDono[]>;
}

const memo = new WeakMap<readonly FonteDeUsinas[], Calculo>();
let ultimo: Calculo | null = null;

function calcular(usinas: readonly FonteDeUsinas[]): Calculo {
  const pronto = memo.get(usinas);
  if (pronto) return (ultimo = pronto);
  const acc = new Map<string, { kw: number; ceg: Set<string>; inteiras: number; grafias: Map<string, number> }>();
  const porChave = new Map<string, UsinaDoDono[]>();
  const grafias = new Set<string>();
  const nota: NotaDosDonos = { usinas: 0, kw: 0, naoInformado: { n: 0, kw: 0 }, ilegivel: { n: 0, kw: 0 }, acimaDe100: 0, repetidas: 0, grafias: 0, chaves: 0, juntadas: [] };
  for (const u of emOperacao(usinas)) {
    nota.usinas++;
    nota.kw += u.kw;
    const l = lerParticipacoes(u.dono);
    if (l.naoInformado) {
      nota.naoInformado.n++;
      nota.naoInformado.kw += u.kw;
      continue;
    }
    if (l.ilegivel > 1e-9) {
      nota.ilegivel.n++;
      nota.ilegivel.kw += u.kw * l.ilegivel;
    }
    if (l.acimaDe100) nota.acimaDe100++;
    if (l.repetida) nota.repetidas++;
    for (const p of l.partes) {
      grafias.add(p.nome);
      let a = acc.get(p.chave);
      if (!a) acc.set(p.chave, (a = { kw: 0, ceg: new Set(), inteiras: 0, grafias: new Map() }));
      const kwDoDono = u.kw * p.fracao;
      a.kw += kwDoDono;
      if (!a.ceg.has(u.ceg)) {
        a.ceg.add(u.ceg);
        if (p.fracao >= 0.99995) a.inteiras++;
      }
      a.grafias.set(p.nome, (a.grafias.get(p.nome) ?? 0) + kwDoDono);
      let lista = porChave.get(p.chave);
      if (!lista) porChave.set(p.chave, (lista = []));
      // a mesma usina com duas grafias do mesmo dono: uma linha, frações somadas
      const ja = lista.find((x) => x.ceg === u.ceg);
      if (ja) {
        ja.fracao += p.fracao;
        ja.kwDoDono += kwDoDono;
      } else lista.push({ ceg: u.ceg, nome: u.nome, cat: u.cat, uf: u.uf, kw: u.kw, fracao: p.fracao, kwDoDono, lon: u.lon, lat: u.lat });
    }
  }
  const lista: DonoDaFrota[] = [...acc].map(([chave, a]) => {
    const variantes = [...a.grafias].sort((x, y) => y[1] - x[1]).map(([g]) => g);
    return { chave, nome: variantes[0], kw: a.kw, usinas: a.ceg.size, inteiras: a.inteiras, variantes };
  });
  lista.sort((x, y) => y.kw - x.kw || x.nome.localeCompare(y.nome, 'pt-BR'));
  for (const l of porChave.values()) l.sort((x, y) => y.kwDoDono - x.kwDoDono);
  nota.grafias = grafias.size;
  nota.chaves = lista.length;
  nota.juntadas = lista.filter((d) => d.variantes.length > 1);
  const c = { lista, nota, porChave };
  memo.set(usinas, c);
  return (ultimo = c);
}

/** Os donos da frota em operação, do maior para o menor (potência proporcional à fração). */
export function donosDaFrota(usinas: readonly FonteDeUsinas[]): DonoDaFrota[] {
  return calcular(usinas).lista;
}

/** O que a regra fez: ausências, cortes, grafias juntadas. Mesmo cálculo de donosDaFrota. */
export function notaDosDonos(usinas: readonly FonteDeUsinas[]): NotaDosDonos {
  return calcular(usinas).nota;
}

/** As usinas de um dono (do último cálculo, ou do de `usinas` quando dado), da maior parte para a menor. */
export function usinasDoDono(chave: string, usinas?: readonly FonteDeUsinas[]): UsinaDoDono[] {
  const c = usinas ? calcular(usinas) : ultimo;
  return c?.porChave.get(chave) ?? [];
}

/** Os CEG das usinas de um dono: o que o mapa destaca. */
export function cegsDoDono(chave: string, usinas?: readonly FonteDeUsinas[]): ReadonlySet<string> {
  return new Set(usinasDoDono(chave, usinas).map((u) => u.ceg));
}

/** As chaves normalizadas que um campo `dono` cru contém (fração > 0), pela MESMA regra de
 *  donosDaFrota. Memorizado por texto: barato sobre as ~22 mil feições (são ~4,5 mil textos). */
export function chavesDoDono(dono: string | null | undefined): string[] {
  return lerParticipacoes(dono).partes.filter((p) => p.fracao > 0).map((p) => p.chave);
}

/** O dono (chave) tem parte nesta usina? Lê o campo cru da feição, sem precisar da lista. */
export function donoTemParte(textoDoDono: string | null | undefined, chave: string): boolean {
  return lerParticipacoes(textoDoDono).partes.some((p) => p.chave === chave);
}
