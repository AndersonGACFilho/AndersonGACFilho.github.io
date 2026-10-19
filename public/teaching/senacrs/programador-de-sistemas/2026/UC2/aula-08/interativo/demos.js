/* demos.js — Aula 08: anomalias e dependências funcionais.
 *
 * As três demonstrações saem dos três blocos do deck, e todas trabalham sobre
 * a MESMA tabela do crime que fica projetada a aula inteira. Isso é
 * deliberado: o aluno não precisa carregar um exemplo novo a cada seção, e o
 * que muda entre as três é a pergunta, não o dado.
 */
(function (K) {
  'use strict';
  var $ = K.$, el = K.el, linha = K.linha, novoLog = K.novoLog, escolhas = K.escolhas;

  // A tabela do crime, a mesma do slide. Uma linha por JOGO de cada
  // emprestimo, que e o que o N:N produz quando se achata tudo.
  //
  // CINCO linhas, e nao quatro, por um motivo medido: com quatro, o id_jogo
  // determinava o preco_pago e o nome_cliente POR COINCIDENCIA da amostra —
  // cada jogo aparecia com um cliente so e um preco so. A demonstracao 2
  // classificava as duas colunas errado, e o aluno aprenderia o metodo certo
  // com a resposta errada. A Carla levando o mesmo FIFA da Ana, e o God of War
  // saindo mais barato na segunda vez, quebram as duas coincidencias.
  var CRIME = [
    { emp: 1, jogo: 10, cli: 1, nome: 'Ana Souza',     titulo: 'God of War', preco: '12,00', data: '02/10' },
    { emp: 1, jogo: 11, cli: 1, nome: 'Ana Souza',     titulo: 'FIFA 25',    preco: '10,00', data: '02/10' },
    { emp: 2, jogo: 12, cli: 2, nome: 'Bruno Lima',    titulo: 'Zelda TotK', preco: '14,00', data: '02/10' },
    { emp: 3, jogo: 10, cli: 1, nome: 'Ana Souza',     titulo: 'God of War', preco: '9,00',  data: '09/10' },
    { emp: 4, jogo: 11, cli: 3, nome: 'Diego Rocha',   titulo: 'FIFA 25',    preco: '8,00',  data: '12/10' },
  ];

  var rotulo = function (l) {
    return '#' + l.emp + ' · ' + l.nome + ' · ' + l.titulo;
  };

  /* ================= 1. apagar uma linha e perder outra coisa ================= */
  //
  // A anomalia de exclusao EXECUTADA, que e a diferenca entre esta pagina e o
  // slide. O painel da direita nao e outra tabela: e o que da para saber
  // olhando a da esquerda. Quando a ultima linha de alguem some, ele some do
  // que a locadora sabe — e ninguem avisa.

  (function () {
    var caixa = $('a8-apagar');
    if (!caixa) return;

    var log = novoLog('a8-log');
    var vivas = CRIME.map(function (_, i) { return i; });
    var ultimo = null;

    function derivar(ids) {
      var clientes = [], jogos = [];
      ids.forEach(function (i) {
        var l = CRIME[i];
        if (clientes.indexOf(l.nome) === -1) clientes.push(l.nome);
        if (jogos.indexOf(l.titulo) === -1) jogos.push(l.titulo);
      });
      return { clientes: clientes, jogos: jogos };
    }

    var TUDO = derivar(CRIME.map(function (_, i) { return i; }));

    function desenhar() {
      var tab = $('a8-tabela'), sabe = $('a8-sabe');
      tab.textContent = ''; sabe.textContent = '';

      CRIME.forEach(function (l, i) {
        var fora = vivas.indexOf(i) === -1;
        tab.appendChild(linha(rotulo(l), l.data, fora ? 'sumiu' : ''));
      });

      var agora = derivar(vivas);
      TUDO.clientes.forEach(function (c) {
        var perdeu = agora.clientes.indexOf(c) === -1;
        sabe.appendChild(linha(c, perdeu ? 'perdido' : 'cliente', perdeu ? 'sumiu' : ''));
      });
      TUDO.jogos.forEach(function (j) {
        var perdeu = agora.jogos.indexOf(j) === -1;
        sabe.appendChild(linha(j, perdeu ? 'perdido' : 'no catálogo', perdeu ? 'sumiu' : ''));
      });

      $('a8-selo-tab').textContent = vivas.length + ' de 4 linhas';
      $('a8-selo-sabe').textContent =
        agora.clientes.length + ' clientes · ' + agora.jogos.length + ' jogos';
      $('a8-painel-sabe').classList.toggle(
        'ruim',
        agora.clientes.length < TUDO.clientes.length || agora.jogos.length < TUDO.jogos.length
      );

      if (ultimo === null) {
        $('a8-legenda').textContent =
          'Quatro linhas, três clientes conhecidos, três jogos no catálogo. Escolha uma linha para apagar.';
        log.escrever([], 'Nada foi apagado ainda.');
        return;
      }

      var l = CRIME[ultimo];
      // O que a ULTIMA exclusao custou, e nao o acumulado: dizer "voce perdeu
      // o Bruno" depois de apagar uma linha da Ana estaria errado, e o aluno
      // confere na tela.
      var antes = derivar(vivas.concat([ultimo]));
      var junto = antes.clientes.filter(function (c) { return agora.clientes.indexOf(c) === -1; })
        .concat(antes.jogos.filter(function (j) { return agora.jogos.indexOf(j) === -1; }));

      $('a8-legenda').textContent = junto.length
        ? 'Você apagou um empréstimo e perdeu ' + junto.join(' e ') +
          ' junto. Nenhum erro apareceu, porque o banco fez exatamente o que foi mandado.'
        : 'Nada se perdeu além da linha: a Ana continua conhecida, porque ela aparece em outras linhas. ' +
          'Quem o banco perde é sempre quem tem UMA linha só.';

      log.comparar(
        [
          { ator: 'voce', linhas: [{ sql: true, texto: 'DELETE FROM emprestimo\n WHERE id_emprestimo = ' + l.emp + ' AND id_jogo = ' + l.jogo + ';' }] },
          {
            ator: 'banco',
            marca: junto.length ? 'ruim' : '',
            linhas: [{ texto: junto.length ? 'apagou a linha — e ' + junto.join(' e ') : 'apagou a linha, e só', resultado: '1 linha' }],
          },
        ],
        junto.length
          ? { texto: 'Anomalia de exclusão: apagar um fato apagou outro junto, em silêncio.', marca: 'ruim' }
          : { texto: 'Desta vez não houve anomalia. Tente a linha do Bruno.' }
      );
    }

    CRIME.forEach(function (l, i) {
      var b = el('button', 'acao secundaria', 'apagar ' + rotulo(l));
      b.type = 'button';
      b.addEventListener('click', function () {
        var k = vivas.indexOf(i);
        if (k !== -1) vivas.splice(k, 1);
        ultimo = i;
        desenhar();
      });
      caixa.appendChild(b);
    });
    var zerar = el('button', 'acao', 'Começar de novo');
    zerar.type = 'button';
    zerar.addEventListener('click', function () {
      vivas = CRIME.map(function (_, i) { return i; });
      ultimo = null;
      desenhar();
    });
    caixa.appendChild(zerar);

    desenhar();
  })();

  /* ================= 2. de quem essa coluna depende ================= */
  //
  // O teste da pergunta da Aula 08, executado. Agrupa a tabela por cada
  // candidato a determinante e mostra se o valor VARIA dentro do grupo. Varia
  // = nao depende. E a definicao inteira, e ela cabe num olhar.

  (function () {
    var COLS = [
      { id: 'data',   nome: 'data_retirada', campo: 'data' },
      { id: 'titulo', nome: 'titulo_jogo',   campo: 'titulo' },
      { id: 'preco',  nome: 'preco_pago',    campo: 'preco' },
      { id: 'nome',   nome: 'nome_cliente',  campo: 'nome' },
    ];
    var CHAVES = [
      { id: 'emp', nome: 'id_emprestimo', campo: 'emp', painel: 'a8-painel-emp', corpo: 'a8-grupo-emp', selo: 'a8-selo-emp' },
      { id: 'jog', nome: 'id_jogo',       campo: 'jogo', painel: 'a8-painel-jog', corpo: 'a8-grupo-jog', selo: 'a8-selo-jog' },
      { id: 'cli', nome: 'id_cliente',    campo: 'cli', painel: 'a8-painel-cli', corpo: 'a8-grupo-cli', selo: 'a8-selo-cli' },
    ];
    var log = novoLog('a8-dep-log');

    // Agrupa por uma chave e diz, para cada grupo, se o valor da coluna e
    // sempre o mesmo. Um grupo com dois valores diferentes mata a dependencia.
    function testar(chave, col) {
      var grupos = {};
      CRIME.forEach(function (l) {
        var k = String(l[chave.campo]);
        (grupos[k] = grupos[k] || []).push(String(l[col.campo]));
      });
      var linhas = Object.keys(grupos).map(function (k) {
        var vals = grupos[k].filter(function (v, i, a) { return a.indexOf(v) === i; });
        return { chave: k, vals: vals, firme: vals.length === 1 };
      });
      return { linhas: linhas, determina: linhas.every(function (g) { return g.firme; }) };
    }

    escolhas('a8-colunas', COLS, function (col) {
      var determinantes = [];
      CHAVES.forEach(function (ch) {
        var r = testar(ch, col);
        if (r.determina) determinantes.push(ch.nome);
        var corpo = $(ch.corpo);
        corpo.textContent = '';
        r.linhas.forEach(function (g) {
          corpo.appendChild(
            linha(ch.nome.replace('id_', '') + ' ' + g.chave, g.vals.join(' / '), g.firme ? 'entrou' : 'velha')
          );
        });
        $(ch.selo).textContent = r.determina ? 'determina' : 'não determina';
        $(ch.painel).classList.toggle('bom', r.determina);
        $(ch.painel).classList.toggle('ruim', !r.determina);
      });

      // A ordem dos testes nao e arbitraria. id_cliente NAO e parte da chave,
      // entao se ele determina a coluna o caso e transitivo — mesmo que a
      // chave tambem determine, o que ela sempre faz, de carona. Testar a
      // parcial primeiro classificaria nome_cliente como parcial.
      var legenda;
      if (determinantes.indexOf('id_cliente') !== -1) {
        legenda = col.nome + ' depende de id_cliente, que não é a chave nem pedaço dela. ' +
          'Dependência TRANSITIVA: ela pega carona em id_cliente para chegar na chave, e some na 3FN.';
      } else if (determinantes.indexOf('id_emprestimo') !== -1) {
        legenda = col.nome + ' depende só de id_emprestimo, que é metade da chave. ' +
          'Dependência PARCIAL, e é o que a 2FN manda separar.';
      } else if (determinantes.indexOf('id_jogo') !== -1) {
        legenda = col.nome + ' depende só de id_jogo, a outra metade da chave. ' +
          'Dependência PARCIAL também — e o conserto leva a coluna para a tabela jogo.';
      } else {
        legenda = 'Nenhuma das três sozinha determina ' + col.nome +
          ' — ela depende das DUAS partes da chave juntas. Isso é dependência TOTAL, e está certa: ' +
          'é a única coluna que é assunto desta tabela.';
      }
      $('a8-dep-legenda').textContent = legenda;

      log.escrever(
        CHAVES.map(function (ch) {
          var r = testar(ch, col);
          return {
            hora: ch.nome,
            ator: r.determina ? 'banco' : 'voce',
            marca: r.determina ? '' : 'ruim',
            texto: 'Sabendo o ' + ch.nome + ', eu sei o ' + col.nome + '?',
            resultado: r.determina ? 'sim, sempre' : 'não — há grupo com dois valores',
          };
        })
      );
    });
  })();

  /* ================= 3. parcial ou transitiva, pelo caminho ================= */
  //
  // Os dois viloes tem o mesmo sintoma — repeticao — e o que os separa e o
  // CAMINHO ate a chave. Desenhar o caminho e o unico jeito de mostrar isso
  // sem pedir que o aluno monte a figura de cabeca.

  (function () {
    var passo = $('a8-vilao-passo');
    if (!passo) return;

    var log = novoLog('a8-vilao-log');
    var atual = 0;

    var CASOS = [
      {
        col: 'preco_pago',
        tipo: 'total',
        marca: 'bom',
        meio: null,
        de: ['id_emprestimo', 'id_jogo'],
        repete: ['nada se repete sem motivo', 'o mesmo jogo saiu por 12,00 e por 9,00'],
        conserto: ['fica onde está', 'é da chave inteira'],
        selo: 'está certa',
        seloC: 'nenhum conserto',
        legenda:
          'Dependência TOTAL: preco_pago precisa das duas partes da chave. É a única das três que não é defeito — e é a razão de a tabela do meio existir.',
        cap: 'Caminho da dependência total: a coluna sai das duas partes da chave ao mesmo tempo.',
        reg: { ator: 'banco', texto: 'preco_pago depende da chave inteira', resultado: 'total', marca: '' },
      },
      {
        col: 'titulo_jogo',
        tipo: 'parcial',
        marca: 'ruim',
        meio: null,
        de: ['id_jogo'],
        repete: ['"God of War" duas vezes', 'uma por empréstimo do mesmo jogo'],
        conserto: ['vai para a tabela jogo', 'sobra só o id_jogo aqui'],
        selo: 'parcial',
        seloC: '2FN',
        legenda:
          'Dependência PARCIAL: titulo_jogo depende só de metade da chave. O título do jogo não muda dependendo do empréstimo — então ele não é assunto desta tabela.',
        cap: 'Caminho da dependência parcial: a coluna sai de uma parte só da chave composta.',
        reg: { ator: 'voce', texto: 'titulo_jogo depende só de id_jogo', resultado: 'parcial · 2FN', marca: 'ruim' },
      },
      {
        col: 'nome_cliente',
        tipo: 'transitiva',
        marca: 'ruim',
        meio: 'id_cliente',
        de: ['id_emprestimo'],
        repete: ['"Ana Souza" três vezes', 'uma por linha dela'],
        conserto: ['vai para a tabela cliente', 'sobra só o id_cliente aqui'],
        selo: 'transitiva',
        seloC: '3FN',
        legenda:
          'Dependência TRANSITIVA: nome_cliente não sai da chave, sai de id_cliente — que por sua vez sai da chave. O nome pega carona, e é por isso que ele some na 3FN.',
        cap: 'Caminho da dependência transitiva: a coluna passa por uma coluna do meio antes de chegar na chave.',
        reg: { ator: 'voce', texto: 'nome_cliente depende de id_cliente, que depende da chave', resultado: 'transitiva · 3FN', marca: 'ruim' },
      },
    ];

    // Caixinha do diagrama. `.no` e a classe de caixa do padrao, com o <rect>
    // e o <text> dentro do mesmo <g>; a caixa apagada perde opacidade, para a
    // leitura ficar no caminho que esta sendo percorrido.
    function caixa(x, y, w, texto, apagada) {
      return '<g class="no"' + (apagada ? ' opacity="0.35"' : '') + '>' +
        '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="34" rx="6"/>' +
        '<text x="' + (x + w / 2) + '" y="' + (y + 22) + '">' + texto + '</text></g>';
    }
    // Trilho sempre visivel mais pulso correndo por cima: e FLUXO, nao
    // desenhar-e-apagar. O que a demo mostra e a dependencia PERCORRENDO o
    // caminho, e por isso o pulso, e nao um traco piscando.
    function seta(x1, y1, x2, y2) {
      var d = 'M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2;
      return '<path class="elo-trilho" d="' + d + '"/>' +
        '<path class="elo-fluxo" pathLength="1" d="' + d + '"/>';
    }

    function desenhar() {
      var c = CASOS[atual];
      var svg = $('a8-caminho');
      var fig = svg.closest('.diagrama');
      var partes = [];

      // a chave, sempre a esquerda
      partes.push(caixa(10, 20, 160, 'id_emprestimo', c.de.indexOf('id_emprestimo') === -1));
      partes.push(caixa(10, 96, 160, 'id_jogo', c.de.indexOf('id_jogo') === -1));
      partes.push('<text class="rotulo" x="90" y="80">a chave composta</text>');

      // a coluna, sempre a direita
      partes.push(caixa(520, 58, 170, c.col, false));

      if (c.meio) {
        partes.push(caixa(270, 58, 160, c.meio, false));
        partes.push(seta(170, 37, 270, 72));
        partes.push(seta(430, 75, 520, 75));
      } else {
        c.de.forEach(function (d) {
          var y = d === 'id_emprestimo' ? 37 : 113;
          partes.push(seta(170, y, 520, 75));
        });
      }
      svg.innerHTML = partes.join('\n');
      $('a8-caminho-cap').textContent = c.cap;

      // Sem o reflow entre remover e acrescentar, o navegador funde as duas
      // mudancas e a animacao nao reinicia: o pulso ficaria no meio do ciclo
      // anterior, e o aluno veria o caminho novo com o movimento velho.
      if (fig) {
        fig.classList.remove('ativo');
        void fig.offsetWidth;
        fig.classList.add('ativo');
      }

      var v = $('a8-vilao'), k = $('a8-conserto');
      v.textContent = ''; k.textContent = '';
      c.repete.forEach(function (t, i) { v.appendChild(linha(t, i === 0 ? 'na tabela' : '', c.marca === 'ruim' ? 'velha' : 'entrou')); });
      c.conserto.forEach(function (t, i) { k.appendChild(linha(t, i === 0 ? 'conserto' : '', 'entrou')); });

      $('a8-selo-vilao').textContent = c.selo;
      $('a8-selo-conserto').textContent = c.seloC;
      $('a8-painel-vilao').classList.toggle('ruim', c.marca === 'ruim');
      $('a8-painel-vilao').classList.toggle('bom', c.marca !== 'ruim');
      $('a8-vilao-legenda').textContent = c.legenda;

      log.escrever(CASOS.slice(0, atual + 1).map(function (q, i) {
        return { hora: 'caso ' + (i + 1), ator: q.reg.ator, texto: q.reg.texto, resultado: q.reg.resultado, marca: q.reg.marca };
      }));

      // No ultimo caso o botao ficaria clicavel sem mudar nada na tela.
      passo.disabled = atual === CASOS.length - 1;
    }

    passo.addEventListener('click', function () {
      if (atual < CASOS.length - 1) atual += 1;
      desenhar();
    });
    $('a8-vilao-zerar').addEventListener('click', function () { atual = 0; desenhar(); });
    desenhar();
  })();
})(window.DemoKit);
