Recorte temporal denso, em mono, sobre o gráfico.

```jsx
const [per, setPer] = React.useState('1m');
<div className="nv-graf-cab">
  <span className="nv-graf-cab__t">PLD horário · SE/CO</span>
  <PeriodSegment value={per} onChange={setPer} />
</div>
<TimeSeriesChart serie={serie} … />
```

- **Nunca fundo preenchido no ativo.** Fio de 2px na cor de acento do contexto e texto em `--text-strong`. Sem pílula, sem cápsula deslizante — posição de layout não anima neste sistema.
- Não substitui `Tabs`: aba troca de vista, isto troca o recorte da mesma série.
- Recorte sem dado entra em `desabilitados`, não desaparece. A ausência de `1D` num histórico mensal é informação.
- Fica no cabeçalho do gráfico, à direita do título. Abaixo de 640px desce para a linha seguinte com 44px de toque.
