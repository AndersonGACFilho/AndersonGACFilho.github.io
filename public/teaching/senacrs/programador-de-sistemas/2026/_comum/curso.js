/* curso.js — comportamento das páginas de material da UC.
 *
 * Script clássico, sem módulo e sem empacotador: a página tem de abrir com
 * duplo clique no arquivo quando a internet do laboratório cair.
 *
 * Três coisas: tópicos que lembram o que você abriu, marcação de concluído, e
 * o alternador de tema. O tema usa a MESMA chave do site pessoal — material e
 * site moram na mesma origem, então escolher claro na home vale aqui também.
 */
(function () {
  'use strict';

  var ABERTAS = 'uc2:aulas-abertas';
  var FEITAS = 'uc2:atividades-feitas';
  var TEMA = 'site:theme';

  function ler(chave, padrao) {
    try {
      var v = JSON.parse(localStorage.getItem(chave) || 'null');
      return v === null ? padrao : v;
    } catch (e) {
      return padrao; // janela anônima ou armazenamento bloqueado: segue sem lembrar
    }
  }

  function gravar(chave, valor) {
    try {
      localStorage.setItem(chave, JSON.stringify(valor));
    } catch (e) {
      /* a página continua inteira, só não lembra */
    }
  }

  /* ---------- tema, em três estados ---------- */
  //
  // O botão nasce com `hidden`: sem JavaScript ele não aparece, e a
  // preferência do sistema continua valendo sozinha. O estado vai escrito ao
  // lado do ícone — sol e lua sozinhos não dizem nada a leitor de tela.

  (function () {
    var botao = document.getElementById('tema');
    if (!botao) return;
    var ORDEM = ['system', 'light', 'dark'];
    var ICONE = { system: '◐', light: '☀', dark: '☾' };
    var icone = botao.querySelector('.marca');
    var nome = botao.querySelector('.dizer');

    function atual() {
      try {
        var v = localStorage.getItem(TEMA);
        return ORDEM.indexOf(v) !== -1 ? v : 'system';
      } catch (e) {
        return 'system';
      }
    }

    function aplicar(m) {
      var raiz = document.documentElement;
      if (m === 'system') raiz.removeAttribute('data-theme');
      else raiz.setAttribute('data-theme', m);
      var cor = getComputedStyle(raiz).getPropertyValue('--bg').trim();
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', cor);
      icone.textContent = ICONE[m];
      nome.textContent = botao.dataset[m];
      botao.setAttribute('aria-label', botao.dataset.troca + ': ' + nome.textContent);
    }

    aplicar(atual());
    botao.hidden = false;

    botao.addEventListener('click', function () {
      var proximo = ORDEM[(ORDEM.indexOf(atual()) + 1) % ORDEM.length];
      try {
        localStorage.setItem(TEMA, proximo);
      } catch (e) {
        /* vale para esta página, não para a próxima */
      }
      aplicar(proximo);
    });
  })();

  /* ---------- concluído ---------- */

  var topicos = Array.prototype.slice.call(document.querySelectorAll('.topico'));
  var atividades = Array.prototype.slice.call(document.querySelectorAll('.atividade'));
  var cheio = document.getElementById('cheio');
  var conta = document.getElementById('conta');
  if (!atividades.length) return;

  var feitas = ler(FEITAS, []);
  var marcado = function (li) {
    return feitas.indexOf(li.dataset.id) !== -1;
  };

  function pintar() {
    var n = 0;
    atividades.forEach(function (li) {
      var b = li.querySelector('.feito');
      var sim = marcado(li);
      if (sim) n += 1;
      b.setAttribute('aria-pressed', sim ? 'true' : 'false');
      b.querySelector('.dizer').textContent = sim ? b.dataset.feito : b.dataset.marcar;
    });
    topicos.forEach(function (d) {
      var itens = Array.prototype.slice.call(d.querySelectorAll('.atividade'));
      var f = itens.filter(marcado).length;
      var placar = d.querySelector('[data-placar]');
      if (!placar) return;
      placar.textContent = f + '/' + itens.length;
      placar.classList.toggle('completo', itens.length > 0 && f === itens.length);
    });
    if (cheio) cheio.style.width = (n / atividades.length) * 100 + '%';
    if (conta) conta.textContent = conta.dataset.modelo.replace('{n}', n).replace('{total}', atividades.length);
  }

  atividades.forEach(function (li) {
    li.querySelector('.feito').addEventListener('click', function () {
      var i = feitas.indexOf(li.dataset.id);
      if (i === -1) feitas.push(li.dataset.id);
      else feitas.splice(i, 1);
      gravar(FEITAS, feitas);
      pintar();
    });
  });
  pintar();

  /* ---------- tópicos abertos ---------- */

  var botao = document.getElementById('todas');
  var salvo = ler(ABERTAS, null);

  if (salvo) {
    topicos.forEach(function (d) {
      d.open = salvo.indexOf(d.dataset.n) !== -1;
    });
  } else {
    // Sem escolha guardada: abre o que já aconteceu. O HTML já vem assim do
    // build, mas a data do build envelhece — aqui vale o dia da visita.
    var hoje = new Date().toISOString().slice(0, 10);
    var comData = topicos.filter(function (d) { return d.dataset.data; });
    var passadas = comData.filter(function (d) { return d.dataset.data <= hoje; });
    comData.forEach(function (d) { d.open = passadas.indexOf(d) !== -1; });
    // curso que ainda não começou: abre a primeira, para não aparecer tudo fechado
    if (!passadas.length && comData.length) comData[0].open = true;
  }

  function rotular() {
    if (!botao) return;
    var tudoAberto = topicos.every(function (d) { return d.open; });
    botao.textContent = tudoAberto ? botao.dataset.recolher : botao.dataset.expandir;
  }

  if (botao) {
    botao.addEventListener('click', function () {
      var abrir = !topicos.every(function (d) { return d.open; });
      topicos.forEach(function (d) { d.open = abrir; });
    });
  }

  topicos.forEach(function (d) {
    d.addEventListener('toggle', function () {
      gravar(ABERTAS, topicos.filter(function (o) { return o.open; }).map(function (o) { return o.dataset.n; }));
      rotular();
    });
  });
  rotular();
})();
