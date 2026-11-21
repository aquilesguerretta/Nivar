Etiqueta de procedência — acompanha todo dado exibido. Fonte e recorte temporal não são rodapé legal, são a tese da empresa em copy.

```jsx
<Provenance
  fontes={['ONS', 'CCEE', 'ANEEL', 'EPE']}
  recorte="apuração mensal"
  timestamp="2026-08-04 · 14:30 BRT"
  ilustrativa
/>
```

- `ilustrativa` marca o dado como amostra, em advisory. Use em todo especimen, mock e demo.
- `fio={false}` remove o fio superior quando o componente já segue um fio existente.
