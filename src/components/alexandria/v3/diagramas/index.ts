// Registro dos diagramas do M01: o nome que figuras.ts guarda em `diagrama`
// → o componente. A sessão do modelo de aula faz `DIAGRAMAS[figura.diagrama]`.

import type { ComponentType } from 'react';
import { EscalaDePotencia, EnergiaPotenciaTempo } from './aula01';
import { EscadaDeTensoes, CadeiaDeUnidades } from './aula02';
import { CorrenteDcAc, GeracaoConsumoFrequencia } from './aula03';
import { PerdasI2R, MesmaPotenciaMaisTensao } from './aula04';
import { DemandaMaximaMedia, FaixasFatorDeCarga } from './aula05';
import { SubgruposPorTensao, SistemasDeFases } from './aula06';
import { TrianguloDePotencia, FaseCorrente, ReferenciaFatorDePotencia } from './aula07';
import { CapacidadeGeracaoExemplo, FatoresDeCapacidadeTipicos } from './aula08';
import { JanelaDeMedicao, FenomenosDeTensao } from './aula09';

export const DIAGRAMAS: Record<string, ComponentType> = {
  EscalaDePotencia,
  EnergiaPotenciaTempo,
  EscadaDeTensoes,
  CadeiaDeUnidades,
  CorrenteDcAc,
  GeracaoConsumoFrequencia,
  PerdasI2R,
  MesmaPotenciaMaisTensao,
  DemandaMaximaMedia,
  FaixasFatorDeCarga,
  SubgruposPorTensao,
  SistemasDeFases,
  TrianguloDePotencia,
  FaseCorrente,
  ReferenciaFatorDePotencia,
  CapacidadeGeracaoExemplo,
  FatoresDeCapacidadeTipicos,
  JanelaDeMedicao,
  FenomenosDeTensao,
};

export {
  EscalaDePotencia,
  EnergiaPotenciaTempo,
  EscadaDeTensoes,
  CadeiaDeUnidades,
  CorrenteDcAc,
  GeracaoConsumoFrequencia,
  PerdasI2R,
  MesmaPotenciaMaisTensao,
  DemandaMaximaMedia,
  FaixasFatorDeCarga,
  SubgruposPorTensao,
  SistemasDeFases,
  TrianguloDePotencia,
  FaseCorrente,
  ReferenciaFatorDePotencia,
  CapacidadeGeracaoExemplo,
  FatoresDeCapacidadeTipicos,
  JanelaDeMedicao,
  FenomenosDeTensao,
};
