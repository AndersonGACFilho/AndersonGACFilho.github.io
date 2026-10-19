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
-- Deu certo se a última saída mostrar a contagem das sete tabelas. Se as
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
-- SETE TABELAS PARA CINCO ENTIDADES. O DER tem PLATAFORMA, JOGO, CLIENTE,
-- ENDERECO e EMPRESTIMO. Os dois relacionamentos N:N — "uma plataforma roda
-- vários jogos, e um jogo roda em várias plataformas", "um empréstimo leva
-- vários jogos, e um jogo entra em vários empréstimos" — viram tabela no
-- mapeamento da Aula 07: `jogos_plataforma` e `item_emprestimo`.
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
-- A ordem importa: quem é apontado vem antes de quem aponta. Aqui são três
-- níveis — primeiro as três que não apontam para ninguém, depois as que
-- apontam para uma, por fim as duas tabelas do meio.

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
    -- UNIQUE no título sozinho: o jogo não é mais "o God of War de PS5", é o
    -- God of War, que roda em quantas plataformas rodar. Em que plataformas
    -- ele sai é assunto da tabela jogos_plataforma, logo abaixo.
    titulo          VARCHAR(150)   NOT NULL UNIQUE,
    genero          VARCHAR(40),
    ano_lancamento  INTEGER        CHECK (ano_lancamento > 1970),
    -- o preço de HOJE. O que foi cobrado numa locação específica fica em
    -- item_emprestimo.preco_pago, e os dois não são a mesma coisa.
    preco_diaria    NUMERIC(10,2)  CHECK (preco_diaria >= 0)
);

-- O 1:1 com cliente. A chave estrangeira mora AQUI, e não em cliente, porque
-- este é o lado opcional: cliente que só vem à loja não precisa dar endereço.
-- E é o UNIQUE nela que faz o 1:1 — sem ele, nada impediria o mesmo cliente de
-- ter dois endereços, e isto seria um 1:N. É a única diferença entre os dois.
CREATE TABLE IF NOT EXISTS endereco (
    id_endereco  SERIAL        PRIMARY KEY,
    id_cliente   INTEGER       NOT NULL UNIQUE REFERENCES cliente(id_cliente),
    logradouro   VARCHAR(150)  NOT NULL,
    numero       VARCHAR(10),
    bairro       VARCHAR(60),
    cidade       VARCHAR(60)   NOT NULL,
    uf           CHAR(2),
    cep          VARCHAR(9)
);

-- A primeira tabela do meio: o N:N entre plataforma e jogo, na forma PURA —
-- uma chave estrangeira por lado, as duas juntas formando a chave primária, e
-- nenhuma coluna própria. Compare com item_emprestimo, que tem.
CREATE TABLE IF NOT EXISTS jogos_plataforma (
    id_jogo        INTEGER  NOT NULL REFERENCES jogo(id_jogo),
    id_plataforma  INTEGER  NOT NULL REFERENCES plataforma(id_plataforma),
    PRIMARY KEY (id_jogo, id_plataforma)
);

CREATE TABLE IF NOT EXISTS emprestimo (
    id_emprestimo   SERIAL   PRIMARY KEY,
    id_cliente      INTEGER  NOT NULL REFERENCES cliente(id_cliente),
    data_retirada   DATE     NOT NULL,
    -- CHECK comparando duas colunas da mesma linha: a devolução prevista não
    -- pode cair antes da retirada. O banco recusa a linha, e não adianta o
    -- sistema insistir.
    data_prevista   DATE     NOT NULL CHECK (data_prevista >= data_retirada),
    -- nulo aqui quer dizer "ainda não devolveu". Nulo é ausência, não zero.
    data_entregue   DATE,
    -- a multa é CALCULÁVEL a partir das datas, e mesmo assim fica guardada.
    -- É decisão, não descuido: o valor cobrado tem de ser rastreável. Se a
    -- regra de multa mudar no ano que vem, o que foi cobrado em 2026 não pode
    -- mudar junto. É o mesmo motivo do preco_pago, e a Aula 09 trata os dois
    -- como desnormalização legítima.
    multa           NUMERIC(10,2)  DEFAULT 0  CHECK (multa >= 0),
    -- o mesmo cliente pode fazer outro empréstimo em outro dia; dois no mesmo
    -- dia é lançamento repetido.
    CONSTRAINT emprestimo_natural_uk UNIQUE (id_cliente, data_retirada)
);

-- A segunda tabela do meio: o N:N entre emprestimo e jogo, agora COM atributo
-- próprio. O preco_pago não cabe em jogo (muda a cada locação) nem em
-- emprestimo (há um por jogo) — pertence ao encontro dos dois. É o argumento
-- inteiro da Aula 06.
CREATE TABLE IF NOT EXISTS item_emprestimo (
    id_emprestimo  INTEGER        NOT NULL REFERENCES emprestimo(id_emprestimo),
    id_jogo        INTEGER        NOT NULL REFERENCES jogo(id_jogo),
    preco_pago     NUMERIC(10,2)  NOT NULL CHECK (preco_pago >= 0),
    PRIMARY KEY (id_emprestimo, id_jogo)
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

INSERT INTO jogo (titulo, genero, ano_lancamento, preco_diaria) VALUES
    ('God of War',             'Ação',       2018, 12.00),
    ('God of War Ragnarök',    'Ação',       2022, 18.00),
    ('The Last of Us Part II', 'Aventura',   2020, 15.00),
    ('Gran Turismo 7',         'Esporte',    2022, 14.00),
    ('Tears of the Kingdom',   'Aventura',   2023, 20.00),
    ('Mario Kart 8 Deluxe',    'Corrida',    2017, 10.00),
    ('Pokémon Scarlet',        'RPG',        2022, 16.00),
    ('Halo Infinite',          'Ação',       2021, 12.00),
    ('Forza Horizon 5',        'Corrida',    2021, 14.00),
    -- APÓSTROFO NO MEIO DO TEXTO: escreve-se DUAS vezes seguidas. O banco lê
    -- '' como um apóstrofo só. Escrevendo uma vez, ele entende que a string
    -- acabou ali e acusa erro de sintaxe — é o erro nº 1 da Aula 12.
    ('Baldur''s Gate 3',       'RPG',        2023, 22.00),
    ('Elden Ring',             'RPG',        2022, 18.00),
    ('Age of Empires IV',      'Estratégia', 2021, 11.00)
ON CONFLICT DO NOTHING;

-- Só três dos cinco clientes têm endereço cadastrado. É de propósito: o 1:1 é
-- OPCIONAL, e é isso que justifica a tabela separada em vez de colunas dentro
-- de cliente. Também dá material para o LEFT JOIN da Aula 14.
INSERT INTO endereco (id_cliente, logradouro, numero, bairro, cidade, uf, cep)
SELECT c.id_cliente, e.logradouro, e.numero, e.bairro, e.cidade, e.uf, e.cep
FROM (VALUES
    ('Ana Souza',     'Rua dos Andradas',  '1234', 'Centro Histórico', 'Porto Alegre', 'RS', '90020-008'),
    ('Bruno Lima',    'Av. Ipiranga',      '6681', 'Partenon',         'Porto Alegre', 'RS', '90619-900'),
    ('Carla Menezes', 'Rua Gonçalo de Carvalho', '98', 'Floresta',     'Porto Alegre', 'RS', '90035-170')
) AS e(cliente, logradouro, numero, bairro, cidade, uf, cep)
JOIN cliente c ON c.nome = e.cliente
ON CONFLICT DO NOTHING;

-- Repare que nem o jogo nem a plataforma entram pelo número: os dois são
-- procurados pelo nome. Se entrassem como 1, 2, 3, bastaria alguém cadastrar
-- uma plataforma antes de você para tudo ir parar no lugar errado — o id é do
-- banco, não do mundo. É a chave artificial da Aula 05 vista por outro ângulo.
--
-- E repare que alguns títulos aparecem DUAS vezes, em plataformas diferentes.
-- É exatamente por isso que esta ligação é N:N e virou tabela.
INSERT INTO jogos_plataforma (id_jogo, id_plataforma)
SELECT j.id_jogo, p.id_plataforma
FROM (VALUES
    ('God of War',             'PlayStation 5'),
    ('God of War',             'PC'),
    ('God of War Ragnarök',    'PlayStation 5'),
    ('God of War Ragnarök',    'PC'),
    ('The Last of Us Part II', 'PlayStation 5'),
    ('Gran Turismo 7',         'PlayStation 5'),
    ('Tears of the Kingdom',   'Nintendo Switch'),
    ('Mario Kart 8 Deluxe',    'Nintendo Switch'),
    ('Pokémon Scarlet',        'Nintendo Switch'),
    ('Halo Infinite',          'Xbox Series X'),
    ('Halo Infinite',          'PC'),
    ('Forza Horizon 5',        'Xbox Series X'),
    ('Forza Horizon 5',        'PC'),
    ('Baldur''s Gate 3',       'PC'),
    ('Elden Ring',             'PC'),
    ('Elden Ring',             'PlayStation 5'),
    ('Elden Ring',             'Xbox Series X'),
    ('Age of Empires IV',      'PC')
) AS v(jogo, plataforma)
JOIN jogo       j ON j.titulo = v.jogo
JOIN plataforma p ON p.nome   = v.plataforma
ON CONFLICT DO NOTHING;

-- Mesma ideia: o cliente é procurado pelo nome.
-- Datas em ano-mês-dia, sempre: 21/10/2026 o banco não entende, e
-- 2026-10-21 ainda ordena certo quando lido como texto.
INSERT INTO emprestimo (id_cliente, data_retirada, data_prevista, data_entregue, multa)
SELECT c.id_cliente, e.retirada, e.prevista, e.entregue, e.multa
FROM (VALUES
    ('Ana Souza',     DATE '2026-10-05', DATE '2026-10-08', DATE '2026-10-07', 0.00),
    ('Ana Souza',     DATE '2026-10-09', DATE '2026-10-12', DATE '2026-10-12', 0.00),
    ('Ana Souza',     DATE '2026-10-20', DATE '2026-10-24', NULL,              0.00),
    -- devolvido DOIS dias depois do previsto: é a linha que dá multa, e é com
    -- ela que a conta "data_entregue > data_prevista" tem o que encontrar
    ('Bruno Lima',    DATE '2026-10-06', DATE '2026-10-09', DATE '2026-10-11', 9.00),
    ('Bruno Lima',    DATE '2026-10-19', DATE '2026-10-23', NULL,              0.00),
    ('Carla Menezes', DATE '2026-10-14', DATE '2026-10-17', DATE '2026-10-16', 0.00),
    ('Carla Menezes', DATE '2026-10-22', DATE '2026-10-26', NULL,              0.00)
) AS e(cliente, retirada, prevista, entregue, multa)
JOIN cliente c ON c.nome = e.cliente
ON CONFLICT DO NOTHING;
-- Diego e Elisa não aparecem aqui: são clientes sem nenhum empréstimo. É por
-- causa deles que o LEFT JOIN da Aula 14 mostra algo que o INNER JOIN esconde.

-- Os jogos de cada empréstimo. O primeiro da Ana leva DOIS jogos: é a linha
-- que prova que o empréstimo é N:N com o jogo, e é a que explica por que a
-- tabela do crime da Aula 08 tem duas linhas com o mesmo id_emprestimo.
--
-- O preco_pago nem sempre é igual ao preco_diaria do jogo: o Mario Kart saiu
-- por 8,00 numa promoção. É o preço CONGELADO, e é o que a Aula 09 usa como
-- exemplo de desnormalização legítima.
INSERT INTO item_emprestimo (id_emprestimo, id_jogo, preco_pago)
SELECT e.id_emprestimo, j.id_jogo, v.preco
FROM (VALUES
    ('Ana Souza',     DATE '2026-10-05', 'God of War',             12.00),
    ('Ana Souza',     DATE '2026-10-05', 'Mario Kart 8 Deluxe',     8.00),
    ('Ana Souza',     DATE '2026-10-09', 'Pokémon Scarlet',        16.00),
    ('Ana Souza',     DATE '2026-10-20', 'Elden Ring',             18.00),
    ('Bruno Lima',    DATE '2026-10-06', 'The Last of Us Part II', 15.00),
    ('Bruno Lima',    DATE '2026-10-19', 'Baldur''s Gate 3',       22.00),
    ('Bruno Lima',    DATE '2026-10-19', 'Elden Ring',             18.00),
    ('Carla Menezes', DATE '2026-10-14', 'Tears of the Kingdom',   20.00),
    ('Carla Menezes', DATE '2026-10-22', 'God of War Ragnarök',    18.00)
) AS v(cliente, retirada, jogo, preco)
JOIN cliente    c ON c.nome = v.cliente
JOIN emprestimo e ON e.id_cliente = c.id_cliente AND e.data_retirada = v.retirada
JOIN jogo       j ON j.titulo = v.jogo
ON CONFLICT DO NOTHING;
-- Gran Turismo 7, Halo Infinite, Forza Horizon 5 e Age of Empires IV não saíram
-- nunca. São os jogos que só o LEFT JOIN da Aula 14 encontra.


-- ----------------------------------------------------------------------------
-- 3. Conferência
-- ----------------------------------------------------------------------------
-- Rodou certo? Estes números têm de aparecer: 4 plataformas, 5 clientes,
-- 12 jogos, 3 endereços, 18 ligações jogo-plataforma, 7 empréstimos e 9 itens.
-- E têm de continuar os mesmos se você rodar o arquivo de novo — se dobrarem,
-- alguma constraint UNIQUE não foi criada.

SELECT 'plataforma'       AS tabela, COUNT(*) AS linhas FROM plataforma
UNION ALL SELECT 'cliente',          COUNT(*) FROM cliente
UNION ALL SELECT 'jogo',             COUNT(*) FROM jogo
UNION ALL SELECT 'endereco',         COUNT(*) FROM endereco
UNION ALL SELECT 'jogos_plataforma', COUNT(*) FROM jogos_plataforma
UNION ALL SELECT 'emprestimo',       COUNT(*) FROM emprestimo
UNION ALL SELECT 'item_emprestimo',  COUNT(*) FROM item_emprestimo;
