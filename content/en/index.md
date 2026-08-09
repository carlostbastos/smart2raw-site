---
title: Smart2Raw — C library that stores integer columns in the smallest native class
description: One C11 header, no dependencies, for databases, telemetry, IoT, AI and embedded. Stores the column in the smallest native class the range needs and operates directly on the bytes — no decode step, because nothing was encoded. Test it with your own data, in the browser.
---

::html
<section class="hero">
  <p class="slogan">A C library in a single file. And no, it is not a compressor.</p>
  <h1>The server you don't have to buy.</h1>
  <p class="lead">Your integer column takes 8 bytes per element because nobody asked how much it
  needs. Smart2Raw asks: it measures the real range and stores the column in the smallest
  <b>native</b> class that range requires — 8, 16, 32 or 64 bits, signed or unsigned. Then it
  stops. No dictionary, no bit packing, no decode step, because nothing was left encoded to
  undo.</p>
  <p class="qual">And that is where the saving turns into speed: because the stored bytes are
  still integers the machine already knows how to read, <b>a 512-bit register processes 64 of
  them per instruction instead of 8</b>. The compact format is not a cost paid at read time —
  it is what unlocks the width.</p>
  <div class="cta">
    <a class="btn" href="#s2rdemo">Test with your column</a>
    <a class="btn ghost" href="/how-it-works/">How it works</a>
    <a class="btn ghost" href="https://github.com/carlostbastos/Smart2Raw">GitHub</a>
  </div>
  <div class="kpis kpicount">
    <div class="kpi"><b>8×</b><small>fewer bytes on a 0..200 telemetry column — 30.52 MB becomes 3.81 MB</small></div>
    <div class="kpi"><b>13.4×</b><small>the largest measured gain: signed <code>count_gt</code> on i8, from 1402 to 18833 Mval/s</small></div>
    <div class="kpi"><b>7</b><small>areas where the integer column already is — from database to microcontroller</small></div>
    <div class="kpi"><b>0</b><small>dependencies. One C11 header, and ~3.4 KB of code on a microcontroller</small></div>
  </div>
</section>
::

## Where it fits: databases, telemetry, IoT, AI, embedded

The question is always the same one — **where is the integer column?** Once you
start looking, it is almost everywhere, and almost always eight bytes per element,
because the width was chosen by the type declaration and not by the data.

::html
<div class="cards">
  <div class="card"><h3>Databases and columnar engines</h3>
    <p>Ids, status codes, dates as day numbers, counters, partition ids. In a columnar layout the
    column <i>is</i> the unit of storage — the most direct fit there is.</p></div>
  <div class="card"><h3>Operating systems and Linux</h3>
    <p>Counters from <code>/proc</code>, eBPF metrics, PIDs, inodes, uids, log timestamps. A
    dependency-free header drops into a daemon or an agent without dragging a library along.</p></div>
  <div class="card"><h3>Observability, IoT, telemetry</h3>
    <p>Fixed-interval time series, sensors, counters. This is where the common stride and the
    per-block frame of reference work together: 4 million timestamps go from 15.26 MB to 4.11 MB.</p></div>
  <div class="card"><h3>AI and machine learning</h3>
    <p>Token ids, vocabulary indices, feature ids, dataset offsets, KV cache. Inference is bound by
    memory bandwidth, not by FLOPs — and here there is no dequantisation to pay for on the way
    in.</p></div>
  <div class="card"><h3>Embedded, MCU, edge, automotive</h3>
    <p>Any reading buffer. Fitting four times more samples in the same buffer is not an
    optimisation, it is a different product. The lean mode — no stdio, no mmap, no SIMD — is one
    of the test suites.</p></div>
  <div class="card"><h3>Financial markets</h3>
    <p>Prices in cents (a stride!), nanosecond timestamps, instrument ids, volumes. Tick data is
    the picture of the ideal case.</p></div>
  <div class="card"><h3>Developer tools</h3>
    <p>Symbol tables, offsets, indices inside compilers, linkers and binary formats. A single
    header drops into any build.</p></div>
</div>
::

::html
<p class="morep"><a class="more" href="/applications/">Each one in detail, with where to start →</a></p>
::

## Bytes are only one axis. The other one decides what it costs to run.

Storing fewer bytes is half the story, and it is the half everyone tells. The other
half is **what you can ask of the bytes without first turning them into something
else** — and it only becomes visible when you take bytes out of the equation.

This chart does exactly that. The column is the same one, and both formats take
practically the same space: 11.44 MB against 11.45 MB. With the bytes tied, what is
left in the drawing is processing alone.

{{FIG_OPERACOES}}

::html
<p class="figcap">The peer is implemented at its best, with the dictionary over <b>sorted</b>
distinct values — which is why <code>COUNT</code> comes out level. Saying so is what earns the
other two rows their credit. <code>SUM</code> has no such shortcut: a code is not an addable
operand. And the 7.9 ms in the last row do not move with a better implementation — that is the
format's definition.</p>
::

A dictionary code is meaningful only to the engine that owns the dictionary. A
native-width integer is meaningful to **every instruction on the machine** —
including the ones a warehouse format cannot reach without materialising a buffer
first.

::html
<p class="morep"><a class="more" href="/benchmarks/">Every number, with the command that reproduces it →</a></p>
::

::html
<section>
::

{{DEMO}}

::html
</section>
::

## How it works, in three steps

::html
<div class="steps">
  <div class="step"><b>1</b><h3>Measure the real range</h3>
    <p>One pass, no allocation. For 0..200 the answer is <code>S2R_8</code>; for −500..500 it is
    <code>S2R_I16</code>.</p>
    <pre><code>int8_t cls = s2r_classify_array(v, n);</code></pre></div>
  <div class="step"><b>2</b><h3>Store in that class, natively</h3>
    <p>The elements become real <code>uint8_t</code> in memory — not "8-bit codes". An array any C
    compiler already knows how to read.</p>
    <pre><code>s2r_pool_init(&amp;p, cls, n);</code></pre></div>
  <div class="step"><b>3</b><h3>Operate without materialising</h3>
    <p>The predicate runs over the bytes <i>as they are</i>. No decoding, no dictionary lookup, no
    intermediate buffer.</p>
    <pre><code>s2r_count_gt_fast(&amp;p, 100);</code></pre></div>
</div>
::

There are three shapes, and the library chooses between them by measuring rather
than guessing: the flat pool, the affine form (`v = base + stride·i`, with the
stride found by gcd) and the block-wise form, each block relative to its own
minimum. `s2r_recommend()` prices all three — because the obvious entry point is
usually the worst one.

::html
<p class="morep"><a class="more" href="/how-it-works/">The whole mechanism, and why it cannot expand your data →</a></p>
::

## Against what you already have

Comparing against "a dictionary" is comparing against an abstraction. Almost nobody
runs one in production; almost everybody runs a SQLite. The repository ships a
comparator that runs on **your** CSV and prints the whole table:

::html
<div class="tw"><table><thead><tr><th>what</th><th>SQLite</th><th>Smart2Raw</th><th>gain</th></tr></thead>
<tbody>
<tr><td><code>SUM</code></td><td>2635 µs</td><td><b>16.3 µs</b></td><td><b>161×</b></td></tr>
<tr><td><code>COUNT</code> with a filter</td><td>3900 µs</td><td><b>69.5 µs</b></td><td><b>56×</b></td></tr>
<tr><td>size on disk</td><td>412.0 KB</td><td><b>275.7 KB</b></td><td>1.49× smaller</td></tr>
<tr><td>resident memory</td><td colspan="2">934.8 KB (int64/float64) → <b>342.2 KB</b></td><td>2.73×</td></tr>
<tr><td>data moved per scan</td><td colspan="2">868.1 KB → <b>275.4 KB</b></td><td>3.15×</td></tr>
</tbody></table></div>
::

```sh
python benchmarks/maestro/smart2raw_bench.py your_data.csv
```

Python here is only the conductor: it uses the standard library for SQLite and calls
the real C kernels through `ctypes`. Columns that genuinely need 64 bits, or that are
floating point, show **0%** on purpose — because this is choosing the right native
type, not compressing.

## Why this matters now

::html
<section class="why">
<p class="whysub">These three numbers are not ours. They come from third parties, and each one
carries its source. The numbers we measured are above, and you reproduce every one of them right
here — the separation is deliberate.</p>
<div class="mk">

  <div class="mkc">
    <p class="mkn">3.0× <i>against</i> 1.6×</p>
    <p class="mkt">The bottleneck stopped being arithmetic</p>
    <p>Over 20 years, hardware peak compute grew 3.0× every 2 years. DRAM bandwidth grew 1.6×;
    interconnect, 1.4×. The gap widens every year.</p>
    <p class="mkso">IEEE Micro · <a href="https://arxiv.org/abs/2403.14123">arXiv:2403.14123</a></p>
    <p class="arrow">→ Adding FLOPs stopped solving it. Reading fewer bytes, with no decode to pay
    for, attacks exactly the side that got narrow.</p>
  </div>

  <div class="mkc">
    <p class="mkn">+58% to 63%</p>
    <p class="mkt">In a single quarter</p>
    <p>That is how much DRAM contract prices rose in Q2 2026, in the worst shortage in nearly 15
    years. An AI server uses 8 to 10 times the memory of an ordinary one.</p>
    <p class="mkso">TrendForce, April 2026</p>
    <p class="arrow">→ A byte you do not store is money you do not spend — and memory left over
    for something else.</p>
  </div>

  <div class="mkc">
    <p class="mkn">945 TWh</p>
    <p class="mkt">Data centres by 2030</p>
    <p>Data centre electricity consumption is expected to more than double by 2030, reaching about
    945 TWh, with AI as the main driver.</p>
    <p class="mkso">International Energy Agency</p>
    <p class="arrow">→ Moving fewer bytes is spending less energy per query. Not a slogan: the same
    arithmetic, seen from the other side.</p>
  </div>

</div>
</section>
::

## Open under AGPL-3.0. And there is a version that is not published.

The edition on this site is the complete, auditable one: the whole core, the `.s2r`
format, the SIMD predicates, the analytics layer, the ports and the 31 test suites.
It is free to use, study, modify and redistribute — under **AGPL-3.0-or-later**,
which means everything you build on top, **including software offered over a
network**, is released under the same licence.

That clause is not a trap: it is what makes it possible to publish a complete,
auditable, citable edition without giving up the commercial right. If what you build
is not published under AGPL — software sold to customers, SaaS, firmware, a device —
then it is a commercial licence, and it is a short conversation.

::html
<div class="cards">
  <div class="card"><h3>Open · AGPL-3.0-or-later</h3>
    <p>Everything on this site, nothing held back. Research, study, evaluation and internal tools
    almost always stop here.</p>
    <a class="more" href="/license/">Does AGPL affect you? →</a></div>
  <div class="card"><h3>Commercial</h3>
    <p>The right to embed it in software you do not publish under AGPL, plus support and priority
    on fixes.</p>
    <a class="more" href="/license/">How it works →</a></div>
  <div class="card"><h3>Smart2Raw Premium</h3>
    <p>The edition that is not published. It goes beyond what the smallest native class reaches on
    its own, and answers composite and multi-column questions.</p>
    <a class="more" href="/premium/">What it adds →</a></div>
</div>
::

::html
<p class="cred"><b>31</b> test suites, 0 failures <span>·</span> <b>100,950</b> differential fuzz
checks with fixed seeds <span>·</span> <b>6</b> versions deposited with their own DOI
<span>·</span> <b>2</b> defects found and published with the minimal case that reproduces each</p>
::

## Why everything on this page can be checked

The demonstration above is not an imitation written in JavaScript. It is
`include/smart2raw.h` itself, compiled to WebAssembly and running in your browser.
When it reports a size, the answer came from `s2r_pool_bytes()`; when it offers a
`.s2r` to download, those bytes were written by `s2r_blocked_save()`.

And every number that can be checked against a naive loop is checked, before it is
printed. A disagreement lights a red badge instead of printing a pretty number.

::html
<section class="next">
<h2>Where to go next</h2>
<div class="cards">
  <div class="card"><h3>Write the three lines</h3>
    <p>One header, no build system, no configuration. Or download the single-file demonstration
    and run it with no internet.</p>
    <a class="more" href="/start/">Get started →</a></div>
  <div class="card"><h3>See where it loses</h3>
    <p>The smallest native class is 8 bits, and that has a price. The scope page says what it is,
    with the number.</p>
    <a class="more" href="/scope/">Technical scope →</a></div>
  <div class="card"><h3>Talk to the person who wrote it</h3>
    <p>Commercial licence, evaluation with your data, investment — or a defect, which is always
    welcome.</p>
    <a class="more" href="/contact/">Contact →</a></div>
</div>
</section>
::
