/* demos.js — UC3, Aula 05: o dublê que não lê o SQL, e a suíte que só passa
 * na primeira vez.
 *
 * O slide 7 mostra o "titlo" depois do verde. Aqui a pessoa PALPITA antes
 * (fraqueza n. 1 do DIDATICA.md) e depois ESCREVE a coluna do WHERE
 * (fraqueza n. 2): o cursor falso fica verde com qualquer coisa que ela
 * digitar, e o banco só aceita o nome que existe na tabela.
 *
 * A segunda demo é a tabela do slide 16 acontecendo: a pessoa monta a fixture
 * (banco e limpeza), aposta se a 2ª rodada repete a 1ª, e vê o Zelda de uma
 * rodada continuar no banco na seguinte. Os números — 3 vermelhos na 1ª e 4
 * na 2ª com rollback, tudo verde com TRUNCATE — são os medidos no roteiro
 * (docs/roteiros/UC3/aula-05.md), com o CRUD já consertado do gabarito.
 */
(function (K) {
  'use strict';
  var $ = K.$, linha = K.linha, novoLog = K.novoLog, escolhas = K.escolhas, palpite = K.palpite, itemTeste = K.itemTeste;

  /* ================= 1. o dublê não lê o SQL ================= */

  (function () {
    if (!$('u3a5-rodar')) return;
    var log = novoLog('u3a5-log');

    // As colunas do jogo no locadora-demo.sql, com o tipo: é o tipo que faz o
    // banco recusar comparar 'Zelda' com id_jogo, e o dublê nem percebe.
    var COLUNAS = { id_jogo: 'integer', titulo: 'texto', genero: 'texto', ano_lancamento: 'integer', preco_diaria: 'numeric' };
    // palavras que o PostgreSQL lê como comando, e não como nome de coluna
    var RESERVADAS = ['select', 'from', 'where', 'and', 'or', 'not', 'null', 'table', 'order', 'by'];
    var aposta = null, rodadas = 0;

    var palpites = palpite('u3a5-palpite', [
      { id: 'verde', nome: 'verde' },
      { id: 'vermelho', nome: 'vermelho' },
    ], function (op) {
      aposta = op;
      $('u3a5-legenda').textContent = 'Palpite registrado. Agora rode os dois testes.';
    });

    function coluna() { return $('u3a5-coluna').value.trim(); }

    function sql(col) {
      return 'cursor.execute(\n' +
        '    "SELECT id_jogo, titulo, genero, ano_lancamento, preco_diaria "\n' +
        '    "FROM jogo WHERE ' + (col || '') + ' = %s",\n' +
        '    (titulo,),\n)';
    }

    // O que o PostgreSQL responderia a este SELECT, com o Zelda gravado pelo
    // próprio teste. As mensagens são as que o psycopg2 imprime.
    function banco(col) {
      var c = col.toLowerCase();
      if (!c || RESERVADAS.indexOf(c) !== -1) return { erro: 'syntax error at or near "' + (c ? col : '=') + '"' };
      if (!COLUNAS[c]) return { erro: 'column "' + c + '" does not exist' };
      if (COLUNAS[c] !== 'texto') return { erro: 'invalid input syntax for type ' + COLUNAS[c] + ': "Zelda"' };
      if (c !== 'titulo') return { vazio: true };
      return { achou: true };
    }

    function desenhar(r) {
      var d = $('u3a5-dubl'), b = $('u3a5-banco');
      d.textContent = ''; b.textContent = '';
      d.appendChild(linha('cursor.execute(…)', 'aceita qualquer texto'));
      d.appendChild(linha('cursor.fetchone()', "(1, 'Zelda', …)"));
      b.appendChild(linha('o teste grava antes', '1 · Zelda · R$ 8,00'));
      b.appendChild(linha('o SELECT', !r ? 'ainda não rodou' : r.erro ? 'recusado' : r.vazio ? 'aceito, 0 linhas' : 'aceito, 1 linha',
        !r ? '' : r.achou ? 'entrou' : 'velha'));

      var td = $('u3a5-teste-dubl'), tb = $('u3a5-teste-banco');
      td.textContent = ''; tb.textContent = '';
      // o verde do dublê é o que o pytest mostra; quem lê a legenda descobre
      // que ele não prova nada. Pintar de vermelho seria mentir sobre a tela.
      td.appendChild(itemTeste('test_busca_pelo_titulo_com_cursor_falso', r ? true : null, r ? 'passou' : 'ainda não rodou'));
      tb.appendChild(itemTeste('test_busca_pelo_titulo', r ? !!r.achou : null,
        !r ? 'ainda não rodou' : r.achou ? 'passou' : 'achado é None'));

      $('u3a5-selo-dubl').textContent = r ? 'verde' : 'não rodou';
      $('u3a5-selo-banco').textContent = !r ? 'não rodou' : r.achou ? 'verde' : 'vermelho';
      $('u3a5-painel-banco').classList.toggle('ruim', !!r && !r.achou);
      $('u3a5-painel-banco').classList.toggle('bom', !!r && !!r.achou);
    }

    function atualizarSql() {
      $('u3a5-sql').textContent = sql(coluna());
      desenhar(null);
      log.comparar([], null, 'Rode os dois testes: o registro mostra o que cada um fez com o SQL.');
    }

    function rodar() {
      var col = coluna();
      // Só o nome de uma coluna: com espaço ou símbolo, o campo vira injeção de
      // SQL, e a resposta do banco deixaria de ser previsível aqui.
      if (col && !/^[A-Za-z_][A-Za-z0-9_]*$/.test(col)) {
        $('u3a5-legenda').textContent = 'Escreva só o nome de uma coluna: letras, números e _.';
        return;
      }
      if (!rodadas && !aposta) {
        $('u3a5-legenda').textContent = 'Palpite primeiro: o teste com cursor falso fica verde ou vermelho?';
        return;
      }
      rodadas += 1;
      var r = banco(col);
      desenhar(r);

      var select = "SELECT … WHERE " + (col || '') + " = 'Zelda'";
      log.comparar([
        { ator: 'duble', linhas: [
          { sql: true, texto: select, resultado: 'não executa nada' },
          { sql: true, texto: 'cursor.fetchone()', resultado: "devolve (1, 'Zelda', …)" },
          { sql: true, texto: 'assert jogo.titulo == "Zelda"', resultado: 'passou' },
        ] },
        // sem marca na coluna: o CSS pintaria de vermelho TODOS os resultados
        // dela, inclusive o INSERT que deu certo. Quem diz que falhou é o
        // painel acima, e o veredito embaixo.
        { ator: 'banco', linhas: [
          { sql: true, texto: "criar_jogo(conexao, 'Zelda', …)", resultado: 'INSERT, 1 linha' },
          { sql: true, texto: select, resultado: r.erro ? r.erro : r.vazio ? '0 linhas' : '1 linha' },
          { sql: true, texto: 'assert achado is not None', resultado: r.achou ? 'passou' : 'FALHOU' },
        ] },
      ], { texto: r.achou
        ? 'Os dois verdes, mas só o do banco leu o SQL.'
        : 'O dublê ficou verde sem ler o SQL. O banco leu, e por isso pegou.', marca: r.achou ? '' : 'perdeu' });

      var frase;
      if (r.achou) frase = 'Os dois verdes. Agora escreva qualquer coisa no lugar — banana — e rode: o do cursor falso continua verde.';
      else if (r.vazio) frase = 'O banco aceitou o SQL, procurou "Zelda" na coluna ' + col.toLowerCase() + ' e não achou nada. O dublê nem percebeu.';
      else if (col.toLowerCase() === 'titlo') frase = 'Verde com titlo no SQL: o dublê devolveu a tupla que o teste mandou, sem ler o comando. O banco recusou na primeira linha. Agora escreva a coluna certa e rode de novo.';
      else frase = 'O banco respondeu ' + r.erro + '. O dublê, verde de novo: ele nunca leu o SQL.';
      if (aposta) frase = (aposta.id === 'verde' ? 'Seu palpite bateu. ' : 'Seu palpite não bateu. ') + frase;
      // o palpite vale para a rodada em que foi feito; a próxima é exploração
      aposta = null; palpites.limpar();
      $('u3a5-legenda').textContent = frase;
    }

    $('u3a5-coluna').addEventListener('input', function () {
      atualizarSql();
      $('u3a5-legenda').textContent = rodadas ? 'SQL mudou. Rode de novo.' : 'Palpite primeiro, e depois rode.';
    });
    $('u3a5-coluna').addEventListener('keydown', function (e) { if (e.key === 'Enter') rodar(); });
    $('u3a5-rodar').addEventListener('click', rodar);

    atualizarSql();
    $('u3a5-legenda').textContent = 'Leia o SQL acima, palpite, e só então rode.';
  })();

  /* ================= 2. a segunda rodada ================= */

  (function () {
    if (!$('u3a5-rodar2')) return;
    var log = novoLog('u3a5-log2');

    // Os 12 jogos que o locadora-demo.sql insere: é com eles que o banco de
    // teste nasce, e o UNIQUE do título vale também contra eles.
    var BASE = ['God of War', 'God of War Ragnarök', 'The Last of Us Part II', 'Gran Turismo 7',
      'Tears of the Kingdom', 'Mario Kart 8 Deluxe', 'Pokémon Scarlet', 'Halo Infinite',
      'Forza Horizon 5', "Baldur's Gate 3", 'Elden Ring', 'Age of Empires IV'];
    var PLATAFORMAS = ['PlayStation 5', 'Nintendo Switch', 'Xbox Series X', 'PC'];

    var qualBanco = 'teste', limpeza = 'rollback', aposta = null, db, rodadas;

    var palpites = palpite('u3a5-palpite2', [
      { id: 'igual', nome: 'sim, o mesmo resultado' },
      { id: 'muda', nome: 'não, muda' },
    ], function (op) {
      aposta = op;
      $('u3a5-legenda2').textContent = 'Palpite registrado. Rode a suíte.';
    });

    function novoBanco() {
      return {
        jogos: BASE.map(function (t, i) { return { id: i + 1, titulo: t, preco: 10, base: true }; }),
        seq: BASE.length + 1,
        plats: PLATAFORMAS.map(function (n, i) { return { id: i + 1, nome: n }; }),
        pseq: PLATAFORMAS.length + 1,
        links: [],
      };
    }

    /* --- o crud_jogo.py do gabarito, com commit() em toda função --- */

    function criar(titulo, preco, rodada) {
      // o nextval do SERIAL roda antes das constraints: INSERT recusado também
      // gasta um id, como no PostgreSQL
      var id = db.seq++;
      if (preco < 0) return null;                                  // CHECK (preco_diaria >= 0)
      if (db.jogos.some(function (j) { return j.titulo === titulo; })) return null;  // UNIQUE
      var j = { id: id, titulo: titulo, preco: preco, rodada: rodada };
      db.jogos.push(j);
      return { id: id, titulo: titulo, preco: preco };
    }
    function buscar(id) {
      return db.jogos.filter(function (j) { return j.id === id; })[0] || null;
    }
    function buscarTitulo(t) {
      return db.jogos.filter(function (j) { return j.titulo === t; })[0] || null;
    }
    function atualizar(id, preco) {
      var j = buscar(id);
      if (j) j.preco = preco;
      return !!j;
    }
    function deletar(id) {
      db.links = db.links.filter(function (l) { return l.jogo !== id; });  // o conserto do Bloco 3
      var antes = db.jogos.length;
      db.jogos = db.jogos.filter(function (j) { return j.id !== id; });
      return db.jogos.length < antes;
    }

    // Por que o criar_jogo devolveu None: o Zelda que já estava lá veio de
    // outra rodada, ou de um teste anterior desta mesma?
    function motivoNone(rodada) {
      var z = buscarTitulo('Zelda');
      return 'devolveu None: o Zelda ' + (z && z.rodada < rodada ? 'da ' + z.rodada + 'ª rodada' : 'do teste anterior') + ' está lá';
    }

    var TESTES = [
      { nome: 'test_cria_e_busca_pelo_id', roda: function (n) {
        var c = criar('Zelda', 8, n);
        if (!c) return motivoNone(n);
        var a = buscar(c.id);
        return a && a.titulo === 'Zelda' && a.preco === 8 ? null : 'o jogo achado não é o criado';
      } },
      { nome: 'test_busca_pelo_titulo', roda: function (n) {
        criar('Zelda', 8, n);
        return buscarTitulo('Zelda') ? null : 'achado é None';
      } },
      { nome: 'test_busca_id_que_nao_existe_devolve_none', roda: function () {
        return buscar(999) ? 'achou um id 999' : null;
      } },
      { nome: 'test_atualiza_o_preco', roda: function (n) {
        var c = criar('Zelda', 8, n);
        if (!c) return motivoNone(n);
        return atualizar(c.id, 10) && buscar(c.id).preco === 10 ? null : 'o preço não mudou';
      } },
      { nome: 'test_atualizar_id_que_nao_existe_devolve_false', roda: function () {
        return atualizar(999, 10) ? 'devolveu True' : null;
      } },
      { nome: 'test_apaga_jogo', roda: function (n) {
        var c = criar('Zelda', 8, n);
        if (!c) return motivoNone(n);
        return deletar(c.id) && !buscar(c.id) ? null : 'o jogo continua lá';
      } },
      { nome: 'test_apaga_jogo_que_tem_plataforma', roda: function (n) {
        var c = criar('Zelda', 8, n);
        if (!c) return motivoNone(n);
        if (db.plats.some(function (p) { return p.nome === 'Switch'; })) return 'o Switch de outro teste ainda está lá';
        var p = { id: db.pseq++, nome: 'Switch' };
        db.plats.push(p);
        db.links.push({ jogo: c.id, plat: p.id });
        return deletar(c.id) && !buscar(c.id) ? null : 'o jogo continua lá';
      } },
      { nome: 'test_banco_recusa_preco_negativo', roda: function (n) {
        return criar('Zelda', -1, n) ? 'o banco aceitou −1,00' : null;
      } },
      { nome: 'test_banco_recusa_titulo_repetido', roda: function (n) {
        criar('Zelda', 8, n);
        return criar('Zelda', 5, n) ? 'o banco aceitou o repetido' : null;
      } },
    ];

    function nomeBanco() { return qualBanco === 'teste' ? 'locadora_teste' : 'locadora'; }

    function fixtureCodigo() {
      var cfg = qualBanco === 'teste' ? 'BANCO_DE_TESTE' : 'BANCO_DO_PROJETO';
      var l = ['@pytest.fixture', 'def conexao():', '    conexao = pg.connect(**' + cfg + ')'];
      if (limpeza === 'truncate') {
        l.push('    cursor = conexao.cursor()',
          '    cursor.execute("TRUNCATE jogo, plataforma RESTART IDENTITY CASCADE")',
          '    conexao.commit()', '    yield conexao', '    conexao.close()');
      } else {
        l.push('    yield conexao', '    conexao.rollback()');
      }
      return l.join('\n');
    }

    function rodarSuite() {
      var n = rodadas.length + 1, falhas = {}, baseAntes = db.jogos.some(function (j) { return j.base; });
      TESTES.forEach(function (t) {
        if (limpeza === 'truncate') {
          db.jogos = []; db.plats = []; db.links = []; db.seq = 1; db.pseq = 1;
        }
        var m = t.roda(n);
        if (m) falhas[t.nome] = m;
        // rollback no fim: não há o que desfazer, cada função do CRUD já deu
        // commit(). Por isso esta linha não mexe no banco simulado.
      });
      rodadas.push({ n: n, falhas: falhas, vermelhos: Object.keys(falhas).length, apagouBase: baseAntes && !db.jogos.some(function (j) { return j.base; }) });
    }

    function desenhar() {
      var tab = $('u3a5-tabela'), su = $('u3a5-suite');
      tab.textContent = ''; su.textContent = '';
      var projeto = qualBanco === 'projeto';
      var base = db.jogos.filter(function (j) { return j.base; });
      $('u3a5-nome-tabela').textContent = 'a tabela jogo, no ' + nomeBanco();

      if (base.length) {
        tab.appendChild(linha(base.length + ' jogos ' + (projeto ? 'do projeto de vocês' : 'do locadora-demo.sql'), 'God of War, Elden Ring…'));
      } else if (projeto) {
        tab.appendChild(linha('os 12 jogos do projeto', 'apagados pelo TRUNCATE', 'velha'));
      } else {
        tab.appendChild(linha('os 12 jogos do locadora-demo.sql', 'esvaziados: é banco de teste'));
      }
      var atual = rodadas.length;
      db.jogos.filter(function (j) { return !j.base; }).forEach(function (j) {
        var preco = 'R$ ' + j.preco.toFixed(2).replace('.', ',');
        if (limpeza === 'truncate') {
          tab.appendChild(linha('id ' + j.id + ' · ' + j.titulo, preco + ' · o próximo TRUNCATE leva'));
        } else {
          // sujeira: o teste seguinte encontra o que não montou
          tab.appendChild(linha('id ' + j.id + ' · ' + j.titulo, preco + ' · ficou da ' + j.rodada + 'ª rodada', 'velha'));
        }
      });
      $('u3a5-selo-tabela').textContent = db.jogos.length === 1 ? '1 linha' : db.jogos.length + ' linhas';
      $('u3a5-painel-tabela').classList.toggle('ruim', projeto && atual > 0);

      var ultima = rodadas[atual - 1];
      $('u3a5-nome-suite').textContent = ultima ? 'a suíte, ' + ultima.n + 'ª rodada' : 'a suíte';
      // a tabela do slide 16, se montando rodada a rodada: as duas primeiras
      // linhas existem desde o começo, que é a pergunta do palpite
      var rod = $('u3a5-rodadas');
      rod.textContent = '';
      var mostrar = Math.max(2, atual);
      for (var k = Math.max(1, mostrar - 2); k <= mostrar; k++) {
        var r = rodadas[k - 1];
        rod.appendChild(linha(k + 'ª rodada', !r ? 'não rodou' : r.vermelhos ? r.vermelhos + (r.vermelhos === 1 ? ' vermelho' : ' vermelhos') : 'tudo verde',
          !r ? '' : r.vermelhos ? 'velha' : 'entrou'));
      }
      $('u3a5-selo-rodadas').textContent = atual === 1 ? '1 rodada' : atual + ' rodadas';
      TESTES.forEach(function (t, k) {
        var passou = ultima ? !ultima.falhas[t.nome] : null;
        su.appendChild(itemTeste(t.nome, passou, !ultima ? 'ainda não rodou' : passou ? 'passou' : ultima.falhas[t.nome], k));
      });
      $('u3a5-selo-suite').textContent = ultima ? (TESTES.length - ultima.vermelhos) + ' de ' + TESTES.length + ' verdes' : 'não rodou';
      $('u3a5-painel-suite').classList.toggle('ruim', !!ultima && ultima.vermelhos > 0);
      $('u3a5-painel-suite').classList.toggle('bom', !!ultima && !ultima.vermelhos);

      var entradas = [];
      rodadas.slice(-2).forEach(function (r) {
        var h = r.n + 'ª';
        if (limpeza === 'truncate') {
          entradas.push({ hora: h, ator: 'pytest', sql: true, texto: 'TRUNCATE jogo, plataforma RESTART IDENTITY CASCADE', resultado: 'antes de cada teste' });
          if (r.apagouBase) entradas.push({ hora: h, ator: 'banco', texto: 'os 12 jogos do ' + nomeBanco(), resultado: projeto ? 'apagados — eram os dados do projeto' : 'apagados' });
        } else {
          entradas.push({ hora: h, ator: 'pytest', texto: 'a fixture conecta e entrega a conexão', resultado: 'nada limpa antes' });
        }
        entradas.push({ hora: h, ator: 'banco', sql: true, texto: "criar_jogo(conexao, 'Zelda', …)", resultado: 'commit() lá dentro' });
        if (limpeza === 'rollback') entradas.push({ hora: h, ator: 'banco', sql: true, texto: 'conexao.rollback()', resultado: 'nada a desfazer: já tinha commit' });
        entradas.push({ hora: h, ator: 'pytest', texto: TESTES.length + ' testes', resultado: r.vermelhos ? r.vermelhos + ' vermelhos' : 'tudo verde' });
      });
      log.escrever(entradas, 'Nenhuma rodada ainda.');
    }

    function recomecar() {
      db = novoBanco(); rodadas = [];
      aposta = null; palpites.limpar();
      $('u3a5-fixture').textContent = fixtureCodigo();
      $('u3a5-rodar2').textContent = 'Rodar a suíte';
      desenhar();
      $('u3a5-legenda2').textContent = 'Palpite primeiro: com esta fixture, a 2ª rodada repete a 1ª?';
    }

    function frase() {
      var r = rodadas[rodadas.length - 1], projeto = qualBanco === 'projeto';
      if (r.n === 1) {
        if (r.vermelhos) return '1ª rodada: ' + r.vermelhos + ' vermelhos. O Zelda do primeiro teste continua lá no quarto: o rollback do fim chegou depois do commit(). Rode de novo, sem mexer em nada.';
        return projeto ? '1ª rodada: tudo verde. Olhe a tabela, e rode de novo.' : '1ª rodada: tudo verde. Rode de novo, sem mexer em nada.';
      }
      var antes = rodadas[rodadas.length - 2], igual = antes.vermelhos === r.vermelhos;
      var texto;
      if (limpeza === 'truncate') {
        texto = projeto
          ? 'Verde nas duas — e os 12 jogos do projeto sumiram. A fixture estava certa; o banco, não.'
          : 'Verde nas duas: cada teste começa com a tabela vazia, porque o TRUNCATE roda antes e não depende do que ficou.';
      } else if (!igual) {
        texto = r.n + 'ª rodada: ' + r.vermelhos + ' vermelhos. Agora até o primeiro teste acha o Zelda da rodada anterior. O rollback não desfez nada: o criar_jogo já tinha dado commit().' +
          (projeto ? ' E esse Zelda mora no banco do projeto, no meio dos dados de vocês.' : '');
      } else {
        texto = 'Igual à rodada anterior: a sujeira já está lá, e o resultado parou de mudar. Troque para TRUNCATE.';
      }
      if (aposta && r.n === 2) texto = ((aposta.id === 'igual') === igual ? 'Seu palpite bateu. ' : 'Seu palpite não bateu. ') + texto;
      return texto;
    }

    $('u3a5-rodar2').addEventListener('click', function () {
      if (!aposta && !rodadas.length) {
        $('u3a5-legenda2').textContent = 'Palpite primeiro: a 2ª rodada dá o mesmo resultado da 1ª?';
        return;
      }
      rodarSuite();
      desenhar();
      $('u3a5-legenda2').textContent = frase();
      this.textContent = 'Rodar de novo (' + (rodadas.length + 1) + 'ª rodada)';
    });
    $('u3a5-recriar').addEventListener('click', recomecar);

    escolhas('u3a5-banco-escolha', [
      { id: 'teste', nome: 'locadora_teste — o banco de teste' },
      { id: 'projeto', nome: 'locadora — o banco do projeto' },
    ], function (o) { qualBanco = o.id; recomecar(); });
    escolhas('u3a5-limpeza', [
      { id: 'rollback', nome: 'rollback depois do yield' },
      { id: 'truncate', nome: 'TRUNCATE antes do yield' },
    ], function (o) { limpeza = o.id; recomecar(); });
  })();
})(window.DemoKit);
