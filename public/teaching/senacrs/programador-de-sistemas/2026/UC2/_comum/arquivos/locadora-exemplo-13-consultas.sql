-- ============================================================================
-- Exemplo de entrega da Aula 13 — o arquivo de consultas, feito na locadora
-- ============================================================================
--
-- O professor não conhece o banco do seu grupo. Então como ele sabe se a
-- consulta de vocês está certa?
--
-- Rodar sem erro não prova nada: a consulta pode rodar e responder outra
-- pergunta. O que deixa conferir é a PERGUNTA EM PORTUGUÊS escrita em cima
-- dela. Com a pergunta, qualquer um lê a consulta e vê se ela responde
-- aquilo. Sem a pergunta, ela não tem como estar certa nem errada.
--
-- Este arquivo é o grupoNN-aula13-consultas.sql que um grupo da LOCADORA
-- entregaria. O de vocês é sobre o minimundo do grupo, com as tabelas e as
-- perguntas de quem usaria aquele sistema. Copiar daqui não serve: as
-- tabelas não são as mesmas. Para treinar na locadora, use o
-- locadora-exercicios-13-consultas.sql — as perguntas de lá são outras.
--
-- Cada consulta tem três partes:
--   a PERGUNTA, entre aspas, como a pessoa falaria no balcão
--   QUEM pergunta e PARA QUÊ — é o que diz que colunas mostrar
--   o que VOLTOU, para quem lê poder conferir sem rodar
--
-- ANTES: rode o locadora-demo.sql, senão não há banco para consultar.
--
-- COMO RODAR, no Query Tool do pgAdmin: selecione UMA consulta com o mouse e
-- aperte F5. Sem selecionar, o pgAdmin roda o arquivo inteiro e mostra só o
-- resultado da última.
--
-- RODAR DE NOVO NÃO ESTRAGA NADA: aqui só há SELECT, e SELECT não muda dado.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. "Tenho no máximo 12 reais por dia. O que dá para levar?"
-- ----------------------------------------------------------------------------
-- Quem pergunta: um cliente com o orçamento contado.
-- Para quê: a atendente mostra só o que cabe, do mais barato para o mais caro.
--
-- O <= importa: com < 12, God of War e Halo, que custam exatamente 12,
-- ficariam de fora — e o cliente pode pagar os dois.

SELECT titulo, preco_diaria
FROM jogo
WHERE preco_diaria <= 12
ORDER BY preco_diaria, titulo;

-- Voltou: 4 jogos — Mario Kart 8 Deluxe (10,00), Age of Empires IV (11,00),
-- God of War e Halo Infinite (12,00 cada).


-- ----------------------------------------------------------------------------
-- 2. "Quais empréstimos ainda não voltaram?"
-- ----------------------------------------------------------------------------
-- Quem pergunta: o dono, no fim do dia, antes de fechar o caixa.
-- Para quê: saber quanta coisa está na rua.
--
-- "Não voltou" é data_entregue VAZIA — e vazio se testa com IS NULL. Com
-- = NULL a consulta roda, não dá erro nenhum e devolve zero linhas, porque
-- nulo é "não sei" e não é igual a nada, nem a outro nulo.

SELECT id_emprestimo, id_cliente, data_retirada, data_prevista
FROM emprestimo
WHERE data_entregue IS NULL
ORDER BY data_prevista;

-- Voltou: 3 empréstimos, previstos para 23/10, 24/10 e 26/10.
--
-- Repare que a resposta tem id_cliente, um número, e não o NOME. O nome
-- está em outra tabela, e juntar duas tabelas é a Aula 14.


-- ----------------------------------------------------------------------------
-- 3. "Meu filho gosta de corrida ou de aventura, e eu pago até 15 por dia"
-- ----------------------------------------------------------------------------
-- Quem pergunta: um pai, com duas condições que valem JUNTAS — o gênero é
-- uma escolha entre dois, e o preço vale para os dois gêneros.
--
-- Os parênteses dizem isso ao banco. A consulta certa:

SELECT titulo, genero, preco_diaria
FROM jogo
WHERE (genero = 'Corrida' OR genero = 'Aventura')
  AND preco_diaria <= 15
ORDER BY preco_diaria;

-- Voltou: 3 jogos — Mario Kart 8 Deluxe (10,00), Forza Horizon 5 (14,00) e
-- The Last of Us Part II (15,00).
--
-- E a versão que roda e MENTE — não entregue assim. Antes de rodar, quantas
-- linhas você acha que vêm? ____

SELECT titulo, genero, preco_diaria
FROM jogo
WHERE genero = 'Aventura' OR genero = 'Corrida' AND preco_diaria <= 15
ORDER BY preco_diaria;

-- Voltam 4: entra o Tears of the Kingdom, a 20,00, acima do que o pai paga.
-- Sem parênteses, o AND é resolvido ANTES do OR, como a multiplicação antes
-- da soma. O banco leu "qualquer Aventura, OU Corrida até 15". Não deu erro,
-- e o resultado parece razoável — por isso é o erro mais perigoso da aula.


-- ----------------------------------------------------------------------------
-- 4. "Quem se cadastrou em setembro? Quero ligar para dar as boas-vindas"
-- ----------------------------------------------------------------------------
-- Quem pergunta: a gerente, que liga para cliente novo.
-- Para quê: ela precisa do nome e do telefone — então são essas as colunas.
--
-- BETWEEN inclui as duas pontas: 01/09 e 30/09 entram. A data vai em
-- ano-mês-dia, sempre; 01/09/2026 o banco não entende como data.

SELECT nome, telefone, data_cadastro
FROM cliente
WHERE data_cadastro BETWEEN '2026-09-01' AND '2026-09-30'
ORDER BY data_cadastro;

-- Voltou: 3 clientes — Carla Menezes (02/09), Diego Rocha (15/09) e
-- Elisa Prado (28/09).


-- ----------------------------------------------------------------------------
-- 5. "Quais são os três jogos mais caros? Vão para a vitrine"
-- ----------------------------------------------------------------------------
-- Quem pergunta: quem monta a vitrine da semana.
--
-- ORDER BY ... DESC põe o mais caro em cima, e LIMIT 3 corta. Mas há um
-- EMPATE no terceiro lugar: God of War Ragnarök e Elden Ring custam 18,00.
-- Só com o preço no ORDER BY, o banco escolhe qualquer um dos dois, e pode
-- escolher diferente amanhã. O segundo critério (titulo) decide o empate
-- de um jeito que se explica.

SELECT titulo, preco_diaria
FROM jogo
ORDER BY preco_diaria DESC, titulo
LIMIT 3;

-- Voltou: Baldur's Gate 3 (22,00), Tears of the Kingdom (20,00) e
-- Elden Ring (18,00) — que vem antes de "God" na ordem alfabética.
--
-- O LIMIT cortou o God of War Ragnarök sem avisar. Se a vitrine tem lugar
-- para quatro, a pergunta muda, e a consulta muda junto.


-- ----------------------------------------------------------------------------
-- 6. "É aquele do RING, não lembro o resto do nome"
-- ----------------------------------------------------------------------------
-- Quem pergunta: um cliente que lembra só um pedaço, e escreveu em
-- maiúsculas no papel.
--
-- ILIKE ignora maiúscula e minúscula; LIKE não. Com LIKE '%RING%' a consulta
-- roda e volta vazia — e a atendente diria que o jogo não existe.

SELECT titulo, genero, preco_diaria
FROM jogo
WHERE titulo ILIKE '%ring%';

-- Voltou: 1 jogo — Elden Ring, RPG, 18,00.
