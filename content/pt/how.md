---
title: Como o Smart2Raw funciona — classificação, não compressão
description: Medir a amplitude real, escolher a menor classe nativa que a comporta, operar nos bytes guardados. Sem dicionário, sem bit-packing, sem decodificar.
---

::html
<section class="hero">
  <p class="slogan">O seu dado não vira outra coisa.</p>
  <h1>Como funciona</h1>
  <p class="lead">O Smart2Raw não é um compressor. Um compressor transforma o seu dado em outra coisa e devolve quando você pede. O Smart2Raw faz o contrário: ele decide, uma vez, de quanto o dado realmente precisa — e depois deixa o dado em paz.</p>
  <p class="qual">Três passos: medir a amplitude real, escolher a menor classe nativa que a contém, e operar direto nos bytes guardados. É o terceiro que separa a abordagem de tudo o que codifica — não há passo de decodificação para pagar.</p>
  <div class="cta">
    <a class="btn" href="/pt/#s2rdemo">Veja rodando no navegador</a>
    <a class="btn ghost" href="/pt/comece/">Comece</a>
    <a class="btn ghost" href="/pt/escopo/">Escopo técnico</a>
  </div>
  <div class="kpis">
    <div class="kpi"><b>3</b><small>passos: medir a amplitude, guardar na classe nativa, operar sem materializar</small></div>
    <div class="kpi"><b>3</b><small>formas — pool plano, afim e em blocos — escolhidas por medição, não por palpite</small></div>
    <div class="kpi"><b>3,8 MB</b><small>4 milhões de elementos entre 0 e 200 que ocupavam 30,5 MB — sem dicionário e sem empacotar bits</small></div>
    <div class="kpi"><b>0</b><small>passos de decodificação: os bytes guardados são inteiros nativos</small></div>
  </div>
</section>
::

## Passo 1 · Medir a amplitude real

Uma coluna `int64` ocupa 8 bytes por elemento, guarde ela timestamps de
nanossegundo ou a leitura de um sensor entre 0 e 200. A primeira coisa que a
biblioteca faz é olhar:

```c
int8_t cls = s2r_classify_array(valores, n);   /* uma passagem, sem alocar */
```

Para 0..200 a resposta é `S2R_8`. Para −500..500 é `S2R_I16`. A classe **é** a
largura em bits, e o sinal dela é a *presença de sinal* — então `abs(size) >> 3`
é o número de bytes por elemento e `size < 0` quer dizer com sinal. Esse único
truque tira uma tabela inteira da biblioteca.

## Passo 2 · Guardar nessa classe, nativamente

```c
S2RPool p;
s2r_pool_init(&p, cls, n);
for (size_t i = 0; i < n; i++) s2r_push(&p, valores[i]);
```

Os elementos agora são `uint8_t` na memória. Não "códigos de 8 bits" — `uint8_t`
de verdade. Uma coluna de 0..200 com 4 milhões de elementos sai de 30,5 MB para
3,8 MB, e os bytes em `p.data` são um vetor que qualquer compilador C já sabe
ler.

## Passo 3 · Operar sem materializar

É esta a parte que separa a abordagem da codificação por dicionário. Como os
bytes guardados são inteiros nativos, um predicado roda em cima deles **como
estão**:

```c
size_t k = s2r_count_gt_fast(&p, 100);
```

Não há passo de decodificação, não há consulta a dicionário, não há buffer
intermediário. Ler um quarto dos bytes significa um quarto do tráfego de
memória — e tráfego de memória é o que uma varredura custa.

## Três formas, escolhidas por medição

| forma | o que faz | quando ganha |
|---|---|---|
| **pool plano** | todo elemento na menor classe que cabe a coluna inteira | colunas uniformes; é a porta de entrada natural |
| **afim** | `v = base + passo·i` — o passo comum é dividido, de forma exata | intervalos de amostragem fixos, dinheiro em ponto fixo, passos de quantização |
| **em blocos** | cada bloco é guardado relativo ao próprio mínimo, com metadados que respondem consultas sem tocar no payload | dado particionado no tempo, e tudo em que a amplitude local é bem menor que a global |

O `s2r_recommend()` mede as três e diz qual delas a sua coluna quer — porque a
porta de entrada óbvia costuma ser a pior. E o `s2r_blocked_plan()` precifica
todos os tamanhos de bloco candidatos a partir de **uma única passagem** sobre o
dado, de modo que o tamanho de bloco é classificado em vez de chutado.

## Por que ele nunca pode aumentar o seu dado

Todo formato clássico tem um regime em que a saída fica maior que a entrada.
Dicionário numa coluna de cardinalidade alta guarda um dicionário do tamanho do
dado. RLE em dado não ordenado guarda uma corrida por valor. Bitmap só existe
quando há dois valores distintos.

O Smart2Raw classifica por **amplitude**, e a classe mais larga que ele tem *é* o
`int64` de entrada. Então o pior caso dele é "a amplitude precisa de 64 bits",
que é exatamente a linha de base. Isso não é sorte nem ajuste fino — é
consequência estrutural do projeto, e o `benchmarks/format_matrix.c` verifica esse
limite por asserção antes de imprimir cada linha.

## O arquivo `.s2r`

Uma coluna serializada é um cabeçalho pequeno e fixo seguido do payload, em
little-endian canônico para que os bytes sejam idênticos em qualquer máquina, com
um CRC32 no fim.

| `fmt` | o que é |
|---|---|
| 1 | pool plano |
| 2 | em blocos |
| 3 | em blocos, com passo por bloco |

O formato 3 só é emitido **quando** algum bloco de fato tem passo maior que 1 —
então uma coluna sem passo comum é byte a byte o arquivo que a versão 3.4.0
escrevia, e uma build 3.4.0 abre esse arquivo. Quando há passo, o arquivo é
`fmt = 3` e as versões antigas o recusam corretamente, em vez de lerem errado.

::html
<section class="next">
<h2>Por onde seguir</h2>
<div class="cards">
  <div class="card"><h3>Veja os números</h3>
    <p>A mesma coluna em sete formatos, e os tempos de consulta.</p>
    <a class="more" href="/pt/desempenho/">Desempenho →</a></div>
  <div class="card"><h3>Onde a troca está</h3>
    <p>A menor classe nativa tem 8 bits. Tudo o que isso compra, e o que custa.</p>
    <a class="more" href="/pt/escopo/">Escopo técnico →</a></div>
  <div class="card"><h3>Escreva as três linhas</h3>
    <p>Um header, sem sistema de build, sem configuração.</p>
    <a class="more" href="/pt/comece/">Comece →</a></div>
</div>
</section>
::
