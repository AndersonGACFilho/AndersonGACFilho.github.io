/* demos.js — as demonstracoes da Aula 07.
 *
 * O deck tem dois slides de "erro comum" que descrevem defeitos que so
 * aparecem DEPOIS: a coluna inventada estraga o DER a partir da Aula 09, e a
 * chave estrangeira errada so e recusada na Aula 11. Descrito, nao assusta.
 * Aqui os dois acontecem na hora — inclusive com a mensagem que o banco
 * devolve, que foi medida num PostgreSQL 16 e nao escrita de memoria.
 */
(function (kit) {
  'use strict';

  var $ = kit.$;
  var el = kit.el;
  var linha = kit.linha;
  var novoLog = kit.novoLog;
  var escolhas = kit.escolhas;

  /* ================= 1. de onde veio essa coluna ================= */
  //
  // "O mapeamento e traducao, nao criacao." Dito assim e regra de processo, e
  // regra de processo entra por um ouvido e sai pelo outro. Procurar a coluna
  // intrusa numa lista de oito e outra coisa: ela nao parece errada — parece
  // util, que e exatamente por que ela e escrita.

  (function () {
    var lista = $('a7-colunas');
    if (!lista) return;

    var log = novoLog('a7-log');

    var COLUNAS = [
      {
        col: 'plataforma.nome',
        origem: [['no DER', 'atributo de PLATAFORMA']],
        regra: 'Regra 1 — a entidade virou tabela, e os atributos dela viraram colunas.',
      },
      {
        col: 'jogo.titulo',
        origem: [['no DER', 'atributo de JOGO']],
        regra: 'Regra 1 — mesma coisa, outra entidade.',
      },
      {
        col: 'jogo.id_plataforma',
        origem: [['no DER', 'PLATAFORMA 1 : N JOGO']],
        regra: 'Regra 2 — o relacionamento 1:N virou coluna, no lado do N. Nenhuma tabela nova.',
      },
      {
        col: 'cliente.telefone',
        origem: [['no DER', 'atributo de CLIENTE']],
        regra: 'Regra 1. Guarde este: ele volta na demonstração 3.',
      },
      {
        col: 'emprestimo.data_retirada',
        origem: [['no DER', 'atributo de EMPRESTIMO']],
        regra: 'Era o atributo que não cabia em CLIENTE nem em JOGO, na Aula 06. Agora tem tabela própria.',
      },
      {
        col: 'emprestimo.id_cliente',
        origem: [['no DER', 'CLIENTE 1 : N EMPRESTIMO']],
        regra: 'Regra 2 de novo. Uma das duas chaves estrangeiras que marcam a entidade do meio.',
      },
      {
        col: 'emprestimo.id_jogo',
        origem: [['no DER', 'JOGO 1 : N EMPRESTIMO']],
        regra: 'A outra. Toda entidade que nasceu de um N:N tem exatamente duas.',
      },
      {
        col: 'cliente.pontos_fidelidade',
        origem: [['no DER', 'nada']],
        regra: 'Nenhuma entidade, nenhum atributo, nenhum relacionamento gerou esta coluna. Ela foi escrita aqui, direto na lista.',
        intrusa: true,
      },
    ];

    var CUSTO = [
      { hora: 'hoje', ator: 'voce', texto: 'a lista de tabelas ganhou uma coluna que o desenho não tem' },
      { hora: 'Aula 09', ator: 'voce', texto: 'normaliza olhando o DER — e normaliza a coisa errada' },
      { hora: 'Aula 11', ator: 'banco', texto: 'a tabela nasce com a coluna; ninguém é avisado' },
      { hora: 'Aula 18', ator: 'voce', texto: 'apresenta os dois artefatos, e eles não batem', marca: 'ruim' },
    ];

    var vistas = [];
    var botoes = [];

    function mostrar(c, i) {
      if (vistas.indexOf(i) === -1) vistas.push(i);
      botoes[i].classList.toggle('dentro', !c.intrusa);
      botoes[i].setAttribute('aria-pressed', 'true');
      botoes[i].firstChild.textContent = c.intrusa ? '?' : '✓';

      var alvo = $('a7-origem');
      alvo.textContent = '';
      c.origem.forEach(function (o) {
        alvo.appendChild(linha(o[0], o[1], c.intrusa ? 'sumiu' : 'entrou'));
      });
      $('a7-nota-origem').textContent = c.regra;
      $('a7-selo-origem').textContent = c.col;
      $('a7-selo-origem').className = 'selo ' + (c.intrusa ? 'ruim' : 'bom');
      $('a7-painel-origem').className = 'painel ' + (c.intrusa ? 'ruim' : 'bom');

      var conta = $('a7-conta');
      conta.textContent = '';
      conta.appendChild(linha('colunas conferidas', vistas.length + ' de ' + COLUNAS.length));
      var achou = vistas.some(function (k) { return COLUNAS[k].intrusa; });
      conta.appendChild(linha('sem origem no DER', achou ? '1 — cliente.pontos_fidelidade' : '—',
        achou ? 'sumiu' : ''));

      $('a7-selo-conta').textContent = vistas.length === COLUNAS.length ? 'lista inteira' : 'continue clicando';

      if (c.intrusa) {
        $('a7-legenda').textContent =
          'Achou. E repare que ela não parece errada — parece útil, que é exatamente por que alguém a escreveu. Se a coluna faz falta, o caminho é voltar ao DER e acrescentá-la lá; se não faz, ela não deveria existir aqui.';
        log.escrever(CUSTO);
      } else {
        $('a7-legenda').textContent =
          'Esta você consegue apontar no desenho: ' + c.origem[0][1] + '. É assim que uma lista de tabelas se defende — cada coluna tem um dedo apontando para o DER.';
        log.escrever([], 'Nenhuma coluna sem origem encontrada ainda. Continue procurando.');
      }
    }

    COLUNAS.forEach(function (c, i) {
      var li = el('li');
      var b = el('button', 'frase');
      b.type = 'button';
      b.setAttribute('aria-pressed', 'false');
      b.appendChild(el('span', 'marca', '+'));
      b.appendChild(el('span', null, c.col));
      b.addEventListener('click', function () { mostrar(c, i); });
      botoes.push(b);
      li.appendChild(b);
      lista.appendChild(li);
    });

    // Abre com a primeira coluna conferida: sem isto os dois paineis nascem
    // vazios, so cabecalho, e nada na tela diz que e preciso clicar na lista.
    mostrar(COLUNAS[0], 0);
  })();

  /* ================= 2. a chave estrangeira que aponta para o nada ================= */
  //
  // A nota de orador diz "mostrar como e a mensagem do PostgreSQL nesse caso
  // (tenho print) — ver o erro antes reduz o susto". Isto e o print, com as
  // quatro formas de errar em vez de uma. As mensagens foram medidas:
  // postgres:16-alpine, CREATE TABLE com cada uma das variantes.
  // O texto e o do banco, palavra por palavra; so a quebra de linha e nossa,
  // para a mensagem caber no painel sem barra de rolagem.

  (function () {
    var log = novoLog('a7-fk-log');

    var CASOS = [
      {
        id: 'certo',
        nome: 'apontando para a chave primária',
        sql: 'CREATE TABLE jogo (\n  id_jogo SERIAL PRIMARY KEY,\n  titulo VARCHAR(120),\n  id_plataforma INT\n    REFERENCES plataforma(id_plataforma)\n);',
        selo: 'plataforma existe, id_plataforma é a PK',
        resposta: 'CREATE TABLE',
        seloR: 'aceito',
        marcaR: 'bom',
        legenda:
          'É o que a seta da notação promete. Na lista de tabelas isso se escreve id_plataforma CE/FK → plataforma — e a seta é literalmente o REFERENCES.',
        registro: { ator: 'banco', texto: 'aceitou: o destino existe e identifica uma linha só', marca: 'bom' },
      },
      {
        id: 'sem-tabela',
        nome: 'a tabela de destino não existe',
        sql: 'CREATE TABLE jogo (\n  id_jogo SERIAL PRIMARY KEY,\n  titulo VARCHAR(120),\n  id_plataforma INT\n    REFERENCES plataforma(id_plataforma)\n);\n-- e a tabela plataforma nunca foi criada',
        selo: 'plataforma não existe',
        resposta: 'ERROR:  relation "plataforma" does not exist',
        seloR: 'recusado',
        marcaR: 'ruim',
        legenda:
          'A tabela apontada precisa existir ANTES. É o erro que mais aparece na Aula 11, e quase sempre por ordem: o script cria jogo antes de plataforma. Se você não consegue escrever o destino da seta, a chave estrangeira está errada.',
        registro: { ator: 'banco', texto: 'recusou: o destino da seta não existe', marca: 'ruim' },
      },
      {
        id: 'sem-chave',
        nome: 'apontando para uma coluna comum',
        sql: 'CREATE TABLE jogo (\n  id_jogo SERIAL PRIMARY KEY,\n  titulo VARCHAR(120),\n  fabricante VARCHAR(60)\n    REFERENCES plataforma(fabricante)\n);',
        selo: 'fabricante não é chave',
        resposta: 'ERROR:  there is no unique constraint matching given keys for\n        referenced table "plataforma"',
        seloR: 'recusado',
        marcaR: 'ruim',
        legenda:
          'A tabela existe, a coluna existe — e mesmo assim não serve. Uma chave estrangeira precisa apontar para algo que identifique UMA linha, e “Sony” identifica várias. É a Aula 05 cobrando: chave primária é o que não repete.',
        registro: { ator: 'banco', texto: 'recusou: o destino não identifica uma linha só', marca: 'ruim' },
      },
      {
        id: 'tipo',
        nome: 'com o tipo trocado',
        sql: 'CREATE TABLE jogo (\n  id_jogo SERIAL PRIMARY KEY,\n  id_plataforma VARCHAR(10)\n    REFERENCES plataforma(id_plataforma)\n);',
        selo: 'VARCHAR apontando para INT',
        resposta: 'ERROR:  foreign key constraint "jogo_id_plataforma_fkey" cannot be implemented\nDETAIL:  Key columns "id_plataforma" and "id_plataforma" are of\n         incompatible types: character varying and integer.',
        seloR: 'recusado',
        marcaR: 'ruim',
        legenda:
          'O destino está certo; o tipo, não. A coluna que aponta tem de ser do mesmo tipo da que recebe — e essa é a Aula 04 voltando: “nem tudo que tem dígito é número”, mas id é, e continua sendo dos dois lados.',
        registro: { ator: 'banco', texto: 'recusou: os dois lados são de tipos diferentes', marca: 'ruim' },
      },
    ];

    function blocos(idAlvo, texto) {
      var alvo = $(idAlvo);
      alvo.textContent = '';
      var bloco = el('pre', 'consulta');
      bloco.appendChild(el('code', null, texto));
      alvo.appendChild(bloco);
    }

    escolhas('a7-fks', CASOS, function (c) {
      blocos('a7-fk-sql', c.sql);
      blocos('a7-fk-resposta', c.resposta);
      $('a7-fk-selo').textContent = c.selo;
      $('a7-fk-selo-r').textContent = c.seloR;
      $('a7-fk-selo-r').className = 'selo ' + c.marcaR;
      $('a7-fk-painel-r').className = 'painel ' + c.marcaR;
      $('a7-fk-legenda').textContent = c.legenda;

      log.escrever([
        { hora: 'Aula 07', ator: 'voce', texto: 'escreve a seta: id_plataforma CE/FK → plataforma' },
        { hora: 'Aula 11', ator: c.registro.ator, texto: c.registro.texto, marca: c.registro.marca },
      ]);
    });
  })();

  /* ================= 3. quantas tabelas o seu DER vai gerar ================= */
  //
  // A nota de orador do "DER de partida" manda perguntar isso a turma. A
  // resposta e 4, e o interessante e POR QUE: tres relacionamentos e nenhuma
  // tabela nova. Duas das cinco regras nao criam tabela — e e justamente essa
  // a parte que some quando o mapeamento e decorado como lista de regras.

  (function () {
    var passo = $('a7-regra-passo');
    if (!passo) return;

    var log = novoLog('a7-regra-log');
    var atual = 0;

    var REGRAS = [
      {
        tit: 'Regra 1 — cada entidade vira uma tabela',
        selo: '4 tabelas',
        marca: '',
        esquema:
          'plataforma (id_plataforma*, nome, fabricante)\n' +
          'jogo       (id_jogo*, titulo, genero)\n' +
          'cliente    (id_cliente*, nome, telefone)\n' +
          'emprestimo (id_emprestimo*, data_retirada, data_prevista)',
        nota: 'Quatro entidades no DER, quatro tabelas. Ainda sem nenhuma ligação entre elas.',
        legenda:
          'A regra mais simples, e a única que é uma correspondência de um para um. O resto do mapeamento é decidir o que fazer com as linhas do desenho.',
        registro: { ator: 'voce', texto: '4 entidades viraram 4 tabelas', marca: '' },
      },
      {
        tit: 'Regra 2 — o relacionamento 1:N vira chave estrangeira',
        selo: '4 tabelas',
        marca: '',
        esquema:
          'plataforma (id_plataforma*, nome, fabricante)\n' +
          'jogo       (id_jogo*, titulo, genero,\n' +
          '            id_plataforma CE/FK → plataforma)\n' +
          'cliente    (id_cliente*, nome, telefone)\n' +
          'emprestimo (id_emprestimo*, data_retirada, data_prevista,\n' +
          '            id_jogo CE/FK → jogo,\n' +
          '            id_cliente CE/FK → cliente)',
        nota: 'Três relacionamentos, três colunas novas — e nenhuma tabela nova. A coluna entra sempre do lado do N.',
        legenda:
          'Aqui a conta não muda, e é o que surpreende. Relacionamento 1:N não é tabela: é uma coluna na tabela do lado que tem muitos. EMPRESTIMO ficou com duas, que é a marca de quem nasceu de um N:N.',
        registro: { ator: 'voce', texto: '3 relacionamentos 1:N viraram 3 colunas, 0 tabelas', marca: '' },
      },
      {
        tit: 'Regra 3 — o relacionamento N:N vira uma tabela nova',
        selo: '4 tabelas',
        marca: '',
        esquema:
          'plataforma (id_plataforma*, nome, fabricante)\n' +
          'jogo       (id_jogo*, titulo, genero,\n' +
          '            id_plataforma CE/FK → plataforma)\n' +
          'cliente    (id_cliente*, nome, telefone)\n' +
          'emprestimo (id_emprestimo*, data_retirada, data_prevista,\n' +
          '            id_jogo CE/FK → jogo,\n' +
          '            id_cliente CE/FK → cliente)\n' +
          '-- nenhum N:N sobrou para mapear',
        nota: 'A regra 3 não fez nada aqui: o N:N entre CLIENTE e JOGO já tinha virado EMPRESTIMO, uma aula antes.',
        legenda:
          'A tabela que a regra 3 criaria já está na lista desde o passo 1 — porque quem a criou foi você, no desenho da Aula 06. Grupo que ainda tem N:N no DER de hoje ganha uma tabela aqui.',
        registro: { ator: 'voce', texto: 'nenhum N:N sobrou: a entidade do meio foi feita na Aula 06', marca: '' },
      },
      {
        tit: 'Regra 4 — o relacionamento 1:1, e a escolha é sua',
        selo: '4 ou 5 tabelas',
        marca: '',
        esquema:
          'plataforma (id_plataforma*, nome, fabricante)\n' +
          'jogo       (id_jogo*, titulo, genero,\n' +
          '            id_plataforma CE/FK → plataforma)\n' +
          'cliente    (id_cliente*, nome, telefone)\n' +
          'emprestimo (id_emprestimo*, data_retirada, data_prevista,\n' +
          '            id_jogo CE/FK → jogo,\n' +
          '            id_cliente CE/FK → cliente)\n' +
          '\n' +
          '-- separando (poucos clientes têm, e é dado sensível):\n' +
          'dados_bancarios (id_dados*, banco, agencia, conta,\n' +
          '            id_cliente CE/FK → cliente, ÚNICA)',
        nota: 'Juntar tudo em cliente dá 4 tabelas; separar dá 5. Separando, a chave estrangeira precisa ser ÚNICA — senão dois registros apontariam para o mesmo cliente, e aí já não seria 1:1.',
        legenda:
          'É a única regra que não decide por você. Separar faz sentido aqui porque poucos clientes têm dados bancários, e porque é dado sensível que vai merecer permissão própria na Aula 16.',
        registro: { ator: 'voce', texto: '1:1 separado: +1 tabela, e a FK tem de ser ÚNICA', marca: '' },
      },
      {
        tit: 'Regra 5 — atributo multivalorado vira tabela',
        selo: '5 ou 6 tabelas',
        marca: 'bom',
        esquema:
          'plataforma (id_plataforma*, nome, fabricante)\n' +
          'jogo       (id_jogo*, titulo, genero,\n' +
          '            id_plataforma CE/FK → plataforma)\n' +
          'cliente    (id_cliente*, nome)\n' +
          'emprestimo (id_emprestimo*, data_retirada, data_prevista,\n' +
          '            id_jogo CE/FK → jogo,\n' +
          '            id_cliente CE/FK → cliente)\n' +
          'dados_bancarios (id_dados*, banco, agencia, conta,\n' +
          '            id_cliente CE/FK → cliente, ÚNICA)\n' +
          'telefone_cliente (id_telefone*, numero, tipo,\n' +
          '            id_cliente CE/FK → cliente)',
        nota: 'Repare que a coluna telefone SAIU de cliente. O cliente com dois telefones, da Aula 04, não cabia numa célula.',
        legenda:
          'Uma célula guarda um valor só — não existe coluna com lista dentro. Essa é, literalmente, a 1ª forma normal, e é a Aula 09. E note o que acabou de acontecer com o desenho: se telefone saiu da tabela, ele tem de sair da caixa CLIENTE no .drawio também, hoje, senão o DER vira ficção.',
        registro: { ator: 'banco', texto: 'telefone virou tabela, e o DER precisa ser corrigido junto', marca: 'bom' },
      },
    ];

    function mostrar() {
      var r = REGRAS[atual];
      $('a7-regra-tit').textContent = r.tit;
      $('a7-regra-selo').textContent = r.selo;
      $('a7-regra-selo').className = 'selo ' + r.marca;
      $('a7-esquema').textContent = r.esquema;
      $('a7-regra-nota').textContent = r.nota;
      $('a7-regra-legenda').textContent = r.legenda;

      log.escrever(REGRAS.slice(0, atual + 1).map(function (q, i) {
        return { hora: 'regra ' + (i + 1), ator: q.registro.ator, texto: q.registro.texto, marca: q.registro.marca };
      }));

      // Na ultima regra o botao ficaria clicavel sem mudar nada na tela.
      passo.disabled = atual === REGRAS.length - 1;
      passo.textContent = passo.disabled ? 'As cinco regras foram aplicadas' : 'Aplicar a próxima regra';
    }

    passo.addEventListener('click', function () {
      if (atual < REGRAS.length - 1) atual += 1;
      mostrar();
    });
    $('a7-regra-zerar').addEventListener('click', function () {
      atual = 0;
      mostrar();
    });

    mostrar();
  })();
})(window.DemoKit);
