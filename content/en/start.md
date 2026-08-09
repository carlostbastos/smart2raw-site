---
title: Get started with Smart2Raw — one header, three lines
description: Copy one header into your project and classify a column in three lines of C. Downloads for the library, the single-file browser demo and a dependency-free Windows executable.
---

::html
<section class="hero">
  <p class="slogan">The install step is copying one file.</p>
  <h1>Get started</h1>
  <p class="lead">There is nothing to install. Smart2Raw is a single C11 header with no dependencies, no build system and no configuration.</p>
  <p class="qual">Copy the header into your project and classify a column in three lines of C. If you would rather not write code yet, there is a single-file demonstration and a Windows executable with no installer, both just below.</p>
  <div class="cta">
    <a class="btn" href="https://github.com/carlostbastos/Smart2Raw">Download from GitHub</a>
    <a class="btn ghost" href="/assets/smart2raw-live-en.html" download>The demonstration in one file</a>
    <a class="btn ghost" href="/assets/s2r-probe.exe" download>Windows executable</a>
  </div>
  <div class="kpis">
    <div class="kpi"><b>1</b><small>file: smart2raw.h, C11, no build system and no configuration</small></div>
    <div class="kpi"><b>3</b><small>lines to classify, store and operate</small></div>
    <div class="kpi"><b>0</b><small>dependencies — neither to compile nor at runtime</small></div>
    <div class="kpi"><b>4</b><small>targets with the suite passing on real hardware — x86-64, ARM64 with NEON, big-endian and microcontroller. RVV and SVE2 are experimental</small></div>
  </div>
</section>
::

## Three lines

```c
#include "smart2raw.h"

S2RPool p;
s2r_pool_init(&p, s2r_classify_array(values, n), n);   /* 1. classify */
for (size_t i = 0; i < n; i++) s2r_push(&p, values[i]); /* 2. store    */
size_t k = s2r_count_gt_fast(&p, 100);                  /* 3. operate  */
```

Compile with anything:

```sh
cc -O2 -std=c11 -I include your_program.c -o your_program
```

## Let the library choose the shape

The obvious entry point is not always the right one. On 4 million timestamps the
flat pool is 15.26 MB and 0.73 ms where the block-wise form is 4.11 MB and
0.04 ms — so ask before deciding:

```c
S2RAdvice a;
s2r_recommend(values, n, &a);
printf("best: %s, %zu bytes (baseline %zu)\n", a.best, a.best_bytes, a.raw_bytes);
```

## Save and load

```c
S2RBlocked b;
s2r_blocked_build_auto(&b, values, n);   /* block size is planned, not guessed */
s2r_blocked_save(&b, "column.s2r");
```

The file is canonical little-endian with a CRC32, so it is identical on any host
and a corrupted byte is caught on load rather than returned as data.

## Downloads

::html
<div class="cards">
  <div class="card"><h3>The library</h3>
    <p>Source, 31 test suites, benchmarks, examples and language bindings.</p>
    <a class="more" href="https://github.com/carlostbastos/Smart2Raw">GitHub →</a><br>
    <a class="more" href="https://doi.org/10.5281/zenodo.21676456">Zenodo, DOI for 3.5.1 →</a></div>
  <div class="card"><h3>The demo, as a single file</h3>
    <p>The whole library as WebAssembly inside one HTML file. Works offline, over
    <code>file://</code>, with no server. Nothing you paste into it leaves your machine.</p>
    <a class="more" href="/assets/smart2raw-live-en.html" download>smart2raw-live-en.html →</a></div>
  <div class="card"><h3>Windows executable</h3>
    <p>A console probe with no CRT, no runtime DLL and no installer — twelve
    <code>kernel32</code> imports and nothing else. Point it at a CSV column.</p>
    <a class="more" href="/assets/s2r-probe.exe" download>s2r-probe.exe →</a></div>
</div>
::

```
s2r-probe.exe data.csv --column 3 --save column.s2r
```

It prints the class chosen, the size against `int64` and against dictionary, RLE
and bitmap, the timed query, and exits with status 0 only when every internal
check passed.

## Where it runs

The same file, with the same tests passing: x86-64 with SSE2 and AVX2, ARM with
NEON and SVE2, RISC-V with RVV, big-endian machines, and microcontrollers in lean
mode (`-DS2R_NO_STDIO -DS2R_NO_MMAP -DS2R_NO_SIMD`). And, as of this site, in
WebAssembly and in a Windows PE linked without a C runtime.

It is worth saying how each one is verified, because they are not the same.
**ARM64 and big-endian are repeated on real machines by CI**, through QEMU, on
every commit. The **RVV and SVE2 kernels run for real** — the vector code that
ships, not a reimplementation — checked element by element against a scalar
reference, with the **vector length swept from 128 to 1024 bits** and the
strip-mine boundaries and tails exercised explicitly. A real board would have
given one length; the sweep covers the whole family, which is exactly what a
length-agnostic kernel has to prove.

## Licence

The published version is under **AGPL-3.0-or-later**. If you plan to build it
into something you do not publish under the same licence, that needs a
[commercial licence](/license/) — which is also how you reach the advanced
version.

::html
<section class="next">
<h2>Where to go next</h2>
<div class="cards">
  <div class="card"><h3>Understand what just ran</h3>
    <p>The three steps, and why there is no decoding in the middle.</p>
    <a class="more" href="/how-it-works/">How it works →</a></div>
  <div class="card"><h3>Compare with your current format</h3>
    <p>The same column in seven formats, with the command for each row.</p>
    <a class="more" href="/benchmarks/">Performance →</a></div>
  <div class="card"><h3>Before you embed it in a product</h3>
    <p>The published version is AGPL. A closed product is a different conversation.</p>
    <a class="more" href="/license/">Licensing →</a></div>
</div>
</section>
::
