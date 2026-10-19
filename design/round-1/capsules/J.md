# J

**Premissa.** "O front em cima": em full stack, o front fica por cima do back. A página tem duas camadas: atrás, gigantes e quase sem contraste, as palavras do que sustenta (Python, Java, APIs, backends), repetidas; na frente, por cima delas, o texto que se lê.

**Fontes.** Cooper Hewitt 800 em caixa alta na camada de trás (Chester Jenkins; SIL OFL 1.1, via Fontsource). Junicode 2 variável, redondo e itálico, na frente (Peter S. Baker; SIL OFL 1.1). Reservas: Helvetica/Arial, Georgia.

**Tipo.** Trás: `clamp(4.5rem, 13vw, 13rem)`, entrelinha 0.84, tracking −0.02em. Frente: nome itálico 700 `font-stretch: 92%` até 4.2rem; parágrafo 1.05rem/1.5; frentes itálico 700 1.6rem; papel, contagens e lugar em itálico.

**Cor (3 cores de texto).** Fundo `#3a0e10`. Primária `#fbeee8` (≈60%: leitura). Acento `#ffb38a` (≈10%: nome e frentes). Terciária `#5c2124` (≈30% da área: só a camada de trás, decorativa, `aria-hidden`, 1.4:1 de propósito). Texto da frente sobre letra de trás: 10.9 e 7.1:1.

**Espaço.** Camada de trás preenche a página inteira. Coluna da frente com 31rem, encostada à direita com margem `clamp(1rem, 7vw, 8rem)`, topo até 10rem.

**Relação-assinatura.** Sobreposição legível: a palavra técnica vira chão, e o texto anda por cima dela.

**Invariantes.** Só palavras do texto real na camada de trás; ela nunca recebe contraste de leitura.

**Riscos.** Camada de trás é texto repetido (fica fora da árvore de acessibilidade, mas o "Selecionar tudo" pega). Fundo vinho escuro concorre com a arte do jogo.

**Para a rodada 2.** Cada página tem a sua camada de trás com as palavras dela (jogos: Unity, Unreal, C#; pesquisa: HTN, GOAP, RL). Componentes ficam sempre na frente.
