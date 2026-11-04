/* demos.js — UC3, Aula 07: o commit que quebrou a multa, e a senha que ficou.
 *
 * Os dados sao os do locadora-historico.zip de verdade (gerado por
 * docs/gabaritos/UC3/aula-07/gerar-historico.sh): hashes, autores, datas,
 * mensagens e o diff do multa.py foram copiados de um `git log -p` no zip
 * extraido. Se o script mudar, os hashes mudam, e esta pagina passa a mentir
 * em silencio — reconfira com `git log --oneline` no zip novo.
 *
 * Demo 1: a mensagem "Desconto de metade da multa" e razoavel e esconde o >.
 * A pessoa aposta pelas mensagens (fraqueza 1 do DIDATICA.md), abre o diff e
 * APONTA a linha (fraqueza 2), e depois palpita se o revert apaga o commit —
 * a pergunta da tarefa opcional do deck.
 *
 * Demo 2: o palpite esperado pelo roteiro e "esta segura, ela apagou". A
 * quebra vem do clone; depois a pessoa escolhe o que a Ana faz, e so uma das
 * tres saidas resolve o vazamento.
 */
(function (K) {
  'use strict';
  var $ = K.$, el = K.el, linha = K.linha, novoLog = K.novoLog, palpite = K.palpite, itemTeste = K.itemTeste, linhaCodigo = K.linhaCodigo;

  var SENHA = 'Locadora#2026';   // o valor ficticio que o proprio deck mostra

  /* ================= 1. qual commit quebrou a multa ================= */

  (function () {
    if (!$('u3a7-log-p')) return;
    var log = novoLog('u3a7-log');

    var COMMITS = [
      { hash: '9e5e010', autor: 'Ana', data: '11/11', msg: 'Melhora a descricao do relatorio' },
      { hash: 'f8bb1d8', autor: 'Bruno', data: '10/11', msg: 'Desconto de metade da multa para cliente fiel', multa: true, culpado: true },
      { hash: '146a2e5', autor: 'Ana', data: '06/11', msg: 'Remove a senha do repositorio' },
      { hash: 'a0af081', autor: 'Ana', data: '06/11', msg: 'Dados de conexao com o banco de teste' },
      { hash: '3370b07', autor: 'Bruno', data: '05/11', msg: 'Multa a partir do 3o dia e recusa de aluguel sem dias', multa: true },
      { hash: '6dd28d9', autor: 'Ana', data: '04/11', msg: 'Relatorio do mes: maior e menor aluguel' },
    ];

    // O hunk de f8bb1d8 no multa.py, como o git log -p mostra. A indentacao
    // sai: o <code> dentro da .linha nao preserva espaco, e recuo pela metade
    // confundiria mais que nenhum.
    var DIFF = [
      { s: '-', c: 'def multa(dias_atraso):' },
      { s: '-', c: '"""Multa pela devolução atrasada, em reais."""' },
      { s: '-', c: 'if dias_atraso >= 3:', id: 'antes' },
      { s: '-', c: 'return dias_atraso * MULTA_POR_DIA' },
      { s: '+', c: 'def multa(dias_atraso, cliente_fiel=False):', id: 'def' },
      { s: '+', c: '"""Multa pela devolução atrasada, em reais. Cliente fiel paga metade."""' },
      { s: '+', c: 'if dias_atraso > 3:', id: 'if' },
      { s: '+', c: 'valor = dias_atraso * MULTA_POR_DIA' },
      { s: '+', c: 'if cliente_fiel:' },
      { s: '+', c: 'valor = valor / 2', id: 'metade' },
      { s: '+', c: 'return valor' },
    ];

    var aposta, abriuDiff, achou, apostaRevert, modo;

    var palpiteCommit = palpite('u3a7-palpite-commit', COMMITS.map(function (c) {
      return { id: c.hash, nome: c.hash + ' · ' + c.msg };
    }), function (op) {
      aposta = op.id;
      $('u3a7-legenda').textContent = 'Palpite registrado. Agora abra o histórico do multa.py.';
    });

    var palpiteLinha = palpite('u3a7-palpite-linha', [
      { id: 'def', nome: 'def multa(dias_atraso, cliente_fiel=False):' },
      { id: 'if', nome: 'if dias_atraso > 3:' },
      { id: 'metade', nome: 'valor = valor / 2' },
    ], function (op) {
      if (!abriuDiff) {
        // sem o diff na tela, escolher a linha seria chute sobre texto que a
        // pessoa ainda nao viu
        $('u3a7-legenda').textContent = 'Abra o diff primeiro: git log -p multa.py.';
        return false;
      }
      var FRASE = {
        'if': 'Isso: no 3º dia, 3 > 3 é falso, e a multa sai 0. É a fronteira da Aula 02 — e a mensagem fala do desconto, não do >.',
        def: 'Esse parâmetro tem padrão False: multa(3) passa por ele sem mudar nada. Olhe a condição.',
        metade: 'Essa só roda para cliente fiel, e o teste chama multa(3), sem desconto. Olhe a condição.',
      };
      $('u3a7-legenda').textContent = FRASE[op.id];
      if (op.id === 'if') achou = 'if';
      desenhar();
    });

    var palpiteRevert = palpite('u3a7-palpite-revert', [
      { id: 'some', nome: 'some do histórico: ficam 5 commits' },
      { id: 'fica', nome: 'fica, e um commit novo o desfaz: ficam 7' },
    ], function (op) {
      apostaRevert = op.id;
      $('u3a7-legenda').textContent = 'Palpite registrado. Rode o git revert.';
    });

    function recomecar() {
      aposta = null; abriuDiff = false; achou = null; apostaRevert = null; modo = null;
      palpiteCommit.limpar(); palpiteLinha.limpar(); palpiteRevert.limpar();
      $('u3a7-legenda').textContent = 'Palpite primeiro: só pelas mensagens, qual commit quebrou?';
      registrar();
      desenhar();
    }

    // O registro e refeito do zero a cada passo: revert e restore sao
    // ALTERNATIVAS (o roteiro faz cada um num clone), entao o registro de um
    // nao pode ficar empilhado sobre o do outro.
    function registrar() {
      var e = [
        { hora: '1', ator: 'voce', texto: 'git log --oneline', sql: true, resultado: '6 commits' },
        { hora: '2', ator: 'pytest', texto: 'pytest', sql: true, resultado: '14 passaram, 1 falhou' },
      ];
      if (abriuDiff) e.push({ hora: '3', ator: 'voce', texto: 'git log -p multa.py', sql: true, resultado: '2 commits mexeram nele' });
      var n = e.length + 1;
      if (modo === 'revert') {
        e.push({ hora: String(n), ator: 'git', texto: 'git revert f8bb1d8', sql: true, resultado: 'commit novo, desfazendo' });
        e.push({ hora: String(n + 1), ator: 'pytest', texto: 'pytest', sql: true, resultado: '15 passaram' });
      } else if (modo === 'restore') {
        e.push({ hora: String(n), ator: 'git', texto: 'git restore --source=146a2e5 multa.py', sql: true, resultado: 'só o arquivo voltou' });
        e.push({ hora: String(n + 1), ator: 'git', texto: 'git status', sql: true, resultado: 'modified: multa.py — não gravado' });
        e.push({ hora: String(n + 2), ator: 'pytest', texto: 'pytest', sql: true, resultado: '15 passaram' });
      }
      log.escrever(e);
    }

    function desenhar() {
      var lista = $('u3a7-log-commits'), tela = $('u3a7-tela');
      lista.textContent = ''; tela.textContent = '';
      var achado = achou === 'if';

      if (modo === 'revert') {
        lista.appendChild(linhaCodigo('(novo) Revert "Desconto de metade da multa para cliente fiel"', 'você · agora', 'entrou'));
      }
      COMMITS.forEach(function (c) {
        var classe = '';
        if (achado && c.culpado) classe = 'velha';         // so depois de apontada a linha
        else if (abriuDiff && c.multa) classe = 'achou';
        lista.appendChild(linhaCodigo(c.hash + ' ' + c.msg, c.autor + ' · ' + c.data, classe));
      });
      if (modo === 'restore') lista.appendChild(linha('multa.py mudou, e ninguém gravou', 'falta o commit', 'achou'));
      $('u3a7-selo-log').textContent = (modo === 'revert' ? 7 : 6) + ' commits';

      var titulo = $('u3a7-titulo-tela'), selo = $('u3a7-selo-tela');
      var painel = $('u3a7-painel-tela');
      if (abriuDiff && !modo) {
        titulo.textContent = 'f8bb1d8, no multa.py';
        selo.textContent = 'Bruno · 10/11';
        selo.className = 'selo';
        DIFF.forEach(function (d) {
          var classe = '';
          if (achado && d.id === 'if') classe = 'velha';     // a linha errada
          else if (achado && d.id === 'antes') classe = 'achou';  // o que estava certo
          tela.appendChild(linhaCodigo(d.s + ' ' + d.c, d.s === '-' ? 'removida' : 'nova', classe));
        });
        painel.classList.remove('bom', 'ruim');
        return;
      }

      // sem diff aberto, ou depois de desfazer: a tela e o pytest
      var verde = modo !== null;
      titulo.textContent = verde ? (modo === 'revert' ? 'o pytest, depois do revert' : 'o pytest, depois do restore') : 'o pytest, na versão atual';
      selo.textContent = verde ? '15 de 15' : '14 de 15';
      selo.className = 'selo ' + (verde ? 'bom' : 'ruim');
      painel.classList.toggle('bom', verde);
      painel.classList.toggle('ruim', !verde);
      var ul = el('ul', 'testes');
      ul.appendChild(itemTeste('test_no_terceiro_dia_ja_cobra', verde, verde ? 'multa(3) == 15.0' : 'esperava 15.0, veio 0.0'));
      ul.appendChild(itemTeste('os outros 14', true, 'passaram', 1));
      tela.appendChild(ul);
    }

    $('u3a7-log-p').addEventListener('click', function () {
      if (!aposta) {
        $('u3a7-legenda').textContent = 'Palpite primeiro: só pelas mensagens, qual commit quebrou?';
        return;
      }
      // depois do revert ou do restore o diff ja foi lido: zerar o modo aqui
      // apagava o conserto da tela e do registro
      if (modo) {
        $('u3a7-legenda').textContent = 'O diff já foi lido. Para tentar o outro caminho, use o outro botão — cada um roda num clone novo.';
        return;
      }
      abriuDiff = true;
      var mexeu = aposta === 'f8bb1d8' || aposta === '3370b07';
      $('u3a7-legenda').textContent = (mexeu
        ? 'Seu palpite está entre os dois que mexeram no multa.py. '
        : 'Seu palpite nem mexeu no multa.py: a mensagem enganou. ') +
        'O 3370b07 criou o arquivo com >=, e o teste passava; o diff aberto é o do f8bb1d8. Ache a linha.';
      registrar();
      desenhar();
    });

    $('u3a7-revert').addEventListener('click', function () {
      if (!apostaRevert) {
        $('u3a7-legenda').textContent = 'Palpite primeiro: depois do revert, o commit do desconto some ou fica?';
        return;
      }
      modo = 'revert';
      $('u3a7-legenda').textContent = (apostaRevert === 'fica' ? 'Seu palpite bateu. ' : 'Seu palpite não bateu. ') +
        'Sete commits: o f8bb1d8 continua lá, e o novo o desfaz. A suíte ficou verde — e o desconto do cliente fiel foi junto. O conserto de verdade é manter o desconto e trocar o > por >=.';
      registrar();
      desenhar();
    });

    $('u3a7-restore').addEventListener('click', function () {
      modo = 'restore';
      $('u3a7-legenda').textContent = 'Num clone novo: o multa.py voltou a ser o da 146a2e5 e a suíte ficou verde, mas nada foi gravado — o histórico continua com seis. Falta o commit.';
      registrar();
      desenhar();
    });

    $('u3a7-recomecar').addEventListener('click', recomecar);
    recomecar();
  })();

  /* ================= 2. a senha sumiu ================= */

  (function () {
    if (!$('u3a7-clonar')) return;
    var log = novoLog('u3a7-log2');

    var aposta, clonado, trocada, ignorado, entradas;

    var palpiteSenha = palpite('u3a7-palpite-senha', [
      { id: 'segura', nome: 'sim: a Ana apagou o arquivo' },
      { id: 'vazada', nome: 'não: ela continua no histórico' },
    ], function (op) {
      aposta = op.id;
      $('u3a7-legenda2').textContent = 'Palpite registrado. Agora clone, como faria qualquer pessoa.';
    });

    function recomecar() {
      aposta = null; clonado = false; trocada = false; ignorado = false; entradas = [];
      palpiteSenha.limpar();
      log.escrever([], 'Ninguém clonou ainda.');
      $('u3a7-legenda2').textContent = 'Palpite primeiro: a senha está segura?';
      desenhar();
    }

    function anotar(ator, texto, resultado, sql) {
      entradas.push({ hora: String(entradas.length + 1), ator: ator, texto: texto, resultado: resultado, sql: !!sql });
      log.escrever(entradas);
    }

    // o valor em codigo fica a direita: aqui o rotulo e o que se le primeiro
    function linhaValorEmCodigo(texto, valor, classe) {
      var l = el('div', 'linha' + (classe ? ' ' + classe : ''));
      l.appendChild(el('span', null, texto));
      var dir = el('span');
      dir.appendChild(el('code', null, valor));
      l.appendChild(dir);
      return l;
    }

    function desenhar() {
      var pasta = $('u3a7-pasta'), clone = $('u3a7-clone');
      pasta.textContent = ''; clone.textContent = '';

      ['multa.py', 'relatorio.py', 'test_multa.py', 'test_relatorio.py'].forEach(function (f) {
        pasta.appendChild(linha(f, ''));
      });
      if (ignorado) pasta.appendChild(linha('.gitignore', 'config_local.py fica de fora', 'entrou'));
      // neutro, e nao riscado: sumir da pasta e justamente o que engana
      pasta.appendChild(linha('config_local.py', 'não está mais aqui'));
      $('u3a7-selo-pasta').textContent = (ignorado ? 5 : 4) + ' arquivos';

      var selo = $('u3a7-selo-clone'), painel = $('u3a7-painel-clone');
      if (!clonado) {
        clone.appendChild(linha('commits que vêm junto no clone', 'os 6, inteiros'));
        clone.appendChild(linha('a senha', '?'));
        selo.textContent = 'ninguém clonou';
        selo.className = 'selo';
        painel.classList.remove('bom', 'ruim');
        return;
      }
      clone.appendChild(linhaValorEmCodigo('146a2e5 · Remove a senha', '-SENHA = "' + SENHA + '"'));
      clone.appendChild(linhaValorEmCodigo('a0af081 · Dados de conexao', '+SENHA = "' + SENHA + '"', 'velha'));
      clone.appendChild(linha('essa senha abre o banco?', trocada ? 'não: a senha agora é outra' : 'sim', trocada ? 'entrou' : 'velha'));
      clone.appendChild(linha('a próxima senha entra num commit?', ignorado ? 'não: o .gitignore a deixa de fora' : 'entra, no próximo git add .', ignorado ? 'entrou' : ''));
      var resolvido = trocada && ignorado;
      selo.textContent = trocada ? 'senha à vista, e inútil' : 'senha à vista';
      selo.className = 'selo ' + (trocada ? 'bom' : 'ruim');
      painel.classList.toggle('bom', resolvido);
      painel.classList.toggle('ruim', !trocada);
    }

    function precisaClonar() {
      if (clonado) return false;
      $('u3a7-legenda2').textContent = 'Antes de consertar, veja o que um estranho acha: palpite e clone.';
      return true;
    }

    function fecho() {
      if (trocada && ignorado) return 'É o conserto inteiro: a senha velha continua no histórico, mas não abre nada; a nova fica só na máquina.';
      return '';
    }

    $('u3a7-clonar').addEventListener('click', function () {
      if (!aposta) {
        $('u3a7-legenda2').textContent = 'Palpite primeiro: a senha está segura?';
        return;
      }
      if (clonado) return;
      clonado = true;
      anotar('voce', 'git clone …/locadora-historico', '6 commits', true);
      anotar('git', 'git log -p -S "SENHA" --oneline', '2 commits com a senha', true);
      $('u3a7-legenda2').textContent = (aposta === 'vazada' ? 'Seu palpite bateu. ' : 'Seu palpite não bateu. ') +
        'Apagar o arquivo gravou mais um commit; o que pôs a senha continua lá, porque é para isso que o histórico existe. Robôs rodam isso no GitHub o dia inteiro.';
      desenhar();
    });

    $('u3a7-republicar').addEventListener('click', function () {
      if (precisaClonar()) return;
      anotar('voce', 'apaga o repositório no GitHub e publica de novo', null);
      anotar('git', 'git push', 'os ' + (ignorado ? 7 : 6) + ' commits sobem de novo', true);
      $('u3a7-legenda2').textContent = 'O push leva o .git inteiro: o a0af081 sobe de novo, com a senha. E o que os robôs já copiaram não volta.';
      desenhar();
    });

    $('u3a7-ignorar').addEventListener('click', function () {
      if (precisaClonar()) return;
      if (!ignorado) {
        ignorado = true;
        anotar('voce', 'config_local.py no .gitignore, e commit', 'o próximo fica de fora');
      }
      $('u3a7-legenda2').textContent = fecho() || 'Protege o próximo commit, não o passado: o git log -S continua achando a senha no a0af081, e ela continua abrindo o banco.';
      desenhar();
    });

    $('u3a7-trocar').addEventListener('click', function () {
      if (precisaClonar()) return;
      if (!trocada) {
        trocada = true;
        anotar('voce', 'troca a senha do postgres no pgAdmin', 'a velha não abre mais');
      }
      $('u3a7-legenda2').textContent = fecho() || 'A senha continua no histórico — e não abre mais nada. Mas a nova vai num config_local.py novo, e sem .gitignore o próximo git add . a leva junto.';
      desenhar();
    });

    $('u3a7-recomecar2').addEventListener('click', recomecar);
    recomecar();
  })();
})(window.DemoKit);
