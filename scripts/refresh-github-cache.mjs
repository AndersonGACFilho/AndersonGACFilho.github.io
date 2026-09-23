#!/usr/bin/env node
// Refreshes the committed fallback used when the GitHub API is unreachable at build time.
import { writeFile } from 'node:fs/promises';

const USER = 'AndersonGACFilho';
const res = await fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`, {
  headers: {
    Accept: 'application/vnd.github+json',
    ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
  },
});
if (!res.ok) {
  console.error(`GitHub API returned ${res.status}`);
  process.exit(1);
}

const repos = (await res.json()).map((r) => ({
  name: r.name,
  description: r.description,
  language: r.language,
  stars: r.stargazers_count,
  pushedAt: r.pushed_at,
  url: r.html_url,
}));

await writeFile(new URL('../src/data/github-cache.json', import.meta.url), JSON.stringify(repos, null, 2) + '\n');
console.log(`Cached ${repos.length} repositories.`);
