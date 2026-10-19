#!/usr/bin/env node
/* ---------- captura da capa de prévia ----------
 *
 * Gera public/og-cover.png a partir de scripts/og-cover.html, com o Chromium
 * do sistema em modo headless. Existe para a próxima troca de texto ou de
 * token não depender de editor de imagem.
 *
 * 1200×630 é contrato: o <head> do Base.astro declara essas medidas em
 * og:image:width/height e o LinkedIn descarta a prévia se não baterem. Por
 * isso o script lê o cabeçalho do PNG gerado e falha se a medida vier outra.
 *
 * Uso:  npm run render:og
 *       CHROME=/caminho/do/chrome npm run render:og
 */

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FONTE = path.join(RAIZ, 'scripts', 'og-cover.html');
const SAIDA = path.join(RAIZ, 'public', 'og-cover.png');
const LARGURA = 1200;
const ALTURA = 630;

const CANDIDATOS = [
  process.env.CHROME,
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

const chrome = CANDIDATOS.find((c) => existsSync(c));
if (!chrome) {
  console.error(`Nenhum Chromium encontrado. Tentei:\n  ${CANDIDATOS.join('\n  ')}\nAponte um com CHROME=...`);
  process.exit(1);
}

const r = spawnSync(
  chrome,
  [
    '--headless',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    // o HTML lê tokens.css e as fontes por file://, fora da própria pasta
    '--allow-file-access-from-files',
    // dá tempo de as woff2 carregarem antes da captura; sem isso sai a
    // fonte de reserva
    '--virtual-time-budget=3000',
    `--window-size=${LARGURA},${ALTURA}`,
    `--screenshot=${SAIDA}`,
    pathToFileURL(FONTE).href,
  ],
  { encoding: 'utf8' },
);
if (r.status !== 0) {
  console.error(r.stderr || r.error);
  process.exit(1);
}

// IHDR: largura e altura em big-endian nos bytes 16..23 de todo PNG
const png = readFileSync(SAIDA);
const [w, h] = [png.readUInt32BE(16), png.readUInt32BE(20)];
if (w !== LARGURA || h !== ALTURA) {
  console.error(`${path.relative(RAIZ, SAIDA)} saiu com ${w}×${h}, e o <head> declara ${LARGURA}×${ALTURA}.`);
  process.exit(1);
}
console.log(`${path.relative(RAIZ, SAIDA)}: ${w}×${h}`);
