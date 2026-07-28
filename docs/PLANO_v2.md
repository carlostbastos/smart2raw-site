# Plano do site Smart2Raw — versão 2

Documento de planejamento revisado. **Nada será construído antes do seu ok.**
Projeto: Smart2Raw 3.5.0 · DOI 10.5281/zenodo.21623772 · repositório
`github.com/carlostbastos/Smart2Raw`

O que mudou da versão 1: entrou o **modelo de negócio** (aberto + premium +
investimento), entrou o **mapa de públicos**, e entrou o **passo a passo de
execução** dizendo, linha a linha, o que eu faço e onde você precisa entrar.

---

## 1 · As três lentes

Este plano foi escrito olhando o mesmo site por três ângulos, porque eles
discordam entre si em pontos importantes e é melhor a discordância aparecer aqui
do que depois de publicado.

- **Executivo** — o site é um ativo do negócio. Precisa qualificar quem chega,
  proteger a propriedade intelectual e não criar passivo jurídico.
- **Marketing** — o site tem 30 segundos para responder *isso é para mim?*, e
  precisa ser encontrável por quem nunca ouviu o nome "Smart2Raw".
- **Técnico** — cada afirmação precisa ser verificável, porque o público que
  decide é engenheiro e engenheiro testa.

Onde as três concordam, o plano segue direto. Onde discordam, está marcado.

---

## 2 · O modelo de negócio, agora explícito

```
    CAMADA 1  ·  Smart2Raw 3.5.0, AGPL-3.0-or-later
              o que está público, com DOI, testado, auditável
              PAPEL: prova, credibilidade e cunha de entrada

    CAMADA 2  ·  Versão avançada, licença comercial
              o que está com você
              PAPEL: receita

    CAMADA 3  ·  Investimento e parceria
              PAPEL: capital e alcance
```

A AGPL não é uma escolha ideológica aqui — **é o mecanismo comercial**. Quem quer
embutir o Smart2Raw num produto fechado não pode usar AGPL, e então precisa
falar com você. O site inteiro existe para tornar essa conversa fácil de começar.

**Três objetivos de conversão, e eles competem entre si se ficarem no mesmo
lugar.** A hierarquia proposta:

| prioridade | objetivo | onde acontece |
|---|---|---|
| 1º | o visitante **rodar a demonstração** | home |
| 2º | o avaliador **pedir a versão avançada** | aba Premium + formulário |
| 3º | o investidor **iniciar conversa** | aba Investimento |

Um alerta do lado executivo, e a decisão é sua: **anunciar busca por investimento
na home tem custo.** Para o comprador corporativo, "procuramos investidores" lê
como "empresa jovem, pode não existir em dois anos" — exatamente a objeção que
trava contrato de licença. Duas formas de atender seu pedido sem pagar esse preço:

- **(A) recomendada** — "Investimento & parcerias" na navegação principal, com
  linguagem de quem oferece oportunidade, não de quem procura socorro. Aparece,
  é visível, mas não é a primeira coisa que o CTO lê.
- **(B) máxima exposição** — uma faixa na home. Mais alcance com investidor,
  menos conforto para o comprador.

---

## 3 · Os públicos que passam pelo site

Nove tipos de gente vão chegar. Cada um dá 30 segundos ao site antes de decidir
se fica. A coluna que importa é a última: **o que essa pessoa faz em seguida.**

| # | quem | como chega | o que quer saber em 30 s | página que serve | ação desejada |
|---|---|---|---|---|---|
| 1 | **Engenheiro / arquiteto de dados** | busca técnica, GitHub, Hacker News | "serve para a minha coluna? é real ou é folheto?" | home (demonstração) → Aplicações | roda a demo com dado dele, baixa o header |
| 2 | **Gestor de engenharia / CTO** | indicação, LinkedIn | "quanto economizo, que risco corro, tem gente por trás?" | Aplicações → Premium | pede contato comercial |
| 3 | **Comprador corporativo / jurídico** | mandado pelo time técnico | "AGPL me impede? existe licença comercial? quem assina?" | Licenciamento | preenche o formulário |
| 4 | **Pesquisador / acadêmico** | Zenodo, DOI, citação | "o que é novo? como cito? é reprodutível?" | Citar → Escopo técnico | cita, baixa, referencia |
| 5 | **Desenvolvedor embarcado / open source** | busca por "header-only C", GitHub | "que dependências tem? cabe no meu MCU?" | Comece | usa, contribui, divulga |
| 6 | **Investidor / analista** | LinkedIn, indicação, imprensa | "qual o problema, o diferencial defensável, a tração e o founder?" | Investimento → Sobre | inicia conversa |
| 7 | **Jornalista / comunidade técnica** | notícia, redes | "qual é a história em uma frase? tem número?" | home → Desempenho | escreve, compartilha |
| 8 | **Talento / possível sócio técnico** | LinkedIn, GitHub | "isso é sério? para onde vai? quem toca?" | Sobre → GitHub | entra em contato |
| 9 | **Curioso** | link compartilhado | "o que acontece se eu clicar?" | home | clica, se impressiona, compartilha |

Duas leituras que saem dessa tabela:

- **Os públicos 1, 5 e 9 são atendidos pela mesma coisa: a demonstração.** É por
  isso que ela fica na home e não numa aba. Ela converte três públicos de uma vez.
- **Os públicos 2, 3 e 6 precisam de páginas que ainda não existem** — Premium,
  Licenciamento e Investimento. É aí que está o trabalho novo de texto.

---

## 4 · A estrutura do site (revisada)

### Domínios — um site, quatro endereços

```
smart2raw.com/           → inglês   (canônico)
smart2raw.com/pt/        → português
smart2raw.com.br         → 301 para smart2raw.com/pt/
raw2smart.com            → 301 para smart2raw.com/
raw2smart.com.br         → 301 para smart2raw.com/pt/
```

Seletor de idioma fixo no topo, sem redirecionamento automático por idioma do
navegador. `hreflang` ligando as duas versões.

### As abas

| aba | EN · PT | público principal |
|---|---|---|
| **Home** (com a demonstração embutida) | `/` · `/pt/` | 1, 5, 9 |
| **Aplicações** | `/applications` · `/pt/aplicacoes` | 1, 2 |
| **Como funciona** | `/how-it-works` · `/pt/como-funciona` | 1, 4 |
| **Comece** | `/start` · `/pt/comece` | 1, 5 |
| **Desempenho** | `/benchmarks` · `/pt/desempenho` | 1, 2, 7 |
| **Premium** ⟵ *novo* | `/premium` · `/pt/premium` | 2, 3 |
| **Licenciamento** | `/license` · `/pt/licenciamento` | 3 |
| **Investimento & parcerias** ⟵ *novo* | `/investors` · `/pt/investimento` | 6 |
| **Escopo técnico** | `/scope` · `/pt/escopo` | 1, 4 |
| **Citar** | `/cite` · `/pt/citar` | 4 |
| **Sobre / Founder** ⟵ *novo* | `/about` · `/pt/sobre` | 2, 6, 8 |
| **Contato** | `/contact` · `/pt/contato` | todos |
| **Privacidade** (rodapé) | `/privacy` · `/pt/privacidade` | exigência legal |

### A aba Premium — o coração comercial

Aqui há um problema real de posicionamento que precisa da sua decisão. Hoje a
única descrição da versão avançada é *"está comigo e é bem mais avançada"*. Isso
não converte e não filtra: o formulário enche de curioso e o comprador sério não
consegue se auto-qualificar.

A saída é descrever **o que ela resolve**, não **como ela faz**. Estrutura
proposta para a página:

1. **Uma tabela de três colunas** — Aberto (AGPL) · Premium (comercial) ·
   Sob medida. Com linhas de *capacidade*, não de mecanismo.
2. **Para quem é**: os perfis que não podem usar AGPL — produto fechado, SaaS,
   dispositivo embarcado vendido, integração em banco de dados proprietário.
3. **O que a licença comercial entrega além do código**: direito de uso fechado,
   suporte, prioridade em correção, e o acesso à versão avançada.
4. **O formulário**, com campos que já qualificam: empresa, volume de dados
   (faixas), caso de uso, prazo.

**O que preciso de você:** três a cinco linhas de capacidade da versão premium
que possam ser ditas em público sem entregar o mecanismo. Sem isso a página não
sai do lugar.

### A aba Investimento

Um investidor procura seis coisas, nessa ordem, e a página responde nessa ordem:

1. **O problema**, em dinheiro — dado inteiro ocupa memória e memória custa.
2. **A cunha** — por que classificar por amplitude é diferente do que todo mundo
   faz, e por que os bytes continuarem executáveis muda o custo de operação.
3. **A prova** — 3 versões depositadas com DOI, 31 suítes de teste, um defeito de
   corrupção silenciosa encontrado e corrigido pelo próprio processo, número
   medido e reprodutível. Isso é tração de engenharia, e é raro.
4. **A defensibilidade** — data de prioridade registrada em depósito citável,
   versão avançada não publicada, marca.
5. **Quem** — você, com o LinkedIn.
6. **O convite** — o que se busca e para quê.

### A aba Sobre / Founder

Seu LinkedIn como founder, a origem do projeto, e a linha do tempo das versões
com os DOIs. Serve aos públicos 2, 6 e 8 ao mesmo tempo — o comprador querendo
saber quem responde, o investidor querendo saber quem toca, o talento querendo
saber se é sério.

---

## 5 · Mensagem

**Slogan:** *A inteligência está na classificação. O que sai é byte puro.*
(EN: *The intelligence is in the classification. What comes out is raw bytes.*)

O nome inverte o óbvio de propósito, e isso é um ativo: todo mundo promete
transformar dado bruto em inteligente — `raw2smart`. Aqui a inteligência entra
toda na classificação e **o que sai é raw**: inteiro nativo, direto, sem passo de
decodificação. O nome é a arquitetura em uma palavra, e vale explicar isso na
home em duas frases — vira memorável.

**As três coisas que a home diz, nessa ordem:** o que é (uma frase), a prova
(a demonstração, agora), o convite (comece, ou fale conosco).

---

## 6 · O passo a passo de execução

Aqui está, literalmente, quem faz o quê. Já verifiquei o que é tecnicamente
possível a partir daqui — inclusive testando o acesso — e o que **não** é está
marcado sem rodeio.

### Fase 0 · As contas (só você pode fazer)

| passo | quem | por quê |
|---|---|---|
| criar `smart2raw@gmail.com` | **você** | criar conta e definir senha são coisas que eu não faço, e o Google exige verificação por telefone e CAPTCHA |
| criar/entrar na conta HostGator | **você** | mesma razão — senha e login |
| ter o LinkedIn à mão | **você** | preciso da URL do seu perfil |

Enquanto o Gmail não existir, nada do resto tem para onde apontar.

### Fase 1 · Os domínios (eu conduzo, você paga)

Seu Chrome está conectado a esta sessão — **posso operar o navegador na sua
máquina**. A divisão é esta:

| passo | quem |
|---|---|
| abrir a HostGator, consultar a disponibilidade dos quatro domínios | **eu** |
| montar o carrinho com os quatro, no período de 2 anos | **eu** |
| **ler na tela e te mostrar o preço de RENOVAÇÃO antes do pagamento** | **eu** |
| conferir se há serviços marcados que você não pediu (é praxe vir coisa junto) | **eu** |
| login, CPF, dados de pagamento, confirmação da compra | **você** |
| aceitar os termos | **você** |

O preço de renovação é o item que decide, e a página pública não o divulga — só o
carrinho. É por isso que ele é um passo explícito antes do seu clique.

### Fase 2 · DNS, e-mail e hospedagem (eu conduzo, você autoriza)

| passo | quem |
|---|---|
| criar conta Cloudflare (plano gratuito) | **você** (senha) |
| adicionar os quatro domínios na Cloudflare | **eu** |
| trocar os nameservers na HostGator para os da Cloudflare | **eu**, com seu ok |
| configurar `contato@smart2raw.com` → seu Gmail (Email Routing, grátis) | **eu** |
| clicar no e-mail de verificação que chega no Gmail | **você** |
| criar as 3 regras de redirecionamento | **eu** |

### Fase 3 · O código do site (eu faço inteiro)

| passo | quem |
|---|---|
| criar o repositório `smart2raw-site` | **eu**, pelo navegador — ou você, em 30 segundos |
| escrever o site inteiro, nas duas línguas | **eu** |
| versão em inglês da página ao vivo | **eu** |
| bateria de verificação em navegador de verdade | **eu** |
| **enviar os arquivos para o GitHub** | ⚠️ ver abaixo |

**⚠️ O limite que descobri testando:** desta sessão eu **não consigo fazer `git
push`** — o acesso ao GitHub por git está bloqueado na rede daqui (confirmei:
`git ls-remote` retorna 403). Três saídas, em ordem de preferência:

1. **Você dá o push.** Eu deixo tudo pronto e commitado na sua máquina; você roda
   um comando. É o caminho mais limpo e mais rápido.
2. **Eu subo pelo navegador**, arquivo por arquivo, pela interface do GitHub.
   Funciona, mas é lento e feio para um site inteiro.
3. **Você usa o GitHub Desktop** e clica em "push".

O mesmo vale para o que já está pendente hoje no seu repositório: a versão 3.5.0
está commitada (`f8a3517 New Version`) mas **não está com a tag `v3.5.0`**, e a
pasta `web/` e a correção do header ainda estão sem commit. Isso entra na mesma
leva.

### Fase 4 · Publicação (eu conduzo, você autoriza uma vez)

| passo | quem |
|---|---|
| criar o projeto no Cloudflare Pages | **eu** |
| **autorizar a Cloudflare a ler o repositório no GitHub** (OAuth) | **você** — um clique |
| ligar o domínio ao projeto, HTTPS, `hreflang`, sitemap | **eu** |
| criar a conta do serviço de formulário e pegar a chave | **você** (senha) |
| ligar o formulário no site e testar de ponta a ponta | **eu** |
| verificação final: os 4 domínios, as 2 línguas, o formulário chegando no Gmail | **eu** |

### O que eu não faço, em nenhuma fase

Não é limitação técnica em todos os casos — em parte é regra, e é uma regra boa:

- **criar contas e escolher/digitar senhas** — de ninguém, em lugar nenhum;
- **dados de pagamento** — cartão, CPF em campo de cobrança, qualquer credencial
  financeira;
- **resolver CAPTCHA** — se aparecer, o teclado é seu;
- **aceitar termos de uso e conceder autorizações OAuth** — eu deixo a tela
  pronta, o clique é seu;
- **`git push`** — bloqueado na rede desta sessão, conforme acima.

Em tudo o mais eu opero e te mostro o que estou vendo antes de qualquer ação que
não dê para desfazer.

---

## 7 · Custo revisado — HostGator, como você decidiu

Preços anunciados hoje na HostGator para o primeiro período, exigindo contratação
mínima de 2 anos:

| domínio | 1º período (anunciado) | renovação |
|---|---|---|
| `.com` | R$ 28,99 (69% OFF) | **não divulgada na página** |
| `.com.br` | R$ 9,99 (85% OFF) | **não divulgada na página** |

Para comparação, o `.com.br` no Registro.br — que é o registro oficial, sem
intermediário — custa R$ 76,00 por 2 anos (R$ 38,00/ano), com esse mesmo valor na
renovação. Ou seja: a HostGator está muito mais barata **agora**, e o que decide o
custo de cinco anos é um número que só aparece no carrinho.

Por isso o passo "ler o preço de renovação na tela antes de você pagar" é
explícito na Fase 1. E vale registrar a saída, caso o número seja ruim: **domínio
se transfere** — dá para aproveitar a promoção agora e migrar depois para um
registrador de preço de custo, respeitando a trava de 60 dias após o registro.

Hospedagem, redirects, e-mail e formulário: **R$ 0** nos dois cenários.

---

## 8 · Riscos e itens do lado executivo

Nenhum destes é tarefa agora — são coisas que um investidor vai perguntar e que é
melhor você já ter pensado antes de a pergunta chegar.

1. **Marca.** "Smart2Raw" não está registrada no INPI. Registro de marca no Brasil
   é barato perto do que custa perder o nome depois. Vale avaliar.
2. **Dependência de uma pessoa.** A versão avançada estar só com você é o ativo e
   é o risco — é a primeira pergunta de diligência. O site não deve tocar no
   assunto; a estratégia, sim, em algum momento.
3. **Titularidade limpa.** Registrar os domínios na sua conta, com o e-mail do
   projeto, e não em conta de terceiro. Parece detalhe; em diligência não é.
4. **LGPD e GDPR.** A partir do formulário, é obrigatório o aviso de privacidade.
   E nele cabe o seu diferencial: *a demonstração roda inteira no seu navegador e
   não envia dado nenhum.*

---

## 9 · O que ainda depende de você

| # | decisão | impacto |
|---|---|---|
| 1 | **Descrever a versão premium** em 3 a 5 linhas de capacidade, dizíveis em público | sem isso a aba Premium não existe — é o item mais importante da lista |
| 2 | Investimento na **navegação principal (A)** ou em **faixa na home (B)** | alcance x conforto do comprador corporativo |
| 3 | URL do seu **LinkedIn** | páginas Sobre e Investimento |
| 4 | Site em **repositório próprio** (`smart2raw-site`) ou pasta dentro do repositório atual | recomendo próprio: o repositório da biblioteca é artefato científico ligado a DOI, e o site muda toda semana |
| 5 | **Medição de audiência?** Se sim, sem cookie e sem rastreamento | coerência com a promessa "nenhum dado sai" |
| 6 | Qual das três saídas para o **push no GitHub** | destrava a Fase 3 |

---

*Smart2Raw — Copyright © 2026 Carlos Alberto Terêncio de Bastos.
Documento de planejamento, versão 2. Nenhuma linha do site foi escrita.*
