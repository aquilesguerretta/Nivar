Primeiro elemento navegável da página. Aparece no foco.

```jsx
<body>
  <SkipLink href="#conteudo" />
  <header>…</header>
  <main id="conteudo" tabIndex={-1}>…</main>
</body>
```

- **Primeiro no DOM, sem exceção.** Depois do wordmark ou da nav, o link não serve para nada.
- O destino precisa existir e receber `tabindex="-1"`, senão o foco não vai para lá.
- `visivel` só em especimen. Em produção ele aparece com `:focus-visible` e desaparece ao sair.
- Um por página. Em documento longo com várias seções, o lugar de navegar é `Breadcrumb` e `SectionHeader`, não mais links de pulo.
