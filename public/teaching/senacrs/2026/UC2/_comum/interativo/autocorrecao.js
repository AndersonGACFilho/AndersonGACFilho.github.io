/* autocorrecao.js — motor dos exercicios de autocorrecao da UC2.
 *
 * Uso na pagina da aula:
 *
 *   <script src="../../_comum/interativo/autocorrecao.js"></script>
 *   <script>
 *     montarExercicios('aula-01', [
 *       { secao: 'Bloco 1 — ...' },
 *       { pergunta: '...', alternativas: ['...'], certa: 1, porque: '...' },
 *     ]);
 *   </script>
 *
 * POR QUE script classico e nao modulo ES: modulo so carrega por http, e a
 * pagina precisa abrir tambem com duplo clique no arquivo, direto do pen drive
 * ou da pasta de rede. No laboratorio isso e a diferenca entre funcionar e nao
 * funcionar quando a internet cai.
 *
 * O PRODUTO E A EXPLICACAO, nao o placar. Por isso a resposta aparece assim que
 * o aluno escolhe — sem botao "corrigir" no fim — e o "por que" e exibido tanto
 * no acerto quanto no erro. Quem acertou por sorte tambem precisa ler.
 */
(function () {
  'use strict';

  function elemento(tag, classe, texto) {
    var el = document.createElement(tag);
    if (classe) el.className = classe;
    if (texto != null) el.textContent = texto;
    return el;
  }

  window.montarExercicios = function (chave, itens) {
    var alvo = document.getElementById('exercicios');
    if (!alvo) return;

    var guardado = {};
    try {
      guardado = JSON.parse(localStorage.getItem('uc2:' + chave) || '{}');
    } catch (e) {
      // modo anonimo, armazenamento bloqueado, cota cheia: segue sem retomar
      guardado = {};
    }

    var questoes = itens.filter(function (i) {
      return !i.secao;
    });
    var respondidas = {};
    var acertos = 0;

    var placar = elemento('p', 'placar');
    var barra = elemento('div', 'barra');
    var preenchida = elemento('div', 'barra-cheia');
    barra.appendChild(preenchida);

    function atualizarPlacar() {
      var n = Object.keys(respondidas).length;
      placar.textContent =
        n === 0
          ? questoes.length + ' questões'
          : n + ' de ' + questoes.length + ' respondidas · ' + acertos + ' de primeira';
      preenchida.style.width = (n / questoes.length) * 100 + '%';
    }

    function salvar() {
      try {
        localStorage.setItem('uc2:' + chave, JSON.stringify(guardado));
      } catch (e) {
        /* sem armazenamento: a pagina continua funcionando, so nao retoma */
      }
    }

    var indice = 0;

    itens.forEach(function (item) {
      if (item.secao) {
        alvo.appendChild(elemento('h2', null, item.secao));
        if (item.intro) alvo.appendChild(elemento('p', 'intro', item.intro));
        return;
      }

      var n = indice++;
      var bloco = elemento('section', 'questao');
      var campo = elemento('fieldset');
      var legenda = elemento('legend');
      legenda.appendChild(elemento('span', 'numero', String(n + 1)));
      legenda.appendChild(elemento('span', 'enunciado', item.pergunta));
      campo.appendChild(legenda);

      var porque = elemento('div', 'porque');
      var veredito = elemento('p', 'veredito');
      var texto = elemento('p', 'texto');
      texto.textContent = item.porque;
      porque.appendChild(veredito);
      porque.appendChild(texto);
      porque.hidden = true;

      var botoes = [];

      function revelar(escolha, deRetomada) {
        var certo = escolha === item.certa;
        botoes.forEach(function (b, i) {
          b.disabled = true;
          b.classList.remove('escolhida');
          if (i === item.certa) b.classList.add('certa');
          if (i === escolha && !certo) b.classList.add('errada');
          if (i === escolha) b.classList.add('escolhida');
        });
        veredito.textContent = certo ? 'Isso mesmo.' : 'Não é essa.';
        porque.className = 'porque ' + (certo ? 'acertou' : 'errou');
        porque.hidden = false;

        if (!respondidas[n]) {
          respondidas[n] = true;
          if (certo && !deRetomada) acertos++;
          if (certo && deRetomada && guardado[n] && guardado[n].primeira) acertos++;
        }
        atualizarPlacar();
      }

      item.alternativas.forEach(function (alt, i) {
        var b = elemento('button', 'alternativa');
        b.type = 'button';
        b.appendChild(elemento('span', 'letra', 'abcdef'[i]));
        b.appendChild(elemento('span', null, alt));
        b.addEventListener('click', function () {
          guardado[n] = { escolha: i, primeira: i === item.certa };
          salvar();
          revelar(i, false);
        });
        botoes.push(b);
        campo.appendChild(b);
      });

      var refazer = elemento('button', 'refazer', 'Tentar de novo');
      refazer.type = 'button';
      refazer.hidden = true;
      refazer.addEventListener('click', function () {
        botoes.forEach(function (b) {
          b.disabled = false;
          b.classList.remove('certa', 'errada', 'escolhida');
        });
        porque.hidden = true;
        refazer.hidden = true;
      });
      porque.appendChild(refazer);

      bloco.appendChild(campo);
      bloco.appendChild(porque);
      alvo.appendChild(bloco);

      if (guardado[n] && typeof guardado[n].escolha === 'number') {
        revelar(guardado[n].escolha, true);
        refazer.hidden = false;
      }

      botoes.forEach(function (b) {
        b.addEventListener('click', function () {
          refazer.hidden = false;
        });
      });
    });

    var topo = document.getElementById('progresso');
    if (topo) {
      topo.appendChild(placar);
      topo.appendChild(barra);
    }
    atualizarPlacar();

    var limpar = document.getElementById('recomecar');
    if (limpar) {
      limpar.addEventListener('click', function () {
        try {
          localStorage.removeItem('uc2:' + chave);
        } catch (e) {
          /* idem */
        }
        location.reload();
      });
    }
  };
})();
