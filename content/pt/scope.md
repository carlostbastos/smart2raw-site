---
title: Escopo técnico — o que o Smart2Raw é, e onde está a troca
description: A decisão de projeto por trás da biblioteca dita sem rodeio: a menor classe nativa tem 8 bits, e tudo o que a abordagem compra vem daí.
---

# Escopo técnico

Esta página existe para o engenheiro que vai testar a biblioteca com o dado dele
e quer saber, de antemão, exatamente o que está escolhendo. Nada aqui contradiz o
resto do site — é a mesma decisão de projeto dita pelo outro lado.

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
| 3.5.0 | [10.5281/zenodo.21623772](https://doi.org/10.5281/zenodo.21623772) | atual — fatoração afim, planejador, índice cumulativo |
| 3.4.0 | [10.5281/zenodo.21614309](https://doi.org/10.5281/zenodo.21614309) | **tem defeito de corrupção silenciosa em coluna sem sinal acima de 2^63** — atualize |
| todas | [10.5281/zenodo.20477234](https://doi.org/10.5281/zenodo.20477234) | DOI do projeto |

Uma coluna sem passo comum é escrita pela 3.5.0 **byte a byte** como a 3.4.0
escrevia, e abre na 3.4.0. Uma coluna com passo é `fmt = 3`, e a 3.4.0 a recusa
corretamente em vez de ler errado. As duas direções foram medidas, não supostas.

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
