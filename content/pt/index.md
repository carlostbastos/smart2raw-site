---
title: Smart2Raw — biblioteca C que guarda coluna de inteiros na menor classe nativa
description: Um header C11, sem dependência, para bancos de dados, telemetria, IoT, IA e embarcado. Guarda a coluna na menor classe nativa que a amplitude exige e opera direto nos bytes — sem passo de decodificação, porque não há nada codificado. Teste com o seu dado, no navegador.
---

::html
<section class="hero">
  <p class="slogan">Uma biblioteca C de um arquivo só. E não, não é um compressor.</p>
  <h1>O servidor que você não precisa comprar.</h1>
  <p class="lead">Sua coluna de inteiros ocupa 8 bytes por elemento porque ninguém perguntou de
  quanto ela precisa. O Smart2Raw pergunta: mede a amplitude real e guarda a coluna na menor
  classe <b>nativa</b> que essa amplitude exige — 8, 16, 32 ou 64 bits, com ou sem sinal. Depois
  ele para. Sem dicionário, sem empacotamento de bits, sem passo de decodificação, porque não
  ficou nada codificado para desfazer.</p>
  <p class="qual">E é aí que a economia vira velocidade: como os bytes guardados continuam
  sendo inteiros que a máquina já sabe ler, <b>um registrador de 512 bits processa 64 deles por
  instrução, em vez de 8</b>. O formato compacto não é um custo pago na leitura — é o que
  destrava a largura.</p>
  <div class="cta">
    <a class="btn" href="#s2rdemo">Teste com a sua coluna</a>
    <a class="btn ghost" href="/pt/como-funciona/">Como funciona</a>
    <a class="btn ghost" href="https://github.com/carlostbastos/Smart2Raw">GitHub</a>
  </div>
  <div class="kpis kpicount">
    <div class="kpi"><b>8×</b><small>menos bytes numa coluna de telemetria de 0..200 — 30,52 MB viram 3,81 MB</small></div>
    <div class="kpi"><b>13,4×</b><small>o maior ganho medido: <code>count_gt</code> com sinal em i8, de 1402 para 18833 Mval/s</small></div>
    <div class="kpi"><b>7</b><small>áreas onde a coluna de inteiros já está — de banco de dados a microcontrolador</small></div>
    <div class="kpi"><b>0</b><small>dependências. Um header C11, e ~3,4 KB de código no microcontrolador</small></div>
  </div>
</section>
::

## Onde isso se encaixa: banco de dados, telemetria, IoT, IA, embarcado

A pergunta é sempre a mesma — **onde está a coluna de inteiros?** Quando você começa
a procurar, ela está em quase tudo, e quase sempre com oito bytes por elemento,
porque a largura foi escolhida pela declaração do tipo e não pelo dado.

::html
<div class="cards">
  <div class="card"><h3>Bancos de dados e colunar</h3>
    <p>Ids, códigos de status, datas como número de dia, contadores, ids de partição. Num layout
    colunar a coluna <i>é</i> a unidade de armazenamento — o encaixe mais direto que existe.</p></div>
  <div class="card"><h3>Sistemas operacionais e Linux</h3>
    <p>Contadores de <code>/proc</code>, métricas de eBPF, PIDs, inodes, uids, timestamps de log.
    Um header sem dependência entra dentro de daemon e de agente sem arrastar biblioteca.</p></div>
  <div class="card"><h3>Observabilidade, IoT, telemetria</h3>
    <p>Série temporal de intervalo fixo, sensores, contadores. É aqui que o passo comum e o quadro
    de referência por bloco atuam juntos: 4 milhões de timestamps saem de 15,26 MB para 4,11 MB.</p></div>
  <div class="card"><h3>IA e aprendizado de máquina</h3>
    <p>Token ids, índices de vocabulário, ids de feature, offsets de dataset, cache KV. A inferência
    é limitada por banda de memória, não por FLOPs — e aqui não há desquantização para pagar na
    entrada.</p></div>
  <div class="card"><h3>Embarcado, MCU, edge, automotivo</h3>
    <p>Qualquer buffer de leitura. Caber quatro vezes mais amostras no mesmo buffer não é
    otimização, é outro produto. O modo enxuto — sem stdio, sem mmap, sem SIMD — é uma das
    suítes de teste.</p></div>
  <div class="card"><h3>Mercado financeiro</h3>
    <p>Preço em centavos (um passo!), timestamp de nanossegundo, id de instrumento, volumes.
    Dado de tick é o retrato do caso ideal.</p></div>
  <div class="card"><h3>Ferramentas de desenvolvedor</h3>
    <p>Tabelas de símbolos, offsets, índices em compiladores, linkers e formatos binários.
    Um header único entra em qualquer build.</p></div>
</div>
::

::html
<p class="morep"><a class="more" href="/pt/aplicacoes/">Cada uma delas em detalhe, com por onde começar →</a></p>
::

## Bytes é só um eixo. O outro é o que decide o custo de rodar.

Guardar menos byte é metade da história, e é a metade que todo mundo conta. A outra
é **o que dá para perguntar aos bytes sem antes transformá-los em outra coisa** — e
ela só aparece quando você tira os bytes da equação.

Este gráfico faz exatamente isso. A coluna é a mesma, e os dois formatos ocupam
praticamente o mesmo espaço: 11,44 MB contra 11,45 MB. Com os bytes empatados, o que
sobra no desenho é só processamento.

{{FIG_OPERACOES}}

::html
<p class="figcap">O par está implementado no seu melhor, com o dicionário sobre valores distintos
<b>ordenados</b> — por isso o <code>COUNT</code> empata. É dizer isso que dá crédito às outras
duas linhas. O <code>SUM</code> não tem esse atalho: um código não é um operando que se some.
E os 7,9 ms da última linha não se movem com implementação melhor — é a definição do formato.</p>
::

Um código de dicionário só faz sentido para o mecanismo que possui o dicionário. Um
inteiro de largura nativa faz sentido para **toda instrução da máquina** — inclusive
as que o formato de armazém não alcança sem antes materializar um buffer.

::html
<p class="morep"><a class="more" href="/pt/desempenho/">Todos os números, com o comando que reproduz cada um →</a></p>
::

::html
<section>
::

{{DEMO}}

::html
</section>
::

## Como funciona, em três passos

::html
<div class="steps">
  <div class="step"><b>1</b><h3>Medir a amplitude real</h3>
    <p>Uma passagem, sem alocar. Para 0..200 a resposta é <code>S2R_8</code>; para −500..500 é
    <code>S2R_I16</code>.</p>
    <pre><code>int8_t cls = s2r_classify_array(v, n);</code></pre></div>
  <div class="step"><b>2</b><h3>Guardar nessa classe, nativamente</h3>
    <p>Os elementos viram <code>uint8_t</code> de verdade na memória — não "códigos de 8 bits".
    Um vetor que qualquer compilador C já sabe ler.</p>
    <pre><code>s2r_pool_init(&amp;p, cls, n);</code></pre></div>
  <div class="step"><b>3</b><h3>Operar sem materializar</h3>
    <p>O predicado roda em cima dos bytes <i>como estão</i>. Sem decodificação, sem consulta a
    dicionário, sem buffer intermediário.</p>
    <pre><code>s2r_count_gt_fast(&amp;p, 100);</code></pre></div>
</div>
::

São três formas, e a biblioteca escolhe entre elas medindo em vez de chutando: o
pool plano, a forma afim (`v = base + passo·i`, com o passo achado por gcd) e a
forma em blocos, cada bloco relativo ao próprio mínimo. O `s2r_recommend()` mede as
três — porque a porta de entrada óbvia costuma ser a pior.

::html
<p class="morep"><a class="more" href="/pt/como-funciona/">O mecanismo inteiro, e por que ele não pode aumentar o seu dado →</a></p>
::

## Contra o que você já tem hoje

Comparar contra "um dicionário" é comparar contra uma abstração. Quase ninguém tem
uma em produção; quase todo mundo tem um SQLite. O repositório traz um comparador
que roda no **seu** CSV e imprime a tabela inteira:

::html
<div class="tw"><table><thead><tr><th>o quê</th><th>SQLite</th><th>Smart2Raw</th><th>ganho</th></tr></thead>
<tbody>
<tr><td><code>SUM</code></td><td>2635 µs</td><td><b>16,3 µs</b></td><td><b>161×</b></td></tr>
<tr><td><code>COUNT</code> com filtro</td><td>3900 µs</td><td><b>69,5 µs</b></td><td><b>56×</b></td></tr>
<tr><td>tamanho em disco</td><td>412,0 KB</td><td><b>275,7 KB</b></td><td>1,49× menor</td></tr>
<tr><td>memória residente</td><td colspan="2">934,8 KB (int64/float64) → <b>342,2 KB</b></td><td>2,73×</td></tr>
<tr><td>dado movido por varredura</td><td colspan="2">868,1 KB → <b>275,4 KB</b></td><td>3,15×</td></tr>
</tbody></table></div>
::

```sh
python benchmarks/maestro/smart2raw_bench.py os_seus_dados.csv
```

Python aqui é só o maestro: usa a biblioteca padrão para o SQLite e chama os kernels
C reais por `ctypes`. Colunas que de fato precisam de 64 bits, ou que são ponto
flutuante, aparecem com **0%** de propósito — porque isso é escolher o tipo nativo
certo, não comprimir.

## Por que isso importa agora

::html
<section class="why">
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
</section>
::

## Aberta sob AGPL-3.0. E existe uma versão que não é publicada.

A versão deste site é a completa e auditável: todo o núcleo, o formato `.s2r`, os
predicados SIMD, a camada de análise, os ports e as 31 suítes de teste. Ela é livre
para usar, estudar, modificar e redistribuir — sob **AGPL-3.0-or-later**, o que
significa que tudo o que você construir em cima, **inclusive software oferecido pela
rede**, é liberado sob a mesma licença.

Essa cláusula não é armadilha: é o que torna possível publicar uma versão inteira,
auditável e citável sem abrir mão do direito comercial. Se o que você constrói não é
publicado sob AGPL — produto vendido a clientes, SaaS, firmware, um dispositivo —
então é uma licença comercial, e é uma conversa curta.

::html
<div class="cards">
  <div class="card"><h3>Aberta · AGPL-3.0-or-later</h3>
    <p>Tudo o que está neste site, sem recorte. Pesquisa, estudo, avaliação e ferramenta interna
    quase sempre param aqui.</p>
    <a class="more" href="/pt/licenciamento/">A AGPL afeta você? →</a></div>
  <div class="card"><h3>Comercial</h3>
    <p>O direito de embutir em software que você não publica sob AGPL, mais suporte e prioridade
    em correções.</p>
    <a class="more" href="/pt/licenciamento/">Como funciona →</a></div>
  <div class="card"><h3>Smart2Raw Premium</h3>
    <p>A versão que não é publicada. Ela vai além do que a menor classe nativa alcança sozinha, e
    responde perguntas compostas e sobre mais de uma coluna.</p>
    <a class="more" href="/pt/premium/">O que ela acrescenta →</a></div>
</div>
::

::html
<p class="cred"><b>31</b> suítes de teste, 0 falhas <span>·</span> <b>100.950</b> checagens de fuzz
diferencial com sementes fixas <span>·</span> <b>6</b> versões depositadas com DOI próprio
<span>·</span> <b>2</b> defeitos encontrados e publicados com o caso mínimo que reproduz cada um</p>
::

## Por que dá para conferir tudo o que está nesta página

A demonstração acima não é uma imitação escrita em JavaScript. É o próprio
`include/smart2raw.h`, compilado para WebAssembly e rodando no seu navegador. Quando
ela informa um tamanho, quem respondeu foi o `s2r_pool_bytes()`; quando oferece um
`.s2r` para baixar, quem escreveu aqueles bytes foi o `s2r_blocked_save()`.

E todo número que pode ser conferido contra um laço ingênuo é conferido, antes de ser
impresso. Uma divergência acende um selo vermelho em vez de imprimir um número
bonito.

::html
<section class="next">
<h2>Por onde seguir</h2>
<div class="cards">
  <div class="card"><h3>Escreva as três linhas</h3>
    <p>Um header, sem sistema de build, sem configuração. Ou baixe a demonstração em arquivo
    único e rode sem internet.</p>
    <a class="more" href="/pt/comece/">Comece →</a></div>
  <div class="card"><h3>Veja onde ele perde</h3>
    <p>A menor classe nativa tem 8 bits, e isso tem preço. A página de escopo diz qual, com o
    número.</p>
    <a class="more" href="/pt/escopo/">Escopo técnico →</a></div>
  <div class="card"><h3>Fale com quem escreveu</h3>
    <p>Licença comercial, avaliação com o seu dado, investimento — ou um defeito, que é sempre
    bem-vindo.</p>
    <a class="more" href="/pt/contato/">Contato →</a></div>
</div>
</section>
::
