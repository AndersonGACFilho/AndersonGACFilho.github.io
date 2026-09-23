import cache from '../data/github-cache.json';

export type RepoMeta = {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  pushedAt: string;
  url: string;
};

const USER = 'AndersonGACFilho';
const API = `https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`;

let memo: Map<string, RepoMeta> | null = null;

function toMap(list: RepoMeta[]): Map<string, RepoMeta> {
  return new Map(list.map((r) => [r.name.toLowerCase(), r]));
}

/**
 * Live repo metadata at build time, with the committed cache as the fallback.
 * Unauthenticated calls are rate limited to 60/hour, so a failure here is
 * expected sometimes and must never break the build.
 */
export async function getRepoMeta(): Promise<Map<string, RepoMeta>> {
  if (memo) return memo;

  try {
    const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

    const res = await fetch(API, { headers, signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);

    const raw = (await res.json()) as any[];
    memo = toMap(
      raw.map((r) => ({
        name: r.name,
        description: r.description,
        language: r.language,
        stars: r.stargazers_count,
        pushedAt: r.pushed_at,
        url: r.html_url,
      })),
    );
    return memo;
  } catch (err) {
    console.warn(`[github] live fetch failed, using cached metadata: ${(err as Error).message}`);
    memo = toMap(cache as RepoMeta[]);
    return memo;
  }
}

/** `owner/name` or bare `name` -> metadata, if we know about it. */
export async function repoInfo(repo?: string): Promise<RepoMeta | undefined> {
  if (!repo) return undefined;
  const name = repo.includes('/') ? repo.split('/')[1] : repo;
  return (await getRepoMeta()).get(name.toLowerCase());
}

export function repoUrl(repo: string): string {
  return repo.includes('/') ? `https://github.com/${repo}` : `https://github.com/${USER}/${repo}`;
}
