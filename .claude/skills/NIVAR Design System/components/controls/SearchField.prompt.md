Busca sem container, resultado em lista de fio compartilhado.

```jsx
const [q, setQ] = React.useState('');
<SearchField
  rotulo="Busca"
  valor={q}
  onChange={setQ}
  total={8}
  resultados={[
    { id: '1', titulo: 'PLD horário — Sudeste/Centro-Oeste', meta: 'SÉRIE · CCEE' },
    { id: '2', titulo: 'Migração ao mercado livre: o custo do aviso prévio', meta: 'NOTA TÉCNICA · 2026-07-22' },
  ]}
  onEscolher={(r) => abrir(r)}
/>
```

- **Sem lupa e sem caixa.** O fio inferior é o campo. Ícone de lupa exigiria escolher biblioteca de ícone, e essa decisão não foi tomada.
- Em foco o fio vai a 2px em advisory e o padding compensa 1px, para o texto não se mover.
- `ancorado={false}` quando a busca é a página (resultado no fluxo); `true` — o padrão — quando ela vive num cabeçalho ou filtro e a lista precisa sobrepor.
- O trecho casado ganha peso 500. Nunca fundo de realce: o sistema não usa cor de fundo como sinal.
- A contagem de resultados fica em mono no topo da lista. Ela é densidade útil, não enfeite: diz se vale ler.
