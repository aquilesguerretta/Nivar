Amostra e rótulo, embaixo do gráfico e atrás de um fio.

```jsx
<TimeSeriesChart serie={serie} … />
<ChartLegend tipo="linha" itens={[
  { rotulo: 'PLD apurado', cor: 'intelligence', valor: '214,80' },
  { rotulo: 'Curva projetada', cor: 'software' },
]} />

<BarChart data={barras} … />
<ChartLegend tipo="barra" itens={[
  { rotulo: 'Acima da média', cor: 'alta' },
  { rotulo: 'Abaixo da média', cor: 'baixa' },
]} />
```

- **Traço para linha, bloco para barra.** A amostra tem a forma da marca que representa.
- Abaixo do gráfico, nunca sobreposta à área de plotagem.
- Uma série só não precisa de legenda: o título do gráfico já diz o que é. A legenda entra a partir de duas marcas.
- Cor por nome de família ou de direção — nunca hex solto no chamador, para a legenda e o gráfico não divergirem.
