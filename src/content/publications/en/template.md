---
title: Article template
date: 2026-09-23
summary: Copy this file, change the frontmatter and write. Keep draft:true until it is ready to be public.
tracks: [research]
tags: [template]
draft: true
translationOf: template
---

Anything below the frontmatter is the article body, in Markdown.

## Why draft matters

`draft: true` keeps the file out of the built site, out of the article list and out of
the sitemap. It does **not** hide the text from the repository — this repo is public, so a
draft here is readable by anyone who opens the Git history. Keep genuinely unpublished
writing outside the repo until you are ready.

## Translation pairing

Set `translationOf` to the same slug in `src/content/articles/pt/`, and the language switch
will land on the translated article instead of the section root.
