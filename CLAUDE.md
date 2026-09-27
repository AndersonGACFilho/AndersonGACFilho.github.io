# Diretrizes deste repositório

Site pessoal (Astro 5, CSS puro, sem framework de UI) publicado em GitHub
Pages. Ele também **hospeda o material de aula** do Senac RS, em
`public/teaching/`.

## Duas coisas que não se editam à mão

- **`public/teaching/…`** é saída gerada pelo `publish-slides.mjs` do
  repositório do material (`../AulasProgramadorDeSistemas`). Mexer aqui é
  perder o trabalho na próxima publicação — edite lá e publique.
- **O bloco `<head>` do `Base.astro`**: OG absoluto, 1200×630 e descrição de
  100+ caracteres vieram de três correções seguidas para a prévia do LinkedIn
  funcionar.

## O que quebra em silêncio

O CI (`.github/workflows/deploy.yml`) roda `astro build` e mais nada — **sem
teste, sem lint, sem checagem de tipo**. Renomear uma classe ou remover uma
variável CSS não é pego por ninguém. Intocáveis:

- **nomes de token consumidos por props**: `src/lib/tracks.ts` injeta as
  strings literais `var(--fullstack)`, `var(--gamedev)`, `var(--research)`
  como `style="--track: …"`. Junto com `--kicker`, `--track`, `--border`,
  `--bg-elev`, `--bg-hover`, `--text-dim`, `--text-faint`, `--radius`,
  `--mono` e `--accent`, esses **nomes** sobrevivem a qualquer reescrita; os
  valores mudam à vontade;
- **seletores lidos por JavaScript**: `#project-grid`, `.chip`,
  `[data-tracks]`, `aria-pressed`, `card.hidden`, os deep-links
  `#fullstack`/`#gamedev`/`#research`, e no `GameFrame` `.game`,
  `.game-stage`, `[data-play]`, `[data-cinema]`, `[data-cinema-close]`,
  `[data-fullscreen]` e o título lido de `root.querySelector('strong')`;
- **`src/styles/tokens.css` é a fonte dos tokens para os dois sites**. O
  publicador do material lê este arquivo e o copia para lá; divergiu, a
  publicação aborta dizendo qual token mudou.

Toda rota em inglês tem gêmea em português: mudança de markup vale para as
duas.

## Skills: design e engenharia

Não decida visual nem estrutura de código no olho.

**Design** — `frontend-design`, `web-design-guidelines`, `ui-ux-pro-max`,
`bencium-innovative-ux-designer`, `bencium-controlled-ux-designer` para a
direção; `accessibility-audit`, `accessibility-scan`,
`accessibility-inspect`, `accessibility-diff`, `accessibility-fix` para o
piso. Contraste se **mede** com número, nos **dois** temas — claro e escuro
são os dois escolhíveis pelo `ThemeSwitch`, não só herdados do sistema.

**Engenharia** — rode a revisão de código da skill de engineering antes de
fechar a mudança: SRP (um componente, uma responsabilidade), clean code, nada
de código morto nem abstração especulativa, erro tratado onde acontece com o
porquê no comentário.

## O material de aula tem pedagogia própria

O que está em `public/teaching/` segue uma linha **problematizadora,
freireana**: nada abre com definição, o tema é gerador, a pergunta é de
verdade e ninguém passa vergonha. Se for mexer no conteúdo (e não só na
moldura do site), o lugar é `../AulasProgramadorDeSistemas`, e as diretrizes
estão no `CLAUDE.md`, no `DIDATICA.md` e no `PADRAO-INTERATIVO.md` de lá.

## Validar

`npm run build` é a única rede de segurança automática. Além dele: percorrer
as rotas EN e PT no navegador, console e rede limpos (descontando os builds
Unity, que vivem em outro repositório e não existem em local), filtro de
projetos e modo cinema exercitados, 375/768/desktop, teclado só, e os estados
vazios — artigos em rascunho e "Build coming soon" são a cara real do site.
