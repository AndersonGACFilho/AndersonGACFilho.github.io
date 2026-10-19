/* demos.js — Aula 18: a UC inteira, remontada.
 *
 * Esta é a aula de fechamento, e a tentação é fazer uma página que RESUME. Um
 * resumo é o slide. O que a página pode fazer e o slide não é mostrar a
 * construção ACONTECENDO: o banco vazio ganhando uma peça por aula, e cada
 * peça aparecendo só quando a aula que a justifica chega.
 *
 * A segunda demonstração fecha o arco de verdade: a pergunta que a planilha da
 * Aula 01 não respondeu, respondida agora — com o SQL quebrado em pedaços e
 * cada pedaço etiquetado com a aula que o ensinou.
 */
(function (K) {
  'use strict';
  var $ = K.$, el = K.el, linha = K.linha, novoLog = K.novoLog, escolhas = K.escolhas;

  /* ================= 1. o banco, aula por aula ================= */

  (function () {
    var passo = $('a18-passo');
    if (!passo) return;

    var log = novoLog('a18-log');
    var atual = 0;

    // Os BLOCOS da UC, nao as 18 aulas uma a uma: dezoito passos viram uma
    // lista para rolar, e o que importa e a sequencia de decisoes.
    var ETAPAS = [
      {
        aulas: '01–02', titulo: 'Por que um banco, e não uma planilha',
        ganhou: [['o problema', 'duas pessoas, um arquivo, um sobrescreve o outro'],
                 ['o conceito', 'SGBD no meio, e os três níveis de abstração']],
        tabelas: [],
        legenda:
          'Ainda não há banco nenhum — e é de propósito. Antes de aprender a ferramenta, a turma precisou ' +
          'ver a planilha falhar. Sem esse fracasso, o SGBD seria só um programa mais complicado.',
      },
      {
        aulas: '03–05', titulo: 'O modelo no papel',
        ganhou: [['entidades', 'o que merece uma caixa'],
                 ['atributos', 'o que cada caixa guarda'],
                 ['chaves', 'o que identifica cada linha']],
        tabelas: ['cliente', 'jogo', 'plataforma'],
        legenda:
          'As três entidades que não dependem de ninguém. Repare que elas nasceram no PAPEL, antes de qualquer ' +
          'comando — e é essa ordem que a UC defende: modelar primeiro, digitar depois.',
      },
      {
        aulas: '06–07', titulo: 'Relacionamentos, e o N:N virando tabela',
        ganhou: [['cardinalidade', '1:1, 1:N e N:N'],
                 ['mapeamento', 'todo N:N vira uma TABELA no meio']],
        tabelas: ['endereco', 'jogos_plataforma', 'emprestimo', 'item_emprestimo'],
        legenda:
          'Aqui o modelo ganhou as quatro tabelas que faltavam, e duas delas só existem porque o N:N não cabe ' +
          'em duas tabelas: jogos_plataforma e item_emprestimo. São sete, e o desenho fechou.',
      },
      {
        aulas: '08–09', titulo: 'Normalização',
        ganhou: [['as anomalias', 'inclusão, exclusão, alteração'],
                 ['1FN, 2FN, 3FN', 'cada coluna na tabela a que ela pertence']],
        tabelas: [],
        legenda:
          'Nenhuma tabela nova: o que mudou foi a CONFIANÇA no desenho. A normalização não inventa tabela, ' +
          'ela prova que as que existem estão certas — e mostra o que aconteceria se não estivessem.',
      },
      {
        aulas: '10–12', titulo: 'Do papel para o banco de verdade',
        ganhou: [['DDL', 'CREATE TABLE, constraints, ALTER'],
                 ['DML', 'INSERT, UPDATE, DELETE'],
                 ['a regra dura', 'UPDATE sem WHERE muda tudo']],
        tabelas: [],
        legenda:
          'O desenho virou banco. As sete tabelas agora existem no PostgreSQL, com chave primária, chave ' +
          'estrangeira, NOT NULL e CHECK — as promessas que o papel só podia prometer.',
      },
      {
        aulas: '13–15', titulo: 'Perguntar ao banco',
        ganhou: [['SELECT, WHERE, ORDER BY', 'colunas, linhas, ordem'],
                 ['JOIN', 'remontar o que a normalização separou'],
                 ['GROUP BY, subconsulta, view', 'resumir, encadear, dar nome']],
        tabelas: [],
        legenda:
          'A parte que paga a conta da normalização. Espalhar a informação em sete tabelas só compensa porque ' +
          'o JOIN a traz de volta — e porque a view guarda a consulta para não reescrevê-la toda semana.',
      },
      {
        aulas: '16–17', titulo: 'Cuidar do que foi construído',
        ganhou: [['permissões', 'cada papel com o seu acesso'],
                 ['backup e restore', 'quanto trabalho se aceita perder']],
        tabelas: [],
        legenda:
          'As duas aulas que separam um exercício de um sistema. Um banco que ninguém protege e ninguém ' +
          'copia funciona igual — até o dia em que não funciona mais.',
      },
    ];

    var TODAS = ['cliente', 'jogo', 'plataforma', 'endereco', 'jogos_plataforma', 'emprestimo', 'item_emprestimo'];

    function desenhar() {
      var e = ETAPAS[atual];
      var au = $('a18-aula'), bc = $('a18-banco');
      au.textContent = ''; bc.textContent = '';

      au.appendChild(linha('aulas', e.aulas, 'achou'));
      e.ganhou.forEach(function (g) { au.appendChild(linha(g[0], g[1])); });

      var existentes = [];
      ETAPAS.slice(0, atual + 1).forEach(function (x) { existentes = existentes.concat(x.tabelas); });

      TODAS.forEach(function (t) {
        var tem = existentes.indexOf(t) !== -1;
        var nova = e.tabelas.indexOf(t) !== -1;
        bc.appendChild(linha(t, tem ? (nova ? 'nasceu agora' : 'já existia') : 'ainda não',
          nova ? 'entrou' : tem ? '' : 'velha'));
      });

      $('a18-selo-aula').textContent = 'etapa ' + (atual + 1) + ' de ' + ETAPAS.length;
      $('a18-selo-banco').textContent = existentes.length + ' de ' + TODAS.length + ' tabelas';
      $('a18-painel-banco').classList.toggle('bom', existentes.length === TODAS.length);
      $('a18-painel-banco').classList.toggle('ruim', existentes.length === 0);

      $('a18-legenda').textContent = e.legenda;

      log.escrever(
        ETAPAS.slice(0, atual + 1).map(function (x) {
          return {
            hora: x.aulas,
            ator: x.tabelas.length ? 'ddl' : 'banco',
            texto: x.titulo,
            resultado: x.tabelas.length ? '+' + x.tabelas.length + ' tabela(s)' : 'nenhuma tabela nova',
          };
        })
      );

      passo.disabled = atual === ETAPAS.length - 1;
      passo.textContent = atual === ETAPAS.length - 1 ? 'Chegou ao fim da UC' : 'Próxima aula';
    }

    passo.addEventListener('click', function () {
      if (atual < ETAPAS.length - 1) atual += 1;
      desenhar();
    });
    $('a18-zerar').addEventListener('click', function () { atual = 0; desenhar(); });
    desenhar();
  })();

  /* ================= 2. a pergunta do primeiro dia ================= */

  (function () {
    var caixa = $('a18-perguntas');
    if (!caixa) return;

    var log = novoLog('a18-p-log');

    var PERGUNTAS = [
      {
        id: 'atraso', nome: 'Quem está com jogo atrasado?',
        sql: "SELECT c.nome, c.telefone, j.titulo, e.data_prevista\n" +
             "  FROM emprestimo e\n" +
             "  JOIN cliente c ON c.id_cliente = e.id_cliente\n" +
             "  JOIN item_emprestimo i ON i.id_emprestimo = e.id_emprestimo\n" +
             "  JOIN jogo j ON j.id_jogo = i.id_jogo\n" +
             " WHERE e.data_entregue IS NULL\n" +
             "   AND e.data_prevista < CURRENT_DATE\n" +
             " ORDER BY e.data_prevista;",
        pecas: [
          ['JOIN de quatro tabelas', 'Aula 14'],
          ['WHERE com duas condições', 'Aula 13'],
          ['IS NULL para “ainda não devolveu”', 'Aula 13'],
          ['data_entregue separada de data_prevista', 'Aula 06'],
        ],
        planilha: 'Na planilha, a devolução era uma célula que alguém pintava de amarelo. Filtrar por "pintado de amarelo e vencido" não é uma pergunta que uma planilha responda — alguém olhava linha por linha.',
        legenda:
          'Esta é a pergunta que a locadora faz todo dia de manhã. Repare que ela precisa de QUATRO tabelas, ' +
          'e que cada JOIN existe porque a normalização separou — o preço e o ganho, no mesmo comando.',
      },
      {
        id: 'rendeu', nome: 'Qual jogo rendeu mais este mês?',
        sql: "SELECT j.titulo, count(*) AS vezes, sum(i.preco_pago) AS total\n" +
             "  FROM item_emprestimo i\n" +
             "  JOIN jogo j ON j.id_jogo = i.id_jogo\n" +
             "  JOIN emprestimo e ON e.id_emprestimo = i.id_emprestimo\n" +
             " WHERE e.data_retirada >= date_trunc('month', CURRENT_DATE)\n" +
             " GROUP BY j.titulo\n" +
             " ORDER BY total DESC;",
        pecas: [
          ['GROUP BY e as funções de resumo', 'Aula 14'],
          ['AS para dar nome ao resultado', 'Aula 13'],
          ['preco_pago guardado no item', 'Aula 08'],
          ['item_emprestimo existir', 'Aula 07'],
        ],
        planilha: 'A planilha até somava — mas o preço de cada aluguel não estava guardado: havia uma coluna de preço do jogo, que mudava quando a tabela de preços mudava. O total do mês passado mudava sozinho.',
        legenda:
          'Esta pergunta só tem resposta porque `preco_pago` mora no item do empréstimo, e não no jogo. ' +
          'Foi uma decisão da Aula 08, tomada por rastreabilidade — e é ela que faz o relatório do mês passado ' +
          'continuar certo depois de um reajuste.',
      },
      {
        id: 'nunca', nome: 'Quais clientes nunca alugaram?',
        sql: "SELECT c.nome, c.telefone\n" +
             "  FROM cliente c\n" +
             "  LEFT JOIN emprestimo e ON e.id_cliente = c.id_cliente\n" +
             " WHERE e.id_emprestimo IS NULL;",
        pecas: [
          ['LEFT JOIN, e não INNER', 'Aula 14'],
          ['IS NULL para “não teve par”', 'Aula 13'],
          ['cliente ser uma entidade própria', 'Aula 03'],
        ],
        planilha: 'Na planilha o cliente só existia dentro da linha de um aluguel. Um cliente que nunca alugou simplesmente não tinha onde ser escrito — a pergunta não era difícil, era impossível.',
        legenda:
          'A pergunta mais instrutiva das três: com INNER JOIN ela devolve zero linhas, sempre, e parece que ' +
          'todos os clientes já alugaram. É o defeito que não dá erro — dá número errado.',
      },
    ];

    escolhas('a18-perguntas', PERGUNTAS, function (p) {
      var sq = $('a18-sql'), pc = $('a18-pecas');
      sq.textContent = ''; pc.textContent = '';

      var bloco = el('div', 'linha');
      bloco.appendChild(el('code', null, p.sql));
      sq.appendChild(bloco);

      p.pecas.forEach(function (x) { pc.appendChild(linha(x[0], x[1], 'entrou')); });

      $('a18-selo-sql').textContent = p.sql.split('\n').length + ' linhas de SQL';
      $('a18-selo-pecas').textContent = p.pecas.length + ' aulas';
      $('a18-painel-sql').classList.add('bom');
      $('a18-painel-pecas').classList.add('bom');

      $('a18-p-legenda').textContent = p.legenda;

      log.comparar(
        [
          { ator: 'planilha', marca: 'ruim', linhas: [{ texto: p.planilha }] },
          { ator: 'banco', linhas: [{ texto: 'responde em um comando, e a resposta continua certa amanhã' }] },
        ],
        { texto: 'Dezoito aulas depois, a pergunta do primeiro dia cabe numa tela.' }
      );
    });
  })();
})(window.DemoKit);
