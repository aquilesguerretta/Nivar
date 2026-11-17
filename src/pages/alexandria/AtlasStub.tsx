// Atlas da Alexandria v3 — a rota /alexandria/atlas.
//
// O nome do arquivo fica (é o contrato de rota desde a Wave 6: o
// AlexandriaRouter importa `AtlasStub` daqui), mas o conteúdo é o Atlas novo:
// um mapa Mapbox com a infraestrutura elétrica do Brasil, dentro da casca v3.
//
// O Atlas é carregado por React.lazy de propósito: o mapbox-gl pesa, e só quem
// abre esta rota deve pagar por ele. A casca (barra, navegação, modo) aparece
// de imediato; o mapa entra em seguida.

import { Suspense, lazy, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CasaV3 } from '@/components/alexandria/v3/CasaV3';
import { useEstudo } from '@/components/alexandria/home/estudo';

const AtlasV3 = lazy(() => import('@/components/alexandria/atlas/AtlasV3'));

export function AtlasStub() {
  const estudo = useEstudo();
  const ancora = useRef<HTMLDivElement | null>(null);

  // O Atlas ocupa exatamente a altura que sobra abaixo da casca. A altura da
  // casca muda com a largura (no celular a navegação quebra em duas linhas),
  // então é medida, não presumida, e entregue ao CSS por --casa-alt.
  useEffect(() => {
    const raiz = ancora.current?.closest('.alx3') as HTMLElement | null;
    const casa = raiz?.querySelector('.casa') as HTMLElement | null;
    if (!raiz || !casa) return;
    const medir = () => raiz.style.setProperty('--casa-alt', `${Math.ceil(casa.getBoundingClientRect().height)}px`);
    medir();
    const obs = new ResizeObserver(medir);
    obs.observe(casa);
    return () => {
      obs.disconnect();
      raiz.style.removeProperty('--casa-alt');
    };
  }, []);

  const conta = estudo.fase === 'conta' ? estudo : null;
  const contaNaCasa = conta ? (
    <Link to="/conta" className="casa-conta">
      {conta.nome}
    </Link>
  ) : (
    <Link to="/entrar" className="casa-conta">
      Entrar
    </Link>
  );

  return (
    <CasaV3 secao="atlas" conta={contaNaCasa}>
      <div ref={ancora} />
      <Suspense
        fallback={
          <main className="atl" aria-busy="true">
            <p className="v-dado" style={{ padding: 24 }}>
              Abrindo o Atlas…
            </p>
          </main>
        }
      >
        <AtlasV3 />
      </Suspense>
    </CasaV3>
  );
}

export default AtlasStub;
