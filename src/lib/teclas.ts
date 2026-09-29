/**
 * As teclas que o overlay de toque sabe sintetizar.
 *
 * POR QUE UMA TABELA E NÃO O NOME SOLTO: para a Unity acreditar num evento de
 * teclado ela precisa de `key`, `code` e `keyCode` coerentes entre si. O
 * `keyCode` está obsoleto há anos e não entra pelo construtor do
 * `KeyboardEvent` — mas o build lê ele mesmo assim, então tem que ser enxertado
 * no evento depois. Deixar esses três campos a cargo de quem escreve o `.md` de
 * um jogo seria pedir para errar em silêncio: um `keyCode` trocado não quebra
 * nada visível, só faz o botão não responder.
 *
 * Aqui quem escreve o conteúdo diz `Space`, e o resto é problema deste arquivo.
 * Os nomes são os valores de `code` do padrão, que é o que aparece na
 * documentação de qualquer engine.
 */
export const TECLAS = {
  ArrowUp: { key: 'ArrowUp', code: 'ArrowUp', keyCode: 38 },
  ArrowDown: { key: 'ArrowDown', code: 'ArrowDown', keyCode: 40 },
  ArrowLeft: { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37 },
  ArrowRight: { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
  KeyW: { key: 'w', code: 'KeyW', keyCode: 87 },
  KeyA: { key: 'a', code: 'KeyA', keyCode: 65 },
  KeyS: { key: 's', code: 'KeyS', keyCode: 83 },
  KeyD: { key: 'd', code: 'KeyD', keyCode: 68 },
  KeyE: { key: 'e', code: 'KeyE', keyCode: 69 },
  KeyQ: { key: 'q', code: 'KeyQ', keyCode: 81 },
  KeyF: { key: 'f', code: 'KeyF', keyCode: 70 },
  KeyR: { key: 'r', code: 'KeyR', keyCode: 82 },
  KeyZ: { key: 'z', code: 'KeyZ', keyCode: 90 },
  KeyX: { key: 'x', code: 'KeyX', keyCode: 88 },
  KeyC: { key: 'c', code: 'KeyC', keyCode: 67 },
  Space: { key: ' ', code: 'Space', keyCode: 32 },
  Enter: { key: 'Enter', code: 'Enter', keyCode: 13 },
  Escape: { key: 'Escape', code: 'Escape', keyCode: 27 },
  ShiftLeft: { key: 'Shift', code: 'ShiftLeft', keyCode: 16 },
  ControlLeft: { key: 'Control', code: 'ControlLeft', keyCode: 17 },
} as const;

export type NomeDeTecla = keyof typeof TECLAS;

/** Tupla para o `z.enum` do schema: um nome de tecla errado falha no build. */
export const NOMES_DE_TECLA = Object.keys(TECLAS) as [NomeDeTecla, ...NomeDeTecla[]];

/**
 * Os dois direcionais que os jogos daqui usam. É um apelido, não uma limitação:
 * um jogo com direcional esquisito declara os botões um a um.
 */
export const DIRECIONAIS = {
  setas: { cima: 'ArrowUp', baixo: 'ArrowDown', esquerda: 'ArrowLeft', direita: 'ArrowRight' },
  wasd: { cima: 'KeyW', baixo: 'KeyS', esquerda: 'KeyA', direita: 'KeyD' },
} as const satisfies Record<string, Record<'cima' | 'baixo' | 'esquerda' | 'direita', NomeDeTecla>>;

export type NomeDeDirecional = keyof typeof DIRECIONAIS;
export const NOMES_DE_DIRECIONAL = Object.keys(DIRECIONAIS) as [
  NomeDeDirecional,
  ...NomeDeDirecional[],
];
