/* demos.js — as demonstracoes da Aula 03.
 *
 * A aula ensina a tirar um modelo de uma conversa. O que e dificil nisso nao
 * e a notacao: e perceber que TODA decisao de modelagem so cobra a conta
 * depois, quando o requisito muda. Duas das quatro demos existem para isso.
 */
(function (kit) {
  'use strict';

  var $ = kit.$;
  var el = kit.el;
  var linha = kit.linha;
  var novoLog = kit.novoLog;

  /* ================= 1. onde passa a borda ================= */
  //
  // O minimundo nao vem pronto: alguem decide onde ele acaba. Marcando e
  // desmarcando frases, o aluno ve a lista de entidades encolher e crescer —
  // e ve que "a locadora abre as 9h" nao vira nada, por mais verdadeiro que
  // seja.

  (function () {
    var lista = $('a3b-frases');
    if (!lista) return;

    var FRASES = [
      { t: 'Preciso saber quais jogos eu tenho e de que gênero é cada um.', da: ['JOGO'], dentro: true },
      { t: 'Quero cadastrar o cliente com nome, telefone e CPF.', da: ['CLIENTE'], dentro: true },
      { t: 'Cada empréstimo tem data de retirada e data de devolução.', da: ['EMPRESTIMO'], dentro: true },
      { t: 'A locadora abre às 9h e fecha às 19h.', da: [], dentro: false, fora: 'É verdade, e não é dado que se guarda: não muda, não tem várias, não vira linha.' },
      { t: 'Meu contador cuida do imposto.', da: [], dentro: false, fora: 'Está fora da borda. Outro sistema, outro problema — e cada coisa dessas que entra é uma tabela a manter.' },
      { t: 'Quero saber quantas vezes cada jogo foi alugado no mês.', da: [], dentro: true, relatorio: 'Isso é pergunta, não dado. Sai de EMPRESTIMO com uma contagem — modelar o relatório é o erro comum da aula.' },
    ];

    var dentro = FRASES.map(function (f) { return f.dentro; });

    function desenhar() {
      lista.textContent = '';
      FRASES.forEach(function (f, i) {
        var li = el('li');
        var b = el('button', 'frase' + (dentro[i] ? ' dentro' : ''));
        b.type = 'button';
        b.setAttribute('aria-pressed', dentro[i] ? 'true' : 'false');
        b.appendChild(el('span', 'marca', dentro[i] ? '✓' : '+'));
        b.appendChild(el('span', null, f.t));
        b.addEventListener('click', function () {
          dentro[i] = !dentro[i];
          desenhar(i);
        });
        li.appendChild(b);
        lista.appendChild(li);
      });

      var ents = [];
      FRASES.forEach(function (f, i) {
        if (dentro[i]) f.da.forEach(function (e) { if (ents.indexOf(e) === -1) ents.push(e); });
      });

      var alvo = $('a3b-entidades');
      alvo.textContent = '';
      if (!ents.length) {
        alvo.appendChild(el('p', 'vazio-painel', 'Nada para modelar ainda.'));
      } else {
        ents.forEach(function (e) { alvo.appendChild(linha(e, 'entidade', 'entrou')); });
      }

      var n = dentro.filter(Boolean).length;
      $('a3b-selo-frases').textContent = n + ' dentro';
      $('a3b-selo-ent').textContent = ents.length + (ents.length === 1 ? ' entidade' : ' entidades');
      return ents;
    }

    function desenharCom(i) {
      var ents = desenhar();
      var f = FRASES[i];
      var texto;
      if (i === undefined) {
        texto = 'Marque e desmarque. Repare que nem toda frase verdadeira vira tabela.';
      } else if (!dentro[i]) {
        texto = 'Fora da borda. ' + (f.fora || 'Sem essa frase, some o que ela trazia.');
      } else if (f.relatorio) {
        texto = f.relatorio;
      } else if (!f.da.length) {
        texto = f.fora || 'Dentro, mas não acrescentou entidade nenhuma.';
      } else {
        texto = 'Entrou, e trouxe ' + f.da.join(' e ') + ' junto.';
      }
      $('a3b-legenda').textContent = texto;
    }

    // a primeira pintura nao tem frase clicada
    var original = desenhar;
    desenhar = function (i) {
      original();
      if (i !== undefined) desenharCom(i);
    };
    original();
    $('a3b-legenda').textContent = 'Três frases já estão dentro. Marque e desmarque para ver o que cada uma traz.';
  })();

  /* ================= 2. os tres testes ================= */
  //
  // A tabela de vereditos do slide, feita a mao. Ver o teste FALHAR num
  // candidato — "catalogo" morrendo na primeira pergunta — ensina mais que
  // ler o veredito pronto.

  (function () {
    var caixa = $('a3t-candidatos');
    if (!caixa) return;

    var TESTES = ['Existe mais de um?', 'Tem mais de um dado dentro?', 'Precisa ser guardado separado?'];
    var CANDIDATOS = [
      { n: 'CLIENTE', r: [true, true, true], v: 'entidade',
        p: 'Vários clientes, cada um com nome, telefone e CPF, e todos precisam viver independentes do empréstimo. Entidade.' },
      { n: 'JOGO', r: [true, true, true], v: 'entidade',
        p: 'Mesma coisa: vários, com título, gênero e ano, e o jogo existe mesmo sem ninguém ter alugado.' },
      { n: 'locadora', r: [false, null, null], v: 'não é',
        p: 'Morre na primeira pergunta: existe uma só. Guardar uma linha numa tabela para sempre ter uma linha não resolve nada.' },
      { n: 'gênero', r: [true, false, null], v: 'campo, por enquanto',
        p: 'Vários existem, mas cada um é só um nome. Vira campo de JOGO — até o dia em que o gênero precisar de descrição ou faixa etária. Aí promove.' },
      { n: 'catálogo', r: [false, null, null], v: 'não é',
        p: 'A armadilha clássica. Parece entidade e é só o nome coletivo do conjunto de jogos: a tabela jogo já é o catálogo. Acervo, estoque, cardápio e elenco caem na mesma.' },
    ];

    var botoes = [];
    var lista = $('a3t-testes');

    function avaliar(c) {
      botoes.forEach(function (b) {
        b.setAttribute('aria-pressed', b.dataset.n === c.n ? 'true' : 'false');
      });
      lista.textContent = '';
      TESTES.forEach(function (t, i) {
        var r = c.r[i];
        var li = el('li', 'teste ' + (r === true ? 'passou' : r === false ? 'falhou' : 'nem-rodou'));
        li.style.setProperty('--atraso', i * 0.18 + 's');
        li.appendChild(el('span', 'sinal', r === true ? '✓' : r === false ? '✕' : '–'));
        li.appendChild(el('span', 'pergunta-teste', t));
        li.appendChild(el('span', 'resposta', r === true ? 'sim' : r === false ? 'não' : 'nem chegou a rodar'));
        lista.appendChild(li);
      });
      $('a3t-legenda').textContent = c.n + ' → ' + c.v + '. ' + c.p;
    }

    CANDIDATOS.forEach(function (c) {
      var b = el('button', 'camada-btn');
      b.type = 'button';
      b.dataset.n = c.n;
      b.style.setProperty('--cor', 'var(--accent)');
      b.setAttribute('aria-pressed', 'false');
      b.appendChild(el('span', 'ponto'));
      b.appendChild(el('span', null, c.n));
      b.addEventListener('click', function () { avaliar(c); });
      botoes.push(b);
      caixa.appendChild(b);
    });
  })();

  /* ================= 3. a mesma frase, duas modelagens ================= */
  //
  // As duas cabem na frase original, e e por isso que a escolha parece
  // inofensiva. A conta chega quando o requisito muda: de um lado e um
  // ALTER e uma migracao de dados; do outro, uma linha nova.

  (function () {
    var mudar = $('a3m-mudar');
    if (!mudar) return;

    var mudou = false;
    var log = novoLog('a3m-log');

    function desenhar() {
      var campo = $('a3m-campo');
      campo.textContent = '';
      [['jogo.titulo', 'Elden Ring'], ['jogo.genero', mudou ? 'RPG, Ação' : 'RPG']].forEach(function (par, i) {
        campo.appendChild(linha(par[0], par[1], mudou && i === 1 ? 'sumiu' : ''));
      });
      if (mudou) campo.appendChild(el('p', 'vazio-painel', 'Dois gêneros num campo só: ou vira texto com vírgula, ou vira genero2. Os dois quebram a busca por gênero.'));

      var ent = $('a3m-ent');
      ent.textContent = '';
      [['jogo', 'Elden Ring'], ['jogo_genero', 'Elden Ring · RPG']].concat(
        mudou ? [['jogo_genero', 'Elden Ring · Ação']] : []
      ).forEach(function (par, i) {
        ent.appendChild(linha(par[0], par[1], mudou && i === 2 ? 'entrou' : ''));
      });

      $('a3m-selo-campo').textContent = mudou ? 'quebrou' : 'cabe';
      $('a3m-selo-ent').textContent = mudou ? 'aguentou' : 'cabe';
      $('a3m-painel-campo').classList.toggle('ruim', mudou);
      $('a3m-painel-ent').classList.toggle('bom', mudou);

      $('a3m-legenda').textContent = mudou
        ? '"Na verdade um jogo pode ter mais de um gênero." A frase mudou uma palavra; de um lado isso é uma linha nova, do outro é uma migração.'
        : 'As duas modelagens cabem na frase "todo jogo tem um gênero". É por isso que a escolha parece inofensiva na hora.';

      log.comparar(
        !mudou
          ? []
          : [
              {
                ator: 'campo',
                marca: 'perdeu',
                linhas: [
                  { sql: true, texto: 'ALTER TABLE jogo ADD COLUMN genero2 text' },
                  { texto: 'e reescrever toda consulta que filtra por gênero', resultado: 'migração' },
                ],
              },
              {
                ator: 'entidade',
                marca: 'ganhou',
                linhas: [
                  { sql: true, texto: "INSERT INTO jogo_genero VALUES (1, 'Ação')" },
                  { texto: 'nenhuma consulta muda', resultado: '1 linha' },
                ],
              },
            ],
        !mudou ? null : { texto: 'Nenhuma das duas estava errada ontem. Uma delas envelheceu melhor.' },
        'Clique em "O dono muda de ideia".'
      );
    }

    mudar.addEventListener('click', function () { mudou = true; desenhar(); });
    $('a3m-zerar').addEventListener('click', function () { mudou = false; desenhar(); });
    desenhar();
  })();

  /* ================= 4. o verbo da o nome ================= */

  (function () {
    var frase = $('a3v-frase');
    if (!frase) return;

    var PALAVRAS = [
      { p: 'O cliente', v: false },
      { p: 'aluga', v: true, nome: 'ALUGA', ok: 'É o verbo, e vira o nome do relacionamento. Repare que ele já diz o sentido: é o cliente que aluga o jogo, e não o contrário.' },
      { p: 'o jogo', v: false },
      { p: 'por', v: false },
      { p: 'sete dias', v: false },
      { p: 'e', v: false },
      { p: 'devolve', v: true, nome: 'DEVOLVE', ok: 'Também é verbo, e daria outro relacionamento entre as mesmas duas entidades. Nem todo verbo da frase vira um: "devolve" aqui é o fim do mesmo empréstimo, não uma ligação nova.' },
      { p: 'no balcão.', v: false },
    ];

    PALAVRAS.forEach(function (w) {
      if (!w.v) {
        frase.appendChild(document.createTextNode(w.p + ' '));
        return;
      }
      var b = el('button', 'verbo');
      b.type = 'button';
      b.textContent = w.p;
      b.addEventListener('click', function () {
        Array.prototype.forEach.call(frase.querySelectorAll('.verbo'), function (o) {
          o.classList.remove('escolhido');
        });
        b.classList.add('escolhido');
        $('a3v-nome').textContent = w.nome;
        $('a3v-legenda').textContent = w.ok;
      });
      frase.appendChild(b);
      frase.appendChild(document.createTextNode(' '));
    });
  })();
})(window.DemoKit);
