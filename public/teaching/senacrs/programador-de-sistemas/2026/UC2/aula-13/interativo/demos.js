/* demos.js — Aula 13: montar a consulta, e o que o LIKE casa.
 *
 * O slide separa SELECT (colunas) de WHERE (linhas) com uma frase. A frase não
 * cola: na prova prática a turma põe no WHERE o que era do SELECT. Aqui as
 * duas decisões são controles diferentes e o efeito de cada uma aparece em
 * painéis diferentes — a distinção vira coisa vista, não coisa dita.
 *
 * O LIKE ganhou demonstração própria porque ele é o primeiro operador cujo
 * resultado surpreende: `%of%` pega "God of War" e também "Hollow Knight", e
 * ninguém adivinha isso lendo a definição de curinga.
 */
(function (K) {
  'use strict';
  var $ = K.$, el = K.el, linha = K.linha, novoLog = K.novoLog, escolhas = K.escolhas;

  var JOGOS = [
    { titulo: 'God of War', genero: 'Ação', preco: 12.0, ano: 2018 },
    { titulo: 'FIFA 25', genero: 'Esporte', preco: 10.0, ano: 2024 },
    { titulo: 'Zelda TotK', genero: 'Aventura', preco: 14.0, ano: 2023 },
    { titulo: 'Elden Ring', genero: 'Ação', preco: 13.0, ano: 2022 },
    { titulo: 'Hollow Knight', genero: 'Aventura', preco: 6.0, ano: 2017 },
  ];
  var real = function (v) { return 'R$ ' + v.toFixed(2).replace('.', ','); };

  /* ================= 1. montar a consulta ================= */

  (function () {
    var caixa = $('a13-pecas');
    if (!caixa) return;

    var log = novoLog('a13-log');

    var COLUNAS = [
      { id: 'titulo', nome: 'titulo', mostrar: function (j) { return j.titulo; } },
      { id: 'genero', nome: 'genero', mostrar: function (j) { return j.genero; } },
      { id: 'preco', nome: 'preco_diaria', mostrar: function (j) { return real(j.preco); } },
    ];
    var escolhidas = ['titulo', 'preco'];

    var FILTROS = [
      { id: 'tudo', nome: 'sem WHERE', sql: null, passa: function () { return true; },
        legenda: 'Sem WHERE, todas as cinco linhas vêm. O WHERE não é obrigatório — e é justamente por isso que esquecê-lo num UPDATE custa caro.' },
      { id: 'barato', nome: 'preco_diaria < 12', sql: 'preco_diaria < 12', passa: function (j) { return j.preco < 12; },
        legenda: 'O WHERE escolhe LINHAS. Repare que `preco_diaria` aparece na condição mesmo quando não está no SELECT: dá para filtrar por uma coluna que você não quer ver.' },
      { id: 'acao', nome: "genero = 'Ação'", sql: "genero = 'Ação'", passa: function (j) { return j.genero === 'Ação'; },
        legenda: 'Igualdade com texto pede aspas simples, como no INSERT da Aula 12. A regra é a mesma em toda a linguagem.' },
      { id: 'duas', nome: "genero = 'Ação' AND preco_diaria < 13", sql: "genero = 'Ação' AND preco_diaria < 13", passa: function (j) { return j.genero === 'Ação' && j.preco < 13; },
        legenda: 'Com AND, a linha precisa satisfazer as DUAS condições. Das duas de ação, só uma custa menos de 13 — e por isso sobra uma linha.' },
    ];
    var filtro = FILTROS[0];
    var ordenar = false;

    function desenhar() {
      var tab = $('a13-tabela'), saida = $('a13-saida');
      tab.textContent = ''; saida.textContent = '';

      var vistas = COLUNAS.filter(function (c) { return escolhidas.indexOf(c.id) !== -1; });
      var linhas = JOGOS.filter(filtro.passa);
      if (ordenar) {
        linhas = linhas.slice().sort(function (a, b) { return a.preco - b.preco; });
      }

      JOGOS.forEach(function (j) {
        var passa = filtro.passa(j);
        tab.appendChild(linha(j.titulo, j.genero + ' · ' + real(j.preco), passa ? 'achou' : 'velha'));
      });

      if (!vistas.length) {
        // Zero coluna nao e um estado neutro: o SQL nem compila. Dizer isso e
        // melhor do que mostrar um painel vazio e deixar o aluno achar que o
        // WHERE e que nao pegou nada.
        saida.appendChild(linha('nenhuma coluna escolhida', 'o SELECT precisa de ao menos uma', 'sumiu'));
      } else {
        linhas.forEach(function (j) {
          saida.appendChild(linha(
            vistas[0].mostrar(j),
            vistas.slice(1).map(function (c) { return c.mostrar(j); }).join(' · ')
          ));
        });
        if (!linhas.length) saida.appendChild(linha('nenhuma linha', 'o WHERE não deixou passar ninguém', 'velha'));
      }

      $('a13-selo-tabela').textContent = JOGOS.length + ' linhas · 4 colunas';
      $('a13-selo-saida').textContent = vistas.length
        ? linhas.length + (linhas.length === 1 ? ' linha' : ' linhas') + ' · ' + vistas.length +
          (vistas.length === 1 ? ' coluna' : ' colunas')
        : 'não compila';
      $('a13-painel-saida').classList.toggle('ruim', !vistas.length);
      $('a13-painel-saida').classList.toggle('bom', vistas.length > 0);

      $('a13-legenda').textContent = vistas.length
        ? filtro.legenda + (ordenar ? ' O ORDER BY não muda quais linhas vêm, só em que ordem.' : '')
        : 'Escolha pelo menos uma coluna: `SELECT FROM jogo` não é um comando válido.';

      var sql = 'SELECT ' + (vistas.length ? vistas.map(function (c) { return c.nome; }).join(', ') : '???') +
        '\n  FROM jogo' +
        (filtro.sql ? '\n WHERE ' + filtro.sql : '') +
        (ordenar ? '\n ORDER BY preco_diaria' : '') + ';';

      log.escrever([
        { hora: 'SELECT', ator: 'voce', texto: 'quais COLUNAS eu quero', resultado: vistas.length + ' de 3' },
        { hora: 'FROM', ator: 'voce', texto: 'de qual tabela', resultado: 'jogo' },
        { hora: 'WHERE', ator: 'voce', texto: 'quais LINHAS eu quero', resultado: filtro.sql || 'todas' },
        { hora: 'ORDER BY', ator: 'voce', texto: 'em que ordem', resultado: ordenar ? 'preco_diaria' : 'a do banco' },
        { hora: 'pronta', ator: 'dml', sql: true, texto: sql, marca: vistas.length ? '' : 'ruim' },
      ]);
    }

    COLUNAS.forEach(function (c) {
      var b = el('button', 'acao secundaria', c.nome);
      b.type = 'button';
      b.addEventListener('click', function () {
        var i = escolhidas.indexOf(c.id);
        if (i === -1) escolhidas.push(c.id); else escolhidas.splice(i, 1);
        b.setAttribute('aria-pressed', escolhidas.indexOf(c.id) !== -1 ? 'true' : 'false');
        desenhar();
      });
      b.setAttribute('aria-pressed', escolhidas.indexOf(c.id) !== -1 ? 'true' : 'false');
      caixa.appendChild(b);
    });

    var ord = el('button', 'acao', 'ORDER BY preco_diaria');
    ord.type = 'button';
    ord.setAttribute('aria-pressed', 'false');
    ord.addEventListener('click', function () {
      ordenar = !ordenar;
      ord.setAttribute('aria-pressed', ordenar ? 'true' : 'false');
      desenhar();
    });
    caixa.appendChild(ord);

    escolhas('a13-where', FILTROS, function (f) { filtro = f; desenhar(); });
  })();

  /* ================= 2. o LIKE ================= */

  (function () {
    var campo = $('a13-padrao');
    if (!campo) return;

    var log = novoLog('a13-like-log');

    // O LIKE do SQL traduzido para expressao regular, que e como ele de fato
    // funciona por dentro: % vira .*, _ vira ., e tudo o mais e literal. Os
    // metacaracteres da propria regex precisam ser escapados antes, senao um
    // titulo com parenteses quebraria a construcao.
    function paraRegex(padrao) {
      var escapado = padrao.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // SEM a flag 'i', de proposito: o LIKE do PostgreSQL DIFERENCIA maiuscula
      // de minuscula. Quem nao diferencia e o ILIKE. Casar sem diferenciar aqui
      // ensinaria o contrario do que o aluno vai encontrar no Query Tool.
      return new RegExp('^' + escapado.replace(/%/g, '.*').replace(/_/g, '.') + '$');
    }

    function traduzir(p) {
      if (!p) return 'um padrão vazio só casa com texto vazio.';
      var partes = [];
      if (p.indexOf('%') === 0) partes.push('pode ter qualquer coisa antes');
      var miolo = p.replace(/^%/, '').replace(/%$/, '');
      if (miolo.indexOf('%') !== -1) partes.push('e qualquer coisa no meio, onde está o % do meio');
      if (miolo) partes.push('precisa conter "' + miolo.replace(/_/g, '?') + '"');
      if (p.slice(-1) === '%') partes.push('pode ter qualquer coisa depois');
      if (p.indexOf('_') !== -1) partes.push('cada _ exige exatamente um caractere, nem zero nem dois');
      if (p.indexOf('%') === -1 && p.indexOf('_') === -1) {
        return 'sem % e sem _, o LIKE é igualdade: só casa com o texto exatamente assim.';
      }
      return partes.join(', ') + '.';
    }

    function desenhar() {
      var p = campo.value;
      var re = paraRegex(p);
      var casou = $('a13-casou'), fora = $('a13-fora');
      casou.textContent = ''; fora.textContent = '';

      var dentro = 0;
      JOGOS.forEach(function (j) {
        if (re.test(j.titulo)) {
          dentro += 1;
          casou.appendChild(linha(j.titulo, 'casou', 'achou'));
        } else {
          fora.appendChild(linha(j.titulo, '', 'velha'));
        }
      });
      if (!dentro) casou.appendChild(linha('nenhum título', 'o padrão não casou com nada', 'sumiu'));
      if (dentro === JOGOS.length) fora.appendChild(linha('nenhum título', 'o padrão casou com todos', ''));

      $('a13-selo-casou').textContent = dentro + ' de ' + JOGOS.length;
      $('a13-selo-fora').textContent = JOGOS.length - dentro + ' de ' + JOGOS.length;
      $('a13-painel-casou').classList.toggle('bom', dentro > 0);
      $('a13-painel-casou').classList.toggle('ruim', dentro === 0);

      // A surpresa de verdade do LIKE e a caixa: `god%` nao acha nada, `God%`
      // acha. Quem digitou minusculo conclui que o jogo nao esta no catalogo.
      var soACaixa = dentro === 0 && JOGOS.some(function (j) {
        return new RegExp('^' + p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          .replace(/%/g, '.*').replace(/_/g, '.') + '$', 'i').test(j.titulo);
      });
      $('a13-like-legenda').textContent = soACaixa
        ? 'Nenhum resultado — e não é porque o jogo não existe: é a CAIXA. O LIKE do PostgreSQL diferencia ' +
          'maiúscula de minúscula, então "' + p + '" não casa. Com a mesma grafia do título, casa; ' +
          'para ignorar a caixa existe o ILIKE.'
        : traduzir(p);

      log.escrever([
        { hora: 'padrão', ator: 'voce', sql: true, texto: "WHERE titulo LIKE '" + p + "'" },
        { hora: 'em português', ator: 'banco', texto: traduzir(p), resultado: dentro + ' linha(s)' },
      ]);
    }

    campo.addEventListener('input', desenhar);

    [
      { p: '%of%', q: 'contém "of" em qualquer lugar' },
      { p: 'God%', q: 'começa com "God"' },
      { p: '%Ring', q: 'termina com "Ring"' },
      { p: 'FIFA __', q: 'FIFA, espaço, e exatamente dois caracteres' },
      { p: 'Elden Ring', q: 'sem curinga: igualdade' },
      { p: 'god%', q: 'minúsculo: o LIKE diferencia a caixa e não acha nada' },
    ].forEach(function (e) {
      var b = el('button', 'acao secundaria', e.p);
      b.type = 'button';
      b.title = e.q;
      b.addEventListener('click', function () { campo.value = e.p; desenhar(); });
      $('a13-exemplos').appendChild(b);
    });

    desenhar();
  })();
})(window.DemoKit);
