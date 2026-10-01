#!/usr/bin/env node
/* ---------- conferência de contraste dos tokens ----------
 *
 * POR QUE EXISTE. O CI roda `astro build` e mais nada. Trocar um hex em
 * `tokens.css` é a mudança mais fácil de fazer e a mais fácil de errar: o
 * texto continua aparecendo, só que ilegível para quem enxerga pouco, e nada
 * acusa. Este script transforma a regra escrita no CLAUDE.md -- "contraste se
 * mede com número, nos dois temas" -- em saída de terminal.
 *
 * COMO LÊ OS TEMAS. `tokens.css` declara três blocos: `:root` (escuro, o
 * padrão), `:root[data-theme='light']` e `:root[data-theme='dark']`. O bloco
 * dentro de `@media (prefers-color-scheme: light)` é cópia do tema claro e
 * fica de fora de propósito: conferir duas vezes o mesmo par só dobraria a
 * saída. Se os dois divergirem, quem acusa é a conferência de cópia no fim.
 *
 * O QUE CONFERE. A tabela `PARES`, abaixo, é a lista de combinações que o
 * site realmente pinta na tela -- não todas as combinações possíveis. Cada
 * linha diz o piso e por quê. Par novo na interface pede linha nova aqui.
 *
 * Uso:  npm run check:contrast
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ARQUIVO = path.join(RAIZ, 'src', 'styles', 'tokens.css');

/* ---------- cor ---------- */

/** #rgb e #rrggbb viram [r, g, b] em 0..255. */
function hexParaRgb(hex) {
  const limpo = hex.trim().replace('#', '');
  const cheio = limpo.length === 3 ? [...limpo].map((c) => c + c).join('') : limpo;
  if (!/^[0-9a-f]{6}$/i.test(cheio)) return null;
  return [0, 2, 4].map((i) => parseInt(cheio.slice(i, i + 2), 16));
}

/** Luminância relativa da WCAG 2.x. */
function luminancia([r, g, b]) {
  const canal = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

function razao(a, b) {
  const [l1, l2] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

/* ---------- leitura do CSS ---------- */

/**
 * Recorta o corpo de um seletor. Busca ingênua de chaves porque `tokens.css`
 * não aninha nada dentro dos blocos de tema -- se um dia aninhar, isto quebra
 * barulhento, que é o modo certo de quebrar.
 */
function corpoDoSeletor(css, seletor) {
  const inicio = css.indexOf(seletor);
  if (inicio === -1) return null;
  const abre = css.indexOf('{', inicio);
  const fecha = css.indexOf('}', abre);
  return abre === -1 || fecha === -1 ? null : css.slice(abre + 1, fecha);
}

/** Todas as declarações `--nome: valor;` de um bloco, como Map. */
function declaracoes(corpo) {
  const mapa = new Map();
  for (const linha of corpo.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    mapa.set(linha[1], linha[2].trim());
  }
  return mapa;
}

/**
 * Resolve um valor até chegar em RGB. Cobre as três formas que `tokens.css`
 * usa hoje: hex literal, `var(--outro)` e `color-mix(in srgb, A p%, B q%)`.
 * Qualquer outra forma devolve null, e o par some da conferência com aviso --
 * silêncio aqui seria pior do que falha.
 */
function resolver(valor, tema, profundidade = 0) {
  if (profundidade > 8 || !valor) return null;

  const direto = hexParaRgb(valor);
  if (direto) return direto;

  const ref = valor.match(/^var\(\s*(--[\w-]+)\s*\)$/);
  if (ref) return resolver(tema.get(ref[1]), tema, profundidade + 1);

  const mix = valor.match(/^color-mix\(\s*in srgb\s*,\s*(.+?)\s+(\d+)%\s*,\s*(.+?)(?:\s+(\d+)%)?\s*\)$/);
  if (mix) {
    const a = resolver(mix[1], tema, profundidade + 1);
    const b = resolver(mix[3], tema, profundidade + 1);
    if (!a || !b) return null;
    const pa = Number(mix[2]) / 100;
    const pb = mix[4] ? Number(mix[4]) / 100 : 1 - pa;
    const total = pa + pb || 1;
    // Mistura em sRGB sem gama, que é o que a especificação do color-mix
    // manda para `in srgb` -- e é por isso que o navegador e esta conta dão
    // o mesmo pixel.
    return [0, 1, 2].map((i) => Math.round((a[i] * pa + b[i] * pb) / total));
  }

  return null;
}

/* ---------- o que se exige ---------- */

/** [frente, fundo, piso, porquê] */
const PARES = [
  ['--text', '--bg', 7, 'corpo de texto: AAA, porque metade do site é leitura longa'],
  ['--text', '--bg-elev', 7, 'mesmo corpo, sobre superfície elevada'],
  ['--text', '--bg-hover', 7, 'mesmo corpo, sobre linha apontada pelo mouse'],
  ['--text-dim', '--bg', 4.5, 'resumo e intro: texto de verdade, não decoração'],
  ['--text-dim', '--bg-elev', 4.5, 'o mesmo, sobre superfície elevada'],
  ['--text-dim', '--bg-hover', 4.5, 'o mesmo, sob o mouse'],
  ['--text-faint', '--bg', 4.5, 'metadado de cartão: data, linguagem, estrelas'],
  ['--text-faint', '--bg-elev', 4.5, 'o mesmo, sobre superfície elevada'],
  ['--border-strong', '--bg', 3, 'contorno de controle: fronteira visível de botão e campo'],
  ['--border-strong', '--bg-elev', 3, 'o mesmo, sobre superfície elevada'],
  ['--fullstack', '--bg', 4.5, 'trilha vira rótulo de texto, não só filete'],
  ['--fullstack', '--bg-elev', 4.5, 'o mesmo, sobre superfície elevada'],
  ['--gamedev', '--bg', 4.5, 'trilha vira rótulo de texto, não só filete'],
  ['--gamedev', '--bg-elev', 4.5, 'o mesmo, sobre superfície elevada'],
  ['--research', '--bg', 4.5, 'trilha vira rótulo de texto, não só filete'],
  ['--research', '--bg-elev', 4.5, 'o mesmo, sobre superfície elevada'],
  ['--on-gamedev', '--gamedev', 4.5, 'texto dentro do botão preenchido'],
  // material de ensino: mesmos tokens, outro site
  ['--feito', '--bg', 4.5, 'aula concluída'],
  ['--feito', '--bg-elev', 4.5, 'aula concluída, sobre superfície elevada'],
  ['--text', '--feito-fundo', 7, 'texto dentro da faixa de concluído'],
  ['--text-dim', '--feito-fundo', 4.5, 'metadado dentro da faixa de concluído'],
  ['--erro', '--bg', 4.5, 'resposta errada no quiz'],
  ['--erro', '--bg-elev', 4.5, 'resposta errada, sobre superfície elevada'],
];

const TEMAS = [
  ['escuro', ':root {'],
  ['claro', ":root[data-theme='light']"],
];

/* ---------- execução ---------- */

const css = await readFile(ARQUIVO, 'utf8');
let falhas = 0;
let avisos = 0;

for (const [nome, seletor] of TEMAS) {
  const corpo = corpoDoSeletor(css, seletor);
  if (!corpo) {
    console.error(`ABORTADO: não achei o bloco \`${seletor}\` em tokens.css`);
    process.exit(2);
  }
  const tema = declaracoes(corpo);

  console.log(`\n  tema ${nome}`);
  for (const [frente, fundo, piso, porque] of PARES) {
    const a = resolver(tema.get(frente), tema);
    const b = resolver(tema.get(fundo), tema);
    if (!a || !b) {
      console.log(`  ?  ${frente} sobre ${fundo} — valor não resolvido`);
      avisos += 1;
      continue;
    }
    const r = razao(a, b);
    const passa = r >= piso;
    if (!passa) falhas += 1;
    const marca = passa ? '✓' : '✗';
    const medida = `${r.toFixed(2)}:1`.padStart(8);
    console.log(`  ${marca} ${medida}  (min ${piso})  ${frente} sobre ${fundo}${passa ? '' : `  — ${porque}`}`);
  }
}

/* O bloco do @media é cópia do tema claro. Divergir é fácil (são três blocos
   com os mesmos nomes) e invisível: só aparece para quem está no claro do
   sistema sem ter escolhido tema à mão. */
const doMedia = corpoDoSeletor(css, ":root:not([data-theme='dark'])");
const doClaro = corpoDoSeletor(css, ":root[data-theme='light']");
if (doMedia && doClaro) {
  const m = declaracoes(doMedia);
  const c = declaracoes(doClaro);
  const divergentes = [...c.keys()].filter((k) => m.get(k) !== c.get(k));
  if (divergentes.length) {
    falhas += 1;
    console.log(`\n  ✗ o tema claro do @media divergiu do escolhido à mão: ${divergentes.join(', ')}`);
  } else {
    console.log('\n  ✓ o tema claro do @media é cópia fiel do escolhido à mão');
  }
}

console.log('');
if (falhas) {
  console.error(`${falhas} par(es) abaixo do piso. Nada foi alterado — conserte o hex em src/styles/tokens.css.`);
  process.exit(1);
}
if (avisos) console.log(`${avisos} par(es) não conferidos (valor fora das formas conhecidas).`);
console.log('contraste: tudo acima do piso, nos dois temas.');
