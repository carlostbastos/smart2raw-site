---
title: Citar o Smart2Raw — DOI, BibTeX e versões
description: Toda versão do Smart2Raw é depositada no Zenodo com DOI próprio, além de um DOI do projeto que sempre aponta para a mais recente.
---

::html
<section class="hero">
  <p class="slogan">Seis depósitos, cada um com data de terceiro.</p>
  <h1>Citar</h1>
  <p class="lead">Toda versão é depositada com um DOI citável. Cite a <strong>versão</strong> que você de fato usou; cite o <strong>DOI do projeto</strong> quando quiser se referir ao projeto como um todo.</p>
  <p class="qual">O repositório traz um CITATION.cff, então o botão "Cite this repository" do próprio GitHub produz a mesma referência. E toda medição publicada volta com um clone e um comando.</p>
  <div class="cta">
    <a class="btn" href="https://doi.org/10.5281/zenodo.20477234">DOI do projeto</a>
    <a class="btn ghost" href="https://github.com/carlostbastos/Smart2Raw">O repositório</a>
    <a class="btn ghost" href="/pt/escopo/">Escopo técnico</a>
  </div>
  <div class="kpis">
    <div class="kpi"><b>6</b><small>versões depositadas, cada uma com DOI próprio e data carimbada por um terceiro</small></div>
    <div class="kpi"><b>1</b><small>DOI do projeto, que resolve sempre para a versão mais recente</small></div>
    <div class="kpi"><b>31</b><small>suítes reproduzíveis por um comando, com as sementes do fuzz fixas</small></div>
  </div>
</section>
::

## Versão atual — 3.5.1

> Terêncio de Bastos, C. A. (2026). *Smart2Raw: classifique uma vez, opere para
> sempre no menor formato nativo* (versão 3.5.1). Zenodo.
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

## Todas as versões

| versão | DOI | depositada |
|---|---|---|
| **projeto (sempre a mais recente)** | [10.5281/zenodo.20477234](https://doi.org/10.5281/zenodo.20477234) | — |
| 3.5.1 | [10.5281/zenodo.21676456](https://doi.org/10.5281/zenodo.21676456) | 29/07/2026 |
| 3.5.0 | [10.5281/zenodo.21623772](https://doi.org/10.5281/zenodo.21623772) | 27/07/2026 |
| 3.4.0 | [10.5281/zenodo.21614309](https://doi.org/10.5281/zenodo.21614309) | 27/07/2026 |
| 3.3.7 | [10.5281/zenodo.20619276](https://doi.org/10.5281/zenodo.20619276) | 10/06/2026 |
| 3.3.6 | [10.5281/zenodo.20613701](https://doi.org/10.5281/zenodo.20613701) | 09/06/2026 |
| 3.3.x | [10.5281/zenodo.20477235](https://doi.org/10.5281/zenodo.20477235) | 31/05/2026 |

A 3.5.1 é uma correção de segurança sem mudança de API nem de formato — arquivos
`.s2r` da 3.5.0 e da 3.5.1 são lidos um pelo outro. Se o seu trabalho cita o
método e não uma build específica, o DOI do projeto serve igual. O que a 3.5.1
corrige está na [página de escopo técnico](/pt/escopo/).

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

::html
<section class="next">
<h2>Por onde seguir</h2>
<div class="cards">
  <div class="card"><h3>O que os números significam</h3>
    <p>Todo resultado publicado sai de um programa que confere antes de imprimir.</p>
    <a class="more" href="/pt/desempenho/">Desempenho →</a></div>
  <div class="card"><h3>O que está sendo citado</h3>
    <p>A decisão de projeto, e a troca que vem com ela.</p>
    <a class="more" href="/pt/escopo/">Escopo técnico →</a></div>
  <div class="card"><h3>Quem mantém</h3>
    <p>Uma pessoa, três hábitos, e a trilha de depósitos.</p>
    <a class="more" href="/pt/sobre/">Sobre →</a></div>
</div>
</section>
::
