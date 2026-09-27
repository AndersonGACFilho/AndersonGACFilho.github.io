-- ============================================================================
-- Exercícios da Aula 17 — o backup que você não testou não existe
-- ============================================================================
--
-- O backup em si é no pgAdmin, pelo menu — não é SQL, e o passo a passo está
-- no slide. O que este arquivo faz é o que fica de fora do menu: MEDIR o
-- banco antes, destruir de propósito, e provar depois que voltou.
--
-- "Achei que tinha voltado" não é prova. Número é.
--
-- ANTES: rode o locadora-demo.sql. Faça os exercícios na ordem — o 3 apaga
-- coisas, e o 5 só faz sentido depois do 4.
--
-- Você vai apagar dados de verdade aqui. Tudo bem: é um banco de exemplo, e
-- o exercício inteiro existe para você descobrir, com rede, o que é apagar
-- sem rede.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. O inventário — antes de qualquer coisa
-- ----------------------------------------------------------------------------
-- Você vai apagar dados daqui a pouco e depois restaurar. Como é que você vai
-- PROVAR, no fim, que voltou tudo?
--
-- Meu palpite — o que você precisa anotar agora? ____________________
--
-- Rode e ANOTE os quatro números, no papel ou aqui mesmo:
--
--     SELECT 'plataforma' AS tabela, COUNT(*) AS linhas FROM plataforma
--     UNION ALL SELECT 'cliente',    COUNT(*) FROM cliente
--     UNION ALL SELECT 'jogo',       COUNT(*) FROM jogo
--     UNION ALL SELECT 'emprestimo', COUNT(*) FROM emprestimo;
--
--   plataforma ____  cliente ____  jogo ____  emprestimo ____
--
-- Anote também o tamanho do banco, que é o que o passo 2 do slide manda
-- conferir no arquivo:
--
--     SELECT pg_size_pretty(pg_database_size(current_database())) AS tamanho;
--
--   tamanho ____________



-- ----------------------------------------------------------------------------
-- 2. Faça o backup AGORA, pelo pgAdmin
-- ----------------------------------------------------------------------------
-- Botão direito no banco → Backup… → escolha o arquivo → Backup.
--
-- Meu palpite — quanto você acha que vai dar o arquivo? ____________
--
-- Depois confira no explorador de arquivos: o arquivo existe e tem tamanho
-- maior que zero?   ( ) sim   ( ) não
--
-- Parece pergunta boba. Backup de zero byte é uma das formas mais comuns de
-- descobrir, tarde demais, que não havia backup.



-- ----------------------------------------------------------------------------
-- 3. A destruição controlada
-- ----------------------------------------------------------------------------
-- Apague todos os empréstimos:
--
--     DELETE FROM emprestimo;
--
-- Meu palpite — quantas linhas o pgAdmin vai dizer que apagou? ____
--
-- Agora tente apagar os clientes também:
--
--     DELETE FROM cliente;
--
-- Meu palpite — passa?   ( ) sim   ( ) não   — e por quê? ____________
--
-- Rode os dois e veja o que acontece com cada um.



-- ----------------------------------------------------------------------------
-- 4. Confirme que sumiu mesmo
-- ----------------------------------------------------------------------------
-- Rode o mesmo inventário do exercício 1.
--
-- Meu palpite — quais dos quatro números mudaram? ____________
--
-- Este passo parece desnecessário e não é: é ele que garante que o teste de
-- restauração testa alguma coisa. Restaurar por cima de um banco intacto não
-- prova nada.



-- ----------------------------------------------------------------------------
-- 5. Restaure, e prove
-- ----------------------------------------------------------------------------
-- Botão direito no banco → Restore… → escolha o arquivo do exercício 2.
--
-- Depois rode o inventário mais uma vez e compare com o que você anotou.
--
-- Bateu tudo?   ( ) sim   ( ) não
--
-- E agora a pergunta fina: insira um empréstimo novo e veja o id.
--
--     INSERT INTO emprestimo (id_cliente, id_jogo, data_retirada, data_prevista)
--     VALUES (1, 1, '2026-11-03', '2026-11-06') RETURNING id_emprestimo;
--
-- Meu palpite — o contador do SERIAL também voltou, ou recomeçou do 1? ____
--
-- Limpe depois:
--     DELETE FROM emprestimo WHERE data_retirada = '2026-11-03';



-- ----------------------------------------------------------------------------
-- 6. O que o backup do banco NÃO levou
-- ----------------------------------------------------------------------------
-- Se você fez os exercícios da Aula 16, criou as roles oficina_*.
--
-- Meu palpite — o backup que você acabou de restaurar trouxe as roles de
-- volta?   ( ) sim   ( ) não   ( ) elas nem chegaram a sumir
--
-- Confira:
--     SELECT rolname FROM pg_roles WHERE rolname LIKE 'oficina_%';



-- ----------------------------------------------------------------------------
-- 7. Quanto você perdeu?
-- ----------------------------------------------------------------------------
-- A locadora fecha às 22h e o backup roda todo dia às 3h da manhã. Na quinta,
-- às 19h40, o disco morre.
--
-- Meu palpite — quanto trabalho se perdeu? ____________
--
-- E quantos empréstimos, mais ou menos, isso significa numa quinta à noite?
-- Chute um número: ____
--
-- Escreva, em uma linha, o que a locadora precisaria mudar para perder menos:
--
--   ____________________________________________________________



-- ----------------------------------------------------------------------------
-- 8. A pergunta que decide se a política presta
-- ----------------------------------------------------------------------------
-- A política de backup do grupo vai dizer frequência, local e retenção.
-- Falta uma quarta coisa, e é a que quase todo mundo esquece.
--
-- Meu palpite — qual? ____________________
--
-- Dica: você acabou de fazer, nos exercícios 2 a 5.



-- ============================================================================
-- CONFERÊNCIA — só role até aqui depois de tentar
-- ============================================================================
--
--
-- 1) o inventário: 4 plataformas, 5 clientes, 12 jogos, 7 empréstimos
--
--    (Se você fez os exercícios das outras aulas, seus números podem estar
--    diferentes — e tudo bem. O que importa é ANOTAR os seus antes, porque a
--    prova da restauração é a comparação com eles.)
--
--    Contagem é a verificação mais barata que existe, e é a que quase ninguém
--    faz. "O restore rodou sem erro" não quer dizer que os dados voltaram: o
--    pg_restore pode terminar com avisos, pular objetos e devolver um banco
--    pela metade — sem nenhuma mensagem vermelha.
--
--
-- 2) algumas dezenas de KB, para este banco — aqui deu 35 KB
--
--    O tamanho importa por um motivo só: comparar com o de ontem. Backup que
--    sempre deu 40 MB e hoje deu 8 KB é um alarme — e é um alarme que só toca
--    para quem olha.
--
--
-- 3) o DELETE de emprestimo apaga 7 e passa. O de cliente é RECUSADO:
--
--        ERROR: update or delete on table "cliente" violates foreign key
--        constraint "emprestimo_id_cliente_fkey" on table "emprestimo"
--
--    Ou não — depende da ordem em que você rodou. Se os empréstimos já tinham
--    sido apagados no comando anterior, ninguém mais aponta para os clientes,
--    e o DELETE FROM cliente passa liso, levando os cinco.
--
--    É a integridade referencial protegendo por acidente: ela impede a perda
--    enquanto houver filho apontando, e para de impedir no instante em que o
--    filho sai. Ela nunca foi um mecanismo de proteção contra apagar — é
--    coerência, não segurança. O que protege contra apagar é o backup.
--
--
-- 4) emprestimo foi a zero; e cliente, dependendo da ordem, também
--
--    Rodar o inventário aqui é o passo que transforma "apaguei" em "confirmei
--    que apaguei". Sem ele, você poderia estar restaurando por cima de um
--    banco que nunca perdeu nada — e sairia da aula achando que testou o
--    backup.
--
--
-- 5) bateu tudo, e o contador do SERIAL TAMBÉM voltou
--
--    O arquivo de backup não guarda só as linhas: guarda o estado das
--    sequências, com um comando setval no fim. Por isso o próximo id continua
--    de onde estava, e não do 1.
--
--    Isso é mais importante do que parece: se o contador voltasse ao 1, o
--    banco tentaria reusar ids que já existiram — e você teria colisão de
--    chave primária logo no primeiro insert depois do restore.
--
--
-- 6) elas nem chegaram a sumir — e o backup também não as teria trazido
--
--    Role é objeto do SERVIDOR, não do banco. O backup de um banco leva
--    tabelas, dados, views, sequências e permissões CONCEDIDAS — mas não leva
--    as roles em si, nem as senhas delas.
--
--    Na prática: restaurar o banco numa máquina nova, sem as roles criadas
--    lá, dá um monte de erro de "role does not exist", e o sistema não sobe.
--    Quem faz backup de servidor inteiro usa outra ferramenta (pg_dumpall)
--    justamente por causa disso.
--
--    É o tipo de detalhe que só aparece no dia da emergência — a menos que
--    alguém tenha testado antes.
--
--
-- 7) até 16h40 de trabalho, de 3h da manhã até 19h40
--
--    Isso tem nome: RPO, o quanto de dado você aceita perder. A locadora
--    escolheu 24 horas quando escolheu backup diário — provavelmente sem
--    perceber que estava escolhendo isso.
--
--    Para perder menos: rodar também um backup no fechamento, às 22h; ou
--    mudar para de hora em hora. Não é decisão técnica, é de negócio: quanto
--    custa uma quinta-feira de lançamentos refeitos à mão contra quanto custa
--    guardar mais backup.
--
--    Repare que a pergunta nem tocou em "quanto tempo para voltar ao ar",
--    que é a outra metade (o RTO). Restaurar um banco grande leva horas, e
--    nesse tempo a locadora está parada.
--
--
-- 8) TESTE — de quando em quando, restaurar de verdade
--
--    Frequência, local e retenção descrevem como o backup é feito. Nenhuma
--    delas diz se ele PRESTA.
--
--    Backup nunca restaurado é uma promessa, não um seguro. Os modos de falhar
--    são silenciosos: arquivo truncado, disco cheio no meio, permissão negada
--    numa pasta, senha esquecida, e o clássico — o backup roda todo dia há
--    dois anos, sobre um banco que mudou de nome há dezoito meses.
--
--    Uma política decente tem a data do último teste de restauração escrita
--    nela. Se essa data não existe, o número de backups não importa.
--
--    No projeto do SEU grupo: ponham na política de hoje uma linha dizendo
--    com que frequência o restore é testado, e onde fica registrada a data do
--    último teste. É a linha que separa um documento de um plano.
