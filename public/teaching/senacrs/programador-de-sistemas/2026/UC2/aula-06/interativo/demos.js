/* demos.js — as demonstracoes da Aula 06.
 *
 * O slide "o problema que ficou de ontem" pede, na nota de orador, que a turma
 * TENTE as duas primeiras opcoes e sinta que nao cabem. No quadro isso depende
 * de o docente segurar a resposta; aqui o aluno tenta sozinho, quantas vezes
 * quiser, e a tabela mostra o que se perde.
 *
 * As tres demos cobrem o Bloco 2: o N:N, o nome da entidade do meio e o
 * autorrelacionamento.
 */
(function (kit) {
  'use strict';

  var $ = kit.$;
  var el = kit.el;
  var linha = kit.linha;
  var novoLog = kit.novoLog;
  var escolhas = kit.escolhas;

  /* ================= 1. onde mora a data da retirada ================= */
  //
  // Ana levou dois jogos em dias diferentes; Elden Ring saiu com duas pessoas
  // em dias diferentes. Qualquer lado que receba a coluna guarda UMA data — e
  // a pergunta do balcao fica sem resposta. E o mesmo fato da Aula 01 (um dado
  // no lugar errado vira dado errado), agora pela cardinalidade.

  (function () {
    var log = novoLog('a6-log');

    var HISTORIA = [
      { hora: '02/10', ator: 'ana', texto: 'levou Elden Ring' },
      { hora: '05/10', ator: 'ana', texto: 'levou Hades' },
      { hora: '05/10', ator: 'bruno', texto: 'levou Elden Ring' },
    ];

    var CASOS = [
      {
        id: 'cliente',
        nome: 'uma coluna em CLIENTE',
        titE: 'cliente',
        seloE: 'coluna data_retirada',
        marcaE: 'ruim',
        linhasE: [
          ['#1 Ana', '02/10 → 05/10'],
          ['#2 Bruno', '05/10'],
          ['#3 Carla', '—'],
        ],
        perdidaE: 0,
        titD: 'a pergunta do balcão',
        seloD: 'sem resposta',
        marcaD: 'ruim',
        linhasD: [
          ['Quando a Ana levou o Hades?', '05/10'],
          ['Quando a Ana levou Elden Ring?', 'perdido'],
        ],
        perdidaD: 1,
        legenda:
          'A Ana tem uma linha só, e a linha tem uma data só. Quando ela levou o segundo jogo, a data do primeiro foi por cima. A coluna não está errada de digitação: ela não tem onde caber.',
        veredito: { ator: 'banco', texto: 'a segunda retirada apagou a data da primeira', marca: 'ruim' },
      },
      {
        id: 'jogo',
        nome: 'uma coluna em JOGO',
        titE: 'jogo',
        seloE: 'coluna data_retirada',
        marcaE: 'ruim',
        linhasE: [
          ['#10 Elden Ring', '02/10 → 05/10'],
          ['#20 Hades', '05/10'],
          ['#30 Celeste', '—'],
        ],
        perdidaE: 0,
        titD: 'a pergunta do balcão',
        seloD: 'sem resposta',
        marcaD: 'ruim',
        linhasD: [
          ['Quando o Bruno levou Elden Ring?', '05/10'],
          ['Quando a Ana levou Elden Ring?', 'perdido'],
        ],
        perdidaD: 1,
        legenda:
          'Trocar de lado não resolve: agora é Elden Ring que tem uma data só, e ele saiu com duas pessoas. O problema não é o lado escolhido — é que a data não pertence a nenhum dos dois.',
        veredito: { ator: 'banco', texto: 'o mesmo jogo saiu duas vezes, e cabe uma data', marca: 'ruim' },
      },
      {
        id: 'meio',
        nome: 'uma entidade no meio',
        titE: 'emprestimo',
        seloE: '3 linhas',
        marcaE: 'bom',
        linhasE: [
          ['#1 · cliente 1 · jogo 10', '02/10'],
          ['#2 · cliente 1 · jogo 20', '05/10'],
          ['#3 · cliente 2 · jogo 10', '05/10'],
        ],
        perdidaE: -1,
        titD: 'a pergunta do balcão',
        seloD: 'as três respondidas',
        marcaD: 'bom',
        linhasD: [
          ['Quando a Ana levou Elden Ring?', '02/10'],
          ['Quando a Ana levou o Hades?', '05/10'],
          ['Quando o Bruno levou Elden Ring?', '05/10'],
        ],
        perdidaD: -1,
        legenda:
          'A data mora no ENCONTRO entre o cliente e o jogo — e cada encontro é uma linha. O N:N sumiu: sobraram dois 1:N, um cliente para vários empréstimos e um jogo para vários empréstimos.',
        veredito: { ator: 'banco', texto: 'nenhuma retirada se perdeu, e cabem quantas vierem', marca: 'bom' },
      },
    ];

    function preencher(idCorpo, linhas, perdida) {
      var alvo = $(idCorpo);
      alvo.textContent = '';
      linhas.forEach(function (l, i) {
        alvo.appendChild(linha(l[0], l[1], i === perdida ? 'sumiu' : ''));
      });
    }

    function marcar(idPainel, idSelo, texto, marca) {
      $(idSelo).textContent = texto;
      $(idSelo).className = 'selo ' + marca;
      $(idPainel).className = 'painel ' + marca;
    }

    escolhas('a6-tentativas', CASOS, function (c) {
      $('a6-tit-e').textContent = c.titE;
      $('a6-tit-d').textContent = c.titD;
      preencher('a6-corpo-e', c.linhasE, c.perdidaE);
      preencher('a6-corpo-d', c.linhasD, c.perdidaD);
      marcar('a6-painel-e', 'a6-selo-e', c.seloE, c.marcaE);
      marcar('a6-painel-d', 'a6-selo-d', c.seloD, c.marcaD);
      $('a6-legenda').textContent = c.legenda;

      log.escrever(HISTORIA.concat([
        { hora: 'hoje', ator: c.veredito.ator, texto: c.veredito.texto, marca: c.veredito.marca },
      ]));
    });
  })();

  /* ================= 2. o nome da entidade do meio ================= */
  //
  // A tabela do slide diz o que preferir. O que ela nao mostra e o PRECO do
  // nome colado, que so aparece quando um SEGUNDO relacionamento liga os
  // mesmos dois lados — e a locadora vai ter reservas. Ai `cliente_jogo` nao
  // tem como se chamar de outro jeito, porque o nome descreve os lados, nao o
  // que aconteceu.

  (function () {
    var log = novoLog('a6-nome-log');

    var NOMES = [
      {
        id: 'colado',
        nome: 'CLIENTE_JOGO',
        tab: 'cliente_jogo',
        selo: 'descreve os lados',
        usos: [
          'cliente_jogo (id*, id_cliente CE/FK, id_jogo CE/FK, data_retirada)',
          'CREATE TABLE cliente_jogo (\n  id_cliente_jogo SERIAL PRIMARY KEY,\n  ...\n);',
          'SELECT * FROM cliente_jogo\n WHERE data_retirada > \'2026-10-01\';',
        ],
        reserva: [
          ['a tabela do empréstimo', 'cliente_jogo'],
          ['a tabela da reserva', 'cliente_jogo_2 ?'],
        ],
        perdida: 1,
        seloR: 'nome ocupado',
        marcaR: 'ruim',
        legenda:
          'A reserva também liga um cliente a um jogo. Como o nome descreve os LADOS e não o acontecimento, ele já está gasto — e a segunda tabela vira cliente_jogo_2, que não diz nada a quem abrir o banco na Aula 18.',
        veredito: { texto: 'duas coisas diferentes disputam o mesmo nome', marca: 'ruim' },
      },
      {
        id: 'generico',
        nome: 'LIGACAO',
        tab: 'ligacao',
        selo: 'não diz o que é',
        usos: [
          'ligacao (id*, id_cliente CE/FK, id_jogo CE/FK, data_retirada)',
          'CREATE TABLE ligacao (\n  id_ligacao SERIAL PRIMARY KEY,\n  ...\n);',
          'SELECT * FROM ligacao\n WHERE data_retirada > \'2026-10-01\';',
        ],
        reserva: [
          ['a tabela do empréstimo', 'ligacao'],
          ['a tabela da reserva', 'ligacao_2 ?'],
        ],
        perdida: 1,
        seloR: 'nome ocupado',
        marcaR: 'ruim',
        legenda:
          'Pior que o colado: ligacao serve para qualquer N:N do banco. Leia a consulta do meio em voz alta — “selecione tudo de ligação onde a data da retirada” não conta que negócio é esse.',
        veredito: { texto: 'o nome cabe em tudo, então não identifica nada', marca: 'ruim' },
      },
      {
        id: 'evento',
        nome: 'EMPRESTIMO',
        tab: 'emprestimo',
        selo: 'nomeia o acontecimento',
        usos: [
          'emprestimo (id*, id_cliente CE/FK, id_jogo CE/FK, data_retirada)',
          'CREATE TABLE emprestimo (\n  id_emprestimo SERIAL PRIMARY KEY,\n  ...\n);',
          'SELECT * FROM emprestimo\n WHERE data_retirada > \'2026-10-01\';',
        ],
        reserva: [
          ['a tabela do empréstimo', 'emprestimo'],
          ['a tabela da reserva', 'reserva'],
        ],
        perdida: -1,
        seloR: 'dois nomes livres',
        marcaR: 'bom',
        legenda:
          'A entidade do meio é quase sempre o EVENTO — a mesma heurística “pessoa, coisa, evento” da Aula 03. Nomear o acontecimento deixa espaço para os outros acontecimentos que ainda vão aparecer.',
        veredito: { texto: 'cada acontecimento tem o próprio nome', marca: 'bom' },
      },
    ];

    var QUANDO = [
      { hora: 'Aula 07', ator: 'voce', rotulo: 'escreve na lista de tabelas' },
      { hora: 'Aula 11', ator: 'voce', rotulo: 'digita no CREATE TABLE' },
      { hora: 'Aula 14', ator: 'banco', rotulo: 'lê na junção, e você lê em voz alta' },
    ];

    escolhas('a6-nomes', NOMES, function (n) {
      $('a6-nome-selo').textContent = n.selo;

      var usos = $('a6-nome-usos');
      usos.textContent = '';
      n.usos.forEach(function (texto) {
        var bloco = el('pre', 'consulta');
        bloco.appendChild(el('code', null, texto));
        usos.appendChild(bloco);
      });

      var r = $('a6-nome-reserva');
      r.textContent = '';
      n.reserva.forEach(function (l, i) {
        r.appendChild(linha(l[0], l[1], i === n.perdida ? 'sumiu' : ''));
      });
      $('a6-nome-selo-r').textContent = n.seloR;
      $('a6-nome-selo-r').className = 'selo ' + n.marcaR;
      $('a6-nome-painel-r').className = 'painel ' + n.marcaR;

      $('a6-nome-legenda').textContent = n.legenda;

      log.escrever(QUANDO.map(function (q) {
        return { hora: q.hora, ator: q.ator, texto: q.rotulo + ': ' + n.tab };
      }).concat([
        { hora: 'depois', ator: 'banco', texto: n.veredito.texto, marca: n.veredito.marca },
      ]));
    });
  })();

  /* ================= 3. a caixa que se liga nela mesma ================= */
  //
  // A nota de orador diz que o autorrelacionamento "e estranho e e legal". O
  // estranho passa quando se ve a alternativa: a entidade DLC separada copia
  // quase todas as colunas de JOGO, e quebra de vez no dia em que a DLC e
  // alugada — porque ai ela e um jogo.

  (function () {
    var passo = $('a6-auto-passo');
    if (!passo) return;

    var log = novoLog('a6-auto-log');
    var atual = 0;

    var PASSOS = [
      {
        forma: 'duas',
        rotulo: 'JOGO 1 —— N DLC',
        cap: 'A primeira ideia: uma entidade DLC, ligada a JOGO.',
        tit: 'as colunas que a tabela DLC precisa ter',
        selo: '5 colunas',
        marcaSelo: '',
        colunas: [
          { nome: 'id_dlc', marca: 'novo' },
          { nome: 'titulo', marca: 'velho' },
          { nome: 'preco', marca: 'velho' },
          { nome: 'genero', marca: 'velho' },
          { nome: 'id_jogo_base', marca: 'novo' },
        ],
        nota: 'Três das cinco já existem, iguais, em JOGO.',
        legenda:
          'Ainda parece razoável. Repare só que titulo, preco e genero acabaram de ser escritos duas vezes no mesmo banco — e a Aula 09 vai chamar isso pelo nome.',
        registro: { ator: 'voce', texto: 'criou a entidade DLC com 5 colunas', marca: '' },
      },
      {
        forma: 'duas',
        rotulo: 'a DLC também é alugada',
        cap: 'A DLC vai para o balcão: alguém quer alugar só ela.',
        tit: 'o que EMPRESTIMO precisa passar a guardar',
        selo: 'duas chaves possíveis',
        marcaSelo: 'ruim',
        colunas: [
          { nome: 'id_jogo', marca: 'velho' },
          { nome: 'id_dlc', marca: 'novo' },
          { nome: 'tipo?', marca: 'novo' },
        ],
        nota: 'Uma das duas chaves fica sempre vazia, e uma terceira coluna passa a dizer qual vale.',
        legenda:
          'Aqui a entidade separada começa a cobrar. Todo empréstimo passa a ter uma coluna em branco, e toda consulta da Aula 13 vai precisar perguntar antes de que tipo é a linha.',
        registro: { ator: 'banco', texto: 'cada emprestimo agora tem uma coluna vazia', marca: 'ruim' },
      },
      {
        forma: 'duas',
        rotulo: 'e a DLC da DLC?',
        cap: 'Shadow of the Erdtree ganha o próprio conteúdo extra.',
        tit: 'a entidade que a ideia exige agora',
        selo: 'uma terceira tabela',
        marcaSelo: 'ruim',
        colunas: [
          { nome: 'id_dlc_da_dlc', marca: 'novo' },
          { nome: 'titulo', marca: 'velho' },
          { nome: 'preco', marca: 'velho' },
          { nome: 'genero', marca: 'velho' },
          { nome: 'id_dlc_base', marca: 'novo' },
        ],
        nota: 'As mesmas colunas, pela terceira vez. E nada impede uma quarta.',
        legenda:
          'A ideia não tem fim: cada novo nível pede uma tabela nova, com as mesmas colunas. Quando a solução exige uma tabela por nível, é sinal de que os níveis não deviam ser tabelas diferentes.',
        registro: { ator: 'banco', texto: 'a terceira tabela repete as mesmas 3 colunas', marca: 'ruim' },
      },
      {
        forma: 'sozinha',
        rotulo: 'JOGO é DLC de JOGO',
        cap: 'Uma entidade só, com uma ligação que sai dela e volta para ela.',
        tit: 'as colunas de JOGO, agora',
        selo: '6 colunas, 1 nova',
        marcaSelo: 'bom',
        colunas: [
          { nome: 'id_jogo', marca: '' },
          { nome: 'titulo', marca: '' },
          { nome: 'preco', marca: '' },
          { nome: 'genero', marca: '' },
          { nome: 'id_plataforma', marca: '' },
          { nome: 'id_jogo_base', marca: 'novo' },
        ],
        nota: 'id_jogo_base é uma chave estrangeira para a própria tabela jogo — e fica vazia nos jogos que não são DLC.',
        legenda:
          'Uma DLC é um jogo: tem título, preço, plataforma, e é alugada como qualquer outro. O que ela tem a mais é um jogo do qual depende — e isso é uma coluna, não uma tabela. Quantos níveis quiser, sem tabela nova.',
        registro: { ator: 'banco', texto: 'uma coluna resolveu os três níveis', marca: 'bom' },
      },
    ];

    // Geometria das duas formas. Fica aqui, e nao no HTML, porque a demo TROCA
    // de forma: duas caixas com um losango entre elas, ou uma caixa so com a
    // ligacao voltando. Desenhar as duas no HTML e esconder uma deixaria o
    // aria-label do <svg> descrevendo algo que nao esta na tela.
    function desenhar(forma) {
      var lig = $('a6-auto-lig');
      var caixas = $('a6-auto-caixas');
      var losango = $('a6-auto-losango');
      lig.textContent = '';
      caixas.textContent = '';
      losango.textContent = '';

      function svg(tag, attrs, texto) {
        var e = document.createElementNS('http://www.w3.org/2000/svg', tag);
        Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
        if (texto != null) e.textContent = texto;
        return e;
      }

      if (forma === 'duas') {
        lig.appendChild(svg('line', { x1: 96, y1: 52, x2: 140, y2: 52 }));
        lig.appendChild(svg('line', { x1: 220, y1: 52, x2: 264, y2: 52 }));
        caixas.appendChild(svg('rect', { x: 14, y: 34, width: 82, height: 36, rx: 3 }));
        caixas.appendChild(svg('text', { x: 55, y: 56 }, 'JOGO'));
        caixas.appendChild(svg('rect', { x: 264, y: 34, width: 82, height: 36, rx: 3 }));
        caixas.appendChild(svg('text', { x: 305, y: 56 }, 'DLC'));
        losango.appendChild(svg('polygon', { points: '180,26 226,52 180,78 134,52' }));
        losango.appendChild(svg('text', { x: 180, y: 56 }, 'AMPLIA'));
      } else {
        caixas.appendChild(svg('rect', { x: 139, y: 34, width: 82, height: 36, rx: 3 }));
        caixas.appendChild(svg('text', { x: 180, y: 56 }, 'JOGO'));
        // A curva sai da direita da caixa e volta pela mesma lateral. O apice
        // dela fica em x=295, y=54 (bezier em t=0,5) — e e ali que o losango
        // precisa ficar centrado, porque em DER o relacionamento se desenha
        // SOBRE a linha. Centrado fora do apice, sobrava um pedaco de traco
        // apontando para o nada.
        lig.appendChild(svg('path', { d: 'M221 40 C 320 12, 320 96, 221 66' }));
        losango.appendChild(svg('polygon', { points: '295,26 337,53 295,80 253,53' }));
        losango.appendChild(svg('text', { x: 295, y: 57 }, 'AMPLIA'));
      }
      $('a6-auto-svg').setAttribute(
        'aria-label',
        forma === 'duas'
          ? 'Duas caixas, JOGO e DLC, ligadas por um relacionamento AMPLIA.'
          : 'Uma caixa JOGO, com uma ligação que sai dela e volta para ela mesma pelo relacionamento AMPLIA.'
      );
    }

    function mostrar() {
      var p = PASSOS[atual];
      desenhar(p.forma);
      $('a6-auto-rotulo').textContent = p.rotulo;
      $('a6-auto-cap').textContent = p.cap;
      $('a6-auto-tit').textContent = p.tit;
      $('a6-auto-selo').textContent = p.selo;
      $('a6-auto-selo').className = 'selo ' + p.marcaSelo;
      $('a6-auto-nota').textContent = p.nota;
      $('a6-auto-legenda').textContent = p.legenda;

      var cols = $('a6-auto-colunas');
      cols.textContent = '';
      p.colunas.forEach(function (c) {
        cols.appendChild(el('div', 'chip' + (c.marca ? ' ' + c.marca : ''), c.nome));
      });

      log.escrever(PASSOS.slice(0, atual + 1).map(function (q, i) {
        return { hora: 'passo ' + (i + 1), ator: q.registro.ator, texto: q.registro.texto, marca: q.registro.marca };
      }));

      // No ultimo passo o botao ficaria clicavel sem ter o que fazer. Desabilitar
      // diz que acabou; some o clique que nao muda nada na tela.
      passo.disabled = atual === PASSOS.length - 1;
      passo.textContent = passo.disabled ? 'Fim do caminho' : 'Próximo passo';
    }

    passo.addEventListener('click', function () {
      if (atual < PASSOS.length - 1) atual += 1;
      mostrar();
    });
    $('a6-auto-zerar').addEventListener('click', function () {
      atual = 0;
      mostrar();
    });

    // A demo abre no primeiro passo, com colunas e registro ja preenchidos:
    // a secao nao pode comecar com um painel oco e um diagrama vazio.
    mostrar();
  })();
})(window.DemoKit);
