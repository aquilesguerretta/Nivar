Comparação entre submercados ou fontes de geração.

```jsx
<BarChart titulo="PLD médio por submercado" unidade="R$/MWh" casas={0}
  data={[
    { label:'SE/CO', value:214.8, cor:'alta' },
    { label:'Sul', value:198.11, cor:'baixa' },
    { label:'NE', value:96.04, cor:'neutro' },
    { label:'N', value:1021.5, cor:'atencao' },
  ]} />
```

- **Barras retas, topo reto.** Nunca arredondado.
- `cor` aceita nome de família (`'intelligence'`), nome de direção (`'alta'`, `'baixa'`, `'atencao'`, `'neutro'`) ou cor CSS. Use família quando as barras são produtos, direção quando são o mesmo indicador comparado.
- Sem `cor`, a barra usa `--serie-linha` — a mesma cor da série temporal, para os dois gráficos lerem como um par.
