// Medalha cunhada: gravura de latão gerada (Higgsfield, 16/11/2026), uma por
// motivo, com a orla da família desenhada na própria arte (CONCLUSÃO lisa e
// dupla, HÁBITO perolada, EXPLORAÇÃO com 16 marcas) — sistema-de-conquistas.md §6.
// Não obtida é o "disco cego": a mesma medalha sem tinta (cinza, apagada).
// O ponto de óxido marca só a mais recente.
// Arquivos em public/alexandria/v3/jogo/m-*.webp; procedência em
// docs/alexandria-v2/media-provenance.md.

import type { FamiliaDeMedalha } from '@/lib/alexandria/perfil/regras';

export type MotivoDaMedalha =
  | 'ponto'
  | 'estacao'
  | 'territorio'
  | 'curriculo'
  | 'contagem'
  | 'corrida'
  | 'calendario'
  | 'rosa'
  | 'instrumento';

const RAIZ = '/alexandria/v3/jogo';

export function Medalha({
  motivo,
  obtida,
  recente = false,
  tamanho = 72,
}: {
  familia: FamiliaDeMedalha;
  motivo: MotivoDaMedalha;
  obtida: boolean;
  recente?: boolean;
  tamanho?: number;
}) {
  return (
    <span
      className={`medalha${obtida ? ' medalha-obtida' : ' medalha-cega'}`}
      style={{ width: tamanho, height: tamanho }}
      aria-hidden="true"
    >
      <img
        src={`${RAIZ}/m-${motivo}.webp`}
        srcSet={`${RAIZ}/m-${motivo}.webp 1x, ${RAIZ}/m-${motivo}@2x.webp 2x`}
        width={tamanho}
        height={tamanho}
        alt=""
        loading="lazy"
        decoding="async"
      />
      {obtida && recente && <span className="medalha-ponto-recente" />}
    </span>
  );
}
