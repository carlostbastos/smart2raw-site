---
title: Onde o Smart2Raw se encaixa — bancos de dados, sistemas operacionais, telemetria, IA, embarcado
description: Todos esses sistemas já têm uma coluna de inteiros dentro. Sete lugares onde classificar por amplitude e manter os bytes nativos muda o que o sistema custa para rodar.
---

# Onde isso se encaixa

A pergunta é sempre a mesma: **onde está a coluna de inteiros?** Quando você
começa a procurar, ela está em quase tudo — e quase sempre com oito bytes,
porque ninguém mediu.

Cada seção abaixo diz três coisas: a coluna que já existe naquele sistema, o que
muda quando ela é classificada, e por onde começar.

## Bancos de dados e mecanismos colunares

**A coluna que já está lá.** Chaves primárias e estrangeiras, códigos de status,
ordinais de enum, datas como número de dia, contadores, ids de partição. Num
layout colunar a coluna *é* a unidade de armazenamento, então este é o encaixe
mais direto que existe.

**O que muda.** Mecanismos colunares já codificam inteiros — dicionário,
empacotamento de bits, delta. O que todos têm em comum é um **passo de
decodificação**: os bytes em disco não são os valores, então alguma coisa
precisa reconstruí-los antes de um predicado rodar. O Smart2Raw elimina esse
passo por construção. Uma coluna `uint8_t` é um vetor de `uint8_t`, então o
`count_gt` caminha nele direto e uma varredura custa exatamente o tráfego de
memória do tipo mais estreito — sem buffer de materialização, sem dicionário
residente em RAM, sem indireção por valor.

A segunda coisa que muda é a cauda. Toda codificação clássica tem uma forma em
que ela aumenta a entrada: medido em 4 milhões de elementos, o dicionário numa
coluna de timestamps de alta cardinalidade produz **41,01 MB contra uma linha de
base `int64` de 30,52 MB**. O pior caso do Smart2Raw empata com a linha de base,
nunca fica acima dela.

**Por onde começar.** A coluna quente de uma tabela. Classifique, mantenha o pool
residente e rode o seu predicado mais pesado nos dois caminhos — as respostas
têm de bater, e a demonstração da página inicial faz exatamente essa comparação
antes de você escrever qualquer código.

## Sistemas operacionais e Linux

**A coluna que já está lá.** Contadores de `/proc`, valores de mapas eBPF, PIDs,
inodes, uids e gids, tabelas de socket e de descritor de arquivo, timestamps de
log, contagens de syscall. Todos são inteiros com amplitude muito menor do que os
64 bits em que são carregados.

**O que muda.** A restrição em software de sistema raramente é velocidade bruta —
é contra o que você tem permissão de linkar. Um agente que vai rodar na máquina
de outra pessoa não pode arrastar junto uma biblioteca de compressão, um runtime
e um sistema de build. O Smart2Raw é **um header C11 sem dependência**, e tem um
modo enxuto (`-DS2R_NO_STDIO -DS2R_NO_MMAP -DS2R_NO_SIMD`) que compila onde
quase não há nada.

**Por onde começar.** Um buffer de métricas dentro de um daemon. Copie o header,
troque o anel de `uint64_t*` por um pool classificado, e meça a memória
residente.

## Observabilidade, IoT e telemetria

**A coluna que já está lá.** Série temporal de intervalo fixo: um timestamp a
cada 60 segundos, um sensor amostrado a taxa fixa, contadores monotônicos, ids de
dispositivo, enums de status.

**O que muda.** É nesta forma que dois mecanismos independentes se somam. Uma
coluna de timestamps amostrada a cada 60 s tem um **passo comum**, então
`v = base + 60·i` e o passo é dividido de forma exata — não por aproximação, por
gcd. E a amplitude local é muito menor que a global, então a forma em blocos
guarda cada bloco relativo ao próprio mínimo. Medido em 4 milhões de timestamps:
o pool plano ingênuo dá **15,26 MB e 0,73 ms**; a forma em blocos dá **4,11 MB e
0,04 ms**.

Há um terceiro ganho que na prática pesa mais que os dois: quando os metadados de
um bloco já decidem o bloco inteiro, o payload não é lido. Numa coluna que para
em 200, o `count_gt(220)` sai de **0,1435 ms para 0,000034 ms** — porque não foi
preciso olhar para nada.

**Por onde começar.** Sua janela de retenção. Pegue um dia de uma métrica, rode o
`s2r_recommend()` e compare com o que você guarda hoje.

## IA e aprendizado de máquina

**A coluna que já está lá.** Token ids e índices de vocabulário, ids de feature
numa feature store esparsa, offsets de dataset e de shard, listas de vizinhos
saindo de um índice vetorial, vetores de rótulo, contabilidade de atenção e de
cache. São vetores de inteiros com amplitude conhecida e normalmente estreita —
um vocabulário de 50.000 tokens precisa de 16 bits, não de 64.

**O que muda.** A inferência moderna é limitada por **banda de memória**, não por
aritmética. É por isso que quantização funciona. O Smart2Raw aplica a mesma
lógica ao lado inteiro do pipeline, com uma propriedade que a quantização não
tem: ele é **exato**. Não há aproximação nem calibração, porque a classe é
escolhida a partir da amplitude real e nada é arredondado. E como os bytes
guardados são inteiros nativos, eles entram direto em quem os lê — não há passo
de desquantização para pagar na entrada.

**Por onde começar.** Os vetores de token id de um dataset, ou as listas de
vizinhos de um índice vetorial. Os dois são grandes, os dois são inteiros, e os
dois quase sempre são carregados em 64 bits.

## Embarcado, MCU, edge e automotivo

**A coluna que já está lá.** Qualquer buffer de leitura: amostras de ADC, valores
de barramento CAN, contadores, temporizadores.

**O que muda.** Memória é o orçamento, e o orçamento é fechado no projeto. Caber
quatro vezes mais amostras no mesmo buffer ali não é otimização — é outro
produto. E a restrição que normalmente mata uma biblioteca num microcontrolador
não se aplica aqui: não exige alocador, não exige stdio, não exige sistema de
arquivos, não exige SIMD, não exige sistema de build. O modo enxuto não é uma
promessa, é uma das suítes de teste.

**Por onde começar.** O buffer de amostras. Classifique uma vez, na amplitude que
o seu sensor de fato produz.

## Mercado financeiro

**A coluna que já está lá.** Preços em centavos — o que é um passo de 1, 5 ou 25
conforme o tick size. Timestamps de nanossegundo. Ids de instrumento. Volumes.
Níveis de livro de ofertas.

**O que muda.** Dado de tick é o retrato do caso ideal: preço com passo,
timestamp com passo, id de amplitude pequena, e volumes muito mais estreitos que
64 bits. Medido em 12 milhões de elementos, uma coluna com passo sai de **22,89
MB e 1,033 ms para 11,44 MB e 0,468 ms** — metade do espaço e metade do tempo,
por dividir um passo que já estava no dado.

**Por onde começar.** Um instrumento, um dia. O passo é detectado numa única
passagem, então em segundos você sabe se o seu dado tem um.

## Ferramentas de desenvolvedor

**A coluna que já está lá.** Tabelas de símbolos, offsets de string, índices de
relocação, tabelas de número de linha, contadores de cobertura, amostras de
profiling — o interior de todo compilador, linker, depurador e formato binário.

**O que muda.** São exatamente as colunas em que a amplitude é conhecida no
projeto e ignorada mesmo assim. E um header único sem dependência entra num build
que já tem opinião formada sobre a própria toolchain.

**Por onde começar.** A tabela de offsets do formato que você já lê.

---

## O que os sete têm em comum

::html
<div class="cards">
  <div class="card"><h3>Os bytes continuam executáveis</h3>
    <p>Sem passo de decodificação, sem materialização, sem dicionário na memória. O que está
    guardado é o que o processador lê.</p></div>
  <div class="card"><h3>Ele não pode aumentar o seu dado</h3>
    <p>A classificação é por amplitude, e a classe mais larga é o int64 de entrada. O pior caso
    empata com a linha de base — nunca a excede.</p></div>
  <div class="card"><h3>Não há o que instalar</h3>
    <p>Um header C11. Sem dependência, sem sistema de build, sem configuração, e um modo enxuto
    para máquinas que quase não têm nada.</p></div>
</div>
::

O jeito mais rápido de saber se a sua coluna é uma dessas é
[colar ela na demonstração](/pt/) — ela roda no seu navegador, na sua máquina, e
nada do que você colar sai de lá.
