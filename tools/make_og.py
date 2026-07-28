#!/usr/bin/env python3
"""
Gera as imagens de compartilhamento (1200x630) a partir de tools/og_card.html.

    python3 tools/make_og.py

Precisa de playwright + chromium, e roda FORA do build do site: o resultado
(assets/og.png e assets/og-pt.png) é versionado, para que publicar o site
continue exigindo apenas python3.

Smart2Raw - Copyright (C) 2026 Carlos Alberto Terêncio de Bastos
SPDX-License-Identifier: AGPL-3.0-or-later
"""
import os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CARD = os.path.join(ROOT, "tools", "og_card.html")

TEXT = {
 "og.png": None,   # o próprio HTML já está em inglês
 "og-pt.png": dict(
    slogan="A inteligência está na classificação. O que sai é byte puro.",
    head="O servidor que você não precisa comprar.",
    sub=("Uma coluna de inteiros guardada na menor classe nativa que a amplitude real exige "
         "— até 8× menos bytes, e nenhum passo de decodificação, porque os bytes guardados "
         "<i>são</i> inteiros nativos."),
    foot="<b>smart2raw.com</b> &nbsp;·&nbsp; um header em C11, zero dependências"),
}

def main():
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("playwright não está instalado; as imagens versionadas continuam valendo.")
        return 1
    with sync_playwright() as p:
        b = p.chromium.launch()
        for name, tr in TEXT.items():
            pg = b.new_page(viewport={"width": 1200, "height": 630}, device_scale_factor=1)
            pg.goto("file://" + CARD)
            if tr:
                pg.evaluate("""(t)=>{
                    document.documentElement.lang='pt-BR';
                    document.getElementById('slogan').textContent=t.slogan;
                    document.getElementById('head').textContent=t.head;
                    document.getElementById('sub').innerHTML=t.sub;
                    document.querySelector('.foot span').innerHTML=t.foot;
                }""", tr)
            pg.wait_for_timeout(250)
            out = os.path.join(ROOT, "assets", name)
            pg.screenshot(path=out)
            print("  %-14s %6.1f KB" % (name, os.path.getsize(out)/1024))
            pg.close()
        b.close()
    return 0

if __name__ == "__main__":
    sys.exit(main())
