---
title: Smart2Raw Premium — beyond the open version, under commercial licence
description: The open version is what you can verify. Premium goes further in how far the data compacts and in what you can ask of it, and comes with the right to build it into a closed product.
---

# Smart2Raw Premium

The version published on this site is complete, auditable and yours to test —
that is the point of it. **Premium** is the version that is not published, and it
is licensed rather than downloaded.

## What Premium adds

::html
<div class="cards">
  <div class="card"><h3>It compacts further</h3>
    <p>Beyond what the smallest native class can do on its own — including the regimes where,
    in the open version, a dictionary still wins. The <a href="/scope/">technical scope</a> page
    names those regimes precisely; Premium is where they stop being a trade.</p></div>
  <div class="card"><h3>It answers more</h3>
    <p>Past counting and summing: composite operations over a column, and over more than one,
    that in the open version you would have to write yourself.</p></div>
  <div class="card"><h3>And it does not stop there</h3>
    <p>The rest is not published, on purpose. What is public is deliberately the part that can be
    verified by anyone; the rest is under licence.</p></div>
</div>
::

## Why the unpublished part is worth taking seriously

That is a fair question, and there is a concrete answer rather than a promise.

Everything this project *has* published can be checked line by line: three
versions deposited with their own DOI, 31 test suites with zero failures, every
benchmark shipping with the command that reproduces it and an assertion that
runs before each number is printed.

And there is a harder piece of evidence. Version 3.4.0 — already deposited,
already citable — turned out to carry a defect that returned **truncated values
with no error, no warning and a valid CRC**. The project found it with a
differential fuzz suite, fixed it, and then published the defect, the minimal
reproducing case and the reason twenty-five suites of chosen cases had missed it.
That is on the [technical scope](/scope/) page right now, where a buyer will
read it.

A project that documents its own worst moment is a project whose claims you can
price. Premium is built by the same hands, under the same discipline.

## Who it is for

- Anyone building Smart2Raw into a **product they do not publish under AGPL** —
  software sold to customers, a SaaS, firmware, a device.
- Teams whose columns sit in the regimes where the open version deliberately
  stops.
- Anyone who needs someone accountable for a correction, on a date.

## What a licence includes

| | Open · AGPL-3.0 | Premium · commercial |
|---|---|---|
| Classification by range, three shapes, native predicates | yes | yes |
| The `.s2r` format, portability, the full test battery | yes | yes |
| Compaction beyond the smallest native class | — | yes |
| Composite and multi-column operations | write it yourself | yes |
| Right to build into software not published under AGPL | — | yes |
| Support and priority on corrections | community | yes |
| Everything else that is not published | — | yes |

## How the conversation starts

Tell us what the column is: how many elements, what the range looks like, what
you need to ask of it, and where it runs. That is usually enough for a first,
honest answer about whether Premium changes anything for you — and if it does
not, you will be told so.

::html
<div class="cta"><a class="btn" href="/contact/">Talk to us</a>
<a class="btn ghost" href="/license/">How the licensing works</a></div>
::
