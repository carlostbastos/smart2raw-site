---
title: Where Smart2Raw fits — databases, operating systems, telemetry, AI, embedded
description: Every one of these systems already has an integer column inside it. Seven places where classifying by range and keeping the bytes native changes what the system costs to run.
---

::html
<section class="hero">
  <p class="slogan">Every system on this list already has an integer column inside it.</p>
  <h1>Where it fits</h1>
  <p class="lead">The question is always the same one: <strong>where is the integer column?</strong> Once you start looking, it is almost everywhere — and almost always eight bytes wide because nobody measured it. Each section below says three things: the column that already exists in that system, what changes when it is classified, and where to start.</p>
  <p class="qual">Seven areas, and the list is not exhaustive — it is just where the column is easiest to find. If yours is not here, the test is the same: paste the column into the demonstration and see which class it asks for.</p>
  <div class="cta">
    <a class="btn" href="/#s2rdemo">Test with your column</a>
    <a class="btn ghost" href="/how-it-works/">How it works</a>
    <a class="btn ghost" href="/benchmarks/">Performance</a>
  </div>
  <div class="kpis">
    <div class="kpi"><b>7</b><small>areas where the integer column is already there, eight bytes wide, because nobody measured</small></div>
    <div class="kpi"><b>8×</b><small>fewer bytes on a 0..200 telemetry column — 30.52 MB becomes 3.81 MB</small></div>
    <div class="kpi"><b>4.11 MB</b><small>against 15.26 MB on 4 million timestamps: the right shape against the obvious one</small></div>
    <div class="kpi"><b>0</b><small>dependencies. One C11 header drops into a daemon, into firmware, into someone else's build</small></div>
  </div>
</section>
::

## Databases and columnar engines

**The column that is already there.** Primary keys, foreign keys, status codes,
enum ordinals, dates as day numbers, counters, partition ids. In a columnar
layout the column *is* the unit of storage, so this is the most direct fit there
is.

**What changes.** Columnar engines already encode integers — dictionary, bit
packing, delta. What they all share is a **decode step**: the bytes on disk are
not the values, so something has to reconstruct them before a predicate can run.
Smart2Raw removes that step by construction. A `uint8_t` column is an array of
`uint8_t`, so `count_gt` walks it directly and a scan costs exactly the memory
traffic of the narrower type — no materialisation buffer, no dictionary resident
in RAM, no per-value indirection.

The second thing that changes is the tail. Every classical encoding has a shape
where it grows the input: measured on 4 million elements, dictionary encoding of
a high-cardinality timestamp column produces **41.01 MB against a 30.52 MB
`int64` baseline**. Smart2Raw's worst case is equal to the baseline, never above.

**Where to start.** The hot column of one table. Classify it, keep the pool
resident, and run your heaviest predicate against both paths — the answers have
to match, and the demonstration on the home page does exactly that comparison for
you before you write any code.

## Operating systems and Linux

**The column that is already there.** `/proc` counters, eBPF map values, PIDs,
inodes, uids and gids, socket and file-descriptor tables, log timestamps, syscall
counts. Every one of them is an integer with a range far narrower than the 64
bits it is carried in.

**What changes.** The constraint in system software is rarely raw speed — it is
what you are allowed to link against. An agent that ships into somebody else's
machine cannot drag a compression library, a runtime and a build system with it.
Smart2Raw is **one C11 header with no dependencies**, and it has a lean mode
(`-DS2R_NO_STDIO -DS2R_NO_MMAP -DS2R_NO_SIMD`) that compiles where there is
almost nothing.

**Where to start.** A metrics buffer inside a daemon. Copy the header in, replace
the `uint64_t*` ring with a classified pool, and measure the resident set.

## Observability, IoT and telemetry

**The column that is already there.** Fixed-interval time series: a timestamp
every 60 seconds, a sensor sampled at a fixed rate, monotonic counters, device
ids, status enums.

**What changes.** This is the shape where two independent mechanisms stack. A
timestamp column sampled every 60 s has a **common stride**, so
`v = base + 60·i` and the stride divides out exactly — not by approximation, by
gcd. And local range is far narrower than global range, so the block-wise form
stores each block relative to its own minimum. Measured on 4 million timestamps:
the naive flat pool is **15.26 MB and 0.73 ms**; the block-wise form is
**4.11 MB and 0.04 ms**.

There is a third gain that matters more in practice than either: when a block's
metadata already decides the whole block, the payload is never read at all. On a
column that stops at 200, `count_gt(220)` goes from **0.1435 ms to 0.000034 ms** —
because nothing had to be looked at.

**Where to start.** Your retention window. Take one day of one metric, run
`s2r_recommend()`, and compare against what you store today.

## AI and machine learning

**The column that is already there.** Token ids and vocabulary indices, feature
ids in a sparse feature store, dataset and shard offsets, neighbour lists coming
out of a vector index, label arrays, attention and cache bookkeeping. These are
integer arrays with a known, usually narrow range — a 50,000-token vocabulary
needs 16 bits, not 64.

**What changes.** Modern inference is bound by **memory bandwidth**, not by
arithmetic. That is why quantisation works at all. Smart2Raw applies the same
logic to the integer side of the pipeline, with one property quantisation does
not have: it is **exact**. There is no approximation and no calibration, because
the class is chosen from the real range and nothing is rounded. And because the
stored bytes are native integers, they feed straight into whatever reads them —
there is no dequantise step to pay on the way in.

**Where to start.** The token id arrays of a dataset, or the neighbour lists of a
vector index. Both are large, both are integers, both are almost always carried
as 64-bit.

## Embedded, MCU, edge and automotive

**The column that is already there.** Any reading buffer: ADC samples, CAN bus
values, counters, timers.

**What changes.** Memory is the budget, and the budget is fixed at design time.
Fitting four times as many samples in the same buffer is not an optimisation
there — it is a different product. And the constraint that usually kills a
library on a microcontroller does not apply here: no allocator required, no
stdio, no file system, no SIMD, no build system. The lean mode is not a claim, it
is one of the test suites.

**Where to start.** The sample buffer. Classify it once, at the range your sensor
actually produces.

## Financial market data

**The column that is already there.** Prices in cents — which is a stride of 1,
5 or 25 depending on the tick size. Nanosecond timestamps. Instrument ids.
Volumes. Order book levels.

**What changes.** Tick data is the picture of the ideal case: a strided price, a
strided timestamp, an id with a small range, and volumes far narrower than 64
bits. Measured on 12 million elements, a strided column goes from **22.89 MB and
1.033 ms to 11.44 MB and 0.468 ms** — half the space and half the time, from
dividing out a step that was already in the data.

**Where to start.** One instrument, one day. The stride is detected in a single
pass, so you find out in seconds whether your data has one.

## Developer tooling

**The column that is already there.** Symbol tables, string offsets, relocation
indices, line number tables, coverage counters, profiling samples — the interior
of every compiler, linker, debugger and binary format.

**What changes.** These are exactly the columns where the range is known at
design time and ignored anyway. And a single header with no dependencies drops
into a build that already has strong opinions about its own toolchain.

**Where to start.** The offset table of whatever format you already parse.

---

## What all seven have in common

::html
<div class="cards">
  <div class="card"><h3>The bytes stay executable</h3>
    <p>No decode step, no materialisation, no dictionary in memory. What is stored is what the
    processor reads.</p></div>
  <div class="card"><h3>It cannot expand your data</h3>
    <p>Classification is by range, and the widest class is the int64 input. The worst case ties
    with the baseline — it never exceeds it.</p></div>
  <div class="card"><h3>Nothing to install</h3>
    <p>One C11 header. No dependency, no build system, no configuration, and a lean mode for
    machines that have almost nothing.</p></div>
</div>
::

The fastest way to know whether your column is one of these is to
[paste it into the demonstration](/) — it runs in your browser, on your machine,
and nothing you paste leaves it.

::html
<section class="next">
<h2>Where to go next</h2>
<div class="cards">
  <div class="card"><h3>See the mechanism</h3>
    <p>The three shapes, and why there is no decode step.</p>
    <a class="more" href="/how-it-works/">How it works →</a></div>
  <div class="card"><h3>See the numbers</h3>
    <p>The same column in seven formats, with the command that reproduces each row.</p>
    <a class="more" href="/benchmarks/">Performance →</a></div>
  <div class="card"><h3>Test with your data</h3>
    <p>Paste a column into the demonstration. It runs in your browser and nothing leaves it.</p>
    <a class="more" href="/#s2rdemo">Go to the demonstration →</a></div>
</div>
</section>
::
