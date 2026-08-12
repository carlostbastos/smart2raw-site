---
title: Escopo técnico — o que o Smart2Raw é, e onde está a troca
description: A decisão de projeto dita sem rodeio: a menor classe nativa tem 8 bits, e tudo que a abordagem compra — e abre mão — decorre disso.
---

::html
<section class="hero">
  <p class="slogan">Onde está a troca.</p>
  <h1>Escopo técnico</h1>
  <p class="lead">Esta página existe para o engenheiro que vai testar a biblioteca com o dado dele e quer saber, de antemão, exatamente o que está escolhendo. Nada aqui contradiz o resto do site — é a mesma decisão de projeto dita pelo outro lado.</p>
  <p class="qual">Aqui está a única troca, dita sem rodeio e com o número que a mede — e os limites que vale declarar antes de você descobrir sozinho.</p>
  <div class="cta">
    <a class="btn" href="/pt/desempenho/">Os números completos</a>
    <a class="btn ghost" href="/pt/como-funciona/">Como funciona</a>
    <a class="btn ghost" href="https://github.com/carlostbastos/Smart2Raw">O código</a>
  </div>
  <div class="kpis">
    <div class="kpi"><b>8 bits</b><small>a menor classe nativa. A troca inteira sai daqui, e ela é decisão, não descuido</small></div>
    <div class="kpi"><b>1,91 MB</b><small>o dicionário, contra os 3,82 MB do Smart2Raw: onde ele ganha, e é um fator de dois</small></div>
    <div class="kpi"><b>41,01 MB</b><small>o mesmo dicionário, contra uma linha de base de 30,52 MB: onde ele aumenta a coluna</small></div>
    <div class="kpi"><b>7,9 ms</b><small>de materialização que o dicionário paga em cada varredura e o Smart2Raw não paga</small></div>
  </div>
</section>
::

## O que ele é

Um **classificador**, não um compressor. Ele mede a amplitude real de uma coluna
de inteiros, guarda na menor classe nativa que essa amplitude exige — 8, 16, 32
ou 64 bits, com ou sem sinal — e depois deixa os bytes em paz, para que toda
operação rode direto em cima deles.

Daí saem três formas: o pool plano, a forma afim (`v = base + passo·i`, com o
passo achado por gcd) e a forma em blocos (cada bloco relativo ao próprio mínimo,
com metadados que respondem consultas sem tocar no payload). O `s2r_recommend()`
mede as três; o `s2r_blocked_plan()` precifica todos os tamanhos de bloco
candidatos a partir de uma única passagem.

## A única troca, dita sem rodeio

**A menor classe nativa tem 8 bits.** Não há classe de 4 bits, nem de 3, nem
empacotamento de bits. Então numa coluna com poucos valores distintos espalhados
por uma amplitude larga — digamos 12 valores distintos — um dicionário com
códigos de 4 bits guarda menos. Medido em 4 milhões de elementos: dicionário 1,91
MB contra 3,82 MB. É um fator de dois, e é real.

**E o custo não é só de espaço.** Nesse mesmo regime o par também responde mais
rápido: **0,326 ms contra 0,468 ms**, 1,44× do lado dele. Dizer que a troca custa
bytes e parar aí seria contar metade — quando a amplitude é estreita o bastante
para códigos de 4 bits caberem, o dicionário ganha nos dois eixos, e é honesto
saber disso antes de escolher.

Essa ausência é a decisão, não um descuido. Códigos de menos de um byte são o que
obriga a existir um passo de decodificação, e o passo de decodificação é o que a
abordagem inteira existe para eliminar. Manter a classe em 8 bits é o que faz os
bytes guardados serem um vetor que o processador já sabe ler: sem materialização,
sem dicionário residente na memória, sem indireção por valor. No mesmo benchmark,
materializar a coluna de dicionário custa 7,9 ms que o Smart2Raw simplesmente não
paga.

Onde a amplitude é larga — que é a maior parte do dado real — a comparação se
inverte, e quem cresce é o dicionário: 41,01 MB contra uma linha de base de 30,52
MB numa coluna de alta cardinalidade.

## O que ele não vai fazer com o seu dado

- **Não vai aumentar.** A classe mais larga é o `int64` de entrada, então o pior
  caso empata com a linha de base. O `benchmarks/format_matrix.c` verifica esse
  limite por asserção antes de imprimir cada linha.
- **Não vai aproximar.** Sem arredondamento, sem quantização, sem calibração. A
  classe vem da amplitude real e todo valor volta exato.
- **Não vai corromper em silêncio.** Um arquivo `.s2r` carrega CRC32 e é
  conferido na carga; uma classe estreita demais para um valor é erro, não
  truncamento.

## Versões e compatibilidade de arquivo

| versão | DOI | nota |
|---|---|---|
| 3.5.1 | [10.5281/zenodo.21676456](https://doi.org/10.5281/zenodo.21676456) | **atual** — correção de segurança no leitor em blocos |
| 3.5.0 | [10.5281/zenodo.21623772](https://doi.org/10.5281/zenodo.21623772) | **um `.s2r` hostil podia escrever fora do heap** — atualize |
| 3.4.0 | [10.5281/zenodo.21614309](https://doi.org/10.5281/zenodo.21614309) | **corrupção silenciosa em coluna sem sinal acima de 2^63** — atualize |
| todas | [10.5281/zenodo.20477234](https://doi.org/10.5281/zenodo.20477234) | DOI do projeto |

Uma coluna sem passo comum é escrita pela 3.5.x **byte a byte** como a 3.4.0
escrevia, e abre na 3.4.0. Uma coluna com passo é `fmt = 3`, e a 3.4.0 a recusa
corretamente em vez de ler errado. As duas direções foram medidas, não supostas.
A 3.5.1 não mexe em nenhum byte do formato: ela só passou a recusar arquivos que
a 3.5.0 aceitava e não devia.

## O defeito da 3.5.0, e o que ele exigia

O leitor da forma em blocos dimensionava o corpo que ia ler como
`nblocks × metadados + bytes`. Os **dois** termos vêm do disco, e a soma era feita
em `size_t` puro. Um arquivo que declara `nblocks = 2^22` e um `bytes` perto de
2^64 faz a soma **dar a volta** e virar 16: o leitor aloca dezesseis bytes e
copia quatro megabytes para dentro.

Esse arquivo tem 64 bytes e passa por **todas** as validações que já existiam —
magia, `fmt`, as quatro classes, `nblocks == teto(count/block)`, todos os campos
dentro do limite, **CRC32 correto sobre o corpo real** e EOF exato. Não há nada
malformado nele. Corrupção acidental quebra o CRC; corrupção proposital vem com o
CRC certo, e era exatamente essa diferença que faltava enxergar.

**Quem era afetado:** só quem chama `s2r_blocked_load()` sobre um arquivo que não
escreveu. Escrever nunca foi afetado — ali os dois termos descrevem uma estrutura
que já existe na memória. E o pool plano nunca foi afetado: ele já fazia
`count > SIZE_MAX/eb` desde a 3.3. Foi um único lugar da família de leitores que
ficou sem a guarda que as irmãs dele tinham.

A 3.5.1 fecha com duas travas: a conta passa a ser feita em aritmética checada, e
o corpo declarado precisa caber no arquivo. O arquivo hostil virou teste fixo —
contra o cabeçalho da 3.5.0 ele aborta sob AddressSanitizer; contra o da 3.5.1 ele
passa, junto com um arquivo honesto que continua carregando e somando certo,
porque uma guarda que também recusa dado real não é conserto.

## Limites que vale declarar

- **Colunas booleanas.** Um bit de informação guardado em um byte. Um bitmap é 8×
  menor e o popcount responde cerca de 17× mais rápido. Se a sua coluna é uma
  flag, use bitmap.
- **`S2R_BLOCK_DEFAULT` é um padrão, não um ótimo.** Ele é batido em duas de três
  formas medidas. Use o `s2r_blocked_build_auto()`, que planeja em vez de chutar.
- **`fit_class()` não muda a presença de sinal.** Uma coluna declarada com sinal
  que nunca recebe um negativo continua com o dobro da largura de que precisa —
  é para isso que existe o `s2r_fit_class_signedness()` separado, e depois da
  cura um push negativo é recusado.
- **Um navegador mede o que um navegador mede.** Para número comparável a
  servidor, use os benchmarks em C do repositório.

## A versão avançada

O que está publicado aqui é a versão aberta, sob AGPL-3.0-or-later. Existe uma
versão mais avançada que não é publicada — veja o [Smart2Raw Premium](/pt/premium/),
alcançado pela [licença comercial](/pt/licenciamento/).

::html
<section class="next">
<h2>Por onde seguir</h2>
<div class="cards">
  <div class="card"><h3>Confira você mesmo</h3>
    <p>Todo número desta página sai de um programa do repositório.</p>
    <a class="more" href="/pt/desempenho/">Desempenho →</a></div>
  <div class="card"><h3>Onde a aberta para de propósito</h3>
    <p>É exatamente ali que a versão licenciada começa.</p>
    <a class="more" href="/pt/premium/">Smart2Raw Premium →</a></div>
  <div class="card"><h3>Teste com o seu dado</h3>
    <p>A demonstração roda a biblioteca de verdade, no seu navegador.</p>
    <a class="more" href="/pt/#s2rdemo">Ir para a demonstração →</a></div>
</div>
</section>
::
