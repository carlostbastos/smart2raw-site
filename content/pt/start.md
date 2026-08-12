---
title: Comece a usar o Smart2Raw — um header, três linhas
description: Copie um header para o seu projeto e classifique uma coluna em três linhas de C. Com ferramentas de linha de comando, demo no navegador e um .exe.
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
    <div class="kpi"><b>4</b><small>alvos com a suíte passando — x86-64 em hardware real; ARM64 com NEON e s390x big-endian na ISA real sob QEMU, a cada commit; e o modo de microcontrolador. RVV e SVE2 são experimentais</small></div>
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

## Sem escrever C: as ferramentas de linha de comando

Se você quer avaliar antes de escrever código, o repositório traz três programas.
Um `make` dentro de `tools/` compila os três, e eles não pedem nada além do `gcc`.

```sh
s2r pack   dados.txt coluna.s2r          # texto → .s2r, classificando
s2r info   coluna.s2r                    # a classe escolhida, a contagem, o tamanho
s2r agg    coluna.s2r count-gt 100       # a consulta, direto no arquivo
s2r verify coluna.s2r                    # magia, classe, contagem e CRC32
```

O `s2r_verify` existe separado por um motivo: ele sai com **código 0 quando o
arquivo está íntegro** e diferente de zero quando não está, então serve dentro de
script e de CI sem precisar interpretar saída. E o `s2r_convert` fecha o ciclo —
converte, processa na forma compacta e desconverte — com um teto de estouro que
**recusa** em vez de promover além dele:

```sh
s2r_convert dados.txt saida.txt --op mul --by 3 --cap 32
```

São 19 checagens em `tools/test_cli.sh`, e elas rodam junto com o resto.

## Downloads

::html
<div class="cards">
  <div class="card"><h3>A biblioteca</h3>
    <p>Código-fonte, 31 suítes de teste, benchmarks, exemplos e ports para outras linguagens. A versão corrente é a <b>3.5.1</b>, uma correção de segurança sobre a 3.5.0 sem mudança de API nem de formato.</p>
    <a class="more" href="https://github.com/carlostbastos/Smart2Raw">GitHub →</a><br>
    <a class="more" href="https://doi.org/10.5281/zenodo.21676456">Zenodo, DOI da 3.5.1 →</a></div>
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

Vale dizer como cada um é verificado, porque não é a mesma coisa. Em **hardware
real** roda um: x86-64, que é a máquina da integração contínua. **ARM64 e s390x
são ISA real em máquina emulada** (QEMU), a cada commit — as instruções e a ordem
de bytes são as do alvo; o silício não é. E vale ser específico sobre o que isso
prova, porque "big-endian" costuma ser uma palavra e não uma medida: antes de
qualquer teste, o job compila um binário s390x e o executa, e ele imprime
`__BYTE_ORDER__ : big` e o valor `0x01020304` gravado na memória como
`01 02 03 04`, saindo com erro se não for; em cima disso rodam **250.212
checagens em 16 suítes, 0 falhas**. O modo de microcontrolador
(`-DS2R_NO_STDIO -DS2R_NO_MMAP -DS2R_NO_SIMD`) é uma configuração de compilação,
não uma placa.

Os núcleos **RVV e SVE2 rodam de verdade** — o código vetorial que vai
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
