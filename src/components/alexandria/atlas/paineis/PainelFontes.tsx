// Atlas da Alexandria v3 — "Fontes, datas e licenças": de onde vem cada camada,
// quando foi baixada, sob que licença, e o que ficou de fora por faltar na fonte.
// Tudo lido de indice.json; o registro completo, com o hash de cada arquivo
// original, está em docs/alexandria-v3/atlas/procedencia.md.

import { dataBr, inteiro } from '@/lib/alexandria/atlas/dados';
import { ComoLer } from './PainelRede';
import type { FonteDeDado, IndiceCombustivel, IndiceDoAtlas, IndiceDoAtlasComCombustivel, IndiceDoAtlasComDistribuicao } from '@/lib/alexandria/atlas/tipos';

/** Data ISO (2025-12-31) escrita dentro de um texto da fonte vira data brasileira (31/12/2025):
 *  o texto vem do índice como a fonte o descreve, mas o leitor lê o padrão do resto da tela. */
const datasBr = (texto: string) => texto.replace(/\b(\d{4})-(\d{2})-(\d{2})\b/g, (_, a: string, m: string, d: string) => `${d}/${m}/${a}`);

function Fonte({ f }: { f: FonteDeDado }) {
  return (
    <li className="atl-fonte">
      <p className="atl-fonte-orgao">{f.orgao}</p>
      <p className="atl-fonte-nome">
        <a href={f.pagina} target="_blank" rel="noreferrer">
          {datasBr(f.conjunto)}
        </a>
      </p>
      <p className="atl-fonte-meta">
        acesso <span className="atl-num">{dataBr(f.acesso)}</span>
        {f.arquivos ? ` · ${f.arquivos} arquivos anuais` : ''} · licença: {datasBr(f.licenca)}
      </p>
      {(f.nota || f.sha256) && (
        <ComoLer rotulo={f.nota ? 'Nota técnica e integridade' : 'Integridade'}>
          {f.nota && <p>{datasBr(f.nota)}</p>}
          {f.sha256 && (
            <p>
              SHA-256 do arquivo original: <span className="atl-hash">{f.sha256}</span>
            </p>
          )}
        </ComoLer>
      )}
    </li>
  );
}

function Bloco({ titulo, resumo, nota, fontes, ausencias }: { titulo: string; resumo: string; nota?: string; fontes: FonteDeDado[]; ausencias?: string[] }) {
  return (
    <section className="atl-grupo">
      <header className="atl-grupo-cabeca">
        <h2 className="atl-grupo-titulo">{titulo}</h2>
      </header>
      <p className="atl-fontes-resumo">{datasBr(resumo)}</p>
      {nota && (
        <ComoLer rotulo="Como o dado foi tratado">
          <p>{datasBr(nota)}</p>
        </ComoLer>
      )}
      <ul className="atl-fontes">
        {fontes.map((f, i) => (
          <Fonte key={i} f={f} />
        ))}
      </ul>
      {ausencias && ausencias.length > 0 && (
        <ul className="atl-ausencias">
          {ausencias.map((a) => (
            <li key={a}>{datasBr(a)}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** Gás e petróleo: nove camadas do mesmo serviço da ANP, com a mesma data de consulta e a
 *  mesma licença. A licença e a data vão uma vez (como a fonte declara); cada camada fica numa
 *  linha com o nome no GeoServer e o hash. Se alguma camada divergir, ela vira um item completo. */
function FontesDaAnp({ comb }: { comb: IndiceCombustivel }) {
  const fontes = [...comb.gasodutos.fontes, ...comb.instalacoes.fontes, ...comb.campos.fontes, ...comb.blocos.fontes, ...comb.baciasSedimentares.fontes, ...comb.presal.fontes];
  const iguais = fontes.filter((f) => f.licenca === comb.licenca && f.acesso === comb.acesso);
  const diferentes = fontes.filter((f) => !iguais.includes(f));
  const ausencias = [
    ...comb.ausencias,
    ...comb.repetidas.map((r) => `Registro repetido na fonte (${r.camada}): ${r.item}${r.problema ? `; ${r.problema}` : ''}`),
    ...(comb.datasIlegiveis.length ? [`${inteiro(comb.datasIlegiveis.length)} datas ilegíveis na fonte ficaram sem data no Atlas (o ano de dois dígitos não é completado).`] : []),
  ];
  return (
    <section className="atl-grupo">
      <header className="atl-grupo-cabeca">
        <h2 className="atl-grupo-titulo">Gás e petróleo</h2>
      </header>
      <p className="atl-fontes-resumo">
        {`${inteiro(comb.gasodutos.trechos)} trechos de gasoduto de transporte (${inteiro(comb.gasodutos.kmDeclarado)} km declarados), ${inteiro(comb.instalacoes.total)} instalações, ${inteiro(comb.campos.total)} campos de produção, ${inteiro(comb.blocos.total)} blocos exploratórios, ${inteiro(comb.baciasSedimentares.total)} bacias sedimentares e o polígono do pré-sal. Nenhuma camada traz data própria do dado: vale a data da consulta.`}
      </p>
      <ul className="atl-fontes">
        <li className="atl-fonte">
          <p className="atl-fonte-orgao">ANP</p>
          <p className="atl-fonte-nome">
            <a href={comb.capacidadesDoServico.pagina} target="_blank" rel="noreferrer">
              GeoServer da ANP · WFS
            </a>
          </p>
          <p className="atl-fonte-meta">
            acesso <span className="atl-num">{dataBr(comb.acesso)}</span> · licença: {comb.licenca}
          </p>
          <ComoLer rotulo={`As ${iguais.length} camadas e a integridade`}>
            <ul className="atl-fonte-camadas">
              {iguais.map((f) => (
                <li key={f.camada ?? f.conjunto}>
                  {f.camada ?? f.conjunto}
                  {f.sha256 ? <span className="atl-hash"> · {f.sha256.slice(0, 12)}…</span> : null}
                </li>
              ))}
            </ul>
          </ComoLer>
        </li>
        {diferentes.map((f, i) => (
          <Fonte key={i} f={f} />
        ))}
      </ul>
      <ul className="atl-ausencias">
        {ausencias.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
    </section>
  );
}

/** Reservatórios com série: conta os do mapa quando o índice já traz o
 *  cruzamento (reservatorios.comSerieNoMapa); senão diz só quantas séries o ONS
 *  publica, sem afirmar que todas estão no mapa. */
function textoDasSeriesDeReservatorio(indice: IndiceDoAtlas): string {
  const r = indice.camadas.reservatorios as unknown as { comSerieNoMapa?: number };
  const series = indice.series.earReservatorios.reservatorios;
  if (r.comSerieNoMapa == null) return `O ONS publica série própria de ${inteiro(series)} reservatórios.`;
  const fora = series - r.comSerieNoMapa;
  return `${inteiro(r.comSerieNoMapa)} reservatórios do mapa têm série própria${fora > 0 ? `; outras ${inteiro(fora)} séries do ONS não têm reservatório com coordenada no cadastro` : ''}.`;
}

export function PainelFontes({ indice, aoVoltar }: { indice: IndiceDoAtlas | null; aoVoltar: () => void }) {
  if (!indice) return <p className="atl-carregando">Carregando o registro de fontes…</p>;
  const c = indice.camadas;
  const s = indice.series;
  const comb = (indice as IndiceDoAtlasComCombustivel).combustivel ?? null;
  const distBloco = (indice as IndiceDoAtlasComDistribuicao).distribuicao;
  const dist = distBloco && !distBloco.ausente ? distBloco : null;
  return (
    <div className="atl-procedencia">
      <button type="button" className="atl-voltar" onClick={aoVoltar}>
        <span aria-hidden="true">←</span> Voltar ao capítulo
      </button>

      <Bloco
        titulo="Usinas"
        resumo={`${inteiro(c.usinas.total)} empreendimentos no cadastro, base de ${dataBr(c.usinas.dataBase)}; ${inteiro(c.usinas.noMapa)} no mapa.`}
        nota={c.usinas.nota}
        fontes={c.usinas.fontes}
        ausencias={[
          `${inteiro(c.usinas.semCoordenadaNaFonte)} usinas não têm coordenada na fonte e ficam fora do mapa.`,
          `${inteiro(c.usinas.noMapa - c.usinas.vinculadasAoOns)} usinas do mapa não aparecem na base de capacidade do ONS: a ficha delas não traz modalidade de operação nem subsistema.`,
          `${inteiro(c.usinas.emOperacaoSemDataNaFonte)} usinas em operação não têm data de entrada no cadastro.`,
          `Em ${inteiro(c.usinas.posicaoIncoerenteComOEstado)} usinas a coordenada do cadastro cai em outro submercado que não o do estado declarado. O mapa as desenha onde o cadastro diz e avisa na ficha.`,
        ]}
      />
      <Bloco
        titulo="Linhas de transmissão"
        resumo={`${inteiro(c.linhas.alternada)} linhas de corrente alternada e ${inteiro(c.linhas.continua)} circuitos de corrente contínua, em ${inteiro(c.linhas.trechos)} trechos desenhados; ${inteiro(c.linhas.previstas)} ainda sem data de entrada em operação.`}
        nota={c.linhas.nota}
        fontes={c.linhas.fontes}
        ausencias={[`${inteiro(c.linhas.previstasComPrevisaoVencida)} das linhas sem data de entrada têm previsão registrada para um ano que já passou: o cadastro não diz se já operam.`]}
      />
      <Bloco
        titulo="Subestações"
        resumo={`${inteiro(c.subestacoes.total)} subestações: ${inteiro(c.subestacoes.doMapaSindat)} do mapa do SINDAT e ${inteiro(c.subestacoes.soNoCadastro)} só do cadastro.`}
        nota={c.subestacoes.nota}
        fontes={c.subestacoes.fontes}
        ausencias={[
          `${inteiro(c.subestacoes.total - c.subestacoes.comTensao)} subestações não têm tensão no cadastro.`,
          `${inteiro(c.subestacoes.foraPorFaltaDeNome)} pontos do SINDAT sem nome nem identificador e ${inteiro(c.subestacoes.foraPorFaltaDeCoordenada)} linhas do cadastro sem coordenada ficam fora do mapa.`,
          `Em ${inteiro(c.subestacoes.posicaoDivergenteEntreAsDuasBases)} subestações as duas bases do ONS divergem em mais de 0,05° na posição; o mapa usa a do SINDAT.`,
        ]}
      />
      <Bloco
        titulo="Reservatórios e bacias"
        resumo={`${inteiro(c.reservatorios.noMapa)} reservatórios, ${inteiro(c.reservatorios.comRegularizacao)} com volume útil; ${inteiro(c.bacias.total)} bacias.`}
        nota={c.bacias.nota}
        fontes={[...c.reservatorios.fontes, ...c.bacias.fontes]}
      />
      <Bloco
        titulo="Séries: água, trocas e um dia"
        resumo={`Energia armazenada e intercâmbio de ${s.ear.de.slice(0, 4)} a ${dataBr(s.ear.ultimoDia)}; perfil horário dos doze últimos meses completos. ${textoDasSeriesDeReservatorio(indice)}`}
        fontes={[...s.ear.fontes, ...s.earReservatorios.fontes, ...s.intercambio.fontes, ...s.balanco.fontes]}
      />
      {comb ? (
        <FontesDaAnp comb={comb} />
      ) : (
        <p className="atl-nota atl-ausencia" role="status">
          O índice deste ambiente ainda não traz as camadas de gás e petróleo da ANP.
        </p>
      )}
      {dist && (
        <Bloco
          titulo="Áreas de atuação das distribuidoras"
          resumo={`${inteiro(dist.concessionarias)} concessionárias e ${inteiro(dist.permissionarias)} permissionárias, uma área por distribuidora, da BDGD de data-base mais recente de cada uma (${Object.entries(dist.porDataBase)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([d, n]) => `${inteiro(n)} em ${dataBr(d)}`)
            .join(', ')}).`}
          nota={dist.nota}
          fontes={[dist.fonte]}
          ausencias={[
            ...dist.ausencias,
            dist.fora.nota,
            // a lista das fusões saiu do "Como ler" da seção (achado: interface explicando a si mesma)
            ...(dist.fora.sucedidas.length ? [`Sucedidas por fusão, sem área própria: ${dist.fora.sucedidas.map((s) => `${s.nome} (hoje ${s.sucessora})`).join('; ')}.`] : []),
          ]}
        />
      )}
      <section className="atl-grupo">
        <header className="atl-grupo-cabeca">
          <h2 className="atl-grupo-titulo">Submercados, mundo e base do mapa</h2>
        </header>
        <ul className="atl-ausencias atl-lista-simples">
          <li>
            Submercados: arquivo próprio do Atlas, construído da malha por estado do IBGE (a mesma do Portal Brasil), juntando os estados de cada submercado. Roraima entrou no Norte em setembro de 2025, pela linha de 500 kV Manaus – Boa Vista (entrada em operação em 16/09/2025 no cadastro do ONS). Os números do Norte incluem Roraima desde então, sem separar o estado.
          </li>
          <li>Mundo: perfil energético por país do Our World in Data, com a fonte citada campo a campo no perfil; fronteiras da Natural Earth 1:110m.</li>
          <li>Base cartográfica (relevo, rios, cidades, divisas e foto de satélite): Mapbox e colaboradores do OpenStreetMap.</li>
        </ul>
      </section>
      <section className="atl-grupo">
        <header className="atl-grupo-cabeca">
          <h2 className="atl-grupo-titulo">O que o Atlas ainda não tem</h2>
        </header>
        <ul className="atl-ausencias atl-lista-simples">
          <li>Oleodutos, gasodutos de escoamento da produção e redes de distribuição de gás: a ANP não publica essas camadas.</li>
          {!dist && <li>Áreas de concessão das distribuidoras.</li>}
          <li>Geração distribuída (os sistemas de telhado): o cadastro usado é o de usinas outorgadas ou registradas.</li>
          <li>O traçado exato de cada linha: o do ONS é generalizado e serve para a escala do país e do estado, não da rua.</li>
        </ul>
      </section>
    </div>
  );
}
