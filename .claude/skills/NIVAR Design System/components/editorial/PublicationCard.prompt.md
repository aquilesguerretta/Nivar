Lista de publicações com fio compartilhado.

```jsx
<PublicationList>
  <PublicationCard
    familia="intelligence"
    tipo="Nota técnica"
    titulo="O PLD de julho e a distância entre curva projetada e apuração"
    resumo="A projeção de junho errou por 18% no Sudeste; o motivo está na afluência, não na carga."
    data="2026-08-04"
    leitura="6 min"
  />
  <PublicationCard familia="advisory" tipo="Parecer" titulo="…" data="2026-07-29" leitura="11 min" />
</PublicationList>
```

- **Sem borda própria.** O fio é da lista, não do item. Nunca envolver em `DataCard`.
- O resumo tem uma linha. Se não cabe em uma linha, o texto ainda não está resolvido.
- `tipo` e data ficam em mono à direita; o título em Zilla Slab é o único elemento display do item.
- Abaixo de 640px as três colunas empilham na ordem família → título → resumo → meta, e o alvo de toque do título chega a 44px pelo padding do item.
