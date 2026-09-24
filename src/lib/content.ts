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
  // Ordered by how much the work demanded, most involved first, through the
  // `order` field of each entry. Date is kept on the entries as a record of
  // when the work happened, but it does not drive this list: the oldest
  // project is not the simplest one.
  return all.sort((a, b) => a.data.order - b.data.order);
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
