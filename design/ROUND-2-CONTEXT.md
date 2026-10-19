# Rodada 2 — contexto travado

Direção **B**, travada pelo Anderson em 2026-10-19 ("o estilo gostei, pode
aplicar"). As outras nove (A, C–J) estão encerradas; os arquivos ficam em
`design/round-1/` só como registro.

Ressalva dele, que não reabre a direção: não tem certeza de gostar do texto
do herói da home ("Metade do meu trabalho tem orçamento medido por quadro…").
É conteúdo, não estilo; fica para uma revisão de texto à parte, com o
`VOZ.md`.

---

## Cápsula original (rodada 1, sem reescrita)


**Premissa.** "A outra metade tem de ficar de pé." O nome é a coluna que fica em pé ao lado do conteúdo; o conteúdo assenta no chão da página (alinhado embaixo), como coisa apoiada.

**Fontes.** Martian Mono Condensed ExtraBold (Evil Martians; SIL OFL 1.1, `OFL.txt` em `evilmartians/mono`) só no nome. Cooper Hewitt 300/400/700 (Chester Jenkins para o Cooper Hewitt Smithsonian Design Museum; SIL OFL 1.1, via Fontsource) no resto. Reservas: `ui-monospace`, Helvetica/Arial.

**Tipo.** Nome em vertical (`writing-mode: sideways-lr`, lê de baixo para cima), corpo `min(8.6svh, 19vw)` para ocupar a altura da tela, entrelinha 0.92. Papel em caixa alta, 0.82rem, tracking 0.12em, 700. Parágrafo 1.06rem/1.55. Frentes 1.45rem 700. Contagens e lugar 0.88rem 300, tracking 0.04em.

**Cor (2 cores de texto).** Fundo `#0f1a13`. Primária `#eaf0e8` (≈80%: papel, parágrafo, descrições, contagens). Secundária `#8ccf86` (≈20%: nome e nomes das frentes). 15.4:1 e 9.7:1.

**Espaço.** Duas colunas: espinha (auto) e conteúdo (até 33rem), gap `clamp(1rem, 5vw, 5rem)`. Tudo alinhado ao pé da tela; topo vazio de 18svh no mínimo.

**Relação-assinatura.** O nome em pé, da altura da tela, e o resto encostado no chão.

**Invariantes.** Nome vertical; peso no rodapé; a cor secundária marca só nomes próprios.

**Riscos.** Leitura vertical do nome em celular; `sideways-lr` precisa de Chrome 132+, Firefox ou Safari recente (cai para `vertical-rl`, de cima para baixo).

**Para a rodada 2.** Cabeçalho do site vira a espinha fixa à esquerda no desktop; no celular, a espinha vira faixa de texto no topo. Páginas internas assentam no pé, não no topo.

---

## Decisões da tradução para o site (rodada 2)

- **Um nome em pé em toda página.** No desktop (> 760px) o nome é uma coluna
  `sticky` à esquerda, da altura da tela, lendo de baixo para cima
  (`sideways-lr`, com `vertical-rl` de reserva). Na home ele é o `h1`; nas
  outras páginas, um link para a home. No celular ele deita, quebra em duas
  linhas e rola junto; quem gruda no topo é só a faixa de navegação.
- ~~Conteúdo encosta no nome~~. **Revogado pelo Anderson em 2026-10-19**
  ("podia centralizar a coluna do meio para preencher mais"): conteúdo e
  barra ficam centrados no espaço ao lado do nome, com a mesma caixa.
- ~~A primeira tela da home assenta no pé~~. **Revogado pelo Anderson em
  2026-10-19** ("tem um espaço gigantesco acima"): em monitor alto o vazio no
  topo virava buraco. Agora a home e os cabeçalhos de página começam logo
  abaixo da navegação, com respiro de `clamp(32px, 6svh, 72px)`.
- **Tela larga** (pedido dele, "não está legal no navegador" em 2000px): o
  corpo cresce de 1rem a 1,25rem entre 1280 e 2160px, `--maxw` é 72rem e
  cresce junto, os controles da barra vão para a borda direita, e a partir
  de 1200px a home põe as frentes ao lado do texto e os índices abrem em
  duas colunas.
- **As três trilhas têm a mesma tinta**, a dos nomes. `--fullstack`,
  `--gamedev` e `--research` continuam existindo (o `tracks.ts` as injeta),
  valendo `var(--accent)`. A trilha se lê pela palavra.
- **O verde marca nomes**: o meu, das frentes, dos projetos, dos jogos, dos
  cursos, o meu entre os autores. Ele também é a cor de foco, de link em texto
  corrido e do botão preenchido (único por página).
- **Tons secundários** (`--text-dim`, `--text-faint`) são a tinta de leitura
  apagada, e não uma terceira cor.
- **Caixa alta só numa linha por página**: o papel na home, o kicker nas
  demais, sempre *embaixo* do título.
- **Metadado no peso 300** com tracking de 0.04em (contagens, datas, tecnologia,
  carga horária). A fileira de etiquetas com contorno virou uma linha de texto
  separada por vírgula.
- **Sem filete, sem caixa, sem fio** entre entradas: índice, trilhas,
  currículo, tese da pesquisa, curso das aulas e rodapé separam por espaço.
  Ficaram as bordas funcionais: botões, chips, controles da barra (3:1).
- **Tema claro** desenhado com a mesma lógica: fundo `#eef2ec`, texto
  `#0f1a13`, verde `#2c6a2a`. Contraste medido por `npm run check:contrast`.
- **Fontes servidas daqui** (`public/fonts/`), com as licenças OFL ao lado.

## Invariantes

- O nome em pé, sempre à esquerda no desktop.
- Duas tintas; o verde só em nome e nos sinais de interação.
- Uma família de leitura (Cooper Hewitt); a condensada só no nome.

## Normalização proibida

- Voltar a cor por trilha, filete à esquerda, etiqueta com contorno, kicker
  acima do título, caixa com fundo elevado para conteúdo paralelo.
- Pôr a condensada em título de página ou em interface.

## O que ficou pendente

- **Material das aulas** (`../AulasProgramadorDeSistemas`): a próxima
  publicação aborta até `site/tokens.css` ser recopiado deste arquivo. Lá
  também precisa trocar a constante `FONTES` do `publish-slides.mjs`, que
  pede Archivo/Literata ao Google Fonts: Cooper Hewitt não está no Google, e
  o material abre em `file://`, então o caminho é `@font-face` apontando
  para o jsDelivr (pacote `@fontsource/cooper-hewitt@5.3.0`, mais o arquivo
  da Martian Mono Condensed no GitHub da Evil Martians). Os `--esp-*` agora
  têm valor próprio e não seguem mais as trilhas.
- **Imagem de prévia (OG)**: continua a antiga, desenhada com Archivo e
  Literata (por isso essas duas ficaram em `public/fonts/`).
- **Texto do herói**: ver a ressalva no topo.
- Cooper Hewitt em leitura longa (pesquisa, currículo) ainda não foi julgada
  pelo Anderson em tela.
