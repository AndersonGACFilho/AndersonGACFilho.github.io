/* demos.js — UC3, Aula 06: o nivel de cada teste, e o relatorio de defeito.
 *
 * A tabela de niveis do slide e lida e concordada em dez segundos. O erro que
 * o roteiro preve (o teste pela tela com banco no meio vira "integracao") so
 * aparece quando a pessoa tem de DECIDIR — por isso a primeira demo pede o
 * nivel antes de mostrar (fraquezas 1 e 2 do DIDATICA.md), e soma o custo de
 * cada nivel na tela dela: "sistema e lento" e uma frase; 50 s contra 0,2 s
 * e uma conta que ela mesma montou. A reorganizacao do menu fecha com o
 * "quebra a toa" do slide 8 — vermelho sem defeito nenhum.
 *
 * A segunda demo e o "nao funciona" do slide 22: a pessoa monta o relatorio
 * campo a campo, palpita se o Bruno reproduz, e ve o Bruno tentar. O caso e o
 * CT-03 do slide 20 — a multa do 3o dia, o defeito do > da Aula 02.
 */
(function (K) {
  'use strict';
  var $ = K.$, el = K.el, linha = K.linha, novoLog = K.novoLog, escolhas = K.escolhas, palpite = K.palpite;

  /* ================= 1. em que nivel esta cada teste ================= */

  (function () {
    if (!$('u3a6-proximo')) return;
    var log = novoLog('u3a6-log');

    var NIVEIS = [
      { id: 'unidade', nome: 'unidade', ms: 2 },
      { id: 'duble', nome: 'unidade com dublê', ms: 3 },
      { id: 'integracao', nome: 'integração', ms: 200 },
      { id: 'sistema', nome: 'sistema', ms: 25000 },
    ];
    var porId = {};
    NIVEIS.forEach(function (n) { porId[n.id] = n; });

    // Os testes sao os das Aulas 01 a 05, mas NAO os da checagem do Bloco 1:
    // repetir aquela lista aqui entregaria o gabarito de quem abre a pagina
    // antes da aula.
    var TESTES = [
      { texto: 'multa(4) == 20.0', nivel: 'unidade',
        porque: 'Uma regra, sozinha, sem banco nem tela: unidade.' },
      { texto: 'o CobradorDeAtrasos, com repositório e avisador falsos, avisa só quem atrasou', nivel: 'duble',
        porque: 'A regra do cobrador roda de verdade; banco e aviso são falsos. Unidade com dublê, como na Aula 04.' },
      { texto: 'criar_jogo grava o Zelda no locadora_teste, e buscar_jogo o devolve', nivel: 'integracao',
        porque: 'O código conversando com o banco de verdade, sem tela: integração, como na Aula 05.' },
      { texto: 'abrir o sistema, alugar, devolver com 4 dias de atraso e ver R$ 20,00 na tela', nivel: 'sistema',
        porque: 'A regra é a da multa, mas o teste entra pela tela, como a atendente: sistema. Quem decide é por onde ele entra.' },
      { texto: 'buscar_por_titulo com uma conexão falsa que devolve o Zelda', nivel: 'duble',
        porque: 'É o teste da Aula 05 que deixou o titlo passar: o dublê não executa SQL. Continua sendo unidade com dublê.' },
      { texto: 'abrir a tela de busca, digitar "Zelda" e ver o jogo na lista', nivel: 'sistema',
        porque: 'Tem banco no meio, e por isso muita gente diz integração. Mas entra pela tela, como o usuário: sistema.' },
    ];

    var vez, respostas, apostaTela;

    function tempo(ms) {
      if (ms < 1000) return ms + ' ms';
      return (ms / 1000).toFixed(1).replace('.0', '').replace('.', ',') + ' s';
    }

    var pilulas = palpite('u3a6-nivel', NIVEIS, function (n) {
      if (vez >= TESTES.length) return false;
      var t = TESTES[vez];
      // Vale a PRIMEIRA resposta: trocar de pilula depois de ver o gabarito
      // acertaria sempre, e a contagem do fim deixaria de dizer alguma coisa.
      var primeira = !(vez in respostas);
      if (primeira) respostas[vez] = n.id;
      var certo = respostas[vez] === t.nivel;
      $('u3a6-legenda').textContent = (primeira ? (certo ? 'Isso. ' : 'Não: é ' + porId[t.nivel].nome + '. ') : 'Sua primeira resposta é a que fica. ') + t.porque;
      // a pilula volta para a primeira resposta: acesa na segunda, ela
      // desmentiria a frase acima
      if (!primeira) return false;
      $('u3a6-proximo').disabled = vez === TESTES.length - 1;
      if (vez === TESTES.length - 1) fechar();
      desenhar();
    });

    var palpiteTela = palpite('u3a6-palpite-tela', [
      { id: 'nenhum', nome: 'nenhum: nenhuma regra mudou' },
      { id: 'sistema', nome: 'só os que entram pela tela' },
      { id: 'todos', nome: 'todos: o sistema mudou' },
    ], function (op) {
      apostaTela = op;
      $('u3a6-legenda').textContent = 'Palpite registrado. Agora reorganize o menu e rode.';
    });

    function fechar() {
      var acertos = TESTES.filter(function (t, k) { return respostas[k] === t.nivel; }).length;
      $('u3a6-vez').textContent = 'Os seis classificados — ' + acertos + ' de 6 de primeira. Olhe o painel da direita: de onde vem o tempo?';
    }

    function recomecar() {
      vez = 0; respostas = {}; apostaTela = null;
      pilulas.limpar(); palpiteTela.limpar();
      $('u3a6-proximo').disabled = true;
      log.escrever([], 'A suíte ainda não rodou.');
      $('u3a6-legenda').textContent = 'Escolha o nível do teste 1 antes de ver a resposta.';
      mostrarVez();
      desenhar();
    }

    function mostrarVez() {
      var cx = $('u3a6-vez');
      cx.textContent = '';
      cx.appendChild(document.createTextNode('Teste ' + (vez + 1) + ' de 6: '));
      cx.appendChild(el('code', null, TESTES[vez].texto));
      cx.appendChild(document.createTextNode(' — em que nível ele está?'));
    }

    function desenhar() {
      var lista = $('u3a6-testes'), custo = $('u3a6-custo');
      lista.textContent = ''; custo.textContent = '';
      // o registro da rodada mostra o tempo e o nivel de cada teste: liberado
      // antes da classificacao, ele entrega o gabarito dos seis
      $('u3a6-tela').disabled = Object.keys(respostas).length < TESTES.length;
      var feitos = 0;
      TESTES.forEach(function (t, k) {
        var r = respostas[k], valor, classe = '';
        if (r === undefined) {
          valor = '?';
          if (k === vez) classe = 'achou';
        } else {
          feitos += 1;
          valor = porId[t.nivel].nome + (r === t.nivel ? '' : ' — você disse ' + porId[r].nome);
          // vermelho so na resposta trocada: o teste em si nao esta errado
          classe = r === t.nivel ? 'entrou' : 'velha';
        }
        lista.appendChild(linha((k + 1) + '. ' + t.texto, valor, classe));
      });
      $('u3a6-selo-testes').textContent = feitos + ' de 6';

      // O custo so conta o que ja foi revelado: somar os seis desde o comeco
      // entregaria quantos de cada nivel existem antes do palpite.
      var total = 0;
      NIVEIS.forEach(function (n) {
        var qtos = TESTES.filter(function (t, k) { return respostas[k] !== undefined && t.nivel === n.id; }).length;
        total += qtos * n.ms;
        custo.appendChild(linha(n.nome, qtos ? qtos + (qtos === 1 ? ' teste · ' : ' testes · ') + tempo(qtos * n.ms) : '—'));
      });
      custo.appendChild(linha('a suíte inteira', feitos ? tempo(total) : '—', feitos ? 'achou' : ''));
      $('u3a6-selo-custo').textContent = feitos ? tempo(total) + ' por rodada' : 'nada somado';
    }

    function rodarDepoisDaTela() {
      if (!apostaTela) {
        $('u3a6-legenda').textContent = 'Palpite primeiro: quantos ficam vermelhos depois que o menu muda?';
        return;
      }
      var entradas = TESTES.map(function (t) {
        var pelaTela = t.nivel === 'sistema';
        return {
          hora: tempo(porId[t.nivel].ms), ator: 'pytest', sql: true, texto: t.texto,
          resultado: pelaTela ? 'FALHOU — não achou o botão' : 'passou',
        };
      });
      log.escrever(entradas);
      var frase = 'Dois vermelhos sem defeito nenhum: a regra está certa, o botão é que mudou de lugar. E esses dois são 50 s de uma rodada de 50,2 s.';
      $('u3a6-legenda').textContent = (apostaTela.id === 'sistema' ? 'Seu palpite bateu. ' : 'Seu palpite não bateu. ') + frase;
    }

    $('u3a6-proximo').addEventListener('click', function () {
      if (vez >= TESTES.length - 1 || !(vez in respostas)) return;
      vez += 1;
      pilulas.limpar();
      this.disabled = true;
      mostrarVez();
      $('u3a6-legenda').textContent = 'Escolha o nível do teste ' + (vez + 1) + '.';
      desenhar();
    });
    $('u3a6-tela').addEventListener('click', rodarDepoisDaTela);
    $('u3a6-recomecar').addEventListener('click', recomecar);
    recomecar();
  })();

  /* ================= 2. o relatorio que ninguem reproduz ================= */

  (function () {
    if (!$('u3a6-entregar')) return;
    var log = novoLog('u3a6-log2');

    // Cada campo tem a versao do colega apressado (a primeira, e a que abre
    // a demo), a que permite reproduzir, e uma armadilha do proprio deck: o
    // conserto no lugar dos passos, o esperado copiado do codigo (slide 16),
    // a severidade pela facilidade do conserto (roteiro, slide 21).
    var CAMPOS = [
      { id: 'titulo', rotulo: 'título', opcoes: [
        { id: 'vago', nome: 'A multa não funciona' },
        { id: 'bom', nome: 'Multa não é cobrada no 3º dia de atraso' },
        { id: 'alarde', nome: 'URGENTE: bug na multa!!!' },
      ] },
      { id: 'passos', rotulo: 'passos para reproduzir', opcoes: [
        { id: 'vago', nome: 'Usei o sistema e deu errado' },
        { id: 'conserto', nome: 'Trocar o > por >= no multa.py' },
        { id: 'bom', nome: 'Chamar multa(3)' },
      ] },
      { id: 'esperado', rotulo: 'esperado × obtido', opcoes: [
        { id: 'vago', nome: 'Deu errado' },
        { id: 'bom', nome: 'R$ 15,00, pela regra × R$ 0,00' },
        { id: 'codigo', nome: 'R$ 0,00, que é o que a função devolve' },
      ] },
      { id: 'severidade', rotulo: 'severidade', opcoes: [
        { id: 'vazio', nome: '(em branco)' },
        { id: 'facil', nome: 'baixa: conserta trocando um caractere' },
        { id: 'bom', nome: 'alta: quem devolve no 3º dia não paga' },
      ] },
    ];

    // O que o Bruno faz com cada versao de cada campo. `ok` pinta a linha do
    // painel; `log` e o que ele tentou, para o registro.
    var LEITURA = {
      titulo: {
        pergunta: 'acha o relatório na lista',
        vago: { ok: false, valor: 'mal: não diz o que nem quando', log: 'procura entre os abertos: "a multa" não diz qual parte' },
        alarde: { ok: false, valor: 'mal: alarme não diz o que é', log: 'URGENTE não diz o que acontece; abre para descobrir' },
        bom: { ok: true, valor: 'sim: o título já diz o defeito', log: 'acha o DF-03 pelo título, sem abrir' },
      },
      passos: {
        pergunta: 'faz o defeito acontecer',
        vago: { ok: false, valor: 'não: que dado? quantos dias?', log: 'tenta 2 e 5 dias de atraso: a multa vem certa. "Aqui funciona."', resultado: 'não reproduziu' },
        conserto: { ok: false, valor: 'não: isso é o conserto', log: 'troca o > por >= sem ter visto o defeito; não tem como conferir se consertou', resultado: 'às cegas' },
        bom: { ok: true, valor: 'sim: multa(3) devolve 0.0', log: 'chama multa(3): veio 0.0', resultado: 'reproduziu' },
      },
      esperado: {
        pergunta: 'sabe que é defeito',
        vago: { ok: false, valor: 'não: errado comparado com quê?', log: 'veio 0.0 — e o certo seria quanto?', resultado: 'sem régua' },
        codigo: { ok: false, valor: 'não: esperado igual ao obtido', log: 'esperado 0,00, obtido 0,00: "está certo", e fecha o relatório', resultado: 'fechou sem consertar' },
        bom: { ok: true, valor: 'sim: a regra pede R$ 15,00', log: 'a regra diz R$ 5,00 por dia a partir do 3º: 15,00 não é 0,00', resultado: 'é defeito' },
      },
      severidade: {
        pergunta: 'sabe se é para hoje',
        vazio: { ok: false, valor: 'não: vai para o fim da fila', log: 'sem severidade, vai para o fim da fila' },
        facil: { ok: false, valor: 'não: "baixa", e a locadora perde', log: '"baixa": deixa para sexta-feira, e o balcão segue sem cobrar' },
        bom: { ok: true, valor: 'sim: alta, e diz o estrago', log: 'alta: passa na frente dos outros' },
      },
    };

    var escolhido = {}, aposta = null, entregue = false, pronto = false;
    CAMPOS.forEach(function (c) { escolhido[c.id] = c.opcoes[0]; });

    var palpites = palpite('u3a6-palpite-bruno', [
      { id: 'sim', nome: 'sim, consegue' },
      { id: 'nao', nome: 'não consegue' },
    ], function (op) {
      aposta = op;
      $('u3a6-legenda2').textContent = 'Palpite registrado. Entregue ao Bruno.';
    });

    CAMPOS.forEach(function (c) {
      escolhas('u3a6-campo-' + c.id, c.opcoes, function (op) {
        escolhido[c.id] = op;
        if (!pronto) return;
        // Relatorio mudou: o palpite e a leitura eram do relatorio velho.
        entregue = false; aposta = null; palpites.limpar();
        log.escrever([], 'O Bruno ainda não recebeu esta versão.');
        $('u3a6-legenda2').textContent = 'O relatório mudou. Palpite de novo e entregue.';
        desenhar();
      });
    });

    function reproduz() {
      return escolhido.passos.id === 'bom' && escolhido.esperado.id === 'bom';
    }

    function desenhar() {
      var rel = $('u3a6-relatorio'), br = $('u3a6-bruno');
      rel.textContent = ''; br.textContent = '';
      CAMPOS.forEach(function (c) {
        rel.appendChild(linha(c.rotulo, escolhido[c.id].nome));
        var l = LEITURA[c.id], r = l[escolhido[c.id].id];
        // antes da entrega, nada colorido: o veredito e do Bruno, nao da tela
        br.appendChild(linha(l.pergunta, entregue ? r.valor : 'ainda não leu', entregue ? (r.ok ? 'entrou' : 'velha') : ''));
      });
      var bons = CAMPOS.filter(function (c) { return escolhido[c.id].id === 'bom'; }).length;
      $('u3a6-selo-relatorio').textContent = bons + ' de 4 campos que servem';
      var selo = $('u3a6-selo-bruno');
      selo.textContent = entregue ? (reproduz() ? 'reproduziu' : 'não reproduziu') : 'ainda não recebeu';
      selo.className = 'selo' + (entregue ? (reproduz() ? ' bom' : ' ruim') : '');
      $('u3a6-painel-bruno').classList.toggle('bom', entregue && reproduz());
      $('u3a6-painel-bruno').classList.toggle('ruim', entregue && !reproduz());
    }

    function entregar() {
      if (!aposta) {
        $('u3a6-legenda2').textContent = 'Palpite primeiro: ele consegue ou não, só com o que está escrito?';
        return;
      }
      entregue = true;
      var entradas = [{ hora: '1', ator: 'voce', texto: 'entrega o DF-03 ao Bruno' }];
      CAMPOS.forEach(function (c, k) {
        var r = LEITURA[c.id][escolhido[c.id].id];
        entradas.push({ hora: String(k + 2), ator: 'bruno', texto: c.rotulo + ': ' + r.log, resultado: r.resultado });
      });
      log.escrever(entradas);
      desenhar();

      var ok = reproduz();
      var frase;
      if (escolhido.passos.id === 'vago') frase = 'Sem a entrada exata ele testou outros dias, e a multa veio certa: o defeito sumiu na mão de quem ia consertar.';
      else if (escolhido.passos.id === 'conserto') frase = 'Os passos traziam o conserto, não o caminho até o defeito. O conserto vai na ação corretiva, depois que alguém viu o defeito acontecer.';
      else if (escolhido.esperado.id === 'codigo') frase = 'O esperado copiado do código concorda com o defeito: o Bruno fecha o relatório sem consertar nada.';
      else if (escolhido.esperado.id === 'vago') frase = 'Ele fez o 0.0 aparecer, mas não tem com o que comparar. O esperado sai da regra do dono.';
      else if (escolhido.titulo.id !== 'bom' || escolhido.severidade.id !== 'bom') frase = 'Reproduziu. Mas o título ou a severidade ainda atrasam: ele demora a achar, ou deixa para depois um defeito que custa dinheiro no balcão.';
      else frase = 'Reproduziu na primeira tentativa, sabe o que é o certo, e sabe que é para hoje. É o relatório que outra pessoa consegue usar.';
      $('u3a6-legenda2').textContent = ((aposta.id === 'sim') === ok ? 'Seu palpite bateu. ' : 'Seu palpite não bateu. ') + frase;
    }

    $('u3a6-entregar').addEventListener('click', entregar);
    pronto = true;
    log.escrever([], 'O Bruno ainda não recebeu o relatório.');
    $('u3a6-legenda2').textContent = 'Palpite primeiro: com o relatório como está, ele consegue?';
    desenhar();
  })();
})(window.DemoKit);
