/* demos.js — Aula 17: a janela de perda, e o restore por cima.
 *
 * O slide diz que a política de backup nasce da pergunta "quanto trabalho você
 * aceita perder". Dito assim, todo mundo concorda e ninguém calcula. Aqui a
 * conta é feita: escolhe-se a frequência, escolhe-se a hora da falha, e a
 * página devolve o número de empréstimos que deixaram de existir.
 *
 * A segunda demonstração existe porque o erro dela é o que faz a turma achar
 * que o backup está corrompido — quando o problema é o banco não estar vazio.
 */
(function (K) {
  'use strict';
  var $ = K.$, el = K.el, linha = K.linha, novoLog = K.novoLog, escolhas = K.escolhas;

  /* ================= 1. a janela de perda ================= */

  (function () {
    var caixa = $('a17-horas');
    if (!caixa) return;

    var log = novoLog('a17-log');

    var ABRE = 8, FECHA = 20;   // a locadora funciona das 8h as 20h
    var POLITICAS = [
      { id: 'semanal', nome: 'semanal, domingo 23h', horas: [],
        nota: 'o último backup é de domingo: a terça inteira está fora dele' },
      { id: 'diario', nome: 'diário, 23h', horas: [],
        nota: 'o último backup é o de segunda 23h, antes de a terça começar' },
      { id: 'seis', nome: 'de 6 em 6 horas', horas: [11, 17],
        nota: 'há backups às 5h, 11h e 17h — os dois de dentro do expediente aparecem no dia' },
      { id: 'hora', nome: 'de hora em hora', horas: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        nota: 'um backup por hora; a janela nunca passa de uma hora de trabalho' },
    ];
    var politica = POLITICAS[1];
    var falha = 18;

    function ultimoBackupAntes(h) {
      var antes = politica.horas.filter(function (b) { return b <= h; });
      return antes.length ? antes[antes.length - 1] : null;
    }

    function desenhar() {
      var dia = $('a17-dia'), conta = $('a17-conta');
      dia.textContent = ''; conta.textContent = '';

      var ub = ultimoBackupAntes(falha);
      var perdidos = [];

      for (var h = ABRE; h <= FECHA; h += 1) {
        var ehBackup = politica.horas.indexOf(h) !== -1;
        var depoisDaFalha = h > falha;
        var perdido = !depoisDaFalha && (ub === null ? h >= ABRE : h > ub);
        if (perdido && h <= falha) perdidos.push(h);

        var rotulo = h + 'h';
        var valor = ehBackup ? 'backup' : depoisDaFalha ? 'nem chegou a acontecer' :
          h === falha ? 'FALHA — o disco morreu' : '1 empréstimo registrado';
        var classe = ehBackup ? 'entrou' : h === falha ? 'sumiu' : perdido ? 'velha' : depoisDaFalha ? '' : '';
        dia.appendChild(linha(rotulo, valor, classe));
      }

      conta.appendChild(linha('último backup', ub ? ub + 'h de hoje' : politica.id === 'semanal' ? 'domingo 23h' : 'ontem 23h'));
      conta.appendChild(linha('falha em', falha + 'h'));
      conta.appendChild(linha('janela de perda',
        perdidos.length + (perdidos.length === 1 ? ' hora' : ' horas') + ' de trabalho',
        perdidos.length > 4 ? 'sumiu' : perdidos.length ? 'velha' : 'entrou'));
      conta.appendChild(linha('empréstimos perdidos', perdidos.length + '',
        perdidos.length > 4 ? 'sumiu' : perdidos.length ? 'velha' : 'entrou'));

      $('a17-selo-dia').textContent = politica.nome;
      $('a17-selo-conta').textContent = perdidos.length + (perdidos.length === 1 ? ' hora' : ' horas');
      $('a17-painel-conta').classList.toggle('ruim', perdidos.length > 4);
      $('a17-painel-conta').classList.toggle('bom', perdidos.length <= 1);

      $('a17-legenda').textContent =
        'Com backup ' + politica.nome + ' e falha às ' + falha + 'h, perdem-se ' +
        perdidos.length + (perdidos.length === 1 ? ' empréstimo' : ' empréstimos') + '. ' +
        politica.nota + '. ' +
        (perdidos.length > 4
          ? 'São clientes que levaram jogo e cujo registro não existe mais — a locadora não sabe quem está com o quê.'
          : perdidos.length
            ? 'Dá para reconstruir à mão, olhando as fichas de papel do dia. Caro, mas possível.'
            : 'Nada se perdeu desta vez — mas repare no custo: backup de hora em hora ocupa disco e tempo de servidor.');

      log.escrever([
        { hora: ub ? ub + 'h' : '23h de ontem', ator: 'servidor', texto: 'pg_dump gravou o arquivo', resultado: 'backup ok' },
        { hora: falha + 'h', ator: 'voce', marca: 'ruim', texto: 'o disco do servidor morreu', resultado: 'banco inacessível' },
        { hora: 'depois', ator: 'servidor', texto: 'pg_restore devolveu o estado do backup',
          resultado: perdidos.length + ' empréstimo(s) a menos', marca: perdidos.length ? 'ruim' : '' },
      ]);
    }

    escolhas('a17-politicas', POLITICAS, function (p) { politica = p; desenhar(); });

    [10, 13, 16, 18, 20].forEach(function (h) {
      var b = el('button', 'acao secundaria', 'falha às ' + h + 'h');
      b.type = 'button';
      b.addEventListener('click', function () { falha = h; desenhar(); });
      caixa.appendChild(b);
    });

    desenhar();
  })();

  /* ================= 2. restaurar por cima ================= */

  (function () {
    var caixa = $('a17-restore');
    if (!caixa) return;

    var log = novoLog('a17-rs-log');

    // O banco de hoje tem as linhas 1 e 2 do backup MAIS a 3, de hoje. E por
    // isso que restaurar por cima colide: as duas primeiras ja estao la.
    var BACKUP = [
      { id: 1, cli: 'Ana Souza', data: 'ontem' },
      { id: 2, cli: 'Bruno Lima', data: 'ontem' },
    ];
    var AGORA = [
      { id: 1, cli: 'Ana Souza', data: 'ontem' },
      { id: 2, cli: 'Bruno Lima', data: 'ontem' },
      { id: 3, cli: 'Diego Rocha', data: 'hoje' },
    ];

    function desenhar(modo) {
      var bc = $('a17-banco'), ar = $('a17-arquivo');
      bc.textContent = ''; ar.textContent = '';

      var final;
      if (modo === 'porcima') final = AGORA;
      else if (modo === 'limpo') final = BACKUP;
      else final = AGORA;

      final.forEach(function (l) {
        var veio = modo === 'limpo' && l.data === 'ontem';
        var perdeu = modo === 'limpo' && l.data === 'hoje';
        bc.appendChild(linha('#' + l.id + ' · ' + l.cli, l.data, veio ? 'entrou' : perdeu ? 'sumiu' : ''));
      });
      if (modo === 'limpo') {
        bc.appendChild(linha('#3 · Diego Rocha', 'de hoje — não estava no backup', 'sumiu'));
      }

      BACKUP.forEach(function (l) {
        var colide = modo === 'porcima';
        ar.appendChild(linha('INSERT #' + l.id, colide ? 'já existe no banco' : 'pronto para entrar',
          colide ? 'sumiu' : 'entrou'));
      });

      $('a17-selo-banco').textContent = (modo === 'limpo' ? BACKUP.length : AGORA.length) + ' linhas';
      $('a17-selo-arquivo').textContent = BACKUP.length + ' INSERT';
      $('a17-painel-banco').classList.toggle('ruim', modo === 'porcima' || modo === 'limpo');
      $('a17-painel-banco').classList.toggle('bom', !modo);

      if (modo === 'porcima') {
        $('a17-rs-legenda').textContent =
          'O restore parou no primeiro INSERT. A mensagem fala de chave duplicada, e é aí que todo mundo ' +
          'conclui que o backup está corrompido — ele não está. O banco é que não estava vazio, e o arquivo ' +
          'não tem como saber disso.';
        log.escrever([
          { hora: '1', ator: 'voce', sql: true, texto: 'pg_restore -d locadora backup_ontem.dump' },
          { hora: '2', ator: 'banco', marca: 'ruim', sql: true,
            texto: 'ERROR:  duplicate key value violates unique constraint "emprestimo_pkey"\nDETAIL:  Key (id_emprestimo)=(1) already exists.',
            resultado: '0 linhas restauradas' },
        ]);
      } else if (modo === 'limpo') {
        $('a17-rs-legenda').textContent =
          'Agora funcionou — e repare no preço: o empréstimo #3, registrado hoje, sumiu. Restaurar é voltar no ' +
          'tempo, e o que aconteceu depois do backup volta a não existir. Por isso se faz um backup ANTES de restaurar.';
        log.escrever([
          { hora: '1', ator: 'voce', sql: true, texto: 'pg_dump locadora > antes_do_restore.dump' },
          { hora: '2', ator: 'voce', sql: true, texto: 'DROP DATABASE locadora;\nCREATE DATABASE locadora;' },
          { hora: '3', ator: 'servidor', sql: true, texto: 'pg_restore -d locadora backup_ontem.dump',
            resultado: BACKUP.length + ' linhas' },
          { hora: '4', ator: 'voce', marca: 'ruim', texto: 'o empréstimo de hoje não voltou', resultado: '1 perdido' },
        ]);
      } else {
        $('a17-rs-legenda').textContent =
          'Três linhas no banco, duas no arquivo de ontem. Escolha como restaurar.';
        log.escrever([], 'Nenhum restore tentado ainda.');
      }
    }

    [
      { nome: 'Restaurar por cima, sem limpar', modo: 'porcima', classe: 'acao secundaria' },
      { nome: 'Apagar o banco e restaurar', modo: 'limpo', classe: 'acao secundaria' },
      { nome: 'Começar de novo', modo: null, classe: 'acao' },
    ].forEach(function (a) {
      var b = el('button', a.classe, a.nome);
      b.type = 'button';
      b.addEventListener('click', function () { desenhar(a.modo); });
      caixa.appendChild(b);
    });

    desenhar(null);
  })();
})(window.DemoKit);
