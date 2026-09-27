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
  // A demo inteira existe por causa do ultimo passo: ate ali tudo parece
  // certo. O aluno tem de VER o lancamento sumir depois de ter sido salvo — e
  // ninguem ser avisado. Descrito em texto isso nao assusta; na tela, assusta.
  //
  // OS DOIS MODOS NAO SAO A MESMA CENA COM OUTRO FINAL. Sao modelos
  // diferentes, e e por isso que os paineis mudam de nome e de conteudo:
  //
  //   planilha  cada um leva uma COPIA inteira do arquivo. E na copia que ele
  //             escolhe o proximo numero, e nas duas o ultimo e o #1002 —
  //             entao os dois escrevem #1003, sem ter como saber. Salvar e
  //             trocar o arquivo inteiro, e o segundo apaga o primeiro.
  //
  //   SGBD      nao existe copia. Cada um tem uma TELA DE LANCAMENTO com o
  //             que ele digitou, e nada mais. Ninguem inventa numero: manda o
  //             registro, e o banco devolve o numero que deu. Quem numera e um
  //             so, e por isso nao ha colisao nem perda.
  //
  // Desenhar o modo SGBD com "copia da Ana" e um #1003 escolhido por ela
  // ensinaria o modelo errado — seria a planilha com final feliz.

  (function () {
    var proximo = $('d1-proximo');
    if (!proximo) return;

    var BASE = [
      ['#1001', 'Elden Ring'],
      ['#1002', 'Hollow Knight'],
    ];
    var ANA = 'Baldurs Gate 3';
    var BRUNO = 'Stardew Valley';
    var comSgbd = false;
    var passo = 0;

    var PASSOS_PLANILHA = [
      'A planilha tem dois lançamentos. Ninguém está com ela aberta.',
      '19h02 — Ana abre o arquivo. O que ela vê é uma cópia inteira.',
      '19h03 — Bruno abre o mesmo arquivo. Segunda cópia inteira.',
      'Ana lança o próximo empréstimo. Na cópia dela o último é #1002, então ela escreve #1003.',
      'Bruno lança o dele. Na cópia dele o último também é #1002 — ele escreve #1003 também, sem ter como saber.',
      '19h10 — Ana salva: o arquivo do servidor vira a cópia dela. Até aqui, tudo certo.',
      '19h11 — Bruno salva: o arquivo vira a cópia DELE. Existiam dois #1003 diferentes, e o Baldurs Gate 3 da Ana não existe mais. Ninguém foi avisado.',
    ];

    var PASSOS_SGBD = [
      'O banco tem dois empréstimos. Ninguém tem cópia de nada — os dados estão só no servidor.',
      '19h02 — Ana abre a tela de lançamento. Ela vê um formulário vazio, não o arquivo.',
      '19h03 — Bruno abre a tela dele. Também um formulário, também vazio.',
      'Ana escolhe o jogo. Repare que não há número: quem numera não é ela.',
      'Bruno escolhe o dele. Também sem número.',
      '19h10 — Ana envia. O banco grava e devolve o número que deu: #1003.',
      '19h11 — Bruno envia. O banco grava e devolve #1004. Nada colidiu e nada se perdeu, porque quem numera é um só.',
    ];

    function desenhar() {
      var passos = comSgbd ? PASSOS_SGBD : PASSOS_PLANILHA;
      var servidor = BASE.slice();
      var ana = null;
      var bruno = null;
      var perdido = null;

      if (comSgbd) {
        // sem cópia: o painel de cada um tem só o que ele digitou
        if (passo >= 1) ana = [];
        if (passo >= 2) bruno = [];
        if (passo >= 3) ana = [['—', ANA]];
        if (passo >= 4) bruno = [['—', BRUNO]];
        if (passo >= 5) {
          ana = [['#1003', ANA]];
          servidor = BASE.concat([['#1003', ANA]]);
        }
        if (passo >= 6) {
          bruno = [['#1004', BRUNO]];
          servidor = BASE.concat([['#1003', ANA], ['#1004', BRUNO]]);
        }
      } else {
        if (passo >= 1) ana = BASE.slice();
        if (passo >= 2) bruno = BASE.slice();
        if (passo >= 3) ana = ana.concat([['#1003', ANA]]);
        if (passo >= 4) bruno = bruno.concat([['#1003', BRUNO]]);
        if (passo >= 5) servidor = ana.slice();
        if (passo >= 6) {
          servidor = bruno.slice();
          perdido = ['#1003', ANA];
        }
      }

      pintar($('lista-ana'), ana, comSgbd ? (passo >= 3 ? 0 : -1) : (passo >= 3 ? 2 : -1));
      pintar($('lista-bruno'), bruno, comSgbd ? (passo >= 4 ? 0 : -1) : (passo >= 4 ? 2 : -1));

      var alvo = $('lista-arquivo');
      alvo.textContent = '';
      servidor.forEach(function (r, i) {
        alvo.appendChild(linha(r[0], r[1], i >= BASE.length ? 'entrou' : ''));
      });
      if (perdido) alvo.appendChild(linha(perdido[0], perdido[1], 'sumiu'));

      $('rotulo-ana').textContent = comSgbd ? 'Ana — tela de lançamento' : 'Ana — cópia dela';
      $('rotulo-bruno').textContent = comSgbd ? 'Bruno — tela de lançamento' : 'Bruno — cópia dele';
      $('selo-ana').textContent = seloPessoa(ana, passo >= 5);
      $('selo-bruno').textContent = seloPessoa(bruno, passo >= 6);
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

      $('d1-legenda').textContent = passos[passo];
      proximo.disabled = passo >= 6;
    }

    function seloPessoa(painel, enviou) {
      if (comSgbd) return !painel ? 'tela fechada' : enviou ? 'enviado' : 'preenchendo';
      return painel ? 'aberta' : 'fechada';
    }

    function pintar(alvo, itens, destaque) {
      alvo.textContent = '';
      if (!itens) {
        alvo.appendChild(
          el('p', 'vazio-painel', comSgbd ? 'Não abriu a tela ainda.' : 'Não abriu o arquivo ainda.')
        );
        return;
      }
      if (!itens.length) {
        alvo.appendChild(el('p', 'vazio-painel', 'Formulário em branco.'));
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
