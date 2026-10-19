# B

**Premissa.** "A outra metade tem de ficar de pé." O nome é a coluna que fica em pé ao lado do conteúdo; o conteúdo assenta no chão da página (alinhado embaixo), como coisa apoiada.

**Fontes.** Martian Mono Condensed ExtraBold (Evil Martians; SIL OFL 1.1, `OFL.txt` em `evilmartians/mono`) só no nome. Cooper Hewitt 300/400/700 (Chester Jenkins para o Cooper Hewitt Smithsonian Design Museum; SIL OFL 1.1, via Fontsource) no resto. Reservas: `ui-monospace`, Helvetica/Arial.

**Tipo.** Nome em vertical (`writing-mode: sideways-lr`, lê de baixo para cima), corpo `min(8.6svh, 19vw)` para ocupar a altura da tela, entrelinha 0.92. Papel em caixa alta, 0.82rem, tracking 0.12em, 700. Parágrafo 1.06rem/1.55. Frentes 1.45rem 700. Contagens e lugar 0.88rem 300, tracking 0.04em.

**Cor (2 cores de texto).** Fundo `#0f1a13`. Primária `#eaf0e8` (≈80%: papel, parágrafo, descrições, contagens). Secundária `#8ccf86` (≈20%: nome e nomes das frentes). 15.4:1 e 9.7:1.

**Espaço.** Duas colunas: espinha (auto) e conteúdo (até 33rem), gap `clamp(1rem, 5vw, 5rem)`. Tudo alinhado ao pé da tela; topo vazio de 18svh no mínimo.

**Relação-assinatura.** O nome em pé, da altura da tela, e o resto encostado no chão.

**Invariantes.** Nome vertical; peso no rodapé; a cor secundária marca só nomes próprios.

**Riscos.** Leitura vertical do nome em celular; `sideways-lr` precisa de Chrome 132+, Firefox ou Safari recente (cai para `vertical-rl`, de cima para baixo).

**Para a rodada 2.** Cabeçalho do site vira a espinha fixa à esquerda no desktop; no celular, a espinha vira faixa de texto no topo. Páginas internas assentam no pé, não no topo.
