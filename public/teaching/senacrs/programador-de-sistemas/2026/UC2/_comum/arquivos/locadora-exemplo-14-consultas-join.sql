-- ============================================================================
-- Exemplo de entrega da Aula 14 — consultas com JOIN, feitas na locadora
-- ============================================================================
--
-- Na Aula 13 ficou uma pergunta sem resposta: "qual o NOME do cliente de
-- cada empréstimo?". O nome está numa tabela e o empréstimo em outra. Quase
-- toda pergunta que importa para quem usa o sistema é assim, porque a
-- normalização espalhou o dado de propósito — e o JOIN junta de volta.
--
-- Este arquivo é o grupoNN-aula14-consultas-join.sql que um grupo da
-- LOCADORA entregaria. O de vocês é sobre o minimundo do grupo: as junções
-- seguem as chaves estrangeiras que VOCÊS desenharam, e as daqui não servem
-- lá. Para treinar na locadora, use o locadora-exercicios-14-juncoes.sql —
-- as perguntas de lá são outras.
--
-- Cada consulta tem, como na Aula 13:
--   a PERGUNTA, entre aspas, como a pessoa falaria
--   QUEM pergunta e PARA QUÊ
--   o que VOLTOU, para quem lê poder conferir sem rodar
-- e mais uma coisa, que agora passa a importar: POR QUE aquele JOIN, e não
-- outro. INNER e LEFT respondem perguntas diferentes.
--
-- ANTES: rode o locadora-demo.sql, senão não há banco para consultar.
--
-- COMO RODAR, no Query Tool do pgAdmin: selecione UMA consulta com o mouse e
-- aperte F5. Sem selecionar, o pgAdmin roda o arquivo inteiro e mostra só o
-- resultado da última.
--
-- RODAR DE NOVO NÃO ESTRAGA NADA: aqui só há SELECT.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. "Quem já pagou multa, e quanto?"
-- ----------------------------------------------------------------------------
-- Quem pergunta: o dono, decidindo se vale apertar a regra de atraso.
-- Para quê: ele quer o NOME, e o nome mora em cliente. A multa mora em
-- emprestimo. A ponte é a chave estrangeira: emprestimo.id_cliente aponta
-- para cliente.id_cliente — FK = PK, é sempre essa a condição do ON.

SELECT c.nome, e.data_prevista, e.data_entregue, e.multa
FROM emprestimo e
INNER JOIN cliente c ON e.id_cliente = c.id_cliente
WHERE e.multa > 0;

-- Voltou: 1 linha — Bruno Lima, previsto para 09/10, devolveu em 11/10,
-- multa de 9,00.


-- ----------------------------------------------------------------------------
-- 2. "Quanto cada gênero já rendeu?"
-- ----------------------------------------------------------------------------
-- Quem pergunta: o dono, decidindo de que gênero comprar mais jogos.
--
-- O dinheiro que entrou é preco_pago, em item_emprestimo — e não
-- preco_diaria, em jogo. O preco_diaria é o preço de HOJE; o preco_pago é o
-- que foi cobrado de fato. O Mario Kart saiu por 8,00 numa promoção, e
-- somar o preco_diaria contaria 10,00 que nunca entraram no caixa.
-- O gênero está em jogo: daí o JOIN.

SELECT j.genero, SUM(i.preco_pago) AS rendeu
FROM item_emprestimo i
INNER JOIN jogo j ON i.id_jogo = j.id_jogo
GROUP BY j.genero
ORDER BY rendeu DESC;

-- Voltou: 4 gêneros — RPG (74,00), Aventura (35,00), Ação (30,00) e
-- Corrida (8,00).
--
-- Esporte e Estratégia não aparecem. Com INNER JOIN, só entra jogo que tem
-- par em item_emprestimo, e nenhum dos dois saiu nunca. Para ESTA pergunta
-- está certo: eles não renderam nada.


-- ----------------------------------------------------------------------------
-- 3. "Quem é o cliente que mais gastou aqui?"
-- ----------------------------------------------------------------------------
-- Quem pergunta: a gerente, escolhendo a quem dar um desconto de fidelidade.
--
-- Três tabelas: o NOME está em cliente, o empréstimo liga o cliente aos
-- itens, e o VALOR está em item_emprestimo. O cliente não aponta direto
-- para o item — é o preço do N:N, e por isso são dois JOIN.

SELECT c.nome, SUM(i.preco_pago) AS gastou
FROM cliente c
INNER JOIN emprestimo e      ON e.id_cliente    = c.id_cliente
INNER JOIN item_emprestimo i ON i.id_emprestimo = e.id_emprestimo
GROUP BY c.nome
ORDER BY gastou DESC;

-- Voltou: 3 clientes — Bruno Lima (55,00), Ana Souza (54,00) e
-- Carla Menezes (38,00).
--
-- Contando EMPRÉSTIMOS, quem lidera é a Ana, com três. Somando DINHEIRO, é
-- o Bruno. "Melhor cliente" tem duas respostas, e é a pergunta em
-- português que diz qual delas a consulta deu.


-- ----------------------------------------------------------------------------
-- 4. "Tem jogo que já saiu mais de uma vez? Penso em comprar outra cópia"
-- ----------------------------------------------------------------------------
-- Quem pergunta: o dono, olhando o que tem procura.
--
-- A condição "mais de uma vez" é sobre o GRUPO, não sobre a linha: por isso
-- HAVING, e não WHERE. O WHERE filtra as linhas antes de o grupo existir —
-- com WHERE COUNT(*) > 1 o banco recusa a consulta.

SELECT j.titulo, COUNT(*) AS saidas
FROM item_emprestimo i
INNER JOIN jogo j ON i.id_jogo = j.id_jogo
GROUP BY j.titulo
HAVING COUNT(*) > 1;

-- Voltou: 1 jogo — Elden Ring, com 2 saídas.
--
-- E o banco não diz quantas cópias a loja TEM: não existe a entidade
-- exemplar. A decisão de comprar fica com o dono — o banco só mostrou a
-- procura.


-- ----------------------------------------------------------------------------
-- 5. "Quem ainda não tem endereço? Quero ligar para completar o cadastro"
-- ----------------------------------------------------------------------------
-- Quem pergunta: a atendente, num dia de movimento fraco.
--
-- A pergunta é sobre quem NÃO tem par na outra tabela. INNER JOIN nunca
-- responde isso, porque só mostra quem tem par. É o LEFT JOIN: todos os
-- clientes, e o endereço quando houver — quando não houver, as colunas de
-- endereco vêm nulas. Aí o IS NULL pega exatamente esses.

SELECT c.nome, c.telefone
FROM cliente c
LEFT JOIN endereco e ON e.id_cliente = c.id_cliente
WHERE e.id_endereco IS NULL;

-- Voltou: 2 clientes — Diego Rocha e Elisa Prado.
--
-- E a versão que roda e MENTE — não entregue assim. Antes de rodar, quantas
-- linhas você acha que vêm? ____

SELECT c.nome, c.telefone
FROM cliente c
INNER JOIN endereco e ON e.id_cliente = c.id_cliente
WHERE e.id_endereco IS NULL;

-- Volta VAZIA. Sem erro, sem aviso — e a atendente concluiria que todo
-- mundo tem endereço. O INNER JOIN já tinha jogado fora o Diego e a Elisa
-- antes de o WHERE procurar por eles.


-- ----------------------------------------------------------------------------
-- 6. "A partir de quanto sai um jogo em cada console?"
-- ----------------------------------------------------------------------------
-- Quem pergunta: quem faz o cartaz da porta — "Switch a partir de R$ ...".
--
-- Plataforma e jogo são N:N: entre os dois há a tabela jogos_plataforma, e
-- a consulta passa por ela. Um jogo que roda em dois consoles conta nos
-- dois, que é o certo — o cliente do PC também pode levar o God of War.

SELECT p.nome, MIN(j.preco_diaria) AS a_partir_de
FROM plataforma p
INNER JOIN jogos_plataforma jp ON jp.id_plataforma = p.id_plataforma
INNER JOIN jogo j              ON j.id_jogo        = jp.id_jogo
GROUP BY p.nome
ORDER BY p.nome;

-- Voltou: 4 consoles — Nintendo Switch (10,00), PC (11,00),
-- PlayStation 5 (12,00) e Xbox Series X (12,00).
