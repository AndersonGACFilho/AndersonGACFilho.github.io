/* demos.js — as demonstracoes da Aula 02.
 *
 * O eixo da aula e a diferenca entre a FORMA e o CONTEUDO, e entre os tres
 * niveis de abstracao. As duas coisas sao faceis de dizer e dificeis de
 * sentir: o aluno concorda com a frase e erra a pergunta. Entao aqui ele
 * mexe e ve qual painel muda.
 *
 * Script classico, como o resto: a pagina abre com duplo clique no arquivo.
 */
(function (kit) {
  'use strict';

  var $ = kit.$;
  var el = kit.el;
  var linha = kit.linha;
  var novoLog = kit.novoLog;

  /* ================= 1. esquema x instancia ================= */
  //
  // A pergunta que a aula faz e "se eu apagar todos os emprestimos de hoje,
  // mudei o esquema ou a instancia?". Descrita, ela parece obvia; feita, o
  // aluno ve o painel da esquerda nao piscar enquanto o da direita esvazia.

  (function () {
    var inserir = $('a2-inserir');
    if (!inserir) return;

    var COLUNAS_BASE = [
      ['id', 'integer'],
      ['jogo_id', 'integer'],
      ['cliente_id', 'integer'],
      ['retirado_em', 'date'],
    ];
    var LINHAS_BASE = [
      ['1001', 'Elden Ring · Ana'],
      ['1002', 'Hollow Knight · Bruno'],
      ['1003', 'Baldurs Gate 3 · Carla'],
    ];
    var NOVAS = [
      ['1004', 'Stardew Valley · Diego'],
      ['1005', 'Hades · Ester'],
      ['1006', 'Celeste · Fábio'],
    ];

    var colunas, linhas, comDevolucao, entradas;
    var log = novoLog('a2-log');

    function zerar() {
      colunas = COLUNAS_BASE.slice();
      linhas = LINHAS_BASE.slice();
      comDevolucao = false;
      entradas = [];
      desenhar('Três empréstimos guardados, quatro colunas na tabela.');
    }

    function desenhar(legenda) {
      var alvoE = $('a2-esquema');
      alvoE.textContent = '';
      colunas.forEach(function (c, i) {
        alvoE.appendChild(linha(c[0], c[1], comDevolucao && i === colunas.length - 1 ? 'entrou' : ''));
      });

      var alvoI = $('a2-instancia');
      alvoI.textContent = '';
      if (!linhas.length) {
        alvoI.appendChild(el('p', 'vazio-painel', 'Nenhuma linha. A tabela continua existindo.'));
      } else {
        linhas.forEach(function (l, i) {
          alvoI.appendChild(linha('#' + l[0], l[1], i >= LINHAS_BASE.length ? 'entrou' : ''));
        });
      }

      $('a2-selo-esq').textContent = colunas.length + ' colunas';
      $('a2-selo-inst').textContent = linhas.length + (linhas.length === 1 ? ' linha' : ' linhas');
      $('a2-legenda').textContent = legenda;
      log.escrever(entradas, 'Nada executado ainda.');
      $('a2-coluna').disabled = comDevolucao;
    }

    inserir.addEventListener('click', function () {
      var nova = NOVAS[linhas.length - LINHAS_BASE.length];
      if (!nova) return;
      linhas = linhas.concat([nova]);
      entradas.push({
        ator: 'dml',
        sql: true,
        texto: "INSERT INTO emprestimo (jogo, cliente) VALUES ('" + nova[1].split(' · ')[0] + "', …)",
      });
      desenhar('Entrou uma linha. O esquema à esquerda não mudou uma vírgula.');
    });

    $('a2-apagar').addEventListener('click', function () {
      if (!linhas.length) return;
      linhas = [];
      entradas.push({ ator: 'dml', sql: true, texto: 'DELETE FROM emprestimo' });
      desenhar(
        'A tabela ficou vazia e continua existindo — com as mesmas colunas, esperando a próxima linha. Foi instância.'
      );
    });

    $('a2-coluna').addEventListener('click', function () {
      comDevolucao = true;
      colunas = colunas.concat([['devolvido_em', 'date']]);
      entradas.push({ ator: 'ddl', sql: true, texto: 'ALTER TABLE emprestimo ADD COLUMN devolvido_em date' });
      desenhar(
        'Agora sim mudou a forma: toda linha que existe e toda que vier passa a ter esse campo. Foi esquema.'
      );
    });

    $('a2-zerar').addEventListener('click', zerar);
    zerar();
  })();

  /* ================= 2. os tres niveis ================= */
  //
  // O MESMO registro renderizado de quatro jeitos. O erro comum da aula e
  // confundir "visao" com "tela do sistema"; ver duas visoes diferentes do
  // mesmo dado, uma sem o CPF, resolve isso melhor que a definicao.

  (function () {
    var caixa = $('a2-niveis');
    if (!caixa) return;

    var NIVEIS = [
      {
        id: 'fisico',
        nome: 'físico',
        quem: 'o SGBD, e mais ninguém',
        corpo: [
          ['bloco 4128, offset 96', '24 bytes'],
          ['\\x03e9 \\x07 \\x2a \\x32', 'os mesmos dados'],
          ['índice b-tree em cliente_id', 'para achar rápido'],
        ],
        legenda:
          'Bytes em blocos de disco, com índices para achar sem varrer tudo. Você não vai escrever nada neste nível — e é justamente esse o ponto: o PostgreSQL decide, e pode mudar de ideia amanhã.',
      },
      {
        id: 'conceitual',
        nome: 'conceitual',
        quem: 'você, nas aulas 3 a 11',
        corpo: [
          ['id', '1003'],
          ['jogo_id', '42'],
          ['cliente_id', '7'],
          ['retirado_em', '2026-10-06'],
        ],
        legenda:
          'A tabela como ela é: todas as colunas, uma vez só, sem repetição. É o nível que esta UC inteira desenha e escreve — o DER das aulas 3 a 9 e o CREATE TABLE da aula 11 vivem aqui.',
      },
      {
        id: 'atendente',
        nome: 'visão do atendente',
        quem: 'quem atende no balcão',
        corpo: [
          ['jogo', 'Baldurs Gate 3'],
          ['cliente', 'Carla'],
          ['retirado em', '06/10/2026'],
        ],
        legenda:
          'A mesma linha, sem id nenhum e sem o CPF da cliente. Não é outra tabela e não é uma cópia: é um recorte do mesmo dado, montado na hora. Quem atende não precisa do resto — e, no caso do CPF, não deve ter.',
      },
      {
        id: 'gerente',
        nome: 'visão do gerente',
        quem: 'quem olha o negócio',
        corpo: [
          ['jogo', 'Baldurs Gate 3'],
          ['vezes alugado no mês', '14'],
          ['média de dias com o cliente', '3,2'],
        ],
        legenda:
          'Outra visão do mesmo banco, e aqui nem linha individual aparece — só a conta. Duas pessoas olhando o mesmo dado ao mesmo tempo, vendo coisas diferentes, sem ninguém ter duplicado nada.',
      },
    ];

    var botoes = [];

    function mostrar(n) {
      botoes.forEach(function (b) {
        b.setAttribute('aria-pressed', b.dataset.id === n.id ? 'true' : 'false');
      });
      var corpo = $('a2-nivel-corpo');
      corpo.textContent = '';
      n.corpo.forEach(function (par) {
        corpo.appendChild(linha(par[0], par[1], n.id === 'conceitual' ? 'entrou' : ''));
      });
      $('a2-nivel-nome').textContent = 'nível ' + n.nome;
      $('a2-nivel-quem').textContent = n.quem;
      $('a2-nivel-legenda').textContent = n.legenda;
    }

    NIVEIS.forEach(function (n) {
      var b = el('button', 'camada-btn');
      b.type = 'button';
      b.dataset.id = n.id;
      b.style.setProperty('--cor', 'var(--accent)');
      b.setAttribute('aria-pressed', 'false');
      b.appendChild(el('span', 'ponto'));
      b.appendChild(el('span', null, n.nome));
      b.addEventListener('click', function () {
        mostrar(n);
      });
      botoes.push(b);
      caixa.appendChild(b);
    });
    mostrar(NIVEIS[1]);
  })();

  /* ================= 3. independencia de dados ================= */
  //
  // O payoff dos tres niveis, e a parte que so se sente vendo: o
  // armazenamento vira do avesso e a consulta continua a MESMA, caractere por
  // caractere. E por isso que separar os niveis vale a pena.

  (function () {
    var trocar = $('a3-trocar');
    if (!trocar) return;

    var CONSULTA = "SELECT jogo_id, retirado_em\n  FROM emprestimo\n WHERE cliente_id = 7";
    var ARMAZENS = [
      {
        nome: 'heap',
        corpo: [
          ['arquivo', 'base/16384/24601'],
          ['organização', 'linhas na ordem de chegada'],
          ['para achar cliente 7', 'varre a tabela inteira'],
        ],
      },
      {
        nome: 'b-tree',
        corpo: [
          ['arquivo', 'base/16384/24601 + índice'],
          ['organização', 'índice b-tree em cliente_id'],
          ['para achar cliente 7', 'desce a árvore, 3 saltos'],
        ],
      },
      {
        nome: 'particionado',
        corpo: [
          ['arquivo', 'uma partição por mês'],
          ['organização', 'emprestimo_2026_10, _11, _12'],
          ['para achar cliente 7', 'só nas partições que importam'],
        ],
      },
    ];

    var atual = 0;
    var log = novoLog('a3-log');

    function desenhar() {
      var arm = ARMAZENS[atual];
      var alvoF = $('a3-fisico');
      alvoF.textContent = '';
      arm.corpo.forEach(function (par, i) {
        alvoF.appendChild(linha(par[0], par[1], atual > 0 && i > 0 ? 'entrou' : ''));
      });

      var alvoC = $('a3-consulta');
      alvoC.textContent = '';
      var pre = el('pre', 'consulta');
      pre.appendChild(el('code', null, CONSULTA));
      alvoC.appendChild(pre);

      $('a3-selo-fis').textContent = arm.nome;
      $('a3-selo-con').textContent = atual === 0 ? 'sem mudança' : 'idêntica, ' + atual + 'ª troca';
      $('a3-legenda').textContent =
        atual === 0
          ? 'A tabela está guardada como um monte de linhas na ordem em que chegaram.'
          : 'O armazenamento virou do avesso. A consulta acima não mudou um caractere — e nem precisou ser recompilada.';

      log.comparar(
        atual === 0
          ? []
          : [
              {
                ator: 'servidor',
                marca: 'ganhou',
                linhas: [
                  { texto: 'trocou a organização física para ' + arm.nome, resultado: 'mudou' },
                  { texto: arm.corpo[2][1] },
                ],
              },
              {
                ator: 'voce',
                linhas: [
                  { sql: true, texto: 'SELECT … WHERE cliente_id = 7' },
                  { texto: 'o mesmo comando de antes', resultado: 'não mudou' },
                ],
              },
            ],
        atual === 0 ? null : { texto: 'É isso que os três níveis compram: mexer embaixo sem quebrar em cima.' },
        'Troque o armazenamento para comparar.'
      );
    }

    trocar.addEventListener('click', function () {
      atual = (atual + 1) % ARMAZENS.length;
      desenhar();
    });
    $('a3-zerar').addEventListener('click', function () {
      atual = 0;
      desenhar();
    });
    desenhar();
  })();

  /* ================= 4. DDL, DML, DCL ================= */

  (function () {
    var alvo = $('a2-comandos');
    if (!alvo) return;

    var COMANDOS = [
      ['CREATE TABLE jogo (…)', 'ddl', 'cria a forma: a tabela passa a existir, ainda sem nenhuma linha.'],
      ['ALTER TABLE jogo ADD COLUMN ano int', 'ddl', 'muda a forma de tudo que já existe e de tudo que vier.'],
      ['DROP TABLE jogo', 'ddl', 'apaga a forma — e, junto, o conteúdo. É o comando mais perigoso da lista.'],
      ['INSERT INTO jogo VALUES (…)', 'dml', 'acrescenta conteúdo. A forma nem fica sabendo.'],
      ['UPDATE jogo SET ano = 2024', 'dml', 'muda conteúdo que já está lá. A coluna ano continua sendo a mesma coluna.'],
      ['DELETE FROM jogo', 'dml', 'esvazia o conteúdo. A tabela continua existindo, vazia.'],
      ['GRANT SELECT ON jogo TO atendente', 'dcl', 'não mexe em forma nem em conteúdo: diz quem pode olhar.'],
      ['REVOKE DELETE ON jogo FROM atendente', 'dcl', 'tira uma permissão. É como o estagiário deixa de apagar a aba de clientes.'],
    ];
    var TOCA = { ddl: 'mexe no esquema', dml: 'mexe na instância', dcl: 'mexe em quem pode' };
    var QUANDO = { ddl: 'aulas 10 e 11', dml: 'aulas 12 a 15', dcl: 'aula 16' };

    COMANDOS.forEach(function (c) {
      var b = el('button', 'comando ' + c[1]);
      b.type = 'button';
      b.appendChild(el('code', null, c[0]));
      var fam = el('span', 'familia');
      fam.appendChild(el('b', null, c[1].toUpperCase()));
      fam.appendChild(el('span', null, TOCA[c[1]]));
      b.appendChild(fam);
      b.addEventListener('click', function () {
        Array.prototype.forEach.call(alvo.querySelectorAll('.comando'), function (o) {
          o.classList.remove('aceso');
        });
        b.classList.add('aceso');
        $('a2-cmd-legenda').textContent = c[2] + ' Você escreve isso nas ' + QUANDO[c[1]] + '.';
      });
      alvo.appendChild(b);
    });
  })();
})(window.DemoKit);
