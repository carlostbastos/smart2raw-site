---
title: Desempenho do Smart2Raw — 4M elementos, tudo reproduzível
description: A mesma coluna em sete formatos, os tempos de consulta e a comparação contra o SQLite — cada tabela com o comando que a imprime na sua máquina.
---

::html
<section class="hero">
  <p class="slogan">Medido, não estimado.</p>
  <h1>Desempenho</h1>
  <p class="lead">Todo número desta página saiu de um programa que está no repositório, e todos podem ser reproduzidos por um comando que você roda. Onde um número podia ser conferido contra um laço ingênuo, o programa confere e aborta se houver divergência — um benchmark que imprime um número bonito que não sabe defender é pior que benchmark nenhum.</p>
  <p class="qual">Sete formas de coluna, 4 milhões de elementos cada, os tempos de consulta, e o comando de cada tabela. Inclusive as linhas em que o Smart2Raw não ganha — elas estão aqui pelo mesmo motivo que as outras.</p>
  <div class="cta">
    <a class="btn" href="/pt/#s2rdemo">Meça no seu navegador</a>
    <a class="btn ghost" href="https://github.com/carlostbastos/Smart2Raw">Rodar você mesmo</a>
    <a class="btn ghost" href="/pt/escopo/">Escopo técnico</a>
  </div>
  <div class="kpis">
    <div class="kpi"><b>4231×</b><small>contagem por faixa numa coluna u8, com o índice cumulativo — duas leituras de 2 KB</small></div>
    <div class="kpi"><b>0,000034 ms</b><small>count_gt(220) numa coluna que para em 200: o resumo de zona responde sem ler payload</small></div>
    <div class="kpi"><b>31</b><small>suítes de teste, 0 falhas, limpo sob ASan e UBSan</small></div>
    <div class="kpi"><b>100.950</b><small>checagens de fuzz diferencial contra uma referência ingênua, com sementes fixas</small></div>
  </div>
</section>
::

## A mesma coluna em todos os formatos

Sete formas de coluna, 4 milhões de elementos cada, tamanhos em MB. `S2R` é a
menor forma que a biblioteca sabe produzir para aquela forma de coluna.

{{FIG_MATRIZ}}

::html
<p class="figcap">As duas barras vermelhas passaram da entrada: numa coluna de alta cardinalidade o
dicionário guarda um dicionário do tamanho do dado, e devolve 41,01 MB para os 30,52 MB que
recebeu. O Smart2Raw não tem barra assim — a classe mais larga que ele tem <b>é</b> a entrada.
Repare também nas linhas B, C e D, onde o clássico ganha: elas estão no gráfico pelo mesmo
motivo que as outras. <b>E repare no que este gráfico não mede:</b> ele conta bytes, e bytes
são só um eixo — o outro está logo abaixo.</p>
::

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

## Bytes é só um eixo

A tabela acima responde "quanto ocupa". Ela não responde a pergunta que vem depois,
que é a que decide o custo de rodar: **o que dá para perguntar aos bytes sem antes
transformá-los em outra coisa.**

Este gráfico isola exatamente isso. A coluna é a mesma e os dois formatos ocupam
praticamente o mesmo espaço — 11,44 MB contra 11,45 MB. Com os bytes empatados, o
que sobra no desenho é só processamento.

{{FIG_OPERACOES}}

::html
<p class="figcap">* Chegar a um kernel que não é SQL: um produto escalar quantizado, uma convolução,
um matmul int8, um filtro de DSP — cada um precisa de um buffer contíguo na largura nativa.
O formato de armazém precisa <b>produzir</b> esse buffer antes de começar. O nosso pool já é
esse buffer.</p>
::

O par aqui não é um espantalho. O dicionário está implementado no seu melhor, com
os valores distintos **ordenados** — e isso faz o predicado virar uma comparação
nos próprios códigos, sem decodificar nada. É por isso que o `COUNT` dá empate, e é
por dizer isso que as outras duas linhas merecem crédito.

- **`COUNT` empata.** 1,05×, com a faixa das cinco execuções cruzando 1,00 nos dois
  sentidos. Um dicionário ordenado não custa nada aqui — e também não compra nada.
- **`SUM` não tem esse atalho.** Um código não é um operando que se some: o par
  precisa histogramar os códigos e só depois dobrar o dicionário em cima. Essa
  dispersão é estrutural, e são 17× medidos.
- **Os 7,9 ms da terceira linha não se movem.** Não é implementação lenta — é a
  definição do formato, e nenhum descompactador melhor remove, porque o buffer de
  saída tem de existir em algum lugar. É a única medida deste conjunto que um par
  mais bem implementado não consegue mudar.

E onde perdemos está medido junto. Numa coluna de 12 valores distintos espalhados
por uma amplitude larga, o par com códigos de 4 bits ganha: **11,44 MB contra 5,72 MB
e 0,468 ms contra 0,326 ms** — 2× maior e 1,44× mais lento do nosso lado. O piso é
aritmético: 12 valores distintos precisam de log₂(12) = 3,58 bits, o par usa 4, e a
menor classe nativa aqui é 8. Essa ausência é a decisão que compra os 7,9 ms da
terceira linha acima, não um descuido.

O relatório completo — inclusive o que foi retratado de uma versão anterior dele —
está em `benchmarks/warehouse/WAREHOUSE_FORMAT_BENCH.md`. Ele mede a 3.4.0, quando a
mesma perda era de 4× e 3,2×; a fatoração afim da 3.5.0 é o que a reduziu.

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

## Contra um banco de verdade: o SQLite

As tabelas acima comparam contra formatos. Um formato é uma abstração, e quase
ninguém tem uma em produção — quase todo mundo tem um SQLite. O
`benchmarks/maestro/` compara contra ele: mesmo CSV de entrada, um banco `.db` e
um conjunto de `.s2r` escritos em disco de verdade, os dois abríveis depois.

::html
<div class="tw"><table>
<thead><tr><th>o quê</th><th>SQLite / int64</th><th>Smart2Raw</th><th>ganho</th><th>tipo</th></tr></thead>
<tbody>
<tr><td><code>SUM</code> nas 12 colunas que compactam</td><td>2635 µs</td><td><b>16,3 µs</b></td><td><b>161×</b></td><td>medido</td></tr>
<tr><td><code>COUNT</code> com filtro</td><td>3900 µs</td><td><b>69,5 µs</b></td><td><b>56×</b></td><td>medido</td></tr>
<tr><td>tamanho em disco</td><td>412,0 KB</td><td><b>275,7 KB</b></td><td>1,49× menor</td><td>exato</td></tr>
<tr><td>memória residente</td><td>934,8 KB</td><td><b>342,2 KB</b></td><td>2,73×</td><td>exato</td></tr>
<tr><td>dado movido por varredura</td><td>868,1 KB</td><td><b>275,4 KB</b></td><td>3,15×</td><td>exato</td></tr>
<tr><td>vazão de <code>SUM</code> em SIMD</td><td>2131 Mval/s</td><td><b>7005 Mval/s</b></td><td>3,29×</td><td>medido</td></tr>
<tr><td>vazão do filtro por faixa</td><td>1416 Mval/s</td><td><b>1668 Mval/s</b></td><td>1,18×</td><td>medido</td></tr>
</tbody></table></div>
::

```sh
python benchmarks/maestro/smart2raw_bench.py os_seus_dados.csv
```

Python aqui é só o maestro: usa a biblioteca padrão para o SQLite e chama os
kernels C reais por `ctypes` — o motor nativo é compilado do `s2r_shim.c` na
primeira execução. Sem compilador, ele ainda imprime memória, disco e dado movido,
que são contagens exatas, e pula as duas seções cronometradas. Colunas que de fato
precisam de 64 bits, ou que são ponto flutuante, aparecem com **0%** de propósito.

**O que esses 161× não são.** O SQLite entrega SQL, índices, transações e
durabilidade; aqui ele está fazendo um trabalho só — varrer e agregar colunas
inteiras, sem índice — contra uma coluna feita exatamente para esse trabalho. O
número mede a distância entre um motor genérico que interpreta bytecode linha a
linha e um laço SIMD sobre bytes contíguos. Não é um defeito do SQLite; é o preço
da generalidade, e ele é enorme justamente por isso.

**E o dado é pequeno de propósito** — o CSV de demonstração tem uns 670 KB, então
tudo cabe em cache e o que domina é o custo por linha do interpretador. Num dado
muito maior a razão cronometrada não se mantém; o que se mantém são as três linhas
marcadas como **exatas**, porque elas são contagem de bytes, não relógio: 1,49× em
disco, 2,73× em memória, 3,15× de dado movido por varredura.

**Repare no 1,18×.** O filtro por faixa quase não melhora, e a linha está aqui por
isso. `SUM` em `u8` processa oito valores por lane onde o `int64` processa um, e
salta para 3,29×; o filtro já era barato por elemento e o gargalo dele é outro. Um
ganho de espaço não vira ganho de tempo por decreto — vira quando a operação era
limitada por memória, e essa linha é o contraexemplo dentro da nossa própria tabela.

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
  com RVV, big-endian, e em modo enxuto sem stdio, sem mmap e sem SIMD. Só o
  x86-64 é hardware real; **ARM64 e big-endian (s390x) a CI repete a cada commit
  na ISA real, em máquina emulada por QEMU** — e no caso do big-endian o job
  imprime a ordem de bytes de dentro do binário antes de testar qualquer coisa,
  com **250.212 checagens, 0 falhas** em cima dela. Os núcleos RVV e SVE2 rodam
  contra referência escalar com o comprimento de vetor varrido de 128 a 1024
  bits, que é mais do que uma placa só daria.
- Compatibilidade de arquivo medida nas **duas** direções entre versões.

```sh
bash scripts/build_and_test.sh
```

Essa suíte de fuzz existe por causa de um defeito real que ela encontrou: uma
coluna sem sinal que cruzava 2^63 devolvia valores truncados na camada em blocos,
sem erro, sem aviso e com CRC válido. Vinte e cinco suítes de casos escolhidos
não pegaram. Está corrigido, e o caso mínimo `{1, UINT64_MAX}` hoje é um teste
fixo.

::html
<section class="next">
<h2>Por onde seguir</h2>
<div class="cards">
  <div class="card"><h3>Onde a troca está</h3>
    <p>A linha em que o dicionário ganha, dita sem rodeio, com o número.</p>
    <a class="more" href="/pt/escopo/">Escopo técnico →</a></div>
  <div class="card"><h3>Reproduza tudo</h3>
    <p>Um clone e um comando. As sementes do fuzz são fixas de propósito.</p>
    <a class="more" href="/pt/citar/">Como citar e reproduzir →</a></div>
  <div class="card"><h3>Meça o seu dado</h3>
    <p>A demonstração cronometra as mesmas consultas na sua coluna.</p>
    <a class="more" href="/pt/#s2rdemo">Ir para a demonstração →</a></div>
</div>
</section>
::
