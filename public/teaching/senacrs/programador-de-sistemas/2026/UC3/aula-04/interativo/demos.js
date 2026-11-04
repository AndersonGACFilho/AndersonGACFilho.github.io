/* demos.js — UC3, Aula 04: o WhatsApp que cai no meio da cobranca, e o teste
 * que so passa no fim de semana.
 *
 * O slide pergunta "o segundo e avisado?" e responde na fala. Aqui a pessoa
 * MONTA o for do cobrar() (fraqueza n. 2 do DIDATICA.md: produzir, nao so
 * clicar), PALPITA antes de rodar (fraqueza n. 1), e ve as duas surpresas que
 * a versao de partida esconde: a cobranca para inteira, e o banco ja anotou
 * "avisado" de quem nao recebeu nada.
 *
 * A segunda demo e o "nenhum dia deixa os dois verdes" do slide 25: a pessoa
 * aposta que existe um dia, procura na semana, e nao acha. So depois o relogio
 * entra pelo construtor.
 *
 * A simulacao segue o cobranca.py da turma e o gabarito em
 * docs/gabaritos/UC3/aula-04/: os nomes de teste, a ordem das linhas e o
 * side_effect = [ConnectionError(...), None] sao os de la.
 */
(function (K) {
  'use strict';
  var $ = K.$, linha = K.linha, novoLog = K.novoLog, escolhas = K.escolhas, palpite = K.palpite, itemTeste = K.itemTeste;

  /* ================= 1. o WhatsApp caiu no primeiro cliente ================= */

  (function () {
    if (!$('u3a4-rodar')) return;
    var log = novoLog('u3a4-log');
    var HOJE = '10/11/2026';
    var CLIENTES = [
      { id: 1, nome: 'Ana Souza', curto: 'Ana' },
      { id: 2, nome: 'Bruno Lima', curto: 'Bruno' },
    ];
    var ordem = 'grava', comTry = false, aposta = null;

    var palpites = palpite('u3a4-palpite', [
      { id: 'sim', nome: 'sim, o Bruno é avisado' },
      { id: 'nao', nome: 'não, a cobrança para antes' },
    ], function (op) {
      aposta = op;
      $('u3a4-legenda').textContent = 'Palpite registrado. Agora rode o cobrar().';
    });

    function codigo() {
      var grava = [
        '    emprestimo.registrar_aviso(hoje)',
        '    self.repositorio.atualiza(emprestimo)',
      ];
      var avisa = comTry
        ? ['    try:',
           '        self.avisador.avisa(emprestimo)',
           '    except Exception:',
           '        self.falhas.append(emprestimo)',
           '        continue']
        : ['    self.avisador.avisa(emprestimo)'];
      var corpo = ordem === 'grava' ? grava.concat(avisa) : avisa.concat(grava);
      return ['for emprestimo in self.repositorio.abertos():',
              '    if not emprestimo.atrasado_em(hoje):',
              '        continue']
        .concat(corpo, ['    self.total_avisados += 1']).join('\n');
    }

    // Roda o for montado, cliente por cliente, com o dublê que estoura na
    // primeira chamada. Devolve o estado final e o registro das chamadas.
    function simular() {
      var r = { zap: {}, gravado: {}, memoria: {}, falhas: [], total: 0, estourou: false, entradas: [] };
      var chamadas = 0;
      var passos = ordem === 'grava' ? ['registra', 'atualiza', 'avisa'] : ['avisa', 'registra', 'atualiza'];

      CLIENTES.forEach(function (c) {
        if (r.estourou) return;
        var desistiu = false;
        passos.forEach(function (p) {
          if (desistiu || r.estourou) return;
          if (p === 'registra') {
            r.memoria[c.id] = true;
            r.entradas.push({ hora: c.curto, ator: 'codigo', sql: true, texto: 'emprestimo.registrar_aviso(hoje)', resultado: 'avisado_em = ' + HOJE });
          } else if (p === 'atualiza') {
            r.gravado[c.id] = true;
            r.entradas.push({ hora: c.curto, ator: 'banco', sql: true, texto: 'repositorio.atualiza(' + c.curto.toLowerCase() + ')', resultado: 'gravado' });
          } else {
            chamadas += 1;
            if (chamadas === 1) {
              r.zap[c.id] = 'erro';
              r.entradas.push({ hora: c.curto, ator: 'whatsapp', sql: true, texto: 'avisador.avisa(' + c.curto.toLowerCase() + ')', resultado: 'ConnectionError' });
              if (comTry) {
                r.falhas.push(c.curto);
                r.entradas.push({ hora: c.curto, ator: 'codigo', sql: true, texto: 'except: falhas.append(…); continue', resultado: 'segue para o próximo' });
                desistiu = true;
              } else {
                r.estourou = true;
                r.entradas.push({ hora: c.curto, ator: 'codigo', texto: 'sem try, o erro sobe e sai do for', resultado: 'cobrar() interrompido' });
              }
            } else {
              r.zap[c.id] = 'ok';
              r.entradas.push({ hora: c.curto, ator: 'whatsapp', sql: true, texto: 'avisador.avisa(' + c.curto.toLowerCase() + ')', resultado: 'mensagem enviada' });
            }
          }
        });
        if (!desistiu && !r.estourou) r.total += 1;
      });

      // Os dois testes do gabarito, com as mesmas conferencias de la.
      var soBruno = r.gravado[2] && !r.gravado[1];
      r.t1 = r.estourou ? false : (r.zap[2] === 'ok' && r.falhas.length === 1 && r.falhas[0] === 'Ana');
      r.t2 = r.estourou ? false : (soBruno && !r.memoria[1]);
      return r;
    }

    function desenhar(r) {
      var zap = $('u3a4-zap'), banco = $('u3a4-banco'), cob = $('u3a4-cobrador'), ts = $('u3a4-testes');
      zap.textContent = ''; banco.textContent = ''; cob.textContent = ''; ts.textContent = '';
      var gravacoes = 0;

      CLIENTES.forEach(function (c) {
        var z = r ? r.zap[c.id] : null;
        // a falha da Ana e o cenario que o teste armou: fica neutra (o realce
        // do tema e verde, e diria "deu certo"). Vermelho e o Bruno sem
        // mensagem, que e o defeito do codigo.
        var txtZap = !r ? 'ainda não chamado' : z === 'erro' ? '✕ ConnectionError' : z === 'ok' ? '✓ recebeu' : 'nunca chamado';
        var clsZap = !r || z === 'erro' ? '' : z === 'ok' ? 'entrou' : 'velha';
        zap.appendChild(linha(c.nome, txtZap, clsZap));

        var g = r && r.gravado[c.id];
        if (g) gravacoes += 1;
        var mente = g && z !== 'ok';
        banco.appendChild(linha('empréstimo ' + c.id + ' · ' + c.curto,
          g ? 'avisado_em ' + HOJE + (mente ? ' — sem mensagem' : '') : 'avisado_em —',
          mente ? 'velha' : g ? 'entrou' : ''));
      });

      cob.appendChild(linha('total_avisados', r ? String(r.total) : '0'));
      cob.appendChild(linha('falhas', !r ? '[ ]' : r.estourou ? 'o cobrar() nem terminou' : comTry ? '[' + r.falhas.join(', ') + ']' : 'não existe sem o try'));

      ts.appendChild(itemTeste('test_whatsapp_fora_do_ar_nao_para_a_cobranca', r ? r.t1 : null,
        !r ? 'ainda não rodou' : r.t1 ? 'passou' : r.estourou ? 'o ConnectionError subiu' : 'o Bruno não foi avisado', 0));
      ts.appendChild(itemTeste('test_nao_registra_aviso_que_nao_saiu', r ? r.t2 : null,
        !r ? 'ainda não rodou' : r.t2 ? 'passou' : r.estourou ? 'o ConnectionError subiu' : 'atualiza chamado 2 vezes', 1));

      var verdes = r ? (r.t1 ? 1 : 0) + (r.t2 ? 1 : 0) : 0;
      $('u3a4-selo-banco').textContent = gravacoes === 1 ? '1 gravação' : gravacoes + ' gravações';
      $('u3a4-selo-testes').textContent = r ? verdes + ' de 2 verdes' : 'não rodou';
      $('u3a4-painel-zap').classList.toggle('ruim', !!r && r.zap[2] !== 'ok');
      $('u3a4-painel-banco').classList.toggle('ruim', !!r && !!r.gravado[1]);
      $('u3a4-painel-testes').classList.toggle('ruim', !!r && verdes < 2);
      $('u3a4-painel-testes').classList.toggle('bom', !!r && verdes === 2);
    }

    function recomecar() {
      aposta = null; palpites.limpar();
      $('u3a4-codigo').textContent = codigo();
      desenhar(null);
      log.escrever([], 'Palpite e rode: o registro mostra cada chamada, na ordem.');
      $('u3a4-legenda').textContent = 'Escolha um palpite, e só então rode.';
    }

    function frase(r) {
      if (ordem === 'grava' && !comTry) return 'O ConnectionError subiu, saiu do for, e o Bruno nunca foi chamado. Pior: o banco já diz que a Ana foi avisada — e ela não recebeu nada.';
      if (ordem === 'avisa' && !comTry) return 'O erro subiu e a cobrança parou na Ana. Pelo menos o banco não mente: o aviso não saiu, e nada foi gravado. Falta o try.';
      if (ordem === 'grava') return 'O try segurou a falha e o Bruno foi avisado. Mas o banco gravou a Ana como avisada antes de o WhatsApp estourar, e o segundo teste pega a mentira.';
      return 'O Bruno foi avisado, a Ana ficou em falhas para o balcão ligar, e o banco só registra quem recebeu. É o conserto do slide: try, e as duas linhas depois do aviso.';
    }

    $('u3a4-rodar').addEventListener('click', function () {
      if (!aposta) {
        $('u3a4-legenda').textContent = 'Palpite primeiro: escolha sim ou não ali em cima, e depois rode.';
        return;
      }
      var r = simular();
      desenhar(r);
      log.escrever(r.entradas);
      var bateu = (aposta.id === 'sim') === (r.zap[2] === 'ok');
      $('u3a4-legenda').textContent = (bateu ? 'Seu palpite bateu. ' : 'Seu palpite não bateu. ') + frase(r);
    });

    escolhas('u3a4-ordem', [
      { id: 'grava', nome: 'grava, depois avisa — a versão de partida' },
      { id: 'avisa', nome: 'avisa, depois grava' },
    ], function (o) { ordem = o.id; recomecar(); });
    escolhas('u3a4-try', [
      { id: 'sem', nome: 'sem try: o erro sobe' },
      { id: 'com', nome: 'com try: anota em falhas e segue' },
    ], function (o) { comTry = o.id === 'com'; recomecar(); });
  })();

  /* ================= 2. o teste que só passa no fim de semana ================= */

  (function () {
    if (!$('u3a4-relogio')) return;
    var log = novoLog('u3a4-log2');

    // A semana depois da aula de 10/11/2026. weekday() do Python: segunda e 0,
    // sabado e 5, domingo e 6 — o >= 5 do cobranca.py.
    var DIAS = [
      { id: 'ter', nome: 'ter 10/11', longo: 'terça, 10/11/2026', wd: 1 },
      { id: 'qua', nome: 'qua 11/11', longo: 'quarta, 11/11/2026', wd: 2 },
      { id: 'qui', nome: 'qui 12/11', longo: 'quinta, 12/11/2026', wd: 3 },
      { id: 'sex', nome: 'sex 13/11', longo: 'sexta, 13/11/2026', wd: 4 },
      { id: 'sab', nome: 'sáb 14/11', longo: 'sábado, 14/11/2026', wd: 5 },
      { id: 'dom', nome: 'dom 15/11', longo: 'domingo, 15/11/2026', wd: 6 },
      { id: 'seg', nome: 'seg 16/11', longo: 'segunda, 16/11/2026', wd: 0 },
    ];
    var dia = DIAS[0], relogio = false, aposta = null, vistos = {};

    palpite('u3a4-palpite2', [
      { id: 'sim', nome: 'sim, algum dia' },
      { id: 'nao', nome: 'não, nenhum' },
    ], function (op) { aposta = op; contar(); });

    function rodar(d) {
      if (relogio) return { aviso: true, fim: true };
      var fds = d.wd >= 5;
      return { aviso: !fds, fim: fds };
    }

    function viuOsDoisLados() {
      var util = false, fds = false;
      DIAS.forEach(function (d) { if (vistos[d.id]) { if (d.wd >= 5) fds = true; else util = true; } });
      return util && fds;
    }

    function desenhar() {
      var r = rodar(dia), fds = dia.wd >= 5;
      $('u3a4-data-codigo').textContent = relogio
        ? 'hoje = self.relogio.hoje()  # o teste escolhe\nif hoje.weekday() >= 5:\n    return'
        : 'hoje = date.today()  # ' + dia.longo + '\nif hoje.weekday() >= 5:  # ' + dia.wd + (fds ? ': fim de semana' : ': dia útil') + '\n    return';

      var ts = $('u3a4-testes-hoje');
      ts.textContent = '';
      ts.appendChild(itemTeste('test_avisa_quem_passou_do_prazo', r.aviso,
        relogio ? 'o relógio diz 09/04/2012, segunda' : r.aviso ? 'avisou, como esperado' : 'esperava 1 aviso, saiu 0', 0));
      ts.appendChild(itemTeste('test_nao_cobra_no_fim_de_semana', r.fim,
        relogio ? 'o relógio diz 07/04/2012, sábado' : r.fim ? 'ninguém avisado, como esperado' : 'esperava nenhum aviso, saiu 1', 1));
      $('u3a4-selo-hoje').textContent = relogio ? 'relógio dublê' : dia.nome;
      $('u3a4-painel-hoje').classList.toggle('bom', r.aviso && r.fim);

      var sem = $('u3a4-semana'), osDois = 0;
      sem.textContent = '';
      DIAS.forEach(function (d) {
        if (!vistos[d.id]) { sem.appendChild(linha(d.nome, 'não rodou')); return; }
        var x = rodar(d);
        if (x.aviso && x.fim) osDois += 1;
        // o dia nao esta errado; errado e o teste que depende dele. Por isso a
        // linha nao fica vermelha, e so ganha borda verde quando os dois
        // passam. O dia de hoje ja esta no selo do outro painel: realca-lo
        // aqui com o verde do tema diria "este deu certo".
        sem.appendChild(linha(d.nome, (x.aviso ? '✓' : '✕') + ' aviso · ' + (x.fim ? '✓' : '✕') + ' fim de semana',
          x.aviso && x.fim ? 'entrou' : ''));
      });
      $('u3a4-selo-semana').textContent = osDois === 1 ? '1 dia verde' : osDois + ' dias verdes';

      var entradas = [];
      if (relogio) {
        entradas.push({ hora: 'teste 1', ator: 'relogio', sql: true, texto: 'relogio.hoje()', resultado: '09/04/2012, segunda' });
        entradas.push({ hora: 'teste 1', ator: 'whatsapp', sql: true, texto: 'avisador.avisa(atrasado)', resultado: 'chamado 1 vez' });
        entradas.push({ hora: 'teste 1', ator: 'pytest', sql: true, texto: 'avisador.avisa.assert_called_once_with(atrasado)', resultado: 'passou' });
        entradas.push({ hora: 'teste 2', ator: 'relogio', sql: true, texto: 'relogio.hoje()', resultado: '07/04/2012, sábado' });
        entradas.push({ hora: 'teste 2', ator: 'codigo', sql: true, texto: 'hoje.weekday() >= 5', resultado: '5: return' });
        entradas.push({ hora: 'teste 2', ator: 'pytest', sql: true, texto: 'avisador.avisa.assert_not_called()', resultado: 'passou' });
      } else {
        entradas.push({ hora: 'os dois', ator: 'codigo', sql: true, texto: 'date.today()', resultado: dia.longo });
        entradas.push({ hora: 'os dois', ator: 'codigo', sql: true, texto: 'hoje.weekday() >= 5', resultado: dia.wd + (fds ? ': return, ninguém é cobrado' : ': segue para o for') });
        if (!fds) entradas.push({ hora: 'os dois', ator: 'whatsapp', sql: true, texto: 'avisador.avisa(atrasado)', resultado: 'chamado 1 vez' });
        entradas.push({ hora: 'teste 1', ator: 'pytest', sql: true, texto: 'avisador.avisa.assert_called_once_with(atrasado)', resultado: r.aviso ? 'passou' : 'FALHOU' });
        entradas.push({ hora: 'teste 2', ator: 'pytest', sql: true, texto: 'avisador.avisa.assert_not_called()', resultado: r.fim ? 'passou' : 'FALHOU' });
      }
      log.escrever(entradas);
      contar();
    }

    // A legenda acompanha a busca: pede o palpite, empurra para o outro lado
    // da semana, e so revela quando a pessoa ja viu dia util E fim de semana.
    function contar() {
      var leg = $('u3a4-legenda2');
      if (relogio) {
        leg.textContent = 'Com o relógio dublê, cada teste escolhe o próprio dia: o do aviso roda numa segunda de 2012, o do fim de semana num sábado. Verdes em qualquer dia que o computador diga.';
        return;
      }
      if (!aposta) { leg.textContent = 'Palpite primeiro: existe um dia em que os dois ficam verdes? Depois troque o dia.'; return; }
      if (!viuOsDoisLados()) {
        leg.textContent = dia.wd >= 5
          ? 'No fim de semana, o do aviso falha. Experimente um dia útil.'
          : 'Em dia útil, o do fim de semana falha. Experimente um sábado ou um domingo.';
        return;
      }
      leg.textContent = (aposta.id === 'nao' ? 'Seu palpite bateu. ' : 'Seu palpite não bateu. ') +
        'Nenhum dia deixa os dois verdes: em dia útil falha um, no fim de semana falha o outro. O teste mede o dia em que alguém apertou o play. Agora passe o relógio pelo construtor.';
    }

    $('u3a4-relogio').addEventListener('click', function () {
      relogio = !relogio;
      this.textContent = relogio ? 'Voltar ao date.today()' : 'Passar o relógio pelo construtor';
      desenhar();
    });

    escolhas('u3a4-dias', DIAS, function (d) {
      dia = d;
      vistos[d.id] = true;
      desenhar();
    });
  })();
})(window.DemoKit);
