/* demos.js — Aula 16: a matriz de permissões, executada.
 *
 * O slide desenha a matriz. Desenho de matriz é fácil de concordar e difícil
 * de sentir: todo mundo acha razoável que o estagiário não apague cliente, e
 * ninguém se lembra disso na hora de escrever o GRANT.
 *
 * Aqui a pessoa ENTRA como cada um e tenta as mesmas quatro coisas. O mesmo
 * comando, quatro respostas diferentes — é essa repetição que fixa que
 * permissão é do USUÁRIO, não do comando.
 */
(function (K) {
  'use strict';
  var $ = K.$, el = K.el, linha = K.linha, novoLog = K.novoLog, escolhas = K.escolhas;

  var OPERACOES = [
    { id: 'ler-jogo', nome: 'SELECT em jogo', sql: 'SELECT titulo FROM jogo;' },
    { id: 'inserir-emp', nome: 'INSERT em emprestimo', sql: "INSERT INTO emprestimo (...) VALUES (...);" },
    { id: 'apagar-cli', nome: 'DELETE em cliente', sql: 'DELETE FROM cliente WHERE id_cliente = 1;' },
    { id: 'ler-view', nome: 'SELECT em catalogo_publico', sql: 'SELECT * FROM catalogo_publico;' },
  ];

  /* ================= 1. a matriz, executada ================= */

  (function () {
    var caixa = $('a16-quem');
    if (!caixa) return;

    var log = novoLog('a16-log');

    var PESSOAS = [
      {
        id: 'admin', nome: 'admin_locadora',
        pode: ['ler-jogo', 'inserir-emp', 'apagar-cli', 'ler-view'],
        papel: [
          ['quem é', 'a dona da locadora'],
          ['o que faz', 'tudo, inclusive mexer na estrutura'],
          ['quantas pessoas', 'uma, e não é quem fica no balcão'],
        ],
        legenda:
          'Pode tudo — e é por isso que ninguém trabalha o dia inteiro com esta conta. Conta que pode tudo ' +
          'transforma qualquer engano de digitação num estrago grande.',
      },
      {
        id: 'atendente', nome: 'atendente',
        pode: ['ler-jogo', 'inserir-emp', 'ler-view'],
        papel: [
          ['quem é', 'quem está no balcão'],
          ['o que faz', 'registra empréstimo e consulta catálogo'],
          ['o que não faz', 'apagar cliente — isso nunca foi tarefa dele'],
        ],
        legenda:
          'Consegue registrar empréstimo e consultar o catálogo, e leva permission denied ao tentar apagar ' +
          'cliente. Repare que isso não é desconfiança: apagar cliente simplesmente não faz parte do trabalho dele.',
      },
      {
        id: 'estagiario', nome: 'estagiário',
        pode: ['ler-view'],
        papel: [
          ['quem é', 'quem está aprendendo'],
          ['o que faz', 'consulta o catálogo público'],
          ['o que não vê', 'preço de custo e dado nenhum de cliente'],
        ],
        legenda:
          'Só a view. Nem a tabela jogo ele enxerga — e é isso que esconde o preço de custo sem precisar de ' +
          'uma regra nova: a coluna não existe na view, como a Aula 15 mostrou.',
      },
      {
        id: 'ninguem', nome: 'uma role recém-criada',
        pode: [],
        papel: [
          ['quem é', 'qualquer role nova'],
          ['o que recebe ao nascer', 'nada'],
          ['por quê', 'no PostgreSQL o padrão é negar'],
        ],
        legenda:
          'Criar a role não dá acesso a nada. Este é o ponto de partida do privilégio mínimo, e ele é o padrão ' +
          'do PostgreSQL — a ferramenta já empurra para o caminho certo, e quem sai dele é quem digita ALL PRIVILEGES.',
      },
    ];

    escolhas('a16-quem', PESSOAS, function (p) {
      var lista = $('a16-pode'), pq = $('a16-porque');
      lista.textContent = ''; pq.textContent = '';

      var negadas = 0;
      OPERACOES.forEach(function (o) {
        var pode = p.pode.indexOf(o.id) !== -1;
        if (!pode) negadas += 1;
        var li = el('li', 'teste ' + (pode ? 'passou' : 'falhou'));
        li.appendChild(el('span', 'sinal', pode ? '✓' : '✕'));
        li.appendChild(el('span', 'pergunta-teste', o.nome));
        li.appendChild(el('span', 'resposta', pode ? 'executou' : 'permission denied'));
        lista.appendChild(li);
      });

      p.papel.forEach(function (d) { pq.appendChild(linha(d[0], d[1])); });

      $('a16-selo-pode').textContent = p.pode.length + ' de ' + OPERACOES.length;
      $('a16-selo-porque').textContent = p.nome;
      $('a16-painel-pode').classList.toggle('bom', negadas === 0);
      $('a16-painel-pode').classList.toggle('ruim', negadas > 0);

      $('a16-legenda').textContent = p.legenda;

      log.escrever(
        OPERACOES.map(function (o) {
          var pode = p.pode.indexOf(o.id) !== -1;
          return {
            hora: p.nome,
            ator: pode ? 'banco' : 'dcl',
            marca: pode ? '' : 'ruim',
            sql: true,
            texto: o.sql,
            resultado: pode ? 'ok' : 'ERROR: permission denied for table ' + o.sql.match(/(?:FROM|INTO)\s+(\w+)/)[1],
          };
        })
      );
    });
  })();

  /* ================= 2. GRANT e REVOKE ================= */

  (function () {
    var caixa = $('a16-grant-botoes');
    if (!caixa) return;

    var log = novoLog('a16-grant-log');
    var tem = [];
    var historico = [];

    var PRIVILEGIOS = [
      { id: 'select-jogo', rotulo: 'SELECT em jogo',
        grant: 'GRANT SELECT ON jogo TO estagiario;',
        revoke: 'REVOKE SELECT ON jogo FROM estagiario;' },
      { id: 'insert-jogo', rotulo: 'INSERT em jogo',
        grant: 'GRANT INSERT ON jogo TO estagiario;',
        revoke: 'REVOKE INSERT ON jogo FROM estagiario;' },
      { id: 'all-jogo', rotulo: 'ALL PRIVILEGES em jogo',
        grant: 'GRANT ALL PRIVILEGES ON jogo TO estagiario;',
        revoke: 'REVOKE ALL PRIVILEGES ON jogo FROM estagiario;',
        perigoso: true },
    ];

    // O que cada tentativa exige. Com ALL o estagiario passa a poder ate o
    // DELETE, e e aqui que o atalho "da ALL que e mais rapido" mostra o preco.
    var TENTATIVAS = [
      { nome: 'SELECT titulo FROM jogo', exige: ['select-jogo', 'all-jogo'] },
      { nome: 'INSERT INTO jogo', exige: ['insert-jogo', 'all-jogo'] },
      { nome: 'DELETE FROM jogo', exige: ['all-jogo'] },
    ];

    function desenhar() {
      var gr = $('a16-grants'), tn = $('a16-tenta');
      gr.textContent = ''; tn.textContent = '';

      if (!tem.length) {
        gr.appendChild(linha('nenhum privilégio', 'o padrão é negar', 'velha'));
      } else {
        PRIVILEGIOS.forEach(function (p) {
          if (tem.indexOf(p.id) !== -1) {
            gr.appendChild(linha(p.rotulo, p.perigoso ? 'inclui DELETE e DROP' : 'concedido',
              p.perigoso ? 'velha' : 'entrou'));
          }
        });
      }

      var conseguiu = 0;
      TENTATIVAS.forEach(function (t) {
        var pode = t.exige.some(function (e) { return tem.indexOf(e) !== -1; });
        if (pode) conseguiu += 1;
        tn.appendChild(linha(t.nome, pode ? 'executou' : 'permission denied', pode ? 'entrou' : 'sumiu'));
      });

      var temAll = tem.indexOf('all-jogo') !== -1;
      $('a16-selo-grants').textContent = tem.length ? tem.length + ' concedido(s)' : 'nenhum';
      $('a16-selo-tenta').textContent = conseguiu + ' de ' + TENTATIVAS.length;
      $('a16-painel-grants').classList.toggle('ruim', temAll);
      $('a16-painel-grants').classList.toggle('bom', tem.length > 0 && !temAll);
      $('a16-painel-tenta').classList.toggle('ruim', temAll);

      $('a16-grant-legenda').textContent = temAll
        ? 'Com ALL PRIVILEGES o estagiário passou a poder APAGAR o catálogo. Era só para ele consultar. ' +
          'O atalho “dá ALL que é mais rápido, depois a gente ajusta” é exatamente isto — e o “depois” nunca chega.'
        : tem.length
          ? 'Concedido só o que ele precisa, e nada além. Cada GRANT vale para UMA tabela e UM verbo: é essa ' +
            'granularidade que torna o privilégio mínimo possível de escrever.'
          : 'Sem nenhum GRANT, as três tentativas falham. No PostgreSQL uma role nasce sem acesso a nada — ' +
            'não é preciso revogar primeiro.';

      log.escrever(historico, 'Nenhum GRANT dado ainda.');
    }

    PRIVILEGIOS.forEach(function (p) {
      var b = el('button', p.perigoso ? 'acao' : 'acao secundaria', 'GRANT ' + p.rotulo);
      b.type = 'button';
      b.addEventListener('click', function () {
        var i = tem.indexOf(p.id);
        var dando = i === -1;
        if (dando) tem.push(p.id); else tem.splice(i, 1);
        historico.push({
          hora: historico.length + 1 + '', ator: 'dcl', sql: true,
          texto: dando ? p.grant : p.revoke,
          marca: dando && p.perigoso ? 'ruim' : '',
          resultado: dando ? 'concedido' : 'retirado',
        });
        b.textContent = (tem.indexOf(p.id) !== -1 ? 'REVOKE ' : 'GRANT ') + p.rotulo;
        desenhar();
      });
      caixa.appendChild(b);
    });

    desenhar();
  })();
})(window.DemoKit);
