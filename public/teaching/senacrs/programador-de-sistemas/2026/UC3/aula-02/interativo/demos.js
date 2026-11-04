/* demos.js — UC3, Aula 02: a fronteira da multa, e o teste que confere so o tamanho.
 *
 * O slide mostra a tabela 2/3/4 pronta, com o "falha" escrito na linha do 3.
 * Quem le a tabela concorda; quem escolheu 1, 5 e 10 no papel nao percebe que
 * a escolha dele era o problema. Aqui a pessoa ESCOLHE os tres dias (fraqueza
 * n. 2 do DIDATICA.md), PALPITA o resultado (fraqueza n. 1), e so depois ve o
 * codigo rodar dia a dia — com o unico dia em que o > e o >= discordam aceso.
 *
 * A segunda demo faz a regressao acontecer de verdade: o teste novo passa, e
 * quem fica vermelho e o de ontem. E depois o contrario: o codigo devolve os
 * tres menores, e o assert do len continua verde.
 */
(function (K) {
  'use strict';
  var $ = K.$, el = K.el, linha = K.linha, novoLog = K.novoLog, escolhas = K.escolhas, palpite = K.palpite,
    alternancias = K.alternancias, itemTeste = K.itemTeste;

  var real = function (v) {
    return 'R$ ' + v.toFixed(2).replace('.', ',');
  };
  // o float do Python: 15.0, nao 15 — e o que aparece no assert e no pytest
  var py = function (v) {
    return Number.isInteger(v) ? v + '.0' : String(v);
  };

  /* ================= 1. tres testes, so tres ================= */

  (function () {
    if (!$('u3a2-rodar')) return;
    var log = novoLog('u3a2-log');

    var DIAS = [0, 1, 2, 3, 4, 5, 10];
    // Abre com 1, 5 e 10: o roteiro registra que e o trio que a turma mais
    // escolhe no papel — longe da fronteira. O painel nao nasce vazio, e o
    // aluno pode trocar antes de rodar.
    var escolhidos = [1, 5, 10];
    var operador = '>';
    var rodou = false;
    var aposta = null;

    function dono(d) { return d >= 3 ? d * 5 : 0; }
    function codigo(d, op) { return (op === '>' ? d > 3 : d >= 3) ? d * 5 : 0; }
    function nomeDia(d) { return d === 1 ? '1 dia' : d + ' dias'; }
    function ordenados() { return escolhidos.slice().sort(function (a, b) { return a - b; }); }

    var palpites = palpite('u3a2-palpite', [
      { id: 'verde', nome: 'fica todo verde' },
      { id: 'vermelho', nome: 'mostra algum vermelho' },
    ], function (op) {
      aposta = op;
      $('u3a2-legenda').textContent = 'Palpite registrado. Agora rode o pytest.';
    });

    // Qualquer mudanca na suite ou no codigo invalida a rodada anterior: o
    // resultado na tela tem de ser o do codigo e da suite que estao la agora.
    function invalidar(frase) {
      rodou = false;
      aposta = null;
      palpites.limpar();
      log.escrever([], 'Nenhum teste rodou ainda.');
      $('u3a2-legenda').textContent = frase || 'Palpite primeiro: a suíte vai ficar toda verde?';
      desenhar();
    }

    function desenhar() {
      var lista = $('u3a2-suite'), regua = $('u3a2-regua');
      lista.textContent = ''; regua.textContent = '';
      var vermelhos = 0;

      ordenados().forEach(function (d, k) {
        var esperado = dono(d), obtido = codigo(d, operador);
        var passou = esperado === obtido;
        if (rodou && !passou) vermelhos += 1;
        lista.appendChild(itemTeste('assert multa(' + d + ') == ' + py(esperado), rodou ? passou : null,
          !rodou ? 'não rodou' : passou ? 'passou' : 'veio ' + py(obtido), k));
      });
      if (!escolhidos.length) {
        lista.appendChild(el('li', 'teste nem-rodou', 'nenhum teste ligado — uma suíte vazia passa sempre, e não prova nada'));
      }

      var discordam = 0;
      DIAS.forEach(function (d) {
        var obtido = codigo(d, operador);
        var difere = obtido !== dono(d);
        if (difere) discordam += 1;
        var valor = 'dono ' + real(dono(d)) + ' · código ' + (rodou ? real(obtido) : '?');
        // vermelho so onde o codigo erra; aceso (sem cor de erro) onde a suite toca
        var classe = rodou && difere ? 'velha' : escolhidos.indexOf(d) !== -1 ? 'achou' : '';
        regua.appendChild(linha((escolhidos.indexOf(d) !== -1 ? '◆ ' : '') + nomeDia(d), valor, classe));
      });

      $('u3a2-nota-codigo').textContent = 'O código, agora: if dias_atraso ' + operador + ' 3. O ◆ marca os dias que a sua suíte testa.';
      $('u3a2-selo-suite').textContent = !rodou ? escolhidos.length + ' de 3 testes'
        : vermelhos ? vermelhos + ' vermelho' : 'tudo verde';
      $('u3a2-selo-regua').textContent = !rodou ? 'código não rodou'
        : discordam ? 'discordam em ' + (discordam === 1 ? '1 dia' : discordam + ' dias') : 'concordam em tudo';

      $('u3a2-painel-regua').classList.toggle('ruim', rodou && discordam > 0);
      $('u3a2-painel-regua').classList.toggle('bom', rodou && discordam === 0);
      $('u3a2-painel-suite').classList.toggle('bom', rodou && vermelhos > 0);
      $('u3a2-rodar').disabled = !escolhidos.length;
    }

    function rodar() {
      if (!escolhidos.length) return;
      rodou = true;
      var entradas = [], vermelhos = 0;
      // a mesma suite contra o OUTRO operador: se o resultado nao muda, ela nao
      // distingue > de >= — e isso que a frase final precisa dizer
      var outro = operador === '>' ? '>=' : '>';
      var distingue = false;

      ordenados().forEach(function (d) {
        var esperado = dono(d), obtido = codigo(d, operador);
        var entra = operador === '>' ? d > 3 : d >= 3;
        var passou = obtido === esperado;
        if (!passou) vermelhos += 1;
        if ((codigo(d, outro) === esperado) !== passou) distingue = true;
        entradas.push({ hora: 'multa(' + d + ')', ator: 'codigo',
          texto: 'if ' + d + ' ' + operador + ' 3 é ' + (entra ? 'verdadeiro' : 'falso') + ': devolve ' + py(obtido) });
        entradas.push({ ator: 'pytest', sql: true, texto: 'assert multa(' + d + ') == ' + py(esperado),
          resultado: passou ? 'passou' : 'FALHOU' });
      });
      log.escrever(entradas);
      desenhar();

      var saiu = vermelhos ? 'vermelho' : 'verde';
      var frase;
      if (vermelhos) {
        frase = 'Vermelho no 3º dia: o > deixa o próprio 3 de fora, e só o teste em cima da fronteira vê isso.';
      } else if (operador === '>') {
        frase = 'Tudo verde — e o código erra no 3º dia, que nenhum teste seu tocou. Troque o > por >= e rode de novo.';
      } else if (distingue) {
        frase = 'Com >=, o dono e o código concordam em todos os dias, e o teste do 3º dia agora passa.';
      } else {
        frase = 'Verde de novo, com o >= — e também estava verde com o >. Sem o dia 3, a sua suíte não sabe a diferença.';
      }
      if (aposta) frase = (aposta.id === saiu ? 'Seu palpite bateu. ' : 'Seu palpite não bateu. ') + frase;
      $('u3a2-legenda').textContent = frase;
    }

    function escolhido(d) { return escolhidos.indexOf(d) !== -1; }
    var acender = alternancias('u3a2-dias', DIAS, nomeDia, function (d) {
      var i = escolhidos.indexOf(d), frase;
      if (i !== -1) {
        escolhidos.splice(i, 1);
      } else {
        escolhidos.push(d);
        // o limite de tres e o que obriga a escolher; o mais antigo sai, para
        // a troca ser um clique so
        if (escolhidos.length > 3) {
          var saiu = escolhidos.shift();
          frase = 'Só três: o teste de ' + nomeDia(saiu) + ' saiu. Palpite de novo antes de rodar.';
        }
      }
      acender(escolhido);
      invalidar(frase);
    });
    acender(escolhido);

    $('u3a2-rodar').addEventListener('click', rodar);
    $('u3a2-conserto').addEventListener('click', function () {
      operador = operador === '>' ? '>=' : '>';
      this.textContent = operador === '>' ? 'Trocar o > por >=' : 'Voltar ao >';
      invalidar('Código trocado para ' + operador + '. Palpite de novo: a sua suíte percebe a diferença?');
    });

    invalidar();
  })();

  /* ================= 2. o teste novo passou. e os antigos? ================= */

  (function () {
    if (!$('u3a2-rodar2')) return;
    var log = novoLog('u3a2-log2');

    // A suite do gabarito da Aula 02: os quatro de ontem (com o relatorio ja
    // consertado — dois if) e o teste novo dos tres maiores.
    var TESTES = [
      { nome: 'test_entende_alugueis_em_ordem_crescente', valores: [25, 30, 40] },
      { nome: 'test_entende_alugueis_em_ordem_decrescente', valores: [40, 30, 25] },
      { nome: 'test_entende_alugueis_fora_de_ordem', valores: [30, 40, 25] },
      { nome: 'test_um_aluguel_so_e_o_maior_e_o_menor', valores: [30] },
      { nome: 'test_encontra_os_tres_maiores', valores: [10, 20, 30, 40], novo: true },
    ];
    var VERSOES = [
      { id: 'indice', nome: 'por índice, range(3)', reverse: true, fatia: false,
        codigo: 'valores = sorted([a.valor for a in alugueis], reverse=True)\nself.tres_maiores = [valores[i] for i in range(3)]' },
      { id: 'fatia', nome: 'com a fatia [:3]', reverse: true, fatia: true,
        codigo: 'valores = sorted([a.valor for a in alugueis], reverse=True)\nself.tres_maiores = valores[:3]' },
      { id: 'semrev', nome: 'fatia, sem o reverse=True', reverse: false, fatia: true,
        codigo: 'valores = sorted([a.valor for a in alugueis])\nself.tres_maiores = valores[:3]' },
    ];
    var ASSERTS = [
      { id: 'len', nome: 'len(relatorio.tres_maiores) == 3' },
      { id: 'lista', nome: 'relatorio.tres_maiores == [40.0, 30.0, 20.0]' },
    ];
    var versao = VERSOES[0], conferencia = ASSERTS[0], rodou = false, aposta = null;
    var pronto = false;

    function lista(vs) { return '[' + vs.map(py).join(', ') + ']'; }

    // o avaliar como o slide o escreve: por indice, o range(3) estoura com
    // menos de tres aluguéis, e o IndexError derruba o avaliar inteiro
    function avaliar(valores) {
      var v = valores.slice().sort(function (a, b) { return versao.reverse ? b - a : a - b; });
      if (!versao.fatia && v.length < 3) return { erro: 'IndexError: list index out of range' };
      return { tres: v.slice(0, 3) };
    }

    function julgar(t) {
      var r = avaliar(t.valores);
      if (r.erro) return { passou: false, motivo: r.erro };
      if (!t.novo) return { passou: true };   // maior e menor ja estao certos desde ontem
      if (conferencia.id === 'len') return { passou: r.tres.length === 3, motivo: 'veio ' + r.tres.length + ' itens' };
      var ok = lista(r.tres) === '[40.0, 30.0, 20.0]';
      return { passou: ok, motivo: 'veio ' + lista(r.tres) };
    }

    var palpites = palpite('u3a2-palpite2', [
      { id: 'verde', nome: 'tudo verde' },
      { id: 'novo', nome: 'só o teste novo fica vermelho' },
      { id: 'antigo', nome: 'um teste de ontem fica vermelho' },
    ], function (op) {
      aposta = op;
      $('u3a2-legenda2').textContent = 'Palpite registrado. Agora rode a suíte inteira.';
    });

    function invalidar() {
      rodou = false;
      aposta = null;
      palpites.limpar();
      log.escrever([], 'A suíte ainda não rodou com esta versão.');
      $('u3a2-legenda2').textContent = 'Palpite primeiro: o que acontece com a suíte inteira?';
      desenhar();
    }

    function desenhar() {
      $('u3a2-codigo').textContent = versao.codigo;
      var saidas = $('u3a2-saidas'), suite = $('u3a2-suite2');
      saidas.textContent = ''; suite.textContent = '';

      var quatro = avaliar([10, 20, 30, 40]), um = avaliar([30]);
      var quatroErrado = !quatro.erro && lista(quatro.tres) !== '[40.0, 30.0, 20.0]';
      // vermelho so no valor errado de fato — e so depois de rodar, senao a cor
      // entregaria a resposta antes do palpite
      saidas.appendChild(linha('com 10, 20, 30 e 40', rodou ? lista(quatro.tres) : '?', rodou && quatroErrado ? 'velha' : ''));
      saidas.appendChild(linha('com um aluguel só, de 30', rodou ? (um.erro ? 'IndexError' : lista(um.tres)) : '?', rodou && um.erro ? 'velha' : ''));

      var vermelhos = 0;
      TESTES.forEach(function (t, k) {
        var j = julgar(t);
        if (rodou && !j.passou) vermelhos += 1;
        suite.appendChild(itemTeste(t.nome, rodou ? j.passou : null,
          (t.novo ? 'novo · ' : 'de ontem · ') + (!rodou ? 'não rodou' : j.passou ? 'passou' : j.motivo), k));
      });

      var errado = quatroErrado || !!um.erro;
      $('u3a2-selo-codigo').textContent = !rodou ? 'não rodou' : errado ? 'resultado errado' : 'resultado certo';
      $('u3a2-selo-suite2').textContent = !rodou ? '5 testes' : vermelhos ? vermelhos + ' vermelho' : '5 verdes';
      $('u3a2-painel-codigo').classList.toggle('ruim', rodou && errado);
      $('u3a2-painel-codigo').classList.toggle('bom', rodou && !errado);
    }

    function rodar() {
      rodou = true;
      var entradas = [], antigoVermelho = false, novoVermelho = false;
      TESTES.forEach(function (t) {
        var j = julgar(t);
        if (!j.passou && t.novo) novoVermelho = true;
        if (!j.passou && !t.novo) antigoVermelho = true;
        entradas.push({ ator: 'pytest', sql: true, texto: t.nome,
          resultado: j.passou ? 'PASSED' : 'FAILED — ' + j.motivo.replace(': list index out of range', '') });
      });
      log.escrever(entradas);
      desenhar();

      var saiu = antigoVermelho ? 'antigo' : novoVermelho ? 'novo' : 'verde';
      var frase;
      if (antigoVermelho) {
        frase = 'O teste novo passou; quem ficou vermelho foi o de ontem. Com um aluguel só, valores[1] não existe e o avaliar inteiro quebra: é regressão.';
      } else if (novoVermelho) {
        frase = 'Agora o teste novo pega: ele confere o conteúdo, e na ordem — e os três menores não são os três maiores.';
      } else if (versao.id === 'semrev') {
        frase = 'Tudo verde — e o código devolve os três menores. São três, então o len fica satisfeito: o teste confere o que nunca esteve em dúvida.';
      } else if (conferencia.id === 'len') {
        frase = 'Tudo verde: a fatia pega até três, sem estourar. Mas esse assert só conta itens — escolha a versão sem o reverse e rode de novo.';
      } else {
        frase = 'Tudo verde, e desta vez o verde quer dizer alguma coisa: o assert confere os valores e a ordem.';
      }
      if (aposta) frase = (aposta.id === saiu ? 'Seu palpite bateu. ' : 'Seu palpite não bateu. ') + frase;
      $('u3a2-legenda2').textContent = frase;
    }

    // escolhas() chama o primeiro item ja na montagem; `pronto` evita desenhar
    // antes de os dois grupos existirem
    escolhas('u3a2-versao', VERSOES, function (v) { versao = v; if (pronto) invalidar(); });
    escolhas('u3a2-assert', ASSERTS, function (a) { conferencia = a; if (pronto) invalidar(); });
    pronto = true;
    $('u3a2-rodar2').addEventListener('click', rodar);
    invalidar();
  })();
})(window.DemoKit);
