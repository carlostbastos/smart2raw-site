# Smart2Raw — site

Site do projeto. Gerado por um script de ~150 linhas em python3, **sem
dependência externa**, pela mesma razão que a biblioteca não tem: quem clonar
isto daqui a cinco anos precisa conseguir reconstruir com o que já tem na
máquina.

```
content/en/*.md   content/pt/*.md    o texto, um arquivo por página e idioma
templates/                           molde da página e da demonstração
assets/                              css, js, wasm, favicon, downloads
site/                                a saída, pronta para publicar
tools/                               o gerador e a verificação
```

## Construir

```sh
python3 tools/build_site.py          # gera site/ e as páginas de arquivo único
python3 tools/build_site.py serve    # ... e serve em http://localhost:8080
node tools/site_test.js              # verificação num navegador de verdade
```

O inglês fica na raiz (`/`), o português em `/pt/`. O menu mostra apenas as
páginas cujo conteúdo existe, então ele cresce sozinho conforme os textos são
escritos.

## A demonstração

A página inicial embute a biblioteca real compilada para WebAssembly
(`assets/s2r.wasm`, construída em `Smart2Raw/web`). O mesmo `assets/demo.js`
serve o site e as versões de arquivo único (`assets/smart2raw-live-en.html` e
`-pt.html`), onde o `.wasm` entra como `data:` URL — por isso elas funcionam
offline, por `file://`, sem servidor.

## O que a verificação confere

Nas duas línguas, num Chromium de verdade: o módulo carrega e reporta a versão
do próprio header; três formas de coluna são classificadas; todos os caminhos de
consulta devolvem o mesmo resultado; o `.s2r` é baixado e o número mágico é lido
de volta; nenhum texto fica sem tradução; `hreflang` presente; console limpo.

---
Smart2Raw — Copyright (C) 2026 Carlos Alberto Terêncio de Bastos
SPDX-License-Identifier: AGPL-3.0-or-later
