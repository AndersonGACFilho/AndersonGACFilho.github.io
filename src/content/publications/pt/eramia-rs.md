---
# Nos anais. `date` é o primeiro dia do evento (9 a 11 de novembro de 2026,
# Porto Alegre). Páginas 13 a 16 dos anais, na SBC OpenLib.
title: 'HTN Method Selection Guided by Multi-Objective Reinforcement Learning and Dynamic Preferences'
date: 2026-11-09
summary: Artigo de quatro páginas na trilha de pós-graduação do ERAMIA-RS 2026, e a primeira versão deste trabalho. O HTN mantém o agente dentro do que o domínio permite, e uma política de aprendizado por reforço multiobjetivo, condicionada a preferências, escolhe entre os métodos válidos conforme as prioridades do momento. Ele traz a formulação e o protocolo de avaliação. Os experimentos, e o artigo completo, ficam para 2027.
tracks: [research]
tags: [tomada-de-decisao, planejamento, aprendizado-por-reforco]
translationOf: eramia-rs
venue:
  name: ERAMIA-RS 2026
  full: II Escola Regional de Aprendizado de Máquina e Inteligência Artificial da Região Sul (SBC)
  status: published
  url: https://sol.sbc.org.br/index.php/eramiars/article/view/47322
pdf: /papers/eramia-rs.pdf
---

Anderson G. A. C. Filho (o nome com que assino artigos), Anderson R. Tavares e Lucas N. Alegre,
Instituto de Informática, UFRGS. Quatro páginas, em inglês. A [versão dos anais está aqui em
PDF](/papers/eramia-rs.pdf), e o [pôster da ECOA 2026](/research/poster-htn-morl.pdf) também.

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
Mudando os pesos para [0,2; 0,8], ele escolhe m2. O domínio HTN é o mesmo nos dois casos. Os números
foram inventados para mostrar o mecanismo; nenhum experimento os produziu ainda.

## Em que pé está

Esta é a primeira versão do trabalho. Ela descreve o método e como ele vai ser avaliado, e para aí.
Os experimentos vêm agora, num ambiente controlado com cara de jogo, contra a seleção HTN por
primeiro aplicável e por heurística e contra duas baselines de RL escalar. Com os resultados na mão,
o artigo completo vai para uma conferência em 2027. A [página de pesquisa](/pt/research) tem a
explicação mais longa e o pôster.

## Como citar

```bibtex
@inproceedings{filho2026htn,
  author    = {Anderson G. A. C. Filho and Anderson R. Tavares and Lucas N. Alegre},
  title     = {{HTN} Method Selection Guided by Multi-Objective Reinforcement Learning and Dynamic Preferences},
  booktitle = {Anais da II Escola Regional de Aprendizado de M{\'a}quina e Intelig{\^e}ncia Artificial da Regi{\~a}o Sul (ERAMIA-RS)},
  address   = {Porto Alegre, RS},
  publisher = {SBC},
  year      = {2026},
  pages     = {13--16},
  doi       = {10.5753/eramiars.2026.35023},
}
```
