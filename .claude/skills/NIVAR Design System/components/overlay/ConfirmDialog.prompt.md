Confirmação de ação crítica. Painel sólido ancorado.

```jsx
<ConfirmDialog
  titulo="Exportar série completa"
  texto="A exportação inclui todas as linhas do recorte em vigor, com a procedência de cada valor."
  detalhes={[{k:'Linhas',v:'28 934'},{k:'Recorte',v:'2026-01-01 → 2026-08-04'},{k:'Formato',v:'CSV · UTF-8'}]}
  critico
  acoes={<><Button variant="terciario">Cancelar</Button><Button variant="primario">Exportar</Button></>} />
```

- **Fio de 1px, raio zero, sem sombra.** Cartão flutuante arredondado com sombra difusa é exatamente o registro que o sistema rejeita.
- `detalhes` existe para dizer o que exatamente vai acontecer, com número. Uma confirmação sem número é uma pergunta retórica.
- `critico` acende o fio advisory de 2px no topo — reserve para o que não se desfaz.
