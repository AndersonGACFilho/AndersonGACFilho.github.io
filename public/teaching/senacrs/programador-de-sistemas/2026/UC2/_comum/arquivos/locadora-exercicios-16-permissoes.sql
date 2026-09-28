-- ============================================================================
-- Exercícios da Aula 16 — dar permissão, e conferir que ela pega
-- ============================================================================
--
-- Nove situações de permissão. A parte que interessa não é dar o GRANT: é
-- TESTAR que a permissão faz o que você acha que faz. Permissão que ninguém
-- testou é permissão que ninguém sabe qual é.
--
-- ANTES: rode o locadora-demo.sql.
--
-- ATENÇÃO — ESTE ARQUIVO TESTA DE UM JEITO DIFERENTE DO DA AULA.
--
-- Na Aula 16 você testa como um profissional testa: abrindo uma **segunda
-- conexão de servidor** no pgAdmin, com o usuário e a senha da role nova. O
-- slide insiste nisso porque conceder GRANT e continuar como `postgres` não
-- prova nada — o superusuário passa por cima de qualquer restrição.
--
-- Aqui, em casa e sozinho, a segunda conexão é fricção demais para um
-- exercício. Então usamos SET ROLE, que troca de role dentro da mesma janela e
-- faz o banco aplicar as permissões dela de verdade. É atalho legítimo para
-- estudar, **não é o que a prática da aula cobra**.
--
-- COMO FUNCIONA: SET ROLE faz você "virar" outra role; RESET ROLE te devolve
-- ao postgres.
--
--     SET ROLE oficina_atendente;
--     SELECT * FROM jogo;            -- passa? não passa?
--     RESET ROLE;
--
-- ESQUEÇA UM RESET ROLE e os comandos seguintes falham com "permission
-- denied" sem motivo aparente. Quando algo der errado sem explicação, RESET
-- ROLE é a primeira coisa a tentar.
--
-- AS ROLES CRIADAS AQUI COMEÇAM COM oficina_. São descartáveis, e o bloco do
-- fim do arquivo apaga todas.
--
-- ATENÇÃO, e isso não é detalhe: role NÃO pertence ao banco, pertence ao
-- SERVIDOR inteiro. A oficina_atendente criada aqui existe também em
-- qualquer outro banco desta instalação. É por isso que elas têm prefixo e
-- é por isso que há uma limpeza no fim.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 0. A bancada — as roles do exercício
-- ----------------------------------------------------------------------------
-- O PostgreSQL não tem CREATE ROLE IF NOT EXISTS. Sem esse bloco, a segunda
-- execução do arquivo pararia no erro "role already exists". O DO $$ ... $$ é
-- um trecho de código procedural, e é o único jeito de escrever "só crie se
-- não existir" para roles — não é conteúdo desta UC, é andaime.

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'oficina_atendente') THEN
        CREATE ROLE oficina_atendente WITH LOGIN PASSWORD 'troque_isto';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'oficina_estagiario') THEN
        CREATE ROLE oficina_estagiario WITH LOGIN PASSWORD 'troque_isto';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'oficina_balcao') THEN
        CREATE ROLE oficina_balcao;          -- sem LOGIN: é um grupo
    END IF;
END $$;

-- Confira que as três existem:
SELECT rolname, rolcanlogin FROM pg_roles WHERE rolname LIKE 'oficina_%' ORDER BY rolname;


-- ----------------------------------------------------------------------------
-- 1. O que você pode fazer agora
-- ----------------------------------------------------------------------------
-- Você está conectado como postgres, que é superusuário.
--
-- Meu palpite — como postgres, você conseguiria apagar a tabela emprestimo
-- inteira, com todos os dados, sem nenhum aviso?   ( ) sim   ( ) não
--
-- Não teste. Responda, e depois pense: quantas pessoas na locadora têm essa
-- senha? Essa é a aula de hoje.



-- ----------------------------------------------------------------------------
-- 2. A role recém-criada já consegue ler?
-- ----------------------------------------------------------------------------
-- A oficina_atendente existe, mas ninguém deu nada a ela ainda.
--
-- Meu palpite — o que acontece?
--   ( ) lê tudo, porque está no mesmo banco
--   ( ) lê nada
--   ( ) dá erro de permissão
--
-- Teste:
--     SET ROLE oficina_atendente;
--     SELECT * FROM jogo;
--     RESET ROLE;



-- ----------------------------------------------------------------------------
-- 3. "A atendente precisa ver o catálogo e registrar empréstimo"
-- ----------------------------------------------------------------------------
-- Ela consulta jogo, cliente e plataforma; e insere em emprestimo. Só isso.
--
-- Meu palpite — quantos comandos GRANT você vai precisar? ____
--
-- Seus comandos (escreva os que a aula mostrou; se faltar algum, o exercício
-- 4 vai mostrar qual — e essa descoberta é metade do exercício):



-- ----------------------------------------------------------------------------
-- 4. Testando o que ela NÃO pode
-- ----------------------------------------------------------------------------
--     SET ROLE oficina_atendente;
--     SELECT COUNT(*) FROM jogo;                                  -- (a)
--     INSERT INTO emprestimo (id_cliente, id_jogo, data_retirada, data_prevista)
--         VALUES (1, 1, '2026-11-03', '2026-11-06');              -- (b)
--     DELETE FROM emprestimo WHERE data_retirada = '2026-11-03';  -- (c)
--     UPDATE jogo SET preco_diaria = 1.00;                        -- (d)
--     RESET ROLE;
--
-- Meu palpite, para cada um:  (a) ____  (b) ____  (c) ____  (d) ____
--
-- Rode e confira um por um. Depois limpe, como postgres:
--     DELETE FROM emprestimo WHERE data_retirada = '2026-11-03';



-- ----------------------------------------------------------------------------
-- 5. Tirando de volta
-- ----------------------------------------------------------------------------
-- A dona repensou: registrar empréstimo vai ser só pelo sistema, não pelo
-- banco direto.
--
-- Meu palpite — que comando desfaz um GRANT? ____________
--
-- Seu comando, e depois teste de novo o INSERT do exercício 4:



-- ----------------------------------------------------------------------------
-- 6. O estagiário e a tabela que ele não pode ver
-- ----------------------------------------------------------------------------
-- Ele precisa consultar o catálogo, mas a diária é informação comercial.
-- Você já tem a v_catalogo_publico, da Aula 15 (se não criou, crie agora):
--
--     CREATE OR REPLACE VIEW v_catalogo_publico AS
--     SELECT titulo, genero, ano_lancamento FROM jogo;
--
-- Dê a ele permissão SÓ na view — nenhum GRANT na tabela jogo.
--
-- Meu palpite — com permissão na view e nenhuma na tabela, ele consegue:
--   ler a view?   ( ) sim  ( ) não
--   ler a tabela? ( ) sim  ( ) não
--
-- Seus comandos, e o teste com SET ROLE oficina_estagiario;



-- ----------------------------------------------------------------------------
-- 7. A role que é um grupo
-- ----------------------------------------------------------------------------
-- Chegam mais três atendentes. Dar cinco GRANTs para cada uma, e lembrar de
-- tirar quando alguém sair, é o caminho para a bagunça.
--
--     GRANT USAGE ON SCHEMA public TO oficina_balcao;
--     GRANT SELECT ON jogo, plataforma TO oficina_balcao;
--     GRANT oficina_balcao TO oficina_estagiario;
--
-- Meu palpite — depois disso, o estagiário passa a ler a tabela jogo?
--   ( ) sim   ( ) não
--
-- Teste. E pense: isso é o que você queria no exercício 6?



-- ----------------------------------------------------------------------------
-- 8. A tabela que nasce depois do GRANT
-- ----------------------------------------------------------------------------
-- Como postgres, crie uma tabela nova:
--
--     CREATE TABLE IF NOT EXISTS oficina_promocao (
--         id_promocao SERIAL PRIMARY KEY,
--         descricao   VARCHAR(100)
--     );
--
-- Meu palpite — a oficina_atendente, que recebeu SELECT nas tabelas do banco
-- lá no exercício 3, consegue ler esta tabela nova?   ( ) sim   ( ) não
--
-- Teste com SET ROLE. A resposta pega muita gente experiente.



-- ----------------------------------------------------------------------------
-- 9. O que a permissão NÃO protege
-- ----------------------------------------------------------------------------
-- A oficina_atendente tem SELECT em cliente — nome, telefone, email de todo
-- mundo. Ela precisa disso para trabalhar.
--
-- Meu palpite — o que impede essa pessoa de copiar a lista inteira de
-- clientes e levar embora num arquivo?
--
--   ____________________________________________________________
--
-- Responda antes de ler. É a pergunta que liga esta aula à LGPD.



-- ============================================================================
-- CONFERÊNCIA — só role até aqui depois de tentar
-- ============================================================================
--
--
-- 1) sim, sem aviso nenhum
--
--    Superusuário passa por cima de toda permissão. DROP TABLE emprestimo
--    funcionaria na hora, sem confirmação, sem lixeira e sem log detalhado.
--
--    Por isso a regra da aula: o postgres é para administrar, não para
--    trabalhar. Todo dia, cada pessoa entra com a role dela, que só faz o que
--    o trabalho dela exige. Não é desconfiança das pessoas — é que o clique
--    errado do bem-intencionado faz o mesmo estrago que o do mal-intencionado.
--
--
-- 2) erro de permissão
--
--        ERROR: permission denied for table jogo
--
--    O padrão é NÃO PODER. Role nova não herda nada: ela nasce sem acesso a
--    tabela nenhuma, e cada permissão precisa ser dada de propósito. É o
--    privilégio mínimo funcionando por padrão, e é o comportamento certo.
--
--    (Se o SELECT tivesse funcionado, seria por causa do papel PUBLIC, que em
--    versões antigas do Postgres vinha com permissão no schema public. Da 15
--    em diante, não vem mais.)
--
--
-- 3) três, como a aula mostrou — e ainda vai faltar um. Veja o exercício 4.
--
--        GRANT USAGE  ON SCHEMA public TO oficina_atendente;
--        GRANT SELECT ON jogo, cliente, plataforma TO oficina_atendente;
--        GRANT SELECT, INSERT ON emprestimo TO oficina_atendente;
--
--    Sobre o USAGE no schema: no PostgreSQL 15 em diante, o schema public já
--    vem com USAGE liberado para todo mundo, então esse primeiro comando é
--    redundante AQUI. Escreva assim mesmo, por dois motivos: em qualquer
--    outro schema ele é obrigatório, e instalações mais fechadas revogam esse
--    padrão.
--
--    Vale ver o que acontece quando ele falta de verdade. Como postgres:
--
--        REVOKE USAGE ON SCHEMA public FROM PUBLIC;
--        SET ROLE oficina_atendente;
--        SELECT COUNT(*) FROM jogo;
--        RESET ROLE;
--        GRANT USAGE ON SCHEMA public TO PUBLIC;   -- devolve o padrão
--
--    O erro não é "permission denied". É:
--
--        ERROR: relation "jogo" does not exist
--
--    Sem enxergar o schema, a role não enxerga NADA lá dentro — e o banco
--    responde que a tabela não existe. Já custou tarde de gente procurando
--    tabela apagada que estava lá o tempo todo.
--
--    (Se a role fosse se conectar de fora, faltaria ainda
--     GRANT CONNECT ON DATABASE ... — aqui não precisa, porque o SET ROLE
--     acontece dentro de uma conexão que já existe.)
--
--
-- 4) (a) passa · (b) NÃO passa · (c) NÃO passa · (d) NÃO passa
--
--    (c) e (d) são o esperado: ela recebeu SELECT e INSERT em emprestimo, não
--    DELETE; e em jogo recebeu só SELECT, então o UPDATE é recusado.
--
--        ERROR: permission denied for table emprestimo
--        ERROR: permission denied for table jogo
--
--    O (b) é a surpresa, e é o motivo de este exercício existir:
--
--        ERROR: permission denied for sequence emprestimo_id_emprestimo_seq
--
--    Você deu INSERT na tabela. Mas id_emprestimo é SERIAL, e SERIAL é uma
--    SEQUÊNCIA por trás — um objeto separado, com permissão própria. Inserir
--    sem dizer o id significa pedir o próximo número à sequência, e ela negou.
--
--    O que falta — e repare que **isto não aparece na Aula 16**: o slide
--    ensina GRANT em tabela, que é o que a matriz de permissões do projeto
--    pede. A sequência é a camada que só aparece quando o INSERT quebra.
--
--        GRANT USAGE ON SEQUENCE emprestimo_id_emprestimo_seq
--              TO oficina_atendente;
--
--    (ou, de uma vez: GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO ...)
--
--    Rode e teste o (b) de novo: agora passa.
--
--    Esse é o furo clássico do primeiro sistema que sobe com role restrita.
--    Tudo funciona no teste feito como postgres, e na hora que a aplicação
--    entra com o usuário dela o cadastro quebra — sempre no INSERT, nunca no
--    SELECT.
--
--    E repare no texto dos três erros: nenhum deles diz qual permissão falta,
--    só que faltou. Descobrir é trabalho de quem administra — é por isso que
--    a matriz de permissões da entrega de hoje vale alguma coisa: ela é a
--    documentação que a mensagem de erro não dá.
--
--
-- 5) REVOKE
--
--        REVOKE INSERT ON emprestimo FROM oficina_atendente;
--
--    Depois disso o INSERT passa a ser negado de novo — agora na tabela, e
--    não na sequência. Se você não tinha resolvido a sequência no exercício
--    4, o INSERT já estava falhando, e este REVOKE não muda nada visível:
--    vale rodar o 4 até vê-lo passar antes de tirar a permissão.
--
--    Note que REVOKE tira o que foi dado; ele não "proíbe" — e a diferença
--    aparece no exercício 7.
--
--
-- 6) lê a view, NÃO lê a tabela
--
--        GRANT USAGE  ON SCHEMA public   TO oficina_estagiario;
--        GRANT SELECT ON v_catalogo_publico TO oficina_estagiario;
--
--    A view roda com os privilégios de quem a CRIOU, não de quem a consulta.
--    Por isso ela consegue ler a tabela jogo por baixo, mesmo o estagiário
--    não podendo. Ele enxerga exatamente as três colunas da janela, e a
--    diária não existe para ele.
--
--    É a forma mais simples e mais robusta de esconder coluna no Postgres, e
--    é a que a LGPD chama de minimização: cada um vê o mínimo de que precisa.
--
--
-- 7) sim, passa a ler a tabela jogo inteira — inclusive a diária
--
--    E não, não é o que você queria no exercício 6. O estagiário virou membro
--    de um grupo que tem SELECT em jogo, e permissão de grupo SOMA com a
--    individual. Não existe "mas eu queria só a view": o banco junta tudo que
--    a pessoa tem, por qualquer caminho.
--
--    É assim que permissão vaza na vida real. Ninguém deu acesso indevido de
--    propósito: deram um grupo conveniente, seis meses depois, sem lembrar do
--    recorte combinado lá atrás. Auditar quem pode o quê é trabalho
--    periódico, não de uma vez só.
--
--
-- 8) NÃO consegue — "permission denied for table oficina_promocao"
--
--    GRANT vale para as tabelas que EXISTIAM no momento em que ele foi dado.
--    Tabela criada depois nasce sem permissão nenhuma, mesmo que você tenha
--    escrito GRANT SELECT ON ALL TABLES IN SCHEMA public.
--
--    A ferramenta para isso é — **também fora do que a Aula 16 cobra**, e
--    aqui porque é o erro que derruba o sistema na primeira migração:
--
--        ALTER DEFAULT PRIVILEGES IN SCHEMA public
--            GRANT SELECT ON TABLES TO oficina_atendente;
--
--    que diz "daqui para a frente, toda tabela nova já nasce assim". Sem
--    isso, o sistema quebra na próxima migração e ninguém entende por quê —
--    porque o GRANT "está lá", e está mesmo: só não vale para a tabela nova.
--
--
-- 9) nada, do lado do banco
--
--    Quem pode ler pode copiar. SELECT é SELECT: dá para exportar em CSV pelo
--    próprio pgAdmin, tirar print, ou simplesmente anotar.
--
--    Permissão resolve o acesso INDEVIDO — não resolve o uso indevido de um
--    acesso legítimo. Contra isso o que existe é outra camada: dar acesso só
--    a quem precisa (o que você fez hoje), dar o mínimo (a view do exercício
--    6), registrar quem acessou, e um contrato que diga o que pode ser feito
--    com o dado.
--
--    É por isso que a LGPD fala de pessoas e processos, e não só de
--    tecnologia. E é por isso que a resposta certa aqui não é técnica.
--
--    No projeto do SEU grupo: olhem a matriz de permissões de hoje e
--    perguntem, linha por linha, "essa pessoa precisa MESMO disso para
--    trabalhar?". Toda vez que a resposta for "não custa nada deixar", é
--    exatamente ali que custa.


-- ============================================================================
-- LIMPEZA — rode isto ao terminar
-- ============================================================================
-- Role não pertence ao banco, pertence ao servidor: as três continuariam
-- existindo depois que você fechar o pgAdmin, e apareceriam em qualquer outro
-- banco desta instalação.
--
-- A ordem importa: não dá para apagar uma role que ainda tem permissão em
-- alguma coisa, então primeiro se devolve tudo que foi dado.
--
-- Selecione daqui até o fim, tire os "-- " e rode:
--
-- RESET ROLE;
-- DROP OWNED BY oficina_atendente, oficina_estagiario, oficina_balcao;
-- DROP ROLE IF EXISTS oficina_atendente, oficina_estagiario, oficina_balcao;
-- DROP TABLE IF EXISTS oficina_promocao;
