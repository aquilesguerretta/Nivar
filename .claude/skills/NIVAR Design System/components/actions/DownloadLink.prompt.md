Nome e extensão em mono, tamanho em secundário, `↓`.

```jsx
<DownloadLink arquivo="pld-horario-julho-2026.csv" formato="CSV" tamanho="284 KB" nota="Fonte: CCEE · apuração horária" />
<DownloadLink arquivo="nota-tecnica-2026-08.pdf" formato="PDF" tamanho="1,2 MB" />
<DownloadLink arquivo="serie-completa.xlsx" formato="XLSX" tamanho="8,4 MB" disabled />
```

- **Não é botão.** Download é navegação para um arquivo que já existe; `Button` primário é para gerar. Em `ExportPreview`, o botão gera e o link baixa.
- A extensão fica em peso 500 dentro do nome, não numa etiqueta separada: ela é parte do nome do arquivo.
- Tamanho sempre que houver. Um CSV de 8 MB e um de 8 KB são decisões diferentes numa conexão ruim.
- `nota` carrega procedência quando o arquivo sai da tela e vira anexo de e-mail — o dado não deve perder a fonte no caminho.
