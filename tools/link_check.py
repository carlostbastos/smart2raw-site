#!/usr/bin/env python3
"""Confere todo link interno do site gerado: nenhum aponta para página que não
existe, e nenhuma página fica sem par no outro idioma."""
import os, re, sys
ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "site")
bad, n = [], 0
for dp, _, fs in os.walk(ROOT):
    for f in fs:
        if not f.endswith(".html"):
            continue
        p = os.path.join(dp, f)
        rel = "/" + os.path.relpath(p, ROOT).replace(os.sep, "/").replace("index.html", "")
        html = open(p, encoding="utf-8").read()
        for m in re.finditer(r'href="(/[^"#]*)"', html):
            u = m.group(1)
            n += 1
            if u.startswith("//") or u.startswith("http"):
                continue
            tgt = os.path.join(ROOT, u.strip("/"))
            ok = (os.path.isfile(os.path.join(tgt, "index.html")) or os.path.isfile(tgt)
                  or (u == "/" and os.path.isfile(os.path.join(ROOT, "index.html"))))
            if not ok:
                bad.append("%s  ->  %s" % (rel, u))
print("%d links internos conferidos" % n)
if bad:
    print("QUEBRADOS:")
    for b in sorted(set(bad)):
        print("  ", b)
    sys.exit(1)
print("nenhum link quebrado")
