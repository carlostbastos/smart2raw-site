#!/usr/bin/env python3
"""
Gerador do site do Smart2Raw. Sem dependência externa: python3 e mais nada.

    python3 tools/build_site.py        # gera site/
    python3 tools/build_site.py serve  # gera e serve em http://localhost:8080

Um conteúdo por idioma em content/en e content/pt; um molde em templates/;
a saída em site/, pronta para ser servida por qualquer coisa que sirva arquivo
estático. O idioma inglês fica na raiz, o português em /pt/.

Smart2Raw - Copyright (C) 2026 Carlos Alberto Terêncio de Bastos
SPDX-License-Identifier: AGPL-3.0-or-later
"""
import os, sys, shutil, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import md, build_single

ROOTDIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE_URL = "https://smart2raw.com"
# Enquanto estiver vazio, o botão simplesmente não aparece — nada de link
# quebrado no ar.
LINKEDIN = "https://br.linkedin.com/in/carlos-alberto-terencio-bastos"

# id da página, e para cada idioma: caminho na URL e rótulo no menu (None = fora do menu)
PAGES = [
    dict(id="index",        en=("",             None),            pt=("",              None)),
    dict(id="applications", en=("applications", "Applications"),  pt=("aplicacoes",    "Aplicações")),
    dict(id="how",          en=("how-it-works", "How it works"),  pt=("como-funciona", "Como funciona")),
    dict(id="start",        en=("start",        "Get started"),   pt=("comece",        "Comece")),
    dict(id="benchmarks",   en=("benchmarks",   "Performance"),   pt=("desempenho",    "Desempenho")),
    dict(id="premium",      en=("premium",      "Premium"),       pt=("premium",       "Premium")),
    dict(id="license",      en=("license",      "Licensing"),     pt=("licenciamento", "Licenciamento")),
    dict(id="investors",    en=("investors",    "Investment"),    pt=("investimento",  "Investimento")),
    dict(id="scope",        en=("scope",        "Technical scope"), pt=("escopo",      "Escopo técnico")),
    dict(id="cite",         en=("cite",         "Cite"),          pt=("citar",         "Citar")),
    dict(id="about",        en=("about",        "About"),         pt=("sobre",         "Sobre")),
    dict(id="contact",      en=("contact",      "Contact"),       pt=("contato",       "Contato")),
    dict(id="privacy",      en=("privacy",      None),            pt=("privacidade",   None)),
]

CHROME = {
 "en": dict(skip="Skip to content", foot_tag="Classify once, operate forever in the "
            "smallest native format.", concept="Concept DOI (all versions)",
            orcom="or commercial licence"),
 "pt": dict(skip="Ir para o conteúdo", foot_tag="Classifique uma vez, opere para sempre "
            "no menor formato nativo.", concept="DOI do projeto (todas as versões)",
            orcom="ou licença comercial"),
}
FOOTLINKS = {
 "en": ["privacy", "cite", "license", "contact"],
 "pt": ["privacy", "cite", "license", "contact"],
}

def url_for(page, lang):
    slug = page[lang][0]
    if lang == "en":
        return "/" + (slug + "/" if slug else "")
    return "/pt/" + (slug + "/" if slug else "")

def depth_of(page, lang):
    """quantos '../' até a raiz do site"""
    slug = page[lang][0]
    d = 0 if lang == "en" else 1
    if slug:
        d += 1
    return d

def build():
    for p, n in build_single.build():
        print("  single-file: %-42s %6.1f KB" % (os.path.relpath(p, ROOTDIR), n/1024))
    out = os.path.join(ROOTDIR, "site")
    # Alguns pontos de montagem (a pasta compartilhada do desktop, por exemplo)
    # não permitem apagar diretório. Então a saída é sobrescrita, não recriada.
    if os.path.isdir(out):
        try:
            shutil.rmtree(out)
        except OSError:
            pass
    os.makedirs(out, exist_ok=True)

    tpl = open(os.path.join(ROOTDIR, "templates", "base.html"), encoding="utf-8").read()
    demo_tpl = open(os.path.join(ROOTDIR, "templates", "demo.html"), encoding="utf-8").read()
    by_id = {p["id"]: p for p in PAGES}
    made = []

    for page in PAGES:
        for lang in ("en", "pt"):
            src = os.path.join(ROOTDIR, "content", lang, page["id"] + ".md")
            if not os.path.exists(src):
                continue
            meta, body_md = md.parse(open(src, encoding="utf-8").read())
            root = "../" * depth_of(page, lang)
            has_demo = "{{DEMO}}" in body_md

            body = md.render(body_md)
            body = body.replace("{{LINKEDIN}}",
                '<a class="btn ghost" href="%s">LinkedIn</a>' % LINKEDIN if LINKEDIN else "")
            if has_demo:
                body = body.replace("{{DEMO}}",
                        demo_tpl.replace("{{ROOT}}", root).replace("{{LANG}}", lang))
                # md.render escapou o marcador dentro de um <p>; limpa o invólucro
                body = body.replace("<p>{{DEMO}}</p>", "").replace("<p></p>", "")

            nav = []
            for q in PAGES:
                label = q[lang][1]
                if not label:
                    continue
                if not os.path.exists(os.path.join(ROOTDIR, "content", lang, q["id"] + ".md")):
                    continue
                on = " class=\"on\"" if q["id"] == page["id"] else ""
                nav.append('<a href="%s"%s>%s</a>' % (url_for(q, lang), on, label))

            fl = []
            for pid in FOOTLINKS[lang]:
                q = by_id[pid]
                lab = q[lang][1] or (
                    "Privacy" if lang == "en" and pid == "privacy" else
                    "Privacidade" if pid == "privacy" else pid)
                if os.path.exists(os.path.join(ROOTDIR, "content", lang, pid + ".md")):
                    fl.append('<a href="%s">%s</a>' % (url_for(q, lang), lab))

            html = (tpl
                .replace("{{HTMLLANG}}", "en" if lang == "en" else "pt-BR")
                .replace("{{TITLE}}", meta.get("title", "Smart2Raw"))
                .replace("{{DESC}}", meta.get("description", ""))
                .replace("{{CANONICAL}}", SITE_URL + url_for(page, lang))
                .replace("{{HREF_EN}}", SITE_URL + url_for(page, "en"))
                .replace("{{HREF_PT}}", SITE_URL + url_for(page, "pt"))
                .replace("{{EN_ACTIVE}}", "on" if lang == "en" else "")
                .replace("{{PT_ACTIVE}}", "on" if lang == "pt" else "")
                .replace("{{HOME}}", url_for(by_id["index"], lang))
                .replace("{{NAV}}", "\n      ".join(nav))
                .replace("{{FOOTLINKS}}", "<br>\n      ".join(fl))
                .replace("{{BODY}}", body)
                .replace("{{ROOT}}", root)
                .replace("{{T_SKIP}}", CHROME[lang]["skip"])
                .replace("{{T_FOOT_TAG}}", CHROME[lang]["foot_tag"])
                .replace("{{T_FOOT_CONCEPT}}", CHROME[lang]["concept"])
                .replace("{{T_OR_COMMERCIAL}}", CHROME[lang]["orcom"])
                .replace("{{EXTRA_JS}}",
                         '<script src="%sassets/demo.js"></script>' % root if has_demo else ""))

            rel = url_for(page, lang).strip("/")
            d = os.path.join(out, rel) if rel else out
            os.makedirs(d, exist_ok=True)
            open(os.path.join(d, "index.html"), "w", encoding="utf-8").write(html)
            made.append(url_for(page, lang))

    shutil.copytree(os.path.join(ROOTDIR, "assets"), os.path.join(out, "assets"),
                    dirs_exist_ok=True)

    # sitemap e robots
    urls = "".join("  <url><loc>%s%s</loc></url>\n" % (SITE_URL, u) for u in made)
    open(os.path.join(out, "sitemap.xml"), "w", encoding="utf-8").write(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n%s</urlset>\n' % urls)
    open(os.path.join(out, "robots.txt"), "w", encoding="utf-8").write(
        "User-agent: *\nAllow: /\nSitemap: %s/sitemap.xml\n" % SITE_URL)

    print("%d páginas geradas em site/" % len(made))
    for u in made:
        print("   ", u)
    return out

if __name__ == "__main__":
    out = build()
    if len(sys.argv) > 1 and sys.argv[1] == "serve":
        import http.server, socketserver, functools
        os.chdir(out)
        h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=out)
        with socketserver.TCPServer(("", 8080), h) as srv:
            print("servindo em http://localhost:8080")
            srv.serve_forever()
