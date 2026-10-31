-- ============================================================================
-- Exemplo de entrega da Aula 15 — subconsultas e views, feitas na locadora
-- ============================================================================
--
-- Tem pergunta que precisa de outra resposta antes. "Qual o jogo mais
-- caro?" pede saber primeiro QUAL é o maior preço, e só depois QUEM tem
-- esse preço. A subconsulta é essa primeira resposta, escrita entre
-- parênteses dentro da segunda.
--
-- E tem pergunta que se repete todo dia. Escrever o mesmo JOIN de três
-- tabelas toda manhã é pedir para errar uma vez. A view guarda a CONSULTA
-- com um nome, e daí em diante ela se usa como se fosse uma tabela.
--
-- Este arquivo é o grupoNN-aula15-views.sql que um grupo da LOCADORA
-- entregaria. O de vocês é sobre o minimundo do grupo: a view que vale a
-- pena criar é a da pergunta que se repete NAQUELE negócio. Para treinar
-- na locadora, use o locadora-exercicios-15-subconsultas-views.sql — as
-- perguntas de lá são outras.
--
-- Cada consulta tem, como nas Aulas 13 e 14, a PERGUNTA, QUEM pergunta e
-- PARA QUÊ, e o que VOLTOU.
--
-- ANTES: rode o locadora-demo.sql, senão não há banco para consultar.
--
-- COMO RODAR, no Query Tool do pgAdmin: selecione UMA consulta com o mouse e
-- aperte F5. Os CREATE VIEW também se rodam um de cada vez, e antes das
-- consultas que usam a view.
--
-- RODAR DE NOVO NÃO ESTRAGA NADA. As consultas só leem. As views usam
-- CREATE OR REPLACE VIEW, que troca a view pela mesma definição — e uma view
-- não guarda dado nenhum, só a pergunta, então não há o que perder.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. "Qual é o jogo mais caro da loja?"
-- ----------------------------------------------------------------------------
-- Quem pergunta: um cliente curioso, e depois o dono, revendo a tabela de
-- preços.
--
-- A de dentro roda primeiro e devolve UM número, o maior preço. A de fora
-- procura quem tem esse preço. Por voltar um valor só, dá para comparar com
-- = — se a de dentro pudesse voltar várias linhas, teria de ser IN.

SELECT titulo, preco_diaria
FROM jogo
WHERE preco_diaria = (SELECT MAX(preco_diaria) FROM jogo);

-- Voltou: 1 jogo — Baldur's Gate 3, 22,00.
--
-- Por que não ORDER BY preco_diaria DESC LIMIT 1, que dá o mesmo hoje? Se
-- amanhã chegar outro jogo a 22,00, o LIMIT 1 mostra um e esconde o outro.
-- A subconsulta mostra os dois, porque a pergunta é "quem tem o maior
-- preço", e não "me dê uma linha".


-- ----------------------------------------------------------------------------
-- 2. "Quantas pessoas estão com jogo em casa agora?"
-- ----------------------------------------------------------------------------
-- Quem pergunta: o dono, para saber a quantas pessoas mandar lembrete.
--
-- A pergunta é sobre PESSOAS. A subconsulta acha os ids de quem tem
-- empréstimo em aberto, e a de fora conta os clientes cujo id está nessa
-- lista. Cada cliente é uma linha da tabela cliente, então cada um conta
-- uma vez só.

SELECT COUNT(*) AS pessoas
FROM cliente
WHERE id_cliente IN (SELECT id_cliente
                     FROM emprestimo
                     WHERE data_entregue IS NULL);

-- Voltou: 3 — Ana, Bruno e Carla.
--
-- E a versão que roda e MENTE — não entregue assim. Antes de rodar, quanto
-- você acha que vem? ____

SELECT COUNT(*) AS pessoas
FROM cliente c
INNER JOIN emprestimo e      ON e.id_cliente    = c.id_cliente
INNER JOIN item_emprestimo i ON i.id_emprestimo = e.id_emprestimo
WHERE e.data_entregue IS NULL;

-- Volta 4. O Bruno está com DOIS jogos no mesmo empréstimo, e o JOIN com
-- item_emprestimo faz uma linha por jogo — o COUNT(*) conta linhas, e o
-- Bruno é contado duas vezes. A consulta respondeu "quantos jogos estão
-- fora", que é outra pergunta.


-- ----------------------------------------------------------------------------
-- 3. "Quem se cadastrou e nunca alugou nada?"
-- ----------------------------------------------------------------------------
-- Quem pergunta: a gerente, montando uma promoção de primeira locação.
-- Para quê: ela vai ligar — então nome e telefone.

SELECT nome, telefone
FROM cliente
WHERE id_cliente NOT IN (SELECT id_cliente FROM emprestimo);

-- Voltou: 2 clientes — Diego Rocha e Elisa Prado.
--
-- NOT IN só é seguro porque emprestimo.id_cliente é NOT NULL. Se a
-- subconsulta pudesse devolver um nulo, o NOT IN não devolveria NINGUÉM —
-- é a armadilha do exercício 5 do locadora-exercicios-15. Antes de usar
-- NOT IN no projeto do grupo, confira se a coluna da subconsulta aceita
-- nulo.


-- ----------------------------------------------------------------------------
-- 4. A view do balcão: "o que está fora, com quem, e até quando"
-- ----------------------------------------------------------------------------
-- Quem pergunta: a atendente, TODO dia ao abrir a loja. É a pergunta que se
-- repete — e é ela que merece virar view.
--
-- Por dentro são quatro tabelas: o nome e o telefone em cliente, as datas
-- em emprestimo, o título em jogo, e item_emprestimo ligando os dois. Quem
-- usa a view não precisa saber disso.

CREATE OR REPLACE VIEW v_locacoes_em_aberto AS
SELECT c.nome, c.telefone, j.titulo, e.data_retirada, e.data_prevista
FROM emprestimo e
INNER JOIN cliente c         ON c.id_cliente    = e.id_cliente
INNER JOIN item_emprestimo i ON i.id_emprestimo = e.id_emprestimo
INNER JOIN jogo j            ON j.id_jogo       = i.id_jogo
WHERE e.data_entregue IS NULL;

-- Usando — uma linha por jogo que está fora:

SELECT *
FROM v_locacoes_em_aberto
ORDER BY data_prevista, titulo;

-- Voltou: 4 linhas — Bruno Lima com Baldur's Gate 3 e Elden Ring (até
-- 23/10), Ana Souza com Elden Ring (até 24/10) e Carla Menezes com God of
-- War Ragnarök (até 26/10).
--
-- E agora a view responde pergunta nova sem JOIN nenhum. "No dia 25/10,
-- o que estava atrasado?":

SELECT nome, telefone, titulo, data_prevista
FROM v_locacoes_em_aberto
WHERE data_prevista < '2026-10-25'
ORDER BY data_prevista, titulo;

-- Voltou: 3 linhas — os dois jogos do Bruno e o Elden Ring da Ana.
--
-- A view não guardou essas linhas. Quando a Ana devolver, ela some daqui
-- sozinha, porque a view roda a consulta de novo a cada uso.


-- ----------------------------------------------------------------------------
-- 5. A view do catálogo: "o que tem para o meu console, e por quanto?"
-- ----------------------------------------------------------------------------
-- Quem pergunta: quase todo cliente que entra na loja.
--
-- Plataforma e jogo são N:N, então a resposta atravessa três tabelas. A
-- view junta as três uma vez, e a pergunta do cliente vira um WHERE.

CREATE OR REPLACE VIEW v_catalogo_por_console AS
SELECT p.nome AS console, j.titulo, j.genero, j.preco_diaria
FROM jogo j
INNER JOIN jogos_plataforma jp ON jp.id_jogo       = j.id_jogo
INNER JOIN plataforma p        ON p.id_plataforma  = jp.id_plataforma;

-- Usando — "tenho um Switch":

SELECT titulo, genero, preco_diaria
FROM v_catalogo_por_console
WHERE console = 'Nintendo Switch'
ORDER BY preco_diaria;

-- Voltou: 3 jogos — Mario Kart 8 Deluxe (10,00), Pokémon Scarlet (16,00) e
-- Tears of the Kingdom (20,00).
--
-- A view inteira tem 18 linhas, e não 12: o jogo que roda em três consoles
-- aparece três vezes, uma por console. Para o cliente é o certo — para
-- contar quantos jogos a loja tem, não serviria.
