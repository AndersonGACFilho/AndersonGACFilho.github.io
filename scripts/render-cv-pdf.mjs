#!/usr/bin/env node
/* ---------- o currículo em PDF ----------
 *
 * Gera em public/files/ um PDF por língua e por foco do /cv, imprimindo a
 * própria página com o Chromium do sistema. Recrutador pede arquivo; assim o
 * arquivo sai do mesmo texto que a página, sem uma segunda fonte para manter.
 *
 * Imprime o `dist/` já construído, servido aqui mesmo por HTTP: a página pede
 * fontes e CSS por caminho absoluto (/fonts/...), que por file:// não resolve.
 * O foco entra pelo hash (/cv/#gamedev), o mesmo deep-link de candidatura.
 *
 * Os nomes dos arquivos são os que o `CvPage.astro` linka, em `pdfHref`.
 * Trocou aqui, troca lá.
 *
 * Uso:  npm run render:cv            (constrói e imprime)
 *       CHROME=/caminho/do/chrome npm run render:cv
 */

import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(RAIZ, 'dist');
const SAIDA = path.join(RAIZ, 'public', 'files');

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
if (!existsSync(path.join(DIST, 'cv', 'index.html'))) {
  console.error('Não há dist/cv/index.html. Rode `npm run build` antes.');
  process.exit(1);
}

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

// Servidor estático mínimo, só para o Chromium desta execução.
const servidor = createServer((req, res) => {
  let arquivo = path.join(DIST, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!arquivo.startsWith(DIST)) return res.writeHead(403).end();
  if (existsSync(arquivo) && statSync(arquivo).isDirectory()) arquivo = path.join(arquivo, 'index.html');
  if (!existsSync(arquivo)) return res.writeHead(404).end();
  res.writeHead(200, { 'Content-Type': TIPOS[path.extname(arquivo)] ?? 'application/octet-stream' });
  res.end(readFileSync(arquivo));
});
await new Promise((ok) => servidor.listen(0, '127.0.0.1', ok));
const origem = `http://127.0.0.1:${servidor.address().port}`;

mkdirSync(SAIDA, { recursive: true });
let falhou = false;

for (const lang of ['en', 'pt']) {
  for (const foco of ['all', 'gamedev', 'fullstack']) {
    const nome = `anderson-goncalves-cv${foco === 'all' ? '' : `-${foco}`}${lang === 'pt' ? '-pt' : ''}.pdf`;
    const url = `${origem}${lang === 'pt' ? '/pt' : ''}/cv/${foco === 'all' ? '' : `#${foco}`}`;
    // spawnSync travaria o laço de eventos e, com ele, o servidor que o
    // Chromium está consultando; por isso o processo roda assíncrono.
    const status = await new Promise((ok) => {
      const p = spawn(chrome, [
        '--headless',
        '--disable-gpu',
        '--no-pdf-header-footer',
        // dá tempo de as woff2 carregarem e de o script aplicar o foco
        '--virtual-time-budget=4000',
        `--print-to-pdf=${path.join(SAIDA, nome)}`,
        url,
      ], { stdio: ['ignore', 'ignore', 'pipe'] });
      let erro = '';
      p.stderr.on('data', (d) => { erro += d; });
      p.on('close', (code) => ok({ code, erro }));
    });
    if (status.code !== 0) {
      console.error(`${nome}: ${status.erro}`);
      falhou = true;
    } else {
      console.log(`public/files/${nome}`);
    }
  }
}

servidor.close();
process.exit(falhou ? 1 : 0);
