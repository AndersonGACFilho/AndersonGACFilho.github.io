# D

**Premissa.** HTN: uma tarefa se decompõe em métodos, que se decompõem em subtarefas, até as primitivas. A página é a decomposição: nome no topo, papel e frentes como métodos, frases e descrições como subtarefas, contagens como primitivas.

**Fontes.** Iosevka Etoile 400/400 itálico/700 (serifada quase-proporcional) e Iosevka 400 (mono) nas folhas. Belleve Invis. SIL OFL 1.1, via Fontsource. Reserva: Georgia, `ui-monospace`.

**Tipo.** Tamanho cai com a profundidade: nível 0 `clamp(2rem, 4.4vw, 3.4rem)` 700; nível 1 1.3rem 700; nível 2 1.02rem 400; nível 3 0.86rem mono, tracking 0.02em. Lugar em itálico.

**Cor (4 cores de texto, uma por profundidade).** Fundo `#f7f7f2`. Primária `#1c1c1c` (nível 2, ≈60%: frases e descrições). Secundária `#8f2d0f` (nível 1, ≈20%: papel, frentes, lugar). Terciária `#1f4d36` (nível 0, ≈12%: nome). Acento `#2b3ec4` (nível 3, ≈8%: contagens). 7.5–15.9:1.

**Espaço.** Lista aninhada sem marcador; cada nível entra 3ch; recuo pendente de 2ch para a linha que quebra. Itens até 58ch. Margem esquerda `clamp(1rem, 7vw, 7rem)`.

**Relação-assinatura.** Profundidade = recuo = tamanho = cor, as quatro andando juntas.

**Invariantes.** A cor diz o nível, nunca a frente. Recuo em ch.

**Riscos.** Pode ler como sumário ou outline de editor. A cor de nível pode ser confundida com cor de trilha.

**Para a rodada 2.** Navegação, listas de projetos e o currículo como árvores; o filtro de projetos poda ramos. As cores de trilha precisam de outro canal (texto, posição), porque a cor já é do nível.
