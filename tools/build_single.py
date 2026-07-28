#!/usr/bin/env python3
"""
Gera a versão de ARQUIVO ÚNICO da demonstração, uma por idioma, a partir das
mesmas fontes que o site usa: nada é escrito duas vezes.

O .wasm entra como data: URL, então o mesmo demo.js que busca o arquivo no site
busca os bytes embutidos aqui, sem uma linha diferente. O resultado abre por
file://, sem servidor e sem internet.

Smart2Raw - Copyright (C) 2026 Carlos Alberto Terêncio de Bastos
SPDX-License-Identifier: AGPL-3.0-or-later
"""
import os, base64

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

HEAD = {
 "en": dict(lang="en", title="Smart2Raw live — classify your own column",
   desc="The Smart2Raw library compiled to WebAssembly: paste a column of integers and see the "
        "classification, the size and the query time measured in your own browser.",
   note="This page is a single file: the <code>.wasm</code> is embedded in it. Save it, e-mail it, "
        "open it with no internet — the result is the same, because the computation is local.",
   concept="Concept DOI (all versions)", ver="DOI for this version"),
 "pt": dict(lang="pt-BR", title="Smart2Raw ao vivo — classifique sua própria coluna",
   desc="A biblioteca Smart2Raw compilada para WebAssembly: cole uma coluna de inteiros e veja a "
        "classificação, o tamanho e o tempo de consulta medidos no seu navegador.",
   note="Esta página é um arquivo só: o <code>.wasm</code> vai embutido nela. Salve, mande por "
        "e-mail, abra sem internet — o resultado é o mesmo, porque o cálculo é local.",
   concept="DOI do projeto (todas as versões)", ver="DOI desta versão"),
}

PAGE = """<!DOCTYPE html>
<html lang="%(lang)s">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>%(title)s</title>
<meta name="description" content="%(desc)s">
<style>%(css)s
main{padding-top:26px}</style>
</head>
<body>
<main>
%(demo)s
<footer class="foot" style="margin-top:40px">
  <div class="fbot" style="border:0">
    Smart2Raw — Copyright © 2026 Carlos Alberto Terêncio de Bastos ·
    AGPL-3.0-or-later ·
    %(ver)s <a href="https://doi.org/10.5281/zenodo.21623772">10.5281/zenodo.21623772</a> ·
    %(concept)s <a href="https://doi.org/10.5281/zenodo.20477234">10.5281/zenodo.20477234</a><br>
    %(note)s
  </div>
</footer>
</main>
<script>%(js)s</script>
</body>
</html>
"""

def build():
    css = open(os.path.join(ROOT, "assets", "site.css"), encoding="utf-8").read()
    js  = open(os.path.join(ROOT, "assets", "demo.js"),  encoding="utf-8").read()
    demo_tpl = open(os.path.join(ROOT, "templates", "demo.html"), encoding="utf-8").read()
    wasm = open(os.path.join(ROOT, "assets", "s2r.wasm"), "rb").read()
    data_url = "data:application/wasm;base64," + base64.b64encode(wasm).decode()

    out = []
    for lang, h in HEAD.items():
        demo = (demo_tpl
                .replace('data-wasm="{{ROOT}}assets/s2r.wasm"', 'data-wasm="%s"' % data_url)
                .replace('data-single="{{ROOT}}assets/smart2raw-live-{{LANG}}.html"', '')
                .replace("{{ROOT}}", "").replace("{{LANG}}", lang))
        html = PAGE % dict(h, css=css, js=js, demo=demo)
        p = os.path.join(ROOT, "assets", "smart2raw-live-%s.html" % lang)
        open(p, "w", encoding="utf-8").write(html)
        out.append((p, len(html)))
    return out

if __name__ == "__main__":
    for p, n in build():
        print("  %-52s %6.1f KB" % (os.path.relpath(p, ROOT), n/1024))
