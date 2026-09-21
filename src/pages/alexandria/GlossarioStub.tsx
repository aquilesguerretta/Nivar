// GlossarioStub — desde a Wave 8, monta a página real do glossário.
//
// O nome do arquivo fica: é o contrato de rota que a Wave 6 registrou, e
// as rotas não são posse desta wave. O corpo do stub honesto foi
// substituído pelos 38 verbetes reais extraídos do § Lex do Módulo 01 —
// ver `src/lib/data/alexandria-glossario.ts` para a procedência.

import { AlexandriaShell } from '@/components/alexandria/shell/AlexandriaShell';
import { GlossarioView } from '@/components/alexandria/glossario/GlossarioView';

export function GlossarioStub() {
  return (
    <AlexandriaShell navAtivo="glossario">
      <GlossarioView />
    </AlexandriaShell>
  );
}

export default GlossarioStub;
