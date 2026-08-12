---
title: Investimento e parceria — Smart2Raw
description: Uma coluna de inteiros custa oito bytes por elemento porque ninguém mediu. O Smart2Raw mede, e mantém os bytes executáveis. Aberto a conversar.
---

::html
<section class="hero">
  <p class="slogan">Prioridade datada, prova conferível, um fundador.</p>
  <h1>Investimento &amp; parcerias</h1>
  <p class="lead">O Smart2Raw está aberto a conversas — com investidores, e com empresas que colocariam a tecnologia em produção. Não há rodada anunciada nem número nesta página; há uma tecnologia com histórico verificável e um fundador que responde o próprio e-mail.</p>
  <p class="qual">O que existe é conferível hoje: seis depósitos com DOI carimbados por um terceiro, 31 suítes com zero falhas, e dois defeitos publicados com o caso mínimo que reproduz cada um. A prova técnica vem antes da conversa comercial.</p>
  <div class="cta">
    <a class="btn" href="/pt/contato/">Fale conosco</a>
    <a class="btn ghost" href="/pt/desempenho/">Os números medidos</a>
    <a class="btn ghost" href="/pt/aplicacoes/">O mercado endereçável</a>
  </div>
  <div class="kpis">
    <div class="kpi"><b>6</b><small>versões depositadas no Zenodo com DOI citável, estabelecendo uma data de prioridade</small></div>
    <div class="kpi"><b>31</b><small>suítes de teste, 0 falhas, incluindo 100.950 checagens de fuzz com sementes fixas</small></div>
    <div class="kpi"><b>4</b><small>alvos com a suíte passando em hardware real: x86-64, ARM64 com NEON, big-endian e MCU. RVV e SVE2 rodam por varredura de comprimento de vetor, não em placa</small></div>
    <div class="kpi"><b>0</b><small>dependências — um header C11, que é o que torna a adoção barata</small></div>
    <div class="kpi hl"><b>161×</b><small><code>SUM</code> contra o SQLite no mesmo dado, com 1,49× menos disco e 2,73× menos memória — espaço e tempo na mesma medição</small></div>
  </div>
</section>
::

## O problema, em dinheiro

Todo sistema que guarda inteiros guarda a maior parte deles a oito bytes por
elemento, porque a largura é escolhida pela declaração do tipo e não pelo dado.
Uma leitura de sensor entre 0 e 200 precisa de um byte. Um timestamp amostrado a
cada 60 segundos precisa de uma base e de um índice pequeno. A diferença entre o
que foi declarado e o que é necessário é paga em RAM, em disco, em banda de
memória e na eletricidade que move tudo isso — em todo banco de dados, todo
pipeline de telemetria, todo servidor de inferência e todo dispositivo
embarcado.

E a diferença não é pequena nem teórica. Numa coluna de telemetria de 0 a 200
medida em 4 milhões de elementos, **30,52 MB viram 3,81 MB**. Contra um SQLite
rodando no mesmo dado, o `SUM` sai **161× mais rápido**, o disco cai 1,49× e a
memória residente 2,73×. Todo número desta página tem no repositório o programa
que o imprime.

## Por que agora, e não há cinco anos

Três números que não são nossos, e que explicam por que esta é a década em que
isto passa a importar:

- **3,0× contra 1,6×.** Em 20 anos o pico de computação do hardware cresceu 3,0×
  a cada dois anos; a banda de memória DRAM cresceu 1,6×, e a de interconexão
  1,4×. Somar FLOP parou de resolver — o lado que ficou estreito é justamente o
  que ler menos byte, sem pagar decodificação, ataca de frente.
  *(IEEE Micro · [arXiv:2403.14123](https://arxiv.org/abs/2403.14123))*
- **+58% a 63% em um trimestre.** Foi quanto subiu o preço de contrato da DRAM no
  2º trimestre de 2026, na pior escassez em quase 15 anos. Um servidor de IA usa
  de 8 a 10 vezes a memória de um servidor comum. *(TrendForce, abril de 2026)*
- **945 TWh até 2030.** O consumo elétrico dos data centers deve mais que dobrar
  na década, com a IA como motor. Mover menos byte é gastar menos energia por
  consulta — a mesma conta, vista do outro lado. *(Agência Internacional de
  Energia)*

A tese comercial cabe numa linha: **o gargalo mudou de lado, e o que sobrou
estreito foi exatamente memória e banda.** Um formato que reduz os dois sem
cobrar um passo de decodificação ataca o gargalo onde ele está hoje, não onde
estava quando os formatos clássicos foram desenhados.

## A cunha

A área já sabe deixar inteiros menores: dicionário, empacotamento de bits,
delta. Todos compartilham um custo — **um passo de decodificação**. Os bytes em
disco não são os valores, então alguma coisa precisa reconstruí-los antes que se
possa perguntar qualquer coisa a eles.

O Smart2Raw elimina esse passo por construção. Ele classifica por **amplitude** e
guarda na menor classe *nativa*, então o que está guardado é um vetor que o
processador já sabe ler. Essa única decisão produz uma propriedade que nenhuma
alternativa tem: **ele não pode aumentar a entrada.** Todo formato clássico tem
um regime em que a saída fica maior do que entrou — o dicionário numa coluna de
alta cardinalidade mede 41,01 MB contra uma linha de base de 30,52 MB. O pior
caso do Smart2Raw empata com a linha de base, porque a classe mais larga dele *é*
a linha de base.

## A prova que já existe

Os quatro números no topo desta página são contagens, e contagem qualquer um
produz. Há uma evidência que pesa mais, e ela aparece **duas vezes** no histórico
deste projeto.

A primeira: um defeito numa versão já depositada devolvia valores truncados sem
erro e com CRC válido. A própria suíte de fuzz do projeto encontrou, foi
corrigido, e então o defeito, o caso mínimo que o reproduz e a razão de vinte e
cinco suítes não o terem pegado foram todos publicados.

A segunda, meses depois: um arquivo `.s2r` construído de má-fé — 64 bytes,
internamente consistente, com CRC correto — fazia o leitor alocar dezesseis bytes
e copiar quatro megabytes para dentro. Foi encontrado lendo o carregador contra a
própria aritmética, corrigido na 3.5.1, e publicado com o arquivo hostil virando
teste fixo.

Nenhum dos dois precisava ter sido contado a ninguém. Disciplina de engenharia é
difícil de avaliar de fora; é assim que ela se parece por dentro.

## Por que é defensável

- **Uma prioridade datada e citável.** Seis depósitos com DOI, carimbados por um
  terceiro, descrevendo o método por inteiro.
- **Uma versão avançada que não é publicada.** A versão aberta é a prova; a
  [Premium](/pt/premium/) é o produto.
- **Uma licença que converte.** A AGPL-3.0 faz com que quem embutir isso em
  produto fechado precise ter uma conversa comercial. A versão aberta é o funil,
  não o presente.
- **Uma superfície que está em toda parte.** O mercado endereçável não é um
  vertical — é [todo sistema que tem uma coluna de inteiros dentro](/pt/aplicacoes/).

## Onde está hoje, honestamente

Um fundador, uma biblioteca publicada na versão 3.5.1, um formato `.s2r` com
compatibilidade medida entre versões, uma versão avançada em desenvolvimento, e
nenhum capital externo. O que se procura é a conversa certa — capital,
distribuição, ou uma primeira implantação séria — e não um cheque específico.

## Conversar

A melhor primeira mensagem diz quem você é e o que gostaria de ver. Se preferir
começar pela tecnologia, está tudo público: rode a [demonstração](/pt/) com o seu
dado, leia o [escopo técnico](/pt/escopo/) e reproduza os
[benchmarks](/pt/desempenho/) com o comando impresso ao lado deles.

::html
<div class="cta"><a class="btn" href="/pt/contato/">Começar uma conversa</a>
<a class="btn ghost" href="/pt/sobre/">Sobre o fundador</a></div>
::

::html
<section class="next">
<h2>Por onde seguir</h2>
<div class="cards">
  <div class="card"><h3>A prova técnica</h3>
    <p>Todo número com o programa que o produziu, e uma asserção antes de imprimir.</p>
    <a class="more" href="/pt/desempenho/">Desempenho →</a></div>
  <div class="card"><h3>O que é vendido</h3>
    <p>A versão aberta é o funil. A Premium é o produto.</p>
    <a class="more" href="/pt/premium/">Smart2Raw Premium →</a></div>
  <div class="card"><h3>Comece a conversa</h3>
    <p>Um e-mail chega em quem escreveu o código.</p>
    <a class="more" href="/pt/contato/">Fale conosco →</a></div>
</div>
</section>
::
