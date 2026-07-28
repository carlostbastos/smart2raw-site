---
title: Investment and partnership — Smart2Raw
description: An integer column costs eight bytes per element because nobody measured it. Smart2Raw measures it, and keeps the bytes executable. Open to conversations with investors and partners.
---

# Investment & partnership

Smart2Raw is open to conversations — with investors, and with companies that
would put the technology into production. There is no round being announced and
no number on this page; there is a technology with a verifiable track record and
a founder who answers his own e-mail.

## The problem, in money

Every system that stores integers stores most of them at eight bytes per
element, because the width is chosen by the type declaration and not by the
data. A sensor reading between 0 and 200 needs one byte. A timestamp sampled
every 60 seconds needs a base and a small index. The gap between what is
declared and what is needed is paid in RAM, in disk, in memory bandwidth and in
the electricity that moves it — in every database, every telemetry pipeline,
every inference server and every embedded device.

## The wedge

The field already knows how to make integers smaller: dictionaries, bit packing,
delta encoding. All of them share one cost — **a decode step**. The bytes on
disk are not the values, so something has to reconstruct them before anything
can be asked of them.

Smart2Raw removes that step by construction. It classifies by **range** and
stores in the smallest *native* class, so what is stored is an array the
processor already knows how to read. That single decision produces a property
none of the alternatives has: **it cannot expand the input.** Every classical
format has a regime where the output is larger than what went in — dictionary
encoding of a high-cardinality column measures 41.01 MB against a 30.52 MB
baseline. Smart2Raw's worst case ties the baseline, because its widest class
*is* the baseline.

## The proof that already exists

::html
<div class="kpis">
  <div class="kpi"><b>3</b><small>versions deposited on Zenodo with citable DOIs, establishing a dated priority</small></div>
  <div class="kpi"><b>31</b><small>test suites, 0 failures, including 100,950 differential fuzz checks with fixed seeds</small></div>
  <div class="kpi"><b>7</b><small>hardware targets: x86, ARM NEON and SVE2, RISC-V RVV, big-endian, MCU, WebAssembly</small></div>
  <div class="kpi"><b>0</b><small>dependencies — one C11 header, which is what makes adoption cheap</small></div>
</div>
::

There is one more piece of evidence that matters more than the counts. A defect
in an already-deposited release returned truncated values with no error and a
valid CRC; the project's own fuzz suite found it, it was fixed, and the defect,
its minimal reproducing case and the reason twenty-five suites had missed it were
all published. Engineering discipline is hard to assess from outside. That is
what it looks like from inside.

## Why it is defensible

- **A dated, citable priority.** Three deposits with DOIs, timestamped by a third
  party, describing the method in full.
- **An advanced version that is not published.** The open version is the proof;
  [Premium](/premium/) is the product.
- **A licence that converts.** AGPL-3.0 means anyone building this into a closed
  product has to have a commercial conversation. The open version is the funnel,
  not the giveaway.
- **A surface that is everywhere.** The addressable market is not a vertical —
  it is [every system with an integer column in it](/applications/).

## Where it is now, honestly

One founder, a published library at version 3.5.0, a `.s2r` format with
measured compatibility across versions, an advanced version under development,
and no external capital. What is being sought is the right conversation — capital,
distribution, or a first serious deployment — not a specific cheque.

## Talk

The best first message says who you are and what you would want to see. If you
would rather start from the technology, everything is public: run the
[demonstration](/) on your own data, read the
[technical scope](/scope/), and reproduce the
[benchmarks](/benchmarks/) with the command printed next to them.

::html
<div class="cta"><a class="btn" href="/contact/">Start a conversation</a>
<a class="btn ghost" href="/about/">About the founder</a></div>
::
