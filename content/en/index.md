---
title: Smart2Raw — the server you don't have to buy
description: Integer columns stored in the smallest native class their real range needs — up to 8× fewer bytes, with no decode step, because the stored bytes are native integers. Try it on your own data, in your browser.
---

::html
<section class="hero">
  <p class="slogan">The intelligence is in the classification. What comes out is raw bytes.</p>
  <h1>The server you don't have to buy.</h1>
  <p class="lead">Your integer column is 8 bytes wide because nobody asked how big it really
  is. Smart2Raw asks. It measures the real range and stores the column in the smallest native
  class that range needs — 8, 16, 32 or 64 bits, signed or not. No dictionary, no bit-packing,
  no decode step: the stored bytes <em>are</em> native integers, so every operation runs on
  them directly.</p>
  <p class="qual">Up to 8× fewer bytes on the same machine, when the column's range allows it —
  and the same machine then holds 8× the working set. The demonstration below measures that on
  <b>your</b> data, in your own browser, in about 30 seconds.</p>
  <div class="cta">
    <a class="btn" href="#s2rdemo">Try it on your own column</a>
    <a class="btn ghost" href="/start/">Get started</a>
    <a class="btn ghost" href="https://github.com/carlostbastos/Smart2Raw">GitHub</a>
  </div>
  <div class="kpis">
    <div class="kpi"><b>8×</b><small>smaller than int64 on a telemetry column of 0..200 — measured, and reproducible below</small></div>
    <div class="kpi"><b>0</b><small>dependencies. One header, C11, no build system</small></div>
    <div class="kpi"><b>31</b><small>test suites, 0 failures — real x86, ARM and big-endian, with RVV and SVE2 swept across vector lengths</small></div>
    <div class="kpi"><b>6</b><small>versions deposited with a citable DOI, stamped by a third party</small></div>
  </div>
</section>
::

::html
<section>
::

{{DEMO}}

::html
</section>
::

::html
<section class="why">
<h2>Why this matters now</h2>
<p class="whysub">These three numbers are not ours. They come from third parties, and each one
carries its source. The numbers we measure are above, and you reproduce every one of them right
here — we keep the two apart on purpose.</p>
<div class="mk">

  <div class="mkc">
    <p class="mkn">3.0× <i>against</i> 1.6×</p>
    <p class="mkt">The bottleneck stopped being arithmetic</p>
    <p>Over 20 years, peak hardware compute grew 3.0× every 2 years. DRAM bandwidth grew 1.6×;
    interconnect bandwidth, 1.4×. The gap widens every year.</p>
    <p class="mkso">IEEE Micro · <a href="https://arxiv.org/abs/2403.14123">arXiv:2403.14123</a></p>
    <p class="arrow">→ Adding FLOPs stopped fixing it. Reading fewer bytes, with no decode step
    to pay for, attacks exactly the side that got narrow.</p>
  </div>

  <div class="mkc">
    <p class="mkn">+58% to 63%</p>
    <p class="mkt">In a single quarter</p>
    <p>That is how much DRAM contract prices rose in Q2 2026, in the worst supply shortage in
    nearly 15 years. A single AI server uses 8 to 10 times the memory of a conventional one.</p>
    <p class="mkso">TrendForce, April 2026</p>
    <p class="arrow">→ A byte you never store is money you never spend — and memory left over
    for something else.</p>
  </div>

  <div class="mkc">
    <p class="mkn">945 TWh</p>
    <p class="mkt">Data centres in 2030</p>
    <p>Global data centre electricity demand is projected to more than double by 2030, reaching
    around 945 TWh, with AI as the main driver.</p>
    <p class="mkso">International Energy Agency</p>
    <p class="arrow">→ Moving fewer bytes is spending less energy per query. That is not a
    slogan: it is the same arithmetic, seen from the other side.</p>
  </div>

</div>
<p class="note">A library that asks you to trust a measurement should be the first to say which
numbers are its own. Ours are above, and reproducible. These are other people's, and linked.</p>
</section>
::

## Where it fits

Every one of these already has an integer column in it. That is the whole
addressable surface.

::html
<div class="cards">
  <div class="card"><h3>Databases and columnar engines</h3>
    <p>Ids, codes, dates, counters. The stored bytes are already native integers — no decode
    step, no materialisation, no dictionary resident in memory.</p></div>
  <div class="card"><h3>Operating systems and Linux</h3>
    <p><code>/proc</code> counters, eBPF metrics, PIDs, inodes, uids, log timestamps. One header,
    C11, zero dependencies: it fits inside a daemon or an agent without dragging a library in.</p></div>
  <div class="card"><h3>Observability, IoT, telemetry</h3>
    <p>Fixed-interval time series, sensors, counters. This is where the common stride and the
    per-block frame of reference work together.</p></div>
  <div class="card"><h3>AI and machine learning</h3>
    <p>Token ids, vocabulary indices, feature ids, dataset offsets, neighbour lists from a vector
    index. Inference is bound by memory bandwidth, not FLOPs — reading fewer bytes with no decode
    cost is the currency that is missing.</p></div>
  <div class="card"><h3>Embedded, MCU, edge, automotive</h3>
    <p>Any reading buffer. The lean mode is already tested: no stdio, no mmap, no SIMD.</p></div>
  <div class="card"><h3>Financial market data</h3>
    <p>Prices in cents (a stride!), nanosecond timestamps, instrument ids. Tick data is the
    picture of the ideal case.</p></div>
  <div class="card"><h3>Developer tooling</h3>
    <p>Symbol tables, offsets, indices in compilers, linkers and binary formats. A single header
    drops into any build.</p></div>
</div>
::

## Why you can check every claim on this page

The demonstration above is not a JavaScript imitation of Smart2Raw. It is
`include/smart2raw.h` itself, compiled to WebAssembly and running in your
browser. When it reports a size, `s2r_pool_bytes()` answered. When it offers a
`.s2r` to download, `s2r_blocked_save()` wrote those bytes — the page only
swapped the disk for a block of memory.

And every number it can check against a naive loop, it checks: every value is
read back and compared to the original, the block metadata's sum is compared to
a plain sum, and the file is written, reopened, CRC-verified and compared again
before the download button appears. A disagreement raises a red badge instead of
printing a pretty number.

::html
<div class="cards" style="margin-top:22px">
  <div class="card"><h3>Deposited and citable</h3>
    <p>Six versions with their own DOI on Zenodo, with a concept DOI covering all of them.
    <a href="/cite/">How to cite</a>.</p></div>
  <div class="card"><h3>Open, under AGPL-3.0</h3>
    <p>The published version is free software. Building it into a closed product needs a
    <a href="/license/">commercial licence</a> — which is also how you reach
    <a href="/premium/">Smart2Raw Premium</a>, the version that is not published.</p></div>
  <div class="card"><h3>Portable by construction</h3>
    <p>The same file runs on x86, ARM with NEON and SVE2, RISC-V with RVV, big-endian machines
    and microcontrollers — and now in WebAssembly and in a Windows executable with no CRT.</p></div>
</div>
::
