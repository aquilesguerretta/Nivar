// src/lib/operador/idade.ts
// ARCHITECT — Portal do Operador Wave 2, Fase 4.
//
// Há quanto tempo um pedido espera. **Tempo decorrido cru, e só isso.**
//
// ─── O QUE ESTA FUNÇÃO SE RECUSA A FAZER ─────────────────────────────
// Nada aqui devolve prazo, meta, percentual de SLA, rótulo de "atrasado"
// nem valor para pintar barra de progresso. A NIVAR não assumiu
// compromisso de prazo com cliente nenhum, e a doutrina de não prometer
// o que a estrutura não sustenta vale na tela interna igual: um número
// que o operador vê como "faltam 2 dias" vira, na conversa com o
// cliente, uma promessa que ninguém fez.
//
// A consequência de projeto é que **não existe cor de urgência**. A
// idade sai sempre na mesma cor, e a ordenação é o que traz o mais
// antigo para o topo. Quem decide o que é muito tempo é a pessoa que lê,
// não a função que formata.
//
// ─── POR QUE NÃO `Intl.RelativeTimeFormat` ───────────────────────────
// Ele devolve uma unidade só ("há 3 dias"), e a fila precisa da segunda
// para distinguir 3 d 1 h de 3 d 22 h — que numa lista ordenada por
// idade é justamente a diferença que importa. Fora que ele fala em
// aproximação ("há cerca de"), e aqui o número é medida, não estimativa.
//
// A varredura da recon (§6.3) confirmou que não havia nada a reusar: as
// 15 ocorrências de `timeAgo` em `src/` são string literal de mock do
// terminal americano, nenhuma calculada.

/** Componentes crus do intervalo, para quem precisar do número e não do
 *  texto (ordenação usa `ms`, nunca a string). */
export interface Idade {
  ms: number;
  dias: number;
  horas: number;
  minutos: number;
  /** O carimbo é do futuro? Não é erro de usuário — é relógio de cliente
   *  adiantado, ou dado de teste. Formata como `agora` em vez de
   *  inventar um negativo. */
  futuro: boolean;
}

const MIN = 60_000;
const HORA = 60 * MIN;
const DIA = 24 * HORA;

export function medirIdade(desde: string | Date, agora: Date = new Date()): Idade {
  const inicio = typeof desde === 'string' ? new Date(desde) : desde;
  const ms = agora.getTime() - inicio.getTime();
  const abs = Math.max(0, ms);
  return {
    ms: abs,
    dias: Math.floor(abs / DIA),
    horas: Math.floor((abs % DIA) / HORA),
    minutos: Math.floor((abs % HORA) / MIN),
    futuro: ms < 0,
  };
}

/** Tempo decorrido em duas unidades no máximo, da maior para a menor.
 *  Sem "há", sem "atrás", sem aproximação — é uma medida numa coluna de
 *  tabela, não uma frase.
 *
 *  `3 d 4 h` · `12 h 20 min` · `8 min` · `agora`
 *
 *  A segunda unidade some quando é zero (`3 d`, não `3 d 0 h`), porque
 *  zero à direita numa coluna tabular é ruído que compete com o dígito
 *  que importa. */
export function formatarIdade(desde: string | Date, agora?: Date): string {
  const { dias, horas, minutos, futuro, ms } = medirIdade(desde, agora);
  if (futuro || ms < MIN) return 'agora';
  if (dias > 0) return horas > 0 ? `${dias} d ${horas} h` : `${dias} d`;
  if (horas > 0) return minutos > 0 ? `${horas} h ${minutos} min` : `${horas} h`;
  return `${minutos} min`;
}

/** A mesma medida por extenso, para `title` e leitor de tela — a forma
 *  curta é ótima para varrer com o olho e ruim para ouvir. */
export function idadePorExtenso(desde: string | Date, agora?: Date): string {
  const { dias, horas, minutos, futuro, ms } = medirIdade(desde, agora);
  if (futuro || ms < MIN) return 'há menos de um minuto';
  const partes: string[] = [];
  if (dias > 0) partes.push(`${dias} ${dias === 1 ? 'dia' : 'dias'}`);
  if (horas > 0) partes.push(`${horas} ${horas === 1 ? 'hora' : 'horas'}`);
  if (dias === 0 && minutos > 0) partes.push(`${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`);
  return `há ${partes.join(' e ')}`;
}

/** Data do carimbo em ISO curto, mono tabular na tela. `2026-08-31` —
 *  ordenável como texto, sem ambiguidade de dia/mês, e é a convenção que
 *  o resto do repo já usa em dado. */
export function formatarData(quando: string | Date): string {
  const d = typeof quando === 'string' ? new Date(quando) : quando;
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
