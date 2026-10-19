/* demos.js — Aula 10: o servidor, a janela e a árvore do pgAdmin.
 *
 * Esta é a aula de instalação, e a tentação é fazer uma página que REPETE o
 * passo a passo. Não serve: o passo a passo está no slide e no pen drive. O
 * que a turma de fato erra é outra coisa, e são estas duas:
 *
 *   1. achar que o pgAdmin É o banco — daí fechar a janela com medo de perder
 *      dado, e não saber o que fazer quando a conexão falha;
 *   2. se perder na árvore da barra esquerda, que tem seis níveis e dois deles
 *      (Databases e Schemas) parecem a mesma coisa para quem chegou agora.
 */
(function (K) {
  'use strict';
  var $ = K.$, el = K.el, linha = K.linha, novoLog = K.novoLog;

  /* ================= 1. dois programas, não um ================= */

  (function () {
    var caixa = $('a10-botoes');
    if (!caixa) return;

    var log = novoLog('a10-log');
    var servidorLigado = true;
    var pgadminAberto = true;
    var historico = [];

    function desenhar() {
      var sv = $('a10-servidor'), pg = $('a10-pgadmin'), dc = $('a10-disco');
      sv.textContent = ''; pg.textContent = ''; dc.textContent = '';

      sv.appendChild(linha('estado', servidorLigado ? 'ouvindo' : 'parado', servidorLigado ? 'entrou' : 'sumiu'));
      sv.appendChild(linha('porta', servidorLigado ? '5432' : 'nenhuma', servidorLigado ? '' : 'sumiu'));
      sv.appendChild(linha('quem conversa com o disco', 'só ele', ''));

      pg.appendChild(linha('janela', pgadminAberto ? 'aberta' : 'fechada', pgadminAberto ? 'entrou' : 'sumiu'));
      pg.appendChild(linha('dados guardados aqui', 'nenhum', 'velha'));
      pg.appendChild(linha(
        'consegue perguntar?',
        !pgadminAberto ? 'fechado' : servidorLigado ? 'sim' : 'não — sem resposta',
        !pgadminAberto ? 'sumiu' : servidorLigado ? 'entrou' : 'sumiu'
      ));

      // O disco nao muda NUNCA nesta demo, e e esse o argumento. Ele esta aqui
      // justamente para o aluno ver que desligar e fechar nao mexem nele.
      dc.appendChild(linha('tabela jogo', '12 linhas', ''));
      dc.appendChild(linha('tabela cliente', '5 linhas', ''));
      dc.appendChild(linha('perdeu algo?', 'nada', 'entrou'));

      $('a10-selo-servidor').textContent = servidorLigado ? 'ligado' : 'desligado';
      $('a10-selo-pgadmin').textContent = pgadminAberto ? 'aberto' : 'fechado';
      $('a10-selo-disco').textContent = 'intacto';
      $('a10-painel-servidor').classList.toggle('bom', servidorLigado);
      $('a10-painel-servidor').classList.toggle('ruim', !servidorLigado);
      $('a10-painel-pgadmin').classList.toggle('ruim', pgadminAberto && !servidorLigado);
      $('a10-painel-pgadmin').classList.toggle('bom', pgadminAberto && servidorLigado);
      $('a10-painel-disco').classList.add('bom');

      $('a10-legenda').textContent =
        !pgadminAberto
          ? 'Fechar o pgAdmin não desliga nada: o servidor continua ouvindo na 5432 e o disco está lá inteiro. ' +
            'A janela é só a janela.'
          : servidorLigado
            ? 'Os dois de pé: o pgAdmin pergunta, o servidor responde, o disco guarda. Desligue o servidor e tente de novo.'
            : 'O pgAdmin continua aberto e não consegue mais nada. A mensagem que aparece no laboratório é esta, e ' +
              'ela não fala de senha nem de tabela: fala de conexão. Repare que o disco não perdeu nada.';

      log.escrever(historico, 'Nada aconteceu ainda.');
    }

    function registrar(ator, texto, resultado, marca) {
      historico.push({ hora: historico.length + 1 + '', ator: ator, texto: texto, resultado: resultado, marca: marca || '' });
      if (historico.length > 8) historico.shift();
    }

    [
      {
        nome: 'Consultar a tabela jogo',
        classe: 'acao',
        fazer: function () {
          if (!pgadminAberto) {
            registrar('voce', 'com o pgAdmin fechado não há onde digitar', 'nada acontece', 'ruim');
          } else if (servidorLigado) {
            registrar('banco', 'SELECT * FROM jogo;', '12 linhas');
          } else {
            // A mensagem real do PostgreSQL, palavra por palavra. E ela que vai
            // aparecer no laboratorio, e reconhece-la e meio caminho.
            registrar('voce', 'could not connect to server: Connection refused', 'servidor parado', 'ruim');
          }
        },
      },
      {
        nome: 'Desligar / ligar o servidor',
        classe: 'acao secundaria',
        fazer: function () {
          servidorLigado = !servidorLigado;
          registrar('servidor', servidorLigado ? 'serviço postgresql iniciado' : 'serviço postgresql parado',
            servidorLigado ? 'ouvindo na 5432' : 'porta fechada', servidorLigado ? '' : 'ruim');
        },
      },
      {
        nome: 'Fechar / abrir o pgAdmin',
        classe: 'acao secundaria',
        fazer: function () {
          pgadminAberto = !pgadminAberto;
          registrar('voce', pgadminAberto ? 'abri o pgAdmin' : 'fechei a janela do pgAdmin',
            pgadminAberto ? 'janela aberta' : 'o servidor nem percebeu');
        },
      },
    ].forEach(function (b) {
      var btn = el('button', b.classe, b.nome);
      btn.type = 'button';
      btn.addEventListener('click', function () { b.fazer(); desenhar(); });
      caixa.appendChild(btn);
    });

    desenhar();
  })();

  /* ================= 2. a árvore do pgAdmin ================= */
  //
  // Seis niveis, e dois deles — Databases e Schemas — parecem a mesma coisa
  // para quem chegou agora. Por isso cada no explica o QUE ELE E, e o erro nao
  // volta ao comeco: quem erra le a explicacao e continua de onde estava, que e
  // exatamente o que acontece clicando na arvore de verdade.

  (function () {
    var caixa = $('a10-filhos');
    if (!caixa) return;

    var log = novoLog('a10-arvore-log');

    var ARVORE = {
      raiz: {
        nome: 'Servers', oque: 'a lista de servidores que o seu pgAdmin conhece',
        detalhe: ['pode ter mais de um', 'cada um é uma instalação do PostgreSQL'],
        filhos: ['pg15'],
      },
      pg15: {
        nome: 'PostgreSQL 15', oque: 'um servidor, com porta e senha próprias',
        detalhe: ['porta 5432', 'a senha do postgres é desta instalação'],
        filhos: ['databases', 'login'],
      },
      databases: {
        nome: 'Databases', oque: 'os BANCOS deste servidor — cada um isolado do outro',
        detalhe: ['locadora não enxerga postgres', 'é aqui que o seu projeto nasce'],
        filhos: ['locadora', 'postgres'],
      },
      login: {
        nome: 'Login/Group Roles', oque: 'os usuários do servidor — assunto da Aula 16',
        detalhe: ['vale para TODOS os bancos', 'não é por banco'],
        filhos: [],
        beco: 'As roles valem para o servidor inteiro, não para um banco. A tabela não está por aqui.',
      },
      postgres: {
        nome: 'postgres', oque: 'o banco de manutenção, que nasce com a instalação',
        detalhe: ['não é o seu projeto', 'apagar ele quebra o pgAdmin'],
        filhos: [],
        beco: 'Este é o banco de manutenção, não o da locadora. As suas tabelas não estão aqui.',
      },
      locadora: {
        nome: 'locadora', oque: 'o banco do projeto — o que você criou',
        detalhe: ['tudo da UC2 mora aqui dentro'],
        filhos: ['schemas'],
      },
      schemas: {
        nome: 'Schemas', oque: 'as GAVETAS dentro do banco — e quase sempre há uma só',
        detalhe: ['public é a padrão', 'o nível que mais confunde'],
        filhos: ['public'],
      },
      public: {
        nome: 'public', oque: 'a gaveta padrão, onde o CREATE TABLE põe a tabela sem você pedir',
        detalhe: ['é por isso que ninguém a nota'],
        filhos: ['tables', 'views'],
      },
      views: {
        nome: 'Views', oque: 'as consultas guardadas com nome — assunto da Aula 15',
        detalhe: ['catalogo_publico mora aqui'],
        filhos: [],
        beco: 'View não é tabela: é consulta guardada. A tabela jogo está na pasta ao lado.',
      },
      tables: {
        nome: 'Tables', oque: 'enfim as tabelas do banco',
        detalhe: ['as sete da locadora'],
        filhos: ['jogo'],
      },
      jogo: {
        nome: 'jogo', oque: 'a tabela que você procurava',
        detalhe: ['botão direito → View/Edit Data → All Rows'],
        filhos: [],
        chegou: true,
      },
    };

    var caminho = ['raiz'];
    var becos = [];

    function atual() { return ARVORE[caminho[caminho.length - 1]]; }

    function desenhar() {
      var no = atual();
      var cam = $('a10-caminho'), exp = $('a10-explica');
      cam.textContent = ''; exp.textContent = '';

      caminho.forEach(function (id, i) {
        var e = ARVORE[id];
        cam.appendChild(linha(
          // a indentacao vira texto porque o painel e uma lista de linhas, nao
          // uma arvore de verdade — e o nivel precisa ficar visivel mesmo assim
          (i ? '└'.padStart(i * 2, ' ') + ' ' : '') + e.nome,
          i === caminho.length - 1 ? 'você está aqui' : '',
          i === caminho.length - 1 ? 'entrou' : ''
        ));
      });

      exp.appendChild(linha(no.nome, no.oque, 'achou'));
      no.detalhe.forEach(function (d) { exp.appendChild(linha(d, '', '')); });

      // 8, e nao 6: Servers, servidor, Databases, locadora, Schemas, public,
      // Tables e a tabela. Sao SETE cliques a partir da raiz.
      $('a10-selo-caminho').textContent = 'nível ' + caminho.length + ' de 8';
      $('a10-selo-explica').textContent = no.chegou ? 'chegou' : no.beco ? 'beco sem saída' : 'siga';
      $('a10-painel-caminho').classList.toggle('bom', !!no.chegou);
      $('a10-painel-explica').classList.toggle('bom', !!no.chegou);
      $('a10-painel-explica').classList.toggle('ruim', !!no.beco);

      caixa.textContent = '';
      if (no.chegou) {
        $('a10-arvore-legenda').textContent =
          'Servers → PostgreSQL 15 → Databases → locadora → Schemas → public → Tables → jogo. ' +
          'São sete cliques, sempre os mesmos, e é por isso que vale decorar o caminho em vez de caçar a cada vez.';
      } else if (no.beco) {
        $('a10-arvore-legenda').textContent = no.beco;
      } else {
        $('a10-arvore-legenda').textContent =
          'Abra o próximo nível. Se escolher errado, a página diz o que aquele nível é — e você volta um passo.';
      }

      no.filhos.forEach(function (id) {
        var b = el('button', 'acao secundaria', 'abrir ' + ARVORE[id].nome);
        b.type = 'button';
        b.addEventListener('click', function () {
          caminho.push(id);
          if (ARVORE[id].beco) becos.push(ARVORE[id].nome);
          desenhar();
        });
        caixa.appendChild(b);
      });

      if (caminho.length > 1) {
        var volta = el('button', 'acao', 'Voltar um nível');
        volta.type = 'button';
        volta.addEventListener('click', function () { caminho.pop(); desenhar(); });
        caixa.appendChild(volta);
      }

      log.escrever(
        caminho.map(function (id, i) {
          var e = ARVORE[id];
          return {
            hora: 'nível ' + (i + 1),
            ator: e.beco ? 'voce' : e.chegou ? 'banco' : 'servidor',
            marca: e.beco ? 'ruim' : '',
            texto: e.nome,
            resultado: e.chegou ? 'é a tabela' : e.beco ? 'não é por aqui' : e.oque.split(' — ')[0],
          };
        })
      );
    }

    desenhar();
  })();
})(window.DemoKit);
