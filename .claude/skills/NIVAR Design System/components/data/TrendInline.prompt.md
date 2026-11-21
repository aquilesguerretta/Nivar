Tendência inline para tabela e lista.

```jsx
<TrendInline delta={4.2} base="vs. jul" />
<TrendInline delta={-11.8} tamanho="compacto" />
<TrendInline valor={38.4} unidade="R$/MWh" delta={1} />
<TrendInline delta={0} />
<TrendInline delta={62.1} direcao="atencao" base="fora de faixa" />
```

- Dentro de `DataTable`, na célula `nv-num`, ele herda o alinhamento à direita e mantém o eixo da vírgula: o número continua em mono tabular.
- Em série longa o indicador é o único lugar onde a direção aparece — a linha do `TimeSeriesChart` mantém uma cor só do começo ao fim.
- `tamanho="compacto"` para tabela de 40+ linhas; o padrão serve para lista e frase.
- Não usar em título nem em número grande: acima de 17px o lugar é o `DataCard`, que tem espaço para unidade e procedência.
