---
title: Cite Smart2Raw — DOI, BibTeX and versions
description: Every release of Smart2Raw is deposited on Zenodo with its own DOI, plus a concept DOI that always resolves to the latest version.
---

::html
<section class="hero">
  <p class="slogan">Six deposits, each with a third-party date.</p>
  <h1>Cite</h1>
  <p class="lead">Every release is deposited with a citable DOI. Cite the <strong>version</strong> you actually used; cite the <strong>concept DOI</strong> when you mean the project as a whole.</p>
  <p class="qual">The repository ships a CITATION.cff, so GitHub's own "Cite this repository" button produces the same reference. And every published measurement comes back with one clone and one command.</p>
  <div class="cta">
    <a class="btn" href="https://doi.org/10.5281/zenodo.20477234">Concept DOI</a>
    <a class="btn ghost" href="https://github.com/carlostbastos/Smart2Raw">The repository</a>
    <a class="btn ghost" href="/scope/">Technical scope</a>
  </div>
  <div class="kpis">
    <div class="kpi"><b>6</b><small>deposited versions, each with its own DOI and a date stamped by a third party</small></div>
    <div class="kpi"><b>1</b><small>concept DOI, which always resolves to the most recent version</small></div>
    <div class="kpi"><b>31</b><small>suites reproducible with one command, with the fuzz seeds fixed</small></div>
  </div>
</section>
::

## Current version — 3.5.1

> Terêncio de Bastos, C. A. (2026). *Smart2Raw: classify once, operate forever in
> the smallest native format* (version 3.5.1). Zenodo.
> https://doi.org/10.5281/zenodo.21676456

```bibtex
@software{smart2raw_3_5_1,
  author    = {Ter{\^e}ncio de Bastos, Carlos Alberto},
  title     = {Smart2Raw: classify once, operate forever in the smallest native format},
  version   = {3.5.1},
  year      = {2026},
  publisher = {Zenodo},
  doi       = {10.5281/zenodo.21676456},
  url       = {https://doi.org/10.5281/zenodo.21676456}
}
```

## All versions

| version | DOI | deposited |
|---|---|---|
| **concept (always the latest)** | [10.5281/zenodo.20477234](https://doi.org/10.5281/zenodo.20477234) | — |
| 3.5.1 | [10.5281/zenodo.21676456](https://doi.org/10.5281/zenodo.21676456) | 2026-07-28 |
| 3.5.0 | [10.5281/zenodo.21623772](https://doi.org/10.5281/zenodo.21623772) | 2026-07-27 |
| 3.4.0 | [10.5281/zenodo.21614309](https://doi.org/10.5281/zenodo.21614309) | 2026-07-27 |
| 3.3.7 | [10.5281/zenodo.20619276](https://doi.org/10.5281/zenodo.20619276) | 2026-06-10 |
| 3.3.6 | [10.5281/zenodo.20613701](https://doi.org/10.5281/zenodo.20613701) | 2026-06-09 |
| 3.3.x | [10.5281/zenodo.20477235](https://doi.org/10.5281/zenodo.20477235) | 2026-05-31 |

3.5.1 is a security fix with no API and no format change — `.s2r` files written
by 3.5.0 and 3.5.1 are read by each other. If your work cites the method rather
than a specific build, the concept DOI serves just as well. What 3.5.1 fixes is
on the [technical scope page](/scope/).

The repository also ships a `CITATION.cff`, so GitHub's own "Cite this
repository" button produces the same reference.

## Reproducing the results

Every number published by the project comes from a program in the repository,
and each one asserts what it can before printing. The full battery is one
command:

```sh
git clone https://github.com/carlostbastos/Smart2Raw
cd Smart2Raw && bash scripts/build_and_test.sh
```

31 suites, 0 failures — including a differential fuzz suite with **fixed seeds**,
so a result that reproduces once reproduces always.

::html
<section class="next">
<h2>Where to go next</h2>
<div class="cards">
  <div class="card"><h3>What the numbers mean</h3>
    <p>Every published result comes out of a program that checks before it prints.</p>
    <a class="more" href="/benchmarks/">Performance →</a></div>
  <div class="card"><h3>What is being cited</h3>
    <p>The design decision, and the trade that comes with it.</p>
    <a class="more" href="/scope/">Technical scope →</a></div>
  <div class="card"><h3>Who maintains it</h3>
    <p>One person, three habits, and the trail of deposits.</p>
    <a class="more" href="/about/">About →</a></div>
</div>
</section>
::
