-- ============================================================================
-- Exercícios da Aula 10 — criando tabelas, e vendo o banco recusar
-- ============================================================================
--
-- Oito situações em que a locadora precisa de uma tabela nova, e você escreve
-- o comando. Nenhuma vem pronta.
--
-- ANTES: rode o locadora-demo.sql, para ter um banco com o que comparar.
--
-- COMO USAR, no Query Tool do pgAdmin:
--
--   1. leia a situação
--   2. escreva o palpite — escreva mesmo, no arquivo, que é seu
--   3. escreva o comando, selecione só ele com o mouse e aperte F5
--      (sem selecionar nada, o pgAdmin roda o arquivo inteiro)
--   4. compare com o palpite
--   5. só depois, role até a CONFERÊNCIA
--
-- METADE DESTES EXERCÍCIOS É PARA DAR ERRO. É de propósito: mensagem de erro
-- do Postgres é texto em inglês, feio e assustador na primeira vez, e a única
-- forma de deixar de ter medo dela é ler umas quinze com calma. Quando der
-- erro, LEIA a mensagem antes de mexer no comando.
--
-- AS TABELAS QUE VOCÊ CRIAR AQUI COMEÇAM COM oficina_. É a sua bancada: pode
-- quebrar à vontade, que a locadora (plataforma, cliente, jogo, emprestimo)
-- não é tocada.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. "A gente precisa cadastrar quem trabalha aqui"
-- ----------------------------------------------------------------------------
-- A dona quer guardar de cada funcionário: nome, cargo, data de admissão e
-- salário. E um identificador, claro.
--
-- Meu palpite — que tipo você vai dar para cada um?
--   nome ____________  cargo ____________
--   data de admissão ____________  salário ____________
--
-- Seu comando (chame a tabela de oficina_funcionario):



-- ----------------------------------------------------------------------------
-- 2. "Põe o telefone e o CEP também"
-- ----------------------------------------------------------------------------
-- Telefone: (51) 99931-1042. CEP: 90035-190. Os dois são números, certo?
--
-- Meu palpite — que tipo para cada um, e por quê? ____________________
--
-- Seu comando (acrescente as duas colunas à tabela que você acabou de criar —
-- não precisa refazer a tabela; existe comando para isso, e ele apareceu na
-- aula):



-- ----------------------------------------------------------------------------
-- 3. Rode o mesmo CREATE TABLE de novo
-- ----------------------------------------------------------------------------
-- Volte no exercício 1, selecione o comando inteiro e rode outra vez.
--
-- Meu palpite — o que acontece?
--   ( ) cria de novo, por cima     ( ) não faz nada
--   ( ) dá erro                    ( ) apaga a de antes
--
-- Rode e leia a mensagem inteira, incluindo a palavra depois de ERROR.



-- ----------------------------------------------------------------------------
-- 4. "E se eu quiser rodar meu arquivo várias vezes sem esse erro?"
-- ----------------------------------------------------------------------------
-- É exatamente o que o locadora-demo.sql faz — abra ele e procure na primeira
-- linha de cada CREATE TABLE o que tem lá que o seu não tem.
--
-- Meu palpite — o que muda no comportamento? ____________________
--
-- Seu comando (recrie a oficina_funcionario com esse pedaço a mais, e rode
-- duas vezes seguidas para conferir):



-- ----------------------------------------------------------------------------
-- 5. "Esse VARCHAR(20) tá bom?"
-- ----------------------------------------------------------------------------
-- Crie uma tabela de teste com uma coluna curta e tente guardar algo maior:
--
--     CREATE TABLE IF NOT EXISTS oficina_aperto (
--         id     SERIAL PRIMARY KEY,
--         titulo VARCHAR(20)
--     );
--
--     INSERT INTO oficina_aperto (titulo)
--     VALUES ('The Legend of Zelda: Tears of the Kingdom');
--
-- Meu palpite — o que o banco faz?
--   ( ) guarda cortado nos 20    ( ) guarda inteiro e aumenta a coluna
--   ( ) recusa                   ( ) guarda e avisa
--
-- Rode e leia a mensagem.



-- ----------------------------------------------------------------------------
-- 6. "Quem escolhe o número do id?"
-- ----------------------------------------------------------------------------
-- Insira um funcionário SEM dizer o id:
--
--     INSERT INTO oficina_funcionario (nome, cargo)
--     VALUES ('Ana Souza', 'atendente');
--
-- Meu palpite — que id essa linha vai receber? ____
-- E se eu apagar essa linha e inserir outra, o próximo id volta a ser 1? ____
--
-- Rode, confira com SELECT, apague com DELETE e insira de novo.



-- ----------------------------------------------------------------------------
-- 7. Qual destes é DDL?
-- ----------------------------------------------------------------------------
-- Marque antes de rodar qualquer coisa:
--
--   CREATE TABLE ...    ( ) DDL  ( ) DML
--   INSERT INTO ...     ( ) DDL  ( ) DML
--   ALTER TABLE ...     ( ) DDL  ( ) DML
--   SELECT ...          ( ) DDL  ( ) DML
--   DROP TABLE ...      ( ) DDL  ( ) DML
--
-- Não é decoreba: a diferença muda o que você pode desfazer, e aparece de
-- novo na Aula 16, quando for dar permissão para alguém.



-- ----------------------------------------------------------------------------
-- 8. A pergunta sem resposta certa
-- ----------------------------------------------------------------------------
-- Você vai criar a coluna do nome do funcionário. VARCHAR(quanto)?
--
-- Meu palpite: ____
--
-- Não existe número certo, e é por isso que a pergunta está aqui. Escreva sua
-- justificativa em uma linha, e depois leia a da conferência:
--
--   ____________________________________________________________



-- ============================================================================
-- CONFERÊNCIA — só role até aqui depois de tentar
-- ============================================================================
--
--
-- 1) uma resposta possível, e o que importa é o raciocínio:
--
--        CREATE TABLE IF NOT EXISTS oficina_funcionario (
--            id_funcionario SERIAL        PRIMARY KEY,
--            nome           VARCHAR(100)  NOT NULL,
--            cargo          VARCHAR(50),
--            data_admissao  DATE,
--            salario        NUMERIC(10,2)
--        );
--
--    Salário é NUMERIC, nunca FLOAT: número com vírgula em FLOAT é
--    aproximado, e 0,1 + 0,2 não dá exatamente 0,3. Em dinheiro isso vira
--    centavo faltando no fechamento do mês. NUMERIC(10,2) é exato — dez
--    dígitos no total, dois depois da vírgula.
--
--    Data é DATE, não VARCHAR. Guardada como texto, '10/03/2026' e
--    '2026-03-10' convivem na mesma coluna, ninguém consegue ordenar, e
--    "quem entrou nos últimos 30 dias" fica impossível.
--
--
-- 2) os dois são texto — VARCHAR
--
--        ALTER TABLE oficina_funcionario ADD COLUMN telefone VARCHAR(20);
--        ALTER TABLE oficina_funcionario ADD COLUMN cep      VARCHAR(9);
--
--    A pergunta que decide o tipo não é "parece número?", é "eu faço conta
--    com isso?". Ninguém soma telefone nem tira média de CEP. E os dois têm
--    traço, parêntese e zero à esquerda — como número, o 09 vira 9 e o CEP
--    perde o formato.
--
--    Repare também que não foi preciso refazer a tabela. ALTER TABLE é o que
--    salva quando você percebe no meio do caminho que faltou uma coluna: sem
--    ele, a saída seria apagar e recriar, levando junto tudo que já estava
--    dentro.
--
--
-- 3) dá erro: ERROR: relation "oficina_funcionario" already exists
--
--    "relation" é como o Postgres chama a tabela — vem da teoria relacional
--    da Aula 01, não é palavra aleatória. O banco recusa e NÃO apaga o que
--    havia: essa recusa é proteção, não implicância.
--
--
-- 4) IF NOT EXISTS — "crie, a não ser que já exista"
--
--        CREATE TABLE IF NOT EXISTS oficina_funcionario ( ... );
--
--    Rodando de novo, o banco não cria nada e não reclama; devolve só um
--    aviso (NOTICE). É o que deixa um arquivo .sql ser executado várias
--    vezes — e é por isso que os scripts desta UC são todos assim.
--
--    Cuidado com o que ele NÃO faz: se a tabela já existe com as colunas
--    erradas, o IF NOT EXISTS não conserta nada, ele pula. Para mudar uma
--    tabela que já existe, é ALTER TABLE.
--
--
-- 5) recusa: ERROR: value too long for type character varying(20)
--
--    Não corta, não aumenta, não aceita. O VARCHAR(n) é uma promessa que o
--    banco cobra — e é por isso que o n merece ser pensado.
--
--
-- 6) recebe 1 (se a tabela estava vazia). E o próximo NÃO volta a ser 1:
--    apagando a linha 1 e inserindo outra, vem 2.
--
--    O SERIAL guarda um contador por fora da tabela, que só anda para frente.
--    Buraco na numeração é normal e não é defeito: o id serve para
--    identificar, não para contar. Se você precisa saber quantos, é
--    COUNT(*) — nunca o último id.
--
--
-- 7) DDL: CREATE TABLE, ALTER TABLE, DROP TABLE — mexem na ESTRUTURA
--    DML: INSERT, SELECT — mexem no CONTEÚDO
--
--    (SELECT é o caso que gera discussão: alguns livros o separam num terceiro
--    grupo, DQL. Para esta UC, o que importa é que ele não muda a estrutura.)
--
--
-- 8) não existe número certo, e a justificativa é o exercício
--
--    Um raciocínio defensável: VARCHAR(100) porque nome completo brasileiro
--    passa fácil de 40 caracteres e raramente chega a 100.
--
--    O que NÃO é defensável é VARCHAR(255) em tudo. Esse 255 é herança de um
--    limite técnico de bancos antigos que o Postgres não tem, e usar em toda
--    coluna é o mesmo que não escolher. O n serve para documentar o que você
--    espera: quando alguém lê VARCHAR(2) em uma coluna "uf", aprende uma
--    regra do negócio na hora.
--
--    No projeto do SEU grupo: passe o olho no dicionário de dados da Aula 04
--    e veja quantos VARCHAR estão com tamanho chutado. Cada um desses é uma
--    decisão que ninguém tomou.
