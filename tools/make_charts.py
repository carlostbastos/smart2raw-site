#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gera os gráficos do site em SVG, a partir dos números que já estão no repositório.

Por que gerado e não desenhado: um gráfico feito à mão diverge do dado no dia em
que o dado muda, e ninguém percebe. Aqui os números moram numa tabela só, neste
arquivo, e o SVG sai dela. Se a medição mudar, o desenho muda junto ou o build
quebra.

Sem dependência, como o resto do site. O SVG é inline, sem JS: escala sozinho,
funciona com o CSS do tema escuro, e não custa uma requisição.

Smart2Raw - Copyright (C) 2026 Carlos Alberto Terêncio de Bastos
SPDX-License-Identifier: AGPL-3.0-or-later
"""
import os, html

OUT = os.path.join(os.path.dirname(__file__), "..", "assets")

# ---------------------------------------------------------------- paleta
# Ênfase, não categórica: o nosso em cor, o alternativo em cinza de recuo.
# O par foi conferido no validador — ΔE 18,2 (deutan) e 20,6 (visão normal),
# contra um piso de 8 e de 15. O cinza fica abaixo do piso de croma DE PROPÓSITO:
# é o cinza de recuo do padrão de ênfase, não uma segunda série.
MINT   = "#5cc4a7"   # Smart2Raw
GREY   = "#6b7a89"   # a melhor alternativa clássica
RED    = "#d9534a"   # status: este formato ficou MAIOR que a entrada
                     # (um tom abaixo do --bad do site: bloco grande satura demais)
INK    = "#e6edf3"
DIM    = "#8b98a5"
FAINT  = "#26313d"
SURF   = "#161b22"

# ---------------------------------------------------------------- o dado
# benchmarks/format_matrix.c, 4 milhões de elementos, tamanhos em MB.
# `melhor` é a melhor alternativa clássica para AQUELA forma de coluna.
BASE = 30.52
LINHAS = [
    # rotulo_pt, rotulo_en, s2r, melhor_valor, melhor_nome_pt, melhor_nome_en
    ("A · uniforme 0..200",        "A · uniform 0..200",          3.81,  3.82, "dicionário", "dictionary"),
    ("B · 12 valores distintos",   "B · 12 distinct values",      3.82,  1.91, "dicionário", "dictionary"),
    ("C · a mesma, ordenada",      "C · the same, sorted",        0.06,  0.00, "RLE",        "RLE"),
    ("D · booleana 0/1",           "D · boolean 0/1",             3.81,  0.48, "bitmap",     "bitmap"),
    ("E · timestamps a cada 60 s", "E · timestamps every 60 s",   4.11, 41.01, "dicionário", "dictionary"),
    ("F · u64 aleatório",          "F · random u64",             30.52, 41.01, "dicionário", "dictionary"),
    ("G · ids em 0..1e6",          "G · ids in 0..1e6",          15.26, 17.03, "dicionário", "dictionary"),
]

T = {
 "pt": dict(
   titulo="A mesma coluna em sete formatos",
   sub="4 milhões de elementos · a régua marca a entrada <tspan>int64</tspan>",
   s2r="Smart2Raw", alt="melhor alternativa clássica",
   base="entrada int64 · 30,52 MB",
   eixo="megabytes", maior="maior que a entrada",
   nota="As duas barras vermelhas passaram da entrada: numa coluna de alta cardinalidade o "
        "dicionário guarda um dicionário do tamanho do dado, e devolve 41,01 MB para os 30,52 MB "
        "que recebeu. O pior caso do Smart2Raw empata com a entrada, porque a classe mais larga "
        "que ele tem É a entrada.",
   dec=","),
 "en": dict(
   titulo="The same column in seven formats",
   sub="4 million elements · the rule marks the <tspan>int64</tspan> input",
   s2r="Smart2Raw", alt="best classical alternative",
   base="int64 input · 30.52 MB",
   eixo="megabytes", maior="larger than the input",
   nota="The two red bars crossed the input: on a high-cardinality column the dictionary stores "
        "a dictionary the size of the data, and hands back 41.01 MB for the 30.52 MB it was given. "
        "Smart2Raw's worst case ties with the input, because the widest class it has IS the input.",
   dec="."),
}

def num(v, dec):
    return ("%.2f" % v).replace(".", dec)

def svg_matriz(lang):
    t = T[lang]
    W, LEFT, RIGHT = 760, 176, 62
    TOP, ROW, GAP = 76, 40, 15          # ROW = altura de uma linha (duas barras + folga)
    BARH = 13
    PLOTW = W - LEFT - RIGHT
    VMAX = 42.0
    H = TOP + len(LINHAS) * ROW + 50

    def x(v): return LEFT + (v / VMAX) * PLOTW

    o = []
    a = o.append
    a('<svg class="fig" viewBox="0 0 %d %d" width="100%%" role="img" '
      'xmlns="http://www.w3.org/2000/svg" aria-labelledby="ftit%s fdesc%s">' % (W, H, lang, lang))
    a('<title id="ftit%s">%s</title>' % (lang, html.escape(t["titulo"])))
    a('<desc id="fdesc%s">%s</desc>' % (lang, html.escape(
        t["sub"].replace("<tspan>", "").replace("</tspan>", ""))))

    # Sem título dentro da figura: o h2 da página já titula, e repetir rouba
    # espaço de quem precisa ler as barras.
    sub = t["sub"].replace("<tspan>", '<tspan class="fmono">').replace("</tspan>", "</tspan>")
    a('<text x="0" y="14" class="fs">%s</text>' % sub)

    # legenda — sempre presente com duas séries
    a('<g transform="translate(0,38)">')
    a('<rect x="0" y="-8" width="10" height="10" rx="2" fill="%s"/>' % MINT)
    a('<text x="16" y="0" class="fl">%s</text>' % html.escape(t["s2r"]))
    a('<rect x="112" y="-8" width="10" height="10" rx="2" fill="%s"/>' % GREY)
    a('<text x="128" y="0" class="fl">%s</text>' % html.escape(t["alt"]))
    a('</g>')

    # grade: hairlines sólidas, um tom acima da superfície
    for v in (0, 10, 20, 30, 40):
        a('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="%s" stroke-width="1"/>'
          % (x(v), TOP - 8, x(v), TOP + len(LINHAS) * ROW - 4, FAINT))
        a('<text x="%.1f" y="%d" class="fa" text-anchor="middle">%d</text>'
          % (x(v), TOP + len(LINHAS) * ROW + 14, v))
    a('<text x="%.1f" y="%d" class="fa" text-anchor="middle">%s</text>'
      % (LEFT + PLOTW / 2, TOP + len(LINHAS) * ROW + 34, html.escape(t["eixo"])))

    # a régua da linha de base
    bx = x(BASE)
    a('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="%s" stroke-width="1.5"/>'
      % (bx, TOP - 14, bx, TOP + len(LINHAS) * ROW - 4, "#4a5a6a"))
    a('<text x="%.1f" y="%d" class="fb" text-anchor="end">%s</text>'
      % (bx - 7, TOP - 22, html.escape(t["base"])))
    a('<circle cx="%.1f" cy="%d" r="2.5" fill="%s"/>' % (bx, TOP - 14, "#4a5a6a"))

    for i, (rpt, ren, s2r, alt, npt, nen) in enumerate(LINHAS):
        rot = rpt if lang == "pt" else ren
        nom = npt if lang == "pt" else nen
        y = TOP + i * ROW
        a('<text x="%d" y="%.1f" class="fr" text-anchor="end">%s</text>'
          % (LEFT - 12, y + 12, html.escape(rot)))

        # barra do Smart2Raw
        w1 = max(x(s2r) - LEFT, 1.5)
        a('<rect x="%d" y="%.1f" width="%.1f" height="%d" rx="3" fill="%s"/>'
          % (LEFT, y, w1, BARH, MINT))
        # barra da alternativa clássica — vermelha quando passa da entrada
        cor = RED if alt > BASE else GREY
        w2 = max(x(alt) - LEFT, 1.5)
        a('<rect x="%d" y="%.1f" width="%.1f" height="%d" rx="3" fill="%s"/>'
          % (LEFT, y + BARH + 3, w2, BARH, cor))

        # Rótulos diretos, seletivos — não um número em cada barra:
        # o vencedor da linha (é o que o leitor procura) e quem passou da entrada.
        venceu_s2r = s2r <= alt
        if venceu_s2r:
            a('<text x="%.1f" y="%.1f" class="fv">%s</text>'
              % (LEFT + w1 + 7, y + 10, num(s2r, t["dec"])))
            a('<text x="%.1f" y="%.1f" class="fn">%s</text>'
              % (LEFT + w2 + 7, y + BARH + 3 + 10, html.escape(nom)))
        else:
            a('<text x="%.1f" y="%.1f" class="fn">%s  %s</text>'
              % (LEFT + w2 + 7, y + BARH + 3 + 10, html.escape(nom), num(alt, t["dec"])))
        if alt > BASE:                      # status: este formato aumentou o dado
            a('<text x="%.1f" y="%.1f" class="fv fvbad" text-anchor="end">%s</text>'
              % (LEFT + w2 - 8, y + BARH + 3 + 10, num(alt, t["dec"])))

        # acesso não visual e dica nativa do navegador, sem JS
        a('<title>%s — Smart2Raw %s MB, %s %s MB</title>'
          % (html.escape(rot), num(s2r, t["dec"]), html.escape(nom), num(alt, t["dec"])))

    a('</svg>')
    return "\n".join(o)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for lang in ("pt", "en"):
        p = os.path.join(OUT, "fig-matriz-%s.svg" % lang)
        open(p, "w", encoding="utf-8").write(svg_matriz(lang))
        print("escrito", os.path.relpath(p), len(svg_matriz(lang)), "bytes")
