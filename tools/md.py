#!/usr/bin/env python3
"""
Markdown mínimo, sem dependência nenhuma.

O site do Smart2Raw não vai depender de biblioteca de terceiro para se construir,
pela mesma razão que a biblioteca não depende: quem clonar o repositório daqui a
cinco anos precisa conseguir reconstruir com o que já tem na máquina.

Suporta o subconjunto que o site usa: títulos, parágrafos, listas, tabelas,
blocos de código, citação, linha horizontal, e inline de negrito, itálico,
código e link. Nada além disso.

Smart2Raw - Copyright (C) 2026 Carlos Alberto Terêncio de Bastos
SPDX-License-Identifier: AGPL-3.0-or-later
"""
import re, html

def _esc(s):
    return html.escape(s, quote=False)

def inline(s):
    """negrito, itálico, código, link e quebra explícita — nessa ordem."""
    out, i, n = [], 0, len(s)
    while i < n:
        c = s[i]
        if c == '`':                                   # código: nada dentro é interpretado
            j = s.find('`', i + 1)
            if j > 0:
                out.append('<code>' + _esc(s[i+1:j]) + '</code>')
                i = j + 1
                continue
        if s.startswith('**', i):
            j = s.find('**', i + 2)
            if j > 0:
                out.append('<strong>' + inline(s[i+2:j]) + '</strong>')
                i = j + 2
                continue
        if c == '*':
            j = s.find('*', i + 1)
            if j > 0:
                out.append('<em>' + inline(s[i+1:j]) + '</em>')
                i = j + 1
                continue
        if c == '[':
            m = re.match(r'\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)', s[i:])
            if m:
                txt, url, title = m.group(1), m.group(2), m.group(3)
                ext = url.startswith('http')
                out.append('<a href="%s"%s%s>%s</a>' % (
                    _esc(url),
                    ' title="%s"' % _esc(title) if title else '',
                    ' target="_blank" rel="noopener"' if ext else '',
                    inline(txt)))
                i += m.end()
                continue
        out.append(_esc(c))
        i += 1
    return ''.join(out)

def _row(line):
    cells = line.strip().strip('|').split('|')
    return [c.strip() for c in cells]

def render(text):
    lines = text.replace('\r\n', '\n').split('\n')
    out, i, n = [], 0, len(lines)
    while i < n:
        ln = lines[i]

        if not ln.strip():
            i += 1
            continue

        if ln.startswith('```'):                       # bloco de código
            lang = ln[3:].strip()
            i += 1
            buf = []
            while i < n and not lines[i].startswith('```'):
                buf.append(lines[i]); i += 1
            i += 1
            out.append('<pre%s><code>%s</code></pre>' % (
                ' class="lang-%s"' % _esc(lang) if lang else '',
                _esc('\n'.join(buf))))
            continue

        if re.match(r'^-{3,}\s*$', ln):
            out.append('<hr>'); i += 1; continue

        m = re.match(r'^(#{1,4})\s+(.*)$', ln)         # título
        if m:
            lvl = len(m.group(1))
            txt = m.group(2).strip()
            slug = re.sub(r'[^a-z0-9]+', '-', txt.lower()).strip('-')
            out.append('<h%d id="%s">%s</h%d>' % (lvl, slug, inline(txt), lvl))
            i += 1
            continue

        if ln.lstrip().startswith('|') and i + 1 < n and re.match(
                r'^\s*\|[\s:|-]+\|\s*$', lines[i+1]):  # tabela
            head = _row(ln)
            align = ['right' if c.strip().endswith(':') and c.strip().startswith('-') is False
                     else ('right' if c.strip().startswith('-') and c.strip().endswith(':')
                           else 'left')
                     for c in _row(lines[i+1])]
            i += 2
            body = []
            while i < n and lines[i].lstrip().startswith('|'):
                body.append(_row(lines[i])); i += 1
            t = ['<div class="tw"><table><thead><tr>']
            for k, h in enumerate(head):
                a = align[k] if k < len(align) else 'left'
                t.append('<th%s>%s</th>' % (' class="r"' if a == 'right' else '', inline(h)))
            t.append('</tr></thead><tbody>')
            for r in body:
                t.append('<tr>')
                for k, c in enumerate(r):
                    a = align[k] if k < len(align) else 'left'
                    t.append('<td%s>%s</td>' % (' class="r"' if a == 'right' else '', inline(c)))
                t.append('</tr>')
            t.append('</tbody></table></div>')
            out.append(''.join(t))
            continue

        if re.match(r'^\s*[-*]\s+', ln):               # lista não ordenada
            items = []
            while i < n and re.match(r'^\s*[-*]\s+', lines[i]):
                items.append(re.sub(r'^\s*[-*]\s+', '', lines[i])); i += 1
            out.append('<ul>' + ''.join('<li>%s</li>' % inline(x) for x in items) + '</ul>')
            continue

        if re.match(r'^\s*\d+\.\s+', ln):              # lista ordenada
            items = []
            while i < n and re.match(r'^\s*\d+\.\s+', lines[i]):
                items.append(re.sub(r'^\s*\d+\.\s+', '', lines[i])); i += 1
            out.append('<ol>' + ''.join('<li>%s</li>' % inline(x) for x in items) + '</ol>')
            continue

        if ln.startswith('> '):                        # citação
            buf = []
            while i < n and lines[i].startswith('> '):
                buf.append(lines[i][2:]); i += 1
            out.append('<blockquote>%s</blockquote>' % inline(' '.join(buf)))
            continue

        if ln.startswith('::'):                        # bloco cru: ::html ... ::
            tag = ln[2:].strip()
            i += 1
            buf = []
            while i < n and lines[i].strip() != '::':
                buf.append(lines[i]); i += 1
            i += 1
            out.append('\n'.join(buf) if tag == 'html' else '')
            continue

        buf = []                                       # parágrafo
        while i < n and lines[i].strip() and not re.match(
                r'^(#{1,4}\s|```|\s*[-*]\s|\s*\d+\.\s|>\s|::|\s*\|)', lines[i]) \
              and not re.match(r'^-{3,}\s*$', lines[i]):
            buf.append(lines[i].strip()); i += 1
        if buf:
            out.append('<p>%s</p>' % inline(' '.join(buf)))
        else:
            i += 1
    return '\n'.join(out)

def parse(text):
    """front-matter simples (chave: valor) até uma linha '---', depois o corpo."""
    meta, body = {}, text
    if text.startswith('---\n'):
        end = text.find('\n---\n', 4)
        if end > 0:
            for line in text[4:end].split('\n'):
                if ':' in line:
                    k, v = line.split(':', 1)
                    meta[k.strip()] = v.strip()
            body = text[end + 5:]
    return meta, body
