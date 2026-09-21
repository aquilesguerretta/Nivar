Chips de fio dentro do campo, espaço restante digitável.

```jsx
<MultiSelect
  id="fontes"
  label="Fontes na consulta"
  selecionados={[{ id: 'ons', rotulo: 'ONS' }, { id: 'ccee', rotulo: 'CCEE' }]}
  onRemover={remover}
  valor={q}
  onChange={setQ}
  sugestoes={[{ id: 'aneel', rotulo: 'ANEEL', meta: 'REGULATÓRIO' }, { id: 'epe', rotulo: 'EPE', meta: 'PLANEJAMENTO' }]}
  onEscolher={adicionar}
  hint="Quatro fontes públicas disponíveis."
/>
```

- **Chip é retângulo de fio, raio zero.** Nunca pílula, nunca preenchimento sólido colorido — a mesma regra de `Tag`.
- O `×` de remoção é glifo mono, não ícone. Alvo de 44px no móvel vem de um `::before`, sem engordar o chip.
- O campo continua digitável com chips dentro. Se o espaço restante ficar menor que ~7ch, os chips quebram para a linha seguinte e o campo cresce em altura — nunca rola horizontalmente.
- Para submercado use `SubmarketSelector`. Para uma escolha só, `Select`.
