/* demos.js — UC3, Aula 03: o ciclo do TDD sobre o Emprestimo da locadora.
 *
 * O deck diz "vermelho, e era isso que a gente queria". Dito, ninguem
 * discorda; o que a turma nao viveu e o teste que fica VERDE na hora errada.
 * Aqui a pessoa escreve o teste (fraqueza n. 2 do DIDATICA.md), palpita antes
 * de cada rodada (fraqueza n. 1), e so pode escrever codigo depois de ter
 * visto o vermelho — o botao fica desligado ate la, que e a regra do ciclo
 * escrita na interface. Entre os testes que ela pode escrever esta o do
 * slide 17, de cabeca para baixo: verde sem a regra, vermelho com ela.
 *
 * A segunda demo e a lista do cliente fiel, fora de ordem como no slide 22.
 * Quem comeca pelo "fiel nao leva o 5o" ve um vermelho que pede tres mudancas
 * de uma vez. E o teste dos 10 emprestimos nasce verde — e so ele percebe
 * quando o > e quebrado de proposito para >=.
 *
 * Os testes e o codigo seguem docs/gabaritos/UC3/aula-03/; as mensagens de
 * erro sao as do deck (slides 13 a 15).
 */
(function (K) {
  'use strict';
  var $ = K.$, novoLog = K.novoLog, palpite = K.palpite, alternancias = K.alternancias;

  // O resultado de uma rodada vira o <li> do kit: `r` e null quando o teste
  // ainda nao rodou contra o codigo atual.
  function itemTeste(nome, r, k) {
    return K.itemTeste(nome, r ? r.ok : null, !r ? 'não rodou' : r.ok ? 'passou' : r.msg, k);
  }

  var PALPITES = [
    { id: 'verde', nome: 'toda verde' },
    { id: 'vermelho', nome: 'com algum vermelho' },
  ];

  /* ================= 1. vermelho antes do verde ================= */

  (function () {
    if (!$('u3a3-rodar')) return;
    var log = novoLog('u3a3-log');

    // os dois do Bloco 1, escritos DEPOIS do codigo: verdes desde o comeco
    var BASE = [
      { id: 'um', nome: 'test_recebe_um_jogo' },
      { id: 'varios', nome: 'test_recebe_varios_jogos' },
    ];
    var CANDIDATOS = [
      { id: 'A', nome: 'test_nao_aceita_o_mesmo_jogo_duas_vezes', pilula: 'o mesmo jogo duas vezes, com pytest.raises', regra: 'repetido' },
      // o do slide 17: adiciona Zelda duas vezes e confere "Zelda" in jogos
      { id: 'B', nome: 'test_o_mesmo_jogo_duas_vezes', pilula: 'o mesmo jogo duas vezes, com assert "Zelda" in jogos', regra: null },
      { id: 'C', nome: 'test_nao_aceita_mais_de_3_jogos', pilula: 'no máximo 3 jogos, com pytest.raises', regra: 'limite' },
    ];
    var POR_ID = {};
    CANDIDATOS.forEach(function (c) { POR_ID[c.id] = c; });

    var suite, cod, resultados, novos, rodada, entradas, aposta;

    function julgar(id) {
      if (id === 'A' || id === 'C') {
        var regra = POR_ID[id].regra;
        return cod[regra] ? { ok: true } : { ok: false, msg: 'DID NOT RAISE ValueError' };
      }
      // de cabeca para baixo: o segundo adicionar so falha quando a regra existe
      if (id === 'B') return cod.repetido ? { ok: false, msg: 'ValueError: Esse jogo já está no empréstimo.' } : { ok: true };
      return { ok: true };
    }

    function textoCodigo() {
      var l = ['def adicionar(self, jogo):'];
      if (cod.refatorado) {
        l.push('    if self._ja_tem(jogo):',
          '        raise ValueError("Esse jogo já está no empréstimo.")',
          '    if self._lotado():',
          '        raise ValueError(f"Já são {LIMITE_DE_JOGOS} jogos.")',
          '    self.jogos.append(jogo)',
          '',
          'def _ja_tem(self, jogo):',
          '    return jogo in self.jogos',
          '',
          'def _lotado(self):',
          '    return len(self.jogos) >= LIMITE_DE_JOGOS');
        return l.join('\n');
      }
      if (cod.repetido) l.push('    if jogo in self.jogos:', '        raise ValueError("Esse jogo já está no empréstimo.")');
      if (cod.limite) l.push('    if len(self.jogos) >= 3:', '        raise ValueError("Já são 3 jogos.")');
      l.push('    self.jogos.append(jogo)');
      return l.join('\n');
    }

    var palpites = palpite('u3a3-palpite', PALPITES, function (op) {
      aposta = op;
      $('u3a3-legenda').textContent = 'Palpite registrado. Agora rode o pytest.';
    });

    var acender = alternancias('u3a3-candidatos', CANDIDATOS, function (c) { return c.pilula; }, function (c) {
      var i = suite.indexOf(c.id);
      if (i !== -1) {
        suite.splice(i, 1);
        entradas.push({ ator: 'voce', texto: 'apagou ' + c.nome });
        invalidar('Teste apagado. Palpite e rode de novo.');
      } else {
        suite.push(c.id);
        novos[c.id] = true;
        entradas.push({ ator: 'voce', texto: 'escreveu ' + c.nome });
        invalidar('Teste escrito, e o adicionar não mudou. Palpite: a suíte fica toda verde?');
      }
    });

    // o resultado na tela tem de ser o do codigo e da suite que estao la agora
    function invalidar(frase) {
      resultados = null;
      aposta = null;
      palpites.limpar();
      $('u3a3-legenda').textContent = frase;
      desenhar();
    }

    function vermelhoComRegraFaltando() {
      if (!resultados) return null;
      for (var k = 0; k < suite.length; k += 1) {
        var c = POR_ID[suite[k]];
        if (c.regra && !cod[c.regra] && !resultados[c.id].ok) return c;
      }
      return null;
    }

    function tudoVerde() {
      if (!resultados) return false;
      return Object.keys(resultados).every(function (id) { return resultados[id].ok; });
    }

    function desenhar() {
      var ul = $('u3a3-testes');
      ul.textContent = '';
      var vermelhos = 0;
      BASE.concat(suite.map(function (id) { return POR_ID[id]; })).forEach(function (t, k) {
        var r = resultados && resultados[t.id];
        if (r && !r.ok) vermelhos += 1;
        ul.appendChild(itemTeste(t.nome, r, k));
      });
      $('u3a3-codigo').textContent = textoCodigo();
      acender(function (c) { return suite.indexOf(c.id) !== -1; });

      $('u3a3-selo-testes').textContent = !resultados ? 'não rodou'
        : vermelhos ? (vermelhos === 1 ? '1 vermelho' : vermelhos + ' vermelhos') : 'tudo verde';
      $('u3a3-selo-codigo').textContent = cod.refatorado ? 'refatorado'
        : ((cod.repetido ? 1 : 0) + (cod.limite ? 1 : 0)) + ' de 2 regras';

      // codigo so depois do vermelho: e a regra do ciclo, na interface
      $('u3a3-codar').disabled = !vermelhoComRegraFaltando();
      $('u3a3-refatorar').disabled = !(cod.repetido && cod.limite && !cod.refatorado && tudoVerde());
      log.escrever(entradas);
    }

    function rodar() {
      resultados = {};
      BASE.forEach(function (t) { resultados[t.id] = julgar(t.id); });
      suite.forEach(function (id) { resultados[id] = julgar(id); });
      rodada += 1;

      var red = Object.keys(resultados).filter(function (id) { return !resultados[id].ok; });
      var saiu = red.length ? 'vermelho' : 'verde';
      // a hora da rodada vai na primeira linha dela: o palpite, quando houver
      var hora = 'rodada ' + rodada;
      if (aposta) {
        entradas.push({ hora: hora, ator: 'voce', texto: 'palpite: ' + (aposta.id === 'verde' ? 'toda verde' : 'algum vermelho'), resultado: aposta.id === saiu ? 'bateu' : 'não bateu' });
        hora = '';
      }
      var total = Object.keys(resultados).length;
      entradas.push({ hora: hora, ator: 'pytest',
        texto: red.length ? red.map(function (id) { return POR_ID[id].nome + ': ' + resultados[id].msg; }).join('; ') : 'todos verdes',
        resultado: (total - red.length) + ' de ' + total + ' verdes' });

      var frase;
      var bNovo = novos.B && suite.indexOf('B') !== -1;
      if (suite.indexOf('B') !== -1 && !resultados.B.ok) {
        frase = 'O teste com in ficou vermelho justo quando a regra passou a existir: ele está de cabeça para baixo. Apague-o; quem testa a regra é o com pytest.raises.';
      } else if (bNovo && resultados.B.ok) {
        frase = 'Verde de primeira, sem nenhuma linha nova. Desconfie: "Zelda" in jogos é verdade com um Zelda e com dois.';
      } else if (vermelhoComRegraFaltando()) {
        frase = red.length > 1
          ? 'Dois vermelhos, e os dois por DID NOT RAISE: as regras não existem. Um ciclo por vez — o código mais simples escreve só a do primeiro.'
          : 'Vermelho, e é boa notícia: a regra ainda não existe, e o teste sabe perceber isso. Agora, o código mais simples.';
      } else if (cod.refatorado) {
        frase = 'Verde depois de refatorar: o comportamento é o mesmo, e você sabe disso porque rodou, não porque olhou.';
      } else if (cod.repetido && cod.limite) {
        frase = 'Tudo verde, o teste novo e os de antes. Agora dá para arrumar o código sem medo: refatore.';
      } else if (!suite.some(function (id) { return POR_ID[id].regra; })) {
        // so o teste do in na suite: verde, mas nenhuma regra tem teste
        frase = suite.length
          ? 'Verde — mas o teste do in não testa regra nenhuma. Nenhuma regra nova tem teste ainda.'
          : 'Os dois de sempre, verdes. Nenhuma regra nova tem teste ainda.';
      } else {
        frase = 'Verde, o teste novo e os de antes. Falta a outra regra: o teste dela vem primeiro.';
      }
      if (aposta) frase = (aposta.id === saiu ? 'Seu palpite bateu. ' : 'Seu palpite não bateu. ') + frase;
      novos = {};
      aposta = null;
      palpites.limpar();
      $('u3a3-legenda').textContent = frase;
      desenhar();
    }

    function escreverCodigo() {
      var c = vermelhoComRegraFaltando();
      if (!c) return;
      cod[c.regra] = true;
      entradas.push({ ator: 'codigo', sql: true, texto: c.regra === 'repetido'
        ? '+ if jogo in self.jogos: raise ValueError(...)'
        : '+ if len(self.jogos) >= 3: raise ValueError(...)' });
      invalidar('Só a regra do ' + c.nome + ', e nada além. Palpite e rode de novo.');
    }

    function refatorar() {
      cod.refatorado = true;
      entradas.push({ ator: 'codigo', texto: 'extrai _ja_tem() e _lotado(); o 3 vira LIMITE_DE_JOGOS' });
      invalidar('Refatorado: mesmo comportamento, nomes que dizem o que fazem. Como você sabe que nada quebrou? Palpite e rode.');
    }

    function recomecar() {
      suite = [];
      cod = { repetido: false, limite: false, refatorado: false };
      novos = {};
      rodada = 0;
      aposta = null;
      palpites.limpar();
      resultados = { um: { ok: true }, varios: { ok: true } };
      entradas = [{ hora: 'antes', ator: 'pytest', texto: 'os dois testes do Bloco 1, escritos depois do código', resultado: '2 de 2 verdes' }];
      $('u3a3-legenda').textContent = 'O adicionar só faz append. Escolha o primeiro teste a escrever.';
      desenhar();
    }

    $('u3a3-rodar').addEventListener('click', rodar);
    $('u3a3-codar').addEventListener('click', escreverCodigo);
    $('u3a3-refatorar').addEventListener('click', refatorar);
    $('u3a3-recomecar').addEventListener('click', recomecar);
    recomecar();
  })();

  /* ================= 2. por onde comecar ================= */

  (function () {
    if (!$('u3a3-rodar2')) return;
    var log = novoLog('u3a3-log2');

    // As tres mudancas que a regra do cliente fiel pede, na ordem do gabarito:
    // o metodo existir, a regra dos 10, e o _lotado perguntar ao cliente.
    var MUDANCAS = {
      M: { ordem: 0, motivo: 'o Cliente não tem limite_de_jogos()', log: '+ def limite_de_jogos(self): return LIMITE_DE_JOGOS' },
      R: { ordem: 1, motivo: 'a regra dos mais de 10 não existe', log: '+ if self.emprestimos_anteriores > 10: return 4' },
      L: { ordem: 2, motivo: 'o _lotado() ainda não pergunta ao cliente', log: '_lotado() passa a usar self.cliente.limite_de_jogos()' },
    };
    // a lista do slide 22, fora de ordem de proposito: o mais chamativo primeiro
    var LISTA = [
      { id: 'c5', nome: 'test_cliente_fiel_nao_leva_5_jogos', pilula: 'o cliente fiel não leva o 5º jogo', precisa: ['M', 'R', 'L'] },
      { id: 'o11', nome: 'test_cliente_com_11_emprestimos_leva_4', pilula: 'um cliente com 11 empréstimos leva 4 jogos', precisa: ['M', 'R'] },
      { id: 'novo', nome: 'test_cliente_novo_leva_3', pilula: 'o cliente novo continua levando 3', precisa: ['M'] },
      { id: 'd10', nome: 'test_cliente_com_10_emprestimos_ainda_leva_3', pilula: 'um cliente com exatamente 10 empréstimos ainda leva 3', precisa: ['M'] },
      { id: 'rep', nome: 'test_cliente_fiel_nao_leva_jogo_repetido', pilula: 'o cliente fiel continua barrado no jogo repetido', precisa: [] },
    ];
    var POR_ID = {};
    LISTA.forEach(function (t) { POR_ID[t.id] = t; });
    var ATTR = "AttributeError: 'Cliente' object has no attribute 'limite_de_jogos'";

    var escritos, cod, op, resultados, ultimo, ultimoRodou, ciclo, entradas, aposta;

    // o limite de um cliente com n emprestimos, ou null se o metodo nao existe
    function limite(n) {
      if (!cod.M) return null;
      var fiel = cod.R && (op === '>' ? n > 10 : n >= 10);
      return fiel ? 4 : 3;
    }

    function julgar(id) {
      if (id === 'rep') return { ok: true };   // o _ja_tem barra antes de qualquer limite
      if (id === 'c5') {
        // sem o _lotado perguntando ao cliente, o 4o jogo da Bia ja e recusado:
        // o teste falha antes de chegar no 5o, que e o que ele queria conferir
        var efetivo = cod.L ? limite(11) : 3;
        return efetivo === 4 ? { ok: true } : { ok: false, msg: 'ValueError no 4º jogo: o limite ainda é 3' };
      }
      var n = { novo: 0, o11: 11, d10: 10 }[id];
      var esperado = id === 'o11' ? 4 : 3;
      var veio = limite(n);
      if (veio === null) return { ok: false, msg: ATTR };
      return veio === esperado ? { ok: true } : { ok: false, msg: 'assert ' + veio + ' == ' + esperado };
    }

    function faltam(id) {
      return POR_ID[id].precisa.filter(function (m) { return !cod[m]; });
    }

    function textoCodigo() {
      var l = ['LIMITE_DE_JOGOS = 3', '', 'class Cliente:'];
      if (!cod.M) l.push('    # ainda sem limite_de_jogos()');
      else {
        l.push('    def limite_de_jogos(self):');
        if (cod.R) l.push('        if self.emprestimos_anteriores ' + op + ' 10:', '            return 4');
        l.push('        return LIMITE_DE_JOGOS');
      }
      l.push('', 'class Emprestimo:', '    def _lotado(self):',
        '        return len(self.jogos) >= ' + (cod.L ? 'self.cliente.limite_de_jogos()' : 'LIMITE_DE_JOGOS'));
      return l.join('\n');
    }

    var palpites = palpite('u3a3-palpite2', PALPITES, function (p) {
      aposta = p;
      $('u3a3-legenda2').textContent = 'Palpite registrado. Agora rode o pytest.';
    });

    var acender = alternancias('u3a3-lista', LISTA, function (c) { return c.pilula; }, function (t) {
      if (escritos.indexOf(t.id) !== -1) {
        $('u3a3-legenda2').textContent = 'Esse já está na suíte. Escolha outro da lista.';
        return;
      }
      if (op !== '>') {
        $('u3a3-legenda2').textContent = 'O código está quebrado de propósito. Desfaça a quebra antes do próximo teste.';
        return;
      }
      // um ciclo por vez: teste novo so depois de o anterior ter rodado e ficado verde
      if (ultimo && (!ultimoRodou || !resultados || !resultados[ultimo].ok)) {
        $('u3a3-legenda2').textContent = 'Termine o ciclo do ' + POR_ID[ultimo].nome + ' primeiro: rode, e se ficar vermelho, faça ficar verde.';
        return;
      }
      escritos.push(t.id);
      ultimo = t.id;
      ultimoRodou = false;
      ciclo += 1;
      entradas.push({ hora: 'ciclo ' + ciclo, ator: 'voce', texto: 'escreveu ' + t.nome });
      invalidar('Teste escrito, código igual. Palpite: a suíte fica toda verde?');
    });

    function invalidar(frase) {
      resultados = null;
      aposta = null;
      palpites.limpar();
      $('u3a3-legenda2').textContent = frase;
      desenhar();
    }

    function podeCodar() {
      return op === '>' && ultimo && ultimoRodou && resultados && !resultados[ultimo].ok && faltam(ultimo).length > 0;
    }

    function desenhar() {
      var ul = $('u3a3-fiel');
      ul.textContent = '';
      ul.appendChild(itemTeste('os 4 de hoje cedo (recebe, repetido, limite de 3)', resultados && resultados.manha, 0));
      var vermelhos = 0;
      escritos.forEach(function (id, k) {
        var r = resultados && resultados[id];
        if (r && !r.ok) vermelhos += 1;
        ul.appendChild(itemTeste(POR_ID[id].nome, r, k + 1));
      });
      $('u3a3-cod2').textContent = textoCodigo();
      acender(function (t) { return escritos.indexOf(t.id) !== -1; });

      var feitas = (cod.M ? 1 : 0) + (cod.R ? 1 : 0) + (cod.L ? 1 : 0);
      $('u3a3-selo-fiel').textContent = escritos.length + ' de 5 escritos' +
        (!resultados ? '' : vermelhos ? ' · ' + vermelhos + ' vermelho' : ' · verdes');
      $('u3a3-selo-cod2').textContent = op !== '>' ? 'quebrado de propósito' : feitas + ' de 3 mudanças';
      // vermelho no codigo so quando ele esta errado de fato: a quebra proposital
      $('u3a3-painel-cod2').classList.toggle('ruim', op !== '>');

      $('u3a3-codar2').disabled = !podeCodar();
      $('u3a3-quebrar').disabled = !cod.R;
      $('u3a3-quebrar').textContent = op === '>' ? 'Quebrar de propósito: > vira >=' : 'Desfazer a quebra';
      log.escrever(entradas);
    }

    function rodar() {
      resultados = { manha: { ok: true } };   // Ana e cliente nova: limite 3 em qualquer versao
      escritos.forEach(function (id) { resultados[id] = julgar(id); });
      var red = escritos.filter(function (id) { return !resultados[id].ok; });
      var saiu = red.length ? 'vermelho' : 'verde';
      var primeiraVez = ultimo && !ultimoRodou;
      ultimoRodou = true;

      if (aposta) entradas.push({ ator: 'voce', texto: 'palpite: ' + (aposta.id === 'verde' ? 'toda verde' : 'algum vermelho'), resultado: aposta.id === saiu ? 'bateu' : 'não bateu' });
      entradas.push({ ator: 'pytest',
        texto: red.length ? red.map(function (id) { return POR_ID[id].nome + ': ' + resultados[id].msg; }).join('; ') : 'todos verdes',
        resultado: red.length ? 'falhou' : 'passou' });

      var frase;
      if (op !== '>') {
        frase = red.length
          ? 'Só o teste dos 10 empréstimos percebeu o >=. É ele, e só ele, que guarda a fronteira. Desfaça a quebra.'
          : 'Tudo verde com o código quebrado: falta o teste da fronteira, o de exatamente 10 empréstimos.';
      } else if (ultimo && !resultados[ultimo].ok) {
        var f = faltam(ultimo).sort(function (a, b) { return MUDANCAS[a].ordem - MUDANCAS[b].ordem; });
        frase = f.length === 3
          ? 'Vermelho por três motivos ao mesmo tempo: ' + f.map(function (m) { return MUDANCAS[m].motivo; }).join('; ') + '. Qual você conserta primeiro?'
          : f.length === 2
            ? 'Vermelho, e pede duas mudanças: ' + f.map(function (m) { return MUDANCAS[m].motivo; }).join(' e ') + '.'
            : 'Vermelho por um motivo só: ' + MUDANCAS[f[0]].motivo + '. O mínimo é uma mudança.';
      } else if (primeiraVez) {
        frase = 'Verde de primeira: não foi ciclo, foi confirmação. Na tabela, anote “não falhou — já era verdade”.' +
          (ultimo === 'd10' ? ' Para saber se ele confere alguma coisa, quebre o código de propósito.' : '');
      } else if (escritos.length === LISTA.length) {
        frase = 'Os cinco verdes, e os de hoje cedo também. Agora quebre de propósito: quem percebe?';
      } else if (!ultimo) {
        frase = 'Os de hoje cedo, verdes. Escolha o primeiro teste da lista.';
      } else {
        frase = 'Verde, o teste novo e os de antes. Próximo da lista.';
      }
      if (aposta) frase = (aposta.id === saiu ? 'Seu palpite bateu. ' : 'Seu palpite não bateu. ') + frase;
      aposta = null;
      palpites.limpar();
      $('u3a3-legenda2').textContent = frase;
      desenhar();
    }

    function escreverMinimo() {
      if (!podeCodar()) return;
      var f = faltam(ultimo).sort(function (a, b) { return MUDANCAS[a].ordem - MUDANCAS[b].ordem; });
      f.forEach(function (m) {
        cod[m] = true;
        entradas.push({ ator: 'codigo', sql: true, texto: MUDANCAS[m].log });
      });
      invalidar(f.length === 3
        ? 'Três mudanças num ciclo só. Se ficar vermelho de novo, qual das três foi? Palpite e rode.'
        : (f.length === 2 ? 'Duas mudanças' : 'Uma mudança') + ', só o que este vermelho pediu. Palpite e rode.');
    }

    function quebrar() {
      if (!cod.R) return;
      op = op === '>' ? '>=' : '>';
      entradas.push({ ator: 'codigo', sql: true, texto: op === '>='
        ? 'if self.emprestimos_anteriores >= 10  (quebrado de propósito)'
        : 'if self.emprestimos_anteriores > 10  (desfeito)' });
      invalidar(op === '>='
        ? 'Quebrado: agora quem tem 10 empréstimos leva 4. Palpite: algum teste percebe?'
        : 'Quebra desfeita. Rode para conferir que voltou ao verde.');
    }

    function recomecar() {
      escritos = [];
      cod = { M: false, R: false, L: false };
      op = '>';
      ultimo = null;
      ultimoRodou = false;
      ciclo = 0;
      aposta = null;
      palpites.limpar();
      resultados = { manha: { ok: true } };
      entradas = [{ hora: 'antes', ator: 'pytest', texto: 'os 4 testes de hoje cedo', resultado: 'verdes' }];
      $('u3a3-legenda2').textContent = 'Escolha o primeiro teste da lista. Qual dá menos trabalho?';
      desenhar();
    }

    $('u3a3-rodar2').addEventListener('click', rodar);
    $('u3a3-codar2').addEventListener('click', escreverMinimo);
    $('u3a3-quebrar').addEventListener('click', quebrar);
    $('u3a3-recomecar2').addEventListener('click', recomecar);
    recomecar();
  })();
})(window.DemoKit);
