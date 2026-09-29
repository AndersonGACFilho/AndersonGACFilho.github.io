---
title: Modelo de artigo
date: 2026-09-23
summary: Copie este arquivo, troque o frontmatter e escreva. Mantenha draft:true até estar pronto para ir a público.
tracks: [research]
tags: [modelo]
draft: true
translationOf: template
---

Tudo abaixo do frontmatter é o corpo do artigo, em Markdown.

## Por que o draft importa

`draft: true` mantém o arquivo fora do site publicado, fora da lista de artigos e fora do
sitemap. Ele **não** esconde o texto do repositório — este repo é público, então um rascunho
aqui é legível por qualquer um que abra o histórico do Git. Texto realmente inédito fica
fora do repositório até a hora de publicar.

## Par de tradução

Aponte `translationOf` para o mesmo slug em `src/content/articles/en/`, e o seletor de
idioma cai no artigo traduzido em vez da raiz da seção.
