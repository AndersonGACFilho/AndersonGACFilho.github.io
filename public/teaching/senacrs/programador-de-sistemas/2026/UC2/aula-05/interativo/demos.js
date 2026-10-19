/* demos.js — as demonstracoes da Aula 05.
 *
 * Chave e cardinalidade sao as duas decisoes que mais custam depois. As
 * quatro demos existem para o aluno ERRAR aqui, de graca, em vez de errar na
 * Aula 11 com o CREATE TABLE ja escrito.
 */
(function (kit) {
  'use strict';

  var $ = kit.$;
  var el = kit.el;
  var linha = kit.linha;
  var novoLog = kit.novoLog;

  /* ================= 1. duas clientes chamadas Ana Silva ================= */
  //
  // O erro comum da aula e usar nome como chave primaria. Dito, parece bobo;
  // feito, o UPDATE pega as duas e ninguem e avisado — e e a mesma historia
  // do lancamento perdido da Aula 01, agora por outro motivo.

  (function () {
    var atualizar = $('a5-atualizar');
    if (!atualizar) return;

    var NOVO = '97777-3333';
    var atualizado = false;
    var log = novoLog('a5-log');

    function desenhar() {
      var n = $('a5-por-nome');
      n.textContent = '';
      [['Ana Silva · 1984', atualizado ? NOVO : '99999-1111'],
       ['Ana Silva · 1991', atualizado ? NOVO : '98888-2222']].forEach(function (l, i) {
        n.appendChild(linha(l[0], l[1], atualizado ? (i === 1 ? 'sumiu' : 'entrou') : ''));
      });

      var d = $('a5-por-id');
      d.textContent = '';
      [['#7 Ana Silva · 1984', atualizado ? NOVO : '99999-1111'],
       ['#8 Ana Silva · 1991', '98888-2222']].forEach(function (l, i) {
        d.appendChild(linha(l[0], l[1], atualizado && i === 0 ? 'entrou' : ''));
      });

      $('a5-selo-nome').textContent = atualizado ? '2 linhas alteradas' : '2 linhas';
      $('a5-selo-id').textContent = atualizado ? '1 linha alterada' : '2 linhas';
      $('a5-painel-nome').classList.toggle('ruim', atualizado);
      $('a5-painel-id').classList.toggle('bom', atualizado);

      $('a5-legenda').textContent = atualizado
        ? 'Pelo nome, as duas mudaram: o telefone da cliente de 1991 foi sobrescrito, e ela nem sabe. Pelo id, mudou uma — a certa.'
        : 'Duas clientes, mesmo nome. Uma delas trocou de telefone; o sistema precisa saber qual.';

      log.comparar(
        !atualizado
          ? []
          : [
              {
                ator: 'campo',
                marca: 'perdeu',
                linhas: [
                  { sql: true, texto: "UPDATE cliente SET telefone = '" + NOVO + "' WHERE nome = 'Ana Silva'" },
                  { texto: 'pegou as duas, e nada acusou', resultado: '2 linhas' },
                ],
              },
              {
                ator: 'entidade',
                marca: 'ganhou',
                linhas: [
                  { sql: true, texto: "UPDATE cliente SET telefone = '" + NOVO + "' WHERE id = 7" },
                  { texto: 'pegou exatamente a que deveria', resultado: '1 linha' },
                ],
              },
            ],
        !atualizado
          ? null
          : { texto: 'Nome não identifica: homônimo existe, gente casa e troca de nome, e ninguém digita igual duas vezes.' },
        'Clique em "Trocar o telefone da Ana Silva".'
      );
      atualizar.disabled = atualizado;
    }

    atualizar.addEventListener('click', function () { atualizado = true; desenhar(); });
    $('a5-zerar').addEventListener('click', function () { atualizado = false; desenhar(); });
    desenhar();
  })();

  /* ================= 2. chave natural x artificial ================= */

  (function () {
    var caixa = $('a5-casos');
    if (!caixa) return;

    var CASOS = [
      {
        id: 'estrangeiro',
        nome: 'cliente estrangeiro',
        cpf: [['cpf', '?? não tem'], ['nome', 'Yuki Tanaka']],
        serial: [['id', '9'], ['cpf', 'NULL'], ['nome', 'Yuki Tanaka']],
        seloCpf: 'não cadastra',
        seloSerial: 'cadastra',
        ok: false,
        legenda:
          'A chave primária não aceita nulo, então sem CPF não há linha — e o cliente não entra no sistema. Com id artificial, o CPF vira um campo comum que pode faltar.',
      },
      {
        id: 'digitado',
        nome: 'CPF digitado errado',
        cpf: [['cpf', '011.222.333-44'], ['cpf', '01122233344']],
        serial: [['id', '7'], ['cpf', 'corrigido depois']],
        seloCpf: '2 linhas, 1 pessoa',
        seloSerial: 'corrige',
        ok: false,
        legenda:
          'Corrigir um CPF errado significa trocar a chave primária — e toda linha de outra tabela que apontava para ela. Com id, você corrige um campo e acabou.',
      },
      {
        id: 'vazamento',
        nome: 'o CPF no endereço',
        cpf: [['URL', '/cliente/01122233344'], ['risco', 'documento exposto']],
        serial: [['URL', '/cliente/7'], ['risco', 'nenhum']],
        seloCpf: 'vaza',
        seloSerial: 'neutro',
        ok: false,
        legenda:
          'A chave primária vaza para tudo: URL, log, arquivo de integração. Um id sequencial não diz nada sobre a pessoa; um CPF diz tudo.',
      },
      {
        id: 'quando',
        nome: 'quando a natural serve',
        cpf: [['sigla', 'RS'], ['nome', 'Rio Grande do Sul']],
        serial: [['id', '23'], ['sigla', 'RS']],
        seloCpf: 'serve',
        seloSerial: 'sobra',
        ok: true,
        legenda:
          'Nem sempre a artificial ganha. A sigla do estado não muda, não falta, não é sigilosa e já é curta — aqui o id seria uma coluna a mais sem função.',
      },
    ];

    var botoes = [];

    function mostrar(c) {
      botoes.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.id === c.id ? 'true' : 'false'); });
      var a = $('a5-cpf'); a.textContent = '';
      c.cpf.forEach(function (l) { a.appendChild(linha(l[0], l[1], c.ok ? 'entrou' : 'sumiu')); });
      var b2 = $('a5-serial'); b2.textContent = '';
      c.serial.forEach(function (l) { b2.appendChild(linha(l[0], l[1], c.ok ? '' : 'entrou')); });
      $('a5-selo-cpf').textContent = c.seloCpf;
      $('a5-selo-cpf').className = 'selo ' + (c.ok ? 'bom' : 'ruim');
      $('a5-selo-serial').textContent = c.seloSerial;
      $('a5-selo-serial').className = 'selo ' + (c.ok ? '' : 'bom');
      $('a5-painel-cpf').classList.toggle('ruim', !c.ok);
      $('a5-painel-serial').classList.toggle('bom', !c.ok);
      $('a5-caso-legenda').textContent = c.legenda;
    }

    CASOS.forEach(function (c) {
      var b = el('button', 'camada-btn');
      b.type = 'button';
      b.dataset.id = c.id;
      b.style.setProperty('--cor', 'var(--accent)');
      b.setAttribute('aria-pressed', 'false');
      b.appendChild(el('span', 'ponto'));
      b.appendChild(el('span', null, c.nome));
      b.addEventListener('click', function () { mostrar(c); });
      botoes.push(b);
      caixa.appendChild(b);
    });
    // sem isto a secao abre com dois paineis ocos, so cabecalho — buraco na
    // pagina, e nada diz que e preciso clicar antes
    mostrar(CASOS[0]);
  })();

  /* ================= 3. de que lado fica a chave estrangeira ================= */
  //
  // A pergunta que o slide faz. A resposta se enxerga quando a chave esta no
  // lado errado: o cliente passa a precisar de uma linha por emprestimo, e o
  // nome dele se repete em todas.

  (function () {
    var lado = $('a5-lado');
    if (!lado) return;

    var errado = false;

    function desenhar() {
      var t1 = $('a5-t1'), t2 = $('a5-t2');
      t1.textContent = ''; t2.textContent = '';

      if (!errado) {
        [['#1', 'Ana Souza'], ['#2', 'Bruno Lima']].forEach(function (l) {
          t1.appendChild(linha(l[0], l[1]));
        });
        [['20/10', 'cliente_id = 1'], ['21/10', 'cliente_id = 2'], ['22/10', 'cliente_id = 1']]
          .forEach(function (l) { t2.appendChild(linha(l[0], l[1], 'entrou')); });
        $('a5-t1-selo').textContent = '2 linhas';
        $('a5-t2-selo').textContent = 'a chave mora aqui';
      } else {
        [['#1 Ana Souza', 'emprestimo_id = 7'], ['#1 Ana Souza', '?? e o segundo empréstimo'], ['#2 Bruno Lima', 'emprestimo_id = 8']]
          .forEach(function (l, i) { t1.appendChild(linha(l[0], l[1], i === 1 ? 'sumiu' : '')); });
        [['20/10', '—'], ['21/10', '—'], ['22/10', '—']].forEach(function (l) {
          t2.appendChild(linha(l[0], l[1]));
        });
        $('a5-t1-selo').textContent = 'não cabe';
        $('a5-t2-selo').textContent = 'sem chave';
      }

      $('a5-painel-t1').classList.toggle('ruim', errado);
      $('a5-painel-t2').classList.toggle('bom', !errado);
      $('a5-fk-legenda').textContent = errado
        ? 'O cliente teria de repetir a linha inteira uma vez por empréstimo, e o nome "Ana Souza" junto. A regra sai sozinha: a chave estrangeira fica no lado do N — no lado de muitos.'
        : 'Cada empréstimo aponta para o seu cliente. O cliente não precisa saber nada: quem guarda a ligação é o lado que tem muitos.';
      lado.textContent = errado ? 'Pôr a chave do lado certo' : 'Pôr a chave do outro lado';
    }

    lado.addEventListener('click', function () { errado = !errado; desenhar(); });
    desenhar();
  })();

  /* ================= 4. a cardinalidade decide as tabelas ================= */

  (function () {
    var caixa = $('a5-cards');
    if (!caixa) return;

    var CARDS = [
      {
        id: '1-1',
        nome: '1:1',
        c1: '1', c2: '1',
        forma: 'a chave vai num dos dois lados',
        tabelas: [['cliente', 'id, nome'], ['endereco', 'id, logradouro, cliente_id ↗ ÚNICO']],
        selo: '2 tabelas',
        legenda:
          'Um cliente tem um endereço, e aquele endereço é de um cliente só. A chave vai no lado que pode faltar — nem todo cliente dá endereço — e o ÚNICO nela é o que impede o segundo. Sem o ÚNICO, isto seria um 1:N.',
      },
      {
        id: '1-n',
        nome: '1:N',
        c1: '1', c2: 'N',
        forma: 'uma chave estrangeira no lado do N',
        tabelas: [['cliente', 'id, nome'], ['emprestimo', 'id, data, cliente_id ↗']],
        selo: '2 tabelas',
        legenda:
          'Um cliente faz muitos empréstimos; cada empréstimo é de um cliente. A chave fica no lado de muitos, sempre — é o caso mais comum de todos.',
      },
      {
        id: 'n-n',
        nome: 'N:N',
        c1: 'N', c2: 'N',
        forma: 'uma tabela no meio, com as duas chaves',
        tabelas: [['emprestimo', 'id, data'], ['jogo', 'id, titulo'], ['item_emprestimo', 'emprestimo_id ↗, jogo_id ↗, preco_pago']],
        selo: '3 tabelas',
        legenda:
          'Um empréstimo leva muitos jogos, e um jogo entra em muitos empréstimos. Não cabe chave em nenhum dos dois lados: nasce uma terceira tabela — e é nela que o preço cobrado vai morar.',
      },
    ];

    var botoes = [];

    function mostrar(c) {
      botoes.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.id === c.id ? 'true' : 'false'); });
      $('a5-c1').textContent = c.c1;
      $('a5-c2').textContent = c.c2;
      $('a5-card-forma').textContent = c.forma;
      $('a5-card-legenda').textContent = c.legenda;
      $('a5-card-selo').textContent = c.selo;
      var alvo = $('a5-card-tabelas');
      alvo.textContent = '';
      c.tabelas.forEach(function (t, i) {
        alvo.appendChild(linha(t[0], t[1], c.id === 'n-n' && i === 2 ? 'entrou' : ''));
      });
    }

    CARDS.forEach(function (c) {
      var b = el('button', 'camada-btn');
      b.type = 'button';
      b.dataset.id = c.id;
      b.style.setProperty('--cor', 'var(--accent)');
      b.setAttribute('aria-pressed', 'false');
      b.appendChild(el('span', 'ponto'));
      b.appendChild(el('span', null, c.nome));
      b.addEventListener('click', function () { mostrar(c); });
      botoes.push(b);
      caixa.appendChild(b);
    });
    mostrar(CARDS[1]);
  })();
})(window.DemoKit);
