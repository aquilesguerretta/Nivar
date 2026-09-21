Série temporal — PLD, carga, geração ao longo do tempo.

```jsx
<TimeSeriesChart titulo="PLD horário · SE/CO" unidade="R$/MWh" serie={serie} width={640} height={200} />
```

- **A linha tem uma cor só, do começo ao fim.** Mudar de cor conforme sobe ou desce vira ruído numa série longa. `--serie-linha` resolve para tinta no claro e intelligence no noturno.
- A direção de mercado aparece só em indicador discreto: marcador do ponto final e delta no cabeçalho, em hardware (alta) ou software (baixa).
- Eixo em JetBrains Mono. **Sem grade decorativa** — os fios de referência existem para ler magnitude, não para enfeitar; reduza `ticksY` antes de aumentar.
- Sempre acompanhe de `<Provenance>`.
