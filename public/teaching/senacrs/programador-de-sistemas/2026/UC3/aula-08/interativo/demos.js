/* demos.js — UC3, Aula 08: o conflito do reajuste, e o numero da proxima versao.
 *
 * O slide mostra os marcadores do conflito ja prontos, e a turma concorda que
 * "o Git nao escolhe" sem ter apostado em nada. Aqui a pessoa faz primeiro o
 * merge que o Git junta sozinho (linhas diferentes), PALPITA antes do segundo
 * merge (fraqueza n. 1 do DIDATICA.md), e no caso da mesma linha RESOLVE o
 * conflito ela mesma (fraqueza n. 2). Os tres botoes do VS Code resolvem para
 * o Git e deixam a suite verde em qualquer valor: o que muda o desfecho e ter
 * perguntado ao dono antes — que e o argumento do slide do erro comum.
 *
 * A segunda demo pede que a pessoa PRODUZA a numeracao: sete mudancas depois
 * da v1.0.0, o tipo de cada uma e a tag que ela ganha. O palpite sobre a
 * maior fatia da manutencao fica aberto ate o fim da historia.
 */
(function (K) {
  'use strict';
  var $ = K.$, el = K.el, linha = K.linha, novoLog = K.novoLog, escolhas = K.escolhas, palpite = K.palpite, linhaCodigo = K.linhaCodigo;

  /* Linha de codigo no painel: o .linha do kit, com o codigo em <code> e a
     indentacao em espaco nao separavel. Num <span> comum o HTML junta os
     espacos, e o Python sem indentacao vira outro programa na tela. */
  /* ================= 1. quem escolhe o valor da multa ================= */

  (function () {
    if (!$('u3a8-merge')) return;
    var log = novoLog('u3a8-log');

    // As duas historias do deck. Os trechos do multa.py sao os do
    // locadora-historico (gerar-historico.sh da Aula 07): no caso "longe" a
    // main ainda tem o > da regressao; no "mesma" a corrige-fronteira ja
    // entrou, como na sequencia da aula.
    var CASOS = [
      {
        id: 'longe',
        nome: 'linhas diferentes — a fronteira e o teto',
        ramos: [
          { nome: 'corrige-fronteira', ator: 'ana', pessoa: 'Ana', muda: '    if dias_atraso >= 3:',
            commit: 'Multa a partir do 3o dia: >= na fronteira' },
          { nome: 'teto-da-multa', ator: 'bruno', pessoa: 'Bruno', muda: ['TETO_MULTA = 50.00', '        return min(valor, TETO_MULTA)'],
            commit: 'Teto da multa: no maximo R$ 50' },
        ],
        pergunta: 'Seu palpite: no merge da teto-da-multa, o que o Git faz com as duas mudanças?',
        palpites: [
          { id: 'so-ultimo', nome: 'fica só a do Bruno, o último merge' },
          { id: 'junta', nome: 'junta as duas sozinho' },
          { id: 'para', nome: 'para e pergunta' },
        ],
        certo: 'junta',
      },
      {
        id: 'mesma',
        nome: 'a mesma linha — o reajuste da multa',
        ramos: [
          { nome: 'reajuste-ana', ator: 'ana', pessoa: 'Ana', muda: 'MULTA_POR_DIA = 6.00',
            commit: 'Reajusta multa para R$ 6,00' },
          { nome: 'reajuste-bruno', ator: 'bruno', pessoa: 'Bruno', muda: 'MULTA_POR_DIA = 5.50',
            commit: 'Reajusta multa para R$ 5,50' },
        ],
        pergunta: 'Seu palpite: no merge da reajuste-bruno, o Git escolhe qual valor fica?',
        palpites: [
          { id: 'ultimo', nome: 'fica 5.50, o do último merge' },
          { id: 'maior', nome: 'fica 6.00, o maior' },
          { id: 'para', nome: 'nenhum: ele para e pergunta' },
        ],
        certo: 'para',
      },
    ];

    var caso, etapa, aposta, perguntou, resolucao, palpites;

    // Os tres botoes do VS Code. Usa o palpite() do kit porque e o grupo de
    // pilulas que nasce SEM nenhuma acesa: o escolhas() acenderia o primeiro e
    // resolveria o conflito sozinho, que e exatamente o que a demo critica.
    var RESOLUCOES = [
      { id: 'atual', nome: 'Accept Current — fica 6.00' },
      { id: 'entrada', nome: 'Accept Incoming — fica 5.50' },
      { id: 'ambas', nome: 'Accept Both — ficam as duas linhas' },
    ];
    var resolver = palpite('u3a8-resolver', RESOLUCOES, function (op) {
      if (!emConflito()) return false;
      resolucao = op.id;
      desenhar();
    });

    function emConflito() {
      return caso && caso.id === 'mesma' && etapa === 2;
    }

    function recomecar() {
      etapa = 0; aposta = null; perguntou = false; resolucao = null;
      // o palpite muda de pergunta com o caso: refaz as pilulas, sem nenhuma acesa
      $('u3a8-palpite').textContent = '';
      $('u3a8-pergunta').textContent = caso.pergunta;
      var deste = caso;
      palpites = palpite('u3a8-palpite', caso.palpites, function (op) {
        // pilula de um caso que ja saiu da tela nao vale para o caso atual
        if (deste !== caso || etapa === 2) return false;
        aposta = op;
        desenhar();
      });
      resolver.limpar();
      desenhar();
    }

    /* O multa.py da main em cada etapa. Devolve as linhas ja prontas. */
    function arquivo() {
      var r = [];
      if (caso.id === 'longe') {
        r.push(linhaCodigo('MULTA_POR_DIA = 5.00'));
        if (etapa >= 2) r.push(linhaCodigo('TETO_MULTA = 50.00', 'do Bruno', 'entrou'));
        r.push(linhaCodigo('def multa(dias_atraso, cliente_fiel=False):'));
        r.push(etapa >= 1
          ? linhaCodigo('    if dias_atraso >= 3:', 'da Ana', 'entrou')
          : linhaCodigo('    if dias_atraso > 3:'));
        r.push(linhaCodigo('        valor = dias_atraso * MULTA_POR_DIA'));
        r.push(linhaCodigo('        if cliente_fiel:'));
        r.push(linhaCodigo('            valor = valor / 2'));
        r.push(etapa >= 2
          ? linhaCodigo('        return min(valor, TETO_MULTA)', 'do Bruno', 'entrou')
          : linhaCodigo('        return valor'));
        r.push(linhaCodigo('    return 0.0'));
        return r;
      }

      if (etapa === 0) r.push(linhaCodigo('MULTA_POR_DIA = 5.00'));
      else if (etapa === 1) r.push(linhaCodigo('MULTA_POR_DIA = 6.00', 'da Ana', 'entrou'));
      else if (!resolucao) {
        // o conflito nao e erro: borda de destaque, nao vermelho
        r.push(linhaCodigo('<<<<<<< HEAD', '', 'achou'));
        r.push(linhaCodigo('MULTA_POR_DIA = 6.00', 'Current: a main, com a Ana', 'achou'));
        r.push(linhaCodigo('=======', '', 'achou'));
        r.push(linhaCodigo('MULTA_POR_DIA = 5.50', 'Incoming: vem do Bruno', 'achou'));
        r.push(linhaCodigo('>>>>>>> reajuste-bruno', '', 'achou'));
      } else if (resolucao === 'ambas') {
        r.push(linhaCodigo('MULTA_POR_DIA = 6.00', 'a de baixo apaga esta', 'velha'));
        r.push(linhaCodigo('MULTA_POR_DIA = 5.50', 'é esta que vale', 'velha'));
      } else {
        var valor = resolucao === 'atual' ? '6.00' : '5.50';
        var bate = perguntou && resolucao === 'atual';
        var contra = perguntou && resolucao === 'entrada';
        r.push(linhaCodigo('MULTA_POR_DIA = ' + valor, bate ? 'a da issue #4' : contra ? 'contra a issue #4' : '',
          bate ? 'entrou' : contra ? 'velha' : ''));
      }
      r.push(linhaCodigo('def multa(dias_atraso, cliente_fiel=False):'));
      r.push(linhaCodigo('    if dias_atraso >= 3:'));
      if (resolucao) {
        var certo = perguntou && resolucao === 'atual';
        r.push(linha('quem decidiu o valor', certo ? 'o dono, na issue #4' : perguntou ? 'você, contra o dono' : 'você, sem perguntar',
          (certo ? 'entrou' : 'velha') + ' afastado'));
      }
      return r;
    }

    function entradasDoLog() {
      var a = caso.ramos[0], b = caso.ramos[1];
      var e = [
        { hora: 'seg', ator: a.ator, sql: true, texto: 'git commit -m "' + a.commit + '"', resultado: 'em ' + a.nome },
        { hora: 'seg', ator: b.ator, sql: true, texto: 'git commit -m "' + b.commit + '"', resultado: 'em ' + b.nome },
      ];
      // o primeiro merge e fast-forward: a main nao andou desde que a branch saiu
      if (etapa >= 1) e.push({ hora: 'ter', ator: 'git', sql: true, texto: 'git merge ' + a.nome, resultado: 'Fast-forward' });
      if (etapa >= 2) {
        e.push({ hora: 'ter', ator: 'git', sql: true, texto: 'git merge ' + b.nome,
          // O selo do resultado nao quebra linha, e a mensagem inteira do Git
          // ("CONFLICT (content): Merge conflict in multa.py") estourava a
          // largura do celular: fica a palavra que o Git poe em maiuscula.
          resultado: caso.id === 'longe' ? 'sem conflito' : 'CONFLICT' });
      }
      if (perguntou) {
        e.push({ hora: 'ter', ator: 'voce', texto: 'abre a issue #4: "A multa por dia é 6,00 ou 5,50?"', resultado: 'o dono: R$ 6,00' });
      }
      if (resolucao) {
        var botao = RESOLUCOES.filter(function (x) { return x.id === resolucao; })[0].nome.split(' — ')[0];
        e.push({ hora: 'ter', ator: 'voce', texto: botao + ', no VS Code', resultado: 'o Git aceita' });
        // verde nos tres casos: o teste nao sabe o preco que o dono quer
        e.push({ hora: 'ter', ator: 'pytest', sql: true, texto: 'pytest', resultado: 'suíte inteira verde' });
        var msg = perguntou && resolucao === 'atual' ? 'Reajusta multa para R$ 6 (fixes #4)' : 'Resolve o conflito da multa';
        e.push({ hora: 'ter', ator: 'voce', sql: true, texto: 'git commit -m "' + msg + '"', resultado: perguntou && resolucao === 'atual' ? 'fecha a issue #4' : 'commit do merge' });
      }
      return e;
    }

    function fraseDoPalpite() {
      if (!aposta) return '';
      return aposta.id === caso.certo ? 'Seu palpite bateu. ' : 'Seu palpite não bateu. ';
    }

    function legenda() {
      var b = caso.ramos[1];
      if (etapa === 0) return 'Os dois commits estão feitos, cada um na sua branch. Faça o merge da ' + caso.ramos[0].nome + '.';
      if (etapa === 1) {
        return aposta
          ? 'Palpite registrado. Agora o merge da ' + b.nome + '.'
          : 'A main recebeu a mudança da Ana. Antes do merge da ' + b.nome + ', escolha um palpite.';
      }
      if (caso.id === 'longe') {
        return fraseDoPalpite() + 'O Git juntou as duas sozinho: as mudanças não se tocam. Agora escolha "a mesma linha".';
      }
      if (!resolucao) {
        return perguntou
          ? 'O dono respondeu na issue #4: R$ 6,00. Agora resolva o conflito com a resposta dele.'
          : fraseDoPalpite() + 'O Git não escolheu: parou e marcou as duas versões no arquivo. Resolva — ou pergunte antes.';
      }
      if (resolucao === 'ambas') return 'Accept Both deixou as duas linhas, e o Python fica com a última: 5,50, sem erro nenhum e com a suíte verde.';
      if (!perguntou) return 'O Git aceitou e a suíte ficou verde — mas o preço da multa foi escolhido por quem estava com o teclado. Pergunte ao dono.';
      if (resolucao === 'entrada') return 'A issue diz R$ 6,00, e a suíte passou com 5,50 do mesmo jeito: o teste não sabe o preço que o dono quer.';
      return 'Resolvido com a resposta do dono, suíte verde, e o commit cita a issue: fixes #4 a fecha quando chega na main.';
    }

    function desenhar() {
      var ramos = $('u3a8-ramos'), main = $('u3a8-main');
      ramos.textContent = ''; main.textContent = '';

      caso.ramos.forEach(function (r, k) {
        // Depois de resolvido, "entrou" e so o lado que ficou no arquivo: com
        // Accept Current a linha do Bruno nao esta na main, e acende-la diria
        // o contrario do painel de baixo.
        var ficou = !resolucao || resolucao === 'ambas' || resolucao === (k === 0 ? 'atual' : 'entrada');
        var entrou = etapa > k && ficou && !(k === 1 && emConflito() && !resolucao);
        var preso = k === 1 && emConflito() && !resolucao;
        // o Bruno do teto muda duas linhas: uma linha de painel para cada, que
        // e como o multa.py da main as mostra logo abaixo
        [].concat(r.muda).forEach(function (codigo) {
          var l = linhaCodigo(codigo, r.nome + ' — ' + r.pessoa, entrou ? 'entrou' : preso ? 'achou' : '');
          ramos.appendChild(l);
        });
      });
      if (perguntou) ramos.appendChild(linha('issue #4 — a multa por dia', 'o dono decidiu: R$ 6,00', 'achou afastado'));
      $('u3a8-selo-ramos').textContent = resolucao === 'atual' ? 'ficou a da Ana'
        : resolucao === 'entrada' ? 'ficou a do Bruno'
        : etapa >= 2 && (!emConflito() || resolucao) ? 'as duas na main'
        : etapa >= 1 ? '1 de 2 na main' : '2 branches';

      arquivo().forEach(function (l) { main.appendChild(l); });

      var selo = $('u3a8-selo-main'), painel = $('u3a8-painel-main');
      var bom = false, ruim = false, textoSelo;
      if (etapa === 0) textoSelo = 'antes dos merges';
      else if (etapa === 1) textoSelo = 'com a Ana';
      else if (caso.id === 'longe') { textoSelo = 'com os dois'; bom = true; }
      else if (!resolucao) textoSelo = 'merge parado: conflito';
      else {
        bom = perguntou && resolucao === 'atual';
        ruim = !bom;
        textoSelo = bom ? 'resolvido' : resolucao === 'ambas' ? 'duas linhas' : 'resolvido no chute';
      }
      selo.textContent = textoSelo;
      selo.className = 'selo' + (bom ? ' bom' : ruim ? ' ruim' : '');
      painel.classList.toggle('bom', bom);
      painel.classList.toggle('ruim', ruim);

      var botao = $('u3a8-merge');
      botao.textContent = 'Merge da ' + caso.ramos[Math.min(etapa, 1)].nome;
      // sem palpite nao ha segundo merge: quem so assiste concorda com qualquer desfecho
      botao.disabled = etapa >= 2 || (etapa === 1 && !aposta);

      $('u3a8-resolver-area').hidden = !emConflito();
      $('u3a8-perguntar').disabled = perguntou;
      $('u3a8-legenda').textContent = legenda();
      log.escrever(entradasDoLog());
    }

    escolhas('u3a8-caso', CASOS, function (c) { caso = c; recomecar(); });

    $('u3a8-merge').addEventListener('click', function () {
      if (etapa >= 2 || (etapa === 1 && !aposta)) return;
      etapa += 1;
      desenhar();
    });
    $('u3a8-recomecar').addEventListener('click', recomecar);
    $('u3a8-perguntar').addEventListener('click', function () {
      if (!emConflito()) return;
      perguntou = true;
      desenhar();
    });
  })();

  /* ================= 2. que numero tem a proxima versao ================= */

  (function () {
    if (!$('u3a8-proxima')) return;
    var log = novoLog('u3a8-log2');

    var TIPOS = [
      { id: 'correcao', nome: 'correção de defeito' },
      { id: 'adaptacao', nome: 'adaptação ao ambiente' },
      { id: 'adicao', nome: 'adição de funcionalidade' },
    ];
    // Ordem das pilulas embaralhada a mao: com a certa sempre no mesmo lugar,
    // a partir da terceira mudanca a pessoa clica por posicao, nao por regra.
    var MUDANCAS = [
      { pedido: 'Quem atrasa exatamente 3 dias não paga multa: o > da fronteira voltou.',
        resumo: 'a fronteira da multa', tipo: 'correcao', versoes: ['v1.0.1', 'v1.1.0', 'v2.0.0'],
        porque: 'O sistema fazia diferente do que o dono pediu: é defeito.' },
      { pedido: 'O dono quer um teto: a multa nunca passa de R$ 50,00. O resto do balcão continua igual.',
        resumo: 'o teto da multa', tipo: 'adicao', versoes: ['v1.0.2', 'v1.1.1', 'v1.1.0'],
        porque: 'Nada estava errado antes: é regra nova de negócio.' },
      { pedido: 'O laboratório trocou a versão do PostgreSQL e o CRUD parou de conectar. Ajustada a conexão, o balcão volta a funcionar como antes.',
        resumo: 'a conexão com o PostgreSQL novo', tipo: 'adaptacao', versoes: ['v1.2.0', 'v1.1.1', 'v2.0.0'],
        porque: 'A regra não mudou: foi o ambiente em volta do código que mudou.' },
      { pedido: 'Cliente fiel passa a pagar metade da multa.',
        resumo: 'o desconto do cliente fiel', tipo: 'adicao', versoes: ['v1.1.2', 'v1.2.1', 'v1.2.0'],
        porque: 'É o negócio mudando, não um defeito.' },
      { pedido: 'O dono quer um relatório dos aluguéis por cliente.',
        resumo: 'o relatório por cliente', tipo: 'adicao', versoes: ['v1.3.0', 'v1.2.1', 'v2.0.0'],
        porque: 'Funcionalidade que não existia — e o que existia continua igual.' },
      { pedido: 'A tela do balcão foi refeita: o atendente tem de aprender um caminho novo para registrar a devolução.',
        resumo: 'a tela nova do balcão', tipo: 'adicao', grande: true, versoes: ['v1.4.0', 'v2.3.0', 'v2.0.0'],
        porque: 'Funcionalidade nova, e grande: quem usa precisa reaprender.' },
      { pedido: 'Uma semana depois da tela nova, dois defeitos nela: o botão de devolver some no celular, e a data sai trocada.',
        resumo: 'os defeitos da tela nova', tipo: 'correcao', versoes: ['v2.1.0', 'v2.0.1', 'v3.0.0'],
        porque: 'Versão com muita novidade costuma pedir uma só de correção logo depois.' },
    ];
    var FATIAS = [
      { id: 'correcao', nome: 'consertar defeito' },
      { id: 'adaptacao', nome: 'adaptar ao ambiente' },
      { id: 'adicao', nome: 'funcionalidade nova' },
    ];

    var n, versaoAtual, feitas, tipoDito, versaoDita, apostaFatia = null;

    function partes(v) { return v.slice(1).split('.').map(Number); }

    /* A tag certa sai da regra do slide, e nao de uma tabela escrita a mao:
       se um item mudar de tipo, o numero acompanha. A adaptacao sobe o do fim
       — para quem usa nada e novo nem diferente. */
    function proxima(v, m) {
      var p = partes(v);
      if (m.grande) return 'v' + (p[0] + 1) + '.0.0';
      if (m.tipo === 'adicao') return 'v' + p[0] + '.' + (p[1] + 1) + '.0';
      return 'v' + p[0] + '.' + p[1] + '.' + (p[2] + 1);
    }

    /* Por que o numero escolhido nao serve: le o que ele mudou e diz a regra
       que ele quebrou. */
    function porQueNao(v, escolhida, m) {
      var a = partes(v), e = partes(escolhida);
      if (m.grande && e[0] === a[0]) return 'o atendente tem de reaprender: é o primeiro número que sobe.';
      if (e[0] > a[0] && (e[1] || e[2])) return 'quando o primeiro número sobe, os outros dois voltam a zero.';
      if (e[0] > a[0]) return 'o primeiro número é para quando quem usa precisa reaprender — e aqui ' + (m.tipo === 'adicao' ? 'o que existia continua igual.' : 'nada muda para quem usa.');
      if (e[1] > a[1] && e[2]) return 'quando o número do meio sobe, o do fim volta a zero.';
      if (e[1] > a[1]) return 'o do meio é para funcionalidade nova, e aqui nada é novo para quem usa.';
      return 'o do fim é só para correção; funcionalidade nova sobe o do meio.';
    }

    function nomeTipo(id) { return TIPOS.filter(function (t) { return t.id === id; })[0].nome; }

    palpite('u3a8-fatia', FATIAS, function (op) {
      apostaFatia = op;
      desenhar();
    });

    var grupoTipo = palpite('u3a8-tipo', TIPOS, function (op) {
      if (n >= MUDANCAS.length || tipoDito === MUDANCAS[n].tipo) return false;
      tipoDito = op.id;
      desenhar();
    });

    function montarVersoes() {
      $('u3a8-versao').textContent = '';
      if (n >= MUDANCAS.length) return;
      var desta = n;
      palpite('u3a8-versao', MUDANCAS[n].versoes.map(function (v) { return { id: v, nome: v }; }), function (op) {
        // pilula de uma mudanca que ja passou nao vale para a atual
        if (desta !== n || versaoDita === proxima(versaoAtual, MUDANCAS[n])) return false;
        versaoDita = op.id;
        desenhar();
      });
    }

    function recomecar() {
      n = 0; versaoAtual = 'v1.0.0'; feitas = []; tipoDito = null; versaoDita = null;
      grupoTipo.limpar();
      montarVersoes();
      desenhar();
    }

    function contagem() {
      var c = { correcao: 0, adaptacao: 0, adicao: 0 };
      feitas.forEach(function (f) { c[f.tipo] += 1; });
      return c;
    }

    function desenhar() {
      var tags = $('u3a8-tags'), vez = $('u3a8-vez');
      tags.textContent = ''; vez.textContent = '';

      tags.appendChild(linha('v1.0.0', 'a entrega da UC'));
      feitas.forEach(function (f, k) {
        // so a ultima fica acesa: e a que acabou de entrar
        tags.appendChild(linha(f.versao, f.resumo, k === feitas.length - 1 ? 'entrou' : ''));
      });
      $('u3a8-selo-tags').textContent = 'no balcão: ' + versaoAtual;

      var c = contagem();
      $('u3a8-conta').textContent = 'Até aqui: ' + c.correcao + ' de correção, ' + c.adaptacao + ' de adaptação, ' + c.adicao + ' de funcionalidade nova.';

      var fim = n >= MUDANCAS.length;
      var legenda;
      if (fim) {
        vez.appendChild(el('div', 'ficha', 'As sete mudanças viraram tags. A locadora está na ' + versaoAtual + '.'));
        vez.appendChild(linha('correção de defeito', c.correcao + ' de 7 — no livro, 17%'));
        vez.appendChild(linha('adaptação ao ambiente', c.adaptacao + ' de 7 — no livro, 18%'));
        vez.appendChild(linha('adição de funcionalidade', c.adicao + ' de 7 — no livro, 65%', 'achou'));
        $('u3a8-selo-vez').textContent = 'fim';
        legenda = 'Consertar defeito foi a menor parte: o sistema mudou porque o negócio mudou.';
        if (apostaFatia) {
          legenda = (apostaFatia.id === 'adicao' ? 'Seu palpite bateu. ' : 'Seu palpite foi "' + apostaFatia.nome + '". ') + legenda;
        } else {
          legenda = 'O palpite sobre a manutenção ficou sem resposta: confira com o livro. ' + legenda;
        }
      } else {
        var m = MUDANCAS[n];
        var certa = proxima(versaoAtual, m);
        $('u3a8-selo-vez').textContent = (n + 1) + ' de ' + MUDANCAS.length;
        vez.appendChild(el('div', 'ficha', m.pedido));

        var tipoOk = tipoDito === m.tipo;
        vez.appendChild(linha('tipo', !tipoDito ? '?' : tipoOk ? nomeTipo(m.tipo) : 'seu palpite: ' + nomeTipo(tipoDito),
          !tipoDito ? '' : tipoOk ? 'entrou' : 'velha'));
        var versaoOk = versaoDita === certa;
        vez.appendChild(linha('próxima tag', !versaoDita ? '?' : versaoOk ? certa : 'seu palpite: ' + versaoDita,
          !versaoDita ? '' : versaoOk ? 'entrou' : 'velha'));

        if (!tipoDito && !versaoDita) legenda = 'A versão no balcão é a ' + versaoAtual + '. Escolha o tipo e a tag.';
        else if (tipoDito && !tipoOk) {
          legenda = 'Não é ' + nomeTipo(tipoDito) + '. ' + m.porque;
          if (versaoDita && !versaoOk) legenda += ' E a ' + versaoDita + ' não serve: ' + porQueNao(versaoAtual, versaoDita, m);
        } else if (versaoDita && !versaoOk) legenda = 'A ' + versaoDita + ' não serve: ' + porQueNao(versaoAtual, versaoDita, m);
        else if (tipoOk && versaoOk) legenda = 'Isso: ' + nomeTipo(m.tipo) + ', ' + certa + '. ' + m.porque;
        else if (tipoOk) legenda = 'Isso. ' + m.porque + ' Agora a tag.';
        else legenda = 'A tag é ' + certa + '. Agora o tipo.';
        $('u3a8-proxima').disabled = !(tipoOk && versaoOk);
      }
      if (fim) $('u3a8-proxima').disabled = true;
      // no fim nao ha mudanca para classificar: as duas perguntas sem pilula
      // ficariam penduradas na tela
      $('u3a8-perguntas').hidden = fim;
      $('u3a8-proxima').textContent = fim ? 'Fim da história' : n === MUDANCAS.length - 1 ? 'Marcar a última tag' : 'Próxima mudança';
      $('u3a8-legenda2').textContent = legenda;

      var entradas = [{ hora: 'v1.0.0', ator: 'git', sql: true, texto: 'git tag v1.0.0 && git push --tags', resultado: 'a entrega' }];
      feitas.forEach(function (f) {
        entradas.push({ hora: f.versao, ator: 'git', sql: true, texto: 'git tag ' + f.versao + ' && git push --tags', resultado: f.tipo === 'adicao' ? 'funcionalidade nova' : f.tipo === 'correcao' ? 'correção' : 'adaptação' });
      });
      log.escrever(entradas);
    }

    $('u3a8-proxima').addEventListener('click', function () {
      if (n >= MUDANCAS.length) return;
      var m = MUDANCAS[n], certa = proxima(versaoAtual, m);
      if (tipoDito !== m.tipo || versaoDita !== certa) return;
      feitas.push({ versao: certa, resumo: m.resumo, tipo: m.tipo });
      versaoAtual = certa;
      n += 1; tipoDito = null; versaoDita = null;
      grupoTipo.limpar();
      montarVersoes();
      desenhar();
    });
    $('u3a8-recomecar2').addEventListener('click', recomecar);

    recomecar();
  })();
})(window.DemoKit);
