# A voz

Como se escreve neste site e no material de aula. Guia de autoria: **não vai
para o site**, e vale para os dois repositórios (aqui e
`../AulasProgramadorDeSistemas`).

Existe porque o texto dos dois lados estava com cara de gerado. Não por ser
ruim. É regular demais.

---

## O diagnóstico

Cinco gêneros que não deveriam soar parecidos, medidos:

| arquivo | gênero | um travessão a cada |
|---|---|---|
| `DIDATICA.md` | guia de didática | 89 palavras |
| `CLAUDE.md` (aulas) | instrução técnica | 70 |
| `CLAUDE.md` (site) | instrução técnica | 78 |
| `fonts.css` | comentário de código | 99 |
| notas de palco | fala de sala de aula | 94 |

Um comentário de CSS não se parece com uma aula, que não se parece com o hero
de um portfólio. Aqui todos se parecem. **A uniformidade entre gêneros é o
tique principal**, acima de qualquer palavra isolada.

O segundo é a isometria do material: 18 das 19 aulas têm exatamente Bloco 1,
2, 3 e 4; 17 das 19 têm entre 32 e 39 slides. Os 19 decks nasceram num único
commit inicial. Professor humano não produz 19 aulas do mesmo tamanho.

---

## Os tiques, com medida

Cada um tem um número atual. O número é a meta a derrubar, e não um
limite absoluto. Se a frase pede travessão, use travessão.

**1. O travessão-aposto.** `Substantivo — explicação que reformula o
substantivo.` É a sintaxe de 8 dos 13 resumos de projeto do site, e de 29 a 77
ocorrências por aula.

> ✗ Shoot'em up 2D arcade em Unity — a nave gira na direção do mouse e anda por impulso, então a inércia faz parte do desafio.

O conserto quase nunca é trocar o travessão por vírgula. É cortar a segunda
metade ou virá-la em frase própria com sujeito.

**2. A antítese `X, não Y`.** 13 vezes na copy do site, 14 no `CLAUDE.md` das
aulas, 8 no `DIDATICA.md`.

> ✗ lê tempo de jogo e conquistas, **não** rótulos de gênero
> ✗ a forma é problematizadora, **não** bancária
> ✗ e isso é uma vantagem, **não** uma falha

Soa definitivo e não custa nada, e por isso aparece tanto. Use no máximo uma
vez por documento, quando a oposição for mesmo o conteúdo.

**3. O negrito no meio da frase.** Até 124 marcações num arquivo de aula.
Negrito é para o termo que entra no vocabulário do aluno pela primeira vez.
Não é para ênfase retórica, e nunca em mais de uma palavra por parágrafo.

**4. O tricolon e o slogan.** "Três frentes, uma prática". "Sem download, sem
launcher. Clique e jogue." Isso é copy de landing page de SaaS. Um site
pessoal não vende nada.

**5. A caixa `.atencao` a cada dois slides.** De 10 a 16 por aula. Se tudo é
destaque, nada é. Uma ou duas por aula, no que realmente muda o que o aluno
faz em seguida.

**6. O esqueleto idêntico.** Ver "As aulas", abaixo.

---

## Os três registros

Cada um escreve diferente. Se dois deles soarem iguais, algo está errado.

### O site: primeira pessoa, com fatos que só eu tenho

Hoje o site é catálogo: diz **o que as coisas são**, nunca **o que
aconteceu**. Nenhum resumo de projeto diz o que quebrou, quanto tempo levou,
por que existe, ou o que eu faria diferente.

O que entra:
- primeira pessoa, sem pedir licença;
- a data, o número, o nome próprio. "No meu primeiro semestre" e "Programa K
  (CEIA + EMBRAPII)" já fazem isso e devem ficar;
- o que deu errado, e o que ficou por fazer. Um portfólio sem nenhuma
  dificuldade admitida não é lido como modéstia, é lido como release de
  produto;
- frases de comprimento desigual. Uma curta. Depois uma que se estende porque
  o assunto pede.

O que sai: adjetivo de vitrine ("modular", "ponta a ponta", "robusto") sem
nada que o sustente; a enumeração de subsistemas no lugar do relato.

### As aulas: o professor falando, e não o manual

A voz já existe e está no lugar errado. Isto está hoje em comentário HTML, que
só eu leio:

> "o botão de dar descarga esconde o encanamento do prédio"
> "o número 40 é um dado ou uma informação?" — depende: 40 o quê? 40 anos, 40 reais, 40 jogos.
> O segundo item vai travar metade da turma — antecipar.
> Admitir erro próprio funciona bem com esta turma.

**O slide ficou com a prosa genérica e a minha voz foi para o rodapé.** A
correção é promover: o que está na nota e vale para o aluno sobe para o slide.
O que fica na nota é instrução de palco: tempo, o que sortear, o que escrever
no quadro.

E o esqueleto tem que variar. Uma aula pode ter três blocos porque o assunto
não dá quatro. Outra pode ter 20 slides porque o laboratório come o tempo.
Outra pode não ter quiz. A regularidade perfeita é a assinatura da máquina.

### Os documentos internos: telegrama

`CLAUDE.md`, `DIDATICA.md`, comentário de código. Aqui a tentação é a frase de
efeito: "O que quebra em silêncio". Em documento interno o que serve é o
telegrama: o fato, a consequência, o caminho do arquivo. Sem ritmo, sem
aforismo, sem fecho.

---

## O que fica

Não é para jogar fora. Isto já é bom e deve sobreviver a qualquer reescrita:

- a paleta quente e a justificativa dela em `tokens.css`, inclusive o motivo
  escrito no comentário;
- a decisão de mostrar o curso inteiro, inclusive as unidades que ainda não
  existem;
- o contraste medido com número nos dois temas;
- o rigor do `DIDATICA.md` em nomear a tradição e admitir o que estava
  deslocado.

---

## O que falta, e só o Anderson pode dar

Este documento foi extraído do material existente. Mas eu não consigo
distinguir, lendo os arquivos, o que você escreveu do que foi gerado para
você. As notas de palco, que são a melhor fonte de voz aqui, podem ser
qualquer um dos dois.

Antes de aplicar em escala, falta:

1. **Confirmar a amostra.** Das citações de nota de palco acima, quais são
   frases suas de verdade e quais soam alheias?
2. **Um texto seu, de antes.** Qualquer coisa escrita sem assistência: um
   e-mail longo, uma mensagem para a turma, um trecho da dissertação. É a
   única calibragem confiável.
3. **A matéria-prima dos projetos.** Para cada um dos 13: o que quebrou, quanto
   tempo levou, por que você começou, e o que ficou por fazer. Sem isso,
   reescrever os resumos só produz outra camada de prosa genérica.
