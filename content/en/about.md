---
title: About Smart2Raw — the project and the person behind it
description: Who wrote the library, how the project is run, and the trail of deposited versions that documents it release by release.
---

::html
<section class="hero">
  <p class="slogan">The method is dated by third parties, not asserted here.</p>
  <h1>About</h1>
  <p class="lead">Smart2Raw is written and maintained by <strong>Carlos Alberto Terêncio de Bastos</strong>, who holds the copyright — which is what makes the dual licence on this site possible. There is no company between you and the project: what you write on the <a href="/contact/">contact page</a> reaches the person who wrote the code.</p>
  <p class="qual">Below are the three habits that run the project — all verifiable in the repository, not declared here — and the trail of deposited versions that documents them.</p>
  <div class="cta">
    <a class="btn" href="/contact/">Contact</a>
    <a class="btn ghost" href="https://github.com/carlostbastos/Smart2Raw">The code</a>
    <a class="btn ghost" href="/scope/">Technical scope</a>
  </div>
  <div class="kpis">
    <div class="kpi"><b>6</b><small>deposited versions, each a record of the method dated by a third party</small></div>
    <div class="kpi"><b>2</b><small>defects published with the minimal case that reproduces each, instead of buried</small></div>
    <div class="kpi"><b>31</b><small>test suites, 0 failures — and the fuzz suite exists because it found one of them</small></div>
  </div>
</section>
::

## The idea, in one paragraph

An integer column is eight bytes per element because a type declaration said so,
not because the data needed it. Smart2Raw measures the real range and stores the
column in the smallest **native** class that range requires — and then stops.
The bytes stay native integers, so every operation runs on them directly, with
no decode step to pay. The name inverts the usual promise on purpose: everyone
offers to turn raw data into something smart. Here the intelligence goes into
the classification, and what comes out is raw.

## How the project is run

Three habits, and they are visible in the repository rather than claimed here.

**Every number ships with the program that produced it.** No benchmark prints a
figure it cannot defend; each one asserts what it can before printing, and aborts
on a disagreement rather than reporting a pretty result.

**Chosen test cases inherit the blind spot of whoever chose them.** That is why
there is a differential fuzz suite with fixed seeds, and why it exists at all:
it found a defect that twenty-five suites of carefully chosen cases had missed.

**A defect gets published, not buried.** When version 3.4.0 turned out to return
truncated values on unsigned columns crossing 2^63 — with no error and a valid
CRC — the fix came with the minimal reproducing case, the explanation, and an
upgrade notice at the top of the release. It is on the
[technical scope](/scope/) page today, where anyone evaluating the project will
read it.

## The trail

| version | deposited | what it brought |
|---|---|---|
| [3.5.0](https://doi.org/10.5281/zenodo.21623772) | 2026 | affine factoring, the block planner, the cumulative index, and the fix for the defect above |
| [3.4.0](https://doi.org/10.5281/zenodo.21614309) | 2026 | frame of reference per block, SIMD predicates, the `.s2r` contract closed |
| [concept DOI](https://doi.org/10.5281/zenodo.20477234) | — | always resolves to the most recent version |

Each deposit is a dated, third-party-timestamped record of the method, which is
also what gives the project a priority date.

## Where to find the project

::html
<div class="cta">
  <a class="btn ghost" href="https://github.com/carlostbastos/Smart2Raw">GitHub</a>
  <a class="btn ghost" href="https://doi.org/10.5281/zenodo.20477234">Zenodo</a>
  {{LINKEDIN}}
  <a class="btn" href="/contact/">Contact</a>
</div>
::

::html
<section class="next">
<h2>Where to go next</h2>
<div class="cards">
  <div class="card"><h3>How the method reads</h3>
    <p>The design decision and the trade, said plainly.</p>
    <a class="more" href="/scope/">Technical scope →</a></div>
  <div class="card"><h3>How to cite</h3>
    <p>Six deposits with their own DOI, and a concept DOI.</p>
    <a class="more" href="/cite/">Cite →</a></div>
  <div class="card"><h3>Talk to the person who wrote it</h3>
    <p>No support desk in between.</p>
    <a class="more" href="/contact/">Contact →</a></div>
</div>
</section>
::
