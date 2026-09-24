---
title: The Invasion Reforged — AI Test Bed (not the game yet)
tagline:
  en: The AI test bed of the Unity rebuild — watch the hierarchical state machine switch live.
  pt: A bancada de teste da IA da refatoração em Unity — veja a máquina de estados hierárquica trocando ao vivo.
date: 2025-10-16
buildPath: the-invasion-reforged
ratio: 16 / 9
controls:
  en: WASD to move. Each enemy shows its current state above it.
  pt: WASD para mover. Cada inimigo mostra o estado atual acima dele.
repo: TheInvasionReforged
about:
  en: >-
    What runs here is not a level: it is the scene the enemy AI is developed
    against. A player ship, melee and ranged enemies, and a label over each one
    naming the state it is in right now, so the hierarchy is visible instead of
    inferred — out of combat splitting into idle and patrol, combat into chase
    and attack. Movement comes from strategies held as ScriptableObjects, which
    is what lets an enemy change how it moves when its state changes without
    the mover knowing any of them. The roguelite the project is aiming at, with
    its artifacts and upgrades, is not in this build.
  pt: >-
    O que roda aqui não é uma fase: é a cena contra a qual a IA dos inimigos é
    desenvolvida. Uma nave do jogador, inimigos corpo a corpo e à distância, e
    um rótulo sobre cada um dizendo em que estado ele está agora, de modo que a
    hierarquia fica visível em vez de deduzida — fora de combate se abrindo em
    ocioso e patrulha, combate em perseguir e atacar. O movimento vem de
    estratégias guardadas como ScriptableObjects, o que permite ao inimigo
    mudar de deslocamento quando muda de estado sem que o movimentador conheça
    nenhuma delas. O roguelite que o projeto persegue, com artefatos e
    upgrades, não está neste build.
live: true
demo: true
order: 5
---
