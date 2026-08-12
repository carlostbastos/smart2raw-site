---
title: Investment and partnership — Smart2Raw
description: An integer column costs eight bytes per element because nobody measured it. Smart2Raw measures it, and keeps the bytes executable. Open to talking.
---

::html
<section class="hero">
  <p class="slogan">A dated priority, checkable proof, one founder.</p>
  <h1>Investment &amp; partnership</h1>
  <p class="lead">Smart2Raw is open to conversations — with investors, and with companies that would put the technology into production. There is no round being announced and no number on this page; there is a technology with a verifiable track record and a founder who answers his own e-mail.</p>
  <p class="qual">What does exist is checkable today: six DOI deposits stamped by a third party, 31 suites with zero failures, and two defects published with the minimal case that reproduces each. The technical proof comes before the commercial conversation.</p>
  <div class="cta">
    <a class="btn" href="/contact/">Contact</a>
    <a class="btn ghost" href="/benchmarks/">The measured numbers</a>
    <a class="btn ghost" href="/applications/">The addressable surface</a>
  </div>
  <div class="kpis">
    <div class="kpi"><b>6</b><small>versions deposited on Zenodo with a citable DOI, establishing a priority date</small></div>
    <div class="kpi"><b>31</b><small>test suites, 0 failures, including 100,950 fuzz checks with fixed seeds</small></div>
    <div class="kpi"><b>4</b><small>targets with the suite passing: x86-64 on real hardware, ARM64 and s390x on the real ISA under QEMU on every commit (250,212 checks on big-endian alone), and the microcontroller mode. RVV and SVE2 through a vector-length sweep, not on a board</small></div>
    <div class="kpi"><b>0</b><small>dependencies — one C11 header, which is what makes adoption cheap</small></div>
    <div class="kpi hl"><b>161×</b><small><code>SUM</code> against SQLite on the same data, with 1.49× less disk and 2.73× less memory — space and time in one measurement</small></div>
  </div>
</section>
::

## The problem, in money

Every system that stores integers stores most of them at eight bytes per
element, because the width is chosen by the type declaration and not by the
data. A sensor reading between 0 and 200 needs one byte. A timestamp sampled
every 60 seconds needs a base and a small index. The gap between what is
declared and what is needed is paid in RAM, in disk, in memory bandwidth and in
the electricity that moves it — in every database, every telemetry pipeline,
every inference server and every embedded device.

And the gap is neither small nor theoretical. On a 0..200 telemetry column
measured over 4 million elements, **30.52 MB becomes 3.81 MB**. Against a SQLite
running on the same data, `SUM` comes out **161× faster**, disk drops 1.49× and
resident memory 2.73×. Every number on this page has, in the repository, the
program that prints it.

## Why now, and not five years ago

Three numbers that are not ours, and that explain why this is the decade in which
it starts to matter:

- **3.0× against 1.6×.** Over 20 years hardware peak compute grew 3.0× every two
  years; DRAM bandwidth grew 1.6×, and interconnect 1.4×. Adding FLOPs stopped
  solving it — the side that stayed narrow is exactly the one that reading fewer
  bytes, with no decode step to pay, attacks head on.
  *(IEEE Micro · [arXiv:2403.14123](https://arxiv.org/abs/2403.14123))*
- **+58% to 63% in one quarter.** That is how much DRAM contract prices rose in
  Q2 2026, in the worst shortage in nearly 15 years. An AI server uses 8 to 10
  times the memory of an ordinary one. *(TrendForce, April 2026)*
- **945 TWh by 2030.** Data-centre electricity consumption is expected to more
  than double this decade, with AI as the driver. Moving fewer bytes is spending
  less energy per query — the same arithmetic, seen from the other side.
  *(International Energy Agency)*

The commercial thesis fits in one line: **the bottleneck moved, and what stayed
narrow was memory and bandwidth.** A format that reduces both without charging a
decode step attacks the bottleneck where it is today, not where it was when the
classical formats were designed.

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

The four numbers at the top of this page are counts, and anyone can produce a
count. There is one piece of evidence that matters more, and it appears **twice**
in this project's record.

The first: a defect in an already-deposited release returned truncated values
with no error and a valid CRC. The project's own fuzz suite found it, it was
fixed, and the defect, its minimal reproducing case and the reason twenty-five
suites had missed it were all published.

The second, months later: a `.s2r` file built in bad faith — 64 bytes, internally
consistent, with a correct CRC — made the reader allocate sixteen bytes and copy
four megabytes into them. It was found by reading the loader against its own
arithmetic, fixed in 3.5.1, and published with the hostile file becoming a
permanent test.

Neither one had to be told to anyone. Engineering discipline is hard to assess
from outside; that is what it looks like from inside.

## Why it is defensible

- **A dated, citable priority.** Six deposits with DOIs, timestamped by a third
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

::html
<section class="next">
<h2>Where to go next</h2>
<div class="cards">
  <div class="card"><h3>The technical proof</h3>
    <p>Every number with the program that produced it, and an assertion before it prints.</p>
    <a class="more" href="/benchmarks/">Performance →</a></div>
  <div class="card"><h3>What is sold</h3>
    <p>The open edition is the funnel. Premium is the product.</p>
    <a class="more" href="/premium/">Smart2Raw Premium →</a></div>
  <div class="card"><h3>Start the conversation</h3>
    <p>An email reaches the person who wrote the code.</p>
    <a class="more" href="/contact/">Contact →</a></div>
</div>
</section>
::
