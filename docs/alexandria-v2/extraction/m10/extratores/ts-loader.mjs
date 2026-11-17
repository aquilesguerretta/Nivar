// Loader de resolução para importar os .ts do repositório (só leitura) no Node 24:
// acrescenta a extensão .ts a imports relativos sem extensão e resolve o alias '@/'.
import { pathToFileURL } from 'node:url';
const SRC = 'C:/dev/gridalpha-v2-alexandria-v2-restructure/src/';
export async function resolve(spec, ctx, next) {
  if (spec.startsWith('@/')) return next(pathToFileURL(SRC + spec.slice(2) + '.ts').href, ctx);
  try { return await next(spec, ctx); } catch (e) {
    if ((spec.startsWith('./') || spec.startsWith('../')) && !/\.[cm]?[jt]s$/.test(spec)) return next(spec + '.ts', ctx);
    throw e;
  }
}
