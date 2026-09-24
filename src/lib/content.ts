import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

/** Articles for one language, newest first, drafts dropped from the build. */
export async function getArticles(lang: Lang): Promise<CollectionEntry<'articles'>[]> {
  const all = await getCollection('articles', ({ id, data }) => id.startsWith(`${lang}/`) && !data.draft);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function articleSlug(entry: CollectionEntry<'articles'>): string {
  return entry.id.replace(/^(en|pt)\//, '');
}

export async function getProjects(): Promise<CollectionEntry<'projects'>[]> {
  const all = await getCollection('projects');
  return all.sort((a, b) => a.data.order - b.data.order);
}

export async function getGames(): Promise<CollectionEntry<'games'>[]> {
  const all = await getCollection('games');
  // Newest first. Entries without a date fall to the end, where `order`
  // still decides between them.
  return all.sort((a, b) => {
    const da = a.data.date?.getTime();
    const db = b.data.date?.getTime();
    if (da !== undefined && db !== undefined && da !== db) return db - da;
    if (da === undefined && db !== undefined) return 1;
    if (db === undefined && da !== undefined) return -1;
    return a.data.order - b.data.order;
  });
}

/** The game shown on the home page: the first one actually playable, else the first listed. */
export async function getFeaturedGame(): Promise<CollectionEntry<'games'> | undefined> {
  const games = await getGames();
  return games.find((g) => g.data.live) ?? games[0];
}

/** Where the published Marp decks live. */
export const SLIDES_URL = 'https://andersongacfilho.github.io/aulas-programador-de-sistemas/';

/**
 * Path of the same article in the other language, falling back to the section
 * root so the language switch never lands on a 404.
 */
export async function articleAltPath(entry: CollectionEntry<'articles'>, lang: Lang): Promise<string> {
  const other: Lang = lang === 'en' ? 'pt' : 'en';
  const wanted = entry.data.translationOf ?? articleSlug(entry);
  const twin = (await getArticles(other)).find((candidate) => articleSlug(candidate) === wanted);
  return twin ? `/${other === 'en' ? '' : 'pt/'}articles/${articleSlug(twin)}` : other === 'en' ? '/articles' : '/pt/articles';
}
