Toggle textual de altura de linha. Só padding muda.

```jsx
<DensityToggle target="#tabela-pld" onChange={setDens} />

<div id="tabela-pld" data-densidade="compacto">
  <table className="nv-tab nv-tab--zebra">…</table>
</div>
```

- **Nunca muda fonte nem cor.** Se a densidade mexer no corpo do texto, a tabela passa a ter duas tipografias e o alinhamento tabular deixa de ser comparável entre telas.
- `compacto` é o padrão. `confortável` é a exceção para leitura longa, não o contrário: o sistema tem alvo de 40 a 60 elementos por tela.
- Fica na mesma linha da `Pagination` ou do cabeçalho da tabela, à direita. Não é um item de `FilterBar` — não filtra nada.
- Abaixo de 640px o toggle continua texto e ganha 44px de toque; a densidade móvel já é fixada pelo tratamento móvel e o alternador vira preferência, não necessidade.
