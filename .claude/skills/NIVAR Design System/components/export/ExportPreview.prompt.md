Prévia do PDF, com os dois tratamentos de marca.

```jsx
const [t, setT] = React.useState('mono');
<ExportPreview
  par
  tratamento={t}
  onTratamento={setT}
  titulo="PLD médio por submercado"
  subtitulo="Série horária consolidada em média mensal"
  fontes={['ONS', 'CCEE']}
  recorte="mensal"
  timestamp="2026-08-04 · 14:30 BRT"
  colunas={['Submercado', 'R$/MWh', 'Δ mês']}
  linhas={[['Sudeste/CO', '214,80', '+4,2 %'], ['Sul', '268,40', '+9,1 %']]}
  paginas={4}
  onGerar={gerar}
/>
```

- **A folha não tem modo noturno.** Papel impresso é papel. O painel ao redor segue o tema; a folha redeclara os aliases claros e ignora `data-mode`.
- **O gradiente não vai para a impressora monocromática.** Use `mono` como padrão em exportação de relatório de escritório; `cor` para leitura em tela e para gráfica.
- O fio de 4px no topo da folha é o único lugar, além do traço da marca, onde o gradiente de incandescência é permitido. Na versão mono ele também vira tinta sólida.
- Procedência e recorte temporal viajam com o documento. Um PDF exportado sem fonte não é exportação, é print.
- `Folha` isolada serve para prévia de nota técnica e de parecer, com `colunas` vazio.
