---
title: Smart2Raw — o servidor que você não precisa comprar
description: Colunas de inteiros guardadas na menor classe nativa que a amplitude real exige — até 8× menos bytes, sem passo de decodificação, porque os bytes guardados são inteiros nativos. Teste com o seu próprio dado, no navegador.
---

::html
<section class="hero">
  <p class="slogan">A inteligência está na classificação. O que sai é byte puro.</p>
  <h1>O servidor que você não precisa comprar.</h1>
  <p class="lead">Sua coluna de inteiros tem 8 bytes porque ninguém perguntou de quanto ela
  precisa. O Smart2Raw pergunta. Ele mede a amplitude real e guarda a coluna na menor classe
  nativa que essa amplitude exige — 8, 16, 32 ou 64 bits, com ou sem sinal. Sem dicionário, sem
  empacotamento de bits, sem passo de decodificação: os bytes guardados <em>são</em> inteiros
  nativos, e por isso toda operação roda direto em cima deles.</p>
  <p class="qual">Até 8× menos bytes na mesma máquina, quando a amplitude da coluna permite — e
  a mesma máquina passa a caber 8× mais dado quente. A demonstração aqui embaixo mede isso com
  o <b>seu</b> dado, no seu próprio navegador, em cerca de 30 segundos.</p>
  <div class="cta">
    <a class="btn" href="#s2rdemo">Teste com a sua coluna</a>
    <a class="btn ghost" href="/pt/comece/">Comece</a>
    <a class="btn ghost" href="https://github.com/carlostbastos/Smart2Raw">GitHub</a>
  </div>
  <div class="kpis">
    <div class="kpi"><b>8×</b><small>menor que int64 numa coluna de telemetria de 0..200 — medido, e reproduzível aqui embaixo</small></div>
    <div class="kpi"><b>0</b><small>dependências. Um header, C11, sem sistema de build</small></div>
    <div class="kpi"><b>31</b><small>suítes de teste, 0 falhas, em x86, ARM, RISC-V e big-endian</small></div>
    <div class="kpi"><b>3</b><small>versões depositadas com DOI citável</small></div>
  </div>
</section>
::

::html
<section>
::

{{DEMO}}

::html
</section>
::

::html
<section class="why">
<h2>Por que isso importa agora</h2>
<p class="whysub">Estes três números não são nossos. Vêm de terceiros, e cada um traz a sua
fonte. Os números que nós medimos ficam acima, e você reproduz cada um deles aqui mesmo — a
separação é de propósito.</p>
<div class="mk">

  <div class="mkc">
    <p class="mkn">3,0× <i>contra</i> 1,6×</p>
    <p class="mkt">O gargalo deixou de ser cálculo</p>
    <p>Em 20 anos, o pico de computação do hardware cresceu 3,0× a cada 2 anos. A banda de
    memória DRAM cresceu 1,6×; a de interconexão, 1,4×. A distância aumenta todo ano.</p>
    <p class="mkso">IEEE Micro · <a href="https://arxiv.org/abs/2403.14123">arXiv:2403.14123</a></p>
    <p class="arrow">→ Somar FLOP parou de resolver. Ler menos byte, sem pagar decodificação,
    ataca exatamente o lado que ficou estreito.</p>
  </div>

  <div class="mkc">
    <p class="mkn">+58% a 63%</p>
    <p class="mkt">Em um único trimestre</p>
    <p>Foi quanto subiu o preço de contrato da DRAM no 2º trimestre de 2026, na pior escassez em
    quase 15 anos. Um servidor de IA usa de 8 a 10 vezes a memória de um servidor comum.</p>
    <p class="mkso">TrendForce, abril de 2026</p>
    <p class="arrow">→ Byte que você não guarda é dinheiro que você não gasta — e memória que
    sobra para outra coisa.</p>
  </div>

  <div class="mkc">
    <p class="mkn">945 TWh</p>
    <p class="mkt">Data centers em 2030</p>
    <p>O consumo de eletricidade dos data centers deve mais que dobrar até 2030, chegando a cerca
    de 945 TWh, com a IA como principal motor.</p>
    <p class="mkso">Agência Internacional de Energia</p>
    <p class="arrow">→ Mover menos byte é gastar menos energia por consulta. Não é slogan: é a
    mesma conta, vista do outro lado.</p>
  </div>

</div>
<p class="note">Uma biblioteca que pede confiança numa medição deveria ser a primeira a dizer
quais números são dela. Os nossos estão acima, e são reproduzíveis. Estes são de outros, e estão
linkados.</p>
</section>
::

## Onde isso se encaixa

Todos estes já têm uma coluna de inteiros dentro. É essa a superfície inteira.

::html
<div class="cards">
  <div class="card"><h3>Bancos de dados e colunar</h3>
    <p>Ids, códigos, datas, contadores. Os bytes guardados já são inteiros nativos — sem passo de
    decodificação, sem materialização, sem dicionário residente na memória.</p></div>
  <div class="card"><h3>Sistemas operacionais e Linux</h3>
    <p>Contadores de <code>/proc</code>, métricas de eBPF, PIDs, inodes, uids, timestamps de log.
    Um header, C11, zero dependência: entra dentro de daemon e de agente sem arrastar
    biblioteca.</p></div>
  <div class="card"><h3>Observabilidade, IoT, telemetria</h3>
    <p>Série temporal de intervalo fixo, sensores, contadores. É aqui que o passo comum e o quadro
    de referência por bloco atuam juntos.</p></div>
  <div class="card"><h3>IA e aprendizado de máquina</h3>
    <p>Token ids, índices de vocabulário, ids de feature, offsets de dataset, listas de vizinhos de
    índice vetorial. A inferência é limitada por banda de memória, não por FLOPs — ler menos bytes
    sem custo de decodificação é a moeda que falta.</p></div>
  <div class="card"><h3>Embarcado, MCU, edge, automotivo</h3>
    <p>Qualquer buffer de leitura. O modo enxuto já está testado: sem stdio, sem mmap, sem
    SIMD.</p></div>
  <div class="card"><h3>Mercado financeiro</h3>
    <p>Preço em centavos (um passo!), timestamp de nanossegundo, id de instrumento. Dado de tick é
    o retrato do caso ideal.</p></div>
  <div class="card"><h3>Ferramentas de desenvolvedor</h3>
    <p>Tabelas de símbolos, offsets, índices em compiladores, linkers e formatos binários. Um
    header único entra em qualquer build.</p></div>
</div>
::

## Por que dá para conferir tudo o que está nesta página

A demonstração acima não é uma imitação do Smart2Raw escrita em JavaScript. É o
próprio `include/smart2raw.h`, compilado para WebAssembly e rodando no seu
navegador. Quando ela informa um tamanho, quem respondeu foi o
`s2r_pool_bytes()`. Quando ela oferece um `.s2r` para baixar, quem escreveu
aqueles bytes foi o `s2r_blocked_save()` — a página só trocou o disco por um
bloco de memória.

E todo número que pode ser conferido contra um laço ingênuo é conferido: cada
valor é lido de volta e comparado com o original, a soma que vem dos metadados de
bloco é comparada com uma soma simples, e o arquivo é escrito, reaberto, tem o
CRC verificado e é comparado de novo antes de o botão de download aparecer. Uma
divergência acende um selo vermelho em vez de imprimir um número bonito.

::html
<div class="cards" style="margin-top:22px">
  <div class="card"><h3>Depositado e citável</h3>
    <p>Três versões com DOI próprio no Zenodo, e um DOI que cobre todas elas.
    <a href="/pt/citar/">Como citar</a>.</p></div>
  <div class="card"><h3>Aberto, sob AGPL-3.0</h3>
    <p>A versão publicada é software livre. Embutir em produto fechado exige
    <a href="/pt/licenciamento/">licença comercial</a> — que é também o caminho até o
    <a href="/pt/premium/">Smart2Raw Premium</a>, a versão que não é publicada.</p></div>
  <div class="card"><h3>Portátil por construção</h3>
    <p>O mesmo arquivo roda em x86, ARM com NEON e SVE2, RISC-V com RVV, máquinas big-endian e
    microcontroladores — e agora em WebAssembly e num executável de Windows sem CRT.</p></div>
</div>
::
