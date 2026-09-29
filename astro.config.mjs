// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const SITE = 'https://andersongacfilho.github.io';

/**
 * As páginas do material de ensino, para o sitemap.
 *
 * POR QUE existe: o `@astrojs/sitemap` lista só as rotas que o Astro constrói a
 * partir de `src/pages`. O material da UC vem pronto do repositório das aulas e
 * é copiado para `public/`, então o Astro nunca o vê — e o sitemap saía com 32
 * URLs sem uma única aula dentro. Os 19 decks, as páginas interativas, os
 * quizzes e a própria página do curso ficavam fora do índice do Google, que é
 * como aluno e colega encontram o material.
 *
 * Varre o disco em vez de manter uma lista: publicar uma aula nova não pode
 * depender de alguém lembrar de editar este arquivo.
 */
function paginasDoMaterial(raiz = 'public/teaching') {
  if (!existsSync(raiz)) return []; // clone sem material publicado ainda

  const achados = [];
  for (const entrada of readdirSync(raiz, { withFileTypes: true, recursive: true })) {
    if (!entrada.isFile() || !entrada.name.endsWith('.html')) continue;

    const pasta = entrada.parentPath ?? entrada.path;
    const caminho = join(relative('public', pasta), entrada.name);

    // `_comum/` guarda o que as aulas compartilham — o catálogo de ícones é
    // ferramenta de autoria, não material de aluno, e não entra no índice.
    if (caminho.includes('/_comum/')) continue;

    // O GitHub Pages serve `caminho/index.html` em `caminho/`. Indexar as duas
    // formas seria conteúdo duplicado para o Google.
    achados.push(SITE + '/' + caminho.replace(/(^|\/)index\.html$/, '$1'));
  }
  return achados.sort();
}

/**
 * A seção mudou de `/articles/` para `/publications/`.
 *
 * As duas URLs antigas estavam no sitemap já enviado ao Search Console, e o
 * GitHub Pages não define cabeçalho de resposta — não há 301 possível aqui.
 * O que dá é a página que o Astro gera no lugar: `<meta http-equiv="refresh">`
 * mais um `<link rel="canonical">` apontando para o destino. Não é um 301,
 * mas o Google trata refresh instantâneo como redirecionamento e transfere o
 * sinal da URL antiga.
 *
 * Nenhuma rota de artigo individual entra aqui porque nunca existiu: todo o
 * conteúdo da coleção está como `draft`, então o build nunca emitiu um slug.
 *
 * O destino leva barra final porque o `canonical` da página de destino leva —
 * e para o Google `/publications` e `/publications/` são duas URLs. Sem a
 * barra, o canonical desta página apontaria para uma terceira URL que só
 * redireciona de novo.
 */
const ROTAS_ANTIGAS = {
  '/articles': '/publications/',
  '/pt/articles': '/pt/publications/',
};

export default defineConfig({
  site: SITE,
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt'],
    routing: { prefixDefaultLocale: false },
  },
  redirects: ROTAS_ANTIGAS,
  integrations: [
    sitemap({
      customPages: paginasDoMaterial(),
      // Uma página de redirecionamento não é conteúdo: no índice ela competiria
      // com o destino pelo mesmo texto. Ela existe só para quem chegar pelo
      // link velho.
      filter: (url) => !Object.keys(ROTAS_ANTIGAS).some((antiga) => url.endsWith(`${antiga}/`)),
    }),
  ],
});
