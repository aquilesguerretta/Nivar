# Peça A · Rodada 2 — lacuna a corrigir (direção do Founder: imagem primeiro)

Resultado da rodada 1 (Brief, System e Craft, contexto limpo): **FAIL** nos três.
O brief-base continua valendo ([`piece-A.md`](piece-A.md)).

## Diretriz do Founder (2026-09-16, sobre a carta da r01)

> "Isso aqui não é um design final… negócio horrível. Você tem Blender, Higgsfield — use ao máximo. Não use SVG quando
> imagens e Blender resolvem."

**Regra desta rodada:**
- A presença da Alexandria vem de **imagem de verdade**: render 3D no Blender (geometria, luz, material, profundidade)
  e imagem gerada no Higgsfield (gravura, atmosfera, papel, objeto).
- **SVG/HTML só onde precisa ser dado exato e acessível:**
  - marca de posição, rótulos, códigos de módulo, legenda e fonte, sobrepostos à imagem;
  - ícones e glifos de interface.
- **Proibido** ilustrar o objeto-mundo, o relevo, a gravura ou a textura com SVG desenhado à mão.
- O visual da carta da r01 (painel navy de SVG) **sai**.

## A maior lacuna — presença do objeto-mundo (Craft)

A carta da r01 fazia o trabalho certo (territórios, posição, legenda, fonte), mas **não tinha presença**:
- era um retângulo navy encaixado sobre pergaminho liso;
- tinha uma faixa morta embaixo;
- não tinha atmosfera nem escala.

Na comparação cega, perdeu para o Atlas atual exatamente nesse ponto.

**O que precisa acontecer:**
- A Home precisa **ser** um mundo, com presença de atlas **igual ou maior** que o North Star (o Titã sustentando o
  globo) e **sem copiar** a composição.
- O objeto-mundo mantém a função: os **três territórios**, a **posição real do learner** (que bate com a retomada),
  legenda e fonte.

## Ferramentas

### Blender
- Blender 5.2.1, headless, pelo Bash:
  `"/c/Program Files/Blender Foundation/Blender 5.2/blender.exe" -b --factory-startup -P script.py -- <args>`.
- Cycles com OptiX na RTX 4070 (depois do `read_factory_settings`, reconfigure
  `preferences.addons['cycles'].preferences` para OPTIX e ligue os devices).
- Scripts e `.blend` ficam em `docs/alexandria-v2/media-lab/`.
- **Para alinhar o dado:** exporte as coordenadas de tela de cada estação e território com
  `bpy_extras.object_utils.world_to_camera_view`, em JSON por enquadramento. O overlay HTML/SVG usa esse JSON.
- Renderize **enquadramentos próprios** para desktop e para mobile (retrato), não um recorte espremido.

### Higgsfield
- Ferramentas desta sessão: `models_explore`, `generate_image`, `generate_image_batch`, `jobs_wait`, `media_upload`.
  Procure-as via ToolSearch.
- **Antes de gerar:** consulte o catálogo atual e escolha o melhor modelo para cada artefato, justificando:
  - edição fiel a partir de referência (ex.: estilizar um render do Blender como gravura sem mover a geometria);
  - ausência de texto;
  - resolução;
  - fotorrealismo × gravura.
- **Itere sem cota:** gere variantes, ponha na composição real, compare e rejeite o que não melhora.
- **Candidatos:**
  - gravura atmosférica;
  - textura de papel real (materialidade no lugar da `feTurbulence` que tinha bug de raster);
  - estilização do render;
  - elementos de expedição.

### Regras de mídia (§7, obrigatórias)
- Nunca texto dentro da imagem gerada.
- Nunca instalação real identificável.
- Atmosfera nunca cobre dado, rótulo ou posição.
- **Classes:**
  - render 3D com geometria que codifica o currículo = **Explicação** (programmatic-visualization);
  - gravura ou textura = **Atmosfera**.
- **Arquivos aceitos:**
  - vão para `public/alexandria/v2/…` com nome estável;
  - são otimizados para web (WebP/AVIF em tamanhos adequados; `srcset` para 390, 768, 1440, 1920);
  - entram em `docs/alexandria-v2/media-provenance.md` com todas as colunas preenchidas.
- **Rejeitadas:** não vão para `public/`.

## Higiene de gate (obrigatória nesta rodada)

1. **Linguagem interna.** Nada de "TRABALHO: ORIENTAR", "Trabalho: localizar" ou "Classe: explicação (…)" na
   interface.
   - A classe continua no `data-media-class`.
   - Para o learner, a declaração é honesta e humana (ex.: "Modelo do currículo, não é mapa geográfico";
     "Fonte: Natural Earth 1:110m").
2. **Título do documento.** Em `/alexandria/*`, o `document.title` vem do shell da Alexandria, com a localização
   atual, e o título anterior é restaurado ao sair. Nunca "NIVAR — …".
3. **Localizador a 390.** O item atual aparece inteiro, e só os itens intermediários podem ser abreviados.
4. **Seletor.** A ação principal da Home tem `data-capture="cta-primario"`.
5. **Detalhes da r01:**
   - o marcador não cobre o código do módulo;
   - a chamada "você está aqui" fica perto do nó;
   - nada vaza do contêiner a 390;
   - o foco não encosta no texto;
   - a conta a 390 tem alvo ≥ 44px e rótulo acessível.

## Verificação

`npx tsc -b` sem erro, `gridalpha-detect` com 0 P0 e a captura abaixo. **Abra e olhe os PNGs** antes de devolver.

```
node tools/alexandria-capture/capture.mjs --plan docs/alexandria-v2/captures/A/plans/piece-A.json --out docs/alexandria-v2/captures/A/r02
```

Na `legend.json`, confira:
- `horizontalOverflow` = false;
- `minFontPx` ≥ 11 na Home;
- `overflowingElements` vazio a 390;
- `frames[].url` do `cta-*-click` apontando para a aula;
- `media` com a classe de cada imagem.
