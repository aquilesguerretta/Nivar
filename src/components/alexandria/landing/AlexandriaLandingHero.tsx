// AlexandriaLandingHero — a entrada do produto.
//
// Hero e hub coexistem na mesma página: hero em cima, hub logo abaixo, um
// scroll só. O hero é anúncio, não portão — quem chega pelo `?trilha=` do
// portal vê a trilha destacada sem clique nenhum.
//
// A ilustração é GRAVURA ESTÁTICA, não mapa interativo. O mapa vivo é a
// feature Atlas, que ainda não existe; desenhar um aqui competiria com ela
// em vez de apontar para ela.
//
// Toda estatística é derivada dos catálogos — `ALEXANDRIA_BLOCKS` e
// `ALEXANDRIA_TRILHAS`. Nenhum número digitado solto: se o currículo
// crescer, o hero acompanha sozinho.

import { ALEXANDRIA_BLOCKS } from '@/lib/data/alexandria-blocks';
import { ALEXANDRIA_TRILHAS } from '@/lib/data/alexandria-trilhas';
import { A, A2, AT, AS, AR, AE } from '@/design/alexandria-tokens';

/** `orn-13-mapa-dobrado` foi escolhida vendo as seis candidatas
 *  renderizadas lado a lado. É a única que é o Brasil especificamente —
 *  litoral e território reconhecíveis —, é um mapa (a metáfora do atlas),
 *  e é horizontal, que é o que a faixa do hero pede. Astrolábio e sextante
 *  são náuticos; teodolito e compasso são instrumento genérico e verticais;
 *  o pergaminho está literalmente em branco. */
const GRAVURA = '/alexandria/gravuras/orn-13-mapa-dobrado.png';

/** Aulas com fonte confirmada. Soma só as trilhas cujo `totalAulas` não é
 *  null — piso confirmado, nunca total presumido do currículo. */
const AULAS_CONFIRMADAS = ALEXANDRIA_TRILHAS.reduce(
  (soma, t) => soma + (t.totalAulas ?? 0),
  0,
);

const ESTATISTICAS = [
  { valor: String(ALEXANDRIA_BLOCKS.length), rotulo: 'Blocos', nota: 'do currículo definitivo' },
  { valor: String(ALEXANDRIA_TRILHAS.length), rotulo: 'Trilhas', nota: 'do universal ao estratégico' },
  { valor: String(AULAS_CONFIRMADAS), rotulo: 'Aulas', nota: 'escritas e confirmadas' },
];

export function AlexandriaLandingHero({ onComecar }: { onComecar?: () => void }) {
  return (
    <section
      style={{
        display: 'grid',
        // Texto à esquerda, gravura à direita. Colapsa numa coluna quando o
        // canvas aperta — a gravura vai para baixo, não encolhe até sumir.
        gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.85fr)',
        gap: AS.xxl,
        alignItems: 'center',
        borderBottom: `1px solid ${A.fioSobreCreme}`,
        paddingBottom: AS.xxl,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: AS.lg, minWidth: 0 }}>
        <span style={{ ...AT.rotulo, color: A.terracota }}>Alexandria</span>

        <h1 style={{ ...AT.display, color: A.tintaSobreCreme, margin: 0, lineHeight: 1.05 }}>
          O atlas técnico da energia do Brasil
        </h1>

        <p
          style={{
            ...AT.corpo,
            fontSize: '16px',
            lineHeight: 1.65,
            color: A.tintaSuave,
            maxWidth: '54ch',
            margin: 0,
          }}
        >
          Do watt à fatura industrial, do submercado à decisão de contrato.
          Currículo escrito para quem precisa defender um número em reunião —
          não para quem quer só reconhecer o vocabulário.
        </p>

        {/* Estatística real, derivada do catálogo. Blocos irmãos separados
            por fio, nunca por card. */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${ESTATISTICAS.length}, auto)`,
            justifyContent: 'start',
            borderTop: `1px solid ${A.fioSobreCreme}`,
            borderBottom: `1px solid ${A.fioSobreCreme}`,
          }}
        >
          {ESTATISTICAS.map((e, i) => (
            <div
              key={e.rotulo}
              style={{
                padding: `${AS.md} ${AS.xl} ${AS.md} ${i === 0 ? '0' : AS.xl}`,
                borderLeft: i > 0 ? `1px solid ${A.fioSobreCreme}` : 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <span style={{ ...AT.h2, color: A.tintaSobreCreme }}>{e.valor}</span>
              <span style={{ ...AT.rotulo, color: A2.tintaMetadado }}>{e.rotulo}</span>
              <span style={{ ...AT.dado, fontSize: '11px', color: A.tintaSuave }}>{e.nota}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onComecar}
          style={{
            ...AT.nav,
            alignSelf: 'flex-start',
            color: A.tintaSobreCreme,
            background: 'none',
            // Chip é retângulo de fio — nunca pílula, nunca raio.
            border: `1px solid ${A.terracota}`,
            borderRadius: AR.none,
            padding: `${AS.md} ${AS.xl}`,
            cursor: 'pointer',
            transition: `background ${AE.hover} ${AE.easing}, color ${AE.hover} ${AE.easing}`,
          }}
        >
          Começar minha trilha ↓
        </button>
      </div>

      <img
        src={GRAVURA}
        alt="Mapa dobrado do Brasil, gravura"
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: 300,
          objectFit: 'contain',
          display: 'block',
          borderRadius: AR.none,
        }}
      />
    </section>
  );
}

export default AlexandriaLandingHero;
