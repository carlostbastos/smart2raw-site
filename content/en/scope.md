---
title: Technical scope — what Smart2Raw is, and where the trade is
description: The design decision behind the library stated plainly: the smallest native class is 8 bits, and everything the approach buys follows from that.
---

# Technical scope

This page exists for the engineer who is going to test the library against their
own data and wants to know, in advance, exactly what they are choosing. Nothing
here contradicts the rest of the site — it states the same design decision from
the other side.

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
| 3.5.0 | [10.5281/zenodo.21623772](https://doi.org/10.5281/zenodo.21623772) | current — affine factoring, planner, cumulative index |
| 3.4.0 | [10.5281/zenodo.21614309](https://doi.org/10.5281/zenodo.21614309) | **has a silent-corruption defect on unsigned columns above 2^63** — upgrade |
| all versions | [10.5281/zenodo.20477234](https://doi.org/10.5281/zenodo.20477234) | concept DOI |

A column with no common stride is written by 3.5.0 **byte for byte** as 3.4.0
wrote it, and opens in 3.4.0. A column with a stride is `fmt = 3`, and 3.4.0
correctly refuses it instead of misreading it. Both directions were measured, not
assumed.

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
