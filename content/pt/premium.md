---
title: Smart2Raw Premium — além da versão aberta, sob licença comercial
description: A versão aberta é a que você pode conferir. A Premium vai além no quanto o dado compacta e no que dá para perguntar a ele, e vem com o direito de embutir em produto fechado.
---

::html
<section class="hero">
  <p class="slogan">A prova é a versão aberta.</p>
  <h1>Smart2Raw Premium</h1>
  <p class="lead">A versão publicada neste site é completa, auditável e sua para testar — é para isso que ela existe. A <strong>Premium</strong> é a versão que não é publicada, e ela é licenciada, não baixada.</p>
  <p class="qual">Duas perguntas justas seguem daí: o que exatamente ela acrescenta, e por que a parte que não é publicada merece crédito. Esta página responde as duas com o que já dá para conferir hoje.</p>
  <div class="cta">
    <a class="btn" href="/pt/contato/">Comece a conversa</a>
    <a class="btn ghost" href="/pt/licenciamento/">Licenciamento</a>
    <a class="btn ghost" href="/pt/escopo/">O que a versão aberta já faz</a>
  </div>
  <div class="kpis">
    <div class="kpi"><b>5</b><small>versões depositadas com DOI próprio, carimbadas por um terceiro</small></div>
    <div class="kpi"><b>31</b><small>suítes de teste na versão aberta, 0 falhas — o que dá para conferir, está conferido</small></div>
    <div class="kpi"><b>2</b><small>defeitos publicados com o caso mínimo que reproduz cada um, em vez de enterrados</small></div>
  </div>
</section>
::

## O que a Premium acrescenta

::html
<div class="cards">
  <div class="card"><h3>Ela compacta mais</h3>
    <p>Além do que a menor classe nativa consegue sozinha — inclusive nos regimes em que, na
    versão aberta, o dicionário ainda ganha. A página de <a href="/pt/escopo/">escopo técnico</a>
    nomeia esses regimes com precisão; a Premium é onde eles deixam de ser uma troca.</p></div>
  <div class="card"><h3>Ela responde mais</h3>
    <p>Além de contar e somar: operações compostas sobre uma coluna, e sobre mais de uma, que na
    versão aberta você teria de escrever por conta própria.</p></div>
  <div class="card"><h3>E não para por aí</h3>
    <p>O resto não é publicado, de propósito. O que é público é deliberadamente a parte que
    qualquer um pode conferir; o resto está sob licença.</p></div>
</div>
::

## Por que a parte não publicada merece crédito

A pergunta é justa, e a resposta é concreta em vez de promessa.

Tudo o que este projeto *já* publicou pode ser conferido linha a linha: cinco
versões depositadas com DOI próprio, 31 suítes de teste com zero falhas, e todo
benchmark acompanhado do comando que o reproduz e de uma asserção que roda antes
de cada número ser impresso.

E há uma evidência mais dura. A versão 3.4.0 — já depositada, já citável —
carregava um defeito que devolvia **valores truncados sem erro, sem aviso e com
CRC válido**. O projeto achou com um fuzz diferencial, corrigiu, e então publicou
o defeito, o caso mínimo que o reproduz e a razão de vinte e cinco suítes de
casos escolhidos não o terem pegado. Isso está na página de
[escopo técnico](/pt/escopo/) agora, onde um comprador vai ler.

E não foi uma vez só. A 3.5.0 tinha um segundo defeito, de outra natureza: um
arquivo `.s2r` construído de má-fé — 64 bytes, CRC correto, tudo internamente
consistente — fazia o leitor alocar dezesseis bytes e copiar quatro megabytes
para dentro. Foi encontrado lendo o carregador contra a própria aritmética,
corrigido na 3.5.1, e publicado com o arquivo hostil virando teste fixo.

Um projeto que documenta o próprio pior momento duas vezes é um projeto cujas
afirmações dá para precificar. A Premium é feita pelas mesmas mãos, com a mesma
disciplina.

## Para quem ela é

- Quem vai embutir o Smart2Raw num **produto que não publica sob AGPL** —
  software vendido a clientes, SaaS, firmware, um dispositivo.
- Times cujas colunas caem exatamente nos regimes em que a versão aberta para de
  propósito.
- Quem precisa de alguém responsável por uma correção, com data.

## O que uma licença inclui

| | Aberta · AGPL-3.0 | Premium · comercial |
|---|---|---|
| Classificação por amplitude, três formas, predicados nativos | sim | sim |
| O formato `.s2r`, portabilidade, a bateria de testes inteira | sim | sim |
| Compactação além da menor classe nativa | — | sim |
| Operações compostas e sobre múltiplas colunas | você escreve | sim |
| Direito de embutir em software não publicado sob AGPL | — | sim |
| Suporte e prioridade em correções | comunidade | sim |
| Todo o resto que não é publicado | — | sim |

## Como a conversa começa

Diga qual é a coluna: quantos elementos, como é a amplitude, o que você precisa
perguntar a ela, e onde isso roda. Em geral já basta para uma primeira resposta
honesta sobre se a Premium muda alguma coisa para você — e, se não mudar, você
vai ouvir isso.

::html
<div class="cta"><a class="btn" href="/pt/contato/">Fale conosco</a>
<a class="btn ghost" href="/pt/licenciamento/">Como funciona o licenciamento</a></div>
::

::html
<section class="next">
<h2>Por onde seguir</h2>
<div class="cards">
  <div class="card"><h3>Veja a linha onde a aberta para</h3>
    <p>Os regimes em que ela perde, nomeados com precisão e com o número.</p>
    <a class="more" href="/pt/escopo/">Escopo técnico →</a></div>
  <div class="card"><h3>Entenda a licença</h3>
    <p>A AGPL é o que torna possível uma versão aberta sem abrir mão do direito comercial.</p>
    <a class="more" href="/pt/licenciamento/">Licenciamento →</a></div>
  <div class="card"><h3>Diga qual é a sua coluna</h3>
    <p>Quantos elementos, como é a amplitude, o que você precisa perguntar.</p>
    <a class="more" href="/pt/contato/">Fale conosco →</a></div>
</div>
</section>
::
