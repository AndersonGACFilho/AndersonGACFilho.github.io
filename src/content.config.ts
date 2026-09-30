import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { NOMES_DE_TECLA, NOMES_DE_DIRECIONAL } from './lib/teclas';

const track = z.enum(['fullstack', 'gamedev', 'research']);

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tracks: z.array(track).min(1),
    // Short pitch, one line each. The English one doubles as the fallback.
    summary: z.object({ en: z.string(), pt: z.string() }),
    repo: z.string().optional(),      // owner/name on GitHub
    itch: z.string().url().optional(),
    play: z.string().optional(),      // slug of a game in src/content/games
    detail: z.string().optional(),    // root-relative page with the long version, e.g. /research
    tech: z.array(z.string()).default([]),
    cover: z.string().optional(),   // /covers/<file>, optional
    year: z.number().optional(),
    status: z.enum(['planned', 'wip']).optional(),  // omit for finished work
    featured: z.boolean().default(false),
    private: z.boolean().default(false),
    order: z.number().default(100),
  }),
});

const games = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/games' }),
  schema: z.object({
    title: z.string(),
    tagline: z.object({ en: z.string(), pt: z.string() }),
    // Folder inside the webgl-builds repo, served from the same origin.
    buildPath: z.string(),
    ratio: z.string().default('16 / 9'),
    // When the work happened. Drives the ordering on the games page,
    // newest first; `order` only breaks ties.
    date: z.coerce.date().optional(),
    cover: z.string().optional(),   // shown before the build loads
    controls: z.object({ en: z.string(), pt: z.string() }).optional(),
    /*
     * O controle na tela para quem abre no celular. OPT-IN DE PROPÓSITO: um
     * direcional só serve a jogo que anda por teclado. Dos builds daqui, os
     * que miram com o mouse não ganham nada com um D-pad — dar um a eles
     * seria prometer que dá para jogar e entregar metade. Jogo sem este
     * campo não recebe overlay nenhum.
     */
    touch: z
      .object({
        // Cruz de quatro botoes, para quem anda nos dois eixos.
        direcional: z.enum(NOMES_DE_DIRECIONAL).optional(),
        // Trilho vertical de duas metades, para quem so sobe e desce. Usa
        // `cima` e `baixo` do mesmo preset; `esquerda` e `direita` ficam de
        // fora porque o jogo nao tem para onde ir de lado.
        deslizante: z.enum(NOMES_DE_DIRECIONAL).optional(),
        // Três é o que cabe na largura de um polegar sem encostar um no outro.
        botoes: z
          .array(
            z.object({
              rotulo: z.object({ en: z.string(), pt: z.string() }),
              tecla: z.enum(NOMES_DE_TECLA),
            }),
          )
          .max(3)
          .default([]),
      })
      .optional(),
    // The longer story: where it came from, why it exists.
    about: z.object({ en: z.string(), pt: z.string() }).optional(),
    itch: z.string().url().optional(),
    repo: z.string().optional(),
    // Flip to true once the WebGL build is committed to webgl-builds.
    live: z.boolean().default(false),
    // The build is a test bed or demo, not the finished game. Kept out
    // of the home page showcase so the front door shows finished work.
    demo: z.boolean().default(false),
    // Pins this game to the home page. An explicit choice beats inferring
    // one from dates, which in practice came down to a single day between
    // two very different projects.
    featured: z.boolean().default(false),
    order: z.number().default(100),
  }),
});

const publications = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/publications' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    summary: z.string(),
    tracks: z.array(track).default(['research']),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    // Presente quando o texto é um paper, ausente quando é nota. A lista da
    // página é única, então isto não separa mais seções: só faz o cartão
    // mostrar onde saiu e linkar os anais.
    venue: z
      .object({
        name: z.string(),                 // 'ERAMIA-RS 2026'
        full: z.string().optional(),      // nome por extenso do evento
        url: z.string().url().optional(), // anais, DOI ou pagina do artigo
        status: z.enum(['published', 'accepted', 'submitted', 'in-preparation']).default('published'),
      })
      .optional(),
    // Slug of the same text in the other language, when it exists.
    translationOf: z.string().optional(),
    pdf: z.string().optional(),
  }),
});

export const collections = { projects, games, publications };
