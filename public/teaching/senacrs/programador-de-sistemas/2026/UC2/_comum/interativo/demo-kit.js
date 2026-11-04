/* demo-kit.js — as peças que toda demonstração da UC reusa.
 *
 * POR QUE existe: `demos.js` da Aula 01 chegou a 644 linhas com seis
 * demonstrações e três utilitários no mesmo arquivo. Duas consequências
 * concretas: um recorte errado apagou metade de uma demo sem quebrar nada
 * visível (nenhum erro de console — a função existia e ninguém a chamava), e
 * a Aula 02 em diante teria de copiar os utilitários.
 *
 * Aqui fica só o que se repete entre aulas. O que é de uma aula só mora ao
 * lado dela.
 *
 * Script clássico, sem módulo: a página precisa abrir com duplo clique no
 * arquivo quando a internet do laboratório cair.
 */
(function (raiz) {
  'use strict';

  function $(id) {
    return document.getElementById(id);
  }

  /** Cria um elemento com classe e texto num passo só. */
  function el(tag, classe, texto) {
    var e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texto != null) e.textContent = texto;
    return e;
  }

  /** Linha de painel: rótulo à esquerda, valor à direita. */
  function linha(texto, valor, classe) {
    var l = el('div', 'linha' + (classe ? ' ' + classe : ''));
    l.appendChild(el('span', null, texto));
    l.appendChild(el('span', null, valor));
    return l;
  }

  /**
   * Linha de painel com código à esquerda: o recuo do Python vira espaço que
   * não encolhe, senão o HTML junta os espaços e o if aparece fora do def.
   */
  function linhaCodigo(codigo, nota, classe) {
    var l = el('div', 'linha' + (classe ? ' ' + classe : ''));
    var esq = el('span');
    esq.appendChild(el('code', null, codigo.replace(/^ +/, function (b) { return b.replace(/ /g, '\u00a0'); })));
    l.appendChild(esq);
    l.appendChild(el('span', null, nota || ''));
    return l;
  }

  // Os atores do registro. Pessoas, lados de uma comparacao, e as familias de
  // comando — cada um com cor propria no CSS.
  var NOME_ATOR = {
    ana: 'Ana',
    bruno: 'Bruno',
    servidor: 'servidor',
    planilha: 'planilha',
    banco: 'banco',
    ddl: 'DDL',
    dml: 'DML',
    dcl: 'DCL',
    voce: 'você',
    campo: 'como campo',
    entidade: 'como entidade',
    // os da UC3: quem roda o teste, quem guarda a versao, e o codigo testado
    pytest: 'pytest',
    git: 'git',
    codigo: 'código',
    // e os de fora que a UC3 troca por dubles
    whatsapp: 'WhatsApp',
    relogio: 'relógio',
    duble: 'dublê',
  };

  /**
   * Registro de operações.
   *
   * O painel de uma demo mostra o ESTADO; o registro mostra a OPERAÇÃO que
   * levou até ele — e é nele que o SQL aparece escrito, que é o que a UC de
   * fato ensina.
   *
   * Duas formas, porque são duas leituras diferentes:
   *
   *   escrever  uma história em ordem de hora, com vários atores. Use quando
   *             há uma sequência: primeiro isto, depois aquilo.
   *   comparar  duas colunas lado a lado e um veredito embaixo. Use quando os
   *             dois lados fazem a MESMA coisa e o que interessa é o contraste
   *             — empilhar obriga o leitor a parear as linhas de cabeça.
   */
  function novoLog(id) {
    var alvo = $(id);
    // Sem o elemento, devolve um objeto com a MESMA superfície. Devolver
    // menos métodos que o objeto real troca "a demo não aparece" por
    // "a página inteira quebra no primeiro clique".
    if (!alvo) return { escrever: function () {}, comparar: function () {} };

    function corpoOp(e) {
      var op = el(e.bloco ? 'p' : 'span', 'op');
      if (e.sql) op.appendChild(el('code', null, e.texto));
      else op.textContent = e.texto;
      if (e.resultado) op.appendChild(el('span', 'resultado', e.resultado));
      return op;
    }

    function vazio(texto) {
      var li = el('li', 'so-veredito');
      li.appendChild(el('span', 'op', texto || 'Nada aconteceu ainda.'));
      return li;
    }

    return {
      escrever: function (entradas, textoVazio) {
        alvo.className = 'log';
        alvo.textContent = '';
        if (!entradas.length) {
          alvo.appendChild(vazio(textoVazio));
          return;
        }
        entradas.forEach(function (e) {
          var li = el('li', e.marca || '');
          li.appendChild(el('span', 'hora', e.hora || ''));
          li.appendChild(el('span', 'ator ' + e.ator, NOME_ATOR[e.ator] || e.ator));
          li.appendChild(corpoOp(e));
          alvo.appendChild(li);
        });
      },

      comparar: function (colunas, veredito, textoVazio) {
        alvo.className = 'log par';
        alvo.textContent = '';
        if (!colunas.length) {
          alvo.appendChild(vazio(textoVazio));
          return;
        }
        colunas.forEach(function (c) {
          var li = el('li', 'coluna ' + c.ator + (c.marca ? ' ' + c.marca : ''));
          li.appendChild(el('span', 'ator ' + c.ator, NOME_ATOR[c.ator] || c.ator));
          c.linhas.forEach(function (e) {
            e.bloco = true;
            li.appendChild(corpoOp(e));
          });
          alvo.appendChild(li);
        });
        if (veredito) {
          var fim = el('li', 'so-veredito' + (veredito.marca ? ' ' + veredito.marca : ''));
          fim.appendChild(el('span', 'op', veredito.texto));
          alvo.appendChild(fim);
        }
      },
    };
  }

  /**
   * Grupo de escolha: uma pílula por caso, só uma acesa por vez.
   *
   * Existia copiado em sete lugares — Aulas 01 a 05 —, sempre com as mesmas
   * cinco linhas de `aria-pressed` e a mesma chamada final para o primeiro
   * item. Essa última linha é a que importa: sem ela a demonstração abre com
   * os painéis vazios, só cabeçalho, e nada na tela diz que é preciso clicar.
   * Aqui ela não tem como ser esquecida.
   *
   * @param {string} idCaixa  id do contêiner `.camadas`
   * @param {Array}  itens    [{ id, nome }]
   * @param {Function} aoEscolher  recebe o item escolhido
   */
  function escolhas(idCaixa, itens, aoEscolher) {
    var caixa = $(idCaixa);
    if (!caixa) return;
    var botoes = [];

    function escolher(item) {
      botoes.forEach(function (b) {
        b.setAttribute('aria-pressed', b.dataset.id === item.id ? 'true' : 'false');
      });
      aoEscolher(item);
    }

    itens.forEach(function (item) {
      var b = el('button', 'camada-btn');
      b.type = 'button';
      b.dataset.id = item.id;
      // a cor da pilula vem do tema, nao de um hex: ler o valor resolvido aqui
      // congelaria a cor do tema vigente no carregamento.
      b.style.setProperty('--cor', 'var(--accent)');
      b.setAttribute('aria-pressed', 'false');
      b.appendChild(el('span', 'ponto'));
      b.appendChild(el('span', null, item.nome));
      b.addEventListener('click', function () { escolher(item); });
      botoes.push(b);
      caixa.appendChild(b);
    });

    escolher(itens[0]);
  }

  /**
   * Palpite antes de revelar: pílulas sem nenhuma acesa no começo.
   *
   * A fraqueza nº 1 do DIDATICA.md: nenhuma demonstração pedia previsão, e quem
   * só assiste concorda com qualquer desfecho. O conflito cognitivo só trabalha
   * quando a pessoa se compromete antes. Por isso é diferente de `escolhas()`,
   * que acende o primeiro item ao abrir — aqui isso seria dar a resposta.
   *
   * A demonstração decide o que fazer com o palpite: `aoPalpitar(item)` roda a
   * coisa e compara; se devolver `false`, o clique é recusado e as pílulas
   * voltam ao que eram. `limpar()` devolve as pílulas ao estado sem escolha, para
   * a pessoa palpitar de novo quando o caso muda.
   *
   * @param {string}   idCaixa     id do contêiner `.camadas`
   * @param {Array}    opcoes      [{ id, nome }]
   * @param {Function} aoPalpitar  recebe a opção escolhida
   */
  function palpite(idCaixa, opcoes, aoPalpitar) {
    var caixa = $(idCaixa);
    if (!caixa) return { limpar: function () {} };
    var botoes = [];

    opcoes.forEach(function (op) {
      var b = el('button', 'camada-btn');
      b.type = 'button';
      b.dataset.id = op.id;
      b.style.setProperty('--cor', 'var(--accent)');
      b.setAttribute('aria-pressed', 'false');
      b.appendChild(el('span', 'ponto'));
      b.appendChild(el('span', null, op.nome));
      b.addEventListener('click', function () {
        var antes = botoes.map(function (x) { return x.getAttribute('aria-pressed'); });
        botoes.forEach(function (x) {
          x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
        });
        // A demo pode recusar o clique (palpite fora de hora, caso que ainda
        // nao chegou). Sem devolver a pilula ao estado de antes, ela fica acesa
        // e o painel diz outra coisa — a tela contradiz a si mesma.
        if (aoPalpitar(op) === false) {
          botoes.forEach(function (x, k) { x.setAttribute('aria-pressed', antes[k]); });
        }
      });
      botoes.push(b);
      caixa.appendChild(b);
    });

    return {
      limpar: function () {
        botoes.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      },
    };
  }

  /**
   * Pílulas de liga-desliga: várias acesas ao mesmo tempo.
   *
   * Existia copiado em três aulas da UC3 (montar a suíte, escolher os dias da
   * fronteira, escolher o próximo teste). Quem decide o que fica aceso é a
   * demonstração — uma limita a três, outra ignora o que já está na suíte —,
   * por isso o clique só avisa, e `acender(aceso)` redesenha pelo estado dela.
   *
   * @param {string}   idCaixa   id do contêiner `.camadas`
   * @param {Array}    itens     os objetos da demonstração, como ela os guarda
   * @param {Function} rotulo    item → texto da pílula
   * @param {Function} aoClicar  recebe o item clicado
   * @returns {Function} acender(aceso), com aceso(item) → booleano
   */
  function alternancias(idCaixa, itens, rotulo, aoClicar) {
    var caixa = $(idCaixa), botoes = [];
    if (!caixa) return function () {};
    itens.forEach(function (item) {
      var b = el('button', 'camada-btn');
      b.type = 'button';
      b.style.setProperty('--cor', 'var(--accent)');
      b.setAttribute('aria-pressed', 'false');
      b.appendChild(el('span', 'ponto'));
      b.appendChild(el('span', null, rotulo(item)));
      b.addEventListener('click', function () { aoClicar(item); });
      botoes.push(b);
      caixa.appendChild(b);
    });
    return function acender(aceso) {
      botoes.forEach(function (b, k) { b.setAttribute('aria-pressed', aceso(itens[k]) ? 'true' : 'false'); });
    };
  }

  /**
   * Um teste da suíte, para uma `ul.testes`: sinal, nome e resposta.
   *
   * Estava escrito à mão em seis aulas da UC3, cada uma com uma variação — e
   * só duas quebravam o nome no `_`. Sem esse ponto de quebra, um nome de
   * teste de 40 letras é uma palavra só e alarga o painel inteiro no celular.
   *
   * @param {string}       nome      nome do teste, ou o assert
   * @param {boolean|null} passou    null quando ainda não rodou
   * @param {string}       resposta  o que aparece à direita
   * @param {number}       [k]       posição, para o atraso da entrada
   */
  function itemTeste(nome, passou, resposta, k) {
    var li = el('li', 'teste ' + (passou == null ? 'nem-rodou' : passou ? 'passou' : 'falhou'));
    li.style.setProperty('--atraso', ((k || 0) * 0.05) + 's');
    li.appendChild(el('span', 'sinal', passou == null ? '·' : passou ? '✓' : '✕'));
    li.appendChild(el('span', 'pergunta-teste', nome.replace(/_/g, '_\u200b')));
    li.appendChild(el('span', 'resposta', resposta));
    return li;
  }

  raiz.DemoKit = {
    $: $, el: el, linha: linha, linhaCodigo: linhaCodigo, novoLog: novoLog,
    escolhas: escolhas, palpite: palpite, alternancias: alternancias, itemTeste: itemTeste,
  };
})(window);
