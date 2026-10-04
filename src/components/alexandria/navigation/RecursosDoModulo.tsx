// RecursosDoModulo — exercícios soltos e instrumentos de módulo.
// LYCEUM Wave 34, Fase C.
//
// O problema que este componente fecha: 71 exercícios reais extraídos
// (Ex de síntese e exercícios que a fonte não vincula a aula nenhuma)
// viviam em buckets `SOLTOS` que nenhuma tela lia, mais o `LAB · 01` do
// Módulo 01 — instrumento do aparato § Lab, fora de qualquer aula, com
// calculadora portada e testada desde a Wave 4 e nunca renderizado.
//
// A convenção dos buckets NÃO é uniforme, medida arquivo a arquivo:
// o Módulo 01 exporta `MODULO_01_SINTESE`; os Módulos 02-09 exportam
// `MODULO_NN_EXERCICIOS_SOLTOS`. O registro abaixo absorve a diferença.
//
// Instrumento de módulo: só o `lab-01` EXISTE como dado. O `Inst · 01`
// dos Módulos 06 (linha do tempo) e 07 (mapa institucional) nunca foi
// materializado como `Instrument` — são chips clicáveis sem campo nem
// saída (taxonomia da FOUNDRY Wave 4), e extraí-los é trabalho de
// extração fora da posse desta fase. Ficam como pendência registrada,
// não como seção vazia fingindo conteúdo.
//
// Módulo sem exercício solto E sem instrumento de módulo não renderiza
// nada — sem seção vazia, sem espaço morto.
//
// O registro mora aqui (e não em `alexandria-curriculo.ts`) porque o
// resolvedor está fora da posse desta fase. Candidato natural a migrar
// para lá quando aquele arquivo abrir de novo.

import type { Instrument, LessonActivity } from '@/lib/types/alexandria';
import {
  INSTRUMENTOS_MODULO_01,
  MODULO_01_SINTESE,
} from '@/lib/data/alexandria-modulo-01-content';
import { MODULO_02_EXERCICIOS_SOLTOS } from '@/lib/data/alexandria-modulo-02-content';
import { MODULO_03_EXERCICIOS_SOLTOS } from '@/lib/data/alexandria-modulo-03-content';
import { MODULO_04_EXERCICIOS_SOLTOS } from '@/lib/data/alexandria-modulo-04-content';
import { MODULO_05_EXERCICIOS_SOLTOS } from '@/lib/data/alexandria-modulo-05-content';
import {
  MODULO_06_EXERCICIOS_SOLTOS,
  MODULO_06_INSTRUMENTOS,
} from '@/lib/data/alexandria-modulo-06-content';
import {
  MODULO_07_EXERCICIOS_SOLTOS,
  MODULO_07_INSTRUMENTOS,
} from '@/lib/data/alexandria-modulo-07-content';
import {
  MODULO_08_EXERCICIOS_SOLTOS,
  MODULO_08_INSTRUMENTOS,
} from '@/lib/data/alexandria-modulo-08-content';
import { MODULO_09_EXERCICIOS_SOLTOS } from '@/lib/data/alexandria-modulo-09-content';
import { ExercicioBlock } from '@/components/alexandria/viewer/ExercicioBlock';
import { InstrumentPanel } from '@/components/alexandria/viewer/InstrumentPanel';
import { A, AT, AS } from '@/design/alexandria-tokens';

interface Recursos {
  exercicios: LessonActivity[];
  instrumentos: Instrument[];
}

/** `lab-01` é o único instrumento do array da Wave 4 que nenhuma aula
 *  referencia — o filtro é por id explícito, não por dedução. */
const LAB_01 = INSTRUMENTOS_MODULO_01.filter((x) => x.id === 'lab-01');

const RECURSOS: Record<string, Recursos> = {
  'modulo-01': { exercicios: MODULO_01_SINTESE, instrumentos: LAB_01 },
  'modulo-02': { exercicios: MODULO_02_EXERCICIOS_SOLTOS, instrumentos: [] },
  'modulo-03': { exercicios: MODULO_03_EXERCICIOS_SOLTOS, instrumentos: [] },
  'modulo-04': { exercicios: MODULO_04_EXERCICIOS_SOLTOS, instrumentos: [] },
  'modulo-05': { exercicios: MODULO_05_EXERCICIOS_SOLTOS, instrumentos: [] },
  'modulo-06': { exercicios: MODULO_06_EXERCICIOS_SOLTOS, instrumentos: MODULO_06_INSTRUMENTOS },
  'modulo-07': { exercicios: MODULO_07_EXERCICIOS_SOLTOS, instrumentos: MODULO_07_INSTRUMENTOS },
  'modulo-08': { exercicios: MODULO_08_EXERCICIOS_SOLTOS, instrumentos: MODULO_08_INSTRUMENTOS },
  'modulo-09': { exercicios: MODULO_09_EXERCICIOS_SOLTOS, instrumentos: [] },
};

export function RecursosDoModulo({ moduloId }: { moduloId: string }) {
  const r = RECURSOS[moduloId];
  if (!r || (r.exercicios.length === 0 && r.instrumentos.length === 0)) return null;

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: AS.lg }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: AS.md, flexWrap: 'wrap' }}>
        <span
          style={{
            ...AT.rotulo,
            color: A.terracota,
            paddingBottom: AS.xs,
          }}
        >
          Recursos do módulo
        </span>
        <span style={{ ...AT.dado, fontSize: '12px', color: A.tintaSuave }}>
          {descreve(r)}
        </span>
      </div>
      <span
        style={{
          ...AT.corpo,
          fontSize: '13px',
          color: A.tintaSuave,
          maxWidth: '68ch',
          borderTop: `1px solid ${A.fioSobreCreme}`,
          paddingTop: AS.md,
        }}
      >
        Material que a fonte declara no nível do módulo, não de uma aula —
        exercícios de síntese e instrumentos de aparato. É parte do critério
        de conclusão tanto quanto as aulas acima.
      </span>

      {r.instrumentos.map((inst) => (
        <InstrumentPanel key={inst.id} instrumento={inst} />
      ))}

      {r.exercicios.length > 0 && <ExercicioBlock atividades={r.exercicios} />}
    </section>
  );
}

function descreve(r: Recursos): string {
  const partes: string[] = [];
  if (r.exercicios.length > 0)
    partes.push(`${r.exercicios.length} exercício${r.exercicios.length > 1 ? 's' : ''}`);
  if (r.instrumentos.length > 0)
    partes.push(`${r.instrumentos.length} instrumento${r.instrumentos.length > 1 ? 's' : ''}`);
  return partes.join(' · ');
}

export default RecursosDoModulo;
