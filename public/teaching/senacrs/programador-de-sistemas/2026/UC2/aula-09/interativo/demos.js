/* demos.js — Aula 09: 1FN, 2FN e 3FN aplicadas.
 *
 * A Aula 08 nomeou os defeitos; esta conserta. Por isso as duas demonstrações
 * EXECUTAM o conserto em vez de descrevê-lo: na primeira a busca erra de
 * verdade contra a célula com dois valores, e na segunda cada coluna sai da
 * tabela do meio e aparece na tabela nova, uma forma normal por clique.
 */
(function (K) {
  'use strict';
  var $ = K.$, el = K.el, linha = K.linha, novoLog = K.novoLog, escolhas = K.escolhas;

  /* ================= 1. a célula com dois valores ================= */
  //
  // O argumento da 1FN nao e estetico. A celula com lista quebra a BUSCA, e e
  // isso que a demo mostra: a igualdade nao acha, e o LIKE acha o que nao
  // devia. Dizer "viola a 1FN" nao convence ninguem; ver o telefone certo nao
  // aparecer, sim.

  (function () {
    var caixa = $('a9-buscas');
    if (!caixa) return;

    var log = novoLog('a9-log');

    // Os dois telefones da Ana moram na MESMA celula. O 2222 do Bruno existe
    // de proposito: e ele que o LIKE '%2222%' pesca por engano, e sem esse
    // vizinho a busca por pedaco pareceria funcionar.
    var FORA = [
      { nome: 'Ana Souza', tels: '98888-2222, 99999-1111' },
      { nome: 'Bruno Lima', tels: '97777-2222' },
      { nome: 'Diego Rocha', tels: '96666-3333' },
    ];
    var DENTRO = [
      { nome: 'Ana Souza', tel: '98888-2222' },
      { nome: 'Ana Souza', tel: '99999-1111' },
      { nome: 'Bruno Lima', tel: '97777-2222' },
      { nome: 'Diego Rocha', tel: '96666-3333' },
    ];

    var ALVO = '98888-2222';

    var BUSCAS = [
      {
        id: 'igual',
        nome: "WHERE telefone = '98888-2222'",
        sqlFora: "SELECT nome FROM cliente\n WHERE telefones = '98888-2222';",
        sqlDentro: "SELECT nome FROM telefone\n WHERE numero = '98888-2222';",
        achaFora: function (l) { return l.tels === ALVO; },
        achaDentro: function (l) { return l.tel === ALVO; },
        legenda:
          'A igualdade não acha a Ana: o que está guardado na célula dela é a string inteira, ' +
          '"98888-2222, 99999-1111", e ela não é igual ao telefone procurado. Na tabela da direita acha de primeira.',
      },
      {
        id: 'like',
        nome: "WHERE telefone LIKE '%2222%'",
        sqlFora: "SELECT nome FROM cliente\n WHERE telefones LIKE '%2222%';",
        sqlDentro: "SELECT nome FROM telefone\n WHERE numero LIKE '%2222%';",
        achaFora: function (l) { return l.tels.indexOf('2222') !== -1; },
        achaDentro: function (l) { return l.tel.indexOf('2222') !== -1; },
        legenda:
          'Repare que o LIKE erra nos DOIS lados: ele traz o Bruno junto, que tem outro telefone terminado ' +
          'em 2222. A diferença é que na tabela da direita você nunca precisaria do LIKE — a igualdade já ' +
          'resolve. Na da esquerda ele é a única saída, e a única saída é a que traz resultado errado.',
      },
      {
        id: 'contar',
        nome: 'Quantos telefones existem?',
        sqlFora: 'SELECT count(*) FROM cliente;',
        sqlDentro: 'SELECT count(*) FROM telefone;',
        contar: true,
        legenda:
          'Contar telefones vira contar linhas de cliente, que é outra coisa: a tabela da esquerda responde 3 ' +
          'para uma locadora que tem 4 telefones. Dentro da 1FN a conta é a pergunta.',
      },
    ];

    escolhas('a9-buscas', BUSCAS, function (b) {
      var fora = $('a9-fora'), dentro = $('a9-dentro');
      fora.textContent = ''; dentro.textContent = '';

      var achouFora = [], achouDentro = [];

      FORA.forEach(function (l) {
        var acha = !b.contar && b.achaFora(l);
        if (acha) achouFora.push(l.nome);
        fora.appendChild(linha(l.nome, l.tels, acha ? 'achou' : ''));
      });
      DENTRO.forEach(function (l) {
        var acha = !b.contar && b.achaDentro(l);
        if (acha) achouDentro.push(l.nome);
        dentro.appendChild(linha(l.nome, l.tel, acha ? 'achou' : ''));
      });

      // O certo e sempre: so a Ana, e so ela. O selo diz o que cada lado
      // devolveu, e o painel fica bom ou ruim comparado com isso.
      var certoFora, certoDentro, resFora, resDentro;
      if (b.contar) {
        resFora = FORA.length + ' linhas';
        resDentro = DENTRO.length + ' linhas';
        certoFora = false;
        certoDentro = true;
        $('a9-selo-fora').textContent = '3 — errado';
        $('a9-selo-dentro').textContent = '4 — certo';
      } else {
        resFora = achouFora.length ? achouFora.join(', ') : 'nenhuma linha';
        resDentro = achouDentro.length ? achouDentro.join(', ') : 'nenhuma linha';
        certoFora = achouFora.length === 1 && achouFora[0] === 'Ana Souza';
        certoDentro = achouDentro.length === 1 && achouDentro[0] === 'Ana Souza';
        $('a9-selo-fora').textContent = resFora;
        $('a9-selo-dentro').textContent = resDentro;
      }

      $('a9-painel-fora').classList.toggle('bom', certoFora);
      $('a9-painel-fora').classList.toggle('ruim', !certoFora);
      $('a9-painel-dentro').classList.toggle('bom', certoDentro);
      $('a9-painel-dentro').classList.toggle('ruim', !certoDentro);

      $('a9-legenda').textContent = b.legenda;

      log.comparar(
        [
          { ator: 'planilha', marca: certoFora ? '' : 'ruim',
            linhas: [{ sql: true, texto: b.sqlFora, resultado: resFora }] },
          { ator: 'banco', marca: certoDentro ? '' : 'ruim',
            linhas: [{ sql: true, texto: b.sqlDentro, resultado: resDentro }] },
        ],
        certoFora
          ? { texto: 'Desta vez as duas acertaram — e é por isso que o defeito demora a aparecer.' }
          : certoDentro
            ? { texto: 'Mesma pergunta, respostas diferentes. A 1FN não é capricho: é o que faz a busca ser confiável.', marca: 'ruim' }
            // Os dois lados erram no LIKE, e o veredito tem de dizer isso. Creditar
            // a 1FN um defeito que e do LIKE ensinaria a coisa errada — e o aluno
            // confere na tela, porque os dois paineis ficam vermelhos.
            : { texto: 'Aqui os dois erram, e é esse o ponto: fora da 1FN o LIKE é a única ferramenta possível, e ele é impreciso por natureza.', marca: 'ruim' }
      );
    });
  })();

  /* ================= 2. as três formas, uma por clique ================= */
  //
  // O fluxograma da normalizacao EXECUTADO. A cada passo a coluna some do
  // painel da esquerda e aparece no da direita, dentro da tabela que nasceu.
  // O slide mostra o fluxo; aqui o aluno ve a coluna se mover.

  (function () {
    var passo = $('a9-fn-passo');
    if (!passo) return;

    var log = novoLog('a9-fn-log');
    var atual = 0;

    // A tabela do crime da Aula 08, mais `generos` — uma celula com lista, que
    // e o que da assunto para a 1FN. Sem ela a demo comecaria na 2FN e a
    // primeira forma viraria texto.
    var COLUNAS = [
      { nome: 'id_emprestimo', papel: 'chave' },
      { nome: 'id_jogo', papel: 'chave' },
      { nome: 'preco_pago', papel: 'total' },
      { nome: 'generos', papel: '1fn' },
      { nome: 'titulo_jogo', papel: '2fn' },
      { nome: 'nome_cliente', papel: '3fn' },
      { nome: 'id_cliente', papel: '3fn-fica' },
    ];

    var PASSOS = [
      {
        nome: '1FN',
        tira: ['generos'],
        nasce: { tabela: 'jogo_genero', campos: ['id_jogo', 'genero'], nota: 'uma linha por gênero' },
        legenda:
          '1FN: a célula “Ação, Aventura” virou duas linhas numa tabela própria. Agora dá para perguntar ' +
          'quais jogos são de aventura sem adivinhar onde a vírgula separa.',
        reg: { ator: 'ddl', texto: 'CREATE TABLE jogo_genero (id_jogo INT, genero TEXT);', resultado: '1FN' },
      },
      {
        nome: '2FN',
        tira: ['titulo_jogo'],
        nasce: { tabela: 'jogo', campos: ['id_jogo', 'titulo', 'preco_diaria'], nota: 'uma linha por jogo' },
        legenda:
          '2FN: titulo_jogo dependia só de id_jogo, metade da chave. Foi para a tabela jogo, e aqui sobrou ' +
          'a referência. O título do God of War agora está escrito uma vez só.',
        reg: { ator: 'ddl', texto: 'CREATE TABLE jogo (id_jogo INT PRIMARY KEY, titulo TEXT);', resultado: '2FN' },
      },
      {
        nome: '3FN',
        tira: ['nome_cliente', 'id_cliente'],
        nasce: { tabela: 'cliente', campos: ['id_cliente', 'nome', 'telefone'], nota: 'uma linha por cliente' },
        move: { para: 'emprestimo', campos: ['id_emprestimo', 'id_cliente', 'data_retirada'], nota: 'o cliente é do empréstimo, não do item' },
        legenda:
          '3FN: nome_cliente pegava carona em id_cliente para chegar na chave. O nome foi para cliente, e o ' +
          'id_cliente desceu para emprestimo — porque é o EMPRÉSTIMO que tem dono, não cada item dele.',
        reg: { ator: 'ddl', texto: 'CREATE TABLE cliente (id_cliente INT PRIMARY KEY, nome TEXT);', resultado: '3FN' },
      },
    ];

    function desenhar() {
      var restou = $('a9-restou'), saiu = $('a9-saiu');
      restou.textContent = ''; saiu.textContent = '';

      var foram = [];
      PASSOS.slice(0, atual).forEach(function (p) { foram = foram.concat(p.tira); });

      COLUNAS.forEach(function (c) {
        var fora = foram.indexOf(c.nome) !== -1;
        restou.appendChild(linha(c.nome, fora ? 'saiu' : c.papel === 'chave' ? 'chave' : 'fica', fora ? 'sumiu' : ''));
      });

      PASSOS.slice(0, atual).forEach(function (p) {
        saiu.appendChild(linha(p.nasce.tabela, p.nasce.campos.join(', '), 'entrou'));
        if (p.move) saiu.appendChild(linha(p.move.para, p.move.campos.join(', '), 'entrou'));
      });
      if (!atual) {
        saiu.appendChild(linha('nenhuma ainda', 'tudo numa tabela só', 'velha'));
      }

      $('a9-selo-restou').textContent = (COLUNAS.length - foram.length) + ' de ' + COLUNAS.length + ' colunas';
      $('a9-selo-saiu').textContent = atual ? atual + ' forma(s) aplicada(s)' : 'nenhuma';
      $('a9-painel-restou').classList.toggle('bom', atual === PASSOS.length);
      $('a9-painel-restou').classList.toggle('ruim', atual < PASSOS.length);

      $('a9-fn-legenda').textContent = atual
        ? PASSOS[atual - 1].legenda
        : 'Sete colunas numa tabela só, e uma delas com dois valores na mesma célula. Aplique a 1FN.';

      log.escrever(
        PASSOS.slice(0, atual).map(function (p, i) {
          return { hora: p.nome, ator: 'ddl', sql: true, texto: p.reg.texto, resultado: p.reg.resultado };
        }),
        'Nenhuma forma normal aplicada ainda.'
      );

      // No ultimo passo o botao continuaria clicavel sem mudar nada na tela.
      passo.disabled = atual === PASSOS.length;
      passo.textContent = atual === PASSOS.length
        ? 'Normalizada — as três aplicadas'
        : 'Aplicar a ' + PASSOS[atual].nome;
    }

    passo.addEventListener('click', function () {
      if (atual < PASSOS.length) atual += 1;
      desenhar();
    });
    $('a9-fn-zerar').addEventListener('click', function () { atual = 0; desenhar(); });
    desenhar();
  })();
})(window.DemoKit);
