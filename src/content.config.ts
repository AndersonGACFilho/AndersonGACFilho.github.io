import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

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
    // The longer story: where it came from, why it exists.
    about: z.object({ en: z.string(), pt: z.string() }).optional(),
    itch: z.string().url().optional(),
    repo: z.string().optional(),
    // Flip to true once the WebGL build is committed to webgl-builds.
    live: z.boolean().default(false),
    order: z.number().default(100),
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    summary: z.string(),
    tracks: z.array(track).default(['research']),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    // Present when the text is a paper: renders under Publications instead of Notes.
    venue: z
      .object({
        name: z.string(),                 // 'ERAMIA-RS 2026'
        full: z.string().optional(),      // nome por extenso do evento
        url: z.string().url().optional(), // anais, DOI ou pagina do artigo
        status: z.enum(['published', 'accepted', 'submitted', 'in-preparation']).default('published'),
      })
      .optional(),
    // Slug of the same article in the other language, when it exists.
    translationOf: z.string().optional(),
    pdf: z.string().optional(),
  }),
});

export const collections = { projects, games, articles };
