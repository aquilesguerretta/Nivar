Espera longa e de primeira carga — o N da casa colapsa num núcleo denso e reabre, em loop de 3.4s.

```jsx
<BrandLoader size={64} legenda="Lendo CCEE · ciclo 2026-08" />
<BrandLoader size={40} />
```

- **Geometria estática.** A marca é o path de produção do N; a animação é exclusivamente `transform` (scale + rotate). Nunca anime `d`.
- `vector-effect="non-scaling-stroke"` é o que faz a forma funcionar: os 11px de traço não acompanham o scale, então no colapso as pernas se fundem num núcleo cheio em vez de virar um N minúsculo e fino.
- O traço usa o gradiente de incandescência da casa. Não recolorir, não trocar por `currentColor`.
- Para espera curta dentro de uma tela já carregada use `Skeleton`, não este.
