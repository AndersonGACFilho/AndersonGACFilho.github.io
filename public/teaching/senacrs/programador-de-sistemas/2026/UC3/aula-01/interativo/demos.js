/* demos.js — UC3, Aula 01: o elif que esconde o defeito, e quantos testes bastam.
 *
 * O slide rastreia o elif numa tabela. A tabela convence quem le com calma; a
 * turma le rapido e concorda. Aqui a pessoa escolhe a ordem, PALPITA o menor
 * antes de rodar (fraqueza n. 1 do DIDATICA.md), e ve o codigo andar aluguel
 * por aluguel, com o ramo que rodou escrito no registro. O inf aparece na tela
 * dela, depois de ela ter apostado em outra coisa.
 *
 * A segunda demo pede que a pessoa PRODUZA a suite (fraqueza n. 2): ligar e
 * desligar testes ate achar a menor que ainda pega o defeito.
 */
(function (K) {
  'use strict';
  var $ = K.$, el = K.el, linha = K.linha, novoLog = K.novoLog, escolhas = K.escolhas, palpite = K.palpite,
    alternancias = K.alternancias, itemTeste = K.itemTeste;

  var real = function (v) {
    if (v === Infinity) return '+∞';
    if (v === -Infinity) return '−∞';
    return 'R$ ' + v.toFixed(2).replace('.', ',');
  };

  /* ================= 1. a ordem que esconde o defeito ================= */

  (function () {
    if (!$('u3a1-passo')) return;
    var log = novoLog('u3a1-log');

    var ORDENS = [
      { id: 'cresc', nome: 'crescente — 25, 30, 40', valores: [25, 30, 40] },
      { id: 'fora', nome: 'fora de ordem — 30, 40, 25', valores: [30, 40, 25] },
      { id: 'decr', nome: 'decrescente — 40, 30, 25', valores: [40, 30, 25] },
      { id: 'um', nome: 'um aluguel só — 30', valores: [30] },
    ];
    var ordem, i, maior, menor, consertado = false, aposta = null, entradas;

    var palpites = palpite('u3a1-palpite', [
      { id: 'menor', nome: 'o menor valor da lista' },
      { id: 'inf', nome: '+∞, infinito' },
    ], function (op) {
      // depois do fim nao ha o que rodar: o palpite nunca seria conferido
      if (i === ordem.valores.length) return false;
      aposta = op;
      $('u3a1-legenda').textContent = 'Palpite registrado. Agora rode: "Próximo aluguel", ou tudo de uma vez.';
    });

    function recomecar() {
      i = 0; maior = -Infinity; menor = Infinity; entradas = [];
      aposta = null; palpites.limpar();
      log.escrever([], 'Escolha um palpite e rode o primeiro aluguel.');
      $('u3a1-legenda').textContent = 'Palpite primeiro: que menor você acha que sai no fim?';
      desenhar();
    }

    function desenhar() {
      var lista = $('u3a1-lista'), est = $('u3a1-estado');
      lista.textContent = ''; est.textContent = '';
      ordem.valores.forEach(function (v, k) {
        // o proximo a ser lido fica aceso; os ja lidos ficam neutros — vermelho
        // aqui diria que o aluguel esta errado, e o errado e o codigo
        lista.appendChild(linha((k < i ? '✓ ' : '') + 'aluguel ' + (k + 1), real(v), k === i ? 'achou' : ''));
      });
      $('u3a1-selo-lista').textContent = i + ' de ' + ordem.valores.length + ' lidos';
      est.appendChild(linha('maior', real(maior)));
      // vermelho sem risco: o +inf e o valor que o relatorio de fato mostra
      est.appendChild(linha('menor', real(menor), menor === Infinity && i === ordem.valores.length ? 'velha' : ''));
      $('u3a1-selo-estado').textContent = consertado ? 'com dois if' : 'com elif';

      var fim = i === ordem.valores.length;
      $('u3a1-passo').disabled = fim;
      $('u3a1-tudo').disabled = fim;
      var errado = fim && menor === Infinity;
      $('u3a1-painel-estado').classList.toggle('ruim', errado);
      $('u3a1-painel-estado').classList.toggle('bom', fim && !errado);
    }

    function passo() {
      if (i >= ordem.valores.length) return;
      var v = ordem.valores[i];
      var desc;
      if (v > maior) {
        maior = v;
        desc = 'if ' + v + ' > maior: entrou — maior vira ' + v;
        if (consertado && v < menor) { menor = v; desc += '; e o segundo if: menor vira ' + v; }
        else if (!consertado) desc += '; o elif nem foi perguntado';
      } else if (v < menor) {
        menor = v;
        desc = (consertado ? 'if ' : 'elif ') + v + ' < menor: entrou — menor vira ' + v;
      } else {
        desc = v + ' não é maior nem menor: nada muda';
      }
      entradas.push({ hora: 'aluguel ' + (i + 1), ator: 'codigo', texto: desc });
      i += 1;
      log.escrever(entradas);
      desenhar();
      if (i === ordem.valores.length) concluir();
    }

    function concluir() {
      var certo = Math.min.apply(null, ordem.valores);
      var saiu = menor === Infinity ? 'inf' : 'menor';
      var frase = menor === Infinity
        ? 'O menor ficou em +∞: nenhum aluguel entrou no elif. O defeito virou falha com esta entrada.'
        : 'O menor saiu ' + real(certo) + ', certo — com esta entrada o defeito não aparece, mesmo existindo.';
      if (consertado) frase = 'Com dois if, cada aluguel é perguntado as duas vezes: o menor sai ' + real(certo) + ' em qualquer ordem.';
      if (aposta) frase = (aposta.id === saiu ? 'Seu palpite bateu. ' : 'Seu palpite não bateu. ') + frase;
      $('u3a1-legenda').textContent = frase;
    }

    escolhas('u3a1-ordem', ORDENS, function (o) { ordem = o; recomecar(); });

    $('u3a1-passo').addEventListener('click', passo);
    $('u3a1-tudo').addEventListener('click', function () {
      while (i < ordem.valores.length) passo();
    });
    $('u3a1-conserto').addEventListener('click', function () {
      consertado = !consertado;
      this.textContent = consertado ? 'Voltar ao elif' : 'Trocar o elif por if';
      recomecar();
    });
  })();

  /* ================= 2. quantos testes bastam ================= */

  (function () {
    if (!$('u3a1-candidatos')) return;
    var log = novoLog('u3a1-log2');

    var TESTES = [
      { id: 't1', nome: '10, 20, 30', valores: [10, 20, 30], classe: 'crescente' },
      { id: 't2', nome: '5, 15, 25', valores: [5, 15, 25], classe: 'crescente' },
      { id: 't3', nome: '30, 20, 10', valores: [30, 20, 10], classe: 'decrescente' },
      { id: 't4', nome: '20, 10, 30', valores: [20, 10, 30], classe: 'fora de ordem' },
      { id: 't5', nome: '99', valores: [99], classe: 'um aluguel só' },
      { id: 't6', nome: '7', valores: [7], classe: 'um aluguel só' },
    ];
    var CLASSES = ['crescente', 'decrescente', 'fora de ordem', 'um aluguel só'];
    var ligados = {};

    // o relatorio COM o defeito: e contra ele que a suite e julgada
    function menorComElif(valores) {
      var maior = -Infinity, menor = Infinity;
      valores.forEach(function (v) {
        if (v > maior) maior = v;
        else if (v < menor) menor = v;
      });
      return menor;
    }

    function desenhar() {
      var lista = $('u3a1-suite'), cls = $('u3a1-classes');
      lista.textContent = ''; cls.textContent = '';
      var escolhidos = TESTES.filter(function (t) { return ligados[t.id]; });
      var entradas = [], pega = false, porClasse = {};

      escolhidos.forEach(function (t, k) {
        var esperado = Math.min.apply(null, t.valores);
        var obtido = menorComElif(t.valores);
        var passou = obtido === esperado;
        if (!passou) pega = true;
        porClasse[t.classe] = (porClasse[t.classe] || 0) + 1;
        lista.appendChild(itemTeste(t.nome, passou,
          t.classe + ' · ' + (passou ? 'passou' : 'esperava ' + esperado + ', veio ' + real(obtido)), k));
        entradas.push({ ator: 'pytest', texto: 'assert menor == ' + esperado, sql: true,
          resultado: passou ? 'passou' : 'FALHOU' });
      });
      if (!escolhidos.length) {
        lista.appendChild(el('li', 'teste nem-rodou', 'nenhum teste ligado — uma suíte vazia passa sempre, e não prova nada'));
      }

      CLASSES.forEach(function (c) {
        var n = porClasse[c] || 0;
        // repetido nao e ausente: fica neutro, e o texto diz que sobra
        cls.appendChild(linha(c, n === 0 ? 'nenhum teste' : n === 1 ? '1 teste' : n + ' testes — ' + (n - 1) + ' a mais', n === 0 ? 'velha' : n > 1 ? '' : 'achou'));
      });

      var redundantes = CLASSES.reduce(function (s, c) { return s + Math.max(0, (porClasse[c] || 0) - 1); }, 0);
      var cobertas = CLASSES.filter(function (c) { return porClasse[c]; }).length;
      $('u3a1-selo-suite').textContent = escolhidos.length === 1 ? '1 teste' : escolhidos.length + ' testes';
      $('u3a1-selo-classes').textContent = cobertas + ' de 4 classes';
      $('u3a1-painel-suite').classList.toggle('bom', pega);
      $('u3a1-painel-suite').classList.toggle('ruim', escolhidos.length > 0 && !pega);

      var frase;
      if (!escolhidos.length) frase = 'Ligue pelo menos um teste.';
      else if (!pega) frase = 'Tudo verde — e o defeito continua lá. Nenhum teste ligado é da classe que faz o elif falhar.';
      else if (redundantes) frase = 'Pegou o defeito. Mas ' + (redundantes === 1 ? '1 teste repete' : redundantes + ' testes repetem') + ' uma classe já coberta: dá para tirar sem perder nada.';
      else if (cobertas < 4) frase = 'Pegou o defeito, sem repetição. ' + (cobertas === 3 ? 'Falta cobrir 1 classe' : 'Faltam cobrir ' + (4 - cobertas) + ' classes') + ': o próximo defeito pode morar nelas.';
      else frase = 'Quatro testes, quatro classes, o defeito pego. É a suíte do slide: um por classe, nenhum sobrando.';
      $('u3a1-legenda2').textContent = frase;
      log.escrever(entradas, 'Nenhum teste rodou.');
    }

    var acender = alternancias('u3a1-candidatos', TESTES, function (t) { return 'teste ' + t.nome; }, function (t) {
      ligados[t.id] = !ligados[t.id];
      acender(ligado);
      desenhar();
    });
    function ligado(t) { return !!ligados[t.id]; }
    // Abre com a suite "do jeito que todo mundo faz": dois testes crescentes e
    // um decrescente — o painel nao nasce vazio, e ja mostra a repeticao.
    ['t1', 't2', 't3'].forEach(function (id) { ligados[id] = true; });
    acender(ligado);
    desenhar();
  })();
})(window.DemoKit);
