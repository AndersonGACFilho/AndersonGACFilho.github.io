/* demos.js — Aula 15: a subconsulta por dentro, e o que a view guarda.
 *
 * Duas confusões que o slide só consegue avisar, e que aqui acontecem:
 *
 *   1. ler a subconsulta de fora para dentro, como se lê português. O banco
 *      resolve ao contrário, e por isso a demonstração 1 mostra o comando se
 *      REESCREVENDO: o pedaço de dentro vira o número que ele devolveu;
 *   2. achar que a view é uma cópia da tabela. Se fosse, mudar a tabela não
 *      mudaria a view — então a demonstração 2 muda a tabela e deixa o aluno
 *      conferir.
 */
(function (K) {
  'use strict';
  var $ = K.$, el = K.el, linha = K.linha, novoLog = K.novoLog;

  var real = function (v) { return 'R$ ' + v.toFixed(2).replace('.', ','); };

  /* ================= 1. a de dentro roda primeiro ================= */

  (function () {
    var passo = $('a15-passo');
    if (!passo) return;

    var log = novoLog('a15-log');
    var atual = 0;

    var JOGOS = [
      { titulo: 'God of War', preco: 12.0 },
      { titulo: 'FIFA 25', preco: 10.0 },
      { titulo: 'Zelda TotK', preco: 14.0 },
      { titulo: 'Elden Ring', preco: 13.0 },
      { titulo: 'Hollow Knight', preco: 6.0 },
    ];
    var media = JOGOS.reduce(function (a, j) { return a + j.preco; }, 0) / JOGOS.length;

    var ETAPAS = [
      {
        sql: "SELECT titulo, preco_diaria\n  FROM jogo\n WHERE preco_diaria > (SELECT avg(preco_diaria) FROM jogo);",
        selo: 'como você escreveu',
        legenda:
          'Assim está escrito, e assim NÃO é lido pelo banco. Em português a gente lê de fora para dentro; ' +
          'o banco resolve o que está entre parênteses primeiro, porque sem aquele valor o WHERE não tem com o que comparar.',
        marca: null,
      },
      {
        sql: "SELECT titulo, preco_diaria\n  FROM jogo\n WHERE preco_diaria > (SELECT avg(preco_diaria) FROM jogo);\n\n-- o banco roda isto primeiro:\n--   SELECT avg(preco_diaria) FROM jogo  →  " + real(media),
        selo: 'rodando a de dentro',
        legenda:
          'A subconsulta devolve UM valor: ' + real(media) + '. É uma consulta comum, sobre a mesma tabela, ' +
          'e ela não sabe nada do comando que a contém.',
        marca: 'media',
      },
      {
        sql: "SELECT titulo, preco_diaria\n  FROM jogo\n WHERE preco_diaria > " + media.toFixed(2) + ";",
        selo: 'o valor tomou o lugar',
        legenda:
          'Agora é uma consulta comum, igual às da Aula 13. A subconsulta não é uma construção especial: ' +
          'ela é um jeito de escrever um valor que você ainda não sabe na hora de escrever.',
        marca: 'media',
      },
      {
        sql: "SELECT titulo, preco_diaria\n  FROM jogo\n WHERE preco_diaria > " + media.toFixed(2) + ";",
        selo: 'resultado',
        legenda:
          'Três jogos acima da média. E aqui está o motivo de existir subconsulta: amanhã entra um jogo novo, ' +
          'a média muda, e esta mesma consulta continua certa — porque ela não tem o 11,00 escrito dentro.',
        marca: 'resultado',
      },
    ];

    function desenhar() {
      var e = ETAPAS[atual];
      var cm = $('a15-comando'), tab = $('a15-tabela');
      cm.textContent = ''; tab.textContent = '';

      var bloco = el('div', 'linha');
      bloco.appendChild(el('code', null, e.sql));
      cm.appendChild(bloco);

      JOGOS.forEach(function (j) {
        var acima = j.preco > media;
        var classe = '';
        if (e.marca === 'resultado') classe = acima ? 'achou' : 'velha';
        else if (e.marca === 'media') classe = 'entrou';
        tab.appendChild(linha(j.titulo, real(j.preco), classe));
      });
      if (e.marca === 'media' || e.marca === 'resultado') {
        tab.appendChild(linha('média', real(media), 'achou'));
      }

      $('a15-selo-comando').textContent = e.selo;
      $('a15-selo-tabela').textContent = e.marca === 'resultado'
        ? JOGOS.filter(function (j) { return j.preco > media; }).length + ' acima da média'
        : JOGOS.length + ' linhas';
      $('a15-painel-comando').classList.toggle('bom', atual === ETAPAS.length - 1);
      $('a15-legenda').textContent = e.legenda;

      log.escrever(
        ETAPAS.slice(0, atual + 1).map(function (x, i) {
          return {
            hora: 'passo ' + (i + 1),
            ator: i === 0 ? 'voce' : 'banco',
            texto: ['o comando como escrito', 'resolver o que está entre parênteses',
              'substituir o valor no lugar da subconsulta', 'executar a consulta já simples'][i],
            resultado: ['—', real(media), 'WHERE preco_diaria > ' + media.toFixed(2),
              JOGOS.filter(function (j) { return j.preco > media; }).length + ' linhas'][i],
          };
        })
      );

      passo.disabled = atual === ETAPAS.length - 1;
      passo.textContent = atual === ETAPAS.length - 1 ? 'Resolvida' : 'Resolver o próximo pedaço';
    }

    passo.addEventListener('click', function () {
      if (atual < ETAPAS.length - 1) atual += 1;
      desenhar();
    });
    $('a15-zerar').addEventListener('click', function () { atual = 0; desenhar(); });
    desenhar();
  })();

  /* ================= 2. onde a view guarda os dados ================= */

  (function () {
    var caixa = $('a15-mexer');
    if (!caixa) return;

    var log = novoLog('a15-view-log');
    var historico = [];

    // `custo` existe para a view ter o que ESCONDER. Uma view que mostra tudo
    // nao demonstra recorte, e recorte e metade do assunto — a outra metade,
    // a permissao, e a Aula 16.
    var jogos = [
      { titulo: 'God of War', genero: 'Ação', preco: 12.0, custo: 90.0 },
      { titulo: 'FIFA 25', genero: 'Esporte', preco: 10.0, custo: 240.0 },
      { titulo: 'Zelda TotK', genero: 'Aventura', preco: 14.0, custo: 310.0 },
    ];

    function desenhar(ultimo) {
      var jg = $('a15-jogo'), df = $('a15-def'), vw = $('a15-view');
      jg.textContent = ''; df.textContent = ''; vw.textContent = '';

      jogos.forEach(function (j) {
        jg.appendChild(linha(j.titulo, real(j.preco) + ' · custo ' + real(j.custo),
          j.titulo === ultimo ? 'entrou' : ''));
      });

      var bloco = el('div', 'linha');
      bloco.appendChild(el('code', null,
        'CREATE VIEW catalogo_publico AS\nSELECT titulo, genero, preco_diaria\n  FROM jogo;'));
      df.appendChild(bloco);
      df.appendChild(linha('linhas guardadas aqui', 'nenhuma', 'velha'));

      jogos.forEach(function (j) {
        vw.appendChild(linha(j.titulo, j.genero + ' · ' + real(j.preco),
          j.titulo === ultimo ? 'entrou' : ''));
      });
      vw.appendChild(linha('custo', 'a view não tem esta coluna', 'sumiu'));

      $('a15-selo-jogo').textContent = jogos.length + ' linhas · 4 colunas';
      $('a15-selo-def').textContent = 'só o comando';
      $('a15-selo-view').textContent = jogos.length + ' linhas · 3 colunas';
      $('a15-painel-view').classList.add('bom');
      $('a15-painel-def').classList.add('bom');

      log.escrever(historico, 'A tabela ainda não foi mexida.');
    }

    [
      {
        nome: 'Baixar o preço do God of War',
        fazer: function () {
          jogos[0].preco = 8.0;
          historico.push({ hora: historico.length + 1 + '', ator: 'dml', sql: true,
            texto: "UPDATE jogo SET preco_diaria = 8.00 WHERE titulo = 'God of War';",
            resultado: 'a view já mostra 8,00' });
          return 'God of War';
        },
        legenda:
          'A view mudou junto, no mesmo instante — e ninguém rodou nada nela. Ela não guarda linha nenhuma: ' +
          'guarda o COMANDO, e executa esse comando toda vez que alguém a consulta.',
      },
      {
        nome: 'Inserir um jogo novo',
        fazer: function () {
          jogos.push({ titulo: 'Elden Ring', genero: 'Ação', preco: 13.0, custo: 250.0 });
          historico.push({ hora: historico.length + 1 + '', ator: 'dml', sql: true,
            texto: "INSERT INTO jogo VALUES ('Elden Ring', 'Ação', 13.00, 250.00);",
            resultado: 'a view passou a ter 4 linhas' });
          return 'Elden Ring';
        },
        legenda:
          'A linha nova apareceu na view sem ninguém recriá-la. É por isso que view não "desatualiza": ' +
          'não há cópia para ficar velha.',
      },
      {
        nome: 'Tentar mudar o custo PELA view',
        fazer: function () {
          historico.push({ hora: historico.length + 1 + '', ator: 'banco', marca: 'ruim',
            texto: 'ERROR:  column "custo" of relation "catalogo_publico" does not exist',
            resultado: 'recusado' });
          return null;
        },
        legenda:
          'A coluna não existe na view, então nem dá para tentar. É este o recorte que a Aula 16 vai transformar ' +
          'em permissão: conceder SELECT na view e NENHUM privilégio na tabela jogo.',
      },
    ].forEach(function (a) {
      var b = el('button', 'acao secundaria', a.nome);
      b.type = 'button';
      b.addEventListener('click', function () {
        var alvo = a.fazer();
        desenhar(alvo);
        $('a15-view-legenda').textContent = a.legenda;
      });
      caixa.appendChild(b);
    });

    var zerar = el('button', 'acao', 'Começar de novo');
    zerar.type = 'button';
    zerar.addEventListener('click', function () {
      jogos = [
        { titulo: 'God of War', genero: 'Ação', preco: 12.0, custo: 90.0 },
        { titulo: 'FIFA 25', genero: 'Esporte', preco: 10.0, custo: 240.0 },
        { titulo: 'Zelda TotK', genero: 'Aventura', preco: 14.0, custo: 310.0 },
      ];
      historico = [];
      desenhar(null);
      $('a15-view-legenda').textContent =
        'Três jogos na tabela, três na view — e a coluna de custo só na tabela. Mexa na tabela e veja o que a view faz.';
    });
    caixa.appendChild(zerar);

    desenhar(null);
    $('a15-view-legenda').textContent =
      'Três jogos na tabela, três na view — e a coluna de custo só na tabela. Mexa na tabela e veja o que a view faz.';
  })();
})(window.DemoKit);
