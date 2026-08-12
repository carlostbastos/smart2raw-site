---
title: How Smart2Raw works — classification, not compression
description: Measure the real range, pick the smallest native class that holds it, operate on the stored bytes. No dictionary, no bit-packing, no decode step.
---

::html
<section class="hero">
  <p class="slogan">Your data does not become something else.</p>
  <h1>How it works</h1>
  <p class="lead">Smart2Raw is not a compressor. A compressor turns your data into something else and hands it back when you ask. Smart2Raw does the opposite: it decides, once, how wide the data actually needs to be — and then leaves it alone.</p>
  <p class="qual">Three steps: measure the real range, pick the smallest native class that holds it, and operate directly on the stored bytes. The third one is what separates the approach from everything that encodes — there is no decode step to pay for.</p>
  <div class="cta">
    <a class="btn" href="/#s2rdemo">See it run in your browser</a>
    <a class="btn ghost" href="/start/">Get started</a>
    <a class="btn ghost" href="/scope/">Technical scope</a>
  </div>
  <div class="kpis">
    <div class="kpi"><b>3</b><small>steps: measure the range, store in the native class, operate without materialising</small></div>
    <div class="kpi"><b>3</b><small>shapes — flat pool, affine and block-wise — chosen by measurement, not by guess</small></div>
    <div class="kpi"><b>3.8 MB</b><small>4 million elements between 0 and 200 that took 30.5 MB — no dictionary and no bit packing</small></div>
    <div class="kpi"><b>0</b><small>decode steps: the stored bytes are native integers</small></div>
  </div>
</section>
::

## Step 1 · Measure the real range

An `int64` column is 8 bytes per element whether it holds nanosecond timestamps
or a sensor reading between 0 and 200. The first thing the library does is look:

```c
int8_t cls = s2r_classify_array(values, n);   /* one pass, no allocation */
```

For 0..200 the answer is `S2R_8`. For −500..500 it is `S2R_I16`. The class is
the *width in bits*, and its sign is the *signedness* — so `abs(size) >> 3` is
the number of bytes per element and `size < 0` means signed. That one trick
removes a whole table from the library.

## Step 2 · Store in that class, natively

```c
S2RPool p;
s2r_pool_init(&p, cls, n);
for (size_t i = 0; i < n; i++) s2r_push(&p, values[i]);
```

The elements are now `uint8_t` in memory. Not "8-bit codes" — actual `uint8_t`.
A column of 0..200 with 4 million elements goes from 30.5 MB to 3.8 MB, and the
bytes at `p.data` are an array a C compiler already knows how to read.

## Step 3 · Operate without materialising

This is the part that separates the approach from dictionary encoding. Because
the stored bytes are native integers, a predicate runs on them **as they are**:

```c
size_t k = s2r_count_gt_fast(&p, 100);
```

There is no decode step, no dictionary lookup, no intermediate buffer. That has
two consequences, and both are measured.

**The first is width.** A 512-bit register carries **64 `u8` values per
instruction against 8 `int64` values**. The narrow class is not a cost paid at
read time: it is what unlocks vectorisation. Measured, signed `count_gt` on `i8`
goes from 1402 to 18833 Mval/s — **13.4×** — and the `u8` sum through `vpsadbw`
lands between 2.8× and 10×, depending on whether the data fits in cache.

**The second is what stops happening.** Compare against a peer that occupies
practically the same space — 11.44 MB against 11.45 MB — so the bytes drop out of
the comparison and only processing is left. `SUM` comes out at **0.44 ms against
7.52 ms**, 17×, because a dictionary code is not an operand you can add: the codes
have to be histogrammed and the dictionary folded on top. And reaching a kernel
that is not SQL — a quantised dot product, a convolution, an int8 matmul — costs
**7.9 ms of materialisation** on the peer's side and **zero** on ours, because the
pool already *is* the contiguous native-width buffer that kernel requires.

Reading one quarter of the bytes means one quarter of the memory traffic, and
memory traffic is what a scan costs. But the larger win is usually the second one:
the buffer that never had to exist.

## Three shapes, chosen by measurement

| shape | what it does | when it wins |
|---|---|---|
| **flat pool** | every element in the smallest class that fits the whole column | uniform columns; the default entry point |
| **affine** | `v = base + stride·i` — the common step is divided out, exactly | fixed sampling intervals, fixed-point money, quantisation steps |
| **block-wise** | each block is stored relative to its own minimum, with metadata that answers queries without touching the payload | time-partitioned data, anything where local range is much narrower than global range |

`s2r_recommend()` measures all three and tells you which one your column wants —
because the obvious entry point is often the worst one. And
`s2r_blocked_plan()` prices every candidate block size from a **single pass**
over the data, so the block size is classified rather than guessed.

## Why it can never expand your data

Every classical alternative has a regime where the output is larger than the
input. Dictionary encoding of a high-cardinality column stores a dictionary the
size of the data. RLE on unordered data stores one run per value. A bitmap only
exists when there are two distinct values.

Smart2Raw classifies by **range**, and the widest class it has *is* the `int64`
input. So its worst case is "the range needs 64 bits", which is exactly the
baseline. This is not luck or tuning — it is a structural consequence of the
design, and `benchmarks/format_matrix.c` asserts the bound before printing each
row.

## The `.s2r` file

A serialised column is a small, fixed header followed by the payload, in
canonical little-endian so the bytes are identical on any host, with a CRC32 at
the end.

| `fmt` | what it is |
|---|---|
| 1 | flat pool |
| 2 | block-wise |
| 3 | block-wise with a per-block stride |

Format 3 is emitted **only** when some block actually has a stride above 1, so a
column with no common step is byte-for-byte the file version 3.4.0 wrote — and a
3.4.0 build opens it. When a stride is present, the file is `fmt = 3` and older
builds correctly refuse it rather than misreading it.

::html
<section class="next">
<h2>Where to go next</h2>
<div class="cards">
  <div class="card"><h3>See the numbers</h3>
    <p>The same column in seven formats, and the query timings.</p>
    <a class="more" href="/benchmarks/">Performance →</a></div>
  <div class="card"><h3>Where the trade is</h3>
    <p>The smallest native class is 8 bits. Everything that buys, and what it costs.</p>
    <a class="more" href="/scope/">Technical scope →</a></div>
  <div class="card"><h3>Write the three lines</h3>
    <p>One header, no build system, no configuration.</p>
    <a class="more" href="/start/">Get started →</a></div>
</div>
</section>
::
