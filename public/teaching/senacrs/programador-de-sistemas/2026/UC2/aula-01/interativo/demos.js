/* demos.js — as demonstracoes da Aula 01.
 *
 * Ficam AQUI, ao lado da pagina, e nao em _comum/: o que se repete entre
 * aulas mora no demo-kit.js; uma demonstracao nao se reaproveita, porque cada
 * aula demonstra outra coisa.
 *
 * Script classico, mesmo motivo do kit: a pagina tem de abrir com duplo
 * clique no arquivo quando a internet do laboratorio cair.
 */
(function (kit) {
  'use strict';

  var $ = kit.$;
  var el = kit.el;
  var linha = kit.linha;
  var novoLog = kit.novoLog;

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
      $('d1-intro').textContent = comSgbd
        ? 'Ana e Bruno lançam ao mesmo tempo, cada um pela tela dele.'
        : 'Ana e Bruno abrem a mesma planilha com um minuto de diferença.';
      registrar();
      proximo.disabled = passo >= 6;
    }

    // O painel mostra o ESTADO; o registro mostra a OPERACAO que levou ate
    // ele. No modo SGBD a operacao e o que a aula ensina: quem manda o INSERT
    // nao escolhe o id — o servidor grava, gera e devolve.
    var LOG_PLANILHA = [
      [1, '19h02', 'ana', 'baixou uma cópia de emprestimos.xlsx (2 linhas)'],
      [2, '19h03', 'bruno', 'baixou uma cópia de emprestimos.xlsx (2 linhas)'],
      [3, '19h05', 'ana', 'escreveu #1003 Baldurs Gate 3 na cópia dela'],
      [4, '19h06', 'bruno', 'escreveu #1003 Stardew Valley na cópia dele — o último que ele vê é o #1002'],
      [5, '19h10', 'ana', 'enviou a cópia dela'],
      [5, '19h10', 'servidor', 'substituiu o arquivo pela cópia da Ana (3 linhas)'],
      [6, '19h11', 'bruno', 'enviou a cópia dele'],
      [6, '19h11', 'servidor', 'substituiu o arquivo pela cópia do Bruno (3 linhas)', 'perdeu'],
      [6, '', 'servidor', 'o #1003 da Ana não está mais em lugar nenhum, e ninguém foi avisado', 'perdeu'],
    ];

    var LOG_SGBD = [
      [1, '19h02', 'ana', 'abriu a tela de lançamento'],
      [2, '19h03', 'bruno', 'abriu a tela de lançamento'],
      [3, '19h05', 'ana', 'escolheu Baldurs Gate 3 — sem número, porque não é ela quem numera'],
      [4, '19h06', 'bruno', 'escolheu Stardew Valley — também sem número'],
      [5, '19h10', 'ana', 'INSERT INTO emprestimo (jogo) VALUES (\'Baldurs Gate 3\')', '', 'sql'],
      [5, '19h10', 'servidor', 'gravou, gerou id = 1003 e devolveu', 'ganhou'],
      [6, '19h11', 'bruno', 'INSERT INTO emprestimo (jogo) VALUES (\'Stardew Valley\')', '', 'sql'],
      [6, '19h11', 'servidor', 'gravou, gerou id = 1004 e devolveu', 'ganhou'],
      [6, '', 'servidor', 'os dois INSERT entraram, com números diferentes, sem ninguém combinar nada', 'ganhou'],
    ];

    var log1 = novoLog('d1-log');

    function registrar() {
      var fonte = comSgbd ? LOG_SGBD : LOG_PLANILHA;
      log1.escrever(
        fonte
          .filter(function (e) { return e[0] <= passo; })
          .map(function (e) {
            return { hora: e[1], ator: e[2], texto: e[3], marca: e[4], sql: e[5] === 'sql' };
          })
      );
    }

    // Quatro estados, nao dois. O selo dizia 'preenchendo' com o formulario
    // em branco, porque um array vazio e verdadeiro em JavaScript — o painel
    // mostrava 'Formulário em branco' e o selo dizia o contrario.
    function seloPessoa(painel, enviou) {
      if (!painel) return comSgbd ? 'tela fechada' : 'fechada';
      if (!comSgbd) return 'aberta';
      if (enviou) return 'enviado';
      return painel.length ? 'preenchendo' : 'em branco';
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

    var log2 = novoLog('d2-log');

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

      // A MESMA consulta nos dois lados. O que muda nao e o comando: e o que
      // esta guardado. Escrever o SQL aqui mostra que o banco nao "adivinha"
      // grafia — quem tem de estar certo e o dado.
      var termo = busca.value.trim();
      var consulta = "SELECT * FROM emprestimo WHERE jogo LIKE '%" + termo + "%'";
      log2.comparar(
        termo === ''
          ? []
          : [
              {
                ator: 'planilha',
                marca: contas[0] < contas[1] ? 'perdeu' : '',
                linhas: [{ sql: true, texto: consulta, resultado: contas[0] + ' linha(s)' }],
              },
              {
                ator: 'banco',
                marca: contas[1] > contas[0] ? 'ganhou' : '',
                linhas: [{ sql: true, texto: consulta, resultado: contas[1] + ' linha(s)' }],
              },
            ],
        termo === ''
          ? null
          : contas[0] === contas[1]
            ? { texto: 'Mesma consulta, mesma resposta — aqui a grafia não atrapalha.' }
            : {
                texto:
                  'Mesma consulta, respostas diferentes. O comando está certo dos dois lados; o que está errado é o dado.',
                marca: 'perdeu',
              },
        'Digite para ver a consulta.'
      );
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

    var log3 = novoLog('d3-log');

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

      // Um UPDATE de uma linha contra catorze edicoes a mao: e a diferenca
      // inteira, e ela cabe em duas linhas de registro.
      log3.comparar(
        !trocado
          ? []
          : [
              {
                ator: 'planilha',
                marca: 'perdeu',
                linhas: [
                  { texto: 'procurou o telefone antigo e reescreveu linha por linha', resultado: '11 de 14' },
                  { texto: '3 linhas ficaram com o número velho, e nada acusou' },
                ],
              },
              {
                ator: 'banco',
                marca: 'ganhou',
                linhas: [
                  {
                    sql: true,
                    texto: "UPDATE cliente SET telefone = '" + NOVO + "' WHERE id = 7",
                    resultado: '1 linha',
                  },
                  { texto: 'os 14 empréstimos apontam para essa ficha, então os 14 já veem o número novo' },
                ],
              },
            ],
        !trocado
          ? null
          : {
              texto:
                'Catorze edições à mão contra um UPDATE de uma linha. A diferença não é o esforço: é que num lado dá para esquecer, e no outro não há o que esquecer.',
            },
        'Clique em "Ana troca de número".'
      );

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
  //
  // Escolhe-se a CAMADA, nao a caixa. Clicar em `jogo` acende as tres tabelas,
  // porque a frase que a demo ensina e "jogo e UMA tabela" — cliente e
  // emprestimo tambem sao, e acender so uma dizia o contrario.

  (function () {
    var escolha = $('d5-escolha');
    if (!escolha) return;
    var legenda = $('d5-legenda');

    var CAMADAS = [
      ['sgbd', 'SGBD', 'PostgreSQL é o SGBD: o programa que guarda e serve os dados. Um SGBD pode ter vários bancos, e é dele que você recebe a porta 5432 e o usuário.'],
      ['banco', 'banco de dados', 'locadora é o banco de dados: tudo o que é daquele negócio. Outro negócio, no mesmo PostgreSQL, seria outro banco — e um não enxerga o outro.'],
      ['schema', 'schema', 'public é o schema: a gaveta dentro do banco onde as tabelas moram. Todo banco PostgreSQL já nasce com essa gaveta, e nesta UC você não vai precisar criar outra. Ela existe para separar assuntos num banco grande — vendas e estoque no mesmo banco, cada um no seu schema.'],
      ['tabela', 'tabela', 'jogo, cliente e emprestimo são tabelas: cada uma guarda as linhas de um tipo de coisa. As três estão acesas porque as três são tabelas.'],
    ];

    var caixas = Array.prototype.slice.call(document.querySelectorAll('.nivel'));
    var botoes = [];

    function acender(nivel) {
      caixas.forEach(function (c) {
        c.classList.toggle('acesa', c.dataset.nivel === nivel);
      });
      botoes.forEach(function (b) {
        b.setAttribute('aria-pressed', b.dataset.nivel === nivel ? 'true' : 'false');
      });
      var achou = CAMADAS.filter(function (c) { return c[0] === nivel; })[0];
      if (achou) legenda.textContent = achou[2];
    }

    CAMADAS.forEach(function (c) {
      var b = el('button', 'camada-btn');
      b.type = 'button';
      b.dataset.nivel = c[0];
      b.style.setProperty('--cor', 'var(--cor-' + c[0] + ')');
      b.setAttribute('aria-pressed', 'false');
      b.appendChild(el('span', 'ponto'));
      b.appendChild(el('span', null, c[1]));
      b.addEventListener('click', function () {
        acender(c[0]);
      });
      botoes.push(b);
      escolha.appendChild(b);
    });

    // os botoes herdam as cores declaradas na .pilha
    var pilha = document.querySelector('.pilha');
    if (pilha) {
      var lidas = getComputedStyle(pilha);
      CAMADAS.forEach(function (c, i) {
        botoes[i].style.setProperty('--cor', lidas.getPropertyValue('--cor-' + c[0]).trim());
      });
    }

    caixas.forEach(function (caixa) {
      caixa.addEventListener('click', function (ev) {
        // sem isto, clicar numa tabela acenderia tabela, depois banco, depois
        // SGBD, e a ultima a rodar venceria
        ev.stopPropagation();
        acender(caixa.dataset.nivel);
      });
    });
  })();

  /* ================= 6. linha do tempo ================= */

  (function () {
    var alvo = $('d6');
    if (!alvo) return;

    // Cada marco com EXEMPLO e com o que doia nele. Sem o exemplo, "modelo
    // hierarquico" e so um nome numa linha do tempo; com o IMS da IBM rodando
    // a folha de pagamento, vira uma coisa que existiu e que alguem manteve.
    var MARCOS = [
      {
        ano: 'anos 1960',
        nome: 'Hierárquico',
        curto: 'IMS',
        dia: 'dia-hierarquico',
        exemplo: 'IMS, da IBM — escrito para o programa Apollo e ainda vivo em banco e seguradora.',
        forma: 'Os dados em árvore: cada registro tem um pai só. Um cliente tem pedidos; um pedido pertence a um cliente.',
        doia: 'Descer a árvore era rápido. Atravessar era péssimo: "quais clientes compraram este produto?" obrigava a varrer tudo, porque o caminho ia do cliente para o produto e não de volta.',
      },
      {
        ano: 'anos 1970',
        nome: 'Em rede',
        curto: 'CODASYL',
        dia: 'dia-rede',
        exemplo: 'CODASYL, e o IDMS que rodava nos mainframes das operadoras.',
        forma: 'A árvore vira grafo: um registro pode ter vários pais, ligados por ponteiros declarados no esquema.',
        doia: 'Atravessar ficou possível, mas o programa tinha de navegar ponteiro por ponteiro. Quem escrevia a consulta precisava conhecer o caminho físico até o dado — e mudar o caminho quebrava o programa.',
      },
      {
        ano: '1970',
        nome: 'Relacional',
        curto: 'Codd, IBM',
        dia: 'dia-relacional',
        exemplo: 'O artigo de Edgar F. Codd na IBM; depois System R, Ingres, Oracle e, em 1986, o POSTGRES que virou PostgreSQL.',
        forma: 'Tudo em tabelas, ligadas por valores em comum — não por ponteiros. O jogo e o empréstimo se encontram porque compartilham um id, não porque alguém traçou um caminho.',
        doia: 'Deixou de doer: você diz O QUE quer, e quem decide COMO buscar é o SGBD. É por isso que as tabelas venceram, e é o modelo desta UC inteira.',
      },
      {
        ano: 'anos 2000',
        nome: 'NoSQL',
        curto: 'MongoDB, Redis, Neo4j',
        dia: 'dia-nosql',
        exemplo: 'MongoDB (documentos), Redis (chave-valor), Neo4j (grafos), Cassandra (colunas).',
        forma: 'Abre mão de partes do relacional — esquema fixo, junções, às vezes consistência imediata — em troca de escala ou de um formato que cai melhor no problema.',
        doia: 'Não substituiu nada: resolve casos específicos e quase sempre convive com um banco relacional ao lado. Cache de sessão no Redis, catálogo sem formato fixo no Mongo, e o dinheiro continua no PostgreSQL.',
      },
    ];
    var legenda = $('d6-legenda');

    MARCOS.forEach(function (m) {
      var li = el('li');
      var b = el('button', 'marco');
      b.type = 'button';
      b.appendChild(el('span', 'ano', m.ano));
      b.appendChild(el('span', 'nome', m.nome));
      b.appendChild(el('span', 'ex', m.curto));
      b.addEventListener('click', function () {
        Array.prototype.forEach.call(alvo.querySelectorAll('.marco'), function (o) {
          o.classList.remove('ativo');
        });
        b.classList.add('ativo');
        // um diagrama por vez: animacao rodando fora do que se esta lendo e ruido
        Array.prototype.forEach.call(document.querySelectorAll('.diagrama'), function (f) {
          f.hidden = f.id !== m.dia;
        });
        legenda.textContent = '';
        [['Exemplo', m.exemplo], ['Como era', m.forma], ['O que doía', m.doia]].forEach(function (par) {
          var p = el('p', 'verbete');
          p.appendChild(el('b', null, par[0] + ': '));
          p.appendChild(document.createTextNode(par[1]));
          legenda.appendChild(p);
        });
      });
      li.appendChild(b);
      alvo.appendChild(li);
    });
  })();
})(window.DemoKit);
