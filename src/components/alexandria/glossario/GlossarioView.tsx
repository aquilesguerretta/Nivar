// GlossarioView — a página real do glossário.
//
// Os 38 verbetes do § Lex do Módulo 01, todos visíveis — glossário de
// monografia é impresso na prancha, não escondido em sanfona. Busca por
// texto no padrão do handoff (fio embaixo, sem caixa de quatro lados),
// agrupamento por letra inicial, e âncora real termo → aula.
//
// A navegação usa a mesma rota da Wave 3:
//   /alexandria/trilha/:trilhaId/modulo/:moduloId/aula/:numero
// com trilha e módulo derivados do catálogo, nunca digitados aqui.

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { GlossaryTerm } from '@/lib/types/alexandria';
import { ALEXANDRIA_GLOSSARIO } from '@/lib/data/alexandria-glossario';
import { getModuleById } from '@/lib/data/alexandria-trilhas';
import { A, A2, AT, AS, AR } from '@/design/alexandria-tokens';
import { GlossaryTermCard } from './GlossaryTermCard';

/** Busca sem sensibilidade a acento nem a HTML inline. */
const normaliza = (s: string) =>
  s
    .replace(/<[^>]+>/g, ' ')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

/** 'aula-01-05' → rota completa da aula, com trilha e módulo vindos do
 *  catálogo. Se o módulo não existir no catálogo (não deve acontecer),
 *  devolve null e o clique não navega para lugar errado. */
function rotaDaAula(aulaId: string): string | null {
  const moduloId = `modulo-${aulaId.slice(5, 7)}`;
  const modulo = getModuleById(moduloId);
  if (!modulo) return null;
  return `/alexandria/trilha/${modulo.trilhaId}/modulo/${modulo.id}/aula/${Number(aulaId.slice(-2))}`;
}

export function GlossarioView() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');

  const visiveis = useMemo(() => {
    const q = normaliza(busca.trim());
    if (!q) return ALEXANDRIA_GLOSSARIO;
    return ALEXANDRIA_GLOSSARIO.filter(
      (t) =>
        normaliza(t.term).includes(q) ||
        normaliza(t.unit).includes(q) ||
        normaliza(t.definition).includes(q),
    );
  }, [busca]);

  // Agrupamento por letra inicial — o catálogo exporta ordenado (desde a
  // Wave 34 a ordenação é explícita no próprio dado), então basta
  // particionar preservando a ordem. A letra é NORMALIZADA sem acento:
  // a ordenação pt-BR intercala 'Água' entre os A, e sem normalizar o
  // marcador viraria A, Á, A — grupo repetido. Os 38 termos originais do
  // Módulo 01 não tinham inicial acentuada, por isso o caso só apareceu
  // quando os Módulos 02-08 entraram (Wave 34).
  const grupos = useMemo(() => {
    const out: { letra: string; termos: GlossaryTerm[] }[] = [];
    for (const t of visiveis) {
      const letra = t.term[0]
        .toUpperCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '');
      const ultimo = out[out.length - 1];
      if (ultimo && ultimo.letra === letra) ultimo.termos.push(t);
      else out.push({ letra, termos: [t] });
    }
    return out;
  }, [visiveis]);

  const comAula = ALEXANDRIA_GLOSSARIO.filter((t) => t.aulaIds.length > 0).length;

  const abrirAula = (aulaId: string) => {
    const rota = rotaDaAula(aulaId);
    if (rota) navigate(rota);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: AS.xl }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: AS.sm }}>
        {/* Wave 34: o glossário deixou de ser só do Módulo 01 — a wave
            estendeu o dado para os § Lex dos Módulos 02-08, e o eyebrow
            fixo virou afirmação falsa na própria tela que a wave mudou.
            Correção mínima de cópia, fora da posse declarada da Fase B
            (que era só o arquivo de dados), pela mesma razão da Wave 15:
            não há como entregar a fase sem ela. */}
        <span style={{ ...AT.rotulo, color: A.terracota }}>§ Lex · Módulos 01-08</span>
        <h1 style={{ ...AT.h1, color: A.tintaSobreCreme, margin: 0 }}>
          Glossário Alexandria
        </h1>
        <p style={{ ...AT.corpo, fontSize: '14px', color: A.tintaSuave, margin: 0 }}>
          Os vocábulos que aparecem em conversa real com diretor de energia,
          gerente de utilidades ou regulador. Cada verbete ancora nas aulas
          onde o termo é genuinamente central.
        </p>
        <span style={{ ...AT.dado, fontSize: '12px', color: A2.tintaMetadado }}>
          {ALEXANDRIA_GLOSSARIO.length} verbetes · {comAula} ancorados em aula ·{' '}
          {ALEXANDRIA_GLOSSARIO.length - comAula} sem âncora de aula
        </span>
      </div>

      {/* Busca — fio embaixo, sem caixa de quatro lados (padrão ⌘K do handoff). */}
      <input
        type="search"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar termo, categoria ou definição…"
        aria-label="Buscar no glossário"
        style={{
          ...AT.corpo,
          fontSize: '14px',
          maxWidth: '48ch',
          color: A.tintaSobreCreme,
          background: 'transparent',
          border: 'none',
          borderBottom: `1px solid ${A.fioSobreCreme}`,
          borderRadius: AR.none,
          padding: `${AS.xs} 0`,
          outline: 'none',
        }}
      />

      {grupos.length === 0 ? (
        <div
          style={{
            borderLeft: `3px solid ${A.fioSobreCreme}`,
            padding: `${AS.md} ${AS.xl}`,
            display: 'flex',
            flexDirection: 'column',
            gap: AS.xs,
          }}
        >
          <span style={{ ...AT.h3, color: A.tintaSuave, letterSpacing: '0.08em' }}>
            Nenhum verbete corresponde
          </span>
          <span style={{ ...AT.corpo, fontSize: '13px', color: A.tintaSuave }}>
            A busca cobre termo, categoria e texto da definição dos 38 verbetes.
          </span>
        </div>
      ) : (
        grupos.map((grupo) => (
          <section key={grupo.letra} style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                ...AT.rotulo,
                color: A.terracota,
                paddingBottom: AS.xs,
              }}
            >
              {grupo.letra}
            </span>
            {grupo.termos.map((termo) => (
              <GlossaryTermCard key={termo.id} termo={termo} onAbrirAula={abrirAula} />
            ))}
          </section>
        ))
      )}
    </div>
  );
}

export default GlossarioView;
