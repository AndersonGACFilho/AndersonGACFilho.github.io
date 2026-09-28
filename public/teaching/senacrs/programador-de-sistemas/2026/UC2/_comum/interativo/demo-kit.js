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

  raiz.DemoKit = { $: $, el: el, linha: linha, novoLog: novoLog, escolhas: escolhas };
})(window);
