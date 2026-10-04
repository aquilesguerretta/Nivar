Marca a região como amostra. Sem carimbo, sem opacidade.

```jsx
<SampleSeal>
  <DataCardGrid>…</DataCardGrid>
</SampleSeal>

<SampleSeal variant="diagonal" rotulo="rascunho">
  <TimeSeriesChart … />
</SampleSeal>
```

- **Nunca vermelho, nunca rotação sobre o conteúdo, nunca opacidade no bloco inteiro.** Amostra ilustrativa é declaração de origem, não aviso de invalidez.
- O selo acompanha a copy, não substitui: `Provenance ilustrativa` e `DataFreshness estado="ilustrativa"` continuam presentes. O selo é o reforço visual de uma frase que já existe.
- `diagonal` para gráfico e card grande, onde o canto sozinho passa batido. `canto` para tabela e região densa, onde a trama competiria com o fio da grade.
- Um selo por região. Dois selos na mesma tela param de significar.
