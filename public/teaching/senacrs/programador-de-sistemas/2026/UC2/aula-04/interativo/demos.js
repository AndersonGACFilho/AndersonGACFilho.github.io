/* demos.js — as demonstracoes da Aula 04.
 *
 * O eixo da aula e o atributo multivalorado: a frase "atributo que aceita
 * varios valores quase sempre e uma entidade esperando para nascer" volta
 * inteira na Aula 09. Aqui ela deixa de ser frase e vira uma busca que falha.
 */
(function (kit) {
  'use strict';

  var $ = kit.$;
  var el = kit.el;
  var linha = kit.linha;
  var novoLog = kit.novoLog;

  /* ================= 1. o cliente tem dois telefones ================= */
  //
  // As tres tentativas do slide, lado a lado, com a MESMA busca rodando nas
  // tres. A primeira nao acha, a segunda acha mas nao aguenta o terceiro
  // numero, a terceira aguenta qualquer quantidade. Ver a mesma busca falhar
  // e passar e o argumento inteiro.

  (function () {
    var busca = $('a4-busca');
    if (!busca) return;

    var TEL = ['99999-1111', '98888-2222'];
    var terceiro = false;
    var palco = $('a4-tentativas');

    function nums() {
      return terceiro ? TEL.concat(['97777-3333']) : TEL.slice();
    }

    function tentativas() {
      var t = nums();
      return [
        {
          nome: 'tudo num campo só',
          forma: 'cliente.telefones',
          linhas: [['telefones', t.join(' / ')]],
          // achar um pedaco de string nao e achar um telefone: '999' casa no
          // meio de outro numero, e o selo tem de dizer isso
          acha: function (q) { return t.join(' / ').indexOf(q) !== -1 ? { rotulo: 'casou no texto', bom: false } : null; },
          cabe: true,
          nota: 'O banco vê uma string. Não dá para saber qual é o celular, nem contar quantos são, nem validar um deles.',
        },
        {
          nome: 'uma coluna por telefone',
          forma: 'cliente.telefone1, telefone2',
          linhas: [['telefone1', t[0]], ['telefone2', t[1] || '(vazio)']].concat(
            terceiro ? [['telefone3', '??? não existe']] : []
          ),
          acha: function (q) { return t.slice(0, 2).indexOf(q) !== -1 ? { rotulo: 'achou, em 2 colunas', bom: false } : null; },
          cabe: !terceiro,
          nota: terceiro
            ? 'Chegou o terceiro e não há coluna. Ou se cria telefone3 agora — e telefone4 no mês que vem —, ou o número se perde.'
            : 'Funciona com dois. Quem tem um só deixa uma coluna vazia; quem tem três não cabe.',
        },
        {
          nome: 'uma entidade TELEFONE',
          forma: 'telefone(cliente_id, numero)',
          linhas: t.map(function (n, i) { return ['linha ' + (i + 1), n]; }),
          acha: function (q) { return t.indexOf(q) !== -1 ? { rotulo: 'achou a linha', bom: true } : null; },
          cabe: true,
          nota: 'Cada número é uma linha. Um, dois ou dez: a estrutura não muda, e dá para marcar qual é o celular.',
        },
      ];
    }

    function desenhar() {
      var q = busca.value.trim();
      palco.textContent = '';
      var lista = tentativas();
      lista.forEach(function (t) {
        var p = el('div', 'painel' + (t.cabe ? '' : ' ruim'));
        var h = el('h3');
        h.appendChild(el('span', null, t.nome));
        var achou = q ? t.acha(q) : null;
        var classe = !q ? '' : !achou ? ' ruim' : achou.bom ? ' bom' : '';
        var rotulo = !q ? t.forma : !achou ? 'não achou' : achou.rotulo;
        var s = el('span', 'selo' + classe, rotulo);
        h.appendChild(s);
        p.appendChild(h);
        t.linhas.forEach(function (l) {
          var marca = '';
          if (q && l[1].indexOf(q) !== -1) marca = 'achou';
          if (String(l[1]).indexOf('???') === 0) marca = 'sumiu';
          p.appendChild(linha(l[0], l[1], marca));
        });
        p.appendChild(el('p', 'vazio-painel', t.nota));
        palco.appendChild(p);
      });

      $('a4-legenda').textContent = terceiro
        ? 'Só a terceira aguentou o terceiro número sem mudar de forma. É essa a diferença entre um campo e uma entidade.'
        : q
          ? 'A mesma busca nas três, e "achou" não significa a mesma coisa. Procure só por 999 e veja o primeiro casar onde não devia.'
          : 'Digite um telefone para procurar nas três.';
      $('a4-terceiro').disabled = terceiro;
    }

    busca.addEventListener('input', desenhar);
    $('a4-terceiro').addEventListener('click', function () { terceiro = true; desenhar(); });
    $('a4-zerar').addEventListener('click', function () { terceiro = false; busca.value = '98888-2222'; desenhar(); });
    desenhar();
  })();

  /* ================= 2. numero que nao e numero ================= */

  (function () {
    var caixa = $('a4-tipos');
    if (!caixa) return;

    var ENTRADA = [
      ['cpf', '01234567890'],
      ['telefone', '(51) 99999-1111'],
      ['cep', '90010-150'],
    ];

    var TIPOS = [
      {
        id: 'integer',
        nome: 'INTEGER',
        ok: false,
        saida: [['cpf', '1234567890'], ['telefone', 'recusado'], ['cep', 'recusado']],
        selo: 'perdeu dado',
        legenda:
          'O zero da frente sumiu — para o banco 01234567890 e 1234567890 são o mesmo número, e ele guardou o número. O telefone e o CEP nem entraram: parênteses e hífen não são dígitos. Nenhum dos três é número: ninguém soma CPF.',
      },
      {
        id: 'varchar',
        nome: 'VARCHAR(14)',
        ok: true,
        saida: [['cpf', '01234567890'], ['telefone', '(51) 99999-1111'], ['cep', '90010-150']],
        selo: 'intacto',
        legenda:
          'Texto guarda o que você digitou, do jeito que digitou. A regra prática: se você nunca vai somar, multiplicar ou tirar média, é texto — mesmo que só tenha dígito.',
      },
      {
        id: 'numeric',
        nome: 'NUMERIC(6,2)',
        ok: false,
        saida: [['cpf', 'estouro'], ['telefone', 'recusado'], ['cep', 'recusado']],
        selo: 'não cabe',
        legenda:
          'NUMERIC(6,2) guarda até 9999,99 — quatro casas antes da vírgula. Serve para preço, não para documento. O tamanho faz parte do tipo, e escolher errado só aparece no dia em que o valor cresce.',
      },
    ];

    var botoes = [];

    function mostrar(t) {
      botoes.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.id === t.id ? 'true' : 'false'); });
      var e = $('a4-entrada');
      e.textContent = '';
      ENTRADA.forEach(function (par) { e.appendChild(linha(par[0], par[1])); });
      var s = $('a4-saida');
      s.textContent = '';
      t.saida.forEach(function (par, i) {
        var igual = par[1] === ENTRADA[i][1];
        s.appendChild(linha(par[0], par[1], igual ? 'entrou' : 'sumiu'));
      });
      $('a4-selo-saida').textContent = t.selo;
      $('a4-selo-saida').className = 'selo ' + (t.ok ? 'bom' : 'ruim');
      $('a4-painel-saida').classList.toggle('ruim', !t.ok);
      $('a4-painel-saida').classList.toggle('bom', t.ok);
      $('a4-tipo-legenda').textContent = t.legenda;
    }

    TIPOS.forEach(function (t) {
      var b = el('button', 'camada-btn');
      b.type = 'button';
      b.dataset.id = t.id;
      b.style.setProperty('--cor', 'var(--accent)');
      b.setAttribute('aria-pressed', 'false');
      b.appendChild(el('span', 'ponto'));
      b.appendChild(el('span', null, t.nome));
      b.addEventListener('click', function () { mostrar(t); });
      botoes.push(b);
      caixa.appendChild(b);
    });
    mostrar(TIPOS[0]);
  })();

  /* ================= 3. nulo nao e zero ================= */
  //
  // A confusao aparece no resultado de uma conta, nao na definicao. COUNT(*)
  // e COUNT(coluna) devolvendo numeros diferentes na mesma tabela ensina isso
  // em um segundo.

  (function () {
    var contar = $('a4-contar');
    if (!contar) return;

    var LINHAS = [
      ['#1001 Elden Ring', '4 dias'],
      ['#1002 Hollow Knight', '2 dias'],
      ['#1003 Baldurs Gate 3', 'NULL'],
    ];
    var log = novoLog('a4-nulo-log');

    function pintar(destaque) {
      var alvo = $('a4-tabela-nulo');
      alvo.textContent = '';
      LINHAS.forEach(function (l, i) {
        var nulo = l[1] === 'NULL';
        alvo.appendChild(linha(l[0], nulo ? 'NULL — ainda não voltou' : l[1], destaque === 'nulo' && nulo ? 'achou' : destaque === 'cheias' && !nulo ? 'achou' : ''));
      });
    }

    function responder(sql, resultado, texto, destaque, marca) {
      pintar(destaque);
      log.escrever([{ ator: 'banco', sql: true, texto: sql, resultado: resultado, marca: marca }]);
      $('a4-nulo-legenda').textContent = texto;
    }

    contar.addEventListener('click', function () {
      pintar('cheias');
      log.escrever([
        { ator: 'banco', sql: true, texto: 'SELECT COUNT(*) FROM emprestimo', resultado: '3' },
        { ator: 'banco', sql: true, texto: 'SELECT COUNT(dias) FROM emprestimo', resultado: '2', marca: 'perdeu' },
      ]);
      $('a4-nulo-legenda').textContent =
        'Mesma tabela, duas contagens diferentes. COUNT(*) conta linhas; COUNT(coluna) conta valores — e NULL não é valor. Se fosse zero, contaria.';
    });

    $('a4-media').addEventListener('click', function () {
      responder(
        'SELECT AVG(dias) FROM emprestimo',
        '3,0',
        'A média deu 3, não 2. O banco somou 4 e 2 e dividiu por 2, não por 3: ele ignorou a linha que não sabe. Se NULL valesse zero, a média seria 2 — e estaria errada, porque o empréstimo ainda está aberto.',
        'cheias',
        'perdeu'
      );
    });

    $('a4-abertos').addEventListener('click', function () {
      log.escrever([
        { ator: 'banco', sql: true, texto: 'SELECT * FROM emprestimo WHERE dias = NULL', resultado: '0 linhas', marca: 'perdeu' },
        { ator: 'banco', sql: true, texto: 'SELECT * FROM emprestimo WHERE dias IS NULL', resultado: '1 linha', marca: 'ganhou' },
      ]);
      pintar('nulo');
      $('a4-nulo-legenda').textContent =
        'O primeiro não devolve nada, e não dá erro. NULL não é igual a nada — nem a outro NULL. Para perguntar por ele existe IS NULL, e esquecer disso é o erro que mais custa depuração.';
    });

    pintar();
    log.escrever([], 'Rode uma das contas acima.');
  })();

  /* ================= 4. a notacao no desenho ================= */

  (function () {
    var caixa = $('a4-formas');
    if (!caixa) return;

    var NS = 'http://www.w3.org/2000/svg';
    var FORMAS = [
      {
        id: 'simples',
        nome: 'simples',
        legenda: 'Elipse comum: um valor, indivisível para o sistema. nome, ano, preço.',
        desenhar: function (g, l) {
          elipse(g, 70, 108, 52, 18, 'nome');
          elipse(g, 180, 118, 52, 18, 'cpf');
          elipse(g, 290, 108, 52, 18, 'ativo');
          liga(l, 160, 48, 70, 90); liga(l, 180, 48, 180, 100); liga(l, 200, 48, 290, 90);
        },
      },
      {
        id: 'composto',
        nome: 'composto',
        legenda: 'Elipse que se abre em outras: endereço é um nome de conjunto. Guarde as partes, não o todo — buscar por cidade exige a cidade separada.',
        desenhar: function (g, l) {
          elipse(g, 180, 78, 58, 17, 'endereço');
          elipse(g, 66, 126, 46, 16, 'rua');
          elipse(g, 180, 132, 46, 16, 'cidade');
          elipse(g, 294, 126, 40, 16, 'cep');
          liga(l, 180, 48, 180, 61); liga(l, 150, 88, 80, 112); liga(l, 180, 95, 180, 116); liga(l, 210, 88, 282, 112);
        },
      },
      {
        id: 'multivalorado',
        nome: 'multivalorado',
        legenda: 'Elipse dupla: aceita vários valores. Quase sempre é uma entidade esperando para nascer — e vira uma, na Aula 09.',
        desenhar: function (g, l) {
          elipse(g, 180, 108, 58, 20, '', true);
          elipse(g, 180, 108, 50, 15, 'telefone');
          liga(l, 180, 48, 180, 88);
        },
      },
      {
        id: 'derivado',
        nome: 'derivado',
        legenda: 'Elipse tracejada: dá para calcular a partir de outro. Idade sai da data de nascimento — guardar as duas é garantir que um dia elas discordem.',
        desenhar: function (g, l) {
          elipse(g, 96, 112, 62, 18, 'nascimento');
          elipse(g, 262, 112, 46, 18, 'idade', false, true);
          liga(l, 160, 48, 96, 94); liga(l, 200, 48, 262, 94);
        },
      },
    ];

    function elipse(g, cx, cy, rx, ry, texto, dupla, tracejada) {
      var e = document.createElementNS(NS, 'ellipse');
      e.setAttribute('cx', cx); e.setAttribute('cy', cy);
      e.setAttribute('rx', rx); e.setAttribute('ry', ry);
      e.setAttribute('class', 'atr' + (dupla ? ' fora' : '') + (tracejada ? ' derivado' : ''));
      g.appendChild(e);
      if (!texto) return;
      var t = document.createElementNS(NS, 'text');
      t.setAttribute('x', cx); t.setAttribute('y', cy + 4);
      t.setAttribute('class', 'atr-nome');
      t.textContent = texto;
      g.appendChild(t);
    }

    function liga(l, x1, y1, x2, y2) {
      var n = document.createElementNS(NS, 'line');
      n.setAttribute('x1', x1); n.setAttribute('y1', y1);
      n.setAttribute('x2', x2); n.setAttribute('y2', y2);
      l.appendChild(n);
    }

    var botoes = [];

    function mostrar(f) {
      botoes.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.id === f.id ? 'true' : 'false'); });
      var g = $('a4-atributos');
      var l = $('a4-ligacoes');
      g.textContent = '';
      l.textContent = '';
      f.desenhar(g, l);
      $('a4-forma-legenda').textContent = f.legenda;
    }

    FORMAS.forEach(function (f) {
      var b = el('button', 'camada-btn');
      b.type = 'button';
      b.dataset.id = f.id;
      b.style.setProperty('--cor', 'var(--accent)');
      b.setAttribute('aria-pressed', 'false');
      b.appendChild(el('span', 'ponto'));
      b.appendChild(el('span', null, f.nome));
      b.addEventListener('click', function () { mostrar(f); });
      botoes.push(b);
      caixa.appendChild(b);
    });
    mostrar(FORMAS[0]);
  })();
})(window.DemoKit);
