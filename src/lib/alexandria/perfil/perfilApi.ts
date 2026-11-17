// Cliente do perfil da Alexandria — contrato lido de `app/routers/progress.py`
// (seção "Perfil da Alexandria"), não de memória.

import { ProgressError } from '@/lib/progress/progressApi';
import type { DiaDeEstudo, PrimeiraVez } from './regras';

export interface PerfilDaConta {
  fuso: string;
  janelaDias: number;
  dias: DiaDeEstudo[];
  primeiras: PrimeiraVez[];
  desde: string | null;
  semRegistro: boolean;
  faixa: string | null;
  temFoto: boolean;
  fotoAtualizadaEm: string | null;
}

async function falha(res: Response): Promise<never> {
  let detalhe = `HTTP ${res.status}`;
  try {
    const corpo = (await res.json()) as { detail?: unknown };
    if (typeof corpo?.detail === 'string') detalhe = corpo.detail;
  } catch {
    /* corpo não-JSON */
  }
  throw new ProgressError(detalhe, res.status);
}

export async function getPerfil(tz: string | null, signal?: AbortSignal): Promise<PerfilDaConta> {
  const url = tz ? `/api/progress/perfil?tz=${encodeURIComponent(tz)}` : '/api/progress/perfil';
  const res = await fetch(url, { credentials: 'include', signal, headers: { Accept: 'application/json' } });
  if (!res.ok) return falha(res);
  return ((await res.json()) as { data: PerfilDaConta }).data;
}

/** A foto vai como corpo cru; o backend confere a assinatura dos bytes. */
export async function enviarFoto(foto: Blob): Promise<{ fotoAtualizadaEm: string }> {
  const res = await fetch('/api/progress/perfil/foto', {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': foto.type || 'application/octet-stream' },
    body: foto,
  });
  if (!res.ok) return falha(res);
  return (await res.json()) as { fotoAtualizadaEm: string };
}

export async function apagarFoto(): Promise<void> {
  const res = await fetch('/api/progress/perfil/foto', { method: 'DELETE', credentials: 'include' });
  if (!res.ok && res.status !== 204) return falha(res);
}

export async function escolherFaixa(faixa: string | null): Promise<void> {
  const res = await fetch('/api/progress/perfil/faixa', {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ faixa }),
  });
  if (!res.ok) return falha(res);
}

/** O endereço da foto, com a data de atualização para não servir a antiga do cache. */
export const enderecoDaFoto = (atualizadaEm: string | null): string =>
  `/api/progress/perfil/foto${atualizadaEm ? `?v=${encodeURIComponent(atualizadaEm)}` : ''}`;

export const FOTO_LADO = 320;
export const FOTO_MAX_BYTES = 300_000;

/** Recorta o centro em quadrado, reduz a 320 px e codifica em WebP
 *  (ou JPEG, se o navegador não gerar WebP), abaixo do teto do backend. */
export async function prepararFoto(arquivo: File): Promise<Blob> {
  const bitmap = await createImageBitmap(arquivo);
  const lado = Math.min(bitmap.width, bitmap.height);
  const tela = document.createElement('canvas');
  tela.width = FOTO_LADO;
  tela.height = FOTO_LADO;
  const ctx = tela.getContext('2d');
  if (!ctx) throw new Error('O navegador não deixou preparar a imagem.');
  ctx.drawImage(bitmap, (bitmap.width - lado) / 2, (bitmap.height - lado) / 2, lado, lado, 0, 0, FOTO_LADO, FOTO_LADO);
  bitmap.close();
  for (const q of [0.86, 0.72, 0.55]) {
    for (const tipo of ['image/webp', 'image/jpeg']) {
      const blob = await new Promise<Blob | null>((r) => tela.toBlob(r, tipo, q));
      if (blob && blob.type === tipo && blob.size <= FOTO_MAX_BYTES) return blob;
    }
  }
  throw new Error('A imagem ficou grande demais mesmo reduzida.');
}
