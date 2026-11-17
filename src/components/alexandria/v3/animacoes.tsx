// Animações de entrada compartilhadas pelo Início e pelo Perfil.
// Com prefers-reduced-motion, tudo chega parado no valor final.

import { useEffect, useRef, useState, type RefObject } from 'react';

/** Manchete que sobe palavra por palavra (classe `.sobe`, em home-v3.css). */
export function Palavras({ texto, desde = 0 }: { texto: string; desde?: number }) {
  return (
    <>
      {texto.split(' ').map((p, i) => (
        <span key={i}>
          <span className="sobe" style={{ ['--i' as string]: desde + i }}>
            {p}
          </span>{' '}
        </span>
      ))}
    </>
  );
}

const reduzMovimento = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** 0 → 1 uma vez, quando o elemento entra na tela (curva que desacelera). */
export function useEntrada<T extends HTMLElement>(duracao = 1100): [RefObject<T | null>, number] {
  const ref = useRef<T | null>(null);
  const [k, setK] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduzMovimento() || !('IntersectionObserver' in window)) {
      setK(1);
      return;
    }
    let raf = 0;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const t0 = performance.now();
      const anda = (t: number) => {
        const x = Math.min(1, (t - t0) / duracao);
        setK(1 - Math.pow(1 - x, 4));
        if (x < 1) raf = requestAnimationFrame(anda);
      };
      raf = requestAnimationFrame(anda);
    });
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [duracao]);
  return [ref, k];
}

const nf = new Intl.NumberFormat('pt-BR');

/** Número que conta até o valor quando entra na tela. */
export function Contagem({ valor }: { valor: number }) {
  const [ref, k] = useEntrada<HTMLSpanElement>();
  return (
    <>
      <span ref={ref} aria-hidden="true">
        {nf.format(Math.round(valor * k))}
      </span>
      <span className="so-leitor">{nf.format(valor)}</span>
    </>
  );
}
