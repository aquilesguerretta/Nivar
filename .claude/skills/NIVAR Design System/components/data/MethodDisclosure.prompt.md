Disclosure de metodologia ancorado na procedência. Inline, nunca modal.

```jsx
<MethodDisclosure
  fio
  metodo="Média aritmética do PLD horário do submercado, ponderada por hora do dia."
  fonte="CCEE · PLD horário · série SE/CO"
  metodoPublicadoEm="2025-11-12"
  dadoColetadoEm="2026-08-04 · 14:30 BRT"
  premissas={['Horário de verão não aplicado desde 2019.', 'Feriado móvel tratado como dia útil.']}
  href="/metodologia/pld-medio"
>
  <Provenance fontes={['CCEE']} recorte="apuração horária" fio={false} />
</MethodDisclosure>
```

- **A ordem das linhas é do componente, não do chamador.** Método publicado em vem antes de dado coletado em. Inverter a ordem desmonta o argumento.
- Gatilho é texto com fio inferior. Não trocar por botão, não acrescentar `?` nem ícone circular.
- A abertura não anima altura: o fio de 1px se desenha em 700ms (`stroke-dashoffset`) e o corpo entra em opacidade. Layout não se move animado em nenhum lugar do sistema.
- Uma linha por dado. Se o método não cabe em uma frase, o lugar dele é a página pública de metodologia — o link existe para isso.
- Para o estado de frescor do mesmo número use `DataFreshness`, que é informação de coleta, não de método.
