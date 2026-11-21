Especimen de movimento — dez peças, dirigidas por JS.

`_ds/` é cópia congelada do design system, exigida pelos `href` relativos do
HTML (doze `<link>` mais o `_ds_bundle.js`). NÃO é removível: apague e o
especimen renderiza sem estilo. NÃO é fonte de verdade.

Fonte de verdade: `.claude/skills/NIVAR Design System/`.

## Estado da cópia em 2026-08-07

Verificado por hash MD5 nesta data, não presumido:

| arquivo | estado |
| --- | --- |
| `tokens/colors.css` | idêntico |
| `readme.md` | idêntico |
| `tokens/motion.css` | **diverge** |
| `components/forms/field.css` | **diverge** |

As duas divergências são conhecidas e datam desta mesma wave: a fonte de
verdade recebeu `--ease-loop:linear` e a troca de `var(--ease)` por
`var(--ease-loop)` em `nv-verifica`, que corrige a emenda dupla do loop de
validação assíncrona. A cópia congelada não recebeu a correção.

Consequência prática: o especimen continua renderizando, e a peça de
validação assíncrona nele ainda mostra o comportamento antigo. Quem
regenerar o especimen herda a correção automaticamente; quem só olhar o
`_ds/` está olhando o estado anterior à wave.

Esta tabela existe para que a divergência seja **detectável em vez de
silenciosa**. Se o especimen for regenerado, refaça a comparação e atualize
a data acima em vez de apagar a seção.
