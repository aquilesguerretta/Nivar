// Ganchos de apresentação da Alexandria v3: modo claro/noturno e revelar ao rolar.
// O modo é conveniência por leitor (localStorage, sempre em try/catch); nada de
// progresso mora aqui — progresso vem do backend.

import { useCallback, useEffect, useRef, useState } from 'react';

export type ModoV3 = 'claro' | 'noturno';
const CHAVE_MODO = 'alx3-modo';

function lerModo(): ModoV3 {
  try {
    const v = window.localStorage.getItem(CHAVE_MODO);
    if (v === 'claro' || v === 'noturno') return v;
  } catch {
    /* armazenamento indisponível: segue o padrão */
  }
  return 'claro';
}

export function useModoV3(): [ModoV3, () => void] {
  const [modo, setModo] = useState<ModoV3>(lerModo);
  const alternar = useCallback(() => {
    setModo((m) => {
      const novo: ModoV3 = m === 'claro' ? 'noturno' : 'claro';
      try {
        window.localStorage.setItem(CHAVE_MODO, novo);
      } catch {
        /* sem persistência, o modo vale só nesta visita */
      }
      return novo;
    });
  }, []);
  return [modo, alternar];
}

/** Marca com `.visivel` cada `.revelar` dentro do contêiner quando entra na tela. */
export function useRevelar<T extends HTMLElement>(dependencias: unknown[] = []) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const raiz = ref.current;
    if (!raiz) return;
    const alvos = Array.from(raiz.querySelectorAll<HTMLElement>('.revelar:not(.visivel)'));
    if (!('IntersectionObserver' in window)) {
      alvos.forEach((a) => a.classList.add('visivel'));
      return;
    }
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) {
            e.target.classList.add('visivel');
            obs.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );
    alvos.forEach((a) => obs.observe(a));
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencias);
  return ref;
}

/** Rola a raiz .alx3 até o elemento. Não usa scrollIntoView suave: com o
 *  rolador aninhado (o app trava html/body), `scrollIntoView({ behavior:
 *  'smooth' })` rola 0 px — medido em AlexandriaHome. */
export function rolarPara(id: string, suave = true) {
  const alvo = document.getElementById(id);
  const raiz = alvo?.closest<HTMLElement>('.alx3');
  if (!alvo || !raiz) return;
  const topo = alvo.getBoundingClientRect().top - raiz.getBoundingClientRect().top + raiz.scrollTop;
  const casa = raiz.querySelector<HTMLElement>('.casa');
  const folga = (casa && getComputedStyle(casa).position === 'sticky' ? casa.offsetHeight : 0) + 16;
  const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  raiz.scrollTo({ top: Math.max(0, topo - folga), behavior: suave && !reduzir ? 'smooth' : 'auto' });
}
