Cabeçalho clicável com marcador de direção em mono.

```jsx
<thead>
  <tr>
    <SortHeader campo="sub" ordem="neutro" onSort={ordenar}>Submercado</SortHeader>
    <SortHeader campo="pld" ordem="desc" numerico onSort={ordenar}>R$/MWh</SortHeader>
    <SortHeader campo="delta" ordem="neutro" numerico onSort={ordenar}>Δ mês</SortHeader>
  </tr>
</thead>
```

- Usa `↕ ↑ ↓` em mono. Não trocar por ícone: a decisão de biblioteca de ícone ainda não foi tomada no sistema.
- Uma coluna ordenada por vez. Duas setas ativas ao mesmo tempo dizem que a ordenação é composta, e a tabela não mostra a precedência.
- `numerico` nas colunas de número, sempre — o marcador então fica à esquerda do rótulo, para o rótulo continuar encostado na borda direita e manter o eixo da coluna.
- Abaixo de 640px o cabeçalho ganha 44px de altura pelo padding da célula e a primeira coluna continua fixa.
