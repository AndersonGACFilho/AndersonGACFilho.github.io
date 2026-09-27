-- ============================================================================
-- Exercícios da Aula 12 — pôr dado, mudar dado, e o susto do DELETE
-- ============================================================================
--
-- Oito situações de INSERT, UPDATE e DELETE. As duas últimas são as que mais
-- importam, e são as que mais assustam.
--
-- ANTES: rode o locadora-demo.sql.
--
-- COMO USAR, no Query Tool do pgAdmin:
--
--   1. leia a situação
--   2. escreva o palpite antes de rodar
--   3. selecione só o comando e aperte F5
--   4. compare com o palpite
--   5. só depois, role até a CONFERÊNCIA
--
-- TUDO ACONTECE NA oficina_catalogo, criada logo abaixo. É a sua bancada, e
-- ela existe justamente para você poder apagar tudo por engano sem estragar a
-- locadora. Rode este primeiro bloco antes dos exercícios.
--
-- ESTRAGOU E QUER RECOMEÇAR? No fim do arquivo, na seção RECOMEÇAR A OFICINA,
-- há um bloco comentado que repõe a bancada no estado inicial. Selecione,
-- descomente mentalmente (ou copie para outra aba) e rode só ele.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 0. A bancada
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS oficina_catalogo (
    id_item      SERIAL        PRIMARY KEY,
    titulo       VARCHAR(150)  NOT NULL,
    genero       VARCHAR(40),
    preco_diaria NUMERIC(10,2) CHECK (preco_diaria >= 0),
    CONSTRAINT oficina_catalogo_uk UNIQUE (titulo)
);

INSERT INTO oficina_catalogo (titulo, genero, preco_diaria) VALUES
    ('Hollow Knight',   'Aventura',   8.00),
    ('Stardew Valley',  'Simulação',  7.00),
    ('Hades',           'Ação',      11.00),
    ('Celeste',         'Plataforma', 6.00)
ON CONFLICT DO NOTHING;

-- Confira: quatro linhas.
SELECT * FROM oficina_catalogo ORDER BY id_item;


-- ----------------------------------------------------------------------------
-- 1. "Chegou um jogo novo"
-- ----------------------------------------------------------------------------
-- Cadastre o Undertale, gênero RPG, diária de 5 reais.
--
-- Meu palpite — que id ele vai receber? ____
--
-- Seu comando:



-- ----------------------------------------------------------------------------
-- 2. As aspas
-- ----------------------------------------------------------------------------
-- Rode exatamente assim, de propósito:
--
--     INSERT INTO oficina_catalogo (titulo, genero, preco_diaria)
--     VALUES ("Katana Zero", 'Ação', 9.00);
--
-- Meu palpite — dá certo?   ( ) sim   ( ) não
-- Se der erro, o que você acha que a mensagem vai dizer? ____________
--
-- Depois conserte e insira de verdade.



-- ----------------------------------------------------------------------------
-- 3. O jogo com apóstrofo no nome
-- ----------------------------------------------------------------------------
-- Cadastre o "Baldur's Gate 3", RPG, 22 reais.
--
-- Meu palpite — como você escreve o apóstrofo para o banco não se perder?
--   ____________________
--
-- Seu comando:



-- ----------------------------------------------------------------------------
-- 4. Três de uma vez
-- ----------------------------------------------------------------------------
-- Cadastre em UM comando só: Cuphead (Plataforma, 7.00), Dead Cells (Ação,
-- 9.00) e Gris (Aventura, 5.00).
--
-- Meu palpite — quantos ponto e vírgula esse comando tem? ____
--
-- Seu comando:



-- ----------------------------------------------------------------------------
-- 5. "Aumenta a diária do Hades"
-- ----------------------------------------------------------------------------
-- Passou de 11 para 13 reais.
--
-- Meu palpite — quantas linhas o pgAdmin vai dizer que foram afetadas? ____
--
-- Seu comando:



-- ----------------------------------------------------------------------------
-- 6. O UPDATE esquecido
-- ----------------------------------------------------------------------------
-- Agora rode isto, que é o erro mais caro desta aula:
--
--     UPDATE oficina_catalogo SET genero = 'RPG';
--
-- Meu palpite — quantas linhas mudam? ____
--
-- Rode. Depois:
--     SELECT * FROM oficina_catalogo ORDER BY id_item;
--
-- Como você desfaz isso? ____________________
--
-- (Tente responder antes de olhar a conferência. A resposta é desconfortável.)



-- ----------------------------------------------------------------------------
-- 7. O DELETE com rede de segurança
-- ----------------------------------------------------------------------------
-- Você vai apagar o Celeste. Antes, rode o SELECT com o MESMO where:
--
--     SELECT * FROM oficina_catalogo WHERE titulo = 'Celeste';
--
-- Meu palpite — quantas linhas o SELECT traz? ____
--
-- Só depois troque SELECT * por DELETE:
--
--     DELETE FROM oficina_catalogo WHERE titulo = 'Celeste';
--
-- Esse hábito — SELECT primeiro, DELETE depois, mesmo WHERE — é o que separa
-- quem já apagou uma tabela inteira de quem ainda não apagou.



-- ----------------------------------------------------------------------------
-- 8. A ordem que o banco impõe
-- ----------------------------------------------------------------------------
-- Volte para as tabelas da locadora, e tente inserir um empréstimo de um
-- cliente que ainda não existe:
--
--     INSERT INTO emprestimo (id_cliente, id_jogo, data_retirada, data_prevista)
--     VALUES (99, 1, '2026-10-25', '2026-10-28');
--
-- O banco aceita?   ( ) sim   ( ) não
--
-- E agora a pergunta que interessa: isso quer dizer que existe uma ORDEM
-- obrigatória para popular um banco. Qual é a ordem, para as quatro tabelas
-- da locadora?
--
--   1. ____________  2. ____________  3. ____________  4. ____________



-- ============================================================================
-- CONFERÊNCIA — só role até aqui depois de tentar
-- ============================================================================
--
--
-- 1) provavelmente NÃO é 5 — e essa é a parte interessante
--
--        INSERT INTO oficina_catalogo (titulo, genero, preco_diaria)
--        VALUES ('Undertale', 'RPG', 5.00);
--
--    Se você rodou este arquivo uma vez só, veio 5. Se rodou duas, veio 9. E
--    a bancada tem quatro linhas nos dois casos.
--
--    O motivo: as quatro linhas iniciais entram com ON CONFLICT DO NOTHING.
--    Na segunda execução elas são recusadas — mas o SERIAL já tinha separado
--    um número para cada uma antes de a recusa acontecer, e o contador não
--    volta atrás. Quatro números queimados sem nenhuma linha nova.
--
--    Não é defeito: é o preço de o contador funcionar com várias pessoas
--    inserindo ao mesmo tempo sem uma esperar a outra. Se ele tivesse de
--    devolver os números não usados, viraria a fila que o banco existe para
--    evitar.
--
--    O que fica: buraco na numeração é normal, e id não conta nada. Quantos
--    itens existem é COUNT(*), nunca o último id. Você também não digita o
--    id — dizer o número na mão é o caminho mais curto para a colisão que a
--    Aula 01 mostrou na planilha.
--
--
-- 2) dá erro
--
--        ERROR: column "Katana Zero" does not exist
--
--    E repare que a mensagem não fala de aspas: fala de COLUNA. Para o
--    Postgres, aspas duplas são o jeito de nomear uma coluna ou tabela — ele
--    entendeu que você pediu o conteúdo de uma coluna chamada Katana Zero.
--
--    Aspas simples = texto. Aspas duplas = nome de objeto. É o erro nº 1
--    desta aula, e a mensagem confunde justamente porque parece falar de
--    outra coisa.
--
--
-- 3) dobrando o apóstrofo
--
--        INSERT INTO oficina_catalogo (titulo, genero, preco_diaria)
--        VALUES ('Baldur''s Gate 3', 'RPG', 22.00);
--
--    São dois apóstrofos seguidos, não aspas duplas. O banco lê '' como um
--    apóstrofo só. Com um apóstrofo simples, ele entende que o texto acabou
--    em "Baldur" e trava no "s Gate 3".
--
--    Guarde esse detalhe: é aqui que nasce a injeção de SQL, que aparece na
--    Aula 15. Quando o texto vem de um usuário e alguém o cola direto no
--    comando, o apóstrofo dele fecha a sua string e o resto vira comando.
--
--
-- 4) um ponto e vírgula só, no fim
--
--        INSERT INTO oficina_catalogo (titulo, genero, preco_diaria) VALUES
--            ('Cuphead',    'Plataforma', 7.00),
--            ('Dead Cells', 'Ação',       9.00),
--            ('Gris',       'Aventura',   5.00);
--
--    Vírgula entre os parênteses, ponto e vírgula só no final. É a mesma
--    pontuação do CREATE TABLE da Aula 10 — vírgula separa item, ponto e
--    vírgula encerra comando.
--
--
-- 5) uma linha — "UPDATE 1"
--
--        UPDATE oficina_catalogo SET preco_diaria = 13.00
--        WHERE  titulo = 'Hades';
--
--    O número que o pgAdmin devolve é a sua conferência. Esperava 1 e veio 9?
--    Aconteceu alguma coisa que você não pediu — e ainda dá tempo de olhar
--    antes de fechar a aba.
--
--
-- 6) TODAS mudam — e não dá para desfazer
--
--    O UPDATE sem WHERE não é erro de sintaxe: é um comando perfeitamente
--    válido que faz exatamente o que você escreveu. O banco obedeceu.
--
--    E não existe Ctrl+Z. Para voltar atrás você precisaria de:
--      - um backup, que é a Aula 17; ou
--      - ter aberto uma transação antes (BEGIN ... ROLLBACK), que o pgAdmin
--        não faz sozinho no Query Tool.
--
--    Na bancada, a saída é a seção RECOMEÇAR A OFICINA, aqui embaixo. Num
--    banco de produção, a saída seria o backup de ontem — e o dia de trabalho
--    perdido entre ontem e agora.
--
--    Por isso o hábito do exercício 7: escreva o WHERE PRIMEIRO, antes do
--    SET. Muita gente experiente digita "UPDATE tabela WHERE ..." e só depois
--    volta para preencher o SET, exatamente para nunca ter um comando sem
--    WHERE pronto para rodar por acidente.
--
--
-- 7) uma linha
--
--    Trocar SELECT * por DELETE, mantendo o WHERE, custa dois segundos e
--    mostra exatamente o que vai sumir. Se o SELECT trouxe 40 linhas quando
--    você esperava 1, o WHERE está errado — e você descobriu isso ANTES.
--
--
-- 8) recusa, e a ordem é:
--
--        1. plataforma   (não depende de ninguém)
--        2. cliente      (não depende de ninguém)
--        3. jogo         (depende de plataforma)
--        4. emprestimo   (depende de cliente e de jogo)
--
--    A ordem não é convenção: é a mesma integridade referencial da Aula 11
--    vista do lado dos dados. Você não consegue apontar para uma linha que
--    ainda não existe.
--
--    E ela é a ordem INVERSA da de apagar: para esvaziar o banco, começa pelo
--    emprestimo. Quem tenta apagar plataforma primeiro toma o mesmo erro, de
--    trás para frente.
--
--    No projeto do SEU grupo: desenhe a ordem de inserção das tabelas de
--    vocês antes de começar a popular. Duas tabelas que apontam uma para a
--    outra tornam essa ordem impossível — e isso é sinal de que a modelagem
--    precisa de outra olhada.


-- ============================================================================
-- RECOMEÇAR A OFICINA
-- ============================================================================
-- Estragou a bancada? Este bloco repõe as quatro linhas iniciais. Ele está
-- comentado de propósito: se rodasse junto com o arquivo, apagaria o seu
-- trabalho toda vez que você executasse tudo.
--
-- Para usar: selecione as três linhas de comando abaixo, tire os "-- " do
-- começo de cada uma e rode só elas.
--
-- DELETE FROM oficina_catalogo;
-- INSERT INTO oficina_catalogo (titulo, genero, preco_diaria) VALUES
--     ('Hollow Knight','Aventura',8.00), ('Stardew Valley','Simulação',7.00),
--     ('Hades','Ação',11.00), ('Celeste','Plataforma',6.00);
