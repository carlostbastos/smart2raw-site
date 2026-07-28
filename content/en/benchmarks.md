---
title: Smart2Raw performance — measured numbers, with the command that reproduces them
description: The same column in every format, measured on 4 million elements, with an assertion checked before each row is printed. Plus the query timings, and how to run all of it yourself.
---

::html
<section class="hero">
  <p class="slogan">Measured, not estimated.</p>
  <h1>Performance</h1>
  <p class="lead">Every number on this page came out of a program in the repository, and every one of them can be reproduced by a command you can run. Where a number could be checked against a naive loop, the program checks it and aborts on a disagreement — a benchmark that prints a pretty number it cannot defend is worse than no benchmark.</p>
  <p class="qual">Seven column shapes, 4 million elements each, the query timings, and the command behind every table. Including the rows where Smart2Raw does not win — they are here for the same reason as the rest.</p>
  <div class="cta">
    <a class="btn" href="/#s2rdemo">Measure in your browser</a>
    <a class="btn ghost" href="https://github.com/carlostbastos/Smart2Raw">Run it yourself</a>
    <a class="btn ghost" href="/scope/">Technical scope</a>
  </div>
  <div class="kpis">
    <div class="kpi"><b>4231×</b><small>range counting on a u8 column with the cumulative index — two 2 KB reads</small></div>
    <div class="kpi"><b>0.000034 ms</b><small>count_gt(220) on a column that stops at 200: the zone summary answers without reading payload</small></div>
    <div class="kpi"><b>31</b><small>test suites, 0 failures, clean under ASan and UBSan</small></div>
    <div class="kpi"><b>100,950</b><small>differential fuzz checks against a naive reference, with fixed seeds</small></div>
  </div>
</section>
::

## The same column in every format

Seven column shapes, 4 million elements each, sizes in MB. `S2R` is the smallest
form the library can produce for that shape.

| column | int64 | S2R | dictionary | RLE | bitmap | S2R form |
|---|---:|---:|---:|---:|---:|---|
| A · uniform 0..200 (telemetry) | 30.52 | **3.81** | 3.82 | 30.37 | — | flat pool |
| B · 12 distinct values in 500..11500 | 30.52 | 3.82 | **1.91** | 27.97 | — | block-wise |
| C · the same, ORDERED | 30.52 | **0.06** | 1.91 | 0.00 | — | block-wise |
| D · boolean 0/1 | 30.52 | 3.81 | 0.48 | 15.26 | **0.48** | flat pool |
| E · timestamps every 60 s | 30.52 | **4.11** | 41.01 | 30.52 | — | block-wise |
| F · random u64 (maximum entropy) | 30.52 | **30.52** | 41.01 | 30.52 | — | flat pool |
| G · ids in 0..1e6 (high cardinality) | 30.52 | **15.26** | 17.03 | 30.52 | — | flat pool |

```sh
cc -O2 -std=c11 -I include benchmarks/format_matrix.c -o format_matrix
./format_matrix 4000000
```

The dictionary column is the **theoretical floor** of that format — codes of
`ceil(log2(k))` bits plus a dictionary of `k` values at 8 bytes, with no
implementation overhead added. It is the most generous number the format can
possibly produce.

**Read row E and row F.** On a high-cardinality column the dictionary is the size
of the data, and the total lands at 41.01 MB against a 30.52 MB baseline — the
format made the column larger than it was. RLE does the same on anything
unordered, one run per value. A bitmap only exists at all when there are exactly
two distinct values.

Smart2Raw has no such row, and not by tuning: it classifies by **range**, and its
widest class *is* the `int64` input. Row F is the proof — maximum entropy, and
the result ties the baseline exactly. `assert(s <= raw)` runs inside the loop
before each line is printed.

## Query timings

| what | before | after | where it comes from |
|---|---:|---:|---|
| `count_gt` on 8M ordered elements | 0.371 ms | below the clock | order is maintained, so binary search applies |
| `count_gt(220)` on a column ending at 200 | 0.1435 ms | 0.000034 ms | the zone summary answers without reading payload |
| range count on a `u8` column | — | **4231×** | the cumulative index: two reads from 2 KB that do not grow with the data |
| 12M elements with a stride | 22.89 MB / 1.033 ms | 11.44 MB / 0.468 ms | the common step is divided out, exactly |
| 4M timestamps, wrong shape vs right shape | 15.26 MB / 0.73 ms | 4.11 MB / 0.04 ms | `s2r_recommend()` picks the block-wise form |

The cumulative index pays for itself in **11 queries** and then costs nothing,
because 2 KB does not grow with the column. It also refuses to answer when it is
stale: the pool carries an epoch, every write bumps it, and the index records the
epoch it was built at.

## Measure it in your own browser

The demonstration on the [home page](/) times the same queries on your own data,
in your own browser, with warm-up and a varying argument so nothing can be
cached — and it prints the result of every path so you can see them agree.

It will also show you where the win in space does not become a win in time: on a
column small enough to sit in cache, reading a quarter of the bytes does not take
a quarter of the time. Raise the element count and the difference appears.

## How the whole thing is checked

- **31 test suites, 0 failures**, including a differential fuzz suite of 100,950
  checks against a naive reference, with fixed seeds.
- ASan and UBSan clean.
- The same code run on x86-64 with SSE2 and AVX2, ARM with NEON and SVE2, RISC-V
  with RVV, big-endian, and in lean mode with no stdio, no mmap and no SIMD.
- File compatibility measured in **both** directions between versions.

```sh
bash scripts/build_and_test.sh
```

That fuzz suite exists because of a real defect it found: an unsigned column
crossing 2^63 used to return truncated values in the block-wise layer, with no
error, no warning and a valid CRC. Twenty-five suites of chosen cases missed it.
It is fixed, and the minimal case `{1, UINT64_MAX}` is now a fixed test.

::html
<section class="next">
<h2>Where to go next</h2>
<div class="cards">
  <div class="card"><h3>Where the trade is</h3>
    <p>The regime where the dictionary wins, stated plainly, with the number.</p>
    <a class="more" href="/scope/">Technical scope →</a></div>
  <div class="card"><h3>Reproduce all of it</h3>
    <p>One clone and one command. The fuzz seeds are fixed on purpose.</p>
    <a class="more" href="/cite/">How to cite and reproduce →</a></div>
  <div class="card"><h3>Measure your data</h3>
    <p>The demonstration times the same queries on your column.</p>
    <a class="more" href="/#s2rdemo">Go to the demonstration →</a></div>
</div>
</section>
::
