---
title: Smart2Raw Premium — beyond the open version, under commercial licence
description: The open version is what you can verify. Premium goes further in how far the data compacts and in what you can ask of it, and comes with the right to build it into a closed product.
---

::html
<section class="hero">
  <p class="slogan">The proof is the open edition.</p>
  <h1>Smart2Raw Premium</h1>
  <p class="lead">The version published on this site is complete, auditable and yours to test — that is the point of it. <strong>Premium</strong> is the version that is not published, and it is licensed rather than downloaded.</p>
  <p class="qual">Two fair questions follow from that: what exactly it adds, and why the part that is not published deserves any credit. This page answers both with what can already be checked today.</p>
  <div class="cta">
    <a class="btn" href="/contact/">Start the conversation</a>
    <a class="btn ghost" href="/license/">Licensing</a>
    <a class="btn ghost" href="/scope/">What the open edition already does</a>
  </div>
  <div class="kpis">
    <div class="kpi"><b>5</b><small>versions deposited with their own DOI, timestamped by a third party</small></div>
    <div class="kpi"><b>31</b><small>test suites in the open edition, 0 failures — what can be checked, is checked</small></div>
    <div class="kpi"><b>2</b><small>defects published with the minimal case that reproduces each, instead of buried</small></div>
  </div>
</section>
::

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

Everything this project *has* published can be checked line by line: five
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

::html
<section class="next">
<h2>Where to go next</h2>
<div class="cards">
  <div class="card"><h3>See where the open edition stops</h3>
    <p>The regimes where it loses, named precisely and with the number.</p>
    <a class="more" href="/scope/">Technical scope →</a></div>
  <div class="card"><h3>Understand the licence</h3>
    <p>AGPL is what makes an open edition possible without giving up the commercial right.</p>
    <a class="more" href="/license/">Licensing →</a></div>
  <div class="card"><h3>Tell us about your column</h3>
    <p>How many elements, what the range looks like, what you need to ask of it.</p>
    <a class="more" href="/contact/">Contact →</a></div>
</div>
</section>
::
