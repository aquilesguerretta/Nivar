Trilho fino, alça quadrada, preenchimento na cor de acento do contexto.

```jsx
<Slider id="s1" label="Teto de PLD" min={0} max={600} step={10} defaultValue={280} unidade="R$/MWh" />
<Slider id="s2" label="Carga mínima" min={0} max={100} defaultValue={62} unidade="%" leitura />
```

- **Sem sombra na alça.** Fio de 1px e preenchimento do substrato. Sombra é proibida em todo o sistema, e um deslizante não é a exceção.
- Trilho com raio zero. Alça quadrada.
- A leitura em mono tabular fica ligada por padrão. Desligar só onde o valor aparece em outro lugar da mesma linha de visão.
- Para faixa de dois extremos (mínimo e máximo), use dois `NumberInput` lado a lado em `FilterBar`: um deslizante de duas alças esconde qual delas está ativa.
- Cor: defina `--acento-contexto` no ancestral para o deslizante herdar a família da tela.
