Botão de ação — use `primario` para a ação da casa (uma por tela), `secundario` para ação lateral, `terciario` para ação em linha de texto ou de tabela.

```jsx
<Button variant="primario">Abrir nota técnica</Button>
<Button variant="secundario" glifo="↓">Exportar série</Button>
<Button variant="terciario">Ver metodologia</Button>
<Button variant="secundario" size="compacto" disabled>Indisponível</Button>
```

- `variant`: `primario` (preenchimento brasa nos dois modos; no noturno ganha fio hardware para separar da tinta) · `secundario` (só fio) · `terciario` (texto com fio inferior, sem container).
- Hover sobe um passo na escala e press desce um passo a partir do hover: claro repouso tinta → hover academy → press brasa; noturno repouso papel → hover advisory → press software. Nunca elevação, nunca escala, nunca troca de fundo.
- Foco: anel advisory 2px, offset 2px. Desabilitado: opacidade 0.4, sem troca de cor.
- `state` força um estado visualmente — é só para especimen e documentação, não use em produto.
