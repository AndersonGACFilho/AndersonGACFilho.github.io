-- ============================================================================
-- locadora_demo — o banco de exemplo da UC2
-- ============================================================================
--
-- Este é o banco que a gente explora na Aula 02, e o mesmo que a turma
-- constrói do zero nas Aulas 10, 11 e 12. Se você perdeu alguma dessas aulas,
-- rode este arquivo e continue de onde a turma está.
--
-- COMO RODAR, sem terminal, só pelo pgAdmin:
--
--   1. abra o pgAdmin e conecte no servidor PostgreSQL
--   2. botão direito em "Databases" → Create → Database…
--      Database: locadora_demo          → Save
--   3. clique no banco locadora_demo (uma vez, para selecionar)
--   4. menu Tools → Query Tool
--   5. no Query Tool: Open File (a pastinha) → escolha este arquivo
--   6. Execute (o ▶ ou F5)
--
-- Deu certo se a última saída mostrar a contagem das quatro tabelas. Se as
-- tabelas não aparecerem na árvore à esquerda, botão direito em Tables →
-- Refresh.
--
-- RODAR DE NOVO NÃO ESTRAGA NADA. O arquivo só cria o que ainda não existe e
-- só insere o que ainda não está lá: rodar dez vezes dá o mesmo resultado de
-- rodar uma. Ele também NÃO apaga o que você tiver criado ou alterado por
-- conta própria — se você mexeu numa linha, ela fica como você deixou.
--
-- Este é o banco da locadora, que é o NOSSO exemplo, o que a gente resolve
-- junto. O projeto do seu grupo é outro minimundo, com as entidades que vocês
-- levantaram. Aqui você treina; lá você modela.
--
-- Depois de montar, os exercícios estão em:
--   locadora-exercicios-13-consultas.sql
--   locadora-exercicios-14-juncoes.sql
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. Estrutura — o ESQUEMA (Aulas 10 e 11)
-- ----------------------------------------------------------------------------
--
-- IF NOT EXISTS: "crie, a não ser que já exista". Sem isso, rodar o arquivo
-- pela segunda vez pararia no primeiro CREATE TABLE com erro de tabela
-- duplicada — e, pior, a alternativa preguiçosa seria apagar tudo antes de
-- recriar, o que levaria junto o que você estivesse testando.
--
-- A ordem importa: quem é apontado vem antes de quem aponta.

CREATE TABLE IF NOT EXISTS plataforma (
    id_plataforma  SERIAL       PRIMARY KEY,
    -- UNIQUE porque duas plataformas com o mesmo nome seriam a mesma coisa
    -- cadastrada duas vezes. É a chave natural da Aula 05, aqui marcada como
    -- única, com o id artificial seguindo como chave primária.
    nome           VARCHAR(50)  NOT NULL UNIQUE,
    fabricante     VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS cliente (
    id_cliente     SERIAL        PRIMARY KEY,
    nome           VARCHAR(100)  NOT NULL,
    -- telefone é texto, não número: tem traço, parêntese e zero à esquerda —
    -- e ninguém soma telefones. Esta é a resposta da pergunta da Aula 02.
    telefone       VARCHAR(20),
    email          VARCHAR(120)  UNIQUE,
    data_cadastro  DATE          DEFAULT CURRENT_DATE,
    ativo          BOOLEAN       DEFAULT TRUE,
    -- mesmo nome e mesmo telefone é a mesma pessoa cadastrada de novo.
    -- Homônimo com outro telefone continua entrando, que é o certo.
    CONSTRAINT cliente_natural_uk UNIQUE (nome, telefone)
);

CREATE TABLE IF NOT EXISTS jogo (
    id_jogo         SERIAL         PRIMARY KEY,
    titulo          VARCHAR(150)   NOT NULL,
    genero          VARCHAR(40),
    ano_lancamento  INTEGER        CHECK (ano_lancamento > 1970),
    preco_diaria    NUMERIC(10,2)  CHECK (preco_diaria >= 0),
    id_plataforma   INTEGER        REFERENCES plataforma(id_plataforma),
    -- o mesmo título entra uma vez por plataforma: God of War de PS5 e de PC
    -- são duas linhas legítimas, dois de PS5 não.
    CONSTRAINT jogo_natural_uk UNIQUE (titulo, id_plataforma)
);

CREATE TABLE IF NOT EXISTS emprestimo (
    id_emprestimo   SERIAL   PRIMARY KEY,
    id_cliente      INTEGER  NOT NULL REFERENCES cliente(id_cliente),
    id_jogo         INTEGER  NOT NULL REFERENCES jogo(id_jogo),
    data_retirada   DATE     NOT NULL,
    -- CHECK comparando duas colunas da mesma linha: a devolução prevista não
    -- pode cair antes da retirada. O banco recusa a linha, e não adianta o
    -- sistema insistir.
    data_prevista   DATE     NOT NULL CHECK (data_prevista >= data_retirada),
    -- nulo aqui quer dizer "ainda não devolveu". Nulo é ausência, não zero.
    data_devolucao  DATE,
    -- a mesma pessoa pode pegar o mesmo jogo de novo em outro dia; duas vezes
    -- no mesmo dia é lançamento repetido.
    CONSTRAINT emprestimo_natural_uk UNIQUE (id_cliente, id_jogo, data_retirada)
);


-- ----------------------------------------------------------------------------
-- 2. Dados — a INSTÂNCIA (Aula 12)
-- ----------------------------------------------------------------------------
--
-- ON CONFLICT DO NOTHING: "se bater com uma linha que já existe, deixa quieto".
-- É o que faz este arquivo poder rodar de novo sem duplicar nada. O que decide
-- se "já existe" são as constraints UNIQUE lá de cima — sem elas o banco não
-- teria como saber o que é repetido.
--
-- O INSERT que a Aula 12 ensina é o de sempre; ON CONFLICT é uma linha a mais
-- no fim.

INSERT INTO plataforma (nome, fabricante) VALUES
    ('PlayStation 5',   'Sony'),
    ('Nintendo Switch', 'Nintendo'),
    ('Xbox Series X',   'Microsoft'),
    ('PC',              NULL)            -- sem fabricante único: nulo é honesto
ON CONFLICT DO NOTHING;

INSERT INTO cliente (nome, telefone, email, data_cadastro) VALUES
    ('Ana Souza',      '(51) 99931-1042', 'ana.souza@exemplo.com',   '2026-08-14'),
    ('Bruno Lima',     '(51) 98122-7765', 'bruno.lima@exemplo.com',  '2026-08-27'),
    -- sem email: a coluna aceita nulo, e é com esta linha que o IS NULL da
    -- Aula 13 tem o que encontrar
    ('Carla Menezes',  '(51) 99604-3318', NULL,                      '2026-09-02'),
    ('Diego Rocha',    '(51) 98470-2251', 'diego.rocha@exemplo.com', '2026-09-15'),
    ('Elisa Prado',    '(51) 99215-8890', 'elisa.prado@exemplo.com', '2026-09-28')
ON CONFLICT DO NOTHING;

-- Repare que a plataforma não entra pelo número, e sim procurada pelo nome.
-- Se entrasse como 1, 2, 3, bastaria alguém cadastrar uma plataforma antes de
-- você para os jogos irem parar na plataforma errada — o id é do banco, não
-- do mundo. É a chave artificial da Aula 05 vista por outro ângulo.
INSERT INTO jogo (titulo, genero, ano_lancamento, preco_diaria, id_plataforma)
SELECT j.titulo, j.genero, j.ano_lancamento, j.preco_diaria, p.id_plataforma
FROM (VALUES
    ('God of War',             'Ação',       2018, 12.00, 'PlayStation 5'),
    ('God of War Ragnarök',    'Ação',       2022, 18.00, 'PlayStation 5'),
    ('The Last of Us Part II', 'Aventura',   2020, 15.00, 'PlayStation 5'),
    ('Gran Turismo 7',         'Esporte',    2022, 14.00, 'PlayStation 5'),
    ('Tears of the Kingdom',   'Aventura',   2023, 20.00, 'Nintendo Switch'),
    ('Mario Kart 8 Deluxe',    'Corrida',    2017, 10.00, 'Nintendo Switch'),
    ('Pokémon Scarlet',        'RPG',        2022, 16.00, 'Nintendo Switch'),
    ('Halo Infinite',          'Ação',       2021, 12.00, 'Xbox Series X'),
    ('Forza Horizon 5',        'Corrida',    2021, 14.00, 'Xbox Series X'),
    -- APÓSTROFO NO MEIO DO TEXTO: escreve-se DUAS vezes seguidas. O banco lê
    -- '' como um apóstrofo só. Escrevendo uma vez, ele entende que a string
    -- acabou ali e acusa erro de sintaxe — é o erro nº 1 da Aula 12.
    ('Baldur''s Gate 3',       'RPG',        2023, 22.00, 'PC'),
    ('Elden Ring',             'RPG',        2022, 18.00, 'PC'),
    ('Age of Empires IV',      'Estratégia', 2021, 11.00, 'PC')
) AS j(titulo, genero, ano_lancamento, preco_diaria, plataforma)
JOIN plataforma p ON p.nome = j.plataforma
ON CONFLICT DO NOTHING;

-- Mesma ideia: o cliente é procurado pelo nome e o jogo pelo título.
-- Datas em ano-mês-dia, sempre: 21/10/2026 o banco não entende, e
-- 2026-10-21 ainda ordena certo quando lido como texto.
INSERT INTO emprestimo (id_cliente, id_jogo, data_retirada, data_prevista, data_devolucao)
SELECT c.id_cliente, j.id_jogo, e.retirada, e.prevista, e.devolucao
FROM (VALUES
    ('Ana Souza',     'God of War',             DATE '2026-10-05', DATE '2026-10-08', DATE '2026-10-07'),
    ('Ana Souza',     'Pokémon Scarlet',        DATE '2026-10-09', DATE '2026-10-12', DATE '2026-10-12'),
    ('Ana Souza',     'Elden Ring',             DATE '2026-10-20', DATE '2026-10-24', NULL),
    ('Bruno Lima',    'The Last of Us Part II', DATE '2026-10-06', DATE '2026-10-09', DATE '2026-10-11'),
    ('Bruno Lima',    'Baldur''s Gate 3',       DATE '2026-10-19', DATE '2026-10-23', NULL),
    ('Carla Menezes', 'Tears of the Kingdom',   DATE '2026-10-14', DATE '2026-10-17', DATE '2026-10-16'),
    ('Carla Menezes', 'God of War Ragnarök',    DATE '2026-10-22', DATE '2026-10-26', NULL)
) AS e(cliente, jogo, retirada, prevista, devolucao)
JOIN cliente c ON c.nome = e.cliente
JOIN jogo    j ON j.titulo = e.jogo
ON CONFLICT DO NOTHING;
-- Diego e Elisa não aparecem aqui: são clientes sem nenhum empréstimo. É por
-- causa deles que o LEFT JOIN da Aula 14 mostra algo que o INNER JOIN esconde.


-- ----------------------------------------------------------------------------
-- 3. Conferência
-- ----------------------------------------------------------------------------
-- Rodou certo? Estes números têm de aparecer: 4 plataformas, 5 clientes,
-- 12 jogos, 7 empréstimos. E têm de continuar os mesmos se você rodar o
-- arquivo de novo — se dobrarem, alguma constraint UNIQUE não foi criada.

SELECT 'plataforma' AS tabela, COUNT(*) AS linhas FROM plataforma
UNION ALL SELECT 'cliente',    COUNT(*) FROM cliente
UNION ALL SELECT 'jogo',       COUNT(*) FROM jogo
UNION ALL SELECT 'emprestimo', COUNT(*) FROM emprestimo;
