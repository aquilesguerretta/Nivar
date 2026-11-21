Caixa de seleção quadrada, preenchimento na cor de acento do contexto.

```jsx
<Checkbox id="c1" label="Sudeste/Centro-Oeste" defaultChecked />
<Checkbox id="c2" label="Sul" nota="sem apuração no período" />
<Checkbox id="c3" label="Todos os submercados" indeterminado />
<Checkbox id="c4" label="Norte" disabled />
```

- **A cor do preenchimento vem do contexto, não do componente.** Defina `--acento-contexto` no ancestral (`style={{'--acento-contexto':'var(--family-software)'}}`) e a caixa acompanha. Sem definição, usa `--accent-house`.
- O glifo é `×` em mono. Não trocar por "check": não existe biblioteca de ícone no sistema.
- Raio zero. O círculo é do `Radio`, e é a única exceção.
- Alvo de toque de 44px abaixo de 640px vem do padding do rótulo — não aumentar o quadrado.
