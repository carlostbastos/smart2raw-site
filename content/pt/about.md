---
title: Sobre o Smart2Raw — o projeto e quem está por trás
description: Quem escreveu a biblioteca, como o projeto é tocado, e a trilha de versões depositadas que documenta isso lançamento a lançamento.
---

::html
<section class="hero">
  <p class="slogan">O método está datado por terceiros, não afirmado aqui.</p>
  <h1>Sobre</h1>
  <p class="lead">O Smart2Raw é escrito e mantido por <strong>Carlos Alberto Terêncio de Bastos</strong>, que detém o direito autoral — e é isso que torna possível a licença dupla deste site. Não há uma empresa entre você e o projeto: o que você escrever na <a href="/pt/contato/">página de contato</a> chega em quem escreveu o código.</p>
  <p class="qual">Abaixo estão os três hábitos que conduzem o projeto — todos verificáveis no repositório, não declarados aqui — e a trilha de versões depositadas que os documenta.</p>
  <div class="cta">
    <a class="btn" href="/pt/contato/">Contato</a>
    <a class="btn ghost" href="https://github.com/carlostbastos/Smart2Raw">O código</a>
    <a class="btn ghost" href="/pt/escopo/">Escopo técnico</a>
  </div>
  <div class="kpis">
    <div class="kpi"><b>6</b><small>versões depositadas, cada uma um registro do método datado por um terceiro</small></div>
    <div class="kpi"><b>2</b><small>defeitos publicados com o caso mínimo que reproduz cada um, em vez de enterrados</small></div>
    <div class="kpi"><b>31</b><small>suítes de teste, 0 falhas — e a suíte de fuzz existe porque achou um deles</small></div>
  </div>
</section>
::

## A ideia, em um parágrafo

Uma coluna de inteiros tem oito bytes por elemento porque uma declaração de tipo
disse isso, não porque o dado precisasse. O Smart2Raw mede a amplitude real e
guarda a coluna na menor classe **nativa** que essa amplitude exige — e então
para. Os bytes continuam sendo inteiros nativos, então toda operação roda direto
em cima deles, sem passo de decodificação para pagar. O nome inverte a promessa
usual de propósito: todo mundo se oferece para transformar dado bruto em algo
inteligente. Aqui a inteligência entra na classificação, e o que sai é raw.

## Como o projeto é conduzido

Três hábitos, e eles estão visíveis no repositório em vez de declarados aqui.

**Todo número vem junto com o programa que o produziu.** Nenhum benchmark imprime
um valor que não sabe defender; cada um verifica o que pode antes de imprimir, e
aborta se houver divergência em vez de reportar um resultado bonito.

**Casos de teste escolhidos herdam o ponto cego de quem escolheu.** É por isso que
existe uma suíte de fuzz diferencial com sementes fixas, e é por isso que ela
existe de fato: ela encontrou um defeito que vinte e cinco suítes de casos
cuidadosamente escolhidos não pegaram.

**Defeito se publica, não se enterra.** Quando a versão 3.4.0 se revelou capaz de
devolver valores truncados em colunas sem sinal que cruzam 2^63 — sem erro e com
CRC válido — a correção veio com o caso mínimo que reproduz, a explicação e um
aviso de atualização no topo da release. E aconteceu de novo na 3.5.1, com um
defeito de outra natureza: um `.s2r` construído de má-fé, com CRC correto e tudo
internamente consistente, fazia o leitor escrever fora do heap. Os dois estão na
página de [escopo técnico](/pt/escopo/) hoje, onde qualquer um que avalie o
projeto vai ler.

## A trilha

| versão | depositada | o que trouxe |
|---|---|---|
| [3.5.1](https://doi.org/10.5281/zenodo.21676456) | 2026 | a correção de segurança no leitor em blocos, e o arquivo hostil virando teste fixo |
| [3.5.0](https://doi.org/10.5281/zenodo.21623772) | 2026 | fatoração afim, o planejador de blocos, o índice cumulativo, e a correção do defeito acima |
| [3.4.0](https://doi.org/10.5281/zenodo.21614309) | 2026 | quadro de referência por bloco, predicados SIMD, o contrato do `.s2r` fechado |
| [3.3.7](https://doi.org/10.5281/zenodo.20619276) · [3.3.6](https://doi.org/10.5281/zenodo.20613701) · [3.3.x](https://doi.org/10.5281/zenodo.20477235) | 2026 | os depósitos anteriores, cada um com DOI próprio |
| [DOI do projeto](https://doi.org/10.5281/zenodo.20477234) | — | aponta sempre para a versão mais recente |

Cada depósito é um registro do método datado e carimbado por um terceiro, o que
também é o que dá ao projeto uma data de prioridade.

## Onde encontrar o projeto

::html
<div class="cta">
  <a class="btn ghost" href="https://github.com/carlostbastos/Smart2Raw">GitHub</a>
  <a class="btn ghost" href="https://doi.org/10.5281/zenodo.20477234">Zenodo</a>
  {{LINKEDIN}}
  <a class="btn" href="/pt/contato/">Contato</a>
</div>
::

::html
<section class="next">
<h2>Por onde seguir</h2>
<div class="cards">
  <div class="card"><h3>Como o método se lê</h3>
    <p>A decisão de projeto e a troca, ditas sem rodeio.</p>
    <a class="more" href="/pt/escopo/">Escopo técnico →</a></div>
  <div class="card"><h3>Como citar</h3>
    <p>Seis depósitos com DOI próprio, e um DOI do projeto.</p>
    <a class="more" href="/pt/citar/">Citar →</a></div>
  <div class="card"><h3>Falar com quem escreveu</h3>
    <p>Sem balcão de suporte no meio.</p>
    <a class="more" href="/pt/contato/">Contato →</a></div>
</div>
</section>
::
