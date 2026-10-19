# A

**Premissa.** "Orçamento medido por quadro": um quadro tem um tempo fixo e tudo tem de caber nele. A página tem um orçamento único de tamanho: um corpo só, uma entrelinha só, uma medida só. Nada ganha tamanho; a hierarquia sai de peso e de posição.

**Fonte.** Commit Mono V143, variável (wght 200–700, ital 0–1). Eigil Nikolajsen (Dinamarca). SIL OFL 1.1, verificada no `src/txt/license.txt` do repositório `eigilnikolajsen/commit-mono`. Servida por jsDelivr a partir do GitHub. Reserva: `ui-monospace`.

**Tipo.** Um tamanho para tudo: `clamp(14px, 0.55vw + 11px, 17px)`, entrelinha 1.5. Nome e nome das frentes em 700, o resto em 400. Caixa como veio. Sem tracking.

**Cor (1 cor de texto).** Fundo `#d5d9dc`. Texto `#12161a` (primária, 100%). 12.8:1.

**Espaço.** Coluna única de 62ch, alinhada à esquerda, margem esquerda `max(2ch, 16vw)`. Todo espaço vertical é múltiplo inteiro de uma linha (`1lh`, `3lh`): 1 linha entre frentes, 3 antes das frentes e antes do lugar.

**Relação-assinatura.** Contraste de tamanho zero. O nome só se distingue pelo peso.

**Invariantes.** Um corpo; espaço em linhas inteiras; medida fixa em ch; uma cor.

**Riscos.** Pode ler como README ou terminal. Em tela larga, o vazio à direita é grande.

**Para a rodada 2.** Componentes herdam o mesmo corpo; estado (hover, foco, ativo) muda peso ou inverte fundo/texto, nunca tamanho. O jogo entra como o único elemento fora da grade de linhas.
