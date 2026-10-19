# I

**Premissa.** "Sistemas data-driven", "números que eu sei defender". O tamanho do nome de cada frente não é decisão de hierarquia: é a contagem de projetos dela. Game Dev tem 4, então tem o dobro do corpo de Fullstack e Pesquisa em IA, que têm 2.

**Fonte.** League Mono 300/400/800 (Tyler Finck, The League of Moveable Type; SIL OFL 1.1, via Fontsource). Reserva: `ui-monospace`.

**Tipo.** Unidade `--u: min(3.8vw, 2.6rem)` por projeto; corpo da frente = `u × contagem`, 800, entrelinha 1, tracking −0.03em. Todo o resto a 15px: nome 800, papel 400, parágrafo e descrições 300.

**Cor (2 cores de texto).** Fundo `#ffffff`. Primária `#0a0a0a` (≈70% do texto, ≈35% da área). Secundária `#0038d1` (só os nomes das frentes, ≈65% da área pintada). 19.8 e 8.5:1.

**Espaço.** Topo em grade: coluna estreita (nome, papel, lugar) e coluna larga (parágrafo). Abaixo, as frentes ocupando a página, cada uma com seu texto pequeno embaixo.

**Relação-assinatura.** O dado decide o tamanho. Muda a contagem, muda a página.

**Invariantes.** Nenhum tamanho grande sem um número por trás.

**Riscos.** Quando a contagem mudar, a página muda sozinha (é a ideia, mas pode desequilibrar). Branco puro com azul de link pode ler como documento padrão.

**Para a rodada 2.** O `tracks.ts` já conta os projetos: o corpo vem dali. Na página de jogos, o mesmo vale para estrelas, testes, anos.
