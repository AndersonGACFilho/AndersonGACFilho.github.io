/* demos.js — Aula 14: JOIN por dentro, INNER contra LEFT, e GROUP BY.
 *
 * Três blocos no deck, três demonstrações — e as três mostram a mesma coisa
 * por ângulos diferentes: o que acontece com as LINHAS. O JOIN multiplica, o
 * INNER descarta, o GROUP BY dobra. Quem entende isso para de decorar sintaxe.
 *
 * A Carla existe só para a demonstração 2: uma cliente sem nenhum empréstimo.
 * Sem alguém assim, INNER e LEFT devolvem a mesma coisa e a diferença entre os
 * dois vira palavra.
 */
(function (K) {
  'use strict';
  var $ = K.$, el = K.el, linha = K.linha, novoLog = K.novoLog, escolhas = K.escolhas;

  var CLIENTES = [
    { id: 1, nome: 'Ana Souza' },
    { id: 2, nome: 'Bruno Lima' },
    { id: 3, nome: 'Diego Rocha' },
    { id: 4, nome: 'Carla Dias' },
  ];
  var EMPRESTIMOS = [
    { id: 1, cli: 1, data: '02/10' },
    { id: 2, cli: 2, data: '02/10' },
    { id: 3, cli: 1, data: '09/10' },
    { id: 4, cli: 3, data: '12/10' },
  ];

  /* ================= 1. o JOIN por dentro ================= */

  (function () {
    var passo = $('a14-passo');
    if (!passo) return;

    var log = novoLog('a14-log');
    var feitos = 0;

    function desenhar() {
      var esq = $('a14-esq'), dir = $('a14-dir'), res = $('a14-res');
      esq.textContent = ''; dir.textContent = ''; res.textContent = '';

      var atual = feitos < EMPRESTIMOS.length ? EMPRESTIMOS[feitos] : null;

      EMPRESTIMOS.forEach(function (e, i) {
        esq.appendChild(linha(
          '#' + e.id + ' · ' + e.data,
          'id_cliente ' + e.cli,
          i === feitos ? 'achou' : i < feitos ? 'entrou' : ''
        ));
      });

      CLIENTES.forEach(function (c) {
        var procurado = atual && atual.cli === c.id;
        dir.appendChild(linha(c.id + ' · ' + c.nome, procurado ? 'é esta' : '', procurado ? 'achou' : ''));
      });

      EMPRESTIMOS.slice(0, feitos).forEach(function (e) {
        var c = CLIENTES.filter(function (x) { return x.id === e.cli; })[0];
        res.appendChild(linha('#' + e.id + ' · ' + e.data, c.nome, 'entrou'));
      });
      if (!feitos) res.appendChild(linha('vazio', 'nenhuma linha pareada ainda', 'velha'));

      $('a14-selo-esq').textContent = EMPRESTIMOS.length + ' linhas';
      $('a14-selo-dir').textContent = CLIENTES.length + ' linhas';
      $('a14-selo-res').textContent = feitos + ' de ' + EMPRESTIMOS.length;
      $('a14-painel-res').classList.toggle('bom', feitos === EMPRESTIMOS.length);

      $('a14-legenda').textContent = atual
        ? 'Linha #' + atual.id + ': o banco lê id_cliente = ' + atual.cli +
          ' e procura essa linha em cliente. Achou, então as duas viram UMA linha no resultado.'
        : 'As quatro foram pareadas. Repare que o resultado tem quatro linhas, não dezesseis: o JOIN não ' +
          'combina todo mundo com todo mundo — a condição ON é o que decide quais pares existem.';

      log.escrever(
        EMPRESTIMOS.slice(0, feitos).map(function (e) {
          var c = CLIENTES.filter(function (x) { return x.id === e.cli; })[0];
          return {
            hora: 'linha ' + e.id,
            ator: 'banco',
            texto: 'procurar cliente com id_cliente = ' + e.cli,
            resultado: c.nome,
          };
        }),
        'Nenhum par formado ainda.'
      );

      passo.disabled = feitos === EMPRESTIMOS.length;
      passo.textContent = feitos === EMPRESTIMOS.length ? 'Pareadas as quatro' : 'Parear a próxima linha';
    }

    passo.addEventListener('click', function () {
      if (feitos < EMPRESTIMOS.length) feitos += 1;
      desenhar();
    });
    $('a14-zerar').addEventListener('click', function () { feitos = 0; desenhar(); });
    desenhar();
  })();

  /* ================= 2. INNER contra LEFT ================= */

  (function () {
    var caixa = $('a14-tipos');
    if (!caixa) return;

    var log = novoLog('a14-lr-log');

    var TIPOS = [
      {
        id: 'inner', nome: 'INNER JOIN',
        sql: 'SELECT c.nome, count(e.id_emprestimo)\n  FROM cliente c\n INNER JOIN emprestimo e ON e.id_cliente = c.id_cliente\n GROUP BY c.nome;',
        legenda:
          'A Carla sumiu. Ela é cliente, e a pergunta era "quantos empréstimos cada cliente fez" — a resposta ' +
          'dela seria zero. O INNER só devolve quem tem PAR dos dois lados, então quem fez zero não aparece. ' +
          'Nenhum erro, nenhum aviso: vieram três linhas em vez de quatro.',
      },
      {
        id: 'left', nome: 'LEFT JOIN',
        sql: 'SELECT c.nome, count(e.id_emprestimo)\n  FROM cliente c\n  LEFT JOIN emprestimo e ON e.id_cliente = c.id_cliente\n GROUP BY c.nome;',
        legenda:
          'Agora a Carla aparece com 0. O LEFT mantém TODOS os da esquerda e preenche com NULL quem não tem par. ' +
          'Repare que é `count(e.id_emprestimo)` e não `count(*)`: o count(*) contaria a linha de NULL e diria 1.',
      },
    ];

    escolhas('a14-tipos', TIPOS, function (t) {
      var saida = $('a14-saida'), fora = $('a14-fora');
      saida.textContent = ''; fora.textContent = '';

      var deFora = [];
      CLIENTES.forEach(function (c) {
        var n = EMPRESTIMOS.filter(function (e) { return e.cli === c.id; }).length;
        if (n === 0 && t.id === 'inner') { deFora.push(c.nome); return; }
        saida.appendChild(linha(c.nome, n + (n === 1 ? ' empréstimo' : ' empréstimos'), n ? '' : 'velha'));
      });

      if (deFora.length) {
        deFora.forEach(function (n) { fora.appendChild(linha(n, 'é cliente, e não veio', 'sumiu')); });
      } else {
        fora.appendChild(linha('ninguém', 'os quatro clientes vieram', 'entrou'));
      }

      $('a14-selo-saida').textContent = (CLIENTES.length - deFora.length) + ' de ' + CLIENTES.length + ' clientes';
      $('a14-selo-fora').textContent = deFora.length ? deFora.length + ' sumiu' : 'nenhum';
      $('a14-painel-saida').classList.toggle('ruim', deFora.length > 0);
      $('a14-painel-saida').classList.toggle('bom', deFora.length === 0);
      $('a14-painel-fora').classList.toggle('ruim', deFora.length > 0);

      $('a14-lr-legenda').textContent = t.legenda;

      log.comparar(
        [
          { ator: 'voce', linhas: [{ sql: true, texto: t.sql }] },
          { ator: 'banco', marca: deFora.length ? 'ruim' : '',
            linhas: [{ texto: (CLIENTES.length - deFora.length) + ' linhas',
              resultado: deFora.length ? 'faltou ' + deFora.join(', ') : 'os quatro' }] },
        ],
        deFora.length
          ? { texto: 'Relatório de clientes que não lista um cliente. O defeito não aparece: aparece o número errado.', marca: 'ruim' }
          : { texto: 'Quando a pergunta é sobre TODOS de um lado, o JOIN é LEFT.' }
      );
    });
  })();

  /* ================= 3. GROUP BY ================= */

  (function () {
    var caixa = $('a14-grupos');
    if (!caixa) return;

    var log = novoLog('a14-gb-log');

    // Itens de emprestimo: e aqui que a agregacao faz sentido na locadora,
    // porque cada emprestimo tem varios jogos e cada um com o seu preco.
    var ITENS = [
      { emp: 1, cli: 'Ana Souza', jogo: 'God of War', preco: 12 },
      { emp: 1, cli: 'Ana Souza', jogo: 'FIFA 25', preco: 10 },
      { emp: 2, cli: 'Bruno Lima', jogo: 'Zelda TotK', preco: 14 },
      { emp: 3, cli: 'Ana Souza', jogo: 'God of War', preco: 9 },
      { emp: 3, cli: 'Ana Souza', jogo: 'Elden Ring', preco: 13 },
      { emp: 4, cli: 'Diego Rocha', jogo: 'FIFA 25', preco: 8 },
      { emp: 4, cli: 'Diego Rocha', jogo: 'Hollow Knight', preco: 6 },
    ];
    var real = function (v) { return 'R$ ' + v.toFixed(2).replace('.', ','); };

    var CHAVES = [
      { id: 'cli', nome: 'por cliente', campo: 'cli', coluna: 'c.nome',
        legenda: 'Três grupos, porque três clientes aparecem nos itens. A Ana comeu quatro linhas de detalhe e virou uma só.' },
      { id: 'emp', nome: 'por empréstimo', campo: 'emp', coluna: 'e.id_emprestimo',
        legenda: 'Quatro grupos. Este é o resumo que a locadora de fato usa: quanto custou cada empréstimo, somando os jogos dele.' },
      { id: 'jogo', nome: 'por jogo', campo: 'jogo', coluna: 'j.titulo',
        legenda: 'Cinco grupos. Agora a soma responde outra pergunta: quanto cada jogo rendeu — e dá para ver qual sai mais.' },
    ];

    escolhas('a14-grupos', CHAVES, function (ch) {
      var det = $('a14-detalhe'), res = $('a14-resumo');
      det.textContent = ''; res.textContent = '';

      var grupos = {};
      ITENS.forEach(function (i) {
        var k = i[ch.campo];
        (grupos[k] = grupos[k] || []).push(i);
        det.appendChild(linha(i.cli + ' · ' + i.jogo, '#' + i.emp + ' · ' + real(i.preco)));
      });

      var chaves = Object.keys(grupos);
      chaves.forEach(function (k) {
        var g = grupos[k];
        var soma = g.reduce(function (a, i) { return a + i.preco; }, 0);
        res.appendChild(linha(
          (ch.id === 'emp' ? 'empréstimo #' : '') + k,
          g.length + (g.length === 1 ? ' item · ' : ' itens · ') + real(soma),
          'entrou'
        ));
      });

      $('a14-selo-detalhe').textContent = ITENS.length + ' linhas';
      $('a14-selo-resumo').textContent = chaves.length + (chaves.length === 1 ? ' linha' : ' linhas');
      $('a14-painel-resumo').classList.add('bom');

      $('a14-gb-legenda').textContent = ch.legenda +
        ' Sete linhas entraram, ' + chaves.length + ' saíram — e é por isso que, depois do GROUP BY, só dá para ' +
        'pedir a coluna do grupo ou uma função que resuma as outras.';

      log.escrever([
        { hora: 'FROM', ator: 'banco', texto: 'ler as linhas de item_emprestimo', resultado: ITENS.length + ' linhas' },
        { hora: 'GROUP BY', ator: 'banco', texto: 'juntar as linhas com o mesmo ' + ch.coluna, resultado: chaves.length + ' grupos' },
        { hora: 'count/sum', ator: 'banco', texto: 'resumir cada grupo num número', resultado: 'uma linha por grupo' },
        { hora: 'consulta', ator: 'dml', sql: true,
          texto: 'SELECT ' + ch.coluna + ', count(*), sum(i.preco_pago)\n  FROM item_emprestimo i\n GROUP BY ' + ch.coluna + ';' },
      ]);
    });
  })();
})(window.DemoKit);
