---
# Aceito, ainda fora dos anais. Quando sair: `status: published`, a `url` do
# artigo na SBC OpenLib e `date` com a data dos anais.
title: 'HTN Method Selection Guided by Multi-Objective Reinforcement Learning and Dynamic Preferences'
date: 2026-11-12
summary: Aceito na trilha de pós-graduação do ERAMIA-RS 2026. O HTN mantém o agente dentro do que o domínio permite, e uma política de aprendizado por reforço multiobjetivo, condicionada a preferências, escolhe entre os métodos válidos conforme as prioridades do momento. O artigo traz a formulação e o protocolo de avaliação, e ainda nenhum resultado experimental.
tracks: [research]
tags: [tomada-de-decisao, planejamento, aprendizado-por-reforco]
translationOf: eramia-rs
venue:
  name: ERAMIA-RS 2026
  full: II Escola Regional de Aprendizado de Máquina e Inteligência Artificial da Região Sul (SBC)
  status: accepted
  # url: https://sol.sbc.org.br/index.php/eramiars/article/view/<id>
pdf: /papers/eramia-rs.pdf
---

Anderson G. A. C. Filho, Anderson R. Tavares e Lucas N. Alegre, Instituto de Informática, UFRGS.
Quatro páginas, em inglês. A [versão final está aqui em PDF](/papers/eramia-rs.pdf).

## Resumo

Tradução do resumo do artigo.

Este trabalho propõe um arcabouço híbrido em que a seleção de métodos de uma rede hierárquica de
tarefas (HTN) é modelada como uma decisão hierárquica estendida no tempo, o que permite ao método
selecionado receber crédito segundo múltiplos objetivos, cada um definido por uma função de
recompensa diferente. O objetivo é investigar se a integração de planejamento simbólico e
aprendizado por reforço multiobjetivo pode produzir agentes adaptativos preservando a
interpretabilidade, o controle do designer e restrições semânticas explícitas. A avaliação
planejada compara a abordagem proposta com estratégias tradicionais de seleção de métodos em HTN e
com baselines de aprendizado por reforço escalar, considerando adaptação a diferentes
preferências, generalização, validade semântica e custo de inferência.

## Um exemplo pequeno

Uma decisão com dois objetivos, progresso e sobrevivência, e dois métodos aplicáveis com retornos
estimados de [0,8; 0,2] para m1 e [0,5; 0,5] para m2. Com os pesos [0,8; 0,2] o agente escolhe m1.
Mudando os pesos para [0,2; 0,8], ele escolhe m2. O domínio HTN é o mesmo nos dois casos.

## Em que pé está

O artigo descreve o método e como ele vai ser avaliado. Os experimentos vêm agora, num ambiente
controlado com cara de jogo, contra a seleção HTN por primeiro aplicável e por heurística e contra
duas baselines de RL escalar. A [página de pesquisa](/pt/research) tem a explicação mais longa e o
pôster.
