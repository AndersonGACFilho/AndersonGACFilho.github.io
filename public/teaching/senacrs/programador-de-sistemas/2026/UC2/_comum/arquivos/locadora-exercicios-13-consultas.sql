-- ============================================================================
-- Exercícios da Aula 13 — perguntas que chegam no balcão
-- ============================================================================
--
-- Oito perguntas que alguém faz de verdade numa locadora. Nenhuma delas vem
-- com a consulta pronta: o que está aqui é a situação, e o espaço para você
-- escrever.
--
-- ANTES: rode o locadora-demo.sql, senão não há banco para consultar.
--
-- COMO USAR, no Query Tool do pgAdmin:
--
--   1. leia a situação
--   2. escreva o palpite na linha do "Meu palpite" — sim, escreva mesmo,
--      dentro do arquivo, que é seu
--   3. escreva a consulta embaixo, selecione só ela com o mouse e aperte F5
--      (sem selecionar, o pgAdmin roda o arquivo inteiro)
--   4. compare com o palpite. Bateu? Não bateu? O que te enganou?
--   5. só depois disso, role até a CONFERÊNCIA, lá no fim
--
-- O palpite é a parte que parece boba e é a que faz o exercício funcionar.
-- Quem só executa concorda com qualquer resultado que apareça.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. "Me vê a lista dos jogos, só nome e categoria"
-- ----------------------------------------------------------------------------
-- A atendente não quer as doze colunas na tela, quer duas.
--
-- Meu palpite — quantas linhas vêm? ____
--
-- Sua consulta:



-- ----------------------------------------------------------------------------
-- 2. "Tem algum de RPG?"
-- ----------------------------------------------------------------------------
-- Agora não são todas as linhas: são as que satisfazem uma condição.
--
-- Meu palpite — quantos jogos de RPG? ____
--
-- Sua consulta:



-- ----------------------------------------------------------------------------
-- 3. "Queria um de RPG, mas dos novos"
-- ----------------------------------------------------------------------------
-- Duas exigências ao mesmo tempo: gênero RPG E lançado depois de 2021.
--
-- Meu palpite — quantos sobram? ____
-- E se fosse OU em vez de E, viriam mais ou menos? ____
--
-- Sua consulta:



-- ----------------------------------------------------------------------------
-- 4. "É um tal de God não sei o quê"
-- ----------------------------------------------------------------------------
-- O cliente lembra um pedaço do nome. Você não tem o título inteiro para
-- comparar com = — precisa procurar por parte do texto.
--
-- Meu palpite — quantos títulos começam com "God"? ____
-- E se ele tivesse dito "god", minúsculo, a busca ainda acha? ____
--
-- Sua consulta:



-- ----------------------------------------------------------------------------
-- 5. "Manda promoção por email para todo mundo"
-- ----------------------------------------------------------------------------
-- Antes de mandar, descubra para quem NÃO dá para mandar.
--
-- Meu palpite — quantos clientes estão sem email? ____
--
-- Sua consulta:
--
-- Depois de achar, tente também assim, de propósito:
--
--     SELECT * FROM cliente WHERE email = NULL;
--
-- Não dá erro, e não traz ninguém. Por que não? Anote o que você acha antes
-- de ver a conferência.



-- ----------------------------------------------------------------------------
-- 6. "Quanto fica se eu levar por três dias?"
-- ----------------------------------------------------------------------------
-- A tabela guarda o preço de um dia. A conta é na hora da consulta — e nada
-- do que você calcular aqui fica gravado.
--
-- Meu palpite — o preço de 3 dias do jogo mais caro dá quanto? ____
--
-- Sua consulta (mostre o título e o preço de três dias):



-- ----------------------------------------------------------------------------
-- 7. "Quais são os cinco mais novos?"
-- ----------------------------------------------------------------------------
-- Duas coisas juntas: ordenar, e cortar a lista.
--
-- Meu palpite — qual jogo aparece em primeiro? ____
--
-- Sua consulta:



-- ----------------------------------------------------------------------------
-- 8. "Que categorias vocês têm?"
-- ----------------------------------------------------------------------------
-- A coluna genero se repete de linha em linha. O cliente quer a lista sem
-- repetição.
--
-- Meu palpite — quantas categorias diferentes? ____
--
-- Sua consulta:



-- ----------------------------------------------------------------------------
-- 9. A pergunta que este banco NÃO responde
-- ----------------------------------------------------------------------------
-- "Quantas cópias vocês têm de Elden Ring? Porque se tiver duas, eu levo uma
-- e meu irmão leva a outra."
--
-- Tente escrever a consulta. Vá em frente — tente mesmo, olhando as quatro
-- tabelas.
--
-- Você não vai conseguir, e o problema não é seu nem do SQL.
--
-- O que você acha que está faltando? ____________________________
--
-- A resposta está na conferência, e ela vale mais que as oito de cima.



-- ============================================================================
-- CONFERÊNCIA — só role até aqui depois de tentar
-- ============================================================================
--
-- Cada item traz a consulta e, principalmente, por que é ela. Quem acertou
-- de primeira também ganha lendo: acertar sem saber por quê não se repete na
-- próxima pergunta.
--
--
-- 1) doze linhas, duas colunas
--
--        SELECT titulo, genero FROM jogo;
--
--    Nomear as colunas não é frescura: SELECT * muda sozinho quando alguém
--    acrescenta uma coluna amanhã, e aí a tela do sistema muda sem ninguém
--    ter pedido.
--
--
-- 2) três — Pokémon Scarlet, Baldur's Gate 3 e Elden Ring
--
--        SELECT * FROM jogo WHERE genero = 'RPG';
--
--    Aspas simples no texto. Aspas duplas o Postgres entende como nome de
--    coluna, e reclama que a coluna "RPG" não existe.
--
--
-- 3) três com E — os três RPG são todos posteriores a 2021;
--    com OU viriam MAIS, não menos: seis
--
--        SELECT * FROM jogo WHERE genero = 'RPG' AND ano_lancamento > 2021;
--
--    É o contrário do que a intuição diz: cada E acrescentado aperta o
--    filtro, cada OU afrouxa. "Quero RPG e novo" é mais exigente que "quero
--    RPG".
--
--
-- 4) dois começam com "God"; com "god" minúsculo o LIKE não acha nada
--
--        SELECT * FROM jogo WHERE titulo LIKE 'God%';
--        SELECT * FROM jogo WHERE titulo ILIKE '%god%';   -- ignora a caixa
--
--    O % é "qualquer coisa aqui". 'God%' é começa com; '%War' é termina com;
--    '%of%' é contém. No balcão, ILIKE com % dos dois lados é quase sempre o
--    que você quer, porque ninguém digita do jeito certo.
--
--
-- 5) um cliente — a Carla
--
--        SELECT * FROM cliente WHERE email IS NULL;
--
--    E o email = NULL não traz nada porque nulo não é um valor: é a AUSÊNCIA
--    de valor. Perguntar se a ausência é igual a alguma coisa não dá nem
--    verdadeiro nem falso, dá desconhecido — e a linha não entra. É por isso
--    que existe IS NULL. Vale para tudo: nulo nunca é igual nem diferente de
--    nada, nem de outro nulo.
--
--
-- 6) R$ 66,00 — Baldur's Gate 3, a 22,00 por dia
--
--        SELECT titulo,
--               preco_diaria * 3 AS "Preço de 3 dias"
--        FROM   jogo;
--
--    A conta acontece no resultado e vai embora com ele. A tabela continua
--    guardando o preço de um dia — e é assim que tem de ser: guarda-se o
--    dado, calcula-se o resto.
--
--
-- 7) não dá para saber — e essa é a resposta
--
--        SELECT * FROM jogo ORDER BY ano_lancamento DESC LIMIT 5;
--
--    Dois jogos são de 2023 — Tears of the Kingdom e Baldur's Gate 3 — e o
--    comando não diz qual dos dois vem primeiro. O banco desempata como for
--    mais rápido para ele, e isso pode mudar amanhã, depois de um UPDATE ou
--    numa máquina diferente. Se a ordem importa, você desempata:
--
--        SELECT * FROM jogo ORDER BY ano_lancamento DESC, titulo LIMIT 5;
--
--    DESC é do maior para o menor. E sem ORDER BY nenhum, a ordem não é
--    "a de inserção": é a que der, e contar com ela é um erro que só aparece
--    em produção.
--
--
-- 8) seis — Ação, Aventura, Esporte, Corrida, RPG e Estratégia
--
--        SELECT DISTINCT genero FROM jogo;
--
--
-- 9) falta a entidade EXEMPLAR — a cópia física
--
--    Olhe o que a tabela jogo guarda: o TÍTULO. "Elden Ring" é uma linha,
--    não importa se a loja tem uma cópia ou dez. E emprestimo aponta para o
--    jogo, quer dizer, para o título — não para a caixa que saiu da
--    prateleira.
--
--    Nenhuma consulta resolve isso, porque não é pergunta de SQL: é pergunta
--    de MODELAGEM. Alguém, lá na Aula 03, desenhou a borda do minimundo sem
--    a cópia física dentro. Talvez de propósito — uma locadora pequena, uma
--    cópia de cada. Talvez sem perceber.
--
--    E é exatamente isso que a Aula 03 quis dizer com "o que fica de fora do
--    minimundo some do sistema". Não some com erro, não some com aviso: some
--    calado, e só aparece meses depois, quando um cliente pergunta no balcão
--    e ninguém tem como responder.
--
--    No projeto do SEU grupo: que pergunta o cliente de vocês vai fazer que o
--    modelo de vocês não responde? Vale mais procurar isso agora do que
--    depois.
