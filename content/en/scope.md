---
title: Technical scope — what Smart2Raw is, and where the trade is
description: The design decision behind the library stated plainly: the smallest native class is 8 bits, and everything the approach buys follows from that.
---

::html
<section class="hero">
  <p class="slogan">Where the trade is.</p>
  <h1>Technical scope</h1>
  <p class="lead">This page exists for the engineer who is going to test the library against their own data and wants to know, in advance, exactly what they are choosing. Nothing here contradicts the rest of the site — it states the same design decision from the other side.</p>
  <p class="qual">Here is the single trade, said plainly and with the number that measures it — and the limits worth declaring before you find them on your own.</p>
  <div class="cta">
    <a class="btn" href="/benchmarks/">The full numbers</a>
    <a class="btn ghost" href="/how-it-works/">How it works</a>
    <a class="btn ghost" href="https://github.com/carlostbastos/Smart2Raw">The code</a>
  </div>
  <div class="kpis">
    <div class="kpi"><b>8 bits</b><small>the smallest native class. The whole trade comes from here, and it is a decision, not an oversight</small></div>
    <div class="kpi"><b>1.91 MB</b><small>the dictionary, against Smart2Raw&#8217;s 3.82 MB: where it wins, and it is a factor of two</small></div>
    <div class="kpi"><b>41.01 MB</b><small>the same dictionary, against a 30.52 MB baseline: where it expands the column</small></div>
    <div class="kpi"><b>7.9 ms</b><small>of materialisation the dictionary pays on every scan and Smart2Raw does not</small></div>
  </div>
</section>
::

## What it is

A **classifier**, not a compressor. It measures the real range of an integer
column, stores it in the smallest native class that range needs — 8, 16, 32 or
64 bits, signed or not — and then leaves the bytes alone so every operation runs
on them directly.

Three shapes follow from that: the flat pool, the affine form
(`v = base + stride·i`, with the stride found by gcd), and the block-wise form
(each block relative to its own minimum, with metadata that answers queries
without touching the payload). `s2r_recommend()` measures all three;
`s2r_blocked_plan()` prices every candidate block size from a single pass.

## The one trade, stated plainly

**The smallest native class is 8 bits.** There is no 4-bit class, no 3-bit class,
no bit packing. So on a column with few distinct values spread over a wide range
— say 12 distinct values — a dictionary with 4-bit codes stores less. Measured on
4 million elements: dictionary 1.91 MB against 3.82 MB. That is a factor of two,
and it is real.

That absence is the decision, not an oversight. Sub-byte codes are what force a
decode step, and the decode step is what the whole approach exists to remove.
Keeping the class at 8 bits is what makes the stored bytes an array the processor
already knows how to read: no materialisation, no dictionary resident in memory,
no per-value indirection. On the same benchmark, materialising the dictionary
column costs 7.9 ms that Smart2Raw does not pay at all.

Where the range is wide — which is most real data — the comparison inverts, and
the dictionary is the one that grows: 41.01 MB against a 30.52 MB baseline on a
high-cardinality column.

## What it will not do to your data

- **It will not expand it.** The widest class is the `int64` input, so the worst
  case ties the baseline. `benchmarks/format_matrix.c` asserts the bound before
  printing each row.
- **It will not approximate it.** No rounding, no quantisation, no calibration.
  The class comes from the real range and every value comes back exactly.
- **It will not silently corrupt it.** A `.s2r` file carries a CRC32 and is
  checked on load; a class too narrow for a value is an error, not a truncation.

## Versions and file compatibility

| version | DOI | note |
|---|---|---|
| 3.5.1 | deposit in progress | **current** — security fix in the block-wise reader |
| 3.5.0 | [10.5281/zenodo.21623772](https://doi.org/10.5281/zenodo.21623772) | **a hostile `.s2r` could write outside the heap** — upgrade |
| 3.4.0 | [10.5281/zenodo.21614309](https://doi.org/10.5281/zenodo.21614309) | **silent corruption on unsigned columns above 2^63** — upgrade |
| all versions | [10.5281/zenodo.20477234](https://doi.org/10.5281/zenodo.20477234) | concept DOI |

A column with no common stride is written by 3.5.0 **byte for byte** as 3.4.0
wrote it, and opens in 3.4.0. A column with a stride is `fmt = 3`, and 3.4.0
correctly refuses it instead of misreading it. Both directions were measured, not
assumed. 3.5.1 does not touch a single byte of the format: it only started
refusing files 3.5.0 accepted and should not have.

## The 3.5.0 defect, and what it took

The block-wise reader sized the body it was about to read as
`nblocks × metadata + bytes`. **Both** terms come off disk, and the sum was done
in plain `size_t`. A file that declares `nblocks = 2^22` and a `bytes` near 2^64
makes that sum **wrap** to 16: the reader allocates sixteen bytes and copies four
megabytes into them.

That file is 64 bytes long and passes **every** validation that already existed —
magic, `fmt`, all four classes, `nblocks == ceil(count/block)`, every field inside
its limit, **a correct CRC32 over the real body**, and exact EOF. There is nothing
malformed in it. Accidental corruption breaks the CRC; deliberate corruption
comes with the right one, and that was exactly the difference left unseen.

**Who was affected:** only callers of `s2r_blocked_load()` on a file they did not
write. Writing was never affected — there both terms describe a structure that
already exists in memory. And the flat pool was never affected: it has done
`count > SIZE_MAX/eb` since 3.3. It was one place in the family of readers that
was missing the guard its siblings had.

3.5.1 closes it with two locks: the arithmetic is now checked, and the declared
body has to fit in the file. The hostile file became a permanent test — against
the 3.5.0 header it aborts under AddressSanitizer; against 3.5.1 it passes,
alongside an honest file that still loads and still sums correctly, because a
guard that also rejects real data is not a fix.

## Known limits worth stating

- **Boolean columns.** One bit of information stored in one byte. A bitmap is 8×
  smaller and popcount answers it about 17× faster. If your column is a flag,
  use a bitmap.
- **`S2R_BLOCK_DEFAULT` is a default, not an optimum.** It is beaten on two of
  three measured shapes. Use `s2r_blocked_build_auto()`, which plans instead of
  guessing.
- **`fit_class()` does not change signedness.** A column declared signed that
  never receives a negative stays twice as wide as it needs — that is what the
  separate `s2r_fit_class_signedness()` is for, and after healing a negative push
  is refused.
- **A browser measures what a browser measures.** For numbers comparable to a
  server, use the C benchmarks in the repository.

## The advanced version

What is published here is the open version, under AGPL-3.0-or-later. There is a
more advanced version that is not published — see [Smart2Raw Premium](/premium/),
reached through the [commercial licence](/license/).

::html
<section class="next">
<h2>Where to go next</h2>
<div class="cards">
  <div class="card"><h3>Check it yourself</h3>
    <p>Every number on this page comes out of a program in the repository.</p>
    <a class="more" href="/benchmarks/">Performance →</a></div>
  <div class="card"><h3>Where the open edition stops on purpose</h3>
    <p>That is exactly where the licensed one begins.</p>
    <a class="more" href="/premium/">Smart2Raw Premium →</a></div>
  <div class="card"><h3>Test with your data</h3>
    <p>The demonstration runs the real library, in your browser.</p>
    <a class="more" href="/#s2rdemo">Go to the demonstration →</a></div>
</div>
</section>
::
