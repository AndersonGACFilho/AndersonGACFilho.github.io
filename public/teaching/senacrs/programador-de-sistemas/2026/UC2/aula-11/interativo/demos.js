/* demos.js — Aula 11: constraints e ON DELETE.
 *
 * Uma constraint é uma promessa que o banco cobra, e promessa só se conhece
 * quando ela é cobrada. As duas demonstrações existem para isso: na primeira
 * o aluno manda a linha errada e LÊ a recusa; na segunda ele vê as três
 * políticas de ON DELETE fazerem três coisas diferentes com as mesmas linhas.
 *
 * As mensagens de erro são as do PostgreSQL, palavra por palavra. Não é
 * capricho: é a mensagem que vai aparecer no laboratório, e reconhecê-la é
 * metade do conserto.
 */
(function (K) {
  'use strict';
  var $ = K.$, el = K.el, linha = K.linha, novoLog = K.novoLog, escolhas = K.escolhas;

  /* ================= 1. a constraint recusando ================= */

  (function () {
    var caixa = $('a11-linhas');
    if (!caixa) return;

    var log = novoLog('a11-log');

    // As quatro constraints da tabela, na ordem em que o banco as cobra. Cada
    // tentativa quebra UMA, para a leitura da mensagem ficar sem ruido.
    var CONSTRAINTS = [
      { id: 'pk', nome: 'PRIMARY KEY (id_emprestimo)' },
      { id: 'nn', nome: 'NOT NULL (data_retirada)' },
      { id: 'fk', nome: 'FOREIGN KEY (id_cliente) REFERENCES cliente' },
      { id: 'ck', nome: 'CHECK (data_prevista >= data_retirada)' },
    ];

    var JA_EXISTE = [
      { id: 1, cli: 'Ana Souza (1)', ret: '02/10', prev: '09/10' },
      { id: 2, cli: 'Bruno Lima (2)', ret: '02/10', prev: '09/10' },
    ];

    var TENTATIVAS = [
      {
        id: 'ok', nome: 'linha correta',
        sql: "INSERT INTO emprestimo\n  (id_emprestimo, id_cliente, data_retirada, data_prevista)\nVALUES (3, 1, '2026-10-19', '2026-10-26');",
        quebra: null,
        resposta: 'INSERT 0 1',
        legenda:
          'Nenhuma constraint foi violada, então a linha entra. Repare que as quatro foram conferidas mesmo assim — ' +
          'a constraint trabalha em toda inserção, não só quando dá erro.',
      },
      {
        id: 'pk', nome: 'id_emprestimo repetido (2)',
        sql: "INSERT INTO emprestimo\n  (id_emprestimo, id_cliente, data_retirada, data_prevista)\nVALUES (2, 1, '2026-10-19', '2026-10-26');",
        quebra: 'pk',
        resposta: 'ERROR:  duplicate key value violates unique constraint "emprestimo_pkey"\nDETAIL:  Key (id_emprestimo)=(2) already exists.',
        legenda:
          'A chave primária é duas promessas num comando só: não repete e não é nula. Aqui a que caiu foi a primeira, ' +
          'e a mensagem diz exatamente qual valor já existia.',
      },
      {
        id: 'nn', nome: 'sem data_retirada',
        sql: "INSERT INTO emprestimo\n  (id_emprestimo, id_cliente, data_prevista)\nVALUES (3, 1, '2026-10-26');",
        quebra: 'nn',
        resposta: 'ERROR:  null value in column "data_retirada" of relation "emprestimo" violates not-null constraint',
        legenda:
          'Não informar a coluna é o mesmo que informar NULL. É o erro mais comum de quem monta o INSERT escolhendo ' +
          'as colunas: esquecer uma obrigatória não dá aviso na hora de escrever, dá erro na hora de rodar.',
      },
      {
        id: 'fk', nome: 'id_cliente = 99, que não existe',
        sql: "INSERT INTO emprestimo\n  (id_emprestimo, id_cliente, data_retirada, data_prevista)\nVALUES (3, 99, '2026-10-19', '2026-10-26');",
        quebra: 'fk',
        resposta: 'ERROR:  insert or update on table "emprestimo" violates foreign key constraint "emprestimo_cliente_fk"\nDETAIL:  Key (id_cliente)=(99) is not present in table "cliente".',
        legenda:
          'Esta é a integridade referencial fazendo o trabalho dela: o empréstimo apontaria para um cliente que não ' +
          'existe, e o banco recusa. Sem a FK a linha entraria, e o defeito só apareceria meses depois, num relatório.',
      },
      {
        id: 'ck', nome: 'devolução antes da retirada',
        sql: "INSERT INTO emprestimo\n  (id_emprestimo, id_cliente, data_retirada, data_prevista)\nVALUES (3, 1, '2026-10-19', '2026-10-12');",
        quebra: 'ck',
        resposta: 'ERROR:  new row for relation "emprestimo" violates check constraint "emprestimo_datas_ck"',
        legenda:
          'O CHECK é a regra do NEGÓCIO escrita no banco: devolver antes de retirar não existe na locadora. ' +
          'Escrita aqui, ela vale para todo programa que usar este banco — inclusive o que ainda não foi escrito.',
      },
    ];

    escolhas('a11-linhas', TENTATIVAS, function (t) {
      var lista = $('a11-testes');
      lista.textContent = '';

      // A ordem importa na leitura: o banco para na PRIMEIRA que falha, e as
      // seguintes nem chegam a rodar. Mostrar isso evita a conclusao errada de
      // que a linha passou nas outras.
      var jaFalhou = false;
      CONSTRAINTS.forEach(function (c) {
        var estado;
        if (jaFalhou) estado = 'nem-rodou';
        else if (t.quebra === c.id) { estado = 'falhou'; jaFalhou = true; }
        else estado = 'passou';

        var li = el('li', 'teste ' + estado);
        li.appendChild(el('span', 'sinal', estado === 'passou' ? '✓' : estado === 'falhou' ? '✕' : '–'));
        li.appendChild(el('span', 'pergunta-teste', c.nome));
        li.appendChild(el('span', 'resposta',
          estado === 'passou' ? 'ok' : estado === 'falhou' ? 'recusou' : 'nem chegou a rodar'));
        lista.appendChild(li);
      });

      var tab = $('a11-tabela');
      tab.textContent = '';
      JA_EXISTE.forEach(function (l) { tab.appendChild(linha('#' + l.id + ' · ' + l.cli, l.ret + ' → ' + l.prev)); });
      if (!t.quebra) {
        tab.appendChild(linha('#3 · Ana Souza (1)', '19/10 → 26/10', 'entrou'));
      } else {
        tab.appendChild(linha('#3 — não entrou', 'recusado', 'sumiu'));
      }

      $('a11-selo-testes').textContent = t.quebra ? 'recusou na ' + t.quebra.toUpperCase() : 'passou nas quatro';
      $('a11-selo-tabela').textContent = (t.quebra ? JA_EXISTE.length : JA_EXISTE.length + 1) + ' linhas';
      $('a11-painel-testes').classList.toggle('ruim', !!t.quebra);
      $('a11-painel-testes').classList.toggle('bom', !t.quebra);
      $('a11-painel-tabela').classList.toggle('bom', !t.quebra);
      $('a11-painel-tabela').classList.toggle('ruim', !!t.quebra);

      $('a11-legenda').textContent = t.legenda;

      log.comparar(
        [
          { ator: 'ddl', linhas: [{ sql: true, texto: t.sql }] },
          { ator: 'banco', marca: t.quebra ? 'ruim' : '',
            linhas: [{ sql: true, texto: t.resposta }] },
        ],
        t.quebra
          ? { texto: 'A linha não entrou, e o banco disse por quê. Constraint não avisa: ela recusa.', marca: 'ruim' }
          : { texto: 'Entrou. As quatro promessas continuam de pé depois desta linha.' }
      );
    });
  })();

  /* ================= 2. ON DELETE, os três desfechos ================= */

  (function () {
    var caixa = $('a11-modos');
    if (!caixa) return;

    var log = novoLog('a11-del-log');

    var MODOS = [
      {
        id: 'restrict', nome: 'ON DELETE RESTRICT (o padrão)',
        legenda:
          'O banco recusa apagar a Ana enquanto ela tiver empréstimos. Nada se perde, e quem mandou o comando ' +
          'precisa decidir o que fazer com os empréstimos primeiro. É o padrão, e é o que o curso usa.',
        resposta: 'ERROR:  update or delete on table "cliente" violates foreign key constraint\nDETAIL:  Key (id_cliente)=(1) is still referenced from table "emprestimo".',
      },
      {
        id: 'cascade', nome: 'ON DELETE CASCADE',
        legenda:
          'A Ana some, e os dois empréstimos dela somem junto — sem pergunta e sem aviso. Um DELETE distraído ' +
          'numa tabela pai pode levar meio banco. É poderoso, e é por isso que é perigoso.',
        resposta: 'DELETE 1  (e 2 linhas em emprestimo, em cascata)',
      },
      {
        id: 'setnull', nome: 'ON DELETE SET NULL',
        legenda:
          'A Ana some e os empréstimos ficam — sem dono. As linhas continuam lá, e agora ninguém sabe de quem ' +
          'elas eram. É o pior dos três para a locadora: guarda o fato e joga fora o sentido dele.',
        resposta: 'DELETE 1  (e 2 linhas com id_cliente = NULL)',
      },
    ];

    var modo = MODOS[0];
    var executado = false;

    function desenhar() {
      var cli = $('a11-cliente'), emp = $('a11-emp');
      cli.textContent = ''; emp.textContent = '';

      var anaSumiu = executado && modo.id !== 'restrict';

      cli.appendChild(linha('1 · Ana Souza', anaSumiu ? 'apagada' : '(11) 98888-2222', anaSumiu ? 'sumiu' : ''));
      cli.appendChild(linha('2 · Bruno Lima', '(11) 97777-2222'));
      cli.appendChild(linha('3 · Diego Rocha', '(11) 96666-3333'));

      [
        { id: 1, dono: 1, data: '02/10' },
        { id: 3, dono: 1, data: '09/10' },
        { id: 2, dono: 2, data: '02/10' },
      ].forEach(function (e) {
        var meu = e.dono === 1;
        var valor, classe = '';
        if (!executado || !meu) {
          valor = 'cliente ' + e.dono;
        } else if (modo.id === 'cascade') {
          valor = 'apagado junto'; classe = 'sumiu';
        } else if (modo.id === 'setnull') {
          valor = 'cliente NULL — sem dono'; classe = 'velha';
        } else {
          valor = 'cliente 1';
        }
        emp.appendChild(linha('#' + e.id + ' · ' + e.data, valor, classe));
      });

      var sobraram = executado && modo.id === 'cascade' ? 1 : 3;
      $('a11-selo-cliente').textContent = anaSumiu ? '2 clientes' : '3 clientes';
      $('a11-selo-emp').textContent = sobraram + (sobraram === 1 ? ' empréstimo' : ' empréstimos');
      $('a11-painel-emp').classList.toggle('ruim', executado && modo.id !== 'restrict');
      $('a11-painel-emp').classList.toggle('bom', executado && modo.id === 'restrict');
      $('a11-painel-cliente').classList.toggle('ruim', anaSumiu);
      $('a11-painel-cliente').classList.toggle('bom', executado && modo.id === 'restrict');

      $('a11-del-legenda').textContent = executado
        ? modo.legenda
        : 'Três empréstimos, dois deles da Ana. Escolha a política e execute o DELETE.';

      log.escrever(
        executado
          ? [
              { hora: '1', ator: 'voce', sql: true, texto: 'DELETE FROM cliente WHERE id_cliente = 1;' },
              { hora: '2', ator: 'banco', marca: modo.id === 'restrict' ? '' : 'ruim',
                texto: modo.resposta, resultado: modo.id === 'restrict' ? 'nada mudou' : 'mudou em cascata' },
            ]
          : [],
        'O DELETE ainda não foi executado.'
      );
    }

    escolhas('a11-modos', MODOS, function (m) { modo = m; executado = false; desenhar(); });
    $('a11-apagar').addEventListener('click', function () { executado = true; desenhar(); });
    $('a11-zerar').addEventListener('click', function () { executado = false; desenhar(); });
    desenhar();
  })();
})(window.DemoKit);
