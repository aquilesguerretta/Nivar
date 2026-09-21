// ApostilaPanel — renderiza os blocos de corpo da aula.
//
// Apostila não é dado novo: é modo de renderização do texto escrito da
// própria aula. O vocabulário de bloco (`AulaBloco`) saiu de um
// levantamento dos elementos que realmente aparecem nas nove aulas —
// título numerado, parágrafo, fórmula, nota, lista, tabela. Nada inventado.
//
// O HTML inline vem do arquivo estático do repo, filtrado na extração para
// um conjunto pequeno (b/strong/i/em/u/sub/sup/br/span.calc). Não é entrada
// de usuário.

import type { AulaBloco } from '@/lib/data/alexandria-modulo-01-content';
import { A, A2, AT, AS, AR } from '@/design/alexandria-tokens';

const TOM: Record<string, string> = {
  red: A.terracota,
  gold: A2.ouroSobreNavy,
  neutro: A2.fioColunaSobreCreme,
};

export function ApostilaPanel({
  lead,
  blocos,
  gravuras = [],
}: {
  lead?: string;
  blocos: AulaBloco[];
  /** Nomes de arquivo de `CurriculumAula.illustrations`. Array vazio não
   *  reserva espaço nenhum — a prancha simplesmente não existe. */
  gravuras?: string[];
}) {
  return (
    <article style={{ display: 'flex', flexDirection: 'column', gap: AS.lg }}>
      {lead && (
        <p
          style={{
            ...AT.corpo,
            fontSize: '17px',
            lineHeight: 1.6,
            fontStyle: 'italic',
            color: A.tintaSobreCreme,
            margin: 0,
          }}
          dangerouslySetInnerHTML={{ __html: lead }}
        />
      )}

      {gravuras.length > 0 && <Prancha gravuras={gravuras} />}

      {blocos.map((b, i) => {
        switch (b.kind) {
          case 'titulo':
            return (
              <h3
                key={i}
                style={{
                  ...AT.h3,
                  color: A.tintaSobreCreme,
                  margin: `${AS.md} 0 0`,
                  display: 'flex',
                  gap: AS.md,
                  alignItems: 'baseline',
                }}
              >
                {b.numero && (
                  <span style={{ ...AT.dado, fontSize: '13px', color: A.terracota }}>{b.numero}</span>
                )}
                <span>{b.texto}</span>
              </h3>
            );

          case 'paragrafo':
            return (
              <p
                key={i}
                style={{ ...AT.corpo, color: A.tintaSobreCreme, margin: 0 }}
                dangerouslySetInnerHTML={{ __html: b.html }}
              />
            );

          case 'formula':
            return (
              <div
                key={i}
                style={{
                  borderLeft: `3px solid ${A.terracota}`,
                  padding: `${AS.sm} ${AS.lg}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: AS.xs,
                }}
              >
                <span style={{ ...AT.dado, fontSize: '18px', color: A.tintaSobreCreme }}>{b.eq}</span>
                {b.desc && (
                  <span style={{ ...AT.dado, fontSize: '12px', color: A2.tintaMetadado }}>{b.desc}</span>
                )}
              </div>
            );

          case 'nota':
            return (
              <aside
                key={i}
                style={{
                  borderLeft: `3px solid ${TOM[b.tom] ?? TOM.neutro}`,
                  padding: `${AS.sm} ${AS.lg}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: AS.xs,
                }}
              >
                {b.label && (
                  <span style={{ ...AT.rotulo, fontSize: '10px', color: TOM[b.tom] ?? A.tintaSuave }}>
                    {b.label}
                  </span>
                )}
                <span
                  style={{ ...AT.corpo, fontSize: '14px', lineHeight: 1.6, color: A.tintaSuave }}
                  dangerouslySetInnerHTML={{ __html: b.html }}
                />
              </aside>
            );

          case 'lista':
            return (
              <ul key={i} style={{ margin: 0, paddingLeft: AS.xl, display: 'flex', flexDirection: 'column', gap: AS.sm }}>
                {b.itens.map((it, j) => (
                  <li
                    key={j}
                    style={{ ...AT.corpo, fontSize: '15px', color: A.tintaSobreCreme, maxWidth: 'none' }}
                    dangerouslySetInnerHTML={{ __html: it }}
                  />
                ))}
              </ul>
            );

          case 'tabela':
            return <Tabela key={i} linhas={b.linhas} />;

          default:
            return null;
        }
      })}
    </article>
  );
}

/** Prancha de gravuras — a imagem real da biblioteca sobre o papel do
 *  sistema. Servida de `/alexandria/gravuras/`, fundo transparente,
 *  proporção preservada (`objectFit: contain`, nunca esticada).
 *
 *  Chamada só quando há gravura: array vazio não reserva slot, não deixa
 *  buraco, não desenha placeholder. */
function Prancha({ gravuras }: { gravuras: string[] }) {
  return (
    <figure
      style={{
        margin: 0,
        display: 'grid',
        gridTemplateColumns: gravuras.length > 1 ? 'repeat(auto-fit, minmax(200px, 1fr))' : '1fr',
        gap: AS.lg,
        borderTop: `1px solid ${A.fioSobreCreme}`,
        borderBottom: `1px solid ${A.fioSobreCreme}`,
        padding: `${AS.lg} 0`,
      }}
    >
      {gravuras.map((arquivo) => (
        <div
          key={arquivo}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: AS.sm,
            // Gravura sozinha não ocupa a prancha inteira: as imagens são
            // quadradas ou 3:2, e esticar a caixa até 1056 px deixaria a
            // figura ilhada no meio de vazio.
            maxWidth: gravuras.length > 1 ? 'none' : 420,
            marginInline: gravuras.length > 1 ? undefined : 'auto',
          }}
        >
          <img
            src={`/alexandria/gravuras/${arquivo}`}
            alt={legenda(arquivo)}
            loading="lazy"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: gravuras.length > 1 ? 220 : 380,
              objectFit: 'contain',
              display: 'block',
              borderRadius: AR.none,
            }}
          />
          <figcaption
            style={{ ...AT.rotulo, fontSize: '9px', color: A2.tintaMetadado, textAlign: 'center' }}
          >
            {legenda(arquivo)}
          </figcaption>
        </div>
      ))}
    </figure>
  );
}

/** Legenda derivada do nome do arquivo — `fis-01-dinamo-cc.png` vira
 *  "Dínamo CC". Derivação determinística, não texto inventado: a
 *  biblioteca não traz legenda própria.
 *
 *  Nome de arquivo é ASCII, então acento se perde na derivação. `ACENTOS`
 *  devolve a grafia correta das palavras já em uso — é correção
 *  ortográfica da mesma palavra, não rótulo inventado. Precisa crescer
 *  conforme mais gravuras forem mapeadas. */
const ACRONIMOS = new Set(['cc', 'ca', 'ac', 'dc', 'pch', 'gnl', 'pwr', 'h2']);
const ACENTOS: Record<string, string> = {
  dinamo: 'dínamo',
  frequencia: 'frequência',
  potencia: 'potência',
  triangulo: 'triângulo',
  eletrica: 'elétrica',
  eletrico: 'elétrico',
  inducao: 'indução',
  medicao: 'medição',
  composicao: 'composição',
};

function legenda(arquivo: string): string {
  const partes = arquivo.replace(/\.png$/, '').split('-').slice(2);
  if (!partes.length) return arquivo;
  return partes
    .map((bruto, i) => {
      if (ACRONIMOS.has(bruto)) return bruto.toUpperCase();
      const p = ACENTOS[bruto] ?? bruto;
      return i === 0 ? p.charAt(0).toUpperCase() + p.slice(1) : p;
    })
    .join(' ');
}

function Tabela({ linhas }: { linhas: string[][] }) {
  if (!linhas.length) return null;
  const [cabeca, ...corpo] = linhas;
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', borderRadius: AR.none }}>
        <thead>
          <tr>
            {cabeca.map((c, i) => (
              <th
                key={i}
                style={{
                  ...AT.rotulo,
                  fontSize: '10px',
                  color: A2.tintaMetadado,
                  textAlign: 'left',
                  padding: `${AS.sm} ${AS.md}`,
                  borderBottom: `1px solid ${A.fioSobreCreme}`,
                  borderTop: `1px solid ${A.fioSobreCreme}`,
                  whiteSpace: 'nowrap',
                }}
                dangerouslySetInnerHTML={{ __html: c }}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {corpo.map((linha, i) => (
            <tr key={i}>
              {linha.map((c, j) => (
                <td
                  key={j}
                  style={{
                    ...AT.dado,
                    fontSize: '13px',
                    color: j === 0 ? A.tintaSobreCreme : A.tintaSuave,
                    padding: `${AS.sm} ${AS.md}`,
                    borderBottom: `1px solid ${A2.fioClaroSobreCreme}`,
                    verticalAlign: 'top',
                  }}
                  dangerouslySetInnerHTML={{ __html: c }}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ApostilaPanel;
