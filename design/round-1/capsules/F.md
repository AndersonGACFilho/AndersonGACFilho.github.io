# F

**Premissa.** Nas aulas, nada abre com definição. A página não abre com quem eu sou: abre com o trabalho, grande, e o nome vem no fim, pequeno, como assinatura de carta.

**Fonte.** Computer Modern Unicode Concrete (redondo, itálico, negrito): o tipo que Knuth fez para o livro-texto *Concrete Mathematics*. CMU por Andrey V. Panov, SIL OFL 1.1 (`font/OFL.txt` em `dreampulse/computer-modern-web-font`). Só em `.woff`. Reserva: Georgia.

**Tipo.** Parágrafo `clamp(1.45rem, 3.1vw, 2.9rem)`/1.24, até 27em. Frentes com título corrido em negrito na mesma linha da descrição, 1.05rem; contagem em itálico. Nome 1.2rem 700, papel 1rem itálico, lugar 0.95rem.

**Cor (1 cor de texto).** Fundo `#ffd84a`. Texto `#1b1500` (100%). 13.2:1.

**Espaço.** Topo `clamp(2.5rem, 12vh, 9rem)`. Parágrafo, depois três colunas de frentes, depois a assinatura alinhada à direita, com até 10rem de espaço antes dela.

**Relação-assinatura.** Hierarquia invertida: o texto grande, o nome pequeno e por último.

**Invariantes.** Toda página abre pelo conteúdo e fecha com a assinatura. Uma cor.

**Riscos.** O DOM mantém o `h1` primeiro e a ordem visual o põe no fim (diferença entre ordem lida e vista; aceitável sem foco, mas conferir com leitor de tela). Amarelo forte cansa em páginas longas de pesquisa.

**Para a rodada 2.** Cabeçalho do site reduzido a assinatura no rodapé; cada página começa pela frase que importa. O amarelo pode ficar só na home.
