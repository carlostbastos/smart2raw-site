---
title: Desempenho do Smart2Raw — números medidos, com o comando que os reproduz
description: A mesma coluna em todos os formatos, medida em 4 milhões de elementos, com uma asserção conferida antes de cada linha impressa. Mais os tempos de consulta, e como rodar tudo você mesmo.
---

# Desempenho

Todo número desta página saiu de um programa que está no repositório, e todos
podem ser reproduzidos por um comando que você roda. Onde um número podia ser
conferido contra um laço ingênuo, o programa confere e aborta se houver
divergência — um benchmark que imprime um número bonito que não sabe defender é
pior que benchmark nenhum.

## A mesma coluna em todos os formatos

Sete formas de coluna, 4 milhões de elementos cada, tamanhos em MB. `S2R` é a
menor forma que a biblioteca sabe produzir para aquela forma de coluna.

| coluna | int64 | S2R | dicionário | RLE | bitmap | forma S2R |
|---|---:|---:|---:|---:|---:|---|
| A · uniforme 0..200 (telemetria) | 30,52 | **3,81** | 3,82 | 30,37 | — | pool plano |
| B · 12 valores distintos em 500..11500 | 30,52 | 3,82 | **1,91** | 27,97 | — | em blocos |
| C · a mesma, ORDENADA | 30,52 | **0,06** | 1,91 | 0,00 | — | em blocos |
| D · booleana 0/1 | 30,52 | 3,81 | 0,48 | 15,26 | **0,48** | pool plano |
| E · timestamps a cada 60 s | 30,52 | **4,11** | 41,01 | 30,52 | — | em blocos |
| F · u64 aleatório (entropia máxima) | 30,52 | **30,52** | 41,01 | 30,52 | — | pool plano |
| G · ids em 0..1e6 (alta cardinalidade) | 30,52 | **15,26** | 17,03 | 30,52 | — | pool plano |

```sh
cc -O2 -std=c11 -I include benchmarks/format_matrix.c -o format_matrix
./format_matrix 4000000
```

A coluna do dicionário é o **piso teórico** daquele formato — códigos de
`ceil(log2(k))` bits mais um dicionário de `k` valores a 8 bytes, sem somar
nenhum overhead de implementação. É o número mais generoso que o formato pode
produzir.

**Leia a linha E e a linha F.** Numa coluna de cardinalidade alta o dicionário
fica do tamanho do dado, e o total vai a 41,01 MB contra uma linha de base de
30,52 MB — o formato deixou a coluna maior do que ela era. O RLE faz o mesmo em
tudo que não está ordenado, uma corrida por valor. E o bitmap só existe quando há
exatamente dois valores distintos.

O Smart2Raw não tem linha assim, e não por ajuste fino: ele classifica por
**amplitude**, e a classe mais larga que tem *é* o `int64` de entrada. A linha F
é a prova — entropia máxima, e o resultado empata exatamente com a linha de base.
O `assert(s <= raw)` roda dentro do laço, antes de cada linha ser impressa.

## Tempos de consulta

| o quê | antes | depois | de onde vem |
|---|---:|---:|---|
| `count_gt` em 8M elementos ordenados | 0,371 ms | abaixo do relógio | a ordem é mantida, então a busca binária se aplica |
| `count_gt(220)` numa coluna que para em 200 | 0,1435 ms | 0,000034 ms | o resumo de zona responde sem ler payload |
| contagem por faixa numa coluna `u8` | — | **4231×** | o índice cumulativo: duas leituras de 2 KB que não crescem com o dado |
| 12M elementos com passo | 22,89 MB / 1,033 ms | 11,44 MB / 0,468 ms | o passo comum é dividido, de forma exata |
| 4M timestamps, forma errada x forma certa | 15,26 MB / 0,73 ms | 4,11 MB / 0,04 ms | o `s2r_recommend()` escolhe a forma em blocos |

O índice cumulativo se paga em **11 consultas** e depois não custa mais nada,
porque 2 KB não crescem com a coluna. E ele recusa a resposta quando está
desatualizado: o pool carrega uma época, toda escrita a incrementa, e o índice
registra a época em que foi construído.

## Meça no seu próprio navegador

A demonstração da [página inicial](/pt/) cronometra as mesmas consultas no seu
dado, no seu navegador, com aquecimento e argumento variando para que nada possa
ser cacheado — e imprime o resultado de cada caminho, para você ver que eles
concordam.

Ela também vai te mostrar onde o ganho de espaço não vira ganho de tempo: numa
coluna pequena o bastante para caber no cache, ler um quarto dos bytes não leva
um quarto do tempo. Aumente o número de elementos e a diferença aparece.

## Como tudo isso é conferido

- **31 suítes de teste, 0 falhas**, incluindo um fuzz diferencial de 100.950
  checagens contra uma referência ingênua, com sementes fixas.
- Limpo sob ASan e UBSan.
- O mesmo código rodado em x86-64 com SSE2 e AVX2, ARM com NEON e SVE2, RISC-V
  com RVV, big-endian, e em modo enxuto sem stdio, sem mmap e sem SIMD.
- Compatibilidade de arquivo medida nas **duas** direções entre versões.

```sh
bash scripts/build_and_test.sh
```

Essa suíte de fuzz existe por causa de um defeito real que ela encontrou: uma
coluna sem sinal que cruzava 2^63 devolvia valores truncados na camada em blocos,
sem erro, sem aviso e com CRC válido. Vinte e cinco suítes de casos escolhidos
não pegaram. Está corrigido, e o caso mínimo `{1, UINT64_MAX}` hoje é um teste
fixo.
