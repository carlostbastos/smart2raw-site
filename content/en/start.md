---
title: Get started with Smart2Raw — one header, three lines
description: Copy one header into your project and classify a column in three lines of C. Downloads for the library, the single-file browser demo and a dependency-free Windows executable.
---

# Get started

There is nothing to install. Smart2Raw is a single C11 header with no
dependencies, no build system and no configuration.

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
    <a class="more" href="https://doi.org/10.5281/zenodo.21623772">Zenodo, version 3.5.0 →</a></div>
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

## Licence

The published version is under **AGPL-3.0-or-later**. If you plan to build it
into something you do not publish under the same licence, that needs a
[commercial licence](/license/) — which is also how you reach the advanced
version.
