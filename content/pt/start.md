---
title: Comece a usar o Smart2Raw — um header, três linhas
description: Copie um header para o seu projeto e classifique uma coluna em três linhas de C. Downloads da biblioteca, da demonstração em arquivo único e de um executável de Windows sem dependência.
---

# Comece

Não há o que instalar. O Smart2Raw é um único header C11, sem dependência, sem
sistema de build e sem configuração.

## Três linhas

```c
#include "smart2raw.h"

S2RPool p;
s2r_pool_init(&p, s2r_classify_array(valores, n), n);    /* 1. classificar */
for (size_t i = 0; i < n; i++) s2r_push(&p, valores[i]);  /* 2. guardar     */
size_t k = s2r_count_gt_fast(&p, 100);                    /* 3. operar      */
```

Compile com o que você já tem:

```sh
cc -O2 -std=c11 -I include seu_programa.c -o seu_programa
```

## Deixe a biblioteca escolher a forma

A porta de entrada óbvia nem sempre é a certa. Em 4 milhões de timestamps o pool
plano dá 15,26 MB e 0,73 ms, enquanto a forma em blocos dá 4,11 MB e 0,04 ms —
então pergunte antes de decidir:

```c
S2RAdvice a;
s2r_recommend(valores, n, &a);
printf("melhor: %s, %zu bytes (linha de base %zu)\n", a.best, a.best_bytes, a.raw_bytes);
```

## Salvar e carregar

```c
S2RBlocked b;
s2r_blocked_build_auto(&b, valores, n);   /* o tamanho de bloco é planejado, não chutado */
s2r_blocked_save(&b, "coluna.s2r");
```

O arquivo é little-endian canônico com CRC32: é idêntico em qualquer máquina, e
um byte corrompido é pego na carga em vez de ser devolvido como dado.

## Downloads

::html
<div class="cards">
  <div class="card"><h3>A biblioteca</h3>
    <p>Código-fonte, 31 suítes de teste, benchmarks, exemplos e ports para outras linguagens.</p>
    <a class="more" href="https://github.com/carlostbastos/Smart2Raw">GitHub →</a><br>
    <a class="more" href="https://doi.org/10.5281/zenodo.21623772">Zenodo, versão 3.5.0 →</a></div>
  <div class="card"><h3>A demonstração, em arquivo único</h3>
    <p>A biblioteca inteira como WebAssembly dentro de um HTML só. Funciona sem internet, por
    <code>file://</code>, sem servidor. Nada do que você colar nela sai da sua máquina.</p>
    <a class="more" href="/assets/smart2raw-live-pt.html" download>smart2raw-live-pt.html →</a></div>
  <div class="card"><h3>Executável de Windows</h3>
    <p>Uma sonda de console sem CRT, sem DLL de runtime e sem instalador — doze importações do
    <code>kernel32</code> e mais nada. Aponte para uma coluna de um CSV.</p>
    <a class="more" href="/assets/s2r-probe.exe" download>s2r-probe.exe →</a></div>
</div>
::

```
s2r-probe.exe dados.csv --coluna 3 --salvar coluna.s2r
```

Ele imprime a classe escolhida, o tamanho contra `int64` e contra dicionário, RLE
e bitmap, a consulta cronometrada, e sai com código 0 só quando todas as
verificações internas passaram.

## Onde roda

O mesmo arquivo, com os mesmos testes passando: x86-64 com SSE2 e AVX2, ARM com
NEON e SVE2, RISC-V com RVV, máquinas big-endian, e microcontroladores em modo
enxuto (`-DS2R_NO_STDIO -DS2R_NO_MMAP -DS2R_NO_SIMD`). E, a partir deste site, em
WebAssembly e num PE de Windows ligado sem runtime de C.

## Licença

A versão publicada está sob **AGPL-3.0-or-later**. Se você pretende embutir o
Smart2Raw em algo que não vai publicar sob a mesma licença, isso exige uma
[licença comercial](/pt/licenciamento/) — que é também o caminho para a versão
avançada.
