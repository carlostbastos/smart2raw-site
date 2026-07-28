---
title: Sobre o Smart2Raw e seu autor — Carlos Alberto Terêncio de Bastos
description: Quem está por trás da biblioteca, como o projeto é conduzido, e a trilha de versões depositadas que documenta isso.
---

# Sobre

O Smart2Raw é escrito e mantido por **Carlos Alberto Terêncio de Bastos**, que
detém o direito autoral — e é isso que torna possível a licença dupla deste site.
Não há uma empresa entre você e o projeto: o que você escrever na
[página de contato](/pt/contato/) chega em quem escreveu o código.

## A ideia, em um parágrafo

Uma coluna de inteiros tem oito bytes por elemento porque uma declaração de tipo
disse isso, não porque o dado precisasse. O Smart2Raw mede a amplitude real e
guarda a coluna na menor classe **nativa** que essa amplitude exige — e então
para. Os bytes continuam sendo inteiros nativos, então toda operação roda direto
em cima deles, sem passo de decodificação para pagar. O nome inverte a promessa
usual de propósito: todo mundo se oferece para transformar dado bruto em algo
inteligente. Aqui a inteligência entra na classificação, e o que sai é raw.

## Como o projeto é conduzido

Três hábitos, e eles estão visíveis no repositório em vez de declarados aqui.

**Todo número vem junto com o programa que o produziu.** Nenhum benchmark imprime
um valor que não sabe defender; cada um verifica o que pode antes de imprimir, e
aborta se houver divergência em vez de reportar um resultado bonito.

**Casos de teste escolhidos herdam o ponto cego de quem escolheu.** É por isso que
existe uma suíte de fuzz diferencial com sementes fixas, e é por isso que ela
existe de fato: ela encontrou um defeito que vinte e cinco suítes de casos
cuidadosamente escolhidos não pegaram.

**Defeito se publica, não se enterra.** Quando a versão 3.4.0 se revelou capaz de
devolver valores truncados em colunas sem sinal que cruzam 2^63 — sem erro e com
CRC válido — a correção veio com o caso mínimo que reproduz, a explicação e um
aviso de atualização no topo da release. Isso está na página de
[escopo técnico](/pt/escopo/) hoje, onde qualquer um que avalie o projeto vai
ler.

## A trilha

| versão | depositada | o que trouxe |
|---|---|---|
| [3.5.0](https://doi.org/10.5281/zenodo.21623772) | 2026 | fatoração afim, o planejador de blocos, o índice cumulativo, e a correção do defeito acima |
| [3.4.0](https://doi.org/10.5281/zenodo.21614309) | 2026 | quadro de referência por bloco, predicados SIMD, o contrato do `.s2r` fechado |
| [DOI do projeto](https://doi.org/10.5281/zenodo.20477234) | — | aponta sempre para a versão mais recente |

Cada depósito é um registro do método datado e carimbado por um terceiro, o que
também é o que dá ao projeto uma data de prioridade.

## Onde encontrar o projeto

::html
<div class="cta">
  <a class="btn ghost" href="https://github.com/carlostbastos/Smart2Raw">GitHub</a>
  <a class="btn ghost" href="https://doi.org/10.5281/zenodo.20477234">Zenodo</a>
  {{LINKEDIN}}
  <a class="btn" href="/pt/contato/">Contato</a>
</div>
::
