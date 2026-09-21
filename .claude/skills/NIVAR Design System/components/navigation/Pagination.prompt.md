Paginação de tabela. Sempre acompanha `DataTable` — a faixa de linhas é parte da leitura do dado, não enfeite.

```jsx
<Pagination pagina={1} porPagina={25} total={28934} onChange={setPagina} />
```

Renderiza `1–25 de 28 934 linhas` com espaço fino no milhar. Controles são texto com fio: `anterior`, números com elipse, `próxima`. Desabilitado é opacidade 0.4.
