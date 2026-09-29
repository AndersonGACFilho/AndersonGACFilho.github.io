import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

/** Publications for one language, newest first, drafts dropped from the build. */
export async function getPublications(lang: Lang): Promise<CollectionEntry<'publications'>[]> {
  const all = await getCollection('publications', ({ id, data }) => id.startsWith(`${lang}/`) && !data.draft);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function publicationSlug(entry: CollectionEntry<'publications'>): string {
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

/**
 * The game shown on the home page. A game marked `featured` wins outright;
 * that choice is deliberate and belongs to whoever writes the entry. Without
 * one, fall back to the most recent finished build, skipping test beds and
 * demos so the front door does not open on a scene built to debug an AI.
 */
export async function getFeaturedGame(): Promise<CollectionEntry<'games'> | undefined> {
  const games = await getGames();
  const byNewest = [...games].sort(
    (a, b) => (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0),
  );
  return (
    byNewest.find((g) => g.data.featured && g.data.live) ??
    byNewest.find((g) => g.data.live && !g.data.demo) ??
    byNewest.find((g) => g.data.live) ??
    games[0]
  );
}

/**
 * Where the course material lives — now inside this site, under `public/`.
 *
 * It used to point at a separate `aulas-programador-de-sistemas` repo. The
 * decks, the interactive pages and the submission forms are now published
 * straight into `public/teaching/<school>/<course>/<year>/` by the courseware
 * repo, so the link is internal and never goes stale on a rename.
 *
 * O nível do CURSO existe no caminho porque o Senac abre mais de um, e
 * `senacrs/2026` ficaria ambíguo no dia em que abrir.
 */
export const SLIDES_URL = '/teaching/senacrs/programador-de-sistemas/2026/';

/**
 * Path of the text that really is this one's translation, or undefined when
 * it has none. Separate from `publicationAltPath` because hreflang needs the truth:
 * declaring the section index as a translation breaks the reciprocity Google
 * requires, and it then ignores the whole cluster.
 */
export async function publicationTwinPath(
  entry: CollectionEntry<'publications'>,
  lang: Lang,
): Promise<string | undefined> {
  const other: Lang = lang === 'en' ? 'pt' : 'en';
  const wanted = entry.data.translationOf ?? publicationSlug(entry);
  const twin = (await getPublications(other)).find(
    (candidate) => publicationSlug(candidate) === wanted,
  );
  return twin ? `/${other === 'en' ? '' : 'pt/'}publications/${publicationSlug(twin)}` : undefined;
}

/**
 * Path of the same text in the other language, falling back to the section
 * root so the language switch never lands on a 404.
 */
export async function publicationAltPath(
  entry: CollectionEntry<'publications'>,
  lang: Lang,
): Promise<string> {
  return (
    (await publicationTwinPath(entry, lang)) ??
    (lang === 'en' ? '/pt/publications' : '/publications')
  );
}
