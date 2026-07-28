---
title: Citar o Smart2Raw — DOI, BibTeX e versões
description: Toda versão do Smart2Raw é depositada no Zenodo com DOI próprio, além de um DOI do projeto que sempre aponta para a mais recente.
---

# Citar

Toda versão é depositada com um DOI citável. Cite a **versão** que você de fato
usou; cite o **DOI do projeto** quando quiser se referir ao projeto como um todo.

## Versão atual — 3.5.0

> Terêncio de Bastos, C. A. (2026). *Smart2Raw: classifique uma vez, opere para
> sempre no menor formato nativo* (versão 3.5.0). Zenodo.
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

## Todas as versões

| versão | DOI |
|---|---|
| **projeto (sempre a mais recente)** | [10.5281/zenodo.20477234](https://doi.org/10.5281/zenodo.20477234) |
| 3.5.0 | [10.5281/zenodo.21623772](https://doi.org/10.5281/zenodo.21623772) |
| 3.4.0 | [10.5281/zenodo.21614309](https://doi.org/10.5281/zenodo.21614309) |

O repositório traz também um `CITATION.cff`, de modo que o botão "Cite this
repository" do próprio GitHub produz a mesma referência.

## Reproduzir os resultados

Todo número publicado pelo projeto sai de um programa que está no repositório, e
cada um verifica o que pode antes de imprimir. A bateria inteira é um comando:

```sh
git clone https://github.com/carlostbastos/Smart2Raw
cd Smart2Raw && bash scripts/build_and_test.sh
```

31 suítes, 0 falhas — incluindo um fuzz diferencial com **sementes fixas**, de
modo que um resultado que reproduz uma vez reproduz sempre.
