-- ============================================================================
-- Exercícios da Aula 15 — pergunta dentro de pergunta, e consulta com nome
-- ============================================================================
--
-- Oito situações em que a resposta depende de outra resposta, e onde guardar
-- a consulta com um nome muda a vida de quem vai usá-la depois.
--
-- ANTES: rode o locadora-demo.sql.
--
-- COMO USAR, no Query Tool do pgAdmin:
--
--   1. leia a situação
--   2. escreva o palpite antes de rodar — escreva mesmo, no arquivo
--   3. selecione só o comando e aperte F5
--   4. compare com o palpite
--   5. só depois, role até a CONFERÊNCIA
--
-- As views que você criar aqui começam com v_, e todas com CREATE OR REPLACE:
-- pode rodar quantas vezes quiser.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. "Me lista os jogos de PlayStation 5"
-- ----------------------------------------------------------------------------
-- Você sabe o NOME da plataforma. A tabela jogo guarda o NÚMERO. E você não
-- quer ir ali olhar qual é o número — amanhã pode ser outro.
--
-- Meu palpite — quantos jogos? ____
--
-- Sua consulta (sem JOIN; use uma consulta dentro da outra):



-- ----------------------------------------------------------------------------
-- 2. "Só o que é de console, nada de PC"
-- ----------------------------------------------------------------------------
-- Console tem fabricante; o PC não tem — o fabricante dele é nulo.
--
-- Meu palpite — quantos jogos sobram? ____
--
-- Sua consulta (a subconsulta agora devolve VÁRIAS plataformas, e isso muda o
-- operador que você usa):



-- ----------------------------------------------------------------------------
-- 3. "Quais são mais novos que a média do catálogo?"
-- ----------------------------------------------------------------------------
-- A média não está em lugar nenhum: ela é calculada na hora.
--
-- Meu palpite — qual é a média de ano_lancamento? ____
-- E quantos jogos ficam acima dela? ____
--
-- Sua consulta:



-- ----------------------------------------------------------------------------
-- 4. O operador errado
-- ----------------------------------------------------------------------------
-- Rode de propósito, com = onde deveria ser outra coisa:
--
--     SELECT titulo FROM jogo
--     WHERE  id_plataforma = (SELECT id_plataforma FROM plataforma
--                             WHERE fabricante IS NOT NULL);
--
-- Meu palpite — o que acontece?
--   ( ) traz o primeiro que achar    ( ) traz todos
--   ( ) dá erro                      ( ) não traz nada



-- ----------------------------------------------------------------------------
-- 5. A armadilha do NOT IN
-- ----------------------------------------------------------------------------
-- "Quero as plataformas que não são da Sony." São quatro plataformas, e só
-- uma é da Sony.
--
-- Meu palpite — quantas linhas vêm? ____
--
-- Rode:
--     SELECT nome, fabricante FROM plataforma
--     WHERE  fabricante NOT IN ('Sony');
--
-- Conferiu com o palpite? Se não, olhe a tabela inteira antes de ler a
-- conferência:
--     SELECT * FROM plataforma;



-- ----------------------------------------------------------------------------
-- 6. "Toda segunda eu preciso desse mesmo relatório"
-- ----------------------------------------------------------------------------
-- A dona quer, toda semana, quantos jogos existem por plataforma — inclusive
-- as plataformas sem nenhum jogo. Você não quer reescrever a consulta toda
-- semana, nem ensinar ela a escrever SQL.
--
-- Meu palpite — quantas linhas esse relatório tem? ____
--
-- Seu comando (crie com CREATE OR REPLACE VIEW v_jogos_por_plataforma AS ...,
-- e depois use com SELECT * FROM v_jogos_por_plataforma):



-- ----------------------------------------------------------------------------
-- 7. A view guarda o resultado ou a pergunta?
-- ----------------------------------------------------------------------------
-- Com a view do exercício 6 criada, insira um jogo novo:
--
--     INSERT INTO jogo (titulo, genero, ano_lancamento, preco_diaria, id_plataforma)
--     VALUES ('Jogo de Teste', 'Ação', 2024, 9.00,
--             (SELECT id_plataforma FROM plataforma WHERE nome = 'PC'))
--     ON CONFLICT DO NOTHING;
--
-- Meu palpite — sem recriar a view, o total do PC muda?
--   ( ) muda   ( ) não muda, a view guardou o resultado de antes
--
-- Rode SELECT * FROM v_jogos_por_plataforma; e veja.
--
-- Depois desfaça:
--     DELETE FROM jogo WHERE titulo = 'Jogo de Teste';



-- ----------------------------------------------------------------------------
-- 8. A view que existe para ESCONDER
-- ----------------------------------------------------------------------------
-- Na semana que vem entra um estagiário. Ele precisa consultar o catálogo,
-- mas a diária é informação comercial e ele não tem por que ver.
--
-- Meu palpite — dá para mostrar a tabela jogo sem mostrar uma coluna dela?
--   ( ) sim   ( ) não
--
-- Seu comando (crie a v_catalogo_publico com título, gênero e ano — e só):



-- ----------------------------------------------------------------------------
-- 9. Subconsulta ou JOIN?
-- ----------------------------------------------------------------------------
-- O exercício 1 dá para resolver dos dois jeitos. Escreva também com JOIN e
-- compare os dois resultados.
--
-- Meu palpite — os dois trazem exatamente as mesmas linhas? ____
--
-- E a pergunta que vale: se os dois resolvem, quando você escolhe cada um?
--
--   ____________________________________________________________



-- ============================================================================
-- CONFERÊNCIA — só role até aqui depois de tentar
-- ============================================================================
--
--
-- 1) quatro jogos
--
--        SELECT titulo FROM jogo
--        WHERE  id_plataforma = (SELECT id_plataforma FROM plataforma
--                                WHERE  nome = 'PlayStation 5');
--
--    A consulta de dentro roda primeiro e devolve UM valor; a de fora usa
--    esse valor. Você escreveu a pergunta na ordem em que ela é feita no
--    balcão: "o que é de PS5?" — e não "qual é o número do PS5, e o que tem
--    esse número?".
--
--
-- 2) nove jogos — os doze menos os três de PC
--
--        SELECT titulo FROM jogo
--        WHERE  id_plataforma IN (SELECT id_plataforma FROM plataforma
--                                 WHERE  fabricante IS NOT NULL);
--
--    IN, e não =, porque a subconsulta agora devolve três linhas. A regra é
--    simples: um valor, =; vários valores, IN.
--
--
-- 3) a média é exatamente 2021, e SEIS jogos ficam acima
--
--        SELECT titulo, ano_lancamento FROM jogo
--        WHERE  ano_lancamento > (SELECT AVG(ano_lancamento) FROM jogo);
--
--    Repare que a mesma tabela aparece dentro e fora. Não é erro: são duas
--    perguntas diferentes sobre ela — "qual é a média de todos" e "quem está
--    acima disso".
--
--    E cuidado com o > : os três jogos de 2021 ficam de FORA, porque 2021 não
--    é maior que 2021. Se a pergunta fosse "do ano da média para cá", o
--    operador seria >=, e viriam nove em vez de seis. Uma tecla de diferença,
--    três jogos de diferença.
--
--
-- 4) dá erro
--
--        ERROR: more than one row returned by a subquery used as an expression
--
--    O = espera UM valor à direita. A mensagem é uma das mais úteis do
--    Postgres: ela diz exatamente o que aconteceu, sem rodeio. Trocar por IN
--    resolve.
--
--    Guarde o caso oposto, que é mais traiçoeiro: se a subconsulta devolvesse
--    ZERO linhas, o = não daria erro — devolveria nada, calado.
--
--
-- 5) DUAS linhas, e não três
--
--    O PC some. Ele não é da Sony, então "deveria" aparecer — mas o
--    fabricante dele é nulo, e nulo não é igual nem diferente de 'Sony': a
--    comparação dá desconhecido, e a linha cai fora.
--
--    É a mesma regra do nulo das Aulas 11 e 13, agora na versão que mais
--    estraga relatório: o NOT IN silenciosamente esconde as linhas nulas. A
--    saída é dizer o que você quer com a ausência:
--
--        SELECT nome, fabricante FROM plataforma
--        WHERE  fabricante NOT IN ('Sony') OR fabricante IS NULL;
--
--    "Nunca vi esse cliente no relatório e ele existe no banco" quase sempre
--    é isto.
--
--
-- 6) quatro linhas — uma por plataforma
--
--        CREATE OR REPLACE VIEW v_jogos_por_plataforma AS
--        SELECT p.nome           AS plataforma,
--               COUNT(j.id_jogo) AS total_jogos
--        FROM   plataforma p
--        LEFT JOIN jogo j ON p.id_plataforma = j.id_plataforma
--        GROUP BY p.nome;
--
--    LEFT JOIN, senão uma plataforma sem jogo nenhum sumiria do relatório —
--    e é justamente ela que a dona precisa ver.
--
--    O OR REPLACE é o que deixa você corrigir a view sem apagar antes. Sem
--    ele, rodar de novo dá "view already exists".
--
--
-- 7) MUDA
--
--    A view não guarda resultado: guarda a PERGUNTA. Toda vez que você faz
--    SELECT nela, o banco roda a consulta de novo, nos dados de agora.
--
--    É por isso que ela não pesa no banco (não ocupa espaço de dados) e é por
--    isso que ela nunca fica desatualizada. Quando alguém precisa mesmo do
--    resultado congelado, a conversa é outra — materialized view — e não é
--    desta UC.
--
--
-- 8) dá, e é um dos usos mais importantes da view
--
--        CREATE OR REPLACE VIEW v_catalogo_publico AS
--        SELECT titulo, genero, ano_lancamento FROM jogo;
--
--    A view vira uma janela recortada: quem enxerga só ela não tem como
--    chegar no preço. Amanhã, na Aula 16, você dá permissão de leitura NA
--    VIEW e nenhuma permissão na tabela jogo — e aí o recorte deixa de ser
--    boa vontade e passa a ser garantia.
--
--    Isso também serve para dado pessoal: uma view de cliente sem telefone e
--    sem email é o que permite alguém trabalhar com a base sem carregar
--    informação que não precisa. A LGPD tem nome para isso: minimização.
--
--
-- 9) sim, as mesmas quatro linhas
--
--        SELECT j.titulo FROM jogo j
--        INNER JOIN plataforma p ON j.id_plataforma = p.id_plataforma
--        WHERE  p.nome = 'PlayStation 5';
--
--    Quando você quer colunas das DUAS tabelas — título do jogo E nome da
--    plataforma —, é JOIN; a subconsulta não tem como devolver isso.
--
--    Quando você só quer filtrar, e as colunas do resultado são todas de uma
--    tabela só, a subconsulta costuma ler melhor: ela deixa explícito que a
--    outra tabela está ali apenas para escolher quem entra.
--
--    Desempenho não é critério aqui: nesta escala, o Postgres reescreve os
--    dois para planos parecidos. Escolha pela leitura — o SQL vai ser lido
--    muito mais vezes do que foi escrito.
