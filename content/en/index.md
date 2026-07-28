---
title: Smart2Raw — classify once, operate forever in the smallest native format
description: A header-only C library that stores integer columns in the smallest native class their real range needs, keeping the bytes directly executable. Try it on your own data, in your browser.
---

::html
<section class="hero">
  <p class="slogan">The intelligence is in the classification. What comes out is raw bytes.</p>
  <h1>Your integer column is 8 bytes wide because nobody asked how big it really is.</h1>
  <p class="lead">Smart2Raw asks. It measures the real range of a column and stores it in the
  smallest native integer class that range needs — 8, 16, 32 or 64 bits, signed or not. No
  dictionary, no bit-packing, no decode step: the stored bytes <em>are</em> native integers,
  so every operation runs on them directly.</p>
  <div class="cta">
    <a class="btn" href="#s2rdemo">Try it on your own column</a>
    <a class="btn ghost" href="/start/">Get started</a>
    <a class="btn ghost" href="https://github.com/carlostbastos/Smart2Raw">GitHub</a>
  </div>
  <div class="kpis">
    <div class="kpi"><b>8×</b><small>smaller than int64 on a telemetry column of 0..200 — measured, and reproducible below</small></div>
    <div class="kpi"><b>0</b><small>dependencies. One header, C11, no build system</small></div>
    <div class="kpi"><b>31</b><small>test suites, 0 failures, on x86, ARM, RISC-V and big-endian</small></div>
    <div class="kpi"><b>3</b><small>versions deposited with a citable DOI</small></div>
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
    <p>Three versions with their own DOI on Zenodo, with a concept DOI covering all of them.
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
