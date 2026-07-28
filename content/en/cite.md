---
title: Cite Smart2Raw — DOI, BibTeX and versions
description: Every release of Smart2Raw is deposited on Zenodo with its own DOI, plus a concept DOI that always resolves to the latest version.
---

# Cite

Every release is deposited with a citable DOI. Cite the **version** you actually
used; cite the **concept DOI** when you mean the project as a whole.

## Current version — 3.5.0

> Terêncio de Bastos, C. A. (2026). *Smart2Raw: classify once, operate forever in
> the smallest native format* (version 3.5.0). Zenodo.
> https://doi.org/10.5281/zenodo.21623772

```bibtex
@software{smart2raw_3_5_0,
  author    = {Ter{\^e}ncio de Bastos, Carlos Alberto},
  title     = {Smart2Raw: classify once, operate forever in the smallest native format},
  version   = {3.5.0},
  year      = {2026},
  publisher = {Zenodo},
  doi       = {10.5281/zenodo.21623772},
  url       = {https://doi.org/10.5281/zenodo.21623772}
}
```

## All versions

| version | DOI |
|---|---|
| **concept (always the latest)** | [10.5281/zenodo.20477234](https://doi.org/10.5281/zenodo.20477234) |
| 3.5.0 | [10.5281/zenodo.21623772](https://doi.org/10.5281/zenodo.21623772) |
| 3.4.0 | [10.5281/zenodo.21614309](https://doi.org/10.5281/zenodo.21614309) |

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
