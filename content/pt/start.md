---
title: Comece a usar o Smart2Raw — um header, três linhas
description: Copie um header para o seu projeto e classifique uma coluna em três linhas de C. Downloads da biblioteca, da demonstração em arquivo único e de um executável de Windows sem dependência.
---

::html
<section class="hero">
  <p class="slogan">O passo de instalação é copiar um arquivo.</p>
  <h1>Comece</h1>
  <p class="lead">Não há o que instalar. O Smart2Raw é um único header C11, sem dependência, sem sistema de build e sem configuração.</p>
  <p class="qual">Copie o header para o seu projeto e classifique uma coluna em três linhas de C. Se preferir não escrever código ainda, há a demonstração em arquivo único e um executável de Windows sem instalador, os dois logo abaixo.</p>
  <div class="cta">
    <a class="btn" href="https://github.com/carlostbastos/Smart2Raw">Baixar do GitHub</a>
    <a class="btn ghost" href="/assets/smart2raw-live-pt.html" download>A demonstração em um arquivo</a>
    <a class="btn ghost" href="/assets/s2r-probe.exe" download>Executável de Windows</a>
  </div>
  <div class="kpis">
    <div class="kpi"><b>1</b><small>arquivo: smart2raw.h, C11, sem sistema de build e sem configuração</small></div>
    <div class="kpi"><b>3</b><small>linhas para classificar, guardar e operar</small></div>
    <div class="kpi"><b>0</b><small>dependências — nem para compilar, nem em tempo de execução</small></div>
    <div class="kpi"><b>7</b><small>alvos de hardware com a mesma suíte passando, do Xeon ao microcontrolador</small></div>
  </div>
</section>
::

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
    <p>Código-fonte, 31 suítes de teste, benchmarks, exemplos e ports para outras linguagens. O GitHub traz a <b>3.5.1</b>, que é uma correção de segurança sobre a 3.5.0 sem mudança de API nem de formato.</p>
    <a class="more" href="https://github.com/carlostbastos/Smart2Raw">GitHub →</a><br>
    <a class="more" href="https://doi.org/10.5281/zenodo.21623772">Zenodo, DOI da 3.5.0 →</a></div>
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

Vale dizer como cada um é verificado, porque não é a mesma coisa. **ARM64 e
big-endian a integração contínua repete em máquina real**, via QEMU, a cada
commit. Os núcleos **RVV e SVE2 rodam de verdade** — o código vetorial que vai
para o hardware, não uma reimplementação — conferidos elemento a elemento contra
uma referência escalar, com o **comprimento de vetor varrido de 128 a 1024 bits**
e com as bordas de tira e as caudas exercitadas explicitamente. Uma placa real
teria dado um comprimento só; a varredura cobre a família inteira, que é
exatamente o que um kernel agnóstico de comprimento precisa provar.

## Licença

A versão publicada está sob **AGPL-3.0-or-later**. Se você pretende embutir o
Smart2Raw em algo que não vai publicar sob a mesma licença, isso exige uma
[licença comercial](/pt/licenciamento/) — que é também o caminho para a versão
avançada.

::html
<section class="next">
<h2>Por onde seguir</h2>
<div class="cards">
  <div class="card"><h3>Entenda o que acabou de rodar</h3>
    <p>Os três passos, e por que não há decodificação no meio.</p>
    <a class="more" href="/pt/como-funciona/">Como funciona →</a></div>
  <div class="card"><h3>Compare com o seu formato atual</h3>
    <p>A mesma coluna em sete formatos, com o comando de cada linha.</p>
    <a class="more" href="/pt/desempenho/">Desempenho →</a></div>
  <div class="card"><h3>Antes de embutir em produto</h3>
    <p>A versão publicada é AGPL. Produto fechado pede outra conversa.</p>
    <a class="more" href="/pt/licenciamento/">Licenciamento →</a></div>
</div>
</section>
::
