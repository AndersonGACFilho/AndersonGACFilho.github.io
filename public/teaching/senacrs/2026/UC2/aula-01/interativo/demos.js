/* demos.js — as demonstracoes da Aula 01.
 *
 * Ficam AQUI, ao lado da pagina, e nao em _comum/: o motor do quiz e o visual
 * sao compartilhados, mas cada aula demonstra outra coisa. _comum/ so guarda o
 * que a proxima aula vai reaproveitar sem mexer.
 *
 * Script classico, mesmo motivo do autocorrecao.js: a pagina tem de abrir com
 * duplo clique no arquivo quando a internet do laboratorio cair.
 */
(function () {
  'use strict';

  var $ = function (id) {
    return document.getElementById(id);
  };

  function el(tag, classe, texto) {
    var e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texto != null) e.textContent = texto;
    return e;
  }

  function linha(texto, valor, classe) {
    var l = el('div', 'linha' + (classe ? ' ' + classe : ''));
    l.appendChild(el('span', null, texto));
    l.appendChild(el('span', null, valor));
    return l;
  }

  /* ================= 1. o lancamento que some ================= */
  //
  // A demo inteira existe por causa do passo 6: ate ali tudo parece certo. O
  // aluno tem de VER o #1003 sumir depois de ter sido salvo — e ninguem ser
  // avisado. Descrito em texto, isso nao assusta; na tela, assusta.

  (function () {
    var proximo = $('d1-proximo');
    if (!proximo) return;

    var BASE = [
      ['#1001', 'Elden Ring'],
      ['#1002', 'Hollow Knight'],
    ];
    var comSgbd = false;
    var passo = 0;

    var PASSOS = [
      'A planilha tem dois lançamentos. Ninguém está com ela aberta.',
      '19h02 — Ana abre o arquivo. O que ela vê é uma cópia.',
      '19h03 — Bruno abre o mesmo arquivo. Segunda cópia.',
      '19h05 — Ana lança o empréstimo #1003 na cópia dela.',
      '19h06 — Bruno lança o #1004 na cópia dele.',
      '19h10 — Ana salva. Até aqui, tudo certo.',
      null, // o desfecho muda conforme o modo
    ];

    function desenhar() {
      var arquivo = BASE.slice();
      var ana = null;
      var bruno = null;
      var perdido = null;

      if (passo >= 1) ana = BASE.slice();
      if (passo >= 2) bruno = BASE.slice();
      if (passo >= 3) ana = ana.concat([['#1003', 'Baldurs Gate 3']]);
      if (passo >= 4) bruno = bruno.concat([['#1004', 'Stardew Valley']]);
      if (passo >= 5) arquivo = ana.slice();
      if (passo >= 6) {
        if (comSgbd) {
          arquivo = BASE.concat([
            ['#1003', 'Baldurs Gate 3'],
            ['#1004', 'Stardew Valley'],
          ]);
        } else {
          arquivo = bruno.slice();
          perdido = ['#1003', 'Baldurs Gate 3'];
        }
      }

      pintar($('lista-ana'), ana, passo >= 3 ? 2 : -1);
      pintar($('lista-bruno'), bruno, passo >= 4 ? 2 : -1);

      var alvo = $('lista-arquivo');
      alvo.textContent = '';
      arquivo.forEach(function (r, i) {
        var novo = passo >= 5 && i >= BASE.length;
        alvo.appendChild(linha(r[0], r[1], novo ? 'entrou' : ''));
      });
      if (perdido) alvo.appendChild(linha(perdido[0], perdido[1], 'sumiu'));

      $('selo-ana').textContent = ana ? 'aberta' : 'fechada';
      $('selo-bruno').textContent = bruno ? 'aberta' : 'fechada';
      $('rotulo-arquivo').textContent = comSgbd
        ? 'banco locadora — no servidor'
        : 'emprestimos.xlsx — no servidor';

      var selo = $('selo-arquivo');
      selo.className = 'selo';
      selo.textContent = '';
      if (passo >= 6) {
        selo.className = 'selo ' + (comSgbd ? 'bom' : 'ruim');
        selo.textContent = comSgbd ? 'nada se perdeu' : '1 lançamento perdido';
      }

      $('d1-legenda').textContent =
        passo < 6
          ? PASSOS[passo]
          : comSgbd
            ? '19h11 — Bruno salva. Os dois lançamentos entraram: o SGBD enfileira as gravações em vez de trocar o arquivo inteiro.'
            : '19h11 — Bruno salva por cima. O #1003 não existe mais, e ninguém foi avisado.';

      proximo.disabled = passo >= 6;
    }

    function pintar(alvo, itens, destaque) {
      alvo.textContent = '';
      if (!itens) {
        alvo.appendChild(el('p', 'vazio-painel', 'Não abriu o arquivo ainda.'));
        return;
      }
      itens.forEach(function (r, i) {
        alvo.appendChild(linha(r[0], r[1], i === destaque ? 'entrou' : ''));
      });
    }

    proximo.addEventListener('click', function () {
      if (passo < 6) passo += 1;
      desenhar();
    });
    $('d1-zerar').addEventListener('click', function () {
      passo = 0;
      desenhar();
    });
    $('d1-modo').addEventListener('click', function () {
      comSgbd = !comSgbd;
      passo = 0;
      this.textContent = comSgbd ? 'Repetir com a planilha' : 'Repetir com um SGBD';
      desenhar();
    });

    desenhar();
  })();

  /* ================= 2. a busca que responde errado ================= */
  //
  // Os dois paineis tem os MESMOS tres alugueis. So muda a grafia. O painel da
  // direita e o numero verdadeiro, e e por isso que ele serve de gabarito da
  // legenda: a planilha nao mente, ela responde certo a uma pergunta errada.

  (function () {
    var busca = $('d2-busca');
    if (!busca) return;

    var ALUGUEIS = [
      { digitado: 'God of War Ragnarok', certo: 'God of War Ragnarok', quem: 'Ana' },
      { digitado: 'god of war ragnarök', certo: 'God of War Ragnarok', quem: 'Bruno' },
      { digitado: 'GOW Ragnarok', certo: 'God of War Ragnarok', quem: 'Carla' },
      { digitado: 'Elden Ring', certo: 'Elden Ring', quem: 'Diego' },
      { digitado: 'Hollow Knight', certo: 'Hollow Knight', quem: 'Ester' },
    ];

    function desenhar() {
      var q = busca.value.trim().toLowerCase();
      var contas = [0, 0];

      [
        { alvo: $('d2-esq'), campo: 'digitado', i: 0 },
        { alvo: $('d2-dir'), campo: 'certo', i: 1 },
      ].forEach(function (lado) {
        lado.alvo.textContent = '';
        ALUGUEIS.forEach(function (a) {
          var achou = q !== '' && a[lado.campo].toLowerCase().indexOf(q) !== -1;
          if (achou) contas[lado.i] += 1;
          lado.alvo.appendChild(linha(a[lado.campo], a.quem, achou ? 'achou' : ''));
        });
      });

      $('d2-selo-esq').textContent = contas[0] + ' achado(s)';
      $('d2-selo-dir').textContent = contas[1] + ' achado(s)';
      $('d2-legenda').textContent =
        q === ''
          ? 'Digite o nome de um jogo.'
          : contas[0] === contas[1]
            ? 'Aqui as duas respostas batem. Experimente procurar pelo jogo que tem três grafias.'
            : 'A planilha responde ' + contas[0] + '. A verdade é ' + contas[1] + '. Ninguém tem como perceber pela resposta.';
    }

    busca.addEventListener('input', desenhar);
    desenhar();
  })();

  /* ================= 3. o telefone em 14 linhas ================= */

  (function () {
    var trocar = $('d3-trocar');
    if (!trocar) return;

    var VELHO = '51 9888-1010';
    var NOVO = '51 9777-2020';
    var TOTAL = 14;
    var ESQUECIDAS = [4, 9, 12]; // as tres que escapam
    var trocado = false;

    function desenhar() {
      var esq = $('d3-esq');
      esq.textContent = '';
      for (var i = 0; i < TOTAL; i++) {
        var esqueceu = trocado && ESQUECIDAS.indexOf(i) !== -1;
        var valor = trocado && !esqueceu ? NOVO : VELHO;
        esq.appendChild(el('div', 'chip' + (trocado ? (esqueceu ? ' velho' : ' novo') : ''), valor));
      }

      $('d3-ficha').textContent = 'Ana · ' + (trocado ? NOVO : VELHO);

      var seloEsq = $('d3-selo-esq');
      var seloDir = $('d3-selo-dir');
      seloEsq.className = 'selo' + (trocado ? ' ruim' : '');
      seloDir.className = 'selo' + (trocado ? ' bom' : '');
      seloEsq.textContent = trocado ? '3 linhas erradas' : '14 cópias';
      seloDir.textContent = trocado ? '0 erradas' : '1 lugar';

      $('d3-legenda').textContent = trocado
        ? 'Não foi desatenção: com o mesmo fato em 14 lugares, uma hora escapa um. À direita havia um lugar só para mudar.'
        : 'À esquerda o telefone está repetido em 14 linhas. À direita ele existe uma vez só.';

      trocar.disabled = trocado;
    }

    trocar.addEventListener('click', function () {
      trocado = true;
      desenhar();
    });
    $('d3-zerar').addEventListener('click', function () {
      trocado = false;
      desenhar();
    });

    desenhar();
  })();

  /* ================= 4. as quatro garantias ================= */

  (function () {
    var alvo = $('d4');
    if (!alvo) return;

    var GARANTIAS = [
      ['Concorrência', 'Muita gente mexendo ao mesmo tempo.', 'Sem isso: o lançamento da Ana some quando o Bruno salva.'],
      ['Integridade', 'O dado só entra se fizer sentido.', 'Sem isso: o mesmo jogo cadastrado de três jeitos.'],
      ['Persistência', 'O dado sobrevive a queda de energia.', 'Sem isso: caiu a luz no meio do lançamento e o registro sumiu.'],
      ['Segurança', 'Cada um vê e muda só o que pode.', 'Sem isso: o estagiário apaga a aba de clientes.'],
    ];

    GARANTIAS.forEach(function (g) {
      var c = el('button', 'cartao');
      c.type = 'button';
      c.appendChild(el('b', null, g[0]));
      c.appendChild(el('span', 'frente', g[1]));
      var verso = el('p', 'verso', g[2]);
      verso.hidden = true;
      c.appendChild(verso);
      c.addEventListener('click', function () {
        verso.hidden = !verso.hidden;
        c.classList.toggle('aberto', !verso.hidden);
      });
      alvo.appendChild(c);
    });
  })();

  /* ================= 5. SGBD, banco e tabela ================= */

  (function () {
    var legenda = $('d5-legenda');
    if (!legenda) return;

    var TEXTO = {
      sgbd: 'PostgreSQL é o SGBD: o programa. Ele pode guardar vários bancos.',
      banco: 'locadora é o banco de dados: o conjunto de tabelas de um negócio.',
      tabela: 'jogo é uma tabela: as linhas de um tipo de coisa.',
    };

    var caixas = document.querySelectorAll('.caixa');
    Array.prototype.forEach.call(caixas, function (caixa) {
      function escolher(ev) {
        ev.stopPropagation(); // senao o clique na tabela acende tambem o banco e o SGBD
        Array.prototype.forEach.call(caixas, function (o) {
          o.classList.remove('ativa');
        });
        caixa.classList.add('ativa');
        legenda.textContent = TEXTO[caixa.dataset.nivel];
      }
      caixa.addEventListener('click', escolher);
      caixa.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          escolher(ev);
        }
      });
    });
  })();

  /* ================= 6. linha do tempo ================= */

  (function () {
    var alvo = $('d6');
    if (!alvo) return;

    var MARCOS = [
      ['anos 1960', 'Hierárquico', 'Os dados em árvore. Descer era fácil; atravessar, péssimo.'],
      ['anos 1970', 'Em rede', 'Atravessar ficou possível — mas o programador tinha de conhecer o caminho até o dado.'],
      ['1970', 'Relacional', 'Codd, matemático da IBM: tudo em tabelas ligadas por valores. Você diz O QUE quer; o SGBD acha COMO.'],
      ['anos 2000', 'NoSQL', 'Documentos, chave-valor, grafos. Resolvem casos específicos e convivem com o relacional em vez de substituí-lo.'],
    ];
    var legenda = $('d6-legenda');

    MARCOS.forEach(function (m) {
      var li = el('li');
      var b = el('button', 'marco');
      b.type = 'button';
      b.appendChild(el('span', 'ano', m[0]));
      b.appendChild(el('span', null, m[1]));
      b.addEventListener('click', function () {
        Array.prototype.forEach.call(alvo.querySelectorAll('.marco'), function (o) {
          o.classList.remove('ativo');
        });
        b.classList.add('ativo');
        legenda.textContent = m[2];
      });
      li.appendChild(b);
      alvo.appendChild(li);
    });
  })();
})();
