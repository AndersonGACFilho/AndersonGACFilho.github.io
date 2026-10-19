/* demos.js — Aula 12: o WHERE esquecido e as aspas.
 *
 * Os dois erros que esta turma vai cometer de verdade, e que o slide só pode
 * avisar. Aqui eles ACONTECEM: o UPDATE sem WHERE reescreve as cinco linhas na
 * frente do aluno, e o número entre aspas é recusado pelo banco com a mensagem
 * que ele vai ver no laboratório.
 *
 * A demonstração 1 oferece o SELECT de conferência como um comando a mais, e
 * não como um aviso de texto. É o hábito que o slide pede, e um hábito se
 * aprende executando.
 */
(function (K) {
  'use strict';
  var $ = K.$, el = K.el, linha = K.linha, novoLog = K.novoLog, escolhas = K.escolhas;

  /* ================= 1. o WHERE esquecido ================= */

  (function () {
    var caixa = $('a12-comandos');
    if (!caixa) return;

    var log = novoLog('a12-log');

    var JOGOS = [
      { id: 10, titulo: 'God of War', preco: 12.0 },
      { id: 11, titulo: 'FIFA 25', preco: 10.0 },
      { id: 12, titulo: 'Zelda TotK', preco: 14.0 },
      { id: 13, titulo: 'Elden Ring', preco: 13.0 },
      { id: 14, titulo: 'Hollow Knight', preco: 6.0 },
    ];

    var real = function (v) { return v.toFixed(2).replace('.', ','); };

    var COMANDOS = [
      {
        id: 'select',
        nome: 'SELECT de conferência (o hábito)',
        sql: "SELECT id_jogo, titulo, preco_diaria\n  FROM jogo\n WHERE id_jogo = 11;",
        afeta: function (j) { return j.id === 11; },
        muda: null,
        resposta: '1 linha',
        legenda:
          'Antes de mudar, confira o que o seu WHERE pega. Se este SELECT devolver cinco linhas quando você ' +
          'esperava uma, o problema está no WHERE — e você descobriu isso sem ter mudado nada.',
      },
      {
        id: 'upd-where',
        nome: 'UPDATE com WHERE',
        sql: "UPDATE jogo\n   SET preco_diaria = 9.00\n WHERE id_jogo = 11;",
        afeta: function (j) { return j.id === 11; },
        muda: function (j) { return j.id === 11 ? 9.0 : j.preco; },
        resposta: 'UPDATE 1',
        legenda:
          'Uma linha, que era a intenção. O FIFA passou a 9,00 e os outros quatro continuam como estavam.',
      },
      {
        id: 'upd-sem',
        nome: 'UPDATE sem WHERE',
        sql: "UPDATE jogo\n   SET preco_diaria = 9.00;",
        afeta: function () { return true; },
        muda: function () { return 9.0; },
        resposta: 'UPDATE 5',
        ruim: true,
        legenda:
          'Cinco linhas. O catálogo inteiro passou a custar 9,00, inclusive o Hollow Knight, que custava 6,00 — ' +
          'o preço dele SUBIU. Nenhum erro apareceu: o comando é válido, e o banco fez exatamente o que foi mandado.',
      },
      {
        id: 'del-sem',
        nome: 'DELETE sem WHERE',
        sql: 'DELETE FROM jogo;',
        afeta: function () { return true; },
        apaga: true,
        resposta: 'DELETE 5',
        ruim: true,
        legenda:
          'A tabela ficou vazia. A tabela ainda existe — o DELETE apaga linhas, não a estrutura —, mas o ' +
          'catálogo inteiro se foi, e só o backup da Aula 17 traz de volta.',
      },
    ];

    escolhas('a12-comandos', COMANDOS, function (c) {
      var antes = $('a12-antes'), depois = $('a12-depois');
      antes.textContent = ''; depois.textContent = '';

      var mexidas = 0;
      JOGOS.forEach(function (j) {
        var pega = c.afeta(j);
        if (pega && c.muda) mexidas += 1;
        if (pega && c.apaga) mexidas += 1;
        antes.appendChild(linha(j.titulo, 'R$ ' + real(j.preco), pega && c.muda ? 'velha' : ''));

        if (c.apaga && pega) {
          depois.appendChild(linha(j.titulo, 'apagado', 'sumiu'));
        } else if (c.muda) {
          var novo = c.muda(j);
          depois.appendChild(linha(j.titulo, 'R$ ' + real(novo), novo !== j.preco ? 'entrou' : ''));
        } else {
          // o SELECT nao muda nada: o painel da direita mostra o RESULTADO da
          // consulta, que e outra coisa — e e esse o ponto do habito
          if (pega) depois.appendChild(linha(j.titulo, 'R$ ' + real(j.preco), 'achou'));
        }
      });
      if (!c.muda && !c.apaga && !mexidas) {
        $('a12-selo-depois').textContent = '1 linha devolvida';
      }

      $('a12-selo-antes').textContent = JOGOS.length + ' linhas';
      $('a12-selo-depois').textContent = c.apaga
        ? '0 linhas'
        : c.muda
          ? mexidas + ' linha(s) mudada(s)'
          : '1 linha devolvida';
      $('a12-painel-depois').classList.toggle('ruim', !!c.ruim);
      $('a12-painel-depois').classList.toggle('bom', !c.ruim);

      $('a12-legenda').textContent = c.legenda;

      log.comparar(
        [
          { ator: 'voce', linhas: [{ sql: true, texto: c.sql }] },
          { ator: 'banco', marca: c.ruim ? 'ruim' : '',
            linhas: [{ texto: c.resposta, resultado: c.ruim ? 'sem desfazer' : 'como esperado' }] },
        ],
        c.ruim
          ? { texto: 'Não houve erro, aviso nem confirmação. É por isso que o SELECT vem antes.', marca: 'ruim' }
          : { texto: 'O WHERE é o que separa mudar uma linha de mudar a tabela inteira.' }
      );
    });
  })();

  /* ================= 2. as aspas ================= */

  (function () {
    var caixa = $('a12-trocas');
    if (!caixa) return;

    var log = novoLog('a12-aspas-log');

    // Quatro valores, dois de cada tipo, para a regra aparecer como regra e nao
    // como lista de casos: aspas seguem o TIPO DA COLUNA, nao o tamanho nem a
    // aparencia do valor. O `2019` do ano e o caso cruel — parece texto para
    // quem viu `'2026-10-19'` entre aspas duas linhas acima.
    var VALORES = [
      { col: 'titulo', valor: 'Elden Ring', tipo: 'texto', precisa: true },
      { col: 'preco_diaria', valor: '13.00', tipo: 'numeric', precisa: false },
      { col: 'ano_lancamento', valor: '2019', tipo: 'integer', precisa: false },
      { col: 'lancado_em', valor: '2019-02-22', tipo: 'date', precisa: true },
    ];
    var aspas = [true, true, true, true];

    function render(i) {
      return aspas[i] ? "'" + VALORES[i].valor + "'" : VALORES[i].valor;
    }

    function desenhar() {
      var vl = $('a12-valores'), cm = $('a12-comando');
      vl.textContent = ''; cm.textContent = '';

      var errados = [];
      VALORES.forEach(function (v, i) {
        var certo = aspas[i] === v.precisa;
        if (!certo) errados.push(v);
        vl.appendChild(linha(v.col + ' · ' + v.tipo, render(i), certo ? 'entrou' : 'velha'));
      });

      var sql = 'INSERT INTO jogo (titulo, preco_diaria, ano_lancamento, lancado_em)\nVALUES (' +
        VALORES.map(function (_, i) { return render(i); }).join(', ') + ');';
      var pre = el('div', 'linha');
      pre.appendChild(el('code', null, sql));
      cm.appendChild(pre);

      $('a12-selo-valores').textContent = errados.length
        ? errados.length + ' com aspas erradas'
        : 'as quatro corretas';
      $('a12-selo-comando').textContent = errados.length ? 'recusado' : 'aceito';
      $('a12-painel-valores').classList.toggle('ruim', errados.length > 0);
      $('a12-painel-valores').classList.toggle('bom', errados.length === 0);
      $('a12-painel-comando').classList.toggle('ruim', errados.length > 0);
      $('a12-painel-comando').classList.toggle('bom', errados.length === 0);

      var primeiro = errados[0];
      var resposta, legenda;
      if (!primeiro) {
        resposta = 'INSERT 0 1';
        legenda =
          'Aceito. A regra é só uma, e ela segue o TIPO DA COLUNA: texto e data entre aspas simples, ' +
          'número sem. Não é o tamanho nem a aparência do valor que decide.';
      } else if (primeiro.precisa) {
        // sem aspas, o PostgreSQL le o texto como NOME DE COLUNA — e e por isso
        // que a mensagem fala de "column", que confunde quem esperava "aspas"
        resposta = 'ERROR:  column "' + primeiro.valor.split(' ')[0] + '" does not exist\nLINE 2: VALUES (' + primeiro.valor + ', ...';
        legenda =
          'Sem aspas, o banco não lê "' + primeiro.valor + '" como texto: lê como NOME DE COLUNA. ' +
          'Por isso a mensagem fala de coluna que não existe, e não de aspas — é a mensagem que mais ' +
          'confunde no primeiro INSERT.';
      } else {
        resposta = 'ERROR:  invalid input syntax for type ' + primeiro.tipo + ': "' + primeiro.valor + '"';
        legenda =
          '"' + primeiro.valor + '" entre aspas é um texto, e a coluna é ' + primeiro.tipo + '. ' +
          'O PostgreSQL às vezes converte sozinho, e é aí que mora a armadilha: funciona até o dia em que ' +
          'o valor não converte, e ninguém lembra por quê.';
      }

      $('a12-aspas-legenda').textContent = legenda;
      log.comparar(
        [
          { ator: 'dml', linhas: [{ sql: true, texto: sql }] },
          { ator: 'banco', marca: errados.length ? 'ruim' : '', linhas: [{ sql: true, texto: resposta }] },
        ],
        errados.length
          ? { texto: 'Aspas seguem o tipo da coluna, e nada mais.', marca: 'ruim' }
          : { texto: 'Uma linha nova no catálogo.' }
      );
    }

    VALORES.forEach(function (v, i) {
      var b = el('button', 'acao secundaria', 'trocar as aspas de ' + v.col);
      b.type = 'button';
      b.addEventListener('click', function () { aspas[i] = !aspas[i]; desenhar(); });
      caixa.appendChild(b);
    });
    var certo = el('button', 'acao', 'Deixar as quatro certas');
    certo.type = 'button';
    certo.addEventListener('click', function () {
      aspas = VALORES.map(function (v) { return v.precisa; });
      desenhar();
    });
    caixa.appendChild(certo);

    desenhar();
  })();
})(window.DemoKit);
